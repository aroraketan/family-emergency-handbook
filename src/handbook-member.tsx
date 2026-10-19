import {
  BlankRows,
  EmployerBlock,
  Field,
  PersonBlock,
  SectionTitle,
} from './handbook-parts';
import type { MemberProfile } from './types';

type Props = {
  member: MemberProfile;
  memberIndex: number;
  sectionNumber: number;
};

export function HandbookMemberSection({
  member,
  memberIndex,
  sectionNumber,
}: Props) {
  const c = member.counts;
  const employers = Array.from({ length: c.employers }, (_, i) => i + 1);
  const title = sectionNumber + '. ' + member.label;

  return (
    <section className="page-break" data-testid={'member-section-' + memberIndex}>
      <SectionTitle title={title} />
      <p className="lede">
        Personal details, documents, accounts, and passwords for this person.
        Handwrite on the printed master only.
      </p>

      <PersonBlock index={memberIndex + 1} headingOverride={member.label} />

      <h3>Identity documents</h3>
      <table>
        <thead>
          <tr>
            <th>Document</th>
            <th>Number (optional)</th>
            <th>Physical location</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Passport</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>Driver license / ID</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>Birth certificate</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>Aadhaar</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>PAN</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>Other</td>
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>

      {c.medications > 0 ? (
        <>
          <h3>
            Medications
            <span className="count-pill">({c.medications})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dose / schedule</th>
                <th>Pharmacy</th>
                <th>Prescriber</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.medications} columns={4} />
            </tbody>
          </table>
        </>
      ) : null}

      {c.bankAccounts > 0 ? (
        <>
          <h3>
            Bank accounts
            <span className="count-pill">({c.bankAccounts})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Institution</th>
                <th>Account type</th>
                <th>Account ending / nickname</th>
                <th>Username / customer ID</th>
                <th>Password / PIN</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.bankAccounts} columns={5} />
            </tbody>
          </table>
        </>
      ) : null}

      {c.creditCards > 0 ? (
        <>
          <h3>
            Credit / debit cards
            <span className="count-pill">({c.creditCards})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Issuer</th>
                <th>Card nickname / last 4</th>
                <th>PIN</th>
                <th>Phone to report lost</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.creditCards} columns={4} />
            </tbody>
          </table>
        </>
      ) : null}

      {c.fixedDeposits > 0 ? (
        <>
          <h3>
            Fixed deposits (FDs)
            <span className="count-pill">({c.fixedDeposits})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>FD / receipt #</th>
                <th>Amount / tenure hint</th>
                <th>Maturity date</th>
                <th>Portal password</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.fixedDeposits} columns={5} />
            </tbody>
          </table>
        </>
      ) : null}

      {c.investments > 0 ? (
        <>
          <h3>
            Investments / retirement
            <span className="count-pill">({c.investments})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Institution / plan</th>
                <th>Type</th>
                <th>Account / username</th>
                <th>Password</th>
                <th>Nominee noted?</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.investments} columns={5} />
            </tbody>
          </table>
          <h3>Crypto / digital assets (if any)</h3>
          <div className="row-2">
            <Field label="Exchange — username / email" />
            <Field label="Exchange — password (handwrite)" />
          </div>
          <Field label="Hardware wallet location" />
          <Field label="Seed phrase / recovery words (handwrite)" xTall />
        </>
      ) : null}

      {c.insurancePolicies > 0 ? (
        <>
          <h3>
            Insurance
            <span className="count-pill">({c.insurancePolicies})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Company</th>
                <th>Policy #</th>
                <th>Agent / phone</th>
                <th>Docs location</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.insurancePolicies} columns={5} />
            </tbody>
          </table>
          <Field label="Life insurance nominees" tall />
        </>
      ) : null}

      {c.loans > 0 ? (
        <>
          <h3>
            Loans / debts
            <span className="count-pill">({c.loans})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Lender</th>
                <th>Type</th>
                <th>Account hint</th>
                <th>Approx. payment</th>
                <th>Due day</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.loans} columns={5} />
            </tbody>
          </table>
        </>
      ) : null}

      <h3>Core digital access</h3>
      <div className="note">
        Handwrite passwords on the printed master. Do not type them into the app.
      </div>
      <div className="row-2">
        <Field label="Password manager — product" />
        <Field label="Password manager master password" />
        <Field label="Primary email + password" tall />
        <Field label="Recovery email / phone" />
        <Field label="Apple ID / iCloud + password" tall />
        <Field label="Google account + password" tall />
        <Field label="Phone unlock PIN / passcode" />
        <Field label="SIM PIN / PUK" />
      </div>

      {c.digitalAccounts > 0 ? (
        <>
          <h3>
            Other important logins
            <span className="count-pill">({c.digitalAccounts})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Username / email</th>
                <th>Password</th>
                <th>2FA / backup codes</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={c.digitalAccounts} columns={4} />
            </tbody>
          </table>
        </>
      ) : null}

      {c.employers > 0 ? (
        <>
          <h3>
            Work / income
            <span className="count-pill">({c.employers})</span>
          </h3>
          {employers.map((n) => (
            <EmployerBlock key={n} index={n} />
          ))}
        </>
      ) : null}
    </section>
  );
}
