// School heat and thermodynamics maths for the Learn tools temperature-scales, thermal-expansion and carnot-engine.
// Plain maths, no DOM.

/** Absolute zero in degrees Celsius (the kelvin is defined so that 0 K = −273.15 °C). */
export const ABS_ZERO_C = -273.15;

export type Scale = 'C' | 'F' | 'K' | 'R';
/** Any scale to Celsius. R is Rankine (absolute zero 0, Fahrenheit-sized degrees). */
export function toC(v: number, s: Scale) {
  if (s === 'C') return v;
  if (s === 'F') return ((v - 32) * 5) / 9;
  if (s === 'K') return v + ABS_ZERO_C;
  return ((v - 491.67) * 5) / 9;
}
/** Celsius to any scale. */
export function fromC(c: number, s: Scale) {
  if (s === 'C') return c;
  if (s === 'F') return (c * 9) / 5 + 32;
  if (s === 'K') return c - ABS_ZERO_C;
  return ((c - ABS_ZERO_C) * 9) / 5;
}
export const convert = (v: number, from: Scale, to: Scale) => fromC(toC(v, from), to);
/** True when the temperature is below absolute zero (impossible). A tiny allowance for rounding. */
export const belowAbsZero = (c: number) => c < ABS_ZERO_C - 1e-9;

/** A made-up linear scale with its own ice point a and steam point b: X = a + (b − a) · C / 100. */
export const toCustom = (c: number, a: number, b: number) => a + ((b - a) * c) / 100;
export const fromCustom = (x: number, a: number, b: number) => ((x - a) * 100) / (b - a);
/** The temperature where a scale X reads the same number as Celsius (none if b − a = 100). */
export function sameReading(a: number, b: number) {
  const k = (b - a) / 100;
  return Math.abs(k - 1) < 1e-12 ? NaN : a / (1 - k);
}

/** Constant-volume gas thermometer: pressure at t °C for a gas with pressure p0 at 0 °C. */
export const gasPressure = (p0: number, c: number) => (p0 * (c - ABS_ZERO_C)) / -ABS_ZERO_C;
/** Where a straight line through two (t, p) readings reaches zero pressure (the extrapolated absolute zero). */
export const zeroPressureT = (t1: number, p1: number, t2: number, p2: number) => t1 - (p1 * (t2 - t1)) / (p2 - p1);

// ---- Thermal expansion ----
/** Change in length ΔL = α L ΔT. */
export const deltaL = (alpha: number, L: number, dT: number) => alpha * L * dT;
/** Stress in a bar held so it cannot expand: σ = Y α ΔT (Pa). */
export const thermalStress = (Y: number, alpha: number, dT: number) => Y * alpha * dT;
/** Exact new area and volume for a square sheet / cube of side L, and the β = 2α, γ = 3α approximations. */
export function areaVolume(alpha: number, L: number, dT: number) {
  const s = L * (1 + alpha * dT);
  return { A0: L * L, A: s * s, dAapprox: 2 * alpha * L * L * dT, V0: L ** 3, V: s ** 3, dVapprox: 3 * alpha * L ** 3 * dT };
}
/** Smallest gap to leave between rails of length L laid at tLay so they just touch at tHot. */
export const gapNeeded = (alpha: number, L: number, tLay: number, tHot: number) => Math.max(0, alpha * L * (tHot - tLay));
/** Rise of a rail bowed into a shallow circular arc when its length grows by ΔL between fixed ends a distance L apart:
 * arc length L + ΔL over chord L; for a shallow arc the rise h ≈ √(3 L ΔL / 8). */
export const bowRise = (L: number, dL: number) => (dL <= 0 ? 0 : Math.sqrt((3 * L * dL) / 8));

// ---- Carnot engine, refrigerator and heat pump ----
/** Carnot efficiency 1 − Tc/Th (kelvin). */
export const carnotEff = (Th: number, Tc: number) => 1 - Tc / Th;
/** Best refrigerator: COP = Qc / W = Tc / (Th − Tc). */
export const copFridge = (Th: number, Tc: number) => Tc / (Th - Tc);
/** Best heat pump: COP = Qh / W = Th / (Th − Tc). */
export const copHeatPump = (Th: number, Tc: number) => Th / (Th - Tc);
/** Energy flows per cycle for an ideal engine taking in Qh. */
export function engineFlows(Th: number, Tc: number, Qh: number) {
  const eta = carnotEff(Th, Tc), W = eta * Qh;
  return { eta, W, Qc: Qh - W };
}
const R = 8.314462618;
/** The four corners of a Carnot cycle for n mol of ideal gas with heat-capacity ratio γ, starting at V1 and
 * expanding isothermally by the ratio r at Th. Returns volumes (m³), pressures (Pa) and the heat in and out. */
export function carnotCycle(n: number, Th: number, Tc: number, V1: number, r: number, gamma = 1.4) {
  const V2 = V1 * r, k = (Th / Tc) ** (1 / (gamma - 1)), V3 = V2 * k, V4 = V1 * k;
  const p = (V: number, T: number) => (n * R * T) / V;
  const Qh = n * R * Th * Math.log(r), Qc = n * R * Tc * Math.log(V3 / V4);
  return { V: [V1, V2, V3, V4], P: [p(V1, Th), p(V2, Th), p(V3, Tc), p(V4, Tc)], Qh, Qc, W: Qh - Qc, gamma, n, Th, Tc };
}
/** Pressure along each leg of the cycle at volume V (leg 0: 1→2 hot isotherm, 1: 2→3 adiabat, 2: 3→4 cold isotherm, 3: 4→1 adiabat). */
export function cyclePressure(c: ReturnType<typeof carnotCycle>, leg: number, V: number) {
  if (leg === 0) return (c.n * R * c.Th) / V;
  if (leg === 2) return (c.n * R * c.Tc) / V;
  const [Va, Pa] = leg === 1 ? [c.V[1], c.P[1]] : [c.V[3], c.P[3]];
  return Pa * (Va / V) ** c.gamma;
}
export const GAS_R = R;
