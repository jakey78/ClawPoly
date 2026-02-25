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
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--color-border)",
      }}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-[72px] px-4">
        {NAV_ITEMS.map(({ path, label, icon: Icon, center }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path === "/search" ? "/" : path}
              className="flex flex-col items-center justify-center no-underline min-w-[52px] min-h-[52px] rounded-2xl transition-all duration-200"
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
                  className="flex items-center justify-center w-14 h-14 rounded-full -mt-6"
                  style={{
                    background: "var(--color-accent-teal)",
                  }}
                >
                  <Icon size={22} color="#fff" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon size={20} />
                  <span className="text-[10px] mt-1 font-medium">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
