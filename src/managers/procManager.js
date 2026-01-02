/**
 * ProcManager
 * 
 * Manages all proc-type legendary upgrades.
 * Event-driven orchestrator that routes game events to proc instances.
 * 
 * Responsibilities:
 * - Store proc instances
 * - Listen to game events
 * - Route events to appropriate procs
 * - Handle chance and cooldown checks
 * - Cleanup on game reset
 * 
 * Does NOT contain proc behavior logic - that lives in individual proc classes.
 */
export class ProcManager {
    constructor(scene) {
        this.scene = scene;
        this.procs = new Map(); // id -> ProcLegendary instance
        this.registerEventListeners();
    }

    /**
     * Register event listeners for proc triggers.
     */
    registerEventListeners() {
        this.scene.events.on('enemy-damaged', this.onEnemyDamaged, this);
        this.scene.events.on('enemy-killed', this.onEnemyKilled, this);
        this.scene.events.on('player-damaged', this.onPlayerDamaged, this);
        this.scene.events.on('player-attacked', this.onPlayerAttacked, this);
    }

    /**
     * Add a proc instance to be managed.
     * @param {ProcLegendary} procInstance - The proc to add
     */
    addProc(procInstance) {
        if (!procInstance || !procInstance.id) {
            console.error('ProcManager: Invalid proc instance');
            return;
        }

        this.procs.set(procInstance.id, procInstance);
        procInstance.activate();

        console.debug('ProcManager: Added proc', {
            id: procInstance.id,
            name: procInstance.name,
            triggerEvent: procInstance.triggerEvent
        });
    }

    /**
     * Handle enemy-damaged event.
     */
    onEnemyDamaged(enemy, amount, isCritical, attacker) {
        this.triggerProcs('enemy-damaged', { enemy, amount, isCritical, attacker });
    }

    /**
     * Handle enemy-killed event.
     */
    onEnemyKilled(enemy, killer) {
        this.triggerProcs('enemy-killed', { enemy, killer });
    }

    /**
     * Handle player-damaged event.
     */
    onPlayerDamaged(amount) {
        this.triggerProcs('player-damaged', { amount });
    }

    /**
     * Handle player-attacked event.
     */
    onPlayerAttacked(target) {
        this.triggerProcs('player-attacked', { target });
    }

    /**
     * Trigger all procs that match the event type.
     * @param {string} eventType - The event type
     * @param {Object} data - Event data
     */
    triggerProcs(eventType, data) {
        this.procs.forEach(proc => {
            if (proc.triggerEvent === eventType && proc.isActive) {
                // Check cooldown and chance
                if (proc.canTrigger() && proc.rollChance()) {
                    proc.onTrigger(data);
                }
            }
        });
    }

    /**
     * Get a proc by ID.
     * @param {string} id - Proc ID
     * @returns {ProcLegendary|null}
     */
    getProc(id) {
        return this.procs.get(id) || null;
    }

    /**
     * Get all active procs.
     * @returns {Array<ProcLegendary>}
     */
    getAllProcs() {
        return Array.from(this.procs.values());
    }

    /**
     * Cleanup all procs and remove event listeners.
     */
    destroy() {
        // Remove event listeners
        this.scene.events.off('enemy-damaged', this.onEnemyDamaged, this);
        this.scene.events.off('enemy-killed', this.onEnemyKilled, this);
        this.scene.events.off('player-damaged', this.onPlayerDamaged, this);
        this.scene.events.off('player-attacked', this.onPlayerAttacked, this);

        // Destroy all procs
        this.procs.forEach(proc => proc.destroy());
        this.procs.clear();

        console.debug('ProcManager: Destroyed all procs');
    }

    /**
     * Reset for new run.
     */
    reset() {
        this.destroy();
        this.registerEventListeners();
    }
}
