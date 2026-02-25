import { createWalletClient, http, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";
import { computeEvidenceRoot } from "./proof";
import type { Evidence, OffchainReceipt } from "./types";

// SearchReceipt ABI (recordReceipt only)
const SEARCH_RECEIPT_ABI = [
  {
    inputs: [
      { name: "queryHash", type: "bytes32" },
      { name: "responseHash", type: "bytes32" },
      { name: "evidenceRoot", type: "bytes32" },
      { name: "uri", type: "string" },
    ],
    name: "recordReceipt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

let _walletClient: WalletClient | null = null;

function getReceiptSigner(): WalletClient | null {
  if (process.env.ENABLE_ONCHAIN_RECEIPTS !== "true") return null;
  if (!process.env.RECEIPT_SIGNER_PRIVATE_KEY) return null;
  if (!process.env.RECEIPT_CONTRACT_ADDRESS) return null;

  if (_walletClient) return _walletClient;

  const rawKey = process.env.RECEIPT_SIGNER_PRIVATE_KEY!;
  const key = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const account = privateKeyToAccount(key as `0x${string}`);

  _walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http(process.env.POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com"),
  });

  return _walletClient;
}

/**
 * Record a receipt onchain if enabled, otherwise return offchain receipt.
 */
export async function recordReceipt(
  queryHash: string,
  responseHash: string,
  evidence: Evidence[],
  uri: string = ""
): Promise<OffchainReceipt> {
  const evidenceRoot = computeEvidenceRoot(evidence);

  const signer = getReceiptSigner();
  if (signer && process.env.RECEIPT_CONTRACT_ADDRESS) {
    try {
      const txHash = await signer.writeContract({
        address: process.env.RECEIPT_CONTRACT_ADDRESS as `0x${string}`,
        abi: SEARCH_RECEIPT_ABI,
        functionName: "recordReceipt",
        args: [
          queryHash as `0x${string}`,
          responseHash as `0x${string}`,
          evidenceRoot as `0x${string}`,
          uri,
        ],
      });

      return {
        queryHash,
        responseHash,
        evidenceRoot,
        timestamp: new Date().toISOString(),
        onchain: true,
        txHash,
      };
    } catch (error) {
      console.error("Failed to record onchain receipt:", error);
      // Fall through to offchain
    }
  }

  // Offchain receipt
  return {
    queryHash,
    responseHash,
    evidenceRoot,
    timestamp: new Date().toISOString(),
    onchain: false,
  };
}
