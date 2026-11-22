// A block on a spring, and what x, v and a look like as it moves. The three curves are drawn in step with the block, each
// scaled to its own maximum: v is a quarter-period ahead of x, and a is always opposite to x (a = -w² x). Bars show kinetic
// and potential energy swapping while the total stays at kA²/2. Change k, m and the amplitude.
import { canvas, axes, line, dot, text, title, arrow, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  let k = 20, m = 0.5, A = 0.1, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A spring and block with position, velocity and acceleration graphs and energy bars' });
  const ctl = row(host);
  slider(ctl, { label: 'Spring k', min: 5, max: 80, step: 1, value: k, fmt: (v) => `${v} N/m`, oninput: (v) => { k = v; upd(); } });
  slider(ctl, { label: 'Mass', min: 0.1, max: 2, step: 0.05, value: m, fmt: (v) => `${v} kg`, oninput: (v) => { m = v; upd(); } });
  slider(ctl, { label: 'Amplitude', min: 0.02, max: 0.15, step: 0.01, value: A, fmt: (v) => `${(v * 100).toFixed(0)} cm`, oninput: (v) => { A = v; upd(); } });
  const lp = loop(host, (dt) => { t += dt * 0.8; upd(); }); const c2 = row(host); lp.button(c2);
  const out = readout(host);
  function upd() {
    const w = Math.sqrt(k / m), x = A * Math.cos(w * t), v = -A * w * Math.sin(w * t), a = -w * w * x;
    out.innerHTML = `ω = √(k/m) = ${w.toFixed(2)} rad/s, period T = 2π/ω = <b>${(2 * Math.PI / w).toFixed(2)} s</b> (animation at 0.8× speed). Now x = ${(x * 100).toFixed(1)} cm, v = ${v.toFixed(2)} m/s, a = ${a.toFixed(2)} m/s². KE ${(0.5 * m * v * v).toFixed(3)} J + PE ${(0.5 * k * x * x).toFixed(3)} J = ${(0.5 * k * A * A).toFixed(3)} J.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const om = Math.sqrt(k / m), P = (2 * Math.PI) / om, x = A * Math.cos(om * t), v = -A * om * Math.sin(om * t), a = -om * om * x;
    title(ctx, 'Spring-block SHM: x, v and a', col);
    // spring and block
    const wy = 62, wl = 14, cx = w / 2, sc = (w * 0.34) / 0.15, bx = cx + x * sc, bw = 30;
    ctx.fillStyle = col.muted; ctx.fillRect(wl - 6, wy - 16, 6, 32);
    const turns = 12, x0 = wl, x1 = bx - bw / 2; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, wy);
    for (let i = 1; i < turns * 2; i++) ctx.lineTo(x0 + ((x1 - x0) * i) / (turns * 2), wy + (i % 2 ? -8 : 8)); ctx.lineTo(x1, wy); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx - bw / 2, wy - 14, bw, 28); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx - bw / 2, wy - 14, bw, 28);
    ctx.strokeStyle = col.line; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(cx, wy - 24); ctx.lineTo(cx, wy + 24); ctx.stroke(); ctx.setLineDash([]);
    arrow(ctx, bx, wy + 22, bx + (v / (A * om)) * 26, wy + 22, col.s[2], 2.5); arrow(ctx, bx, wy - 22, bx + (a / (A * om * om)) * 26, wy - 22, col.s[3], 2.5);
    text(ctx, 'v', bx + 4, wy + 34, { color: col.s[2], size: 10, weight: 700 }); text(ctx, 'a', bx + 4, wy - 34, { color: col.s[3], size: 10, weight: 700 });
    // graphs
    const gy = 104; ctx.save(); ctx.translate(0, gy);
    const G = axes(ctx, w, h * 0.5, col, { x: [-2 * P, 0], y: [-1.15, 1.15], xlabel: 'time (s), now at right', ylabel: 'scaled', t: 6, b: 32, l: 38, yt: [-1, 0, 1], fx: (q) => q.toFixed(1), xt: [-2 * P, -P, 0] });
    const mk = (f, c) => { const pts = []; for (let i = 0; i <= 200; i++) { const q = -2 * P + (2 * P * i) / 200; pts.push([G.X(q), G.Y(f(q + t))]); } line(ctx, pts, c, 2.2); };
    mk((q) => Math.cos(om * q), col.s[0]); mk((q) => -Math.sin(om * q), col.s[2]); mk((q) => -Math.cos(om * q), col.s[3]);
    dot(ctx, G.X(0), G.Y(x / A), 5, col.s[0], col.panel); dot(ctx, G.X(0), G.Y(v / (A * om)), 5, col.s[2], col.panel); dot(ctx, G.X(0), G.Y(a / (A * om * om)), 5, col.s[3], col.panel);
    ctx.restore();
    // energy bars
    const E = 0.5 * k * A * A, ke = 0.5 * m * v * v, pe = 0.5 * k * x * x, by = gy + h * 0.5 + 8, bwid = w - 30;
    ctx.fillStyle = col.line; ctx.fillRect(14, by, bwid, 16);
    ctx.fillStyle = col.s[2]; ctx.fillRect(14, by, (bwid * ke) / E, 16); ctx.fillStyle = col.s[1]; ctx.fillRect(14 + (bwid * ke) / E, by, (bwid * pe) / E, 16);
    text(ctx, 'x', w / 2 - 30, by + 28, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'v', w / 2, by + 28, { color: col.s[2], size: 12, weight: 700 }); text(ctx, 'a', w / 2 + 30, by + 28, { color: col.s[3], size: 12, weight: 700 });
    text(ctx, 'kinetic', 18, by + 28, { color: col.s[2], size: 11, weight: 600 }); text(ctx, 'potential', w - 16, by + 28, { color: col.s[1], size: 11, weight: 600, align: 'right' });
  };
  upd();
}
