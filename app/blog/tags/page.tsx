import Link from 'next/link'
import { getAllTags } from '@/lib/blog-utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Tags | Blog | Building Health X',
  description: 'Browse Building Health X blog posts by topic.',
}

export default function BlogTagsIndexPage() {
  const tags = getAllTags()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Browse by Topic</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">Explore renter guides, building issue explainers, and neighborhood walkthroughs.</p>

        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog/tags/${encodeURIComponent(tag)}`}
              className="px-4 py-2 rounded-xl border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-secondary)] transition"
            >
              {tag} <span className="text-[var(--text-muted)]">({count})</span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
