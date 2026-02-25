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
      <section className="flex flex-col items-center text-center px-8 sm:px-12 lg:px-20 pt-20 sm:pt-32 md:pt-44 pb-28 sm:pb-40 md:pb-52">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] max-w-3xl"
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
          className="mt-8 md:mt-10 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Search transactions, addresses, contracts, and logs on Polygon.
          Every answer carries a cryptographic proof. Pay with USDC via x402.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--color-text-primary)", color: "var(--color-bg-primary)" }}
          >
            View Pricing
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium no-underline transition-colors"
            style={{ border: "1px solid var(--color-border-hover)", color: "var(--color-text-secondary)" }}
          >
            Browse Docs
          </Link>
        </motion.div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full" style={{ height: 1, background: "var(--color-border)" }} />

      {/* ===== SEARCH ===== */}
      <section
        className="w-full py-20 sm:py-28 md:py-36"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-2xl mx-auto px-8 sm:px-12 text-center">
          <p
            className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Try it now
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-12"
            style={{ color: "var(--color-text-primary)" }}
          >
            Search the Polygon network
          </h2>
          <SearchBar autoFocus size="lg" />
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full" style={{ height: 1, background: "var(--color-border)" }} />

      {/* ===== STATS ===== */}
      <section className="w-full py-20 sm:py-28 md:py-36 px-8 sm:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 text-center">
          {[
            { label: "Chain", value: "Polygon" },
            { label: "Payment", value: "USDC" },
            { label: "Protocol", value: "x402" },
            { label: "Contracts", value: "5 Live" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold font-mono" style={{ color: "var(--color-text-primary)" }}>
                {s.value}
              </p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full" style={{ height: 1, background: "var(--color-border)" }} />

      {/* ===== FEATURES ===== */}
      <section
        className="w-full py-20 sm:py-28 md:py-36"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center mb-16 md:mb-24">
            <p
              className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-5"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl p-10 md:p-12"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-7"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <f.icon size={22} style={{ color: "var(--color-accent-teal)" }} />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-[1.8]" style={{ color: "var(--color-text-secondary)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full" style={{ height: 1, background: "var(--color-border)" }} />

      {/* ===== CTA ===== */}
      <section className="w-full py-24 sm:py-36 md:py-48 px-8 sm:px-12 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6"
          style={{ color: "var(--color-text-primary)" }}
        >
          Ready to start querying?
        </h2>
        <p
          className="text-base sm:text-lg max-w-lg mx-auto mb-12 md:mb-16 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          View endpoint pricing or explore our documentation to integrate
          ClawPoly into your AI agent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--color-text-primary)", color: "var(--color-bg-primary)" }}
          >
            View Pricing
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium no-underline transition-colors"
            style={{ border: "1px solid var(--color-border-hover)", color: "var(--color-text-secondary)" }}
          >
            Browse Docs
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}
