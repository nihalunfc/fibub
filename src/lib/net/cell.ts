// #T952 Cell Signal: signal ratings and the per-country list of official coverage maps, networks and tower data.
// Pure data and maths, no DOM. Rating bands are the rule-of-thumb ranges used widely by operators and
// equipment makers (e.g. LTE RSRP: -80 dBm and up excellent, below -100 cell edge); they are guides, not standards.

export type Tech = 'lte' | 'nr' | 'umts' | 'gsm';
const BANDS: Record<Tech, { name: string; metric: string; cut: [number, number, number, number] }> = {
  lte: { name: '4G LTE', metric: 'RSRP', cut: [-80, -90, -100, -110] },
  nr: { name: '5G', metric: 'SS-RSRP', cut: [-80, -90, -100, -110] },
  umts: { name: '3G', metric: 'RSCP', cut: [-70, -85, -100, -110] },
  gsm: { name: '2G', metric: 'RSSI', cut: [-70, -85, -100, -110] },
};

export function rateSignal(tech: Tech, dbm: number, sinr?: number) {
  if (!isFinite(dbm)) return null;
  const b = BANDS[tech], [e, g, f, p] = b.cut;
  const [label, tone, what] =
    dbm >= e ? ['Excellent', 'good', 'Strong and close to the tower. Fast data and clear calls.'] :
    dbm >= g ? ['Good', 'good', 'Reliable data and calls.'] :
    dbm >= f ? ['Fair', 'warn', 'Usable; speed drops and video may buffer at busy times.'] :
    dbm >= p ? ['Poor', 'bad', 'Edge of coverage: slow data, calls may drop.'] :
    ['Very poor', 'bad', 'Barely any service. Try a window, a higher floor or another network.'];
  let text = `${b.name} ${b.metric} ${Math.round(dbm)} dBm: ${what}`;
  if (sinr != null && isFinite(sinr)) {
    const q = sinr >= 20 ? 'very clean' : sinr >= 13 ? 'clean' : sinr >= 0 ? 'some interference' : 'heavy interference';
    text += ` SINR ${sinr} dB: ${q}${sinr < 0 && dbm >= f ? ', so a strong signal can still be slow here' : ''}.`;
  }
  return { label, tone, text };
}

// Bars differ between phones; this is only a rough LTE equivalent so bar-only readings can be averaged.
export const barsToDbm = (bars: number) => [-120, -112, -105, -95, -85][Math.max(0, Math.min(4, Math.round(bars)))];

type Item = { name: string; url?: string; note: string };
export const COUNTRIES_CELL: Record<string, { official: Item[]; networks: Item[]; towers: Item[]; tip: string }> = {
  ca: {
    official: [
      { name: 'National Broadband Data (ISED)', url: 'https://open.canada.ca/data/en/dataset/00a331db-121b-445d-b119-35dbbe3eedd9', note: 'Government open data on internet and mobile (LTE) availability by area' },
      { name: 'CRTC broadband map', url: 'https://crtc.gc.ca/eng/internet/map-carte.htm', note: 'the CRTC map of service in your area' },
      { name: 'CCTS', url: 'https://www.ccts-cprst.ca/', note: 'free complaints service if a provider does not fix a problem' },
    ],
    networks: [
      { name: 'Rogers', note: 'national network; Fido and Chatr use it' },
      { name: 'Bell', note: 'national network; Virgin Plus and Lucky Mobile use it' },
      { name: 'Telus', note: 'national network, shared with Bell in many areas; Koodo and Public Mobile use it' },
      { name: 'Freedom Mobile', note: 'mainly cities in Ontario, Alberta and British Columbia' },
      { name: 'Vidéotron', note: 'Quebec and parts of Ontario; Fizz uses it' },
      { name: 'SaskTel', note: 'Saskatchewan' },
    ],
    towers: [
      { name: 'ISED Spectrum Management System', url: 'https://sms-sgs.ic.gc.ca/', note: 'official licensed antenna sites (search by area)' },
      { name: 'CellMapper', url: 'https://www.cellmapper.net/', note: 'crowd-sourced tower and signal map; volunteers\' data, may be out of date' },
    ],
    tip: 'Bell and Telus share much of their network, so their coverage is often the same. Brands like Fido, Koodo or Lucky use a big network\'s towers.',
  },
  in: {
    official: [
      { name: 'TRAI MySpeed', url: 'https://myspeed.trai.gov.in/', note: 'TRAI\'s speed and call-quality data, and the MySpeed app to add your own tests' },
      { name: 'Tarang Sanchar (DoT)', url: 'https://tarangsanchar.gov.in/', note: 'mobile towers near any address and their EMF test reports' },
      { name: 'Operator coverage maps', note: 'TRAI requires every operator to publish a coverage map by technology (2G, 4G, 5G) on its website (2025 direction)' },
    ],
    networks: [
      { name: 'Jio', note: '4G and standalone 5G across India' },
      { name: 'Airtel', note: '4G and 5G across India' },
      { name: 'Vi (Vodafone Idea)', note: '4G, with 5G in some cities' },
      { name: 'BSNL', note: 'government operator, 4G rolling out; strong in some rural areas' },
    ],
    towers: [
      { name: 'Tarang Sanchar', url: 'https://tarangsanchar.gov.in/', note: 'official tower locations by operator' },
      { name: 'CellMapper', url: 'https://www.cellmapper.net/', note: 'crowd-sourced tower and signal map; may be out of date' },
    ],
    tip: 'Indoor coverage in concrete buildings is often much weaker than the map shows; test near a window and on the floor you live on.',
  },
  uk: {
    official: [
      { name: 'Ofcom mobile and broadband checker', url: 'https://checker.ofcom.org.uk/', note: 'indoor and outdoor coverage for every network at your postcode (also an app)' },
      { name: 'Ofcom Connected Nations', url: 'https://www.ofcom.org.uk/', note: 'Ofcom\'s yearly report and open data on coverage' },
    ],
    networks: [
      { name: 'EE', note: 'BT\'s network; BT Mobile and others use it' },
      { name: 'VodafoneThree', note: 'Vodafone and Three merged in 2025 and are joining their networks; VOXI, Smarty and others use them' },
      { name: 'O2 (Virgin Media O2)', note: 'giffgaff, Tesco Mobile and Sky Mobile use it' },
    ],
    towers: [
      { name: 'CellMapper', url: 'https://www.cellmapper.net/', note: 'crowd-sourced tower and signal map; may be out of date' },
      { name: 'Shared Rural Network', note: 'the government and operators\' programme to fill rural not-spots; shown on the Ofcom checker' },
    ],
    tip: 'The Ofcom checker gives separate indoor and outdoor answers per network; use the indoor answer for home.',
  },
  us: {
    official: [
      { name: 'FCC National Broadband Map', url: 'https://broadbandmap.fcc.gov/', note: 'mobile coverage by provider and technology at any address; you can challenge it if it is wrong' },
      { name: 'FCC Speed Test app', note: 'in the app stores; its tests feed the FCC\'s coverage checks' },
    ],
    networks: [
      { name: 'Verizon', note: 'national; Visible, Total Wireless and others use it' },
      { name: 'AT&T', note: 'national; Cricket and others use it' },
      { name: 'T-Mobile', note: 'national, including former UScellular areas; Mint and Metro use it' },
    ],
    towers: [
      { name: 'FCC Antenna Structure Registration', url: 'https://www.fcc.gov/uls', note: 'official records of tall towers (search in the FCC licence system)' },
      { name: 'CellMapper', url: 'https://www.cellmapper.net/', note: 'crowd-sourced tower and signal map; may be out of date' },
    ],
    tip: 'Prepaid brands ride on one of the three big networks, so pick the brand by which network is strongest where you are.',
  },
};
