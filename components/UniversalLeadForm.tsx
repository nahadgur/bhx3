'use client'

import { useMemo, useState } from 'react'

type UniversalLeadFormProps = {
  locationName?: string
  locationSlug?: string
  serviceName?: string
  serviceSlug?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function UniversalLeadForm({
  locationName,
  locationSlug,
  serviceName,
  serviceSlug,
}: UniversalLeadFormProps) {
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const sourceUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [])

  const placeholderText = useMemo(() => {
    if (serviceName && locationName) {
      return `Need ${serviceName.toLowerCase()} in ${locationName}? Share timing, details...`
    } else if (serviceName) {
      return `Need ${serviceName.toLowerCase()}? Share timing, location, details...`
    } else if (locationName) {
      return `What service do you need in ${locationName}? (moving, cleaning, etc.)`
    }
    return 'What service do you need? Share location, timing, details...'
  }, [serviceName, locationName])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: serviceName || 'Not specified',
          serviceSlug: serviceSlug || undefined,
          location: locationName || 'Not specified',
          locationSlug: locationSlug || undefined,
          name,
          email,
          phone,
          message,
          sourceUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (err: any) {
      setStatus('error')
      setError(err?.message || 'Something went wrong. Please try again.')
    }
  }

  const disabled = status === 'submitting'

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      <div className="grid gap-2.5">
        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(212) 555-0123"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">What do you need?</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={placeholderText}
          />
        </div>
      </div>

      {status === 'success' && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          ✓ Request received! We'll send you quotes within 24 hours.
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error || 'Something went wrong. Please try again.'}
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600 transition font-semibold text-sm"
      >
        {status === 'submitting' ? 'Sending...' : 'Get Free Quotes'}
      </button>

      <p className="text-[10px] text-[#64748b] leading-tight text-center">
        100% free • No spam • Quick response
      </p>
    </form>
  )
}
