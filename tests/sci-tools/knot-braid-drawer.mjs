// #546 knot and braid diagram drawer: maths checks. Reference Alexander polynomials made with sympy by a different
// route: the UNreduced Burau matrices [[1 − t, t], [1, 0]], det of I − ψ(β) with its last row and column deleted
// (exact rational functions), for the named knots and 25 random braids on 2 to 5 strands (random.seed(546)).
// The named values also match the standard knot tables (trefoil t − 1 + t⁻¹, figure-eight −t + 3 − t⁻¹, 5_2
// 2t − 3 + 2t⁻¹, 6_1 −2t + 5 − 2t⁻¹, T(3,4) t³ − t² + 1 − t⁻² + t⁻³, Hopf link t − 1).
import { parseBraid, wordText, permutation, components, writhe, freeReduce, linking, alexander, lpText, lp, mul, div, det, burau, evalUnit, NAMED } from '../../src/lib/sci/braids.ts';

const REF = [[2, [1], [0, [1]]], [2, [1, 1, 1], [-1, [1, -1, 1]]], [3, [1, -2, 1, -2], [-1, [-1, 3, -1]]], [2, [1, 1, 1, 1, 1], [-2, [1, -1, 1, -1, 1]]], [3, [1, 1, 1, 2, -1, 2], [-1, [2, -3, 2]]], [4, [1, 1, 2, -1, -3, 2, -3], [-1, [-2, 5, -2]]], [3, [1, 1, 1, -2, 1, -2], [-2, [-1, 3, -3, 3, -1]]], [3, [1, 1, -2, 1, -2, -2], [-2, [1, -3, 5, -3, 1]]], [2, [1, 1, 1, 1, 1, 1, 1], [-3, [1, -1, 1, -1, 1, -1, 1]]], [3, [1, 2, 1, 2, 1, 2, 1, 2], [-3, [1, -1, 0, 1, 0, -1, 1]]], [2, [1, 1], [0, [-1, 1]]], [2, [1, 1, 1, 1], [0, [-1, 1, -1, 1]]], [3, [1, -2, 1, -2, 1, -2], [0, [1, -4, 6, -4, 1]]], [2, [-1, 1, -1, -1, 1], [0, [1]]], [4, [3], [0, []]], [3, [2, 1, -1, 2, 2, -2], [0, []]], [4, [-3, -1], [0, []]], [3, [2, -1, 2, 1, 2, 1, -1, 2, -1, -2, 1, 2], [0, [1, -2, 1]]], [5, [1], [0, []]], [3, [-2, 2, 2], [0, []]], [2, [1, 1, -1], [0, [1]]], [2, [1, -1, 1, 1, 1, -1, -1, -1, 1], [0, [1]]], [4, [1, 3, 1, -3, 3, 1], [0, []]], [2, [-1, -1, 1, 1, -1, -1], [0, [-1, 1]]], [4, [-1, 1, -3, 3, 1, 1, -2], [0, []]], [5, [-2], [0, []]], [5, [1, -2, -2, -3, 2, -2, 3, -4, -2, 4], [0, []]], [3, [-1, -1, -2, -1, 1, 1, 1], [0, []]], [2, [1, -1, -1, -1, -1, -1, -1, -1, -1], [-3, [1, -1, 1, -1, 1, -1, 1]]], [2, [-1], [0, [1]]], [4, [1, 3, -2, 1, -1, 2, -2, -3, -3, -3], [0, [-1, 1]]], [2, [1, 1, 1, 1, 1], [-2, [1, -1, 1, -1, 1]]], [5, [-3, 1, -1, -1, -3, 3, -2, 2, -2, -1, 1], [0, []]], [3, [-1, -1, 2, 2, 2, -2, 2, -1, -2, -1, 2], [0, [-1, 2, -2, 1]]], [3, [2, 2, -1, -1, 2, 1, -1, 2, -2], [0, [-1, 2, -2, 1]]], [3, [-2, -2], [0, []]], [2, [1, 1, 1, -1, 1, -1, 1, -1, 1, -1], [0, [-1, 1]]], [2, [1], [0, [1]]]];

export default async (check) => {
  const same = (D, [lo, c]) => (c.length === 0 ? D.c.length === 0 : D.lo === lo && D.c.length === c.length && D.c.every((x, k) => x === BigInt(c[k])));
  { const bad = REF.filter(([n, w, ref]) => !same(alexander({ n, word: w }), ref)); check(`braids: Alexander polynomial agrees with sympy (unreduced Burau) on ${REF.length} braids ${bad.map((b) => b[1].join(' ')).join(' | ')}`, bad.length === 0); }
  const T = Object.fromEntries(NAMED.map((k) => [k.id, lpText(alexander(parseBraid(k.word)))]));
  check('braids: named table values', T['0_1'] === '1' && T['3_1'] === 't − 1 + t^-1' && T['4_1'] === '−t + 3 − t^-1' && T['5_2'] === '2t − 3 + 2t^-1' && T['6_1'] === '−2t + 5 − 2t^-1' && T['8_19'] === 't^3 − t^2 + 1 − t^-2 + t^-3' && T['L2a1'] === 't − 1' && T['L6a4'] === 't^4 − 4t^3 + 6t^2 − 4t + 1');
  check('braids: knot determinants |Δ(−1)|: trefoil 3, figure-eight 5, 5_2 7, 6_1 9', [['3_1', 3n], ['4_1', 5n], ['5_2', 7n], ['6_1', 9n]].every(([id, d]) => { const v = evalUnit(alexander(parseBraid(NAMED.find((k) => k.id === id).word)), -1n); return (v < 0n ? -v : v) === d; }));
  // Reading words.
  check('braids: reads σ1 σ2^-1, s1 s2^-1, σ₁σ₂⁻¹, 1 -2, a B', ['σ1 σ2^-1', 's1 s2^-1', 'σ₁σ₂⁻¹', '1 -2', 'a B', 'σ_1 σ_2^{-1}'].every((s) => parseBraid(s).word.join() === '1,-2'));
  check('braids: powers and brackets: (σ1 σ2^-1)^2 and (σ1 σ2)^-1', parseBraid('(σ1 σ2^-1)^2').word.join() === '1,-2,1,-2' && parseBraid('(σ1 σ2)^-1').word.join() === '-2,-1' && parseBraid('σ1^-3').word.join() === '-1,-1,-1');
  check('braids: strands from the word or set higher', parseBraid('σ3').n === 4 && parseBraid('σ1', 5).n === 5 && parseBraid('a').n === 2);
  { let ok = 0; for (const bad of ['', 'σ0', 'x?', '(σ1', 'σ1)', 'σ12']) { try { parseBraid(bad); } catch { ok++; } } check('braids: bad words rejected (empty, σ0, junk, brackets, too many strands)', ok === 6); }
  // Invariants.
  { const b = parseBraid('σ1 σ2^-1 σ1 σ2^-1'); check('braids: figure-eight: 4 crossings, writhe 0, one component, permutation', b.word.length === 4 && writhe(b) === 0 && components(b).length === 1 && permutation(b).join() === '1,2,0'); }
  { const b = parseBraid('σ1^2'); check('braids: Hopf link: 2 components, linking number 1', components(b).length === 2 && linking(b)[0][1] === 1); }
  check('braids: Borromean rings: 3 components, pairwise linking 0', (() => { const b = parseBraid('(σ1 σ2^-1)^3'), L = linking(b); return components(b).length === 3 && L.flat().every((v) => v === 0); })());
  check('braids: free reduction', freeReduce([1, 2, -2, -1, 3]).join() === '3' && freeReduce([-1, 2, 1], true).join() === '2');
  check('braids: word text', wordText([1, -2]) === 'σ1 σ2⁻¹');
  // Polynomial arithmetic and Burau.
  check('braids: exact polynomial division (t^3 − 1)/(t − 1) = t^2 + t + 1', lpText(div(lp([-1, 0, 0, 1]), lp([-1, 1]))) === 't^2 + t + 1');
  check('braids: Burau of σ1σ1⁻¹ is the identity', (() => { const B = burau(parseBraid('σ1 σ2 σ1^-1 σ2^-1 σ2 σ1 σ2^-1 σ1^-1')); return B.every((r, i) => r.every((e, j) => lpText(e) === (i === j ? '1' : '0'))); })());
  check('braids: braid relation σ1σ2σ1 = σ2σ1σ2 in Burau', (() => { const a = burau(parseBraid('σ1 σ2 σ1')), b = burau(parseBraid('σ2 σ1 σ2')); return a.every((r, i) => r.every((e, j) => lpText(e) === lpText(b[i][j]))); })());
  check('braids: determinant of a polynomial matrix', lpText(det([[lp([1, 1]), lp([2])], [lp([1]), lp([0, 1])]])) === 't^2 + t − 2');
  check('braids: product', lpText(mul(lp([1, -1]), lp([1, 1]))) === '−t^2 + 1');
};
