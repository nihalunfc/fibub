// Spin splitter conductivity of a 2D altermagnet model (from amband.ts) in the constant relaxation-time Boltzmann picture:
//   σ^σ_ij ∝ τ ∫ v_i v_j (−∂f/∂E) d²k / (2π)²,  v = ∂E/∂k (ħ = 1, lattice constant 1),
// summed over the bands of each spin σ. With one τ for every state, τ and the prefactor e²/ħ² cancel in the ratios
// reported here: the charge current is σ↑ + σ↓, the spin current (in units of ħ/2e) is σ↑ − σ↓, and for a field at
// angle α the spin splitter ratio is the transverse spin current over the longitudinal charge current. No DOM.
import { bands, nBands, type Model } from './amband.ts';

export type T2 = { xx: number; xy: number; yy: number };

/** Conductivity tensors per spin (in units of e²τ t / ħ² per cell, t the hopping unit) on an n × n grid at temperature kT. */
export function tensors(m: Model, n = 400, kT = 0.1) {
  const nb = nBands(m), h = 1e-5, out = { up: { xx: 0, xy: 0, yy: 0 }, dn: { xx: 0, xy: 0, yy: 0 }, dos: [0, 0] };
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const kx = -Math.PI + (2 * Math.PI * (i + 0.5)) / n, ky = -Math.PI + (2 * Math.PI * (j + 0.5)) / n;
    for (const s of [1, -1] as const) {
      const e = bands(m, kx, ky, s);
      let ex: number[] | null = null;
      for (let b = 0; b < nb; b++) {
        const x = e[b] / (2 * kT);
        if (Math.abs(x) > 30) continue; // −∂f/∂E is negligible
        const w = 1 / (4 * kT * Math.cosh(x) ** 2);
        ex ??= [bands(m, kx + h, ky, s), bands(m, kx - h, ky, s), bands(m, kx, ky + h, s), bands(m, kx, ky - h, s)].flat();
        const vx = (ex[b] - ex[nb + b]) / (2 * h), vy = (ex[2 * nb + b] - ex[3 * nb + b]) / (2 * h);
        const t = s === 1 ? out.up : out.dn;
        t.xx += vx * vx * w; t.xy += vx * vy * w; t.yy += vy * vy * w; out.dos[s === 1 ? 0 : 1] += w;
      }
    }
  }
  const N = n * n;
  for (const t of [out.up, out.dn]) { t.xx /= N; t.xy /= N; t.yy /= N; }
  out.dos = out.dos.map((d) => d / N);
  return out;
}

const along = (t: T2, a: number) => { const c = Math.cos(a), s = Math.sin(a); return c * c * t.xx + 2 * c * s * t.xy + s * s * t.yy; };
const across = (t: T2, a: number) => { const c = Math.cos(a), s = Math.sin(a); return (t.yy - t.xx) * s * c + t.xy * (c * c - s * s); };

/** For a field at angle a (radians from x): charge conductivity along it, spin polarisation of that current, and the
 *  spin splitter ratio (transverse spin current over longitudinal charge current). */
export function atAngle(up: T2, dn: T2, a: number) {
  const ch = along(up, a) + along(dn, a), spL = along(up, a) - along(dn, a), spT = across(up, a) - across(dn, a), chT = across(up, a) + across(dn, a);
  return { charge: ch, polar: ch ? spL / ch : 0, splitter: ch ? spT / ch : 0, hallLike: ch ? chT / ch : 0 };
}

/** Field angle with the largest |spin splitter ratio| (the transverse spin response is A sin 2α + B cos 2α). */
export function bestAngle(up: T2, dn: T2) {
  const A = ((up.yy - up.xx) - (dn.yy - dn.xx)) / 2, B = up.xy - dn.xy;
  // Maximise |spT|/charge numerically: charge also depends on α when the charge tensor is anisotropic.
  let best = 0, bv = -1;
  for (let k = 0; k < 3600; k++) { const a = (k / 3600) * Math.PI, v = Math.abs(atAngle(up, dn, a).splitter); if (v > bv * (1 + 1e-9) + 1e-15) { bv = v; best = a; } }
  return { angle: best, amp: Math.hypot(A, B) };
}
