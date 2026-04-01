---
name: status
description: Show project progress across specs, plans, and tasks.
disable-model-invocation: true
---

Show project status:

1. List all files in `/_specs/`, `/_plans/`, `/_tasks/`.
2. For each task, check if it has a `## Status` section.
3. Show a summary:

```
## Project Status

### [Spec title]
Spec: /_specs/[file] ✅
Plan: /_plans/[file] ✅
Tasks:
  - [1.1] [title] ✅ Done
  - [1.2] [title] ⏳ Next
  - [2.1] [title] ○ Pending
```

4. Flag specs without plans, plans with unfinished tasks.
5. Show which task to work on next.
