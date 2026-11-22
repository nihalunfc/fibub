// Class 9 Cell: magnification. Total magnification = eyepiece power x objective power. Pick both lenses and see how
// big an object of a chosen true size looks, and how many cells fit in the field of view. Field of view shrinks as
// magnification grows (a typical field at 100x is about 1.8 mm across; at higher power it is that divided by the ratio).
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let eye = 10, obj = 10, size = 100; // size = true cell size in micrometres
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A microscope field of view showing how many cells fit at different magnifications' });
  const ctl = row(host);
  slider(ctl, { label: 'Eyepiece ×', min: 5, max: 20, step: 5, value: eye, fmt: (v) => v + '×', oninput: (v) => { eye = v; upd(); } });
  slider(ctl, { label: 'Objective ×', min: 4, max: 100, step: 1, value: obj, fmt: (v) => v + '×', oninput: (v) => { obj = v; upd(); } });
  slider(ctl, { label: 'True cell size (µm)', min: 5, max: 300, step: 5, value: size, fmt: (v) => v + ' µm', oninput: (v) => { size = v; upd(); } });
  const out = readout(host);
  const M = () => eye * obj, fov = () => 1800 / (M() / 100); // field of view in micrometres
  function upd() {
    const m = M(), seen = size * m / 1000;
    out.innerHTML = `Total magnification = ${eye} × ${obj} = <b>${m}×</b>. A cell of ${size} µm looks <b>${seen.toFixed(seen < 10 ? 1 : 0)} mm</b> across (true size × ${m}). The field of view is only about <b>${Math.round(fov())} µm</b> wide, so about <b>${Math.max(0, Math.floor(fov() / size))}</b> cells fit across.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Through the eyepiece: ${M()}×`, col);
    const cx = w / 2, cy = h * 0.5, R = Math.min(w, h) * 0.37, f = fov(), px = (2 * R) / f; // pixels per micrometre
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip(); ctx.fillStyle = col.panel; ctx.fillRect(0, 0, w, h);
    const s = Math.max(size * px, 3);
    const nx = Math.ceil(R / s) + 1;
    for (let j = -nx; j <= nx; j++) for (let i = -nx; i <= nx; i++) {
      const x = cx + (i + (j % 2 ? 0.5 : 0)) * s, y = cy + j * s * 0.86;
      if (s < 4) { dot(ctx, x, y, 0.8, col.s[4]); continue; }
      ctx.beginPath(); ctx.ellipse(x, y, s * 0.46, s * 0.4, 0, 0, 7); ctx.strokeStyle = col.s[4]; ctx.lineWidth = Math.min(2, s / 20); ctx.stroke();
      if (s > 8) dot(ctx, x, y, s * 0.12, col.s[1]);
    }
    ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.stroke();
    // scale bar of 100 um
    const bar = 100 * px; if (bar < R * 1.8) { ctx.fillStyle = col.ink; ctx.fillRect(cx - R + 6, cy + R - 14, bar, 3); text(ctx, '100 µm', cx - R + 6, cy + R - 24, { color: col.ink, size: 10 }); }
    else text(ctx, 'bar: 100 µm (longer than the view)', cx - R + 6, cy + R - 14, { color: col.muted, size: 10 });
  };
  upd();
}
