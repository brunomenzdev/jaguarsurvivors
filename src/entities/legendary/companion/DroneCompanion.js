import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * DroneCompanion
 * 
 * A hovering drone that follows the player and attacks enemies.
 * Similar to AttackCompanion but with unique visuals and floating animation.
 * 
 * Behavior:
 * - Floats above player with bobbing motion
 * - Fires laser projectiles at nearest enemy
 * - Has futuristic visual style
 */
export class DroneCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.attackTimer = 0;
        this.projectiles = [];
        this.bobPhase = 0;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite
        );

        this.sprite.setScale(this.config.scale || 0.6);
        this.sprite.setDepth(player.depth + 1);

        // Add glow effect
        this.glowGraphics = this.scene.add.graphics();
    }

    updatePosition(delta) {
        const player = this.scene.player;
        if (!player) return;

        // Bobbing animation
        this.bobPhase += 0.08;
        const bobOffset = Math.sin(this.bobPhase) * 8;

        // Smooth follow with bob
        const targetX = player.x + this.offset.x;
        const targetY = player.y + this.offset.y + bobOffset;

        this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, 0.1);
        this.sprite.y = Phaser.Math.Linear(this.sprite.y, targetY, 0.1);

        // Update glow position
        this.updateGlow();
    }

    updateGlow() {
        if (!this.glowGraphics) return;

        this.glowGraphics.clear();
        this.glowGraphics.fillStyle(0x00FFFF, 0.2);
        this.glowGraphics.fillCircle(this.sprite.x, this.sprite.y + 5, 15);
    }

    updateBehavior(delta) {
        this.attackTimer += delta;

        const attackRate = this.config.attackRate || 1500;

        if (this.attackTimer >= attackRate) {
            this.attack();
            this.attackTimer = 0;
        }

        // Clean up destroyed projectiles
        this.projectiles = this.projectiles.filter(p => p.active);
    }

    attack() {
        const range = this.config.range || 300;
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
            this.fireProjectile(nearest);
        }
    }

    fireProjectile(target) {
        // Create laser-style projectile
        const proj = this.scene.physics.add.image(
            this.sprite.x,
            this.sprite.y,
            this.config.projectileSprite || 'weapon_laser_gun'
        );

        proj.setScale(0.5);

        const angle = Phaser.Math.Angle.Between(
            this.sprite.x,
            this.sprite.y,
            target.x,
            target.y
        );

        const speed = this.config.projectileSpeed || 500;
        proj.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        proj.rotation = angle + Math.PI / 2;

        // Add trail effect
        const trail = this.scene.add.graphics();
        trail.lineStyle(2, 0x00FFFF, 0.5);

        const trailUpdate = this.scene.time.addEvent({
            delay: 16,
            callback: () => {
                if (proj.active) {
                    trail.clear();
                    trail.lineStyle(2, 0x00FFFF, 0.3);
                    trail.lineBetween(
                        this.sprite.x, this.sprite.y,
                        proj.x, proj.y
                    );
                } else {
                    trail.destroy();
                    trailUpdate.remove();
                }
            },
            loop: true
        });

        this.projectiles.push(proj);

        const damage = this.config.damage || 35;

        // Setup collision
        this.scene.physics.add.overlap(
            proj,
            this.scene.enemySpawner.group,
            (projectile, enemySprite) => {
                const enemy = enemySprite.getData('parent');
                if (enemy && enemy.isActive) {
                    enemy.takeDamage(damage);

                    // Hit VFX
                    const hitGfx = this.scene.add.graphics();
                    hitGfx.fillStyle(0x00FFFF, 0.8);
                    hitGfx.fillCircle(projectile.x, projectile.y, 10);
                    this.scene.tweens.add({
                        targets: hitGfx,
                        alpha: 0,
                        duration: 150,
                        onComplete: () => hitGfx.destroy()
                    });

                    trail.destroy();
                    projectile.destroy();
                }
            }
        );

        // Auto-destroy after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            if (proj.active) {
                trail.destroy();
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
