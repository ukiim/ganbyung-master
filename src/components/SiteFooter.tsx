import Link from "next/link";
import { BrandLogo } from "@/components/Brand";

const COLS = [
  {
    title: "플랫폼",
    links: [
      { href: "/patient", label: "환자·보호자 앱" },
      { href: "/caregiver", label: "간병인 앱" },
      { href: "/admin", label: "관리자 콘솔" },
      { href: "/architecture", label: "기술·사업수행" },
    ],
  },
  {
    title: "서비스",
    links: [
      { href: "/#features", label: "주요 기능" },
      { href: "/#flow", label: "매칭 프로세스" },
      { href: "/#trust", label: "보안·신뢰" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/#about", label: "제니엘메디컬 소개" },
      { href: "/#interface", label: "대외 연계" },
      { href: "/#contact", label: "도입 문의" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <BrandLogo inverted withTag={false} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              환자·보호자와 검증된 간병인을 투명하게 연결하는 간병 중개
              플랫폼. 신뢰할 수 있는 간병의 시작.
            </p>
            <p className="mt-4 text-xs text-background/40">
              서울특별시 강남구 테헤란로 152, 강남파이낸스센터 18층
              <br />
              대표전화 1588-7240 · contact@zenielmedical.co.kr
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-background">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-background/15 pt-6 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 제니엘메디컬 (ZENIEL Medical). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
            <span className="rounded-full bg-background/10 px-2.5 py-1 font-medium text-background/70">
              시연용 데모 · 실제 거래·결제 미발생
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
