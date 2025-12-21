export class BossUIManager {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.fill = null;
        this.nameText = null;
        this.healthText = null;
        this.currentBoss = null;

        this.createUI();
    }

    createUI() {
        // Create DOM elements dynamically
        const gameUI = document.getElementById('game-ui');

        const bossContainer = document.createElement('div');
        bossContainer.id = 'boss-health-container';
        bossContainer.style.display = 'none'; // Hidden by default

        // HTML Structure
        bossContainer.innerHTML = `
            <div class="boss-name">BOSS NAME</div>
            <div class="boss-bar-bg">
                <div class="boss-bar-fill"></div>
                <div class="boss-health-text">100/100</div>
            </div>
        `;

        gameUI.appendChild(bossContainer);

        // Cache references
        this.container = bossContainer;
        this.nameText = bossContainer.querySelector('.boss-name');
        this.fill = bossContainer.querySelector('.boss-bar-fill');
        this.healthText = bossContainer.querySelector('.boss-health-text');
    }

    show(boss) {
        this.currentBoss = boss;
        this.update();
        this.container.style.display = 'flex';
        this.container.classList.add('active'); // For animations

        // Initial Name Setup
        this.nameText.textContent = boss.name || 'BOSS';
    }

    hide() {
        this.container.style.display = 'none';
        this.container.classList.remove('active');
        this.currentBoss = null;
    }

    update() {
        if (!this.currentBoss || !this.currentBoss.isActive) {
            this.hide();
            return;
        }

        const max = this.currentBoss.maxHealth || 100;
        const current = Math.max(0, this.currentBoss.health);
        const percent = (current / max) * 100;

        this.fill.style.width = `${percent}%`;
        this.healthText.textContent = `${Math.ceil(current)}/${Math.ceil(max)}`;
    }
}
