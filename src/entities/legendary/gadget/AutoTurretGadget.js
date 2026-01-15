import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * AutoTurretGadget
 * 
 * A floating drone that follows the player and automatically fires at nearby enemies.
 * 
 * Behavior:
 * - Floats near player with offset
 * - Scans for enemies in range
 * - Fires projectiles at nearest enemy
 * - Has fire rate cooldown
 */
export class AutoTurretGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.attackTimer = 0;
    }

    createVisuals() {
        const player = this.scene.player;

        const sprite = this.scene.add.image(
            player.x,
            player.y - 40,
            this.config.sprite
        );

        sprite.setScale(this.config.scale || 0.6);

        this.sprites.push(sprite);
    }

    setupPhysics() {
        // Create projectile group for turret bullets
        this.projectiles = this.scene.physics.add.group();
    }

    update(delta) {
        if (!this.isActive || this.sprites.length === 0) return;

        // Attack logic
        this.attackTimer += delta;
        const fireRate = this.config.fireRate || 1000;

        if (this.attackTimer >= fireRate) {
            this.fire();
            this.attackTimer = 0;
        }
    }

    fire() {
        const sprite = this.sprites[0];
        const range = this.config.range || 400;

        // Find nearest enemy in range
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];
        if (enemies.length === 0) return;

        let nearest = null;
        let minDist = range;

        enemies.forEach(e => {
            const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, e.x, e.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        });

        if (nearest) {
            this.createProjectile(sprite.x, sprite.y, nearest);
        }
    }

    createProjectile(x, y, target) {
        const proj = this.scene.physics.add.image(x, y, this.config.projectileSprite || 'projectile_energy');
        proj.setScale(this.config.projectileScale || 0.5);

        this.projectiles.add(proj);

        const angle = Phaser.Math.Angle.Between(x, y, target.x, target.y);
        const speed = this.config.projectileSpeed || 600;

        proj.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        proj.rotation = angle + Math.PI / 2;

        const damage = this.config.damage || 30;

        // Setup collision with enemies
        this.scene.physics.add.overlap(
            proj,
            this.scene.enemySpawner.group,
            (projectile, enemySprite) => {
                const enemy = enemySprite.getData('parent');
                if (enemy && enemy.isActive) {
                    enemy.takeDamage(damage);
                    projectile.destroy();
                }
            }
        );

        // Auto-destroy after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            if (proj.active) proj.destroy();
        });
    }

}
