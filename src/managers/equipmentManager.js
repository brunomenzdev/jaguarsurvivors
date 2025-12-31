import { CONFIG } from '../config/config.js';

/**
 * EquipmentManager
 * Tracks player's equipped weapons and items with configurable limits
 * Implements roguelike equipment progression system
 */
export class EquipmentManager {
    constructor(scene) {
        this.scene = scene;

        // Equipment limits from config (Now strictly 2 for weapons)
        this.maxWeapons = CONFIG.equipmentLimits?.maxWeapons || 2;
        this.maxItems = CONFIG.equipmentLimits?.maxItems || 6;

        // Slot-based tracking for weapons
        this.weaponSlots = {
            primary: null,
            secondary: null
        };

        // Tracking for other equipment
        this.equippedItems = []; // Array of { id, level } objects
        this.weaponLevels = {}; // { weaponKey: level }
    }

    /**
     * Getter for backward compatibility and easy iteration
     * Returns array of equipped weapon keys
     */
    get equippedWeapons() {
        return Object.values(this.weaponSlots).filter(key => key !== null);
    }

    /**
     * Initialize with starting weapon from character config
     */
    init(startingWeaponKey) {
        if (startingWeaponKey) {
            // Starting weapon always goes to primary slot
            this.addWeapon(startingWeaponKey);
        }
    }

    isPrimarySlotEmpty() {
        return this.weaponSlots.primary === null;
    }

    isSecondarySlotEmpty() {
        return this.weaponSlots.secondary === null;
    }

    canAddWeapon(slotType = null) {
        if (slotType === 'primary') return this.isPrimarySlotEmpty();
        if (slotType === 'secondary') return this.isSecondarySlotEmpty();

        // If no slot specified, can we add ANY weapon?
        return this.isPrimarySlotEmpty() || this.isSecondarySlotEmpty();
    }

    canAddItem() {
        return this.equippedItems.length < this.maxItems;
    }

    hasWeapon(key) {
        return this.weaponSlots.primary === key || this.weaponSlots.secondary === key;
    }

    hasItem(id) {
        return this.equippedItems.some(item => item.id === id);
    }

    getWeaponLevel(key) {
        return this.weaponLevels[key] || 0;
    }

    getItemLevel(id) {
        const item = this.equippedItems.find(i => i.id === id);
        return item?.level || 0;
    }

    // =============== ADD METHODS ===============
    addWeapon(key) {
        const weaponConfig = CONFIG.weapon.find(w => w.key === key);
        if (!weaponConfig) {
            console.warn(`[EquipmentManager] Weapon config not found for ${key}`);
            return false;
        }

        const slot = weaponConfig.slotType || 'primary'; // Fallback to primary if not specified

        if (this.weaponSlots[slot] !== null) {
            console.warn(`[EquipmentManager] Cannot add weapon ${key} - slot ${slot} full`);
            return false;
        }

        if (this.hasWeapon(key)) {
            console.warn(`[EquipmentManager] Weapon ${key} already equipped`);
            return false;
        }

        // Assigned based on config
        this.weaponSlots[slot] = key;
        const slotAssigned = slot;

        this.weaponLevels[key] = 1;

        console.debug("EVENT_EMITTED", {
            eventName: 'weapon-equipped',
            payload: { key, slot: slotAssigned }
        });

        // Emit with key for backward compatibility, but we could also send slot
        this.scene.events.emit('weapon-equipped', key, slotAssigned);

        return true;
    }

    addItem(id) {
        if (!this.canAddItem()) {
            console.warn(`[EquipmentManager] Cannot add item ${id} - at max limit (${this.maxItems})`);
            return false;
        }

        if (this.hasItem(id)) {
            console.warn(`[EquipmentManager] Item ${id} already equipped`);
            return false;
        }

        this.equippedItems.push({ id, level: 1 });

        console.debug("EVENT_EMITTED", { eventName: 'item-equipped', payload: id });
        this.scene.events.emit('item-equipped', id);

        return true;
    }

    // =============== LEVEL UP METHODS ===============

    levelUpWeapon(key) {
        if (!this.hasWeapon(key)) {
            console.warn(`[EquipmentManager] Cannot level up weapon ${key} - not equipped`);
            return false;
        }

        this.weaponLevels[key]++;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-leveled', payload: { key, level: this.weaponLevels[key] } });
        this.scene.events.emit('weapon-leveled', key, this.weaponLevels[key]);

        return true;
    }

    levelUpItem(id) {
        const item = this.equippedItems.find(i => i.id === id);

        if (!item) {
            console.warn(`[EquipmentManager] Cannot level up item ${id} - not equipped`);
            return false;
        }

        item.level++;

        console.debug("EVENT_EMITTED", { eventName: 'item-leveled', payload: { id, level: item.level } });
        this.scene.events.emit('item-leveled', id, item.level);

        return true;
    }

    // =============== UTILITY METHODS ===============

    /**
     * Get summary of current equipment
     */
    getSummary() {
        return {
            weapons: this.equippedWeapons.length,
            maxWeapons: this.maxWeapons,
            primarySlot: this.weaponSlots.primary,
            secondarySlot: this.weaponSlots.secondary,
            items: this.equippedItems.length,
            maxItems: this.maxItems,
            weaponSlotsFull: !this.canAddWeapon(),
            itemSlotsFull: !this.canAddItem()
        };
    }

    /**
     * Reset all equipment (for new game)
     */
    reset() {
        this.weaponSlots = {
            primary: null,
            secondary: null
        };
        this.equippedItems = [];
        this.weaponLevels = {};
    }
}
