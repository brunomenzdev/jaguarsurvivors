import { BaseVFXEffect } from './baseVFXEffect.js';

export class HitImpactEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // Extract config or context
        const color = this.config.color || 0xFFFFFF;
        const duration = this.config.duration || 200;
        const scale = context.isCritical ? 1.5 : 1.0;

        // Visual Element: A flash circle
        const circle = this.scene.add.circle(x, y, 15 * scale, color);
        circle.setDepth(1000); // Ensure it's on top of gameplay

        this.scene.tweens.add({
            targets: circle,
            scale: { from: 1, to: 2 * scale },
            alpha: { from: 1, to: 0 },
            duration: duration,
            ease: 'Quad.out',
            onComplete: () => {
                circle.destroy();
                this.complete();
            }
        });
    }
}
