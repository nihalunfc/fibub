// 5.6 Speeding up or slowing down? The size of the universe a(t) around today, with a straight dashed line
// touching it now: the path it would take if the expansion rate never changed. If the curve bends below the
// line in the future, gravity is winning (slowing down); above it, dark energy is winning (speeding up).
// q0 = Ωm/2 − ΩΛ: positive means slowing. Slide the amounts of matter and dark energy.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { scaleHistory, q0, hubbleTimeGyr } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 300, label: 'The size of the universe through time, bending above or below a straight line' });
  let Om = 0.31, OL = 0.69;
  const ctl = row(host);
  slider(ctl, { label: 'Matter Ωm', min: 0, max: 2, step: 0.01, value: Om, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; show(); cv.redraw(); } });
  slider(ctl, { label: 'Dark energy ΩΛ', min: 0, max: 1.5, step: 0.01, value: OL, fmt: (v) => v.toFixed(2), oninput: (v) => { OL = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const q = q0({ Om, OL });
    out.innerHTML = `q₀ = ${Om.toFixed(2)}/2 − ${OL.toFixed(2)} = <b>${q.toFixed(2)}</b>: the expansion is ${q < -0.005 ? '<b>speeding up</b> (dark energy wins)' : q > 0.005 ? '<b>slowing down</b> (gravity wins)' : 'coasting at a steady rate'}. Measured: about −0.53.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const p = { H0: 70, Om, OL }, hist = scaleHistory(p, { tPast: 15, tFuture: 15, aMax: 4 });
    const A = axes(ctx, w, h, col, { x: [-15, 15], y: [0, 3], t: 40, xlabel: 'Time from today (billion years)', ylabel: 'Size a (today = 1)' });
    ctx.save(); A.clip();
    const tH = hubbleTimeGyr(70);
    line(ctx, [[A.X(-15), A.Y(1 - 15 / tH)], [A.X(15), A.Y(1 + 15 / tH)]], col.muted, 1.5, [6, 4]);
    line(ctx, hist.map(({ t, a }) => [A.X(t), A.Y(a)]), col.s[0], 2.5);
    ctx.restore();
    dot(ctx, A.X(0), A.Y(1), 5, col.ink, col.panel);
    text(ctx, 'today', A.X(0) + 8, A.Y(1) + 12, { color: col.ink, size: 11.5, weight: 600 });
    text(ctx, 'dashed: steady rate', A.X(-14), A.Y(2.8), { color: col.muted, size: 11.5, halo: col.panel });
    title(ctx, 'Is the curve bending up or down?', col);
  };
  show(); cv.redraw();
}
