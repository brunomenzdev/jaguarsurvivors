import { CONFIG } from '../config.js';

export class Projectile {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.lifeTime = 0;

        // Visual setup (Sprite Pool friendly)
        this.visual = this.scene.physics.add.sprite(0, 0, 'pixel');
        this.body = this.visual.body;

        // Setup inicial
        this.visual.setVisible(false);
        this.visual.setActive(false);
        this.body.enable = false;

        // Referência circular para colisões
        this.visual.parentProjectile = this;
    }

    // --- MÉTODOS EXIGIDOS PELO OBJECT POOL ---

    // O Pool chama isso para "acordar" ou "dormir" o objeto
    setActive(value) {
        this.isActive = value;
        if (this.visual) {
            this.visual.setActive(value);
            // Também ligamos/desligamos a física para economizar processamento
            if (this.body) this.body.enable = value;
        }
    }

    // O Pool chama isso para esconder/mostrar
    setVisible(value) {
        if (this.visual) {
            this.visual.setVisible(value);
        }
    }

    // O Pool tenta chamar 'spawn' ou 'reset', mas sua lógica chamava 'fire'.
    // Criamos esse alias para compatibilidade.
    spawn(config) {
        this.fire(config);
    }

    // --- LÓGICA DO PROJÉTIL ---

    fire(config) {
        const { x, y, targetX, targetY, damage, weapon, projectileSpeed, isCritical, knockbackMultiplier } = config;

        this.damage = damage;
        this.weapon = weapon;
        this.isCritical = isCritical;
        this.knockbackMultiplier = knockbackMultiplier || 1.0;
        this.lifeTime = 0;

        // O setActive(true) e setVisible(true) já foram chamados pelo Pool.get()
        // Aqui focamos em posicionar e configurar visualmente

        // Posição
        this.visual.setPosition(x, y);

        // Textura vs Cor
        if (weapon.projectileTexture && this.scene.textures.exists(weapon.projectileTexture)) {
            this.visual.setTexture(weapon.projectileTexture);
            this.visual.setTint(0xffffff);
        } else {
            this.visual.setTexture('pixel'); // Garanta que essa textura existe!
            const color = isCritical ? 0xFF4500 : (weapon.projectileColor !== undefined ? weapon.projectileColor : 0xFFD700);
            this.visual.setTint(color);
        }

        // Escala
        const baseScale = weapon.projectileScale || 1;
        this.visual.setScale(isCritical ? baseScale * 1.5 : baseScale);

        // Física e Rotação
        const angle = Math.atan2(targetY - y, targetX - x);
        this.visual.setRotation(angle);

        const speed = projectileSpeed || 500;
        this.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Rotação visual (ex: shuriken girando)
        this.scene.tweens.killTweensOf(this.visual); // Limpa tweens antigos
        if (weapon.projectileRotation) {
            this.scene.tweens.add({
                targets: this.visual,
                angle: 360,
                duration: 500,
                repeat: -1
            });
        }
    }

    update(delta) {
        if (!this.isActive) return;

        this.lifeTime += delta;
        // Tempo de vida de segurança (caso não bata em nada)
        if (this.lifeTime > (this.weapon?.range || 2000)) {
            this.kill(); // O Pool release será chamado pelo Weapon.update
        }
    }

    hitEnemy(enemy) {
        if (!this.isActive) return;

        enemy.takeDamage(this.damage, this.isCritical, this.scene.player);

        if (this.weapon.elementalEffect) {
            enemy.applyEffect(this.weapon.elementalEffect, this.weapon.dotDamage, this.weapon.dotDuration);
        }

        const hitSound = this.weapon.hitSoundKey || 'hit';
        // Pequena proteção para não crashar se o som não existir
        if (this.scene.sound.get(hitSound) || this.scene.cache.audio.exists(hitSound)) {
            this.scene.audio.play(hitSound, { volume: 0.4 });
        }

        this.kill();
    }

    // Chamado para desativar o projétil
    kill() {
        // Apenas marcamos como inativo. 
        // O Weapon.js vai ler "isActive = false" e chamar pool.release(p)
        this.isActive = false;

        // Já escondemos imediatamente para feedback visual instantâneo
        this.setVisible(false);
        this.body.enable = false;
        this.body.setVelocity(0, 0);
    }

    // Getter para manter compatibilidade se algum código antigo chamar p.sprite
    get sprite() {
        return this.visual;
    }
}