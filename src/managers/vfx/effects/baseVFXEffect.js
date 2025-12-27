/**
 * Base class for all Visual Effects.
 * Enforces specific lifecycle methods and structure.
 */
export class BaseVFXEffect {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = config;
        this.isActive = false;
        this.pool = null; // Can be assigned if using pooling
    }

    /**
     * Starts the effect at specific coordinates with context data.
     * @param {number} x - World X position
     * @param {number} y - World Y position
     * @param {object} context - Event payload/context data
     */
    start(x, y, context = {}) {
        this.isActive = true;
        this.onStart(x, y, context);
    }

    // ObjectPool Interface Methods
    setActive(value) {
        this.isActive = value;
    }

    setVisible(value) {
        // Effects might handle visibility internally, but this is required for ObjectPool
    }

    reset(config) {
        if (config) {
            this.config = config;
        }
    }

    /**
     * Internal method to implement the specific visual logic.
     * Must be overridden by subclasses.
     */
    onStart(x, y, context) {
        console.warn('BaseVFXEffect: onStart not implemented');
    }

    /**
     * Complete the effect and clean up or return to pool.
     */
    complete() {
        this.isActive = false;
        if (this.pool) {
            this.pool.release(this);
        } else {
            this.destroy(); // Fallback if no pooling
        }
    }

    /**
     * Force stop the effect.
     */
    stop() {
        this.isActive = false;
        this.onStop();
    }

    onStop() {
        // Optional override
    }

    /**
     * Clean up resources.
     */
    destroy() {
        // Optional override
    }
}
