import { BaseVFXEffect } from './baseVFXEffect.js';

export class HitStopEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const duration = this.config.duration || 50;

        // Pause Physics
        if (this.scene.physics.world) {
            this.scene.physics.world.pause();
        }

        // Pause Tweens
        this.scene.tweens.pauseAll();

        // Resume after duration
        // We use setTimeout here because scene.time events might be affected if we paused the scene update loop,
        // but typically physics.pause() doesn't stop scene.time. 
        // However, to be safe and independent of scene time dilation:
        setTimeout(() => {
            if (this.scene && this.scene.physics && this.scene.physics.world) {
                this.scene.physics.world.resume();
                this.scene.tweens.resumeAll();
            }
            this.complete();
        }, duration);
    }
}
