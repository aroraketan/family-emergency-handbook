export type MemberCountKey =
  | 'bankAccounts'
  | 'creditCards'
  | 'fixedDeposits'
  | 'investments'
  | 'insurancePolicies'
  | 'loans'
  | 'digitalAccounts'
  | 'medications'
  | 'employers';

export type HouseholdCountKey =
  | 'emergencyContacts'
  | 'neighbors'
  | 'vehicles'
  | 'utilities'
  | 'subscriptions'
  | 'pets';

export type MemberCounts = Record<MemberCountKey, number>;
export type HouseholdCounts = Record<HouseholdCountKey, number>;

export type MemberProfile = {
  id: string;
  label: string;
  counts: MemberCounts;
};

export type HandbookConfig = {
  members: MemberProfile[];
  household: HouseholdCounts;
};

export type HandbookData = {
  schemaVersion: 1;
  config: HandbookConfig;
  fields: Record<string, string>;
  /** Field ids whose values are passwords, PINs, or equivalent secrets. */
  secretFields: string[];
};

export type CountField<K extends string> = {
  key: K;
  label: string;
  help: string;
  min: number;
  max: number;
};

export type View = 'wizard' | 'handbook';

export type WizardStep =
  | { kind: 'size' }
  | { kind: 'member'; index: number }
  | { kind: 'household' };
