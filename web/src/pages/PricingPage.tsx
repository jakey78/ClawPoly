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
      <div className="max-w-3xl mx-auto flex flex-col px-6 sm:px-10 lg:px-16 pt-8 md:pt-14">
        {/* Header */}
        <section className="pt-4 pb-14 md:pb-20">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(180, 83, 9, 0.06)",
                border: "1px solid rgba(180, 83, 9, 0.15)",
              }}
            >
              <Coins size={22} style={{ color: "var(--color-accent-amber)" }} />
            </div>
            <div>
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Pricing
              </h1>
            </div>
          </div>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Pay per query with USDC on Polygon via x402. No subscriptions, no
            API keys. Just send a request and pay for what you use.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-14 md:mb-20">
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-8">
              <Zap size={16} style={{ color: "var(--color-accent-teal)" }} />
              <h2
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: "var(--color-accent-teal)" }}
              >
                How x402 Payment Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { step: "1", text: "Send search request" },
                { step: "2", text: "Receive 402 response" },
                { step: "3", text: "Sign EIP-3009 USDC auth" },
                { step: "4", text: "Retry with payment header" },
                { step: "5", text: "Get results + proof" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "rgba(13, 148, 136, 0.06)",
                        color: "var(--color-accent-teal)",
                        border: "1px solid rgba(13, 148, 136, 0.12)",
                      }}
                    >
                      {s.step}
                    </div>
                    <span
                      className="text-xs text-center leading-snug"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {s.text}
                    </span>
                  </div>
                  {i < 4 && (
                    <ChevronRight
                      size={14}
                      className="hidden sm:block flex-shrink-0"
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "var(--color-accent-teal)" }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-2xl p-5 mb-10"
            style={{
              background: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            <AlertTriangle size={20} style={{ color: "#ef4444" }} />
            <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
              {error}
            </span>
          </div>
        )}

        {/* Endpoint list */}
        {endpoints.length > 0 && (
          <section className="pb-8">
            <div
              className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "var(--color-text-muted)" }}
            >
              Endpoints
            </div>
            <div className="flex flex-col gap-4">
              {endpoints.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Card hover className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-sm font-semibold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {ep.name}
                        </span>
                        {!ep.enabled && <Badge variant="error">Disabled</Badge>}
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {ep.description}
                      </p>
                    </div>
                    <div
                      className="text-right font-mono font-bold text-sm whitespace-nowrap ml-8 px-4 py-2 rounded-full"
                      style={{
                        color:
                          Number(ep.price) === 0 ? "var(--color-status-success)" : "var(--color-accent-amber)",
                        background:
                          Number(ep.price) === 0
                            ? "rgba(22, 163, 74, 0.06)"
                            : "rgba(180, 83, 9, 0.06)",
                        border:
                          Number(ep.price) === 0
                            ? "1px solid rgba(22, 163, 74, 0.12)"
                            : "1px solid rgba(180, 83, 9, 0.12)",
                      }}
                    >
                      {ep.priceFormatted || formatPrice(ep.price)}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AnimatedPage>
  );
}
