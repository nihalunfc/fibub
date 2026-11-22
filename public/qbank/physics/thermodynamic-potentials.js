// Thermodynamic potentials U, H, F, G: natural variables, Legendre transforms, Maxwell relations, TdS equations,
// Cp − Cv, energy equation, Joule and Joule–Thomson expansions, chemical potential, magnetic systems, stability.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const R = 8.314;

const MAXWELL = {
  U: ['U(S, V)', '$\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V$', 'dU = T\\,dS - P\\,dV'],
  H: ['H(S, P)', '$\\left(\\frac{\\partial T}{\\partial P}\\right)_S = \\left(\\frac{\\partial V}{\\partial S}\\right)_P$', 'dH = T\\,dS + V\\,dP'],
  F: ['F(T, V)', '$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V$', 'dF = -S\\,dT - P\\,dV'],
  G: ['G(T, P)', '$\\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P$', 'dG = -S\\,dT + V\\,dP'],
};
const WRONG = ['$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = -\\left(\\frac{\\partial P}{\\partial T}\\right)_V$', '$\\left(\\frac{\\partial S}{\\partial P}\\right)_T = \\left(\\frac{\\partial V}{\\partial T}\\right)_P$', '$\\left(\\frac{\\partial T}{\\partial V}\\right)_S = \\left(\\frac{\\partial P}{\\partial S}\\right)_V$'];

export default {
  topic: 'thermodynamic-potentials',
  items: [
    // ---- level 1 ----
    { id: 'tpot-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'potentials',
      q: 'The natural variables of the Gibbs free energy $G$ are',
      options: ['$T$ and $V$', '$S$ and $P$', '$T$ and $P$', '$S$ and $V$'], answer: 2,
      sol: '$G = H - TS$ gives $dG = -S\\,dT + V\\,dP$, so $G$ is naturally a function of $T$ and $P$: the two variables easiest to control in a lab.',
      trap: '$T, V$ belong to $F$; $S, V$ to $U$; $S, P$ to $H$.' },
    { id: 'tpot-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'potentials',
      q: 'For a simple compressible system, the differential of the enthalpy $H = U + PV$ is',
      options: ['$dH = T\\,dS + V\\,dP$', '$dH = T\\,dS - P\\,dV$', '$dH = -S\\,dT + V\\,dP$', '$dH = T\\,dS - V\\,dP$'], answer: 0,
      sol: '$dH = dU + P\\,dV + V\\,dP$ and $dU = T\\,dS - P\\,dV$, so the $P\\,dV$ terms cancel: $dH = T\\,dS + V\\,dP$.' },
    { id: 'tpot-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'potentials',
      q: 'The Helmholtz free energy is defined as',
      options: ['$F = H - TS$', '$F = U + PV$', '$F = U + TS$', '$F = U - TS$'], answer: 3,
      sol: '$F = U - TS$. ($H - TS$ is the Gibbs energy $G$, and $U + PV$ the enthalpy.)' },
    { id: 'tpot-004', type: 'msq', level: 1, exams: ['jam'], sub: 'potentials', format: 'multi',
      q: 'Which of these are extensive (double when the system is doubled at the same $T$ and $P$)?',
      options: ['Internal energy $U$', 'Helmholtz energy $F$', 'Temperature $T$', 'Gibbs energy $G$'], answer: [0, 1, 3],
      sol: 'All four potentials are extensive, since they are energies of the whole system. Temperature, pressure and chemical potential are intensive.' },
    { id: 'tpot-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'equilibrium',
      q: 'A system is held at fixed temperature and pressure. At equilibrium it has the minimum possible',
      options: ['entropy $S$', 'Gibbs energy $G$', 'Helmholtz energy $F$', 'internal energy $U$'], answer: 1,
      sol: 'At fixed $T$ and $P$ the second law becomes $dG \\le 0$: $G$ falls until equilibrium, where it is a minimum. ($F$ is minimised at fixed $T$ and $V$; $S$ is maximised in an isolated system.)' },
    { id: 'tpot-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'potentials',
      q: 'From $dU = T\\,dS - P\\,dV$, the derivative $(\\partial U/\\partial S)_V$ equals',
      options: ['$-P$', '$V$', '$T$', '$P$'], answer: 2,
      sol: 'Read it off: at constant volume $dU = T\\,dS$. This is the thermodynamic definition of temperature.' },

    // ---- level 2 ----
    { id: 'tpot-007', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Maxwell relations',
      q: 'The Maxwell relation that follows from $dF = -S\\,dT - P\\,dV$ is',
      options: ['$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V$', '$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = -\\left(\\frac{\\partial P}{\\partial T}\\right)_V$', '$\\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P$', '$\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V$'], answer: 0,
      sol: 'Mixed derivatives of $F$ are equal: $\\frac{\\partial}{\\partial V}\\left(\\frac{\\partial F}{\\partial T}\\right) = \\frac{\\partial}{\\partial T}\\left(\\frac{\\partial F}{\\partial V}\\right)$, i.e. $\\left(\\frac{\\partial(-S)}{\\partial V}\\right)_T = \\left(\\frac{\\partial(-P)}{\\partial T}\\right)_V$. The two minus signs cancel.',
      trap: 'Option B keeps only one of the two minus signs. C comes from $G$ and D from $U$.' },
    { id: 'tpot-008', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Maxwell relations',
      q: 'The Maxwell relation from the Gibbs energy is',
      options: ['$\\left(\\frac{\\partial S}{\\partial P}\\right)_T = \\left(\\frac{\\partial V}{\\partial T}\\right)_P$', '$\\left(\\frac{\\partial T}{\\partial P}\\right)_S = \\left(\\frac{\\partial V}{\\partial S}\\right)_P$', '$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V$', '$\\left(\\frac{\\partial S}{\\partial P}\\right)_T = -\\left(\\frac{\\partial V}{\\partial T}\\right)_P$'], answer: 3,
      sol: '$dG = -S\\,dT + V\\,dP$, so $(\\partial G/\\partial T)_P = -S$ and $(\\partial G/\\partial P)_T = V$. Equal mixed derivatives: $-(\\partial S/\\partial P)_T = (\\partial V/\\partial T)_P$. Physically: most things expand when heated, so their entropy falls when squeezed.' },
    { id: 'tpot-009', type: 'nat', level: 2, exams: ['jam'], sub: 'Maxwell relations', unit: 'J K$^{-1}$ m$^{-3}$',
      q: 'Two moles of an ideal gas occupy $0.05$ m$^3$. Using a Maxwell relation, $(\\partial S/\\partial V)_T$ is ______ J K$^{-1}$ m$^{-3}$.',
      answer: 332.6, tol: 2, calc: () => 2 * R / 0.05,
      sol: '$(\\partial S/\\partial V)_T = (\\partial P/\\partial T)_V = nR/V = 2\\times8.314/0.05 \\approx 332.6$ J K$^{-1}$ m$^{-3}$. Integrating gives the familiar $\\Delta S = nR\\ln(V_2/V_1)$ at constant $T$.' },
    { id: 'tpot-010', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'potentials',
      q: 'The Gibbs–Helmholtz equation gives the enthalpy from $G(T, P)$ as',
      options: ['$H = -T^2\\left(\\frac{\\partial G}{\\partial T}\\right)_P$', '$H = G - T\\left(\\frac{\\partial G}{\\partial T}\\right)_P$', '$H = G + T\\left(\\frac{\\partial G}{\\partial T}\\right)_P$', '$H = G - P\\left(\\frac{\\partial G}{\\partial P}\\right)_T$'], answer: 1,
      sol: '$S = -(\\partial G/\\partial T)_P$ and $H = G + TS$, so $H = G - T(\\partial G/\\partial T)_P$. Equivalently $H = -T^2\\,\\partial(G/T)/\\partial T$ at constant $P$.',
      trap: 'Option A drops the $G/T$ inside the derivative.' },
    { id: 'tpot-011', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'ideal gas', format: 'multi',
      q: 'For an ideal gas, which of these are zero?',
      options: ['$(\\partial U/\\partial V)_T$', '$(\\partial H/\\partial P)_T$', 'The Joule–Thomson coefficient $(\\partial T/\\partial P)_H$', '$(\\partial S/\\partial V)_T$'], answer: [0, 1, 2],
      sol: 'For an ideal gas $U$ and $H$ depend only on $T$, so A and B vanish, and a throttled ideal gas keeps $T$ (C). D is $nR/V$, not zero: entropy grows with volume.' },
    { id: 'tpot-012', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'equilibrium',
      q: 'In a process at constant temperature and pressure, the maximum useful work (other than $P\\,dV$ work, e.g. electrical work from a battery) a system can deliver is',
      options: ['$-\\Delta H$', '$-\\Delta U$', '$-\\Delta G$', '$-\\Delta F$'], answer: 2,
      sol: 'With $T$ and $P$ fixed, $dG = dU + P\\,dV - T\\,dS$ and $T\\,dS \\ge dQ$. So $-dG \\ge dW_{\\rm other}$, with equality for a reversible process. ($-\\Delta F$ is the maximum total work at constant $T$.)' },
    { id: 'tpot-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'ideal gas',
      q: 'When $n$ moles of an ideal gas are compressed isothermally from pressure $P_1$ to $P_2$, the change in Gibbs energy is',
      options: ['$nRT\\ln(P_2/P_1)$', '$nRT\\ln(P_1/P_2)$', '$0$, because $T$ is constant', '$nR\\ln(P_2/P_1)$'], answer: 0,
      sol: '$(\\partial G/\\partial P)_T = V = nRT/P$, so $\\Delta G = \\int nRT\\,dP/P = nRT\\ln(P_2/P_1)$, positive for a compression.',
      trap: 'For an ideal gas $\\Delta U = \\Delta H = 0$ at constant $T$, but $\\Delta G = -T\\Delta S \\ne 0$.' },
    { id: 'tpot-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'potentials',
      q: '$(\\partial F/\\partial V)_T$ equals',
      options: ['$P$', '$-S$', '$V$', '$-P$'], answer: 3,
      sol: 'From $dF = -S\\,dT - P\\,dV$. Pressure is minus the rate of change of free energy with volume at constant temperature.' },
    { id: 'tpot-016', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'chemical potential',
      q: 'For a system with a single kind of particle, the chemical potential $\\mu$ equals',
      options: ['the enthalpy per particle, $H/N$', 'the Gibbs energy per particle, $G/N$', 'the internal energy per particle, $U/N$', 'the Helmholtz energy per particle, $F/N$'], answer: 1,
      sol: '$G(T, P, N)$ is extensive in $N$ alone (its other variables are intensive), so $G = N\\,g(T, P)$, and $\\mu = (\\partial G/\\partial N)_{T,P} = g = G/N$. The same argument fails for $F(T, V, N)$, since $V$ is extensive too.' },
    { id: 'tpot-017', type: 'nat', level: 2, exams: ['jam'], sub: 'ideal gas', unit: 'kJ',
      q: 'One mole of an ideal gas is compressed isothermally at $300$ K from $1$ bar to $10$ bar. Its Gibbs energy rises by ______ kJ.',
      answer: 5.74, tol: 0.03, calc: () => R * 300 * Math.log(10) / 1000,
      sol: '$\\Delta G = nRT\\ln(P_2/P_1) = 8.314\\times300\\times\\ln10 = 2494\\times2.303 \\approx 5743$ J $= 5.74$ kJ.',
      trap: 'Using $\\log_{10}$ gives 2.49 kJ.' },

    // ---- level 3 ----
    { id: 'tpot-013', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'heat capacities', unit: 'J mol$^{-1}$ K$^{-1}$',
      q: 'For a liquid at $300$ K, the molar volume is $1.8\\times10^{-5}$ m$^3$, the expansion coefficient $\\alpha = 2.1\\times10^{-4}$ K$^{-1}$ and the isothermal compressibility $\\kappa_T = 4.5\\times10^{-10}$ Pa$^{-1}$. Then $C_P - C_V$ is ______ J mol$^{-1}$ K$^{-1}$.',
      answer: 0.529, tol: 0.005, calc: () => 300 * 1.8e-5 * (2.1e-4) ** 2 / 4.5e-10,
      sol: '$C_P - C_V = TV\\alpha^2/\\kappa_T = 300\\times1.8\\times10^{-5}\\times(2.1\\times10^{-4})^2/4.5\\times10^{-10} = 300\\times1.8\\times10^{-5}\\times98 \\approx 0.529$ J mol$^{-1}$ K$^{-1}$. Tiny compared with $R$: for liquids and solids $C_P \\approx C_V$.',
      trap: 'Forgetting to square $\\alpha$.' },
    { id: 'tpot-018', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'energy equation', unit: 'kPa',
      q: 'For one mole of a van der Waals gas with $a = 0.14$ Pa m$^6$ mol$^{-2}$ at molar volume $1.0\\times10^{-3}$ m$^3$, the internal pressure $(\\partial U/\\partial V)_T$ is ______ kPa.',
      answer: 140, tol: 1, calc: () => 0.14 / 1e-6 / 1000,
      sol: 'Energy equation: $(\\partial U/\\partial V)_T = T(\\partial P/\\partial T)_V - P$. For $P = RT/(V - b) - a/V^2$: $T\\cdot R/(V-b) - P = a/V^2 = 0.14/10^{-6} = 1.4\\times10^5$ Pa $= 140$ kPa.' },
    { id: 'tpot-019', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Joule expansion',
      q: 'In a free (Joule) expansion into vacuum in an insulated container, a van der Waals gas',
      options: ['keeps its temperature, because $Q = W = 0$', 'cools only if it is below its inversion temperature', 'cools, because $(\\partial U/\\partial V)_T = a n^2/V^2 > 0$', 'warms, because the molecules gain kinetic energy'], answer: 2,
      sol: '$U$ stays constant. Pulling attracting molecules apart raises their potential energy, which must come from their kinetic energy: $(\\partial T/\\partial V)_U = -\\frac{1}{C_V}\\left(\\frac{\\partial U}{\\partial V}\\right)_T = -\\frac{an^2}{C_VV^2} < 0$.',
      trap: 'D describes the Joule–Thomson (throttling) process, which is different.' },
    { id: 'tpot-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Joule expansion', unit: 'K',
      q: 'One mole of a van der Waals gas ($a = 0.14$ Pa m$^6$ mol$^{-2}$, $C_V = \\tfrac52R$) expands freely from $1.0$ L to $2.0$ L in an insulated container. Its temperature changes by ______ K.',
      answer: -3.37, tol: 0.04, calc: () => -(0.14 / (2.5 * R)) * (1 / 1e-3 - 1 / 2e-3),
      sol: '$U = C_VT - a/V$ per mole stays fixed: $C_V\\Delta T = a(1/V_2 - 1/V_1)$. So $\\Delta T = \\frac{0.14}{20.79}(500 - 1000) \\approx -3.37$ K.' },
    { id: 'tpot-021', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Joule-Thomson',
      q: 'In a steady throttling (Joule–Thomson) process through a porous plug, the quantity that stays the same is',
      options: ['the enthalpy', 'the internal energy', 'the entropy', 'the temperature'], answer: 0,
      sol: 'For a parcel pushed through: $U_2 - U_1 = P_1V_1 - P_2V_2$ (the work done by the gas behind minus the work done on the gas ahead; $Q = 0$). So $U_1 + P_1V_1 = U_2 + P_2V_2$: $H$ is constant. Entropy rises, as throttling is irreversible.' },
    { id: 'tpot-022', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Joule-Thomson', unit: 'K',
      q: 'For a van der Waals gas with $a = 0.14$ Pa m$^6$ mol$^{-2}$ and $b = 3.2\\times10^{-5}$ m$^3$ mol$^{-1}$, the Joule–Thomson inversion temperature at low pressure is ______ K.',
      answer: 1052, tol: 10, calc: () => 2 * 0.14 / (R * 3.2e-5),
      sol: 'At low density $\\mu_{JT} \\approx \\frac{1}{C_P}\\left(\\frac{2a}{RT} - b\\right)$, which changes sign at $T_i = 2a/Rb = 0.28/(8.314\\times3.2\\times10^{-5}) \\approx 1052$ K. Below $T_i$ the gas cools on throttling.' },
    { id: 'tpot-023', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'Joule-Thomson', format: 'multi',
      q: 'Which statements about the Joule–Thomson coefficient $\\mu_{JT} = (\\partial T/\\partial P)_H$ are correct?',
      options: ['$\\mu_{JT} = \\frac{V}{C_P}(T\\alpha - 1)$, with $\\alpha$ the expansion coefficient', '$\\mu_{JT} = 0$ for an ideal gas', 'If $\\mu_{JT} > 0$, the gas cools as it passes through the throttle', 'Every gas cools in a Joule–Thomson expansion'], answer: [0, 1, 2],
      sol: 'A: from $dH = C_P\\,dT + [V - T(\\partial V/\\partial T)_P]dP = 0$. B: $\\alpha = 1/T$ for an ideal gas. C: the pressure drops ($dP < 0$), so $dT = \\mu\\,dP < 0$. D: false; above the inversion temperature (e.g. hydrogen and helium at room temperature) the gas warms.' },
    { id: 'tpot-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'heat capacities',
      q: 'The ratio of the adiabatic compressibility $\\kappa_S$ to the isothermal compressibility $\\kappa_T$ of any substance is',
      options: ['$C_P/C_V$', '$1$', '$\\gamma - 1$', '$C_V/C_P$'], answer: 3,
      sol: 'A general result (Reech): $\\kappa_T/\\kappa_S = C_P/C_V = \\gamma$. A substance is harder to compress when no heat can leave, so $\\kappa_S < \\kappa_T$. For an ideal gas: $\\kappa_T = 1/P$ and $\\kappa_S = 1/(\\gamma P)$.' },
    { id: 'tpot-026', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Maxwell relations',
      q: 'The Maxwell relation from the internal energy $U(S, V)$ is',
      options: ['$\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V$', '$\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V$', '$\\left(\\frac{\\partial T}{\\partial V}\\right)_S = \\left(\\frac{\\partial P}{\\partial S}\\right)_V$', '$\\left(\\frac{\\partial T}{\\partial P}\\right)_S = -\\left(\\frac{\\partial V}{\\partial S}\\right)_P$'], answer: 1,
      sol: '$(\\partial U/\\partial S)_V = T$ and $(\\partial U/\\partial V)_S = -P$. Equal mixed derivatives give $(\\partial T/\\partial V)_S = -(\\partial P/\\partial S)_V$.' },
    { id: 'tpot-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Legendre transforms',
      q: 'The enthalpy is the Legendre transform of $U(S, V)$ that replaces',
      options: ['$V$ by $P$, giving $H = U - PV$', 'both $S$ and $V$, giving $H = U - TS + PV$', '$V$ by $P$, giving $H = U + PV$', '$S$ by $T$, giving $H = U - TS$'], answer: 2,
      sol: 'The Legendre transform swapping $V$ for its conjugate slope $\\partial U/\\partial V = -P$ is $U - V(\\partial U/\\partial V) = U + PV = H$. Replacing $S$ by $T$ gives $F = U - TS$; replacing both gives $G$.' },
    { id: 'tpot-029', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'equilibrium', format: 'multi',
      q: 'Which of these must hold for a thermodynamically stable homogeneous substance?',
      options: ['$C_V > 0$', '$\\kappa_T > 0$', '$C_P \\ge C_V$', 'Expansion coefficient $\\alpha > 0$'], answer: [0, 1, 2],
      sol: 'Stability (entropy a maximum, or $F$ and $G$ minima) requires $C_V > 0$ and $\\kappa_T > 0$. Then $C_P - C_V = TV\\alpha^2/\\kappa_T \\ge 0$. But $\\alpha$ can be negative: water contracts on heating between $0$ and $4\\,^\\circ$C.' },
    { id: 'tpot-030', type: 'nat', level: 3, exams: ['jam'], sub: 'equilibrium', unit: 'K',
      q: 'A process at constant pressure has $\\Delta H = -50$ kJ and $\\Delta S = -100$ J/K, both roughly independent of temperature. It happens spontaneously only below ______ K.',
      answer: 500, tol: 0, calc: () => 50000 / 100,
      sol: 'Spontaneous at fixed $T, P$ means $\\Delta G = \\Delta H - T\\Delta S < 0$: $-50000 + 100T < 0$, so $T < 500$ K. The energy term favours it; the entropy term opposes it and wins at high temperature.' },
    { id: 'tpot-031', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'TdS equations',
      q: 'The isothermal pressure derivative of enthalpy, $(\\partial H/\\partial P)_T$, equals',
      options: ['$V - T\\left(\\frac{\\partial V}{\\partial T}\\right)_P$', '$V + T\\left(\\frac{\\partial V}{\\partial T}\\right)_P$', '$V$', '$T\\left(\\frac{\\partial V}{\\partial T}\\right)_P$'], answer: 0,
      sol: '$dH = T\\,dS + V\\,dP$, so $(\\partial H/\\partial P)_T = T(\\partial S/\\partial P)_T + V = V - T(\\partial V/\\partial T)_P$ using the Gibbs Maxwell relation. It vanishes for an ideal gas.' },

    // ---- level 4 ----
    { id: 'tpot-025', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'potentials',
      q: 'A system has the fundamental relation $U = A\\,S^3/(NV)$, with $A$ a positive constant. Its equation of state relates $P$, $V$ and $U$ as',
      options: ['$PV = U/3$', '$PV = 3U$', '$PV = \\tfrac23 U$', '$PV = U$'], answer: 3,
      sol: '$P = -(\\partial U/\\partial V)_{S,N} = A S^3/(NV^2) = U/V$. So $PV = U$. (Also $T = (\\partial U/\\partial S)_V = 3AS^2/(NV) = 3U/S$.)' },
    { id: 'tpot-027', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'TdS equations', unit: 'J',
      q: 'One mole of a solid at $300$ K (molar volume $7.1\\times10^{-6}$ m$^3$, $\\alpha = 5.0\\times10^{-5}$ K$^{-1}$, treat $V$ and $\\alpha$ as constant) is compressed reversibly and isothermally from $0$ to $1.0\\times10^8$ Pa. The heat <b>absorbed</b> by the solid is ______ J (negative if heat is given out).',
      answer: -10.65, tol: 0.1, calc: () => -300 * 7.1e-6 * 5e-5 * 1e8,
      sol: 'Second $T\\,dS$ equation: $T\\,dS = C_P\\,dT - TV\\alpha\\,dP$. At constant $T$: $Q = -TV\\alpha\\,\\Delta P = -300\\times7.1\\times10^{-6}\\times5\\times10^{-5}\\times10^8 = -10.65$ J. A solid that expands on heating gives out heat when squeezed.' },
    { id: 'tpot-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic systems', unit: 'K',
      q: 'An ideal paramagnetic salt (its entropy depends only on $B/T$) is cooled to $1.0$ K in a field of $2.0$ T. The field is then lowered slowly and adiabatically to $0.05$ T. Ignoring internal fields, the final temperature is ______ K.',
      answer: 0.025, tol: 0.0005, calc: () => 1.0 * 0.05 / 2.0,
      sol: 'Adiabatic and reversible means constant entropy, and $S = f(B/T)$, so $B/T$ stays fixed: $T_f = T_iB_f/B_i = 1.0\\times0.05/2.0 = 0.025$ K. This is adiabatic demagnetisation; in a real salt internal fields stop the cooling near the ordering temperature.' },
    { id: 'tpot-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'magnetic systems',
      q: 'A paramagnet obeys Curie\'s law $M = CB/T$ (with $dU = T\\,dS + B\\,dM$, so $dG = -S\\,dT - M\\,dB$ for $G = U - TS - BM$). When the field is increased slowly at constant temperature,',
      options: ['its temperature must rise', 'its entropy falls and it gives out heat', 'its entropy rises and it absorbs heat', 'its entropy does not change'], answer: 1,
      sol: 'Maxwell relation from $G(T, B)$: $(\\partial S/\\partial B)_T = (\\partial M/\\partial T)_B = -CB/T^2 < 0$. Aligning the spins orders them, so $S$ falls and heat $T\\,dS < 0$ flows out. This is the first step of magnetic cooling.' },
    { id: 'tpot-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'chemical potential', unit: 'meV',
      q: 'The chemical potential of an ideal gas at $300$ K is higher at $10$ atm than at $1$ atm by ______ meV per molecule.',
      answer: 59.5, tol: 0.6, calc: () => C.kB * 300 * Math.log(10) / C.e * 1000,
      sol: '$\\mu = \\mu_0(T) + kT\\ln(P/P_0)$, so $\\Delta\\mu = kT\\ln10 = 0.02585$ eV $\\times2.303 \\approx 0.0595$ eV $= 59.5$ meV.' },
    { id: 'tpot-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'TdS equations', format: 'multi',
      q: 'With $\\alpha$ the expansion coefficient and $\\kappa_T$, $\\kappa_S$ the isothermal and adiabatic compressibilities, which identities are correct?',
      options: ['$(\\partial P/\\partial T)_V = \\alpha/\\kappa_T$', '$(\\partial x/\\partial y)_z\\,(\\partial y/\\partial z)_x\\,(\\partial z/\\partial x)_y = -1$', '$C_P/C_V = \\kappa_T/\\kappa_S$', '$(\\partial S/\\partial T)_P = C_V/T$'], answer: [0, 1, 2],
      sol: 'A: by the cyclic rule (B), $(\\partial P/\\partial T)_V = -(\\partial V/\\partial T)_P/(\\partial V/\\partial P)_T = V\\alpha/(V\\kappa_T)$. C: Reech\'s relation. D: wrong, $(\\partial S/\\partial T)_P = C_P/T$.' },
    { id: 'tpot-036', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'TdS equations', unit: 'MPa',
      q: 'A liquid with $\\alpha = 1.8\\times10^{-4}$ K$^{-1}$ and $\\kappa_T = 4.0\\times10^{-11}$ Pa$^{-1}$ completely fills a rigid sealed vessel. If it is warmed by $2.0$ K, its pressure rises by ______ MPa.',
      answer: 9.0, tol: 0.1, calc: () => 1.8e-4 / 4e-11 * 2 / 1e6,
      sol: 'At constant volume $(\\partial P/\\partial T)_V = \\alpha/\\kappa_T = 4.5\\times10^6$ Pa/K. So $\\Delta P = 9.0\\times10^6$ Pa $= 9.0$ MPa, about 90 atmospheres for two degrees: why liquid-filled pipes burst.' },
    { id: 'tpot-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'The Gibbs–Duhem relation for a single-component system is',
      options: ['$T\\,dS - P\\,dV + \\mu\\,dN = 0$', '$-S\\,dT + V\\,dP + N\\,d\\mu = 0$', '$S\\,dT - V\\,dP + N\\,d\\mu = 0$', '$S\\,dT + V\\,dP + N\\,d\\mu = 0$'], answer: 2,
      sol: 'Euler: $G = \\mu N$, so $dG = \\mu\\,dN + N\\,d\\mu$. Comparing with $dG = -S\\,dT + V\\,dP + \\mu\\,dN$ gives $N\\,d\\mu = -S\\,dT + V\\,dP$, i.e. $S\\,dT - V\\,dP + N\\,d\\mu = 0$. So $T$, $P$ and $\\mu$ are not independent.',
      trap: 'Option A is $dU$ rearranged, which is not zero.' },

    // ---- level 5 ----
    { id: 'tpot-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'heat capacities', unit: 'J mol$^{-1}$ K$^{-1}$',
      q: 'For one mole of a van der Waals gas with $a = 0.14$ Pa m$^6$ mol$^{-2}$, $b = 3.2\\times10^{-5}$ m$^3$ mol$^{-1}$ at $T = 300$ K and $V = 1.0\\times10^{-3}$ m$^3$, $C_P - C_V$ is ______ J mol$^{-1}$ K$^{-1}$.',
      answer: 9.29, tol: 0.05, calc: () => R / (1 - 2 * 0.14 * (1e-3 - 3.2e-5) ** 2 / (R * 300 * 1e-9)),
      sol: '$C_P - C_V = -T\\frac{(\\partial P/\\partial T)_V^2}{(\\partial P/\\partial V)_T}$ with $(\\partial P/\\partial T)_V = \\frac{R}{V - b}$ and $(\\partial P/\\partial V)_T = -\\frac{RT}{(V-b)^2} + \\frac{2a}{V^3}$. This simplifies to $C_P - C_V = \\dfrac{R}{1 - 2a(V - b)^2/(RTV^3)}$. Here $2a(V-b)^2/(RTV^3) = 0.28\\times(9.68\\times10^{-4})^2/(2494\\times10^{-9}) = 0.105$, so $C_P - C_V = 8.314/0.895 \\approx 9.29$ J mol$^{-1}$ K$^{-1}$, above $R$ because attractions make the gas easier to expand.' },
    { id: 'tpot-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'potentials',
      q: 'The Helmholtz energy of black-body radiation in a cavity is $F(T, V) = -\\tfrac13 aVT^4$ ($a$ a constant). Which set follows?',
      options: ['$S = \\tfrac43 aVT^3$, $P = \\tfrac13 aT^4$, $U = aVT^4$', '$S = \\tfrac13 aVT^3$, $P = aT^4$, $U = \\tfrac13 aVT^4$', '$S = \\tfrac43 aVT^3$, $P = -\\tfrac13 aT^4$, $U = -\\tfrac13 aVT^4$', '$S = aVT^3$, $P = \\tfrac13 aT^4$, $U = \\tfrac43 aVT^4$'], answer: 0,
      sol: '$S = -(\\partial F/\\partial T)_V = \\tfrac43 aVT^3$; $P = -(\\partial F/\\partial V)_T = \\tfrac13 aT^4$; $U = F + TS = -\\tfrac13 aVT^4 + \\tfrac43 aVT^4 = aVT^4$. So $P = U/3V$, the radiation equation of state.' },
    { id: 'tpot-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Joule-Thomson', unit: 'K',
      q: 'A gas obeying the low-density van der Waals result $\\mu_{JT} \\approx (2a/RT - b)/C_P$, with $a = 0.137$ Pa m$^6$ mol$^{-2}$, $b = 3.87\\times10^{-5}$ m$^3$ mol$^{-1}$ and $C_P = 29.1$ J mol$^{-1}$ K$^{-1}$, is throttled at $300$ K from $60$ bar to $10$ bar. Treating $\\mu_{JT}$ as constant, the temperature change is ______ K (negative for cooling).',
      answer: -12.2, tol: 0.2, calc: () => ((2 * 0.137 / (R * 300) - 3.87e-5) / 29.1) * (-5e6),
      sol: '$2a/RT = 0.274/2494 = 1.098\\times10^{-4}$ m$^3$/mol. Minus $b$: $7.11\\times10^{-5}$. Divide by $C_P$: $\\mu_{JT} \\approx 2.45\\times10^{-6}$ K/Pa. $\\Delta P = -5.0\\times10^6$ Pa, so $\\Delta T \\approx -12.2$ K.',
      trap: 'The pressure falls, so $\\Delta P$ is negative; a positive $\\mu_{JT}$ then means cooling.' },
    { id: 'tpot-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'potentials', format: 'multi',
      q: 'A system has the fundamental relation $S(U, V, N) = c\\,(NVU)^{1/3}$ with $c > 0$. Which statements are correct?',
      options: ['$S$ is extensive (homogeneous of degree 1)', 'Its equation of state is $PV = U$', 'Its heat capacity $C_V$ grows as $T^{1/2}$', 'Its heat capacity $C_V$ falls as $T$ rises'], answer: [0, 1, 2],
      sol: 'A: scaling $U, V, N$ by $\\lambda$ scales $(NVU)^{1/3}$ by $\\lambda$. $1/T = \\partial S/\\partial U = S/(3U)$ and $P/T = \\partial S/\\partial V = S/(3V)$; dividing gives $P = U/V$ (B). From $1/T = \\tfrac{c}{3}(NV)^{1/3}U^{-2/3}$: $U = (cT/3)^{3/2}(NV)^{1/2}$, so $C_V = dU/dT \\propto T^{1/2}$ (C), which grows with $T$ (D false).' },
  ],
  gens: [
    { id: 'tpot-g01', type: 'nat', level: 2, exams: ['jam'], sub: 'ideal gas',
      make(r) {
        const n = pick(r, 0.5, 3, 0.5), T = int(r, 25, 60) * 10, P1 = choose(r, [1, 2, 5]), k = choose(r, [2, 3, 4, 5, 10]), down = r() < 0.4;
        const P2 = down ? P1 / k : P1 * k, dG = n * R * T * Math.log(P2 / P1);
        return { q: `${n} mol of an ideal gas at $${T}$ K goes isothermally from $${P1}$ bar to $${round(P2, 3)}$ bar. Its Gibbs energy changes by ______ J.`,
          answer: round(dG, 1), tol: Math.max(1, Math.abs(round(dG * 0.01, 1))), unit: 'J', n, T, P1, P2,
          sol: `$(\\partial G/\\partial P)_T = V = nRT/P$, so $\\Delta G = nRT\\ln(P_2/P_1) = ${n}\\times8.314\\times${T}\\times\\ln(${round(P2 / P1, 4)}) \\approx ${round(dG, 1)}$ J.`,
          trap: 'Constant $T$ does not mean $\\Delta G = 0$; for an ideal gas $\\Delta G = -T\\Delta S$ here.' };
      },
      verify: (p) => p.n * R * p.T * Math.log(p.P2 / p.P1) },
    { id: 'tpot-g02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'energy equation',
      make(r) {
        const a = pick(r, 0.05, 0.6, 0.01), n = int(r, 1, 3), V = pick(r, 0.5, 5, 0.5);
        const p = a * n * n / (V * 1e-3) ** 2 / 1000;
        return { q: `For ${n} mol of a van der Waals gas with $a = ${a}$ Pa m$^6$ mol$^{-2}$ in a volume of $${V}$ L, $(\\partial U/\\partial V)_T$ is ______ kPa.`,
          answer: round(p, 2), tol: Math.max(0.02, round(p * 0.01, 2)), unit: 'kPa', a, n, V,
          sol: `Energy equation: $(\\partial U/\\partial V)_T = T(\\partial P/\\partial T)_V - P = an^2/V^2 = ${a}\\times${n * n}/(${V}\\times10^{-3})^2 \\approx ${round(p, 2)}$ kPa.`,
          trap: 'Remember $n^2$ and convert litres to m$^3$ before squaring.' };
      },
      verify: (p) => p.a * p.n ** 2 / (p.V * 1e-3) ** 2 / 1000 },
    { id: 'tpot-g03', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Joule expansion',
      make(r) {
        const a = pick(r, 0.1, 0.5, 0.01), [kind, cv] = choose(r, [['monatomic', 1.5], ['diatomic', 2.5]]), V1 = pick(r, 0.5, 2, 0.5), k = choose(r, [2, 3, 4]);
        const dT = (a / (cv * R)) * (1 / (k * V1 * 1e-3) - 1 / (V1 * 1e-3));
        return { q: `One mole of a ${kind} van der Waals gas ($a = ${a}$ Pa m$^6$ mol$^{-2}$, $C_V = ${cv}R$) expands freely from $${V1}$ L to $${round(k * V1, 2)}$ L in an insulated container. The temperature change is ______ K.`,
          answer: round(dT, 3), tol: Math.max(0.01, Math.abs(round(dT * 0.01, 3))), unit: 'K', a, cv, V1, k,
          sol: `$U = C_VT - a/V$ is constant, so $\\Delta T = \\frac{a}{C_V}\\left(\\frac1{V_2} - \\frac1{V_1}\\right) = \\frac{${a}}{${round(cv * R, 3)}}\\left(\\frac{1}{${round(k * V1 * 1e-3, 6)}} - \\frac{1}{${round(V1 * 1e-3, 6)}}\\right) \\approx ${round(dT, 3)}$ K.`,
          trap: 'The answer must be negative: attractions make a free expansion cool the gas.' };
      },
      verify: (p) => (p.a / (p.cv * R)) * (1 / (p.k * p.V1 * 1e-3) - 1 / (p.V1 * 1e-3)) },
    { id: 'tpot-g04', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'Joule-Thomson',
      make(r) {
        const a = pick(r, 0.02, 0.6, 0.01), b = pick(r, 2, 5, 0.1);
        const Ti = 2 * a / (R * b * 1e-5);
        return { q: `The low-pressure Joule–Thomson inversion temperature of a van der Waals gas with $a = ${a}$ Pa m$^6$ mol$^{-2}$ and $b = ${b}\\times10^{-5}$ m$^3$ mol$^{-1}$ is ______ K.`,
          answer: round(Ti, 1), tol: round(Ti * 0.01, 1), unit: 'K', a, b,
          sol: `$\\mu_{JT} \\approx (2a/RT - b)/C_P$ changes sign at $T_i = 2a/Rb = ${round(2 * a, 3)}/(8.314\\times${b}\\times10^{-5}) \\approx ${round(Ti, 1)}$ K.${Ti < 300 ? ' This is below room temperature, so this gas warms when throttled at room temperature and must be pre-cooled first.' : ''}`,
          trap: '$2a/Rb$ is twice the Boyle temperature $a/Rb$.' };
      },
      verify: (p) => 2 * p.a / (R * p.b * 1e-5) },
    { id: 'tpot-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'heat capacities',
      make(r) {
        const T = int(r, 25, 40) * 10, V = pick(r, 5, 20, 0.5), al = pick(r, 0.2, 3, 0.1), kt = pick(r, 0.5, 8, 0.5);
        const d = T * V * 1e-6 * (al * 1e-4) ** 2 / (kt * 1e-10);
        return { q: `A substance at $${T}$ K has molar volume $${V}\\times10^{-6}$ m$^3$, expansion coefficient $${al}\\times10^{-4}$ K$^{-1}$ and isothermal compressibility $${kt}\\times10^{-10}$ Pa$^{-1}$. $C_P - C_V$ is ______ J mol$^{-1}$ K$^{-1}$.`,
          answer: round(d, 4), tol: Math.max(0.0005, round(d * 0.01, 4)), unit: 'J mol$^{-1}$ K$^{-1}$', T, V, al, kt,
          sol: `$C_P - C_V = TV\\alpha^2/\\kappa_T = ${T}\\times${V}\\times10^{-6}\\times(${al}\\times10^{-4})^2/(${kt}\\times10^{-10}) \\approx ${round(d, 4)}$ J mol$^{-1}$ K$^{-1}$.`,
          trap: '$\\alpha$ is squared, so $C_P \\ge C_V$ even when $\\alpha < 0$.' };
      },
      verify: (p) => p.T * p.V * 1e-6 * (p.al * 1e-4) ** 2 / (p.kt * 1e-10) },
    { id: 'tpot-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic systems',
      make(r) {
        const Ti = pick(r, 0.5, 4, 0.5), Bi = pick(r, 1, 8, 0.5), Bf = pick(r, 0.01, 0.2, 0.01);
        const Tf = Ti * Bf / Bi;
        return { q: `An ideal paramagnet (entropy a function of $B/T$ only) at $${Ti}$ K in a field of $${Bi}$ T is demagnetised slowly and adiabatically to $${Bf}$ T. The final temperature is ______ mK.`,
          answer: round(Tf * 1000, 2), tol: Math.max(0.05, round(Tf * 10, 2)), unit: 'mK', Ti, Bi, Bf,
          sol: `Constant $S$ means constant $B/T$: $T_f = ${Ti}\\times${Bf}/${Bi} \\approx ${round(Tf, 5)}$ K $= ${round(Tf * 1000, 2)}$ mK.`,
          trap: 'The answer is asked in millikelvin.' };
      },
      verify: (p) => p.Ti * p.Bf / p.Bi * 1000 },
    { id: 'tpot-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'TdS equations',
      make(r) {
        const al = pick(r, 0.5, 8, 0.5), kt = pick(r, 1, 10, 0.5), dT = int(r, 1, 5);
        const dP = (al * 1e-4) / (kt * 1e-10) * dT / 1e6;
        return { q: `A liquid ($\\alpha = ${al}\\times10^{-4}$ K$^{-1}$, $\\kappa_T = ${kt}\\times10^{-10}$ Pa$^{-1}$) fills a rigid sealed container and is warmed by $${dT}$ K. Its pressure rises by ______ MPa.`,
          answer: round(dP, 2), tol: Math.max(0.02, round(dP * 0.01, 2)), unit: 'MPa', al, kt, dT,
          sol: `$(\\partial P/\\partial T)_V = \\alpha/\\kappa_T = ${round(al * 1e6 / kt, 1)}$ Pa/K (cyclic rule). $\\Delta P = ${round(dP, 2)}$ MPa.`,
          trap: 'The cyclic rule brings in a minus sign, cancelled by the minus sign in the definition of $\\kappa_T$.' };
      },
      verify: (p) => (p.al * 1e-4) / (p.kt * 1e-10) * p.dT / 1e6 },
    { id: 'tpot-g08', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Maxwell relations',
      make(r) {
        const k = choose(r, ['U', 'H', 'F', 'G']);
        const [name, rel, d] = MAXWELL[k];
        const others = Object.keys(MAXWELL).filter((x) => x !== k).map((x) => MAXWELL[x][1]).concat(WRONG);
        const wrongs = [others[0], others[1], others[3 + Math.floor(r() * 3)]];
        const o = mcqOptions(r, rel, wrongs, (v) => v);
        return { q: `Starting from $${d}$ for the potential ${name}, which Maxwell relation follows?`, ...o,
          sol: `Equate the mixed second derivatives of ${k}: the coefficients in $${d}$ are its first derivatives, so ${rel}.`,
          trap: 'Get the sign from the signs of the two terms in the differential: one minus sign in it means a minus sign in the relation.' };
      } },
  ],
};
