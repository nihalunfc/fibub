// Live problems for Principles of inheritance and variation.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const GENO = (L, k) => [L + L, L + L.toLowerCase(), L.toLowerCase() + L.toLowerCase()][k]; // 0 AA, 1 Aa, 2 aa
const pRec = (k) => [0, 0.5, 1][k]; // chance a gamete carries the recessive allele
const frac = (x) => ({ 0: '0', 0.25: '1/4', 0.5: '1/2', 0.75: '3/4', 1: '1' })[x] ?? n(x);

export default {
  'inh-cross': {
    title: 'chance of a phenotype from a two-gene cross',
    make(r) {
      const pick3 = () => Math.floor(r() * 3);
      const a1 = pick3(), a2 = r() < 0.7 ? 1 : pick3(), b1 = pick3(), b2 = r() < 0.7 ? 1 : pick3();
      const wantA = r() < 0.5, wantB = r() < 0.5; // true = dominant phenotype wanted
      const rA = pRec(a1) * pRec(a2), rB = pRec(b1) * pRec(b2);
      const fA = wantA ? 1 - rA : rA, fB = wantB ? 1 - rB : rB, answer = fA * fB * 100;
      const p1 = GENO('A', a1) + GENO('B', b1), p2 = GENO('A', a2) + GENO('B', b2);
      const ph = `${wantA ? 'tall (dominant A)' : 'dwarf (aa)'} and ${wantB ? 'round seeds (dominant B)' : 'wrinkled seeds (bb)'}`;
      return { a1, a2, b1, b2, wantA, wantB,
        q: `<p>In a plant, A (tall) is dominant over a (dwarf) and B (round) over b (wrinkled); the genes assort independently. In the cross ${p1} × ${p2}, what percentage of the offspring are ${ph}?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'Treat each gene as its own monohybrid cross, find the chance of the wanted phenotype for each, then multiply (independent assortment).',
        solution: steps(`Gene A: ${GENO('A', a1)} × ${GENO('A', a2)} gives aa with chance ${frac(pRec(a1))} × ${frac(pRec(a2))} = ${frac(rA)}, so the chance of ${wantA ? 'dominant A' : 'aa'} = ${frac(fA)}.`, `Gene B: ${GENO('B', b1)} × ${GENO('B', b2)} gives bb with chance ${frac(rB)}, so the chance of ${wantB ? 'dominant B' : 'bb'} = ${frac(fB)}.`, `Multiply: ${frac(fA)} × ${frac(fB)} = ${n(fA * fB, 4)} = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => {
      // enumerate every gamete pair
      const al = (k) => [['A', 'A'], ['A', 'a'], ['a', 'a']][k];
      let hit = 0, tot = 0;
      for (const ga1 of al(x.a1)) for (const ga2 of al(x.a2)) for (const gb1 of al(x.b1)) for (const gb2 of al(x.b2)) {
        const domA = ga1 === 'A' || ga2 === 'A', domB = gb1 === 'A' || gb2 === 'A';
        tot++; if (domA === x.wantA && domB === x.wantB) hit++;
      }
      return (hit / tot) * 100;
    },
  },
  'inh-map': {
    title: 'map distance from a test cross',
    make(r) {
      const total = pick(r, 400, 2000, 100), rf = pick(r, 4, 40, 2), rec = Math.round(total * rf / 100), par = total - rec;
      const r1 = Math.round(rec / 2) + pick(r, -5, 5), r2 = rec - r1, q1 = Math.round(par / 2) + pick(r, -8, 8), q2 = par - q1;
      const answer = (rec / total) * 100;
      return { r1, r2, q1, q2,
        q: `<p>A dihybrid AaBb (A and B on the same chromosome, coupled as AB/ab) is test crossed with aabb. The offspring are: AaBb ${q1}, aabb ${q2}, Aabb ${r1}, aaBb ${r2}. What is the distance between the genes in map units (centimorgans)?</p>`,
        answer, unit: 'cM', tol: 0.005,
        hint: 'Parental types are the most common (AB and ab here). Recombinant frequency = recombinants ÷ total × 100, and 1% recombination = 1 map unit.',
        solution: steps(`Parental (AaBb, aabb) = ${q1} + ${q2} = ${par}. Recombinant (Aabb, aaBb) = ${r1} + ${r2} = ${rec}.`, `Total = ${total}.`, `Recombination frequency = ${rec} ÷ ${total} × 100 = <b>${n(answer)}%</b> = ${n(answer)} map units.`) };
    },
    verify: (x) => 100 - ((x.q1 + x.q2) / (x.q1 + x.q2 + x.r1 + x.r2)) * 100,
  },
};
