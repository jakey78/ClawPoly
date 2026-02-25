import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useDocsSearch } from "@/hooks/useDocsSearch";
import { BookOpen, Search, ExternalLink, Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function DocsPage() {
  const { query, setQuery, results, loading, error } = useDocsSearch();

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto flex flex-col">
        {/* Header */}
        <section className="pt-4 pb-10 md:pb-14">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen
              size={24}
              style={{ color: "var(--color-accent-teal)" }}
            />
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Polygon Docs
            </h1>
            <Badge variant="success">Free</Badge>
          </div>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search the curated Polygon knowledge base. No wallet or payment
            required.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <Input
            label=""
            placeholder="Search Polygon docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: "var(--color-text-muted)" }}
              />
            ) : (
              <Search
                size={16}
                style={{ color: "var(--color-text-muted)" }}
              />
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card>
            <span style={{ color: "var(--color-status-error)" }}>{error}</span>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4 mt-8">
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>

            {results.map((doc) => (
              <Card key={doc.id} hover className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {doc.title}
                  </h3>
                  <Badge variant="default">{doc.category}</Badge>
                </div>
                <p
                  className="text-xs line-clamp-3"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {doc.body}
                </p>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs"
                    style={{ color: "var(--color-accent-teal)" }}
                  >
                    Read more <ExternalLink size={12} />
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && query.trim() && results.length === 0 && !error && (
          <div
            className="text-center py-20"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Search size={40} className="mx-auto mb-3 opacity-50" />
            <p>No results found for "{query}"</p>
          </div>
        )}

        {/* Idle state */}
        {!query.trim() && (
          <div
            className="text-center py-20"
            style={{ color: "var(--color-text-muted)" }}
          >
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
            <p>Start typing to search Polygon documentation</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
