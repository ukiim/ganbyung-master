import type { NextConfig } from "next";

// GitHub Pages 정적 배포 설정.
// 개발(next dev) 시에는 basePath 없이 루트에서 동작하고,
// 프로덕션 빌드(next build) 시에만 /ganbyung-master 서브패스를 적용한다.
const isProd = process.env.NODE_ENV === "production";
const repo = "ganbyung-master";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
