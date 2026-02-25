import { Shield, Zap, BookOpen, ArrowRight, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SearchBar from "@/components/search/SearchBar";

const FEATURES = [
  {
    icon: Shield,
    title: "Proof-Carrying Answers",
    desc: "Every response includes a SHA-256 proof bundle with evidence chain, independently verifiable onchain.",
  },
  {
    icon: Zap,
    title: "x402 Pay-Per-Query",
    desc: "No API keys, no subscriptions. Pay per query with USDC via EIP-3009 transferWithAuthorization.",
  },
  {
    icon: Hexagon,
    title: "Polygon Native",
    desc: "Built for Polygon mainnet. Fast finality, low fees, and deep integration with PolygonScan data.",
  },
  {
    icon: BookOpen,
    title: "MCP Server Ready",
    desc: "Standard HTTP+JSON API designed for AI agents. Integrate with any Model Context Protocol server.",
  },
];

export default function Home() {
  return (
    <AnimatedPage>
      {/* ===== HERO ===== */}
      <section className="flex flex-col items-center text-center pt-16 sm:pt-24 md:pt-36 pb-24 sm:pb-32 md:pb-44 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.1] max-w-3xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Pay-per-query{" "}
          <span style={{ color: "var(--color-accent-teal)" }}>Polygon</span>{" "}
          search engine
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 md:mt-8 text-base sm:text-lg max-w-xl leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Search transactions, addresses, contracts, and logs on Polygon.
          Every answer carries a cryptographic proof. Pay with USDC via x402.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--color-text-primary)", color: "var(--color-bg-primary)" }}
          >
            View Pricing
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium no-underline transition-colors"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          >
            Browse Docs
          </Link>
        </motion.div>
      </section>

      {/* ===== SEARCH ===== */}
      <section
        className="py-16 sm:py-24 md:py-32"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Try it now
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-10"
            style={{ color: "var(--color-text-primary)" }}
          >
            Search the Polygon network
          </h2>
          <SearchBar autoFocus size="lg" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 sm:py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { label: "Chain", value: "Polygon" },
            { label: "Payment", value: "USDC" },
            { label: "Protocol", value: "x402" },
            { label: "Contracts", value: "5 Live" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: "var(--color-text-primary)" }}>
                {s.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section
        className="py-16 sm:py-24 md:py-32"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <p
              className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Why ClawPoly
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Built for AI Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl p-8 md:p-10"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <f.icon size={20} style={{ color: "var(--color-accent-teal)" }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 sm:py-28 md:py-36 px-6 text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Ready to start querying?
        </h2>
        <p
          className="text-base max-w-md mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          View endpoint pricing or explore our documentation to integrate
          ClawPoly into your AI agent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--color-text-primary)", color: "var(--color-bg-primary)" }}
          >
            View Pricing
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium no-underline transition-colors"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          >
            Browse Docs
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}
