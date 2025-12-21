export class EnemyProjectile {
    constructor(scene, x, y, target, enemyConfig) {
        if (!target || !enemyConfig) return;

        this.scene = scene;

        // Calculate angle for rotation
        const angle = Math.atan2(target.y - y, target.x - x);

        // Create sprite based on enemy config
        const color = enemyConfig.projectileColor !== undefined ? enemyConfig.projectileColor : 0xFF0000;
        const scale = enemyConfig.projectileScale || 1.0;

        this.sprite = scene.add.circle(x, y, 5, color);
        this.sprite.setScale(scale);
        this.sprite.setData('parent', this);

        scene.physics.add.existing(this.sprite);

        this.damage = enemyConfig.projectileDamage;

        scene.time.delayedCall(2000, () => {
            if (this.sprite.active) this.destroy();
        });

        const speed = enemyConfig.projectileSpeed || 200;

        this.sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Add rotation animation for visual interest
        scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 1200,
            repeat: -1,
            ease: 'Linear'
        });

        // Add scale pulse effect
        scene.tweens.add({
            targets: this.sprite,
            scale: scale * 1.3,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(delta) {
    }

    destroy() {
        this.sprite.destroy();
    }
}
