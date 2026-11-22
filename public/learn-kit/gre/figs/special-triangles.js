// 4.2 Special right triangles: 45-45-90 and 30-60-90, scaled by any length.
import { canvas, row, choice, slider, readout, text, title } from '../../kit.js';
const T = { t45: { name: '45-45-90', r: [1, 1, Math.SQRT2], lab: ['s', 's', 's√2'] }, t30: { name: '30-60-90', r: [1, Math.sqrt(3), 2], lab: ['s', 's√3', '2s'] }, t345: { name: '3-4-5', r: [3, 4, 5], lab: ['3k', '4k', '5k'] } };
const f = (v) => (Math.round(v * 100) / 100).toString();
export default function (host) {
  let k = 't45', s = 4;
  const cv = canvas(host, { aspect: 0.6, max: 300, min: 220, label: 'A right triangle with its side ratios' });
  const ctl = row(host); choice(ctl, 'Triangle', Object.entries(T).map(([a, t]) => [a, t.name]), k, (v) => { k = v; go(); });
  slider(row(host), { label: 'Scale (s or k)', min: 1, max: 10, step: 1, value: s, fmt: (v) => String(Math.round(v)), oninput: (v) => { s = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const t = T[k], L = t.r.map((x) => x * s); out.innerHTML = `Sides ${t.lab.join(' : ')} → ${L.map(f).join(', ')}. Check: ${f(L[0])}² + ${f(L[1])}² = ${f(L[0] ** 2 + L[1] ** 2)} = ${f(L[2])}².`; };
  cv.draw = (ctx, w, h, col) => {
    const t = T[k], sc = Math.min((w - 90) / t.r[1], (h - 80) / t.r[0]), x0 = 40, y0 = h - 30, A = [x0, y0], B = [x0 + t.r[1] * sc, y0], C = [x0, y0 - t.r[0] * sc];
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1;
    ctx.strokeRect(x0, y0 - 12, 12, 12);
    text(ctx, `${t.lab[1]} = ${f(t.r[1] * s)}`, (A[0] + B[0]) / 2, y0 + 14, { color: col.ink, size: 12, align: 'center' });
    text(ctx, `${t.lab[0]} = ${f(t.r[0] * s)}`, x0 - 6, (A[1] + C[1]) / 2, { color: col.ink, size: 12, align: 'right' });
    text(ctx, `${t.lab[2]} = ${f(t.r[2] * s)}`, (B[0] + C[0]) / 2 + 10, (B[1] + C[1]) / 2 - 10, { color: col.s[0], size: 12, weight: 700 });
    title(ctx, `The ${t.name} triangle`, col);
  };
  go();
}
