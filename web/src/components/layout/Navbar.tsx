import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Search" },
  { path: "/docs", label: "Docs" },
  { path: "/pricing", label: "Pricing" },
  { path: "/receipts", label: "Receipts" },
  { path: "/admin", label: "Admin" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 hidden md:flex justify-center pt-5 pb-4">
      <nav
        className="flex items-center gap-2 px-3 py-2 rounded-full"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 no-underline"
          aria-label="ClawPoly Home"
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              stroke="#0d9488"
              strokeWidth="2.5"
              fill="none"
            />
            <circle cx="16" cy="16" r="3" fill="#0d9488" />
          </svg>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            ClawPoly
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

        {/* Links */}
        {NAV_ITEMS.map(({ path, label }) => {
          const isActive =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className="px-3.5 py-1.5 rounded-full text-sm transition-colors duration-150 no-underline"
              style={{
                color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                fontWeight: isActive ? 600 : 400,
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

        {/* Wallet CTA */}
        <div className="flex items-center pl-1">
          <appkit-button />
        </div>
      </nav>
    </header>
  );
}
