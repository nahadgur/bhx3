import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { services } from '@/lib/services-data'

type Props = { params: { service: string } }

type QASection = {
  title: string
  items: string[]
}

function getQuestions(serviceSlug: string, serviceName: string): QASection[] {
  if (serviceSlug === 'moving-companies') {
    return [
      {
        title: 'Before you book',
        items: [
          'Are you licensed and insured for NYC moves? Can you send proof (COI) if my building requires it?',
          'Is my estimate binding or non-binding? What would make the price change?',
          'What details do you need to price this accurately (inventory, stairs, elevator, long carry, parking)?',
          'Do you charge extra for stairs, disassembly, packing materials, or long carries?',
          'What’s your cancellation or reschedule policy?',
        ],
      },
      {
        title: 'Move-day logistics (NYC-specific)',
        items: [
          'Will you handle elevator reservations / building rules, or do I need to coordinate with management?',
          'What arrival window can you commit to, and how do you communicate delays?',
          'How do you protect hallways, elevators, floors, and my furniture?',
          'Do you have experience with tight streets / limited parking in my neighborhood?',
          'How many movers will be on the crew, and will it be the same crew the whole day?',
        ],
      },
      {
        title: 'Pricing & payment',
        items: [
          'What is included in the quote, and what is not included?',
          'Are there minimum hours? How is travel time billed?',
          'Do you accept credit card, and are there processing fees?',
          'How are tips handled? Are tips optional or expected?',
        ],
      },
      {
        title: 'Risk & claims',
        items: [
          'What is your policy for damaged items and how do claims work?',
          'Do you provide valuation coverage? What’s the difference vs insurance?',
          'If something goes wrong, who is my point of contact during the move?',
        ],
      },
    ]
  }

  return [
    {
      title: `Choosing the right ${serviceName.toLowerCase()}`,
      items: [
        `How do you price ${serviceName.toLowerCase()} jobs? What’s included, and what can add cost?`,
        'Are you licensed/insured, and can you share proof if needed?',
        'What’s your typical timeline and availability?',
        'Do you provide a written estimate or scope before work starts?',
        'What information do you need from me to quote accurately?',
      ],
    },
    {
      title: 'Quality & accountability',
      items: [
        'How do you handle issues or rework if something isn’t right?',
        'Who is my point of contact and how quickly do you respond?',
        'Do you provide photos, documentation, or a checklist when relevant?',
        'What are your payment terms and refund/cancellation policy?',
        'Can you share recent reviews or references for similar work?',
      ],
    },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services[params.service]
  if (!service) return {}
  return {
    title: `Questions to Ask ${service.name} | Building Health X`,
    description: `A practical checklist of questions to ask before you hire ${service.name.toLowerCase()} in NYC.`,
  }
}

export default function QuestionsToAskPage({ params }: Props) {
  const service = services[params.service]
  if (!service) return notFound()

  const sections = getQuestions(params.service, service.name)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
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
            <span className="text-white">Questions to ask</span>
          </nav>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <HelpCircle className="w-4 h-4" />
              Checklist
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
              Questions to ask before you hire {service.name.toLowerCase()}
            </h1>
            <p className="mt-3 text-slate-300">
              Use this to compare options objectively. Ask the same questions, get answers in writing when possible, and pick the provider that fits your timeline and constraints.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((sec) => (
              <section key={sec.title} className="bg-[#12161f] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">{sec.title}</h2>
                <ul className="space-y-3">
                  {sec.items.map((q) => (
                    <li key={q} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
            <div className="font-semibold">Want quotes from providers who serve your area?</div>
            <p className="mt-1 text-sm text-slate-300">
              Go back to the service page and request quotes for your neighborhood.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/services/${params.service}`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 font-semibold transition"
              >
                Browse neighborhoods
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2 font-semibold transition"
              >
                Pick a location
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
