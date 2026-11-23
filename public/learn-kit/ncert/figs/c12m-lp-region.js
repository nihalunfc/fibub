// Class 12 Maths, Linear Programming: the feasible region is where ALL the constraints hold at once, so it is the overlap of the half-planes
// (here also x >= 0, y >= 0). Switch each constraint on or off and watch the region shrink; its corner points are where two boundary lines meet.
import { canvas, text, title, axes, line, row, button, readout } from '../../kit.js';
import { shade, lineFull, corners, AX, mark } from '../c12m-lp.js';

export default function (host) {
  const C = [{ a: 1, b: 1, c: 8, ge: false, n: 'x + y ≤ 8' }, { a: 1, b: 3, c: 18, ge: false, n: 'x + 3y ≤ 18' }, { a: 3, b: 1, c: 18, ge: false, n: '3x + y ≤ 18' }];
  const on = [true, true, true];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A feasible region as the overlap of half-planes with its corner points' });
  const ctl = row(host), ro = readout(host);
  const lab = (i) => (on[i] ? '✓ ' : '✗ ') + C[i].n;
  const btns = C.map((c, i) => button(ctl, lab(i), () => { on[i] = !on[i]; btns[i].textContent = lab(i); btns[i].setAttribute('aria-pressed', String(on[i])); go(); }));
  btns.forEach((b) => b.setAttribute('aria-pressed', 'true'));
  const act = () => [...AX, ...C.filter((c, i) => on[i])];
  const go = () => {
    const cs = corners(act()), f = (v) => +v.toFixed(2);
    ro.textContent = `Corner points: ${cs.map((p) => `(${f(p[0])}, ${f(p[1])})`).join(', ') || 'none'}.  ${cs.length ? '' : 'No point satisfies all the constraints.'} Each constraint you switch on can only cut the region down, never enlarge it.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Feasible region = overlap of half-planes', col);
    const G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip();
    shade(ctx, G, act(), col.s[0], 0.3);
    C.forEach((c, i) => { if (on[i]) lineFull(ctx, G, c.a, c.b, c.c, col.s[i + 1], 2); });
    ctx.restore();
    corners(act()).forEach((p) => mark(ctx, G, p[0], p[1], col.ink, col.panel, `(${+p[0].toFixed(1)}, ${+p[1].toFixed(1)})`, 7, -9, 10.5));
    C.forEach((c, i) => { if (on[i]) text(ctx, c.n, G.R - 6, G.T + 12 + i * 14, { color: col.s[i + 1], size: 11, weight: 700, align: 'right' }); });
    void line;
  };
  go();
}
