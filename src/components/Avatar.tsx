// 결정적 일러스트 아바타 — 시드(이름/id) + 브랜드 컬러 기반 그라데이션 + 소프트 블롭 + 이니셜.
// 플랫 컬러+이니셜보다 깊이감 있고 프리미엄한 인상. 무의존 인라인 SVG.

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function shade(hex: string, amt: number): string {
  const m = hex.replace("#", "");
  const n = parseInt(m.length === 3 ? m.replace(/(.)/g, "$1$1") : m, 16);
  let r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r + (amt < 0 ? r : 255 - r) * amt)));
  g = Math.max(0, Math.min(255, Math.round(g + (amt < 0 ? g : 255 - g) * amt)));
  b = Math.max(0, Math.min(255, Math.round(b + (amt < 0 ? b : 255 - b) * amt)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const PALETTE = ["#0e9e6e", "#f2784b", "#2563eb", "#7c3aed", "#d97706", "#0d9488"];

export function Avatar({
  name,
  color,
  size = 48,
  className = "",
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const seed = hash(name || "?");
  const base = color ?? PALETTE[seed % PALETTE.length];
  const top = shade(base, 0.22);
  const bottom = shade(base, -0.28);
  const id = `av-${seed.toString(36)}`;
  // 시드 기반 블롭 위치
  const bx = 22 + (seed % 18);
  const by = 16 + ((seed >> 3) % 16);
  const initial = (name || "?").trim().slice(0, 1);

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" width={size} height={size} role="presentation">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#${id})`} />
        <circle cx={bx} cy={by} r="20" fill="#ffffff" opacity="0.18" />
        <circle cx={64 - bx * 0.6} cy={64 - by * 0.5} r="14" fill="#000000" opacity="0.08" />
        <text
          x="32"
          y="33"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="26"
          fontWeight="700"
          fill="#ffffff"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          {initial}
        </text>
      </svg>
    </span>
  );
}
