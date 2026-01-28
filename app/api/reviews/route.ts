import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const PUBLIC_REVIEW_COLUMNS = 'id,bbl,rating,title,review,pros,cons,lived_here,years_lived,author_name,helpful_count,created_at'

// Best-effort, in-memory rate limiting. This helps deter basic spam without
// introducing any external dependencies.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 3
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || null
  const xri = req.headers.get('x-real-ip')
  if (xri) return xri.trim() || null
  // NextRequest may provide ip in some runtimes; keep this as a safe fallback.
  // @ts-ignore
  if (req.ip) return String(req.ip)
  return null
}

// GET reviews for a building
export async function GET(req: NextRequest) {
  const bbl = req.nextUrl.searchParams.get('bbl')
  
  if (!bbl) {
    return NextResponse.json({ error: 'BBL required' }, { status: 400 })
  }

  // If reviews aren't configured yet (missing env vars), don't hard-fail the
  // whole building page. Return an empty, well-formed payload.
  if (!supabase) {
    return NextResponse.json({
      reviews: [],
      count: 0,
      averageRating: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      warning: 'Reviews are not configured on the server.'
    })
  }

  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      // Never return contact info (email/phone) to the client.
      .select(PUBLIC_REVIEW_COLUMNS)
      .eq('bbl', bbl)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews?.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++
    })

    return NextResponse.json({
      reviews: reviews || [],
      count: reviews?.length || 0,
      averageRating: Math.round(avgRating * 10) / 10,
      distribution
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST a new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Honeypot field (should remain empty). Helps block naive bots.
    if (typeof body?.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    const { bbl, rating, title, review, pros, cons, lived_here, years_lived, author_name, email, phone } = body

    if (!bbl || !rating || !review) {
      return NextResponse.json({ error: 'BBL, rating, and review are required' }, { status: 400 })
    }

    if (!email || !phone) {
      return NextResponse.json({ error: 'Email and phone are required (not shown publicly)' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured on the server' }, { status: 500 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (review.length < 10) {
      return NextResponse.json({ error: 'Review must be at least 10 characters' }, { status: 400 })
    }

    // Rate limit (best effort). 3 submissions per IP per 15 minutes.
    const ip = getClientIp(req)
    if (ip) {
      const now = Date.now()
      const entry = rateLimit.get(ip)
      if (!entry || now > entry.resetAt) {
        rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
      } else {
        if (entry.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ error: 'Too many review submissions. Please try again in a bit.' }, { status: 429 })
        }
        entry.count += 1
        rateLimit.set(ip, entry)
      }
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        bbl,
        rating: Math.round(rating),
        title: title?.trim() || null,
        review: review.trim(),
        pros: pros?.trim() || null,
        cons: cons?.trim() || null,
        lived_here: lived_here || false,
        years_lived: years_lived || null,
        author_name: author_name?.trim() || 'Anonymous',
        email: email.trim(),
        phone: phone.trim(),
      }])
      // Only return public fields.
      .select(PUBLIC_REVIEW_COLUMNS)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, review: data })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
