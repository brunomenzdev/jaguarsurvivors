/**
 * CompanionManager
 * 
 * Manages all companion-type legendary upgrades.
 * Orchestrates companion lifecycle and update loop.
 * 
 * Responsibilities:
 * - Store companion instances
 * - Update all companions each frame
 * - Cleanup on game reset
 * 
 * Does NOT contain companion behavior logic.
 */
export class CompanionManager {
    constructor(scene) {
        this.scene = scene;
        this.companions = new Map(); // id -> CompanionLegendary instance
    }

    /**
     * Add a companion instance to be managed.
     * @param {CompanionLegendary} companionInstance - The companion to add
     */
    addCompanion(companionInstance) {
        if (!companionInstance || !companionInstance.id) {
            console.error('CompanionManager: Invalid companion instance');
            return;
        }

        this.companions.set(companionInstance.id, companionInstance);
        companionInstance.activate();

        console.debug('CompanionManager: Added companion', {
            id: companionInstance.id,
            name: companionInstance.name
        });
    }

    /**
     * Update all companions.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        this.companions.forEach(companion => {
            if (companion.isActive) {
                companion.update(delta);
            }
        });
    }

    /**
     * Get a companion by ID.
     * @param {string} id - Companion ID
     * @returns {CompanionLegendary|null}
     */
    getCompanion(id) {
        return this.companions.get(id) || null;
    }

    /**
     * Get all active companions.
     * @returns {Array<CompanionLegendary>}
     */
    getAllCompanions() {
        return Array.from(this.companions.values());
    }

    /**
     * Cleanup all companions.
     */
    destroy() {
        this.companions.forEach(companion => companion.destroy());
        this.companions.clear();

        console.debug('CompanionManager: Destroyed all companions');
    }

    /**
     * Reset for new run.
     */
    reset() {
        this.destroy();
    }
}
