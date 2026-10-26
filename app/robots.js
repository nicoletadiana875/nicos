import { legal } from "@/config/legal.mjs";
import { baseUrl } from "@/config/settings.mjs";

export default function robots() {
  // Finche' i testi legali sono in bozza il sito resta nascosto ai motori di ricerca
  if (legal.draft) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
