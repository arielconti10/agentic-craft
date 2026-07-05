import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    // /playground/* are URL-only lab surfaces, not site content.
    rules: { userAgent: "*", allow: "/", disallow: "/playground/" },
    sitemap: "https://agentic-craft.vercel.app/sitemap.xml",
  }
}
