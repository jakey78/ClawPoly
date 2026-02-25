import { Link } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <AnimatedPage>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div
          className="text-7xl font-mono font-bold"
          style={{ color: "var(--color-accent-teal)" }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Page Not Found
        </h1>
        <p
          className="text-sm max-w-md"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The page you're looking for doesn't exist. It may have been moved, or
          you may have mistyped the URL.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-accent-teal)",
              color: "var(--color-bg-base)",
            }}
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border transition-colors"
            style={{
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-primary)",
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
