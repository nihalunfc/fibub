// 1.7 How we found our place in the Milky Way. Step 1: Herschel counted stars and put the Sun near the
// centre. Step 2: dust hides distant stars, so every direction looks alike. Step 3: Shapley mapped globular
// clusters, which sit in a ball around the true centre, far from us. Step 4: today's picture.
// Shapes and positions are schematic; the Sun is about 26,000 light-years from the centre.
import { canvas, text, line, dot, ease, loop, rng, calm, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 420, min: 270, label: 'Maps of the Milky Way from Herschel to today' });
  const r = rng(11);
  const disc = Array.from({ length: 700 }, () => { const rr = Math.sqrt(r()) * 50, a = r() * Math.PI * 2; return { x: rr * Math.cos(a), y: rr * Math.sin(a) * 0.12 + (r() - 0.5) * 2 }; });
  const gcs = Array.from({ length: 60 }, () => { const rr = 4 + Math.pow(r(), 0.7) * 30, a = r() * Math.PI * 2, b = (r() - 0.5) * Math.PI; return { x: rr * Math.cos(a) * Math.cos(b), y: rr * Math.sin(b) * 0.9 }; });
  const SUN = 26; // thousand ly from centre
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 0.9); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 8, s = Math.min(w / 120, h / 50);
    const e = ease(k);
    const X = (x) => cx + x * s, Y = (y) => cy - y * s;
    const sunX = step === 0 ? 0 : step === 1 ? 0 : SUN;
    if (step === 0) {
      // Herschel's flattened blob centred on the Sun
      ctx.beginPath(); ctx.ellipse(cx, cy, 30 * s * e + 1, 6 * s * e + 1, 0, 0, Math.PI * 2); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.stroke();
      title(ctx, 'Herschel, 1785: counted stars in every direction', col);
      text(ctx, 'Sun near the middle?', cx, cy + 6 * s + 16, { color: col.muted, size: 11.5, align: 'center' });
    }
    if (step >= 1) {
      for (const p of disc) dot(ctx, X(p.x), Y(p.y), 1.2, step === 1 && Math.hypot(p.x - SUN, p.y) > 10 ? col.line : col.muted);
    }
    if (step === 1) {
      ctx.beginPath(); ctx.arc(X(SUN), Y(0), 10 * s, 0, Math.PI * 2); ctx.strokeStyle = col.s[1]; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      title(ctx, 'Dust: from inside the disc we only see nearby stars, in a bubble around us', col);
    }
    if (step >= 2) {
      for (const g of gcs) { dot(ctx, X(g.x * (step === 2 ? e : 1) + SUN * (step === 2 ? 1 - e : 0)), Y(g.y * (step === 2 ? e : 1)), 3, col.s[0]); }
      title(ctx, step === 2 ? 'Shapley, 1918: globular clusters (blue) swarm around a centre far away' : 'Today: a barred spiral ~100,000 light-years across', col);
      dot(ctx, X(0), Y(0), 5, col.s[3]);
      text(ctx, 'centre', X(0), Y(0) + 14, { color: col.ink, size: 11, align: 'center', halo: col.panel });
      line(ctx, [[X(0), Y(-9)], [X(SUN), Y(-9)]], col.ink, 1);
      text(ctx, '≈ 26,000 light-years', X(SUN / 2), Y(-9) + 12, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    dot(ctx, X(step >= 2 ? SUN : step === 1 ? SUN : 0), Y(0), 4.5, col.s[1], col.panel);
    text(ctx, 'Sun', X(step >= 1 ? SUN : 0), Y(0) - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Side view, schematic', w - 10, h - 8, { color: col.muted, size: 10.5, align: 'right' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
