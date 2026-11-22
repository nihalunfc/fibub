// 2.5 Normal modes of N beads on a taut string between fixed walls (transverse motion). Mode n has shape
// sin(n j π/(N+1)) for bead j and angular frequency ω_n = 2ω₀ sin(nπ/(2(N+1))), ω₀ = √(T/ma). "Pluck one bead"
// starts bead 1 alone, a mixture of every mode, so the shape keeps changing. The dots below show all N frequencies.
import { canvas, line, dot, text, title, row, slider, choice, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Beads on a string vibrating in a normal mode, with the list of mode frequencies' });
  let N = 4, n = 1, start = 'mode', t = 0;
  const ctl = row(host);
  const sN = slider(ctl, { label: 'Number of beads N', min: 1, max: 8, step: 1, value: N, fmt: (x) => String(x), oninput: (x) => { N = Math.round(x); if (n > N) { n = N; sn.set(n); } t = 0; show(); cv.redraw(); } });
  const sn = slider(ctl, { label: 'Mode n', min: 1, max: 8, step: 1, value: n, fmt: (x) => String(x), oninput: (x) => { n = Math.min(Math.round(x), N); sn.set(n); t = 0; show(); cv.redraw(); } });
  choice(ctl, 'Start', [['mode', 'In mode n'], ['pluck', 'Pluck bead 1']], start, (v) => { start = v; t = 0; show(); cv.redraw(); });
  const out = readout(host);
  const w = (k) => 2 * Math.sin(k * Math.PI / (2 * (N + 1)));
  const shape = (k, j) => Math.sin(k * j * Math.PI / (N + 1));
  const disp = (j) => {
    if (start === 'mode') return shape(n, j) * Math.cos(w(n) * t);
    // bead 1 displaced by 1, others 0, all at rest: expand in modes (orthogonal sine vectors, norm (N+1)/2)
    let s = 0;
    for (let k = 1; k <= N; k++) s += (2 / (N + 1)) * shape(k, 1) * shape(k, j) * Math.cos(w(k) * t);
    return s;
  };
  const show = () => {
    const list = Array.from({ length: N }, (_, i) => fmt(w(i + 1), 3)).join(', ');
    out.innerHTML = start === 'mode'
      ? `Mode ${n} of ${N}: every bead moves at ω = 2ω₀ sin(${n}π/${2 * (N + 1)}) = <b>${fmt(w(n), 4)}</b> ω₀, in phase or in antiphase, with ${n - 1} node${n === 2 ? '' : 's'} between the walls. All frequencies (in ω₀): ${list}.`
      : `Bead 1 alone is a mixture of all ${N} modes; their frequencies (${list} ω₀) are not whole-number multiples, so the pattern never repeats exactly.`;
    void sN;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Normal modes of a beaded string', col);
    const L = 30, R = W - 30, cy = H * 0.42, A = H * 0.2, dx = (R - L) / (N + 1);
    line(ctx, [[L, cy - A - 14], [L, cy + A + 14]], col.ink, 3); line(ctx, [[R, cy - A - 14], [R, cy + A + 14]], col.ink, 3);
    line(ctx, [[L, cy], [R, cy]], col.line, 1, [3, 4]);
    if (start === 'mode') {
      const env = [];
      for (let x = 0; x <= N + 1 + 1e-9; x += 0.05) env.push([L + x * dx, cy - A * Math.sin(n * x * Math.PI / (N + 1))]);
      line(ctx, env, col.line, 1, [2, 3]);
      line(ctx, env.map(([x, y]) => [x, 2 * cy - y]), col.line, 1, [2, 3]);
    }
    const pts = [[L, cy]];
    for (let j = 1; j <= N; j++) pts.push([L + j * dx, cy - A * disp(j)]);
    pts.push([R, cy]);
    line(ctx, pts, col.ink, 1.5);
    for (let j = 1; j <= N; j++) dot(ctx, pts[j][0], pts[j][1], 7, col.s[0]);
    // frequency strip
    const fy = H - 30, fx0 = 40, fx1 = W - 40;
    line(ctx, [[fx0, fy], [fx1, fy]], col.muted, 1);
    text(ctx, '0', fx0, fy + 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, '2ω₀', fx1, fy + 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'mode frequencies', fx0, fy - 14, { color: col.muted, size: 11 });
    for (let k = 1; k <= N; k++) dot(ctx, fx0 + (fx1 - fx0) * w(k) / 2, fy, k === n && start === 'mode' ? 6 : 4, k === n && start === 'mode' ? col.s[0] : col.s[3]);
  };
  const anim = loop(host, (dt) => { t += dt * 3; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
