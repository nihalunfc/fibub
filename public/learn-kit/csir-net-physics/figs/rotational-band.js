// 10.3 Rotor or vibrator? Level schemes built from the same first 2⁺ energy. Left: a K = 0 rotational band,
// E = (ħ²/2𝓘) I(I+1), with the E2 gamma rays I → I − 2 whose energies rise in equal steps. Middle (optional): an odd-A
// band on a chosen K, with every spin I = K, K+1, ... Right: a harmonic quadrupole vibrator, with phonon multiplets
// 0⁺; 2⁺; (0, 2, 4)⁺; (0, 2, 3, 4, 6)⁺ at 0, ħω, 2ħω, 3ħω. The ratio E(4⁺)/E(2⁺) is 10/3 for the rotor and 2 for the vibrator.
import { canvas, row, slider, choice, readout, line, text, arrow, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 520, min: 360, label: 'Rotational band and vibrational multiplets with the same first 2+ energy' });
  let E2 = 90, Imax = 10, K = 0;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'First 2⁺ energy (keV)', min: 20, max: 600, step: 5, value: E2, fmt: (v) => fmt(v, 3), oninput: (v) => { E2 = v; re(); } });
  slider(ctl, { label: 'Highest rotor spin', min: 4, max: 14, step: 2, value: Imax, fmt: (v) => String(v), oninput: (v) => { Imax = v; re(); } });
  choice(ctl, 'Middle column', [[0, 'None'], [1.5, 'K = 3/2 band'], [3.5, 'K = 7/2 band']], K, (v) => { K = v; re(); });
  const show = () => {
    const A = E2 / 6;
    out.innerHTML = `ħ²/2𝓘 = ${fmt(A, 3)} keV (𝓘/ħ² = ${fmt(1000 / (2 * A), 3)} MeV⁻¹). Rotor: E(4⁺) = ${fmt(20 * A, 4)} keV, gamma rays step up by 8ħ²/2𝓘 = ${fmt(8 * A, 3)} keV. Vibrator: E(4⁺) = ${fmt(2 * E2, 4)} keV. R₄/₂ = 3.33 against 2.00.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const A = E2 / 6, Emax = Math.max(A * Imax * (Imax + 1), 3 * E2) * 1.05, top = 34, bot = H - 22;
    const Y = (e) => bot - (e / Emax) * (bot - top);
    const cols = K ? [0.06, 0.38, 0.70] : [0.08, 0, 0.58], wcol = W * (K ? 0.26 : 0.34);
    text(ctx, 'Rotor (K = 0)', W * cols[0] + wcol / 2, 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    for (let I = 0; I <= Imax; I += 2) {
      const e = A * I * (I + 1), y = Y(e), x0 = W * cols[0];
      line(ctx, [[x0, y], [x0 + wcol, y]], col.s[0], 2);
      text(ctx, `${I}⁺`, x0 - 2, y, { color: col.s[0], size: 11, align: 'right' });
      text(ctx, `${fmt(e, 4)}`, x0 + wcol + 3, y, { color: col.muted, size: 10 });
      if (I >= 2) { const xa = x0 + wcol * (0.25 + 0.5 * ((I / 2) % 2)), yb = Y(A * (I - 2) * (I - 1)); arrow(ctx, xa, y + 1, xa, yb - 1, col.s[2], 1.4, 6); if (y < yb - 14) text(ctx, fmt(A * (4 * I - 2), 3), xa + 4, (y + yb) / 2, { color: col.s[2], size: 9.5, halo: col.panel }); }
    }
    if (K) {
      const x0 = W * cols[1];
      text(ctx, `Odd-A band, K = ${K * 2}/2`, x0 + wcol / 2, 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      for (let I = K; I <= K + 7; I++) {
        const e = A * (I * (I + 1) - K * (K + 1)); if (e > Emax) break;
        const y = Y(e); line(ctx, [[x0, y], [x0 + wcol, y]], col.s[1], 2);
        text(ctx, `${I * 2}/2`, x0 - 2, y, { color: col.s[1], size: 10.5, align: 'right' });
      }
    }
    const xv = W * cols[2], wv = wcol;
    text(ctx, 'Vibrator', xv + wv / 2, 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const mult = [[0, ['0⁺']], [1, ['2⁺']], [2, ['0⁺', '2⁺', '4⁺']], [3, ['0⁺', '2⁺', '3⁺', '4⁺', '6⁺']]];
    for (const [nph, js] of mult) {
      const y = Y(nph * E2); if (nph * E2 > Emax) continue;
      js.forEach((j, i) => { const seg = wv / js.length; line(ctx, [[xv + i * seg + 2, y], [xv + (i + 1) * seg - 2, y]], col.s[3], 2); text(ctx, j, xv + (i + 0.5) * seg, y - 8, { color: col.s[3], size: 10, align: 'center' }); });
      text(ctx, `${nph}ħω`, xv + wv + 3, y, { color: col.muted, size: 10 });
    }
  };
  re();
}
