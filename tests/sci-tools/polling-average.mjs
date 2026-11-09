// #753 Polling average: values matched against an independent numpy/pandas implementation (weighted averages
// with recency half-lives, LOESS by explicit weighted least squares with numpy.linalg.solve, margins of error)
// on the tool's made-up example; 58 numbers agreed to 1e-15.
import * as P from '../../src/lib/sci/polls.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

const EX = `Date,Pollster,n,Party A,Party B,Party C,Others
2026-01-06,Pollster 1,1000,38,33,17,12
2026-01-13,Pollster 2,1500,37,34,16,13
2026-01-20,Pollster 3,800,39,31,18,12
2026-01-27,Pollster 1,1000,36,34,17,13
2026-02-03,Pollster 2,1200,36,35,16,13
2026-02-10,Pollster 3,900,35,34,18,13
2026-02-17,Pollster 1,1000,35,36,16,13
2026-02-24,Pollster 2,2000,34,36,17,13
2026-03-03,Pollster 3,750,36,35,15,14
2026-03-10,Pollster 1,1000,33,37,17,13
2026-03-17,Pollster 2,1400,34,37,16,13
2026-03-24,Pollster 3,1100,33,38,16,13`;

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) < t;
  // Textbook: n = 1000 at 50 % gives ±3.1 points at 95 %.
  check('polls: MoE 1000 at 50 %', near(P.headlineMoe(1000), 0.030989751615228076) && near(P.moe(0.5, 1000, P.zFor(99)), 0.040727) === false && near(P.moe(0.5, 1000, P.zFor(99)), 2.5758293035489004 * Math.sqrt(0.25 / 1000)));
  check('polls: lead MoE (difference of proportions in one sample)', near(P.leadMoe(0.33, 0.38, 1100), 0.04970670446493743));
  check('polls: design effect scales by √deff', near(P.moe(0.4, 900, P.zFor(95), 2), Math.SQRT2 * P.moe(0.4, 900)));
  check('polls: dates', P.dayOf('2026-01-06') === 20459 && Number.isNaN(P.dayOf('2026-02-30')) && P.dateOf(20459) === '2026-01-06');
  const S = P.parsePolls(parseTable(EX));
  check('polls: parse example', S.parties.join() === 'Party A,Party B,Party C,Others' && S.polls.length === 12 && S.polls[0].shares[0] === 0.38 && S.polls[0].pollster === 'Pollster 1');
  const last = S.polls.at(-1).day;
  const a = P.average(S.polls, 0, last, 14, 'n');
  check('polls: weighted average (n, 14-day half-life) = numpy', near(a.mean, 0.33990434409387915) && near(a.se, 0.005837873735172136) && a.used === 12);
  const b = P.average(S.polls, 1, last, 30, 'sqrt');
  check('polls: weighted average (√n, 30 days) = numpy', near(b.mean, 0.3594080585767784) && near(b.se, 0.004678549821409191));
  const t = P.loessTrend(S.polls, 0, 0.75, 'n');
  const at = (d) => t.x.indexOf(d);
  check('polls: LOESS (span 0.75) = numpy at 4 days', [[20459, 0.3808189815593186, 0.01000469711382524], [20489, 0.35808585856940445, 0.005821586182411542], [20504, 0.34733678957640873, 0.0056298955665304365], [20536, 0.33259750421727496, 0.009650815721285504]].every(([d, y, se]) => near(t.y[at(d)], y) && near((t.hi[at(d)] - t.y[at(d)]) / P.zFor(95), se)));
  const e = P.ewmaTrend(S.polls, 0, 14, 'n');
  check('polls: exponential trend ends at the average', near(e.y.at(-1), a.mean) && e.x.length === 78);
  check('polls: equal weights, no decay = plain mean', near(P.average(S.polls, 2, last, 0, 'equal').mean, S.polls.reduce((s, p) => s + p.shares[2], 0) / 12));
  let bad = 0;
  for (const txt of ['Date,Party A\n2026-01-01,40', 'Date,n,A\n2026-13-01,500,40', 'Date,n,A\n2026-01-01,1,40', 'Date,n,A\n2026-01-01,500,140']) { try { P.parsePolls(parseTable(txt)); } catch { bad++; } }
  check('polls: bad tables refused', bad === 4);
};
