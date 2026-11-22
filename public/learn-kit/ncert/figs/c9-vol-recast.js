// Class 9 Surface Area and Volume: melt one big ball (radius 6 cm) and recast it into small balls of radius r. Volume is kept, so the
// number of balls is (6/r)^3. But the total surface area grows by the factor 6/r: more skin for the same metal.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell } from './c9-vol-lib.js';

export default function (host) {
  let r = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'One large ball melted into many small balls of equal total volume' });
  const ctl = row(host); const out = readout(host);
  choice(ctl, 'Small ball radius', [[3, '3 cm'], [2, '2 cm'], [1.5, '1.5 cm'], [1, '1 cm']], r, (v) => { r = v; sync(); });
  const cnt = () => Math.round(Math.pow(6 / r, 3));
  const sync = () => { const n = cnt(); out.innerHTML = `Big ball: V = 4⁄3 π × 6³ = 288π cm³. A small ball: 4⁄3 π × ${r}³ = ${+((4 * Math.pow(r, 3)) / 3).toFixed(3)}π cm³. Number of balls = 288π ÷ that = <b>${n}</b> (= (6 ÷ ${r})³). Total skin: big ball 144π cm², all small balls ${n} × ${+(4 * r * r).toFixed(2)}π = <b>${+(n * 4 * r * r).toFixed(1)}π cm²</b>, which is ${+(6 / r).toFixed(2)} times more.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Melt one ball, cast many balls', col), n = cnt(), R = Math.min(w * 0.2, 72), cx = R + 22, cy = top + 26 + R;
    ell(ctx, cx, cy, R, R, col.s[0], col.s[0], 0.35, 3); text(ctx, 'one ball', cx, cy, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'R = 6 cm', cx, cy + R + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, '→', cx + R + 18, cy, { color: col.ink, size: 22, weight: 700, align: 'center' });
    const ax = cx + R + 34, aw = w - ax - 10, ah = h - top - 48, cols = Math.ceil(Math.sqrt((n * aw) / ah)), rows = Math.ceil(n / cols), cell = Math.min(aw / cols, ah / rows), rr = Math.max(1.5, (cell / 2) * 0.9);
    const x0 = ax + (aw - cell * cols) / 2, y0 = top + 14;
    for (let i = 0; i < n; i++) ell(ctx, x0 + (i % cols) * cell + cell / 2, y0 + Math.floor(i / cols) * cell + cell / 2, rr, rr, col.s[1], col.s[1], 0.4, 1.2);
    text(ctx, n + ' balls of r = ' + r + ' cm', w / 2 + 20, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  sync();
}
