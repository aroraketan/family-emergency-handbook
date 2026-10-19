import {
  BlankRows,
  Field,
  NumberedBlankRows,
  SectionTitle,
  VehicleBlock,
} from './handbook-parts';
import { HandbookMemberSection } from './handbook-member';
import { createSectionNumbers } from './section-numbers';
import type { HandbookConfig } from './types';

export function HandbookLifeSections({ config }: { config: HandbookConfig }) {
  const hh = config.household;
  const showContacts = hh.emergencyContacts > 0 || hh.neighbors > 0;
  const showVehicles = hh.vehicles > 0;

  const memberFlags: Record<string, boolean> = { howTo: true };
  config.members.forEach((_, index) => {
    memberFlags['member' + index] = true;
  });
  memberFlags.contacts = showContacts;
  memberFlags.medical = true;
  memberFlags.home = true;
  memberFlags.vehicles = showVehicles;
  memberFlags.legal = true;

  const section = createSectionNumbers(memberFlags);
  const vehicles = Array.from({ length: hh.vehicles }, (_, i) => i + 1);

  return (
    <>
      <section className="cover">
        <div>
          <div className="cover-mark">Private · Offline · Family use only</div>
          <h1>Family Emergency Handbook</h1>
          <p className="subtitle">
            Blank fill-in template sectioned by household member. Write details
            by hand. Store in a secure place. Do not email or cloud-sync a filled
            copy.
          </p>
          <div className="cover-box">
            <div className="row-2">
              <Field label="Household / family name" />
              <Field label="Date last updated" />
              <Field label="Primary keeper of this book" />
              <Field label="Secondary person who knows location" />
            </div>
            <Field label="Physical storage location" />
          </div>
        </div>
        <div className="cover-foot">
          This master copy is meant for a secure offline location. You may write
          passwords, PINs, and recovery codes by hand on these pages. Never type
          them into the web app, never photograph a filled page, and never email
          or cloud-sync a completed copy.
        </div>
      </section>

      <section className="page-break">
        <SectionTitle title={section.howTo + '. How to use this book'} />
        <ul className="checklist">
          <li>
            <span className="box" />
            <span>Print on paper (prefer ink on paper for the master copy).</span>
          </li>
          <li>
            <span className="box" />
            <span>Each member has their own section for docs, accounts, and passwords.</span>
          </li>
          <li>
            <span className="box" />
            <span>Fill blanks in pen after printing. Update the cover date after changes.</span>
          </li>
          <li>
            <span className="box" />
            <span>Store only the paper master securely. Do not keep a filled PDF in the cloud.</span>
          </li>
        </ul>
      </section>

      {config.members.map((member, index) => (
        <HandbookMemberSection
          key={member.id}
          member={member}
          memberIndex={index}
          sectionNumber={section['member' + index]}
        />
      ))}

      {showContacts ? (
        <section className="page-break">
          <SectionTitle title={section.contacts + '. Emergency contacts'} />
          {hh.emergencyContacts > 0 ? (
            <>
              <h3>
                Call first (priority order)
                <span className="count-pill">({hh.emergencyContacts})</span>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Phone</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <NumberedBlankRows
                    count={hh.emergencyContacts}
                    columnsAfterNumber={4}
                  />
                </tbody>
              </table>
            </>
          ) : null}
          {hh.neighbors > 0 ? (
            <>
              <h3>
                Neighbors / local help
                <span className="count-pill">({hh.neighbors})</span>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address / apt</th>
                    <th>Phone</th>
                    <th>Has spare key?</th>
                  </tr>
                </thead>
                <tbody>
                  <BlankRows count={hh.neighbors} columns={4} />
                </tbody>
              </table>
            </>
          ) : null}
          <h3>Professionals</h3>
          <div className="row-2">
            <Field label="Family attorney — name" />
            <Field label="Phone / email" />
            <Field label="Accountant / tax preparer" />
            <Field label="Phone / email" />
            <Field label="Financial advisor" />
            <Field label="Phone / email" />
            <Field label="Insurance agent" />
            <Field label="Phone / email" />
          </div>
        </section>
      ) : null}

      <section className="page-break">
        <SectionTitle title={section.medical + '. Shared medical info'} />
        <div className="row-2">
          <Field label="Preferred hospital" />
          <Field label="Preferred pharmacy" />
          <Field label="Primary care doctor" />
          <Field label="Phone" />
          <Field label="Family health insurance plan" />
          <Field label="Member / policy ID location" />
        </div>
        <h3>Advance care</h3>
        <div className="row-2">
          <Field label="Healthcare proxy / agent" />
          <Field label="Phone" />
          <Field label="Living will / advance directive location" />
          <Field label="Organ donor notes" />
        </div>
      </section>

      <section className="page-break">
        <SectionTitle title={section.home + '. Home and property'} />
        <Field label="Primary residence address" />
        <div className="row-2">
          <Field label="Own / rent" />
          <Field label="Landlord / HOA / property mgmt" />
          <Field label="Landlord / HOA phone" />
          <Field label="Mortgage lender / servicer" />
          <Field label="Spare key location" />
          <Field label="Who else has a key" />
          <Field label="Alarm / smart lock — vendor" />
          <Field label="Alarm / door code (handwrite)" />
          <Field label="Safe / lockbox location" />
          <Field label="Safe combo / key code (handwrite)" />
          <Field label="Wi-Fi network name (SSID)" />
          <Field label="Wi-Fi password (handwrite)" />
        </div>
        {hh.utilities > 0 ? (
          <>
            <h3>
              Utilities and services
              <span className="count-pill">({hh.utilities})</span>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Company</th>
                  <th>Account # / username</th>
                  <th>Password (handwrite)</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                <BlankRows count={hh.utilities} columns={5} />
              </tbody>
            </table>
          </>
        ) : null}
        <Field label="Other property (second home / land / docs location)" tall />
      </section>

      {showVehicles ? (
        <section className="page-break">
          <SectionTitle
            title={section.vehicles + '. Vehicles'}
            count={hh.vehicles}
          />
          {vehicles.map((n) => (
            <VehicleBlock key={n} index={n} />
          ))}
        </section>
      ) : null}

      <section className="page-break">
        <SectionTitle title={section.legal + '. Estate and shared legal'} />
        <div className="row-2">
          <Field label="Marriage / partnership certificate location" />
          <Field label="Will — location" />
          <Field label="Executor name + phone" />
          <Field label="Trust — location / trustee" />
          <Field label="Power of attorney — location / agent" />
          <Field label="Safe deposit box — bank + box #" />
          <Field label="Safe deposit keys location" />
          <Field label="Attorney who holds copies" />
        </div>
        <Field label="Funeral / burial preferences (optional)" tall />
      </section>
    </>
  );
}

/** How many numbered sections HandbookLifeSections emits (for asset offset). */
export function countLifeSections(config: HandbookConfig): number {
  const hh = config.household;
  return (
    1 + // how to
    config.members.length +
    (hh.emergencyContacts > 0 || hh.neighbors > 0 ? 1 : 0) +
    1 + // medical
    1 + // home
    (hh.vehicles > 0 ? 1 : 0) +
    1 // legal
  );
}
