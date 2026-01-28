import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ChevronRight,
  MapPin,
  CheckCircle2,
  Clock,
  DollarSign,
  HelpCircle,
  ClipboardCheck,
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadModal from '@/components/LeadModal'
import OpenModalButton from '@/components/OpenModalButton'
import { services } from '@/lib/services-data'
import { locations } from '@/lib/locations-data'

type Props = {
  params: { service: string }
}

const stripServicesSuffix = (name: string) => name.replace(/\s+Services$/i, '').trim()

const needs24x7 = (serviceSlug: string) => {
  const set = new Set(['locksmith', 'plumbers', 'electricians', 'hvac-repair', 'pest-control', 'mold-remediation'])
  return set.has(serviceSlug)
}

const providerNounFor = (serviceSlug: string, serviceDisplayName: string) => {
  const map: Record<string, string> = {
    'moving-companies': 'moving pros',
    'packing-services': 'packing pros',
    'storage-facilities': 'storage options',
    'junk-removal': 'junk removal pros',
    'cleaning-services': 'cleaning pros',
    locksmith: 'locksmiths',
    plumbers: 'plumbers',
    electricians: 'electricians',
    'hvac-repair': 'HVAC pros',
    'pest-control': 'pest control pros',
    'mold-remediation': 'remediation pros',
    'furniture-assembly': 'assembly pros',
    painters: 'painters',
    'real-estate-agents': 'agents',
    'building-inspectors': 'inspectors',
    'renters-insurance': 'insurance options',
    'internet-providers': 'internet options',
  }

  if (map[serviceSlug]) return map[serviceSlug]

  const noun = stripServicesSuffix(serviceDisplayName).toLowerCase()
  return `${noun} pros`
}

export async function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services[params.service]
  if (!service) return {}

  const noun = stripServicesSuffix(service.name)

  return {
    title: `${service.name} in NYC | Compare Options and Find Local Help`,
    description: `Explore ${noun.toLowerCase()} options across NYC neighborhoods. Request help, compare availability, and book with clear next steps.`,
  }
}

export default function ServicePage({ params }: Props) {
  const service = services[params.service]
  if (!service) return notFound()

  const noun = stripServicesSuffix(service.name)
  const providerNoun = providerNounFor(params.service, service.name)

  const pitch = needs24x7(params.service)
    ? `We connect you with 24/7 ${providerNoun} across NYC, backed by experienced pros and fast availability.`
    : `We connect you with ${providerNoun} across NYC, backed by experienced pros and fast availability.`

  const allLocations = Object.entries(locations)

  // Sidebar quick-jump list
  const sidebarLocations = allLocations.slice(0, 5)

  const getStartedHref =
    allLocations[0]?.[0]
      ? `/services/${params.service}/${allLocations[0][0]}`
      : `/services/${params.service}/${Object.keys(locations)[0]}`

  // Group locations by borough
  const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island']
  const locationsByBorough = boroughs.map(borough => ({
    borough,
    locations: allLocations.filter(([_, loc]) => loc.borough === borough).slice(0, 6)
  })).filter(group => group.locations.length > 0)

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
            <Link href="/services" className="hover:text-white transition">
              Services
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{service.name}</span>
          </nav>

          {/* HERO - Full-width with centered content */}
          <section className="mb-16">
            {/* Background image with overlay */}
            <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-3xl overflow-hidden mb-12">
              <Image
                src={`/services/${params.service}.png`}
                alt={`${service.name} in NYC`}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/40 via-[#0a0e17]/70 to-[#0a0e17]" />
            </div>

            {/* Headline + CTA (NOT inside the image) */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {service.name} in NYC
                </h1>
                <OpenModalButton variant="primary" className="lg:w-auto w-full">
                  Get {service.name} quotes
                </OpenModalButton>
              </div>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
                {pitch}
              </p>
            </div>

            {/* Stats grid - cleaner layout */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              <div className="bg-[#12161f] border border-emerald-500/20 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="font-semibold text-lg mb-1">Matched to availability</div>
                <div className="text-sm text-slate-400">Local options that serve you</div>
              </div>
              
              <div className="bg-[#12161f] border border-blue-500/20 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-blue-400" />
                </div>
                <div className="font-semibold text-lg mb-1">{service.timeline}</div>
                <div className="text-sm text-slate-400">Typical timing</div>
              </div>
              
              <div className="bg-[#12161f] border border-purple-500/20 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-7 h-7 text-purple-400" />
                </div>
                <div className="font-semibold text-lg mb-1">{service.costRange}</div>
                <div className="text-sm text-slate-400">Typical cost range</div>
              </div>
            </div>

            {/* Quick navigation - prominent */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              <a href="#neighborhoods" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition">
                Choose a neighborhood
              </a>
              <a href="#requests" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition">
                Common requests
              </a>
              <a href="#questions" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition">
                Questions to ask
              </a>
            </div>
          </section>

          {/* PAGE CONTENT */}
          <div className="space-y-12">
            {/* Quick Facts (no sidebar on this page) */}
            <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Quick facts about {noun.toLowerCase()}</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-slate-400">Typical timeline</div>
                      <div className="font-semibold">{service.timeline}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-slate-400">Cost range</div>
                      <div className="font-semibold">{service.costRange}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
              {/* LOCATION GRID - Grouped by borough */}
              <section id="neighborhoods" className="bg-[#12161f] border border-white/10 rounded-2xl p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Choose a neighborhood</h2>
                      <p className="text-slate-400 mt-1">
                        Pick your area to view {noun.toLowerCase()} options and request help.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Borough-grouped locations */}
                <div className="space-y-8">
                  {locationsByBorough.map(({ borough, locations: boroughLocs }) => (
                    <div key={borough}>
                      <h3 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        {borough}
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {boroughLocs.map(([locationSlug, loc]) => (
                          <Link
                            key={locationSlug}
                            href={`/services/${params.service}/${locationSlug}`}
                            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition"
                          >
                            <div>
                              <div className="font-semibold">{loc.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {service.timeline.split(';')[0]}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View all link */}
                {allLocations.length > 30 && (
                  <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition">
                      View all {allLocations.length} neighborhoods →
                    </button>
                  </div>
                )}
              </section>

              {/* QUICK SERVICE INFO */}
              <section id="requests" className="grid lg:grid-cols-2 gap-8">
                <div className="bg-[#12161f] border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6">What people typically request</h2>
                  <ul className="space-y-4">
                    {service.whyNeed.slice(0, 8).map((reason, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-emerald-500/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-slate-300 leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="questions" className="bg-[#12161f] border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Questions to ask</h2>
                  </div>

                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Want higher quality quotes and fewer surprises? Ask the right questions before you book, especially for NYC building access rules and pricing structure.
                  </p>

                  <Link
                    href={`/services/${params.service}/questions-to-ask`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition"
                  >
                    View questions to ask
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              {/* Footer CTA */}
              <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-3">Ready to request {noun.toLowerCase()} help?</h2>
                <p className="text-slate-300 mb-6 max-w-3xl">
                  Choose your neighborhood above to request service and see detailed expectations, costs and FAQs tailored to that area.
                </p>
                <div className="flex flex-wrap gap-3">
                  <OpenModalButton variant="primary">
                    Get matched now
                  </OpenModalButton>
                  <Link
                    href={getStartedHref}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition"
                  >
                    Browse neighborhoods
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>
          </div>
        </div>
      </main>

      <LeadModal serviceType={service.name} serviceSlug={params.service} location="NYC" locationSlug="nyc" />
      <Footer />
    </div>
  )
}
