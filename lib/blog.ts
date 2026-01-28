import fs from 'fs'
import path from 'path'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  html: string
}

export type BlogPostMeta = Omit<BlogPost, 'html'>

type IndexedPostMeta = BlogPostMeta & { filePath: string }

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog_src')

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-')

const walk = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  const out: string[] = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(full))
    else if (ent.isFile() && full.toLowerCase().endsWith('.txt')) out.push(full)
  }
  return out
}

const extractCover = (html: string): string | undefined => {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return m?.[1]
}

const extractExcerpt = (html: string): string => {
  const pm = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const base = pm?.[1] ? stripHtml(pm[1]) : stripHtml(html)
  return base.length > 220 ? `${base.slice(0, 220).trim()}…` : base
}

let cachedIndex: IndexedPostMeta[] | null = null
let cachedBySlug: Map<string, IndexedPostMeta> | null = null

const buildIndex = (): IndexedPostMeta[] => {
  if (cachedIndex) return cachedIndex

  const files = walk(BLOG_ROOT)
  const slugCounts = new Map<string, number>()
  const indexed: IndexedPostMeta[] = []

  for (const filePath of files) {
    const title = path.basename(filePath, path.extname(filePath))
    const html = fs.readFileSync(filePath, 'utf8')

    const baseSlug = slugify(title)
    const prev = slugCounts.get(baseSlug) || 0
    slugCounts.set(baseSlug, prev + 1)
    const slug = prev === 0 ? baseSlug : `${baseSlug}-${prev + 1}`

    indexed.push({
      slug,
      title,
      excerpt: extractExcerpt(html),
      coverImage: extractCover(html),
      filePath,
    })
  }

  indexed.sort((a, b) => a.title.localeCompare(b.title))

  cachedIndex = indexed
  cachedBySlug = new Map(indexed.map((p) => [p.slug, p]))
  return indexed
}

export const getAllPosts = (): BlogPostMeta[] => buildIndex().map(({ filePath: _fp, ...meta }) => meta)

export const getPostBySlug = (slug: string): BlogPost | null => {
  const index = buildIndex()
  if (!cachedBySlug) cachedBySlug = new Map(index.map((p) => [p.slug, p]))
  const meta = cachedBySlug.get(slug)
  if (!meta) return null
  const html = fs.readFileSync(meta.filePath, 'utf8')
  return { ...meta, html }
}
