// Class 9 Linear Polynomials: two mobile plans as two linear polynomials in the number of GB (or calls) x. Plan A costs
// fixed + rate x, Plan B costs less fixed but more per unit. Where the lines cross the two plans cost the same: the idea
// behind solving two equations later (Chapter 13).
import { canvas, text, title, row, slider, readout, dot, line } from '../../kit.js';

const num = (v) => String(+v.toFixed(1)).replace('-', '−');
export default function (host) {
  let fa = 200, ra = 2, fb = 50, rb = 5, u = 40;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Two phone plans drawn as straight lines of cost against usage, crossing where the cost is equal' });
  const ctl = row(host);
  slider(ctl, { label: 'Plan A fixed (₹)', min: 0, max: 300, step: 10, value: fa, fmt: num, oninput: (v) => { fa = v; upd(); } });
  slider(ctl, { label: 'Plan A per unit (₹)', min: 0, max: 10, step: 0.5, value: ra, fmt: num, oninput: (v) => { ra = v; upd(); } });
  slider(ctl, { label: 'Plan B fixed (₹)', min: 0, max: 300, step: 10, value: fb, fmt: num, oninput: (v) => { fb = v; upd(); } });
  slider(ctl, { label: 'Plan B per unit (₹)', min: 0, max: 10, step: 0.5, value: rb, fmt: num, oninput: (v) => { rb = v; upd(); } });
  slider(ctl, { label: 'Units used x', min: 0, max: 100, step: 5, value: u, fmt: num, oninput: (v) => { u = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Cost A = ' + num(fa) + ' + ' + num(ra) + 'x, Cost B = ' + num(fb) + ' + ' + num(rb) + 'x', col);
    const L = 44, R = w - 14, T = t + 8, B = h - 34, ymax = 700;
    const X = (v) => L + (v / 100) * (R - L), Y = (v) => B - (Math.min(v, ymax) / ymax) * (B - T);
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let v = 0; v <= 100; v += 20) { ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), B); ctx.stroke(); text(ctx, String(v), X(v), B + 12, { color: col.muted, size: 10, align: 'center' }); }
    for (let v = 0; v <= ymax; v += 100) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); text(ctx, '₹' + v, L - 4, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    ctx.restore(); text(ctx, 'units used x', (L + R) / 2, h - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
    ctx.save(); ctx.beginPath(); ctx.rect(L, T, R - L, B - T); ctx.clip();
    line(ctx, [[X(0), Y(fa)], [X(100), Y(fa + 100 * ra)]], col.s[0], 3); line(ctx, [[X(0), Y(fb)], [X(100), Y(fb + 100 * rb)]], col.s[5], 3);
    ctx.restore();
    if (ra !== rb) { const xe = (fb - fa) / (ra - rb); if (xe >= 0 && xe <= 100) { const ye = fa + ra * xe; dot(ctx, X(xe), Y(ye), 7, col.s[3], col.ink); text(ctx, 'equal at x = ' + num(xe), X(xe), Y(ye) - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); } }
    ctx.save(); ctx.setLineDash([4, 4]); line(ctx, [[X(u), B], [X(u), T]], col.muted, 1.5); ctx.restore();
    dot(ctx, X(u), Y(fa + ra * u), 5, col.s[0], col.ink); dot(ctx, X(u), Y(fb + rb * u), 5, col.s[5], col.ink);
    text(ctx, 'A', R - 4, Y(fa + 100 * ra) + 10, { color: col.s[0], size: 12, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'B', R - 4, Y(fb + 100 * rb) + 10, { color: col.s[5], size: 12, weight: 700, align: 'right', halo: col.panel });
  };
  function upd() {
    const A = fa + ra * u, B = fb + rb * u, xe = ra !== rb ? (fb - fa) / (ra - rb) : null;
    out.innerHTML = `At x = ${u}: Plan A costs ₹${num(A)}, Plan B costs ₹${num(B)} (${A === B ? 'equal' : A < B ? 'A is cheaper' : 'B is cheaper'}). ` + (xe === null ? 'The lines are parallel (same slope): they never meet.' : xe >= 0 ? `The plans cost the same at x = ${num(xe)}: that is where A(x) = B(x).` : 'The lines would only meet at a negative number of units, so one plan is cheaper throughout.');
    cv.redraw();
  }
  upd();
}
