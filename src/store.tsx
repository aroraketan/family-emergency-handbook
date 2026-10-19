import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createDefaultConfig } from './defaults';
import type { HandbookConfig, HandbookData } from './types';

type HandbookStore = {
  data: HandbookData;
  setConfig: (config: HandbookConfig) => void;
  setField: (id: string, value: string, options?: { secret?: boolean }) => void;
  clearFields: () => void;
  replaceData: (data: HandbookData) => void;
};

function createInitialData(): HandbookData {
  return {
    schemaVersion: 1,
    config: createDefaultConfig(),
    fields: {},
    secretFields: [],
  };
}

function withoutSecret(ids: string[], id: string): string[] {
  return ids.filter((item) => item !== id);
}

function withSecret(ids: string[], id: string, secret: boolean | undefined): string[] {
  if (secret === undefined) return ids;
  const listed = ids.includes(id);
  if (secret && !listed) return [...ids, id];
  if (!secret && listed) return withoutSecret(ids, id);
  return ids;
}

const HandbookStoreContext = createContext<HandbookStore | null>(null);

/**
 * The single root-level data store. Its state is serializable for future
 * export/import, but is never persisted by the app.
 */
export function HandbookStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HandbookData>(createInitialData);

  const setConfig = useCallback((config: HandbookConfig) => {
    setData((current) => ({ ...current, config }));
  }, []);

  const setField = useCallback((id: string, value: string, options?: { secret?: boolean }) => {
    setData((current) => {
      if (!value) {
        if (!(id in current.fields) && !current.secretFields.includes(id)) return current;
        const fields = { ...current.fields };
        delete fields[id];
        return { ...current, fields, secretFields: withoutSecret(current.secretFields, id) };
      }
      const secretFields = withSecret(current.secretFields, id, options?.secret);
      if (current.fields[id] === value && secretFields === current.secretFields) return current;
      return {
        ...current,
        fields: { ...current.fields, [id]: value },
        secretFields,
      };
    });
  }, []);

  const clearFields = useCallback(() => {
    setData(createInitialData());
  }, []);

  const replaceData = useCallback((next: HandbookData) => {
    setData(next);
  }, []);

  const store = useMemo(
    () => ({ data, setConfig, setField, clearFields, replaceData }),
    [data, setConfig, setField, clearFields, replaceData],
  );

  return (
    <HandbookStoreContext.Provider value={store}>
      {children}
    </HandbookStoreContext.Provider>
  );
}

export function useHandbookStore(): HandbookStore {
  const store = useContext(HandbookStoreContext);
  if (!store) {
    throw new Error('Handbook store is only available inside HandbookStoreProvider');
  }
  return store;
}
