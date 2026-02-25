import { createHash } from "crypto";
import type { Evidence, DataPointer, ProofBundle } from "./types";

/**
 * Canonicalize an object for deterministic hashing.
 */
function canonicalize(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as Record<string, unknown>).sort());
}

/**
 * Compute SHA-256 hash of the canonical JSON representation.
 */
export function computeResponseHash(data: unknown): string {
  const canonical = canonicalize(data);
  return "0x" + createHash("sha256").update(canonical).digest("hex");
}

/**
 * Compute evidence root as SHA-256 of concatenated evidence hashes.
 */
export function computeEvidenceRoot(evidence: Evidence[]): string {
  const leaves = evidence.map((e) => {
    const str = `${e.chainId}:${e.blockNumber}:${e.txHash || ""}:${e.address || ""}:${e.topic0 || ""}`;
    return createHash("sha256").update(str).digest("hex");
  });
  const concatenated = leaves.join("");
  return "0x" + createHash("sha256").update(concatenated).digest("hex");
}

/**
 * Build a complete ProofBundle for an API response.
 */
export function buildProofBundle(
  data: unknown,
  evidence: Evidence[],
  dataPointers: DataPointer[]
): ProofBundle {
  return {
    responseHash: computeResponseHash(data),
    evidence,
    dataPointers,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compute a query hash for receipt recording.
 */
export function computeQueryHash(queryType: string, params: Record<string, string>): string {
  const canonical = `${queryType}:${canonicalize(params)}`;
  return "0x" + createHash("sha256").update(canonical).digest("hex");
}
