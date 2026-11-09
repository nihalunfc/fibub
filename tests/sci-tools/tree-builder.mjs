// #308 tree builder: reference values from an independent Python implementation of p, JC69 and K2P, Biopython 1.88
// (DistanceCalculator identity, DistanceTreeConstructor.nj, ParsimonyScorer over all 10,395 unrooted trees of 8 tips)
// and SciPy 1.18 (average linkage = UPGMA; Biopython's upgma() averages unweighted, i.e. WPGMA, so it is not used).
import * as T from '../../src/lib/sci/treebuild.ts';
import { parseNewick, distance } from '../../src/lib/sci/newick.ts';

const FA = `>Alpha
TCACCTCACCGGTATAGCAGCGAAGCGGTCAGTTTGCTAATGCGACTTCCTTACGGAACGTACTGTCTGGCCGCTGCTAG
>Beta
TCACCTCACCTGTATAGCAGCGAAGCGGTCAGTTTGCTAATGCGACTTCCTTACGGAACGTACTGTCTGGCCGGTGCTAG
>Gamma
TCACCTCACTTGTATAGCAGCGAAGCGGTCCGTTTGCTAATGCGGCTTCCTTACGGAACGCACTGTCTGGCCGGTAATAG
>Delta
TCACCTCACTTGTATAGCAGCGAAGCGGTCAGTTTGCTAATGCGGCTTCCTTACGGAACGTACTGTCTGGCCGGTAATAG
>Epsilon
TCACCTGACGTGTATAGCGG---AGTGGTCAGTTTGCCACCCGGGTGTAATTAGTGGGCATACTGGCTGGCACATGCTAC
>Zeta
TCACCTGACGTGTATAGCGGCACAGCTGTCAGTTTGCCACCCGGGTGTATTTAGTGGGCATACTGGCTGGCACATGCTAC
>Eta
TCATCTGACGTGTATGGAGGCGCAGCGGTCAGTTTGCCAACCTGGTGTGCTTAGTGCACATACTGACTGGCAGGTGCCAC
>Theta
CTTGCTCACGGGTATAACATCGCAGCGGTCAGTTTGCCAANCGGGTTTTCTAACGGGACATACTGGCTGGCAGGTGCTAC`;

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const S = T.parseFasta(FA), names = S.map((s) => s.name), n = S.length;
  check('tree builder: FASTA read', n === 8 && S.every((s) => s.seq.length === 80));
  const c07 = T.countPair(S[0].seq, S[7].seq);
  check('tree builder: Alpha-Theta counts (N skipped)', c07.sites === 79 && c07.ts === 9 && c07.tv === 12);
  check('tree builder: p, JC and K2P = Python', near(T.distance(c07, 'p'), 0.26582278481012656) && near(T.distance(c07, 'jc'), 0.32821666480702166) && near(T.distance(c07, 'k2p'), 0.3293424439868351));
  check('tree builder: complete deletion keeps 76 columns', T.cleanColumns(S).length === 76 && T.distanceMatrix(S, 'p', 'complete').counts[0][1].sites === 76 && T.distanceMatrix(S, 'p', 'pairwise').counts[0][1].sites === 80);
  check('tree builder: JC undefined past p = 0.75', Number.isNaN(T.distance({ sites: 4, diff: 3, ts: 1, tv: 2 }, 'jc')));
  const ref = { k2p: [0.34311798385636993, 0.48391118288222806, 0.04000948552896955, 0.7362116121321742, 0.2042186231115401, 0.07961635662875542], jc: [0.3423247233188189, 0.4820697184295857, 0.04000948552896955, 0.7333271243655002, 0.20357165146506276, 0.07927776495811449], p: [0.27680896042248887, 0.36036131463403914, 0.03896103896103896, 0.6030951801883161, 0.15665976132253823, 0.075] };
  for (const [m, r] of Object.entries(ref)) {
    const D = T.distanceMatrix(S, m, 'pairwise').D, e = T.nj(D), P = T.patristic(e, n);
    const tot = e.reduce((s, x) => s + x.len, 0);
    check(`tree builder: NJ (${m}) tip-to-tip lengths and total = Biopython`, near(P[0][7], r[0]) && near(P[2][5], r[1]) && near(P[4][5], r[2]) && near(tot, r[3]));
    const u = T.upgma(D, names);
    const t = parseNewick(u), tip = (nm) => t.nodes.find((x) => x.name === nm);
    const depthAlpha = distance(tip('Alpha'), t.root);
    check(`tree builder: UPGMA (${m}) root height = SciPy`, near(depthAlpha, r[4], 1e-8) && near(distance(tip('Alpha'), tip('Delta')), r[5], 1e-8) && t.nodes.every((x) => x === t.root || x.length >= 0));
  }
  const P = T.patterns(S);
  check('tree builder: 26 informative sites', P.informative === 26 && P.sites === 80);
  const mp = T.parsimony(P, true);
  check('tree builder: exact MP score 52, one best tree (brute force over all 10,395 trees)', mp.exact && mp.score === 52 && mp.trees.length === 1);
  check('tree builder: MP tree', T.edgesNewick(mp.trees[0].map(([a, b]) => ({ a, b, len: 1 })), names, false) === '(Alpha,Beta,((Gamma,Delta),(((Epsilon,Zeta),Eta),Theta)));');
  check('tree builder: branch and bound examined far fewer than 10,395 full trees', mp.examined < 10395);
  const hu = T.parsimony(P, false);
  check('tree builder: heuristic finds the same score', hu.score === 52 && !hu.exact);
  check('tree builder: Fitch score of a bad tree', T.fitchScore([[8, 0], [8, 4], [8, 9], [9, 1], [9, 10], [10, 5], [10, 11], [11, 2], [11, 12], [12, 6], [12, 13], [13, 3], [13, 7]], P) > 52);
  check('tree builder: tree counts', T.treeCount(8) === 10395 && T.treeCount(4) === 3 && T.treeCount(10) === 2027025);
  // A gap-free 6-taxon case scored by hand: one informative site splitting AB|CD... gives 1 change per variable site.
  const Q = T.patterns(T.parseFasta('>a\nAAC\n>b\nAAC\n>c\nGAT\n>d\nGCT'));
  check('tree builder: small hand example (score 3)', T.parsimony(Q, true).score === 3);
};
