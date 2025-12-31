# Advanced Enemy & Boss AI System Architecture

## Executive Summary

This document defines the technical architecture for a behavior-based enemy AI system designed to support multiple movement and decision patterns, boss orchestration, and progressive difficulty scaling.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI SYSTEM ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ │
│  │  Enemy Config   │───▶│ BehaviorFactory │───▶│  Behavior Instance      │ │
│  │  (Data Layer)   │    │ (Creation)      │    │  (Runtime Execution)    │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ │
│          │                                               │                  │
│          │                                               ▼                  │
│          │                                      ┌─────────────────┐        │
│          │                                      │ MovementExecutor │        │
│          │                                      │ (Velocity/Physics)│        │
│          │                                      └─────────────────┘        │
│          │                                                                  │
│          ▼                                                                  │
│  ┌─────────────────────┐                                                   │
│  │ DifficultyManager   │                                                   │
│  │ (Scaling Modifiers) │──────────────────────────────────────────────────▶│
│  └─────────────────────┘                                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       BOSS ORCHESTRATION                            │   │
│  │  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │   │
│  │  │ BossAIManager │───▶│ PhaseController│───▶│ BehaviorQueue │       │   │
│  │  └───────────────┘    └───────────────┘    └───────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Principles

### 2.1 Separation of Concerns
- **Behavior Module**: Defines WHAT an enemy does (decision logic)
- **Movement Executor**: Executes HOW the enemy moves (physics/velocity)
- **Difficulty Scaler**: Modifies stats INDEPENDENTLY of behavior
- **Configuration Layer**: Defines parameters WITHOUT code changes

### 2.2 Design Patterns Applied
- **Strategy Pattern**: Swappable behavior modules
- **Composite Pattern**: Boss behavior sequencing
- **Factory Pattern**: Behavior instantiation
- **Observer Pattern**: Phase transitions via events

---

## 3. Behavior Module System

### 3.1 Base Behavior Interface

```javascript
/**
 * Abstract base class for all behavior modules.
 * All behaviors MUST implement this interface.
 */
class BaseBehavior {
    constructor(enemy, params) {
        this.enemy = enemy;
        this.params = params;
        this.timers = {};
        this.state = 'idle';
    }
    
    // Core lifecycle
    enter() {}           // Called when behavior activates
    update(delta) {}     // Called every frame
    exit() {}            // Called when behavior deactivates
    
    // State queries
    isComplete() { return false; }
    canInterrupt() { return true; }
    
    // Movement output (decoupled from physics)
    getMovementVector() { return { x: 0, y: 0, speed: 0 }; }
}
```

### 3.2 Required Behavior Implementations

#### A) Chase Behavior (Default)
```javascript
ChaseParams = {
    speed: number,              // Movement speed multiplier
    trackingSpeed: number,      // How fast to update target direction (1 = instant)
    minDistance: number         // Stop when within this distance
}
```

#### B) Charge Behavior
```javascript
ChargeParams = {
    chargeUpTime: number,       // Duration of wind-up phase (ms)
    chargeSpeed: number,        // Speed multiplier during charge
    chargeDuration: number,     // How long the charge lasts (ms)
    cooldownTime: number,       // Time before next charge (ms)
    lockDirection: boolean      // If true, direction locked at charge start
}

States: IDLE → CHARGING_UP → CHARGING → COOLDOWN → IDLE
```

#### C) ZigZag Behavior
```javascript
ZigZagParams = {
    baseSpeed: number,          // Forward movement speed
    amplitude: number,          // Lateral oscillation distance
    frequency: number,          // Oscillation speed (rad/s)
    phase: number              // Starting phase offset (0-2π)
}

// Movement calculation:
lateralOffset = sin(time * frequency + phase) * amplitude
```

#### D) Burst Pursuit Behavior
```javascript
BurstPursuitParams = {
    pursuitSpeed: number,       // Speed during pursuit phase
    pursuitDuration: number,    // Duration of pursuit (ms)
    pauseDuration: number,      // Duration of pause (ms)
    pauseSpeed: number          // Speed during pause (0 = stationary)
}

States: PURSUING → PAUSING → PURSUING
```

#### E) Orbit Behavior (Ranged enemies)
```javascript
OrbitParams = {
    preferredDistance: number,  // Ideal distance from player
    orbitSpeed: number,         // Movement speed while orbiting
    approachSpeed: number,      // Speed when getting to orbit distance
    orbitDirection: number      // 1 = clockwise, -1 = counter-clockwise
}
```

#### F) Flee Behavior
```javascript
FleeParams = {
    fleeSpeed: number,          // Speed when fleeing
    fleeDistance: number,       // How far to flee before stopping
    triggerDistance: number     // Distance at which to start fleeing
}
```

---

## 4. Behavior Factory

```javascript
/**
 * Creates behavior instances from configuration.
 * Allows easy extension without modifying existing code.
 */
class BehaviorFactory {
    static behaviors = new Map();
    
    static register(key, BehaviorClass) {
        this.behaviors.set(key, BehaviorClass);
    }
    
    static create(key, enemy, params) {
        const BehaviorClass = this.behaviors.get(key);
        if (!BehaviorClass) {
            console.warn(`Unknown behavior: ${key}, defaulting to chase`);
            return new ChaseBehavior(enemy, params);
        }
        return new BehaviorClass(enemy, params);
    }
}

// Registration (done once at startup):
BehaviorFactory.register('chase', ChaseBehavior);
BehaviorFactory.register('charge', ChargeBehavior);
BehaviorFactory.register('zigzag', ZigZagBehavior);
BehaviorFactory.register('burst_pursuit', BurstPursuitBehavior);
BehaviorFactory.register('orbit', OrbitBehavior);
BehaviorFactory.register('flee', FleeBehavior);
```

---

## 5. Enemy Configuration Schema

### 5.1 Enemy Type Definition

```javascript
{
    key: 'enemy_charger',
    // ... existing visual/stats properties ...
    
    // NEW: AI Configuration
    ai: {
        behaviorKey: 'charge',           // Which behavior module to use
        behaviorParams: {                 // Parameters for that behavior
            chargeUpTime: 800,
            chargeSpeed: 3.0,
            chargeDuration: 500,
            cooldownTime: 1500,
            lockDirection: true
        }
    },
    
    // NEW: Difficulty scaling profile
    scalingProfile: 'aggressive'         // References scaling config
}
```

### 5.2 Backward Compatibility

Enemies WITHOUT an `ai` block default to:
```javascript
ai: {
    behaviorKey: 'chase',
    behaviorParams: { speed: 1.0, trackingSpeed: 1.0, minDistance: 0 }
}
```

---

## 6. Boss AI Orchestration

### 6.1 Boss Phase System

```javascript
BossPhaseConfig = {
    phases: [
        {
            id: 'phase1',
            name: 'Aggressive',
            trigger: { type: 'health', value: 1.0 },  // 100% HP
            behaviors: [
                { key: 'charge', duration: 3000, params: {...} },
                { key: 'chase', duration: 2000, params: {...} }
            ],
            loop: true    // Repeat this behavior sequence
        },
        {
            id: 'phase2',
            name: 'Enraged',
            trigger: { type: 'health', value: 0.5 },  // 50% HP
            behaviors: [
                { key: 'burst_pursuit', duration: 5000, params: {...} }
            ],
            onEnter: 'enrage',  // Event to emit
            loop: true
        }
    ]
}
```

### 6.2 Boss AI Manager

```javascript
class BossAIManager {
    constructor(boss, phaseConfig) {
        this.boss = boss;
        this.phases = phaseConfig.phases;
        this.currentPhaseIndex = 0;
        this.currentBehaviorIndex = 0;
        this.behaviorTimer = 0;
        this.currentBehavior = null;
    }
    
    update(delta) {
        this.checkPhaseTransition();
        this.updateBehavior(delta);
    }
    
    checkPhaseTransition() {
        const healthPercent = this.boss.health / this.boss.maxHealth;
        
        for (let i = this.phases.length - 1; i >= 0; i--) {
            const phase = this.phases[i];
            if (phase.trigger.type === 'health' && 
                healthPercent <= phase.trigger.value &&
                i > this.currentPhaseIndex) {
                this.transitionToPhase(i);
                break;
            }
        }
    }
    
    transitionToPhase(index) {
        const oldPhase = this.phases[this.currentPhaseIndex];
        const newPhase = this.phases[index];
        
        if (oldPhase.onExit) this.boss.scene.events.emit(oldPhase.onExit);
        
        this.currentPhaseIndex = index;
        this.currentBehaviorIndex = 0;
        this.behaviorTimer = 0;
        this.loadBehavior();
        
        if (newPhase.onEnter) this.boss.scene.events.emit(newPhase.onEnter);
    }
    
    loadBehavior() {
        const phase = this.phases[this.currentPhaseIndex];
        const behaviorConfig = phase.behaviors[this.currentBehaviorIndex];
        
        if (this.currentBehavior) this.currentBehavior.exit();
        
        this.currentBehavior = BehaviorFactory.create(
            behaviorConfig.key,
            this.boss,
            behaviorConfig.params
        );
        this.currentBehavior.enter();
        this.behaviorTimer = 0;
    }
    
    updateBehavior(delta) {
        if (!this.currentBehavior) return;
        
        this.behaviorTimer += delta;
        this.currentBehavior.update(delta);
        
        const phase = this.phases[this.currentPhaseIndex];
        const behaviorConfig = phase.behaviors[this.currentBehaviorIndex];
        
        // Check for behavior transition
        if (this.behaviorTimer >= behaviorConfig.duration || 
            this.currentBehavior.isComplete()) {
            this.nextBehavior();
        }
    }
    
    nextBehavior() {
        const phase = this.phases[this.currentPhaseIndex];
        this.currentBehaviorIndex++;
        
        if (this.currentBehaviorIndex >= phase.behaviors.length) {
            if (phase.loop) {
                this.currentBehaviorIndex = 0;
            } else {
                return; // Stay on last behavior
            }
        }
        
        this.loadBehavior();
    }
    
    getMovementVector() {
        return this.currentBehavior?.getMovementVector() || { x: 0, y: 0, speed: 0 };
    }
}
```

---

## 7. Difficulty Progression System

### 7.1 Core Structure

```javascript
/**
 * DifficultyManager
 * 
 * Centralized system for progressive difficulty scaling.
 * INDEPENDENT from behavior logic.
 */
class DifficultyManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.runStartTime = 0;
        this.currentLevel = 0;
    }
    
    /**
     * Get a multiplier for a given stat at the current difficulty level.
     */
    getMultiplier(statKey) {
        const elapsed = this.getElapsedTime();
        const scaling = this.config.scaling[statKey];
        
        if (!scaling) return 1.0;
        
        return this.calculateMultiplier(elapsed, scaling);
    }
    
    calculateMultiplier(elapsed, scaling) {
        const { curve, min, max, rampUpTime } = scaling;
        
        const progress = Math.min(elapsed / rampUpTime, 1.0);
        
        switch (curve) {
            case 'linear':
                return min + (max - min) * progress;
            case 'exponential':
                return min * Math.pow(max / min, progress);
            case 'logarithmic':
                return min + (max - min) * Math.log(1 + progress * (Math.E - 1));
            case 'step':
                return this.getStepValue(elapsed, scaling.steps);
            default:
                return 1.0;
        }
    }
    
    getStepValue(elapsed, steps) {
        for (let i = steps.length - 1; i >= 0; i--) {
            if (elapsed >= steps[i].time) {
                return steps[i].value;
            }
        }
        return 1.0;
    }
    
    getElapsedTime() {
        return this.scene.time.now - this.runStartTime;
    }
    
    reset() {
        this.runStartTime = this.scene.time.now;
        this.currentLevel = 0;
    }
}
```

### 7.2 Difficulty Configuration Schema

```javascript
export const difficultyConfig = {
    // Default scaling applied to all enemies
    global: {
        health: {
            curve: 'linear',
            min: 1.0,
            max: 3.0,
            rampUpTime: 600000  // 10 minutes
        },
        speed: {
            curve: 'logarithmic',
            min: 1.0,
            max: 1.5,
            rampUpTime: 600000
        },
        damage: {
            curve: 'linear',
            min: 1.0,
            max: 2.5,
            rampUpTime: 600000
        },
        knockbackResistance: {
            curve: 'linear',
            min: 0.0,
            max: 0.8,      // 80% knockback reduction at max
            rampUpTime: 600000
        }
    },
    
    // Named profiles for different enemy archetypes
    profiles: {
        aggressive: {
            speed: { curve: 'exponential', min: 1.0, max: 2.0, rampUpTime: 300000 },
            damage: { curve: 'linear', min: 1.2, max: 3.0, rampUpTime: 600000 }
        },
        tanky: {
            health: { curve: 'linear', min: 1.5, max: 5.0, rampUpTime: 600000 },
            knockbackResistance: { curve: 'linear', min: 0.3, max: 0.95, rampUpTime: 400000 }
        },
        elite: {
            health: { curve: 'linear', min: 2.0, max: 4.0, rampUpTime: 600000 },
            damage: { curve: 'linear', min: 1.5, max: 2.5, rampUpTime: 600000 },
            speed: { curve: 'linear', min: 1.1, max: 1.3, rampUpTime: 600000 }
        }
    }
};
```

### 7.3 Stat Resolution

```javascript
/**
 * Resolves the final stat value for an enemy.
 * Called when spawning or when stats need recalculation.
 */
function resolveEnemyStats(baseConfig, difficultyManager) {
    const profile = baseConfig.scalingProfile || 'default';
    
    return {
        health: baseConfig.health * difficultyManager.getMultiplier('health', profile),
        damage: baseConfig.damage * difficultyManager.getMultiplier('damage', profile),
        speed: baseConfig.speed * difficultyManager.getMultiplier('speed', profile),
        knockbackResistance: difficultyManager.getMultiplier('knockbackResistance', profile)
    };
}
```

---

## 8. Integration Layer

### 8.1 Updated Enemy Entity

```javascript
class Enemy {
    constructor(scene) {
        this.scene = scene;
        // ... existing properties ...
        
        // NEW: AI references
        this.behavior = null;
        this.scaledStats = {};
    }
    
    spawn(config) {
        // ... existing spawn logic ...
        
        // Initialize AI behavior
        const aiConfig = config.enemyConfig.ai || {
            behaviorKey: 'chase',
            behaviorParams: { speed: 1.0 }
        };
        
        this.behavior = BehaviorFactory.create(
            aiConfig.behaviorKey,
            this,
            aiConfig.behaviorParams
        );
        this.behavior.enter();
        
        // Apply difficulty scaling
        this.scaledStats = this.scene.difficultyManager.resolveStats(config.enemyConfig);
    }
    
    update(player, delta) {
        if (!this.isActive) return;
        
        // Update behavior
        this.behavior.update(delta);
        
        // Get movement from behavior
        const movement = this.behavior.getMovementVector();
        this.applyMovement(movement);
        
        // ... rest of update logic ...
    }
    
    applyMovement(movement) {
        if (this.isStunned || this.knockbackDuration > 0) return;
        
        const speed = movement.speed * this.scaledStats.speed;
        this.container.body.setVelocity(
            movement.x * speed,
            movement.y * speed
        );
        
        this.updateFacing(movement.x);
    }
    
    getKnockbackResistance() {
        return this.scaledStats.knockbackResistance || 0;
    }
    
    destroy() {
        if (this.behavior) {
            this.behavior.exit();
            this.behavior = null;
        }
        // ... existing destroy logic ...
    }
}
```

### 8.2 Updated Knockback Logic

```javascript
applyKnockback(force, duration) {
    const resistance = this.getKnockbackResistance();
    const effectiveForce = force * (1 - resistance);
    
    if (effectiveForce <= 0) return; // Immune to knockback
    
    const angle = Phaser.Math.Angle.Between(
        this.container.x, this.container.y,
        this.scene.player.x, this.scene.player.y
    ) + Math.PI;
    
    this.container.body.setVelocity(
        Math.cos(angle) * effectiveForce,
        Math.sin(angle) * effectiveForce
    );
    this.knockbackDuration = duration;
}
```

---

## 9. File Structure

```
src/
├── systems/
│   └── ai/
│       ├── index.js                    # Exports all AI modules
│       ├── behaviorFactory.js          # Behavior creation factory
│       ├── difficultyManager.js        # Difficulty scaling system
│       ├── bossAIManager.js            # Boss phase orchestration
│       └── behaviors/
│           ├── baseBehavior.js         # Abstract base class
│           ├── chaseBehavior.js        # Default chase
│           ├── chargeBehavior.js       # Charge attack
│           ├── zigzagBehavior.js       # Zig-zag movement
│           ├── burstPursuitBehavior.js # Burst pursuit
│           ├── orbitBehavior.js        # Orbital movement
│           └── fleeBehavior.js         # Flee behavior
├── config/
│   ├── enemies.config.js               # Updated with AI configs
│   ├── difficulty.config.js            # NEW: Difficulty scaling
│   └── bossPhases.config.js            # NEW: Boss phase definitions
```

---

## 10. Migration Strategy

### Phase 1: Foundation (Non-Breaking)
1. Create new AI system files
2. Add `BehaviorFactory` with `ChaseBehavior` as default
3. Add `DifficultyManager` with passive scaling
4. All existing enemies continue working unchanged

### Phase 2: Integration
1. Update `Enemy.js` to use new behavior system
2. Add fallback for enemies without `ai` config
3. Integrate `DifficultyManager` into spawner

### Phase 3: Configuration
1. Add `ai` blocks to enemy configs as needed
2. Define boss phase configurations
3. Implement additional behaviors incrementally

---

## 11. Debug & Testing Support

### 11.1 Debug Visualization

```javascript
class AIDebugOverlay {
    static draw(enemy, graphics) {
        if (!enemy.behavior) return;
        
        // Draw behavior state
        graphics.fillStyle(0xFFFFFF, 0.8);
        graphics.fillText(
            `${enemy.behavior.constructor.name}: ${enemy.behavior.state}`,
            enemy.x, enemy.y - 50
        );
        
        // Draw movement vector
        const movement = enemy.behavior.getMovementVector();
        graphics.lineStyle(2, 0x00FF00, 0.5);
        graphics.lineBetween(
            enemy.x, enemy.y,
            enemy.x + movement.x * 50,
            enemy.y + movement.y * 50
        );
    }
}
```

### 11.2 Console Commands

```javascript
// Debug commands for testing
window.aiDebug = {
    setBehavior: (enemyIndex, behaviorKey, params) => {
        const enemy = scene.enemySpawner.enemies[enemyIndex];
        enemy.behavior.exit();
        enemy.behavior = BehaviorFactory.create(behaviorKey, enemy, params);
        enemy.behavior.enter();
    },
    
    setDifficulty: (level) => {
        scene.difficultyManager.currentLevel = level;
    },
    
    logBehaviors: () => {
        scene.enemySpawner.enemies.forEach((e, i) => {
            console.log(`[${i}] ${e.enemy.key}: ${e.behavior?.constructor.name} (${e.behavior?.state})`);
        });
    }
};
```

---

## 12. Summary

This architecture provides:

| Requirement | Solution |
|-------------|----------|
| Multiple behavior patterns | Strategy Pattern with swappable behaviors |
| Per-enemy type configuration | `ai` block in enemy config |
| Boss behavior composition | `BossAIManager` with phase system |
| Progressive difficulty | `DifficultyManager` with curves |
| Knockback resistance | Scaling modifier in difficulty |
| Extensibility | Factory Pattern + registration |
| Debuggability | State queries + debug overlay |
| Backward compatibility | Default chase behavior fallback |
