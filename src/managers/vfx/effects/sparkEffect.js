import { BaseVFXEffect } from './baseVFXEffect.js';

export class SparkEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const count = this.config.count || 5;
        const speedMin = this.config.speedMin || 100;
        const speedMax = this.config.speedMax || 200;
        const color = this.config.color || 0xFFFF00;
        const life = this.config.life || 300;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = speedMin + Math.random() * (speedMax - speedMin);

            // Using a simple rectangle or small circle for spark
            const spark = this.scene.add.rectangle(x, y, 4, 4, color);
            this.scene.physics.add.existing(spark);

            // Safety check in case physics body isn't created (e.g. static body issue, though rare for .add.existing)
            if (spark.body) {
                spark.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
                // Fake gravity or drag could be added here
            }

            this.scene.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 0,
                duration: life,
                onComplete: () => {
                    spark.destroy();
                    // We only call complete() once, effectively this logic awaits all? 
                    // No, BaseVFXEffect doesn't block. 
                    // But if we want to pool "SparkEffect", we need to know when ALL sparks are gone.
                    // For now, simplificy: we don't manage the composite lifespan strictly in this base version.
                    // Ideally check if (i === count - 1) complete();
                }
            });
        }

        // Mark as complete immediately? No, the visual lingers. 
        // For pooling, we'd need to wait. For "fire and forget", it's fine.
        // We'll call complete after the longest duration merely for "lifecycle correctness" if we were tracking it.
        this.scene.time.delayedCall(life, () => this.complete());
    }
}
