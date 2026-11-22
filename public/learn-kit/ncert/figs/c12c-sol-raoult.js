// Class 12 Chemistry, Solutions: Raoult's law for two volatile liquids A and B. Ideal: partial pressure p_A = x_A p_A*, p_B = x_B p_B*, total is a straight line.
// Positive deviation (A-B attraction weaker than A-A and B-B, like ethanol + hexane): both partial pressures and the total lie ABOVE the ideal lines.
// Negative deviation (A-B stronger, like acetone + chloroform): all lie BELOW. Curves from a simple regular-solution model p_A = x_A gamma_A p_A*, gamma = exp(W x_other^2).
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'ideal', xb = 0.4;
  const PA = 60, PB = 40, W = { ideal: 0, pos: 0.9, neg: -0.9 };
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 320, label: 'Vapour pressure against composition for an ideal mixture and for positive and negative deviation from Raoult law' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'mixture', [['ideal', 'ideal'], ['pos', 'positive deviation'], ['neg', 'negative deviation']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'mole fraction of B', min: 0, max: 1, step: 0.01, value: xb, fmt: (v) => v.toFixed(2), oninput: (v) => { xb = v; go(); } });
  const pa = (x) => (1 - x) * PA * Math.exp(W[kind] * x * x), pb = (x) => x * PB * Math.exp(W[kind] * (1 - x) * (1 - x));
  const NOTE = { ideal: 'A–B attraction equals A–A and B–B: no heat, no volume change on mixing.', pos: 'A–B attraction is weaker: molecules escape more easily. ΔH(mix) > 0, ΔV(mix) > 0, minimum boiling azeotrope possible.', neg: 'A–B attraction is stronger: molecules are held back. ΔH(mix) < 0, ΔV(mix) < 0, maximum boiling azeotrope possible.' };
  const go = () => { ro.textContent = `x(B) = ${xb.toFixed(2)}: p(A) = ${pa(xb).toFixed(1)}, p(B) = ${pb(xb).toFixed(1)}, total = ${(pa(xb) + pb(xb)).toFixed(1)} kPa (Raoult ideal total ${((1 - xb) * PA + xb * PB).toFixed(1)}).  ${NOTE[kind]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Vapour pressure of a mixture at one temperature', col);
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 110], xlabel: 'mole fraction of B (A on the left, B on the right)', ylabel: 'pressure (kPa)', l: 44, t: t0 + 6, b: 40 });
    const N = 60, f = (fn) => Array.from({ length: N + 1 }, (_, i) => [A.X(i / N), A.Y(fn(i / N))]);
    ctx.save(); A.clip();
    line(ctx, f((x) => (1 - x) * PA), col.muted, 1.5, [4, 3]); line(ctx, f((x) => x * PB), col.muted, 1.5, [4, 3]); line(ctx, f((x) => (1 - x) * PA + x * PB), col.muted, 1.5, [4, 3]);
    line(ctx, f(pa), col.s[0], 2.5); line(ctx, f(pb), col.s[2], 2.5); line(ctx, f((x) => pa(x) + pb(x)), col.s[3], 3);
    ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(xb), A.B); ctx.lineTo(A.X(xb), A.Y(pa(xb) + pb(xb))); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(xb), A.Y(pa(xb) + pb(xb)), 5.5, col.s[3], col.panel); dot(ctx, A.X(xb), A.Y(pa(xb)), 4, col.s[0], col.panel); dot(ctx, A.X(xb), A.Y(pb(xb)), 4, col.s[2], col.panel);
    text(ctx, 'total', A.X(0.5), A.Y(pa(0.5) + pb(0.5)) - 12, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'p(A)', A.X(0.15), A.Y(pa(0.15)) - 10, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel }); text(ctx, 'p(B)', A.X(0.93), A.Y(pb(0.93)) - 10, { color: col.s[2], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'dashed = Raoult’s law', A.R - 4, A.T + 9, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
