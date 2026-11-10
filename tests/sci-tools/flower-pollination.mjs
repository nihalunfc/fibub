// #1268 Flower parts and pollination. Data checks: nine parts with jobs, captions in order for both levels, and the
// embryo sac count (7 cells, 8 nuclei).
import { PARTS, stageText, sacCells, sacNuclei } from '../../src/lib/sci/flower.ts';

export default async (check) => {
  check('nine parts, unique ids, each with a job', PARTS.length === 9 && new Set(PARTS.map((p) => p.id)).size === 9 && PARTS.every((p) => p.job.length > 20));
  check('embryo sac: 7 cells, 8 nuclei', sacCells() === 7 && sacNuclei() === 8);
  const caps = (lv, cross) => [0, 0.3, 0.6, 0.9].map((t) => stageText(lv, cross, t));
  check('four different steps at each level', new Set(caps('10', true)).size === 4 && new Set(caps('12', false)).size === 4);
  check('cross vs self wording', stageText('10', true, 0).includes('cross') && stageText('10', false, 0).includes('self'));
  check('Class 12 mentions double fertilisation, 2n and 3n', stageText('12', true, 0.6).includes('Double fertilisation') && stageText('12', true, 0.6).includes('3n'));
};
