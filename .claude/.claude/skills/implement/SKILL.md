---
name: implement
description: Implement a task. Reads a task file from /_tasks/ and writes the actual code following its instructions exactly.
disable-model-invocation: true
---

Implement the task specified in $ARGUMENTS (a task filename in /_tasks/, or "latest" for the most recent, or "next" for the first task without a ## Status section).

1. Read `CLAUDE.md` and the task file in `/_tasks/`.
2. Read any existing files that the task says to modify — do not overwrite blindly.
3. Implement exactly what the task describes — no more, no less.
4. Follow the design tokens and technical details specified in the task.
5. Rules:
   - Use CSS variables from global.css — never hardcode colors or fonts
   - Use Astro components (.astro files)
   - Only use `client:load` or `client:visible` for components that genuinely need JS
   - Write semantic HTML with proper heading hierarchy
   - Include alt text for images
6. If something in the task is unclear or conflicts with existing code, ASK before proceeding.
7. After implementing, verify the acceptance criteria listed in the task.
8. Add `## Status: Done` at the bottom of the task file with a brief note of what was built.

STOP after implementing this one task. Do NOT move to the next task automatically.
