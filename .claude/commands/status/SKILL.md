---
name: status
description: Show project progress across specs and plans.
disable-model-invocation: true
---

Show project status:

1. List all files in `/_specs/` and `/_plans/`.
2. For each spec, check if a matching plan exists and read its `## Status:` line.
3. Show a summary:

```
## Project Status

| # | Feature | Spec | Plan | Status |
|---|---------|------|------|--------|
| 1 | Desktop OS | 01-desktop-os.md | 01-desktop-os.md | Implemented |
| 2 | Feature Name | 02-feature.md | — | Pending |
```

4. Flag specs without plans, and plans still marked Pending.
5. Show recent git log (last 5 commits) for additional context.
