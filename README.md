# Family Emergency Handbook (local)

Personal printable emergency handbook builder. Runs **only on your machine** — not deployed to Uber vibe infra.

## Run

```bash
cd ~/family-emergency-handbook
npm install
npm run dev
```

Then open the local URL (usually http://localhost:5173), enter counts, generate, and use **Print / Save PDF**.

This project's `.npmrc` sets the registry to `https://registry.npmjs.org/`.

## Security

- Handwrite passwords on the printed paper master.
- Do not type secrets into the browser form.
- Do not commit a filled PDF or sync it to cloud storage.
