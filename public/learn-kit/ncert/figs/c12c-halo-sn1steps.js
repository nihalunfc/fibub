// Class 12 Chemistry, Haloalkanes (step player): the SN1 mechanism for (R)-3-bromo-3-methylhexane-type tertiary halide, R3C-Br + H2O -> R3C-OH.
// Step 1 (slow, rate-determining): C-Br breaks, giving a flat carbocation. Step 2 (fast): the nucleophile attacks the flat cation from either face with equal chance, so a chiral halide gives
// a roughly 50:50 mixture of both mirror-image alcohols (racemisation). Energy profile: two humps with a valley (the carbocation) in between; the first hump is higher.
import { canvas, text, title, line, arrow, loop, lerp } from '../../kit.js';

const TT = ['Tertiary halide, tetrahedral C', 'Slow step: Br⁻ leaves', 'Flat carbocation (sp²)', 'Fast step: attack from either face', 'Two products, 50 : 50'];
const MK = [0, 0.18, 0.5, 0.8, 1];
export default function (host) {
  let step = 0, f = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 320, label: 'The SN1 mechanism with a flat carbocation and attack from both faces' });
  loop(host, (dt) => { const d = MK[step] - f; if (Math.abs(d) > 0.002) { f += d * Math.min(1, dt * 3); cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w / 2, cy = top + (h - top) * 0.3, L = Math.min(54, w * 0.15);
    const node = (x, y, s, fl, r = 14) => { ctx.fillStyle = fl; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); text(ctx, s, x, y, { color: col.panel, size: 10.5, weight: 700, align: 'center' }); };
    const flat = step >= 2, bend = flat ? 0 : (step === 1 ? 14 : 22), cat = step === 4 ? 0 : 1;
    if (step < 4) {
      const gs = [[-L, bend * 0.2 + 6], [L, bend * 0.2 + 6], [0, -bend * 0.3 - L * 0.2]];
      const lgx = step === 0 ? cx : step === 1 ? cx + L * 1.6 : cx + L * 2.2, lgy = step === 0 ? cy - L * 1.2 : cy - L * 1.2 + (step === 1 ? -10 : -26);
      if (step < 2) line(ctx, [[cx, cy], [lgx, lgy]], col.ink, 2.5);
      gs.forEach(([dx, dy]) => line(ctx, [[cx, cy], [cx + dx, cy + dy]], col.ink, 2.5)); gs.forEach(([dx, dy], i) => node(cx + dx, cy + dy, 'R' + (i + 1), col.s[3], 14));
      ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, 7); ctx.fill(); text(ctx, flat ? 'C⁺' : 'C', cx, cy, { color: col.panel, size: 11, weight: 700, align: 'center' });
      node(lgx, lgy, step >= 1 ? 'Br⁻' : 'Br', col.s[2], 16);
      if (flat) { ctx.setLineDash([4, 4]); line(ctx, [[cx - L * 1.4, cy + 6], [cx + L * 1.4, cy + 6]], col.muted, 1.2); ctx.setLineDash([]); text(ctx, 'planar: 120°, empty p orbital', cx, cy + L * 0.9 + 6, { color: col.muted, size: 10.5, align: 'center' }); }
      if (step === 3) { arrow(ctx, cx, cy - L * 1.7, cx, cy - 16, col.s[0], 2.5, 8); arrow(ctx, cx, cy + L * 1.9, cx, cy + 16, col.s[0], 2.5, 8); node(cx, cy - L * 1.95, 'OH₂', col.s[0], 17); node(cx, cy + L * 2.2, 'OH₂', col.s[0], 17); text(ctx, 'top face', cx + 36, cy - L * 1.6, { color: col.muted, size: 10.5 }); text(ctx, 'bottom face', cx + 40, cy + L * 1.7, { color: col.muted, size: 10.5 }); }
    } else {
      [-1, 1].forEach((s) => { const x = cx + s * w * 0.22; [[-L * 0.6, 8], [L * 0.6, 8], [0, -10]].forEach(([dx, dy]) => line(ctx, [[x, cy], [x + dx, cy + dy]], col.ink, 2.2)); [[-L * 0.6, 8, 'R1'], [L * 0.6, 8, 'R2'], [0, -10, 'R3']].forEach(([dx, dy, nm]) => node(x + dx, cy + dy + (dy < 0 ? -8 : 8), nm, col.s[3], 12)); node(x, cy + (s < 0 ? -L * 1.25 : L * 1.25), 'OH', col.s[0], 14); line(ctx, [[x, cy], [x, cy + (s < 0 ? -L * 1.25 : L * 1.25)]], col.ink, 2.2); ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x, cy, 9, 0, 7); ctx.fill(); });
      text(ctx, 'mirror images, 50 : 50 (racemic mixture)', cx, cy + L * 1.75, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
    // energy profile
    const px0 = 28, px1 = w - 20, py1 = h - 22, py0 = h - 22 - (h - top) * 0.26, X = (v) => px0 + v * (px1 - px0);
    const E = (v) => py1 - 8 - (py1 - py0) * (0.95 * Math.exp(-Math.pow((v - 0.25) / 0.1, 2)) + 0.6 * Math.exp(-Math.pow((v - 0.75) / 0.09, 2)) + 0.3 * Math.exp(-Math.pow((v - 0.5) / 0.14, 2)) - 0.18 * v);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px0, py0 - 8); ctx.lineTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 80; i++) { const v = i / 80; i ? ctx.lineTo(X(v), E(v)) : ctx.moveTo(X(v), E(v)); } ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(X(f), E(f), 5.5, 0, 7); ctx.fill();
    text(ctx, 'slow (rate-determining)', X(0.25), E(0.25) - 12, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'R⁺', X(0.5), E(0.5) + 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
