// Oscillations: SHM as the shadow of uniform circular motion. A point goes round a circle of radius A at ω; its
// shadow on the x axis moves in SHM, x = A sin(ωt + φ). The trace on the right is x against t, and the bars show
// kinetic and potential energy trading places while their total stays fixed. Damping makes the amplitude decay.
import { canvas, line, dot, text, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let A = 1, w = 2, phi = 0, b = 0, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'A point moving round a circle, its shadow moving in simple harmonic motion, and the displacement-time graph' });
  const ctl = row(host);
  slider(ctl, { label: 'Amplitude A', min: 0.3, max: 1, step: 0.05, value: A, fmt: (v) => `${v.toFixed(2)} m`, oninput: (v) => { A = v; t = 0; } });
  slider(ctl, { label: 'ω', min: 0.5, max: 4, step: 0.1, value: w, fmt: (v) => `${v.toFixed(1)} rad/s`, oninput: (v) => { w = v; t = 0; } });
  slider(ctl, { label: 'Phase φ', min: 0, max: 360, step: 15, value: 0, fmt: (v) => `${v}°`, oninput: (v) => { phi = (v * Math.PI) / 180; t = 0; } });
  slider(ctl, { label: 'Damping', min: 0, max: 0.5, step: 0.05, value: b, fmt: (v) => (v ? v.toFixed(2) + ' /s' : 'none'), oninput: (v) => { b = v; t = 0; } });
  const anim = loop(host, (dt) => { t += dt; if (t > 14) t = 0; cv.redraw(); show(); });
  anim.button(ctl);
  const out = readout(host);
  const amp = (tt) => A * Math.exp(-b * tt);
  const x = (tt) => amp(tt) * Math.sin(w * tt + phi);
  const show = () => {
    const xx = x(t), v = amp(t) * w * Math.cos(w * t + phi) - b * xx, a = -w * w * xx;
    out.innerHTML = `T = 2π/ω = <b>${((2 * Math.PI) / w).toFixed(2)} s</b>. Now x = ${xx.toFixed(2)} m, v = ${v.toFixed(2)} m/s, a = −ω²x = ${a.toFixed(2)} m/s². ` +
      `Speed is greatest (Aω = ${(A * w).toFixed(2)} m/s) at the centre and zero at the ends; acceleration is greatest at the ends.` + (b ? ' With damping, the amplitude shrinks as e^(−bt).' : '');
  };
  cv.draw = (ctx, W, H, col) => {
    const R = Math.min(H * 0.36, W * 0.2), cx = R + 16, cy = H * 0.48, k = R / 1; // px per metre
    const ang = w * t + phi, Am = amp(t) * k;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, Am, 0, Math.PI * 2); ctx.stroke();
    // the shadow moves on the vertical axis, so the trace on the right reads as x against t
    const px = cx + Am * Math.cos(ang), py = cy - Am * Math.sin(ang);
    line(ctx, [[cx, cy - R - 6], [cx, cy + R + 6]], col.muted, 1);
    line(ctx, [[cx, cy], [px, py]], col.s[2], 1.5);
    line(ctx, [[px, py], [cx, py]], col.line, 1, [3, 3]);
    dot(ctx, px, py, 5, col.s[2]);
    dot(ctx, cx, py, 6, col.s[0]);
    // x-t trace
    const x0 = cx + R + 30, x1 = W - 12, span = 8;
    line(ctx, [[x0, cy], [x1, cy]], col.muted, 1);
    const pts = []; const t0 = Math.max(0, t - span);
    for (let i = 0; i <= 200; i++) { const tt = t0 + ((t - t0) * i) / 200; pts.push([x1 - ((t - tt) / span) * (x1 - x0), cy - x(tt) * k]); }
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[cx, py], [x1, py]], col.line, 1, [2, 4]);
    text(ctx, 'x', x0 - 12, cy - R, { color: col.muted, size: 11 });
    text(ctx, '← time (newest at right)', x0, cy + R + 14, { color: col.muted, size: 10 });
    // energy bars (fractions of the starting total ½kA²)
    const E0 = A * A, KE = (Math.pow(amp(t) * Math.cos(ang), 2)), PE = Math.pow(x(t), 2), bw = Math.min(150, W * 0.35), by = H - 18;
    ctx.fillStyle = col.s[1]; ctx.fillRect(12, by, (bw * KE) / E0, 10);
    ctx.fillStyle = col.s[3]; ctx.fillRect(12 + (bw * KE) / E0, by, (bw * PE) / E0, 10);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(12, by, bw, 10);
    text(ctx, 'kinetic | potential energy', 12, by - 8, { color: col.muted, size: 10 });
  };
  cv.redraw(); show();
}
