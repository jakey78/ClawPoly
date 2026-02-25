import { useQuery } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { fetchWithPayment, type PaymentPayload } from "@/lib/x402Client";
import { useRecentSearches } from "./useRecentSearches";
import { useCallback, useState } from "react";

export type SearchType = "tx" | "address" | "contract" | "logs";

const ENDPOINT_MAP: Record<SearchType, string> = {
  tx: "/api/search/tx",
  address: "/api/search/address",
  contract: "/api/search/contract",
  logs: "/api/search/logs",
};

/**
 * Auto-detect search type from query string.
 */
export function detectSearchType(query: string): SearchType {
  const q = query.trim();
  // 66-char hex = tx hash
  if (/^0x[a-fA-F0-9]{64}$/.test(q)) return "tx";
  // 42-char hex = address (could be contract or EOA)
  if (/^0x[a-fA-F0-9]{40}$/.test(q)) return "address";
  return "address"; // fallback
}

interface SearchResult {
  data: unknown;
  paymentPayload?: PaymentPayload;
}

interface UseSearchOptions {
  query: string;
  type?: SearchType;
  params?: Record<string, string>;
  enabled?: boolean;
}

export function useSearch({ query, type, params, enabled = true }: UseSearchOptions) {
  const { data: walletClient } = useWalletClient();
  const { addSearch } = useRecentSearches();
  const [lastPayment, setLastPayment] = useState<PaymentPayload | undefined>();

  const resolvedType = type || detectSearchType(query);
  const endpoint = ENDPOINT_MAP[resolvedType];

  const queryResult = useQuery<SearchResult>({
    queryKey: ["search", resolvedType, query, params],
    queryFn: async () => {
      const searchParams: Record<string, string> = {
        ...params,
      };

      // Map the query to the right param name
      if (resolvedType === "tx") {
        searchParams.hash = query;
      } else if (resolvedType === "address" || resolvedType === "contract") {
        searchParams.address = query;
      } else if (resolvedType === "logs") {
        searchParams.address = query;
      }

      const result = await fetchWithPayment(
        endpoint,
        searchParams,
        walletClient ?? null,
      );

      if (result.paymentPayload) {
        setLastPayment(result.paymentPayload);
      }

      addSearch(query, resolvedType);
      return result;
    },
    enabled: enabled && !!query.trim(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...queryResult,
    searchType: resolvedType,
    lastPayment,
  };
}

/**
 * Imperative search trigger (for form submissions).
 */
export function useSearchTrigger() {
  const { data: walletClient } = useWalletClient();
  const { addSearch } = useRecentSearches();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const search = useCallback(
    async (query: string, type?: SearchType, extraParams?: Record<string, string>) => {
      const resolvedType = type || detectSearchType(query);
      const endpoint = ENDPOINT_MAP[resolvedType];
      const searchParams: Record<string, string> = { ...extraParams };

      if (resolvedType === "tx") searchParams.hash = query;
      else searchParams.address = query;

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetchWithPayment(
          endpoint,
          searchParams,
          walletClient ?? null,
        );
        setResult(res);
        addSearch(query, resolvedType);
        return res;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Search failed";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, addSearch],
  );

  return { search, loading, error, result };
}
