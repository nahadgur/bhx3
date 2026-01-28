import type { Location, Service } from './services-data'

type LocationProfile = {
  /** 150+ words across paragraphs once rendered */
  context: string
  buildingStock: string
  transit: string
  landmarks: string
  commonChallenges: string
}
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function extendContext(location: Location, profile: LocationProfile) {
  // Add a third paragraph that is different per neighborhood (uses distinct transit/landmarks/building stock fields).
  // This keeps pages substantive while avoiding “find/replace” doorway copy.
  const extra = `A quick way to pressure-test a decision in ${location.name} is to treat access + building type as first-class constraints. ${profile.transit} Nearby reference points like ${profile.landmarks} help you sanity-check whether the building is in a high-foot-traffic corridor or a quieter pocket. The building stock matters too: ${profile.buildingStock} If you’re comparing a few addresses, use Building Health X to see whether ${profile.commonChallenges.toLowerCase()} shows up as a one-off spike or a repeating pattern across seasons.`

  return `${profile.context}\n\n${extra}`
}

// Intentionally unique, neighborhood-specific writing to avoid templated “doorway page” patterns.
// We keep the structure consistent but the substance varies materially by neighborhood.
const LOCATION_PROFILES: Record<string, LocationProfile> = {
  // Manhattan
  'upper-east-side': {
    buildingStock:
      'Pre-war co-ops along Park/Madison plus post-war towers on Yorkville avenues; many staffed lobbies, strict move rules, and elevator reservations.',
    transit:
      '4/5/6, Q, and crosstown buses; traffic on 2nd/3rd Ave can bottleneck deliveries and service calls.',
    landmarks:
      'Central Park, Museum Mile, and the East River Esplanade; dense co-op corridors near Park/Madison.',
    commonChallenges:
      'Co-op/condo building rules, service elevator scheduling, and curb access on narrow side streets.',
    context:
      `Upper East Side buildings skew toward doorman co-ops and large elevator buildings, with a meaningful pocket of older walk-ups in Yorkville. That mix matters for any service visit: co-ops often require a certificate of insurance, approved vendor lists, and scheduled elevator time, while older walk-ups turn every job into a stairs-and-hallways logistics problem. Street conditions are also different block to block  -  quiet side streets near Park Avenue can be easier to stage on, while 2nd/3rd Avenue corridors are busier and more constrained.

Transit access is excellent (4/5/6 and Q), but vehicle access is the real variable; double-parking rules and limited loading zones can slow appointments. The neighborhood’s building age range also means you’ll see everything from older steam heat systems to modernized high-rises, so the “same” issue (leaks, pests, noise) can have totally different root causes depending on the building type. If you’re comparing addresses, Building Health X helps you see whether problems are isolated to one property or consistent across a few nearby buildings.`,
  },
  'upper-west-side': {
    buildingStock:
      'Classic pre-war elevator buildings, brownstones, and larger post-war towers closer to the Hudson; many co-ops with board processes.',
    transit:
      '1/2/3 and A/B/C/D plus crosstown buses; weekend station work can shift routes and timing.',
    landmarks:
      'Central Park West, Riverside Park, Lincoln Center, and the 72nd/96th St transit hubs.',
    commonChallenges:
      'Older building systems, tight service entrances, and elevator scheduling in co-ops.',
    context:
      `Upper West Side housing runs from pre-war elevator buildings along West End and Central Park West to brownstones and newer towers closer to Columbus. Pre-war stock can mean thick walls (good for noise) but older plumbing, radiators, and legacy building infrastructure that needs careful maintenance. Co-ops are common, and that usually translates into clear rules for vendors, proof of insurance, and specific move/service windows.

Transit is strong (1/2/3 and A/B/C/D), which helps for appointments that rely on subway access, but trucks and vans still contend with park traffic, school drop-offs, and busy avenues. The neighborhood’s mix of family buildings and high-foot-traffic corridors also means you’ll want to evaluate entry security and package areas carefully. Building Health X is useful here because it turns DOB/311/HPD signals into a quick “is this building improving or worsening” view across multiple time windows.`,
  },
  harlem: {
    buildingStock:
      'Historic brownstones, pre-war walk-ups, and growing pockets of new development along major corridors; varied management quality block-to-block.',
    transit:
      '2/3, A/B/C/D, 1, and multiple buses; appointments can be easy by transit but parking varies widely.',
    landmarks:
      '125th Street, Apollo Theater, Marcus Garvey Park, and the St. Nicholas / Sugar Hill areas.',
    commonChallenges:
      'Older walk-up maintenance, inconsistent building management, and renovation/permit activity on active corridors.',
    context:
      `Harlem’s housing stock is diverse: landmarked brownstones, pre-war walk-ups, and newer mid-rise buildings along corridors like 125th and Frederick Douglass. That variety affects everything from move logistics to pest prevention  -  older masonry and shared basements can create entry points, while newer buildings may have stricter concierge and elevator policies.

Subway access is broad (2/3, A/B/C/D, 1), making it convenient to visit by transit, but vehicle access can swing from straightforward avenues to tight side streets with limited loading space. Harlem also sees meaningful renovation and new construction activity, so DOB complaints and permits can be a useful early signal when you’re deciding whether a building is actively being improved or is stuck in a cycle of patchwork repairs. Building Health X helps you compare recent activity (30/90 days) against longer patterns (1–3 years) so you can spot whether issues are seasonal or structural.`,
  },
  'east-village': {
    buildingStock:
      'Older walk-ups, tenements, and mixed-use buildings with ground-floor restaurants; fewer doorman towers than nearby neighborhoods.',
    transit:
      'L, 4/5/6, N/Q/R/W nearby; bus routes and bike traffic are constant, curb space is scarce.',
    landmarks:
      'Tompkins Square Park, St. Mark’s Place, and the 1st/2nd Ave nightlife corridors.',
    commonChallenges:
      'Noise from nightlife, pests tied to trash/food uses, and older building systems in walk-ups.',
    context:
      `East Village is defined by older walk-ups and mixed-use buildings where restaurants and bars sit below apartments. That’s great for energy and convenience, but it changes what “building health” looks like: nighttime noise, trash storage, and pest pressure are common watch-outs, and older plumbing and steam systems can mean recurring maintenance patterns.

Because curb space is scarce and street activity is high, any service that requires equipment, a van, or repeated visits benefits from careful scheduling. Transit is strong (L and 4/5/6 nearby), but deliveries and appointments often depend on navigating busy avenues and narrow side streets. The neighborhood’s block-by-block variability is exactly where Building Health X helps: you can check whether a given address has a recent spike in 311 noise, HPD complaints, or DOB issues  -  and whether it’s trending better over the last year or getting worse.`,
  },
  'west-village': {
    buildingStock:
      'Low-rise historic buildings, converted townhouses, and smaller condo/co-op properties; fewer large modern towers.',
    transit:
      'A/C/E, 1/2/3, and PATH nearby; narrow streets complicate vehicle access and staging.',
    landmarks:
      'Washington Square Park edge, Hudson River Park, and the Bleecker/Christopher corridors.',
    commonChallenges:
      'Tight streets, limited loading, landmark constraints, and older building envelopes.',
    context:
      `West Village skews low-rise and historic: townhouses, small co-ops, and older buildings on narrow, often one-way streets. That makes vehicle staging and loading a real factor  -  even quick appointments can take longer if there’s nowhere to stop. Many buildings have older envelopes and mechanicals, which can translate into seasonal comfort issues and maintenance that’s more “craft” than plug-and-play.

Transit access is strong, but for services that rely on vans or equipment, the street grid matters as much as the subway map. Landmark and historic-district considerations can also influence what owners can change quickly, which is why it’s useful to look at patterns over time. Building Health X lets you see the practical signals (HPD complaints, 311, DOB complaints) so you’re not relying on glossy listing photos to judge whether a building is well-run.`,
  },
  chelsea: {
    buildingStock:
      'A mix of pre-war lofts, mid-century rentals, and newer high-rises; many buildings with elevators and package rooms.',
    transit:
      'A/C/E, 1/2/3, and the 7/High Line area; heavy traffic near Penn Station corridors.',
    landmarks:
      'High Line, Chelsea Market, and the Hudson Yards edge.',
    commonChallenges:
      'Construction activity, loading constraints, and managing noise/dust in dense blocks.',
    context:
      `Chelsea spans older loft-style buildings and pre-war stock near avenues, plus a growing set of newer high-rises toward the west side. That mix changes the practical checklist: modern towers may have strict move-in procedures and concierge rules, while older loft conversions can have quirks around freight elevators, deliveries, and building access.

Chelsea’s proximity to major transit hubs and active development corridors means you’ll often see construction-related noise, temporary street closures, and heavier vehicle traffic. For renters, it’s worth checking whether a building’s “newly renovated” claims line up with complaint and violation patterns. Building Health X helps you look at recent activity (30/90 days) versus longer trends (1–3 years) so you can separate short-term disruption from ongoing management problems.`,
  },
  tribeca: {
    buildingStock:
      'Converted industrial lofts, luxury condos, and boutique doorman buildings; larger floorplates and freight-style layouts are common.',
    transit:
      '1/2/3, A/C/E, N/Q/R/W nearby; vehicle access varies with narrow cobblestone blocks.',
    landmarks:
      'Hudson River waterfront, Tribeca Park, and the Chambers/Canal corridors.',
    commonChallenges:
      'Loft building logistics, strict condo rules, and delivery timing in busy downtown streets.',
    context:
      `Tribeca is famous for loft conversions and boutique luxury buildings. Those loft layouts can be a dream, but they also bring specific operational realities: freight-style elevators, loading procedures, and building rules that are often enforced tightly. Street access can be tricky on narrower blocks, and timing matters when traffic stacks up.

Because many Tribeca buildings are condos or co-ops with professional management, the paper trail for any service visit can be more formal  -  COIs, scheduling windows, and building staff coordination. For renters, the biggest question is often whether a building’s day-to-day operations match its premium pricing. Building Health X helps by turning the “invisible” signals  -  HPD issues, 311 complaints, DOB complaints  -  into a quick reality check.`,
  },
  'hells-kitchen': {
    buildingStock:
      'Older walk-ups and mid-rise rentals mixed with newer high-rises toward the west; many buildings near busy avenues and tunnels.',
    transit:
      'A/C/E, N/Q/R/W, 1/2/3 nearby; traffic near Lincoln Tunnel can make appointments unpredictable.',
    landmarks:
      'Port Authority area, Restaurant Row (46th St), and the Hudson River greenway.',
    commonChallenges:
      'Street noise, traffic congestion, and mixed-use building issues in dense blocks.',
    context:
      `Hell’s Kitchen has a high density of rentals, from older walk-ups to newer towers closer to the Hudson. The neighborhood’s proximity to Port Authority and the Lincoln Tunnel shapes daily conditions: traffic, street noise, and late-night activity can all influence how a building feels  -  especially on lower floors or avenue-facing units.

Transit options are excellent, but curb access for vans and service providers can be unpredictable. Many buildings are mixed-use, and that can increase wear on common areas and create pest pressure if trash storage isn’t managed well. Building Health X is useful here because you can compare a building’s recent 311 noise and HPD patterns to longer windows, and see whether management is proactively improving things or reacting after the fact.`,
  },

  // Brooklyn
  williamsburg: {
    buildingStock:
      'New waterfront high-rises, mid-rise rentals, and older walk-ups inland; wide variability between “new luxury” and older stock.',
    transit:
      'L and G plus ferry; bridge traffic affects vans and delivery schedules.',
    landmarks:
      'Domino Park, Bedford Ave corridor, and the North Williamsburg waterfront.',
    commonChallenges:
      'Move logistics in towers, loading docks vs curb loading, and pest/odor issues near commercial corridors.',
    context:
      `Williamsburg has two distinct building worlds: newer high-rises and large rentals near the waterfront, and older walk-ups and small buildings farther inland. The tower set tends to have formal move procedures (elevator reservations, COIs, time windows), while older stock can have tighter stairs, older plumbing, and more variable management quality.

Transit is strong (L/G and ferry), but vehicle access is shaped by bridge traffic and busy retail corridors, so timing matters for services that require a van or multiple visits. The neighborhood’s pace of renovation also means DOB filings can be a helpful signal when you’re trying to understand whether a building is being actively improved. Building Health X lets you compare recent complaint activity with longer patterns so you can avoid signing into a building that’s been “almost fixed” for years.`,
  },
  bushwick: {
    buildingStock:
      'Older walk-ups and small multi-family buildings plus converted industrial lofts; many properties with shared basements and rear yards.',
    transit:
      'L, J/M/Z nearby depending on pocket; street parking is tight and truck access can be block-dependent.',
    landmarks:
      'Myrtle Ave, Wyckoff Ave, and the Morgan Ave industrial-to-loft corridor.',
    commonChallenges:
      'Converted loft entry points, trash storage issues, and block-by-block management differences.',
    context:
      `Bushwick’s building stock includes older walk-ups and a growing share of converted industrial lofts. Those conversions can look beautiful, but they often have unique pest entry points: loading-bay doors, utility penetrations, and shared basement spaces that weren’t originally designed for residential living. Small multi-family buildings can also vary widely in maintenance standards depending on ownership.

Transit access depends on the exact pocket (L vs J/M/Z), and service logistics depend on curb space and block layout. Seasonal factors matter too: heavy rain can reveal building envelope issues, and hot summers can amplify trash and pest pressure if storage is limited. Building Health X helps you see recent HPD and 311 signals  -  and whether the trajectory is improving  -  so you can choose a building that’s being managed, not just marketed.`,
  },
  'bedford-stuyvesant': {
    buildingStock:
      'Brownstones, small multi-family buildings, and pockets of newer infill; many older basements and shared yards.',
    transit:
      'A/C and G plus multiple buses; parking and loading vary by avenue vs side street.',
    landmarks:
      'Bedford Ave corridors, Herbert Von King Park, and the Nostrand/Franklin pockets.',
    commonChallenges:
      'Older building maintenance, basement moisture, and managing entry security in smaller buildings.',
    context:
      `Bedford-Stuyvesant is dominated by brownstones and small multi-family buildings, with newer infill scattered along busier corridors. That often means shared basements, older plumbing stacks, and building envelopes that need consistent upkeep. Many rentals are in smaller buildings without full-time staff, so management responsiveness matters a lot.

Transit coverage is good (A/C and G nearby for many areas), but service appointments are shaped by curb access and the specific street. Basement moisture after storms can be a hidden driver of pests and odors, and entry security can vary widely based on hardware and lighting. Building Health X is useful here because it surfaces patterns from HPD and 311 so you can validate whether a landlord’s “we take care of things quickly” claim matches the building’s record.`,
  },
  'park-slope': {
    buildingStock:
      'Brownstones and pre-war rentals plus some newer condos along 4th Ave; many family-oriented buildings with strict quiet hours.',
    transit:
      '2/3, B/Q, F/G/R depending on area; Fifth/Seventh Ave traffic can slow vans.',
    landmarks:
      'Prospect Park edge, Grand Army Plaza, and the Fifth/Seventh Ave retail corridors.',
    commonChallenges:
      'Brownstone stairs, curb access on narrow streets, and maintenance patterns in older homes.',
    context:
      `Park Slope’s housing is heavily brownstone and pre-war, with a modern corridor of newer buildings along 4th Avenue. Brownstones are charming, but they create specific logistics: narrow stairwells, multiple floors, and older mechanical systems that can require ongoing attention. Many buildings are family-heavy, which can translate into stricter building rules and more sensitivity to noise and scheduling.

Transit is excellent, but service work often depends on vehicle staging on narrow streets. When you’re renting, it’s worth checking how the building handles common pain points like heat consistency, water pressure, and trash storage. Building Health X helps you see whether a building has recurring complaint patterns  -  and whether those patterns are trending better over time.`,
  },
  'downtown-brooklyn': {
    buildingStock:
      'High-rise rentals and large new developments; many buildings with elevators, package rooms, and formal move-in procedures.',
    transit:
      'Huge transit hub: 2/3/4/5, A/C/F, N/Q/R/W, and more; traffic and deliveries are the main constraint.',
    landmarks:
      'Barclays Center vicinity, Fulton Mall, and the Civic Center courthouse/municipal core.',
    commonChallenges:
      'Elevator reservations, loading dock rules, and construction noise from ongoing development.',
    context:
      `Downtown Brooklyn is dominated by large new developments and high-rise rentals. That usually means formal building operations: concierge desks, package systems, COIs for vendors, and scheduled elevator time for big service jobs. It also means you should pay attention to how the building handles high resident volume  -  entry security, package overflow, and common-area upkeep.

Transit is the neighborhood’s superpower (multiple lines converge), but vehicle access can be difficult due to traffic, deliveries, and frequent construction. For renters, the key is distinguishing “new building hiccups” from deeper management issues. Building Health X helps by showing whether complaint activity is settling down over time or staying elevated.`,
  },
  dumbo: {
    buildingStock:
      'Converted warehouses/lofts plus newer waterfront towers; many buildings with large freight elevators or strict condo policies.',
    transit:
      'F and A/C nearby plus ferry; cobblestone streets and tourism traffic affect staging.',
    landmarks:
      'Brooklyn Bridge Park, the waterfront piers, and the Washington Street photo corridor.',
    commonChallenges:
      'Cobblestones, loading access, condo rules, and wind-driven noise near the waterfront.',
    context:
      `DUMBO combines warehouse conversions with modern waterfront towers. Loft buildings can have great space, but they often come with freight-elevator logistics and unique building envelopes  -  large windows, older masonry, and waterfront exposure. Newer towers tend to be more standardized but can have stricter condo/management policies and controlled access.

Transit options are good (F, A/C, ferry), yet vehicle staging can be complicated by tourism, cobblestone streets, and limited curb space. Waterfront exposure can amplify wind noise and moisture, which matters for comfort and maintenance. Building Health X gives you a data-first way to verify whether a building’s operations match its presentation.`,
  },
  'crown-heights': {
    buildingStock:
      'Brownstones, pre-war walk-ups, and some larger rentals along Eastern Parkway; older basements are common.',
    transit:
      '2/3/4/5 and A/C nearby depending on pocket; street access is generally workable but varies by avenue.',
    landmarks:
      'Eastern Parkway, Brooklyn Museum edge, and Prospect Heights border areas.',
    commonChallenges:
      'Heat/hot water consistency in older stock, basement moisture, and block-to-block building management differences.',
    context:
      `Crown Heights has substantial pre-war stock  -  brownstones and walk-ups  -  plus larger rentals near major corridors like Eastern Parkway. Older basements and shared utility spaces can influence pest risk and maintenance patterns, and heating systems can vary from building to building depending on upgrades.

Transit access is strong, and vehicle access is often easier than denser Manhattan neighborhoods, but the bigger variable is management quality. Two similar-looking buildings can behave very differently. Building Health X helps you compare addresses and see whether issues like heat complaints or pests show up as a recurring pattern or a one-off spike.`,
  },
  greenpoint: {
    buildingStock:
      'Older low-rise buildings and walk-ups plus new waterfront development; many properties with older pipes and basements.',
    transit:
      'G and ferry access; fewer subway options mean service providers often rely on vehicles.',
    landmarks:
      'McCarren Park edge, Manhattan Ave, and the waterfront at Transmitter Park.',
    commonChallenges:
      'Basement moisture near the waterfront, limited subway access, and mixed old/new building systems.',
    context:
      `Greenpoint mixes older low-rise buildings with a growing number of new waterfront developments. Older stock often means legacy plumbing, shared basements, and building envelopes that show wear during heavy rain. Newer buildings may be more standardized but can be stricter about access and vendor requirements.

The G train and ferry help, but many service visits still depend on vehicle access because subway coverage is thinner than other parts of Brooklyn. Waterfront-adjacent blocks can also experience more moisture and wind, which can influence comfort and maintenance. Building Health X is handy here to spot whether a building’s issues are seasonal or persistent.`,
  },

  // Queens
  astoria: {
    buildingStock:
      'Low- to mid-rise rentals, many pre-war walk-ups, and newer buildings near the waterfront; a lot of small landlords.',
    transit:
      'N/W and some R/M access depending on area; vehicle access is generally manageable.',
    landmarks:
      'Astoria Park, Ditmars Blvd, and the Steinway corridor.',
    commonChallenges:
      'Older walk-up maintenance, trash storage, and pest pressure in basements/ground floors.',
    context:
      `Astoria is largely low- to mid-rise, with many walk-ups and smaller landlords. That often means fewer building staff and more variability in maintenance response times. Older basements and ground-floor units can be more sensitive to pests and moisture, especially when trash storage is tight.

Transit is straightforward (N/W), and vehicle access tends to be easier than in Manhattan, which helps for services that need equipment or repeat visits. Astoria’s mix of residential blocks and busy commercial corridors means noise and trash conditions can change quickly from one street to the next. Building Health X helps you validate a specific address instead of assuming the neighborhood reputation applies to every building.`,
  },
  'long-island-city': {
    buildingStock:
      'New high-rise rentals and condos dominate, with some older industrial-to-residential edges; formal building operations are common.',
    transit:
      '7, E/M, N/W, and ferry; excellent access, but construction and loading can be intense.',
    landmarks:
      'Gantry Plaza State Park, Court Square, and the waterfront towers.',
    commonChallenges:
      'Elevator reservations, loading docks, ongoing construction noise, and high resident volume operations.',
    context:
      `Long Island City is defined by new high-rise development. That usually means elevators, package rooms, concierge desks, and formal vendor rules  -  great for predictability, but you’ll want to understand move/service policies before you commit. LIC also has active construction pockets, so dust and noise can be a real factor even in brand-new buildings.

Transit access is exceptional (7/E/M/N/W and ferry), but vehicle staging can still be tricky due to loading zones and development traffic. Building Health X helps you see whether a building’s “newness” is translating into low complaint activity  -  or whether early operational issues are showing up in 311/HPD signals.`,
  },
  flushing: {
    buildingStock:
      'A mix of older low-rise buildings, multi-family homes, and newer mid-rises; density spikes near Main Street corridors.',
    transit:
      '7 train and LIRR; busy streets near Main St can affect service timing.',
    landmarks:
      'Downtown Flushing/Main Street, Flushing Meadows-Corona Park edge, and major shopping corridors.',
    commonChallenges:
      'High foot traffic near commercial core, mixed-use buildings, and coordinating access in multi-family homes.',
    context:
      `Flushing combines multi-family homes and older low-rise rentals with newer mid-rise buildings near its commercial core. Mixed-use buildings are common in the busiest areas, which can affect trash storage, deliveries, and pest pressure if waste handling isn’t tight. In smaller homes and subdivided buildings, access and clear responsibility for maintenance can be less formal.

Transit access via the 7 train and LIRR is strong, but the Main Street area is extremely busy, making vehicle staging a factor for any service that involves equipment. Building Health X is useful here to see whether a particular address has recurring building issues, especially in dense mixed-use blocks.`,
  },
  'jackson-heights': {
    buildingStock:
      'Pre-war elevator buildings and co-ops, plus garden-style complexes; many buildings have shared courtyards and older systems.',
    transit:
      'E/F/M/R and 7; excellent transit but busy avenues for vehicles.',
    landmarks:
      '74th St–Broadway hub, Diversity Plaza, and the garden apartment districts.',
    commonChallenges:
      'Older building systems, co-op rules, and keeping common areas/pest prevention strong in dense buildings.',
    context:
      `Jackson Heights is known for pre-war elevator buildings, co-ops, and garden-style complexes with shared courtyards. Those buildings can be solid, but they’re also old enough that plumbing, heating, and facade maintenance patterns matter. Co-op rules may add structure (vendor insurance, scheduling), while dense common areas increase the importance of entry security and cleanliness.

The neighborhood is extremely well-served by transit (E/F/M/R/7), though busy avenues can complicate vehicle access for certain services. Building Health X helps you see whether a building’s long-term maintenance is reflected in fewer recurring complaints  -  or whether issues keep resurfacing year after year.`,
  },
  ridgewood: {
    buildingStock:
      'Older walk-ups and small multi-family buildings, often with shared basements and rear yards; many blocks have tight stairwells and older utilities.',
    transit:
      'M and L nearby depending on pocket; vehicle access is usually workable but curb space varies.',
    landmarks:
      'Fresh Pond Rd corridor, Myrtle Ave, and the Queens–Brooklyn border blocks.',
    commonChallenges:
      'Basement moisture, pests in older stock, and varied management responsiveness in small buildings.',
    context:
      `Ridgewood’s rentals skew toward older walk-ups and small multi-family buildings. That often means shared basements, older pipes, and building envelopes that show stress during heavy rain or freeze-thaw cycles. In smaller buildings, the biggest variable is management responsiveness  -  repairs may be quick and proactive, or they may drag.

Transit access depends on the pocket (M vs L), and service appointments can be easier than Manhattan thanks to more workable streets, but curb space still varies. Building Health X is useful for validating a specific address: you can check whether a building’s complaint history suggests consistent upkeep or recurring issues that never fully get resolved.`,
  },
  sunnyside: {
    buildingStock:
      'A mix of low-rise rentals, co-ops, and the Sunnyside Gardens-style stock; many buildings have older systems but stable management.',
    transit:
      '7 train plus buses; easy Midtown access makes scheduling flexible.',
    landmarks:
      'Sunnyside Gardens, Skillman Ave, and the Queens Blvd corridor.',
    commonChallenges:
      'Co-op rules, older plumbing/heating, and managing noise near Queens Blvd.',
    context:
      `Sunnyside features low-rise rentals and co-ops, including the Sunnyside Gardens area, which tends to have stable, community-minded building management. Older systems are still common, so heat consistency, water pressure, and building envelope maintenance are worth checking, especially in winter.

The 7 train makes Midtown access easy, which is helpful for scheduling services and commuting. Noise conditions can differ dramatically depending on proximity to Queens Boulevard. Building Health X helps you compare addresses within the neighborhood and see whether an individual building’s record matches the calm, residential feel many renters expect.`,
  },

  // Bronx
  fordham: {
    buildingStock:
      'Dense pre-war apartment buildings and multi-family stock; high foot traffic near commercial corridors and campuses.',
    transit:
      'B/D trains and Metro-North nearby; busy retail streets can affect deliveries.',
    landmarks:
      'Fordham University, the Grand Concourse edge, and Fordham Rd shopping corridor.',
    commonChallenges:
      'High-traffic buildings, older maintenance cycles, and keeping entry security strong.',
    context:
      `Fordham is dense and campus-adjacent, with substantial pre-war apartment stock and high foot traffic near Fordham Road. In busy buildings, the basics matter a lot: secure entries, clear trash handling, and consistent maintenance of common areas. Older systems can create recurring patterns around heat, hot water, and plumbing.

Transit access is solid (B/D and Metro-North nearby), but vehicle staging near retail corridors can be challenging. Building Health X helps you see whether a building’s issues are occasional or persistent by comparing recent complaint windows to longer history.`,
  },
  kingsbridge: {
    buildingStock:
      'Pre-war and mid-century buildings, many larger rentals along major avenues; hilly streets and older basements are common.',
    transit:
      '1 and 4 lines nearby; vehicle access varies with hills and bridge traffic.',
    landmarks:
      'Broadway corridor, Kingsbridge Armory area, and the Harlem River crossings.',
    commonChallenges:
      'Older building maintenance, basement moisture, and logistics on hilly blocks.',
    context:
      `Kingsbridge features larger pre-war and mid-century buildings along major avenues, with hilly topography that affects both daily life and service logistics. Older basements and utility spaces can be more sensitive to moisture, which matters for pests and odors.

Transit is straightforward (1 and 4), but vehicle timing can be influenced by bridge approaches and hills. Building Health X helps you evaluate whether a specific building’s maintenance is keeping pace with its age, or whether complaints and violations suggest chronic neglect.`,
  },
  riverdale: {
    buildingStock:
      'More suburban-feeling mid-rises, co-ops, and some single-family/multi-family stock; greener blocks and larger properties.',
    transit:
      '1 line at the edge plus Metro-North; cars are more common, which influences service preferences.',
    landmarks:
      'Wave Hill, Riverdale Park, and the Hudson River viewpoints.',
    commonChallenges:
      'Distance/logistics for providers, co-op rules, and weather exposure on higher elevations.',
    context:
      `Riverdale’s housing mix leans toward co-ops, mid-rises, and a more suburban pattern with greener blocks and larger properties. Because many residents rely on cars and the area is farther from central hubs, service scheduling and provider coverage matter more than in Manhattan.

Weather exposure and elevation can influence building envelope needs, and co-op rules are common. Building Health X helps by giving you an objective view of building issues so you can focus on properties that are well-managed, not just well-located.`,
  },
  'mott-haven': {
    buildingStock:
      'Pre-war rentals and a fast-growing set of new developments; active construction/renovation corridors.',
    transit:
      '4/5/6 and Metro-North nearby; vehicle access is generally workable but construction can reroute streets.',
    landmarks:
      'Bruckner Blvd corridors, the waterfront projects, and Third Ave commercial strips.',
    commonChallenges:
      'New-building shakeouts vs older-stock maintenance, construction noise, and street changes.',
    context:
      `Mott Haven has rapid new development alongside older pre-war rentals. New buildings can have early operational hiccups (elevators, package flow, finishing issues), while older buildings can show recurring maintenance patterns. Construction activity is common, which can affect noise and street access.

Transit coverage is strong, and vehicle access is usually workable, but timing can change with street work. Building Health X is helpful for separating “normal new-building settling” from management issues that keep showing up in complaints.`,
  },
  'pelham-bay': {
    buildingStock:
      'A mix of mid-century buildings, garden-style complexes, and multi-family homes; more space but older systems remain common.',
    transit:
      '6 train terminus area plus buses; many residents use cars.',
    landmarks:
      'Pelham Bay Park, Orchard Beach access, and the Hutchinson River Parkway vicinity.',
    commonChallenges:
      'Provider coverage distances, weather exposure, and maintaining older mechanical systems.',
    context:
      `Pelham Bay feels more spacious, with garden-style complexes, mid-century buildings, and multi-family homes. Because it’s farther from Manhattan, provider coverage and travel time can influence service availability and pricing. Older mechanical systems are still common, so consistent maintenance matters.

Transit exists via the 6 train and buses, but many residents rely on cars, which shapes what “convenient” service looks like. Building Health X helps you focus your search on buildings with fewer persistent issues, especially when you can’t easily pop over for repeat walkthroughs.`,
  },

  // Staten Island
  'st-george': {
    buildingStock:
      'Older low- to mid-rise buildings plus newer waterfront rentals; mix of small landlords and larger managed properties.',
    transit:
      'Staten Island Ferry hub; strong Manhattan access but local trips often depend on buses and cars.',
    landmarks:
      'Staten Island Ferry Terminal, Richmond County Bank Ballpark area, and the waterfront promenade.',
    commonChallenges:
      'Ferry-adjacent noise/traffic, mixed building quality, and coordinating service logistics across boroughs.',
    context:
      `St. George is Staten Island’s ferry hub, which shapes daily patterns: commuter traffic, waterfront exposure, and a mix of older buildings with newer rentals near the terminal. Some properties are professionally managed, while others are smaller-landlord buildings where maintenance quality can vary.

Ferry access is great for Manhattan commutes, but local service logistics often depend on buses and cars. For renters, it’s worth checking whether ferry-adjacent convenience comes with noise or operational tradeoffs. Building Health X helps you spot recurring patterns in complaints and violations so you can choose a building that’s stable, not just well-positioned.`,
  },
  stapleton: {
    buildingStock:
      'Older low-rise and small multi-family buildings with pockets of newer development; many properties with basements and shared yards.',
    transit:
      'Staten Island Railway plus buses; vehicle access is common and affects service preferences.',
    landmarks:
      'Stapleton waterfront areas, Victory Blvd corridors, and access toward the ferry via rail.',
    commonChallenges:
      'Older-stock upkeep, moisture management, and provider coverage variability.',
    context:
      `Stapleton includes older low-rise buildings and small multi-family homes, with pockets of newer development. Older basements and shared yard spaces can drive maintenance needs around moisture and pests, while smaller-building management can be less standardized.

The Staten Island Railway helps for ferry connectivity, but most service appointments assume vehicle access. Building Health X gives renters a way to check a specific address’s complaint and violation patterns before committing  -  especially important when buildings on adjacent blocks can have very different upkeep standards.`,
  },
}

function getProfile(location: Location): LocationProfile {
  const base: LocationProfile =
    LOCATION_PROFILES[slugify(location.name)] || {
      buildingStock: 'A mix of older and newer NYC apartment buildings.',
      transit: 'Subway and bus access varies by pocket.',
      landmarks: location.name,
      commonChallenges: 'Building operations and maintenance vary by property.',
      context:
        `${location.name} has a blend of building types and management styles, which is why it helps to validate any address with objective signals. Building Health X aggregates NYC open data so you can spot recurring issues and compare recent activity to longer patterns.`,
    }

  return { ...base, context: extendContext(location, base) }
}

function serviceWhySection(service: Service, location: Location, profile: LocationProfile): string {
  const baseIntro = `Residents in ${location.name} tend to look for ${service.name.toLowerCase()} when the practical reality of the neighborhood meets the practical reality of the building.`

 switch (slugify(service.name)) {

    case 'moving-companies':
      return (
        `${baseIntro} In this area, move-day success usually comes down to logistics: access to the building, stairs vs elevators, and whether management requires scheduled elevator time or a certificate of insurance. ${profile.buildingStock} If you’re moving into a doorman or managed building, ask about move windows, protection requirements for hallways, and how elevator reservations work. For walk-ups, confirm how many flights your crew expects and whether bulky items need disassembly.

Street conditions matter too. ${profile.transit} Busy corridors and limited loading can create “hidden costs” if a truck can’t stage close to the entrance. A good mover in ${location.name} will proactively plan for curb access, communicate arrival windows, and protect common areas to avoid building fines. Seasonal timing also matters  -  summer weekends can be crowded and winter weather can slow carries.

Before you sign a lease, run the address in Building Health X to sanity-check the building’s record. If you see recurring elevator outages, DOB complaints, or frequent resident reviews about management delays, you may want extra buffer time (and stronger documentation) for move-in coordination.`
      )
    
case 'renters-insurance':
      return (
        `${baseIntro} Renter’s insurance decisions are very building-specific. ${profile.buildingStock} In doorman towers you might worry less about package theft but more about water damage from neighboring units; in older walk-ups, plumbing backups and radiator/steam incidents can be more common. In either case, the key is choosing coverage that matches how the building actually behaves.

In ${location.name}, think through the risks that show up in everyday living: does the building have a history of leaks, recurring maintenance delays, or security issues? Coverage choices like personal property limits, loss-of-use (temporary housing), and liability can matter more than the headline premium. If you’re near busy corridors, consider add-ons that fit higher foot traffic and delivery volume.

Use Building Health X as a reality check. If the address shows repeated HPD or DOB activity related to building systems, that’s a cue to pay attention to water damage coverage and loss-of-use. If noise/security complaints are prominent, it’s a reminder to document valuables and consider how you receive packages. Insurance is cheapest when you set it up before problems start  -  and most useful when it matches the building’s actual risk profile.`
      )
    case 'pest-control':
      return (
        `${baseIntro} Pest issues in NYC are usually building-system issues: trash storage, basement moisture, gaps around pipes, and neighbor-to-neighbor spread. ${profile.buildingStock} In older stock, shared basements and utility chases can make it easy for roaches and mice to move between units. In mixed-use buildings, food uses and frequent deliveries can increase pressure if waste handling isn’t tight.

In ${location.name}, a good pest control provider should start with inspection and exclusion  -  sealing entry points, addressing moisture, and coordinating with building management  -  not just repeated spraying. Ask how they handle common NYC pests (roaches, mice, bed bugs) and whether they provide documentation you can share with management. Timing matters too: summer brings higher roach activity, and colder months often push mice indoors.

Building Health X can help you decide whether a problem is isolated or systemic. If you see persistent HPD-related complaint patterns tied to sanitation, pests, or building maintenance, that’s a sign you may need building-wide action, not just a unit-level treatment. Use the 30/90-day window to see if management is responding, and the 1–3 year view to see whether the issue is chronic.`
      )
    case 'storage-facilities':
      return (
        `${baseIntro} Storage is often a “neighborhood logistics” problem: how easy it is to get a car/van to the facility, whether you need climate control, and how often you’ll visit. ${profile.transit} In ${location.name}, the best choice depends on whether you’re storing for a move, renovating, or just freeing up space in a smaller apartment.

Look for practical features: loading bays or easy curb access, elevator availability, wide corridors for carts, and hours that match your schedule. Climate control can be worth it if you’re storing anything sensitive to humidity (books, instruments, electronics). Security matters too  -  cameras and controlled access are baseline, but staffing and lighting can make a real difference.

Use Building Health X to plan proactively. If your building has ongoing repairs, DOB activity, or recurring maintenance issues, short-term storage can give you flexibility during disruptions. And if you’re moving within the neighborhood, storage can help you avoid forcing a tight move-out/move-in overlap.`
      )
    case 'building-inspectors':
      return (
        `${baseIntro} A building inspection is most valuable when it’s tailored to the building stock and the problems that show up locally. ${profile.buildingStock} In older buildings, inspectors can focus on water intrusion, heat/hot water consistency, electrical panels, signs of pests, and the condition of common areas. In newer buildings, the focus shifts to workmanship, ventilation, and whether systems are operating as advertised.

In ${location.name}, inspectors who understand NYC rentals will look beyond the unit’s fresh paint. They’ll check the “invisible” risks: moisture in basements, evidence of recurring leaks, window/door sealing that affects noise and drafts, and the building’s operational basics (trash, security, egress). Seasonal context matters  -  winter reveals heating issues, and summer reveals ventilation and pest pressure.

Pair the inspection with Building Health X. If the address shows repeated HPD/DOB activity, bring that to the inspection and ask targeted questions. The goal is not perfection  -  it’s knowing what’s likely to become your problem after you sign.`
      )
    default:
      return `${baseIntro} ${profile.buildingStock} Building Health X can help you validate a specific address before you commit.`
  }
}

function whatToLookFor(service: Service): string[] {
  switch (slugify(service.name)) {

    case 'moving-companies':
      return [
        'Transparent estimates with inventory and stairs/elevator assumptions called out',
        'Proof of insurance that matches NYC building requirements',
        'Crew that protects hallways, elevators, and corners (not just your furniture)',
        'Clear plan for parking/loading and communication on arrival windows',
      ]
    case 'renters-insurance':
      return [
        'Coverage that fits your building risk (water damage + loss-of-use)',
        'Replacement cost for personal property (not just actual cash value)',
        'Liability limits appropriate for roommates/guests',
        'Easy claims process and clear documentation requirements',
      ]
    case 'pest-control':
      return [
        'Inspection-first approach with exclusion/sealing recommendations',
        'Clear plan for building-wide coordination (not unit-only fixes)',
        'Treatment options for roaches, mice, and bed bugs with safety guidance',
        'Documentation you can share with management/landlord',
      ]
    case 'storage-facilities':
      return [
        'Easy loading access (elevator/carts) and hours that match your schedule',
        'Security basics: controlled access, cameras, lighting, staffed desk',
        'Climate control if you’re storing humidity-sensitive items',
        'Transparent pricing and move-in/move-out policies',
      ]
    case 'building-inspectors':
      return [
        'NYC-rental specific checklist: moisture, pests, heat/hot water, safety basics',
        'Clear written report with photos and prioritized findings',
        'Comfort interpreting building history (violations/complaints) into risk',
        'Independent, unbiased recommendations (not upsells)',
      ]
    default:
      return ['Strong reviews, transparent pricing, and NYC-specific experience']
  }
}

function dataInsights(service: Service, location: Location, profile: LocationProfile): string {
  // Data-driven without inventing numeric neighborhood stats.
  return `Building Health X is built on NYC open data (HPD violations/complaints, DOB complaints, 311 calls, and more). In ${location.name}, that’s especially useful because ${profile.commonChallenges.toLowerCase()}. When you run an address, try comparing the 30/90-day window against the 1–3 year view: a short-term spike can mean a temporary issue (a broken boiler or a noisy renovation), while a long-term pattern suggests management or building-system problems.

For ${service.name.toLowerCase()} decisions, focus on the signals most related to your risk: heat/hot water and building violations for habitability, 311 noise trends for quality-of-life, and complaint clusters that repeat across seasons. If you see repeated issues around the same category, bring that context into your provider conversation  -  it helps you ask better questions and set realistic expectations.`
}

export function getServiceLandingCopy(service: Service, location: Location) {
  const profile = getProfile(location)
  return {
    hero: {
      title: `${service.name} in ${location.name}`,
      subtitle:
        `Find a vetted path to help in ${location.name}, backed by address-level building signals from NYC open data.`,
    },
    locationContext: profile.context,
    whyResidentsNeed: serviceWhySection(service, location, profile),
    whatToLookFor: whatToLookFor(service),
    localTips: `Local considerations for ${location.name}: ${profile.transit} Nearby reference points include ${profile.landmarks}. Building context: ${profile.buildingStock}`,
    dataDriven: dataInsights(service, location, profile),
  }
}
