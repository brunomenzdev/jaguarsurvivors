import { CONFIG } from '../config.js';
import { Projectile } from '../entities/projectile.js';
import { ObjectPool } from '../managers/ObjectPool.js';

export class Weapon {
    constructor(scene, player, enemySpawner, weaponKey) {
        this.scene = scene;
        this.player = player;
        this.enemySpawner = enemySpawner;
        this.weaponKey = weaponKey;
        this.weaponConfig = CONFIG.weapon.find(w => w.key === weaponKey);
        this.isMelee = this.weaponConfig.type === 'melee';
        this.timer = 0;
        this.projectiles = []; // Local tracking

        // POOL
        this.projectilePool = new ObjectPool(scene, Projectile, 20);

        // Initialize properties that can be upgraded
        this.damage = this.weaponConfig.damage;
        this.cooldown = this.weaponConfig.cooldown;
        this.range = this.weaponConfig.range;
        this.projectileSpeed = this.weaponConfig.projectileSpeed;
    }

    update(delta) {
        this.timer += delta;

        // Dynamic Stats
        const stats = this.player.stats;
        // Optimization: Could be cached, but for now calculate every frame for responsiveness
        this.currentDamage = this.weaponConfig.damage * stats.damage.getValue();
        // Attack Speed increases frequency (reduces cooldown) and speed of animation
        // Attack Speed 1.3 -> Cooldown / 1.3
        const atkSpeed = stats.attackSpeed.getValue();
        this.currentCooldown = this.weaponConfig.cooldown / atkSpeed;
        this.currentRange = this.weaponConfig.range * stats.area.getValue();
        this.currentProjectileSpeed = this.weaponConfig.projectileSpeed * stats.projectileSpeed.getValue();
        this.currentDotDamage = this.weaponConfig.dotDamage * stats.elementalDamage.getValue();

        const nearest = this.findNearest(this.currentRange);
        if (nearest) {
            let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y);
            let localAngle = this.player.facingRight ? angle : -angle;
            const smoothing = this.weaponConfig.rotationSmoothing || 0.2;
            this.weaponConfig.rotation = Phaser.Math.Linear(this.weaponConfig.rotation, localAngle, smoothing);
        }

        if (this.isMelee) {
            // Melee logic
            if (nearest && this.timer >= this.currentCooldown) {
                this.meleeAttack(nearest);
                this.timer = 0;
            }
        } else {
            // Ranged logic
            if (this.timer >= this.currentCooldown && nearest) {
                this.shoot(nearest);
                this.timer = 0;
            }
        }

        // Update Projectiles & Return to Pool
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!p.isActive) {
                this.projectilePool.release(p);
                this.projectiles.splice(i, 1);
            } else {
                p.update(delta);
            }
        }
    }

    findNearest(maxDist) {
        let nearest = null;
        let minDst = maxDist;
        this.enemySpawner.enemies.forEach(e => {
            if (!e.isActive) return;
            const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (d < minDst) {
                minDst = d;
                nearest = e;
            }
        });
        return nearest;
    }

    shoot(target) {
        this.scene.events.emit('weapon-shoot', this.weaponKey);

        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
        const sx = this.player.x + Math.cos(angle) * this.weaponConfig.projectileSize;
        const sy = this.player.y + Math.sin(angle) * this.weaponConfig.projectileSize;

        const isCritical = Math.random() < this.player.stats.critChance.getValue();
        const damageMult = isCritical ? this.player.stats.criticalDamage.getValue() : 1.0;
        const finalDamage = this.currentDamage * damageMult;
        const knockbackMult = this.player.stats.knockback.getValue();

        // config object for fire()
        const fireConfig = {
            x: sx, y: sy,
            targetX: target.x, targetY: target.y,
            damage: finalDamage,
            weapon: this.weaponConfig,
            projectileSpeed: this.currentProjectileSpeed,
            isCritical: isCritical,
            knockbackMultiplier: knockbackMult
        };

        const p = this.projectilePool.get(fireConfig);
        this.projectiles.push(p);

        // Physics Overlap
        // We need to re-add overlap because creating a new one every time is inefficient, 
        // BUT maintaining them for pooled objects is tricky if the body disables.
        // Phaser overlaps check valid bodies.
        // We can add overlap ONCE in constructor if we group them? 
        // Or just add here. Adding here is fine for now.
        this.scene.physics.add.overlap(p.visual, this.enemySpawner.group, (projSprite, enemySprite) => {
            const enemy = enemySprite.getData('parent');
            if (p.isActive && enemy && enemy.isActive) p.hitEnemy(enemy);
        });
    }

    meleeAttack(target) {
        this.scene.events.emit('weapon-attack', this.weaponKey);

        const attackOrigin = this.weaponConfig.gripOrigin || { x: 0.5, y: 1.5 };
        const idleOrigin = this.weaponConfig.origin || { x: 0.3, y: 0.5 };
        // Attack Speed affects swing duration too
        const atkSpeed = this.player.stats.attackSpeed.getValue();
        const baseAnimDuration = this.weaponConfig.meleeAnimDuration || 250;
        const animDuration = baseAnimDuration / atkSpeed;

        const angleOrigin = this.weaponConfig.angleOrigin || 0;
        const angleAttack = this.weaponConfig.angleAttack || 0;

        // Range affects scale
        const areaMult = this.player.stats.area.getValue();
        const baseScale = this.weaponConfig.scale || 0.6;
        const newScale = baseScale * areaMult;

        this.player.weapon.setOrigin(attackOrigin.x, attackOrigin.y);
        this.player.weapon.setAngle(angleOrigin);
        this.player.weapon.setScale(newScale); // Scale up weapon

        this.scene.tweens.add({
            targets: this.player.weapon,
            angle: angleAttack,
            duration: animDuration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.player.weapon.setOrigin(idleOrigin.x, idleOrigin.y);
                this.player.weapon.setAngle(angleOrigin);
                this.player.weapon.setScale(baseScale); // Reset scale
            }
        });

        // Hitbox based on actual range
        // meleeHitbox in config is usually {width, height}
        // If range increases, width should increase proportionally
        const baseHitbox = this.weaponConfig.meleeHitbox || { width: 200, height: 100 };
        const hbWidth = baseHitbox.width * areaMult;
        const hbHeight = baseHitbox.height * areaMult;

        // Offset hitbox to match new scale/range
        const offset = (hbWidth / 2);

        const hitbox = this.scene.add.zone(
            this.player.facingRight ? this.player.x + offset : this.player.x - offset,
            this.player.y,
            hbWidth,
            hbHeight
        );
        this.scene.physics.world.enable(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.body.moves = false;

        const hitEnemies = new Set();
        this.scene.physics.overlap(hitbox, this.enemySpawner.group, (hb, enemySprite) => {
            const enemy = enemySprite.getData('parent');
            if (!enemy || !enemy.isActive || hitEnemies.has(enemy)) return;

            // Critical Hit Calculation
            const isCritical = Math.random() < this.player.stats.critChance.getValue();
            const damageMult = isCritical ? this.player.stats.criticalDamage.getValue() : 1.0;
            const finalDamage = this.currentDamage * damageMult;

            // Damage
            // Apply damage with crit flag and attacker (player) for thorns reflection (though thorns usually reflect TO player, so attacker=player here matters if Enemy has thorns)
            enemy.takeDamage(finalDamage, isCritical, this.player);

            // Knockback
            const kbMult = this.player.stats.knockback.getValue();
            enemy.applyKnockback(this.weaponConfig.knockback * kbMult, this.weaponConfig.knockbackDuration);

            // Elemental
            if (this.weaponConfig.elementalEffect !== 'none') {
                // Apply elemental damage scaled by stat
                enemy.applyEffect(this.weaponConfig.elementalEffect, this.currentDotDamage, this.weaponConfig.dotDuration);
            }
            hitEnemies.add(enemy);

            // Visuals handled by enemy-damaged event now for consistency


        });

        this.scene.time.delayedCall(animDuration, () => {
            hitbox.destroy();
        });
    }
}