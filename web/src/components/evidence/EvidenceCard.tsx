import Card from "../ui/Card";
import CopyButton from "./CopyButton";
import { Layers, Hash, MapPin } from "lucide-react";

interface EvidenceItem {
  chainId: number;
  blockNumber: number;
  txHash?: string;
  address?: string;
  topic0?: string;
}

interface EvidenceCardProps {
  evidence: EvidenceItem;
  index: number;
}

function shortenHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export default function EvidenceCard({ evidence, index }: EvidenceCardProps) {
  return (
    <Card className="text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono font-medium"
          style={{ color: "var(--color-accent-teal)" }}
        >
          Evidence #{index + 1}
        </span>
        <span
          className="font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          Chain {evidence.chainId}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Layers size={12} style={{ color: "var(--color-text-muted)" }} />
          <span style={{ color: "var(--color-text-secondary)" }}>Block:</span>
          <span className="font-mono" style={{ color: "var(--color-text-primary)" }}>
            {evidence.blockNumber.toLocaleString()}
          </span>
        </div>

        {evidence.txHash && (
          <div className="flex items-center gap-2">
            <Hash size={12} style={{ color: "var(--color-text-muted)" }} />
            <span style={{ color: "var(--color-text-secondary)" }}>Tx:</span>
            <span className="font-mono" style={{ color: "var(--color-text-primary)" }}>
              {shortenHash(evidence.txHash)}
            </span>
            <CopyButton text={evidence.txHash} />
          </div>
        )}

        {evidence.address && (
          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: "var(--color-text-muted)" }} />
            <span style={{ color: "var(--color-text-secondary)" }}>Address:</span>
            <span className="font-mono" style={{ color: "var(--color-text-primary)" }}>
              {shortenHash(evidence.address)}
            </span>
            <CopyButton text={evidence.address} />
          </div>
        )}

        {evidence.topic0 && (
          <div className="flex items-center gap-2">
            <Hash size={12} style={{ color: "var(--color-text-muted)" }} />
            <span style={{ color: "var(--color-text-secondary)" }}>Topic0:</span>
            <span className="font-mono" style={{ color: "var(--color-text-primary)" }}>
              {shortenHash(evidence.topic0)}
            </span>
            <CopyButton text={evidence.topic0} />
          </div>
        )}
      </div>
    </Card>
  );
}
