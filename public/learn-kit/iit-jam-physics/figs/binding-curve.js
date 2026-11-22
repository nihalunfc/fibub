// 6.5 Binding energy per nucleon against mass number. The smooth curve is the liquid-drop (semi-empirical) formula
// along the valley of stability; the dots are measured values for a few nuclides. "Terms" view: start from the
// volume term and subtract the surface, Coulomb and asymmetry terms per nucleon to see what shapes the curve.
import { canvas, axes, line, dot, text, row, slider, choice, readout, arrow, fmt } from '../../kit.js';

const av = 15.8, as = 18.3, ac = 0.714, aa = 23.2;
const Z0 = (A) => A / (2 + (ac / (2 * aa)) * A ** (2 / 3)); // most stable Z (continuous)
function terms(A) {
  const Z = Z0(A), c = Math.cbrt(A);
  return { Z, vol: av, surf: (as * c * c) / A, coul: (ac * Z * (Z - 1)) / (c * A), asym: (aa * (A - 2 * Z) ** 2) / (A * A) };
}
const bpa = (A) => { const t = terms(A); return t.vol - t.surf - t.coul - t.asym; };
// measured B/A in MeV (AME 2020, rounded)
const DATA = [['²H', 2, 1.112], ['⁴He', 4, 7.074], ['⁶Li', 6, 5.332], ['¹²C', 12, 7.680], ['¹⁶O', 16, 7.976], ['⁵⁶Fe', 56, 8.790],
  ['⁶²Ni', 62, 8.795], ['⁹⁰Zr', 90, 8.710], ['¹²⁰Sn', 120, 8.505], ['²⁰⁸Pb', 208, 7.868], ['²³⁸U', 238, 7.570]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Binding energy per nucleon against mass number' });
  let A = 56, view = 'curve';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const t = terms(A);
    out.innerHTML = `A = ${A}, most stable Z ≈ ${fmt(t.Z, 3)}. Liquid-drop B/A = <b>${fmt(bpa(A), 3)} MeV</b> = volume ${fmt(t.vol, 3)} − surface ${fmt(t.surf, 3)} − Coulomb ${fmt(t.coul, 3)} − asymmetry ${fmt(t.asym, 2)} (per nucleon). ` +
      (A < 56 ? 'Joining light nuclei (fusion) moves up the curve and releases energy.' : A > 62 ? 'Splitting heavy nuclei (fission) moves up the curve and releases energy.' : 'Near the top: neither fusion nor fission releases energy here.');
  };
  choice(ctl, 'Show', [['curve', 'Curve'], ['terms', 'Terms']], view, (v) => { view = v; cv.redraw(); });
  slider(ctl, { label: 'Mass number A', min: 4, max: 250, step: 1, value: A, fmt: (v) => String(v), oninput: (v) => { A = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const As = Array.from({ length: 247 }, (_, i) => i + 4);
    if (view === 'curve') {
      const ax = axes(ctx, w, h, col, { x: [0, 250], y: [0, 10], t: 28, xlabel: 'mass number A', ylabel: 'B/A (MeV)' });
      ctx.save(); ax.clip();
      line(ctx, As.filter((a) => a >= 8).map((a) => [ax.X(a), ax.Y(bpa(a))]), col.s[0], 2.5);
      ctx.restore();
      for (const [s, a, b] of DATA) { dot(ctx, ax.X(a), ax.Y(b), 4, col.s[1]); text(ctx, s, ax.X(a) + 5, ax.Y(b) + (a < 10 ? -8 : 10), { color: col.ink, size: 10 }); }
      arrow(ctx, ax.X(10), ax.Y(3.2), ax.X(48), ax.Y(3.2), col.s[2], 2);
      text(ctx, 'fusion', ax.X(14), ax.Y(3.2) - 10, { color: col.s[2], size: 11, weight: 600 });
      arrow(ctx, ax.X(235), ax.Y(5.4), ax.X(130), ax.Y(5.4), col.s[3], 2);
      text(ctx, 'fission', ax.X(200), ax.Y(5.4) - 10, { color: col.s[3], size: 11, weight: 600 });
      line(ctx, [[ax.X(A), ax.T], [ax.X(A), ax.B]], col.muted, 1, [3, 4]);
      dot(ctx, ax.X(A), ax.Y(bpa(A)), 6, col.s[0], col.panel);
      text(ctx, 'dots: measured · line: liquid-drop formula', ax.L + 8, ax.B - 10, { color: col.muted, size: 10 });
    } else {
      const ax = axes(ctx, w, h, col, { x: [0, 250], y: [0, 16], t: 28, xlabel: 'mass number A', ylabel: 'MeV per nucleon' });
      const f1 = (a) => av, f2 = (a) => av - terms(a).surf, f3 = (a) => f2(a) - terms(a).coul, f4 = (a) => bpa(a);
      ctx.save(); ax.clip();
      [[f1, col.s[4]], [f2, col.s[5]], [f3, col.s[6]], [f4, col.s[0]]].forEach(([f, c], i) => line(ctx, As.map((a) => [ax.X(a), ax.Y(f(a))]), c, i === 3 ? 2.5 : 1.8, i === 3 ? null : [6, 4]));
      ctx.restore();
      text(ctx, 'volume term only', ax.X(120), ax.Y(av) - 9, { color: col.s[4], size: 11 });
      text(ctx, '− surface', ax.X(200), ax.Y(f2(200)) - 9, { color: col.s[5], size: 11 });
      text(ctx, '− Coulomb', ax.X(200), ax.Y(f3(200)) - 9, { color: col.s[6], size: 11 });
      text(ctx, '− asymmetry = B/A', ax.X(150), ax.Y(f4(150)) + 12, { color: col.s[0], size: 11, weight: 600 });
      line(ctx, [[ax.X(A), ax.T], [ax.X(A), ax.B]], col.muted, 1, [3, 4]);
      dot(ctx, ax.X(A), ax.Y(bpa(A)), 6, col.s[0], col.panel);
      text(ctx, 'Surface loss matters most for small A, Coulomb loss for large A.', ax.L + 8, ax.B - 10, { color: col.muted, size: 10 });
    }
  };
  cv.redraw(); show();
}
