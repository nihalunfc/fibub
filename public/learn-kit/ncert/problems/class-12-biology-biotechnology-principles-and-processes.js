// Class 12 Biology, Chapter 9 Biotechnology: Principles and Processes: live problems (original fibub questions). Ids start with c12b-btp-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-btp-pcr': {
    title: 'copies made by PCR',
    make(r) {
      const n0 = choose(r, [1, 2, 4, 5, 10, 50]), cyc = pick(r, 8, 30, 1);
      return { n0, cyc, q: `<p>A PCR tube starts with ${n0} ${n0 > 1 ? 'copies' : 'copy'} of the target DNA. Every cycle doubles the number of copies. How many copies of the target are there after ${cyc} cycles?</p>`, answer: n0 * Math.pow(2, cyc), unit: 'copies', tol: 0.01,
        hint: 'One cycle: 1 becomes 2, 2 becomes 4. After n cycles the number is multiplied by 2 n times.',
        solution: steps(`Each cycle multiplies the copies by 2, so after ${cyc} cycles they are multiplied by 2^${cyc} = ${n(Math.pow(2, cyc))}.`, `Copies = ${n0} × 2^${cyc} = <b>${n(n0 * Math.pow(2, cyc))}</b>.`) };
    },
    verify: (x) => { let c = x.n0; for (let i = 0; i < x.cyc; i++) c += c; return c; },
  },
  'c12b-btp-cycles': {
    title: 'cycles needed to reach a target number',
    make(r) {
      const goal = choose(r, [1e3, 1e4, 1e5, 1e6, 1e9]), n0 = choose(r, [1, 2, 4, 8]);
      const need = Math.ceil(Math.log2(goal / n0));
      return { goal, n0, q: `<p>You start with ${n0} ${n0 > 1 ? 'copies' : 'copy'} of a gene and want at least ${n(goal)} copies. What is the smallest whole number of PCR cycles (perfect doubling each time) that does it?</p>`, answer: need, unit: 'cycles', tol: 0, abs: 0.01,
        hint: 'Find n so that start × 2^n is at least the goal. Try powers of 2: 2^10 = 1024.',
        solution: steps(`We need ${n0} × 2^n ≥ ${n(goal)}, so 2^n ≥ ${n(goal / n0)}.`, `log₂(${n(goal / n0)}) = ${n(Math.log2(goal / n0), 4)}, so n must be at least that, rounded up.`, `Smallest whole number: <b>${need}</b> cycles.`) };
    },
    verify: (x) => { let c = x.n0, k = 0; while (c < x.goal && k < 60) { c *= 2; k++; } return k; },
  },
  'c12b-btp-sites': {
    title: 'how often a restriction site occurs',
    make(r) {
      const len = choose(r, [4096, 16384, 40960, 163840, 409600, 1638400]), nt = choose(r, [4, 6]);
      const ans = len / Math.pow(4, nt);
      return { len, nt, q: `<p>On average, a particular ${nt}-base recognition sequence turns up once in every 4^${nt} base pairs (each position has 4 possible bases, chosen at random). About how many EcoRI-type sites (${nt} bases long) would you expect in a random DNA of ${n(len)} bp?</p>`, answer: ans, unit: 'sites', tol: 0.02,
        hint: 'Chance that a given stretch matches = (1/4)^(length of the site). Sites ≈ DNA length × chance.',
        solution: steps(`A ${nt}-base site matches with probability (1/4)^${nt} = 1/${n(Math.pow(4, nt))}.`, `Expected sites = ${n(len)} ÷ ${n(Math.pow(4, nt))} = <b>${n(ans)}</b>.`) };
    },
    verify: (x) => x.len * Math.pow(0.25, x.nt),
  },
  'c12b-btp-frag': {
    title: 'fragments from cutting DNA',
    make(r) {
      const cuts = pick(r, 1, 7, 1), shape = choose(r, ['linear', 'circular']);
      return { cuts, shape, q: `<p>A ${shape} piece of DNA is cut by a restriction enzyme at ${cuts} different site${cuts > 1 ? 's' : ''}. How many fragments are formed?</p>`, answer: shape === 'linear' ? cuts + 1 : cuts, unit: 'fragments', tol: 0, abs: 0.01,
        hint: 'A linear piece is like a string, a plasmid is like a ring. Cut a string once and you get two pieces; cut a ring once and you still have one piece (now open).',
        solution: steps(shape === 'linear' ? 'Linear DNA has two free ends, so every cut adds one piece: fragments = cuts + 1.' : 'A circular DNA has no ends. The first cut only opens the ring, so fragments = cuts.', `Answer: <b>${shape === 'linear' ? cuts + 1 : cuts}</b>.`) };
    },
    verify: (x) => { const gaps = Array.from({ length: x.cuts }, (_, i) => i); return x.shape === 'linear' ? gaps.length + 1 : gaps.length; },
  },
  'c12b-btp-ladder': {
    title: 'fragment sizes add up',
    make(r) {
      const tot = choose(r, [6000, 8000, 10000, 12000, 15000]), a = pick(r, 500, 2500, 250), b = pick(r, 500, 2500, 250);
      return { tot, a, b, q: `<p>A linear DNA of ${n(tot)} bp is cut by two enzymes together and gives three bands on a gel. Two bands are ${n(a)} bp and ${n(b)} bp. How long is the third fragment?</p>`, answer: tot - a - b, unit: 'bp', tol: 0,  abs: 0.01,
        hint: 'No DNA is lost in a digest: the pieces add up to the whole.',
        solution: steps(`Total = ${n(tot)} bp.`, `Third = ${n(tot)} − ${n(a)} − ${n(b)} = <b>${n(tot - a - b)} bp</b>.`, 'On the gel it would run between the two ends: the larger a piece, the nearer the wells.') };
    },
    verify: (x) => { const f = [x.a, x.b]; return f.reduce((t, v) => t - v, x.tot); },
  },
};
