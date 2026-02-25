import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getLogs } from "../_lib/rpc";
import { enforceX402 } from "../_lib/x402";
import { buildProofBundle, computeQueryHash } from "../_lib/proof";
import { recordReceipt } from "../_lib/receipt";
import { enforceRateLimit } from "../_lib/rateLimit";
import type { Evidence, DataPointer } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!enforceRateLimit(req, res)) return;
  if (!enforceX402(req, res, "search/logs")) return;

  const { address, topic0, fromBlock, toBlock } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Provide ?address=0x..." });
  }

  try {
    const params: {
      address: `0x${string}`;
      topics?: (`0x${string}` | null)[];
      fromBlock?: bigint;
      toBlock?: bigint;
    } = {
      address: address as `0x${string}`,
    };

    if (topic0 && typeof topic0 === "string") {
      params.topics = [topic0 as `0x${string}`];
    }

    if (fromBlock && typeof fromBlock === "string") {
      params.fromBlock = BigInt(fromBlock);
    }

    if (toBlock && typeof toBlock === "string") {
      params.toBlock = BigInt(toBlock);
    }

    const logs = await getLogs(params);

    const data = {
      address,
      topic0: topic0 || null,
      fromBlock: fromBlock || null,
      toBlock: toBlock || null,
      logCount: logs.length,
      logs: logs.slice(0, 100).map((log) => ({
        address: log.address,
        topics: log.topics,
        data: log.data,
        blockNumber: log.blockNumber?.toString(),
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        transactionIndex: log.transactionIndex,
      })),
    };

    // Build evidence
    const evidence: Evidence[] = logs.slice(0, 10).map((log) => ({
      chainId: 137,
      blockNumber: Number(log.blockNumber),
      txHash: log.transactionHash,
      address: log.address,
      topic0: log.topics[0] || undefined,
    }));

    if (evidence.length === 0) {
      evidence.push({ chainId: 137, blockNumber: 0, address });
    }

    const dataPointers: DataPointer[] = [
      {
        method: "eth_getLogs",
        params: {
          address,
          topics: topic0 ? [topic0] : [],
          fromBlock: fromBlock || "latest",
          toBlock: toBlock || "latest",
        },
      },
    ];

    const proof = buildProofBundle(data, evidence, dataPointers);
    const queryHash = computeQueryHash("search/logs", {
      address,
      topic0: (topic0 as string) || "",
      fromBlock: (fromBlock as string) || "",
      toBlock: (toBlock as string) || "",
    });
    const receiptRecord = await recordReceipt(queryHash, proof.responseHash, evidence);

    return res.status(200).json({
      success: true,
      data,
      proof,
      receipt: receiptRecord,
    });
  } catch (error: any) {
    console.error("Search logs error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to search logs",
    });
  }
}
