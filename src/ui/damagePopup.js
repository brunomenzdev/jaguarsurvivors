/**
 * DamageTextPool - DOM-Based version
 * 
 * Replaces Phaser-based damage numbers with standard HTML elements.
 * Improved positioning using camera to screen conversion.
 */
export class DamageTextPool {
    constructor(scene, initialSize = 30) {
        this.scene = scene;
        this.pool = [];
        this.activeWrappers = new Set();

        this.container = document.getElementById('damage-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'damage-container';
            document.getElementById('game-wrapper').appendChild(this.container);
        }

        this.create(initialSize);

        // Sync container with camera scroll
        this.scene.events.on('prerender', this.updateContainerTransform, this);
        this.scene.events.on('shutdown', () => {
            this.scene.events.off('prerender', this.updateContainerTransform, this);
        }, this);
    }

    updateContainerTransform() {
        const cam = this.scene.cameras.main;
        // Invert camera scroll to keep elements fixed to world
        this.container.style.transform = `translate(${-cam.scrollX}px, ${-cam.scrollY}px)`;
    }

    create(count) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'damage-popup';
            el.style.display = 'none';
            this.container.appendChild(el);

            const wrapper = {
                el: el,
                setText: (val) => { el.textContent = val; },
                setPosition: (x, y) => {
                    // We now use world coordinates because the container handles camera scroll
                    wrapper._x = x;
                    wrapper._y = y;
                    el.style.left = `${x}px`;
                    el.style.top = `${y}px`;
                },
                setStyle: (style) => {
                    if (style.fill) el.style.color = style.fill;
                },
                setAlpha: (val) => { el.style.opacity = val; },
                setScale: (val) => { el.style.transform = `scale(${val})`; },
                setOrigin: () => wrapper,
                setVisible: (val) => { el.style.display = val ? 'block' : 'none'; },
                setActive: (val) => { },
                _x: 0,
                _y: 0
            };

            // Tweenable properties
            Object.defineProperty(wrapper, 'alpha', {
                get: () => parseFloat(el.style.opacity) || 1,
                set: (val) => { el.style.opacity = val; }
            });
            Object.defineProperty(wrapper, 'y', {
                get: () => wrapper._y,
                set: (val) => {
                    wrapper._y = val;
                    el.style.top = `${val}px`;
                }
            });
            Object.defineProperty(wrapper, 'x', {
                get: () => wrapper._x,
                set: (val) => {
                    wrapper._x = val;
                    el.style.left = `${val}px`;
                }
            });

            this.pool.push(wrapper);
        }
    }

    get(x, y, damage) {
        let wrapper;

        if (this.pool.length > 0) {
            wrapper = this.pool.pop();
        } else {
            this.create(5);
            wrapper = this.pool.pop();
        }

        wrapper.setPosition(x, y - 30);
        wrapper.setAlpha(1);
        wrapper.setScale(1);
        wrapper.setVisible(true);
        this.activeWrappers.add(wrapper);

        return wrapper;
    }

    return(wrapper) {
        wrapper.setVisible(false);
        this.activeWrappers.delete(wrapper);
        this.pool.push(wrapper);
    }
}