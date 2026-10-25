import type { ChangeEvent } from 'react';
import { useHandbookStore } from './store';

const quietInput = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  'data-1p-ignore': 'true',
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const;

export function DetailInput({
  id,
  tall,
  xTall,
  plain,
  secret,
}: {
  id: string;
  tall?: boolean;
  xTall?: boolean;
  plain?: boolean;
  secret?: boolean;
}) {
  const { data, setField } = useHandbookStore();
  const className = [
    'fill',
    tall ? 'tall' : '',
    xTall ? 'x-tall' : '',
    plain ? 'plain' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setField(id, event.target.value, { secret });
  };

  if (tall || xTall || plain) {
    return (
      <textarea
        {...quietInput}
        id={id}
        className={className}
        rows={xTall ? 4 : tall ? 2 : 1}
        value={data.fields[id] ?? ''}
        onChange={onChange}
      />
    );
  }

  return (
    <input
      {...quietInput}
      id={id}
      className={className}
      type="text"
      value={data.fields[id] ?? ''}
      onChange={onChange}
    />
  );
}

export function Field({
  id,
  label,
  tall,
  xTall,
  secret,
}: {
  id: string;
  label: string;
  tall?: boolean;
  xTall?: boolean;
  secret?: boolean;
}) {
  return (
    <div className="field-block">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <DetailInput id={id} tall={tall} xTall={xTall} secret={secret} />
    </div>
  );
}

export function BlankRows({
  count,
  columns,
  idPrefix,
  secretColumns,
}: {
  count: number;
  columns: number;
  idPrefix: string;
  secretColumns?: number[];
}) {
  const rows = Array.from({ length: Math.max(0, count) }, (_, index) => index);
  return (
    <>
      {rows.map((row) => (
        <tr key={row}>
          {Array.from({ length: columns }, (_, col) => (
            <td key={col}>
              <DetailInput
                id={idPrefix + '-' + row + '-' + col}
                plain
                secret={secretColumns?.includes(col)}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function NumberedBlankRows({
  count,
  columnsAfterNumber,
  idPrefix,
}: {
  count: number;
  columnsAfterNumber: number;
  idPrefix: string;
}) {
  const rows = Array.from({ length: Math.max(0, count) }, (_, index) => index + 1);
  return (
    <>
      {rows.map((n) => (
        <tr key={n}>
          <td>{n}</td>
          {Array.from({ length: columnsAfterNumber }, (_, col) => (
            <td key={col}>
              <DetailInput id={idPrefix + '-' + n + '-' + col} plain />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function PersonBlock({
  idPrefix,
  headingOverride,
}: {
  idPrefix: string;
  headingOverride: string;
}) {
  return (
    <div className="avoid-break">
      <h3>{headingOverride}</h3>
      <div className="row-2">
        <Field id={idPrefix + '-legal-name'} label="Full legal name" />
        <Field id={idPrefix + '-preferred-name'} label="Preferred name" />
      </div>
      <div className="row-3">
        <Field id={idPrefix + '-dob'} label="Date of birth" />
        <Field id={idPrefix + '-blood'} label="Blood type" />
        <Field id={idPrefix + '-relationship'} label="Relationship" />
      </div>
      <div className="row-2">
        <Field id={idPrefix + '-phone'} label="Phone" />
        <Field id={idPrefix + '-email'} label="Email" />
      </div>
      <Field id={idPrefix + '-allergies'} label="Allergies / critical conditions" tall />
      <Field id={idPrefix + '-employer'} label="Employer / school" />
    </div>
  );
}

export function PropertyBlock({ index }: { index: number }) {
  const id = (suffix: string) =>
    index === 1 ? 'home-' + suffix : 'home-property-' + index + '-' + suffix;
  return (
    <div className="avoid-break">
      <h3>{index === 1 ? 'Property 1 — primary residence' : 'Property ' + index}</h3>
      <Field id={id('address')} label="Address" />
      <div className="row-2">
        <Field id={id('own')} label="Own / rent" />
        <Field id={id('landlord')} label="Landlord / HOA / property mgmt" />
        <Field id={id('landlord-phone')} label="Landlord / HOA phone" />
        <Field id={id('mortgage')} label="Mortgage lender / servicer" />
        <Field id={id('spare-key')} label="Spare key location" />
        <Field id={id('other-keys')} label="Who else has a key" />
        <Field id={id('alarm-vendor')} label="Alarm / smart lock — vendor" />
        <Field id={id('alarm-code')} label="Alarm / door code" secret />
        <Field id={id('safe')} label="Safe / lockbox location" />
        <Field id={id('safe-code')} label="Safe combo / key code" secret />
        <Field id={id('wifi')} label="Wi-Fi network name (SSID)" />
        <Field id={id('wifi-password')} label="Wi-Fi password" secret />
      </div>
    </div>
  );
}

export function VehicleBlock({ index }: { index: number }) {
  const idPrefix = 'vehicle-' + index;
  return (
    <div className="avoid-break">
      <h3>Vehicle {index}</h3>
      <div className="row-3">
        <Field id={idPrefix + '-ymm'} label="Year / make / model" />
        <Field id={idPrefix + '-color'} label="Color" />
        <Field id={idPrefix + '-plate'} label="Plate #" />
      </div>
      <div className="row-2">
        <Field id={idPrefix + '-vin'} label="VIN" />
        <Field id={idPrefix + '-registration'} label="Registration / title location" />
        <Field id={idPrefix + '-insurer'} label="Insurer + policy #" />
        <Field id={idPrefix + '-keys'} label="Keys / spare location" />
        <Field id={idPrefix + '-lender'} label="Loan / lease lender" />
        <Field id={idPrefix + '-roadside'} label="Roadside assistance #" />
      </div>
    </div>
  );
}

export function EmployerBlock({
  index,
  idPrefix,
}: {
  index: number;
  idPrefix: string;
}) {
  return (
    <div className="avoid-break">
      <h3>Job / income source {index}</h3>
      <div className="row-2">
        <Field id={idPrefix + '-employer'} label="Employer / business" />
        <Field id={idPrefix + '-person'} label="Employee / person" />
        <Field id={idPrefix + '-hr'} label="HR / benefits contact" />
        <Field id={idPrefix + '-manager'} label="Manager / emergency work contact" />
        <Field id={idPrefix + '-deposit'} label="Direct deposit bank (nickname)" />
        <Field id={idPrefix + '-portal'} label="Benefits portal login hint" />
      </div>
    </div>
  );
}

export function CheckItem({ id, label }: { id: string; label: string }) {
  const { data, setField } = useHandbookStore();
  return (
    <li>
      <input
        {...quietInput}
        id={id}
        className="check"
        type="checkbox"
        checked={data.fields[id] === 'yes'}
        onChange={(event) => setField(id, event.target.checked ? 'yes' : '')}
      />
      <label htmlFor={id}>{label}</label>
    </li>
  );
}

export function SectionTitle({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <h2>
      {title}
      {typeof count === 'number' ? (
        <span className="count-pill">({count})</span>
      ) : null}
    </h2>
  );
}
