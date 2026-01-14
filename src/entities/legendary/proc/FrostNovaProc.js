import { ProcLegendary } from './ProcLegendary.js';

/**
 * FrostNovaProc
 * 
 * Chance to trigger a frost explosion that freezes enemies in an area.
 * Enhanced with expanding ice ring, crystal particles, and central flash.
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
        if (!this.canTrigger() || !this.rollChance()) return;

        this.markTriggered();
        this.executeFrostNova(enemy);
    }

    executeFrostNova(center) {
        const radius = this.config.radius || 150;
        const damage = this.config.damage || 20;
        const freezeDuration = this.config.freezeDuration || 2000;
        const color = this.config.color || 0x66AAFF;

        // Create graphics for enhanced VFX
        const graphics = this.scene.add.graphics();

        // Central flash (white -> blue)
        const flash = this.scene.add.graphics();
        flash.fillStyle(0xFFFFFF, 1);
        flash.fillCircle(center.x, center.y, 25);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 150,
            onComplete: () => flash.destroy()
        });

        // Expanding ice ring animation
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

                // Outer expanding ring
                const alpha = 1 - progress;
                graphics.lineStyle(6 - progress * 4, color, alpha);
                graphics.strokeCircle(center.x, center.y, waveRadius);

                // Inner ring
                if (progress < 0.6) {
                    graphics.lineStyle(3, 0xAADDFF, alpha * 0.7);
                    graphics.strokeCircle(center.x, center.y, waveRadius * 0.7);
                }

                // Filled center fading
                if (progress < 0.4) {
                    graphics.fillStyle(0x88CCFF, (0.4 - progress) * 0.6);
                    graphics.fillCircle(center.x, center.y, waveRadius * 0.4);
                }
            },
            onComplete: () => graphics.destroy()
        });

        // Ice crystal particles
        this.createIceCrystals(center.x, center.y, radius, color);

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

                // Individual freeze VFX
                this.createFreezeEffect(enemy.x, enemy.y);
            }
        });
    }

    createIceCrystals(x, y, radius, color) {
        const crystalCount = 8;

        for (let i = 0; i < crystalCount; i++) {
            const angle = (i / crystalCount) * Math.PI * 2;
            const dist = radius * (0.3 + Math.random() * 0.7);

            const crystal = this.scene.add.graphics();
            crystal.fillStyle(0xCCEEFF, 0.9);

            // Draw small diamond/crystal shape
            const size = 4 + Math.random() * 4;
            crystal.beginPath();
            crystal.moveTo(x, y - size);
            crystal.lineTo(x + size * 0.6, y);
            crystal.lineTo(x, y + size);
            crystal.lineTo(x - size * 0.6, y);
            crystal.closePath();
            crystal.fillPath();

            const targetX = x + Math.cos(angle) * dist;
            const targetY = y + Math.sin(angle) * dist;

            this.scene.tweens.add({
                targets: crystal,
                x: targetX - x,
                y: targetY - y,
                alpha: 0,
                angle: Phaser.Math.Between(-180, 180),
                duration: 400 + Math.random() * 200,
                ease: 'Quad.Out',
                onComplete: () => crystal.destroy()
            });
        }
    }

    createFreezeEffect(x, y) {
        const freezeGfx = this.scene.add.graphics();
        freezeGfx.fillStyle(0x88CCFF, 0.6);
        freezeGfx.fillCircle(x, y, 20);

        this.scene.tweens.add({
            targets: freezeGfx,
            alpha: 0,
            duration: 300,
            onComplete: () => freezeGfx.destroy()
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

        // Add freeze overlay crystals
        const iceOverlay = this.scene.add.graphics();
        this.drawIceOverlay(iceOverlay, enemy);

        // Timer for persistent ice particles
        const iceTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                if (enemy.isActive) {
                    this.createIceDrip(enemy.x, enemy.y);
                }
            },
            repeat: Math.floor(duration / 200)
        });

        // Restore after duration
        this.scene.time.delayedCall(duration, () => {
            if (iceOverlay) iceOverlay.destroy();
            iceTimer.remove();

            if (enemy.isActive && enemy.enemy) {
                enemy.enemy.speed = originalSpeed;

                if (enemy.sprite) {
                    enemy.sprite.clearTint();
                }
            }
        });
    }

    drawIceOverlay(graphics, enemy) {
        graphics.clear();
        graphics.fillStyle(0xAADDFF, 0.4);

        const bounds = enemy.sprite ? enemy.sprite.getBounds() : { x: enemy.x - 20, y: enemy.y - 20, width: 40, height: 40 };

        // Draw some "ice blocks" over the enemy
        for (let i = 0; i < 3; i++) {
            const ix = enemy.x + Phaser.Math.Between(-15, 15);
            const iy = enemy.y + Phaser.Math.Between(-15, 15);
            const size = Phaser.Math.Between(10, 20);
            graphics.fillRoundedRect(ix - size / 2, iy - size / 2, size, size, 4);
        }
    }

    createIceDrip(x, y) {
        const p = this.scene.add.graphics();
        p.fillStyle(0xCCEEFF, 0.8);
        p.fillCircle(x + Phaser.Math.Between(-15, 15), y + Phaser.Math.Between(-10, 10), 3);

        this.scene.tweens.add({
            targets: p,
            y: '+=15',
            alpha: 0,
            duration: 600,
            onComplete: () => p.destroy()
        });
    }
}
