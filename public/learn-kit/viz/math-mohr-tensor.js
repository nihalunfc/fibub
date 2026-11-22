// A 2D stress (or any symmetric tensor) seen from rotated axes. The numbers σx, σy and τ change when you turn the
// axes by θ, but they always trace the Mohr circle: its centre is the average (σx + σy)/2 and its radius is
// √(((σx − σy)/2)² + τ²). The circle meets the horizontal axis at the principal values (no shear), and σx + σy (the
// trace) never changes. This is the eigenvalue picture of a symmetric matrix.
import { canvas, axes, row, slider, readout, line, dot, text } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let sx = 60, sy = 20, ta = 30, th = 25;
  const cv = canvas(host, { aspect: 0.72, max: 360, min: 260, label: 'A tilted square element and the Mohr circle' });
  const c = row(host), c2 = row(host);
  slider(c, { label: 'σx', min: -80, max: 80, step: 1, value: sx, fmt: (v) => v, oninput: (v) => { sx = v; re(); } }); slider(c, { label: 'σy', min: -80, max: 80, step: 1, value: sy, fmt: (v) => v, oninput: (v) => { sy = v; re(); } }); slider(c, { label: 'τ', min: -60, max: 60, step: 1, value: ta, fmt: (v) => v, oninput: (v) => { ta = v; re(); } });
  slider(c2, { label: 'axes turned by θ (°)', min: 0, max: 180, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; re(); } });
  const out = readout(host);
  const comp = (a) => { const t = (a * Math.PI) / 180, cc = Math.cos(t), s = Math.sin(t); return [sx * cc * cc + sy * s * s + 2 * ta * s * cc, sx * s * s + sy * cc * cc - 2 * ta * s * cc, (sy - sx) * s * cc + ta * (cc * cc - s * s)]; };
  function re() { cv.redraw(); const [a, b, tau] = comp(th), mid = (sx + sy) / 2, R = Math.hypot((sx - sy) / 2, ta), pth = (0.5 * Math.atan2(2 * ta, sx - sy) * 180) / Math.PI;
    out.innerHTML = `Rotated components: σx′ = <b>${f2(a, 1)}</b>, σy′ = <b>${f2(b, 1)}</b>, τ′ = <b>${f2(tau, 1)}</b>. Trace σx′ + σy′ = ${f2(a + b, 1)} = σx + σy = ${f2(sx + sy, 1)} (invariant). Principal values ${f2(mid + R, 1)} and ${f2(mid - R, 1)} at θ = ${f2(pth, 1)}°, where τ′ = 0; maximum shear = R = ${f2(R, 1)}.`; }
  cv.draw = (ctx, w, h, col) => {
    const mid = (sx + sy) / 2, R = Math.hypot((sx - sy) / 2, ta), ext = 110, half = (w - 12) * 0.38;
    // left: the element
    const cx0 = half / 2 + 8, cy0 = h / 2 + 6, s = half * 0.28, t = (th * Math.PI) / 180;
    ctx.save(); ctx.translate(cx0, cy0); line(ctx, [[-half * 0.45, 0], [half * 0.45, 0]], col.line, 1); line(ctx, [[0, -half * 0.45], [0, half * 0.45]], col.line, 1);
    ctx.rotate(-t); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.strokeRect(-s, -s, 2 * s, 2 * s); ctx.globalAlpha = 0.15; ctx.fillStyle = col.s[0]; ctx.fillRect(-s, -s, 2 * s, 2 * s); ctx.globalAlpha = 1;
    line(ctx, [[0, 0], [s * 1.5, 0]], col.s[1], 2.5); line(ctx, [[0, 0], [0, -s * 1.5]], col.s[2], 2.5); ctx.restore();
    text(ctx, "x′", cx0 + Math.cos(t) * s * 1.5 + 9 * Math.cos(t), cy0 - Math.sin(t) * s * 1.5 - 9 * Math.sin(t), { color: col.s[1], size: 12, weight: 700, align: 'center' }); text(ctx, "y′", cx0 - Math.sin(t) * s * 1.5 - 9 * Math.sin(t), cy0 - Math.cos(t) * s * 1.5 - 9 * Math.cos(t), { color: col.s[2], size: 12, weight: 700, align: 'center' });
    text(ctx, 'element, axes turned by θ', 8, 14, { color: col.muted, size: 10 });
    // right: Mohr circle (σ horizontal, τ vertical)
    const x0 = half + 24, pw = w - x0 - 8, ph = h - 44, sc = Math.min(pw, ph) / (2 * ext * 0.62), ox = x0 + pw / 2 - mid * sc, oy = 24 + ph / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, 20, pw, h - 28); ctx.clip();
    line(ctx, [[x0, oy], [x0 + pw, oy]], col.muted, 1); line(ctx, [[ox, 20], [ox, h - 8]], col.muted, 1);
    ctx.beginPath(); ctx.arc(ox + mid * sc, oy, R * sc, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
    const [a, b, tau] = comp(th), P1 = [ox + a * sc, oy - tau * sc], P2 = [ox + b * sc, oy + tau * sc];
    line(ctx, [P1, P2], col.s[1], 2); dot(ctx, ...P1, 6, col.s[1], col.ink); dot(ctx, ...P2, 6, col.s[2], col.ink); dot(ctx, ox + mid * sc, oy, 3, col.ink);
    [mid + R, mid - R].forEach((p) => dot(ctx, ox + p * sc, oy, 4, col.s[0])); ctx.restore();
    text(ctx, 'Mohr circle: σ →, τ ↑', x0 + 4, 14, { color: col.muted, size: 10 });
  };
  re();
}
