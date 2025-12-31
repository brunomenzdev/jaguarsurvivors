/**
 * AI System - Main Export
 * 
 * Provides the complete AI system for enemies and bosses.
 */
// Core classes
export { BaseBehavior } from './baseBehavior.js';
export { BehaviorFactory } from './behaviorFactory.js';
export { DifficultyManager } from './difficultyManager.js';
export { BossAIManager } from './bossAIManager.js';
// Behaviors
export { ChaseBehavior } from './behaviors/chaseBehavior.js';
export { ChargeBehavior } from './behaviors/chargeBehavior.js';
export { ZigZagBehavior } from './behaviors/zigzagBehavior.js';
export { BurstPursuitBehavior } from './behaviors/burstPursuitBehavior.js';
export { OrbitBehavior } from './behaviors/orbitBehavior.js';
export { FleeBehavior } from './behaviors/fleeBehavior.js';
