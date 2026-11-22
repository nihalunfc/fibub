// 7.1 Real and reciprocal lattice in 2D. Left: the direct lattice with a1, a2 and its primitive cell. Right: the
// reciprocal lattice with b1, b2 and the first four Brillouin zones, coloured by counting how many Bragg lines
// (perpendicular bisectors of G) separate each point from the origin. Change the lattice shape and watch b1 stay
// perpendicular to a2, the reciprocal turn by 30 degrees for the hexagonal lattice, and every zone keep the same area.
import { canvas, row, slider, choice, readout, line, dot, arrow, text, fmt } from '../../kit.js';

const D = Math.PI / 180;

export default function (host) {
  const cv = canvas(host, { aspect: 0.56, max: 420, min: 240, label: 'A 2D lattice beside its reciprocal lattice with the first four Brillouin zones coloured' });
  let kind = 'square', ratio = 1, gam = 75;
  const ctl = row(host);
  const out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Lattice', [['square', 'Square'], ['rect', 'Rectangular'], ['hex', 'Hexagonal'], ['obl', 'Oblique']], kind, (v) => { kind = v; re(); });
  slider(ctl, { label: '|a₂|/|a₁| (rect., oblique)', min: 0.5, max: 2, step: 0.05, value: ratio, fmt: (v) => fmt(v, 3), oninput: (v) => { ratio = v; re(); } });
  slider(ctl, { label: 'Angle γ (oblique)', min: 45, max: 90, step: 1, value: 75, fmt: (v) => v + '°', oninput: (v) => { gam = v; re(); } });
  const vecs = () => {
    const r = kind === 'square' || kind === 'hex' ? 1 : ratio, g = kind === 'obl' ? gam : kind === 'hex' ? 60 : 90;
    const a1 = [1, 0], a2 = [r * Math.cos(g * D), r * Math.sin(g * D)];
    const A = a1[0] * a2[1] - a1[1] * a2[0];
    const b1 = [2 * Math.PI * a2[1] / A, -2 * Math.PI * a2[0] / A], b2 = [-2 * Math.PI * a1[1] / A, 2 * Math.PI * a1[0] / A];
    return { a1, a2, b1, b2, A };
  };
  const show = () => {
    const { b1, b2, A } = vecs(), l1 = Math.hypot(...b1), l2 = Math.hypot(...b2);
    const ang = Math.acos((b1[0] * b2[0] + b1[1] * b2[1]) / (l1 * l2)) / D;
    out.innerHTML = `With |a₁| = 1: |b₁| = ${fmt(l1, 3)}, |b₂| = ${fmt(l2, 3)}, angle between b₁ and b₂ = ${fmt(ang, 3)}°. Cell area ${fmt(A, 3)}, so every Brillouin zone has area (2π)²/A = <b>${fmt(4 * Math.PI * Math.PI / A, 4)}</b>. b₁ ⟂ a₂ and b₂ ⟂ a₁ always.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const { a1, a2, b1, b2 } = vecs();
    const half = W / 2, top = 26;
    text(ctx, 'Direct lattice', 10, 14, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'Reciprocal lattice and zones', half + 8, 14, { color: col.ink, size: 12, weight: 700, fit: false });
    line(ctx, [[half, top - 6], [half, H - 4]], col.line, 1);
    // ---- direct lattice ----
    const cx = half / 2, cy = (H + top) / 2, s = Math.min(half, H - top) / 5.2;
    const P = (x, y) => [cx + x * s, cy - y * s];
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, half - 1, H - top); ctx.clip();
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0];
    ctx.beginPath(); [[0, 0], a1, [a1[0] + a2[0], a1[1] + a2[1]], a2].forEach(([x, y], i) => { const [px, py] = P(x, y); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = -8; i <= 8; i++) for (let j = -8; j <= 8; j++) { const [px, py] = P(i * a1[0] + j * a2[0], i * a1[1] + j * a2[1]); if (px > -5 && px < half + 5 && py > top - 5 && py < H + 5) dot(ctx, px, py, 3, col.ink); }
    arrow(ctx, ...P(0, 0), ...P(...a1), col.s[0], 2.5); arrow(ctx, ...P(0, 0), ...P(...a2), col.s[1], 2.5);
    text(ctx, 'a₁', P(...a1)[0] + 4, P(...a1)[1] + 10, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'a₂', P(...a2)[0] + 4, P(...a2)[1] - 8, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    ctx.restore();
    // ---- reciprocal lattice with zones ----
    const bmin = Math.min(Math.hypot(...b1), Math.hypot(...b2));
    const rx = half + half / 2, ry = cy, t = Math.min(half, H - top) / (4.6 * bmin);
    const Gs = []; for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) if (i || j) Gs.push([i * b1[0] + j * b2[0], i * b1[1] + j * b2[1]]);
    const zcol = [col.s[0], col.s[2], col.s[3], col.s[4]];
    ctx.save(); ctx.beginPath(); ctx.rect(half + 1, top, half - 1, H - top); ctx.clip();
    const st = 3;
    for (let px = half + 1; px < W; px += st) for (let py = top; py < H; py += st) {
      const kx = (px + st / 2 - rx) / t, ky = (ry - py - st / 2) / t, k2 = kx * kx + ky * ky;
      let n = 0; for (const [gx, gy] of Gs) { if ((kx - gx) ** 2 + (ky - gy) ** 2 < k2) { n++; if (n > 3) break; } }
      if (n <= 3) { ctx.globalAlpha = n === 0 ? 0.45 : 0.3 - n * 0.05; ctx.fillStyle = zcol[n]; ctx.fillRect(px, py, st, st); }
    }
    ctx.globalAlpha = 1;
    for (const [gx, gy] of [[0, 0], ...Gs]) { const px = rx + gx * t, py = ry - gy * t; if (px > half && px < W && py > top && py < H) dot(ctx, px, py, 3, col.ink); }
    arrow(ctx, rx, ry, rx + b1[0] * t, ry - b1[1] * t, col.s[5] || col.ink, 2.5); arrow(ctx, rx, ry, rx + b2[0] * t, ry - b2[1] * t, col.s[6] || col.ink, 2.5);
    text(ctx, 'b₁', rx + b1[0] * t + 4, ry - b1[1] * t + 10, { color: col.ink, size: 12, weight: 700, halo: col.panel, fit: false });
    text(ctx, 'b₂', rx + b2[0] * t + 4, ry - b2[1] * t - 8, { color: col.ink, size: 12, weight: 700, halo: col.panel, fit: false });
    ctx.restore();
    text(ctx, 'zones 1 · 2 · 3 · 4 (darker = lower)', half + 8, H - 10, { color: col.muted, size: 10.5, fit: false });
  };
  re();
}
