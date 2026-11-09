// #408 Landmark digitiser and Procrustes analysis. Reference numbers come from an independent numpy GPA
// (SVD rotations) and scipy.spatial.procrustes, run on the tool's example.
import { parseLandmarks, gpa, tangent, pca, fit2, distanceMatrix, centroidSize, rotate, toTps, groupOf, EXAMPLE } from '../../src/lib/sci/procrustes.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ex = parseLandmarks(EXAMPLE);
  check('procrustes: example is TPS, 12 specimens of 7 landmarks', ex.format === 'TPS' && ex.specimens.length === 12 && ex.specimens.every((s) => s.pts.length === 7) && ex.specimens[0].name === 'A-01');
  const S = ex.specimens.map((s) => s.pts), g = gpa(S);
  check('procrustes: centroid sizes match numpy', near(g.sizes[0], 269.6719, 1e-4) && near(g.sizes[1], 354.1761, 1e-4) && near(g.sizes[2], 236.6888, 1e-4));
  check('procrustes: GPA converges', g.converged && g.iterations < 10);
  check('procrustes: distances to the mean match numpy GPA', near(g.dist[0], 0.1010033045, 1e-8) && near(g.dist[1], 0.0774891052, 1e-8) && near(g.dist[2], 0.0823303697, 1e-8));
  check('procrustes: aligned shapes and mean at unit centroid size', g.aligned.every((a) => near(centroidSize(a), 1, 1e-12)) && near(centroidSize(g.mean), 1, 1e-12));
  const p = pca(tangent(g.aligned, g.mean));
  check('procrustes: PCA has 2p − 4 = 10 components', p.values.length === 10);
  check('procrustes: PC1 and PC2 variance match numpy', near(p.values[0], 0.0062435033, 1e-9) && near(p.values[1], 0.00061008706, 1e-10) && near(p.share[0], 0.76501773, 1e-6));
  check('procrustes: PC scores match numpy (up to sign)', near(Math.abs(p.scores[0][0]), 0.0890341178, 1e-8) && near(Math.abs(p.scores[11][1]), 0.0213633261, 1e-8) && Math.sign(p.scores[0][0]) !== Math.sign(p.scores[11][0]));
  check('procrustes: two shapes, disparity matches scipy.spatial.procrustes', near(fit2(S[0], S[6]).disparity, 0.0229257792, 1e-9));
  check('procrustes: pairwise partial distance matches scipy', near(distanceMatrix(S)[0][6], 0.1518509308, 1e-9));
  // Invariance: moving, scaling and rotating a specimen does not change the result.
  const moved = S.map((s, i) => (i === 3 ? rotate(s, 1.1).map(([x, y]) => [x * 2.5 + 40, y * 2.5 - 7]) : s));
  const g2 = gpa(moved);
  check('procrustes: invariant to translation, scale and rotation', g2.dist.every((d, i) => near(d, g.dist[i], 1e-9)) && near(g2.sizes[3], g.sizes[3] * 2.5, 1e-9));
  // A mirror image is a different shape (no reflection).
  const tri = [[0, 0], [4, 0], [1, 3]], mir = tri.map(([x, y]) => [x, -y]);
  check('procrustes: identical shapes have distance 0, mirror image does not', near(fit2(tri, rotate(tri, 0.7)).partial, 0, 1e-12) && fit2(tri, mir).partial > 0.1);
  // Table input and TPS round trip.
  const tab = parseLandmarks('specimen,x1,y1,x2,y2,x3,y3\nP1,0,0,4,0,1,3\nP2,0,0,4,0,1,3.5\n');
  check('procrustes: reads a wide table', tab.format === 'table' && tab.specimens.length === 2 && tab.specimens[1].pts[2][1] === 3.5);
  check('procrustes: TPS round trip', JSON.stringify(parseLandmarks(toTps(ex.specimens)).specimens) === JSON.stringify(ex.specimens));
  const sc = parseLandmarks('LM=3\n0 0\n10 0\n0 10\nIMAGE=dir/fish 1.jpg\nSCALE=0.1\n');
  check('procrustes: TPS SCALE and IMAGE name', sc.specimens[0].name === 'fish 1' && near(sc.specimens[0].pts[1][0], 1, 1e-12) && sc.notes.length === 1);
  let e1 = ''; try { parseLandmarks('A,1,2,3'); } catch (e) { e1 = e.message; }
  let e2 = ''; try { parseLandmarks('LM3=2\n1 2 3\n'); } catch (e) { e2 = e.message; }
  check('procrustes: odd number of values and 3D are refused', e1.includes('even number') && e2.includes('2D'));
  check('procrustes: groups from names', groupOf('A-01') === 'A' && groupOf('Quarry_B 3') === 'Quarry' && groupOf('single') === 'single');
};
