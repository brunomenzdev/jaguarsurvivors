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
        this.floatPhase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.002;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite
        );

        this.sprite.setScale(this.config.scale || 0.4);
        this.sprite.setAlpha(0.85);
        this.sprite.setDepth(player.depth + 1);

        // Add glow effect - ethereal appearance
        this.glow = this.scene.add.circle(this.sprite.x, this.sprite.y, 20, 0x00FFFF, 0.2);
        this.glow.setDepth(player.depth);
    }

    updatePosition(delta) {
        const player = this.scene.player;
        if (!player) return;

        // Organic floating around player
        this.floatPhase += delta * this.floatSpeed;

        // Multi-frequency sine waves for more "random" movement
        const orbitX = Math.cos(this.floatPhase) * 60 + Math.sin(this.floatPhase * 2.5) * 20;
        const orbitY = Math.sin(this.floatPhase * 1.2) * 60 + Math.cos(this.floatPhase * 3.1) * 15;

        const targetX = player.x + orbitX;
        const targetY = player.y + orbitY - 40; // Float slightly above center

        // Smooth responsive follow
        this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, 0.08);
        this.sprite.y = Phaser.Math.Linear(this.sprite.y, targetY, 0.08);

        // Update glow position
        if (this.glow) {
            this.glow.setPosition(this.sprite.x, this.sprite.y);
            this.glow.setAlpha(0.15 + Math.sin(this.floatPhase * 2) * 0.05);
        }
    }

    destroy() {
        if (this.glow) {
            this.glow.destroy();
            this.glow = null;
        }
        super.destroy();
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
