---
name: plan
description: Create an implementation plan from a spec. Breaks a spec into phased steps with dependencies and file paths.
disable-model-invocation: true
---

Create a plan from $ARGUMENTS (a spec filename, or "latest" for the most recent file in /_specs/).

1. Read `CLAUDE.md` and the spec file.
2. Break the spec into ordered steps grouped by phase.
3. Create a new file in `/_plans/` with matching filename.
4. Use this template:

```
# Plan: [Title]
Spec: /_specs/[filename]
## Overview
## Phases
### Phase 1: [Name]
#### Step 1.1: [Action]
- What:
- Files:
- Satisfies:
- Depends on:
## Risks
## Done criteria
```

5. Each step should be small enough for one focused session.
6. Include file paths and dependencies between steps.

STOP after the plan is written. Do NOT create tasks or start implementing.
