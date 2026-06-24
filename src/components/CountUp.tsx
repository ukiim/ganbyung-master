"use client";

import { useEffect, useRef, useState } from "react";

// 문자열 값(예: "3,240+", "4.8 / 5.0", "92%↓", "12분", "42,180,000원")에서
// 첫 숫자를 추출해 0→목표로 카운트업하고, 앞뒤 텍스트는 그대로 유지한다.
export function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => zeroed(value));
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      animate(value, duration, setDisplay);
    };
    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {display}
    </span>
  );
}

const NUM = /([\d,]+(?:\.\d+)?)/;

function parse(value: string) {
  const m = value.match(NUM);
  if (!m) return null;
  const raw = m[1];
  const target = parseFloat(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const grouped = raw.includes(",");
  const prefix = value.slice(0, m.index);
  const suffix = value.slice((m.index ?? 0) + raw.length);
  return { target, decimals, grouped, prefix, suffix };
}

function fmt(n: number, decimals: number, grouped: boolean) {
  if (grouped) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return n.toFixed(decimals);
}

function zeroed(value: string) {
  const p = parse(value);
  if (!p) return value;
  return `${p.prefix}${fmt(0, p.decimals, p.grouped)}${p.suffix}`;
}

function animate(value: string, duration: number, set: (s: string) => void) {
  const p = parse(value);
  if (!p) {
    set(value);
    return;
  }
  if (typeof requestAnimationFrame === "undefined") {
    set(value);
    return;
  }
  let startTs = 0;
  const step = (ts: number) => {
    if (!startTs) startTs = ts;
    const t = Math.min(1, (ts - startTs) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const cur = p.target * eased;
    set(`${p.prefix}${fmt(cur, p.decimals, p.grouped)}${p.suffix}`);
    if (t < 1) requestAnimationFrame(step);
    else set(value);
  };
  requestAnimationFrame(step);
}
