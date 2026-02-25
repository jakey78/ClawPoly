import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Coins, Loader2, AlertTriangle, Zap, ChevronRight } from "lucide-react";

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
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <Coins size={20} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Pricing
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Pay per query with USDC on Polygon via x402. No subscriptions.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl p-6 space-y-4 overflow-hidden relative"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(45, 212, 191, 0.04), transparent 60%)",
            }}
          />
          <div className="relative flex items-center gap-2">
            <Zap size={16} style={{ color: "#2dd4bf" }} />
            <h2
              className="text-sm font-bold tracking-wide uppercase"
              style={{ color: "#2dd4bf" }}
            >
              How x402 Payment Works
            </h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: "1", text: "Send search request" },
              { step: "2", text: "Receive 402 response" },
              { step: "3", text: "Sign EIP-3009 USDC auth" },
              { step: "4", text: "Retry with payment header" },
              { step: "5", text: "Get results + proof" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(45, 212, 191, 0.1)",
                      color: "#2dd4bf",
                      border: "1px solid rgba(45, 212, 191, 0.2)",
                    }}
                  >
                    {s.step}
                  </div>
                  <span
                    className="text-xs text-center leading-tight"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {s.text}
                  </span>
                </div>
                {i < 4 && (
                  <ChevronRight size={14} className="hidden sm:block flex-shrink-0" style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "#2dd4bf" }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-xl p-4"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <AlertTriangle size={20} style={{ color: "#ef4444" }} />
            <span className="text-sm font-medium" style={{ color: "#ef4444" }}>{error}</span>
          </div>
        )}

        {/* Endpoint list */}
        {endpoints.length > 0 && (
          <div className="space-y-3">
            <div
              className="text-xs font-semibold tracking-widest uppercase px-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Endpoints
            </div>
            {endpoints.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card
                  hover
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="font-mono text-sm font-semibold"
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
                    className="text-right font-mono font-bold text-sm whitespace-nowrap ml-6 px-3 py-1.5 rounded-lg"
                    style={{
                      color:
                        Number(ep.price) === 0
                          ? "#22c55e"
                          : "#f59e0b",
                      background:
                        Number(ep.price) === 0
                          ? "rgba(34, 197, 94, 0.08)"
                          : "rgba(245, 158, 11, 0.08)",
                      border:
                        Number(ep.price) === 0
                          ? "1px solid rgba(34, 197, 94, 0.15)"
                          : "1px solid rgba(245, 158, 11, 0.15)",
                    }}
                  >
                    {ep.priceFormatted || formatPrice(ep.price)}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
