import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Search, Receipt, Wallet } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/docs", label: "Docs", icon: FileText },
  { path: "/search", label: "Search", icon: Search, center: true },
  { path: "/receipts", label: "Receipts", icon: Receipt },
  { path: "/pricing", label: "Wallet", icon: Wallet },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--color-border)",
      }}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ path, label, icon: Icon, center }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path === "/search" ? "/" : path}
              className="flex flex-col items-center justify-center no-underline min-w-[48px] min-h-[48px] rounded-xl transition-colors"
              style={{
                color: isActive
                  ? "var(--color-accent-teal)"
                  : "var(--color-text-muted)",
              }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {center ? (
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full -mt-4"
                  style={{
                    background: "var(--color-accent-teal)",
                    boxShadow: "0 4px 20px rgba(45, 212, 191, 0.3)",
                  }}
                >
                  <Icon size={22} color="#0a0a0f" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon size={20} />
                  <span className="text-[10px] mt-0.5 font-medium">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
