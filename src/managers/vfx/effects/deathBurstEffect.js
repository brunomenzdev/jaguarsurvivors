import { BaseVFXEffect } from './baseVFXEffect.js';

export class DeathBurstEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // Visual: Expanding ring
        const ring = this.scene.add.graphics({ x, y });
        ring.lineStyle(2, 0xff0000, 1);
        ring.strokeCircle(0, 0, 10);
        ring.setDepth(999);

        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 400,
            onUpdate: () => {
                // Redraw if needed, but scaling graphics object works for simple shapes
            },
            onComplete: () => {
                ring.destroy();
                this.complete();
            }
        });
    }
}
