// Class 11 Maths, Limits and Derivatives: left-hand and right-hand limits. The limit at a exists only when both one-sided limits exist and are equal; f(a) is a separate question.
// Four situations: a jump, a hole, a misplaced dot, and a smooth join. Slide h to push the two dots towards x = 2.
import { canvas, text, title, dot, row, slider, readout, choice } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const FUNS = {
  jump: { f: (x) => (x < 2 ? x + 1 : x * x - 2), L: 3, R: 2, fa: 2, d: 'x + 1 for x < 2 and x² − 2 for x ≥ 2' },
  hole: { f: (x) => (x === 2 ? NaN : (x * x - 4) / (x - 2)), L: 4, R: 4, fa: null, d: '(x² − 4)/(x − 2): not defined at x = 2' },
  dot: { f: (x) => (x === 2 ? NaN : x + 2), L: 4, R: 4, fa: 1, d: 'x + 2 except f(2) = 1' },
  smooth: { f: (x) => x + 2, L: 4, R: 4, fa: 4, d: 'x + 2' },
};
export default function (host) {
  let k = 'jump', lg = -0.3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A graph near x = 2 showing the left-hand limit, the right-hand limit and the value at 2' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Graph', [['jump', 'Jump'], ['hole', 'Hole'], ['dot', 'Dot moved'], ['smooth', 'Smooth']], k, (v) => { k = v; cv.redraw(); });
  slider(ctl, { label: 'distance h from 2', min: -3, max: 0, step: 0.02, value: lg, fmt: (v) => 'h = ' + (+Math.pow(10, v).toPrecision(2)), oninput: (v) => { lg = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const F = FUNS[k], top = title(ctx, 'Left limit, right limit and f(2)', col), P = plot(ctx, w, h, col, { x: [0, 4], y: [-1, 7], sx: 1, sy: 1, t: top + 6, b: 20 });
    const A = (x) => F.f(x === 2 ? 2.000001 : x);
    curve(ctx, P, (x) => (Math.abs(x - 2) < 0.004 ? NaN : F.f(x)), col.s[0], 2.5, 80);
    const open = (x, y) => { ctx.save(); ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), 5, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
    const hh = Math.pow(10, lg), xl = 2 - hh, xr = 2 + hh, yl = F.f(xl), yr = F.f(xr);
    if (k === 'jump') { open(2, F.L); dot(ctx, P.X(2), P.Y(F.fa), 5, col.s[0]); } else if (k === 'hole') open(2, 4); else if (k === 'dot') { open(2, 4); dot(ctx, P.X(2), P.Y(1), 5, col.s[0]); } else dot(ctx, P.X(2), P.Y(4), 5, col.s[0]);
    dot(ctx, P.X(xl), P.Y(yl), 6, col.s[1], col.panel); dot(ctx, P.X(xr), P.Y(yr), 6, col.s[3], col.panel);
    const ex = F.L === F.R;
    ro.innerHTML = `<b>f(x) = ${F.d}.</b> Left-hand limit <b style="color:${col.s[1]}">${F.L}</b>, right-hand limit <b style="color:${col.s[3]}">${F.R}</b>: ${ex ? `the limit exists and equals <b>${F.L}</b>` : '<b>the limit does not exist</b> (the sides disagree)'}. f(2) is ${F.fa === null ? '<b>not defined</b>' : '<b>' + F.fa + '</b>'}${ex ? (F.fa === F.L ? ': equal to the limit, so f is continuous here.' : ': it does not matter for the limit.') : '.'}`;
  };
  cv.redraw();
}
