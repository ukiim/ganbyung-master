import Link from "next/link";

// 간병마스터 브랜드 마크 — ZENIEL 그린 라운드 스퀘어 + 하트펄스(돌봄+의료).
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="간병마스터 로고"
    >
      <defs>
        <linearGradient id="bm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13b67e" />
          <stop offset="1" stopColor="#0b8a5f" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#bm-grad)" />
      <path
        d="M20 30.5s-8.2-5-10.4-10.2c-1.4-3.3.3-6.6 3.6-7 2.4-.3 4.3 1 6.8 3.6 2.5-2.6 4.4-3.9 6.8-3.6 3.3.4 5 3.7 3.6 7C28.2 25.5 20 30.5 20 30.5z"
        fill="rgba(255,255,255,0.22)"
      />
      <path
        d="M8.5 19.5h4l2-3.2 3 6.4 2.2-3.6h11.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 헤더/푸터용 풀 로고 (마크 + 워드마크).
export function BrandLogo({
  href = "/",
  withTag = true,
  className = "",
  inverted = false,
}: {
  href?: string;
  withTag?: boolean;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="간병마스터 홈"
    >
      <BrandMark className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-bold tracking-tight ${
            inverted ? "text-background" : "text-foreground"
          }`}
        >
          간병마스터
        </span>
        {withTag && (
          <span
            className={`mt-0.5 text-[11px] font-medium ${
              inverted ? "text-background/60" : "text-muted-foreground"
            }`}
          >
            제니엘메디컬
          </span>
        )}
      </span>
    </Link>
  );
}
