import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://ukiim.github.io/ganbyung-master";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/patient", "/caregiver", "/admin"];
  return routes.map((r) => ({
    url: `${BASE}${r}/`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}
