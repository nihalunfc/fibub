// Pure maths for the curriculum physics Learn tools (builder A, 2026-11-16): I-V characteristics, fission chain,
// density lab, cooling and insulation, ripple tank. No DOM. Checked in tests/curr-physics.mjs.

/** Small seeded random generator (mulberry32): the same seed always gives the same run. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------- I-V characteristics */

export type Comp = 'resistor' | 'lamp' | 'diode' | 'thermistor-cold' | 'thermistor-hot' | 'ldr-light' | 'ldr-dark';
/** Fixed resistances (ohms) for the ohmic parts. Thermistor: NTC, 1000 ohm at 20 C and 250 ohm at 60 C (model values). LDR: 300 ohm in light, 5000 ohm in dark. */
export const OHMIC: Record<string, number> = { resistor: 100, 'thermistor-cold': 1000, 'thermistor-hot': 250, 'ldr-light': 300, 'ldr-dark': 5000 };
/** Lamp model: V = R0 I (1 + |I| / I1). Cold resistance R0 = 10 ohm, I1 = 0.1 A, so R rises as it heats (about 30 ohm at 6 V). A model, not a measurement. */
export const LAMP = { R0: 10, I1: 0.1 };
/** Diode model: Shockley I = Is (exp(V / nVt) - 1) with Is = 1e-10 A, nVt = 0.04 V, in series with a 10 ohm protective resistor. */
export const DIODE = { Is: 1e-10, nVt: 0.04, Rs: 10 };

export const shockley = (vd: number) => DIODE.Is * (Math.exp(Math.min(vd, 5) / DIODE.nVt) - 1);

/** Current (A) through the part for a supply of V volts (negative V is the supply reversed). */
export function ivCurrent(c: Comp, V: number): number {
  if (c in OHMIC) return V / OHMIC[c];
  if (c === 'lamp') {
    const { R0, I1 } = LAMP, s = Math.sign(V), v = Math.abs(V);
    return (s * (-R0 + Math.sqrt(R0 * R0 + (4 * R0 * v) / I1))) / ((2 * R0) / I1);
  }
  // diode in series with Rs: solve V = Vd + I Rs for Vd by bisection (the function is increasing in Vd)
  let lo = -Math.abs(V) - 1, hi = Math.max(V, 0) + 1;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    (mid + shockley(mid) * DIODE.Rs - V < 0 ? (lo = mid) : (hi = mid));
  }
  return shockley((lo + hi) / 2);
}
/** R = V / I, or null at zero volts where the ratio has no meaning. */
export const resistanceAt = (c: Comp, V: number) => (Math.abs(V) < 1e-9 ? null : V / ivCurrent(c, V));

/* ---------------------------------------------------------------- fission chain */

export type ReactorParams = { enrich: number; rods: number; moderator: boolean };
export const GRID = 36;
export const P_FISSION_FAST = 0.12, P_FISSION_SLOW = 0.45, P_ROD = 0.6, P_PARASITIC = 0.02, P_THREE = 0.43;
export const rangeCells = (moderator: boolean) => (moderator ? 8 : 12);
export type Neutron = { x: number; y: number };
export type Path = { pts: [number, number][]; end: 'fission' | 'absorbed' | 'rod' | 'escaped' | 'passed' };
export type Reactor = { p: ReactorParams; cells: Uint8Array; rodCols: number[]; rand: () => number; neutrons: Neutron[]; gen: number; history: number[]; capped: boolean; deplete: boolean };
export const MAX_NEUTRONS = 300;

/** 0 = other nucleus (U-238 and friends), 1 = fresh U-235, 2 = already split. Control rods are whole columns. */
export function makeReactor(p: ReactorParams, seed: number, deplete = true): Reactor {
  const rand = rng(seed), cells = new Uint8Array(GRID * GRID);
  for (let i = 0; i < cells.length; i++) cells[i] = rand() < p.enrich ? 1 : 0;
  const rodCols: number[] = [];
  for (let i = 0; i < p.rods; i++) rodCols.push(Math.round(((i + 1) * GRID) / (p.rods + 1)) - 1);
  const mid = GRID / 2 + 0.5;
  return { p, cells, rodCols, rand, neutrons: [{ x: mid, y: mid }], gen: 0, history: [1], capped: false, deplete };
}

/** Follow one neutron in a straight line. Returns its path and the neutrons it leaves behind (2 or 3 if it causes fission). */
export function traceNeutron(rx: Reactor, n: Neutron): { path: Path; born: Neutron[] } {
  const { rand, cells, p } = rx, a = rand() * 2 * Math.PI, dx = Math.cos(a), dy = Math.sin(a);
  const pf = p.moderator ? P_FISSION_SLOW : P_FISSION_FAST, steps = rangeCells(p.moderator);
  const pts: [number, number][] = [[n.x, n.y]];
  let x = n.x, y = n.y, lastRod = -1;
  for (let s = 0; s < steps; s++) {
    x += dx; y += dy;
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) { pts.push([x, y]); return { path: { pts, end: 'escaped' }, born: [] }; }
    const cx = Math.floor(x), cy = Math.floor(y), i = cy * GRID + cx;
    pts.push([x, y]);
    if (rx.rodCols.includes(cx)) { if (cx !== lastRod && rand() < P_ROD) return { path: { pts, end: 'rod' }, born: [] }; lastRod = cx; } else lastRod = -1;
    if (cells[i] === 1) {
      if (rand() < pf) {
        if (rx.deplete) cells[i] = 2;
        const k = rand() < P_THREE ? 3 : 2, born: Neutron[] = [];
        for (let j = 0; j < k; j++) born.push({ x: cx + 0.5, y: cy + 0.5 });
        return { path: { pts, end: 'fission' }, born };
      }
    } else if (cells[i] === 0 && rand() < P_PARASITIC) return { path: { pts, end: 'absorbed' }, born: [] };
  }
  return { path: { pts, end: 'passed' }, born: [] };
}

/** Move every neutron of the current generation. Returns the paths drawn and which cells split (for the picture). */
export function stepGeneration(rx: Reactor): { paths: Path[]; fissions: number } {
  const paths: Path[] = [], next: Neutron[] = [];
  let fissions = 0;
  for (const n of rx.neutrons) {
    const t = traceNeutron(rx, n);
    paths.push(t.path);
    if (t.born.length) fissions++;
    next.push(...t.born);
  }
  if (next.length > MAX_NEUTRONS) { next.length = MAX_NEUTRONS; rx.capped = true; }
  rx.neutrons = next; rx.gen++; rx.history.push(next.length);
  return { paths, fissions };
}

/** k from a run: the average of (neutrons in one generation / neutrons in the one before), skipping a run that has died. */
export function kFromHistory(h: number[]): number {
  const rs: number[] = [];
  for (let i = 1; i < h.length; i++) if (h[i - 1] > 0) rs.push(h[i] / h[i - 1]);
  return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;
}
/** Long-run estimate of k: fire `trials` neutrons from random places into fresh fuel (no fuel is used up) and count the neutrons born per neutron. */
export function estimateK(p: ReactorParams, seed: number, trials = 600): number {
  const rx = makeReactor(p, seed, false);
  let born = 0;
  for (let i = 0; i < trials; i++) born += traceNeutron(rx, { x: rx.rand() * GRID, y: rx.rand() * GRID }).born.length;
  return born / trials;
}
export type Regime = 'subcritical' | 'critical' | 'supercritical';
export const regime = (k: number): Regime => (k < 0.95 ? 'subcritical' : k <= 1.05 ? 'critical' : 'supercritical');

/* ---------------------------------------------------------------- density lab */

export const MATERIALS: { id: string; name: string; rho: number }[] = [
  { id: 'pine', name: 'pine wood', rho: 0.55 },
  { id: 'ice', name: 'ice', rho: 0.92 },
  { id: 'acrylic', name: 'acrylic plastic', rho: 1.18 },
  { id: 'aluminium', name: 'aluminium', rho: 2.7 },
  { id: 'steel', name: 'steel', rho: 7.85 },
  { id: 'copper', name: 'copper', rho: 8.96 },
];
export const STONES: { id: string; name: string; rho: number }[] = [
  { id: 'sandstone', name: 'sandstone', rho: 2.3 },
  { id: 'granite', name: 'granite', rho: 2.65 },
  { id: 'basalt', name: 'basalt', rho: 2.95 },
];
export const LIQUIDS: { id: string; name: string; rho: number }[] = [
  { id: 'oil', name: 'cooking oil', rho: 0.92 },
  { id: 'water', name: 'water', rho: 1.0 },
  { id: 'syrup', name: 'golden syrup', rho: 1.38 },
];
export const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
/** Volume of a block, cm^3, from sides in cm. */
export const blockVolume = (a: number, b: number, c: number) => a * b * c;
/** Mass on a balance that reads to 0.1 g. */
export const balanceReading = (rho: number, volCm3: number) => round(rho * volCm3, 1);
/** Density in g/cm^3 from grams and cm^3. */
export const density = (massG: number, volCm3: number) => massG / volCm3;
export const toKgPerM3 = (gPerCm3: number) => gPerCm3 * 1000;
/** Something floats when it is less dense than the liquid. Fraction under the surface = rho / rhoLiquid (at most 1). */
export const floats = (rho: number, rhoLiquid: number) => rho < rhoLiquid;
export const submergedFraction = (rho: number, rhoLiquid: number) => Math.min(1, rho / rhoLiquid);
/** Density of a liquid from the mass of the cylinder empty, full, and the volume in mL. */
export const liquidDensity = (emptyG: number, fullG: number, mL: number) => (fullG - emptyG) / mL;
/** Overflow of a eureka can read in a cylinder that reads to 1 mL. */
export const overflowReading = (volCm3: number) => Math.round(volCm3);
/** Percentage uncertainty in a block's volume when each side is read to +/- half a division. */
export const volumeUncertaintyPct = (sides: number[], halfDiv: number) => sides.reduce((s, x) => s + (halfDiv / x) * 100, 0);

/* ---------------------------------------------------------------- cooling and insulation */

export const FACES = [
  { id: 'matt-black', name: 'Matt black', eps: 0.95 },
  { id: 'shiny-black', name: 'Shiny black', eps: 0.88 },
  { id: 'matt-white', name: 'Matt white', eps: 0.9 },
  { id: 'shiny-silver', name: 'Shiny silver', eps: 0.05 },
];
export const SIGMA = 5.670374e-8;
export const toK = (c: number) => c + 273.15;
/** Infrared power per square metre given off by a face at tFace (C) in a room at tAir (C): emissivity x sigma x (T^4 - Ta^4). */
export const leslieEmission = (eps: number, tFace: number, tAir: number) => eps * SIGMA * (toK(tFace) ** 4 - toK(tAir) ** 4);
/** Detector reading scaled so a matt black face at 100 C in a 20 C room reads 100. */
export const leslieReading = (eps: number, tFace: number, tAir: number) => (100 * leslieEmission(eps, tFace, tAir)) / leslieEmission(0.95, 100, 20);

export type Wrap = 'none' | 'newspaper' | 'bubble' | 'foam';
/** Cooling constant k (per minute) in Newton's law T = Ta + (T0 - Ta) e^(-kt). Model values for a 200 mL beaker: bare 0.040, each newspaper layer adds insulation, a lid cuts losses by 30 %. */
export function coolingK(w: Wrap, layers = 1, lid = false): number {
  const base = w === 'none' ? 0.04 : w === 'newspaper' ? 0.04 / (1 + 0.35 * layers) : w === 'bubble' ? 0.022 : 0.013;
  return lid ? base * 0.7 : base;
}
export const temperatureAt = (t0: number, ta: number, k: number, tMin: number) => ta + (t0 - ta) * Math.exp(-k * tMin);
/** Minutes to cool to tTarget, or null when it never gets there. */
export const timeToReach = (t0: number, ta: number, k: number, tTarget: number) => (tTarget <= ta || tTarget > t0 ? null : Math.log((t0 - ta) / (tTarget - ta)) / k);
export const halfTime = (k: number) => Math.LN2 / k;

/* ---------------------------------------------------------------- ripple tank */

/** Shallow-water wave speed in m/s for a depth in mm: v = sqrt(g h). A textbook model. */
export const speedFromDepth = (hMm: number) => Math.sqrt(9.81 * (hMm / 1000));
export const wavelength = (v: number, f: number) => v / f;
export const waveSpeed = (f: number, lambda: number) => f * lambda;
/** Refraction by v = f lambda: sin(theta2) = sin(theta1) v2 / v1 (angles in degrees from the normal). Null if the wave is totally reflected. */
export function refractedAngle(theta1Deg: number, v1: number, v2: number): number | null {
  const s = (Math.sin((theta1Deg * Math.PI) / 180) * v2) / v1;
  return Math.abs(s) > 1 ? null : (Math.asin(s) * 180) / Math.PI;
}
/** Angle (degrees) to the first minimum when waves pass a gap of width a: sin(theta) = lambda / a. At 90 the waves spread out fully. */
export const spreadAngle = (lambda: number, a: number) => (lambda >= a ? 90 : (Math.asin(lambda / a) * 180) / Math.PI);
