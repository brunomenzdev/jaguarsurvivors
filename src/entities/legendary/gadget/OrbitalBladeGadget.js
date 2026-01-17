import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * OrbitalBladeGadget
 * 
 * A spinning blade that orbits around the player, damaging enemies on contact.
 * 
 * Behavior:
 * - Orbits at fixed radius
 * - Rotates continuously
 * - Damages enemies on collision with internal cooldown per enemy
 */
export class OrbitalBladeGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.angle = 0;
        this.lastHitTime = {}; // Track per-enemy cooldown
    }

    createVisuals() {
        const player = this.scene.player;

        const sprite = this.scene.physics.add.image(
            player.x,
            player.y,
            this.config.sprite
        );

        sprite.setScale(this.config.scale || 1.0);

        this.sprites.push(sprite);

        // Add to gadget manager's projectile group for collision
        if (this.scene.gadgetManager && this.scene.gadgetManager.projectileGroup) {
            this.scene.gadgetManager.projectileGroup.add(sprite);
        }

        sprite.setData('gadgetRef', this);
    }

    update(delta) {
        if (!this.isActive || this.sprites.length === 0) return;

        const player = this.scene.player;
        if (!player) return;

        const sprite = this.sprites[0];
        const radius = this.config.radius || 100;
        const speed = this.config.speed || 2;

        this.angle -= speed * (delta / 1000);

        const x = player.x + Math.cos(this.angle) * radius;
        const y = player.y + Math.sin(this.angle) * radius;

        sprite.setPosition(x, y);
        // Spin the sprite on its own axis
        sprite.rotation += 0.01;
    }

    /**
     * Called when the blade hits an enemy.
     * @param {Object} enemy - The enemy entity
     */
    onHit(enemy) {
        const now = this.scene.time.now;
        const enemyId = enemy.container?.id || enemy.id || 'unknown';
        const hitCooldown = 500; // 500ms cooldown per enemy

        // Check per-enemy cooldown
        if (!this.lastHitTime[enemyId] || now - this.lastHitTime[enemyId] > hitCooldown) {
            const damage = this.config.damage || 50;
            enemy.takeDamage(damage, false, this.scene.player);
            this.lastHitTime[enemyId] = now;
        }
    }
}
