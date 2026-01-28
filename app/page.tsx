'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  Bug,
  Building2,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  Flame,
  Scale,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { services } from '@/lib/services-data'

interface Suggestion {
  bbl: string
  address: string
  borough: string
  zipcode: string
  neighborhood?: string
  units?: number
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const reqSeqRef = useRef(0)

  const acCacheRef = useRef<Map<string, { t: number; data: Suggestion[] }>>(new Map())
  const AC_TTL_MS = 5 * 60 * 1000

  const getCached = (q: string): Suggestion[] | null => {
    const hit = acCacheRef.current.get(q)
    if (!hit) return null
    if (Date.now() - hit.t > AC_TTL_MS) {
      acCacheRef.current.delete(q)
      return null
    }
    return hit.data
  }

  const setCached = (q: string, data: Suggestion[]) => {
    if (acCacheRef.current.size > 75) {
      const firstKey = acCacheRef.current.keys().next().value
      if (firstKey) acCacheRef.current.delete(firstKey)
    }
    acCacheRef.current.set(q, { t: Date.now(), data })
  }

  useEffect(() => {
    if (query.length < 2) {
      abortRef.current?.abort()
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    const trimmed = query.trim()

    const cachedExact = getCached(trimmed)
    if (cachedExact) {
      setSuggestions(cachedExact)
      setShowDropdown(cachedExact.length > 0)
    } else {
      let provisional: Suggestion[] | null = null
      for (let i = trimmed.length - 1; i >= 2; i--) {
        const prefix = trimmed.slice(0, i)
        const cachedPrefix = getCached(prefix)
        if (cachedPrefix && cachedPrefix.length) {
          const needle = trimmed.toLowerCase()
          provisional = cachedPrefix
            .filter((s) => s.address.toLowerCase().includes(needle))
            .slice(0, 8)
          break
        }
      }
      if (provisional && provisional.length) {
        setSuggestions(provisional)
        setShowDropdown(true)
      }
    }

    const seq = ++reqSeqRef.current
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        if (reqSeqRef.current !== seq) return

        if (data?.suggestions?.length) {
          setSuggestions(data.suggestions)
          setShowDropdown(true)
          setCached(trimmed, data.suggestions)
        } else {
          setSuggestions([])
          setShowDropdown(false)
          setCached(trimmed, [])
        }
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return
        setSuggestions([])
        setShowDropdown(false)
      }
    }, 80)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (s: Suggestion) => {
    setLoading(true)
    setShowDropdown(false)
    router.push(`/building/${s.bbl}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || !suggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((p) => (p < suggestions.length - 1 ? p + 1 : p))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((p) => (p > 0 ? p - 1 : 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex])
      return
    }

    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/lookup?address=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data?.bbl) router.push(`/building/${data.bbl}`)
      else {
        setLoading(false)
        alert(data?.error || 'Address not found. Try including borough name.')
      }
    } catch {
      setLoading(false)
      alert('Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    const counters = document.querySelectorAll('.counter')

    const animateCounter = (element: Element) => {
      const target = parseInt(element.getAttribute('data-target') || '0', 10)
      const suffix = element.getAttribute('data-suffix') || ''
      const duration = 2000
      const increment = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        current += increment
        if (current < target) {
          if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M' + suffix
          } else {
            element.textContent = Math.ceil(current).toString() + suffix
          }
          requestAnimationFrame(updateCounter)
        } else {
          if (target >= 1000000) {
            element.textContent = (target / 1000000).toFixed(0) + 'M' + suffix
          } else {
            element.textContent = target.toString() + suffix
          }
        }
      }

      updateCounter()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    counters.forEach((counter) => observer.observe(counter))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] float" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] float-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Trusted by <span className="text-[var(--text-primary)] font-semibold">10,000+</span> NYC renters
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Research Any NYC Building</span>
              <span className="gradient-text">Before You Sign the Lease</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Stop gambling on your next apartment. Search any address and instantly see{' '}
              <span className="text-[var(--text-primary)] font-medium">violations</span>,{' '}
              <span className="text-[var(--text-primary)] font-medium">pest history</span>,{' '}
              <span className="text-[var(--text-primary)] font-medium">heat complaints</span>, and{' '}
              <span className="text-[var(--text-primary)] font-medium">real tenant reviews</span>. all pulled from official NYC
              data.
            </p>
          </div>

          {/* Search Box (wider) */}
          <div className="max-w-7xl mx-auto mb-10 w-full" ref={dropdownRef}>
            <form onSubmit={handleSubmit}>
              <div className="search-glow bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 min-w-0">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-muted)] flex-shrink-0" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setSelectedIndex(-1)
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                      placeholder="Enter NYC address..."
                      className="flex-1 py-3.5 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none text-sm sm:text-lg min-w-0"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="cta-super flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="hidden sm:inline">Loading</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Check Building</span>
                        <span className="sm:hidden">Check</span>
                        <span className="cta-arrow">
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showDropdown && suggestions.length > 0 && (
                <div className="autocomplete-dropdown animate-slide-up">
                  {suggestions.map((s, i) => (
                    <div
                      key={s.bbl}
                      className={`autocomplete-item ${i === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleSelect(s)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--bg-hover)] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.address}</div>
                          <div className="text-sm text-[var(--text-muted)]">
                            {s.neighborhood ? `${s.neighborhood}, ` : ''}
                            {s.borough} {s.zipcode}
                            {s.units ? ` • ${s.units} units` : ''}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="stat-card-new px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left min-w-0">
                <div
                  className="text-xl sm:text-2xl font-bold counter select-none pointer-events-none"
                  data-target="1000000"
                  data-suffix="+"
                >
                  1M+
                </div>
                <div className="text-xs text-[var(--text-muted)] truncate">Buildings Indexed</div>
              </div>
            </div>

            <div className="stat-card-new px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xl sm:text-2xl font-bold counter select-none pointer-events-none" data-target="55" data-suffix="+">
                  55+
                </div>
                <div className="text-xs text-[var(--text-muted)] truncate">Data Sources</div>
              </div>
            </div>

            <div className="stat-card-new px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xl sm:text-2xl font-bold counter select-none pointer-events-none" data-target="100" data-suffix="%">
                  100%
                </div>
                <div className="text-xs text-[var(--text-muted)] truncate">Free to Use</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-[var(--border-secondary)] rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* WHAT WE CHECK */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
              Comprehensive Data
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What We Check For You</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              We pull from 55+ official NYC data sources so you don't have to dig through government websites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="gradient-border card-lift group cursor-pointer">
              <div className="bg-[var(--bg-card)] rounded-2xl p-8 h-full">
                <div className="icon-glow w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">HPD & DOB Violations</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Active and historical violations from Housing Preservation & Development and Department of Buildings.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded">Class A</span>
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded">Class B</span>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded">Class C</span>
                </div>
              </div>
            </div>

            <div className="gradient-border card-lift group cursor-pointer">
              <div className="bg-[var(--bg-card)] rounded-2xl p-8 h-full">
                <div className="icon-glow w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Heat & Hot Water History</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  311 complaints and HPD violations related to heating failures. Critical for NYC winters.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded">Heat Outages</span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">Hot Water</span>
                </div>
              </div>
            </div>

            <div className="gradient-border card-lift group cursor-pointer">
              <div className="bg-[var(--bg-card)] rounded-2xl p-8 h-full">
                <div className="icon-glow w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Bug className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pest & Rodent Reports</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Bed bug filings, roach complaints, and DOHMH rodent inspections.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">Bed Bugs</span>
                  <span className="px-2 py-1 bg-teal-500/10 text-teal-400 text-xs font-medium rounded">Roaches</span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded">Rodents</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-xl p-4 flex items-center gap-3 hover:bg-[var(--bg-card)] transition cursor-pointer icon-spin">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Owner Info</div>
                <div className="text-xs text-[var(--text-muted)]">ACRIS records</div>
              </div>
            </div>

            <div className="bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-xl p-4 flex items-center gap-3 hover:bg-[var(--bg-card)] transition cursor-pointer icon-spin">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Eviction History</div>
                <div className="text-xs text-[var(--text-muted)]">Marshal records</div>
              </div>
            </div>

            <div className="bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-xl p-4 flex items-center gap-3 hover:bg-[var(--bg-card)] transition cursor-pointer icon-spin">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Rent Stabilization</div>
                <div className="text-xs text-[var(--text-muted)]">DHCR database</div>
              </div>
            </div>

            <div className="bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-xl p-4 flex items-center gap-3 hover:bg-[var(--bg-card)] transition cursor-pointer icon-spin">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Building Permits</div>
                <div className="text-xs text-[var(--text-muted)]">DOB filings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                The Only NYC Building Research Tool You'll Ever Need
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
                Finding an apartment in New York City is already stressful enough. We've done the hard work of
                aggregating data from <strong className="text-[var(--text-primary)]">55+ official NYC data sources</strong>. so
                you can make informed decisions in minutes, not hours.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Real-Time NYC Open Data Integration</h4>
                    <p className="text-[var(--text-secondary)]">
                      We pull directly from HPD, DOB, ACRIS, 311, DOHMH, and dozens more official sources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Instant Address Lookup for Any NYC Building</h4>
                    <p className="text-[var(--text-secondary)]">
                      Search over 1 million properties across all five boroughs instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Tenant-Focused Insights & Red Flag Alerts</h4>
                    <p className="text-[var(--text-secondary)]">
                      We highlight repeated heat complaints, pest infestations, and buildings on watchlists.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold gradient-text mb-2">55+</div>
                  <div className="text-[var(--text-secondary)]">Official NYC Data Sources</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--bg-hover)] rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">1M+</div>
                    <div className="text-xs text-[var(--text-muted)]">Properties Indexed</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">10K+</div>
                    <div className="text-xs text-[var(--text-muted)]">Monthly Searches</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">5</div>
                    <div className="text-xs text-[var(--text-muted)]">NYC Boroughs</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-1">24/7</div>
                    <div className="text-xs text-[var(--text-muted)]">Data Updates</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1.5 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-full text-xs text-[var(--text-secondary)]">
                    HPD Violations
                  </span>
                  <span className="px-3 py-1.5 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-full text-xs text-[var(--text-secondary)]">
                    DOB Complaints
                  </span>
                  <span className="px-3 py-1.5 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-full text-xs text-[var(--text-secondary)]">
                    311 Reports
                  </span>
                  <span className="px-3 py-1.5 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-full text-xs text-[var(--text-secondary)]">
                    ACRIS Records
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Help at Every Step of Your Move</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              From finding your apartment to settling in, we connect NYC renters with trusted local professionals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(services).map(([slug, service]) => (
              <Link key={slug} href={`/services/${slug}`} className="group gradient-border card-lift overflow-hidden">
                <div className="bg-[var(--bg-card)] rounded-2xl h-full overflow-hidden">
                  <div className="relative w-full h-40 bg-[var(--bg-hover)]">
                    <Image
                      src={`/services/${slug}.png`}
                      alt={`${service.name} in NYC`}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">Get matched with experienced pros and fast availability.</p>
                    <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--bg-hover)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] font-semibold rounded-xl transition"
            >
              View All Services
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 bg-[var(--bg-primary)] border-y border-[var(--border-primary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest font-medium">
              Powered by Official NYC Government Data
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              NYC Open Data
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              HPD
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              DOB
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              311
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              ACRIS
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-lg transition cursor-default">
              DOHMH
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
