---
name: spec
description: Create a feature spec from a short idea. Writes a structured spec file to /_specs/ with acceptance criteria and open questions.
disable-model-invocation: true
---

Create a spec file from $ARGUMENTS.

1. Read `CLAUDE.md` for project context.
2. Create a new file in `/_specs/` named with today's date + short slug.
3. Use this template:

```
# Spec: [Title]
## Summary
## Why
## Requested outcome
## Users affected
## Functional expectations
## Acceptance criteria
## Open questions
## Affected components
```

4. Write in simple language. Focus on what and why, not implementation.
5. After creating the file, ask each open question ONE AT A TIME. Wait for the answer before asking the next.
6. If user says "skip", move on.
7. After all questions, update the spec with answers.

STOP after the spec is complete. Do NOT create a plan or start implementing.
