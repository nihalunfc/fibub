// 1.2 Ancient pictures of the universe, step by step: the Babylonian dome, the Greek nested spheres,
// Aristarchus's Sun-centred idea, Aryabhata's spinning Earth and the Tusi couple from the Maragha observatory.
// Schematic drawings, not to scale.
import { canvas, text, line, dot, loop, title as head } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Ancient models of the universe, one at a time' });
  let step = 0, t = 0;
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ring = (ctx, x, y, r, c, w = 1, dash) => { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = c; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 10, R = Math.min(w, h) * 0.4;
    const title = (s) => head(ctx, s, col);
    if (step === 0) {
      title('Babylon (about 1000 BCE): a flat Earth under a solid dome');
      ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.45, R, R * 0.16, 0, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.45, R * 1.02, R * 1.2, 0, Math.PI, 0); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < 14; i++) { const a = Math.PI + (i + 0.5) / 14 * Math.PI, x = cx + Math.cos(a) * R * 0.9, y = cy + R * 0.45 + Math.sin(a) * R * 1.05; dot(ctx, x, y, 1.8, col.ink); }
      text(ctx, 'stars fixed on the dome', cx, cy - R * 0.6, { color: col.muted, size: 11.5, align: 'center', halo: col.panel });
      text(ctx, 'Earth: a flat disc with waters around it', cx, cy + R * 0.45, { color: col.ink, size: 11.5, align: 'center' });
      text(ctx, 'But Babylonians kept careful records of planets for centuries.', 10, h - 10, { color: col.muted, size: 11 });
    } else if (step === 1) {
      title('Greece (Aristotle, 350 BCE; Ptolemy, 150 CE): nested spheres');
      const names = ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn', 'Stars'];
      names.forEach((n, i) => {
        const r = R * (0.22 + i * 0.11);
        ring(ctx, cx, cy, r, i === 7 ? col.ink : col.line, i === 7 ? 2 : 1);
        const a = t * (0.6 / (i + 1)) + i * 0.9;
        if (i < 7) dot(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), i === 3 ? 5 : 3, i === 3 ? col.s[3] : col.s[i % 8]);
        if (i % 2 === 1 || i === 7) text(ctx, n, cx + r + 2, cy, { color: col.muted, size: 10, halo: col.panel });
      });
      dot(ctx, cx, cy, R * 0.12, col.s[0]);
      text(ctx, 'Earth, round and still', cx, cy + R * 0.12 + 10, { color: col.ink, size: 11, weight: 600, align: 'center', halo: col.panel });
    } else if (step === 2) {
      title('Aristarchus (about 270 BCE): the Sun in the middle');
      ring(ctx, cx, cy, R * 0.5, col.line); ring(ctx, cx, cy, R * 0.85, col.line);
      dot(ctx, cx, cy, 10, col.s[3]);
      const a = t * 0.8;
      dot(ctx, cx + R * 0.5 * Math.cos(a), cy + R * 0.5 * Math.sin(a), 5, col.s[0]);
      text(ctx, 'Earth', cx + R * 0.5 * Math.cos(a) + 8, cy + R * 0.5 * Math.sin(a), { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'His shadow measurements said the Sun is far bigger than Earth,', 10, h - 26, { color: col.muted, size: 11 });
      text(ctx, 'so he put it in the middle. Almost nobody followed him for 1,800 years.', 10, h - 10, { color: col.muted, size: 11 });
    } else if (step === 3) {
      title('Aryabhata (India, 499 CE): the Earth spins, the stars stand still');
      ring(ctx, cx, cy, R * 0.95, col.line);
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dot(ctx, cx + R * 0.95 * Math.cos(a), cy + R * 0.95 * Math.sin(a), 2, col.ink); }
      const a = t * 1.2, r = R * 0.3;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
      const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
      dot(ctx, px, py, 4, col.s[1]);
      line(ctx, [[px, py], [cx + (r + R * 0.6) * Math.cos(a), cy + (r + R * 0.6) * Math.sin(a)]], col.s[1], 1, [3, 3]);
      text(ctx, 'like a person in a boat who sees the bank move backwards', cx, h - 10, { color: col.muted, size: 11, align: 'center' });
    } else {
      title('Nasir al-Din al-Tusi (Maragha, 1247): two circles make a straight line');
      const Rb = R * 0.8, rs = Rb / 2, a = t * 0.9;
      ring(ctx, cx, cy, Rb, col.muted, 1.5);
      const sx = cx + rs * Math.cos(a), sy = cy + rs * Math.sin(a);
      ring(ctx, sx, sy, rs, col.s[0], 1.5);
      // a point on the small circle turning twice as fast the other way moves along a diameter
      const px = sx + rs * Math.cos(-a), py = sy + rs * Math.sin(-a);
      line(ctx, [[cx - Rb, cy], [cx + Rb, cy]], col.s[1], 1, [4, 4]);
      dot(ctx, px, py, 6, col.s[1]);
      text(ctx, 'Copernicus later used the same trick', cx, h - 10, { color: col.muted, size: 11, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = i; cv.redraw(); } };
}
