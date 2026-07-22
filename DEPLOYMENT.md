# Deployment

Shared infrastructure setup (VPN/SSH, self-hosted GitHub Actions runner,
nginx, TLS certs) lives in
[`Hopin-Server/DEPLOYMENT.md`](../Hopin-Server/DEPLOYMENT.md) — do that
first. This doc only covers what's specific to the client.

## How it works

On every push to `main`, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
runs on the same `hopin-prod` self-hosted runner as the server: installs
deps, lints, builds the Vite production bundle, and copies `dist/` into
`/var/www/hopin-client`, which nginx serves directly (see
`Hopin-Server/deploy/nginx.conf`). Because the runner IS the production
machine, this is a local file copy — no SSH/network hop involved.

Pull requests instead run [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
on a normal GitHub-hosted runner (lint, format check, build) — it never
touches the production machine.

## Configuration

Vite bakes `VITE_*` env vars into the static bundle at build time, so they
must be set as GitHub Actions **repository variables** (Settings → Secrets
and variables → Actions → Variables) before the first deploy — these are
not secret values (the Google client ID is public by design; the API URL is
just the domain), so plain variables are fine, no need for encrypted
secrets:

- `VITE_DATA_SOURCE` — `api` (switches off the built-in mock data source; see `src/utils/env.ts`)
- `VITE_API_BASE_URL` — `https://hopIn.cs.colman.ac.il/api/`
- `VITE_GOOGLE_CLIENT_ID` — the production Google OAuth client ID

Also create a `production` environment in this repo's Settings →
Environments (the workflow deploys to it) — optionally with required
reviewers if you want a manual approval gate before client deploys run.
