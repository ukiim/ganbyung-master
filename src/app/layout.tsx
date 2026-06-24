import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { ScrollProgress } from "@/components/ScrollProgress";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0e9e6e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ukiim.github.io/ganbyung-master/"),
  applicationName: "간병마스터",
  title: "간병마스터 | 제니엘메디컬 간병인 중개 플랫폼",
  description:
    "환자·보호자와 검증된 간병인을 투명하게 연결합니다. 스마트 매칭부터 간병비 협의, 전자계약, 안전결제, 정산까지 — 신뢰할 수 있는 간병의 시작, 간병마스터.",
  keywords: [
    "간병인 중개",
    "간병 플랫폼",
    "간병마스터",
    "제니엘메디컬",
    "간병인 매칭",
    "간병 서비스",
  ],
  openGraph: {
    title: "간병마스터 | 제니엘메디컬 간병인 중개 플랫폼",
    description:
      "환자·보호자와 검증된 간병인을 투명하게 연결하는 간병 중개 플랫폼. 스마트 매칭 · 간병비 협의 · 전자계약 · 안전결제 · 정산.",
    type: "website",
    locale: "ko_KR",
    siteName: "간병마스터",
    images: [
      { url: "og.png", width: 1200, height: 630, alt: "간병마스터 — 간병인 중개 플랫폼" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "간병마스터 | 제니엘메디컬 간병인 중개 플랫폼",
    description:
      "환자·보호자와 검증된 간병인을 투명하게 연결하는 간병 중개 플랫폼.",
    images: ["og.png"],
  },
  alternates: { canonical: "/" },
  appleWebApp: { capable: true, title: "간병마스터", statusBarStyle: "default" },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "제니엘메디컬",
  alternateName: "간병마스터",
  url: "https://ukiim.github.io/ganbyung-master/",
  logo: "https://ukiim.github.io/ganbyung-master/icon.svg",
  description:
    "환자·보호자와 검증된 간병인을 투명하게 연결하는 간병 중개 플랫폼 간병마스터.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+82-1588-7240",
    contactType: "customer service",
    areaServed: "KR",
    availableLanguage: "Korean",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          본문으로 건너뛰기
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
