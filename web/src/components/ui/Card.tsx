import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, onClick }: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
  };

  if (hover) {
    return (
      <motion.div
        className={`p-4 ${onClick ? "cursor-pointer" : ""} ${className}`}
        style={baseStyle}
        whileHover={{
          borderColor: "var(--color-border-hover)",
          background: "var(--color-bg-card-hover)",
          boxShadow: "0 4px 24px rgba(45, 212, 191, 0.05)",
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
      className={`p-4 ${className}`}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
