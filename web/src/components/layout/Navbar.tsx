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
        background: "rgba(6, 6, 11, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline"
          aria-label="ClawPoly Home"
        >
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <polygon
                points="16,2 28,9 28,23 16,30 4,23 4,9"
                stroke="#2dd4bf"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="16" cy="16" r="3" fill="#2dd4bf" />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Claw<span style={{ color: "#2dd4bf" }}>Poly</span>
          </span>
        </Link>

        {/* Center nav — pill container */}
        <nav
          className="flex items-center gap-1 px-1.5 py-1.5 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--color-border)",
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive =
              location.pathname === path ||
              (path !== "/" && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 no-underline"
                style={{
                  color: isActive ? "#06060b" : "var(--color-text-secondary)",
                  background: isActive
                    ? "#2dd4bf"
                    : "transparent",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={14} />
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
