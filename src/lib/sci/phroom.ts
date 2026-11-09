// Room acoustics for a rectangular (shoebox) room: the rigid-wall eigenmodes (axial, tangential, oblique), and the
// reverberation time by octave band from Sabine's and Eyring's formulas with air absorption. No DOM.
import { soundSpeed, airAbsorption, mFromAlpha } from './phair.ts';

export const RT_BANDS = [125, 250, 500, 1000, 2000, 4000];

export type Mode = { f: number; n: [number, number, number]; type: 'axial' | 'tangential' | 'oblique' };

/** Mode frequency f = c/2 · √((nx/Lx)² + (ny/Ly)² + (nz/Lz)²). */
export const modeFreq = (c: number, L: number, W: number, H: number, nx: number, ny: number, nz: number) =>
  (c / 2) * Math.sqrt((nx / L) ** 2 + (ny / W) ** 2 + (nz / H) ** 2);

/** All modes up to fMax (Hz), sorted by frequency; at most `limit` of them (the lowest). */
export function roomModes(L: number, W: number, H: number, c: number, fMax: number, limit = 5000): { modes: Mode[]; cut: boolean } {
  const out: Mode[] = [];
  const nxM = Math.floor((2 * fMax * L) / c), nyM = Math.floor((2 * fMax * W) / c), nzM = Math.floor((2 * fMax * H) / c);
  for (let a = 0; a <= nxM; a++) for (let b = 0; b <= nyM; b++) for (let d = 0; d <= nzM; d++) {
    if (a + b + d === 0) continue;
    const f = modeFreq(c, L, W, H, a, b, d);
    if (f > fMax * (1 + 1e-12)) continue;
    const nz = (a ? 1 : 0) + (b ? 1 : 0) + (d ? 1 : 0);
    out.push({ f, n: [a, b, d], type: nz === 1 ? 'axial' : nz === 2 ? 'tangential' : 'oblique' });
  }
  out.sort((p, q) => p.f - q.f || p.n[0] - q.n[0] || p.n[1] - q.n[1] || p.n[2] - q.n[2]);
  return { modes: out.slice(0, limit), cut: out.length > limit };
}

/** Expected number of modes below f (Bolt/Morse smoothed count): 4πV f³/(3c³) + πS f²/(4c²) + L' f/(8c), L' = 4(L+W+H). */
export function modeCount(L: number, W: number, H: number, c: number, f: number) {
  const V = L * W * H, S = 2 * (L * W + L * H + W * H), Lp = 4 * (L + W + H);
  return (4 * Math.PI * V * f ** 3) / (3 * c ** 3) + (Math.PI * S * f ** 2) / (4 * c ** 2) + (Lp * f) / (8 * c);
}

export type Surface = { name: string; area: number; alpha: number[] }; // alpha per RT_BANDS

/** Reverberation by band. extra: extra absorption area (m² sabins) per band, for furniture or people. */
export function reverb(L: number, W: number, H: number, surfaces: Surface[], extra: number[], tC = 20, rh = 50, pKPa = 101.325, air = true) {
  const c = soundSpeed(tC), V = L * W * H, S = surfaces.reduce((s, x) => s + x.area, 0);
  const k = (24 * Math.LN10) / c; // Sabine's constant, 0.161 s/m at c = 343 m/s
  const bands = RT_BANDS.map((f, i) => {
    const A = surfaces.reduce((s, x) => s + x.area * x.alpha[i], 0) + (extra[i] || 0);
    const abar = A / S;
    const aAir = airAbsorption(f, tC, rh, pKPa).alpha, m = air ? mFromAlpha(aAir) : 0;
    const sabine = (k * V) / (A + 4 * m * V);
    const eyring = abar < 1 ? (k * V) / (-S * Math.log(1 - abar) + 4 * m * V) : 0;
    return { f, A, abar, aAir, m, sabine, eyring, roomConst: abar < 1 ? (S * abar) / (1 - abar) : Infinity };
  });
  const mid = (bands[2].sabine + bands[3].sabine) / 2, midE = (bands[2].eyring + bands[3].eyring) / 2;
  return { c, V, S, k, bands, mid, midE, schroeder: 2000 * Math.sqrt(midE / V), mfp: (4 * V) / S };
}

/** Critical (reverberation) distance for a source of directivity Q in a room of constant R (m²): √(Q R / 16π). */
export const criticalDistance = (R: number, Q = 1) => Math.sqrt((Q * R) / (16 * Math.PI));
