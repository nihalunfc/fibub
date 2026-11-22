// 2.1 Looking far is looking back. A logarithmic road from the Moon to the most distant galaxies: pick a
// target and see how long its light has travelled, and what was happening on Earth when that light set off.
// Light-travel times are rounded; for the farthest galaxies they are lookback times in the standard model.
import { canvas, text, line, dot, row, choice, readout, loop, fmt, title } from '../../kit.js';

const T = [ // [light-travel time in years, name, what was happening on Earth]
  [1.28 / 31557600, 'Moon', 'you blinked'],
  [8.3 * 60 / 31557600, 'Sun', 'you read a few paragraphs'],
  [4.24, 'Proxima Centauri', 'a child now in school was born'],
  [640, 'Betelgeuse', 'the Mughal and Ming empires were at their height'],
  [26000, 'Milky Way centre', 'the last Ice Age was at its coldest'],
  [2.5e6, 'Andromeda galaxy', 'our early human ancestors were making the first stone tools'],
  [5.4e7, 'Virgo cluster', 'the dinosaurs had just died out'],
  [1.2e9, 'A quasar (z ≈ 0.1)', 'life on Earth was single cells'],
  [1.3e10, 'JWST\'s farthest galaxies', 'there was no Earth: the Sun would not form for another 8 billion years'],
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.4, max: 260, min: 200, label: 'Light travelling to us from objects at different distances' });
  let pick = 5, ph = 0;
  const ctl = row(host);
  choice(ctl, 'Look at', T.map((x, i) => [i, x[1]]), pick, (v) => { pick = v; ph = 0; show(); cv.redraw(); });
  const out = readout(host);
  loop(host, (dt) => { ph = (ph + dt * 0.35) % 1; cv.redraw(); });
  const age = (y) => y < 1 / 365 ? `${fmt(y * 31557600)} seconds` : y < 1 ? `${fmt(y * 525960)} minutes` : y < 1e6 ? `${fmt(y)} years` : y < 1e9 ? `${fmt(y / 1e6)} million years` : `${fmt(y / 1e9)} billion years`;
  const show = () => { const [y, name, what] = T[pick]; out.innerHTML = `The light from <b>${name}</b> left it <b>${age(y)}</b> ago. When it set off, ${what}. You see ${name} as it was then, not as it is now.`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 24, R = w - 24, y0 = h * 0.55, lo = -8, hi = 10.3;
    const X = (yrs) => L + ((Math.log10(yrs) - lo) / (hi - lo)) * (R - L);
    line(ctx, [[L, y0], [R, y0]], col.line, 2);
    T.forEach(([yrs, name], i) => {
      const x = X(yrs), on = i === pick;
      dot(ctx, x, y0, on ? 6 : 4, on ? col.s[1] : col.muted);
      if (on || w > 640) text(ctx, name, x, y0 + (i % 2 ? 20 : -18), { color: on ? col.ink : col.muted, size: on ? 12 : 10.5, weight: on ? 700 : 400, align: 'center', halo: col.panel });
    });
    dot(ctx, L - 10, y0, 6, col.s[0]);
    text(ctx, 'You', L - 10, y0 + 20, { color: col.ink, size: 11, weight: 600, align: 'center' });
    // a pulse of light running from the target to you
    const xs = X(T[pick][0]), xp = xs + (L - 10 - xs) * ph;
    for (let k = 0; k < 5; k++) dot(ctx, xp + k * 5, y0, 3 - k * 0.5, col.s[3]);
    for (const p of [-6, -3, 0, 3, 6, 9]) { const x = L + ((p - lo) / (hi - lo)) * (R - L); text(ctx, p === 0 ? '1 yr' : p < 0 ? `10${'⁻'}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[-p]} yr` : `10${'⁰¹²³⁴⁵⁶⁷⁸⁹'[p]} yr`, x, h - 12, { color: col.muted, size: 10, align: 'center' }); }
    title(ctx, 'How long the light has been travelling (each step = 1,000× longer)', col);
  };
  cv.redraw(); show();
}
