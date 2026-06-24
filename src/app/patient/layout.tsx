import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "환자·보호자 앱 | 간병마스터",
  description:
    "간병 신청부터 간병인 매칭(검색·지명·추천), 카카오 알림톡 간병비 협의, 전자 중개계약, 안전결제, 실시간 진행·정산까지 — 환자·보호자용 앱 데모.",
  alternates: { canonical: "/patient" },
  openGraph: {
    title: "환자·보호자 앱 | 간병마스터",
    description:
      "신청 → 매칭 → 간병비 협의 → 전자계약 → 결제 → 진행까지, 보호자가 간병인을 만나는 가장 쉬운 길.",
  },
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
