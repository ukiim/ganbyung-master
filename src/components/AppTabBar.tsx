"use client";

import { useRef } from "react";
import { Icon, type IconName } from "@/components/Icon";

export type AppTab = {
  key: string;
  label: string;
  icon: IconName;
  badge?: boolean;
};

export function AppTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: AppTab[];
  active: T;
  onChange: (key: T) => void;
}) {
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(tabs[next].key as T);
    btns.current[next]?.focus();
  };

  return (
    <nav
      role="tablist"
      aria-label="앱 메뉴"
      className="z-20 flex shrink-0 items-stretch border-t border-border bg-background/95 px-1 pb-1 pt-1.5 backdrop-blur"
    >
      {tabs.map((tab, i) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              btns.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.key as T)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="relative flex min-h-11 flex-1 flex-col items-center gap-0.5 rounded-lg py-1 transition-colors"
          >
            {/* 활성 인디케이터 */}
            <span
              aria-hidden="true"
              className={`absolute top-0 h-0.5 w-7 rounded-full bg-primary transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
            <span className="relative">
              <Icon
                name={tab.icon}
                className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              {tab.badge && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background"
                />
              )}
            </span>
            <span
              className={`text-[11px] ${
                isActive ? "font-bold text-primary" : "font-medium text-muted-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
