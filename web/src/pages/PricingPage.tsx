import { useEffect, useState } from "react";
import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Coins, Loader2, AlertTriangle, Zap } from "lucide-react";

interface EndpointInfo {
  id: string;
  name: string;
  description: string;
  tags: string;
  enabled: boolean;
  price: string;
  priceFormatted: string;
}

export default function PricingPage() {
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/x402/endpoints");
        if (!res.ok) throw new Error("Failed to load endpoints");
        const data = (await res.json()) as { endpoints: EndpointInfo[] };
        setEndpoints(data.endpoints);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatPrice(microUnits: string): string {
    const n = Number(microUnits) / 1e6;
    if (n === 0) return "Free";
    return `$${n.toFixed(4)} USDC`;
  }

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Coins size={24} style={{ color: "var(--color-accent-amber)" }} />
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Pricing
            </h1>
          </div>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Pay per query with USDC on Polygon via the x402 payment protocol.
            No subscriptions, no API keys.
          </p>
        </div>

        {/* How it works */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "var(--color-accent-teal)" }} />
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              How x402 Payment Works
            </h2>
          </div>
          <ol
            className="text-sm space-y-2 list-decimal list-inside"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <li>Send a search request to any paid endpoint.</li>
            <li>
              Receive a <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-elevated)" }}>402 Payment Required</code> response with price details.
            </li>
            <li>
              Sign an EIP-3009 <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-elevated)" }}>transferWithAuthorization</code> for USDC.
            </li>
            <li>
              Retry the request with the <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-elevated)" }}>X-PAYMENT</code> header.
            </li>
            <li>Receive your search results with a proof bundle.</li>
          </ol>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: "var(--color-accent-teal)" }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="flex items-center gap-3">
            <AlertTriangle
              size={20}
              style={{ color: "var(--color-status-error)" }}
            />
            <span style={{ color: "var(--color-status-error)" }}>{error}</span>
          </Card>
        )}

        {/* Endpoint list */}
        {endpoints.length > 0 && (
          <div className="space-y-3">
            {endpoints.map((ep) => (
              <Card
                key={ep.id}
                hover
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {ep.name}
                    </span>
                    {!ep.enabled && <Badge variant="error">Disabled</Badge>}
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {ep.description}
                  </p>
                </div>
                <div
                  className="text-right font-mono font-bold text-sm whitespace-nowrap ml-4"
                  style={{
                    color:
                      Number(ep.price) === 0
                        ? "var(--color-status-success)"
                        : "var(--color-accent-amber)",
                  }}
                >
                  {ep.priceFormatted || formatPrice(ep.price)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
