// Sexual reproduction in flowering plants: from megaspore mother cell to the mature embryo sac (Polygonum type).
// Step through the stages: one meiosis gives four megaspores (three die), then three free-nuclear mitoses give
// eight nuclei, and cell walls organise them into 7 cells (3 antipodals, 2 synergids, 1 egg, 1 central cell with
// 2 polar nuclei). Pick a chromosome number to see the count in every cell.
import { canvas, text, row, slider, choice, readout, dot } from '../../kit.js';

const STAGES = [
  { name: 'Megaspore mother cell', note: 'one diploid (2n) cell in the nucellus, near the micropyle, ready for meiosis' },
  { name: 'Megaspore tetrad', note: 'meiosis gives a linear row of four haploid megaspores' },
  { name: 'Functional megaspore', note: 'three megaspores degenerate; the one at the chalazal end survives (monosporic development)' },
  { name: '2-nucleate', note: 'first mitosis: two nuclei move to opposite poles; no cell walls yet (free-nuclear)' },
  { name: '4-nucleate', note: 'second mitosis: two nuclei at each pole' },
  { name: '8-nucleate', note: 'third mitosis: four nuclei at each pole, still free-nuclear' },
  { name: 'Mature embryo sac', note: 'walls form: 3 antipodals (chalazal), egg + 2 synergids (micropylar, the egg apparatus), and one central cell holding 2 polar nuclei. 7 cells, 8 nuclei' },
];
export default function (host) {
  let st = 0, n2 = 24;
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'Development of the embryo sac inside an ovule, stage by stage' });
  const ctl = row(host);
  slider(ctl, { label: 'Stage', min: 0, max: 6, step: 1, value: st, fmt: (v) => `${v + 1} of 7`, oninput: (v) => { st = v; cv.redraw(); show(); } });
  choice(ctl, 'Plant 2n', [[24, 'Rice 24'], [20, 'Maize 20'], [14, 'Pea 14']], n2, (v) => { n2 = v; show(); });
  const out = readout(host);
  const show = () => {
    const s = STAGES[st], n = n2 / 2;
    let counts = '';
    if (st === 0) counts = `It has ${n2} chromosomes (2n).`;
    else if (st < 6) counts = `Each megaspore or free nucleus has ${n} chromosomes (n).`;
    else counts = `Egg, synergids and antipodals: ${n} each (n). Central cell: two polar nuclei of ${n} each; after triple fusion the endosperm nucleus has ${3 * n} (3n). Zygote: ${n2} (2n).`;
    out.innerHTML = `<b>${s.name}:</b> ${s.note}. ${counts}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 4, rx = Math.min(w * 0.4, 230), ry = h * 0.32;
    // ovule outline: nucellus around, micropyle on the left, chalaza on the right
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx + 22, ry + 22, 0, 0.18 * Math.PI, 1.82 * Math.PI, false); ctx.stroke();
    text(ctx, 'micropyle', cx - rx - 26, cy, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'chalaza', cx + rx + 30, cy + ry + 16, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'nucellus', cx, cy - ry - 30, { color: col.muted, size: 11, align: 'center' });
    text(ctx, STAGES[st].name, 10, 16, { color: col.ink, size: 12, weight: 700 });
    const nuc = (x, y, c = col.s[0]) => dot(ctx, x, y, 5, c);
    if (st === 0) {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx - rx * 0.4, cy, 30, 22, 0, 0, 7); ctx.stroke();
      nuc(cx - rx * 0.4, cy, col.s[1]); text(ctx, 'MMC (2n)', cx - rx * 0.4, cy + 36, { color: col.ink, size: 12, align: 'center', weight: 600 });
      return;
    }
    if (st <= 2) {
      for (let i = 0; i < 4; i++) {
        const x = cx - rx * 0.6 + i * rx * 0.4, alive = st === 1 || i === 3;
        ctx.strokeStyle = alive ? col.ink : col.line; ctx.lineWidth = alive ? 2 : 1;
        ctx.setLineDash(alive ? [] : [4, 4]);
        ctx.strokeRect(x - rx * 0.18, cy - 22, rx * 0.36, 44); ctx.setLineDash([]);
        nuc(x, cy, alive ? col.s[0] : col.line);
        text(ctx, alive ? 'n' : 'dies', x, cy + 36, { color: alive ? col.ink : col.muted, size: 11, align: 'center' });
      }
      return;
    }
    // embryo sac
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.stroke();
    const L = cx - rx * 0.75, R = cx + rx * 0.75;
    if (st === 3) { nuc(L, cy); nuc(R, cy); }
    if (st === 4) { nuc(L, cy - 12); nuc(L, cy + 12); nuc(R, cy - 12); nuc(R, cy + 12); }
    if (st === 5) { for (const x of [L, R]) for (const [dx, dy] of [[-8, -12], [8, -12], [-8, 12], [8, 12]]) nuc(x + dx, cy + dy); }
    if (st === 6) {
      const cell = (x, y, a, b, label, c) => {
        ctx.fillStyle = col.soft; ctx.strokeStyle = c; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(x, y, a, b, 0, 0, 7); ctx.fill(); ctx.stroke(); dot(ctx, x, y, 4, c);
        if (label) text(ctx, label, x, y + b + 10, { color: col.ink, size: 10, align: 'center' });
      };
      cell(L - 4, cy - ry * 0.4, rx * 0.1, ry * 0.25, 'synergid', col.s[2]);
      cell(L - 4, cy + ry * 0.4, rx * 0.1, ry * 0.25, 'synergid', col.s[2]);
      cell(L + rx * 0.17, cy, rx * 0.1, ry * 0.3, 'egg', col.s[1]);
      for (const [dy, lab] of [[-0.5, ''], [0, 'antipodals'], [0.5, '']]) cell(R + rx * 0.05, cy + dy * ry, rx * 0.08, ry * 0.18, '', col.s[3]);
      text(ctx, 'antipodals', R + rx * 0.05, cy + ry + 12, { color: col.ink, size: 10, align: 'center' });
      dot(ctx, cx - 8, cy, 5, col.s[0]); dot(ctx, cx + 8, cy, 5, col.s[0]);
      text(ctx, 'central cell: 2 polar nuclei', cx + 8, cy - 22, { color: col.ink, size: 11, align: 'center' });
    }
  };
  cv.redraw(); show();
}
