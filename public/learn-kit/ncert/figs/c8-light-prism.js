// Class 8 Light: dispersion of white light by a glass prism. Each colour bends by a slightly different amount (violet most, red least),
// so a white beam fans out into a spectrum. The apex angle is 60 degrees; the refractive indices (1.50 red to 1.56 violet) are a little
// larger than for real glass so that the spread is easy to see. Rays are traced with Snell's law at both faces.
import { canvas, text, title, line, arrow, row, slider, readout } from '../../kit.js';

const COL = [['red', '#e53935', 1.5], ['orange', '#fb8c00', 1.515], ['yellow', '#fdd835', 1.53], ['green', '#43a047', 1.54], ['blue', '#1e88e5', 1.55], ['indigo', '#3949ab', 1.555], ['violet', '#8e24aa', 1.56]];
export default function (host) {
  let inc = 50;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 270, label: 'White light splitting into seven colours in a glass prism' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle of incidence', min: 35, max: 70, step: 1, value: inc, fmt: (v) => `${v}°`, oninput: (v) => { inc = v; say(); } });
  const out = readout(host);
  const D = Math.PI / 180;
  const dev = (n) => { const r1 = Math.asin(Math.sin(inc * D) / n), r2 = 60 * D - r1, k = n * Math.sin(r2); return k > 1 ? null : inc + Math.asin(k) / D - 60; };
  const say = () => { const dr = dev(1.5), dv = dev(1.56); out.innerHTML = `Red bends by ${dr.toFixed(1)}°, violet by ${dv.toFixed(1)}°: violet is bent the most, so the white beam <b>spreads ${(dv - dr).toFixed(1)}° into a spectrum</b> (VIBGYOR). A rainbow is the same thing done by raindrops.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A prism splits white light', col);
    const sz = Math.min(w * 0.34, h * 0.5), cx = w * 0.4, by = h * 0.58, H = sz * 0.866, apex = [cx, by - H], BL = [cx - sz / 2, by], BR = [cx + sz / 2, by];
    ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...apex); ctx.lineTo(...BR); ctx.lineTo(...BL); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    const M = [(apex[0] + BL[0]) / 2, (apex[1] + BL[1]) / 2], d0 = (-30 + inc) * D, sx = w - 22;
    const L0 = Math.min(M[0] - 12, 0.45 * w);
    arrow(ctx, M[0] - Math.cos(d0) * L0, M[1] - Math.sin(d0) * L0 * -1 * -1, M[0], M[1], col.ink, 3, 9);
    // screen
    line(ctx, [[sx, h * 0.15], [sx, h * 0.9]], col.muted, 3);
    COL.forEach(([nm, c, n]) => {
      const r1 = Math.asin(Math.sin(inc * D) / n), d1 = (-30 * D) + r1 * 1, r2 = 60 * D - r1, k = n * Math.sin(r2); if (k > 1) return;
      // inside ray from M along d1 (y down: angles measured with y up, so flip y)
      const dir1 = [Math.cos(d1), -Math.sin(d1)], A = apex, B = BR;
      // intersect with right face A->B: M + s*dir1 = A + u*(B-A)
      const ex = B[0] - A[0], ey = B[1] - A[1], det = dir1[0] * -ey - dir1[1] * -ex, qx = A[0] - M[0], qy = A[1] - M[1];
      const sP = (qx * -ey - qy * -ex) / det, P = [M[0] + sP * dir1[0], M[1] + sP * dir1[1]];
      const d2 = (30 * D) - Math.asin(k), dir2 = [Math.cos(d2), -Math.sin(d2)], T = (sx - P[0]) / dir2[0];
      line(ctx, [M, P], c, 1.6); line(ctx, [P, [sx, P[1] + dir2[1] * T]], c, 2.4);
    });
    text(ctx, 'white light', 12, M[1] - Math.sin(d0) * -L0 * 0 + 34, { color: col.muted, size: 10.5 });
    text(ctx, 'screen', sx, h * 0.12, { color: col.muted, size: 10.5, align: 'right' });
  };
  say();
}
