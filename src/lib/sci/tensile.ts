// Tensile test (stress-strain) analysis: engineering stress and strain from force and extension, Young's modulus
// from a straight-line fit over a chosen stress range, offset (proof) yield strength, tensile strength, uniform and
// fracture elongation, toughness (area under the curve), modulus of resilience, true stress and strain up to the
// tensile strength and the Hollomon strain-hardening exponent. Definitions follow the usual textbook forms
// (Callister, Materials Science and Engineering, ch. 6; Dieter, Mechanical Metallurgy, ch. 8) and the methods
// named in ASTM E8/E8M, E111 and E646 and ISO 6892-1 (fibub's own code, not copied from those documents).
import { fitLine } from './fit.ts';

export const FORCE = { N: 1, kN: 1000, lbf: 4.4482216152605 } as const;
export const LENGTH = { mm: 1, in: 25.4 } as const;
export const STRESS = { MPa: 1, ksi: 6.894757293168361, psi: 0.006894757293168361 } as const;

/** Cross-section area in mm² of a flat (width × thickness) or round (diameter) specimen. */
export const areaOf = (shape: 'flat' | 'round', a: number, b = 0) => (shape === 'round' ? (Math.PI * a * a) / 4 : a * b);

/** Engineering stress (MPa) and strain (mm/mm) from force (N) and extension (mm). */
export function engineering(force: number[], ext: number[], areaMm2: number, gaugeMm: number) {
  return { stress: force.map((f) => f / areaMm2), strain: ext.map((d) => d / gaugeMm) };
}

/** Trapezoid area under y(x). */
export function trapz(x: number[], y: number[]): number {
  let s = 0;
  for (let i = 1; i < x.length; i++) s += ((y[i] + y[i - 1]) / 2) * (x[i] - x[i - 1]);
  return s;
}

export type Tensile = {
  E: number; intercept: number; r2: number; nFit: number; fitIdx: number[]; toe: number;
  strain: number[]; stress: number[];
  uts: number; iUts: number; eUts: number; uniformPlastic: number;
  yield: { s: number; e: number } | null; offset: number;
  fracture: { s: number; e: number; plastic: number };
  toughness: number; resilience: number | null;
  trueStrain: number[]; trueStress: number[];
  hollomon: { n: number; K: number; r2: number; pts: number } | null;
};

/**
 * Analyse an engineering stress (MPa) - strain (mm/mm) curve. The modulus is fitted to the points before the tensile
 * strength whose stress lies between lo and hi (fractions of the tensile strength). With toe = true the strain zero
 * is moved to where the fitted line crosses zero stress (toe compensation). offset is the proof strain (0.002 for
 * the 0.2 % offset yield).
 */
export function analyse(strain0: number[], stress0: number[], o: { lo: number; hi: number; offset: number; toe: boolean }): Tensile {
  const n = strain0.length;
  if (n < 5 || stress0.length !== n) throw new Error('Need at least five points of stress and strain.');
  let iUts = 0;
  for (let i = 1; i < n; i++) if (stress0[i] > stress0[iUts]) iUts = i;
  const uts = stress0[iUts];
  if (!(uts > 0)) throw new Error('The stress never rises above zero.');
  const fitIdx: number[] = [];
  for (let i = 0; i <= iUts; i++) if (stress0[i] >= o.lo * uts && stress0[i] <= o.hi * uts) fitIdx.push(i);
  // Only the first climb through the range (later points could be a second loading or the plastic part).
  const run: number[] = [];
  for (const i of fitIdx) { if (run.length && i !== run[run.length - 1] + 1) break; run.push(i); }
  if (run.length < 3) throw new Error('Fewer than three points lie in the modulus range: widen it.');
  const L = fitLine(run.map((i) => strain0[i]), run.map((i) => stress0[i]));
  const E = L.slope;
  if (!(E > 0)) throw new Error('The fitted modulus is not positive: check the range and the columns.');
  const toe = o.toe ? -L.intercept / E : 0;
  // Shifted strain; points left of the new zero (the toe) are replaced by the origin.
  let strain = strain0.map((e) => e - toe), stress = stress0.slice();
  if (o.toe) {
    const map: number[] = [], s2 = [0], e2 = [0];
    for (let i = 0; i < n; i++) { if (strain[i] > 0) { map[i] = e2.length; e2.push(strain[i]); s2.push(stress[i]); } else map[i] = -1; }
    strain = e2; stress = s2;
    iUts = map[iUts];
    if (iUts < 0) throw new Error('The tensile strength lies left of the fitted line\'s zero: check the modulus range.');
    for (let j = 0; j < run.length; j++) run[j] = map[run[j]];
    run.splice(0, run.length, ...run.filter((i) => i >= 0));
  }
  const intercept = o.toe ? 0 : L.intercept;
  // Offset yield: first crossing of the curve with the line of slope E shifted by the offset strain.
  let yld: { s: number; e: number } | null = null;
  const d = (i: number) => stress[i] - (intercept + E * (strain[i] - o.offset));
  for (let i = 1; i < stress.length; i++) {
    if (d(i - 1) > 0 && d(i) <= 0) {
      const t = d(i - 1) / (d(i - 1) - d(i));
      yld = { s: stress[i - 1] + t * (stress[i] - stress[i - 1]), e: strain[i - 1] + t * (strain[i] - strain[i - 1]) };
      break;
    }
  }
  const last = stress.length - 1;
  const eUts = strain[iUts];
  const tS: number[] = [], tE: number[] = [];
  for (let i = 0; i <= iUts; i++) { tE.push(Math.log1p(strain[i])); tS.push(stress[i] * (1 + strain[i])); }
  // Hollomon σ = K εⁿ on true stress and true strain between the yield point and the tensile strength (ASTM E646 style).
  let hollomon: Tensile['hollomon'] = null;
  if (yld) {
    const idx = tE.map((_, i) => i).filter((i) => strain[i] > yld!.e && tE[i] > 0 && tS[i] > 0);
    if (idx.length >= 3) {
      try {
        const H = fitLine(idx.map((i) => Math.log(tE[i])), idx.map((i) => Math.log(tS[i])));
        hollomon = { n: H.slope, K: Math.exp(H.intercept), r2: H.r2, pts: idx.length };
      } catch { hollomon = null; }
    }
  }
  return {
    E, intercept, r2: L.r2, nFit: run.length, fitIdx: run, toe, strain, stress,
    uts, iUts, eUts, uniformPlastic: eUts - uts / E,
    yield: yld, offset: o.offset,
    fracture: { s: stress[last], e: strain[last], plastic: strain[last] - stress[last] / E },
    toughness: trapz(strain, stress),
    resilience: yld ? (yld.s * yld.s) / (2 * E) : null,
    trueStrain: tE, trueStress: tS, hollomon,
  };
}

/**
 * A made-up tensile test of a ductile metal (not any real alloy): E = 200 GPa, Voce hardening of true stress
 * σt = 300 + 250 (1 − e^(−12 εp)) MPa, then necking from the tensile strength on, until fracture at 26 % strain.
 * Flat specimen 12.5 × 2 mm, gauge length 50 mm. Returns force (kN) and extension (mm), with a little noise.
 */
export function exampleTest(): { force: number[]; ext: number[] } {
  const E = 200000, sy = 300, Q = 250, b = 12, A = 25, L0 = 50;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  const out: { e: number; s: number }[] = [];
  // Elastic part.
  for (let k = 0; k <= 30; k++) { const s = (sy * k) / 30; out.push({ e: s / E, s }); }
  // Plastic part, by plastic true strain.
  const eps: number[] = [];
  for (let p = 0.0005; p < 0.02; p += 0.0005) eps.push(p);
  for (let p = 0.02; p < 0.4; p += 0.0025) eps.push(p);
  let eNeck = Infinity;
  for (const ep of eps) {
    const st = sy + Q * (1 - Math.exp(-b * ep)), et = ep + st / E;
    const e = Math.expm1(et);
    let s = st / (1 + e);
    // Considère: necking starts where dσt/dεt = σt.
    if (!Number.isFinite(eNeck) && Q * b * Math.exp(-b * ep) <= st) eNeck = e;
    if (e > eNeck) s *= 1 - 6 * (e - eNeck) ** 2;
    if (e > 0.26) break;
    out.push({ e, s });
  }
  return {
    force: out.map((r, i) => +(((r.s + (i ? rnd() * 0.8 : 0)) * A) / 1000).toFixed(4)),
    ext: out.map((r, i) => +((r.e + (i ? rnd() * 2e-6 : 0)) * L0).toFixed(5)),
  };
}
