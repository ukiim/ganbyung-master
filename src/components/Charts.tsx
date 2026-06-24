"use client";

import { useEffect, useRef, useState } from "react";

// 무의존 인라인 SVG 차트 (라인/바/도넛). 그리기 애니메이션 + hover 툴팁 포함.

type Tip = { xPct: number; yPct: number; label: string; value: string } | null;

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background shadow-lg"
      style={{ left: `${tip.xPct}%`, top: `calc(${tip.yPct}% - 8px)` }}
    >
      <span className="block text-[10px] font-medium text-background/70">{tip.label}</span>
      <span className="tnum">{tip.value}</span>
    </div>
  );
}

export function LineChart({
  data,
  labels,
  height = 180,
  className = "",
  unit = "건",
}: {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
  unit?: string;
}) {
  const w = 520;
  const h = height;
  const pad = { t: 16, r: 12, b: 24, l: 12 };
  const max = Math.max(...data) * 1.15;
  const min = Math.min(...data) * 0.85;
  const span = max - min || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const denom = Math.max(1, data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad.l + (i / denom) * innerW;
    const y = pad.t + innerH - ((v - min) / span) * innerH;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${pad.t + innerH} L${pts[0][0]},${pad.t + innerH} Z`;

  const lineRef = useRef<SVGPathElement>(null);
  const [tip, setTip] = useState<Tip>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (el) el.style.setProperty("--len", String(Math.ceil(el.getTotalLength())));
  }, [line]);

  return (
    <div className={`relative w-full ${className}`}>
      <Tooltip tip={tip} />
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="추이 차트">
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
        <path
          ref={lineRef}
          className="chart-line-draw"
          d={line}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => {
          const t = {
            xPct: (p[0] / w) * 100,
            yPct: (p[1] / h) * 100,
            label: labels?.[i] ?? `${i + 1}`,
            value: `${data[i].toLocaleString("ko-KR")}${unit}`,
          };
          return (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r="3" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
              <circle
                cx={p[0]}
                cy={p[1]}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                tabIndex={0}
                role="img"
                aria-label={`${t.label}: ${t.value}`}
                onMouseEnter={() => setTip(t)}
                onMouseLeave={() => setTip(null)}
                onClick={() => setTip(t)}
                onFocus={() => setTip(t)}
                onBlur={() => setTip(null)}
              />
            </g>
          );
        })}
        {labels &&
          labels.map((l, i) => (
            <text
              key={l}
              x={pad.l + (i / denom) * innerW}
              y={h - 6}
              textAnchor="middle"
              className="fill-[var(--muted-foreground)] text-[11px]"
            >
              {l}
            </text>
          ))}
      </svg>
    </div>
  );
}

export function BarChart({
  data,
  className = "",
  height = 180,
  unit = "",
}: {
  data: { label: string; value: number }[];
  className?: string;
  height?: number;
  unit?: string;
}) {
  const w = 520;
  const h = height;
  const pad = { t: 14, r: 8, b: 26, l: 8 };
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const slot = innerW / data.length;
  const bw = Math.min(slot * 0.55, 46);
  const [hover, setHover] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);

  return (
    <div className={`relative w-full ${className}`}>
      <Tooltip tip={tip} />
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="막대 차트">
        {[0.5, 1].map((g) => (
          <line key={g} x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * (1 - g)} y2={pad.t + innerH * (1 - g)} stroke="var(--border)" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const bh = (d.value / max) * innerH;
          const x = pad.l + slot * i + (slot - bw) / 2;
          const y = pad.t + innerH - bh;
          const active = hover === i;
          const t = {
            xPct: ((x + bw / 2) / w) * 100,
            yPct: (y / h) * 100,
            label: d.label,
            value: `${d.value.toLocaleString("ko-KR")}${unit}`,
          };
          const enter = () => {
            setHover(i);
            setTip(t);
          };
          const leave = () => {
            setHover(null);
            setTip(null);
          };
          return (
            <g
              key={d.label}
              className="cursor-pointer"
              tabIndex={0}
              role="img"
              aria-label={`${t.label}: ${t.value}`}
              onMouseEnter={enter}
              onMouseLeave={leave}
              onClick={enter}
              onFocus={enter}
              onBlur={leave}
            >
              <rect
                x={x}
                y={y}
                width={bw}
                height={bh}
                rx="5"
                className="chart-bar-grow"
                fill="var(--primary)"
                opacity={active ? 1 : 0.55 + 0.45 * (d.value / max)}
                style={{ animationDelay: `${i * 80}ms` }}
              />
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
    </div>
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
  const [hover, setHover] = useState<number | null>(null);
  let offset = 0;

  const centerTop = hover !== null ? `${Math.round((segments[hover].value / total) * 100)}%` : centerValue;
  const centerBot = hover !== null ? segments[hover].label : centerLabel;

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg viewBox="0 0 140 140" style={{ width: size, height: size }} role="img" aria-label="도넛 차트">
        <g transform="rotate(-90 70 70)">
          {segments.map((s, i) => {
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
                strokeWidth={hover === i ? 20 : 16}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="chart-donut-draw cursor-pointer"
                style={{ ["--len" as string]: String(Math.ceil(c)), transition: "stroke-width 0.2s" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
            offset += dash;
            return seg;
          })}
        </g>
        {centerTop && (
          <text x="70" y="66" textAnchor="middle" className="fill-[var(--foreground)] text-[20px] font-bold">
            {centerTop}
          </text>
        )}
        {centerBot && (
          <text x="70" y="84" textAnchor="middle" className="fill-[var(--muted-foreground)] text-[11px]">
            {centerBot}
          </text>
        )}
      </svg>
      <ul className="space-y-2">
        {segments.map((s, i) => (
          <li
            key={s.label}
            className="flex cursor-pointer items-center gap-2 rounded text-sm"
            tabIndex={0}
            role="img"
            aria-label={`${s.label}: ${Math.round((s.value / total) * 100)}%`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => setHover(i)}
          >
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color, outline: hover === i ? `2px solid ${s.color}40` : "none" }} />
            <span className={hover === i ? "font-semibold text-foreground" : "text-muted-foreground"}>{s.label}</span>
            <span className="ml-auto font-semibold tnum text-foreground">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
