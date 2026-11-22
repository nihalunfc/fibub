// Titration curves: 25 mL of 0.1 M acid titrated with 0.1 M NaOH. The pH is found exactly from the charge balance
// [H⁺] + [Na⁺] = [OH⁻] + [A⁻] at every point. Choose a strong or weak acid and its pKa; the bands show where the two
// common indicators change colour.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, dot } from '../../kit.js';

const V0 = 25, C0 = 0.1, Cb = 0.1, Kw = 1e-14;
function pH(V, strong, Ka) {
  const Ca = (C0 * V0) / (V0 + V), Na = (Cb * V) / (V0 + V);
  const f = (h) => h + Na - Kw / h - (strong ? Ca : (Ca * Ka) / (Ka + h));
  let lo = -14.5, hi = 0.5;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; f(10 ** m) > 0 ? (hi = m) : (lo = m); }
  return -(lo + hi) / 2;
}

export default function (host) {
  let strong = false, pKa = 4.74;
  const cv = canvas(host, { aspect: 0.62, max: 350, min: 250, label: 'pH against volume of sodium hydroxide added during an acid-base titration' });
  const ctl = row(host);
  choice(ctl, 'Acid', [[false, 'Weak acid'], [true, 'Strong acid (HCl)']], strong, (v) => { strong = v; cv.redraw(); show(); });
  slider(ctl, { label: 'pKa of the weak acid', min: 2, max: 10, step: 0.1, value: pKa, fmt: (v) => v.toFixed(1), oninput: (v) => { pKa = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const Ka = 10 ** -pKa, s = pH(0, strong, Ka), half = pH(12.5, strong, Ka), eq = pH(25, strong, Ka);
    const ind = eq > 7.5 ? 'phenolphthalein (8.3 to 10)' : eq < 6.5 ? 'methyl orange (3.1 to 4.4)' : 'either indicator';
    out.innerHTML = strong
      ? `Strong acid: start pH ${fmt(s, 3)}, equivalence pH <b>7.00</b> with a very steep jump (about pH 4 to 10), so <b>either indicator</b> works.`
      : `Weak acid (pK<sub>a</sub> ${pKa.toFixed(1)}): start pH ${fmt(s, 3)}; at half-neutralisation pH = ${fmt(half, 3)} ≈ pK<sub>a</sub> (best buffer); equivalence pH <b>${fmt(eq, 3)}</b> (the salt hydrolyses), so use ${ind}.${pKa > 8 ? ' The jump is now too small for a sharp end point.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const Ka = 10 ** -pKa;
    const A = axes(ctx, w, h, col, { x: [0, 50], y: [0, 14], xlabel: 'NaOH added (mL)', ylabel: 'pH', l: 40, t: 22, yt: [0, 2, 4, 6, 8, 10, 12, 14] });
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = col.s[3]; ctx.fillRect(A.L, A.Y(4.4), A.R - A.L, A.Y(3.1) - A.Y(4.4));
    ctx.fillStyle = col.s[4]; ctx.fillRect(A.L, A.Y(10), A.R - A.L, A.Y(8.3) - A.Y(10));
    ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 250; i++) { const V = (50 * i) / 250; pts.push([A.X(V), A.Y(pH(V, strong, Ka))]); }
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[A.X(25), A.T], [A.X(25), A.B]], col.muted, 1, [4, 4]);
    dot(ctx, A.X(25), A.Y(pH(25, strong, Ka)), 5, col.s[2], col.panel);
    if (!strong) dot(ctx, A.X(12.5), A.Y(pH(12.5, strong, Ka)), 5, col.s[1], col.panel);
    ctx.restore();
    text(ctx, 'methyl orange', A.R - 4, A.Y(3.75), { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    text(ctx, 'phenolphthalein', A.R - 4, A.Y(9.15), { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    text(ctx, 'equivalence', A.X(25) + 5, A.B - 10, { color: col.muted, size: 10.5, halo: col.panel });
  };
  cv.redraw(); show();
}
