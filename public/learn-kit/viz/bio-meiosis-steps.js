// Meiosis as a step player for a cell with 2n = 4: homologues pair and swap pieces (crossing over), separate in
// meiosis I, then sister chromatids separate in meiosis II, ending in four cells with n = 2. Blue is from the mother,
// orange from the father; after crossing over some chromatids carry a piece of the other colour.
import { text, title } from '../kit.js';
import { stepper, rod, ellipse, mix } from './_bio-kit.js';

const NAMES = ['Prophase I: homologues pair up', 'Prophase I: crossing over', 'Metaphase I: pairs on the plate', 'End of meiosis I: homologues apart', 'Meiosis II: chromatids line up', 'Four cells, each n = 2'];
const COUNT = ['2n = 4: two homologous pairs (bivalents)', 'Chiasmata form where non-sister chromatids swap pieces', 'Pairs line up; each pair faces opposite poles at random', '2 cells with n = 2 (2 chromosomes, each still 2 chromatids)', 'Centromeres have not split yet; they split now', '4 haploid cells, all genetically different'];
const LEN = [0.15, 0.1, 0.15, 0.1];
const ELL = [[.5, .5, .4, .5, .5, .4, .5, .5, .4, .5, .5, .4], [.5, .5, .4, .5, .5, .4, .5, .5, .4, .5, .5, .4], [.5, .5, .4, .5, .5, .4, .5, .5, .4, .5, .5, .4],
  [.28, .5, .26, .28, .5, .26, .72, .5, .26, .72, .5, .26], [.28, .5, .26, .28, .5, .26, .72, .5, .26, .72, .5, .26],
  [.26, .27, .2, .26, .73, .2, .74, .27, .2, .74, .73, .2]];
// [x, y, angle] of chromatid (chromosome c, sister s) in stage st
const pose = (c, s, st) => {
  const big = c % 2 === 0, hom = c < 2 ? -1 : 1, sg = s ? 1 : -1, yc = big ? 0.32 : 0.66;
  if (st === 0) return [0.5 + hom * 0.07 + sg * 0.014 + (big ? 0 : 0.02), yc + (big ? 0.04 : -0.06), Math.PI / 2 + (big ? 0.35 : -0.5) * hom];
  if (st === 1) return [0.5 + hom * 0.05 + sg * 0.014, yc, Math.PI / 2];
  if (st === 2) return [0.5 + hom * 0.07 + sg * 0.014, yc, Math.PI / 2];
  if (st === 3) return [0.5 + hom * 0.22 + sg * 0.014, yc, Math.PI / 2];
  if (st === 4) return [0.5 + hom * 0.22 + sg * 0.012, yc, Math.PI / 2 + sg * 0.25];
  return [0.5 + hom * 0.24, (s ? 0.73 : 0.27) + (big ? -0.07 : 0.07), Math.PI / 2];
};

export default function (host) {
  return stepper(host, { aspect: 0.85, max: 380, min: 300, stages: 6, label: 'Meiosis in a cell with four chromosomes, ending in four haploid cells' }, (ctx, w, h, col, st, k, t, pv) => {
    for (let i = 0; i < 4; i++) {
      const a = ELL[pv], b = ELL[st], j = i * 3;
      ellipse(ctx, mix(a[j], b[j], k) * w, mix(a[j + 1], b[j + 1], k) * h, mix(a[j + 2], b[j + 2], k) * w, h * (st === 5 ? 0.2 : 0.36), col.soft, col.muted, 2);
    }
    const cross = st >= 1 ? (st === 1 ? k : 1) : (pv >= 1 ? 1 - k : 0);
    for (let c = 0; c < 4; c++) for (let s = 0; s < 2; s++) {
      const p = pose(c, s, pv), q = pose(c, s, st), x = mix(p[0], q[0], k) * w, y = mix(p[1], q[1], k) * h, L = LEN[c] * w * 1.5;
      const base = c < 2 ? col.s[0] : col.s[1], other = c < 2 ? col.s[1] : col.s[0];
      // crossing over swaps the lower part between sister chromatids 1 of each long homologue
      const swapped = c % 2 === 0 && ((c === 0 && s === 1) || (c === 2 && s === 0));
      rod(ctx, x, y, L, mix(p[2], q[2], k), base, 5, swapped && cross > 0.02 ? [[0.55, 0.55 + 0.45 * cross, other]] : []);
      ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    }
    title(ctx, NAMES[st], col);
    text(ctx, COUNT[st], w / 2, h - 12, { color: col.ink, size: 11.5, align: 'center', weight: 600 });
    text(ctx, 'blue: mother, orange: father', w / 2, h - 28, { color: col.muted, size: 10.5, align: 'center' });
  });
}
