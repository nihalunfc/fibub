// Class 10 Quadratic Equations: two answers from one quadratic. A cricket ball thrown straight up at 20 m/s has height
// h = 20t - 5t² (g taken as 10 m/s²). To find when it is at height H, solve 5t² - 20t + H = 0: the two roots are the
// time on the way up and the time on the way down. At H = 20 m (the top) they merge; above that there is no real root.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let H = 15, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Height against time for a ball thrown upward with a chosen height line crossing it at two times' });
  const ctl = row(host);
  slider(ctl, { label: 'Height H', min: 0, max: 24, step: 1, value: H, fmt: (v) => v + ' m', oninput: (v) => { H = v; say(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.8) % 4.4; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() {
    const D = 400 - 20 * H;
    out.innerHTML = D > 0 ? `5t² − 20t + ${H} = 0 has D = ${D} &gt; 0: the ball is at ${H} m twice, at t = <b>${+(2 - Math.sqrt(D) / 10).toFixed(2)} s</b> (going up) and t = <b>${+(2 + Math.sqrt(D) / 10).toFixed(2)} s</b> (coming down).` : D === 0 ? `D = 0: ${H} m is the very top. One time only: t = <b>2 s</b>.` : `D = ${D} &lt; 0: the ball never reaches ${H} m. No real root.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'h = 20t − 5t²  (ball thrown up at 20 m/s)', col);
    const A = axes(ctx, w, h, col, { x: [0, 4.4], y: [0, 26], l: 40, t: 34, b: 34, xlabel: 'time t (s)', ylabel: 'height h (m)' });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 88; i++) { const v = i / 20; pts.push([A.X(v), A.Y(Math.max(0, 20 * v - 5 * v * v))]); }
    line(ctx, pts, col.s[0], 3);
    ctx.restore();
    line(ctx, [[A.L, A.Y(H)], [A.R, A.Y(H)]], col.s[3], 2, [6, 4]);
    const D = 400 - 20 * H;
    if (D >= 0) for (const r of D === 0 ? [2] : [2 - Math.sqrt(D) / 10, 2 + Math.sqrt(D) / 10]) { line(ctx, [[A.X(r), A.Y(H)], [A.X(r), A.B]], col.s[1], 1.5, [3, 3]); dot(ctx, A.X(r), A.Y(H), 6, col.s[1], col.panel); text(ctx, `${+r.toFixed(2)} s`, A.X(r), A.B + 12, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); }
    else text(ctx, 'line is above the top: no real roots', (A.L + A.R) / 2, A.T + 12, { color: col.bad, size: 11.5, weight: 700, align: 'center' });
    dot(ctx, A.X(t), A.Y(Math.max(0, 20 * t - 5 * t * t)), 6, col.s[2], col.panel);
  };
  say();
}
