interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function SkeletonLine({ className = "", height = "h-4" }: { className?: string; height?: string }) {
  return (
    <div
      className={`skeleton rounded ${height} ${className}`}
      style={{ background: "var(--color-bg-card-hover)" }}
    />
  );
}

export default function LoadingSkeleton({ className = "", lines = 3, height }: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          height={height || "h-4"}
          className={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <SkeletonLine height="h-5" className="w-1/3 mb-3" />
      <SkeletonLine height="h-4" className="w-full mb-2" />
      <SkeletonLine height="h-4" className="w-4/5 mb-2" />
      <SkeletonLine height="h-4" className="w-2/3" />
    </div>
  );
}
