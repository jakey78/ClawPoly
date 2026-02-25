import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getTransaction, getTransactionReceipt } from "../_lib/rpc";
import { enforceX402 } from "../_lib/x402";
import { buildProofBundle, computeQueryHash } from "../_lib/proof";
import { recordReceipt } from "../_lib/receipt";
import { enforceRateLimit } from "../_lib/rateLimit";
import type { Evidence, DataPointer } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  if (!enforceRateLimit(req, res)) return;

  // x402 payment enforcement
  if (!enforceX402(req, res, "search/tx")) return;

  const { hash } = req.query;
  if (!hash || typeof hash !== "string" || !hash.startsWith("0x")) {
    return res.status(400).json({ error: "Invalid transaction hash. Provide ?hash=0x..." });
  }

  try {
    const txHash = hash as `0x${string}`;

    // Fetch transaction and receipt in parallel
    const [tx, receipt] = await Promise.all([
      getTransaction(txHash),
      getTransactionReceipt(txHash),
    ]);

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const data = {
      hash: tx.hash,
      blockNumber: tx.blockNumber?.toString(),
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gas: tx.gas.toString(),
      gasPrice: tx.gasPrice?.toString(),
      nonce: tx.nonce,
      input: tx.input,
      type: tx.type,
      chainId: tx.chainId,
      status: receipt?.status,
      gasUsed: receipt?.gasUsed?.toString(),
      effectiveGasPrice: receipt?.effectiveGasPrice?.toString(),
      contractAddress: receipt?.contractAddress,
      logs: receipt?.logs?.map((log) => ({
        address: log.address,
        topics: log.topics,
        data: log.data,
        blockNumber: log.blockNumber?.toString(),
        logIndex: log.logIndex,
      })),
      logsBloom: receipt?.logsBloom,
    };

    // Build evidence
    const evidence: Evidence[] = [
      {
        chainId: 137,
        blockNumber: Number(tx.blockNumber),
        txHash: tx.hash,
        address: tx.to || undefined,
      },
    ];

    if (receipt?.logs) {
      receipt.logs.forEach((log) => {
        evidence.push({
          chainId: 137,
          blockNumber: Number(log.blockNumber),
          txHash: tx.hash,
          address: log.address,
          topic0: log.topics[0] || undefined,
        });
      });
    }

    const dataPointers: DataPointer[] = [
      { method: "eth_getTransactionByHash", params: { hash: txHash } },
      { method: "eth_getTransactionReceipt", params: { hash: txHash } },
    ];

    const proof = buildProofBundle(data, evidence, dataPointers);

    // Record receipt
    const queryHash = computeQueryHash("search/tx", { hash });
    const receiptRecord = await recordReceipt(
      queryHash,
      proof.responseHash,
      evidence
    );

    return res.status(200).json({
      success: true,
      data,
      proof,
      receipt: receiptRecord,
    });
  } catch (error: any) {
    console.error("Search tx error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to fetch transaction",
    });
  }
}
