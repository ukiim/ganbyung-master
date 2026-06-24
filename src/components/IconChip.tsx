import { Icon, type IconName } from "@/components/Icon";

// 듀오톤 그라데이션 아이콘 칩 — 기능/플로우/KPI 아이콘 박스 프리미엄화.
export function IconChip({
  name,
  tone = "primary",
  size = "md",
  className = "",
}: {
  name: IconName;
  tone?: "primary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-14 w-14" }[size];
  const ic = { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-7 w-7" }[size];
  const bg =
    tone === "accent"
      ? "linear-gradient(135deg, rgba(242,120,75,0.20), rgba(242,120,75,0.07))"
      : "linear-gradient(135deg, rgba(14,158,110,0.20), rgba(14,158,110,0.06))";
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[var(--radius-md)] ${box} ${className}`}
      style={{ background: bg, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)" }}
    >
      <Icon
        name={name}
        className={`${ic} ${tone === "accent" ? "text-accent" : "text-primary"}`}
      />
    </span>
  );
}
