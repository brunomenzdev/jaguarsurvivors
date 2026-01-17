import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * BuffCompanion
 * 
 * A companion that periodically grants buffs to the player.
 * 
 * Behavior:
 * - Follows player with offset
 * - Periodically activates buff
 * - Grants attack speed boost and shield
 * - Visual indicator when buff is active
 */
export class BuffCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.buffCooldownTimer = 0;
        this.buffActive = false;
        this.buffDurationTimer = 0;
        this.aura = null;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite
        );

        this.sprite.setScale(this.config.scale || 0.5);

        // Create aura circle (follows companion)
        this.aura = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            30,
            0x00FF00,
            0.3
        );
        this.aura.setVisible(false);

        // Player buff glow (will be shown when buff is active)
        this.playerGlow = null;

        // Bobbing offset for smooth movement
        this.bobOffset = 0;
    }

    updatePosition(delta) {
        const player = this.scene.player;
        if (!player) return;

        // Bobbing animation
        this.bobOffset += delta * 0.003;
        const bobY = Math.sin(this.bobOffset) * 8;

        // Smooth follow with bob
        const targetX = player.x + this.offset.x;
        const targetY = player.y + this.offset.y + bobY;

        this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, 0.1);
        this.sprite.y = Phaser.Math.Linear(this.sprite.y, targetY, 0.1);

        // Update aura position
        if (this.aura) {
            this.aura.setPosition(this.sprite.x, this.sprite.y);
        }

        // Update player glow if buff is active
        if (this.playerGlow && this.buffActive) {
            this.playerGlow.setPosition(player.x, player.y);
        }
    }

    updateBehavior(delta) {
        const buffDuration = this.config.buffDuration || 5000;
        const buffCooldown = this.config.buffCooldown || 10000;

        if (this.buffActive) {
            // Buff is active
            this.buffDurationTimer += delta;

            if (this.buffDurationTimer >= buffDuration) {
                this.deactivateBuff();
            }
        } else {
            // Buff is on cooldown
            this.buffCooldownTimer += delta;

            if (this.buffCooldownTimer >= buffCooldown) {
                this.activateBuff();
            }
        }
    }

    activateBuff() {
        const player = this.scene.player;
        if (!player) return;

        this.buffActive = true;
        this.buffDurationTimer = 0;

        const attackSpeedBonus = this.config.attackSpeedBonus || 0.3;
        const moveSpeedBonus = this.config.moveSpeedBonus || 0.3; // Default 30% speed boost
        const shieldAmount = this.config.shieldAmount || 50;

        // Apply attack speed buff
        player.stats.attackSpeedStat.addMultiplier(attackSpeedBonus);

        // Apply move speed buff
        player.stats.moveSpeedStat.addMultiplier(moveSpeedBonus);

        // Apply shield (temporary health layer)
        player.shield += shieldAmount;

        // Visual feedback on companion
        if (this.aura) {
            this.aura.setVisible(true);
            this.scene.tweens.add({
                targets: this.aura,
                scale: 1.5,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        // Visual feedback on PLAYER - green glow circle
        this.playerGlow = this.scene.add.graphics();
        this.playerGlow.setDepth(player.depth - 1);
        this.drawPlayerGlow();

        // Tint player green
        if (player.sprite) {
            player.sprite.setTint(0x88FF88);
        }

        // Particle effect
        this.createBuffParticles(player);

        console.debug('Buff Companion: Activated buff', {
            attackSpeed: attackSpeedBonus,
            moveSpeed: moveSpeedBonus,
            shield: shieldAmount
        });
    }

    drawPlayerGlow() {
        if (!this.playerGlow || !this.scene.player) return;

        this.playerGlow.clear();
        this.playerGlow.fillStyle(0x00FF00, 0.35);
        this.playerGlow.fillCircle(0, 0, 50);
        this.playerGlow.fillStyle(0x88FF88, 0.25);
        this.playerGlow.fillCircle(0, 0, 35);
    }

    deactivateBuff() {
        const player = this.scene.player;
        if (!player) return;

        this.buffActive = false;
        this.buffCooldownTimer = 0;

        const attackSpeedBonus = this.config.attackSpeedBonus || 0.3;
        const moveSpeedBonus = this.config.moveSpeedBonus || 0.3;

        // Remove attack speed buff
        player.stats.attackSpeedStat.addMultiplier(-attackSpeedBonus);

        // Remove move speed buff
        player.stats.moveSpeedStat.addMultiplier(-moveSpeedBonus);

        // Clear remaining shield from this source (for simplicity, we clear all shield)
        player.shield = 0;

        // Hide aura
        if (this.aura) {
            this.aura.setVisible(false);
            this.scene.tweens.killTweensOf(this.aura);
        }

        // Remove player glow
        if (this.playerGlow) {
            this.playerGlow.destroy();
            this.playerGlow = null;
        }

        // Remove player tint
        if (player.sprite) {
            player.sprite.clearTint();
        }

        console.debug('Buff Companion: Deactivated buff');
    }

    createBuffParticles(player) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = this.scene.add.circle(
                player.x,
                player.y,
                4,
                0x00FF00,
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                x: player.x + Math.cos(angle) * 40,
                y: player.y + Math.sin(angle) * 40,
                alpha: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }

    destroy() {
        // Remove buff if active
        if (this.buffActive) {
            this.deactivateBuff();
        }

        // Destroy aura
        if (this.aura) {
            this.aura.destroy();
            this.aura = null;
        }

        super.destroy();
    }
}
