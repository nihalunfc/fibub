// Class 9 Science, Chapter 6 (step player): Newton's third law. Every force has a partner of equal size in the opposite direction on the
// OTHER body. Six steps: two spring balances, a skater pushing a wall, a swimmer pushing water, a balloon, a rocket,
// and why action and reaction never cancel (they act on different bodies). Colours: orange = force on object A, blue = force on B.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Pairs of equal and opposite forces on two different bodies in six everyday situations' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const T = ['Two spring balances pulling', 'Skater pushes the wall', 'Swimmer pushes water back', 'Balloon: air out, balloon forward', 'Rocket: gas down, rocket up', 'Why they never cancel'];
  const NOTE = [
    ['Each balance reads the same, 20 N.', 'A pulls B and B pulls A equally.'],
    ['She pushes the wall (force on wall →).', 'The wall pushes her back (force on her ←).'],
    ['Hands push water backwards.', 'Water pushes the swimmer forwards.'],
    ['The balloon pushes air out of the neck.', 'The air pushes the balloon the other way.'],
    ['The rocket throws hot gas down.', 'The gas pushes the rocket up. No air is needed.'],
    ['The pair acts on two different bodies.', 'Forces cancel only when on the same body.'],
  ];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, cy = top + (h - top - 70) / 2 + 10, cx = w / 2, A = col.s[1], B = col.s[0];
    const wob = Math.sin(t * 5) * 1.5;
    if (step === 0) {
      ctx.fillStyle = col.line; ctx.fillRect(cx - 80, cy - 12, 160, 24); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 80, cy - 12, 160, 24);
      text(ctx, '20 N', cx - 40, cy, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '20 N', cx + 40, cy, { color: col.ink, size: 12, weight: 700, align: 'center' });
      line(ctx, [[cx - 100, cy], [cx - 80, cy]], col.ink, 3); line(ctx, [[cx + 80, cy], [cx + 100, cy]], col.ink, 3);
      arrow(ctx, cx - 40, cy - 22, cx - 100, cy - 22, A, 4, 10); arrow(ctx, cx + 40, cy - 22, cx + 100, cy - 22, B, 4, 10);
      text(ctx, 'on A', cx - 70, cy - 36, { color: A, size: 11, weight: 700, align: 'center' }); text(ctx, 'on B', cx + 70, cy - 36, { color: B, size: 11, weight: 700, align: 'center' });
    } else if (step === 1) {
      ctx.fillStyle = col.line; ctx.fillRect(cx - 100, cy - 50, 14, 100); ctx.fillStyle = col.line; ctx.fillRect(cx - 120, cy + 50, 260, 6);
      const px = cx - 30 + Math.min(1, (t % 3) / 2) * 24; dot(ctx, px, cy - 28, 9, col.ink); line(ctx, [[px, cy - 19], [px, cy + 14]], col.ink, 4); line(ctx, [[px, cy - 8], [cx - 86, cy - 8]], col.ink, 3); line(ctx, [[px, cy + 14], [px - 8, cy + 48]], col.ink, 3); line(ctx, [[px, cy + 14], [px + 10, cy + 48]], col.ink, 3);
      arrow(ctx, cx - 84, cy - 30, cx - 112, cy - 30, A, 4, 9); text(ctx, 'on wall', cx - 100, cy - 42, { color: A, size: 10.5, weight: 700, align: 'center' });
      arrow(ctx, px - 14, cy - 8, px + 30, cy - 8, B, 4, 9); text(ctx, 'on her', px + 40, cy - 22, { color: B, size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'she rolls away on skates', cx + 60, cy + 40, { color: col.muted, size: 10.5, align: 'center' });
    } else if (step === 2) {
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(10, cy - 4, w - 20, 70); ctx.globalAlpha = 1; line(ctx, [[10, cy - 4], [w - 10, cy - 4]], col.s[0], 2);
      const sx = cx + 20 + Math.sin(t * 2) * 4; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.ellipse(sx, cy - 6, 34, 9, 0, 0, 7); ctx.fill(); dot(ctx, sx + 38, cy - 12, 8, col.ink);
      arrow(ctx, sx - 20, cy + 20, sx - 70, cy + 20, A, 4, 9); text(ctx, 'on water', sx - 46, cy + 8, { color: A, size: 10.5, weight: 700, align: 'center' });
      arrow(ctx, sx - 30, cy - 30, sx + 20, cy - 30, B, 4, 9); text(ctx, 'on swimmer', sx - 6, cy - 44, { color: B, size: 10.5, weight: 700, align: 'center' });
    } else if (step === 3) {
      const bx = cx + 20 + ((t % 2.4) / 2.4) * 30; ctx.fillStyle = A; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(bx, cy, 40, 26, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      for (let k = 0; k < 4; k++) { const s = ((t * 1.4 + k / 4) % 1); dot(ctx, bx - 42 - s * 60, cy + (k - 1.5) * 4, 2.5, col.muted); }
      arrow(ctx, bx - 44, cy - 20, bx - 90, cy - 20, A, 4, 9); text(ctx, 'on air', bx - 70, cy - 32, { color: A, size: 10.5, weight: 700, align: 'center' });
      arrow(ctx, bx + 10, cy - 34, bx + 52, cy - 34, B, 4, 9); text(ctx, 'on balloon', bx + 34, cy - 46, { color: B, size: 10.5, weight: 700, align: 'center' });
    } else if (step === 4) {
      const ry = cy - ((t % 3) / 3) * 18; ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(cx, ry - 54); ctx.lineTo(cx + 16, ry - 20); ctx.lineTo(cx + 16, ry + 26); ctx.lineTo(cx - 16, ry + 26); ctx.lineTo(cx - 16, ry - 20); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      for (let k = 0; k < 6; k++) { const s = ((t * 1.2 + k / 6) % 1); dot(ctx, cx + Math.sin(k * 2.1) * 8 * s, ry + 30 + s * 50, 3 - s * 1.5, col.warn); }
      arrow(ctx, cx + 30, ry + 30, cx + 30, ry + 80, A, 4, 9); text(ctx, 'on gas', cx + 36, ry + 56, { color: A, size: 10.5, weight: 700 });
      arrow(ctx, cx - 30, ry + 10, cx - 30, ry - 40, B, 4, 9); text(ctx, 'on rocket', cx - 36, ry - 14, { color: B, size: 10.5, weight: 700, align: 'right' });
    } else {
      ctx.fillStyle = col.line; ctx.fillRect(cx - 100, cy + 30, 200, 8); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.45; ctx.fillRect(cx - 24, cy - 10, 48, 40); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 24, cy - 10, 48, 40);
      text(ctx, 'book', cx + 6, cy + 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
      arrow(ctx, cx - 10, cy + 8, cx - 10, cy + 66, A, 3.5, 9);
      text(ctx, 'weight W (on book)', cx - 16, cy + 52, { color: A, size: 10.5, weight: 700, align: 'right' });
      arrow(ctx, cx + 12, cy + 30, cx + 12, cy - 38, B, 3.5, 9); text(ctx, 'table pushes up N (on book)', cx + 20, cy - 30, { color: B, size: 10.5, weight: 700 });
      text(ctx, 'W and N: both on the book, they balance.', cx, h - 74, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
      text(ctx, 'W’s true partner: book pulls the Earth up.', cx, h - 58, { color: col.muted, size: 11, align: 'center' });
    }
    NOTE[step].forEach((l, i) => text(ctx, l, 14, h - 40 + i * 17, { color: col.ink, size: 11.5, weight: i === 0 ? 700 : 400 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
