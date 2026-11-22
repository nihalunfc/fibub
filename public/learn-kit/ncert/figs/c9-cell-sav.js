// Class 9 Cell: why cells are small. A cube grows (side 1 to 10 units). Surface area = 6 s^2 grows with the square of
// the side, volume = s^3 with the cube, so surface area / volume = 6 / s falls. Food and oxygen come in through the
// surface but must serve the whole volume; a big cell gets starved. Bars compare the two as the side grows, and the
// cube can be split into 8 small cubes to show the ratio doubling.
import { canvas, text, title, line, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let s = 2, split = false;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A cube growing in size with bars for surface area, volume and the ratio of surface area to volume' });
  const ctl = row(host);
  slider(ctl, { label: 'Side of cube (units)', min: 1, max: 10, step: 1, value: s, fmt: (v) => v + '', oninput: (v) => { s = v; upd(); } });
  button(ctl, 'Cut into 8 small cubes (on/off)', () => { split = !split; upd(); });
  const out = readout(host);
  function upd() {
    const k = split ? 8 : 1, sd = split ? s / 2 : s, SA = k * 6 * sd * sd, V = k * sd ** 3;
    out.innerHTML = `Side ${sd} → surface area = <b>${SA}</b>, volume = <b>${V}</b>, ratio SA : V = <b>${(SA / V).toFixed(2)}</b>.` + (split ? ' Same volume as before, but twice the surface area: ratio doubles. Cells divide for this reason.' : ' Make the cube bigger and watch the ratio fall: the “skin” cannot keep up with the “stomach”.');
    cv.redraw();
  }
  const cube = (ctx, x, y, a, col, f) => { const d = a * 0.45; ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink;
    ctx.fillStyle = col.s[2]; ctx.fillRect(x, y, a, a); ctx.strokeRect(x, y, a, a);
    ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + a + d, y - d); ctx.lineTo(x + a, y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(x + a, y); ctx.lineTo(x + a + d, y - d); ctx.lineTo(x + a + d, y + a - d); ctx.lineTo(x + a, y + a); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Skin versus stomach', col);
    const U = Math.min((h - 110) / 14.5, (w * 0.5 - 30) / 14.5); // pixels per unit
    const bx = 14, by = h - 36 - 10 * U;
    if (!split) cube(ctx, bx, by + 10 * U - s * U, s * U, col);
    else { const a = (s / 2) * U; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) cube(ctx, bx + i * (a * 1.6 + 4), by + 10 * U - a - j * (a * 1.45 + 4), a, col); text(ctx, '×2 layers behind', bx, h - 14, { color: col.muted, size: 10 }); }
    // bars
    const k = split ? 8 : 1, sd = split ? s / 2 : s, SA = k * 6 * sd * sd, V = k * sd ** 3, ratio = SA / V;
    const X0 = w * 0.5, Wb = w * 0.44, Y0 = 56, bh = 20, mx = 600;
    const bar = (i, lab, v, vmax, c) => { const y = Y0 + i * 66; text(ctx, lab, X0, y, { color: col.ink, size: 11, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(X0, y + 8, Wb, bh); ctx.fillStyle = c; ctx.fillRect(X0, y + 8, Wb * Math.min(1, v / vmax), bh); text(ctx, String(+v.toFixed(2)), X0, y + 8 + bh + 12, { color: col.ink, size: 10.5 }); };
    bar(0, 'surface area (skin)', SA, mx, col.s[1]); bar(1, 'volume (stomach)', V, 1000, col.s[2]); bar(2, 'SA : V ratio', ratio, 6, col.s[3]);
    text(ctx, ratio < 1 ? 'too big to feed itself' : ratio >= 3 ? 'good for exchange' : 'getting stretched', X0, Y0 + 3 * 66 - 8, { color: ratio < 1 ? col.bad : ratio >= 3 ? col.good : col.warn, size: 11.5, weight: 700 });
  };
  upd();
}
