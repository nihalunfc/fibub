import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const PI = Math.PI;
let k = 0; let c = 0;
const nid = () => `th-${String(++k).padStart(3, '0')}`;
const R = (x, dp) => +x.toFixed(dp);
const tl = (a) => +Math.max(Math.abs(a) * 0.01, 1e-9).toPrecision(1);
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) tol = +(0.6 * 10 ** -dp).toPrecision(1);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, Rr, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${Rr}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const stc = (level, sub, q, correct, wrongs, sol, o = {}) => { const it = mcq(level, sub, q, correct, wrongs, sol, o); it.format = 'statements'; return it; };
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  if (tol === 0 && !Number.isInteger(answer)) tol = +(0.6 * 10 ** -dp).toPrecision(1);
  return base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o });
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => { const it = mcq(level, sub, q, correct, wrongs, sol, o); it.format = 'passage'; it.group = group; return it; };
// Thermodynamics: Plus Two entrance bank (original fibub questions).
const RG = 8.31; // J mol^-1 K^-1

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'zeroth law', r`The zeroth law of thermodynamics says that if A and B are each in thermal equilibrium with C, then`, 'A and B are in thermal equilibrium with each other', ['A and B must be at different temperatures', 'heat flows from A to B', 'A, B and C have the same mass'],
    r`This transitive property is what lets us define temperature: bodies in thermal equilibrium share the same temperature.`),
  mcq(1, 'first law', r`For an ideal gas in an isothermal process, the change in internal energy is`, 'zero', ['equal to the heat absorbed', 'equal to the work done by the gas', 'always positive'],
    r`The internal energy of an ideal gas depends only on temperature. If $T$ is constant, $\Delta U = 0$, so $Q = W$.`),
  nat(1, 'first law', r`A gas absorbs 500 J of heat and does 200 J of work. Find the change in its internal energy (in J).`, () => 500 - 200, 0, 0,
    r`$Q = \Delta U + W$, so $\Delta U = 500 - 200 = 300$ J.`, { unit: 'J' }),
  mcq(1, 'adiabatic process', r`In an adiabatic process`, 'no heat enters or leaves the system', ['the temperature is constant', 'the volume is constant', 'the pressure is constant'],
    r`Adiabatic means $Q = 0$. The temperature usually changes: it falls on expansion and rises on compression.`),
  mcq(1, 'isochoric process', r`The work done by a gas in an isochoric (constant volume) process is`, 'zero', ['$nRT$', '$P\\Delta V$ with $\\Delta V\\neq0$', 'equal to the heat absorbed'],
    r`$W = \int P\,dV$ and $dV = 0$, so $W = 0$. All the heat goes into internal energy.`),
  nat(1, 'isobaric process', r`A gas expands by 2 litres at a constant pressure of $1.0\times10^5$ Pa. Find the work done by the gas (in J).`, () => 1e5 * 2e-3, 0, 0,
    r`$W = P\Delta V = 1.0\times10^5\times2\times10^{-3} = 200$ J. (2 L = $2\times10^{-3}\ \mathrm{m^3}$.)`, { unit: 'J' }),
  mcq(1, 'cyclic process', r`In one complete cycle of a heat engine, the change in internal energy of the working gas is`, 'zero', ['equal to the net work done', 'equal to the net heat absorbed', 'positive'],
    r`The gas returns to its initial state, and $U$ is a state function, so $\Delta U = 0$ and net $Q = $ net $W$.`),
  mcq(1, 'state functions', r`Which of the following is a state function?`, 'internal energy', ['heat', 'work', 'heat and work both'],
    r`Heat and work depend on the path. Internal energy depends only on the state of the gas.`),
  mcq(1, 'Carnot engine', r`The efficiency of a Carnot engine depends on`, 'the temperatures of the source and sink only', ['the working substance', 'the mass of the gas', 'the speed of the piston'],
    r`$\eta = 1 - T_2/T_1$ for any reversible engine working between these temperatures, whatever the working substance.`),
  nat(1, 'Carnot engine', r`A Carnot engine works between 600 K and 300 K. Find its efficiency as a percentage.`, () => (1 - 300 / 600) * 100, 0, 0,
    r`$\eta = 1 - T_2/T_1 = 1 - 300/600 = 0.5$, i.e. 50%.`, { unit: '%' }),
  mcq(1, 'refrigerator', r`The coefficient of performance of a refrigerator is`, 'heat removed from the cold space divided by the work done on it', ['work done divided by heat removed', 'heat rejected divided by heat removed', 'always less than 1'],
    r`$\mathrm{COP} = Q_2/W$. It can be greater than 1, since the work only moves heat.`),
  mcq(1, 'second law', r`According to the Kelvin-Planck statement, it is impossible to`, 'convert heat from a single reservoir completely into work in a cyclic process', ['convert work into heat', 'make a refrigerator', 'heat a gas at constant pressure'],
    r`Turning work into heat is easy (friction). The reverse, in a cycle, always rejects some heat to a colder body.`),
  nat(1, 'specific heats of gases', r`Find $\gamma = C_p/C_v$ for a monatomic ideal gas (2 decimals).`, () => 5 / 3, 0.01, 2,
    r`$C_v = \tfrac32R$ and $C_p = \tfrac52R$, so $\gamma = 5/3 = 1.67$.`, { unit: '' }),
  mcq(1, 'specific heats of gases', r`Mayer's relation for one mole of an ideal gas is`, r`$C_p - C_v = R$`, [r`$C_p + C_v = R$`, r`$C_p/C_v = R$`, r`$C_v - C_p = R$`],
    r`At constant pressure the extra heat $R\Delta T$ per mole does the expansion work $P\Delta V = R\Delta T$.`),
  mcq(1, 'heat engines', r`A heat engine that takes heat $Q_1$ from a source and rejects $Q_2$ to a sink has efficiency`, r`$1 - Q_2/Q_1$`, [r`$Q_2/Q_1$`, r`$Q_1/Q_2$`, r`$Q_1 - Q_2$`],
    r`Work $W = Q_1 - Q_2$, so $\eta = W/Q_1 = 1 - Q_2/Q_1$.`),
  mcq(1, 'PV curves', r`On a P-V diagram, at the same point the slope of an adiabatic curve compared to the isothermal curve is`, 'steeper', ['less steep', 'the same', 'opposite in sign'],
    r`Isothermal slope $= -P/V$; adiabatic slope $= -\gamma P/V$. Since $\gamma > 1$, the adiabat falls more steeply.`),

  // ---------- Level 2 ----------
  nat(2, 'first law', r`A gas receives 800 J of heat and its internal energy rises by 500 J. Find the work done by the gas (in J).`, () => 800 - 500, 0, 0,
    r`$W = Q - \Delta U = 800 - 500 = 300$ J, done by the gas.`, { unit: 'J' }),
  nat(2, 'isothermal process', r`One mole of an ideal gas at 300 K expands isothermally to twice its volume. Find the work done by it (in J, nearest whole number). $R = 8.31$ J mol$^{-1}$K$^{-1}$.`, () => 8.31 * 300 * Math.log(2), 3, 0,
    r`$W = nRT\ln(V_2/V_1) = 1\times8.31\times300\times\ln2 = 2493\times0.6931 = 1728$ J.`, { unit: 'J' }),
  nat(2, 'isobaric process', r`Two moles of an ideal gas are heated at constant pressure so that the temperature rises by 50 K. Find the work done by the gas (in J). $R = 8.31$.`, () => 2 * 8.31 * 50, 0.5, 0,
    r`$W = P\Delta V = nR\Delta T = 2\times8.31\times50 = 831$ J.`, { unit: 'J' }),
  nat(2, 'internal energy', r`Find the increase in internal energy (in J) of 1 mole of a monatomic ideal gas heated by 100 K. $R = 8.31$.`, () => 1.5 * 8.31 * 100, 1, 1,
    r`$\Delta U = nC_v\Delta T = 1\times\tfrac32\times8.31\times100 = 1246.5$ J. This holds for any process.`, { unit: 'J' }),
  nat(2, 'specific heats of gases', r`Find $C_p$ for a diatomic gas with rigid molecules (in J mol$^{-1}$K$^{-1}$, 1 decimal). $R = 8.31$.`, () => 3.5 * 8.31, 0.1, 1,
    r`A rigid diatomic molecule has 5 degrees of freedom: $C_v = \tfrac52R$, $C_p = C_v + R = \tfrac72R = 3.5\times8.31 = 29.1$.`, { unit: 'J/mol K' }),
  nat(2, 'isobaric process', r`How much heat (in J, 1 decimal) is needed to raise the temperature of 2 moles of a rigid diatomic gas by 20 K at constant pressure? $R = 8.31$.`, () => 2 * 3.5 * 8.31 * 20, 0.5, 1,
    r`$Q = nC_p\Delta T = 2\times\tfrac72\times8.31\times20 = 1163.4$ J.`, { unit: 'J' }),
  nat(2, 'adiabatic process', r`One mole of a monatomic ideal gas is compressed adiabatically and its temperature rises from 300 K to 400 K. Find the work done on the gas (in J, 1 decimal). $R = 8.31$.`, () => 1.5 * 8.31 * 100, 0.5, 1,
    r`Adiabatic: $Q = 0$, so work done on the gas $= \Delta U = nC_v\Delta T = 1\times1.5\times8.31\times100 = 1246.5$ J.`, { unit: 'J' }),
  nat(2, 'Carnot engine', r`A Carnot engine has source at 500 K and sink at 300 K. Find its efficiency (%).`, () => (1 - 300 / 500) * 100, 0, 0,
    r`$\eta = 1 - 300/500 = 0.4 = 40\%$.`, { unit: '%' }),
  nat(2, 'heat engines', r`An engine of efficiency 25% takes 2000 J of heat from the source in each cycle. Find the work done per cycle (in J).`, () => 0.25 * 2000, 0, 0,
    r`$W = \eta Q_1 = 0.25\times2000 = 500$ J. (It rejects the other 1500 J.)`, { unit: 'J' }),
  nat(2, 'refrigerator', r`An ideal refrigerator keeps its inside at 270 K in a room at 300 K. Find its coefficient of performance.`, () => 270 / (300 - 270), 0, 0,
    r`$\mathrm{COP} = \dfrac{T_2}{T_1 - T_2} = \dfrac{270}{30} = 9$.`, { unit: '' }),
  nat(2, 'heat engines', r`An engine absorbs 800 J of heat from a hot body and rejects 600 J to a cold body in each cycle. Find its efficiency (%).`, () => (1 - 600 / 800) * 100, 0, 0,
    r`$W = 800 - 600 = 200$ J. $\eta = 200/800 = 25\%$.`, { unit: '%' }),
  mcq(2, 'adiabatic process', r`For an adiabatic change of an ideal gas with $\gamma = C_p/C_v$, which relation is correct?`, r`$PV^\gamma = $ constant`, [r`$PV = $ constant`, r`$P^\gamma V = $ constant`, r`$P/V^\gamma = $ constant`],
    r`Combining $dU = -P\,dV$ with $PV = nRT$ gives $PV^\gamma = $ constant. $PV = $ constant is the isothermal law.`),
  nat(2, 'adiabatic process', r`A diatomic gas ($\gamma = 1.4$) at 1.00 atm is compressed adiabatically to half its volume. Find the final pressure (in atm, 2 decimals).`, () => 2 ** 1.4, 0.03, 2,
    r`$P_1V_1^\gamma = P_2V_2^\gamma$, so $P_2 = P_1(V_1/V_2)^{1.4} = 1\times2^{1.4} = 2.64$ atm. (An isothermal compression would give only 2 atm.)`, { unit: 'atm' }),
  nat(2, 'adiabatic process', r`A monatomic gas at 300 K is compressed adiabatically to half its volume. Find its final temperature (in K, 1 decimal).`, () => 300 * 2 ** (2 / 3), 0.6, 1,
    r`$TV^{\gamma - 1} = $ constant with $\gamma - 1 = 2/3$. $T_2 = 300\times2^{2/3} = 300\times1.5874 = 476.2$ K.`, { unit: 'K' }),
  mcq(2, 'cyclic process', r`On a P-V diagram a cyclic process is traversed clockwise. The net work done by the gas in the cycle is`, 'positive, equal to the area enclosed', ['zero', 'negative, equal to the area enclosed', 'equal to the net heat rejected'],
    r`On the upper path (expansion at higher pressure) the gas does more work than is done on it in the lower path (compression). So net work is positive. Anticlockwise gives negative work.`),
  nat(2, 'work from P-V graph', r`A gas goes from $(P, V) = (1\times10^5\ \mathrm{Pa}, 2\ \mathrm{L})$ to $(3\times10^5\ \mathrm{Pa}, 4\ \mathrm{L})$ along a straight line on the P-V diagram. Find the work done by the gas (in J).`, () => 0.5 * (1e5 + 3e5) * 2e-3, 0, 0,
    r`Work is the area under the line: trapezium with mean pressure $\tfrac12(1 + 3)\times10^5 = 2\times10^5$ Pa and $\Delta V = 2\times10^{-3}\ \mathrm{m^3}$. $W = 2\times10^5\times2\times10^{-3} = 400$ J.`, { unit: 'J' }),
  mcq(2, 'PV curves', r`The curve with slope $-P/V$ on a P-V diagram is`, 'an isotherm', ['an adiabat', 'an isobar', 'an isochore'],
    r`For $PV = $ constant, $P\,dV + V\,dP = 0$, so $dP/dV = -P/V$. For an adiabat the slope is $-\gamma P/V$.`),
  nat(2, 'isochoric process', r`One mole of a monatomic ideal gas at 300 K is heated at constant volume until its pressure doubles. How much heat (in J, 1 decimal) is absorbed? $R = 8.31$.`, () => 1.5 * 8.31 * 300, 0.5, 1,
    r`At constant volume $P\propto T$, so $T_2 = 600$ K. $Q = nC_v\Delta T = 1\times1.5\times8.31\times300 = 3739.5$ J.`, { unit: 'J' }),
  nat(2, 'refrigerator', r`A refrigerator takes 600 J of heat from the cold space using 150 J of work in each cycle. Find the heat (in J) rejected to the room per cycle.`, () => 600 + 150, 0, 0,
    r`Heat rejected $= Q_2 + W = 600 + 150 = 750$ J. (COP $= 600/150 = 4$.)`, { unit: 'J' }),
  nat(2, 'Carnot engine', r`A Carnot engine works between 400 K and 300 K. By how many percentage points does the efficiency rise if the sink is cooled to 250 K?`, () => (1 - 250 / 400) * 100 - (1 - 300 / 400) * 100, 0, 1,
    r`Before: $1 - 300/400 = 25\%$. After: $1 - 250/400 = 37.5\%$. Increase $= 12.5$ percentage points.`, { unit: '%' }),
  mcq(2, 'internal energy', r`The internal energy of an ideal gas depends on`, 'temperature only', ['pressure only', 'volume only', 'pressure and volume only'],
    r`There are no intermolecular forces, so there is no potential energy. $U$ is the total kinetic energy, a function of $T$ alone.`),
  nat(2, 'specific heats of gases', r`The molar heat capacities of a gas are $C_p = 29.1$ and $C_v = 20.8\ \mathrm{J\,mol^{-1}K^{-1}}$. Find $\gamma$ (2 decimals).`, () => 29.1 / 20.8, 0.01, 2,
    r`$\gamma = C_p/C_v = 29.1/20.8 = 1.40$, so the gas is diatomic.`, { unit: '' }),
  nat(2, 'isobaric process', r`A gas at 2.0 atm expands from 2 L to 5 L at constant pressure. Find the work done by the gas (in J, nearest whole number). 1 atm $= 1.013\times10^5$ Pa.`, () => 2 * 1.013e5 * 3e-3, 2, 0,
    r`$W = P\Delta V = 2\times1.013\times10^5\times3\times10^{-3} = 607.8$ J, about 608 J.`, { unit: 'J' }),
  mcq(2, 'first law', r`In the first law $Q = \Delta U + W$ (with $W$ the work done by the gas), the heat $Q$ is taken as positive when`, 'heat is added to the gas', ['heat is removed from the gas', 'the gas does work', 'the temperature rises'],
    r`$Q > 0$: heat into the system. $W > 0$: the system does work on the surroundings. A temperature rise comes from $\Delta U$, not directly from the sign of $Q$.`),
  nat(2, 'heat pump', r`A Carnot refrigerator has COP 5. If run in reverse as a heat pump between the same temperatures, what is its coefficient of performance (heat delivered to the hot side per unit work)?`, () => 5 + 1, 0, 0,
    r`Heat delivered $= Q_2 + W$, so $\mathrm{COP_{pump}} = (Q_2 + W)/W = \mathrm{COP_{fridge}} + 1 = 6$.`, { unit: '' }),
  mcq(2, 'free expansion', r`An ideal gas expands freely into a vacuum inside an insulated container. Its temperature`, 'stays the same', ['falls', 'rises', 'falls and then rises'],
    r`No work is done (against vacuum) and no heat flows, so $\Delta U = 0$. For an ideal gas $U$ depends on $T$ only, so $T$ is unchanged.`),
  nat(2, 'phase change', r`10 g of ice melts at $0\,^\circ$C. Ignoring the small change in volume, find the change in internal energy (in J). ($L_f = 336\ \mathrm{J\,g^{-1}}$)`, () => 10 * 336, 0, 0,
    r`Work done against the atmosphere is negligible, so $\Delta U\approx Q = mL_f = 10\times336 = 3360$ J.`, { unit: 'J' }),
  nat(2, 'work from P-V graph', r`In a cyclic process the gas follows a rectangle on the P-V diagram, clockwise, between $P = 1\times10^5$ and $3\times10^5$ Pa and between $V = 2$ L and 5 L. Find the net work done by the gas per cycle (in J).`, () => 2e5 * 3e-3, 0, 0,
    r`The net work is the area of the rectangle: $(3 - 1)\times10^5\times(5 - 2)\times10^{-3} = 2\times10^5\times3\times10^{-3} = 600$ J.`, { unit: 'J' }),
];

items.push(
  // ---------- Level 3 ----------
  nat(3, 'polytropic process', r`For a polytropic process $PV^n = $ constant, the molar heat capacity is $C = C_v + \dfrac{R}{1 - n}$. Find $C$ (in J mol$^{-1}$K$^{-1}$, 2 decimals) for a monatomic gas with $n = 2$. $R = 8.31$.`, () => 1.5 * 8.31 + 8.31 / (1 - 2), 0.02, 3,
    r`$C = \tfrac32R + \dfrac{R}{1 - 2} = \tfrac32R - R = \tfrac12R = 4.155\ \mathrm{J\,mol^{-1}K^{-1}}$.`, { unit: 'J/mol K' }),
  nat(3, 'mixture of gases', r`One mole of a monatomic gas is mixed with one mole of a rigid diatomic gas. Find $\gamma$ of the mixture (2 decimals).`, () => (2.5 + 3.5) / (1.5 + 2.5), 0.01, 2,
    r`$C_v = \dfrac{n_1C_{v1} + n_2C_{v2}}{n_1 + n_2}$: total $C_v$ per two moles $= 1.5R + 2.5R = 4R$, total $C_p = 2.5R + 3.5R = 6R$. $\gamma = 6R/4R = 1.50$.`, { unit: '', trap: 'Add the heat capacities, not the values of $\\gamma$.' }),
  nat(3, 'mixture of gases', r`A mixture has 2 moles of helium and 3 moles of rigid diatomic hydrogen. Find $\gamma$ of the mixture (3 decimals).`, () => (2 * 2.5 + 3 * 3.5) / (2 * 1.5 + 3 * 2.5), 0.005, 3,
    r`$C_p$ total $= (2\times\tfrac52 + 3\times\tfrac72)R = 15.5R$. $C_v$ total $= (2\times\tfrac32 + 3\times\tfrac52)R = 10.5R$. $\gamma = 15.5/10.5 = 1.476$.`, { unit: '' }),
  nat(3, 'adiabatic process', r`A monatomic ideal gas expands adiabatically to 8 times its volume. By what factor does the pressure fall ($P_1/P_2$)?`, () => 8 ** (5 / 3), 0, 0,
    r`$P_1V_1^{5/3} = P_2V_2^{5/3}$, so $P_1/P_2 = 8^{5/3} = (2^3)^{5/3} = 2^5 = 32$.`, { unit: '' }),
  mcq(3, 'isothermal and adiabatic', r`An ideal gas expands from the same initial state to the same final volume, once isothermally and once adiabatically. The work done by the gas is`, 'greater in the isothermal expansion', ['greater in the adiabatic expansion', 'the same in both', 'zero in the adiabatic expansion'],
    r`In the isothermal expansion, heat flows in to hold $T$ constant, so the pressure falls slowly. In the adiabatic expansion the gas cools and its pressure falls faster, so the area under the curve is smaller.`),
  nat(3, 'Otto cycle', r`An ideal Otto engine has compression ratio 8 and $\gamma = 1.4$. Find its efficiency (%, 1 decimal).`, () => (1 - 8 ** -0.4) * 100, 0.1, 1,
    r`$\eta = 1 - \dfrac{1}{r^{\gamma - 1}} = 1 - 8^{-0.4} = 1 - 0.4353 = 0.5647$, i.e. 56.5%.`, { unit: '%' }),
  nat(3, 'Carnot engine', r`The efficiency of a Carnot engine is 20%. When the source temperature is raised by 100 K, the efficiency becomes 40%. Find the sink temperature (in K).`, () => 240, 0, 0,
    r`Sink $T_2 = 0.8T_1$ and $T_2 = 0.6(T_1 + 100)$. Equate: $0.8T_1 = 0.6T_1 + 60$, so $T_1 = 300$ K and $T_2 = 0.8\times300 = 240$ K.`, { unit: 'K' }),
  nat(3, 'refrigerator', r`A refrigerator with COP 5 removes 500 J of heat from its inside every second. Find the electrical power it needs (in W).`, () => 500 / 5, 0, 0,
    r`$\mathrm{COP} = Q_2/W$, so $W = 500/5 = 100$ J every second, which is 100 W.`, { unit: 'W' }),
  nat(3, 'entropy', r`100 g of ice melts at $0\,^\circ$C (273 K). Find the entropy change of the ice-water system (in J K$^{-1}$, 1 decimal). $L_f = 336\ \mathrm{J\,g^{-1}}$.`, () => 100 * 336 / 273, 0.5, 1,
    r`The melting is reversible at constant $T$. $\Delta S = Q/T = 100\times336/273 = 123.1\ \mathrm{J\,K^{-1}}$.`, { unit: 'J/K' }),
  nat(3, 'work from P-V graph', r`A gas goes along a straight line from $(2\times10^{-3}\ \mathrm{m^3}, 1\times10^5\ \mathrm{Pa})$ to $(6\times10^{-3}\ \mathrm{m^3}, 3\times10^5\ \mathrm{Pa})$. Find the work done by the gas (in J).`, () => 0.5 * (1e5 + 3e5) * 4e-3, 0, 0,
    r`$W = $ area under the line $= \tfrac12(P_1 + P_2)\Delta V = \tfrac12\times4\times10^5\times4\times10^{-3} = 800$ J.`, { unit: 'J' }),
  nat(3, 'process P proportional to V', r`One mole of a monatomic ideal gas undergoes a process in which $P\propto V$. Find its molar heat capacity (in J mol$^{-1}$K$^{-1}$, 2 decimals). $R = 8.31$.`, () => 2 * 8.31, 0.02, 2,
    r`$P\propto V$ is $PV^{-1} = $ constant, so $n = -1$. $C = C_v + \dfrac{R}{1 - n} = 1.5R + \dfrac R2 = 2R = 16.62$. (Check: $W = \tfrac12R\Delta T$, $\Delta U = 1.5R\Delta T$, $Q = 2R\Delta T$.)`, { unit: 'J/mol K' }),
  nat(3, 'degrees of freedom', r`A gas with 7 degrees of freedom per molecule (a diatomic with vibration active) has $\gamma = 1 + 2/f$. Find $\gamma$ (3 decimals).`, () => 1 + 2 / 7, 0.002, 3,
    r`$C_v = \tfrac f2R$, $C_p = (\tfrac f2 + 1)R$, so $\gamma = 1 + 2/f = 1 + 2/7 = 1.286$.`, { unit: '' }),
  nat(3, 'isobaric process', r`A rigid diatomic gas is heated at constant pressure. What fraction (3 decimals) of the heat supplied is converted into work?`, () => 1 / 3.5, 0.002, 3,
    r`$Q = nC_p\Delta T = \tfrac72nR\Delta T$ and $W = nR\Delta T$. $W/Q = 1/3.5 = 2/7 = 0.286$.`, { unit: '' }),
  nat(3, 'adiabatic process', r`A monatomic gas at $P_1 = 4\times10^5$ Pa and $V_1 = 1$ L expands adiabatically to 8 L. Find the work done by the gas (in J). ($P_2 = P_1/32$)`, () => (4e5 * 1e-3 - 4e5 / 32 * 8e-3) / (2 / 3), 0.5, 0,
    r`$P_2 = 4\times10^5/32 = 1.25\times10^4$ Pa. $W = \dfrac{P_1V_1 - P_2V_2}{\gamma - 1} = \dfrac{400 - 100}{2/3} = 450$ J.`, { unit: 'J' }),
  nat(3, 'adiabatic process', r`Air in a diesel engine cylinder at 300 K is compressed adiabatically to $1/10$ of its volume ($\gamma = 1.4$). Find the final temperature (in K, nearest whole number).`, () => 300 * 10 ** 0.4, 3, 0,
    r`$T_2 = T_1(V_1/V_2)^{\gamma - 1} = 300\times10^{0.4} = 300\times2.512 = 754$ K. This is hot enough to ignite the injected fuel.`, { unit: 'K' }),
  nat(3, 'bulk modulus of a gas', r`Find the adiabatic bulk modulus of air at a pressure of $1.0\times10^5$ Pa ($\gamma = 1.4$), in kPa.`, () => 1.4e5 / 1e3, 0, 0,
    r`$B = -V\dfrac{dP}{dV}$. For an adiabatic change $PV^\gamma = $ const gives $B = \gamma P = 1.4\times10^5$ Pa $= 140$ kPa. (Isothermal: $B = P = 100$ kPa.)`, { unit: 'kPa', sub: 'mixed' }),
  nat(3, 'Carnot cycle on T-S diagram', r`A Carnot cycle on a T-S diagram is a rectangle between $T = 300$ K and $500$ K, and between $S = 2$ and $6\ \mathrm{J\,K^{-1}}$. Find the work done per cycle (in J).`, () => (500 - 300) * (6 - 2), 0, 0,
    r`On a T-S diagram, area $= \oint T\,dS = $ net heat $=$ net work. $W = (500 - 300)\times(6 - 2) = 800$ J. (Also $Q_1 = 500\times4 = 2000$ J and $\eta = 800/2000 = 40\%$.)`, { unit: 'J' }),
  nat(3, 'isothermal process', r`Two moles of an ideal gas at 400 K expand isothermally to three times their volume. Find the heat absorbed (in J, nearest whole number). $R = 8.31$.`, () => 2 * 8.31 * 400 * Math.log(3), 5, 0,
    r`$\Delta U = 0$, so $Q = W = nRT\ln(V_2/V_1) = 2\times8.31\times400\times\ln3 = 6648\times1.0986 = 7304$ J.`, { unit: 'J' }),
  nat(3, 'entropy', r`Find the entropy increase (in J K$^{-1}$, 2 decimals) of 1 mole of an ideal gas that expands freely (and irreversibly) to double its volume. $R = 8.31$.`, () => 8.31 * Math.log(2), 0.03, 2,
    r`Entropy is a state function, so use a reversible isothermal path between the same states: $\Delta S = nR\ln(V_2/V_1) = 8.31\times0.6931 = 5.76\ \mathrm{J\,K^{-1}}$. The surroundings do not change in free expansion, so the total entropy rises by this much.`, { unit: 'J/K', trap: 'The actual process has $Q = 0$, but $\\Delta S$ uses a reversible path.' }),
  nat(3, 'work from P-V graph', r`A gas goes round a right-angled triangle on the P-V diagram: $A(1\times10^5\ \mathrm{Pa}, 1\ \mathrm{L})\to B(3\times10^5, 1\ \mathrm{L})\to C(1\times10^5, 4\ \mathrm{L})\to A$. Find the net work done by the gas per cycle (in J).`, () => 0.5 * 2e5 * 3e-3, 0, 0,
    r`Area of the triangle $=\tfrac12\times\text{base}\times\text{height} = \tfrac12\times(4 - 1)\times10^{-3}\times(3 - 1)\times10^5 = 300$ J. The path $A\to B\to C\to A$ runs clockwise, so the work is positive.`, { unit: 'J', trap: 'Check the direction: clockwise gives $+$.' }),
  nat(3, 'speed of sound', r`Find the speed of sound in air at 300 K (in $\mathrm{m\,s^{-1}}$, nearest whole number) using $v = \sqrt{\gamma RT/M}$ with $\gamma = 1.4$, $M = 0.029\ \mathrm{kg\,mol^{-1}}$, $R = 8.31$.`, () => Math.sqrt(1.4 * 8.31 * 300 / 0.029), 2, 0,
    r`$v = \sqrt{\dfrac{1.4\times8.31\times300}{0.029}} = \sqrt{1.2035\times10^5} = 347\ \mathrm{m\,s^{-1}}$. The adiabatic $\gamma$ is used because the compressions in a sound wave are too quick for heat to flow.`, { unit: 'm/s', sub: 'mixed' }),
  nat(3, 'phase change', r`When 1 g of water at $100\,^\circ$C boils to steam at 1 atm, its volume goes from $1\ \mathrm{cm^3}$ to $1671\ \mathrm{cm^3}$. The heat absorbed is 2256 J. Find the increase in internal energy (in J, nearest whole number). 1 atm $= 1.013\times10^5$ Pa.`, () => 2256 - 1.013e5 * 1670e-6, 2, 0,
    r`Work done against the atmosphere $= P\Delta V = 1.013\times10^5\times1670\times10^{-6} = 169$ J. $\Delta U = Q - W = 2256 - 169 = 2087$ J.`, { unit: 'J' }),
  nat(3, 'degrees of freedom', r`Two moles of a rigid diatomic gas are heated by 40 K in a rigid container. Find the increase in internal energy (in J, nearest whole number). $R = 8.31$.`, () => 2.5 * 2 * 8.31 * 40, 2, 0,
    r`$\Delta U = \dfrac f2nR\Delta T = 2.5\times2\times8.31\times40 = 1662$ J.`, { unit: 'J' }),
  nat(3, 'isothermal process', r`Two moles of an ideal gas at 300 K are compressed isothermally until the pressure becomes 3 times the initial pressure. Find the work done ON the gas (in J, nearest whole number). $R = 8.31$.`, () => 2 * 8.31 * 300 * Math.log(3), 5, 0,
    r`$W_{on} = nRT\ln(P_2/P_1) = 2\times8.31\times300\times\ln3 = 4986\times1.0986 = 5478$ J. The gas also gives out 5478 J of heat to the surroundings.`, { unit: 'J' }),
  nat(3, 'heat engines', r`A 10 kW engine has efficiency 30%. Find the rate at which it rejects heat (in kW, 1 decimal).`, () => 10 * (1 / 0.3 - 1), 0.1, 1,
    r`$P_{out} = \eta Q_1$ so $Q_1 = 10/0.3 = 33.3$ kW. Rejected $= 33.3 - 10 = 23.3$ kW.`, { unit: 'kW' }),
  nat(3, 'Carnot engine', r`A real engine works between 800 K and 300 K and achieves 70% of the Carnot efficiency. Find its efficiency (%, 2 decimals).`, () => 0.7 * (1 - 300 / 800) * 100, 0.05, 2,
    r`Carnot: $1 - 300/800 = 0.625$. Real: $0.7\times62.5\% = 43.75\%$.`, { unit: '%' }),
  mcq(3, 'second law', r`An inventor claims an engine that takes 1000 J from a source at 500 K, rejects 400 J to a sink at 300 K and delivers 600 J of work. This engine is`, 'impossible, since its efficiency of 60% exceeds the Carnot limit of 40%', ['possible, since energy is conserved', 'possible only if it is irreversible', 'impossible, because it rejects any heat at all'],
    r`Energy is conserved ($1000 = 600 + 400$), but the efficiency $600/1000 = 60\%$ is above the maximum $1 - 300/500 = 40\%$. No engine between these temperatures can do this.`),
  mcq(3, 'first law', r`For which process is the heat absorbed equal to the change in internal energy of an ideal gas?`, 'isochoric', ['isothermal', 'isobaric', 'adiabatic'],
    r`$Q = \Delta U + W$ and $W = P\,dV = 0$ at constant volume.`),
  mcq(3, 'cyclic process', r`For a gas taken round a complete cycle, the net heat absorbed $Q_{net}$ and net work $W_{net}$ satisfy`, r`$Q_{net} = W_{net}$`, [r`$Q_{net} = 0$`, r`$W_{net} = 0$`, r`$Q_{net} = -W_{net}$`],
    r`$\Delta U = 0$ over a cycle, so $Q_{net} - W_{net} = 0$.`),
  nat(3, 'isochoric process', r`A fixed mass of ideal gas in a rigid vessel is heated from 300 K to 450 K. If the initial pressure was $2\times10^5$ Pa, find the final pressure (in Pa).`, () => 2e5 * 450 / 300, 100, 0,
    r`At constant volume $P/T$ is constant: $P_2 = P_1\times450/300 = 3\times10^5$ Pa.`, { unit: 'Pa' }),
);

items.push(
  // ---------- Level 4 ----------
  nat(4, 'cyclic process', r`One mole of a monatomic ideal gas goes round the rectangle $A(P_0, V_0)\to B(2P_0, V_0)\to C(2P_0, 2V_0)\to D(P_0, 2V_0)\to A$. Find the efficiency of this "engine" (%, 1 decimal).`, () => 1 / (1.5 + 5) * 100, 0.1, 1,
    r`Net work $= P_0V_0$ (area). Heat is absorbed on $A\to B$ (isochoric, pressure up): $\tfrac32(2P_0V_0 - P_0V_0) = 1.5P_0V_0$. Also on $B\to C$ (isobaric expansion): $\tfrac52\times2P_0(2V_0 - V_0) = 5P_0V_0$. The other two legs release heat. $Q_{in} = 6.5P_0V_0$. $\eta = 1/6.5 = 15.4\%$.`, { unit: '%', trap: 'Only the legs where heat enters count in the denominator.' }),
  nat(4, 'cyclic process', r`Repeat the cycle $A(P_0, V_0)\to B(2P_0, V_0)\to C(2P_0, 2V_0)\to D(P_0, 2V_0)\to A$ for a rigid diatomic gas. Find the efficiency (%, 1 decimal).`, () => 1 / (2.5 + 7) * 100, 0.1, 1,
    r`$Q_{AB} = \tfrac52P_0V_0$ and $Q_{BC} = \tfrac72\times2P_0V_0 = 7P_0V_0$. $Q_{in} = 9.5P_0V_0$ and $W = P_0V_0$, so $\eta = 1/9.5 = 10.5\%$. A gas with more degrees of freedom needs more heat per unit work.`, { unit: '%' }),
  nat(4, 'polytropic process', r`A rigid diatomic gas undergoes a process $PV^{1.2} = $ constant. Find its molar heat capacity in units of $R$ (decimal). Use $C = C_v + R/(1 - n)$.`, () => 2.5 + 1 / (1 - 1.2), 0.01, 2,
    r`$C = \tfrac52R + \dfrac{R}{1 - 1.2} = 2.5R - 5R = -2.5R$. The heat capacity is negative: the gas absorbs heat while its temperature falls on expansion.`, { unit: 'R', trap: 'A negative $C$ is allowed for $1 < n < \\gamma$.' }),
  nat(4, 'polytropic process', r`A gas initially at $P_1V_1 = 800$ J expands polytropically with $PV^{1.5} = $ constant to double its volume. Find the work done by the gas (in J, 1 decimal).`, () => (800 - 800 / 2 ** 0.5) / 0.5, 0.5, 1,
    r`$P_2V_2 = P_1V_1(V_1/V_2)^{n - 1} = 800\times2^{-0.5} = 565.7$ J. $W = \dfrac{P_1V_1 - P_2V_2}{n - 1} = \dfrac{800 - 565.7}{0.5} = 468.6$ J.`, { unit: 'J' }),
  nat(4, 'heat engines and refrigerators', r`A Carnot engine working between 600 K and 300 K drives a Carnot refrigerator working between 300 K (hot) and 270 K (cold). Find the heat extracted from the cold space by the refrigerator per unit heat taken by the engine from the 600 K source.`, () => 0.5 * 270 / 30, 0.02, 2,
    r`Engine: $W = \eta Q_1 = 0.5Q_1$. Refrigerator: $\mathrm{COP} = 270/(300 - 270) = 9$, so heat extracted $= 9W = 4.5Q_1$.`, { unit: '' }),
  nat(4, 'refrigerator', r`An ideal refrigerator (COP 5) turns 1 kg of water at $20\,^\circ$C into ice at $0\,^\circ$C. ($c_w = 4200$, $L_f = 3.36\times10^5$ J kg$^{-1}$.) How long does it take if its motor delivers 400 W of work (in s, nearest whole number)?`, () => (4200 * 20 + 3.36e5) / 5 / 400, 2, 0,
    r`Heat to remove $= 4200\times20 + 3.36\times10^5 = 4.2\times10^5$ J. Work $= Q_2/\mathrm{COP} = 4.2\times10^5/5 = 8.4\times10^4$ J. $t = 8.4\times10^4/400 = 210$ s.`, { unit: 's' }),
  nat(4, 'mixing of gases', r`A thermally insulated vessel is divided by a partition. One side holds 1 mol of helium at 300 K and the other 1 mol of rigid diatomic hydrogen at 400 K. The partition is removed. Find the final temperature (in K, 1 decimal).`, () => (1.5 * 300 + 2.5 * 400) / 4, 0.2, 1,
    r`No heat or work leaves the system, so the total internal energy is conserved: $1.5R\times300 + 2.5R\times400 = (1.5R + 2.5R)T$. $T = \dfrac{450 + 1000}{4} = 362.5$ K.`, { unit: 'K' }),
  nat(4, 'entropy', r`1 kg of water is heated from 300 K to 350 K. Find its entropy increase (in J K$^{-1}$, nearest whole number). $c = 4200\ \mathrm{J\,kg^{-1}K^{-1}}$.`, () => 4200 * Math.log(350 / 300), 2, 0,
    r`$\Delta S = \int\dfrac{mc\,dT}{T} = mc\ln\dfrac{T_2}{T_1} = 4200\times\ln(1.1667) = 4200\times0.15415 = 647$ J K$^{-1}$.`, { unit: 'J/K' }),
  nat(4, 'entropy', r`600 J of heat flows by conduction from a body at 400 K to a body at 300 K, both so large that their temperatures do not change. Find the net entropy change of the universe (in J K$^{-1}$, 2 decimals).`, () => 600 / 300 - 600 / 400, 0.01, 2,
    r`Hot body: $-600/400 = -1.5$. Cold body: $+600/300 = +2.0$. Net $= +0.50\ \mathrm{J\,K^{-1}}$. It is positive, as it must be for a spontaneous process.`, { unit: 'J/K' }),
  nat(4, 'process P proportional to V', r`One mole of a monatomic gas follows a process with $P = aV$ ($a$ constant). What fraction (decimal) of the heat absorbed is used in doing work?`, () => 0.5 / 2, 0.01, 2,
    r`$W = \int aV\,dV = \tfrac12a(V_2^2 - V_1^2) = \tfrac12R\Delta T$. $\Delta U = 1.5R\Delta T$. $Q = 2R\Delta T$. $W/Q = 0.5/2 = 0.25$.`, { unit: '' }),
  nat(4, 'general processes', r`One mole of an ideal gas undergoes a process in which $V\propto T^2$. Find the work done by the gas (in J) when its temperature rises by 50 K. $R = 8.31$.`, () => 2 * 8.31 * 50, 0.5, 0,
    r`$P = RT/V$ and $V = cT^2$ give $dV = 2cT\,dT$. $P\,dV = \dfrac{RT}{cT^2}\,2cT\,dT = 2R\,dT$. $W = 2R\Delta T = 2\times8.31\times50 = 831$ J.`, { unit: 'J' }),
  nat(4, 'Otto cycle', r`1 mol of air ($C_v = 2.5R$, $\gamma = 1.4$) in an ideal Otto cycle starts at 300 K with compression ratio 8. Heat is added at constant volume until the peak temperature is 1800 K. Find the net work per cycle (in J, nearest 10 J). $R = 8.31$.`, () => 2.5 * 8.31 * (1800 - 300 * 8 ** 0.4) * (1 - 8 ** -0.4), 30, 0,
    r`After compression $T_2 = 300\times8^{0.4} = 689.2$ K. $Q_{in} = C_v(T_3 - T_2) = 2.5\times8.31\times(1800 - 689.2) = 23076$ J. $\eta = 1 - 8^{-0.4} = 0.5647$. $W = \eta Q_{in} = 13032$ J.`, { unit: 'J' }),
  nat(4, 'Carnot engine', r`A Carnot engine uses 1 mole of an ideal gas. Its isothermal expansion at 500 K takes the gas to twice its volume, and the sink is at 300 K. Find the work done per cycle (in J, nearest whole number). $R = 8.31$.`, () => 0.4 * 8.31 * 500 * Math.log(2), 3, 0,
    r`$Q_1 = RT_1\ln2 = 8.31\times500\times0.6931 = 2880$ J. $\eta = 1 - 300/500 = 0.4$. $W = 0.4\times2880 = 1152$ J.`, { unit: 'J' }),
  nat(4, 'Carnot cycle', r`In a Carnot cycle on a monatomic ideal gas, the adiabatic expansion takes the volume from $V_2$ to $V_3 = 8V_2$. Find the efficiency (%).`, () => (1 - 1 / 8 ** (2 / 3)) * 100, 0.2, 1,
    r`During the adiabatic expansion $T_1V_2^{2/3} = T_2V_3^{2/3}$, so $T_2/T_1 = (V_2/V_3)^{2/3} = 8^{-2/3} = 1/4$. $\eta = 1 - 1/4 = 75\%$.`, { unit: '%' }),
  nat(4, 'Brayton cycle', r`An ideal gas turbine (Brayton cycle: two adiabats and two isobars) uses air with $\gamma = 1.4$ and a pressure ratio of 10. Find its efficiency (%, 1 decimal). Use $\eta = 1 - r_p^{-(\gamma - 1)/\gamma}$.`, () => (1 - 10 ** (-0.4 / 1.4)) * 100, 0.2, 1,
    r`$\eta = 1 - 10^{-0.4/1.4} = 1 - 10^{-0.2857} = 1 - 0.5179 = 0.482$, i.e. 48.2%.`, { unit: '%' }),
  nat(4, 'isothermal and adiabatic', r`A monatomic ideal gas at the same initial state expands to twice its volume, once isothermally and once adiabatically. Find $W_{iso}/W_{adi}$ (2 decimals).`, () => Math.log(2) / (1.5 * (1 - 2 ** (-2 / 3))), 0.02, 2,
    r`Isothermal: $W = RT\ln2 = 0.6931RT$. Adiabatic: $W = C_v(T_1 - T_2) = 1.5RT(1 - 2^{-2/3}) = 1.5RT\times0.3700 = 0.5551RT$. Ratio $= 1.25$.`, { unit: '' }),
  nat(4, 'piston and weight', r`0.10 mol of a monatomic gas is in a vertical cylinder of cross-section $100\ \mathrm{cm^2}$ closed by a freely sliding 10 kg piston, with atmospheric pressure $1.0\times10^5$ Pa above it. The gas is heated slowly by 100 K. Find how far the piston rises (in cm, 2 decimals). ($g = 9.8$, $R = 8.31$)`, () => 0.1 * 8.31 * 100 / ((1e5 + 10 * 9.8 / 0.01) * 0.01) * 100, 0.1, 2,
    r`The pressure stays constant at $P = P_0 + mg/A$. Here $mg/A = 98/0.01 = 9800$ Pa, so $P = 1.098\times10^5$ Pa. $\Delta V = nR\Delta T/P = 0.1\times8.31\times100/1.098\times10^5 = 7.568\times10^{-4}\ \mathrm{m^3}$. $\Delta h = \Delta V/A = 7.568\times10^{-4}/10^{-2} = 0.0757$ m $= 7.57$ cm.`, { unit: 'cm', sub: 'mixed' }),
  nat(4, 'adiabatic process', r`The temperature of a monatomic gas rises from 300 K to 600 K by adiabatic compression. By what factor does the pressure rise?`, () => 2 ** 2.5, 0.05, 2,
    r`For adiabatic change $T^\gamma P^{1 - \gamma} = $ const, so $P\propto T^{\gamma/(\gamma - 1)} = T^{5/2}$. $P_2/P_1 = 2^{2.5} = 5.66$.`, { unit: '', trap: 'The exponent is $\\gamma/(\\gamma - 1)$, not $\\gamma$.' }),
  nat(4, 'heat engines', r`A heat engine of efficiency 25% delivers 3 kJ of work. Find the heat it rejects to the sink (in kJ).`, () => 3 / 0.25 - 3, 0, 0,
    r`$Q_1 = W/\eta = 3/0.25 = 12$ kJ. Heat rejected $= Q_1 - W = 9$ kJ.`, { unit: 'kJ' }),
  nat(4, 'heat pump', r`An ideal heat pump keeps a house at 300 K when it is 270 K outside. How much electrical work (in J, nearest whole number) is needed to deliver 3000 J of heat to the house?`, () => 3000 * 30 / 300, 1, 0,
    r`$\mathrm{COP_{pump}} = T_1/(T_1 - T_2) = 300/30 = 10$. $W = 3000/10 = 300$ J. The other 2700 J is taken from the cold outside.`, { unit: 'J' }),
  nat(4, 'cyclic process', r`In the cycle $A\to B$ (isothermal expansion at 600 K), $B\to C$ (isochoric cooling to 300 K), $C\to D$ (isothermal compression at 300 K), $D\to A$ (isochoric heating), 1 mole of a monatomic gas has $V_B = 2V_A$. Find the net work per cycle (in J, nearest whole number). $R = 8.31$.`, () => 8.31 * 300 * Math.log(2), 3, 0,
    r`The isochoric legs do no work. $W_{AB} = RT_1\ln2 = 8.31\times600\times0.6931 = 3456$ J. $W_{CD} = -RT_2\ln2 = -1728$ J. Net $= R(T_1 - T_2)\ln2 = 8.31\times300\times0.6931 = 1728$ J.`, { unit: 'J' }),
);

items.push(
  // ---------- Level 5 ----------
  nat(5, 'irreversible adiabatic', r`A monatomic ideal gas at 300 K and pressure $P_1$ is in an insulated cylinder closed by a piston. The external pressure is suddenly reduced to $P_1/2$ and held there; the gas expands and settles at the new equilibrium. Find the final temperature (in K, 1 decimal).`, () => 300 * (1.5 + 0.5) / 2.5, 0.3, 1,
    r`Irreversible, so $PV^\gamma$ does not apply. Energy balance (no heat): $nC_v(T_2 - T_1) = -P_2(V_2 - V_1)$ with $P_2 = P_1/2$ and $V = nRT/P$. $1.5(T_2 - 300) = -T_2 + 300/2$ (in units of $nR$, using $P_2V_1 = \tfrac12nRT_1$). So $2.5T_2 = 1.5\times300 + 150 = 600$ and $T_2 = 240$ K. (A reversible adiabatic expansion would reach $300\times2^{-0.4} = 227$ K.)`, { unit: 'K', trap: 'Sudden expansion cools less, as the gas does less work than in a slow expansion.' }),
  nat(5, 'general processes', r`One mole of a monatomic ideal gas follows the straight line from $A(V_0, 3P_0)$ to $B(3V_0, P_0)$ on a P-V diagram. The temperature at $A$ is 300 K. Find the highest temperature reached on the way (in K).`, () => 300 * 4 / 3, 1, 0,
    r`The line is $P = 4P_0 - P_0V/V_0$. $PV = 4P_0V - P_0V^2/V_0$ is largest at $V = 2V_0$, where $PV = 4P_0V_0$. At $A$, $PV = 3P_0V_0$ (300 K). So $T_{max} = 300\times4/3 = 400$ K.`, { unit: 'K' }),
  nat(5, 'general processes', r`For the straight-line process $P = 4P_0 - P_0V/V_0$ of a monatomic gas (from $V_0$ to $3V_0$), heat is absorbed up to a volume $V^*$ and released afterwards. Find $V^*/V_0$ (decimal).`, () => 2.5, 0.01, 1,
    r`$dQ = nC_v\,dT + P\,dV$ with $nRT = PV$: $dQ = \tfrac32d(PV) + P\,dV = \tfrac52P\,dV + \tfrac32V\,dP$. With $dP = -(P_0/V_0)dV$: $dQ = \left[\tfrac52(4P_0 - P_0V/V_0) - \tfrac32P_0V/V_0\right]dV = P_0(10 - 4V/V_0)\,dV$. This is zero at $V = 2.5V_0$. Heat is absorbed until there, though the temperature peaks earlier at $2V_0$.`, { unit: '', trap: 'The heat-absorption limit is not the point of maximum temperature.' }),
  nat(5, 'cyclic process', r`1 mole of a monatomic ideal gas ($R = 8.31$) follows: $A\to B$ isothermal expansion at $T_1 = 400$ K ($V\to2V$); $B\to C$ isochoric cooling to $T_2 = 300$ K; $C\to D$ isothermal compression at $T_2$; $D\to A$ isochoric heating back to $T_1$. There is no regenerator. Find the efficiency (%, 1 decimal).`, () => (8.31 * 100 * Math.log(2)) / (8.31 * 400 * Math.log(2) + 1.5 * 8.31 * 100) * 100, 0.2, 1,
    r`Heat enters on $A\to B$: $RT_1\ln2 = 8.31\times400\times0.6931 = 2304$ J, and on $D\to A$: $C_v(T_1 - T_2) = 1.5\times8.31\times100 = 1247$ J. $Q_{in} = 3551$ J. Net work $= R(T_1 - T_2)\ln2 = 576$ J. $\eta = 576/3551 = 16.2\%$, well below the Carnot value of 25%.`, { unit: '%' }),
  nat(5, 'entropy', r`1 kg of water at 300 K is mixed with 1 kg of water at 400 K in an insulated vessel (heat capacity of the vessel ignored, $c = 4200$ SI). Find the total entropy increase (in J K$^{-1}$, 1 decimal).`, () => 4200 * Math.log(350 * 350 / (300 * 400)), 0.3, 1,
    r`$T_f = 350$ K. $\Delta S = mc\ln\dfrac{350}{300} + mc\ln\dfrac{350}{400} = mc\ln\dfrac{350^2}{300\times400} = 4200\times\ln1.02083 = 4200\times0.020619 = 86.6\ \mathrm{J\,K^{-1}}$.`, { unit: 'J/K' }),
  nat(5, 'general processes', r`A monatomic gas has pressure $P_0$ and volume $V_0$. It is first heated at constant volume until the pressure is $2P_0$, then expanded adiabatically back to pressure $P_0$. Find the final volume in units of $V_0$ (3 decimals).`, () => 2 ** (3 / 5), 0.005, 3,
    r`Adiabatic leg: $P_2V_2^{5/3} = P_3V_3^{5/3}$ with $P_2 = 2P_0$, $V_2 = V_0$, $P_3 = P_0$. $V_3 = V_0\times2^{3/5} = 1.516V_0$.`, { unit: '' }),
  nat(5, 'mixture and adiabatic', r`A mixture of 2 mol of helium and 3 mol of rigid hydrogen is compressed adiabatically from 300 K to half its volume. Use $\gamma_{mix} = 15.5/10.5$. Find the final temperature (in K, nearest whole number).`, () => 300 * 2 ** (15.5 / 10.5 - 1), 3, 0,
    r`$\gamma - 1 = 5/10.5 = 0.4762$. $T_2 = 300\times2^{0.4762} = 300\times1.391 = 417$ K.`, { unit: 'K' }),
  nat(5, 'refrigerator', r`A Carnot refrigerator extracts heat from a bath of water at $0\,^\circ$C and rejects it at 300 K to the room. How much work (in kJ, 1 decimal) does it need to freeze 1 kg of water already at $0\,^\circ$C? ($L_f = 336$ kJ kg$^{-1}$; the bath stays at 273 K.)`, () => 336 * (300 - 273) / 273, 0.1, 1,
    r`$\mathrm{COP} = T_2/(T_1 - T_2) = 273/27 = 10.11$. $W = Q_2/\mathrm{COP} = 336/10.11 = 33.2$ kJ.`, { unit: 'kJ' }),
  nat(5, 'efficiency of cycles', r`A heat engine works on a cycle made of two isobars and two isochores on a rigid diatomic gas: $P_0\to2P_0$ at $V_0$, expansion to $2V_0$ at $2P_0$, cooling to $P_0$ at $2V_0$, compression back at $P_0$. A Carnot engine works between the highest and lowest temperatures of this cycle. Find the ratio $\eta_{cycle}/\eta_{Carnot}$ (2 decimals).`, () => (1 / 9.5) / (1 - 1 / 4), 0.01, 2,
    r`The lowest $T$ is at $(P_0, V_0)$: $T_0$. The highest is at $(2P_0, 2V_0)$: $4T_0$. Carnot: $1 - 1/4 = 0.75$. Cycle: $\eta = 1/9.5 = 0.1053$. Ratio $= 0.1053/0.75 = 0.14$.`, { unit: '', sub: 'cyclic process' }),
  nat(5, 'adiabatic process', r`A diatomic gas ($\gamma = 7/5$) expands adiabatically and its pressure falls to $1/32$ of the initial value. By what factor does the volume increase (2 decimals)?`, () => 32 ** (5 / 7), 0.05, 2,
    r`$V_2/V_1 = (P_1/P_2)^{1/\gamma} = 32^{5/7} = 2^{25/7} = 2^{3.571} = 11.89$.`, { unit: '' }),
  nat(5, 'work from P-V graph', r`A gas expands from 2 L to 4 L following $P = aV^2$, where $a$ is a constant and the pressure at 2 L is $1\times10^5$ Pa. Find the work done by the gas (in J, nearest whole number).`, () => 1e5 / (2e-3) ** 2 * ((4e-3) ** 3 - (2e-3) ** 3) / 3, 3, 0,
    r`$a = 1\times10^5/(2\times10^{-3})^2 = 2.5\times10^{10}$. $W = \int aV^2dV = \dfrac a3(V_2^3 - V_1^3) = \dfrac{2.5\times10^{10}}{3}(6.4\times10^{-8} - 8\times10^{-9}) = \dfrac{2.5\times10^{10}}{3}\times5.6\times10^{-8} = 467$ J. (The pressure at 4 L is $4\times10^5$ Pa.)`, { unit: 'J' }),
);

// ---------- Multiple correct ----------
items.push(
  msq(3, 'isothermal process', r`An ideal gas expands isothermally. Which statements are correct?`,
    [r`$\Delta U = 0$`, r`The heat absorbed equals the work done by the gas`, r`The temperature stays constant`, r`No heat is exchanged`], [0, 1, 2],
    r`Constant $T$ means $\Delta U = 0$ for an ideal gas, so $Q = W > 0$. The gas must take in heat from a reservoir, so D is false.`),
  msq(4, 'adiabatic process', r`An ideal gas is compressed adiabatically. Which statements are correct?`,
    ['Its temperature rises', 'The work done on the gas equals the increase in its internal energy', 'Its pressure rises more than in an isothermal compression to the same volume', 'It absorbs heat from the surroundings'], [0, 1, 2],
    r`$Q = 0$, so $W_{on} = \Delta U > 0$ and $T$ rises. The higher temperature adds to the pressure rise (compare $PV^\gamma$ with $PV$). No heat is absorbed.`),
  msq(4, 'isobaric process', r`An ideal gas expands at constant pressure and its temperature rises. Which statements are correct?`,
    [r`$Q > \Delta U$`, r`$W > 0$`, r`$\Delta U > 0$`, r`$Q = W$`], [0, 1, 2],
    r`$Q = \Delta U + W$ with $W = P\Delta V > 0$ and $\Delta U = nC_v\Delta T > 0$. So $Q > \Delta U$. $Q = W$ would need $\Delta U = 0$.`),
  msq(5, 'cyclic process', r`A gas is taken round a clockwise cycle on a P-V diagram. Which statements are correct?`,
    ['The net work done by the gas is positive', 'The net change in internal energy is zero', 'The net heat absorbed is positive', 'The net heat absorbed is zero'], [0, 1, 2],
    r`Clockwise means positive net work (the area). $\Delta U = 0$ over a cycle, so $Q_{net} = W_{net} > 0$. D is false.`),
  msq(4, 'Carnot engine', r`Which statements about a Carnot engine are correct?`,
    ['It is a reversible engine', 'Its efficiency depends only on the two reservoir temperatures', r`Its efficiency is $1 - T_2/T_1$`, 'Its efficiency increases if the sink temperature is raised'], [0, 1, 2],
    r`Raising $T_2$ lowers the efficiency $1 - T_2/T_1$. A, B and C are the defining properties.`),
  msq(5, 'second law', r`Which of the following are consequences or statements of the second law?`,
    ['Heat cannot flow by itself from a colder body to a hotter body', 'A cyclic engine cannot turn heat from a single reservoir completely into work', 'A refrigerator violates the second law because it moves heat from cold to hot', 'The entropy of an isolated system never decreases'], [0, 1, 3],
    r`A refrigerator needs external work, so it does not violate the second law. The other three are standard statements.`),
  msq(3, 'isobaric process', r`One mole of an ideal gas is heated through $\Delta T$ at constant pressure. Which relations hold?`,
    [r`$W = R\Delta T$`, r`$Q = C_p\Delta T$`, r`$\Delta U = C_v\Delta T$`, r`$\Delta U = Q$`], [0, 1, 2],
    r`D is false, since part of $Q$ goes into work. $Q = \Delta U + W$ gives $C_p = C_v + R$.`),
  msq(5, 'polytropic process', r`In the family $PV^n = $ constant for an ideal gas, which identifications are correct?`,
    [r`$n = 0$ is an isobaric process`, r`$n = 1$ is an isothermal process`, r`$n = \gamma$ is an adiabatic process`, r`$n = 2$ is an isochoric process`], [0, 1, 2],
    r`$n = 0$: $P$ constant. $n = 1$: $PV$ constant. $n = \gamma$: adiabatic. An isochoric process corresponds to $n\to\infty$ (so that $V = $ constant).`),
  msq(4, 'specific heats of gases', r`Which statements about ideal gases are correct?`,
    [r`$C_v = 3R/2$ for a monatomic gas`, r`$C_p = 7R/2$ for a rigid diatomic gas`, r`$\gamma = 9/7$ for a diatomic gas with active vibration`, r`$C_p - C_v = 2R$`], [0, 1, 2],
    r`For vibrating diatomic $f = 7$, $\gamma = 1 + 2/7 = 9/7$. Mayer's relation is $C_p - C_v = R$, so D is false.`),
  msq(5, 'refrigerator', r`Which statements are correct for refrigerators and heat pumps?`,
    [r`The COP of a heat pump is one more than the COP of the same refrigerator`, r`A refrigerator rejects heat $Q_2 + W$ to the hot side`, r`An ideal refrigerator's COP is $T_2/(T_1 - T_2)$`, r`The COP is always less than 1`], [0, 1, 2],
    r`COP can exceed 1 (it is 9 for $270$ K and $300$ K). The first three follow from $Q_1 = Q_2 + W$.`),
);

// ---------- Assertion / Reason ----------
items.push(
  asrt(2, 'isothermal process', r`In an isothermal expansion of an ideal gas, the heat absorbed equals the work done by the gas.`, r`The internal energy of an ideal gas depends only on its temperature.`, 0,
    r`$T$ constant gives $\Delta U = 0$, so $Q = W$. R is the reason.`),
  asrt(3, 'PV curves', r`On a P-V diagram the adiabatic curve through a point is steeper than the isothermal curve through it.`, r`$\gamma = C_p/C_v$ is greater than 1.`, 0,
    r`Isotherm slope $-P/V$, adiabat slope $-\gamma P/V$. Since $\gamma > 1$ the adiabat is steeper. R explains A.`),
  asrt(2, 'cyclic process', r`The work done by a gas in a cyclic process is zero.`, r`The change in internal energy in a cyclic process is zero.`, 3,
    r`A is false: the net work equals the net heat and is the area of the loop. R is true: $\Delta U = 0$ for a cycle. That makes $Q = W$, not $W = 0$.`),
  asrt(3, 'heat engines', r`No heat engine can have an efficiency of 100%.`, r`Heat cannot be completely converted into work in a cyclic process (Kelvin-Planck statement).`, 0,
    r`A is a direct consequence of the second law as stated in R.`),
  asrt(3, 'specific heats of gases', r`For an ideal gas the molar heat capacity at constant pressure is greater than at constant volume.`, r`A gas heated at constant pressure has a larger volume afterwards than one heated at constant volume.`, 1,
    r`A is true. R is also true, but it is not the explanation. The reason is that at constant pressure part of the heat goes into expansion work, $R\Delta T$ per mole.`),
  asrt(4, 'refrigerator', r`A refrigerator left with its door open in a closed, insulated room will cool the room.`, r`A refrigerator removes heat from its cold interior.`, 3,
    r`A is false: the compressor's electrical work all ends up as heat in the room, which warms up. R is a true description of what a refrigerator does, but the total heat dumped by the back is $Q_2 + W$.`),
  asrt(4, 'free expansion', r`When an ideal gas undergoes free expansion into a vacuum, its temperature remains unchanged.`, r`In free expansion the gas does a large amount of work against the vacuum.`, 2,
    r`A is true ($Q = 0$, $W = 0$, so $\Delta U = 0$). R is false: there is nothing to push against, so $W = 0$.`),
  asrt(4, 'Carnot engine', r`The efficiency of a Carnot engine depends on the working substance.`, r`A Carnot engine is a reversible engine.`, 3,
    r`A is false: $\eta = 1 - T_2/T_1$ for any working substance. R is true but does not make A true.`),
  asrt(5, 'adiabatic process', r`Two adiabatic curves for the same gas on a P-V diagram can never intersect.`, r`If they intersected, an isothermal curve could be drawn to form a cycle that takes heat from one reservoir and turns it entirely into work.`, 0,
    r`At a crossing point both adiabats would pass through the same state. An isotherm joining them gives a closed cycle with net work and heat only from one reservoir, violating Kelvin-Planck. R is the reason.`),
  asrt(3, 'adiabatic process', r`When a gas is compressed adiabatically, its temperature rises.`, r`The work done on the gas increases its internal energy since no heat can leave.`, 0,
    r`$Q = 0$ gives $\Delta U = W_{on} > 0$. For an ideal gas $U$ rises with $T$. R explains A.`),
  asrt(2, 'internal energy', r`The internal energy of a real gas can change in an isothermal expansion.`, r`A real gas has intermolecular forces, so its potential energy changes with volume.`, 0,
    r`In a real gas $U$ includes potential energy that depends on the molecular separation. Even at constant $T$ it changes when the volume changes. R explains A.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'internal energy', r`The internal energy of an ideal gas depends only on its temperature.`, r`There are no intermolecular forces in an ideal gas.`, 0,
    r`No forces means no potential energy; only kinetic energy counts, which depends on $T$. Both true.`),
  stm(3, 'adiabatic process', r`The temperature of a gas cannot change in an adiabatic process.`, r`In an adiabatic process no heat enters or leaves the gas.`, 3,
    r`I is false: work done on or by the gas changes its internal energy and so its temperature. II is true.`),
  stm(3, 'work and heat', r`The work done by a gas in going from one state to another depends on the path.`, r`Work is a state function.`, 2,
    r`I is true: the area under the P-V curve depends on the path. II is false.`),
  stm(4, 'refrigerator', r`The COP of a refrigerator can be greater than 1.`, r`COP $= Q_2/W$, where $Q_2$ is the heat removed from the cold space.`, 0,
    r`Both true. Since $Q_2$ can be much larger than $W$, the COP can exceed 1.`),
  stm(3, 'Carnot engine', r`The efficiency of a Carnot engine depends on its working substance.`, r`The efficiency of a Carnot engine depends only on the temperatures of the source and sink.`, 3,
    r`I is false and II is true: $\eta = 1 - T_2/T_1$ for every working substance.`),
  stm(4, 'second law', r`Heat can flow from a cold body to a hot body.`, r`A refrigerator does this with the help of external work.`, 0,
    r`Both true. The second law forbids this only as a spontaneous process with no other change.`),
  stm(5, 'polytropic process', r`The molar heat capacity of an ideal gas can be negative.`, r`In a polytropic process with $1 < n < \gamma$ the gas rejects heat while it expands.`, 2,
    r`I is true: $C = C_v + R/(1 - n) < 0$ for $1 < n < 1 + R/C_v$. II is false: in such a process, as the gas expands its temperature falls ($n > 1$), and $Q = nC\,\Delta T > 0$, so it absorbs heat while expanding.`, { trap: 'Negative $C$ with falling $T$ gives positive $Q$.' }),
  stm(4, 'absolute zero', r`A Carnot engine of 100% efficiency would need a sink at 0 K.`, r`Absolute zero cannot be reached in a finite number of steps.`, 0,
    r`$\eta = 1 - T_2/T_1 = 1$ only if $T_2 = 0$. The third law says 0 K is unattainable. Both true.`),
  stc(3, 'processes', r`Consider an ideal gas: (i) $\Delta U = 0$ in an isothermal process; (ii) $Q = 0$ in an isochoric process; (iii) $W = 0$ in an isochoric process; (iv) $PV^\gamma = $ constant in a reversible adiabatic process. How many are correct?`,
    '3', ['1', '2', '4'],
    r`(i) True. (ii) False: heating at constant volume needs heat, $Q = \Delta U$. (iii) True. (iv) True. Three are correct.`),
  stc(4, 'second law', r`Consider: (i) a refrigerator's COP can exceed 1; (ii) the efficiency of a heat engine equals 1 only if the sink is at 0 K (for a Carnot engine); (iii) the entropy of any system, isolated or not, never decreases; (iv) the work done by a gas in free expansion is positive. How many are correct?`,
    '2', ['1', '3', '4'],
    r`(i) True. (ii) True for a Carnot engine. (iii) False: a refrigerator's interior loses entropy. Only an isolated system (with its surroundings) cannot decrease. (iv) False: free expansion does zero work. Two are correct.`),
);

// ---------- Match the following + passages ----------
const groups = {
  m1: { title: 'Processes and conditions',
    list1: ['A. Isothermal process', 'B. Adiabatic process', 'C. Isochoric process', 'D. Isobaric process'],
    list2: [r`p. $W = 0$`, r`q. $\Delta U = 0$ (ideal gas)`, r`r. $Q = 0$`, r`s. $P$ is constant`] },
  m2: { title: 'Heat for 1 mole of a monatomic gas heated through $\\Delta T$',
    list1: ['A. Isobaric process', 'B. Adiabatic process', 'C. Process with $P\\propto V$', 'D. Isochoric process'],
    list2: [r`p. $\tfrac32R\Delta T$`, r`q. $\tfrac52R\Delta T$`, r`r. Zero`, r`s. $2R\Delta T$`] },
  m3: { title: 'Gases and $\\gamma$',
    list1: ['A. Monatomic gas', 'B. Rigid diatomic gas', 'C. Rigid non-linear polyatomic gas', 'D. Diatomic gas with vibration active'],
    list2: [r`p. $4/3$`, r`q. $9/7$`, r`r. $7/5$`, r`s. $5/3$`] },
  m4: { title: 'Efficiency of Carnot engines',
    list1: ['A. Source 600 K, sink 300 K', 'B. Source 400 K, sink 300 K', 'C. Otto engine, compression ratio 8, $\\gamma = 1.4$', 'D. Source 1200 K, sink 300 K'],
    list2: ['p. 25%', 'q. 50%', 'r. about 56%', 's. 75%'] },
  p1: { title: 'A rectangular cycle',
    passage: r`<p>One mole of a monatomic ideal gas goes round the cycle $A\to B\to C\to D\to A$ on a P-V diagram. $A = (P_0, V_0)$, $B = (2P_0, V_0)$, $C = (2P_0, 2V_0)$, $D = (P_0, 2V_0)$, with $P_0 = 1.0\times10^5$ Pa and $V_0 = 2.0\ \mathrm{L}$.</p>` },
  p2: { title: 'An engine driving a refrigerator',
    passage: r`<p>A Carnot engine works between 600 K and 300 K and takes 1200 J of heat from the 600 K source in each cycle. All its work drives a Carnot refrigerator that works between a cold space at 250 K and the 300 K surroundings.</p>` },
  p3: { title: 'An isothermal and isobaric loop',
    passage: r`<p>Two moles of a monatomic ideal gas start at $A$ (300 K, volume $V_1$). They expand isothermally to $B$ (volume $2V_1$), are cooled at constant pressure to $C$ (volume $V_1$), then returned to $A$ at constant volume. Take $R = 8.31$ J mol$^{-1}$K$^{-1}$.</p>` },
};

items.push(
  mat(2, 'processes', 'm1', r`Match each process in List I with a property of it in List II.`,
    'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'],
    r`Isothermal: $\Delta U = 0$ for an ideal gas (q). Adiabatic: $Q = 0$ (r). Isochoric: no volume change so $W = 0$ (p). Isobaric: constant $P$ (s).`),
  mat(3, 'heat in processes', 'm2', r`Match each process in List I with the heat absorbed by 1 mole of a monatomic gas whose temperature rises by $\Delta T$ (List II).`,
    'A-q, B-r, C-s, D-p', ['A-p, B-r, C-s, D-q', 'A-q, B-s, C-r, D-p', 'A-s, B-r, C-q, D-p'],
    r`Isobaric: $C_p\Delta T = \tfrac52R\Delta T$ (q). Adiabatic: $Q = 0$ (r). $P\propto V$: $C = 2R$ (s). Isochoric: $C_v\Delta T = \tfrac32R\Delta T$ (p).`),
  mat(3, 'specific heats of gases', 'm3', r`Match each gas in List I with its ratio $\gamma = C_p/C_v$ in List II.`,
    'A-s, B-r, C-p, D-q', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-p, B-r, C-s, D-q'],
    r`$\gamma = 1 + 2/f$: monatomic $f = 3$ gives $5/3$ (s); rigid diatomic $f = 5$ gives $7/5$ (r); non-linear polyatomic $f = 6$ gives $4/3$ (p); diatomic with vibration $f = 7$ gives $9/7$ (q).`),
  mat(3, 'engine efficiency', 'm4', r`Match each engine in List I with its efficiency in List II.`,
    'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`A: $1 - 300/600 = 50\%$ (q). B: $1 - 300/400 = 25\%$ (p). C: $1 - 8^{-0.4} = 56.5\%$ (r). D: $1 - 300/1200 = 75\%$ (s).`),
);

items.push(
  pas(2, 'cyclic process', 'p1', r`Find the net work done by the gas in one cycle (in J).`, () => 1e5 * 2e-3, 0, 0,
    r`Net work = area of the rectangle $= (2P_0 - P_0)(2V_0 - V_0) = P_0V_0 = 1.0\times10^5\times2.0\times10^{-3} = 200$ J.`, { unit: 'J' }),
  pas(3, 'cyclic process', 'p1', r`Find the heat absorbed along $A\to B$ (in J).`, () => 1.5 * 1e5 * 2e-3, 0, 0,
    r`Isochoric: $Q = \Delta U = \tfrac32(P_BV_B - P_AV_A) = \tfrac32\times(2 - 1)P_0V_0 = 1.5\times200 = 300$ J.`, { unit: 'J' }),
  pas(4, 'cyclic process', 'p1', r`Find the efficiency of the cycle (%, 1 decimal).`, () => 200 / (300 + 1000) * 100, 0.1, 1,
    r`Heat is also absorbed along $B\to C$ (isobaric expansion): $Q = \tfrac52\times2P_0\times(2V_0 - V_0) = 5P_0V_0 = 1000$ J. $D\to A$ and $C\to D$ lose heat. $\eta = 200/(300 + 1000) = 15.4\%$.`, { unit: '%' }),
  pas(2, 'Carnot engine', 'p2', r`Find the work done by the engine per cycle (in J).`, () => 1200 * (1 - 300 / 600), 0, 0,
    r`$\eta = 1 - 300/600 = 0.5$, $W = 0.5\times1200 = 600$ J.`, { unit: 'J' }),
  pas(3, 'refrigerator', 'p2', r`Find the heat extracted from the 250 K space per engine cycle (in J).`, () => 600 * 250 / (300 - 250), 0, 0,
    r`$\mathrm{COP} = 250/(300 - 250) = 5$. $Q_2 = 5\times600 = 3000$ J.`, { unit: 'J' }),
  pas(4, 'refrigerator', 'p2', r`Find the total heat delivered to the 300 K surroundings per engine cycle by the engine and the refrigerator together (in J).`, () => 600 + (3000 + 600), 0, 0,
    r`The engine rejects $1200 - 600 = 600$ J. The refrigerator rejects $Q_2 + W = 3000 + 600 = 3600$ J. Total $= 4200$ J. Check: heat taken from the 600 K source (1200 J) plus 3000 J from the cold space $= 4200$ J.`, { unit: 'J' }),
  pas(3, 'isothermal process', 'p3', r`Find the work done by the gas in $A\to B$ (in J, nearest whole number).`, () => 2 * 8.31 * 300 * Math.log(2), 3, 0,
    r`$W = nRT\ln2 = 2\times8.31\times300\times0.6931 = 3456$ J.`, { unit: 'J' }),
  pas(3, 'isobaric process', 'p3', r`Find the work done by the gas in $B\to C$ (in J, nearest whole number; negative if work is done on the gas).`, () => 2 * 8.31 * (150 - 300), 2, 0,
    r`At constant pressure $T\propto V$, so $T_C = 150$ K. $W = nR\Delta T = 2\times8.31\times(150 - 300) = -2493$ J. Work is done on the gas.`, { unit: 'J' }),
  pas(4, 'cyclic process', 'p3', r`Find the net work done by the gas in the whole cycle $A\to B\to C\to A$ (in J, nearest whole number).`, () => 2 * 8.31 * 300 * Math.log(2) - 2 * 8.31 * 150, 3, 0,
    r`$C\to A$ is isochoric, so no work. Net $W = 3456 - 2493 = 963$ J. It is positive: the expansion at the higher pressure beats the compression at lower pressure.`, { unit: 'J' }),
);

// ---------- Number templates ----------
const TT = (a, dp) => +Math.max(Math.abs(a) * 0.01, 0.6 * 10 ** -dp).toPrecision(1);
const mk = (id, level, sub, make, verify) => ({ id, type: 'nat', level, exams: EX[level], sub, make, verify });
const out = (v, q, ans, dp, unit, sol, extra = {}) => ({ v, q, answer: R(ans, dp), tol: TT(ans, dp), unit, sol, ...extra });
const GAS = [['a monatomic', 1.5], ['a rigid diatomic', 2.5], ['a rigid non-linear polyatomic', 3]];

const gens = [
  mk('th-g01', 2, 'first law', (rng) => {
    const v = int(rng, 0, 3); const Q = pick(rng, 200, 1500, 50);
    if (v === 0) { const Ww = pick(rng, 50, 190, 10); return out(v, r`A gas absorbs ${Q} J of heat and does ${Ww} J of work. Find the change in its internal energy (in J).`, Q - Ww, 0, 'J', r`$\Delta U = Q - W = ${Q} - ${Ww} = ${Q - Ww}$ J.`, { Q, Ww }); }
    if (v === 1) { const dU = pick(rng, 100, 900, 50); const Ww = pick(rng, 50, 400, 50); return out(v, r`The internal energy of a gas rises by ${dU} J while it does ${Ww} J of work on its surroundings. Find the heat absorbed (in J).`, dU + Ww, 0, 'J', r`$Q = \Delta U + W = ${dU} + ${Ww} = ${dU + Ww}$ J.`, { dU, Ww }); }
    if (v === 2) { const Won = pick(rng, 100, 600, 50); const Qout = pick(rng, 20, 90, 10); return out(v, r`${Won} J of work is done on a gas while it loses ${Qout} J of heat. Find the change in its internal energy (in J).`, Won - Qout, 0, 'J', r`$W = -${Won}$ J (work done on the gas) and $Q = -${Qout}$ J. $\Delta U = Q - W = -${Qout} + ${Won} = ${Won - Qout}$ J.`, { Won, Qout }); }
    const Ww = pick(rng, 100, 400, 50); const dU = -pick(rng, 50, 300, 50); return out(v, r`A gas does ${Ww} J of work while its internal energy falls by ${-dU} J. Find the heat exchanged (in J; positive if absorbed).`, dU + Ww, 0, 'J', r`$Q = \Delta U + W = ${dU} + ${Ww} = ${dU + Ww}$ J${dU + Ww >= 0 ? ' (absorbed)' : ' (given out)'}.`, { dU, Ww });
  }, (p) => (p.v === 0 ? p.Q - p.Ww : p.v === 1 ? p.dU + p.Ww : p.v === 2 ? p.Won - p.Qout : p.dU + p.Ww)),

  mk('th-g02', 2, 'isothermal process', (rng) => {
    const v = int(rng, 0, 2); const n = pick(rng, 1, 5, 1); const T = pick(rng, 250, 450, 50); const k = choose(rng, [2, 3, 4, 5]);
    if (v === 0) { const W = n * 8.31 * T * Math.log(k); return out(v, r`${n} mol of an ideal gas at ${T} K expands isothermally to ${k} times its volume. Find the work done by the gas (in J, nearest whole number). $R = 8.31$.`, W, 0, 'J', r`$W = nRT\ln(V_2/V_1) = ${n}\times8.31\times${T}\times\ln${k} = ${R(n * 8.31 * T, 1)}\times${R(Math.log(k), 4)} = ${R(W, 0)}$ J.`, { n, T, k }); }
    if (v === 1) { const W = n * 8.31 * T * Math.log(k); return out(v, r`${n} mol of an ideal gas at ${T} K is compressed isothermally until its pressure is ${k} times the initial pressure. Find the heat released to the surroundings (in J, nearest whole number). $R = 8.31$.`, W, 0, 'J', r`$\Delta U = 0$, so heat released $=$ work done on the gas $= nRT\ln(P_2/P_1) = ${n}\times8.31\times${T}\times\ln${k} = ${R(W, 0)}$ J.`, { n, T, k }); }
    const P1 = pick(rng, 2, 8, 1); const V1 = pick(rng, 1, 5, 1); const W = P1 * 1e5 * V1 * 1e-3 * Math.log(k); return out(v, r`A gas at ${P1}$\times10^5$ Pa and ${V1} L expands isothermally to ${k * V1} L. Find the work done (in J, 1 decimal).`, W, 1, 'J', r`$W = P_1V_1\ln(V_2/V_1) = ${P1}\times10^5\times${V1}\times10^{-3}\times\ln${k} = ${P1 * V1 * 100}\times${R(Math.log(k), 4)} = ${R(W, 1)}$ J.`, { P1, V1, k });
  }, (p) => (p.v === 2 ? p.P1 * p.V1 * 100 * Math.log(p.k) : p.n * 8.31 * p.T * Math.log(p.k))),

  mk('th-g03', 3, 'isobaric process', (rng) => {
    const v = int(rng, 0, 3); const [gname, cv] = choose(rng, GAS); const n = pick(rng, 1, 4, 1); const dT = pick(rng, 20, 100, 10);
    if (v === 0) return out(v, r`${n} mol of ideal gas is heated through ${dT} K at constant pressure. Find the work done by the gas (in J, 1 decimal). $R = 8.31$.`, n * 8.31 * dT, 1, 'J', r`$W = P\Delta V = nR\Delta T = ${n}\times8.31\times${dT} = ${R(n * 8.31 * dT, 1)}$ J.`, { n, dT, cv });
    if (v === 1) return out(v, r`How much heat (in J, 1 decimal) is needed to raise the temperature of ${n} mol of ${gname} gas by ${dT} K at constant pressure? $R = 8.31$.`, n * (cv + 1) * 8.31 * dT, 1, 'J', r`$C_p = (C_v/R + 1)R = ${cv + 1}R$. $Q = nC_p\Delta T = ${n}\times${cv + 1}\times8.31\times${dT} = ${R(n * (cv + 1) * 8.31 * dT, 1)}$ J.`, { n, dT, cv });
    if (v === 2) return out(v, r`${n} mol of ${gname} gas is heated by ${dT} K at constant pressure. Find the increase in internal energy (in J, 1 decimal). $R = 8.31$.`, n * cv * 8.31 * dT, 1, 'J', r`$\Delta U = nC_v\Delta T = ${n}\times${cv}\times8.31\times${dT} = ${R(n * cv * 8.31 * dT, 1)}$ J (it does not depend on how the heating is done).`, { n, dT, cv });
    return out(v, r`${gname.replace('a ', 'A ')} gas is heated at constant pressure. What percentage of the heat supplied is converted into work (1 decimal)?`, 100 / (cv + 1), 1, '%', r`$W/Q = \dfrac{R\Delta T}{C_p\Delta T} = \dfrac1{${cv + 1}} = ${R(1 / (cv + 1), 4)}$, i.e. ${R(100 / (cv + 1), 1)}%.`, { cv });
  }, (p) => (p.v === 0 ? p.n * 8.31 * p.dT : p.v === 1 ? p.n * (p.cv * 8.31 + 8.31) * p.dT : p.v === 2 ? p.n * p.cv * 8.31 * p.dT : 100 * 8.31 / ((p.cv + 1) * 8.31))),

  mk('th-g04', 2, 'isochoric process', (rng) => {
    const v = int(rng, 0, 2); const [gname, cv] = choose(rng, GAS); const n = pick(rng, 1, 4, 1); const T1 = pick(rng, 250, 350, 50); const T2 = T1 + pick(rng, 50, 200, 50);
    if (v === 0) return out(v, r`${n} mol of ${gname} gas is heated in a rigid vessel from ${T1} K to ${T2} K. Find the heat absorbed (in J, nearest whole number). $R = 8.31$.`, n * cv * 8.31 * (T2 - T1), 0, 'J', r`$W = 0$, so $Q = \Delta U = nC_v\Delta T = ${n}\times${cv}\times8.31\times${T2 - T1} = ${R(n * cv * 8.31 * (T2 - T1), 0)}$ J.`, { n, cv, T1, T2 });
    if (v === 1) { const P1 = pick(rng, 1, 4, 1); return out(v, r`A gas in a rigid vessel at ${P1}.0 atm and ${T1} K is heated to ${T2} K. Find the final pressure (in atm, 2 decimals).`, P1 * T2 / T1, 2, 'atm', r`$P/T$ is constant: $P_2 = P_1T_2/T_1 = ${P1}\times${T2}/${T1} = ${R(P1 * T2 / T1, 2)}$ atm.`, { P1, T1, T2 }); }
    const Q = pick(rng, 500, 3000, 500); return out(v, r`${n} mol of ${gname} gas in a rigid container absorbs ${Q} J of heat. Find the rise in temperature (in K, 1 decimal). $R = 8.31$.`, Q / (n * cv * 8.31), 1, 'K', r`$Q = nC_v\Delta T$, so $\Delta T = \dfrac{${Q}}{${n}\times${cv}\times8.31} = ${R(Q / (n * cv * 8.31), 1)}$ K.`, { n, cv, Q });
  }, (p) => (p.v === 0 ? p.n * p.cv * 8.31 * (p.T2 - p.T1) : p.v === 1 ? p.P1 * (p.T2 / p.T1) : p.Q / (p.n * p.cv * 8.31))),

  mk('th-g05', 3, 'adiabatic process', (rng) => {
    const v = int(rng, 0, 3); const [gname, cv] = choose(rng, GAS); const ga = (cv + 1) / cv; const k = choose(rng, [2, 3, 4, 8]); const T1 = pick(rng, 250, 350, 50);
    if (v === 0) { const T2 = T1 * k ** (ga - 1); return out(v, r`${gname.replace('a ', 'A ')} gas at ${T1} K is compressed adiabatically and reversibly to $1/${k}$ of its volume. Find the final temperature (in K, nearest whole number).`, T2, 0, 'K', r`$\gamma = ${R(ga, 3)}$. $T_2 = T_1(V_1/V_2)^{\gamma - 1} = ${T1}\times${k}^{${R(ga - 1, 3)}} = ${R(T2, 0)}$ K.`, { T1, k, cv }); }
    if (v === 1) { const P2 = k ** ga; return out(v, r`${gname.replace('a ', 'A ')} gas at 1.00 atm is compressed adiabatically and reversibly to $1/${k}$ of its volume. Find the final pressure (in atm, 2 decimals).`, P2, 2, 'atm', r`$\gamma = ${R(ga, 3)}$. $P_2 = P_1(V_1/V_2)^\gamma = ${k}^{${R(ga, 3)}} = ${R(P2, 2)}$ atm.`, { k, cv }); }
    if (v === 2) { const pr = choose(rng, [2, 4, 8, 16]); const V = pr ** (1 / ga); return out(v, r`${gname.replace('a ', 'A ')} gas expands adiabatically and reversibly until its pressure falls to $1/${pr}$ of its initial value. By what factor does the volume increase (3 decimals)?`, V, 3, '', r`$V_2/V_1 = (P_1/P_2)^{1/\gamma} = ${pr}^{1/${R(ga, 3)}} = ${R(V, 3)}$.`, { pr, cv }); }
    const f = choose(rng, [2, 3]); const T2 = T1 * f; const Pr = f ** (ga / (ga - 1)); return out(v, r`${gname.replace('a ', 'A ')} gas is compressed adiabatically and reversibly so that its absolute temperature rises by a factor of ${f}. By what factor does its pressure rise (2 decimals)?`, Pr, 2, '', r`$P\propto T^{\gamma/(\gamma - 1)}$ with $\gamma = ${R(ga, 3)}$, giving exponent ${R(ga / (ga - 1), 3)}. Factor $= ${f}^{${R(ga / (ga - 1), 3)}} = ${R(Pr, 2)}$.`, { f, cv });
  }, (p) => { const ga = (p.cv + 1) / p.cv; return p.v === 0 ? p.T1 * Math.pow(p.k, ga - 1) : p.v === 1 ? Math.exp(ga * Math.log(p.k)) : p.v === 2 ? Math.exp(Math.log(p.pr) / ga) : Math.exp(Math.log(p.f) * ga / (ga - 1)); }),

  mk('th-g06', 3, 'adiabatic work', (rng) => {
    const v = int(rng, 0, 2); const [gname, cv] = choose(rng, GAS); const ga = (cv + 1) / cv; const n = pick(rng, 1, 3, 1); const T1 = pick(rng, 300, 500, 50);
    if (v === 0) { const T2 = T1 - pick(rng, 50, 150, 50); const W = n * cv * 8.31 * (T1 - T2); return out(v, r`${n} mol of ${gname} gas expands adiabatically and cools from ${T1} K to ${T2} K. Find the work done by the gas (in J, nearest whole number). $R = 8.31$.`, W, 0, 'J', r`$Q = 0$, so $W = -\Delta U = nC_v(T_1 - T_2) = ${n}\times${cv}\times8.31\times${T1 - T2} = ${R(W, 0)}$ J.`, { n, cv, T1, T2 }); }
    if (v === 1) { const P1 = pick(rng, 2, 8, 2); const V1 = pick(rng, 1, 3, 1); const k = choose(rng, [2, 4, 8]); const P2 = P1 * k ** -ga; const W = (P1 * 1e5 * V1 * 1e-3 - P2 * 1e5 * k * V1 * 1e-3) / (ga - 1);
      return out(v, r`${gname.replace('a ', 'A ')} gas at ${P1}$\times10^5$ Pa and ${V1} L expands adiabatically and reversibly to ${k * V1} L. Find the work done by the gas (in J, nearest whole number).`, W, 0, 'J', r`$\gamma = ${R(ga, 3)}$. $P_2 = P_1k^{-\gamma} = ${R(P2, 4)}\times10^5$ Pa. $W = \dfrac{P_1V_1 - P_2V_2}{\gamma - 1} = \dfrac{${R(P1 * V1 * 100, 1)} - ${R(P2 * V1 * k * 100, 1)}}{${R(ga - 1, 3)}} = ${R(W, 0)}$ J.`, { P1, V1, k, cv }); }
    const Won = pick(rng, 500, 2000, 500); const dT = Won / (n * cv * 8.31); return out(v, r`${Won} J of work is done to compress ${n} mol of ${gname} gas adiabatically. Find the rise in temperature (in K, 1 decimal). $R = 8.31$.`, dT, 1, 'K', r`$\Delta U = W_{on}$: $nC_v\Delta T = ${Won}$, so $\Delta T = \dfrac{${Won}}{${n}\times${cv}\times8.31} = ${R(dT, 1)}$ K.`, { n, cv, Won });
  }, (p) => { const ga = (p.cv + 1) / p.cv; return p.v === 0 ? p.n * p.cv * 8.31 * (p.T1 - p.T2) : p.v === 1 ? (p.P1 * p.V1 * 100 * (1 - Math.pow(p.k, 1 - ga))) / (ga - 1) : p.Won / (p.n * p.cv * 8.31); }),

  mk('th-g07', 2, 'Carnot engine', (rng) => {
    const v = int(rng, 0, 3); const T1 = pick(rng, 400, 900, 100); const T2 = pick(rng, 250, 350, 50);
    if (v === 0) return out(v, r`A Carnot engine works between ${T1} K and ${T2} K. Find its efficiency (%, 1 decimal).`, (1 - T2 / T1) * 100, 1, '%', r`$\eta = 1 - T_2/T_1 = 1 - ${T2}/${T1} = ${R(1 - T2 / T1, 4)}$, i.e. ${R((1 - T2 / T1) * 100, 1)}%.`, { T1, T2 });
    if (v === 1) { const eta = choose(rng, [0.2, 0.25, 0.4, 0.5]); return out(v, r`A Carnot engine of efficiency ${eta * 100}% has its sink at ${T2} K. Find the source temperature (in K, nearest whole number).`, T2 / (1 - eta), 0, 'K', r`$T_1 = \dfrac{T_2}{1 - \eta} = \dfrac{${T2}}{${R(1 - eta, 2)}} = ${R(T2 / (1 - eta), 0)}$ K.`, { T2, eta }); }
    if (v === 2) { const Q1 = pick(rng, 1000, 5000, 500); return out(v, r`A Carnot engine between ${T1} K and ${T2} K takes ${Q1} J from the source per cycle. Find the work done per cycle (in J, nearest whole number).`, Q1 * (1 - T2 / T1), 0, 'J', r`$W = \eta Q_1 = (1 - ${T2}/${T1})\times${Q1} = ${R(Q1 * (1 - T2 / T1), 0)}$ J.`, { T1, T2, Q1 }); }
    const dT = pick(rng, 50, 100, 50); return out(v, r`A Carnot engine works between ${T1} K and ${T2} K. By how many percentage points (1 decimal) does the efficiency rise if the source is made ${dT} K hotter?`, (1 - T2 / (T1 + dT)) * 100 - (1 - T2 / T1) * 100, 1, '%', r`Before: ${R((1 - T2 / T1) * 100, 2)}%. After: $1 - ${T2}/${T1 + dT} = ${R((1 - T2 / (T1 + dT)) * 100, 2)}$%. Rise $= ${R((1 - T2 / (T1 + dT)) * 100 - (1 - T2 / T1) * 100, 1)}$ percentage points.`, { T1, T2, dT });
  }, (p) => (p.v === 0 ? (p.T1 - p.T2) / p.T1 * 100 : p.v === 1 ? p.T2 / (1 - p.eta) : p.v === 2 ? p.Q1 * (p.T1 - p.T2) / p.T1 : 100 * p.T2 * (1 / p.T1 - 1 / (p.T1 + p.dT)))),

  mk('th-g08', 2, 'heat engines', (rng) => {
    const v = int(rng, 0, 3); const Q1 = pick(rng, 500, 3000, 100); const eta = choose(rng, [0.2, 0.25, 0.3, 0.4, 0.5]); const W = Q1 * eta; const Q2 = Q1 - W;
    if (v === 0) return out(v, r`An engine absorbs ${Q1} J per cycle and rejects ${R(Q2, 0)} J. Find its efficiency (%).`, eta * 100, 1, '%', r`$W = ${Q1} - ${R(Q2, 0)} = ${R(W, 0)}$ J. $\eta = W/Q_1 = ${R(W, 0)}/${Q1} = ${eta}$, i.e. ${eta * 100}%.`, { Q1, Q2 });
    if (v === 1) return out(v, r`An engine of efficiency ${eta * 100}% absorbs ${Q1} J per cycle. How much heat (in J, nearest whole number) does it reject?`, Q2, 0, 'J', r`$W = ${eta}\times${Q1} = ${R(W, 0)}$ J. $Q_2 = Q_1 - W = ${R(Q2, 0)}$ J.`, { Q1, eta });
    if (v === 2) { const P = pick(rng, 2, 20, 2); return out(v, r`An engine of efficiency ${eta * 100}% delivers ${P} kW of power. Find the rate at which it takes heat from the source (in kW, 1 decimal).`, P / eta, 1, 'kW', r`$Q_1 = P/\eta = ${P}/${eta} = ${R(P / eta, 1)}$ kW.`, { P, eta }); }
    const t = pick(rng, 10, 50, 10); return out(v, r`An engine of efficiency ${eta * 100}% burns fuel that supplies ${Q1} J per cycle and runs at ${t} cycles per second. Find its power output (in W, nearest whole number).`, W * t, 0, 'W', r`Work per cycle $= ${eta}\times${Q1} = ${R(W, 0)}$ J. Power $= ${R(W, 0)}\times${t} = ${R(W * t, 0)}$ W.`, { Q1, eta, t });
  }, (p) => (p.v === 0 ? (p.Q1 - p.Q2) / p.Q1 * 100 : p.v === 1 ? p.Q1 * (1 - p.eta) : p.v === 2 ? p.P / p.eta : p.Q1 * p.eta * p.t)),

  mk('th-g09', 3, 'refrigerator', (rng) => {
    const v = int(rng, 0, 3); const Tc = pick(rng, 250, 280, 10); const Th = Tc + pick(rng, 20, 50, 10); const cop = Tc / (Th - Tc);
    if (v === 0) return out(v, r`An ideal refrigerator keeps its inside at ${Tc} K in a kitchen at ${Th} K. Find its coefficient of performance (2 decimals).`, cop, 2, '', r`$\mathrm{COP} = \dfrac{T_c}{T_h - T_c} = \dfrac{${Tc}}{${Th - Tc}} = ${R(cop, 2)}$.`, { Tc, Th });
    if (v === 1) { const Q2 = pick(rng, 500, 3000, 500); return out(v, r`An ideal refrigerator between ${Tc} K and ${Th} K removes ${Q2} J of heat from the cold space. Find the work needed (in J, 1 decimal).`, Q2 / cop, 1, 'J', r`$\mathrm{COP} = ${R(cop, 3)}$. $W = Q_2/\mathrm{COP} = ${Q2}/${R(cop, 3)} = ${R(Q2 / cop, 1)}$ J.`, { Tc, Th, Q2 }); }
    if (v === 2) { const P = pick(rng, 50, 200, 50); return out(v, r`The motor of an ideal refrigerator (inside ${Tc} K, outside ${Th} K) delivers ${P} W. At what rate does it remove heat from the inside (in W, nearest whole number)?`, P * cop, 0, 'W', r`$Q_2/t = \mathrm{COP}\times P = ${R(cop, 3)}\times${P} = ${R(P * cop, 0)}$ W.`, { Tc, Th, P }); }
    const W = pick(rng, 100, 500, 100); return out(v, r`An ideal refrigerator between ${Tc} K and ${Th} K uses ${W} J of work. How much heat (in J, nearest whole number) is rejected to the room?`, W * (1 + cop), 0, 'J', r`$Q_2 = \mathrm{COP}\times W = ${R(cop, 3)}\times${W} = ${R(cop * W, 1)}$ J. Heat rejected $= Q_2 + W = ${R(W * (1 + cop), 0)}$ J.`, { Tc, Th, W });
  }, (p) => (p.v === 0 ? p.Tc / (p.Th - p.Tc) : p.v === 1 ? p.Q2 * (p.Th - p.Tc) / p.Tc : p.v === 2 ? p.P * p.Tc / (p.Th - p.Tc) : p.W * p.Th / (p.Th - p.Tc))),

  mk('th-g10', 3, 'mixture of gases', (rng) => {
    const v = int(rng, 0, 2); const n1 = pick(rng, 1, 4, 1); const n2 = pick(rng, 1, 4, 1); const g1 = choose(rng, [['monatomic', 1.5], ['diatomic', 2.5]]); const g2 = g1[1] === 1.5 ? ['diatomic', 2.5] : ['monatomic', 1.5];
    const cvm = (n1 * g1[1] + n2 * g2[1]) / (n1 + n2); const cpm = cvm + 1;
    if (v === 0) return out(v, r`A mixture has ${n1} mol of a ${g1[0]} gas and ${n2} mol of a ${g2[0]} gas (both rigid, ideal). Find $\gamma$ of the mixture (3 decimals).`, cpm / cvm, 3, '', r`$C_v = \dfrac{${n1}\times${g1[1]} + ${n2}\times${g2[1]}}{${n1 + n2}}R = ${R(cvm, 4)}R$. $C_p = ${R(cpm, 4)}R$. $\gamma = ${R(cpm / cvm, 3)}$.`, { n1, n2, a: g1[1], b: g2[1] });
    if (v === 1) return out(v, r`Find the molar heat capacity at constant volume (in units of $R$, 3 decimals) of a mixture of ${n1} mol of a ${g1[0]} gas and ${n2} mol of a ${g2[0]} gas.`, cvm, 3, 'R', r`$C_v = \dfrac{n_1C_{v1} + n_2C_{v2}}{n_1 + n_2} = \dfrac{${n1}\times${g1[1]} + ${n2}\times${g2[1]}}{${n1 + n2}} = ${R(cvm, 3)}R$.`, { n1, n2, a: g1[1], b: g2[1] });
    const dT = pick(rng, 20, 60, 10); return out(v, r`A mixture of ${n1} mol of a ${g1[0]} gas and ${n2} mol of a ${g2[0]} gas is heated at constant pressure by ${dT} K. Find the heat needed (in J, nearest whole number). $R = 8.31$.`, ((n1 * g1[1] + n2 * g2[1]) + n1 + n2) * 8.31 * dT, 0, 'J', r`$Q = \sum nC_p\Delta T = [n_1(C_{v1}/R + 1) + n_2(C_{v2}/R + 1)]R\Delta T = [${n1}\times${g1[1] + 1} + ${n2}\times${g2[1] + 1}]\times8.31\times${dT} = ${R(((n1 * g1[1] + n2 * g2[1]) + n1 + n2) * 8.31 * dT, 0)}$ J.`, { n1, n2, a: g1[1], b: g2[1], dT });
  }, (p) => (p.v === 0 ? (1 + 1 / ((p.n1 * p.a + p.n2 * p.b) / (p.n1 + p.n2))) : p.v === 1 ? (p.n1 * p.a + p.n2 * p.b) / (p.n1 + p.n2) : (p.n1 * (p.a + 1) + p.n2 * (p.b + 1)) * 8.31 * p.dT)),

  mk('th-g11', 4, 'polytropic process', (rng) => {
    const v = int(rng, 0, 2); const [gname, cv] = choose(rng, GAS); const nn = choose(rng, [0.5, 1.5, 2, 3, -1, 0]); const n = nn === 1 ? 2 : nn;
    if (v === 0) { const C = cv + 1 / (1 - n); return out(v, r`${gname.replace('a ', 'A ')} gas follows $PV^{${n}} = $ constant. Find its molar heat capacity in units of $R$ (3 decimals) using $C = C_v + R/(1 - n)$.`, C, 3, 'R', r`$C = ${cv}R + \dfrac{R}{1 - ${n}} = ${R(C, 3)}R$.`, { cv, n }); }
    if (v === 1) { const P1V1 = pick(rng, 400, 1200, 200); const k = choose(rng, [2, 3, 4]); if (n === 0) return out(v, r`A gas at constant pressure ($PV^0 = $ const) expands from ${P1V1} J worth of $PV$ ($P_1V_1 = ${P1V1}$ J) to ${k} times its volume. Find the work done (in J).`, P1V1 * (k - 1), 0, 'J', r`$W = P(V_2 - V_1) = ${P1V1}\times${k - 1} = ${P1V1 * (k - 1)}$ J.`, { P1V1, k, n: 0 });
      const P2V2 = P1V1 * k ** (1 - n); const W = (P1V1 - P2V2) / (n - 1); return out(v, r`A gas with $P_1V_1 = ${P1V1}$ J expands polytropically ($PV^{${n}} = $ constant) to ${k} times its volume. Find the work done by the gas (in J, 1 decimal).`, W, 1, 'J', r`$P_2V_2 = P_1V_1k^{1 - n} = ${R(P2V2, 2)}$ J. $W = \dfrac{P_1V_1 - P_2V_2}{n - 1} = \dfrac{${P1V1} - ${R(P2V2, 2)}}{${R(n - 1, 2)}} = ${R(W, 1)}$ J.`, { P1V1, k, n }); }
    const T1 = pick(rng, 300, 500, 100); const k = choose(rng, [2, 4]); const T2 = T1 * k ** (1 - n); return out(v, r`A gas follows $PV^{${n}} = $ constant and its volume becomes ${k} times the initial volume at ${T1} K. Find the final temperature (in K, 1 decimal).`, T2, 1, 'K', r`$TV^{n - 1} = $ constant, so $T_2 = T_1(V_1/V_2)^{n - 1} = ${T1}\times${k}^{${R(1 - n, 2)}} = ${R(T2, 1)}$ K.`, { T1, k, n });
  }, (p) => { if (p.v === 0) return p.cv + 1 / (1 - p.n); if (p.v === 1) return p.n === 0 ? p.P1V1 * (p.k - 1) : (p.P1V1 - p.P1V1 * Math.pow(p.k, 1 - p.n)) / (p.n - 1); return p.T1 * Math.pow(p.k, 1 - p.n); }),

  mk('th-g12', 2, 'work from P-V graph', (rng) => {
    const v = int(rng, 0, 2); const P1 = pick(rng, 1, 3, 1); const P2 = P1 + pick(rng, 1, 4, 1); const V1 = pick(rng, 1, 4, 1); const V2 = V1 + pick(rng, 1, 5, 1);
    if (v === 0) return out(v, r`A gas goes from ${P1}$\times10^5$ Pa and ${V1} L to ${P2}$\times10^5$ Pa and ${V2} L along a straight line on a P-V graph. Find the work done by the gas (in J).`, 0.5 * (P1 + P2) * 1e5 * (V2 - V1) * 1e-3, 0, 'J', r`Area under the line $= \tfrac12(P_1 + P_2)\Delta V = \tfrac12\times${P1 + P2}\times10^5\times${V2 - V1}\times10^{-3} = ${0.5 * (P1 + P2) * 100 * (V2 - V1)}$ J.`, { P1, P2, V1, V2 });
    if (v === 1) return out(v, r`A gas is taken clockwise round a rectangle on a P-V graph with pressures ${P1}$\times10^5$ Pa and ${P2}$\times10^5$ Pa and volumes ${V1} L and ${V2} L. Find the net work done by the gas per cycle (in J).`, (P2 - P1) * 100 * (V2 - V1), 0, 'J', r`Net work $=$ area $= (${P2} - ${P1})\times10^5\times(${V2} - ${V1})\times10^{-3} = ${(P2 - P1) * 100 * (V2 - V1)}$ J.`, { P1, P2, V1, V2 });
    return out(v, r`A gas goes round a right-angled triangle clockwise on a P-V graph: vertical side from ${P1}$\times10^5$ to ${P2}$\times10^5$ Pa at ${V1} L, then back along the hypotenuse to ${P1}$\times10^5$ Pa at ${V2} L, then along the horizontal side. Find the net work (in J, 1 decimal).`, 0.5 * (P2 - P1) * 100 * (V2 - V1), 1, 'J', r`Area $=\tfrac12\times(${P2} - ${P1})\times10^5\times(${V2} - ${V1})\times10^{-3} = ${0.5 * (P2 - P1) * 100 * (V2 - V1)}$ J.`, { P1, P2, V1, V2 });
  }, (p) => (p.v === 0 ? (p.P1 * p.V1 * 0 + (p.P1 + p.P2) * (p.V2 - p.V1) * 50) : p.v === 1 ? (p.P2 - p.P1) * (p.V2 - p.V1) * 100 : (p.P2 - p.P1) * (p.V2 - p.V1) * 50)),
];

gens.push(
  mk('th-g13', 4, 'cyclic process', (rng) => {
    const v = int(rng, 0, 2); const [gname, cv] = choose(rng, GAS.slice(0, 2)); const a = choose(rng, [2, 3, 4]); const b = choose(rng, [2, 3]); const P0V0 = pick(rng, 100, 500, 100);
    const Qin = cv * (a - 1) * P0V0 + (cv + 1) * a * (b - 1) * P0V0; const W = (a - 1) * (b - 1) * P0V0;
    if (v === 0) return out(v, r`${gname.replace('a ', 'A ')} gas goes clockwise round the rectangle $(P_0, V_0)\to(${a}P_0, V_0)\to(${a}P_0, ${b}V_0)\to(P_0, ${b}V_0)\to$ start. Find the efficiency of this cycle (%, 1 decimal).`, W / Qin * 100, 1, '%', r`Net work $W = (${a} - 1)(${b} - 1)P_0V_0 = ${(a - 1) * (b - 1)}P_0V_0$. Heat enters on the isochoric rise: $${cv}\times${a - 1}P_0V_0$, and on the isobaric expansion at $${a}P_0$: $${cv + 1}\times${a}\times${b - 1}P_0V_0$. $Q_{in} = ${R(Qin / P0V0, 2)}P_0V_0$. $\eta = ${R(W / Qin * 100, 1)}\%$.`, { cv, a, b, P0V0 });
    if (v === 1) return out(v, r`${gname.replace('a ', 'A ')} gas goes clockwise round the rectangle $(P_0, V_0)\to(${a}P_0, V_0)\to(${a}P_0, ${b}V_0)\to(P_0, ${b}V_0)\to$ start, with $P_0V_0 = ${P0V0}$ J. Find the heat absorbed per cycle (in J).`, Qin, 0, 'J', r`Isochoric rise: $${cv}\times(${a} - 1)\times${P0V0} = ${R(cv * (a - 1) * P0V0, 1)}$ J. Isobaric expansion: $${cv + 1}\times${a}\times(${b} - 1)\times${P0V0} = ${R((cv + 1) * a * (b - 1) * P0V0, 1)}$ J. Total $= ${R(Qin, 1)}$ J.`, { cv, a, b, P0V0 });
    return out(v, r`${gname.replace('a ', 'A ')} gas goes clockwise round the rectangle $(P_0, V_0)\to(${a}P_0, V_0)\to(${a}P_0, ${b}V_0)\to(P_0, ${b}V_0)\to$ start, with $P_0V_0 = ${P0V0}$ J. Find the heat rejected per cycle (in J).`, Qin - W, 0, 'J', r`$Q_{in} = ${R(Qin, 1)}$ J (isochoric rise plus isobaric expansion) and $W = ${(a - 1) * (b - 1)}\times${P0V0} = ${W}$ J. Heat rejected $= Q_{in} - W = ${R(Qin - W, 1)}$ J.`, { cv, a, b, P0V0 });
  }, (p) => { const qi = p.cv * (p.a - 1) * p.P0V0 + (p.cv + 1) * p.a * (p.b - 1) * p.P0V0; const w = (p.a - 1) * (p.b - 1) * p.P0V0; return p.v === 0 ? w / qi * 100 : p.v === 1 ? qi : qi - w; }),

  mk('th-g14', 3, 'phase change and the first law', (rng) => {
    const v = int(rng, 0, 2); const m = pick(rng, 1, 10, 1);
    if (v === 0) { const dV = pick(rng, 1500, 1700, 50); const Q = 2256 * m; const W = 1.013e5 * (dV * m - m) * 1e-6; return out(v, r`${m} g of water at $100\,^\circ$C turns to steam at 1 atm. The steam of 1 g occupies ${dV} $\mathrm{cm^3}$ (water 1 $\mathrm{cm^3}$). With $L_v = 2256\ \mathrm{J\,g^{-1}}$, find the increase in internal energy (in J, nearest whole number). 1 atm $= 1.013\times10^5$ Pa.`, Q - W, 0, 'J', r`$Q = ${m}\times2256 = ${Q}$ J. $W = P\Delta V = 1.013\times10^5\times${m}\times${dV - 1}\times10^{-6} = ${R(W, 1)}$ J. $\Delta U = Q - W = ${R(Q - W, 0)}$ J.`, { m, dV }); }
    if (v === 1) { const Q = m * 336; return out(v, r`${m} g of ice melts at $0\,^\circ$C. Ignoring the tiny volume change, find the increase in internal energy (in J). ($L_f = 336\ \mathrm{J\,g^{-1}}$)`, Q, 0, 'J', r`$W\approx0$, so $\Delta U\approx Q = ${m}\times336 = ${Q}$ J.`, { m }); }
    const dV = pick(rng, 1500, 1700, 50); const W = 1.013e5 * (dV - 1) * 1e-6; const frac = W / 2256 * 100; return out(v, r`Boiling 1 g of water at 1 atm gives ${dV} $\mathrm{cm^3}$ of steam, with $L_v = 2256$ J. What percentage (1 decimal) of the latent heat does the expansion work against the atmosphere? (1 atm $= 1.013\times10^5$ Pa)`, frac, 1, '%', r`$W = P\Delta V = 1.013\times10^5\times${dV - 1}\times10^{-6} = ${R(W, 1)}$ J. Fraction $= ${R(W, 1)}/2256 = ${R(frac, 1)}\%$. The remaining part raises the internal energy.`, { dV });
  }, (p) => (p.v === 0 ? 2256 * p.m - 1.013e5 * (p.dV - 1) * p.m * 1e-6 : p.v === 1 ? p.m * 336 : 1.013e5 * (p.dV - 1) * 1e-6 / 2256 * 100)),

  mk('th-g15', 4, 'entropy', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const Q = pick(rng, 300, 900, 100); const Th = pick(rng, 400, 600, 100); const Tc = pick(rng, 250, 350, 50); const dS = Q / Tc - Q / Th; return out(v, r`${Q} J of heat flows from a large body at ${Th} K to a large body at ${Tc} K. Find the entropy change of the universe (in J K$^{-1}$, 3 decimals).`, dS, 3, 'J/K', r`$\Delta S = -\dfrac{${Q}}{${Th}} + \dfrac{${Q}}{${Tc}} = ${R(dS, 3)}\ \mathrm{J\,K^{-1}}$. It is positive.`, { Q, Th, Tc }); }
    if (v === 1) { const m = pick(rng, 1, 3, 1); const T1 = pick(rng, 280, 320, 20); const T2 = T1 + pick(rng, 40, 100, 20); const dS = m * 4200 * Math.log(T2 / T1); return out(v, r`${m} kg of water is heated slowly from ${T1} K to ${T2} K. Find its entropy increase (in J K$^{-1}$, nearest whole number). $c = 4200$ SI.`, dS, 0, 'J/K', r`$\Delta S = mc\ln(T_2/T_1) = ${m}\times4200\times\ln(${T2}/${T1}) = ${R(dS, 0)}\ \mathrm{J\,K^{-1}}$.`, { m, T1, T2 }); }
    if (v === 2) { const n = pick(rng, 1, 4, 1); const k = choose(rng, [2, 3, 4]); const dS = n * 8.31 * Math.log(k); return out(v, r`${n} mol of an ideal gas expand freely to ${k} times their volume. Find the entropy increase of the gas (in J K$^{-1}$, 2 decimals). $R = 8.31$.`, dS, 2, 'J/K', r`Use a reversible isothermal path between the same states: $\Delta S = nR\ln(V_2/V_1) = ${n}\times8.31\times\ln${k} = ${R(dS, 2)}\ \mathrm{J\,K^{-1}}$.`, { n, k }); }
    const m = pick(rng, 50, 200, 50); const dS = m * 336 / 273; return out(v, r`${m} g of ice melts at $0\,^\circ$C (273 K). Find the entropy increase (in J K$^{-1}$, 1 decimal). $L_f = 336\ \mathrm{J\,g^{-1}}$.`, dS, 1, 'J/K', r`$\Delta S = Q/T = ${m}\times336/273 = ${R(dS, 1)}\ \mathrm{J\,K^{-1}}$.`, { m });
  }, (p) => (p.v === 0 ? p.Q * (p.Th - p.Tc) / (p.Th * p.Tc) : p.v === 1 ? p.m * 4200 * Math.log(p.T2 / p.T1) : p.v === 2 ? p.n * 8.31 * Math.log(p.k) : p.m * 336 / 273)),

  mk('th-g16', 3, 'Otto cycle', (rng) => {
    const v = int(rng, 0, 2); const rr = choose(rng, [6, 7, 8, 9, 10]); const eta = 1 - rr ** -0.4;
    if (v === 0) return out(v, r`An ideal Otto engine has compression ratio ${rr} and $\gamma = 1.4$. Find its efficiency (%, 1 decimal).`, eta * 100, 1, '%', r`$\eta = 1 - r^{1 - \gamma} = 1 - ${rr}^{-0.4} = ${R(eta, 4)}$, i.e. ${R(eta * 100, 1)}%.`, { rr });
    if (v === 1) { const Q = pick(rng, 1000, 3000, 500); return out(v, r`An ideal Otto engine with compression ratio ${rr} ($\gamma = 1.4$) takes ${Q} J of heat per cycle. Find the work done per cycle (in J, nearest whole number).`, Q * eta, 0, 'J', r`$\eta = 1 - ${rr}^{-0.4} = ${R(eta, 4)}$. $W = \eta Q = ${R(eta, 4)}\times${Q} = ${R(Q * eta, 0)}$ J.`, { rr, Q }); }
    const T1 = pick(rng, 290, 320, 10); const T2 = T1 * rr ** 0.4; return out(v, r`In an ideal Otto engine the air ($\gamma = 1.4$) at ${T1} K is compressed adiabatically with compression ratio ${rr}. Find the temperature at the end of compression (in K, nearest whole number).`, T2, 0, 'K', r`$T_2 = T_1r^{\gamma - 1} = ${T1}\times${rr}^{0.4} = ${R(T2, 0)}$ K.`, { rr, T1 });
  }, (p) => (p.v === 0 ? (1 - Math.pow(p.rr, -0.4)) * 100 : p.v === 1 ? p.Q * (1 - Math.pow(p.rr, -0.4)) : p.T1 * Math.pow(p.rr, 0.4))),

  mk('th-g17', 4, 'refrigerator and latent heat', (rng) => {
    const v = int(rng, 0, 2); const m = pick(rng, 1, 5, 1); const t0 = pick(rng, 15, 30, 5); const cop = choose(rng, [4, 5, 6]); const P = pick(rng, 200, 500, 100);
    const Q = m * (4200 * t0 + 3.36e5); const W = Q / cop;
    if (v === 0) return out(v, r`A refrigerator of COP ${cop} makes ice at $0\,^\circ$C from ${m} kg of water at ${t0} $^\circ$C. Find the work needed (in kJ, 1 decimal). ($c_w = 4200$, $L_f = 3.36\times10^5$ SI)`, W / 1000, 1, 'kJ', r`Heat to remove $= ${m}\times(4200\times${t0} + 3.36\times10^5) = ${R(Q / 1000, 1)}$ kJ. $W = Q/\mathrm{COP} = ${R(Q / 1000, 1)}/${cop} = ${R(W / 1000, 1)}$ kJ.`, { m, t0, cop });
    if (v === 1) return out(v, r`A refrigerator of COP ${cop} and motor power ${P} W freezes ${m} kg of water at ${t0} $^\circ$C into ice at $0\,^\circ$C. How long does it take (in minutes, 1 decimal)? ($c_w = 4200$, $L_f = 3.36\times10^5$ SI)`, W / P / 60, 1, 'min', r`Heat to remove $= ${R(Q, 0)}$ J. Work $= Q/${cop} = ${R(W, 0)}$ J. $t = W/P = ${R(W, 0)}/${P} = ${R(W / P, 0)}$ s $= ${R(W / P / 60, 1)}$ min.`, { m, t0, cop, P });
    return out(v, r`A refrigerator of COP ${cop} removes heat from water at ${t0} $^\circ$C, making ${m} kg of ice at $0\,^\circ$C. How much heat (in kJ, nearest whole number) does it deliver to the room? ($c_w = 4200$, $L_f = 3.36\times10^5$ SI)`, (Q + W) / 1000, 0, 'kJ', r`$Q_2 = ${R(Q / 1000, 1)}$ kJ, $W = Q_2/${cop} = ${R(W / 1000, 1)}$ kJ. Heat to the room $= Q_2 + W = ${R((Q + W) / 1000, 0)}$ kJ.`, { m, t0, cop });
  }, (p) => { const q = p.m * (4200 * p.t0 + 336000); return p.v === 0 ? q / p.cop / 1000 : p.v === 1 ? q / p.cop / p.P / 60 : q * (1 + 1 / p.cop) / 1000; }),

  mk('th-g18', 5, 'irreversible adiabatic', (rng) => {
    const v = int(rng, 0, 2); const [gname, cv] = choose(rng, GAS.slice(0, 2)); const T1 = pick(rng, 300, 400, 50); const f = choose(rng, [0.5, 0.25]); const T2 = T1 * (cv + f) / (cv + 1);
    if (v === 0) return out(v, r`${gname.replace('a ', 'A ')} gas at ${T1} K is in an insulated cylinder. The external pressure is suddenly changed to ${f} times the gas pressure and held; the gas settles. Find the final temperature (in K, 1 decimal).`, T2, 1, 'K', r`No heat flows: $nC_v(T_2 - T_1) = -P_2(V_2 - V_1)$ with $P_2 = ${f}P_1$ and $V = nRT/P$. Dividing by $nR$: $${cv}(T_2 - T_1) = -T_2 + ${f}T_1$. $T_2 = T_1\dfrac{${cv} + ${f}}{${cv} + 1} = ${R(T2, 1)}$ K.`, { T1, cv, f });
    if (v === 1) { const gam = (cv + 1) / cv; const Tr = T1 * f ** ((gam - 1) / gam); return out(v, r`${gname.replace('a ', 'A ')} gas at ${T1} K is expanded in an insulated cylinder slowly (reversibly) until its pressure is ${f} times the initial pressure. Find the final temperature (in K, 1 decimal).`, Tr, 1, 'K', r`Reversible adiabatic: $T\propto P^{(\gamma - 1)/\gamma}$ with $\gamma = ${R(gam, 3)}$. $T_2 = ${T1}\times${f}^{${R((gam - 1) / gam, 4)}} = ${R(Tr, 1)}$ K.`, { T1, cv, f }); }
    const gam = (cv + 1) / cv; const Tr = T1 * f ** ((gam - 1) / gam); return out(v, r`${gname.replace('a ', 'A ')} gas at ${T1} K expands in an insulated cylinder until its pressure falls to ${f} times the initial value. How many kelvin hotter (1 decimal) is the final gas when the external pressure is dropped suddenly than when the expansion is slow?`, T2 - Tr, 1, 'K', r`Sudden: $T_2 = ${T1}(${cv} + ${f})/(${cv} + 1) = ${R(T2, 1)}$ K. Slow: $T_2' = ${T1}\times${f}^{${R((gam - 1) / gam, 4)}} = ${R(Tr, 1)}$ K. Difference $= ${R(T2 - Tr, 1)}$ K. The sudden expansion does less work, so the gas cools less.`, { T1, cv, f });
  }, (p) => { const gam = (p.cv + 1) / p.cv; const sud = p.T1 * (p.cv + p.f) / (p.cv + 1); const rev = p.T1 * Math.pow(p.f, (gam - 1) / gam); return p.v === 0 ? sud : p.v === 1 ? rev : sud - rev; }),

  mk('th-g19', 4, 'mixing of gases', (rng) => {
    const v = int(rng, 0, 1); const n1 = pick(rng, 1, 3, 1); const n2 = pick(rng, 1, 3, 1); const T1 = pick(rng, 250, 350, 50); const T2 = T1 + pick(rng, 50, 150, 50);
    const T = (n1 * 1.5 * T1 + n2 * 2.5 * T2) / (n1 * 1.5 + n2 * 2.5);
    if (v === 0) return out(v, r`In an insulated vessel, ${n1} mol of helium at ${T1} K is separated from ${n2} mol of rigid diatomic hydrogen at ${T2} K by a partition. The partition is removed. Find the final temperature (in K, 1 decimal).`, T, 1, 'K', r`Total internal energy is conserved: $${n1}\times1.5R\times${T1} + ${n2}\times2.5R\times${T2} = (${n1}\times1.5 + ${n2}\times2.5)RT$. $T = \dfrac{${n1 * 1.5 * T1} + ${n2 * 2.5 * T2}}{${n1 * 1.5 + n2 * 2.5}} = ${R(T, 1)}$ K.`, { n1, n2, T1, T2 });
    const T3 = T1 + 100; const Tm = (n1 * T1 + n2 * T3) / (n1 + n2); return out(v, r`Two insulated rigid vessels hold ${n1} mol and ${n2} mol of the same ideal gas at ${T1} K and ${T3} K. They are joined and the gases mix. Find the final temperature (in K, 1 decimal).`, Tm, 1, 'K', r`Same $C_v$, so $T = \dfrac{n_1T_1 + n_2T_2}{n_1 + n_2} = \dfrac{${n1}\times${T1} + ${n2}\times${T3}}{${n1 + n2}} = ${R(Tm, 1)}$ K.`, { n1, n2, T1, T3 });
  }, (p) => (p.v === 0 ? (p.n1 * 1.5 * p.T1 + p.n2 * 2.5 * p.T2) / (p.n1 * 1.5 + p.n2 * 2.5) : (p.n1 * p.T1 + p.n2 * p.T3) / (p.n1 + p.n2))),

  mk('th-g20', 3, 'bulk modulus and speed of sound', (rng) => {
    const v = int(rng, 0, 2); const P = pick(rng, 1, 5, 1); const [gname, cv] = choose(rng, GAS.slice(0, 2)); const ga = (cv + 1) / cv;
    if (v === 0) return out(v, r`Find the adiabatic bulk modulus (in kPa, nearest whole number) of ${gname} gas at a pressure of ${P}$\times10^5$ Pa.`, ga * P * 100, 0, 'kPa', r`$B_{ad} = \gamma P = ${R(ga, 3)}\times${P}\times10^5 = ${R(ga * P * 100, 0)}$ kPa.`, { P, cv });
    if (v === 1) return out(v, r`Find the ratio of the adiabatic to the isothermal bulk modulus of ${gname} gas (3 decimals).`, ga, 3, '', r`$B_{ad} = \gamma P$ and $B_{iso} = P$, so the ratio is $\gamma = ${R(ga, 3)}$.`, { cv });
    const T = pick(rng, 250, 400, 50); const M = choose(rng, [0.004, 0.028, 0.032]); const vs = Math.sqrt(ga * 8.31 * T / M); return out(v, r`Find the speed of sound (in $\mathrm{m\,s^{-1}}$, nearest whole number) in ${gname} gas of molar mass ${M} kg/mol at ${T} K. $R = 8.31$.`, vs, 0, 'm/s', r`$v = \sqrt{\gamma RT/M} = \sqrt{${R(ga, 3)}\times8.31\times${T}/${M}} = ${R(vs, 0)}\ \mathrm{m\,s^{-1}}$.`, { cv, T, M });
  }, (p) => { const ga = (p.cv + 1) / p.cv; return p.v === 0 ? p.P * 100 * (1 + 1 / p.cv) : p.v === 1 ? 1 + 1 / p.cv : Math.sqrt((1 + 1 / p.cv) * 8.31 * p.T / p.M); }),

  mk('th-g21', 3, 'degrees of freedom and internal energy', (rng) => {
    const v = int(rng, 0, 2); const f = choose(rng, [3, 5, 6, 7]); const n = pick(rng, 1, 4, 1); const dT = pick(rng, 20, 100, 10);
    if (v === 0) return out(v, r`${n} mol of an ideal gas with ${f} degrees of freedom per molecule is heated by ${dT} K. Find the increase in internal energy (in J, nearest whole number). $R = 8.31$.`, f / 2 * n * 8.31 * dT, 0, 'J', r`$\Delta U = \dfrac f2nR\Delta T = \dfrac{${f}}{2}\times${n}\times8.31\times${dT} = ${R(f / 2 * n * 8.31 * dT, 0)}$ J.`, { f, n, dT });
    if (v === 1) return out(v, r`Find $\gamma$ (3 decimals) of an ideal gas whose molecules have ${f} degrees of freedom.`, 1 + 2 / f, 3, '', r`$\gamma = 1 + 2/f = 1 + 2/${f} = ${R(1 + 2 / f, 3)}$.`, { f });
    const Q = pick(rng, 1000, 5000, 500); return out(v, r`${n} mol of a gas with ${f} degrees of freedom is heated at constant pressure and absorbs ${Q} J. Find the rise in temperature (in K, 1 decimal). $R = 8.31$.`, Q / (n * (f / 2 + 1) * 8.31), 1, 'K', r`$C_p = (\tfrac f2 + 1)R = ${f / 2 + 1}R$. $\Delta T = \dfrac{Q}{nC_p} = \dfrac{${Q}}{${n}\times${f / 2 + 1}\times8.31} = ${R(Q / (n * (f / 2 + 1) * 8.31), 1)}$ K.`, { f, n, Q });
  }, (p) => (p.v === 0 ? p.f * p.n * 8.31 * p.dT / 2 : p.v === 1 ? (p.f + 2) / p.f : p.Q / (p.n * (p.f + 2) / 2 * 8.31))),
);

// ======== Expansion block (added 2026-11-22): more hard items and templates, ids th-x001 onward ========
import * as XH from '../_entrance.js';
import { tidyGens } from '../_util.js';
const { pick: xpick, int: xint, choose: xchoose, fmt: xfmt, shuffleOpts: xsh, numOpts: xno } = XH;
const xr = String.raw;
const XE = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xex = (level, type, neet) => { const e = [...XE[level]]; if (neet && level === 4) e.push('neet'); if (false && level <= 3 && type === 'mcq') e.push('cuet'); return e; };
let xk = 0, xc = 0;
const XPOS = [2, 0, 3, 1, 3, 1, 0, 2];
const xb = (level, sub, o) => { const { neet, ...rest } = o; return { id: `th-x${String(++xk).padStart(3, '0')}`, level, exams: xex(level, o.type, neet), sub, ...rest }; };
const xq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xn = (level, sub, q, ans, tol, calc, sol, o = {}) => {
  const v = calc();
  if (!(Math.abs(v - ans) <= Math.max(tol, 1e-9) + 1e-9)) throw new Error(`th item ${xk + 1}: calc ${v} vs answer ${ans}`);
  return xb(level, sub, { type: 'nat', format: tol === 0 && Number.isInteger(ans) ? 'integer' : 'numeric', q, answer: ans, tol, calc, sol, ...o });
};
const xs = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XAO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xa = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XAO, answer, sol, ...o });
const XSO = ['Both Statement I and Statement II are true and II explains I', 'Both Statement I and Statement II are true but II does not explain I', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true'];
const xt = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XSO, answer, sol, ...o });
const XSW = [['A', 'B'], ['C', 'D'], ['A', 'C'], ['B', 'D'], ['A', 'D'], ['B', 'C']];
/** match item: map like {A:'q',B:'s',C:'p',D:'r'}; three wrong codes made by swapping two answers. */
const xm = (level, sub, group, q, map, sol, o = {}) => {
  const code = (m) => ['A', 'B', 'C', 'D'].map((l) => `${l}-${m[l]}`).join(', ');
  const wrongs = [];
  for (let i = 0; wrongs.length < 3; i++) { const [a, b] = XSW[(xc + i) % 6]; const m = { ...map }; [m[a], m[b]] = [m[b], m[a]]; wrongs.push(code(m)); }
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, code(map));
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const XMU = xr`\mathrm{m\,s^{-1}}`;

const xgroups = {
  xm1: { title: 'Molar heat capacity of one mole of a monatomic ideal gas', list1: ['A. Isothermal process', 'B. Adiabatic process', 'C. Isobaric process', 'D. Isochoric process'],
    list2: ['p. 0', xr`q. $\tfrac32R$`, xr`r. $\tfrac52R$`, 's. Infinite', 't. $R$'] },
  xm2: { title: 'Carnot engines', list1: ['A. Source 600 K, sink 300 K', 'B. Source 400 K, sink 300 K', 'C. Source 500 K, sink 400 K', 'D. Source 1000 K, sink 250 K'],
    list2: ['p. 20%', 'q. 25%', 'r. 50%', 's. 75%', 't. 60%'] },
  xm3: { title: 'One mole of a monatomic gas starts at $(P_0, V_0, T_0)$. Heat absorbed by the gas in each change', list1: [xr`A. Isobaric, volume doubled`, xr`B. Isochoric, pressure doubled`, xr`C. Isothermal, volume doubled`, xr`D. Reversible adiabatic, volume doubled`],
    list2: ['p. 0', xr`q. $0.69\,RT_0$`, xr`r. $1.5\,RT_0$`, xr`s. $2.5\,RT_0$`, xr`t. $3\,RT_0$`] },
  xm4: { title: 'Exponent $x$ in the adiabatic relations of ideal gases ($\\gamma = 5/3$ monatomic, $7/5$ diatomic)', list1: [xr`A. $TV^{x} = $ constant, monatomic gas`, xr`B. $TV^{x} = $ constant, rigid diatomic gas`, xr`C. $TP^{x} = $ constant, monatomic gas`, xr`D. $PV^{x} = $ constant, monatomic gas`],
    list2: [xr`p. $2/3$`, xr`q. $2/5$`, xr`r. $-2/5$`, xr`s. $5/3$`, xr`t. $7/5$`] },
  xm5: { title: 'Entropy change of the gas (take $R = 8.31$ J mol$^{-1}$K$^{-1}$)', list1: [xr`A. 1 mol, isothermal, volume doubled`, xr`B. 1 mol monatomic, heated at constant pressure from $T$ to $2T$`, xr`C. 1 mol monatomic, heated at constant volume from $T$ to $2T$`, xr`D. 1 mol, reversible adiabatic expansion`],
    list2: ['p. 0', xr`q. 5.76 J K$^{-1}$`, xr`r. 8.64 J K$^{-1}$`, xr`s. 14.4 J K$^{-1}$`, xr`t. 11.5 J K$^{-1}$`] },
  xm6: { title: 'Molar heat capacity of a monatomic ideal gas in the process shown', list1: [xr`A. $P \propto V$`, xr`B. $PV^2 = $ constant`, xr`C. $PV^3 = $ constant`, xr`D. $P = $ constant`],
    list2: [xr`p. $\tfrac12R$`, xr`q. $R$`, xr`r. $\tfrac32R$`, xr`s. $2R$`, xr`t. $\tfrac52R$`] },
  xm7: { title: 'One mole of a monatomic gas starts at $(P_0, V_0)$ and the volume is doubled. Work done by the gas, in units of $P_0V_0$', list1: ['A. Isobaric', 'B. Isothermal', 'C. Reversible adiabatic', xr`D. Along $P \propto V$`],
    list2: ['p. 0.555', 'q. 0.693', 'r. 1.00', 's. 1.50', 't. 2.00'] },
  xm8: { title: 'Coefficient of performance of ideal (Carnot) devices', list1: ['A. Refrigerator, inside 250 K, room 300 K', 'B. Refrigerator, inside 270 K, room 300 K', 'C. Heat pump, outside 270 K, room kept at 300 K', 'D. Heat pump, outside 280 K, room kept at 300 K'],
    list2: ['p. 5', 'q. 9', 'r. 10', 's. 15', 't. 20'] },
  xp1: { title: 'A triangular cycle',
    passage: xr`<p>One mole of a monatomic ideal gas goes round the cycle $A\to B\to C\to A$ on a P-V diagram. $A$ is $(V_0, P_0)$. $A\to B$ is isochoric to $(V_0, 2P_0)$. $B\to C$ is isobaric to $(2V_0, 2P_0)$. $C\to A$ is the straight line back to $A$; this line, if extended, passes through the origin.</p>` },
  xp2: { title: 'An isothermal step followed by an adiabatic step',
    passage: xr`<p>Two moles of a monatomic ideal gas ($R = 8.31$ J mol$^{-1}$K$^{-1}$) at 300 K expand reversibly. In step $A\to B$ the temperature is held at 300 K and the volume doubles. In step $B\to C$ the gas expands reversibly with no heat flow until its volume is 8 times the volume at $B$.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xn(2, 'first law', xr`A gas is compressed: 300 J of work is done on it and it gives out 100 J of heat to its surroundings. Find the change in its internal energy (in J).`, 200, 0, () => -100 - (-300),
    xr`Use $Q = \Delta U + W$ with $W$ the work done <i>by</i> the gas. Heat given out: $Q = -100$ J. Work done on the gas: $W = -300$ J. So $\Delta U = Q - W = -100 + 300 = 200$ J.`,
    { trap: 'Work done on the gas has a negative sign in Q = ΔU + W.' }),
  xq(2, 'specific heat in a process', 'The molar heat capacity of an ideal gas is infinite in', 'an isothermal process', ['an adiabatic process', 'an isochoric process', 'an isobaric process'],
    xr`$C = Q/(n\Delta T)$. In an isothermal process the gas takes in heat while $\Delta T = 0$, so $C\to\infty$. In an adiabatic process $Q = 0$, so $C = 0$. The isochoric and isobaric values are $C_v$ and $C_p$, which are finite.`),
  xn(2, 'Carnot engine', xr`A Carnot engine works between a source at $727\,^\circ$C and a sink at $27\,^\circ$C. Find its efficiency as a percentage.`, 70, 0, () => (1 - 300 / 1000) * 100,
    xr`Change to kelvin: $T_1 = 1000$ K, $T_2 = 300$ K. $\eta = 1 - T_2/T_1 = 1 - 0.3 = 0.70$, which is 70%.`,
    { trap: 'Using the Celsius values in the efficiency formula.' }),
  xn(2, 'internal energy', xr`Find the rise in internal energy (in J) of 2 mol of a monatomic ideal gas heated through 50 K. Take $R = 8.31$ J mol$^{-1}$K$^{-1}$.`, 1246.5, 1, () => 1.5 * 2 * 8.31 * 50,
    xr`$\Delta U = nC_v\Delta T = 2\times\tfrac32\times8.31\times50 = 1246.5$ J. The value is the same whatever the process, because $U$ of an ideal gas depends only on $T$.`),
  xn(2, 'isobaric process', xr`A gas at a constant pressure of $2\times10^5$ Pa expands from 3 L to 5 L. Find the work done by the gas (in J).`, 400, 0, () => 2e5 * (5 - 3) * 1e-3,
    xr`$W = P\Delta V = 2\times10^5\times(2\times10^{-3}\ \mathrm{m^3}) = 400$ J. Change litres to m$^3$ first: 1 L $= 10^{-3}$ m$^3$.`,
    { trap: 'Forgetting that 1 L is 10^-3 m^3.' }),
  xn(2, 'refrigerator', xr`A refrigerator with coefficient of performance 4 is supplied with 100 J of work in a cycle. How much heat (in J) does it release into the room in that cycle?`, 500, 0, () => 100 * 4 + 100,
    xr`Heat taken from the cold space: $Q_2 = \text{COP}\times W = 4\times100 = 400$ J. Heat released to the room: $Q_1 = Q_2 + W = 400 + 100 = 500$ J.`,
    { trap: 'Giving 400 J, the heat removed, instead of the heat released.' }),

  // ---------- Level 3 ----------
  xn(3, 'adiabatic process', xr`A monatomic ideal gas at 300 K is compressed reversibly and adiabatically until its pressure is 32 times the initial pressure. Find the final temperature (in K).`, 1200, 0, () => 300 * Math.pow(32, 0.4),
    xr`For an adiabatic change $T^{\gamma}P^{1-\gamma} = $ constant, so $T_2/T_1 = (P_2/P_1)^{(\gamma-1)/\gamma}$. With $\gamma = 5/3$ the exponent is $\tfrac{2/3}{5/3} = 0.4$. $T_2 = 300\times32^{0.4} = 300\times4 = 1200$ K, because $32^{0.4} = (2^5)^{2/5} = 4$.`,
    { trap: 'Using the exponent γ - 1 = 2/3 with pressure; that exponent goes with volume.' }),
  xn(3, 'isothermal process', xr`One mole of an ideal gas at 600 K expands isothermally to four times its volume. Find the work done by the gas (in J). $R = 8.31$ J mol$^{-1}$K$^{-1}$.`, 6912, 5, () => 8.31 * 600 * Math.log(4),
    xr`$W = nRT\ln(V_2/V_1) = 8.31\times600\times\ln4 = 4986\times1.3863 = 6912$ J.`,
    { trap: 'Using log10 instead of the natural logarithm.' }),
  xn(3, 'entropy', xr`Two moles of a monatomic ideal gas are heated in a rigid container from 300 K to 600 K. Find the increase in entropy of the gas (in J K$^{-1}$, 2 decimals). $R = 8.31$.`, 17.28, 0.05, () => 2 * 1.5 * 8.31 * Math.log(2),
    xr`At constant volume $dS = nC_v\,dT/T$, so $\Delta S = nC_v\ln(T_2/T_1) = 2\times1.5\times8.31\times\ln2 = 24.93\times0.6931 = 17.28$ J K$^{-1}$.`),
  xq(3, 'entropy', xr`One mole of an ideal gas expands freely into a vacuum, inside an insulated container, until its volume is doubled. The entropy change of the gas is`, xr`$R\ln2$`, [xr`zero, because no heat is exchanged`, xr`$-R\ln2$`, xr`$2R\ln2$`],
    xr`Entropy is a state function, so find a reversible path between the same states. The final state has the same $T$ (no change in $U$) and twice the volume, which is the same as an isothermal expansion: $\Delta S = nR\ln(V_2/V_1) = R\ln2 > 0$. The free expansion itself is irreversible, and $Q/T = 0$ is not the entropy change for an irreversible path.`,
    { trap: 'Using ΔS = Q/T with Q = 0 on the irreversible path.' }),
  xn(3, 'Carnot engine', xr`A Carnot engine has a source at 500 K and an efficiency of 40%. By how many kelvin must the sink temperature be lowered to raise the efficiency to 60%?`, 100, 0, () => 500 * 0.6 - 500 * 0.4,
    xr`First sink: $T_2 = T_1(1 - 0.40) = 300$ K. New sink: $T_2' = 500\times(1 - 0.60) = 200$ K. It is lowered by $300 - 200 = 100$ K.`),
  xn(3, 'work from P-V graph', xr`A gas follows a cycle that is an ellipse on a P-V diagram. The pressure ranges from $1\times10^5$ Pa to $3\times10^5$ Pa and the volume from 2 L to 6 L. Find the work done by the gas in one cycle (in J, nearest whole number).`, 628, 1, () => Math.PI * 1e5 * 2e-3,
    xr`The work is the area enclosed. The semi-axes are $\Delta P/2 = 1\times10^5$ Pa and $\Delta V/2 = 2\times10^{-3}$ m$^3$. Area $= \pi ab = \pi\times10^5\times2\times10^{-3} = 628$ J.`,
    { trap: 'Using the full ranges (not half) as the semi-axes, which gives 4 times the area.' }),
  xq(3, 'polytropic process', xr`A monatomic ideal gas follows the process $PV^2 = $ constant. Its molar heat capacity in this process is`, xr`$\tfrac12R$`, [xr`$\tfrac32R$`, xr`$\tfrac52R$`, xr`$-\tfrac12R$`],
    xr`For $PV^n = $ constant, $C = C_v + \dfrac{R}{1-n}$. With $C_v = \tfrac32R$ and $n = 2$: $C = \tfrac32R - R = \tfrac12R$. Choosing $\tfrac52R$ comes from adding $R$ (the isobaric case, $n = 0$), and $-\tfrac12R$ from a sign slip in $1 - n$.`,
    { trap: 'The sign in R/(1 - n).' }),
  xn(3, 'refrigerator', xr`An ideal refrigerator keeps its inside at $0\,^\circ$C in a room at $27\,^\circ$C (take $0\,^\circ$C $= 273$ K). It removes heat from the inside at the rate of 1000 J every second. Find the electrical power it needs (in W, 1 decimal).`, 98.9, 0.1, () => 1000 * (300 - 273) / 273,
    xr`$\text{COP} = T_2/(T_1 - T_2) = 273/27 = 10.11$. Power $= Q_2/\text{COP} = 1000/10.11 = 98.9$ W.`),
  xn(3, 'adiabatic process', xr`One mole of a monatomic ideal gas expands adiabatically and its temperature falls from 600 K to 300 K. How much work does it do, in units of $R$ (that is, find $W/R$ in kelvin)?`, 450, 0, () => 1.5 * (600 - 300),
    xr`$Q = 0$, so $W = -\Delta U = nC_v(T_1 - T_2) = \tfrac32R\times300 = 450R$. The answer is 450.`),
  xn(3, 'adiabatic process', xr`A monatomic ideal gas expands adiabatically and its temperature falls to one quarter of its initial value. By what factor does its pressure fall? Give the factor $P_1/P_2$.`, 32, 0, () => Math.pow(4, 2.5),
    xr`$T\propto P^{2/5}$ for $\gamma = 5/3$. So $P\propto T^{5/2}$ and $P_1/P_2 = 4^{5/2} = 2^5 = 32$.`,
    { trap: 'Using P ∝ T, as at constant volume.' }),
  xa(3, 'adiabatic process', xr`A gas heats up when it is compressed very rapidly in an insulated cylinder.`, xr`No heat can leave, so the work done on the gas increases its internal energy.`, 0,
    xr`With $Q = 0$ the first law gives $\Delta U = -W$. Compression makes $W$ negative, so $\Delta U > 0$ and the temperature of an ideal gas rises. R is exactly the reason for A.`),
  xt(3, 'PV curves', xr`At a given point of a P-V diagram the adiabatic curve of an ideal gas is steeper than the isothermal curve.`, xr`The slope of the adiabat is $\gamma$ times the slope of the isotherm at the same point, and $\gamma > 1$.`, 0,
    xr`Isotherm: $dP/dV = -P/V$. Adiabat: $dP/dV = -\gamma P/V$. Because $\gamma > 1$, the adiabat is steeper, and Statement II is the reason.`),
  xm(3, 'specific heats of gases', 'xm1', xr`Match each process in List I (for one mole of a monatomic ideal gas) with its molar heat capacity in List II.`, { A: 's', B: 'p', C: 'r', D: 'q' },
    xr`Isothermal: $\Delta T = 0$ with $Q\neq0$, so $C\to\infty$ (s). Adiabatic: $Q = 0$, so $C = 0$ (p). Isobaric: $C_p = \tfrac52R$ (r). Isochoric: $C_v = \tfrac32R$ (q). So A-s, B-p, C-r, D-q.`),
  xm(3, 'Carnot engine', 'xm2', xr`Match each pair of reservoir temperatures in List I with the efficiency of a Carnot engine in List II.`, { A: 'r', B: 'q', C: 'p', D: 's' },
    xr`$\eta = 1 - T_2/T_1$. A: $1 - 300/600 = 50\%$ (r). B: $1 - 300/400 = 25\%$ (q). C: $1 - 400/500 = 20\%$ (p). D: $1 - 250/1000 = 75\%$ (s).`),
  xq(3, 'cycle', xr`The net work in a closed cycle is the area enclosed on a P-V diagram. In which direction must the cycle be traversed for the gas to deliver net work?`, 'Clockwise', ['Anticlockwise', 'Either way, the work is the same', 'Along the isotherm only'],
    xr`The upper path (expansion at higher pressure) gives more work than the lower return path takes, so a clockwise loop gives net positive work. An anticlockwise loop is a refrigerator or heat pump cycle, with net work done on the gas.`),

  // ---------- Level 4 ----------
  xn(4, 'general processes', xr`One mole of a monatomic ideal gas follows the process $P = aV$ ($a$ constant) from $(P_0, V_0)$ to volume $3V_0$. Find the heat absorbed in units of $P_0V_0$.`, 16, 0, () => 1.5 * (9 - 1) + 0.5 * (9 - 1),
    xr`$P = aV$ gives $P_0 = aV_0$. At $3V_0$ the pressure is $3P_0$, so $PV$ goes from $P_0V_0$ to $9P_0V_0$. $\Delta U = \tfrac32\Delta(PV) = \tfrac32\times8P_0V_0 = 12P_0V_0$. Work $= \int aV\,dV = \tfrac12a(9V_0^2 - V_0^2) = 4P_0V_0$. $Q = 12 + 4 = 16P_0V_0$. Check with $C = 2R$: $Q = 2R\Delta T = 2\times8P_0V_0 = 16P_0V_0$.`,
    { trap: 'Taking the work as the average pressure times ΔV by mistake of using P0 only.' }),
  xn(4, 'refrigerator', xr`A Carnot engine of efficiency 20% is run backwards as a refrigerator between the same two reservoirs. It extracts 800 J from the cold reservoir per cycle. Find the work needed per cycle (in J).`, 200, 0, () => 800 / ((1 - 0.2) / 0.2),
    xr`For the engine $T_2/T_1 = 0.8$. As a refrigerator $\text{COP} = T_2/(T_1 - T_2) = 0.8/0.2 = 4$. $W = Q_2/\text{COP} = 800/4 = 200$ J.`,
    { trap: 'Using COP = 1/η = 5 or COP = η.' }),
  xn(4, 'degrees of freedom', xr`An ideal gas is heated at constant pressure. One quarter of the heat absorbed is converted into work. How many degrees of freedom does each molecule have?`, 6, 0, () => 2 / 0.25 - 2,
    xr`$W/Q = R/C_p = \dfrac{1}{f/2 + 1} = \dfrac{2}{f+2}$. Setting this equal to $\tfrac14$ gives $f + 2 = 8$, so $f = 6$ (a non-linear molecule with three translational and three rotational degrees).`),
  xn(4, 'Carnot engine', xr`The efficiency of a Carnot engine is 40%. If the source temperature is raised by 100 K with the sink fixed, the efficiency becomes 50%. Find the sink temperature (in K).`, 300, 0, () => { const T1 = 100 * (1 - 0.5) / (0.5 - 0.4); return T1 * 0.6; },
    xr`Let the source be $T_1$ and the sink $T_2$. $T_2 = 0.6T_1$ and $T_2 = 0.5(T_1 + 100)$. So $0.6T_1 = 0.5T_1 + 50$, giving $T_1 = 500$ K and $T_2 = 300$ K. Check: $1 - 300/600 = 0.5$.`),
  xn(4, 'entropy', xr`One mole of a monatomic ideal gas is heated at constant volume until its temperature is four times the initial value. Find the entropy change in units of $R\ln2$.`, 3, 0, () => 1.5 * Math.log(4) / Math.log(2),
    xr`$\Delta S = C_v\ln(T_2/T_1) = \tfrac32R\ln4 = \tfrac32R\times2\ln2 = 3R\ln2$. The answer is 3.`),
  xn(4, 'adiabatic process', xr`A monatomic ideal gas is compressed adiabatically and reversibly so that its temperature becomes four times the initial value. By what factor does its volume decrease?`, 8, 0, () => Math.pow(4, 1.5),
    xr`$TV^{\gamma-1} = $ constant with $\gamma - 1 = \tfrac23$. $V_1/V_2 = (T_2/T_1)^{3/2} = 4^{3/2} = 8$.`,
    { trap: 'Using V ∝ 1/T, the isobaric relation.' }),
  xn(4, 'refrigerator', xr`A Carnot refrigerator works between 250 K inside and 300 K outside, and 100 J of work is done on it in each cycle. Find the heat released to the surroundings per cycle (in J).`, 600, 0, () => 100 * (250 / 50) + 100,
    xr`$\text{COP} = 250/(300 - 250) = 5$. $Q_2 = 5\times100 = 500$ J. $Q_1 = Q_2 + W = 600$ J. Check with $Q_1/Q_2 = T_1/T_2 = 300/250 = 1.2$: $500\times1.2 = 600$.`),
  xn(4, 'heat pump', xr`A house loses heat at 6 kW. An ideal heat pump keeps it at 300 K when the outside air is at 270 K. Find the electrical power the pump needs (in W).`, 600, 0, () => 6000 / (300 / 30),
    xr`In steady state the pump must deliver 6 kW to the house. $\text{COP}_{hp} = T_1/(T_1 - T_2) = 300/30 = 10$. $W = Q_1/\text{COP} = 6000/10 = 600$ W.`),
  xn(4, 'entropy', xr`Three moles of an ideal gas expand freely into a vacuum from a volume $V$ to $4V$. Find the entropy increase (in J K$^{-1}$, 2 decimals). $R = 8.31$.`, 34.56, 0.05, () => 3 * 8.31 * Math.log(4),
    xr`The gas is thermally isolated and does no work, so $\Delta T = 0$. Use a reversible isothermal path with the same end states: $\Delta S = nR\ln(V_2/V_1) = 3\times8.31\times\ln4 = 34.56$ J K$^{-1}$.`),
  xn(4, 'Carnot cycle on T-S diagram', xr`On a T-S diagram, a cycle is the triangle $A(S = 1, T = 300)\to B(S = 1, T = 600)\to C(S = 3, T = 300)\to A$, with $S$ in J K$^{-1}$ and $T$ in K. Find its efficiency as a percentage (1 decimal).`, 33.3, 0.1, () => 100 * (0.5 * 2 * 300) / (0.5 * (600 + 300) * 2),
    xr`$A\to B$ is vertical (constant $S$): no heat. $B\to C$: $T$ falls from 600 to 300 as $S$ rises, and $Q = \int T\,dS = 450\times2 = 900$ J absorbed. $C\to A$ at 300 K: $Q = 300\times(-2) = -600$ J. Net work $= 300$ J. $\eta = 300/900 = 33.3\%$. (The area of the triangle is the net work.)`),
  xn(4, 'general processes', xr`One mole of a monatomic ideal gas follows $P\propto V$ while its temperature rises from 300 K to 400 K. Find the heat absorbed (in J). $R = 8.31$.`, 1662, 2, () => 2 * 8.31 * 100,
    xr`$P\propto V$ means $PV^{-1} = $ constant, $n = -1$. $C = C_v + R/(1 - n) = \tfrac32R + \tfrac12R = 2R$. $Q = 2R\Delta T = 2\times8.31\times100 = 1662$ J. Check: $\Delta U = 1246.5$ J, $W = \tfrac12R\Delta T = 415.5$ J; the sum is 1662 J.`,
    { neet: true }),
  xa(4, 'specific heat in a process', xr`The molar heat capacity of an ideal gas is infinite in an isothermal process.`, xr`In an isothermal process the gas absorbs heat but its temperature does not change.`, 0,
    xr`$C = Q/(n\Delta T)$. $Q\neq0$ and $\Delta T = 0$, so $C\to\infty$. R states exactly why.`),
  xa(4, 'isotherms', xr`Two different isotherms of a fixed mass of ideal gas never cross on a P-V diagram.`, xr`At any point of the diagram $PV = nRT$ fixes a single temperature.`, 0,
    xr`A crossing point would have one $(P, V)$ and so one value of $T$, but it would be on two different isotherms with two different $T$. That is impossible, so the isotherms (hyperbolas $PV = $ constant) never cross.`),
  xa(4, 'entropy', xr`When 1 mol of the same ideal gas at 300 K and 1 mol at 400 K, each in a rigid insulated vessel, are connected so that they mix, the entropy of the universe increases.`, xr`Heat flows irreversibly from the hotter gas to the cooler gas.`, 0,
    xr`The final temperature is 350 K. The 400 K gas loses entropy $C_v\ln(350/400)$ and the 300 K gas gains $C_v\ln(350/300)$. The sum is $C_v\ln(350^2/(400\times300)) = C_v\ln1.0208 > 0$. Heat flow across a finite temperature difference is the irreversible step, so R explains A.`),
  xt(4, 'Carnot engine', xr`All reversible engines working between the same two temperatures have the same efficiency.`, xr`The efficiency of a reversible engine depends on the working substance used.`, 2,
    xr`Carnot's theorem: $\eta = 1 - T_2/T_1$ for every reversible engine between $T_1$ and $T_2$, whatever the working substance. So I is true and II is false.`),
  xb(4, 'mixed statements', { type: 'mcq', format: 'statements', neet: true,
    q: xr`How many of these statements are correct?<br>(a) $\Delta U = nC_v\Delta T$ for an ideal gas in every process.<br>(b) The heat absorbed by an ideal gas in an isobaric process is $nC_p\Delta T$.<br>(c) The work done by an ideal gas in an isothermal expansion is zero.<br>(d) The temperature of an ideal gas does not change in a free expansion.<br>(e) The entropy of an isolated system never decreases.`,
    options: ['Two', 'Three', 'Four', 'Five'], answer: 2,
    sol: xr`(a) True: $U$ is a function of $T$ only, so the formula holds for any process. (b) True. (c) False: $\Delta U = 0$, but $W = Q = nRT\ln(V_2/V_1)\neq0$. (d) True: $Q = W = 0$ so $\Delta U = 0$. (e) True, the second law. Four are correct.`,
    trap: 'Confusing ΔU = 0 with W = 0.' }),
  xm(4, 'heat in processes', 'xm3', xr`Match each change in List I with the heat absorbed by the gas in List II.`, { A: 's', B: 'r', C: 'q', D: 'p' },
    xr`Take $T_0 = P_0V_0/R$. A: isobaric, $V\to2V_0$ so $T\to2T_0$: $Q = C_p\Delta T = \tfrac52RT_0$ (s). B: isochoric, $P\to2P_0$ so $T\to2T_0$: $Q = \tfrac32RT_0$ (r). C: isothermal: $Q = W = RT_0\ln2 = 0.69RT_0$ (q). D: adiabatic: $Q = 0$ (p).`),
  xm(4, 'adiabatic relations', 'xm4', xr`Match each relation in List I with its exponent $x$ in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`$TV^{\gamma-1}$: monatomic $x = \tfrac53 - 1 = \tfrac23$ (p); diatomic $x = \tfrac75 - 1 = \tfrac25$ (q). $T^{\gamma}P^{1-\gamma}$ = constant gives $TP^{(1-\gamma)/\gamma}$: monatomic $x = (1 - \tfrac53)/\tfrac53 = -\tfrac25$ (r). $PV^{\gamma}$: $x = \tfrac53$ (s).`),
  xm(4, 'entropy', 'xm5', xr`Match each change in List I with the entropy change of the gas in List II.`, { A: 'q', B: 's', C: 'r', D: 'p' },
    xr`A: $R\ln2 = 8.31\times0.693 = 5.76$ (q). B: $C_p\ln2 = 2.5\times5.76 = 14.4$ (s). C: $C_v\ln2 = 1.5\times5.76 = 8.64$ (r). D: reversible adiabatic means $dQ = 0$, so $\Delta S = 0$ (p).`),
  xm(4, 'COP', 'xm8', xr`Match each ideal device in List I with its coefficient of performance in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`Refrigerator: $\text{COP} = T_2/(T_1 - T_2)$. A: $250/50 = 5$ (p). B: $270/30 = 9$ (q). Heat pump: $\text{COP} = T_1/(T_1 - T_2)$ with $T_1 = 300$ K. C: $300/30 = 10$ (r). D: $300/20 = 15$ (s).`,
    { trap: 'A heat pump is judged by the heat it delivers to the room, so its COP is the refrigerator value plus 1.' }),
  xs(4, 'isobaric process', xr`A monatomic ideal gas expands at constant pressure $P_0$ from $V_0$ to $3V_0$. Which are correct?`,
    [xr`The work done by the gas is $2P_0V_0$.`, xr`The rise in internal energy is $3P_0V_0$.`, xr`The heat absorbed is $5P_0V_0$.`, xr`The final temperature is twice the initial temperature.`], [0, 1, 2],
    xr`$W = P_0(2V_0) = 2P_0V_0$. $\Delta U = \tfrac32\Delta(PV) = \tfrac32\times2P_0V_0 = 3P_0V_0$. $Q = 5P_0V_0$. The temperature is proportional to $V$ at constant $P$, so it becomes <i>three</i> times the initial value; the last option is false.`),
  xs(4, 'isothermal process', xr`One mole of an ideal gas is compressed isothermally and reversibly while in contact with a heat reservoir. Which are correct?`,
    [xr`The work done by the gas is positive.`, xr`The internal energy of the gas does not change.`, xr`The gas gives heat to the reservoir.`, xr`The entropy of the gas falls and the entropy of the reservoir rises by the same amount.`], [1, 2, 3],
    xr`In compression the work done <i>by</i> the gas is negative, so the first option is false. $\Delta U = 0$ (true). $Q = W < 0$: the gas gives heat out (true). The reservoir gains $|Q|/T$ and the gas loses $|Q|/T$, so the total entropy is unchanged for a reversible process (true).`),
  xs(4, 'general processes', xr`One mole of a monatomic ideal gas goes from $(P_0, V_0)$ to volume $2V_0$ along $P\propto V$. Which are correct?`,
    [xr`The work done by the gas is $1.5P_0V_0$.`, xr`The temperature rises to four times its initial value.`, xr`The heat absorbed is $5P_0V_0$.`, xr`The rise in internal energy is $4.5P_0V_0$.`], [0, 1, 3],
    xr`The pressure doubles to $2P_0$, so $PV$ rises from $P_0V_0$ to $4P_0V_0$ and $T$ becomes $4T_0$. $W = \tfrac12(4P_0V_0 - P_0V_0) = 1.5P_0V_0$. $\Delta U = \tfrac32\times3P_0V_0 = 4.5P_0V_0$. $Q = 4.5 + 1.5 = 6P_0V_0$, so the third option is false.`),
  xs(4, 'free expansion', xr`One mole of an ideal gas in a thermally insulated container expands freely into a vacuum and its volume doubles. Which are correct?`,
    ['The process can be drawn as an isothermal curve on a P-V diagram.', xr`$Q = 0$ and $W = 0$.`, 'The temperature of the gas does not change.', xr`The entropy of the gas increases by $R\ln2$.`], [1, 2, 3],
    xr`Free expansion is irreversible, so it has no path on a P-V diagram (only the end states can be marked), which makes the first option false. $Q = 0$, $W = 0$, hence $\Delta U = 0$ and $T$ is unchanged. $\Delta S$ is found along a reversible isothermal path: $R\ln2$.`),
  xs(4, 'isobaric process', xr`One mole of a rigid diatomic gas is heated at constant pressure, and its temperature rises from $T_0$ to $2T_0$. Which are correct?`,
    [xr`The heat absorbed is $3.5RT_0$.`, xr`The rise in internal energy is $3.5RT_0$.`, xr`The work done is $\tfrac27$ of the heat absorbed.`, xr`The work done is $RT_0$.`], [0, 2, 3],
    xr`$Q = C_p\Delta T = \tfrac72RT_0$. $\Delta U = C_v\Delta T = \tfrac52RT_0$ (so the second option is false). $W = R\Delta T = RT_0$, which is $\tfrac{R}{C_p} = \tfrac27$ of $Q$.`),
  xb(3, 'passage', { type: 'mcq', format: 'passage', group: 'xp1',
    q: xr`Find the heat absorbed by the gas in $A\to B$.`, options: [xr`$P_0V_0$`, xr`$1.5\,P_0V_0$`, xr`$2.5\,P_0V_0$`, xr`$3\,P_0V_0$`], answer: 1,
    sol: xr`$A\to B$ is isochoric, so $W = 0$. $Q = \Delta U = \tfrac32\Delta(PV) = \tfrac32(2P_0V_0 - P_0V_0) = 1.5P_0V_0$.` }),
  xn(4, 'cycle', xr`Find the total heat absorbed by the gas in one cycle, in units of $P_0V_0/2$. (In $C\to A$ the gas only loses heat.)`, 13, 0, () => (1.5 + 2.5 * 2) * 2,
    xr`$A\to B$: $Q = 1.5P_0V_0$. $B\to C$ isobaric at $2P_0$: $\Delta(PV) = 4P_0V_0 - 2P_0V_0 = 2P_0V_0$, so $Q = \tfrac52\times2P_0V_0 = 5P_0V_0$. $C\to A$ is along $P\propto V$ with $C = 2R > 0$ while $T$ falls, so $Q < 0$ throughout. Heat absorbed $= 1.5 + 5 = 6.5P_0V_0 = 13\times(P_0V_0/2)$.`,
    { format: 'passage', group: 'xp1', trap: 'Counting the heat given out in C→A as absorbed, or forgetting that B→C needs Cp, not Cv.' }),
  xn(4, 'cycle', xr`Find the efficiency of the cycle as a percentage (2 decimals).`, 7.69, 0.05, () => 100 * 0.5 / 6.5,
    xr`Net work = area of the triangle $= \tfrac12\times(2P_0 - P_0)\times(2V_0 - V_0) = 0.5P_0V_0$ (clockwise, so positive). Heat absorbed $= 6.5P_0V_0$. $\eta = 0.5/6.5 = 1/13 = 7.69\%$.`,
    { format: 'passage', group: 'xp1' }),
  xn(3, 'isothermal process', xr`Find the work done by the gas in $A\to B$ (in J, nearest whole number).`, 3456, 3, () => 2 * 8.31 * 300 * Math.log(2),
    xr`$W = nRT\ln(V_B/V_A) = 2\times8.31\times300\times\ln2 = 4986\times0.6931 = 3456$ J.`,
    { format: 'passage', group: 'xp2' }),
  xn(4, 'adiabatic process', xr`Find the temperature of the gas at $C$ (in K).`, 75, 0, () => 300 * Math.pow(1 / 8, 2 / 3),
    xr`$TV^{2/3} = $ constant, so $T_C = 300\times(V_B/V_C)^{2/3} = 300\times(1/8)^{2/3} = 300\times\tfrac14 = 75$ K.`,
    { format: 'passage', group: 'xp2', trap: 'The volume ratio 8 is measured from B, not from A.' }),
  xn(5, 'entropy', xr`Find the total entropy change of the gas from $A$ to $C$ (in J K$^{-1}$, 2 decimals).`, 11.52, 0.05, () => 2 * 8.31 * Math.log(2),
    xr`Entropy is a state function, so add the changes of the two steps. $A\to B$ (isothermal): $\Delta S = nR\ln2 = 2\times8.31\times0.6931 = 11.52$ J K$^{-1}$. $B\to C$ is reversible and adiabatic, so $\Delta S = 0$. Total $= 11.52$ J K$^{-1}$. Check: $nC_v\ln(T_C/T_A) + nR\ln(V_C/V_A) = 3\times8.31\times\ln(1/4) + 2\times8.31\times\ln16 = -34.56 + 46.08 = 11.52$.`,
    { format: 'passage', group: 'xp2' }),

  // ---------- Level 5 ----------
  xn(5, 'Carnot engine', xr`Two Carnot engines work in series. Engine 1 takes heat from a source at 800 K and rejects heat at temperature $T$. Engine 2 takes this rejected heat and works between $T$ and a sink at 200 K. The two engines do equal work. Find $T$ (in K).`, 500, 0, () => 500,
    xr`Let engine 1 take $Q_1$. It rejects $Q_2 = Q_1T/800$. Engine 2 rejects $Q_3 = Q_2\cdot200/T = Q_1\cdot200/800$. Equal work means $Q_1 - Q_2 = Q_2 - Q_3$, so $Q_1(1 - T/800) = Q_1(T/800 - 200/800)$, which gives $800 - T = T - 200$ and $T = 500$ K. (It is the average of 800 and 200.)`,
    { trap: 'Taking the geometric mean 400 K, which gives equal efficiencies, not equal work.' }),
  xn(5, 'polytropic process', xr`A monatomic ideal gas is taken through the process $P\propto V^2$. If the heat absorbed is $Q$, the increase in internal energy is $\dfrac{a}{11}Q$. Find $a$.`, 9, 0, () => 1.5 / (1.5 + 1 / 3) * 11,
    xr`$P\propto V^2$ means $PV^{-2} = $ constant, $n = -2$. $C = C_v + R/(1 - n) = \tfrac32R + \tfrac13R = \tfrac{11}{6}R$. $\Delta U = C_v\Delta T = \tfrac32R\Delta T$ and $Q = \tfrac{11}{6}R\Delta T$. So $\Delta U/Q = \tfrac{3/2}{11/6} = \tfrac{9}{11}$, giving $a = 9$.`),
  xn(5, 'entropy', xr`0.5 kg of water at $20\,^\circ$C is mixed with 0.5 kg of water at $80\,^\circ$C in an insulated container. Find the total entropy increase (in J K$^{-1}$, 1 decimal). Take $c = 4200$ J kg$^{-1}$K$^{-1}$ and $T = t + 273$.`, 18.2, 0.1, () => 0.5 * 4200 * (Math.log(323 / 293) + Math.log(323 / 353)),
    xr`Final temperature $= 50\,^\circ$C $= 323$ K. $\Delta S_{cold} = mc\ln(323/293) = 2100\times0.0974 = +204.5$ J K$^{-1}$. $\Delta S_{hot} = mc\ln(323/353) = 2100\times(-0.0889) = -186.4$ J K$^{-1}$. Total $= 18.2$ J K$^{-1}$. It is positive, as the second law requires.`,
    { trap: 'Using Celsius temperatures in the logarithms.' }),
  xn(5, 'Stirling cycle', xr`One mole of a monatomic ideal gas goes round a cycle of two isotherms (600 K and 300 K) and two isochores, the volume ratio being 2. There is no heat regeneration, so all heat absorbed from the hot side counts. Find the efficiency as a percentage (1 decimal).`, 24.0, 0.1, () => 100 * (300 * Math.log(2)) / (600 * Math.log(2) + 1.5 * 300),
    xr`The work is $W = R(600 - 300)\ln2$ (isothermal work at 600 K minus the magnitude at 300 K). Heat absorbed: isothermal expansion at 600 K gives $R\times600\ln2$, and isochoric heating from 300 K to 600 K gives $\tfrac32R\times300$. $\eta = \dfrac{300\ln2}{600\ln2 + 450} = \dfrac{207.9}{865.9} = 24.0\%$. The Carnot value would be 50%; the isochoric heating is the cost.`,
    { trap: 'Leaving out the heat needed for the isochoric step.' }),
  xa(5, 'specific heat in a process', xr`For a monatomic ideal gas in the process $P\propto V$ the molar heat capacity is $2R$.`, xr`In the process $P\propto V$ the work done by the gas per unit rise in temperature is greater than in an isobaric process.`, 2,
    xr`$P\propto V$ means $n = -1$ in $PV^n = $ constant. $C = C_v + R/(1 - n) = \tfrac32R + \tfrac12R = 2R$, so A is true. For R: $W = \int P\,dV = \tfrac12\Delta(PV) = \tfrac12nR\Delta T$ here, while an isobaric change gives $nR\Delta T$. The work per unit temperature rise is <i>smaller</i> (half), so R is false.`,
    { trap: 'Assuming that a larger heat capacity means more of the heat becomes work.' }),
  xa(5, 'polytropic process', xr`For a gas obeying $PV^n = $ constant with $1 < n < \gamma$ the molar heat capacity is negative.`, xr`In this range the gas absorbs heat during expansion although its temperature falls.`, 0,
    xr`$C = C_v - R/(n - 1)$. For $n < \gamma$, $R/(n - 1) > R/(\gamma - 1) = C_v$, so $C < 0$. In an expansion $T$ falls ($TV^{n-1} = $ constant) but $Q = nC\Delta T > 0$, so heat is absorbed. R is what a negative heat capacity means here, and it explains A.`),
  xt(5, 'second law', xr`An ideal gas can convert heat completely into work in a reversible isothermal expansion.`, xr`This process violates the Kelvin-Planck statement of the second law.`, 2,
    xr`In an isothermal expansion of an ideal gas $\Delta U = 0$, so $Q = W$: all the heat absorbed becomes work. The Kelvin-Planck statement forbids this only for a <i>cyclic</i> process, whose final state equals its initial state. Here the gas has a larger volume at the end, so nothing is violated. I true, II false.`,
    { trap: 'Forgetting the word "cycle" in the Kelvin-Planck statement.' }),
  xb(5, 'mixed statements', { type: 'mcq', format: 'statements',
    q: xr`How many of these statements are correct?<br>(a) For a monatomic gas in an adiabatic change, $P\propto T^{5/2}$.<br>(b) For a rigid diatomic gas in an adiabatic change, $V\propto T^{-5/2}$.<br>(c) In the isobaric expansion of a rigid diatomic gas, $2/7$ of the heat absorbed becomes work.<br>(d) In an adiabatic change of an ideal gas, $PV = $ constant.<br>(e) In the isothermal compression of an ideal gas, the internal energy falls.`,
    options: ['Two', 'Three', 'Four', 'Five'], answer: 1,
    sol: xr`(a) True: $P\propto T^{\gamma/(\gamma-1)} = T^{5/2}$. (b) True: $TV^{2/5} = $ constant, so $V\propto T^{-5/2}$. (c) True: $R/C_p = 2/7$. (d) False: it is $PV^{\gamma} = $ constant; $PV = $ constant is the isothermal case. (e) False: $\Delta U = 0$. Three are correct.`,
    trap: 'Mixing the isothermal and adiabatic laws.' }),
  xm(5, 'polytropic process', 'xm6', xr`Match each process in List I with the molar heat capacity of a monatomic ideal gas in List II.`, { A: 's', B: 'p', C: 'q', D: 't' },
    xr`$C = C_v + R/(1 - n)$ for $PV^n = $ constant. A: $P\propto V$ is $n = -1$: $\tfrac32R + \tfrac12R = 2R$ (s). B: $n = 2$: $\tfrac32R - R = \tfrac12R$ (p). C: $n = 3$: $\tfrac32R - \tfrac12R = R$ (q). D: $n = 0$: $\tfrac32R + R = \tfrac52R$ (t).`),
  xm(5, 'work in processes', 'xm7', xr`Match each process in List I with the work done by the gas in List II.`, { A: 'r', B: 'q', C: 'p', D: 's' },
    xr`With $P_0V_0$ as the unit. A: $P_0\times V_0 = 1.00$ (r). B: $P_0V_0\ln2 = 0.693$ (q). C: $W = (P_1V_1 - P_2V_2)/(\gamma - 1)$ with $P_2V_2 = 2^{-2/3}P_0V_0 = 0.630P_0V_0$: $W = 0.370/(2/3) = 0.555$ (p). D: $P$ rises to $2P_0$; $W = \tfrac12(2P_0\cdot2V_0 - P_0V_0) = 1.50$ (s).`),
  xs(5, 'cyclic process', xr`One mole of an ideal gas goes round $A\to B\to C\to A$. $A\to B$ is an isothermal expansion. $B\to C$ is an isobaric compression. $C\to A$ is an isochoric heating back to $A$. Which are correct?`,
    ['The net work done by the gas in the cycle is positive.', xr`Heat is rejected during $C\to A$.`, xr`Heat is absorbed in $A\to B$ and in $C\to A$.`, 'State C has the lowest temperature of the three states.'], [0, 2, 3],
    xr`On a P-V diagram $A$ is top-left, $B$ is to the right and lower, $C$ is below $A$ at the same volume. $A\to B\to C\to A$ goes clockwise, so the net work is positive. $A\to B$: isothermal expansion, $Q = W > 0$. $B\to C$: compression at constant $P$ with $T$ falling, $Q < 0$. $C\to A$: isochoric with $T$ rising, $Q > 0$, so heat is absorbed (second option false). $T_C = P_BV_A/nR < P_BV_B/nR = T_B = T_A$.`),
  xs(5, 'second law', xr`Four inventors each claim an engine that works between 500 K and 300 K and takes 1000 J from the source in every cycle. Which claims are physically possible? (A reversible engine counts as possible.)`,
    ['Work 400 J and heat rejected 600 J.', 'Work 450 J and heat rejected 550 J.', 'Work 300 J and heat rejected 700 J.', 'Work 400 J and heat rejected 500 J.'], [0, 2],
    xr`The maximum efficiency is $1 - 300/500 = 40\%$, so the maximum work is 400 J. First: 400 J is the Carnot limit and $400 + 600 = 1000$, so it is possible if reversible. Second: 450 J exceeds the limit. Third: 300 J with $300 + 700 = 1000$ is an ordinary irreversible engine. Fourth: $400 + 500 = 900\neq1000$ breaks energy conservation.`),
  xs(5, 'polytropic process', xr`One mole of a monatomic ideal gas, initially at $(P_0, V_0)$, expands along $PV^2 = $ constant to volume $2V_0$. Which are correct?`,
    [xr`Its internal energy rises.`, xr`Its temperature becomes half of the initial temperature.`, xr`The work done by the gas is $\tfrac12P_0V_0$.`, 'The gas gives out heat.'], [1, 2, 3],
    xr`$P_2 = P_0/4$, so $P_2V_2 = P_0V_0/2$ and $T_2 = T_0/2$. $\Delta U = \tfrac32(P_2V_2 - P_0V_0) = -0.75P_0V_0 < 0$. $W = (P_1V_1 - P_2V_2)/(n - 1) = 0.5P_0V_0$. $Q = \Delta U + W = -0.25P_0V_0 < 0$, so heat is given out (also $C = \tfrac12R > 0$ with $\Delta T < 0$).`),
  xs(5, 'Carnot engine', xr`Two Carnot engines work in series between 800 K and 200 K. The first works between 800 K and $T$ and the second between $T$ and 200 K, using the heat the first rejects. They do equal work. Which are correct?`,
    [xr`$T = 500$ K.`, 'The two engines have the same efficiency.', xr`The overall efficiency is 75%.`, 'The first engine has an efficiency of 37.5%.'], [0, 2, 3],
    xr`Equal work gives $T = (800 + 200)/2 = 500$ K. Engine 1: $1 - 500/800 = 37.5\%$. Engine 2: $1 - 200/500 = 60\%$, so the efficiencies differ. Overall: both are reversible, so the combination is a Carnot engine between 800 K and 200 K: $1 - 200/800 = 75\%$.`),
  xs(5, 'entropy', xr`Two identical blocks of heat capacity $C$ at $T_1$ and $T_2$ ($T_1 > T_2$) are placed in contact inside an insulated box. Which are correct?`,
    ['Heat flows from the hotter block to the colder one.', xr`The final temperature is $(T_1 + T_2)/2$.`, 'The total entropy of the two blocks is unchanged.', 'The decrease in entropy of the hotter block is smaller in magnitude than the increase in entropy of the colder block.'], [0, 1, 3],
    xr`The final temperature is the mean $T_f$. $\Delta S_{hot} = C\ln(T_f/T_1) < 0$, $\Delta S_{cold} = C\ln(T_f/T_2) > 0$, and the total is $C\ln\dfrac{T_f^2}{T_1T_2} > 0$ (since $T_f^2 > T_1T_2$ for unequal values, by the AM-GM inequality). So the total entropy rises, and the cold block's gain exceeds the hot block's loss.`),
];

const xgens = [
  { id: 'th-g22', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'isothermal process',
    make(rng) {
      const n = xchoose(rng, [1, 2, 3]), T = xchoose(rng, [300, 400, 500, 600]), r = xchoose(rng, [2, 3, 4, 5]); const answer = +(n * 8.31 * T * Math.log(r)).toFixed(0);
      return { n, T, r, answer, tol: Math.max(2, answer * 0.003), unit: 'J',
        q: `${n} mol of an ideal gas at ${T} K expands isothermally to ${r} times its volume. Find the work done by the gas in J (nearest whole number). R = 8.31 J mol⁻¹K⁻¹.`,
        sol: `W = nRT ln(V₂/V₁) = ${n} × 8.31 × ${T} × ln ${r} = ${xfmt(n * 8.31 * T, 5)} × ${xfmt(Math.log(r), 4)} = ${answer} J.` };
    },
    verify: (p) => { const N = 20000; let s = 0; for (let i = 0; i < N; i++) { const V = 1 + (p.r - 1) * (i + 0.5) / N; s += p.n * 8.31 * p.T / V * (p.r - 1) / N; } return s; } },
  { id: 'th-g23', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'general processes',
    make(rng) {
      const k = xchoose(rng, [2, 3, 4, 5]); const answer = 2 * (k * k - 1);
      return { k, answer, tol: 0,
        q: `One mole of a monatomic ideal gas follows the process P = aV (a is constant) from (P₀, V₀) to a volume ${k}V₀. Find the heat absorbed in units of P₀V₀.`,
        sol: `P₀ = aV₀, and at ${k}V₀ the pressure is ${k}P₀, so PV rises from P₀V₀ to ${k * k}P₀V₀. ΔU = 1.5 × ${k * k - 1} = ${xfmt(1.5 * (k * k - 1), 4)} P₀V₀. W = ½ × ${k * k - 1} = ${xfmt(0.5 * (k * k - 1), 4)} P₀V₀. Q = ΔU + W = ${answer} P₀V₀.` };
    },
    verify: (p) => { const N = 20000; let W = 0; for (let i = 0; i < N; i++) { const V = 1 + (p.k - 1) * (i + 0.5) / N; W += V * (p.k - 1) / N; } return Math.round(1.5 * (p.k * p.k - 1) + W); } },
  { id: 'th-g24', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'refrigerator',
    make(rng) {
      const Tc = xchoose(rng, [250, 260, 270, 280]), Th = xchoose(rng, [300, 310]), W = xchoose(rng, [100, 200, 500]); const answer = +(W * Th / (Th - Tc)).toFixed(1);
      return { Tc, Th, W, answer, tol: Math.max(0.1, answer * 0.005), unit: 'J',
        q: `A Carnot refrigerator works between an inside temperature of ${Tc} K and a room at ${Th} K. In each cycle ${W} J of work is done on it. Find the heat released into the room per cycle, in J (1 decimal).`,
        sol: `COP = Tc/(Th − Tc) = ${Tc}/${Th - Tc} = ${xfmt(Tc / (Th - Tc), 4)}. Heat taken from inside = COP × W = ${xfmt(Tc / (Th - Tc) * W, 5)} J. Heat released = that + W = ${answer} J. (Also Q₁ = W·Th/(Th − Tc).)` };
    },
    verify: (p) => { const q2 = p.W * p.Tc / (p.Th - p.Tc); return q2 + p.W; } },
  { id: 'th-g25', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'Carnot engine',
    make(rng) {
      const [e1, e2, dT, T2] = xchoose(rng, [[40, 50, 100, 300], [25, 40, 100, 300], [50, 62.5, 200, 300], [33.3333333, 50, 100, 200]]);
      const e1s = e1 === 33.3333333 ? '33.3' : String(e1);
      return { e1, e2, dT, answer: T2, tol: 1, unit: 'K',
        q: `A Carnot engine has an efficiency of ${e1s}%. Raising the source temperature by ${dT} K, with the sink unchanged, makes the efficiency ${e2}%. Find the sink temperature in K.`,
        sol: `Let the source be T₁ and the sink T₂. T₂ = (1 − ${e1s}/100)T₁ and T₂ = (1 − ${e2}/100)(T₁ + ${dT}). Solving gives T₁ = ${xfmt(T2 / (1 - e1 / 100), 4)} K and T₂ = ${T2} K.` };
    },
    verify: (p) => { const a = p.e1 / 100, b = p.e2 / 100; const T1 = p.dT * (1 - b) / (b - a); return T1 * (1 - a); } },
  { id: 'th-g26', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'cyclic process',
    make(rng) {
      const k = xchoose(rng, [2, 3, 4]); const answer = +(100 * 0.5 * (k - 1) / (1.5 + 2.5 * k)).toFixed(2);
      return { k, answer, tol: 0.05, unit: '%',
        q: `One mole of a monatomic ideal gas goes round A(V₀, P₀) → B(V₀, ${k}P₀) → C(${k}V₀, ${k}P₀) → A, where C → A is the straight line from C back to A (it passes through the origin of the P-V graph, and the gas only loses heat on it). Find the efficiency of the cycle as a percentage (2 decimals).`,
        sol: `Work = area of triangle = ½(${k} − 1)(${k} − 1)P₀V₀ = ${xfmt(0.5 * (k - 1) ** 2, 4)}P₀V₀. A → B: Q = 1.5(${k} − 1) = ${xfmt(1.5 * (k - 1), 4)}P₀V₀. B → C: Q = 2.5 × ${k}(${k} − 1) = ${xfmt(2.5 * k * (k - 1), 4)}P₀V₀. Heat in = ${xfmt((k - 1) * (1.5 + 2.5 * k), 4)}P₀V₀. η = ${xfmt(0.5 * (k - 1) ** 2, 4)}/${xfmt((k - 1) * (1.5 + 2.5 * k), 4)} = ${answer}%.` };
    },
    verify: (p) => { const k = p.k; const UAB = 1.5 * (k - 1), QBC = 1.5 * k * (k - 1) + k * (k - 1); const UCA = 1.5 * (1 - k * k), WCA = 0.5 * (1 - k * k), QCA = UCA + WCA; const W = 0 + k * (k - 1) + WCA; const Qin = UAB + QBC; return 100 * (W / Qin) + (QCA < 0 ? 0 : 1e6); } },
  { id: 'th-g27', type: 'mcq', level: 3, exams: xex(3, 'mcq'), sub: 'degrees of freedom',
    make(rng) {
      const f = xchoose(rng, [3, 5, 6, 7]); const ok = `2/${f + 2}`;
      const o = xsh(rng, ok, [`${f}/${f + 2}`, `2/${f}`, `1/${f + 2}`]);
      return { f, options: o.options, answer: o.answer,
        q: `An ideal gas whose molecules have ${f} degrees of freedom is heated at constant pressure. What fraction of the heat absorbed is converted into work?`,
        sol: `W/Q = R/Cp with Cp = (f/2 + 1)R = ${(f + 2) / 2}R, so W/Q = 2/(f + 2) = ${ok}. The fraction ${f}/${f + 2} is ΔU/Q, the share that raises the internal energy.` };
    },
    verify: (p) => p.options.indexOf(`2/${p.f + 2}`) },
  { id: 'th-g28', type: 'mcq', level: 4, exams: xex(4, 'mcq'), sub: 'adiabatic process',
    make(rng) {
      const f = xchoose(rng, [3, 5, 6]); const ok = `$V^{-2/${f}}$`;
      const o = xsh(rng, ok, [`$V^{2/${f}}$`, `$V^{-${f}/2}$`, `$V^{-2/${f + 2}}$`]);
      return { f, options: o.options, answer: o.answer,
        q: `For an ideal gas with ${f} degrees of freedom per molecule, a reversible adiabatic change obeys $T \\propto$ which power of volume?`,
        sol: `TV^(γ−1) = constant with γ = 1 + 2/f, so γ − 1 = 2/${f}. Hence T ∝ V^(−2/${f}). The positive exponent has the wrong sign, V^(−${f}/2) is the inverse, and −2/${f + 2} uses 1 − 1/γ (the pressure relation).` };
    },
    verify: (p) => p.options.indexOf(`$V^{-2/${p.f}}$`) },
  { id: 'th-g29', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'Carnot cycle on T-S diagram',
    make(rng) {
      const Tc = xchoose(rng, [200, 300, 400]), Th = Tc * xchoose(rng, [2, 3]), dS = xchoose(rng, [1, 2, 5]); const answer = +(100 * (Th - Tc) / (Th + Tc)).toFixed(1);
      return { Tc, Th, dS, answer, tol: 0.1, unit: '%',
        q: `On a T-S diagram a cycle is the triangle A(S = 0, T = ${Tc}) → B(S = 0, T = ${Th}) → C(S = ${dS}, T = ${Tc}) → A (S in J/K, T in K). Find its efficiency as a percentage (1 decimal).`,
        sol: `A → B is at constant S, so there is no heat. B → C: Q = ∫T dS = ½(${Th} + ${Tc}) × ${dS} = ${xfmt(0.5 * (Th + Tc) * dS, 5)} J absorbed. C → A: Q = −${Tc} × ${dS} = −${Tc * dS} J. Work = area = ½(${Th} − ${Tc}) × ${dS} = ${xfmt(0.5 * (Th - Tc) * dS, 5)} J. η = ${answer}%.` };
    },
    verify: (p) => { const N = 10000; let qin = 0; for (let i = 0; i < N; i++) { const s = (i + 0.5) / N * p.dS; const T = p.Th + (p.Tc - p.Th) * s / p.dS; qin += T * p.dS / N; } const qout = p.Tc * p.dS; return 100 * (qin - qout) / qin; } },
  { id: 'th-g30', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'Stirling cycle',
    make(rng) {
      const [Th, Tc] = xchoose(rng, [[600, 300], [800, 400], [500, 250], [900, 300], [600, 400]]); const r = xchoose(rng, [2, 3, 4]); const ln = Math.log(r);
      const answer = +(100 * (Th - Tc) * ln / (Th * ln + 1.5 * (Th - Tc))).toFixed(1);
      return { Th, Tc, r, answer, tol: 0.1, unit: '%',
        q: `One mole of a monatomic ideal gas goes round a cycle of two isotherms (${Th} K and ${Tc} K) and two isochores, the volume ratio being ${r}. There is no regeneration, so the heat for the isochoric heating comes from the source too. Find the efficiency as a percentage (1 decimal).`,
        sol: `Work per cycle = R(${Th} − ${Tc}) ln${r}. Heat absorbed = R × ${Th} × ln${r} (isothermal expansion) + 1.5R(${Th} − ${Tc}) (isochoric heating). With ln${r} = ${xfmt(ln, 4)}: η = ${xfmt((Th - Tc) * ln, 5)}/${xfmt(Th * ln + 1.5 * (Th - Tc), 5)} = ${answer}%.` };
    },
    verify: (p) => { const W = 8.31 * Math.log(p.r) * p.Th - 8.31 * Math.log(p.r) * p.Tc; const Qh = 8.31 * p.Th * Math.log(p.r); const Qc = 1.5 * 8.31 * (p.Th - p.Tc); return 100 * W / (Qh + Qc); } },
  { id: 'th-g31', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'entropy',
    make(rng) {
      const m = xchoose(rng, [0.5, 1, 2]), T1 = xchoose(rng, [280, 290, 300]), T2 = xchoose(rng, [350, 360, 370]); const Tf = (T1 + T2) / 2; const answer = +(m * 4200 * (Math.log(Tf / T1) + Math.log(Tf / T2))).toFixed(1);
      return { m, T1, T2, answer, tol: Math.max(0.1, answer * 0.01), unit: 'J/K',
        q: `${m} kg of water at ${T1} K is mixed with ${m} kg of water at ${T2} K in an insulated container. Find the total entropy increase in J K⁻¹ (1 decimal). c = 4200 J kg⁻¹K⁻¹.`,
        sol: `Equal masses, so T_f = (${T1} + ${T2})/2 = ${Tf} K. ΔS = mc[ln(T_f/${T1}) + ln(T_f/${T2})] = ${xfmt(m * 4200, 4)} × (${xfmt(Math.log(Tf / T1), 4)} − ${xfmt(-Math.log(Tf / T2), 4)}) = ${answer} J/K. It is positive, as the second law requires.` };
    },
    verify: (p) => { const Tf = (p.T1 + p.T2) / 2; const N = 20000; let s = 0; for (let i = 0; i < N; i++) { const a = p.T1 + (Tf - p.T1) * (i + 0.5) / N; s += p.m * 4200 / a * (Tf - p.T1) / N; const b = p.T2 + (Tf - p.T2) * (i + 0.5) / N; s += p.m * 4200 / b * (Tf - p.T2) / N; } return s; } },
  { id: 'th-g32', type: 'mcq', level: 4, exams: xex(4, 'mcq'), sub: 'polytropic process',
    make(rng) {
      const [n, nl, C] = xchoose(rng, [[-1, '$P\\propto V$', 2], [2, '$PV^2 = $ constant', 0.5], [3, '$PV^3 = $ constant', 1], [0, '$P = $ constant', 2.5]]);
      const fm = (c) => (Number.isInteger(c) ? `$${c}R$` : c === 0.5 ? '$\\tfrac12R$' : c === 2.5 ? '$\\tfrac52R$' : c === 1.5 ? '$\\tfrac32R$' : c === -0.5 ? '$-\\tfrac12R$' : `$${c}R$`);
      const set = new Set([C]); const wr = []; for (const c of [1.5, 2.5, 2, 1, 0.5, -0.5, 3]) { if (wr.length < 3 && !set.has(c)) { set.add(c); wr.push(c); } }
      const o = xsh(rng, fm(C), wr.map(fm));
      return { n, C, options: o.options, answer: o.answer,
        q: `A monatomic ideal gas undergoes the process ${nl}. Its molar heat capacity in this process is`,
        sol: `For PV^n = constant, C = C_v + R/(1 − n). Here n = ${n}, so C = 1.5R + R/${1 - n} = ${xfmt(C, 3)}R.` };
    },
    verify: (p) => { const fm = (c) => (Number.isInteger(c) ? `$${c}R$` : c === 0.5 ? '$\\tfrac12R$' : c === 2.5 ? '$\\tfrac52R$' : `$${c}R$`); return p.options.indexOf(fm(1.5 + 1 / (1 - p.n))); } },
];

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'thermodynamics-physics', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] }, ['th-g11', 'th-g32', 'th-g13'], [], ['th-g11', 'th-g13', 'th-g32']);
