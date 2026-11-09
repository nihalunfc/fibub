// Single Langmuir probe I-V analysis: ion saturation fit, floating potential, electron temperature from the
// exponential (transition) region, plasma potential from the knee, densities from electron and ion saturation.
// Classical thin-sheath analysis, as in Chen (2003) "Langmuir probe diagnostics" and Hutchinson, Principles of
// Plasma Diagnostics. Current convention inside this file: electron collection is positive.

export const QE = 1.602176634e-19, ME = 9.1093837015e-31, AMU = 1.66053906660e-27, EPS0 = 8.8541878128e-12;

export type Line = { a: number; b: number; n: number; r2: number }; // y = a + b x
export function fitLine(x: number[], y: number[]): Line | null {
  const n = x.length; if (n < 2) return null;
  let sx = 0, sy = 0; for (let i = 0; i < n; i++) { sx += x[i]; sy += y[i]; }
  const mx = sx / n, my = sy / n; let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy; }
  if (!(sxx > 0)) return null;
  const b = sxy / sxx; return { a: my - b * mx, b, n, r2: syy > 0 ? (sxy * sxy) / (sxx * syy) : 1 };
}

export type ProbeOpts = {
  area: number; // m^2
  A: number; // ion mass, u
  ionMax?: number; // fit the ion saturation line to V below this (V); NaN/undefined = automatic
  teLo?: number; teHi?: number; // fit range for Te (V); automatic when missing
};

/** Floating potential: first crossing of I = 0 going up in voltage (linear interpolation). */
function zeroCross(V: number[], I: number[]): number {
  for (let i = 1; i < V.length; i++) if (I[i - 1] <= 0 && I[i] > 0) return V[i - 1] + ((0 - I[i - 1]) * (V[i] - V[i - 1])) / (I[i] - I[i - 1]);
  return NaN;
}

export function analyse(Vin: number[], Iin: number[], o: ProbeOpts) {
  const idx = Vin.map((_, i) => i).filter((i) => Number.isFinite(Vin[i]) && Number.isFinite(Iin[i])).sort((a, b) => Vin[a] - Vin[b]);
  const V = idx.map((i) => Vin[i]), I = idx.map((i) => Iin[i]);
  if (V.length < 10) throw new Error('Give at least 10 points of probe voltage and current.');
  if (!(Math.min(...I) < 0 && Math.max(...I) > 0)) throw new Error('The current never changes sign, so there is no floating potential. Check the sign convention or include more negative voltages.');
  const Vf0 = zeroCross(V, I);
  if (!Number.isFinite(Vf0)) throw new Error('The current falls through zero as the voltage rises, the wrong way for electron current counted positive. Switch the sign of the current.');
  // First guess at the plasma potential: steepest point of a lightly smoothed curve.
  const sm = I.map((_, i) => { let s = 0, n = 0; for (let k = Math.max(0, i - 2); k <= Math.min(I.length - 1, i + 2); k++) { s += I[k]; n++; } return s / n; });
  let best = -Infinity, Vp0 = V[V.length - 1];
  for (let i = 1; i < V.length - 1; i++) { const d = (sm[i + 1] - sm[i - 1]) / (V[i + 1] - V[i - 1]); if (V[i] > Vf0 && d > best) { best = d; Vp0 = V[i]; } }
  let Te = Math.max(0.05, (Vp0 - Vf0) / 5);
  let ion: Line | null = null, te: Line | null = null, es: Line | null = null, Vf = Vf0, Vp = Vp0, lo = 0, hi = 0, ionTop = 0;
  const Ie: number[] = [];
  for (let iter = 0; iter < 4; iter++) {
    ionTop = Number.isFinite(o.ionMax) ? o.ionMax! : Vf - 2 * Te;
    const ii = V.map((v, i) => i).filter((i) => V[i] <= ionTop);
    ion = fitLine(ii.map((i) => V[i]), ii.map((i) => I[i]));
    if (!ion) throw new Error('Not enough points in the ion saturation region. Include more negative voltages, or set the ion fit limit higher.');
    Ie.length = 0; for (let i = 0; i < V.length; i++) Ie.push(I[i] - (ion.a + ion.b * V[i]));
    Vf = zeroCross(V, I);
    lo = Number.isFinite(o.teLo) ? o.teLo! : Vf + 0.5 * Te;
    hi = Number.isFinite(o.teHi) ? o.teHi! : Vp - 0.5 * Te;
    const ti = V.map((v, i) => i).filter((i) => V[i] >= lo && V[i] <= hi && Ie[i] > 0);
    te = fitLine(ti.map((i) => V[i]), ti.map((i) => Math.log(Ie[i])));
    if (!te || ti.length < 3 || !(te.b > 0)) throw new Error('Could not fit the exponential part of the curve. Set the Te fit range by hand, between the floating potential and the knee.');
    Te = 1 / te.b;
    const si = V.map((v, i) => i).filter((i) => V[i] >= Vp + Te && Ie[i] > 0);
    es = si.length >= 3 ? fitLine(si.map((i) => V[i]), si.map((i) => Math.log(Ie[i]))) : null;
    const Vpk = es && es.b < te.b ? (es.a - te.a) / (te.b - es.b) : Vp0;
    if (!(Vpk > Vf && Vpk <= V[V.length - 1])) { Vp = Vp0; } else Vp = Vpk;
  }
  const mi = o.A * AMU, kTe = Te * QE;
  const Iis = -(ion!.a + ion!.b * Vf); // ion current magnitude at the floating potential
  const Ies = Math.exp(te!.a + te!.b * Vp);
  const nE = Ies / (QE * o.area * Math.sqrt(kTe / (2 * Math.PI * ME)));
  const nI = Iis / (0.61 * QE * o.area * Math.sqrt(kTe / mi));
  const lambdaD = Math.sqrt((EPS0 * kTe) / (nE * QE * QE));
  // Floating potential below the plasma potential, from balancing 0.61 n e A sqrt(kTe/mi) with n e A sqrt(kTe/2 pi me) exp(-dV/Te):
  const dVtheory = Te * Math.log(Math.sqrt(mi / (2 * Math.PI * ME)) / 0.61);
  return { V, I, Ie, ion: ion!, te: te!, es, Vf, Vp, Te, Iis, Ies, nE, nI, lambdaD, ionTop, lo, hi, dVtheory };
}
export type ProbeResult = ReturnType<typeof analyse>;

/** A made-up probe trace: argon-like plasma, Te 3 eV, n 1e16 m^-3, Vp 12 V, 2 mm^2 probe, with a little noise. */
export function exampleTrace(): { V: number[]; I: number[] } {
  const Te = 3, n = 1e16, Vp = 12, A = 2e-6, mi = 40 * AMU, kTe = Te * QE;
  const Iis = 0.61 * n * QE * A * Math.sqrt(kTe / mi), Ies = n * QE * A * Math.sqrt(kTe / (2 * Math.PI * ME));
  let s = 12345; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648 - 0.5; };
  const V: number[] = [], I: number[] = [];
  for (let v = -40; v <= 30.0001; v += 0.5) {
    const ion = -Iis * (1 + 0.004 * (Vp - v)); // sheath expansion makes the ion current grow slowly
    const el = v < Vp ? Ies * Math.exp((v - Vp) / Te) : Ies * (1 + 0.01 * (v - Vp));
    const i = ion + el;
    V.push(+v.toFixed(2)); I.push(+(i * (1 + 0.01 * rnd()) + 2e-7 * rnd()).toPrecision(5));
  }
  return { V, I };
}
