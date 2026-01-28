import { allRawPosts } from '@/content/blog'

export type BlogPostMeta = {
  slug: string
  title: string
  excerpt: string
  featuredImage?: string
  tags: string[]
  dateISO?: string
  metaTitle?: string
  metaDescription?: string
  schema?: unknown
}

export type BlogPost = BlogPostMeta & {
  html: string
}

type IndexedPost = BlogPostMeta & { raw: string }
type Frontmatter = Record<string, unknown>

let cachedIndex: IndexedPost[] | null = null
let cachedBySlug: Map<string, IndexedPost> | null = null

const DEFAULT_LIST_COUNT = 12

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractExcerpt = (html: string): string => {
  const pm = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const base = pm?.[1] ? stripHtml(pm[1]) : stripHtml(html)
  return base.length > 220 ? `${base.slice(0, 220).trim()}…` : base
}

const parseFrontmatter = (raw: string): { fm: Frontmatter; body: string } => {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) return { fm: {}, body: raw }

  const end = trimmed.indexOf('\n---', 3)
  if (end === -1) return { fm: {}, body: raw }

  const fmBlock = trimmed.slice(3, end).trim()
  const body = trimmed.slice(end + '\n---'.length).trimStart()

  const fm: Frontmatter = {}
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    const val = m[2].trim()

    // very small YAML subset: quoted strings, bare strings, JSON-like objects, and ["a","b"] lists
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        fm[key] = JSON.parse(val)
      } catch {
        fm[key] = val
      }
    } else if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
      try {
        fm[key] = JSON.parse(val)
      } catch {
        fm[key] = val
      }
    } else if (val.startsWith('"') && val.endsWith('"')) {
      fm[key] = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    } else {
      fm[key] = val
    }
  }

  return { fm, body }
}

const buildIndex = (): IndexedPost[] => {
  if (cachedIndex) return cachedIndex

  const out: IndexedPost[] = []
  for (const { raw } of allRawPosts) {
    const { fm, body } = parseFrontmatter(raw)

    const title = (fm.title as string) || 'Untitled'
    const slug = (fm.slug as string) || ''
    if (!slug) continue

    const featuredImage = (fm.featuredImage as string) || undefined
    const metaTitle = (fm.metaTitle as string) || undefined
    const metaDescription = (fm.metaDescription as string) || undefined
    const schema = fm.schema

    const tags = Array.isArray(fm.tags) ? (fm.tags as string[]).filter(Boolean) : []

    const dateISO = (fm.date as string) || undefined
    const excerpt = (fm.excerpt as string) || extractExcerpt(body)

    out.push({
      slug,
      title,
      excerpt,
      featuredImage,
      tags,
      dateISO,
      metaTitle,
      metaDescription,
      schema,
      raw,
    })
  }

  // reverse chronological using dateISO, fallback to title
  out.sort((a, b) => {
    const ad = Date.parse(a.dateISO || '')
    const bd = Date.parse(b.dateISO || '')
    if (!Number.isNaN(ad) && !Number.isNaN(bd) && ad !== bd) return bd - ad
    return a.title.localeCompare(b.title)
  })

  cachedIndex = out
  cachedBySlug = new Map(out.map((p) => [p.slug, p]))
  return out
}

export const getAllPosts = (): BlogPostMeta[] => buildIndex().map(({ raw: _raw, ...m }) => m)

export const getPostBySlug = (slug: string): BlogPost | null => {
  const index = buildIndex()
  if (!cachedBySlug) cachedBySlug = new Map(index.map((p) => [p.slug, p]))
  const meta = cachedBySlug.get(slug)
  if (!meta) return null

  const { body } = parseFrontmatter(meta.raw)

  // Posts are stored as HTML blocks inside MDX/MD. We render them as HTML.
  return { ...meta, html: body.replace(/<\/?strong>/gi, '') }
}

export const getRecentPosts = (count = DEFAULT_LIST_COUNT): BlogPostMeta[] =>
  getAllPosts().slice(0, count)

export const getRelatedPosts = (slug: string, count = 6): BlogPostMeta[] => {
  const all = getAllPosts()
  const cur = all.find((p) => p.slug === slug)
  if (!cur) return all.filter((p) => p.slug !== slug).slice(0, count)

  const curTags = new Set((cur.tags || []).map((t) => t.toLowerCase()))
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const s = (p.tags || []).reduce((acc, t) => acc + (curTags.has(t.toLowerCase()) ? 1 : 0), 0)
      return { p, s }
    })
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p)

  const top = scored.filter((p) => (p.tags || []).some((t) => curTags.has(t.toLowerCase()))).slice(0, count)
  if (top.length >= Math.min(count, 3)) return top
  return [...top, ...scored.filter((p) => !top.find((x) => x.slug === p.slug)).slice(0, count - top.length)]
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags || []) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => (p.tags || []).includes(tag))
}
