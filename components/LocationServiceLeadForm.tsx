'use client'

import { useMemo, useState } from 'react'
import { services } from '@/lib/services-data'
import { locations } from '@/lib/locations-data'

type Props = {
  /** If provided, locks the location dropdown to this slug */
  locationSlug?: string
  locationName?: string
}

export default function LocationServiceLeadForm({ locationSlug, locationName }: Props) {
  const serviceOptions = useMemo(
    () => Object.entries(services).map(([slug, s]) => ({ slug, name: s.name })),
    []
  )

  const locationOptions = useMemo(
    () => Object.entries(locations).map(([slug, l]) => ({ slug, name: l.name })),
    []
  )

  const [service, setService] = useState(serviceOptions[0]?.slug || 'moving-companies')
  const [loc, setLoc] = useState(locationSlug || locationOptions[0]?.slug || 'manhattan')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const chosenServiceName = services[service]?.name || 'Service'
  const chosenLocationName = locationName || locations[loc]?.name || 'NYC'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const payload = {
        name,
        email,
        phone,
        address: address || undefined,
        serviceSlug: service,
        serviceName: chosenServiceName,
        locationSlug: locationSlug || loc,
        locationName: chosenLocationName,
        message: notes,
      }
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <div className="grid gap-2.5">
        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {serviceOptions.map((s) => (
              <option key={s.slug} value={s.slug} className="bg-[#0a0e17]">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Location</label>
          {locationSlug ? (
            <input
              value={chosenLocationName}
              readOnly
              className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0]/80 text-sm"
            />
          ) : (
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locationOptions.map((l) => (
                <option key={l.slug} value={l.slug} className="bg-[#0a0e17]">
                  {l.name}
                </option>
              ))}
            </select>
          )}
        </div>

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
            type="tel"
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(212) 555-0123"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#cbd5e1] mb-1">What do you need?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg bg-[#0b1220] border border-[#1e293b] px-3 py-2 text-[#e2e8f0] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={`Moving to ${chosenLocationName}? Share timing, size, special items...`}
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
          {error}
        </div>
      )}

      <button
        disabled={status === 'submitting' || status === 'success'}
        type="submit"
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
