// Linear magnetic circuits: cores and air gaps as reluctances, a coil leg in series with up to two return
// legs in parallel (a three-leg core). SI units: metres, square metres, amperes, webers, tesla. No DOM.
import { MU0 } from './ph-coil.ts';

export type Seg = { kind: 'core' | 'gap'; len: number; area: number; mr: number };
export type Leg = Seg[];

/** Area a gap's flux really uses when fringing is allowed for: a square pole of side √A grown by the gap length on each side, (√A + g)². */
export const fringeArea = (area: number, g: number) => Math.pow(Math.sqrt(area) + g, 2);
export const effArea = (s: Seg, fringe: boolean) => (s.kind === 'gap' && fringe ? fringeArea(s.area, s.len) : s.area);
/** Reluctance l / (μ0 μr A), in ampere-turns per weber (1/H). */
export const reluctance = (s: Seg, fringe = false) => s.len / (MU0 * s.mr * effArea(s, fringe));
export const legReluctance = (L: Leg, fringe = false) => L.reduce((t, s) => t + reluctance(s, fringe), 0);

export type SegResult = Seg & { R: number; phi: number; B: number; H: number; mmf: number; aEff: number };
export type Solved = { Rtot: number; phi: number; legs: { R: number; phi: number; segs: SegResult[] }[]; L: number; energy: number; ni: number };

/**
 * Solve the circuit for N I ampere-turns on the first leg. With no return legs the first leg is the whole
 * closed path; with one or two, they share the flux in inverse proportion to their reluctances.
 */
export function solve(coil: Leg, returns: Leg[], N: number, I: number, fringe = false): Solved {
  const Rc = legReluctance(coil, fringe), Rr = returns.map((l) => legReluctance(l, fringe));
  const Rpar = Rr.length ? 1 / Rr.reduce((s, r) => s + 1 / r, 0) : 0;
  const Rtot = Rc + Rpar, ni = N * I, phi = ni / Rtot;
  const legFlux = [phi, ...Rr.map((r) => (phi * Rpar) / r)];
  const legs = [coil, ...returns].map((L, i) => ({
    R: i === 0 ? Rc : Rr[i - 1], phi: legFlux[i],
    segs: L.map((s) => { const R = reluctance(s, fringe), aEff = effArea(s, fringe), B = legFlux[i] / aEff; return { ...s, R, phi: legFlux[i], B, H: B / (MU0 * s.mr), mmf: legFlux[i] * R, aEff }; }),
  }));
  const L = (N * N) / Rtot;
  return { Rtot, phi, legs, L, energy: 0.5 * L * I * I, ni };
}

/** Pull between the two faces of a gap carrying flux density B over area A: F = B² A / (2 μ0) newtons. */
export const gapForce = (B: number, A: number) => (B * B * A) / (2 * MU0);

/** Ampere-turns needed for flux density `B` in segment `si` of leg `li` (linear circuit, so it scales). */
export function ampereTurnsFor(coil: Leg, returns: Leg[], li: number, si: number, B: number, fringe = false): number {
  const s = solve(coil, returns, 1, 1, fringe);
  return B / s.legs[li].segs[si].B;
}

/** Read a leg from text: one segment per line, "core <length mm> <area mm²> <μr>" or "gap <length mm> <area mm²>". */
export function parseLeg(text: string): Leg | string {
  const out: Leg = [];
  const lines = text.split('\n').map((l) => l.replace(/#.*/, '').trim()).filter(Boolean);
  for (const [i, l] of lines.entries()) {
    const p = l.split(/[\s,;]+/), kind = p[0].toLowerCase();
    if (kind !== 'core' && kind !== 'gap') return `line ${i + 1}: start with "core" or "gap"`;
    const v = p.slice(1).map((x) => Number(x.replace('−', '-')));
    if (v.length < (kind === 'core' ? 3 : 2) || v.slice(0, kind === 'core' ? 3 : 2).some((x) => !(x > 0))) return kind === 'core' ? `line ${i + 1}: give core length (mm), area (mm²) and μr, all above 0` : `line ${i + 1}: give gap length (mm) and area (mm²), both above 0`;
    out.push({ kind, len: v[0] / 1000, area: v[1] / 1e6, mr: kind === 'core' ? v[2] : 1 });
  }
  return out;
}
