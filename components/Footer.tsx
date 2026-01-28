import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  // Popular locations for internal linking
  const popularLocations = [
    { slug: 'manhattan', name: 'Manhattan' },
    { slug: 'brooklyn', name: 'Brooklyn' },
    { slug: 'queens', name: 'Queens' },
    { slug: 'bronx', name: 'The Bronx' },
    { slug: 'williamsburg', name: 'Williamsburg' },
    { slug: 'astoria', name: 'Astoria' },
    { slug: 'upper-east-side', name: 'Upper East Side' },
    { slug: 'park-slope', name: 'Park Slope' },
  ]

  // Popular services for internal linking
  const popularServices = [
    { slug: 'moving-companies', name: 'Moving Companies' },
    { slug: 'pest-control', name: 'Pest Control' },
    { slug: 'cleaning-services', name: 'Cleaning Services' },
    { slug: 'renters-insurance', name: 'Renters Insurance' },
    { slug: 'plumbers', name: 'Plumbers' },
  ]

  return (
    <footer className="py-12 sm:py-16 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-256.png"
                  alt="Building Health X"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <span className="font-bold text-lg">Building Health X</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              NYC's most comprehensive building research tool. Make informed decisions before signing your lease.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {popularServices.map(service => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="hover:text-[var(--text-primary)] transition">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-blue-400 hover:text-blue-300 transition">
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-semibold mb-4">Locations</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {popularLocations.map(location => (
                <li key={location.slug}>
                  <Link href={`/locations/${location.slug}`} className="hover:text-[var(--text-primary)] transition">
                    {location.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/locations" className="text-blue-400 hover:text-blue-300 transition">
                  View all locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><Link href="/blog" className="hover:text-[var(--text-primary)] transition">Blog</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--text-primary)] transition">NYC Renter's Guide</Link></li>
              <li><Link href="/news" className="hover:text-[var(--text-primary)] transition">News</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Data Sources</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-primary)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-muted)]">© 2025 Building Health X. All rights reserved.</p>
          <p className="text-sm text-[var(--text-muted)]">Data sourced from NYC Open Data</p>
        </div>
      </div>
    </footer>
  )
}
