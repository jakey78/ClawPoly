import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", style, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none placeholder:text-[var(--color-text-muted)] ${className}`}
          style={{
            background: "var(--color-bg-input)",
            border: error
              ? "1px solid rgba(239, 68, 68, 0.5)"
              : "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-display)",
            ...style,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = "rgba(45, 212, 191, 0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.08)";
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "rgba(239, 68, 68, 0.5)" : "var(--color-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...props}
        />
        {error && (
          <span className="text-xs" style={{ color: "var(--color-status-error)" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
