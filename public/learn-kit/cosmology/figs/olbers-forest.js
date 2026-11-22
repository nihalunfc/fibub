// 1.6 Olbers' paradox as a forest. You stand in the middle; stars are scattered evenly. Every sight line that
// hits a star is bright. If the forest were endless and light had forever to reach us, every line would end on
// a star and the whole sky would blaze. Because the universe has an age, light only reaches us from within a
// "light horizon", and most sight lines run out first: the night is dark.
import { canvas, text, line, dot, row, slider, readout, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 480, min: 300, label: 'A top-down view of stars around you, with sight lines' });
  const r = rng(3);
  let horizon = 0.2, density = 60;
  const stars = Array.from({ length: 2600 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, k: r() }));
  const ctl = row(host);
  const hs = slider(ctl, { label: 'How far light has had time to travel', min: 0.05, max: 1.4, step: 0.01, value: horizon, fmt: (v) => v >= 1.38 ? 'forever' : `${Math.round(v * 100)} units`, oninput: (v) => { horizon = v; cv.redraw(); } });
  slider(ctl, { label: 'How crowded the stars are', min: 20, max: 300, step: 10, value: density, fmt: (v) => String(v), oninput: (v) => { density = v; cv.redraw(); } });
  const out = readout(host);
  const N = 360;
  cv.draw = (ctx, w, h, col) => {
    const size = Math.min(w * 0.62, h - 20), cx = 10 + size / 2, cy = h / 2, s = size / 2;
    const inf = horizon >= 1.38, H = inf ? 5 : horizon;
    const use = stars.filter((st) => st.k < density / 600);
    const rad = 0.008;
    // light horizon
    ctx.save(); ctx.beginPath(); ctx.rect(cx - s, cy - s, 2 * s, 2 * s); ctx.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(cx - s, cy - s, 2 * s, 2 * s);
    if (!inf) { ctx.beginPath(); ctx.arc(cx, cy, H * s, 0, Math.PI * 2); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
    // sight lines
    let hits = 0;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
      let best = H;
      // "forever": the pattern of stars repeats in every direction (tiles 2 units wide), so sight lines can run far
      const reach = inf ? 2 : 0;
      for (let tx = -reach; tx <= reach; tx++) for (let ty = -reach; ty <= reach; ty++) {
        for (const st of use) {
          const sx = st.x + tx * 2, sy = st.y + ty * 2;
          const t = sx * dx + sy * dy;
          if (t <= 0 || t > best) continue;
          const px = sx - t * dx, py = sy - t * dy;
          if (px * px + py * py < rad * rad) best = t;
        }
      }
      const hit = best < H;
      if (hit) hits++;
      if (i % 3 === 0) line(ctx, [[cx, cy], [cx + dx * Math.min(best, 1.5) * s, cy + dy * Math.min(best, 1.5) * s]], hit ? col.s[3] : col.line, 1);
    }
    for (const st of use) {
      const d = Math.hypot(st.x, st.y);
      dot(ctx, cx + st.x * s, cy + st.y * s, 2.2, d < H ? col.ink : col.muted);
    }
    ctx.restore();
    dot(ctx, cx, cy, 4, col.s[0]);
    text(ctx, 'You', cx + 6, cy - 8, { color: col.ink, size: 11, weight: 600, halo: col.panel });
    // the sky you see: a ring of directions, bright where a line hits a star
    const bx = cx + s + 20, bw = w - bx - 12, frac = hits / N;
    text(ctx, 'Your sky', bx, 22, { color: col.ink, size: 12, weight: 600 });
    const bh = Math.min(bw, h - 80);
    ctx.fillStyle = '#000'; ctx.fillRect(bx, 34, bw, bh);
    ctx.globalAlpha = frac; ctx.fillStyle = '#ffdc7a'; ctx.fillRect(bx, 34, bw, bh); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.strokeRect(bx + 0.5, 34.5, bw, bh);
    text(ctx, `${Math.round(frac * 100)}% lit`, bx, 34 + bh + 16, { color: col.ink, size: 12, weight: 700 });
    out.innerHTML = inf
      ? `With stars going on forever and light having forever to arrive, <b>${Math.round(frac * 100)}%</b> of sight lines end on a star (and in a truly endless forest, all of them do). The sky would shine like the surface of the Sun.`
      : `Light has only had time to reach us from inside the dashed circle, so <b>${Math.round(frac * 100)}%</b> of sight lines end on a star. ${frac < 0.5 ? 'Most of the sky stays dark.' : 'The farther light can reach, the brighter the sky gets.'}`;
  };
  cv.redraw();
  return { step(i) { const v = [0.15, 0.4, 0.9, 1.4, 0.2][Math.min(i, 4)]; horizon = v; hs.set(v); cv.redraw(); } };
}
