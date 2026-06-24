"use client";

import Link from "next/link";
import { BrandMark } from "@/components/Brand";
import { Icon } from "@/components/Icon";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <BrandMark className="h-14 w-14" />
      <h1 className="mt-6 text-2xl font-bold text-foreground">
        문제가 발생했습니다
      </h1>
      <p className="mt-2 text-muted-foreground">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Icon name="refresh" className="h-4 w-4" />
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          홈으로
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        문제가 지속되면 1588-7240으로 문의해 주세요.
      </p>
    </div>
  );
}
