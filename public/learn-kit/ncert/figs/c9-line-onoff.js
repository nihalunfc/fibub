// Class 9 Two Variables, One Line: is a point on the line? A point is on the graph exactly when its coordinates satisfy the equation.
// Drag the test point T; the substitution is shown, and T turns green on the line and red off it.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { plane, drawPlane, drawLine, eqn, pt, dragger } from './c9-line-lib.js';

const EQ = [[2, 1, 5], [1, -1, 1], [3, 2, 12], [1, 3, -3]];
export default function (host) {
  let e = 0, T = [1, 1], v = null;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A draggable point and a line, with the check whether the point satisfies the equation' });
  const ctl = row(host); const out = readout(host);
  EQ.forEach((q, i) => button(ctl, eqn(...q), () => { e = i; sync(); }));
  const f = (n) => String(n);
  function sync() {
    const [a, b, c] = EQ[e], L = a * T[0] + b * T[1], on = L === c;
    out.innerHTML = `T = (${f(T[0])}, ${f(T[1])}). Left side: ${a}(${f(T[0])}) + (${b})(${f(T[1])}) = <b>${L}</b>. Right side: ${c}. ${on ? '<b>Equal, so T is on the line: (' + f(T[0]) + ', ' + f(T[1]) + ') is a solution.</b>' : 'Not equal, so T is <b>not</b> on the line and is not a solution.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c] = EQ[e], top = title(ctx, 'Is T a solution of ' + eqn(a, b, c) + '?', col); v = plane(w, h, top, -6, 8, -5, 7);
    drawPlane(ctx, v, col); drawLine(ctx, v, a, b, c, col.s[0]);
    const on = a * T[0] + b * T[1] === c;
    pt(ctx, v, T[0], T[1], on ? col.s[1] : col.s[4], dr.active >= 0 ? 10 : 8, col.ink); text(ctx, 'T', v.X(T[0]) + 12, v.Y(T[1]) - 12, { color: col.ink, size: 13, weight: 700, halo: col.panel });
  };
  const dr = dragger(cv, [T], () => v, { snap: 1, radius: 1.5, onmove: () => { sync(); } });
  sync();
}
