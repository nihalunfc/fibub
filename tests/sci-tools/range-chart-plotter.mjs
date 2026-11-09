// #409 Range chart and diversity through time. Counts checked against an independent pandas implementation
// (boundary crossing worked out from the ages directly) on the example and four random sets of 60 taxa.
import { parseTaxa, equalBins, edgeBins, analyse, binOf, countBins, EXAMPLE } from '../../src/lib/sci/ranges.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  const taxa = parseTaxa(parseTable(EXAMPLE), 'ages').taxa;
  check('ranges: example has 24 taxa', taxa.length === 24 && taxa[0].name === 'Taxon A' && taxa[4].first === 104 && taxa[4].last === 104);
  const bins = equalBins(taxa, 10);
  check('ranges: 10 Myr bins from 120 to 60 Ma', bins.length === 6 && bins[0].base === 120 && bins[5].top === 60 && bins[0].name === '120–110');
  const c = analyse(taxa, 'ages', bins).counts;
  const row = (k) => [c[k].total, c[k].FL, c[k].bL, c[k].Ft, c[k].bt, c[k].originations, c[k].extinctions, c[k].meanStanding].join(',');
  check('ranges: counts per bin match pandas', row(0) === '3,1,0,2,0,3,1,1' && row(1) === '5,1,0,2,2,3,1,3' && row(2) === '9,2,1,3,3,5,3,5' && row(3) === '11,2,3,3,3,5,5,6' && row(4) === '11,1,4,4,2,5,5,6' && row(5) === '9,3,6,0,0,3,9,3');
  check('ranges: Foote rates match pandas', near(c[2].p, Math.log(2)) && near(c[2].q, 0.2876820724517809) && near(c[4].pTime, 0.10986122886681098) && Number.isNaN(c[0].p) && Number.isNaN(c[5].q));
  // Boundary rules.
  const b2 = edgeBins([100, 90, 80]);
  check('ranges: a first appearance on a boundary is in the younger bin, a last appearance in the older', binOf(90, b2, 'first') === 1 && binOf(90, b2, 'last') === 0 && binOf(80, b2, 'first') === 1 && binOf(100, b2, 'last') === 0 && binOf(79, b2, 'last') === -1);
  const ends = analyse([{ name: 'a', first: 95, last: 90 }, { name: 'b', first: 95, last: 85 }, { name: 'c', first: 90, last: 90 }], 'ages', b2).counts;
  check('ranges: ending at a boundary does not cross it; a one-age taxon on a boundary goes young', ends[0].bL === 0 && ends[0].Ft === 1 && ends[0].FL === 1 && ends[1].FL === 1 && ends[1].bL === 1);
  // Numbered and named bins.
  const named = parseTaxa(parseTable('taxon,first,last\nx,Early,Late\ny,2,3\nz,Middle,Middle'), 'bins', ['Early', 'Middle', 'Late']).taxa;
  const nb = analyse(named, 'bins', ['Early', 'Middle', 'Late'].map((name) => ({ name }))).counts;
  check('ranges: named bins', named[0].first === 1 && named[0].last === 3 && nb[1].total === 3 && nb[1].bt === 1 && nb[1].FL === 1 && nb[1].Ft === 1 && Number.isNaN(nb[1].pTime));
  check('ranges: countBins by index', countBins([{ f: 0, l: 2 }], [{ name: 'a' }, { name: 'b' }, { name: 'c' }]).map((x) => x.bt).join() === '0,1,0');
  // Bad input.
  const err = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('ranges: younger first appearance refused', err(() => parseTaxa([['a', '50', '60']], 'ages')).includes('younger than the last'));
  check('ranges: bin after last refused', err(() => parseTaxa([['a', '3', '2']], 'bins')).includes('Bin 1 is the oldest'));
  check('ranges: not an age refused', err(() => parseTaxa([['taxon', 'first', 'last'], ['a', 'abc', '2']], 'ages')).includes('not an age'));
  check('ranges: outside the bins refused', err(() => analyse([{ name: 'a', first: 130, last: 95 }], 'ages', b2)).includes('outside the bins'));
  check('ranges: boundaries must get younger', err(() => edgeBins([90, 100])).includes('must get younger'));
  check('ranges: one age means a one-horizon taxon', parseTaxa([['a', '50']], 'ages').taxa[0].last === 50);
};
