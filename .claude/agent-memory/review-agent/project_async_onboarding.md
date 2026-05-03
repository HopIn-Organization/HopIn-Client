---
name: Async background onboarding generation feature
description: Context for the fire-and-forget onboarding generation feature merged in May 2026
type: project
---

POST /onboarding/generate now returns 202 immediately and runs LLM generation as a background process (fire-and-forget with .catch()). Status is tracked via a new `status` VARCHAR column and `failureReason` TEXT column on the onboarding table.

**Why:** LLM generation is slow; blocking the HTTP response caused timeouts and poor UX.
**How to apply:** When reviewing follow-up changes that touch onboarding generation, be aware that the onboarding record exists in `pending` state before tasks are attached. Any code reading tasks should handle the case where tasks may be empty while status != ready.

Key decisions made:
- Status values: pending | generating | ready | failed
- Frontend polls GET /onboarding/:id/status every 3 seconds; stops when status is ready or failed
- generatingOnboardingId held in Zustand (in-memory only — not persisted, so page reload loses tracking)
- OnboardingGenerationWatcher renders null and lives in AppShell so it is always mounted
- handledStatusRef guards against duplicate toasts within the same session
- No migration was shipped with this PR — relies on DB_SYNCHRONIZE=true for dev, needs a migration for production
- Duplicate "started" toast risk: ProjectMemberRow fires its own toast.success on 202; Watcher fires another on ready — two toasts per successful generation
