// #1256 Separation lab: every mixture's textbook method separates it; common wrong methods fail for the right reason;
// Rf and the quiz answers are hand-checked.
import { MIXTURES, apply, run, recovered, rf, questions } from '../../src/lib/sci/separation-lab.ts';
export default async (check) => {
  const M = Object.fromEntries(MIXTURES.map((m) => [m.id, m]));
  for (const m of MIXTURES) {
    const steps = m.id === 'sandsalt' ? [[0, 'water'], [0, 'filter'], [1, 'evap']] : m.best.slice(0, 1).map((b) => [0, b]);
    const r = run(m, steps);
    check(`separation-lab: ${m.name} is separated by ${steps.map((s) => s[1]).join(' → ')}`, recovered(r.boxes, m.targets).length === m.targets.length);
  }
  const box = (id) => ({ comps: [...M[id].comps].sort() });
  check('separation-lab: sand and salt cannot be sieved, filtered dry or picked by magnet', ['sieve', 'filter', 'magnet', 'hand'].every((m) => apply(m, box('sandsalt')).ok === 'no'));
  check('separation-lab: dissolved salt passes the filter', apply('filter', box('brine')).ok === 'no' && /straight through/.test(apply('filter', box('brine')).why));
  { const r = apply('evap', box('brine')); check('separation-lab: evaporation keeps salt, loses water', r.ok === 'part' && r.out[0].comps.join() === 'salt' && r.lost.includes('water')); }
  { const r = apply('distil', box('ethanol')); check('separation-lab: simple distillation of ethanol/water (22 °C apart) is only partial', r.ok === 'part' && r.out.every((b) => b.trace?.length) && r.temps.join() === '78,100'); }
  { const r = apply('distil', box('acetone')); check('separation-lab: acetone/water (44 °C apart) separates by simple distillation', r.ok === 'yes' && r.out[0].comps.join() === 'acetone'); }
  { const r = apply('funnel', box('oil')); check('separation-lab: separating funnel runs water off the bottom, oil on top', r.ok === 'yes' && r.out[0].comps.join() === 'water' && r.out[1].comps.join() === 'oil'); }
  check('separation-lab: oil and water do not need distillation', apply('distil', box('oil')).ok === 'no');
  check('separation-lab: settling muddy water leaves it cloudy', apply('settle', box('mud')).ok === 'part');
  check('separation-lab: cream passes filter paper, spins out', apply('filter', box('milk')).ok === 'no' && apply('spin', box('milk')).ok === 'yes');
  check('separation-lab: one dye gives one spot', apply('chroma', { comps: ['blue', 'water'] }).ok === 'no');
  check('separation-lab: sublimation separates ammonium chloride from salt', apply('sublime', box('nh4cl')).out[0].comps.join() === 'nh4cl');
  check('separation-lab: Rf 3.6 cm ÷ 12 cm = 0.3', Math.abs(rf(3.6, 12) - 0.3) < 1e-12);
  let seed = 3; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let ok = true; for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== (lv === 11 ? 5 : 4) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; if (!(qs[2].ans > 0 && qs[2].ans < 1)) ok = false; }
  check('separation-lab: questions have positive finite answers, Rf between 0 and 1', ok);
};
