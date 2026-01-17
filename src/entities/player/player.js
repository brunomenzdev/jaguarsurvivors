import { PlayerStats } from './playerStats.js';
import { PlayerView } from './playerView.js';
import { PlayerMovement } from './playerMovement.js';
import { PlayerDash } from './playerDash.js';


export class Player {
    constructor(scene, x, y, playerConfig) {
        this.scene = scene;
        this.config = playerConfig;

        this.stats = new PlayerStats(playerConfig);
        this.view = new PlayerView(scene, x, y, playerConfig);
        this.movement = new PlayerMovement(scene, this.view.container, this.stats, playerConfig);
        this.dash = new PlayerDash(scene, this, this.stats, playerConfig);


        this._health = this.stats.maxHealth;
        this._shield = 0;
        this.isInvulnerable = false;
        this.invTimer = 0;
        this.regenTimer = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        scene.cameras.main.startFollow(this.view.container);
    }

    update(delta) {
        // Dash logic takes precedence over normal movement
        const isDashing = this.dash.update(this.cursors, this.wasd, delta);

        if (!isDashing) {
            this.movement.update(this.cursors, this.wasd, delta);
        }

        this.view.update(delta, this.movement.isMoving);

        this._updateInvulnerability(delta);
        this._updateRegen(delta);
    }

    takeDamage(amount, attacker = null) {
        if (this.isInvulnerable) return;

        // Check for shield buff (absorbs damage)
        const shieldBuff = this.scene.playerBuffManager?.getActiveBuff('shield');
        if (shieldBuff) {
            shieldBuff.data.hitsRemaining--;
            console.debug('[Player] Shield absorbed hit. Remaining:', shieldBuff.data.hitsRemaining);
            this.scene.events.emit('shield-absorbed', shieldBuff.data.hitsRemaining);

            // Shield break effect
            if (shieldBuff.data.hitsRemaining <= 0) {
                this.scene.playerBuffManager.removeBuff('shield');
            }

            // Brief invulnerability after shield absorbs
            this.isInvulnerable = true;
            this.invTimer = 200;
            return; // Damage fully absorbed
        }

        // Check for amount-based shield (absorbs damage value)
        if (this._shield > 0) {
            const absorbed = Math.min(this._shield, amount);
            this._shield -= absorbed;
            amount -= absorbed;

            console.debug('[Player] Shield absorbed damage:', absorbed, 'Remaining shield:', this._shield);

            // Emit health change even if only shield changed to update UI
            this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth, this._shield);

            if (amount <= 0) {
                // Damage fully absorbed by shield
                this.isInvulnerable = true;
                this.invTimer = 200;
                return;
            }
        }

        if (Math.random() < this.stats.evasion) {
            console.debug("EVENT_EMITTED", { eventName: 'player-evaded', payload: null });
            this.scene.events.emit('player-evaded');
            return;
        }

        if (this.stats.thorns > 0 && attacker?.takeDamage) {
            attacker.takeDamage(amount * this.stats.thorns);
        }

        this._health -= amount;
        this.isInvulnerable = true;
        this.invTimer = this.config.invulnerableTime || 500;

        console.debug("EVENT_EMITTED", { eventName: 'player-damaged', payload: amount });
        this.scene.events.emit('player-damaged', amount);
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth, shield: this._shield } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth, this._shield);

        if (this._health <= 0) {
            console.debug("EVENT_EMITTED", { eventName: 'player-died', payload: null });
            this.scene.events.emit('player-died');
        }
    }

    heal(amount) {
        if (amount <= 0 || this._health >= this.stats.maxHealth) return;
        this._health = Math.min(this._health + amount, this.stats.maxHealth);
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth, shield: this._shield } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth, this._shield);
    }

    _updateInvulnerability(delta) {
        if (!this.isInvulnerable) return;

        this.invTimer -= delta;
        this.view.setBlink(this.invTimer);

        if (this.invTimer <= 0) {
            this.isInvulnerable = false;
            this.view.clearBlink();
        }
    }

    _updateRegen(delta) {
        if (this.stats.hpRegen <= 0 || this._health >= this.stats.maxHealth) return;

        this.regenTimer += delta;
        if (this.regenTimer >= 1000) {
            this.regenTimer = 0;
            this.heal(this.stats.hpRegen);
        }
    }

    get x() { return this.view.container.x; }
    get y() { return this.view.container.y; }
    get health() { return this._health; }
    set health(value) {
        this._health = value;
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth, shield: this._shield } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth, this._shield);
    }

    get shield() { return this._shield; }
    set shield(value) {
        this._shield = Math.max(0, value);
        console.debug("EVENT_EMITTED", { eventName: 'player-health-changed', payload: { health: this._health, maxHealth: this.stats.maxHealth, shield: this._shield } });
        this.scene.events.emit('player-health-changed', this._health, this.stats.maxHealth, this._shield);
    }
    get weaponSprite() { return this.view.weapon; }
    get facingRight() { return this.movement.facingRight !== false; } // Default to true
    get active() { return this.view?.container?.active ?? true; }
    get isActive() { return this.active; }
}