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
          className={`w-full px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 outline-none ${className}`}
          style={{
            background: "var(--color-bg-input)",
            border: error
              ? "1px solid var(--color-status-error)"
              : "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-display)",
            ...style,
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
