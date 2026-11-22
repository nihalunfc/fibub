// s-block trends: choose group 1 or group 2 and a property; the bars show the trend down the group, with each element's
// flame colour underneath. Data (rounded): metallic radii, first ionisation enthalpies (NIST), hydration enthalpies of the
// gaseous ions, standard reduction potentials and melting points.
import { canvas, text, row, choice, readout, fmt } from '../../kit.js';

const G = {
  g1: { name: 'Group 1', els: ['Li', 'Na', 'K', 'Rb', 'Cs'], v: [[152, 186, 227, 248, 265], [520, 496, 419, 403, 376], [-519, -406, -322, -293, -264], [-3.04, -2.71, -2.93, -2.98, -3.03], [454, 371, 336, 312, 302]],
    flame: [['crimson red', '#c8102e'], ['golden yellow', '#e8a800'], ['lilac', '#a77bd1'], ['red-violet', '#b5157a'], ['blue', '#3a6fd8']] },
  g2: { name: 'Group 2', els: ['Be', 'Mg', 'Ca', 'Sr', 'Ba'], v: [[112, 160, 197, 215, 222], [899, 738, 590, 549, 503], [-2494, -1921, -1577, -1443, -1305], [-1.85, -2.37, -2.87, -2.89, -2.91], [1560, 923, 1115, 1050, 1000]],
    flame: [['none', null], ['none', null], ['brick red', '#c4423a'], ['crimson', '#d4143c'], ['apple green', '#7da600']] },
};
const PROPS = [['Metallic radius', 'pm'], ['Ionisation enthalpy', 'kJ/mol'], ['Hydration enthalpy of the ion', 'kJ/mol'], ['E° (reduction)', 'V'], ['Melting point', 'K']];
const NOTE = [
  'Radius grows down the group: one extra shell each step. Group 2 atoms are smaller than their group 1 neighbours (one more proton, same shell).',
  'Ionisation enthalpy falls down the group as the outer electron sits further out. Group 2 values are higher (smaller atoms), and their second IE is still manageable, so they form M²⁺.',
  'Hydration releases most energy for the smallest ion (Li⁺, Be²⁺). That is why lithium salts are often hydrated and why Li⁺ is the least mobile ion in water.',
  'All are strongly negative: strong reducing agents. Lithium has the most negative E° in group 1 despite its high IE, because its tiny ion releases so much hydration energy.',
  'Melting points fall down group 1: bigger atoms and only one electron each for metallic bonding. Group 2 metals have two electrons each, so they melt much higher (Mg is an exception to the smooth trend).',
];

export default function (host) {
  let g = 'g1', p = 3;
  const cv = canvas(host, { aspect: 0.6, max: 330, min: 250, label: 'Bar chart of a property down group 1 or group 2 with flame colours' });
  const ctl = row(host);
  choice(ctl, 'Group', [['g1', 'Group 1'], ['g2', 'Group 2']], g, (v) => { g = v; cv.redraw(); show(); });
  choice(ctl, 'Property', PROPS.map((x, i) => [i, x[0]]), p, (v) => { p = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `<b>${PROPS[p][0]}, ${G[g].name}.</b> ${NOTE[p]} Flame colours come from electrons excited by heat falling back and giving out visible light; Be and Mg hold their electrons too tightly for flame energy.`; };
  cv.draw = (ctx, w, h, col) => {
    const red = document.documentElement.classList?.contains?.('red-mode'); // night red light: no true colours
    const d = G[g], vals = d.v[p], hi = Math.max(0, ...vals), lo = Math.min(0, ...vals), span = hi - lo || 1;
    const L = 12, R = w - 12, T = 38, B = h - 70, Y = (v) => B - ((v - lo) / span) * (B - T), bw = (R - L) / 5;
    text(ctx, `${PROPS[p][0]} (${PROPS[p][1]})`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
    d.els.forEach((e, i) => {
      const v = vals[i], x = L + i * bw + bw * 0.15, wd = bw * 0.7, y0 = Y(0), y1 = Y(v);
      ctx.fillStyle = v < 0 ? col.s[1] : col.s[0];
      ctx.fillRect(x, Math.min(y0, y1), wd, Math.max(2, Math.abs(y1 - y0)));
      text(ctx, fmt(v, 3), x + wd / 2, v < 0 ? Math.min(y1 + 10, B + 8) : y1 - 9, { color: col.ink, size: 11, align: 'center', halo: col.panel });
      text(ctx, e, x + wd / 2, B + 22, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      const [fname, fc] = d.flame[i];
      ctx.fillStyle = (!red && fc) || col.soft; ctx.strokeStyle = col.line;
      ctx.beginPath(); ctx.roundRect(x, B + 32, wd, 14, 4); ctx.fill(); ctx.stroke();
      text(ctx, fname, x + wd / 2, B + 56, { color: col.muted, size: 10, align: 'center' });
    });
  };
  cv.redraw(); show();
}
