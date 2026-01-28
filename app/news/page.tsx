import { Metadata } from 'next'
import Link from 'next/link'
import Parser from 'rss-parser'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NYC Real Estate News | Building Health X',
  description: 'Stay informed with the latest New York City real estate news, market updates, and housing developments. Curated from trusted NYC property sources.',
}

export const revalidate = 3600

interface FeedItem {
  title: string
  link: string
  contentSnippet?: string
  content?: string
  pubDate?: string
  source: string
  sourceUrl: string
  image?: string
}

const feeds = [
  { url: 'https://therealdeal.com/feed/', name: 'The Real Deal', site: 'therealdeal.com' },
  { url: 'https://ny.curbed.com/rss/index.xml', name: 'Curbed NY', site: 'curbed.com' },
  { url: 'https://newyorkyimby.com/feed', name: 'New York YIMBY', site: 'newyorkyimby.com' },
  { url: 'https://brickunderground.com/rss.xml', name: 'Brick Underground', site: 'brickunderground.com' },
  { url: 'https://6sqft.com/feed', name: '6sqft', site: '6sqft.com' },
  { url: 'https://thecity.nyc/category/real-estate/feed', name: 'THE CITY', site: 'thecity.nyc' },
]

function extractImage(item: any): string | undefined {
  if (item.enclosure?.url) return item.enclosure.url
  if (item['media:content']?.$?.url) return item['media:content'].$.url
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url
  const content = item.content || item['content:encoded'] || ''
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch) return imgMatch[1]
  return undefined
}

function truncateToSentences(text: string, count: number = 3): string {
  if (!text) return ''
  const clean = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean]
  return sentences.slice(0, count).join(' ').trim()
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function getNews(): Promise<FeedItem[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'media:content'],
        ['media:thumbnail', 'media:thumbnail'],
        ['content:encoded', 'content:encoded'],
      ],
    },
  })

  const allItems: FeedItem[] = []

  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const result = await parser.parseURL(feed.url)
        const items = result.items.slice(0, 5).map((item) => ({
          title: item.title || 'Untitled',
          link: item.link || '#',
          contentSnippet: item.contentSnippet,
          content: item.content || (item as any)['content:encoded'],
          pubDate: item.pubDate,
          source: feed.name,
          sourceUrl: feed.site,
          image: extractImage(item),
        }))
        allItems.push(...items)
      } catch (error) {
        console.error(`Failed to fetch ${feed.name}:`, error)
      }
    })
  )

  return allItems.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0
    return dateB - dateA
  })
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <main className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <header className="mb-12">
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
            News Feed
          </span>
          <h1 className="text-4xl font-bold mb-4">NYC Real Estate News</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
            Stay ahead of New York City&apos;s ever-changing real estate landscape. 
            We aggregate breaking news from the city&apos;s most trusted property 
            sources covering new developments, market trends, housing policy, 
            building violations, and neighborhood changes across all five boroughs.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <article 
              key={`${item.link}-${index}`}
              className="card overflow-hidden hover:border-[var(--border-secondary)] transition-colors group"
            >
              {item.image && (
                <div className="h-48 w-full bg-[var(--bg-secondary)] overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
                  <span className="font-medium text-blue-400">{item.source}</span>
                  <span>{formatDate(item.pubDate)}</span>
                </div>
                
                <h2 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-400 transition">{item.title}</h2>
                
                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
                  {truncateToSentences(item.contentSnippet || item.content || '', 3)}
                </p>
                
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Read more at {item.sourceUrl}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Unable to load news at this time. Please check back later.</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-[var(--border-primary)]">
          <p className="text-sm text-[var(--text-muted)] text-center">
            News aggregated from The Real Deal, Curbed NY, New York YIMBY, 
            Brick Underground, 6sqft, and THE CITY. Updated hourly.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
