import { ProcLegendary } from './ProcLegendary.js';

/**
 * ChainLightningProc
 * 
 * Chance to trigger chain lightning that bounces between enemies.
 * 
 * Trigger: On enemy damaged
 * Effect: Lightning chains to nearby enemies, dealing damage
 */
export class ChainLightningProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'enemy-damaged';
    }

    onTrigger({ enemy, amount, isCritical, attacker }) {
        if (!enemy || !enemy.isActive) return;

        this.markTriggered();
        this.executeChainLightning(enemy);
    }

    executeChainLightning(initialTarget) {
        const range = this.config.range || 200;
        const bounces = this.config.bounces || 3;
        const damage = this.config.damage || 40;
        const color = this.config.color || 0x00FFFF;

        // Build chain
        let current = initialTarget;
        const chain = [current];

        // Create graphics for lightning
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, color, 1);

        for (let i = 0; i < bounces; i++) {
            // Find nearest enemy not in chain
            const enemies = this.scene.enemySpawner?.enemies?.filter(
                e => e.isActive && !chain.includes(e)
            ) || [];

            let nearest = null;
            let minDist = range;

            enemies.forEach(e => {
                const dist = Phaser.Math.Distance.Between(
                    current.x,
                    current.y,
                    e.x,
                    e.y
                );
                if (dist < minDist) {
                    minDist = dist;
                    nearest = e;
                }
            });

            if (nearest) {
                // Deal damage
                nearest.takeDamage(damage);

                // Draw lightning bolt
                graphics.lineBetween(current.x, current.y, nearest.x, nearest.y);

                // Add some jagged effect
                const midX = (current.x + nearest.x) / 2 + Phaser.Math.Between(-20, 20);
                const midY = (current.y + nearest.y) / 2 + Phaser.Math.Between(-20, 20);
                graphics.lineBetween(current.x, current.y, midX, midY);
                graphics.lineBetween(midX, midY, nearest.x, nearest.y);

                current = nearest;
                chain.push(current);
            } else {
                break; // No more targets
            }
        }

        // Fade out lightning
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 300,
            onComplete: () => graphics.destroy()
        });
    }
}
