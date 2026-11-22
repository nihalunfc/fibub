// Errors combine: measure a and b with uncertainties. Pick an operation and see the result drawn as a bar with its
// own error bar, built from the rule (add absolute errors for + and −, add relative errors for × and ÷, double the
// relative error for a²). The grey bar is the true worst case found by trying all four extremes. Try a − b with a ≈ b.
import { canvas, text, row, choice, slider, readout } from '../kit.js';

export default function (host) {
  let op = 'add';
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'Measured values with error bars and the combined result' });
  const c1 = row(host), c2 = row(host), c3 = row(host);
  choice(c1, 'Result', [['add', 'a + b'], ['sub', 'a − b'], ['mul', 'a × b'], ['div', 'a ÷ b'], ['sq', 'a²']], op, (v) => { op = v; cv.redraw(); show(); });
  const re = () => { cv.redraw(); show(); };
  const sa = slider(c2, { label: 'a', min: 2, max: 10, step: 0.1, value: 6.0, fmt: (v) => v.toFixed(1), oninput: re });
  const da = slider(c2, { label: 'Δa', min: 0.05, max: 1, step: 0.05, value: 0.2, fmt: (v) => '±' + v.toFixed(2), oninput: re });
  const sb = slider(c3, { label: 'b', min: 2, max: 10, step: 0.1, value: 5.0, fmt: (v) => v.toFixed(1), oninput: re });
  const db = slider(c3, { label: 'Δb', min: 0.05, max: 1, step: 0.05, value: 0.2, fmt: (v) => '±' + v.toFixed(2), oninput: re });
  const out = readout(host);
  const F = { add: (a, b) => a + b, sub: (a, b) => a - b, mul: (a, b) => a * b, div: (a, b) => a / b, sq: (a) => a * a };
  function calc() {
    const a = sa.value, b = sb.value, x = da.value, y = db.value, f = F[op], v = f(a, b);
    const rule = op === 'add' || op === 'sub' ? x + y : op === 'sq' ? 2 * Math.abs(v) * x / a : Math.abs(v) * (x / a + y / b);
    const ex = [f(a + x, b + y), f(a + x, b - y), f(a - x, b + y), f(a - x, b - y)];
    return { a, b, x, y, v, rule, lo: Math.min(...ex), hi: Math.max(...ex) };
  }
  function show() {
    const r = calc(), d = Math.pow(10, Math.floor(Math.log10(r.rule)));
    const rd = (n) => (Math.round(n / d) * d).toFixed(Math.max(0, -Math.floor(Math.log10(r.rule))));
    out.innerHTML = `Result = ${r.v.toFixed(3)} ± ${r.rule.toFixed(3)} (${(100 * r.rule / Math.abs(r.v)).toFixed(1)}% of the result). Quoted properly: <b>${rd(r.v)} ± ${rd(r.rule)}</b>. Relative errors: a ${(100 * r.x / r.a).toFixed(1)}%, b ${(100 * r.y / r.b).toFixed(1)}%.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const r = calc(), rows = op === 'sq' ? [['a', r.a, r.x, col.s[0]]] : [['a', r.a, r.x, col.s[0]], ['b', r.b, r.y, col.s[1]]];
    rows.push([op === 'add' ? 'a + b' : op === 'sub' ? 'a − b' : op === 'mul' ? 'a × b' : op === 'div' ? 'a ÷ b' : 'a²', r.v, r.rule, col.s[2], true]);
    const all = [...rows.map((q) => [q[1] - q[2], q[1] + q[2]]).flat(), r.lo, r.hi, 0];
    const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.06 || 1;
    const X = (v) => 56 + ((v - lo + pad) / (hi - lo + 2 * pad)) * (w - 76);
    const rh = (h - 40) / rows.length;
    rows.forEach((q, i) => {
      const y = 36 + i * rh + rh / 2;
      text(ctx, q[0], 8, y, { color: q[3], size: 13, weight: 700 });
      if (q[4]) { ctx.fillStyle = col.line; ctx.fillRect(X(r.lo), y - 9, X(r.hi) - X(r.lo), 18); text(ctx, 'worst case', X(r.hi), y + 20, { color: col.muted, size: 10, align: 'right' }); }
      ctx.strokeStyle = q[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(q[1] - q[2]), y); ctx.lineTo(X(q[1] + q[2]), y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(q[1] - q[2]), y - 7); ctx.lineTo(X(q[1] - q[2]), y + 7); ctx.moveTo(X(q[1] + q[2]), y - 7); ctx.lineTo(X(q[1] + q[2]), y + 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(X(q[1]), y, 5, 0, 7); ctx.fillStyle = q[3]; ctx.fill();
      text(ctx, q[1].toFixed(2), X(q[1]), y - 14, { color: col.ink, size: 11, align: 'center' });
    });
    text(ctx, 'Each bar is the value with its error bar', 56, 14, { color: col.muted, size: 11 });
  };
  show();
}
