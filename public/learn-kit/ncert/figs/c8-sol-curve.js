// Class 8 Solutions: solubility curves. Solubility is the most of a substance (g) that dissolves in 100 g of water at a given
// temperature. Most solids dissolve more in hot water (potassium nitrate a lot more, common salt hardly changes); gases such as
// carbon dioxide dissolve LESS when the water is warm, which is why a warm fizzy drink goes flat. Values (g per 100 g water)
// are standard reference numbers, e.g. CRC Handbook of Chemistry and Physics, solubility tables.
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';

const SOL = { sugar: ['Sugar', [[0, 179], [20, 204], [40, 238], [60, 287], [80, 362], [100, 487]], 2], knO3: ['Potassium nitrate', [[0, 13.3], [20, 31.6], [40, 63.9], [60, 110], [80, 169], [100, 246]], 3], salt: ['Common salt', [[0, 35.7], [20, 35.9], [40, 36.4], [60, 37.1], [80, 38.0], [100, 39.2]], 4] };
const GAS = [[0, 0.335], [10, 0.232], [20, 0.169], [30, 0.126], [40, 0.097], [50, 0.076], [60, 0.058]];
const val = (pts, T) => { T = Math.min(Math.max(T, pts[0][0]), pts[pts.length - 1][0]); for (let i = 1; i < pts.length; i++) if (T <= pts[i][0]) { const [a, b] = pts[i - 1], [c, d] = pts[i]; return b + (d - b) * (T - a) / (c - a); } return pts[pts.length - 1][1]; };
export default function (host) {
  let T = 40, mode = 'solids';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Solubility against temperature for sugar, potassium nitrate, salt and carbon dioxide' });
  const ctl = row(host);
  choice(ctl, 'Show', [['solids', 'Solids'], ['gas', 'A gas (CO₂)']], mode, (v) => { mode = v; if (v === 'gas' && T > 60) { T = 60; sl.set(60); } say(); });
  const sl = slider(ctl, { label: 'Temperature', min: 0, max: 100, step: 5, value: T, fmt: (v) => `${v} °C`, oninput: (v) => { T = mode === 'gas' ? Math.min(v, 60) : v; say(); } });
  const out = readout(host);
  function say() {
    if (mode === 'gas') out.innerHTML = `At ${T} °C, 100 g of water holds about <b>${val(GAS, T).toFixed(3)} g</b> of carbon dioxide (at normal air pressure). Warm the water and the gas escapes: the curve <b>falls</b>.`;
    else out.innerHTML = `At ${T} °C, 100 g of water dissolves about <b>${Math.round(val(SOL.sugar[1], T))} g sugar</b>, <b>${Math.round(val(SOL.knO3[1], T))} g potassium nitrate</b> and <b>${val(SOL.salt[1], T).toFixed(1)} g salt</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const g = mode === 'gas', top = title(ctx, g ? 'A gas dissolves less in warm water' : 'Solids: solubility against temperature', col);
    const a = axes(ctx, w, h, col, { x: [0, g ? 60 : 100], y: g ? [0, 0.4] : [0, 500], xlabel: 'temperature (°C)', ylabel: g ? 'g CO₂ per 100 g water' : 'g per 100 g water', t: top + 4, l: 58, fy: (v) => String(v) });
    if (g) { line(ctx, GAS.map(([x, y]) => [a.X(x), a.Y(y)]), col.s[2], 3); dot(ctx, a.X(T), a.Y(val(GAS, T)), 6, col.s[2], col.ink); }
    else Object.values(SOL).forEach(([nm, pts, k], i) => {
      line(ctx, pts.map(([x, y]) => [a.X(x), a.Y(y)]), col.s[k - 1], 3); dot(ctx, a.X(T), a.Y(val(pts, T)), 5.5, col.s[k - 1], col.ink);
      text(ctx, nm, a.X(i === 2 ? 52 : 60), a.Y(i === 0 ? 300 : i === 1 ? 110 : 37) + (i === 2 ? -12 : i === 0 ? -14 : -14), { color: col.s[k - 1], size: 10.5, weight: 700 });
    });
    line(ctx, [[a.X(T), a.T], [a.X(T), a.B]], col.muted, 1, [4, 4]);
  };
  say();
}
