// app/services/[service]/[location]/page.tsx

import type { ReactNode } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  Lightbulb,
  HelpCircle,
  Truck,
  Package,
  Archive,
  Trash2,
  Sparkles,
  Home,
  ClipboardCheck,
  Shield,
  Wifi,
  Key,
  Wrench,
  PaintBucket,
  Bug,
  Thermometer,
  Droplets,
  Zap,
  AlertOctagon,
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadModal from '@/components/LeadModal'
import OpenModalButton from '@/components/OpenModalButton'
import { services } from '@/lib/services-data'
import { locations } from '@/lib/locations-data'

// Helper to get icon component
const getServiceIcon = (service: string) => {
  const icons: Record<string, ReactNode> = {
    'moving-companies': <Truck className="w-6 h-6" />,
    'packing-services': <Package className="w-6 h-6" />,
    'storage-facilities': <Archive className="w-6 h-6" />,
    'junk-removal': <Trash2 className="w-6 h-6" />,
    'cleaning-services': <Sparkles className="w-6 h-6" />,
    'real-estate-agents': <Home className="w-6 h-6" />,
    'building-inspectors': <ClipboardCheck className="w-6 h-6" />,
    'renters-insurance': <Shield className="w-6 h-6" />,
    'internet-providers': <Wifi className="w-6 h-6" />,
    locksmith: <Key className="w-6 h-6" />,
    'furniture-assembly': <Wrench className="w-6 h-6" />,
    painters: <PaintBucket className="w-6 h-6" />,
    'pest-control': <Bug className="w-6 h-6" />,
    'hvac-repair': <Thermometer className="w-6 h-6" />,
    plumbers: <Droplets className="w-6 h-6" />,
    electricians: <Zap className="w-6 h-6" />,
    'mold-remediation': <AlertOctagon className="w-6 h-6" />,
  }
  return icons[service] || <Wrench className="w-6 h-6" />
}

type Props = { params: { service: string; location: string } }

const stripServicesSuffix = (name: string) => name.replace(/\s+Services$/i, '').trim()

// Deterministic hash so each (service/location) gets a stable headline variant (SEO-safe)
const hashString = (input: string) => {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i)
  return Math.abs(h)
}

const headlineVariantsFor = (serviceSlug: string, serviceName: string) => {
  const noun = stripServicesSuffix(serviceName)

  // Fallback templates (work for any service)
  const base = [
    `${noun} in {location}, NYC`,
    `Local ${noun} in {location}, NYC With Fast Availability`,
    `Compare ${noun} Options in {location}, NYC`,
    `Get Quotes for ${noun} in {location}, NYC`,
    `${noun} in {location}, NYC With Clear Next Steps`,
  ]

  const variants: Record<string, string[]> = {
    'moving-companies': [
      `Moving Companies in {location}, NYC With COI Ready Options`,
      `Local Movers in {location}, NYC With Fast Availability`,
      `Compare Moving Quotes in {location}, NYC`,
      `Moving Help in {location}, NYC for Walk-Ups and Elevators`,
      `Trusted Moving Companies Serving {location}, NYC`,
    ],
    'packing-services': [
      `Full-Service Packing in {location}, NYC for Apartment Moves`,
      `Packing Help in {location}, NYC Matched Fast`,
      `Professional Packing Services in {location}, NYC With Fast Availability`,
      `Packing Services in {location}, NYC for Moves, Storage, and Deliveries`,
      `Apartment Packing in {location}, NYC Without the Stress`,
    ],
    'storage-facilities': [
      `Storage Facilities in {location}, NYC With Flexible Options`,
      `Storage in {location}, NYC for Short and Long Term Needs`,
      `Compare Storage Options in {location}, NYC`,
      `Climate-Controlled Storage Near {location}, NYC`,
      `Storage Solutions Serving {location}, NYC`,
    ],
    'junk-removal': [
      `Junk Removal in {location}, NYC With Fast Pickups`,
      `Furniture and Cleanout Removal in {location}, NYC`,
      `Compare Junk Removal Options in {location}, NYC`,
      `Same Day Junk Removal in {location}, NYC When Available`,
      `Junk Hauling in {location}, NYC With Clear Pricing`,
    ],
    'cleaning-services': [
      `Move-In and Move-Out Cleaning in {location}, NYC`,
      `Deep Cleaning Services in {location}, NYC With Fast Availability`,
      `Apartment Cleaning in {location}, NYC Book Fast`,
      `Cleaning Help in {location}, NYC for Homes and Apartments`,
      `Cleaning Services in {location}, NYC With Clear Next Steps`,
    ],
    locksmith: [
      `24/7 Locksmith in {location}, NYC for Lockouts and Lock Changes`,
      `Emergency Locksmith in {location}, NYC With Fast Availability`,
      `Locksmith Services in {location}, NYC for Apartments and Buildings`,
      `Get Locksmith Help in {location}, NYC in Minutes`,
      `Lock Replacement and Rekeying in {location}, NYC`,
    ],
    plumbers: [
      `Plumber in {location}, NYC for Leaks, Clogs, and Repairs`,
      `Emergency Plumber in {location}, NYC When Available`,
      `Plumbing Services in {location}, NYC With Fast Availability`,
      `Get Plumbing Help in {location}, NYC in Minutes`,
      `Local Plumbing Pros Serving {location}, NYC`,
    ],
    electricians: [
      `Electrician in {location}, NYC for Repairs and Installs`,
      `Emergency Electrician in {location}, NYC When Available`,
      `Electrical Help in {location}, NYC With Fast Availability`,
      `Outlet and Breaker Repairs in {location}, NYC`,
      `Local Electricians Serving {location}, NYC`,
    ],
    'hvac-repair': [
      `HVAC Repair in {location}, NYC for Heat and AC Issues`,
      `Heating and AC Repair in {location}, NYC With Fast Availability`,
      `HVAC Service in {location}, NYC When You Need It`,
      `No Heat or No AC in {location}, NYC Get Help Fast`,
      `Local HVAC Pros Serving {location}, NYC`,
    ],
    'pest-control': [
      `Pest Control in {location}, NYC for Roaches, Mice, and More`,
      `Exterminator Options in {location}, NYC With Fast Availability`,
      `Pest Treatment in {location}, NYC for Apartments and Buildings`,
      `Get Pest Control Help in {location}, NYC in Minutes`,
      `Local Pest Control Pros Serving {location}, NYC`,
    ],
    'mold-remediation': [
      `Mold Remediation in {location}, NYC for Inspection and Cleanup`,
      `Mold Removal Options in {location}, NYC With Clear Next Steps`,
      `Mold Inspection and Remediation in {location}, NYC`,
      `Get Mold Help in {location}, NYC Fast`,
      `Local Remediation Pros Serving {location}, NYC`,
    ],
    'furniture-assembly': [
      `Furniture Assembly in {location}, NYC for Beds, Dressers, and More`,
      `IKEA and Furniture Assembly in {location}, NYC`,
      `Assembly Help in {location}, NYC With Fast Availability`,
      `Book Furniture Assembly in {location}, NYC`,
      `Assembly Pros Serving {location}, NYC`,
    ],
    painters: [
      `Painters in {location}, NYC for Apartments and Touch Ups`,
      `Interior Painting in {location}, NYC With Fast Availability`,
      `Move In and Move Out Painting in {location}, NYC`,
      `Get Painting Quotes in {location}, NYC`,
      `Local Painting Pros Serving {location}, NYC`,
    ],
    'real-estate-agents': [
      `Real Estate Agents in {location}, NYC for Renters`,
      `Apartment Search Help in {location}, NYC With Local Agents`,
      `Connect With Agents Serving {location}, NYC`,
      `Rental Agents in {location}, NYC With Fast Responses`,
      `Tenant Focused Agents in {location}, NYC`,
    ],
    'building-inspectors': [
      `Building Inspectors in {location}, NYC Before You Sign`,
      `Apartment Inspection in {location}, NYC With Fast Turnaround`,
      `Pre Lease Inspection Help in {location}, NYC`,
      `Inspectors Serving {location}, NYC for Rental Checks`,
      `Get a Building Inspection in {location}, NYC`,
    ],
    'renters-insurance': [
      `Renters Insurance in {location}, NYC Compare Quotes Fast`,
      `Get Renters Insurance Options for {location}, NYC`,
      `Affordable Renters Insurance in {location}, NYC`,
      `Compare Coverage for {location}, NYC Renters`,
      `Renters Insurance Quotes for {location}, NYC`,
    ],
    'internet-providers': [
      `Internet Providers in {location}, NYC Compare Options`,
      `WiFi and Internet Options for {location}, NYC`,
      `High Speed Internet in {location}, NYC`,
      `Compare Internet Plans in {location}, NYC`,
      `Internet Options Serving {location}, NYC`,
    ],
  }

  return variants[serviceSlug] || base
}

const pickHeadline = (serviceSlug: string, serviceName: string, locationSlug: string, locationName: string) => {
  const variants = headlineVariantsFor(serviceSlug, serviceName)
  const idx = hashString(`${serviceSlug}/${locationSlug}`) % variants.length
  return variants[idx].replaceAll('{location}', locationName)
}

const renderHeadlineWithGradientLocation = (headline: string, locationName: string) => {
  const parts = headline.split(locationName)
  if (parts.length === 1) return headline
  return (
    <>
      {parts[0]}
      <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
        {locationName}
      </span>
      {parts.slice(1).join(locationName)}
    </>
  )
}

const needs24x7 = (serviceSlug: string) => {
  const set = new Set(['locksmith', 'plumbers', 'electricians', 'hvac-repair', 'pest-control', 'mold-remediation'])
  return set.has(serviceSlug)
}

const commonRequests = (serviceSlug: string, serviceName: string) => {
  const noun = stripServicesSuffix(serviceName)
  const map: Record<string, string[]> = {
    locksmith: ['emergency lockouts', 'lock changes', 'stuck locks and broken keys', 'rekeying and replacements', 'smart lock installs'],
    plumbers: ['leaks and burst pipes', 'clogged drains and toilets', 'water heater issues', 'fixture installs', 'emergency repairs'],
    electricians: ['power and breaker issues', 'outlet and switch repairs', 'light fixtures and installs', 'wiring problems', 'urgent troubleshooting'],
    'hvac-repair': ['no heat or no AC', 'system repairs', 'thermostat issues', 'maintenance and tune-ups', 'urgent diagnostics'],
    'pest-control': ['roaches and mice', 'bed bug concerns', 'ant and pest treatments', 'inspection and prevention', 'follow-up service'],
    'mold-remediation': ['mold inspection', 'cleanup and remediation', 'moisture and leak-related mold', 'air quality concerns', 'post-remediation steps'],
    'cleaning-services': ['move-in and move-out cleaning', 'deep cleaning', 'kitchen and bathroom resets', 'recurring cleaning', 'turnover cleanings'],
    'moving-companies': ['local moves', 'COI requirements', 'walk-up and elevator moves', 'packing and unloading', 'last-minute availability'],
    'packing-services': ['full packing', 'fragile packing', 'unpacking', 'boxes and supplies', 'move-day packing'],
    'storage-facilities': ['short-term storage', 'long-term storage', 'climate-controlled units', 'pickup and dropoff options', 'unit sizing help'],
    'junk-removal': ['furniture removal', 'apartment cleanouts', 'haul-away pickups', 'donation and disposal options', 'same-day pickups when available'],
    'furniture-assembly': ['beds and dressers', 'IKEA assembly', 'mounting and setup', 'office furniture assembly', 'disassembly and reassembly'],
    painters: ['apartment painting', 'touch-ups', 'move-in and move-out painting', 'patching and prep', 'quick turnarounds'],
    'real-estate-agents': ['rental search support', 'showings and applications', 'local market guidance', 'lease coordination', 'agent matching'],
    'building-inspectors': ['pre-lease inspections', 'move-in condition checks', 'issue identification', 'reporting and photos', 'follow-up questions'],
    'renters-insurance': ['quote comparisons', 'coverage guidance', 'policy setup', 'add-ons and riders', 'fast proof of insurance'],
    'internet-providers': ['internet plan comparison', 'availability checks', 'installation scheduling', 'speed and price options', 'setup help'],
  }

  const list =
    map[serviceSlug] || [`${noun.toLowerCase()} help`, 'quotes and availability', 'scheduling options', 'common service requests', 'next steps to book']
  return list
}

const leadGenFaqs = (serviceSlug: string, serviceName: string, locationName: string) => {
  const noun = stripServicesSuffix(serviceName)
  const nounLower = noun.toLowerCase()

  const base = [
    {
      q: `How does matching work for ${nounLower} in ${locationName}?`,
      a: `Start by submitting a short request with your location, what you need, and how urgent it is. The request is routed to available local ${nounLower} professionals who serve ${locationName}, so you can get next steps without calling multiple places. You can then review the details and book service based on availability and fit.`,
    },
    {
      q: `How fast can I get help in ${locationName}?`,
      a: `Response time depends on demand, time of day, and which providers are currently available nearby. Including the exact problem, building type, and any access details helps route the request to the right option faster. For urgent requests, it is best to submit as soon as possible and stay reachable for follow-up questions.`,
    },
    {
      q: `What affects pricing for ${nounLower} in ${locationName}?`,
      a: `Pricing is usually driven by the type of job, urgency, complexity, and how much time or equipment is required. Building access also matters in NYC, since stairs, elevators, parking, and loading rules can change labor time and costs. The most accurate pricing comes from clear details up front, especially for emergencies or specialty work.`,
    },
    {
      q: `What details should I include for the best match?`,
      a: `Include the neighborhood, the type of service you need, and whether it is urgent or scheduled. Add any specifics you know, such as lock type, number of rooms, the size of the job, photos, or what has already been tried. Better details reduce back-and-forth and improve the chance you are matched to the right provider on the first pass.`,
    },
    {
      q: `Is this only for emergencies?`,
      a: `No, you can request urgent help or schedule a non-urgent appointment depending on the service category. Many people use this for planned work such as move-in services, upgrades, or routine maintenance. If you have a preferred time window, include it so scheduling can be aligned early.`,
    },
    {
      q: `Are the professionals licensed, insured, or verified?`,
      a: `Providers matched through requests operate in NYC and handle the relevant service category, but licensing and insurance can vary depending on the trade. If the job requires specific licensing or proof of insurance, request it before booking and confirm it applies to your building's requirements. This is especially important for work involving building access, certificates of insurance, or regulated repairs.`,
    },
    {
      q: `Can I compare options or quotes before booking?`,
      a: `In many cases, yes, especially for scheduled work where the scope can be described clearly in advance. For urgent situations, the priority is often the fastest available option, but you should still ask about pricing structure and what is included. The more complete your request details are, the easier it is to compare apples to apples.`,
    },
    {
      q: `What should I do right now while I wait for a response?`,
      a: `If it is an emergency involving safety, gas, electrical hazards, or a medical risk, contact emergency services first. If the issue is urgent but not life-threatening, gather details that help diagnose the problem, like photos, the exact symptoms, and what triggered it. Staying reachable and ready to confirm access details can significantly speed up next steps.`,
    },
    {
      q: `Do you serve only ${locationName}, or nearby areas too?`,
      a: `${locationName} is the focus for this page, but many providers also serve nearby neighborhoods depending on availability. If you are on the border of another area, include cross streets or nearby landmarks to prevent confusion. Accurate location details help avoid wasted time and mismatches.`,
    },
  ]

  return base
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services[params.service]
  const location = locations[params.location]
  if (!service || !location) return {}

  const h1 = pickHeadline(params.service, service.name, params.location, location.name)

  return {
    title: `${h1} | Building Health X`,
    description: `Get connected with ${stripServicesSuffix(service.name).toLowerCase()} professionals serving ${location.name}. Compare options, review typical costs and timelines, and book with clear next steps.`,
  }
}

export async function generateStaticParams() {
  const params: { service: string; location: string }[] = []
  for (const serviceSlug of Object.keys(services)) {
    for (const locationSlug of Object.keys(locations)) {
      params.push({ service: serviceSlug, location: locationSlug })
    }
  }
  return params
}

export default function ServiceLocationPage({ params }: Props) {
  const service = services[params.service]
  const location = locations[params.location]
  if (!service || !location) return notFound()

  const noun = stripServicesSuffix(service.name)
  const headline = pickHeadline(params.service, service.name, params.location, location.name)

  const relatedLocations = Object.entries(locations)
    .filter(([slug, loc]) => loc.borough === location.borough && slug !== params.location)
    .slice(0, 5)

  const allServices = Object.entries(services)
    .filter(([slug]) => slug !== params.service)
    .slice(0, 6)

  const requests = commonRequests(params.service, service.name)
  const pitch = needs24x7(params.service)
    ? `We connect you with 24/7 ${noun.toLowerCase()} professionals serving ${location.name}, backed by experienced pros and fast availability.`
    : `We connect you with ${noun.toLowerCase()} professionals serving ${location.name}, backed by experienced pros and fast availability.`

  const seoIntro = `Need ${noun.toLowerCase()} help in ${location.name} right now? Submit a quick request to get matched with available local professionals who handle ${requests
    .slice(0, 4)
    .join(', ')}. Many buildings in ${location.name} include ${location.buildingTypes.toLowerCase()}, which means the right approach depends on the situation and setup. Requests are routed based on availability and urgency, helping you move fast while reducing the risk of surprise pricing. Whether it is urgent or scheduled, sharing a few details upfront helps you get connected to the right option and clear next steps to book.`

  const detailedFaqs = [...leadGenFaqs(params.service, service.name, location.name), ...service.faqs]

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
            <Link href={`/services/${params.service}`} className="hover:text-white transition">
              {service.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{location.name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* HERO */}
              <section className="space-y-8">
                {/* IMAGE FIRST */}
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src={`/services/${params.service}.png`}
                    alt={`${noun} in ${location.name}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/80 via-[#0a0e17]/40 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm rounded-lg text-emerald-300 text-sm font-medium">
                      {service.category}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-lg text-blue-300 text-sm font-medium">
                      {location.name}
                    </span>
                    <span className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm rounded-lg text-purple-300 text-sm font-medium">
                      {location.borough}
                    </span>
                  </div>
                </div>

                {/* THEN HEADLINE */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    {renderHeadlineWithGradientLocation(headline, location.name)}
                  </h1>

                  {/* THEN CTA buttons */}
                  <div className="flex flex-wrap gap-3">
                    <OpenModalButton variant="primary" className="lg:w-auto w-full sm:w-auto">
                      Get Free Quotes
                    </OpenModalButton>
                    <a
                      href="#faq"
                      className="px-6 py-3 bg-transparent border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400 font-semibold rounded-xl transition lg:w-auto w-full sm:w-auto inline-block text-center"
                    >
                      See How It Works ↓
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xl text-slate-300 leading-relaxed mb-4">{pitch}</p>

                <p className="text-base text-slate-400 leading-relaxed mb-6">{seoIntro}</p>

                {/* Quick stats badges */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Experienced Pros</div>
                      <div className="text-sm text-slate-500">Local availability</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{service.timeline.split(';')[0]}</div>
                      <div className="text-sm text-slate-500">Typical timeline</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{service.costRange.split(',')[0].split(' ')[0]}</div>
                      <div className="text-sm text-slate-500">Starting cost</div>
                    </div>
                  </div>
                </div>

              {/* What to Look For */}
              <section
                id="what-to-look-for"
                className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-2xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold">What to look for</h2>
                </div>
                <div className="space-y-6">
                  {service.whatToLookFor.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 bg-purple-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Costs & Timeline */}
              <section
                id="costs"
                className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 rounded-2xl p-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold">{noun} costs in {location.name}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="text-sm text-slate-500 mb-2 uppercase tracking-wide">Typical Cost Range</div>
                    <div className="text-lg font-semibold text-emerald-400">{service.costRange}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="text-sm text-slate-500 mb-2 uppercase tracking-wide">Timeline</div>
                    <div className="text-lg font-semibold">{service.timeline}</div>
                  </div>
                </div>

                <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">Pro tip for {location.name}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {location.borough === 'Manhattan'
                          ? `Manhattan buildings often have strict requirements. Confirm scheduling rules and any COI requirements before booking.`
                          : location.borough === 'Brooklyn'
                            ? `Many ${location.name} buildings are walk-ups or brownstones. Confirm experience with stairs and tight spaces when relevant.`
                            : `${location.name} may have longer travel times depending on provider locations. Adding your exact area and time window helps improve matching.`}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ - Collapsible accordion */}
              <section id="faq" className="bg-[#12161f] border border-white/10 rounded-2xl p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold">Frequently asked questions</h2>
                </div>

                {/* Show top 5 FAQs expanded */}
                <div className="space-y-6 mb-6">
                  {detailedFaqs.slice(0, 5).map((faq, i) => (
                    <div
                      key={`${faq.q}-${i}`}
                      className="pb-6 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <h4 className="font-semibold text-lg mb-3">{faq.q}</h4>
                      <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>

                {/* Accordion for remaining FAQs */}
                {detailedFaqs.length > 5 && (
                  <details className="group">
                    <summary className="cursor-pointer px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold flex items-center justify-between transition">
                      <span>View {detailedFaqs.length - 5} more questions</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                    </summary>

                    <div className="mt-6 space-y-6">
                      {detailedFaqs.slice(5).map((faq, i) => (
                        <div
                          key={`${faq.q}-${i}`}
                          className="pb-6 border-b border-white/5 last:border-0 last:pb-0"
                        >
                          <h4 className="font-semibold text-lg mb-3">{faq.q}</h4>
                          <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </section>

              {/* Building Health X CTA */}
              <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Moving to {location.name}?</h2>
                </div>
                <p className="text-slate-300 mb-6">
                  Before you sign a lease, check the building&apos;s history. Building Health X shows violations,
                  complaints, and issues from 55+ official NYC sources for free.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
                >
                  Search Any NYC Address
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </section>
            </div>

            {/* SIDEBAR - Sticky with limits */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Sidebar CTA */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      {getServiceIcon(params.service)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Get quotes and availability</h3>
                      <p className="text-xs text-slate-400">Fast matching • Clear next steps</p>
                    </div>
                  </div>
                  <OpenModalButton className="w-full" variant="primary">
                    Get matched now
                  </OpenModalButton>
                </div>

                {/* On this page navigation */}
                <div className="bg-[#12161f] border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">On This Page</h3>
                  <nav className="space-y-2">
                    <a
                      href="#why-need"
                      className="block px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      What you can request
                    </a>
                    <a
                      href="#what-to-look-for"
                      className="block px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      What to look for
                    </a>
                    <a
                      href="#costs"
                      className="block px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      Costs & timeline
                    </a>
                    <a
                      href="#faq"
                      className="block px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                    >
                      FAQ
                    </a>
                  </nav>
                </div>

                {/* Nearby locations */}
                {relatedLocations.length > 0 && (
                  <div className="bg-[#12161f] border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                      {service.name} Nearby
                    </h3>
                    <div className="space-y-2">
                      {relatedLocations.map(([slug, loc]) => (
                        <Link
                          key={slug}
                          href={`/services/${params.service}/${slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                        >
                          <div>
                            <div className="font-medium text-sm">{loc.name}</div>
                            <div className="text-xs text-slate-500">{loc.borough}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other services */}
                <div className="bg-[#12161f] border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                    Other Services in {location.name}
                  </h3>
                  <div className="space-y-2">
                    {allServices.map(([slug, svc]) => (
                      <Link
                        key={slug}
                        href={`/services/${slug}/${params.location}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                      >
                        <span className="text-sm">{svc.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </Link>
                    ))}
                  </div>
                  <Link href="/services" className="block mt-4 text-center text-sm text-blue-400 hover:text-blue-300 transition">
                    View all services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LeadModal
        serviceType={service.name}
        serviceSlug={params.service}
        location={location.name}
        locationSlug={params.location}
      />
      <Footer />
    </div>
  )
}
