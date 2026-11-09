// Osmosis teaching model for the osmosis lab (school biology). Plain maths, no DOM.
// Water potential: psi = psi_s + psi_p, with psi_s = -i C R T (van 't Hoff) in MPa when C is in mol/L.
// A cell's water volume is x times its volume at zero turgor (x = 1). Below x = 1 the cell shrinks freely
// (plant: the membrane pulls away from the wall, plasmolysis); above it a plant wall pushes back with
// turgor P = eps (x - 1), and an animal cell (no wall) swells until it bursts at x = burstAt.
// All cell values are made-up round numbers for teaching; real tissue varies.

export const R_MPA = 0.008314462618; // gas constant in MPa·L/(mol·K) (8.314 J/(mol·K), CODATA 2018)
export const RT = (tC: number) => R_MPA * (tC + 273.15);

export type Kind = 'plant' | 'animal';
export type Specimen = { id: string; name: string; kind: Kind; osm: number; eps: number; f: number; tau: number; burstAt: number; unit: string };
// osm: osmotic concentration of the cell sap (osmol/L); eps: wall stiffness (MPa); f: share of mass that is
// water free to move (so % mass change = 100 f (x - 1)); tau: time constant in minutes.
export const SPECIMENS: Specimen[] = [
  { id: 'potato', name: 'Potato cylinder', kind: 'plant', osm: 0.3, eps: 4, f: 0.5, tau: 12, burstAt: Infinity, unit: 'mass' },
  { id: 'raisin', name: 'Raisin', kind: 'plant', osm: 2, eps: 1, f: 0.5, tau: 90, burstAt: Infinity, unit: 'mass' },
  { id: 'onion', name: 'Onion peel cell', kind: 'plant', osm: 0.4, eps: 5, f: 0.8, tau: 2, burstAt: Infinity, unit: 'volume' },
  { id: 'rbc', name: 'Red blood cell', kind: 'animal', osm: 0.3, eps: 0, f: 0.9, tau: 0.05, burstAt: 1.6, unit: 'volume' },
];
export type Solute = { id: string; name: string; i: number };
// i: van 't Hoff factor (particles per formula unit, ideal). Salt splits into Na+ and Cl-.
export const SOLUTES: Solute[] = [
  { id: 'sucrose', name: 'Sugar (sucrose)', i: 1 },
  { id: 'salt', name: 'Salt (NaCl)', i: 2 },
];

export type Tonicity = 'hypotonic' | 'isotonic' | 'hypertonic';
export type State = 'turgid' | 'flaccid' | 'plasmolysed' | 'swollen' | 'normal' | 'shrunk' | 'burst';
export type Result = {
  x: number; change: number; P: number; psiS: number; psiCell0: number; psiOut: number; psi: number;
  tonicity: Tonicity; state: State; flow: 'in' | 'out' | 'none'; outOsm: number;
};

/** Relative water volume at equilibrium for sap osmolarity osm (at x = 1), outside osmolarity out, wall eps. */
export function eqVolume(osm: number, out: number, eps: number, tC = 25): number {
  const a = RT(tC);
  if (out >= osm) return out > 0 ? osm / out : 1; // shrinks freely: osm/x = out
  if (eps <= 0) return out > 0 ? osm / out : Infinity; // no wall: swells until osm/x = out
  // osm a / x - eps (x - 1) = out a  ->  eps x^2 + (out a - eps) x - osm a = 0
  const b = out * a - eps;
  return (-b + Math.sqrt(b * b + 4 * eps * osm * a)) / (2 * eps);
}

/** Equilibrium of a specimen in a solution of concentration c (mol/L) of the solute. */
export function equilibrium(sp: Specimen, sol: Solute, c: number, tC = 25): Result {
  const out = sol.i * c, a = RT(tC);
  let x = eqVolume(sp.osm, out, sp.eps, tC);
  const burst = sp.kind === 'animal' && x >= sp.burstAt;
  if (burst) x = sp.burstAt;
  const P = sp.kind === 'plant' && x > 1 ? sp.eps * (x - 1) : 0;
  const psiS = -(sp.osm / x) * a, psiOut = -out * a;
  const rel = (out - sp.osm) / sp.osm;
  const tonicity: Tonicity = Math.abs(rel) < 0.03 ? 'isotonic' : rel < 0 ? 'hypotonic' : 'hypertonic';
  const state: State = sp.kind === 'plant'
    ? (x > 1.005 ? 'turgid' : x >= 0.97 ? 'flaccid' : 'plasmolysed')
    : burst ? 'burst' : x > 1.03 ? 'swollen' : x >= 0.97 ? 'normal' : 'shrunk';
  const flow = tonicity === 'isotonic' ? 'none' : tonicity === 'hypotonic' ? 'in' : 'out';
  return { x, change: 100 * sp.f * (x - 1), P, psiS, psiCell0: -sp.osm * a, psiOut, psi: psiS + P, tonicity, state, flow, outOsm: out };
}

/** Relative water volume t minutes after the specimen is dropped in (starting at x = 1). */
export function volumeAt(sp: Specimen, xEq: number, t: number): number {
  return xEq + (1 - xEq) * Math.exp(-t / sp.tau);
}

/** Solute concentration (mol/L) that is isotonic with the specimen's sap. */
export const isotonicConc = (sp: Specimen, sol: Solute) => sp.osm / sol.i;

/** Where a measured % change crosses zero (straight line between the two points either side), as read off
 *  a graph: the concentration that is isotonic with the cell sap. NaN when the readings never change sign. */
export function crossZero(xs: number[], ys: number[]): number {
  for (let j = 1; j < xs.length; j++) {
    const [y0, y1] = [ys[j - 1], ys[j]];
    if (y0 === 0) return xs[j - 1];
    if (y0 * y1 < 0 || y1 === 0) return xs[j - 1] + (xs[j] - xs[j - 1]) * y0 / (y0 - y1);
  }
  return NaN;
}

/** A small seeded random generator (mulberry32) so a practical run can be repeated in tests. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Normal random number from a uniform generator (Box-Muller). */
export const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());

/** A virtual practical: start mass (g) and mass after soaking for each concentration, with scale noise. */
export function practical(sp: Specimen, sol: Solute, concs: number[], r: () => number, tC = 25) {
  return concs.map((c) => {
    const m0 = Math.round((2.5 + r()) * 100) / 100;
    const ch = equilibrium(sp, sol, c, tC).change + 1.2 * gauss(r);
    const m1 = Math.round(m0 * (1 + ch / 100) * 100) / 100;
    return { c, m0, m1, change: (100 * (m1 - m0)) / m0 };
  });
}
