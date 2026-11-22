// Laws of motion: a block on a rough incline. Tilt the slope and change the friction coefficients; the forces
// on the block (weight, normal force, friction) are drawn to scale, and the block either stays put (static
// friction just balances mg sin θ) or slides with a = g(sin θ − μk cos θ). It starts to slip when tan θ = μs.
import { canvas, arrow, line, text, row, slider, readout, loop } from '../../kit.js';

const G = 9.8;
export default function (host) {
  let deg = 20, ms = 0.5, mk = 0.4, m = 2, s = 0, v = 0;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 260, label: 'A block on a rough slope with its weight, normal force and friction drawn as arrows' });
  const ctl = row(host);
  const re = () => { s = 0; v = 0; cv.redraw(); show(); };
  slider(ctl, { label: 'Slope θ', min: 0, max: 60, step: 1, value: deg, fmt: (x) => `${x}°`, oninput: (x) => { deg = x; re(); } });
  slider(ctl, { label: 'μs (static)', min: 0, max: 1, step: 0.05, value: ms, fmt: (x) => x.toFixed(2), oninput: (x) => { ms = x; if (mk > ms) mk = ms; re(); } });
  slider(ctl, { label: 'μk (kinetic)', min: 0, max: 1, step: 0.05, value: mk, fmt: (x) => x.toFixed(2), oninput: (x) => { mk = Math.min(x, ms); re(); } });
  const anim = loop(host, (dt) => { const a = acc(); if (a > 0) { v += a * dt; s += v * dt * 12; if (s > 140) { s = 0; v = 0; } } cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const th = () => (deg * Math.PI) / 180;
  const slides = () => Math.tan(th()) > ms + 1e-9;
  const acc = () => (slides() ? G * (Math.sin(th()) - mk * Math.cos(th())) : 0);
  const show = () => {
    const W = m * G, along = W * Math.sin(th()), N = W * Math.cos(th());
    const repose = (Math.atan(ms) * 180) / Math.PI;
    out.innerHTML = `Pull down the slope mg sin θ = ${along.toFixed(1)} N. Normal force N = ${N.toFixed(1)} N, so the most static friction can give is μs N = ${(ms * N).toFixed(1)} N. ` +
      (slides() ? `It is not enough: the block <b>slides</b> with a = g(sin θ − μk cos θ) = <b>${acc().toFixed(2)} m/s²</b>.` : `Enough: static friction is just <b>${along.toFixed(1)} N</b> (not μs N) and the block stays at rest.`) +
      ` Angle of repose = tan⁻¹ μs = ${repose.toFixed(1)}°.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const t = th(), x0 = 30, y0 = h - 30, L = Math.min(w - 60, (h - 60) / Math.max(0.3, Math.sin(t)) );
    const x1 = x0 + L * Math.cos(t), y1 = y0 - L * Math.sin(t);
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
    line(ctx, [[x0, y0], [x1, y1]], col.ink, 2); line(ctx, [[x0 - 10, y0], [w - 10, y0]], col.muted, 1);
    // block position along the slope, measured down from the top
    const along = Math.min(L * 0.35 + s, L * 0.85), bx = x1 - along * Math.cos(t), by = y1 + along * Math.sin(t), b = 34;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-t); ctx.fillStyle = col.s[3]; ctx.fillRect(-b / 2, -b, b, b); ctx.restore();
    const cx = bx - (b / 2) * Math.sin(t), cy = by - (b / 2) * Math.cos(t), k = 2.4, W = m * G;
    arrow(ctx, cx, cy, cx, cy + W * k, col.s[0], 2.5);
    text(ctx, 'mg', cx + 6, cy + W * k, { color: col.s[0], size: 12, weight: 600 });
    const N = W * Math.cos(t), nx = -Math.sin(t), ny = -Math.cos(t);
    arrow(ctx, cx, cy, cx + nx * N * k, cy + ny * N * k, col.s[1], 2.5);
    text(ctx, 'N', cx + nx * N * k - 14, cy + ny * N * k, { color: col.s[1], size: 12, weight: 600 });
    const f = slides() ? mk * N : W * Math.sin(t), ux = Math.cos(t), uy = -Math.sin(t); // up the slope
    if (f > 0.05) { arrow(ctx, bx, by, bx + ux * f * k, by + uy * f * k, col.s[2], 2.5); text(ctx, slides() ? 'f = μk N' : 'f (static)', bx + ux * f * k + 4, by + uy * f * k - 10, { color: col.s[2], size: 11, weight: 600 }); }
    text(ctx, `θ = ${deg}°`, x1 - 50, y0 - 12, { color: col.muted, size: 11 });
    text(ctx, slides() ? 'Sliding' : 'At rest', 10, 14, { color: slides() ? col.bad || col.ink : col.good || col.ink, size: 13, weight: 700 });
  };
  cv.redraw(); show();
}
