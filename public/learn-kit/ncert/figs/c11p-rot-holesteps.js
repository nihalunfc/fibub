// Class 11 Rotational Motion (step player): centre of mass of a disc with a hole, by treating the hole as negative mass. A uniform disc (radius R, mass M) has a circular hole of radius R/2
// centred at x = R/2. Hole area is 1/4 of the disc, so its missing mass is M/4. x_cm = (M * 0 - (M/4)(R/2)) / (M - M/4) = -R/6.
import { canvas, line, text, title, dot } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A disc with a hole, solved by adding a negative-mass disc' });
  const T = ['A disc with a hole', 'Pretend the hole is filled', 'Mass of the missing piece', 'Treat the hole as negative mass', 'Centre of mass of what is left'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[s], col), R = Math.min(w * 0.3, 100), cx = w / 2, cy = top + R + 16;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.3); ctx.fillStyle = s === 1 ? col.s[0] : col.soft; ctx.globalAlpha = s === 1 ? 0.35 : 1; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke();
    if (s !== 1) { ctx.beginPath(); ctx.arc(cx + R / 2, cy, R / 2, 0, 6.3); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.setLineDash(s >= 2 ? [] : [3, 3]); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
    line(ctx, [[cx - R - 8, cy], [cx + R + 8, cy]], col.line, 1); dot(ctx, cx, cy, 4, col.ink); text(ctx, 'O', cx + 6, cy - 10, { color: col.ink, size: 11, weight: 700 });
    if (s >= 2) { dot(ctx, cx + R / 2, cy, 3.5, col.s[2]); text(ctx, 'hole: −M/4 at R/2', cx + R / 2, cy - R / 2 - 10, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    if (s >= 4) { dot(ctx, cx - R / 6, cy, 6, col.s[0], col.panel); text(ctx, 'CM at −R/6', cx - R / 6 - 10, cy + 24, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    const L = [];
    if (s === 0) L.push(['Where does it balance? Not at O (the centre).', col.ink]);
    if (s === 1) L.push(['Whole disc: mass M, centre of mass at O (x = 0).', col.ink]);
    if (s === 2) L.push(['Hole area is ¼ of the disc, so its mass is M/4.', col.ink], ['Remaining mass = M − M/4 = 3M/4.', col.ink]);
    if (s === 3) L.push(['Whole disc = remaining piece + hole piece', col.ink], ['M·0 = (3M/4)·x_cm + (M/4)(R/2)', col.s[2]]);
    if (s === 4) L.push(['x_cm = −(M/4)(R/2) / (3M/4) = −R/6', col.s[0]], ['It lies on the side opposite the hole.', col.ink]);
    L.forEach(([t, c], i) => text(ctx, t, 14, cy + R + 44 + i * 24, { color: c, size: 13, weight: 700 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
