// Two skew lines in space and their common perpendicular, drawn in a turnable 3D view. Line 1 runs along the
// x-axis; line 2 sits a height h above it, turned by an angle φ. The short segment joining them at right angles to
// both is the shortest distance, |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|. At φ = 0 the lines are parallel.
import { canvas, line, dot, row, slider, readout, fmt, text } from '../../kit.js';

export default function (host) {
  let h = 2, phi = 50, shift = 1, yaw = 35, tilt = 20;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 260, label: 'Two skew lines in three dimensions with their shortest distance shown' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'gap h', min: 0, max: 3, step: 0.1, value: h, fmt: (v) => fmt(v, 2), oninput: (v) => { h = v; re(); } });
  slider(ctl, { label: 'angle φ (°)', min: 0, max: 90, step: 1, value: phi, fmt: (v) => `${v}°`, oninput: (v) => { phi = v; re(); } });
  slider(ctl, { label: 'slide line 2', min: -2, max: 2, step: 0.1, value: shift, fmt: (v) => fmt(v, 2), oninput: (v) => { shift = v; re(); } });
  slider(ctl, { label: 'turn view', min: -180, max: 180, step: 1, value: yaw, fmt: (v) => `${v}°`, oninput: (v) => { yaw = v; re(); } });
  slider(ctl, { label: 'tilt view', min: -10, max: 80, step: 1, value: tilt, fmt: (v) => `${v}°`, oninput: (v) => { tilt = v; re(); } });
  const out = readout(host);
  // line 1: (0,0,0) + λ(1,0,0); line 2: (shift, 0, h) + μ(cos φ, sin φ, 0)
  const show = () => {
    const p = (phi * Math.PI) / 180, s = Math.sin(p);
    const sd = s > 1e-9 ? Math.abs(h * s) / s : h; // (a₂ − a₁)·(b₁ × b₂) = h sin φ, |b₁ × b₂| = sin φ
    out.innerHTML = `a₁ = (0, 0, 0), b₁ = (1, 0, 0); a₂ = (${fmt(shift, 2)}, 0, ${fmt(h, 2)}), b₂ = (${fmt(Math.cos(p), 3)}, ${fmt(s, 3)}, 0). b₁ × b₂ = (0, 0, ${fmt(s, 3)}). ${s > 1e-9 ? `Shortest distance = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂| = <b>${fmt(sd, 3)}</b>, angle between the lines ${phi}°. Sliding line 2 in the direction of line 1 never changes it.` : `Parallel lines: distance = |(a₂ − a₁) × b|/|b| = <b>${fmt(h, 3)}</b>.`}${h === 0 && s > 1e-9 ? ' With h = 0 the lines meet (they are coplanar).' : ''}`;
  };
  cv.draw = (ctx, w, H, col) => {
    const y = (yaw * Math.PI) / 180, t = (tilt * Math.PI) / 180, S = Math.min(w, H) / 7.5, cx = w / 2, cy = H * 0.58;
    const P = ([X, Y, Z]) => { const x1 = X * Math.cos(y) - Y * Math.sin(y), y1 = X * Math.sin(y) + Y * Math.cos(y); const z2 = Z * Math.cos(t) - y1 * Math.sin(t); return [cx + x1 * S, cy - z2 * S]; };
    // axes
    [[[3, 0, 0], 'x'], [[0, 3, 0], 'y'], [[0, 0, 3], 'z']].forEach(([e, l]) => { line(ctx, [P([0, 0, 0]), P(e)], col.line, 1); const q = P(e); text(ctx, l, q[0] + 4, q[1], { color: col.muted, size: 11 }); });
    const p = (phi * Math.PI) / 180, b2 = [Math.cos(p), Math.sin(p), 0], a2 = [shift, 0, h];
    line(ctx, [P([-3.2, 0, 0]), P([3.2, 0, 0])], col.s[0], 2.5);
    line(ctx, [P(a2.map((v, i) => v - 3.2 * b2[i])), P(a2.map((v, i) => v + 3.2 * b2[i]))], col.s[3], 2.5);
    // feet of the common perpendicular: line 2 crosses the plane y = 0 at a₂, straight above (shift, 0, 0) on line 1
    const F1 = [shift, 0, 0], F2 = a2;
    line(ctx, [P(F1), P(F2)], col.s[1], 3);
    dot(ctx, ...P(F1), 4, col.s[1]); dot(ctx, ...P(F2), 4, col.s[1]);
    text(ctx, 'line 1', ...P([3.1, 0, -0.35]), { color: col.s[0], size: 11, halo: col.panel });
    text(ctx, 'line 2', ...P(a2.map((v, i) => v + 3.1 * b2[i] + (i === 2 ? 0.35 : 0))), { color: col.s[3], size: 11, halo: col.panel });
    text(ctx, 'shortest distance', ...P([F2[0] + 0.15, 0, h / 2]), { color: col.s[1], size: 11, halo: col.panel });
  };
  re();
}
