// Class 8 Time and the skies: two constellations. Saptarishi (the Big Dipper or Ursa Major) has seven bright stars; the two stars at
// the end of its bowl, Dubhe and Merak, point to the pole star (about 5 times the gap between them). Orion (Mriga or Kalpurush) is the
// hunter with three belt stars; extended to the lower left the belt points to Sirius, the brightest star in the night sky.
// Star positions (RA hours, Dec degrees): standard catalogue values rounded to 2 decimals (Hipparcos / Yale Bright Star Catalogue).
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const DIP = [['Dubhe', 11.06, 61.75], ['Merak', 11.03, 56.38], ['Phecda', 11.9, 53.69], ['Megrez', 12.26, 57.03], ['Alioth', 12.9, 55.96], ['Mizar', 13.4, 54.93], ['Alkaid', 13.79, 49.31]];
const DIPL = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];
const ORI = [['Betelgeuse', 5.92, 7.41], ['Bellatrix', 5.42, 6.35], ['Rigel', 5.24, -8.2], ['Saiph', 5.8, -9.67], ['Alnitak', 5.68, -1.94], ['Alnilam', 5.6, -1.2], ['Mintaka', 5.53, -0.3], ['Meissa', 5.59, 9.93]];
const ORIL = [[0, 1], [0, 4], [1, 6], [6, 5], [5, 4], [6, 2], [4, 3], [7, 0], [7, 1]];
export default function (host) {
  let which = 'dip', mode = 'join';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'The stars of Saptarishi and Orion with lines and pointers' });
  const ctl = row(host);
  choice(ctl, 'Constellation', [['dip', 'Saptarishi'], ['ori', 'Orion']], which, (v) => { which = v; say(); });
  choice(ctl, 'Show', [['stars', 'Stars only'], ['join', 'Join the dots'], ['point', 'Pointers']], mode, (v) => { mode = v; say(); });
  const out = readout(host);
  const say = () => { out.innerHTML = which === 'dip' ? (mode === 'point' ? 'Follow the line from <b>Merak</b> through <b>Dubhe</b> and go about five gaps further: you reach the <b>pole star</b>, which shows north. Seen from India it is low in the north, so the Saptarishi dips below the horizon in some seasons.' : 'Saptarishi: seven bright stars shaped like a big spoon or a plough. In Indian tradition they are the seven sages (Saptarishi).') : (mode === 'point' ? 'The three belt stars in a short straight line point to <b>Sirius</b>, the brightest star in the whole sky.' : 'Orion the hunter: two bright shoulders, two knees, and a belt of three stars. Reddish <b>Betelgeuse</b> and bluish <b>Rigel</b> have different colours because their surfaces have different temperatures.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, which === 'dip' ? 'Saptarishi (Big Dipper)' : 'Orion the hunter', col);
    const cx = w / 2, cy = which === 'dip' ? h * 0.56 : h * 0.4;
    let P, L, sc, S;
    if (which === 'dip') {
      const raw = DIP.map(([n, ra, de]) => { const r = 90 - de, a = ra * 15 * Math.PI / 180; return [n, r * Math.cos(a), r * Math.sin(a)]; }).concat([['pole', 0, 0]]);
      const xs = raw.map((p) => p[1]), ys = raw.map((p) => p[2]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      sc = Math.min((w - 70) / (x1 - x0), (h - 120) / (y1 - y0)); const ax = (w - (x1 - x0) * sc) / 2 - x0 * sc, ay = 40 + (h - 80 - (y1 - y0) * sc) / 2 - y0 * sc;
      S = raw.slice(0, 7).map(([n, x, y]) => [n, ax + x * sc, ay + y * sc]); L = DIPL; const pole = [ax, ay];
      if (mode === 'point') line(ctx, [[S[1][1], S[1][2]], pole], col.warn, 1.5, [5, 4]);
      dot(ctx, pole[0], pole[1], 5, col.warn, col.ink); text(ctx, 'Pole star', pole[0] + 8, pole[1] + 12, { color: col.warn, size: 10.5, weight: 700 });
    } else {
      sc = Math.min(w, h) * 0.026; S = ORI.map(([n, ra, de]) => [n, cx - (ra - 5.6) * 15 * sc, cy - de * sc * 1.0]); L = ORIL;
      if (mode === 'point') { const a = S[6], b = S[4], dx = b[1] - a[1], dy = b[2] - a[2]; const sx0 = cx - (6.75 - 5.6) * 15 * sc, sy0 = cy + 16.7 * sc, k = Math.hypot(sx0 - a[1], sy0 - a[2]) / Math.hypot(dx, dy); line(ctx, [[a[1], a[2]], [a[1] + dx * k, a[2] + dy * k]], col.warn, 1.5, [5, 4]); const sx = cx - (6.75 - 5.6) * 15 * sc, sy = cy + 16.7 * sc; dot(ctx, sx, sy, 5, col.warn, col.ink); text(ctx, 'Sirius', sx + 8, sy, { color: col.warn, size: 10.5, weight: 700 }); }
    }
    if (mode !== 'stars') L.forEach(([a, b]) => line(ctx, [[S[a][1], S[a][2]], [S[b][1], S[b][2]]], col.s[2], 1.8));
    S.forEach(([n, x, y], i) => { dot(ctx, x, y, which === 'ori' && (i === 0 || i === 2) ? 6 : 4.4, which === 'ori' && i === 0 ? col.bad : which === 'ori' && i === 2 ? col.s[3] : col.ink); const left = which === 'ori' && (i === 5 || i === 4 || i === 3 || i === 0); text(ctx, n, left ? x - 7 : x + 7, y - 7, { color: col.muted, size: 9.5, align: left ? 'right' : 'left' }); });
  };
  say();
}
