// Class 11 Cell Cycle (step player): prophase I of meiosis, the long stage with five sub-stages: leptotene (chromosomes condense), zygotene (homologues pair: synapsis, synaptonemal complex),
// pachytene (crossing over between non-sister chromatids), diplotene (pairs begin to separate, chiasmata show) and diakinesis (chiasmata slide to the ends, envelope breaks down).
import { canvas, text, title } from '../../kit.js';
import { footer, ellipse } from '../c11b-ex-util.js';

const NOTE = [
  'Leptotene (thin thread): the chromosomes, already copied, start to condense into long thin threads. Each is two sister chromatids, though they are not yet visible separately.',
  'Zygotene (paired thread): the maternal and paternal copies of each chromosome find each other and pair up gene by gene: synapsis. A zipper-like synaptonemal complex forms. The pair is called a bivalent (a tetrad of 4 chromatids).',
  'Pachytene (thick thread): crossing over. Non-sister chromatids swap pieces at recombination nodules (made by the enzyme recombinase). The alleles are shuffled: new combinations.',
  'Diplotene (double thread): the synaptonemal complex dissolves and the homologues start to move apart, but stay joined at the crossing-over points, the chiasmata (X-shapes). In a human egg this stage can last for decades.',
  'Diakinesis: the chromosomes condense fully, the chiasmata move to the ends (terminalisation), the nucleolus disappears and the nuclear envelope breaks down. The spindle starts to form: the cell is ready for metaphase I.',
];
const T = ['1. Leptotene', '2. Zygotene', '3. Pachytene', '4. Diplotene', '5. Diakinesis'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Five sub-stages of prophase I of meiosis showing pairing, crossing over, chiasmata and terminalisation' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[s] + ' (prophase I)', col), fy = footer(ctx, w, h, col, NOTE[s]);
    const cx = w / 2, cy = (t0 + fy) / 2, R = Math.min(w / 2 - 14, (fy - t0) / 2 - 4);
    ctx.save(); if (s < 4) ellipse(ctx, cx, cy, R, R, col.soft, col.s[3], 3); else { ctx.setLineDash([5, 4]); ellipse(ctx, cx, cy, R, R, col.soft, col.s[3], 2); ctx.setLineDash([]); } ctx.restore();
    if (s < 4) ellipse(ctx, cx - R * 0.6, cy - R * 0.55, R * 0.1, R * 0.1, col.muted, null);
    const A = col.s[0], B = col.s[1];
    const chr = (x, y, len, c, wd, ang = 0, curve = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.quadraticCurveTo(0, curve, len / 2, 0); ctx.stroke(); ctx.restore(); };
    const pair = (x, y, len, c, wd, gap, ang, curve) => { chr(x, y - gap / 2, len, c, wd, ang, curve); chr(x, y + gap / 2, len, c, wd, ang, curve); };
    const L = R * 1.1;
    if (s === 0) { [[-0.35, -0.2, 0.2], [0.3, -0.3, -0.5], [-0.25, 0.3, -0.2], [0.35, 0.25, 0.4]].forEach(([a, b, an], i) => { chr(cx + a * R, cy + b * R, L * 0.8, i % 2 ? B : A, 2, an, (i - 1.5) * 10); }); text(ctx, 'long thin threads (4 chromosomes, 2n = 4)', cx, cy + R * 0.85, { color: col.muted, size: 10, align: 'center', fit: false }); }
    if (s === 1) { chr(cx, cy - R * 0.3, L, A, 3, 0, -10); chr(cx, cy - R * 0.3 + 5, L, B, 3, 0, 10); chr(cx, cy + R * 0.35, L, A, 3, 0.1, 10); chr(cx, cy + R * 0.35 + 5, L, B, 3, 0.1, -10); text(ctx, 'maternal (blue) pairs with paternal (orange)', cx, cy + R * 0.85, { color: col.muted, size: 10, align: 'center', fit: false }); text(ctx, 'synapsis: gene for gene', cx, cy - R * 0.62, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); }
    if (s >= 2) {
      const yy = [cy - R * 0.32, cy + R * 0.32];
      yy.forEach((y, k) => {
        const len = s === 4 ? L * 0.55 : L * 0.9;
        if (s === 2) { const ys2 = [y - 12, y - 4, y + 4, y + 12], cl = [A, A, B, B], seg = (yy, x1, x2, c) => { ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy); ctx.stroke(); }; ys2.forEach((yy, j) => seg(yy, cx - len / 2, cx + len / 2, cl[j])); seg(ys2[1], cx + 4, cx + len / 2, B); seg(ys2[2], cx + 4, cx + len / 2, A); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - 6, y - 5); ctx.lineTo(cx + 6, y + 5); ctx.moveTo(cx - 6, y + 5); ctx.lineTo(cx + 6, y - 5); ctx.stroke(); }
        else { const sep = s === 3 ? 22 : 16, xo = s === 4 ? len * 0.33 : len * 0.1; chr(cx, y - sep / 2 - 3, len, A, 4, 0, -sep * 0.6); chr(cx, y - sep / 2 + 4, len, A, 4, 0, -sep * 0.6 + 6); chr(cx, y + sep / 2 + 3, len, B, 4, 0, sep * 0.6); chr(cx, y + sep / 2 - 4, len, B, 4, 0, sep * 0.6 - 6); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - xo - 6, y - 4); ctx.lineTo(cx - xo + 6, y + 4); ctx.moveTo(cx - xo - 6, y + 4); ctx.lineTo(cx - xo + 6, y - 4); ctx.stroke(); text(ctx, 'chiasma', cx - xo, y + sep + 6, { color: col.ink, size: 9.5, weight: 700, align: 'center', fit: false }); }
        if (s === 2) text(ctx, 'crossing over', cx, y - 26, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false, halo: col.soft });
      });
    }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
