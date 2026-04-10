---
name: spec
description: Create a feature spec from a short idea. Writes a structured spec to /_specs/.
argument-hint: "[feature idea]"
disable-model-invocation: true
---

Create a spec from $ARGUMENTS.

1. Read `CLAUDE.md` for project context.
2. Create a file in `/_specs/` named with a short slug (e.g. `07-feature-name.md`).
3. Template:

```
# Spec: [Title]

## Summary
[What and why]

## Components
[UI elements, interactions, data flow]

## Behavior
[User actions → system responses]

## Files
[Which files to create or modify]

## Status: Pending
```

4. Focus on what and why, not implementation details.
5. If anything is unclear, ask ONE question at a time.

STOP after the spec is complete. Do NOT create a plan or start implementing.
