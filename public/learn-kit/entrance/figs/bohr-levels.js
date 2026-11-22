// Atomic structure: Bohr energy levels of hydrogen-like ions, E_n = −13.6 Z²/n² eV. Choose the lower level of a
// series and the ion; every line of that series is drawn and its wavelength listed (hc = 1240 eV nm).
import { canvas, text, line, arrow, row, choice, readout, fmt } from '../../kit.js';

const SERIES = { 1: 'Lyman (ultraviolet)', 2: 'Balmer (visible for H)', 3: 'Paschen (infrared)', 4: 'Brackett (infrared)' };
export default function (host) {
  let low = 2, Z = 1;
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 280, label: 'Energy levels of a hydrogen-like atom with the lines of one spectral series' });
  const ctl = row(host);
  choice(ctl, 'Series ends on', [[1, 'n = 1'], [2, 'n = 2'], [3, 'n = 3'], [4, 'n = 4']], low, (v) => { low = v; cv.redraw(); show(); });
  choice(ctl, 'Ion', [[1, 'H'], [2, 'He⁺'], [3, 'Li²⁺']], Z, (v) => { Z = v; cv.redraw(); show(); });
  const out = readout(host);
  const E = (n) => (-13.6 * Z * Z) / (n * n);
  const show = () => {
    const ls = [1, 2, 3, 4].map((k) => low + k).map((hi) => `${hi}→${low}: ${fmt(1240 / (E(hi) - E(low)), 4)} nm`);
    out.innerHTML = `<b>${SERIES[low]}</b> for ${['H', 'He⁺', 'Li²⁺'][Z - 1]}: ${ls.join(', ')}; series limit (∞→${low}) ${fmt(1240 / -E(low), 4)} nm. Ionisation energy from n = 1: ${fmt(13.6 * Z * Z, 3)} eV.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = 24, bot = h - 20, Emin = E(1);
    const Y = (e) => top + ((e - 0) / Emin) * (bot - top) * 0.98;
    for (let n = 1; n <= 7; n++) {
      const y = Y(E(n));
      line(ctx, [[60, y], [w - 70, y]], n === low ? col.ink : col.line, n === low ? 2 : 1);
      if (n <= 5 || n === 7) text(ctx, `n=${n}  ${fmt(E(n), 3)} eV`, w - 66, y, { color: col.muted, size: 10 });
    }
    line(ctx, [[60, Y(0)], [w - 70, Y(0)]], col.muted, 1, [4, 4]);
    text(ctx, 'n = ∞, 0 eV', w - 66, Y(0), { color: col.muted, size: 10 });
    [1, 2, 3, 4, 5].forEach((k, i) => { const x = 80 + i * ((w - 180) / 5); arrow(ctx, x, Y(E(low + k)), x, Y(E(low)) - 2, col.s[i % 8], 2, 7); });
    text(ctx, SERIES[low], 60, 12, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw(); show();
}
