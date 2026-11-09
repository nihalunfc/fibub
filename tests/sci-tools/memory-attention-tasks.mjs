// #727 Memory and attention tasks: search slopes checked against scipy.stats.linregress, RT summaries against
// numpy (ddof=1), span scoring against the two-trials-per-length rule and the Kessels et al. (2000) product.
import { sequence, digits, recallCorrect, scoreSpan, nextSpan, line, searchSummary, searchLayout, rtSummary } from '../../src/lib/sci/cogtasks.ts';
import { rng } from '../../src/lib/sci/sdt-optim.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const r = rng(11);
  const d = digits(9, r);
  check('cog: digits 1 to 9, no digit twice in a row', d.length === 9 && d.every((v, i) => v >= 1 && v <= 9 && (i === 0 || v !== d[i - 1])));
  const c = sequence(9, 9, r, true);
  check('cog: Corsi sequence of 9 uses every block once', new Set(c).size === 9);
  let threw = false; try { sequence(10, 9, r, true); } catch { threw = true; }
  check('cog: too long a unique sequence is an error', threw);
  check('cog: forward and backward recall', recallCorrect([3, 8, 1], [3, 8, 1]) && !recallCorrect([3, 8, 1], [1, 8, 3]) && recallCorrect([3, 8, 1], [1, 8, 3], true) && !recallCorrect([3, 8], [3, 8, 1]));
  const A = [[3, 1], [3, 1], [4, 1], [4, 0], [5, 0], [5, 1], [6, 0], [6, 0]].map(([length, ok]) => ({ length, correct: !!ok }));
  const s = scoreSpan(A);
  check('cog: span 5, 4 correct trials, product 20', s.span === 5 && s.total === 4 && s.product === 20 && s.trials === 8);
  check('cog: next length follows the two-trial rule', nextSpan(A.slice(0, 1), 9).length === 3 && nextSpan(A.slice(0, 2), 9).length === 4 && nextSpan(A.slice(0, 4), 9).length === 5 && nextSpan(A, 9) === null && nextSpan([{ length: 9, correct: true }, { length: 9, correct: false }], 9) === null);

  const T = [];
  for (let i = 0; i < 48; i++) {
    const size = [4, 8, 16][i % 3], present = Math.floor(i / 3) % 2 === 0;
    let rt = 450 + (present ? 22 : 41) * size + ((i * 53) % 90) - 45;
    if (i === 20) rt = 6000;
    T.push({ setSize: size, present, correct: i % 11 !== 5, rt });
  }
  const v = searchSummary(T);
  check('cog: present slope 23.2151 ms/item, intercept 434.395 (scipy linregress)', near(v.present.slope, 23.21511628) && near(v.present.intercept, 434.39534884) && v.present.n === 22);
  check('cog: present r² 0.953344, SE of slope 1.148374', near(v.present.r2, 0.95334433) && near(v.present.seSlope, 1.14837356));
  check('cog: absent slope 39.3240, intercept 463.786, r² 0.983808, SE 1.157379', near(v.absent.slope, 39.32397959) && near(v.absent.intercept, 463.78571429) && near(v.absent.r2, 0.98380802212) && near(v.absent.seSlope, 1.15737856) && v.absent.n === 21);
  check('cog: absent/present slope ratio', near(v.ratio, 39.32397959 / 23.21511628));
  check('cog: six cells (3 sizes × present/absent)', v.cells.length === 6 && v.cells.every((x) => x.n === 8));
  check('cog: a line needs two set sizes', line([4, 4], [500, 600]) === null);
  const L = searchLayout(30, r);
  check('cog: 30 search items placed inside the box', L.length === 30 && L.every((p) => p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1));

  const rts = [312, 287, 401, 95, 350, 333, 2600, 298, 310].map((rt) => ({ kind: 'simple', foreperiod: 1500, correct: true, rt, early: false }));
  rts.push({ kind: 'simple', foreperiod: 2000, correct: false, rt: null, early: true });
  const q = rtSummary(rts);
  check('cog: simple RT mean 327.286, median 312, SD 38.720 (numpy)', near(q.mean, 327.28571429) && q.median === 312 && near(q.sd, 38.71999606) && q.used === 7);
  check('cog: one false start, one anticipation', q.falseStarts === 1 && q.anticipations === 1 && q.n === 10);
  const ch = rtSummary([{ kind: 'choice', foreperiod: 1, correct: true, rt: 400, early: false }, { kind: 'choice', foreperiod: 1, correct: false, rt: 380, early: false }]);
  check('cog: choice RT uses correct answers only, accuracy 50 %', ch.mean === 400 && ch.accuracy === 0.5 && ch.errors === 1);
};
