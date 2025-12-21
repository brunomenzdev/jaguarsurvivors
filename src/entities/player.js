import { CONFIG } from '../config.js';
import { Stat } from '../systems/statSystem.js';
import { SaveManager } from '../managers/SaveManager.js';

export class Player {
    constructor(scene, x, y, playerConfig) {
        this.scene = scene;
        this.playerConfig = playerConfig; // Store for later use
        this.walkTime = 0;
        this._facingRight = true;
        this.isMoving = false;

        // Use config for body dimensions with fallback
        this.bodyWidth = playerConfig.bodyWidth || 60;
        this.bodyHeight = playerConfig.bodyHeight || 130;

        // == STATS SYSTEM ==
        const s = playerConfig.stats || {};
        this.stats = {
            moveSpeed: new Stat(playerConfig.speed),
            maxHealth: new Stat(playerConfig.health),
            damage: new Stat(1.0), // Global damage multiplier
            attackSpeed: new Stat(1.0),
            projectileSpeed: new Stat(1.0),
            area: new Stat(1.0),
            knockbackResistance: new Stat(1.0),
            elementalDamage: new Stat(1.0),

            // New Stats
            critChance: new Stat(0.0), // 0 to 1.0 (0% - 100%)
            criticalDamage: new Stat(1.5), // Multiplier (1.5x default)
            evasion: new Stat(0.0), // 0 to 1.0 (0% - 100%)
            thorns: new Stat(0.0), // 0 to 1.0 (Reflect %)
            knockback: new Stat(1.0), // Force multiplier
            hpRegen: new Stat(0.0), // HP per second
            lifeSteal: new Stat(0.0), // 0 to 1.0 (Percentage of damage dealt)
            goldGain: new Stat(1.0), // Multiplier for gold
            revivals: new Stat(0) // Number of revivals
        };

        // Apply Archetype Multipliers
        if (s.moveSpeed) this.stats.moveSpeed.totalMultiplier = s.moveSpeed;
        if (s.maxHealth) this.stats.maxHealth.totalMultiplier = s.maxHealth;
        if (s.damage) this.stats.damage.totalMultiplier = s.damage;
        if (s.attackSpeed) this.stats.attackSpeed.totalMultiplier = s.attackSpeed;
        if (s.projectileSpeed) this.stats.projectileSpeed.totalMultiplier = s.projectileSpeed;
        if (s.area) this.stats.area.totalMultiplier = s.area;
        if (s.knockbackResistance) this.stats.knockbackResistance.totalMultiplier = s.knockbackResistance;
        if (s.elementalDamage) this.stats.elementalDamage.totalMultiplier = s.elementalDamage;

        // New Stat Initializers from Archetype
        if (s.critChance) this.stats.critChance.addFlat(s.critChance);
        if (s.criticalDamage) this.stats.criticalDamage.addFlat(s.criticalDamage - 1.5);
        if (s.evasion) this.stats.evasion.addFlat(s.evasion);
        if (s.thorns) this.stats.thorns.addFlat(s.thorns);
        if (s.knockback) this.stats.knockback.totalMultiplier = s.knockback;
        if (s.hpRegen) this.stats.hpRegen.addFlat(s.hpRegen);
        if (s.lifeSteal) this.stats.lifeSteal.addFlat(s.lifeSteal);

        // == APPLY META UPGRADES ==
        // Iterate over SaveManager metaUpgrades and apply them
        const meta = SaveManager.getInstance().data.metaUpgrades;
        const metaShopConfig = CONFIG.metaShop;

        metaShopConfig.forEach(upgrade => {
            const rank = meta[upgrade.id] || 0;
            if (rank > 0) {
                const totalBonus = rank * upgrade.bonusPerRank;
                const statKey = upgrade.stat;

                if (this.stats[statKey]) {
                    // Decide if it's a multiplier or flat bonus based on stat type
                    // Ideally config should say, but for now we assume:
                    // Crit, Evasion, Revivals, HP, MoveSpeed, Damage, GoldGain are multipliers (mostly)
                    // Actually existing stats like MoveSpeed/MaxHealth use Base value from config.
                    // So we should add to Multiplier or Flat?
                    // Upgrade desc says "+5% Max HP". So it's a multiplier.

                    if (statKey === 'revivals') {
                        this.stats[statKey].addFlat(totalBonus); // Whole numbers
                    } else if (statKey === 'critChance' || statKey === 'evasion') {
                        this.stats[statKey].addFlat(totalBonus); // Flat % addition
                    } else {
                        // % Increases
                        this.stats[statKey].addMultiplier(totalBonus);
                    }
                    console.log(`Applied Meta Upgrade: ${upgrade.name} Rank ${rank} -> ${statKey} += ${totalBonus}`);
                }
            }
        });

        // Regen Timer
        this.regenTimer = 0;


        // Reusable vector for movement (performance optimization)
        this.moveVector = new Phaser.Math.Vector2(0, 0);

        const weaponConfig = CONFIG.weapon.find(w => w.key === playerConfig.weapon);

        this._container = scene.add.container(x, y);

        // === CORPO ===
        const bodyScale = playerConfig.bodyScale || 0.4;
        const bodyOffset = playerConfig.bodyOffset || -10;
        this.bodySprite = scene.add.image(0, bodyOffset, playerConfig.key).setScale(bodyScale);

        // === PERNAS (Lê da Configuração) ===
        const legX = playerConfig.legs?.x || -6;
        const legY = playerConfig.legs?.y || 16;
        const legOrgX = playerConfig.legs?.originX || 0.5;
        const legOrgY = playerConfig.legs?.originY || 0.5;
        const legsScale = playerConfig.legsScale || 0.4;

        this.leftLeg = scene.add.image(legX, legY, playerConfig.key + "_legs").setScale(legsScale);
        this.rightLeg = scene.add.image(-legX, legY, playerConfig.key + "_legs").setScale(legsScale);

        // Aplica os Origins dinâmicos sem IFs
        this.leftLeg.setOrigin(legOrgX, legOrgY);
        this.rightLeg.setOrigin(legOrgX, legOrgY);

        // === BRAÇO/ARMA (Lê da Configuração) ===
        // Pega a posição da mão do personagem
        const handX = playerConfig.hand?.x || 18;
        const handY = playerConfig.hand?.y || -8;

        this.weapon = scene.add.image(handX, handY, playerConfig.weapon);
        this.weapon.setScale(weaponConfig.scale || 0.6);

        // Seta o Origin de REPOUSO da arma
        this.weapon.setOrigin(weaponConfig.origin.x, weaponConfig.origin.y);
        this.weapon.setAngle(weaponConfig.angleOrigin || 0);
        this.weapon.setDepth(10);

        // Guarda a config da arma dentro do objeto weapon para usar na animação depois
        this.weapon.customConfig = weaponConfig;

        // === ADICIONA AO CONTAINER ===
        this._container.add([this.leftLeg, this.rightLeg, this.bodySprite, this.weapon]);

        // === PHYSICS SETUP ===
        // Habilita física no container
        scene.physics.add.existing(this._container);
        this.body = this._container.body;

        // Configura o tamanho
        this.body.setSize(this.bodyWidth, this.bodyHeight);

        // Para centralizar o body no container, o offset deve ser metade negativa da largura/altura.
        this.body.setOffset(-this.bodyWidth / 2, -this.bodyHeight / 2);

        // Demais configurações
        this.body.setCollideWorldBounds(true);
        this.body.setDrag(playerConfig.friction);

        const initialSpeed = this.stats.moveSpeed.getValue();
        this.body.setMaxVelocity(initialSpeed);

        this._maxHealth = this.stats.maxHealth.getValue();
        this._health = this._maxHealth;
        this.isInvulnerable = false;
        this.invTimer = 0;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        scene.cameras.main.startFollow(this._container);
    }

    update(delta) {
        const up = this.cursors.up.isDown || this.wasd.up.isDown;
        const down = this.cursors.down.isDown || this.wasd.down.isDown;
        const left = this.cursors.left.isDown || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;

        let accX = 0, accY = 0;
        if (left) accX = -1;
        else if (right) accX = 1;
        if (up) accY = -1;
        else if (down) accY = 1;

        if (accX !== 0 || accY !== 0) {
            // Update max velocity dynamically (in case of buffs/debuffs)
            this.body.setMaxVelocity(this.stats.moveSpeed.getValue());

            // Use reusable vector instead of creating new one every frame
            this.moveVector.set(accX, accY).normalize().scale(this.playerConfig.acceleration || 2000);
            this.body.setAcceleration(this.moveVector.x, this.moveVector.y);

            // Facing
            if (accX !== 0) {
                const newFacing = accX > 0;
                this.facingRight = newFacing;
            }
        } else {
            this.body.setAcceleration(0, 0);
        }

        const speed = this.body.velocity.length();
        this.isMoving = speed > 30;

        if (this.leftLeg && this.rightLeg) {
            // Get animation config with fallbacks
            const anim = this.playerConfig.animation || {};
            const swingSpeed = anim.walkSwingSpeed || 0.015;
            const swingAmp = anim.walkSwingAmplitude || 0.15;
            const bobSpeed = anim.walkBobSpeed || 0.02;
            const bobAmp = anim.walkBobAmplitude || 2;
            const baseY = this.playerConfig.legs?.y || 16;

            if (this.isMoving) {
                this.walkTime += delta;

                // Swing oposto
                const swing = Math.sin(this.walkTime * swingSpeed) * swingAmp;
                this.leftLeg.rotation = swing;
                this.rightLeg.rotation = -swing;

                // Bob sincronizado
                const bob = Math.sin(this.walkTime * bobSpeed) * bobAmp;
                this.leftLeg.y = baseY + bob;
                this.rightLeg.y = baseY + bob;
            } else {
                // Volta ao repouso suavemente - use config damping
                const rotDamping = anim.restDamping?.rotation || 0.9;
                const posDamping = anim.restDamping?.position || 0.2;
                this.leftLeg.rotation *= rotDamping;
                this.rightLeg.rotation *= rotDamping;
                this.leftLeg.y += (baseY - this.leftLeg.y) * posDamping;
                this.rightLeg.y += (baseY - this.rightLeg.y) * posDamping;
            }
        }

        // Invuln blink
        if (this.isInvulnerable) {
            this.invTimer -= delta;
            this.container.alpha = (Math.floor(this.invTimer / 100) % 2) ? 0.5 : 1;
            if (this.invTimer <= 0) {
                this.isInvulnerable = false;
                this.container.alpha = 1;
            }
        }

        // HP Regeneration
        const regen = this.stats.hpRegen.getValue();
        if (regen > 0 && this.health < this.maxHealth) {
            this.regenTimer += delta;
            if (this.regenTimer >= 1000) {
                this.regenTimer = 0;
                this.heal(regen);
            }
        }
    }

    takeDamage(amount, attacker = null) {
        if (this.isInvulnerable) return;

        // == EVASION CHECK ==
        const evasionChance = this.stats.evasion.getValue();
        if (Math.random() < evasionChance) {
            this.scene.events.emit('player-evaded', this);
            return; // Ignore damage
        }

        // == THORNS CHECK ==
        const thornsPercent = this.stats.thorns.getValue();
        if (thornsPercent > 0 && attacker && attacker.takeDamage) {
            const reflectAmount = amount * thornsPercent;
            // Apply damage to attacker (without triggering their own thorns recursively ideally, 
            // but for now simple callback)
            attacker.takeDamage(reflectAmount);
            this.scene.showDamagePopup(attacker.x, attacker.y, Math.floor(reflectAmount), '#800080'); // Purple for thorns
            this.scene.events.emit('player-thorns', this);
        }

        this.health -= amount;
        this.isInvulnerable = true;
        this.invTimer = this.playerConfig.invulnerableTime || 500;

        // Emit event for visual/audio feedback (decoupled)
        this.scene.events.emit('player-damaged', amount);

        if (this.health <= 0) {
            this.scene.events.emit('player-died');
        }
    }

    heal(amount) {
        if (this.health >= this.maxHealth || amount <= 0) return;

        const oldHealth = this.health;
        this.health = Math.min(this.health + amount, this.maxHealth);

        const healedAmount = this.health - oldHealth;
        if (healedAmount > 0) {
            this.scene.showDamagePopup(this.x, this.y - 50, `+${Math.floor(healedAmount)}`, '#00FF00');
        }
    }

    get container() { return this._container; }
    get x() { return this._container.x; }
    get y() { return this._container.y; }
    get facingRight() { return this._facingRight; }
    get health() { return this._health; }
    set health(value) { this._health = value; }
    get maxHealth() { return this._maxHealth; }
    set maxHealth(value) { this._maxHealth = value; }

    set facingRight(value) {
        if (this._facingRight === value) return; // Se não houver mudança, não faça nada

        this._facingRight = value;

        // 1. INVERTE VISUALMENTE O CONTAINER
        this._container.setScale(value ? 1 : -1, 1);

        // 2. CORRIGE O OFFSET DA FÍSICA

        // --- CORREÇÃO 3: ACESSANDO AS PROPRIEDADES DA CLASSE ---
        const bodyWidth = this.bodyWidth; // Acessa this.bodyWidth
        const bodyHeight = this.bodyHeight; // Acessa this.bodyHeight

        // Calcula o novo offset horizontal.
        // Se olhando para a direita (true), o offset é negativo (-30)
        // Se olhando para a esquerda (false), o offset deve ser positivo (+30)
        const newOffsetX = value ? (-bodyWidth / 2) : (bodyWidth / 2);

        // Mantém o offset Y (vertical) inalterado
        const newOffsetY = -bodyHeight / 2;

        this.body.setOffset(newOffsetX, newOffsetY);
    }
}