'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Building2, ChevronDown, ChevronRight,
  Search, Home, Truck, Settings, X, Menu, Newspaper, BookOpen, MapPin
} from 'lucide-react'

interface HeaderProps {
  showSearch?: boolean
  searchPlaceholder?: string
}

export default function Header({ showSearch = false, searchPlaceholder = 'Search any NYC address...' }: HeaderProps) {
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileServicesOpen(false)
    setMobileLocationsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch(`/api/lookup?address=${encodeURIComponent(q)}`)
      const json = await res.json()
      if (json?.bbl) {
        setMobileMenuOpen(false)
        router.push(`/building/${json.bbl}`)
      } else {
        setSearchError(json?.error || 'Address not found')
      }
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const serviceItems = [
    { href: '/services/moving-companies', icon: Truck, color: 'emerald', title: 'Moving Companies', desc: 'Licensed NYC movers' },
    { href: '/services/pest-control', icon: Search, color: 'orange', title: 'Pest Control', desc: 'Bed bugs, roaches, rodents' },
    { href: '/services/cleaning-services', icon: Home, color: 'purple', title: 'Cleaning Services', desc: 'Move-in/out cleaning' },
  ]

  const locationItems = [
    { slug: 'manhattan', name: 'Manhattan', borough: 'Manhattan' },
    { slug: 'brooklyn', name: 'Brooklyn', borough: 'Brooklyn' },
    { slug: 'queens', name: 'Queens', borough: 'Queens' },
    { slug: 'bronx', name: 'The Bronx', borough: 'Bronx' },
    { slug: 'staten-island', name: 'Staten Island', borough: 'Staten Island' },
    { slug: 'williamsburg', name: 'Williamsburg', borough: 'Brooklyn' },
    { slug: 'astoria', name: 'Astoria', borough: 'Queens' },
    { slug: 'upper-east-side', name: 'Upper East Side', borough: 'Manhattan' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-black/20 border border-[var(--border-primary)] shadow-lg shadow-black/20 group-hover:border-blue-500/30 transition">
                <Image
                  src="/logo.png"
                  alt="Building Health X"
                  fill
                  sizes="(max-width: 640px) 36px, 44px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight">Building Health X</span>
                <span className="hidden xl:inline text-sm text-[var(--text-muted)] ml-2 font-medium">NYC Building Reality Check</span>
              </div>
            </Link>

            {/* Search bar (optional, for building pages) - Desktop */}
            {showSearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-md lg:max-w-xl hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 transition"
                    disabled={searching}
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--text-muted)] border-t-[var(--text-primary)] rounded-full animate-spin" />
                  )}
                </div>
                {searchError && <div className="text-xs text-red-400 mt-1 absolute">{searchError}</div>}
              </form>
            )}

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition">
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="dropdown relative">
                <button className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition flex items-center gap-1">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="dropdown-menu absolute top-full left-0 pt-2 w-64">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-2">
                  {serviceItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition">
                      <div className={`w-8 h-8 bg-${item.color}-500/10 rounded-lg flex items-center justify-center`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border-primary)] mt-2 pt-2">
                    <Link href="/services" className="flex items-center justify-between px-3 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                      View all services
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  </div>
                </div>
              </div>

              {/* Locations Dropdown */}
              <div className="dropdown relative">
                <button className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition flex items-center gap-1">
                  Locations
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="dropdown-menu absolute top-full left-0 pt-2 w-56">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl p-2">
                  {locationItems.map((location) => (
                    <Link 
                      key={location.slug} 
                      href={`/locations/${location.slug}`} 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition"
                    >
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      <div>
                        <div className="text-sm font-medium">{location.name}</div>
                        {location.borough !== location.name && (
                          <div className="text-xs text-[var(--text-muted)]">{location.borough}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border-primary)] mt-2 pt-2">
                    <Link href="/locations" className="flex items-center justify-between px-3 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                      View all locations
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  </div>
                </div>
              </div>

              <Link href="/blog" className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition">
                Blog
              </Link>
              <Link href="/news" className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition">
                News
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-primary)] flex items-center justify-center transition hover:bg-[var(--border-primary)]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[var(--bg-primary)] border-l border-[var(--border-primary)] z-50 md:hidden transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
            <span className="text-lg font-bold">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-primary)] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-[var(--border-primary)]">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search any NYC address..."
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 transition"
                  disabled={searching}
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--text-muted)] border-t-[var(--text-primary)] rounded-full animate-spin" />
                )}
              </div>
              {searchError && <div className="text-xs text-red-400 mt-2">{searchError}</div>}
            </form>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-medium">Home</span>
              </Link>

              {/* Services Accordion */}
              <div>
                <button 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-medium">Services</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-6 pr-2 py-2 space-y-1">
                    {serviceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`w-8 h-8 bg-${item.color}-500/10 rounded-lg flex items-center justify-center`}>
                          <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View all services
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Locations Accordion */}
              <div>
                <button 
                  onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-medium">Locations</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 ${mobileLocationsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${mobileLocationsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-6 pr-2 py-2 space-y-1">
                    {locationItems.map((location) => (
                      <Link
                        key={location.slug}
                        href={`/locations/${location.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                        <div>
                          <div className="text-sm font-medium">{location.name}</div>
                          {location.borough !== location.name && (
                            <div className="text-xs text-[var(--text-muted)]">{location.borough}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/locations"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View all locations
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/blog" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <span className="font-medium">Blog</span>
              </Link>

              <Link 
                href="/news" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-hover)] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-orange-400" />
                </div>
                <span className="font-medium">News</span>
              </Link>
            </div>
          </nav>

        </div>
      </div>
    </>
  )
}
