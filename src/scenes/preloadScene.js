import { BASE_CONFIG } from '../config.js';

export class PreloadScene extends Phaser.Scene {
    constructor() { super({ key: 'PreloadScene' }); }

    preload() {

        for (let i = 0; i < BASE_CONFIG.player.length; i++) {
            const player = BASE_CONFIG.player[i];
            if (player.player_body_image) this.load.image(player.key, player.player_body_image);
            if (player.player_legs_image) this.load.image(player.key + '_legs', player.player_legs_image);
        }

        for (let i = 0; i < BASE_CONFIG.weapon.length; i++) {
            const weapon = BASE_CONFIG.weapon[i];
            if (weapon.image) this.load.image(weapon.key, weapon.image);
        }

        for (let i = 0; i < BASE_CONFIG.enemy.length; i++) {
            const enemy = BASE_CONFIG.enemy[i];
            if (enemy.enemy_body_image) this.load.image(enemy.key, enemy.enemy_body_image);
            if (enemy.enemy_legs_image) this.load.image(enemy.key + '_legs', enemy.enemy_legs_image);
        }

        for (let i = 0; i < BASE_CONFIG.xp.gems.length; i++) {
            const xp = BASE_CONFIG.xp.gems[i];
            if (xp.image) this.load.image(xp.key, xp.image);
        }

        if (BASE_CONFIG.background.innerMapImage) {
            this.load.image('bg_inner', BASE_CONFIG.background.innerMapImage);
        }
        if (BASE_CONFIG.background.outsideMapImage) {
            this.load.image('bg_outside', BASE_CONFIG.background.outsideMapImage);
        }

        // Carrega áudios
        if (BASE_CONFIG.audio.bgm) this.load.audio('bgm', BASE_CONFIG.audio.bgm);
        if (BASE_CONFIG.audio.shoot) this.load.audio('shoot', BASE_CONFIG.audio.shoot);
        if (BASE_CONFIG.audio.hit) this.load.audio('hit', BASE_CONFIG.audio.hit);
        if (BASE_CONFIG.audio.levelup) this.load.audio('levelup', BASE_CONFIG.audio.levelup);
        if (BASE_CONFIG.audio.gameover) this.load.audio('gameover', BASE_CONFIG.audio.gameover);

        // Barra de carregamento simples
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'CARREGANDO...', {
            fontFamily: 'Anton', fontSize: '32px', fill: '#FFD700'
        }).setOrigin(0.5);
    }

    create() {
        // Vai para a cena de boot/menu
        this.scene.start('BootScene');
    }
}