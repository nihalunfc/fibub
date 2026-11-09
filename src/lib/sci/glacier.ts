// Glacier and frozen-ground basics, written by fibub from the textbook formulas. No DOM.
// 1. Mass balance from stakes: point balance b = Δh·ρ/ρw (m water equivalent), a balance profile b(z) (straight-line
//    fit or the stakes joined), band balances (the profile averaged over each elevation band), the glacier-wide
//    balance B = Σ bᵢAᵢ / ΣAᵢ, the equilibrium-line altitude (ELA, where b(z) = 0) and the accumulation-area ratio
//    (AAR, the share of the area where b > 0, with area spread evenly within a band).
// 2. Glen's flow law ε̇ = A τⁿ for ice flowing down an even slope (laminar flow, parallel-sided slab):
//    driving stress τ(z) = f ρ g (H − z) sin α, basal shear stress τb = f ρ g H sin α, and the deformation velocity
//    u(z) = ub + 2A/(n+1) (f ρ g sin α)ⁿ (Hⁿ⁺¹ − (H − z)ⁿ⁺¹), z the height above the bed.
// 3. Stefan's equation for the active-layer (seasonal thaw) depth: Z = √(2 k nₜ I / (ρw Lf θ)), I the thawing index.

export const RHO_W = 1000;           // kg/m³, water
export const LF = 333_550;           // J/kg, latent heat of fusion of ice at 0 °C
export const YEAR = 365.25 * 86400;  // s

// ---- 1. Mass balance ------------------------------------------------------------------------------------------
export type Stake = { name: string; z: number; b: number };
export type Band = { lo: number; hi: number; area: number };
export type Profile = 'linear' | 'join';

/** Point balance in m w.e. from a surface height change (m, + gain) and the density (kg/m³) of what changed. */
export const pointBalance = (dh: number, rho: number) => (dh * rho) / RHO_W;

/** Least-squares line b = a + g z through the stakes. */
export function fitLine(st: Stake[]): { a: number; g: number; r2: number } {
  const n = st.length, mz = st.reduce((s, x) => s + x.z, 0) / n, mb = st.reduce((s, x) => s + x.b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const x of st) { sxy += (x.z - mz) * (x.b - mb); sxx += (x.z - mz) ** 2; syy += (x.b - mb) ** 2; }
  const g = sxx > 0 ? sxy / sxx : 0;
  return { a: mb - g * mz, g, r2: syy > 0 && sxx > 0 ? (sxy * sxy) / (sxx * syy) : 1 };
}

/** Stakes at the same elevation averaged, sorted by elevation (for joining). */
export function knots(st: Stake[]): { z: number; b: number }[] {
  const m = new Map<number, number[]>();
  for (const s of st) (m.get(s.z) ?? m.set(s.z, []).get(s.z)!).push(s.b);
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([z, v]) => ({ z, b: v.reduce((p, q) => p + q, 0) / v.length }));
}

/** The balance profile b(z): a line, or the stakes joined with the end segments carried on beyond them. */
export function profileFn(st: Stake[], kind: Profile): (z: number) => number {
  if (kind === 'linear') { const { a, g } = fitLine(st); return (z) => a + g * z; }
  const k = knots(st);
  if (k.length === 1) return () => k[0].b;
  return (z) => {
    let i = 0;
    while (i < k.length - 2 && z > k[i + 1].z) i++;
    const p = k[i], q = k[i + 1];
    return p.b + ((q.b - p.b) * (z - p.z)) / (q.z - p.z);
  };
}

/** Mean of f over [lo, hi]: exact for a line or joined stakes (Simpson on each piece between knots). */
export function meanOver(f: (z: number) => number, lo: number, hi: number, breaks: number[] = []): number {
  if (hi <= lo) return f(lo);
  const pts = [lo, ...breaks.filter((x) => x > lo && x < hi).sort((a, b) => a - b), hi];
  let s = 0;
  for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1]; s += ((b - a) * (f(a) + 4 * f((a + b) / 2) + f(b))) / 6; }
  return s / (hi - lo);
}

export type BandResult = Band & { b: number; vol: number; above: number };
export type MassBalance = {
  bands: BandResult[]; area: number; B: number; volume: number; ela: number | null; elaNote: string;
  aar: number | null; grad: number; r2: number; prof: (z: number) => number;
};

/** Everything from stakes, bands and the profile choice. Areas in km², balances in m w.e., volume in 10⁶ m³ w.e. */
export function massBalance(st: Stake[], bands: Band[], kind: Profile): MassBalance {
  if (st.length < 2) throw new Error('Enter at least two stakes.');
  if (kind === 'linear' && new Set(st.map((s) => s.z)).size < 2) throw new Error('The stakes need at least two different elevations.');
  if (kind === 'join' && knots(st).length < 2) throw new Error('The stakes need at least two different elevations.');
  if (!bands.length) throw new Error('Enter at least one elevation band.');
  for (const b of bands) {
    if (!(b.hi > b.lo)) throw new Error(`A band's top must be above its bottom (${b.lo} to ${b.hi} m).`);
    if (!(b.area >= 0)) throw new Error('Band areas must be 0 or more.');
  }
  const sorted = [...bands].sort((a, b) => a.lo - b.lo);
  for (let i = 1; i < sorted.length; i++) if (sorted[i].lo < sorted[i - 1].hi - 1e-9) throw new Error(`Bands overlap (${sorted[i - 1].lo}–${sorted[i - 1].hi} m and ${sorted[i].lo}–${sorted[i].hi} m).`);
  const area = sorted.reduce((s, b) => s + b.area, 0);
  if (!(area > 0)) throw new Error('The band areas add up to zero.');
  const prof = profileFn(st, kind), brk = kind === 'join' ? knots(st).map((k) => k.z) : [];
  const ela = findEla(prof, sorted[0].lo, sorted[sorted.length - 1].hi, brk);
  const res: BandResult[] = sorted.map((b) => {
    const bb = meanOver(prof, b.lo, b.hi, brk);
    // Accumulation area in this band: where b(z) > 0, with the area spread evenly through the band.
    const above = b.area * fracAbove(prof, b.lo, b.hi, brk);
    return { ...b, b: bb, vol: bb * b.area, above };
  });
  const B = res.reduce((s, b) => s + b.vol, 0) / area;
  const { g, r2 } = fitLine(st);
  return {
    bands: res, area, B, volume: B * area, ela: ela.z, elaNote: ela.note,
    aar: res.reduce((s, b) => s + b.above, 0) / area, grad: g, r2, prof,
  };
}

/** Share of [lo, hi] where the profile is positive (exact for piecewise-straight profiles). */
function fracAbove(f: (z: number) => number, lo: number, hi: number, brk: number[]): number {
  const pts = [lo, ...brk.filter((x) => x > lo && x < hi).sort((a, b) => a - b), hi];
  let pos = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i], b = pts[i + 1], fa = f(a), fb = f(b);
    if (fa >= 0 && fb >= 0) pos += b - a;
    else if (fa > 0 || fb > 0) { const z0 = a + (fa * (b - a)) / (fa - fb); pos += fa > 0 ? z0 - a : b - z0; }
  }
  return pos / (hi - lo);
}

/** The equilibrium line: the highest elevation where b(z) crosses from negative (below) to positive (above). */
export function findEla(f: (z: number) => number, lo: number, hi: number, brk: number[] = []): { z: number | null; note: string; allPositive: boolean } {
  const pts = [lo, ...brk.filter((x) => x > lo && x < hi).sort((a, b) => a - b), hi];
  let z: number | null = null, n = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i], b = pts[i + 1], fa = f(a), fb = f(b);
    if ((fa <= 0 && fb > 0) || (fa < 0 && fb >= 0)) { z = a + (fa * (b - a)) / (fa - fb); n++; }
    else if ((fa > 0 && fb <= 0) || (fa >= 0 && fb < 0)) n++;
  }
  if (z != null) return { z, note: n > 1 ? 'The profile crosses zero more than once; the highest upward crossing is used.' : '', allPositive: false };
  const allPositive = f(lo) > 0 && f(hi) > 0, allNegative = f(lo) < 0 && f(hi) < 0 && n === 0;
  if (!allPositive && !allNegative) return { z: null, note: 'The balance falls with height here, so there is no equilibrium line with loss below and gain above.', allPositive };
  return { z: null, note: allPositive ? 'The whole glacier gains mass: the equilibrium line is below the lowest band.' : 'The whole glacier loses mass: the equilibrium line is above the highest band.', allPositive };
}

// ---- 2. Glen's flow law -----------------------------------------------------------------------------------------
export type Flow = { H: number; slopeDeg: number; rho: number; g: number; A: number; n: number; f: number; ub: number };
export type FlowResult = { tau: number; us: number; usDef: number; umean: number; q: number; strainBed: number };

/** Basal shear stress (Pa). */
export const basalStress = (p: Flow) => p.f * p.rho * p.g * p.H * Math.sin((p.slopeDeg * Math.PI) / 180);
/** Velocity (m/yr) at height z above the bed. A in Pa⁻ⁿ s⁻¹, ub (sliding) in m/yr. */
export function velocityAt(p: Flow, z: number): number {
  const s = p.f * p.rho * p.g * Math.sin((p.slopeDeg * Math.PI) / 180);
  const d = Math.max(0, p.H - Math.min(Math.max(z, 0), p.H));
  return p.ub + ((2 * p.A) / (p.n + 1)) * s ** p.n * (p.H ** (p.n + 1) - d ** (p.n + 1)) * YEAR;
}
export function flow(p: Flow): FlowResult {
  if (!(p.H > 0)) throw new Error('Ice thickness must be more than 0.');
  if (!(p.slopeDeg > 0 && p.slopeDeg < 90)) throw new Error('The surface slope must be between 0 and 90 degrees.');
  if (!(p.A > 0)) throw new Error('The rate factor A must be more than 0.');
  if (!(p.n >= 1 && p.n <= 5)) throw new Error('Use a flow-law exponent n from 1 to 5 (3 is usual).');
  if (!(p.f > 0 && p.f <= 1)) throw new Error('The shape factor must be more than 0 and at most 1.');
  if (!(p.rho > 0) || !(p.g > 0)) throw new Error('Density and gravity must be more than 0.');
  if (!(p.ub >= 0)) throw new Error('Sliding speed must be 0 or more.');
  const tau = basalStress(p);
  const usDef = ((2 * p.A) / (p.n + 1)) * tau ** p.n * p.H * YEAR;
  const umean = p.ub + ((p.n + 1) / (p.n + 2)) * usDef;
  return { tau, us: p.ub + usDef, usDef, umean, q: umean * p.H, strainBed: p.A * tau ** p.n * YEAR };
}

// ---- 3. Stefan active-layer depth -------------------------------------------------------------------------------
export type Stefan = { I: number; nt: number; k: number; theta: number };
/** Thaw depth (m) from a thawing index I (°C·days), n-factor, thawed conductivity k (W/m/K), water content θ (m³/m³). */
export function stefanDepth(p: Stefan): number {
  if (!(p.I >= 0)) throw new Error('The thawing index must be 0 or more.');
  if (!(p.nt > 0)) throw new Error('The n-factor must be more than 0.');
  if (!(p.k > 0)) throw new Error('Thermal conductivity must be more than 0.');
  if (!(p.theta > 0 && p.theta <= 1)) throw new Error('Water content must be more than 0 and at most 1.');
  return Math.sqrt((2 * p.k * p.nt * p.I * 86400) / (RHO_W * LF * p.theta));
}
/** Thawing index (°C·days) from 12 monthly mean air temperatures: the sum of positive means × days in the month. */
export function thawIndex(monthly: number[]): number {
  const D = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (monthly.length !== 12 || monthly.some((t) => !Number.isFinite(t))) throw new Error('Enter 12 monthly mean temperatures.');
  return monthly.reduce((s, t, i) => s + Math.max(0, t) * D[i], 0);
}

// ---- Made-up examples -------------------------------------------------------------------------------------------
/** Made-up stakes (not a real glacier): name, elevation (m), surface change (m), density (kg/m³). */
export const EX_STAKES = `Stake,Elevation (m),Change (m),Density (kg/m3)
S1,2480,-3.6,900
S2,2560,-3.1,900
S3,2650,-2.4,900
S4,2740,-1.9,900
S5,2830,-1.2,900
S6,2920,-0.5,900
S7,3010,0.4,550
S8,3120,1.6,520
S9,3230,2.2,500
S10,3330,2.5,480`;
/** Made-up elevation bands (bottom, top, area km²). */
export const EX_BANDS = `Bottom (m),Top (m),Area (km2)
2450,2550,0.42
2550,2650,0.61
2650,2750,0.88
2750,2850,1.10
2850,2950,1.25
2950,3050,1.05
3050,3150,0.80
3150,3250,0.52
3250,3350,0.31`;
