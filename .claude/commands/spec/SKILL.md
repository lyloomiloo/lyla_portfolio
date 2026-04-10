---
name: spec
description: Create a feature spec from a short idea. Writes a structured spec to /_specs/.
disable-model-invocation: true
---

Create a spec file from $ARGUMENTS.

1. Read `CLAUDE.md` for project context.
2. Create a new file in `/_specs/` named with a short slug (e.g. `07-feature-name.md`).
3. Use this template:

```
# Spec: [Title]

## Summary
[What this feature is and why it exists]

## Components
[UI elements, interactions, data flow]

## Behavior
[How it works — user actions and system responses]

## Files
[Which files to create or modify]

## Status: Pending
```

4. Write in simple language. Focus on what and why, not implementation.
5. If anything is unclear, ask ONE question at a time. Wait for the answer before asking the next.

STOP after the spec is complete. Do NOT create a plan or start implementing.
