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
        background: "rgba(6, 6, 11, 0.92)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        borderTop: "1px solid rgba(26, 26, 46, 0.8)",
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
              className="flex flex-col items-center justify-center no-underline min-w-[48px] min-h-[48px] rounded-xl transition-all duration-200"
              style={{
                color: isActive
                  ? "#2dd4bf"
                  : "var(--color-text-muted)",
              }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {center ? (
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl -mt-5"
                  style={{
                    background: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
                    boxShadow: "0 4px 24px rgba(45, 212, 191, 0.35)",
                  }}
                >
                  <Icon size={22} color="#06060b" strokeWidth={2.5} />
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
