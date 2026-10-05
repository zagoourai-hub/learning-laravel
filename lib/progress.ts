"use client";

import { useSyncExternalStore } from "react";

export type Progress = {
  version: 1;
  completed: Record<string, string>; // lessonId -> ISO date
  lastVisited?: string;
};

const KEY = "laravel-belajar:progress";
const EMPTY: Progress = { version: 1, completed: {} };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
    cache =
      parsed?.version === 1 && parsed.completed && typeof parsed.completed === "object"
        ? parsed
        : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked: keep the in-memory state for this tab
  }
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== KEY && e.key !== null) return;
  cache = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleComplete(id: string) {
  const { completed, ...rest } = read();
  const next = { ...completed };
  if (next[id]) delete next[id];
  else next[id] = new Date().toISOString();
  write({ ...rest, completed: next });
}

export function visit(id: string) {
  const current = read();
  if (current.lastVisited !== id) write({ ...current, lastVisited: id });
}

export function resetProgress() {
  write(EMPTY);
}
