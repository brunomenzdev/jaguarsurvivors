/**
 * GadgetManager
 * 
 * Manages all gadget-type legendary upgrades.
 * Orchestrates gadget lifecycle, update loop, and collision handling.
 * 
 * Responsibilities:
 * - Store gadget instances
 * - Update all gadgets each frame
 * - Handle collision detection for gadget projectiles
 * - Cleanup on game reset
 * 
 * Does NOT contain gadget behavior logic - that lives in individual gadget classes.
 */
export class GadgetManager {
    constructor(scene) {
        this.scene = scene;
        this.gadgets = new Map(); // id -> GadgetLegendary instance
        this.projectileGroup = this.scene.physics.add.group();
        this.setupCollisions();
    }

    /**
     * Setup collision handling for gadget projectiles.
     */
    setupCollisions() {
        // Collision between gadget projectiles and enemies
        this.scene.physics.add.overlap(
            this.projectileGroup,
            this.scene.enemySpawner.group,
            (proj, enemySprite) => {
                const gadgetRef = proj.getData('gadgetRef');
                const enemy = enemySprite.getData('parent');

                if (gadgetRef && enemy && enemy.isActive) {
                    this.onGadgetHit(gadgetRef, enemy, proj);
                }
            }
        );
    }

    /**
     * Add a gadget instance to be managed.
     * @param {GadgetLegendary} gadgetInstance - The gadget to add
     */
    addGadget(gadgetInstance) {
        if (!gadgetInstance || !gadgetInstance.id) {
            console.error('GadgetManager: Invalid gadget instance');
            return;
        }

        this.gadgets.set(gadgetInstance.id, gadgetInstance);
        gadgetInstance.activate();

        console.debug('GadgetManager: Added gadget', {
            id: gadgetInstance.id,
            name: gadgetInstance.name
        });
    }

    /**
     * Update all gadgets.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        this.gadgets.forEach(gadget => {
            if (gadget.isActive) {
                gadget.update(delta);
            }
        });
    }

    /**
     * Handle collision between gadget and enemy.
     * Routes to the gadget's onHit method if it exists.
     * @param {GadgetLegendary} gadget - The gadget that hit
     * @param {Object} enemy - The enemy that was hit
     * @param {Phaser.GameObjects.GameObject} projectile - The projectile sprite (optional)
     */
    onGadgetHit(gadget, enemy, projectile = null) {
        if (gadget.onHit && typeof gadget.onHit === 'function') {
            gadget.onHit(enemy, projectile);
        }
    }

    /**
     * Get a gadget by ID.
     * @param {string} id - Gadget ID
     * @returns {GadgetLegendary|null}
     */
    getGadget(id) {
        return this.gadgets.get(id) || null;
    }

    /**
     * Get all active gadgets.
     * @returns {Array<GadgetLegendary>}
     */
    getAllGadgets() {
        return Array.from(this.gadgets.values());
    }

    /**
     * Cleanup all gadgets and projectiles.
     */
    destroy() {
        if (this.gadgets) {
            this.gadgets.forEach(gadget => {
                if (gadget && typeof gadget.destroy === 'function') {
                    gadget.destroy();
                }
            });
            this.gadgets.clear();
        }

        if (this.projectileGroup && this.projectileGroup.scene && typeof this.projectileGroup.clear === 'function') {
            try {
                this.projectileGroup.clear(true, true);
            } catch (e) {
                console.debug('GadgetManager: Error clearing projectileGroup during shutdown', e);
            }
        }

        console.debug('GadgetManager: Destroyed all gadgets');
    }

    /**
     * Reset for new run.
     */
    reset() {
        this.destroy();
    }
}
