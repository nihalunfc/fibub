// 3.3 E = mc². Slide a mass and see the energy it holds, on a scale of everyday and cosmic energies (each
// gridline is 10× more). Reference energies are rounded: a lightning bolt ~1 GJ, one home's electricity for a
// year ~10,000 kWh = 3.6 × 10¹⁰ J, the 1945 Hiroshima bomb ~6 × 10¹³ J, all human energy use in a year ~6 × 10²⁰ J,
// the Sun's output each second ~3.8 × 10²⁶ J.
import { canvas, text, title, line, dot, row, slider, readout, fmt } from '../../kit.js';

const C2 = 299792458 ** 2;
const REFS = [[1e9, 'lightning bolt'], [3.6e10, 'a home\'s electricity, 1 year'], [6.3e13, 'Hiroshima bomb'], [6e20, 'all humanity, 1 year'], [3.8e26, 'the Sun, 1 second']];
const massText = (m) => (m < 1e-3 ? `${fmt(m * 1e6)} mg` : m < 1 ? `${fmt(m * 1e3)} g` : m < 1000 ? `${fmt(m)} kg` : `${fmt(m / 1000)} tonnes`);
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 230, label: 'The energy in a mass compared with lightning, homes, bombs, humanity and the Sun' });
  let m = 1e-3;
  const ctl = row(host);
  slider(ctl, { label: 'Mass turned into energy', min: 1e-6, max: 5e9, value: m, log: true, fmt: massText, oninput: (v) => { m = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const E = m * C2;
    out.innerHTML = `${massText(m)} × c² = <b>${fmt(E)} J</b>. That is about ${fmt(E / 3.6e10)} homes' electricity for a year. In practice only a tiny part of a mass is ever released: fusion in the Sun turns about 0.7% of its hydrogen's mass into energy.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = 16, R = w - 16, lo = 3, hi = 28, X = (e) => L + (Math.log10(e) - lo) / (hi - lo) * (R - L), y = h * 0.6;
    line(ctx, [[L, y], [R, y]], col.muted, 1.5);
    for (let p = lo; p <= hi; p++) line(ctx, [[X(10 ** p), y - (p % 5 ? 3 : 6)], [X(10 ** p), y + (p % 5 ? 3 : 6)]], col.muted, 1);
    for (let p = 5; p <= hi; p += 5) text(ctx, `10${String(p).replace(/./g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])} J`, X(10 ** p), y + 18, { color: col.muted, size: 10.5, align: 'center' });
    REFS.forEach(([e, s], i) => {
      const x = X(e), up = i % 2 === 0, off = up ? (i === 2 ? 52 : 28) : 36;
      line(ctx, [[x, y], [x, up ? y - off + 8 : y + off - 8]], col.line, 1);
      dot(ctx, x, y, 4, col.s[i + 1]);
      text(ctx, s, x, up ? y - off : y + off, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    });
    const E = m * C2, x = X(Math.min(10 ** hi, Math.max(10 ** lo, E)));
    dot(ctx, x, y, 8, col.s[0], col.panel);
    text(ctx, `${massText(m)} → ${fmt(E)} J`, x, y - 76, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    title(ctx, 'E = mc²: a little mass is a lot of energy', col);
  };
  cv.redraw(); show();
}
