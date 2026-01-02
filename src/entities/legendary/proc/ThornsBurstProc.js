import { ProcLegendary } from './ProcLegendary.js';

/**
 * ThornsBurstProc
 * 
 * When taking damage, chance to reflect damage in an area around the player.
 * 
 * Trigger: On player damaged
 * Effect: Area damage around player
 */
export class ThornsBurstProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'player-damaged';
    }

    onTrigger({ amount }) {
        this.markTriggered();
        this.createThornsBurst(amount);
    }

    createThornsBurst(damageTaken) {
        const player = this.scene.player;
        if (!player) return;

        const radius = this.config.radius || 180;
        const damageMultiplier = this.config.damageMultiplier || 2.0;
        const reflectDamage = Math.floor(damageTaken * damageMultiplier);
        const color = this.config.color || 0x8B4513;

        // Visual burst effect
        const burst = this.scene.add.circle(player.x, player.y, 10, color, 0.6);

        this.scene.tweens.add({
            targets: burst,
            scale: radius / 10,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => burst.destroy()
        });

        // Create thorn particles
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const thorn = this.scene.add.rectangle(
                player.x,
                player.y,
                4,
                20,
                color,
                0.8
            );
            thorn.rotation = angle;

            this.scene.tweens.add({
                targets: thorn,
                x: player.x + Math.cos(angle) * radius,
                y: player.y + Math.sin(angle) * radius,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => thorn.destroy()
            });
        }

        // Damage nearby enemies
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                enemy.x,
                enemy.y
            );

            if (dist <= radius) {
                enemy.takeDamage(reflectDamage);
            }
        });

        // Small screen shake
        this.scene.cameras.main.shake(150, 0.003);
    }
}
