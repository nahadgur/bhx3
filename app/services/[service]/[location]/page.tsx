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

const hashString = (input: string) => {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i)
  return Math.abs(h)
}

const headlineVariantsFor = (serviceSlug: string, serviceName: string) => {
  const noun = stripServicesSuffix(serviceName)
  const base = [
    `${noun} in {location}, NYC`,
    `Local ${noun} in {location}, NYC With Fast Availability`,
    `Compare ${noun} Options in {location}, NYC`,
    `Get Quotes for ${noun} in {location}, NYC`,
    `${noun} in {location}, NYC With Clear Next Steps`,
  ]
  return base
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services[params.service]
  const location = locations[params.location]
  if (!service || !location) return {}

  const h1 = pickHeadline(params.service, service.name, params.location, location.name)

  return {
    title: `${h1} | Building Health X`,
    description: `Get connected with ${stripServicesSuffix(service.name).toLowerCase()} professionals serving ${location.name}.`,
  }
}

export default function ServiceLocationPage({ params }: Props) {
  const service = services[params.service]
  const location = locations[params.location]
  if (!service || !location) return notFound()

  const noun = stripServicesSuffix(service.name)
  const headline = pickHeadline(params.service, service.name, params.location, location.name)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <section className="space-y-8">
            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <Image
                src={`/services/${params.service}.png`}
                alt={`${noun} in ${location.name}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/80 to-transparent" />
            </div>

            <h1 className="text-4xl font-bold">
              {renderHeadlineWithGradientLocation(headline, location.name)}
            </h1>

            <OpenModalButton variant="primary">Get Free Quotes</OpenModalButton>
          </section>

          {/* Costs & Timeline (UNCHANGED ABOVE) */}

          {/* ================= RENTER RESEARCH SECTIONS ================= */}

          <section className="mt-16 bg-[#12161f] border border-white/10 rounded-2xl p-10 space-y-6">
            <h2 className="text-3xl font-bold">
              What renters in {location.name} usually research before moving
            </h2>
            <p className="text-slate-300">
              Before hiring movers or setting up services, many renters research the apartment building itself to
              avoid surprises after move-in.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Apartment building reviews and tenant experiences</li>
              <li>Noise or maintenance complaints</li>
              <li>Pest history such as bedbugs or mice</li>
              <li>Open building violations</li>
              <li>Heat and hot water issues</li>
              <li>Landlord or management company history</li>
              <li>Safety and quality-of-life concerns</li>
            </ul>
          </section>

          <section className="mt-16 bg-[#12161f] border border-white/10 rounded-2xl p-10 space-y-6">
            <h2 className="text-3xl font-bold">
              Apartment complaints & violations renters check in {location.name}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>HPD complaints related to heat, pests, or maintenance</li>
              <li>Repeated unresolved violations</li>
              <li>Construction permits and active DOB filings</li>
              <li>Certificate of Occupancy status</li>
            </ul>
          </section>

          <section className="mt-16 bg-[#12161f] border border-white/10 rounded-2xl p-10 space-y-6">
            <h2 className="text-3xl font-bold">
              How renters research a specific apartment building in {location.name}
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-300">
              <li>Search the building address with “reviews”</li>
              <li>Check HPD and DOB records</li>
              <li>Review landlord or management history</li>
              <li>Confirm Certificate of Occupancy</li>
            </ol>
          </section>

          {/* ================= FAQ (UNCHANGED) ================= */}

          <section id="faq" className="mt-16 bg-[#12161f] border border-white/10 rounded-2xl p-10">
            <div className="flex items-center gap-4 mb-8">
              <HelpCircle className="w-6 h-6 text-blue-400" />
              <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            </div>

            {service.faqs.map((faq, i) => (
              <div key={i} className="mb-6">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </section>
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
