import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * LaserTrapGadget
 * 
 * A stationary laser that sweeps in a cone, dealing continuous damage to enemies.
 * 
 * Behavior:
 * - Placed at player's position on activation
 * - Laser rotates continuously
 * - Damages enemies in the laser's path
 * - Visual laser beam effect
 */
export class LaserTrapGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.position = null;
        this.angle = 0;
        this.lastHitTime = {}; // Per-enemy cooldown
    }

    createVisuals() {
        const player = this.scene.player;

        // Create base/emitter sprite
        const base = this.scene.add.sprite(
            player.x,
            player.y,
            this.config.sprite
        );
        base.setScale(0.8);

        // Create laser beam graphics
        const laserGraphics = this.scene.add.graphics();

        this.sprites.push(base);
        this.graphics.push(laserGraphics);
        this.position = { x: player.x, y: player.y };
    }

    update(delta) {
        if (!this.isActive || !this.position || this.graphics.length === 0) return;

        const rotationSpeed = this.config.rotationSpeed || 1.5;
        const length = this.config.length || 300;
        const damage = this.config.damage || 40;

        // Update angle
        this.angle += rotationSpeed * (delta / 1000);

        // Redraw laser beam
        const laserGraphics = this.graphics[0];
        laserGraphics.clear();
        laserGraphics.lineStyle(4, 0xFF0000, 0.8);

        const endX = this.position.x + Math.cos(this.angle) * length;
        const endY = this.position.y + Math.sin(this.angle) * length;

        laserGraphics.lineBetween(
            this.position.x,
            this.position.y,
            endX,
            endY
        );

        // Add glow effect
        laserGraphics.lineStyle(8, 0xFF0000, 0.3);
        laserGraphics.lineBetween(
            this.position.x,
            this.position.y,
            endX,
            endY
        );

        // Check for enemy hits
        this.checkLaserHits(endX, endY, damage);
    }

    checkLaserHits(endX, endY, damage) {
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];
        const now = this.scene.time.now;
        const hitCooldown = 300; // 300ms per enemy

        enemies.forEach(enemy => {
            // Check if enemy is close to the laser line
            const dist = this.distanceToLine(
                enemy.x,
                enemy.y,
                this.position.x,
                this.position.y,
                endX,
                endY
            );

            if (dist < 20) { // Hit threshold
                const enemyId = enemy.container?.id || enemy.id || 'unknown';

                if (!this.lastHitTime[enemyId] || now - this.lastHitTime[enemyId] > hitCooldown) {
                    enemy.takeDamage(damage);
                    this.lastHitTime[enemyId] = now;
                }
            }
        });
    }

    /**
     * Calculate distance from point to line segment.
     */
    distanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;

        return Math.sqrt(dx * dx + dy * dy);
    }
}
