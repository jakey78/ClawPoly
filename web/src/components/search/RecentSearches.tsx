import { Clock, X, Hash, Wallet, FileCode2, Search } from "lucide-react";
import { useRecentSearches, type RecentSearch } from "@/hooks/useRecentSearches";
import { useNavigate } from "react-router-dom";
import type { SearchType } from "@/hooks/useSearch";

const TYPE_ICONS: Record<SearchType, typeof Hash> = {
  tx: Hash,
  address: Wallet,
  contract: FileCode2,
  logs: Search,
};

function shortenQuery(q: string): string {
  if (q.length <= 20) return q;
  return `${q.slice(0, 10)}...${q.slice(-8)}`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentSearches() {
  const { searches, removeSearch, clearAll } = useRecentSearches();
  const navigate = useNavigate();

  if (searches.length === 0) return null;

  function handleClick(s: RecentSearch) {
    if (s.type === "tx") {
      navigate(`/tx/${s.query}`);
    } else {
      navigate(`/address/${s.query}`);
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock size={14} style={{ color: "var(--color-text-muted)" }} />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Recent Searches
          </span>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs cursor-pointer transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-status-error)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-muted)")
          }
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {searches.slice(0, 10).map((s) => {
          const Icon = TYPE_ICONS[s.type];
          return (
            <div
              key={`${s.type}-${s.query}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs group cursor-pointer transition-colors"
              style={{
                backgroundColor: "var(--color-bg-card)",
                borderColor: "var(--color-border-default)",
              }}
              onClick={() => handleClick(s)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  "var(--color-accent-teal)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  "var(--color-border-default)")
              }
            >
              <Icon size={12} style={{ color: "var(--color-accent-teal)" }} />
              <span
                className="font-mono"
                style={{ color: "var(--color-text-primary)" }}
              >
                {shortenQuery(s.query)}
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>
                {timeAgo(s.timestamp)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearch(s.query, s.type);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: "var(--color-text-muted)" }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
