import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

// 빈 상태 — 무결과/완료 등. 아이콘 + 카피 + 옵션 액션.
export function EmptyState({
  icon = "search",
  title,
  desc,
  action,
  className = "",
}: {
  icon?: IconName;
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-muted/40 px-6 py-10 text-center ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      {desc && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
