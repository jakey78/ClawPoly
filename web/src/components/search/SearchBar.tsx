import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Hash, Wallet, FileCode2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
          className="flex items-center gap-4 rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: focused
              ? "1px solid var(--color-accent-teal)"
              : "1px solid var(--color-border)",
            padding: isLg ? "1rem 1.5rem" : "0.75rem 1rem",
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
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: `${typeInfo.color}12`,
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}20`,
              }}
            >
              <typeInfo.icon size={12} />
              {typeInfo.label}
            </span>
          )}

          <button
            type="submit"
            disabled={!query.trim()}
            className="flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: query.trim() ? "var(--color-accent-teal)" : "transparent",
              color: query.trim() ? "#fff" : "var(--color-text-muted)",
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
            className="absolute z-50 left-0 right-0 mt-3 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="px-5 py-3 text-[11px] font-semibold tracking-widest uppercase"
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
                  className="w-full flex items-center gap-3 px-5 py-3 transition-colors cursor-pointer"
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
