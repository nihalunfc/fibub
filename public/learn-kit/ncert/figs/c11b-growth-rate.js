// Class 11 Biology, Plant Growth and Development: absolute and relative growth rate. Two seedlings: A starts small and grows 1 cm a day, B starts taller and grows 2 cm a day.
// Absolute growth rate = increase in size per day. Relative growth rate = increase per day divided by the size at the start of that day, so a small plant growing less can grow "faster" relatively.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a0 = 4, ra = 1, b0 = 12, rb = 2, d = 5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Heights of two seedlings over ten days with absolute and relative growth rates' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Seedling A start', min: 1, max: 15, step: 1, value: a0, fmt: (v) => v + ' cm', oninput: (v) => { a0 = v; go(); } });
  slider(ctl, { label: 'Seedling A grows', min: 0.5, max: 3, step: 0.5, value: ra, fmt: (v) => v + ' cm/day', oninput: (v) => { ra = v; go(); } });
  slider(ctl, { label: 'Seedling B grows', min: 0.5, max: 3, step: 0.5, value: rb, fmt: (v) => v + ' cm/day', oninput: (v) => { rb = v; go(); } });
  slider(ctl, { label: 'Day', min: 1, max: 10, step: 1, value: d, fmt: (v) => String(v), oninput: (v) => { d = v; go(); } });
  const H = (s, r, x) => s + r * x;
  const go = () => {
    const rga = ra / H(a0, ra, d - 1), rgb = rb / H(b0, rb, d - 1);
    ro.textContent = `Day ${d}. A: ${H(a0, ra, d).toFixed(1)} cm, absolute rate ${ra} cm/day, relative rate ${(rga * 100).toFixed(1)} % per day. B: ${H(b0, rb, d).toFixed(1)} cm, absolute rate ${rb} cm/day, relative rate ${(rgb * 100).toFixed(1)} % per day. Relative rate = added size ÷ size at the start of the day. ${rga > rgb ? 'A is growing faster in relative terms.' : 'B is growing faster in relative terms.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Absolute against relative growth', col), top = Math.max(H(a0, ra, 10), H(b0, rb, 10)) + 2;
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, top], xlabel: 'day', ylabel: 'height (cm)', l: 48, t: t0 + 10, b: 44, xt: [0, 2, 4, 6, 8, 10] });
    [[a0, ra, col.s[0], 'A'], [b0, rb, col.s[3], 'B']].forEach(([s, r, c, n]) => { line(ctx, [[A.X(0), A.Y(s)], [A.X(10), A.Y(s + 10 * r)]], c, 2.5); dot(ctx, A.X(d), A.Y(s + r * d), 5.5, c, col.bg); text(ctx, n, A.X(10) - 8, A.Y(s + 10 * r) - 10, { color: c, size: 12, weight: 700 }); });
    line(ctx, [[A.X(d), A.T], [A.X(d), A.B]], col.muted, 1, [4, 3]);
  };
  go();
}
