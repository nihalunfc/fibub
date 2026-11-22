// Extra question shapes for time-dependent-perturbation (templates qtd-m31..m35). Imported by time-dependent-perturbation.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq } from './_more.js';

const LET = 'spdfg';
const st = (n, l) => `${n}${LET[l]}`;

export default [
  { id: 'qtd-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'multipole selection rules', format: 'which transition',
    make(r) {
      const mode = choose(r, ['two', 'e2']);
      const okT = (a, b) => { const d = Math.abs(a[1] - b[1]); return mode === 'two' ? (d === 0 || d === 2) : (d === 2 || (d === 0 && a[1] > 0)); };
      const lv = [];
      for (let n = 1; n <= 5; n++) for (let l = 0; l < n; l++) lv.push([n, l]);
      const lo = choose(r, lv.filter((x) => x[0] <= 3));
      const ups = lv.filter((x) => x[0] > lo[0]);
      const good = ups.filter((u) => okT(lo, u)), bad = ups.filter((u) => !okT(lo, u) && Math.abs(u[1] - lo[1]) !== 0);
      const lab = (u) => `$${st(...lo)} \\to ${st(...u)}$`;
      const c = good.length ? choose(r, good) : [lo[0] + 1, lo[1]];
      const o = pickMcq(r, lab(c), bad.map(lab).concat([`$${st(...lo)} \\to ${st(lo[0] + 1, Math.min(lo[0], lo[1] + 1))}$`]));
      return { q: mode === 'two'
        ? 'In hydrogen, which ONE of these transitions can be driven by <b>two-photon</b> absorption (each photon an electric dipole, E1, photon)?'
        : 'In hydrogen, which ONE of these transitions is allowed as an <b>electric quadrupole</b> (E2) transition but forbidden as an electric dipole (E1) transition?', ...o,
        sol: mode === 'two'
          ? 'Each E1 photon changes $l$ by $\\pm1$ and flips parity, so two photons give $\\Delta l = 0$ or $\\pm2$ with no net parity change (the famous $1s \\to 2s$ two-photon line). Transitions with $\\Delta l = \\pm1$ or $\\pm3$ change parity or need too much angular momentum.'
          : 'E2 needs no parity change and $\\Delta l = 0, \\pm2$ (with $l = 0 \\to 0$ forbidden, since a rank-2 operator cannot connect two $l = 0$ states). E1 needs $\\Delta l = \\pm1$, so every E2 transition here is E1-forbidden. The options with odd $\\Delta l$ change parity and are not E2.',
        trap: mode === 'two' ? 'Two-photon transitions follow the opposite parity rule to one-photon ones.' : 'A $1s \\to 2s$ transition is not E2: $l = 0 \\to 0$ is forbidden for every single-photon multipole.' };
    } },
  { id: 'qtd-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: "Fermi's golden rule", format: 'statements',
    make(r) {
      const k = int(r, 2, 5);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['The transition rate is proportional to $|V_{fi}|^2$', true, '$\\Gamma = \\tfrac{2\\pi}{\\hbar}|V_{fi}|^2\\rho(E_f)$.'],
        [`If $|V_{fi}|$ is multiplied by ${k}, the rate is multiplied by ${k * k}`, true, `The rate goes as $|V_{fi}|^2$: factor $${k}^2 = ${k * k}$.`],
        [`If $|V_{fi}|$ is multiplied by ${k}, the rate is multiplied by ${k}`, false, `It goes as $|V_{fi}|^2$, so the factor is $${k * k}$.`],
        [`If the density of final states is multiplied by ${k}, the rate is multiplied by ${k}`, true, 'The rate is linear in $\\rho(E_f)$.'],
        ['At very short times the transition probability grows as $t^2$, not linearly', true, 'Before the energy spread $\\hbar/t$ covers many final states, $P \\approx |V_{fi}|^2t^2/\\hbar^2$.'],
        ['The golden-rule probability $\\Gamma t$ stays valid at all times', false, 'It requires $\\Gamma t \\ll 1$ (first order); at long times the initial state empties exponentially.'],
        ['The golden rule needs a continuum (or dense band) of final states', true, 'For a single discrete final state the probability oscillates instead of growing linearly.'],
        ['Energy need not be conserved at all in the final state', false, 'Only final states within about $\\hbar/t$ of the resonance energy contribute; in the long-time limit the rate has $\\delta(E_f - E_i \\mp \\hbar\\omega)$.'],
      ], { not });
      return { q: `Which statements about first-order transition rates (Fermi's golden rule) are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The rate is constant in time only in the window $\\hbar/\\Delta E \\ll t \\ll 1/\\Gamma$.' };
    } },
  { id: 'qtd-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'sudden and adiabatic limits',
    make(r) {
      const dE = choose(r, [1, 2, 5, 10, 20]); // meV
      const tau0 = 0.6582 / dE; // hbar/dE in ps
      const reg = choose(r, ['sudden', 'adiabatic']);
      const f = reg === 'sudden' ? choose(r, [1e-3, 3e-3, 1e-2]) : choose(r, [1e2, 3e2, 1e3]);
      const tau = tau0 * f;
      const O = {
        sudden: 'the state has no time to change: just after the change it is the old state, expanded in the new eigenstates',
        adiabatic: 'the system follows the instantaneous eigenstate with the same quantum number $n$',
        rabi: 'the populations of the two lowest levels oscillate at the frequency $\\Delta E/h$ for ever',
        gnd: 'the system always ends in the new ground state, whatever state it started in',
      };
      const o = pickMcq(r, O[reg], Object.keys(O).filter((k) => k !== reg).map((k) => O[k]));
      return { q: `A Hamiltonian is changed smoothly from $H_i$ to $H_f$ over a time $\\tau = ${fmt(tau, 2)}$ ps. The smallest relevant level spacing is $\\Delta E = ${dE}$ meV ($\\hbar = 0.658$ meV ps). Which best describes what happens to a system that starts in an eigenstate of $H_i$?`, ...o,
        sol: `Compare $\\tau$ with $\\hbar/\\Delta E = 0.658/${dE} = ${fmt(tau0, 3)}$ ps. Here $\\tau\\Delta E/\\hbar = ${fmt(f, 2)}$, ${reg === 'sudden' ? 'much less than 1: the sudden limit. The wavefunction is frozen, and the probability of ending in a new eigenstate $|m_f\\rangle$ is $|\\langle m_f|\\psi_i\\rangle|^2$.' : 'much greater than 1: the adiabatic limit. By the adiabatic theorem the system stays in the $n$-th instantaneous eigenstate (if no level crossing intervenes), picking up only a phase.'}`,
        trap: 'The comparison is with $\\hbar/\\Delta E$ of the spacing to the nearest level, not with the period of the motion in general.' };
    } },
  { id: 'qtd-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'transition probability', format: 'graph in words',
    make(r) {
      const O = {
        t2: 'it grows as $t^2$ (first order, while still small)',
        osc: 'it oscillates between 0 and a small maximum, at angular frequency $|\\Delta|$',
        sinc: 'it has a central peak at $\\Delta = 0$ of height $\\propto t^2$, with first zeros at $\\Delta = \\pm2\\pi/t$',
        rabi: 'it oscillates fully between 0 and 1 as $\\sin^2(\\Omega t/2)$',
        lin: 'it grows linearly in $t$ for all times',
      };
      const C = choose(r, [
        ['a weak constant perturbation, switched on at $t = 0$ and exactly resonant ($\\Delta = 0$), as a function of $t$', 't2', 'First order gives $P = |V_{fi}|^2\\,t^2/\\hbar^2$ at resonance.'],
        ['a weak perturbation detuned by $\\Delta$ from resonance, as a function of $t$', 'osc', '$P = \\dfrac{4|V_{fi}|^2}{\\hbar^2\\Delta^2}\\sin^2(\\Delta t/2)$: periodic with angular frequency $|\\Delta|$, never larger than $4|V|^2/\\hbar^2\\Delta^2$.'],
        ['a weak perturbation acting for a fixed time $t$, as a function of the detuning $\\Delta$', 'sinc', '$P \\propto \\sin^2(\\Delta t/2)/\\Delta^2$: height $\\propto t^2$ at $\\Delta = 0$ and zeros at $\\Delta t/2 = \\pm\\pi$.'],
        ['a strong resonant drive treated exactly (two-level atom), as a function of $t$', 'rabi', 'Rabi\'s formula on resonance: $P = \\sin^2(\\Omega t/2)$, full population transfer at $t = \\pi/\\Omega$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `A two-level system starts in its lower state. For ${C[0]}, the probability of finding it in the upper state behaves as follows:`, ...o, sol: C[2],
        trap: 'First-order growth $\\propto t^2$ is the start of a Rabi oscillation; it cannot continue past $P \\sim 1$.' };
    } },
  { id: 'qtd-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spontaneous emission scaling', format: 'scaling',
    make(r) {
      const tau = choose(r, [2, 5, 10, 16, 26]);
      const C = choose(r, [
        ['the transition wavelength is doubled (same dipole matrix element)', 8, '$A \\propto \\omega^3|d|^2$, and halving $\\omega$ divides $A$ by 8'],
        ['the transition wavelength is halved (same dipole matrix element)', 1 / 8, '$A \\propto \\omega^3|d|^2$, and doubling $\\omega$ multiplies $A$ by 8'],
        ['the dipole matrix element is doubled (same frequency)', 1 / 4, '$A \\propto |d|^2$, which grows by 4'],
        ['the transition frequency is tripled (same dipole matrix element)', 1 / 27, '$A \\propto \\omega^3$, which grows by 27'],
        ['the dipole matrix element is halved and the frequency doubled', 1 / 2, '$A \\propto \\omega^3|d|^2$ changes by $8\\times\\tfrac14 = 2$'],
      ]);
      const v = (x) => `$${fmt(tau * x, 3)}$ ns`;
      const o = pickMcq(r, v(C[1]), [v(1 / C[1]), v(C[1] > 1 ? 2 : 0.5), v(C[1] > 1 ? 4 : 0.25), v(1), v(C[1] ** 2)]);
      return { q: `An excited atomic level decays only by spontaneous E1 emission, with lifetime $${tau}$ ns. In a hypothetical atom where ${C[0]}, the lifetime would be`, ...o,
        sol: `The Einstein coefficient is $A = \\dfrac{\\omega^3|d|^2}{3\\pi\\varepsilon_0\\hbar c^3}$ and $\\tau = 1/A$. Here ${C[2]}, so $\\tau = ${tau}\\text{ ns}\\times${fmt(C[1], 3)} = ${fmt(tau * C[1], 3)}$ ns.`,
        trap: 'Lifetime is the inverse of the rate: a larger $\\omega^3$ means a shorter lifetime.' };
    } },
];
