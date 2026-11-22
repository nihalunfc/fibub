// Atoms: energy levels of hydrogen-like atoms (Eₙ = −13.6 Z²/n² eV) and the spectral series. Pick the atom and the
// series; every jump down to the series' lower level is drawn, and the slider picks one jump to show its photon.
import { canvas, row, choice, slider, readout, line, arrow, text, fmt } from '../../kit.js';

const SERIES = { 1: 'Lyman (to n = 1)', 2: 'Balmer (to n = 2)', 3: 'Paschen (to n = 3)', 4: 'Brackett (to n = 4)' };
const region = (nm) => (nm < 10 ? 'X-ray' : nm < 400 ? 'ultraviolet' : nm <= 700 ? 'visible' : 'infrared');
export default function (host) {
  let Z = 1, low = 2, up = 3;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Energy levels and spectral lines of a hydrogen-like atom' });
  const ctl = row(host);
  choice(ctl, 'Atom', [[1, 'H'], [2, 'He⁺'], [3, 'Li²⁺']], Z, (v) => { Z = v; upd(); });
  choice(ctl, 'Series', Object.entries(SERIES).map(([k, v]) => [+k, v]), low, (v) => { low = v; if (up <= low) up = low + 1; sl.set(up); upd(); });
  const sl = slider(ctl, { label: 'From level n', min: 2, max: 7, step: 1, value: up, fmt: (v) => String(v), oninput: (v) => { up = Math.max(v, low + 1); upd(); } });
  const out = readout(host);
  const E = (n) => (-13.6 * Z * Z) / (n * n);
  const upd = () => {
    cv.redraw();
    const dE = E(up) - E(low), nm = 1240 / dE, lim = 1240 / (-E(low));
    out.innerHTML = `n = ${up} → ${low}: photon energy ${fmt(dE, 4)} eV, <b>λ = ${fmt(nm, 4)} nm</b> (${region(nm)}). Series limit (n = ∞ → ${low}): ${fmt(lim, 4)} nm. Ionisation energy from the ground state: ${fmt(13.6 * Z * Z, 4)} eV.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = 30, bot = h - 20, Emin = E(1), Y = (e) => top + ((e - 0) / Emin) * (bot - top) * 0.92;
    const xL = 70, xR = w - 20;
    for (let n = 1; n <= 7; n++) {
      const y = Y(E(n));
      line(ctx, [[xL, y], [xR, y]], n === low ? col.ink : col.line, n === low ? 2 : 1.2);
      if (n <= 4 || n === 7) text(ctx, `n = ${n}`, xL - 6, y, { color: col.muted, size: 11, align: 'right' });
      if (n <= 3) text(ctx, `${fmt(E(n), 3)} eV`, xR, y - 8, { color: col.muted, size: 10, align: 'right' });
    }
    line(ctx, [[xL, Y(0)], [xR, Y(0)]], col.muted, 1, [4, 4]); text(ctx, 'n = ∞ (0 eV)', xL - 6, Y(0), { color: col.muted, size: 10, align: 'right' });
    let k = 0;
    for (let n = low + 1; n <= 7; n++, k++) {
      const x = xL + 24 + k * Math.min(46, (xR - xL - 60) / 6), sel = n === up;
      arrow(ctx, x, Y(E(n)), x, Y(E(low)), sel ? col.s[3] : col.s[0], sel ? 3 : 1.5, 7);
    }
    text(ctx, SERIES[low], xL + 4, 16, { color: col.ink, size: 12, weight: 600 });
  };
  upd();
}
