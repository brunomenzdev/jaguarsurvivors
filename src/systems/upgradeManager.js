import { CONFIG } from '../config.js';

export class UpgradeManager {
    constructor(scene) {
        this.scene = scene;
        this.upgradeCounts = {}; // Track levels of upgrades
        this.acquiredEvolutions = new Set();

        this.allUpgrades = [
            {
                id: 'dmg',
                name: 'DANO LETAL',
                icon: '⚔️',
                desc: '+20% Dano',
                apply: () => {
                    this.scene.player.stats.damage.addMultiplier(0.2);
                }
            },
            {
                id: 'cd',
                name: 'GATILHO RÁPIDO',
                icon: '⚡',
                desc: '+20% Vel. Ataque', // Changed from Cooldown to be consistent with mechanism
                apply: () => {
                    this.scene.player.stats.attackSpeed.addMultiplier(0.2);
                }
            },
            {
                id: 'spd',
                name: 'AGILIDADE',
                icon: '👟',
                desc: '+15% Move Spd',
                apply: () => {
                    this.scene.player.stats.moveSpeed.addMultiplier(0.15);
                    // Force update max velocity immediately
                    const newSpeed = this.scene.player.stats.moveSpeed.getValue();
                    this.scene.player.body.setMaxVelocity(newSpeed);
                }
            },
            {
                id: 'rng',
                name: 'OLHO DE ÁGUIA',
                icon: '🎯',
                desc: '+25% Alcance/Área',
                apply: () => {
                    this.scene.player.stats.area.addMultiplier(0.25);
                }
            },
            {
                id: 'hp',
                name: 'BLINDAGEM',
                icon: '🛡️',
                desc: '+20 HP Máx',
                apply: () => {
                    this.scene.player.stats.maxHealth.addFlat(20);
                    // Heal and update max health
                    this.scene.player.maxHealth = this.scene.player.stats.maxHealth.getValue();
                    this.scene.player.health += 20;
                }
            },
            {
                id: 'prj',
                name: 'MUNIÇÃO VELOZ',
                icon: '💨',
                desc: '+30% Vel. Projétil',
                apply: () => {
                    this.scene.player.stats.projectileSpeed.addMultiplier(0.3);
                }
            },
            {
                id: 'crit',
                name: 'INSTINTO ASSASSINO',
                icon: '🗡️',
                desc: '+10% Chance Crítico',
                apply: () => {
                    this.scene.player.stats.critChance.addFlat(0.1);
                }
            },
            {
                id: 'evasion',
                name: 'REFLEXOS DE LINCE',
                icon: '🍃',
                desc: '+5% Esquiva',
                apply: () => {
                    this.scene.player.stats.evasion.addFlat(0.05);
                }
            },
            {
                id: 'thorns',
                name: 'ARMADURA DE ESPINHOS',
                icon: '🌵',
                desc: 'Reflete 20% do Dano',
                apply: () => {
                    this.scene.player.stats.thorns.addFlat(0.2);
                }
            },
            {
                id: 'knockback',
                name: 'IMPACTO BRUTAL',
                icon: '👊',
                desc: '+30% Força Empurrão',
                apply: () => {
                    this.scene.player.stats.knockback.addMultiplier(0.3);
                }
            },
            {
                id: 'elemental',
                name: 'MESTRE DOS ELEMENTOS',
                icon: '🔥',
                desc: '+25% Dano Elemental',
                apply: () => {
                    this.scene.player.stats.elementalDamage.addMultiplier(0.25);
                }
            },
            {
                id: 'pact_glass_cannon',
                name: 'PACTO DE SANGUE',
                icon: '🩸',
                desc: '+50% Dano, -20% Vida Máx',
                apply: () => {
                    this.scene.player.stats.damage.addMultiplier(0.5);
                    this.scene.player.stats.maxHealth.addMultiplier(-0.2);
                    // Update current health to reflect max health drop if needed, or let it be percentage based?
                    // Currently health is absolute. If max drops below current, clamp it.
                    const newMax = this.scene.player.stats.maxHealth.getValue();
                    this.scene.player.maxHealth = newMax;
                    if (this.scene.player.health > newMax) this.scene.player.health = newMax;
                }
            },
            {
                id: 'vampirism',
                name: 'VAMPIRISMO',
                icon: '🧛',
                desc: '+2% Life Steal',
                apply: () => {
                    this.scene.player.stats.lifeSteal.addFlat(0.02);
                }
            },
            {
                id: 'meditation',
                name: 'MEDITAÇÃO',
                icon: '🧘',
                desc: '+1 HP/sec Regen',
                apply: () => {
                    this.scene.player.stats.hpRegen.addFlat(1.0);
                }
            },
            {
                id: 'lucky',
                name: 'SORTE GRANDE',
                icon: '🍀',
                desc: '+Drop Chance',
                apply: () => {
                    // This affects global drop chance? Or config?
                    // Currently config is per enemy.
                    // We can implement a luck stat or modifier.
                    // For now, let's just make it a placeholder or modify global logic.
                    // Let's iterate CONFIG.enemy and boost dropChance
                    // A crude but effective way for this prototype
                    CONFIG.enemy.forEach(e => {
                        if (e.dropChance) e.dropChance *= 1.2;
                    });
                }
            }
        ];

        // Definindo Sinergias (Evoluções)
        this.synergies = [
            {
                resultId: 'evo_ghost_blade',
                name: 'GHOST BLADE',
                icon: '👻',
                desc: 'LEGENDARY: Ignora Armor + Dano Crítico Massivo',
                reqWeapon: 'weapon_katana',
                reqPassive: 'crit',
                reqPassiveLevel: 1, // Require at least 1 level of crit
                apply: () => {
                    this.scene.player.stats.damage.addMultiplier(1.0); // Massive damage boost
                    this.scene.player.stats.critChance.addFlat(0.2);
                    this.scene.player.stats.criticalDamage.addFlat(1.0);
                    // Visual changes could go here
                }
            },
            {
                resultId: 'evo_holy_smite',
                name: 'JULGAMENTO DIVINO',
                icon: '✨',
                desc: 'LEGENDARY: Ataques explodem em área',
                reqWeapon: 'weapon_sword',
                reqPassive: 'rng', // Range/Area
                reqPassiveLevel: 1,
                apply: () => {
                    this.scene.player.stats.area.addMultiplier(0.5);
                    this.scene.player.stats.damage.addMultiplier(0.5);
                }
            }
        ];
    }

    getSynergyUpgrade() {
        const weaponKey = this.scene.playerConfig.weapon; // Current weapon

        for (const syn of this.synergies) {
            // Check if already acquired
            if (this.acquiredEvolutions.has(syn.resultId)) continue;

            // Check Requirements
            if (syn.reqWeapon === weaponKey) {
                const passiveLevel = this.upgradeCounts[syn.reqPassive] || 0;
                if (passiveLevel >= syn.reqPassiveLevel) {
                    return syn; // Return this evolution as a priority option
                }
            }
        }
        return null; // No synergy available
    }

    getRandomUpgrades(count = 3) {
        const options = [];

        // 1. Check for Synergy/Evolution (Priority)
        const synergy = this.getSynergyUpgrade();
        if (synergy) {
            options.push({
                id: synergy.resultId,
                name: synergy.name,
                icon: synergy.icon,
                desc: synergy.desc,
                isEvolution: true, // Marker for UI
                apply: () => {
                    synergy.apply();
                    this.acquiredEvolutions.add(synergy.resultId);
                }
            });
            // If we found a synergy, we might want to fill the rest or just offer it unique?
            // Let's fill the rest.
        }

        // 2. Fill remaining slots with random upgrades
        const needed = count - options.length;
        const randoms = [...this.allUpgrades].sort(() => Math.random() - 0.5).slice(0, needed);

        return [...options, ...randoms];
    }

    applyUpgrade(id) {
        // Check regular upgrades
        const u = this.allUpgrades.find(x => x.id === id);
        if (u) {
            u.apply();
            this.upgradeCounts[id] = (this.upgradeCounts[id] || 0) + 1;
        } else {
            // Check evolutions (they are applied inside the options wrapper, but if called by ID manually)
            // The wrapper in getRandomUpgrades handles application.
            // If we ever need to apply by ID from elsewhere, we'd need to look nicely.
            // For now, assume the UI calls the closure we passed or we find it in synergy list.
            const evo = this.synergies.find(x => x.resultId === id);
            if (evo) {
                evo.apply();
                this.acquiredEvolutions.add(evo.resultId);
            }
        }
    }
}