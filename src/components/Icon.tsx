import type { SVGProps } from "react";

// 무의존 인라인 SVG 아이콘 세트 (lucide 스타일, stroke=currentColor).
// 사용: <Icon name="search" className="h-5 w-5" />
export type IconName =
  | "home"
  | "search"
  | "user"
  | "users"
  | "userCheck"
  | "bell"
  | "chevronRight"
  | "chevronLeft"
  | "chevronDown"
  | "check"
  | "checkCircle"
  | "x"
  | "plus"
  | "minus"
  | "menu"
  | "arrowRight"
  | "arrowUpRight"
  | "star"
  | "heart"
  | "heartPulse"
  | "calendar"
  | "clock"
  | "mapPin"
  | "phone"
  | "creditCard"
  | "wallet"
  | "shieldCheck"
  | "fileText"
  | "clipboard"
  | "message"
  | "settings"
  | "logout"
  | "filter"
  | "briefcase"
  | "coins"
  | "hospital"
  | "stethoscope"
  | "lock"
  | "refresh"
  | "download"
  | "edit"
  | "alert"
  | "thumbsUp"
  | "building"
  | "barChart"
  | "trendingUp"
  | "trendingDown"
  | "dashboard"
  | "list"
  | "bandage"
  | "sparkles"
  | "handshake"
  | "bank"
  | "kakao"
  | "verified";

const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.5a3.5 3.5 0 0 1 0 7" />
      <path d="M18 21a6.5 6.5 0 0 0-3-5.5" />
    </>
  ),
  userCheck: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
      <path d="M10.5 20a1.5 1.5 0 0 0 3 0" />
    </>
  ),
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 5 5L20 7" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </>
  ),
  x: <path d="M6 6 18 18M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8m9 0v9" />,
  star: (
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" />
  ),
  heart: (
    <path d="M12 20s-7-4.4-9.3-9.1C1.3 8 2.6 4.8 5.8 4.3 8 4 9.7 5.2 12 7.5c2.3-2.3 4-3.5 6.2-3.2 3.2.5 4.5 3.7 3.1 6.6C19 15.6 12 20 12 20z" />
  ),
  heartPulse: (
    <>
      <path d="M12 20s-7-4.4-9.3-9.1C1.3 8 2.6 4.8 5.8 4.3 8 4 9.7 5.2 12 7.5c2.3-2.3 4-3.5 6.2-3.2 3.2.5 4.5 3.7 3.1 6.6C19 15.6 12 20 12 20z" />
      <path d="M3 13h3l2-3 2.5 5 2-3h6.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
  ),
  creditCard: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h12v4" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5" />
      <circle cx="16.5" cy="12.5" r="1.2" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M8.5 13h7M8.5 17h7" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9z" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  message: (
    <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  logout: <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10" />,
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="M14.5 5.3a5 5 0 0 1 0 9.4M7 19c4 1.5 8 0 9-3" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 21V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v15" />
      <path d="M2 21h20M12 7v6M9 10h6M9 17h2M14 17h1" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M5 3v5a4 4 0 0 0 8 0V3" />
      <path d="M9 17a5 5 0 0 0 10 0v-2" />
      <circle cx="19" cy="11" r="2" />
      <path d="M9 17v-2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  refresh: <path d="M4 9a8 8 0 0 1 13-2l3 2M20 15a8 8 0 0 1-13 2l-3-2M20 5v4h-4M4 19v-4h4" />,
  download: <path d="M12 3v12m-4-4 4 4 4-4M5 21h14" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  thumbsUp: (
    <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm0 0 4-7a2 2 0 0 1 2 2v3h5.5a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 17 20H7" />
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
    </>
  ),
  barChart: <path d="M4 20h16M7 20v-7M12 20V6M17 20v-10" />,
  trendingUp: <path d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />,
  trendingDown: <path d="M3 7l6 6 4-4 8 8m0 0h-5m5 0v-5" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  bandage: (
    <>
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="M10 10h.01M14 14h.01M12 12h.01M10 14h.01M14 10h.01" />
    </>
  ),
  sparkles: (
    <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18.5 14l.9 2.3 2.1.7-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.7z" />
  ),
  handshake: (
    <path d="m11 17 2 2a1.5 1.5 0 0 0 2-2l3-3 2 1V7l-4-1-4 2H8L4 7v9l2-1 3 3a1.5 1.5 0 0 0 2 0zm0 0-2-2m4-1-2-2" />
  ),
  bank: (
    <>
      <path d="M3 10 12 4l9 6M4 10h16M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />
    </>
  ),
  kakao: (
    <path d="M12 4C7 4 3 7.1 3 10.9c0 2.5 1.7 4.6 4.2 5.8-.2.6-.7 2.4-.8 2.8 0 .2.1.4.4.2.2-.1 2.7-1.8 3.8-2.6.5.1 1 .1 1.4.1 5 0 9-3.1 9-6.9S17 4 12 4z" />
  ),
  verified: (
    <>
      <path d="m12 2 2.4 1.8 3-.2.9 2.9 2.5 1.6-.9 2.9.9 2.9-2.5 1.6-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.6.9-2.9-.9-2.9 2.5-1.6.9-2.9 3 .2z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  filled?: boolean;
}

export function Icon({ name, filled = false, className, ...props }: IconProps) {
  const solidIcons: IconName[] = ["star", "heart", "kakao", "sparkles"];
  const isSolid = filled || solidIcons.includes(name);
  return (
    <svg
      viewBox="0 0 24 24"
      fill={isSolid ? "currentColor" : "none"}
      stroke={isSolid ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
