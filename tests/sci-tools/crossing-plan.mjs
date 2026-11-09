// #388 crossing plan and pedigree tracker: inbreeding and coancestry by the tabular method, checked against textbook
// values and an independent Python implementation (recursive coancestry, networkx ordering) on the example and
// five random 40-plant pedigrees with selfing, missing parents and inbred founders (all 8,382 values agree exactly).
import { build, readPedigree, readPlan, inbreeding, coancestry, ancestors, EXAMPLE_PED, EXAMPLE_PLAN } from '../../src/lib/sci/pedigree.ts';

export default async (check) => {
  const P = build(readPedigree(EXAMPLE_PED));
  const F = (id) => inbreeding(P, id);
  // Textbook values (Falconer and Mackay, Introduction to Quantitative Genetics, ch. 5).
  check('pedigree: selfing gives F = 1/2, selfing again 3/4', F('F2a') === 0.5 && F('S2') === 0.75);
  check('pedigree: full-sib mating F = 1/4, half-sib 1/8, backcross 1/4', F('X1') === 0.25 && F('X2') === 0.125 && F('BC1') === 0.25);
  check('pedigree: founders and outcrosses have F = 0', F('P1') === 0 && F('F1a') === 0 && F('X3') === 0);
  check('pedigree: plan coancestries (= offspring F)', readPlan(EXAMPLE_PLAN).map((c) => coancestry(P, c.female, c.male)).join(' ') === '0.25 0.375 0.15625 0');
  check('pedigree: coancestry of a plant with itself is (1 + F)/2', coancestry(P, 'S2', 'S2') === 0.875 && coancestry(P, 'P1', 'F1a') === 0.25);
  { // Repeated selfing: F_n = 1 - (1/2)^n.
    const rows = [{ id: 'S0', female: null, male: null, f0: 0 }]; for (let k = 1; k <= 8; k++) rows.push({ id: 'S' + k, female: 'S' + (k - 1), male: 'S' + (k - 1), f0: 0 });
    const S = build(rows); check('pedigree: eight generations of selfing, F = 1 - 2^-n', [1, 2, 3, 4, 5, 6, 7, 8].every((k) => Math.abs(inbreeding(S, 'S' + k) - (1 - 0.5 ** k)) < 1e-15));
    // Repeated full-sib mating: 0, 0.25, 0.375, 0.5, 0.59375 (Falconer's recurrence F_t = (1 + 2F_{t-1} + F_{t-2})/4).
    const fs = [{ id: 'a0', female: null, male: null, f0: 0 }, { id: 'b0', female: null, male: null, f0: 0 }];
    for (let k = 1; k <= 6; k++) for (const s of ['a', 'b']) fs.push({ id: s + k, female: 'a' + (k - 1), male: 'b' + (k - 1), f0: 0 });
    const B = build(fs), want = [0, 0]; for (let k = 2; k <= 7; k++) want.push((1 + 2 * want[k - 1] + want[k - 2]) / 4);
    check('pedigree: repeated full-sib mating follows the recurrence', [1, 2, 3, 4, 5, 6].every((k) => Math.abs(inbreeding(B, 'a' + k) - want[k]) < 1e-15) && Math.abs(inbreeding(B, 'a4') - 0.5) < 1e-15);
    // An inbred founder line (F = 1) crossed to itself stays at 1; crossed to another gives 0.
    const L = build(readPedigree('L1,-,-,1\nL2,-,-,1\nL1s,L1,L1\nH,L1,L2'));
    check('pedigree: inbred founders (pure lines)', inbreeding(L, 'L1s') === 1 && inbreeding(L, 'H') === 0 && coancestry(L, 'L1', 'L1') === 1 && coancestry(L, 'H', 'L1') === 0.5);
  }
  { // A random pedigree from the Python cross-check (r0): every F, and some coancestries.
    const ped = [["n1",null,null,0],["n13",null,null,0],["n12","n7","n2",0.0],["n22","n3","n3",0.0],["n19","n18",null,0.0],["n16","n13","n10",0.0],["n28","n4","n12",0.0],["n35",null,null,0],["n4",null,null,0],["n23",null,null,0.5],["n9","n1","n0",0.0],["n24","n8","n1",0.0],["n37","n20","n11",0.0],["n38","n16","n24",0.0],["n0",null,null,0],["n3",null,null,1.0],["n34","n22","n17",0.0],["n8","n3","n6",0.0],["n25",null,null,0],["n18","n17","n3",0.0],["n32","n0",null,0.0],["n31","n29","n8",0.0],["n29","n12","n19",0.0],["n2",null,null,0.5],["n5",null,null,0],["n39","n36","n8",0.0],["n7","n4","n3",0.0],["n26","n13","n8",0.0],["n21","n4","n4",0.0],["n10",null,null,0.5],["n30","n25","n13",0.0],["n36","n1","n16",0.0],["n33","n8","n8",0.0],["n6","n3","n1",0.0],["n27",null,null,0.5],["n11","n6","n6",0.0],["n20","n15","n15",0.0],["n15","n6","n6",0.0],["n17","n8","n5",0.0],["n14","n4","n6",0.0]];
    const want = {"n1":0,"n13":0,"n12":0.0,"n22":1.0,"n19":0.0,"n16":0.0,"n28":0.125,"n35":0,"n4":0,"n23":0.5,"n9":0.0,"n24":0.125,"n37":0.5,"n38":0.0,"n0":0,"n3":1.0,"n34":0.375,"n8":0.5,"n25":0,"n18":0.375,"n32":0.0,"n31":0.234375,"n29":0.0859375,"n2":0.5,"n5":0,"n39":0.0625,"n7":0.0,"n26":0.0,"n21":0.5,"n10":0.5,"n30":0.0,"n36":0.0,"n33":0.75,"n6":0.0,"n27":0.5,"n11":0.5,"n20":0.75,"n15":0.5,"n17":0.0,"n14":0.0};
    const co = {"n31|n29":0.388671875,"n39|n33":0.40625,"n20|n11":0.5,"n34|n18":0.5625,"n38|n36":0.203125,"n28|n7":0.25};
    const R = build(ped.map(([id, female, male, f0]) => ({ id, female, male, f0 })));
    check('pedigree: random 40-plant pedigree, every F = Python', Object.entries(want).every(([k, v]) => Math.abs(inbreeding(R, k) - v) < 1e-12) && Object.keys(want).length === 40);
    check('pedigree: random pedigree coancestries = Python', Object.entries(co).every(([k, v]) => { const [a, b] = k.split('|'); return Math.abs(coancestry(R, a, b) - v) < 1e-12; }));
    let sym = true; for (let i = 0; i < R.n; i++) for (let j = 0; j < R.n; j++) if (R.A[i * R.n + j] !== R.A[j * R.n + i]) sym = false;
    check('pedigree: relationship matrix symmetric, parents before offspring', sym && R.entries.every((e, i) => [e.female, e.male].every((p) => !p || R.index.get(p) < i)));
  }
  { // Errors and warnings.
    const err = (t) => { try { build(readPedigree(t)); return ''; } catch (e) { return e.message; } };
    check('pedigree: a loop is found', err('A,B,C\nB,A,D').includes('loop') && err('A,A,B').includes('own parent'));
    check('pedigree: conflicting duplicates refused', err('A,B,C\nA,B,D').includes('listed twice with different parents'));
    check('pedigree: bad founder inbreeding refused', err('A,-,-,1.5').includes('0 to 1'));
    const W = build(readPedigree('plant,female,male\nK1,M,N\nK2,N,M\nK1,M,N'), { sexCheck: true });
    check('pedigree: parents added as founders, repeat ignored, sex check', W.added.join() === 'M,N' && W.warnings.some((w) => w.includes('repeat')) && W.warnings.some((w) => w.includes('both a female and a male parent: M, N')));
    check('pedigree: one known parent counts, unknown is 0', inbreeding(build(readPedigree('C,A,?\nD,C,A')), 'D') === 0.25);
    check('pedigree: ancestors of S2', ancestors(P, 'S2').join() === 'P1,P2,F1a,F2a,S2');
  }
};
