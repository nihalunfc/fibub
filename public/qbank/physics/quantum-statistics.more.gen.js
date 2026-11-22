// Extra question shapes for quantum-statistics (templates qstat-m31..m35). Imported by quantum-statistics.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'qstat-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'occupation functions', format: 'match the property',
    make(r) {
      const O = { be: 'Bose-Einstein only', fd: 'Fermi-Dirac only', mb: 'Maxwell-Boltzmann only', all: 'all three (BE, FD and MB)' };
      const C = choose(r, [
        ['the mean occupation can exceed 1', 'be', 'Only bosons can pile into one state: $\\bar n_{BE} = 1/(e^x - 1)$ is unbounded as $x \\to 0^+$.'],
        ['the mean occupation diverges as $\\varepsilon \\to \\mu$', 'be', '$1/(e^x - 1) \\to \\infty$ as $x \\to 0$, which is why $\\mu$ must stay below the lowest level.'],
        ['the mean occupation is exactly $\\tfrac12$ at $\\varepsilon = \\mu$', 'fd', '$1/(e^0 + 1) = \\tfrac12$.'],
        ['the mean occupation can never exceed 1', 'fd', 'The Pauli principle: $1/(e^x + 1) < 1$ for every $x$.'],
        ['at $T = 0$ the occupation is a sharp step at $\\varepsilon = \\mu$', 'fd', 'All states below $\\mu$ full, all above empty.'],
        ['the occupation is a pure exponential $e^{-(\\varepsilon - \\mu)/kT}$ at every energy', 'mb', 'That is the classical form; the quantum ones only approach it when $\\varepsilon - \\mu \\gg kT$.'],
        ['the occupation is very nearly $e^{-(\\varepsilon - \\mu)/kT}$ when $\\varepsilon - \\mu \\gg kT$', 'all', 'For $x \\gg 1$ the $\\pm1$ in the denominator is negligible, so BE and FD both reduce to MB.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `With $x = (\\varepsilon - \\mu)/kT$, which distribution(s) have this property: ${C[0]}?`, ...o, sol: C[2],
        trap: 'BE and FD differ only by the sign of the 1 in $1/(e^x \\mp 1)$; all three merge in the dilute, high-energy tail.' };
    } },
  { id: 'qstat-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'occupation identities', format: 'statements',
    make(r) {
      const x = choose(r, [0.5, 1, 1.5, 2, 3]);
      const nf = 1 / (Math.exp(x) + 1), nb = 1 / (Math.exp(x) - 1), nm = Math.exp(-x), right = r() < 0.5;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$\\bar n_{FD} = ${round(right ? nf : nm, 3)}$`, right, `$\\bar n_{FD} = 1/(e^{${x}} + 1) = ${round(nf, 3)}$ (while $e^{-${x}} = ${round(nm, 3)}$ is the MB value).`],
        ['$\\bar n_{BE} > \\bar n_{MB} > \\bar n_{FD}$', true, `Numerically $${round(nb, 3)} > ${round(nm, 3)} > ${round(nf, 3)}$; true for every $x > 0$.`],
        ['$1/\\bar n_{FD} - 1/\\bar n_{BE} = 2$', true, '$(e^x + 1) - (e^x - 1) = 2$.'],
        ['$\\bar n_{BE} - \\bar n_{FD} = 2\\,\\bar n_{FD}\\,\\bar n_{BE}$', true, 'Both sides equal $2/(e^{2x} - 1)$.'],
        ['$\\bar n_{FD}(x) + \\bar n_{FD}(-x) = 1$', true, 'Particle-hole symmetry: $\\tfrac{1}{e^x + 1} + \\tfrac{1}{e^{-x} + 1} = 1$.'],
        ['$\\bar n_{BE} < \\bar n_{FD}$', false, 'The bosonic occupation is always the larger at the same $x > 0$.'],
        ['$\\bar n_{FD} = \\bar n_{BE} + 1$', false, `At $x = ${x}$: $${round(nf, 3)} \\ne ${round(nb + 1, 3)}$.`],
      ], { not });
      return { q: `A single-particle state lies at $\\varepsilon - \\mu = ${x}\\,kT$. Comparing Fermi-Dirac, Bose-Einstein and Maxwell-Boltzmann occupations, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Bosons are "enhanced" and fermions "suppressed" relative to the classical value at every energy above $\\mu$.' };
    } },
  { id: 'qstat-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'degeneracy parameter', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['conduction electrons in a metal ($n = 8.5\\times10^{28}$ m$^{-3}$) at 300 K', 8.5e28, 9.109e-31, 300],
        ['nitrogen gas at room conditions ($n = 2.5\\times10^{25}$ m$^{-3}$, 300 K, $m = 28$ u)', 2.5e25, 28 * 1.6605e-27, 300],
        ['liquid helium-4 ($n = 2.2\\times10^{28}$ m$^{-3}$) at 2 K', 2.2e28, 4 * 1.6605e-27, 2],
        ['electrons in lightly doped silicon ($n = 10^{22}$ m$^{-3}$, effective mass $0.26\\,m_e$) at 300 K', 1e22, 0.26 * 9.109e-31, 300],
        ['a sodium vapour ($n = 10^{20}$ m$^{-3}$, $m = 23$ u) at 1 μK', 1e20, 23 * 1.6605e-27, 1e-6],
        ['the solar core electrons ($n = 6\\times10^{31}$ m$^{-3}$) at $1.5\\times10^7$ K', 6e31, 9.109e-31, 1.5e7],
      ]);
      const lam = 6.62607e-34 / Math.sqrt(2 * Math.PI * S[2] * 1.380649e-23 * S[3]), D = S[1] * lam ** 3;
      const o = oomMcq(r, D);
      return { q: `The degeneracy parameter $n\\lambda^3$ (with $\\lambda = h/\\sqrt{2\\pi mkT}$) for ${S[0]} is closest to`, ...o,
        sol: `$\\lambda = ${fmt(lam, 3)}$ m, so $n\\lambda^3 = ${fmt(S[1], 2)}\\times(${fmt(lam, 3)})^3 = ${fmt(D, 2)}$, nearest $10^{${o.k}}$. ${D > 3 ? 'Much greater than 1: a degenerate quantum gas.' : D < 0.1 ? 'Much less than 1: classical (Maxwell-Boltzmann) statistics are fine.' : 'Of order 1: quantum statistics matter.'}`,
        trap: 'Quantum effects need $n\\lambda^3 \\gtrsim 1$; light particles and low temperatures make $\\lambda$ large.' };
    } },
  { id: 'qstat-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ideal quantum gases', format: 'which is NOT',
    make(r) {
      const S = choose(r, [
        { name: 'an ideal Fermi gas at $T = 0$', T: [['Every state below $E_F$ is filled and every state above is empty', 'The step function.'], ['The pressure is non-zero', 'Degeneracy pressure $P = \\tfrac25nE_F$.'], ['The entropy is zero', 'There is only one way to fill the lowest states.'], ['The mean energy per particle is $\\tfrac35E_F$ (in 3D)', 'Averaging $E$ over $g(E) \\propto \\sqrt E$ up to $E_F$.']],
          F: [['The pressure vanishes', 'Pauli exclusion keeps particles moving even at $T = 0$.'], ['The mean energy per particle is $E_F$', 'Most particles lie below $E_F$; the mean is $\\tfrac35E_F$.'], ['The chemical potential is zero', 'At $T = 0$, $\\mu = E_F > 0$.']] },
        { name: 'an ideal Bose gas in a 3D box below its condensation temperature', T: [['The chemical potential is (essentially) zero', 'It is pinned at the ground-state energy.'], ['The pressure depends only on $T$, not on the density', 'Condensed particles carry no momentum, so $P \\propto T^{5/2}$.'], ['A macroscopic fraction occupies the single lowest state', 'Fraction $1 - (T/T_c)^{3/2}$.'], ['The excited states hold $N(T/T_c)^{3/2}$ particles', 'They saturate at their maximum capacity.']],
          F: [['The pressure is proportional to the density', 'Adding particles only adds to the condensate, which exerts no pressure.'], ['The chemical potential is positive', 'A positive $\\mu$ would make the ground-state occupation negative.'], ['Every particle is in the lowest state', 'Only at $T = 0$.']] },
        { name: 'a classical (non-degenerate) ideal gas', T: [['$PV = NkT$', 'The ideal-gas law.'], ['The chemical potential is large and negative ($-\\mu \\gg kT$)', '$\\mu = kT\\ln(n\\lambda^3)$ with $n\\lambda^3 \\ll 1$.'], ['The mean occupation of every state is much less than 1', 'The dilute limit.'], ['Fermions and bosons behave alike', 'The $\\pm1$ in the occupation is negligible.']],
          F: [['The chemical potential is positive', '$n\\lambda^3 \\ll 1$ makes $\\ln(n\\lambda^3)$ very negative.'], ['Typical occupations are close to 1', 'They are tiny in the classical limit.'], ['$n\\lambda^3 \\gg 1$', 'That is the opposite, degenerate limit.']] },
      ]);
      const not = r() < 0.65;
      const o = factMcq(r, S.T, S.F, not);
      return { q: `For ${S.name}, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Fermions push back even at $T = 0$; a Bose condensate pushes back not at all.' };
    } },
  { id: 'qstat-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'chemical potential', format: 'graph in words',
    make(r) {
      const O = {
        fd: 'it starts at $E_F$, falls slowly (as $-T^2$) at first, passes through zero near $T \\sim T_F$ and becomes large and negative',
        be: 'it stays pinned at (essentially) zero up to $T_c$, then falls and becomes large and negative',
        ph: 'it is exactly zero at every temperature',
        cl: 'it is negative at all temperatures and becomes more negative as $T$ rises',
        up: 'it rises steadily from zero',
      };
      const C = choose(r, [
        ['an ideal 3D Fermi gas', 'fd', 'Sommerfeld: $\\mu \\approx E_F[1 - \\tfrac{\\pi^2}{12}(T/T_F)^2]$; at high $T$ it tends to the classical $kT\\ln(n\\lambda^3) < 0$.'],
        ['an ideal 3D Bose gas', 'be', 'Below $T_c$ the condensate fixes $\\mu = 0$; above, $\\mu < 0$ and falls towards the classical value.'],
        ['blackbody photons in a cavity', 'ph', 'Photon number is not conserved, so the free energy is minimised at fixed $T$, $V$ with $\\mu = 0$.'],
        ['a classical ideal gas (always non-degenerate)', 'cl', '$\\mu = kT\\ln(n\\lambda^3)$ with $\\lambda \\propto T^{-1/2}$: negative, and its magnitude grows as $T$ rises.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `At fixed density, how does the chemical potential $\\mu$ of ${C[0]} change as $T$ rises from (near) zero?`, ...o, sol: C[2],
        trap: 'For fermions $\\mu$ starts positive (at $E_F$); for bosons it can never be positive.' };
    } },
];
