import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useReceiptCount } from "@/hooks/useReceipts";
import { useAccount } from "wagmi";
import {
  FileCheck,
  AlertTriangle,
  Loader2,
  Wallet,
} from "lucide-react";

export default function ReceiptsPage() {
  const { address, isConnected } = useAccount();
  const { data: count, isLoading, error } = useReceiptCount();

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <section className="pt-4 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <FileCheck
              size={24}
              style={{ color: "var(--color-accent-teal)" }}
            />
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Search Receipts
            </h1>
          </div>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Onchain attestation records for search queries. Each receipt links a
            query hash, response hash, and evidence root.
          </p>
        </section>

        {/* Wallet status */}
        {!isConnected && (
          <Card className="flex items-center gap-3">
            <Wallet
              size={20}
              style={{ color: "var(--color-accent-amber)" }}
            />
            <span style={{ color: "var(--color-text-secondary)" }}>
              Connect your wallet to view your search receipts.
            </span>
          </Card>
        )}

        {isConnected && (
          <Card className="space-y-2">
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Connected as
            </span>
            <p
              className="font-mono text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              {address}
            </p>
          </Card>
        )}

        {/* Global count */}
        <Card className="space-y-2">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Total Onchain Receipts
          </span>
          {isLoading ? (
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: "var(--color-accent-teal)" }}
            />
          ) : error ? (
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
                style={{ color: "var(--color-status-error)" }}
              />
              <span
                className="text-sm"
                style={{ color: "var(--color-status-error)" }}
              >
                Failed to load receipt count
              </span>
            </div>
          ) : (
            <p
              className="text-3xl font-mono font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {count !== undefined ? Number(count).toLocaleString() : "—"}
            </p>
          )}
        </Card>

        {/* Info */}
        <Card className="space-y-3">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            How Receipts Work
          </h2>
          <div
            className="text-sm space-y-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <p>
              When a paid search query is completed, the server optionally
              records an onchain receipt on the{" "}
              <span className="font-mono" style={{ color: "var(--color-accent-teal)" }}>
                ClawPolySearchReceipt
              </span>{" "}
              contract.
            </p>
            <p>Each receipt contains:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Query Hash</strong> — SHA-256 of the original query
                parameters
              </li>
              <li>
                <strong>Response Hash</strong> — SHA-256 of the full API
                response
              </li>
              <li>
                <strong>Evidence Root</strong> — Merkle-like root of all
                evidence items
              </li>
              <li>
                <strong>URI</strong> — Optional IPFS or HTTP link to the full
                proof bundle
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">Permissionless</Badge>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Anyone can record a receipt — no admin role required.
            </span>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
}
