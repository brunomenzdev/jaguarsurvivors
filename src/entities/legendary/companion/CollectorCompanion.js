import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * CollectorCompanion
 * 
 * A companion that automatically collects XP gems and pickups in a larger radius.
 * 
 * Behavior:
 * - Follows player with offset
 * - Scans for collectibles in extended radius
 * - Pulls collectibles toward player
 */
export class CollectorCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.collectionTimer = 0;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite || 'pickup_xp'
        );

        this.sprite.setScale(this.config.scale || 1.0);
        this.sprite.setTint(this.config.tint || 0xFFD700);

        // Add floating animation
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add rotation
        this.scene.tweens.add({
            targets: this.sprite,
            rotation: Math.PI * 2,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    updateBehavior(delta) {
        this.collectionTimer += delta;

        const collectionRate = this.config.collectionRate || 100;

        if (this.collectionTimer >= collectionRate) {
            this.collectNearbyItems();
            this.collectionTimer = 0;
        }
    }

    collectNearbyItems() {
        const player = this.scene.player;
        if (!player) return;

        const collectionRadius = this.config.collectionRadius || 400;

        // Collect XP gems
        if (this.scene.xpGems) {
            this.scene.xpGems.forEach(gem => {
                if (!gem.isBeingCollected) {
                    const dist = Phaser.Math.Distance.Between(
                        this.sprite.x,
                        this.sprite.y,
                        gem.x,
                        gem.y
                    );

                    if (dist <= collectionRadius) {
                        // Pull gem toward player
                        gem.isBeingCollected = true;

                        this.scene.tweens.add({
                            targets: gem,
                            x: player.x,
                            y: player.y,
                            duration: 300,
                            ease: 'Power2',
                            onComplete: () => {
                                if (gem.active) {
                                    gem.collect();
                                }
                            }
                        });
                    }
                }
            });
        }

        // Collect pickups
        if (this.scene.pickupSystem && this.scene.pickupSystem.pickups) {
            this.scene.pickupSystem.pickups.forEach(pickup => {
                if (pickup.active) {
                    const dist = Phaser.Math.Distance.Between(
                        this.sprite.x,
                        this.sprite.y,
                        pickup.x,
                        pickup.y
                    );

                    if (dist <= collectionRadius) {
                        // Pull pickup toward player
                        this.scene.tweens.add({
                            targets: pickup,
                            x: player.x,
                            y: player.y,
                            duration: 300,
                            ease: 'Power2'
                        });
                    }
                }
            });
        }
    }
}
