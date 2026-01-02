import { ProcLegendary } from './ProcLegendary.js';

/**
 * ExplosionOnKillProc
 * 
 * Enemies explode on death, dealing area damage to nearby enemies.
 * 
 * Trigger: On enemy killed
 * Effect: Explosion damage in radius
 */
export class ExplosionOnKillProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'enemy-killed';
    }

    onTrigger({ enemy, killer }) {
        if (!enemy) return;

        this.markTriggered();
        this.createExplosion(enemy.x, enemy.y);
    }

    createExplosion(x, y) {
        const radius = this.config.radius || 120;
        const damage = this.config.damage || 60;
        const color = this.config.color || 0xFF4500;

        // Visual explosion
        const explosion = this.scene.add.circle(x, y, 10, color, 0.8);

        this.scene.tweens.add({
            targets: explosion,
            scale: radius / 10,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => explosion.destroy()
        });

        // Add flash effect
        const flash = this.scene.add.circle(x, y, radius * 0.5, 0xFFFFFF, 0.8);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 1.5,
            duration: 200,
            onComplete: () => flash.destroy()
        });

        // Damage nearby enemies
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);

            if (dist <= radius) {
                enemy.takeDamage(damage);
            }
        });

        // Screen shake
        this.scene.cameras.main.shake(200, 0.005);

        // Play explosion sound if available
        if (this.scene.sound && this.scene.sound.get('explosion')) {
            this.scene.sound.play('explosion', { volume: 0.3 });
        }
    }
}
