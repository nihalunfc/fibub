// 3.1 Simple harmonic motion you can watch. A block on a spring moves as x = A cos(wt); underneath, the reference
// circle turns at w and its shadow follows the block exactly; bars on the right show kinetic and potential energy
// trading places while their sum stays fixed. Sliders change amplitude, mass and spring constant.
import { canvas, text, line, dot, row, slider, readout, fmt, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'A block on a spring with its reference circle and energy bars' });
  let A = 0.7, m = 1, k = 40, t = 0;
  const ctl = row(host);
  const out = readout(host);
  const omega = () => Math.sqrt(k / m);
  const show = () => {
    const w = omega(), x = A * Math.cos(w * t), v = -A * w * Math.sin(w * t);
    const E = 0.5 * k * A * A, KE = 0.5 * m * v * v;
    out.innerHTML = `ω = √(k/m) = <b>${fmt(w, 3)} rad/s</b>, period T = 2π/ω = <b>${fmt(2 * Math.PI / w, 3)} s</b>. Now: x = ${fmt(x, 2)} m, v = ${fmt(v, 2)} m/s, kinetic energy ${Math.round(100 * KE / E)}% of the total ${fmt(E, 3)} J. The amplitude does not change the period.`;
  };
  slider(ctl, { label: 'Amplitude A (m)', min: 0.1, max: 1, step: 0.05, value: A, fmt: (v) => fmt(v, 2), oninput: (v) => { A = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Mass m (kg)', min: 0.5, max: 4, step: 0.1, value: m, fmt: (v) => fmt(v, 2), oninput: (v) => { m = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Spring k (N/m)', min: 10, max: 100, step: 1, value: k, fmt: (v) => fmt(v, 3), oninput: (v) => { k = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    const ph = omega() * t, x = A * Math.cos(ph), v = -A * omega() * Math.sin(ph);
    const barW = Math.max(70, w * 0.18), plotW = w - barW - 20;
    const yb = h * 0.22, bs = Math.min(44, h * 0.13);
    const cx = 20 + plotW * 0.55, scale = Math.min(plotW * 0.4, (h - yb - bs - 44) / 2); // 1 m of displacement = scale px
    // wall, floor, spring, block
    const wallX = 16;
    ctx.fillStyle = col.line; ctx.fillRect(wallX - 6, yb - bs, 6, bs * 1.6);
    line(ctx, [[wallX, yb + bs / 2 + 1], [20 + plotW, yb + bs / 2 + 1]], col.muted, 1.5);
    const bx = cx + x * scale;
    const coils = 12, sx0 = wallX, sx1 = bx - bs / 2, pts = [[sx0, yb]];
    for (let i = 1; i < coils * 2; i++) pts.push([sx0 + ((sx1 - sx0) * i) / (coils * 2), yb + (i % 2 ? -1 : 1) * bs * 0.28]);
    pts.push([sx1, yb]);
    line(ctx, pts, col.ink, 1.6);
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx - bs / 2, yb - bs / 2, bs, bs);
    // equilibrium and amplitude marks
    line(ctx, [[cx, yb - bs], [cx, h - 30]], col.muted, 1, [4, 4]);
    for (const s of [-1, 1]) line(ctx, [[cx + s * A * scale, yb - bs * 0.9], [cx + s * A * scale, yb - bs * 0.6]], col.muted, 1.5);
    text(ctx, 'x = 0', cx, yb - bs - 6, { color: col.muted, size: 11, align: 'center', base: 'bottom' });
    // velocity arrow on the block
    if (Math.abs(v) > 1e-3) {
      const L = (v / (A * omega() || 1)) * bs * 1.2;
      line(ctx, [[bx, yb - bs * 0.75], [bx + L, yb - bs * 0.75]], col.s[3], 2.5);
    }
    // reference circle
    const cyc = yb + bs + (h - yb - bs - 30) / 2, R = A * scale; // the shadow of the dot is the block
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cyc, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    const px = cx + R * Math.cos(ph), py = cyc - R * Math.sin(ph);
    line(ctx, [[cx, cyc], [px, py]], col.s[1], 2);
    line(ctx, [[px, py], [bx, yb + bs / 2]], col.s[1], 1, [3, 4]);
    dot(ctx, px, py, 5, col.s[1]);
    text(ctx, 'reference circle: angle ωt', cx, h - 12, { color: col.muted, size: 11, align: 'center' });
    // energy bars
    const E = 0.5 * k * A * A, KE = 0.5 * m * v * v, PE = 0.5 * k * x * x, top = yb - bs / 2, bh = h - 50 - top;
    const bxL = w - barW + 6, bw = (barW - 24) / 2;
    const bar = (i, val, c, lab) => {
      const hh = (val / E) * bh, X = bxL + i * (bw + 8);
      ctx.strokeStyle = col.line; ctx.strokeRect(X, top, bw, bh);
      ctx.fillStyle = c; ctx.fillRect(X, top + bh - hh, bw, hh);
      text(ctx, lab, X + bw / 2, top + bh + 14, { color: col.ink, size: 11, align: 'center' });
    };
    bar(0, KE, col.s[3], 'KE'); bar(1, PE, col.s[2], 'PE');
    text(ctx, 'sum fixed', bxL + bw + 4, top + bh + 30, { color: col.muted, size: 10, align: 'center' });
  };
  const lp = loop(host, (dt) => { t += dt ?? 0.016; cv.redraw(); show(); });
  lp.button(ctl);
  cv.redraw(); show();
}
