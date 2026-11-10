// #1361 ΔG = ΔH − TΔS explorer. Checked against hand-worked textbook-style values (independent Python, plain
// floats): ice melting ΔH +6.01 kJ/mol, ΔS +22.0 J/(K·mol) → T = 273.2 K; ammonia synthesis ΔH −92.2, ΔS −198.7
// → ΔG(298) = −32.99 kJ/mol, K = 6.05e5, T = 464.0 K; limestone ΔH +178.3, ΔS +160.5 → T = 1110.9 K.
import * as G from '../../src/lib/sci/gibbs-explorer.ts';
const near = (a, b, t = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  check('gibbs: ice melts at ΔH/ΔS = 273.18 K', near(G.crossover(6.01, 22.0), 273.1818181818, 1e-9) && G.caseOf(6.01, 22) === 'high');
  check('gibbs: ammonia ΔG(298 K) = −32.987 kJ/mol (Python)', near(G.gibbs(-92.2, -198.7, 298), -32.9874, 1e-9) && G.caseOf(-92.2, -198.7) === 'low');
  check('gibbs: ammonia K(298 K) = 6.054e5 (Python exp(32987.4/(8.314462618·298)))', near(G.kFromG(-32.9874, 298), 605412.538, 1e-6));
  check('gibbs: ammonia turns over at 464.02 K', near(G.crossover(-92.2, -198.7), 464.0161046804, 1e-9));
  check('gibbs: limestone turns over at 1110.9 K', near(G.crossover(178.3, 160.5), 1110.9034267913, 1e-9));
  check('gibbs: always and never cases have no crossover', G.caseOf(-50, 100) === 'always' && Number.isNaN(G.crossover(-50, 100)) && G.caseOf(50, -100) === 'never' && Number.isNaN(G.crossover(50, -100)));
  check('gibbs: ΔG = 0 gives K = 1 and "equilibrium"', G.kFromG(0, 300) === 1 && G.verdict(0.01) === 'equilibrium' && G.verdict(-3) === 'spontaneous' && G.verdict(2) === 'not spontaneous');
};
