import type { ReactNode } from "react";

// 그린→코랄 그라데이션 텍스트. shimmer 시 은은한 흐름(reduced-motion 존중).
export function GradientText({
  children,
  shimmer = false,
  className = "",
}: {
  children: ReactNode;
  shimmer?: boolean;
  className?: string;
}) {
  return (
    <span className={`text-gradient ${shimmer ? "shimmer" : ""} ${className}`}>
      {children}
    </span>
  );
}
