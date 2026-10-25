import {
  clampCount,
  DEFAULT_HOUSEHOLD_COUNTS,
  DEFAULT_MEMBER_COUNTS,
  HOUSEHOLD_COUNT_FIELDS,
  MEMBER_COUNT_FIELDS,
} from './defaults';
import type {
  EncryptedSecrets,
  HandbookConfig,
  HandbookData,
  HouseholdCounts,
  MemberCounts,
  SavedHandbook,
} from './types';

const PBKDF2_ITERATIONS = 600_000;
export const PASSPHRASE_MIN_LENGTH = 8;
export const HANDBOOK_FILE_EXTENSION = '.feh';
export const HANDBOOK_LOAD_EXTENSIONS = [HANDBOOK_FILE_EXTENSION, '.json'] as const;
const MAX_SAVE_CHARS = 2_000_000;

export class LoadError extends Error {
  readonly code: 'invalid' | 'passphrase';

  constructor(message: string, code: 'invalid' | 'passphrase' = 'invalid') {
    super(message);
    this.name = 'LoadError';
    this.code = code;
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptJson(value: unknown, passphrase: string): Promise<EncryptedSecrets> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      plaintext,
    ),
  );
  return {
    kdf: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext),
  };
}

async function decryptJson(secrets: EncryptedSecrets, passphrase: string): Promise<unknown> {
  const key = await deriveKey(passphrase, base64ToBytes(secrets.salt));
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(secrets.iv) as BufferSource },
    key,
    base64ToBytes(secrets.ciphertext) as BufferSource,
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as unknown;
}

function familySlug(name: string): string {
  return name
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function handbookFileName(date = new Date(), familyName = ''): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const stamp =
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    '-' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds());
  const slug = familySlug(familyName);
  const family = slug ? '-' + slug : '';
  return 'family-emergency-handbook' + family + '-' + stamp + HANDBOOK_FILE_EXTENSION;
}

export async function buildSavedHandbook(
  data: HandbookData,
  passphrase: string,
  savedAt = new Date().toISOString(),
): Promise<SavedHandbook> {
  if (passphrase.length < PASSPHRASE_MIN_LENGTH) {
    throw new Error('A passphrase of at least 8 characters is required.');
  }
  const fields: Record<string, string> = {};
  for (const [id, value] of Object.entries(data.fields)) {
    if (value) fields[id] = value;
  }
  const encrypted = await encryptJson(
    {
      config: data.config,
      fields,
      secretFields: data.secretFields.filter((id) => fields[id]),
    },
    passphrase,
  );
  return {
    schemaVersion: 1,
    savedAt,
    ...encrypted,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readCounts<K extends string>(
  value: unknown,
  fields: { key: K; min: number; max: number }[],
  defaults: Record<K, number>,
): Record<K, number> {
  if (!isRecord(value)) throw new LoadError('This file is missing its counts.');
  const counts = {} as Record<K, number>;
  for (const field of fields) {
    const raw = value[field.key];
    counts[field.key] =
      typeof raw === 'number'
        ? clampCount(raw, field.min, field.max)
        : defaults[field.key];
  }
  return counts;
}

function readConfig(value: unknown): HandbookConfig {
  if (!isRecord(value) || !Array.isArray(value.members)) {
    throw new LoadError('This file is missing the household setup.');
  }
  if (value.members.length < 1 || value.members.length > 12) {
    throw new LoadError('This file must list between 1 and 12 household members.');
  }
  const members = value.members.map((member, index) => {
    if (!isRecord(member)) throw new LoadError('This file has an invalid household member.');
    const label = typeof member.label === 'string' ? member.label.trim().slice(0, 80) : '';
    return {
      id: 'member-' + (index + 1),
      label: label || 'Member ' + (index + 1),
      counts: readCounts<keyof MemberCounts>(
        member.counts,
        MEMBER_COUNT_FIELDS,
        DEFAULT_MEMBER_COUNTS,
      ) as MemberCounts,
    };
  });
  return {
    members,
    household: readCounts<keyof HouseholdCounts>(
      value.household,
      HOUSEHOLD_COUNT_FIELDS,
      DEFAULT_HOUSEHOLD_COUNTS,
    ) as HouseholdCounts,
  };
}

function readFields(value: unknown): Record<string, string> {
  if (!isRecord(value)) throw new LoadError('This file is missing its details.');
  const fields: Record<string, string> = {};
  for (const [id, item] of Object.entries(value)) {
    if (typeof item === 'string' && item) fields[id] = item;
  }
  return fields;
}

function readEncryption(value: Record<string, unknown>): EncryptedSecrets {
  if (value.kdf !== 'PBKDF2-SHA-256' || value.iterations !== PBKDF2_ITERATIONS) {
    throw new LoadError('This file uses an unsupported encryption setup.');
  }
  if (
    typeof value.salt !== 'string' ||
    typeof value.iv !== 'string' ||
    typeof value.ciphertext !== 'string' ||
    !value.salt ||
    !value.iv ||
    !value.ciphertext
  ) {
    throw new LoadError('This file is missing its encrypted data.');
  }
  return {
    kdf: 'PBKDF2-SHA-256',
    iterations: PBKDF2_ITERATIONS,
    salt: value.salt,
    iv: value.iv,
    ciphertext: value.ciphertext,
  };
}

export function readSavedHandbook(text: string): SavedHandbook {
  if (text.length > MAX_SAVE_CHARS) {
    throw new LoadError('That file is too large to open.');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new LoadError('That file could not be read.');
  }
  if (!isRecord(parsed) || parsed.schemaVersion !== 1) {
    throw new LoadError('This file is not a saved family emergency handbook.');
  }
  return {
    schemaVersion: 1,
    savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    ...readEncryption(parsed),
  };
}

function handbookFromPayload(payload: unknown, passphraseError: string): HandbookData {
  if (!isRecord(payload)) throw new LoadError(passphraseError, 'passphrase');
  const fields = readFields(payload.fields);
  const secretFields = Array.isArray(payload.secretFields)
    ? payload.secretFields.filter((id): id is string => typeof id === 'string' && Boolean(fields[id]))
    : [];
  return {
    schemaVersion: 1,
    config: readConfig(payload.config),
    fields,
    secretFields,
  };
}

export async function handbookFromSaved(
  saved: SavedHandbook,
  passphrase: string,
): Promise<HandbookData> {
  let payload: unknown;
  try {
    payload = await decryptJson(saved, passphrase);
  } catch {
    throw new LoadError('That passphrase did not unlock the file.', 'passphrase');
  }
  return handbookFromPayload(payload, 'The unlocked data was not valid.');
}

export async function downloadSavedHandbook(
  data: HandbookData,
  passphrase: string,
): Promise<void> {
  const saved = await buildSavedHandbook(data, passphrase);
  const blob = new Blob([JSON.stringify(saved, null, 2) + '\n'], {
    type: 'application/octet-stream',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = handbookFileName(new Date(), data.fields['cover-family'] ?? '');
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
