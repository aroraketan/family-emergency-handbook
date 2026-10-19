
export function Line({ tall, xTall }: { tall?: boolean; xTall?: boolean }) {
  const className = xTall ? 'line x-tall' : tall ? 'line tall' : 'line';
  return <div className={className} />;
}

export function Field({
  label,
  tall,
  xTall,
}: {
  label: string;
  tall?: boolean;
  xTall?: boolean;
}) {
  return (
    <div className="field-block">
      <label>{label}</label>
      <Line tall={tall} xTall={xTall} />
    </div>
  );
}

export function BlankRows({
  count,
  columns,
}: {
  count: number;
  columns: number;
}) {
  const rows = Array.from({ length: Math.max(0, count) }, (_, index) => index);
  return (
    <>
      {rows.map((row) => (
        <tr key={row}>
          {Array.from({ length: columns }, (_, col) => (
            <td key={col} />
          ))}
        </tr>
      ))}
    </>
  );
}

export function NumberedBlankRows({
  count,
  columnsAfterNumber,
}: {
  count: number;
  columnsAfterNumber: number;
}) {
  const rows = Array.from({ length: Math.max(0, count) }, (_, index) => index + 1);
  return (
    <>
      {rows.map((n) => (
        <tr key={n}>
          <td>{n}</td>
          {Array.from({ length: columnsAfterNumber }, (_, col) => (
            <td key={col} />
          ))}
        </tr>
      ))}
    </>
  );
}

export function PersonBlock({
  index,
  headingOverride,
}: {
  index: number;
  headingOverride?: string;
}) {
  return (
    <div className="avoid-break">
      <h3>{headingOverride || 'Person ' + index}</h3>
      <div className="row-2">
        <Field label="Full legal name" />
        <Field label="Preferred name" />
      </div>
      <div className="row-3">
        <Field label="Date of birth" />
        <Field label="Blood type" />
        <Field label="Relationship" />
      </div>
      <div className="row-2">
        <Field label="Phone" />
        <Field label="Email" />
      </div>
      <Field label="Allergies / critical conditions" tall />
      <Field label="Employer / school" />
    </div>
  );
}

export function VehicleBlock({ index }: { index: number }) {
  return (
    <div className="avoid-break">
      <h3>Vehicle {index}</h3>
      <div className="row-3">
        <Field label="Year / make / model" />
        <Field label="Color" />
        <Field label="Plate #" />
      </div>
      <div className="row-2">
        <Field label="VIN" />
        <Field label="Registration / title location" />
        <Field label="Insurer + policy #" />
        <Field label="Keys / spare location" />
        <Field label="Loan / lease lender" />
        <Field label="Roadside assistance #" />
      </div>
    </div>
  );
}

export function EmployerBlock({ index }: { index: number }) {
  return (
    <div className="avoid-break">
      <h3>Job / income source {index}</h3>
      <div className="row-2">
        <Field label="Employer / business" />
        <Field label="Employee / person" />
        <Field label="HR / benefits contact" />
        <Field label="Manager / emergency work contact" />
        <Field label="Direct deposit bank (nickname)" />
        <Field label="Benefits portal login hint" />
      </div>
    </div>
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
