import { useSyncExternalStore } from "react";

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  photoDataUrl?: string;
  password?: string; // demo only — stored locally to allow "alterar senha" simulation
}

const STORAGE_KEY = "chapada.profiles.v1";

const load = (): Record<string, UserProfile> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

let profiles: Record<string, UserProfile> = load();

const listeners = new Set<() => void>();
const emit = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }
  listeners.forEach((l) => l());
};

export const setProfile = (email: string, data: Partial<UserProfile>) => {
  const key = email.toLowerCase();
  const current = profiles[key] || { email: key, firstName: "", lastName: "" };
  profiles = { ...profiles, [key]: { ...current, ...data, email: key } };
  emit();
};

export const getProfile = (email?: string | null): UserProfile | null => {
  if (!email) return null;
  return profiles[email.toLowerCase()] || null;
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const useProfile = (email?: string | null): UserProfile | null => {
  return useSyncExternalStore(
    subscribe,
    () => (email ? profiles[email.toLowerCase()] || null : null),
    () => null,
  );
};

export const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

export const fullName = (p: UserProfile | null, fallback = ""): string => {
  if (!p) return fallback;
  const fn = capitalize(p.firstName);
  const ln = capitalize(p.lastName);
  return [fn, ln].filter(Boolean).join(" ") || fallback;
};

export const initialsFrom = (p: UserProfile | null, email: string): string => {
  if (p && (p.firstName || p.lastName)) {
    return ((p.firstName[0] || "") + (p.lastName[0] || "")).toUpperCase() || "CH";
  }
  const base = email.split("@")[0] || "CH";
  return base.slice(0, 2).toUpperCase();
};
