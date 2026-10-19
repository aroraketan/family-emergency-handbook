type StepperProps = {
  items: { label: string }[];
  current: number;
  onSelect: (index: number) => void;
  label?: string;
};

export function Stepper({
  items,
  current,
  onSelect,
  label = 'Steps',
}: StepperProps) {
  return (
    <nav aria-label={label} className="stepper-nav" data-testid="stepper">
      <ol className="stepper">
        {items.map((item, index) => {
          const state =
            index < current ? 'done' : index === current ? 'current' : 'upcoming';
          return (
            <li className={'stepper-item ' + state} key={index}>
              <button
                type="button"
                aria-current={state === 'current' ? 'step' : undefined}
                data-testid={'stepper-step-' + index}
                onClick={() => onSelect(index)}
              >
                <span className="stepper-dot">
                  {state === 'done' ? '✓' : index + 1}
                </span>
                <span className="stepper-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
