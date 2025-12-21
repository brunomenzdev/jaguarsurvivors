import { CONFIG } from '../config.js';
import { Enemy } from '../entities/enemy.js';
import { ObjectPool } from '../managers/ObjectPool.js';

export class EnemySpawner {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = []; // Start with local tracking, but pool manages instance creation
        this.group = scene.physics.add.group();
        this.wave = 0;
        this.waveConfig = CONFIG.spawner.waves[this.wave];
        this.timer = 0;
        this.bossSpawned = false;

        // Initialize Pool
        this.enemyPool = new ObjectPool(scene, Enemy, 50);
    }

    update(delta) {
        // Check if any boss is alive
        const bossActive = this.enemies.some(e => e.isBoss);

        let timerIncrement = delta;
        if (bossActive) {
            const activeBoss = this.enemies.find(e => e.isBoss);
            const rhythm = (activeBoss && activeBoss.enemy.gameplayRhythm) ? activeBoss.enemy.gameplayRhythm : 0.5;
            timerIncrement *= rhythm;
        }

        this.timer += timerIncrement;
        if (this.timer >= this.waveConfig.interval) {
            this.spawn();
            this.timer = 0;
        }

        // Return dead enemies to pool
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (!e.isActive) {
                this.enemyPool.release(e);
                this.enemies.splice(i, 1);
            } else {
                e.update(this.player, delta);
            }
        }
    }

    spawn() {
        // MAX SPAWN CHECK
        if (this.enemies.length >= CONFIG.spawner.maxOnScreen) return;

        // Spawn regular enemies
        for (let i = 0; i < this.waveConfig.enemiesPerWave; i++) {
            const ang = Math.random() * Math.PI * 2;
            const r = CONFIG.spawner.spawnDistance;
            const ex = this.player.x + Math.cos(ang) * r;
            const ey = this.player.y + Math.sin(ang) * r;

            const enemyConfig = CONFIG.enemy.find(e => e.key === this.waveConfig.enemyType);

            const enemy = this.enemyPool.get({ x: ex, y: ey, enemyConfig: enemyConfig });
            this.enemies.push(enemy);
            if (!this.group.contains(enemy.container)) {
                this.group.add(enemy.container);
            }
        }

        // Spawn boss enemies if it's a boss wave and not spawned yet
        if (this.isBossWave() && !this.bossSpawned) {
            this.bossSpawned = true;
            const bossCount = this.waveConfig.bossPerWave || 1;
            for (let i = 0; i < bossCount; i++) {
                const ang = Math.random() * Math.PI * 2;
                const r = CONFIG.spawner.spawnDistance;
                const ex = this.player.x + Math.cos(ang) * r;
                const ey = this.player.y + Math.sin(ang) * r;

                let bossDef = CONFIG.bosses.find(b => b.key === this.waveConfig.bossKey);
                if (!bossDef) bossDef = CONFIG.bosses[0];

                const baseEnemy = CONFIG.enemy.find(e => e.key === bossDef.baseEnemy) || CONFIG.enemy[0];

                const finalBossConfig = {
                    ...baseEnemy,
                    ...bossDef,
                    health: baseEnemy.health * (bossDef.healthMultiplier || 10),
                    damage: baseEnemy.damage * (bossDef.damageMultiplier || 1.5),
                    speed: baseEnemy.speed * (bossDef.speedMultiplier || 0.8),
                    size: baseEnemy.size * (bossDef.sizeMultiplier || 1.5),
                    isBoss: true,
                    tint: bossDef.tint,
                    bossData: bossDef
                };

                const boss = this.enemyPool.get({ x: ex, y: ey, enemyConfig: finalBossConfig });

                // Boss visual overrides (scale etc happen in spawn mostly but boss specific tweaks here)
                // Actually spawn() sets scale based on config. We might need to force scale here if logic was complex
                // But simplified: config passed to spawn should handle it.
                // Wait, logic in old spawn was:
                // scale = finalBossConfig.size / baseEnemy.size * ...
                // I need to ensure finalBossConfig has the right properites for spawn() to use.
                // In old logic, constructor took config. New logic spawn takes config.
                // So passed config must have 'bodyScale', 'legsScale' set correctly.

                // Recalculate scale for config
                const scale = finalBossConfig.size / baseEnemy.size * (baseEnemy.bodyScale || 0.4);
                finalBossConfig.bodyScale = scale;
                finalBossConfig.legsScale = scale;

                // Re-apply visual update since we modified config post-get? 
                // No, we passed config to get(), so it used old values if we don't fix before call.
                // FIX: Compute config BEFORE calling get()

                // Let's redo boss spawn block a bit safely in next tool or just patch it here:
                // Since I already called get(), I might need to manual set scale?
                // Actually my code above called get() with finalBossConfig.
                // Check if finalBossConfig had bodyScale set?
                // It spread ...baseEnemy. So it has base bodyScale.
                // We need to override it.

                boss.spawn({ x: ex, y: ey, enemyConfig: finalBossConfig }); // Re-spawn/Reset with correct config?
                // Calling spawn() again is cheap.

                if (finalBossConfig.tint) boss.sprite.setTint(finalBossConfig.tint);

                this.enemies.push(boss);
                if (!this.group.contains(boss.container)) this.group.add(boss.container);

                this.scene.events.emit('boss-spawned', boss);
            }
        }
    }

    isBossWave() {
        return this.waveConfig && this.waveConfig.bossPerWave > 0;
    }

    increaseDifficulty() {
        this.wave++;
        if (this.wave < CONFIG.spawner.waves.length) {
            this.waveConfig = CONFIG.spawner.waves[this.wave];
        } else {
            this.waveConfig = CONFIG.spawner.waves[CONFIG.spawner.waves.length - 1];
        }
        this.bossSpawned = false;
    }
}
