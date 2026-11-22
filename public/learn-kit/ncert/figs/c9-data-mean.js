// Class 9 Data: the mean is the balance point. Each value is a weight on a beam (a number line). Slide the fulcrum: the beam balances
// exactly when it sits at the mean, because the pulls to the right and to the left (sum of distances) cancel: sum of (x - mean) = 0.
import { canvas, text, title, row, slider, choice, button, readout, clamp } from '../../kit.js';

const SETS = { a: [3, 5, 6, 10, 16], b: [4, 5, 5, 6, 6, 6, 8], c: [2, 3, 3, 4, 18] };
export default function (host) {
  let k = 'a', f = 4;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'A beam with weights on a number line balanced on a movable fulcrum' });
  const c1 = row(host); choice(c1, 'Data', [['a', '3 5 6 10 16'], ['b', '4 5 5 6 6 6 8'], ['c', '2 3 3 4 18']], k, (v) => { k = v; sl.set(f = 4); upd(); });
  const c2 = row(host); const sl = slider(c2, { label: 'Fulcrum at', min: 0, max: 20, step: 0.1, value: f, oninput: (v) => { f = v; upd(); } });
  button(c2, 'Put it at the mean', () => { f = mean(); sl.set(f); upd(); });
  const out = readout(host), D = () => SETS[k], mean = () => D().reduce((a, b) => a + b, 0) / D().length;
  cv.draw = (ctx, w, h, col) => {
    const d = D(), mu = mean(), t = title(ctx, 'Balance point of ' + d.join(', '), col), L = 22, R = w - 22, X = (v) => L + (v / 20) * (R - L), by = t + (h - t) * 0.55, r = Math.min(10, (R - L) / 20 * 0.45);
    const ang = clamp((mu - f) * 0.05, -0.32, 0.32), fx = X(f);
    ctx.save(); ctx.translate(fx, by); ctx.rotate(ang);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L - fx, 0); ctx.lineTo(R - fx, 0); ctx.stroke();
    const stack = {}; d.forEach((v) => { const n = (stack[v] = (stack[v] || 0) + 1); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(X(v) - fx, -2 - r - (n - 1) * 2 * r, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); });
    for (let v = 0; v <= 20; v += 5) text(ctx, String(v), X(v) - fx, 14, { color: col.muted, size: 10 });
    ctx.restore();
    ctx.save(); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(fx, by + 3); ctx.lineTo(fx - 14, by + 38); ctx.lineTo(fx + 14, by + 38); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = col.s[6]; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(mu), t + 6); ctx.lineTo(X(mu), by + 40); ctx.stroke(); ctx.restore();
    text(ctx, 'mean ' + (+mu.toFixed(2)), X(mu), t + 8, { color: col.s[6], size: 11, weight: 700, align: 'center', halo: col.panel });
    const bal = Math.abs(mu - f) < 0.05;
    text(ctx, bal ? 'Balanced!' : (mu > f ? 'Tips right: the pull to the right is bigger' : 'Tips left: the pull to the left is bigger'), w / 2, h - 12, { color: bal ? col.s[2] : col.s[5], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const d = D(), pull = d.reduce((a, v) => a + (v - f), 0), n = d.length, s = d.reduce((a, b) => a + b, 0); out.innerHTML = `Sum of (value − fulcrum) = <b>${+pull.toFixed(2)}</b>. It is 0 only at the mean = ${s} ÷ ${n} = <b>${+(s / n).toFixed(2)}</b>. Total of all values: ${s}, shared equally among ${n} would be ${+(s / n).toFixed(2)} each.`; cv.redraw(); }
  upd();
}
