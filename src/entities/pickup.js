
import { CONFIG } from '../config.js';

export class Pickup extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type) {
        super(scene, x, y);
        this.scene = scene;
        this.type = type;
        this.config = CONFIG.pickups.types[type];

        // Physics
        scene.physics.world.enable(this);
        this.body.setCircle(15);
        this.body.setOffset(-15, -15);

        // Visuals
        this.createVisuals();

        // Floating Tween
        this.startFloating();

        // Add to scene
        scene.add.existing(this);

        // Auto-scale in
        this.setScale(0);
        scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }

    createVisuals() {
        // Background Shape
        let shape;
        const color = this.config.color;

        if (this.config.shape === 'circle') {
            shape = this.scene.add.circle(0, 0, 15, color);
        } else {
            shape = this.scene.add.rectangle(0, 0, 30, 30, color);
        }

        // Icon / Text
        const icon = this.scene.add.text(0, 0, this.config.icon, {
            fontSize: '20px'
        }).setOrigin(0.5);

        this.add([shape, icon]);

        // Pulse effect
        this.scene.tweens.add({
            targets: shape,
            alpha: 0.8,
            yoyo: true,
            duration: 500,
            loop: -1
        });
    }

    startFloating() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            yoyo: true,
            duration: 1000,
            ease: 'Sine.easeInOut',
            repeat: -1
        });
    }

    collect() {
        // Effects handled by caller (GameScene) or here?
        // Let's handle generic visuals here, logic in Scene or manager.
        // Actually, logical separation: Entity handles itself.

        // Visual
        this.scene.tweens.add({
            targets: this,
            scale: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy()
        });

        return this.config;
    }
}
