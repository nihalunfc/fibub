// A raindrop falling through mist collects mass as it goes, so F = d(mv)/dt = mg gives dv/dt = g − (v/m) dm/dt: slower
// than free fall. Surprisingly the acceleration settles at exactly g/7 (for a drop that grows evenly in radius)
// whatever the mist density (the drop is drawn scaled up, 40 cm across at the start, so the change shows in a few seconds). Slide the mist thickness: the graph shows a(t)/g approaching 1/7 and the drop swelling.
import { canvas, text, row, slider, readout, loop, button, line, dot } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let t = 0, d = null;
  const cv = canvas(host, { aspect: 0.85, max: 420, min: 300, label: 'A raindrop growing as it falls through mist, with acceleration against time' });
  const c1 = row(host);
  const sk = slider(c1, { label: 'Mist thickness ρ_mist/ρ_drop', min: 0.05, max: 1, step: 0.05, value: 0.3, fmt: (v) => v.toFixed(2), oninput: () => build() });
  const anim = loop(host, (dt) => { t += dt * 0.8; if (t > 6) t = 0; cv.redraw(); show(); });
  anim.button(c1); button(c1, 'Restart', () => { t = 0; });
  const out = readout(host);
  function build() {
    const k = sk.value, h = 0.002; let r = 0.2, v = 0, x = 0; d = [];
    for (let tm = 0; tm <= 6.001; tm += h) { if (Math.round(tm / h) % 10 === 0) d.push({ t: tm, r, v, x, a: G - (3 * k * v * v) / (4 * r) }); const a = G - (3 * k * v * v) / (4 * r); v += a * h; x += v * h; r += (k / 4) * v * h; }
    cv.redraw(); show();
  }
  const at = () => d[Math.min(d.length - 1, Math.round(t / 0.02))];
  function show() { const q = at(); out.innerHTML = `t = ${q.t.toFixed(1)} s: speed ${q.v.toFixed(1)} m/s (free fall would be ${(G * q.t).toFixed(1)}), radius ${(q.r * 100).toFixed(0)} cm, a = ${q.a.toFixed(2)} m/s² = ${(q.a / G).toFixed(3)} g. Limit a → g/7 = ${(G / 7).toFixed(2)} m/s²: with m ∝ x³ and v² = A x, A/2 + 3A = g gives A = 2g/7. Using F = ma here would be wrong: the mass is changing and the collected water starts at rest.`; }
  cv.draw = (ctx, w, h, col) => {
    const q = at(), top = h * 0.5, W = w * 0.32;
    ctx.fillStyle = col.soft; ctx.fillRect(8, 10, W, top - 14);
    for (let i = 0; i < 14; i++) dot(ctx, 14 + ((i * 29) % (W - 12)), 16 + ((i * 47 + q.x * 60) % (top - 30)), 1.6, col.s[4], col.s[4]);
    const dy = 20 + ((q.x * 20) % (top - 50)); ctx.beginPath(); ctx.arc(W / 2 + 8, top / 2, 4 + q.r * 9, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill();
    text(ctx, 'mist', 12, top - 6, { color: col.muted, size: 10 });
    const gx0 = W + 40, gx1 = w - 14, gy0 = 26, gy1 = top - 10, X = (tm) => gx0 + (tm / 6) * (gx1 - gx0), Y = (a) => gy1 - (a / G) * (gy1 - gy0);
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.muted, 1); line(ctx, [[gx0, gy0], [gx0, gy1]], col.muted, 1);
    ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [[gx0, Y(G / 7)], [gx1, Y(G / 7)]], col.s[1], 1.5); ctx.restore(); text(ctx, 'g/7', gx1, Y(G / 7) - 8, { color: col.s[1], size: 10, align: 'right' });
    line(ctx, d.map((p) => [X(p.t), Y(Math.max(0, p.a))]), col.s[0], 2.5); dot(ctx, X(q.t), Y(Math.max(0, q.a)), 5, col.bad, col.panel);
    text(ctx, 'a / g against t', gx0 + 4, gy0 - 8, { color: col.muted, size: 10 });
    const by0 = top + 22, by1 = h - 16, VY = (v) => by1 - (v / (G * 6)) * (by1 - by0);
    line(ctx, [[gx0, by1], [gx1, by1]], col.muted, 1); line(ctx, d.map((p) => [X(p.t), VY(p.v)]), col.s[2], 2.5); ctx.save(); ctx.setLineDash([5, 4]); line(ctx, [[X(0), VY(0)], [X(6), VY(G * 6)]], col.muted, 1.5); ctx.restore();
    dot(ctx, X(q.t), VY(q.v), 5, col.bad, col.panel); text(ctx, 'speed v (solid) vs free fall (dashed)', gx0 + 4, by0 - 8, { color: col.muted, size: 10 });
  };
  build();
}
