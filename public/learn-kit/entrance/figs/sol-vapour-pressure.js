// Raoult's law for two volatile liquids A and B: partial pressures and total vapour pressure against the mole
// fraction of A. Ideal mixtures give straight lines; positive and negative deviations bow the total curve up or down.
// The deviation curves use a simple one-constant (Margules) model: p_A = x_A p°_A exp(W x_B²), with W > 0 or W < 0.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const KINDS = {
  ideal: { name: 'Ideal', W: 0, eg: 'like benzene + toluene' },
  pos: { name: 'Positive', W: 1.1, eg: 'like ethanol + water or acetone + CS₂' },
  neg: { name: 'Negative', W: -1.1, eg: 'like acetone + chloroform or HNO₃ + water' },
};
export default function (host) {
  let kind = 'ideal', xA = 0.4, pA0 = 100, pB0 = 40;
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 280, label: 'Vapour pressure of a two-liquid mixture against mole fraction' });
  const ctl = row(host);
  choice(ctl, 'Mixture', Object.entries(KINDS).map(([k, s]) => [k, s.name]), kind, (v) => { kind = v; upd(); });
  slider(ctl, { label: 'x_A', min: 0, max: 1, step: 0.01, value: xA, fmt: (v) => v.toFixed(2), oninput: (v) => { xA = v; upd(); } });
  slider(ctl, { label: 'p°_A', min: 20, max: 160, step: 5, value: pA0, fmt: (v) => `${v} kPa`, oninput: (v) => { pA0 = v; upd(); } });
  const out = readout(host);
  const P = (x) => {
    const W = KINDS[kind].W, xb = 1 - x;
    const a = x * pA0 * Math.exp(W * xb * xb), b = xb * pB0 * Math.exp(W * x * x);
    return { a, b, t: a + b };
  };
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const p = P(xA), yA = p.t ? p.a / p.t : 0;
    out.innerHTML = `x_A = ${xA.toFixed(2)}: p_A = ${fmt(p.a)} kPa, p_B = ${fmt(p.b)} kPa, total = <b>${fmt(p.t)} kPa</b>. Vapour is richer in the more volatile liquid: y_A = ${yA.toFixed(2)}. ${KINDS[kind].name} mixture, ${KINDS[kind].eg}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const N = 80, pts = Array.from({ length: N + 1 }, (_, i) => ({ x: i / N, ...P(i / N) }));
    const top = Math.max(...pts.map((p) => p.t), pA0, pB0) * 1.12;
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 1], y: [0, top], xlabel: 'mole fraction of A, x_A', ylabel: 'vapour pressure (kPa)', t: 28 });
    if (kind !== 'ideal') {
      line(ctx, [[X(0), Y(pB0)], [X(1), Y(pA0)]], col.muted, 1.2, [5, 4]);
      text(ctx, 'ideal total', X(0.5), Y((pA0 + pB0) / 2) + (kind === 'pos' ? 12 : -12), { color: col.muted, size: 10, align: 'center' });
    }
    line(ctx, pts.map((p) => [X(p.x), Y(p.a)]), col.s[0], 2);
    line(ctx, pts.map((p) => [X(p.x), Y(p.b)]), col.s[1], 2);
    line(ctx, pts.map((p) => [X(p.x), Y(p.t)]), col.s[2], 3);
    const p = P(xA);
    line(ctx, [[X(xA), Y(0)], [X(xA), Y(p.t)]], col.line, 1, [3, 3]);
    dot(ctx, X(xA), Y(p.a), 4, col.s[0]); dot(ctx, X(xA), Y(p.b), 4, col.s[1]); dot(ctx, X(xA), Y(p.t), 5, col.s[2]);
    text(ctx, 'p_A', X(0.93), Y(P(0.93).a) + 12, { color: col.s[0], size: 11, weight: 600, align: 'center' });
    text(ctx, 'p_B', X(0.07), Y(P(0.07).b) + 12, { color: col.s[1], size: 11, weight: 600, align: 'center' });
    text(ctx, 'total', X(0.5), Y(P(0.5).t) - 12, { color: col.s[2], size: 11, weight: 600, align: 'center' });
    text(ctx, kind === 'ideal' ? 'Ideal: obeys Raoult\'s law' : `${KINDS[kind].name} deviation`, 10, 14, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
