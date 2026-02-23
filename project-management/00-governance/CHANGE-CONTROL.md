# Change Control and Decision Traceability

Fundamental project decisions may change only with explicit Product Owner approval. This process prevents recommendations, assumptions, and technical convenience from silently becoming requirements.

## Approval-gated decisions

Explicit approval is always required to change:

- Product identity or global political satire premise.
- Approved acidic, provocative tone.
- Predominantly real-public-figure roster direction.
- Partido Missão exclusion from the commercial product.
- Platform/input scope, core gameplay direction, monetization, or commercial scope.
- Phaser baseline, incremental/no-rewrite architecture direction, or other major technical architecture.

Approval of a creative direction does not clear legal use of an individual person, mark, voice, image, or other material. Those require separate review.

## Change proposal format

Before making a gated change, present:

1. Decision ID(s) affected and current status.
2. Reason for change and evidence.
3. Alternatives considered, including retaining the current decision.
4. Product, gameplay, technical, legal, commercial, schedule, and documentation impacts as applicable.
5. Risks and validation plan.
6. Exact files or decisions to be updated.
7. A clear approval request.

Do not perform dependent implementation while approval is pending. Independent read-only work may continue.

## Recording an approved change

After explicit approval:

1. Update the affected decision in `PRODUCT-DECISIONS.md` with new status/date and rationale.
2. Preserve the prior decision and trace its supersession; do not erase history.
3. Update the Constitution only if a fundamental principle or approved baseline changed.
4. Update affected GDDs, ADRs, roadmap items, and operational instructions consistently, within authorized scope.
5. Report files changed and identify any related document still needing owner approval.

Use statuses consistently: **APPROVED**, **PROPOSED**, **EXPERIMENTAL**, **REJECTED**, **TBD**. Do not assign approval dates unless known. Experiments are limited, explicitly authorized tests and do not permanently change the product direction.

## Conflict resolution

Follow the hierarchy in the Constitution. If two approved records appear inconsistent, stop dependent work, state both records and their implications, and request Product Owner clarification. Do not silently prefer the latest, easiest, or technically convenient interpretation. Once clarified, record the resolution and reconcile related documents.

## Scope and repository safety

- Authorization is task-specific. Approval of a proposal or document does not imply code, asset, dependency, release, or commercial-use authorization.
- Do not delete historical source or assets as a consequence of excluding content from the commercial product.
- Do not overwrite an existing governance or design document without first identifying the conflict and obtaining approval for the update plan.
- Keep repository changes reviewable and traceable through Git; commit/push only when explicitly authorized.
