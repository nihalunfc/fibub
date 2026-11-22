// 5.2 The normal curve: shade a band of standard deviations and read the share of the data inside it.
import { canvas, row, choice, readout, text, title } from '../../kit.js';
const B = { one: ['Within 1 SD', -1, 1, 68], two: ['Within 2 SD', -2, 2, 95], three: ['Within 3 SD', -3, 3, 99.7], up1: ['Above +1 SD', 1, 4, 16], m2: ['Mean to +2 SD', 0, 2, 47.5] };
export default function (host) {
  let k = 'one';
  const cv = canvas(host, { aspect: 0.5, max: 260, min: 200, label: 'A bell-shaped normal curve with a shaded band' });
  choice(row(host), 'Band', Object.entries(B).map(([a, b]) => [a, b[0]]), k, (v) => { k = v; go(); });
  const out = readout(host);
  const go = () => { cv.redraw(); const b = B[k]; out.innerHTML = `${b[0]}: about <b>${b[3]}%</b> of the data. Out of 1,000 people that is about ${Math.round(b[3] * 10)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const l = 20, r = w - 20, base = h - 30, top = 50, X = (z) => l + (r - l) * (z + 3.5) / 7, Y = (z) => base - (base - top) * Math.exp(-z * z / 2);
    const b = B[k]; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(X(Math.max(-3.5, b[1])), base);
    for (let z = Math.max(-3.5, b[1]); z <= Math.min(3.5, b[2]); z += 0.02) ctx.lineTo(X(z), Y(z)); ctx.lineTo(X(Math.min(3.5, b[2])), base); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let z = -3.5; z <= 3.5; z += 0.02) z === -3.5 ? ctx.moveTo(X(z), Y(z)) : ctx.lineTo(X(z), Y(z)); ctx.stroke(); ctx.lineWidth = 1;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(l, base); ctx.lineTo(r, base); ctx.stroke();
    [-3, -2, -1, 0, 1, 2, 3].forEach((z) => text(ctx, z === 0 ? 'mean' : (z > 0 ? '+' : '−') + Math.abs(z), X(z), base + 14, { color: col.muted, size: 11, align: 'center' }));
    title(ctx, 'The 68-95-99.7 rule', col);
  };
  go();
}
