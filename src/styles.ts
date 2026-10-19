const at = String.fromCharCode(64);

export const APP_CSS = `
  :root {
    --ink: #1a1f24;
    --muted: #5a6570;
    --rule: #c5ccd3;
    --line: #9aa5b0;
    --accent: #2c4a3e;
    --paper: #f7f4ef;
    --warn: #6b3a2a;
    --screen: #e8e4dc;
    --btn: #1a1f24;
  }

  * { box-sizing: border-box; }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    color: var(--ink);
    background: var(--screen);
    font-family: "Uber Move Text", "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.45;
  }

  .app-shell { min-height: 100vh; }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--ink);
    color: #f2efe8;
  }

  .toolbar p { margin: 0; max-width: 48rem; opacity: 0.92; font-size: 13px; }

  .toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }

  button {
    appearance: none;
    border: 1px solid #f2efe8;
    background: transparent;
    color: #f2efe8;
    padding: 10px 14px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover { background: #f2efe8; color: var(--ink); }
  button.primary { background: #f2efe8; color: var(--ink); }
  button.primary:hover { background: #fff; }

  .save-dialog {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(26, 31, 36, 0.45);
  }

  .save-dialog form {
    width: min(440px, 100%);
    padding: 22px;
    background: var(--paper);
    color: var(--ink);
    box-shadow: 0 8px 28px rgba(26, 31, 36, 0.22);
  }

  .save-dialog h2 { margin: 0 0 8px; font-size: 1.25rem; }
  .save-dialog p { margin: 0 0 12px; color: var(--muted); }
  .save-dialog label { display: block; font-weight: 600; margin: 12px 0 4px; }

  .save-dialog input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--rule);
    background: #fff;
    color: var(--ink);
    font: inherit;
  }

  .save-dialog .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }

  .save-dialog button { color: var(--ink); border-color: var(--ink); }
  .save-dialog button.primary { background: var(--ink); color: #f2efe8; }
  .save-dialog button.primary:hover { background: #000; color: #fff; }
  .save-dialog .save-error { color: var(--warn); margin: 12px 0 0; }
  .save-dialog button:disabled { opacity: 0.55; cursor: wait; }

  .file-error {
    margin: 0;
    padding: 10px 20px;
    background: #f3e4dc;
    color: var(--warn);
    font-weight: 600;
  }

  .choice-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 28px;
  }

  .wizard .choice {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    min-height: 160px;
    padding: 24px;
    text-align: left;
    color: var(--ink);
    border: 1px solid var(--ink);
    background: #fff;
  }

  .wizard .choice:hover { background: var(--ink); color: #f2efe8; }
  .choice-title { font-size: 1.45rem; font-weight: 700; }
  .choice-help { font-size: 14px; font-weight: 400; line-height: 1.4; }

  .wizard button { color: var(--ink); border-color: var(--ink); background: transparent; }
  .wizard button:hover { background: var(--ink); color: #f2efe8; }
  .wizard button.primary { background: var(--ink); color: #f2efe8; }
  .wizard button.primary:hover { background: #000; color: #fff; }

  @media (max-width: 640px) {
    .choice-row { grid-template-columns: 1fr; }
  }

  .wizard {
    max-width: 920px;
    margin: 24px auto 48px;
    padding: 28px 28px 36px;
    background: var(--paper);
    box-shadow: 0 8px 28px rgba(26, 31, 36, 0.16);
  }

  .wizard h1 {
    margin: 0 0 8px;
    font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
    font-size: 28px;
    color: var(--accent);
  }

  .wizard .lede { color: var(--muted); margin: 0 0 18px; max-width: 40rem; }

  .note {
    border-left: 3px solid var(--warn);
    padding: 10px 12px;
    margin: 0 0 20px;
    color: var(--warn);
    font-size: 13px;
    background: rgba(107, 58, 42, 0.06);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px 16px;
  }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
  }

  .field .help { color: var(--muted); font-size: 12px; margin: 0 0 6px; min-height: 32px; }

  .field input[type="number"],
  .field input[type="text"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--rule);
    background: #fff;
    font: inherit;
    color: var(--ink);
  }

  .wizard-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--rule);
  }

  .summary { color: var(--muted); font-size: 13px; }

  .sheet {
    width: 8.5in;
    margin: 20px auto 40px;
    padding: 0.7in 0.75in 0.65in;
    background: var(--paper);
    box-shadow: 0 8px 28px rgba(26, 31, 36, 0.18);
    color: var(--ink);
    font-family: "Uber Move Text", "Helvetica Neue", Arial, sans-serif;
    font-size: 11pt;
  }

  .sheet h1, .sheet h2, .sheet h3 {
    font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
    font-weight: 700;
    margin: 0 0 0.4rem;
  }

  .sheet h1 { font-size: 1.85rem; color: var(--accent); }
  .sheet h2 {
    font-size: 1.05rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    border-bottom: 2px solid var(--accent);
    padding-bottom: 0.25rem;
    margin: 1.1rem 0 0.65rem;
    break-after: avoid;
  }
  .sheet h3 {
    font-size: 0.95rem;
    margin: 0.85rem 0 0.4rem;
    break-after: avoid;
  }

  .sheet .lede { color: var(--muted); font-size: 0.95rem; margin: 0 0 0.75rem; }
  .sheet .note {
    border-left: 3px solid var(--warn);
    padding: 0.45rem 0.7rem;
    margin: 0.6rem 0 0.9rem;
    color: var(--warn);
    font-size: 0.9rem;
    background: rgba(107, 58, 42, 0.06);
  }

  .field-block { break-inside: avoid; margin: 0 0 0.45rem; }
  .field-block label {
    display: block;
    font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 0.15rem;
  }
  .line {
    border-bottom: 1px solid var(--line);
    min-height: 1.35rem;
  }
  .line.tall { min-height: 2.4rem; }
  .line.x-tall { min-height: 3.6rem; }

  .sheet .fill {
    width: 100%;
    display: block;
    border: none;
    border-bottom: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.72);
    color: inherit;
    font-family: "Uber Move Text", "Helvetica Neue", Arial, sans-serif;
    font-size: inherit;
    line-height: 1.35;
    padding: 0.15rem 0.2rem;
    margin: 0;
    resize: vertical;
    outline: none;
    min-height: 1.35rem;
    field-sizing: content;
  }
  .sheet .fill.tall { min-height: 2.4rem; }
  .sheet .fill.x-tall { min-height: 3.6rem; }
  .sheet .fill.plain {
    border-bottom: none;
    background: transparent;
    min-height: 1.2rem;
    resize: none;
    padding: 0;
  }
  .sheet .fill:focus { background: #fff; }

  .sheet .check {
    width: 0.85rem;
    height: 0.85rem;
    margin-top: 0.2rem;
    accent-color: var(--ink);
  }

  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem 1rem; }
  .row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.55rem 0.75rem; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.35rem 0 0.7rem;
    font-size: 0.92rem;
  }
  th, td {
    border: 1px solid var(--rule);
    padding: 0.35rem 0.4rem;
    vertical-align: bottom;
    text-align: left;
  }
  th {
    font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    background: rgba(44, 74, 62, 0.06);
    font-weight: 600;
  }
  td { height: 1.55rem; }

  .cover {
    min-height: 9.2in;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover-mark {
    font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .cover h1 { font-size: 2.4rem; line-height: 1.1; margin-top: 1.5rem; }
  .cover .subtitle { font-size: 1.1rem; color: var(--muted); margin-top: 0.75rem; max-width: 28rem; }
  .cover-box {
    border: 1.5px solid var(--accent);
    padding: 1rem 1.1rem;
    margin-top: 2rem;
  }
  .cover-foot {
    border-top: 1px solid var(--rule);
    padding-top: 0.75rem;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .checklist { list-style: none; padding: 0; margin: 0.3rem 0 0.7rem; }
  .checklist li {
    display: grid;
    grid-template-columns: 0.95rem 1fr;
    gap: 0.55rem;
    margin: 0.35rem 0;
    break-inside: avoid;
  }
  .box {
    width: 0.85rem;
    height: 0.85rem;
    border: 1.5px solid var(--ink);
    margin-top: 0.15rem;
  }

  .page-break { break-before: page; page-break-before: always; }
  .avoid-break { break-inside: avoid; page-break-inside: avoid; }

  .toc ol { margin: 0.4rem 0 0; padding-left: 1.2rem; }
  .toc li { margin: 0.25rem 0; }

  .count-pill {
    display: inline-block;
    margin-left: 0.4rem;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: var(--muted);
    text-transform: none;
    font-weight: 500;
  }

  ${at}media print {
    body { background: white !important; }
    .no-print { display: none !important; }
    .sheet .fill {
      background: transparent !important;
      resize: none;
      overflow: hidden;
    }
    ${at}page {
      size: letter;
      margin: 0.6in 0.65in 0.55in;
    }
  }
`;
