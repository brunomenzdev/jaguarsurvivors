/**
 * Difficulty Configuration
 * 
 * Defines progressive difficulty scaling for all enemy stats.
 * Scaling is applied via multipliers based on elapsed run time.
 * 
 * Curve types:
 * - linear: Constant rate of increase
 * - exponential: Accelerating rate of increase
 * - logarithmic: Decelerating rate of increase (fast early, slow late)
 * - quadratic: Slow start, fast finish
 * - inverse_quadratic: Fast start, slow finish
 * - step: Discrete jumps at specific times
 * - sine: Smooth S-curve transition
 * 
 * Each stat configuration:
 * - curve: The scaling curve type
 * - min: Starting multiplier (at time 0)
 * - max: Maximum multiplier (at rampUpTime)
 * - rampUpTime: Time in ms to reach max multiplier
 * 
 * Profiles allow different scaling per enemy archetype.
 * Enemies reference profiles via scalingProfile in their config.
 */
export const difficultyConfig = {
    // ==================== GLOBAL SCALING ====================
    // Applied to all enemies without a specific profile
    global: {
        health: {
            curve: 'linear',
            min: 1.0,
            max: 3.0,
            rampUpTime: 600000  // 10 minutes
        },
        speed: {
            curve: 'logarithmic',
            min: 1.0,
            max: 1.5,
            rampUpTime: 600000
        },
        damage: {
            curve: 'linear',
            min: 1.0,
            max: 2.5,
            rampUpTime: 600000
        },
        knockbackResistance: {
            curve: 'linear',
            min: 0.0,           // No resistance at start
            max: 0.7,           // 70% resistance at max
            rampUpTime: 600000
        }
    },
    // ==================== ARCHETYPE PROFILES ====================
    // Specific scaling for different enemy archetypes
    profiles: {
        // Fast, aggressive enemies that get even faster
        aggressive: {
            health: {
                curve: 'linear',
                min: 0.8,
                max: 2.5,
                rampUpTime: 600000
            },
            speed: {
                curve: 'exponential',
                min: 1.0,
                max: 2.0,
                rampUpTime: 300000  // Faster speed ramp
            },
            damage: {
                curve: 'linear',
                min: 1.2,
                max: 3.0,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'linear',
                min: 0.0,
                max: 0.5,
                rampUpTime: 600000
            }
        },
        // Slow but tough enemies
        tanky: {
            health: {
                curve: 'linear',
                min: 1.5,
                max: 5.0,
                rampUpTime: 600000
            },
            speed: {
                curve: 'linear',
                min: 0.8,
                max: 1.2,
                rampUpTime: 600000
            },
            damage: {
                curve: 'linear',
                min: 1.0,
                max: 2.0,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'quadratic',  // Gets tough to push back late game
                min: 0.3,
                max: 0.95,
                rampUpTime: 400000
            }
        },
        // Elite enemies with balanced scaling
        elite: {
            health: {
                curve: 'linear',
                min: 2.0,
                max: 4.0,
                rampUpTime: 600000
            },
            speed: {
                curve: 'linear',
                min: 1.1,
                max: 1.4,
                rampUpTime: 600000
            },
            damage: {
                curve: 'linear',
                min: 1.5,
                max: 2.5,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'linear',
                min: 0.2,
                max: 0.6,
                rampUpTime: 600000
            }
        },
        // Swarm enemies - many but weak
        swarm: {
            health: {
                curve: 'logarithmic',
                min: 0.5,
                max: 1.5,
                rampUpTime: 600000
            },
            speed: {
                curve: 'linear',
                min: 1.2,
                max: 1.8,
                rampUpTime: 400000
            },
            damage: {
                curve: 'linear',
                min: 0.8,
                max: 1.5,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'linear',
                min: 0.0,
                max: 0.3,
                rampUpTime: 600000
            }
        },
        // Ranged enemies - stay back, hit hard
        ranged: {
            health: {
                curve: 'linear',
                min: 0.7,
                max: 2.0,
                rampUpTime: 600000
            },
            speed: {
                curve: 'linear',
                min: 0.9,
                max: 1.3,
                rampUpTime: 600000
            },
            damage: {
                curve: 'linear',
                min: 1.3,
                max: 2.8,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'linear',
                min: 0.0,
                max: 0.4,
                rampUpTime: 600000
            }
        },
        // Bosses have their own minimal scaling (they're already strong)
        boss: {
            health: {
                curve: 'linear',
                min: 1.0,
                max: 1.5,
                rampUpTime: 600000
            },
            speed: {
                curve: 'linear',
                min: 1.0,
                max: 1.2,
                rampUpTime: 600000
            },
            damage: {
                curve: 'linear',
                min: 1.0,
                max: 1.3,
                rampUpTime: 600000
            },
            knockbackResistance: {
                curve: 'step',
                min: 0.5,
                max: 0.9,
                steps: [
                    { time: 0, value: 0.5 },
                    { time: 180000, value: 0.7 },  // 3 minutes
                    { time: 360000, value: 0.8 },  // 6 minutes
                    { time: 600000, value: 0.9 }   // 10 minutes
                ],
                rampUpTime: 600000
            }
        }
    }
};