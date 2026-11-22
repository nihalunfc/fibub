// 1.1 Projection and Gram-Schmidt in the plane. v1 is fixed along a chosen direction; v2 is set by its angle and
// length. The figure splits v2 into its part along v1 (the projection, <e1|v2> e1) and the part left over, u2, which
// is orthogonal to v1. Normalising v1 and u2 gives the orthonormal pair e1, e2.
import { canvas, text, arrow, line, row, slider, choice, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 260, label: 'Two vectors v1 and v2, the projection of v2 on v1 and the orthogonal remainder u2' });
  let th = 50, len = 2.2, base = 15, show = 'split';
  const ctl = row(host);
  slider(ctl, { label: 'Angle between v1 and v2', min: 0, max: 180, step: 1, value: th, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { th = v; cv.redraw(); upd(); } });
  slider(ctl, { label: 'Length of v2', min: 0.5, max: 3, step: 0.1, value: len, fmt: (v) => fmt(v, 2), oninput: (v) => { len = v; cv.redraw(); upd(); } });
  choice(ctl, 'Show', [['split', 'Projection and u2'], ['basis', 'Orthonormal e1, e2']], show, (v) => { show = v; cv.redraw(); upd(); });
  const out = readout(host);
  const geo = () => {
    const b = (base * Math.PI) / 180, a = b + (th * Math.PI) / 180;
    const v1 = [1.6 * Math.cos(b), 1.6 * Math.sin(b)], v2 = [len * Math.cos(a), len * Math.sin(a)];
    const n1 = Math.hypot(...v1), e1 = [v1[0] / n1, v1[1] / n1];
    const c = e1[0] * v2[0] + e1[1] * v2[1], p = [c * e1[0], c * e1[1]], u2 = [v2[0] - p[0], v2[1] - p[1]];
    const n2 = Math.hypot(...u2), e2 = n2 > 1e-9 ? [u2[0] / n2, u2[1] / n2] : [0, 0];
    return { v1, v2, e1, e2, c, p, u2, n2 };
  };
  const upd = () => {
    const g = geo();
    out.innerHTML = `⟨e₁|v₂⟩ = ${fmt(g.c, 3)} (the component of v₂ along v₁). Remainder u₂ = v₂ − ⟨e₁|v₂⟩e₁ has length ${fmt(g.n2, 3)}, and |v₂|² = ${fmt(g.c * g.c, 3)} + ${fmt(g.n2 * g.n2, 3)} = ${fmt(len * len, 3)} (Pythagoras). ${g.n2 < 0.02 ? '<b>v₂ is parallel to v₁: they are linearly dependent and Gram-Schmidt cannot make a second basis vector.</b>' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = geo(), S = Math.min(w, h) / 7.2, cx = w / 2, cy = h * 0.62;
    const P = (x, y) => [cx + x * S, cy - y * S];
    title(ctx, show === 'split' ? 'v₂ = projection on v₁ + orthogonal part u₂' : 'Gram-Schmidt output: orthonormal e₁, e₂', col);
    line(ctx, [P(-3.4, 0), P(3.4, 0)], col.line, 1); line(ctx, [P(0, -1.8), P(0, 3.2)], col.line, 1);
    const L = 3.3; line(ctx, [P(-L * g.e1[0], -L * g.e1[1]), P(L * g.e1[0], L * g.e1[1])], col.muted, 1, [4, 4]);
    if (show === 'split') {
      arrow(ctx, ...P(0, 0), ...P(...g.v1), col.s[0], 3, 10);
      arrow(ctx, ...P(0, 0), ...P(...g.v2), col.s[1], 3, 10);
      arrow(ctx, ...P(0, 0), ...P(...g.p), col.s[4], 2.5, 9);
      if (g.n2 > 0.02) {
        line(ctx, [P(...g.p), P(...g.v2)], col.s[2], 2.5, [6, 4]);
        arrow(ctx, ...P(0, 0), ...P(...g.u2), col.s[2], 2.5, 9);
        const k = 0.18, q1 = [g.p[0] - k * g.e1[0] * Math.sign(g.c || 1), g.p[1] - k * g.e1[1] * Math.sign(g.c || 1)];
        const q2 = [q1[0] + k * g.e2[0], q1[1] + k * g.e2[1]], q3 = [g.p[0] + k * g.e2[0], g.p[1] + k * g.e2[1]];
        line(ctx, [P(...q1), P(...q2), P(...q3)], col.muted, 1);
      }
      text(ctx, 'v₁', ...P(g.v1[0] * 1.12, g.v1[1] * 1.12 - 0.15), { color: col.s[0], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'v₂', ...P(g.v2[0] * 1.08, g.v2[1] * 1.08 + 0.12), { color: col.s[1], size: 13, weight: 700, halo: col.panel });
      text(ctx, '⟨e₁|v₂⟩e₁', ...P(g.p[0] * 0.55, g.p[1] * 0.55 - 0.3), { color: col.s[4], size: 12, weight: 700, halo: col.panel });
      if (g.n2 > 0.02) text(ctx, 'u₂', ...P(g.u2[0] * 1.1 - 0.15, g.u2[1] * 1.1), { color: col.s[2], size: 13, weight: 700, halo: col.panel });
    } else {
      arrow(ctx, ...P(0, 0), ...P(...g.e1), col.s[0], 3, 10);
      if (g.n2 > 0.02) arrow(ctx, ...P(0, 0), ...P(...g.e2), col.s[2], 3, 10);
      arrow(ctx, ...P(0, 0), ...P(...g.v2), col.s[1], 1.5, 8);
      const circ = []; for (let k = 0; k <= 80; k++) { const t = (k / 80) * 2 * Math.PI; circ.push(P(Math.cos(t), Math.sin(t))); }
      line(ctx, circ, col.muted, 1, [3, 3]);
      text(ctx, 'e₁', ...P(g.e1[0] * 1.25, g.e1[1] * 1.25), { color: col.s[0], size: 13, weight: 700, halo: col.panel });
      if (g.n2 > 0.02) text(ctx, 'e₂', ...P(g.e2[0] * 1.25, g.e2[1] * 1.25), { color: col.s[2], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'v₂', ...P(g.v2[0] * 1.08, g.v2[1] * 1.08 + 0.12), { color: col.s[1], size: 12, halo: col.panel });
    }
    text(ctx, 'dashed line: the direction of v₁', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  cv.redraw(); upd();
}
