import { BaseBehavior } from '../baseBehavior.js';
/**
 * ZigZagBehavior
 * 
 * Enemy advances toward the player while oscillating laterally.
 * Movement is deterministic and predictable (no randomness).
 * 
 * Parameters:
 * - baseSpeed: Forward movement speed multiplier (default: 1.0)
 * - amplitude: Lateral oscillation distance in pixels (default: 50)
 * - frequency: Oscillation speed in radians per second (default: 3.0)
 * - phase: Starting phase offset 0-2π (default: 0)
 */
export class ZigZagBehavior extends BaseBehavior {
    constructor(enemy, params = {}) {
        super(enemy, params);

        this.time = 0;
        this.phase = this.getParam('phase', 0);
    }
    enter() {
        super.enter();
        this.state = 'zigzagging';
        this.time = 0;

        // Randomize initial phase if not specified
        if (this.params.phase === undefined) {
            this.phase = Math.random() * Math.PI * 2;
        }
    }
    update(delta) {
        if (!this.isActive) return;

        // Accumulate time for oscillation
        this.time += delta / 1000; // Convert to seconds
    }
    getMovementVector() {
        const baseSpeed = this.getParam('baseSpeed', 1.0);
        const amplitude = this.getParam('amplitude', 50);
        const frequency = this.getParam('frequency', 3.0);
        // Get direction to player
        const toPlayer = this.getDirectionToPlayer();

        // Calculate perpendicular direction (for lateral movement)
        const perpendicular = {
            x: -toPlayer.y,
            y: toPlayer.x
        };
        // Calculate oscillation factor (-1 to 1)
        const oscillation = Math.sin(this.time * frequency + this.phase);

        // Blend forward movement with lateral oscillation
        // The lateral component is scaled by amplitude relative to base speed
        const lateralFactor = (amplitude / 100) * oscillation; // Normalize amplitude

        const finalX = toPlayer.x + perpendicular.x * lateralFactor;
        const finalY = toPlayer.y + perpendicular.y * lateralFactor;

        // Normalize the final vector
        const length = Math.hypot(finalX, finalY);
        if (length === 0) {
            return { x: 0, y: 0, speed: 0 };
        }
        return {
            x: finalX / length,
            y: finalY / length,
            speed: baseSpeed
        };
    }
    /**
     * Get the current oscillation phase (0-1).
     * Useful for visual effects that sync with movement.
     */
    getOscillationPhase() {
        const frequency = this.getParam('frequency', 3.0);
        const raw = Math.sin(this.time * frequency + this.phase);
        return (raw + 1) / 2; // Normalize to 0-1
    }
}