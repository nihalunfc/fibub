// Tyre size maths (fibub, #T940 and other tyre tools). Plain TypeScript, no DOM.
// Reads the size code moulded on a tyre's sidewall (205/55 R16 91V, LT245/75R16 120/116S, 33x12.50R15,
// 90/90-12 54J, 3.00-18 47P, 295/80R22.5 152/148M, 10.00-20 16PR ...) and works out its sizes.
// Load index and speed symbol values follow the ISO 4000 / ETRTO tables, as checked November 2026.

/** Load index -> kg per tyre (ISO 4000 / ETRTO), 0 to 170. Every 80 steps is ten times the load. */
export const LOAD_KG: Record<number, number> = (() => {
  const base = [ // load index 80 to 159
    450, 462, 475, 487, 500, 515, 530, 545, 560, 580, 600, 615, 630, 650, 670, 690, 710, 730, 750, 775,
    800, 825, 850, 875, 900, 925, 950, 975, 1000, 1030, 1060, 1090, 1120, 1150, 1180, 1215, 1250, 1285, 1320, 1360,
    1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2060, 2120, 2180, 2240, 2300, 2360, 2430,
    2500, 2575, 2650, 2725, 2800, 2900, 3000, 3075, 3150, 3250, 3350, 3450, 3550, 3650, 3750, 3875, 4000, 4125, 4250, 4375,
  ];
  const t: Record<number, number> = {};
  base.forEach((kg, i) => {
    t[i + 80] = kg;
    // 0 to 79 are a tenth (the published table drops the half kilo above 100 kg)
    const low = kg / 10; t[i] = low >= 100 ? Math.floor(low) : low;
  });
  for (let i = 160; i <= 170; i++) t[i] = t[i - 80] * 10;
  return t;
})();

/** Speed symbol -> top rated speed in km/h. 'Y)' stands for (Y): over 300 km/h. */
export const SPEED_KMH: Record<string, number> = {
  A1: 5, A2: 10, A3: 15, A4: 20, A5: 25, A6: 30, A7: 35, A8: 40, B: 50, C: 60, D: 65, E: 70, F: 80, G: 90,
  J: 100, K: 110, L: 120, M: 130, N: 140, P: 150, Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300,
};

export const MM_PER_IN = 25.4;
export const KM_PER_MI = 1.609344;
export const LB_PER_KG = 2.2046226;

export type Construction = 'radial' | 'bias' | 'belted';
export type PartKey = 'prefix' | 'width' | 'aspect' | 'construction' | 'rim' | 'load' | 'speed' | 'ply';
export interface Part { text: string; key?: PartKey }

export interface TyreSize {
  kind: 'metric' | 'flotation' | 'inch';
  prefix: '' | 'P' | 'LT' | 'ST' | 'T';
  widthMm: number;
  /** Sidewall height as a percentage of the width. */
  aspect: number;
  /** True when the code gives no aspect ratio and a usual one was assumed. */
  aspectAssumed: boolean;
  sidewallMm: number;
  rimIn: number;
  diameterMm: number;
  construction: Construction;
  /** ZR (or VR, HR, WR): an older way of showing a high speed rating inside the size. */
  zr: string;
  commercial: boolean;
  extraLoad: boolean;
  load?: number;
  /** Second load index for twin (dual) wheels, as in 120/116. */
  load2?: number;
  speed?: string;
  /** (Y) or (94Y): rated over 300 km/h. */
  speedOver: boolean;
  ply?: number;
  /** The code written out neatly, split into coloured parts. */
  parts: Part[];
}

const CONSTR: Record<string, Construction> = { R: 'radial', D: 'bias', '-': 'bias', B: 'belted' };

/** Read a tyre size code. Returns null when it cannot be read. */
export function parseTyre(input: string): TyreSize | null {
  let s = String(input || '').toUpperCase().replace(/[×]/g, 'X').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  let ply: number | undefined;
  s = s.replace(/(\d{1,2})\s*P\.?\s*R\b/, (_, p) => { ply = +p; return ' '; });
  const extraLoad = /\b(XL|EXTRA LOAD|REINF(ORCED)?)\b/.test(s);
  s = s.replace(/\b(M\/C|MC|TL|TT|XL|SL|EXTRA LOAD|REINF(ORCED)?|M\+S|M&S|RUN ?FLAT|RFT)\b/g, ' ').replace(/\s+/g, ' ').trim();

  let t: Omit<TyreSize, 'parts' | 'load' | 'load2' | 'speed' | 'speedOver' | 'ply' | 'extraLoad'> | null = null;
  let rest = '';
  const prefixes: Part[] = [];
  // Flotation: 33x12.50R15 (overall diameter x width in inches, then rim)
  let m = s.match(/^(LT)?\s*(\d{2}(?:\.\d+)?)\s*X\s*(\d{1,2}(?:\.\d+)?)\s*(R|D|B|-)?\s*(\d{1,2}(?:\.\d)?)\s*(LT)?(.*)$/);
  if (m) {
    const dia = +m[2] * MM_PER_IN, w = +m[3] * MM_PER_IN, rim = +m[5];
    const side = (dia - rim * MM_PER_IN) / 2;
    if (side <= 0 || rim < 8) return null;
    t = { kind: 'flotation', prefix: m[1] || m[6] ? 'LT' : '', widthMm: w, aspect: side / w * 100, aspectAssumed: false, sidewallMm: side,
      rimIn: rim, diameterMm: dia, construction: CONSTR[m[4] || 'R'], zr: '', commercial: false };
    rest = m[7];
    if (m[1]) prefixes.push({ text: 'LT', key: 'prefix' });
    prefixes.push({ text: m[2], key: 'width' }, { text: 'x' }, { text: m[3], key: 'width' }, { text: m[4] || 'R', key: 'construction' }, { text: String(rim), key: 'rim' });
    if (m[6]) prefixes.push({ text: 'LT', key: 'prefix' });
  } else {
    // Metric (205/55 R16), P-metric, LT, truck (295/80R22.5), bike (120/70 ZR17, 90/90-12) or inch (3.00-18, 10.00-20, 11R22.5)
    m = s.match(/^(P|LT|ST|T)?\s*(\d{1,3}(?:\.\d{1,2})?)\s*(?:\/\s*(\d{2,3}(?:\.\d)?))?\s*([ZVHW](?=\s*R))?\s*(R|D|B|-)\s*(\d{1,2}(?:\.\d)?)\s*(C\b|C(?=\s|\d|\()|LT\b)?(.*)$/);
    if (!m) return null;
    const wNum = +m[2], inch = wNum < 30, rim = +m[6];
    if (!(wNum > 0) || !(rim >= 5 && rim <= 30)) return null;
    const construction = CONSTR[m[5]];
    const widthMm = inch ? wNum * MM_PER_IN : wNum;
    let aspect = m[3] ? +m[3] : NaN, aspectAssumed = false;
    if (!isFinite(aspect)) { aspect = inch ? (construction === 'radial' ? 90 : 100) : 82; aspectAssumed = true; }
    if (aspect < 15 || aspect > 120) return null;
    const side = widthMm * aspect / 100;
    t = { kind: inch ? 'inch' : 'metric', prefix: (m[1] || '') as TyreSize['prefix'], widthMm, aspect, aspectAssumed, sidewallMm: side, rimIn: rim,
      diameterMm: rim * MM_PER_IN + 2 * side, construction, zr: m[4] ? m[4] + 'R' : '', commercial: m[7] === 'C' };
    if (m[7] === 'LT') t.prefix = 'LT';
    rest = m[8];
    if (m[1]) prefixes.push({ text: m[1], key: 'prefix' });
    prefixes.push({ text: m[2], key: 'width' });
    if (m[3]) prefixes.push({ text: '/' }, { text: m[3], key: 'aspect' });
    if (m[5] !== '-') prefixes.push({ text: ' ' });
    prefixes.push({ text: (m[4] || '') + m[5], key: 'construction' }, { text: m[6], key: 'rim' });
    if (m[7]) prefixes.push({ text: m[7], key: 'prefix' });
  }
  // Service description: load index (or 120/116 for single/dual) then speed symbol, maybe in brackets.
  const parts = prefixes;
  let load: number | undefined, load2: number | undefined, speed: string | undefined, speedOver = false;
  const r = rest.trim();
  const sm = r.match(/^\(?\s*(\d{2,3})?\s*(?:\/\s*(\d{2,3}))?\s*(\(Y\)|A[1-8]|[B-HJ-NP-WY])?\s*(\))?/);
  if (sm && (sm[1] || sm[3])) {
    const bracket = r.startsWith('(') && !!sm[4];
    if (sm[1] && LOAD_KG[+sm[1]] !== undefined) load = +sm[1];
    if (sm[2] && LOAD_KG[+sm[2]] !== undefined) load2 = +sm[2];
    if (sm[3]) {
      speed = sm[3].replace(/[()]/g, '');
      speedOver = sm[3] === '(Y)' || (bracket && speed === 'Y');
    }
    parts.push({ text: ' ' });
    if (bracket) parts.push({ text: '(' });
    if (load !== undefined) parts.push({ text: String(load) + (load2 !== undefined ? '/' + load2 : ''), key: 'load' });
    if (speed) parts.push({ text: speedOver && !bracket ? '(Y)' : speed, key: 'speed' });
    if (bracket) parts.push({ text: ')' });
  }
  if (ply) parts.push({ text: ' ' }, { text: ply + 'PR', key: 'ply' });
  return { ...t, extraLoad, load, load2, speed, speedOver, ply, parts };
}

/** kg a load index carries, or undefined. */
export const loadKg = (li?: number) => (li === undefined ? undefined : LOAD_KG[li]);
/** Top rated speed in km/h, or undefined. */
export const speedKmh = (sym?: string) => (sym ? SPEED_KMH[sym] : undefined);

/** Distance round the tyre (mm) and turns per km. */
export const circumferenceMm = (t: TyreSize) => Math.PI * t.diameterMm;
export const revsPerKm = (t: TyreSize) => 1e6 / circumferenceMm(t);

export interface Comparison { diffPct: number; trueSpeed: (shown: number) => number; withinPct: boolean }
/** Compare a new size with the original. The speedometer was set for the original, so the true speed scales with diameter. */
export function compareTyres(orig: TyreSize, other: TyreSize, limitPct = 3): Comparison {
  const ratio = other.diameterMm / orig.diameterMm;
  const diffPct = (ratio - 1) * 100;
  return { diffPct, trueSpeed: (shown) => shown * ratio, withinPct: Math.abs(diffPct) <= limitPct };
}
