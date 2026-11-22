// Class 12 Electric Charges and Fields (step player): charging a metal sphere by induction, with no contact. A positive rod pulls free electrons toward it;
// earthing the far side lets electrons flow in from the ground; the earth wire is removed and then the rod; the extra electrons spread over the sphere,
// which is now negative: the OPPOSITE sign to the rod.
import { canvas, text, title, dot, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'A metal sphere being charged by induction with a rod and an earth wire' });
  const TITLES = ['A neutral metal sphere on an insulating stand', 'Bring a + rod near: electrons shift toward it', 'Touch the far side to earth: electrons flow in', 'Remove the earth wire first', 'Then remove the rod: charge spreads out', 'Result: the sphere is negative (opposite to the rod)'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4, cx = w * 0.58, cy = (top + h) / 2 - 6, R = Math.min(60, (h - top) / 3);
    line(ctx, [[cx, cy + R], [cx, cy + R + 30]], col.muted, 6); line(ctx, [[cx - 30, cy + R + 30], [cx + 30, cy + R + 30]], col.muted, 6); text(ctx, 'insulator', cx, cy + R + 46, { color: col.muted, size: 10.5, align: 'center' });
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.stroke();
    const rod = step >= 1 && step <= 3, rx = cx - R - 56;
    if (rod) { ctx.fillStyle = col.s[2]; ctx.fillRect(rx - 70, cy - 12, 70, 24); text(ctx, '+ + +', rx - 36, cy, { color: col.panel, size: 13, weight: 700, align: 'center' }); }
    // charges on the sphere: ten + (fixed) and ten - (move)
    const N = 10, ang = (i) => i / N * 2 * Math.PI;
    for (let i = 0; i < N; i++) {
      const a = ang(i), x = cx + (R - 12) * Math.cos(a), y = cy + (R - 12) * Math.sin(a);
      text(ctx, '+', x, y, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    }
    let nl = 0, nr = 0, ne = 0; // electrons on left half, right half, spread evenly
    if (step === 0) ne = N; if (step === 1) { nl = 8; nr = 2; } if (step === 2) { nl = 8; nr = 4; } if (step === 3) { nl = 8; nr = 4; } if (step >= 4) ne = 12;
    const el = (x, y) => text(ctx, '−', x, y, { color: col.s[0], size: 16, weight: 700, align: 'center' });
    if (ne) for (let i = 0; i < ne; i++) { const a = ang(i) + 0.31, rr = R - 26 + (i % 2) * 0; el(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
    else { for (let i = 0; i < nl; i++) { const a = Math.PI + (i / (nl - 1) - 0.5) * 2.0; el(cx + (R - 26) * Math.cos(a), cy + (R - 26) * Math.sin(a)); } for (let i = 0; i < nr; i++) { const a = (i / Math.max(1, nr - 1) - 0.5) * 1.6; el(cx + (R - 26) * Math.cos(a), cy + (R - 26) * Math.sin(a)); } }
    if (step === 2) { line(ctx, [[cx + R, cy], [cx + R + 40, cy], [cx + R + 40, cy + R + 34]], col.ink, 2); for (let k = 0; k < 3; k++) line(ctx, [[cx + R + 28 + k * 4, cy + R + 38 + k * 5], [cx + R + 52 - k * 4, cy + R + 38 + k * 5]], col.ink, 2); text(ctx, 'earth', cx + R + 46, cy + R + 66, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'e⁻ in', cx + R + 46, cy - 10, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    if (step === 1) text(ctx, 'near side −, far side +', cx, cy - R - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    if (step === 3) text(ctx, 'extra − are trapped', cx, cy - R - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    if (step === 5) text(ctx, 'net charge: 2 extra electrons', cx, cy - R - 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
