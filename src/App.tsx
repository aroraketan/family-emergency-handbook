import { useMemo, useState } from 'react';
import { createDefaultConfig, totalSlots } from './defaults';
import { Handbook } from './handbook';
import { APP_CSS } from './styles';
import type { HandbookConfig, View, WizardStep } from './types';
import { Wizard } from './wizard';

export default function App() {
  const [config, setConfig] = useState<HandbookConfig>(createDefaultConfig);
  const [step, setStep] = useState<WizardStep>({ kind: 'size' });
  const [view, setView] = useState<View>('wizard');

  const slots = useMemo(() => totalSlots(config), [config]);

  return (
    <div className="app-shell" data-testid="app-root">
      <style>{APP_CSS}</style>

      <header className="toolbar no-print">
        <p>
          Private blank handbook builder. Counts are per household member, then
          shared items. Print and handwrite passwords on paper only.
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
          config={config}
          step={step}
          onConfigChange={setConfig}
          onStepChange={setStep}
          onGenerate={() => setView('handbook')}
        />
      ) : (
        <Handbook config={config} />
      )}
    </div>
  );
}
