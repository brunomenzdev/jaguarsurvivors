/**
 * Enemy AI Configuration Examples
 * 
 * This file shows how to add AI configurations to enemy types.
 * Copy these patterns to enemies.config.js when ready to implement.
 * 
 * Each enemy can have an optional 'ai' block that defines:
 * - behaviorKey: Which behavior module to use
 * - behaviorParams: Configuration for that behavior
 * 
 * Enemies WITHOUT an ai block default to:
 *   ai: { behaviorKey: 'chase', behaviorParams: { speed: 1.0 } }
 */
export const enemyAIExamples = {
    // ==================== CHARGER ENEMY ====================
    // Uses the charge behavior - winds up then rushes
    enemy_charger: {
        ai: {
            behaviorKey: 'charge',
            behaviorParams: {
                chargeUpTime: 800,          // 0.8s wind-up
                chargeSpeed: 3.0,           // 3x normal speed during charge
                chargeDuration: 500,        // Charge lasts 0.5s
                cooldownTime: 1500,         // 1.5s before next charge
                idleSpeed: 0.3,             // Slow approach between charges
                lockDirection: true         // Direction locked at charge start
            }
        },
        scalingProfile: 'aggressive'
    },
    // ==================== ZIGZAG ENEMY ====================
    // Approaches while oscillating to be harder to hit
    enemy_zigzagger: {
        ai: {
            behaviorKey: 'zigzag',
            behaviorParams: {
                baseSpeed: 1.0,             // Normal forward speed
                amplitude: 50,              // 50px lateral movement
                frequency: 3.0              // Oscillates 3 times per second
            }
        },
        scalingProfile: 'swarm'
    },
    // ==================== STALKER ENEMY ====================
    // Alternates between fast pursuit and stopping
    enemy_stalker: {
        ai: {
            behaviorKey: 'burst_pursuit',
            behaviorParams: {
                pursuitSpeed: 1.5,          // 1.5x speed during pursuit
                pursuitDuration: 1500,      // Pursue for 1.5s
                pauseDuration: 800,         // Pause for 0.8s
                pauseSpeed: 0               // Completely stop during pause
            }
        },
        scalingProfile: 'aggressive'
    },
    // ==================== RANGED ENEMY ====================
    // Maintains distance while circling
    enemy_ranged: {
        ai: {
            behaviorKey: 'orbit',
            behaviorParams: {
                preferredDistance: 200,     // Stay 200px from player
                orbitSpeed: 0.8,            // Orbit at 80% speed
                approachSpeed: 1.0,         // Full speed when approaching
                orbitDirection: 1,          // Clockwise
                distanceTolerance: 30       // 30px tolerance before adjusting
            }
        },
        scalingProfile: 'ranged'
    },
    // ==================== COWARD ENEMY ====================
    // Runs away when player gets close
    enemy_coward: {
        ai: {
            behaviorKey: 'flee',
            behaviorParams: {
                fleeSpeed: 1.2,             // 120% speed when fleeing
                triggerDistance: 150,       // Start fleeing at 150px
                safeDistance: 300,          // Stop fleeing at 300px
                idleSpeed: 0.5              // Slow approach when not fleeing
            }
        },
        scalingProfile: 'ranged'
    },
    // ==================== BASIC CHASER ====================
    // Standard chase behavior (same as default but explicit)
    enemy_basic: {
        ai: {
            behaviorKey: 'chase',
            behaviorParams: {
                speed: 1.0,                 // Normal speed
                trackingSpeed: 1.0,         // Instant direction updates
                minDistance: 0              // Chase all the way to player
            }
        }
        // No scalingProfile = uses global scaling
    },
    // ==================== SLOW TRACKER ====================
    // Chases but with slow turning (predictable)
    enemy_slow_tracker: {
        ai: {
            behaviorKey: 'chase',
            behaviorParams: {
                speed: 1.2,                 // Slightly faster
                trackingSpeed: 0.5,         // Slow to change direction
                minDistance: 0
            }
        },
        scalingProfile: 'tanky'
    }
};
/**
 * Example of modifying an existing enemy in enemies.config.js:
 * 
 * Before:
 * {
 *     key: 'enemy_bandido_moto',
 *     speed: 240,
 *     damage: 8,
 *     health: 25,
 *     ... other properties
 * }
 * 
 * After:
 * {
 *     key: 'enemy_bandido_moto',
 *     speed: 240,
 *     damage: 8,
 *     health: 25,
 *     ... other properties,
 *     
 *     // NEW: AI Configuration
 *     ai: {
 *         behaviorKey: 'charge',
 *         behaviorParams: {
 *             chargeUpTime: 600,
 *             chargeSpeed: 4.0,
 *             chargeDuration: 400,
 *             cooldownTime: 1000,
 *             lockDirection: true
 *         }
 *     },
 *     scalingProfile: 'aggressive'
 * }
 */