// 성공 모먼트 — 체크마크 draw + 소프트 글로우 링 (의료 톤, 절제된 연출).
export function SuccessCheck({
  size = 76,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`animate-glow-ring inline-flex items-center justify-center rounded-full bg-primary/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 52 52"
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        aria-hidden="true"
      >
        <circle cx="26" cy="26" r="23" fill="none" stroke="var(--primary)" strokeWidth="2.5" opacity="0.25" />
        <path
          d="M15 27 l7.5 7.5 L38 18"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-check-draw"
          style={{ ["--len" as string]: "44" }}
        />
      </svg>
    </span>
  );
}
