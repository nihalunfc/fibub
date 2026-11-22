// The second law: Kelvin and Clausius statements, Carnot engines, refrigerators and heat pumps, Otto and Diesel cycles,
// Clausius inequality, entropy changes of gases, solids and reservoirs, mixing, maximum work, third law.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const R = 8.314;

export default {
  topic: 'second-law-entropy',
  items: [
    // ---- level 1 ----
    { id: 'snd-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'Carnot engine',
      q: 'The maximum possible efficiency of a heat engine working between reservoirs at $500$ K and $300$ K is',
      options: ['$67\\%$', '$25\\%$', '$40\\%$', '$60\\%$'], answer: 2,
      sol: 'Carnot: $\\eta = 1 - T_c/T_h = 1 - 300/500 = 0.40$.',
      trap: '$60\\%$ is $T_c/T_h$, the fraction of heat thrown away, not the efficiency.' },
    { id: 'snd-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'statements',
      q: 'Which statement is the Kelvin–Planck form of the second law?',
      options: ['No cyclic device can take heat from a single reservoir and turn it completely into work', 'Heat cannot flow from a hot body to a cold body', 'The energy of an isolated system is constant', 'Every reversible engine has 100% efficiency'], answer: 0,
      sol: 'Kelvin–Planck forbids a perfect engine: some heat must always be rejected to a colder body. (The Clausius statement forbids heat flowing by itself from cold to hot; B has the direction backwards. C is the first law.)' },
    { id: 'snd-003', type: 'nat', level: 1, exams: ['jam'], sub: 'entropy change', unit: 'J/K',
      q: '1 kg of ice melts at $0\\,^\\circ$C (latent heat $334$ kJ/kg). The entropy of the water increases by ______ J/K.',
      answer: 1222.8, tol: 6, calc: () => 334000 / 273.15,
      sol: 'Melting happens at constant temperature, so $\\Delta S = Q/T = 334000/273.15 \\approx 1223$ J/K.',
      trap: 'Dividing by $0$ (Celsius) is impossible, a reminder that $T$ must be absolute.' },
    { id: 'snd-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'refrigerators',
      q: 'The coefficient of performance (heat removed / work input) of a Carnot refrigerator working between $270$ K and $300$ K is',
      options: ['$10$', '$0.1$', '$1.11$', '$9$'], answer: 3,
      sol: 'For a reversible refrigerator $Q_c/W = T_c/(T_h - T_c) = 270/30 = 9$.',
      trap: '$10 = T_h/(T_h - T_c)$ is the COP of a heat pump, which counts the heat delivered to the hot side.' },
    { id: 'snd-005', type: 'msq', level: 1, exams: ['jam'], sub: 'entropy change', format: 'multi',
      q: 'For a reversible adiabatic process, which statements are true?',
      options: ['The entropy of the system does not change', 'The process is isentropic', 'No heat is exchanged', 'The temperature stays constant'], answer: [0, 1, 2],
      sol: '$dS = dQ_{\\rm rev}/T = 0$, so a reversible adiabat is an isentrope. The temperature usually changes (an ideal gas cools on adiabatic expansion).' },
    { id: 'snd-006', type: 'nat', level: 1, exams: ['jam'], sub: 'entropy change', unit: 'J/K',
      q: 'Two moles of an ideal gas expand isothermally to twice their volume. The entropy of the gas increases by ______ J/K.',
      answer: 11.53, tol: 0.06, calc: () => 2 * R * Math.log(2),
      sol: '$\\Delta S = nR\\ln(V_2/V_1) = 2\\times8.314\\times\\ln2 \\approx 11.53$ J/K. This is true whether the expansion is reversible or not, because $S$ is a state function.' },

    // ---- level 2 ----
    { id: 'snd-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'entropy change',
      q: 'One mole of an ideal gas undergoes free expansion into vacuum, doubling its volume, in an insulated container. The entropy change of the gas is',
      options: ['$R$', '$R\\ln2$', '$0$, because no heat was exchanged', '$-R\\ln2$'], answer: 1,
      sol: 'Entropy is a state function. Find a reversible path between the same states: an isothermal expansion (the temperature is the same at both ends). Along it $\\Delta S = R\\ln2$. The actual process is irreversible, so $\\Delta S > \\int dQ/T = 0$.',
      trap: '$\\Delta S = Q/T$ only for a reversible path. Here $Q = 0$ but $\\Delta S > 0$.' },
    { id: 'snd-008', type: 'nat', level: 2, exams: ['jam'], sub: 'refrigerators',
      q: 'A reversible heat pump keeps a house at $25\\,^\\circ$C while it is $5\\,^\\circ$C outside. Its coefficient of performance (heat delivered / work input) is ______ (to one decimal place).',
      answer: 14.9, tol: 0.1, calc: () => 298.15 / 20,
      sol: '$\\mathrm{COP}_{\\rm HP} = T_h/(T_h - T_c) = 298.15/20 \\approx 14.9$. Each joule of electricity moves almost 15 J of heat indoors, in the ideal limit.',
      trap: 'Using Celsius, $25/20 = 1.25$. Only the difference may be taken in Celsius.' },
    { id: 'snd-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'Carnot engine',
      q: 'An inventor claims an engine that takes $1000$ J per cycle from a reservoir at $400$ K, rejects heat to one at $300$ K and gives $300$ J of work per cycle. The claim',
      options: ['violates the first law', 'is possible only if the engine is reversible', 'violates the second law, because the maximum work is $250$ J', 'is possible, because $300$ J < $1000$ J'], answer: 2,
      sol: 'Carnot efficiency $= 1 - 300/400 = 25\\%$, so at most $250$ J of work. Energy is conserved ($700$ J rejected), so the first law is fine; the second law is broken.' },
    { id: 'snd-010', type: 'nat', level: 2, exams: ['jam'], sub: 'entropy change', unit: 'J/K',
      q: '1 kg of water ($c = 4186$ J kg$^{-1}$ K$^{-1}$) is heated from $20\\,^\\circ$C to $80\\,^\\circ$C. Its entropy increases by ______ J/K.',
      answer: 779.5, tol: 4, calc: () => 4186 * Math.log(353.15 / 293.15),
      sol: '$\\Delta S = \\int mc\\,dT/T = mc\\ln(T_2/T_1) = 4186\\ln(353.15/293.15) = 4186\\times0.1862 \\approx 780$ J/K.',
      trap: 'Using $Q/T$ with a single temperature: the temperature changes during heating, so integrate.' },
    { id: 'snd-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'cycles',
      q: 'The efficiency of an ideal air-standard Otto cycle with compression ratio $r = V_{\\max}/V_{\\min}$ is',
      options: ['$1 - r^{1-\\gamma}$', '$1 - r^{-\\gamma}$', '$1 - 1/r$', '$1 - r^{\\gamma - 1}$'], answer: 0,
      sol: 'Heat enters and leaves at constant volume, and the two adiabats link temperatures by $T\\propto V^{1-\\gamma}$. Then $\\eta = 1 - \\frac{T_{\\rm exhaust\\ start}}{T_{\\rm after\\ combustion}} = 1 - r^{1-\\gamma} = 1 - 1/r^{\\gamma-1}$.' },
    { id: 'snd-012', type: 'msq', level: 2, exams: ['jam'], sub: 'entropy of the universe', format: 'multi',
      q: 'Which statements are correct?',
      options: ['The entropy of an isolated system increases in any irreversible process inside it', 'The entropy of a system can decrease', 'In a reversible process the total entropy of system plus surroundings stays constant', 'The entropy of an isolated system can decrease if the process is slow enough'], answer: [0, 1, 2],
      sol: 'A and C are the second law. B: a system that gives out heat (a cooling cup of tea) loses entropy, while its surroundings gain more. D: slowness never makes $\\Delta S$ of an isolated system negative; at best (reversible) it is zero.' },
    { id: 'snd-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'cycles',
      q: 'On a temperature–entropy ($T$–$S$) diagram, a Carnot cycle is',
      options: ['a rectangle whose area is the heat absorbed', 'a pair of hyperbolas joined by vertical lines', 'a single straight line, because entropy is conserved', 'a rectangle whose area is the net work per cycle'], answer: 3,
      sol: 'Two isotherms (horizontal lines at $T_h$ and $T_c$) and two reversible adiabats (vertical lines, constant $S$). The area $\\oint T\\,dS = Q_h - Q_c = W$. The heat absorbed is the area under the top line, $T_h\\Delta S$.' },
    { id: 'snd-014', type: 'nat', level: 2, exams: ['jam'], sub: 'entropy of the universe', unit: 'J/K',
      q: '$1200$ J of heat flows directly from a reservoir at $600$ K to a reservoir at $300$ K. The entropy of the universe increases by ______ J/K.',
      answer: 2, tol: 0, calc: () => -1200 / 600 + 1200 / 300,
      sol: 'Hot reservoir: $-1200/600 = -2$ J/K. Cold reservoir: $+1200/300 = +4$ J/K. Total $+2$ J/K. Positive, as it must be for heat flowing down a temperature difference.' },
    { id: 'snd-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'third law',
      q: 'The third law of thermodynamics (Nernst–Planck form) states that',
      options: ['energy cannot be created or destroyed', 'the entropy of a perfect crystal tends to zero as $T \\to 0$', 'the entropy of any system is zero at $0\\,^\\circ$C', 'no engine can be more efficient than a Carnot engine'], answer: 1,
      sol: 'As $T\\to0$ a perfect crystal settles into its single ground state, $W = 1$, so $S = k\\ln W \\to 0$. C is a consequence of the second law, D is the first law.' },
    { id: 'snd-016', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Clausius inequality',
      q: 'For any cycle, with $dQ$ the heat taken in at a boundary where the temperature is $T$, the Clausius inequality says',
      options: ['$\\oint dQ = 0$ for every cycle', '$\\oint dQ/T = 0$ for every cycle', '$\\oint dQ/T \\le 0$, with equality for a reversible cycle', '$\\oint dQ/T \\ge 0$, with equality for a reversible cycle'], answer: 2,
      sol: 'An irreversible engine rejects more heat than a reversible one for the same heat taken in, which makes $\\sum Q/T$ negative. Only for reversible cycles is $\\oint dQ/T = 0$, which is what makes $S$ a state function.' },

    // ---- level 3 ----
    { id: 'snd-017', type: 'nat', level: 3, exams: ['jam'], sub: 'mixing', unit: 'J/K',
      q: 'One mole of helium and one mole of neon, both at the same temperature and pressure, are allowed to mix. The entropy of mixing is ______ J/K.',
      answer: 11.53, tol: 0.06, calc: () => 2 * R * Math.log(2),
      sol: 'Each gas expands into twice its volume: $\\Delta S = R\\ln2 + R\\ln2 = 2R\\ln2 \\approx 11.53$ J/K. In general $\\Delta S = -nR\\sum x_i\\ln x_i$ with mole fractions $x_i$.' },
    { id: 'snd-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'mixing',
      q: 'Two samples of the <b>same</b> gas at the same temperature and pressure are separated by a partition, which is removed. The entropy change is',
      options: ['$0$', '$2R\\ln2$ per two moles, as for different gases', 'negative', '$R\\ln2$ per two moles'], answer: 0,
      sol: 'Nothing measurable changes: put the partition back and you recover the original state. With identical (indistinguishable) particles the entropy is extensive and $\\Delta S = 0$. Getting $2R\\ln2$ here is the Gibbs paradox, which is resolved by the $1/N!$ in the partition function.' },
    { id: 'snd-019', type: 'nat', level: 3, exams: ['jam'], sub: 'entropy of the universe', unit: 'J/K',
      q: 'Two identical blocks, each of heat capacity $500$ J/K, at $400$ K and $200$ K are put in contact, insulated from everything else. When they reach equilibrium, the total entropy has increased by ______ J/K.',
      answer: 58.89, tol: 0.3, calc: () => 500 * Math.log(300 / 400) + 500 * Math.log(300 / 200),
      sol: 'Equal heat capacities, so $T_f = 300$ K. $\\Delta S = 500\\ln(300/400) + 500\\ln(300/200) = 500\\ln(1.125) \\approx 58.9$ J/K.' },
    { id: 'snd-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'Carnot engine',
      q: 'Two Carnot engines work in series between $900$ K and $400$ K: the first rejects its heat to an intermediate reservoir at $T$, from which the second takes it. If both engines produce the same work, $T$ is',
      options: ['$600$ K', '$500$ K', '$700$ K', '$650$ K'], answer: 3,
      sol: 'Let the first absorb $Q_1$; then $Q_2 = Q_1T/900$ and $Q_3 = Q_1\\cdot400/900$. Equal work: $Q_1 - Q_2 = Q_2 - Q_3$ gives $900 - T = T - 400$, so $T = 650$ K (the arithmetic mean). For equal efficiencies it would be the geometric mean, $600$ K.',
      trap: 'Equal work and equal efficiency give different answers: arithmetic mean versus geometric mean.' },
    { id: 'snd-022', type: 'nat', level: 3, exams: ['jam'], sub: 'cycles', unit: '%',
      q: 'An ideal Otto cycle with air ($\\gamma = 1.4$) has compression ratio $8$. Its efficiency is ______ %.',
      answer: 56.5, tol: 0.3, calc: () => 100 * (1 - 8 ** -0.4),
      sol: '$\\eta = 1 - r^{1 - \\gamma} = 1 - 8^{-0.4} = 1 - 0.435 \\approx 56.5\\%$.' },
    { id: 'snd-023', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'Clausius inequality', format: 'multi',
      q: 'A system goes from state 1 to state 2 once by a reversible path and once by an irreversible path, exchanging heat with its surroundings. Which statements are correct?',
      options: ['The entropy change of the system is the same for both paths', 'The entropy change of the surroundings is the same for both paths', 'The total entropy change of system plus surroundings is $\\ge 0$, and zero for the reversible path', 'Along the irreversible path, $\\int dQ/T$ equals the entropy change of the system'], answer: [0, 2],
      sol: 'A: $S$ is a state function. B: false, the surroundings receive different heat. C: second law. D: false, for the irreversible path $\\int dQ/T < \\Delta S_{\\rm system}$ (Clausius inequality).' },
    { id: 'snd-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'entropy change',
      q: 'The entropy change of $n$ moles of an ideal gas heated reversibly at constant pressure from $T$ to $2T$ is',
      options: ['$n(C_P - C_V)\\ln 2$', '$nC_P\\ln2$', '$nC_V\\ln2$', '$nR\\ln2$'], answer: 1,
      sol: '$dS = nC_P\\,dT/T$ at constant pressure, so $\\Delta S = nC_P\\ln2$. Equivalently $nC_V\\ln2 + nR\\ln(V_2/V_1)$ with $V_2/V_1 = 2$.' },
    { id: 'snd-025', type: 'nat', level: 3, exams: ['jam'], sub: 'entropy of the universe', unit: 'J/K',
      q: '1 kg of water ($c = 4186$ J kg$^{-1}$ K$^{-1}$) at $0\\,^\\circ$C is put in contact with a large reservoir at $100\\,^\\circ$C until it reaches $100\\,^\\circ$C. The entropy of the universe increases by ______ J/K.',
      answer: 184.0, tol: 1.5, calc: () => 4186 * Math.log(373.15 / 273.15) - 4186 * 100 / 373.15,
      sol: 'Water: $4186\\ln(373.15/273.15) = 1305.8$ J/K. Reservoir gives $Q = 418600$ J at fixed $373.15$ K: $-1121.8$ J/K. Total $\\approx +184$ J/K.' },
    { id: 'snd-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'refrigerators',
      q: 'A Carnot refrigerator removes heat at $600$ W from a cold space at $250$ K and rejects heat to a room at $300$ K. The power it needs is',
      options: ['$100$ W', '$500$ W', '$120$ W', '$720$ W'], answer: 2,
      sol: '$\\mathrm{COP} = T_c/(T_h - T_c) = 250/50 = 5$, so $W = 600/5 = 120$ W. It rejects $720$ W to the room.',
      trap: '$720$ W is the heat rejected; $100$ W comes from using $T_h/(T_h - T_c) = 6$.' },
    { id: 'snd-027', type: 'nat', level: 3, exams: ['jam'], sub: 'entropy change', unit: 'J/K',
      q: 'One mole of a monatomic ideal gas goes from $(300$ K, $10$ L$)$ to $(600$ K, $5$ L$)$. Its entropy change is ______ J/K.',
      answer: 2.881, tol: 0.03, calc: () => 1.5 * R * Math.log(2) + R * Math.log(0.5),
      sol: '$\\Delta S = nC_V\\ln(T_2/T_1) + nR\\ln(V_2/V_1) = \\tfrac32R\\ln2 - R\\ln2 = \\tfrac12R\\ln2 \\approx 2.88$ J/K.' },
    { id: 'snd-028', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'cycles',
      q: 'Through a given point on the $T$–$S$ diagram of an ideal gas pass an isochore and an isobar. Which is steeper?',
      options: ['The isochore, with slope $T/C_V$', 'The isobar, with slope $T/C_P$', 'Both have the same slope', 'The isobar, with slope $T/C_V$'], answer: 0,
      sol: '$dS = C\\,dT/T$ gives $dT/dS = T/C$. Since $C_V < C_P$, the isochore is steeper. (So an Otto cycle on a $T$–$S$ diagram has steeper sides than a Brayton cycle.)' },
    { id: 'snd-029', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'statistical entropy',
      q: 'A system has $N$ independent spins, each of which can point up or down with equal energy. Its entropy is',
      options: ['$k\\ln2$', '$k\\ln N$', '$2Nk$', '$Nk\\ln2$'], answer: 3,
      sol: 'There are $W = 2^N$ equally likely microstates, so $S = k\\ln W = Nk\\ln2$. Entropy is extensive, so it must be proportional to $N$.' },

    // ---- level 4 ----
    { id: 'snd-020', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'maximum work', unit: 'kJ',
      q: 'The same two blocks (heat capacity $500$ J/K each, at $400$ K and $200$ K) are now brought to a common temperature by running a reversible engine between them. The work obtained is ______ kJ.',
      answer: 17.16, tol: 0.1, calc: () => 500 * (600 - 2 * Math.sqrt(400 * 200)) / 1000,
      sol: 'Reversible means total $\\Delta S = 0$: $C\\ln(T_f/400) + C\\ln(T_f/200) = 0$, so $T_f = \\sqrt{400\\times200} = 282.8$ K. Work = heat lost by the hot block minus heat gained by the cold one $= C(400 - T_f) - C(T_f - 200) = 500(600 - 565.7) \\approx 17.16$ kJ.',
      trap: 'Using $T_f = 300$ K: that is the result with no engine, when no work is taken out.' },
    { id: 'snd-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'cycles', unit: '%',
      q: 'An ideal Diesel cycle with air ($\\gamma = 1.4$) has compression ratio $18$ and cut-off ratio $2$. Its efficiency is ______ %.',
      answer: 63.2, tol: 0.3, calc: () => 100 * (1 - (2 ** 1.4 - 1) / (1.4 * (2 - 1)) / 18 ** 0.4),
      sol: '$\\eta = 1 - \\dfrac{1}{r^{\\gamma-1}}\\dfrac{\\rho^{\\gamma} - 1}{\\gamma(\\rho - 1)}$. Here $r^{0.4} = 18^{0.4} = 3.178$ and $(\\rho^{\\gamma} - 1)/(\\gamma(\\rho - 1)) = (2.639 - 1)/1.4 = 1.171$. So $\\eta = 1 - 1.171/3.178 \\approx 63.2\\%$.',
      trap: 'The Diesel factor is always larger than 1, so at the same compression ratio a Diesel cycle is less efficient than an Otto cycle.' },
    { id: 'snd-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'entropy of the universe', format: 'multi',
      q: 'Which of these processes increase the entropy of the universe?',
      options: ['Free expansion of a gas into vacuum', 'Quasi-static isothermal expansion of a gas in contact with a reservoir at the same temperature', 'Heat conduction through a rod between two bodies at different temperatures', 'Current flowing through a resistor kept at constant temperature by a cooling bath'], answer: [0, 2, 3],
      sol: 'B is reversible: the gas gains $Q/T$ and the reservoir loses $Q/T$. A, C and D are irreversible: unrestrained expansion, heat across a finite temperature difference and dissipation of work as heat (D: the bath gains $I^2Rt/T$ while the resistor is unchanged).' },
    { id: 'snd-032', type: 'nat', level: 4, exams: ['jam'], sub: 'Carnot engine', unit: 'K',
      q: 'A Carnot engine has efficiency $40\\%$. When the temperature of its cold reservoir is lowered by $60$ K, the efficiency becomes $50\\%$. The temperature of the hot reservoir is ______ K.',
      answer: 600, tol: 0, calc: () => 60 / 0.1,
      sol: '$T_c = 0.6T_h$ and $T_c - 60 = 0.5T_h$. Subtract: $0.1T_h = 60$, so $T_h = 600$ K (and $T_c = 360$ K).' },
    { id: 'snd-033', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'cycles', format: 'multi',
      q: 'Working between two reservoirs at $T_h$ and $T_c$ only, which ideal reversible cycles reach the Carnot efficiency $1 - T_c/T_h$?',
      options: ['Carnot cycle', 'Stirling cycle with a perfect regenerator', 'Ericsson cycle with a perfect regenerator', 'Otto cycle'], answer: [0, 1, 2],
      sol: 'Any reversible cycle that exchanges heat with the outside only at $T_h$ and $T_c$ has Carnot efficiency. In Stirling and Ericsson cycles the regenerator stores and returns the heat of the isochoric or isobaric legs internally. The Otto cycle takes in heat over a range of temperatures (below $T_h$), so its efficiency is lower.' },
    { id: 'snd-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'entropy of the universe', unit: 'J/K',
      q: 'Two moles of an ideal gas at $300$ K expand isothermally (in contact with a reservoir at $300$ K) against a constant external pressure of $1$ atm, from $2$ atm to $1$ atm. The entropy of the universe increases by ______ J/K.',
      answer: 3.21, tol: 0.03, calc: () => 2 * R * Math.log(2) - 2 * R * 0.5,
      sol: 'Gas: $\\Delta S = nR\\ln(P_1/P_2) = 2(8.314)\\ln2 = 11.53$ J/K. Work done $= P_{\\rm ext}(V_2 - V_1) = nRT(1 - P_2/P_1) = 0.5\\,nRT$, and $Q = W$ since $\\Delta U = 0$. Reservoir: $-Q/T = -0.5nR = -8.31$ J/K. Total $\\approx 3.21$ J/K.' },
    { id: 'snd-035', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'third law',
      q: 'Which statement is <b>NOT</b> consistent with the third law of thermodynamics?',
      options: ['Absolute zero cannot be reached in a finite number of steps', 'A classical ideal gas keeps a constant $C_V$ all the way down to $T = 0$', 'Heat capacities tend to zero as $T \\to 0$', 'The thermal expansion coefficient tends to zero as $T \\to 0$'], answer: 1,
      sol: 'With constant $C_V$, $S = C_V\\ln T + \\dots \\to -\\infty$ as $T\\to0$, which violates the third law. Real gases become quantum (degenerate) at low $T$. B follows from $S = \\int C\\,dT/T$ staying finite; C from the Maxwell relation $(\\partial V/\\partial T)_P = -(\\partial S/\\partial P)_T \\to 0$; D is the unattainability form.' },
    { id: 'snd-036', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'third law', unit: 'J mol$^{-1}$ K$^{-1}$',
      q: 'At low temperatures the molar heat capacity of a crystal follows the Debye law $C = aT^3$ with $a = 2.0\\times10^{-4}$ J mol$^{-1}$ K$^{-4}$. Its molar entropy at $20$ K is ______ J mol$^{-1}$ K$^{-1}$.',
      answer: 0.533, tol: 0.005, calc: () => 2e-4 * 20 ** 3 / 3,
      sol: 'With $S(0) = 0$: $S(T) = \\int_0^T \\frac{aT\'^3}{T\'}dT\' = aT^3/3 = 2\\times10^{-4}\\times8000/3 \\approx 0.533$ J mol$^{-1}$ K$^{-1}$. Note $S = C/3$ for a $T^3$ law.',
      trap: 'Answering $C(20) = 1.6$: the entropy is an integral of $C/T$, not $C$ itself.' },
    { id: 'snd-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'maximum work',
      q: 'A body of constant heat capacity $C$ at temperature $T_1$ drives a reversible engine that rejects heat to the surroundings at $T_0 < T_1$, until the body cools to $T_0$. The total work obtained is',
      options: ['$C(T_1 - T_0)(1 - T_0/T_1)$', '$CT_0\\ln(T_1/T_0)$', '$C(T_1 - T_0) - CT_0\\ln(T_1/T_0)$', '$C(T_1 - T_0)$'], answer: 2,
      sol: 'The body gives up $C(T_1 - T_0)$ of heat and loses entropy $C\\ln(T_1/T_0)$. A reversible engine must hand that entropy to the surroundings, which costs heat $T_0C\\ln(T_1/T_0)$. The rest is work.',
      trap: 'Option A uses the Carnot efficiency at the starting temperature for all the heat, but the body cools, so the efficiency falls as it runs.' },

    // ---- level 5 ----
    { id: 'snd-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'maximum work', unit: 'kJ',
      q: 'The surroundings are at $20\\,^\\circ$C. What is the minimum work needed to turn 1 kg of water at $20\\,^\\circ$C into ice at $0\\,^\\circ$C? ($c = 4186$ J kg$^{-1}$ K$^{-1}$, latent heat $334$ kJ/kg.) Answer in kJ.',
      answer: 27.4, tol: 0.3, calc: () => { const dH = -(4186 * 20 + 334000), dS = -(4186 * Math.log(293.15 / 273.15) + 334000 / 273.15); return (dH - 293.15 * dS) / 1000; },
      sol: 'A reversible refrigerator leaves the universe\'s entropy unchanged. The water loses $\\Delta H = -(4186\\times20 + 334000) = -417.7$ kJ of heat and entropy $4186\\ln(293.15/273.15) + 334000/273.15 = 295.8 + 1222.8 = 1518.6$ J/K. The surroundings must gain that entropy, i.e. receive $293.15\\times1518.6 = 445.2$ kJ. Work = heat delivered − heat extracted $= 445.2 - 417.7 \\approx 27.4$ kJ.',
      trap: 'Using a single Carnot COP for the whole job: the cooling part from 20 to 0 °C runs at changing temperature.' },
    { id: 'snd-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Carnot engine', unit: 'J',
      q: 'A reversible engine takes $1200$ J per cycle from a reservoir at $400$ K, exchanges heat with reservoirs at $300$ K and $200$ K, and delivers $200$ J of work per cycle. The heat it takes from the $300$ K reservoir per cycle (negative if it gives heat to that reservoir) is ______ J.',
      answer: -1200, tol: 0, calc: () => { const Q2 = 2 / (1 / 300 - 1 / 200); return Q2; },
      sol: 'Let $Q_2$, $Q_3$ be the heats taken from the $300$ K and $200$ K reservoirs. Energy: $1200 + Q_2 + Q_3 = 200$. Reversible: $\\frac{1200}{400} + \\frac{Q_2}{300} + \\frac{Q_3}{200} = 0$. Substituting $Q_3 = -1000 - Q_2$: $3 + \\frac{Q_2}{300} - 5 - \\frac{Q_2}{200} = 0$, so $-\\frac{Q_2}{600} = 2$ and $Q_2 = -1200$ J. It gives $1200$ J to the $300$ K reservoir and takes $Q_3 = 200$ J from the $200$ K one.',
      trap: 'Assuming the coldest reservoir must receive heat. Only the total entropy balance decides.' },
    { id: 'snd-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'statistical entropy', format: 'multi',
      q: 'For a simple system described by its entropy $S(U, V, N)$, which statements are correct?',
      options: ['$S$ is homogeneous of degree 1: $S(\\lambda U, \\lambda V, \\lambda N) = \\lambda S(U, V, N)$', '$(\\partial S/\\partial U)_{V,N} = 1/T$', 'For a stable system $S$ is a concave function of $U$', '$(\\partial S/\\partial V)_{U,N} = -P/T$'], answer: [0, 1, 2],
      sol: 'From $dU = T\\,dS - P\\,dV + \\mu\\,dN$: $dS = dU/T + (P/T)dV - (\\mu/T)dN$. So $(\\partial S/\\partial V)_U = +P/T$, and D has the wrong sign. A is extensivity. C: concavity, $\\partial^2S/\\partial U^2 = -1/(T^2C_V) < 0$, is the same as $C_V > 0$.' },
    { id: 'snd-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'statistical entropy',
      q: 'A system of nuclear spins in a magnetic field has been prepared at a negative absolute temperature. It is put in thermal contact with an ordinary body at $+300$ K. Heat flows',
      options: ['from the spin system to the body', 'from the body to the spin system', 'in neither direction, since $|T|$ for the spins can be smaller than 300 K', 'in either direction, depending on $|T|$'], answer: 0,
      sol: 'Heat flows so that total entropy rises. $1/T = \\partial S/\\partial U$ is negative for the spins: they gain entropy by losing energy. The body gains entropy by gaining energy. So energy flows from the spins to the body, whatever the size of $|T|$. Negative temperatures are "hotter than infinite temperature".',
      trap: 'Comparing magnitudes. The order of hotness runs $+0 \\dots +\\infty, -\\infty \\dots -0$, and $1/T$ is the natural variable.' },
  ],
  gens: [
    { id: 'snd-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'Carnot engine',
      make(r) {
        const Th = int(r, 40, 120) * 10, Tc = int(r, 25, Math.floor(Th / 10) - 5) * 10, cel = r() < 0.4;
        const eta = 100 * (1 - Tc / Th);
        const show = (T) => (cel ? `$${round(T - 273, 0)}\\,^\\circ$C` : `$${T}$ K`);
        return { q: `A Carnot engine works between ${show(Th)} and ${show(Tc)}${cel ? ' (take $0\\,^\\circ$C $= 273$ K)' : ''}. Its efficiency is ______ %.`,
          answer: round(eta, 2), tol: 0.1, unit: '%', Th, Tc,
          sol: `$\\eta = 1 - T_c/T_h = 1 - ${Tc}/${Th} \\approx ${round(eta, 2)}\\%$${cel ? ', with temperatures converted to kelvin first' : ''}.`,
          trap: cel ? 'Convert Celsius to kelvin before dividing.' : 'The efficiency is $1 - T_c/T_h$, not $T_c/T_h$.' };
      },
      verify: (p) => 100 * (1 - p.Tc / p.Th) },
    { id: 'snd-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'refrigerators',
      make(r) {
        const Tc = int(r, 240, 290), Th = Tc + int(r, 10, 60), pump = r() < 0.5;
        const cop = pump ? Th / (Th - Tc) : Tc / (Th - Tc);
        return { q: `A reversible ${pump ? 'heat pump' : 'refrigerator'} works between $${Tc}$ K and $${Th}$ K. Its coefficient of performance (${pump ? 'heat delivered to the hot side' : 'heat removed from the cold side'} per unit work) is ______ (to two decimal places).`,
          answer: round(cop, 2), tol: 0.02, Tc, Th, pump,
          sol: `$\\mathrm{COP} = ${pump ? 'T_h' : 'T_c'}/(T_h - T_c) = ${pump ? Th : Tc}/${Th - Tc} \\approx ${round(cop, 2)}$.`,
          trap: 'Heat pump and refrigerator COPs differ by exactly 1.' };
      },
      verify: (p) => (p.pump ? p.Th : p.Tc) / (p.Th - p.Tc) },
    { id: 'snd-g03', type: 'nat', level: 3, exams: ['jam'], sub: 'entropy change',
      make(r) {
        const [kind, cv] = choose(r, [['monatomic', 1.5], ['rigid diatomic', 2.5]]);
        const n = int(r, 1, 3), T1 = int(r, 20, 40) * 10, T2 = int(r, 20, 60) * 10, V1 = int(r, 1, 6) * 5, V2 = int(r, 1, 6) * 5;
        const dS = n * cv * R * Math.log(T2 / T1) + n * R * Math.log(V2 / V1);
        return { q: `${n} mol of a ${kind} ideal gas goes from $${T1}$ K, $${V1}$ L to $${T2}$ K, $${V2}$ L. Its entropy change is ______ J/K.`,
          answer: round(dS, 2), tol: Math.max(0.05, Math.abs(round(dS * 0.01, 2))), unit: 'J/K', n, cv, T1, T2, V1, V2,
          sol: `$\\Delta S = nC_V\\ln\\frac{T_2}{T_1} + nR\\ln\\frac{V_2}{V_1} = ${n}(${cv})(8.314)\\ln\\frac{${T2}}{${T1}} + ${n}(8.314)\\ln\\frac{${V2}}{${V1}} \\approx ${round(dS, 2)}$ J/K. The path does not matter.`,
          trap: 'Use $C_V$ with the volume term (or $C_P$ with the pressure term), never $C_P$ with volume.' };
      },
      verify: (p) => p.n * p.cv * R * Math.log(p.T2 / p.T1) + p.n * R * Math.log(p.V2 / p.V1) },
    { id: 'snd-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'entropy change',
      make(r) {
        const m = pick(r, 0.5, 3, 0.5), t1 = int(r, 1, 6) * 10, t2 = t1 + int(r, 2, 8) * 5;
        const dS = m * 4186 * Math.log((t2 + 273.15) / (t1 + 273.15));
        return { q: `${m} kg of water ($c = 4186$ J kg$^{-1}$ K$^{-1}$) is heated from $${t1}\\,^\\circ$C to $${t2}\\,^\\circ$C. Its entropy increases by ______ J/K.`,
          answer: round(dS, 1), tol: round(dS * 0.01, 1), unit: 'J/K', m, t1, t2,
          sol: `$\\Delta S = mc\\ln(T_2/T_1) = ${m}\\times4186\\times\\ln(${round(t2 + 273.15, 2)}/${round(t1 + 273.15, 2)}) \\approx ${round(dS, 1)}$ J/K.`,
          trap: 'Temperatures in kelvin inside the logarithm.' };
      },
      verify: (p) => p.m * 4186 * Math.log((p.t2 + 273.15) / (p.t1 + 273.15)) },
    { id: 'snd-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'entropy of the universe',
      make(r) {
        const Cap = int(r, 2, 10) * 100, T1 = int(r, 35, 60) * 10, T2 = int(r, 15, 30) * 10;
        const Tf = (T1 + T2) / 2, dS = Cap * Math.log(Tf / T1) + Cap * Math.log(Tf / T2);
        return { q: `Two identical blocks of heat capacity $${Cap}$ J/K, at $${T1}$ K and $${T2}$ K, are put in contact in isolation. The total entropy change when they reach equilibrium is ______ J/K.`,
          answer: round(dS, 2), tol: Math.max(0.05, round(dS * 0.01, 2)), unit: 'J/K', Cap, T1, T2,
          sol: `$T_f = ${Tf}$ K. $\\Delta S = C\\ln\\frac{T_f}{T_1} + C\\ln\\frac{T_f}{T_2} = ${Cap}\\ln\\frac{${Tf}^2}{${T1}\\times${T2}} \\approx ${round(dS, 2)}$ J/K, positive since the arithmetic mean exceeds the geometric mean.`,
          trap: 'The heat lost equals the heat gained, but the entropy lost is less than the entropy gained.' };
      },
      verify: (p) => { const Tf = (p.T1 + p.T2) / 2; return p.Cap * Math.log(Tf * Tf / (p.T1 * p.T2)); } },
    { id: 'snd-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'cycles',
      make(r) {
        const rr = int(r, 5, 12), [gas, g] = choose(r, [['air ($\\gamma = 1.4$)', 1.4], ['a monatomic gas ($\\gamma = 5/3$)', 5 / 3]]);
        const eta = 100 * (1 - rr ** (1 - g));
        return { q: `An ideal Otto cycle using ${gas} has compression ratio $${rr}$. Its efficiency is ______ %.`,
          answer: round(eta, 2), tol: 0.2, unit: '%', rr, g,
          sol: `$\\eta = 1 - r^{1-\\gamma} = 1 - ${rr}^{${round(1 - g, 4)}} \\approx ${round(eta, 2)}\\%$.`,
          trap: 'The exponent is $\\gamma - 1$, not $\\gamma$.' };
      },
      verify: (p) => 100 * (1 - p.rr ** (1 - p.g)) },
    { id: 'snd-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'mixing',
      make(r) {
        const n1 = int(r, 1, 4), n2 = int(r, 1, 4), n = n1 + n2;
        const dS = -R * (n1 * Math.log(n1 / n) + n2 * Math.log(n2 / n));
        return { q: `${n1} mol of argon and ${n2} mol of nitrogen, at the same temperature and pressure, mix. The entropy of mixing is ______ J/K.`,
          answer: round(dS, 2), tol: Math.max(0.05, round(dS * 0.01, 2)), unit: 'J/K', n1, n2,
          sol: `Each gas expands into the whole volume: $\\Delta S = n_1R\\ln\\frac{n}{n_1} + n_2R\\ln\\frac{n}{n_2} = 8.314\\left(${n1}\\ln\\frac{${n}}{${n1}} + ${n2}\\ln\\frac{${n}}{${n2}}\\right) \\approx ${round(dS, 2)}$ J/K.`,
          trap: 'Mixing entropy needs different gases; for the same gas it is zero.' };
      },
      verify: (p) => { const n = p.n1 + p.n2; return R * (p.n1 * Math.log(n / p.n1) + p.n2 * Math.log(n / p.n2)); } },
    { id: 'snd-g08', type: 'mcq', level: 3, exams: ['jam'], sub: 'Carnot engine',
      make(r) {
        const Th = int(r, 40, 80) * 10, Tc = int(r, 25, 35) * 10, Q = int(r, 5, 20) * 100;
        const Wmax = Q * (1 - Tc / Th);
        const kind = choose(r, ['over', 'under', 'equal', 'first']);
        const W = kind === 'over' ? Math.round(Wmax * 1.2) : kind === 'under' ? Math.round(Wmax * 0.7) : kind === 'equal' ? round(Wmax, 1) : Q + 100;
        const opts = ['Impossible: it violates the second law', 'Possible, but irreversible', 'Possible only as a reversible engine', 'Impossible: it violates the first law'];
        const ans = { over: 0, under: 1, equal: 2, first: 3 }[kind];
        return { q: `An engine is claimed to take $${Q}$ J per cycle from a reservoir at $${Th}$ K, reject heat to a reservoir at $${Tc}$ K and deliver $${W}$ J of work per cycle. The claim is`, options: opts, answer: ans,
          sol: `First law: the work cannot exceed the heat taken in ($${Q}$ J). Second law: the most work is $Q(1 - T_c/T_h) = ${Q}(1 - ${Tc}/${Th}) = ${round(Wmax, 1)}$ J. ${['The claim exceeds this', 'The claim is below this, so it is allowed, with some entropy produced', 'The claim equals this, so only a reversible engine could do it', 'The claim exceeds the heat taken in'][ans]}.`,
          trap: 'Check the first law before the second: more work than heat in is impossible for a different reason.' };
      } },
  ],
};
