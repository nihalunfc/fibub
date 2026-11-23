// Class 8 Proportional Reasoning 2: inverse proportion. A job needs 60 worker-days. With more workers it takes fewer days,
// but workers x days stays 60: the rectangle changes shape and keeps its area.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let k = 3;
  const J = 60, DIV = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A rectangle of fixed area: workers across, days up' });
  const ctl = row(host);
  slider(ctl, { label: 'Workers', min: 0, max: DIV.length - 1, step: 1, value: k, fmt: (v) => DIV[v], oninput: (v) => { k = v; sync(); } });
  const out = readout(host);
  function sync() { const x = DIV[k], d = J / x; out.innerHTML = `${x} workers take <b>${d} days</b>. Workers × days = ${x} × ${d} = <b>${J}</b> every time. Double the workers, half the days.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same job, more workers, fewer days', col), x = DIV[k], d = J / x;
    const L = 44, B = h - 44, W = w - L - 16, H = B - top - 18, sx = W / 60, sy = H / 60;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (const v of [10, 20, 30, 40, 50, 60]) { ctx.beginPath(); ctx.moveTo(L, B - v * sy); ctx.lineTo(L + W, B - v * sy); ctx.stroke(); text(ctx, String(v), L - 6, B - v * sy, { color: col.muted, size: 10, align: 'right' }); }
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(L + W, B); ctx.moveTo(L, B); ctx.lineTo(L, B - H); ctx.stroke();
    // the curve workers x days = 60
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 1; i <= 60; i += 0.5) { const px = L + i * sx, py = B - (J / i) * sy; i === 1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
    ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.28; ctx.fillRect(L, B - d * sy, x * sx, d * sy); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.strokeRect(L, B - d * sy, x * sx, d * sy);
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(L + x * sx, B - d * sy, 5, 0, 7); ctx.fill();
    text(ctx, 'days', 10, top + 8, { color: col.muted, size: 10.5 });
    text(ctx, 'workers →', L + W, B + 14, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, x + ' × ' + d + ' = 60', L + Math.max(70, x * sx) / 2 + 4, B - Math.max(d * sy, 22) / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
