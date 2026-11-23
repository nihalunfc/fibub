// Class 11 Oscillations: the spring-mass system. T = 2 pi sqrt(m / k). Two identical springs of stiffness k: in parallel the stiffness doubles (k_eff = 2k, each
// takes half the force), in series it halves (k_eff = k/2, each stretches by the same force so the total stretch doubles). Heavier mass: slower. Stiffer: faster.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let m = 0.5, k = 80, mode = 1, t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 280, label: 'A block on one spring, two springs in series or two springs in parallel, oscillating' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Springs', [[1, 'One'], [0.5, 'Two in series'], [2, 'Two in parallel']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'mass m (kg)', min: 0.1, max: 2, step: 0.1, value: m, fmt: (v) => v.toFixed(1), oninput: (v) => { m = v; go(); } });
  slider(ctl, { label: 'each spring k (N/m)', min: 20, max: 200, step: 10, value: k, fmt: (v) => v.toFixed(0), oninput: (v) => { k = v; go(); } });
  const Tp = () => 2 * Math.PI * Math.sqrt(m / (k * mode));
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const go = () => { ro.innerHTML = `k<sub>eff</sub> = <b>${(k * mode).toFixed(0)} N/m</b>.  T = 2π√(m/k<sub>eff</sub>) = <b>${Tp().toFixed(2)} s</b>, f = ${(1 / Tp()).toFixed(2)} Hz. Quadruple the mass: T doubles.`; cv.redraw(); };
  const zig = (ctx, x0, x1, y, c, n = 10, a = 8) => { const p = [[x0, y]]; for (let i = 1; i < n; i++) p.push([x0 + (x1 - x0) * i / n, y + (i % 2 ? -a : a)]); p.push([x1, y]); line(ctx, p, c, 2); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'T = 2π √(m / k_eff)', col);
    const cy = top + (h - top) / 2 - 8, wl = 18, A = (w - 110) * 0.17, ph = 2 * Math.PI * t / Tp(), x = Math.sin(ph) * A, bw = 24 + 30 * Math.sqrt(m / 2), cx = w * 0.62 + x;
    ctx.fillStyle = col.ink; ctx.fillRect(wl - 7, cy - 50, 7, 100);
    line(ctx, [[wl, cy + 30 + bw * 0.4], [w - 12, cy + 30 + bw * 0.4]], col.line, 1.5);
    const bx = cx - bw / 2;
    if (mode === 1) zig(ctx, wl, bx, cy, col.s[3]);
    else if (mode === 2) { zig(ctx, wl, bx, cy - 24, col.s[3]); zig(ctx, wl, bx, cy + 24, col.s[3]); line(ctx, [[bx, cy - 24], [bx, cy + 24]], col.s[3], 2); }
    else { const mid = wl + (bx - wl) / 2; zig(ctx, wl, mid, cy, col.s[3], 6); zig(ctx, mid, bx, cy, col.s[2], 6); }
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, cy - bw / 2, bw, bw); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, cy - bw / 2, bw, bw);
    text(ctx, `${m.toFixed(1)} kg`, cx, cy, { color: col.panel, size: 11, weight: 700, align: 'center' });
    line(ctx, [[w * 0.62, cy + bw / 2 + 4], [w * 0.62, cy + bw / 2 + 18]], col.muted, 1.5);
    text(ctx, mode === 1 ? 'one spring: k' : mode === 2 ? 'series: 1/k_eff = 1/k + 1/k' : 'parallel: k_eff = k + k', w / 2, h - 12, { color: col.muted, size: 11.5, align: 'center', weight: 700 });
  };
  go();
}
