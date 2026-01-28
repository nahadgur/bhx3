import Link from 'next/link'
import { getAllPosts } from '@/lib/blog-utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Blog | Building Health X',
  description: 'Practical NYC renting checklists and building walkthrough tips.',
}

export default function BlogIndexPage({ searchParams }: { searchParams?: { page?: string; tag?: string } }) {
  const allPosts = getAllPosts()
  const activeTag = searchParams?.tag
  const posts = activeTag ? allPosts.filter((p) => (p.tags || []).includes(activeTag)) : allPosts

  const pageSize = 12
  const pageNum = Math.max(1, Number.parseInt(searchParams?.page || '1', 12) || 1)
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
  const page = Math.min(pageNum, totalPages)
  const start = (page - 1) * pageSize
  const shown = posts.slice(start, start + pageSize)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl md:text-4xl font-black mb-2">NYC Renter Guides</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">
          Checklists and walkthrough tips you can use on a tour. with photos and tables included.
        </p>

        {posts.length && allPosts.length ? (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/blog"
              className={`px-3 py-1 rounded-full border border-[var(--border-primary)] text-xs transition ${!activeTag ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
              All
            </Link>
            {Array.from(new Set(allPosts.flatMap((p) => p.tags || []))).sort().map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`px-3 py-1 rounded-full border border-[var(--border-primary)] text-xs transition ${activeTag === t ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
              >
                {t}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card overflow-hidden hover:translate-y-[-2px] transition group"
            >
              {p.featuredImage ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--bg-secondary)]">
                  <img
                    src={p.featuredImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10" />
              )}
              <div className="p-5">
                <h2 className="font-bold leading-snug mb-2 group-hover:text-blue-400 transition">{p.title}</h2>
                <div className="text-xs text-[var(--text-muted)] mb-2">
                  {p.dateISO ? new Date(p.dateISO).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Link
              href={`/blog?page=${Math.max(1, page - 1)}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
              className={`px-4 py-2 rounded-xl border border-[var(--border-primary)] text-sm transition ${page <= 1 ? 'opacity-40 pointer-events-none' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
              Prev
            </Link>
            <div className="text-sm text-[var(--text-muted)]">
              Page {page} of {totalPages}
            </div>
            <Link
              href={`/blog?page=${Math.min(totalPages, page + 1)}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
              className={`px-4 py-2 rounded-xl border border-[var(--border-primary)] text-sm transition ${page >= totalPages ? 'opacity-40 pointer-events-none' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
              Next
            </Link>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
