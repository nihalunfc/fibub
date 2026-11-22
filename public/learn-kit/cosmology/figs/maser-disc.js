// 2.5 The water maser disc in NGC 4258, in four steps: (1) clouds at the disc's edges give a speed from the
// Doppler shift; (2) a cloud on the near side moves a real distance in a year; (3) seen from Earth, that
// is a tiny drift angle; (4) distance = distance travelled ÷ angle. Numbers are rounded: a 1,000 km/s
// cloud and a distance of about 7.6 million parsecs give a drift of about 28 micro-arcseconds a year.
import { canvas, text, title, line, dot, arrow, ease, loop, calm } from '../../kit.js';

const V = 1000, YEAR = 3.156e7, S = V * YEAR, D = 7.6 * 3.086e19; // km/s, s, km, km
const THETA = S / D, MUAS = THETA * 206265e6;
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 400, min: 260, label: 'A disc of water maser clouds orbiting the black hole in NGC 4258' });
  let step = 0, k = 1, t = 0;
  const anim = loop(host, (dt) => { t += dt; if (k < 1) k = Math.min(1, k + dt * 0.8); cv.redraw(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    const cx = w * 0.5, cy = h * 0.42, rx = Math.min(w * 0.38, 190), ry = rx * 0.22;
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    dot(ctx, cx, cy, 6, col.ink);
    text(ctx, 'black hole', cx, cy - 12, { color: col.muted, size: 11, align: 'center' });
    // clouds around the ring, slowly orbiting
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2 + t * 0.15;
      dot(ctx, cx + rx * Math.cos(a), cy + ry * Math.sin(a), 2.5, col.muted);
    }
    if (step === 0) {
      dot(ctx, cx - rx, cy, 6, col.s[0]); dot(ctx, cx + rx, cy, 6, col.s[1]);
      text(ctx, 'coming towards us', cx - rx, cy + 26, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, 'moving away', cx + rx, cy + 26, { color: col.ink, size: 12, weight: 600, align: 'center' });
      text(ctx, `Doppler shift: about ${V.toLocaleString()} km/s`, cx, h - 22, { color: col.ink, size: 13, weight: 700, align: 'center' });
    }
    if (step >= 1) {
      const x0 = cx - 40, x1 = cx - 40 + 80 * e, y = cy + ry;
      dot(ctx, x0, y, 5, col.s[2]);
      arrow(ctx, x0, y + 12, x1, y + 12, col.s[2], 2);
      dot(ctx, x1, y, 5, col.s[2]);
      if (step === 1) text(ctx, 'in one year: 1,000 km/s × 1 year ≈ 3.2 × 10¹⁰ km', cx, h - 22, { color: col.ink, size: 13, weight: 700, align: 'center' });
    }
    if (step >= 2) {
      const ex = cx, ey = h - 8, ax = cx - 40, bx = cx + 40, by = cy + ry;
      line(ctx, [[ex, ey], [ax, by]], col.s[3], 1.2, [4, 3]);
      line(ctx, [[ex, ey], [bx, by]], col.s[3], 1.2, [4, 3]);
      text(ctx, 'Earth', ex + 8, ey - 2, { color: col.muted, size: 11 });
      if (step === 2) text(ctx, `drift seen from Earth: about ${MUAS.toFixed(0)} micro-arcseconds a year`, cx, h - 30, { color: col.ink, size: 12.5, weight: 700, align: 'center', halo: col.panel });
    }
    if (step >= 3) {
      text(ctx, 'distance = 3.2 × 10¹⁰ km ÷ 1.3 × 10⁻¹⁰ (angle in radians)', cx, h - 46, { color: col.ink, size: 12.5, weight: 600, align: 'center', halo: col.panel });
      text(ctx, '≈ 7.6 million parsecs ≈ 25 million light-years', cx, h - 28, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    }
    title(ctx, 'NGC 4258: water clouds round a black hole (not to scale)', col);
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
