// 6.4 Energy levels and spectral series of hydrogen (and hydrogen-like ions). Levels E_n = -13.6 Z^2/n^2 eV drawn
// to scale, with arrows for every line of the chosen series (Lyman, Balmer, Paschen, Brackett) from the levels up
// to the chosen top level. Visible lines are drawn in their own colour; the readout lists the wavelengths.
import { canvas, axes, line, arrow, text, row, slider, choice, readout, fmt } from '../../kit.js';

const RY = 13.6057, HC = 1239.84;
const SERIES = [[1, 'Lyman'], [2, 'Balmer'], [3, 'Paschen'], [4, 'Brackett']];

/** A rough sRGB colour for a visible wavelength in nm (null outside 380-750 nm). */
function visColour(l) {
  if (l < 380 || l > 750) return null;
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
  return `rgb(${Math.round(255 * r)},${Math.round(255 * g)},${Math.round(255 * b)})`;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 470, min: 330, label: 'Hydrogen energy levels with the transitions of one spectral series' });
  let nf = 2, top = 6, Z = 1;
  const ctl = row(host);
  const out = readout(host);
  const lam = (ni) => HC / (RY * Z * Z * (1 / (nf * nf) - 1 / (ni * ni)));
  const show = () => {
    const name = SERIES.find((s) => s[0] === nf)[1];
    const ls = []; for (let ni = nf + 1; ni <= top; ni++) ls.push(`${ni}→${nf}: <b>${fmt(lam(ni), 4)} nm</b>${visColour(lam(ni)) ? ' (visible)' : ''}`);
    out.innerHTML = `${name} series${Z > 1 ? ` of the Z = ${Z} ion` : ''} (lines ending on n = ${nf}): ${ls.join('; ') || 'raise the top level'}. Series limit (n = ∞ → ${nf}): ${fmt(HC / (RY * Z * Z / (nf * nf)), 4)} nm.`;
  };
  choice(ctl, 'Series', SERIES.map(([n, s]) => [n, s]), nf, (v) => { nf = v; if (top <= nf) top = nf + 1; cv.redraw(); show(); });
  slider(ctl, { label: 'Top level', min: 2, max: 8, step: 1, value: top, fmt: (v) => String(v), oninput: (v) => { top = Math.max(Math.round(v), nf + 1); cv.redraw(); show(); } });
  choice(ctl, 'Atom', [[1, 'H'], [2, 'He⁺'], [3, 'Li²⁺']], Z, (v) => { Z = v; cv.redraw(); show(); });

  cv.draw = (ctx, w, h, col) => {
    const E0 = RY * Z * Z;
    const a = axes(ctx, w, h, col, { x: [0, 1], y: [-E0 * 1.04, E0 * 0.06], xt: [], ylabel: 'energy (eV)', grid: false, l: 58, t: 24 });
    for (let n = 1; n <= 8; n++) {
      const y = a.Y(-E0 / (n * n));
      line(ctx, [[a.L + 6, y], [a.R - 60, y]], n === nf ? col.ink : col.muted, n === nf ? 2 : 1);
      if (n <= 5 || n === 8) text(ctx, `n = ${n}${n === 8 ? ' …' : ''}  ${fmt(-E0 / (n * n), 3)} eV`, a.R - 56, y, { color: col.muted, size: 10 });
    }
    line(ctx, [[a.L + 6, a.Y(0)], [a.R - 60, a.Y(0)]], col.muted, 1, [4, 4]);
    text(ctx, 'n = ∞  0 eV', a.R - 56, a.Y(0), { color: col.muted, size: 10 });
    const span = a.R - 70 - (a.L + 20);
    for (let ni = nf + 1; ni <= top; ni++) {
      const x = a.L + 20 + (span * (ni - nf - 1)) / Math.max(1, 8 - nf - 1);
      const c = visColour(lam(ni)) || col.s[0];
      arrow(ctx, x, a.Y(-E0 / (ni * ni)), x, a.Y(-E0 / (nf * nf)) - 2, c, 2.2);
    }
  };
  cv.redraw(); show();
}
