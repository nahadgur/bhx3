// File: app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzk37N4JfOK5bgZ82-TEgTO6W5yYgT-S43WRPkeL_rWrygnnJpvxA1SQ4G4HIhywwU8Xw/exec'

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare data for Google Sheets
    const formData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      serviceType: body.serviceType || body.serviceName || 'Not specified',
      serviceSlug: body.serviceSlug || '',
      location: body.location || body.locationName || 'Not specified',
      locationSlug: body.locationSlug || '',
      sourceUrl: body.sourceUrl || '',
    }

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      // Important: Follow redirects
      redirect: 'follow',
    })

    // Google Apps Script returns text, not JSON
    const responseText = await response.text()
    
    // Try to parse as JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch {
      // If it's not JSON, just check if request succeeded
      if (response.ok) {
        result = { success: true }
      } else {
        throw new Error('Failed to submit to Google Sheets')
      }
    }

    if (result.success !== false) {
      return NextResponse.json(
        { success: true, message: 'Lead submitted successfully' },
        { status: 200 }
      )
    } else {
      throw new Error(result.error || 'Unknown error')
    }

  } catch (error: any) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    )
  }
}

// Optional: Handle GET requests
export async function GET() {
  return NextResponse.json(
    { message: 'Lead submission endpoint. Use POST to submit leads.' },
    { status: 200 }
  )
}
