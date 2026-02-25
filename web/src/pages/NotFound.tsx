import { Link } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <AnimatedPage>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div
          className="text-8xl font-mono font-bold mb-6"
          style={{ color: "var(--color-accent-teal)" }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Page Not Found
        </h1>
        <p
          className="text-sm max-w-md mb-10 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The page you're looking for doesn't exist. It may have been moved, or
          you may have mistyped the URL.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200 no-underline"
            style={{
              background: "var(--color-text-primary)",
              color: "var(--color-bg-primary)",
            }}
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200 no-underline"
            style={{
              border: "1px solid var(--color-border-hover)",
              color: "var(--color-text-primary)",
              background: "transparent",
            }}
          >
            <Search size={16} />
            Search
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
}
