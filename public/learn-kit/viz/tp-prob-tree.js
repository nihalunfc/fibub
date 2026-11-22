// A two-stage probability tree. Set P(A), P(B given A) and P(B given not A) and the branch widths follow the numbers.
// Each leaf is the product along its path. Choose which event to light up: "A and B", "B by either route" (the total
// probability of B) or "A given B" (Bayes: A-and-B divided by all of B). All numbers are made up.
import { canvas, row, slider, choice, readout, text, title } from '../kit.js';

const g = (v) => v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
export default function (host) {
  let pa = 0.3, pba = 0.8, pbn = 0.2, ev = 'ab';
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 300, label: 'A probability tree with two stages' });
  const r = row(host);
  slider(r, { label: 'P(A)', min: 0.05, max: 0.95, step: 0.05, value: pa, fmt: (v) => v.toFixed(2), oninput: (v) => { pa = v; cv.redraw(); show(); } });
  slider(r, { label: 'P(B | A)', min: 0, max: 1, step: 0.05, value: pba, fmt: (v) => v.toFixed(2), oninput: (v) => { pba = v; cv.redraw(); show(); } });
  slider(r, { label: 'P(B | not A)', min: 0, max: 1, step: 0.05, value: pbn, fmt: (v) => v.toFixed(2), oninput: (v) => { pbn = v; cv.redraw(); show(); } });
  const r2 = row(host); choice(r2, 'Light up', [['ab', 'A and B'], ['b', 'B (any route)'], ['agb', 'A given B']], ev, (v) => { ev = v; cv.redraw(); show(); });
  const out = readout(host);
  const L = () => [['A, B', pa * pba, true, true], ['A, not B', pa * (1 - pba), true, false], ['not A, B', (1 - pa) * pbn, false, true], ['not A, not B', (1 - pa) * (1 - pbn), false, false]];
  const show = () => { const l = L(), pb = l[0][1] + l[2][1];
    out.innerHTML = `P(A and B) = ${g(pa)} × ${g(pba)} = <b>${g(l[0][1])}</b>. P(B) = ${g(l[0][1])} + ${g(l[2][1])} = <b>${g(pb)}</b>. P(A | B) = ${g(l[0][1])} ÷ ${g(pb)} = <b>${pb ? g(l[0][1] / pb) : '0'}</b>. The four leaves add to ${g(l.reduce((s, x) => s + x[1], 0))}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Multiply along a path, add across paths', col);
    const x0 = 24, x1 = w * 0.38, x2 = w * 0.64, yc = h / 2 + 8, ys = [yc - h * 0.24, yc + h * 0.24], leafY = [yc - h * 0.33, yc - h * 0.12, yc + h * 0.12, yc + h * 0.33];
    const lit = (k) => (ev === 'ab' ? k === 0 : ev === 'b' ? k === 0 || k === 2 : k === 0 || k === 2), strong = (k) => (ev === 'agb' ? k === 0 : lit(k));
    const br = (xa, ya, xb, yb, p, on, lab) => { ctx.strokeStyle = on ? col.s[0] : col.muted; ctx.globalAlpha = on ? 1 : 0.5; ctx.lineWidth = 1 + 7 * p; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke(); ctx.globalAlpha = 1; text(ctx, lab, (xa + xb) / 2, (ya + yb) / 2 - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); };
    const l = L();
    br(x0, yc, x1, ys[0], pa, true, 'A ' + g(pa)); br(x0, yc, x1, ys[1], 1 - pa, true, 'not A ' + g(1 - pa));
    br(x1, ys[0], x2, leafY[0], pba, lit(0) || lit(1), g(pba)); br(x1, ys[0], x2, leafY[1], 1 - pba, false, g(1 - pba));
    br(x1, ys[1], x2, leafY[2], pbn, lit(2), g(pbn)); br(x1, ys[1], x2, leafY[3], 1 - pbn, false, g(1 - pbn));
    l.forEach((v, k) => { const on = lit(k); ctx.fillStyle = on ? col.s[1] : col.soft; ctx.fillRect(x2, leafY[k] - 11, w - x2 - 8, 22); ctx.strokeStyle = on ? col.s[1] : col.line; ctx.strokeRect(x2, leafY[k] - 11, w - x2 - 8, 22);
      text(ctx, `${v[0]}: ${g(v[1])}`, x2 + 5, leafY[k], { color: col.ink, size: 11, weight: on ? 700 : 400 }); });
    [x1, x0].forEach((x, i) => { ctx.beginPath(); ctx.arc(x, i ? yc : ys[0], 4, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); }); ctx.beginPath(); ctx.arc(x1, ys[1], 4, 0, 7); ctx.fill();
  };
  show();
}
