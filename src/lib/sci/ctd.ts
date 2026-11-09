// CTD cast viewer maths: read a cast (pressure or depth, temperature, salinity, optional oxygen and fluorescence),
// split it into the downcast and the upcast, average it into depth bins, work out density from a simple LINEAR
// equation of state (not TEOS-10), the mixed layer depth by a threshold from a reference depth, the buoyancy
// frequency N² and the depth of the strongest temperature gradient. No DOM. The example cast is made up.
import { parseTable, num } from './num.ts';

export type Cast = { z: number[]; T: number[]; S: number[]; O?: number[]; F?: number[] };
export type Parsed = {
  cast: Cast;
  /** Where depth came from: a depth column, or pressure turned into depth. */
  zFrom: 'depth' | 'pressure';
  /** Optional columns found. */
  hasO: boolean; hasF: boolean;
  /** Column names used, for the page to show. */
  names: { z: string; T: string; S: string; O?: string; F?: string };
  /** Rows skipped because a needed value was missing or not a number (1-based data row numbers). */
  skipped: number[];
  error?: string;
};
/** Linear equation of state: ρ = ρ₀ (1 − α (T − T₀) + β (S − S₀)). */
export type EOS = { rho0: number; alpha: number; beta: number; T0: number; S0: number };
/** Rounded starting values, not taken from any standard. Every one is editable on the page. */
export const EOS_DEFAULT: EOS = { rho0: 1027, alpha: 2e-4, beta: 8e-4, T0: 10, S0: 35 };
export const G = 9.81;

/** Density in kg/m³ from the linear equation of state. */
export const density = (T: number, S: number, e: EOS) => e.rho0 * (1 - e.alpha * (T - e.T0) + e.beta * (S - e.S0));

/** Pressure (dbar) to depth (m) by hydrostatics with a constant density: z = p · 10⁴ / (ρ₀ g). */
export const pressureToDepth = (p: number, rho0: number, g = G) => (p * 1e4) / (rho0 * g);

const RX = {
  depth: /^(depth|dep|z)\b|depth|depsm/i,
  pres: /pres|prdm|prsm|dbar|^p$|^p[ _(]/i,
  T: /temp|^t$|^t[ _(]|t090|t068|°c|deg ?c/i,
  S: /sal|psu|^s$|^s[ _(]|sp\b|g\/kg/i,
  O: /oxy|o2|^do\b|^do[ _(]|sbeox/i,
  F: /fluor|chl|^fl|flsp|flec/i,
};

/**
 * A pasted or opened cast. With a header row the columns are found by name (pressure or depth, temperature,
 * salinity, oxygen, fluorescence); without one the order is depth-or-pressure, temperature, salinity, then
 * oxygen and fluorescence if there. `zIs` forces how the first column is read when there is no header.
 */
export function parseCast(text: string, rho0 = EOS_DEFAULT.rho0, zIs: 'pressure' | 'depth' = 'pressure', g = G): Parsed {
  const empty: Cast = { z: [], T: [], S: [] };
  const fail = (m: string): Parsed => ({ cast: empty, zFrom: zIs, hasO: false, hasF: false, names: { z: '', T: '', S: '' }, skipped: [], error: m });
  const rows = parseTable(text);
  if (!rows.length) return fail('Paste a cast or open a file: one row per scan with pressure or depth, temperature and salinity.');
  const head = rows[0].some((c) => c !== '' && Number.isNaN(num(c)));
  let iz = 0, iT = 1, iS = 2, iO = -1, iF = -1, zFrom: 'depth' | 'pressure' = zIs;
  const names: Parsed['names'] = { z: zIs === 'depth' ? 'depth' : 'pressure', T: 'temperature', S: 'salinity' };
  if (head) {
    const h = rows[0].map((c) => c.trim());
    const find = (rx: RegExp, not: number[] = []) => h.findIndex((c, i) => !not.includes(i) && rx.test(c));
    const id = find(RX.depth), ip = find(RX.pres, [id]);
    if (id >= 0) { iz = id; zFrom = 'depth'; } else if (ip >= 0) { iz = ip; zFrom = 'pressure'; } else return fail('No pressure or depth column found. Name one "pressure" (dbar) or "depth" (m).');
    iT = find(RX.T, [iz]); iS = find(RX.S, [iz, iT]);
    if (iT < 0) return fail('No temperature column found. Name it "temperature" (°C).');
    if (iS < 0) return fail('No salinity column found. Name it "salinity".');
    iO = find(RX.O, [iz, iT, iS]); iF = find(RX.F, [iz, iT, iS, iO]);
    names.z = h[iz]; names.T = h[iT]; names.S = h[iS];
    if (iO >= 0) names.O = h[iO];
    if (iF >= 0) names.F = h[iF];
  } else {
    const w = Math.max(...rows.map((r) => r.length));
    if (w < 3) return fail('Each row needs at least three numbers: pressure or depth, temperature and salinity.');
    if (w >= 4) { iO = 3; names.O = 'oxygen'; }
    if (w >= 5) { iF = 4; names.F = 'fluorescence'; }
  }
  const body = head ? rows.slice(1) : rows;
  const c: Cast = { z: [], T: [], S: [] }, O: number[] = [], F: number[] = [], skipped: number[] = [];
  body.forEach((r, i) => {
    const z = num(r[iz]), T = num(r[iT]), S = num(r[iS]);
    if (![z, T, S].every(Number.isFinite)) { skipped.push(i + 1); return; }
    c.z.push(zFrom === 'pressure' ? pressureToDepth(z, rho0, g) : z); c.T.push(T); c.S.push(S);
    if (iO >= 0) O.push(num(r[iO]));
    if (iF >= 0) F.push(num(r[iF]));
  });
  const hasO = iO >= 0 && O.some(Number.isFinite), hasF = iF >= 0 && F.some(Number.isFinite);
  if (hasO) c.O = O;
  if (hasF) c.F = F;
  if (!hasO) delete names.O;
  if (!hasF) delete names.F;
  if (c.z.length < 3) return { ...fail('Fewer than three rows with numbers for depth, temperature and salinity.'), skipped };
  return { cast: c, zFrom, hasO, hasF, names, skipped };
}

const pick = (c: Cast, a: number, b: number): Cast => {
  const s = (v?: number[]) => v?.slice(a, b);
  const o: Cast = { z: s(c.z)!, T: s(c.T)!, S: s(c.S)! };
  if (c.O) o.O = s(c.O); if (c.F) o.F = s(c.F);
  return o;
};
/** Downcast: from the first scan to the deepest one. Upcast: from the deepest one to the end. */
export function splitCast(c: Cast): { down: Cast; up: Cast; iMax: number } {
  let iMax = 0;
  c.z.forEach((z, i) => { if (z > c.z[iMax]) iMax = i; });
  return { down: pick(c, 0, iMax + 1), up: pick(c, iMax, c.z.length), iMax };
}

export type Binned = Cast & { n: number[] };
/**
 * Average into depth bins of `size` metres. Bin k holds every scan with depth in [(k − ½) size, (k + ½) size)
 * and is placed at k · size. Each value is the mean of the finite values in the bin. Empty bins are left out.
 */
export function binCast(c: Cast, size = 1): Binned {
  const m = new Map<number, { n: number; T: number; S: number; O: number; nO: number; F: number; nF: number }>();
  c.z.forEach((z, i) => {
    if (!Number.isFinite(z)) return;
    const k = Math.floor(z / size + 0.5);
    const b = m.get(k) ?? { n: 0, T: 0, S: 0, O: 0, nO: 0, F: 0, nF: 0 };
    b.n++; b.T += c.T[i]; b.S += c.S[i];
    const o = c.O?.[i], f = c.F?.[i];
    if (o !== undefined && Number.isFinite(o)) { b.O += o; b.nO++; }
    if (f !== undefined && Number.isFinite(f)) { b.F += f; b.nF++; }
    m.set(k, b);
  });
  const ks = [...m.keys()].sort((a, b) => a - b);
  const out: Binned = { z: [], T: [], S: [], n: [] };
  if (c.O) out.O = []; if (c.F) out.F = [];
  for (const k of ks) {
    const b = m.get(k)!;
    out.z.push(+(k * size).toPrecision(12)); out.T.push(b.T / b.n); out.S.push(b.S / b.n); out.n.push(b.n);
    out.O?.push(b.nO ? b.O / b.nO : NaN); out.F?.push(b.nF ? b.F / b.nF : NaN);
  }
  return out;
}

/** Linear interpolation of v at depth `at` (z increasing). NaN outside the profile. */
export function interpAt(z: number[], v: number[], at: number): number {
  if (!z.length || at < z[0] || at > z[z.length - 1]) return NaN;
  for (let i = 1; i < z.length; i++) if (at <= z[i]) { const t = (at - z[i - 1]) / (z[i] - z[i - 1] || 1); return v[i - 1] + t * (v[i] - v[i - 1]); }
  return v[z.length - 1];
}

export type MLD = { depth: number; refDepth: number; refValue: number; found: boolean };
/**
 * Mixed layer depth by a threshold: the first depth below the reference depth where the value differs from its
 * value at the reference depth by more than `dv`. `mode` 'abs' counts a change either way (temperature); 'up'
 * counts only an increase (density). The crossing is placed by linear interpolation between the two levels.
 * A reference shallower than the first level uses the first level. found = false: no crossing in the cast.
 */
export function mixedLayer(z: number[], v: number[], ref: number, dv: number, mode: 'abs' | 'up'): MLD {
  if (!z.length) return { depth: NaN, refDepth: ref, refValue: NaN, found: false };
  const rd = Math.max(ref, z[0]), rv = interpAt(z, v, rd);
  if (!Number.isFinite(rv)) return { depth: NaN, refDepth: rd, refValue: NaN, found: false };
  const d = (x: number) => (mode === 'abs' ? Math.abs(x - rv) : x - rv);
  let pz = rd, pv = rv;
  for (let i = 0; i < z.length; i++) {
    if (z[i] <= rd || !Number.isFinite(v[i])) continue;
    if (d(v[i]) > dv) {
      // Signed target on the side the profile crossed.
      const tgt = mode === 'abs' ? rv + Math.sign(v[i] - rv) * dv : rv + dv;
      const t = (tgt - pv) / (v[i] - pv);
      return { depth: pz + Math.min(1, Math.max(0, t)) * (z[i] - pz), refDepth: rd, refValue: rv, found: true };
    }
    pz = z[i]; pv = v[i];
  }
  return { depth: z[z.length - 1], refDepth: rd, refValue: rv, found: false };
}

/** Gradient dv/dz between level i and level i + k, placed at the middle depth. */
export function gradient(z: number[], v: number[], k = 1): { z: number[]; g: number[] } {
  const zo: number[] = [], g: number[] = [];
  k = Math.max(1, Math.round(k));
  for (let i = 0; i + k < z.length; i++) {
    const dz = z[i + k] - z[i];
    if (!(dz > 0) || !Number.isFinite(v[i]) || !Number.isFinite(v[i + k])) continue;
    zo.push((z[i] + z[i + k]) / 2); g.push((v[i + k] - v[i]) / dz);
  }
  return { z: zo, g };
}

/** Buoyancy frequency squared, N² = (g/ρ₀) dρ/dz with z positive downward, in s⁻². */
export function buoyancy(z: number[], rho: number[], rho0: number, k = 1, g = G): { z: number[]; n2: number[] } {
  const d = gradient(z, rho, k);
  return { z: d.z, n2: d.g.map((x) => (g / rho0) * x) };
}

/** The thermocline as the depth of the fastest fall of temperature with depth (largest −dT/dz). */
export function thermocline(z: number[], T: number[], k = 1): { depth: number; grad: number } {
  const d = gradient(z, T, k);
  let best = -1;
  d.g.forEach((x, i) => { if (best < 0 || -x > -d.g[best]) best = i; });
  return best < 0 ? { depth: NaN, grad: NaN } : { depth: d.z[best], grad: -d.g[best] };
}

/** The deepest point of the largest N² (the pycnocline). */
export function pycnocline(z: number[], n2: number[]): { depth: number; n2: number } {
  let best = -1;
  n2.forEach((x, i) => { if (Number.isFinite(x) && (best < 0 || x > n2[best])) best = i; });
  return best < 0 ? { depth: NaN, n2: NaN } : { depth: z[best], n2: n2[best] };
}

/** Temperature on the isopycnal ρ at salinity S (a straight line in T-S space for the linear equation). */
export const isoT = (rho: number, S: number, e: EOS) => e.T0 + (e.beta * (S - e.S0) - (rho / e.rho0 - 1)) / e.alpha;

// ---------- Example ----------
// A made-up summer cast to 250 dbar: a warm mixed layer to about 25 m, a sharp thermocline, a fluorescence peak in
// it, an oxygen dip below, and a slightly fresher surface. The downcast is sampled every 0.25 dbar and the upcast
// every 0.5 dbar, a little warmer (sensor lag), with a small seeded noise. None of this is real data.
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 - 0.5; }; }
function trueProfile(p: number) {
  const step = (x: number, c: number, w: number) => 0.5 * (1 + Math.tanh((x - c) / w));
  const T = 18 - 7 * step(p, 40, 9) - 3 * (p / 250);
  const S = 34.6 + 0.5 * step(p, 35, 10) + 0.1 * (p / 250);
  const O = 250 - 40 * step(p, 45, 12) - 60 * Math.exp(-(((p - 160) / 50) ** 2));
  const F = 0.3 + 2.2 * Math.exp(-(((p - 45) / 9) ** 2)) - 0.25 * step(p, 70, 10);
  return { T, S, O, F };
}
export function exampleCast(): string {
  const r = rng(208), lines = ['pressure_dbar,temperature_C,salinity,oxygen_umol_kg,fluorescence'];
  const row = (p: number, lag: number) => {
    const t = trueProfile(p + lag);
    lines.push([p.toFixed(2), (t.T + 0.004 * r()).toFixed(4), (t.S + 0.002 * r()).toFixed(4), (t.O + 0.6 * r()).toFixed(2), Math.max(0, t.F + 0.04 * r()).toFixed(3)].join(','));
  };
  for (let p = 1; p <= 250.001; p += 0.25) row(p, 0);
  for (let p = 249.5; p >= 1.999; p -= 0.5) row(p, -1.5);
  return lines.join('\n');
}
