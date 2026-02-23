# Product Decision Register

**Authority:** Product Owner  
**Status vocabulary:** APPROVED, PROPOSED, EXPERIMENTAL, REJECTED, TBD

Decision dates are recorded only where known. PD-001–PD-004 are explicitly approved by TASK-004, received 2026-11-08. PD-005–PD-011 consolidate directions approved in earlier tasks; their original decision dates are not recorded here.

## Approved decisions

### PD-001 — Independent Global Political Satire Product
- **Status:** APPROVED
- **Decision date:** 2026-11-08 (TASK-004)
- **Context:** Move beyond the original Brazilian party association.
- **Decision:** Jaguar Survivors is an independent commercial game about global political satire, not party campaigning or promotion. It should entertain players without political expertise; satire enriches gameplay.
- **Rationale:** Establishes an independent, expandable identity.
- **Consequences:** Product, content, marketing, and UX must support global comprehension and independent identity.
- **Related:** TASK-003, TASK-004; Constitution.

### PD-002 — Acidic and Provocative Satirical Tone
- **Status:** APPROVED
- **Decision date:** 2026-11-08 (TASK-004)
- **Decision:** Tone is acidic, provocative, irreverent, exaggerated, and deliberately sharp. It may criticize figures and institutions across the political spectrum. The coherent target is political power, behavior, hypocrisy, institutional dysfunction, public contradictions, and political absurdity. Agents must not independently soften it.
- **Rationale:** Preserve a distinctive creative identity while keeping the satire purposeful.
- **Consequences:** A material tone change requires approval; each content item should make its satirical target legible.
- **Related:** Constitution; TASK-004.

### PD-003 — Ordinary Citizens as Playable Characters; Public Figures as Antagonists
- **Status:** APPROVED
- **Decision date:** Original approval date for the current direction not recorded; approved in TASK-006 and consolidated by TASK-006.1.
- **Decision:** Jaguar Survivors will have ordinary citizens represented by professions and social archetypes as playable characters. Real-world political public figures will be used predominantly as satirical bosses and antagonists. Professions may recur across regional campaigns with visual and narrative variations while preserving mechanical identity. The product retains an independent identity, and specific representations remain subject to appropriate editorial and legal review.
- **Rationale:** Centers play on citizens confronting political systems and supports reusable profession archetypes across independent regional campaigns.
- **Consequences:** No specific person, likeness, voice, mark, image, or other recognizable material is cleared for commercial use by this decision. Public visibility is not legal clearance. The prior playable-public-figure direction is preserved below as superseded history.
- **Related:** TASK-003, TASK-004, TASK-006, TASK-006.1; Constitution; D-006-08, D-006-28, D-006-32.

#### PD-003 historical record — SUPERSEDED
- **Former decision date:** 2026-11-08 (TASK-004).
- **Former decision:** The playable roster would be predominantly recognizable real-world political public figures across countries, environments, ideologies, and periods; examples were not an approved roster.
- **Superseded by:** The current PD-003 direction, approved in TASK-006. The original decision is retained here for traceability and is no longer current product direction.

### PD-004 — Exclude Partido Missão Content from the Commercial Product
- **Status:** APPROVED
- **Decision date:** 2026-11-08 (TASK-004)
- **Decision:** Commercial product identity and playable content must not include Partido Missão branding, campaign messaging, party-specific characters/promotions, party-specific narrative, missions, or party affiliation.
- **Rationale:** Establishes the independent global identity.
- **Consequences:** Do not automatically delete historical source, assets, commits, or documentation. Generic technical reuse must be independently reviewed and is not automatically approved.
- **Related:** Constitution; legacy-content review.

### PD-005 — Preserve Phaser 3 Baseline
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Preserve Phaser 3.70.0; Phaser 4 migration is deferred. Do not migrate to Unity or Godot.
- **Rationale:** Retain the current project foundation and avoid unnecessary migration.
- **Consequences:** Maintain the current Phaser 3 architecture unless an approved evidence-based decision changes it.
- **Related:** TASK-002, TASK-004.

### PD-006 — Desktop Browser as Initial Platform
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Initial target is desktop browser. Mobile and console are not initial scope.
- **Rationale:** Focus initial product validation.
- **Consequences:** Exact browser matrix and viewport support remain TBD.
- **Related:** TASK-003, TASK-004.

### PD-007 — Keyboard, Mouse, and Gamepad Support
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Keyboard, mouse, and gamepad are initial input requirements. Gamepad is not optional future scope.
- **Rationale:** Meet approved desktop player-control expectations.
- **Consequences:** Design for keyboard/controller parity, menu navigation, gameplay controls, connection loss, and remapping where appropriate. Specific models remain TBD.
- **Related:** TASK-003, TASK-004.

### PD-008 — Stage-Specific Mixed Progression
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Progression may combine survival time, spawn quota, defeat quota, boss encounters, and objectives, with rules configurable by stage/map.
- **Rationale:** Different stages may need different pacing and goals.
- **Consequences:** Exact condition combinations and completion rules remain TBD; do not hardcode one universal rule by assumption.
- **Related:** TASK-002, TASK-003, TASK-004.

### PD-009 — Recover and Expand Existing Maps Subject to Review
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Existing disabled maps are recovery candidates; review their relevance and adapt or retire content as appropriate. No map is required to remain unchanged.
- **Rationale:** Preserve useful work while aligning content to the new identity.
- **Consequences:** Map selection and content changes require design review; no source deletion is implied.
- **Related:** TASK-003, TASK-004.

### PD-010 — Local Persistence Initially
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Begin with local persistence. Cloud saves are not approved for initial implementation.
- **Rationale:** Avoid unnecessary backend and operational cost before a demonstrated need.
- **Consequences:** Versioned schemas, safe load/save, corrupt/unavailable storage handling, and compatibility need design consideration. Cloud value is a later decision.
- **Related:** TASK-002, TASK-003, TASK-004.

### PD-011 — Incremental Technical Evolution, No Rewrite
- **Status:** APPROVED
- **Decision date:** Original date not recorded; consolidated by TASK-004.
- **Decision:** Preserve and evolve existing useful modules incrementally. Keep `GameScene` as lifecycle coordinator and `SceneBootstrap` as composition root. Establish testing before significant lifecycle refactoring.
- **Rationale:** Reduce recovery risk and retain useful project investment.
- **Consequences:** No rewrite, unnecessary architecture framework, dependency upgrade, or major migration without separate approval.
- **Related:** TASK-001, TASK-002, TASK-004.

## Pending product decisions — unresolved or partially resolved

Every item below records why it matters, dependencies, timing, and whether it blocks the Vertical Slice. No recommendation is an approval.

| ID | Decision | Why it matters / dependencies | Decide when | Slice blocker? |
|---|---|---|---|---|
| TBD-P01 | Commercial roster quantity and expansion | Slice archetype is office worker (D-006-09); commercial roster breadth remains TBD. | Before roster expansion. | No for VS-001; yes for production plan. |
| TBD-P02 | Countries and environments after the United States campaign | The first region is approved as the United States (D-006-30). Later order remains open. | Before later regional production. | No for VS-001. |
| TBD-P03 | Share of internationally recognizable cast | Affects audience comprehension and content strategy. | Before roster expansion. | No for one slice, yes for production plan. |
| TBD-P04 | Role of fictional supporting characters | Partially resolved: professions/citizens are playable; real figures predominantly antagonists (PD-003); exact fictional supporting roles remain open. | Before detailed content lock. | No for VS-001. |
| TBD-P05 | Final visual identity | Affects art, UI, store materials, and character depiction. | Before final slice art. | Graybox prototype can proceed; final art cannot. |
| TBD-P06 | Languages beyond VS-001 | English and Brazilian Portuguese are approved for VS-001 (D-006-33); future language scope remains open. | Before later localization scope. | No for VS-001. |
| TBD-P07 | Narrative structure and campaign format | Regional campaigns and the global arc are approved (D-006-27/-29/-34); detailed execution remains open. | Before production beyond slice. | No |
| TBD-P08 | Boundaries for political humor and sensitive subject matter | For VS-001, satire targets political power, behavior, and institutional dysfunction; factual claims need editorial review. Detailed content still needs review. | Before final slice content approval. | No for graybox systems; yes for final identifiable content. |
| TBD-L01 | Commercial legal feasibility for specific real figures | Impacts roster, art, voice, marketing, and distribution. | Before using a specific figure commercially. | Blocks that representation, not systems prototype. |
| TBD-L02 | Use of names, likenesses, voices, marks, and recognizable elements | Requires rights and jurisdiction analysis. | Before content approval/release. | Specific-content blocker. |
| TBD-L03 | Legal review strategy and publishing jurisdictions | Determines counsel scope, disclosure, and risk checks. | Before commercial release planning. | No for graybox; yes for release. |
| TBD-C01 | Monetization model | Changes product scope, UX, economy, and support needs. | After initial product validation. | No |
| TBD-C02 | Premium versus free-to-play | Determines production, acquisition, and operational requirements. | Before commercial production. | No |
| TBD-C03 | Demo and early-access strategy | Shapes validation and release plan. | Before public testing. | No |
| TBD-C04 | Distribution platforms and publishing strategy | Affects build, policy, store, and QA requirements. | Before release planning. | No |
| TBD-G01 | Characters beyond VS-001 | VS-001 office worker and Donald Trump boss approved; other campaign roster remains open. | Before other campaign content lock. | No for VS-001. |
| TBD-G02 | Maps beyond the VS-001 American Capitol-inspired environment | VS-001 graybox may use the existing 1500 × 1500 world dimensions; hazards, structures, and later maps remain open. | Before detailed map/content lock. | No for graybox; yes for detailed final layout. |
| TBD-G05 | Enemy and boss roster beyond VS-001 | Three common archetypes and Donald Trump for VS-001 approved; other bosses/encounters remain open. | Before other encounters. | No for VS-001 baseline. |
| TBD-G06 | Meta-progression | Affects save schema and replay loop. | Before persistent progression is built. | No |
| TBD-G07 | Combat tuning values | D-007-06 sets deterministic escalation and a 50-enemy cap; damage, HP, cooldowns, and spawn tuning remain open for playtest. | Before balance sign-off. | No for implementation; yes for balance sign-off. |
| TBD-G08 | Long-term replayability/progression | Determines production breadth beyond slice. | After slice evidence. | No |
| TBD-T01 | Exact local save implementation | Affects data schema and resilience. | Before save implementation. | No unless slice requires saves. |
| TBD-T02 | Cloud save requirements | Depends on accounts, cross-device, rankings, multiplayer, or business need. | Revisit only when a product requirement supports it. | No; cloud not approved initially. |
| TBD-T03 | Browser compatibility beyond VS-001 | Windows Chrome and Edge are approved reference targets for VS-001; broader matrix remains TBD. | Before broader release claims. | No for VS-001 baseline. |
| TBD-T04 | Performance targets beyond the VS-001 baseline | D-007-07 sets a 50-enemy cap, 60 FPS average target, and P95 frame-time below 33.3 ms on documented test hardware; broader hardware guarantees remain open. | Before performance sign-off. | No for implementation; yes for performance sign-off. |
| TBD-T05 | Controller models beyond XInput reference | XInput remains the VS-001 reference; other device models remain TBD. | Before broader controller claims. | No for VS-001 reference acceptance. |
| TBD-T06 | Test framework and coverage targets | D-007-08 defines validation scope; framework, dependency choice, and percentage coverage remain TBD. Do not perform significant lifecycle refactoring before the test approach is established. | Before significant lifecycle refactoring. | Yes for significant lifecycle refactoring. |

## TASK-006 decision record

**Authority:** Product Owner, TASK-006; consolidated by TASK-006.1. **Approval date:** not separately recorded. These product decisions are approved. Approval of a design or representation does not itself authorize code, asset production, publication, or commercial use of a real person's identity.

| ID | Decision | Status / traceability |
|---|---|---|
| D-006-01 | Political satire is integrated into gameplay and affects mechanics, objectives, enemies, rules, or player decisions. | APPROVED |
| D-006-02 | First Vertical Slice target duration is 15–20 minutes. | APPROVED; no automatic timeout defeat. |
| D-006-03 | Keep the first slice deliberately focused. | APPROVED; detailed boundaries in VS-001/GDD. |
| D-006-04 | Real politician as playable protagonist. | SUPERSEDED by D-006-08; retained as history. |
| D-006-05 | Brazil as first region. | SUPERSEDED by D-006-30; retained as history. |
| D-006-06 | Brazilian Congress as first map. | SUPERSEDED by D-006-30 and D-006-31 in the American slice context; retained as history. |
| D-006-07 | Fictional character as first boss. | SUPERSEDED by D-006-08 and D-006-32; retained as history. |
| D-006-08 | Ordinary citizens are playable; real political figures are predominantly bosses and antagonists. | APPROVED; reflected in PD-003. |
| D-006-09 | Office worker is the profession/archetype for the American slice protagonist. | APPROVED. |
| D-006-10 | Lula as first boss. | SUPERSEDED by D-006-32; retained as history. |
| D-006-11 | Executive Briefcase (Maleta Executiva) is the slice's starting weapon. | APPROVED. |
| D-006-12 | Three weapons are available in the slice. | APPROVED; their full identities remain partly TBD. |
| D-006-13 | Three common enemy archetypes: swarm, fast, and heavy. | APPROVED. |
| D-006-14 | Cabinet Crisis (Crise de Gabinete) is the slice's political event with a mechanical consequence. | APPROVED; detailed rules TBD. |
| D-006-15 | Slice boss has two phases and two basic attacks. | APPROVED; attack identities TBD. |
| D-006-16 | Timed progression drives escalation and boss entry; defeating the boss wins the slice. | APPROVED. |
| D-006-17 | Equip at most two weapons simultaneously in the slice. | APPROVED. |
| D-006-18 | On level-up, choose one upgrade from three options. | APPROVED. |
| D-006-19 | Win by defeating the boss; lose at zero player HP; no automatic timeout defeat. | APPROVED. |
| D-006-20 | Basic attacks are automatic; player controls movement and manual dash; no mandatory manual aiming. | APPROVED. |
| D-006-21 | Initial qualitative playtest uses five target players. | APPROVED; exploratory, not commercial validation. |
| D-006-22 | Brazilian Portuguese as the only initial language. | SUPERSEDED by D-006-33; retained as history. |
| D-006-23 | Minimum slice compatibility target: Windows, Chrome, Edge, and XInput controller reference. | APPROVED. |
| D-006-24 | Slice persistence is limited to local settings and local run results; no mandatory power meta-progression or cloud save. | APPROVED. |
| D-006-25 | Use coherent, legible provisional art; review the boss's representation before commercial use. | APPROVED; not asset or likeness clearance. |
| D-006-26 | Adopt the four-group slice acceptance criteria and exploratory 4-of-5 comprehension target. | APPROVED; sample does not establish market demand. |
| D-006-27 | Independent regional campaigns integrate into a previously defined global narrative. | APPROVED. |
| D-006-28 | Universal professions can recur regionally with visual/narrative variation while preserving gameplay and attributes. | APPROVED. |
| D-006-29 | Global arc “O Sistema Nunca Morre”: confront a fictional machine of power and choose to accept or reject command. | APPROVED; narrative choice does not define a government simulation. |
| D-006-30 | First commercial version centers on a complete American campaign with its own ending and global hook; other countries are later evolution. | APPROVED; not market validation. |
| D-006-31 | First slice uses Act II, “The Political Machine.” | APPROVED. |
| D-006-32 | Donald Trump is the boss of the first slice. | APPROVED as creative direction; representation and assets require separate editorial/legal review. |
| D-006-33 | English and Brazilian Portuguese are supported from the first slice. | APPROVED. |
| D-006-34 | American campaign has three principal stages: daily life, political spectacle, and administrative machine. | APPROVED as structure; illustrative details and boss concepts are not thereby approved. |
| D-006-35 | The citizen's complaint connects the American campaign and recurs as a narrative motif in the global universe. | APPROVED. |

### Supersession and decision dependencies

- D-006-04 → D-006-08.
- D-006-05 → D-006-30.
- D-006-06 → D-006-30 / D-006-31 for the American slice context.
- D-006-07 → D-006-08 / D-006-32.
- D-006-10 → D-006-32.
- D-006-22 → D-006-33.
- D-006-27 through D-006-35 expand and refine product direction; they do not supersede unrelated decisions.

### Pending decision register reconciliation

The TASK-006 reconciliation above records the initial scope approvals. TASK-007 now sets the VS-001 timing and narrows the graybox map, difficulty, performance, editorial, and validation decisions as recorded below. Later campaign content, combat balance, detailed hazards, test tooling, and legal clearance remain open.

## TASK-007 decision record

**Authority:** Product Owner, TASK-007. **Approval date:** 2026-11-09. These decisions close selected VS-001 design and acceptance TBDs. They do not authorize implementation, asset creation, dependency changes, publication, or commercial use of a real person's identity.

| ID | Decision | Status / traceability |
|---|---|---|
| D-007-01 | VS-001 uses four three-minute escalation blocks; Cabinet Crisis begins at 8:00 and lasts 60 seconds; the boss enters at 12:00. The run targets 15–20 minutes, with no timeout defeat. | APPROVED by Product Owner; timing can be tuned during validation without changing the approved outcome rules. |
| D-007-02 | Cabinet Crisis increases enemy spawn frequency by 25% for 60 seconds, with clear start/end visual and textual feedback. | APPROVED by Product Owner. |
| D-007-03 | The boss uses two attacks: a telegraphed straight-line charge and delayed marked ground impacts. Below 50% HP, the second phase combines these attacks in faster sequences while retaining readable telegraphs. | APPROVED as mechanics. Prototype presentation must use non-identifiable placeholder visuals/text until separate editorial/legal review; no likeness, voice, marks, or real-person assets are cleared. |
| D-007-04 | The VS-001 weapon pool is Executive Briefcase (returning projectile), Approval Stamp (automatic area impact), and Paperwork (automatic projectile spread); at most two are equipped. | APPROVED as weapon identities/functions. Damage, cooldown, and tuning remain open. |
| D-007-05 | The VS-001 graybox may use the existing 1500 × 1500 world dimensions; this does not authorize reuse of legacy assets. | APPROVED. Hazard/structure placement and final map layout remain TBD. |
| D-007-06 | Difficulty escalation is deterministic in the four time blocks, without adaptive scaling; the prototype caps active enemies at 50. | APPROVED as initial model. Enemy HP, damage, cooldown, spawn mix/rates, and balance remain subject to playtest tuning. |
| D-007-07 | Performance acceptance targets a 60 FPS average and P95 frame-time below 33.3 ms during gameplay, with test hardware documented; the 50-enemy cap is the initial concurrent-enemy target. | APPROVED as a measurable slice target, not a guarantee across all hardware. |
| D-007-08 | Validation covers isolated system checks where practical, a full run, keyboard/mouse/XInput controls, scene restart/cleanup, browser compatibility, and performance recording. | APPROVED as test scope. Test framework, dependency choice, and percentage coverage remain TBD; no dependency change is authorized. |
| D-007-09 | Slice satire targets political power, behavior, and institutional dysfunction. Factual claims require editorial review; identifiable real-person content remains subject to separate editorial/legal review. | APPROVED as slice editorial guidance; it does not soften the approved tone or grant legal clearance. |

TASK-007 resolves TBD-G03 and TBD-G04 and narrows TBD-P08, TBD-G02, TBD-G07, and TBD-T04 through TBD-T06 as described in the pending-decision table. It does not resolve numerical combat balance, detailed hazards/structures, test tooling, or legal clearance.
