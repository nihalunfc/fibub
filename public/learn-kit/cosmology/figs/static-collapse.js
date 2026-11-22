// 1.5 Bentley's question to Newton (1692): if gravity pulls every star towards every other, why hasn't the
// universe fallen together? Here 200 stars start at rest in a ball and fall inwards (inverse-square gravity,
// slightly softened). Give them an outward start instead and they can fly apart: a static universe is not an
// option. Time is shown in units of the free-fall time.
import { canvas, text, dot, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 280, label: 'A ball of stars falling together under gravity' });
  const N = 200;
  let P = [], t = 0, kick = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Outward start speed', min: 0, max: 1.6, step: 0.05, value: 0, fmt: (v) => v === 0 ? 'at rest' : `${v.toFixed(2)} × escape`, oninput: (v) => { kick = v; reset(); } });
  const anim = loop(host, (dt) => { stepSim(dt); cv.redraw(); });
  anim.button(ctl);
  button(ctl, '↺ Restart', () => reset());
  const out = readout(host);
  // units: G = 1, total mass 1, radius 1. Free-fall time of a uniform ball: π/2 · sqrt(R³/(2GM)).
  const TFF = (Math.PI / 2) * Math.sqrt(1 / 2);
  function reset() {
    const r = rng(5); P = []; t = 0;
    while (P.length < N) {
      const x = r() * 2 - 1, y = r() * 2 - 1, z = r() * 2 - 1, d = Math.hypot(x, y, z);
      if (d > 1 || d < 0.05) continue;
      // escape speed at radius d inside a uniform ball (to infinity, approx) ∝ d for the Hubble-like start
      const v = kick * Math.sqrt(2) * d;
      P.push({ x, y, z, vx: (v * x) / d, vy: (v * y) / d, vz: (v * z) / d });
    }
    cv.redraw();
  }
  function stepSim(dt) {
    const h = 0.004, n = Math.round((dt * 0.5) / h), m = 1 / N, e2 = 0.004;
    for (let k = 0; k < n; k++) {
      for (const a of P) { a.ax = 0; a.ay = 0; a.az = 0; }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, r2 = dx * dx + dy * dy + dz * dz + e2, f = m / (r2 * Math.sqrt(r2));
        a.ax += f * dx; a.ay += f * dy; a.az += f * dz; b.ax -= f * dx; b.ay -= f * dy; b.az -= f * dz;
      }
      for (const a of P) { a.vx += a.ax * h; a.vy += a.ay * h; a.vz += a.az * h; a.x += a.vx * h; a.y += a.vy * h; a.z += a.vz * h; }
      t += h;
    }
  }
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(w, h) * 0.3, cx = w / 2, cy = h / 2 + 6;
    for (const a of P) { const depth = (a.z + 2) / 4; dot(ctx, cx + a.x * s, cy - a.y * s, 1.4 + depth * 1.4, col.ink); }
    text(ctx, `time: ${(t / TFF).toFixed(2)} free-fall times`, 10, 16, { color: col.ink, size: 12, weight: 600 });
    const rms = Math.sqrt(P.reduce((q, a) => q + a.x * a.x + a.y * a.y + a.z * a.z, 0) / N);
    out.textContent = kick === 0 ? `Starting at rest, the stars fall together in about one free-fall time. Size now: ${rms.toFixed(2)} (started at 0.77).` : `With an outward start, gravity only slows them down${kick >= 1 ? ', and here they keep flying apart' : '; they still fall back eventually'}. Size now: ${rms.toFixed(2)}.`;
  };
  reset();
}
