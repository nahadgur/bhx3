import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  MapPin,
  Building2,
  Train,
  Home as HomeIcon,
  AlertTriangle,
  Truck,
  Package,
  Archive,
  Trash2,
  Sparkles,
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
import UniversalLeadForm from '@/components/UniversalLeadForm'
import { services } from '@/lib/services-data'
import { locations } from '@/lib/locations-data'

const getServiceIcon = (service: string, size: string = 'w-6 h-6') => {
  const icons: Record<string, React.ReactNode> = {
    'moving-companies': <Truck className={size} />,
    'packing-services': <Package className={size} />,
    'storage-facilities': <Archive className={size} />,
    'junk-removal': <Trash2 className={size} />,
    'cleaning-services': <Sparkles className={size} />,
    'real-estate-agents': <HomeIcon className={size} />,
    'building-inspectors': <ClipboardCheck className={size} />,
    'renters-insurance': <Shield className={size} />,
    'internet-providers': <Wifi className={size} />,
    locksmith: <Key className={size} />,
    'furniture-assembly': <Wrench className={size} />,
    painters: <PaintBucket className={size} />,
    'pest-control': <Bug className={size} />,
    'hvac-repair': <Thermometer className={size} />,
    plumbers: <Droplets className={size} />,
    electricians: <Zap className={size} />,
    'mold-remediation': <AlertOctagon className={size} />,
  }
  return icons[service] || <Wrench className={size} />
}

const servicesByCategory = Object.entries(services).reduce((acc, [slug, svc]) => {
  if (!acc[svc.category]) acc[svc.category] = []
  acc[svc.category].push({ slug, ...svc })
  return acc
}, {} as Record<string, Array<{ slug: string; name: string; description: string; category: string }>>)

const categoryOrder = ['Moving Services', 'Pre-Lease Research', 'Settling In', 'Ongoing Needs']
const categoryColors: Record<string, string> = {
  'Moving Services': 'emerald',
  'Pre-Lease Research': 'blue',
  'Settling In': 'purple',
  'Ongoing Needs': 'orange',
}

type Props = { params: { location: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = locations[params.location]
  if (!location) return {}
  return {
    title: `Services in ${location.name}, ${location.borough} | Building Health X`,
    description: `Find trusted moving, legal, and home services in ${location.name}. ${location.description}. Compare providers across ${Object.keys(services).length} service categories.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(locations).map((location) => ({ location }))
}

export default function LocationPage({ params }: Props) {
  const location = locations[params.location]
  if (!location) return notFound()

  const relatedLocations = Object.entries(locations)
    .filter(([slug, loc]) => loc.borough === location.borough && slug !== params.location)
    .slice(0, 8)

  const otherBoroughLocations = Object.entries(locations)
    .filter(([slug, loc]) => loc.borough !== location.borough)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/locations" className="hover:text-white transition">
              Locations
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{location.name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-cyan-500/10 text-cyan-400">
                  {location.borough}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-500/10 text-blue-400">
                  {Object.keys(services).length} Services Available
                </span>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                    Compare renter services in{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {location.name}
                    </span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    {location.description} Request quotes and compare options from providers who serve {location.name}.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                  <div className="text-sm font-semibold text-white mb-1">Popular services in {location.name}</div>
                  <p className="text-sm text-slate-400">
                    Moving companies, packing services, cleaning services, locksmiths, electricians, and plumbers.
                  </p>
                </div>
                <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                  <div className="text-sm font-semibold text-white mb-1">How requests work</div>
                  <p className="text-sm text-slate-400">
                    Choose a service. Share a few details. We follow up with providers who serve this area.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base">Get free quotes</h2>
                    <p className="text-xs text-slate-400">Licensed providers • No commitment</p>
                  </div>
                </div>
                <UniversalLeadForm locationName={location.name} locationSlug={params.location} />
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Services in {location.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(services).slice(0, 6).map(([slug, svc]) => (
                <Link
                  key={slug}
                  href={`/services/${slug}/${params.location}`}
                  className="group bg-[#12161f] border border-white/5 rounded-xl p-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition flex-shrink-0">
                      {getServiceIcon(slug, 'w-5 h-5')}
                    </div>
                    <h3 className="font-semibold group-hover:text-blue-400 transition">{svc.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{svc.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a href="#all-services" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition">
                View All {Object.keys(services).length} Services
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </section>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#12161f] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">Building Types</span>
              </div>
              <p className="text-sm font-medium">{location.buildingTypes}</p>
            </div>
            <div className="bg-[#12161f] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Train className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-400">Transit</span>
              </div>
              <p className="text-sm font-medium">{location.transit}</p>
            </div>
            <div className="bg-[#12161f] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <HomeIcon className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-400">Character</span>
              </div>
              <p className="text-sm font-medium">{location.character}</p>
            </div>
            <div className="bg-[#12161f] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-slate-400">Challenges</span>
              </div>
              <p className="text-sm font-medium">{location.challenges}</p>
            </div>
          </div>

          <div id="all-services" className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {categoryOrder.map((category) => {
                const categoryServices = servicesByCategory[category]
                if (!categoryServices || categoryServices.length === 0) return null
                const color = categoryColors[category] || 'blue'

                return (
                  <section key={category}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full bg-${color}-400`}></span>
                      {category}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {categoryServices.map((svc) => (
                        <Link
                          key={svc.slug}
                          href={`/services/${svc.slug}/${params.location}`}
                          className="group bg-[#12161f] border border-white/5 rounded-xl p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-${color}-500/10 rounded-xl flex items-center justify-center text-${color}-400 group-hover:bg-${color}-500/20 transition`}>
                              {getServiceIcon(svc.slug)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition">{svc.name}</h3>
                              <p className="text-sm text-slate-400 line-clamp-2">{svc.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition flex-shrink-0 mt-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6">
                {relatedLocations.length > 0 && (
                  <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                    <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                      More in {location.borough}
                    </h3>
                    <div className="space-y-2">
                      {relatedLocations.map(([slug, loc]) => (
                        <Link
                          key={slug}
                          href={`/locations/${slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                        >
                          <span className="text-sm">{loc.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {otherBoroughLocations.length > 0 && (
                  <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                    <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                      Other Neighborhoods
                    </h3>
                    <div className="space-y-2">
                      {otherBoroughLocations.map(([slug, loc]) => (
                        <Link
                          key={slug}
                          href={`/locations/${slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white transition">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{loc.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
