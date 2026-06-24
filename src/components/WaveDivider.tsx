// 섹션 경계 은은한 웨이브 디바이더. fill은 "다음" 섹션 배경색과 맞춘다.
export function WaveDivider({
  fill = "var(--muted)",
  flip = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden ${className}`}
      style={{ lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="block h-[36px] w-full sm:h-[48px]"
      >
        <path
          d="M0,28 C240,56 480,4 720,20 C960,36 1200,58 1440,26 L1440,56 L0,56 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
