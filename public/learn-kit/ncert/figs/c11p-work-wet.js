// Class 11 Work, Energy and Power (step player): the work-energy theorem for a constant force. A block (m = 2 kg) moving at u = 2 m/s is pushed by F = 6 N over d = 4 m.
// a = F/m = 3 m/s^2; v^2 = u^2 + 2ad = 28; multiply v^2 - u^2 = 2ad by m/2 to get 1/2 m v^2 - 1/2 m u^2 = F d.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A pushed block with the steps that lead to the work-energy theorem' });
  const T = ['A block, a push and a distance', 'Newton: the push gives an acceleration', 'Equation of motion: v² = u² + 2ad', 'Multiply both sides by m/2', 'Work done = change in kinetic energy', 'Check with numbers'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), y = top + 40, x0 = 36, x1 = w - 70, bw = 34;
    ctx.fillStyle = col.line; ctx.fillRect(10, y + 18, w - 20, 3);
    ctx.globalAlpha = 0.35; ctx.fillStyle = col.s[0]; ctx.fillRect(x0 - bw / 2, y - 16, bw, 34); ctx.globalAlpha = 1;
    ctx.fillStyle = col.s[0]; ctx.fillRect(x1 - bw / 2, y - 16, bw, 34);
    text(ctx, '2 kg', x0, y, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false });
    arrow(ctx, x1 + bw / 2 + 2, y, x1 + bw / 2 + 26, y, col.s[2], 3); text(ctx, 'F = 6 N', w - 6, y - 24, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    arrow(ctx, x0, y - 24, x1, y - 24, col.muted, 1.5); text(ctx, 'd = 4 m', (x0 + x1) / 2, y - 36, { color: col.muted, size: 12, align: 'center' });
    text(ctx, 'u = 2 m/s', x0, y + 34, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'v = ?', x1 - 6, y + 34, { color: col.muted, size: 11, align: 'center' });
    const L = [], c = [col.ink, col.ink, col.ink, col.ink];
    if (s >= 1) L.push(['a = F/m = 6/2 = 3 m/s²', col.s[2]]);
    if (s >= 2) L.push(['v² − u² = 2 a d', col.s[0]], ['  = 2 × 3 × 4 = 24 m²/s²', col.ink]);
    if (s >= 3) L.push(['½mv² − ½mu² = m a d = F d', col.s[1]]);
    const y2 = y + 70; L.forEach(([t, cc], i) => text(ctx, t, 16, y2 + i * 24, { color: cc, size: 14, weight: 700 }));
    if (s >= 4) {
      const by = y2 + L.length * 24 + 14, sc = (w - 150) / 28, bx = 70;
      text(ctx, 'KE start', 10, by + 9, { color: col.muted, size: 11 }); ctx.fillStyle = col.s[0]; ctx.fillRect(bx + 10, by, 4 * sc, 18);
      text(ctx, 'KE end', 10, by + 33, { color: col.muted, size: 11 }); ctx.fillStyle = col.s[0]; ctx.fillRect(bx + 10, by + 24, 28 * sc, 18);
      ctx.fillStyle = col.s[2]; ctx.fillRect(bx + 10 + 4 * sc, by + 24, 24 * sc, 18);
      if (s >= 5) { text(ctx, '4 J', bx + 14 + 4 * sc, by + 9, { color: col.ink, size: 11, weight: 700 }); text(ctx, '28 J = 4 J + 24 J, and 24 J = F d', 14, by + 60, { color: col.ink, size: 12, weight: 700 }); }
      else text(ctx, 'W = F d = ΔKE', w - 12, by + 9, { color: col.s[2], size: 13, weight: 700, align: 'right' });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
