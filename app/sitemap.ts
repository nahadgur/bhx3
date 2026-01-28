import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-utils'

const baseUrl = 'https://www.buildinghealthx.com'

// ALL services (you had only 5, but you have 17!)
const services = [
  'moving-companies',
  'packing-services',
  'storage-facilities',
  'junk-removal',
  'cleaning-services',
  'real-estate-agents',
  'building-inspectors',
  'renters-insurance',
  'internet-providers',
  'locksmith',
  'furniture-assembly',
  'painters',
  'pest-control',
  'hvac-repair',
  'plumbers',
  'electricians',
  'mold-remediation',
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages with proper priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/tags`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Individual service pages (17 services)
  const individualServicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Service + Location combinations (17 services x 28 locations = 476 pages)
  const serviceLocationPages: MetadataRoute.Sitemap = services.flatMap((service) =>
    locations.map((location) => ({
      url: `${baseUrl}/services/${service}/${location}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  )

  // Service Questions pages (17 services)
  const serviceQuestionPages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service}/questions-to-ask`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Individual location pages (28 locations)
  const individualLocationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog posts from your TypeScript files
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.dateISO ? new Date(post.dateISO) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...individualServicePages,
    ...serviceLocationPages,
    ...serviceQuestionPages,
    ...individualLocationPages,
    ...blogPages,
  ]
}
