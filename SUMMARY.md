# Building Health X — Update Summary

Generated: 2026-01-08 (Europe/London)

## What was updated

Homepage
- Added a prominent **Building Health X** heading above the existing tagline.
- Kept the long explainer paragraph exactly as provided.

Results page
- Category cards / category BHX Scores are now clickable: clicking switches to the correct tab and auto-scrolls to the matching detail section.
- Renamed all visible instances of “Score” → **“BHX Score”** across the results page UI.
- Added `components/ScoreLink.tsx` for reusable, accessible score links.

Service landing pages (174 total)
- Added programmatic routes at `/services/[service]/[location]` for all 6 services × 29 locations.
- Each page includes:
  - Location-specific context (>=150 words)
  - Service-specific section for that neighborhood (>=200 words)
  - Data-driven insights tied to Building Health X NYC open-data signals
  - Lead capture form
  - Internal links (tool + related blog content)

Blog system overhaul
- New content source of truth: `/content/blog/**/index.mdx`
- Imported **127** posts from `nyc_vgi5s_c_387_articles.csv` into the new structure.
- Updated `/blog` index with pagination (10 per page) and tag filtering.
- Updated `/blog/[slug]` template with featured image, “Recent Articles”, related posts, and tags.
- Implemented automatic interlinking:
  - Related blog posts (based on tags/title similarity)
  - CTA back to the Building Health X tool
  - Contextual links to relevant service landing pages where appropriate

SEO foundations
- Added `app/sitemap.ts` (includes blog + all 174 service pages).
- Added `app/robots.ts`.
- Added JSON-LD schema to service landing pages.

Google Sheets lead capture (server-side)
- Lead forms submit to `POST /api/leads`.
- Server validates + timestamps + forwards payload to a webhook (Google Sheets via Apps Script or similar) using environment variables.

## New URLs created

### Service landing pages (174)
All pages follow: `/services/<service-slug>/<location-slug>`

Service slugs:
- moving-companies, renters-insurance, pest-control, storage-facilities, building-inspectors

Location slugs:
- upper-east-side, upper-west-side, harlem, east-village, west-village, chelsea, tribeca, hells-kitchen, williamsburg, bushwick, bedford-stuyvesant, park-slope, downtown-brooklyn, dumbo, crown-heights, greenpoint, astoria, long-island-city, flushing, jackson-heights, ridgewood, sunnyside, fordham, kingsbridge, riverdale, mott-haven, pelham-bay, st-george, stapleton

Full list (174):
- /services/moving-companies/upper-east-side
- /services/moving-companies/upper-west-side
- /services/moving-companies/harlem
- /services/moving-companies/east-village
- /services/moving-companies/west-village
- /services/moving-companies/chelsea
- /services/moving-companies/tribeca
- /services/moving-companies/hells-kitchen
- /services/moving-companies/williamsburg
- /services/moving-companies/bushwick
- /services/moving-companies/bedford-stuyvesant
- /services/moving-companies/park-slope
- /services/moving-companies/downtown-brooklyn
- /services/moving-companies/dumbo
- /services/moving-companies/crown-heights
- /services/moving-companies/greenpoint
- /services/moving-companies/astoria
- /services/moving-companies/long-island-city
- /services/moving-companies/flushing
- /services/moving-companies/jackson-heights
- /services/moving-companies/ridgewood
- /services/moving-companies/sunnyside
- /services/moving-companies/fordham
- /services/moving-companies/kingsbridge
- /services/moving-companies/riverdale
- /services/moving-companies/mott-haven
- /services/moving-companies/pelham-bay
- /services/moving-companies/st-george
- /services/moving-companies/stapleton
- /services/renters-insurance/upper-east-side
- /services/renters-insurance/upper-west-side
- /services/renters-insurance/harlem
- /services/renters-insurance/east-village
- /services/renters-insurance/west-village
- /services/renters-insurance/chelsea
- /services/renters-insurance/tribeca
- /services/renters-insurance/hells-kitchen
- /services/renters-insurance/williamsburg
- /services/renters-insurance/bushwick
- /services/renters-insurance/bedford-stuyvesant
- /services/renters-insurance/park-slope
- /services/renters-insurance/downtown-brooklyn
- /services/renters-insurance/dumbo
- /services/renters-insurance/crown-heights
- /services/renters-insurance/greenpoint
- /services/renters-insurance/astoria
- /services/renters-insurance/long-island-city
- /services/renters-insurance/flushing
- /services/renters-insurance/jackson-heights
- /services/renters-insurance/ridgewood
- /services/renters-insurance/sunnyside
- /services/renters-insurance/fordham
- /services/renters-insurance/kingsbridge
- /services/renters-insurance/riverdale
- /services/renters-insurance/mott-haven
- /services/renters-insurance/pelham-bay
- /services/renters-insurance/st-george
- /services/renters-insurance/stapleton
- /services/pest-control/upper-east-side
- /services/pest-control/upper-west-side
- /services/pest-control/harlem
- /services/pest-control/east-village
- /services/pest-control/west-village
- /services/pest-control/chelsea
- /services/pest-control/tribeca
- /services/pest-control/hells-kitchen
- /services/pest-control/williamsburg
- /services/pest-control/bushwick
- /services/pest-control/bedford-stuyvesant
- /services/pest-control/park-slope
- /services/pest-control/downtown-brooklyn
- /services/pest-control/dumbo
- /services/pest-control/crown-heights
- /services/pest-control/greenpoint
- /services/pest-control/astoria
- /services/pest-control/long-island-city
- /services/pest-control/flushing
- /services/pest-control/jackson-heights
- /services/pest-control/ridgewood
- /services/pest-control/sunnyside
- /services/pest-control/fordham
- /services/pest-control/kingsbridge
- /services/pest-control/riverdale
- /services/pest-control/mott-haven
- /services/pest-control/pelham-bay
- /services/pest-control/st-george
- /services/pest-control/stapleton
- /services/storage-facilities/upper-east-side
- /services/storage-facilities/upper-west-side
- /services/storage-facilities/harlem
- /services/storage-facilities/east-village
- /services/storage-facilities/west-village
- /services/storage-facilities/chelsea
- /services/storage-facilities/tribeca
- /services/storage-facilities/hells-kitchen
- /services/storage-facilities/williamsburg
- /services/storage-facilities/bushwick
- /services/storage-facilities/bedford-stuyvesant
- /services/storage-facilities/park-slope
- /services/storage-facilities/downtown-brooklyn
- /services/storage-facilities/dumbo
- /services/storage-facilities/crown-heights
- /services/storage-facilities/greenpoint
- /services/storage-facilities/astoria
- /services/storage-facilities/long-island-city
- /services/storage-facilities/flushing
- /services/storage-facilities/jackson-heights
- /services/storage-facilities/ridgewood
- /services/storage-facilities/sunnyside
- /services/storage-facilities/fordham
- /services/storage-facilities/kingsbridge
- /services/storage-facilities/riverdale
- /services/storage-facilities/mott-haven
- /services/storage-facilities/pelham-bay
- /services/storage-facilities/st-george
- /services/storage-facilities/stapleton
- /services/building-inspectors/upper-east-side
- /services/building-inspectors/upper-west-side
- /services/building-inspectors/harlem
- /services/building-inspectors/east-village
- /services/building-inspectors/west-village
- /services/building-inspectors/chelsea
- /services/building-inspectors/tribeca
- /services/building-inspectors/hells-kitchen
- /services/building-inspectors/williamsburg
- /services/building-inspectors/bushwick
- /services/building-inspectors/bedford-stuyvesant
- /services/building-inspectors/park-slope
- /services/building-inspectors/downtown-brooklyn
- /services/building-inspectors/dumbo
- /services/building-inspectors/crown-heights
- /services/building-inspectors/greenpoint
- /services/building-inspectors/astoria
- /services/building-inspectors/long-island-city
- /services/building-inspectors/flushing
- /services/building-inspectors/jackson-heights
- /services/building-inspectors/ridgewood
- /services/building-inspectors/sunnyside
- /services/building-inspectors/fordham
- /services/building-inspectors/kingsbridge
- /services/building-inspectors/riverdale
- /services/building-inspectors/mott-haven
- /services/building-inspectors/pelham-bay
- /services/building-inspectors/st-george
- /services/building-inspectors/stapleton

### Blog
- Blog index: `/blog`
- Individual posts: `/blog/<post-slug>` (127 posts)

## Issues / manual review

### Missing featured images
# Posts missing a featured image in the CSV

- what-do-i-do-if-my-nyc-apartment-has-no-heat

## Environment variables required

Create a `.env.local` (or set in Vercel project settings):

- `NEXT_PUBLIC_SITE_URL` (recommended)  
  Base URL used by sitemap (e.g. `https://vimnyc15.vercel.app`)

Leads → Google Sheets forwarding:
- `LEADS_SHEETS_WEBHOOK_URL`  
  Your deployed webhook endpoint (e.g. Google Apps Script Web App URL)
- `LEADS_SHEETS_WEBHOOK_SECRET` (optional)  
  If set, the server will send header `X-BHX-Lead-Secret: <secret>` and your webhook should validate it.

## How to add a new blog post

1) Create a folder:
- `/content/blog/<new-post-slug>/`

2) Add the post file:
- `/content/blog/<new-post-slug>/index.mdx`

Recommended frontmatter:
```md
---
title: "Your Post Title"
date: "2026-01-08"
excerpt: "1–2 sentence summary for the blog index."
featuredImage: "/blog/<new-post-slug>/images/featured.jpg"
tags:
  - Tenant Rights
  - Neighbourhoods
metaTitle: "SEO title"
metaDescription: "SEO description"
---
```

3) Add images under:
- `/content/blog/<new-post-slug>/images/`

4) Reference images in MDX using your chosen path convention (the existing posts preserve HTML `<img>` tags where present).

## Notes
- Core API routes and scoring logic were not modified.
- New pages are statically generated where possible (via `generateStaticParams()` for service pages).
