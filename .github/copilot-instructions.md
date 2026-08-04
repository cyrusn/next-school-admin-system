# Copilot instructions for next-school-admin-system

Purpose: quick actionable guidance for Copilot sessions working in this repository.

---

## 1) Build, test, and lint (how to run)

- Install: `npm install` or `yarn install` (repo lists yarn@1 in package.json)
- Dev: `npm run dev` (package.json runs `node scripts/fetch-settings.js` then `next dev`)
- Build: `npm run build` (runs `node scripts/fetch-settings.js` then `next build`)
- Start (production): `npm run start` (runs `node scripts/fetch-settings.js` then `next start`)
- Lint: `npm run lint` (alias for `next lint`). To lint a single file: `npx eslint path/to/file --fix`.
- Tests: there is no test script in package.json. When tests are added, run the test runner directly (examples: `npx jest path/to/test.js` or `npx vitest path/to/test`).

Scripts of interest: `scripts/fetch-settings.js` is required before dev/build (package.json invokes it). `scripts/generate-changelog.js` is used during `version` script.

---

## 2) High-level architecture (big picture)

- Frontend: Next.js (app directory) React 19 based application (created with `create-next-app`). UI uses Bulma + DataTables + FontAwesome.
- Auth: next-auth used for authentication/authorization; teacher/staff emails and roles are driven from a Google Sheets "staff" spreadsheet.
- Data storage: Google Sheets (Sheets API via `googleapis`) act as the primary datastore. Each sheet's first row (row 1) is treated as property names; code maps columns to object properties.
- Config/Secrets: runtime relies on `.env.development` / `.env.production` and a service account JSON placed as `.env.key.json`. The service account's `client_email` must be granted Editor on the relevant sheets/folders.
- Runtime bootstrap: `scripts/fetch-settings.js` downloads sheet settings / configuration before Next starts (this is why package.json calls it for dev/build/start).
- Deployment: repository includes shell helpers to build and deploy a Docker image (`build.sh`, `sync.sh`) and server-side helpers (`load.sh`, `start.sh`, `restart.sh`, `fullRun.sh`, `stop.sh`) referenced in README/setup.md.

---

## 3) Key conventions and repository-specific patterns

- Google Sheets-driven domain model:
  - The code expects specific sheet names and exact header names in Row 1. `setup.md` documents expected headers for students, teachers, announcements, timetable, clubs, OLE, etc. Treat `setup.md` as the canonical schema.
  - Many computed boolean flags (e.g., `isNcs`, `isSen`, `isNewlyArrived`) are derived server-side from sheet columns — do not modify those assumptions lightly.
- Service account handling:
  - Keep `.env.key.json` out of source control. Share sheets with `client_email` from that JSON.
- Bootstrap dependency:
  - Do not remove or bypass `scripts/fetch-settings.js` — it is invoked automatically and required for correct runtime configuration.
- Auth/permissions:
  - Staff/teacher spreadsheet controls user roles; changes to auth logic should consider that data source.
- Linting & tooling:
  - ESLint configured via `eslint-config-next`; use `npm run lint` or `npx eslint` for targeted checks.
  - package.json declares `packageManager: "yarn@1.x"` — prefer yarn v1 for deterministic installs when possible.
- Deployment scripts:
  - `sync.sh` expects variables to be configured (LOCATION/DEST). Be careful when editing these scripts; they are used by ops.

---

## 4) Where to look first when answering questions

- `README.md` and `setup.md` — bootstrapping, spreadsheet schema and deploy steps.
- `scripts/fetch-settings.js` — how runtime configuration is assembled.
- `app/` (Next app pages) and `src/` (if present) — primary application code.
- `package.json` — scripts and dependencies.

---

## 5) Existing AI assistant configs

- None found (checked for CLAUDE.md, .cursorrules, AGENTS.md, CONVENTIONS.md, .windsurfrules). If any are added later, merge relevant rules into this file.

---

If changes are made to sheets or their schemas, update `setup.md` and this file so future Copilot sessions stay accurate.
