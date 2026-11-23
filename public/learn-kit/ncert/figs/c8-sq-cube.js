// Class 8 A Square and a Cube: a cube number n x n x n is built from n layers, each an n by n square of unit cubes.
// Slide the side to see the cube grow, and slide the layers to see how many unit cubes you have used so far.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 3, L = 3;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A cube made of unit cubes, built layer by layer' });
  const out = readout(host); const ctl = row(host);
  const sn = slider(ctl, { label: 'Side n', min: 1, max: 6, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = Math.round(v); L = n; sl.set(L); sync(); } });
  const sl = slider(ctl, { label: 'Layers built', min: 0, max: 6, step: 1, value: L, fmt: (v) => Math.min(Math.round(v), n), oninput: (v) => { L = Math.min(Math.round(v), n); sync(); } });
  function sync() { out.innerHTML = `${L} layer${L === 1 ? '' : 's'} of ${n} × ${n} = ${L} × ${n * n} = <b>${L * n * n}</b> unit cubes. Full cube: ${n} × ${n} × ${n} = <b>${n ** 3}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Cube numbers from layers', col), s = Math.min((w - 40) / (n * 1.5 + 1), (h - top - 20) / (n * 1.5 + 1), 44), dx = s * 0.5, dy = s * 0.35;
    const ox = (w - (n * s + n * dx)) / 2, oy = h - 14;
    // draw from back layer to front, each cell back to front
    for (let k = 0; k < L; k++) for (let r = n - 1; r >= 0; r--) for (let c = 0; c < n; c++) {
      const x = ox + c * s + k * dx * 0 + (n - 1 - r) * dx * 0, X = ox + c * s + (n - 1 - k) * dx, Y = oy - (r + 1) * s - (n - 1 - k) * dy * 0 - (n - 1 - k) * dy;
      const base = col.s[k % 6];
      ctx.fillStyle = base; ctx.fillRect(X, Y + 0, s, s); // front face
      ctx.fillStyle = col.ink; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(X + s, Y); ctx.lineTo(X + s + dx, Y - dy); ctx.lineTo(X + s + dx, Y - dy + s); ctx.lineTo(X + s, Y + s); ctx.fill(); // side
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + dx, Y - dy); ctx.lineTo(X + s + dx, Y - dy); ctx.lineTo(X + s, Y); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(X + 0.5, Y + 0.5, s - 1, s - 1);
    }
    void sn;
  };
  sync();
}
