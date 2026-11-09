// #410 Dendrochronology cross-dating helper. Every position of the example was checked against an independent
// pandas/scipy implementation (rolling means, scipy.stats.pearsonr, scipy.stats.norm): t-values, r, GLK and p agree
// to 1e-10.
import { parseSeries, parseRwl, buildMaster, slide, bpIndex, hollstein, corr, tOf, glk, stars, EXAMPLE_MASTER, EXAMPLE_SAMPLE } from '../../src/lib/sci/dendro.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const m = parseSeries(EXAMPLE_MASTER);
  check('dendro: example master is Tucson, 4 series', m.format === 'Tucson' && m.series.length === 4 && m.series[0].name === 'OAK01A' && m.series[0].start === 1601 && m.series[0].w.length === 172 && near(m.series[0].w[0], 2.2));
  const s = parseSeries(EXAMPLE_SAMPLE);
  check('dendro: example sample is a list of 80 widths', s.format === 'list' && s.series[0].w.length === 80);
  const M = buildMaster(m.series);
  check('dendro: master spans 1601 to 1800', M.start === 1601 && M.raw.length === 200 && M.count[0] === 1 && M.count[50] === 4);
  const res = slide(M, s.series[0].w, 30), best = [...res].sort((a, b) => b.tBP - a.tBP)[0];
  check('dendro: 221 positions with 30 rings overlap', res.length === 221);
  check('dendro: best match ends 1770 (Baillie-Pilcher t matches scipy)', best.end === 1770 && best.first === 1691 && near(best.tBP, 9.0647377309, 1e-8) && near(best.rBP, 0.7253659662, 1e-9) && best.nBP === 76);
  check('dendro: Hollstein t and GLK at 1770 match scipy', near(best.tH, 7.8924234697, 1e-8) && best.nH === 79 && near(best.glk, 55 / 79, 1e-12) && near(best.glkP, 0.00024353118, 1e-9) && stars(best.glkP) === '***');
  check('dendro: next best is far behind', [...res].sort((a, b) => b.tBP - a.tBP)[1].tBP < 3.1);
  // Formulas by hand.
  check('dendro: Baillie-Pilcher index', bpIndex([1, 2, 3, 4, 5]).map((v) => (Number.isNaN(v) ? 'x' : v)).join() === 'x,x,100,x,x' && near(bpIndex([2, 2, 4, 2, 2])[2], 100 * 4 / 2.4));
  check('dendro: Hollstein values', Number.isNaN(hollstein([1, 2])[0]) && near(hollstein([1, 2])[1], 100 * Math.log(2)) && Number.isNaN(hollstein([1, 0, 1])[2]));
  check('dendro: t from r', near(tOf(0.5, 27), 0.5 * 5 / Math.sqrt(0.75)) && near(corr([1, 2, 3, NaN], [2, 4, 6, 1]).r, 1) && corr([1, 2, 3, NaN], [2, 4, 7, 1]).n === 3);
  const g = glk([1, -1, 1, 0], [1, 1, 1, 2]);
  check('dendro: Gleichläufigkeit with a tie as half', near(g.g, 2.5 / 4) && g.n === 4 && near(g.z, 0.125 * 4));
  // Formats.
  const rwl = parseRwl('HEADER LINE ONE\nAB1     1990   100   120 -9999\n');
  check('dendro: Tucson -9999 means 0.001 mm and header lines are skipped', rwl.series.length === 1 && near(rwl.series[0].w[1], 0.12) && rwl.notes.length === 1);
  const t = parseSeries('year,T1,T2\n1900,1.2,\n1901,1.4,0.8\n1902,1.1,0.9\n');
  check('dendro: year table with gaps at the ends', t.format === 'table' && t.series.length === 2 && t.series[1].start === 1901 && t.series[1].w.length === 2);
  let e = ''; try { parseSeries('year,T1\n1900,1\n1902,2\n'); } catch (x) { e = x.message; }
  check('dendro: a gap in the years is refused', e.includes('no gaps'));
  check('dendro: widths on one line', parseSeries('1.2 1.3 1.1 0.9').series[0].w.length === 4);
};
