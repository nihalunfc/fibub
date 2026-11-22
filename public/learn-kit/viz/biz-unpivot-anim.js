// Unpivot in motion: a wide table (one column per month) becomes a long table (one row per store and month) when the
// month headings turn into a column of values. Drag the slider or press Play and follow one number from the grid into the
// list. Long tables are what Power BI models and charts want. Made-up numbers.
import { canvas, text, title, row, slider, readout, loop, ease, lerp } from '../kit.js';

const ST = ['Rideau', 'Queen', 'Forks'], MO = ['Jan', 'Feb', 'Mar'], V = [[12, 14, 15], [9, 8, 11], [5, 6, 4]];
export default function (host) {
  let t = 0, dir = 1;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 340, label: 'A wide table turning into a long table' });
  const ctl = row(host);
  const S = slider(ctl, { label: 'Wide  →  Long', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.02 ? 'Wide' : v > 0.98 ? 'Long' : Math.round(v * 100) + '%'), oninput: (v) => { t = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { t += dir * dt * 0.25; if (t >= 1.25) dir = -1; if (t <= -0.25) dir = 1; S.set(Math.max(0, Math.min(1, t))); cv.redraw(); show(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  const show = () => { const u = Math.max(0, Math.min(1, t)); out.innerHTML = u < 0.05 ? '<b>Wide:</b> 3 rows × 3 month columns. Adding April would mean a new column, and a chart cannot treat "Jan, Feb, Mar" as one field.' : u > 0.95 ? '<b>Long:</b> 9 rows with three columns: Store, Month, Sales. A new month is just more rows, and Month can go on a chart axis or slicer.' : 'The month headings drop out of the column names and become values in a new <b>Attribute</b> column; the numbers become one <b>Value</b> column.'; };
  cv.draw = (ctx, w, h, col) => {
    const u = ease(Math.max(0, Math.min(1, t)));
    title(ctx, u < 0.5 ? 'Wide table' : 'Long table', col);
    const cw = Math.min(70, (w - 90) / 3), x0 = 70, y0 = 56, rh = 26, lx = [20, 100, w - 90], ly0 = 66, lh = 24;
    // headings
    MO.forEach((m, j) => { ctx.globalAlpha = 1 - u; text(ctx, m, x0 + j * cw + cw / 2, y0 - 14, { color: col.muted, size: 11, weight: 700, align: 'center', fit: false }); ctx.globalAlpha = 1; });
    ['Store', 'Month', 'Sales'].forEach((c, j) => { ctx.globalAlpha = u; text(ctx, c, lx[j], 52, { color: col.muted, size: 11, weight: 700, fit: false }); ctx.globalAlpha = 1; });
    ST.forEach((s, i) => V[i].forEach((v, j) => {
      const idx = i * 3 + j, wx = x0 + j * cw + cw / 2, wy = y0 + i * rh + 10, ex = lx[2], ey = ly0 + 10 + idx * lh + 10;
      ctx.fillStyle = col.s[j]; ctx.globalAlpha = 0.18; ctx.fillRect(lerp(wx - cw / 2 + 2, lx[0] - 6, u * 0), lerp(wy - 12, ey - 12, u), 0, 0); ctx.globalAlpha = 1;
      const x = lerp(wx, ex, u), y = lerp(wy, ey, u);
      ctx.globalAlpha = 0.22; ctx.fillStyle = col.s[j]; ctx.fillRect(x - (u < 0.5 ? cw / 2 - 2 : 24), y - 10, u < 0.5 ? cw - 4 : 40, 20); ctx.globalAlpha = 1;
      text(ctx, String(v), x, y, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false });
      ctx.globalAlpha = u; text(ctx, s, lx[0], y, { color: col.ink, size: 11, fit: false }); text(ctx, MO[j], lx[1], y, { color: col.s[j], size: 11, weight: 700, fit: false }); ctx.globalAlpha = 1;
    }));
    ST.forEach((s, i) => { ctx.globalAlpha = 1 - u; text(ctx, s, 10, y0 + i * rh + 10, { color: col.ink, size: 11, weight: 600, fit: false }); ctx.globalAlpha = 1; });
  };
  show(); cv.redraw();
}
