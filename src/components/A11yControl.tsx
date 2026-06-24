"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { useA11y } from "@/hooks/useA11y";

// 전역 접근성 설정 버튼 + 팝오버 (큰글씨 / 고대비). 헤더에서 사용.
export function A11yControl() {
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useA11y();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = largeText || highContrast;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="접근성 설정"
        aria-haspopup="true"
        aria-expanded={open}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span className="text-base font-bold leading-none">가</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="접근성 설정"
          className="absolute right-0 top-12 z-50 w-60 rounded-[var(--radius-lg)] border border-border bg-card p-2 shadow-lg"
        >
          <p className="px-2 pb-1.5 pt-1 text-xs font-semibold text-muted-foreground">
            접근성 설정
          </p>
          <ToggleRow
            icon="search"
            label="큰 글씨"
            desc="화면 전체 글자 확대"
            on={largeText}
            onClick={toggleLargeText}
          />
          <ToggleRow
            icon="verified"
            label="고대비 모드"
            desc="색 대비를 강하게"
            on={highContrast}
            onClick={toggleHighContrast}
          />
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  on,
  onClick,
}: {
  icon: IconName;
  label: string;
  desc: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={on}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 text-left transition-colors hover:bg-muted"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            on ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
