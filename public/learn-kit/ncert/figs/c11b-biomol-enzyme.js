// Class 11 Biomolecules (step player): how an enzyme works (induced fit). The substrate binds to the active site; the site changes shape slightly and strains the substrate towards the
// transition state; the products form and leave; the enzyme is unchanged and ready again. An enzyme lowers the activation energy; it does not change the energy of the start or the end.
import { canvas, text, title, axes, line, dot } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NOTE = [
  'The enzyme (a protein) has an active site of a particular shape. The substrate (here one molecule that will be split) floats nearby.',
  'The substrate binds to the active site: an enzyme-substrate complex (ES) forms. Only the right substrate fits.',
  'The active site closes round the substrate (induced fit) and strains its bond. This is the transition state: the activation energy has been lowered.',
  'The bond breaks. Two products now sit in the site.',
  'The products leave and the enzyme is free and unchanged, ready for the next substrate. One enzyme molecule can convert thousands of substrates every second.',
];
const T = ['1. Enzyme and substrate', '2. Enzyme-substrate complex', '3. Induced fit: transition state', '4. Products form', '5. Products leave, enzyme free'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Five steps of an enzyme binding a substrate, changing shape, releasing products, with the energy profile below' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[s], col), fy = footer(ctx, w, h, col, NOTE[s]);
    const top = t0 + 6, bh = Math.min(140, (fy - top) * 0.48), cx = w / 2, ey = top + bh * 0.62;
    // enzyme: a blob with a notch that closes in steps 2-3
    const close = s === 2 || s === 3 ? 1 : s === 1 ? 0.3 : 0;
    ctx.fillStyle = col.s[0] + '66'; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    const ew = Math.min(w * 0.5, 190), eh = bh * 0.7, ex = cx - ew / 2, ny = 20 - 7 * close;
    ctx.moveTo(ex, ey + eh / 2); ctx.bezierCurveTo(ex - 10, ey - eh * 0.6, ex + ew * 0.2, ey - eh * 0.75, cx - ny, ey - eh * 0.5); ctx.lineTo(cx - ny + 2, ey - eh * 0.05 - 0 * close); ctx.lineTo(cx + ny - 2, ey - eh * 0.05); ctx.lineTo(cx + ny, ey - eh * 0.5); ctx.bezierCurveTo(ex + ew * 0.8, ey - eh * 0.75, ex + ew + 10, ey - eh * 0.6, ex + ew, ey + eh / 2); ctx.bezierCurveTo(ex + ew * 0.8, ey + eh * 0.8, ex + ew * 0.2, ey + eh * 0.8, ex, ey + eh / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    text(ctx, 'enzyme', cx, ey + eh * 0.3, { color: col.s[0], size: 11, weight: 700, align: 'center', fit: false });
    const sub = (x, y, split) => { if (!split) { ellipse(ctx, x - 7, y, 8, 8, col.s[3], col.panel, 1.5); ellipse(ctx, x + 7, y, 8, 8, col.s[4], col.panel, 1.5); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x + 2, y); ctx.stroke(); } else { ellipse(ctx, x - 7 - split, y + split * 0.4, 8, 8, col.s[3], col.panel, 1.5); ellipse(ctx, x + 7 + split, y + split * 0.4, 8, 8, col.s[4], col.panel, 1.5); } };
    const siteY = ey - eh * 0.28;
    if (s === 0) { sub(cx + 45, top + 8); text(ctx, 'substrate', cx + 45, top + 26, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); text(ctx, 'active site', cx, ey - eh * 0.78, { color: col.muted, size: 10, align: 'center', fit: false }); }
    if (s === 1) { sub(cx, siteY); text(ctx, 'ES complex', cx, top + 8, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); }
    if (s === 2) { sub(cx, siteY); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 22, siteY - 14); ctx.lineTo(cx - 14, siteY - 8); ctx.moveTo(cx + 22, siteY - 14); ctx.lineTo(cx + 14, siteY - 8); ctx.stroke(); text(ctx, 'strain', cx, top + 8, { color: col.s[1], size: 10.5, weight: 700, align: 'center', fit: false }); }
    if (s === 3) sub(cx, siteY, 5);
    if (s === 4) { sub(cx - 55, top + 22, 3); sub(cx + 62, top + 36, 3); text(ctx, 'products', cx, top + 6, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); }
    // energy profile
    const y0 = top + bh + 8, A = axes(ctx, w, fy - 2, col, { x: [0, 10], y: [0, 10], l: 40, r: 14, t: y0, b: 34, xt: [], yt: [], xlabel: 'reaction progress', ylabel: 'energy', grid: false });
    const f = (x, h0) => 4 + h0 * Math.exp(-((x - 5) ** 2) / 2) - 2.2 * (x / 10) ** 2;
    const pts0 = [], pts1 = []; for (let k = 0; k <= 60; k++) { const x = k / 6; pts0.push([A.X(x), A.Y(f(x, 5))]); pts1.push([A.X(x), A.Y(f(x, 2.2))]); }
    line(ctx, pts0, col.muted, 2, [5, 3]); line(ctx, pts1, col.s[0], 2.8);
    text(ctx, 'without enzyme', A.X(5), A.Y(f(5, 5)) - 9, { color: col.muted, size: 10, align: 'center', fit: false }); text(ctx, 'with enzyme (lower hill)', A.X(5), A.Y(f(5, 2.2)) + 22, { color: col.s[0], size: 10, weight: 700, align: 'center', fit: false });
    const pos = [0.4, 2.4, 5, 7.5, 9.6][s]; dot(ctx, A.X(pos), A.Y(f(pos, 2.2)), 5.5, col.s[1], col.panel);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
