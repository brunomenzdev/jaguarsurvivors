# Agent and Contributor Roles

All roles follow [`PROJECT-CONSTITUTION.md`](PROJECT-CONSTITUTION.md), [`PRODUCT-DECISIONS.md`](PRODUCT-DECISIONS.md), and the task-specific authorization. A role describes responsibility, not permission to exceed task scope.

## Permission model

| Role | May inspect | May propose | May modify | May approve |
|---|---|---|---|---|
| Product Owner (human) | Any project area | Any product, creative, technical, or commercial decision | Explicitly authorizes work; may approve documentation or implementation scope | Final authority over all product decisions and scope |
| Product Lead / Game Design | Product docs and gameplay evidence | Product framing, design, content priorities, validation | Only deliverables explicitly authorized by the task | No fundamental product decisions |
| Codex Lead Engineer / Orchestrator | Repository and approved project context | Technical plans and alternatives | Only within explicit task authorization and workspace permissions | No product premise or scope changes |
| Software Architect | Technical code/docs within task | Incremental architecture changes and ADRs | Only if implementation is separately authorized | No product or architecture direction changes requiring owner approval |
| Gameplay Analyst / Designer | Gameplay code/config and test evidence | Mechanics, progression, tuning framework | Only authorized design artifacts or implementation scope | No core gameplay decision without owner approval |
| Narrative Designer | Narrative/content materials and constraints | Character interpretation, satire, events, dialogue | Only authorized narrative deliverables | No tone, roster, or identity changes |
| Art Director | Assets, references, and approved identity | Visual direction and representation proposals | Only authorized art/document work; asset generation requires explicit scope | No identity/roster direction changes; flag representation risk |
| QA Engineer | Code, controls, persistence, and runtime evidence | Test strategy, defects, acceptance criteria | Tests or QA artifacts only when authorized | Cannot approve product direction or release alone |
| Technical Auditor | Read-only repository and technical evidence | Risks and recommendations | Read-only unless explicitly assigned a separate authorized change | No implementation or product decisions |
| Subagent / specialist contributor | Assigned bounded scope | Findings and options to Lead | Only if task explicitly authorizes its change and it is coordinated | Cannot approve scope; its report never authorizes implementation |

## Operating rules

- Every contributor distinguishes confirmed evidence, inference, recommendation, and TBD.
- The Lead coordinates work, reconciles contradictions, and validates important findings; delegation does not transfer final accountability.
- Product proposals may not independently soften the acidic tone, change the real-figure roster direction, reintroduce Partido Missão content into the commercial product, or change platform/engine scope.
- Real-person representation risks must be flagged. No role grants legal clearance.
- When necessary product input is missing or documents conflict, identify the dependency and ask the Product Owner before dependent work.
- Parallel contributors must not edit the same shared file without explicit coordination.
