// #464 epi curve. Binning checked against pandas 2 resample (D, 3D and 6h/12h from the first day's midnight,
// W-MON and W-SUN weeks labelled by their first day) on 300 random timed onsets with counts; attack-rate ratios
// against statsmodels Table2x2 riskratio_confint; Fisher p against SciPy fisher_exact; weighted median against numpy.
import * as C from '../../src/lib/sci/epicurve.ts';

const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async (check) => {
  const txt = 'Onset date,Cases\n2026-06-08,1\n2026-06-09,2\n2026-06-10,5\n2026-06-11,9\n2026-06-12,12\n2026-06-13,8\n2026-06-14,4\n2026-06-15,2\n2026-06-17,1\n';
  const p = C.parseOnsets(txt);
  check('epicurve: header skipped, 9 dated lines', p.errors.length === 0 && p.onsets.length === 9 && !p.timed);
  check('epicurve: daily bins with a zero day', JSON.stringify(C.epiCurve(p.onsets, { kind: 'days', size: 1 }).bins.map((b) => b.count)) === '[1,2,5,9,12,8,4,2,0,1]');
  check('epicurve: weeks from Monday (pandas W-MON)', JSON.stringify(C.epiCurve(p.onsets, { kind: 'week-mon', size: 7 }).bins.map((b) => [C.fmtDate(b.start), b.count])) === '[["2026-06-08",41],["2026-06-15",3]]');
  check('epicurve: weeks from Sunday (pandas W-SUN)', JSON.stringify(C.epiCurve(p.onsets, { kind: 'week-sun', size: 7 }).bins.map((b) => [C.fmtDate(b.start), b.count])) === '[["2026-06-07",37],["2026-06-14",7]]');
  check('epicurve: 3-day bins from the first day', JSON.stringify(C.epiCurve(p.onsets, { kind: 'days', size: 3 }).bins.map((b) => b.count)) === '[8,29,6,1]');
  // Timed onsets, 6-hour bins counted from midnight of the first day.
  const t = C.parseOnsets('2026-06-01 05:59\n2026-06-01 06:00, 2\n2026-06-01T23:30\n2026-06-02 01:00\n');
  check('epicurve: 6-hour bins', t.timed && JSON.stringify(C.epiCurve(t.onsets, { kind: 'hours', size: 6 }).bins.map((b) => [C.fmtDate(b.start, true), b.count])) === '[["2026-06-01 00:00",1],["2026-06-01 06:00",2],["2026-06-01 12:00",0],["2026-06-01 18:00",1],["2026-06-02 00:00",1]]');
  check('epicurve: bins widened to include the exposure day', JSON.stringify(C.epiCurve(p.onsets, { kind: 'days', size: 1 }, 2000, C.parseDate('2026-06-07')).bins.map((b) => b.count)) === '[0,1,2,5,9,12,8,4,2,0,1]');
  const s = C.summary(p.onsets, C.parseDate('2026-06-07'));
  check('epicurve: weighted median onset and incubation in days', s.total === 44 && C.fmtDate(s.median) === '2026-06-12' && s.incubation.min === 86400000 && s.incubation.max === 10 * 86400000 && s.incubation.median === 5 * 86400000);
  check('epicurve: even total median is the midpoint', C.summary(C.parseOnsets('2026-06-01\n2026-06-03').onsets).median === Date.UTC(2026, 5, 2));
  const e = C.parseOnsets('2026-02-30\n2026-06-01,x\n2026-06-01 25:00\n2026-06-02 08:15\n2026-06-03 3');
  check('epicurve: bad dates and counts reported by line', e.errors.length === 3 && e.errors[0].startsWith('Line 1') && e.onsets.length === 2 && e.onsets[1].n === 3);
  check('epicurve: a day-first date on the first line is an error, not a header', C.parseOnsets('10/06/2026').errors.length === 1);
  check('epicurve: date parsing', C.parseDate('2026/6/9') === Date.UTC(2026, 5, 9) && Number.isNaN(C.parseDate('09/06/2026')) && Number.isNaN(C.parseDate('2026-13-01')));
  check('epicurve: too many bins', (() => { try { C.epiCurve(C.parseOnsets('2020-01-01\n2026-01-01').onsets, { kind: 'hours', size: 1 }); return false; } catch (x) { return /wider bins/.test(x.message); } })());
  const ar = C.attackRates([{ name: 'Chicken salad', ateIll: 38, ateWell: 20, notIll: 6, notWell: 36 }, { name: 'Fruit', ateIll: 15, ateWell: 30, notIll: 29, notWell: 26 }]);
  check('epicurve: attack rates and ratio (statsmodels Table2x2)', near(ar[0].arAte, 38 / 58) && near(ar[0].arNot, 6 / 42) && near(ar[0].rr, 4.586206896551724) && near(ar[0].rrCI[0], 2.1363328353825177) && near(ar[0].rrCI[1], 9.845513465701384));
  check('epicurve: Fisher p (scipy)', near(ar[0].p / 2.423953241064338e-7, 1, 1e-7) && near(ar[1].p, 0.068749825415271) && near(ar[1].rrCI[1], 1.0247914570863115));
  check('epicurve: no ill non-eaters: ratio infinite, no interval', (() => { const r = C.attackRates([{ name: 'x', ateIll: 5, ateWell: 5, notIll: 0, notWell: 10 }])[0]; return r.rr === Infinity && Number.isNaN(r.rrCI[0]); })());
};
