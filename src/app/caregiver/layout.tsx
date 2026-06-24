import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "간병인 앱 | 간병마스터",
  description:
    "간병 일자리 찾기·지원, 간병비 협의, 전자계약, 간병일지 작성, 간병료 정산·증명서 발급까지 — 간병인용 앱 데모.",
  alternates: { canonical: "/caregiver" },
  openGraph: {
    title: "간병인 앱 | 간병마스터",
    description:
      "일자리 탐색부터 정산까지, 내게 맞는 간병 일자리를 손안에서.",
  },
};

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
