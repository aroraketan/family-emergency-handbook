# Family Emergency Handbook

Personal printable emergency handbook builder. The hosted site is a blank form. It is not deployed to Uber vibe infra.

Live site: https://aroraketan.github.io/family-emergency-handbook/

## Run

```bash
cd ~/family-emergency-handbook
npm install
npm run dev
```

Then open the local URL (usually http://localhost:5173), enter counts, generate, and use **Print / Save PDF**.

This project's `.npmrc` sets the registry to `https://registry.npmjs.org/`.

## Security

- Details you type are kept only in the open tab so they can be printed.
- **Save JSON** always asks for a passphrase and encrypts the whole file. The passphrase is not saved. The download name includes the date and time.
- **Load JSON**, on the first screen, opens that file again and asks for the same passphrase. The loaded copy stays in the open tab only.
- Typing passwords and PINs is allowed, but not recommended.
- Refresh, close the tab, or use **Reset** to discard them. Reset clears typed details and member names and counts, then returns to the start. The app does not save them in the browser or send them anywhere.
- Do not commit a filled PDF or sync it to cloud storage.
