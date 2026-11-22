// Inequalities on a number line. Pick a form (x > a, a < x ≤ b, |x − c| < d, |x − c| > d), set the numbers, and slide a test
// value along the line: it turns green inside the solution and red outside. Open circles leave the end out; closed
// circles keep it. The readout gives the solution in words and in interval form.
import { canvas, row, slider, choice, readout, text, title, line } from '../kit.js';

const m = (v) => String(v).replace('-', '−');
export default function (host) {
  let kind = 'abs-in', a = -2, b = 3, c = 1, d = 3, t = 0, incl = false;
  const cv = canvas(host, { aspect: 0.5, max: 260, min: 210, label: 'A number line with the solution of an inequality shaded' });
  const c0 = row(host); choice(c0, 'Form', [['gt', 'x > a'], ['between', 'a < x < b'], ['abs-in', '|x − c| < d'], ['abs-out', '|x − c| > d']], kind, (v) => { kind = v; build(); cv.redraw(); show(); });
  const c1 = row(host); choice(c1, 'Ends', [[false, 'Left out (<, >)'], [true, 'Kept (≤, ≥)']], incl, (v) => { incl = v; cv.redraw(); show(); });
  const rw = row(host);
  const build = () => { rw.innerHTML = ''; const S = (label, v, set, lo = -8, hi = 8) => slider(rw, { label, min: lo, max: hi, step: 1, value: v, fmt: m, oninput: (x) => { set(x); cv.redraw(); show(); } });
    if (kind === 'gt') S('a', a, (v) => { a = v; }); else if (kind === 'between') { S('a', a, (v) => { a = Math.min(v, b); }); S('b', b, (v) => { b = Math.max(v, a); }); } else { S('c', c, (v) => { c = v; }); S('d', d, (v) => { d = v; }, 1, 6); }
    slider(rw, { label: 'Test value x', min: -10, max: 10, step: 0.5, value: t, fmt: m, oninput: (x) => { t = x; cv.redraw(); show(); } }); };
  const out = readout(host);
  const ok = (x) => { const s = (p, q) => (incl ? p <= q : p < q);
    return kind === 'gt' ? s(a, x) : kind === 'between' ? s(a, x) && s(x, b) : kind === 'abs-in' ? (incl ? Math.abs(x - c) <= d : Math.abs(x - c) < d) : (incl ? Math.abs(x - c) >= d : Math.abs(x - c) > d); };
  const lt = () => (incl ? '≤' : '<'), br = (l, r, lc, rc) => (lc ? '[' : '(') + l + ', ' + r + (rc ? ']' : ')');
  const show = () => { let s;
    if (kind === 'gt') s = `x ${incl ? '≥' : '>'} ${m(a)}  →  ${br(m(a), '∞', incl, false)}`;
    else if (kind === 'between') s = `${m(a)} ${lt()} x ${lt()} ${m(b)}  →  ${br(m(a), m(b), incl, incl)}`;
    else if (kind === 'abs-in') s = `|x − ${m(c)}| ${lt()} ${d} means ${m(c - d)} ${lt()} x ${lt()} ${m(c + d)}  →  ${br(m(c - d), m(c + d), incl, incl)}`;
    else s = `|x − ${m(c)}| ${incl ? '≥' : '>'} ${d} means x ${incl ? '≤' : '<'} ${m(c - d)} or x ${incl ? '≥' : '>'} ${m(c + d)}  →  (−∞, ${m(c - d)}${incl ? ']' : ')'} ∪ ${incl ? '[' : '('}${m(c + d)}, ∞)`;
    out.innerHTML = `<b>${s}</b>. Test x = ${m(t)}: <b>${ok(t) ? 'is' : 'is not'}</b> a solution.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Solution on the number line', col);
    const L = 18, R = w - 18, y = h * 0.55, X = (v) => L + (v + 10) / 20 * (R - L);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    for (let v = -10; v <= 10; v += 2) { ctx.beginPath(); ctx.moveTo(X(v), y - 4); ctx.lineTo(X(v), y + 4); ctx.stroke(); text(ctx, m(v), X(v), y + 16, { color: col.muted, size: 10, align: 'center' }); }
    const seg = (x0, x1) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(Math.max(L, X(x0)), y - 9, Math.min(R, X(x1)) - Math.max(L, X(x0)), 18); ctx.globalAlpha = 1; };
    let ends = [];
    if (kind === 'gt') { seg(a, 10); ends = [a]; } else if (kind === 'between') { seg(a, b); ends = [a, b]; } else if (kind === 'abs-in') { seg(c - d, c + d); ends = [c - d, c + d]; text(ctx, `centre ${m(c)}`, X(c), y - 20, { color: col.muted, size: 10, align: 'center' }); } else { seg(-10, c - d); seg(c + d, 10); ends = [c - d, c + d]; }
    ends.forEach((e) => { ctx.beginPath(); ctx.arc(X(e), y, 6, 0, 7); ctx.fillStyle = incl ? col.s[0] : col.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.stroke(); text(ctx, m(e), X(e), y - 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    const good = ok(t); ctx.beginPath(); ctx.arc(X(t), y, 8, 0, 7); ctx.fillStyle = good ? col.good : col.bad; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, good ? 'x works' : 'x fails', X(t), y + 36, { color: good ? col.good : col.bad, size: 11.5, weight: 700, align: 'center' });
  };
  build(); show();
}
