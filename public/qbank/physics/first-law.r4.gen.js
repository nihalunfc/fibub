// Round 4 extras for first-law: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];

// Heat taken in by n mol along a straight line in the V-T plane from (T1, V1) to (T2, V2); cv in units of R.
const linVT = (n, cv, T1, V1, T2, V2) => {
  const b = (V2 - V1) / (T2 - T1); // L per K
  const W = n * 8.314 * ((T1 - V1 / b) * Math.log(V2 / V1) + (V2 - V1) / b);
  return { W, dU: n * cv * 8.314 * (T2 - T1), Q: W + n * cv * 8.314 * (T2 - T1), T0: T1 - V1 / b };
};

export default {
  items: [
    { id: 'fst-r4-01', type: 'mcq', level: 1, exams: A, sub: 'sign conventions',
      q: R`A gas absorbs $500$ J of heat while $200$ J of work is done <b>on</b> it by a piston. The change in its internal energy is`,
      options: [R`$+300$ J`, R`$+700$ J`, R`$-300$ J`, R`$-700$ J`], answer: 1,
      sol: R`Energy enters the gas both ways: $500$ J as heat and $200$ J as work done on it. So $\Delta U = Q + W_{\rm on} = 500 + 200 = +700$ J. In the form $\Delta U = Q - W$ with $W$ the work done <b>by</b> the gas, $W = -200$ J and the result is the same.`,
      trap: R`$+300$ J comes from subtracting the work while reading it as work done by the gas.` },
    { id: 'fst-r4-02', type: 'nat', level: 2, exams: A, sub: 'heat capacities',
      q: R`A $1.0$ kW heater runs for $2.0$ s inside $0.50$ mol of a rigid diatomic ideal gas held at constant pressure. Ignoring losses, the temperature of the gas rises by ______ K ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 137, tol: 1.5, calc: () => 2000 / (0.5 * 3.5 * 8.314),
      sol: R`The heater supplies $Q = 1000\times2.0 = 2000$ J. At constant pressure $Q = nC_P\Delta T$ with $C_P = \tfrac72R$ for a rigid diatomic gas, so $\Delta T = \dfrac{2000}{0.50\times3.5\times8.314} = 137$ K. Part of the heat ($2/7$ of it) goes into the work of expansion, which is why the rise is smaller than at constant volume.`,
      trap: R`Using $C_V = \tfrac52R$ gives $192$ K, which ignores the work done pushing the piston out.` },
    { id: 'fst-r4-03', type: 'mcq', level: 2, exams: A, sub: 'heat and work',
      q: R`Water in a thermally insulated container is stirred by a paddle wheel driven by a falling weight, and its temperature rises. Taking the water as the system, which description is right?`,
      options: [R`Heat flows into the water from the paddle, so $Q > 0$ and $W = 0$.`, R`No work is done, because the volume of the water does not change.`, R`The internal energy is unchanged, since the container is insulated.`, R`No heat enters ($Q = 0$); work is done on the water, and its internal energy rises by that amount.`], answer: 3,
      sol: R`Heat is energy that crosses the boundary because of a temperature difference. Here the paddle and water start at the same temperature and the walls are insulating, so $Q = 0$. The paddle does work on the water (shaft work, not $P\,dV$ work), and by the first law $\Delta U = W_{\rm on}$. The same final state could be reached by heating instead, which is the point of Joule's experiment: $U$ is a state function, heat and work are not.`,
      trap: R`A temperature rise does not prove that heat flowed in; work can raise the temperature too.` },
    { id: 'fst-r4-04', type: 'nat', level: 5, exams: A, sub: 'general processes',
      q: R`One mole of a monatomic ideal gas is taken along a path on which its volume is a <b>linear</b> function of temperature, from $300$ K and $10$ L to $600$ K and $25$ L. The heat it absorbs is ______ kJ ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
      answer: 7.00, tol: 0.05, calc: () => linVT(1, 1.5, 300, 10, 600, 25).Q / 1e3,
      sol: R`Along the path $V = V_1 + \beta(T - T_1)$ with $\beta = 15/300 = 0.05$ L/K, so $T = T_1 + (V - V_1)/\beta$. The work is $W = \int P\,dV = R\int\dfrac{T}{V}dV = R\int\Big[\dfrac{T_1 - V_1/\beta}{V} + \dfrac1\beta\Big]dV = R\Big[(T_1 - V_1/\beta)\ln\dfrac{V_2}{V_1} + \dfrac{V_2 - V_1}{\beta}\Big]$. Here $T_1 - V_1/\beta = 300 - 200 = 100$ K, so $W = 8.314\,(100\ln2.5 + 300) = 8.314\times391.6 = 3256$ J. $\Delta U = \tfrac32R\times300 = 3741$ J, and $Q = \Delta U + W = 6997$ J $\approx7.00$ kJ.`,
      trap: R`The line does not pass through the origin of the $V$-$T$ plane, so the process is not isobaric; using $W = R\,\Delta T$ gives $2494$ J of work and $Q = 6.24$ kJ.` },
    { id: 'fst-r4-05', type: 'msq', level: 2, exams: A, sub: 'enthalpy', format: 'statements',
      q: R`Which statements about the enthalpy $H = U + PV$ are correct?`,
      options: [R`In a process at constant pressure with only $P\,dV$ work, the heat absorbed equals $\Delta H$.`, R`For an ideal gas, $H$ depends on temperature only.`, R`When an ideal gas expands freely into a vacuum inside an insulated box, $\Delta H = 0$.`, R`In a reversible isothermal expansion of an ideal gas, $\Delta H$ equals the heat absorbed.`], answer: [0, 1, 2],
      sol: R`At constant $P$, $Q = \Delta U + P\Delta V = \Delta(U + PV) = \Delta H$. For an ideal gas $U(T)$ and $PV = nRT$, so $H = U + nRT$ depends on $T$ alone. In a free expansion $T$ is unchanged for an ideal gas, so $\Delta H = 0$. In a reversible isothermal expansion $\Delta H = 0$ too, but the gas absorbs $Q = nRT\ln(V_2/V_1) > 0$, so the last statement is false.`,
      trap: R`$Q = \Delta H$ needs constant pressure; an isothermal expansion is not at constant pressure.` },
    { id: 'fst-r4-06', type: 'mcq', level: 3, exams: A, sub: 'cycles',
      q: R`$n$ moles of an ideal gas go round a cycle drawn as a rectangle on a graph of temperature (vertical) against volume (horizontal), with sides at $V_1$, $V_2 > V_1$, $T_1$ and $T_2 > T_1$. The cycle runs heating at $V_1$, then expansion at $T_2$, cooling at $V_2$, compression at $T_1$. The net work done by the gas per cycle is`,
      options: [R`zero, because the rectangle encloses no area on a $P$-$V$ diagram`, R`$nR(T_2 + T_1)\ln(V_2/V_1)$`, R`$nR(T_2 - T_1)\ln(V_2/V_1)$`, R`$-nR(T_2 - T_1)\ln(V_2/V_1)$`], answer: 2,
      sol: R`The two constant-volume legs do no work. The isothermal expansion at $T_2$ gives $nRT_2\ln(V_2/V_1)$; the isothermal compression at $T_1$ takes back $nRT_1\ln(V_2/V_1)$. Net work by the gas: $nR(T_2 - T_1)\ln(V_2/V_1) > 0$, so the cycle runs as an engine (this is the Stirling cycle). On a $P$-$V$ diagram the two isotherms are different curves and do enclose an area.`,
      trap: R`A rectangle on a $T$-$V$ graph is not a rectangle on a $P$-$V$ graph; only the $P$-$V$ area is the work.` },
    { id: 'fst-r4-07', type: 'nat', level: 4, exams: A, sub: 'cycles',
      q: R`One mole of a rigid diatomic ideal gas at $300$ K is compressed reversibly and adiabatically to half its volume, cooled at constant volume back to $300$ K, then expanded reversibly and isothermally to its starting volume. Over the whole cycle, the net work done <b>on</b> the gas is ______ J ($R = 8.314$ J mol$^{-1}$ K$^{-1}$, $\gamma = 1.4$).`,
      answer: 263, tol: 3, calc: () => 2.5 * 8.314 * (300 * 2 ** 0.4 - 300) - 8.314 * 300 * Math.LN2,
      sol: R`Adiabatic compression: $T_2 = 300\times2^{0.4} = 395.9$ K, and the work done on the gas is $C_V\Delta T = 2.5\times8.314\times95.9 = 1992$ J. The cooling leg does no work. The isothermal expansion gives work done by the gas $RT\ln2 = 8.314\times300\times0.693 = 1729$ J. Net work on the gas $= 1992 - 1729 = 263$ J; over a cycle $\Delta U = 0$, so the gas gives out $263$ J more heat than it takes in. Run this way the cycle is a (poor) heat pump, not an engine.`,
      trap: R`Forgetting that the isothermal leg returns work to the surroundings leaves $1992$ J.` },
    { id: 'fst-r4-08', type: 'mcq', level: 3, exams: A, sub: 'heat and work',
      q: R`A rigid, thermally insulated tank holds a gas and an electric heating coil. A current runs through the coil for a while. Taking the gas <b>and</b> the coil together as the system,`,
      options: [R`$Q = 0$ and the system's internal energy rises by the electrical work done on it`, R`$Q > 0$, equal to the electrical energy, and $W = 0$`, R`$Q = 0$ and $W = 0$, so the internal energy is unchanged`, R`$Q > 0$ and $W > 0$, each equal to half the electrical energy`], answer: 0,
      sol: R`The boundary is insulated and drawn around the coil, so no heat crosses it: $Q = 0$. Electrical energy crosses the boundary as work (the battery pushes charge through it), so $\Delta U = W_{\rm elec}$. If instead only the gas were the system, energy would reach it from the hot coil as heat. Whether something counts as heat or work depends on where the boundary is drawn.`,
      trap: R`"Heater" suggests heat, but for a boundary drawn around the coil the energy enters as electrical work.` },
    { id: 'fst-r4-09', type: 'msq', level: 4, exams: A, sub: 'polytropic processes', format: 'statements',
      q: R`An ideal gas with ratio of heat capacities $\gamma$ follows $PV^n = $ constant, with molar heat capacity $C = C_V + \dfrac{R}{1 - n}$ for that process. Which statements are correct?`,
      options: [R`For $1 < n < \gamma$, the gas absorbs heat while it expands, even though its temperature falls.`, R`For $n < 0$ (pressure rising as volume grows), the heat capacity is larger than $C_V$.`, R`For $n > \gamma$, the gas absorbs heat while it expands.`, R`For $n = 0$, the heat capacity equals $C_P$.`], answer: [0, 1, 3],
      sol: R`For $1 < n < \gamma$, $R/(1 - n) < -C_V$, so $C < 0$; expansion with $n > 1$ cools the gas ($dT < 0$), and $dQ = C\,dT > 0$. For $n < 0$, $1 - n > 1$ and $R/(1 - n)$ is positive, so $C > C_V$. For $n > \gamma$, $C$ is positive while $dT < 0$ on expansion, so $dQ < 0$: heat leaves. For $n = 0$ (isobaric), $C = C_V + R = C_P$.`,
      trap: R`Working only from the sign of $dT$; heat follows $dQ = C\,dT$, and $C$ can be negative.` },
    { id: 'fst-r4-10', type: 'nat', level: 3, exams: A, sub: 'isothermal processes',
      q: R`An air bubble rises slowly from $10.0$ m deep in a lake to the surface, staying at the water's temperature throughout. At the surface its volume is $1.0$ cm$^3$. Take atmospheric pressure as $1.013\times10^5$ Pa, $\rho = 1000$ kg/m$^3$ and $g = 9.8$ m/s$^2$. The work done by the air in the bubble during the rise is ______ mJ.`,
      answer: 68.6, tol: 0.7, calc: () => 1.013e5 * 1e-6 * Math.log(1 + 1000 * 9.8 * 10 / 1.013e5) * 1e3,
      sol: R`At depth the pressure is $P_1 = 1.013\times10^5 + 1000\times9.8\times10 = 1.993\times10^5$ Pa. The expansion is isothermal, so $W = P_2V_2\ln(P_1/P_2) = 1.013\times10^5\times10^{-6}\times\ln1.967 = 0.1013\times0.677 = 0.0686$ J $= 68.6$ mJ. The bubble absorbs the same amount of heat from the water, since $\Delta U = 0$ for an ideal gas at constant temperature.`,
      trap: R`Using $P\Delta V$ at the surface pressure ($0.1013\times0.49$) gives $49.6$ mJ; the pressure changes all the way up.` },
  ],
  gens: [
    { id: 'fst-r4g1', type: 'nat', level: 5, exams: A, sub: 'general processes',
      make(r) {
        const [kind, cv] = choose(r, [['monatomic', 1.5], ['rigid diatomic', 2.5]]);
        const T1 = choose(r, [250, 300, 350, 400]), T2 = T1 + choose(r, [100, 200, 300]);
        const V1 = choose(r, [5, 8, 10, 12]), V2 = V1 + choose(r, [4, 6, 10, 15, 20]);
        const n = choose(r, [1, 2]), s = linVT(n, cv, T1, V1, T2, V2), Q = s.Q;
        return { q: `${n} mol of a ${kind} ideal gas goes along a path on which its volume is a linear function of its temperature, from $${T1}$ K and $${V1}$ L to $${T2}$ K and $${V2}$ L. The heat it absorbs is ______ J ($R = 8.314$ J mol$^{-1}$ K$^{-1}$).`,
          answer: Math.round(Q), tol: Math.max(2, Math.round(Q * 0.005)), n, cv, T1, V1, T2, V2,
          sol: `On the path $T = T_1 + (V - V_1)/\\beta$ with $\\beta = ${round((V2 - V1) / (T2 - T1), 4)}$ L/K. Then $W = nR\\big[(T_1 - V_1/\\beta)\\ln(V_2/V_1) + (V_2 - V_1)/\\beta\\big] = ${n}\\times8.314\\times\\big[${round(s.T0, 2)}\\ln${round(V2 / V1, 4)} + ${T2 - T1}\\big] = ${Math.round(s.W)}$ J. $\\Delta U = ${n}\\times${cv}R\\times${T2 - T1} = ${Math.round(s.dU)}$ J. $Q = \\Delta U + W = ${Math.round(Q)}$ J.`,
          trap: 'The pressure is not constant on this path (the line misses the origin of the $V$-$T$ plane), so $W \\neq nR\\Delta T$.' };
      },
      verify: (p) => linVT(p.n, p.cv, p.T1, p.V1, p.T2, p.V2).Q },
    { id: 'fst-r4g2', type: 'nat', level: 3, exams: A, sub: 'isothermal processes',
      make(r) {
        const h = choose(r, [5, 8, 10, 15, 20, 30]), V = choose(r, [0.5, 1, 2, 3, 5]);
        const P0 = 1.013e5, P1 = P0 + 1000 * 9.8 * h, W = P0 * V * 1e-6 * Math.log(P1 / P0) * 1e3;
        return { q: `An air bubble rises slowly from $${h}$ m deep in fresh water to the surface at constant temperature; at the surface its volume is $${V}$ cm$^3$. With atmospheric pressure $1.013\\times10^5$ Pa and $g = 9.8$ m/s$^2$, the work done by the air in the bubble is ______ mJ.`,
          answer: round(W, 2), tol: round(Math.max(0.01, W * 0.01), 2), h, V,
          sol: `$P_{\\rm bottom} = 1.013\\times10^5 + 9800\\times${h} = ${round(P1, 0)}$ Pa. Isothermal: $W = P_{\\rm top}V_{\\rm top}\\ln(P_{\\rm bottom}/P_{\\rm top}) = ${round(P0 * V * 1e-6, 4)}\\times\\ln${round(P1 / P0, 4)} = ${round(W, 2)}$ mJ.`,
          trap: 'The pressure falls all the way up, so the work is a logarithm, not the surface pressure times the volume change.' };
      },
      verify: (p) => 1.013e5 * p.V * 1e-6 * Math.log((1.013e5 + 9800 * p.h) / 1.013e5) * 1e3 },
    { id: 'fst-r4g3', type: 'mcq', level: 1, exams: A, sub: 'sign conventions',
      make(r) {
        const Q = int(r, 2, 9) * 100, W = int(r, 1, 8) * 50 + 25;
        const qIn = r() < 0.5, wOn = r() < 0.5;
        const dU = (qIn ? Q : -Q) + (wOn ? W : -W);
        const show = (v) => `$${v > 0 ? '+' : ''}${v}$ J`;
        const o = mcqOptions(r, dU, [(qIn ? Q : -Q) - (wOn ? W : -W), -dU, -(qIn ? Q : -Q) + (wOn ? W : -W), Q + W, -(Q + W), Q, W, -Q], show);
        return { q: `A gas ${qIn ? 'absorbs' : 'gives out'} $${Q}$ J of heat while ${wOn ? `$${W}$ J of work is done <b>on</b> it` : `it does $${W}$ J of work <b>on</b> its surroundings`}. The change in its internal energy is`, ...o,
          sol: `Count energy into the gas as positive: heat ${qIn ? `$+${Q}$` : `$-${Q}$`} J, work ${wOn ? `$+${W}$` : `$-${W}$`} J. $\\Delta U = ${dU}$ J.`,
          trap: 'Decide the sign of each energy transfer from its direction (into or out of the gas) before adding.' };
      } },
  ],
};
