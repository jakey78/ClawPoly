import { useState, useCallback, useEffect } from "react";

interface DocsEntry {
  id: string;
  title: string;
  body: string;
  category: string;
  url?: string;
}

let cachedIndex: DocsEntry[] | null = null;

async function loadIndex(): Promise<DocsEntry[]> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch("/docs-index.json");
  if (!res.ok) throw new Error("Failed to load docs index");
  cachedIndex = (await res.json()) as DocsEntry[];
  return cachedIndex;
}

function searchDocs(entries: DocsEntry[], query: string): DocsEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return entries
    .map((entry) => {
      const text = `${entry.title} ${entry.body} ${entry.category}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (text.includes(term)) score++;
        if (entry.title.toLowerCase().includes(term)) score += 2;
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.entry)
    .slice(0, 20);
}

export function useDocsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const entries = await loadIndex();
      const found = searchDocs(entries, q);
      setResults(found);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce: re-search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      search(query);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { query, setQuery: search, results, loading, error };
}
