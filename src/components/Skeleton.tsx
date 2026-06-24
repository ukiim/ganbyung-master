// pulse 스켈레톤 — 리스트/상세 로딩 중 노출. reduced-motion에서 펄스 정지(globals 처리).
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-sm)] bg-muted-foreground/15 ${className}`}
      aria-hidden="true"
    />
  );
}

// 간병인/일자리 카드 스켈레톤 (앱 리스트용)
export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16 rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="불러오는 중">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">불러오는 중…</span>
    </div>
  );
}
