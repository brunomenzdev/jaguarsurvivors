# 🐆 Jaguar Survivors (BETA)
**Phaser 3 • JavaScript • Bullet Heaven / Roguelite**

⏱️ *O relógio corre, a horda ruge. O quanto você consegue aguentar?*

**Jaguar Survivors** é um **RPG de ação roguelite no estilo Bullet Heaven**, inspirado em jogos como **Vampire Survivors** e **Brotato**, com forte foco em **performance**, **progressão**, **feedback visual e sonoro**, e **sátira política** como temática central.

Este repositório contém **todo o código-fonte e assets do jogo**, desenvolvido com **Phaser 3**, utilizando **canvas para gameplay** e **DOM (HTML/CSS)** para toda a interface.

---

## 🎮 O Jogo

Em Jaguar Survivors, você controla heróis únicos em partidas intensas contra centenas de inimigos simultâneos.  
Cada run é baseada em **tempo, progressão de dificuldade e decisões estratégicas**.

- Duração padrão da run: **10 minutos (configurável)**
- O tempo culmina em **batalhas épicas contra bosses**
- Após completar o mapa, o jogo entra em **Endless Mode**
- Se o tempo acabar… prepare-se para o **Sudden Death**

---

## 🧍 Personagens

- **5 personagens jogáveis**
- Cada personagem possui:
  - Stats iniciais distintos
  - Tendência de playstyle diferente
- Seleção de personagem ocorre antes do início da run

---

## 🗺️ Mapas & Temática

O jogo possui mapas com **temática de sátira política**, cada um com identidade própria:

1. **Favela** – Luta contra o crime organizado  
2. **Congresso Nacional** – Luta contra o centrão político  
3. **Manifestações** – Luta contra alienação em massa  
4. **Faculdade Pública** – Luta contra doutrinação ideológica  

Cada mapa contém:
- Enemies exclusivos
- Elites
- Bosses
- Progressão dinâmica de waves
- Endless Mode após a conclusão

---

## 👾 Inimigos & IA

- Sistema de IA **data-driven**
- Behaviors configuráveis e combináveis:
  - Chase
  - Zig-Zag
  - Charge
  - Orbit
  - Flee
- Dificuldade escala progressivamente:
  - Vida
  - Velocidade
  - Dano
  - Densidade de spawn

---

## ⚔️ Sistema de Armas

### Tipos de Armas
- **Melee**
  - Swing
  - Thrust
  - Área / Wave
- **Ranged**
  - Projéteis com aparência própria
  - Sistema de recarga e fire rate
- **Trail**
  - Rastros de dano
  - Minas e armadilhas persistentes

### Slots
- O player pode equipar:
  - **1 arma primária**
  - **1 arma secundária**
- Armas evoluem por **nível**, não por empilhamento infinito

---

## ⭐ Legendary Rewards

Recompensas especiais obtidas principalmente ao derrotar bosses.

Tipos:
- **Companions** (seguem o player)
- **Gadgets** (torres, totens, armadilhas)
- **Procs** (efeitos ao atacar)
- **Áreas** (campos, explosões, novas)

Funcionalidades:
- Tela dedicada de seleção de lendários
- Forte uso de VFX e áudio
- Exibição no Loadout UI

---

## 🎒 Itens & Progressão

- Itens substituem antigos passive/synergy upgrades
- Cada item possui upgrades únicos
- Slots de itens são limitados
- Builds são criadas através de decisões estratégicas

---

## 💎 Pickups

Drops de inimigos e estruturas:

- XP Gems – progressão de nível
- Coin – moeda persistente entre runs
- Health Kit – cura
- Magnet – atrai XP
- Bomb – limpa o mapa
- Boots – aumenta velocidade
- Shield Core – escudo temporário
- Rage Orb – bônus de dano
- Time Freeze – congela inimigos

Pickups ativos possuem **feedback visual e sonoro claro**.

---

## 🏃 Sistema de Dash

- Dash ativado por **duplo toque direcional**
- Player fica **invulnerável durante o dash**
- Cooldown visível na HUD
- Movimento fluido (não trava direção)
- Forte uso de VFX para sensação de impacto

---

## ♾️ Endless Mode

- Ativado após derrotar o último boss
- Não espera waves terminarem:
  - Enemies spawnam continuamente
- Dificuldade escala infinitamente
- Objetivo: sobreviver o máximo possível
- Game Over exibe:
  - Inimigos mortos
  - Tempo sobrevivido

---

## 🧱 Estruturas

- Estruturas sólidas e destrutíveis
- Bloqueiam movimentação
- Atacadas automaticamente
- Dropam XP ou pickups
- Sons e efeitos diferentes de inimigos

---

## 🖥️ HUD & UI

- UI construída **100% em DOM**
- Estilo moderno, impactante e responsivo
- Inclui:
  - Barra de vida
  - Barra de XP
  - Wave atual
  - Timer
  - Inimigos ativos e mortos
  - Loadout (armas, itens, lendários)
- UI reage visualmente a buffs, shields, freezes e efeitos

---

## 🔊 Sistema de Áudio

- BGM contínua desde o menu até o gameplay
- Volume balanceado entre música e efeitos
- Sons distintos para:
  - Hit vs miss
  - Crítico
  - Estruturas vs inimigos
  - Pickups
  - UI
  - Dash
  - Boss events
- Foco em **clareza, impacto e satisfação**

---

## 🚀 Diferenciais Técnicos

Este projeto também é um **estudo de performance** em Phaser 3:

### 🏗️ Arquitetura
- **Object Pooling System**
  - Reciclagem de inimigos e projéteis
  - Evita Garbage Collection pesado
- **Data-Driven Design**
  - Armas, inimigos e waves controlados via configs
- **Event-Driven UI**
  - UI desacoplada da lógica do jogo

### ⏱️ Sistema de Fases
- Cronômetro regressivo
- Eventos baseados em tempo
- Bosses e mudanças de ambiente disparadas por timers
