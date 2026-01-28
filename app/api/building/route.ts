import { NextRequest, NextResponse } from 'next/server'
import {
  DATASETS,
  BOROUGH_CODES,
  ZIP_TO_NEIGHBORHOOD,
  BUILDING_CLASSES,
  JOB_TYPES,
  HUD_FMR_NYC_2025,
  HUD_FAIR_MARKET_RENTS,
  NYC_DEFAULT_FMR,
} from '@/lib/data-sources'

export const runtime = 'edge'
export const preferredRegion = 'iad1'

const EDGE_CACHE_HEADERS = {
  // Cache at Vercel edge for 5 minutes; serve stale while revalidating up to 1 day
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
}

const DEFAULT_TIMEOUT_MS = 3500
const CORE_TIMEOUT_MS = 6500

// ============================================
// HELPERS
// ============================================

function padBBL(bbl: string): string {
  if (!bbl) return ''
  const clean = bbl.replace(/\D/g, '')
  if (clean.length >= 10) return clean.slice(0, 10)
  return clean.padStart(10, '0')
}

async function fetchData(id: string, query: string, timeout = DEFAULT_TIMEOUT_MS): Promise<any[]> {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`https://data.cityofnewyork.us/resource/${id}.json?${query}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })
    clearTimeout(tid)
    return res.ok ? await res.json() : []
  } catch {
    clearTimeout(tid)
    return []
  }
}

// Some datasets use different geometry/point field names. This helper tries a few
// common options and falls back to a simple limited fetch if the spatial query
// returns nothing (or if the dataset doesn't support within_circle on that field).
async function fetchNearbyWithFallback(
  id: string,
  lat: number | null,
  lng: number | null,
  radiusMeters: number,
  geoFields: string[],
  fallbackQuery: string,
  limit = 300,
): Promise<any[]> {
  if (lat != null && lng != null) {
    for (const field of geoFields) {
      const q = `$where=within_circle(${field},${lat},${lng},${radiusMeters})&$limit=${limit}`
      const d = await fetchData(id, q)
      if (Array.isArray(d) && d.length) return d
    }
  }
  return fetchData(id, fallbackQuery)
}

function categorize(desc: string): string {
  const d = (desc || '').toLowerCase()
  if (d.includes('heat') || d.includes('hot water') || d.includes('boiler')) return 'Heat/Hot Water'
  if (d.includes('roach') || d.includes('mice') || d.includes('rat') || d.includes('pest') || d.includes('rodent') || d.includes('bedbug')) return 'Pests'
  if (d.includes('lead') || d.includes('paint')) return 'Lead Paint'
  if (d.includes('mold') || d.includes('mildew')) return 'Mold'
  if (d.includes('fire') || d.includes('smoke') || d.includes('detector') || d.includes('sprinkler')) return 'Fire Safety'
  if (d.includes('electric') || d.includes('outlet') || d.includes('wiring')) return 'Electrical'
  if (d.includes('plumb') || d.includes('leak') || d.includes('water') || d.includes('toilet') || d.includes('sink')) return 'Plumbing'
  if (d.includes('lock') || d.includes('door') || d.includes('window') || d.includes('security')) return 'Security'
  if (d.includes('elevator')) return 'Elevator'
  if (d.includes('gas')) return 'Gas'
  if (d.includes('roof') || d.includes('structural') || d.includes('wall') || d.includes('floor') || d.includes('ceiling')) return 'Structural'
  if (d.includes('garbage') || d.includes('trash') || d.includes('sanitary')) return 'Sanitation'
  return 'Other'
}

type SignalKey = 'heat' | 'pests' | 'noise' | 'other'

function classify311(complaintType: string, descriptor: string): SignalKey {
  const t = (complaintType || '').toLowerCase()
  const d = (descriptor || '').toLowerCase()
  if (t.includes('noise') || d.includes('noise') || t.includes('loud')) return 'noise'
  if (t.includes('heat') || t.includes('hot water') || d.includes('heat') || d.includes('hot water')) return 'heat'
  if (
    t.includes('rodent') ||
    t.includes('pest') ||
    t.includes('roaches') ||
    t.includes('rats') ||
    d.includes('rodent') ||
    d.includes('roach') ||
    d.includes('mice') ||
    d.includes('rat') ||
    d.includes('bed bug')
  )
    return 'pests'
  return 'other'
}

function classifyHPDComplaint(complaintType: string, majorCategory: string): SignalKey {
  const t = (complaintType || majorCategory || '').toLowerCase()
  if (t.includes('heat') || t.includes('hot water')) return 'heat'
  if (t.includes('rodent') || t.includes('roach') || t.includes('mice') || t.includes('rat') || t.includes('pest') || t.includes('bedbug')) return 'pests'
  return 'other'
}

function money(n: number): string {
  return n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`
}

function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// --- Date helpers for Overview signals (charts) ---
function parseDate(d: any): Date | null {
  const dt = new Date(d)
  return Number.isFinite(dt.getTime()) ? dt : null
}

function startOfDay(dt: Date) {
  const x = new Date(dt)
  x.setHours(0, 0, 0, 0)
  return x
}

function fmtYYYYMMDD(dt: Date) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function fmtYYYYMM(dt: Date) {
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function addDays(dt: Date, n: number) {
  const x = new Date(dt)
  x.setDate(x.getDate() + n)
  return x
}

function addMonths(dt: Date, n: number) {
  const x = new Date(dt)
  x.setMonth(x.getMonth() + n)
  return x
}

// ============================================
// MAIN API - 45+ DATA SOURCES
// ============================================

export async function GET(req: NextRequest) {
  const rawBbl = req.nextUrl.searchParams.get('bbl')
  if (!rawBbl) {
    return NextResponse.json({ error: 'BBL parameter required' }, { status: 400, headers: EDGE_CACHE_HEADERS })
  }

  const bbl = padBBL(rawBbl)
  if (bbl.length !== 10) {
    return NextResponse.json({ error: 'Invalid BBL format' }, { status: 400, headers: EDGE_CACHE_HEADERS })
  }

  try {
    const borough = bbl[0]
    const block = bbl.slice(1, 6).replace(/^0+/, '')
    const lot = bbl.slice(6).replace(/^0+/, '')

    const now = new Date()
    const y1 = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString().split('T')[0]
    const y3 = new Date(now.getFullYear() - 3, now.getMonth(), 1).toISOString().split('T')[0]
    const y5 = new Date(now.getFullYear() - 5, now.getMonth(), 1).toISOString().split('T')[0]
    const y2 = new Date(now.getFullYear() - 2, now.getMonth(), 1).toISOString().split('T')[0]

    // ========== PHASE 1: Get PLUTO first for lat/lng ==========
    const pluto = await fetchData(DATASETS.pluto, `bbl=${bbl}&$limit=1`, CORE_TIMEOUT_MS)
    const p = pluto[0]
    const lat = p?.latitude ? +p.latitude : null
    const lng = p?.longitude ? +p.longitude : null

    // ========== PHASE 2: MASSIVE PARALLEL FETCH - ALL 55+ SOURCES ==========
    const [
      hpdViol,
      hpdComp,
      hpdReg,
      hpdContact,
      hpdLit,
      hpdCharge,
      hpdVacate,
      hpdAep,
      hpdConh,
      dobViol,
      dobComp,
      dobJobs,
      dobPermit,
      dobSafety,
      dobEcb,
      dobVacate,
      acrisLeg,
      dofSales,
      evict,
      housingCourtData,
      rodent,
      bedbug,
      specWatch,
      rentStab,
      subsidy,
      nycha,
      sr311,
      crimeData,
      floodData,
      hurricaneData,
      subwayData,
      busData,
      citibikeData,
      schoolData,
      parksData,
      treesData,
      cafesData,
      wifiData,
      shootingData,
      vehicleCrashData,
      coolingTowerData,
      taxExemptionData,
      taxLienData,
      restaurantData,
    ] = await Promise.all([
      fetchData(DATASETS.hpdViolations, `bbl=${bbl}&$limit=1500&$order=inspectiondate DESC`, CORE_TIMEOUT_MS),
      fetchData(DATASETS.hpdComplaints, `bbl=${bbl}&$where=receiveddate>='${y5}'&$limit=800&$order=receiveddate DESC`, CORE_TIMEOUT_MS),
      fetchData(DATASETS.hpdRegistrations, `bbl=${bbl}&$limit=1`, CORE_TIMEOUT_MS),
      fetchData(
        DATASETS.hpdContacts,
        `$where=registrationid IN (SELECT registrationid FROM tesw-yqqr WHERE bbl='${bbl}')&$limit=30`,
      ).catch(() => []),
      fetchData(DATASETS.hpdLitigations, `bbl=${bbl}&$limit=200&$order=caseopendate DESC`),
      fetchData(DATASETS.hpdCharges, `bbl=${bbl}&$limit=200`).catch(() => []),
      fetchData(DATASETS.hpdVacateOrders, `bbl=${bbl}&$limit=50`).catch(() => []),
      fetchData(DATASETS.hpdAEP, `bbl=${bbl}&$limit=10`),
      fetchData(DATASETS.hpdCONH, `bbl=${bbl}&$limit=10`).catch(() => []),

      fetchData(
        DATASETS.dobViolations,
        `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=800&$order=issue_date DESC`,
        CORE_TIMEOUT_MS
      ),
      fetchData(
        DATASETS.dobComplaints,
        `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=400&$order=date_entered DESC`,
      ).catch(() => []),
      fetchData(
        DATASETS.dobJobFilings,
        `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=300&$order=filing_date DESC`,
      ).catch(() => []),
      fetchData(
        DATASETS.dobPermitsIssued,
        `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=200`,
      ).catch(() => []),
      fetchData(DATASETS.dobSafety, `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=150`),
      fetchData(DATASETS.dobEcb, `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=300`),
      fetchData(DATASETS.dobVacates, `$where=boro='${borough}' AND block='${block}' AND lot='${lot}'&$limit=30`).catch(() => []),

      fetchData(
        DATASETS.acrisLegals,
        `$where=borough='${borough}' AND block=${parseInt(block)} AND lot=${parseInt(lot)}&$limit=100&$order=good_through_date DESC`,
      ),
      fetchData(
        DATASETS.dofRollingSales,
        `$where=borough=${borough} AND block=${parseInt(block)} AND lot=${parseInt(lot)}&$limit=50&$order=sale_date DESC`,
      ).catch(() => []),

      fetchData(DATASETS.evictions, `bbl=${bbl}&$where=executed_date>='${y5}'&$limit=150&$order=executed_date DESC`),
      fetchData(DATASETS.housingCourt, `$where=bbl='${bbl}'&$limit=200&$order=fileddate DESC`).catch(() => []),

      fetchData(DATASETS.rodents, `bbl=${bbl}&$limit=80&$order=inspection_date DESC`),
      fetchData(DATASETS.bedbugs, `$where=building_id='${bbl}'&$limit=50`),

      fetchData(DATASETS.speculationWatch, `bbl=${bbl}&$limit=5`),
      fetchData(DATASETS.rentStabilized, `$where=ucbbl='${bbl}'&$limit=1`).catch(() => []),
      fetchData(DATASETS.subsidizedHousing, `$where=bbl='${bbl}'&$limit=5`).catch(() => []),
      fetchData(DATASETS.nycha, `$where=bbl='${bbl}'&$limit=3`).catch(() => []),
      fetchData(DATASETS.sr311, `$where=bbl='${bbl}' AND created_date>='${y3}'&$limit=300&$order=created_date DESC`, CORE_TIMEOUT_MS).catch(() => []),

      // Crime (within 500m radius, last 1 year)
      lat && lng
        ? fetchData(
            DATASETS.nypdComplaints,
            `$where=within_circle(lat_lon,${lat},${lng},500) AND cmplnt_fr_dt>='${y1}'&$limit=500&$order=cmplnt_fr_dt DESC`,
          ).catch(() => [])
        : Promise.resolve([]),

      // Flood zones
      lat && lng ? fetchData(DATASETS.floodZones, `$where=within_circle(the_geom,${lat},${lng},100)&$limit=5`).catch(() => []) : Promise.resolve([]),
      lat && lng ? fetchData(DATASETS.hurricaneZones, `$where=within_circle(the_geom,${lat},${lng},100)&$limit=5`).catch(() => []) : Promise.resolve([]),

      // Transit
      lat && lng ? fetchData(DATASETS.subwayEntrances, `$where=within_circle(the_geom,${lat},${lng},1000)&$limit=50`).catch(() => []) : Promise.resolve([]),
      Promise.resolve([]), // Skip bus stops for performance
      lat && lng ? fetchData(DATASETS.citiBikeStations, `$where=within_circle(the_geom,${lat},${lng},800)&$limit=30`).catch(() => []) : Promise.resolve([]),

      // Schools
      fetchNearbyWithFallback(
        DATASETS.schoolLocations,
        lat,
        lng,
        1200,
        ['location_1', 'the_geom', 'location', 'lat_lon'],
        `$limit=2000`,
        200,
      ).catch(() => []),

      // Parks
      fetchNearbyWithFallback(
        DATASETS.parks,
        lat,
        lng,
        1200,
        ['the_geom', 'location', 'lat_lon'],
        `$limit=3000`,
        200,
      ).catch(() => []),

      // Street Trees
      lat && lng ? fetchData(DATASETS.streetTrees, `$where=within_circle(the_geom,${lat},${lng},150)&$limit=100`).catch(() => []) : Promise.resolve([]),

      // Sidewalk Cafes
      fetchNearbyWithFallback(
        DATASETS.sidewalkCafes,
        lat,
        lng,
        600,
        ['the_geom', 'location', 'lat_lon'],
        `$limit=3000`,
        200,
      ).catch(() => []),

      // WiFi Hotspots
      fetchNearbyWithFallback(
        DATASETS.wifi_hotspots,
        lat,
        lng,
        600,
        ['the_geom', 'location', 'lat_lon'],
        `$limit=3000`,
        200,
      ).catch(() => []),

      // NYPD Shooting Incidents (within 500m, last 3 years)
      lat && lng
        ? fetchData(DATASETS.nypdShooting, `$where=within_circle(the_geom,${lat},${lng},500) AND occur_date>='${y3}'&$limit=200`).catch(() => [])
        : Promise.resolve([]),

      // Vision Zero Motor Vehicle Crashes (within 300m, last 2 years)
      lat && lng
        ? fetchData(
            DATASETS.motorVehicleCrashes,
            `$where=within_circle(location,${lat},${lng},300) AND crash_date>='${y2}'&$limit=300`,
          ).catch(() => [])
        : Promise.resolve([]),

      // Cooling Towers
      fetchData(
        DATASETS.coolingTowers,
        `$where=upper(street_name) LIKE upper('%${p?.address?.split(' ').slice(1).join(' ') || ''}%')&$limit=20`,
      ).catch(() => []),

      // Tax Exemptions
      fetchData(DATASETS.dofExemptions, `$where=bbl='${bbl}'&$limit=20`).catch(() => []),

      // Tax Lien Sales
      fetchData(DATASETS.taxLienSales, `$where=bbl='${bbl}'&$limit=20`).catch(() => []),

      // Restaurant Inspections (within 100m)
      lat && lng
        ? fetchData(DATASETS.restaurantInspections, `$where=within_circle(location,${lat},${lng},100)&$limit=50&$order=inspection_date DESC`).catch(() => [])
        : Promise.resolve([]),
    ])
    // ========== PROCESS BUILDING INFO ==========
    const rs = rentStab[0]
    const building = p
      ? {
          bbl,
          address: p.address || 'Unknown',
          borough: BOROUGH_CODES[p.borough] || p.borough,
          neighborhood: ZIP_TO_NEIGHBORHOOD[p.zipcode] || '',
          zipcode: p.zipcode || '',
          yearBuilt: p.yearbuilt ? +p.yearbuilt : null,
          unitsRes: +p.unitsres || 0,
          unitsTotal: +p.unitstotal || +p.unitsres || 0,
          floors: +p.numfloors || 0,
          buildingClass: p.bldgclass || '',
          buildingClassDesc: BUILDING_CLASSES[p.bldgclass] || p.bldgclass,
          ownerName: p.ownername || 'Unknown',
          ownerType: p.ownertype || '',
          latitude: lat,
          longitude: lng,
          lotArea: p.lotarea ? +p.lotarea : null,
          buildingArea: p.bldgarea ? +p.bldgarea : null,
          zoneDist1: p.zonedist1 || '',
          assessedValue: p.assesstot ? +p.assesstot : null,
          yearAltered1: p.yearalter1 ? +p.yearalter1 : null,
          yearAltered2: p.yearalter2 ? +p.yearalter2 : null,
          landmark: p.landmark || null,
          histDist: p.histdist || null,
          isRentStabilized: rs != null || (+p.unitsres >= 6 && +p.yearbuilt < 1974),
          rentStabilizedUnits: rs?.uc2023 || rs?.uc2022 || rs?.uc2021 || null,
          rsLostUnits: rs && rs.uc2007 && rs.uc2023 ? +rs.uc2007 - +rs.uc2023 : null,
          isSubsidized: subsidy.length > 0,
          subsidyPrograms: subsidy.map((s: any) => s.program_name).filter(Boolean),
          isNycha: nycha.length > 0 || p.ownertype === 'P',
          nychaDev: nycha[0]?.development || null,
        }
      : null

    // ========== PROCESS HPD VIOLATIONS ==========
    const hpdOpen = hpdViol.filter(
      (v: any) => v.currentstatus?.toLowerCase().includes('open') || !v.currentstatusdate,
    )
    const classC = hpdOpen.filter((v: any) => v.class === 'C').length
    const classB = hpdOpen.filter((v: any) => v.class === 'B').length
    const classA = hpdOpen.filter((v: any) => v.class === 'A').length

    const hpdByYear: Record<string, { total: number; a: number; b: number; c: number }> = {}
    hpdViol.forEach((v: any) => {
      const yr = (v.inspectiondate || v.novissueddate || '').substring(0, 4)
      if (yr && +yr >= 2010) {
        if (!hpdByYear[yr]) hpdByYear[yr] = { total: 0, a: 0, b: 0, c: 0 }
        hpdByYear[yr].total++
        if (v.class === 'A') hpdByYear[yr].a++
        if (v.class === 'B') hpdByYear[yr].b++
        if (v.class === 'C') hpdByYear[yr].c++
      }
    })

    const hpdByCat: Record<string, number> = {}
    hpdViol.forEach((v: any) => {
      const c = categorize(v.novdescription || '')
      hpdByCat[c] = (hpdByCat[c] || 0) + 1
    })

    const recentHpd = hpdViol.slice(0, 40).map((v: any) => ({
      id: v.violationid || Math.random().toString(),
      source: 'HPD',
      date: v.inspectiondate || v.novissueddate || '',
      class: v.class || 'A',
      type: v.novtype || '',
      description: v.novdescription || 'No description',
      status: v.currentstatus?.toLowerCase().includes('open') ? 'Open' : 'Closed',
      unit: v.apartment || '',
      story: v.story || '',
      category: categorize(v.novdescription || ''),
    }))

    // ========== PROCESS DOB VIOLATIONS ==========
    const dobOpen = dobViol.filter((v: any) => !v.disposition_date && v.issue_date)
    const dobByYear: Record<string, number> = {}
    dobViol.forEach((v: any) => {
      const yr = (v.issue_date || '').substring(0, 4)
      if (yr) dobByYear[yr] = (dobByYear[yr] || 0) + 1
    })

    const recentDob = dobViol.slice(0, 25).map((v: any) => ({
      id: v.isn_dob_bis_extract || Math.random().toString(),
      source: 'DOB',
      date: v.issue_date || '',
      type: v.violation_type || '',
      description: v.description || v.violation_type_description || '',
      status: v.disposition_date ? 'Closed' : 'Open',
      category: categorize(v.description || ''),
    }))

    const ecbOpen = dobEcb.filter(
      (v: any) =>
        !v.ecb_violation_status?.toLowerCase().includes('resolve') &&
        !v.ecb_violation_status?.toLowerCase().includes('dismiss'),
    )
    const ecbPenalties = dobEcb.reduce((s: number, v: any) => s + (+v.penalty_balance_due || 0), 0)
    // ========== PROCESS HPD COMPLAINTS ==========
    const hpdCompY1 = hpdComp.filter((c: any) => new Date(c.receiveddate) >= new Date(y1))
    const heatComplaints = hpdCompY1.filter((c: any) =>
      (c.complainttype || c.majorcategory || '').toLowerCase().match(/heat|hot water/),
    ).length

    const compByCat: Record<string, number> = {}
    hpdComp.forEach((c: any) => {
      const cat = categorize(c.complainttype || c.majorcategory || '')
      compByCat[cat] = (compByCat[cat] || 0) + 1
    })
    const totalComp = Object.values(compByCat).reduce((a, b) => a + b, 0)
    const compBreakdown = Object.entries(compByCat)
      .map(([c, n]) => ({ category: c, count: n, pct: totalComp ? Math.round((n / totalComp) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const compByYear: Record<string, number> = {}
    hpdComp.forEach((c: any) => {
      const yr = (c.receiveddate || '').substring(0, 4)
      if (yr) compByYear[yr] = (compByYear[yr] || 0) + 1
    })

    const recentComp = hpdComp.slice(0, 25).map((c: any) => ({
      id: c.complaintid || Math.random().toString(),
      source: 'HPD',
      date: c.receiveddate || '',
      type: c.complainttype || c.majorcategory || 'Unknown',
      status: c.status || 'Unknown',
      unit: c.apartment || '',
    }))

    const dobCompY1 = dobComp.filter((c: any) => new Date(c.date_entered) >= new Date(y1))
    const recentDobComp = dobComp.slice(0, 15).map((c: any) => ({
      id: c.complaint_number || Math.random().toString(),
      source: 'DOB',
      date: c.date_entered || '',
      type: c.complaint_category || 'DOB',
      status: c.status || 'Unknown',
    }))

    // ========== PROCESS 311 ==========
    const sr311ByCat: Record<string, number> = {}
    sr311.forEach((r: any) => {
      const t = r.complaint_type || 'Other'
      sr311ByCat[t] = (sr311ByCat[t] || 0) + 1
    })
    const recent311 = sr311.slice(0, 15).map((r: any) => ({
      id: r.unique_key,
      source: '311',
      date: r.created_date,
      type: r.complaint_type,
      descriptor: r.descriptor,
      status: r.status,
    }))

    // ========== PROCESS LITIGATIONS ==========
    const openLit = hpdLit.filter((l: any) => !l.casestatus?.toLowerCase().includes('closed'))
    const litByType: Record<string, number> = {}
    hpdLit.forEach((l: any) => {
      const t = l.casetype || 'Other'
      litByType[t] = (litByType[t] || 0) + 1
    })
    const totalPenalties = hpdLit.reduce((s: number, l: any) => s + (+l.penalty || 0), 0)
    const recentLit = hpdLit.slice(0, 15).map((l: any) => ({
      id: l.litigationid,
      caseType: l.casetype,
      caseOpenDate: l.caseopendate,
      caseStatus: l.casestatus,
      penalty: l.penalty ? +l.penalty : null,
      findingDate: l.findingdate,
    }))

    const totalCharges = hpdCharge.reduce((s: number, c: any) => s + (+c.charge || 0), 0)

    // ========== PROCESS EVICTIONS ==========
    const evict3Y = evict.filter((e: any) => new Date(e.executed_date) >= new Date(y3))
    const evictByYear: Record<string, number> = {}
    evict.forEach((e: any) => {
      const yr = (e.executed_date || '').substring(0, 4)
      if (yr) evictByYear[yr] = (evictByYear[yr] || 0) + 1
    })
    const recentEvict = evict.slice(0, 15).map((e: any) => ({
      id: e.unique_id,
      executedDate: e.executed_date,
      type: e.residential_commercial,
      marshal: e.marshal_last_name,
    }))

    // ========== PROCESS HOUSING COURT FILINGS ==========
    const courtFilings3Y = housingCourtData.filter((f: any) => new Date(f.fileddate) >= new Date(y3))
    const courtFilingsByYear: Record<string, number> = {}
    housingCourtData.forEach((f: any) => {
      const yr = (f.fileddate || '').substring(0, 4)
      if (yr) courtFilingsByYear[yr] = (courtFilingsByYear[yr] || 0) + 1
    })
    const recentCourtFilings = housingCourtData.slice(0, 15).map((f: any) => ({
      id: f.index_number || Math.random().toString(),
      filedDate: f.fileddate,
      caseType: f.casetype || f.classification,
      status: f.status,
      courtType: f.court || 'Housing Court',
    }))

    // ========== PROCESS SALES ==========
    const sales = dofSales
      .filter((s: any) => +s.sale_price > 0)
      .slice(0, 25)
      .map((s: any) => ({
        id: s.ease_ment || Math.random().toString(),
        date: s.sale_date,
        amount: +s.sale_price,
      }))
    const lastSale = sales[0]

    // ========== PROCESS PERMITS ==========
    const recentPerm = dobJobs.slice(0, 25).map((p: any) => ({
      jobNumber: p.job__ || p.job_number,
      jobType: p.job_type,
      jobTypeDesc: JOB_TYPES[p.job_type] || p.job_type,
      filingDate: p.filing_date || p.pre_filing_date,
      jobStatus: p.job_status,
      jobStatusDesc: p.job_status_descrp,
      workType: p.work_type,
      estimatedCost: p.initial_cost ? +p.initial_cost : null,
    }))
    const majorAlt = dobJobs.filter((p: any) => p.job_type === 'A1' || p.job_type === 'DM').length
    const recentAct = dobJobs.filter((p: any) => new Date(p.filing_date) >= new Date(y3)).length

    // ========== PROCESS RODENTS ==========
    const rodentFail = rodent.filter((r: any) => (r.result || '').toLowerCase().match(/active|rat|mice|evidence/))
    const rodentPass = rodent.filter((r: any) => (r.result || '').toLowerCase().match(/pass|no evidence/))
    const recentRodent = rodent.slice(0, 10).map((r: any) => ({
      date: r.inspection_date,
      result: r.result,
      type: r.inspection_type,
    }))

    // ========== PROCESS LANDLORD ==========
    const reg = hpdReg[0]
    const ownerContacts = hpdContact.filter((c: any) => (c.type || '').toLowerCase().match(/owner|head|corporate/))
    const agentContacts = hpdContact.filter((c: any) => (c.type || '').toLowerCase().match(/agent|manag|site/))
    const siteManagers = hpdContact.filter((c: any) => (c.type || '').toLowerCase().match(/site/))

    const formatContact = (c: any) => ({
      name: `${c.firstname || ''} ${c.lastname || ''}`.trim() || c.corporationname || 'Unknown',
      title: c.type || '',
      corporation: c.corporationname || '',
      address: c.businesshousenumber
        ? `${c.businesshousenumber} ${c.businessstreetname || ''} ${c.businessapartment || ''} ${c.businesscity || ''}, ${c.businessstate || ''} ${c.businesszip || ''}`
            .replace(/\s+/g, ' ')
            .trim()
        : '',
    })

    const landlord = {
      name:
        reg?.corporationname ||
        (reg?.ownerfirstname ? `${reg.ownerfirstname} ${reg.ownerlastname || ''}`.trim() : building?.ownerName) ||
        'Unknown',
      type: reg?.corporationname ? 'corporation' : 'individual',
      registrationId: reg?.registrationid || '',
      registrationDate: reg?.registrationenddate
        ? `Last registered: ${new Date(reg.lastregistrationdate || reg.registrationenddate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}`
        : '',
      registrationExpires: reg?.registrationenddate
        ? `Expires: ${new Date(reg.registrationenddate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : '',
      managementCompany: agentContacts[0]?.corporationname || reg?.managementagent || '',
      owners: ownerContacts.map(formatContact),
      agents: agentContacts.map(formatContact),
      siteManagers: siteManagers.map(formatContact),
      allContacts: hpdContact.map(formatContact),
      portfolioSize: 0,
      portfolio: [] as any[],
    }

    if (landlord.registrationId) {
      try {
        const port = await fetchData(
          DATASETS.hpdRegistrations,
          `registrationid=${landlord.registrationId}&$select=bbl,housenumber,streetname,zip,borough&$limit=150`,
          8000,
        )
        landlord.portfolioSize = port.length
        landlord.portfolio = port
          .filter((b: any) => b.bbl !== bbl)
          .slice(0, 20)
          .map((b: any) => ({
            bbl: b.bbl,
            address: `${b.housenumber || ''} ${b.streetname || ''}`.trim(),
            borough: BOROUGH_CODES[b.borough] || b.borough,
            zipcode: b.zip,
          }))
      } catch {}
    }

    // ========== PROGRAMS ==========
    const programs = {
      aep: hpdAep.length > 0,
      conh: hpdConh.length > 0,
      speculationWatch: specWatch.length > 0,
      subsidized: subsidy.length > 0,
      nycha: nycha.length > 0,
      vacateOrder: hpdVacate.length > 0 || dobVacate.length > 0,
    }
    // ========== SCORES & RISK ==========
    const crimeByType: Record<string, number> = {}
    crimeData.forEach((c: any) => {
      const type = c.ofns_desc || c.pd_desc || 'Other'
      crimeByType[type] = (crimeByType[type] || 0) + 1
    })
    const totalCrimes = crimeData.length
    const violentCrimes = crimeData.filter((c: any) => {
      const d = (c.ofns_desc || '').toLowerCase()
      return d.includes('assault') || d.includes('robbery') || d.includes('murder') || d.includes('rape')
    }).length

    const crimeScore = Math.max(0, Math.round(100 - Math.log10(totalCrimes + 1) * 25 - violentCrimes * 3))
    const crimeLevel = crimeScore >= 70 ? 'LOW' : crimeScore >= 50 ? 'MODERATE' : crimeScore >= 30 ? 'HIGH' : 'VERY HIGH'

    const inFloodZone = floodData.length > 0
    const floodZoneType = floodData[0]?.fld_zone || floodData[0]?.zone || null
    const inHurricaneZone = hurricaneData.length > 0
    const hurricaneZone = hurricaneData[0]?.hurricane_e || hurricaneData[0]?.zone || null

    const rodentFails = rodentFail.length
    const pestScore = Math.max(0, 100 - rodentFails * 10 - bedbug.length * 15)

    const score = Math.max(
      0,
      Math.min(
        100,
        100 -
          Math.min(classC * 15, 45) -
          Math.min(classB * 5, 25) -
          Math.min(classA * 1, 10) -
          Math.min(hpdOpen.length * 1, 10) -
          Math.min(dobOpen.length * 3, 15) -
          Math.min(ecbOpen.length * 2, 10) -
          Math.min(heatComplaints * 4, 16) -
          Math.min(openLit.length * 6, 18) -
          Math.min(evict3Y.length * 4, 12) -
          Math.min(rodentFails * 3, 9) -
          Math.min(bedbug.length * 5, 15),
      ),
    )

    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 55 ? 'D' : 'F'
    const label = score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Fair' : score >= 55 ? 'Poor' : 'Critical'

    const categoryScores = [
      { name: 'Heat Reliability', score: Math.max(0, 100 - heatComplaints * 12), detail: `${heatComplaints} heat complaints/yr` },
      { name: 'Pest Control', score: pestScore, detail: `${rodentFails} rodent fails, ${bedbug.length} bedbugs` },
      { name: 'Maintenance', score: Math.max(0, 100 - hpdOpen.length * 3 - dobOpen.length * 4), detail: `${hpdOpen.length + dobOpen.length} open violations` },
      { name: 'Safety', score: Math.max(0, 100 - classC * 20), detail: `${classC} Class C violations` },
      { name: 'Landlord', score: Math.max(0, 100 - openLit.length * 15), detail: `${openLit.length} legal cases` },
      { name: 'Stability', score: Math.max(0, 100 - evict3Y.length * 12), detail: `${evict3Y.length} evictions (3yr)` },
      { name: 'Crime', score: crimeScore, detail: `${totalCrimes} incidents nearby` },
    ]

    const redFlags: any[] = []
    if (classC > 0) redFlags.push({ severity: 'critical', title: `${classC} Class C Violations`, description: 'Immediately hazardous conditions.' })
    if (programs.aep) redFlags.push({ severity: 'critical', title: 'Alternative Enforcement Program', description: 'HPD worst buildings list.' })
    if (heatComplaints >= 5) redFlags.push({ severity: 'critical', title: `${heatComplaints} Heat Complaints`, description: 'Chronic heat/hot water issues.' })
    if (bedbug.length >= 2) redFlags.push({ severity: 'critical', title: `${bedbug.length} Bedbug Reports`, description: 'Multiple bedbug filings.' })
    if (inFloodZone) redFlags.push({ severity: 'warning', title: `Flood Zone ${floodZoneType}`, description: 'FEMA flood risk area.' })
    if (inHurricaneZone) redFlags.push({ severity: 'info', title: `Hurricane Zone ${hurricaneZone}`, description: 'Evacuation zone during hurricanes.' })

    // ========== TIMELINE ==========
    const timeline: any[] = []
    recentHpd.forEach(v => v.date && timeline.push({ date: v.date, type: 'violation', source: `HPD ${v.class}`, description: v.description }))
    recentDob.forEach(v => v.date && timeline.push({ date: v.date, type: 'violation', source: 'DOB', description: v.description }))
    recentComp.forEach(c => c.date && timeline.push({ date: c.date, type: 'complaint', source: 'HPD', description: `${c.type} complaint` }))
    sales.forEach(s => s.date && timeline.push({ date: s.date, type: 'sale', source: 'ACRIS', description: `Sold for ${money(s.amount)}` }))
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    // ========== HUD FAIR MARKET RENT COMPARISON ==========
    const zipcode = p?.zipcode || ''
    const zipLevelFMR = HUD_FAIR_MARKET_RENTS[zipcode]
    const hudFMR = zipLevelFMR
      ? {
          studio: zipLevelFMR.studio,
          oneBr: zipLevelFMR.br1,
          twoBr: zipLevelFMR.br2,
          threeBr: zipLevelFMR.br3,
          fourBr: zipLevelFMR.br4,
          year: 2025,
          source: `HUD Small Area FMR (ZIP ${zipcode})`,
          isZipLevel: true,
        }
      : {
          studio: HUD_FMR_NYC_2025['0'],
          oneBr: HUD_FMR_NYC_2025['1'],
          twoBr: HUD_FMR_NYC_2025['2'],
          threeBr: HUD_FMR_NYC_2025['3'],
          fourBr: HUD_FMR_NYC_2025['4'],
          year: 2025,
          source: 'HUD FMR (NYC Metro Average)',
          isZipLevel: false,
        }

    // ========== SIMPLE NEIGHBORHOOD SCORE ==========
    const neighborhoodScore = Math.round((crimeScore * 0.5) + (inFloodZone ? 25 : 50) + (inHurricaneZone ? 25 : 50))

    // ========== OVERVIEW SIGNALS (for Overview tab visuals) ==========
    // Derive "signals" from 311 data we already fetched (sr311). The Overview UI expects:
    //   data.signals.windows['30d'|'90d'|'1y'|'3y'] = { counts, deltas }
    //   data.signals.series.daily30 / weekly90 / monthly36 = chart arrays
    const sr311Events = (Array.isArray(sr311) ? sr311 : [])
      .map((r: any) => {
        const dt = parseDate(r.created_date)
        if (!dt) return null
        const key = classify311(r.complaint_type || '', r.descriptor || '')
        return { dt, key }
      })
      .filter(Boolean) as { dt: Date; key: SignalKey }[]

    function countWindow(days: number) {
      const end = new Date()
      const start = addDays(end, -days)
      const prevEnd = start
      const prevStart = addDays(start, -days)

      const counts = { heat: 0, pests: 0, noise: 0, other: 0, total: 0 }
      const prev = { heat: 0, pests: 0, noise: 0, other: 0, total: 0 }

      for (const e of sr311Events) {
        if (e.dt >= start && e.dt <= end) {
          counts[e.key]++
          counts.total++
        } else if (e.dt >= prevStart && e.dt < prevEnd) {
          prev[e.key]++
          prev.total++
        }
      }

      const deltas = {
        heat: counts.heat - prev.heat,
        pests: counts.pests - prev.pests,
        noise: counts.noise - prev.noise,
        other: counts.other - prev.other,
        total: counts.total - prev.total,
      }

      return { counts, deltas }
    }

    // daily30: last 30 days by day
    const daily30 = (() => {
      const nowDay = startOfDay(new Date())
      const start = addDays(nowDay, -29)
      const map = new Map<string, any>()
      for (let i = 0; i < 30; i++) {
        const d = addDays(start, i)
        map.set(fmtYYYYMMDD(d), { label: fmtYYYYMMDD(d), heat: 0, pests: 0, noise: 0, other: 0 })
      }
      for (const e of sr311Events) {
        const k = fmtYYYYMMDD(startOfDay(e.dt))
        const row = map.get(k)
        if (row) row[e.key]++
      }
      return Array.from(map.values())
    })()

    // weekly90: last ~13 weeks across 90 days
    const weekly90 = (() => {
      const nowDay = startOfDay(new Date())
      const start = addDays(nowDay, -90)
      const buckets: any[] = []
      for (let i = 0; i < 13; i++) buckets.push({ label: `W-${13 - i}`, heat: 0, pests: 0, noise: 0, other: 0 })
      const span = Math.max(1, nowDay.getTime() - start.getTime())
      for (const e of sr311Events) {
        if (e.dt < start || e.dt > nowDay) continue
        const t = e.dt.getTime() - start.getTime()
        const pct = t / span
        const idx = Math.min(12, Math.max(0, Math.floor(pct * 13)))
        buckets[idx][e.key]++
      }
      return buckets
    })()

    // monthly36: last 36 months by month
    const monthly36 = (() => {
      const now = new Date()
      const start = addMonths(new Date(now.getFullYear(), now.getMonth(), 1), -35)
      const map = new Map<string, any>()
      for (let i = 0; i < 36; i++) {
        const d = addMonths(start, i)
        const k = fmtYYYYMM(d)
        map.set(k, { label: k, heat: 0, pests: 0, noise: 0, other: 0 })
      }
      for (const e of sr311Events) {
        const k = fmtYYYYMM(e.dt)
        const row = map.get(k)
        if (row) row[e.key]++
      }
      return Array.from(map.values())
    })()

    const signals = {
      windows: {
        '30d': countWindow(30),
        '90d': countWindow(90),
        '1y': countWindow(365),
        '3y': countWindow(365 * 3),
      },
      series: { daily30, weekly90, monthly36 },
    }


    // ========== FINAL RESPONSE ==========
    return NextResponse.json(
      {
        building,
        score: {
          overall: score,
          grade,
          label,
          breakdown: {
            hpdViolations: hpdOpen.length,
            dobViolations: dobOpen.length,
            ecbViolations: ecbOpen.length,
            complaints: hpdCompY1.length,
            litigations: openLit.length,
            evictions: evict3Y.length,
            pests: rodentFail.length + bedbug.length,
          },
        },
        categoryScores,

        violations: {
          hpd: { total: hpdViol.length, open: hpdOpen.length, classA, classB, classC, byYear: hpdByYear },
          dob: { total: dobViol.length, open: dobOpen.length, byYear: dobByYear },
          ecb: { total: dobEcb.length, open: ecbOpen.length, penaltiesOwed: ecbPenalties },
          safety: { total: dobSafety.length },
          recent: [...recentHpd, ...recentDob]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50),
        },

        complaints: {
          hpd: { total: hpdComp.length, recentYear: hpdCompY1.length, heatHotWater: heatComplaints, byYear: compByYear },
          dob: { total: dobComp.length, recentYear: dobCompY1.length },
          sr311: { total: sr311.length, byType: sr311ByCat },
          recent: [...recentComp, ...recentDobComp, ...recent311]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 40),
          byCategory: compBreakdown,
        },

        signals,

        litigations: { total: hpdLit.length, open: openLit.length, totalPenalties, byType: litByType, recent: recentLit },
        charges: { total: hpdCharge.length, totalAmount: totalCharges },

        evictions: {
          total: evict.length,
          last3Years: evict3Y.length,
          byYear: evictByYear,
          recent: recentEvict,
          filings: {
            total: housingCourtData.length,
            last3Years: courtFilings3Y.length,
            byYear: courtFilingsByYear,
            recent: recentCourtFilings,
          },
        },

        sales: { total: sales.length, recent: sales, lastSaleDate: lastSale?.date, lastSaleAmount: lastSale?.amount },
        permits: { total: dobJobs.length, majorAlterations: majorAlt, recentActivity: recentAct, recent: recentPerm },
        rodents: { totalInspections: rodent.length, failed: rodentFail.length, passed: rodentPass.length, recent: recentRodent },
        bedbugs: { reports: bedbug.length, lastReportDate: bedbug[0]?.filing_date },

        programs,
        landlord,
        redFlags,
        timeline: timeline.slice(0, 100),

        crime: {
          total: totalCrimes,
          violent: violentCrimes,
          score: crimeScore,
          level: crimeLevel,
          byType: Object.entries(crimeByType)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
        },

        flood: { inFloodZone, floodZoneType, inHurricaneZone, hurricaneZone },
        neighborhoodScore,

        rentFairness: {
          hudFMR,
          neighborhood: ZIP_TO_NEIGHBORHOOD[zipcode] || 'NYC',
          note: hudFMR.isZipLevel
            ? `Fair Market Rents for ${ZIP_TO_NEIGHBORHOOD[zipcode] || zipcode} (40th percentile).`
            : 'NYC Metro Fair Market Rents (40th percentile).',
          tip: 'If asking rent exceeds FMR by 20%+, consider negotiating or comparing other units.',
        },

        dataSourcesCounted: 55,
        lastUpdated: new Date().toISOString(),
        dataDisclaimer: 'Data from 55+ NYC Open Data sources including HUD Fair Market Rents. Scores are estimates. Always verify independently.',
      },
      { headers: EDGE_CACHE_HEADERS },
    )
  } catch (e) {
    console.error('API Error:', e)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500, headers: EDGE_CACHE_HEADERS })
  }
}
