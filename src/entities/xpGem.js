import { CONFIG } from '../config.js';

export class XPGem {
    constructor(scene, x, y, gem) {
        this.scene = scene;
        this.value = gem.gemValue;
        this.sprite = this.scene.add.image(x, y, gem.key);
        this.sprite.setDisplaySize(32, 16); // Ajuste escala se necessário
        this.scene.physics.add.existing(this.sprite);
        this.body = this.sprite.body;
        this.isActive = true;

        // Animação simples
        this.scene.tweens.add({
            targets: this.sprite, scaleY: '*=1.2', duration: 500, yoyo: true, repeat: -1
        });
    }
    update(delta, player) {
        if (!this.isActive) return;
        const dx = player.x - this.sprite.x;
        const dy = player.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.xp.magnetRange) {
            this.body.setVelocity((dx / distance) * CONFIG.xp.magnetSpeed, (dy / distance) * CONFIG.xp.magnetSpeed);
            if (distance < 30) this.collect(player);
        } else if (this.isFlying) {
            // Magnet Vacuum Mode: Accelerate to player
            const speed = 800;
            this.body.setVelocity((dx / distance) * speed, (dy / distance) * speed);
            if (distance < 30) this.collect(player);
        } else {
            this.body.setVelocity(0, 0);
        }
    }

    flyToPlayer(player) {
        this.isFlying = true;
        // Optional: Tween to look nice
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 1.5,
            duration: 200,
            yoyo: true
        });
    }
    collect(player) {
        this.scene.xpSystem.addXP(this.value);
        this.isActive = false;
        this.sprite.destroy();
    }
}