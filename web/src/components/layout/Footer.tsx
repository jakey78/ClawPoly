import { ExternalLink, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="hidden md:block py-8 mt-auto"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "rgba(6, 6, 11, 0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-[var(--space-page)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Hexagon size={14} style={{ color: "#2dd4bf", opacity: 0.5 }} />
          <span style={{ color: "var(--color-text-muted)" }}>
            ClawPoly — Pay-Per-Query Polygon Search Engine
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://polygonscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 no-underline transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2dd4bf")}
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
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2dd4bf")}
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
