/**
 * Pickup & Item Assets Configuration
 * 
 * Defines all pickup items and equipable items with their asset paths.
 */

export const pickupsConfig = {
    tables: {
        common: [
            { type: 'health_kit', chance: 0.55 },
            { type: 'magnet', chance: 0.1 },
            { type: 'map_bomb', chance: 0.05 },
            { type: 'boots', chance: 0.1 },
            { type: 'shield_core', chance: 0.08 },
            { type: 'rage_orb', chance: 0.08 },
            { type: 'time_freeze', chance: 0.04 }
        ],
        rare: [
            { type: 'health_kit', chance: 0.3 },
            { type: 'magnet', chance: 0.15 },
            { type: 'map_bomb', chance: 0.15 },
            { type: 'boots', chance: 0.12 },
            { type: 'shield_core', chance: 0.1 },
            { type: 'rage_orb', chance: 0.1 },
            { type: 'time_freeze', chance: 0.08 }
        ],
        boss: [
            { type: 'health_kit', chance: 1.0 }
        ]
    },
    types: {
        health_kit: {
            color: 0x00FF00,
            scale: 1.0,
            spriteKey: 'pickup_cure',
            image: 'src/assets/images/pickup_cure.png',
            shape: 'square',
            effect: 'heal',
            value: 0.2
        },
        magnet: {
            color: 0x0000FF,
            scale: 1.0,
            spriteKey: 'pickup_ima',
            image: 'src/assets/images/pickup_ima.png',
            shape: 'circle',
            effect: 'magnet'
        },
        boots: {
            color: 0x00FFFF,
            scale: 1.0,
            spriteKey: 'pickup_speedboots',
            image: 'src/assets/images/pickup_speedboots.png',
            shape: 'circle',
            effect: 'speed_boost',
            value: 0.5,
            duration: 5000
        },
        map_bomb: {
            color: 0xFF0000,
            scale: 1.0,
            spriteKey: 'pickup_bomb',
            image: 'src/assets/images/pickup_bomb.png',
            shape: 'star',
            effect: 'bomb'
        },
        coin: {
            color: 0xFFD700,
            scale: 0.8,
            spriteKey: 'pickup_coin',
            image: 'src/assets/images/pickup_coin.png',
            shape: 'circle',
            effect: 'coin',
            value: 1
        },
        shield_core: {
            color: 0x00AAFF,
            scale: 1.0,
            spriteKey: 'pickup_shield',
            image: 'src/assets/images/pickup_shield.png',
            shape: 'circle',
            effect: 'shield',
            duration: 8000,   // 8 seconds
            value: 3          // absorbs 3 hits
        },
        rage_orb: {
            color: 0xFF4400,
            scale: 1.0,
            spriteKey: 'pickup_rage_orb',
            image: 'src/assets/images/pickup_rage_orb.png',
            shape: 'circle',
            effect: 'rage',
            duration: 6000,   // 6 seconds
            value: 0.5        // +50% damage
        },
        time_freeze: {
            color: 0x8800FF,
            scale: 1.0,
            spriteKey: 'pickup_ice',
            image: 'src/assets/images/pickup_ice.png',
            shape: 'circle',
            effect: 'time_freeze',
            duration: 4000    // 4 seconds
        }
    }
};

