---
name: status
description: Show project progress across specs, plans, and tasks.
disable-model-invocation: true
---

Show project status:

1. List all files in `/_specs/`, `/_plans/`, and `/_tasks/`.
2. For each spec, check if a matching plan exists and read its `## Status:` line.
3. Summary table:

```
## Project Status

| # | Feature | Spec | Plan | Status |
|---|---------|------|------|--------|
| 1 | Feature | 01-feature.md | 01-feature.md | Implemented |
| 2 | Feature | 02-feature.md | — | Pending |
```

4. Flag specs without plans, and plans still marked Pending.
5. Show recent git log (last 5 commits) for context.
