// 따뜻한 돌봄 모티프 인라인 SVG 일러스트(추상·브랜드 컬러). 무의존.

// 하트펄스 워터마크 — 히어로/푸터/관리자 헤더 배경 장식(낮은 불투명).
export function HeartPulseMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true" fill="none">
      <path
        d="M100 96 C70 74 40 58 40 36 C40 22 50 14 62 14 C74 14 84 22 100 40 C116 22 126 14 138 14 C150 14 160 22 160 36 C160 58 130 74 100 96 Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M8 60 H46 L56 40 L72 84 L84 56 H192"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 연결 장면 — 보호자·간병인을 플랫폼이 잇는 추상 구성.
export function ConnectionScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cs-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13b67e" />
          <stop offset="1" stopColor="#0b8a5f" />
        </linearGradient>
        <linearGradient id="cs-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f79068" />
          <stop offset="1" stopColor="#f2784b" />
        </linearGradient>
      </defs>
      {/* 연결선 */}
      <path d="M86 110 C140 60 180 60 234 110" stroke="var(--border)" strokeWidth="3" fill="none" strokeDasharray="2 8" strokeLinecap="round" />
      {/* 좌: 보호자 */}
      <circle cx="70" cy="120" r="42" fill="url(#cs-a)" opacity="0.14" />
      <circle cx="70" cy="104" r="16" fill="url(#cs-a)" />
      <path d="M44 150 a26 22 0 0 1 52 0 Z" fill="url(#cs-a)" />
      {/* 우: 간병인 */}
      <circle cx="250" cy="120" r="42" fill="url(#cs-b)" opacity="0.14" />
      <circle cx="250" cy="104" r="16" fill="url(#cs-b)" />
      <path d="M224 150 a26 22 0 0 1 52 0 Z" fill="url(#cs-b)" />
      {/* 중앙: 하트(플랫폼) */}
      <g transform="translate(160 64)">
        <circle r="26" fill="#ffffff" stroke="var(--border)" />
        <path d="M0 14 C-10 6 -18 0 -18 -8 C-18 -14 -13 -18 -7 -18 C-3 -18 -1 -16 0 -13 C1 -16 3 -18 7 -18 C13 -18 18 -14 18 -8 C18 0 10 6 0 14 Z" fill="var(--primary)" />
      </g>
    </svg>
  );
}

// 빈 검색 결과 아트.
export function EmptySearchArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none">
      <circle cx="54" cy="52" r="30" stroke="var(--border)" strokeWidth="4" />
      <path d="M76 74 L98 96" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
      <path d="M44 52 H64 M54 42 V62" stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
