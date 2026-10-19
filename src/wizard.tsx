import {
  HOUSEHOLD_COUNT_FIELDS,
  MEMBER_COUNT_FIELDS,
  clampCount,
  createDefaultConfig,
  resizeMembers,
  totalSlots,
} from './defaults';
import type { HandbookConfig, WizardStep } from './types';

type Props = {
  config: HandbookConfig;
  step: WizardStep;
  onConfigChange: (next: HandbookConfig) => void;
  onStepChange: (next: WizardStep) => void;
  onGenerate: () => void;
};

function CountGrid<K extends string>({
  fields,
  values,
  onChange,
  idPrefix,
}: {
  fields: { key: K; label: string; help: string; min: number; max: number }[];
  values: Record<K, number>;
  onChange: (key: K, value: number) => void;
  idPrefix: string;
}) {
  return (
    <div className="grid">
      {fields.map((field) => (
        <div className="field" key={field.key}>
          <label htmlFor={idPrefix + '-' + field.key}>{field.label}</label>
          <p className="help">{field.help}</p>
          <input
            id={idPrefix + '-' + field.key}
            data-testid={'count-input-' + idPrefix + '-' + field.key}
            type="number"
            min={field.min}
            max={field.max}
            value={values[field.key]}
            onChange={(event) => {
              onChange(
                field.key,
                clampCount(Number(event.target.value), field.min, field.max)
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function Wizard({
  config,
  step,
  onConfigChange,
  onStepChange,
  onGenerate,
}: Props) {
  const memberCount = config.members.length;
  const slots = totalSlots(config);

  const goNext = () => {
    if (step.kind === 'size') {
      onStepChange({ kind: 'member', index: 0 });
      return;
    }
    if (step.kind === 'member') {
      if (step.index + 1 < memberCount) {
        onStepChange({ kind: 'member', index: step.index + 1 });
        return;
      }
      onStepChange({ kind: 'household' });
      return;
    }
    onGenerate();
  };

  const goBack = () => {
    if (step.kind === 'member') {
      if (step.index === 0) {
        onStepChange({ kind: 'size' });
        return;
      }
      onStepChange({ kind: 'member', index: step.index - 1 });
      return;
    }
    if (step.kind === 'household') {
      onStepChange({ kind: 'member', index: memberCount - 1 });
    }
  };

  const stepLabel =
    step.kind === 'size'
      ? 'Step 1 — Household size'
      : step.kind === 'member'
        ? 'Step ' +
          (step.index + 2) +
          ' — Counts for ' +
          config.members[step.index].label
        : 'Step ' + (memberCount + 2) + ' — Shared household items';

  return (
    <section className="wizard" data-testid="count-wizard">
      <h1>Family Emergency Handbook</h1>
      <p className="lede">
        First set how many people are in the household. Then enter account and
        asset counts for each person. Shared items (home, contacts, pets) come
        last. The printable PDF is sectioned per member.
      </p>
      <div className="note">
        Password blanks are for handwriting on paper after you print. Do not type
        real passwords into this web app.
      </div>

      <p className="summary" data-testid="wizard-step-label">
        {stepLabel}
      </p>

      {step.kind === 'size' ? (
        <>
          <div className="field" style={{ maxWidth: 280, marginBottom: 16 }}>
            <label htmlFor="member-count">Number of household members</label>
            <p className="help">Including you. Max 12.</p>
            <input
              id="member-count"
              data-testid="member-count-input"
              type="number"
              min={1}
              max={12}
              value={memberCount}
              onChange={(event) => {
                const size = clampCount(Number(event.target.value), 1, 12);
                onConfigChange({
                  ...config,
                  members: resizeMembers(config.members, size),
                });
              }}
            />
          </div>
          <h3 style={{ marginTop: 8 }}>Optional names (for PDF section titles)</h3>
          <div className="grid">
            {config.members.map((member, index) => (
              <div className="field" key={member.id}>
                <label htmlFor={'member-label-' + index}>
                  Member {index + 1} name
                </label>
                <p className="help">Leave blank to use Member {index + 1}</p>
                <input
                  id={'member-label-' + index}
                  data-testid={'member-label-' + index}
                  type="text"
                  value={member.label.startsWith('Member ') ? '' : member.label}
                  placeholder={'Member ' + (index + 1)}
                  onChange={(event) => {
                    const label = event.target.value;
                    const members = config.members.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            label: label.trim() || 'Member ' + (index + 1),
                          }
                        : item
                    );
                    onConfigChange({ ...config, members });
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {step.kind === 'member' ? (
        <CountGrid
          idPrefix={'m' + step.index}
          fields={MEMBER_COUNT_FIELDS}
          values={config.members[step.index].counts}
          onChange={(key, value) => {
            const members = config.members.map((member, index) =>
              index === step.index
                ? { ...member, counts: { ...member.counts, [key]: value } }
                : member
            );
            onConfigChange({ ...config, members });
          }}
        />
      ) : null}

      {step.kind === 'household' ? (
        <CountGrid
          idPrefix="hh"
          fields={HOUSEHOLD_COUNT_FIELDS}
          values={config.household}
          onChange={(key, value) => {
            onConfigChange({
              ...config,
              household: { ...config.household, [key]: value },
            });
          }}
        />
      ) : null}

      <div className="wizard-footer">
        <p className="summary" data-testid="slot-summary" data-total={slots}>
          About {slots} blank item slots across {memberCount} member
          {memberCount === 1 ? '' : 's'} + household sections.
        </p>
        <div className="toolbar-actions">
          {step.kind !== 'size' ? (
            <button type="button" onClick={goBack}>
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConfigChange(createDefaultConfig())}
            >
              Reset defaults
            </button>
          )}
          <button
            type="button"
            className="primary"
            data-testid="wizard-next"
            onClick={goNext}
          >
            {step.kind === 'household'
              ? 'Generate printable handbook'
              : 'Next'}
          </button>
        </div>
      </div>
    </section>
  );
}
