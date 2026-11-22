// Class 12 Biology, Chapter 10 Biotechnology and its Applications: live problems (original fibub questions). Ids start with c12b-bta-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-bta-insulin': {
    title: 'amino acids in insulin and proinsulin',
    make(r) {
      const a = 21, b = 30, c = choose(r, [31, 33, 35]), vials = pick(r, 2, 12, 1);
      return { a, b, c, vials, q: `<p>Human insulin has an A chain of ${a} amino acids and a B chain of ${b} amino acids. A bacterial culture was made to produce only A chains and another only B chains, in equal numbers of molecules. For ${vials * 100} molecules of insulin, how many amino acids in all are needed in the chains used?</p>`, answer: (a + b) * vials * 100, unit: 'amino acids', tol: 0, abs: 0.01,
        hint: 'One insulin molecule uses one A chain and one B chain. Add the two chain lengths, then multiply.',
        solution: steps(`One molecule needs ${a} + ${b} = ${a + b} amino acids (the C peptide is not part of the insulin).`, `For ${vials * 100} molecules: ${a + b} × ${vials * 100} = <b>${n((a + b) * vials * 100)}</b> amino acids.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.vials * 100; i++) t += x.a + x.b; return t; },
  },
  'c12b-bta-disulphide': {
    title: 'chains and bonds in a batch of insulin',
    make(r) {
      const k = pick(r, 50, 500, 50);
      return { k, q: `<p>Each insulin molecule has an A chain and a B chain joined by 2 disulphide bridges between them (the A chain also has one more inside itself). A mixture has ${k} A chains and ${k} B chains, and every chain finds a partner. How many inter-chain disulphide bridges form?</p>`, answer: 2 * k, unit: 'bridges', tol: 0, abs: 0.01,
        hint: 'Pair up A and B chains: how many molecules form? Each molecule has 2 inter-chain bridges.',
        solution: steps(`${k} A chains pair with ${k} B chains: ${k} insulin molecules.`, `Bridges between chains: ${k} × 2 = <b>${2 * k}</b>.`) };
    },
    verify: (x) => { let bridges = 0; for (let i = 0; i < x.k; i++) bridges += 1 + 1; return bridges; },
  },
  'c12b-bta-spray': {
    title: 'sprays saved by Bt cotton',
    make(r) {
      const area = pick(r, 2, 20, 1), before = pick(r, 6, 12, 1), after = pick(r, 1, 4, 1), cost = pick(r, 400, 900, 50);
      const saved = (before - after) * area * cost;
      return { area, before, after, cost, q: `<p>A farmer sprays insecticide ${before} times a season on non-Bt cotton and only ${after} times on Bt cotton, because bollworm is controlled. Each spray costs ₹${cost} per acre. If the farm has ${area} acres, how much money is saved on sprays in a season (₹)?</p>`, answer: saved, unit: '₹', tol: 0.01,
        hint: 'Sprays saved per acre = before − after. Multiply by the cost and the acres.',
        solution: steps(`Sprays saved per acre = ${before} − ${after} = ${before - after}.`, `Money saved = ${before - after} × ₹${cost} × ${area} acres = <b>₹${n(saved)}</b>.`) };
    },
    verify: (x) => { let t = 0; for (let a = 0; a < x.area; a++) for (let s = 0; s < x.before - x.after; s++) t += x.cost; return t; },
  },
  'c12b-bta-rnai': {
    title: 'matching RNA and complementary RNA',
    make(r) {
      const seq = choose(r, ['AUGGCUAAC', 'GGAUCCUUA', 'AAUUGCGCA', 'CCAUGGAAU', 'UUAGCCGAU']);
      const pair = { A: 'U', U: 'A', G: 'C', C: 'G' }, anti = [...seq].map((c) => pair[c]).join('');
      const gc = [...anti].filter((c) => c === 'G' || c === 'C').length;
      return { seq, gc, q: `<p>In RNAi a sense RNA has the sequence 5′-${seq}-3′. Its complementary (antisense) RNA pairs with it to make dsRNA. How many of the bases in the antisense RNA are G or C?</p>`, answer: gc, unit: 'bases', tol: 0, abs: 0.01,
        hint: 'Pair A with U, U with A, G with C and C with G. Count the G and C in the partner strand.',
        solution: steps(`Antisense (3′ to 5′): ${anti}.`, `Count G and C in it: <b>${gc}</b>.`, 'Complementary G and C in the antisense come from C and G in the sense strand, so the answer equals the G + C count of the sense strand too.') };
    },
    verify: (x) => [...x.seq].filter((c) => c === 'C' || c === 'G').length,
  },
};
