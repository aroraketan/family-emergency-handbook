import {
  BlankRows,
  Field,
  NumberedBlankRows,
  PropertyBlock,
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
  const showHome = hh.properties > 0;

  const memberFlags: Record<string, boolean> = { howTo: true };
  config.members.forEach((_, index) => {
    memberFlags['member' + index] = true;
  });
  memberFlags.contacts = showContacts;
  memberFlags.medical = true;
  memberFlags.home = showHome;
  memberFlags.vehicles = showVehicles;
  memberFlags.legal = true;

  const section = createSectionNumbers(memberFlags);
  const vehicles = Array.from({ length: hh.vehicles }, (_, i) => i + 1);
  const properties = Array.from({ length: hh.properties }, (_, i) => i + 1);

  return (
    <>
      <section className="cover">
        <div>
          <div className="cover-mark">Private · Offline · Family use only</div>
          <h1>Family Emergency Handbook</h1>
          <p className="subtitle">
            Fill the fields, then print. Details stay in this open tab only.
            Store the paper copy securely. Do not email or cloud-sync a filled
            copy.
          </p>
          <div className="cover-box">
            <div className="row-2">
              <Field id="cover-family" label="Household / family name" />
              <Field id="cover-updated" label="Date last updated" />
              <Field id="cover-keeper" label="Primary keeper of this book" />
              <Field id="cover-secondary" label="Secondary person who knows location" />
            </div>
            <Field id="cover-storage" label="Physical storage location" />
          </div>
        </div>
        <div className="cover-foot">
          Typed details exist only until you refresh, close this tab, or choose
          Reset, which clears the household setup and returns to the start. Print
          the paper master and keep that offline. Do not
          email or cloud-sync a completed copy.
        </div>
      </section>

      <section className="page-break">
        <SectionTitle title={section.howTo + '. How to use this book'} />
        <ul className="checklist">
          <li>
            <span className="box" />
            <span>
              Type details in the fields. Passwords and PINs may be typed, but writing
              them on the printed page is preferable. Nothing is saved.
            </span>
          </li>
          <li>
            <span className="box" />
            <span>Each member has their own section for docs, accounts, and passwords.</span>
          </li>
          <li>
            <span className="box" />
            <span>Print the paper master, then clear this page or close the tab.</span>
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
                    idPrefix="contacts-priority"
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
                  <BlankRows count={hh.neighbors} columns={4} idPrefix="contacts-neighbors" />
                </tbody>
              </table>
            </>
          ) : null}
          <h3>Professionals</h3>
          <div className="row-2">
            <Field id="pro-attorney" label="Family attorney — name" />
            <Field id="pro-attorney-phone" label="Phone / email" />
            <Field id="pro-accountant" label="Accountant / tax preparer" />
            <Field id="pro-accountant-phone" label="Phone / email" />
            <Field id="pro-advisor" label="Financial advisor" />
            <Field id="pro-advisor-phone" label="Phone / email" />
            <Field id="pro-agent" label="Insurance agent" />
            <Field id="pro-agent-phone" label="Phone / email" />
          </div>
        </section>
      ) : null}

      <section className="page-break">
        <SectionTitle title={section.medical + '. Shared medical info'} />
        <div className="row-2">
          <Field id="med-hospital" label="Preferred hospital" />
          <Field id="med-pharmacy" label="Preferred pharmacy" />
          <Field id="med-doctor" label="Primary care doctor" />
          <Field id="med-doctor-phone" label="Phone" />
          <Field id="med-plan" label="Family health insurance plan" />
          <Field id="med-plan-id" label="Member / policy ID location" />
        </div>
        <h3>Advance care</h3>
        <div className="row-2">
          <Field id="med-proxy" label="Healthcare proxy / agent" />
          <Field id="med-proxy-phone" label="Phone" />
          <Field id="med-directive" label="Living will / advance directive location" />
          <Field id="med-donor" label="Organ donor notes" />
        </div>
      </section>

      {showHome ? (
      <section className="page-break">
        <SectionTitle
          title={section.home + '. Home and property'}
          count={hh.properties > 0 ? hh.properties : undefined}
        />
        {properties.map((n) => (
          <PropertyBlock key={n} index={n} utilityCount={hh.utilities} />
        ))}
      </section>
      ) : null}

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
          <Field id="legal-marriage" label="Marriage / partnership certificate location" />
          <Field id="legal-will" label="Will — location" />
          <Field id="legal-executor" label="Executor name + phone" />
          <Field id="legal-trust" label="Trust — location / trustee" />
          <Field id="legal-poa" label="Power of attorney — location / agent" />
          <Field id="legal-box" label="Safe deposit box — bank + box #" />
          <Field id="legal-box-keys" label="Safe deposit keys location" />
          <Field id="legal-attorney" label="Attorney who holds copies" />
        </div>
        <Field id="legal-funeral" label="Funeral / burial preferences (optional)" tall />
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
    (hh.properties > 0 ? 1 : 0) + // home, including each property's utilities
    (hh.vehicles > 0 ? 1 : 0) +
    1 // legal
  );
}
