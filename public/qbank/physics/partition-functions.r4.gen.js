// Round 4 extras for partition-functions: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
// Particle in a 1D box, levels n^2 E1: mean energy above the ground state, in units of E1, at kT = t E1.
const boxMean = (t) => { let Z = 0, E = 0; for (let n = 1; n < 80; n++) { const w = Math.exp(-(n * n - 1) / t); Z += w; E += (n * n - 1) * w; } return E / Z; };

export default {
  items: [
    { id: 'pfun-r4-01', type: 'mcq', level: 1, exams: G, sub: 'Boltzmann probabilities',
      q: R`A system has a non-degenerate ground state at energy $0$. At some temperature its partition function is $Z = 2.5$. The probability of finding it in the ground state is`,
      options: [R`$0.25$`, R`$0.40$`, R`$0.60$`, R`$1/\sqrt{2.5}$`], answer: 1,
      sol: R`$P_i = e^{-E_i/kT}/Z$. For the ground state $E = 0$, so $e^0 = 1$ and $P_0 = 1/Z = 1/2.5 = 0.40$. The partition function counts, in effect, how many states are thermally accessible.`,
      trap: R`$0.60$ is the probability of being in any excited state, $1 - 1/Z$.` },
    { id: 'pfun-r4-02', type: 'nat', level: 2, exams: G, sub: 'spin entropy',
      q: R`Nuclei of spin $I = 3/2$ in a weak magnetic field have Zeeman splittings far smaller than $kT$. Their nuclear-spin entropy per mole is ______ J mol$^{-1}$ K$^{-1}$ ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 11.53, tol: 0.05, calc: () => 8.314462618 * Math.log(4),
      sol: R`Each nucleus has $2I + 1 = 4$ states. When the splittings are much smaller than $kT$, $Z_1\to4$ and all four are equally likely, so $S = R\ln4 = 8.314\times1.386 = 11.53$ J mol$^{-1}$ K$^{-1}$. This entropy is removed only at microkelvin temperatures, which is what nuclear demagnetisation cooling exploits.`,
      trap: R`Using $\ln2$ (as for spin $\tfrac12$) or $\ln(I + 1)$ miscounts the states; there are $2I + 1$.` },
    { id: 'pfun-r4-03', type: 'mcq', level: 2, exams: G, sub: 'rotational partition function',
      q: R`CO$_2$ is a linear, symmetric molecule (O=C=O), with rotational temperature $\theta_r$. Well above $\theta_r$, its rotational partition function is`,
      options: [R`$T/\theta_r$`, R`$2T/\theta_r$`, R`$T/(2\theta_r)$`, R`$(T/\theta_r)^{3/2}$`], answer: 2,
      sol: R`For a linear rotor, $\sum_J(2J + 1)e^{-J(J+1)\theta_r/T}\approx T/\theta_r$. Turning a symmetric molecule end over end gives the same state, so only half the $J$ values are allowed (the oxygen-16 nuclei are spinless bosons): the symmetry number $\sigma = 2$ gives $T/(2\theta_r)$. The power stays 1 because a linear molecule has two rotational axes.`,
      trap: R`$T^{3/2}$ belongs to non-linear molecules with three rotation axes.` },
    { id: 'pfun-r4-04', type: 'nat', level: 2, exams: G, sub: 'free energy',
      q: R`$1.0\times10^{22}$ independent, distinguishable units each have partition function $Z_1 = 1.5$ at $300$ K. Their Helmholtz free energy (relative to all units in a state of energy zero) is ______ J (give the sign).`,
      answer: -16.8, tol: 0.2, calc: () => -1e22 * 1.380649e-23 * 300 * Math.log(1.5),
      sol: R`For distinguishable units $Z = Z_1^N$, so $F = -kT\ln Z = -NkT\ln Z_1 = -10^{22}\times1.381\times10^{-23}\times300\times\ln1.5 = -41.4\times0.405 = -16.8$ J. No $1/N!$ is needed: localised units (such as atoms on lattice sites) can be told apart by position.`,
      trap: R`Dividing by $N!$ applies only to identical particles that move freely, not to units fixed on sites.` },
    { id: 'pfun-r4-05', type: 'mcq', level: 3, exams: G, sub: 'rotational partition function',
      q: R`For a non-linear polyatomic molecule (such as NH$_3$) well above its rotational temperatures, the rotational partition function grows with temperature as`,
      options: [R`$T^{3/2}$, giving a rotational heat capacity of $\tfrac32k$ per molecule`, R`$T$, giving $k$ per molecule`, R`$T^{3/2}$, giving $k$ per molecule`, R`$T^3$, giving $3k$ per molecule`], answer: 0,
      sol: R`A non-linear molecule can rotate about three axes. Classically each angular momentum appears quadratically in the energy, and the integral over each gives a factor $\sqrt T$: $Z_{\rm rot}\propto T^{3/2}$. Then $U = kT^2\,d\ln Z/dT = \tfrac32kT$ per molecule and $C = \tfrac32k$, matching equipartition for three quadratic terms.`,
      trap: R`From $Z\propto T^n$ the energy is $nkT$; a $T^{3/2}$ partition function cannot give $C = k$.` },
    { id: 'pfun-r4-06', type: 'msq', level: 3, exams: G, sub: 'molecular partition function', format: 'statements',
      q: R`For a dilute gas, $Z_1 = Z_{\rm trans}Z_{\rm rot}Z_{\rm vib}Z_{\rm el}$ and $Z = Z_1^N/N!$. Which statements are correct?`,
      options: [R`The pressure comes entirely from $Z_{\rm trans}$, the only factor that depends on volume.`, R`$Z_{\rm rot}$ adds to the heat capacity but not to the pressure.`, R`Including the vibrational zero-point energy in $Z_{\rm vib}$ shifts $U$ but leaves $C_V$ unchanged.`, R`The $1/N!$ must be applied separately to each factor, giving $1/(N!)^4$.`], answer: [0, 1, 2],
      sol: R`$P = kT\,\partial\ln Z/\partial V$ and only $Z_{\rm trans}\propto V$ depends on volume, so internal motions never change $PV = NkT$. They do add to $U$ and $C_V$. The zero-point energy multiplies $Z_{\rm vib}$ by a constant factor $e^{-\hbar\omega/2kT}$, which adds a constant $\tfrac12\hbar\omega$ per molecule to $U$ and nothing to $C_V$. The $1/N!$ corrects for swapping whole molecules, so it appears once.`,
      trap: R`The $1/N!$ is about permuting molecules, not about each kind of motion.` },
    { id: 'pfun-r4-07', type: 'nat', level: 5, exams: G, sub: 'particle in a box',
      q: R`A particle in a one-dimensional box has levels $E_n = n^2E_1$ ($n = 1, 2, 3, \ldots$). At $kT = 3E_1$, its mean energy above the ground state, in units of $E_1$, is ______ (two decimal places).`,
      answer: 1.22, tol: 0.01, calc: () => boxMean(3),
      sol: R`Measure energies from the ground state: $\varepsilon_n = (n^2 - 1)E_1 = 0, 3, 8, 15, 24, \ldots$ Boltzmann factors at $kT = 3E_1$: $1, e^{-1}, e^{-8/3}, e^{-5}, e^{-8} = 1, 0.3679, 0.0695, 0.0067, 0.0003$, summing to $Z = 1.4444$. Then $\langle\varepsilon\rangle = (3\times0.3679 + 8\times0.0695 + 15\times0.0067 + 24\times0.0003)/1.4444 = 1.769/1.4444 = 1.22\,E_1$. The classical result $\tfrac12kT = 1.5E_1$ would apply only at $kT\gg E_1$.`,
      trap: R`Using the classical $\tfrac12kT$ when only two or three levels are populated.` },
    { id: 'pfun-r4-08', type: 'mcq', level: 4, exams: G, sub: 'indistinguishability',
      q: R`Two identical spinless bosons occupy two non-degenerate levels, $0$ and $\varepsilon$. At $kT\gg\varepsilon$, the exact partition function divided by the "corrected classical" approximation $Z_1^2/2!$ tends to`,
      options: [R`$1$`, R`$1/2$`, R`$2$`, R`$3/2$`], answer: 3,
      sol: R`The exact two-boson states are: both low, one each, both high, so $Z = 1 + q + q^2$ with $q = e^{-\varepsilon/kT}$. The approximation gives $(1 + q)^2/2$. As $q\to1$: exact $3$, approximate $2$, ratio $3/2$. The $1/N!$ rule undercounts states with two particles in the same level; it is accurate only when such double occupancy is rare, i.e. when there are far more accessible states than particles.`,
      trap: R`Expecting the high-temperature limit to make $Z_1^N/N!$ exact; that needs many states per particle, not just high $T$.` },
    { id: 'pfun-r4-09', type: 'msq', level: 4, exams: G, sub: 'properties of Z', format: 'statements',
      q: R`For a system with energy levels $E_i$ (finite in number or not), which statements about $Z(\beta) = \sum_ie^{-\beta E_i}$ are correct?`,
      options: [R`$\ln Z$ is a convex function of $\beta$.`, R`$\partial^2\ln Z/\partial\beta^2 = \langle E^2\rangle - \langle E\rangle^2$.`, R`$Z$ is never smaller than the total number of states.`, R`If the ground-state energy is positive, $Z < 1$ at low enough temperature.`], answer: [0, 1, 3],
      sol: R`$\partial^2_\beta\ln Z$ is the energy variance, which is never negative, so $\ln Z$ is convex in $\beta$. $Z$ counts each state with weight $e^{-\beta E_i}$, which is at most 1 for $E_i\ge0$, so $Z$ is usually much smaller than the number of states; at low $T$ it tends to $g_0e^{-\beta E_0}$, below 1 when $E_0 > 0$.`,
      trap: R`$Z$ approaches the number of states only as $T\to\infty$ (with finite levels and zero-based energies).` },
    { id: 'pfun-r4-10', type: 'nat', level: 4, exams: G, sub: 'harmonic oscillator',
      q: R`A quantum harmonic oscillator is in equilibrium at $kT = \hbar\omega$. The probability that it is in a state of <b>odd</b> $n$ is ______ (three decimal places).`,
      answer: 0.269, tol: 0.002, calc: () => Math.exp(-1) / (1 + Math.exp(-1)),
      sol: R`$P_n = (1 - q)q^n$ with $q = e^{-\hbar\omega/kT} = e^{-1}$. Summing odd $n$: $(1 - q)(q + q^3 + \ldots) = (1 - q)\dfrac{q}{1 - q^2} = \dfrac{q}{1 + q} = \dfrac{0.368}{1.368} = 0.269$. At high temperature this tends to $\tfrac12$, as expected.`,
      trap: R`$q = 0.368$ is the ratio of neighbouring probabilities, not the total probability of odd states.` },
  ],
  gens: [
    { id: 'pfun-r4g1', type: 'nat', level: 3, exams: G, sub: 'harmonic oscillator',
      make(r) {
        const nu = choose(r, [200, 300, 500, 800, 1000, 1500]), T = choose(r, [200, 300, 500, 800, 1000]), odd = r() < 0.5;
        const q = Math.exp(-1.438777 * nu / T), P = odd ? q / (1 + q) : 1 / (1 + q);
        return { q: `A molecular vibration of wavenumber $${nu}$ cm$^{-1}$ is in equilibrium at $${T}$ K. The probability that its quantum number $n$ is ${odd ? 'odd' : 'even'} is ______ (four decimal places; $hc/k = 1.4388$ cm K).`,
          answer: round(P, 4), tol: Math.max(0.0005, round(P * 0.005, 4)), nu, T, odd,
          sol: `$q = e^{-hc\\tilde\\nu/kT} = e^{-1.4388\\times${nu}/${T}} = ${round(q, 5)}$. $P_n = (1 - q)q^n$, so $P_{\\rm even} = 1/(1 + q)$ and $P_{\\rm odd} = q/(1 + q)$. Answer: $${round(P, 4)}$.`,
          trap: 'Sum the geometric series over every second level: the ratio is $q^2$.' };
      },
      verify: (p) => { const q = Math.exp(-1.438777 * p.nu / p.T); return p.odd ? q / (1 + q) : 1 / (1 + q); } },
    { id: 'pfun-r4g2', type: 'nat', level: 5, exams: G, sub: 'particle in a box',
      make(r) {
        const t = choose(r, [1, 1.5, 2, 3, 4, 5, 6]);
        const m = boxMean(t);
        return { q: `A particle in a one-dimensional box has levels $n^2E_1$ ($n = 1, 2, \\ldots$). At $kT = ${t}E_1$, its mean energy above the ground state is ______ $E_1$ (three decimal places).`,
          answer: round(m, 3), tol: 0.003, t,
          sol: `Measure from the ground state: $\\varepsilon_n = (n^2 - 1)E_1$. Sum $\\varepsilon_ne^{-\\varepsilon_n/kT}$ and $e^{-\\varepsilon_n/kT}$ over levels until the terms are negligible; the ratio is $${round(m, 3)}\\,E_1$ (compare the classical $\\tfrac12kT = ${t / 2}E_1$).`,
          trap: 'The classical $\\tfrac12kT$ fails when only a few levels are populated.' };
      },
      verify: (p) => boxMean(p.t) },
    { id: 'pfun-r4g3', type: 'nat', level: 2, exams: G, sub: 'rotational partition function',
      make(r) {
        const m = choose(r, [['HCl', 1, 15.2], ['N$_2$', 2, 2.88], ['O$_2$', 2, 2.08], ['CO', 1, 2.77], ['CO$_2$', 2, 0.561], ['Cl$_2$', 2, 0.351]]);
        const T = choose(r, [200, 300, 500, 1000]), Z = T / (m[1] * m[2]);
        return { q: `${m[0]} has rotational temperature $\\theta_r = ${m[2]}$ K. Using the high-temperature formula with the symmetry number, its rotational partition function at $${T}$ K is ______ (one decimal place).`,
          answer: round(Z, 1), tol: round(Math.max(0.1, Z * 0.005), 1), T, s: m[1], th: m[2],
          sol: `${m[1] === 2 ? 'The molecule is symmetric (identical ends), so $\\sigma = 2$' : 'The two ends differ, so $\\sigma = 1$'}. $Z_{\\rm rot} = T/(\\sigma\\theta_r) = ${T}/(${m[1]}\\times${m[2]}) = ${round(Z, 1)}$.`,
          trap: 'Symmetric linear molecules need $\\sigma = 2$: half the rotational levels are missing.' };
      },
      verify: (p) => p.T / (p.s * p.th) },
  ],
};
