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
const nid = () => `kt-${String(++k).padStart(3, '0')}`;
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
// Kinetic theory: Plus Two entrance bank (original fibub questions).
const RG = 8.31; const KB = 1.38e-23; const NA = 6.02e23;
const vrms = (T, M) => Math.sqrt(3 * RG * T / M);
const vmean = (T, M) => Math.sqrt(8 * RG * T / (PI * M));
const vmp = (T, M) => Math.sqrt(2 * RG * T / M);

const items = [
  // ---------- Level 1 ----------
  nat(1, 'ideal gas equation', r`Find the volume (in litres, 1 decimal) of 1 mole of an ideal gas at $273.15$ K and 1 atm ($1.013\times10^5$ Pa). $R = 8.314$.`, () => 8.314 * 273.15 / 1.013e5 * 1000, 0.1, 1,
    r`$V = nRT/P = 8.314\times273.15/1.013\times10^5 = 0.02242\ \mathrm{m^3} = 22.4$ L.`, { unit: 'L' }),
  mcq(1, 'gas laws', r`Boyle's law states that, for a fixed mass of gas at constant temperature,`, r`$PV$ is constant`, [r`$P/V$ is constant`, r`$P$ is proportional to $V$`, r`$V/T$ is constant`],
    r`Halving the volume doubles the pressure at constant temperature, so $PV = $ constant.`),
  mcq(1, 'gas laws', r`Charles' law says that at constant pressure the volume of a fixed mass of gas is proportional to`, 'the absolute (kelvin) temperature', ['the Celsius temperature', 'the pressure', 'the square of the temperature'],
    r`$V\propto T$ with $T$ in kelvin. Celsius readings do not start from absolute zero, so $V$ is not proportional to them.`),
  mcq(1, 'kinetic theory assumptions', r`In the kinetic theory of gases, collisions between molecules and with the walls are assumed to be`, 'perfectly elastic', ['perfectly inelastic', 'partly inelastic', 'absent'],
    r`If collisions were inelastic the molecules would lose kinetic energy and the gas would cool on its own. Elastic collisions conserve kinetic energy.`),
  nat(1, 'kinetic energy of molecules', r`Find the average translational kinetic energy of a gas molecule at 300 K (in units of $10^{-21}$ J, 2 decimals). $k = 1.38\times10^{-23}$ J K$^{-1}$.`, () => 1.5 * 1.38e-23 * 300 / 1e-21, 0.02, 2,
    r`$\bar E = \tfrac32kT = 1.5\times1.38\times10^{-23}\times300 = 6.21\times10^{-21}$ J.`, { unit: '×10⁻²¹ J' }),
  mcq(1, 'temperature', r`The temperature of an ideal gas is a measure of`, 'the average translational kinetic energy of its molecules', ['the total number of molecules', 'the pressure only', 'the volume only'],
    r`$\tfrac12m\overline{v^2} = \tfrac32kT$: temperature tells you the mean translational kinetic energy per molecule.`),
  mcq(1, 'rms speed', r`The rms speed of the molecules of an ideal gas is proportional to`, r`$\sqrt T$`, [r`$T$`, r`$T^2$`, r`$1/\sqrt T$`],
    r`$v_{rms} = \sqrt{3RT/M}\propto\sqrt T$.`),
  nat(1, 'degrees of freedom', r`How many degrees of freedom does a monatomic gas molecule have?`, () => 3, 0, 0,
    r`A single atom (a point) can move along $x$, $y$ and $z$: 3 translational degrees of freedom.`, { unit: '' }),
  nat(1, 'degrees of freedom', r`At room temperature, how many degrees of freedom does a rigid diatomic molecule such as $\mathrm{N_2}$ have?`, () => 5, 0, 0,
    r`3 translational and 2 rotational (rotation about the axis joining the atoms does not count). Vibration is not excited at room temperature.`, { unit: '' }),
  mcq(1, 'Dalton\'s law', r`Dalton's law of partial pressures says that the total pressure of a mixture of non-reacting gases is`, 'the sum of the pressures each gas would exert alone in the same volume and temperature', ['the average of the partial pressures', 'the largest partial pressure', 'the product of the partial pressures'],
    r`Ideal-gas molecules do not affect each other, so each gas contributes its own pressure and they add.`),
  mcq(1, 'Avogadro\'s law', r`Avogadro's law states that equal volumes of all gases at the same temperature and pressure contain`, 'equal numbers of molecules', ['equal masses', 'equal numbers of atoms', 'equal densities'],
    r`$PV = NkT$ gives the same $N$ for the same $P$, $V$, $T$, whatever the gas. Masses and densities differ, and so does the number of atoms per molecule.`),
  nat(1, 'Avogadro number', r`How many molecules are there in 2 moles of a gas (in units of $10^{23}$, 2 decimals)? $N_A = 6.02\times10^{23}$.`, () => 2 * 6.02, 0.02, 2,
    r`$N = nN_A = 2\times6.02\times10^{23} = 12.04\times10^{23}$.`, { unit: '×10²³' }),
  nat(1, 'gas laws', r`The temperature of a gas in a rigid container is doubled (in kelvin). By what factor does its pressure change?`, () => 2, 0, 0,
    r`At constant volume $P\propto T$, so the pressure doubles.`, { unit: '' }),
  mcq(1, 'mean free path', r`When a gas is compressed at constant temperature, its mean free path`, 'decreases', ['increases', 'stays the same', 'becomes zero'],
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P}$. Higher pressure means more molecules per volume, so shorter free paths.`),
  mcq(1, 'speeds of molecules', r`For the molecules of a gas, the order of the three speeds is`, r`$v_{mp} < v_{mean} < v_{rms}$`, [r`$v_{rms} < v_{mean} < v_{mp}$`, r`$v_{mean} < v_{mp} < v_{rms}$`, r`$v_{mp} = v_{mean} = v_{rms}$`],
    r`$v_{mp} = \sqrt{2RT/M}$, $v_{mean} = \sqrt{8RT/\pi M}$, $v_{rms} = \sqrt{3RT/M}$. The numbers under the root are 2, 2.55 and 3.`),
  nat(1, 'internal energy of a gas', r`Find the total translational kinetic energy of 1 mole of any ideal gas at 300 K (in J, 1 decimal). $R = 8.31$.`, () => 1.5 * 8.31 * 300, 0.5, 1,
    r`$E = \tfrac32RT = 1.5\times8.31\times300 = 3739.5$ J.`, { unit: 'J' }),

  // ---------- Level 2 ----------
  nat(2, 'ideal gas equation', r`Find the pressure (in kPa, 1 decimal) of 2 mol of an ideal gas at 300 K in a 10 L vessel. $R = 8.31$.`, () => 2 * 8.31 * 300 / 0.01 / 1000, 0.5, 1,
    r`$P = nRT/V = 2\times8.31\times300/(10\times10^{-3}) = 4.986\times10^5$ Pa $= 498.6$ kPa. (10 L $= 0.010\ \mathrm{m^3}$.)`, { unit: 'kPa' }),
  nat(2, 'moles and volume', r`Find the volume (in litres, 1 decimal) occupied at STP (22.4 L per mole) by 8 g of oxygen ($M = 32$ g mol$^{-1}$).`, () => 8 / 32 * 22.4, 0.05, 1,
    r`$n = 8/32 = 0.25$ mol. $V = 0.25\times22.4 = 5.6$ L.`, { unit: 'L' }),
  nat(2, 'Boyle\'s law', r`A gas at 1.0 atm in a 2.0 L cylinder is compressed isothermally to 0.50 L. Find the final pressure (in atm).`, () => 1.0 * 2.0 / 0.5, 0, 1,
    r`$P_1V_1 = P_2V_2$, so $P_2 = 1.0\times2.0/0.50 = 4.0$ atm.`, { unit: 'atm' }),
  nat(2, 'Charles\' law', r`2.0 L of gas at 300 K is heated to 450 K at constant pressure. Find the new volume (in litres).`, () => 2 * 450 / 300, 0, 1,
    r`$V/T$ is constant: $V_2 = 2.0\times450/300 = 3.0$ L.`, { unit: 'L' }),
  nat(2, 'combined gas law', r`A gas has $P_1 = 1.0$ atm, $V_1 = 6.0$ L, $T_1 = 300$ K. It is changed to $P_2 = 2.0$ atm and $T_2 = 400$ K. Find $V_2$ (in L).`, () => 1 * 6 * 400 / (300 * 2), 0, 1,
    r`$\dfrac{P_1V_1}{T_1} = \dfrac{P_2V_2}{T_2}$, so $V_2 = \dfrac{1\times6\times400}{300\times2} = 4.0$ L.`, { unit: 'L' }),
  nat(2, 'rms speed', r`Find the rms speed of oxygen molecules ($M = 0.032$ kg mol$^{-1}$) at 300 K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $R = 8.31$.`, () => vrms(300, 0.032), 2, 0,
    r`$v_{rms} = \sqrt{3RT/M} = \sqrt{3\times8.31\times300/0.032} = \sqrt{2.337\times10^5} = 483\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(2, 'rms speed', r`At the same temperature, what is the ratio of the rms speed of hydrogen ($M = 2$) to that of oxygen ($M = 32$)?`, () => Math.sqrt(32 / 2), 0, 0,
    r`$v_{rms}\propto1/\sqrt M$, so the ratio $= \sqrt{32/2} = \sqrt{16} = 4$.`, { unit: '' }),
  nat(2, 'pressure of a gas', r`A gas of density $1.2\ \mathrm{kg\,m^{-3}}$ has an rms molecular speed of $500\ \mathrm{m\,s^{-1}}$. Find its pressure (in kPa).`, () => 1.2 * 500 ** 2 / 3 / 1000, 0.5, 0,
    r`$P = \tfrac13\rho v_{rms}^2 = \tfrac13\times1.2\times250000 = 1.0\times10^5$ Pa $= 100$ kPa.`, { unit: 'kPa' }),
  nat(2, 'internal energy of a gas', r`Find the internal energy (in J) of 2 mol of a rigid diatomic ideal gas at 300 K. $R = 8.31$.`, () => 2.5 * 2 * 8.31 * 300, 2, 0,
    r`$U = \dfrac f2nRT = 2.5\times2\times8.31\times300 = 12465$ J.`, { unit: 'J' }),
  nat(2, 'Dalton\'s law', r`Two gases are mixed in one vessel with partial pressures 2.0 atm and 3.0 atm. Find the total pressure (in atm).`, () => 5, 0, 1,
    r`$P = P_1 + P_2 = 2.0 + 3.0 = 5.0$ atm.`, { unit: 'atm' }),
  nat(2, 'kinetic energy of molecules', r`By what factor does the average translational kinetic energy per molecule change when the absolute temperature is doubled?`, () => 2, 0, 0,
    r`$\bar E = \tfrac32kT\propto T$: it doubles.`, { unit: '' }),
  nat(2, 'rms speed', r`The temperature of a gas is raised from 300 K to 1200 K. By what factor does the rms speed change?`, () => Math.sqrt(4), 0, 0,
    r`$v_{rms}\propto\sqrt T$. $\sqrt{1200/300} = \sqrt4 = 2$.`, { unit: '' }),
  nat(2, 'number density', r`Find the number of molecules (in units of $10^{22}$, 2 decimals) in 1 litre of an ideal gas at 273.15 K and $1.013\times10^5$ Pa. $k = 1.38\times10^{-23}$.`, () => 1.013e5 * 1e-3 / (1.38e-23 * 273.15) / 1e22, 0.03, 2,
    r`$N = PV/kT = \dfrac{1.013\times10^5\times10^{-3}}{1.38\times10^{-23}\times273.15} = 2.69\times10^{22}$.`, { unit: '×10²²' }),
  mcq(2, 'speeds of molecules', r`At the same temperature, which of these gases has the largest rms molecular speed?`, 'hydrogen', ['oxygen', 'nitrogen', 'carbon dioxide'],
    r`$v_{rms} = \sqrt{3RT/M}$. At the same $T$ the lightest molecule, $\mathrm{H_2}$ ($M = 2$), is fastest.`),
  mcq(2, 'equipartition of energy', r`According to the law of equipartition of energy, each quadratic degree of freedom of a molecule contributes, per molecule, an average energy of`, r`$\tfrac12kT$`, [r`$kT$`, r`$\tfrac32kT$`, r`$\tfrac12RT$`],
    r`Each quadratic term in the energy gets $\tfrac12kT$ per molecule (or $\tfrac12RT$ per mole). $\tfrac32kT$ is the total for 3 translational terms.`),
  nat(2, 'kinetic energy of molecules', r`Find the average translational kinetic energy of a molecule at $27\,^\circ$C in electron-volts (3 decimals). $k = 1.38\times10^{-23}$ J K$^{-1}$, $1\ \mathrm{eV} = 1.6\times10^{-19}$ J.`, () => 1.5 * 1.38e-23 * 300 / 1.6e-19, 0.002, 3,
    r`$\bar E = \tfrac32kT = 6.21\times10^{-21}$ J $= 6.21\times10^{-21}/1.6\times10^{-19} = 0.0388$ eV, about 39 meV.`, { unit: 'eV' }),
  nat(2, 'specific heats of gases', r`Find the molar specific heat at constant volume of a rigid diatomic gas, in units of $R$ (1 decimal).`, () => 2.5, 0, 1,
    r`$C_v = \tfrac f2R = \tfrac52R$.`, { unit: 'R' }),
  nat(2, 'density of a gas', r`Find the density (in $\mathrm{kg\,m^{-3}}$, 2 decimals) of nitrogen ($M = 0.028$ kg mol$^{-1}$) at $1.013\times10^5$ Pa and 300 K. $R = 8.31$.`, () => 1.013e5 * 0.028 / (8.31 * 300), 0.02, 2,
    r`$PV = nRT = \dfrac mMRT$, so $\rho = \dfrac{PM}{RT} = \dfrac{1.013\times10^5\times0.028}{8.31\times300} = 1.14\ \mathrm{kg\,m^{-3}}$.`, { unit: 'kg/m³' }),
  nat(2, 'number density', r`How many molecules (in units of $10^{25}$, 2 decimals) are there per cubic metre of a gas at $1.0\times10^5$ Pa and 300 K? $k = 1.38\times10^{-23}$.`, () => 1e5 / (1.38e-23 * 300) / 1e25, 0.03, 2,
    r`$n = N/V = P/kT = \dfrac{1.0\times10^5}{1.38\times10^{-23}\times300} = 2.42\times10^{25}\ \mathrm{m^{-3}}$.`, { unit: '×10²⁵ /m³' }),
  nat(2, 'Graham\'s law', r`Find the ratio of the rates of effusion of hydrogen ($M = 2$) and oxygen ($M = 32$) through the same small hole at the same temperature and pressure.`, () => Math.sqrt(32 / 2), 0, 0,
    r`Graham's law: rate $\propto1/\sqrt M$. Ratio $= \sqrt{32/2} = 4$.`, { unit: '' }),
  mcq(2, 'gas laws', r`A graph of pressure against absolute temperature for a fixed mass of gas at constant volume is`, 'a straight line through the origin', ['a straight line with a negative slope', 'a parabola', 'a hyperbola'],
    r`$P = (nR/V)T$ is proportional to $T$: a straight line through the origin.`),
  nat(2, 'gas laws', r`A car tyre is at 2.00 atm and $27\,^\circ$C. After a drive its temperature is $57\,^\circ$C. Treat its volume as fixed and find the new pressure (in atm, 2 decimals).`, () => 2 * 330 / 300, 0.02, 2,
    r`$P\propto T$ with $T$ in kelvin: $P_2 = 2.00\times330/300 = 2.20$ atm.`, { unit: 'atm', trap: 'Convert to kelvin first.' }),
  nat(2, 'molar mass', r`A gas has a density of $1.43\ \mathrm{kg\,m^{-3}}$ at STP (molar volume $22.4$ L). Find its molar mass (in g mol$^{-1}$, nearest whole number).`, () => 1.43 * 22.4, 0.5, 0,
    r`Mass of 1 mole $= \rho\times V_m = 1.43\ \mathrm{g\,L^{-1}}\times22.4\ \mathrm{L} = 32.0$ g. The gas is oxygen.`, { unit: 'g/mol' }),
  nat(2, 'discrete speeds', r`Five molecules have speeds 100, 200, 300, 400 and $500\ \mathrm{m\,s^{-1}}$. Find their rms speed (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => Math.sqrt((1 + 4 + 9 + 16 + 25) * 1e4 / 5), 0.5, 1,
    r`$v_{rms} = \sqrt{\dfrac{\sum v^2}{N}} = \sqrt{\dfrac{(1 + 4 + 9 + 16 + 25)\times10^4}{5}} = \sqrt{11\times10^4} = 331.7\ \mathrm{m\,s^{-1}}$. (The mean speed is 300.)`, { unit: 'm/s', trap: 'rms is not the same as the mean.' }),
  nat(2, 'ideal gas equation', r`The pressure of $0.50$ mol of an ideal gas is $2.0\times10^5$ Pa at 300 K. Find its volume (in litres, 2 decimals). $R = 8.31$.`, () => 0.5 * 8.31 * 300 / 2e5 * 1000, 0.03, 2,
    r`$V = nRT/P = 0.50\times8.31\times300/2.0\times10^5 = 6.23\times10^{-3}\ \mathrm{m^3} = 6.23$ L.`, { unit: 'L' }),
];

items.push(
  // ---------- Level 3 ----------
  nat(3, 'speeds of molecules', r`Find the mean speed of oxygen molecules ($M = 0.032$) at 300 K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $v_{mean} = \sqrt{8RT/\pi M}$, $R = 8.31$.`, () => vmean(300, 0.032), 2, 0,
    r`$v_{mean} = \sqrt{\dfrac{8\times8.31\times300}{\pi\times0.032}} = \sqrt{1.984\times10^5} = 445\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'speeds of molecules', r`Find the most probable speed of nitrogen molecules ($M = 0.028$) at 300 K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $R = 8.31$.`, () => vmp(300, 0.028), 2, 0,
    r`$v_{mp} = \sqrt{2RT/M} = \sqrt{2\times8.31\times300/0.028} = \sqrt{1.781\times10^5} = 422\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'speeds of molecules', r`Find the ratio $v_{rms}/v_{mp}$ for a gas at any temperature (3 decimals).`, () => Math.sqrt(1.5), 0.002, 3,
    r`$\dfrac{v_{rms}}{v_{mp}} = \sqrt{\dfrac{3RT/M}{2RT/M}} = \sqrt{1.5} = 1.225$.`, { unit: '' }),
  nat(3, 'speeds of molecules', r`Helium ($M = 4$) and oxygen ($M = 32$) are at the same temperature. Find the ratio of the rms speed of helium to that of oxygen (3 decimals).`, () => Math.sqrt(8), 0.003, 3,
    r`$\dfrac{v_{He}}{v_{O_2}} = \sqrt{\dfrac{32}{4}} = \sqrt8 = 2.828$.`, { unit: '' }),
  nat(3, 'gas mixtures', r`A mixture has 2 mol of helium ($M = 4$ g mol$^{-1}$) and 3 mol of nitrogen ($M = 28$). Find its average molar mass (in g mol$^{-1}$, 1 decimal).`, () => (2 * 4 + 3 * 28) / 5, 0.1, 1,
    r`$M_{mix} = \dfrac{\text{total mass}}{\text{total moles}} = \dfrac{2\times4 + 3\times28}{5} = \dfrac{92}{5} = 18.4$ g mol$^{-1}$.`, { unit: 'g/mol' }),
  nat(3, 'Dalton\'s law', r`A 10 L vessel at 300 K holds 2 g of hydrogen ($M = 2$) and 8 g of helium ($M = 4$). Find the total pressure (in kPa, 1 decimal). $R = 8.31$.`, () => (1 + 2) * 8.31 * 300 / 0.01 / 1000, 1, 1,
    r`$n_{H_2} = 2/2 = 1$ mol and $n_{He} = 8/4 = 2$ mol. $P = \dfrac{nRT}{V} = \dfrac{3\times8.31\times300}{0.010} = 7.479\times10^5$ Pa $= 747.9$ kPa.`, { unit: 'kPa' }),
  nat(3, 'Dalton\'s law', r`In the same vessel (10 L, 300 K) with 1 mol of hydrogen and 2 mol of helium, find the partial pressure of the hydrogen (in kPa, 1 decimal). $R = 8.31$.`, () => 1 * 8.31 * 300 / 0.01 / 1000, 1, 1,
    r`Each gas fills the whole vessel as if alone: $P_{H_2} = \dfrac{n_{H_2}RT}{V} = \dfrac{1\times8.31\times300}{0.010} = 2.493\times10^5$ Pa $= 249.3$ kPa, one third of the total.`, { unit: 'kPa' }),
  nat(3, 'mean free path', r`Find the mean free path of air molecules (effective diameter $3.0\times10^{-10}$ m) at 300 K and $1.013\times10^5$ Pa, in units of $10^{-7}$ m (2 decimals). $k = 1.38\times10^{-23}$.`, () => 1.38e-23 * 300 / (Math.SQRT2 * PI * 9e-20 * 1.013e5) / 1e-7, 0.02, 2,
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P} = \dfrac{1.38\times10^{-23}\times300}{1.414\times3.1416\times9\times10^{-20}\times1.013\times10^5} = 1.02\times10^{-7}$ m. About 300 molecular diameters.`, { unit: '×10⁻⁷ m' }),
  mcq(3, 'mean free path', r`A fixed mass of gas in a rigid container is heated. The mean free path of its molecules`, 'stays the same', ['increases in proportion to $T$', 'decreases', 'increases in proportion to $\\sqrt T$'],
    r`$\lambda = \dfrac{1}{\sqrt2\pi d^2n}$ depends on the number density $n = N/V$ and molecular size, not on speed. Heating at constant volume changes neither $N$ nor $V$. (At constant pressure, $\lambda\propto T$.)`, { trap: 'The molecules go faster, but they also collide more often, so the distance between collisions is unchanged.' }),
  nat(3, 'gas mixtures', r`A gas mixture has 1 mol of helium and 2 mol of rigid hydrogen. Find $\gamma = C_p/C_v$ of the mixture (3 decimals).`, () => (2.5 + 2 * 3.5) / (1.5 + 2 * 2.5), 0.005, 3,
    r`$C_v$ total $= 1\times1.5R + 2\times2.5R = 6.5R$. $C_p$ total $= 1\times2.5R + 2\times3.5R = 9.5R$. $\gamma = 9.5/6.5 = 1.462$.`, { unit: '' }),
  nat(3, 'density and temperature', r`The density of a gas at 300 K and constant pressure is $1.2\ \mathrm{kg\,m^{-3}}$. Find its density at 600 K (in $\mathrm{kg\,m^{-3}}$, 1 decimal).`, () => 1.2 * 300 / 600, 0.02, 1,
    r`$\rho = PM/RT\propto1/T$ at constant $P$. $\rho' = 1.2\times300/600 = 0.6\ \mathrm{kg\,m^{-3}}$.`, { unit: 'kg/m³' }),
  nat(3, 'pressure of a gas', r`$1.0\times10^{23}$ molecules, each of mass $5.0\times10^{-26}$ kg and rms speed $400\ \mathrm{m\,s^{-1}}$, are in a 2.0 L vessel. Find the pressure (in kPa, 1 decimal).`, () => 1e23 * 5e-26 * 400 ** 2 / (3 * 2e-3) / 1000, 0.5, 1,
    r`$P = \dfrac{Nmv_{rms}^2}{3V} = \dfrac{1.0\times10^{23}\times5.0\times10^{-26}\times1.6\times10^5}{3\times2.0\times10^{-3}} = \dfrac{800}{6\times10^{-3}} = 1.333\times10^5$ Pa $= 133.3$ kPa.`, { unit: 'kPa' }),
  nat(3, 'rms speed', r`The rms speed of nitrogen molecules ($M = 0.028$) is $500\ \mathrm{m\,s^{-1}}$. Find the temperature (in K, 1 decimal). $R = 8.31$.`, () => 0.028 * 500 ** 2 / (3 * 8.31), 0.5, 1,
    r`$T = \dfrac{Mv_{rms}^2}{3R} = \dfrac{0.028\times250000}{3\times8.31} = \dfrac{7000}{24.93} = 280.8$ K.`, { unit: 'K' }),
  nat(3, 'connected vessels', r`Vessel A (3.0 L) holds gas at 2.0 atm and vessel B (6.0 L) holds the same gas at 1.0 atm, both at the same temperature. They are joined by a tube and left to settle at the same temperature. Find the final pressure (in atm, 2 decimals).`, () => (2 * 3 + 1 * 6) / 9, 0.02, 2,
    r`The number of moles is conserved and $T$ is constant, so $P_AV_A + P_BV_B = P(V_A + V_B)$. $P = \dfrac{6 + 6}{9} = 1.33$ atm.`, { unit: 'atm' }),
  nat(3, 'leaking gas', r`A cylinder at constant temperature holds gas at 5.0 atm. After some gas is used the pressure is 3.0 atm. What percentage of the original gas has been used?`, () => (5 - 3) / 5 * 100, 0, 0,
    r`At fixed $V$ and $T$, $n\propto P$. Fraction used $= (5 - 3)/5 = 0.40$, i.e. 40%.`, { unit: '%' }),
  nat(3, 'open vessel heated', r`An open vessel holds air at 300 K. It is heated to 400 K at constant atmospheric pressure. What percentage of the original air escapes?`, () => (1 - 300 / 400) * 100, 0, 0,
    r`At fixed $P$ and $V$, $n\propto1/T$. Remaining fraction $= 300/400 = 0.75$, so 25% has escaped.`, { unit: '%' }),
  nat(3, 'rms speed', r`The temperature of a gas rises from $27\,^\circ$C to $327\,^\circ$C. By what factor does the rms speed increase (3 decimals)?`, () => Math.sqrt(600 / 300), 0.003, 3,
    r`In kelvin: 300 K to 600 K. $v_{rms}\propto\sqrt T$, so the factor is $\sqrt2 = 1.414$.`, { unit: '', trap: 'Convert to kelvin before taking the ratio: $\\sqrt{327/27}$ would be wrong.' }),
  nat(3, 'molar volume', r`Find the volume (in litres, 2 decimals) of 1 mole of an ideal gas at $27\,^\circ$C and 1 atm ($1.013\times10^5$ Pa). $R = 8.31$.`, () => 8.31 * 300 / 1.013e5 * 1000, 0.03, 2,
    r`$V = RT/P = 8.31\times300/1.013\times10^5 = 0.02461\ \mathrm{m^3} = 24.6$ L, bigger than the 22.4 L at $0\,^\circ$C.`, { unit: 'L' }),
  nat(3, 'mass of a molecule', r`Find the mass of one oxygen molecule ($M = 32$ g mol$^{-1}$) in units of $10^{-26}$ kg (2 decimals). $N_A = 6.02\times10^{23}$.`, () => 0.032 / 6.02e23 / 1e-26, 0.03, 2,
    r`$m = M/N_A = 0.032/6.02\times10^{23} = 5.32\times10^{-26}$ kg.`, { unit: '×10⁻²⁶ kg' }),
  nat(3, 'speed of sound', r`Sound in a monatomic ideal gas travels at $v = \sqrt{\gamma P/\rho}$, and $v_{rms} = \sqrt{3P/\rho}$. Find $v/v_{rms}$ for a monatomic gas (3 decimals).`, () => Math.sqrt(5 / 9), 0.003, 3,
    r`$\dfrac{v}{v_{rms}} = \sqrt{\dfrac\gamma3} = \sqrt{\dfrac{5/3}{3}} = \sqrt{5/9} = 0.745$. Sound travels at about three quarters of the rms molecular speed.`, { unit: '', sub: 'mixed' }),
  nat(3, 'trapped air column', r`A horizontal tube has a mercury thread 10 cm long that traps a 20 cm column of air at atmospheric pressure (76 cm of mercury). The tube is turned vertical with the open end up. Find the new length of the air column (in cm, 2 decimals). Temperature is constant.`, () => 20 * 76 / 86, 0.05, 2,
    r`Trapped pressure: horizontal $P_1 = 76$ cmHg; vertical, open end up, $P_2 = 76 + 10 = 86$ cmHg. Boyle: $76\times20 = 86\,L_2$, so $L_2 = 17.67$ cm.`, { unit: 'cm', sub: 'mixed' }),
  nat(3, 'bubble rising', r`An air bubble at the bottom of a lake 10 m deep has volume $V$. Find the ratio of its volume at the surface to $V$ (2 decimals), taking the temperature as constant. ($P_0 = 1.013\times10^5$ Pa, $\rho = 1000$, $g = 9.8$)`, () => (1.013e5 + 1000 * 9.8 * 10) / 1.013e5, 0.02, 2,
    r`At depth: $P_1 = P_0 + \rho gh = 1.013\times10^5 + 1000\times9.8\times10 = 1.993\times10^5$ Pa. At the surface $P_2 = P_0$. $V_2/V_1 = P_1/P_2 = 1.967\approx1.97$.`, { unit: '', sub: 'mixed' }),
  nat(3, 'graphs of gas laws', r`In a P-V experiment at constant temperature, a gas has $P = 2.0\times10^5$ Pa at 3.0 L. At what volume (in L) is $P = 6.0\times10^5$ Pa?`, () => 2e5 * 3 / 6e5, 0, 1,
    r`$P_1V_1 = P_2V_2$, so $V_2 = \dfrac{2.0\times10^5\times3.0}{6.0\times10^5} = 1.0$ L.`, { unit: 'L' }),
  nat(3, 'degrees of freedom', r`Find the internal energy (in J, nearest whole number) of 1 mol of a rigid non-linear polyatomic gas (6 degrees of freedom) at 300 K. $R = 8.31$.`, () => 3 * 8.31 * 300, 2, 0,
    r`$U = \dfrac f2RT = 3\times8.31\times300 = 7479$ J.`, { unit: 'J' }),
  nat(3, 'discrete speeds', r`Seven molecules have speeds 1, 2, 3, 4, 5, 6 and $7\ \mathrm{km\,s^{-1}}$. Find the ratio $v_{rms}/v_{mean}$ (3 decimals).`, () => Math.sqrt(140 / 7) / 4, 0.003, 3,
    r`$v_{mean} = 28/7 = 4$ km/s. $\sum v^2 = 1 + 4 + 9 + 16 + 25 + 36 + 49 = 140$, so $v_{rms} = \sqrt{140/7} = \sqrt{20} = 4.472$ km/s. Ratio $= 1.118$.`, { unit: '' }),
  mcq(3, 'Maxwell distribution', r`In the Maxwell speed distribution, the speed at which the curve peaks is`, 'the most probable speed', ['the mean speed', 'the rms speed', 'the speed of sound'],
    r`By definition, the peak of $f(v)$ marks the speed shared by the largest number of molecules in a small interval: $v_{mp} = \sqrt{2kT/m}$.`),
  nat(3, 'Graham\'s law', r`An unknown gas diffuses through a small hole twice as slowly as oxygen under the same conditions. Find its molar mass (in g mol$^{-1}$).`, () => 32 * 4, 0, 0,
    r`Rate $\propto1/\sqrt M$. Half the rate means $\sqrt{M/32} = 2$, so $M = 4\times32 = 128$ g mol$^{-1}$.`, { unit: 'g/mol' }),
  mcq(3, 'real gases', r`A real gas behaves most nearly like an ideal gas at`, 'low pressure and high temperature', ['high pressure and low temperature', 'low pressure and low temperature', 'high pressure and high temperature'],
    r`At low pressure the molecules are far apart, so their own volume and mutual attraction matter little. High temperature makes their kinetic energy large compared with the attraction.`),
);

items.push(
  // ---------- Level 4 ----------
  nat(4, 'escape of gases', r`At what temperature (in K, nearest 10 K) would the rms speed of hydrogen molecules ($M = 2$ g mol$^{-1}$) equal the escape speed from the Earth, $11.2\ \mathrm{km\,s^{-1}}$? $R = 8.31$.`, () => 0.002 * 11200 ** 2 / (3 * 8.31), 30, 0,
    r`$T = \dfrac{Mv^2}{3R} = \dfrac{0.002\times(1.12\times10^4)^2}{3\times8.31} = \dfrac{2.509\times10^5}{24.93} = 1.006\times10^4$ K. Hydrogen escapes at much lower $T$ because the fast tail of the Maxwell distribution is enough.`, { unit: 'K', sub: 'mixed' }),
  nat(4, 'buoyancy and gases', r`A balloon of volume $10\ \mathrm{m^3}$ is filled with hydrogen at 1 atm and 300 K. Take air as $M = 29$ g mol$^{-1}$. Neglecting the balloon's own mass, find the lifting force (in N, nearest whole number). ($R = 8.31$, $g = 9.8$)`, () => (1.013e5 * 0.029 / (8.31 * 300) - 1.013e5 * 0.002 / (8.31 * 300)) * 9.8 * 10, 2, 0,
    r`$\rho = PM/RT$: air $1.178$, hydrogen $0.0813\ \mathrm{kg\,m^{-3}}$. Lift $= (\rho_{air} - \rho_{H_2})Vg = (1.178 - 0.081)\times10\times9.8 = 107.5$ N (about 108 N).`, { unit: 'N', sub: 'mixed' }),
  nat(4, 'atmosphere', r`In an isothermal atmosphere at 300 K ($M = 0.029$ kg mol$^{-1}$) the pressure falls as $P = P_0e^{-Mgh/RT}$. At what height (in m, nearest 10 m) is the pressure half the ground value? ($g = 9.8$, $R = 8.31$)`, () => 8.31 * 300 * Math.log(2) / (0.029 * 9.8), 20, 0,
    r`$\tfrac12 = e^{-Mgh/RT}$ gives $h = \dfrac{RT\ln2}{Mg} = \dfrac{8.31\times300\times0.6931}{0.029\times9.8} = 6080$ m.`, { unit: 'm', sub: 'mixed' }),
  nat(4, 'mean free path', r`In a vacuum chamber the nitrogen pressure is $1.0\times10^{-3}$ Pa at 300 K ($d = 3.2\times10^{-10}$ m). Find the mean free path (in m, 1 decimal). $k = 1.38\times10^{-23}$.`, () => 1.38e-23 * 300 / (Math.SQRT2 * PI * (3.2e-10) ** 2 * 1e-3), 0.1, 1,
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P} = \dfrac{4.14\times10^{-21}}{1.414\times3.1416\times1.024\times10^{-19}\times10^{-3}} = 9.1$ m. This is far larger than a typical chamber, so molecules hit the walls rather than each other.`, { unit: 'm' }),
  nat(4, 'collision frequency', r`Nitrogen ($M = 0.028$, $d = 3.7\times10^{-10}$ m) at 273 K and $1.013\times10^5$ Pa has mean free path $6.11\times10^{-8}$ m. Find the number of collisions per second of one molecule (in units of $10^9\ \mathrm{s^{-1}}$, 1 decimal), using the mean speed. $R = 8.31$.`, () => vmean(273, 0.028) / 6.114e-8 / 1e9, 0.1, 1,
    r`$v_{mean} = \sqrt{8RT/\pi M} = \sqrt{8\times8.31\times273/(\pi\times0.028)} = 455\ \mathrm{m\,s^{-1}}$. Collision frequency $= v_{mean}/\lambda = 455/6.11\times10^{-8} = 7.4\times10^9\ \mathrm{s^{-1}}$.`, { unit: '×10⁹ /s' }),
  nat(4, 'gas mixtures', r`A mixture has 1 mol of helium ($M = 4$ g mol$^{-1}$) and 1 mol of nitrogen ($M = 28$) at 300 K. Find the rms speed of all the molecules taken together (in $\mathrm{m\,s^{-1}}$, nearest whole number). $R = 8.31$.`, () => Math.sqrt(3 * 8.31 * 300 / 2 * (1 / 0.004 + 1 / 0.028)), 3, 0,
    r`$\overline{v^2} = \dfrac{n_1(3RT/M_1) + n_2(3RT/M_2)}{n_1 + n_2} = \dfrac{3\times8.31\times300}{2}\left(\dfrac1{0.004} + \dfrac1{0.028}\right) = 3739.5\times285.7 = 1.068\times10^6$. $v_{rms} = 1034\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Average $v^2$ over the molecules, not the average of the two rms speeds.' }),
  nat(4, 'connected bulbs', r`Two identical bulbs, each of volume $V$, are joined by a narrow tube and filled with gas at pressure $P_0$ and 300 K. One bulb is then kept at 300 K while the other is heated to 600 K. Find the final pressure in units of $P_0$ (2 decimals).`, () => 4 / 3, 0.02, 2,
    r`Moles are conserved: $\dfrac{2P_0V}{R\times300} = \dfrac{PV}{R\times300} + \dfrac{PV}{R\times600}$. So $2P_0 = P(1 + \tfrac12)$ and $P = \tfrac43P_0 = 1.33P_0$.`, { unit: '' }),
  nat(4, 'piston between gases', r`A horizontal cylinder 90 cm long is divided by a freely moving, non-conducting piston. The left side holds 1 mol of gas and the right side 2 mol of the same gas, both at 300 K. Find the distance of the piston from the left end (in cm).`, () => 90 * 1 / 3, 0.5, 0,
    r`In equilibrium both sides have the same pressure and temperature, so $V\propto n$. Left volume fraction $= 1/(1 + 2) = 1/3$. The piston is $90/3 = 30$ cm from the left end.`, { unit: 'cm' }),
  nat(4, 'piston between gases', r`In the same 90 cm cylinder, the left gas (1 mol) is now heated to 400 K and the right gas (2 mol) is kept at 300 K. Find the distance of the piston from the left end (in cm).`, () => 90 * 400 / (400 + 600), 0.5, 0,
    r`Equal pressure gives $\dfrac{n_1T_1}{V_1} = \dfrac{n_2T_2}{V_2}$, so $V_1/V_2 = \dfrac{n_1T_1}{n_2T_2} = \dfrac{400}{600}$. $V_1 = 90\times\dfrac{400}{400 + 600} = 36$ cm.`, { unit: 'cm' }),
  nat(4, 'Maxwell distribution', r`For the Maxwell distribution $f(v)$, find the ratio $\overline{v^2}/(\bar v)^2$ (3 decimals). Use $\overline{v^2} = 3kT/m$ and $\bar v = \sqrt{8kT/\pi m}$.`, () => 3 * PI / 8, 0.003, 3,
    r`$\dfrac{\overline{v^2}}{\bar v^2} = \dfrac{3kT/m}{8kT/\pi m} = \dfrac{3\pi}{8} = 1.178$. It is greater than 1 because the rms is larger than the mean for any spread of speeds.`, { unit: '' }),
  nat(4, 'atmosphere', r`In an isothermal atmosphere the scale height is $H = RT/Mg$. Find the ratio of the scale height of hydrogen ($M = 2$) to that of nitrogen ($M = 28$) at the same temperature.`, () => 28 / 2, 0, 0,
    r`$H\propto1/M$. $H_{H_2}/H_{N_2} = 28/2 = 14$. Hydrogen thins out much more slowly with height.`, { unit: '', sub: 'mixed' }),
  nat(4, 'real gases', r`The van der Waals equation is $\left(P + \dfrac{an^2}{V^2}\right)(V - nb) = nRT$. For 1 mol of carbon dioxide with $a = 0.364\ \mathrm{Pa\,m^6\,mol^{-2}}$ and $b = 4.27\times10^{-5}\ \mathrm{m^3\,mol^{-1}}$ in a 1.00 L vessel at 300 K, find the pressure (in MPa, 3 decimals). $R = 8.31$.`, () => (8.31 * 300 / (1e-3 - 4.27e-5) - 0.364 / 1e-6) / 1e6, 0.01, 3,
    r`$P = \dfrac{RT}{V - b} - \dfrac{a}{V^2} = \dfrac{2493}{9.573\times10^{-4}} - \dfrac{0.364}{10^{-6}} = 2.604\times10^6 - 3.64\times10^5 = 2.240\times10^6$ Pa $= 2.240$ MPa. The ideal-gas value would be 2.493 MPa.`, { unit: 'MPa' }),
  nat(4, 'gas thermometer', r`A constant-volume gas thermometer reads a pressure of $6.80\times10^4$ Pa at the triple point of water (273.16 K). Find the temperature (in K, 1 decimal) when its pressure is $9.30\times10^4$ Pa.`, () => 273.16 * 9.3e4 / 6.8e4, 0.4, 1,
    r`At constant volume $T\propto P$. $T = 273.16\times\dfrac{9.30\times10^4}{6.80\times10^4} = 373.6$ K.`, { unit: 'K' }),
  nat(4, 'degrees of freedom', r`A gas of 2 mol of helium and 1 mol of rigid diatomic gas is at 300 K. Find its total internal energy (in J, nearest whole number). $R = 8.31$.`, () => (2 * 1.5 + 1 * 2.5) * 8.31 * 300, 3, 0,
    r`$U = \left(n_1\tfrac{f_1}{2} + n_2\tfrac{f_2}{2}\right)RT = (2\times1.5 + 1\times2.5)\times8.31\times300 = 5.5\times2493 = 13712$ J.`, { unit: 'J' }),
  nat(4, 'kinetic energy of molecules', r`A flask holds 2 g of helium ($M = 4$) at 300 K. Find the total translational kinetic energy of its molecules (in J, 1 decimal). $R = 8.31$.`, () => 0.5 * 1.5 * 8.31 * 300, 0.5, 1,
    r`$n = 2/4 = 0.5$ mol. $E = \tfrac32nRT = 1.5\times0.5\times8.31\times300 = 1869.8$ J.`, { unit: 'J' }),
  nat(4, 'Graham\'s law', r`Two gases effuse through the same small hole. Gas A of molar mass 4 g mol$^{-1}$ takes 10 minutes to effuse completely from a vessel. A same-volume sample of gas B at the same $P$ and $T$ takes 40 minutes. Find the molar mass of B (in g mol$^{-1}$).`, () => 4 * (40 / 10) ** 2, 0, 0,
    r`Time $\propto\sqrt M$ (same volume, same $P$ and $T$). $\dfrac{t_B}{t_A} = \sqrt{\dfrac{M_B}{M_A}} = 4$, so $M_B = 16M_A = 64$ g mol$^{-1}$.`, { unit: 'g/mol' }),
  nat(4, 'pressure and speeds', r`The pressure of an ideal gas is $1.0\times10^5$ Pa and the mean kinetic energy of translation per molecule is $6.0\times10^{-21}$ J. Find the number density (in units of $10^{25}\ \mathrm{m^{-3}}$, 2 decimals).`, () => 1.5 * 1e5 / 6e-21 / 1e25, 0.03, 2,
    r`$P = \tfrac23n\bar E_k$, so $n = \dfrac{3P}{2\bar E_k} = \dfrac{3\times10^5}{2\times6.0\times10^{-21}} = 2.5\times10^{25}\ \mathrm{m^{-3}}$.`, { unit: '×10²⁵ /m³' }),
  nat(4, 'rms speed', r`By what percentage does the rms speed of the molecules increase when the temperature rises from 300 K to 303 K (1 decimal)?`, () => (Math.sqrt(303 / 300) - 1) * 100, 0.1, 1,
    r`$v\propto\sqrt T$. $\sqrt{1.01} = 1.00499$, so the increase is about 0.5%, half the fractional change in $T$.`, { unit: '%' }),
  nat(4, 'mean free path', r`Hydrogen's molecular diameter is about 0.8 times that of nitrogen. At the same $T$ and $P$, find the ratio $\lambda_{H_2}/\lambda_{N_2}$ (2 decimals).`, () => 1 / 0.64, 0.02, 2,
    r`$\lambda\propto1/d^2$. $\lambda_{H_2}/\lambda_{N_2} = 1/0.8^2 = 1.56$.`, { unit: '' }),
  nat(4, 'mixed gas laws', r`A vertical cylinder of cross-section $50\ \mathrm{cm^2}$ is closed by a frictionless piston of mass 10 kg, with atmospheric pressure $1.0\times10^5$ Pa above. It traps 0.50 mol of gas at 300 K. Find the height of the gas column (in cm, nearest 0.1 cm). ($g = 9.8$, $R = 8.31$)`, () => 0.5 * 8.31 * 300 / ((1e5 + 98 / 50e-4) * 50e-4) * 100, 1, 1,
    r`Pressure $P = P_0 + mg/A = 1.0\times10^5 + 98/(50\times10^{-4}) = 1.196\times10^5$ Pa. $V = nRT/P = 0.5\times8.31\times300/1.196\times10^5 = 1.042\times10^{-2}\ \mathrm{m^3}$. Height $h = V/A = 1.042\times10^{-2}/(50\times10^{-4}) = 2.084$ m $= 208.4$ cm.`, { unit: 'cm', sub: 'mixed' }),
);

items.push(
  // ---------- Level 5 ----------
  nat(5, 'effusion', r`A 1.0 L vessel holds nitrogen at $1.0\times10^5$ Pa and 300 K and leaks through a hole of area $1.0\times10^{-6}\ \mathrm{m^2}$ into a vacuum. The rate of effusion is $\tfrac14n\bar vA$. Find the initial rate of escape of molecules (in units of $10^{21}\ \mathrm{s^{-1}}$, 2 decimals). ($M = 0.028$, $k = 1.38\times10^{-23}$, $R = 8.31$)`, () => 0.25 * (1e5 / (1.38e-23 * 300)) * vmean(300, 0.028) * 1e-6 / 1e21, 0.03, 2,
    r`$n = P/kT = 2.415\times10^{25}\ \mathrm{m^{-3}}$. $\bar v = \sqrt{8RT/\pi M} = 476\ \mathrm{m\,s^{-1}}$. Rate $= \tfrac14\times2.415\times10^{25}\times476\times10^{-6} = 2.87\times10^{21}\ \mathrm{s^{-1}}$.`, { unit: '×10²¹ /s' }),
  nat(5, 'effusion', r`For the same leaking vessel (volume 1.0 L, hole $1.0\times10^{-6}\ \mathrm{m^2}$, $\bar v = 476\ \mathrm{m\,s^{-1}}$, constant temperature) the pressure falls as $P = P_0e^{-t/\tau}$ with $\tau = \dfrac{4V}{A\bar v}$. Find the time for the pressure to halve (in s, 1 decimal).`, () => Math.log(2) * 4e-3 / (1e-6 * 476), 0.1, 1,
    r`$dN/dt = -\tfrac14\dfrac NV\bar vA$ gives $\tau = \dfrac{4V}{A\bar v} = \dfrac{4\times10^{-3}}{10^{-6}\times476} = 8.40$ s. Half-time $= \tau\ln2 = 5.8$ s.`, { unit: 's' }),
  nat(5, 'Maxwell distribution', r`The Maxwell speed distribution is $f(v) = 4\pi\left(\dfrac{m}{2\pi kT}\right)^{3/2}v^2e^{-mv^2/2kT}$. Show that $v_{mp}f(v_{mp})$ is a pure number and find it (3 decimals).`, () => 4 / (Math.sqrt(PI) * Math.E), 0.003, 3,
    r`At $v_{mp}^2 = 2kT/m$: $f = 4\pi\left(\dfrac{m}{2\pi kT}\right)^{3/2}\dfrac{2kT}{m}e^{-1}$. Using $\dfrac{2kT}{m} = v_{mp}^2$ and $\left(\dfrac{m}{2\pi kT}\right)^{3/2} = \dfrac{1}{\pi^{3/2}v_{mp}^3}$: $f(v_{mp}) = \dfrac{4}{\sqrt\pi\,v_{mp}\,e}$. So $v_{mp}f(v_{mp}) = \dfrac{4}{\sqrt\pi e} = 0.830$.`, { unit: '' }),
  nat(5, 'mean free path', r`A gas at fixed pressure is heated from 300 K to 600 K. By what factor does (a) the mean free path and (b) the collision frequency of a molecule change? Give the product (a)$\times$(b) as a single number (3 decimals).`, () => 2 * (Math.sqrt(2) / 2), 0.003, 3,
    r`(a) At constant $P$, $\lambda = kT/(\sqrt2\pi d^2P)\propto T$, factor 2. (b) Collision frequency $z = \bar v/\lambda\propto\sqrt T/T = 1/\sqrt T$, factor $1/\sqrt2 = 0.707$. Product $= 2\times0.707 = 1.414$. (This equals $\bar v$'s factor $\sqrt2$, as $z\lambda = \bar v$.)`, { unit: '', trap: 'The mean free path depends on the number density, which falls when the gas expands at constant pressure.' }),
  nat(5, 'mixed gas laws', r`A uniform tube, 100 cm long and closed at the top, holds air at atmospheric pressure (76 cm of mercury). It is pushed vertically, open end down, into a deep trough of mercury until its closed top is 80 cm above the mercury surface of the trough. Find the length of the air column in the tube (in cm, 1 decimal). Temperature is constant.`, () => { const d = (-156 + Math.sqrt(156 ** 2 + 4 * 1520)) / 2; return 80 + d; }, 0.2, 1,
    r`Let the mercury level inside the tube be $d$ cm below the trough surface. Then the air column is $L = 80 + d$ and the trapped pressure is $76 + d$ cmHg (pressure at depth $d$). Boyle: $76\times100 = (76 + d)(80 + d)$, i.e. $d^2 + 156d - 1520 = 0$. $d = \dfrac{-156 + \sqrt{156^2 + 4\times1520}}{2} = \dfrac{-156 + 174.4}{2} = 9.2$ cm. $L = 89.2$ cm.`, { unit: 'cm', trap: 'The pressure of the trapped air is not 76 cmHg; it equals the pressure of the mercury at the inner level.' }),
  nat(5, 'real gases', r`The Boyle temperature of a van der Waals gas is $T_B = \dfrac{a}{Rb}$, where the gas obeys Boyle's law over a wide pressure range. Find $T_B$ (in K, nearest 10 K) for carbon dioxide with $a = 0.364\ \mathrm{Pa\,m^6\,mol^{-2}}$ and $b = 4.27\times10^{-5}\ \mathrm{m^3\,mol^{-1}}$. $R = 8.31$.`, () => 0.364 / (8.31 * 4.27e-5), 15, 0,
    r`$T_B = \dfrac{a}{Rb} = \dfrac{0.364}{8.31\times4.27\times10^{-5}} = 1026$ K. Above this the molecular size dominates and $PV$ rises with $P$; below it attraction dominates and $PV$ first falls.`, { unit: 'K' }),
  nat(5, 'Maxwell distribution', r`The peak height of the Maxwell speed distribution (the value of $f(v_{mp})$) varies as $1/v_{mp}$. By what factor is the peak height at $T$ greater than the peak height at $4T$ for the same gas?`, () => 2, 0, 0,
    r`$f(v_{mp}) = \dfrac{4}{\sqrt\pi e\,v_{mp}}$ and $v_{mp}\propto\sqrt T$, so the height $\propto T^{-1/2}$. The height at $T$ over that at $4T$ is $\sqrt4 = 2$. Hotter gas: lower, broader peak.`, { unit: '' }),
  nat(5, 'mean free path', r`In a long vacuum tube of diameter 0.50 m, nitrogen at 300 K has molecular diameter $3.2\times10^{-10}$ m. At what pressure (in mPa, 1 decimal) does the mean free path equal the tube diameter? $k = 1.38\times10^{-23}$.`, () => 1.38e-23 * 300 / (Math.SQRT2 * PI * (3.2e-10) ** 2 * 0.5) * 1000, 0.3, 1,
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P}$, so $P = \dfrac{kT}{\sqrt2\pi d^2\lambda} = \dfrac{4.14\times10^{-21}}{1.414\times\pi\times1.024\times10^{-19}\times0.50} = 1.82\times10^{-2}$ Pa $= 18.2$ mPa. Below this the molecules mostly strike the walls.`, { unit: 'mPa' }),
  nat(5, 'gas mixtures', r`A mixture has 2 mol of a monatomic gas and 3 mol of a gas with 7 degrees of freedom per molecule. Find $\gamma$ of the mixture (3 decimals).`, () => 3.7 / 2.7, 0.005, 3,
    r`$C_v = \dfrac{2\times1.5 + 3\times3.5}{5}R = 2.7R$, so $C_p = 3.7R$. $\gamma = 3.7/2.7 = 1.370$.`, { unit: '' }),
);

// ---------- Multiple correct ----------
items.push(
  msq(3, 'kinetic theory assumptions', r`Which of the following are assumptions of the kinetic theory of an ideal gas?`,
    ['Collisions between molecules and with the walls are elastic', 'The volume of the molecules is negligible compared with the volume of the container', 'Molecules exert negligible forces on each other except during collisions', 'All molecules move with the same speed'], [0, 1, 2],
    r`Speeds are spread out (Maxwell distribution), not equal. The other three are the standard assumptions.`),
  msq(4, 'internal energy of a gas', r`One mole each of helium and hydrogen (rigid diatomic) are at the same temperature. Which quantities are equal for the two?`,
    ['Average translational kinetic energy per molecule', 'Total translational kinetic energy of the mole', 'rms speed of the molecules', 'Total internal energy'], [0, 1],
    r`Translational energy is $\tfrac32kT$ per molecule for every gas, so A and B hold. The rms speeds differ because the masses differ. Internal energies differ: $\tfrac32RT$ for He and $\tfrac52RT$ for $\mathrm{H_2}$.`),
  msq(4, 'mean free path', r`For an ideal gas of molecular diameter $d$, which statements are correct?`,
    [r`At constant temperature the mean free path is inversely proportional to the pressure`, r`At constant volume (fixed amount) the mean free path does not change with temperature`, r`The mean free path is inversely proportional to $d^2$`, r`At constant volume the mean free path increases when the gas is heated`], [0, 1, 2],
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P} = \dfrac{1}{\sqrt2\pi d^2n}$. At constant $V$, $n$ is fixed, so $\lambda$ is fixed. D is false.`),
  msq(4, 'speeds of molecules', r`For molecules of mass $m$ at temperature $T$, which expressions are correct?`,
    [r`$v_{rms} = \sqrt{3kT/m}$`, r`$v_{mean} = \sqrt{8kT/\pi m}$`, r`$v_{mp} = \sqrt{2kT/m}$`, r`$v_{mp} = \sqrt{3kT/m}$`], [0, 1, 2],
    r`D is the rms speed, not the most probable speed.`),
  msq(5, 'gas mixtures', r`A vessel holds a mixture of helium and nitrogen at the same temperature. Which statements are correct?`,
    ['The total pressure is the sum of the partial pressures', 'The average kinetic energy per molecule is the same for both gases', 'The rms speed of the helium molecules is greater than that of the nitrogen molecules', 'The nitrogen molecules have the greater rms speed'], [0, 1, 2],
    r`Equal $\bar E_k = \tfrac32kT$ means the lighter molecule has the larger speed: $v_{He}/v_{N_2} = \sqrt{28/4} = 2.65$. D is false.`),
  msq(3, 'gas laws', r`Which of the following hold for a fixed mass of ideal gas?`,
    [r`$PV = $ constant at constant $T$`, r`$V\propto T$ (kelvin) at constant $P$`, r`$P\propto T$ (kelvin) at constant $V$`, r`$V\propto t$ (Celsius) at constant $P$`], [0, 1, 2],
    r`Charles' and Gay-Lussac's laws use the absolute scale. In Celsius, $V = V_0(1 + t/273)$ is linear but not proportional.`),
  msq(5, 'equipartition of energy', r`Which statements about equipartition and degrees of freedom are correct?`,
    ['Each quadratic term in the energy has average value $\\tfrac12kT$ per molecule', 'A monatomic gas has 3 degrees of freedom', 'A rigid diatomic molecule has 5 degrees of freedom', 'A vibrational mode contributes only $\\tfrac12kT$'], [0, 1, 2],
    r`A vibrating bond has both kinetic and potential energy terms, so it contributes $\tfrac12kT + \tfrac12kT = kT$. D is false.`),
  msq(4, 'Maxwell distribution', r`The Maxwell speed distribution curve is drawn for the same gas at $T_1$ and a higher $T_2$. Which statements are correct?`,
    ['The peak of the $T_2$ curve is at a higher speed', 'The peak of the $T_2$ curve is lower in height', 'The area under each curve is the same (the total number of molecules)', 'The $T_2$ curve is narrower than the $T_1$ curve'], [0, 1, 2],
    r`The curve spreads out at higher $T$: shifted to the right, lower and wider. The area stays fixed. D is false.`),
  msq(5, 'real gases', r`Which statements about real gases and the van der Waals equation are correct?`,
    ['The term $a$ accounts for attraction between molecules', 'The term $b$ accounts for the finite size of molecules', 'Real gases approach ideal behaviour at low pressure and high temperature', 'Real gases always exert more pressure than an ideal gas would at the same $n$, $V$, $T$'], [0, 1, 2],
    r`At moderate pressures attraction dominates and the real pressure is lower than ideal. At very high pressures the molecular volume dominates and it is higher. D is false.`),
  msq(3, 'gas laws', r`A fixed mass of ideal gas is heated in a rigid closed container. Which quantities increase?`,
    ['The pressure', 'The rms speed of the molecules', 'The number of molecules', 'The mean kinetic energy per molecule'], [0, 1, 3],
    r`Heating raises $T$, so $v_{rms}$ and $\bar E_k$ rise. $P\propto T$ at constant $V$. The number of molecules does not change.`),
);

// ---------- Assertion / Reason ----------
items.push(
  asrt(2, 'pressure of a gas', r`A gas exerts pressure on the walls of its container.`, r`The gas molecules collide with the walls and each collision transfers momentum to them.`, 0,
    r`The average force per unit area from countless collisions is the pressure. R explains A.`),
  asrt(3, 'speeds of molecules', r`At the same temperature, hydrogen molecules move faster on average than oxygen molecules.`, r`At a given temperature all ideal gas molecules have the same average kinetic energy, and hydrogen molecules are lighter.`, 0,
    r`$\tfrac12mv^2$ is the same for both, so the lighter molecule has the larger speed ($v\propto1/\sqrt m$). R explains A.`),
  asrt(3, 'rms speed', r`When the temperature of a gas is doubled, its rms speed also doubles.`, r`The rms speed is proportional to the square root of the absolute temperature.`, 3,
    r`A is false: doubling $T$ multiplies $v_{rms}$ by $\sqrt2$. R is true, and it is the reason A is wrong.`),
  asrt(3, 'mean free path', r`The mean free path of a gas molecule decreases when the gas is compressed isothermally.`, r`The number of molecules per unit volume increases on compression.`, 0,
    r`$\lambda = 1/(\sqrt2\pi d^2n)$, so higher $n$ means a shorter $\lambda$. R explains A.`),
  asrt(4, 'mean free path', r`If a gas is heated at constant volume, the mean free path of its molecules does not change.`, r`The mean free path depends only on the number density of molecules and their size.`, 0,
    r`Heating raises the speed but not $n$, so $\lambda = 1/(\sqrt2\pi d^2n)$ is unchanged. R explains A.`),
  asrt(3, 'specific heats of gases', r`The molar specific heat at constant volume of a monatomic ideal gas is $\tfrac32R$.`, r`The specific heat of a monatomic gas does not change with temperature in the ordinary range.`, 1,
    r`A is true ($3$ translational degrees of freedom, $\tfrac12R$ each). R is also true, but it does not explain the value $\tfrac32R$. The value follows from equipartition.`),
  asrt(4, 'internal energy of a gas', r`The total translational kinetic energy of 1 mole of any ideal gas is $\tfrac32RT$.`, r`The internal energy of 1 mole of any ideal gas at the same temperature is the same.`, 2,
    r`A is true. R is false: rotational (and vibrational) energy depends on the gas. For helium $U = \tfrac32RT$ but for hydrogen $U = \tfrac52RT$.`),
  asrt(3, 'real gases', r`Real gases behave like ideal gases at low pressure and high temperature.`, r`At low pressure and high temperature the molecular volume and the attractive forces become negligible.`, 0,
    r`Low pressure means a large average separation; high temperature means a large kinetic energy compared with the attraction. R explains A.`),
  asrt(2, 'gas laws', r`At constant volume the pressure of a gas is directly proportional to its temperature on the Celsius scale.`, r`At constant volume the pressure of a gas varies linearly with temperature.`, 3,
    r`A is false: $P\propto T$ in kelvin, so $P$ is linear in Celsius but does not vanish at $0\,^\circ$C. R is true.`),
  asrt(4, 'escape of gases', r`Light gases such as hydrogen and helium escape from the Earth's atmosphere more easily than heavy gases.`, r`At a given temperature lighter molecules have higher rms speeds, so more of them exceed the escape speed.`, 0,
    r`$v_{rms}\propto1/\sqrt M$. A larger fraction of the light molecules lies in the high-speed tail beyond the escape speed. R explains A.`),
  asrt(5, 'equipartition of energy', r`Each degree of freedom of a gas molecule contributes $\tfrac12kT$ to its average energy at all temperatures.`, r`The vibrational degrees of freedom of a diatomic molecule are not excited at ordinary temperatures.`, 3,
    r`A is false: equipartition fails when quantum effects freeze out a mode (vibration at room temperature, rotation at very low $T$). R is true and explains why $C_v$ of $\mathrm{N_2}$ at room temperature is $\tfrac52R$, not $\tfrac72R$.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'rms speed', r`The rms speed of the molecules of a gas is proportional to the square root of the absolute temperature.`, r`Doubling the Celsius temperature doubles the rms speed.`, 2,
    r`I is true. II is false: only the kelvin scale applies. E.g. $20\,^\circ$C to $40\,^\circ$C raises $T$ from 293 K to 313 K, so $v$ changes by only 3.3%.`),
  stm(3, 'speeds of molecules', r`At a given temperature all ideal gas molecules have the same average translational kinetic energy.`, r`At a given temperature all ideal gases have the same rms speed.`, 2,
    r`I is true: $\tfrac32kT$. II is false: $v_{rms} = \sqrt{3kT/m}$ depends on the mass.`),
  stm(3, 'Maxwell distribution', r`In a Maxwell distribution $v_{rms} > v_{mean} > v_{mp}$.`, r`$v_{rms}:v_{mean}:v_{mp} = \sqrt3:\sqrt{8/\pi}:\sqrt2$.`, 0,
    r`The numbers are $1.732:1.596:1.414$, in decreasing order. Both true.`),
  stm(4, 'mean free path', r`At constant temperature, the mean free path of a gas increases when its pressure is increased.`, r`The mean free path is proportional to the pressure.`, 1,
    r`Both false: $\lambda\propto1/P$ at constant $T$, so more pressure shortens the path.`),
  stm(4, 'degrees of freedom', r`The internal energy of 1 mole of a rigid diatomic gas at room temperature is $\tfrac52RT$.`, r`At room temperature the vibrational modes of a diatomic molecule are not excited.`, 0,
    r`Both true: 3 translational + 2 rotational degrees of freedom, each $\tfrac12RT$ per mole.`),
  stm(3, 'Dalton\'s law', r`The total pressure of a mixture of non-reacting ideal gases is the sum of the partial pressures.`, r`Molecules of different gases in a mixture never collide with each other.`, 2,
    r`I is true (Dalton's law). II is false: they do collide. Partial pressures add because the molecules do not interact except in brief collisions, not because they never meet.`),
  stm(5, 'Maxwell distribution', r`The Maxwell speed distribution curve is symmetric about the most probable speed.`, r`The area under the curve equals the total number of molecules (or 1 if normalised).`, 3,
    r`I is false: the curve has a long tail to high speeds, so it is skewed, with $v_{mean} > v_{mp}$. II is true.`),
  stm(4, 'Maxwell distribution', r`When the temperature of a gas is raised, the peak of the Maxwell curve moves to a higher speed and becomes lower.`, r`The area under the curve stays the same.`, 0,
    r`Both true. The same number of molecules are spread over a wider range of speeds, so the peak drops.`),
  stc(3, 'kinetic theory', r`Consider: (i) the pressure of an ideal gas is $\tfrac13\rho v_{rms}^2$; (ii) temperature is a measure of the average translational kinetic energy; (iii) all molecules of a gas have the same speed at a given temperature; (iv) $v_{mean}$ is greater than $v_{rms}$. How many are correct?`,
    '2', ['1', '3', '4'],
    r`(i) True. (ii) True. (iii) False. (iv) False: $v_{rms}$ is greater than $v_{mean}$. Two are correct.`),
  stc(4, 'equipartition and gases', r`Consider: (i) a rigid diatomic gas has $\gamma = 7/5$; (ii) a monatomic gas has $C_p = \tfrac52R$; (iii) $\mathrm{CO_2}$ (linear, rigid) has 6 degrees of freedom; (iv) the internal energy of an ideal gas depends only on its temperature. How many are correct?`,
    '3', ['1', '2', '4'],
    r`(i) True. (ii) True. (iii) False: a linear molecule has 3 translational + 2 rotational $= 5$. (iv) True. Three are correct.`, { trap: 'Linear molecules have only two rotational degrees of freedom.' }),
);

// ---------- Match the following + passages ----------
const groups = {
  m1: { title: 'Speeds and energies',
    list1: [r`A. $v_{rms}$`, r`B. $v_{mean}$`, r`C. $v_{mp}$`, 'D. Mean translational kinetic energy per molecule'],
    list2: [r`p. $\sqrt{8RT/\pi M}$`, r`q. $\sqrt{2RT/M}$`, r`r. $\tfrac32kT$`, r`s. $\sqrt{3RT/M}$`] },
  m2: { title: 'Gases and degrees of freedom (room temperature)',
    list1: ['A. Helium', 'B. Oxygen', 'C. Water vapour (rigid, non-linear)', 'D. Diatomic gas with vibration also active'],
    list2: ['p. 3', 'q. 5', 'r. 6', 's. 7'] },
  m3: { title: 'Gas laws',
    list1: ['A. Boyle\'s law', 'B. Charles\' law', 'C. Gay-Lussac\'s law', 'D. Avogadro\'s law'],
    list2: [r`p. $V\propto T$ at constant $P$`, r`q. $PV = $ constant at constant $T$`, r`r. $P\propto T$ at constant $V$`, r`s. $V\propto n$ at constant $P$, $T$`] },
  m4: { title: 'Change of the mean free path',
    list1: ['A. Pressure doubled at constant temperature', 'B. Temperature doubled at constant volume', 'C. Temperature doubled at constant pressure', 'D. Molecular diameter doubled'],
    list2: ['p. Becomes half', 'q. Stays the same', 'r. Becomes one quarter', 's. Becomes double'] },
  p1: { title: 'Nitrogen in a flask',
    passage: r`<p>A 5.0 L flask holds 0.20 mol of nitrogen ($M = 28$ g mol$^{-1}$) at 300 K. Treat it as an ideal gas with $R = 8.31$ J mol$^{-1}$K$^{-1}$.</p>` },
  p2: { title: 'A mixture of helium and nitrogen',
    passage: r`<p>A 20 L vessel holds 4 g of helium ($M = 4$ g mol$^{-1}$) and 14 g of nitrogen ($M = 28$ g mol$^{-1}$) at 300 K. Take $R = 8.31$ J mol$^{-1}$K$^{-1}$.</p>` },
  p3: { title: 'A vacuum chamber',
    passage: r`<p>A chamber contains nitrogen at a pressure of $1.0\times10^{-3}$ Pa and 300 K. The effective diameter of a molecule is $3.2\times10^{-10}$ m and $M = 28$ g mol$^{-1}$. Use $k = 1.38\times10^{-23}$ J K$^{-1}$ and $R = 8.31$.</p>` },
};

items.push(
  mat(2, 'speeds of molecules', 'm1', r`Match each quantity in List I with its expression in List II ($M$ is the molar mass, $k$ the Boltzmann constant).`,
    'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-p, C-r, D-q', 'A-q, B-p, C-s, D-r'],
    r`$v_{rms} = \sqrt{3RT/M}$ (s). $v_{mean} = \sqrt{8RT/\pi M}$ (p). $v_{mp} = \sqrt{2RT/M}$ (q). $\bar E_k = \tfrac32kT$ (r).`),
  mat(3, 'degrees of freedom', 'm2', r`Match each gas in List I with the number of degrees of freedom of its molecules in List II.`,
    'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Helium: 3 translational. Oxygen at room $T$: $3 + 2 = 5$. Rigid non-linear polyatomic: $3 + 3 = 6$. Diatomic with a vibrating bond: $3 + 2 + 2 = 7$ (the vibration counts twice, for its kinetic and potential energy).`),
  mat(2, 'gas laws', 'm3', r`Match each law in List I with its statement in List II.`,
    'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`Boyle: $PV$ constant (q). Charles: $V\propto T$ (p). Gay-Lussac: $P\propto T$ (r). Avogadro: $V\propto n$ (s).`),
  mat(4, 'mean free path', 'm4', r`Match each change in List I with the resulting change of the mean free path in List II (ideal gas).`,
    'A-p, B-q, C-s, D-r', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-p, B-s, C-q, D-r'],
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P}$. A: $P$ doubled, $\lambda$ halves (p). B: at constant $V$, $\lambda$ is unchanged (q). C: at constant $P$, $\lambda\propto T$, so it doubles (s). D: $\lambda\propto1/d^2$, so it becomes one quarter (r).`),
);

items.push(
  pas(2, 'ideal gas equation', 'p1', r`Find the pressure of the gas (in kPa, 1 decimal).`, () => 0.2 * 8.31 * 300 / 0.005 / 1000, 0.5, 1,
    r`$P = nRT/V = 0.20\times8.31\times300/5.0\times10^{-3} = 9.972\times10^4$ Pa $= 99.7$ kPa.`, { unit: 'kPa' }),
  pas(3, 'rms speed', 'p1', r`Find the rms speed of the molecules (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, () => vrms(300, 0.028), 2, 0,
    r`$v_{rms} = \sqrt{3RT/M} = \sqrt{3\times8.31\times300/0.028} = \sqrt{2.671\times10^5} = 517\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  pas(3, 'kinetic energy of molecules', 'p1', r`Find the total translational kinetic energy of the gas (in J, nearest whole number).`, () => 1.5 * 0.2 * 8.31 * 300, 1, 0,
    r`$E = \tfrac32nRT = 1.5\times0.20\times8.31\times300 = 748$ J. Check: $E = \tfrac32PV = 1.5\times9.97\times10^4\times5\times10^{-3} = 748$ J.`, { unit: 'J' }),
  pas(2, 'Dalton\'s law', 'p2', r`Find the total pressure in the vessel (in kPa, nearest whole number).`, () => 1.5 * 8.31 * 300 / 0.02 / 1000, 1, 0,
    r`$n_{He} = 4/4 = 1$ mol, $n_{N_2} = 14/28 = 0.5$ mol. $P = \dfrac{nRT}{V} = \dfrac{1.5\times8.31\times300}{0.020} = 1.870\times10^5$ Pa $= 187$ kPa.`, { unit: 'kPa' }),
  pas(3, 'Dalton\'s law', 'p2', r`Find the partial pressure of helium (in kPa, 1 decimal).`, () => 1 * 8.31 * 300 / 0.02 / 1000, 0.5, 1,
    r`$P_{He} = \dfrac{n_{He}RT}{V} = \dfrac{1\times8.31\times300}{0.020} = 1.2465\times10^5$ Pa $= 124.7$ kPa. (Mole fraction $\tfrac23$ of the total.)`, { unit: 'kPa' }),
  pas(4, 'speeds of molecules', 'p2', r`Find the ratio of the rms speed of helium to that of nitrogen in the mixture (3 decimals).`, () => Math.sqrt(28 / 4), 0.003, 3,
    r`Same temperature, so $v\propto1/\sqrt M$. Ratio $= \sqrt{28/4} = \sqrt7 = 2.646$.`, { unit: '' }),
  pas(3, 'number density', 'p3', r`Find the number of molecules per cubic metre (in units of $10^{17}\ \mathrm{m^{-3}}$, 2 decimals).`, () => 1e-3 / (1.38e-23 * 300) / 1e17, 0.03, 2,
    r`$n = P/kT = \dfrac{1.0\times10^{-3}}{1.38\times10^{-23}\times300} = 2.42\times10^{17}\ \mathrm{m^{-3}}$.`, { unit: '×10¹⁷ /m³' }),
  pas(4, 'mean free path', 'p3', r`Find the mean free path (in m, 1 decimal).`, () => 1.38e-23 * 300 / (Math.SQRT2 * PI * (3.2e-10) ** 2 * 1e-3), 0.1, 1,
    r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P} = \dfrac{4.14\times10^{-21}}{1.414\times\pi\times1.024\times10^{-19}\times10^{-3}} = 9.1$ m.`, { unit: 'm' }),
  pas(4, 'collision frequency', 'p3', r`Find the average time (in ms, 1 decimal) between successive collisions of a molecule, using the mean speed $\sqrt{8RT/\pi M}$.`, () => 9.0999 / vmean(300, 0.028) * 1000, 0.3, 1,
    r`$\bar v = \sqrt{8\times8.31\times300/(\pi\times0.028)} = 476\ \mathrm{m\,s^{-1}}$. $\tau = \lambda/\bar v = 9.10/476 = 0.0191$ s $= 19.1$ ms.`, { unit: 'ms' }),
);

// ---------- Number templates ----------
const TT = (a, dp) => +Math.max(Math.abs(a) * 0.01, 0.6 * 10 ** -dp).toPrecision(1);
const mk = (id, level, sub, make, verify) => ({ id, type: 'nat', level, exams: EX[level], sub, make, verify });
const out = (v, q, ans, dp, unit, sol, extra = {}) => ({ v, q, answer: R(ans, dp), tol: TT(ans, dp), unit, sol, ...extra });
const GASES = [['hydrogen', 2], ['helium', 4], ['nitrogen', 28], ['oxygen', 32], ['argon', 40], ['carbon dioxide', 44]];

const gens = [
  mk('kt-g01', 2, 'ideal gas equation', (rng) => {
    const v = int(rng, 0, 3); const n = pick(rng, 1, 5, 1) / 2; const T = pick(rng, 250, 450, 50); const V = pick(rng, 5, 50, 5);
    const P = n * 8.31 * T / (V * 1e-3);
    if (v === 0) return out(v, r`Find the pressure (in kPa, 1 decimal) of ${n} mol of an ideal gas at ${T} K in a vessel of ${V} L. $R = 8.31$.`, P / 1000, 1, 'kPa', r`$P = nRT/V = ${n}\times8.31\times${T}/(${V}\times10^{-3}) = ${R(P, 0)}$ Pa $= ${R(P / 1000, 1)}$ kPa.`, { n, T, V });
    if (v === 1) return out(v, r`${n} mol of an ideal gas at ${T} K exerts a pressure of ${R(P / 1000, 1)} kPa. Find its volume (in litres, 1 decimal). $R = 8.31$.`, n * 8.31 * T / (R(P / 1000, 1) * 1000) * 1000, 1, 'L', r`$V = nRT/P = ${n}\times8.31\times${T}/${R(R(P / 1000, 1) * 1000, 0)} = ${R(n * 8.31 * T / (R(P / 1000, 1) * 1000) * 1000, 1)}$ L.`, { n, T, P1: R(P / 1000, 1) });
    if (v === 2) return out(v, r`A ${V} L vessel at ${T} K holds an ideal gas at ${R(P / 1000, 1)} kPa. Find the number of moles (3 decimals). $R = 8.31$.`, R(P / 1000, 1) * 1000 * V * 1e-3 / (8.31 * T), 3, 'mol', r`$n = PV/RT = ${R(P, 0)}\times${V}\times10^{-3}/(8.31\times${T}) = ${R(R(P / 1000, 1) * 1000 * V * 1e-3 / (8.31 * T), 3)}$ mol.`, { T, V, P1: R(P / 1000, 1) });
    return out(v, r`${n} mol of an ideal gas in a ${V} L vessel is at ${R(P / 1000, 1)} kPa. Find its temperature (in K, nearest whole number). $R = 8.31$.`, R(P / 1000, 1) * 1000 * V * 1e-3 / (n * 8.31), 0, 'K', r`$T = PV/nR = ${R(P, 0)}\times${V}\times10^{-3}/(${n}\times8.31) = ${R(R(P / 1000, 1) * 1000 * V * 1e-3 / (n * 8.31), 0)}$ K.`, { n, V, P1: R(P / 1000, 1) });
  }, (p) => (p.v === 0 ? p.n * 8.31 * p.T / (p.V * 1e-3) / 1000 : p.v === 1 ? p.n * 8.31 * p.T / p.P1 : p.v === 2 ? p.P1 * p.V / (8.31 * p.T) : p.P1 * p.V / (p.n * 8.31))),

  mk('kt-g02', 2, 'gas laws', (rng) => {
    const v = int(rng, 0, 3); const P1 = pick(rng, 1, 4, 1); const V1 = pick(rng, 2, 10, 2); const T1 = pick(rng, 250, 350, 50);
    if (v === 0) { const k = choose(rng, [2, 4, 5]); return out(v, r`A gas at ${P1} atm occupies ${V1} L. It is compressed isothermally to $1/${k}$ of this volume. Find the final pressure (in atm, 2 decimals).`, P1 * k, 2, 'atm', r`$P_2 = P_1V_1/V_2 = ${P1}\times${k} = ${P1 * k}$ atm.`, { P1, k }); }
    if (v === 1) { const T2 = T1 + pick(rng, 50, 150, 50); return out(v, r`${V1} L of gas at ${T1} K is heated at constant pressure to ${T2} K. Find the new volume (in L, 2 decimals).`, V1 * T2 / T1, 2, 'L', r`$V_2 = V_1T_2/T_1 = ${V1}\times${T2}/${T1} = ${R(V1 * T2 / T1, 2)}$ L.`, { V1, T1, T2 }); }
    if (v === 2) { const T2 = T1 + pick(rng, 50, 150, 50); return out(v, r`A sealed rigid vessel holds gas at ${P1} atm and ${T1} K. Find its pressure (in atm, 2 decimals) at ${T2} K.`, P1 * T2 / T1, 2, 'atm', r`$P_2 = P_1T_2/T_1 = ${P1}\times${T2}/${T1} = ${R(P1 * T2 / T1, 2)}$ atm.`, { P1, T1, T2 }); }
    const P2 = P1 + pick(rng, 1, 3, 1); const T2 = T1 + pick(rng, 50, 100, 50); const V2 = V1 * P1 * T2 / (T1 * P2);
    return out(v, r`A gas has $P_1 = ${P1}$ atm, $V_1 = ${V1}$ L, $T_1 = ${T1}$ K. It changes to $P_2 = ${P2}$ atm and $T_2 = ${T2}$ K. Find $V_2$ (in L, 2 decimals).`, V2, 2, 'L', r`$\dfrac{P_1V_1}{T_1} = \dfrac{P_2V_2}{T_2}$, so $V_2 = \dfrac{${P1}\times${V1}\times${T2}}{${T1}\times${P2}} = ${R(V2, 2)}$ L.`, { P1, V1, T1, P2, T2 });
  }, (p) => (p.v === 0 ? p.P1 * p.k : p.v === 1 ? p.V1 / p.T1 * p.T2 : p.v === 2 ? p.P1 / p.T1 * p.T2 : (p.P1 * p.V1 / p.T1) * p.T2 / p.P2)),

  mk('kt-g03', 2, 'moles and molecules', (rng) => {
    const v = int(rng, 0, 3); const [gn, M] = choose(rng, GASES); const m = pick(rng, 2, 20, 2);
    if (v === 0) return out(v, r`How many molecules (in units of $10^{22}$, 2 decimals) are in ${m} g of ${gn} ($M = ${M}$ g mol$^{-1}$)? $N_A = 6.02\times10^{23}$.`, m / M * 6.02e23 / 1e22, 2, '×10²²', r`$n = ${m}/${M} = ${R(m / M, 4)}$ mol. $N = nN_A = ${R(m / M, 4)}\times6.02\times10^{23} = ${R(m / M * 6.02e23 / 1e22, 2)}\times10^{22}$.`, { m, M });
    if (v === 1) return out(v, r`Find the mass of one ${gn} molecule ($M = ${M}$ g mol$^{-1}$) in units of $10^{-26}$ kg (2 decimals). $N_A = 6.02\times10^{23}$.`, M * 1e-3 / 6.02e23 / 1e-26, 2, '×10⁻²⁶ kg', r`$m = M/N_A = ${M}\times10^{-3}/6.02\times10^{23} = ${R(M * 1e-3 / 6.02e23 / 1e-26, 2)}\times10^{-26}$ kg.`, { M });
    if (v === 2) return out(v, r`Find the volume (in L, 2 decimals) of ${m} g of ${gn} ($M = ${M}$ g mol$^{-1}$) at STP (22.4 L per mole).`, m / M * 22.4, 2, 'L', r`$n = ${m}/${M}$ mol. $V = n\times22.4 = ${R(m / M * 22.4, 2)}$ L.`, { m, M });
    const V = pick(rng, 5, 44, 1) ; return out(v, r`Find the mass (in g, 2 decimals) of ${V} L of ${gn} ($M = ${M}$ g mol$^{-1}$) at STP (22.4 L per mole).`, V / 22.4 * M, 2, 'g', r`$n = ${V}/22.4 = ${R(V / 22.4, 4)}$ mol. $m = nM = ${R(V / 22.4 * M, 2)}$ g.`, { V, M });
  }, (p) => (p.v === 0 ? p.m / p.M * 6.02e1 : p.v === 1 ? p.M * 1e-3 / 6.02e23 * 1e26 : p.v === 2 ? p.m * 22.4 / p.M : p.V * p.M / 22.4)),

  mk('kt-g04', 2, 'density of a gas', (rng) => {
    const v = int(rng, 0, 2); const [gn, M] = choose(rng, GASES); const T = pick(rng, 250, 400, 50);
    const rho = 1.013e5 * M * 1e-3 / (8.31 * T);
    if (v === 0) return out(v, r`Find the density (in $\mathrm{kg\,m^{-3}}$, 3 decimals) of ${gn} ($M = ${M}$ g mol$^{-1}$) at 1 atm ($1.013\times10^5$ Pa) and ${T} K. $R = 8.31$.`, rho, 3, 'kg/m³', r`$\rho = PM/RT = \dfrac{1.013\times10^5\times${M}\times10^{-3}}{8.31\times${T}} = ${R(rho, 3)}\ \mathrm{kg\,m^{-3}}$.`, { M, T });
    if (v === 1) return out(v, r`A gas has density ${R(rho, 3)} $\mathrm{kg\,m^{-3}}$ at 1 atm and ${T} K. Find its molar mass (in g mol$^{-1}$, nearest whole number). $R = 8.31$.`, R(rho, 3) * 8.31 * T / 1.013e5 * 1000, 0, 'g/mol', r`$M = \rho RT/P = ${R(rho, 3)}\times8.31\times${T}/1.013\times10^5 = ${R(R(rho, 3) * 8.31 * T / 1.013e5, 5)}$ kg/mol $= ${R(R(rho, 3) * 8.31 * T / 1.013e5 * 1000, 0)}$ g/mol.`, { rho: R(rho, 3), T });
    const T2 = T + 100; return out(v, r`The density of a gas at constant pressure is ${R(rho, 3)} $\mathrm{kg\,m^{-3}}$ at ${T} K. Find its density at ${T2} K (in $\mathrm{kg\,m^{-3}}$, 3 decimals).`, R(rho, 3) * T / T2, 3, 'kg/m³', r`$\rho\propto1/T$ at constant $P$: $\rho' = ${R(rho, 3)}\times${T}/${T2} = ${R(R(rho, 3) * T / T2, 3)}$.`, { rho: R(rho, 3), T, T2 });
  }, (p) => (p.v === 0 ? 1.013e5 * p.M * 1e-3 / (8.31 * p.T) : p.v === 1 ? p.rho * 8.31 * p.T / 101.3 : p.rho / (p.T2 / p.T))),

  mk('kt-g05', 2, 'kinetic energy of molecules', (rng) => {
    const v = int(rng, 0, 2); const T = pick(rng, 200, 1000, 100);
    if (v === 0) return out(v, r`Find the average translational kinetic energy of a gas molecule at ${T} K (in units of $10^{-21}$ J, 2 decimals). $k = 1.38\times10^{-23}$.`, 1.5 * 1.38e-23 * T / 1e-21, 2, '×10⁻²¹ J', r`$\bar E = \tfrac32kT = 1.5\times1.38\times10^{-23}\times${T} = ${R(1.5 * 1.38e-23 * T / 1e-21, 2)}\times10^{-21}$ J.`, { T });
    if (v === 1) return out(v, r`Find the average translational kinetic energy of a molecule at ${T} K in meV (1 decimal). $k = 1.38\times10^{-23}$, $1\ \mathrm{eV} = 1.6\times10^{-19}$ J.`, 1.5 * 1.38e-23 * T / 1.6e-19 * 1000, 1, 'meV', r`$\bar E = 1.5\times1.38\times10^{-23}\times${T} = ${R(1.5 * 1.38e-23 * T / 1e-21, 2)}\times10^{-21}$ J $= ${R(1.5 * 1.38e-23 * T / 1.6e-19 * 1000, 1)}$ meV.`, { T });
    const E = R(1.5 * 1.38e-23 * T / 1e-21, 2); return out(v, r`The average translational kinetic energy of a molecule is $${E}\times10^{-21}$ J. Find the temperature (in K, nearest whole number). $k = 1.38\times10^{-23}$.`, E * 1e-21 / (1.5 * 1.38e-23), 0, 'K', r`$T = \dfrac{\bar E}{1.5k} = \dfrac{${E}\times10^{-21}}{1.5\times1.38\times10^{-23}} = ${R(E * 1e-21 / (1.5 * 1.38e-23), 0)}$ K.`, { E });
  }, (p) => (p.v === 0 ? 1.5 * 1.38e-2 * p.T : p.v === 1 ? 1.5 * 1.38e-23 * p.T / 1.6e-19 * 1e3 : p.E / (1.5 * 1.38e-2))),

  mk('kt-g06', 3, 'rms speed', (rng) => {
    const v = int(rng, 0, 2); const [gn, M] = choose(rng, GASES); const T = pick(rng, 200, 600, 50);
    if (v === 0) return out(v, r`Find the rms speed of ${gn} molecules ($M = ${M}$ g mol$^{-1}$) at ${T} K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $R = 8.31$.`, vrms(T, M * 1e-3), 0, 'm/s', r`$v_{rms} = \sqrt{3RT/M} = \sqrt{3\times8.31\times${T}/${M * 1e-3}} = ${R(vrms(T, M * 1e-3), 0)}\ \mathrm{m\,s^{-1}}$.`, { M, T });
    if (v === 1) { const vv = R(vrms(T, M * 1e-3) / 10, 0) * 10; return out(v, r`The rms speed of ${gn} molecules ($M = ${M}$ g mol$^{-1}$) is ${vv} $\mathrm{m\,s^{-1}}$. Find the temperature (in K, nearest whole number). $R = 8.31$.`, M * 1e-3 * vv * vv / (3 * 8.31), 0, 'K', r`$T = \dfrac{Mv^2}{3R} = \dfrac{${M * 1e-3}\times${vv}^2}{3\times8.31} = ${R(M * 1e-3 * vv * vv / (3 * 8.31), 0)}$ K.`, { M, vv }); }
    const T2 = T * choose(rng, [2, 4, 9]); return out(v, r`The temperature of a gas is raised from ${T} K to ${T2} K. By what factor does its rms speed rise (2 decimals)?`, Math.sqrt(T2 / T), 2, '', r`$v\propto\sqrt T$, so the factor is $\sqrt{${T2}/${T}} = ${R(Math.sqrt(T2 / T), 2)}$.`, { T, T2 });
  }, (p) => (p.v === 0 ? Math.sqrt(3 * 8.31 * p.T / (p.M * 1e-3)) : p.v === 1 ? p.M * 1e-3 * p.vv ** 2 / 24.93 : Math.pow(p.T2 / p.T, 0.5))),

  mk('kt-g07', 3, 'speeds of molecules', (rng) => {
    const v = int(rng, 0, 2); const [gn, M] = choose(rng, GASES); const T = pick(rng, 200, 600, 50);
    if (v === 0) return out(v, r`Find the mean speed of ${gn} molecules ($M = ${M}$ g mol$^{-1}$) at ${T} K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $v_{mean} = \sqrt{8RT/\pi M}$, $R = 8.31$.`, vmean(T, M * 1e-3), 0, 'm/s', r`$\bar v = \sqrt{\dfrac{8\times8.31\times${T}}{\pi\times${M * 1e-3}}} = ${R(vmean(T, M * 1e-3), 0)}\ \mathrm{m\,s^{-1}}$.`, { M, T });
    if (v === 1) return out(v, r`Find the most probable speed of ${gn} molecules ($M = ${M}$ g mol$^{-1}$) at ${T} K (in $\mathrm{m\,s^{-1}}$, nearest whole number). $v_{mp} = \sqrt{2RT/M}$, $R = 8.31$.`, vmp(T, M * 1e-3), 0, 'm/s', r`$v_{mp} = \sqrt{\dfrac{2\times8.31\times${T}}{${M * 1e-3}}} = ${R(vmp(T, M * 1e-3), 0)}\ \mathrm{m\,s^{-1}}$.`, { M, T });
    return out(v, r`At ${T} K the rms speed of ${gn} molecules ($M = ${M}$ g mol$^{-1}$) is ${R(vrms(T, M * 1e-3), 0)} $\mathrm{m\,s^{-1}}$. Find their most probable speed (in $\mathrm{m\,s^{-1}}$, nearest whole number).`, R(vrms(T, M * 1e-3), 0) * Math.sqrt(2 / 3), 0, 'm/s', r`$v_{mp}/v_{rms} = \sqrt{2/3}$, so $v_{mp} = ${R(vrms(T, M * 1e-3), 0)}\times0.8165 = ${R(R(vrms(T, M * 1e-3), 0) * Math.sqrt(2 / 3), 0)}\ \mathrm{m\,s^{-1}}$.`, { vr: R(vrms(T, M * 1e-3), 0) });
  }, (p) => (p.v === 0 ? Math.sqrt(8 * 8.31 * p.T / (PI * p.M * 1e-3)) : p.v === 1 ? Math.sqrt(2 * 8.31 * p.T / (p.M * 1e-3)) : p.vr * Math.sqrt(2 / 3))),

  mk('kt-g08', 3, 'ratio of speeds', (rng) => {
    const v = int(rng, 0, 2); const g1 = choose(rng, GASES.slice(0, 3)); const g2 = choose(rng, GASES.slice(3));
    if (v === 0) return out(v, r`At the same temperature, find the ratio of the rms speed of ${g1[0]} ($M = ${g1[1]}$) to that of ${g2[0]} ($M = ${g2[1]}$) (3 decimals).`, Math.sqrt(g2[1] / g1[1]), 3, '', r`$v\propto1/\sqrt M$. Ratio $= \sqrt{${g2[1]}/${g1[1]}} = ${R(Math.sqrt(g2[1] / g1[1]), 3)}$.`, { a: g1[1], b: g2[1] });
    if (v === 1) { const f = choose(rng, [2, 3, 4]); return out(v, r`At what temperature (in K) will the rms speed of ${g1[0]} equal that of ${g2[0]} at 300 K if ${g1[0]} has $M = ${g1[1]}$ and ${g2[0]} has $M = ${g2[1]}$? (nearest whole number)`, 300 * g1[1] / g2[1], 0, 'K', r`$\sqrt{T_1/M_1} = \sqrt{T_2/M_2}$, so $T_1 = 300\times${g1[1]}/${g2[1]} = ${R(300 * g1[1] / g2[1], 0)}$ K.`, { a: g1[1], b: g2[1], f }); }
    const T1 = pick(rng, 200, 300, 50); const T2 = T1 * choose(rng, [2, 3, 4]); return out(v, r`Find the ratio of the rms speed of ${g1[0]} ($M = ${g1[1]}$) at ${T1} K to that of ${g2[0]} ($M = ${g2[1]}$) at ${T2} K (3 decimals).`, Math.sqrt(T1 * g2[1] / (T2 * g1[1])), 3, '', r`$\dfrac{v_1}{v_2} = \sqrt{\dfrac{T_1M_2}{T_2M_1}} = \sqrt{\dfrac{${T1}\times${g2[1]}}{${T2}\times${g1[1]}}} = ${R(Math.sqrt(T1 * g2[1] / (T2 * g1[1])), 3)}$.`, { a: g1[1], b: g2[1], T1, T2 });
  }, (p) => (p.v === 0 ? Math.sqrt(p.b / p.a) : p.v === 1 ? 300 * p.a / p.b : Math.sqrt((p.T1 / p.a) / (p.T2 / p.b)))),

  mk('kt-g09', 3, 'pressure of a gas', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const rho = pick(rng, 0.5, 2, 0.1); const vv = pick(rng, 300, 600, 50); return out(v, r`A gas of density ${rho} $\mathrm{kg\,m^{-3}}$ has rms molecular speed ${vv} $\mathrm{m\,s^{-1}}$. Find its pressure (in kPa, 1 decimal).`, rho * vv * vv / 3 / 1000, 1, 'kPa', r`$P = \tfrac13\rho v_{rms}^2 = \tfrac13\times${rho}\times${vv}^2 = ${R(rho * vv * vv / 3, 0)}$ Pa $= ${R(rho * vv * vv / 3000, 1)}$ kPa.`, { rho, vv }); }
    if (v === 1) { const N = pick(rng, 1, 5, 1); const m = pick(rng, 3, 6, 1); const vv = pick(rng, 300, 600, 100); const V = pick(rng, 1, 4, 1); const P = N * 1e23 * m * 1e-26 * vv * vv / (3 * V * 1e-3); return out(v, r`${N}$\times10^{23}$ molecules, each of mass ${m}$\times10^{-26}$ kg and rms speed ${vv} $\mathrm{m\,s^{-1}}$, are in a ${V} L vessel. Find the pressure (in kPa, 1 decimal).`, P / 1000, 1, 'kPa', r`$P = \dfrac{Nmv_{rms}^2}{3V} = \dfrac{${N}\times10^{23}\times${m}\times10^{-26}\times${vv}^2}{3\times${V}\times10^{-3}} = ${R(P, 0)}$ Pa $= ${R(P / 1000, 1)}$ kPa.`, { N, m, vv, V }); }
    const n = pick(rng, 2, 6, 1); const E = pick(rng, 4, 8, 1); const P = 2 / 3 * n * 1e25 * E * 1e-21; return out(v, r`A gas has ${n}$\times10^{25}$ molecules per $\mathrm{m^3}$, each with average translational kinetic energy ${E}$\times10^{-21}$ J. Find the pressure (in kPa, 1 decimal).`, P / 1000, 1, 'kPa', r`$P = \tfrac23n\bar E_k = \tfrac23\times${n}\times10^{25}\times${E}\times10^{-21} = ${R(P, 0)}$ Pa $= ${R(P / 1000, 1)}$ kPa.`, { n, E });
  }, (p) => (p.v === 0 ? p.rho * p.vv ** 2 / 3000 : p.v === 1 ? p.N * 1e23 * p.m * 1e-26 * p.vv ** 2 / (3 * p.V * 1e-3 * 1000) : 2 * p.n * p.E * 1e4 / 3 / 1000 * 1)),

  mk('kt-g10', 3, 'Dalton\'s law', (rng) => {
    const v = int(rng, 0, 2); const g1 = choose(rng, [['hydrogen', 2], ['helium', 4]]); const g2 = choose(rng, [['nitrogen', 28], ['oxygen', 32]]); const m1 = pick(rng, 2, 8, 2); const m2 = pick(rng, 8, 56, 8); const V = pick(rng, 10, 40, 10); const T = pick(rng, 300, 400, 50);
    const n1 = m1 / g1[1]; const n2 = m2 / g2[1];
    if (v === 0) return out(v, r`A ${V} L vessel at ${T} K holds ${m1} g of ${g1[0]} ($M = ${g1[1]}$) and ${m2} g of ${g2[0]} ($M = ${g2[1]}$). Find the total pressure (in kPa, 1 decimal). $R = 8.31$.`, (n1 + n2) * 8.31 * T / (V * 1e-3) / 1000, 1, 'kPa', r`$n_1 = ${R(n1, 3)}$ mol, $n_2 = ${R(n2, 3)}$ mol. $P = \dfrac{(n_1 + n_2)RT}{V} = \dfrac{${R(n1 + n2, 3)}\times8.31\times${T}}{${V}\times10^{-3}} = ${R((n1 + n2) * 8.31 * T / (V * 1e-3) / 1000, 1)}$ kPa.`, { n1, n2, V, T });
    if (v === 1) return out(v, r`A ${V} L vessel at ${T} K holds ${m1} g of ${g1[0]} ($M = ${g1[1]}$) and ${m2} g of ${g2[0]} ($M = ${g2[1]}$). Find the partial pressure of the ${g1[0]} (in kPa, 1 decimal). $R = 8.31$.`, n1 * 8.31 * T / (V * 1e-3) / 1000, 1, 'kPa', r`$n_1 = ${m1}/${g1[1]} = ${R(n1, 3)}$ mol. $P_1 = \dfrac{n_1RT}{V} = \dfrac{${R(n1, 3)}\times8.31\times${T}}{${V}\times10^{-3}} = ${R(n1 * 8.31 * T / (V * 1e-3) / 1000, 1)}$ kPa.`, { n1, V, T });
    return out(v, r`A mixture contains ${m1} g of ${g1[0]} ($M = ${g1[1]}$) and ${m2} g of ${g2[0]} ($M = ${g2[1]}$). What percentage of the total pressure is due to the ${g2[0]} (1 decimal)?`, n2 / (n1 + n2) * 100, 1, '%', r`Partial pressure $\propto$ moles. $x_2 = \dfrac{n_2}{n_1 + n_2} = \dfrac{${R(n2, 3)}}{${R(n1 + n2, 3)}} = ${R(n2 / (n1 + n2), 4)}$, i.e. ${R(n2 / (n1 + n2) * 100, 1)}%.`, { n1, n2 });
  }, (p) => (p.v === 0 ? (p.n1 + p.n2) * 8.31 * p.T / p.V : p.v === 1 ? p.n1 * 8.31 * p.T / p.V : 100 * p.n2 / (p.n1 + p.n2))),

  mk('kt-g11', 4, 'gas mixtures', (rng) => {
    const v = int(rng, 0, 2); const g1 = choose(rng, [['hydrogen', 2], ['helium', 4]]); const g2 = choose(rng, [['nitrogen', 28], ['oxygen', 32], ['argon', 40]]); const n1 = pick(rng, 1, 4, 1); const n2 = pick(rng, 1, 4, 1); const T = pick(rng, 250, 400, 50);
    const Mm = (n1 * g1[1] + n2 * g2[1]) / (n1 + n2);
    if (v === 0) return out(v, r`Find the average molar mass (in g mol$^{-1}$, 2 decimals) of a mixture of ${n1} mol of ${g1[0]} ($M = ${g1[1]}$) and ${n2} mol of ${g2[0]} ($M = ${g2[1]}$).`, Mm, 2, 'g/mol', r`$M = \dfrac{${n1}\times${g1[1]} + ${n2}\times${g2[1]}}{${n1 + n2}} = ${R(Mm, 2)}$ g mol$^{-1}$.`, { n1, n2, a: g1[1], b: g2[1] });
    if (v === 1) { const v2 = 3 * 8.31 * T / 2 * (1 / (g1[1] * 1e-3) + 1 / (g2[1] * 1e-3)); return out(v, r`Equal numbers of moles of ${g1[0]} ($M = ${g1[1]}$) and ${g2[0]} ($M = ${g2[1]}$) are mixed at ${T} K. Find the rms speed of all the molecules together (in $\mathrm{m\,s^{-1}}$, nearest whole number). $R = 8.31$.`, Math.sqrt(v2), 0, 'm/s', r`$\overline{v^2} = \tfrac12\left(\dfrac{3RT}{M_1} + \dfrac{3RT}{M_2}\right) = \dfrac{3\times8.31\times${T}}{2}\left(\dfrac1{${g1[1] * 1e-3}} + \dfrac1{${g2[1] * 1e-3}}\right) = ${R(v2, 0)}$. $v_{rms} = ${R(Math.sqrt(v2), 0)}\ \mathrm{m\,s^{-1}}$.`, { a: g1[1], b: g2[1], T }); }
    const cv1 = g1[0] === 'hydrogen' ? 2.5 : 1.5; const cv2 = g2[0] === 'argon' ? 1.5 : 2.5; const gam = (n1 * (cv1 + 1) + n2 * (cv2 + 1)) / (n1 * cv1 + n2 * cv2);
    return out(v, r`Find $\gamma$ (3 decimals) of a mixture of ${n1} mol of ${g1[0]} (${cv1 === 2.5 ? 'rigid diatomic' : 'monatomic'}) and ${n2} mol of ${g2[0]} (${cv2 === 2.5 ? 'rigid diatomic' : 'monatomic'}).`, gam, 3, '', r`$C_p = ${R(n1 * (cv1 + 1) + n2 * (cv2 + 1), 2)}R$ and $C_v = ${R(n1 * cv1 + n2 * cv2, 2)}R$ (totals). $\gamma = ${R(gam, 3)}$.`, { n1, n2, cv1, cv2 });
  }, (p) => (p.v === 0 ? (p.n1 * p.a + p.n2 * p.b) / (p.n1 + p.n2) : p.v === 1 ? Math.sqrt(0.5 * (3 * 8.31 * p.T / (p.a * 1e-3) + 3 * 8.31 * p.T / (p.b * 1e-3))) : (p.n1 * p.cv1 + p.n1 + p.n2 * p.cv2 + p.n2) / (p.n1 * p.cv1 + p.n2 * p.cv2))),
];

gens.push(
  mk('kt-g12', 3, 'degrees of freedom and internal energy', (rng) => {
    const v = int(rng, 0, 3); const f = choose(rng, [3, 5, 6, 7]); const n = pick(rng, 1, 4, 1); const T = pick(rng, 250, 450, 50);
    if (v === 0) return out(v, r`Find the internal energy (in J, nearest whole number) of ${n} mol of an ideal gas with ${f} degrees of freedom per molecule at ${T} K. $R = 8.31$.`, f / 2 * n * 8.31 * T, 0, 'J', r`$U = \dfrac f2nRT = ${f / 2}\times${n}\times8.31\times${T} = ${R(f / 2 * n * 8.31 * T, 0)}$ J.`, { f, n, T });
    if (v === 1) return out(v, r`Find $C_v$ and then $C_p$ for a gas with ${f} degrees of freedom. Give $C_p$ in J mol$^{-1}$K$^{-1}$ (2 decimals). $R = 8.31$.`, (f / 2 + 1) * 8.31, 2, 'J/mol K', r`$C_v = \tfrac f2R = ${f / 2}R$ and $C_p = C_v + R = ${f / 2 + 1}R = ${R((f / 2 + 1) * 8.31, 2)}$ J mol$^{-1}$K$^{-1}$.`, { f });
    if (v === 2) { const U = R(f / 2 * n * 8.31 * T, 0); return out(v, r`The internal energy of ${n} mol of an ideal gas at ${T} K is ${U} J. Find the number of degrees of freedom per molecule (nearest whole number). $R = 8.31$.`, 2 * U / (n * 8.31 * T), 0, '', r`$f = \dfrac{2U}{nRT} = \dfrac{2\times${U}}{${n}\times8.31\times${T}} = ${R(2 * U / (n * 8.31 * T), 2)}\approx${f}$.`, { U, n, T }); }
    return out(v, r`Find $\gamma$ (3 decimals) for a gas whose molecules have ${f} degrees of freedom.`, 1 + 2 / f, 3, '', r`$\gamma = 1 + 2/f = 1 + 2/${f} = ${R(1 + 2 / f, 3)}$.`, { f });
  }, (p) => (p.v === 0 ? p.f * p.n * 8.31 * p.T / 2 : p.v === 1 ? (p.f + 2) / 2 * 8.31 : p.v === 2 ? Math.round(2 * p.U / (p.n * 8.31 * p.T)) : (p.f + 2) / p.f)),

  mk('kt-g13', 4, 'mean free path', (rng) => {
    const v = int(rng, 0, 3); const d = pick(rng, 25, 40, 5); const T = pick(rng, 250, 400, 50); const P = choose(rng, [1.013e5, 1e4, 1e3, 1e-1, 1e-3]);
    const lam = 1.38e-23 * T / (Math.SQRT2 * PI * (d * 1e-11) ** 2 * P); const tx = (x) => { const e = Math.floor(Math.log10(Math.abs(x))); const m = +(x / 10 ** e).toPrecision(3); return e === 0 ? String(m) : m + '\\times10^{' + e + '}'; };
    if (v === 0) return out(v, r`Find the mean free path of a gas (molecular diameter ${d / 10} Å $= ${d / 10}\times10^{-10}$ m) at ${T} K and $${tx(P)}$ Pa (in m, 3 significant figures). $k = 1.38\times10^{-23}$.`, Number(lam.toPrecision(3)), 15, 'm', r`$\lambda = \dfrac{kT}{\sqrt2\pi d^2P} = \dfrac{1.38\times10^{-23}\times${T}}{1.414\times\pi\times(${d / 10}\times10^{-10})^2\times${tx(P)}} = ${tx(lam)}$ m.`, { d, T, P });
    if (v === 1) { const f = choose(rng, [2, 3, 4]); return out(v, r`At constant temperature a gas has mean free path $${tx(lam)}$ m. Find the mean free path (3 significant figures) after the pressure is made ${f} times larger.`, Number((lam / f).toPrecision(3)), 15, 'm', r`$\lambda\propto1/P$, so $\lambda' = ${tx(lam)}/${f} = ${tx(lam / f)}$ m.`, { lam, f }); }
    if (v === 2) { const f = choose(rng, [2, 3, 4]); return out(v, r`The molecular diameter of a gas is increased by a factor ${f} (all else equal). By what factor does the mean free path change (3 decimals)?`, 1 / f ** 2, 3, '', r`$\lambda\propto1/d^2$, so the factor is $1/${f}^2 = ${R(1 / f ** 2, 3)}$.`, { f }); }
    const T2 = T * choose(rng, [2, 3]); return out(v, r`A gas is heated from ${T} K to ${T2} K at constant volume (fixed amount of gas). By what factor does the mean free path change?`, 1, 0, '', r`$\lambda = 1/(\sqrt2\pi d^2n)$ with $n = N/V$ unchanged, so $\lambda$ does not change: factor 1.`, { T, T2 });
  }, (p) => (p.v === 0 ? 1.38e-23 * p.T / (Math.SQRT2 * PI * (p.d * 1e-11) ** 2 * p.P) : p.v === 1 ? p.lam / p.f : p.v === 2 ? Math.pow(p.f, -2) : 1)),

  mk('kt-g14', 4, 'collision frequency', (rng) => {
    const v = int(rng, 0, 1); const [gn, M] = choose(rng, [['nitrogen', 28], ['oxygen', 32], ['hydrogen', 2]]); const lam = pick(rng, 5, 20, 5) * 1e-8; const T = pick(rng, 250, 350, 50);
    const vb = vmean(T, M * 1e-3);
    if (v === 0) return out(v, r`${gn.replace(/^./, (c) => c.toUpperCase())} ($M = ${M}$ g mol$^{-1}$) at ${T} K has a mean free path of ${lam * 1e8}$\times10^{-8}$ m. Find the number of collisions per second of a molecule (in units of $10^9\ \mathrm{s^{-1}}$, 2 decimals), using the mean speed. $R = 8.31$.`, vb / lam / 1e9, 2, '×10⁹ /s', r`$\bar v = \sqrt{8RT/\pi M} = ${R(vb, 1)}\ \mathrm{m\,s^{-1}}$. $z = \bar v/\lambda = ${R(vb, 1)}/(${lam * 1e8}\times10^{-8}) = ${R(vb / lam / 1e9, 2)}\times10^9\ \mathrm{s^{-1}}$.`, { M, T, lam });
    return out(v, r`${gn.replace(/^./, (c) => c.toUpperCase())} ($M = ${M}$ g mol$^{-1}$) at ${T} K has a mean free path of ${lam * 1e8}$\times10^{-8}$ m. Find the average time between collisions (in units of $10^{-10}$ s, 2 decimals), using the mean speed. $R = 8.31$.`, lam / vb / 1e-10, 2, '×10⁻¹⁰ s', r`$\bar v = \sqrt{8RT/\pi M} = ${R(vb, 1)}\ \mathrm{m\,s^{-1}}$. $\tau = \lambda/\bar v = ${lam * 1e8}\times10^{-8}/${R(vb, 1)} = ${R(lam / vb / 1e-10, 2)}\times10^{-10}$ s.`, { M, T, lam });
  }, (p) => (p.v === 0 ? Math.sqrt(8 * 8.31 * p.T / (PI * p.M * 1e-3)) / p.lam / 1e9 : p.lam / Math.sqrt(8 * 8.31 * p.T / (PI * p.M * 1e-3)) / 1e-10)),

  mk('kt-g15', 3, 'connected vessels and leaks', (rng) => {
    const v = int(rng, 0, 3); const P1 = pick(rng, 1, 4, 1); const V1 = pick(rng, 2, 6, 2); const P2 = pick(rng, 1, 3, 1); const V2 = pick(rng, 2, 8, 2);
    if (v === 0) return out(v, r`Vessel A (${V1} L) holds a gas at ${P1} atm and vessel B (${V2} L) holds the same gas at ${P2} atm, both at the same temperature. They are connected and the gas settles at that temperature. Find the final pressure (in atm, 3 decimals).`, (P1 * V1 + P2 * V2) / (V1 + V2), 3, 'atm', r`Moles are conserved: $P(V_1 + V_2) = P_1V_1 + P_2V_2$. $P = \dfrac{${P1}\times${V1} + ${P2}\times${V2}}{${V1 + V2}} = ${R((P1 * V1 + P2 * V2) / (V1 + V2), 3)}$ atm.`, { P1, V1, P2, V2 });
    if (v === 1) { const Pf = P1 - pick(rng, 1, P1 - 0 > 1 ? P1 - 1 : 1, 1) * 0.5; const used = (P1 - Pf) / P1 * 100; return out(v, r`A cylinder at constant temperature holds gas at ${P1} atm. After some is used the pressure is ${Pf} atm. What percentage of the gas has been used (1 decimal)?`, used, 1, '%', r`$n\propto P$ at fixed $V$, $T$. Used $= (${P1} - ${Pf})/${P1} = ${R(used / 100, 3)}$, i.e. ${R(used, 1)}%.`, { P1, Pf }); }
    if (v === 2) { const T1 = pick(rng, 280, 320, 20); const T2 = T1 + pick(rng, 60, 180, 40); return out(v, r`An open flask of air at ${T1} K is heated to ${T2} K at constant atmospheric pressure. What percentage of the original air leaves the flask (1 decimal)?`, (1 - T1 / T2) * 100, 1, '%', r`At fixed $P$, $V$: $n\propto1/T$. Remaining $= ${T1}/${T2} = ${R(T1 / T2, 4)}$. Escaped $= ${R((1 - T1 / T2) * 100, 1)}\%$.`, { T1, T2 }); }
    const T1 = pick(rng, 280, 320, 20); const T2 = T1 * 2; const Pf = 2 * P1 * (T1 / T1) / 3 * 3 / 2; return out(v, r`Two identical bulbs, each at ${P1} atm and ${T1} K, are joined by a tube. One is kept at ${T1} K and the other heated to ${T2} K. Find the final pressure (in atm, 3 decimals).`, 2 * P1 / (1 + 0.5), 3, 'atm', r`Moles are conserved: $\dfrac{2P_1}{${T1}} = \dfrac{P}{${T1}} + \dfrac P{${T2}}$. So $P = \dfrac{2P_1}{1 + 1/2} = ${R(2 * P1 / 1.5, 3)}$ atm.`, { P1, T1, T2 });
  }, (p) => (p.v === 0 ? (p.P1 * p.V1 + p.P2 * p.V2) / (p.V1 + p.V2) : p.v === 1 ? 100 - p.Pf / p.P1 * 100 : p.v === 2 ? (p.T2 - p.T1) / p.T2 * 100 : 2 * p.P1 * p.T2 / (p.T2 + p.T1))),

  mk('kt-g16', 3, 'trapped air column', (rng) => {
    const v = int(rng, 0, 2); const h = pick(rng, 4, 20, 2); const L = pick(rng, 10, 30, 5);
    if (v === 0) return out(v, r`A horizontal tube has a mercury thread ${h} cm long trapping an air column of ${L} cm at atmospheric pressure (76 cmHg). The tube is turned vertical with the open end up. Find the new length of the air column (in cm, 2 decimals). Temperature is constant.`, L * 76 / (76 + h), 2, 'cm', r`$P_1 = 76$ cmHg, $P_2 = 76 + ${h}$ cmHg. $L_2 = ${L}\times76/${76 + h} = ${R(L * 76 / (76 + h), 2)}$ cm.`, { h, L });
    if (v === 1) return out(v, r`A horizontal tube has a mercury thread ${h} cm long trapping an air column of ${L} cm at atmospheric pressure (76 cmHg). The tube is turned vertical with the open end down. Find the new length of the air column (in cm, 2 decimals). Temperature is constant and no mercury spills.`, L * 76 / (76 - h), 2, 'cm', r`Open end down, the mercury pulls the air down: $P_2 = 76 - ${h}$ cmHg. $L_2 = ${L}\times76/${76 - h} = ${R(L * 76 / (76 - h), 2)}$ cm.`, { h, L });
    const P2 = pick(rng, 100, 190, 10); return out(v, r`A trapped air column of ${L} cm at 76 cmHg is compressed isothermally until its pressure is ${P2} cmHg. Find the new length (in cm, 2 decimals).`, L * 76 / P2, 2, 'cm', r`$P_1L_1 = P_2L_2$, so $L_2 = ${L}\times76/${P2} = ${R(L * 76 / P2, 2)}$ cm.`, { L, P2 });
  }, (p) => (p.v === 0 ? p.L / (1 + p.h / 76) : p.v === 1 ? p.L / (1 - p.h / 76) : p.L * 76 / p.P2)),

  mk('kt-g17', 3, 'Graham\'s law', (rng) => {
    const v = int(rng, 0, 2); const g1 = choose(rng, [['hydrogen', 2], ['helium', 4], ['methane', 16]]); const g2 = choose(rng, [['nitrogen', 28], ['oxygen', 32], ['carbon dioxide', 44]]);
    if (v === 0) return out(v, r`Find the ratio of the rates of effusion of ${g1[0]} ($M = ${g1[1]}$) to ${g2[0]} ($M = ${g2[1]}$) under the same conditions (3 decimals).`, Math.sqrt(g2[1] / g1[1]), 3, '', r`Rate $\propto1/\sqrt M$. Ratio $= \sqrt{${g2[1]}/${g1[1]}} = ${R(Math.sqrt(g2[1] / g1[1]), 3)}$.`, { a: g1[1], b: g2[1] });
    if (v === 1) { const t1 = pick(rng, 5, 20, 5); return out(v, r`A sample of ${g1[0]} ($M = ${g1[1]}$) effuses in ${t1} minutes. How long (in minutes, 2 decimals) does an equal volume of ${g2[0]} ($M = ${g2[1]}$) take at the same $P$ and $T$?`, t1 * Math.sqrt(g2[1] / g1[1]), 2, 'min', r`Time $\propto\sqrt M$. $t_2 = ${t1}\times\sqrt{${g2[1]}/${g1[1]}} = ${R(t1 * Math.sqrt(g2[1] / g1[1]), 2)}$ min.`, { a: g1[1], b: g2[1], t1 }); }
    const k = choose(rng, [2, 3, 4]); const Mx = g1[1] * k * k; return out(v, r`An unknown gas effuses ${k} times more slowly than ${g1[0]} ($M = ${g1[1]}$) under the same conditions. Find its molar mass (in g mol$^{-1}$).`, Mx, 0, 'g/mol', r`Rate $\propto1/\sqrt M$. $\sqrt{M_x/${g1[1]}} = ${k}$, so $M_x = ${g1[1]}\times${k}^2 = ${Mx}$ g mol$^{-1}$.`, { a: g1[1], k });
  }, (p) => (p.v === 0 ? Math.sqrt(p.b / p.a) : p.v === 1 ? p.t1 * Math.sqrt(p.b) / Math.sqrt(p.a) : p.a * p.k * p.k)),

  mk('kt-g18', 4, 'gases and fluids', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const h = pick(rng, 5, 40, 5); const r1 = (1.013e5 + 1000 * 9.8 * h) / 1.013e5; return out(v, r`An air bubble rises from a depth of ${h} m in a lake to the surface at constant temperature. By what factor does its volume increase (2 decimals)? ($P_0 = 1.013\times10^5$ Pa, $\rho = 1000$, $g = 9.8$)`, r1, 2, '', r`$P_1 = P_0 + \rho gh = ${R(1.013e5 + 9800 * h, 0)}$ Pa. $V_2/V_1 = P_1/P_0 = ${R(r1, 3)}$.`, { h }); }
    if (v === 1) { const T = pick(rng, 250, 300, 25); const f = choose(rng, [2, 4, 10]); const hh = 8.31 * T * Math.log(f) / (0.029 * 9.8); return out(v, r`In an isothermal atmosphere at ${T} K ($M = 0.029$ kg mol$^{-1}$), $P = P_0e^{-Mgh/RT}$. At what height (in m, nearest 10 m) has the pressure fallen to $1/${f}$ of its ground value? ($g = 9.8$, $R = 8.31$)`, hh, 0, 'm', r`$h = \dfrac{RT\ln${f}}{Mg} = \dfrac{8.31\times${T}\times${R(Math.log(f), 4)}}{0.029\times9.8} = ${R(hh, 0)}$ m.`, { T, f }); }
    const Hh = pick(rng, 100, 400, 100); const fl = (1.013e5 * 0.029 / (8.31 * 300) - 1.013e5 * 0.004 / (8.31 * 300)) * 9.8 * Hh / 10; return out(v, r`A balloon of volume ${Hh / 10} $\mathrm{m^3}$ is filled with helium ($M = 4$ g mol$^{-1}$) at 1 atm and 300 K. Air has $M = 29$ g mol$^{-1}$. Neglecting the balloon's own mass, find the lifting force (in N, 1 decimal). ($R = 8.31$, $g = 9.8$)`, fl, 1, 'N', r`$\rho = PM/RT$: air $1.178$ and helium $0.1625\ \mathrm{kg\,m^{-3}}$. Lift $= (\rho_{air} - \rho_{He})Vg = ${R(1.013e5 * 0.025 / (8.31 * 300), 3)}\times${Hh / 10}\times9.8 = ${R(fl, 1)}$ N.`, { Hh });
  }, (p) => (p.v === 0 ? 1 + 1000 * 9.8 * p.h / 1.013e5 : p.v === 1 ? 8.31 * p.T * Math.log(p.f) / (0.029 * 9.8) : (1.013e5 / (8.31 * 300)) * (0.029 - 0.004) * 9.8 * p.Hh / 10)),

  mk('kt-g19', 2, 'discrete speeds', (rng) => {
    const v = int(rng, 0, 2); const base = pick(rng, 100, 300, 100); const sp = [1, 2, 3, 4, 5].map((i) => base * i / 2 + 0);
    const n = int(rng, 4, 6); const arr = []; for (let i = 0; i < n; i++) arr.push(pick(rng, 1, 9, 1) * 100);
    const mean = arr.reduce((a, b) => a + b, 0) / n; const rms = Math.sqrt(arr.reduce((a, b) => a + b * b, 0) / n);
    if (v === 0) return out(v, r`${n} molecules have speeds ${arr.join(', ')} $\mathrm{m\,s^{-1}}$. Find their mean speed (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, mean, 1, 'm/s', r`$\bar v = \dfrac{${arr.join(' + ')}}{${n}} = ${R(mean, 1)}\ \mathrm{m\,s^{-1}}$.`, { arr });
    if (v === 1) return out(v, r`${n} molecules have speeds ${arr.join(', ')} $\mathrm{m\,s^{-1}}$. Find their rms speed (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, rms, 1, 'm/s', r`$v_{rms} = \sqrt{\dfrac{\sum v^2}{N}} = \sqrt{\dfrac{${arr.map((x) => x * x).join(' + ')}}{${n}}} = ${R(rms, 1)}\ \mathrm{m\,s^{-1}}$.`, { arr });
    return out(v, r`${n} molecules have speeds ${arr.join(', ')} $\mathrm{m\,s^{-1}}$. Find the ratio $v_{rms}/\bar v$ (3 decimals).`, rms / mean, 3, '', r`$\bar v = ${R(mean, 2)}$, $v_{rms} = ${R(rms, 2)}$. Ratio $= ${R(rms / mean, 3)}$. It is always at least 1.`, { arr });
  }, (p) => { const n = p.arr.length; const m = p.arr.reduce((a, b) => a + b, 0) / n; const q = Math.sqrt(p.arr.reduce((a, b) => a + b * b, 0) / n); return p.v === 0 ? m : p.v === 1 ? q : q / m; }),

  mk('kt-g20', 5, 'effusion', (rng) => {
    const v = int(rng, 0, 2); const A = pick(rng, 1, 5, 1) * 1e-7; const Vv = pick(rng, 1, 5, 1) * 1e-3; const T = pick(rng, 280, 340, 20); const P = pick(rng, 1, 5, 1) * 1e4;
    const vb = vmean(T, 0.028); const nd = P / (1.38e-23 * T);
    if (v === 0) return out(v, r`Nitrogen ($M = 0.028$) at ${P / 1e4}$\times10^4$ Pa and ${T} K leaks through a hole of area ${A * 1e7}$\times10^{-7}\ \mathrm{m^2}$ into a vacuum. Using rate $= \tfrac14n\bar vA$, find the number of molecules escaping per second (in units of $10^{19}\ \mathrm{s^{-1}}$, 2 decimals). $k = 1.38\times10^{-23}$, $R = 8.31$.`, 0.25 * nd * vb * A / 1e19, 2, '×10¹⁹ /s', r`$n = P/kT = ${R(nd / 1e24, 3)}\times10^{24}\ \mathrm{m^{-3}}$. $\bar v = ${R(vb, 1)}\ \mathrm{m\,s^{-1}}$. Rate $= \tfrac14n\bar vA = ${R(0.25 * nd * vb * A / 1e19, 2)}\times10^{19}\ \mathrm{s^{-1}}$.`, { P, T, A });
    if (v === 1) { const tau = 4 * Vv / (A * vb); return out(v, r`A ${Vv * 1000} L vessel of nitrogen ($M = 0.028$) at ${T} K leaks through a hole of area ${A * 1e7}$\times10^{-7}\ \mathrm{m^2}$ into a vacuum. The pressure falls as $e^{-t/\tau}$ with $\tau = 4V/(A\bar v)$. Find $\tau$ (in s, 1 decimal). $R = 8.31$.`, tau, 1, 's', r`$\bar v = \sqrt{8RT/\pi M} = ${R(vb, 1)}\ \mathrm{m\,s^{-1}}$. $\tau = \dfrac{4V}{A\bar v} = \dfrac{4\times${Vv}}{${A}\times${R(vb, 1)}} = ${R(tau, 1)}$ s.`, { Vv, A, T }); }
    const tau = 4 * Vv / (A * vb); return out(v, r`A ${Vv * 1000} L vessel of nitrogen ($M = 0.028$) at ${T} K leaks through a hole of area ${A * 1e7}$\times10^{-7}\ \mathrm{m^2}$ into a vacuum, with $\tau = 4V/(A\bar v)$. In what time (in s, 1 decimal) does the pressure fall to one quarter of its initial value? $R = 8.31$.`, tau * Math.log(4), 1, 's', r`$P = P_0e^{-t/\tau}$, so $t = \tau\ln4$. $\bar v = ${R(vb, 1)}$, $\tau = ${R(tau, 2)}$ s, $t = ${R(tau * Math.log(4), 1)}$ s.`, { Vv, A, T });
  }, (p) => { const vb2 = Math.sqrt(8 * 8.31 * p.T / (PI * 0.028)); return p.v === 0 ? 0.25 * p.P / (1.38e-23 * p.T) * vb2 * p.A / 1e19 : p.v === 1 ? 4 * p.Vv / (p.A * vb2) : 4 * p.Vv / (p.A * vb2) * Math.log(4); }),

  mk('kt-g21', 4, 'piston between gases', (rng) => {
    const v = int(rng, 0, 2); const n1 = pick(rng, 1, 3, 1); const n2 = pick(rng, 1, 3, 1); const L = pick(rng, 60, 120, 30); const T1 = pick(rng, 300, 400, 100); const T2 = 300;
    if (v === 0) return out(v, r`A horizontal cylinder ${L} cm long is divided by a freely moving piston. The left side holds ${n1} mol and the right ${n2} mol of the same gas, both at the same temperature. Find the distance of the piston from the left end (in cm, 1 decimal).`, L * n1 / (n1 + n2), 1, 'cm', r`Equal pressure and temperature mean $V\propto n$. Left length $= ${L}\times\dfrac{${n1}}{${n1 + n2}} = ${R(L * n1 / (n1 + n2), 1)}$ cm.`, { L, n1, n2 });
    if (v === 1) return out(v, r`A horizontal cylinder ${L} cm long is divided by a freely moving piston. The left side holds ${n1} mol at ${T1} K and the right ${n2} mol at ${T2} K (same gas). Find the distance of the piston from the left end (in cm, 1 decimal).`, L * n1 * T1 / (n1 * T1 + n2 * T2), 1, 'cm', r`Equal pressure: $\dfrac{n_1T_1}{V_1} = \dfrac{n_2T_2}{V_2}$. $V_1\propto n_1T_1 = ${n1 * T1}$ and $V_2\propto n_2T_2 = ${n2 * T2}$. Left length $= ${L}\times\dfrac{${n1 * T1}}{${n1 * T1 + n2 * T2}} = ${R(L * n1 * T1 / (n1 * T1 + n2 * T2), 1)}$ cm.`, { L, n1, n2, T1, T2 });
    return out(v, r`The two sides of a freely pistoned cylinder hold ${n1} mol at ${T1} K (left) and ${n2} mol at ${T2} K (right) of the same gas, in equilibrium. Find the ratio $V_{left}/V_{right}$ (2 decimals).`, n1 * T1 / (n2 * T2), 2, '', r`Equal pressure: $V_1/V_2 = \dfrac{n_1T_1}{n_2T_2} = \dfrac{${n1 * T1}}{${n2 * T2}} = ${R(n1 * T1 / (n2 * T2), 2)}$.`, { n1, n2, T1, T2 });
  }, (p) => (p.v === 0 ? p.L * p.n1 / (p.n1 + p.n2) : p.v === 1 ? p.L * p.n1 * p.T1 / (p.n1 * p.T1 + p.n2 * p.T2) : (p.n1 * p.T1) / (p.n2 * p.T2))),
);

// ======== Expansion block (added 2026-11-22): more hard items and templates, ids kt-x001 onward ========
import * as XH from '../_entrance.js';
const { pick: xpick, int: xint, choose: xchoose, fmt: xfmt, shuffleOpts: xsh, numOpts: xno } = XH;
const xr = String.raw;
const XE = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xex = (level, type, neet) => { const e = [...XE[level]]; if (neet && level === 4) e.push('neet'); if (false && level <= 3 && type === 'mcq') e.push('cuet'); return e; };
let xk = 0, xc = 0;
const XPOS = [2, 0, 3, 1, 3, 1, 0, 2];
const xb = (level, sub, o) => { const { neet, ...rest } = o; return { id: `kt-x${String(++xk).padStart(3, '0')}`, level, exams: xex(level, o.type, neet), sub, ...rest }; };
const xq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xn = (level, sub, q, ans, tol, calc, sol, o = {}) => {
  const v = calc();
  if (!(Math.abs(v - ans) <= Math.max(tol, 1e-9) + 1e-9)) throw new Error(`kt item ${xk + 1}: calc ${v} vs answer ${ans}`);
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

const xRG = 8.31; const xKB = 1.38e-23; const xNA = 6.02e23;
const xgroups = {
  xm1: { title: 'Ratios of molecular speeds', list1: [xr`A. $v_{rms}/v_{mp}$ for one gas`, xr`B. $v_{mean}/v_{mp}$ for one gas`, xr`C. $v_{rms}/v_{mean}$ for one gas`, 'D. $v_{rms}$ of hydrogen / $v_{rms}$ of oxygen at the same temperature'],
    list2: ['p. 1.085', 'q. 1.128', 'r. 1.225', 's. 4', 't. 2'] },
  xm2: { title: 'Ratio of specific heats', list1: ['A. Monatomic gas', 'B. Rigid diatomic gas', 'C. Rigid non-linear triatomic gas', 'D. Diatomic gas at a temperature where vibration is fully active'],
    list2: ['p. 5/3', 'q. 7/5', 'r. 4/3', 's. 9/7', 't. 1'] },
  xm3: { title: 'Heating a fixed mass in a rigid vessel (T doubled)', list1: ['A. Factor for the rms speed', 'B. Factor for the pressure', 'C. Factor for the mean free path', 'D. Factor for the mean time between collisions'],
    list2: [xr`p. $1$`, xr`q. $\sqrt2$`, xr`r. $2$`, xr`s. $1/\sqrt2$`, xr`t. $4$`] },
  xm4: { title: 'Heating at constant pressure (T raised four times)', list1: ['A. Factor for the rms speed', 'B. Factor for the number density', 'C. Factor for the mean free path', 'D. Factor for the number of collisions per second of one molecule'],
    list2: [xr`p. $1/4$`, xr`q. $1/2$`, xr`r. $2$`, xr`s. $4$`, xr`t. $1$`] },
  xm5: { title: 'Critical constants of a van der Waals gas', list1: ['A. Critical temperature $T_c$', 'B. Critical pressure $P_c$', 'C. Critical molar volume $V_c$', 'D. The ratio $P_cV_c/(RT_c)$'],
    list2: [xr`p. $\dfrac{a}{27b^2}$`, xr`q. $3b$`, xr`r. $\dfrac{8a}{27Rb}$`, xr`s. $\dfrac38$`, xr`t. $b$`] },
  xm6: { title: 'Effusion', list1: ['A. Mean kinetic energy of a molecule inside the gas', 'B. Mean kinetic energy of the molecules that effuse through a small hole', 'C. Ratio of effusion rates of hydrogen and oxygen (same $T$, $P$)', 'D. Ratio of effusion rates of two gases whose molar masses are in the ratio $1:9$ (lighter : heavier)'],
    list2: [xr`p. $\tfrac32kT$`, xr`q. $2kT$`, 'r. 4', 's. 3', xr`t. $kT$`] },
  xm7: { title: 'Nitrogen at 300 K ($M = 0.028$ kg/mol, $R = 8.31$)', list1: ['A. $v_{rms}$', 'B. $v_{mean}$', 'C. $v_{mp}$', 'D. Mean translational kinetic energy of a molecule'],
    list2: [xr`p. $422\ \mathrm{m\,s^{-1}}$`, xr`q. $476\ \mathrm{m\,s^{-1}}$`, xr`r. $517\ \mathrm{m\,s^{-1}}$`, xr`s. $6.21\times10^{-21}$ J`, xr`t. $1.24\times10^{-20}$ J`] },
  xm8: { title: 'A gas taken along a straight line on the P-V graph', list1: ['A. Volume at which the temperature is highest', 'B. Pressure at that volume', 'C. Highest temperature', 'D. Number of moles'],
    list2: ['p. 5 L', xr`q. $5\times10^5$ Pa`, 'r. 301 K', 's. 1 mol', 't. 10 L'] },
  xp1: { title: 'A cylinder of helium brought to rest',
    passage: xr`<p>A sealed, insulated cylinder holds 2 mol of helium ($M = 4\ \mathrm{g\,mol^{-1}}$) and moves at $50\ \mathrm{m\,s^{-1}}$. It is suddenly stopped. Assume all the kinetic energy of the gas's bulk motion becomes random thermal energy of the gas, and ignore the heat capacity of the cylinder. $R = 8.31$.</p>` },
  xp2: { title: 'Argon in a flask',
    passage: xr`<p>One mole of argon ($M = 0.040\ \mathrm{kg\,mol^{-1}}$, molecular diameter $3.6\times10^{-10}$ m) is held at 300 K in a 25 L flask. Take $R = 8.31$ and $k = 1.38\times10^{-23}\ \mathrm{J\,K^{-1}}$.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xq(2, 'temperature', xr`Hydrogen, helium and oxygen are at the same temperature. Which has the greatest average translational kinetic energy per molecule?`, 'All three have the same', ['Hydrogen, because it is lightest', 'Helium, because it is monatomic', 'Oxygen, because its molecules are heaviest'],
    xr`Average translational kinetic energy per molecule is $\tfrac32kT$, which depends only on the temperature. The lighter gases move faster, but each molecule has the same average kinetic energy.`,
    { trap: 'Mixing up speed (depends on mass) with kinetic energy (does not).' }),
  xn(2, 'kinetic energy of molecules', xr`At what temperature, in $^\circ$C, is the average translational kinetic energy of molecules double its value at $27\,^\circ$C?`, 327, 0, () => 2 * 300 - 273,
    xr`Average energy $\propto T$ in kelvin. $27\,^\circ\mathrm{C} = 300$ K. Double energy means $T = 600$ K, which is $600 - 273 = 327\,^\circ$C.`,
    { trap: 'Doubling 27 gives 54 °C, but the law uses kelvin.' }),
  xn(2, 'molar volume', xr`Find the mass, in g, of 11.2 L of oxygen ($M = 32\ \mathrm{g\,mol^{-1}}$) at STP (22.4 L per mole).`, 16, 0, () => 11.2 / 22.4 * 32,
    xr`Moles $= 11.2/22.4 = 0.5$. Mass $= 0.5\times32 = 16$ g.`),
  xq(2, 'pressure of a gas', xr`The rms speed of the molecules of a gas is doubled while the density stays the same. By what factor does the pressure change? (Use $P = \tfrac13\rho v_{rms}^2$.)`, '4 times', ['2 times', xr`$\sqrt2$ times`, '8 times'],
    xr`$P\propto v_{rms}^2$ at fixed density, so doubling the speed multiplies the pressure by $2^2 = 4$.`),
  xn(2, 'rms speed', xr`Find the ratio $v_{rms}$(helium, $M = 4$) / $v_{rms}$(neon, $M = 20$) at the same temperature (2 decimals).`, 2.24, 0.01, () => Math.sqrt(20 / 4),
    xr`$v_{rms}\propto1/\sqrt M$, so the ratio is $\sqrt{20/4} = \sqrt5 = 2.24$.`),
  xq(2, 'degrees of freedom', xr`A rigid non-linear triatomic molecule such as water vapour has how many degrees of freedom (translation plus rotation, vibration frozen)?`, '6', ['3', '5', '7'],
    xr`It can move in 3 independent directions (3 translational) and rotate about 3 axes (3 rotational): $3 + 3 = 6$. A linear molecule has only 2 rotational ones.`),

  // ---------- Level 3 ----------
  xn(3, 'Boltzmann constant', xr`At what temperature does $kT$ equal 1 eV ($1.6\times10^{-19}$ J)? Give the answer in units of $10^4$ K (2 decimals). $k = 1.38\times10^{-23}\ \mathrm{J\,K^{-1}}$.`, 1.16, 0.01, () => 1.6e-19 / 1.38e-23 / 1e4,
    xr`$T = \dfrac{1.6\times10^{-19}}{1.38\times10^{-23}} = 1.16\times10^4$ K. (At room temperature $kT$ is only about $\tfrac1{40}$ eV.)`),
  xn(3, 'gas in a cylinder', xr`A vertical cylinder of cross-section $50\ \mathrm{cm^2}$ has a smooth piston of mass 10 kg trapping 0.2 mol of an ideal gas at 300 K. The air above is at $1.0\times10^5$ Pa. Taking $g = 10\ \mathrm{m\,s^{-2}}$ and $R = 8.31$, find the height of the gas column in m (2 decimals).`, 0.83, 0.01,
    () => 0.2 * 8.31 * 300 / (1e5 + 10 * 10 / 50e-4) / 50e-4,
    xr`Gas pressure $= P_0 + mg/A = 1.0\times10^5 + \dfrac{100}{5\times10^{-3}} = 1.2\times10^5$ Pa. $V = nRT/P = \dfrac{0.2\times8.31\times300}{1.2\times10^5} = 4.155\times10^{-3}\ \mathrm{m^3}$. Height $= V/A = 4.155\times10^{-3}/5\times10^{-3} = 0.83$ m.`,
    { trap: 'Using atmospheric pressure alone, which ignores the piston weight.' }),
  xn(3, 'specific heats of gases', xr`At very high temperature the vibrational modes of a diatomic gas are fully active. Find $\gamma = C_p/C_v$ (2 decimals).`, 1.29, 0.01, () => 1 + 2 / 7,
    xr`Translation 3, rotation 2, vibration 2 (kinetic and potential): $f = 7$. $\gamma = 1 + 2/f = 9/7 = 1.29$.`),
  xn(3, 'speed of sound', xr`The speed of sound in an ideal gas is $v = \sqrt{\gamma P/\rho}$ and $v_{rms} = \sqrt{3P/\rho}$. For a rigid diatomic gas find $v/v_{rms}$ (2 decimals).`, 0.68, 0.01, () => Math.sqrt((7 / 5) / 3),
    xr`$\dfrac{v}{v_{rms}} = \sqrt{\dfrac{\gamma}{3}} = \sqrt{\dfrac{7/5}{3}} = \sqrt{\dfrac{7}{15}} = 0.68$. Sound is always slower than the molecules.`),
  xn(3, 'gas laws', xr`A cylinder of volume 40 L holds a gas at 16 atm. Balloons of 2 L each, filled at 1 atm, are made from it at constant temperature until the cylinder pressure falls to 1 atm. How many balloons can be filled?`, 300, 0, () => (16 * 40 - 1 * 40) / 2,
    xr`Total gas expressed at 1 atm: $16\times40 = 640$ L. The cylinder keeps $1\times40 = 40$ L. The rest, $600$ L, goes into balloons: $600/2 = 300$.`,
    { trap: 'Dividing 640 by 2 gives 320, forgetting the gas left in the cylinder.' }),
  xn(3, 'gas mixtures', xr`Equal masses of hydrogen ($M = 2$) and helium ($M = 4$) are mixed in one vessel. Find the ratio (number of hydrogen molecules) / (number of helium atoms).`, 2, 0, () => (1 / 2) / (1 / 4),
    xr`For mass $m$ each: $n_{H_2} = m/2$ and $n_{He} = m/4$. The ratio is $(m/2)/(m/4) = 2$. Their partial pressures are in the same ratio.`),
  xn(3, 'rms speed', xr`At 300 K the rms speed of oxygen ($M = 32$) is the same as that of nitrogen ($M = 28$) at what temperature, in K (1 decimal)?`, 262.5, 0.5, () => 300 * 28 / 32,
    xr`$v_{rms}\propto\sqrt{T/M}$, so $T/M$ is the same: $T_{N_2} = 300\times\dfrac{28}{32} = 262.5$ K.`),
  xn(3, 'degrees of freedom', xr`A gas has $\gamma = 4/3$. How many degrees of freedom does each molecule have?`, 6, 0, () => 2 / (4 / 3 - 1),
    xr`$\gamma = 1 + 2/f$, so $2/f = 1/3$ and $f = 6$ (such as a rigid non-linear triatomic molecule).`),
  xn(3, 'degrees of freedom', xr`A vessel holds 1 mol of helium and 3 mol of nitrogen (rigid diatomic) at the same temperature $T$. The total internal energy is $xRT$. Find $x$ (1 decimal).`, 9, 0, () => 1 * 1.5 + 3 * 2.5,
    xr`$U = \tfrac32RT\times1 + \tfrac52RT\times3 = (1.5 + 7.5)RT = 9RT$, so $x = 9$.`),
  xn(3, 'pressure of a gas', xr`A gas of density $2.4\ \mathrm{kg\,m^{-3}}$ is at a pressure of $2.0\times10^5$ Pa. Find the rms speed of its molecules, in $\mathrm{m\,s^{-1}}$.`, 500, 0, () => Math.sqrt(3 * 2e5 / 2.4),
    xr`$P = \tfrac13\rho v_{rms}^2$, so $v_{rms} = \sqrt{3P/\rho} = \sqrt{6\times10^5/2.4} = \sqrt{2.5\times10^5} = 500\ \mathrm{m\,s^{-1}}$.`),
  xn(3, 'internal energy of a gas', xr`A cubic metre of nitrogen (rigid diatomic) is at $1.0\times10^5$ Pa. Find its internal energy in units of $10^5$ J (1 decimal).`, 2.5, 0, () => 2.5 * 1e5 / 1e5,
    xr`$U = \tfrac f2nRT = \tfrac f2PV = \tfrac52\times10^5\times1 = 2.5\times10^5$ J (answer 2.5).`),
  xq(3, 'graphs of gas laws', xr`For a fixed mass of an ideal gas at constant temperature, which graph is a straight line through the origin?`, '$P$ against $1/V$', ['$P$ against $V$', '$PV$ against $P$', '$V$ against $1/T$'],
    xr`Boyle's law: $P = (\text{const})\times1/V$. So $P$ against $1/V$ is a straight line through the origin, whereas $P$ against $V$ is a hyperbola and $PV$ against $P$ is a horizontal line.`),
  xa(3, 'kinetic energy of molecules', xr`When the Kelvin temperature of a gas is doubled, the average translational kinetic energy of its molecules doubles, but the rms speed does not.`, xr`Average kinetic energy is proportional to $T$, while the rms speed is proportional to $\sqrt T$.`, 0,
    xr`Both are true and R explains A. The rms speed increases by $\sqrt2 = 1.41$, not 2.`),
  xa(3, 'specific heats of gases', xr`The molar specific heat of a gas at constant pressure is greater than at constant volume.`, xr`At constant pressure the gas expands and does work against the surroundings, so more heat is needed for the same temperature rise.`, 0,
    xr`Both are true and R explains A. $C_p - C_v = R$ for an ideal gas.`),
  xm(3, 'speeds of molecules', 'xm1', xr`Match each ratio in List I with its value in List II.`, { A: 'r', B: 'q', C: 'p', D: 's' },
    xr`$v_{rms} = \sqrt{3RT/M}$, $v_{mean} = \sqrt{8RT/\pi M}$, $v_{mp} = \sqrt{2RT/M}$. A: $\sqrt{3/2} = 1.225$ (r). B: $\sqrt{4/\pi} = 1.128$ (q). C: $\sqrt{3\pi/8} = 1.085$ (p). D: $\sqrt{32/2} = 4$ (s).`),
  xm(3, 'specific heats of gases', 'xm2', xr`Match the gas in List I with its $\gamma = C_p/C_v$.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`$\gamma = 1 + 2/f$. A: $f=3$, $\gamma = 5/3$ (p). B: $f=5$, $7/5$ (q). C: $f=6$, $4/3$ (r). D: $f=7$, $9/7$ (s).`),

  // ---------- Level 4 ----------
  xn(4, 'bulk and thermal motion', xr`A sealed, insulated container of helium ($M = 4\ \mathrm{g\,mol^{-1}}$) moving at $100\ \mathrm{m\,s^{-1}}$ is suddenly stopped and all the bulk kinetic energy of the gas appears as thermal energy. Find the rise in temperature, in K (2 decimals). $R = 8.31$.`, 1.6, 0.01, () => 0.004 * 100 * 100 / (3 * 8.31),
    xr`Per mole: bulk KE $= \tfrac12Mv^2 = \tfrac12(0.004)(10^4) = 20$ J. Thermal energy: $\tfrac32R\,\Delta T$. So $\Delta T = \dfrac{Mv^2}{3R} = \dfrac{0.004\times10^4}{3\times8.31} = 1.60$ K.`,
    { trap: 'Using 5/2 R (diatomic) for a monatomic gas, or forgetting that the energy is shared by all the molecules.' }),
  xn(4, 'P-V graph', xr`One mole of an ideal gas is taken along the straight line $P = 10^6 - 10^8V$ (SI units, $V$ in $\mathrm{m^3}$) from $V = 2\times10^{-3}\ \mathrm{m^3}$ to $V = 8\times10^{-3}\ \mathrm{m^3}$. Find the highest temperature reached, in K (1 decimal). $R = 8.31$.`, 300.8, 0.2,
    () => { let best = 0; for (let V = 2e-3; V <= 8e-3; V += 1e-6) best = Math.max(best, (1e6 - 1e8 * V) * V / 8.31); return best; },
    xr`$T = PV/(nR) = \dfrac{(10^6 - 10^8V)V}{R}$. The product $PV$ is largest when $\dfrac{d}{dV}(10^6V - 10^8V^2) = 0$: $V = 5\times10^{-3}\ \mathrm{m^3}$, giving $P = 5\times10^5$ Pa. $T_{max} = \dfrac{5\times10^5\times5\times10^{-3}}{8.31} = \dfrac{2500}{8.31} = 300.8$ K. (This lies between the end points.)`,
    { trap: 'Taking the temperature at the end points; on a straight line with negative slope the temperature rises and then falls.' }),
  xn(4, 'mixing gases', xr`1 mol of helium at 300 K and 1 mol of nitrogen (rigid diatomic) at 400 K are mixed in an insulated rigid vessel. Find the final temperature, in K (1 decimal).`, 362.5, 0.2, () => (1 * 3 * 300 + 1 * 5 * 400) / (3 + 5),
    xr`No energy is lost, so $U_1 + U_2 = U_{final}$: $\tfrac32R(300) + \tfrac52R(400) = (\tfrac32 + \tfrac52)RT$. $T = \dfrac{450 + 1000}{4} = 362.5$ K.`,
    { trap: 'Averaging 300 and 400 gives 350 K, which ignores that nitrogen stores more energy per kelvin.' }),
  xn(4, 'degrees of freedom', xr`A diatomic gas has $\gamma = 1.25$ at a very high temperature when many modes are active. How many degrees of freedom $f$ does it effectively have?`, 8, 0, () => 2 / (1.25 - 1),
    xr`$\gamma = 1 + 2/f$ gives $2/f = 0.25$, so $f = 8$.`),
  xn(4, 'real gases', xr`For a van der Waals gas, find the ratio $P_cV_c/(RT_c)$ (3 decimals), where $P_c = \dfrac{a}{27b^2}$, $V_c = 3b$ and $T_c = \dfrac{8a}{27Rb}$.`, 0.375, 0.001, () => (1 / 27) * 3 / (8 / 27),
    xr`$\dfrac{P_cV_c}{RT_c} = \dfrac{\dfrac{a}{27b^2}\cdot3b}{R\cdot\dfrac{8a}{27Rb}} = \dfrac{3a/(27b)}{8a/(27b)} = \dfrac38 = 0.375$. For an ideal gas it would be 1.`),
  xn(4, 'balloon', xr`A hot-air balloon of volume $500\ \mathrm{m^3}$ is filled with air at 360 K. The outside air is at 300 K with density $1.16\ \mathrm{kg\,m^{-3}}$ at the same pressure. Find the maximum mass, in kg, of the balloon fabric and load that it can lift (1 decimal).`, 96.7, 0.2, () => 1.16 * 500 * (1 - 300 / 360),
    xr`At equal pressure, density $\propto1/T$: inside, $\rho_i = 1.16\times300/360 = 0.967\ \mathrm{kg\,m^{-3}}$. Mass of displaced cold air $= 1.16\times500 = 580$ kg; mass of hot air $= 483.3$ kg. Maximum load $= 580 - 483.3 = 96.7$ kg.`),
  xq(4, 'effusion', xr`Molecules escape through a very small hole into a vacuum. Compared with the mean translational kinetic energy $\tfrac32kT$ of the gas inside, the mean kinetic energy of the escaping molecules is`, xr`$2kT$, larger`, [xr`$\tfrac32kT$, the same`, xr`$kT$, smaller`, xr`$3kT$, larger`],
    xr`Faster molecules strike the hole more often and so escape more often (the flux is proportional to $v\,f(v)$). The mean energy of the escaping molecules works out to $2kT$. This is why the remaining gas cools.`),
  xq(4, 'free expansion', xr`An ideal gas expands from one half of an insulated rigid container into the vacuum in the other half after a partition is removed. Its temperature`, 'does not change', ['falls, because the gas does work', 'rises, because the molecules collide with more walls', 'falls to half its initial value'],
    xr`No external pressure acts, so the gas does no work, and the container is insulated, so there is no heat flow. $\Delta U = 0$. For an ideal gas $U$ depends only on $T$, so $T$ is unchanged and the pressure halves.`),
  xs(4, 'Maxwell distribution', xr`The Maxwell speed distribution curves are drawn for helium and oxygen at the same temperature. Which are correct?`,
    ['The helium curve peaks at a larger speed', 'The areas under the two curves are equal', 'The helium curve is broader', 'The oxygen curve has the higher peak', 'The helium curve lies above the oxygen curve at all speeds'], [0, 1, 2, 3],
    xr`$v_{mp}\propto1/\sqrt M$, so helium peaks at the larger speed. Each curve is normalised (total probability 1), so the areas are equal. A peak at higher speed with the same area makes the helium curve broader and lower, and the oxygen curve narrower and taller. At low speeds the oxygen curve is below the helium curve, so helium is not above at all speeds.`),
  xs(4, 'equipartition of energy', xr`A diatomic gas at a very high temperature has all its vibrational modes active. Which are correct?`,
    [xr`$C_v = \tfrac72R$`, xr`$\gamma = 9/7$`, xr`The internal energy of $n$ moles is $\tfrac72nRT$`, xr`$\gamma = 7/5$`, xr`The mean translational kinetic energy per molecule is still $\tfrac32kT$`], [0, 1, 2, 4],
    xr`Active modes: 3 translational, 2 rotational, 2 vibrational (each vibration counts as 2: kinetic plus potential): $f = 7$. $C_v = \tfrac72R$, $\gamma = 1 + 2/7 = 9/7$, $U = \tfrac72nRT$. $7/5$ is the low-temperature value. Translational energy is $\tfrac32kT$ at all temperatures.`),
  xs(4, 'P-V graph', xr`An ideal gas is taken along the straight line $P = aV$ (through the origin) from $V_0$ to $2V_0$. Which are correct?`,
    ['The temperature rises to 4 times its initial value', 'The pressure doubles', 'The process is isothermal', 'The internal energy increases', xr`$T\propto V^2$ along the process`], [0, 1, 3, 4],
    xr`$PV = nRT$ with $P = aV$ gives $T = aV^2/(nR)\propto V^2$ (true). Doubling $V$ quadruples $T$ (true) and doubles $P$ (true). It is certainly not isothermal (false). $U\propto T$ increases (true).`),
  xs(4, 'kinetic theory derivation', xr`In deriving $P = \tfrac13(N/V)m\overline{v^2}$ for molecules in a cube of side $L$, which steps are correct?`,
    [xr`A molecule hitting a wall perpendicularly changes its momentum by $2mv_x$`, xr`It hits the same wall $v_x/2L$ times per second`, xr`The average force from one molecule is $mv_x^2/L$`, xr`$\overline{v_x^2} = \tfrac13\overline{v^2}$ because motion is random in all directions`, xr`The result would be $P = \tfrac13(N/V)mv$ if collisions between molecules were included`], [0, 1, 2, 3],
    xr`Each hit reverses $v_x$, so $\Delta p = 2mv_x$ (true). The time between hits on one wall is $2L/v_x$ (true). Force $= 2mv_x\times v_x/2L = mv_x^2/L$ (true). By isotropy $\overline{v_x^2} = \overline{v^2}/3$ (true). Collisions between molecules do not change the total momentum transfer on average, so the result is unchanged and it involves $\overline{v^2}$, not $v$ (false).`),
  xs(4, 'free expansion', xr`An ideal gas at pressure $P$ and temperature $T$ occupies one of two identical, insulated, rigid vessels joined by a closed tap; the other is empty. The tap is opened. Which are correct?`,
    ['The final temperature is $T$', 'The final pressure is $P/2$', 'The gas does no work', 'The internal energy is unchanged', 'The rms speed of the molecules decreases'], [0, 1, 2, 3],
    xr`No work, no heat: $\Delta U = 0$, so $T$ is unchanged (true) and the rms speed is unchanged (false). The volume doubles at constant $T$: $P\to P/2$ (true).`),
  xm(4, 'effect of heating', 'xm3', xr`A fixed mass of ideal gas in a rigid vessel is heated so that its absolute temperature doubles. Match the quantities in List I with the factor by which they change.`, { A: 'q', B: 'r', C: 'p', D: 's' },
    xr`A: $v_{rms}\propto\sqrt T$, factor $\sqrt2$ (q). B: at fixed $V$, $P\propto T$, factor 2 (r). C: $\lambda = 1/(\sqrt2\pi d^2n)$ with $n$ fixed, factor 1 (p). D: collision frequency $\propto v$, so the time between collisions changes by $1/\sqrt2$ (s).`),
  xm(4, 'effect of heating', 'xm4', xr`A fixed mass of ideal gas at constant pressure is heated until its absolute temperature is four times larger. Match the quantities in List I with the factors in List II.`, { A: 'r', B: 'p', C: 's', D: 'q' },
    xr`A: $v_{rms}\propto\sqrt T$, factor 2 (r). B: $n = P/kT$, factor $1/4$ (p). C: $\lambda\propto1/n$, factor 4 (s). D: collisions per second $\propto n\bar v\propto\tfrac14\times2 = \tfrac12$ (q).`),
  xm(4, 'real gases', 'xm5', xr`Match the quantities of a van der Waals gas in List I with their expressions in List II.`, { A: 'r', B: 'p', C: 'q', D: 's' },
    xr`$T_c = \dfrac{8a}{27Rb}$ (r), $P_c = \dfrac{a}{27b^2}$ (p), $V_c = 3b$ (q), and $P_cV_c/RT_c = 3/8$ (s). The $b$ alone is the excluded volume per mole, not a critical quantity.`),
  xm(4, 'speeds of molecules', 'xm7', xr`Match each quantity for nitrogen at 300 K in List I with its value in List II.`, { A: 'r', B: 'q', C: 'p', D: 's' },
    xr`$v_{rms} = \sqrt{3RT/M} = 517$ (r). $v_{mean} = \sqrt{8RT/\pi M} = 476$ (q). $v_{mp} = \sqrt{2RT/M} = 422$ (p). Mean translational KE $= \tfrac32kT = 6.21\times10^{-21}$ J (s). The $1.24\times10^{-20}$ J is $3kT$.`),
  xm(4, 'P-V graph', 'xm8', xr`One mole of gas follows $P = 10^6 - 10^8V$ (SI units). Match the quantities.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`$PV$ is maximum at $V = 5\times10^{-3}\ \mathrm{m^3} = 5$ L (p), where $P = 5\times10^5$ Pa (q) and $T = 2500/8.31 = 301$ K (r). The number of moles is given: 1 (s).`),
  xa(4, 'temperature', xr`The temperature of a gas in a closed box does not change when the box is carried at a steady speed in a lorry.`, xr`Temperature is a measure of the random motion of the molecules relative to the box, not of the bulk motion of the box.`, 0,
    xr`Both are true and R explains A. The bulk velocity adds the same vector to every molecule's velocity but does not change the random motion measured relative to the box (and so not $T$). Only if the box were stopped suddenly would that bulk energy become thermal.`),
  xa(4, 'effusion', xr`When a gas leaks slowly through a tiny hole into a vacuum, the gas that remains cools down.`, xr`Faster molecules strike the hole more often and escape, so the mean kinetic energy of the molecules left behind falls.`, 0,
    xr`Both are true and R explains A. Escaping molecules carry $2kT$ each on average, more than the $\tfrac32kT$ average inside, so the remaining gas loses energy faster than it loses molecules.`),
  xt(4, 'speed of sound', xr`The speed of sound in a gas is greater than the rms speed of its molecules.`, xr`The speed of sound in a gas is $v = \sqrt{\gamma/3}\,v_{rms}$.`, 3,
    xr`Statement II is true: $v = \sqrt{\gamma P/\rho}$ and $v_{rms} = \sqrt{3P/\rho}$. Since $\gamma < 3$ for every gas, $v < v_{rms}$, so Statement I is false.`),
  xt(4, 'internal energy of a gas', xr`One mole of hydrogen and one mole of helium at the same temperature have the same internal energy.`, xr`Their molecules have the same average translational kinetic energy.`, 3,
    xr`II is true ($\tfrac32kT$). But hydrogen (rigid diatomic) also stores rotational energy: $U_{H_2} = \tfrac52RT$ against $\tfrac32RT$ for helium. So I is false.`),
  xt(4, 'effusion', xr`The rate of effusion of a gas through a small hole is proportional to its pressure.`, xr`The rate of effusion is proportional to $n\bar v\propto P/\sqrt{MT}$.`, 0,
    xr`Both are true and II explains I. At fixed $T$ and $M$, effusion rate $\propto P$.`),


  // ---------- more multi-correct, level 5 ----------
  xs(5, 'effusion', xr`A gas leaks slowly through a tiny hole in a rigid insulated vessel into a vacuum. Which are correct?`,
    [xr`The rate of effusion is proportional to $1/\sqrt M$ at a given temperature`, 'A light gas leaks out faster than a heavy gas at the same pressure and temperature', xr`The molecules that escape carry a mean kinetic energy of $2kT$`, 'The gas left behind cools down', 'The gas leaves as a bulk flow at the rms speed'], [0, 1, 2, 3],
    xr`Effusion flux $=\tfrac14n\bar v\propto P/\sqrt{MT}$ (true, true). Fast molecules escape preferentially, each taking $2kT$ on average, more than the $\tfrac32kT$ average of the gas (true), so the remainder cools (true). In effusion (hole much smaller than the mean free path) there is no bulk flow: molecules leave one by one (false).`),
  xs(5, 'real gases', xr`For a van der Waals gas $\left(P + \dfrac{an^2}{V^2}\right)(V - nb) = nRT$, which are correct?`,
    ['The constant $a$ allows for attraction between molecules', 'The constant $b$ is about four times the actual volume of the molecules in one mole', 'At moderate pressures the real gas exerts less pressure than an ideal gas at the same $n$, $V$, $T$', 'At very high pressure $PV/nRT$ is greater than 1', xr`The constant $b$ has the unit $\mathrm{Pa\,m^6\,mol^{-2}}$`], [0, 1, 2, 3],
    xr`The $a$ term corrects for attraction, which lowers the pressure on the walls (true, true). $b$ is the excluded volume, about 4 times the molecular volume per mole (true). At very high pressure the volume term $V - nb$ dominates, so $PV > nRT$ (true). The unit $\mathrm{Pa\,m^6\,mol^{-2}}$ belongs to $a$; $b$ has $\mathrm{m^3\,mol^{-1}}$ (false).`),
  xs(5, 'gas mixtures', xr`A vessel holds 1 mol of helium and 3 mol of nitrogen at 300 K. Which are correct?`,
    ['The partial pressure of helium is one quarter of the total pressure', 'The average translational kinetic energy of a helium atom equals that of a nitrogen molecule', xr`The rms speed of helium atoms is $\sqrt7$ times that of nitrogen molecules`, xr`The total internal energy is $9RT$`, 'Helium contributes half of the pressure'], [0, 1, 2, 3],
    xr`Partial pressures go as mole fractions: He $= \tfrac14$ (true; the last option is false). Both have $\tfrac32kT$ (true). $v_{rms}\propto1/\sqrt M$: $\sqrt{28/4} = \sqrt7$ (true). $U = \tfrac32RT + 3\times\tfrac52RT = 9RT$ (true).`),
  xs(5, 'constant-pressure heating', xr`A fixed mass of ideal gas is heated slowly at constant pressure. Which are correct?`,
    ['The number density of the molecules decreases', 'The mean free path increases', xr`The number of collisions per second of one molecule decreases (it varies as $1/\sqrt T$)`, 'The rms speed increases', 'The number of collisions per second of one molecule increases'], [0, 1, 2, 3],
    xr`At constant $P$, $n = P/kT$ falls (true) and $\lambda\propto1/n$ rises (true). Collision frequency $\propto n\bar v\propto T^{-1}\cdot T^{1/2} = T^{-1/2}$, so it decreases (true, last false). $v_{rms}\propto\sqrt T$ rises (true).`),

  // ---------- level 5 numeric ----------
  xn(5, 'real gases', xr`For nitrogen, the van der Waals constants are $a = 0.137\ \mathrm{Pa\,m^6\,mol^{-2}}$ and $b = 3.87\times10^{-5}\ \mathrm{m^3\,mol^{-1}}$. Find its critical temperature $T_c = \dfrac{8a}{27Rb}$ in K (1 decimal). $R = 8.31$.`, 126.2, 0.3, () => 8 * 0.137 / (27 * 8.31 * 3.87e-5),
    xr`$T_c = \dfrac{8\times0.137}{27\times8.31\times3.87\times10^{-5}} = \dfrac{1.096}{8.683\times10^{-3}} = 126.2$ K. Above this temperature nitrogen cannot be liquefied by pressure alone.`),
  xn(5, 'escape of gases', xr`A planet keeps a gas only if the rms speed of its molecules is less than one sixth of the escape speed. The escape speed from Earth is $11.2\ \mathrm{km\,s^{-1}}$. Find the highest temperature, in K (nearest whole number), at which helium ($M = 4\ \mathrm{g\,mol^{-1}}$) would be retained. $R = 8.31$.`, 559, 1, () => 0.004 * (11200 / 6) ** 2 / (3 * 8.31),
    xr`Need $v_{rms} = \sqrt{3RT/M}\le v_{esc}/6 = 1867\ \mathrm{m\,s^{-1}}$. $T\le\dfrac{M(v_{esc}/6)^2}{3R} = \dfrac{0.004\times3.484\times10^6}{24.93} = 559$ K.`,
    { trap: 'Using the full escape speed gives T about 20 000 K, which ignores the high-speed tail of the Maxwell distribution.' }),
  xn(5, 'molecular flux', xr`Nitrogen ($M = 0.028\ \mathrm{kg\,mol^{-1}}$) is at $1.013\times10^5$ Pa and 300 K. The number of molecules striking a unit area of wall per second is $\tfrac14n\bar v$. Find it in units of $10^{27}\ \mathrm{m^{-2}s^{-1}}$ (2 decimals). Take $R = 8.31$, $k = 1.38\times10^{-23}$.`, 2.91, 0.02,
    () => 0.25 * (1.013e5 / (1.38e-23 * 300)) * Math.sqrt(8 * 8.31 * 300 / (Math.PI * 0.028)) / 1e27,
    xr`$n = P/kT = \dfrac{1.013\times10^5}{1.38\times10^{-23}\times300} = 2.447\times10^{25}\ \mathrm{m^{-3}}$. $\bar v = \sqrt{8RT/\pi M} = 476\ \mathrm{m\,s^{-1}}$. Flux $= \tfrac14\times2.447\times10^{25}\times476 = 2.91\times10^{27}\ \mathrm{m^{-2}s^{-1}}$.`,
    { trap: 'Leaving out the factor 1/4: only about a quarter of n v̄ hits a given wall (a molecule moves in all directions).' }),
  xn(5, 'gas spring', xr`A piston of mass 1 kg closes a vertical cylinder of cross-section $100\ \mathrm{cm^2}$ trapping air ($\gamma = 1.4$) at $1.0\times10^5$ Pa in a column 20 cm high. The piston is pressed slightly and released; the air compresses adiabatically. Find the period of the small oscillations in ms (1 decimal). (Ignore the piston's weight change in the pressure.)`, 75.1, 0.5,
    () => 2 * Math.PI * Math.sqrt(1 * 0.2 / (1.4 * 1e5 * 0.01)) * 1000,
    xr`For an adiabatic change $PV^\gamma$ is constant, so $\Delta P = -\gamma P\,\Delta V/V = -\gamma P x/h$ for a displacement $x$. The restoring force is $A\Delta P = -\dfrac{\gamma PA}{h}x$, so $k = \dfrac{1.4\times10^5\times10^{-2}}{0.2} = 7000\ \mathrm{N\,m^{-1}}$. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{1/7000} = 0.0751$ s $= 75.1$ ms.`),
  xn(5, 'molar heat capacity of a process', xr`A rigid diatomic ideal gas is taken along a process with $P\propto V$. Find its molar heat capacity along this process in units of $R$.`, 3, 0, () => 2.5 + 0.5,
    xr`Heat $dQ = dU + P\,dV$. With $P = aV$: $P\,dV = aV\,dV = \tfrac12\,d(aV^2) = \tfrac12\,d(PV) = \tfrac12R\,dT$ per mole. $C = C_v + \tfrac R2 = \tfrac52R + \tfrac12R = 3R$.`),
  xb(5, 'statements', { type: 'mcq', format: 'statements', q: xr`How many of these are correct?<br>(a) $v_{rms} > v_{mean} > v_{mp}$ for a gas.<br>(b) The pressure of an ideal gas depends on the size of its molecules.<br>(c) At the same temperature all ideal-gas molecules have the same average translational kinetic energy.<br>(d) A real gas at its Boyle temperature behaves ideally over a wide range of low pressures.<br>(e) The mean free path of a gas at fixed temperature increases as the pressure increases.`,
    options: ['2', '3', '4', '5'], answer: 1,
    sol: xr`(a) true. (b) false: ideal gas molecules are points, and $P = nkT$ does not depend on size. (c) true: $\tfrac32kT$. (d) true: at the Boyle temperature $a$ and $b$ effects cancel at low pressure. (e) false: $\lambda\propto1/P$ at fixed $T$. Three are correct.` }),
  xn(3, 'connected vessels', xr`Two identical vessels are joined by a tube so the pressure is the same in both. One is held at $T$ and the other at $2T$. Find the ratio (moles in the cooler vessel) / (moles in the hotter vessel).`, 2, 0, () => 2 * 1 / 1,
    xr`$n = PV/RT$ with the same $P$ and $V$: $n\propto1/T$. The cooler vessel holds twice as many moles.`),

  xs(4, 'isothermal compression', xr`An ideal gas is compressed isothermally to half its volume. Which are correct?`,
    ['The rms speed of the molecules is unchanged', 'The mean free path is halved', 'The number of collisions per second made by one molecule is doubled', 'The pressure is doubled', 'The internal energy decreases'], [0, 1, 2, 3],
    xr`$T$ is constant, so $v_{rms}$ and $U$ are unchanged (true; the last is false). $n$ doubles, so $\lambda\propto1/n$ halves (true) and the collision frequency $\propto n\bar v$ doubles (true). $P\propto n$ doubles (true).`),
  xm(5, 'effusion', 'xm6', xr`Match the items in List I with the values in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`A: $\tfrac32kT$ (p). B: molecules that effuse carry $2kT$ on average (q). C: rates go as $1/\sqrt M$: $\sqrt{32/2} = 4$ (r). D: $\sqrt{9} = 3$ (s). The $kT$ is not any of these.`),

  // ---------- passages ----------
  xn(3, 'bulk and thermal motion', xr`Find the kinetic energy of the bulk motion of the gas, in J.`, 10, 0, () => 0.5 * 2 * 0.004 * 50 * 50,
    xr`Mass $= 2\times0.004 = 0.008$ kg. KE $= \tfrac12mv^2 = \tfrac12\times0.008\times2500 = 10$ J.`, { format: 'passage', group: 'xp1' }),
  xn(4, 'bulk and thermal motion', xr`Find the rise in the temperature of the gas, in K (2 decimals).`, 0.4, 0.01, () => 10 / (2 * 1.5 * 8.31),
    xr`$\Delta U = n\cdot\tfrac32R\,\Delta T = 10$ J. $\Delta T = \dfrac{10}{2\times1.5\times8.31} = 0.40$ K.`, { format: 'passage', group: 'xp1' }),
  xq(5, 'bulk and thermal motion', xr`The helium is replaced by 2 mol of nitrogen ($M = 28\ \mathrm{g\,mol^{-1}}$, rigid diatomic) moving at the same $50\ \mathrm{m\,s^{-1}}$. The temperature rise is, compared with the helium case,`, 'about 4.2 times as large', ['about 7 times as large', 'about the same', 'about 0.24 times as large'],
    xr`Bulk KE of 2 mol of $N_2 = \tfrac12\times0.056\times2500 = 70$ J. $\Delta T = 70/(2\times\tfrac52\times8.31) = 1.68$ K, against 0.40 K for helium: a ratio of 4.2. Equivalent: ratio $= \dfrac{M_2}{M_1}\cdot\dfrac{f_1}{f_2} = 7\times\dfrac35 = 4.2$. The factor 7 alone ignores the extra degrees of freedom.`,
    { format: 'passage', group: 'xp1', trap: 'Saying 7: the heavier mass gives 7 times the energy, but nitrogen needs more energy per kelvin.' }),
  xn(3, 'ideal gas equation', xr`Find the pressure of the argon, in kPa (1 decimal).`, 99.7, 0.1, () => 8.31 * 300 / 0.025 / 1000,
    xr`$P = nRT/V = \dfrac{1\times8.31\times300}{25\times10^{-3}} = 9.97\times10^4$ Pa $= 99.7$ kPa.`, { format: 'passage', group: 'xp2' }),
  xn(4, 'rms speed', xr`Find the rms speed of the argon atoms, in $\mathrm{m\,s^{-1}}$ (nearest whole number).`, 432, 1, () => Math.sqrt(3 * 8.31 * 300 / 0.04),
    xr`$v_{rms} = \sqrt{3RT/M} = \sqrt{\dfrac{3\times8.31\times300}{0.040}} = \sqrt{1.87\times10^5} = 432\ \mathrm{m\,s^{-1}}$.`, { format: 'passage', group: 'xp2' }),
  xn(5, 'collision frequency', xr`Each atom makes $\sqrt2\pi d^2n\bar v$ collisions per second. Find this in units of $10^9\ \mathrm{s^{-1}}$ (2 decimals).`, 5.53, 0.05,
    () => Math.SQRT2 * Math.PI * (3.6e-10) ** 2 * (8.31 * 300 / 0.025 / (1.38e-23 * 300)) * Math.sqrt(8 * 8.31 * 300 / (Math.PI * 0.04)) / 1e9,
    xr`$n = P/kT = \dfrac{9.97\times10^4}{1.38\times10^{-23}\times300} = 2.41\times10^{25}\ \mathrm{m^{-3}}$. $\bar v = \sqrt{8RT/\pi M} = 398\ \mathrm{m\,s^{-1}}$. Collision rate $= 1.414\times3.1416\times(3.6\times10^{-10})^2\times2.41\times10^{25}\times398 = 5.5\times10^{9}\ \mathrm{s^{-1}}$.`,
    { format: 'passage', group: 'xp2' }),
];

const xgens = [
  { id: 'kt-g22', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'bulk and thermal motion',
    make(rng) {
      const [name, M] = xchoose(rng, [['helium', 4], ['neon', 20], ['argon', 40]]); const v = xchoose(rng, [50, 100, 200]);
      const answer = +(M * 1e-3 * v * v / (3 * 8.31)).toFixed(3);
      return { M, v, answer, tol: Math.max(0.01, answer * 0.01), unit: 'K',
        q: `A sealed, insulated container of ${name} (M = ${M} g/mol) moving at ${v} m/s is suddenly stopped, and all the bulk kinetic energy of the gas becomes thermal energy. Find the rise in temperature, in K. Take R = 8.31.`,
        sol: `Per mole: ½Mv² = ½×${M / 1000}×${v}² = ${xfmt(0.5 * M / 1000 * v * v, 4)} J equals (3/2)RΔT. ΔT = Mv²/(3R) = ${xfmt(M / 1000 * v * v, 4)}/${xfmt(3 * 8.31, 4)} = ${xfmt(answer, 4)} K.` };
    },
    verify: (p) => { const n = 1; const ke = 0.5 * n * p.M * 1e-3 * p.v * p.v; return ke / (n * 1.5 * 8.31); } },
  { id: 'kt-g23', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'mixing gases',
    make(rng) {
      const n1 = xchoose(rng, [1, 2, 3]), n2 = xchoose(rng, [1, 2, 3]), t1 = xchoose(rng, [250, 300, 350]), t2 = xchoose(rng, [400, 450, 500]);
      const answer = +((n1 * 3 * t1 + n2 * 5 * t2) / (3 * n1 + 5 * n2)).toFixed(2);
      return { n1, n2, t1, t2, answer, tol: 0.1, unit: 'K',
        q: `${n1} mol of helium at ${t1} K and ${n2} mol of nitrogen (rigid diatomic) at ${t2} K are mixed in an insulated rigid vessel. Find the final temperature, in K.`,
        sol: `Energy is conserved: (3/2)R·${n1}·${t1} + (5/2)R·${n2}·${t2} = ((3/2)${n1} + (5/2)${n2})R·T. T = (3×${n1}×${t1} + 5×${n2}×${t2})/(3×${n1} + 5×${n2}) = ${xfmt(answer, 5)} K.` };
    },
    verify: (p) => { const U = 1.5 * p.n1 * p.t1 + 2.5 * p.n2 * p.t2; return U / (1.5 * p.n1 + 2.5 * p.n2); } },
  { id: 'kt-g24', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'molecular flux',
    make(rng) {
      const [name, M] = xchoose(rng, [['nitrogen', 0.028], ['oxygen', 0.032], ['helium', 0.004], ['hydrogen', 0.002]]); const T = xchoose(rng, [300, 400]); const P = xchoose(rng, [1.0, 2.0]) * 1e5;
      const nn = P / (1.38e-23 * T); const vb = Math.sqrt(8 * 8.31 * T / (Math.PI * M)); const answer = +(0.25 * nn * vb / 1e27).toFixed(3);
      return { M, T, P, answer, tol: Math.max(0.02, answer * 0.01), unit: '10²⁷ m⁻² s⁻¹',
        q: `${name[0].toUpperCase() + name.slice(1)} (M = ${M} kg/mol) is at ${P / 1e5}×10⁵ Pa and ${T} K. The number of molecules hitting 1 m² of wall per second is ¼ n v̄. Find it in units of 10²⁷ m⁻² s⁻¹. Take R = 8.31 and k = 1.38×10⁻²³.`,
        sol: `n = P/kT = ${xfmt(nn, 4)} m⁻³. Mean speed v̄ = √(8RT/πM) = ${xfmt(vb, 4)} m/s. Flux = ¼ n v̄ = ${xfmt(answer, 4)} × 10²⁷ m⁻² s⁻¹.` };
    },
    verify: (p) => { const m = p.M / 6.02e23; return p.P / Math.sqrt(2 * Math.PI * m * 1.38e-23 * p.T) / 1e27; } },
  { id: 'kt-g25', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'P-V graph',
    make(rng) {
      const P0 = xchoose(rng, [8e5, 1e6, 1.2e6]), Vm = xchoose(rng, [4, 5, 6]) * 1e-3, n = xchoose(rng, [1, 2]); const a = P0 / (2 * Vm);
      const answer = +((P0 / 2) * Vm / (n * 8.31)).toFixed(2);
      return { P0, Vm, n, a, answer, tol: 0.3, unit: 'K',
        q: `${n} mol of an ideal gas is taken along the straight line P = ${xfmt(P0, 3)} − ${xfmt(a, 4)}V (SI units) through a range of volumes that includes the peak temperature. Find the highest temperature, in K. Take R = 8.31.`,
        sol: `PV = ${xfmt(P0, 3)}V − ${xfmt(a, 4)}V² is largest at V = P0/2a = ${xfmt(Vm, 4)} m³, where P = P0/2 = ${xfmt(P0 / 2, 4)} Pa. T_max = PV/nR = ${xfmt(P0 / 2 * Vm, 5)}/(${n}×8.31) = ${xfmt(answer, 4)} K.` };
    },
    verify: (p) => { let best = 0; for (let V = 1e-4; V < p.P0 / p.a; V += 1e-6) best = Math.max(best, (p.P0 - p.a * V) * V / (p.n * 8.31)); return best; } },
  { id: 'kt-g26', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'escape of gases',
    make(rng) {
      const [pl, ve] = xchoose(rng, [['Earth', 11200], ['Mars', 5030], ['the Moon', 2380]]); const [gn, M] = xchoose(rng, [['hydrogen', 0.002], ['helium', 0.004], ['nitrogen', 0.028]]);
      const T = M * (ve / 6) ** 2 / (3 * 8.31); const answer = +T.toFixed(1);
      return { ve, M, answer, tol: Math.max(0.5, answer * 0.01), unit: 'K',
        q: `A planet keeps a gas only if its rms molecular speed is less than one sixth of the escape speed. The escape speed from ${pl} is ${ve} m/s. Find the highest temperature, in K, at which ${gn} (M = ${M * 1000} g/mol) is retained. R = 8.31.`,
        sol: `Need √(3RT/M) ≤ v_esc/6 = ${xfmt(ve / 6, 4)} m/s. T = M(v_esc/6)²/(3R) = ${M}×${xfmt((ve / 6) ** 2, 5)}/${xfmt(3 * 8.31, 4)} = ${xfmt(answer, 4)} K.` };
    },
    verify: (p) => { let lo = 1, hi = 1e6; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (Math.sqrt(3 * 8.31 * mid / p.M) < p.ve / 6) lo = mid; else hi = mid; } return lo; } },
  { id: 'kt-g27', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'gas laws',
    make(rng) {
      const vc = xchoose(rng, [20, 30, 40, 50]), dp = xchoose(rng, [10, 15, 20]), vb = xchoose(rng, [2, 5, 10]); const answer = dp * vc / vb;
      return { vc, dp, vb, answer, tol: 0,
        q: `A cylinder of ${vc} L holds a gas at ${dp + 1} atm. Balloons of ${vb} L each, filled at 1 atm, are made from it at constant temperature until the cylinder pressure falls to 1 atm. How many balloons can be filled?`,
        sol: `Gas available at 1 atm: (${dp + 1} − 1) × ${vc} = ${dp * vc} L (the ${vc} L left in the cylinder at 1 atm cannot be used). Balloons = ${dp * vc}/${vb} = ${answer}.` };
    },
    verify: (p) => ((p.dp + 1) * p.vc - p.vc) / p.vb },
  { id: 'kt-g28', type: 'mcq', level: 3, exams: xex(3, 'mcq'), sub: 'ratio of speeds',
    make(rng) {
      const gases = [['hydrogen', 2], ['helium', 4], ['methane', 16], ['neon', 20], ['nitrogen', 28], ['oxygen', 32], ['carbon dioxide', 44]];
      const i = int(rng, 0, 6); let j = int(rng, 0, 6); if (j === i) j = (j + 1) % 7; const [na, Ma] = gases[i], [nb, Mb] = gases[j];
      const ratio = Math.sqrt(Mb / Ma); const o = xno(rng, ratio, [Mb / Ma, Math.sqrt(Ma / Mb), Ma / Mb], '', 3);
      return { Ma, Mb, options: o.options, answer: o.answer,
        q: `Find the ratio (rms speed of ${na}) / (rms speed of ${nb}) at the same temperature. Molar masses: ${na} ${Ma} g/mol, ${nb} ${Mb} g/mol.`,
        sol: `v_rms ∝ 1/√M, so the ratio is √(M_b/M_a) = √(${Mb}/${Ma}) = ${xfmt(ratio, 3)}. Forgetting the square root gives ${xfmt(Mb / Ma, 3)}; inverting gives ${xfmt(Math.sqrt(Ma / Mb), 3)}.` };
    },
    verify: (p) => p.options.indexOf(xfmt(Math.sqrt(p.Mb / p.Ma), 3)) },
  { id: 'kt-g29', type: 'mcq', level: 4, exams: xex(4, 'mcq'), sub: 'effect of heating',
    make(rng) {
      const k = xchoose(rng, [2, 4, 9]); const qty = int(rng, 0, 3);
      const names = ['the rms speed', 'the number of molecules per unit volume', 'the mean free path', 'the number of collisions per second made by one molecule'];
      const f = (x) => xfmt(x, 3);
      const vals = [Math.sqrt(k), 1 / k, k, 1 / Math.sqrt(k)];
      const o = xsh(rng, `×${f(vals[qty])}`, vals.filter((_, i) => i !== qty).map((v) => `×${f(v)}`).concat([`×${f(k * k)}`]));
      return { k, qty, options: o.options, answer: o.answer,
        q: `A fixed mass of ideal gas is heated at constant pressure until its absolute temperature is ${k} times larger. By what factor does ${names[qty]} change?`,
        sol: `At constant P: n = P/kT ∝ 1/T, v̄ ∝ √T, λ ∝ 1/n ∝ T, and collision frequency ∝ n v̄ ∝ T^(−1/2). With T × ${k}: rms speed × ${f(vals[0])}, number density × ${f(vals[1])}, mean free path × ${f(vals[2])}, collision frequency × ${f(vals[3])}.` };
    },
    verify: (p) => { const T = p.k; const phys = [Math.sqrt(T), (1 / T), 1 / (1 / T), (1 / T) * Math.sqrt(T)]; return p.options.indexOf(`×${xfmt(phys[p.qty], 3)}`); } },
  { id: 'kt-g30', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'gas spring',
    make(rng) {
      const m = xchoose(rng, [0.5, 1, 2]), h = xchoose(rng, [0.1, 0.2, 0.25]), A = xchoose(rng, [0.005, 0.01, 0.02]), gam = xchoose(rng, [1.4, 1.67]);
      const k = gam * 1e5 * A / h; const answer = +(2 * Math.PI * Math.sqrt(m / k) * 1000).toFixed(2);
      return { m, h, A, gam, answer, tol: Math.max(0.3, answer * 0.01), unit: 'ms',
        q: `A piston of mass ${m} kg closes a cylinder of cross-section ${A * 1e4} cm² and traps gas (γ = ${gam}) at 1.0×10⁵ Pa in a column ${h * 100} cm long. Pressed slightly and released, the gas compresses adiabatically. Find the period of small oscillations in ms.`,
        sol: `Adiabatic: ΔP = −γPΔV/V gives a restoring force F = −(γPA/h)x, so k = γPA/h = ${gam}×10⁵×${A}/${h} = ${xfmt(k, 4)} N/m. T = 2π√(m/k) = 2π√(${m}/${xfmt(k, 4)}) = ${xfmt(answer, 4)} ms.` };
    },
    verify: (p) => { const w = Math.sqrt(p.gam * 1e5 * p.A / (p.h * p.m)); return 2 * Math.PI / w * 1000; } },
  { id: 'kt-g31', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'real gases',
    make(rng) {
      const [gn, a, b] = xchoose(rng, [['nitrogen', 0.137, 3.87e-5], ['oxygen', 0.138, 3.18e-5], ['carbon dioxide', 0.364, 4.27e-5], ['argon', 0.136, 3.2e-5]]);
      const answer = +(8 * a / (27 * 8.31 * b)).toFixed(1);
      return { a, b, answer, tol: Math.max(0.5, answer * 0.01), unit: 'K',
        q: `For ${gn} the van der Waals constants are a = ${a} Pa m⁶ mol⁻² and b = ${xfmt(b * 1e5, 3)}×10⁻⁵ m³ mol⁻¹. Find its critical temperature T_c = 8a/(27Rb) in K. Take R = 8.31.`,
        sol: `T_c = 8a/(27Rb) = (8×${a})/(27×8.31×${xfmt(b, 3)}) = ${xfmt(8 * a, 4)}/${xfmt(27 * 8.31 * b, 4)} = ${xfmt(answer, 4)} K.` };
    },
    verify: (p) => { const Pc = p.a / (27 * p.b * p.b), Vc = 3 * p.b; return 8 * Pc * Vc / (3 * 8.31); } },
];

export default { topic: 'kinetic-theory', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
