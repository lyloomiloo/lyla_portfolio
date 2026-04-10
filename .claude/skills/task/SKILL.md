---
name: task
description: Generate implementation tasks from a plan. Creates self-contained task files in /_tasks/.
argument-hint: "[plan filename or 'latest']"
disable-model-invocation: true
---

Generate tasks from $ARGUMENTS (a plan filename, or "latest" for the most recent in /_plans/).

1. Read `CLAUDE.md`, the plan file, and its parent spec.
2. For EVERY step in the plan, create a task file in `/_tasks/`.
3. Filename format: `[plan-number]-[step]-[short-slug].md`
4. Pull exact design tokens from `CLAUDE.md` into each task.
5. Each task must be self-contained — implementable by reading only that file and `CLAUDE.md`.
6. Template:

```
# Task: [Action from plan step]
Plan: /_plans/[file] → Step [X.X]
Spec: /_specs/[file]

## Context
[Why this task exists]

## What to build
[Clear deliverable]

## Technical details
[Component structure, props, behavior, CSS]

## Design tokens
[Relevant values from CLAUDE.md]

## Files to create/modify
- [path] — [what to do]

## Acceptance criteria
- [from spec, filtered to this task]
```

7. Output a summary checklist when done.

STOP after creating all tasks. Do NOT start implementing.
