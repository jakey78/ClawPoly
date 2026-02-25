import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBalance, getLogs } from "../_lib/rpc";
import { getTxList, getTokenTx } from "../_lib/polygonscan";
import { enforceX402 } from "../_lib/x402";
import { buildProofBundle, computeQueryHash } from "../_lib/proof";
import { recordReceipt } from "../_lib/receipt";
import { enforceRateLimit } from "../_lib/rateLimit";
import type { Evidence, DataPointer, PolygonScanTx, PolygonScanTokenTx } from "../_lib/types";

// ERC20 Approval event topic0
const APPROVAL_TOPIC = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!enforceRateLimit(req, res)) return;
  if (!enforceX402(req, res, "search/address")) return;

  const { address } = req.query;
  if (!address || typeof address !== "string" || !address.startsWith("0x")) {
    return res.status(400).json({ error: "Invalid address. Provide ?address=0x..." });
  }

  try {
    const addr = address as `0x${string}`;

    // Parallel fetches
    const [balance, txListRes, tokenTxRes] = await Promise.all([
      getBalance(addr),
      getTxList(address),
      getTokenTx(address),
    ]);

    const txList: PolygonScanTx[] = txListRes?.result || [];
    const tokenTxList: PolygonScanTokenTx[] = tokenTxRes?.result || [];

    // Compute top counterparties
    const counterpartyMap = new Map<string, number>();
    txList.forEach((tx: PolygonScanTx) => {
      const counterparty = tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from;
      if (counterparty) {
        counterpartyMap.set(
          counterparty.toLowerCase(),
          (counterpartyMap.get(counterparty.toLowerCase()) || 0) + 1
        );
      }
    });
    const topCounterparties = Array.from(counterpartyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([addr, count]) => ({ address: addr, interactionCount: count }));

    // Fetch approval events
    let approvals: any[] = [];
    try {
      const approvalLogs = await getLogs({
        topics: [APPROVAL_TOPIC as `0x${string}`, `0x000000000000000000000000${address.slice(2).toLowerCase()}` as `0x${string}`],
        fromBlock: BigInt(Math.max(0, Number(txList[0]?.blockNumber || 0) - 100000)),
        toBlock: "latest" as any,
      });

      approvals = approvalLogs.map((log) => ({
        tokenAddress: log.address,
        spender: log.topics[2] ? "0x" + log.topics[2].slice(26) : null,
        blockNumber: log.blockNumber?.toString(),
        txHash: log.transactionHash,
        data: log.data,
      }));
    } catch (e) {
      // Non-critical — approvals fetch may fail on some RPCs
      console.warn("Failed to fetch approval logs:", e);
    }

    const data = {
      address,
      balance: balance.toString(),
      balanceFormatted: (Number(balance) / 1e18).toFixed(6) + " POL",
      transactionCount: txList.length,
      transactions: txList.slice(0, 25).map((tx: PolygonScanTx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: tx.blockNumber,
        timestamp: tx.timeStamp,
        gasUsed: tx.gasUsed,
        isError: tx.isError === "1",
        functionName: tx.functionName,
      })),
      tokenTransfers: tokenTxList.slice(0, 25).map((tx: PolygonScanTokenTx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimal: tx.tokenDecimal,
        contractAddress: tx.contractAddress,
        blockNumber: tx.blockNumber,
        timestamp: tx.timeStamp,
      })),
      topCounterparties,
      approvals: approvals.slice(0, 20),
      approvalRisk: approvals.length > 5 ? "elevated" : approvals.length > 0 ? "moderate" : "low",
    };

    // Build evidence
    const evidence: Evidence[] = [
      { chainId: 137, blockNumber: Number(txList[0]?.blockNumber || 0), address },
    ];
    txList.slice(0, 5).forEach((tx: PolygonScanTx) => {
      evidence.push({
        chainId: 137,
        blockNumber: Number(tx.blockNumber),
        txHash: tx.hash,
        address,
      });
    });

    const dataPointers: DataPointer[] = [
      { method: "eth_getBalance", params: { address } },
      { method: "polygonscan_txlist", params: { address } },
      { method: "polygonscan_tokentx", params: { address } },
      { method: "eth_getLogs", params: { topic0: APPROVAL_TOPIC, address } },
    ];

    const proof = buildProofBundle(data, evidence, dataPointers);
    const queryHash = computeQueryHash("search/address", { address });
    const receiptRecord = await recordReceipt(queryHash, proof.responseHash, evidence);

    return res.status(200).json({
      success: true,
      data,
      proof,
      receipt: receiptRecord,
    });
  } catch (error: any) {
    console.error("Search address error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to search address",
    });
  }
}
