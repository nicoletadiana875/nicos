import { baseUrl } from "@/config/settings.mjs";

export default function sitemap() {
  return ["", "/privacy", "/cookie", "/termini"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path ? "yearly" : "monthly",
    priority: path ? 0.3 : 1,
  }));
}
