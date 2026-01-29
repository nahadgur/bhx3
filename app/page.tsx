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
  const dropdownRef = useRef<HTMLFormElement>(null)
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
      const startTime = Date.now()

      const updateCounter = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = Math.floor(progress * target)

        if (element instanceof HTMLElement) {
          element.textContent = `${current.toLocaleString()}${suffix}`
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        }
      }

      requestAnimationFrame(updateCounter)
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />

      {/* HERO - FULLY RESPONSIVE */}
      <section className="relative pt-20 sm:pt-24 md:pt-20 md:min-h-[calc(100vh-80px)] md:flex md:items-center md:justify-center pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl top-0 -left-10 sm:-left-20 md:-left-48 animate-pulse" />
          <div className="absolute w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-emerald-500/10 rounded-full blur-3xl bottom-0 -right-10 sm:-right-20 md:-right-48 animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
            Know Before You Move In{' '}
            <span className="gradient-text block mt-1 sm:mt-2">Search Any NYC Building</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--text-secondary)] mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Instantly access safety violations, complaints, permits, and more from official NYC data sources
          </p>

          {/* UNIVERSAL RESPONSIVE SEARCH BOX */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative" ref={dropdownRef}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter NYC address..."
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 md:py-4 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base transition-all"
                  />
                </div>

                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className="cta-super flex items-center gap-2 justify-center flex-shrink-0 disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="hidden sm:inline">Loading</span>
                      </>
                    ) : (
                      <>
                        <span className="!hidden sm:!inline">Check Building</span>
                        <span className="!inline sm:!hidden">Check</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <button
                      key={s.bbl}
                      type="button"
                      onClick={() => handleSelect(s)}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[var(--bg-hover)] transition border-b border-[var(--border-primary)] last:border-b-0 ${
                        i === selectedIndex ? 'bg-[var(--bg-hover)]' : ''
                      }`}
                    >
                      <div className="font-medium text-sm sm:text-base line-clamp-1">{s.address}</div>
                      <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 line-clamp-1">
                        {s.neighborhood ? `${s.neighborhood}, ` : ''}
                        {s.borough}
                        {s.zipcode ? ` ${s.zipcode}` : ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* UNIVERSAL RESPONSIVE LOADING SCREEN */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 mt-4 sm:mt-6">
                <div className="relative mb-4 sm:mb-5">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 text-center px-4">
                  Checking building safety...
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 text-center px-4">
                  Searching 55+ data sources
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[var(--text-muted)]">Instant Results</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
              <span className="text-[var(--text-muted)]">Official NYC Data</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
              <span className="text-[var(--text-muted)]">55+ Data Sources</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL FIND - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-secondary)] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              What You'll Find
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Everything You Need to Know About Your Building
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
              Comprehensive insights aggregated from 55+ official NYC data sources
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">HPD Violations</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Housing maintenance code violations and their status
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">311 Complaints</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Heat, hot water, pest, and other tenant complaints
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Pest Reports</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Rodent and pest inspection results from DOHMH
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">DOB Permits</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Active construction permits and work history
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Eviction History</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Eviction filings and legal proceedings data
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Property Records</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Ownership, sale history, and deed information
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Rent Stabilization</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Rent regulation status and unit counts
                </p>
              </div>
            </div>

            <div className="gradient-border card-lift">
              <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 md:p-6 h-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Safety Reports</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Fire safety, elevator, and boiler inspections
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-primary)] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              Real-Time Data
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Live NYC Building Database
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
              Updated daily from official government sources
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2 counter" data-target="1200000" data-suffix="+">
                0+
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)]">Properties</div>
            </div>

            <div className="text-center p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2 counter" data-target="800000" data-suffix="+">
                0+
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)]">Violations</div>
            </div>

            <div className="text-center p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2 counter" data-target="500000" data-suffix="+">
                0+
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)]">311 Complaints</div>
            </div>

            <div className="text-center p-4 sm:p-5 md:p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-1 sm:mb-2 counter" data-target="250000" data-suffix="+">
                0+
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)]">DOB Permits</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-secondary)] px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Get Building Insights in 3 Simple Steps
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base sm:text-lg md:text-xl">
                1
              </div>
              <div className="flex-1 pt-1 sm:pt-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Enter an Address</h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Type any NYC address into our search bar. We'll instantly pull up the building.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base sm:text-lg md:text-xl">
                2
              </div>
              <div className="flex-1 pt-1 sm:pt-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Review the Data</h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Browse violations, complaints, permits, ownership records, and safety reports all in one place.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base sm:text-lg md:text-xl">
                3
              </div>
              <div className="flex-1 pt-1 sm:pt-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Make an Informed Decision</h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Use the insights to decide if this building is right for you before signing a lease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-primary)] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              See It In Action
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              What a Building Report Looks Like
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
              Here's what you'll see when you search for a building
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-xl">
            <div className="border-b border-[var(--border-primary)] p-4 sm:p-5 md:p-6 bg-[var(--bg-hover)]">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">123 Main Street</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">Manhattan, NY 10001</p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                    <div className="text-xl sm:text-2xl font-bold">12</div>
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)]">Active Violations</div>
                </div>

                <div className="p-3 sm:p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                    <div className="text-xl sm:text-2xl font-bold">8</div>
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)]">Heat Complaints</div>
                </div>

                <div className="p-3 sm:p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                    <div className="text-xl sm:text-2xl font-bold">3</div>
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)]">Pest Reports</div>
                </div>

                <div className="p-3 sm:p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                    <div className="text-xl sm:text-2xl font-bold">5</div>
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)]">Building Permits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-primary)] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                The Only NYC Building Research Tool You'll Ever Need
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] mb-6 sm:mb-8 leading-relaxed">
                Finding an apartment in New York City is already stressful enough. We've done the hard work of
                aggregating data from <strong className="text-[var(--text-primary)]">55+ official NYC data sources</strong> so
                you can make informed decisions in minutes, not hours.
              </p>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg mb-1">Real-Time NYC Open Data Integration</h4>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      We pull directly from HPD, DOB, ACRIS, 311, DOHMH, and dozens more official sources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg mb-1">Instant Address Lookup for Any NYC Building</h4>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      Search over 1 million properties across all five boroughs instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg mb-1">Tenant-Focused Insights & Red Flag Alerts</h4>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      We highlight repeated heat complaints, pest infestations, and buildings on watchlists.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-2">55+</div>
                  <div className="text-sm sm:text-base text-[var(--text-secondary)]">Official NYC Data Sources</div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-[var(--bg-hover)] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">1M+</div>
                    <div className="text-xs text-[var(--text-muted)]">Properties Indexed</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">10K+</div>
                    <div className="text-xs text-[var(--text-muted)]">Monthly Searches</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">5</div>
                    <div className="text-xs text-[var(--text-muted)]">NYC Boroughs</div>
                  </div>
                  <div className="bg-[var(--bg-hover)] rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">24/7</div>
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

      {/* SERVICES - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-secondary)] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Help at Every Step of Your Move</h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto px-2">
              From finding your apartment to settling in, we connect NYC renters with trusted local professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(services).map(([slug, service]) => (
              <Link key={slug} href={`/services/${slug}`} className="group gradient-border card-lift overflow-hidden">
                <div className="bg-[var(--bg-card)] rounded-2xl h-full overflow-hidden">
                  <div className="relative w-full h-36 sm:h-40 bg-[var(--bg-hover)]">
                    <Image
                      src={`/services/${slug}.png`}
                      alt={`${service.name} in NYC`}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-base sm:text-lg font-bold mb-2">{service.name}</h3>
                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">Get matched with experienced pros and fast availability.</p>
                    <div className="flex items-center gap-1 text-blue-400 text-xs sm:text-sm font-medium">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--bg-hover)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] font-semibold rounded-xl transition text-sm sm:text-base"
            >
              View All Services
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST - FULLY RESPONSIVE */}
      <section className="py-12 sm:py-16 bg-[var(--bg-primary)] border-y border-[var(--border-primary)] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] uppercase tracking-widest font-medium">
              Powered by Official NYC Government Data
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6">
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              NYC Open Data
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              HPD
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              DOB
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              311
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              ACRIS
            </div>
            <div className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-semibold text-base sm:text-lg transition cursor-default">
              DOHMH
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
