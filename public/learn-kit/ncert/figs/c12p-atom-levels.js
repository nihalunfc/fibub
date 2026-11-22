// Class 12 Atoms: the energy-level diagram of hydrogen and its spectral series. Transitions that end on n_f = 1 make the Lyman series (ultraviolet),
// n_f = 2 Balmer (visible and near ultraviolet), n_f = 3 Paschen, n_f = 4 Brackett, n_f = 5 Pfund (infrared). Wavelengths from 1/lambda = R (1/n_f^2 - 1/n_i^2),
// R = 1.097e7 per metre. The series limit (n_i = infinity) is the shortest wavelength of each series. Choose a series and see every arrow and the lines.
import { canvas, text, title, row, choice, readout, line, dot, arrow } from '../../kit.js';
import { wl2rgb } from '../c12p-optlib.js';

const R = 1.097e7, NAMES = { 1: 'Lyman', 2: 'Balmer', 3: 'Paschen', 4: 'Brackett', 5: 'Pfund' };
export default function (host) {
  let nf = 2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Hydrogen energy levels with the transitions of one spectral series and the lines they make' });
  const ctl = row(host);
  choice(ctl, 'Series ends at n =', [1, 2, 3, 4, 5].map((k) => [k, `${k} ${NAMES[k]}`]), nf, (v) => { nf = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${NAMES[nf]} series: jumps down to n = ${nf}`, col) + 6, lx0 = 34, lx1 = w * 0.5, ly0 = top + 8, ly1 = h * 0.62;
    const Y = (n) => ly0 + (1 / n) * (ly1 - ly0), levels = [1, 2, 3, 4, 5, 6, 7];
    levels.forEach((n) => { line(ctx, [[lx0, Y(n)], [lx1, Y(n)]], n === nf ? col.s[1] : col.ink, n === nf ? 3 : 1.5); text(ctx, `n=${n}`, lx0 - 4, Y(n), { color: col.muted, size: 9.5, align: 'right' }); });
    line(ctx, [[lx0, ly0], [lx1, ly0]], col.muted, 1, [4, 3]); text(ctx, 'n = ∞, 0 eV', lx1 + 4, ly0, { color: col.muted, size: 9.5 });
    text(ctx, '−13.6 eV', lx1 + 4, Y(1), { color: col.muted, size: 9.5 }); text(ctx, 'heights drawn at 1/n (not to scale)', lx1 + 4, Y(1) + 14, { color: col.muted, size: 9 });
    const lam = (ni) => 1e9 / (R * (1 / (nf * nf) - 1 / (ni * ni))), ls = [];
    for (let ni = nf + 1; ni <= 7; ni++) { const l = lam(ni), x = lx0 + 12 + ((ni - nf - 1) * (lx1 - lx0 - 24)) / Math.max(1, 6 - nf); arrow(ctx, x, Y(ni), x, Y(nf) - 2, wl2rgb(l) === 'rgb(110,60,60)' || l < 380 ? col.s[4] : wl2rgb(l), 2, 7); ls.push(l); }
    const lmin = 1e9 / (R / (nf * nf)), lmax = lam(nf + 1), sx0 = 16, sx1 = w - 16, sy = h * 0.8, pad = (lmax - lmin) * 0.08 + 1, X = (l) => sx0 + ((l - (lmin - pad)) / (lmax - lmin + 2 * pad)) * (sx1 - sx0);
    ctx.fillStyle = '#000'; ctx.fillRect(sx0, sy, sx1 - sx0, 30);
    [...ls, lmin].forEach((l, i) => { const lim = i === ls.length; ctx.fillStyle = l >= 380 && l <= 750 ? wl2rgb(l) : l < 380 ? '#b48cff' : '#ff6b5a'; ctx.globalAlpha = lim ? 0.45 : 1; ctx.fillRect(X(l) - 1, sy, 2.2, 30); ctx.globalAlpha = 1; });
    text(ctx, 'spectrum of the series (wavelength increases →)', sx0, sy - 8, { color: col.muted, size: 10 });
    text(ctx, `${lmin.toFixed(0)} nm (limit)`, sx0, sy + 44, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, `${lmax.toFixed(0)} nm (first line)`, sx1, sy + 44, { color: col.ink, size: 10.5, weight: 700, align: 'right' });
    const region = nf === 1 ? 'all in the ultraviolet' : nf === 2 ? 'the first four lines are visible: red 656, blue-green 486, blue 434, violet 410 nm' : 'all in the infrared';
    out.innerHTML = `1/λ = R(1/${nf}² − 1/n²) with R = 1.097×10⁷ m⁻¹. Longest wavelength (n = ${nf + 1}): <b>${lmax.toFixed(1)} nm</b>; shortest (n = ∞): <b>${lmin.toFixed(1)} nm</b>; ${region}.`;
  };
  cv.redraw();
}
