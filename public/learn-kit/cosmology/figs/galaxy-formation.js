// 10.6 How a galaxy like ours is built, bottom-up. A merger tree: time runs down the page. Small halos form first
// and merge, two by two, into bigger ones (hierarchical growth). Gas falls into each halo, is heated, and the part
// that can radiate its heat away cools, sinks and spins up into a disc, where stars form. Feedback (supernova
// winds in small galaxies, the central black hole in big ones) blows gas out and stops it all turning into stars.
// Times are rough: first mini-halos at z ≈ 20-30, a Milky Way-mass halo assembled by z ≈ 1.
import { canvas, text, title, line, dot, arrow, loop, calm, clamp } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.92, max: 480, min: 360, label: 'A merger tree: small dark matter halos merge into bigger ones over time, then gas cools into a disc and feedback blows some out' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  const levels = 5; // 16 → 8 → 4 → 2 → 1
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['First: many small halos', 'Small halos merge into bigger ones', 'Gas cools and sinks into a disc', 'Feedback: winds and jets push back'][step], col) + 6;
    const k = calm() ? 1 : clamp(t / 3, 0, 1);
    const treeB = step >= 2 ? top + (h - top) * 0.52 : h - 24;
    const L = 74, R = w - 14, rowY = (i) => top + 10 + (i / (levels - 1)) * (treeB - top - 22);
    const labels = ['z ≈ 20', 'z ≈ 10', 'z ≈ 5', 'z ≈ 2', 'z ≈ 1'];
    labels.forEach((s, i) => text(ctx, s, 8, rowY(i), { color: col.muted, size: 11 }));
    const xs = (lvl, j) => { const n = 16 >> lvl; return L + ((j + 0.5) / n) * (R - L); };
    const shown = step === 0 ? 0 : step === 1 ? k * (levels - 1) : levels - 1;
    for (let lvl = 0; lvl < levels; lvl++) {
      const n = 16 >> lvl;
      if (lvl > Math.ceil(shown)) break;
      const f = lvl <= Math.floor(shown) ? 1 : shown - Math.floor(shown);
      for (let j = 0; j < n; j++) {
        if (lvl > 0) {
          const y0 = rowY(lvl - 1), y1 = rowY(lvl), x1 = xs(lvl, j);
          for (const c of [2 * j, 2 * j + 1]) { const x0 = xs(lvl - 1, c); line(ctx, [[x0, y0], [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]], col.muted, 1.5); }
        }
      }
      if (f < 1) continue;
      for (let j = 0; j < n; j++) dot(ctx, xs(lvl, j), rowY(lvl), 3 + 2.2 * lvl, lvl === levels - 1 ? col.s[0] : col.s[6] || col.s[0], col.panel);
    }
    if (step === 0) text(ctx, 'dark matter halos, each about a million suns', (L + R) / 2, rowY(0) + 22, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    if (step === 1) text(ctx, 'time runs down the page', R, treeB + 2, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    if (step >= 2) {
      // zoom on the final halo
      const cx = (L + R) / 2, cy = treeB + (h - treeB) * 0.52, rH = Math.min((h - treeB) * 0.42, (R - L) * 0.45);
      line(ctx, [[xs(4, 0), rowY(4) + 10], [cx, cy - rH]], col.line, 1, [3, 3]);
      ctx.beginPath(); ctx.arc(cx, cy, rH, 0, 2 * Math.PI); ctx.fillStyle = col.soft; ctx.fill();
      text(ctx, 'dark matter halo', cx - rH + 4, cy - rH + 6, { color: col.muted, size: 11 });
      const kk = step === 2 ? k : 1;
      // infalling, cooling gas
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * 2 * Math.PI + 0.3, rr = rH * (0.95 - 0.55 * kk);
        dot(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (1 - 0.6 * kk), 2.5, col.s[1]);
      }
      ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * kk;
      ctx.beginPath(); ctx.ellipse(cx, cy, rH * 0.42 * kk + 2, rH * 0.08 * kk + 1, 0, 0, 2 * Math.PI); ctx.fillStyle = col.s[1]; ctx.fill();
      ctx.restore();
      dot(ctx, cx, cy, 4, col.s[3]);
      text(ctx, 'cool gas → disc of stars', cx, cy + rH * 0.62, { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.soft });
      if (step === 3) {
        const len = rH * (0.35 + 0.4 * k);
        arrow(ctx, cx, cy - 6, cx, cy - 6 - len, col.s[3], 2.5, 8);
        arrow(ctx, cx, cy + 6, cx, cy + 6 + len * 0.6, col.s[3], 2.5, 8);
        text(ctx, 'black hole jet', cx + 6, cy - 6 - len * 0.7, { color: col.s[3], size: 11, weight: 700, halo: col.soft });
        for (const s of [-1, 1]) arrow(ctx, cx + s * rH * 0.3, cy - 4, cx + s * (rH * 0.3 + len * 0.6), cy - len * 0.45, col.s[2], 2, 7);
        text(ctx, 'supernova winds', cx - rH * 0.3 - len * 0.6, cy - len * 0.45 - 12, { color: col.s[2], size: 11, weight: 700, align: 'right', halo: col.soft });
      }
    }
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
