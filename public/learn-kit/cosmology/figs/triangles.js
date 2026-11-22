// 5.4 The shape of space, in four steps: (1) flat: a triangle's angles add to 180° and parallel lines stay
// apart; (2) closed, like a ball's surface: angles add to more than 180° and "parallel" lines meet;
// (3) open, like a saddle: angles add to less than 180° and lines spread apart; (4) the test on the sky: the
// same-sized hot spots in the cosmic microwave background would look bigger in a closed universe and smaller
// in an open one. Planck sees them at the flat size, about 1°.
import { canvas, text, title, line, dot, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 280, label: 'Triangles on flat, curved-in and saddle-shaped surfaces, and spot sizes on the sky' });
  let step = 0;
  const tri = (ctx, pts, col, bulge) => {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % 3];
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, cx = pts.reduce((s, p) => s + p[0], 0) / 3, cy = pts.reduce((s, p) => s + p[1], 0) / 3;
      const qx = mx + (mx - cx) * bulge, qy = my + (my - cy) * bulge;
      if (i === 0) ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(qx, qy, x1, y1);
    }
    ctx.stroke(); ctx.restore();
  };
  const r = rng(4), spots = Array.from({ length: 18 }, () => [r(), r()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Flat: angles add to 180°', 'Closed (like a ball): more than 180°', 'Open (like a saddle): less than 180°', 'The test: how big do hot spots look?'][step], col) + 6;
    const cx = w / 2, cy = (top + h) / 2, R = Math.min(w * 0.36, (h - top) * 0.42);
    if (step === 0) {
      ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(cx - R * 1.3, cy + R * 0.7); ctx.lineTo(cx + R * 0.9, cy + R * 0.7); ctx.lineTo(cx + R * 1.3, cy - R * 0.7); ctx.lineTo(cx - R * 0.9, cy - R * 0.7); ctx.closePath(); ctx.fill();
      tri(ctx, [[cx - R * 0.6, cy + R * 0.4], [cx + R * 0.6, cy + R * 0.4], [cx, cy - R * 0.5]], col.s[0], 0);
      text(ctx, '60° + 60° + 60° = 180°', cx, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    } else if (step === 1) {
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.15, R, R * 0.28, 0, 0, Math.PI); ctx.strokeStyle = col.line; ctx.stroke();
      // a triangle with three right angles: pole and two points on the equator
      tri(ctx, [[cx, cy - R * 0.98], [cx - R * 0.62, cy + R * 0.38], [cx + R * 0.62, cy + R * 0.38]], col.s[3], 0.35);
      text(ctx, 'from the pole to the equator and back: 90° + 90° + 90° = 270°', cx, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    } else if (step === 2) {
      // a saddle drawn as curved lines
      for (let i = -3; i <= 3; i++) {
        const pts = []; for (let u = -1; u <= 1.001; u += 0.05) pts.push([cx + u * R * 1.3, cy + i * R * 0.18 + (u * u) * R * 0.25 * (i / 3) - u * u * R * 0.15]);
        line(ctx, pts, col.line, 1);
      }
      tri(ctx, [[cx - R * 0.7, cy + R * 0.35], [cx + R * 0.7, cy + R * 0.35], [cx, cy - R * 0.55]], col.s[1], -0.3);
      text(ctx, 'the sides curve inwards: angles add to less than 180°', cx, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    } else {
      const bw = (w - 40) / 3;
      ['closed: look bigger', 'flat: about 1°', 'open: look smaller'].forEach((lab, i) => {
        const x0 = 10 + i * (bw + 10), y0 = top + 6, hh = h - top - 40, size = [1.6, 1, 0.55][i];
        ctx.fillStyle = 'rgba(60,120,200,0.25)'; ctx.fillRect(x0, y0, bw, hh);
        spots.forEach(([u, v]) => { ctx.beginPath(); ctx.arc(x0 + 10 + u * (bw - 20), y0 + 10 + v * (hh - 20), Math.max(2, bw * 0.045 * size), 0, Math.PI * 2); ctx.fillStyle = 'rgba(230,110,40,0.75)'; ctx.fill(); });
        text(ctx, lab, x0 + bw / 2, h - 18, { color: i === 1 ? col.ink : col.muted, size: 11.5, weight: 700, align: 'center' });
      });
    }
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
