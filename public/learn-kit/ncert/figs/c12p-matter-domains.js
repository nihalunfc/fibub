// Class 12 Magnetism and Matter: magnetic domains in a ferromagnet. Each domain is a patch where all atomic moments already point the same way.
// An unmagnetised piece has domains pointing every which way (net M = 0). An applied H makes the domains that line up with it grow (here: flip) until
// all point along H: saturation. The curve shows M against H, which is not a straight line: ferromagnets are not linear.
import { canvas, text, title, row, slider, readout, arrow, axes, line, dot, rng } from '../../kit.js';

export default function (host) {
  let H = 0;
  const R = rng(11), N = 24, dirs = Array.from({ length: N }, (_, i) => (i % 2 ? 1 : -1)).map((d) => [R(), d]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), thr = Array.from({ length: N }, () => 0.1 + R() * 0.9);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Magnetic domains lining up as the applied field grows' });
  const ctl = row(host);
  slider(ctl, { label: 'Applied field H (to the right)', min: 0, max: 100, step: 1, value: H, fmt: (x) => `${x}%`, oninput: (x) => { H = x; cv.redraw(); } });
  const out = readout(host);
  const state = (h0) => dirs.map((d, i) => (d < 0 && h0 / 100 > thr[i] ? 1 : d));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Domains line up with H: magnetisation grows to saturation', col);
    const ht = h * 0.5, gx = 12, gw = w - 24, gh = ht - top - 6, cw = gw / 6, ch = gh / 4, s = state(H);
    for (let i = 0; i < N; i++) { const x = gx + (i % 6) * cw, y = top + 8 + Math.floor(i / 6) * ch, up = s[i] > 0; ctx.fillStyle = up ? col.soft : col.panel; ctx.fillRect(x + 2, y + 2, cw - 4, ch - 4); ctx.strokeStyle = col.line; ctx.strokeRect(x + 2, y + 2, cw - 4, ch - 4); arrow(ctx, x + cw / 2 - 12 * s[i], y + ch / 2, x + cw / 2 + 12 * s[i], y + ch / 2, up ? col.s[1] : col.s[0], 2.2, 8); }
    const frac = s.reduce((a, b) => a + b, 0) / N, mAt = (h0) => state(h0).reduce((a, b) => a + b, 0) / N;
    const g = axes(ctx, w, h, col, { x: [0, 100], y: [-0.2, 1.1], t: ht + 8, b: 34, l: 52, r: 14, xt: [0, 50, 100], yt: [0, 0.5, 1], fx: (v) => v, fy: (v) => v, xlabel: 'applied H (% of the field that saturates it)' });
    text(ctx, 'M / Msat', g.L + 6, g.T + 8, { color: col.muted, size: 10.5 });
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 100; k++) { const X = g.X(k), Y = g.Y(mAt(k)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(H), g.Y(frac), 6, col.s[3], col.ink);
    out.innerHTML = `${s.filter((v) => v > 0).length} of ${N} domains now point along H: <b>M = ${(frac * 100).toFixed(0)}%</b> of saturation. ${frac >= 0.999 ? 'Saturated: every domain lines up, adding more H gives no more M.' : H === 0 ? 'No field: domains point at random and cancel, so the iron is unmagnetised.' : 'Domains along H grow at the expense of the others.'}`;
  };
  cv.redraw();
}
