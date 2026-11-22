// Class 12 Moving Charges: B along the axis of one coil, and of a Helmholtz pair (two coils one radius apart), which makes
// the field nearly uniform between them. B(x) = Σ μ0 N I a² / 2(a² + (x − x_c)²)^{3/2}. A pair too far apart has a dip in the middle.
import { canvas, text, title, row, slider, choice, readout, axes, line, dot } from '../../kit.js';
import { MU0, si } from '../c12p-mmlib.js';

export default function (host) {
  let a = 10, N = 100, I = 2, mode = 'one';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'The field along the axis of one coil or two coils' });
  const ctl = row(host);
  slider(ctl, { label: 'Coil radius a', min: 5, max: 20, step: 1, value: a, fmt: (x) => `${x} cm`, oninput: (x) => { a = x; cv.redraw(); } });
  slider(ctl, { label: 'Turns N', min: 10, max: 200, step: 10, value: N, fmt: (x) => `${x}`, oninput: (x) => { N = x; cv.redraw(); } });
  slider(ctl, { label: 'Current I', min: 0.5, max: 5, step: 0.5, value: I, fmt: (x) => `${x} A`, oninput: (x) => { I = x; cv.redraw(); } });
  choice(ctl, 'Coils', [['one', 'One coil'], ['helm', 'Pair, d = a'], ['far', 'Pair, d = 2a']], mode, (x) => { mode = x; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Field along the axis, x in units of a', col);
    const A = a / 100, cs = mode === 'one' ? [0] : mode === 'helm' ? [-0.5, 0.5] : [-1, 1];
    const B = (xa) => cs.reduce((s, c) => s + (MU0 * N * I * A * A) / (2 * Math.pow(A * A + Math.pow(xa * A - c * A, 2), 1.5)), 0);
    const Bc = B(0), ymax = Math.max(Bc, B(0.001), ...[0.5, 1, 1.5].map(B)) * 1.2;
    const g = axes(ctx, w, h, col, { x: [-3, 3], y: [0, ymax], t: top + 56, b: 34, l: 62, r: 12, xt: [-3, -2, -1, 0, 1, 2, 3], fx: (v) => v, fy: (v) => si(v, 'T').replace(/ /, ''), xlabel: 'distance along the axis, x / a' });
    ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let k = 0; k <= 120; k++) { const x = -3 + k * 0.05, X = g.X(x), Y = g.Y(B(x)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(0), g.Y(Bc), 5, col.s[1], col.ink);
    const cy = top + 26;
    for (const c of cs) { const X = g.X(c); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(X, cy, 5, 20, 0, 0, 7); ctx.stroke(); ctx.restore(); }
    line(ctx, [[g.L, cy], [g.R, cy]], col.line, 1, [3, 4]);
    out.innerHTML = `At the centre B = <b>${si(Bc, 'T')}</b>` + (mode === 'one' ? ` = μ0NI/2a.` : mode === 'helm' ? `, and the curve stays flat for about ±a/4 either side: a nearly uniform field (Helmholtz coils).` : `: too far apart, so the field dips in the middle between two humps.`);
  };
  cv.redraw();
}
