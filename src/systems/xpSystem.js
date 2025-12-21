import { CONFIG } from '../config.js';
import { XPGem } from '../entities/xpGem.js';

export class XPSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentXP = 0;
        this.currentLevel = 1;
        this.gems = CONFIG.xp.gems;
        this.xpToNextLevel = CONFIG.xp.baseXPToLevel;
    }
    update(delta, player) {
        this.gems = this.gems.filter(gem => gem.isActive);
        this.gems.forEach(gem => gem.update(delta, player));
        this.updateXPBar();
    }
    addXP(amount) {
        this.currentXP += amount;
        if (this.currentXP >= this.xpToNextLevel) {
            this.scene.audio.play('levelup'); // Áudio
            this.levelUp();
        }
    }
    activateMagnet() {
        this.isMagnetActive = true;
        // Make all gems fly!
        this.gems.forEach(gem => gem.flyToPlayer(this.scene.player));

        // Timer to disable? Or one-time pull?
        // Logic says "when active", usually duration.
        // But for "Magnet Item" (like Vacuum), it usually just sucks everything once.
        // If it's a buff, we need a duration.
        // Let's assume it's a one-time 'Vacuum' effect for now unless specified as 'Magnet Buff'.
        // "Implement a 'Magnet' item logic... when active...". 
        // If it's a pickup, it might be instant. Let's start with instant vacuum of all current gems.
        // If we need persistent magnet (e.g. 10s duration), we set a flag.
        // Let's set a flag for 5 seconds.
        this.scene.time.delayedCall(5000, () => {
            this.isMagnetActive = false;
        });
    }
    levelUp() {
        this.currentLevel++;
        this.currentXP -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(CONFIG.xp.baseXPToLevel * Math.pow(CONFIG.xp.xpScaling, this.currentLevel - 1));
        this.scene.showUpgradeScreen();
    }
    dropXP(x, y, value) {
        const gem = new XPGem(this.scene, x, y, CONFIG.xp.gems[value]);
        this.gems.push(gem);
        if (this.isMagnetActive) {
            gem.flyToPlayer(this.scene.player);
        }
    }
    updateXPBar() {
        const pct = Math.min((this.currentXP / this.xpToNextLevel) * 100, 100);
        document.getElementById('xp-bar-fill').style.width = `${pct}%`;
        document.getElementById('xp-bar-text').textContent = `NÍVEL ${this.currentLevel}`;
    }
}