import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * MineGadget
 * 
 * Gadget that periodically drops mines that explode on enemy contact.
 * 
 * Behavior:
 * - Drops mines at player position periodically
 * - Mines arm after short delay
 * - Explode when enemy touches them
 * - Visual: pulsing circle on ground
 */
export class MineGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.mines = [];
        this.deployTimer = 0;
        this.deployInterval = config.cooldown || 3000;
        this.armingTime = 500; // Time before mine becomes active
    }

    createVisuals() {
        // Mines are created dynamically, no initial visual needed
    }

    update(delta) {
        if (!this.isActive || !this.scene?.player) return;

        this.deployTimer += delta;

        if (this.deployTimer >= this.deployInterval) {
            this.deployMine();
            this.deployTimer = 0;
        }

        // Update existing mines
        this.updateMines(delta);
    }

    deployMine() {
        const player = this.scene.player;
        const mine = {
            x: player.x,
            y: player.y,
            isArmed: false,
            armTimer: 0,
            graphics: this.scene.add.graphics(),
            pulsePhase: 0
        };

        // Initial visual - small circle
        this.drawMine(mine, false);

        // Store mine
        this.mines.push(mine);

        // Create physics body for collision
        mine.collider = this.scene.add.circle(mine.x, mine.y, this.config.radius || 150);
        this.scene.physics.add.existing(mine.collider, true); // Static body
        mine.collider.setVisible(false);

        // Setup collision detection
        mine.overlapHandler = this.scene.physics.add.overlap(
            mine.collider,
            this.scene.enemySpawner.group,
            (collider, enemySprite) => {
                if (mine.isArmed) {
                    this.detonateMine(mine);
                }
            }
        );
    }

    updateMines(delta) {
        this.mines.forEach(mine => {
            if (!mine.isArmed) {
                mine.armTimer += delta;
                if (mine.armTimer >= this.armingTime) {
                    mine.isArmed = true;
                }
            }

            // Pulse animation
            mine.pulsePhase += delta * 0.005;
            this.drawMine(mine, mine.isArmed);
        });
    }

    drawMine(mine, armed) {
        mine.graphics.clear();

        const baseRadius = 20;
        const pulseAmount = Math.sin(mine.pulsePhase) * 5;
        const radius = baseRadius + pulseAmount;

        // Outer glow
        const glowColor = armed ? 0xFF4500 : 0x666666;
        const glowAlpha = armed ? 0.4 : 0.2;
        mine.graphics.fillStyle(glowColor, glowAlpha);
        mine.graphics.fillCircle(mine.x, mine.y, radius + 10);

        // Inner core
        const coreColor = armed ? 0xFF0000 : 0x444444;
        mine.graphics.fillStyle(coreColor, 0.8);
        mine.graphics.fillCircle(mine.x, mine.y, radius);

        // Center dot
        mine.graphics.fillStyle(armed ? 0xFFFF00 : 0x888888, 1);
        mine.graphics.fillCircle(mine.x, mine.y, 5);
    }

    detonateMine(mine) {
        const radius = this.config.radius || 150;
        const damage = this.config.damage || 100;

        // VFX: Explosion
        const explosionGfx = this.scene.add.graphics();

        // Flash
        explosionGfx.fillStyle(0xFFFFFF, 0.8);
        explosionGfx.fillCircle(mine.x, mine.y, radius * 0.3);

        // Shockwave animation
        let waveRadius = 0;
        const expandTween = this.scene.tweens.add({
            targets: { radius: 0 },
            radius: radius,
            duration: 200,
            ease: 'Expo.Out',
            onUpdate: (tween) => {
                waveRadius = tween.getValue();
                explosionGfx.clear();

                // Outer wave
                explosionGfx.lineStyle(4, 0xFF4500, 1 - (waveRadius / radius));
                explosionGfx.strokeCircle(mine.x, mine.y, waveRadius);

                // Inner fire
                explosionGfx.fillStyle(0xFF6600, 0.5 * (1 - waveRadius / radius));
                explosionGfx.fillCircle(mine.x, mine.y, waveRadius * 0.5);
            },
            onComplete: () => {
                explosionGfx.destroy();
            }
        });

        // Damage enemies in radius
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];
        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(mine.x, mine.y, enemy.x, enemy.y);
            if (dist <= radius) {
                enemy.takeDamage(damage, false, this.scene.player);
            }
        });

        // Cleanup mine
        this.removeMine(mine);
    }

    removeMine(mine) {
        mine.graphics.destroy();
        if (mine.collider) mine.collider.destroy();
        if (mine.overlapHandler) this.scene.physics.world.removeCollider(mine.overlapHandler);

        const index = this.mines.indexOf(mine);
        if (index > -1) {
            this.mines.splice(index, 1);
        }
    }

    destroy() {
        if (!this.isActive) return;

        // Clean up all mines
        this.mines.forEach(mine => {
            mine.graphics.destroy();
            if (mine.collider) mine.collider.destroy();
            if (mine.overlapHandler) this.scene.physics.world.removeCollider(mine.overlapHandler);
        });
        this.mines = [];

        super.destroy();
    }
}
