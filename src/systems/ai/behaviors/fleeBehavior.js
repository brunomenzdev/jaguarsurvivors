import { BaseBehavior } from '../baseBehavior.js';
/**
 * FleeBehavior
 * 
 * Enemy runs away from the player when too close.
 * Useful for support enemies or special mechanics.
 * 
 * Parameters:
 * - fleeSpeed: Speed multiplier when fleeing (default: 1.2)
 * - triggerDistance: Distance at which to start fleeing (default: 150)
 * - safeDistance: Distance at which fleeing stops (default: 300)
 * - idleSpeed: Speed when not fleeing (default: 0.5)
 */
export class FleeBehavior extends BaseBehavior {
    static STATES = {
        IDLE: 'idle',
        FLEEING: 'fleeing'
    };
    constructor(enemy, params = {}) {
        super(enemy, params);
    }
    enter() {
        super.enter();
        this.updateState();
    }
    update(delta) {
        if (!this.isActive) return;
        this.updateState();
    }
    updateState() {
        const triggerDistance = this.getParam('triggerDistance', 150);
        const safeDistance = this.getParam('safeDistance', 300);
        const distance = this.getDistanceToPlayer();
        if (this.state === FleeBehavior.STATES.FLEEING) {
            // Keep fleeing until safe distance reached
            if (distance >= safeDistance) {
                this.state = FleeBehavior.STATES.IDLE;
            }
        } else {
            // Start fleeing if too close
            if (distance <= triggerDistance) {
                this.state = FleeBehavior.STATES.FLEEING;
            }
        }
    }
    getMovementVector() {
        const toPlayer = this.getDirectionToPlayer();

        switch (this.state) {
            case FleeBehavior.STATES.FLEEING:
                const fleeSpeed = this.getParam('fleeSpeed', 1.2);
                return {
                    x: -toPlayer.x,
                    y: -toPlayer.y,
                    speed: fleeSpeed
                };
            case FleeBehavior.STATES.IDLE:
                const idleSpeed = this.getParam('idleSpeed', 0.5);
                if (idleSpeed > 0) {
                    // Wander or slowly approach when not fleeing
                    return {
                        x: toPlayer.x,
                        y: toPlayer.y,
                        speed: idleSpeed
                    };
                }
                return { x: 0, y: 0, speed: 0 };
            default:
                return { x: 0, y: 0, speed: 0 };
        }
    }
}
