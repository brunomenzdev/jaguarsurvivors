import { ProcLegendary } from './ProcLegendary.js';

/**
 * VampireStrikeProc
 * 
 * Chance to heal the player when dealing damage.
 * 
 * Trigger: On enemy damaged
 * Effect: Heal player for percentage of damage dealt
 */
export class VampireStrikeProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'enemy-damaged';
    }

    onTrigger({ enemy, amount, isCritical, attacker }) {
        if (!enemy || !enemy.isActive) return;

        this.markTriggered();
        this.healPlayer(amount);
    }

    healPlayer(damageDealt) {
        const player = this.scene.player;
        if (!player) return;

        const healPercent = this.config.healPercent || 0.5;
        const healAmount = Math.floor(damageDealt * healPercent);

        if (healAmount > 0) {
            player.heal(healAmount);

            // Visual feedback - healing particles
            this.createHealEffect(player.x, player.y);
        }
    }

    createHealEffect(x, y) {
        const player = this.scene.player;
        if (!player) return;

        const color = this.config.color || 0xFF0000;

        // Create floating heal number (bigger)
        const healText = this.scene.add.text(player.x, player.y - 30, '+VIDA', {
            fontSize: '20px',
            fontFamily: 'Anton',
            color: '#FF3333',
            stroke: '#000000',
            strokeThickness: 4
        });
        healText.setOrigin(0.5);

        this.scene.tweens.add({
            targets: healText,
            y: player.y - 80,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => healText.destroy()
        });

        // Blood trail from enemy to player
        const trailGfx = this.scene.add.graphics();
        trailGfx.lineStyle(4, color, 0.8);
        trailGfx.lineBetween(x, y, player.x, player.y);

        this.scene.tweens.add({
            targets: trailGfx,
            alpha: 0,
            duration: 300,
            onComplete: () => trailGfx.destroy()
        });

        // Red glow around player
        const healGlow = this.scene.add.graphics();
        healGlow.fillStyle(color, 0.4);
        healGlow.fillCircle(player.x, player.y, 40);

        this.scene.tweens.add({
            targets: healGlow,
            alpha: 0,
            duration: 400,
            onComplete: () => healGlow.destroy()
        });

        // Blood particles rising to player
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(color, 0.9);
            particle.fillCircle(
                player.x + Phaser.Math.Between(-20, 20),
                player.y + 20,
                4 + Math.random() * 3
            );

            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 500,
                delay: i * 40,
                onComplete: () => particle.destroy()
            });
        }
    }
}
