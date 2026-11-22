// Permutations and combinations: fill r slots from n different objects. In a row the choices multiply
// (n, n − 1, ...): that is nPr. A group ignores order, so each group was counted r! times: nCr = nPr / r!. Round a
// circle every arrangement is counted n times (once per rotation), so there are (n − 1)! of them.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const P = (n, r) => fact(n) / fact(n - r);
const big = (v) => v.toLocaleString('en-IN');

export default function (host) {
  let mode = 'row', n = 6, r = 3;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Slots being filled from n objects, showing how permutations and combinations are counted' });
  const ctl = row(host);
  const re = () => { if (r > n) r = n; cv.redraw(); show(); };
  choice(ctl, 'Count', [['row', 'in a row (nPr)'], ['group', 'groups (nCr)'], ['circle', 'round a circle']], mode, (v) => { mode = v; re(); });
  slider(ctl, { label: 'n objects', min: 2, max: 10, step: 1, value: n, oninput: (v) => { n = v; if (r > n) { r = n; sr.set(r); } re(); } });
  const sr = slider(ctl, { label: 'r chosen', min: 1, max: 10, step: 1, value: r, oninput: (v) => { r = Math.min(v, n); sr.set(r); re(); } });
  const out = readout(host);
  const show = () => {
    if (mode === 'row') out.innerHTML = `First slot: ${n} choices, next ${n - 1}, … , last ${n - r + 1}. Multiply: <b>${n}P${r} = n!/(n − r)! = ${big(P(n, r))}</b> ordered arrangements.`;
    else if (mode === 'group') out.innerHTML = `${n}P${r} = ${big(P(n, r))} counts every group ${r}! = ${big(fact(r))} times (once for each order of its members). So <b>${n}C${r} = ${big(P(n, r))}/${big(fact(r))} = ${big(P(n, r) / fact(r))}</b>. Check: ${n}C${r} = ${n}C${n - r}, choosing who goes is the same as choosing who stays.`;
    else out.innerHTML = `${n} people round a table: ${big(fact(n))} row arrangements, but turning the table gives the same seating, and each seating appears ${n} times. So <b>(n − 1)! = ${big(fact(n - 1))}</b>. If clockwise and anticlockwise count as the same (a necklace), halve it: ${n > 2 ? big(fact(n - 1) / 2) : 1}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const k = mode === 'circle' ? n : r;
    if (mode === 'circle') {
      const R = Math.min(w, h) * 0.32, cx = w / 2, cy = h / 2 + 6;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = i === 0 ? col.s[1] : col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke();
        text(ctx, i === 0 ? 'fix' : String(n - i), x, y, { color: i === 0 ? col.panel : col.ink, size: 11, weight: 700, align: 'center', fit: false });
      }
      text(ctx, `Fix one person, arrange the other ${n - 1}: ${n - 1}! ways`, w / 2, 16, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      return;
    }
    const gap = 8, bw = Math.min(56, (w - 40 - gap * (k - 1)) / k), x0 = (w - (bw * k + gap * (k - 1))) / 2, y0 = h * 0.3;
    text(ctx, mode === 'row' ? 'Order matters: multiply the choices for each slot' : 'Order does not matter: divide by the r! orders of each group', w / 2, 16, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    for (let i = 0; i < k; i++) {
      const x = x0 + i * (bw + gap);
      ctx.fillStyle = col.soft; ctx.fillRect(x, y0, bw, bw); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y0, bw, bw);
      text(ctx, String(n - i), x + bw / 2, y0 + bw / 2, { color: col.s[0], size: Math.min(20, bw * 0.45), weight: 700, align: 'center', fit: false });
      if (i < k - 1) text(ctx, '×', x + bw + gap / 2, y0 + bw / 2, { color: col.muted, size: 12, align: 'center', fit: false });
      text(ctx, 'slot ' + (i + 1), x + bw / 2, y0 + bw + 14, { color: col.muted, size: 10, align: 'center', fit: false });
    }
    if (mode === 'group') {
      const yb = y0 + bw + 32;
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x0, yb + 8); ctx.lineTo(x0 + bw * k + gap * (k - 1), yb + 8); ctx.lineTo(x0 + bw * k + gap * (k - 1), yb); ctx.stroke();
      text(ctx, `÷ ${r}! = ${big(fact(r))} orders of the same group`, w / 2, yb + 24, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    }
  };
  re();
}
