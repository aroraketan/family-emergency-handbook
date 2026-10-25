import { useEffect, useRef, useState } from 'react';
import { Handbook } from './handbook';
import {
  downloadSavedHandbook,
  handbookFromSaved,
  LoadError,
  PASSPHRASE_MIN_LENGTH,
  readSavedHandbook,
} from './save-data';
import { HandbookStoreProvider, useHandbookStore } from './store';
import { APP_CSS } from './styles';
import type { HandbookData, SavedHandbook, View, WizardStep } from './types';
import { Wizard } from './wizard';

export default function App() {
  return (
    <HandbookStoreProvider>
      <AppShell />
    </HandbookStoreProvider>
  );
}

function AppShell() {
  const { data, setConfig, clearFields, replaceData } = useHandbookStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<WizardStep>({ kind: 'size' });
  const [view, setView] = useState<View>('home');
  const [saveOpen, setSaveOpen] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveBusy, setSaveBusy] = useState(false);
  const [pendingLoad, setPendingLoad] = useState<SavedHandbook | null>(null);
  const [loadPassphrase, setLoadPassphrase] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadBusy, setLoadBusy] = useState(false);
  const [fileError, setFileError] = useState('');

  const closeSave = () => {
    setSaveOpen(false);
    setPassphrase('');
    setPassphraseConfirm('');
    setSaveError('');
    setSaveBusy(false);
  };

  const requestSave = () => {
    setPassphrase('');
    setPassphraseConfirm('');
    setSaveError('');
    setSaveOpen(true);
  };

  const confirmSave = async () => {
    if (passphrase.length < PASSPHRASE_MIN_LENGTH) {
      setSaveError('Use at least 8 characters.');
      return;
    }
    if (passphrase !== passphraseConfirm) {
      setSaveError('Passphrases do not match.');
      return;
    }
    setSaveBusy(true);
    setSaveError('');
    try {
      await downloadSavedHandbook(data, passphrase);
      closeSave();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'The file could not be saved.');
    } finally {
      setSaveBusy(false);
    }
  };

  const applyLoaded = (next: HandbookData) => {
    replaceData(next);
    setPendingLoad(null);
    setLoadPassphrase('');
    setLoadError('');
    setFileError('');
    setStep({ kind: 'size' });
    setView('handbook');
  };

  const closeLoad = () => {
    setPendingLoad(null);
    setLoadPassphrase('');
    setLoadError('');
    setLoadBusy(false);
  };

  const requestLoad = () => {
    setFileError('');
    fileInput.current?.click();
  };

  const onFileChosen = async (file: File) => {
    if (Object.keys(data.fields).length > 0) {
      const replace = window.confirm(
        'Loading a file replaces the details currently on screen. Continue?',
      );
      if (!replace) return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setFileError('That file could not be read.');
      return;
    }
    let saved: SavedHandbook;
    try {
      saved = readSavedHandbook(text);
    } catch (error) {
      setFileError(error instanceof LoadError ? error.message : 'That file could not be opened.');
      return;
    }
    setPendingLoad(saved);
    setLoadPassphrase('');
    setLoadError('');
  };

  const confirmLoad = async () => {
    if (!pendingLoad) return;
    setLoadBusy(true);
    setLoadError('');
    try {
      applyLoaded(await handbookFromSaved(pendingLoad, loadPassphrase));
    } catch (error) {
      setLoadError(
        error instanceof LoadError ? error.message : 'That file could not be opened.',
      );
    } finally {
      setLoadBusy(false);
    }
  };

  return (
    <div className="app-shell" data-testid="app-root">
      <style>{APP_CSS}</style>

      {view === 'home' ? null : (
      <header className="toolbar no-print">
        <p>
          Type details to print them. Passwords and PINs may be typed, but that is
          not recommended. Save JSON always asks for a passphrase and encrypts the
          whole file. Each download has its own name. The app keeps nothing after
          a refresh.
        </p>
        <div className="toolbar-actions">
          {view === 'handbook' ? (
            <>
              <button
                type="button"
                data-testid="edit-setup"
                onClick={() => {
                  setStep({ kind: 'size' });
                  setView('wizard');
                }}
              >
                Edit setup
              </button>
              <button
                type="button"
                data-testid="reset-handbook"
                onClick={() => {
                  clearFields();
                  setStep({ kind: 'size' });
                  setView('home');
                }}
              >
                Reset
              </button>
              <button type="button" data-testid="save-data" onClick={requestSave}>
                Save JSON
              </button>
              <button
                type="button"
                className="primary"
                data-testid="print-handbook"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </button>
            </>
          ) : (
            <button type="button" data-testid="save-data" onClick={requestSave}>
              Save JSON
            </button>
          )}
        </div>
      </header>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        data-testid="load-file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void onFileChosen(file);
        }}
      />

      {fileError ? (
        <p className="file-error no-print" role="alert" data-testid="load-error">
          {fileError}
        </p>
      ) : null}

      {saveOpen ? (
        <SavePassphraseDialog
          passphrase={passphrase}
          confirm={passphraseConfirm}
          error={saveError}
          busy={saveBusy}
          onPassphrase={setPassphrase}
          onConfirm={setPassphraseConfirm}
          onCancel={closeSave}
          onSubmit={() => void confirmSave()}
        />
      ) : null}

      {pendingLoad ? (
        <LoadPassphraseDialog
          passphrase={loadPassphrase}
          error={loadError}
          busy={loadBusy}
          onPassphrase={setLoadPassphrase}
          onCancel={closeLoad}
          onSubmit={() => void confirmLoad()}
        />
      ) : null}

      {view === 'home' ? (
        <HomeChoices onLoad={requestLoad} onStart={() => {
          setFileError('');
          setStep({ kind: 'size' });
          setView('wizard');
        }} />
      ) : view === 'wizard' ? (
        <Wizard
          config={data.config}
          step={step}
          onConfigChange={setConfig}
          onStepChange={setStep}
          onGenerate={() => setView('handbook')}
          onHome={() => setView('home')}
        />
      ) : (
        <Handbook config={data.config} />
      )}
    </div>
  );
}

function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}

function HomeChoices({ onLoad, onStart }: { onLoad: () => void; onStart: () => void }) {
  return (
    <section className="wizard home-choices" data-testid="home">
      <h1>Family Emergency Handbook</h1>
      <p className="lede">
        Load a file you saved earlier, or start a blank handbook. You only need
        one of these.
      </p>
      <div className="choice-row">
        <button type="button" className="choice" data-testid="load-data-start" onClick={onLoad}>
          <span className="choice-title">Load JSON</span>
          <span className="choice-help">
            Open a handbook you already saved. You will need its passphrase.
          </span>
        </button>
        <button type="button" className="choice" data-testid="start-blank" onClick={onStart}>
          <span className="choice-title">Start blank</span>
          <span className="choice-help">
            Set the household size and counts, then fill in the handbook.
          </span>
        </button>
      </div>
    </section>
  );
}

function LoadPassphraseDialog({
  passphrase,
  error,
  busy,
  onPassphrase,
  onCancel,
  onSubmit,
}: {
  passphrase: string;
  error: string;
  busy: boolean;
  onPassphrase: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const passphraseRef = useFocusOnMount<HTMLInputElement>();
  return (
    <div className="save-dialog no-print" role="dialog" aria-labelledby="load-title">
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) onSubmit();
        }}
      >
        <h2 id="load-title">Unlock saved file</h2>
        <p>
          Enter the passphrase you chose when you saved this file. It is not kept.
        </p>
        <label htmlFor="load-passphrase">Passphrase</label>
        <input
          ref={passphraseRef}
          id="load-passphrase"
          data-testid="load-passphrase"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={passphrase}
          onChange={(event) => onPassphrase(event.target.value)}
        />
        {error ? <p className="save-error">{error}</p> : null}
        <div className="dialog-actions">
          <button type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="primary" data-testid="load-confirm" disabled={busy}>
            {busy ? 'Unlocking…' : 'Load'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SavePassphraseDialog({
  passphrase,
  confirm,
  error,
  busy,
  onPassphrase,
  onConfirm,
  onCancel,
  onSubmit,
}: {
  passphrase: string;
  confirm: string;
  error: string;
  busy: boolean;
  onPassphrase: (value: string) => void;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const passphraseRef = useFocusOnMount<HTMLInputElement>();
  return (
    <div className="save-dialog no-print" role="dialog" aria-labelledby="save-title">
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) onSubmit();
        }}
      >
        <h2 id="save-title">Encrypt this file</h2>
        <p>
          The whole handbook is encrypted with this passphrase. You will need it
          to open the file later. It is not saved. The download name includes the
          family name, date, and time.
        </p>
        <label htmlFor="save-passphrase">Passphrase</label>
        <input
          ref={passphraseRef}
          id="save-passphrase"
          data-testid="save-passphrase"
          type="password"
          autoComplete="new-password"
          autoFocus
          value={passphrase}
          onChange={(event) => onPassphrase(event.target.value)}
        />
        <label htmlFor="save-passphrase-confirm">Confirm passphrase</label>
        <input
          id="save-passphrase-confirm"
          data-testid="save-passphrase-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => onConfirm(event.target.value)}
        />
        {error ? <p className="save-error">{error}</p> : null}
        <div className="dialog-actions">
          <button type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="primary" data-testid="save-confirm" disabled={busy}>
            {busy ? 'Encrypting…' : 'Download'}
          </button>
        </div>
      </form>
    </div>
  );
}
