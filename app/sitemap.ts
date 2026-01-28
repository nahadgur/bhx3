import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const baseUrl = 'https://www.buildinghealthx.com'

const services = [
  'moving-companies',
  'renters-insurance',
  'pest-control',
  'storage-facilities',
  'building-inspectors',
]

const locations = [
  'upper-east-side',
  'upper-west-side',
  'harlem',
  'east-village',
  'west-village',
  'chelsea',
  'tribeca',
  'hells-kitchen',
  'williamsburg',
  'bushwick',
  'bedford-stuyvesant',
  'park-slope',
  'downtown-brooklyn',
  'dumbo',
  'crown-heights',
  'greenpoint',
  'astoria',
  'long-island-city',
  'flushing',
  'jackson-heights',
  'ridgewood',
  'sunnyside',
  'fordham',
  'kingsbridge',
  'riverdale',
  'mott-haven',
  'pelham-bay',
  'st-george',
  'stapleton',
]

function getBlogSlugs(): string[] {
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog')
    const folders = fs.readdirSync(blogDir, { withFileTypes: true })
    return folders
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Homepage
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Service landing pages (174 total)
  const servicePages: MetadataRoute.Sitemap = services.flatMap((service) =>
    locations.map((location) => ({
      url: `${baseUrl}/services/${service}/${location}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  // Blog posts
  const blogSlugs = getBlogSlugs()
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}
