/**
 * AUDIO_CONFIG
 * 
 * Central configuration for all game audio events.
 * Defines mapping between EventBus events and Sound Keys.
 * 
 * Structure:
 * event-name: [
 *   {
 *     key: 'sound_key',          // Main sound key
 *     keys: ['a', 'b'],          // Optional: Variations (picked randomly)
 *     condition: (ctx) => bool,  // Logic to determine if this sound plays
 *     priority: 1-100,           // Sound priority (Higher = more important)
 *     throttle: 50,              // Min time (ms) between identical calls
 *     chance: 1.0,               // 0-1 probability to play
 *     config: {                  // Phaser Sound Config
 *       volume: 1.0,
 *       rate: 1.0,
 *       detune: 0,
 *       loop: false
 *     }
 *   }
 * ]
 */

export const AUDIO_CONFIG = {
    // =========================================================================
    // COMBAT EVENTS
    // =========================================================================

    // Weapon Attack (Melee Swing / Ranged Fire)
    'weapon-attack': [
        {
            keys: ['knife', 'sword'],
            condition: () => true,
            priority: 40,
            throttle: 100,
            config: { volume: 0.4 }
        }
    ],

    'weapon-shoot': [
        {
            key: 'rifleshoot',
            condition: (ctx) => ctx.rawArgs[0] && !ctx.rawArgs[0].includes('laser'),
            priority: 45,
            throttle: 80,
            config: { volume: 0.4 }
        },
        {
            key: 'laser',
            condition: (ctx) => ctx.rawArgs[0] && ctx.rawArgs[0].includes('laser'),
            priority: 45,
            throttle: 100,
            config: { volume: 0.15 }
        }
    ],

    // Entity Taking Damage
    'enemy-damaged': [
        // Standard Enemy Hit
        {
            keys: ['hit1', 'hit2'],
            condition: (ctx) => !ctx.isCritical,
            priority: 55,
            throttle: 50,
            config: { volume: 0.5 }
        },
        // Critical Hit (Distinct, Stronger)
        {
            key: 'kill',
            condition: (ctx) => ctx.isCritical,
            priority: 70,
            throttle: 50,
            config: { volume: 0.9 }
        }
    ],

    'structure-damaged': [
        {
            keys: ['hit'],
            condition: () => true,
            priority: 50,
            throttle: 60,
            config: { volume: 0.6, rate: 1.4 } // Higher pitch for hard surface hit
        }
    ],

    'player-damaged': [
        {
            keys: ['punch', 'slap'],
            condition: () => true,
            priority: 85,
            throttle: 150,
            config: { volume: 0.7 }
        }
    ],

    'player-evaded': [
        {
            key: 'evasion',
            condition: () => true,
            priority: 80,
            throttle: 200,
            config: { volume: 0.6 }
        }
    ],

    // =========================================================================
    // ENTITY LIFECYCLE
    // =========================================================================

    'enemy-died': [
        {
            keys: ['kill'],
            condition: (ctx) => !ctx.target?.isBoss,
            priority: 45,
            throttle: 80,
            chance: 0.7,
            config: { volume: 0.35, rate: 1.2 }
        }
    ],

    'boss-spawned': [
        {
            key: 'bosswarning',
            condition: () => true,
            priority: 100,
            config: { volume: 1.0 }
        }
    ],

    'boss-died': [
        {
            key: 'bossdefeat',
            condition: () => true,
            priority: 100,
            config: { volume: 1.0 }
        }
    ],

    // =========================================================================
    // LOOT & PROGRESSION
    // =========================================================================

    'xp-collected': [
        {
            keys: ['xp_collect'],
            condition: () => true,
            priority: 35,
            throttle: 20, // Very repeatable
            config: { volume: 0.4, rate: 1.1 }
        }
    ],

    'coin-collected': [
        {
            keys: ['coin', 'goldcoin', 'valuecoin'],
            condition: () => true,
            priority: 80,
            throttle: 40,
            config: { volume: 0.5 }
        }
    ],

    'pickup-collected': [
        // Default pickup
        {
            key: 'pickup',
            condition: (ctx) => !['shield_core', 'rage_orb', 'map_bomb'].includes(ctx.type),
            priority: 85,
            config: { volume: 0.7 }
        },
        // Bomb Pickup
        {
            key: 'explosion',
            condition: (ctx) => ctx.type === 'map_bomb',
            priority: 95,
            config: { volume: 0.8 }
        },
        // Special pickups
        {
            key: 'magic',
            condition: (ctx) => ['shield_core', 'shield', 'magnet'].includes(ctx.type),
            priority: 90,
            config: { volume: 0.8 }
        },
        {
            key: 'spell',
            condition: (ctx) => ctx.type === 'rage_orb' || ctx.type === 'rage',
            priority: 90,
            config: { volume: 0.8, rate: 0.8 }
        }
    ],

    'level-up': [
        {
            key: 'levelup',
            condition: () => true,
            priority: 95,
            config: { volume: 0.9 }
        }
    ],

    'level-complete': [
        {
            key: 'levelcomplete',
            condition: () => true,
            priority: 100,
            config: { volume: 1.0 }
        }
    ],

    // =========================================================================
    // UI EVENTS
    // =========================================================================

    'ui-click': [
        {
            keys: ['uiclick'],
            condition: () => true,
            priority: 90,
            config: { volume: 0.6 }
        }
    ],

    'ui-popup': [
        {
            key: 'popup',
            condition: () => true,
            priority: 85,
            config: { volume: 0.6 }
        }
    ],

    'shop-purchase': [
        {
            keys: ['purchase', 'shoppurchase'],
            condition: () => true,
            priority: 95,
            config: { volume: 0.8 }
        }
    ],

    'game-start': [
        {
            key: 'gamestart',
            condition: () => true,
            priority: 100,
            config: { volume: 0.9 }
        }
    ],

    'game-over': [
        {
            key: 'gameover',
            condition: () => true,
            priority: 100,
            config: { volume: 1.0 }
        }
    ],

    // =========================================================================
    // SYSTEMS
    // =========================================================================
    'dash-start': [
        {
            key: 'dash_start', // Key mapped to evasion.mp3 in audio.config.js
            condition: () => true,
            priority: 70,
            throttle: 300,
            config: { volume: 0.5 }
        }
    ],

    'reload': [
        {
            key: 'reloadgun',
            condition: () => true,
            priority: 60,
            throttle: 500,
            config: { volume: 0.6 }
        }
    ]
};
