// Class 9 Science, Chapter 4: a ball released on a smooth ramp. Along the slope, a = g·sinθ (for a ball that slides without
// friction), so a steeper ramp gives a bigger acceleration. Dots are left every 0.2 s: they spread out because the speed
// keeps growing, and the speed-time graph is a straight line whose slope is a.
import { canvas, text, title, line, dot, arrow, row, slider, button, loop, readout } from '../../kit.js';

export default function (host) {
  let th = 20, t = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A ball rolling down a ramp with dots every 0.2 seconds and a speed-time graph' });
  const ctl = row(host);
  slider(ctl, { label: 'Ramp angle', min: 5, max: 45, step: 1, value: th, fmt: (v) => `${v}°`, oninput: (v) => { th = v; t = 0; hold = 0; } });
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) t = 0; } else { t += dt * 0.8; if (t >= T()) { t = T(); hold = 1.4; } } show(); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Release again', () => { t = 0; hold = 0; });
  const out = readout(host);
  const g = 9.8, Ln = 2.0, A = () => g * Math.sin(th * Math.PI / 180), T = () => Math.sqrt(2 * Ln / A());
  const show = () => { out.innerHTML = `a = g sinθ = <b>${A().toFixed(2)} m/s²</b>. At t = ${t.toFixed(2)} s: speed <b>${(A() * t).toFixed(2)} m/s</b>, distance down the ramp ${(0.5 * A() * t * t).toFixed(2)} m of ${Ln} m.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A ball on a smooth ramp', col) + 8, a = th * Math.PI / 180;
    const rh = (h - top) * 0.52, bx = 24, rw = Math.min(w - 60, rh / Math.max(0.3, Math.tan(a)));
    const len = Math.hypot(rw, rw * Math.tan(a)), sc = len / Ln, y0 = top + 10;
    const A0 = [bx, y0], B0 = [bx + rw, y0 + rw * Math.tan(a)];
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.lineTo(B0[0], B0[1]); ctx.lineTo(A0[0], B0[1]); ctx.closePath(); ctx.fill();
    line(ctx, [A0, B0, [A0[0], B0[1]], A0], col.ink, 2);
    const P = (s) => [A0[0] + (s / Ln) * rw, A0[1] + (s / Ln) * rw * Math.tan(a)];
    const nrm = [-Math.sin(a), -Math.cos(a)];
    for (let k = 0; k * 0.2 <= t + 1e-9; k++) { const s = 0.5 * A() * (k * 0.2) ** 2, p = P(s); dot(ctx, p[0] + nrm[0] * 12, p[1] + nrm[1] * 12 + 0, 2.8, col.s[1]); }
    const p = P(0.5 * A() * t * t); dot(ctx, p[0] + nrm[0] * 9, p[1] + nrm[1] * 9, 8, col.s[0], col.ink);
    text(ctx, `${th}°`, B0[0] - 30, B0[1] - 5, { color: col.muted, size: 11, align: 'right' });
    // v-t graph
    const gy = B0[1] + 36, gh = h - gy - 32, gx = 50, gw = w - gx - 20, vmax = A() * T(), Tm = T();
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
    text(ctx, 'speed v (m/s)', gx, gy - 9, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, 'time t (s)', gx + gw / 2, h - 8, { color: col.ink, size: 10.5, weight: 600, align: 'center' });
    text(ctx, vmax.toFixed(1), gx - 4, gy + 5, { color: col.muted, size: 10, align: 'right' }); text(ctx, '0', gx - 4, gy + gh, { color: col.muted, size: 10, align: 'right' }); text(ctx, Tm.toFixed(2), gx + gw, gy + gh + 11, { color: col.muted, size: 10, align: 'right' });
    line(ctx, [[gx, gy + gh], [gx + (t / Tm) * gw, gy + gh - (t / Tm) * gh]], col.s[2], 3); dot(ctx, gx + (t / Tm) * gw, gy + gh - (t / Tm) * gh, 4.5, col.s[2], col.panel);
    text(ctx, 'steeper ramp: steeper line, larger a', gx + 6, gy + 12, { color: col.muted, size: 10 });
  };
  show(); cv.redraw();
}
