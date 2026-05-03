---
name: Pre-existing test failures in auth/user/job suites
description: auth, user, and job test suites fail consistently due to environment issues, not code regressions
type: feedback
---

`npm test` reports failures in `auth.test.ts`, `user.test.ts`, and `job.test.ts` — all showing 404s on auth routes or 500 DB errors. These failures exist before any changes to the onboarding module and are caused by test environment configuration (likely missing test DB seed data or route mounting issues in test setup).

**Why:** The test database is not seeded with the expected users, or the app instance used in tests does not mount all routes correctly. The `project.test.ts` suite passes.

**How to apply:** Do not treat these failures as regressions when validating onboarding changes. When running `npm test`, check that no *new* failures appear compared to the pre-existing baseline.
