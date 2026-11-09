// #503 Westgard multirule QC: each rule checked on hand-made sequences (both sides, within a level and across
// levels, boundaries, missing results), the classic 1-2s gate, and the page's made-up example run by run.
import { readFileSync } from 'node:fs';
import { westgard, levelStats, sigmaMetric, CLASSIC, RULES } from '../../src/lib/sci/westgard.ts';

export const EXAMPLE_Z = [
  [0.5, -0.4], [-0.8, 0.2], [0.3, -0.6], [-0.2, 0.8], [1.1, -0.3], [2.3, 0.4], [0.6, -1.2], [-0.5, 0.1], [3.4, 0.6], [0.2, -0.4],
  [-1.0, 0.9], [2.2, 2.4], [-0.3, 0.2], [0.4, -0.8], [2.3, -2.2], [-0.6, 0.3], [1.3, 1.2], [1.5, 1.4], [-0.4, -0.5], [0.7, -0.9],
  [-0.3, 0.6], [0.5, 0.8], [-0.7, 0.5], [0.2, 1.0], [-0.1, 0.7], [0.6, 0.9], [-0.4, 0.6], [0.3, 0.8], [-0.5, 0.5], [0.1, 0.7],
];

export default async (check) => {
  const ALL = RULES.map((r) => r.id);
  const one = (zs, rules = ALL, opt = {}) => westgard(zs.map((v) => [v]), rules, opt);
  const rulesAt = (res, i) => [...new Set(res[i].violations.map((v) => v.rule))].sort().join();
  const has = (res, i, rule, where) => res[i].violations.some((v) => v.rule === rule && (!where || v.where === where));
  // 1-2s
  check('westgard 1-2s: z 2.1 is a warning, not a rejection', one([2.1], ['1-2s'])[0].status === 'warning');
  check('westgard 1-2s: z −2.05 is a warning', one([-2.05], ['1-2s'])[0].status === 'warning');
  check('westgard 1-2s: exactly 2.0 is in control (strictly beyond)', one([2.0], ['1-2s'])[0].status === 'ok');
  check('westgard 1-2s: as a rejection rule when chosen', one([2.1], ['1-2s'], { warnOnly12s: false })[0].status === 'reject');
  // 1-3s
  check('westgard 1-3s: z 3.01 rejects', one([3.01], ['1-3s'])[0].status === 'reject' && one([-3.5], ['1-3s'])[0].status === 'reject');
  check('westgard 1-3s: z 2.99 does not', one([2.99], ['1-3s'])[0].status === 'ok');
  // 2-2s
  { const r = westgard([[2.1, 2.5]], ['2-2s']); check('westgard 2-2s: two levels beyond +2 SD in one run', r[0].status === 'reject' && has(r, 0, '2-2s', 'within the run')); }
  { const r = westgard([[-2.1, -2.5]], ['2-2s']); check('westgard 2-2s: two levels beyond −2 SD in one run', r[0].status === 'reject'); }
  check('westgard 2-2s: opposite sides in one run is not 2-2s', westgard([[2.1, -2.5]], ['2-2s'])[0].status === 'ok');
  { const r = westgard([[2.1, 0], [2.2, 0]], ['2-2s']); check('westgard 2-2s: one level in two runs in a row', r[0].status === 'ok' && r[1].status === 'reject' && has(r, 1, '2-2s', 'within the level')); }
  check('westgard 2-2s: different levels in different runs do not count', westgard([[2.1, 0], [0, 2.2]], ['2-2s'])[1].status === 'ok');
  check('westgard 2-2s: same level, opposite sides in two runs do not count', one([2.1, -2.2], ['2-2s'])[1].status === 'ok');
  check('westgard 2-2s: a missing run in between still counts as in a row', westgard([[2.1, 0], [null, 0], [2.3, 0]], ['2-2s'])[2].status === 'reject');
  // R-4s
  { const r = westgard([[2.1, -2.1]], ['R-4s']); check('westgard R-4s: +2 SD and −2 SD in one run', r[0].status === 'reject' && r[0].violations[0].levels.join() === '0,1'); }
  check('westgard R-4s: not across runs', westgard([[2.5, 0], [-2.5, 0]], ['R-4s']).every((x) => x.status === 'ok') && one([2.5, -2.5], ['R-4s'])[1].status === 'ok');
  check('westgard R-4s: range 4.4 SD but not on both sides beyond 2 SD does not count', westgard([[2.9, -1.5]], ['R-4s'])[0].status === 'ok');
  // 4-1s
  { const r = one([1.1, 1.2, 1.5, 1.05], ['4-1s']); check('westgard 4-1s: four in a row beyond +1 SD (one level)', r.map((x) => x.status).join() === 'ok,ok,ok,reject'); }
  check('westgard 4-1s: below −1 SD too', one([-1.1, -1.2, -1.5, -1.05], ['4-1s'])[3].status === 'reject');
  check('westgard 4-1s: broken by one result at 0.9 SD', one([1.1, 1.2, 0.9, 1.5, 1.2], ['4-1s']).every((x) => x.status === 'ok'));
  check('westgard 4-1s: mixed sides do not count', one([1.1, -1.2, 1.5, 1.05], ['4-1s'])[3].status === 'ok');
  { const r = westgard([[1.1, 1.2], [1.3, 1.4]], ['4-1s']); check('westgard 4-1s: across two levels in two runs', r[1].status === 'reject' && has(r, 1, '4-1s', 'across levels') && r[0].status === 'ok'); }
  check('westgard 4-1s: within a level, skipping missing runs', westgard([[1.1, null], [null, 0], [1.2, 0], [1.3, 0], [1.4, 0]], ['4-1s'])[4].status === 'reject');
  // 3-1s
  check('westgard 3-1s: three in a row beyond 1 SD', one([1.1, 1.2, 1.3], ['3-1s']).map((x) => x.status).join() === 'ok,ok,reject' && one([1.1, 1.2, 0.3], ['3-1s'])[2].status === 'ok');
  // 2of3-2s
  check('westgard 2of3-2s: two of three beyond 2 SD, same side', one([2.1, 0.5, 2.3], ['2of3-2s'])[2].status === 'reject');
  check('westgard 2of3-2s: two of three on opposite sides do not count', one([2.1, 0.5, -2.3], ['2of3-2s'])[2].status === 'ok');
  check('westgard 2of3-2s: two in a row count from the second result; a run with no 2 SD result is not flagged for earlier ones', one([2.1, 2.2, 0.1], ['2of3-2s']).map((x) => x.status).join() === 'ok,reject,ok');
  check('westgard 2of3-2s: three levels in one run', westgard([[2.1, -0.3, 2.4]], ['2of3-2s'])[0].status === 'reject');
  // Nx rules
  for (const [id, n] of [['6x', 6], ['8x', 8], ['9x', 9], ['10x', 10], ['12x', 12]]) {
    const up = one(Array.from({ length: n }, (_, i) => 0.1 + (i % 3) * 0.2), [id]), short = one(Array.from({ length: n - 1 }, () => 0.3), [id]);
    const down = one(Array.from({ length: n }, () => -0.05), [id]), broken = one([...Array.from({ length: n - 1 }, () => 0.3), -0.1], [id]);
    check(`westgard ${id}: ${n} on one side reject at result ${n}, ${n - 1} do not, a crossing breaks it`, up[n - 1].status === 'reject' && up.slice(0, n - 1).every((x) => x.status === 'ok') && short.every((x) => x.status === 'ok') && down[n - 1].status === 'reject' && broken[n - 1].status === 'ok');
  }
  check('westgard 10x: a result exactly at the mean breaks the run', one([0.1, 0.2, 0.3, 0.1, 0.2, 0, 0.3, 0.1, 0.2, 0.3], ['10x'])[9].status === 'ok');
  { const r = westgard(Array.from({ length: 5 }, () => [0.2, 0.4]), ['10x']); check('westgard 10x: across two levels in five runs', r[4].status === 'reject' && has(r, 4, '10x', 'across levels') && r[3].status === 'ok'); }
  // 7T
  { const xs = [1, 2, 3, 4, 5, 6, 7]; const r = westgard(xs.map(() => [0]), ['7T'], { x: xs.map((v) => [v]) }); check('westgard 7T: seven rising results', r[6].status === 'reject' && r[5].status === 'ok'); }
  { const xs = [7, 6, 5, 4, 3, 2, 1]; check('westgard 7T: seven falling results', westgard(xs.map(() => [0]), ['7T'], { x: xs.map((v) => [v]) })[6].status === 'reject'); }
  { const xs = [1, 2, 3, 3, 5, 6, 7]; check('westgard 7T: a tie breaks the trend', westgard(xs.map(() => [0]), ['7T'], { x: xs.map((v) => [v]) })[6].status === 'ok'); }
  // Classic gate
  check('westgard gate: without a 1-2s warning the 4-1s rule is not checked', one([1.1, 1.2, 1.3, 1.4], CLASSIC, { gate: true })[3].status === 'ok');
  check('westgard gate: with a 1-2s warning it is', one([1.1, 1.2, 1.3, 2.4], CLASSIC, { gate: true })[3].status === 'reject' && rulesAt(one([1.1, 1.2, 1.3, 2.4], CLASSIC, { gate: true }), 3) === '1-2s,4-1s');
  check('westgard: no rules chosen, nothing flagged', one([5, 5, 5], []).every((x) => x.status === 'ok'));
  // The page's example with the classic rules.
  const ex = westgard(EXAMPLE_Z, CLASSIC);
  const flagged = ex.map((x, i) => (x.status === 'ok' ? '' : `${i + 1}${x.status === 'reject' ? 'R' : 'W'}:${rulesAt(ex, i)}`)).filter(Boolean).join(' ');
  check(`westgard: example flags runs 6 (warning), 9 (1-3s), 12 (2-2s), 15 (R-4s), 18 (4-1s), 30 (10x): ${flagged}`, flagged === '6W:1-2s 9R:1-2s,1-3s 12R:1-2s,2-2s 15R:1-2s,R-4s 18R:4-1s 30R:10x');
  check('westgard: example 10x is within level 2', ex[29].violations[0].where === 'within the level' && ex[29].violations[0].levels.join() === '1');
  check('westgard: example 4-1s at run 18 is across levels', ex[17].violations[0].where === 'across levels');
  // 60 random sequences (1 to 3 levels, missing results, drifts) against an independent Python version of the classic rules.
  { const C = JSON.parse(readFileSync(new URL('./westgard-qc.ref.json', import.meta.url), 'utf8')); let bad = 0, n = 0;
    for (const c of C) { const r = westgard(c.z, CLASSIC); r.forEach((x, i) => { n++; const rej = [...new Set(x.violations.map((v) => v.rule).filter((v) => v !== '1-2s'))].sort().join(); const got = x.status === 'reject' ? `reject:${rej}` : x.status; if (got !== c.status[i]) bad++; }); }
    check(`westgard: ${n} random runs, statuses and rules = Python (${bad} differ)`, bad === 0 && n > 1500); }
  // Statistics and sigma.
  { const s = levelStats([4.9, 5.0, 5.1, 5.2, 4.8]); check('westgard: level mean, SD, CV', Math.abs(s.mean - 5) < 1e-12 && Math.abs(s.sd - Math.sqrt(0.025)) < 1e-12 && Math.abs(s.cv - 100 * Math.sqrt(0.025) / 5) < 1e-10); }
  check('westgard: sigma metric (10 − 1) / 2 = 4.5, bias sign ignored', sigmaMetric(10, 1, 2) === 4.5 && sigmaMetric(10, -1, 2) === 4.5);
};
