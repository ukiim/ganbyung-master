// 무의존 인라인 SVG 차트 (라인/바/도넛). 색상은 디자인 토큰 기반.

export function LineChart({
  data,
  labels,
  height = 180,
  className = "",
}: {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
}) {
  const w = 520;
  const h = height;
  const pad = { t: 16, r: 12, b: 24, l: 12 };
  const max = Math.max(...data) * 1.15;
  const min = Math.min(...data) * 0.85;
  const span = max - min || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * innerW;
    const y = pad.t + innerH - ((v - min) / span) * innerH;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${pad.t + innerH} L${pts[0][0]},${pad.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${className}`} role="img" aria-label="추이 차트">
      <defs>
        <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={w - pad.r}
          y1={pad.t + innerH * g}
          y2={pad.t + innerH * g}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#line-fill)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
      ))}
      {labels &&
        labels.map((l, i) => (
          <text
            key={l}
            x={pad.l + (i / (labels.length - 1)) * innerW}
            y={h - 6}
            textAnchor="middle"
            className="fill-[var(--muted-foreground)] text-[11px]"
          >
            {l}
          </text>
        ))}
    </svg>
  );
}

export function BarChart({
  data,
  className = "",
  height = 180,
}: {
  data: { label: string; value: number }[];
  className?: string;
  height?: number;
}) {
  const w = 520;
  const h = height;
  const pad = { t: 14, r: 8, b: 26, l: 8 };
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const slot = innerW / data.length;
  const bw = Math.min(slot * 0.55, 46);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${className}`} role="img" aria-label="막대 차트">
      {[0.5, 1].map((g) => (
        <line key={g} x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * (1 - g)} y2={pad.t + innerH * (1 - g)} stroke="var(--border)" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const bh = (d.value / max) * innerH;
        const x = pad.l + slot * i + (slot - bw) / 2;
        const y = pad.t + innerH - bh;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={bh} rx="5" fill="var(--primary)" opacity={0.55 + 0.45 * (d.value / max)} />
            <text x={x + bw / 2} y={y - 5} textAnchor="middle" className="fill-[var(--foreground)] text-[11px] font-semibold">
              {d.value}
            </text>
            <text x={x + bw / 2} y={h - 8} textAnchor="middle" className="fill-[var(--muted-foreground)] text-[11px]">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({
  segments,
  size = 168,
  className = "",
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  className?: string;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 56;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg viewBox="0 0 140 140" style={{ width: size, height: size }} role="img" aria-label="도넛 차트">
        <g transform="rotate(-90 70 70)">
          {segments.map((s) => {
            const frac = s.value / total;
            const dash = frac * c;
            const seg = (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return seg;
          })}
        </g>
        {centerValue && (
          <text x="70" y="66" textAnchor="middle" className="fill-[var(--foreground)] text-[20px] font-bold">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x="70" y="84" textAnchor="middle" className="fill-[var(--muted-foreground)] text-[11px]">
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className="space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-semibold tnum text-foreground">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
