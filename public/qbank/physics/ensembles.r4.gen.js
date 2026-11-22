// Round 4 extras for ensembles: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const occ = (K, y) => { let z = 0, n = 0; for (let k = 0; k <= K; k++) { z += y ** k; n += k * y ** k; } return n / z; };

export default {
  items: [
    { id: 'ensm-r4-01', type: 'nat', level: 1, exams: G, sub: 'Boltzmann entropy',
      q: R`An isolated system has $10^{20}$ equally likely microstates. Its entropy is ______ $\times10^{-22}$ J/K ($k = 1.381\times10^{-23}$ J/K).`,
      answer: 6.36, tol: 0.03, calc: () => 1.380649e-23 * Math.log(1e20) / 1e-22,
      sol: R`$S = k\ln\Omega = 1.381\times10^{-23}\times20\ln10 = 1.381\times10^{-23}\times46.05 = 6.36\times10^{-22}$ J/K. Even an enormous number of microstates gives a tiny entropy in J/K; macroscopic entropies need $\ln\Omega\sim10^{23}$.`,
      trap: R`Using $\log_{10}$ instead of the natural logarithm gives $2.76\times10^{-22}$ J/K.` },
    { id: 'ensm-r4-02', type: 'mcq', level: 2, exams: G, sub: 'canonical ensemble',
      q: R`A large system is in equilibrium with a heat bath at temperature $T > 0$. Which statement is correct?`,
      options: [R`The most probable single microstate is one whose energy equals $\langle E\rangle$.`, R`The system is most likely to be found with energy close to its ground-state energy.`, R`The most probable microstate is the ground state, yet the most probable energy is close to $\langle E\rangle$.`, R`All microstates are equally probable, because the bath fixes the temperature.`], answer: 2,
      sol: R`Each microstate has probability $\propto e^{-E_i/kT}$, largest for the ground state. But the probability of an energy $E$ is $\Omega(E)e^{-E/kT}$, and $\Omega(E)$ grows enormously fast with $E$. The product has a sharp peak near $\langle E\rangle$. Individual microstates there are each less likely than the ground state, but there are vastly more of them.`,
      trap: R`"Most probable microstate" and "most probable energy" are different questions; the density of states makes the difference.` },
    { id: 'ensm-r4-03', type: 'nat', level: 2, exams: G, sub: 'Boltzmann entropy',
      q: R`An isolated set of $N\gg1$ two-level units has exactly one quarter of them excited. Using Stirling's formula, its entropy per unit, $S/Nk$, is ______ (three decimal places).`,
      answer: 0.562, tol: 0.003, calc: () => -(0.25 * Math.log(0.25) + 0.75 * Math.log(0.75)),
      sol: R`$\Omega = \dfrac{N!}{n!(N - n)!}$ with $n = N/4$. Stirling gives $\ln\Omega\approx-N[f\ln f + (1 - f)\ln(1 - f)]$ with $f = 1/4$: $S/Nk = 0.25\ln4 + 0.75\ln(4/3) = 0.347 + 0.216 = 0.562$. The maximum, $\ln2 = 0.693$, is at half excitation.`,
      trap: R`Keeping only $-f\ln f$ ($0.347$) misses the entropy from choosing which units stay unexcited.` },
    { id: 'ensm-r4-04', type: 'mcq', level: 3, exams: G, sub: 'canonical ensemble',
      q: R`In deriving the canonical distribution, a small system with energy $E$ is in contact with a large reservoir, and the total energy $E_0$ is fixed. The factor $e^{-E/kT}$ arises because`,
      options: [R`$\ln\Omega_R(E_0 - E)\approx\ln\Omega_R(E_0) - E/kT$ for $E\ll E_0$, so the reservoir's number of states falls exponentially with $E$`, R`the system's own number of states $\Omega(E)$ falls exponentially with energy`, R`energy conservation forces the system's energy to equal $kT$`, R`the reservoir pushes the system towards its lowest-energy state`], answer: 0,
      sol: R`All states of system plus reservoir are equally likely, so the probability of one system microstate of energy $E$ is proportional to the number of reservoir states left, $\Omega_R(E_0 - E)$. Expanding the logarithm, $\partial\ln\Omega_R/\partial E = 1/kT$ (the definition of the reservoir's temperature), so $\Omega_R\propto e^{-E/kT}$. The reservoir is so large that the next terms vanish.`,
      trap: R`The exponential comes from the reservoir's states, not from any property of the small system.` },
    { id: 'ensm-r4-05', type: 'mcq', level: 3, exams: G, sub: 'microcanonical ensemble',
      q: R`A model gas of $N$ particles has $\Omega(E, V)\propto(V - Nb)^NE^{3N/2}$, with $b$ a constant. From $S = k\ln\Omega$, its equation of state is`,
      options: [R`$P = NkT/V$`, R`$P = NkT/(V + Nb)$`, R`$P = 2E/3V$`, R`$P = NkT/(V - Nb)$`], answer: 3,
      sol: R`$\dfrac PT = \Big(\dfrac{\partial S}{\partial V}\Big)_E = \dfrac{Nk}{V - Nb}$, so $P = \dfrac{NkT}{V - Nb}$. Also $\dfrac1T = \dfrac{\partial S}{\partial E} = \dfrac{3Nk}{2E}$, giving $E = \tfrac32NkT$. The excluded volume $Nb$ reduces the space each particle can explore, raising the pressure.`,
      trap: R`$2E/3V$ uses the full volume; the pressure here is $2E/3(V - Nb)$.` },
    { id: 'ensm-r4-06', type: 'mcq', level: 4, exams: G, sub: 'Liouville theorem',
      q: R`A cloud of initial conditions for a damped oscillator, $\dot x = p/m$, $\dot p = -Kx - \gamma p$, occupies area $A_0$ in the $(x, p)$ plane. After time $t$ it occupies`,
      options: [R`$A_0$, by Liouville's theorem`, R`$A_0e^{-\gamma t}$`, R`$A_0e^{-\gamma t/2}$`, R`$A_0e^{+\gamma t}$`], answer: 1,
      sol: R`The rate of change of a phase-space area is set by the divergence of the flow: $\dfrac{\partial\dot x}{\partial x} + \dfrac{\partial\dot p}{\partial p} = 0 - \gamma$. So $dA/dt = -\gamma A$ and $A = A_0e^{-\gamma t}$. Liouville's theorem needs a Hamiltonian flow, whose divergence is zero; friction is not Hamiltonian, and the cloud shrinks towards the rest point.`,
      trap: R`$e^{-\gamma t/2}$ is the decay of the amplitude, not of the phase-space area.` },
    { id: 'ensm-r4-07', type: 'nat', level: 4, exams: G, sub: 'grand canonical ensemble',
      q: R`An adsorption site can hold 0, 1 or 2 identical non-interacting atoms, each bound with energy $-\varepsilon$. The gas fixes the chemical potential so that $e^{(\mu + \varepsilon)/kT} = 2$. The mean number of atoms on the site is ______ (three decimal places).`,
      answer: 1.429, tol: 0.003, calc: () => occ(2, 2),
      sol: R`With $y = e^{(\mu + \varepsilon)/kT}$, the states with $n$ atoms have Gibbs factor $y^n$ (identical atoms: one state for each $n$). $\Xi = 1 + y + y^2 = 7$, and $\langle n\rangle = \dfrac{y + 2y^2}{\Xi} = \dfrac{2 + 8}{7} = 1.429$.`,
      trap: R`Treating the two places as independent single sites gives $2y/(1 + y) = 1.333$, which assumes distinguishable positions.` },
    { id: 'ensm-r4-08', type: 'msq', level: 3, exams: G, sub: 'canonical ensemble', format: 'statements',
      q: R`A system is made of $N$ independent, distinguishable, identical subsystems, each with partition function $Z_1$, in contact with a heat bath. Which statements are correct?`,
      options: [R`$Z = Z_1^N$`, R`$\langle E\rangle = N\langle E_1\rangle$`, R`The variance of the total energy is $N$ times the variance for one subsystem.`, R`The relative fluctuation $\Delta E/\langle E\rangle$ does not depend on $N$.`], answer: [0, 1, 2],
      sol: R`The energy is a sum of independent terms, so the Boltzmann factor factorises and $Z = Z_1^N$; then $\ln Z$, $\langle E\rangle = -\partial\ln Z/\partial\beta$ and the variance $\partial^2\ln Z/\partial\beta^2$ are all $N$ times the single values. The rms fluctuation grows only as $\sqrt N$, so the relative fluctuation falls as $1/\sqrt N$, which is why large systems have sharp energies.`,
      trap: R`Variances add, standard deviations do not: the spread grows as $\sqrt N$.` },
    { id: 'ensm-r4-09', type: 'msq', level: 4, exams: G, sub: 'microcanonical ensemble', format: 'statements',
      q: R`Which statements about the entropy of an isolated system are correct?`,
      options: [R`For $\Omega$ equally likely microstates, the Gibbs entropy $-k\sum p_i\ln p_i$ equals $k\ln\Omega$.`, R`For large $N$, $k\ln$ of the number of states in a thin energy shell and $k\ln$ of the number of states below $E$ agree to leading order.`, R`For a system of only a few particles, those two definitions can give noticeably different entropies and temperatures.`, R`The Gibbs entropy of a system with a discrete set of states can be negative.`], answer: [0, 1, 2],
      sol: R`With $p_i = 1/\Omega$, $-k\sum p_i\ln p_i = k\ln\Omega$. In high dimensions almost all the volume below $E$ lies in a thin shell near $E$, so the two counts differ by a factor that is negligible in the logarithm compared with $N$. For small $N$ the difference matters. Each $-p_i\ln p_i\ge0$ when $0\le p_i\le1$, so the Gibbs entropy of discrete states can never be negative.`,
      trap: R`Negative entropy can appear only for continuous classical distributions without the $h$ normalisation, not for discrete states.` },
    { id: 'ensm-r4-10', type: 'nat', level: 5, exams: G, sub: 'fluctuations',
      q: R`Blackbody radiation fills a $1.0$ cm$^3$ cavity whose walls hold it at $300$ K (canonical ensemble). With $U = aVT^4$ ($a = 7.566\times10^{-16}$ J m$^{-3}$ K$^{-4}$), the rms relative fluctuation of its energy is ______ $\times10^{-5}$.`,
      answer: 5.20, tol: 0.05, calc: () => Math.sqrt(4 * 1.380649e-23 / (7.566e-16 * 1e-6 * 300 ** 3)) / 1e-5,
      sol: R`In the canonical ensemble $\langle(\Delta E)^2\rangle = kT^2C_V$, with $C_V = 4aVT^3$. So $\dfrac{\Delta E}{U} = \dfrac{\sqrt{4kaVT^5}}{aVT^4} = \sqrt{\dfrac{4k}{aVT^3}}$. With $aVT^3 = 7.566\times10^{-16}\times10^{-6}\times2.7\times10^7 = 2.04\times10^{-14}$ J/K: $\sqrt{5.52\times10^{-23}/2.04\times10^{-14}} = 5.20\times10^{-5}$. The cavity holds only about $5\times10^8$ photons, which is why the fluctuation is this large.`,
      trap: R`Using $\langle(\Delta E)^2\rangle = kTC_V$ (missing a factor of $T$) gives a dimensionally wrong result.` },
  ],
  gens: [
    { id: 'ensm-r4g1', type: 'nat', level: 4, exams: G, sub: 'grand canonical ensemble',
      make(r) {
        const K = choose(r, [1, 2, 3]), eps = choose(r, [50, 80, 100, 120]), d = choose(r, [-40, -20, -10, 0, 10, 20, 40]), T = choose(r, [200, 300, 400]);
        const mu = -eps + d, y = Math.exp(d * 1e-3 * C.e / (C.kB * T));
        const n = occ(K, y);
        return { q: `A surface site can hold up to ${K} identical non-interacting atom${K > 1 ? 's' : ''}, each bound with energy $-${eps}$ meV. The gas at $${T}$ K fixes the chemical potential at $\\mu = ${mu}$ meV. The mean number of atoms on the site is ______ (three decimal places).`,
          answer: round(n, 3), tol: 0.003, K, y,
          sol: `$y = e^{(\\mu + \\varepsilon)/kT} = e^{${d}/${round(C.kB * T / C.e * 1e3, 3)}} = ${round(y, 4)}$. Each occupancy $n = 0..${K}$ has Gibbs factor $y^n$, so $\\langle n\\rangle = \\dfrac{\\sum ny^n}{\\sum y^n} = ${round(n, 3)}$.`,
          trap: 'The chemical potential enters through $\\mu + \\varepsilon$ per atom; identical atoms give one state per occupancy.' };
      },
      verify: (p) => occ(p.K, p.y) },
    { id: 'ensm-r4g2', type: 'nat', level: 5, exams: G, sub: 'fluctuations',
      make(r) {
        const V = choose(r, [0.1, 0.5, 1, 2, 10]), T = choose(r, [100, 300, 500, 1000, 2000]);
        const f = Math.sqrt(4 * C.kB / (7.566e-16 * V * 1e-6 * T ** 3)) * 1e6;
        return { q: `Blackbody radiation fills a $${V}$ cm$^3$ cavity held at $${T}$ K. Its rms relative energy fluctuation in the canonical ensemble is ______ parts per million ($a = 7.566\\times10^{-16}$ J m$^{-3}$ K$^{-4}$).`,
          answer: round(f, 2), tol: round(Math.max(0.01, f * 0.01), 2), V, T,
          sol: `$\\langle(\\Delta E)^2\\rangle = kT^2C_V$ with $C_V = 4aVT^3$, so $\\Delta E/U = \\sqrt{4k/(aVT^3)} = ${round(f, 2)}\\times10^{-6}$.`,
          trap: 'The canonical energy variance is $kT^2C_V$; the photon number is not fixed, so the fluctuations are larger than for a gas of atoms.' };
      },
      verify: (p) => Math.sqrt(4 * C.kB / (7.566e-16 * p.V * 1e-6 * p.T ** 3)) * 1e6 },
    { id: 'ensm-r4g3', type: 'nat', level: 3, exams: G, sub: 'microcanonical ensemble',
      make(r) {
        const f = choose(r, [0.05, 0.1, 0.2, 0.25, 0.3, 0.4]), eps = choose(r, [1, 2, 5, 10]), askT = r() < 0.5;
        const S = -(f * Math.log(f) + (1 - f) * Math.log(1 - f)), T = eps * 1e-3 * C.e / C.kB / Math.log((1 - f) / f);
        return { q: `An isolated set of $N\\gg1$ two-level units (splitting $${eps}$ meV) has a fraction $${f}$ of them excited. ${askT ? 'Its temperature is ______ K (one decimal place).' : 'Its entropy per unit, $S/Nk$, is ______ (three decimal places).'}`,
          answer: askT ? round(T, 1) : round(S, 3), tol: askT ? round(Math.max(0.1, T * 0.01), 1) : 0.003, f, eps, askT,
          sol: `$S/Nk = -[f\\ln f + (1 - f)\\ln(1 - f)] = ${round(S, 4)}$. ${askT ? `$1/kT = \\partial S/\\partial E = \\dfrac{1}{\\varepsilon}\\ln\\dfrac{1 - f}{f}$, so $T = \\dfrac{\\varepsilon/k}{\\ln(${round((1 - f) / f, 3)})} = ${round(T, 1)}$ K.` : ''}`,
          trap: 'Both the excited and the unexcited fractions contribute to the entropy.' };
      },
      verify: (p) => (p.askT ? p.eps * 1e-3 * C.e / C.kB / Math.log((1 - p.f) / p.f) : -(p.f * Math.log(p.f) + (1 - p.f) * Math.log(1 - p.f))) },
  ],
};
