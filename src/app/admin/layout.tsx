import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 콘솔 | 간병마스터",
  description:
    "통합관제 대시보드, 간병인 신원검증·승인, 결제·정산 관리, 고객의 소리(VOC)까지 — 관리자 Back-Office 데모.",
  alternates: { canonical: "/admin" },
  openGraph: {
    title: "관리자 콘솔 | 간병마스터",
    description:
      "전체 간병 현황·신원검증·정산·VOC를 한눈에 모니터링하는 백오피스.",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
