import { AudioManager } from '../managers/audio/audioManager.js';

export class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }
    create() {
        this.audio = new AudioManager(this);
        this.audio.playBGM('bgm');
    }
}