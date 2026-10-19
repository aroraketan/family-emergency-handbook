import { BlankRows, Field, SectionTitle } from './handbook-parts';
import { countLifeSections } from './handbook-life';
import { createSectionNumbers } from './section-numbers';
import type { HandbookConfig } from './types';

export function HandbookAssetSections({ config }: { config: HandbookConfig }) {
  const hh = config.household;
  const showSubscriptions = hh.subscriptions > 0;
  const showPets = hh.pets > 0;
  const lifeVisible = countLifeSections(config);

  const section = createSectionNumbers({
    cash: true,
    subscriptions: showSubscriptions,
    pets: showPets,
    actions: true,
    notes: true,
  });

  const label = (key: keyof typeof section) => lifeVisible + section[key];

  return (
    <>
      <section className="page-break">
        <SectionTitle title={label('cash') + '. Cash access (household)'} />
        <div className="row-2">
          <Field label="Main ATM / debit card location" />
          <Field label="ATM / debit PIN (handwrite)" />
          <Field label="How to get cash in first 72 hours" tall />
          <Field label="Emergency cash stash location (optional)" tall />
        </div>
      </section>

      {showSubscriptions ? (
        <section className="page-break">
          <SectionTitle
            title={label('subscriptions') + '. Household subscriptions'}
            count={hh.subscriptions}
          />
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Account email</th>
                <th>Cost / cycle</th>
                <th>Cancel how</th>
                <th>Keep?</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={hh.subscriptions} columns={5} />
            </tbody>
          </table>
        </section>
      ) : null}

      {showPets ? (
        <section className="page-break">
          <SectionTitle title={label('pets') + '. Pets'} count={hh.pets} />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type / breed</th>
                <th>Microchip #</th>
                <th>Vet + phone</th>
                <th>Meds / care notes</th>
              </tr>
            </thead>
            <tbody>
              <BlankRows count={hh.pets} columns={5} />
            </tbody>
          </table>
          <Field label="Who can take the pets in an emergency" />
          <Field label="Food / supply location" />
        </section>
      ) : null}

      <section className="page-break">
        <SectionTitle title={label('actions') + '. If something happens — action plans'} />
        <h3>If someone is incapacitated</h3>
        <Field label="Who has medical decision authority" />
        <Field label="First three calls" tall />
        <Field label="Where to find insurance cards / meds list" />
        <h3>If someone dies</h3>
        <Field label="Who to notify first" tall />
        <Field label="Where will / attorney contacts are" />
        <Field label="Employer / benefits to contact" />
        <Field label="Accounts that need immediate attention" tall />
        <h3>House fire / evacuation</h3>
        <Field label="Meetup location (near + far)" />
        <Field label="Go-bag location" />
        <Field label="What to grab if there are 60 seconds" tall />
        <h3>Natural disaster / extended outage</h3>
        <Field label="Out-of-area contact" />
        <Field label="Water / food / radio / cash plan" tall />
        <Field label="Local emergency services notes" />
      </section>

      <section className="page-break">
        <SectionTitle title={label('notes') + '. Extra notes'} />
        <p className="lede">Blank space for anything that did not fit above.</p>
        <Field label="Notes" xTall />
        <Field label="" xTall />
        <Field label="" xTall />
        <Field label="" xTall />
        <ul className="checklist">
          <li>
            <span className="box" />
            <span>Beneficiaries / nominees reviewed</span>
          </li>
          <li>
            <span className="box" />
            <span>Emergency contacts still correct</span>
          </li>
          <li>
            <span className="box" />
            <span>Each member section still accurate</span>
          </li>
          <li>
            <span className="box" />
            <span>Trusted person still knows where this book is</span>
          </li>
          <li>
            <span className="box" />
            <span>Date on cover updated</span>
          </li>
        </ul>
      </section>
    </>
  );
}
