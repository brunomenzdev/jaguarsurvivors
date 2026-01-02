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
        const color = this.config.color || 0xFF0000;

        // Create floating heal number
        const healText = this.scene.add.text(x, y - 20, '+HP', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 3
        });
        healText.setOrigin(0.5);

        this.scene.tweens.add({
            targets: healText,
            y: y - 60,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => healText.destroy()
        });

        // Create particle effect
        for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.circle(
                x + Phaser.Math.Between(-10, 10),
                y + Phaser.Math.Between(-10, 10),
                3,
                color,
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                y: y - 40,
                alpha: 0,
                duration: 600,
                delay: i * 50,
                onComplete: () => particle.destroy()
            });
        }
    }
}
