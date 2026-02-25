import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
    color: "#06060b",
    border: "none",
    boxShadow: "0 4px 16px rgba(45, 212, 191, 0.2)",
  },
  secondary: {
    background: "rgba(245, 158, 11, 0.08)",
    color: "#f59e0b",
    border: "1px solid rgba(245, 158, 11, 0.3)",
  },
  ghost: {
    background: "rgba(255, 255, 255, 0.02)",
    color: "var(--color-text-secondary)",
    border: "1px solid var(--color-border)",
  },
  danger: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 16px rgba(239, 68, 68, 0.2)",
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  disabled,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" />
        </svg>
      )}
      {children}
    </button>
  );
}
