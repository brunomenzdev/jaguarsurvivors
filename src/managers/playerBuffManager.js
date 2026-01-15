/**
 * PlayerBuffManager
 * 
 * Centralized system to track active temporary buffs on the player.
 * Handles buff duration, expiration, and emits events for UI/VFX systems.
 */
export class PlayerBuffManager {
    constructor(scene) {
        this.scene = scene;
        this.activeBuffs = new Map(); // buffType -> { duration, remaining, data }
    }

    /**
     * Add a new buff to the player.
     * If the buff already exists, refreshes its duration.
     * @param {string} type - Buff identifier (e.g., 'shield', 'rage', 'speed')
     * @param {object} config - Buff configuration including duration and effect data
     */
    addBuff(type, config) {
        const existing = this.activeBuffs.get(type);

        // If buff exists, refresh duration
        if (existing) {
            existing.remaining = config.duration;
            Object.assign(existing.data, config);
            return;
        }

        // New buff
        this.activeBuffs.set(type, {
            duration: config.duration,
            remaining: config.duration,
            data: { ...config }
        });

        console.debug('[PlayerBuffManager] Buff started:', type, config);
        this.scene.events.emit('buff-started', type, config);
    }

    /**
     * Remove a buff from the player.
     * @param {string} type - Buff identifier
     */
    removeBuff(type) {
        if (this.activeBuffs.has(type)) {
            const buff = this.activeBuffs.get(type);
            this.activeBuffs.delete(type);

            console.debug('[PlayerBuffManager] Buff ended:', type);
            this.scene.events.emit('buff-ended', type, buff.data);
        }
    }

    /**
     * Check if a buff is currently active.
     * @param {string} type - Buff identifier
     * @returns {boolean}
     */
    hasBuff(type) {
        return this.activeBuffs.has(type);
    }

    /**
     * Get the active buff data.
     * @param {string} type - Buff identifier
     * @returns {object|undefined}
     */
    getActiveBuff(type) {
        return this.activeBuffs.get(type);
    }

    /**
     * Update all buffs, decrementing duration and removing expired ones.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        for (const [type, buff] of this.activeBuffs.entries()) {
            buff.remaining -= delta;

            if (buff.remaining <= 0) {
                this.removeBuff(type);
            }
        }
    }

    /**
     * Get remaining time for a buff as a percentage (0-1).
     * @param {string} type - Buff identifier
     * @returns {number}
     */
    getBuffProgress(type) {
        const buff = this.activeBuffs.get(type);
        if (!buff) return 0;
        return Math.max(0, buff.remaining / buff.duration);
    }

    /**
     * Clear all active buffs immediately.
     */
    clearAll() {
        for (const type of this.activeBuffs.keys()) {
            this.removeBuff(type);
        }
    }

    /**
     * Get all active buff types.
     * @returns {string[]}
     */
    getActiveBuffTypes() {
        return Array.from(this.activeBuffs.keys());
    }

    destroy() {
        this.clearAll();
        this.activeBuffs = null;
    }
}
