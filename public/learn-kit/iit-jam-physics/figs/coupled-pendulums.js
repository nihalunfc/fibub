// 3.3 Two identical pendulums joined by a spring. Start them in step (slow mode), opposite (fast mode) or with only one
// displaced (both modes mixed: the energy swaps back and forth at the beat rate). Exact solution of the linearised
// equations: x1 = (q1 + q2)/2, x2 = (q1 - q2)/2 with q1 = c1 cos(w1 t), q2 = c2 cos(w2 t).
import { canvas, axes, line, dot, text, title, row, slider, choice, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 320, label: 'Two coupled pendulums and their displacements against time' });
  const w1 = 2 * Math.PI * 0.8; // free pendulum: 0.8 Hz
  let kap = 0.15, start = 'one', t = 0;
  const w2 = () => Math.sqrt(w1 * w1 + 2 * kap * w1 * w1);
  const amp = () => (start === 'same' ? [1, 0] : start === 'opp' ? [0, 1] : [0.5, 0.5]);
  const x = (tt) => { const [c1, c2] = amp(); const q1 = 2 * c1 * Math.cos(w1 * tt), q2 = 2 * c2 * Math.cos(w2() * tt); return [(q1 + q2) / 2, (q1 - q2) / 2]; };
  const ctl = row(host);
  choice(ctl, 'Start', [['same', 'In step'], ['opp', 'Opposite'], ['one', 'Only left one pulled']], start, (v) => { start = v; t = 0; cv.redraw(); show(); });
  slider(ctl, { label: 'Spring coupling 2k/(mω₁²)', min: 0.04, max: 0.6, step: 0.01, value: kap * 2, fmt: (v) => fmt(v, 2), oninput: (v) => { kap = v / 2; t = 0; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const f1 = w1 / (2 * Math.PI), f2 = w2() / (2 * Math.PI);
    out.innerHTML = `Normal modes: in step at <b>${fmt(f1, 3)} Hz</b> (spring never stretched), opposite at <b>${fmt(f2, 3)} Hz</b>. ` +
      (start === 'one' ? `Starting with one pendulum mixes both modes equally, so the energy passes across in π/(ω₂ − ω₁) = <b>${fmt(Math.PI / (w2() - w1), 3)} s</b> and back.` : 'Starting in a single mode, each pendulum keeps its own energy for ever.');
  };
  const T = 24;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Coupled pendulums', col);
    const [a1, a2] = x(t), top = 38, Lp = h * 0.32, gap = Math.min(w * 0.22, 130), cx = w / 2;
    line(ctx, [[cx - gap - 40, top], [cx + gap + 40, top]], col.muted, 3);
    const bob = (px, ang) => [px + Lp * Math.sin(ang), top + Lp * Math.cos(ang)];
    const b1 = bob(cx - gap / 2 - 20, 0.28 * a1), b2 = bob(cx + gap / 2 + 20, 0.28 * a2);
    line(ctx, [[cx - gap / 2 - 20, top], b1], col.ink, 1.5); line(ctx, [[cx + gap / 2 + 20, top], b2], col.ink, 1.5);
    // spring as a zigzag between the bobs
    const n = 14, zz = [];
    for (let i = 0; i <= n; i++) { const f = i / n, px = b1[0] + (b2[0] - b1[0]) * f, py = b1[1] + (b2[1] - b1[1]) * f; zz.push([px, py + (i % 2 && i < n ? (i % 4 === 1 ? 5 : -5) : 0)]); }
    line(ctx, zz, col.s[5], 1.5);
    dot(ctx, b1[0], b1[1], 9, col.s[0]); dot(ctx, b2[0], b2[1], 9, col.s[2]);
    const ax = axes(ctx, w, h, col, { x: [0, T], y: [-1.15, 1.15], t: top + Lp + 30, xlabel: 'time (s)', ylabel: 'swing', yt: [-1, 0, 1] });
    ctx.save(); ax.clip();
    const p1 = [], p2 = [], tt0 = Math.max(0, t - T);
    for (let k = 0; k <= 600; k++) { const tt = tt0 + (k / 600) * T; const [u, v] = x(tt); p1.push([ax.X(tt - tt0), ax.Y(u)]); p2.push([ax.X(tt - tt0), ax.Y(v)]); }
    line(ctx, p1, col.s[0], 1.8); line(ctx, p2, col.s[2], 1.8);
    line(ctx, [[ax.X(Math.min(t, T)), ax.T], [ax.X(Math.min(t, T)), ax.B]], col.muted, 1, [3, 3]);
    ctx.restore();
    text(ctx, 'left', ax.L + 6, ax.T + 8, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'right', ax.L + 40, ax.T + 8, { color: col.s[2], size: 11, weight: 700 });
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
