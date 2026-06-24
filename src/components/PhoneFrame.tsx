import type { ReactNode } from "react";

function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "text-white" : "text-foreground";
  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between px-7 pt-1 text-[13px] font-semibold ${color}`}
    >
      <span className="tnum">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg viewBox="0 0 18 12" className="h-3 w-4.5" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="currentColor" aria-hidden="true">
          <path d="M8 11.5 5.8 8.8a3.4 3.4 0 0 1 4.4 0zM8 2C5 2 2.3 3.2.5 5.2l1.7 2A8 8 0 0 1 8 5c2.3 0 4.4.8 5.8 2.2l1.7-2A11 11 0 0 0 8 2z" />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 28 13" className="h-3 w-6" aria-hidden="true">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="9" rx="1.5" fill="currentColor" />
          <rect x="25" y="4" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  tabBar,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  tabBar?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[380px] ${className}`}
      style={{ aspectRatio: "380 / 800" }}
    >
      {/* 외부 베젤 */}
      <div className="absolute inset-0 rounded-[3rem] bg-neutral-900 p-2.5 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.45),0_0_0_1px_rgba(0,0,0,0.1)]">
        {/* 화면 */}
        <div
          className={`relative flex h-full w-full flex-col overflow-hidden rounded-[2.4rem] ${
            dark ? "bg-neutral-950" : "bg-muted"
          }`}
        >
          {/* 다이나믹 아일랜드 */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-neutral-900" />
          <StatusBar dark={dark} />
          {/* 스크롤 콘텐츠 */}
          <div className="no-scrollbar relative flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
          {tabBar}
          {/* 홈 인디케이터 */}
          <div className="flex h-5 shrink-0 items-center justify-center bg-inherit">
            <div
              className={`h-1.5 w-32 rounded-full ${
                dark ? "bg-white/40" : "bg-foreground/25"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
