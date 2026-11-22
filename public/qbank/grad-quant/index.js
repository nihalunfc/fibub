// Bank: graduate admissions quantitative reasoning, shared by the GMAT and GRE courses (and open to SAT items).
// Format: /mnt/project-files/qbank/spec.md (fibub shared question bank). Every question is original.
export default {
  id: 'grad-quant', name: 'GMAT and GRE quantitative reasoning',
  exams: { gmat: 'GMAT', gre: 'GRE' },
  units: [
    { id: 'numbers', name: 'Number properties', topics: [
      { id: 'mental-maths', name: 'Mental maths' }, { id: 'integers', name: 'Integers and divisibility' }, { id: 'primes', name: 'Primes, GCD and LCM' },
      { id: 'odd-even', name: 'Odd, even and remainders' }, { id: 'exponents', name: 'Exponents and roots' }, { id: 'fractions', name: 'Fractions and decimals' } ] },
    { id: 'algebra', name: 'Algebra', topics: [
      { id: 'linear', name: 'Linear equations' }, { id: 'quadratics', name: 'Quadratics' }, { id: 'inequalities', name: 'Inequalities and absolute value' }, { id: 'functions', name: 'Functions and sequences' } ] },
    { id: 'word', name: 'Word problems', topics: [
      { id: 'percents', name: 'Percents' }, { id: 'ratios', name: 'Ratios and mixtures' }, { id: 'rates', name: 'Rates and work' }, { id: 'profit', name: 'Profit and interest' }, { id: 'sets', name: 'Overlapping sets' } ] },
    { id: 'data', name: 'Statistics, counting and probability', topics: [
      { id: 'averages', name: 'Averages' }, { id: 'spread', name: 'Median, range and SD' }, { id: 'counting', name: 'Counting' }, { id: 'probability', name: 'Probability' } ] },
  ],
};
