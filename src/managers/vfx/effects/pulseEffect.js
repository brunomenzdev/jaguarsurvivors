import { BaseVFXEffect } from './baseVFXEffect.js';

export class PulseEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const target = context.target || (context.rawArgs && context.rawArgs[0]);
        // Pulse usually targets the container or sprite
        const objectToPulse = (target && target.container) ? target.container : target;

        if (objectToPulse && objectToPulse.setScale) {
            const scaleFactor = this.config.scale || 1.2;
            const duration = this.config.duration || 100;

            const originalScaleX = objectToPulse.scaleX;
            const originalScaleY = objectToPulse.scaleY;

            this.scene.tweens.add({
                targets: objectToPulse,
                scaleX: originalScaleX * scaleFactor,
                scaleY: originalScaleY * scaleFactor,
                duration: duration / 2,
                yoyo: true,
                onComplete: () => {
                    // Safety check if object still exists
                    if (objectToPulse && objectToPulse.setScale) {
                        objectToPulse.setScale(originalScaleX, originalScaleY);
                    }
                    this.complete();
                }
            });
        } else {
            this.complete();
        }
    }
}
