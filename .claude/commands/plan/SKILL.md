---
name: plan
description: Create an implementation plan from a spec. Breaks a spec into phased steps with file paths.
disable-model-invocation: true
---

Create a plan from $ARGUMENTS (a spec filename, or "latest" for the most recent in /_specs/).

1. Read `CLAUDE.md` and the spec file.
2. Break the spec into ordered steps grouped by phase.
3. Create a new file in `/_plans/` with matching filename.
4. Use this template:

```
# Plan: [Title]
Spec: /_specs/[filename]

## Overview
[One paragraph summary]

## Phases

### Phase 1: [Name]
1. [Step — specific action with file path]
2. [Step]

### Phase 2: [Name]
3. [Step]
...

## Status: Pending
```

5. Each step should be small enough for one focused session.
6. Include file paths for every step.

STOP after the plan is written. Do NOT start implementing.
