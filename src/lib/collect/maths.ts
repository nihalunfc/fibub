// Maths for the Collecting shelf (coins, banknotes, bullion and any collection). Plain TypeScript, no DOM,
// checked in tests/sci.mjs. Everything here is general fact (units, densities, calendar offsets, grade
// numbers) or plain arithmetic; no price guide, catalogue number or mint table is copied in.
// Nothing here says an item is real or fake: checks give a difference to look into, never a verdict.

// ---------- Weights ----------
/** Grams in one of each unit. Troy ounce, grain and pennyweight are exact by definition; tola is 180 grains. */
export const UNITS: Record<string, { name: string; g: number; note?: string }> = {
  g: { name: 'gram', g: 1 },
  kg: { name: 'kilogram', g: 1000 },
  ozt: { name: 'troy ounce', g: 31.1034768 },
  oz: { name: 'ounce (avoirdupois)', g: 28.349523125 },
  gr: { name: 'grain', g: 0.06479891 },
  dwt: { name: 'pennyweight', g: 1.55517384 },
  tola: { name: 'tola', g: 11.6638038, note: '180 grains; used in India, Pakistan, Nepal and the Gulf' },
  masha: { name: 'masha', g: 11.6638038 / 12, note: 'one twelfth of a tola' },
  ratti: { name: 'ratti', g: 11.6638038 / 96, note: 'one eighth of a masha' },
  sovereign: { name: 'sovereign (pavan)', g: 8, note: 'jewellery unit in South India: 8 grams of gold' },
  baht: { name: 'baht (Thai gold)', g: 15.244, note: 'Thai gold trade weight' },
  tael: { name: 'tael (Hong Kong)', g: 37.429, note: 'Hong Kong gold tael' },
};
export const toGrams = (v: number, unit: string) => v * (UNITS[unit]?.g ?? NaN);
export const fromGrams = (g: number, unit: string) => g / (UNITS[unit]?.g ?? NaN);
export const convertWeight = (v: number, from: string, to: string) => fromGrams(toGrams(v, from), to);

// ---------- Purity ----------
/** Fineness in parts per thousand (999, 925, 916.7) from karat, and back. 24 karat is pure. */
export const karatToFineness = (k: number) => (k / 24) * 1000;
export const finenessToKarat = (f: number) => (f / 1000) * 24;
export const KARATS = [24, 22, 21, 18, 14, 10, 9];
export const FINENESS = [999.9, 999, 995, 958, 950, 925, 917, 916, 900, 835, 800, 750, 585, 500, 417, 375];

// ---------- Melt value ----------
export type Melt = { pureG: number; pureOzt: number; value: number };
/** Pure metal in a piece and what that metal is worth at a spot price per troy ounce. */
export function melt(weightG: number, fineness: number, pricePerOzt: number, count = 1): Melt {
  const pureG = weightG * (fineness / 1000) * count;
  const pureOzt = pureG / UNITS.ozt.g;
  return { pureG, pureOzt, value: pureOzt * pricePerOzt };
}
/** Premium over melt: what was paid against the metal value, as a share of the metal value. */
export const premium = (paid: number, meltValue: number) => (meltValue > 0 ? (paid - meltValue) / meltValue : NaN);
/** Price per gram of pure metal for a bar or coin, to compare products of different sizes. */
export const perPureGram = (price: number, weightG: number, fineness: number) => price / (weightG * fineness / 1000);

// ---------- Density and specific gravity ----------
/** Densities in g/cm³ at room temperature (general physical values, rounded). */
export const DENSITY: Record<string, number> = {
  gold: 19.32, silver: 10.49, copper: 8.96, platinum: 21.45, palladium: 12.02, nickel: 8.91, zinc: 7.14,
  tin: 7.29, aluminium: 2.70, iron: 7.87, lead: 11.34, manganese: 7.21, tungsten: 19.25,
};
/** Common coin and bullion alloys as mass fractions. Typical compositions; real coins vary a little. */
export const ALLOYS: Record<string, { name: string; parts: Record<string, number> }> = {
  'gold-999': { name: 'Fine gold (999)', parts: { gold: 0.999, silver: 0.001 } },
  'gold-917': { name: '22 karat gold (916.7, copper)', parts: { gold: 0.9167, copper: 0.0833 } },
  'gold-900': { name: 'Coin gold 900 (copper)', parts: { gold: 0.9, copper: 0.1 } },
  'gold-750': { name: '18 karat gold (silver and copper)', parts: { gold: 0.75, silver: 0.125, copper: 0.125 } },
  'gold-585': { name: '14 karat gold (silver and copper)', parts: { gold: 0.585, silver: 0.205, copper: 0.21 } },
  'silver-999': { name: 'Fine silver (999)', parts: { silver: 0.999, copper: 0.001 } },
  'silver-925': { name: 'Sterling silver (925)', parts: { silver: 0.925, copper: 0.075 } },
  'silver-900': { name: 'Coin silver 900', parts: { silver: 0.9, copper: 0.1 } },
  'silver-800': { name: 'Silver 800', parts: { silver: 0.8, copper: 0.2 } },
  'silver-500': { name: 'Silver 500', parts: { silver: 0.5, copper: 0.5 } },
  'platinum-9995': { name: 'Platinum 999.5', parts: { platinum: 0.9995, palladium: 0.0005 } },
  cupronickel: { name: 'Cupronickel 75/25', parts: { copper: 0.75, nickel: 0.25 } },
  'nordic-gold': { name: 'Nordic gold (89 Cu, 5 Al, 5 Zn, 1 Sn)', parts: { copper: 0.89, aluminium: 0.05, zinc: 0.05, tin: 0.01 } },
  brass: { name: 'Brass 70/30', parts: { copper: 0.7, zinc: 0.3 } },
  bronze: { name: 'Bronze (95 Cu, 4 Sn, 1 Zn)', parts: { copper: 0.95, tin: 0.04, zinc: 0.01 } },
  copper: { name: 'Copper', parts: { copper: 1 } },
  nickel: { name: 'Nickel', parts: { nickel: 1 } },
  aluminium: { name: 'Aluminium', parts: { aluminium: 1 } },
  'steel': { name: 'Steel (iron)', parts: { iron: 1 } },
};
/** Density of a mix from mass fractions, assuming the volumes add (close for these alloys, within about 1%). */
export function alloyDensity(parts: Record<string, number>) {
  let sum = 0, inv = 0;
  for (const [m, w] of Object.entries(parts)) { const d = DENSITY[m]; if (!d) return NaN; sum += w; inv += w / d; }
  return sum / inv;
}
/** Density of water in g/cm³ at a temperature in °C (fit good to 0.0001 between 0 and 40 °C). */
export function waterDensity(tC = 20) {
  const t = tC;
  return 1 - ((t + 288.9414) * (t - 3.9863) ** 2) / (508929.2 * (t + 68.12963));
}
/** Hydrostatic weighing: weight in air and weight while hanging in water give the density. */
export function specificGravity(airG: number, waterG: number, tC = 20) {
  const lost = airG - waterG;
  const sg = airG / lost;
  return { sg, density: sg * waterDensity(tC), volume: lost / waterDensity(tC) };
}
/** Gold share of a two-metal piece from its density (gold with copper or silver), by the mixing rule. */
export function shareFromDensity(density: number, a: string, b: string) {
  const da = DENSITY[a], db = DENSITY[b];
  // 1/ρ = w/da + (1-w)/db  ->  w = (1/ρ - 1/db) / (1/da - 1/db)
  return (1 / density - 1 / db) / (1 / da - 1 / db);
}

// ---------- Tolerance checks ----------
export type Diff = { diff: number; pct: number; within: boolean };
/** Measured against the official figure. `tolPct` is the allowed difference in per cent (the mint's own, or a guide). */
export function tolerance(measured: number, spec: number, tolPct = 1): Diff {
  const diff = measured - spec, pct = (diff / spec) * 100;
  return { diff, pct, within: Math.abs(pct) <= tolPct + 1e-9 };
}
/** Volume of a plain disc (no relief) in cm³ from diameter and thickness in mm: a floor for the weight. */
export const discVolume = (diaMm: number, thickMm: number) => (Math.PI * (diaMm / 2) ** 2 * thickMm) / 1000;

// ---------- Stats for a group of coins ----------
export function stats(xs: number[]) {
  const v = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  const n = v.length;
  if (!n) return { n: 0, mean: NaN, sd: NaN, median: NaN, min: NaN, max: NaN, cv: NaN };
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : 0;
  const median = n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2;
  return { n, mean, sd, median, min: v[0], max: v[n - 1], cv: mean ? (sd / mean) * 100 : NaN };
}
/** Equal-width bins between min and max for a histogram. */
export function histogram(xs: number[], bins = 10) {
  const v = xs.filter((x) => Number.isFinite(x));
  if (!v.length) return [];
  const lo = Math.min(...v), hi = Math.max(...v), w = (hi - lo) / bins || 1;
  const out = Array.from({ length: bins }, (_, i) => ({ from: lo + i * w, to: lo + (i + 1) * w, n: 0 }));
  for (const x of v) out[Math.min(bins - 1, Math.floor((x - lo) / w))].n++;
  return out;
}

// ---------- Die axis ----------
/** Clock notation (12 = coin turn, 6 = medal turn... as written by collectors) to degrees: 12 h = 0°, each hour 30°. */
export const clockToDeg = (h: number) => ((h % 12) * 30 + 360) % 360;
export const degToClock = (d: number) => { const h = Math.round((((d % 360) + 360) % 360) / 30) % 12; return h === 0 ? 12 : h; };
/** Circular mean and spread of angles in degrees. r is 1 when all agree and near 0 when they are scattered. */
export function circular(degs: number[]) {
  const n = degs.length;
  if (!n) return { n: 0, mean: NaN, r: NaN, sd: NaN };
  let s = 0, c = 0;
  for (const d of degs) { s += Math.sin((d * Math.PI) / 180); c += Math.cos((d * Math.PI) / 180); }
  const r = Math.hypot(s, c) / n;
  const mean = ((Math.atan2(s, c) * 180) / Math.PI + 360) % 360;
  const sd = r > 0 ? (Math.sqrt(-2 * Math.log(r)) * 180) / Math.PI : Infinity;
  return { n, mean, r, sd };
}

// ---------- Grades ----------
/** The 1 to 70 numbers used for coins, with the usual words and the usual British/European equivalents. */
export const GRADES: { lo: number; hi: number; us: string; abbr: string; uk: string; fr: string; de: string }[] = [
  { lo: 1, hi: 1, us: 'Poor', abbr: 'P', uk: 'Poor', fr: 'B (Beau)', de: 'S (Schön)' },
  { lo: 2, hi: 2, us: 'Fair', abbr: 'FR', uk: 'Fair', fr: 'B (Beau)', de: 'S (Schön)' },
  { lo: 3, hi: 3, us: 'About Good', abbr: 'AG', uk: 'Fair', fr: 'B (Beau)', de: 'S (Schön)' },
  { lo: 4, hi: 6, us: 'Good', abbr: 'G', uk: 'Good', fr: 'TB (Très Beau)', de: 'S-SS' },
  { lo: 8, hi: 10, us: 'Very Good', abbr: 'VG', uk: 'Very Good', fr: 'TB (Très Beau)', de: 'S-SS' },
  { lo: 12, hi: 15, us: 'Fine', abbr: 'F', uk: 'Fine', fr: 'TTB (Très Très Beau)', de: 'SS (Sehr schön)' },
  { lo: 20, hi: 35, us: 'Very Fine', abbr: 'VF', uk: 'Very Fine', fr: 'TTB (Très Très Beau)', de: 'SS (Sehr schön)' },
  { lo: 40, hi: 45, us: 'Extremely Fine', abbr: 'EF / XF', uk: 'Extremely Fine', fr: 'SUP (Superbe)', de: 'VZ (Vorzüglich)' },
  { lo: 50, hi: 58, us: 'About Uncirculated', abbr: 'AU', uk: 'Good Extremely Fine to about Unc', fr: 'SPL (Splendide)', de: 'VZ-ST' },
  { lo: 60, hi: 70, us: 'Mint State (Uncirculated)', abbr: 'MS / UNC', uk: 'Uncirculated', fr: 'FDC (Fleur de Coin)', de: 'ST (Stempelglanz)' },
];
export const gradeFor = (n: number) => GRADES.find((g) => n >= g.lo && n <= g.hi) ?? GRADES.reduce((a, g) => (Math.abs(g.lo - n) < Math.abs(a.lo - n) ? g : a));
/** Numbers in use on the 1 to 70 scale. */
export const SHELDON = [1, 2, 3, 4, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 53, 55, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];

// ---------- Card and stamp centring ----------
/** Left/right (or top/bottom) border widths to a split such as 55/45 (the larger side first). */
export function centring(a: number, b: number) {
  const t = a + b; if (!(t > 0)) return { big: NaN, small: NaN, label: '' };
  const big = Math.round((Math.max(a, b) / t) * 100), small = 100 - big;
  return { big, small, label: `${big}/${small}` };
}

// ---------- Banknote serial patterns ----------
export type SerialHit = { id: string; name: string };
/** Patterns collectors look for in a serial number's digits. Letters are ignored. */
export function serialPatterns(serial: string): SerialHit[] {
  const d = serial.replace(/\D/g, '');
  const hits: SerialHit[] = [];
  if (d.length < 4) return hits;
  const add = (id: string, name: string) => hits.push({ id, name });
  const asc = '01234567890123456789', desc = '98765432109876543210';
  if (/^(\d)\1+$/.test(d)) add('solid', 'Solid: every digit the same');
  if (asc.includes(d) || desc.includes(d)) add('ladder', 'Ladder: digits count up or down in order');
  if (d === [...d].reverse().join('')) add('radar', 'Radar: reads the same both ways');
  if (d.length >= 6 && /^(\d)\1*$/.test(d.slice(1, -1)) && d[0] === d[d.length - 1] && d[0] !== d[1]) add('super-radar', 'Super radar: same digit inside, another at both ends');
  for (let k = 2; k <= d.length / 2; k++) if (d.length % k === 0 && d === d.slice(0, k).repeat(d.length / k) && !/^(\d)\1+$/.test(d)) { add('repeater', `Repeater: ${d.slice(0, k)} repeated`); break; }
  if (d.length % 2 === 0 && d.slice(0, d.length / 2) === d.slice(d.length / 2) && !hits.some((h) => h.id === 'repeater' || h.id === 'solid')) add('repeater', 'Repeater: first half repeated');
  if (/^[01]+$/.test(d) && !/^(\d)\1+$/.test(d)) add('binary', 'Binary: only 0s and 1s');
  else if (new Set(d).size === 2 && !hits.length) add('two-digit', 'Two digits only');
  const n = Number(d);
  if (n > 0 && n <= 100) add('low', 'Low number: 100 or under');
  else if (n > 0 && n <= 1000) add('low', 'Low number: 1000 or under');
  if (/^[1-9]0+$/.test(d)) add('round', 'Round number: one digit then all zeros');
  if (/^(\d)\1{2,}/.test(d) && !/^(\d)\1+$/.test(d) && /^(\d)\1{3,}/.test(d)) add('run', 'Starts with a run of 4 or more of one digit');
  return hits;
}

// ---------- Old money ----------
/** British pounds, shillings and pence: 12 pence to a shilling, 20 shillings to a pound (until 15 Feb 1971). */
export const lsdToPence = (l: number, s: number, d: number) => l * 240 + s * 12 + d;
export const penceToLsd = (pence: number) => ({ l: Math.floor(pence / 240), s: Math.floor((pence % 240) / 12), d: +(pence % 12).toFixed(2) });
/** Old pence to new (decimal) pence: 240 old pence = 100 new pence. */
export const oldToNewPence = (pence: number) => (pence * 100) / 240;
/** Indian rupee before 1957: 16 annas, 64 pice, 192 pies to a rupee; after 1957, 100 naye paise. */
export const rapToPies = (r: number, a: number, p: number, pie = 0) => r * 192 + a * 12 + p * 3 + pie;
export const piesToRupees = (pies: number) => pies / 192;

// ---------- Calendar eras on coins ----------
/** Year offsets: era year + add = common era year. Many eras start part way through the CE year, so a year
 *  usually falls across two CE years; `span` is 1 when that happens. */
export const ERAS: Record<string, { name: string; add: number; span: 0 | 1; note: string }> = {
  vs: { name: 'Vikram Samvat (VS)', add: -57, span: 1, note: 'Year starts in spring (Chaitra) in the north or autumn (Kartika) in Gujarat; VS minus 57 or 56.' },
  saka: { name: 'Saka era (Shaka)', add: 78, span: 1, note: 'Indian national calendar; year starts on 22 March (21 in leap years).' },
  kollam: { name: 'Kollam era (Malayalam Era, ME / KE)', add: 824, span: 1, note: 'Kerala; year starts in August or September (Chingam).' },
  bengali: { name: 'Bengali San (BS)', add: 593, span: 1, note: 'Year starts in mid April (Boishakh).' },
  fasli: { name: 'Fasli (Deccan)', add: 590, span: 1, note: 'Revenue year used in the Deccan and south; offsets differ by region, so treat as a guide.' },
  thai: { name: 'Thai Buddhist Era (BE)', add: -543, span: 0, note: 'Since 1941 the Thai year starts on 1 January.' },
  roc: { name: 'Republic of China (Minguo)', add: 1911, span: 0, note: 'Year 1 = 1912.' },
  am: { name: 'Hebrew year (AM)', add: -3761, span: 1, note: 'Year starts in September or October (Rosh Hashanah); AM minus 3761 or 3760.' },
  sh: { name: 'Solar Hijri (Iran, Afghanistan)', add: 621, span: 1, note: 'Year starts on 20 or 21 March (Nowruz).' },
  ethiopian: { name: 'Ethiopian year (EE)', add: 7, span: 1, note: 'Year starts on 11 or 12 September.' },
  nepal: { name: 'Nepal Samvat (NS)', add: 879, span: 1, note: 'Year starts in October or November.' },
};
/** Japanese eras since 1868: CE = start + year - 1. */
export const JAPAN: { name: string; start: number }[] = [
  { name: 'Meiji', start: 1868 }, { name: 'Taishō', start: 1912 }, { name: 'Shōwa', start: 1926 }, { name: 'Heisei', start: 1989 }, { name: 'Reiwa', start: 2019 },
];
/** Common-era year(s) for an era year. */
export function eraToCe(era: string, y: number): [number, number] {
  if (era === 'ah') return ahToCe(y);
  const jp = JAPAN.find((j) => j.name.toLowerCase() === era.toLowerCase());
  if (jp) return [jp.start + y - 1, jp.start + y - 1];
  const e = ERAS[era];
  return [y + e.add, y + e.add + e.span];
}
/** Islamic (Hijri, AH) year to CE years it overlaps. Uses the arithmetic (tabular) calendar: day 1 of AH 1 =
 *  16 July 622 (Julian), 30-year cycle of 10,631 days. Actual start can be a day or two different by sighting. */
export function ahStartJd(y: number) {
  const days = Math.floor((10631 * (y - 1) + 14) / 30); // days before year y in the tabular calendar
  return 1948439.5 + days;
}
export function jdToGregorian(jd: number) {
  const z = Math.floor(jd + 0.5), a0 = Math.floor((z - 1867216.25) / 36524.25);
  const a = z < 2299161 ? z : z + 1 + a0 - Math.floor(a0 / 4);
  const b = a + 1524, c = Math.floor((b - 122.1) / 365.25), d = Math.floor(365.25 * c), e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e), month = e < 14 ? e - 1 : e - 13, year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day };
}
export function ahToCe(y: number): [number, number] {
  const s = jdToGregorian(ahStartJd(y)), e = jdToGregorian(ahStartJd(y + 1) - 1);
  return [s.year, e.year];
}
export const ahStart = (y: number) => jdToGregorian(ahStartJd(y));
/** CE year to AH year(s) in it. */
export function ceToAh(ce: number): [number, number] {
  const guess = Math.floor((ce - 622) * 1.030684) + 1;
  const ys = [guess - 1, guess, guess + 1, guess + 2].filter((y) => { const [a, b] = ahToCe(y); return a <= ce && b >= ce; });
  return [ys[0], ys[ys.length - 1]];
}

// ---------- Roman numerals (dates on medals) ----------
export function fromRoman(s: string) {
  const v: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const u = s.toUpperCase().replace(/[^IVXLCDM]/g, '');
  let n = 0;
  for (let i = 0; i < u.length; i++) { const a = v[u[i]], b = v[u[i + 1]] ?? 0; n += a < b ? -a : a; }
  return n;
}
export function toRoman(n: number) {
  const t: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; } return s;
}

// ---------- Auction and selling costs ----------
/** What a buyer pays: hammer + buyer's premium (+ tax on the premium or on all) + shipping. Rates as fractions. */
export function buyerTotal(hammer: number, bp: number, tax: number, ship = 0, taxOnAll = false) {
  const prem = hammer * bp, taxAmt = (taxOnAll ? hammer + prem : prem) * tax;
  return { premium: prem, tax: taxAmt, total: hammer + prem + taxAmt + ship };
}
/** What a seller receives: hammer - commission - fees (listing, photo, insurance). */
export function sellerNet(hammer: number, commission: number, fees = 0, taxOnCommission = 0) {
  const comm = hammer * commission, t = comm * taxOnCommission;
  return { commission: comm, tax: t, net: hammer - comm - t - fees };
}
/** Highest bid that keeps the buyer's total under a budget. */
export const maxBid = (budget: number, bp: number, tax: number, ship = 0, taxOnAll = false) =>
  (budget - ship) / (1 + bp + (taxOnAll ? (1 + bp) * tax : bp * tax));

// ---------- Coin counting by weight ----------
/** How many coins from a total weight, given the weight of one (and of the empty container). */
export const coinsFromWeight = (totalG: number, eachG: number, tareG = 0) => (totalG - tareG) / eachG;

// ---------- Upgrade additions (batch D) ----------
/** Buyer's premium with a higher (or lower) rate on the part of the hammer price above a threshold. Rates as fractions. */
export const tieredPremium = (hammer: number, baseRate: number, threshold = 0, upperRate = baseRate) =>
  !(threshold > 0) || hammer <= threshold ? hammer * baseRate : threshold * baseRate + (hammer - threshold) * upperRate;
/** Hammer price a seller needs so that, after commission, its tax and fixed fees, they receive `net`. */
export const hammerForNet = (net: number, commission: number, fees = 0, taxOnCommission = 0) =>
  (net + fees) / (1 - commission * (1 + taxOnCommission));
/** Spot price (per troy ounce of pure metal) at which selling back at `payout` (a fraction of melt) just returns what you paid. */
export const breakEvenSpot = (pricePaid: number, pureOzt: number, payout = 1) => pricePaid / (pureOzt * payout);
/** Value of the pure metal in a piece, from its weight in grams, fineness and a price per gram of pure metal. */
export const pieceValue = (weightG: number, fineness: number, pricePerPureGram: number) => (weightG * fineness / 1000) * pricePerPureGram;
/** Weight a solid piece of a given density should show hanging in water (grams), from its weight in air. */
export const expectedWaterWeight = (airG: number, density: number, tC = 20) => airG * (1 - waterDensity(tC) / density);
/** Density from weight and a measured disc (diameter and thickness in mm). */
export const densityFromDisc = (weightG: number, diaMm: number, thickMm: number) => weightG / discVolume(diaMm, thickMm);

// ---------- Upgrades: grade words, serial extras, old-money lists, dates, centring, catalogue (added 2026-11-16) ----------
const plainText = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
/** Grades whose US word, abbreviation, UK, French or German term contains the typed text (case and accent blind). */
export function gradesByWord(text: string) {
  const t = plainText(text.trim());
  if (!t) return [];
  return GRADES.filter((g) => [g.us, g.abbr, g.uk, g.fr, g.de].some((w) => plainText(w).includes(t)));
}
/** Compare two numbers on the scale: the bands they fall in and how far apart they are. */
export function compareGrades(a: number, b: number) {
  const ga = gradeFor(a), gb = gradeFor(b);
  const na = SHELDON.indexOf(a), nb = SHELDON.indexOf(b);
  return { ga, gb, sameBand: ga === gb, bandsApart: Math.abs(GRADES.indexOf(ga) - GRADES.indexOf(gb)), stepsApart: na >= 0 && nb >= 0 ? Math.abs(na - nb) : NaN, numberGap: Math.abs(a - b), higher: a === b ? '' : a > b ? 'a' : 'b' };
}

/** Split pasted serial numbers on new lines, commas, semicolons or tabs. */
export const splitSerials = (text: string) => text.split(/[\n,;\t]+/).map((s) => s.trim()).filter(Boolean);
/** More patterns on top of serialPatterns: near solid, rotator, four in a row, part ladder, date-like. Digits only. */
export function serialExtras(serial: string): SerialHit[] {
  const d = serial.replace(/\D/g, '');
  const hits: SerialHit[] = [];
  if (d.length < 5) return hits;
  const add = (id: string, name: string) => hits.push({ id, name });
  const counts: Record<string, number> = {};
  for (const c of d) counts[c] = (counts[c] || 0) + 1;
  if (d.length >= 6 && Math.max(...Object.values(counts)) === d.length - 1) add('near-solid', 'Near solid: all but one digit the same');
  const flip: Record<string, string> = { '0': '0', '1': '1', '6': '9', '8': '8', '9': '6' };
  if ([...d].every((c) => flip[c]) && d === [...d].reverse().map((c) => flip[c]).join('') && !/^(\d)\1+$/.test(d)) add('rotator', 'Rotator: reads the same turned upside down');
  if (/(\d)\1{3,}/.test(d) && !/^(\d)\1+$/.test(d)) add('four-run', 'Four or more of one digit in a row');
  const up = '01234567890', dn = '98765432109';
  if (!(up.includes(d) || dn.includes(d))) {
    for (let i = 0; i + 5 <= d.length; i++) {
      const w = d.slice(i, i + 5);
      if (up.includes(w) || dn.includes(w)) { add('part-ladder', `Part ladder: ${w} counts ${up.includes(w) ? 'up' : 'down'}`); break; }
    }
  }
  if (d.length === 8) {
    const dd = +d.slice(0, 2), mm = +d.slice(2, 4), yy = +d.slice(4);
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 1900 && yy <= 2100) add('date', `Looks like a date: ${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`);
  }
  return hits;
}

/** Read an old British amount into old pence: "2 5 6", "2/5/6", "£2 5s 6d", "5s 6d", "10/-", "6d". NaN if unreadable. */
export function parseLsd(text: string): number {
  let t = text.toLowerCase().trim().replace(/£\s*(\d+(?:\.\d+)?)/, '$1l').replace(/\s+/g, ' ');
  if (!t) return NaN;
  if (/[lsd]/.test(t)) {
    const re = /(\d+(?:\.\d+)?)\s*([lsd])\b\s*/y; let p = 0, tot = 0, seen = '';
    while (p < t.length) {
      re.lastIndex = p; const m = re.exec(t); if (!m || seen.includes(m[2])) return NaN;
      seen += m[2]; tot += +m[1] * (m[2] === 'l' ? 240 : m[2] === 's' ? 12 : 1); p = re.lastIndex;
    }
    return tot;
  }
  if (t.includes('/')) {
    const parts = t.split('/').map((x) => x.trim());
    if (parts.length > 3 || parts.some((x) => !(x === '-' || /^\d+(\.\d+)?$/.test(x)))) return NaN;
    const n = parts.map((x) => (x === '-' ? 0 : +x));
    return n.length === 3 ? lsdToPence(n[0], n[1], n[2]) : lsdToPence(0, n[0], n[1]);
  }
  const three = t.match(/^(\d+) (\d+) (\d+(?:\.\d+)?)$/);
  return three ? lsdToPence(+three[1], +three[2], +three[3]) : NaN;
}
/** Total old pence of several lines (blank lines skipped) and the line numbers that could not be read. */
export function sumLsd(lines: string[]) {
  let total = 0, ok = 0; const bad: number[] = [];
  lines.forEach((l, i) => { if (!l.trim()) return; const p = parseLsd(l); if (Number.isFinite(p)) { total += p; ok++; } else bad.push(i + 1); });
  return { total, ok, bad };
}

/** Turn typed Arabic-Indic or Devanagari digits into 0-9, so a year can be copied off a coin. */
export function westernDigits(s: string) {
  return s.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x6f0)).replace(/[०-९]/g, (c) => String(c.charCodeAt(0) - 0x966));
}
/** Whole years between a coin's common-era year and a given year (never negative). */
export const yearsSince = (ce: number, now: number) => Math.max(0, now - ce);

/** Which way a pair of borders leans: offset from centre in per cent of the total, and the side the picture sits toward. */
export function centringLean(a: number, b: number, names: [string, string] = ['left', 'right']) {
  const t = a + b; if (!(t > 0) || a < 0 || b < 0) return { offset: NaN, toward: '' };
  return { offset: (Math.abs(a - b) / t) * 100, toward: a === b ? '' : a > b ? names[1] : names[0] };
}
/** How far to move the picture to centre it (half the difference between the two borders). */
export const centringShift = (a: number, b: number) => Math.abs(a - b) / 2;
/** The weakest split of several border pairs. */
export function worstCentring(...pairs: [number, number][]) {
  const rs = pairs.map(([a, b]) => centring(a, b)).filter((r) => r.label);
  return rs.length ? rs.reduce((w, r) => (r.big > w.big ? r : w)) : null;
}

/** Average and spread of several readings of one weight (separated by lines, spaces or commas). */
export function readings(text: string) {
  const xs = text.split(/[\s,;]+/).map(parseFloat).filter((x) => Number.isFinite(x) && x > 0);
  const s = stats(xs);
  return { n: s.n, mean: s.mean, sd: s.sd, min: s.min, max: s.max };
}

/** Minimal CSV reader (quotes, commas, new lines) for reading a list back in. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  const t = text.replace(/^﻿/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cell += c;
  }
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
/** Group items by a key and add up entries, count, paid and value (missing values count as 0). */
export function totalsBy<T extends { qty?: number; cost?: number; value?: number }>(items: T[], key: (i: T) => string | undefined) {
  const m = new Map<string, { key: string; entries: number; count: number; cost: number; value: number }>();
  for (const i of items) {
    const k = key(i) || 'Not set';
    const r = m.get(k) ?? { key: k, entries: 0, count: 0, cost: 0, value: 0 };
    r.entries++; r.count += i.qty ?? 1; r.cost += Number.isFinite(i.cost) ? (i.cost as number) : 0; r.value += Number.isFinite(i.value) ? (i.value as number) : 0;
    m.set(k, r);
  }
  return [...m.values()].sort((a, b) => b.value - a.value || b.count - a.count);
}
