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

        // Entry animation
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.5)';
        this.container.appendChild(icon);

        // Trigger animation
        requestAnimationFrame(() => {
            icon.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        });

        this.activeIcons.set(buffType, icon);
    }

    hideIcon(buffType) {
        const icon = this.activeIcons.get(buffType);
        if (!icon) return;

        // Exit animation
        icon.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.5)';

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
