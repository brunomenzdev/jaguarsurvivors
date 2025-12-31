import { BaseBehavior } from '../baseBehavior.js';

/**
 * OrbitBehavior
 * 
 * Enemy maintains a preferred distance from the player while circling.
 * Useful for ranged enemies or minions that surround the player.
 * 
 * Parameters:
 * - preferredDistance: Ideal distance from player in pixels (default: 200)
 * - orbitSpeed: Speed multiplier while orbiting (default: 0.8)
 * - approachSpeed: Speed when getting to orbit distance (default: 1.0)
 * - orbitDirection: 1 = clockwise, -1 = counter-clockwise (default: 1)
 * - distanceTolerance: How close to preferred distance before orbiting (default: 30)
 */
export class OrbitBehavior extends BaseBehavior {
    static STATES = {
        APPROACHING: 'approaching',
        ORBITING: 'orbiting',
        RETREATING: 'retreating'
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
        const preferredDistance = this.getParam('preferredDistance', 200);
        const tolerance = this.getParam('distanceTolerance', 30);
        const distance = this.getDistanceToPlayer();

        if (distance < preferredDistance - tolerance) {
            this.state = OrbitBehavior.STATES.RETREATING;
        } else if (distance > preferredDistance + tolerance) {
            this.state = OrbitBehavior.STATES.APPROACHING;
        } else {
            this.state = OrbitBehavior.STATES.ORBITING;
        }
    }

    getMovementVector() {
        const preferredDistance = this.getParam('preferredDistance', 200);
        const orbitDirection = this.getParam('orbitDirection', 1);

        const toPlayer = this.getDirectionToPlayer();
        const distance = this.getDistanceToPlayer();

        // Perpendicular direction for orbiting
        const tangent = {
            x: -toPlayer.y * orbitDirection,
            y: toPlayer.x * orbitDirection
        };

        switch (this.state) {
            case OrbitBehavior.STATES.APPROACHING:
                // Move towards player
                const approachSpeed = this.getParam('approachSpeed', 1.0);

                // Blend approach with slight tangent for smooth arc
                const approachBlend = 0.8;
                return {
                    x: toPlayer.x * approachBlend + tangent.x * (1 - approachBlend),
                    y: toPlayer.y * approachBlend + tangent.y * (1 - approachBlend),
                    speed: approachSpeed
                };

            case OrbitBehavior.STATES.ORBITING:
                // Circle around player
                const orbitSpeed = this.getParam('orbitSpeed', 0.8);

                // Add slight inward pull to maintain distance
                const distanceError = (distance - preferredDistance) / preferredDistance;
                const correction = Math.max(-0.3, Math.min(0.3, distanceError));

                return {
                    x: tangent.x + toPlayer.x * correction,
                    y: tangent.y + toPlayer.y * correction,
                    speed: orbitSpeed
                };

            case OrbitBehavior.STATES.RETREATING:
                // Move away from player
                const retreatSpeed = this.getParam('retreatSpeed', 0.7);
                return {
                    x: -toPlayer.x,
                    y: -toPlayer.y,
                    speed: retreatSpeed
                };

            default:
                return { x: 0, y: 0, speed: 0 };
        }
    }
}
