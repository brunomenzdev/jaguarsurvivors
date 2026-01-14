import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * WispCompanion
 * 
 * A magical ice wisp that fires freezing projectiles.
 * 
 * Behavior:
 * - Orbits gently around player
 * - Fires icy projectiles that slow enemies
 * - Has ethereal glowing appearance
 */
export class WispCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.attackTimer = 0;
        this.projectiles = [];
        this.orbitAngle = 0;
        this.orbitRadius = 50;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite
        );

        this.sprite.setScale(this.config.scale || 0.8);
        this.sprite.setTint(this.config.tint || 0xADD8E6);
        this.sprite.setDepth(player.depth + 1);
        this.sprite.setAlpha(0.9);

        // Create glow effect
        this.glowGraphics = this.scene.add.graphics();
    }

    updatePosition(delta) {
        const player = this.scene.player;
        if (!player) return;

        // Gentle orbit motion
        this.orbitAngle += 0.015;

        const orbitX = Math.cos(this.orbitAngle) * this.orbitRadius;
        const orbitY = Math.sin(this.orbitAngle * 0.7) * (this.orbitRadius * 0.5);

        const targetX = player.x + this.offset.x + orbitX;
        const targetY = player.y + this.offset.y + orbitY;

        // Smooth follow
        this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, 0.08);
        this.sprite.y = Phaser.Math.Linear(this.sprite.y, targetY, 0.08);

        // Pulsing alpha
        this.sprite.setAlpha(0.7 + Math.sin(this.orbitAngle * 3) * 0.2);

        // Update glow
        this.updateGlow();
    }

    updateGlow() {
        if (!this.glowGraphics) return;

        this.glowGraphics.clear();

        // Outer glow
        this.glowGraphics.fillStyle(0x66CCFF, 0.15);
        this.glowGraphics.fillCircle(this.sprite.x, this.sprite.y, 25);

        // Inner glow
        this.glowGraphics.fillStyle(0xAADDFF, 0.25);
        this.glowGraphics.fillCircle(this.sprite.x, this.sprite.y, 12);
    }

    updateBehavior(delta) {
        this.attackTimer += delta;

        const attackRate = this.config.attackRate || 2000;

        if (this.attackTimer >= attackRate) {
            this.attack();
            this.attackTimer = 0;
        }

        // Clean up destroyed projectiles
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    attack() {
        const range = this.config.range || 400;
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        if (enemies.length === 0) return;

        // Find nearest enemy
        let nearest = null;
        let minDist = range;

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.x,
                enemy.y
            );

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        });

        if (nearest) {
            this.fireIceProjectile(nearest);
        }
    }

    fireIceProjectile(target) {
        // Create icy projectile with graphics
        const projGfx = this.scene.add.graphics();
        projGfx.fillStyle(0x88DDFF, 0.9);
        projGfx.fillCircle(0, 0, 8);
        projGfx.fillStyle(0xFFFFFF, 0.7);
        projGfx.fillCircle(0, 0, 4);

        // Create container for projectile
        const proj = this.scene.physics.add.image(
            this.sprite.x,
            this.sprite.y,
            'pixel'
        );
        proj.setVisible(false);

        // Add graphics to scene and make it follow proj
        projGfx.setPosition(this.sprite.x, this.sprite.y);

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            target.x,
            target.y
        );

        const speed = this.config.projectileSpeed || 400;
        proj.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Trail particles
        const trailEvent = this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                if (proj.active) {
                    projGfx.setPosition(proj.x, proj.y);

                    // Leave small trail particle
                    const particle = this.scene.add.graphics();
                    particle.fillStyle(0xAADDFF, 0.5);
                    particle.fillCircle(proj.x, proj.y, 3);

                    this.scene.tweens.add({
                        targets: particle,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => particle.destroy()
                    });
                }
            },
            loop: true
        });

        this.projectiles.push(proj);

        const damage = this.config.damage || 20;
        const slowAmount = this.config.effects?.slowAmount || 0.5;
        const slowDuration = this.config.effects?.duration || 2000;

        // Setup collision
        this.scene.physics.add.overlap(
            proj,
            this.scene.enemySpawner.group,
            (projectile, enemySprite) => {
                const enemy = enemySprite.getData('parent');
                if (enemy && enemy.isActive) {
                    enemy.takeDamage(damage);

                    // Apply slow effect
                    if (enemy.applySlow) {
                        enemy.applySlow(slowAmount, slowDuration);
                    } else if (enemy.speedMultiplier !== undefined) {
                        // Fallback slow implementation
                        const originalSpeed = enemy.speedMultiplier || 1;
                        enemy.speedMultiplier = originalSpeed * (1 - slowAmount);
                        this.scene.time.delayedCall(slowDuration, () => {
                            if (enemy.isActive) {
                                enemy.speedMultiplier = originalSpeed;
                            }
                        });
                    }

                    // Freeze VFX - simple fade at impact point
                    const freezeGfx = this.scene.add.graphics();
                    freezeGfx.fillStyle(0x66CCFF, 0.7);
                    freezeGfx.fillCircle(enemy.x, enemy.y, 15);
                    freezeGfx.fillStyle(0xAADDFF, 0.5);
                    freezeGfx.fillCircle(enemy.x, enemy.y, 25);

                    this.scene.tweens.add({
                        targets: freezeGfx,
                        alpha: 0,
                        duration: 250,
                        onComplete: () => freezeGfx.destroy()
                    });

                    trailEvent.remove();
                    projGfx.destroy();
                    projectile.destroy();
                }
            }
        );

        // Auto-destroy after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (proj.active) {
                trailEvent.remove();
                projGfx.destroy();
                proj.destroy();
            }
        });
    }

    destroy() {
        if (!this.isActive) return;

        // Clean up all projectiles
        this.projectiles.forEach(proj => {
            if (proj.active) proj.destroy();
        });
        this.projectiles = [];

        // Clean up glow
        if (this.glowGraphics) {
            this.glowGraphics.destroy();
            this.glowGraphics = null;
        }

        super.destroy();
    }
}
