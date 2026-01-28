// BHXX-with-Images-main/app/locations/page.tsx

import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadModal from '@/components/LeadModal'
import OpenModalButton from '@/components/OpenModalButton'
import { locations } from '@/lib/locations-data'

export const metadata: Metadata = {
  title: 'NYC Neighborhoods | Find Services by Location | Building Health X',
  description:
    'Browse services by NYC neighborhood. Find trusted movers, lawyers, pest control, and more in Manhattan, Brooklyn, Queens, Bronx, and Staten Island.',
}

// Group locations by borough
const locationsByBorough = Object.entries(locations).reduce((acc, [slug, loc]) => {
  if (!acc[loc.borough]) acc[loc.borough] = []
  acc[loc.borough].push({ slug, ...loc })
  return acc
}, {} as Record<string, Array<{ slug: string; name: string; borough: string; description: string }>>)

const boroughOrder = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Locations</span>
          </nav>

          {/* Hero (NO CTA here, NO sidebar CTA) */}
          <div className="mb-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-500/10 text-blue-300">
                    NYC Neighborhoods
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-cyan-500/10 text-cyan-300">
                    Browse by borough
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                  Compare renter services across{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    NYC neighborhoods
                  </span>
                </h1>

                <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                  Choose a service and a neighborhood. We follow up with providers who serve that area.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                    <div className="text-sm font-semibold text-white mb-1">Popular services</div>
                    <p className="text-sm text-slate-400">
                      Moving companies, packing services, cleaning services, locksmiths, furniture assembly, and more.
                    </p>
                  </div>
                  <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                    <div className="text-sm font-semibold text-white mb-1">How it works</div>
                    <p className="text-sm text-slate-400">
                      Submit your request. Compare options. Choose the provider that fits your timeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Locations by Borough */}
          <div className="space-y-12">
            {boroughOrder.map((borough) => {
              const boroughLocations = locationsByBorough[borough]
              if (!boroughLocations || boroughLocations.length === 0) return null

              return (
                <section key={borough}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                    {borough}
                    <span className="text-sm font-normal text-slate-500">({boroughLocations.length} areas)</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boroughLocations.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/locations/${loc.slug}`}
                        className="group bg-[#12161f] border border-white/5 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-400 transition">
                              {loc.name}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2">{loc.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          {/* LAST SECTION CTA (longer wording, last thing on the page) */}
          <section className="mt-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Get matched with providers in your neighborhood</h2>
                  <p className="text-slate-300 leading-relaxed max-w-2xl">
                    Tell us what you need, your timeline, and which NYC neighborhood you’re in. We’ll follow up with
                    providers who serve that area so you can compare next steps and move forward quickly.
                  </p>
                </div>
              </div>

              <OpenModalButton variant="primary" className="md:w-auto w-full">
                Get matched now
              </OpenModalButton>
            </div>
          </section>
        </div>
      </main>

      <LeadModal serviceType="Renter Services" serviceSlug="renter-services" location="NYC" locationSlug="nyc" />
      <Footer />
    </div>
  )
}
