import {
  BlankRows,
  DetailInput,
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

const IDENTITY_DOCS = [
  'Passport',
  'Driver license / ID',
  'Birth certificate',
  'Aadhaar',
  'PAN',
];

function docSlug(label: string): string {
  return label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
}

export function HandbookMemberSection({
  member,
  memberIndex,
  sectionNumber,
}: Props) {
  const c = member.counts;
  const employers = Array.from({ length: c.employers }, (_, i) => i + 1);
  const title = sectionNumber + '. ' + member.label;
  const memberKey = 'member-' + memberIndex;

  return (
    <section className="page-break" data-testid={'member-section-' + memberIndex}>
      <SectionTitle title={title} />
      <p className="lede">
        Personal details, documents, accounts, and passwords for this person.
        What you type is included when you print. The app does not keep a copy after you close the tab.
      </p>
      <div className="note">
        Typing passwords and PINs is allowed, but not recommended. Prefer writing
        those on the printed page.
      </div>

      <PersonBlock idPrefix={memberKey + '-person'} headingOverride={member.label} />

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
          {IDENTITY_DOCS.map((doc) => {
            const slug = docSlug(doc);
            return (
              <tr key={slug}>
                <td>{doc}</td>
                <td>
                  <DetailInput id={memberKey + '-doc-' + slug + '-number'} plain />
                </td>
                <td>
                  <DetailInput id={memberKey + '-doc-' + slug + '-location'} plain />
                </td>
                <td>
                  <DetailInput id={memberKey + '-doc-' + slug + '-notes'} plain />
                </td>
              </tr>
            );
          })}
          {[0, 1, 2].map((index) => (
            <tr key={'adhoc-' + index}>
              <td>
                <DetailInput id={memberKey + '-doc-adhoc-' + index + '-name'} plain />
              </td>
              <td>
                <DetailInput id={memberKey + '-doc-adhoc-' + index + '-number'} plain />
              </td>
              <td>
                <DetailInput id={memberKey + '-doc-adhoc-' + index + '-location'} plain />
              </td>
              <td>
                <DetailInput id={memberKey + '-doc-adhoc-' + index + '-notes'} plain />
              </td>
            </tr>
          ))}
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
              <BlankRows count={c.medications} columns={4} idPrefix={memberKey + '-meds'} />
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
                <th>Password / App PIN</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows
                count={c.bankAccounts}
                columns={5}
                idPrefix={memberKey + '-banks'}
                secretColumns={[4]}
              />
            </tbody>
          </table>
        </>
      ) : null}

      {c.debitCards > 0 ? (
        <>
          <h3>
            Debit cards
            <span className="count-pill">({c.debitCards})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Card nickname / last 4</th>
                <th>PIN</th>
                <th>Phone to report lost</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows
                count={c.debitCards}
                columns={4}
                idPrefix={memberKey + '-debit'}
                secretColumns={[2]}
              />
            </tbody>
          </table>
        </>
      ) : null}

      {c.creditCards > 0 ? (
        <>
          <h3>
            Credit cards
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
              <BlankRows
                count={c.creditCards}
                columns={4}
                idPrefix={memberKey + '-cards'}
                secretColumns={[2]}
              />
            </tbody>
          </table>
        </>
      ) : null}

      {c.appPins > 0 ? (
        <>
          <h3>
            App PINs
            <span className="count-pill">({c.appPins})</span>
          </h3>
          <table>
            <thead>
              <tr>
                <th>App</th>
                <th>App PIN</th>
                <th>Used for</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows
                count={c.appPins}
                columns={3}
                idPrefix={memberKey + '-app-pins'}
                secretColumns={[1]}
              />
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
              <BlankRows
                count={c.fixedDeposits}
                columns={5}
                idPrefix={memberKey + '-fds'}
                secretColumns={[4]}
              />
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
              <BlankRows
                count={c.investments}
                columns={5}
                idPrefix={memberKey + '-investments'}
                secretColumns={[3]}
              />
            </tbody>
          </table>
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
              <BlankRows
                count={c.insurancePolicies}
                columns={5}
                idPrefix={memberKey + '-insurance'}
              />
            </tbody>
          </table>
          <Field id={memberKey + '-nominees'} label="Life insurance nominees" tall />
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
              <BlankRows count={c.loans} columns={5} idPrefix={memberKey + '-loans'} />
            </tbody>
          </table>
        </>
      ) : null}

      <h3>Core digital access</h3>
      <div className="note">
        Typing these passwords and PINs is allowed, but not recommended.
      </div>
      <div className="row-2">
        <Field id={memberKey + '-pm-product'} label="Password manager — product" />
        <Field id={memberKey + '-pm-master'} label="Password manager master password" secret />
        <Field id={memberKey + '-email-login'} label="Primary email + password" tall secret />
        <Field id={memberKey + '-recovery'} label="Recovery email / phone" />
        <Field id={memberKey + '-apple'} label="Apple ID / iCloud + password" tall secret />
        <Field id={memberKey + '-google'} label="Google account + password" tall secret />
        <Field id={memberKey + '-phone-pin'} label="Phone unlock PIN / passcode" secret />
        <Field id={memberKey + '-sim'} label="SIM PIN / PUK" secret />
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
              <BlankRows
                count={c.digitalAccounts}
                columns={4}
                idPrefix={memberKey + '-logins'}
                secretColumns={[2, 3]}
              />
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
            <EmployerBlock key={n} index={n} idPrefix={memberKey + '-job-' + n} />
          ))}
        </>
      ) : null}
    </section>
  );
}
