// Class 11 Biology, Animal Kingdom: Arthropoda, the largest phylum, shows three body plans: insects (head, thorax, abdomen; 3 pairs of legs; 1 pair of antennae; usually 2 pairs of wings),
// arachnids such as spiders (cephalothorax and abdomen; 4 pairs of legs; no antennae), and crustaceans such as prawn or crab (cephalothorax and abdomen; 5 pairs of legs; 2 pairs of antennae).
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';
import { ell, rr, note } from '../c11b-lib.js';

const A = { ins: ['Insect (cockroach)', 3, 'head, thorax, abdomen', 3, 1, 'wings'], spi: ['Spider (arachnid)', 2, 'cephalothorax, abdomen', 4, 0, 'no wings'], pra: ['Prawn (crustacean)', 2, 'cephalothorax, abdomen', 5, 2, 'no wings; gills'] };
export default function (host) {
  let k = 'ins', labels = true, t = 0;
  const cv = canvas(host, { aspect: 1.1, max: 470, min: 330, label: 'Top view of an insect, a spider and a prawn with body regions, legs and antennae' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Arthropod', Object.entries(A).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; go(); });
  choice(ctl, 'Labels', [[true, 'Show'], [false, 'Hide']], labels, (v) => { labels = v; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { const a = A[k]; ro.textContent = `${a[0]}: ${a[1]} body regions (${a[2]}), ${a[3]} pairs of walking legs, ${a[4]} pair(s) of antennae, ${a[5]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const a = A[k], y0 = title(ctx, a[0], col), cx = w / 2, cy = y0 + 132, ink = col.ink, sw = Math.sin(t * 3);
    const reg = k === 'ins' ? [[0, -78, 22, 18, 'head'], [0, -34, 26, 26, 'thorax'], [0, 38, 30, 46, 'abdomen']] : [[0, -50, 30, 48, 'cephalothorax'], [0, 40, 28, 50, 'abdomen']];
    reg.forEach(([x, y, rx, ry, nm], i) => { ell(ctx, cx + x, cy + y, rx, ry, col.s[i], ink, 1.8, 0.55); if (labels) text(ctx, nm, cx + rx + 12, cy + y, { color: col.s[i], size: 10.5, weight: 700 }); });
    // legs from the thorax / cephalothorax
    const n = a[3], baseY = k === 'ins' ? -40 : -50, span = k === 'ins' ? 22 : 40;
    for (let i = 0; i < n; i++) for (const sg of [-1, 1]) { const y = cy + baseY - span / 2 + (n === 1 ? 0 : (i / (n - 1)) * span) + (k === 'ins' ? 6 : 0), x = cx + sg * 22, sway = 3 * sw * (i % 2 ? 1 : -1); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sg * 26, y + sway - 6); ctx.lineTo(x + sg * 44, y + sway + 10 + i * 2); ctx.stroke(); }
    if (labels) text(ctx, `${n} pairs of legs`, cx - 64, cy + baseY - span / 2 - 6, { color: col.muted, size: 10.5, align: 'right' });
    // antennae
    const hy = k === 'ins' ? cy - 96 : cy - 96;
    for (let i = 0; i < a[4]; i++) for (const sg of [-1, 1]) { const o = a[4] === 2 ? (i ? 18 : 8) : 8; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cx + sg * 6, hy + 8); ctx.quadraticCurveTo(cx + sg * (o + 10), hy - 16, cx + sg * (o + 24 + 4 * sw), hy - 36 - (i ? 8 : 0)); ctx.stroke(); }
    if (labels && a[4]) text(ctx, `${a[4]} pair${a[4] > 1 ? 's' : ''} of antennae`, cx + 34, hy - 38, { color: col.s[3], size: 10.5, weight: 700 });
    if (k === 'ins') { for (const sg of [-1, 1]) { ell(ctx, cx + sg * 30, cy - 18, 34, 10, col.s[4], ink, 1, 0.35); } if (labels) text(ctx, 'wings', cx + 64, cy - 16, { color: col.s[4], size: 10.5, weight: 700 }); }
    if (k === 'pra') { ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy + 90); ctx.lineTo(cx - 14, cy + 110); ctx.moveTo(cx, cy + 90); ctx.lineTo(cx + 14, cy + 110); ctx.stroke(); }
    note(ctx, 'All arthropods: jointed legs, hard chitin exoskeleton, body in segments.', 12, h - 34, w - 24, col, { size: 10.5, color: col.muted });
  };
  go();
}
