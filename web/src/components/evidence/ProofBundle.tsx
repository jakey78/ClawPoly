import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../ui/Card";
import CopyButton from "./CopyButton";
import EvidenceCard from "./EvidenceCard";

interface ProofBundleData {
  queryHash: string;
  responseHash: string;
  evidenceRoot: string;
  evidence: Array<{
    chainId: number;
    blockNumber: number;
    txHash?: string;
    address?: string;
    topic0?: string;
  }>;
  timestamp: number;
}

interface ProofBundleProps {
  proof: ProofBundleData;
}

function shortenHash(hash: string): string {
  if (hash.length <= 18) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function ProofBundle({ proof }: ProofBundleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="space-y-3">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: "var(--color-accent-teal)" }} />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Proof Bundle
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--color-text-muted)" }}
          >
            {proof.evidence.length} evidence item
            {proof.evidence.length !== 1 ? "s" : ""}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} style={{ color: "var(--color-text-muted)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--color-text-muted)" }} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-3"
          >
            {/* Hashes */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck
                  size={12}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Query Hash:
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {shortenHash(proof.queryHash)}
                </span>
                <CopyButton text={proof.queryHash} />
              </div>

              <div className="flex items-center gap-2">
                <FileCheck
                  size={12}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Response Hash:
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {shortenHash(proof.responseHash)}
                </span>
                <CopyButton text={proof.responseHash} />
              </div>

              <div className="flex items-center gap-2">
                <FileCheck
                  size={12}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Evidence Root:
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {shortenHash(proof.evidenceRoot)}
                </span>
                <CopyButton text={proof.evidenceRoot} />
              </div>

              <div className="flex items-center gap-2">
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Timestamp:
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {new Date(proof.timestamp).toISOString()}
                </span>
              </div>
            </div>

            {/* Evidence items */}
            {proof.evidence.length > 0 && (
              <div className="space-y-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Evidence Items
                </span>
                {proof.evidence.map((item, i) => (
                  <EvidenceCard key={i} evidence={item} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
