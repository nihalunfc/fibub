// Corrosion from a potentiodynamic polarisation curve: Tafel extrapolation, a Butler–Volmer (Wagner–Traud) fit,
// polarisation resistance with Stern–Geary, and the corrosion rate by ASTM G102.

const LN10 = Math.LN10;
const linfit = (x: number[], y: number[]) => {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0; x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; syy += (y[i] - my) ** 2; });
  const m = sxy / sxx; return { m, c: my - m * mx, r2: syy ? (sxy * sxy) / (sxx * syy) : 1, n };
};

/** Wagner–Traud current density: i = icorr·[10^(η/βa) − 10^(−η/βc)], η = E − Ecorr (V), β in V/decade. */
export const bv = (E: number, Ecorr: number, icorr: number, ba: number, bc: number) => icorr * (10 ** ((E - Ecorr) / ba) - 10 ** (-(E - Ecorr) / bc));
/** Stern–Geary constant B = βa·βc / (2.303(βa + βc)) in volts. */
export const sternGeary = (ba: number, bc: number) => (ba * bc) / (LN10 * (ba + bc));

export type Curve = { E: number; i: number }[];

/** Signed current: if the data hold no negative currents, the branch below the |i| minimum is taken as cathodic. */
export function signed(E: number[], i: number[]): Curve {
  const p = E.map((e, k) => ({ E: e, i: i[k] })).filter((x) => Number.isFinite(x.E) && Number.isFinite(x.i)).sort((a, b) => a.E - b.E);
  if (p.some((x) => x.i < 0)) return p;
  let k = 0; for (let j = 0; j < p.length; j++) if (Math.abs(p[j].i) < Math.abs(p[k].i)) k = j;
  return p.map((x, j) => ({ E: x.E, i: j < k ? -x.i : x.i }));
}
/** Zero-current potential by interpolating the sign change of i nearest the |i| minimum. */
export function zeroCrossing(c: Curve) {
  let k = 0; for (let j = 0; j < c.length; j++) if (Math.abs(c[j].i) < Math.abs(c[k].i)) k = j;
  for (const j of [k - 1, k]) if (j >= 0 && j + 1 < c.length && Math.sign(c[j].i) !== Math.sign(c[j + 1].i)) return c[j].E + (c[j].i / (c[j].i - c[j + 1].i)) * (c[j + 1].E - c[j].E);
  return c[k].E;
}

/** Tafel extrapolation: straight lines through log|i| against E on each branch, from etaMin to etaMax (V) away
 *  from the zero-current potential; their crossing gives Ecorr and icorr. */
export function tafel(c: Curve, etaMin: number, etaMax: number) {
  const E0 = zeroCrossing(c);
  const an = c.filter((p) => p.E - E0 >= etaMin && p.E - E0 <= etaMax && p.i > 0), ca = c.filter((p) => E0 - p.E >= etaMin && E0 - p.E <= etaMax && p.i < 0);
  if (an.length < 3 || ca.length < 3) return { E0, ok: false as const, nA: an.length, nC: ca.length };
  const fa = linfit(an.map((p) => p.E), an.map((p) => Math.log10(p.i))), fc = linfit(ca.map((p) => p.E), ca.map((p) => Math.log10(-p.i)));
  const Ecorr = (fc.c - fa.c) / (fa.m - fc.m), icorr = 10 ** (fa.c + fa.m * Ecorr);
  return { E0, ok: true as const, Ecorr, icorr, ba: 1 / fa.m, bc: -1 / fc.m, r2a: fa.r2, r2c: fc.r2, nA: an.length, nC: ca.length, fa, fc, decA: Math.log10(an[an.length - 1].i / an[0].i), decC: Math.log10(ca[0].i / ca[ca.length - 1].i) };
}

/** Polarisation resistance (Ω·area, in the units of E/i) from a straight line of E against i within ±half (V) of E0. */
export function polarisationResistance(c: Curve, E0: number, half = 0.01) {
  const w = c.filter((p) => Math.abs(p.E - E0) <= half);
  if (w.length < 3) return null;
  const f = linfit(w.map((p) => p.i), w.map((p) => p.E));
  return { Rp: f.m, n: w.length };
}

/** Least-squares fit of the Wagner–Traud equation to log|i| within ±win (V) of E0, leaving out |η| below skip. */
export function fitBV(c: Curve, E0: number, start: { Ecorr: number; icorr: number; ba: number; bc: number }, win = 0.25, skip = 0.01) {
  const w = c.filter((p) => Math.abs(p.E - E0) <= win && Math.abs(p.E - E0) >= skip && p.i !== 0);
  if (w.length < 8) return null;
  const sse = (v: number[]) => { const [Ec, li, lba, lbc] = v, ic = 10 ** li, ba = Math.exp(lba), bc = Math.exp(lbc); let s = 0; for (const p of w) { const m = bv(p.E, Ec, ic, ba, bc); if (Math.sign(m) !== Math.sign(p.i)) { s += 4; continue; } const d = Math.log10(Math.abs(m)) - Math.log10(Math.abs(p.i)); s += d * d; } return s; };
  const x0 = [start.Ecorr, Math.log10(start.icorr), Math.log(Math.max(start.ba, 0.005)), Math.log(Math.max(start.bc, 0.005))], st = [0.005, 0.3, 0.2, 0.2];
  let s = [x0, ...x0.map((_, k) => x0.map((v, j) => (j === k ? v + st[k] : v)))].map((v) => ({ v, y: sse(v) }));
  for (let it = 0; it < 4000; it++) {
    s.sort((a, b) => a.y - b.y);
    if (it > 100 && Math.abs(s[4].y - s[0].y) < 1e-14) break;
    const c0 = [0, 1, 2, 3].map((j) => (s[0].v[j] + s[1].v[j] + s[2].v[j] + s[3].v[j]) / 4), wv = s[4].v;
    const at = (k: number) => { const v = c0.map((cj, j) => cj + k * (wv[j] - cj)); return { v, y: sse(v) }; };
    const r = at(-1);
    if (r.y < s[0].y) { const e = at(-2); s[4] = e.y < r.y ? e : r; }
    else if (r.y < s[3].y) s[4] = r;
    else { const k = at(r.y < s[4].y ? -0.5 : 0.5); if (k.y < Math.min(r.y, s[4].y)) s[4] = k; else s = [s[0], ...s.slice(1).map((p) => { const v = p.v.map((x, j) => (x + s[0].v[j]) / 2); return { v, y: sse(v) }; })]; }
  }
  s.sort((a, b) => a.y - b.y); const v = s[0].v;
  return { Ecorr: v[0], icorr: 10 ** v[1], ba: Math.exp(v[2]), bc: Math.exp(v[3]), rms: Math.sqrt(s[0].y / w.length), n: w.length };
}

/** ASTM G102: corrosion (penetration) rate in mm/year and mass loss rate in g/(m²·day) from icorr in µA/cm². */
export const rateMmY = (icorrUAcm2: number, EW: number, rho: number) => (3.27e-3 * icorrUAcm2 * EW) / rho;
export const massRate = (icorrUAcm2: number, EW: number) => 8.954e-3 * icorrUAcm2 * EW;
export const MM_TO_MPY = 1 / 0.0254;

/** Equivalent weights and densities (ASTM G102 values and pure metals at their usual valence). */
export const METALS = [
  { id: 'Fe', name: 'Iron or carbon steel (Fe²⁺)', EW: 27.92, rho: 7.87 },
  { id: '304', name: 'Stainless steel 304', EW: 25.12, rho: 7.94 },
  { id: '316', name: 'Stainless steel 316', EW: 25.5, rho: 8.0 },
  { id: 'Al', name: 'Aluminium (Al³⁺)', EW: 8.99, rho: 2.7 },
  { id: 'Cu', name: 'Copper (Cu²⁺)', EW: 31.77, rho: 8.96 },
  { id: 'Zn', name: 'Zinc (Zn²⁺)', EW: 32.69, rho: 7.13 },
  { id: 'Mg', name: 'Magnesium (Mg²⁺)', EW: 12.15, rho: 1.74 },
  { id: 'Ni', name: 'Nickel (Ni²⁺)', EW: 29.35, rho: 8.9 },
  { id: 'Ti', name: 'Titanium (Ti⁴⁺)', EW: 11.97, rho: 4.51 },
  { id: 'Sn', name: 'Tin (Sn²⁺)', EW: 59.36, rho: 7.29 },
  { id: 'Pb', name: 'Lead (Pb²⁺)', EW: 103.6, rho: 11.34 },
];

/** Simulated polarisation curve for steel in neutral chloride: Ecorr −0.650 V (vs SCE), icorr 10 µA/cm²,
 *  βa 60 and βc 120 mV/decade, scanned from −0.90 to −0.40 V in 1 mV steps; current in A/cm². */
export function exampleCurve() {
  const rows: [number, number][] = [];
  for (let k = 0; k <= 500; k++) { const E = -0.9 + k * 0.001; rows.push([+E.toFixed(3), +(bv(E, -0.65, 1e-5, 0.06, 0.12) * (1 + 0.01 * Math.sin(k * 2.1))).toPrecision(5)]); }
  return rows;
}
