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
  Wallet,
  ArrowUpDown,
  Coins,
  AlertTriangle,
  Users,
} from "lucide-react";

export default function AddressPage() {
  const { address } = useParams<{ address: string }>();

  const { data, isLoading, error, searchType } = useSearch({
    query: address || "",
    type: "address",
    enabled: !!address,
  });

  const result = data?.data as Record<string, unknown> | undefined;
  const addressData = result?.data as Record<string, unknown> | undefined;
  const proofBundle = result?.proof as Record<string, unknown> | undefined;

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 px-6 sm:px-10 lg:px-16 pt-8 md:pt-14">
        <SearchBar size="sm" />

        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Wallet size={24} style={{ color: "var(--color-accent-amber)" }} />
          <h1
            className="text-xl font-bold font-mono truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {address}
          </h1>
          {address && <CopyButton text={address} />}
          <Badge variant="info">{searchType}</Badge>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
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

        {/* Results */}
        {addressData && (
          <div className="space-y-4">
            {/* Balance */}
            {addressData.balance !== undefined && (
              <Card className="space-y-2">
                <div className="flex items-center gap-2">
                  <Coins
                    size={16}
                    style={{ color: "var(--color-accent-teal)" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Balance
                  </span>
                </div>
                <p
                  className="text-2xl font-mono font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {String(addressData.balance)} POL
                </p>
              </Card>
            )}

            {/* Transactions */}
            {Array.isArray(addressData.transactions) && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown
                    size={16}
                    style={{ color: "var(--color-accent-teal)" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Recent Transactions
                  </span>
                  <Badge variant="default">
                    {(addressData.transactions as unknown[]).length}
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr
                        style={{
                          color: "var(--color-text-muted)",
                          borderBottom:
                            "1px solid var(--color-border-default)",
                        }}
                      >
                        <th className="text-left py-2 pr-4">Hash</th>
                        <th className="text-left py-2 pr-4">From</th>
                        <th className="text-left py-2 pr-4">To</th>
                        <th className="text-right py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        addressData.transactions as Array<
                          Record<string, string>
                        >
                      )
                        .slice(0, 20)
                        .map((tx) => (
                          <tr
                            key={tx.hash}
                            style={{
                              borderBottom:
                                "1px solid var(--color-border-subtle)",
                            }}
                          >
                            <td className="py-2 pr-4 font-mono">
                              <a
                                href={`/tx/${tx.hash}`}
                                style={{
                                  color: "var(--color-accent-teal)",
                                }}
                              >
                                {tx.hash?.slice(0, 10)}...
                              </a>
                            </td>
                            <td
                              className="py-2 pr-4 font-mono"
                              style={{
                                color: "var(--color-text-primary)",
                              }}
                            >
                              {tx.from?.slice(0, 10)}...
                            </td>
                            <td
                              className="py-2 pr-4 font-mono"
                              style={{
                                color: "var(--color-text-primary)",
                              }}
                            >
                              {tx.to?.slice(0, 10)}...
                            </td>
                            <td
                              className="py-2 text-right font-mono"
                              style={{
                                color: "var(--color-text-primary)",
                              }}
                            >
                              {tx.value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Counterparties */}
            {Array.isArray(addressData.counterparties) &&
              (addressData.counterparties as string[]).length > 0 && (
                <Card className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      style={{ color: "var(--color-accent-purple)" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Top Counterparties
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(addressData.counterparties as string[])
                      .slice(0, 20)
                      .map((cp) => (
                        <a
                          key={cp}
                          href={`/address/${cp}`}
                          className="font-mono text-xs px-2 py-1 rounded-md border transition-colors"
                          style={{
                            borderColor: "var(--color-border-default)",
                            color: "var(--color-accent-teal)",
                          }}
                        >
                          {cp.slice(0, 8)}...{cp.slice(-6)}
                        </a>
                      ))}
                  </div>
                </Card>
              )}
          </div>
        )}

        {/* Proof Bundle */}
        {proofBundle && <ProofBundle proof={proofBundle as never} />}
      </div>
    </AnimatedPage>
  );
}
