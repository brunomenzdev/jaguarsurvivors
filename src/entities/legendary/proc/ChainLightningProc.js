import { ProcLegendary } from './ProcLegendary.js';

/**
 * ChainLightningProc
 * 
 * Chance to trigger chain lightning that bounces between enemies.
 * Enhanced with better VFX: thicker bolts, branching, spark particles.
 * 
 * Trigger: On enemy damaged
 * Effect: Lightning chains to nearby enemies, dealing damage
 */
export class ChainLightningProc extends ProcLegendary {
    registerTriggers() {
        this.triggerEvent = 'enemy-damaged';
    }

    onTrigger({ enemy, amount, isCritical, attacker }) {
        if (!enemy || !enemy.isActive) return;
        if (!this.canTrigger() || !this.rollChance()) return;

        this.markTriggered();
        this.executeChainLightning(enemy);
    }

    executeChainLightning(initialTarget) {
        const range = this.config.range || 200;
        const bounces = this.config.bounces || 3;
        const damage = this.config.damage || 40;
        const baseColor = this.config.color || 0x00FFFF;

        // Build chain
        let current = initialTarget;
        const chain = [current];
        const chainPositions = [{ x: current.x, y: current.y }];

        // Create graphics for lightning
        const graphics = this.scene.add.graphics();

        for (let i = 0; i < bounces; i++) {
            // Find nearest enemy not in chain
            const enemies = this.scene.enemySpawner?.enemies?.filter(
                e => e.isActive && !chain.includes(e)
            ) || [];

            let nearest = null;
            let minDist = range;

            enemies.forEach(e => {
                const dist = Phaser.Math.Distance.Between(
                    current.x,
                    current.y,
                    e.x,
                    e.y
                );
                if (dist < minDist) {
                    minDist = dist;
                    nearest = e;
                }
            });

            if (nearest) {
                // Deal damage
                nearest.takeDamage(damage, false, this.scene.player);

                chainPositions.push({ x: nearest.x, y: nearest.y });

                // Draw enhanced lightning bolt
                this.drawLightningBolt(graphics, current.x, current.y, nearest.x, nearest.y, baseColor);

                // Spark particle at impact point
                this.createSparkEffect(nearest.x, nearest.y, baseColor);

                current = nearest;
                chain.push(current);
            } else {
                break; // No more targets
            }
        }

        // Animate lightning with flickering
        let flickerCount = 0;
        const flickerEvent = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                flickerCount++;
                graphics.clear();

                // Redraw with slight variation
                for (let i = 0; i < chainPositions.length - 1; i++) {
                    const from = chainPositions[i];
                    const to = chainPositions[i + 1];
                    this.drawLightningBolt(graphics, from.x, from.y, to.x, to.y, baseColor);
                }

                graphics.setAlpha(1 - (flickerCount / 6));

                if (flickerCount >= 6) {
                    flickerEvent.remove();
                    graphics.destroy();
                }
            },
            loop: true
        });
    }

    drawLightningBolt(graphics, x1, y1, x2, y2, color) {
        const segments = 4;
        const points = [{ x: x1, y: y1 }];

        // Create jagged path
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const baseX = x1 + (x2 - x1) * t;
            const baseY = y1 + (y2 - y1) * t;
            const jitter = 25;

            points.push({
                x: baseX + Phaser.Math.Between(-jitter, jitter),
                y: baseY + Phaser.Math.Between(-jitter, jitter)
            });
        }
        points.push({ x: x2, y: y2 });

        // Draw main bolt (thick, bright)
        graphics.lineStyle(4, 0xFFFFFF, 0.9);
        for (let i = 0; i < points.length - 1; i++) {
            graphics.lineBetween(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        // Draw outer glow
        graphics.lineStyle(8, color, 0.4);
        for (let i = 0; i < points.length - 1; i++) {
            graphics.lineBetween(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        // Draw core
        graphics.lineStyle(2, 0xFFFFFF, 1);
        for (let i = 0; i < points.length - 1; i++) {
            graphics.lineBetween(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        // Branch lightning (2 small branches)
        const branchChance = 0.4;
        for (let i = 1; i < points.length - 1; i++) {
            if (Math.random() < branchChance) {
                const branchAngle = Phaser.Math.Between(-60, 60) * (Math.PI / 180);
                const branchLength = Phaser.Math.Between(15, 35);
                const branchEndX = points[i].x + Math.cos(branchAngle) * branchLength;
                const branchEndY = points[i].y + Math.sin(branchAngle) * branchLength;

                graphics.lineStyle(2, color, 0.6);
                graphics.lineBetween(points[i].x, points[i].y, branchEndX, branchEndY);
            }
        }
    }

    createSparkEffect(x, y, color) {
        // Central flash only - removed flying sparks that caused visual bugs
        const flash = this.scene.add.graphics();
        flash.fillStyle(0xFFFFFF, 1);
        flash.fillCircle(x, y, 12);

        // Add outer glow
        flash.fillStyle(color, 0.6);
        flash.fillCircle(x, y, 20);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 150,
            onComplete: () => flash.destroy()
        });
    }
}
