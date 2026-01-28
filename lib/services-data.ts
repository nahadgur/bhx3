// Type definitions
export type Service = {
  name: string
  description: string
  category: string
  intro: string
  whyNeed: string[]
  whatToLookFor: { title: string; desc: string }[]
  costRange: string
  timeline: string
  faqs: { q: string; a: string }[]
}

export type Location = {
  name: string
  borough: string
  description: string
  buildingTypes: string
  transit: string
  character: string
  challenges: string
}

// Service definitions with rich SEO content
export const services: Record<string, {
  name: string
  description: string
  category: string
  intro: string
  whyNeed: string[]
  whatToLookFor: { title: string; desc: string }[]
  costRange: string
  timeline: string
  faqs: { q: string; a: string }[]
}> = {
  'moving-companies': {
    name: 'Moving Companies',
    description: 'Licensed and insured NYC movers for local and long-distance moves',
    category: 'Moving Services',
    intro: `Finding a reliable moving company in New York City requires more research than in most cities. NYC presents unique challenges: narrow staircases in pre-war buildings, strict co-op and condo board requirements, limited street parking, and tight elevator schedules. Professional NYC movers understand these challenges and come prepared with the right equipment, insurance, and experience.`,
    whyNeed: [
      'NYC buildings often require professional movers with specific insurance coverage (COI)',
      'Pre-war buildings have narrow staircases and tight corners requiring experience',
      'Many co-ops and condos restrict move times to specific windows',
      'Street parking for moving trucks is limited and heavily regulated',
      'Professional movers protect your belongings AND the building\'s common areas'
    ],
    whatToLookFor: [
      { title: 'NYC DOT License', desc: 'All local movers must be licensed by NYC Department of Transportation. Verify their license number before booking.' },
      { title: 'COI Capability', desc: 'Can they provide a Certificate of Insurance with your building listed as additional insured? Most NYC buildings require this.' },
      { title: 'Transparent Pricing', desc: 'Get written estimates breaking down hourly rates, truck fees, and additional charges. Avoid vague quotes.' },
      { title: 'Building Experience', desc: 'Have they worked in your building type before? Ask about walk-ups, co-ops, or high-rises specifically.' },
      { title: 'Reviews with Details', desc: 'Look for reviews mentioning specific neighborhoods or building types similar to yours.' }
    ],
    costRange: '$400–$800 for studios, $600–$1,200 for 1BR, $900–$1,800 for 2BR, $1,500–$3,000+ for 3BR+',
    timeline: 'Book 2–4 weeks ahead; 6+ weeks for peak season',
    faqs: [
      { q: 'How far in advance should I book movers?', a: 'Book 2-3 weeks ahead for most moves. For month-end dates or summer moves, book 4-6 weeks in advance.' },
      { q: 'What is a COI and do I need one?', a: 'A Certificate of Insurance proves the mover carries liability coverage. Most NYC buildings require one naming the building as additional insured.' },
      { q: 'Can I move on weekends?', a: 'Depends on your building. Many co-ops only allow weekday moves. Check with building management before booking.' },
      { q: 'Should I tip my movers?', a: 'Standard tip is $20-40 per mover for a local move, more for difficult moves. Tip in cash at the end.' }
    ]
  },
  'packing-services': {
    name: 'Packing Services',
    description: 'Professional packing and unpacking services',
    category: 'Moving Services',
    intro: `Professional packing services take the most time-consuming part of moving off your plate. NYC apartments present unique challenges: deep but narrow closets, compact kitchens, and oddly-shaped alcoves. Professional packers arrive with the right boxes, materials, and techniques to pack efficiently and protect your belongings.`,
    whyNeed: ['Professional packers work 3-5x faster than DIY packing', 'Proper techniques reduce damage during transport', 'Saves significant time when juggling work and move prep', 'Professionals bring all materials - no hunting for boxes', 'Insurance typically covers professionally packed items'],
    whatToLookFor: [
      { title: 'Materials Included', desc: 'Confirm boxes, tape, bubble wrap, and paper are included - not surprise extras.' },
      { title: 'Unpacking Services', desc: 'Many offer unpacking at destination. Worth it to settle in quickly.' },
      { title: 'Specialty Item Experience', desc: 'Ask about artwork, antiques, or fragile items if you have them.' },
      { title: 'Labeling System', desc: 'Good packers label boxes with contents and destination room.' },
      { title: 'Timeline Flexibility', desc: 'Can they pack the day before, or need multiple days?' }
    ],
    costRange: '$200–$400 for studios, $300–$600 for 1BR, $500–$1,000+ for larger',
    timeline: 'Book 1-2 weeks ahead; packing usually done 1-2 days before move',
    faqs: [
      { q: 'Should I pack anything myself?', a: 'Pack personal items, valuables, and essentials. Let pros handle fragile items and furniture.' },
      { q: 'How long does packing take?', a: 'A studio takes 2-3 hours, 1BR 3-5 hours, 2BR 5-8 hours.' },
      { q: 'Do they bring all the boxes?', a: 'Yes, professional packers bring appropriately sized boxes and all packing materials.' },
      { q: 'What about unpacking?', a: 'Most services offer unpacking - they\'ll place items and remove all materials.' }
    ]
  },
  'storage-facilities': {
    name: 'Storage Facilities',
    description: 'Short and long-term storage solutions',
    category: 'Moving Services',
    intro: `Storage in NYC serves a different purpose than elsewhere. Here, storage is often an extension of your living space - a way to make a small apartment livable by rotating seasonal items or holding furniture during lease gaps. Options range from traditional self-storage to full-service where companies pick up, store, and deliver.`,
    whyNeed: ['NYC apartments are small - storage extends your living space', 'Useful during lease gaps or renovations', 'Seasonal item rotation (winter clothes, AC units, bikes)', 'Full-service options mean no truck rental needed', 'Climate control protects furniture and valuables'],
    whatToLookFor: [
      { title: 'Climate Control', desc: 'Essential for furniture, electronics, and anything sensitive to humidity.' },
      { title: 'Access Hours', desc: 'Self-storage hours vary. Some offer 24/7, others limited access.' },
      { title: 'Security Features', desc: 'Look for surveillance, individual unit alarms, and secure access.' },
      { title: 'Full-Service Option', desc: 'They pick up, store, and deliver - no truck needed.' },
      { title: 'Month-to-Month Terms', desc: 'Avoid long contracts unless you get a significant discount.' }
    ],
    costRange: '$100–$200/month for small, $200–$400 for medium, $400+ for large',
    timeline: 'Can often start same week; full-service needs 2-3 days',
    faqs: [
      { q: 'Self-storage vs full-service?', a: 'Self-storage is cheaper but you transport items. Full-service costs more but they handle everything.' },
      { q: 'Do I need climate control?', a: 'Yes for wood furniture, electronics, photos, leather. NYC summers are brutal on stored items.' },
      { q: 'How much space do I need?', a: '5x5 fits boxes. 5x10 fits a studio. 10x10 fits a 1-2BR.' },
      { q: 'What shouldn\'t I store?', a: 'Perishables, flammables, anything illegal, and irreplaceable items.' }
    ]
  },
  'junk-removal': {
    name: 'Junk Removal',
    description: 'Fast and eco-friendly junk removal services',
    category: 'Moving Services',
    intro: `Junk removal in NYC isn't as simple as putting stuff on the curb. Large items require appointments with sanitation, and many things can't go curbside at all. Professional services handle the heavy lifting, navigate building rules, and ensure items are disposed of properly - or donated when possible.`,
    whyNeed: ['NYC sanitation has strict rules about large item disposal', 'Buildings often prohibit leaving items in common areas', 'Heavy items are difficult to move through walk-ups', 'Many services donate usable items instead of landfilling', 'Same-day service available for urgent cleanouts'],
    whatToLookFor: [
      { title: 'Transparent Pricing', desc: 'Most charge by volume. Get quotes before they arrive.' },
      { title: 'Donation Policy', desc: 'Good services donate usable items. Ask what percentage gets donated.' },
      { title: 'Building Compliance', desc: 'They should know how to work with building staff and elevators.' },
      { title: 'Same-Day Available', desc: 'Useful for urgent cleanouts or move-out deadlines.' },
      { title: 'E-Waste Handling', desc: 'Electronics require special disposal. Confirm they handle e-waste properly.' }
    ],
    costRange: '$100–$250 for small loads, $300–$500 for half truck, $500–$800+ for full',
    timeline: 'Often available same-day or next-day',
    faqs: [
      { q: 'How is pricing determined?', a: 'Usually by volume - how much space your items take in their truck.' },
      { q: 'What can\'t they take?', a: 'Hazardous materials, chemicals, paint. Ask about specific items.' },
      { q: 'Do they donate items?', a: 'Reputable services donate usable furniture and goods.' },
      { q: 'Do I need to be present?', a: 'Usually yes for access and to confirm what goes.' }
    ]
  },
  'cleaning-services': {
    name: 'Cleaning Services',
    description: 'Move-in and move-out deep cleaning',
    category: 'Moving Services',
    intro: `Move-in and move-out cleaning in NYC goes beyond regular cleaning. You're dealing with years of city grime and need to meet building or landlord standards. Professional cleaners have equipment and products to deep clean efficiently, which can help you get your security deposit back.`,
    whyNeed: ['Deep cleaning helps recover your security deposit', 'NYC apartments accumulate city grime that needs professional treatment', 'Move-in cleaning ensures you start fresh', 'Saves time during already stressful moving period', 'Professional equipment reaches areas you can\'t'],
    whatToLookFor: [
      { title: 'Move-Out Guarantee', desc: 'Some cleaners guarantee landlord approval or re-clean free.' },
      { title: 'Supplies Included', desc: 'Confirm they bring all cleaning supplies and equipment.' },
      { title: 'Checklist Provided', desc: 'Professional services provide detailed checklists.' },
      { title: 'Appliance Cleaning', desc: 'Oven, refrigerator interiors should be included.' },
      { title: 'Window Cleaning', desc: 'Interior windows often included; exterior may cost extra.' }
    ],
    costRange: '$150–$250 for studios, $200–$350 for 1BR, $300–$500+ for 2BR+',
    timeline: 'Book 3-5 days ahead; same-day possible at premium',
    faqs: [
      { q: 'Move-in or move-out cleaning?', a: 'Move-out focuses on deposit. Move-in ensures your new place is fresh.' },
      { q: 'How long does it take?', a: 'Studios 2-3 hours, 1BR 3-4 hours, 2BR 4-6 hours.' },
      { q: 'Will this help get my deposit back?', a: 'Yes. Professional cleaning addresses what landlords check.' },
      { q: 'Before or after moving?', a: 'Move-out: after furniture gone. Move-in: before your stuff arrives.' }
    ]
  },
  'real-estate-agents': {
    name: 'Real Estate Agents',
    description: 'Tenant-focused brokers who work for you',
    category: 'Pre-Lease Research',
    intro: `Finding an apartment in NYC often involves brokers, but not all work in your interest. Tenant-focused agents help you find listings, negotiate lease terms, and navigate applications. Understanding the difference between landlord's brokers and tenant's agents can save you money.`,
    whyNeed: ['Access to listings not on public sites', 'Help navigating NYC\'s competitive rental market', 'Negotiate lease terms and move-in costs', 'Guide through application and approval process', 'Knowledge of neighborhood-specific market conditions'],
    whatToLookFor: [
      { title: 'Tenant Representation', desc: 'Confirm they represent you, not the landlord.' },
      { title: 'Fee Structure', desc: 'Understand who pays the broker fee.' },
      { title: 'Neighborhood Expertise', desc: 'Agents specializing in your target areas know the buildings.' },
      { title: 'Responsiveness', desc: 'NYC moves fast. You need quick responses.' },
      { title: 'No-Fee Listings Access', desc: 'Good agents know which buildings offer no-fee apartments.' }
    ],
    costRange: 'Broker fees typically 1 month rent or 12-15% annual; many no-fee options',
    timeline: 'Start searching 30-45 days before move date',
    faqs: [
      { q: 'Do I have to pay a broker fee?', a: 'Not always. Many buildings now pay the fee. Ask about no-fee listings.' },
      { q: 'Listing vs tenant agents?', a: 'Listing agents represent the landlord. Tenant agents represent you.' },
      { q: 'How far ahead should I look?', a: 'Most NYC listings are for 30-day move-in. Start 3-4 weeks before.' },
      { q: 'Can I find an apartment without a broker?', a: 'Yes, through direct listings and no-fee platforms.' }
    ]
  },
  'building-inspectors': {
    name: 'Building Inspectors',
    description: 'Professional pre-move building inspections',
    category: 'Pre-Lease Research',
    intro: `Before signing a lease, a professional inspection can reveal issues the landlord won't mention: pest evidence, water damage, mold, lead paint, or faulty electrical. In NYC's competitive market, this step can save you from a nightmare situation.`,
    whyNeed: ['Identify hidden issues before signing a lease', 'Document existing damage to protect your deposit', 'Check for pests, mold, water damage, and safety hazards', 'Verify apartment matches listing claims', 'Leverage findings to negotiate repairs or rent'],
    whatToLookFor: [
      { title: 'Rental-Specific Experience', desc: 'Different from home buying. Find someone who knows rental issues.' },
      { title: 'Pest Detection', desc: 'Should check for signs of roaches, mice, and bed bugs.' },
      { title: 'Photo Documentation', desc: 'Detailed photos protect you when moving out.' },
      { title: 'Quick Turnaround', desc: 'NYC moves fast - they should accommodate tight timelines.' },
      { title: 'Written Report', desc: 'Get a detailed written report you can reference.' }
    ],
    costRange: '$150–$300 for standard apartment inspection',
    timeline: 'Can often schedule within 2-3 days',
    faqs: [
      { q: 'Is an inspection worth it for a rental?', a: 'Yes, especially for longer leases or older buildings.' },
      { q: 'What do they check?', a: 'Water pressure, electrical, appliances, windows, pests, mold, water damage.' },
      { q: 'Can I use the report to negotiate?', a: 'Absolutely. Documented issues give you leverage.' },
      { q: 'What if landlord won\'t allow inspection?', a: 'Red flag. Consider walking away.' }
    ]
  },
  'renters-insurance': {
    name: 'Renters Insurance',
    description: 'Compare quotes and protect your belongings',
    category: 'Pre-Lease Research',
    intro: `Renters insurance is one of the most affordable ways to protect yourself in NYC. For roughly $15-30 per month, you get coverage for your belongings, liability protection, and additional living expenses if your place becomes uninhabitable. Many landlords now require it.`,
    whyNeed: ['Protects belongings from theft, fire, and water damage', 'Liability coverage if someone is injured in your home', 'Many NYC landlords require proof of coverage', 'Covers additional living expenses if displaced', 'Surprisingly affordable - often under $20/month'],
    whatToLookFor: [
      { title: 'Coverage Amount', desc: 'Inventory your belongings. Most need $20,000-$50,000.' },
      { title: 'Replacement vs Actual Value', desc: 'Get replacement cost - it pays for new items.' },
      { title: 'Liability Limits', desc: '$100,000 minimum recommended; $300,000 for extra protection.' },
      { title: 'Deductible Options', desc: 'Higher deductible = lower premium.' },
      { title: 'Valuable Items Coverage', desc: 'Standard policies limit jewelry, electronics, art. Add riders if needed.' }
    ],
    costRange: '$12–$30/month for most NYC apartments',
    timeline: 'Can get coverage same day; quotes in minutes online',
    faqs: [
      { q: 'Do I really need renters insurance?', a: 'Yes. Your landlord\'s insurance doesn\'t cover your belongings.' },
      { q: 'What does it actually cover?', a: 'Your belongings, liability if someone is hurt, additional living expenses.' },
      { q: 'How much coverage do I need?', a: 'Total the replacement cost of your belongings. Usually $20,000-$50,000.' },
      { q: 'Does it cover my roommate?', a: 'Usually no. Each person typically needs their own policy.' }
    ]
  },
  'internet-providers': {
    name: 'Internet Providers',
    description: 'High-speed internet options for your area',
    category: 'Settling In',
    intro: `Internet options in NYC vary dramatically by building and neighborhood. Some buildings have fiber with multiple providers; others are stuck with one slow option. Check availability before signing a lease if internet is critical for work.`,
    whyNeed: ['Work from home requires reliable, fast internet', 'Options vary significantly by building - check before signing', 'Some buildings have exclusive deals with one provider', 'Fiber availability is expanding but not universal', 'Speeds advertised vs actual speeds often differ'],
    whatToLookFor: [
      { title: 'Building Availability', desc: 'Check which providers service your specific building.' },
      { title: 'Fiber vs Cable', desc: 'Fiber offers faster, more reliable speeds.' },
      { title: 'Actual Speed Tests', desc: 'Ask tenants or check speed test databases.' },
      { title: 'Contract Terms', desc: 'Avoid long contracts. Many offer month-to-month.' },
      { title: 'Installation Timeline', desc: 'Schedule before move-in. Waits can be weeks.' }
    ],
    costRange: '$40–$60 basic, $60–$80 mid-tier, $80–$100+ gigabit',
    timeline: 'Order 1-2 weeks before move; installation times vary',
    faqs: [
      { q: 'Which provider is best in NYC?', a: 'Depends on your building. Fios is generally best where available.' },
      { q: 'Can I get internet before I move in?', a: 'You can order but installation usually requires apartment access.' },
      { q: 'What speed do I need?', a: '100 Mbps for most. 200+ for video calls. 500+ for multiple heavy users.' },
      { q: 'My building only has one option?', a: 'Check if 5G home internet is available as an alternative.' }
    ]
  },
  'locksmith': {
    name: 'Locksmith Services',
    description: 'Lock changes and security upgrades',
    category: 'Settling In',
    intro: `Changing locks when you move into a new NYC apartment is smart security - you don't know who has copies from previous tenants. NYC tenants have the right to change locks (keeping a copy for the landlord). A locksmith can also upgrade your security.`,
    whyNeed: ['Previous tenants may have key copies', 'NYC law allows tenants to change locks', 'Upgrade from basic locks to high-security options', 'Emergency lockout services when you\'re stuck', 'Can add additional security like deadbolts'],
    whatToLookFor: [
      { title: 'Licensed and Insured', desc: 'NYC requires locksmith licensing. Verify before hiring.' },
      { title: 'Upfront Pricing', desc: 'Get a quote before work begins.' },
      { title: 'Emergency Availability', desc: 'Find one with 24/7 service for lockouts.' },
      { title: 'High-Security Options', desc: 'They should offer quality lock brands.' },
      { title: 'Key Copy Policies', desc: 'Remember you must provide landlord with a key.' }
    ],
    costRange: '$75–$150 standard lock change; $150–$300 high-security; $100–$200 emergency lockout',
    timeline: 'Same-day service usually available',
    faqs: [
      { q: 'Can I change locks in a rental?', a: 'Yes. NYC tenants can change locks. You must give landlord a copy.' },
      { q: 'How much does a lock change cost?', a: 'Basic: $75-150. High-security: $150-300. Prices per lock.' },
      { q: 'Should I upgrade to high-security locks?', a: 'Consider it for ground floor apartments.' },
      { q: 'What about lockouts?', a: 'Emergency services cost $100-200. Keep a spare key with a neighbor.' }
    ]
  },
  'furniture-assembly': {
    name: 'Furniture Assembly',
    description: 'IKEA and flat-pack furniture assembly',
    category: 'Settling In',
    intro: `Flat-pack furniture is an NYC apartment staple - it's affordable and fits through narrow doorways. But assembly can be frustrating. Professional assemblers have tools and experience to get it done quickly and correctly.`,
    whyNeed: ['Saves hours of frustrating DIY assembly', 'Professionals have proper tools and experience', 'Correctly assembled furniture is safer and lasts longer', 'Can handle complex pieces like PAX wardrobes, murphy beds', 'Often available same-day or next-day'],
    whatToLookFor: [
      { title: 'Flat Rate vs Hourly', desc: 'Flat rate per piece is often better for complex items.' },
      { title: 'Tools Provided', desc: 'They should bring all necessary tools.' },
      { title: 'Experience with Your Brand', desc: 'IKEA is common but other brands have quirks.' },
      { title: 'Wall Mounting Included', desc: 'Confirm they do this if needed.' },
      { title: 'Disposal of Packaging', desc: 'Good services remove all cardboard.' }
    ],
    costRange: '$50–$100 simple items; $100–$200 complex (PAX, beds); hourly $50–$80',
    timeline: 'Often available same-day or next-day',
    faqs: [
      { q: 'Is professional assembly worth it?', a: 'For complex pieces, absolutely. Your time has value.' },
      { q: 'How long does assembly take?', a: 'Simple bookshelf: 15-30 min. Bed: 45-90 min. PAX: 2-4 hours.' },
      { q: 'Do they mount to walls?', a: 'Most will for an additional fee.' },
      { q: 'What about disassembly for moving?', a: 'Many assemblers also disassemble.' }
    ]
  },
  'painters': {
    name: 'Painters',
    description: 'Interior painting and wall repairs',
    category: 'Settling In',
    intro: `NYC apartments often need paint - whether covering previous tenant's bold colors or refreshing dingy walls. NYC law requires landlords to repaint every three years, but quality varies. Always get permission before painting a rental.`,
    whyNeed: ['Fresh paint transforms a space quickly', 'Cover previous tenant\'s color choices', 'NYC law requires repainting every 3 years - but quality varies', 'Professional prep work ensures lasting results', 'Repair wall damage before moving out'],
    whatToLookFor: [
      { title: 'Prep Work Included', desc: 'Good jobs require wall repair, sanding, and priming.' },
      { title: 'Paint Quality', desc: 'Ask what paint brand they use. Cheap paint doesn\'t last.' },
      { title: 'Furniture Moving', desc: 'Do they move furniture and protect floors?' },
      { title: 'Timeline Accuracy', desc: 'Get a realistic timeline.' },
      { title: 'Touch-Up Policy', desc: 'Good painters return for touch-ups.' }
    ],
    costRange: '$300–$500 per room; whole apartment $800–$2,000+',
    timeline: 'Book 1-2 weeks ahead; job takes 1-3 days',
    faqs: [
      { q: 'Can I paint my rental apartment?', a: 'Get written permission from your landlord first.' },
      { q: 'How much does it cost?', a: 'Roughly $300-500 per room. Whole apartments $800-2000+.' },
      { q: 'How long does painting take?', a: 'One room: 1 day. Whole apartment: 2-4 days.' },
      { q: 'Before or after moving in?', a: 'Before. Much easier with empty rooms.' }
    ]
  },
  'pest-control': {
    name: 'Pest Control',
    description: 'Bed bugs, roaches, rodents, and more',
    category: 'Ongoing Needs',
    intro: `Pests are an unfortunate reality of NYC apartment living. The density means problems spread easily between units. NYC landlords are legally required to provide pest control. For bed bugs especially, professional treatment is the only effective solution.`,
    whyNeed: ['NYC density means pests spread easily between units', 'Bed bugs require professional treatment - no DIY solution works', 'Landlords are legally required to address infestations', 'Quick action prevents small problems from becoming major', 'Document issues for potential lease-breaking or legal action'],
    whatToLookFor: [
      { title: 'NYC Licensed', desc: 'Pest control requires state licensing. Verify credentials.' },
      { title: 'Specific Pest Expertise', desc: 'Bed bugs, roaches, and rodents each require different approaches.' },
      { title: 'Treatment Plan', desc: 'Should explain what they\'ll do and timeline.' },
      { title: 'Follow-Up Included', desc: 'Most pests require multiple treatments.' },
      { title: 'Guarantee', desc: 'Reputable services guarantee results.' }
    ],
    costRange: 'Roaches $100–$250; Bed bugs $300–$1,500; Rodents $150–$400',
    timeline: 'Often available within 1-3 days',
    faqs: [
      { q: 'Who pays for pest control?', a: 'Your landlord is legally responsible in NYC.' },
      { q: 'I think I have bed bugs - what do I do?', a: 'Confirm identification, notify landlord in writing, document everything.' },
      { q: 'How do I prevent roaches?', a: 'Keep food sealed, don\'t leave dishes out, seal gaps around pipes.' },
      { q: 'Can I break my lease for pest issues?', a: 'Potentially, if landlord fails to address. Document everything.' }
    ]
  },
  'hvac-repair': {
    name: 'HVAC Repair',
    description: 'Heating and cooling system repairs',
    category: 'Ongoing Needs',
    intro: `Heating and cooling issues are serious in NYC - winter heat is legally required, and summer without AC is brutal. Know who's responsible: landlords must provide heat and hot water, but AC maintenance varies by lease.`,
    whyNeed: ['Legal heating requirements in NYC (Oct 1 – May 31)', 'No heat is an emergency - landlord must respond quickly', 'AC repair needs can be urgent in NYC summers', 'Window AC units require annual maintenance', 'PTAC units in newer buildings need specialized service'],
    whatToLookFor: [
      { title: 'NYC Experience', desc: 'NYC has unique systems - PTACs, steam radiators, window units.' },
      { title: 'Emergency Service', desc: 'No heat in winter is an emergency. Find 24/7 availability.' },
      { title: 'Landlord vs Tenant Systems', desc: 'Clarify what you\'re responsible for.' },
      { title: 'Window Unit Service', desc: 'Many handle window AC installation and repair.' },
      { title: 'Diagnostic Fee Policy', desc: 'Some charge fees that apply toward repair.' }
    ],
    costRange: 'Service calls $75–$150; repairs $150–$500; window AC service $100–$200',
    timeline: 'Emergency same-day; routine 2-5 days',
    faqs: [
      { q: 'My heat isn\'t working - what do I do?', a: 'Notify landlord immediately in writing. No heat is an emergency.' },
      { q: 'Who fixes my window AC?', a: 'If you own it, you do. If it came with apartment, check your lease.' },
      { q: 'Can I install my own AC?', a: 'Usually yes for window units, but check lease.' },
      { q: 'What\'s a PTAC unit?', a: 'Through-wall AC common in newer NYC buildings. Needs specialized service.' }
    ]
  },
  'plumbers': {
    name: 'Plumbers',
    description: 'Emergency and scheduled plumbing services',
    category: 'Ongoing Needs',
    intro: `Plumbing emergencies in NYC apartments can quickly affect multiple units. Know what you're responsible for vs your landlord. Most issues are landlord responsibility, but response times vary and sometimes you need faster help.`,
    whyNeed: ['Plumbing emergencies can damage multiple units quickly', 'Clogged drains and leaks need fast response', 'Old NYC plumbing systems have unique quirks', 'Landlord response times vary', 'Document issues for landlord reimbursement'],
    whatToLookFor: [
      { title: 'NYC Licensed', desc: 'Plumbers must be licensed in NYC. Verify license number.' },
      { title: '24/7 Emergency Service', desc: 'Plumbing emergencies don\'t wait.' },
      { title: 'Apartment Building Experience', desc: 'NYC plumbing is interconnected.' },
      { title: 'Upfront Pricing', desc: 'Get quotes before work begins.' },
      { title: 'Warranty on Work', desc: 'Good plumbers stand behind their repairs.' }
    ],
    costRange: 'Service calls $100–$200; minor repairs $150–$350; major $400+',
    timeline: 'Emergency same-day; routine 1-3 days',
    faqs: [
      { q: 'Who pays for plumbing repairs?', a: 'Generally your landlord. Keep receipts for potential reimbursement.' },
      { q: 'My toilet is overflowing - what do I do?', a: 'Shut off the water valve behind the toilet. Contact landlord immediately.' },
      { q: 'Can I fix things myself?', a: 'Minor fixes like plunging are fine. Anything else - call a pro.' },
      { q: 'Building pipes are the issue?', a: 'Definitively landlord responsibility. Document what the plumber says.' }
    ]
  },
  'electricians': {
    name: 'Electricians',
    description: 'Licensed electrical repairs and installations',
    category: 'Ongoing Needs',
    intro: `Electrical work in NYC apartments should always be done by licensed professionals - it's both a safety issue and legal requirement. Old NYC buildings often have outdated electrical systems struggling with modern demands.`,
    whyNeed: ['Electrical work requires licensing in NYC - no DIY', 'Old buildings often have outdated, overtaxed systems', 'Tripping circuits usually indicates bigger problems', 'Outlet and fixture additions need professional installation', 'Safety issues require immediate attention'],
    whatToLookFor: [
      { title: 'NYC Licensed', desc: 'Electrical work requires licensing. Verify master electrician license.' },
      { title: 'Landlord Notification', desc: 'Some work requires landlord permission and permits.' },
      { title: 'Old Building Experience', desc: 'Pre-war electrical has quirks.' },
      { title: 'Clear Communication', desc: 'They should explain findings and recommendations.' },
      { title: 'Emergency Availability', desc: 'Electrical emergencies need immediate response.' }
    ],
    costRange: 'Service calls $100–$200; outlet repair $150–$300; larger work $300+',
    timeline: 'Emergency same-day; routine 2-5 days',
    faqs: [
      { q: 'Can I do electrical work myself?', a: 'No. NYC requires licensed electricians. It\'s also dangerous.' },
      { q: 'My circuits keep tripping?', a: 'Likely overloaded circuits. May need dedicated circuits.' },
      { q: 'Who pays for electrical repairs?', a: 'Landlord pays for existing system. Upgrades are usually on you.' },
      { q: 'Burning smell from outlet?', a: 'Stop using immediately, unplug everything, contact landlord and electrician. This is an emergency.' }
    ]
  },
  'mold-remediation': {
    name: 'Mold Remediation',
    description: 'Professional mold testing and removal',
    category: 'Ongoing Needs',
    intro: `Mold is common in NYC apartments due to humidity and older building systems. Small amounts can be cleaned yourself, but significant growth requires professional remediation. NYC landlords are required to address mold conditions.`,
    whyNeed: ['NYC humidity and old buildings create mold-friendly conditions', 'Professional remediation needed for significant growth', 'NYC landlords are legally required to address mold', 'Health impacts can be serious with prolonged exposure', 'Document for potential lease-breaking or legal action'],
    whatToLookFor: [
      { title: 'Certified Professionals', desc: 'Look for IICRC certification or similar.' },
      { title: 'Testing Services', desc: 'Professional testing identifies mold type and extent.' },
      { title: 'Source Identification', desc: 'Good remediators find the moisture source, not just remove mold.' },
      { title: 'Containment Protocols', desc: 'Proper remediation contains spores during removal.' },
      { title: 'Post-Remediation Testing', desc: 'Follow-up testing confirms success.' }
    ],
    costRange: 'Testing $200–$500; remediation $500–$3,000+ depending on extent',
    timeline: 'Testing 1-3 days; remediation scheduling 1-2 weeks',
    faqs: [
      { q: 'Who pays for mold remediation?', a: 'Your landlord if due to building issues. You if from your actions.' },
      { q: 'Can I clean mold myself?', a: 'Small areas (under 10 sq ft) of surface mold, yes. Larger requires pros.' },
      { q: 'Is mold dangerous?', a: 'Some molds cause respiratory problems and allergies. Take it seriously.' },
      { q: 'Can I break my lease for mold?', a: 'Potentially, if severe and landlord fails to remediate. Document everything.' }
    ]
  }
}
