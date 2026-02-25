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
        background: "rgba(6, 6, 11, 0.8)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        borderBottom: "1px solid rgba(26, 26, 46, 0.8)",
      }}
    >
      <div className="max-w-7xl mx-auto px-[var(--space-page)] flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline group"
          aria-label="ClawPoly Home"
        >
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="#2dd4bf" strokeWidth="2" fill="none" />
              <polygon points="16,6 24,11 24,21 16,26 8,21 8,11" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.5" />
              <circle cx="16" cy="16" r="3" fill="#2dd4bf" />
            </svg>
            <div
              className="absolute inset-0 rounded-full opacity-40 blur-md"
              style={{ background: "rgba(45, 212, 191, 0.3)" }}
            />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Claw<span style={{ color: "#2dd4bf" }}>Poly</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
                style={{
                  color: isActive ? "#2dd4bf" : "var(--color-text-secondary)",
                  background: isActive ? "rgba(45, 212, 191, 0.1)" : "transparent",
                  boxShadow: isActive ? "0 0 12px rgba(45, 212, 191, 0.08)" : "none",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={15} />
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
