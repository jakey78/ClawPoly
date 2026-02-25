import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="hidden md:block py-6 mt-auto"
      style={{
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-text-muted)",
      }}
    >
      <div className="max-w-7xl mx-auto px-[var(--space-page)] flex items-center justify-between text-xs">
        <span>ClawPoly — Pay-Per-Query Polygon Search Engine</span>
        <div className="flex items-center gap-4">
          <a
            href="https://polygonscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 no-underline transition-colors hover:text-[var(--color-text-secondary)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            PolygonScan
            <ExternalLink size={12} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 no-underline transition-colors hover:text-[var(--color-text-secondary)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            GitHub
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
