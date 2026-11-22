// The two axis theorems, checked on real dots. Parallel axis: slide an axis (perpendicular to a flat shape) away from
// the centre; I = I_cm + M d², a parabola. Perpendicular axis: for a flat shape I_z = I_x + I_y. Dots are bigger the
// farther they are from the chosen axis; the sums come from the dots, not from the formula.
import { canvas, text, row, choice, slider, readout, line } from '../kit.js';

const pts = (f) => { const o = []; for (let i = 0; i < 1500; i++) { const p = f(i); if (p) o.push(p); } return o; };
const grid = (ok) => pts((i) => { const x = ((i % 40) - 19.5) / 19.5, y = (Math.floor(i / 40) - 18.5) / 19.5; return ok(x, y) ? [x, y] : null; });
const SH = {
  disc: { n: 'Disc', P: grid((x, y) => x * x + y * y <= 1) },
  ring: { n: 'Ring', P: pts((i) => (i < 240 ? [Math.cos((i / 240) * 6.2832), Math.sin((i / 240) * 6.2832)] : null)) },
  plate: { n: 'Rectangular plate', P: grid((x, y) => Math.abs(y) <= 0.55) },
  rod: { n: 'Thin rod', P: pts((i) => (i < 120 ? [(i / 119) * 2 - 1, 0] : null)) },
};
export default function (host) {
  let shape = 'disc', mode = 'par';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A flat shape made of dots with an axis you can slide, and a graph of the moment of inertia against distance' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Theorem', [['par', 'Parallel axis'], ['perp', 'Perpendicular axis']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(c1, 'Shape', Object.keys(SH).map((k) => [k, SH[k].n]), shape, (v) => { shape = v; cv.redraw(); show(); });
  const sd = slider(c2, { label: 'Axis distance d', min: 0, max: 2, step: 0.05, value: 0.8, fmt: (v) => v.toFixed(2) + ' R', oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  const I = (f) => { const P = SH[shape].P; return P.reduce((s, p) => s + f(p), 0) / P.length; };
  const Icm = () => I((p) => p[0] * p[0] + p[1] * p[1]);
  function show() {
    if (mode === 'par') { const d = sd.value, ic = Icm(), ia = I((p) => (p[0] - d) ** 2 + p[1] ** 2); out.innerHTML = `Per unit mass (R = 1): I<sub>cm</sub> = ${ic.toFixed(3)}. Axis at d = ${d.toFixed(2)}: I from the dots = <b>${ia.toFixed(3)}</b>; I<sub>cm</sub> + d² = ${(ic + d * d).toFixed(3)}. Moving the axis off centre always adds M d²; the centre is the smallest I of all parallel axes.`; }
    else { const ix = I((p) => p[1] ** 2), iy = I((p) => p[0] ** 2), iz = Icm(); out.innerHTML = `I<sub>x</sub> (axis along x) = ${ix.toFixed(3)}, I<sub>y</sub> = ${iy.toFixed(3)}, I<sub>z</sub> (axis out of the page) = <b>${iz.toFixed(3)}</b> = I<sub>x</sub> + I<sub>y</sub> = ${(ix + iy).toFixed(3)}. This works only for flat shapes: each dot has r² = x² + y².`; }
  }
  cv.draw = (ctx, w, h, col) => {
    const P = SH[shape].P, sc = Math.min(w * 0.2, h * 0.17), cx = w * 0.3, cy = h * 0.3, d = sd.value;
    const ax = mode === 'par' ? [d, 0] : [0, 0];
    const rr = (p) => (mode === 'par' ? (p[0] - ax[0]) ** 2 + (p[1] - ax[1]) ** 2 : p[0] ** 2 + p[1] ** 2);
    const mx = Math.max(...P.map(rr)) || 1;
    P.forEach((p) => { const f = rr(p) / mx; ctx.globalAlpha = 0.25 + 0.75 * f; ctx.beginPath(); ctx.arc(cx + p[0] * sc, cy - p[1] * sc, 1.2 + 2 * f, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); });
    ctx.globalAlpha = 1;
    if (mode === 'par') { const X = cx + d * sc; ctx.beginPath(); ctx.arc(X, cy, 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.beginPath(); ctx.arc(X, cy, 11, 0, 7); ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); text(ctx, 'axis ⊥ page', X + 14, cy - 14, { color: col.bad, size: 11, weight: 700 }); text(ctx, 'centre', cx, cy + 18, { color: col.muted, size: 10, align: 'center' }); }
    else { line(ctx, [[cx - sc * 1.3, cy], [cx + sc * 1.3, cy]], col.s[1], 2); line(ctx, [[cx, cy - sc * 1.2], [cx, cy + sc * 1.2]], col.s[2], 2); text(ctx, 'x', cx + sc * 1.3 + 6, cy, { color: col.s[1], size: 12, weight: 700 }); text(ctx, 'y', cx, cy - sc * 1.2 - 8, { color: col.s[2], size: 12, weight: 700 }); ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); text(ctx, 'z (out of page)', cx + 10, cy + 16, { color: col.bad, size: 11, weight: 700 }); }
    // right panel: bars (perp) or parabola (par)
    const gx0 = w * 0.04, gx1 = w - 14, gy0 = h * 0.58, gy1 = h - 26;
    if (mode === 'par') {
      const ic = Icm(), f = (x) => ic + x * x, ymax = f(2), X = (x) => gx0 + 30 + (x / 2) * (gx1 - gx0 - 30), Y = (v) => gy1 - (v / ymax) * (gy1 - gy0);
      line(ctx, [[gx0 + 30, gy1], [gx1, gy1]], col.muted, 1); line(ctx, [[gx0 + 30, gy0], [gx0 + 30, gy1]], col.muted, 1);
      const cu = []; for (let x = 0; x <= 2.001; x += 0.05) cu.push([X(x), Y(f(x))]); line(ctx, cu, col.s[0], 2.5);
      ctx.save(); ctx.setLineDash([4, 3]); line(ctx, [[X(0), Y(ic)], [X(2), Y(ic)]], col.muted, 1); ctx.restore();
      const ia = I((p) => (p[0] - d) ** 2 + p[1] ** 2); ctx.beginPath(); ctx.arc(X(d), Y(ia), 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
      text(ctx, 'I', gx0 + 24, gy0 + 6, { color: col.ink, size: 12, weight: 700, align: 'right' }); text(ctx, 'axis distance d →', gx1, gy1 + 14, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'I = I_cm + Md²', X(1.1), Y(f(1.1)) - 12, { color: col.s[0], size: 11, weight: 700 });
    } else {
      const ix = I((p) => p[1] ** 2), iy = I((p) => p[0] ** 2), iz = Icm(), mxv = Math.max(iz, 0.01);
      [['Ix', ix, col.s[1]], ['Iy', iy, col.s[2]], ['Iz', iz, col.bad]].forEach(([n, v, c], k) => { const y = gy0 + 8 + k * 22; text(ctx, n, gx0 + 22, y + 6, { color: c, size: 12, weight: 700, align: 'right' }); ctx.fillStyle = c; ctx.fillRect(gx0 + 30, y, ((gx1 - gx0 - 30) * v) / mxv, 14); });
    }
  };
  show();
}
