import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Hash, Wallet, FileCode2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { detectSearchType, type SearchType } from "@/hooks/useSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";

const TYPE_CONFIG: Record<SearchType, { icon: typeof Hash; label: string; color: string }> = {
  tx: { icon: Hash, label: "Transaction", color: "var(--color-accent-teal)" },
  address: { icon: Wallet, label: "Address", color: "var(--color-accent-amber)" },
  contract: { icon: FileCode2, label: "Contract", color: "var(--color-accent-purple)" },
  logs: { icon: Search, label: "Logs", color: "var(--color-text-muted)" },
};

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  size?: "sm" | "lg";
}

export default function SearchBar({
  className = "",
  autoFocus = false,
  size = "lg",
}: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searches } = useRecentSearches();

  const detected = query.trim() ? detectSearchType(query.trim()) : null;
  const typeInfo = detected ? TYPE_CONFIG[detected] : null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const type = detectSearchType(q);
    if (type === "tx") {
      navigate(`/tx/${q}`);
    } else {
      navigate(`/address/${q}`);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  function handleRecentClick(q: string, type: SearchType) {
    if (type === "tx") {
      navigate(`/tx/${q}`);
    } else {
      navigate(`/address/${q}`);
    }
  }

  const isLg = size === "lg";

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-3 rounded-2xl transition-all duration-300"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: focused
              ? "1px solid rgba(45, 212, 191, 0.5)"
              : "1px solid var(--color-border)",
            boxShadow: focused
              ? "0 0 0 4px rgba(45, 212, 191, 0.08), 0 8px 32px rgba(45, 212, 191, 0.06)"
              : "0 2px 8px rgba(0,0,0,0.2)",
            padding: isLg ? "0.875rem 1.25rem" : "0.625rem 0.875rem",
          }}
        >
          <Search
            size={isLg ? 20 : 16}
            style={{
              color: focused
                ? "var(--color-accent-teal)"
                : "var(--color-text-muted)",
              flexShrink: 0,
              transition: "color 0.2s",
            }}
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search by address, tx hash, or contract..."
            autoFocus={autoFocus}
            className="flex-1 bg-transparent outline-none font-mono placeholder:text-[var(--color-text-muted)]"
            style={{
              color: "var(--color-text-primary)",
              fontSize: isLg ? "1rem" : "0.875rem",
            }}
          />

          {typeInfo && (
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: `${typeInfo.color}15`,
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}25`,
              }}
            >
              <typeInfo.icon size={12} />
              {typeInfo.label}
            </div>
          )}

          <button
            type="submit"
            disabled={!query.trim()}
            className="p-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: query.trim()
                ? "linear-gradient(135deg, #2dd4bf, #14b8a6)"
                : "transparent",
              color: query.trim()
                ? "#06060b"
                : "var(--color-text-muted)",
              boxShadow: query.trim()
                ? "0 2px 8px rgba(45, 212, 191, 0.3)"
                : "none",
            }}
          >
            <ArrowRight size={isLg ? 18 : 14} />
          </button>
        </div>
      </form>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {focused && !query.trim() && searches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="px-4 py-2.5 text-xs font-semibold tracking-wide uppercase"
              style={{
                color: "var(--color-text-muted)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Recent Searches
            </div>
            {searches.slice(0, 5).map((s) => {
              const cfg = TYPE_CONFIG[s.type];
              return (
                <button
                  key={`${s.type}-${s.query}`}
                  type="button"
                  onMouseDown={() => handleRecentClick(s.query, s.type)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer"
                  style={{ color: "var(--color-text-primary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-bg-card-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <cfg.icon size={14} style={{ color: cfg.color }} />
                  <span className="font-mono text-sm truncate">{s.query}</span>
                  <span
                    className="text-xs ml-auto font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
