import { ExternalLink, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="hidden md:block py-10 mt-auto"
      style={{
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Hexagon size={14} style={{ color: "var(--color-accent-teal)", opacity: 0.4 }} />
          <span style={{ color: "var(--color-text-muted)" }}>
            ClawPoly — Pay-Per-Query Polygon Search Engine
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="https://polygonscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 no-underline transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-teal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            PolygonScan
            <ExternalLink size={11} />
          </a>
          <a
            href="https://github.com/jakey78/ClawPoly"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 no-underline transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-teal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            GitHub
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </footer>
  );
}
