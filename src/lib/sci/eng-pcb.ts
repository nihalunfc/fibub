// PCB trace sizing: the IPC-2221 current-capacity curve fit, copper resistance, and closed-form characteristic
// impedance of microstrip (Hammerstad and Jensen 1980, with their strip-thickness correction) and centred stripline
// (Wheeler 1978, with thickness). All lengths in metres unless the name says otherwise. No DOM.

export const MIL = 25.4e-6;
export const OZ = 34.79e-6; // 1 oz/ft² copper ≈ 1.37 mil ≈ 34.8 µm
const ETA0 = 376.730313668, C0 = 299792458;
const RHO_CU = 1.724e-8, ALPHA_CU = 0.00393; // annealed copper at 20 °C

/** IPC-2221 cross-section (mil²) for current I (A) and temperature rise dT (°C): I = k dT^0.44 A^0.725; k = 0.048 outer, 0.024 inner layers. */
export function ipcArea(I: number, dT: number, inner: boolean): number {
  const k = inner ? 0.024 : 0.048;
  return (I / (k * dT ** 0.44)) ** (1 / 0.725);
}
/** Current (A) a trace of cross-section A (mil²) carries for a rise dT. */
export function ipcCurrent(Amil2: number, dT: number, inner: boolean): number {
  return (inner ? 0.024 : 0.048) * dT ** 0.44 * Amil2 ** 0.725;
}
/** Width (m) for current I, rise dT and copper thickness t (m). */
export function ipcWidth(I: number, dT: number, t: number, inner: boolean): number {
  return (ipcArea(I, dT, inner) / (t / MIL)) * MIL;
}
/** DC resistance (Ω) of a copper trace at temperature T (°C). */
export function traceR(w: number, t: number, len: number, T = 20): number {
  return (RHO_CU * (1 + ALPHA_CU * (T - 20)) * len) / (w * t);
}

// --- Microstrip, Hammerstad and Jensen (1980) ---
const Z01 = (u: number) => (ETA0 / (2 * Math.PI)) * Math.log((6 + (2 * Math.PI - 6) * Math.exp(-((30.666 / u) ** 0.7528))) / u + Math.sqrt(1 + 4 / (u * u)));
function epsE(u: number, er: number) {
  const a = 1 + Math.log((u ** 4 + (u / 52) ** 2) / (u ** 4 + 0.432)) / 49 + Math.log(1 + (u / 18.1) ** 3) / 18.7;
  const b = 0.564 * ((er - 0.9) / (er + 3)) ** 0.053;
  return (er + 1) / 2 + ((er - 1) / 2) * (1 + 10 / u) ** (-a * b);
}
/** Microstrip: width w over a ground plane at height h, strip thickness t, substrate εr. Quasi-static Z0 (Ω) and effective εr. */
export function microstrip(w: number, h: number, t: number, er: number): { z0: number; eeff: number } {
  const u = w / h;
  let u1 = u, ur = u;
  if (t > 0) {
    const tn = t / h, coth = 1 / Math.tanh(Math.sqrt(6.517 * u));
    const du1 = (tn / Math.PI) * Math.log(1 + (4 * Math.E) / (tn * coth * coth));
    const dur = 0.5 * (1 + 1 / Math.cosh(Math.sqrt(er - 1))) * du1;
    u1 = u + du1; ur = u + dur;
  }
  const ee = epsE(ur, er), z0 = Z01(ur) / Math.sqrt(ee), eeff = ee * (Z01(u1) / Z01(ur)) ** 2;
  return { z0, eeff };
}

// --- Stripline (trace centred between two planes b apart), Wheeler (1978) ---
/** Centred stripline: width w, plane spacing b, strip thickness t, εr. */
export function stripline(w: number, b: number, t: number, er: number): { z0: number; eeff: number } {
  if (!(t < b)) return { z0: NaN, eeff: er };
  let wp = w;
  if (t > 0) {
    const x = t / b, n = 2 / (1 + ((2 / 3) * x) / (1 - x));
    const dw = (b - t) * (x / (Math.PI * (1 - x))) * (1 - 0.5 * Math.log((x / (2 - x)) ** 2 + ((0.0796 * x) / (w / b + 1.1 * x)) ** n));
    wp = w + dw;
  }
  const m = wp / (b - t), a = 8 / (Math.PI * m);
  const z0 = (ETA0 / (4 * Math.PI * Math.sqrt(er))) * Math.log(1 + (4 / (Math.PI * m)) * (a + Math.sqrt(a * a + 6.27)));
  return { z0, eeff: er };
}

/** Delay per metre (s/m), inductance (H/m) and capacitance (F/m) of a line from Z0 and εeff. */
export function perLength(z0: number, eeff: number): { delay: number; L: number; C: number } {
  const delay = Math.sqrt(eeff) / C0;
  return { delay, L: z0 * delay, C: delay / z0 };
}

/** Width giving impedance target (Ω), by bisection in log width (impedance falls as width grows). */
export function widthFor(target: number, f: (w: number) => number, lo: number, hi: number): number {
  let a = Math.log(lo), b = Math.log(hi);
  const fa = f(lo) - target, fb = f(hi) - target;
  if (!(fa > 0 && fb < 0)) return NaN;
  for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (f(Math.exp(m)) > target) a = m; else b = m; }
  return Math.exp((a + b) / 2);
}
