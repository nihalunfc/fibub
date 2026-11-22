// 2.1 A bead on a hoop that spins about its vertical diameter. Left: the hoop (seen from the side, turning) with the
// bead moved by the Euler-Lagrange equation θ'' = sinθ(ω² cosθ − g/R) − (small friction)θ'. Right: the effective
// potential U(θ) = −cosθ − ½(ω²R/g) sin²θ (in units of mgR) with the bead's position on it. Time unit √(R/g).
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'A bead on a spinning hoop and its effective potential' });
  let w = 1.6, th = 0.5, om = 0, phi = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Spin ω in units of √(g/R)', min: 0, max: 3, step: 0.01, value: w, fmt: (x) => fmt(x, 3), oninput: (x) => { w = x; show(); cv.redraw(); } });
  const out = readout(host);
  const U = (t) => -Math.cos(t) - 0.5 * w * w * Math.sin(t) ** 2;
  const show = () => {
    if (w <= 1) {
      out.innerHTML = `ω² = ${fmt(w * w, 3)} g/R is below g/R: the bottom is the only stable point. Small oscillations there have angular frequency √(g/R − ω²) = <b>${fmt(Math.sqrt(1 - w * w), 3)}</b> √(g/R).`;
    } else {
      const t0 = Math.acos(1 / (w * w));
      out.innerHTML = `ω² = ${fmt(w * w, 3)} g/R is above g/R: the bottom has become a hump of U. The bead settles at cos θ₀ = g/(ω²R), θ₀ = <b>${fmt(t0 * 180 / Math.PI, 3)}°</b>, where it oscillates at ω sin θ₀ = <b>${fmt(w * Math.sin(t0), 3)}</b> √(g/R).`;
    }
  };
  cv.draw = (ctx, W, H, col) => {
    const split = W * 0.42;
    title(ctx, 'Bead on a spinning hoop', col);
    const cx = split / 2, cy = H / 2 + 12, R = Math.min(split * 0.42, H * 0.36);
    const c = Math.cos(phi);
    line(ctx, [[cx, cy - R - 18], [cx, cy + R + 18]], col.muted, 1, [4, 4]);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(1, R * Math.abs(c)), R, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    const bx = cx + R * Math.sin(th) * c, by = cy + R * Math.cos(th);
    line(ctx, [[cx, cy], [bx, by]], col.line, 1);
    dot(ctx, bx, by, 7, col.s[0]);
    text(ctx, 'θ from the bottom', cx, cy + R + 30, { color: col.muted, size: 11, align: 'center' });
    // effective potential
    ctx.save(); ctx.translate(split, 0);
    const ax = axes(ctx, W - split, H, col, { x: [-Math.PI, Math.PI], y: [-1.6, 1.4], xlabel: 'θ', ylabel: 'U / mgR', t: 30, l: 46,
      xt: [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI], fx: (v) => ({ [-Math.PI]: '−π', [-Math.PI / 2]: '−π/2', 0: '0', [Math.PI / 2]: 'π/2', [Math.PI]: 'π' }[v] ?? '') });
    ctx.save(); ax.clip();
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.02) pts.push([ax.X(t), ax.Y(U(t))]);
    line(ctx, pts, col.s[3], 2.5);
    dot(ctx, ax.X(((th + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI), ax.Y(U(th)), 6, col.s[0]);
    ctx.restore(); ctx.restore();
    text(ctx, 'effective potential', split + 52, 40, { color: col.muted, size: 11 });
  };
  const anim = loop(host, (dt) => {
    const n = 20, h = (dt * 4) / n;
    for (let i = 0; i < n; i++) {
      const a = Math.sin(th) * (w * w * Math.cos(th) - 1) - 0.08 * om;
      om += a * h; th += om * h;
    }
    phi += dt * 4 * w;
    cv.redraw();
  });
  anim.button(ctl);
  cv.redraw(); show();
}
