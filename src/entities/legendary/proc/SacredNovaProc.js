import { ProcLegendary } from './ProcLegendary.js';

/**
 * SacredNovaProc
 * 
 * Chance to emit a sacred energy nova when player takes damage.
 * 
 * Trigger: On player damaged
 * Effect: Golden expanding wave that damages nearby enemies
 */
export class SacredNovaProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'player-damaged';
    }

    onTrigger({ amount }) {
        if (!this.canTrigger() || !this.rollChance()) return;

        this.markTriggered();
        this.executeSacredNova();
    }

    executeSacredNova() {
        const player = this.scene.player;
        if (!player) return;

        const radius = this.config.radius || 200;
        const damage = this.config.damage || 80;
        const color = this.config.color || 0xFFFF00;

        // VFX: Sacred nova with expanding golden wave
        const graphics = this.scene.add.graphics();

        // Initial flash
        graphics.fillStyle(0xFFFFFF, 0.9);
        graphics.fillCircle(player.x, player.y, 30);

        // Particle burst effect (simulate with multiple small circles)
        const particleCount = 12;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            particles.push({
                x: player.x,
                y: player.y,
                angle: angle,
                dist: 0
            });
        }

        // Animate expansion
        let waveRadius = 0;
        this.scene.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: 400,
            ease: 'Quad.Out',
            onUpdate: (tween) => {
                const progress = tween.getValue();
                waveRadius = progress * radius;

                graphics.clear();

                // Outer wave ring
                const alpha = 1 - progress;
                graphics.lineStyle(6 - progress * 4, color, alpha);
                graphics.strokeCircle(player.x, player.y, waveRadius);

                // Secondary inner wave
                if (progress < 0.7) {
                    graphics.lineStyle(3, 0xFFD700, alpha * 0.7);
                    graphics.strokeCircle(player.x, player.y, waveRadius * 0.6);
                }

                // Central glow (fading)
                if (progress < 0.5) {
                    graphics.fillStyle(0xFFFFAA, (0.5 - progress) * 1.5);
                    graphics.fillCircle(player.x, player.y, 20 * (1 - progress * 2));
                }

                // Draw particles
                particles.forEach(p => {
                    p.dist = waveRadius;
                    const px = player.x + Math.cos(p.angle) * p.dist;
                    const py = player.y + Math.sin(p.angle) * p.dist;

                    graphics.fillStyle(0xFFD700, alpha);
                    graphics.fillCircle(px, py, 4 * (1 - progress));
                });
            },
            onComplete: () => {
                graphics.destroy();
            }
        });

        // Damage enemies in radius
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];
        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            if (dist <= radius) {
                enemy.takeDamage(damage, false, this.scene.player);
            }
        });
    }
}
