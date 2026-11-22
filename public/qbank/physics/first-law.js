// The first law of thermodynamics: work and heat, PV diagrams, isothermal, adiabatic, isobaric, isochoric and
// polytropic processes, heat capacities, cycles, free expansion, irreversible processes.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
// Sign convention throughout: Q = heat given TO the system, W = work done BY the system, Q = ΔU + W.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const R = 8.314;

import * as Q5 from '../_util.js';
import more2 from './first-law.more2.gen.js';
import r4 from './first-law.r4.gen.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'first-law',
  items: [
    // ---- level 1 ----
    { id: 'fst-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'first law',
      q: 'Let $Q$ be the heat given to a gas and $W$ the work done <b>by</b> the gas. The first law of thermodynamics reads',
      options: ['$\\Delta U = Q + W$', '$W = Q + \\Delta U$', '$Q = \\Delta U + W$', '$Q = \\Delta U - W$'], answer: 2,
      sol: 'Energy is conserved: the heat put in either raises the internal energy or leaves as work done on the surroundings, $Q = \\Delta U + W$. (Chemists often use $W$ for the work done <i>on</i> the system, and then write $\\Delta U = Q + W$; same physics, different sign of $W$.)',
      trap: 'Option A is correct only in the other sign convention. Always check how the question defines $W$.' },
    { id: 'fst-002', type: 'nat', level: 1, exams: ['jam'], sub: 'isobaric', unit: 'J',
      q: 'Two moles of an ideal gas are heated at constant pressure from $300$ K to $350$ K. The work done by the gas is ______ J ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).',
      answer: 831.4, tol: 2, calc: () => 2 * R * 50,
      sol: 'At constant pressure $W = P\\Delta V = nR\\Delta T = 2\\times8.314\\times50 = 831.4$ J. The kind of gas does not matter for the work.' },
    { id: 'fst-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'work',
      q: 'In which process does a gas do no work on its surroundings?',
      options: ['Isochoric (constant volume)', 'Isobaric (constant pressure)', 'Isothermal (constant temperature)', 'Adiabatic (no heat exchange)'], answer: 0,
      sol: 'Work $= \\int P\\,dV$, which is zero when the volume does not change. All heat then goes into internal energy: $Q = \\Delta U$.' },
    { id: 'fst-004', type: 'msq', level: 1, exams: ['jam'], sub: 'state functions', format: 'multi',
      q: 'Which of the following are state functions (depend only on the state, not on how it was reached)?',
      options: ['Internal energy $U$', 'Heat $Q$ absorbed', 'Enthalpy $H$', 'Work $W$ done'], answer: [0, 2],
      sol: '$U$ and $H = U + PV$ are properties of the state. $Q$ and $W$ describe a process: between the same two states they differ from path to path, only their difference $Q - W = \\Delta U$ is fixed.',
      trap: 'Heat and work are energy in transit, not something a system "contains".' },
    { id: 'fst-005', type: 'nat', level: 1, exams: ['jam'], sub: 'heat capacities', unit: 'J',
      q: 'The heat needed to raise the temperature of 1 mol of an ideal monatomic gas by $10$ K at constant volume is ______ J.',
      answer: 124.7, tol: 1, calc: () => 1.5 * R * 10,
      sol: '$Q = nC_V\\Delta T = 1\\times\\tfrac32\\times8.314\\times10 \\approx 124.7$ J.' },
    { id: 'fst-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'free expansion',
      q: 'An ideal gas in an insulated container expands suddenly into an evacuated region (free expansion). Then',
      options: ['$Q = 0$, $W > 0$ and the gas cools', '$Q > 0$, $W = 0$ and the gas warms', '$Q = 0$, $W < 0$ and the gas warms', '$Q = 0$, $W = 0$, $\\Delta U = 0$ and the temperature does not change'], answer: 3,
      sol: 'No heat crosses the insulation ($Q = 0$) and nothing pushes back on the expanding gas ($W = 0$). So $\\Delta U = 0$, and for an ideal gas $U$ depends only on $T$: the temperature is unchanged.',
      trap: 'Expansion does not automatically mean cooling. Gas cools only if it does work (or, for real gases, against its own attractions).' },

    // ---- level 2 ----
    { id: 'fst-007', type: 'nat', level: 2, exams: ['jam'], sub: 'isothermal', unit: 'kJ',
      q: 'One mole of an ideal gas expands reversibly and isothermally at $300$ K from $10$ L to $30$ L. The work done by the gas is ______ kJ.',
      answer: 2.74, tol: 0.02, calc: () => R * 300 * Math.log(3) / 1000,
      sol: '$W = \\int P\\,dV = nRT\\int dV/V = nRT\\ln(V_2/V_1) = 8.314\\times300\\times\\ln3 = 2494\\times1.0986 \\approx 2740$ J $= 2.74$ kJ.',
      trap: 'Using $P\\Delta V$ with a fixed pressure: in an isothermal process the pressure changes all the time.' },
    { id: 'fst-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'adiabatic',
      q: 'A monatomic ideal gas is compressed reversibly and adiabatically to one eighth of its volume. Its absolute temperature becomes',
      options: ['$32$ times the original', '$4$ times the original', '$8$ times the original', '$2$ times the original'], answer: 1,
      sol: '$TV^{\\gamma-1}$ is constant, with $\\gamma - 1 = 2/3$. So $T_2/T_1 = 8^{2/3} = 4$.',
      trap: '$32 = 8^{5/3}$ is the pressure ratio, from $PV^{\\gamma}$ = constant.' },
    { id: 'fst-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'adiabatic',
      q: 'At a given point on a $P$–$V$ diagram of an ideal gas, the slope of the adiabat divided by the slope of the isotherm is',
      options: ['$\\gamma - 1$', '$1$', '$\\gamma$', '$1/\\gamma$'], answer: 2,
      sol: 'Isotherm: $PV = $ const gives $dP/dV = -P/V$. Adiabat: $PV^{\\gamma} = $ const gives $dP/dV = -\\gamma P/V$. The ratio is $\\gamma > 1$, so the adiabat is steeper.' },
    { id: 'fst-010', type: 'nat', level: 2, exams: ['jam'], sub: 'heat capacities', unit: 'J kg$^{-1}$ K$^{-1}$',
      q: 'For an ideal gas of molar mass $28$ g/mol, the difference of specific heats $c_p - c_v$ (per kilogram) is ______ J kg$^{-1}$ K$^{-1}$.',
      answer: 296.9, tol: 2, calc: () => R / 0.028,
      sol: 'Per mole, $C_P - C_V = R$ (Mayer\'s relation). Per kilogram divide by the molar mass: $8.314/0.028 \\approx 296.9$ J kg$^{-1}$ K$^{-1}$.',
      trap: 'Answering $8.314$: the question asks per kilogram, not per mole.' },
    { id: 'fst-011', type: 'msq', level: 2, exams: ['jam'], sub: 'cycles', format: 'multi',
      q: 'A gas is taken once round a closed cycle. Which statements are correct?',
      options: ['$\\Delta U = 0$ for the cycle', 'The net heat absorbed equals the net work done', 'No heat is exchanged over the cycle', 'The net work done by the gas equals the area enclosed on the $P$–$V$ diagram, positive if the cycle runs clockwise'], answer: [0, 1, 3],
      sol: '$U$ is a state function, so it returns to its starting value. Then $Q_{\\rm net} = W_{\\rm net}$, which equals the enclosed area (positive when the expansion happens at the higher pressure, i.e. clockwise with $P$ up and $V$ to the right). C is false: an engine absorbs net heat each cycle.' },
    { id: 'fst-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'adiabatic',
      q: 'The adiabatic bulk modulus of air ($\\gamma = 1.4$) at a pressure of $1.0\\times10^5$ Pa is',
      options: ['$1.4\\times10^5$ Pa', '$1.0\\times10^5$ Pa', '$0.71\\times10^5$ Pa', '$0.4\\times10^5$ Pa'], answer: 0,
      sol: '$B = -V\\,dP/dV$. For an adiabat $dP/dV = -\\gamma P/V$, so $B_S = \\gamma P = 1.4\\times10^5$ Pa. The isothermal modulus is $B_T = P$. (Newton used $P$ for the speed of sound and got it 15% too low; Laplace corrected it with $\\gamma P$.)' },
    { id: 'fst-013', type: 'nat', level: 2, exams: ['jam'], sub: 'isobaric',
      q: 'Heat is supplied to a rigid diatomic ideal gas at constant pressure. The fraction of the heat that is converted into work done by the gas is ______ (to two decimal places).',
      answer: 0.29, tol: 0.01, calc: () => 2 / 7,
      sol: '$W = nR\\Delta T$ and $Q = nC_P\\Delta T = \\tfrac72 nR\\Delta T$. So $W/Q = 2/7 \\approx 0.29$. The other $5/7$ raises the internal energy.' },
    { id: 'fst-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'heat capacities',
      q: 'For an ideal gas the change in internal energy between temperatures $T_1$ and $T_2$ is $\\Delta U = nC_V(T_2 - T_1)$. This holds',
      options: ['only for constant-volume processes', 'only for adiabatic processes', 'only for reversible processes', 'for any process between those temperatures'], answer: 3,
      sol: 'For an ideal gas $U$ depends only on $T$. $C_V$ is just a convenient way to measure $dU/dT$ (it was found at constant volume, where $Q = \\Delta U$), but the change in $U$ is the same along any path between the two temperatures.',
      trap: 'The "V" in $C_V$ tempts you to restrict the formula to isochoric processes.' },
    { id: 'fst-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'polytropic',
      q: 'One mole of an ideal gas at $300$ K expands along the path $PV^2 = $ constant until its volume doubles. Its final temperature is',
      options: ['$212$ K', '$150$ K', '$600$ K', '$75$ K'], answer: 1,
      sol: 'With $P = RT/V$: $PV^2 = RTV$ is constant, so $TV$ is constant. Doubling $V$ halves $T$: $150$ K.' },
    { id: 'fst-017', type: 'mcq', level: 2, exams: ['jam'], sub: 'adiabatic',
      q: 'A gas is compressed adiabatically. With $W$ the work done <b>by</b> the gas, which set is right?',
      options: ['$W < 0$, $\\Delta U = 0$, temperature unchanged', '$W = 0$, $\\Delta U > 0$, temperature rises', '$W < 0$, $\\Delta U > 0$, temperature rises', '$W > 0$, $\\Delta U < 0$, temperature falls'], answer: 2,
      sol: 'In compression the surroundings push on the gas, so the gas does negative work. With $Q = 0$, $\\Delta U = -W > 0$, and the temperature rises (a bicycle pump gets warm).' },

    // ---- level 3 ----
    { id: 'fst-015', type: 'nat', level: 3, exams: ['jam'], sub: 'first law', unit: 'J',
      q: '1 g of water at $100\\,^\\circ$C and $1.013\\times10^5$ Pa turns into steam. The latent heat is $2256$ J/g and the volume grows by $1.670\\times10^{-3}$ m$^3$. The increase in internal energy is ______ J.',
      answer: 2086.8, tol: 3, calc: () => 2256 - 1.013e5 * 1.670e-3,
      sol: 'The steam pushes back the atmosphere: $W = P\\Delta V = 1.013\\times10^5\\times1.670\\times10^{-3} = 169.2$ J. $\\Delta U = Q - W = 2256 - 169.2 \\approx 2086.8$ J.',
      trap: 'Taking $\\Delta U = 2256$ J forgets that about 7.5% of the latent heat is spent pushing the air away.' },
    { id: 'fst-018', type: 'nat', level: 3, exams: ['jam'], sub: 'adiabatic', unit: 'J',
      q: 'Two moles of a rigid diatomic ideal gas expand adiabatically and cool from $400$ K to $300$ K. The work done by the gas is ______ J.',
      answer: 4157, tol: 20, calc: () => 2 * 2.5 * R * 100,
      sol: '$Q = 0$, so $W = -\\Delta U = nC_V(T_1 - T_2) = 2\\times\\tfrac52\\times8.314\\times100 = 4157$ J. This holds even for an irreversible adiabatic expansion, since only the end temperatures enter.' },
    { id: 'fst-019', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'polytropic',
      q: 'A rigid diatomic ideal gas follows the polytropic process $PV^{1.2} = $ constant. Its molar heat capacity for this process, in units of $R$, is ______.',
      answer: -2.5, tol: 0.01, calc: () => 2.5 - 1 / (1.2 - 1),
      sol: 'For $PV^n = $ const, $W = R\\Delta T/(1 - n)$ per mole, so $C = C_V + \\frac{R}{1 - n} = C_V - \\frac{R}{n - 1}$. With $C_V = \\tfrac52 R$ and $n = 1.2$: $C = 2.5R - 5R = -2.5R$. Negative: the gas does more work than the heat it takes in, so it cools while absorbing heat.',
      trap: 'Dropping the minus sign. A negative heat capacity is not an error here; it happens for every $1 < n < \\gamma$.' },
    { id: 'fst-020', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'polytropic',
      q: 'For an ideal gas following $PV^n = $ constant, the molar heat capacity of the process is negative when',
      options: ['$1 < n < \\gamma$', '$n > \\gamma$', '$0 < n < 1$', '$n < 0$'], answer: 0,
      sol: '$C = R\\left(\\frac{1}{\\gamma - 1} - \\frac{1}{n - 1}\\right) = \\frac{R(n - \\gamma)}{(\\gamma - 1)(n - 1)}$. The numerator is negative for $n < \\gamma$ and the denominator positive for $n > 1$. So $C < 0$ for $1 < n < \\gamma$, between the isotherm and the adiabat.' },
    { id: 'fst-021', type: 'nat', level: 3, exams: ['jam'], sub: 'cycles', unit: 'J',
      q: 'A gas is taken round a rectangle on a $P$–$V$ diagram with corners at $P = 1\\times10^5$ and $3\\times10^5$ Pa, $V = 1$ L and $4$ L. The cycle runs <b>anticlockwise</b> ($P$ up, $V$ to the right). The net work done by the gas per cycle is ______ J.',
      answer: -600, tol: 0, calc: () => -(2e5 * 3e-3),
      sol: 'Area $= \\Delta P\\,\\Delta V = (2\\times10^5)(3\\times10^{-3}) = 600$ J. Anticlockwise means the gas expands along the low-pressure side and is compressed along the high-pressure side, so the net work by the gas is $-600$ J (it works as a refrigerator, not an engine).',
      trap: 'Giving $+600$: the direction of the cycle sets the sign.' },
    { id: 'fst-022', type: 'msq', level: 3, exams: ['jam'], sub: 'state functions', format: 'multi',
      q: 'An ideal gas goes from state A to state B along two different paths. Which quantities must be the same for both paths?',
      options: ['$\\Delta U$', '$Q$', '$W$', '$Q - W$'], answer: [0, 3],
      sol: '$\\Delta U$ is a change of a state function, and $Q - W = \\Delta U$. Heat and work separately depend on the path (the areas under the two curves differ).' },
    { id: 'fst-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'work',
      q: 'An ideal gas doubles its volume from the same initial state by (i) an isobaric, (ii) an isothermal and (iii) an adiabatic reversible process. The work done by the gas satisfies',
      options: ['$W_{\\rm adiabatic} > W_{\\rm isothermal} > W_{\\rm isobaric}$', '$W_{\\rm isothermal} > W_{\\rm isobaric} > W_{\\rm adiabatic}$', 'All three are equal', '$W_{\\rm isobaric} > W_{\\rm isothermal} > W_{\\rm adiabatic}$'], answer: 3,
      sol: 'Work is the area under the curve. From the same point, the isobar stays level, the isotherm falls as $1/V$ and the adiabat falls fastest, as $V^{-\\gamma}$. So the areas are in the order isobaric > isothermal > adiabatic.' },
    { id: 'fst-024', type: 'nat', level: 3, exams: ['jam'], sub: 'adiabatic', unit: 'K',
      q: 'Air ($\\gamma = 1.4$) at $300$ K is compressed reversibly and adiabatically to one tenth of its volume, as in a diesel engine. The final temperature is ______ K.',
      answer: 753.6, tol: 4, calc: () => 300 * 10 ** 0.4,
      sol: '$T_2 = T_1(V_1/V_2)^{\\gamma-1} = 300\\times10^{0.4} = 300\\times2.512 \\approx 754$ K, hot enough to ignite diesel fuel without a spark.' },
    { id: 'fst-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'adiabatic',
      q: 'Two identical samples of an ideal gas at pressure $P_0$ are compressed to half their volume, one isothermally and one adiabatically (both reversible). The ratio $P_{\\rm adiabatic}/P_{\\rm isothermal}$ of the final pressures is',
      options: ['$2^{1-\\gamma}$', '$2^{\\gamma - 1}$', '$2^{\\gamma}$', '$\\gamma$'], answer: 1,
      sol: 'Isothermal: $P = 2P_0$. Adiabatic: $P = 2^{\\gamma}P_0$. Ratio $2^{\\gamma-1} > 1$: the adiabatic sample is hotter, so its pressure is higher.' },
    { id: 'fst-027', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'heat capacities',
      q: 'An ideal gas ($PV = nRT$) has internal energy $U = 3PV$. Its ratio $\\gamma = C_P/C_V$ is',
      options: ['$7/5$', '$3/2$', '$4/3$', '$5/3$'], answer: 2,
      sol: '$U = 3nRT$, so $C_V = 3R$ per mole and $C_P = C_V + R = 4R$. $\\gamma = 4/3$, the value for a non-linear polyatomic rigid molecule (6 quadratic terms).' },
    { id: 'fst-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'adiabatic', format: 'multi',
      q: 'Which statements about adiabatic processes of an ideal gas are correct?',
      options: ['No heat is exchanged', 'The temperature stays constant', 'A reversible (quasi-static) adiabatic process obeys $PV^{\\gamma} = $ constant', 'Every adiabatic process, including a free expansion, obeys $PV^{\\gamma} = $ constant'], answer: [0, 2],
      sol: 'Adiabatic means $Q = 0$. $PV^{\\gamma} = $ const follows from $dU = -P\\,dV$, which needs the gas to be in equilibrium at every step. A free expansion is adiabatic but keeps $T$ (and so $PV$) constant, not $PV^{\\gamma}$.',
      trap: 'Using $PV^{\\gamma}$ for a sudden or free expansion.' },
    { id: 'fst-029', type: 'nat', level: 3, exams: ['jam'], sub: 'isothermal', unit: 'J',
      q: 'Half a mole of an ideal gas expands reversibly at $350$ K while its pressure falls from $3$ atm to $1$ atm. The heat absorbed is ______ J.',
      answer: 1598, tol: 8, calc: () => 0.5 * R * 350 * Math.log(3),
      sol: 'Isothermal: $\\Delta U = 0$, so $Q = W = nRT\\ln(V_2/V_1) = nRT\\ln(P_1/P_2) = 0.5\\times8.314\\times350\\times\\ln3 \\approx 1598$ J. The pressures need not be in pascals: only their ratio enters.' },
    { id: 'fst-030', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'heat capacities',
      q: 'In a reversible adiabatic process of an ideal gas the change of enthalpy $\\Delta H$ equals',
      options: ['$\\gamma\\,\\Delta U$', '$\\Delta U$', '$0$', '$W$ (the work done by the gas)'], answer: 0,
      sol: 'For an ideal gas $H = U + nRT$ depends only on $T$: $\\Delta H = nC_P\\Delta T$ and $\\Delta U = nC_V\\Delta T$ for any process. So $\\Delta H = \\gamma\\Delta U$ (and $= -\\gamma W$ here, since $\\Delta U = -W$).',
      trap: 'Thinking $\\Delta H = 0$ because $Q = 0$. Enthalpy change equals heat only at constant pressure.' },

    // ---- level 4 ----
    { id: 'fst-026', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'isothermal', unit: 'J',
      q: 'One mole of a van der Waals gas ($a = 0.14$ Pa m$^6$ mol$^{-2}$, $b = 3.2\\times10^{-5}$ m$^3$ mol$^{-1}$) expands reversibly and isothermally at $300$ K from $1.0$ L to $2.0$ L. The work done by the gas is ______ J.',
      answer: 1699.7, tol: 9, calc: () => R * 300 * Math.log((2e-3 - 3.2e-5) / (1e-3 - 3.2e-5)) + 0.14 * (1 / 2e-3 - 1 / 1e-3),
      sol: '$P = \\frac{RT}{V - b} - \\frac{a}{V^2}$, so $W = RT\\ln\\frac{V_2 - b}{V_1 - b} + a\\left(\\frac1{V_2} - \\frac1{V_1}\\right) = 2494.2\\ln\\frac{1.968}{0.968} + 0.14(500 - 1000) = 1769.7 - 70 \\approx 1700$ J.',
      trap: 'The attraction term reduces the work: the gas pulls back on itself as it expands.' },
    { id: 'fst-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'polytropic',
      q: 'One mole of an ideal monatomic gas starts at $(P_0, V_0, T_0)$ and expands along a straight line through the origin of the $P$–$V$ diagram ($P \\propto V$) until $V = 2V_0$. The heat absorbed, in units of $RT_0$, is ______.',
      answer: 6, tol: 0, calc: () => 1.5 * 3 + 1.5,
      sol: '$P = (P_0/V_0)V$. Work $= \\int_{V_0}^{2V_0}(P_0/V_0)V\\,dV = \\tfrac32 P_0V_0 = 1.5RT_0$. Since $PV \\propto V^2$, $T$ rises from $T_0$ to $4T_0$, so $\\Delta U = \\tfrac32R(3T_0) = 4.5RT_0$. $Q = 4.5 + 1.5 = 6RT_0$.',
      trap: 'Forgetting that the temperature quadruples, not doubles, when both $P$ and $V$ double.' },
    { id: 'fst-032', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'polytropic',
      q: 'The molar heat capacity of a rigid diatomic ideal gas in the process $P \\propto V$ is',
      options: ['$2R$', '$\\tfrac72 R$', '$\\tfrac52 R$', '$3R$'], answer: 3,
      sol: '$P \\propto V$ is the polytropic process $PV^{-1} = $ const, so $n = -1$ and $C = C_V - \\frac{R}{n - 1} = \\tfrac52R + \\tfrac12R = 3R$.' },
    { id: 'fst-033', type: 'nat', level: 4, exams: ['jam'], sub: 'cycles', unit: '%',
      q: 'One mole of a monatomic ideal gas goes round the cycle $(P_0, V_0) \\to (2P_0, V_0) \\to (2P_0, 2V_0) \\to (P_0, 2V_0) \\to (P_0, V_0)$ with straight-line steps. The efficiency (net work / heat absorbed) is ______ %.',
      answer: 15.4, tol: 0.2, calc: () => 100 / 6.5,
      sol: 'Net work = enclosed area $= P_0V_0$. Heat is absorbed only on the first two legs. Isochoric: $Q = \\tfrac32(2P_0V_0 - P_0V_0) = 1.5P_0V_0$. Isobaric at $2P_0$: $Q = \\tfrac52(4P_0V_0 - 2P_0V_0) = 5P_0V_0$. Total $6.5P_0V_0$, so $\\eta = 1/6.5 \\approx 15.4\\%$.',
      trap: 'Dividing by the net heat ($P_0V_0$) gives 100%. Efficiency uses only the heat taken in.' },
    { id: 'fst-034', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'state functions', format: 'multi',
      q: 'An ideal gas goes from state A to state B, and the temperatures happen to be equal: $T_B = T_A$. Which statements must be true?',
      options: ['$\\Delta U = 0$', 'The heat absorbed equals the work done by the gas', 'No heat was exchanged', 'The process was isothermal'], answer: [0, 1],
      sol: '$U$ depends only on $T$, so $\\Delta U = 0$ and $Q = W$. But the path may have gone through other temperatures (heated and then cooled), so nothing forces $Q = 0$ or an isothermal path.',
      trap: 'Equal end temperatures do not make a process isothermal.' },
    { id: 'fst-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'adiabatic',
      q: 'Dry air ($M = 29$ g/mol, $\\gamma = 1.4$) rising in the atmosphere expands adiabatically. With $g = 9.8$ m/s$^2$, the rate at which its temperature falls with height is about',
      options: ['$2.8$ K/km', '$9.8$ K/km', '$6.5$ K/km', '$34$ K/km'], answer: 1,
      sol: 'Hydrostatics: $dP/dz = -\\rho g = -PMg/RT$. Adiabat: $T \\propto P^{(\\gamma-1)/\\gamma}$, so $\\frac{dT}{T} = \\frac{\\gamma-1}{\\gamma}\\frac{dP}{P}$. Then $\\frac{dT}{dz} = -\\frac{\\gamma-1}{\\gamma}\\frac{Mg}{R} = -0.2857\\times\\frac{0.029\\times9.8}{8.314} \\approx -9.8$ K/km. (6.5 K/km is the observed average, lower because condensing water releases heat.)' },
    { id: 'fst-036', type: 'nat', level: 4, exams: ['jam'], sub: 'heat capacities', unit: 'K',
      q: 'An insulated box is divided by a partition. One side holds 1 mol of helium at $300$ K, the other 1 mol of nitrogen (rigid diatomic) at $500$ K. The partition is removed. The final temperature is ______ K.',
      answer: 425, tol: 0, calc: () => (1.5 * 300 + 2.5 * 500) / 4,
      sol: 'No heat in and no work out, so the total internal energy is conserved: $\\tfrac32R(300) + \\tfrac52R(500) = (\\tfrac32 + \\tfrac52)RT$. $T = (450 + 1250)/4 = 425$ K.',
      trap: 'The simple average $400$ K ignores that nitrogen stores more energy per kelvin.' },
    { id: 'fst-037', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'irreversible processes',
      q: 'Identical samples of an ideal gas in insulated cylinders are compressed to the same final volume, one quasi-statically and one suddenly by a large constant external pressure. The final temperature is',
      options: ['the same for both, as both are adiabatic', 'lower for the sudden compression, because there is no time for heating', 'higher for the sudden compression', 'higher for the quasi-static compression'], answer: 2,
      sol: 'In both cases $\\Delta U = -W = $ work done on the gas. In the sudden compression the external pressure is larger than the gas pressure at every stage, so more work is done on the gas for the same change of volume. More work, larger $\\Delta U$, higher temperature.' },

    // ---- level 5 ----
    { id: 'fst-038', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'irreversible processes', unit: 'K',
      q: 'One mole of a monatomic ideal gas at $300$ K and pressure $P_0$ is in an insulated cylinder. The external pressure is suddenly raised to $4P_0$ and held there; the gas is compressed until its pressure is $4P_0$. The final temperature is ______ K.',
      answer: 660, tol: 0, calc: () => 5.5 * 300 / 2.5,
      sol: 'Against constant external pressure, the work done on the gas is $4P_0(V_0 - V_f)$ with $V_0 = RT_0/P_0$ and $V_f = RT_f/4P_0$, i.e. $R(4T_0 - T_f)$. First law: $\\tfrac32R(T_f - T_0) = R(4T_0 - T_f)$, so $2.5T_f = 5.5T_0$ and $T_f = 2.2\\times300 = 660$ K. (A reversible compression to $4P_0$ gives only $300\\times4^{0.4} \\approx 522$ K.)',
      trap: 'Using $TP^{(1-\\gamma)/\\gamma} = $ constant, which holds only for reversible adiabats.' },
    { id: 'fst-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'irreversible processes',
      q: 'An insulated rigid tank, initially evacuated, is filled by opening a valve to a large supply line holding an ideal gas at temperature $T_0$. When the flow stops, the gas in the tank is at',
      options: ['$\\gamma T_0$', '$T_0$', '$T_0/\\gamma$', '$(\\gamma - 1)T_0$'], answer: 0,
      sol: 'Each parcel entering is pushed in by the gas behind it, which does work $P_0V_0$ on it. So the energy brought in per mole is the enthalpy $C_PT_0$, not $C_VT_0$. Final internal energy $nC_VT = nC_PT_0$ gives $T = \\gamma T_0$, hotter than the line.',
      trap: 'Expecting $T_0$ (no heat, "no work"). The flow work done by the supply line heats the tank.' },
    { id: 'fst-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'polytropic',
      q: 'A monatomic ideal gas expands along $PV^n = $ constant in such a way that the heat it absorbs is exactly half the work it does. The value of $n$ is ______ (to two decimal places).',
      answer: 1.33, tol: 0.01, calc: () => 4 / 3,
      sol: 'Per mole: $W = R(T_1 - T_2)/(n - 1) = -R\\Delta T/(n-1)$ and $\\Delta U = \\tfrac32R\\Delta T$. $Q = W/2$ means $\\Delta U = Q - W = -W/2$: $\\tfrac32R\\Delta T = \\frac{R\\Delta T}{2(n - 1)}$, so $n - 1 = 1/3$ and $n = 4/3$. Check: $1 < 4/3 < 5/3$, the negative-heat-capacity range, so the gas cools while absorbing heat, as it must.' },
    { id: 'fst-041', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'polytropic', format: 'multi',
      q: 'One mole of an ideal monatomic gas follows the process $V = aT^2$ ($a$ a positive constant). Which statements are correct?',
      options: ['The work done by the gas when its temperature rises by $\\Delta T$ is $2R\\Delta T$', 'The molar heat capacity for this process is $\\tfrac72 R$', 'The process is polytropic with $PV^{1/2} = $ constant', 'The gas cools as it expands'], answer: [0, 1, 2],
      sol: 'A: $P = RT/V = R/(aT)$ and $dV = 2aT\\,dT$, so $P\\,dV = 2R\\,dT$. B: $C = C_V + 2R = \\tfrac32R + 2R = \\tfrac72R$. C: $T \\propto V^{1/2}$ and $P = RT/V \\propto V^{-1/2}$, so $PV^{1/2}$ is constant ($n = \\tfrac12$; check: $C_V - R/(n - 1) = 1.5R + 2R$). D: $V$ grows with $T$, so expansion heats the gas.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'fst-t21', type: 'nat', level: 3, exams: ['jam'], sub: 'work', unit: 'J', format: 'graph',
      make(r) {
        const P1 = Q5.int(r, 1, 4) * 100, P2 = Q5.int(r, 1, 4) * 100 + 50, V1 = Q5.int(r, 1, 5), V2 = V1 + Q5.int(r, 1, 6);
        const W = (P1 + P2) * (V2 - V1) / 2, dU = 1.5 * (P2 * V2 - P1 * V1), Qh = dU + W;
        return { q: `A monatomic ideal gas is taken along a straight line on its $P$-$V$ diagram from $(${P1}$ kPa, $${V1}$ L$)$ to $(${P2}$ kPa, $${V2}$ L$)$. The heat absorbed by the gas is ______ J (to one decimal place; negative if it gives out heat).`,
          answer: Q5.round(Qh, 1), tol: 0.1, P1, P2, V1, V2,
          sol: `Work done by the gas = area under the line (a trapezium): $W = \\tfrac12(${P1} + ${P2})(${V2} - ${V1}) = ${W}$ J (kPa $\\times$ L $=$ J). $\\Delta U = \\tfrac32nR\\Delta T = \\tfrac32(P_2V_2 - P_1V_1) = \\tfrac32(${P2 * V2} - ${P1 * V1}) = ${dU}$ J. First law: $Q = \\Delta U + W = ${Q5.round(Qh, 1)}$ J.`,
          trap: 'kPa times litre is a joule; and $\\Delta U$ needs only the end states, $\\tfrac32\\Delta(PV)$.' };
      },
      verify: (p) => { const n = 100, P = (V) => p.P1 + (p.P2 - p.P1) * (V - p.V1) / (p.V2 - p.V1); let W = 0; const h = (p.V2 - p.V1) / n; for (let i = 0; i < n; i++) W += P(p.V1 + (i + 0.5) * h) * h; const R = 8.314, T1 = p.P1 * p.V1 / R, T2 = p.P2 * p.V2 / R; return 1.5 * R * (T2 - T1) + W; } },
    { id: 'fst-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'first law', format: 'statements',
      make(r) {
        const [proc, dU, W, Qh] = Q5.choose(r, [['reversible isothermal expansion', 0, 1, 1], ['reversible adiabatic expansion', -1, 1, 0], ['heating at constant volume', 1, 0, 1], ['expansion at constant pressure', 1, 1, 1], ['free expansion into a vacuum, in an insulated box', 0, 0, 0], ['reversible isothermal compression', 0, -1, -1]]);
        const S = [['The internal energy of the gas does not change.', dU === 0], ['The gas does positive work on its surroundings.', W > 0], ['Heat flows into the gas.', Qh > 0],
          ['The temperature of the gas rises.', dU > 0], ['No heat crosses the boundary.', Qh === 0], ['No work is done by or on the gas.', W === 0]];
        const o = q5msq(r, S.filter((s) => s[1]).map((s) => s[0]), S.filter((s) => !s[1]).map((s) => s[0]));
        return { q: `An ideal gas undergoes ${proc}. Which statements are correct?`, ...o,
          sol: `For an ideal gas $U$ depends only on $T$, and $Q = \\Delta U + W$ (with $W$ the work done by the gas). Here: $\\Delta U ${dU === 0 ? '= 0' : dU > 0 ? '> 0' : '< 0'}$, $W ${W === 0 ? '= 0' : W > 0 ? '> 0' : '< 0'}$, $Q ${Qh === 0 ? '= 0' : Qh > 0 ? '> 0' : '< 0'}$.${proc.startsWith('free') ? ' In a free expansion nothing pushes back, so $W = 0$; the box is insulated, so $Q = 0$; hence $\\Delta U = 0$ and $T$ is unchanged.' : ''}${proc.includes('adiabatic') ? ' No heat enters, so the work comes from internal energy and the gas cools.' : ''}`,
          trap: 'Free expansion: no work and no heat, yet the volume changes; isothermal: heat flows even though $T$ is fixed.' };
      } },
    { id: 'fst-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'polytropic', format: 'limiting case',
      make(r) {
        const names = ['isobaric (constant pressure)', 'isothermal', 'adiabatic', 'isochoric (constant volume)'];
        const [nn, c] = Q5.choose(r, [['n = 0', 0], ['n = 1', 1], ['n = 5/3', 2], ['n \\to \\infty', 3]]);
        const o = Q5.mcqOptions(r, names[c], names.filter((x, i) => i !== c));
        return { q: `A monatomic ideal gas follows $PV^n = $ constant. For $${nn}$ the process is`, ...o,
          sol: '$n = 0$: $P$ constant. $n = 1$: $PV$ constant, so $T$ constant. $n = \\gamma = 5/3$ (monatomic): the reversible adiabatic. $n \\to \\infty$: $P^{1/n}V = $ constant tends to $V = $ constant. The molar heat capacity $C = C_V + R/(1 - n)$ runs through $C_P$, $\\infty$, $0$ and $C_V$ in these four cases.',
          trap: 'The constant-volume process is the limit $n \\to \\infty$, not $n = 0$.' };
      } },
    { id: 'fst-t24', type: 'mcq', level: 3, exams: ['jam'], sub: 'work', format: 'comparison',
      make(r) {
        const rr = Q5.choose(r, [2, 3, 4]), exp = r() < 0.5;
        const right = exp ? 'isobaric > isothermal > adiabatic' : 'adiabatic > isothermal > isobaric';
        const o = Q5.mcqOptions(r, right, ['isobaric > isothermal > adiabatic', 'adiabatic > isothermal > isobaric', 'isothermal > isobaric > adiabatic', 'all three are equal'].filter((s) => s !== right));
        return { q: `An ideal gas starts from the same state each time and is ${exp ? `expanded reversibly to ${rr} times its volume` : `compressed reversibly to 1/${rr} of its volume`} by an isobaric, an isothermal or an adiabatic process. Ranked by the size of the work ${exp ? 'done by' : 'done on'} the gas:`, ...o,
          sol: exp ? 'Work is the area under the curve. From the same start, pressure stays highest on the isobar, falls as $1/V$ on the isotherm and falls faster ($1/V^\\gamma$) on the adiabat. So $W_{\\rm isobaric} > W_{\\rm isothermal} > W_{\\rm adiabatic}$.'
            : 'Going to smaller volume, pressure stays fixed on the isobar, rises as $1/V$ on the isotherm and rises fastest on the adiabat (the gas heats up). The area under each curve is the work done on the gas: $W_{\\rm adiabatic} > W_{\\rm isothermal} > W_{\\rm isobaric}$.',
          trap: 'The ranking reverses between expansion and compression; picture the three curves leaving the same point.' };
      } },
    { id: 'fst-t25', type: 'nat', level: 2, exams: ['jam'], sub: 'isobaric', unit: 'J',
      make(r) {
        const W = Q5.int(r, 10, 200) * 10, [name, f] = Q5.choose(r, [['monatomic', 3], ['diatomic (rigid)', 5], ['polyatomic (rigid, non-linear)', 6]]);
        const Qh = W * (f / 2 + 1);
        return { q: `A ${name} ideal gas is heated at constant pressure and does $${W}$ J of work as it expands. The heat supplied is ______ J.`,
          answer: Q5.round(Qh, 1), tol: 0.5, W, f,
          sol: `At constant pressure $W = P\\Delta V = nR\\Delta T$ and $Q = nC_P\\Delta T$ with $C_P = (${f}/2 + 1)R$. So $Q = W\\cdot C_P/R = ${W}\\times${f / 2 + 1} = ${Qh}$ J.`,
          trap: 'Only a fraction $R/C_P$ of the heat becomes work; the rest raises the internal energy.' };
      },
      verify: (p) => { const n = 2, dT = p.W / (n * 8.314); return n * (p.f / 2 + 1) * 8.314 * dT; } },
    { id: 'fst-g01', type: 'nat', level: 2, exams: ['jam'], sub: 'isothermal',
      make(r) {
        const n = pick(r, 0.5, 3, 0.5), T = int(r, 25, 80) * 10, k = choose(r, [2, 3, 4, 5, 10]), comp = r() < 0.4;
        const W = (comp ? -1 : 1) * n * R * T * Math.log(k);
        return { q: `${n} mol of an ideal gas is ${comp ? 'compressed' : 'expanded'} reversibly at a constant $${T}$ K to ${comp ? `one ${k === 2 ? 'half' : k === 10 ? 'tenth' : ['', '', '', 'third', 'quarter', 'fifth'][k]}` : `${k} times`} its volume. The work done <b>by</b> the gas is ______ J.`,
          answer: round(W, 1), tol: Math.max(1, Math.abs(round(W * 0.01, 1))), unit: 'J', n, T, k, comp,
          sol: `$W = nRT\\ln(V_2/V_1) = ${n}\\times8.314\\times${T}\\times\\ln(${comp ? `1/${k}` : k}) \\approx ${round(W, 1)}$ J.${comp ? ' Negative, because the surroundings do work on the gas.' : ''}`,
          trap: comp ? 'Work done by the gas in a compression is negative.' : 'Use the natural logarithm, not log base 10.' };
      },
      verify: (p) => (p.comp ? -1 : 1) * p.n * R * p.T * Math.log(p.k) },
    { id: 'fst-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'adiabatic',
      make(r) {
        const [kind, g] = choose(r, [['monatomic', 5 / 3], ['rigid diatomic', 7 / 5], ['non-linear polyatomic (rigid)', 4 / 3]]);
        const T1 = int(r, 25, 40) * 10, k = choose(r, [2, 3, 4, 8, 10]);
        const T2 = T1 * k ** (g - 1);
        return { q: `A ${kind} ideal gas at $${T1}$ K is compressed reversibly and adiabatically to $1/${k}$ of its volume. The final temperature is ______ K.`,
          answer: round(T2, 1), tol: round(T2 * 0.01, 1), unit: 'K', T1, k, g,
          sol: `$\\gamma = ${round(g, 4)}$, and $TV^{\\gamma - 1}$ is constant: $T_2 = ${T1}\\times${k}^{${round(g - 1, 4)}} \\approx ${round(T2, 1)}$ K.`,
          trap: 'The exponent is $\\gamma - 1$ for temperature and volume, $\\gamma$ for pressure and volume.' };
      },
      verify: (p) => p.T1 * p.k ** (p.g - 1) },
    { id: 'fst-g03', type: 'nat', level: 1, exams: ['jam'], sub: 'heat capacities',
      make(r) {
        const [kind, cv] = choose(r, [['monatomic', 1.5], ['rigid diatomic', 2.5]]);
        const atP = r() < 0.5, n = int(r, 1, 4), dT = int(r, 2, 20) * 5;
        const c = atP ? cv + 1 : cv, Q = n * c * R * dT;
        return { q: `The heat needed to warm ${n} mol of a ${kind} ideal gas by $${dT}$ K at constant ${atP ? 'pressure' : 'volume'} is ______ J.`,
          answer: round(Q, 1), tol: round(Q * 0.01, 1), unit: 'J', n, c, dT,
          sol: `$C_${atP ? 'P' : 'V'} = ${c}R$, so $Q = nC\\Delta T = ${n}\\times${c}\\times8.314\\times${dT} \\approx ${round(Q, 1)}$ J.`,
          trap: atP ? 'At constant pressure the gas also does work, so use $C_P = C_V + R$.' : 'At constant volume no work is done, so use $C_V$.' };
      },
      verify: (p) => p.n * p.c * R * p.dT },
    { id: 'fst-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'cycles',
      make(r) {
        const P1 = int(r, 1, 3), P2 = P1 + int(r, 1, 4), V1 = int(r, 1, 4), V2 = V1 + int(r, 1, 5), cw = r() < 0.5;
        const W = (cw ? 1 : -1) * (P2 - P1) * 1e5 * (V2 - V1) * 1e-3;
        return { q: `A gas goes round a rectangular cycle on a $P$–$V$ diagram between $P = ${P1}\\times10^5$ and $${P2}\\times10^5$ Pa and $V = ${V1}$ L and $${V2}$ L, ${cw ? 'clockwise' : 'anticlockwise'} ($P$ up, $V$ to the right). The net work done by the gas per cycle is ______ J.`,
          answer: round(W, 2), tol: 0.5, unit: 'J', P1, P2, V1, V2, cw,
          sol: `Area $= (${P2 - P1}\\times10^5)(${V2 - V1}\\times10^{-3}) = ${Math.abs(round(W, 2))}$ J. ${cw ? 'Clockwise: expansion at high pressure, so the gas does net positive work.' : 'Anticlockwise: expansion at low pressure, so the net work by the gas is negative.'}`,
          trap: '1 L = $10^{-3}$ m$^3$, and the direction sets the sign.' };
      },
      verify: (p) => (p.cw ? 1 : -1) * (p.P2 - p.P1) * 1e5 * (p.V2 - p.V1) * 1e-3 },
    { id: 'fst-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'polytropic',
      make(r) {
        const [kind, cv] = choose(r, [['monatomic', 1.5], ['rigid diatomic', 2.5]]);
        const n = choose(r, [-1, 0.5, 1.2, 1.25, 1.5, 2, 3]);
        const c = cv - 1 / (n - 1);
        return { q: `For a ${kind} ideal gas following $PV^{${n}} = $ constant, the molar heat capacity of the process in units of $R$ is ______ (to two decimal places).`,
          answer: round(c, 2), tol: 0.01, cv, n,
          sol: `$C = C_V - \\dfrac{R}{n - 1} = ${cv}R - \\dfrac{R}{${n} - 1} = ${round(c, 3)}R$.${c < 0 ? ' Negative: here $1 < n < \\gamma$, so the gas cools while taking in heat.' : ''}`,
          trap: 'Watch the sign of $n - 1$.' };
      },
      verify: (p) => p.cv - 1 / (p.n - 1) },
    { id: 'fst-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'adiabatic',
      make(r) {
        const [kind, cv] = choose(r, [['monatomic', 1.5], ['rigid diatomic', 2.5]]);
        const n = int(r, 1, 4), T1 = int(r, 40, 70) * 10, T2 = T1 - int(r, 5, 20) * 10;
        const W = n * cv * R * (T1 - T2);
        return { q: `${n} mol of a ${kind} ideal gas expands adiabatically and cools from $${T1}$ K to $${T2}$ K. The work done by the gas is ______ J.`,
          answer: round(W, 0), tol: Math.max(2, round(W * 0.01, 0)), unit: 'J', n, cv, T1, T2,
          sol: `$Q = 0$, so $W = -\\Delta U = nC_V(T_1 - T_2) = ${n}\\times${cv}\\times8.314\\times${T1 - T2} \\approx ${round(W, 0)}$ J.`,
          trap: 'No need for $PV^{\\gamma}$: the end temperatures fix the work in any adiabatic process.' };
      },
      verify: (p) => p.n * p.cv * R * (p.T1 - p.T2) },
    { id: 'fst-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'heat capacities',
      make(r) {
        const n1 = int(r, 1, 3), n2 = int(r, 1, 3), T1 = int(r, 25, 40) * 10, T2 = int(r, 45, 70) * 10;
        const T = (1.5 * n1 * T1 + 2.5 * n2 * T2) / (1.5 * n1 + 2.5 * n2);
        return { q: `In an insulated box, ${n1} mol of a monatomic gas at $${T1}$ K is separated from ${n2} mol of a rigid diatomic gas at $${T2}$ K. The partition is removed. The final temperature is ______ K.`,
          answer: round(T, 1), tol: 1, unit: 'K', n1, n2, T1, T2,
          sol: `Internal energy is conserved: $T = \\dfrac{${n1}(1.5)(${T1}) + ${n2}(2.5)(${T2})}{${n1}(1.5) + ${n2}(2.5)} \\approx ${round(T, 1)}$ K.`,
          trap: 'Weight by $nC_V$, not by moles alone.' };
      },
      verify: (p) => (1.5 * p.n1 * p.T1 + 2.5 * p.n2 * p.T2) / (1.5 * p.n1 + 2.5 * p.n2) },
    { id: 'fst-g08', type: 'mcq', level: 2, exams: ['jam'], sub: 'adiabatic',
      make(r) {
        const [kind, g, gs] = choose(r, [['monatomic', 5 / 3, '5/3'], ['rigid diatomic', 7 / 5, '7/5']]);
        const k = choose(r, [2, 4, 8, 16, 32]);
        const show = (v) => `$${round(v, 2)}$`;
        const o = mcqOptions(r, k ** g, [k ** (g - 1), k, k ** (1 / g)], show);
        return { q: `A ${kind} ideal gas is compressed reversibly and adiabatically to $1/${k}$ of its volume. Its pressure grows by a factor of`, ...o,
          sol: `$PV^{\\gamma}$ is constant with $\\gamma = ${gs}$, so $P_2/P_1 = ${k}^{${gs}} \\approx ${round(k ** g, 2)}$.`,
          trap: `$${k}^{\\gamma - 1}$ is the temperature ratio; $${k}$ would be an isothermal compression.` };
      } },
    ...r4.gens,
  ],
};
