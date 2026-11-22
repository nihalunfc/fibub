// A damped oscillator pushed by a driving force of its own frequency. Start from rest: first it wobbles at its own
// natural frequency, then settles into following the drive. The top trace is the drive, the lower one the block; the
// resonance curve (right) shows the steady amplitude against drive frequency, and the phase lag goes from 0 to 90° (at resonance) to 180°.
import { canvas, axes, line, dot, text, title, arrow, row, slider, button, readout, loop } from '../kit.js';

export default function (host) {
  let r = 0.9, zeta = 0.12, x = 0, v = 0, t = 0, hist = [];
  const W0 = 3; // natural angular frequency (rad/s)
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A driven damped oscillator with drive and response traces and a resonance curve' });
  const ctl = row(host);
  slider(ctl, { label: 'Drive ω/ω₀', min: 0.2, max: 2, step: 0.02, value: r, fmt: (q) => q.toFixed(2), oninput: (q) => { r = q; restart(true); } });
  slider(ctl, { label: 'Damping ζ', min: 0.03, max: 1, value: zeta, log: true, fmt: (q) => q.toFixed(2), oninput: (q) => { zeta = q; restart(true); } });
  const c2 = row(host);
  const advance = (dt) => {
    const w = r * W0, n = 8, h = dt / n;
    for (let i = 0; i < n; i++) { const a = -2 * zeta * W0 * v - W0 * W0 * x + W0 * W0 * Math.cos(w * t); v += a * h; x += v * h; t += h; }
    hist.push([t, Math.cos(w * t), x]); if (hist.length > 480) hist.shift();
  };
  const lp = loop(host, (dt) => { advance(dt); cv.redraw(); show(); });
  lp.button(c2); button(c2, 'Restart from rest', () => { restart(); lp.play(); });
  const out = readout(host);
  function restart(pre) { x = 0; v = 0; t = 0; hist = []; if (pre) for (let i = 0; i < 480; i++) advance(1 / 60); cv.redraw(); show(); }
  const amp = (q) => 1 / Math.sqrt((1 - q * q) ** 2 + (2 * zeta * q) ** 2), ph = (q) => Math.atan2(2 * zeta * q, 1 - q * q);
  function show() {
    out.innerHTML = `Steady amplitude = <b>${amp(r).toFixed(2)}×</b> the static push; the block lags the drive by <b>${((ph(r) * 180) / Math.PI).toFixed(0)}°</b>. Q = 1/2ζ = ${(1 / (2 * zeta)).toFixed(1)}; resonance peak near ω ≈ ω₀√(1−2ζ²)${zeta < 0.7 ? '' : ' (no peak once ζ > 0.71)'}. Light damping gives a tall narrow peak and a slow start-up.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Driven, damped oscillator', col);
    const wy = 56, wl = 12, cx = w / 2, sc = 24, bx = cx + Math.max(-2.2, Math.min(2.2, x)) * sc * 2, bw = 28;
    ctx.fillStyle = col.muted; ctx.fillRect(wl - 6, wy - 16, 6, 32);
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wl, wy); const x1 = bx - bw / 2; for (let i = 1; i < 20; i++) ctx.lineTo(wl + ((x1 - wl) * i) / 20, wy + (i % 2 ? -7 : 7)); ctx.lineTo(x1, wy); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx - bw / 2, wy - 13, bw, 26); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx - bw / 2, wy - 13, bw, 26);
    const fd = Math.cos(r * W0 * t); arrow(ctx, bx + bw / 2, wy + 30, bx + bw / 2 + fd * 40, wy + 30, col.s[3], 3); text(ctx, 'drive force', bx + bw / 2, wy + 44, { color: col.s[3], size: 10, align: 'center' });
    // traces
    const gy = 104, gh = h * 0.3; ctx.save(); ctx.translate(0, gy);
    const G = axes(ctx, w, gh, col, { x: [0, 1], y: [-3, 3], xlabel: '', ylabel: '', t: 4, b: 6, l: 12, xt: [], yt: [0], fy: () => '' });
    const tw = hist.length ? [hist[0][0], hist[hist.length - 1][0]] : [0, 1], tt = Math.max(tw[1] - tw[0], 1e-9);
    line(ctx, hist.map(([a, c]) => [G.X((a - tw[0]) / tt), G.Y(c)]), col.s[3], 1.8); line(ctx, hist.map(([a, , q]) => [G.X((a - tw[0]) / tt), G.Y(q)]), col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'drive', 16, gy + 12, { color: col.s[3], size: 11, weight: 600 }); text(ctx, 'block', 60, gy + 12, { color: col.s[0], size: 11, weight: 600 });
    // resonance curve
    const ry = gy + gh + 4; ctx.save(); ctx.translate(0, ry);
    const R = axes(ctx, w, h - ry, col, { x: [0, 2], y: [0, Math.max(3, Math.min(8, 1 / (2 * zeta)) * 1.1)], xlabel: 'drive ω/ω₀', ylabel: 'amplitude', t: 6, b: 34, l: 42, fx: (q) => q.toFixed(1), fy: (q) => q.toFixed(0), xt: [0, 0.5, 1, 1.5, 2] });
    const pts = []; for (let q = 0.02; q <= 2; q += 0.02) pts.push([R.X(q), R.Y(amp(q))]); R.clip && (ctx.save(), R.clip()); line(ctx, pts, col.s[1], 2.5); R.clip && ctx.restore();
    dot(ctx, R.X(r), R.Y(Math.min(amp(r), 8.5)), 6, col.s[3], col.panel);
    ctx.restore();
  };
  restart(true);
}
