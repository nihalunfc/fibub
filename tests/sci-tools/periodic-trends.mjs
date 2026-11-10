// #1356 periodic trends: the usual directions hold (radius falls across periods 2 and 3, grows down groups 1 and 17;
// ionisation energy and electronegativity rise across period 2), and the textbook exceptions are flagged
// (Be→B, N→O in period 2; Mg→Al, P→S in period 3; Al→Ga radius).
import { RADIUS, value, inPeriod, inGroup, exceptions, MAIN, EV_TO_KJ, questions } from '../../src/lib/sci/periodtrend.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const vals = (list, p) => list.map((e) => value(e, p)).filter(Number.isFinite);
  const dec = (a) => a.every((x, i) => i === 0 || x <= a[i - 1]), inc = (a) => a.every((x, i) => i === 0 || x >= a[i - 1]);
  check('periodic-trends: radius falls across periods 2 and 3', dec(vals(inPeriod(2), 'radius')) && dec(vals(inPeriod(3), 'radius')));
  check('periodic-trends: radius grows down groups 1 and 2', inc(vals(inGroup(1).slice(1), 'radius')) && inc(vals(inGroup(2), 'radius')));
  check('periodic-trends: electronegativity rises across period 2 (Li to F)', inc(vals(inPeriod(2), 'en')));
  const ex2 = exceptions(inPeriod(2), 'ie', 'period').map((f) => f.from.symbol + f.to.symbol), ex3 = exceptions(inPeriod(3), 'ie', 'period').map((f) => f.from.symbol + f.to.symbol);
  check(`periodic-trends: IE exceptions flagged in period 2 (${ex2}) and 3 (${ex3})`, ex2.join() === 'BeB,NO' && ex3.join() === 'MgAl,PS');
  check('periodic-trends: Al → Ga radius flagged down group 13', exceptions(inGroup(13), 'radius', 'group').some((f) => f.from.symbol === 'Al' && f.to.symbol === 'Ga'));
  check('periodic-trends: IE of N 1402 kJ/mol, O 1314 kJ/mol', value(MAIN.find((e) => e.z === 7), 'ie') === 1402 && value(MAIN.find((e) => e.z === 8), 'ie') === 1314 && EV_TO_KJ === 96.485);
  check('periodic-trends: radii only for s and p blocks', Object.keys(RADIUS).every((z) => { const e = MAIN.find((x) => x.z === Number(z)); return e && (e.block === 's' || e.block === 'p') && e.group !== 18; }) && MAIN.length === 72);
  let ok = true; const r = seeded(37); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('periodic-trends: questions', ok);
};
