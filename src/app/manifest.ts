import type { MetadataRoute } from "next";

// PWA 매니페스트. 정적 export 대상이므로 프로덕션 basePath를 명시한다.
const BASE = "/ganbyung-master";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "간병마스터 — 제니엘메디컬 간병인 중개 플랫폼",
    short_name: "간병마스터",
    description:
      "환자·보호자와 검증된 간병인을 투명하게 연결하는 간병 중개 플랫폼.",
    start_url: `${BASE}/`,
    scope: `${BASE}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e9e6e",
    lang: "ko",
    icons: [
      {
        src: `${BASE}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
