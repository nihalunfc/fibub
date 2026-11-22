// Round 4 extras for quantum-statistics: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];

// Ground-state energy (units of hbar*omega, zero-point included) of N fermions in an isotropic d-dimensional
// harmonic oscillator; shell n has energy n + d/2 and holds g * C(n + d - 1, d - 1) particles.
const shellDeg = (n, d) => (d === 1 ? 1 : d === 2 ? n + 1 : (n + 1) * (n + 2) / 2);
const fermiHO = (N, d, g) => { let E = 0, left = N; for (let n = 0; left > 0; n++) { const k = Math.min(left, g * shellDeg(n, d)); E += k * (n + d / 2); left -= k; } return E; };

export default {
  items: [
    { id: 'qstat-r4-01', type: 'mcq', level: 1, exams: G, sub: 'spin and statistics',
      q: R`A neutral atom of lithium-6 has 3 protons, 3 neutrons and 3 electrons. A gas of these atoms at very low temperature obeys`,
      options: [R`Bose-Einstein statistics`, R`Fermi-Dirac statistics`, R`Bose-Einstein or Fermi-Dirac, depending on the temperature`, R`Maxwell-Boltzmann statistics at all temperatures`], answer: 1,
      sol: R`A composite particle is a fermion if it contains an odd number of fermions. Lithium-6 has $3 + 3 + 3 = 9$ spin-$\tfrac12$ constituents, an odd number, so the atom is a fermion. (Lithium-7, with one more neutron, is a boson.) Cold gases of $^6$Li are used to make degenerate Fermi gases in the laboratory.`,
      trap: R`Counting only the nucleus (6 nucleons, even) forgets the 3 electrons.` },
    { id: 'qstat-r4-02', type: 'nat', level: 2, exams: G, sub: 'entropy of a state',
      q: R`A single-particle state of an ideal Fermi gas has mean occupation $0.20$. Its contribution to the entropy, $S/k = -[f\ln f + (1 - f)\ln(1 - f)]$, is ______ (three decimal places).`,
      answer: 0.500, tol: 0.003, calc: () => -(0.2 * Math.log(0.2) + 0.8 * Math.log(0.8)),
      sol: R`$S/k = -[0.2\ln0.2 + 0.8\ln0.8] = -[0.2\times(-1.609) + 0.8\times(-0.223)] = 0.322 + 0.179 = 0.500$. The state is either empty or full, with probabilities $0.8$ and $0.2$, and this is the entropy of that two-outcome uncertainty. It is largest, $\ln2 = 0.693$, for a state at $\mu$ ($f = \tfrac12$), and zero for states that are surely full or surely empty; that is why only states within a few $kT$ of $\mu$ carry entropy in a degenerate gas.`,
      trap: R`Keeping only $-f\ln f$ ($0.322$) forgets the uncertainty in the state being empty.` },
    { id: 'qstat-r4-03', type: 'nat', level: 3, exams: G, sub: 'Fermi-Dirac function',
      q: R`Over what energy interval, in units of $kT$, does the Fermi-Dirac occupation fall from $0.9$ to $0.1$? ______ (two decimal places)`,
      answer: 4.39, tol: 0.02, calc: () => 2 * Math.log(9),
      sol: R`$f = 1/(e^x + 1)$ with $x = (\varepsilon - \mu)/kT$. $f = 0.9$ gives $e^x = 1/9$, $x = -\ln9$; $f = 0.1$ gives $e^x = 9$, $x = \ln9$. The width is $2\ln9 = 4.39$, so the "smeared" region of a Fermi surface is about $4.4kT$ wide, centred on $\mu$. At room temperature that is about $0.11$ eV, tiny next to a metal's Fermi energy of several eV.`,
      trap: R`The edge is symmetric about $\mu$; using only one side gives $2.20$.` },
    { id: 'qstat-r4-04', type: 'nat', level: 3, exams: G, sub: 'comparing distributions',
      q: R`At what value of $x = (\varepsilon - \mu)/kT$ is the Bose-Einstein occupation exactly twice the Maxwell-Boltzmann occupation $e^{-x}$? ______ (three decimal places)`,
      answer: 0.693, tol: 0.003, calc: () => Math.log(2),
      sol: R`Set $\dfrac{1}{e^x - 1} = 2e^{-x}$. Multiply by $e^x(e^x - 1)$: $e^x = 2(e^x - 1)$, so $e^x = 2$ and $x = \ln2 = 0.693$. Bose enhancement matters only within about $kT$ of the chemical potential; far above it ($x\gg1$) both distributions agree.`,
      trap: R`Setting the Bose-Einstein occupation itself equal to 2 gives $\ln1.5$; the condition compares it with $2e^{-x}$, so the ratio $e^x/(e^x - 1)$ must equal 2.` },
    { id: 'qstat-r4-05', type: 'mcq', level: 4, exams: G, sub: 'canonical quantum gases',
      q: R`Two non-interacting identical spinless particles share the levels $n\hbar\omega$ ($n = 0, 1, 2, \ldots$) of a one-dimensional harmonic oscillator. With $q = e^{-\hbar\omega/kT}$, the ratio of the canonical partition function for fermions to that for bosons is`,
      options: [R`$1$`, R`$\dfrac{1 - q}{1 + q}$`, R`$q^2$`, R`$q$`], answer: 3,
      sol: R`With $Z_1 = 1/(1 - q)$, two identical particles give $Z_{B,F} = \tfrac12\big[Z_1(\beta)^2\pm Z_1(2\beta)\big] = \tfrac12\Big[\dfrac{1}{(1 - q)^2}\pm\dfrac{1}{1 - q^2}\Big]$. This simplifies to $Z_B = \dfrac{1}{(1 - q)(1 - q^2)}$ and $Z_F = \dfrac{q}{(1 - q)(1 - q^2)}$, so $Z_F/Z_B = q$. Every fermion state ($n_1 < n_2$) is a boson state ($n_1\le n_2$) shifted up by one quantum, which is why the ratio is a single Boltzmann factor $e^{-\hbar\omega/kT}$.`,
      trap: R`Treating the particles as distinguishable gives $Z_1^2$ for both and a ratio of 1.` },
    { id: 'qstat-r4-06', type: 'mcq', level: 4, exams: G, sub: 'relativistic quantum gases',
      q: R`At zero chemical potential, an ideal gas of massless fermions (such as early-universe neutrinos) is compared with a photon gas at the same temperature. Per internal state (per spin or polarisation), the fermions' energy density is what fraction of the bosons'?`,
      options: [R`$7/8$`, R`$3/4$`, R`$1$`, R`$1/2$`], answer: 0,
      sol: R`The energy density per state is $\propto\int_0^\infty\dfrac{x^3dx}{e^x\pm1}$. Using $\dfrac{1}{e^x + 1} = \dfrac{1}{e^x - 1} - \dfrac{2}{e^{2x} - 1}$, the fermion integral is the boson one times $1 - 2\cdot2^{-4} = 7/8$. ($3/4$ is the corresponding factor for the number density, from $1 - 2\cdot2^{-3}$.)`,
      trap: R`$3/4$ is the number-density factor; for energy the power is one higher.` },
    { id: 'qstat-r4-07', type: 'msq', level: 4, exams: G, sub: 'occupation statistics', format: 'statements',
      q: R`A single mode in equilibrium with a reservoir has mean occupation $\bar n$. Which statements are correct?`,
      options: [R`For bosons, the probability of finding exactly $n$ particles is geometric: $P(n) = \bar n^n/(1 + \bar n)^{n+1}$.`, R`For bosons, $\langle n(n - 1)\rangle = 2\bar n^2$.`, R`For fermions, the variance of $n$ is $\bar n(1 - \bar n)$.`, R`For bosons, the variance of $n$ is $\bar n$, as for a Poisson distribution.`], answer: [0, 1, 2],
      sol: R`For bosons $P(n)\propto e^{-n\beta(\varepsilon - \mu)}$, a geometric series; writing the ratio in terms of $\bar n$ gives the stated form. Its factorial moment is $\langle n(n - 1)\rangle = 2\bar n^2$, so the variance is $\bar n + \bar n^2$: larger than Poisson. This excess is the "bunching" of thermal light (the Hanbury Brown-Twiss effect). For fermions $n = 0$ or 1, so $n^2 = n$ and the variance is $\bar n - \bar n^2$.`,
      trap: R`Poisson ($\bar n$) belongs to classical, independent particles; bosons fluctuate more and fermions less.` },
    { id: 'qstat-r4-08', type: 'msq', level: 2, exams: G, sub: 'zero temperature', format: 'statements',
      q: R`Ideal quantum gases in a three-dimensional box are cooled to $T = 0$ at fixed density. Which statements are correct?`,
      options: [R`In the Fermi gas, every single-particle state below the Fermi energy is full and every state above it empty.`, R`In the Bose gas, all particles are in the lowest single-particle state.`, R`The Fermi gas exerts zero pressure.`, R`The Bose gas exerts zero pressure.`], answer: [0, 1, 3],
      sol: R`The Pauli principle forces fermions to stack up to $E_F$, giving a sharp step and a non-zero mean energy $\tfrac35E_F$, and hence a degeneracy pressure $\tfrac25nE_F$. Bosons can all sit in the lowest state, which has (essentially) zero momentum, so the ideal Bose gas exerts no pressure at $T = 0$; below $T_c$ its pressure goes as $T^{5/2}$, independent of density.`,
      trap: R`Pressure at $T = 0$ is a fermion effect; ideal bosons have none.` },
    { id: 'qstat-r4-09', type: 'mcq', level: 5, exams: G, sub: 'Bose-Einstein condensation',
      q: R`Ideal Bose gases with a conserved number of particles live in boxes of dimension $d$, with single-particle energy $\varepsilon\propto p^s$. Which one shows Bose-Einstein condensation at a non-zero temperature?`,
      options: [R`Non-relativistic ($s = 2$) in two dimensions`, R`Non-relativistic ($s = 2$) in one dimension`, R`Ultra-relativistic ($s = 1$) in two dimensions`, R`Ultra-relativistic ($s = 1$) in one dimension`], answer: 2,
      sol: R`The density of states goes as $g(\varepsilon)\propto\varepsilon^{d/s - 1}$. The number of particles the excited states can hold at $\mu = 0$ is $\int\dfrac{g(\varepsilon)\,d\varepsilon}{e^{\varepsilon/kT} - 1}$, which converges at small $\varepsilon$ only if $d/s > 1$. When it converges, the excited states saturate and the rest must condense. $d/s$: $1$ for both non-relativistic 2D and ultra-relativistic 1D (borderline, divergent), $1/2$ for non-relativistic 1D, and $2$ for ultra-relativistic 2D, which therefore condenses.`,
      trap: R`"No BEC in 2D" is a result for $\varepsilon\propto p^2$; the real test is $d/s > 1$.` },
    { id: 'qstat-r4-10', type: 'nat', level: 3, exams: G, sub: 'filling levels',
      q: R`Six identical spinless fermions sit in a two-dimensional isotropic harmonic oscillator, whose levels are $(n + 1)\hbar\omega$ with degeneracy $n + 1$ ($n = 0, 1, 2, \ldots$). The ground-state energy of the six, in units of $\hbar\omega$, is ______.`,
      answer: 14, tol: 0, calc: () => fermiHO(6, 2, 1),
      sol: R`Fill from the bottom, one particle per state: level $n = 0$ (energy 1, one state) takes 1; $n = 1$ (energy 2, two states) takes 2; $n = 2$ (energy 3, three states) takes 3. Total $1\times1 + 2\times2 + 3\times3 = 14\,\hbar\omega$. Six bosons would all sit in the lowest level, with $6\hbar\omega$.`,
      trap: R`Forgetting the zero-point energy (using $n\hbar\omega$) gives 8.` },
  ],
  gens: [
    { id: 'qstat-r4g1', type: 'nat', level: 3, exams: G, sub: 'Fermi-Dirac function',
      make(r) {
        const p = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2, 0.25]), T = choose(r, [4, 77, 300, 500, 1000]);
        const w = 2 * Math.log((1 - p) / p) * C.kB * T / C.e * 1e3;
        return { q: `In a metal at $${T}$ K, the Fermi-Dirac occupation falls from $${1 - p}$ to $${p}$ over an energy interval of ______ meV.`,
          answer: round(w, 3), tol: Math.max(0.001, round(w * 0.01, 3)), p, T,
          sol: `$f = p$ at $(\\varepsilon - \\mu)/kT = \\ln[(1 - p)/p] = ${round(Math.log((1 - p) / p), 4)}$, and $f = 1 - p$ at minus that. Width $= 2kT\\ln[(1 - p)/p] = 2\\times${round(C.kB * T / C.e * 1e3, 4)}\\times${round(Math.log((1 - p) / p), 4)} = ${round(w, 3)}$ meV.`,
          trap: 'The Fermi edge is symmetric about $\\mu$, so the full width is twice the one-sided distance.' };
      },
      verify: (p) => 2 * Math.log((1 - p.p) / p.p) * C.kB * p.T / C.e * 1e3 },
    { id: 'qstat-r4g2', type: 'nat', level: 2, exams: G, sub: 'entropy of a state',
      make(r) {
        const bose = r() < 0.5, n = bose ? choose(r, [0.1, 0.5, 1, 2, 5, 10]) : choose(r, [0.05, 0.1, 0.3, 0.5, 0.7, 0.9]);
        const S = bose ? (1 + n) * Math.log(1 + n) - n * Math.log(n) : -(n * Math.log(n) + (1 - n) * Math.log(1 - n));
        return { q: `A single-particle state of an ideal ${bose ? 'Bose' : 'Fermi'} gas has mean occupation $${n}$. Its contribution to the entropy, in units of $k$, is ______ (three decimal places).`,
          answer: round(S, 3), tol: 0.003, bose, n,
          sol: bose
            ? `For bosons $S/k = (1 + \\bar n)\\ln(1 + \\bar n) - \\bar n\\ln\\bar n = ${round(1 + n, 2)}\\ln${round(1 + n, 2)} - ${n}\\ln${n} = ${round(S, 3)}$.`
            : `For fermions $S/k = -[f\\ln f + (1 - f)\\ln(1 - f)] = ${round(S, 3)}$; it peaks at $\\ln2$ for $f = \\tfrac12$.`,
          trap: bose ? 'The boson formula has $+(1 + \\bar n)\\ln(1 + \\bar n)$, the mirror of the fermion $-(1 - f)\\ln(1 - f)$.' : 'Both outcomes (full and empty) contribute to the entropy.' };
      },
      verify: (p) => (p.bose ? (1 + p.n) * Math.log(1 + p.n) - p.n * Math.log(p.n) : -(p.n * Math.log(p.n) + (1 - p.n) * Math.log(1 - p.n))) },
    { id: 'qstat-r4g3', type: 'nat', level: 3, exams: G, sub: 'filling levels',
      make(r) {
        const d = choose(r, [1, 2, 3]), g = choose(r, [1, 2]), N = d === 1 ? choose(r, [3, 4, 5, 6, 7]) : choose(r, [3, 4, 5, 6, 7, 8, 10, 12]);
        const E = fermiHO(N, d, g);
        const lev = d === 1 ? '$(n + \\tfrac12)\\hbar\\omega$, each non-degenerate' : d === 2 ? '$(n + 1)\\hbar\\omega$ with degeneracy $n + 1$' : '$(n + \\tfrac32)\\hbar\\omega$ with degeneracy $(n + 1)(n + 2)/2$';
        return { q: `${N} identical ${g === 1 ? 'spinless' : 'spin-$\\tfrac12$'} fermions sit in a ${d}D isotropic harmonic oscillator with orbital levels ${lev} ($n = 0, 1, 2, \\ldots$). Their ground-state energy is ______ $\\hbar\\omega$.`,
          answer: E, tol: 0, d, g, N,
          sol: `Fill the lowest levels first, with at most ${g} particle${g > 1 ? 's' : ''} per orbital state. Shell $n$ holds ${g === 1 ? '' : '2 × '}(its degeneracy) particles. Adding $(n + ${d === 1 ? '\\tfrac12' : d === 2 ? '1' : '\\tfrac32'})\\hbar\\omega$ for each particle gives $${E}\\,\\hbar\\omega$.`,
          trap: 'Remember the zero-point energy and the spin factor when filling the shells.' };
      },
      verify: (p) => fermiHO(p.N, p.d, p.g) },
  ],
};
