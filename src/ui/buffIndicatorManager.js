import { CONFIG } from '../config/config.js';

/**
 * BuffIndicatorManager
 * 
 * Displays active pickup buff icons in the HUD.
 * Shows the pickup sprite as an icon while the buff is active.
 */
export class BuffIndicatorManager {
    constructor(scene) {
        this.scene = scene;
        this.container = document.getElementById('buff-indicators');
        this.activeIcons = new Map();

        if (!this.container) {
            console.warn('[BuffIndicatorManager] Container #buff-indicators not found in DOM');
            return;
        }

        this.registerEvents();
    }

    registerEvents() {
        this.scene.events.on('buff-started', this.showIcon, this);
        this.scene.events.on('buff-ended', this.hideIcon, this);
    }

    /**
     * Maps buff type to pickup type for sprite lookup.
     */
    getPickupTypeForBuff(buffType) {
        const map = {
            'shield': 'shield_core',
            'rage': 'rage_orb',
            'time_freeze': 'time_freeze',
            'speed': 'boots'
        };
        return map[buffType] || buffType;
    }

    /**
     * Get border color for buff type.
     */
    getBorderColorForBuff(buffType) {
        const colors = {
            'shield': '#00AAFF',
            'rage': '#FF4400',
            'time_freeze': '#8800FF',
            'speed': '#00FFFF'
        };
        return colors[buffType] || '#FFD700';
    }

    showIcon(buffType, config) {
        if (!this.container) return;
        if (this.activeIcons.has(buffType)) return;

        const pickupType = this.getPickupTypeForBuff(buffType);
        const pickupConfig = CONFIG.pickups?.types?.[pickupType];
        if (!pickupConfig) {
            console.warn('[BuffIndicatorManager] No pickup config for:', pickupType);
            return;
        }

        const icon = document.createElement('div');
        icon.className = 'buff-icon';
        icon.id = `buff-${buffType}`;
        icon.style.borderColor = this.getBorderColorForBuff(buffType);

        const img = document.createElement('img');
        img.src = pickupConfig.image;
        img.alt = buffType;
        icon.appendChild(img);

        this.container.appendChild(icon);

        // Entry animation via class
        icon.classList.add('buff-entrance');

        this.activeIcons.set(buffType, icon);

        // Set up expiration pulse if it has duration
        if (config && config.duration) {
            setTimeout(() => {
                if (this.activeIcons.has(buffType)) {
                    icon.classList.add('buff-expiring');
                }
            }, config.duration - 2000); // Pulse last 2 seconds
        }
    }

    hideIcon(buffType) {
        const icon = this.activeIcons.get(buffType);
        if (!icon) return;

        // Exit animation via class
        icon.classList.add('buff-exit');

        setTimeout(() => {
            if (icon.parentNode) {
                icon.remove();
            }
        }, 300);

        this.activeIcons.delete(buffType);
    }

    reset() {
        this.activeIcons.forEach((icon, type) => {
            if (icon.parentNode) icon.remove();
        });
        this.activeIcons.clear();
    }

    destroy() {
        this.scene.events.off('buff-started', this.showIcon, this);
        this.scene.events.off('buff-ended', this.hideIcon, this);
        this.reset();
    }
}
