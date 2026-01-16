import { CONFIG } from '../config/config.js';

export class Pickup extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.isActive = false;

        // Use ONLY the sprite as per constraints
        this.icon = scene.add.sprite(0, 0, 'pickup_bomb');
        this.icon.setScale(0.5);

        this.add(this.icon);

        // Physics
        scene.physics.world.enable(this);
        this.body.setCircle(15);
        this.body.setOffset(-15, -15);
        this.body.setCollideWorldBounds(true);

        // Hide initially
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;

        scene.add.existing(this);
    }

    spawn(config) {
        const { x, y, type } = config;
        this.type = type;
        this.pickupConfig = CONFIG.pickups.types[type];

        if (!this.pickupConfig) {
            console.error(`[Pickup] Config missing for type: ${type}. Check pickups.config.js.`);
            this.pickupConfig = CONFIG.pickups.types['health_kit'] || { spriteKey: 'pickup_bomb', scale: 1.0 };
        }

        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.body.enable = true;
        this.isActive = true;
        this.alpha = 1;
        this.setScale(0);

        // Kill any residual tweens (e.g. from previous collection)
        this.scene.tweens.killTweensOf([this, this.icon]);

        // Use sprite from config
        const spriteKey = this.pickupConfig.spriteKey || 'pickup_bomb';
        this.icon.setTexture(spriteKey);
        this.icon.setScale(this.pickupConfig.scale || 1.0);

        // Entry state
        this.setScale(1);
        this.alpha = 1;
        this.icon.setScale(this.pickupConfig.scale || 1.0);
    }

    collect() {
        if (!this.isActive) return;
        this.isActive = false;
        this.body.enable = false;
        this.setVisible(false);
        this.setActive(false);
        this.alpha = 0;
        this.setScale(0);

        // Kill all active animations/tweens immediately
        if (this.floatTween) {
            this.floatTween.remove();
            this.floatTween = null;
        }
        if (this.pulseTween) {
            this.pulseTween.remove();
            this.pulseTween = null;
        }
        this.scene.tweens.killTweensOf([this, this.icon]);

        // Reset texture for pooling safety
        this.icon.setTexture('pickup_bomb');

        return this.pickupConfig;
    }

    // Helper for ObjectPool
    reset(config) {
        this.spawn(config);
    }
}
