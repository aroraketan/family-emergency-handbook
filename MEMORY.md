# Project Memory — Family Emergency Handbook

Running context for future agent sessions. Update this file after every major change (see `.cursor/rules/project-memory.mdc`).

## Purpose

A React app that builds a printable family emergency handbook. Details can be typed so they appear on the printout, but they are kept only in memory for the open tab. The paper copy is the record to store offline. The blank app shell is hosted on personal GitHub Pages.

## Hard constraints (from the user)

- **Not on Uber infra.** Never deploy to vibe-mcp, TerraBLOB, or the vibe-apps repo. Do not use vibe plugin skills to build or deploy this project. The blank app is published on the user's personal GitHub Pages site.
- **No stored secrets.** The handbook accepts typed details so they can be printed. Typing passwords and PINs is allowed, but not recommended. Values live in React state for the open tab only: no localStorage, sessionStorage, cookies, URL, or server. **Save JSON** always asks for a passphrase and downloads a file the user chooses to keep. The whole handbook is one AES-GCM ciphertext; the key is derived with PBKDF2-SHA-256 (600,000 iterations). The download name includes the local date and time. The passphrase is asked again on load and is not stored. Saved files are schema version 1 only. Refresh, close the tab, or Reset discards the in-app copy. Reset clears typed details and member names and counts, then returns to the opening screen. Do not commit or sync a filled PDF or saved JSON to cloud storage.
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

1. **Opening screen** — two choices: **Load JSON** or **Start blank**.
2. **Size step** — number of household members (1–12) plus optional names. Reached only after Start blank.
3. **Member steps** — per-member counts: bank accounts, credit/debit cards, FDs, investments, insurance, loans, digital accounts, medications, employers.
4. **Household step** — shared counts: emergency contacts, neighbors, vehicles, utilities, subscriptions, pets.
5. **Handbook view** — one full section per member (identity docs incl. Aadhaar/PAN plus three blank rows for extra documents, financial accounts, crypto, insurance, core digital access, medical), followed by shared household sections. Every former blank line is a text field.

Any block whose count is 0 is omitted from the printout; section numbers are computed dynamically.

All user-entered data lives in one root-level `HandbookData` object: `{ schemaVersion, config, fields, secretFields }`. **Save JSON** writes `SavedHandbook` schema version 1 (`src/save-data.ts`): the config and every field are one AES-GCM ciphertext, and the file name includes the local date and time. **Load JSON** accepts only that version, asks for the passphrase, and replaces the in-memory store. A successful load opens the handbook. The file is not written by the app except as that download, and is not kept after load.

## Code map (`src/`)

- `types.ts` — `MemberCountKey`, `HouseholdCountKey`, `HandbookConfig`, `WizardStep`.
- `defaults.ts` — count field definitions (labels, min/max), default counts, `resizeMembers`, `totalSlots`.
- `store.tsx` — root in-memory `HandbookData` store. Owns member/count config, every handbook field, and which fields are secrets.
- `save-data.ts` — builds and downloads the JSON file, and reads a saved file back into `HandbookData`. Encrypts and decrypts the whole handbook with AES-GCM and a user passphrase. The download name includes the local date and time.
- `wizard.tsx` — multi-step count wizard (`data-testid="count-wizard"`).
- `App.tsx` — home / wizard / handbook views. The opening screen is two choices: Load JSON or Start blank. The setup toolbar has Save JSON. The handbook toolbar has Edit setup / Reset / Save JSON / Print. The wizard's last step generates the handbook. Load JSON is only on the opening screen. Reset clears records and config and returns there. Save and load passphrase fields are focused when those dialogs open.
- `handbook.tsx` — composes `handbook-life.tsx` (members, contacts, home, vehicles) and `handbook-assets.tsx` (subscriptions, pets, etc.).
- `handbook-member.tsx` — per-member section; `handbook-parts.tsx` — shared `Field`, `DetailInput`, `BlankRows`, `SectionTitle`, etc.
- `section-numbers.ts` — dynamic section numbering; `styles.ts` — screen + print CSS (`APP_CSS`).

## History

- **2026-10-15 to 10-19 (original session, `~/web-code` workspace)** — Built initially as a vibe app; user then asked for local-only. Iterations: count-driven wizard, passwords included on the paper master, zero-count sections skipped, Aadhaar added and Tax ID/SSN renamed to PAN, redesigned to per-member counts with per-member PDF sections.
- **2026-10-19 — moved to this standalone project.** Removed from `~/vibe-apps` (local commit) and replaced the hosted vibe app with a private "Removed" stub. A full slug deletion needs a vibe admin (`#vibe-tools`). `~/tmp/family-emergency-handbook` contains only a `MOVED.md` pointer.
- **2026-10-19** — Verified `tsc` and `vite build` pass locally; added this memory file and the memory-update rule.
- **2026-10-19** — Installed Node 26 via Homebrew (it was missing). Retargeted all 119 `package-lock.json` resolved URLs from `unpm.uberinternal.com` to `registry.npmjs.org` so install works without Uber npm auth. Dev server runs at http://127.0.0.1:5173.
- **2026-10-19** — Added project `.npmrc` so this folder uses `https://registry.npmjs.org/` even when the user npm config points at Uber's registry.
- **2026-10-19** — Created private GitHub repo `aroraketan/family-emergency-handbook` and pushed the local project.
- **2026-10-19** — Made the repo public and added a GitHub Actions Pages workflow. Free GitHub Pages cannot publish a private repo. Site: https://aroraketan.github.io/family-emergency-handbook/
- **2026-10-19** — Handbook fields accept typed details for printing. Values stay in React state only and are cleared on refresh, tab close, or Clear details. Not committed.
- **2026-10-19** — Password and PIN entry is allowed but not recommended. Each member's identity table has two extra blank rows for ad hoc documents.
- **2026-10-19** — Removed the fixed "Other" identity row. Each member has three blank document rows so the document type can be typed.
- **2026-10-19** — Consolidated member/count config and handbook fields into one versioned, serializable root store for future JSON/XML export and import. It still has no persistence. Not committed.
- **2026-10-19** — Added Save JSON. The download uses JSON because it matches the in-memory store. Password, PIN, code, seed, and backup-code values are base64-encoded in the file and left as plain text on screen.
- **2026-10-19** — Replaced base64 with AES-GCM encryption for those secret fields. The passphrase is entered at download time and is not stored. Saved file schema is version 2.
- **2026-10-19** — Added Load JSON on the opening screen and in the toolbar. A saved file restores counts and details; encrypted secrets ask for the passphrase. The loaded copy stays in the open tab only.
- **2026-10-19** — Reset (formerly Clear details) clears typed records and household config, then returns to the opening screen.
- **2026-10-19** — Save JSON always asks for a passphrase and encrypts the whole handbook. The download name includes the date and time so the OS does not append a number.
- **2026-10-19** — Saved files are schema version 1 only. The loader no longer accepts earlier file shapes.
- **2026-10-19** — The opening screen is only two choices: Load JSON or Start blank. The household form appears after Start blank.
- **2026-10-19** — Removed Load JSON from the handbook toolbar. Renamed Edit counts to Edit setup. Save and load passphrase fields focus when the dialog opens.
- **2026-10-19** — Removed the setup-screen Generate shortcut. The wizard's last step creates the handbook.
- **2026-10-19** — Handbook inputs use the sans-serif text face. The printed page body stays serif.
- **2026-10-19** — The handbook body uses the same sans-serif text face as the inputs and headings.

## Known leftovers / open items

- `tests/smoke.spec.ts` still targets the old vibe staging URL and needs Playwright (not installed). Delete it or rewrite it to test localhost.
- Vibe slug `family-emergency-handbook` still exists as a "Removed" stub until an admin deletes it.
