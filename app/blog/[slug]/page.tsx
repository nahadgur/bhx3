import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/blog-utils'
import BlogSidebar from '@/components/BlogSidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.metaTitle || `${post.title} | Building Health X`,
    description: post.metaDescription || post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <article className="max-w-7xl mx-auto px-4 py-10 pt-28">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition"
        >
          <ChevronLeft size={16} />
          Back to all posts
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-3">{post.title}</h1>
            <div className="text-sm text-[var(--text-muted)] mb-6">
              {post.dateISO
                ? new Date(post.dateISO).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </div>

            {post.tags && post.tags.length ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="px-3 py-1 rounded-full border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            ) : null}

            {post.featuredImage ? (
              <div className="card overflow-hidden mb-7">
                <div className="aspect-[16/9] w-full bg-[var(--bg-secondary)]">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            ) : null}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          <BlogSidebar currentSlug={post.slug} />
        </div>
      </article>

      <Footer />
    </div>
  )
}
