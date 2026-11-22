import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EXB = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const exFor = (level, type) => (type === 'mcq' && level <= 3 ? [...EXB[level], 'cuet'] : EXB[level]);
const MU = 4e-7 * Math.PI; const QE = 1.6e-19; const ME = 9.1e-31; const MP = 1.67e-27;
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
let k = 0; let c = 0;
const nid = () => `sc-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const mn = (level, sub, q, correct, wrongs, unit, sol, o = {}) => {
  const f = (v) => `${fmt(v, 3)}${unit ? ' ' + unit : ''}`;
  return mcq(level, sub, q, f(correct), wrongs.map(f), sol, o);
};
const nat = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
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
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
// "how many are correct" statements item: options 0..3 or 1..4 as text
const cnt = (level, sub, q, list, n, sol, o = {}) => {
  const opts = ['Only one', 'Only two', 'Only three', 'All four'];
  return base(level, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((s, i) => `(${i + 1}) ${s}`).join('<br>')}`, options: opts, answer: n - 1, sol, ...o });
};
// match: correct code placed at a rotating position
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'match', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: exFor(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'passage', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const tx = (x, sig = 3) => {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig); if (Math.abs(m) >= 10) { m /= 10; return `${+m.toPrecision(sig)}\\times10^{${e + 1}}`; } return `${m}\\times10^{${e}}`; }
  return S(x, sig);
};
const N = (x, dp) => +x.toFixed(dp);
// index of the correct option text in a generated mcq, for verify
const vo = (p, val, unit, sig = 3) => p.options.indexOf(`${fmt(val, sig)}${unit ? ' ' + unit : ''}`);
const NI = 1.5e16; const QEL = 1.6e-19; const HC = 1.986e-25; const KB = 8.617e-5;
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'energy bands', r`The energy gap between the valence band and the conduction band of silicon is about`, '1.1 eV', ['0.67 eV', '5.5 eV', '0.01 eV'],
    r`Silicon: 1.1 eV; germanium: 0.67 eV; diamond (an insulator): about 5.4 eV. A semiconductor has a gap below about 3 eV.`),
  mcq(1, 'doping', r`Which of the following, when added as an impurity to silicon, makes it an n-type semiconductor?`, 'Phosphorus', ['Boron', 'Aluminium', 'Indium'],
    r`Phosphorus has 5 valence electrons: four bond with silicon and the fifth is free to conduct (it is a donor). Boron, aluminium and indium have 3 valence electrons and are acceptors (p-type).`),
  mcq(1, 'extrinsic semiconductors', r`In an n-type semiconductor, the majority charge carriers are`, 'electrons', ['holes', 'positive ions', 'protons'],
    r`Donor atoms supply extra electrons. The holes (made thermally) are the minority carriers.`),
  mcq(1, 'p-n junction', r`A p-n junction diode is forward biased when`, 'the p side is connected to the positive terminal and the n side to the negative terminal', ['the n side is connected to the positive terminal', 'the battery is removed', 'both sides are connected to the positive terminal'],
    r`Forward bias pushes holes from p and electrons from n towards the junction, narrowing the depletion layer and lowering the barrier.`),
  mcq(1, 'depletion layer', r`The depletion region of a p-n junction contains`, 'immobile ions and almost no free charge carriers', ['only free electrons', 'only free holes', 'equal numbers of mobile electrons and holes'],
    r`Electrons and holes diffuse across and recombine near the junction, leaving the fixed donor ions (positive, on the n side) and acceptor ions (negative, on the p side).`),
  mcq(1, 'barrier potential', r`The barrier potential of a germanium p-n junction at room temperature is about`, '0.3 V', ['0.7 V', '1.1 V', '5 V'],
    r`Germanium: about 0.3 V; silicon: about 0.7 V.`),
  mcq(1, 'rectifier', r`A rectifier is a circuit that`, 'converts alternating current into direct current', ['converts direct current into alternating current', 'raises the voltage of a DC source', 'stores charge'],
    r`A diode conducts only in one direction, so the output of a rectifier flows in one direction only.`),
  mcq(1, 'Zener diode', r`A Zener diode is mainly used as a`, 'voltage regulator, in reverse breakdown', ['rectifier, in forward bias', 'light source', 'amplifier'],
    r`In breakdown the voltage across a Zener stays nearly constant while the current changes widely, so it holds a steady voltage.`),
  mcq(1, 'LED', r`A light emitting diode emits light when it is`, 'forward biased', ['reverse biased', 'kept unbiased', 'heated above its Curie temperature'],
    r`In forward bias electrons and holes recombine near the junction and release energy as photons.`),
  mcq(1, 'photodiode', r`A photodiode is used in`, 'reverse bias', ['forward bias', 'zero bias only', 'breakdown with a Zener'],
    r`In reverse bias the dark current is small, so a rise in current caused by light is easy to measure.`),
  mcq(1, 'logic gates', r`The output of an AND gate is 1 only when`, 'both inputs are 1', ['either input is 1', 'both inputs are 0', 'the inputs are different'],
    r`AND: $Y = A\cdot B$.`),
  mcq(1, 'logic gates', r`Which two gates are called universal gates?`, 'NAND and NOR', ['AND and OR', 'NOT and OR', 'XOR and AND'],
    r`Every other gate (and so any circuit) can be built using NAND gates alone, or NOR gates alone.`),
  nat(1, 'rectifier', r`A full-wave rectifier is fed from a 50 Hz supply. Find the frequency of the ripple in its output (in Hz).`, 100, 0, 0,
    r`Each half-cycle of the input gives one pulse, so the output has twice the input frequency: $2\times50 = 100$ Hz.`, { unit: 'Hz' }),
  mcq(1, 'intrinsic semiconductors', r`As the temperature of a pure semiconductor rises, its resistance`, 'decreases', ['increases', 'stays the same', 'first increases then becomes zero'],
    r`More electron-hole pairs are made, so $n_i$ rises and conductivity increases. Metals show the opposite: their resistance rises.`),
  mcq(1, 'intrinsic semiconductors', r`How many valence electrons does a silicon atom have?`, '4', ['3', '5', '8'],
    r`Silicon is in group 14, with four valence electrons which form covalent bonds with four neighbours.`),
  // ---------- Level 2 ----------
  nat(2, 'carrier concentrations', r`In silicon $n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$. It is doped with donors to give an electron concentration of $4.5\times10^{22}\ \mathrm{m^{-3}}$. Find the hole concentration (in units of $10^{9}\ \mathrm{m^{-3}}$).`, NI * NI / 4.5e22 / 1e9, 0.05, 1,
    r`$np = n_i^2\Rightarrow p = \dfrac{(1.5\times10^{16})^2}{4.5\times10^{22}} = \dfrac{2.25\times10^{32}}{4.5\times10^{22}} = 5\times10^{9}\ \mathrm{m^{-3}}$.`, { unit: '1e9 /m^3' }),
  nat(2, 'diode circuit', r`A silicon diode (drop 0.7 V when conducting) is in series with a $430\ \Omega$ resistor and a 5 V battery, forward biased. Find the current (in mA, 1 decimal).`, (5 - 0.7) / 430 * 1e3, 0.05, 1,
    r`The resistor carries the rest of the voltage: $I = \dfrac{5-0.7}{430} = 0.0100$ A $= 10.0$ mA.`, { unit: 'mA' }),
  nat(2, 'half-wave rectifier', r`A half-wave rectifier gets a sinusoidal signal of peak value 10 V (ideal diode). Find the average (dc) output voltage (in V, 2 decimals).`, 10 / Math.PI, 0.01, 2,
    r`$V_{dc} = \dfrac{V_m}{\pi} = \dfrac{10}{\pi} = 3.18$ V.`, { unit: 'V' }),
  nat(2, 'full-wave rectifier', r`A full-wave rectifier gets a sinusoidal signal of peak value 10 V (ideal diodes). Find the average output voltage (in V, 2 decimals).`, 20 / Math.PI, 0.01, 2,
    r`$V_{dc} = \dfrac{2V_m}{\pi} = \dfrac{20}{\pi} = 6.37$ V.`, { unit: 'V' }),
  nat(2, 'Zener diode', r`A 12 V supply is connected to a $200\ \Omega$ series resistor and a 6 V Zener diode, in reverse breakdown, with nothing else connected. Find the current in the Zener (in mA).`, (12 - 6) / 200 * 1e3, 0.2, 0,
    r`The resistor drops $12-6 = 6$ V, so $I = \dfrac{6}{200} = 0.030$ A $= 30$ mA.`, { unit: 'mA' }),
  nat(2, 'LED', r`An LED made of a material with an energy gap of 1.9 eV emits light of wavelength about (in nm, nearest integer; use $\lambda = 1240/E$ nm with $E$ in eV).`, 1240 / 1.9, 2, 0,
    r`$\lambda = \dfrac{hc}{E_g} = \dfrac{1240}{1.9} = 653$ nm: red light.`, { unit: 'nm' }),
  nat(2, 'photodiode', r`A silicon photodiode has a band gap of 1.1 eV. Find the longest wavelength it can detect (in nm, nearest integer, use $hc = 1240$ eV nm).`, 1240 / 1.1, 3, 0,
    r`A photon must have at least $E_g$ to make an electron-hole pair: $\lambda_{max} = \dfrac{1240}{1.1} = 1127$ nm (infrared).`, { unit: 'nm' }),
  mcq(2, 'p-n junction', r`When a p-n junction is forward biased, its depletion layer`, 'becomes narrower', ['becomes wider', 'stays the same', 'disappears completely at all voltages'],
    r`Forward bias pushes carriers towards the junction, so fewer uncovered ions remain; the barrier falls and the layer narrows. Reverse bias widens it.`),
  mcq(2, 'extrinsic semiconductors', r`A piece of n-type silicon is`, 'electrically neutral', ['positively charged', 'negatively charged', 'charged, with the sign depending on the dopant'],
    r`The extra electrons come from donor atoms which became positive ions. Total negative charge equals total positive charge.`, { trap: 'Majority carriers being electrons does not make the crystal negative.' }),
  mcq(2, 'extrinsic semiconductors', r`In a p-type semiconductor, the minority carriers are`, 'electrons, produced by thermal generation of pairs', ['holes, from acceptor atoms', 'positive ions', 'neutral atoms'],
    r`Holes (majority) come mostly from acceptors. A few electron-hole pairs are made by heat; the electrons are the minority.`),
  mcq(2, 'logic gates', r`The inputs to a NAND gate are $A = 1$ and $B = 1$. The output is`, '0', ['1', 'not defined for these inputs', 'the same as $A + B$'],
    r`$Y = \overline{A\cdot B} = \overline{1} = 0$. NAND gives 0 only when both inputs are 1.`),
  mcq(2, 'rectifier', r`The peak inverse voltage (PIV) of each diode in a centre-tapped full-wave rectifier, with a peak voltage $V_m$ across each half of the secondary, is`, r`$2V_m$`, [r`$V_m$`, r`$V_m/2$`, r`$\sqrt2V_m$`],
    r`When one diode conducts, the other sees the voltages of both half-windings in series: $V_m+V_m = 2V_m$. A half-wave and a bridge rectifier need only $V_m$.`),
  mcq(2, 'energy bands', r`In an n-type semiconductor the donor energy level lies`, 'just below the bottom of the conduction band', ['just above the top of the valence band', 'in the middle of the energy gap', 'inside the valence band'],
    r`Donor electrons need only a small energy (about 0.01 to 0.05 eV) to reach the conduction band. Acceptor levels of p-type lie just above the valence band.`),
  mcq(2, 'doping', r`On doping a pure semiconductor lightly with an impurity, its conductivity`, 'increases greatly', ['decreases greatly', 'stays the same', 'becomes zero'],
    r`One doping atom in $10^{7}$ or so adds many free carriers, far above the intrinsic number at room temperature.`),
  nat(2, 'conductivity', r`For intrinsic silicon, $n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$, electron mobility is $0.135\ \mathrm{m^2V^{-1}s^{-1}}$ and hole mobility is $0.048\ \mathrm{m^2V^{-1}s^{-1}}$. Find the conductivity (in units of $10^{-4}\ \mathrm{S\,m^{-1}}$, 2 decimals). $e = 1.6\times10^{-19}$ C.`, 1.6e-19 * 1.5e16 * (0.135 + 0.048) / 1e-4, 0.03, 2,
    r`$\sigma = e(n\mu_e+p\mu_h) = en_i(\mu_e+\mu_h) = 1.6\times10^{-19}\times1.5\times10^{16}\times0.183 = 4.39\times10^{-4}\ \mathrm{S\,m^{-1}}$.`, { unit: '1e-4 S/m' }),
  mcq(2, 'diode symbol', r`In the circuit symbol of a p-n junction diode, the arrow points from`, 'the p side towards the n side, the direction of conventional current in forward bias', ['the n side towards the p side', 'the cathode to the anode in forward bias', 'the positive terminal of the battery to the diode in reverse bias'],
    r`The arrowhead is the p-side (anode); the bar is the n-side (cathode). Conventional current flows with the arrow when the diode conducts.`),
  mcq(2, 'rectifier', r`Which rectifier has the smaller ripple factor?`, 'Full-wave (about 0.48), against about 1.21 for half-wave', ['Half-wave (about 0.48), against about 1.21 for full-wave', 'Both have the same ripple factor', 'Neither, because both give pure DC'],
    r`A full-wave output has pulses twice as often and is closer to DC. The ripple factor is $r = V_{ac,rms}/V_{dc}$.`),
  mcq(2, 'p-n junction', r`The small current in a reverse-biased p-n junction diode is due to`, 'minority carriers', ['majority carriers', 'both kinds of carriers equally', 'ions moving in the depletion layer'],
    r`The field of the reverse bias sweeps minority carriers across the junction. The current is small (microamperes) and nearly independent of the voltage until breakdown.`),
  mcq(2, 'Zener diode', r`In the reverse breakdown region of a Zener diode, as the current changes over a wide range, the voltage across it`, 'stays nearly constant', ['rises in proportion to the current', 'falls to zero', 'drops by 0.7 V'],
    r`The nearly vertical part of the characteristic means a very small dynamic resistance, so the voltage is held at $V_z$.`),
  nat(2, 'Ge diode', r`A germanium diode (drop 0.3 V) is in series with a $270\ \Omega$ resistor and a 3 V battery, forward biased. Find the current (in mA).`, (3 - 0.3) / 270 * 1e3, 0.2, 0,
    r`$I = \dfrac{3-0.3}{270} = 0.0100$ A $= 10$ mA.`, { unit: 'mA' }),
  mcq(2, 'doping', r`When a pure semiconductor is doped with donor atoms, the hole concentration $p$`, 'decreases below its intrinsic value, while the electron concentration rises', ['increases along with the electron concentration', 'stays the same', 'becomes exactly zero'],
    r`The mass-action law $np = n_i^2$ must hold at equilibrium. When $n$ rises, $p$ falls: extra electrons recombine with some holes.`),
  mcq(2, 'logic gates', r`The output of a NOR gate is 1 only when`, 'both inputs are 0', ['both inputs are 1', 'the inputs are different', 'either input is 0'],
    r`NOR $= \overline{A+B}$. It is 1 only if $A+B = 0$, i.e. both are 0.`),
  // ---------- Level 3 ----------
  nat(3, 'diode characteristics', r`In the forward characteristic of a diode, when the voltage changes from 0.70 V to 0.80 V the current changes from 10 mA to 30 mA. Find the dynamic (a.c.) resistance in this region (in $\Omega$).`, 0.1 / 0.02, 0.05, 1,
    r`$r_d = \dfrac{\Delta V}{\Delta I} = \dfrac{0.10}{0.020} = 5.0\ \Omega$. It is not $V/I$ (that is the static resistance, 27 $\Omega$ at the end point).`, { unit: 'ohm', trap: 'Dynamic resistance uses changes, not the ratio of totals.' }),
  nat(3, 'diode circuit', r`Two identical silicon diodes (0.7 V each) are in series with each other and with a $1\ \mathrm{k\Omega}$ resistor across a 5 V battery, both forward biased. Find the current (in mA, 1 decimal).`, (5 - 1.4) / 1000 * 1e3, 0.05, 1,
    r`The diodes drop $2\times0.7 = 1.4$ V in all. $I = \dfrac{5-1.4}{1000} = 3.6$ mA.`, { unit: 'mA' }),
  nat(3, 'Zener regulator', r`A 20 V supply feeds a 12 V Zener diode through $200\ \Omega$. A load of $1.2\ \mathrm{k\Omega}$ is connected across the Zener. Find the current in the Zener (in mA).`, (20 - 12) / 200 * 1e3 - 12 / 1200 * 1e3, 0.2, 0,
    r`Total current $I_s = \dfrac{20-12}{200} = 40$ mA. Load current $I_L = \dfrac{12}{1200} = 10$ mA. Zener current $I_z = 40-10 = 30$ mA.`, { unit: 'mA' }),
  nat(3, 'half-wave rectifier', r`The peak value of the input of a half-wave rectifier is 20 V (ideal diode). Find the r.m.s. value of the output voltage (in V).`, 20 / 2, 0.05, 1,
    r`For a half-wave rectified sine, $V_{rms} = \dfrac{V_m}{2} = 10$ V (compare $V_m/\sqrt2$ for a full sine or a full-wave rectified one).`, { unit: 'V', trap: 'Half-wave: Vm/2. Full-wave: Vm/√2.' }),
  nat(3, 'bridge rectifier', r`A bridge rectifier is fed from a transformer secondary of peak voltage 12 V. Each silicon diode drops 0.7 V. Find the peak output voltage (in V, 1 decimal).`, 12 - 1.4, 0.05, 1,
    r`In a bridge, current passes through two diodes in series in each half-cycle: $12 - 2\times0.7 = 10.6$ V.`, { unit: 'V', trap: 'Two diodes conduct at a time in a bridge.' }),
  nat(3, 'capacitor filter', r`A full-wave rectifier with a 50 Hz supply feeds a load drawing 10 mA through a $1000\ \mu$F smoothing capacitor. Estimate the peak-to-peak ripple (in mV), using $\Delta V = I/(f_rC)$ where $f_r$ is the ripple frequency.`, 10e-3 / (100 * 1000e-6) * 1e3, 1, 0,
    r`Ripple frequency $f_r = 100$ Hz. $\Delta V = \dfrac{10\times10^{-3}}{100\times10^{-3}} = 0.1$ V $= 100$ mV.`, { unit: 'mV' }),
  nat(3, 'LED circuit', r`A red LED drops 2.0 V when it carries 20 mA. It is run from a 5 V supply through a series resistor. Find the resistor (in $\Omega$).`, (5 - 2) / 0.02, 1, 0,
    r`$R = \dfrac{V_s - V_F}{I} = \dfrac{5-2}{0.020} = 150\ \Omega$.`, { unit: 'ohm' }),
  nat(3, 'carrier concentrations', r`Silicon with $n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$ is doped with $5\times10^{21}\ \mathrm{m^{-3}}$ acceptor atoms. Find the electron concentration (in units of $10^{9}\ \mathrm{m^{-3}}$).`, NI * NI / 5e21 / 1e9, 0.5, 0,
    r`Holes $p\approx N_A = 5\times10^{21}$. $n = \dfrac{n_i^2}{p} = \dfrac{2.25\times10^{32}}{5\times10^{21}} = 4.5\times10^{10} = 45\times10^{9}\ \mathrm{m^{-3}}$.`, { unit: '1e9 /m^3' }),
  nat(3, 'transformer and rectifier', r`A transformer with 20 times as many turns on the primary as on the secondary is connected to 240 V (r.m.s.) mains and feeds a full-wave rectifier (ideal diodes). Find the average output voltage (in V, 1 decimal).`, 2 * Math.SQRT2 * (240 / 20) / Math.PI, 0.1, 1,
    r`Secondary r.m.s. $= 240/20 = 12$ V; peak $V_m = 12\sqrt2 = 16.97$ V. $V_{dc} = \dfrac{2V_m}{\pi} = 10.8$ V.`, { unit: 'V' }),
  nat(3, 'photodiode', r`Germanium has a band gap of 0.67 eV. Find the longest wavelength of light that can produce electron-hole pairs in it (in nm, nearest integer, $hc = 1240$ eV nm).`, 1240 / 0.67, 3, 0,
    r`$\lambda = \dfrac{1240}{0.67} = 1851$ nm.`, { unit: 'nm' }),
  mcq(3, 'diode circuit', r`A 10 V battery, an ideal diode and a $2\ \mathrm{k\Omega}$ resistor are in series, with the diode's anode joined to the negative terminal of the battery. The current is`, 'zero', ['5 mA', '10 mA', '4.65 mA'],
    r`The diode is reverse biased (anode at the lower potential), so an ideal diode blocks the current.`),
  mcq(3, 'diode circuit', r`Two ideal diodes $D_1$ and $D_2$ are connected in parallel with opposite polarities. This pair is in series with a $5\ \mathrm{k\Omega}$ resistor and a 10 V battery. The current in the resistor is`, '2 mA', ['0', '4 mA', '1 mA'],
    r`Whichever way the battery is connected, one of the two diodes is forward biased and conducts, the other is blocked. $I = 10/5000 = 2$ mA.`),
  mcq(3, 'diode circuit', r`A germanium diode (0.3 V drop) and a silicon diode (0.7 V drop) are connected in parallel, both forward biased, in series with a resistor $R$ and a 5 V battery. Which statement is correct?`, 'Nearly all the current flows through the germanium diode, and the voltage across the pair is about 0.3 V', ['The current divides equally, and the voltage across the pair is 0.7 V', 'Nearly all the current flows through the silicon diode', 'The voltage across the pair is 1.0 V'],
    r`Parallel branches share the same voltage. The Ge diode starts to conduct at 0.3 V, and the current then rises very fast with a tiny increase in voltage, so the voltage across both stays near 0.3 V, where the Si diode carries almost nothing.`, { trap: 'Parallel diodes do not share current equally unless they are identical.' }),
  mcq(3, 'logic gates', r`If the two inputs of a NAND gate are joined together, the gate behaves as`, 'a NOT gate', ['an AND gate', 'an OR gate', 'a NOR gate'],
    r`$Y = \overline{A\cdot A} = \overline{A}$.`),
  mcq(3, 'logic gates', r`If the two inputs of a NOR gate are joined together, the gate behaves as`, 'a NOT gate', ['an OR gate', 'an AND gate', 'a NAND gate'],
    r`$Y = \overline{A+A} = \overline{A}$.`),
  mcq(3, 'logic gates', r`A NAND gate followed by a NOT gate gives the function of a(n)`, 'AND gate', ['OR gate', 'NOR gate', 'XOR gate'],
    r`$\overline{\overline{A\cdot B}} = A\cdot B$.`),
  mcq(3, 'Boolean algebra', r`De Morgan's law states that $\overline{A+B}$ equals`, r`$\overline{A}\cdot\overline{B}$`, [r`$\overline{A}+\overline{B}$`, r`$\overline{A\cdot B}$`, r`$A\cdot B$`],
    r`Break the bar and change the sign: $\overline{A+B} = \overline A\cdot\overline B$ and $\overline{A\cdot B} = \overline A+\overline B$.`),
  mcq(3, 'Boolean algebra', r`The Boolean expression $Y = A + \overline{A}B$ simplifies to`, r`$A + B$`, [r`$A\cdot B$`, r`$\overline A + B$`, r`$A$`],
    r`$A+\overline AB = (A+\overline A)(A+B) = 1\cdot(A+B) = A+B$. Check $A=0,B=1$: LHS $= 0+1 = 1$ and $A+B = 1$. Both agree.`),
  mcq(3, 'Boolean algebra', r`The expression $Y = AB + A\overline{B}$ is equal to`, r`$A$`, [r`$B$`, r`$A + B$`, r`$A\cdot B$`],
    r`$AB+A\overline B = A(B+\overline B) = A$.`),
  mcq(3, 'p-n junction', r`When a p-n junction is reverse biased, the depletion layer`, 'widens and the barrier height rises', ['narrows and the barrier falls', 'widens but the barrier falls', 'stays the same'],
    r`The applied voltage adds to the built-in barrier $V_0$ (effective barrier $V_0+V$), so more ions are uncovered and the layer is wider.`),
  mcq(3, 'photodiode', r`A photodiode is operated in reverse bias because`, 'the fractional change in the small reverse current caused by light is easier to measure', ['it needs a large forward current', 'the junction works only when the depletion layer is thin', 'forward bias destroys the junction'],
    r`In reverse bias the dark current of minority carriers is tiny. Light creates extra minority carriers, which raise the current by a large factor.`),
  mcq(3, 'solar cell', r`The I-V characteristic of a solar cell (with the usual axes) lies in`, 'the fourth quadrant, because the cell delivers power', ['the first quadrant, like a resistor', 'the third quadrant, like a reverse biased diode', 'the second quadrant'],
    r`Photons create carriers and the cell drives current out of its positive terminal at positive voltage: the current is reversed relative to the diode current, so the curve is in the fourth quadrant where $P = VI$ is delivered.`),
  mcq(3, 'LED', r`To get visible light, an LED must be made of a semiconductor with a band gap of about`, '1.8 eV to 3.1 eV', ['0.1 eV to 0.5 eV', '5 eV to 10 eV', '0.67 eV (like germanium)'],
    r`Visible photons are 400 to 700 nm: $E = 1240/\lambda$ gives 3.1 eV to 1.8 eV. Silicon and germanium have gaps that are too small and radiate in the infrared (and mostly non-radiatively).`),
  nat(3, 'depletion layer field', r`The barrier potential of a p-n junction is 0.7 V and the depletion layer is $0.35\ \mu$m wide. Find the average electric field in it (in units of $10^6\ \mathrm{V\,m^{-1}}$, 1 decimal).`, 0.7 / 0.35e-6 / 1e6, 0.05, 1,
    r`$E = \dfrac{V}{d} = \dfrac{0.7}{0.35\times10^{-6}} = 2.0\times10^{6}\ \mathrm{V\,m^{-1}}$.`, { unit: '1e6 V/m' }),
  mcq(3, 'intrinsic semiconductors', r`When the temperature of a doped semiconductor is raised a lot, it behaves more like an intrinsic one. This is because`, 'thermally generated pairs become far more numerous than the dopant carriers', ['the dopant atoms disappear', 'the band gap shrinks to zero', 'the majority carriers are all lost'],
    r`$n_i$ rises roughly exponentially with $T$ and finally becomes comparable with the doping concentration, so $n\approx p$.`),
  // ---------- Level 4 ----------
  nat(4, 'diode circuit', r`Two identical silicon diodes are connected in parallel (both forward biased) and in series with a $1\ \mathrm{k\Omega}$ resistor and a 3.7 V battery. Find the current in one diode (in mA, 1 decimal; use 0.7 V drop).`, (3.7 - 0.7) / 1000 / 2 * 1e3, 0.05, 1,
    r`Both diodes have 0.7 V across them, so the resistor carries $\dfrac{3.7-0.7}{1000} = 3.0$ mA. Identical diodes share equally: 1.5 mA each.`, { unit: 'mA', trap: 'Do not subtract 1.4 V; parallel diodes share one 0.7 V drop.' }),
  nat(4, 'diode circuit', r`A germanium diode (0.3 V) and a silicon diode (0.7 V) are in parallel, both forward biased, in series with a $470\ \Omega$ resistor and a 5 V battery. Find the total current (in mA, nearest integer).`, (5 - 0.3) / 470 * 1e3, 0.5, 0,
    r`The Ge diode clamps the voltage across the pair at 0.3 V, so the Si diode stays off. $I = \dfrac{5-0.3}{470} = 10$ mA.`, { unit: 'mA', trap: 'Using 0.7 V gives 9.15 mA, the wrong answer.' }),
  nat(4, 'half-wave rectifier', r`A half-wave rectifier uses a silicon diode (0.7 V drop when conducting) and is fed with a sine wave of peak 12 V. Estimate the average output voltage (in V, 2 decimals), taking the output as the part of the wave above 0.7 V and treating it as $(V_m-0.7)/\pi$.`, (12 - 0.7) / Math.PI, 0.02, 2,
    r`The peak output is $12-0.7 = 11.3$ V. $V_{dc}\approx\dfrac{11.3}{\pi} = 3.60$ V.`, { unit: 'V' }),
  nat(4, 'ripple factor', r`The output of a half-wave rectifier has a d.c. value of 3.18 V and an r.m.s. value (of the whole output) of 5.00 V. Find the ripple factor $r = V_{ac,rms}/V_{dc}$ (2 decimals).`, Math.sqrt((5 / 3.18) ** 2 - 1), 0.02, 2,
    r`The r.m.s. of the whole output satisfies $V_{rms}^2 = V_{dc}^2+V_{ac}^2$. $r = \sqrt{\left(\dfrac{V_{rms}}{V_{dc}}\right)^2-1} = \sqrt{2.472-1} = 1.21$.`, { unit: '' }),
  nat(4, 'photodiode', r`A photodiode with quantum efficiency 0.5 (each photon makes 0.5 electron on average) is lit by 1 mW of light of wavelength 800 nm. Find the photocurrent (in mA, 3 decimals). $e = 1.6\times10^{-19}$ C, $hc = 1.986\times10^{-25}$ J m.`, 0.5 * 1e-3 * 800e-9 * QEL / HC * 1e3, 0.005, 3,
    r`Photon rate $= \dfrac{P\lambda}{hc} = \dfrac{10^{-3}\times8\times10^{-7}}{1.986\times10^{-25}} = 4.03\times10^{15}\ \mathrm{s^{-1}}$. Electrons per second $= 0.5\times4.03\times10^{15}$. $I = 2.01\times10^{15}\times1.6\times10^{-19} = 3.22\times10^{-4}$ A $= 0.322$ mA.`, { unit: 'mA' }),
  nat(4, 'solar cell', r`A solar cell of area $0.01\ \mathrm{m^2}$ in sunlight of $1000\ \mathrm{W\,m^{-2}}$ has an open-circuit voltage of 0.6 V, a short-circuit current of 2 A and a fill factor of 0.8. Find its efficiency (in %, 1 decimal).`, 0.6 * 2 * 0.8 / (1000 * 0.01) * 100, 0.1, 1,
    r`Maximum power $= V_{oc}I_{sc}\times FF = 0.6\times2\times0.8 = 0.96$ W. Input power $= 1000\times0.01 = 10$ W. Efficiency $= 0.96/10 = 9.6\ \%$.`, { unit: '%' }),
  nat(4, 'temperature dependence', r`The intrinsic concentration varies as $n_i\propto T^{3/2}e^{-E_g/2kT}$. For silicon ($E_g = 1.1$ eV, $k = 8.617\times10^{-5}$ eV K$^{-1}$), find the ratio $n_i(400\ \mathrm{K})/n_i(300\ \mathrm{K})$ (nearest integer).`, Math.pow(400 / 300, 1.5) * Math.exp(-1.1 / (2 * KB) * (1 / 400 - 1 / 300)), 3, 0,
    r`Ratio $= \left(\dfrac{400}{300}\right)^{3/2}\exp\!\left[\dfrac{E_g}{2k}\left(\dfrac1{300}-\dfrac1{400}\right)\right] = 1.540\times e^{5.32} = 1.540\times204 = 314$.`, { unit: '' }),
  nat(4, 'universal gates', r`What is the smallest number of 2-input NAND gates needed to build one XOR gate?`, 4, 0, 0,
    r`$Y = A\oplus B$: let $N = \overline{AB}$. Then $Y = \overline{\overline{A\cdot N}\cdot\overline{B\cdot N}}$. That is gates for $N$, $\overline{AN}$, $\overline{BN}$ and the final one: 4 gates.`, { unit: '' }),
  nat(4, 'Zener regulator', r`A Zener regulator uses $V_z = 9$ V, $R_s = 100\ \Omega$ and a load drawing 30 mA. The Zener can carry at most 60 mA. Find the largest input voltage it can accept (in V).`, 9 + 100 * (0.06 + 0.03), 0.1, 1,
    r`Series resistor current is $I_z + I_L = 60 + 30 = 90$ mA at most. $V_{in,max} = V_z + R_sI = 9 + 100\times0.09 = 18$ V.`, { unit: 'V' }),
  nat(4, 'LED', r`An LED carrying 20 mA converts 10 % of the electrons passing through it into emitted photons. Find the number of photons emitted per second (in units of $10^{16}$, 2 decimals). $e = 1.6\times10^{-19}$ C.`, 0.1 * 0.02 / QEL / 1e16, 0.02, 2,
    r`Electrons per second $= I/e = \dfrac{0.02}{1.6\times10^{-19}} = 1.25\times10^{17}$. Photons $= 0.1\times1.25\times10^{17} = 1.25\times10^{16}$ per second.`, { unit: '1e16 /s' }),
  mcq(4, 'p-n junction', r`At equilibrium (no bias), the net current across a p-n junction is zero because`, 'the diffusion current of majority carriers equals the drift current of minority carriers', ['there are no carriers near the junction', 'only electrons can cross the junction', 'the barrier potential is zero'],
    r`Diffusion pushes majority carriers across; the junction field makes minority carriers drift back. The two currents cancel. The barrier exists (about 0.7 V in Si) but it cannot drive a net current in a closed circuit by itself.`),
  mcq(4, 'diode circuit', r`Two identical silicon diodes are connected back to back in series (anode to anode) and a battery is placed across the pair with a resistor. The current is`, 'almost zero (the reverse leakage only)', ['the same as one diode in forward bias', 'twice that of one diode', 'limited only by the resistor'],
    r`Whichever way the battery is connected, one of the two is reverse biased, so no forward current flows.`),
  mcq(4, 'Zener diode', r`A Zener diode connected in forward bias behaves like`, 'an ordinary diode with a drop of about 0.7 V', ['a constant voltage source of $V_z$', 'an open circuit', 'a short circuit with no drop'],
    r`Its special behaviour, the sharp breakdown at $V_z$, is only in reverse bias.`),
  mcq(4, 'Boolean algebra', r`Which of the following expressions equals the XOR function $A\oplus B$?`, r`$A\overline B + \overline AB$`, [r`$AB + \overline A\,\overline B$`, r`$A + B$`, r`$\overline{A+B}$`],
    r`XOR is 1 when the inputs differ: $A\overline B+\overline AB$. The first wrong option is XNOR.`),
  mcq(4, 'diode circuit', r`A sinusoidal voltage $V_0\sin\omega t$ is applied across an ideal diode in series with a resistor. The voltage across the resistor is`, 'only the positive half-cycles, equal to the input', ['the full sine wave', 'only the negative half-cycles', 'a constant $V_0$'],
    r`The ideal diode conducts only when the input is positive (forward bias); in the negative half cycle it blocks and the resistor voltage is zero.`),
  mcq(4, 'logic gates', r`The inputs $A$ and $B$ to a gate follow the sequences $A = 0,0,1,1$ and $B = 0,1,0,1$. The output is $Y = 0,1,1,0$. The gate is`, 'XOR', ['OR', 'NAND', 'XNOR'],
    r`Output is 1 exactly when the inputs differ: XOR. OR would give 0,1,1,1. NAND gives 1,1,1,0. XNOR gives 1,0,0,1.`),
  mcq(4, 'logic gates', r`The inputs $A$ and $B$ follow $A = 0,0,1,1$ and $B = 0,1,0,1$. The output of a NOR gate is`, '1, 0, 0, 0', ['0, 1, 1, 1', '1, 1, 1, 0', '0, 0, 0, 1'],
    r`NOR is 1 only for (0,0). The second wrong option is OR; the third wrong option is NAND; the last is AND.`),
  // ---------- Level 5 ----------
  nat(5, 'bridge rectifier', r`A bridge rectifier (silicon diodes, 0.7 V drop each) is fed from a secondary of peak voltage 12 V and loads $100\ \Omega$. Find the peak load current (in mA, nearest integer).`, (12 - 1.4) / 100 * 1e3, 1, 0,
    r`Two diodes conduct at a time: $V_{peak} = 12-1.4 = 10.6$ V. $I = 10.6/100 = 0.106$ A $= 106$ mA.`, { unit: 'mA' }),
  nat(5, 'Zener regulator', r`A Zener regulator has $V_{in} = 15$ V, $R_s = 100\ \Omega$ and $V_z = 9$ V. The Zener needs at least 5 mA to stay in breakdown. Find the smallest load resistance that can be connected (in $\Omega$, nearest integer).`, 9 / (0.06 - 0.005), 2, 0,
    r`$I_s = \dfrac{15-9}{100} = 60$ mA. The load can take $60-5 = 55$ mA at most. $R_{L,min} = \dfrac{9}{0.055} = 164\ \Omega$.`, { unit: 'ohm', trap: 'Smaller RL draws more current, so the limit is a minimum RL.' }),
  nat(5, 'diode circuit', r`Two Zener diodes, each of $V_z = 5$ V, are connected back to back (cathode to cathode) in series with a $1\ \mathrm{k\Omega}$ resistor and a 12 V battery. In forward bias a Zener drops 0.7 V. Find the current (in mA, 1 decimal).`, (12 - 5 - 0.7) / 1000 * 1e3, 0.05, 1,
    r`One Zener is forward biased (0.7 V) and the other is in reverse breakdown (5 V). Total drop $5.7$ V. $I = \dfrac{12-5.7}{1000} = 6.3$ mA.`, { unit: 'mA' }),
  nat(5, 'compensated semiconductor', r`Silicon with $n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$ is doped with $10^{22}\ \mathrm{m^{-3}}$ donors and also with $4\times10^{21}\ \mathrm{m^{-3}}$ acceptors. Find the hole concentration (in units of $10^{10}\ \mathrm{m^{-3}}$, 2 decimals).`, NI * NI / (1e22 - 4e21) / 1e10, 0.02, 2,
    r`Donors and acceptors compensate: net donors $N_D-N_A = 6\times10^{21}$, so $n\approx6\times10^{21}$ (n-type). $p = \dfrac{n_i^2}{n} = \dfrac{2.25\times10^{32}}{6\times10^{21}} = 3.75\times10^{10}$.`, { unit: '1e10 /m^3' }),
  nat(5, 'rectifier efficiency', r`Find the theoretical maximum efficiency of an ideal half-wave rectifier (dc power in the load divided by a.c. input power, as a percentage, 1 decimal).`, 4 / (Math.PI * Math.PI) * 100, 0.2, 1,
    r`$P_{dc} = \dfrac{(V_m/\pi)^2}{R_L}$ and $P_{ac} = \dfrac{(V_m/2)^2}{R_L}$. $\eta = \dfrac{4}{\pi^2} = 0.405 = 40.5\ \%$ (books often quote 40.6 %). A full-wave rectifier gives $8/\pi^2 = 81\ \%$.`, { unit: '%' }),
  nat(5, 'universal gates', r`What is the smallest number of 2-input NOR gates needed to build one AND gate?`, 3, 0, 0,
    r`$A\cdot B = \overline{\overline A+\overline B}$. Two NOR gates (inputs joined) make $\overline A$ and $\overline B$, and a third NOR combines them: 3 gates.`, { unit: '' }),
  mcq(5, 'logic circuits', r`A circuit has $Y = \overline{(A+B)}\cdot C + A\cdot B$. For how many of the 8 input combinations is $Y = 1$?`, '3', ['2', '4', '5'],
    r`$\overline{A+B}\cdot C$ is 1 only for $A=B=0,\ C=1$: one combination. $AB$ is 1 for $A=B=1$ with $C$ = 0 or 1: two combinations. These do not overlap. Total 3.`),
  mcq(5, 'logic circuits', r`The output $Y$ of the circuit $Y = \overline{A\cdot\overline{B}}$ is the same as`, r`$\overline A + B$`, [r`$A + \overline B$`, r`$\overline A\cdot B$`, r`$A\cdot B$`],
    r`De Morgan: $\overline{A\overline B} = \overline A+\overline{\overline B} = \overline A+B$. Check with $A=1,B=0$: $\overline{1\cdot1} = 0$ and $\overline A+B = 0+0 = 0$.`),
  msq(5, 'semiconductors', r`Which of the following statements are correct?`, [
    r`In an intrinsic semiconductor, the number of electrons equals the number of holes.`,
    r`In a doped semiconductor, $np = n_i^2$ at equilibrium.`,
    r`The conductivity of a pure semiconductor rises with temperature.`,
    r`In an n-type semiconductor the Fermi level is closer to the valence band.`], [0, 1, 2],
    r`(D) is false: in n-type material the Fermi level moves up towards the conduction band.`),
  msq(5, 'diodes', r`Which of the following are correct about a reverse biased p-n junction diode?`, [
    r`The depletion layer becomes wider.`,
    r`A small current flows because of minority carriers.`,
    r`The barrier height becomes $V_0+V$.`,
    r`The current rises exponentially with the applied voltage.`], [0, 1, 2],
    r`(D) is the forward characteristic. In reverse bias the current is nearly constant (a few $\mu$A) until breakdown.`),
  msq(5, 'rectifiers', r`Which of the following are correct for a full-wave rectifier with a sinusoidal input of peak $V_m$ (ideal diodes)?`, [
    r`The average output is $2V_m/\pi$.`,
    r`The r.m.s. output is $V_m/\sqrt2$.`,
    r`The ripple frequency is twice the input frequency.`,
    r`The ripple factor is 1.21.`], [0, 1, 2],
    r`The ripple factor of a full-wave rectifier is 0.48; 1.21 belongs to a half-wave rectifier.`),
  msq(5, 'logic gates', r`Which of the following are universal gates, or can be made into one?`, [
    r`NAND`, r`NOR`, r`AND`, r`XOR`], [0, 1],
    r`Only NAND and NOR can realise every Boolean function alone. AND, OR, XOR cannot make NOT (without extra constant inputs).`),
  msq(5, 'special diodes', r`Which of the following statements about special diodes are correct?`, [
    r`An LED is used in forward bias.`,
    r`A photodiode is used in reverse bias.`,
    r`A solar cell works without any external bias.`,
    r`A Zener regulator works in forward bias.`], [0, 1, 2],
    r`A Zener regulator uses reverse breakdown.`),
  msq(5, 'doping', r`Which of the following are correct for an extrinsic semiconductor?`, [
    r`A donor atom has 5 valence electrons (for silicon).`,
    r`An acceptor atom creates a hole.`,
    r`The acceptor level lies just above the valence band.`,
    r`A p-type semiconductor carries a net positive charge.`], [0, 1, 2],
    r`The crystal as a whole is neutral. (D) is false.`),
  asrt(2, 'p-n junction', r`A p-n junction conducts in forward bias but blocks in reverse bias.`, r`The depletion layer narrows in forward bias and widens in reverse bias.`, 0,
    r`Both true; the lowering of the barrier in forward bias lets majority carriers cross, while a higher barrier stops them in reverse bias.`),
  asrt(3, 'rectifier', r`A full-wave rectifier gives a smoother output than a half-wave rectifier.`, r`The output of a full-wave rectifier has a ripple frequency double that of the input.`, 0,
    r`With pulses twice as often, the same capacitor discharges less between peaks. Both true and R explains A.`),
  asrt(3, 'Zener diode', r`A Zener diode can be used as a voltage regulator.`, r`The voltage across a Zener diode remains almost constant in reverse breakdown even when the current changes.`, 0,
    r`Both true and R is the reason for A.`),
  asrt(3, 'energy bands', r`The resistance of a semiconductor decreases as the temperature rises.`, r`More charge carriers are produced at higher temperature.`, 0,
    r`The increase in carriers outweighs the small decrease in mobility. Both true and R explains A.`),
  asrt(3, 'LED', r`A silicon diode is not used to make visible LEDs.`, r`Silicon has a large band gap of 5.5 eV, so it emits ultraviolet light.`, 2,
    r`A is true. R is false: silicon's gap is 1.1 eV and, because the gap is indirect, it emits very little light, mostly infrared. Visible LEDs use materials such as GaAsP and GaN.`),
  asrt(4, 'logic gates', r`A NAND gate is called a universal gate.`, r`Every other gate (NOT, AND, OR, NOR, XOR) can be built using NAND gates only.`, 0,
    r`Both true and R is the reason for A. NOT: join the inputs; AND: NAND then NOT; OR: NOT each input and NAND them (De Morgan).`),
  asrt(4, 'doping', r`The hole concentration of an n-type semiconductor is far below $n_i$.`, r`In equilibrium the product of electron and hole concentrations is fixed at $n_i^2$.`, 0,
    r`When $n\gg n_i$, $p = n_i^2/n\ll n_i$. R explains A.`),
  asrt(4, 'solar cell', r`A solar cell can deliver power with no external battery.`, r`Photons absorbed near the junction create electron-hole pairs which the junction field separates.`, 0,
    r`The built-in field sweeps electrons to the n side and holes to the p side, creating a voltage across the cell. Both true and R explains A.`),
  stm(2, 'diodes', r`A p-n junction diode allows current in one direction easily.`, r`The resistance of a forward biased diode is very high.`, 2,
    r`I is true. II is false: forward resistance is low, reverse resistance is high.`),
  stm(3, 'semiconductors', r`The conductivity of a semiconductor increases on doping.`, r`Doping adds charge carriers and so increases conductivity.`, 0,
    r`Both are true, and II is the reason for I.`),
  stm(3, 'Zener', r`A Zener diode is used in reverse bias for voltage regulation.`, r`In reverse breakdown the dynamic resistance of a Zener is very large.`, 2,
    r`I is true. II is false: the nearly vertical characteristic means a very small dynamic resistance $\Delta V/\Delta I$.`),
  stm(3, 'energy bands', r`At absolute zero a pure semiconductor behaves as an insulator.`, r`At 0 K the valence band is full and the conduction band is empty.`, 0,
    r`Without thermal energy no electron crosses the gap. Both true, II explains I.`),
  stm(4, 'p-n junction', r`In a p-n junction the n side is positively charged and the p side negatively charged in the depletion region.`, r`The charges in the depletion region are due to mobile charge carriers.`, 2,
    r`I is true (donor ions $+$, acceptor ions $-$). II is false: they are immobile ions.`),
  stm(4, 'logic gates', r`A NOT gate has one input and the output is the opposite of it.`, r`An OR gate followed by a NOT gate is a NOR gate.`, 0,
    r`Both true: $\overline{A+B}$ is NOR.`),
  cnt(3, 'semiconductors', r`How many of the following statements are correct?`, [
    r`Silicon is a covalent crystal.`,
    r`The forward voltage drop of a germanium diode is smaller than that of silicon.`,
    r`In n-type material, electrons are the majority carriers.`,
    r`The depletion region is free of mobile carriers.`], 4,
    r`All four are correct.`),
  cnt(4, 'logic gates', r`How many of the following statements are correct?`, [
    r`NAND is a universal gate.`,
    r`$A + A = A$ in Boolean algebra.`,
    r`$A\cdot\overline A = 1$.`,
    r`XOR gives 1 when the inputs are equal.`], 2,
    r`(1) true, (2) true (idempotent law). (3) false: $A\overline A = 0$. (4) false: XOR gives 1 when the inputs differ.`),
  mat(2, 'logic gates', 'm1', r`Match each gate with its Boolean expression.`, 'A-q, B-s, C-r, D-p', ['A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-r, B-s, C-q, D-p'],
    r`AND: $A\cdot B$; OR: $A+B$; NAND: $\overline{A\cdot B}$; NOR: $\overline{A+B}$.`),
  mat(3, 'special diodes', 'm2', r`Match each device with its operation.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-q, B-p, C-s, D-r'],
    r`LED: forward bias, light out. Photodiode: reverse bias, current changes with light. Solar cell: no bias, generates emf. Zener: reverse breakdown regulation.`),
  mat(3, 'rectifiers', 'm3', r`Match the rectifier property with its value (ideal diodes, peak input $V_m$).`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`Half-wave $V_{dc} = V_m/\pi$; full-wave $V_{dc} = 2V_m/\pi$; the full-wave ripple frequency is twice the input; the PIV of a centre-tapped full-wave rectifier is $2V_m$.`),
  mat(2, 'energy bands', 'm4', r`Match the material with its energy gap or band behaviour.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-q, B-p, C-s, D-r'],
    r`Si: 1.1 eV; Ge: 0.67 eV; diamond: 5.4 eV (insulator); copper: overlapping bands (conductor).`),
  pas(3, 'Zener regulator', 'p1', r`Find the total current through the series resistor (in mA).`, (15 - 9) / 100 * 1e3, 0.3, 0,
    r`$I_s = \dfrac{V_{in}-V_z}{R_s} = \dfrac{15-9}{100} = 0.060$ A $= 60$ mA.`, { unit: 'mA' }),
  pas(3, 'Zener regulator', 'p1', r`Find the current through the Zener diode (in mA).`, 60 - 9 / 300 * 1e3, 0.3, 0,
    r`Load current $I_L = V_z/R_L = 9/300 = 30$ mA. Zener current $I_z = 60-30 = 30$ mA.`, { unit: 'mA' }),
  pasm(4, 'Zener regulator', 'p1', r`If the load is disconnected (all else unchanged), the current through the Zener diode becomes`, '60 mA', ['30 mA', '0', '90 mA'],
    r`With no load, all of $I_s = 60$ mA must pass through the Zener. The series resistor current does not change because $V_z$ is fixed.`),
  pas(3, 'half-wave rectifier', 'p2', r`Find the average (dc) value of the output voltage (in V, 2 decimals).`, 20 / Math.PI, 0.01, 2,
    r`$V_{dc} = V_m/\pi = 20/\pi = 6.37$ V.`, { unit: 'V' }),
  pas(3, 'half-wave rectifier', 'p2', r`Find the r.m.s. value of the output voltage (in V).`, 10, 0.05, 1,
    r`$V_{rms} = V_m/2 = 10$ V.`, { unit: 'V' }),
  pasm(3, 'half-wave rectifier', 'p2', r`What is the frequency of the ripple in the output?`, '50 Hz', ['100 Hz', '25 Hz', '0 Hz'],
    r`A half-wave rectifier gives one pulse per input cycle, so the ripple has the input frequency: 50 Hz.`),
  pasm(3, 'logic circuits', 'p3', r`For $A=1$, $B=0$, $C=1$, the output $Y$ is`, '0', ['1', 'both 0 and 1', 'cannot be found without a truth table'],
    r`$A\cdot B = 0$ and $\overline C = 0$, so $Y = 0+0 = 0$.`),
  pas(3, 'logic circuits', 'p3', r`For how many of the 8 combinations of $A$, $B$, $C$ is $Y = 1$?`, 5, 0, 0,
    r`$\overline C = 1$ for $C = 0$ (4 combinations): $Y=1$ in all four. For $C = 1$, $Y = AB$, which is 1 for $A=B=1$ only. Total $4+1 = 5$.`, { unit: '' }),
  pas(4, 'logic circuits', 'p3', r`The final OR gate is replaced by an AND gate. For how many of the 8 combinations is $Y = 1$ now?`, 1, 0, 0,
    r`$Y = (A\cdot B)\cdot\overline C$ is 1 only for $A=B=1$, $C=0$: one combination.`, { unit: '' }),
];
const groups = {
  m1: { title: 'Gates and Boolean expressions',
    list1: ['A. AND', 'B. OR', 'C. NAND', 'D. NOR'],
    list2: [r`p. $Y=\overline{A+B}$`, r`q. $Y=A\cdot B$`, r`r. $Y=\overline{A\cdot B}$`, r`s. $Y=A+B$`] },
  m2: { title: 'Special diodes',
    list1: ['A. LED', 'B. Photodiode', 'C. Solar cell', 'D. Zener diode'],
    list2: ['p. Reverse bias, current rises with light', 'q. Forward bias, emits light', 'r. No bias, generates an emf', 's. Reverse breakdown, voltage regulation'] },
  m3: { title: 'Rectifiers',
    list1: ['A. Average output of a half-wave rectifier', 'B. Average output of a full-wave rectifier', 'C. Ripple frequency of a full-wave rectifier (input frequency $f$)', 'D. PIV of a centre-tapped full-wave rectifier'],
    list2: [r`p. $V_m/\pi$`, r`q. $2V_m/\pi$`, r`r. $2f$`, r`s. $2V_m$`] },
  m4: { title: 'Energy gaps',
    list1: ['A. Silicon', 'B. Germanium', 'C. Diamond', 'D. Copper'],
    list2: ['p. 0.67 eV', 'q. 1.1 eV', 'r. About 5.4 eV', 's. Bands overlap'] },
  p1: { title: 'A Zener regulator',
    passage: r`<p>A 15 V supply is joined through a $100\ \Omega$ series resistor to a 9 V Zener diode that works in reverse breakdown. A load of $300\ \Omega$ is connected across the Zener diode.</p>` },
  p2: { title: 'A half-wave rectifier',
    passage: r`<p>A half-wave rectifier uses an ideal diode and a $1\ \mathrm{k\Omega}$ load. The input is a sine wave of peak value 20 V and frequency 50 Hz.</p>` },
  p3: { title: 'A logic circuit',
    passage: r`<p>In a logic circuit, the inputs $A$ and $B$ go to an AND gate and the input $C$ goes to a NOT gate. The outputs of these two gates go to an OR gate, whose output is $Y$.</p>` },
};
const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b) };
const exp10 = (x) => Math.floor(Math.log10(Math.abs(x)));
const hwAvg = (Vm) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * 2 * Math.PI; s += Math.max(0, Vm * Math.sin(t)); } return s / n; };
const hwRms = (Vm) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * 2 * Math.PI; const v = Math.max(0, Vm * Math.sin(t)); s += v * v; } return Math.sqrt(s / n); };
const fwAvg = (Vm, drop = 0) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * 2 * Math.PI; s += Math.max(0, Math.abs(Vm * Math.sin(t)) - drop); } return s / n; };
const fwRms = (Vm) => { let s = 0; const n = 20000; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n * 2 * Math.PI; s += (Vm * Math.sin(t)) ** 2; } return Math.sqrt(s / n); };
const gens = [
  { id: 'sc-g01', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'carrier concentrations',
    make(rng) {
      const mat = choose(rng, [['silicon', 1.5e16, [1e21, 1e22, 5e22]], ['germanium', 2.4e19, [1e22, 1e23, 5e23]]]); const [nm, ni, dop] = mat; const D = choose(rng, dop); const v = int(rng, 0, 2);
      const m = ni * ni / D; const e = exp10(m);
      if (v === 0) return { nm, ni, D, v, e, m, q: `${nm[0].toUpperCase() + nm.slice(1)} ($n_i = ${tx(ni, 2)}\\ \\mathrm{m^{-3}}$) is doped with donors so that $n = ${tx(D, 2)}\\ \\mathrm{m^{-3}}$. Find the hole concentration (in units of $10^{${e}}\\ \\mathrm{m^{-3}}$, 2 decimals).`, answer: N(m / 10 ** e, 2), tol: 0.01 * m / 10 ** e + 0.01, unit: `1e${e} /m^3`, sol: `$p = \\dfrac{n_i^2}{n} = \\dfrac{(${tx(ni, 2)})^2}{${tx(D, 2)}} = ${tx(m, 3)}\\ \\mathrm{m^{-3}}$.` };
      if (v === 1) return { nm, ni, D, v, e, m, q: `${nm[0].toUpperCase() + nm.slice(1)} ($n_i = ${tx(ni, 2)}\\ \\mathrm{m^{-3}}$) is doped with acceptors so that $p = ${tx(D, 2)}\\ \\mathrm{m^{-3}}$. Find the electron concentration (in units of $10^{${e}}\\ \\mathrm{m^{-3}}$, 2 decimals).`, answer: N(m / 10 ** e, 2), tol: 0.01 * m / 10 ** e + 0.01, unit: `1e${e} /m^3`, sol: `$n = \\dfrac{n_i^2}{p} = \\dfrac{(${tx(ni, 2)})^2}{${tx(D, 2)}} = ${tx(m, 3)}\\ \\mathrm{m^{-3}}$.` };
      const ee = exp10(ni); return { nm, ni, D, v, e, m, ee, q: `In a sample of ${nm}, $n = ${tx(D, 2)}\\ \\mathrm{m^{-3}}$ and $p = ${tx(m, 3)}\\ \\mathrm{m^{-3}}$. Find the intrinsic concentration $n_i$ (in units of $10^{${ee}}\\ \\mathrm{m^{-3}}$, 2 decimals).`, answer: N(ni / 10 ** ee, 2), tol: 0.01 * ni / 10 ** ee + 0.01, unit: `1e${ee} /m^3`, sol: `$n_i = \\sqrt{np} = \\sqrt{${tx(D, 2)}\\times${tx(m, 3)}} = ${tx(ni, 3)}\\ \\mathrm{m^{-3}}$.` };
    },
    verify: (p) => { if (p.v < 2) return (p.ni ** 2 / p.D) / 10 ** p.e; return Math.sqrt(p.D * p.m) / 10 ** p.ee; } },
  { id: 'sc-g02', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'conductivity',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const [nm, ni, me, mh] = choose(rng, [['silicon', 1.5e16, 0.135, 0.048], ['germanium', 2.4e19, 0.39, 0.19]]); const s = QEL * ni * (me + mh); return { ni, me, mh, v, ex: exp10(s), q: `Intrinsic ${nm} has $n_i = ${tx(ni, 2)}\\ \\mathrm{m^{-3}}$, electron mobility ${me} and hole mobility ${mh} $\\mathrm{m^2V^{-1}s^{-1}}$. Find its conductivity (in ${exp10(s) === 0 ? '$\\mathrm{S\\,m^{-1}}$' : 'units of $10^{' + exp10(s) + '}\\ \\mathrm{S\\,m^{-1}}$'}, 2 decimals). $e = 1.6\\times10^{-19}$ C.`, answer: N(s / 10 ** exp10(s), 2), tol: 0.01 * s / 10 ** exp10(s) + 0.01, unit: `1e${exp10(s)} S/m`, sol: `$\\sigma = en_i(\\mu_e+\\mu_h) = 1.6\\times10^{-19}\\times${tx(ni, 2)}\\times${S(me + mh, 3)} = ${S(s, 4)}\\ \\mathrm{S\\,m^{-1}}$.` }; }
      if (v === 1) { const ND = choose(rng, [1e20, 1e21, 1e22]); const s = QEL * ND * 0.135; return { ND, v, q: `Silicon is doped with $${tx(ND, 2)}\\ \\mathrm{m^{-3}}$ donors (electron mobility $0.135\\ \\mathrm{m^2V^{-1}s^{-1}}$). Neglecting the holes, find the conductivity (in $\\mathrm{S\\,m^{-1}}$, 2 decimals). $e = 1.6\\times10^{-19}$ C.`, answer: N(s, 2), tol: 0.01 * s + 0.01, unit: 'S/m', sol: `$\\sigma\\approx eN_D\\mu_e = 1.6\\times10^{-19}\\times${tx(ND, 2)}\\times0.135 = ${S(s, 4)}\\ \\mathrm{S\\,m^{-1}}$.` }; }
      const sg = choose(rng, [10, 20, 50, 100]); const L = choose(rng, [1, 2, 5]); const A = choose(rng, [1, 2, 4]); const R = (L * 1e-2) / (sg * A * 1e-6);
      return { sg, L, A, v, q: `A bar of a doped semiconductor has a conductivity of ${sg} $\\mathrm{S\\,m^{-1}}$, a length of ${L} cm and a cross-section of ${A} $\\mathrm{mm^2}$. Find its resistance (in $\\Omega$, 1 decimal).`, answer: N(R, 1), tol: 0.01 * R + 0.05, unit: 'ohm', sol: `$R = \\dfrac{L}{\\sigma A} = \\dfrac{${L}\\times10^{-2}}{${sg}\\times${A}\\times10^{-6}} = ${S(R, 4)}\\ \\Omega$.` };
    },
    verify: (p) => { if (p.v === 0) return (QEL * p.ni * p.me + QEL * p.ni * p.mh) / 10 ** p.ex; if (p.v === 1) return 1 / (1 / (QEL * p.ND * 0.135)); const rho = 1 / p.sg; return rho * (p.L * 1e-2) / (p.A * 1e-6); } },
  { id: 'sc-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'diode circuits',
    make(rng) {
      const V = choose(rng, [3, 5, 6, 9, 12]); const R = choose(rng, [220, 330, 470, 1000, 2200]); const v = int(rng, 0, 2);
      if (v === 0) { const I = (V - 0.7) / R * 1e3; return { V, R, v, q: `A silicon diode (drop 0.7 V) is forward biased in series with a ${R} $\\Omega$ resistor and a ${V} V battery. Find the current (in mA, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'mA', sol: `$I = \\dfrac{V-V_D}{R} = \\dfrac{${V}-0.7}{${R}} = ${S(I / 1e3, 4)}$ A $= ${S(I, 4)}$ mA.` }; }
      if (v === 1) { const I = choose(rng, [5, 10, 20]); const Rx = (V - 0.7) / (I * 1e-3); return { V, I, v, q: `A silicon diode (drop 0.7 V) is to carry ${I} mA from a ${V} V battery through a series resistor. Find the resistor needed (in $\\Omega$, nearest integer).`, answer: Math.round(Rx), tol: 0.01 * Rx + 1, unit: 'ohm', sol: `$R = \\dfrac{V-V_D}{I} = \\dfrac{${V}-0.7}{${I}\\times10^{-3}} = ${S(Rx, 4)}\\ \\Omega$.` }; }
      const I = (V - 1.4) / R * 1e3; return { V, R, v, q: `Two silicon diodes (0.7 V each) are in series with each other (both forward) and with a ${R} $\\Omega$ resistor across a ${V} V battery. Find the current (in mA, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'mA', sol: `Total diode drop $= 1.4$ V. $I = \\dfrac{${V}-1.4}{${R}} = ${S(I, 4)}$ mA.`, trap: 'Two diodes in series drop 1.4 V.' };
    },
    verify: (p) => { if (p.v === 0) return (p.V - 0.7) / p.R * 1000; if (p.v === 1) return Math.round((p.V - 0.7) / p.I * 1000); return (p.V - 0.7 - 0.7) / p.R * 1000; } },
  { id: 'sc-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'diodes in parallel',
    make(rng) {
      const V = choose(rng, [3.7, 5, 9, 12]); const R = choose(rng, [330, 470, 1000]); const v = int(rng, 0, 2); const k = choose(rng, [2, 3]);
      if (v === 0) { const I = (V - 0.7) / R / k * 1e3; return { V, R, k, v, q: `${k} identical silicon diodes (0.7 V drop) are in parallel, all forward biased, in series with a ${R} $\\Omega$ resistor and a ${V} V battery. Find the current in one diode (in mA, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'mA', sol: `The parallel group has one 0.7 V drop. Resistor current $= \\dfrac{${V}-0.7}{${R}} = ${S((V - 0.7) / R * 1e3, 4)}$ mA, shared equally by ${k} diodes: ${S(I, 4)} mA each.`, trap: 'Parallel diodes share one voltage drop; do not subtract 0.7 for each.' }; }
      if (v === 1) { const I = (V - 0.3) / R * 1e3; return { V, R, v, q: `A germanium diode (0.3 V) and a silicon diode (0.7 V) are in parallel, both forward biased, in series with a ${R} $\\Omega$ resistor and a ${V} V battery. Find the total current (in mA, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'mA', sol: `The Ge diode turns on first and holds the pair at 0.3 V, so the Si diode stays off. $I = \\dfrac{${V}-0.3}{${R}} = ${S(I, 4)}$ mA.`, trap: 'The lower-drop diode dominates in parallel.' }; }
      const Vd = choose(rng, [0.7, 0.3]); const I = (V - Vd) / R * 1e3; return { V, R, Vd, v, q: `A ${V} V battery, a ${R} $\\Omega$ resistor and a forward-biased ${Vd === 0.7 ? 'silicon (0.7 V)' : 'germanium (0.3 V)'} diode are in series, and another ideal diode is connected across the first one with the opposite polarity (reverse biased). Find the current (in mA, 2 decimals).`, answer: N(I, 2), tol: 0.01 * I + 0.01, unit: 'mA', sol: `The reverse-connected diode is blocked (it sees the forward drop in reverse). $I = \\dfrac{${V}-${Vd}}{${R}} = ${S(I, 4)}$ mA.` };
    },
    verify: (p) => { if (p.v === 0) return (p.V - 0.7) * 1000 / p.R / p.k; if (p.v === 1) return Math.max(0, (p.V - Math.min(0.3, 0.7))) / p.R * 1000; return (p.V - p.Vd) / p.R * 1000; } },
  { id: 'sc-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'half-wave rectifier',
    make(rng) {
      const v = int(rng, 0, 2); const Vm = choose(rng, [5, 10, 12, 20, 24]); const rms = choose(rng, [6, 9, 12, 18]);
      if (v === 0) { const a = Vm / Math.PI; return { Vm, v, q: `A half-wave rectifier (ideal diode) is fed with a sine wave of peak ${Vm} V. Find the average output voltage (in V, 2 decimals).`, answer: N(a, 2), tol: 0.01, unit: 'V', sol: `$V_{dc} = V_m/\\pi = ${Vm}/\\pi = ${S(a, 4)}$ V.` }; }
      if (v === 1) { const r = Vm / 2; return { Vm, v, q: `A half-wave rectifier (ideal diode) is fed with a sine wave of peak ${Vm} V. Find the r.m.s. value of the output voltage (in V, 2 decimals).`, answer: N(r, 2), tol: 0.01, unit: 'V', sol: `$V_{rms} = V_m/2 = ${Vm}/2 = ${S(r, 3)}$ V.`, trap: 'Half-wave rectified: Vm/2, not Vm/sqrt 2.' }; }
      const Vp = rms * Math.SQRT2; const a = (Vp - 0.7) / Math.PI; return { rms, v, q: `The secondary of a transformer gives ${rms} V r.m.s. to a half-wave rectifier with a silicon diode (drop 0.7 V). Estimate the average output voltage using $(V_m-0.7)/\\pi$ (in V, 2 decimals).`, answer: N(a, 2), tol: 0.02, unit: 'V', sol: `Peak $V_m = ${rms}\\sqrt2 = ${S(Vp, 4)}$ V. $V_{dc}\\approx\\dfrac{${S(Vp, 4)}-0.7}{\\pi} = ${S(a, 4)}$ V.`, trap: 'Convert r.m.s. to peak first.' };
    },
    verify: (p) => { if (p.v === 0) return hwAvg(p.Vm); if (p.v === 1) return hwRms(p.Vm); return (p.rms * Math.SQRT2 - 0.7) / Math.PI; } },
  { id: 'sc-g06', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'full-wave rectifier',
    make(rng) {
      const v = int(rng, 0, 2); const Vm = choose(rng, [5, 10, 12, 20, 24]);
      if (v === 0) { const a = 2 * Vm / Math.PI; return { Vm, v, q: `A full-wave rectifier (ideal diodes) is fed with a sine wave of peak ${Vm} V. Find the average output voltage (in V, 2 decimals).`, answer: N(a, 2), tol: 0.01, unit: 'V', sol: `$V_{dc} = 2V_m/\\pi = ${2 * Vm}/\\pi = ${S(a, 4)}$ V.` }; }
      if (v === 1) { const r = Vm / Math.SQRT2; return { Vm, v, q: `A full-wave rectifier (ideal diodes) is fed with a sine wave of peak ${Vm} V. Find the r.m.s. value of its output (in V, 2 decimals).`, answer: N(r, 2), tol: 0.01, unit: 'V', sol: `$V_{rms} = V_m/\\sqrt2 = ${Vm}/1.414 = ${S(r, 4)}$ V.` }; }
      const a = 2 * (Vm - 1.4) / Math.PI; return { Vm, v, q: `A bridge rectifier with silicon diodes (0.7 V each) is fed with a sine wave of peak ${Vm} V. Estimate the average output voltage using $2(V_m-1.4)/\\pi$ (in V, 2 decimals).`, answer: N(a, 2), tol: 0.02, unit: 'V', sol: `Two diodes conduct at once: peak output $= ${Vm}-1.4 = ${S(Vm - 1.4, 4)}$ V. $V_{dc}\\approx\\dfrac{2\\times${S(Vm - 1.4, 4)}}{\\pi} = ${S(a, 4)}$ V.` };
    },
    verify: (p) => { if (p.v === 0) return fwAvg(p.Vm); if (p.v === 1) return fwRms(p.Vm); return fwAvg(p.Vm - 1.4); } },
  { id: 'sc-g07', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'rectifier basics',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const f = choose(rng, [50, 60]); const t = choose(rng, ['half-wave', 'full-wave']); const fr = t === 'half-wave' ? f : 2 * f; return { f, t, v, q: `The mains frequency is ${f} Hz. Find the frequency of the ripple at the output of a ${t} rectifier (in Hz).`, answer: fr, tol: 0, unit: 'Hz', sol: t === 'half-wave' ? `One pulse per input cycle: ${f} Hz.` : `Two pulses per input cycle: $2\\times${f} = ${2 * f}$ Hz.` }; }
      if (v === 1) { const Vm = choose(rng, [5, 10, 12, 15, 20]); const t = choose(rng, ['half-wave', 'centre-tapped full-wave', 'bridge']); const piv = t === 'centre-tapped full-wave' ? 2 * Vm : Vm; return { Vm, t, v, q: `A ${t} rectifier works from a secondary whose peak voltage across each half-winding (across the whole winding for the other two types) is ${Vm} V. Find the peak inverse voltage each diode must withstand (in V).`, answer: piv, tol: 0, unit: 'V', sol: t === 'centre-tapped full-wave' ? `In the centre-tap circuit the off diode sees both halves in series: $2V_m = ${2 * Vm}$ V.` : `The off diode sees one peak value: $V_m = ${Vm}$ V.`, trap: 'Only the centre-tapped circuit needs 2Vm.' }; }
      const Vdc = choose(rng, [4, 5, 6, 8]); const ac = choose(rng, [0.4, 0.6, 1, 2]); const r = ac / Vdc; return { Vdc, ac, v, q: `The output of a rectifier has a d.c. voltage of ${Vdc} V and an r.m.s. a.c. ripple voltage of ${ac} V. Find the ripple factor (2 decimals).`, answer: N(r, 2), tol: 0.01, unit: '', sol: `$r = \\dfrac{V_{ac,rms}}{V_{dc}} = \\dfrac{${ac}}{${Vdc}} = ${S(r, 3)}$.` };
    },
    verify: (p) => { if (p.v === 0) return p.t === 'half-wave' ? p.f : p.f * 2; if (p.v === 1) return p.t === 'centre-tapped full-wave' ? p.Vm + p.Vm : p.Vm; return p.ac / p.Vdc; } },
  { id: 'sc-g08', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'Zener regulator',
    make(rng) {
      const Vz = choose(rng, [5.1, 6, 9, 12]); const Vin = Vz + choose(rng, [4, 6, 8, 10]); const Rs = choose(rng, [100, 200, 250]); const RL = choose(rng, [300, 600, 1000]); const v = int(rng, 0, 2);
      const Is = (Vin - Vz) / Rs * 1e3; const IL = Vz / RL * 1e3; const Iz = Is - IL;
      if (Iz <= 1) return this.make(rng);
      if (v === 0) return { Vz, Vin, Rs, RL, v, q: `A ${Vin} V supply feeds a ${Vz} V Zener diode (reverse breakdown) through ${Rs} $\\Omega$. A load of ${RL} $\\Omega$ is connected across the Zener. Find the current in the Zener (in mA, 2 decimals).`, answer: N(Iz, 2), tol: 0.01 * Iz + 0.02, unit: 'mA', sol: `$I_s = \\dfrac{${Vin}-${Vz}}{${Rs}} = ${S(Is, 4)}$ mA. $I_L = \\dfrac{${Vz}}{${RL}} = ${S(IL, 4)}$ mA. $I_z = I_s - I_L = ${S(Iz, 4)}$ mA.` };
      if (v === 1) return { Vz, Vin, Rs, RL, v, q: `A ${Vin} V supply feeds a ${Vz} V Zener diode (reverse breakdown) through ${Rs} $\\Omega$. A load of ${RL} $\\Omega$ is connected across the Zener. Find the current in the load (in mA, 2 decimals).`, answer: N(IL, 2), tol: 0.01 * IL + 0.02, unit: 'mA', sol: `The load is across the Zener, so its voltage is $V_z$: $I_L = V_z/R_L = ${Vz}/${RL} = ${S(IL, 4)}$ mA.` };
      const P = Vz * Iz; return { Vz, Vin, Rs, RL, v, q: `A ${Vin} V supply feeds a ${Vz} V Zener diode (reverse breakdown) through ${Rs} $\\Omega$. A load of ${RL} $\\Omega$ is connected across the Zener. Find the power dissipated in the Zener (in mW, 1 decimal).`, answer: N(P, 1), tol: 0.01 * P + 0.1, unit: 'mW', sol: `$I_z = ${S(Iz, 4)}$ mA (series current minus load current). $P = V_zI_z = ${Vz}\\times${S(Iz, 4)} = ${S(P, 4)}$ mW.` };
    },
    verify: (p) => { const Is = (p.Vin - p.Vz) / p.Rs * 1e3; const IL = p.Vz / p.RL * 1e3; if (p.v === 0) return Is - IL; if (p.v === 1) return IL; return p.Vz * (Is - IL); } },
  { id: 'sc-g09', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'Zener limits',
    make(rng) {
      const Vz = choose(rng, [5.6, 9, 12]); const Rs = choose(rng, [100, 150, 200]); const IL = choose(rng, [10, 20, 30]); const Izmin = choose(rng, [5, 10]); const Izmax = choose(rng, [40, 60, 80]); const v = int(rng, 0, 2);
      if (v === 0) { const V = Vz + Rs * (Izmax + IL) * 1e-3; return { Vz, Rs, IL, Izmax, v, q: `A Zener regulator has $V_z = ${Vz}$ V, $R_s = ${Rs}\\ \\Omega$ and a load drawing ${IL} mA. The Zener current must not exceed ${Izmax} mA. Find the largest input voltage allowed (in V, 2 decimals).`, answer: N(V, 2), tol: 0.02, unit: 'V', sol: `$I_s = I_z+I_L = ${Izmax}+${IL} = ${Izmax + IL}$ mA. $V_{in,max} = V_z + R_sI_s = ${Vz} + ${Rs}\\times${(Izmax + IL) / 1000} = ${S(V, 4)}$ V.` }; }
      if (v === 1) { const V = Vz + Rs * (Izmin + IL) * 1e-3; return { Vz, Rs, IL, Izmin, v, q: `A Zener regulator has $V_z = ${Vz}$ V, $R_s = ${Rs}\\ \\Omega$ and a load drawing ${IL} mA. The Zener needs at least ${Izmin} mA to regulate. Find the smallest input voltage allowed (in V, 2 decimals).`, answer: N(V, 2), tol: 0.02, unit: 'V', sol: `$I_s = ${Izmin}+${IL} = ${Izmin + IL}$ mA. $V_{in,min} = ${Vz} + ${Rs}\\times${(Izmin + IL) / 1000} = ${S(V, 4)}$ V.` }; }
      const Vin = Vz + Rs * choose(rng, [40, 60, 80]) * 1e-3; const Is = (Vin - Vz) / Rs; const RLm = Vz / (Is - Izmin * 1e-3);
      return { Vz, Rs, Vin, Izmin, v, q: `A Zener regulator has $V_{in} = ${S(Vin, 4)}$ V, $R_s = ${Rs}\\ \\Omega$ and $V_z = ${Vz}$ V. The Zener needs at least ${Izmin} mA. Find the smallest load resistance that can be used (in $\\Omega$, nearest integer).`, answer: Math.round(RLm), tol: 0.01 * RLm + 1, unit: 'ohm', sol: `$I_s = \\dfrac{${S(Vin, 4)}-${Vz}}{${Rs}} = ${S(Is * 1e3, 4)}$ mA. Largest load current $= ${S(Is * 1e3, 4)}-${Izmin} = ${S(Is * 1e3 - Izmin, 4)}$ mA. $R_{L,min} = \\dfrac{${Vz}}{${S((Is * 1e3 - Izmin) / 1000, 4)}} = ${S(RLm, 4)}\\ \\Omega$.`, trap: 'More load current needs a smaller resistance, so the limit is a minimum.' };
    },
    verify: (p) => { if (p.v === 0) return p.Vz + p.Rs * (p.Izmax + p.IL) / 1000; if (p.v === 1) return p.Vz + p.Rs * (p.Izmin + p.IL) / 1000; const Is = (p.Vin - p.Vz) / p.Rs; return p.Vz / (Is - p.Izmin / 1000); } },
  { id: 'sc-g10', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'logic gates',
    make(rng) {
      const v = int(rng, 0, 2); const names = Object.keys(GATES);
      if (v === 0) { const g = choose(rng, names); const seq = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => GATES[g](a, b)); const others = names.filter((x) => x !== g); const wr = []; while (wr.length < 3) { const x = choose(rng, others); if (!wr.includes(x)) wr.push(x); } const o = shuffleOpts(rng, g, wr);
        return { g, seq, ...o, q: `For the inputs $A = 0,0,1,1$ and $B = 0,1,0,1$ the output of a two-input gate is $Y = ${seq.join(',')}$. The gate is`, sol: `Compare with the truth tables: ${g} gives ${seq.join(', ')}.` }; }
      if (v === 1) { const exprs = [['(A+B)\\cdot C', (a, b, c) => (a | b) & c], ['A\\cdot B+C', (a, b, c) => (a & b) | c], ['\\overline{A\\cdot B}\\cdot C', (a, b, c) => (1 - (a & b)) & c], ['\\overline{A+B}+C', (a, b, c) => (1 - (a | b)) | c], ['A\\cdot\\overline{B}+\\overline{A}\\cdot C', (a, b, c) => (a & (1 - b)) | ((1 - a) & c)], ['(A\\oplus B)\\cdot C', (a, b, c) => (a ^ b) & c]];
        const [tx0, f] = choose(rng, exprs); let k = 0; for (let m = 0; m < 8; m++) k += f((m >> 2) & 1, (m >> 1) & 1, m & 1);
        const cand = [8 - k, k + 1, k - 1, k + 2, k - 2, 4, 2, 6].filter((x, i, a) => x !== k && x >= 0 && x <= 8 && a.indexOf(x) === i); const wr = cand.slice(0, 3).map(String); const o = shuffleOpts(rng, String(k), wr);
        return { tx0, k, ...o, q: `For how many of the 8 combinations of $A, B, C$ is $Y = ${tx0}$ equal to 1?`, sol: `Work through the 8 rows: the output is 1 in ${k} of them.` }; }
      const g = choose(rng, ['NAND', 'NOR', 'AND', 'OR', 'XOR', 'XNOR']); const res = { NAND: 'Y = NOT A', NOR: 'Y = NOT A', AND: 'Y = A (output follows the input)', OR: 'Y = A (output follows the input)', XOR: 'Y = 0 always', XNOR: 'Y = 1 always' }[g];
      const all = ['Y = NOT A', 'Y = A (output follows the input)', 'Y = 0 always', 'Y = 1 always']; const o = shuffleOpts(rng, res, all.filter((x) => x !== res));
      return { g, res, ...o, q: `The two inputs of a ${g} gate are joined together to a single input $A$. The output is`, sol: `With $B = A$: ${g}$(A,A)$ gives ${res}. (Check $A=0$ and $A=1$ in the truth table.)` };
    },
    verify: (p) => { if (p.seq) { const hit = Object.keys(GATES).filter((g) => [[0, 0], [0, 1], [1, 0], [1, 1]].every(([a, b], i) => GATES[g](a, b) === p.seq[i])); return p.options.indexOf(hit[0]); } if (p.k !== undefined) return p.options.indexOf(String(p.k)); const t = [0, 1].map((a) => GATES[p.g](a, a)); const r = t[0] === 1 && t[1] === 0 ? 'Y = NOT A' : t[0] === 0 && t[1] === 1 ? 'Y = A (output follows the input)' : t[0] === 0 ? 'Y = 0 always' : 'Y = 1 always'; return p.options.indexOf(r); } },
  { id: 'sc-g11', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'universal gates',
    make(rng) {
      const useNand = int(rng, 0, 1) === 0;
      const tgtN = ['NOT', 'AND', 'OR', 'NOR', 'XOR', 'XNOR']; const tgtR = ['NOT', 'OR', 'AND', 'NAND', 'XNOR'];
      const g = choose(rng, useNand ? tgtN : tgtR); const cnt = useNand ? { NOT: 1, AND: 2, OR: 3, NOR: 4, XOR: 4, XNOR: 5 }[g] : { NOT: 1, OR: 2, AND: 3, NAND: 4, XNOR: 4 }[g];
      const how = { 'NAND:NOT': 'Join the two inputs of one NAND gate.', 'NAND:AND': 'NAND followed by a NAND with joined inputs (NOT).', 'NAND:OR': 'Invert each input with a NAND (joined inputs), then feed both into a third NAND: $\\overline{\\overline A\\cdot\\overline B} = A+B$.', 'NAND:NOR': 'The 3-gate OR followed by a NOT made from a fourth NAND.', 'NAND:XOR': 'With $N = \\overline{AB}$: $Y = \\overline{\\overline{AN}\\cdot\\overline{BN}}$, which uses 4 gates.', 'NAND:XNOR': 'An XOR (4 gates) followed by a NOT (1 gate).', 'NOR:NOT': 'Join the two inputs of one NOR gate.', 'NOR:OR': 'NOR followed by a NOR with joined inputs.', 'NOR:AND': 'Invert each input with a NOR (joined inputs), then NOR them: $\\overline{\\overline A+\\overline B} = AB$.', 'NOR:NAND': 'The 3-gate AND followed by a NOT made from a fourth NOR.', 'NOR:XNOR': 'With $N = \\overline{A+B}$: $Y = \\overline{\\overline{A+N}+\\overline{B+N}}$, which uses 4 gates.' }[`${useNand ? 'NAND' : 'NOR'}:${g}`];
      return { useNand, g, cnt, q: `What is the smallest number of 2-input ${useNand ? 'NAND' : 'NOR'} gates needed to build one ${g} gate?`, answer: cnt, tol: 0, unit: '', sol: `${how} The minimum is ${cnt} gate${cnt > 1 ? 's' : ''}.` };
    },
    verify: (p) => {
      // build the circuit and check the truth table by simulation
      const NAND = (a, b) => 1 - (a & b); const NOR = (a, b) => 1 - (a | b); const U = p.useNand ? NAND : NOR; const NOTc = (a) => U(a, a);
      const circ = p.useNand ? {
        NOT: [1, (a) => NOTc(a)], AND: [2, (a, b) => NOTc(U(a, b))], OR: [3, (a, b) => U(NOTc(a), NOTc(b))], NOR: [4, (a, b) => NOTc(U(NOTc(a), NOTc(b)))],
        XOR: [4, (a, b) => { const n = U(a, b); return U(U(a, n), U(b, n)); }], XNOR: [5, (a, b) => { const n = U(a, b); return NOTc(U(U(a, n), U(b, n))); }],
      } : {
        NOT: [1, (a) => NOTc(a)], OR: [2, (a, b) => NOTc(U(a, b))], AND: [3, (a, b) => U(NOTc(a), NOTc(b))], NAND: [4, (a, b) => NOTc(U(NOTc(a), NOTc(b)))],
        XNOR: [4, (a, b) => { const n = U(a, b); return U(U(a, n), U(b, n)); }],
      };
      const [c, f] = circ[p.g]; const ok = [[0, 0], [0, 1], [1, 0], [1, 1]].every(([a, b]) => f(a, b) === ({ ...GATES, NOT: (x) => 1 - x })[p.g](a, b)); return ok ? c : -1; } },
  { id: 'sc-g12', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'LED and photodiode',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const E = choose(rng, [1.8, 1.9, 2.1, 2.4, 2.6, 3.1]); const l = 1240 / E; return { E, v, q: `An LED emits photons of energy equal to the band gap, ${E} eV. Find the wavelength of its light (in nm, nearest integer; $hc = 1240$ eV nm).`, answer: Math.round(l), tol: 0.01 * l + 1, unit: 'nm', sol: `$\\lambda = \\dfrac{1240}{${E}} = ${S(l, 4)}$ nm.` }; }
      if (v === 1) { const l = choose(rng, [450, 520, 590, 620, 700]); const E = 1240 / l; return { l, v, q: `An LED emits light of wavelength ${l} nm. Find the band gap of the semiconductor, taking the photon energy equal to the gap (in eV, 2 decimals; $hc = 1240$ eV nm).`, answer: N(E, 2), tol: 0.02, unit: 'eV', sol: `$E_g = \\dfrac{hc}{\\lambda} = \\dfrac{1240}{${l}} = ${S(E, 4)}$ eV.` }; }
      const [nm, E] = choose(rng, [['silicon', 1.1], ['germanium', 0.67], ['gallium arsenide', 1.43]]); const l = 1240 / E; return { nm, E, v, q: `Find the longest wavelength of light that a ${nm} photodiode (band gap ${E} eV) can detect (in nm, nearest integer; $hc = 1240$ eV nm).`, answer: Math.round(l), tol: 0.01 * l + 1, unit: 'nm', sol: `A photon needs $E\\ge E_g$: $\\lambda_{max} = \\dfrac{1240}{${E}} = ${S(l, 4)}$ nm.` };
    },
    verify: (p) => { const hc = 6.626e-34 * 2.998e8 / 1.602e-19 * 1e9; if (p.v === 0) return Math.round(hc / p.E); if (p.v === 1) return hc / p.l; return Math.round(hc / p.E); } },
  { id: 'sc-g13', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LED circuit',
    make(rng) {
      const Vs = choose(rng, [3, 5, 9, 12]); const VF = choose(rng, [1.8, 2, 2.2, 3.1]); const I = choose(rng, [10, 15, 20, 25]); const v = int(rng, 0, 2);
      if (VF >= Vs - 0.5) return this.make(rng);
      const R = (Vs - VF) / (I * 1e-3);
      if (v === 0) return { Vs, VF, I, v, q: `An LED with a forward drop of ${VF} V is to carry ${I} mA from a ${Vs} V supply. Find the series resistor (in $\\Omega$, nearest integer).`, answer: Math.round(R), tol: 0.01 * R + 1, unit: 'ohm', sol: `$R = \\dfrac{V_s-V_F}{I} = \\dfrac{${Vs}-${VF}}{${I}\\times10^{-3}} = ${S(R, 4)}\\ \\Omega$.` };
      if (v === 1) { const Rs = choose(rng, [100, 150, 220, 330]); const Ix = (Vs - VF) / Rs * 1e3; return { Vs, VF, Rs, v, q: `An LED with a forward drop of ${VF} V is run from a ${Vs} V supply through ${Rs} $\\Omega$. Find the current (in mA, 1 decimal).`, answer: N(Ix, 1), tol: 0.01 * Ix + 0.05, unit: 'mA', sol: `$I = \\dfrac{${Vs}-${VF}}{${Rs}} = ${S(Ix, 4)}$ mA.` }; }
      const P = (Vs - VF) * I; return { Vs, VF, I, v, q: `An LED with a forward drop of ${VF} V carries ${I} mA from a ${Vs} V supply through a series resistor. Find the power dissipated in the resistor (in mW, 1 decimal).`, answer: N(P, 1), tol: 0.01 * P + 0.05, unit: 'mW', sol: `Voltage across the resistor $= ${Vs}-${VF} = ${S(Vs - VF, 3)}$ V. $P = VI = ${S(Vs - VF, 3)}\\times${I}\\ \\mathrm{mA} = ${S(P, 4)}$ mW.` };
    },
    verify: (p) => { if (p.v === 0) return Math.round((p.Vs - p.VF) / (p.I / 1000)); if (p.v === 1) return (p.Vs - p.VF) / p.Rs * 1000; const R = (p.Vs - p.VF) / (p.I / 1000); return (p.I / 1000) ** 2 * R * 1000; } },
  { id: 'sc-g14', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'photodiode current',
    make(rng) {
      const l = choose(rng, [500, 650, 800, 900]); const eta = choose(rng, [0.4, 0.5, 0.6, 0.8]); const P = choose(rng, [0.5, 1, 2, 5]) * 1e-3; const v = int(rng, 0, 2);
      const R = eta * l * 1e-9 * QEL / HC;
      if (v === 0) { const I = R * P * 1e3; return { l, eta, P, v, q: `A photodiode of quantum efficiency ${eta} receives ${S(P * 1e3)} mW of light of wavelength ${l} nm. Find the photocurrent (in mA, 3 decimals). $e = 1.6\\times10^{-19}$ C, $hc = 1.986\\times10^{-25}$ J m.`, answer: N(I, 3), tol: 0.01 * I + 0.002, unit: 'mA', sol: `Photons per second $= \\dfrac{P\\lambda}{hc} = \\dfrac{${S(P)}\\times${l}\\times10^{-9}}{1.986\\times10^{-25}} = ${tx(P * l * 1e-9 / HC)}$. Current $= \\eta\\times\\text{rate}\\times e = ${S(I, 4)}$ mA.` }; }
      if (v === 1) return { l, eta, v, q: `A photodiode of quantum efficiency ${eta} is used at ${l} nm. Find its responsivity (photocurrent per unit optical power, in $\\mathrm{A\\,W^{-1}}$, 3 decimals). $e = 1.6\\times10^{-19}$ C, $hc = 1.986\\times10^{-25}$ J m.`, answer: N(R, 3), tol: 0.01 * R + 0.002, unit: 'A/W', sol: `$\\mathcal R = \\dfrac{\\eta e\\lambda}{hc} = \\dfrac{${eta}\\times1.6\\times10^{-19}\\times${l}\\times10^{-9}}{1.986\\times10^{-25}} = ${S(R, 4)}\\ \\mathrm{A\\,W^{-1}}$.` };
      const I = choose(rng, [0.1, 0.2, 0.5]) * 1e-3; const Pn = I / R * 1e3; return { l, eta, I, v, q: `A photodiode of quantum efficiency ${eta} gives ${S(I * 1e3)} mA at ${l} nm. Find the optical power falling on it (in mW, 2 decimals). $e = 1.6\\times10^{-19}$ C, $hc = 1.986\\times10^{-25}$ J m.`, answer: N(Pn, 2), tol: 0.01 * Pn + 0.01, unit: 'mW', sol: `Responsivity $= \\dfrac{\\eta e\\lambda}{hc} = ${S(R, 4)}\\ \\mathrm{A\\,W^{-1}}$. $P = I/\\mathcal R = \\dfrac{${S(I)}}{${S(R, 4)}} = ${S(Pn / 1e3, 4)}$ W $= ${S(Pn, 4)}$ mW.` };
    },
    verify: (p) => { const Rr = p.eta * (p.l * 1e-9) * QEL / HC; if (p.v === 0) { const rate = p.P * p.l * 1e-9 / HC; return p.eta * rate * QEL * 1e3; } if (p.v === 1) return p.eta * p.l * 1e-9 * QEL / HC; const rate = p.I / (p.eta * QEL); return rate * HC / (p.l * 1e-9) * 1e3; } },
  { id: 'sc-g15', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'solar cell',
    make(rng) {
      const Voc = choose(rng, [0.5, 0.6, 0.65]); const Isc = choose(rng, [1, 2, 3, 5]); const FF = choose(rng, [0.7, 0.75, 0.8]); const A = choose(rng, [0.01, 0.02, 0.05]); const I0 = choose(rng, [800, 1000]); const v = int(rng, 0, 2);
      const Pm = Voc * Isc * FF; const eff = Pm / (I0 * A) * 100;
      if (v === 0) return { Voc, Isc, FF, v, q: `A solar cell has an open-circuit voltage of ${Voc} V, a short-circuit current of ${Isc} A and a fill factor of ${FF}. Find its maximum output power (in W, 3 decimals).`, answer: N(Pm, 3), tol: 0.005, unit: 'W', sol: `$P_{max} = V_{oc}I_{sc}\\times FF = ${Voc}\\times${Isc}\\times${FF} = ${S(Pm, 4)}$ W.` };
      if (v === 1) return { Voc, Isc, FF, A, I0, v, q: `A solar cell of area ${A} $\\mathrm{m^2}$ in light of ${I0} $\\mathrm{W\\,m^{-2}}$ has $V_{oc} = ${Voc}$ V, $I_{sc} = ${Isc}$ A and fill factor ${FF}. Find its efficiency (in %, 1 decimal).`, answer: N(eff, 1), tol: 0.1, unit: '%', sol: `$P_{max} = ${Voc}\\times${Isc}\\times${FF} = ${S(Pm, 4)}$ W. Input $= ${I0}\\times${A} = ${I0 * A}$ W. $\\eta = ${S(Pm, 4)}/${I0 * A} = ${S(eff, 4)}\\ \\%$.` };
      const e = choose(rng, [0.1, 0.15, 0.2]); const Pn = choose(rng, [20, 50, 100, 200]); const Ar = Pn / (e * I0); return { e, Pn, I0, v, q: `A solar panel of efficiency ${e * 100} % is used in light of ${I0} $\\mathrm{W\\,m^{-2}}$. What area is needed to deliver ${Pn} W (in $\\mathrm{m^2}$, 2 decimals)?`, answer: N(Ar, 2), tol: 0.01 * Ar + 0.01, unit: 'm^2', sol: `$P_{out} = \\eta IA\\Rightarrow A = \\dfrac{${Pn}}{${e}\\times${I0}} = ${S(Ar, 4)}\\ \\mathrm{m^2}$.` };
    },
    verify: (p) => { if (p.v === 0) return p.Voc * p.Isc * p.FF; if (p.v === 1) return p.FF * p.Voc * p.Isc / (p.I0 * p.A) * 100; return p.Pn / p.e / p.I0; } },
  { id: 'sc-g16', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'depletion layer',
    make(rng) {
      const v = int(rng, 0, 2); const V0 = choose(rng, [0.3, 0.7]); const d = choose(rng, [0.1, 0.2, 0.35, 0.5, 1]);
      if (v === 0) { const E = V0 / (d * 1e-6) / 1e6; return { V0, d, v, q: `A p-n junction has a barrier potential of ${V0} V across a depletion layer ${d} $\\mu$m wide. Find the average electric field in the layer (in units of $10^6\\ \\mathrm{V\\,m^{-1}}$, 2 decimals).`, answer: N(E, 2), tol: 0.01 * E + 0.01, unit: '1e6 V/m', sol: `$E = V/d = \\dfrac{${V0}}{${d}\\times10^{-6}} = ${S(E, 4)}\\times10^{6}\\ \\mathrm{V\\,m^{-1}}$.` }; }
      if (v === 1) { const E = choose(rng, [1, 2, 5]); const w = V0 / (E * 1e6) * 1e6; return { V0, E, v, q: `The average field in a depletion layer is ${E}$\\times10^{6}\\ \\mathrm{V\\,m^{-1}}$ and the barrier potential is ${V0} V. Find the width of the layer (in $\\mu$m, 3 decimals).`, answer: N(w, 3), tol: 0.01 * w + 0.002, unit: 'um', sol: `$d = \\dfrac VE = \\dfrac{${V0}}{${E}\\times10^6} = ${S(w, 4)}\\times10^{-6}$ m $= ${S(w, 4)}\\ \\mu$m.` }; }
      const mode = choose(rng, ['forward', 'reverse']); const Vb = choose(rng, [0.2, 0.5, 2, 5]); const eff = mode === 'forward' ? V0 - Vb : V0 + Vb; if (eff <= 0) return this.make(rng);
      return { V0, Vb, mode, v, q: `A p-n junction has a barrier potential of ${V0} V. Find the effective barrier when a ${mode} bias of ${Vb} V is applied (in V, 2 decimals).`, answer: N(eff, 2), tol: 0.01, unit: 'V', sol: mode === 'forward' ? `Forward bias lowers the barrier: $V_0-V = ${V0}-${Vb} = ${S(eff, 3)}$ V.` : `Reverse bias raises the barrier: $V_0+V = ${V0}+${Vb} = ${S(eff, 3)}$ V.` };
    },
    verify: (p) => { if (p.v === 0) return p.V0 / (p.d * 1e-6) / 1e6; if (p.v === 1) return p.V0 / (p.E * 1e6) / 1e-6; return p.mode === 'forward' ? p.V0 - p.Vb : p.V0 + p.Vb; } },
  { id: 'sc-g17', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'smoothing capacitor',
    make(rng) {
      const f = choose(rng, [50, 60]); const t = choose(rng, ['half-wave', 'full-wave']); const fr = t === 'half-wave' ? f : 2 * f; const I = choose(rng, [5, 10, 20, 50]) * 1e-3; const Cc = choose(rng, [470, 1000, 2200]) * 1e-6; const v = int(rng, 0, 2); const Vm = choose(rng, [10, 12, 15]);
      const dV = I / (fr * Cc);
      if (v === 0) return { f, t, I, Cc, v, q: `A ${t} rectifier on ${f} Hz mains has a smoothing capacitor of ${S(Cc * 1e6)} $\\mu$F and feeds a load current of ${S(I * 1e3)} mA. Estimate the peak-to-peak ripple $\\Delta V = I/(f_rC)$ (in mV, nearest integer).`, answer: Math.round(dV * 1e3), tol: 0.01 * dV * 1e3 + 1, unit: 'mV', sol: `Ripple frequency $f_r = ${fr}$ Hz. $\\Delta V = \\dfrac{${S(I)}}{${fr}\\times${tx(Cc, 2)}} = ${S(dV, 4)}$ V $= ${S(dV * 1e3, 4)}$ mV.` };
      if (v === 1) { const dVt = choose(rng, [0.1, 0.2, 0.5]); const Cx = I / (fr * dVt) * 1e6; return { f, t, I, dVt, v, q: `A ${t} rectifier on ${f} Hz mains supplies ${S(I * 1e3)} mA. What smoothing capacitor keeps the peak-to-peak ripple to ${dVt} V (in $\\mu$F, nearest integer)? Use $\\Delta V = I/(f_rC)$.`, answer: Math.round(Cx), tol: 0.01 * Cx + 1, unit: 'uF', sol: `$f_r = ${fr}$ Hz. $C = \\dfrac{I}{f_r\\Delta V} = \\dfrac{${S(I)}}{${fr}\\times${dVt}} = ${S(Cx, 4)}\\ \\mu$F.` }; }
      const avg = Vm - dV / 2; return { f, t, I, Cc, Vm, v, q: `A ${t} rectifier (ideal diodes) on ${f} Hz mains has a peak output of ${Vm} V before smoothing. A ${S(Cc * 1e6)} $\\mu$F capacitor supplies a load current of ${S(I * 1e3)} mA. Estimate the average output voltage $V_m-\\Delta V/2$ (in V, 2 decimals), with $\\Delta V = I/(f_rC)$.`, answer: N(avg, 2), tol: 0.02, unit: 'V', sol: `$f_r = ${fr}$ Hz, $\\Delta V = \\dfrac{${S(I)}}{${fr}\\times${tx(Cc, 2)}} = ${S(dV, 4)}$ V. $V_{avg}\\approx${Vm}-${S(dV / 2, 4)} = ${S(avg, 4)}$ V.` };
    },
    verify: (p) => { const fr = p.t === 'half-wave' ? p.f : 2 * p.f; if (p.v === 0) return Math.round(p.I / (fr * p.Cc) * 1e3); if (p.v === 1) return Math.round(p.I / (fr * p.dVt) * 1e6); return p.Vm - 0.5 * p.I / (fr * p.Cc); } },
  { id: 'sc-g18', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'bands and doping',
    make(rng) {
      const v = int(rng, 0, 2);
      if (v === 0) { const Eg = choose(rng, [0, 0.67, 1.1, 3.5, 5.4, 0.5]); const cls = Eg === 0 ? 'a conductor (bands overlap)' : Eg < 3 ? 'a semiconductor' : 'an insulator'; const all = ['a conductor (bands overlap)', 'a semiconductor', 'an insulator', 'a superconductor']; const o = shuffleOpts(rng, cls, all.filter((x) => x !== cls));
        return { Eg, cls, ...o, q: Eg === 0 ? `A solid has overlapping valence and conduction bands. It is` : `A solid has an energy gap of ${Eg} eV between its valence and conduction bands. At room temperature it is`, sol: Eg === 0 ? `No gap: electrons move freely, so it is a conductor.` : `Gaps below about 3 eV give a semiconductor; larger gaps give an insulator. ${Eg} eV: ${cls}.` }; }
      const imp = choose(rng, [['phosphorus', 'n'], ['arsenic', 'n'], ['antimony', 'n'], ['boron', 'p'], ['aluminium', 'p'], ['gallium', 'p'], ['indium', 'p']]); const [nm, ty] = imp;
      if (v === 1) { const correct = ty === 'n' ? 'n-type, with electrons as majority carriers' : 'p-type, with holes as majority carriers'; const wr = ty === 'n' ? ['p-type, with holes as majority carriers', 'n-type, with holes as majority carriers', 'p-type, with electrons as majority carriers'] : ['n-type, with electrons as majority carriers', 'p-type, with electrons as majority carriers', 'n-type, with holes as majority carriers']; const o = shuffleOpts(rng, correct, wr);
        return { nm, ty, ...o, q: `Silicon doped with ${nm} becomes`, sol: `${nm[0].toUpperCase() + nm.slice(1)} has ${ty === 'n' ? '5 valence electrons (a donor): the fifth electron is free' : '3 valence electrons (an acceptor): each atom makes a hole'}, so the silicon is ${correct}.` }; }
      const correct = ty === 'n' ? 'just below the conduction band' : 'just above the valence band'; const wr = ty === 'n' ? ['just above the valence band', 'in the middle of the gap', 'inside the conduction band'] : ['just below the conduction band', 'in the middle of the gap', 'inside the valence band']; const o = shuffleOpts(rng, correct, wr);
      return { nm, ty, ...o, q: `Silicon is doped with ${nm}. The impurity energy level lies`, sol: `${nm[0].toUpperCase() + nm.slice(1)} is ${ty === 'n' ? 'a donor: its level is close to (just below) the conduction band' : 'an acceptor: its level is close to (just above) the valence band'}.` };
    },
    verify: (p) => { if (p.cls) return p.options.indexOf(p.Eg === 0 ? 'a conductor (bands overlap)' : p.Eg < 3 ? 'a semiconductor' : 'an insulator'); if (p.q.startsWith('Silicon doped')) return p.options.indexOf(p.ty === 'n' ? 'n-type, with electrons as majority carriers' : 'p-type, with holes as majority carriers'); return p.options.indexOf(p.ty === 'n' ? 'just below the conduction band' : 'just above the valence band'); } },
  { id: 'sc-g19', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'temperature dependence of n_i',
    make(rng) {
      const [nm, Eg] = choose(rng, [['silicon', 1.1], ['germanium', 0.67]]); const T1 = choose(rng, [280, 300, 320]); const T2 = T1 + choose(rng, [20, 40, 60, 80]); const v = int(rng, 0, 1);
      const rt = Math.pow(T2 / T1, 1.5) * Math.exp(-Eg / (2 * KB) * (1 / T2 - 1 / T1));
      if (v === 0) return { nm, Eg, T1, T2, v, q: `For ${nm} ($E_g = ${Eg}$ eV) the intrinsic concentration follows $n_i\\propto T^{3/2}e^{-E_g/2kT}$ with $k = 8.617\\times10^{-5}$ eV K$^{-1}$. Find $n_i(${T2}\\ \\mathrm{K})/n_i(${T1}\\ \\mathrm{K})$ (3 significant figures).`, answer: +rt.toPrecision(3), tol: 0.01 * rt + 0.005, unit: '', sol: `Ratio $= \\left(\\dfrac{${T2}}{${T1}}\\right)^{3/2}\\exp\\!\\left[\\dfrac{${Eg}}{2\\times8.617\\times10^{-5}}\\left(\\dfrac1{${T1}}-\\dfrac1{${T2}}\\right)\\right] = ${S(Math.pow(T2 / T1, 1.5), 4)}\\times e^{${S(Eg / (2 * KB) * (1 / T1 - 1 / T2), 4)}} = ${S(rt, 4)}$.` };
      const n1 = nm === 'silicon' ? 1.5e16 : 2.4e19; const n2 = n1 * rt; const e = exp10(n2);
      return { nm, Eg, T1, T2, n1, v, e, q: `${nm[0].toUpperCase() + nm.slice(1)} ($E_g = ${Eg}$ eV) has $n_i = ${tx(n1, 2)}\\ \\mathrm{m^{-3}}$ at ${T1} K. Using $n_i\\propto T^{3/2}e^{-E_g/2kT}$ ($k = 8.617\\times10^{-5}$ eV K$^{-1}$), find $n_i$ at ${T2} K (in units of $10^{${e}}\\ \\mathrm{m^{-3}}$, 2 decimals).`, answer: N(n2 / 10 ** e, 2), tol: 0.01 * n2 / 10 ** e + 0.01, unit: `1e${e} /m^3`, sol: `Ratio $= ${S(rt, 4)}$ (from $(T_2/T_1)^{3/2}e^{\\dots}$). $n_i(${T2}) = ${S(rt, 4)}\\times${tx(n1, 2)} = ${tx(n2, 3)}\\ \\mathrm{m^{-3}}$.` };
    },
    verify: (p) => { const r = Math.pow(p.T2 / p.T1, 1.5) * Math.exp((p.Eg / (2 * KB)) * (1 / p.T1 - 1 / p.T2)); if (p.v === 0) return r; return p.n1 * r / 10 ** p.e; } },
];
export default { topic: 'semiconductors', groups, items, gens };
