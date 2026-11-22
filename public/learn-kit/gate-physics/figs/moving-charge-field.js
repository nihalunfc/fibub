// 3.10 The field of a uniformly moving charge. Left: straight field lines from the present position; lines spaced
// evenly in the rest frame are squeezed towards the perpendicular plane because lengths along the motion contract
// (tan θ = γ tan θ₀). Right: E/E_Coulomb against angle θ from the velocity, (1 − β²)/(1 − β² sin²θ)^(3/2).
import { canvas, axes, line, dot, text, row, slider, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 300, label: 'Field lines of a moving charge and a graph of field strength against angle' });
  let beta = 0.8;
  const ctl = row(host);
  slider(ctl, { label: 'Speed β = v/c', min: 0, max: 0.98, step: 0.01, value: beta, fmt: (v) => fmt(v, 2), oninput: (v) => { beta = v; upd(); } });
  const out = readout(host);
  const upd = () => {
    const g = 1 / Math.sqrt(1 - beta * beta), b2 = beta * beta, x = b2 > 0 ? (1 - Math.pow(1 - b2, 2 / 3)) / b2 : NaN;
    out.innerHTML = `γ = ${fmt(g, 3)}: field across the motion is <b>${fmt(g, 3)}×</b> Coulomb, along it <b>${fmt(1 / (g * g), 3)}×</b>; ratio γ³ = ${fmt(g ** 3, 3)}.` + (beta > 0.01 ? ` It equals the Coulomb value at θ = ${fmt((Math.asin(Math.sqrt(x)) * 180) / Math.PI, 3)}°.` : '') + ' The magnetic field is B = v × E / c², circling the line of motion.';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const g = 1 / Math.sqrt(1 - beta * beta);
    title(ctx, 'Moving charge: field lines and strength', col);
    const half = w < 520 ? w : w * 0.5;
    const stack = w < 520, lw = stack ? w : half, lh = stack ? h * 0.5 : h;
    const cx = lw / 2, cy = stack ? 40 + (lh - 40) / 2 : h / 2 + 10, R = Math.min(lw * 0.42, (lh - 50) * 0.5);
    const N = 24;
    for (let i = 0; i < N; i++) {
      const t0 = ((i + 0.5) / N) * 2 * Math.PI, t = Math.atan2(Math.sin(t0) * g, Math.cos(t0));
      line(ctx, [[cx + 6 * Math.cos(t), cy - 6 * Math.sin(t)], [cx + R * Math.cos(t), cy - R * Math.sin(t)]], col.s[0], 1.6);
    }
    dot(ctx, cx, cy, 6, col.s[1], col.panel);
    line(ctx, [[cx + 12, cy + R * 0.85], [cx + 48, cy + R * 0.85]], col.ink, 2);
    text(ctx, 'v →', cx + 52, cy + R * 0.85, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    // graph
    const gx = stack ? 0 : half, gy = stack ? lh : 0;
    ctx.save(); ctx.translate(gx, gy);
    const ymax = Math.max(1.2, g * 1.1);
    const ax = axes(ctx, stack ? w : w - half, stack ? h - lh : h, col, { x: [0, 90], y: [0, ymax], t: stack ? 14 : 40, xlabel: 'angle from v (degrees)', ylabel: 'E / Coulomb', fy: (v) => fmt(v, 2) });
    line(ctx, [[ax.X(0), ax.Y(1)], [ax.X(90), ax.Y(1)]], col.muted, 1, [4, 4]);
    const pts = []; for (let t = 0; t <= 90; t += 0.5) { const s2 = Math.sin((t * Math.PI) / 180) ** 2; pts.push([ax.X(t), ax.Y((1 - beta * beta) / Math.pow(1 - beta * beta * s2, 1.5))]); }
    line(ctx, pts, col.s[0], 3);
    ctx.restore();
  };
  upd();
}
