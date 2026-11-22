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

export default { topic: 'kinetic-theory', groups, items, gens };
