import { BaseBehavior } from '../baseBehavior.js';
/**
 * ChaseBehavior
 * 
 * The default enemy behavior - directly follows the player.
 * This is the behavior used when no specific AI config is defined.
 * 
 * Parameters:
 * - speed: Speed multiplier (default: 1.0)
 * - trackingSpeed: How quickly to update direction (1.0 = instant) (default: 1.0)
 * - minDistance: Stop when within this distance of player (default: 0)
 * - acceleration: Smoothing factor for direction changes (default: 1.0)
 */
export class ChaseBehavior extends BaseBehavior {
    constructor(enemy, params = {}) {
        super(enemy, params);

        // Current direction (for smooth tracking)
        this.currentDirection = { x: 0, y: 0 };
    }
    enter() {
        super.enter();
        this.state = 'chasing';

        // Initialize direction towards player
        const dir = this.getDirectionToPlayer();
        this.currentDirection = { x: dir.x, y: dir.y };
    }
    update(delta) {
        if (!this.isActive) return;
        const targetDirection = this.getDirectionToPlayer();
        const trackingSpeed = this.getParam('trackingSpeed', 1.0);

        // Smoothly interpolate towards target direction
        if (trackingSpeed < 1.0) {
            const lerp = 1 - Math.pow(1 - trackingSpeed, delta / 16.667);
            this.currentDirection.x += (targetDirection.x - this.currentDirection.x) * lerp;
            this.currentDirection.y += (targetDirection.y - this.currentDirection.y) * lerp;

            // Renormalize
            const len = Math.hypot(this.currentDirection.x, this.currentDirection.y);
            if (len > 0) {
                this.currentDirection.x /= len;
                this.currentDirection.y /= len;
            }
        } else {
            this.currentDirection = targetDirection;
        }
    }
    getMovementVector() {
        const minDistance = this.getParam('minDistance', 0);
        const distance = this.getDistanceToPlayer();

        // Stop if within minimum distance
        if (distance <= minDistance) {
            return { x: 0, y: 0, speed: 0 };
        }
        const speed = this.getParam('speed', 1.0);

        return {
            x: this.currentDirection.x,
            y: this.currentDirection.y,
            speed: speed
        };
    }
}