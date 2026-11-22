// Class 12 Atoms (step player): a worked example of one hydrogen line. The electron jumps from n = 4 to n = 2. Energies E_n = -13.6/n^2 eV give
// E_4 = -0.85 eV and E_2 = -3.40 eV, so the photon has E = 2.55 eV and wavelength lambda = 1240 / 2.55 = 486 nm (blue-green), a Balmer line (n_f = 2): H-beta.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { wl2rgb, wavy } from '../c12p-optlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The jump from n = 4 to n = 2 in hydrogen and the photon it emits' });
  const TITLES = ['Levels of hydrogen: E = −13.6/n² eV', 'The electron starts in the level n = 4', 'It jumps down to n = 2', 'The photon takes the energy difference', 'Wavelength from E = hc/λ', 'Name the series: it ends at n = 2, so Balmer'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 10, x0 = 56, x1 = w * 0.4, base = h - 22, P = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 0: 5.2 }, Y = (e) => base - (P[Math.round(Math.sqrt(13.6 / Math.abs(e || 1e-9)))] ?? 5.2) * ((base - top - 14) / 5.2);
    for (const k of [1, 2, 3, 4, 5]) { const e = -13.6 / (k * k); line(ctx, [[x0, Y(e)], [x1, Y(e)]], col.ink, 2); text(ctx, `n = ${k}`, x0 - 6, Y(e) + (k >= 4 ? (k - 4) * -2 : 0), { color: col.muted, size: 10.5, align: 'right' }); text(ctx, `${e.toFixed(2)} eV`, x1 + 6, Y(e) + (k === 5 ? -6 : 0), { color: col.muted, size: 10.5 }); }
    line(ctx, [[x0, Y(0)], [x1, Y(0)]], col.line, 1, [4, 3]); text(ctx, '0 (free)', x1 + 6, Y(0),  { color: col.muted, size: 10.5 });
    text(ctx, 'level heights not to scale', 10, h - 6, { color: col.muted, size: 10 });
    const xe = (x0 + x1) / 2;
    if (step >= 1) dot(ctx, xe, step >= 2 ? Y(-13.6 / 4) : Y(-13.6 / 16), 6, col.s[0], col.ink);
    if (step === 1) dot(ctx, xe, Y(-13.6 / 16) - 0.01, 6, col.s[0], col.ink);
    if (step >= 2) arrow(ctx, xe + 14, Y(-13.6 / 16), xe + 14, Y(-13.6 / 4) - 4, col.s[3], 3, 9);
    if (step >= 3) { text(ctx, 'E = E₄ − E₂', w - 8, top + 20, { color: col.ink, size: 12, weight: 700, align: 'right' }); text(ctx, '= −0.85 − (−3.40)', w - 8, top + 38, { color: col.ink, size: 12, align: 'right' }); text(ctx, '= 2.55 eV', w - 8, top + 56, { color: col.s[7], size: 13, weight: 700, align: 'right' }); }
    if (step >= 3) wavy(ctx, xe + 22, xe + 56, Y(-13.6 / 16) + 14, 6, 12, 0, step >= 4 ? wl2rgb(486) : col.muted, 3);
    if (step >= 4) { text(ctx, 'λ = hc/E = 1240/2.55', w - 8, top + 92, { color: col.ink, size: 12, weight: 700, align: 'right' }); text(ctx, '= 486 nm', w - 8, top + 110, { color: col.s[7], size: 13, weight: 700, align: 'right' }); text(ctx, 'blue-green light', w - 8, top + 128, { color: col.muted, size: 11, align: 'right' }); }
    if (step >= 5) { text(ctx, 'Balmer series (n_f = 2)', w - 8, top + 164, { color: col.s[7], size: 12.5, weight: 700, align: 'right' }); text(ctx, 'this is the line H-β', w - 8, top + 182, { color: col.s[7], size: 12, align: 'right' }); }
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
