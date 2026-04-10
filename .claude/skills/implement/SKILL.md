---
name: implement
description: Implement a single task. Reads a task file from /_tasks/ and writes the code.
argument-hint: "[task filename, 'latest', or 'next']"
disable-model-invocation: true
---

Implement the task specified in $ARGUMENTS (a task filename in /_tasks/, "latest" for the most recent, or "next" for the first task without a ## Status section).

1. Read `CLAUDE.md` and the task file.
2. Read any existing files that the task says to modify — do not overwrite blindly.
3. Implement exactly what the task describes — no more, no less.
4. Rules:
   - Use CSS variables from global.css — never hardcode colors or fonts
   - Use Astro components (.astro files)
   - Write semantic HTML
   - If something is unclear or conflicts with existing code, ASK before proceeding
5. Verify the acceptance criteria listed in the task.
6. Add `## Status: Done` at the bottom of the task file with a brief note.

STOP after implementing this one task. Do NOT move to the next task automatically.
