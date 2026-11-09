// Colony counts to CFU per mL (or per g), and colonies counted from a plate photo. No DOM.
//
// Dilution maths: every plate i got a volume V_i (mL) of a dilution d_i (a fraction, such as 10⁻⁵) of the sample and
// grew C_i colonies. If the sample holds N CFU per mL, C_i is a Poisson count with mean N·V_i·d_i, so the best
// estimate from the plates in the countable range is N = ΣC / Σ(V·d) (the weighted mean: plates that saw more of the
// sample count for more). Its confidence interval is the exact (Garwood) Poisson interval of ΣC divided by Σ(V·d).
// A chi-square test asks whether the plates agree with each other as well as Poisson counting alone allows.
//
// Photo: the plate is a circle; the agar background is evened out with a local mean, colonies are pixels brighter (or
// darker) than the agar by more than a threshold, joined into blobs, filtered by size, and blobs bigger than a single
// colony are split at the peaks of their distance map ("watershed lite"). A made-up plate is drawn here for the example.
import { logGamma } from './stats.ts';

// ---------------------------------------------------------------- Poisson and chi-square

/** Regularised lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (!(x > 0)) return 0;
  if (!Number.isFinite(x)) return 1;
  const lg = a * Math.log(x) - x - logGamma(a);
  if (x < a + 1) {
    let s = 1 / a, t = s;
    for (let n = 1; n < 2000; n++) { t *= x / (a + n); s += t; if (Math.abs(t) < Math.abs(s) * 1e-16) break; }
    return Math.min(1, s * Math.exp(lg));
  }
  // Continued fraction for Q (Lentz).
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 2000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.max(0, 1 - Math.exp(lg) * h);
}
/** Regularised upper incomplete gamma Q(a, x) = 1 − P(a, x), computed directly for small tails. */
export function gammaQ(a: number, x: number): number {
  if (!(x > 0)) return 1;
  if (x < a + 1) return 1 - gammaP(a, x);
  const lg = a * Math.log(x) - x - logGamma(a);
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 2000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.exp(lg) * h;
}
/** x with P(a, x) = p (the gamma quantile), by bisection on a bracket and Newton polishing. */
export function gammaPinv(a: number, p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  let lo = 0, hi = Math.max(1, a);
  while (gammaP(a, hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (gammaP(a, m) < p) lo = m; else hi = m;
    if (hi - lo <= 1e-14 * Math.max(1, hi)) break;
  }
  return (lo + hi) / 2;
}
/** Exact (Garwood) two-sided confidence interval for the mean of a Poisson count k. */
export function poissonCI(k: number, conf = 0.95): [number, number] {
  const a = (1 - conf) / 2;
  return [k > 0 ? gammaPinv(k, a) : 0, gammaPinv(k + 1, 1 - a)];
}
/** Upper tail of the chi-square distribution. */
export const chi2Sf = (x: number, df: number) => (df > 0 ? gammaQ(df / 2, Math.max(0, x) / 2) : NaN);

// ---------------------------------------------------------------- Plates and the dilution maths

export type Plate = { name: string; dil: number; vol: number; count: number; tntc: boolean; line: number; photo?: boolean };
const SUPS: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

/** A dilution written as 1e-5, 10^-5, 10⁻⁵, 1:100000, 1/100000, 0.00001, 100000 (a factor) or -5 (a power of ten).
 *  Returns the fraction of sample (10⁻⁵ for all of these), or NaN. */
export function parseDilution(s: string): number {
  let t = String(s ?? '').trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  t = t.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, e: string) => '10^' + e.replace(/./g, (c) => SUPS[c]));
  if (!t) return NaN;
  const frac = (x: number) => (Number.isFinite(x) && x > 0 ? (x > 1 ? 1 / x : x) : NaN);
  const m1 = t.match(/^1[:/](.+)$/);
  if (m1) return parseDilution(m1[1]);
  const pw = t.match(/^(?:(\d+(?:\.\d+)?)[×x*])?10\^(-?\d{1,2})$/i);
  if (pw) return frac((pw[1] !== undefined ? Number(pw[1]) : 1) * Number(`1e${pw[2]}`));
  if (/^-\d{1,2}$/.test(t)) return Number(`1e${t}`);
  if (!/^[+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return NaN;
  return frac(Number(t));
}
/** Volume in mL; "100 µL", "100 ul" and "0.1 mL" all work. */
export function parseVolume(s: string): number {
  const t = String(s ?? '').trim().replace(/\s+/g, '').toLowerCase();
  const m = t.match(/^((?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(ml|µl|μl|ul)?$/);
  if (!m) return NaN;
  const v = Number(m[1]) / (m[2] && m[2] !== 'ml' ? 1000 : 1);
  return v > 0 ? v : NaN;
}

/** Plate rows: "dilution, volume plated (mL), colonies[, name]". Colonies may be TNTC (too many to count). */
export function parsePlates(text: string): { plates: Plate[]; errors: string[] } {
  const plates: Plate[] = [], errors: string[] = [];
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  lines.forEach((raw, i) => {
    const l = raw.trim();
    if (!l || l.startsWith('#')) return;
    let parts = l.split(/\t|;|,(?!\d{3}\b)/).map((p) => p.trim());
    if (parts.length < 3) parts = l.split(/\s+/);
    const [a, b, c, ...rest] = parts;
    const dil = parseDilution(a), vol = parseVolume(b ?? '');
    const cs = (c ?? '').replace(/\s+/g, '').toUpperCase();
    const tntc = /^(TNTC|TMTC|TNC|>.*)$/.test(cs);
    const count = tntc ? NaN : Number(cs);
    if (!Number.isFinite(dil) && !plates.length && !errors.length && /[a-z]/i.test(a)) return; // a header line
    if (!Number.isFinite(dil)) { errors.push(`Line ${i + 1}: "${a}" is not a dilution. Write it like 1e-5, 10^-5 or 1:100000.`); return; }
    if (!Number.isFinite(vol)) { errors.push(`Line ${i + 1}: give the volume plated in mL (such as 0.1) or µL (such as 100 µL).`); return; }
    if (!tntc && !(Number.isInteger(count) && count >= 0)) { errors.push(`Line ${i + 1}: the colony count must be a whole number of 0 or more, or TNTC.`); return; }
    plates.push({ name: rest.join(' ').trim() || `Plate ${plates.length + 1}`, dil, vol, count: tntc ? NaN : count, tntc, line: i + 1 });
  });
  return { plates, errors };
}

export type Status = 'countable' | 'low' | 'high' | 'tntc';
export type PlateResult = Plate & { status: Status; used: boolean; vd: number; est: number; ci: [number, number] };
export type CfuResult = {
  plates: PlateResult[];
  basis: 'countable' | 'below' | 'above' | 'none';
  total: number; vd: number; est: number; ci: [number, number]; conf: number;
  /** Lowest concentration one colony on the plates used stands for. */
  perColony: number;
  dispersion: { chi2: number; df: number; p: number } | null;
};

/** CFU per mL (or per g) from plates. Plates with lo ≤ count ≤ hi are used; if there are none, the plates nearest
 *  the range are used and the result is marked as an estimate (basis 'below' or 'above'). */
export function cfu(plates: Plate[], opts: { lo: number; hi: number; conf?: number }): CfuResult {
  const conf = opts.conf ?? 0.95, lo = opts.lo, hi = opts.hi;
  const P: PlateResult[] = plates.map((p) => {
    const vd = p.vol * p.dil;
    const status: Status = p.tntc ? 'tntc' : p.count < lo ? 'low' : p.count > hi ? 'high' : 'countable';
    const ci = p.tntc ? [NaN, NaN] as [number, number] : poissonCI(p.count, conf).map((x) => x / vd) as [number, number];
    return { ...p, vd, status, used: false, est: p.tntc ? NaN : p.count / vd, ci };
  });
  let basis: CfuResult['basis'] = 'countable';
  let use = P.filter((p) => p.status === 'countable');
  if (!use.length) {
    // Nearest the range, by how many times too few or too many; ties (same V·d) are pooled.
    const cand = P.filter((p) => !p.tntc);
    if (!cand.length) basis = 'none';
    else {
      const dist = (p: PlateResult) => (p.status === 'low' ? Math.log(lo / Math.max(p.count, 0.5)) : Math.log(p.count / hi));
      const best = cand.reduce((b, p) => (dist(p) < dist(b) - 1e-12 ? p : b));
      use = cand.filter((p) => Math.abs(p.vd / best.vd - 1) < 1e-9 && p.status === best.status);
      basis = best.status === 'low' ? 'below' : 'above';
    }
  }
  use.forEach((p) => { p.used = true; });
  const total = use.reduce((s, p) => s + p.count, 0), vd = use.reduce((s, p) => s + p.vd, 0);
  const est = vd > 0 ? total / vd : NaN;
  const ci = vd > 0 ? poissonCI(total, conf).map((x) => x / vd) as [number, number] : [NaN, NaN] as [number, number];
  let dispersion: CfuResult['dispersion'] = null;
  if (use.length >= 2 && total > 0) {
    const chi2 = use.reduce((s, p) => { const e = est * p.vd; return s + (p.count - e) ** 2 / e; }, 0), df = use.length - 1;
    dispersion = { chi2, df, p: chi2Sf(chi2, df) };
  }
  return { plates: P, basis, total, vd, est, ci, conf, perColony: vd > 0 ? 1 / vd : NaN, dispersion };
}

/** Tidy a computed number (154999999.99999997 → 155000000) by keeping 12 significant figures. */
export const clean = (x: number) => (x === 0 || !Number.isFinite(x) ? x : Number(x.toPrecision(12)));
/** A number to n significant figures, as a plain JavaScript number (for "report as 1.5 × 10⁸"), rounding half up
 *  after tidying, so 155 colonies on 10⁻⁶ mL is 1.6 × 10⁸, not 1.5 × 10⁸ from a floating-point 154999999.99999997. */
export const roundSig = (x: number, n = 2) => (x === 0 || !Number.isFinite(x) ? x : Number(clean(x).toPrecision(n)));

export const EXAMPLE_PLATES = `# dilution, volume plated (mL), colonies, name (made-up counts)
1e-4, 0.1, TNTC, 10⁻⁴ plate
1e-5, 0.1, 155, 10⁻⁵ plate B
1e-6, 0.1, 17, 10⁻⁶ plate`;

// ---------------------------------------------------------------- Plate photo

export type Circle = { cx: number; cy: number; r: number };
export type Pt = { x: number; y: number };
export type Blob = { area: number; n: number; cx: number; cy: number; x0: number; y0: number; x1: number; y1: number };
export type Detect = {
  points: Pt[]; blobs: Blob[]; threshold: number; autoThreshold: number; lighter: boolean; noise: number;
  typicalArea: number; pxPerMm: number; tooSmall: number; tooBig: number;
};
export type DetectOpts = {
  /** 'auto' picks whichever way more pixels stand out from the agar. */
  colonies?: 'auto' | 'lighter' | 'darker';
  /** Grey levels (0–255) a pixel must stand out from the agar by; null or NaN for automatic. */
  threshold?: number | null;
  plateMm?: number; minMm?: number; maxMm?: number;
  /** Fraction of the radius left out at the rim (glare, the dish wall). */
  margin?: number;
  split?: boolean;
};

/** The circle through three points on the plate's rim, or null if they lie on a line. */
export function circleFrom3(a: Pt, b: Pt, c: Pt): Circle | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null;
  const s = (p: Pt) => p.x * p.x + p.y * p.y;
  const cx = (s(a) * (b.y - c.y) + s(b) * (c.y - a.y) + s(c) * (a.y - b.y)) / d;
  const cy = (s(a) * (c.x - b.x) + s(b) * (a.x - c.x) + s(c) * (b.x - a.x)) / d;
  return { cx, cy, r: Math.hypot(a.x - cx, a.y - cy) };
}

/** Grey level of each pixel (0–255, Rec. 601 luma). */
export function toGrey(rgba: ArrayLike<number>, w: number, h: number): Float32Array {
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = 0.299 * rgba[4 * i] + 0.587 * rgba[4 * i + 1] + 0.114 * rgba[4 * i + 2];
  return g;
}

/** Mean of `v` over the pixels with `keep` set, in a (2R+1)² window around each pixel (integral images). */
export function maskedBoxMean(v: Float32Array, keep: Uint8Array, w: number, h: number, R: number): Float32Array {
  const W1 = w + 1, S = new Float64Array(W1 * (h + 1)), N = new Float64Array(W1 * (h + 1));
  for (let y = 0; y < h; y++) {
    let rs = 0, rn = 0;
    for (let x = 0; x < w; x++) {
      const i = y * w + x; if (keep[i]) { rs += v[i]; rn++; }
      S[(y + 1) * W1 + x + 1] = S[y * W1 + x + 1] + rs; N[(y + 1) * W1 + x + 1] = N[y * W1 + x + 1] + rn;
    }
  }
  const out = new Float32Array(w * h).fill(NaN);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - R), y1 = Math.min(h, y + R + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - R), x1 = Math.min(w, x + R + 1);
      const n = N[y1 * W1 + x1] - N[y0 * W1 + x1] - N[y1 * W1 + x0] + N[y0 * W1 + x0];
      if (n > 0) out[y * w + x] = (S[y1 * W1 + x1] - S[y0 * W1 + x1] - S[y1 * W1 + x0] + S[y0 * W1 + x0]) / n;
    }
  }
  return out;
}

/** Connected groups of set pixels (8 neighbours). Returns a label per pixel (0 = none) and the number of groups. */
export function label(bin: Uint8Array, w: number, h: number): { lab: Int32Array; n: number } {
  const lab = new Int32Array(w * h), stack: number[] = [];
  let n = 0;
  for (let s = 0; s < w * h; s++) {
    if (!bin[s] || lab[s]) continue;
    lab[s] = ++n; stack.push(s);
    while (stack.length) {
      const i = stack.pop()!, x = i % w, y = (i - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const j = Y * w + X;
        if (bin[j] && !lab[j]) { lab[j] = n; stack.push(j); }
      }
    }
  }
  return { lab, n };
}

/** Exact Euclidean distance from each set pixel to the nearest unset pixel (Felzenszwalb and Huttenlocher). */
export function distanceMap(bin: Uint8Array, w: number, h: number): Float32Array {
  const INF = 1e20, f = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) f[i] = bin[i] ? INF : 0;
  const pass = (get: (k: number) => number, set: (k: number, v: number) => void, n: number) => {
    const d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1), g = new Float64Array(n);
    for (let q = 0; q < n; q++) g[q] = get(q);
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < n; q++) {
      let s = ((g[q] + q * q) - (g[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((g[q] + q * q) - (g[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) ** 2 + g[v[k]]; }
    for (let q = 0; q < n; q++) set(q, d[q]);
  };
  for (let x = 0; x < w; x++) pass((q) => f[q * w + x], (q, val) => { f[q * w + x] = val; }, h);
  for (let y = 0; y < h; y++) pass((q) => f[y * w + q], (q, val) => { f[y * w + q] = val; }, w);
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = Math.sqrt(f[i]);
  return out;
}

/** Robust centre and spread: median and 1.4826 × median absolute deviation of the values. */
function robust(vals: Float32Array): { med: number; sd: number } {
  const s = Float32Array.from(vals).sort(), m = s.length ? s[s.length >> 1] : 0;
  const dev = s.map((x) => Math.abs(x - m)).sort();
  return { med: m, sd: dev.length ? 1.4826 * dev[dev.length >> 1] : 0 };
}

/** Find colonies inside the plate circle. Sizes are in mm, using the plate's diameter in mm for the scale. */
export function detectColonies(rgba: ArrayLike<number>, w: number, h: number, circle: Circle, o: DetectOpts = {}): Detect {
  const plateMm = o.plateMm ?? 90, minMm = o.minMm ?? 0.4, maxMm = o.maxMm ?? 4, margin = o.margin ?? 0.05, split = o.split ?? true;
  const pxPerMm = (2 * circle.r) / plateMm;
  const g = toGrey(rgba, w, h), mask = new Uint8Array(w * h), rIn = circle.r * (1 - margin);
  const bx0 = Math.max(0, Math.floor(circle.cx - rIn)), bx1 = Math.min(w, Math.ceil(circle.cx + rIn + 1));
  const by0 = Math.max(0, Math.floor(circle.cy - rIn)), by1 = Math.min(h, Math.ceil(circle.cy + rIn + 1));
  let nIn = 0;
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) if ((x - circle.cx) ** 2 + (y - circle.cy) ** 2 <= rIn * rIn) { mask[y * w + x] = 1; nIn++; }
  const empty: Detect = { points: [], blobs: [], threshold: NaN, autoThreshold: NaN, lighter: true, noise: NaN, typicalArea: NaN, pxPerMm, tooSmall: 0, tooBig: 0 };
  if (nIn < 50) return empty;
  // Background: local mean of the agar, then again leaving out pixels that stand out (colonies).
  const R = Math.max(8, Math.round(1.5 * maxMm * pxPerMm));
  const bg1 = maskedBoxMean(g, mask, w, h, R);
  const inVals = new Float32Array(nIn); let k = 0;
  for (let i = 0; i < w * h; i++) if (mask[i]) inVals[k++] = g[i] - bg1[i];
  const r1 = robust(inVals), cut1 = Math.max(3, 4 * r1.sd);
  const keep = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (mask[i] && Math.abs(g[i] - bg1[i] - r1.med) <= cut1) keep[i] = 1;
  const bg2 = maskedBoxMean(g, keep, w, h, R);
  const d = new Float32Array(w * h); k = 0;
  for (let i = 0; i < w * h; i++) if (mask[i]) { d[i] = g[i] - (Number.isFinite(bg2[i]) ? bg2[i] : bg1[i]); inVals[k++] = d[i]; }
  const r2 = robust(inVals), noise = r2.sd;
  let lighter = o.colonies !== 'darker';
  if (o.colonies === 'auto' || o.colonies === undefined) {
    const c = Math.max(6, 6 * noise); let up = 0, dn = 0;
    for (let j = 0; j < nIn; j++) { if (inVals[j] - r2.med > c) up++; else if (inVals[j] - r2.med < -c) dn++; }
    lighter = up >= dn;
  }
  const autoThreshold = Math.max(6, 6 * noise);
  const t = o.threshold != null && Number.isFinite(o.threshold) && o.threshold > 0 ? o.threshold : autoThreshold;
  const bin = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (mask[i] && (lighter ? d[i] - r2.med : r2.med - d[i]) > t) bin[i] = 1;
  const { lab, n } = label(bin, w, h);
  const st = Array.from({ length: n + 1 }, () => ({ area: 0, sx: 0, sy: 0, x0: w, y0: h, x1: -1, y1: -1 }));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = lab[y * w + x]; if (!l) continue;
    const s = st[l]; s.area++; s.sx += x; s.sy += y;
    if (x < s.x0) s.x0 = x; if (x > s.x1) s.x1 = x; if (y < s.y0) s.y0 = y; if (y > s.y1) s.y1 = y;
  }
  const minA = Math.max(3, Math.PI * (minMm * pxPerMm / 2) ** 2), maxA = Math.PI * (maxMm * pxPerMm / 2) ** 2, hugeA = 40 * maxA;
  const singles = st.slice(1).map((s) => s.area).filter((a) => a >= minA && a <= maxA).sort((a, b) => a - b);
  const typicalArea = singles.length ? singles[singles.length >> 1] : maxA / 4;
  const rTyp = Math.sqrt(typicalArea / Math.PI);
  let tooSmall = 0, tooBig = 0;
  const blobs: Blob[] = [], points: Pt[] = [];
  for (let l = 1; l <= n; l++) {
    const s = st[l];
    if (s.area < minA) { tooSmall++; continue; }
    if (s.area > hugeA) { tooBig++; continue; }
    const b: Blob = { area: s.area, n: 1, cx: s.sx / s.area, cy: s.sy / s.area, x0: s.x0, y0: s.y0, x1: s.x1, y1: s.y1 };
    let pts: Pt[] = [{ x: b.cx, y: b.cy }];
    if (split && s.area >= 2 * minA) {
      // Distance map of this blob alone (with a one-pixel border), then its peaks with non-maximum suppression.
      const bw = s.x1 - s.x0 + 3, bh = s.y1 - s.y0 + 3, sub = new Uint8Array(bw * bh);
      for (let y = s.y0; y <= s.y1; y++) for (let x = s.x0; x <= s.x1; x++) if (lab[y * w + x] === l) sub[(y - s.y0 + 1) * bw + x - s.x0 + 1] = 1;
      const dm = distanceMap(sub, bw, bh), cands: { x: number; y: number; v: number }[] = [];
      for (let y = 1; y < bh - 1; y++) for (let x = 1; x < bw - 1; x++) {
        const v = dm[y * bw + x]; if (v < Math.max(1.5, 0.45 * rTyp)) continue;
        let top = true;
        for (let dy = -1; dy <= 1 && top; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && dm[(y + dy) * bw + x + dx] > v) { top = false; break; }
        if (top) cands.push({ x: x + s.x0 - 1, y: y + s.y0 - 1, v });
      }
      cands.sort((a, c) => c.v - a.v);
      const kept: { x: number; y: number; v: number }[] = [];
      for (const c of cands) if (kept.every((q) => Math.hypot(q.x - c.x, q.y - c.y) > Math.max(q.v, 0.8 * rTyp))) kept.push(c);
      // Never more colonies than the area allows (a third of a typical colony each).
      const cap = Math.max(1, Math.floor(s.area / (0.33 * typicalArea)));
      if (kept.length > 1) pts = kept.slice(0, cap).map((c) => ({ x: c.x, y: c.y }));
      b.n = pts.length;
    }
    blobs.push(b); points.push(...pts);
  }
  return { points, blobs, threshold: t, autoThreshold, lighter, noise, typicalArea, pxPerMm, tooSmall, tooBig };
}

/** Index of the point nearest (x, y) within `radius`, or −1. */
export function nearest(points: Pt[], x: number, y: number, radius: number): number {
  let best = -1, bd = radius;
  points.forEach((p, i) => { const dd = Math.hypot(p.x - x, p.y - y); if (dd <= bd) { bd = dd; best = i; } });
  return best;
}
/** Tap on the photo: remove the nearest point within `radius`, or add one there. Returns the new list. */
export function tapEdit(points: Pt[], x: number, y: number, radius: number): { points: Pt[]; added: boolean } {
  const best = nearest(points, x, y, radius);
  if (best >= 0) return { points: points.filter((_, i) => i !== best), added: false };
  return { points: [...points, { x, y }], added: true };
}

/** Small seeded random numbers (mulberry32), so the example plate is the same every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** A made-up plate photo: a 90 mm dish on a dark bench, uneven light, with `singles` lone colonies and `pairs` pairs
 *  of touching colonies (so 142 colonies with the defaults). Returns the pixels, the plate circle and every colony. */
export function examplePlate(singles = 120, pairs = 11, seed = 2026) {
  const w = 640, h = 640, cx = 320, cy = 322, rDish = 300, rAgar = 288, rnd = rng(seed);
  const discs: { x: number; y: number; r: number }[] = [];
  const free = (x: number, y: number, r: number, gap: number) => Math.hypot(x - cx, y - cy) + r < rAgar * 0.88 && discs.every((d) => Math.hypot(d.x - x, d.y - y) > d.r + r + gap);
  for (let i = 0, tries = 0; i < pairs && tries < 20000; tries++) {
    const r1 = 4 + 3.5 * rnd(), r2 = 4 + 3.5 * rnd(), a = 2 * Math.PI * rnd(), dd = 0.86 * (r1 + r2);
    const x = cx + (rnd() * 2 - 1) * rAgar, y = cy + (rnd() * 2 - 1) * rAgar, x2 = x + dd * Math.cos(a), y2 = y + dd * Math.sin(a);
    if (!free(x, y, r1, 6) || !free(x2, y2, r2, 6)) continue;
    discs.push({ x, y, r: r1 }, { x: x2, y: y2, r: r2 }); i++;
  }
  for (let i = 0, tries = 0; i < singles && tries < 50000; tries++) {
    const r = 3.5 + 4 * rnd(), x = cx + (rnd() * 2 - 1) * rAgar, y = cy + (rnd() * 2 - 1) * rAgar;
    if (!free(x, y, r, 5)) continue;
    discs.push({ x, y, r }); i++;
  }
  const px = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const rr = Math.hypot(x - cx, y - cy), j = 4 * (y * w + x);
    let c: [number, number, number];
    if (rr > rDish + 1) c = [52, 56, 62];
    else if (rr > rAgar) { const e = Math.min(1, rDish + 1 - rr); c = [52 + (196 - 52) * e, 56 + (200 - 56) * e, 62 + (204 - 62) * e]; }
    else {
      // Agar: amber, a little darker towards the rim, lit from the upper left.
      const shade = 1 - 0.08 * (rr / rAgar) ** 2 + 0.05 * ((cx - x) + (cy - y)) / rAgar;
      c = [206 * shade, 170 * shade, 112 * shade];
      if (rr > rAgar - 1) { const e = rr - (rAgar - 1); c = c.map((v, k) => v + ([196, 200, 204][k] - v) * e) as [number, number, number]; }
    }
    px[j] = c[0]; px[j + 1] = c[1]; px[j + 2] = c[2]; px[j + 3] = 255;
  }
  // Colonies: cream domes with a soft one-pixel edge.
  for (const d of discs) {
    for (let y = Math.floor(d.y - d.r - 2); y <= Math.ceil(d.y + d.r + 2); y++) for (let x = Math.floor(d.x - d.r - 2); x <= Math.ceil(d.x + d.r + 2); x++) {
      const q = Math.hypot(x - d.x, y - d.y), cover = Math.max(0, Math.min(1, d.r + 0.5 - q));
      if (!cover) continue;
      const dome = 0.92 + 0.08 * Math.sqrt(Math.max(0, 1 - (q / d.r) ** 2)), j = 4 * (y * w + x);
      const col = [244 * dome, 234 * dome, 206 * dome];
      for (let k = 0; k < 3; k++) px[j + k] = px[j + k] * (1 - cover) + col[k] * cover;
    }
  }
  for (let i = 0; i < w * h; i++) { const nz = (rnd() - 0.5) * 8; for (let k = 0; k < 3; k++) px[4 * i + k] = px[4 * i + k] + nz; }
  return { px, w, h, circle: { cx, cy, r: rDish } as Circle, discs, count: discs.length };
}
