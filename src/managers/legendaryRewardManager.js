import { CONFIG } from '../config/config.js';

// Import all legendary classes - Gadgets
import { OrbitalBladeGadget } from '../entities/legendary/gadget/OrbitalBladeGadget.js';
import { AutoTurretGadget } from '../entities/legendary/gadget/AutoTurretGadget.js';
import { BuffTotemGadget } from '../entities/legendary/gadget/BuffTotemGadget.js';
import { DebuffFieldGadget } from '../entities/legendary/gadget/DebuffFieldGadget.js';
import { LaserTrapGadget } from '../entities/legendary/gadget/LaserTrapGadget.js';
import { MineGadget } from '../entities/legendary/gadget/MineGadget.js';

// Import all legendary classes - Procs
import { ChainLightningProc } from '../entities/legendary/proc/ChainLightningProc.js';
import { FrostNovaProc } from '../entities/legendary/proc/FrostNovaProc.js';
import { ExplosionOnKillProc } from '../entities/legendary/proc/ExplosionOnKillProc.js';
import { VampireStrikeProc } from '../entities/legendary/proc/VampireStrikeProc.js';
import { ThornsBurstProc } from '../entities/legendary/proc/ThornsBurstProc.js';
import { SacredNovaProc } from '../entities/legendary/proc/SacredNovaProc.js';

// Import all legendary classes - Companions
import { AttackCompanion } from '../entities/legendary/companion/AttackCompanion.js';
import { CollectorCompanion } from '../entities/legendary/companion/CollectorCompanion.js';
import { BuffCompanion } from '../entities/legendary/companion/BuffCompanion.js';
import { DroneCompanion } from '../entities/legendary/companion/DroneCompanion.js';
import { WispCompanion } from '../entities/legendary/companion/WispCompanion.js';

/**
 * LegendaryRewardManager
 * 
 * Orchestrates the legendary upgrade system.
 * 
 * Responsibilities:
 * - Maintain pool of available legendaries
 * - Filter eligible legendaries (not yet acquired)
 * - Guarantee uniqueness (no duplicates)
 * - Create legendary instances via factory
 * - Route legendaries to appropriate managers
 * - Track active legendaries
 * 
 * Does NOT contain behavior logic for any legendary.
 */
export class LegendaryRewardManager {
    constructor(scene) {
        this.scene = scene;
        this.activeLegendaryIds = new Set(); // IDs of acquired legendaries
        this.activeLegendaries = new Map(); // id -> legendary instance
    }

    /**
     * Get random eligible legendaries for selection.
     * Filters out already acquired legendaries to guarantee uniqueness.
     * @param {number} count - Number of options to return
     * @returns {Array} Array of legendary configs
     */
    getRandomRewards(count = 3) {
        // Filter out already acquired legendaries
        const available = CONFIG.legendary.filter(
            config => !this.activeLegendaryIds.has(config.id)
        );

        if (available.length === 0) {
            console.warn('LegendaryRewardManager: No more unique legendaries available');
            return [];
        }

        // Shuffle and slice
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    /**
     * Activate a legendary by ID.
     * Creates instance, marks as active, and routes to appropriate manager.
     * @param {string} id - Legendary ID
     */
    activateLegendary(id) {
        // Prevent duplicates
        if (this.activeLegendaryIds.has(id)) {
            console.error(`LegendaryRewardManager: Legendary ${id} already active`);
            return;
        }

        // Find config
        const config = CONFIG.legendary.find(l => l.id === id);
        if (!config) {
            console.error(`LegendaryRewardManager: Config not found for ${id}`);
            return;
        }

        // Create instance
        const legendary = this.createLegendaryInstance(config);
        if (!legendary) {
            console.error(`LegendaryRewardManager: Failed to create legendary ${id}`);
            return;
        }

        // Mark as active
        this.activeLegendaryIds.add(id);
        this.activeLegendaries.set(id, legendary);

        // Route to appropriate manager
        this.routeLegendary(legendary, config.type);

        // Emit event
        this.scene.events.emit('legendary-obtained', config);
        console.debug('EVENT_EMITTED', {
            eventName: 'legendary-obtained',
            payload: config
        });

        console.debug('LegendaryRewardManager: Activated legendary', {
            id,
            name: config.name,
            type: config.type
        });
    }

    /**
     * Factory method to create legendary instances.
     * Maps legendary IDs to their class constructors.
     * @param {Object} config - Legendary configuration
     * @returns {BaseLegendary|null} Legendary instance or null
     */
    createLegendaryInstance(config) {
        // Map of legendary IDs to their class constructors
        const legendaryClasses = {
            // Gadgets
            'legend_blade': OrbitalBladeGadget,
            'legend_torre': AutoTurretGadget,
            'legend_totem': BuffTotemGadget,
            'legend_dark_field': DebuffFieldGadget,
            'legend_torre_laser': LaserTrapGadget,
            'legend_mina_terrestre': MineGadget,

            // Procs
            'legend_chain': ChainLightningProc,
            'legend_ice': FrostNovaProc,
            'legend_explosao': ExplosionOnKillProc,
            'legend_vampiro': VampireStrikeProc,
            'legend_espinhos': ThornsBurstProc,
            'legend_light': SacredNovaProc,

            // Companions
            'legend_jaguar': AttackCompanion,
            'legend_espirito': CollectorCompanion,
            'legend_xama': BuffCompanion,
            'legend_drone': DroneCompanion,
            'legend_wisp': WispCompanion,
        };

        const LegendaryClass = legendaryClasses[config.id];
        if (!LegendaryClass) {
            console.error(`LegendaryRewardManager: No class found for ${config.id}`);
            return null;
        }

        return new LegendaryClass(this.scene, config);
    }

    /**
     * Route legendary to appropriate manager based on type.
     * @param {BaseLegendary} legendary - Legendary instance
     * @param {string} type - Legendary type (gadget, proc, companion)
     */
    routeLegendary(legendary, type) {
        switch (type) {
            case 'gadget':
                if (this.scene.gadgetManager) {
                    this.scene.gadgetManager.addGadget(legendary);
                } else {
                    console.error('LegendaryRewardManager: GadgetManager not found');
                }
                break;

            case 'proc':
                if (this.scene.procManager) {
                    this.scene.procManager.addProc(legendary);
                } else {
                    console.error('LegendaryRewardManager: ProcManager not found');
                }
                break;

            case 'companion':
                if (this.scene.companionManager) {
                    this.scene.companionManager.addCompanion(legendary);
                } else {
                    console.error('LegendaryRewardManager: CompanionManager not found');
                }
                break;

            default:
                console.error(`LegendaryRewardManager: Unknown type ${type}`);
        }
    }

    /**
     * Get a legendary instance by ID.
     * @param {string} id - Legendary ID
     * @returns {BaseLegendary|null}
     */
    getLegendary(id) {
        return this.activeLegendaries.get(id) || null;
    }

    /**
     * Get all active legendary IDs.
     * @returns {Array<string>}
     */
    getActiveLegendaryIds() {
        return Array.from(this.activeLegendaryIds);
    }

    /**
     * Get all active legendary instances.
     * @returns {Array<BaseLegendary>}
     */
    getAllLegendaries() {
        return Array.from(this.activeLegendaries.values());
    }

    /**
     * Check if a legendary is active.
     * @param {string} id - Legendary ID
     * @returns {boolean}
     */
    isLegendaryActive(id) {
        return this.activeLegendaryIds.has(id);
    }

    /**
     * Reset for new run.
     * Destroys all legendaries and clears tracking.
     */
    reset() {
        this.activeLegendaries.forEach(legendary => legendary.destroy());
        this.activeLegendaries.clear();
        this.activeLegendaryIds.clear();

        console.debug('LegendaryRewardManager: Reset complete');
    }

    /**
     * Cleanup - alias for reset.
     */
    destroy() {
        this.reset();
    }
}
