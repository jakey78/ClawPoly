import { Hexagon, Shield, Zap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SearchBar from "@/components/search/SearchBar";
import RecentSearches from "@/components/search/RecentSearches";
import Card from "@/components/ui/Card";

const FEATURES = [
  {
    icon: Shield,
    title: "Proof-Carrying Answers",
    description:
      "Every response includes a SHA-256 proof bundle with evidence chain, independently verifiable onchain.",
    color: "var(--color-accent-teal)",
  },
  {
    icon: Zap,
    title: "x402 Pay-Per-Query",
    description:
      "No API keys, no subscriptions. Pay per query with USDC via EIP-3009 transferWithAuthorization.",
    color: "var(--color-accent-amber)",
  },
  {
    icon: Hexagon,
    title: "Polygon Native",
    description:
      "Built for Polygon mainnet. Fast finality, low fees, and deep integration with PolygonScan data.",
    color: "var(--color-accent-purple)",
  },
  {
    icon: BookOpen,
    title: "MCP Server Ready",
    description:
      "Standard HTTP+JSON API designed for AI agents. Integrate with any Model Context Protocol server.",
    color: "var(--color-accent-teal)",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Home() {
  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto space-y-16 py-8">
        {/* Hero */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-6"
              style={{
                borderColor: "var(--color-accent-teal)",
                color: "var(--color-accent-teal)",
                backgroundColor:
                  "color-mix(in srgb, var(--color-accent-teal) 10%, transparent)",
              }}
            >
              <Hexagon size={12} />
              Polygon Mainnet
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Pay-Per-Query{" "}
            <span style={{ color: "var(--color-accent-teal)" }}>Polygon</span>{" "}
            Search Engine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search transactions, addresses, contracts, and logs on Polygon. Every
            answer carries a cryptographic proof bundle. Pay with USDC via x402.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <SearchBar autoFocus size="lg" className="max-w-2xl mx-auto" />
          </motion.div>
        </div>

        {/* Recent searches */}
        <RecentSearches />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card hover className="space-y-3 h-full">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${f.color} 15%, transparent)`,
                  }}
                >
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {f.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pricing"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-accent-teal)",
              color: "var(--color-bg-base)",
            }}
          >
            View Pricing
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/docs"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border transition-colors"
            style={{
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          >
            Browse Docs
            <BookOpen size={16} />
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
}
