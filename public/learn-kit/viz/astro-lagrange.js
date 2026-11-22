// Lagrange points in the frame that turns with two big bodies (a star and a planet). The shading is the effective
// potential; the five marked points are where gravity and the turning-frame forces balance. Choose the mass ratio and release
// a test particle: at L4 and L5 it circles in a stable "tadpole" when the planet is under 3.85% of the total, but near L1
// and L2 it drifts away. Real use: L2 holds JWST, Trojan asteroids sit at Jupiter's L4 and L5.
import { canvas, text, row, slider, button, readout, loop, title, dot, line, choice } from '../kit.js';

export default function (host) {
  let mu = 0.01, p = null, trail = [], speedUp = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Effective potential of two bodies with five Lagrange points and a released test particle' });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Planet share of the mass', min: 0.001, max: 0.4, value: mu, log: true, fmt: (v) => `${(v * 100).toFixed(v < 0.01 ? 2 : 1)}%`, oninput: (v) => { mu = v; p = null; trail = []; cache = null; show(); } });
  [['Release near L4', 'L4'], ['near L1', 'L1'], ['near L2', 'L2']].forEach(([n, k]) => button(c2, n, () => release(k)));
  const anim = loop(host, (dt) => { if (p) { for (let i = 0; i < 10; i++) step(dt / 10 * 2); cv.redraw(); } });
  anim.button(c2);
  const out = readout(host);
  const fx = (x) => { const r1 = Math.abs(x + mu), r2 = Math.abs(x - 1 + mu); return x - (1 - mu) * (x + mu) / r1 ** 3 - mu * (x - 1 + mu) / r2 ** 3; };
  const root = (a, b) => { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; (fx(a) * fx(m) <= 0) ? (b = m) : (a = m); } return (a + b) / 2; };
  const pts = () => ({ L1: [root(-mu + 0.02 + (1 - 0.04) * 0.001, 1 - mu - 0.0005), 0], L2: [root(1 - mu + 0.0005, 2.5), 0], L3: [root(-2.5, -mu - 0.0005), 0], L4: [0.5 - mu, Math.sqrt(3) / 2], L5: [0.5 - mu, -Math.sqrt(3) / 2] });
  const acc = (x, y, vx, vy) => { const r1 = Math.hypot(x + mu, y) ** 3, r2 = Math.hypot(x - 1 + mu, y) ** 3; return [2 * vy + x - (1 - mu) * (x + mu) / r1 - mu * (x - 1 + mu) / r2, -2 * vx + y - (1 - mu) * y / r1 - mu * y / r2]; };
  function step(dt) { const f = (s) => { const a = acc(...s); return [s[2], s[3], a[0], a[1]]; }, add = (s, k, h) => s.map((v, i) => v + k[i] * h); const k1 = f(p), k2 = f(add(p, k1, dt / 2)), k3 = f(add(p, k2, dt / 2)), k4 = f(add(p, k3, dt)); p = p.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); trail.push([p[0], p[1]]); if (trail.length > 900) trail.shift(); if (Math.hypot(p[0], p[1]) > 4) { p = null; } }
  function release(k) { const L = pts()[k], d = k === 'L4' ? 0.03 : 0.004; p = [L[0] + d, L[1] + d * 0.4, 0, 0]; trail = []; show(); }
  const show = () => {
    out.innerHTML = `Mass ratio μ = <b>${mu.toFixed(3)}</b>. L4 and L5 are stable only if μ &lt; 0.0385 (this is <b>${mu < 0.0385 ? 'true' : 'false'}</b> now). The Sun-Earth system has μ = 0.000003, Sun-Jupiter 0.001, Earth-Moon 0.012: all stable. L1, L2 and L3 are unstable: a spacecraft there needs small corrections, but sits steady relative to Earth (L2 is 1.5 million km beyond Earth).`;
    cv.redraw();
  };
  let cache = null;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Rotating frame: bodies stay fixed on the x axis', col);
    const cx = w / 2, cy = h / 2 + 8, sc = Math.min(w, h) * 0.32, X = (x) => cx + x * sc, Y = (y) => cy - y * sc;
    // potential bands
    const cell = 5, phi = (x, y) => -(1 - mu) / Math.hypot(x + mu, y) - mu / Math.hypot(x - 1 + mu, y) - 0.5 * (x * x + y * y);
    const lvl = (v) => Math.floor((Math.max(-2.2, Math.min(-1.3, v)) + 2.2) / 0.9 * 9);
    ctx.save(); ctx.globalAlpha = 0.2;
    for (let px = 0; px < w; px += cell) for (let py = 0; py < h; py += cell) { const l = lvl(phi((px + cell / 2 - cx) / sc, -(py + cell / 2 - cy) / sc)); if (l % 2 === 0) { ctx.fillStyle = col.s[0]; ctx.fillRect(px, py, cell, cell); } }
    ctx.restore();
    const L = pts(); Object.entries(L).forEach(([k, q]) => { dot(ctx, X(q[0]), Y(q[1]), 4, col.s[5]); text(ctx, k, X(q[0]) + 7, Y(q[1]) - 7, { color: col.ink, size: 11, weight: 700 }); });
    dot(ctx, X(-mu), Y(0), 9, col.s[1]); dot(ctx, X(1 - mu), Y(0), 4 + 8 * Math.cbrt(mu), col.s[2]); text(ctx, 'star', X(-mu), Y(0) + 20, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'planet', X(1 - mu), Y(0) + 18, { color: col.muted, size: 10, align: 'center' });
    if (trail.length > 1) line(ctx, trail.map((q) => [X(q[0]), Y(q[1])]), col.ink, 1.5);
    if (p) dot(ctx, X(p[0]), Y(p[1]), 4, col.bad);
    else if (trail.length) text(ctx, 'particle escaped', cx, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  show();
}
