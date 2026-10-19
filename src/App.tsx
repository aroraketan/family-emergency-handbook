import { useMemo, useState } from 'react';
import { totalSlots } from './defaults';
import { Handbook } from './handbook';
import { HandbookStoreProvider, useHandbookStore } from './store';
import { APP_CSS } from './styles';
import type { View, WizardStep } from './types';
import { Wizard } from './wizard';

export default function App() {
  return (
    <HandbookStoreProvider>
      <AppShell />
    </HandbookStoreProvider>
  );
}

function AppShell() {
  const { data, setConfig } = useHandbookStore();
  const [step, setStep] = useState<WizardStep>({ kind: 'size' });
  const [view, setView] = useState<View>('wizard');

  const slots = useMemo(() => totalSlots(data.config), [data.config]);

  return (
    <div className="app-shell" data-testid="app-root">
      <style>{APP_CSS}</style>

      <header className="toolbar no-print">
        <p>
          Type details to print them. Values stay only in this open tab. Passwords
          and PINs may be typed, but that is not recommended.
        </p>
        <div className="toolbar-actions">
          {view === 'handbook' ? (
            <>
              <button
                type="button"
                data-testid="edit-counts"
                onClick={() => {
                  setStep({ kind: 'size' });
                  setView('wizard');
                }}
              >
                Edit counts
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
            <button
              type="button"
              className="primary"
              onClick={() => setView('handbook')}
            >
              Generate ({slots} slots)
            </button>
          )}
        </div>
      </header>

      {view === 'wizard' ? (
        <Wizard
          config={data.config}
          step={step}
          onConfigChange={setConfig}
          onStepChange={setStep}
          onGenerate={() => setView('handbook')}
        />
      ) : (
        <Handbook config={data.config} />
      )}
    </div>
  );
}
