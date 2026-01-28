import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.buildinghealthx.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Don't index API routes
          '/_next/',         // Don't index Next.js internals
        ],
      },
      {
        userAgent: 'GPTBot',  // OpenAI's bot
        disallow: '/',        // Optional: block if you don't want AI training on your content
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
