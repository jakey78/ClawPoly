import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "clawpoly_recent_searches";
const MAX_ITEMS = 20;

export interface RecentSearch {
  query: string;
  type: "tx" | "address" | "contract" | "logs";
  timestamp: number;
}

function load(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentSearch[];
  } catch {
    return [];
  }
}

function save(items: RecentSearch[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // storage full — ignore
  }
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>(load);

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSearches(load());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addSearch = useCallback(
    (query: string, type: RecentSearch["type"]) => {
      setSearches((prev) => {
        const filtered = prev.filter(
          (s) => !(s.query === query && s.type === type),
        );
        const next: RecentSearch[] = [
          { query, type, timestamp: Date.now() },
          ...filtered,
        ].slice(0, MAX_ITEMS);
        save(next);
        return next;
      });
    },
    [],
  );

  const removeSearch = useCallback((query: string, type: RecentSearch["type"]) => {
    setSearches((prev) => {
      const next = prev.filter(
        (s) => !(s.query === query && s.type === type),
      );
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { searches, addSearch, removeSearch, clearAll };
}
