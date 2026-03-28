# HopIn Client

Production-ready React + TypeScript frontend for a multi-company onboarding platform.

## Stack

- React + TypeScript (strict)
- Vite
- TailwindCSS design system layer
- React Router (public/protected route structure)
- React Query (server state)
- Zustand (UI/auth state)
- Axios API client with centralized interceptors
- Mock-first service architecture for fast backend swap

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run format`

## Main Routes

- `/projects` – team lead projects dashboard
- `/projects/new` – create project form
- `/statistics` – project analytics cards
- `/onboarding/start` – employee input form
- `/onboarding/review` – team lead requirements form
- `/onboarding/plan` – generated onboarding journey page

## Architecture

```
src/
  app/
  pages/
  features/
  components/
  ui/
  services/
  hooks/
  store/
  types/
  utils/
  mocks/
```

All page and feature code uses service abstractions only. Components do not import JSON directly.

## Data Source Switching (Mock -> API)

1. Copy `.env.example` to `.env`.
2. Use mock mode now:

```bash
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Switch to backend later by setting:

```bash
VITE_DATA_SOURCE=api
```

No page/component refactor is required; service gateways select mock vs API implementation.
