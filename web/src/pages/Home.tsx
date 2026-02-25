import { Shield, Zap, BookOpen, ArrowRight, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SearchBar from "@/components/search/SearchBar";
import RecentSearches from "@/components/search/RecentSearches";

const FEATURES = [
  {
    icon: Shield,
    title: "Proof-Carrying Answers",
    description:
      "Every response includes a SHA-256 proof bundle with evidence chain, independently verifiable onchain.",
    color: "#2dd4bf",
  },
  {
    icon: Zap,
    title: "x402 Pay-Per-Query",
    description:
      "No API keys, no subscriptions. Pay per query with USDC via EIP-3009 transferWithAuthorization.",
    color: "#f59e0b",
  },
  {
    icon: Hexagon,
    title: "Polygon Native",
    description:
      "Built for Polygon mainnet. Fast finality, low fees, and deep integration with PolygonScan data.",
    color: "#a78bfa",
  },
  {
    icon: BookOpen,
    title: "MCP Server Ready",
    description:
      "Standard HTTP+JSON API designed for AI agents. Integrate with any Model Context Protocol server.",
    color: "#2dd4bf",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <AnimatedPage>
      <div className="flex flex-col">
        {/* ============ HERO ============ */}
        <section className="flex flex-col items-center text-center pt-12 md:pt-24 pb-20 md:pb-32">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                border: "1px solid rgba(45, 212, 191, 0.25)",
                color: "#2dd4bf",
                background: "rgba(45, 212, 191, 0.06)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              Live on Polygon
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Pay-Per-Query
            <br />
            <span className="gradient-text-teal">Polygon</span> Search Engine
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-12"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search transactions, addresses, contracts, and logs on Polygon.
            Every answer carries a cryptographic proof. Pay with USDC via x402.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-xl mb-6"
          >
            <SearchBar autoFocus size="lg" />
          </motion.div>

          <RecentSearches />
        </section>

        {/* ============ DIVIDER ============ */}
        <div
          className="w-full h-px mb-20 md:mb-28"
          style={{ background: "var(--color-border)" }}
        />

        {/* ============ STATS ============ */}
        <section className="mb-20 md:mb-28">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-border)",
            }}
          >
            {[
              { label: "Chain", value: "Polygon", accent: "#a78bfa" },
              { label: "Payment", value: "USDC", accent: "#2dd4bf" },
              { label: "Protocol", value: "x402", accent: "#f59e0b" },
              { label: "Contracts", value: "5 Live", accent: "#22c55e" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-8 md:py-10"
                style={{ background: "var(--color-bg-card)" }}
              >
                <span
                  className="text-2xl md:text-3xl font-bold font-mono mb-1.5"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </span>
                <span
                  className="text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section className="mb-20 md:mb-28">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Why ClawPoly
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Built for AI Agents
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div
                  className="rounded-2xl p-8 md:p-10 h-full transition-colors duration-200"
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-hover)";
                    e.currentTarget.style.background = "var(--color-bg-card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.background = "var(--color-bg-card)";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `${f.color}12`,
                      border: `1px solid ${f.color}20`,
                    }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ DIVIDER ============ */}
        <div
          className="w-full h-px mb-20 md:mb-28"
          style={{ background: "var(--color-border)" }}
        />

        {/* ============ CTA ============ */}
        <section className="flex flex-col items-center text-center pb-12 md:pb-24">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Ready to start querying?
          </h2>
          <p
            className="text-sm sm:text-base max-w-md mb-10 leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            View endpoint pricing or explore our documentation to integrate
            ClawPoly into your AI agent.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/pricing"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 no-underline"
              style={{
                background: "#2dd4bf",
                color: "#06060b",
              }}
            >
              View Pricing
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 no-underline"
              style={{
                border: "1px solid var(--color-border-hover)",
                color: "var(--color-text-primary)",
                background: "transparent",
              }}
            >
              Browse Docs
            </Link>
          </div>
        </section>
      </div>
    </AnimatedPage>
  );
}
