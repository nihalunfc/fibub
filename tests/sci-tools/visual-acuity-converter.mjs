// #496 visual acuity converter: checked against a separate Python implementation (math.log10) and published examples.
import * as A from '../../src/lib/sci/acuity.ts';
export default async (check) => {
  const near = (a, b, t = 1e-5) => Math.abs(a - b) <= t;
  const one = (s, plain) => A.parseValue(s, plain);
  const py = [ // value, logMAR, MAR, decimal, 20/x, 6/y, VAS, letters (Python, acuity.py)
    ['20/40', 0.30103, 2.0, 0.5, 40, 12, 84.9485, 69.9485],
    ['6/12+2', 0.26103, 1.824022, 0.548239, 36.480434, 10.94413, 86.9485, 71.9485],
    ['20/200', 1.0, 10, 0.1, 200, 60, 50, 35],
    ['20/25-1', 0.11691, 1.308911, 0.763994, 26.178214, 7.853464, 94.154499, 79.154499],
    ['6/9', 0.176091, 1.5, 0.666667, 30, 9, 91.195437, 76.195437],
    ['4/10', 0.39794, 2.5, 0.4, 50, 15, 80.103, 65.103],
    ['20/15', -0.124939, 0.75, 1.333333, 15, 4.5, 106.246937, 91.246937],
    ['3/60', 1.30103, 20, 0.05, 400, 120, 34.9485, 19.9485],
  ];
  for (const [s, L, mar, dec, ft, m, vas, let_] of py) {
    const p = one(s); const a = A.fromLogMAR(p.logmar);
    check(`acuity: ${s} matches Python in every notation`, p.kind === 'snellen' && near(a.logmar, L) && near(a.mar, mar) && near(a.decimal, dec) && near(a.feet, ft, 1e-4) && near(a.metres, m, 1e-4) && near(a.vas, vas, 1e-4) && near(a.letters, let_, 1e-4));
  }
  check('acuity: decimal, MAR, VAS, letters and logMAR inputs agree (logMAR 0.3)', ['logMAR 0.3', 'VAS 85', 'letters 70', 'mar 1.99526231'].every((s) => near(one(s).logmar, 0.3)) && near(one('0.5').logmar, 0.30103) && near(one('0.3', 'logmar').logmar, 0.3) && near(one('85', 'vas').logmar, 0.3) && near(one('70', 'letters').logmar, 0.3) && near(one('2', 'mar').logmar, 0.30103));
  check('acuity: Gregori 2010 example, 20/40 is about 70 ETDRS letters', Math.round(A.fromLogMAR(one('20/40').logmar).letters) === 70);
  check('acuity: Holladay 1997, the average of 20/20 and 20/200 is about 20/63, not 20/110', near(A.meanAcuity([0, 1]).feet, 63.2456, 1e-3));
  check('acuity: mean of 20/20, 20/40, 20/200 matches Python', near(A.meanAcuity(['20/20', '20/40', '20/200'].map((s) => one(s).logmar)).logmar, 0.433677) && near(A.meanAcuity([0, 0.30103, 1]).decimal, 0.368403, 1e-5));
  check('acuity: letters per line changes the ± step', near(A.parseValue('20/40+2', 'decimal', '', 0.025).logmar, 0.25103));
  const ls = A.lines();
  check('acuity: 17 chart lines, nominal labels', ls.length === 17 && ls[0].feet === '10' && ls[3].feet === '20' && ls[6].feet === '40' && ls[13].metres === '60' && ls[16].feet === '400' && ls.every((l) => near(l.vas, 100 - 50 * l.logmar) && near(l.letters, l.vas - 15)));
  check('acuity: nominal labels are within 3 % of the exact values', ls.every((l) => Math.abs(Number(l.feet) / (20 * l.mar) - 1) < 0.03 && Math.abs(Number(l.metres) / (6 * l.mar) - 1) < 0.03 && Math.abs(Number(l.decimal) * l.mar - 1) < 0.03));
  const nl = A.nearestLine(0.26);
  check('acuity: nearest line and letters', nl.line.feet === '40' && nl.letters === 2 && A.nearestLine(0.12).letters === -1);
  const many = A.parseMany('Right eye 20/40\nOD, 20/25-1\nLeft: logMAR 0.3\n0.5, 0.8\nabc\n# comment');
  check('acuity: many values with labels', many.length === 6 && many[0].label === 'Right eye' && many[1].label === 'OD' && many[2].label === 'Left' && near(many[2].logmar, 0.3) && many[3].label === '' && 'error' in many[5]);
  check('acuity: bad input messages', 'error' in one('20/0') && 'error' in one('0', 'decimal') && 'error' in one('hello') && one('logMAR 2.5').note.includes('Outside'));
  // Numbers used in the digital-chart agreement article (Yu 2026, Ups. J. Med. Sci. 131: e13537).
  check('acuity: 0.1 logMAR is 5 ETDRS letters and a MAR ratio of 1.258925',
    near(A.fromLogMAR(0).letters - A.fromLogMAR(0.1).letters, 5, 1e-9) && near(A.fromLogMAR(0.1).mar / A.fromLogMAR(0).mar, 1.2589254117941673, 1e-12));
  check('acuity: one chart line costs 1.55 m of Snellen denominator at 6/6 and 15.54 m at 6/60',
    near(A.fromLogMAR(0.1).metres - A.fromLogMAR(0).metres, 1.5535524707650037, 1e-9) && near(A.fromLogMAR(1.1).metres - A.fromLogMAR(1).metres, 15.53552470765004, 1e-9));
  { const dec = (A.fromLogMAR(0).decimal + A.fromLogMAR(1).decimal) / 2, wrong = A.toLogMAR('decimal', dec);
    check('acuity: averaging 6/6 and 6/60 as decimal is 12.018 letters too good',
      near(A.meanAcuity([0, 1]).logmar, 0.5, 1e-12) && near(wrong, 0.2596373105057561, 1e-12) && near(A.fromLogMAR(wrong).letters - A.meanAcuity([0, 1]).letters, 12.018134474712195, 1e-9)); }
  { const four = ['6/6', '6/12', '6/24', '6/60'].map((s) => one(s).logmar);
    const dec = four.reduce((t, l) => t + A.fromLogMAR(l).decimal, 0) / 4;
    check('acuity: four-class example, logMAR mean 0.475818 against decimal mean 0.334888',
      near(A.meanAcuity(four).logmar, 0.4757724967479859, 1e-12) && near(A.toLogMAR('decimal', dec), 0.33488826292494855, 1e-12)); }
};
