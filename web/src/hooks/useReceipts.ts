import { useReadContract, useReadContracts } from "wagmi";
import { searchReceiptContract } from "@/config/contracts";
import { useMemo } from "react";

export interface SearchReceipt {
  queryHash: `0x${string}`;
  responseHash: `0x${string}`;
  evidenceRoot: `0x${string}`;
  caller: `0x${string}`;
  blockTimestamp: bigint;
  uri: string;
}

export function useReceiptExists(queryHash: `0x${string}` | undefined) {
  return useReadContract({
    ...searchReceiptContract,
    functionName: "receiptExists",
    args: queryHash ? [queryHash] : undefined,
    query: { enabled: !!queryHash },
  });
}

export function useReceipt(queryHash: `0x${string}` | undefined) {
  return useReadContract({
    ...searchReceiptContract,
    functionName: "getReceipt",
    args: queryHash ? [queryHash] : undefined,
    query: { enabled: !!queryHash },
  });
}

export function useReceiptCount() {
  return useReadContract({
    ...searchReceiptContract,
    functionName: "totalReceipts",
  });
}

export function useReceipts(queryHashes: `0x${string}`[]) {
  const contracts = useMemo(
    () =>
      queryHashes.map((qh) => ({
        ...searchReceiptContract,
        functionName: "getReceipt" as const,
        args: [qh] as const,
      })),
    [queryHashes],
  );

  return useReadContracts({
    contracts,
    query: { enabled: queryHashes.length > 0 },
  });
}
