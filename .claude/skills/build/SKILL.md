---
name: build
description: Implement a feature from a plan. Reads the plan and builds it step by step.
argument-hint: "[plan filename or 'latest']"
disable-model-invocation: true
---

Implement the plan specified in $ARGUMENTS (a plan filename in /_plans/, or "latest" for the most recent).

1. Read `CLAUDE.md` and the plan file.
2. Read any existing files that will be modified — do not overwrite blindly.
3. Implement each phase in order. Follow the steps exactly.
4. Rules:
   - Use CSS variables from global.css — never hardcode colors or fonts
   - Use Astro components (.astro files)
   - Write semantic HTML
   - If something is unclear or conflicts with existing code, ASK before proceeding
5. After implementing, update the plan's `## Status:` to `Implemented`.
6. Update the spec's `## Status:` to `Implemented`.

STOP after implementing. Do NOT move to the next plan automatically.
