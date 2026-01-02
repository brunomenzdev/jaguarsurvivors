import { ProcLegendary } from './ProcLegendary.js';

/**
 * FrostNovaProc
 * 
 * Chance to trigger a frost explosion that freezes enemies in an area.
 * 
 * Trigger: On enemy damaged
 * Effect: Area freeze and damage
 */
export class FrostNovaProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'enemy-damaged';
    }

    onTrigger({ enemy, amount, isCritical, attacker }) {
        if (!enemy || !enemy.isActive) return;

        this.markTriggered();
        this.executeFrostNova(enemy);
    }

    executeFrostNova(center) {
        const radius = this.config.radius || 150;
        const damage = this.config.damage || 20;
        const freezeDuration = this.config.freezeDuration || 2000;
        const color = this.config.color || 0x66AAFF;

        // Visual circle expansion
        const circle = this.scene.add.circle(center.x, center.y, 10, color, 0.5);
        this.scene.tweens.add({
            targets: circle,
            scale: radius / 10,
            alpha: 0,
            duration: 400,
            onComplete: () => circle.destroy()
        });

        // Hit enemies in radius
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                center.x,
                center.y,
                enemy.x,
                enemy.y
            );

            if (dist <= radius) {
                // Deal damage
                enemy.takeDamage(damage);

                // Apply freeze (slow)
                this.freezeEnemy(enemy, freezeDuration);
            }
        });
    }

    freezeEnemy(enemy, duration) {
        if (!enemy.enemy) return;

        const originalSpeed = enemy.enemy.speed;

        // Stop the enemy
        enemy.enemy.speed = 0;

        // Visual tint
        if (enemy.sprite) {
            enemy.sprite.setTint(0x66AAFF);
        }

        // Restore after duration
        this.scene.time.delayedCall(duration, () => {
            if (enemy.isActive && enemy.enemy) {
                enemy.enemy.speed = originalSpeed;

                if (enemy.sprite) {
                    enemy.sprite.clearTint();
                }
            }
        });
    }
}
