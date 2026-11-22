// Class 9 Surface Area and Volume (step player): a combined solid, a capsule = cylinder (r = 3, h = 8) with a hemisphere at each end.
// Volume: add the parts. Surface: add only the parts you can touch (the joins are inside and do not count).
import { canvas, text, title } from '../../kit.js';
import { ell, seg, note } from './c9-vol-lib.js';

const N = ['A medicine capsule: a cylinder with a half-sphere (hemisphere) fixed at each end. Here r = 3 cm and the cylinder part is 8 cm long.', 'Split it into three simple solids: one cylinder and two hemispheres.', 'Two hemispheres of the same radius make one sphere: volume 4⁄3 πr³ = 4⁄3 × π × 27 = 36π cm³.', 'Cylinder: πr²h = π × 9 × 8 = 72π cm³. Total volume = 72π + 36π = 108π ≈ 339 cm³.', 'Surface: only the outside counts. Cylinder side 2πrh = 48π, plus sphere 4πr² = 36π: total 84π ≈ 264 cm². The joined circles are inside, so they are not counted.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A capsule split into a cylinder and two hemispheres' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A capsule: cylinder + 2 hemispheres', col), r = Math.min(w * 0.1, 34), L = Math.min(w * 0.4, 150), cy = top + (h - top - 66) / 2 + 6;
    const gap = s === 1 ? 18 : s === 2 ? 40 : 0, cx = w / 2;
    const cyl = (x0) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fillRect(x0, cy - r, L, 2 * r); ctx.globalAlpha = 1; seg(ctx, x0, cy - r, x0 + L, cy - r, col.s[0], 2.5); seg(ctx, x0, cy + r, x0 + L, cy + r, col.s[0], 2.5); };
    const hemi = (x, dir, c) => { const a0 = dir > 0 ? -Math.PI / 2 : Math.PI / 2; ctx.beginPath(); ctx.arc(x, cy, r, a0, a0 + Math.PI, false); ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, cy, r, a0, a0 + Math.PI, false); ctx.stroke(); };
    const x0 = cx - L / 2;
    if (s === 2) { // the two hemispheres together make a sphere
      ell(ctx, cx, cy - r * 1.6, r, r, col.s[1], col.s[1], 0.3, 2.5); text(ctx, 'sphere', cx + r + 8, cy - r * 1.6, { color: col.s[1], size: 11, weight: 700 });
      cyl(x0); } else { cyl(x0); hemi(x0 - gap, -1, col.s[1]); hemi(x0 + L + gap, 1, col.s[1]); }
    if (s >= 3 || s === 0) { seg(ctx, x0, cy + r + 12, x0 + L, cy + r + 12, col.ink, 1.5); text(ctx, 'h = 8', cx, cy + r + 24, { color: col.ink, size: 11, weight: 700, align: 'center' }); seg(ctx, x0 - r - gap, cy, x0 - gap, cy, col.ink, 1.3, [3, 3]); text(ctx, 'r = 3', x0 - gap - r / 2, cy - 10, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); }
    if (s === 1) { text(ctx, 'hemisphere', x0 - gap - r * 0.9, cy - r - 8, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'cylinder', cx, cy, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'hemisphere', x0 + L + gap + r * 0.9, cy - r - 8, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); }
    if (s === 3) text(ctx, 'V = 72π + 36π = 108π cm³', cx, cy - r - 24, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    if (s === 4) text(ctx, 'S = 48π + 36π = 84π cm²', cx, cy - r - 24, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col, text);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
