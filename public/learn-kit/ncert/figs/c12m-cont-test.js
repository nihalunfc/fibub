// Class 12 Continuity: f is continuous at x = a only if three things agree: the left-hand limit, the right-hand limit and the value f(a).
// Here a = 2. The left branch heads to 3. Slide the height the right branch heads to, and the value f(2) (or remove it): the picture
// turns into a continuous curve, a removable hole or a jump, and the readout names which of the three conditions failed.
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let R = 3, F = 3, has = true;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A graph with a left branch, a right branch and a value at x equals 2, to test continuity' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Right branch heads to', min: 0, max: 6, step: 0.5, value: R, fmt: (v) => String(v), oninput: (v) => { R = v; say(); } });
  slider(ctl, { label: 'f(2)', min: 0, max: 6, step: 0.5, value: F, fmt: (v) => String(v), oninput: (v) => { F = v; say(); } });
  choice(ctl, 'f(2)', [[true, 'defined'], [false, 'not defined']], true, (v) => { has = v; say(); });
  function say() {
    const L = 3, ok1 = L === R, ok2 = has && F === L;
    out.innerHTML = `Left-hand limit = <b>3</b>, right-hand limit = <b>${R}</b>, f(2) = <b>${has ? F : 'not defined'}</b>. ` +
      (!ok1 ? '<b>Jump discontinuity:</b> the two sides head to different heights, so the limit does not exist.' : ok2 ? '<b>Continuous at x = 2:</b> all three agree.' : '<b>Removable discontinuity (a hole):</b> the limit exists, but f(2) is missing or sits at the wrong height. Redefining f(2) = 3 would fix it.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Continuity at x = 2: three things must agree', col);
    const A = axes(ctx, w, h, col, { x: [-1, 5], y: [0, 7], l: 34, r: 14, t: 40, b: 36, xlabel: 'x', xt: [0, 2, 4], yt: [0, 3, 6] });
    const left = [], right = [];
    for (let x = -1; x <= 2.001; x += 0.1) left.push([A.X(x), A.Y(x + 1)]);
    for (let x = 2; x <= 5.001; x += 0.1) right.push([A.X(x), A.Y(R + 0.5 * (x - 2))]);
    line(ctx, left, col.s[0], 3); line(ctx, right, col.s[3], 3);
    ctx.setLineDash([4, 4]); line(ctx, [[A.X(2), A.T], [A.X(2), A.B]], col.line, 1.5, [4, 4]); ctx.setLineDash([]);
    dot(ctx, A.X(2), A.Y(3), 5, col.panel, col.s[0]); dot(ctx, A.X(2), A.Y(R), 5, col.panel, col.s[3]);
    if (has) dot(ctx, A.X(2), A.Y(F), 6.5, col.ink, col.panel);
    text(ctx, 'left → 3', A.X(0.2), A.Y(3.4), { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, `right → ${R}`, A.X(3.5), A.Y(R + 1.5) - 6, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel });
    if (has) text(ctx, `f(2) = ${F}`, A.X(2) - 8, A.Y(F) + (F > 3 ? -14 : 16), { color: col.ink, size: 11.5, weight: 800, halo: col.panel, align: 'right' });
  };
  say();
}
