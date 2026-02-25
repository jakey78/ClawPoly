import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCode, getStorageAt } from "../_lib/rpc";
import { getABI, getSourceCode } from "../_lib/polygonscan";
import { enforceX402 } from "../_lib/x402";
import { buildProofBundle, computeQueryHash } from "../_lib/proof";
import { recordReceipt } from "../_lib/receipt";
import { enforceRateLimit } from "../_lib/rateLimit";
import type { Evidence, DataPointer } from "../_lib/types";

// EIP-1967 implementation slot
const EIP1967_IMPL_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!enforceRateLimit(req, res)) return;
  if (!enforceX402(req, res, "search/contract")) return;

  const { address } = req.query;
  if (!address || typeof address !== "string" || !address.startsWith("0x")) {
    return res.status(400).json({ error: "Invalid address. Provide ?address=0x..." });
  }

  try {
    const addr = address as `0x${string}`;

    // Parallel fetches
    const [bytecode, abiRes, sourceRes, implSlot] = await Promise.all([
      getCode(addr),
      getABI(address),
      getSourceCode(address),
      getStorageAt(addr, EIP1967_IMPL_SLOT as `0x${string}`).catch(() => null),
    ]);

    const isContract = bytecode && bytecode !== "0x";
    const hasABI = abiRes?.status === "1" && abiRes?.result;
    const sourceData = sourceRes?.result?.[0];
    const isVerified = !!sourceData?.SourceCode && sourceData.SourceCode !== "";

    // Proxy detection
    let isProxy = false;
    let implementationAddress: string | null = null;
    if (implSlot && implSlot !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      isProxy = true;
      implementationAddress = "0x" + implSlot.slice(26);
    }

    let parsedABI: any = null;
    try {
      if (hasABI) {
        parsedABI = JSON.parse(abiRes.result);
      }
    } catch {
      parsedABI = null;
    }

    const data = {
      address,
      isContract,
      bytecodeSize: bytecode ? Math.floor((bytecode.length - 2) / 2) : 0,
      isVerified,
      abi: parsedABI,
      abiAvailable: !!parsedABI,
      source: isVerified
        ? {
            contractName: sourceData?.ContractName || null,
            compilerVersion: sourceData?.CompilerVersion || null,
            optimizationUsed: sourceData?.OptimizationUsed === "1",
            runs: sourceData?.Runs ? Number(sourceData.Runs) : null,
            evmVersion: sourceData?.EVMVersion || null,
            licenseType: sourceData?.LicenseType || null,
          }
        : null,
      proxy: {
        isProxy,
        implementationAddress,
        standard: isProxy ? "EIP-1967" : null,
      },
    };

    // Build evidence
    const evidence: Evidence[] = [
      { chainId: 137, blockNumber: 0, address },
    ];

    const dataPointers: DataPointer[] = [
      { method: "eth_getCode", params: { address } },
      { method: "polygonscan_getabi", params: { address } },
      { method: "polygonscan_getsourcecode", params: { address } },
      { method: "eth_getStorageAt", params: { address, slot: EIP1967_IMPL_SLOT } },
    ];

    const proof = buildProofBundle(data, evidence, dataPointers);
    const queryHash = computeQueryHash("search/contract", { address });
    const receiptRecord = await recordReceipt(queryHash, proof.responseHash, evidence);

    return res.status(200).json({
      success: true,
      data,
      proof,
      receipt: receiptRecord,
    });
  } catch (error: any) {
    console.error("Search contract error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to search contract",
    });
  }
}
