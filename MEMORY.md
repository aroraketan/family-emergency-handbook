# Project Memory — Family Emergency Handbook

Running context for future agent sessions. Update this file after every major change (see `.cursor/rules/project-memory.mdc`).

## Purpose

A React app that builds a **blank, printable family emergency handbook**. The user prints it, handwrites all details (including passwords) on the paper master copy, and stores it offline in a secure place. The blank app is hosted on personal GitHub Pages.

## Hard constraints (from the user)

- **Not on Uber infra.** Never deploy to vibe-mcp, TerraBLOB, or the vibe-apps repo. Do not use vibe plugin skills to build or deploy this project. The blank app is published on the user's personal GitHub Pages site.
- **No secrets in the browser.** The form only collects counts and optional member names; all sensitive data is handwritten on paper.
- Do not commit or sync a filled PDF to cloud storage.
- Indian context: identity docs include **Aadhaar** and **PAN** (not SSN/Tax ID).

## Stack and commands

- Vite 6 + React 19 + TypeScript (strict, `noUnusedLocals`), no other runtime deps.
- Dependencies come from the public npm registry. Project `.npmrc` sets `registry=https://registry.npmjs.org/`, and `package-lock.json` resolved URLs point there too.
- `npm run dev` → http://localhost:5173, then **Print / Save PDF** in the browser.
- `npm run build` → `dist/` (`npx tsc --noEmit` for type-checking).
- Public Git repo on the personal account `aroraketan`: https://github.com/aroraketan/family-emergency-handbook
- GitHub Pages (free plan requires a public repo): https://aroraketan.github.io/family-emergency-handbook/
- Pages deploys from `.github/workflows/pages.yml` on pushes to `main`. The workflow sets `VITE_BASE_PATH` so Vite assets resolve under the project site path. Local `npm run dev` stays at `/`.

## App flow

1. **Size step** — number of household members (1–12) plus optional names.
2. **Member steps** — per-member counts: bank accounts, credit/debit cards, FDs, investments, insurance, loans, digital accounts, medications, employers.
3. **Household step** — shared counts: emergency contacts, neighbors, vehicles, utilities, subscriptions, pets.
4. **Handbook view** — one full section per member (identity docs incl. Aadhaar/PAN, financial accounts, crypto, insurance, core digital access with password fields, medical), followed by shared household sections.

Any block whose count is 0 is omitted from the PDF; section numbers are computed dynamically.

## Code map (`src/`)

- `types.ts` — `MemberCountKey`, `HouseholdCountKey`, `HandbookConfig`, `WizardStep`.
- `defaults.ts` — count field definitions (labels, min/max), default counts, `resizeMembers`, `totalSlots`.
- `wizard.tsx` — multi-step count wizard (`data-testid="count-wizard"`).
- `App.tsx` — wizard/handbook view toggle, toolbar with Generate / Edit counts / Print.
- `handbook.tsx` — composes `handbook-life.tsx` (members, contacts, home, vehicles) and `handbook-assets.tsx` (subscriptions, pets, etc.).
- `handbook-member.tsx` — per-member section; `handbook-parts.tsx` — shared `Field`, `BlankRows`, `SectionTitle`, etc.
- `section-numbers.ts` — dynamic section numbering; `styles.ts` — screen + print CSS (`APP_CSS`).

## History

- **2026-10-15 to 10-19 (original session, `~/web-code` workspace)** — Built initially as a vibe app; user then asked for local-only. Iterations: count-driven wizard, passwords included on the paper master, zero-count sections skipped, Aadhaar added and Tax ID/SSN renamed to PAN, redesigned to per-member counts with per-member PDF sections.
- **2026-10-19 — moved to this standalone project.** Removed from `~/vibe-apps` (local commit) and replaced the hosted vibe app with a private "Removed" stub. A full slug deletion needs a vibe admin (`#vibe-tools`). `~/tmp/family-emergency-handbook` contains only a `MOVED.md` pointer.
- **2026-10-19** — Verified `tsc` and `vite build` pass locally; added this memory file and the memory-update rule.
- **2026-10-19** — Installed Node 26 via Homebrew (it was missing). Retargeted all 119 `package-lock.json` resolved URLs from `unpm.uberinternal.com` to `registry.npmjs.org` so install works without Uber npm auth. Dev server runs at http://127.0.0.1:5173.
- **2026-10-19** — Added project `.npmrc` so this folder uses `https://registry.npmjs.org/` even when the user npm config points at Uber's registry.
- **2026-10-19** — Created private GitHub repo `aroraketan/family-emergency-handbook` and pushed the local project.
- **2026-10-19** — Made the repo public and added a GitHub Actions Pages workflow. Free GitHub Pages cannot publish a private repo. Site: https://aroraketan.github.io/family-emergency-handbook/

## Known leftovers / open items

- `tests/smoke.spec.ts` still targets the old vibe staging URL and needs Playwright (not installed). Delete it or rewrite it to test localhost.
- Vibe slug `family-emergency-handbook` still exists as a "Removed" stub until an admin deletes it.
