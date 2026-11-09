// #213 SAR table builder. Reference numbers from an independent NumPy implementation (itertools for the matched
// pairs, numpy mean / std with ddof=1) on the page's made-up example and six random made-up series in
// sar-table.ref.json (2 or 3 R positions, repeats, < and > limits): every pIC50, LE, LLE, transform, group score and
// matrix cell agrees to 1e-9. Plus definitions checked by hand.
import { readFileSync } from 'node:fs';
import { parseSeries, combos, matchedPairs, transforms, groupScores, matrix, toP, fromP, unitFromHeader, pNameFor, LE_K, EXAMPLE } from '../../src/lib/sci/sar.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;
  const S = (t, u) => parseSeries(parseTable(t), u);
  const ex = S(EXAMPLE);
  check('sar: example read (25 compounds, R1 and R2, IC50 in nM, HA and cLogP)', ex.cpds.length === 25 && ex.rNames.join() === 'R1,R2' && ex.unit === 'nM' && ex.pName === 'pIC50' && ex.hasHA && ex.hasLogP);
  const c12 = ex.cpds[11];
  check('sar: SAR-12 5.6 nM is pIC50 8.2518, LE 0.4522, LLE 5.6518 (NumPy)', near(c12.p, 8.2518119729938) && near(c12.le, 0.45219929612006027) && near(c12.lle, 5.6518119729938));
  check('sar: LE factor 1.37 sits between 2.303RT at 298 K and 300 K', LE_K === 1.37 && near(Math.LN10 * 1.987204e-3 * 298.15, 1.364, 1e-3) && near(Math.LN10 * 1.987204e-3 * 300, 1.372, 1e-3));
  const c24 = ex.cpds[23];
  check('sar: ">10000 nM" is pIC50 < 5 and censored', c24.qual === '<' && near(c24.p, 5) && combos(ex).find((c) => c.ids[0] === 'SAR-24').censored);
  const pairs = matchedPairs(ex), tr = transforms(pairs);
  check('sar: example has 87 matched pairs and 25 distinct changes (NumPy)', pairs.length === 87 && tr.length === 25);
  const t1 = tr.find((t) => t.pos === 1 && t.from === 'NHMe' && t.to === 'morpholino');
  check('sar: NHMe → morpholino: n 6, mean +0.5903, SD 0.4636 (NumPy)', t1.n === 6 && near(t1.mean, 0.5902975577504758) && near(t1.sd, 0.4635988162940591) && near(t1.max, 1.4279032320494807));
  const t2 = tr.find((t) => t.pos === 0 && t.from === 'H' && t.to === '4-Cl');
  check('sar: H → 4-Cl: n 4, mean +0.9032 (NumPy)', t2.n === 4 && near(t2.mean, 0.9032223352026534) && near(t2.sd, 0.43079462262595));
  check('sar: changes with one pair have no SD', tr.filter((t) => t.n === 1).every((t) => Number.isNaN(t.sd)));
  const g1 = groupScores(ex, 0, pairs), g2 = groupScores(ex, 1, pairs);
  check('sar: best and worst R1 are 4-Cl (+0.6528) and 4-CN (−0.5152)', g1[0].group === '4-Cl' && near(g1[0].score, 0.6528169337543798) && g1.at(-1).group === '4-CN' && near(g1.at(-1).score, -0.5151897754204293) && g1.at(-1).pairs === 10);
  check('sar: best and worst R2 are morpholino (+0.6212) and NMe2 (−0.7827)', g2[0].group === 'morpholino' && near(g2[0].score, 0.6212077440855218) && g2.at(-1).group === 'NMe2' && near(g2.at(-1).score, -0.7826691162380222) && near(g2.at(-1).meanP, 6.0434654195684985));
  const m = matrix(ex, 0, 1);
  check('sar: matrix 6 × 5, 4-Cl/morpholino 8.2518, 4-CN/NMe2 censored at 5, H/piperidino empty', m.rows.length === 6 && m.cols.length === 5 && near(m.cells[2][2].mean, 8.2518119729938) && m.cells[5][1].censored && near(m.cells[5][1].mean, 5) && m.cols[4] === 'piperidino' && Number.isNaN(m.cells[0][4].mean) && m.cells[0][4].n === 0);
  const mp = matrix(ex, 0, 1, 'potency');
  check('sar: potency order puts 4-Cl and morpholino first', mp.rows[0] === '4-Cl' && mp.cols[0] === 'morpholino' && mp.rows.at(-1) === 'H');
  // Random series against NumPy.
  const ref = JSON.parse(readFileSync(new URL('./sar-table.ref.json', import.meta.url), 'utf8'));
  let bad = 0, n = 0;
  for (const set of ref.sets) {
    const s = S(set.text), cs = combos(s), ps = matchedPairs(s, cs);
    if (ps.length !== set.npairs) bad++;
    for (const t of transforms(ps)) { const r = set.trans[`${t.pos}|${t.from}|${t.to}`]; n++; if (!r || r.n !== t.n || !near(t.mean, r.mean) || !near(t.min, r.min) || !near(t.max, r.max) || (r.sd === null ? !Number.isNaN(t.sd) : !near(t.sd, r.sd))) bad++; }
    s.rNames.forEach((_, k) => groupScores(s, k, ps, cs).forEach((g) => { const r = set.scores[`${k}|${g.group}`]; n++; if (!r || r.pairs !== g.pairs || (r.score === null ? Number.isFinite(g.score) : !near(g.score, r.score)) || (r.meanP === null ? Number.isFinite(g.meanP) : !near(g.meanP, r.meanP))) bad++; }));
    const mm = matrix(s, 0, 1, 'input', cs);
    mm.rows.forEach((a, i) => mm.cols.forEach((b, j) => { const r = set.mat[`${a}|${b}`]; n++; if (r === null ? Number.isFinite(mm.cells[i][j].mean) : !near(mm.cells[i][j].mean, r)) bad++; }));
  }
  check(`sar: six random series agree with NumPy (${n} values: pairs, changes, scores, cells)`, bad === 0 && n > 200);
  // Definitions by hand.
  check('sar: units to p (1 µM = 6, 10 nM = 8, 1 mM = 3, 100 pM = 10, 1e-7 M = 7)', near(toP(1, 'uM'), 6) && near(toP(10, 'nM'), 8) && near(toP(1, 'mM'), 3) && near(toP(100, 'pM'), 10) && near(toP(1e-7, 'M'), 7) && near(toP(7.3, 'p'), 7.3) && near(fromP(8, 'nM'), 10));
  check('sar: units from headers', unitFromHeader('IC50 (nM)') === 'nM' && unitFromHeader('Ki µM') === 'uM' && unitFromHeader('EC50 (uM)') === 'uM' && unitFromHeader('pIC50') === 'p' && unitFromHeader('IC50 (M)') === 'M' && unitFromHeader('Activity') === null && unitFromHeader('Potency (nM)') === 'nM');
  check('sar: p names', pNameFor('Ki (nM)', 'nM') === 'pKi' && pNameFor('EC50 uM', 'uM') === 'pEC50' && pNameFor('pKd', 'p') === 'pKd' && pNameFor('Activity (nM)', 'nM') === 'pAct');
  const rep = S('ID,R1,R2,IC50 (nM)\na,H,Me,10\nb,H,Me,1000\nc,F,Me,<1\nd,F,Me,50\ne,Cl,Me,>1000');
  const rc = combos(rep);
  check('sar: repeats averaged on the p scale (10 and 1000 nM → pIC50 7 = 100 nM geometric mean)', near(rc[0].p, 7) && rc[0].n === 2);
  check('sar: a limit is dropped when the same compound has a measured value', near(rc[1].p, toP(50, 'nM')) && !rc[1].censored && rc[2].censored && rc[2].qual === '<');
  const rp = matchedPairs(rep);
  check('sar: censored compounds left out of pairs; H → F delta = 7.301 − 7', rp.length === 1 && rp[0].from === 'H' && rp[0].to === 'F' && near(rp[0].delta, toP(50, 'nM') - 7));
  const three = S('Cpd\tR1\tR2\tR3\tpKi\nA\tH\tMe\tOH\t6\nB\tF\tMe\tOH\t6.5\nC\tF\tEt\tOH\t7\nD\tF\tEt\tNH2\t8\nE\tH\tEt\tNH2\t7.4');
  const tp = matchedPairs(three);
  check('sar: three positions, pKi as given; pairs differ at exactly one place', three.unit === 'p' && three.pName === 'pKi' && tp.length === 4 && tp.every((p) => p.a.r.filter((g, k) => g !== p.b.r[k]).length === 1));
  const sc = groupScores(three, 0, tp);
  check('sar: score of F at R1 = mean of +0.5 and +0.6', sc[0].group === 'F' && near(sc[0].score, 0.55) && near(sc[1].score, -0.55));
  check('sar: no HA or logP columns gives NaN LE and LLE', Number.isNaN(three.cpds[0].le) && !three.hasHA && !three.hasLogP);
  const err = (t, u, part) => { try { S(t, u); return false; } catch (e) { return e.message.includes(part); } };
  check('sar: bad input messages', err('R1,IC50 (nM)\nH,10', 'auto', 'at least two') && err('ID,R1,R2\na,H,Me\nb,F,Me', 'auto', 'No activity column') && err('ID,R1,IC50\na,H,10\nb,F,5', 'auto', 'Say the unit')
    && err('ID,R1,IC50 (nM)\na,H,ten\nb,F,5', 'auto', 'not a number') && err('ID,R1,IC50 (nM)\na,H,0\nb,F,5', 'auto', 'above 0') && err('ID,R1,R2,IC50 (nM)\na,H,,10\nb,F,Me,5', 'auto', 'R2 is empty')
    && err('ID,IC50 (nM),HA\na,10,20\nb,5,21', 'auto', 'No R-group') && err('ID,R1,pIC50\na,H,700\nb,F,7', 'auto', 'outside the usual p range'));
  check('sar: picked unit overrides the header', near(S('ID,R1,IC50\na,H,10\nb,F,5', 'uM').cpds[0].p, 5));
};
