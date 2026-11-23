// Class 11 Maths, Linear Inequalities: the solution set of x < a, x ≤ a, x > a or x ≥ a on the number line.
// A hollow dot means the end value is NOT included (strict < or >); a filled dot means it is (≤ or ≥).
// Drag the test point: it is a solution exactly when it lies on the shaded side (and on the dot only for ≤, ≥).
import { canvas, row, slider, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

export default function (host) {
  let a = 2, op = 'le', t = -1;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 270, label: 'A number line showing the solutions of a linear inequality with an open or closed dot' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  const SYM = { lt: '<', le: '≤', gt: '>', ge: '≥' };
  const holds = (x) => ({ lt: x < a, le: x <= a + 1e-9, gt: x > a, ge: x >= a - 1e-9 })[op];
  const L = 24, X = (v, w) => L + ((v + 6) / 12) * (w - 2 * L);
  let W = 300;
  choice(c1, 'sign', [['lt', 'x < a'], ['le', 'x ≤ a'], ['gt', 'x > a'], ['ge', 'x ≥ a']], op, (v) => { op = v; re(); });
  slider(c2, { label: 'a', min: -5, max: 5, step: 1, value: a, fmt: (v) => String(v), oninput: (v) => { a = v; re(); } });
  slider(c2, { label: 'test x', min: -6, max: 6, step: 0.5, value: t, fmt: (v) => String(v), oninput: (v) => { t = v; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `Test x = <b>${t}</b>: is ${t} ${SYM[op]} ${a}? <b style="color:${holds(t) ? 'var(--good,green)' : 'var(--bad,crimson)'}">${holds(t) ? 'yes, a solution' : 'no, not a solution'}</b>. ${op === 'le' || op === 'ge' ? 'The end value a itself is included (filled dot).' : 'The end value a is left out (hollow dot).'}`; };
  cv.draw = (ctx, w, h, col) => {
    W = w; const top = title(ctx, `Solutions of x ${SYM[op]} ${a}`, col), y = top + (h - top) * 0.45;
    const x0 = X(a, w), right = op === 'gt' || op === 'ge';
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.28; ctx.fillRect(right ? x0 : L, y - 14, right ? w - L - x0 : x0 - L, 28); ctx.globalAlpha = 1;
    line(ctx, [[L, y], [w - L, y]], col.muted, 1.5);
    for (let v = -6; v <= 6; v++) { const x = X(v, w); line(ctx, [[x, y - 5], [x, y + 5]], col.muted, 1); if (v % 2 === 0) text(ctx, String(v).replace('-', '−'), x, y + 20, { color: col.muted, size: 11, align: 'center' }); }
    line(ctx, [[right ? x0 : L, y], [right ? w - L : x0, y]], col.s[0], 4);
    text(ctx, right ? '→' : '←', right ? w - L - 4 : L + 4, y - 20, { color: col.s[0], size: 14, weight: 700, align: 'center' });
    dot(ctx, x0, y, 8, op === 'le' || op === 'ge' ? col.s[0] : col.panel, col.s[0]);
    if (!(op === 'le' || op === 'ge')) { ctx.beginPath(); ctx.arc(x0, y, 7, 0, 7); ctx.lineWidth = 2.5; ctx.strokeStyle = col.s[0]; ctx.stroke(); }
    text(ctx, 'a = ' + String(a).replace('-', '−'), x0, y - 30, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const xt = X(t, w), ok = holds(t); dot(ctx, xt, y + 44, 8, ok ? col.s[2] : col.s[1], col.panel);
    text(ctx, ok ? '✓' : '✗', xt, y + 62, { color: ok ? col.s[2] : col.s[1], size: 14, weight: 700, align: 'center' });
  };
  let drag = false;
  const tv = (e) => { const r = cv.c.getBoundingClientRect(); return Math.max(-6, Math.min(6, Math.round(((e.clientX - r.left - L) / (W - 2 * L) * 12 - 6) * 2) / 2)); };
  const nearT = (x, y) => Math.abs(x - X(t, W)) < 20 && y > cv.c.clientHeight * 0.55;
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (nearT(e.clientX - r.left, e.clientY - r.top)) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) { t = tv(e); re(); } });
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, nearT);
  re();
}
