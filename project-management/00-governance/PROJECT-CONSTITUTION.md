# Jaguar Survivors — Project Constitution

**Authority:** Product Owner (human)  
**Status:** Approved governance baseline  
**Established:** 2026-11-08  
**Amended:** 2026-11-09 (TASK-006 / TASK-006.1; playable-roster direction)  
**Applies to:** Product, design, narrative, art, engineering, QA, and publishing work

## 1. Project identity

Jaguar Survivors is an independent, commercially oriented game built around global political satire. It is not a party campaign, political communication tool, or promotional product for a political organization. The game should be entertaining without requiring political knowledge; satire should enrich gameplay rather than replace it.

The approved satirical tone is **acidic, provocative, irreverent, and deliberately sharp**. It may ridicule public figures, institutions, political movements, ideologies, public contradictions, hypocrisy, and political behavior across the spectrum. Keep a coherent satirical point of view; do not soften the tone without Product Owner approval, and do not turn provocation into random offensiveness.

The playable roster consists of **ordinary citizens represented through professions and social archetypes**. Real-world political public figures are used predominantly as satirical bosses and antagonists, alongside fictional entities and characters representing institutional problems. Professions may recur across regional campaigns with visual and narrative variation while retaining their mechanical identity. Specific representations remain subject to editorial and legal review. Public visibility is not legal clearance. This amendment was authorized by the Product Owner through TASK-006 and consolidated in TASK-006.1; it supersedes the earlier playable-roster direction while preserving its history in the Product Decision Register.

Partido Missão content is excluded from the future commercial product: no party branding, campaign messaging, party-specific characters, promotional content, narrative, or mission. This decision does not authorize deletion of historical repository material, assets, commits, or documentation. Technical or generic gameplay reuse must be reviewed and is not automatically approved.

## 2. Fundamental principles

1. Maintain an independent commercial identity.
2. Build globally expandable political satire.
3. Make the game enjoyable without political expertise.
4. Preserve the approved acidic creative identity; do not independently sanitize it.
5. Make ordinary citizens represented by professions and social archetypes playable; use real public figures predominantly as satirical bosses and antagonists, with each specific representation reviewed individually.
6. Make content expandable without redesigning core gameplay for each addition.
7. Preserve the existing project and evolve it incrementally; do not rewrite for convenience.
8. Consider commercial viability without treating unvalidated assumptions as facts.
9. Keep new content coherent with this Constitution.
10. Keep decisions explicit: proposals, assumptions, and technical recommendations are not approvals.

## 3. Approved technical and platform baseline

- Engine: Phaser 3; preserve the current Phaser 3.70.0 baseline.
- Language: JavaScript ES Modules.
- Build tool: Vite; preserve the current Vite 5.4.21 baseline.
- Initial platform: desktop browser.
- Input: keyboard, mouse, and controller/gamepad. Gamepad is an initial requirement.
- Progression: mixed, configurable by stage.
- Maps: recover and expand existing maps subject to content review.
- Architecture: retain and evolve existing architecture incrementally.
- Content: prefer data-driven content, stable identifiers, and registered behaviors.
- Persistence: local persistence initially; cloud saves are not approved for initial implementation.
- Testing: establish testing and validation practices before significant refactoring.

These decisions do not authorize dependency changes, engine migration, feature implementation, or a rewrite.

### Explicit technical constraints

- Do not migrate to Unity or Godot, or migrate to Phaser 4 as a convenience initiative.
- Do not introduce ECS, Redux, dependency injection containers, or comparable complexity without demonstrated need and approval.
- Do not remove existing gameplay systems or replace working components without explicit authorization.
- Justify technical changes incrementally with evidence and measurable benefit.
- Design controller input with keyboard parity, menu navigation, gameplay actions, connection/disconnection handling, and remapping where appropriate. Specific controller models and certification remain TBD.
- Local persistence design must consider versioned schemas, safe loading/saving, corrupt or unavailable storage, compatibility, and possible export/import. Cloud persistence remains unapproved until separately decided.

## 4. Authority and document hierarchy

1. **Product Owner:** final authority over product identity, scope, priorities, creative direction, features, and commercial decisions. Only the Product Owner can approve changes to fundamental premises.
2. **Project Constitution:** source of truth for fundamental principles, approved decisions, constraints, and governance.
3. **Product Decision Register:** authoritative status and traceability for approved, proposed, experimental, rejected, and TBD decisions.
4. **GDDs and ADRs:** detailed specifications; they must conform to the Constitution and approved decisions.
5. **Codex Lead Engineer / Orchestrator:** coordinates work within the authorized task scope; may recommend but cannot change product direction.
6. **Subagents and contributors:** perform bounded work under lead coordination; reports do not authorize implementation.

When instructions conflict, identify the conflict and its implications and request Product Owner clarification. Do not silently choose an interpretation. Explicit Product Owner decisions override lower-level documents; related documents must then be reconciled through change control.

## 5. Change and authorization rules

No fundamental decision, product premise, or task scope changes without explicit Product Owner approval. A proposed change must state its reason, alternatives, impact, affected decisions/documents, risks, and validation plan. Once approved, record it in `PRODUCT-DECISIONS.md` and update affected materials consistently while preserving history.

The following always require explicit approval: identity, tone, roster direction, Partido Missão exclusion, platform scope, core gameplay direction, monetization, commercial scope, and major architecture changes. An audit, plan, test result, or agent recommendation is not permission to implement.

## 6. Supporting governance documents

- [`PRODUCT-DECISIONS.md`](PRODUCT-DECISIONS.md): approved decisions and unresolved questions.
- [`WORKFLOW.md`](WORKFLOW.md): task lifecycle and approval gates.
- [`AGENT-ROLES.md`](AGENT-ROLES.md): contributor responsibilities and permissions.
- [`CHANGE-CONTROL.md`](CHANGE-CONTROL.md): decision changes, conflicts, and traceability.
- Repository [`AGENTS.md`](../../AGENTS.md): concise operational instructions for agents.

Detailed gameplay, product, legal, and publishing specifications remain future deliverables and may not supersede this Constitution without approved change control.
