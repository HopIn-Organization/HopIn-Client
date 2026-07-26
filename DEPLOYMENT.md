# Deployment

Shared infrastructure setup (VPN/SSH, nginx, TLS certs, MinIO/Postgres) lives
in [`Hopin-Server/DEPLOYMENT.md`](../Hopin-Server/DEPLOYMENT.md) — do that
first. This doc only covers what's specific to the client.

## How it works

Deploys are done **from the machine itself** (over SSH, or from a
cron/systemd timer), not via GitHub Actions — see the server's
`DEPLOYMENT.md` for why. Run [`deploy/deploy.sh`](deploy/deploy.sh):

```bash
cd ~/hopin/HopIn-Client
./deploy/deploy.sh
```

It pulls `main`, installs deps, lints, builds the Vite production bundle
(baking in `VITE_*` from `.env` — see below), and `rsync`s `dist/` into
`/var/www/hopin-client`, which nginx serves directly (see
`Hopin-Server/deploy/nginx.conf`). It's a plain local file copy — no
network hop involved, since the machine building it IS the machine serving
it.

Run it by hand whenever you want to ship, or automate it with a
cron/systemd timer alongside the server's (see the server's `DEPLOYMENT.md`
for the crontab example).

Pull requests still run [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
on a normal GitHub-hosted runner (lint, build) — it never touches the
production machine.

## Configuration

Vite bakes `VITE_*` env vars into the static bundle at build time, so
`.env` needs the real production values *before* `deploy.sh` runs `npm run
build`. Copy `.env.example` to `.env` in `~/hopin/HopIn-Client` on the
machine (gitignored, never committed, `deploy.sh` refuses to run without
it) and fill in:

| Variable | Production value |
|---|---|
| `VITE_DATA_SOURCE` | `api` (switches off the built-in mock data source; see `src/utils/env.ts`) |
| `VITE_API_BASE_URL` | `https://hopIn.cs.colman.ac.il/api/` |
| `VITE_GOOGLE_CLIENT_ID` | your production Google OAuth client ID |

None of these are secret by design (the Google client ID is public, the API
URL is just the domain) — but they still live in `.env` on the machine
rather than in git, same as the server, so a single file controls
everything and there's no risk of a dev/local value slipping into a
production build.
