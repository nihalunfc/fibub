// 3.1 Why the speed of light broke the old rules, in four steps: (1) on a train, speeds add; (2) light from
// a torch on the train still arrives at c; (3) Michelson and Morley (1887) found no change in light's speed
// in any direction; (4) Einstein: if speed is fixed, time and length must give way. Speeds are rounded.
import { canvas, text, title, line, dot, arrow, ease, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.56, max: 360, min: 240, label: 'Adding speeds on a train, light from a torch, and the Michelson-Morley experiment' });
  let step = 0, k = 1, t = 0;
  const anim = loop(host, (dt) => { t += dt; if (k < 1) k = Math.min(1, k + dt * 0.7); cv.redraw(); }, { autoplay: false });
  const train = (ctx, x, y, w, col) => {
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, 34);
    for (let i = 1; i < 4; i++) ctx.strokeRect(x + i * w / 4 - 16, y + 8, 12, 12);
    dot(ctx, x + 14, y + 38, 5, col.muted); dot(ctx, x + w - 14, y + 38, 5, col.muted);
  };
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k), ground = h * 0.62;
    if (step <= 1) {
      line(ctx, [[0, ground + 44], [w, ground + 44]], col.line, 2);
      const tw = Math.min(200, w * 0.45), tx = 10 + ((t * 30) % (w * 0.25));
      train(ctx, tx, ground, tw, col);
      arrow(ctx, tx + tw / 2 - 30, ground - 18, tx + tw / 2 + 30, ground - 18, col.muted, 2);
      text(ctx, 'train: 30 m/s', tx + tw / 2, ground - 32, { color: col.ink, size: 12, align: 'center', halo: col.panel });
      const sx = tx + tw - 20, sy = ground + 16;
      if (step === 0) {
        const bx = sx + 10 + e * (w - sx - 40);
        dot(ctx, bx, sy, 6, col.s[1]);
        text(ctx, 'ball thrown forward at 10 m/s', w - 10, 48, { color: col.ink, size: 12.5, weight: 600, align: 'right' });
        text(ctx, 'someone on the ground sees 30 + 10 = 40 m/s', w - 10, 68, { color: col.ink, size: 12.5, weight: 700, align: 'right' });
      } else {
        const bx = sx + 10 + e * (w - sx - 30);
        line(ctx, [[sx + 6, sy], [bx, sy]], col.s[3], 3);
        text(ctx, 'torch on the train shines forward', w - 10, 48, { color: col.ink, size: 12.5, weight: 600, align: 'right' });
        text(ctx, 'ground measures c, not c + 30 m/s', w - 10, 68, { color: col.ink, size: 12.5, weight: 700, align: 'right' });
        text(ctx, 'c = 299,792,458 m/s for everyone', w - 10, 88, { color: col.muted, size: 12, align: 'right' });
      }
    } else if (step === 2) {
      const cx = w * 0.42, cy = h * 0.55, L = Math.min(w * 0.32, 150);
      dot(ctx, cx - L, cy, 6, col.s[3]); text(ctx, 'lamp', cx - L, cy + 18, { color: col.muted, size: 11, align: 'center' });
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 4); ctx.fillStyle = col.muted; ctx.fillRect(-14, -2, 28, 4); ctx.restore();
      text(ctx, 'half mirror', cx - 12, cy - 16, { color: col.muted, size: 11, align: 'right' });
      ctx.fillStyle = col.ink; ctx.fillRect(cx + L, cy - 14, 4, 28); ctx.fillRect(cx - 14, cy - L * 0.7, 28, 4);
      const ph = (t * 0.6) % 1;
      line(ctx, [[cx - L, cy], [cx + L, cy]], col.s[0], 1.5, [5, 4]);
      line(ctx, [[cx, cy], [cx, cy - L * 0.7]], col.s[2], 1.5, [5, 4]);
      line(ctx, [[cx, cy], [cx, cy + 50]], col.muted, 1.5, [5, 4]);
      dot(ctx, cx + (ph < 0.5 ? ph * 2 : 2 - ph * 2) * L, cy, 4, col.s[0]);
      dot(ctx, cx, cy - (ph < 0.5 ? ph * 2 : 2 - ph * 2) * L * 0.7, 4, col.s[2]);
      text(ctx, 'detector', cx, cy + 62, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'arm along Earth\'s motion', cx + 16, cy + 16, { color: col.ink, size: 11, halo: col.panel });
      text(ctx, 'arm across it', cx + 10, cy - L * 0.35, { color: col.ink, size: 11, halo: col.panel });
      text(ctx, 'Expected: one arm slower. Found (1887): no difference at all.', 10, h - 14, { color: col.ink, size: 12.5, weight: 700 });
    } else {
      const cx = w / 2;
      text(ctx, 'speed = distance ÷ time', cx, h * 0.3, { color: col.ink, size: 18, weight: 700, align: 'center' });
      text(ctx, 'If the speed of light is fixed for everyone…', cx, h * 0.45, { color: col.ink, size: 13.5, align: 'center' });
      text(ctx, '…then distance and time must change instead.', cx, h * 0.55, { color: col.ink, size: 13.5, weight: 700, align: 'center' });
      const r = 22, x1 = cx - 60, y1 = h * 0.76;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x1, y1, r, 0, Math.PI * 2); ctx.stroke();
      const a = t * (calm() ? 0 : 1.2);
      line(ctx, [[x1, y1], [x1 + r * 0.8 * Math.sin(a), y1 - r * 0.8 * Math.cos(a)]], col.s[0], 2);
      text(ctx, 'time', x1, y1 + r + 12, { color: col.muted, size: 11, align: 'center' });
      const rl = 70 * (1 - 0.25 * (0.5 + 0.5 * Math.sin(t * 1.2)) * (calm() ? 0 : 1));
      ctx.fillStyle = col.s[2]; ctx.fillRect(cx + 30, y1 - 6, rl, 12);
      text(ctx, 'length', cx + 30 + 35, y1 + r + 12, { color: col.muted, size: 11, align: 'center' });
    }
    title(ctx, ['Speeds add up… usually', 'But light does not add up', 'Michelson and Morley, 1887', 'Einstein, 1905'][step], col);
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; t = 0; cv.redraw(); anim.play(); } };
}
