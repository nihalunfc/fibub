// Live problems for Evolution.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'evo-carriers': {
    title: 'carriers from the frequency of a recessive trait',
    make(r) {
      const qs = [0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.3], q = qs[Math.floor(r() * qs.length)], aff = q * q, pop = pick(r, 1, 50) * 10000;
      const answer = 2 * q * (1 - q) * 100;
      return { aff, pop,
        q: `<p>In a population in Hardy-Weinberg equilibrium, ${n(aff * pop, 4)} out of ${n(pop, 4)} people show a recessive trait (genotype aa). What percentage of the population are heterozygous carriers (Aa)?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Affected people are q². Take the square root to get q, then p = 1 − q, then carriers = 2pq.',
        solution: steps(`q² = ${n(aff * pop, 4)} ÷ ${n(pop, 4)} = ${n(aff, 4)}.`, `q = √${n(aff, 4)} = ${q}; p = 1 − ${q} = ${n(1 - q, 4)}.`, `2pq = 2 × ${n(1 - q, 4)} × ${q} = ${n(2 * q * (1 - q), 4)} = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => { const q = Math.sqrt(x.aff); return (1 - (1 - q) ** 2 - q * q) * 100; },
  },
  'evo-allele': {
    title: 'allele frequency from genotype counts',
    make(r) {
      const AA = pick(r, 10, 400), Aa = pick(r, 10, 400), aa = pick(r, 5, 300), N = AA + Aa + aa;
      const answer = (2 * AA + Aa) / (2 * N);
      return { AA, Aa, aa,
        q: `<p>A sample of ${N} people has ${AA} AA, ${Aa} Aa and ${aa} aa. What is the frequency p of allele A? (Give a decimal between 0 and 1.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Count alleles, not people: each person has two. AA gives 2 A, Aa gives 1 A.',
        solution: steps(`Total alleles = 2 × ${N} = ${2 * N}.`, `A alleles = 2 × ${AA} + ${Aa} = ${2 * AA + Aa}.`, `p = ${2 * AA + Aa} ÷ ${2 * N} = <b>${n(answer, 4)}</b> (and q = ${n(1 - answer, 4)}).`) };
    },
    verify: (x) => 1 - (2 * x.aa + x.Aa) / (2 * (x.AA + x.Aa + x.aa)),
  },
};
