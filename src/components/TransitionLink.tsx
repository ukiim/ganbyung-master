"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode, MouseEvent } from "react";

// View Transitions API 기반 라우트 전환 링크. 미지원/reduced-motion → 일반 이동.
export function TransitionLink({
  href,
  children,
  className = "",
  "aria-current": ariaCurrent,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page" | undefined;
  onClick?: () => void;
}) {
  const router = useRouter();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // 새 탭/수정키/외부 링크는 기본 동작
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (!reduce && typeof doc.startViewTransition === "function") {
      e.preventDefault();
      doc.startViewTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <Link href={href} className={className} aria-current={ariaCurrent} onClick={handle}>
      {children}
    </Link>
  );
}
