import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * BuffTotemGadget
 * 
 * A stationary totem placed at the player's location that provides a damage buff
 * when the player is within its radius.
 * 
 * Behavior:
 * - Placed at player's position on activation
 * - Creates visible aura circle
 * - Buffs player damage when in range
 * - Removes buff when player leaves range
 */
export class BuffTotemGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.position = null;
        this.buffApplied = false;
    }

    createVisuals() {
        const player = this.scene.player;

        // Create totem sprite
        const totem = this.scene.add.sprite(
            player.x,
            player.y,
            this.config.sprite
        );
        totem.setScale(1.2);
        totem.setTint(0xFFD700); // Golden totem

        // Create aura circle
        const radius = this.config.radius || 200;
        const aura = this.scene.add.circle(
            totem.x,
            totem.y,
            radius,
            0xFFD700,
            0.15
        );

        // Add pulsing animation to aura
        this.scene.tweens.add({
            targets: aura,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.sprites.push(totem, aura);
        this.position = { x: totem.x, y: totem.y };
    }

    update(delta) {
        if (!this.isActive || !this.position) return;

        const player = this.scene.player;
        if (!player) return;

        const radius = this.config.radius || 200;
        const dist = Phaser.Math.Distance.Between(
            this.position.x,
            this.position.y,
            player.x,
            player.y
        );

        // Apply or remove buff based on distance
        if (dist <= radius) {
            this.applyBuff(player);
        } else {
            this.removeBuff(player);
        }
    }

    applyBuff(player) {
        if (!this.buffApplied) {
            const damageBonus = this.config.damageBonus || 0.5;
            player.stats.damageStat.addMultiplier(damageBonus);
            this.buffApplied = true;

            // Visual feedback - golden tint on player
            if (player.sprite) {
                player.sprite.setTint(0xFFD700);
            }

            // Create buff particles around player
            this.createBuffParticles(player);

            console.debug('Buff Totem: Applied damage buff', { bonus: damageBonus });
        }
    }

    removeBuff(player) {
        if (this.buffApplied) {
            const damageBonus = this.config.damageBonus || 0.5;
            player.stats.damageStat.addMultiplier(-damageBonus);
            this.buffApplied = false;

            // Remove visual tint
            if (player.sprite) {
                player.sprite.clearTint();
            }

            console.debug('Buff Totem: Removed damage buff');
        }
    }

    createBuffParticles(player) {
        // Golden particles rising around player
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = player.x + Math.cos(angle) * 25;
            const py = player.y + Math.sin(angle) * 25;

            const particle = this.scene.add.graphics();
            particle.fillStyle(0xFFD700, 0.8);
            particle.fillCircle(px, py, 4);

            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 400,
                delay: i * 50,
                onComplete: () => particle.destroy()
            });
        }
    }

    destroy() {
        if (!this.isActive) return;

        // Make sure to remove buff if active
        if (this.buffApplied && this.scene && this.scene.player) {
            this.removeBuff(this.scene.player);
        }
        super.destroy();
    }
}
