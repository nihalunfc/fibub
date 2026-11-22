// 3.7 How big is a black hole? The event horizon radius is r = 2GM/c², about 2.95 km for each Sun of mass.
// Slide the mass from a star-sized black hole up to the giants in galaxy centres and compare the horizon with
// a city, the Earth, the Sun and planetary orbits (log scale: each gridline is 10× bigger).
import { canvas, text, title, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

const KM_PER_SUN = 2.953;
const REFS = [[20, 'a big city'], [6371, 'Earth'], [696000, 'the Sun'], [1.5e8, 'Earth\'s orbit'], [4.5e9, 'Neptune\'s orbit']];
const NAMED = [[1, 'Sun squeezed'], [10, 'stellar black hole'], [62, 'LIGO 2015 merger'], [4.3e6, 'Sagittarius A*'], [6.5e9, 'M87*']];
export default function (host) {
  const cv = canvas(host, { aspect: 0.52, max: 330, min: 240, label: 'The size of a black hole\'s event horizon compared with a city, the Earth, the Sun and planet orbits' });
  let m = 4.3e6;
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Mass (in Suns)', min: 1, max: 1e10, value: m, log: true, fmt: (v) => fmt(v), oninput: (v) => { m = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const r = m * KM_PER_SUN, near = NAMED.find(([nm]) => Math.abs(Math.log10(nm / m)) < 0.15);
    out.innerHTML = `${fmt(m)} Suns → horizon radius <b>${fmt(r)} km</b>${near ? ` (${near[1]})` : ''}. Double the mass, double the size. The average density inside the horizon falls as the mass grows: for the biggest ones it is less than water.`;
  };
  choice(row(host), 'Try', NAMED.map(([nm, s]) => [nm, s]), m, (nm) => { m = nm; sl.set(nm); cv.redraw(); show(); });
  cv.draw = (ctx, w, h, col) => {
    const L = 16, R = w - 16, lo = 0, hi = 11, X = (km) => L + (Math.log10(km) - lo) / (hi - lo) * (R - L), y = h * 0.62;
    line(ctx, [[L, y], [R, y]], col.muted, 1.5);
    for (let p = lo; p <= hi; p++) line(ctx, [[X(10 ** p), y - 4], [X(10 ** p), y + 4]], col.muted, 1);
    [[1, '1 km'], [1e3, '1,000 km'], [1e6, '1 million km'], [1e9, '1 billion km']].forEach(([v, s]) => text(ctx, s, X(v), y + 18, { color: col.muted, size: 10.5, align: 'center' }));
    REFS.forEach(([km, s], i) => {
      const x = X(km), up = i % 2 === 0;
      line(ctx, [[x, y], [x, up ? y - 26 : y + 30]], col.line, 1);
      dot(ctx, x, y, 3.5, col.s[i + 1]);
      text(ctx, s, x, up ? y - 34 : y + 40, { color: col.ink, size: 10.5, align: 'center', halo: col.panel });
    });
    const r = m * KM_PER_SUN, x = X(r);
    dot(ctx, x, y, 7, col.ink, col.s[3]);
    text(ctx, `horizon: ${fmt(r)} km`, x, y - 62, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    title(ctx, 'Horizon radius: about 2.95 km per Sun of mass', col);
  };
  cv.redraw(); show();
}
