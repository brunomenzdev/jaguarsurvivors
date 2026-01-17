import { ProcLegendary } from './ProcLegendary.js';

/**
 * ExplosionOnKillProc
 * 
 * Enemies explode on death, dealing area damage to nearby enemies.
 * Enhanced with shockwave ring, debris particles, and multi-layered explosion.
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
        // No chance check - always triggers on kill

        this.markTriggered();
        this.createExplosion(enemy.x, enemy.y);
    }

    createExplosion(x, y) {
        const radius = this.config.radius || 120;
        const damage = this.config.damage || 60;
        const color = this.config.color || 0xFF4500;

        // Multi-layered explosion VFX
        const graphics = this.scene.add.graphics();

        // Central bright flash
        const flash = this.scene.add.graphics();
        flash.fillStyle(0xFFFFFF, 1);
        flash.fillCircle(x, y, 30);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 100,
            onComplete: () => flash.destroy()
        });

        // Inner fireball
        const fireball = this.scene.add.graphics();
        fireball.fillStyle(0xFFAA00, 0.9);
        fireball.fillCircle(x, y, 20);

        this.scene.tweens.add({
            targets: fireball,
            alpha: 0,
            scaleX: radius / 20,
            scaleY: radius / 20,
            duration: 300,
            ease: 'Quad.Out',
            onComplete: () => fireball.destroy()
        });

        // Shockwave ring animation
        let waveRadius = 0;
        this.scene.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: 350,
            ease: 'Expo.Out',
            onUpdate: (tween) => {
                const progress = tween.getValue();
                waveRadius = progress * radius;

                graphics.clear();

                // Outer shockwave
                const alpha = 1 - progress;
                graphics.lineStyle(5 - progress * 4, color, alpha);
                graphics.strokeCircle(x, y, waveRadius);

                // Secondary wave
                if (progress > 0.2 && progress < 0.8) {
                    graphics.lineStyle(2, 0xFFAA00, alpha * 0.6);
                    graphics.strokeCircle(x, y, waveRadius * 0.6);
                }
            },
            onComplete: () => graphics.destroy()
        });

        // Debris particles
        this.createDebrisParticles(x, y, radius, color);

        // Damage nearby enemies
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);

            if (dist <= radius) {
                enemy.takeDamage(damage, false, this.scene.player);

                // Push back effect
                const angle = Phaser.Math.Angle.Between(x, y, enemy.x, enemy.y);
                const pushForce = (1 - dist / radius) * 50;
                if (enemy.body) {
                    enemy.body.velocity.x += Math.cos(angle) * pushForce;
                    enemy.body.velocity.y += Math.sin(angle) * pushForce;
                }
            }
        });

        // Screen shake
        this.scene.cameras.main.shake(150, 0.008);

        // Play explosion sound if available
        if (this.scene.audio) {
            this.scene.audio.play('hit');
        }
    }

    createDebrisParticles(x, y, radius, color) {
        // Simple radial particle burst - no movement, just fade
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const dist = radius * 0.3 + Math.random() * radius * 0.3;
            const px = x + Math.cos(angle) * dist;
            const py = y + Math.sin(angle) * dist;

            const particle = this.scene.add.graphics();
            const colors = [0xFF4500, 0xFF6600, 0xFFAA00];
            const particleColor = colors[Math.floor(Math.random() * colors.length)];

            particle.fillStyle(particleColor, 0.9);
            particle.fillCircle(px, py, 4 + Math.random() * 3);

            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 200 + Math.random() * 100,
                onComplete: () => particle.destroy()
            });
        }
    }
}
