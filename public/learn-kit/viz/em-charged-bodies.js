// Field of charged bodies along their axis: a ring, a charged rod (on its perpendicular bisector) and a disc, each
// with total charge Q. Change the size a. Close to the body the field follows the "infinite line" or "infinite sheet"
// result; far away every curve joins the point-charge curve kQ/x². Units: kQ = 1, lengths in metres.
import { canvas, axes, line, row, choice, slider, readout, text, fmt } from '../kit.js';

const F = {
  ring: { name: 'Ring (radius a)', E: (x, a) => x / Math.pow(x * x + a * a, 1.5), near: null, pk: (a) => a / Math.SQRT2, note: 'E = kQx/(x²+a²)^{3/2}: zero at the centre, peak at x = a/√2' },
  rod: { name: 'Rod (length 2a)', E: (x, a) => 1 / (x * Math.sqrt(x * x + a * a)), near: (x, a) => 1 / (a * x), note: 'E = kQ/(x√(x²+a²)); close in it is the infinite line 2kλ/x with λ = Q/2a' },
  disc: { name: 'Disc (radius a)', E: (x, a) => (2 / (a * a)) * (1 - x / Math.sqrt(x * x + a * a)), near: (x, a) => 2 / (a * a), note: 'E = (σ/2ε₀)(1 − x/√(x²+a²)); close in it is the infinite sheet σ/2ε₀' },
};
export default function (host) {
  let k = 'ring', a = 1, xp = 1.2;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 250, label: 'Electric field of a ring, rod or disc against distance' });
  const ctl = row(host);
  choice(ctl, 'Body', Object.entries(F).map(([v, f]) => [v, f.name.split(' ')[0]]), k, (v) => { k = v; upd(); });
  slider(ctl, { label: 'Size a', min: 0.3, max: 2, value: a, step: 0.05, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'Distance x', min: 0.1, max: 4, value: xp, step: 0.05, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { xp = v; upd(); } });
  const out = readout(host);
  function upd() { const f = F[k], e = f.E(xp, a), p = 1 / (xp * xp); out.innerHTML = `${f.note}. At x = ${xp.toFixed(2)} m: body E = <b>${fmt(e, 3)}</b>, point charge ${fmt(p, 3)} (ratio ${(e / p).toFixed(2)}).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const f = F[k], ymax = 5 / (a * a) > 12 ? 12 : 5 / (a * a);
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, ymax], xlabel: 'distance x along the axis (m)', ylabel: 'E (kQ = 1)', l: 44 });
    A.clip && (ctx.save(), A.clip());
    const xs = Array.from({ length: 160 }, (_, i) => 0.02 + (i / 159) * 3.98);
    line(ctx, xs.map((x) => [A.X(x), A.Y(Math.min(ymax * 1.2, 1 / (x * x)))]), col.muted, 1.6, [5, 4]);
    if (f.near) line(ctx, xs.map((x) => [A.X(x), A.Y(Math.min(ymax * 1.2, f.near(x, a)))]), col.s[2], 1.6, [2, 3]);
    line(ctx, xs.map((x) => [A.X(x), A.Y(Math.min(ymax * 1.2, f.E(x, a)))]), col.s[0], 2.6);
    ctx.restore();
    const e = Math.min(ymax, f.E(xp, a));
    line(ctx, [[A.X(xp), A.B], [A.X(xp), A.Y(e)]], col.s[5], 1.5, [3, 3]);
    ctx.beginPath(); ctx.arc(A.X(xp), A.Y(e), 5, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill();
    text(ctx, 'body', A.R - 6, A.T + 40, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, 'point charge kQ/x²', A.R - 6, A.T + 56, { color: col.muted, size: 11, align: 'right' });
    if (f.near) text(ctx, k === 'rod' ? 'infinite line' : 'infinite sheet', A.R - 6, A.T + 72, { color: col.s[2], size: 11, align: 'right' });
  };
  upd();
}
