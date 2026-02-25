import { useParams } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SearchBar from "@/components/search/SearchBar";
import { useSearch } from "@/hooks/useSearch";
import { SkeletonCard } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProofBundle from "@/components/evidence/ProofBundle";
import CopyButton from "@/components/evidence/CopyButton";
import {
  Hash,
  ArrowRight,
  Clock,
  Fuel,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function TransactionPage() {
  const { hash } = useParams<{ hash: string }>();

  const { data, isLoading, error } = useSearch({
    query: hash || "",
    type: "tx",
    enabled: !!hash,
  });

  const result = data?.data as Record<string, unknown> | undefined;
  const txData = result?.data as Record<string, unknown> | undefined;
  const proofBundle = result?.proof as Record<string, unknown> | undefined;

  const tx = txData?.transaction as Record<string, unknown> | undefined;
  const receipt = txData?.receipt as Record<string, unknown> | undefined;
  const success = receipt?.status === "0x1" || receipt?.status === 1;

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 px-6 sm:px-10 lg:px-16 pt-8 md:pt-14">
        <SearchBar size="sm" />

        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Hash size={24} style={{ color: "var(--color-accent-teal)" }} />
          <h1
            className="text-xl font-bold font-mono truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            Transaction
          </h1>
          {receipt && (
            <Badge variant={success ? "success" : "error"}>
              {success ? "Success" : "Failed"}
            </Badge>
          )}
        </div>

        {/* Hash */}
        {hash && (
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono truncate"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {hash}
            </span>
            <CopyButton text={hash} />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="flex items-center gap-3">
            <AlertTriangle
              size={20}
              style={{ color: "var(--color-status-error)" }}
            />
            <span style={{ color: "var(--color-status-error)" }}>
              {error.message}
            </span>
          </Card>
        )}

        {/* Transaction Details */}
        {tx && (
          <Card className="space-y-4">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Status */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>Status</span>
                <div className="flex items-center gap-2">
                  {success ? (
                    <CheckCircle2
                      size={16}
                      style={{ color: "var(--color-status-success)" }}
                    />
                  ) : (
                    <XCircle
                      size={16}
                      style={{ color: "var(--color-status-error)" }}
                    />
                  )}
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {success ? "Success" : "Failed"}
                  </span>
                </div>
              </div>

              {/* Block */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>Block</span>
                <p
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {tx.blockNumber ? Number(tx.blockNumber).toLocaleString() : "Pending"}
                </p>
              </div>

              {/* From */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>From</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`/address/${tx.from}`}
                    className="font-mono text-sm"
                    style={{ color: "var(--color-accent-teal)" }}
                  >
                    {String(tx.from)}
                  </a>
                  <CopyButton text={String(tx.from)} />
                </div>
              </div>

              {/* To */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>
                  <ArrowRight size={12} className="inline mr-1" />
                  To
                </span>
                <div className="flex items-center gap-2">
                  {tx.to ? (
                    <>
                      <a
                        href={`/address/${tx.to}`}
                        className="font-mono text-sm"
                        style={{ color: "var(--color-accent-teal)" }}
                      >
                        {String(tx.to)}
                      </a>
                      <CopyButton text={String(tx.to)} />
                    </>
                  ) : (
                    <Badge variant="warning">Contract Creation</Badge>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>Value</span>
                <p
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {String(tx.value)} wei
                </p>
              </div>

              {/* Gas */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>
                  <Fuel size={12} className="inline mr-1" />
                  Gas Used
                </span>
                <p
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {receipt?.gasUsed
                    ? Number(receipt.gasUsed).toLocaleString()
                    : "—"}
                </p>
              </div>

              {/* Nonce */}
              <div className="space-y-1">
                <span style={{ color: "var(--color-text-muted)" }}>
                  <Clock size={12} className="inline mr-1" />
                  Nonce
                </span>
                <p
                  className="font-mono"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {String(tx.nonce)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Logs */}
        {receipt && Array.isArray(receipt.logs) && (receipt.logs as unknown[]).length > 0 && (
          <Card className="space-y-3">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Logs ({(receipt.logs as unknown[]).length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(receipt.logs as Array<Record<string, unknown>>).map(
                (log, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border text-xs font-mono space-y-1"
                    style={{
                      backgroundColor: "var(--color-bg-elevated)",
                      borderColor: "var(--color-border-subtle)",
                    }}
                  >
                    <div style={{ color: "var(--color-text-muted)" }}>
                      Log #{i}
                    </div>
                    <div style={{ color: "var(--color-text-primary)" }}>
                      Address: {String(log.address)}
                    </div>
                    {Array.isArray(log.topics) &&
                      (log.topics as string[]).map((t, j) => (
                        <div
                          key={j}
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Topic[{j}]: {t}
                        </div>
                      ))}
                  </div>
                ),
              )}
            </div>
          </Card>
        )}

        {/* Proof Bundle */}
        {proofBundle && <ProofBundle proof={proofBundle as never} />}
      </div>
    </AnimatedPage>
  );
}
