---
name: task
description: Generate all implementation tasks from a plan. Creates a checklist of tasks in /_tasks/ with design tokens and file paths for each step.
disable-model-invocation: true
---

Generate ALL tasks from a plan. $ARGUMENTS is a plan filename (or "latest" for the most recent in /_plans/).

1. Read `CLAUDE.md` and the plan file in `/_plans/`.
2. Read the parent spec referenced in the plan.
3. For EVERY step in the plan, create a separate task file in `/_tasks/`.
4. Filename format: `[plan-number]-[step]-[short-slug].md` (e.g. `01-1.1-init-project.md`, `01-1.2-global-css.md`)
5. Pull exact design tokens (colors, fonts, spacing values) from `CLAUDE.md` into each task.
6. Each task must be self-contained — implementable by reading only that task file and `CLAUDE.md`.

Use this template for each task file:

```
# Task: [Action from plan step]
Plan: /_plans/[file] → Step [X.X]
Spec: /_specs/[file]

## Context
[Why this task exists and what it's part of]

## What to build
[Clear description of deliverable]

## Technical details
[Component structure, props, behavior, CSS patterns]

## Design tokens
[Relevant values from CLAUDE.md]

## Files to create/modify
- [path] — [what to do]

## Acceptance criteria
- [from spec, filtered to this task]

## Notes
- [edge cases, gotchas]
```

7. After creating all task files, output a summary checklist:

```
## Tasks created from [plan name]

- [ ] 1.1 — [title] → /_tasks/[filename]
- [ ] 1.2 — [title] → /_tasks/[filename]
- [ ] 2.1 — [title] → /_tasks/[filename]
...
```

STOP after creating all tasks and showing the checklist. Do NOT start implementing.
