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

export type EncryptedSecrets = {
  kdf: 'PBKDF2-SHA-256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};

/** Version 1 is the whole handbook as one ciphertext. */
export type SavedHandbook = EncryptedSecrets & {
  schemaVersion: 1;
  savedAt: string;
};

export type CountField<K extends string> = {
  key: K;
  label: string;
  help: string;
  min: number;
  max: number;
};

export type View = 'home' | 'wizard' | 'handbook';

export type WizardStep =
  | { kind: 'size' }
  | { kind: 'member'; index: number }
  | { kind: 'household' };
