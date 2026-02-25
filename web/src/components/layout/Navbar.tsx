import { Link, useLocation } from "react-router-dom";
import { Search, FileText, DollarSign, Receipt, Shield } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Search", icon: Search },
  { path: "/docs", label: "Docs", icon: FileText },
  { path: "/pricing", label: "Pricing", icon: DollarSign },
  { path: "/receipts", label: "Receipts", icon: Receipt },
  { path: "/admin", label: "Admin", icon: Shield },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header
      className="sticky top-0 z-50 hidden md:block"
      style={{
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-[var(--space-page)] flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          aria-label="ClawPoly Home"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="#2dd4bf" strokeWidth="2" fill="none" />
            <polygon points="16,6 24,11 24,21 16,26 8,21 8,11" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="16" cy="16" r="3" fill="#2dd4bf" />
          </svg>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            ClawPoly
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
                style={{
                  color: isActive ? "var(--color-accent-teal)" : "var(--color-text-secondary)",
                  background: isActive ? "rgba(45, 212, 191, 0.08)" : "transparent",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connect */}
        <div className="flex items-center">
          <appkit-button />
        </div>
      </div>
    </header>
  );
}
