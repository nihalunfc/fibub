// Wind-driven and geostrophic ocean currents from textbook dynamics: Coriolis parameter, bulk wind stress,
// Ekman transport, depth, surface current and spiral, coastal upwelling and Ekman pumping from wind stress curl,
// geostrophic current from a sea-surface slope, thermal-wind shear across a two-station section (from density
// or dynamic height), and Rossby radii. Directions are compass bearings (degrees clockwise from north) in which
// the water or air is moving, except the wind input, which follows the weather convention (where it blows from).
// Plain TypeScript, no DOM.

export const OMEGA = 7.2921159e-5; // Earth's rotation rate, rad/s
export const G = 9.81;
const RAD = Math.PI / 180;
const wrap = (b: number) => ((b % 360) + 360) % 360;

/** Coriolis parameter f = 2Ω sin φ (1/s). */
export const coriolis = (latDeg: number) => 2 * OMEGA * Math.sin(latDeg * RAD);
/** Bulk formula: wind stress τ = ρ_air · C_d · U² (N/m²). */
export const windStress = (U: number, rhoAir: number, cd: number) => rhoAir * cd * U * U;

export type Vec = { x: number; y: number };
/** East and north components of a value moving towards `bearing`. */
export const vecTo = (mag: number, bearing: number): Vec => ({ x: mag * Math.sin(bearing * RAD), y: mag * Math.cos(bearing * RAD) });
export const bearingOf = (v: Vec) => wrap(Math.atan2(v.x, v.y) / RAD);
export const mag = (v: Vec) => Math.hypot(v.x, v.y);

export type Ekman = {
  f: number; tau: number; tauVec: Vec;
  /** Volume transport per metre of width (m²/s) and its vector. */
  M: number; Mvec: Vec; Mbearing: number;
  /** Ekman depth π√(2A_z/|f|) (m), surface current τ/(ρ√(A_z|f|)) (m/s) and its bearing. */
  depth: number; V0: number; V0bearing: number;
  /** Empirical (Ekman 1905, as in Pond and Pickard) for comparison: V0 = 0.0127 U/√sin|φ|, D = 4.3 U/√sin|φ|. */
  V0emp: number; depthEmp: number;
  /** +1 northern hemisphere (to the right of the wind), −1 southern. */
  side: 1 | -1;
};
export function ekman(latDeg: number, U: number, windFrom: number, rhoAir: number, cd: number, rhoW: number, Az: number): Ekman {
  const f = coriolis(latDeg), tau = windStress(U, rhoAir, cd), to = wrap(windFrom + 180), tauVec = vecTo(tau, to);
  // Transport is (τy, −τx)/(ρ f): 90° to the right of the stress where f > 0, to the left where f < 0.
  const Mvec = { x: tauVec.y / (rhoW * f), y: -tauVec.x / (rhoW * f) };
  const side: 1 | -1 = f >= 0 ? 1 : -1;
  const s = Math.sqrt(Math.abs(Math.sin(latDeg * RAD)));
  return {
    f, tau, tauVec, M: tau / (rhoW * Math.abs(f)), Mvec, Mbearing: bearingOf(Mvec),
    depth: Math.PI * Math.sqrt((2 * Az) / Math.abs(f)), V0: tau / (rhoW * Math.sqrt(Az * Math.abs(f))), V0bearing: wrap(to + side * 45),
    V0emp: (0.0127 * U) / s, depthEmp: (4.3 * U) / s, side,
  };
}

/** The Ekman spiral: speed and bearing at depth z (m, positive down). */
export function spiralAt(e: Ekman, windTo: number, z: number) {
  const k = Math.PI / e.depth;
  return { speed: e.V0 * Math.exp(-k * z), bearing: wrap(windTo + e.side * (45 + (k * z) / RAD)) };
}

export type Coastal = {
  offshore: number; alongshore: number; w: number; upwelling: boolean;
};
/** Ekman transport across a straight coast. `offshoreBearing` points from the coast out to sea; w = offshore
 *  transport ÷ the width of the upwelling zone (m/s, positive up). */
export function coastal(e: Ekman, offshoreBearing: number, widthM: number): Coastal {
  const n = vecTo(1, offshoreBearing), s = vecTo(1, offshoreBearing - 90);
  const off = e.Mvec.x * n.x + e.Mvec.y * n.y;
  return { offshore: off, alongshore: e.tauVec.x * s.x + e.tauVec.y * s.y, w: off / widthM, upwelling: off > 0 };
}

/** Ekman pumping from the change of wind stress with distance offshore (wind direction the same at both points):
 *  curl τ = (n_x Δτ_y − n_y Δτ_x)/d, w_E = curl τ/(ρ f) (m/s, positive up). The β term is left out. */
export function ekmanPumping(latDeg: number, tauCoast: Vec, tauOff: Vec, offshoreBearing: number, distM: number, rhoW: number) {
  const n = vecTo(1, offshoreBearing);
  const curl = (n.x * (tauOff.y - tauCoast.y) - n.y * (tauOff.x - tauCoast.x)) / distM;
  return { curl, w: curl / (rhoW * coriolis(latDeg)) };
}

/** Geostrophic surface current from the sea-surface slope: u = −(g/f) ∂η/∂y, v = (g/f) ∂η/∂x. */
export function geostrophicSSH(latDeg: number, dEtaEast: number, dxEast: number, dEtaNorth: number, dyNorth: number) {
  const f = coriolis(latDeg);
  const gx = dxEast > 0 ? dEtaEast / dxEast : 0, gy = dyNorth > 0 ? dEtaNorth / dyNorth : 0;
  const v: Vec = { x: (-G / f) * gy, y: (G / f) * gx };
  return { f, u: v.x, v: v.y, speed: mag(v), bearing: bearingOf(v) };
}

export type SectionRow = { depth: number; a: number; b: number };
export type Shear = { depth: number; v: number }[];
/** Thermal wind across stations A and B, `L` metres apart. With density (kg/m³): v(z) = v_ref − g/(ρ₀ f L) ∫_z^{z_ref}
 *  (ρ_B − ρ_A) dz. With dynamic height (dynamic metres, 1 dyn m = 10 J/kg): v = 10 (D_B − D_A)/(f L) + v_ref.
 *  v is across the section, positive to the left of the direction A → B. Trapezoid rule between depths. */
export function thermalWind(rows: SectionRow[], latDeg: number, L: number, mode: 'density' | 'dynamic', refDepth: number, vRef: number, rho0: number): Shear {
  const f = coriolis(latDeg);
  const r = [...rows].sort((p, q) => p.depth - q.depth);
  if (mode === 'dynamic') {
    const at = (d: number) => interp(r, d, (x) => x.b - x.a);
    const ref = at(refDepth);
    return r.map((x) => ({ depth: x.depth, v: (10 * (x.b - x.a - ref)) / (f * L) + vRef }));
  }
  // Cumulative integral of Δρ from the top down, then v(z) = vRef − k (I(ref) − I(z)).
  const I: number[] = [0];
  for (let i = 1; i < r.length; i++) I.push(I[i - 1] + ((r[i].b - r[i].a + r[i - 1].b - r[i - 1].a) / 2) * (r[i].depth - r[i - 1].depth));
  const Iref = interpArr(r.map((x) => x.depth), I, refDepth);
  const k = G / (rho0 * f * L);
  return r.map((x, i) => ({ depth: x.depth, v: vRef - k * (Iref - I[i]) }));
}
function interpArr(xs: number[], ys: number[], x: number) {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + ((ys[i] - ys[i - 1]) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
  return ys[ys.length - 1];
}
function interp(r: SectionRow[], d: number, f: (x: SectionRow) => number) { return interpArr(r.map((x) => x.depth), r.map(f), d); }

/** Rossby radii (m): barotropic √(gH)/|f|; two-layer baroclinic √(g' h₁h₂/(h₁+h₂))/|f| with g' = gΔρ/ρ₀; and NH/(π|f|). */
export function rossby(latDeg: number, H: number, h1: number, dRho: number, rho0: number, N: number) {
  const f = Math.abs(coriolis(latDeg));
  const gp = (G * dRho) / rho0, he = h1 > 0 && H > h1 ? (h1 * (H - h1)) / H : NaN;
  return { barotropic: Math.sqrt(G * H) / f, gPrime: gp, twoLayer: Math.sqrt(gp * he) / f, fromN: N > 0 ? (N * H) / (Math.PI * f) : NaN, cBaroclinic: Math.sqrt(gp * he) };
}

/** Read "depth, A, B" rows (a header row is skipped). */
export function readSection(text: string): { rows: SectionRow[]; errors: string[] } {
  const rows: SectionRow[] = [], errors: string[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line, i) => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const c = t.split(/[\t,;]+|\s+/).filter(Boolean).map((s) => Number(s.replace('−', '-')));
    if (c.length < 3 || c.slice(0, 3).some((x) => !Number.isFinite(x))) { if (!rows.length && /[a-z]/i.test(t)) return; errors.push(`Line ${i + 1}: needs three numbers: depth, station A, station B.`); return; }
    if (c[0] < 0) { errors.push(`Line ${i + 1}: depth is positive downwards.`); return; }
    rows.push({ depth: c[0], a: c[1], b: c[2] });
  });
  const ds = rows.map((r) => r.depth);
  if (new Set(ds).size !== ds.length) errors.push('Each depth may appear only once.');
  return { rows, errors };
}

/** A made-up two-station density section across a current (density in kg/m³). */
export const SECTION_EXAMPLE = `depth_m, rho_A, rho_B
0, 1025.00, 1025.60
100, 1025.60, 1026.20
200, 1026.10, 1026.60
400, 1026.80, 1027.10
600, 1027.20, 1027.35
800, 1027.45, 1027.50
1000, 1027.60, 1027.60`;
