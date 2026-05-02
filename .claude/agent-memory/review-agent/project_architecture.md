---
name: HopIn project architecture
description: Key architectural facts about HopIn client/server split, patterns, and conventions
type: project
---

HopIn is split into Hopin-Server (Express/TypeORM/PostgreSQL) and HopIn-Client (React/Vite/React Query/Zustand/Tailwind).

**Why:** These facts shape every review — what counts as a contract mismatch, where to look for regressions, and what patterns are expected.
**How to apply:** When reviewing backend changes, check for missing migrations alongside entity changes. When reviewing frontend changes, verify the gateway abstraction (ai.gateway.ts / onboarding.gateway.ts) and that mock and API implementations stay in sync.

Key conventions observed:
- Backend routes live in *.routes.ts, controller logic in *.controller.ts, business logic in *.service.ts, DB access in *.repository.ts
- Frontend uses a gateway pattern: an interface (*.gateway.ts), a real API implementation (*.api.ts), a mock (*.mock.ts), and a thin selector (*.service.ts) that picks based on env.dataSource
- Global UI state (in-flight generation ID) lives in Zustand (ui.store.ts)
- Polling is done via React Query's refetchInterval returning false to stop
- Toast notifications via react-hot-toast; success toasts from OnboardingGenerationWatcher, optimistic feedback toasts from call sites
- Server CLAUDE.md rule: any new/changed API route or response shape must update README.md in the same turn
- Migrations are explicit .ts files under src/database/migrations/; synchronize is env-gated (DB_SYNCHRONIZE=true)
