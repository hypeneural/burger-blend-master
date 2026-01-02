import { db, createId } from '@/lib/db';
import type { BlendHistoryEntry, PreferenceEntry, SavedBlend } from '@/types/blend';

const encodeValue = (value: unknown) => JSON.stringify(value);
const decodeValue = (value: string) => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

export const loadSavedBlends = async () => {
  return db.blends.orderBy('createdAt').reverse().toArray();
};

export const addSavedBlend = async (
  blend: Omit<SavedBlend, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<SavedBlend> => {
  const now = new Date().toISOString();
  const saved: SavedBlend = {
    ...blend,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  };
  await db.blends.put(saved);
  return saved;
};

export const updateSavedBlend = async (
  id: string,
  patch: Partial<Omit<SavedBlend, 'id' | 'createdAt'>>,
): Promise<SavedBlend | null> => {
  const existing = await db.blends.get(id);
  if (!existing) return null;
  const updated: SavedBlend = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await db.blends.put(updated);
  return updated;
};

export const deleteSavedBlend = async (id: string) => {
  await db.blends.delete(id);
};

export const addHistoryEntry = async (
  entry: Omit<BlendHistoryEntry, 'id' | 'createdAt'>,
): Promise<BlendHistoryEntry> => {
  const saved: BlendHistoryEntry = {
    ...entry,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  await db.history.put(saved);
  return saved;
};

export const loadHistory = async (limit = 20) => {
  return db.history.orderBy('createdAt').reverse().limit(limit).toArray();
};

export const setPreference = async (key: string, value: unknown) => {
  const entry: PreferenceEntry = {
    key,
    value: encodeValue(value),
    updatedAt: new Date().toISOString(),
  };
  await db.preferences.put(entry);
  return entry;
};

export const getPreference = async (key: string) => {
  const entry = await db.preferences.get(key);
  if (!entry) return null;
  return decodeValue(entry.value);
};
