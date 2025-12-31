export class EnemyStatus {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.activeEffects = new Map();

        // Settings
        this.damageTickInterval = 500; // ms

        // Base visuals
        this.originalTint = 0xFFFFFF;
    }

    reset() {
        this.activeEffects.clear();
        this.enemy.view.clearTint();
        this.originalTint = 0xFFFFFF;
        // Restore if config had tint? EnemyView.spawn handles base tint.
        // We assume EnemyView.spawn is called resetting everything.
    }

    apply(type, config) {
        if (!type || type === 'none') return;
        type = type.toLowerCase();

        // Config: { damage: number, duration: number }
        this.activeEffects.set(type, {
            duration: config.duration || 1000,
            tickTimer: 0,
            damage: config.damage || 0,
            type: type
        });

        // Event for UI/Sound
        this.scene.events.emit('status-applied', this.enemy, type);
        this.updateVisuals();
    }

    update(delta) {
        if (this.enemy.entity.isDead()) return;

        // 1. Process Active Effects
        for (const [type, effect] of this.activeEffects.entries()) {
            effect.duration -= delta;
            effect.tickTimer += delta;

            // Tick Damage
            if (effect.tickTimer >= this.damageTickInterval) {
                effect.tickTimer = 0;
                if (effect.damage > 0) {
                    // Apply dot damage
                    this.enemy.takeDamage(effect.damage, false, { key: 'status_' + type });
                }
            }

            // Clean up expired
            if (effect.duration <= 0) {
                this.activeEffects.delete(type);
                this.updateVisuals();
            }
        }

        // 2. Refresh visuals if state changes (e.g. enrage check optimization could be here)
        // But doing it every frame is heavy. We rely on apply/expire to trigger updateVisuals.
        // However, Enrage is health based. We check Enrage transition.
        this.checkEnrageTransition();
    }

    checkEnrageTransition() {
        if (!this.enemy.isBoss) return;

        const bossData = this.enemy.entity.config.bossData || {};
        if (!bossData.enrageHealthThreshold) return;

        const healthPercent = this.enemy.health / this.enemy.maxHealth;
        const isEnraged = healthPercent <= bossData.enrageHealthThreshold;

        // If newly enraged
        if (isEnraged && !this.isEnraged) {
            this.isEnraged = true;
            this.updateVisuals();

            // Pop effect
            this.scene.tweens.add({
                targets: this.enemy.view.sprite,
                scale: this.enemy.view.sprite.scaleX * 1.2,
                yoyo: true,
                duration: 200
            });
        }
    }

    getSpeedMultiplier() {
        let multiplier = 1.0;

        if (this.activeEffects.has('freeze')) {
            multiplier *= 0.4;
        }

        if (this.isEnraged) {
            multiplier *= 1.5; // Hardcoded enrage speed boost or from config
        }

        return multiplier;
    }

    isStunned() {
        return this.activeEffects.has('stun');
    }

    updateVisuals() {
        this.enemy.view.clearTint();

        // Priority: Stun > Freeze > Burn > Poison > Enrage > Normal
        if (this.activeEffects.has('stun')) {
            this.enemy.view.setTint(0xFFFF00);
        } else if (this.activeEffects.has('freeze')) {
            this.enemy.view.setTint(0x00FFFF);
        } else if (this.activeEffects.has('burn')) {
            this.enemy.view.setTint(0xFF7700);
        } else if (this.activeEffects.has('poison')) {
            this.enemy.view.setTint(0x00FF00);
        } else if (this.isEnraged) {
            const bossData = this.enemy.entity.config.bossData || {};
            this.enemy.view.setTint(bossData.enrageTint || 0xFF0000);
        } else {
            // Revert to config tint if needed
            const configTint = this.enemy.entity.config.tint || 0xFFFFFF;
            if (configTint !== 0xFFFFFF) this.enemy.view.setTint(configTint);
        }
    }

    onDeath() {
        // Poison Spread Logic
        if (this.activeEffects.has('poison')) {
            const range = 150;
            const enemies = this.scene.enemySystem?.enemySpawner?.getEnemies() || []; // Robust check

            const nearby = enemies.filter(e =>
                e !== this.enemy &&
                e.isActive &&
                Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, e.x, e.y) < range
            );

            nearby.forEach(e => {
                // Apply poison to nearby enemies
                if (e.applyEffect) {
                    e.applyEffect('poison', 1, 2000);
                }
            });
        }
    }
}
