// 4.9 A plane electromagnetic wave travelling along +x, drawn in oblique 3D: E (vertical, y) and B (into the
// picture, z) oscillate in phase and at right angles, and the Poynting vector S = E × B / μ0 points along the travel
// direction everywhere, pulsing at twice the wave's frequency. A switch shows circular polarisation, where E turns
// at constant length and S is steady.
import { canvas, text, row, choice, readout, arrow, line, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 480, min: 280, label: 'An electromagnetic wave with its electric field, magnetic field and Poynting vector' });
  let pol = 'linear', t = 0;
  const ctl = row(host);
  choice(ctl, 'Polarisation', [['linear', 'Linear'], ['circular', 'Circular']], pol, (v) => { pol = v; cv.redraw(); say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const say = () => {
    out.innerHTML = pol === 'linear'
      ? 'E and B rise and fall together (in phase), at right angles to each other and to the travel direction, with B = E/c. S = E × B/μ₀ always points forward and pulses between zero and its peak; its average is the intensity ½cε₀E₀².'
      : 'Two equal perpendicular components 90° apart: E keeps its length and rotates as the wave moves. B turns with it, always at right angles to E and with B = E/c. Since |E| never changes, S is steady and points forward.';
  };
  cv.draw = (ctx, w, h, col) => {
    const x0 = 24, x1 = w - 30, y0 = h * 0.55, A = h * 0.3, ox = 0.45, oy = -0.32; // oblique z axis
    const P = (x, y, z) => [x0 + x * (x1 - x0) + z * A * ox, y0 - y * A + z * A * oy * -1];
    // axis
    arrow(ctx, ...P(0, 0, 0), ...P(1.02, 0, 0), col.muted, 1.5, 8);
    text(ctx, 'travel (x)', ...P(1.0, 0.12, 0), { color: col.muted, size: 11, align: 'right' });
    const k = 2 * Math.PI * 1.6, wt = 2 * Math.PI * 0.45 * t;
    const Ey = (x) => Math.cos(k * x - wt), Ez = (x) => (pol === 'circular' ? Math.sin(k * x - wt) : 0);
    // E: (Ey, Ez) ; B = x̂ × E / c  → (−Ez, Ey) in (y,z)
    const E = [], B = [];
    for (let i = 0; i <= 160; i++) { const x = i / 160; E.push(P(x, Ey(x), Ez(x))); B.push(P(x, -Ez(x) * 0.7, Ey(x) * 0.7)); }
    line(ctx, B, col.s[1], 2); line(ctx, E, col.s[0], 2.5);
    for (let i = 1; i < 16; i++) {
      const x = i / 16;
      arrow(ctx, ...P(x, 0, 0), ...P(x, Ey(x), Ez(x)), col.s[0], 1.2, 5);
      arrow(ctx, ...P(x, 0, 0), ...P(x, -Ez(x) * 0.7, Ey(x) * 0.7), col.s[1], 1, 4);
      const S = Ey(x) ** 2 + Ez(x) ** 2; // ∝ E²
      if (S > 0.05) arrow(ctx, ...P(x, -1.25, 0), ...P(x + 0.05 * S, -1.25, 0), col.s[3], 2, 6);
    }
    text(ctx, 'E', ...P(0.02, 1.15, 0), { color: col.s[0], size: 13, weight: 700 });
    text(ctx, 'B', ...P(0.02, 0.1, 0.95), { color: col.s[1], size: 13, weight: 700 });
    text(ctx, 'S = E × B / μ₀', ...P(0, -1.45, 0), { color: col.s[3], size: 12, weight: 700 });
  };
  cv.redraw(); say();
}
