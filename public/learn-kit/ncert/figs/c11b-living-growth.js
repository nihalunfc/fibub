// Class 11 Biology, The Living World: growth in living and non-living things. A living organism grows from inside: cells divide and the number of cells rises.
// A non-living object (a snowball, a crystal, a mountain) grows only by material sticking on from outside. So growth alone does not prove something is alive.
import { canvas, text, title, row, choice, loop, ease } from '../../kit.js';
import { ell, note } from '../c11b-lib.js';

export default function (host) {
  let mode = 'live', t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Living growth by cell division from inside compared with non-living growth by material added to the outside' });
  const ctl = row(host);
  choice(ctl, 'Thing', [['live', 'Living (a seedling)'], ['dead', 'Non-living (a snowball)']], mode, (v) => { mode = v; t = 0; cv.redraw(); });
  const a = loop(host, (dt) => { t += dt; cv.redraw(); }); a.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, mode === 'live' ? 'Living: growth from inside' : 'Non-living: growth from outside', col), cx = w / 2, cy = y0 + (h - y0 - 70) / 2 + 6, R = Math.min(w, h - y0 - 70) / 2 - 8;
    const k = Math.floor(t / 1.6) % 4, f = ease(Math.min(1, (t % 1.6) / 1.1));
    if (mode === 'live') {
      const n = 2 ** k, nn = 2 ** (k + 1 > 3 ? 0 : k + 1), cells = [];
      const m = Math.ceil(Math.sqrt(8)); for (let i = 0; i < 8; i++) { const gx = (i % 4) - 1.5, gy = Math.floor(i / 4) - 0.5; cells.push([gx, gy]); }
      const count = k === 3 && f > 0.99 ? 8 : n, cur = Math.min(8, f < 1 ? n * 2 : n);
      const showN = k === 3 ? 8 : (f > 0.5 ? n * 2 : n); const num = Math.min(8, showN);
      const rad = R / 3.2 * (0.8 + 0.2 * (k + f) / 4);
      for (let i = 0; i < num; i++) { const [gx, gy] = cells[i]; ell(ctx, cx + gx * rad * 1.9, cy + gy * rad * 2, rad * 0.9, rad * 0.9, col.s[1], col.ink, 1.5, 0.55); ell(ctx, cx + gx * rad * 1.9, cy + gy * rad * 2, rad * 0.28, rad * 0.28, col.s[0], null, 0, 0.9); }
      text(ctx, `cells: ${num}`, cx, h - 58, { color: col.s[1], size: 14, weight: 700, align: 'center' });
      note(ctx, 'Cells divide and the new cells are made from food taken in. The body grows from inside.', 14, h - 40, w - 28, col, { size: 11 });
    } else {
      const layers = 1 + k + (f > 0.5 ? 1 : 0);
      for (let i = layers; i >= 0; i--) ell(ctx, cx, cy, R * (0.3 + 0.17 * i) * 0.95, R * (0.3 + 0.17 * i) * 0.95, i === 0 ? col.ink : col.s[0], col.line, 1.5, i === 0 ? 0.5 : 0.15 + 0.1 * (layers - i));
      for (let i = 0; i < 10; i++) { const ang = i * 0.63 + t * 0.3, d = R * (1 - 0.8 * ((t * 0.5 + i * 0.1) % 1)), px = cx + Math.cos(ang * 2.1 + i) * d * 1.05, py = cy + Math.sin(ang * 2.1 + i) * d * 1.05; ell(ctx, px, py, 3, 3, col.muted, null, 0, 0.9); }
      text(ctx, `layers: ${layers}`, cx, h - 58, { color: col.s[0], size: 14, weight: 700, align: 'center' });
      note(ctx, 'Snow or minerals stick on the surface. Nothing is made inside, no cells and no food used. This is not life.', 14, h - 40, w - 28, col, { size: 11 });
    }
  };
}
