import { CONFIG, resetConfig } from '../config.js';
import { AudioManager } from '../audioManager.js';
import { Player } from '../entities/player.js';
import { EnemySpawner } from '../systems/enemySpawner.js';
import { Weapon } from '../systems/weapon.js';
import { XPSystem } from '../systems/xpSystem.js';
import { UpgradeManager } from '../systems/upgradeManager.js';
import { DamageTextPool } from '../ui/damagePopup.js';
import { JuiceManager } from '../systems/juiceManager.js';
import { BossUIManager } from '../ui/bossUIManager.js';
import { LegendaryRewardManager } from '../systems/LegendaryRewardManager.js';
import { GadgetManager } from '../systems/GadgetManager.js';
import { ProcManager } from '../systems/ProcManager.js';
import { LegendarySelectionUI } from '../ui/LegendarySelectionUI.js';
import { Pickup } from '../entities/pickup.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AchievementManager } from '../managers/AchievementManager.js';

export class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }

    create(data) {
        resetConfig();

        this.saveManager = SaveManager.getInstance();
        this.achievementManager = new AchievementManager(); // Re-instantiate checks

        this.damageTextPool = new DamageTextPool(this, 20);
        this.juice = new JuiceManager(this); // Juice System
        this.kills = 0;
        this.coins = 0; // Session coins

        // TIMER & STAGE SYSTEM
        this.gameTimer = CONFIG.stage.duration; // Seconds
        this.totalPlayTime = 0; // Track total time for achievements
        this.isSuddenDeath = false;
        this.suddenDeathTimer = 0;
        this.processedEvents = new Set();

        // Sistema de Áudio
        this.audio = new AudioManager(this);

        this.createBackground();

        this.playerConfig = CONFIG.player.find(player => player.key === data.charType);
        this.player = new Player(this, CONFIG.world.width / 2, CONFIG.world.height / 2, this.playerConfig);
        this.enemySpawner = new EnemySpawner(this, this.player);
        this.weapon = new Weapon(this, this.player, this.enemySpawner, this.playerConfig.weapon);

        this.xpSystem = new XPSystem(this);
        this.upgradeManager = new UpgradeManager(this);
        this.bossUI = new BossUIManager(this);

        // === LEGENDARY SYSTEM ===
        this.gadgetManager = new GadgetManager(this);
        this.procManager = new ProcManager(this);
        this.legendaryManager = new LegendaryRewardManager(this);
        this.legendaryUI = new LegendarySelectionUI(this);

        // === EVENT-BASED VISUAL/AUDIO FEEDBACK (Decoupled from game logic) ===
        this.events.on('player-damaged', (amount) => {
            this.juice.shake(0.015, 200); // Screen Shake
            this.juice.hitStop(50);      // Hit Stop for impact
            this.audio.play('hit');
            const ind = document.getElementById('damage-indicator');
            ind.textContent = `-${amount}`;
            ind.classList.add('show');
            setTimeout(() => ind.classList.remove('show'), 300);
        });

        this.events.on('player-died', () => {
            this.audio.play('gameover');
            this.gameOver();
        });

        this.events.on('enemy-damaged', (enemy, amount, isCritical) => {
            // Visuals: Flash White + Recoil Pulse
            this.juice.flash(enemy.sprite, 0xFFFFFF, 100);
            this.juice.pulse(enemy.container, 1.1, 50);

            // Hit Stop: Small for normal, Heavy for Crit
            if (isCritical) {
                this.juice.hitStop(30);
                this.juice.shake(0.005, 30); // Subtle shake on crit
            }

            // Damage Popup
            const color = isCritical ? '#FF4500' : '#FFFFFF';
            const scale = isCritical ? 1.5 : 1.0;
            this.showDamagePopup(enemy.x, enemy.y, Math.floor(amount), color, scale, isCritical);
        });

        this.events.on('player-evaded', (player) => {
            this.showDamagePopup(player.x, player.y - 40, "MISS!", '#FFFFFF', 1.0, false);
        });

        this.events.on('player-thorns', (player) => {
            this.juice.spark(player.x, player.y);
        });

        this.events.on('weapon-attack', (weaponKey) => {
            this.sound.play('shoot', {
                volume: 0.5,
                detune: Phaser.Math.Between(-200, 200)
            });
        });

        this.events.on('weapon-shoot', (weaponKey) => {
            this.sound.play('shoot', {
                volume: 0.5,
                detune: Phaser.Math.Between(-200, 200)
            });
        });

        this.enemyProjectiles = this.physics.add.group(); // Create group for projectiles
        this.pickups = this.physics.add.group(); // Loot Pickups

        this.physics.add.overlap(this.player.container, this.pickups, (pl, pickup) => {
            if (pickup.collect) {
                const config = pickup.collect(); // Visual destroy
                this.applyPickupEffect(config);
            }
        });


        this.physics.add.overlap(this.player.container, this.enemySpawner.group, (pl, enSprite) => {
            const enemy = enSprite.getData('parent');
            if (enemy && enemy.isActive) {
                this.player.takeDamage(enemy.damage);
            }
        });

        this.physics.add.overlap(this.player.container, this.enemyProjectiles, (pl, projSprite) => {
            const projectile = projSprite.getData('parent');
            if (projectile) {
                this.player.takeDamage(projectile.damage || 10); // Use damage from projectile or default
                projectile.destroy();
            }
        });

        // == BOSS EVENTS ==
        this.events.on('boss-spawned', (boss) => {
            this.bossUI.show(boss);
            this.cameras.main.flash(500, 100, 0, 0); // Red Flash
        });

        this.events.on('boss-died', (x, y) => {
            this.bossUI.hide();

            // Slow Motion & Shake
            this.cameras.main.shake(600, 0.015); // Long rumble
            this.physics.world.timeScale = 0.5; // Slow motion

            // Restore speed after 1s (real time approx)
            this.time.delayedCall(1000, () => {
                this.physics.world.timeScale = 1.0;
            });

            // Spawn Loot Chest (using existing asset tinted Gold)
            // Using physics image directly for simplicity as it needs body
            const chest = this.physics.add.image(x, y, 'xp_gem_big');
            chest.setTint(0xFFD700);
            chest.setScale(1.5);

            // Add bounce/float tween
            this.tweens.add({
                targets: chest,
                y: y - 10,
                yoyo: true,
                duration: 1000,
                repeat: -1
            });

            // Overlap
            this.physics.add.overlap(this.player.container, chest, () => {
                // Determine if we destroy chest immediately
                chest.destroy();
                this.audio.play('levelup');

                // TRIGGER LEGENDARY SELECTION
                this.pauseGame();
                const rewards = this.legendaryManager.getRandomRewards(3);
                this.legendaryUI.show(rewards);
            });
        });

        this.time.addEvent({ delay: 30000, callback: () => this.enemySpawner.increaseDifficulty(), loop: true });
        // Removed old timer event. We will handle timer in update(delta) for precision


        this.input.keyboard.on('keydown-ESC', () => this.scene.isPaused() ? this.resumeGame() : this.pauseGame());
    }

    createBackground() {
        const worldW = CONFIG.world.width;
        const worldH = CONFIG.world.height;

        // Tamanho extra para a borda (o quanto da rua você quer ver além do limite)
        // Se a tela for Full HD, uns 1000px de margem garante que nunca fique preto
        const margin = 1000;

        // 1. Outside (A Rua/Street) - Desenhamos primeiro para ficar atrás
        // Ele precisa ser maior que o mundo e estar centralizado
        // Usamos setOrigin(0.5) para posicionar pelo centro, facilita a matemática
        this.bgOutside = this.add.tileSprite(
            worldW / 2,          // Posição X (Centro do mundo)
            worldH / 2,          // Posição Y (Centro do mundo)
            worldW + margin * 2, // Largura (Mundo + Margem esquerda + Margem direita)
            worldH + margin * 2, // Altura (Mundo + Margem cima + Margem baixo)
            'bg_outside'
        ).setDepth(-2);          // Garante que fique bem no fundo

        // 2. Inner (O Piso/Paving Stone) - A área jogável
        this.bgInner = this.add.tileSprite(
            worldW / 2,
            worldH / 2,
            worldW,
            worldH,
            'bg_inner'
        ).setDepth(-1); // Fica acima da rua, mas abaixo do player

        // 3. Limites da Física (Onde o player pode andar)
        // O player fica preso no quadrado 0,0 até 1500,1500 (apenas no inner)
        this.physics.world.setBounds(0, 0, worldW, worldH);

        // 4. Limites da Câmera (O Pulo do Gato!)
        // Se não mudarmos isso, a câmera para no pixel 1500 e não mostra a rua.
        // Precisamos deixar a câmera "espiar" a margem negativa e a positiva.
        this.cameras.main.setBounds(
            -margin / 2,       // Pode olhar um pouco para a esquerda (negativo)
            -margin / 2,       // Pode olhar um pouco para cima (negativo)
            worldW + margin,   // Largura total visível
            worldH + margin    // Altura total visível
        );
    }

    update(time, delta) {
        this.player.update(delta);
        this.enemySpawner.update(delta, this.player);
        this.weapon.update(delta);
        this.gadgetManager.update(delta); // Update Gadgets
        this.xpSystem.update(delta, this.player);

        // === TIMER & EVENTS ===
        if (!this.scene.isPaused()) { // Check if not paused manually
            if (!this.isSuddenDeath) {
                this.gameTimer -= (delta / 1000);
                this.totalPlayTime += (delta / 1000);
                this.checkTimeEvents();

                if (this.gameTimer <= 0) {
                    this.gameTimer = 0;
                    this.startSuddenDeath();
                }
            } else {
                // SUDDEN DEATH LOGIC
                this.suddenDeathTimer += delta;
                if (this.suddenDeathTimer >= CONFIG.stage.suddenDeath.interval) {
                    this.suddenDeathTimer = 0;
                    this.strengthenEnemies();
                }
            }
            this.updateTimerDisplay();
        }

        // UI BOSS TRACKING: Find the boss with the highest HP
        const bosses = this.enemySpawner.enemies.filter(e => e.isBoss && e.isActive);
        if (bosses.length > 0) {
            // Sort descending by Health
            bosses.sort((a, b) => b.health - a.health);
            const primaryBoss = bosses[0];

            // If the UI is not tracking this boss (or tracking nothing), switch to it
            if (this.bossUI.currentBoss !== primaryBoss) {
                this.bossUI.show(primaryBoss);
            }
        }
        this.bossUI.update();

        // Update Projectiles
        this.enemyProjectiles.getChildren().forEach(p => {
            const parent = p.getData('parent');
            if (parent && parent.update) parent.update(delta);
        });

        // Update wave info
        document.getElementById('wave-count').textContent = this.enemySpawner.wave;
        document.getElementById('enemy-count').textContent = this.enemySpawner.enemies.length;
        document.getElementById('kill-count').textContent = this.kills;

        // Update health bar
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        const healthBarFill = document.getElementById('health-bar-fill');
        const healthText = document.getElementById('health-text');

        healthBarFill.style.width = `${healthPercent}%`;
        healthText.textContent = `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;

        // Change health bar color based on health percentage
        if (healthPercent > 50) {
            healthBarFill.style.backgroundColor = '#4CAF50'; // Green
        } else if (healthPercent > 25) {
            healthBarFill.style.backgroundColor = '#FFA500'; // Orange
        } else {
            healthBarFill.style.backgroundColor = '#FF3333'; // Red
        }

        // Boss wave UI effect
        const waveDisplay = document.getElementById('wave-display');
        if (this.enemySpawner.isBossWave()) {
            waveDisplay.classList.add('boss-wave');
            // Update text to show BOSS WAVE
            const waveText = waveDisplay.querySelector('span');
            if (waveText && !waveText.textContent.includes('BOSS')) {
                waveText.innerHTML = `<span style="color: #ff4444; font-weight: bold;">BOSS</span> ONDA <span id="wave-count">${this.enemySpawner.wave}</span>`;
            }
        } else {
            waveDisplay.classList.remove('boss-wave');
            // Reset to normal text
            const waveText = waveDisplay.querySelector('span');
            if (waveText && waveText.textContent.includes('BOSS')) {
                waveText.innerHTML = `ONDA <span id="wave-count">${this.enemySpawner.wave}</span>`;
            }
        }
    }

    updateTimerDisplay() {
        const timeToShow = Math.ceil(Math.max(0, this.gameTimer));
        const minutes = Math.floor(timeToShow / 60).toString().padStart(2, '0');
        const seconds = (timeToShow % 60).toString().padStart(2, '0');

        const timerEl = document.getElementById('game-timer');
        timerEl.textContent = `${minutes}:${seconds}`;

        // Visual indicator for Sudden Death
        if (this.isSuddenDeath) {
            timerEl.style.color = 'red';
            timerEl.textContent = "SUDDEN DEATH";
        }
    }

    checkTimeEvents() {
        const currentTime = Math.ceil(this.gameTimer);

        CONFIG.stage.events.forEach(event => {
            // Check if we passed the time threshold (using ceil to catch the second)
            // We use a small range or a 'processed' flag to avoid double trigger
            // A simple way is to check if we are AT or BELOW the time, and haven't processed it yet.
            if (currentTime <= event.time && !this.processedEvents.has(event.time)) {
                this.triggerEvent(event);
                this.processedEvents.add(event.time);
            }
        });
    }

    triggerEvent(event) {
        console.log(`Event Triggered: ${event.type} at ${event.time}`);

        switch (event.type) {
            case 'boss_spawn':
                // Find boss config
                const bossConfig = CONFIG.bosses.find(b => b.key === event.key);
                if (bossConfig) {
                    this.enemySpawner.spawnBoss(bossConfig);
                    this.juice.shake(0.02, 500); // Big shake
                    this.showMessage("BOSS APPROACHING!", 0xFF0000);
                }
                break;

            case 'final_hour':
                this.cameras.main.flash(1000, 255, 0, 0); // Long red flash
                // Add a permanent red tint overlay or change ambient color
                this.cameras.main.setTint(0xFFDDDD); // Slight red tint to whole world logic usually needs a wrapper, 
                // but Phaser camera tint works on everything rendered.
                this.showMessage("THE FINAL HOUR", 0xFF0000);
                // Optionally intensify music here
                break;
        }
    }

    startSuddenDeath() {
        this.isSuddenDeath = true;
        this.showMessage("SUDDEN DEATH STARTED!", 0x880000);
        this.cameras.main.shake(1000, 0.02);
        this.audio.play('gameover'); // Temporary reuse or need new sound? User said 'intense music', we might not have it.
        // We actually want to KEEP playing but harder.
    }

    strengthenEnemies() {
        // Increase global difficulty
        const buff = CONFIG.stage.suddenDeath.buffPercent;

        // Buff existing enemies
        this.enemySpawner.enemies.forEach(enemy => {
            if (enemy.isActive) {
                enemy.enemy.damage *= (1 + buff);
                enemy.enemy.speed *= (1 + buff);
                // Apply speed change immediately to body if moving
                if (enemy.container && enemy.container.body) {
                    enemy.container.body.setMaxVelocity(enemy.enemy.speed);
                }
                // Visual indicator for buff
                this.juice.pulse(enemy.container, 1.2, 200);
            }
        });

        // Buff future spawns (Spawner logic reads from CONFIG? No, it reads from its own config usually, 
        // need to check if we need to update something global or if Spawner references live objects)
        // EnemySpawner usually spawns based on 'enemy_basic' key which looks up CONFIG.enemy.
        // So we should update CONFIG.enemy entries!

        CONFIG.enemy.forEach(e => {
            e.damage = (e.damage || 10) * (1 + buff);
            e.speed = (e.speed || 100) * (1 + buff);
        });

        this.showMessage("ENEMIES GREW STRONGER!", 0xFF0000);
    }

    showMessage(text, color) {
        // Simple screen center text
        const msg = this.add.text(CONFIG.world.width / 2, CONFIG.world.height / 2 - 200, text, {
            fontSize: '48px',
            fontFamily: 'Arial', // Fallback
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(2000); // UI depth

        msg.setTint(color);

        this.tweens.add({
            targets: msg,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 3000,
            ease: 'Power2',
            onComplete: () => msg.destroy()
        });
    }

    showUpgradeScreen() {
        this.scene.pause();
        const container = document.getElementById('upgrade-options');
        container.innerHTML = '';
        this.upgradeManager.getRandomUpgrades().forEach(u => {
            const el = document.createElement('div');
            el.className = 'upgrade-card';
            el.innerHTML = `<div class="upgrade-icon">${u.icon}</div><div class="upgrade-name">${u.name}</div><div class="upgrade-description">${u.desc}</div>`;
            el.onclick = () => {
                this.upgradeManager.applyUpgrade(u.id);
                document.getElementById('upgrade-screen').classList.remove('active');
                this.scene.resume();
            };
            container.appendChild(el);
        });
        document.getElementById('upgrade-screen').classList.add('active');
    }

    showDamagePopup(x, y, damage, color = '#FFD700', scale = 1.0, isCritical = false) {
        // 1. Obtém o objeto Text (reutilizando da pool se possível)
        const damageText = this.damageTextPool.get(x, y, damage);

        if (damageText) {
            // 2. Configura e Exibe
            damageText.setText(damage.toString());
            damageText.setDepth(999); // Garante que esteja acima de tudo
            damageText.setColor(color); // Define a cor do texto
            damageText.setScale(0.1); // Start small for pop effect

            // Pop in effect
            this.tweens.add({
                targets: damageText,
                scale: scale,
                duration: 200,
                ease: 'Back.out'
            });

            // 3. Aplica a animação (Tween)
            this.tweens.add({
                targets: damageText,

                // Movimento: Sobe 30 pixels (mais se for critico)
                y: damageText.y - (isCritical ? 50 : 30),

                // Transparência: Desaparece
                alpha: 0,

                // Duração do efeito
                duration: isCritical ? 1200 : 800,

                // Facilidade: Começa rápido, termina lento (flutuante)
                ease: 'Power1',

                // O que acontece quando termina: Retorna para a pool
                onComplete: () => {
                    this.damageTextPool.return(damageText);
                }
            });
        }
    }

    pauseGame() { this.scene.pause(); }
    resumeGame() {
        document.getElementById('upgrade-screen').classList.remove('active');
        // Ensure legendary UI is hidden if that was the source
        // this.legendaryUI.hide(); // Already hidden by select, but safety check ok
        this.scene.resume();
    }
    gameOver() {
        this.scene.pause();
        document.getElementById('game-ui').style.display = 'none';

        const validTime = Math.max(0, this.gameTimer);
        const minutes = Math.floor(validTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(validTime % 60).toString().padStart(2, '0');
        document.getElementById('survival-time').textContent = `${minutes}:${seconds}`;
        document.getElementById('final-level').textContent = this.xpSystem.currentLevel;
        document.getElementById('game-over').classList.add('active');

        this.saveProgress();
    }

    saveProgress() {
        // Save using SaveManager
        this.saveManager.addKills(this.kills);
        this.saveManager.addCoins(this.coins);

        // Final Achievement Check
        this.achievementManager.checkEndRunUnlocks(this.totalPlayTime);
        this.achievementManager.checkGlobalUnlocks(); // Check for coin/kill based unlocks immediately

        console.log(`Saved progress: +${this.kills} kills, +${this.coins} coins.`);
        // Note: SaveManager.addX calls save() internally.
    }


    applyPickupEffect(config) {
        if (!config) return;

        switch (config.effect) {
            case 'heal':
                const amount = this.player.maxHealth * config.value;
                this.player.heal(amount);
                this.audio.play('levelup', { volume: 0.5 }); // Reuse nice sound
                break;
            case 'magnet':
                this.triggerMagnet();
                this.showMessage("MAGNET!", 0x0000FF);
                this.audio.play('levelup', { volume: 0.5 });
                break;
            case 'bomb':
                this.killAllVisible();
                this.juice.shake(0.03, 500);
                this.showMessage("BOOM!", 0xFF0000);
                this.audio.play('gameover', { volume: 0.5 }); // Explosion sound?
                break;
            case 'coin':
                // Apply Gold Gain Multiplier
                const goldMult = this.player.stats.goldGain.getValue();
                const coinsAdded = Math.ceil(config.value * goldMult);
                this.coins += coinsAdded;
                this.audio.play('levelup', { volume: 0.3, pitch: 1.5 }); // High pitch ping
                this.showDamagePopup(this.player.x, this.player.y - 60, `+${coinsAdded}g`, '#FFD700');
                break;
        }
    }

    triggerMagnet() {
        this.xpSystem.gems.forEach(gem => {
            if (gem.isActive) {
                gem.flyToPlayer(this.player);
            }
        });
        // Also pickup coins? 
        this.pickups.getChildren().forEach(p => {
            // Simple fly logic for pickups if we want magnet to work on them
            // For now, only Gems as per request, but coins usually are magnetic too in this genre.
            // Implemented simply:
            this.tweens.add({
                targets: p,
                x: this.player.x,
                y: this.player.y,
                duration: 500,
                onComplete: () => {
                    if (p.collect && p.active) {
                        const config = p.collect();
                        this.applyPickupEffect(config);
                    }
                }
            });
        });
    }

    killAllVisible() {
        // Kill common enemies on screen
        const camera = this.cameras.main;
        const visibleFilter = (e) => {
            return e.active &&
                e.x > camera.worldView.x && e.x < camera.worldView.x + camera.worldView.width &&
                e.y > camera.worldView.y && e.y < camera.worldView.y + camera.worldView.height &&
                !e.isBoss; // Don't kill bosses
        };

        this.enemySpawner.enemies.filter(visibleFilter).forEach(e => {
            e.takeDamage(99999, true); // Instakill
            this.juice.spark(e.x, e.y); // Explosion effect
        });
    }
}