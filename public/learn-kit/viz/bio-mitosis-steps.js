// Mitosis as a step player for a cell with 2n = 4: prophase, metaphase, anaphase, telophase, cytokinesis. The eight
// rods are the chromatids (blue = from the mother, orange = from the father); watch them line up, split and travel.
// The count under the picture follows the centromeres, so you can see 4 become 8 for a moment and 4 + 4 at the end.
import { text, title } from '../kit.js';
import { stepper, rod, ellipse, mix } from './_bio-kit.js';

const NAMES = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'];
const COUNT = ['4 chromosomes (2n = 4), each 2 chromatids', '4 chromosomes lined up on the plate', '8 chromosomes for a moment (every centromere split)', '4 chromosomes at each pole, one cell stretched', '2 cells, each 2n = 4'];
const LEN = [0.12, 0.08, 0.12, 0.08];
// pose of chromatid k = (chromosome c, sister s) in each stage: [x, y, angle] as fractions of the canvas
const pose = (c, s, st) => {
  const yy = [0.3, 0.45, 0.6, 0.72][c], sg = s ? 1 : -1;
  if (st === 0) return [0.5 + [-0.14, 0.1, -0.05, 0.15][c] + sg * 0.012, [0.34, 0.45, 0.62, 0.52][c], [0.5, -0.4, 0.9, 0.1][c]];
  if (st === 1) return [0.5 + sg * 0.012, yy, Math.PI / 2 + sg * 0.25];
  if (st === 2) return [0.5 + sg * 0.12, yy, Math.PI / 2 + sg * 0.3];
  return [0.5 + sg * 0.22, yy, Math.PI / 2];
};
const CELLS = [[0.5, 0.5, 0.4], [0.5, 0.5, 0.4], [0.46, 0.54, 0.43], [0.3, 0.7, 0.28], [0.27, 0.73, 0.23]];

export default function (host) {
  return stepper(host, { aspect: 0.8, max: 360, min: 290, stages: 5, label: 'Mitosis in a cell with four chromosomes' }, (ctx, w, h, col, st, k, t, pv) => {
    const cy = h * 0.5, ry = h * 0.36;
    const C = (s) => CELLS[s];
    const a = [mix(C(pv)[0], C(st)[0], k), mix(C(pv)[1], C(st)[1], k), mix(C(pv)[2], C(st)[2], k)];
    ellipse(ctx, a[0] * w, cy, a[2] * w, ry, col.soft, col.muted, 2);
    ellipse(ctx, a[1] * w, cy, a[2] * w, ry, col.soft, col.muted, 2);
    // spindle (metaphase and anaphase)
    const sp = (s) => (s === 1 ? 1 : s === 2 ? 0.8 : 0);
    ctx.save(); ctx.globalAlpha = 0.45 * mix(sp(pv), sp(st), k); ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    for (let c = 0; c < 4; c++) for (const sg of [-1, 1]) { const [x, y] = pose(c, sg > 0 ? 1 : 0, st); ctx.beginPath(); ctx.moveTo(w * (sg > 0 ? 0.92 : 0.08), cy); ctx.lineTo(mix(w * pose(c, sg > 0 ? 1 : 0, pv)[0], x * w, k), mix(h * pose(c, 0, pv)[1], y * h, k)); ctx.stroke(); }
    ctx.restore();
    for (let c = 0; c < 4; c++) for (let s = 0; s < 2; s++) {
      const p = pose(c, s, pv), q = pose(c, s, st);
      const x = mix(p[0], q[0], k) * w, y = mix(p[1], q[1], k) * h;
      rod(ctx, x, y, LEN[c] * w * 1.6, mix(p[2], q[2], k), c < 2 ? col.s[0] : col.s[1], 5);
      ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    }
    title(ctx, NAMES[st], col);
    text(ctx, COUNT[st], w / 2, h - 12, { color: col.ink, size: 12, align: 'center', weight: 600 });
    text(ctx, 'blue: from mother, orange: from father', w / 2, h - 28, { color: col.muted, size: 10.5, align: 'center' });
  });
}
