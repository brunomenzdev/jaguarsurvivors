/**
 * PlayerBuffVisuals
 * 
 * Manages persistent visual effects on the player for active buffs.
 * Listens to buff-started/buff-ended events and renders appropriate auras.
 */
export class PlayerBuffVisuals {
    constructor(scene, playerView) {
        this.scene = scene;
        this.playerView = playerView;
        this.container = playerView.container;
        this.activeVisuals = {};

        this.registerEvents();
    }

    registerEvents() {
        this.scene.events.on('buff-started', this.onBuffStarted, this);
        this.scene.events.on('buff-ended', this.onBuffEnded, this);
    }

    onBuffStarted(type, config) {
        // Remove existing visual if refreshing
        if (this.activeVisuals[type]) {
            this.hideAura(type, true); // immediate
        }

        switch (type) {
            case 'shield':
                this.showShieldAura();
                break;
            case 'rage':
                this.showRageAura();
                break;
            case 'time_freeze':
                this.showFreezeAura();
                break;
            case 'speed':
                this.showSpeedTrails();
                break;
        }
    }

    onBuffEnded(type) {
        this.hideAura(type);
        // Emit for VFX system to play expiration effect
        this.scene.events.emit('buff-expired-vfx', type, {
            x: this.container.x,
            y: this.container.y
        });
    }

    showShieldAura() {
        // Create pulsing shield ring around player
        const ring = this.scene.add.graphics();
        ring.lineStyle(3, 0x00AAFF, 0.8);
        ring.strokeCircle(0, 0, 50);
        this.container.add(ring);
        this.container.sendToBack(ring);

        // Pulsing animation
        this.scene.tweens.add({
            targets: ring,
            alpha: 0.4,
            scaleX: 1.15,
            scaleY: 1.15,
            yoyo: true,
            repeat: -1,
            duration: 600,
            ease: 'Sine.easeInOut'
        });

        this.activeVisuals['shield'] = ring;
    }

    showRageAura() {
        // Create aggressive orange/red glow
        const glow = this.scene.add.graphics();
        glow.fillStyle(0xFF4400, 0.3);
        glow.fillCircle(0, 0, 40);
        this.container.add(glow);
        this.container.sendToBack(glow);

        // Pulsing animation - faster for rage
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.1,
            scaleX: 1.4,
            scaleY: 1.4,
            yoyo: true,
            repeat: -1,
            duration: 250,
            ease: 'Sine.easeInOut'
        });

        this.activeVisuals['rage'] = glow;
    }

    showFreezeAura() {
        // Create icy temporal effect
        const ice = this.scene.add.graphics();
        ice.fillStyle(0x8800FF, 0.25);
        ice.fillCircle(0, 0, 35);
        this.container.add(ice);
        this.container.sendToBack(ice);

        // Subtle rotation for temporal feel
        this.scene.tweens.add({
            targets: ice,
            alpha: 0.1,
            yoyo: true,
            repeat: -1,
            duration: 400
        });

        this.activeVisuals['time_freeze'] = ice;
    }

    showSpeedTrails() {
        // Create cyan speed lines
        const trail = this.scene.add.graphics();
        trail.fillStyle(0x00FFFF, 0.3);
        trail.fillCircle(0, 0, 30);
        this.container.add(trail);
        this.container.sendToBack(trail);

        this.scene.tweens.add({
            targets: trail,
            alpha: 0.1,
            scaleX: 1.3,
            scaleY: 1.3,
            yoyo: true,
            repeat: -1,
            duration: 200,
            ease: 'Sine.easeInOut'
        });

        this.activeVisuals['speed'] = trail;
    }

    hideAura(type, immediate = false) {
        const visual = this.activeVisuals[type];
        if (!visual) return;

        if (immediate) {
            visual.destroy();
            delete this.activeVisuals[type];
            return;
        }

        // Fade out animation
        this.scene.tweens.add({
            targets: visual,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => {
                if (visual && visual.destroy) {
                    visual.destroy();
                }
            }
        });
        delete this.activeVisuals[type];
    }

    destroy() {
        this.scene.events.off('buff-started', this.onBuffStarted, this);
        this.scene.events.off('buff-ended', this.onBuffEnded, this);

        Object.values(this.activeVisuals).forEach(v => {
            if (v && v.destroy) v.destroy();
        });
        this.activeVisuals = {};
    }
}
