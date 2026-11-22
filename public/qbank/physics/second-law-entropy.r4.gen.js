// Round 4 extras for second-law-entropy: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'snd-r4-01', type: 'mcq', level: 1, exams: A, sub: 'entropy change',
      q: R`A large reservoir at $400$ K gives $1000$ J of heat to a system. The entropy of the reservoir changes by`,
      options: [R`$+2.5$ J/K`, R`$-2.5$ J/K`, R`$0$, because a reservoir's temperature does not change`, R`$-4\times10^5$ J/K`], answer: 1,
      sol: R`A reservoir stays at one temperature, so the heat leaves it reversibly as far as the reservoir is concerned: $\Delta S = Q/T = -1000/400 = -2.5$ J/K. The sign is negative because heat leaves it. Whether the total entropy rises depends on the temperature of the system that receives the heat.`,
      trap: R`A constant temperature does not mean constant entropy; $\Delta S = Q/T$ is exactly the formula for a reservoir.` },
    { id: 'snd-r4-02', type: 'nat', level: 2, exams: A, sub: 'entropy generation',
      q: R`A current of $1.0$ A flows for $10$ s through a $100\ \Omega$ resistor that is kept at $300$ K by a large water bath. The entropy of the universe rises by ______ J/K.`,
      answer: 3.33, tol: 0.03, calc: () => 1 * 1 * 100 * 10 / 300,
      sol: R`The resistor dissipates $I^2Rt = 1\times100\times10 = 1000$ J. Its own state is the same at the end (same temperature), so its entropy does not change. All $1000$ J goes into the bath at $300$ K: $\Delta S = 1000/300 = 3.33$ J/K. Ordered electrical work has become disordered heat: an irreversible process.`,
      trap: R`Giving the resistor an entropy change as well counts the same heat twice; its state is unchanged.` },
    { id: 'snd-r4-03', type: 'msq', level: 2, exams: A, sub: 'second law', format: 'statements',
      q: R`Which statements are correct?`,
      options: [R`The entropy of an isolated system never decreases.`, R`The entropy of a system that is not isolated can decrease, if it gives out heat.`, R`A reversible adiabatic process leaves the entropy of the system unchanged.`, R`Over one cycle of a real (irreversible) heat engine, the entropy of the universe is unchanged, because the working substance returns to its starting state.`], answer: [0, 1, 2],
      sol: R`The second law forbids a decrease only for the total entropy of an isolated system. A system that gives out heat (a cooling cup of tea) loses entropy, but its surroundings gain more. Reversible and adiabatic means $dS = dQ_{\rm rev}/T = 0$. Over a cycle the working substance's entropy is unchanged (a state function), but the reservoirs gain entropy in an irreversible engine, so the universe's entropy rises.`,
      trap: R`The working substance returning to its start says nothing about the reservoirs.` },
    { id: 'snd-r4-04', type: 'nat', level: 3, exams: A, sub: 'refrigerators',
      q: R`A refrigerator removes heat at $200$ W from its inside at $260$ K and uses $100$ W of electrical power, rejecting heat to a kitchen at $300$ K. The rate of entropy production is ______ W/K (three decimal places).`,
      answer: 0.231, tol: 0.003, calc: () => 300 / 300 - 200 / 260,
      sol: R`Energy balance: heat to the kitchen $= 200 + 100 = 300$ W. Entropy flows: the kitchen gains $300/300 = 1.000$ W/K and the inside loses $200/260 = 0.769$ W/K (the working fluid runs in a cycle). Net production $= 0.231$ W/K. A reversible fridge would need only $200\times(300/260 - 1) = 30.8$ W; the extra $69.2$ W ends as heat at $300$ K, and $69.2/300 = 0.231$ W/K, the same answer.`,
      trap: R`Forgetting the electrical power in the heat sent to the kitchen gives a negative (impossible) result.` },
    { id: 'snd-r4-05', type: 'msq', level: 3, exams: A, sub: 'entropy change',
      q: R`In which of these processes does the entropy of the system itself (not the universe) stay the same?`,
      options: [R`A reversible adiabatic compression of a gas`, R`A free expansion of an ideal gas into a vacuum, in an insulated box`, R`A slow adiabatic compression in which friction between piston and cylinder heats the gas`, R`One complete cycle of an irreversible engine, for its working substance`], answer: [0, 3],
      sol: R`Reversible and adiabatic gives $\Delta S = 0$. In the free expansion no heat enters, but the volume grows at fixed $T$, so $\Delta S = nR\ln(V_2/V_1) > 0$; "adiabatic" alone does not mean "isentropic". With friction the gas receives extra internal energy without heat crossing the boundary, so its entropy rises. Entropy is a state function, so over any complete cycle the working substance returns to the same $S$, reversible or not.`,
      trap: R`$dS = dQ/T$ holds only for reversible changes; adiabatic irreversible processes raise the entropy.` },
    { id: 'snd-r4-06', type: 'mcq', level: 4, exams: A, sub: 'T-S diagrams',
      q: R`A reversible cycle is a right triangle on a $T$-$S$ diagram: a vertical rise at $S_1$ from $T_C$ to $T_H$, then a straight line from $(S_1, T_H)$ down to $(S_2, T_C)$ with $S_2 > S_1$, then a horizontal return at $T_C$. Its efficiency is`,
      options: [R`$\dfrac{T_H - T_C}{T_H}$`, R`$\dfrac{T_H - T_C}{2T_H}$`, R`$\dfrac{T_H - T_C}{T_H + T_C}$`, R`$\dfrac{2(T_H - T_C)}{T_H + T_C}$`], answer: 2,
      sol: R`Heat taken in is the area under the sloping line, where $dS > 0$: $Q_{\rm in} = (S_2 - S_1)\dfrac{T_H + T_C}{2}$. Heat rejected is along the bottom: $Q_{\rm out} = T_C(S_2 - S_1)$. The net work is the triangle's area, $\tfrac12(S_2 - S_1)(T_H - T_C)$. Efficiency $= \dfrac{W}{Q_{\rm in}} = \dfrac{T_H - T_C}{T_H + T_C}$. For $600$ K and $300$ K that is $1/3$, below Carnot's $1/2$, because heat is taken in at an average temperature of only $450$ K.`,
      trap: R`Taking $Q_{\rm in} = T_H(S_2 - S_1)$ (as for a Carnot rectangle) gives $(T_H - T_C)/2T_H$.` },
    { id: 'snd-r4-07', type: 'nat', level: 4, exams: A, sub: 'heat pumps',
      q: R`A reversible engine takes heat from a furnace at $1000$ K and rejects heat to the outdoors at $300$ K. All its work drives a reversible heat pump that takes heat from the outdoors and delivers it to a house at $320$ K. For each joule taken from the furnace, the heat delivered to the house is ______ J.`,
      answer: 11.2, tol: 0.1, calc: () => (1 - 300 / 1000) * 320 / 20,
      sol: R`The engine turns $1 - 300/1000 = 0.70$ J of each furnace joule into work; its remaining $0.30$ J goes outdoors. The heat pump's coefficient of performance is $T_h/(T_h - T_c) = 320/20 = 16$, so $0.70$ J of work delivers $0.70\times16 = 11.2$ J to the house. Burning fuel directly in the house would give only $1$ J: the second law makes heating by heat pump far more efficient.`,
      trap: R`Adding the engine's rejected $0.30$ J to the house heat is wrong here: it goes to the outdoors, not to the house.` },
    { id: 'snd-r4-08', type: 'mcq', level: 3, exams: G, sub: 'entropy and information',
      q: R`A memory bit, which may hold 0 or 1 with equal probability, is reset to 0 by a device in contact with surroundings at temperature $T$. The least heat that must be released to the surroundings is`,
      options: [R`$kT\ln2$`, R`$kT$`, R`$\tfrac32kT$`, R`zero, if the reset is done slowly enough`], answer: 0,
      sol: R`Before the reset the bit has two equally likely states, entropy $k\ln2$; afterwards it has one, entropy $0$. The second law requires the surroundings' entropy to rise by at least $k\ln2$, so heat of at least $kT\ln2$ must be released (Landauer's principle). Slowness can reach this minimum but cannot remove it. At $300$ K it is $2.9\times10^{-21}$ J per bit.`,
      trap: R`Reversible does not mean free: a reversible erasure still sends $kT\ln2$ of heat out.` },
    { id: 'snd-r4-09', type: 'mcq', level: 5, exams: G, sub: 'heat engines',
      q: R`A Carnot-type engine exchanges heat with reservoirs at $900$ K and $400$ K through finite thermal conductances, so heat flows only if the working fluid is cooler than the hot reservoir and warmer than the cold one. Tuning the fluid temperatures for <b>maximum power</b>, the efficiency (the Curzon-Ahlborn result) is`,
      options: [R`$5/9$`, R`$5/18$`, R`$3/5$`, R`$1/3$`], answer: 3,
      sol: R`A reversible engine (infinitely slow) gives Carnot's $1 - 400/900 = 5/9$ but zero power. With finite heat-flow rates, maximising the power gives $\eta = 1 - \sqrt{T_C/T_H} = 1 - \sqrt{400/900} = 1 - 2/3 = 1/3$. This is lower than Carnot, but it is close to what real power stations achieve.`,
      trap: R`$5/9$ is the reversible limit, reached only at zero power; $5/18$ (half of Carnot) is a rule of thumb, not the result.` },
    { id: 'snd-r4-10', type: 'nat', level: 4, exams: A, sub: 'maximum work',
      q: R`A body of heat capacity $1000$ J/K at $500$ K and a body of heat capacity $2000$ J/K at $250$ K (both constant) drive a reversible engine until they reach a common temperature. The work obtained is ______ kJ.`,
      answer: 55.1, tol: 0.3, calc: () => { const Tf = 500 ** (1 / 3) * 250 ** (2 / 3); return (1000 * (500 - Tf) - 2000 * (Tf - 250)) / 1e3; },
      sol: R`Reversible means no total entropy change: $C_1\ln(T_f/T_1) + C_2\ln(T_f/T_2) = 0$, so $T_f = T_1^{C_1/(C_1 + C_2)}T_2^{C_2/(C_1 + C_2)} = 500^{1/3}\,250^{2/3} = 250\times2^{1/3} = 315.0$ K. The work is the heat given by the hot body minus the heat received by the cold one: $1000\times185.02 - 2000\times64.98 = 185.02 - 129.96 = 55.1$ kJ.`,
      trap: R`Using the plain heat-capacity-weighted mean ($333.3$ K), which is the result of direct contact with no engine, gives zero work.` },
  ],
  gens: [
    { id: 'snd-r4g1', type: 'nat', level: 3, exams: A, sub: 'refrigerators',
      make(r) {
        const Tc = choose(r, [250, 255, 260, 265, 270, 275]), Th = choose(r, [295, 300, 305, 310]);
        const Qc = choose(r, [100, 150, 200, 250, 300, 400]), k = choose(r, [1.5, 2, 2.5, 3, 4]);
        const P = Math.round(Qc * (Th / Tc - 1) * k);
        const s = (Qc + P) / Th - Qc / Tc;
        return { q: `A refrigerator removes heat at $${Qc}$ W from its inside at $${Tc}$ K using $${P}$ W of electrical power, and rejects heat to a room at $${Th}$ K. The rate of entropy production is ______ W/K (three decimal places).`,
          answer: round(s, 3), tol: Math.max(0.002, round(s * 0.01, 3)), Qc, P, Tc, Th,
          sol: `Heat to the room $= ${Qc} + ${P} = ${Qc + P}$ W. Entropy production $= ${Qc + P}/${Th} - ${Qc}/${Tc} = ${round((Qc + P) / Th, 4)} - ${round(Qc / Tc, 4)} = ${round(s, 3)}$ W/K. (A reversible fridge would need only $${round(Qc * (Th / Tc - 1), 1)}$ W.)`,
          trap: 'The heat rejected to the room includes the electrical power.' };
      },
      verify: (p) => (p.Qc + p.P) / p.Th - p.Qc / p.Tc },
    { id: 'snd-r4g2', type: 'nat', level: 4, exams: A, sub: 'heat pumps',
      make(r) {
        const Tf = choose(r, [600, 800, 900, 1000, 1200, 1500]), To = choose(r, [260, 270, 280, 290, 300]);
        const Th = To + choose(r, [15, 20, 25, 30, 40]);
        const x = (1 - To / Tf) * Th / (Th - To);
        return { q: `A reversible engine runs between a furnace at $${Tf}$ K and the outdoors at $${To}$ K, and its work drives a reversible heat pump that takes heat from the outdoors and delivers it to a house at $${Th}$ K. Per joule taken from the furnace, the heat delivered to the house is ______ J.`,
          answer: round(x, 2), tol: Math.max(0.02, round(x * 0.01, 2)), Tf, To, Th,
          sol: `Work per furnace joule: $1 - ${To}/${Tf} = ${round(1 - To / Tf, 4)}$ J. Heat-pump COP: $${Th}/(${Th} - ${To}) = ${round(Th / (Th - To), 3)}$. Heat to the house: $${round(x, 2)}$ J.`,
          trap: 'The engine\'s rejected heat goes to the outdoors, not into the house.' };
      },
      verify: (p) => (1 - p.To / p.Tf) * p.Th / (p.Th - p.To) },
    { id: 'snd-r4g3', type: 'mcq', level: 4, exams: A, sub: 'T-S diagrams',
      make(r) {
        const Th = choose(r, [400, 500, 600, 800, 900, 1000]), Tc = choose(r, [200, 250, 300, 350]);
        const eta = (Th - Tc) / (Th + Tc);
        const show = (v) => `$${round(100 * v, 1)}\\%$`;
        const o = mcqOptions(r, eta, [1 - Tc / Th, (Th - Tc) / (2 * Th), 2 * (Th - Tc) / (Th + Tc), (Th - Tc) / (2 * (Th + Tc))], show);
        return { q: `A reversible cycle is a right triangle on a $T$-$S$ diagram: a vertical rise at $S_1$ from $${Tc}$ K to $${Th}$ K, a straight line from $(S_1, ${Th}$ K$)$ down to $(S_2, ${Tc}$ K$)$ with $S_2 > S_1$, and a horizontal return at $${Tc}$ K. Its efficiency is`, ...o,
          sol: `Heat in = area under the sloping line $= \\Delta S\\,(${Th} + ${Tc})/2$; heat out $= ${Tc}\\,\\Delta S$. Efficiency $= (T_H - T_C)/(T_H + T_C) = ${Th - Tc}/${Th + Tc} = ${round(100 * eta, 1)}\\%$ (Carnot would give $${round(100 * (1 - Tc / Th), 1)}\\%$).`,
          trap: 'The heat enters along the sloping side, at an average temperature $(T_H + T_C)/2$, not at $T_H$.' };
      } },
  ],
};
