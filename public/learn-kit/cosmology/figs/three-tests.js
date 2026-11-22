// 3.6 Three tests of general relativity, in four steps: (1) in Newton's gravity Mercury repeats the same
// ellipse; (2) in Einstein's the ellipse turns a little each orbit, 43 arcseconds a century more than the
// planets' pulls explain (exaggerated here); (3) the 1919 eclipse: stars near the Sun appear pushed outwards
// (exaggerated); (4) GPS: satellite clocks run about 38 microseconds a day fast, and are corrected.
import { canvas, text, title, line, dot, arrow, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Mercury\'s turning orbit, starlight bent at an eclipse, and GPS clocks' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.58, A = Math.min(w * 0.24, h * 0.28), e = 0.45;
    if (step <= 1) {
      const turn = step === 1 ? 0.35 : 0; // radians per orbit, hugely exaggerated
      const orbits = calm() ? 6 : step === 1 ? Math.min(8, 2.5 + t / 1.2) : Math.min(3, 1 + t / 1.6);
      const pts = [];
      for (let th = 0; th <= orbits * Math.PI * 2; th += 0.05) {
        const r = A * (1 - e * e) / (1 + e * Math.cos(th - turn * th / (Math.PI * 2)));
        pts.push([cx + r * Math.cos(th) * 1.0 - A * e * 0.4, cy + r * Math.sin(th) * 0.8]);
      }
      if (pts.length > 1) line(ctx, pts, col.s[0], 1.3);
      const p = pts[pts.length - 1] || [cx, cy];
      dot(ctx, cx - A * e * 0.4, cy, 9, col.s[3]);
      dot(ctx, p[0], p[1], 4, col.ink);
      text(ctx, step === 0 ? 'Newton: the same ellipse every time' : 'Einstein: the ellipse slowly turns (a rosette)', cx, 40, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      if (step === 1) text(ctx, 'real turn: 43″ per century; shown about 700,000× bigger', cx, h - 10, { color: col.muted, size: 11.5, align: 'center' });
    } else if (step === 2) {
      const R = Math.min(w, h) * 0.13;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = col.ink; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, Math.PI * 2); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.stroke();
      const stars = [[1.8, 0.3], [-2.1, -0.4], [0.6, -1.9], [-0.8, 2.0], [2.6, -1.4]];
      const k = calm() ? 1 : Math.min(1, t / 2);
      stars.forEach(([sx, sy]) => {
        const d = Math.hypot(sx, sy), x0 = cx + sx * R, y0 = cy + sy * R, push = (0.9 / d) * R * k;
        dot(ctx, x0, y0, 3, col.muted);
        const x1 = x0 + sx / d * push, y1 = y0 + sy / d * push;
        if (push > 2) arrow(ctx, x0, y0, x1, y1, col.s[1], 1.5, 6);
        dot(ctx, x1, y1, 4, col.s[1]);
      });
      text(ctx, 'Eclipse, 1919: stars near the Sun look pushed outwards', cx, 40, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      text(ctx, 'grey: where they are at night; coloured: during the eclipse (shift exaggerated)', cx, h - 10, { color: col.muted, size: 11.5, align: 'center' });
    } else {
      const er = Math.min(w, h) * 0.16;
      dot(ctx, cx, cy + 10, er, col.s[2]);
      text(ctx, 'Earth', cx, cy + 10, { color: col.panel, size: 12, weight: 700, align: 'center' });
      const orbitR = er * 2.4, a = t * 0.6;
      ctx.beginPath(); ctx.arc(cx, cy + 10, orbitR, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      const sx = cx + orbitR * Math.cos(a), sy = cy + 10 + orbitR * Math.sin(a) * 0.8;
      ctx.fillStyle = col.s[0]; ctx.fillRect(sx - 8, sy - 5, 16, 10); line(ctx, [[sx - 18, sy], [sx + 18, sy]], col.s[0], 2);
      text(ctx, 'higher up, weaker gravity: clock runs fast (+45 µs a day)', cx, 40, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, 'moving fast: clock runs slow (−7 µs a day)', cx, 58, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, 'net +38 µs a day: uncorrected, positions drift ~11 km a day', cx, h - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
    title(ctx, ['Mercury\'s orbit with Newton', 'Mercury\'s orbit with Einstein', 'Starlight bent by the Sun', 'GPS: relativity in your pocket'][step], col);
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
