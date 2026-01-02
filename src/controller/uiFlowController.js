export class UIFlowController {
    constructor(scene) {
        this.scene = scene;
        this.events = scene.events;

        this.upgradeUI = scene.upgradeUIManager;
        this.legendaryUI = scene.legendaryUIManager;
        this.gameOverUI = scene.gameOverUIManager;

        // Centralized pause state management
        this.activeScreens = new Set();
    }

    onLevelUp() {
        this.openScreen('upgrade');
        this.upgradeUI.show();
    }

    onLegendaryDrop(item) {
        this.openScreen('legendary');
        this.legendaryUI.show(item);
    }

    onPlayerDied() {
        this.openScreen('game-over');
        this.gameOverUI.show();
    }

    openScreen(screenId) {
        this.activeScreens.add(screenId);
        this.scene.scene.pause();
    }

    closeScreen(screenId) {
        this.activeScreens.delete(screenId);
        if (this.activeScreens.size === 0) {
            this.scene.scene.resume();
        }
    }

    togglePause() {
        // Only allow manual pause if NO critical UI is open
        if (this.activeScreens.size > 0) return;

        const pauseScreen = document.getElementById('pause-screen');
        if (this.scene.scene.isPaused('GameScene')) {
            // Only resume if pause screen was the only one active
            this.resume();
        } else {
            this.scene.scene.pause();
            pauseScreen.classList.add('active');
        }
    }

    resume() {
        const pauseScreen = document.getElementById('pause-screen');
        if (this.activeScreens.size === 0) {
            this.scene.scene.resume();
        }
        if (pauseScreen) pauseScreen.classList.remove('active');
    }
}
