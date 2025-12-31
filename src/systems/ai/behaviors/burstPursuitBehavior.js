import { BaseBehavior } from '../baseBehavior.js';
/**
 * BurstPursuitBehavior
 * 
 * Enemy alternates between fast pursuit phases and pause/slow phases.
 * Creates a rhythmic, predatory movement pattern.
 * 
 * States: PURSUING → PAUSING → (repeat)
 * 
 * Parameters:
 * - pursuitSpeed: Speed multiplier during pursuit phase (default: 1.5)
 * - pursuitDuration: Duration of pursuit phase in ms (default: 1500)
 * - pauseDuration: Duration of pause phase in ms (default: 800)
 * - pauseSpeed: Speed during pause phase (default: 0)
 */
export class BurstPursuitBehavior extends BaseBehavior {
    static STATES = {
        PURSUING: 'pursuing',
        PAUSING: 'pausing'
    };
    constructor(enemy, params = {}) {
        super(enemy, params);

        this.stateTimer = 0;
    }
    enter() {
        super.enter();
        this.state = BurstPursuitBehavior.STATES.PURSUING;
        this.stateTimer = 0;
    }
    update(delta) {
        if (!this.isActive) return;
        this.stateTimer += delta;
        switch (this.state) {
            case BurstPursuitBehavior.STATES.PURSUING:
                this.updatePursuing();
                break;
            case BurstPursuitBehavior.STATES.PAUSING:
                this.updatePausing();
                break;
        }
    }
    updatePursuing() {
        const pursuitDuration = this.getParam('pursuitDuration', 1500);

        if (this.stateTimer >= pursuitDuration) {
            this.transitionTo(BurstPursuitBehavior.STATES.PAUSING);
        }
    }
    updatePausing() {
        const pauseDuration = this.getParam('pauseDuration', 800);

        if (this.stateTimer >= pauseDuration) {
            this.transitionTo(BurstPursuitBehavior.STATES.PURSUING);
        }
    }
    transitionTo(newState) {
        this.state = newState;
        this.stateTimer = 0;

        // Debug logging
        console.debug('BEHAVIOR_STATE_CHANGE', {
            enemy: this.enemy.enemy?.key,
            behavior: 'burst_pursuit',
            state: newState
        });
    }
    getMovementVector() {
        const direction = this.getDirectionToPlayer();

        switch (this.state) {
            case BurstPursuitBehavior.STATES.PURSUING:
                const pursuitSpeed = this.getParam('pursuitSpeed', 1.5);
                return {
                    x: direction.x,
                    y: direction.y,
                    speed: pursuitSpeed
                };
            case BurstPursuitBehavior.STATES.PAUSING:
                const pauseSpeed = this.getParam('pauseSpeed', 0);
                if (pauseSpeed > 0) {
                    return {
                        x: direction.x,
                        y: direction.y,
                        speed: pauseSpeed
                    };
                }
                return { x: 0, y: 0, speed: 0 };
            default:
                return { x: 0, y: 0, speed: 0 };
        }
    }
    /**
     * One cycle completes after both pursuit and pause.
     */
    isComplete() {
        return this.state === BurstPursuitBehavior.STATES.PAUSING &&
            this.stateTimer >= this.getParam('pauseDuration', 800);
    }
    /**
     * Get the progress through the current phase (0-1).
     */
    getPhaseProgress() {
        const duration = this.state === BurstPursuitBehavior.STATES.PURSUING
            ? this.getParam('pursuitDuration', 1500)
            : this.getParam('pauseDuration', 800);

        return Math.min(this.stateTimer / duration, 1.0);
    }
}