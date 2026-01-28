// lib/schema.ts
// Comprehensive Schema.org structured data for BuildingHealthX

/**
 * Organization Schema - Add to root layout
 * This represents your company/website
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BuildingHealthX',
    alternateName: 'Building Health X',
    url: 'https://www.buildinghealthx.com',
    logo: 'https://www.buildinghealthx.com/logo.png',
    description: 'Research NYC buildings before signing your lease. Check violations, complaints, pest history, and tenant reviews for any address in New York City.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'New York',
        '@id': 'https://en.wikipedia.org/wiki/New_York_City',
      },
      {
        '@type': 'Place',
        name: 'Manhattan',
      },
      {
        '@type': 'Place',
        name: 'Brooklyn',
      },
      {
        '@type': 'Place',
        name: 'Queens',
      },
      {
        '@type': 'Place',
        name: 'Bronx',
      },
      {
        '@type': 'Place',
        name: 'Staten Island',
      },
    ],
    sameAs: [
      // Add your social media profiles here when you have them
      // 'https://twitter.com/buildinghealthx',
      // 'https://facebook.com/buildinghealthx',
    ],
  }
}

/**
 * Website Schema - Add to root layout
 * This represents your website as a whole
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BuildingHealthX',
    url: 'https://www.buildinghealthx.com',
    description: 'Research NYC buildings before signing your lease',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.buildinghealthx.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Breadcrumb Schema
 * Shows navigation path in search results
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Blog Post Schema (Article)
 * For individual blog posts
 */
export function getBlogPostSchema(post: {
  title: string
  excerpt: string
  slug: string
  dateISO?: string
  updatedAt?: string
  featuredImage?: string
  tags?: string[]
  author?: string
}) {
  const publishedDate = post.dateISO || new Date().toISOString()
  const modifiedDate = post.updatedAt || publishedDate

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || 'https://www.buildinghealthx.com/logo.png',
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: post.author || 'BuildingHealthX',
      url: 'https://www.buildinghealthx.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BuildingHealthX',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.buildinghealthx.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.buildinghealthx.com/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
  }
}

/**
 * Service Schema
 * For individual service pages
 */
export function getServiceSchema(service: {
  name: string
  description: string
  slug: string
  costRange?: string
  category?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'BuildingHealthX',
      url: 'https://www.buildinghealthx.com',
    },
    areaServed: {
      '@type': 'City',
      name: 'New York City',
      '@id': 'https://en.wikipedia.org/wiki/New_York_City',
    },
    serviceType: service.category || service.name,
    url: `https://www.buildinghealthx.com/services/${service.slug}`,
    ...(service.costRange && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        price: service.costRange,
      },
    }),
  }
}

/**
 * Local Business Schema for Service + Location Pages
 * For pages like /services/moving-companies/upper-east-side
 */
export function getLocalServiceSchema(service: {
  name: string
  description: string
  slug: string
  location: {
    name: string
    slug: string
    borough: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${service.location.name}`,
    description: `${service.description} Available in ${service.location.name}, ${service.location.borough}.`,
    provider: {
      '@type': 'Organization',
      name: 'BuildingHealthX',
    },
    areaServed: {
      '@type': 'Place',
      name: service.location.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: service.location.name,
        addressRegion: 'NY',
        addressCountry: 'US',
      },
    },
    url: `https://www.buildinghealthx.com/services/${service.slug}/${service.location.slug}`,
  }
}

/**
 * FAQ Schema
 * For FAQ sections on service pages
 */
export function getFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * ItemList Schema
 * For listing pages (blog index, services index, locations index)
 */
export function getItemListSchema(items: { name: string; url: string; description?: string }[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description }),
    })),
  }
}

/**
 * HowTo Schema
 * For step-by-step guides
 */
export function getHowToSchema(guide: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.name,
    description: guide.description,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/**
 * Place Schema
 * For location pages
 */
export function getPlaceSchema(location: {
  name: string
  borough: string
  description: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: location.name,
    description: location.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    containedInPlace: {
      '@type': 'City',
      name: 'New York City',
    },
    url: `https://www.buildinghealthx.com/locations/${location.slug}`,
  }
}

/**
 * Helper function to render JSON-LD script
 * Use this in your page components
 */
export function renderJsonLd(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
