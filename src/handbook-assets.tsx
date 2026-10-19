import { BlankRows, CheckItem, Field, SectionTitle } from './handbook-parts';
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
          <Field id="cash-card" label="Main ATM / debit card location" />
          <Field id="cash-pin" label="ATM / debit PIN" secret />
          <Field id="cash-72h" label="How to get cash in first 72 hours" tall />
          <Field id="cash-stash" label="Emergency cash stash location (optional)" tall />
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
              <BlankRows count={hh.subscriptions} columns={5} idPrefix="subscriptions" />
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
              <BlankRows count={hh.pets} columns={5} idPrefix="pets" />
            </tbody>
          </table>
          <Field id="pets-caretaker" label="Who can take the pets in an emergency" />
          <Field id="pets-food" label="Food / supply location" />
        </section>
      ) : null}

      <section className="page-break">
        <SectionTitle title={label('actions') + '. If something happens — action plans'} />
        <h3>If someone is incapacitated</h3>
        <Field id="plan-authority" label="Who has medical decision authority" />
        <Field id="plan-calls" label="First three calls" tall />
        <Field id="plan-cards" label="Where to find insurance cards / meds list" />
        <h3>If someone dies</h3>
        <Field id="plan-notify" label="Who to notify first" tall />
        <Field id="plan-will" label="Where will / attorney contacts are" />
        <Field id="plan-employer" label="Employer / benefits to contact" />
        <Field id="plan-accounts" label="Accounts that need immediate attention" tall />
        <h3>House fire / evacuation</h3>
        <Field id="plan-meetup" label="Meetup location (near + far)" />
        <Field id="plan-gobag" label="Go-bag location" />
        <Field id="plan-grab" label="What to grab if there are 60 seconds" tall />
        <h3>Natural disaster / extended outage</h3>
        <Field id="plan-outoftown" label="Out-of-area contact" />
        <Field id="plan-supplies" label="Water / food / radio / cash plan" tall />
        <Field id="plan-services" label="Local emergency services notes" />
      </section>

      <section className="page-break">
        <SectionTitle title={label('notes') + '. Extra notes'} />
        <p className="lede">Space for anything that did not fit above. The app does not keep this after you close the tab.</p>
        <Field id="notes-1" label="Notes" xTall />
        <Field id="notes-2" label="" xTall />
        <Field id="notes-3" label="" xTall />
        <Field id="notes-4" label="" xTall />
        <ul className="checklist">
          <CheckItem id="review-nominees" label="Beneficiaries / nominees reviewed" />
          <CheckItem id="review-contacts" label="Emergency contacts still correct" />
          <CheckItem id="review-members" label="Each member section still accurate" />
          <CheckItem id="review-keeper" label="Trusted person still knows where this book is" />
          <CheckItem id="review-date" label="Date on cover updated" />
        </ul>
      </section>
    </>
  );
}
