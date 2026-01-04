import { PreloadScene } from './scenes/preloadScene.js';
import { BootScene } from './scenes/bootScene.js';
import { GameScene } from './scenes/gameScene.js';
import { CONFIG } from './config/config.js';
import { SaveManager } from './managers/saveManager.js';
import { AchievementManager } from './managers/achievementManager.js';

export const GameEvents = {
    gameInstance: null,
    saveManager: null,
    achievementManager: null,

    // == NAVIGATION ==
    goToCharSelect: () => {
        GameEvents.hideAllOverlays();
        if (GameEvents.gameInstance) {
            GameEvents.gameInstance.sound.stopAll();
            GameEvents.gameInstance.scene.stop('GameScene');
        }
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('map-select').classList.remove('active');
        document.getElementById('char-select').classList.add('active');
        GameEvents.generateCharacterSelection();
    },
    goToMainMenu: () => {
        GameEvents.hideAllOverlays();
        if (GameEvents.gameInstance) {
            GameEvents.gameInstance.sound.stopAll();
            GameEvents.gameInstance.scene.stop('GameScene');
        }
        document.getElementById('pause-screen').classList.remove('active');
        document.getElementById('map-select').classList.remove('active');
        document.getElementById('main-menu').classList.add('active');
    },
    goToShop: () => {
        GameEvents.hideAllOverlays();
        document.getElementById('meta-shop').classList.add('active');
        GameEvents.generateShop();
    },
    goToSettings: () => {
        GameEvents.hideAllOverlays();
        document.getElementById('settings-menu').classList.add('active');
        GameEvents.updateSettingsUI();
    },
    hideAllOverlays: () => {
        const overlays = document.querySelectorAll('.overlay-screen');
        overlays.forEach(el => el.classList.remove('active'));

        // Also clean up dynamic overlays
        const upgradeOverlay = document.getElementById('upgrade-overlay');
        if (upgradeOverlay) upgradeOverlay.remove();
    },

    startGame: (charType) => {
        GameEvents.selectedChar = charType;
        GameEvents.hideAllOverlays();
        document.getElementById('map-select').classList.add('active');
        GameEvents.generateMapSelection();
    },

    generateMapSelection: () => {
        const container = document.getElementById('map-container');
        container.innerHTML = '';

        CONFIG.maps.forEach(map => {
            const card = document.createElement('div');
            card.classList.add('map-card');

            // Find if there's a record or something (future proofing)
            const mapStatus = "MISSAO DISPONÍVEL";

            card.innerHTML = `
                <div class="map-badge">MAPA</div>
                <div class="map-preview">
                    <img src="${map.background.inner}" alt="${map.name}">
                </div>
                <div class="map-card-content">
                    <h3>${map.name}</h3>
                    <p>${map.description}</p>
                    <div class="map-status">${mapStatus}</div>
                </div>
            `;

            card.onclick = () => {
                // Play sound if possible
                const bootScene = GameEvents.gameInstance.scene.getScene('BootScene');
                if (bootScene && bootScene.sound) {
                    bootScene.sound.play('menuclick');
                }

                GameEvents.launchGame(map.id);
            };

            container.appendChild(card);
        });
    },

    launchGame: (mapId) => {
        GameEvents.hideAllOverlays();
        // Hide HUD until actual game starts
        document.getElementById('game-ui').style.display = 'none';

        GameEvents.gameInstance.scene.start('GameScene', {
            charType: GameEvents.selectedChar,
            mapId: mapId
        });
    },

    resumeGame: () => {
        const gameScene = GameEvents.gameInstance.scene.getScene('GameScene');
        if (gameScene && gameScene.bootstrap && gameScene.bootstrap.uiFlow) {
            gameScene.bootstrap.uiFlow.togglePause();
        }
    },

    // == SHOP LOGIC ==
    generateShop: () => {
        const container = document.getElementById('shop-container');
        const coinsDisplay = document.getElementById('shop-coins-display');
        container.innerHTML = '';

        const coins = GameEvents.saveManager.data.coins;
        coinsDisplay.textContent = `Moedas: ${coins}`;

        CONFIG.metaShop.forEach(item => {
            const currentRank = GameEvents.saveManager.getUpgradeRank(item.id) || 0;
            const cost = Math.floor(item.costBase * Math.pow(item.costScaling, currentRank));
            const isMaxed = currentRank >= item.maxRank;

            const card = document.createElement('div');
            card.classList.add('shop-card');

            // Visual feedback for affordability/maxed
            if (isMaxed) card.classList.add('maxed');
            else if (coins < cost) card.classList.add('locked');

            card.innerHTML = `
                <div class="shop-icon">${item.icon}</div>
                <div class="shop-info">
                    <h3>${item.name} <span class="rank-badge">Lvl ${currentRank}/${item.maxRank}</span></h3>
                    <p>${item.description}</p>
                    <button class="btn-buy" ${isMaxed || coins < cost ? 'disabled' : ''} 
                        onclick="GameEvents.buyUpgrade('${item.id}')">
                        ${isMaxed ? 'MAX' : `💰 ${cost}`}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    buyUpgrade: (id) => {
        const item = CONFIG.metaShop.find(x => x.id === id);
        if (!item) return;

        const currentRank = GameEvents.saveManager.getUpgradeRank(id) || 0;
        if (currentRank >= item.maxRank) return;

        const cost = Math.floor(item.costBase * Math.pow(item.costScaling, currentRank));

        if (GameEvents.saveManager.spendCoins(cost)) {
            GameEvents.saveManager.upgradeMeta(id);
            GameEvents.generateShop(); // Refresh UI
        }
    },

    // == SETTINGS LOGIC ==
    updateSettingsUI: () => {
        const s = GameEvents.saveManager.data.settings;
        document.getElementById('setting-volume').value = s.volume * 100;
        document.getElementById('setting-shake').checked = s.screenShake;
    },

    setVolume: (val) => {
        const vol = val / 100;
        GameEvents.saveManager.setVolume(vol);
        // Apply instantly if GameScene is running or audio manager exists
        const scene = GameEvents.gameInstance.scene.getScene('BootScene');
        if (scene && scene.audio) {
            // Updating global volume logic would go here
            // scene.audio.setGlobalVolume(vol);
        }
    },

    toggleShake: () => {
        GameEvents.saveManager.toggleScreenShake();
    },

    generateCharacterSelection: () => {
        const charContainer = document.getElementById('char-container');
        charContainer.innerHTML = '';

        // Refresh unlocked status
        const unlocked = GameEvents.saveManager.data.unlockedChars;

        CONFIG.player.forEach((char) => {
            const isUnlocked = unlocked.includes(char.key);
            const charCard = document.createElement('div');
            charCard.classList.add('char-card');
            if (!isUnlocked) charCard.classList.add('locked');

            charCard.onclick = () => {
                if (isUnlocked) GameEvents.startGame(char.key);
            };

            // Determine Traits (Pros/Cons)
            let traits = [];
            const s = char.stats || {};
            // Comparisons vs Baseline (approximate)
            if (s.maxHealth > 1.0 || char.health > 100) traits.push({ text: 'Vida Alta', good: true });
            if (s.maxHealth < 1.0 || char.health < 80) traits.push({ text: 'Vida Baixa', good: false });
            if (s.moveSpeed > 1.0) traits.push({ text: 'Veloz', good: true });
            if (s.moveSpeed < 1.0) traits.push({ text: 'Lento', good: false });
            if (s.knockbackResistance > 1.0) traits.push({ text: 'Tanque', good: true });
            if (s.critChance >= 0.1) traits.push({ text: 'Crítico Alto', good: true });
            if (s.evasion >= 0.1) traits.push({ text: 'Esquiva', good: true });
            if (s.elementalDamage > 1.0) traits.push({ text: 'Elemental+', good: true });

            const traitsHtml = traits.map(t => `<span class="${t.good ? 'trait-good' : 'trait-bad'}">${t.text}</span>`).join(' ');

            // Find Weapon Name/Icon
            const w = CONFIG.weapon.find(x => x.key === char.weapon);
            const wName = w ? w.name : char.weapon;

            charCard.innerHTML = `
                <div class="char-header">
                    <div class="char-placeholder-img">
                        <img src="${char.player_body_image}" alt="${char.name}" style="${!isUnlocked ? 'filter: grayscale(100%) brightness(0.3);' : ''}">
                    </div>
                </div>
                <h3>${char.name} ${!isUnlocked ? '<span style="font-size: 0.7em; color: #ff4444;">(BLOQUEADO)</span>' : ''}</h3>
                <div class="char-info">
                    <div class="char-main-row">
                        <div class="char-quick-stats">
                            <div class="q-stat">❤️ <span>${char.health}</span></div>
                            <div class="q-stat">⚡ <span>${char.speed}</span></div>
                            <div class="q-stat">⚔️ <span>${char.damage || 10}</span></div>
                        </div>
                        
                        <div class="char-weapon-display">
                            <img src="${w.image}" class="mini-weapon-icon">
                            <span class="weapon-name-label">${wName}</span>
                        </div>
                    </div>

                    <div class="char-traits">
                        ${traitsHtml}
                    </div>
                </div>
            `;
            charContainer.appendChild(charCard);
        });
    }
};

window.GameEvents = GameEvents;

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            debugShowBody: false,
            debugShowStaticBody: false,
            debugShowVelocity: false,
            debugBodyColor: 0x00ff00
        }
    },
    render: { pixelArt: false, antialias: true },
    scene: [PreloadScene, BootScene, GameScene]
};

window.onload = () => {
    const game = new Phaser.Game(gameConfig);
    GameEvents.gameInstance = game;
    // Init Managers
    GameEvents.saveManager = SaveManager.getInstance();
    GameEvents.achievementManager = new AchievementManager();

    // Check global unlocks on startup
    GameEvents.achievementManager.checkGlobalUnlocks();

    GameEvents.generateCharacterSelection();
};