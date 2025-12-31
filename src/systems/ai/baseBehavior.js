/**
 * BaseBehavior
 * 
 * Abstract base class for all enemy AI behavior modules.
 * Behaviors define WHAT an enemy does (decision logic),
 * separate from HOW movement is executed (physics).
 * 
 * All behaviors must:
 * - Be parameter-driven (no hardcoded values)
 * - Return movement vectors instead of directly setting velocity
 * - Support lifecycle methods (enter, update, exit)
 */
export class BaseBehavior {
    /**
     * @param {Enemy} enemy - The enemy entity this behavior controls
     * @param {Object} params - Configuration parameters for this behavior
     */
    constructor(enemy, params = {}) {
        this.enemy = enemy;
        this.params = params;
        this.timers = {};
        this.state = 'idle';
        this.isActive = false;
    }
    // ============================================================
    // LIFECYCLE METHODS
    // ============================================================
    /**
     * Called when the behavior is activated.
     * Override to initialize state, reset timers, etc.
     */
    enter() {
        this.isActive = true;
        this.state = 'active';
        this.resetTimers();
    }
    /**
     * Called every frame while the behavior is active.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        // Override in subclasses
    }
    /**
     * Called when the behavior is deactivated.
     * Override to cleanup state, stop effects, etc.
     */
    exit() {
        this.isActive = false;
        this.state = 'idle';
    }
    // ============================================================
    // STATE QUERIES
    // ============================================================
    /**
     * Returns true if the behavior has completed its cycle.
     * Used by BossAIManager to sequence behaviors.
     */
    isComplete() {
        return false;
    }
    /**
     * Returns true if this behavior can be interrupted.
     * Some behaviors (like charge wind-up) might not be interruptible.
     */
    canInterrupt() {
        return true;
    }
    /**
     * Returns the current internal state of the behavior.
     * Useful for debugging and visual feedback.
     */
    getState() {
        return this.state;
    }
    // ============================================================
    // MOVEMENT OUTPUT
    // ============================================================
    /**
     * Returns the desired movement vector for this frame.
     * The movement executor will apply this to the physics body.
     * 
     * @returns {Object} { x: number, y: number, speed: number }
     *   x, y: Normalized direction (-1 to 1)
     *   speed: Speed multiplier (applied to base enemy speed)
     */
    getMovementVector() {
        return { x: 0, y: 0, speed: 0 };
    }
    // ============================================================
    // UTILITY METHODS
    // ============================================================
    /**
     * Gets the player reference from the scene.
     */
    getPlayer() {
        return this.enemy.scene?.player;
    }
    /**
     * Returns the distance to the player.
     */
    getDistanceToPlayer() {
        const player = this.getPlayer();
        if (!player) return Infinity;
        return Phaser.Math.Distance.Between(
            this.enemy.x, this.enemy.y,
            player.x, player.y
        );
    }
    /**
     * Returns the angle to the player in radians.
     */
    getAngleToPlayer() {
        const player = this.getPlayer();
        if (!player) return 0;
        return Phaser.Math.Angle.Between(
            this.enemy.x, this.enemy.y,
            player.x, player.y
        );
    }
    /**
     * Returns a normalized direction vector towards the player.
     */
    getDirectionToPlayer() {
        const player = this.getPlayer();
        if (!player) return { x: 0, y: 0 };
        const dx = player.x - this.enemy.x;
        const dy = player.y - this.enemy.y;
        const distance = Math.hypot(dx, dy);
        if (distance === 0) return { x: 0, y: 0 };
        return {
            x: dx / distance,
            y: dy / distance
        };
    }
    /**
     * Resets all timers to zero.
     */
    resetTimers() {
        for (const key in this.timers) {
            this.timers[key] = 0;
        }
    }
    /**
     * Increment a specific timer.
     */
    tickTimer(key, delta) {
        if (this.timers[key] === undefined) {
            this.timers[key] = 0;
        }
        this.timers[key] += delta;
        return this.timers[key];
    }
    /**
     * Check if a timer has reached its threshold.
     */
    isTimerReady(key, threshold) {
        return (this.timers[key] || 0) >= threshold;
    }
    /**
     * Reset a specific timer.
     */
    resetTimer(key) {
        this.timers[key] = 0;
    }
    /**
     * Gets a parameter value with a fallback default.
     */
    getParam(key, defaultValue) {
        return this.params[key] !== undefined ? this.params[key] : defaultValue;
    }
}