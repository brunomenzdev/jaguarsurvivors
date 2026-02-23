/**
 * Player Configuration
 * 
 * Contains all playable character definitions including stats,
 * visual properties, and animations.
 */

export const playersConfig = [
    {
        key: 'presida',
        name: 'O Presida',
        description: 'Líder equilibrado com habilidades versáteis',
        player_body_image: 'assets/images/presida.png',
        player_legs_image: 'assets/images/presida_legs.png',
        speed: 320,
        acceleration: 2500,
        friction: 1500,
        size: 40,
        health: 120,
        invulnerableTime: 500,
        bodyScale: 0.3,
        legsScale: 0.3,
        bodyOffset: -10,
        bodyWidth: 60,
        bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.3, originY: -1.5 },
        hand: { x: 22, y: -5 },
        animation: {
            walkSwingSpeed: 0.015,
            walkSwingAmplitude: 0.15,
            walkBobSpeed: 0.02,
            walkBobAmplitude: 2,
            restDamping: { rotation: 0.9, position: 0.2 }
        },
        dash: {
            duration: 150,
            cooldown: 1000
        },

        stats: {
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05,
            criticalDamage: 1.5,
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0,
            dashSpeed: 1.2
        },
        traits: [
            { text: 'VERSÁTIL', good: true },
            { text: 'LÍDER', good: true }
        ]
    },
    {
        key: 'ucraniaman',
        name: 'O Ucrânia Man',
        description: 'Tanque resistente com alto poder defensivo',
        player_body_image: 'assets/images/ucraniaman.png',
        player_legs_image: 'assets/images/ucraniaman_legs.png',
        speed: 300,
        acceleration: 2000,
        friction: 1500,
        size: 40,
        health: 150,
        invulnerableTime: 500,
        bodyScale: 0.3,
        legsScale: 0.3,
        bodyOffset: -10,
        bodyWidth: 60,
        bodyHeight: 130,
        legs: { x: -6, y: 6, originX: 0.4, originY: -0.85 },
        hand: { x: 22, y: -5 },
        animation: {
            walkSwingSpeed: 0.015,
            walkSwingAmplitude: 0.15,
            walkBobSpeed: 0.02,
            walkBobAmplitude: 2,
            restDamping: { rotation: 0.9, position: 0.2 }
        },
        dash: {
            duration: 200,
            cooldown: 1000
        },

        stats: {
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05,
            criticalDamage: 1.5,
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0,
            dashSpeed: 1.2
        },
        traits: [
            { text: 'TANQUE', good: true },
            { text: 'LENTO', good: false },
            { text: 'ESPINHOS', good: true }
        ]
    },
    {
        key: 'samurai',
        name: 'O Samurai',
        description: 'Guerreiro ágil com alta chance de crítico',
        player_body_image: 'assets/images/samurai.png',
        player_legs_image: 'assets/images/samurai_legs.png',
        speed: 300,
        acceleration: 2000,
        friction: 1500,
        size: 40,
        health: 70,
        invulnerableTime: 500,
        bodyScale: 0.3,
        legsScale: 0.3,
        bodyOffset: -10,
        bodyWidth: 60,
        bodyHeight: 130,
        legs: { x: -6, y: 6, originX: 0.5, originY: -0.9 },
        hand: { x: 22, y: -5 },
        animation: {
            walkSwingSpeed: 0.015,
            walkSwingAmplitude: 0.15,
            walkBobSpeed: 0.02,
            walkBobAmplitude: 2,
            restDamping: { rotation: 0.9, position: 0.2 }
        },
        dash: {
            duration: 200,
            cooldown: 1000
        },

        stats: {
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05,
            criticalDamage: 1.5,
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0,
            dashSpeed: 1.2
        },
        traits: [
            { text: 'VELOZ', good: true },
            { text: 'CRÍTICO', good: true },
            { text: 'FRÁGIL', good: false }
        ]
    },
    {
        key: 'miss',
        name: 'A Anti-Bandido',
        description: 'Lutadora evasiva com alto dano explosivo',
        player_body_image: 'assets/images/miss.png',
        player_legs_image: 'assets/images/miss_legs.png',
        speed: 300,
        acceleration: 2000,
        friction: 1500,
        size: 40,
        health: 60,
        invulnerableTime: 500,
        bodyScale: 0.2,
        legsScale: 0.4,
        bodyOffset: -10,
        bodyWidth: 60,
        bodyHeight: 130,
        legs: { x: -2, y: 16, originX: 0.5, originY: -1.3 },
        hand: { x: 25, y: -8 },
        animation: {
            walkSwingSpeed: 0.015,
            walkSwingAmplitude: 0.15,
            walkBobSpeed: 0.02,
            walkBobAmplitude: 2,
            restDamping: { rotation: 0.9, position: 0.2 }
        },
        dash: {
            duration: 250,
            cooldown: 1000
        },

        stats: {
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05,
            criticalDamage: 1.5,
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0,
            dashSpeed: 1.2
        },
        traits: [
            { text: 'DANO ALTO', good: true },
            { text: 'ESQUIVA', good: true },
            { text: 'LETAL', good: true }
        ]
    },
    {
        key: 'mind-changer',
        name: 'O Mind Changer',
        description: 'Mago elemental com área de efeito ampliada',
        player_body_image: 'assets/images/mind_changer.png',
        player_legs_image: 'assets/images/mind_changer_legs.png',
        speed: 300,
        acceleration: 2000,
        friction: 1500,
        size: 40,
        health: 75,
        invulnerableTime: 500,
        bodyScale: 0.4,
        legsScale: 0.4,
        bodyOffset: -10,
        bodyWidth: 60,
        bodyHeight: 130,
        legs: { x: -6, y: 16, originX: 0.2, originY: -1.1 },
        hand: { x: 22, y: -5 },
        animation: {
            walkSwingSpeed: 0.015,
            walkSwingAmplitude: 0.15,
            walkBobSpeed: 0.02,
            walkBobAmplitude: 2,
            restDamping: { rotation: 0.9, position: 0.2 }
        },
        dash: {
            duration: 250,
            cooldown: 1000
        },

        stats: {
            moveSpeed: 1.0,
            maxHealth: 1.0,
            damage: 1.0,
            attackSpeed: 1.0,
            area: 1.0,
            knockbackResistance: 1.0,
            elementalDamage: 1.0,
            critChance: 0.05,
            criticalDamage: 1.5,
            evasion: 0.0,
            thorns: 0.0,
            knockback: 1.0,
            hpRegen: 0.0,
            lifeSteal: 0.0,
            dashSpeed: 1.2
        },
        traits: [
            { text: 'ELEMENTAL', good: true },
            { text: 'MÍSTICO', good: true }
        ]
    }
];
