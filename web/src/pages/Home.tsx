import { Hexagon, Shield, Zap, BookOpen, ArrowRight, Sparkles } from "lucide-react";
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
    glow: "rgba(45, 212, 191, 0.08)",
  },
  {
    icon: Zap,
    title: "x402 Pay-Per-Query",
    description:
      "No API keys, no subscriptions. Pay per query with USDC via EIP-3009 transferWithAuthorization.",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.08)",
  },
  {
    icon: Hexagon,
    title: "Polygon Native",
    description:
      "Built for Polygon mainnet. Fast finality, low fees, and deep integration with PolygonScan data.",
    color: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.08)",
  },
  {
    icon: BookOpen,
    title: "MCP Server Ready",
    description:
      "Standard HTTP+JSON API designed for AI agents. Integrate with any Model Context Protocol server.",
    color: "#2dd4bf",
    glow: "rgba(45, 212, 191, 0.08)",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto space-y-20 py-12">
        {/* Hero */}
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                border: "1px solid rgba(45, 212, 191, 0.3)",
                color: "#2dd4bf",
                background: "rgba(45, 212, 191, 0.08)",
                boxShadow: "0 0 20px rgba(45, 212, 191, 0.1)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              Polygon Mainnet
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span style={{ color: "var(--color-text-primary)" }}>
              Pay-Per-Query
            </span>
            <br />
            <span className="gradient-text-teal">Polygon</span>{" "}
            <span style={{ color: "var(--color-text-primary)" }}>
              Search Engine
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search transactions, addresses, contracts, and logs on Polygon.
            Every answer carries a cryptographic proof bundle. Pay with USDC via
            x402.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar autoFocus size="lg" />
          </motion.div>
        </div>

        {/* Recent searches */}
        <RecentSearches />

        {/* Features */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Sparkles size={14} />
              Features
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <motion.div
                  className="relative group h-full rounded-2xl p-6 space-y-4 overflow-hidden"
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                  whileHover={{
                    borderColor: "var(--color-border-hover)",
                    boxShadow: `0 8px 32px ${f.glow}, 0 0 0 1px rgba(255,255,255,0.03)`,
                    y: -2,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top left, ${f.glow}, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)`,
                        border: `1px solid ${f.color}25`,
                      }}
                    >
                      <f.icon size={22} style={{ color: f.color }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-2">
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-border rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1">
            {[
              { label: "Chain", value: "Polygon", accent: "#a78bfa" },
              { label: "Payment", value: "USDC", accent: "#2dd4bf" },
              { label: "Protocol", value: "x402", accent: "#f59e0b" },
              { label: "Contracts", value: "5 Live", accent: "#22c55e" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-5 rounded-xl"
                style={{ background: "var(--color-bg-card)" }}
              >
                <span
                  className="text-xl md:text-2xl font-bold font-mono"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </span>
                <span
                  className="text-xs mt-1 font-medium tracking-wide uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pricing"
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 no-underline"
            style={{
              background: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
              color: "#06060b",
              boxShadow: "0 4px 24px rgba(45, 212, 191, 0.25)",
            }}
          >
            View Pricing
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/docs"
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 no-underline"
            style={{
              border: "1px solid var(--color-border-hover)",
              color: "var(--color-text-primary)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            Browse Docs
            <BookOpen size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
}
