import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "teal" | "amber" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: "rgba(139, 139, 160, 0.15)",
    color: "var(--color-text-secondary)",
    border: "1px solid rgba(139, 139, 160, 0.2)",
  },
  success: {
    background: "rgba(34, 197, 94, 0.12)",
    color: "var(--color-status-success)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
  },
  warning: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "var(--color-status-warning)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
  },
  error: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "var(--color-status-error)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  teal: {
    background: "rgba(45, 212, 191, 0.12)",
    color: "var(--color-accent-teal)",
    border: "1px solid rgba(45, 212, 191, 0.2)",
  },
  amber: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "var(--color-accent-amber)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
  },
  info: {
    background: "rgba(167, 139, 250, 0.12)",
    color: "var(--color-accent-purple)",
    border: "1px solid rgba(167, 139, 250, 0.2)",
  },
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
