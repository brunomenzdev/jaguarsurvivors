import { BaseVFXEffect } from './baseVFXEffect.js';

export class CameraFlashEffect extends BaseVFXEffect {
    onStart(x, y, context) {
        const duration = this.config.duration || 500;
        const color = this.config.color || 0xFFFFFF; // default white? GameEventHandler used (500, 100, 0, 0) which is strange for 'flash'. 
        // cameras.main.flash(duration, r, g, b). r g b are 0-255? or 0-1? Phaser flash uses r,g,b.
        // Arg check: flash(duration, red, green, blue). Default is white.
        // GameEventHandler used: cameras.main.flash(500, 100, 0, 0); -> Red flash? 100 is valid byte?

        const r = this.config.r !== undefined ? this.config.r : 255;
        const g = this.config.g !== undefined ? this.config.g : 255;
        const b = this.config.b !== undefined ? this.config.b : 255;

        if (this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.flash(duration, r, g, b);
        }
        this.complete();
    }
}
