/**
 * Pickup & Item Assets Configuration
 * 
 * Defines all pickup items and equipable items with their asset paths.
 */

export const pickupsConfig = {
    tables: {
        common: [
            { type: 'health_kit', chance: 0.7 },
            { type: 'magnet', chance: 0.1 },
            { type: 'map_bomb', chance: 0.05 },
            { type: 'boots', chance: 0.15 }
        ],
        rare: [
            { type: 'health_kit', chance: 0.4 },
            { type: 'magnet', chance: 0.2 },
            { type: 'map_bomb', chance: 0.2 },
            { type: 'boots', chance: 0.2 }
        ],
        boss: [
            { type: 'health_kit_big', chance: 1.0 }
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
        health_kit_big: {
            color: 0x00FF00,
            scale: 1.0,
            spriteKey: 'pickup_cure',
            image: 'src/assets/images/pickup_cure.png',
            shape: 'square',
            effect: 'heal',
            value: 0.5
        },
        magnet: {
            color: 0x0000FF,
            scale: 1.0,
            spriteKey: 'pickup_shield', // Using shield as placeholder for magnet shape
            image: 'src/assets/images/pickup_shield.png',
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
            spriteKey: 'pickup_bomb',
            image: 'src/assets/images/pickup_bomb.png',
            shape: 'circle',
            effect: 'coin',
            value: 1
        }
    }
};

