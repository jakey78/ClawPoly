import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, glow, onClick }: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
  };

  if (hover) {
    return (
      <motion.div
        className={`p-5 ${onClick ? "cursor-pointer" : ""} ${className}`}
        style={baseStyle}
        whileHover={{
          borderColor: "var(--color-border-hover)",
          background: "var(--color-bg-card-hover)",
          boxShadow: glow
            ? `0 8px 32px ${glow}`
            : "0 8px 32px rgba(45, 212, 191, 0.06), 0 0 0 1px rgba(255,255,255,0.02)",
          y: -2,
        }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`p-5 ${className}`}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
