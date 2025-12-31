import { CONFIG } from '../../config/config.js';

export class EnemyLoot {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
    }

    drop() {
        this.scene.kills++;

        const config = this.enemy.entity.config;

        // 1. XP Drop
        if (Math.random() < config.xpDropChance) {
            this.scene.xpSystem.dropXP(
                this.enemy.x,
                this.enemy.y,
                config.xpValue
            );
        }

        // 2. Item Drop (Pickup)
        if (config.dropChance && Math.random() < config.dropChance) {
            const tableKey = config.lootTable || 'common';
            const table = CONFIG.pickups.tables[tableKey];

            if (table) {
                const totalWeight = table.reduce((sum, item) => sum + item.chance, 0);
                let random = Math.random() * totalWeight;

                for (const item of table) {
                    if (random < item.chance) {
                        if (this.scene.pickupSystem) {
                            this.scene.pickupSystem.spawn(this.enemy.x, this.enemy.y, item.type);
                        }
                        break;
                    }
                    random -= item.chance;
                }
            }
        }

        // 3. Coin Drop
        const coinChance = config.coinChance || 0.05;
        if (Math.random() < coinChance) {
            if (this.scene.pickupSystem) {
                this.scene.pickupSystem.spawn(this.enemy.x + 10, this.enemy.y + 10, 'coin');
            }
        }
    }
}
