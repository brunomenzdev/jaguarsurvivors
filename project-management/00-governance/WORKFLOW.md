# Project Workflow

This workflow governs discovery through release. It does not grant implementation permission by itself. Read [`PROJECT-CONSTITUTION.md`](PROJECT-CONSTITUTION.md) and relevant approved entries in [`PRODUCT-DECISIONS.md`](PRODUCT-DECISIONS.md) before starting work.

## Required stages

1. **Product Owner defines the objective** and the task’s boundaries, deliverable, and allowed actions.
2. **Product Lead clarifies product requirements and scope.** Identify approved decisions, TBDs, assumptions, and conflicts.
3. **Lead Engineer evaluates technical implications** against the current architecture and approved constraints.
4. **Subagents perform bounded analysis when useful.** They may inspect and recommend within the task, but their conclusions do not approve scope or implementation.
5. **Lead Engineer produces an execution plan** with dependencies, acceptance criteria, risks, and affected documents/files.
6. **Product Owner approves the plan** when it changes product decisions, scope, creative direction, commercial commitments, or other approval-gated matters. Wait for explicit approval where required.
7. **Implementation proceeds only when authorized**, and only within the approved task scope and filesystem permissions.
8. **QA validates** against acceptance criteria. Do not claim tests or runtime behavior that were not actually checked.
9. **Documentation is updated** only where authorized; retain decision history and keep related records consistent.
10. **Product Owner reviews and approves completion** when requested by the task’s governance.
11. **Git changes follow the project’s workflow.** Do not commit or push unless explicitly authorized.

## Work states

Keep these stages distinct:

- **Discovery:** inspect existing code, assets, docs, or product evidence.
- **Analysis:** explain verified findings and uncertainty.
- **Proposal:** recommend an option; it is not approved by default.
- **Planning:** order authorized work and define checks; planning does not authorize implementation.
- **Approval:** explicit Product Owner acceptance of the relevant decision or scope.
- **Implementation:** make authorized changes only.
- **Validation:** run authorized tests/checks and report actual outcomes.
- **Documentation:** record approved decisions and implementation facts without rewriting unrelated docs.
- **Release:** publish or distribute only under explicit release authorization.

An audit, design proposal, agent report, test result, or roadmap does not authorize implementation. Missing or conflicting product decisions must be surfaced before dependent work proceeds. Continue independent, non-dependent inspection where useful.

## Change and collaboration hygiene

- Check the working tree and relevant instructions before editing.
- Avoid overlapping edits to shared files; coordinate ownership when contributors work in parallel.
- Do not install/upgrade dependencies, change scope, delete content, or alter behavior unless the task explicitly authorizes it.
- Report files changed, tests run, limitations, and any unresolved approval gate.
