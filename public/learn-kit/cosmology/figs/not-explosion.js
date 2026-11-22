// 4.4 Explosion or expansion? Four steps: (1) an explosion: debris flies from one centre into empty space,
// with an edge; (2) expansion: galaxies fill all of space (beyond the frame too) and every gap grows, with no
// centre and no edge; (3) the balloon picture: dots on the rubber surface spread apart, and the middle of the
// balloon is not on the surface at all; (4) running time backwards: the same patch of space gets denser and
// hotter everywhere at once, it does not shrink to a point inside a bigger empty room.
import { canvas, text, title, dot, arrow, loop, rng, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'An explosion from a centre compared with space expanding everywhere' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  const r = rng(11);
  const deb = Array.from({ length: 60 }, () => ({ a: r() * Math.PI * 2, s: 0.3 + r() * 0.7 }));
  const grid = [];
  for (let i = -8; i <= 8; i++) for (let j = -6; j <= 6; j++) grid.push([i + (r() - 0.5) * 0.5, j + (r() - 0.5) * 0.5]);
  const balloon = Array.from({ length: 22 }, () => { const q = Math.sqrt(r()) * 0.9, a = r() * Math.PI * 2; return [q * Math.cos(a), q * Math.sin(a)]; });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['An explosion: one centre, an edge, empty space', 'Expansion: space itself stretches, everywhere', 'The balloon: a 2-D picture of it', 'Run it backwards: dense everywhere, not a point'][step], col) + 6;
    const cx = w / 2, cy = (top + h) / 2 + 6;
    const k = calm() ? 1 : Math.min(1, t / 4);
    if (step === 0) {
      ctx.fillStyle = col.soft; ctx.fillRect(10, top, w - 20, h - top - 10);
      const R = Math.min(w, h) * 0.42 * k;
      deb.forEach((d) => dot(ctx, cx + Math.cos(d.a) * d.s * R, cy + Math.sin(d.a) * d.s * R * 0.85, 3.5, col.s[1]));
      dot(ctx, cx, cy, 5, col.bad || col.s[3]);
      text(ctx, 'centre', cx, cy + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.soft });
      text(ctx, 'empty space around it', 20, h - 20, { color: col.muted, size: 11.5 });
      if (k > 0.3) arrow(ctx, cx + R * 0.95, cy, cx + R * 0.95 + 26, cy, col.ink, 1.5, 6);
      if (k > 0.3) text(ctx, 'edge', cx + R * 0.95 + 30, cy - 12, { color: col.ink, size: 11.5, weight: 600 });
    } else if (step === 1 || step === 3) {
      // step 1: grows from 1 to 1.8; step 3: shrinks from 1.8 to 0.45, the frame always full
      const a = step === 1 ? 1 + 0.8 * k : 1.8 - 1.35 * k, S = Math.min(w, h) / 9;
      if (step === 3) { ctx.fillStyle = `rgba(255,120,40,${0.35 * k})`; ctx.fillRect(0, top, w, h - top); }
      grid.forEach(([x, y]) => {
        const px = cx + x * a * S, py = cy + y * a * S;
        if (px > -5 && px < w + 5 && py > top + 22 && py < h - 28) dot(ctx, px, py, 3.5, col.ink);
      });
      text(ctx, step === 1 ? `every gap is ${a.toFixed(2)}× bigger · no centre · no edge` : `every gap is ${a.toFixed(2)}× today's · denser and hotter everywhere`, cx, h - 12, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
      text(ctx, 'galaxies carry on past the frame →', w - 10, top + 8, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    } else {
      const R = Math.min(w, h - top - 40) * (0.24 + 0.16 * k);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
      balloon.forEach(([x, y]) => dot(ctx, cx + R * x, cy + R * y, 3.5, col.s[0])); // the front of the balloon
      dot(ctx, cx, cy, 2, col.muted);
      text(ctx, 'the middle is not on the surface', cx, cy + R + 16, { color: col.muted, size: 11.5, align: 'center' });
      text(ctx, 'dots (galaxies) live only on the rubber', cx, top + 8, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
    }
  };
  cv.redraw(); anim.play();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
