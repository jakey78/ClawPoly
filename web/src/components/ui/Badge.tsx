import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "teal" | "amber" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "rgba(160, 152, 144, 0.1)",
    color: "var(--color-text-secondary)",
    border: "1px solid rgba(160, 152, 144, 0.2)",
  },
  success: {
    background: "rgba(22, 163, 74, 0.08)",
    color: "var(--color-status-success)",
    border: "1px solid rgba(22, 163, 74, 0.15)",
  },
  warning: {
    background: "rgba(217, 119, 6, 0.08)",
    color: "var(--color-status-warning)",
    border: "1px solid rgba(217, 119, 6, 0.15)",
  },
  error: {
    background: "rgba(220, 38, 38, 0.08)",
    color: "var(--color-status-error)",
    border: "1px solid rgba(220, 38, 38, 0.15)",
  },
  teal: {
    background: "rgba(13, 148, 136, 0.08)",
    color: "var(--color-accent-teal)",
    border: "1px solid rgba(13, 148, 136, 0.15)",
  },
  amber: {
    background: "rgba(180, 83, 9, 0.08)",
    color: "var(--color-accent-amber)",
    border: "1px solid rgba(180, 83, 9, 0.15)",
  },
  info: {
    background: "rgba(124, 58, 237, 0.08)",
    color: "var(--color-accent-purple)",
    border: "1px solid rgba(124, 58, 237, 0.15)",
  },
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
