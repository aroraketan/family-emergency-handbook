import type {
  CountField,
  HandbookConfig,
  HouseholdCountKey,
  HouseholdCounts,
  MemberCountKey,
  MemberCounts,
  MemberProfile,
} from './types';

export const MEMBER_COUNT_FIELDS: CountField<MemberCountKey>[] = [
  {
    key: 'bankAccounts',
    label: 'Bank / credit union accounts',
    help: 'Accounts in this person\'s name (or primarily theirs)',
    min: 0,
    max: 40,
  },
  {
    key: 'debitCards',
    label: 'Debit cards',
    help: 'ATM and debit cards this person holds',
    min: 0,
    max: 30,
  },
  {
    key: 'creditCards',
    label: 'Credit cards',
    help: 'Credit cards this person holds',
    min: 0,
    max: 30,
  },
  {
    key: 'appPins',
    label: 'App PINs',
    help: 'Banking and other apps that unlock with a PIN',
    min: 0,
    max: 40,
  },
  {
    key: 'fixedDeposits',
    label: 'Fixed deposits (FDs)',
    help: 'FDs in this person\'s name',
    min: 0,
    max: 40,
  },
  {
    key: 'investments',
    label: 'Investments / retirement',
    help: 'Brokerage, mutual funds, EPF, PPF, stocks',
    min: 0,
    max: 40,
  },
  {
    key: 'insurancePolicies',
    label: 'Insurance policies',
    help: 'Life, health, term, etc. for this person',
    min: 0,
    max: 30,
  },
  {
    key: 'loans',
    label: 'Loans / debts',
    help: 'Personal, education, or other loans in their name',
    min: 0,
    max: 30,
  },
  {
    key: 'digitalAccounts',
    label: 'Important digital accounts',
    help: 'Extra logins beyond email / Apple / Google',
    min: 0,
    max: 40,
  },
  {
    key: 'medications',
    label: 'Current medications',
    help: 'Medications this person takes',
    min: 0,
    max: 40,
  },
  {
    key: 'employers',
    label: 'Employers / income sources',
    help: 'Jobs or businesses for this person',
    min: 0,
    max: 10,
  },
];

export const HOUSEHOLD_COUNT_FIELDS: CountField<HouseholdCountKey>[] = [
  {
    key: 'emergencyContacts',
    label: 'Emergency contacts',
    help: 'Priority call list outside the household',
    min: 0,
    max: 30,
  },
  {
    key: 'neighbors',
    label: 'Neighbors / local help',
    help: 'People nearby who can help or hold a key',
    min: 0,
    max: 15,
  },
  {
    key: 'vehicles',
    label: 'Vehicles',
    help: 'Cars, bikes, scooters shared by the household',
    min: 0,
    max: 15,
  },
  {
    key: 'properties',
    label: 'Properties',
    help: 'Homes, land, or other places. The first is the primary residence',
    min: 0,
    max: 8,
  },
  {
    key: 'utilities',
    label: 'Utility / home service accounts',
    help: 'Electric, gas, water, internet, trash',
    min: 0,
    max: 20,
  },
  {
    key: 'subscriptions',
    label: 'Household subscriptions',
    help: 'Shared streaming, memberships, etc.',
    min: 0,
    max: 40,
  },
  {
    key: 'pets',
    label: 'Pets',
    help: 'Animals that need care plans',
    min: 0,
    max: 15,
  },
];

export const DEFAULT_MEMBER_COUNTS: MemberCounts = {
  bankAccounts: 2,
  debitCards: 1,
  creditCards: 2,
  appPins: 2,
  fixedDeposits: 1,
  investments: 2,
  insurancePolicies: 2,
  loans: 1,
  digitalAccounts: 4,
  medications: 2,
  employers: 1,
};

export const DEFAULT_HOUSEHOLD_COUNTS: HouseholdCounts = {
  emergencyContacts: 5,
  neighbors: 2,
  vehicles: 1,
  properties: 1,
  utilities: 5,
  subscriptions: 3,
  pets: 0,
};

export function clampCount(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function createMember(index: number, label?: string): MemberProfile {
  return {
    id: 'member-' + (index + 1),
    label: label && label.trim() ? label.trim() : 'Member ' + (index + 1),
    counts: { ...DEFAULT_MEMBER_COUNTS },
  };
}

export function resizeMembers(
  current: MemberProfile[],
  size: number
): MemberProfile[] {
  const nextSize = clampCount(size, 1, 12);
  const next = current.slice(0, nextSize).map((member, index) => ({
    ...member,
    id: 'member-' + (index + 1),
    label: member.label.trim() || 'Member ' + (index + 1),
  }));
  while (next.length < nextSize) {
    next.push(createMember(next.length));
  }
  return next;
}

export function createDefaultConfig(): HandbookConfig {
  return {
    members: [createMember(0, 'Member 1'), createMember(1, 'Member 2')],
    household: { ...DEFAULT_HOUSEHOLD_COUNTS },
  };
}

export function totalSlots(config: HandbookConfig): number {
  const memberTotal = config.members.reduce((sum, member) => {
    return (
      sum +
      Object.values(member.counts).reduce((inner, value) => inner + value, 0)
    );
  }, 0);
  const householdTotal = Object.values(config.household).reduce(
    (sum, value) => sum + value,
    0
  );
  return memberTotal + householdTotal + config.members.length;
}
