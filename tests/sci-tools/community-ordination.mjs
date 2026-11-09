// #306 community ordination: reference values from numpy 2 (SVD PCA), SciPy 1.18 (pdist braycurtis, linkage,
// cophenet, fcluster) and scikit-learn 1.9 (non-metric MDS, best of 5 x 10 starts) on the made-up example.
import * as O from '../../src/lib/sci/ordination.ts';

const T = `Species	Q1	Q2	Q3	Q4	Q5	Q6	Q7	Q8	Q9	Q10	Q11	Q12
Carex nigra	26	29	16	15	5	4	0	0	0	0	0	0
Juncus effusus	24	20	16	12	9	2	6	3	1	0	0	0
Caltha palustris	11	22	13	6	3	1	0	0	0	0	0	0
Mentha aquatica	5	5	5	8	11	4	3	2	0	1	0	0
Holcus lanatus	1	12	6	21	29	28	26	2	5	2	3	1
Lolium perenne	0	1	5	15	24	18	31	20	13	9	2	1
Trifolium repens	0	2	4	6	13	11	17	8	8	7	5	2
Plantago lanceolata	0	3	3	9	4	11	8	9	6	9	2	2
Festuca rubra	0	0	0	2	5	6	22	17	27	17	9	12
Ammophila arenaria	0	0	0	0	0	0	1	1	7	22	34	27
Jasione montana	0	0	0	0	0	0	1	1	6	5	4	5
Hypochaeris radicata	1	1	2	3	5	5	9	13	12	7	9	4`;

export default async (check) => {
  const rows = T.split('\n').map((r) => r.split('\t'));
  const X = rows[0].slice(1).map((_, j) => rows.slice(1).map((r) => +r[j + 1]));
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const p = O.pca(X, 3);
  check('ordination: PCA eigenvalues = numpy SVD', near(p.eig[0], 375.9129417353) && near(p.eig[1], 297.9276000789) && near(p.eig[2], 70.0416573277) && near(p.total, 786.8636363636365));
  check('ordination: PCA site scores = numpy (up to sign)', near(Math.abs(p.scores[0][0]), 29.20088173, 1e-8) && near(Math.abs(p.scores[0][1]), 14.24917674, 1e-8));
  const h = O.pca(O.transform(X, 'hellinger'), 3);
  check('ordination: Hellinger PCA = numpy', near(h.eig[0], 0.2586956057) && near(h.eig[1], 0.086602446) && near(h.total, 0.3753800678113962) && near(Math.abs(h.scores[0][0]), 0.73981692, 1e-7) && near(Math.abs(h.loadings[0][0]), 0.4610449, 1e-6));
  check('ordination: Hellinger PCA explains 68.9 % on axis 1', near(h.explained[0], 0.2586956057 / 0.3753800678113962));
  const D = O.distances(X, 'bray');
  check('ordination: Bray-Curtis = SciPy', near(D[0][1], 0.2147239263803681) && near(D[0][11], 0.9672131147540983));
  const ref = {
    average: [[0.1717171717, 0.1803278689, 0.2147239264, 0.2422360248, 0.2558629776, 0.2601514663, 0.2710347297, 0.3209245083, 0.4577626365, 0.6043421416, 0.7620087985], 0.7912557926673751],
    ward: [[0.1717171717, 0.1803278689, 0.2147239264, 0.2422360248, 0.269120782, 0.2835711126, 0.2952791541, 0.3669499976, 0.6795853561, 1.1265520636, 1.4669442025], 0.7497166085107305],
    single: [[0.1717171717, 0.1803278689, 0.2147239264, 0.2363636364, 0.2422360248, 0.2585365854, 0.2586206897, 0.2631578947, 0.2682926829, 0.29, 0.3053892216], 0.726531891780753],
    complete: [[0.1717171717, 0.1803278689, 0.2147239264, 0.2422360248, 0.261682243, 0.2753623188, 0.2789115646, 0.4208144796, 0.6043956044, 0.8543046358, 0.9705882353], 0.7899153880285772],
  };
  for (const [m, [hs, r]] of Object.entries(ref)) {
    const Z = O.cluster(D, m), c = O.cophenetic(Z, D);
    check(`ordination: ${m} linkage heights and cophenetic r = SciPy`, Z.every((z, k) => near(z[2], hs[k], 1e-8)) && near(c.r, r, 1e-9));
  }
  const Za = O.cluster(D, 'average');
  check('ordination: UPGMA merge order = SciPy', JSON.stringify(Za.map((z) => [z[0], z[1]])) === JSON.stringify([[4, 5], [10, 11], [0, 1], [7, 8], [2, 14], [6, 12], [9, 13], [3, 17], [15, 18], [19, 20], [16, 21]]));
  check('ordination: cut into 3 groups = SciPy fcluster', O.cutTree(Za, 12, 3).join('') === '111222233333');
  const Zh = O.cluster(O.distances(O.transform(X, 'hellinger'), 'euclid'), 'ward');
  check('ordination: Ward on Hellinger distance = SciPy', near(Zh[10][2], 2.0132902184759716, 1e-9));
  check('ordination: dendrogram Newick', O.linkageNewick([[0, 1, 0.2, 2], [2, 3, 0.5, 3]], ['A', 'B b', 'C']) === "(C:0.5,(A:0.2,'B b':0.2):0.3);");
  check('ordination: PAVA', JSON.stringify(O.pava([1, 3, 2, 4, 3, 3])) === JSON.stringify([1, 2.5, 2.5, 10 / 3, 10 / 3, 10 / 3]));
  const nm = O.nmds(D, 2, 20, 1);
  check(`ordination: NMDS stress-1 ${nm.stress.toFixed(6)} matches scikit-learn's best (0.023823)`, Math.abs(nm.stress - 0.0238232) < 2e-5);
  check('ordination: NMDS stress recomputed from the final configuration', near(O.stress1(D, nm.Y).stress, nm.stress, 1e-12) && nm.pairs.length === 66);
  const sh = nm.pairs; check('ordination: Shepard fit is monotone', sh.every((q, k) => k === 0 || q.fit >= sh[k - 1].fit - 1e-12));
  const ev = O.symEigen([[2, 1], [1, 2]]);
  check('ordination: Jacobi eigenvalues', near(ev.values[0], 3) && near(ev.values[1], 1));
};
