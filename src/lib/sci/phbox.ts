// Loudspeaker enclosures from Thiele-Small parameters: closed (sealed) box as a 2nd-order high-pass, vented (ported)
// box as Small's 4th-order high-pass with box leakage losses QL, port length and air speed, reference efficiency.
// Small-signal, low-frequency model only (no voice-coil inductance, no cone break-up). No DOM.

export const C_AIR = 343.2, RHO_AIR = 1.204; // m/s and kg/m³ at 20 °C, rounded

export type Driver = { fs: number; qts: number; vas: number /* litres */; qes?: number; sd?: number /* cm² */; xmax?: number /* mm */ };

/** Closed box of net volume vb litres: system resonance fc, total Q and the alpha = Vas/Vb compliance ratio. */
export function sealed(d: Driver, vb: number) {
  const alpha = d.vas / vb, r = Math.sqrt(1 + alpha), fc = d.fs * r, qtc = d.qts * r;
  const f3 = cutoff((f) => sealedDb(f, fc, qtc), fc / 100, fc * 100);
  const peak = qtc > Math.SQRT1_2 ? 20 * Math.log10((qtc * qtc) / Math.sqrt(qtc * qtc - 0.25)) : 0;
  return { alpha, fc, qtc, f3, peak };
}

/** Sealed response (dB, 0 dB well above resonance): H(s) = s²/(s² + s ωc/Q + ωc²). */
export function sealedDb(f: number, fc: number, qtc: number) {
  const x = (f / fc) ** 2;
  return 10 * Math.log10((x * x) / ((1 - x) ** 2 + x / (qtc * qtc)));
}

/** Net box volume (litres) that gives a target total Q in a closed box (needs Qtc > Qts). */
export const sealedVolumeFor = (d: Driver, qtc: number) => d.vas / ((qtc / d.qts) ** 2 - 1);

/**
 * Vented box coefficients (Small 1973): H(s) = s⁴T0⁴ / (s⁴T0⁴ + a1 s³T0³ + a2 s²T0² + a3 s T0 + 1), T0 = 1/√(ωs ωb),
 * h = fb/fs, alpha = Vas/Vb, QL the box leakage loss (7 is a usual guess).
 */
export function ventedCoeffs(d: Driver, vb: number, fb: number, ql = 7) {
  const h = fb / d.fs, alpha = d.vas / vb, q = d.qts, sh = Math.sqrt(h);
  return {
    h, alpha, f0: Math.sqrt(d.fs * fb),
    a1: (ql + h * q) / (sh * ql * q),
    a2: (h + (alpha + 1 + h * h) * q * ql) / (h * q * ql),
    a3: (h * ql + q) / (sh * ql * q),
  };
}

/** Vented response in dB at frequency f. */
export function ventedDb(f: number, c: { f0: number; a1: number; a2: number; a3: number }) {
  const w = f / c.f0, w2 = w * w; // s = jw (normalised): s⁴ = w⁴, s³ = −j w³, s² = −w², s = j w
  const re = w2 * w2 - c.a2 * w2 + 1, im = -c.a1 * w2 * w + c.a3 * w;
  return 10 * Math.log10((w2 * w2) ** 2 / (re * re + im * im));
}

/** Frequency (Hz) where a response function first reaches −3 dB coming down from fHi (bisection). */
export function cutoff(db: (f: number) => number, fLo: number, fHi: number, level = -3) {
  // Walk down in small log steps until the response is below the level, then bisect.
  let hi = fHi, lo = fHi;
  for (let i = 0; i < 4000 && db(lo) > level; i++) { hi = lo; lo = lo / 1.01; if (lo < fLo) return NaN; }
  for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); if (db(m) > level) hi = m; else lo = m; }
  return Math.sqrt(lo * hi);
}

/** End correction for a port: one end flush in a baffle (0.8216 r) and one free inside the box (0.6133 r). */
export const PORT_END = 0.8216 + 0.6133;

/** Port (tube) length in metres for tuning fb, box vb (litres), n round ports of inside diameter dp (m). */
export function portLength(vb: number, fb: number, dp: number, n = 1, c = C_AIR) {
  const sp = n * Math.PI * (dp / 2) ** 2, V = vb / 1000;
  return (c * c * sp) / ((2 * Math.PI * fb) ** 2 * V) - PORT_END * (dp / 2);
}

/** Rough worst-case port air speed (m/s): cone volume velocity at Xmax at fb, all through the port(s). */
export const portSpeed = (sdCm2: number, xmaxMm: number, fb: number, dp: number, n = 1) => (2 * Math.PI * fb * (sdCm2 / 1e4) * (xmaxMm / 1000)) / (n * Math.PI * (dp / 2) ** 2);

/** Reference efficiency η0 = 4π² fs³ Vas / (c³ Qes) and the sensitivity it gives, 112.1 + 10 lg η0 dB SPL for 1 W at 1 m. */
export function efficiency(d: Driver, c = C_AIR) {
  if (!(d.qes && d.qes > 0)) return null;
  const eta = (4 * Math.PI ** 2 * d.fs ** 3 * (d.vas / 1000)) / (c ** 3 * d.qes);
  return { eta, spl: 112.1 + 10 * Math.log10(eta) };
}

/** Displacement volume Vd = Sd · Xmax in cm³ (one-way). */
export const vd = (sdCm2: number, xmaxMm: number) => (sdCm2 * xmaxMm) / 10;
