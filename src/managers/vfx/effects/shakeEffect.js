import { BaseVFXEffect } from './baseVFXEffect.js';

export class ShakeEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const intensity = this.config.intensity || 0.01;
        const duration = this.config.duration || 100;

        if (this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(duration, intensity);
        }

        // Shake is an async visual effect but we don't necessarily need to "wait" for it to finish 
        // to consider the effect trigger complete, OR we can wait.
        // For pooling purposes, this effect object doesn't hold state that needs cleanup after the shake command.
        // So we can complete immediately.
        this.complete();
    }
}
