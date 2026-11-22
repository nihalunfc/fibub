// Class 12 Biology, Evolution: live problems (original fibub questions). Ids start with c12b-evo-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-evo-carrier': {
    title: 'carrier frequency from a disease frequency',
    make(r) {
      const inv = choose(r, [400, 625, 900, 1600, 2500, 10000]), q2 = 1 / inv, q = Math.sqrt(q2), p = 1 - q;
      return { inv, q2, q: `<p>A recessive genetic disease affects 1 person in ${n(inv)} in a population in Hardy-Weinberg equilibrium. What percentage of the people are healthy carriers (heterozygotes)?</p>`, answer: 2 * p * q * 100, unit: '%', tol: 0.02,
        hint: 'q² = 1/' + inv + ' is the frequency of aa. Find q, then p = 1 − q, then use 2pq.',
        solution: steps(`q² = 1/${n(inv)}, so q = √(1/${n(inv)}) = ${n(Math.sqrt(1 / inv), 4)}.`, `p = 1 − q = ${n(1 - Math.sqrt(1 / inv), 4)}.`, `Carriers = 2pq = 2 × ${n(1 - Math.sqrt(1 / inv), 4)} × ${n(Math.sqrt(1 / inv), 4)} = ${n(2 * (1 - Math.sqrt(1 / inv)) * Math.sqrt(1 / inv), 3)} = <b>${n(2 * p * Math.sqrt(1 / inv) * 100)} %</b>.`) };
    },
    verify: (x) => { const qq = Math.exp(0.5 * Math.log(x.q2)); const AA = (1 - qq) ** 2, aa = qq * qq; return 100 * (1 - AA - aa); },
  },
  'c12b-evo-hwcount': {
    title: 'number of heterozygotes in a population',
    make(r) {
      const qa = choose(r, [0.1, 0.2, 0.3, 0.4, 0.5]), N = choose(r, [500, 1000, 2000, 5000]), aa = Math.round(qa * qa * N);
      return { qa, N, aa, q: `<p>In a population of ${n(N)} individuals (Hardy-Weinberg equilibrium) the frequency of the recessive allele a is ${qa}. How many individuals are expected to be heterozygous (Aa)?</p>`, answer: 2 * qa * (1 - qa) * N, unit: '', tol: 0.02,
        hint: 'p = 1 − q. Aa frequency is 2pq. Multiply by the population size.',
        solution: steps(`p = 1 − ${qa} = ${n(1 - qa)}.`, `2pq = 2 × ${n(1 - qa)} × ${qa} = ${n(2 * qa * (1 - qa), 3)}.`, `Number = ${n(2 * qa * (1 - qa), 3)} × ${n(N)} = <b>${n(2 * qa * (1 - qa) * N)}</b>.`) };
    },
    verify: (x) => x.N - (1 - x.qa) ** 2 * x.N - x.qa ** 2 * x.N,
  },
  'c12b-evo-allelefreq': {
    title: 'allele frequency from genotype counts',
    make(r) {
      const AA = pick(r, 100, 500, 50), Aa = pick(r, 100, 400, 50), aa = pick(r, 50, 300, 50), N = AA + Aa + aa;
      return { AA, Aa, aa, N, q: `<p>A sample of ${N} plants has ${AA} AA, ${Aa} Aa and ${aa} aa. What is the frequency of allele A (as a decimal)?</p>`, answer: (2 * AA + Aa) / (2 * N), unit: '', tol: 0.01,
        hint: 'Each plant has two alleles. Count the A alleles (2 per AA, 1 per Aa) and divide by 2N.',
        solution: steps(`Alleles in total = 2 × ${N} = ${2 * N}.`, `A alleles = 2 × ${AA} + ${Aa} = ${2 * AA + Aa}.`, `p = ${2 * AA + Aa} ÷ ${2 * N} = <b>${n((2 * AA + Aa) / (2 * N), 3)}</b>.`) };
    },
    verify: (x) => x.AA / x.N + x.Aa / (2 * x.N),
  },
  'c12b-evo-clock': {
    title: 'Earth’s history on a 24-hour clock',
    make(r) {
      const [name, bya] = choose(r, [['first cells', 3.8], ['oxygen-producing photosynthesis', 2.7], ['eukaryotic cells', 2.0], ['first animals', 0.6], ['dinosaurs', 0.23]]);
      const hrs = 24 * (4.6 - bya) / 4.6;
      return { name, bya, q: `<p>Squeeze the 4.6 billion years of Earth's history into one day, with Earth forming at 00:00 and the present at 24:00. At what clock time (in hours after midnight) did ${name} appear, about ${bya} billion years ago?</p>`, answer: hrs, unit: 'h', tol: 0.02,
        hint: 'Time since Earth formed = 4.6 − ' + bya + ' billion years. Scale: 4.6 billion years = 24 hours.',
        solution: steps(`Time since formation = 4.6 − ${bya} = ${n(4.6 - bya)} billion years.`, `Clock hours = ${n(4.6 - bya)} ÷ 4.6 × 24 = <b>${n(hrs)} h</b>.`) };
    },
    verify: (x) => (24 / 4.6) * (4.6 - x.bya),
  },
  'c12b-evo-generations': {
    title: 'generations since Homo sapiens arose',
    make(r) {
      const years = choose(r, [300000, 200000, 100000, 50000]), gen = choose(r, [20, 25, 30]);
      return { years, gen, q: `<p>Homo sapiens arose about ${n(years)} years ago. If one human generation is about ${gen} years, roughly how many generations is that?</p>`, answer: years / gen, unit: 'generations', tol: 0.01,
        hint: 'Divide the time by the length of one generation.', solution: steps(`${n(years)} ÷ ${gen} = <b>${n(years / gen)}</b> generations.`, 'Compare: a bacterium divides in 20 minutes, so it passes this many generations in a few weeks. That is why bacteria evolve resistance so fast.') };
    },
    verify: (x) => x.years * (1 / x.gen),
  },
};
