// Class 11 Maths, Trigonometric Functions: signs in the four quadrants. Point (cos θ, sin θ): cos is its x, sin its y. In quadrant I all
// ratios are positive, II only sin (and cosec), III only tan (and cot), IV only cos (and sec): "All Silver Tea Cups".
import { canvas, text, title, row, slider, readout, dot } from '../../kit.js';
import { r2 } from '../c11m-lib.js';

export default function (host) {
  let deg = 120, sl;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'Unit circle with four quadrants labelled with which ratios are positive' });
  const out = readout(host);
  const Q = [['I', 'All positive', 'A'], ['II', 'sin, cosec +', 'S'], ['III', 'tan, cot +', 'T'], ['IV', 'cos, sec +', 'C']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Which quadrant? Which signs?', col), R = Math.min(w * 0.3, (h - top) * 0.4), cx = w / 2, cy = top + 14 + R, a = (deg * Math.PI) / 180, qd = Math.floor((deg % 360) / 90) % 4;
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.14; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R + 14, -(qd + 1) * Math.PI / 2, -qd * Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - R - 14, cy); ctx.lineTo(cx + R + 14, cy); ctx.moveTo(cx, cy - R - 14); ctx.lineTo(cx, cy + R + 14); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const pos = [[0.5, -0.5], [-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]];
    Q.forEach(([n, t, l], i) => { const on = i === qd, x = cx + pos[i][0] * R, y = cy + pos[i][1] * R; text(ctx, `${n}: ${l}`, x, y - 8, { color: on ? col.ink : col.muted, size: on ? 14 : 12, weight: 800, align: 'center' }); text(ctx, t, x, y + 9, { color: on ? col.s[2] : col.muted, size: 10, weight: 600, align: 'center' }); });
    const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, px, py, 6, col.s[0], col.panel);
    const sg = (v) => (Math.abs(v) < 1e-9 ? '0' : v > 0 ? '+' : '−');
    const t = Math.tan(a), tt = Math.abs(Math.cos(a)) < 1e-9 ? '∞' : sg(t);
    text(ctx, `sin ${sg(Math.sin(a))}    cos ${sg(Math.cos(a))}    tan ${tt}`, w / 2, cy + R + 32, { color: col.ink, size: 14, weight: 800, align: 'center' });
    out.innerHTML = `θ = <b>${deg}°</b> (quadrant ${Q[qd][0]}): sin = ${r2(Math.sin(a))}, cos = ${r2(Math.cos(a))}, tan = ${Math.abs(Math.cos(a)) < 1e-9 ? 'not defined' : r2(t)}.`;
  };
  sl = slider(row(host), { label: 'θ (degrees)', min: 0, max: 359, step: 1, value: deg, fmt: (v) => Math.round(v) + '°', oninput: (v) => { deg = Math.round(v); cv.redraw(); } });
  cv.redraw();
}
