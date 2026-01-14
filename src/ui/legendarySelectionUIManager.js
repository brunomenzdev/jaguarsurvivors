/**
 * LegendarySelectionUIManager
 * 
 * Premium UI for selecting legendary rewards.
 * Features:
 * - Card-based layout with sprite icons
 * - Animated entrance effects
 * - Hover/selection feedback with audio
 * - Matches UpgradeUIManager visual style
 */
export class LegendarySelectionUIManager {
    constructor(scene) {
        this.scene = scene;
        this.container = this.createContainer();
        this.isSelecting = false;
    }

    createContainer() {
        const div = document.createElement('div');
        div.id = 'legendary-selection';
        div.className = 'legendary-selection-screen';

        // Title
        const title = document.createElement('h1');
        title.className = 'legendary-title';
        title.innerText = 'RECOMPENSA LENDÁRIA';
        div.appendChild(title);

        // Subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'legendary-subtitle';
        subtitle.innerText = 'Escolha um poder ancestral';
        div.appendChild(subtitle);

        // Cards container
        const cardsContainer = document.createElement('div');
        cardsContainer.id = 'legendary-cards';
        cardsContainer.className = 'legendary-cards-container';
        div.appendChild(cardsContainer);

        document.getElementById('game-wrapper').appendChild(div);
        return div;
    }

    show(rewards) {
        const cardsContainer = this.container.querySelector('#legendary-cards');
        cardsContainer.innerHTML = '';
        this.isSelecting = false;

        rewards.forEach((reward, index) => {
            const card = this.createCard(reward, index);
            cardsContainer.appendChild(card);
        });

        this.container.classList.add('active');

        // Play legendary reveal sound
        if (this.scene.audio) {
            this.scene.audio.play('levelup');
        }
    }

    createCard(reward, index) {
        const card = document.createElement('div');
        card.className = 'legendary-card';
        card.style.animationDelay = `${index * 0.12}s`;

        // Sprite icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'legendary-icon';

        // Use sprite if available, otherwise use emoji
        if (reward.sprite) {
            iconContainer.style.backgroundImage = `url(src/assets/images/${reward.sprite}.png)`;
        } else {
            iconContainer.innerHTML = `<span class="legendary-emoji">${reward.icon || '⭐'}</span>`;
        }

        // Category badge
        const badge = document.createElement('div');
        badge.className = 'legendary-type-badge';
        badge.innerText = reward.category || reward.type?.toUpperCase() || 'LEGENDARY';

        // Name
        const title = document.createElement('h2');
        title.className = 'legendary-card-name';
        title.innerText = reward.name;

        // Description
        const desc = document.createElement('p');
        desc.className = 'legendary-card-description';
        desc.innerText = reward.description;

        // Rarity indicator
        const rarity = document.createElement('div');
        rarity.className = 'legendary-rarity-glow';

        card.append(iconContainer, badge, title, desc, rarity);

        // Interactions
        card.onmouseenter = () => {
            if (this.scene.events) {
                this.scene.events.emit('ui-hover');
            }
        };

        card.onclick = () => {
            if (this.isSelecting) return;

            if (this.scene.events) {
                this.scene.events.emit('ui-click');
            }

            // Visual feedback
            card.classList.add('selected');

            this.selectReward(reward);
        };

        return card;
    }

    hide() {
        this.container.classList.remove('active');
    }

    selectReward(reward) {
        if (this.isSelecting) return;
        this.isSelecting = true;

        // Small delay for selection animation to play
        setTimeout(() => {
            this.scene.legendaryRewardManager.activateLegendary(reward.id);
            this.hide();

            if (this.scene.bootstrap && this.scene.bootstrap.uiFlow) {
                this.scene.bootstrap.uiFlow.closeScreen('legendary');
            } else {
                this.scene.scene.resume();
            }
        }, 200);
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
