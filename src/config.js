export const BASE_CONFIG = {
    // == PLAYER ==    
    // == PLAYER ==    
    player: [{
        key: 'presida', name: 'O Presida', player_body_image: 'src/assets/images/presida.png', player_legs_image: 'src/assets/images/presida_legs.png',
        speed: 300, acceleration: 2000, friction: 1500, size: 40, weapon: 'weapon_sword',
        health: 120, invulnerableTime: 500,
        bodyScale: 0.3, legsScale: 0.3, bodyOffset: -10,
        bodyWidth: 60, bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.3, originY: -1.5 },
        hand: { x: 22, y: -5 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 2, restDamping: { rotation: 0.9, position: 0.2 } },
        stats: { // Balanced
            moveSpeedString: '1.0x', // Visual helper
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            projectileSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05, // 5% base
            criticalDamage: 1.5, // 150% dmg
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0
        }
    },
    {
        key: 'ucraniaman', name: 'Ucrânia Man', player_body_image: 'src/assets/images/ucraniaman.png', player_legs_image: 'src/assets/images/ucraniaman_legs.png',
        speed: 300, acceleration: 2000, friction: 1500, size: 40, weapon: 'weapon_arm',
        health: 150, invulnerableTime: 500, // High HP
        bodyScale: 0.3, legsScale: 0.3, bodyOffset: -10,
        bodyWidth: 60, bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.4, originY: -0.85 },
        hand: { x: 22, y: -5 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 2, restDamping: { rotation: 0.9, position: 0.2 } },
        stats: {
            moveSpeed: 0.8, // Slow
            knockbackResistance: 1.2, // Tanky
            maxHealth: 1.0, // Base is already high (150)
            thorns: 0.1 // 10% Thorns
        }
    }
        ,
    {
        key: 'samurai', name: 'Samurai', player_body_image: 'src/assets/images/samurai.png', player_legs_image: 'src/assets/images/samurai_legs.png',
        speed: 300, acceleration: 2000, friction: 1500, size: 40, weapon: 'weapon_katana',
        health: 70, invulnerableTime: 500, // Low HP (0.7x)
        bodyScale: 0.3, legsScale: 0.3, bodyOffset: -10,
        bodyWidth: 60, bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.5, originY: -0.9 },
        hand: { x: 22, y: -5 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 2, restDamping: { rotation: 0.9, position: 0.2 } },
        stats: {
            moveSpeed: 1.3, // Fast
            attackSpeed: 1.3, // Fast attacks
            maxHealth: 1.0, // Base reduced at source
            critChance: 0.2, // 20% Crit (Archetype strength)
            criticalDamage: 2.0 // 200% Crit Dmg
        }
    },
    {
        key: 'miss', name: 'Miss Anti-Bandido', player_body_image: 'src/assets/images/miss.png', player_legs_image: 'src/assets/images/miss_legs.png',
        speed: 300, acceleration: 2000, friction: 1500, size: 40, weapon: 'weapon_rifle',
        health: 60, invulnerableTime: 500, // Very Low HP (0.6x)
        bodyScale: 0.3, legsScale: 0.3, bodyOffset: -10,
        bodyWidth: 60, bodyHeight: 130,
        legs: { x: 0, y: 16, originX: 0.4, originY: -0.6 },
        hand: { x: 25, y: -8 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 2, restDamping: { rotation: 0.9, position: 0.2 } },
        stats: {
            damage: 1.5, // High Ranged Damage
            projectileSpeed: 1.2,
            evasion: 0.1 // 10% Evasion
        }
    },
    {
        key: 'mind-changer', name: 'The Mind Changer', player_body_image: 'src/assets/images/mind_changer.png', player_legs_image: 'src/assets/images/mind_changer_legs.png',
        speed: 300, acceleration: 2000, friction: 1500, size: 40, weapon: 'weapon_magic_staff',
        health: 75, invulnerableTime: 500,
        bodyScale: 0.3, legsScale: 0.3, bodyOffset: -10,
        bodyWidth: 60, bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.2, originY: -1.3 },
        hand: { x: 22, y: -5 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 2, restDamping: { rotation: 0.9, position: 0.2 } },
        stats: {
            elementalDamage: 1.4,
            area: 1.2, // AoE size
            critChance: 0.1
        }
    }],

    // == ENEMY ==    
    enemy: [{
        key: 'enemy_basic', enemy_body_image: 'src/assets/images/enemy_basic.png', enemy_legs_image: 'src/assets/images/enemy_basic_legs.png',
        speed: 100, size: 32, damage: 10, health: 100, spawnDistance: 700, maxOnScreen: 50, xpDropChance: 0.8, canShoot: true,
        projectileSpeed: 500, shootInterval: 1000, shootRange: 350, projectileDamage: 10, xpValue: 1,
        bodyScale: 0.3, legsScale: 0.3, bodyWidth: 60, bodyHeight: 100, bossScale: 0.6,
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 1 },
        projectileColor: 0xFF0000, projectileScale: 1.0, hitSoundKey: 'hit',
        dropChance: 0.05, lootTable: 'common'
    },
    {
        key: 'enemy_fast', enemy_body_image: '', enemy_legs_image: '',
        speed: 200, size: 32, damage: 10, health: 80, spawnDistance: 700, maxOnScreen: 50, xpDropChance: 0.8, canShoot: false,
        projectileSpeed: 0, shootInterval: 0, shootRange: 0, projectileDamage: 0, xpValue: 1,
        bodyScale: 0.3, legsScale: 0.3, bodyWidth: 60, bodyHeight: 100, bossScale: 0.6,
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 1 },
        hitSoundKey: 'hit',
        dropChance: 0.08, lootTable: 'common'
    },
    // New Enemy: Zombie - Slow but tanky undead enemy
    {
        key: 'enemy_zombie', enemy_body_image: '', enemy_legs_image: '',
        speed: 80, size: 32, damage: 15, health: 150, spawnDistance: 700, maxOnScreen: 40, xpDropChance: 0.9, canShoot: false,
        projectileSpeed: 0, shootInterval: 0, shootRange: 0, projectileDamage: 0, xpValue: 2,
        bodyScale: 0.3, legsScale: 0.3, bodyWidth: 60, bodyHeight: 100, bossScale: 0.6,
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 1 },
        hitSoundKey: 'hit',
        dropChance: 0.1, lootTable: 'common'
    },
    // New Enemy: Demon - Fast and aggressive hellish creature
    {
        key: 'enemy_demon', enemy_body_image: '', enemy_legs_image: '',
        speed: 250, size: 32, damage: 20, health: 40, spawnDistance: 700, maxOnScreen: 30, xpDropChance: 0.85, canShoot: false,
        projectileSpeed: 0, shootInterval: 0, shootRange: 0, projectileDamage: 0, xpValue: 3,
        bodyScale: 0.3, legsScale: 0.3, bodyWidth: 60, bodyHeight: 100, bossScale: 0.6,
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 1 },
        hitSoundKey: 'hit',
        dropChance: 0.15, lootTable: 'ucommon'
    },
    // New Enemy: Ghost - Ranged enemy with magical projectiles
    {
        key: 'enemy_ghost', enemy_body_image: '', enemy_legs_image: '',
        speed: 120, size: 32, damage: 8, health: 25, spawnDistance: 700, maxOnScreen: 50, xpDropChance: 0.75, canShoot: true,
        projectileSpeed: 400, shootInterval: 1500, shootRange: 400, projectileDamage: 15, xpValue: 2,
        bodyScale: 0.3, legsScale: 0.3, bodyWidth: 60, bodyHeight: 100, bossScale: 0.6,
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        legOffset: { x: -6, y: 16 }, legOrigin: { x: 0.5, y: -1 },
        animation: { walkSwingSpeed: 0.015, walkSwingAmplitude: 0.15, walkBobSpeed: 0.02, walkBobAmplitude: 1 },
        projectileColor: 0x9966FF, projectileScale: 0.8, hitSoundKey: 'hit',
        dropChance: 0.1, lootTable: 'common'
    }],

    // == BOSSES ==
    bosses: [{
        key: 'boss_orc_king',
        name: 'Rei Orc',
        baseEnemy: 'enemy_basic',
        healthMultiplier: 2, // Huge health pool
        damageMultiplier: 2,
        speedMultiplier: 0.7,
        sizeMultiplier: 2.0,
        xpDropChance: 1.0,
        xpValue: 2, // Max array index of xp 
        tint: 0xFF4444, // Reddish
        enrageTint: 0xFF0000, // Deep Red
        enrageHealthThreshold: 0.5,
        enrageSpeedBonus: 0.2, // +20%
        stompInterval: 2000,
        gameplayRhythm: 0.5, // Reduce other spawns by 50%
        dropChance: 1.0, lootTable: 'boss'
    }],

    // == WEAPON ==    
    weapon: [{
        key: 'weapon_sword', name: 'Espada', image: 'src/assets/images/weapon_sword.png', damage: 25, cooldown: 800, knockback: 150, knockbackDuration: 50,
        range: 200, type: 'melee', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 500, projectileSize: 10, scale: 0.6, origin: { x: 0.3, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        meleeHitbox: { width: 200, height: 100 }, meleeAnimDuration: 250, rotationSmoothing: 0.2,
        soundKey: 'weapon_sword', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_arm', name: 'Braço', image: 'src/assets/images/weapon_arm.png', damage: 50, cooldown: 1600, knockback: 300, knockbackDuration: 50,
        range: 200, type: 'melee', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 500, projectileSize: 10, scale: 0.5, origin: { x: 0.25, y: 0.95 }, gripOrigin: { x: 0.4, y: 1.5 },
        angleOrigin: 90, angleAttack: 180,
        meleeHitbox: { width: 200, height: 100 }, meleeAnimDuration: 250, rotationSmoothing: 0.2,
        soundKey: 'weapon_hammer', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_laser_gun', name: 'Arma Laser', image: 'src/assets/images/weapon_laser_gun.png', damage: 25, cooldown: 800, knockback: 20, knockbackDuration: 50,
        range: 350, type: 'ranged', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 500, projectileSize: 10, scale: 0.6, origin: { x: 0.3, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        rotationSmoothing: 0.2,
        projectileTexture: null, projectileScale: 1.0, projectileRotation: false, projectileColor: 0x00FFFF,
        soundKey: 'weapon_laser', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_handbag', name: 'Mala de dinheiro', image: 'src/assets/images/weapon_handbag.png', damage: 25, cooldown: 800, knockback: 20, knockbackDuration: 50,
        range: 350, type: 'ranged', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 500, projectileSize: 10, scale: 0.6, origin: { x: 0.3, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        rotationSmoothing: 0.2,
        projectileTexture: null, projectileScale: 1.0, projectileRotation: true, projectileColor: 0xFFD700,
        soundKey: 'weapon_shoot', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_flame_sword', name: 'Espada de fogo', image: 'src/assets/images/weapon_flame_sword.png', damage: 25, cooldown: 800, knockback: 100, knockbackDuration: 50,
        range: 200, type: 'melee', elementalEffect: 'burn', dotDamage: 1, dotDuration: 1000,
        projectileSpeed: 500, projectileSize: 10, scale: 0.6, origin: { x: 0.3, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        meleeHitbox: { width: 200, height: 100 }, meleeAnimDuration: 250, rotationSmoothing: 0.2,
        soundKey: 'weapon_sword', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_katana', name: 'Katana', image: 'src/assets/images/weapon_katana.png', damage: 30, cooldown: 600, knockback: 120, knockbackDuration: 50,
        range: 220, type: 'melee', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 500, projectileSize: 10, scale: 0.6, origin: { x: 0.25, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        meleeHitbox: { width: 220, height: 110 }, meleeAnimDuration: 250, rotationSmoothing: 0.2,
        soundKey: 'weapon_sword', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_magic_staff', name: 'Microfone mágico', image: 'src/assets/images/weapon_magic_staff.png', damage: 20, cooldown: 1000, knockback: 30, knockbackDuration: 50,
        range: 400, type: 'ranged', elementalEffect: 'freeze', dotDamage: 2, dotDuration: 1500,
        projectileSpeed: 400, projectileSize: 12, scale: 0.6, origin: { x: 0.2, y: 0.5 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        rotationSmoothing: 0.2,
        projectileTexture: null, projectileScale: 1.2, projectileRotation: true, projectileColor: 0x9966FF,
        soundKey: 'weapon_spell', hitSoundKey: 'hit'
    },
    {
        key: 'weapon_rifle', name: 'Rifle', image: 'src/assets/images/weapon_rifle.png', damage: 40, cooldown: 1200, knockback: 200, knockbackDuration: 100,
        range: 300, type: 'ranged', elementalEffect: 'none', dotDamage: 0, dotDuration: 0,
        projectileSpeed: 600, projectileSize: 15, scale: 0.6, origin: { x: 0.2, y: 0.3 }, gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0, angleAttack: 180,
        rotationSmoothing: 0.2,
        projectileTexture: null, projectileScale: 1.0, projectileRotation: false, projectileColor: 0xFFAA00,
        soundKey: 'weapon_shoot', hitSoundKey: 'hit'
    }],

    // == XP ==
    xp: {
        baseXPToLevel: 20, xpScaling: 1.4, magnetRange: 150, magnetSpeed: 500,
        gems: [{
            key: 'xp_gem', image: 'src/assets/images/xpGem.png', gemValue: 10,
        },
        {
            key: 'xp_gem_big', image: 'src/assets/images/xpGemBig.png', gemValue: 20,
        }],
    },
    background: {
        innerMapImage: 'src/assets/images/bg_paving_stone.png',
        outsideMapImage: 'src/assets/images/bg_street.png'
    },
    audio: {
        bgm: 'src/assets/audio/bgm.mp3',
        shoot: 'src/assets/audio/weapon_hammer.flac',
        hit: 'src/assets/audio/hit.wav',
        levelup: 'src/assets/audio/levelup.wav',
        gameover: 'src/assets/audio/gameover.wav'
    },
    spawner: {
        waves: [
            { interval: 2000, enemiesPerWave: 1, enemyType: 'enemy_basic', bossPerWave: 1 },
            { interval: 1500, enemiesPerWave: 2, enemyType: 'enemy_basic', bossPerWave: 0 },
            { interval: 1000, enemiesPerWave: 3, enemyType: 'enemy_fast', bossPerWave: 0 },
            { interval: 500, enemiesPerWave: 4, enemyType: 'enemy_fast', bossPerWave: 1 },
        ],
        initialInterval: 2000,
        minInterval: 500,
        intervalDecrease: 100,
        spawnDistance: 700,
        maxOnScreen: 50,
    },

    // == STAGE CONFIG ==
    stage: {
        duration: 600, // 10 minutes in seconds
        events: [
            { time: 300, type: 'boss_spawn', key: 'boss_orc_king' }, // 5:00
            { time: 120, type: 'final_hour' } // 2:00
        ],
        suddenDeath: {
            interval: 10000, // Every 10s
            buffPercent: 0.10 // +10% stats
        }
    },

    // == VISUALS ==
    statusEffects: {
        burn: { color: 0xFF4500, name: 'BURN' },   // Orange-Red
        freeze: { color: 0x00FFFF, name: 'FREEZE' }, // Cyan
        poison: { color: 0x00FF00, name: 'POISON' }, // Green
        stun: { color: 0xFFFF00, name: 'STUN' }      // Yellow
    },
    // == PICKUPS ==
    pickups: {
        tables: {
            common: [
                { type: 'health_kit', chance: 0.8 },
                { type: 'magnet', chance: 0.15 },
                { type: 'map_bomb', chance: 0.05 }
            ],
            rare: [
                { type: 'health_kit', chance: 0.5 },
                { type: 'magnet', chance: 0.25 },
                { type: 'map_bomb', chance: 0.25 }
            ],
            boss: [
                { type: 'health_kit_big', chance: 1.0 } // Guaranteed big heal
            ]
        },
        types: {
            health_kit: {
                color: 0x00FF00, // Green
                scale: 1.0,
                icon: '➕',
                shape: 'square',
                effect: 'heal',
                value: 0.2 // 20% max HP
            },
            health_kit_big: {
                color: 0x00FF00,
                scale: 1.5,
                icon: '➕',
                shape: 'square',
                effect: 'heal',
                value: 0.5 // 50% max HP
            },
            magnet: {
                color: 0x0000FF, // Blue
                scale: 1.0,
                icon: '🧲',
                shape: 'circle',
                effect: 'magnet',
                duration: 5000 // Not used directly but good for ref
            },
            map_bomb: {
                color: 0xFF0000, // Red
                scale: 1.0,
                icon: '💣',
                shape: 'star',
                effect: 'bomb'
            },
            coin: {
                color: 0xFFD700, // Gold
                scale: 0.8,
                icon: '💰',
                shape: 'circle',
                effect: 'coin',
                value: 1 // Base value
            }
        }
    },
    // == LEGENDARY REWARDS ==
    legendary: [
        // Gadgets: Autonomous systems
        {
            id: 'orbital_blade',
            name: 'Lâmina Orbital',
            type: 'gadget',
            description: 'Uma lâmina de energia orbita você, cortando inimigos próximos.',
            icon: '🔄',
            rarity: 'legendary',
            config: {
                radius: 100,
                speed: 2, // rads per second
                damage: 50,
                scale: 1.0,
                sprite: 'weapon_katana' // Reusing asset for now
            }
        },
        {
            id: 'auto_turret',
            name: 'Torreta Automática',
            type: 'gadget',
            description: 'Um drone que atira automaticamente no inimigo mais próximo.',
            icon: '🤖',
            rarity: 'legendary',
            config: {
                fireRate: 1000,
                range: 400,
                damage: 30,
                projectileSpeed: 600,
                sprite: 'weapon_laser_gun'
            }
        },
        // Procs: Chance on Hit effects
        {
            id: 'chain_lightning',
            name: 'Cadeia de Raios',
            type: 'proc',
            description: '15% de chance de disparar um raio que salta entre inimigos.',
            icon: '⚡',
            rarity: 'legendary',
            config: {
                chance: 0.15,
                damage: 40,
                bounces: 3,
                range: 200,
                color: 0x00FFFF
            }
        },
        {
            id: 'frost_nova',
            name: 'Nova Gélida',
            type: 'proc',
            description: '10% de chance de congelar inimigos em área ao acertar.',
            icon: '❄️',
            rarity: 'legendary',
            config: {
                chance: 0.10,
                damage: 20,
                radius: 150,
                freezeDuration: 2000,
                color: 0x66AAFF
            }
        }
    ],

    // == META SHOP ==
    metaShop: [
        {
            id: 'health', name: 'Vitalidade', icon: '❤️',
            description: '+5% Max HP per rank',
            costBase: 100, costScaling: 1.5, maxRank: 10,
            stat: 'maxHealth', bonusPerRank: 0.05
        },
        {
            id: 'damage', name: 'Força Bruta', icon: '⚔️',
            description: '+5% Damage per rank',
            costBase: 150, costScaling: 1.6, maxRank: 10,
            stat: 'damage', bonusPerRank: 0.05
        },
        {
            id: 'goldGain', name: 'Ganância', icon: '💰',
            description: '+10% Gold Gain per rank',
            costBase: 200, costScaling: 1.8, maxRank: 5,
            stat: 'goldGain', bonusPerRank: 0.10
        },
        {
            id: 'moveSpeed', name: 'Agilidade', icon: '👟',
            description: '+3% Speed per rank',
            costBase: 120, costScaling: 1.5, maxRank: 5,
            stat: 'moveSpeed', bonusPerRank: 0.03
        },
        {
            id: 'revival', name: 'Segunda Chance', icon: '🕊️',
            description: '+1 Revival (Max 1)',
            costBase: 1000, costScaling: 2.0, maxRank: 1,
            stat: 'revival', bonusPerRank: 1
        }
    ],

    // == ACHIEVEMENTS ==
    achievements: [
        { id: 'unlock_ucraniaman', title: 'O Estrangeiro', desc: 'Matar 1.000 inimigos' },
        { id: 'unlock_samurai', title: 'Código de Honra', desc: 'Sobreviver 10min' },
        { id: 'unlock_miss', title: 'Fora da Lei', desc: 'Acumular 5.000 moedas' }
    ],

    world: {
        width: 1500, height: 1500, tileSize: 128
    }
};

export let CONFIG = JSON.parse(JSON.stringify(BASE_CONFIG));

export const resetConfig = () => {
    CONFIG = JSON.parse(JSON.stringify(BASE_CONFIG));
};