import { BaseVFXEffect } from './baseVFXEffect.js';

export class ParticleEmitterEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        // config should contain particle config
        // e.g. { texture: 'flare', config: { speed: 100, lifespan: 500, ... } }

        const texture = this.config.texture || 'flare_yellow'; // Default texture
        const emitterConfig = this.config.emitterConfig || {};

        // Use Phaser's particle system
        // Note: In newer Phaser 3 versions, this.scene.add.particles(x, y, texture, config)

        if (!this.emitter) {
            // If we are pooling and holding onto the emitter, standard create
            // But if we want to be truly stateless, we create and destroy.
            // For high performance, better to keep the particle manager alive?
            // "Effect" is transient. Maybe create an emitter on the fly.

            this.emitterManager = this.scene.add.particles(x, y, texture, {
                ...emitterConfig,
                emitting: false
            });
            this.emitterManager.setDepth(this.config.depth || 1000);

            // If it's a burst
            const count = this.config.count || 10;
            this.emitterManager.explode(count);

            // Auto cleanup based on lifespan
            const lifespan = emitterConfig.lifespan || 1000;
            // lifespan can be object like { min: 500, max: 1000 }
            const maxLife = (typeof lifespan === 'object') ? lifespan.max : lifespan;

            this.scene.time.delayedCall(maxLife + 100, () => {
                this.complete();
            });
        } else {
            // Reuse logic if we kept the emitter (requires structural changes to base)
        }
    }

    destroy() {
        if (this.emitterManager) {
            this.emitterManager.destroy();
            this.emitterManager = null;
        }
    }
}
