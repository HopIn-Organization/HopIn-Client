---
name: Pre-existing lint and build errors
description: The repo had lint and TS build errors before async onboarding work — do not treat as regressions
type: project
---

As of 2026-05-02, the repo has pre-existing lint and TS build failures that existed before the async onboarding generation work.

Lint (eslint --max-warnings=0) fails with 6 issues:
- `PlanTimeline.tsx`: `react-hooks/set-state-in-effect` — setState inside useEffect
- `TaskModal.tsx`: `react-hooks/set-state-in-effect` + `react-hooks/exhaustive-deps`
- `ProjectAccessPage.tsx`: 3 unused-vars errors

Build (tsc -b) fails with ~13 TS errors (was 20 before this task):
- `ProjectForm.tsx`, `projects.mock.ts`, `ProjectAccessPage.tsx`, `ProjectSettingsPage.tsx`, `CreateProjectPage.tsx` — various type mismatches (exactOptionalPropertyTypes, Job id type string vs number)

**Why:** These were present before the async onboarding task. The task's changes reduced TS errors from 20 to 13 by fixing the `plan.id` reference in `ProjectMemberRow.tsx`.

**How to apply:** When running lint/build, only flag errors introduced by the current task. Compare error counts against baseline (6 lint issues, 13 TS errors post-task).
