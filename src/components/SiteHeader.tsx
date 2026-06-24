"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { A11yControl } from "@/components/A11yControl";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/patient", label: "환자·보호자 앱" },
  { href: "/caregiver", label: "간병인 앱" },
  { href: "/admin", label: "관리자 콘솔" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--radius-sm)] px-3.5 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <A11yControl />
          <Link
            href="/patient"
            className="hidden min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.98] md:inline-flex"
          >
            데모 둘러보기
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-foreground hover:bg-muted md:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          className="border-t border-border bg-background md:hidden"
        >
          <div className="space-y-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-[var(--radius-md)] px-3 py-3 text-base ${
                  isActive(item.href)
                    ? "bg-muted font-semibold text-foreground"
                    : "font-medium text-muted-foreground"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/patient"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-[var(--radius-md)] bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
            >
              데모 둘러보기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
