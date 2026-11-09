// #729 Neural network toys: perceptron rule and Hopfield network, checked against an independent NumPy
// implementation (same update order and the same seeded random numbers, mulberry32 written again in Python).
import { trainPerceptron, perceptronEpoch, predict, rng, permutation, hebb, energy, recall, addNoise, overlap, capacity } from '../../src/lib/sci/nntoy.ts';

export default async (check) => {
  const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const C = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const set = (f) => C.map(([x, y]) => ({ x, y, c: f(x, y) }));
  const same = (got, want) => got.hist.length - 1 === want.length && want.every(([e, w, err, wr], i) => { const g = got.hist[i + 1]; return g.epoch === e && g.errors === err && g.wrong === wr && g.w.every((v, j) => close(v, w[j])); });
  const and = trainPerceptron(set((x, y) => x & y), 0.1, 50);
  check('nntoy: AND (rate 0.1) matches NumPy epoch by epoch and converges in 6', same(and, [[1, [0.1, 0.1, 0.1], 1, 3], [2, [0.2, 0.1, 0.0], 3, 2], [3, [0.2, 0.1, -0.1], 3, 1], [4, [0.2, 0.2, -0.1], 2, 2], [5, [0.2, 0.1, -0.2], 1, 0], [6, [0.2, 0.1, -0.2], 0, 0]]) && and.converged && and.hist.length - 1 === 6);
  const or = trainPerceptron(set((x, y) => x | y), 0.25, 50);
  check('nntoy: OR (rate 0.25) matches NumPy and converges in 4', same(or, [[1, [0.0, 0.25, 0.25], 1, 1], [2, [0.25, 0.25, 0.25], 2, 1], [3, [0.25, 0.25, 0.0], 1, 0], [4, [0.25, 0.25, 0.0], 0, 0]]) && or.converged);
  const xor = trainPerceptron(set((x, y) => x ^ y), 0.1, 30);
  check('nntoy: XOR never converges; 30 epochs match NumPy', same(xor, [[1, [-0.1, 0.0, 0.0], 2, 2], [2, [-0.1, 0.0, 0.1], 3, 2], [3, [-0.1, 0.0, 0.1], 4, 2], [4, [-0.1, 0.0, 0.1], 4, 2], [5, [-0.1, 0.0, 0.1], 4, 2], [6, [-0.1, 0.0, 0.1], 4, 2], [7, [-0.1, 0.0, 0.1], 4, 2], [8, [-0.1, 0.0, 0.1], 4, 2], [9, [-0.1, 0.0, 0.1], 4, 2], [10, [-0.1, 0.0, 0.1], 4, 2], [11, [-0.1, 0.0, 0.1], 4, 2], [12, [-0.1, 0.0, 0.1], 4, 2], [13, [-0.1, 0.0, 0.1], 4, 2], [14, [-0.1, 0.0, 0.1], 4, 2], [15, [-0.1, 0.0, 0.1], 4, 2], [16, [-0.1, 0.0, 0.1], 4, 2], [17, [-0.1, 0.0, 0.1], 4, 2], [18, [-0.1, 0.0, 0.1], 4, 2], [19, [-0.1, 0.0, 0.1], 4, 2], [20, [-0.1, 0.0, 0.1], 4, 2], [21, [-0.1, 0.0, 0.1], 4, 2], [22, [-0.1, 0.0, 0.1], 4, 2], [23, [-0.1, 0.0, 0.1], 4, 2], [24, [-0.1, 0.0, 0.1], 4, 2], [25, [-0.1, 0.0, 0.1], 4, 2], [26, [-0.1, 0.0, 0.1], 4, 2], [27, [-0.1, 0.0, 0.1], 4, 2], [28, [-0.1, 0.0, 0.1], 4, 2], [29, [-0.1, 0.0, 0.1], 4, 2], [30, [-0.1, 0.0, 0.1], 4, 2]]) && !xor.converged && xor.hist.at(-1).wrong === 2);
  const CL = [[0.2, 0.3, 0], [0.5, 0.1, 0], [0.1, 0.8, 0], [0.9, 0.7, 1], [0.6, 0.9, 1], [1.2, 0.4, 1], [0.4, 0.45, 0], [0.8, 0.5, 1]].map(([x, y, c]) => ({ x, y, c }));
  const cl = trainPerceptron(CL, 0.3, 100, [0.5, -0.2, 0.1]);
  check('nntoy: made-up clouds from non-zero start match NumPy', same(cl, [[1, [0.59, -0.215, -0.2], 3, 2], [2, [0.83, -0.02, -0.2], 4, 2], [3, [0.74, 0.085, -0.5], 3, 0], [4, [0.74, 0.085, -0.5], 0, 0]]) && cl.converged);
  check('nntoy: output is 1 only above zero', predict([1, 0, 0], 0, 5) === 0 && predict([1, 0, 0], 0.1, 0) === 1);
  check('nntoy: one epoch with no mistakes leaves weights alone', perceptronEpoch([1, 1, -1.5], set((x, y) => x & y), 0.5).errors === 0);
  const r = rng(42), want = [0.6011037519201636, 0.44829055899754167, 0.8524657934904099, 0.6697340414393693, 0.17481389874592423];
  check('nntoy: mulberry32 matches the Python version', want.every((v) => close(r(), v, 1e-15)));
  check('nntoy: permutation holds each index once', [...permutation(49, rng(3))].sort((a, b) => a - b).every((v, i) => v === i));

  const pats = ['#######...#......#......#......#......#......#...', '#......#......#......#......#......#......#######', '#.....##.....##.....#########.....##.....##.....#'].map((s) => [...s].map((c) => (c === '#' ? 1 : -1)));
  const W = hebb(pats), Wsum = W.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);
  check('nntoy: Hebbian weights match NumPy (three entries and the sum)', close(W[0][1], -0.02040816326530612) && close(W[3][10], 0.061224489795918366) && close(W[48][0], 0.02040816326530612) && close(Wsum, 21.06122448979592) && W[5][5] === 0 && W[2][9] === W[9][2]);
  check('nntoy: energy of each stored pattern matches NumPy', pats.every((p, i) => close(energy(W, p), [-23.346938775510207, -26.204081632653065, -26.040816326530614][i])));
  const cue = addNoise(pats[2], 12, 7);
  check('nntoy: noisy cue (12 flips, seed 7) matches NumPy', cue.join() === [1, -1, -1, -1, 1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, -1].join() && cue.filter((v, i) => v !== pats[2][i]).length === 12);
  const a = recall(W, cue, 'async', 3);
  check('nntoy: async recall energies and overlaps match NumPy', a.converged && a.sweeps === 1 && a.energies.every((e, i) => close(e, [-6.857142857142857, -26.040816326530614][i])) && pats.every((p, i) => close(overlap(a.states.at(-1), p), [-0.061224489795918366, 0.3469387755102041, 1.0][i])));
  const cases = [[18, 11, [1.0, 0.102, -0.0612], 1, [1.0, 0.102, -0.0612]], [24, 2, [1.0, 0.102, -0.0612], 3, [1.0, 0.102, -0.0612]], [22, 9, [-0.0612, 0.3469, 1.0], 1, [0.3469, 0.7551, 0.5918]]];
  for (const [k, seed, mA, sS, mS] of cases) {
    const c = addNoise(pats[0], k, seed), A = recall(W, c, 'async', 4), S = recall(W, c, 'sync', 4);
    check(`nntoy: ${k} flips (seed ${seed}): async and sync final overlaps match NumPy`, pats.every((p, i) => Math.abs(overlap(A.states.at(-1), p) - mA[i]) < 1e-4 && Math.abs(overlap(S.states.at(-1), p) - mS[i]) < 1e-4) && S.sweeps === sS);
    check(`nntoy: ${k} flips: async energy never rises`, A.energies.every((e, i) => i === 0 || e <= A.energies[i - 1] + 1e-12));
  }
  const two = hebb([[1, -1]]), cyc = recall(two, [1, 1], 'sync');
  check('nntoy: synchronous update can cycle between two states', cyc.cycle && !cyc.converged && recall(two, [1, 1], 'async', 1).converged);
  check('nntoy: capacity about 0.138 N', close(capacity(49), 6.762));
};
