// Potentials and gauges: E and B from V and A, gauge transformations, Coulomb, Lorenz and temporal gauges, the
// inhomogeneous wave equations, retarded time and retarded potentials (switched-on wire), Lienard-Wiechert and
// uniformly moving charges, vector potentials of standard sources, canonical momentum and the Aharonov-Bohm phase.
// Original questions (fibub) for GATE and CSIR NET. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './potentials-gauges.more.gen.js';
import more2 from './potentials-gauges.more2.gen.js';
import r4 from './potentials-gauges.r4.gen.js';

const MU0 = 1.25663706212e-6, C0 = 2.99792458e8, H = 6.62607015e-34, E = 1.602176634e-19, PI = Math.PI;

export default {
  topic: 'potentials-gauges',
  items: [
    // ---------- level 1 ----------
    { id: 'pgx-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'fields from potentials',
      q: 'In electrodynamics (time-dependent fields), the electric field is given in terms of the scalar potential $V$ and vector potential $\\vec A$ by',
      options: ['$\\vec E = -\\nabla V$', '$\\vec E = -\\nabla V + \\partial\\vec A/\\partial t$', '$\\vec E = -\\nabla V - \\partial\\vec A/\\partial t$', '$\\vec E = \\nabla\\times\\vec A$'], answer: 2,
      sol: '$\\nabla\\cdot\\vec B = 0$ lets us write $\\vec B = \\nabla\\times\\vec A$. Faraday\'s law then gives $\\nabla\\times(\\vec E + \\partial\\vec A/\\partial t) = 0$, so $\\vec E + \\partial\\vec A/\\partial t = -\\nabla V$. In statics the second term vanishes.',
      trap: '$-\\nabla V$ alone is curl-free and cannot describe induced electric fields.' },
    { id: 'pgx-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'Which transformation of the potentials, with $\\lambda(\\vec r, t)$ any smooth function, leaves both $\\vec E$ and $\\vec B$ unchanged?',
      options: ['$\\vec A \\to \\vec A + \\nabla\\lambda$, $V \\to V - \\partial\\lambda/\\partial t$', '$\\vec A \\to \\vec A + \\nabla\\lambda$, $V \\to V + \\partial\\lambda/\\partial t$', '$\\vec A \\to \\vec A + \\nabla\\times(\\lambda\\hat z)$, $V \\to V$', '$\\vec A \\to \\vec A - \\nabla\\lambda$, $V \\to V - \\nabla^2\\lambda$'], answer: 0,
      sol: '$\\nabla\\times\\nabla\\lambda = 0$ keeps $\\vec B$. Then $\\vec E\' = -\\nabla V\' - \\partial_t\\vec A\' = -\\nabla V + \\nabla\\partial_t\\lambda - \\partial_t\\vec A - \\nabla\\partial_t\\lambda = \\vec E$. The sign pair matters: the plus in $\\vec A$ needs the minus in $V$.' },
    { id: 'pgx-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'gauges',
      q: 'The Coulomb gauge is defined by the condition',
      options: ['$V = 0$', '$\\nabla\\cdot\\vec A = 0$', '$\\nabla\\times\\vec A = 0$', '$\\nabla\\cdot\\vec A + \\mu_0\\epsilon_0\\,\\partial V/\\partial t = 0$'], answer: 1,
      sol: 'Coulomb (or radiation, transverse) gauge: $\\nabla\\cdot\\vec A = 0$. Then Gauss\'s law becomes $\\nabla^2V = -\\rho/\\epsilon_0$ at every instant. $V = 0$ is the temporal gauge, and the last option is the Lorenz gauge.' },
    { id: 'pgx-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'gauges',
      q: 'The Lorenz gauge condition is',
      options: ['$\\nabla\\cdot\\vec A = 0$', '$\\nabla\\cdot\\vec A = \\dfrac{1}{c^2}\\dfrac{\\partial V}{\\partial t}$', '$\\nabla^2V = 0$', '$\\nabla\\cdot\\vec A + \\dfrac{1}{c^2}\\dfrac{\\partial V}{\\partial t} = 0$'], answer: 3,
      sol: 'Lorenz: $\\nabla\\cdot\\vec A + \\mu_0\\epsilon_0\\partial_tV = 0$, i.e. $\\partial_\\mu A^\\mu = 0$ with $A^\\mu = (V/c, \\vec A)$. It is Lorentz invariant and turns Maxwell\'s equations into two uncoupled wave equations.',
      trap: 'Note the plus sign; with a minus the condition is not Lorentz invariant.' },
    { id: 'pgx-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'vector potentials',
      q: 'A uniform field $\\vec B = 0.50$ T $\\hat z$ is described by $\\vec A = \\tfrac12\\vec B\\times\\vec r$. At a point 2.0 cm from the $z$ axis, $|\\vec A|$ is ______ mT m.',
      answer: 5, tol: 0.01, calc: () => 0.5 * 0.5 * 0.02 * 1e3,
      sol: '$\\vec A = \\tfrac12B(-y, x, 0)$, of magnitude $\\tfrac12Bs = 0.5\\times0.50\\times0.020 = 5.0\\times10^{-3}$ T m, circling the axis. Check: $\\nabla\\times\\vec A = (0, 0, \\tfrac12B + \\tfrac12B) = B\\hat z$.' },
    { id: 'pgx-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'retarded potentials',
      q: 'A charge distribution changes suddenly at $t = 0$. At a point 300 m away, the potentials first change at time ______ $\\mu$s (to two decimal places).',
      answer: 1.00, tol: 0.005, calc: () => 300 / C0 * 1e6,
      sol: 'Retarded potentials use the source at $t_r = t - \\mathscr r/c$, so news of the change travels at $c$: $t = 300/2.998\\times10^8 = 1.00\\times10^{-6}$ s. (In Coulomb gauge $V$ changes at once everywhere, but $\\vec E$ and $\\vec B$ still wait 1.00 $\\mu$s.)' },

    // ---------- level 2 ----------
    { id: 'pgx-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gauges',
      q: 'In the Coulomb gauge, the scalar potential $V(\\vec r, t)$ is',
      options: ['the retarded potential of $\\rho$', 'always zero', 'the instantaneous Coulomb potential of the charge distribution at time $t$', 'determined by the current density alone'], answer: 2,
      sol: 'With $\\nabla\\cdot\\vec A = 0$, Gauss\'s law gives $\\nabla^2V = -\\rho/\\epsilon_0$ with no time derivatives, so $V(\\vec r, t) = \\dfrac{1}{4\\pi\\epsilon_0}\\displaystyle\\int\\dfrac{\\rho(\\vec r\\,\', t)}{\\mathscr r}d\\tau\'$ at the same instant. This does not violate causality: $\\vec A$ carries compensating terms so that $\\vec E$ is retarded.',
      trap: 'An instantaneous potential is not an instantaneous signal; only fields are measurable.' },
    { id: 'pgx-008', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'Under a gauge transformation $\\vec A \\to \\vec A + \\nabla\\lambda$, $V \\to V - \\partial_t\\lambda$, which quantities are unchanged?',
      options: ['$\\vec E$', '$\\vec B$', '$\\nabla\\cdot\\vec A$', '$\\oint\\vec A\\cdot d\\vec l$ around a fixed closed loop'], answer: [0, 1, 3],
      sol: 'Fields are gauge invariant by construction. $\\nabla\\cdot\\vec A \\to \\nabla\\cdot\\vec A + \\nabla^2\\lambda$ changes (that is what a gauge choice fixes). $\\oint\\nabla\\lambda\\cdot d\\vec l = 0$ for single-valued $\\lambda$, so the loop integral, which equals the enclosed flux, is invariant: that is why the Aharonov-Bohm phase is physical.' },
    { id: 'pgx-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fields from potentials',
      q: 'A wave is described by $V = 0$ and $\\vec A = A_0\\sin(kx - \\omega t)\\,\\hat y$ with $A_0 = 1.0\\times10^{-6}$ V s/m and frequency 100 MHz. The amplitude of its electric field is ______ V/m (to the nearest whole number).',
      answer: 628, tol: 2, calc: () => 1e-6 * 2 * PI * 1e8,
      sol: '$\\vec E = -\\partial_t\\vec A = A_0\\omega\\cos(kx - \\omega t)\\hat y$, amplitude $A_0\\omega = 10^{-6}\\times2\\pi\\times10^8 = 628$ V/m. (And $\\vec B = \\nabla\\times\\vec A = kA_0\\cos(\\dots)\\hat z$, so $E/B = \\omega/k = c$.)' },
    { id: 'pgx-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wave equations',
      q: 'In the Lorenz gauge, Maxwell\'s equations for the potentials become',
      options: ['$\\nabla^2V = -\\rho/\\epsilon_0$ and $\\nabla^2\\vec A = -\\mu_0\\vec J$', '$\\Box^2V = -\\rho/\\epsilon_0$ and $\\Box^2\\vec A = -\\mu_0\\vec J$, with $\\Box^2 = \\nabla^2 - \\dfrac{1}{c^2}\\dfrac{\\partial^2}{\\partial t^2}$', '$\\Box^2V = 0$ and $\\Box^2\\vec A = -\\mu_0\\vec J$', '$\\Box^2V = -\\rho/\\epsilon_0$ and $\\nabla\\times\\vec A = \\mu_0\\vec J$'], answer: 1,
      sol: 'In general: $\\nabla^2V + \\partial_t(\\nabla\\cdot\\vec A) = -\\rho/\\epsilon_0$ and $\\Box^2\\vec A - \\nabla(\\nabla\\cdot\\vec A + \\mu_0\\epsilon_0\\partial_tV) = -\\mu_0\\vec J$. The Lorenz condition removes the coupling term and replaces $\\partial_t\\nabla\\cdot\\vec A$ by $-\\mu_0\\epsilon_0\\partial_t^2V$: two wave equations with sources, solved by retarded potentials.' },
    { id: 'pgx-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vector potentials',
      q: 'A long solenoid of radius 1.0 cm has 1000 turns per metre carrying 2.0 A. Outside it, where $\\vec B = 0$, the vector potential at 5.0 cm from the axis has magnitude ______ $\\mu$T m (to two decimal places).',
      answer: 2.51, tol: 0.01, calc: () => MU0 * 1000 * 2 * PI * 1e-4 / (2 * PI * 0.05) * 1e6,
      sol: 'By symmetry $\\vec A = A_\\phi\\hat\\phi$, and $\\oint\\vec A\\cdot d\\vec l = \\Phi$ gives $A_\\phi = \\Phi/2\\pi s$. $B = \\mu_0nI = 2.51\\times10^{-3}$ T, $\\Phi = B\\pi R^2 = 7.90\\times10^{-7}$ Wb, so $A_\\phi = \\dfrac{7.90\\times10^{-7}}{2\\pi\\times0.05} = 2.51\\times10^{-6}$ T m.',
      trap: 'Zero $\\vec B$ outside does not mean zero $\\vec A$: its loop integral must equal the flux inside.' },
    { id: 'pgx-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Aharonov-Bohm',
      q: 'Electrons pass on both sides of a long, shielded solenoid carrying flux $\\Phi$; they never enter the field region. Compared with $\\Phi = 0$, the interference pattern',
      options: ['shifts, because the two paths differ in phase by $e\\Phi/\\hbar$', 'is unchanged, because $\\vec B = 0$ along the paths', 'disappears, because the electrons lose coherence', 'shifts by an amount proportional to $\\vec B$ on the paths'], answer: 0,
      sol: 'A charge picks up phase $\\dfrac q\\hbar\\displaystyle\\int\\vec A\\cdot d\\vec l$ along a path. The difference between the two paths is $\\dfrac q\\hbar\\oint\\vec A\\cdot d\\vec l = \\dfrac{q\\Phi}{\\hbar}$, non-zero although $\\vec B = 0$ where the electrons go. This is the Aharonov-Bohm effect, confirmed by Tonomura\'s experiments.' },
    { id: 'pgx-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Aharonov-Bohm',
      q: 'The flux that shifts an electron Aharonov-Bohm interference pattern by exactly one fringe is $h/e$. Its value is ______ $\\times10^{-15}$ Wb (to two decimal places).',
      answer: 4.14, tol: 0.01, calc: () => H / E / 1e-15,
      sol: 'One fringe means a phase difference of $2\\pi$: $e\\Phi/\\hbar = 2\\pi$, so $\\Phi = h/e = \\dfrac{6.626\\times10^{-34}}{1.602\\times10^{-19}} = 4.14\\times10^{-15}$ Wb. (The superconducting flux quantum is $h/2e$, because Cooper pairs carry charge $2e$.)' },
    { id: 'pgx-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'The potentials are $V = V_0$ (a constant) and $\\vec A = \\vec A_0(\\vec r)$. Which gauge function $\\lambda$ removes the constant from $V$ without changing $\\vec A$?',
      options: ['$\\lambda = V_0x$', '$\\lambda = -V_0t$', '$\\lambda = V_0/t$', '$\\lambda = V_0t$'], answer: 3,
      sol: '$V\' = V - \\partial_t\\lambda = V_0 - V_0 = 0$ and $\\vec A\' = \\vec A + \\nabla(V_0t) = \\vec A$. A constant in $V$ never matters; the gauge function $V_0t$ makes that formal.',
      trap: '$\\lambda = -V_0t$ doubles the constant instead.' },
    { id: 'pgx-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fields from potentials',
      q: 'A static vector potential is $\\vec A = (-2y\\,\\hat x + 3x\\,\\hat y)$ T m (with $x, y$ in metres). The magnetic field $B_z$ is ______ T.',
      answer: 5, tol: 0, calc: () => 3 - (-2),
      sol: '$B_z = \\partial_xA_y - \\partial_yA_x = 3 - (-2) = 5$ T; the other components vanish. This $\\vec A$ is neither the symmetric nor the Landau gauge, but $\\nabla\\cdot\\vec A = 0$, so it is a Coulomb-gauge potential.' },
    { id: 'pgx-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'A uniform static field $\\vec E = E_0\\hat x$ is normally described by $V = -E_0x$, $\\vec A = 0$. An equally valid description is',
      options: ['$V = 0$, $\\vec A = E_0t\\,\\hat x$', '$V = 0$, $\\vec A = -E_0t\\,\\hat x$', '$V = 0$, $\\vec A = -E_0x\\,\\hat y$', '$V = E_0x$, $\\vec A = -2E_0t\\,\\hat x$'], answer: 1,
      sol: 'With $V = 0$ we need $-\\partial_t\\vec A = E_0\\hat x$, so $\\vec A = -E_0t\\,\\hat x$, which has zero curl. The gauge function is $\\lambda = -E_0xt$: $\\vec A\' = \\nabla\\lambda = -E_0t\\hat x$, $V\' = -E_0x - \\partial_t\\lambda = -E_0x + E_0x = 0$.',
      trap: 'The sign: $\\vec E = -\\partial_t\\vec A$, so $\\vec A$ must decrease in time along $\\hat x$.' },

    // ---------- level 3 ----------
    { id: 'pgx-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'canonical momentum',
      q: 'The Lagrangian of a charge $q$ (non-relativistic) in fields with potentials $V$, $\\vec A$ is',
      options: ['$\\tfrac12mv^2 - qV - q\\vec v\\cdot\\vec A$', '$\\tfrac12mv^2 + qV + q\\vec v\\cdot\\vec A$', '$\\tfrac12mv^2 - qV + q\\vec v\\cdot\\vec A$', '$\\tfrac12mv^2 - qV + q\\vec v\\times\\vec A$'], answer: 2,
      sol: 'With $L = \\tfrac12mv^2 - qV + q\\vec v\\cdot\\vec A$, the Euler-Lagrange equations give $m\\dot{\\vec v} = q(-\\nabla V - \\partial_t\\vec A) + q\\vec v\\times(\\nabla\\times\\vec A) = q(\\vec E + \\vec v\\times\\vec B)$. The canonical momentum is $\\vec p = m\\vec v + q\\vec A$.' },
    { id: 'pgx-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lienard-Wiechert',
      q: 'A point charge moves directly away from an observer at $0.50c$. The Liénard-Wiechert potential at the observer is $\\kappa$ times the Coulomb value $q/4\\pi\\epsilon_0\\mathscr r$ computed from the retarded distance $\\mathscr r$. The value of $\\kappa$ is ______ (to three decimal places).',
      answer: 0.667, tol: 0.002, calc: () => 1 / (1 + 0.5),
      sol: '$V = \\dfrac{1}{4\\pi\\epsilon_0}\\dfrac{q}{\\mathscr r - \\vec{\\mathscr r}\\cdot\\vec v/c}$, everything at the retarded time, with $\\vec{\\mathscr r}$ from the charge to the observer. Moving away, $\\vec{\\mathscr r}\\cdot\\vec v = -\\mathscr rv$: $\\kappa = \\dfrac{1}{1 + v/c} = \\dfrac{1}{1.5} = 0.667$. A receding charge "looks" weaker; an approaching one ($\\kappa = 2$) stronger.',
      trap: 'The factor comes from the retarded time interval, not from Lorentz contraction.' },
    { id: 'pgx-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'gauges',
      q: 'Which statements about the Lorenz gauge are correct?',
      options: ['The condition $\\partial_\\mu A^\\mu = 0$ is Lorentz invariant.', '$V$ and $\\vec A$ obey decoupled wave equations with sources $\\rho$ and $\\vec J$.', 'Some gauge freedom remains: any $\\lambda$ with $\\Box^2\\lambda = 0$ keeps the condition.', 'In this gauge $V$ is the instantaneous Coulomb potential.'], answer: [0, 1, 2],
      sol: '$\\partial_\\mu A^\\mu$ is a Lorentz scalar, so a condition that it vanish holds in every frame. Under $\\lambda$: $\\partial_\\mu A^\\mu \\to \\partial_\\mu A^\\mu + \\Box^2\\lambda$ (with the right sign convention), so wave-equation solutions $\\lambda$ remain free. Instantaneous $V$ belongs to the Coulomb gauge; in Lorenz gauge $V$ is retarded.' },
    { id: 'pgx-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauges',
      q: 'In the Coulomb gauge the vector potential obeys $\\Box^2\\vec A = -\\mu_0\\vec J_t$. Here $\\vec J_t$ is',
      options: ['the full current density $\\vec J$', 'the longitudinal (curl-free) part of $\\vec J$', 'the displacement current', 'the transverse (divergence-free) part of $\\vec J$'], answer: 3,
      sol: 'In Coulomb gauge $\\Box^2\\vec A = -\\mu_0\\vec J + \\mu_0\\epsilon_0\\nabla\\partial_tV$. Since $\\epsilon_0\\nabla\\partial_tV$ is exactly the longitudinal current $\\vec J_l$ (by continuity and the instantaneous Poisson equation), the source is $\\vec J - \\vec J_l = \\vec J_t$. That is why $\\vec A$ in this gauge describes only transverse radiation.' },
    { id: 'pgx-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fields from potentials',
      q: 'The potentials (SI units, $x$ in m, $t$ in s) are $V = 0$, $\\vec A = xt\\,\\hat y$. The fields are',
      options: ['$\\vec E = -x\\,\\hat y$, $\\vec B = t\\,\\hat z$', '$\\vec E = x\\,\\hat y$, $\\vec B = t\\,\\hat z$', '$\\vec E = -x\\,\\hat y$, $\\vec B = -t\\,\\hat z$', '$\\vec E = 0$, $\\vec B = t\\,\\hat z$'], answer: 0,
      sol: '$\\vec E = -\\partial_t\\vec A = -x\\hat y$. $\\vec B = \\nabla\\times\\vec A = \\partial_x(xt)\\hat z = t\\hat z$. Check Faraday: $\\nabla\\times\\vec E = \\partial_x(-x)\\hat z = -\\hat z = -\\partial_t\\vec B$. ✓' },
    { id: 'pgx-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'The uniform field $B_0\\hat z$ can be described by the Landau gauge $\\vec A_L = -B_0y\\,\\hat x$ or the symmetric gauge $\\vec A_S = \\tfrac12B_0(-y\\,\\hat x + x\\,\\hat y)$. The gauge function with $\\vec A_S = \\vec A_L + \\nabla\\lambda$ is',
      options: ['$\\lambda = B_0xy$', '$\\lambda = \\tfrac12B_0(x^2 + y^2)$', '$\\lambda = \\tfrac12B_0xy$', '$\\lambda = -\\tfrac12B_0xy$'], answer: 2,
      sol: '$\\vec A_S - \\vec A_L = (\\tfrac12B_0y, \\tfrac12B_0x, 0) = \\nabla(\\tfrac12B_0xy)$. Both describe the same field, but quantum states look different in each (strips in Landau gauge, rings in symmetric gauge), related by the phase $e^{iq\\lambda/\\hbar}$.' },
    { id: 'pgx-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vector potentials',
      q: 'A long straight wire carries 10 A. The difference $|A(s_1) - A(s_2)|$ of its vector potential between $s_1 = 1.0$ cm and $s_2 = 10$ cm from the wire is ______ $\\mu$T m (to two decimal places).',
      answer: 4.61, tol: 0.02, calc: () => MU0 / (2 * PI) * 10 * Math.log(10) * 1e6,
      sol: 'For an infinite wire $\\vec A = -\\dfrac{\\mu_0I}{2\\pi}\\ln(s/s_0)\\hat z$ (the constant $s_0$ is arbitrary, a gauge choice). Differences are meaningful: $\\dfrac{\\mu_0I}{2\\pi}\\ln\\dfrac{s_2}{s_1} = 2\\times10^{-7}\\times10\\times\\ln10 = 4.61\\times10^{-6}$ T m. Check: $-\\partial_sA_z = \\mu_0I/2\\pi s = B_\\phi$.' },
    { id: 'pgx-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'canonical momentum',
      q: 'For a charged particle in a magnetic field, which statements are correct?',
      options: ['The mechanical momentum $m\\vec v$ is gauge invariant.', 'The canonical momentum $\\vec p = m\\vec v + q\\vec A$ depends on the gauge.', 'The Hamiltonian is $H = \\dfrac{(\\vec p - q\\vec A)^2}{2m} + qV$.', 'The kinetic energy $\\tfrac12mv^2$ changes under a gauge transformation.'], answer: [0, 1, 2],
      sol: '$m\\vec v$ is fixed by the Lorentz force, which involves only fields. $\\vec p$ shifts by $q\\nabla\\lambda$. With $\\vec p = m\\vec v + q\\vec A$, $H = \\vec p\\cdot\\vec v - L = \\tfrac12mv^2 + qV$, written as $(\\vec p - q\\vec A)^2/2m + qV$. Kinetic energy depends only on $\\vec v$, so it is gauge invariant.',
      trap: 'In quantum mechanics $\\hat{\\vec p} = -i\\hbar\\nabla$ is the canonical momentum, so wavefunctions change by a phase under gauge transformations.' },
    { id: 'pgx-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical momentum',
      q: 'An electron is at rest 5.0 cm from the $z$ axis in a uniform field $B = 0.10$ T along $z$, described in the symmetric gauge $\\vec A = \\tfrac12\\vec B\\times\\vec r$. The magnitude of its canonical momentum is ______ $\\times10^{-22}$ kg m/s (to one decimal place).',
      answer: 4.0, tol: 0.05, calc: () => E * 0.1 * 0.05 / 2 / 1e-22,
      sol: 'At rest $m\\vec v = 0$, so $\\vec p = q\\vec A$, with $|A| = \\tfrac12Bs = 0.5\\times0.10\\times0.050 = 2.5\\times10^{-3}$ T m. $|p| = 1.602\\times10^{-19}\\times2.5\\times10^{-3} = 4.0\\times10^{-22}$ kg m/s. In the Landau gauge $-By\\hat x$ the number would differ: canonical momentum is not physical on its own.' },
    { id: 'pgx-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauges',
      q: 'Can one always choose potentials with $V = 0$ everywhere (the temporal or Weyl gauge)?',
      options: ['No, only in charge-free regions', 'Yes, with $\\lambda(\\vec r, t) = \\int^tV(\\vec r, t\')\\,dt\'$', 'No, because it would make $\\vec E$ zero', 'Yes, but only for static fields'], answer: 1,
      sol: '$V\' = V - \\partial_t\\lambda = 0$ when $\\lambda = \\int^tV\\,dt\'$. Then $\\vec E = -\\partial_t\\vec A\'$ carries everything, even a static field ($\\vec A\' = -t\\nabla V$, growing in time). The price is that Gauss\'s law becomes a constraint on $\\vec A$.' },
    { id: 'pgx-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauges',
      q: 'The vector potential is $\\vec A = kxt\\,\\hat x$ ($k$ a constant). Which scalar potential, uniform in space, satisfies the Lorenz condition with it?',
      options: ['$V = -\\tfrac12kc^2t^2$', '$V = \\tfrac12kc^2t^2$', '$V = -kc^2t$', '$V = -kx$'], answer: 0,
      sol: 'Lorenz: $\\nabla\\cdot\\vec A + \\dfrac{1}{c^2}\\partial_tV = 0$, with $\\nabla\\cdot\\vec A = kt$. So $\\partial_tV = -kc^2t$ and $V = -\\tfrac12kc^2t^2$ (plus a constant).' },
    { id: 'pgx-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: 'A charge moves at $0.60c$ along the $x$ axis and passes the origin at $t = 0$. An observer sits at $(0, 3.0\\text{ m}, 0)$. The potential the observer measures at $t = 0$ was "sent" at a retarded time $t_r$ with $|t_r| = $ ______ ns (to one decimal place).',
      answer: 12.5, tol: 0.1, calc: () => 3 / C0 / Math.sqrt(1 - 0.36) * 1e9,
      sol: 'The retarded time satisfies $c(t - t_r) = |\\vec r - \\vec w(t_r)|$. With $t = 0$, $\\vec w = (vt_r, 0, 0)$: $c^2t_r^2 = v^2t_r^2 + d^2$, so $t_r = -\\dfrac{d}{c\\sqrt{1 - \\beta^2}} = -\\gamma\\dfrac dc = -1.25\\times\\dfrac{3.0}{2.998\\times10^8} = -12.5$ ns.',
      trap: 'It is not $d/c = 10$ ns: the light left from an earlier position, farther away.' },
    { id: 'pgx-029', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: 'Which statements about retarded potentials are correct?',
      options: ['$V(\\vec r, t) = \\dfrac{1}{4\\pi\\epsilon_0}\\displaystyle\\int\\dfrac{\\rho(\\vec r\\,\', t - \\mathscr r/c)}{\\mathscr r}d\\tau\'$ solves the Lorenz-gauge wave equation.', 'They satisfy the Lorenz condition automatically, given charge conservation.', 'The fields can be found by simply retarding Coulomb\'s and Biot-Savart\'s laws.', 'The advanced solution (with $t + \\mathscr r/c$) also solves the wave equation but is rejected for causality.'], answer: [0, 1, 3],
      sol: 'The retarded integrals solve $\\Box^2V = -\\rho/\\epsilon_0$ and $\\Box^2\\vec A = -\\mu_0\\vec J$, and the continuity equation makes them obey $\\nabla\\cdot\\vec A + \\mu_0\\epsilon_0\\partial_tV = 0$. But naive retardation fails for fields: Jefimenko\'s equations add terms with $\\dot\\rho$ and $\\dot{\\vec J}$ (the radiation terms). The advanced solution is mathematically fine and physically excluded.' },

    // ---------- level 4 ----------
    { id: 'pgx-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: 'A steady current $I_0$ is switched on at $t = 0$ in an infinite straight wire. The retarded vector potential gives, at distance $s$ for $t > s/c$, $B = \\dfrac{\\mu_0I_0}{2\\pi s}\\dfrac{ct}{\\sqrt{c^2t^2 - s^2}}$. At the moment when $ct = 2s$, $B$ is $\\kappa$ times its final steady value. The value of $\\kappa$ is ______ (to three decimal places).',
      answer: 1.155, tol: 0.002, calc: () => 2 / Math.sqrt(3),
      sol: 'Only wire segments with $\\sqrt{s^2 + z^2} < ct$ have sent news, so $A_z = \\dfrac{\\mu_0I_0}{2\\pi}\\ln\\dfrac{ct + \\sqrt{c^2t^2 - s^2}}{s}$; $B = -\\partial_sA_z$ gives the formula. At $ct = 2s$: $\\kappa = \\dfrac{2}{\\sqrt{3}} = 1.155$. The field first overshoots (infinite at the front, $ct = s$) and then relaxes to $\\mu_0I_0/2\\pi s$.' },
    { id: 'pgx-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'uniform motion',
      q: 'A charge $q$ moves with constant velocity $v$. Measure positions from its present position at the observation time, and let $\\gamma = 1/\\sqrt{1 - v^2/c^2}$. Which statements are correct?',
      options: ['Directly ahead of or behind it, at present distance $d$, $V = q/4\\pi\\epsilon_0d$.', 'Sideways (perpendicular to $\\vec v$), at present distance $d$, $V = \\gamma q/4\\pi\\epsilon_0d$.', 'Everywhere $\\vec A = \\vec vV/c^2$.', 'The potential everywhere is just the static Coulomb potential of the present position.'], answer: [0, 1, 2],
      sol: 'From Liénard-Wiechert, or by boosting the static potential: $V = \\dfrac{\\gamma q}{4\\pi\\epsilon_0\\sqrt{\\gamma^2(x - vt)^2 + y^2 + z^2}}$. On the line of motion this is $q/4\\pi\\epsilon_0|x - vt|$; sideways it is $\\gamma$ times larger. And $\\vec A = \\dfrac{\\mu_0q\\vec v}{4\\pi(\\mathscr r - \\vec{\\mathscr r}\\cdot\\vec v/c)} = \\vec vV/c^2$. So the potential is Coulomb-like only along the line of motion.' },
    { id: 'pgx-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lienard-Wiechert',
      q: 'At the retarded time, a charge moving at $0.60c$ has velocity at $60^\\circ$ to the line drawn from it towards the observer. The Liénard-Wiechert potential is $\\kappa\\,q/4\\pi\\epsilon_0\\mathscr r$ ($\\mathscr r$ the retarded distance). The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 1.43, tol: 0.01, calc: () => 1 / (1 - 0.6 * 0.5),
      sol: '$\\kappa = \\dfrac{1}{1 - \\hat{\\mathscr r}\\cdot\\vec v/c} = \\dfrac{1}{1 - 0.60\\cos60^\\circ} = \\dfrac{1}{0.70} = 1.43$. Only the velocity component towards the observer matters for this factor.' },
    { id: 'pgx-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: 'For time-dependent sources, why do the retarded potentials give correct fields while "retarded Coulomb\'s law" $\\vec E = \\dfrac{1}{4\\pi\\epsilon_0}\\int\\dfrac{\\rho(t_r)\\hat{\\mathscr r}}{\\mathscr r^2}d\\tau$ does not?',
      options: ['Because Coulomb\'s law is wrong even for static charges', 'Because the potentials are gauge dependent', 'Because differentiating the retarded potentials also acts on $t_r = t - \\mathscr r/c$, producing extra terms in $\\dot\\rho$ and $\\dot{\\vec J}$', 'Because retarded fields travel faster than light'], answer: 2,
      sol: '$\\nabla$ acting on $\\rho(\\vec r\\,\', t - \\mathscr r/c)$ gives $\\dot\\rho\\,\\nabla t_r = -\\dot\\rho\\,\\hat{\\mathscr r}/c$. These pieces, plus $-\\partial_t\\vec A$, build Jefimenko\'s equations: $\\vec E$ contains $\\rho/\\mathscr r^2$, $\\dot\\rho/c\\mathscr r$ and $\\dot{\\vec J}/c^2\\mathscr r$ terms, and the $1/\\mathscr r$ ones are radiation.' },
    { id: 'pgx-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Aharonov-Bohm',
      q: 'In an electron interference experiment, a tiny shielded solenoid between the two paths carries flux $1.0\\times10^{-14}$ Wb. By how many fringes does the pattern shift? Answer to two decimal places.',
      answer: 2.42, tol: 0.01, calc: () => 1e-14 / (H / E),
      sol: 'Shift in fringes $= \\dfrac{\\Delta\\phi}{2\\pi} = \\dfrac{e\\Phi/\\hbar}{2\\pi} = \\dfrac{\\Phi}{h/e} = \\dfrac{1.0\\times10^{-14}}{4.136\\times10^{-15}} = 2.42$.' },
    { id: 'pgx-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'In quantum mechanics, for the Schrödinger equation with $H = (\\hat{\\vec p} - q\\vec A)^2/2m + qV$ to keep its form under $\\vec A \\to \\vec A + \\nabla\\lambda$, $V \\to V - \\partial_t\\lambda$, the wavefunction must change as',
      options: ['$\\psi \\to \\psi$', '$\\psi \\to e^{-iq\\lambda/\\hbar}\\psi$', '$\\psi \\to \\lambda\\psi$', '$\\psi \\to e^{iq\\lambda/\\hbar}\\psi$'], answer: 3,
      sol: 'With $\\psi\' = e^{iq\\lambda/\\hbar}\\psi$: $(-i\\hbar\\nabla - q\\vec A\')\\psi\' = e^{iq\\lambda/\\hbar}(-i\\hbar\\nabla + q\\nabla\\lambda - q\\vec A - q\\nabla\\lambda)\\psi = e^{iq\\lambda/\\hbar}(-i\\hbar\\nabla - q\\vec A)\\psi$, and $i\\hbar\\partial_t\\psi\' - qV\'\\psi\'$ works the same way. Probabilities $|\\psi|^2$ are unchanged. Local phase invariance is the seed of gauge theories.' },
    { id: 'pgx-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'vector potentials',
      q: 'The SI unit of the vector potential $\\vec A$ is equivalent to',
      options: ['V/m', 'V s/m (= T m)', 'T/m', 'A/m'], answer: 1,
      sol: '$\\vec B = \\nabla\\times\\vec A$ gives T m; $\\vec E = -\\partial_t\\vec A$ gives (V/m) s = V s/m; and T = V s/m$^2$, so they agree. Also $q\\vec A$ is a momentum: C V s/m = J s/m = kg m/s.' },
    { id: 'pgx-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uniform motion',
      q: 'A charge moves at constant speed $0.60c$. At a point directly sideways from its present position, at present distance $d$, the potential is $\\kappa\\,q/4\\pi\\epsilon_0d$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 1.25, tol: 0.005, calc: () => 1 / Math.sqrt(1 - 0.36),
      sol: '$V = \\dfrac{q}{4\\pi\\epsilon_0d\\sqrt{1 - \\beta^2\\sin^2\\theta}}$ with $\\theta$ measured from $\\vec v$ at the present position. Sideways, $\\theta = 90^\\circ$: $\\kappa = 1/\\sqrt{1 - 0.36} = \\gamma = 1.25$.' },

    // ---------- level 5 ----------
    { id: 'pgx-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'uniform motion',
      q: 'A charge moves at constant speed $0.80c$. At a point whose line from the present position makes $60^\\circ$ with the velocity, at present distance $d$, the potential is $\\kappa\\,q/4\\pi\\epsilon_0d$. The value of $\\kappa$ is ______ (to three decimal places).',
      answer: 1.387, tol: 0.002, calc: () => 1 / Math.sqrt(1 - 0.64 * 0.75),
      sol: 'Boost the static potential: $V = \\dfrac{\\gamma q}{4\\pi\\epsilon_0\\sqrt{\\gamma^2X^2 + Y^2}}$ with $X = d\\cos\\theta$, $Y = d\\sin\\theta$. Simplify: $V = \\dfrac{q}{4\\pi\\epsilon_0d\\sqrt{\\cos^2\\theta + \\sin^2\\theta/\\gamma^2}} = \\dfrac{q}{4\\pi\\epsilon_0d\\sqrt{1 - \\beta^2\\sin^2\\theta}}$. Here $1 - 0.64\\times0.75 = 0.52$, so $\\kappa = 1/\\sqrt{0.52} = 1.387$.' },
    { id: 'pgx-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: 'The potentials $V = 0$, $\\vec A = B_0x\\,\\hat y$ describe a uniform static $\\vec B = B_0\\hat z$ with $\\vec E = 0$. Which of these pairs describe exactly the same fields?',
      options: ['$V = 0$, $\\vec A = -B_0y\\,\\hat x$', '$V = 0$, $\\vec A = \\tfrac12B_0(-y\\,\\hat x + x\\,\\hat y)$', '$V = B_0x$, $\\vec A = B_0x\\,\\hat y$', '$V = 5$ V, $\\vec A = B_0x\\,\\hat y + (yz\\,\\hat x + xz\\,\\hat y + xy\\,\\hat z)$ (SI units)'], answer: [0, 1, 3],
      sol: 'The first two differ from $B_0x\\hat y$ by $\\nabla(-B_0xy)$ and $\\nabla(-\\tfrac12B_0xy)$: same $\\vec B$, and $V = 0$ keeps $\\vec E = 0$. The fourth adds $\\nabla(xyz)$ to $\\vec A$ and a constant to $V$: no change in either field. The third has $-\\nabla V = -B_0\\hat x \\ne 0$, a real electric field.' },
    { id: 'pgx-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'retarded potentials',
      q: 'A current of 1.0 A is switched on at $t = 0$ in an infinite straight wire. At $s = 1.0$ m, at the moment when $ct = 2.0$ m, the magnitude of the electric field is ______ V/m (to one decimal place).',
      answer: 34.6, tol: 0.2, calc: () => MU0 * C0 / (2 * PI) / Math.sqrt(3),
      sol: 'With $A_z = \\dfrac{\\mu_0I_0}{2\\pi}\\ln\\dfrac{ct + \\sqrt{c^2t^2 - s^2}}{s}$ and $V = 0$ (the wire is neutral): $E_z = -\\partial_tA_z = -\\dfrac{\\mu_0I_0c}{2\\pi\\sqrt{c^2t^2 - s^2}}$. Numbers: $\\dfrac{\\mu_0c}{2\\pi} = 2\\times10^{-7}\\times2.998\\times10^8 = 59.96$ $\\Omega$, and $\\sqrt{4 - 1} = 1.732$ m: $|E| = 59.96/1.732 = 34.6$ V/m, opposing the current (Lenz). It fades as $1/t$.',
      trap: 'The steady wire has no electric field; this one exists only while the news front passes.' },
    { id: 'pgx-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'gauges',
      q: 'Potentials already in the Lorenz gauge are transformed with a gauge function $\\lambda$. They remain in the Lorenz gauge if and only if',
      options: ['$\\nabla^2\\lambda = 0$', '$\\partial\\lambda/\\partial t = 0$', '$\\nabla^2\\lambda - \\dfrac{1}{c^2}\\dfrac{\\partial^2\\lambda}{\\partial t^2} = 0$', '$\\lambda$ is a constant'], answer: 2,
      sol: '$\\nabla\\cdot\\vec A\' + \\dfrac{1}{c^2}\\partial_tV\' = \\nabla\\cdot\\vec A + \\dfrac{1}{c^2}\\partial_tV + \\nabla^2\\lambda - \\dfrac{1}{c^2}\\partial_t^2\\lambda$. The condition survives iff $\\Box^2\\lambda = 0$. This residual freedom lets one also set $V = 0$ for free radiation, leaving two transverse polarisations.' },
    { id: 'pgx-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fields from potentials',
      q: 'The potentials are $V = 0$ and $\\vec A = \\beta t^2\\,\\hat z$ with $\\beta = 3.0$ V/(m s), everywhere in a region. The electric field magnitude at $t = 2.0$ s is ______ V/m.',
      answer: 12, tol: 0.01, calc: () => 2 * 3 * 2,
      sol: '$\\vec E = -\\partial_t\\vec A = -2\\beta t\\,\\hat z$, of magnitude $2\\times3.0\\times2.0 = 12$ V/m, and $\\vec B = \\nabla\\times\\vec A = 0$ (no space dependence). A uniform electric field growing in time can come entirely from $\\vec A$.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'pgx-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'vector potentials',
      make(r) {
        const B = choose(r, [0.1, 0.2, 0.5, 1, 2]), x = int(r, -5, 5), y = int(r, 1, 5);
        const val = 0.5 * B * Math.hypot(x, y) * 1e-2 * 1e3;
        return { q: `A uniform field of ${B} T along $z$ is described in the symmetric gauge $\\vec A = \\tfrac12\\vec B\\times\\vec r$. At the point $(${x}, ${y}, 0)$ cm, $|\\vec A|$ is ______ mT m (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.005), unit: 'mT m', B, x, y,
          sol: `$\\vec A = \\tfrac12B(-y, x, 0)$, so $|\\vec A| = \\tfrac12B\\sqrt{x^2 + y^2} = 0.5\\times${B}\\times${round(Math.hypot(x, y) / 100, 5)}$ m $= ${round(val, 4)}$ mT m.`,
          trap: 'Only the distance from the $z$ axis counts.' };
      },
      verify: (p) => 0.5 * p.B * Math.hypot(p.x, p.y) * 10 },
    { id: 'pgx-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vector potentials',
      make(r) {
        const n = choose(r, [500, 1000, 2000, 5000]), I = choose(r, [0.5, 1, 2, 5]), R = choose(r, [1, 2, 3]), s = choose(r, [0.5, 1, 2, 4, 6]) * R;
        const B = MU0 * n * I, A = (s <= R ? B * (s / 100) / 2 : B * (R / 100) ** 2 / (2 * s / 100)) * 1e6;
        return { q: `A long solenoid of radius ${R} cm has ${n} turns per metre carrying ${I} A. The magnitude of the vector potential at ${round(s, 2)} cm from its axis is ______ $\\mu$T m (three significant figures).`,
          answer: +A.toPrecision(3), tol: A * 0.01, unit: 'μT m', n, I, R, s,
          sol: `$B = \\mu_0nI = ${B.toPrecision(4)}$ T inside. $\\oint\\vec A\\cdot d\\vec l = \\Phi_{enc}$ round a circle of radius $s$: ${s <= R ? `inside, $2\\pi sA = B\\pi s^2$, so $A = Bs/2$` : `outside, $2\\pi sA = B\\pi R^2$, so $A = BR^2/2s$`} $= ${A.toPrecision(4)}$ $\\mu$T m.`,
          trap: s <= R ? 'Inside, $A$ grows linearly with $s$.' : 'Outside, $B = 0$ but $A$ falls only as $1/s$.' };
      },
      verify: (p) => { const B = MU0 * p.n * p.I; return (p.s <= p.R ? B * (p.s / 100) / 2 : B * (p.R / 100) ** 2 / (2 * p.s / 100)) * 1e6; } },
    { id: 'pgx-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fields from potentials',
      make(r) {
        const A0 = choose(r, [0.5, 1, 2, 5]), f = choose(r, [10, 50, 100, 300]), ask = choose(r, ['E', 'B']);
        const w = 2 * PI * f * 1e6, k = w / C0;
        const val = ask === 'E' ? A0 * 1e-6 * w : A0 * 1e-6 * k * 1e6;
        return { q: `In vacuum, $V = 0$ and $\\vec A = A_0\\cos(kz - \\omega t)\\,\\hat x$ with $A_0 = ${A0}\\times10^{-6}$ V s/m and frequency ${f} MHz. The amplitude of ${ask === 'E' ? 'the electric field is ______ V/m' : 'the magnetic field is ______ $\\mu$T'} (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, unit: ask === 'E' ? 'V/m' : 'μT', A0, f, ask,
          sol: `${ask === 'E' ? `$\\vec E = -\\partial_t\\vec A = -A_0\\omega\\sin(kz - \\omega t)\\hat x$; amplitude $A_0\\omega = ${A0}\\times10^{-6}\\times${w.toPrecision(4)} = ${val.toPrecision(4)}$ V/m.` : `$\\vec B = \\nabla\\times\\vec A = \\partial_zA_x\\,\\hat y = -kA_0\\sin(kz - \\omega t)\\hat y$; amplitude $kA_0$ with $k = \\omega/c = ${k.toPrecision(4)}$ m$^{-1}$: $${val.toPrecision(4)}$ $\\mu$T.`}`,
          trap: '$E_0 = \\omega A_0$ and $B_0 = kA_0$, so $E_0/B_0 = c$.' };
      },
      verify: (p) => { const w = 2 * PI * p.f * 1e6; return p.ask === 'E' ? p.A0 * 1e-6 * w : p.A0 * 1e-6 * (w / C0) * 1e6; } },
    { id: 'pgx-g04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      make(r) {
        const G = choose(r, [
          ['axt', '$V\' = V - ax$, $\\vec A\' = \\vec A + at\\,\\hat x$', ['$V\' = V + ax$, $\\vec A\' = \\vec A + at\\,\\hat x$', '$V\' = V - at$, $\\vec A\' = \\vec A + ax\\,\\hat x$', '$V\' = V$, $\\vec A\' = \\vec A + at\\,\\hat x$']],
          ['ay^2', '$V\' = V$, $\\vec A\' = \\vec A + 2ay\\,\\hat y$', ['$V\' = V - ay^2$, $\\vec A\' = \\vec A$', '$V\' = V$, $\\vec A\' = \\vec A + ay^2\\,\\hat y$', '$V\' = V - 2ay$, $\\vec A\' = \\vec A + 2ay\\,\\hat y$']],
          ['at^2', '$V\' = V - 2at$, $\\vec A\' = \\vec A$', ['$V\' = V + 2at$, $\\vec A\' = \\vec A$', '$V\' = V - at^2$, $\\vec A\' = \\vec A$', '$V\' = V$, $\\vec A\' = \\vec A + 2at\\,\\hat x$']],
          ['a\\sin(kx - \\omega t)', '$V\' = V + a\\omega\\cos(kx - \\omega t)$, $\\vec A\' = \\vec A + ak\\cos(kx - \\omega t)\\,\\hat x$', ['$V\' = V - a\\omega\\cos(kx - \\omega t)$, $\\vec A\' = \\vec A + ak\\cos(kx - \\omega t)\\,\\hat x$', '$V\' = V + a\\omega\\cos(kx - \\omega t)$, $\\vec A\' = \\vec A - ak\\cos(kx - \\omega t)\\,\\hat x$', '$V\' = V$, $\\vec A\' = \\vec A + ak\\cos(kx - \\omega t)\\,\\hat x$']],
          ['axy', '$V\' = V$, $\\vec A\' = \\vec A + a(y\\,\\hat x + x\\,\\hat y)$', ['$V\' = V$, $\\vec A\' = \\vec A + a(x\\,\\hat x + y\\,\\hat y)$', '$V\' = V - axy$, $\\vec A\' = \\vec A$', '$V\' = V$, $\\vec A\' = \\vec A + axy\\,\\hat z$']],
        ]);
        const o = mcqOptions(r, G[1], G[2], (v) => v);
        return { q: `Potentials $V$, $\\vec A$ are transformed with the gauge function $\\lambda = ${G[0]}$ ($a$, $k$, $\\omega$ constants). The new potentials are`, ...o,
          sol: `$\\vec A' = \\vec A + \\nabla\\lambda$ and $V' = V - \\partial_t\\lambda$. For $\\lambda = ${G[0]}$ this gives ${G[1]}. The fields are unchanged.`,
          trap: 'The time derivative enters $V$ with a minus sign; the gradient enters $\\vec A$ with a plus sign.' };
      } },
    { id: 'pgx-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'retarded potentials',
      make(r) {
        const b = choose(r, [0, 0.3, 0.5, 0.6, 0.8, 0.9]), d = choose(r, [1, 3, 6, 10, 30]);
        const val = d / C0 / Math.sqrt(1 - b * b) * 1e9;
        return { q: `A charge moving at ${b === 0 ? 'rest (speed 0)' : b + '$c$'} along the $x$ axis is at the origin at $t = 0$. An observer at $(0, ${d}\\text{ m}, 0)$ looks at its potential at $t = 0$. How long before $t = 0$ was that potential "sent" (the magnitude of the retarded time)? Answer in ns (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, val * 0.005), unit: 'ns', b, d,
          sol: `$c^2t_r^2 = (vt_r)^2 + d^2$ gives $|t_r| = \\dfrac{d}{c\\sqrt{1 - \\beta^2}} = \\gamma\\dfrac dc = ${round(1 / Math.sqrt(1 - b * b), 4)}\\times\\dfrac{${d}}{2.998\\times10^8} = ${round(val, 3)}$ ns.`,
          trap: 'The retarded position is behind the present one, so the delay is longer than $d/c$.' };
      },
      verify: (p) => p.d / C0 / Math.sqrt(1 - p.b * p.b) * 1e9 },
    { id: 'pgx-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lienard-Wiechert',
      make(r) {
        const b = choose(r, [0.2, 0.4, 0.5, 0.6, 0.8, 0.9]), a = choose(r, [0, 30, 45, 60, 90, 120, 180]);
        const val = 1 / (1 - b * Math.cos(a * PI / 180));
        return { q: `At the retarded time a charge moves at ${b}$c$ with its velocity at ${a}$^\\circ$ to the line from it towards the observer. The Liénard-Wiechert potential is $\\kappa\\,q/4\\pi\\epsilon_0\\mathscr r$ with $\\mathscr r$ the retarded distance. Find $\\kappa$ (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.002), b, a,
          sol: `$\\kappa = \\dfrac{1}{1 - \\hat{\\mathscr r}\\cdot\\vec v/c} = \\dfrac{1}{1 - ${b}\\cos${a}^\\circ} = \\dfrac{1}{${round(1 - b * Math.cos(a * PI / 180), 4)}} = ${round(val, 4)}$.`,
          trap: 'Approaching charges give $\\kappa > 1$, receding ones $\\kappa < 1$; sideways (90°) gives exactly 1.' };
      },
      verify: (p) => 1 / (1 - p.b * Math.cos(p.a * PI / 180)) },
    { id: 'pgx-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'uniform motion',
      make(r) {
        const b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9, 0.99]), th = choose(r, [0, 30, 45, 60, 90]);
        const s = Math.sin(th * PI / 180), val = 1 / Math.sqrt(1 - b * b * s * s);
        return { q: `A charge moves with constant speed ${b}$c$. At a point at present distance $d$ from it, on a line making ${th}$^\\circ$ with its velocity, the potential is $\\kappa\\,q/4\\pi\\epsilon_0d$. Find $\\kappa$ (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.002), b, th,
          sol: `$V = \\dfrac{q}{4\\pi\\epsilon_0d\\sqrt{1 - \\beta^2\\sin^2\\theta}}$ (present position). $1 - ${b}^2\\sin^2${th}^\\circ = ${round(1 - b * b * s * s, 5)}$, so $\\kappa = ${round(val, 4)}$.`,
          trap: 'Along the line of motion $\\kappa = 1$; sideways it is $\\gamma$.' };
      },
      verify: (p) => 1 / Math.sqrt(1 - p.b ** 2 * Math.sin(p.th * PI / 180) ** 2) },
    { id: 'pgx-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Aharonov-Bohm',
      make(r) {
        const n = choose(r, [1e4, 2e4, 5e4]), I = choose(r, [5, 10, 20]), R = choose(r, [1, 2, 5]);
        const Phi = MU0 * n * I * 1e-3 * PI * (R * 1e-6) ** 2, val = Phi / (H / E);
        return { q: `A tiny solenoid of radius ${R} $\\mu$m with $${n / 1e4}\\times10^4$ turns per metre carries ${I} mA. It sits between the two paths of an electron interferometer, and no electron enters it. By how many fringes does the pattern shift? Answer to three significant figures.`,
          answer: +val.toPrecision(3), tol: val * 0.01, n, I, R,
          sol: `$\\Phi = \\mu_0nI\\pi R^2 = 1.2566\\times10^{-6}\\times${n}\\times${I}\\times10^{-3}\\times\\pi\\times(${R}\\times10^{-6})^2 = ${Phi.toPrecision(4)}$ Wb. Fringe shift $= \\Phi/(h/e) = ${Phi.toPrecision(4)}/(4.136\\times10^{-15}) = ${val.toPrecision(4)}$.`,
          trap: 'One fringe per $h/e$, not per $h/2e$ (that is for Cooper pairs).' };
      },
      verify: (p) => MU0 * p.n * p.I * 1e-3 * PI * (p.R * 1e-6) ** 2 / (H / E) },
    { id: 'pgx-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fields from potentials',
      make(r) {
        const c = [int(r, -4, 4), int(r, -4, 4), int(r, -4, 4), int(r, -4, 4), int(r, -4, 4), int(r, -4, 4)];
        const [a, b, cc, d, e, f] = c; // A = (a y + b z, cc x + d z, e x + f y)
        const comp = choose(r, ['x', 'y', 'z']);
        const val = comp === 'x' ? f - d : comp === 'y' ? b - e : cc - a;
        const term = (k, v) => (k === 0 ? '' : `${k > 0 ? '+' : '-'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`);
        const comp1 = (s) => { const t = s.trim().replace(/^\+ /, ''); return t === '' ? '0' : t.replace(/^- /, '-'); };
        return { q: `A static vector potential is $\\vec A = (${comp1(term(a, 'y') + ' ' + term(b, 'z'))})\\,\\hat x + (${comp1(term(cc, 'x') + ' ' + term(d, 'z'))})\\,\\hat y + (${comp1(term(e, 'x') + ' ' + term(f, 'y'))})\\,\\hat z$ in T m (lengths in m). Find $B_${comp}$ in tesla.`,
          answer: val, tol: 0, c, comp,
          sol: `$\\vec B = \\nabla\\times\\vec A$: $B_x = \\partial_yA_z - \\partial_zA_y = ${f} - (${d})$, $B_y = \\partial_zA_x - \\partial_xA_z = ${b} - (${e})$, $B_z = \\partial_xA_y - \\partial_yA_x = ${cc} - (${a})$. So $B_${comp} = ${val}$ T.`,
          trap: 'Keep the cyclic order in each curl component.' };
      },
      verify: (p) => { const [a, b, cc, d, e, f] = p.c; return p.comp === 'x' ? f - d : p.comp === 'y' ? b - e : cc - a; } },
    { id: 'pgx-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'retarded potentials',
      make(r) {
        const s = choose(r, [1, 2, 3, 5]), k = choose(r, [1.1, 1.25, 1.5, 2, 3, 5]), I = choose(r, [1, 2, 5]), ask = choose(r, ['ratio', 'E']);
        const val = ask === 'ratio' ? k / Math.sqrt(k * k - 1) : MU0 * C0 * I / (2 * PI * s * Math.sqrt(k * k - 1));
        return { q: `A current of ${I} A is switched on at $t = 0$ in an infinite straight wire. At distance ${s} m, consider the moment when $ct = ${k}\\times${s}$ m. ${ask === 'ratio' ? 'The magnetic field there is how many times its final steady value? (three decimal places)' : 'The magnitude of the electric field there is ______ V/m (three significant figures).'}`,
          answer: ask === 'ratio' ? round(val, 3) : +val.toPrecision(3), tol: Math.max(0.001, val * 0.005), s, k, I, ask,
          sol: `Retarded $A_z = \\dfrac{\\mu_0I}{2\\pi}\\ln\\dfrac{ct + \\sqrt{c^2t^2 - s^2}}{s}$. ${ask === 'ratio' ? `$B = -\\partial_sA_z = \\dfrac{\\mu_0I}{2\\pi s}\\dfrac{ct}{\\sqrt{c^2t^2 - s^2}}$, so the ratio is $\\dfrac{${k}}{\\sqrt{${k}^2 - 1}} = ${round(val, 4)}$.` : `$|E| = \\partial_tA_z = \\dfrac{\\mu_0Ic}{2\\pi\\sqrt{c^2t^2 - s^2}} = \\dfrac{59.96\\times${I}}{${round(s * Math.sqrt(k * k - 1), 4)}} = ${val.toPrecision(4)}$ V/m.`}`,
          trap: 'Both expressions blow up at the front $ct = s$ and settle down as $t$ grows.' };
      },
      verify: (p) => (p.ask === 'ratio' ? p.k / Math.sqrt(p.k ** 2 - 1) : MU0 * C0 * p.I / (2 * PI * p.s * Math.sqrt(p.k ** 2 - 1))) },
    { id: 'pgx-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vector potentials',
      make(r) {
        const I = choose(r, [1, 2, 5, 10, 20]), s1 = choose(r, [0.5, 1, 2]), m = choose(r, [2, 5, 10, 20]);
        const val = MU0 / (2 * PI) * I * Math.log(m) * 1e6;
        return { q: `A long straight wire carries ${I} A. The difference in the magnitude of its vector potential between ${s1} cm and ${round(s1 * m, 2)} cm from the wire is ______ $\\mu$T m (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.005), unit: 'μT m', I, m,
          sol: `$A_z = -\\dfrac{\\mu_0I}{2\\pi}\\ln(s/s_0)$, so $\\Delta A = \\dfrac{\\mu_0I}{2\\pi}\\ln\\dfrac{s_2}{s_1} = 2\\times10^{-7}\\times${I}\\times\\ln${m} = ${round(val, 4)}$ $\\mu$T m.`,
          trap: 'Only the ratio of distances matters, not the distances themselves.' };
      },
      verify: (p) => MU0 / (2 * PI) * p.I * Math.log(p.m) * 1e6 },
    { id: 'pgx-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical momentum',
      make(r) {
        const B = choose(r, [0.05, 0.1, 0.5, 1]), s = choose(r, [1, 2, 5, 10]), gauge = choose(r, ['symmetric', 'Landau']), phi = choose(r, [0, 30, 60, 90]);
        const x = s * Math.cos(phi * PI / 180) / 100, y = s * Math.sin(phi * PI / 180) / 100;
        const Amag = gauge === 'symmetric' ? 0.5 * B * s / 100 : B * Math.abs(y);
        const val = E * Amag * 1e22;
        return { q: `An electron is momentarily at rest at the point $(${round(x * 100, 3)}, ${round(y * 100, 3)}, 0)$ cm in a uniform field of ${B} T along $z$. In the ${gauge === 'symmetric' ? 'symmetric gauge $\\vec A = \\tfrac12\\vec B\\times\\vec r$' : 'Landau gauge $\\vec A = -By\\,\\hat x$'}, the magnitude of its canonical momentum is ______ $\\times10^{-22}$ kg m/s (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.001, val * 0.005), B, s, gauge, y, x,
          sol: `At rest $m\\vec v = 0$, so $|\\vec p| = e|\\vec A|$. ${gauge === 'symmetric' ? `$|\\vec A| = \\tfrac12Bs = ${round(Amag, 6)}$ T m` : `$|\\vec A| = B|y| = ${round(Amag, 6)}$ T m`}. $|\\vec p| = 1.602\\times10^{-19}\\times${round(Amag, 6)} = ${round(val, 4)}\\times10^{-22}$ kg m/s. The mechanical momentum is zero in every gauge.`,
          trap: 'Canonical momentum changes with the gauge; it is not a measurable momentum by itself.' };
      },
      verify: (p) => E * (p.gauge === 'symmetric' ? 0.5 * p.B * p.s / 100 : p.B * Math.abs(p.y)) * 1e22 },
    ...more,
    ...r4.gens,
  ],
};
