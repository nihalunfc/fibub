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
    r`NOR is 1 only for (0,0). 0, 1, 1, 1 is OR; 1, 1, 1, 0 is NAND; 0, 0, 0, 1 is AND.`),
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

// ======== Expansion block (added 2026-11-22): more hard items and templates, ids sc-x001 onward ========
import * as XH from '../_entrance.js';
const { pick: xpick, int: xint, choose: xchoose, fmt: xfmt, shuffleOpts: xsh, numOpts: xno } = XH;
const xr = String.raw;
const XE = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xex = (level, type, neet) => { const e = [...XE[level]]; if (neet && level === 4) e.push('neet'); if (true && level <= 3 && type === 'mcq') e.push('cuet'); return e; };
let xk = 0, xc = 0;
const XPOS = [2, 0, 3, 1, 3, 1, 0, 2];
const xb = (level, sub, o) => { const { neet, ...rest } = o; return { id: `sc-x${String(++xk).padStart(3, '0')}`, level, exams: xex(level, o.type, neet), sub, ...rest }; };
const xq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xn = (level, sub, q, ans, tol, calc, sol, o = {}) => {
  const v = calc();
  if (!(Math.abs(v - ans) <= Math.max(tol, 1e-9) + 1e-9)) throw new Error(`sc item ${xk + 1}: calc ${v} vs answer ${ans}`);
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
  xm1: { title: 'Kinds of crystal', list1: ['A. Silicon doped with phosphorus', 'B. Silicon doped with boron', 'C. Pure silicon at 0 K', 'D. Pure silicon at 300 K'],
    list2: ['p. Holes are the majority carriers', 'q. Electrons are the majority carriers', 'r. There are no free carriers', 's. Electrons and holes are equal in number', 't. Behaves like a metal'] },
  xm2: { title: 'Diode and resistor in series', list1: [xr`A. Source 5.7 V, resistor $1\ \mathrm{k\Omega}$`, xr`B. Source 10.7 V, resistor $1\ \mathrm{k\Omega}$`, xr`C. Source 2.7 V, resistor $500\ \Omega$`, xr`D. Source 6.7 V, resistor $3\ \mathrm{k\Omega}$`],
    list2: ['p. 2 mA', 'q. 4 mA', 'r. 5 mA', 's. 10 mA', 't. 0'] },
  xm3: { title: 'Gates joined in series', list1: ['A. NAND gate followed by a NOT gate', 'B. NOR gate followed by a NOT gate', 'C. AND gate followed by a NOT gate', 'D. OR gate followed by a NOT gate'],
    list2: ['p. AND', 'q. OR', 'r. NAND', 's. NOR', 't. XOR'] },
  xm4: { title: 'Simplifying Boolean expressions', list1: [xr`A. $A + AB$`, xr`B. $A + \overline A B$`, xr`C. $A(\overline A + B)$`, xr`D. $AB + \overline A B$`],
    list2: ['p. $A$', 'q. $A + B$', 'r. $AB$', 's. $B$', xr`t. $\overline A\,\overline B$`] },
  xm5: { title: 'A Zener regulator', list1: ['A. Current through the series resistor', 'B. Current through the load', 'C. Current through the Zener diode', 'D. Power dissipated in the Zener diode'],
    list2: ['p. 50 mA', 'q. 20 mA', 'r. 30 mA', 's. 300 mW', 't. 200 mW'] },
  xm6: { title: 'A transistor in the common-emitter mode', list1: ['A. Collector current', 'B. Emitter current', xr`C. Current gain $\alpha$`, xr`D. Current gain $\beta$`],
    list2: ['p. 2 mA', 'q. 2.02 mA', 'r. 0.99', 's. 100', 't. 0.01'] },
  xm7: { title: 'LED materials and the light they emit', list1: ['A. Band gap 1.9 eV', 'B. Band gap 2.5 eV', 'C. Band gap 1.1 eV', 'D. Band gap 3.1 eV'],
    list2: ['p. 653 nm', 'q. 496 nm', 'r. 1127 nm', 's. 400 nm', 't. 310 nm'] },
  xm8: { title: 'Gates built only from NAND gates', list1: ['A. NOT gate', 'B. AND gate', 'C. OR gate', 'D. XOR gate'],
    list2: ['p. 1 NAND gate', 'q. 2 NAND gates', 'r. 3 NAND gates', 's. 4 NAND gates', 't. 5 NAND gates'] },
  xp1: { title: 'A common-emitter amplifier',
    passage: xr`<p>A transistor in the common-emitter circuit has $\beta = 100$. The supply is $V_{CC} = 12$ V, the collector resistor is $R_C = 3\ \mathrm{k\Omega}$, and the base current is $20\ \mu\mathrm{A}$. Ignore the saturation voltage of the transistor.</p>` },
  xp2: { title: 'Doped silicon',
    passage: xr`<p>Silicon ($n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$) is doped with $4\times10^{21}$ phosphorus atoms per $\mathrm{m^3}$, all ionised. Take the electron mobility as $0.12\ \mathrm{m^2\,V^{-1}s^{-1}}$ and $e = 1.6\times10^{-19}$ C.</p>` },
};

const xitems = [
  // ---------- Level 2 ----------
  xq(2, 'doping', xr`A crystal of silicon is doped with arsenic atoms. The crystal as a whole is`, 'electrically neutral', ['negatively charged', 'positively charged', 'charged, with the sign depending on the temperature'],
    xr`Each arsenic atom brings one extra electron, but also one extra proton in its nucleus. The extra electron is free to move, yet the crystal still has equal total positive and negative charge. An n-type crystal is neutral.`,
    { trap: '"n" stands for negative carriers, not a negatively charged crystal.' }),
  xn(2, 'diode circuit', xr`A silicon diode (drop 0.7 V when conducting) is connected in series with a $1.66\ \mathrm{k\Omega}$ resistor to a 9 V battery in forward bias. Find the current in mA.`, 5, 0, () => (9 - 0.7) / 1660 * 1000,
    xr`$I = (V - V_d)/R = (9 - 0.7)/1660 = 8.3/1660 = 5.0\times10^{-3}$ A $= 5$ mA.`),
  xq(2, 'logic gates', xr`Which logic gate gives an output of 1 only when its two inputs are different?`, 'XOR', ['XNOR', 'NAND', 'NOR'],
    xr`XOR: $Y = 1$ for $(0,1)$ and $(1,0)$ only. XNOR gives 1 when the inputs are the same; NAND gives 1 unless both are 1; NOR gives 1 only when both are 0.`),
  xq(2, 'rectifier', xr`An ideal full-wave rectifier is fed a sinusoidal signal of peak value $V_0$. The average (d.c.) value of its output is`, xr`$2V_0/\pi$`, [xr`$V_0/\pi$`, xr`$V_0/\sqrt2$`, xr`$V_0/2$`],
    xr`Over one half cycle the average of $V_0\sin\omega t$ is $2V_0/\pi$, and a full-wave rectifier makes every half cycle positive, so its average is $2V_0/\pi = 0.637V_0$. $V_0/\pi$ is the half-wave value.`),
  xq(2, 'Zener diode', xr`A Zener diode with a breakdown voltage below about 5 V breaks down mainly because`, 'the strong electric field in the thin depletion layer pulls electrons out of covalent bonds', ['fast carriers knock out more carriers by collisions (avalanche)', 'the junction becomes very hot', 'light falls on the junction'],
    xr`In a heavily doped junction the depletion layer is very thin, so a small reverse voltage gives a huge field ($\sim10^7\ \mathrm{V\,m^{-1}}$) that breaks covalent bonds directly: the Zener effect. Avalanche multiplication occurs in lightly doped junctions at higher voltages.`),
  xn(2, 'doping', xr`A silicon crystal has $5\times10^{28}$ atoms per $\mathrm{m^3}$ and is doped with phosphorus at 1 part in $10^7$. Find the electron concentration due to doping, in units of $10^{21}\ \mathrm{m^{-3}}$.`, 5, 0, () => 5e28 / 1e7 / 1e21,
    xr`Donors per $\mathrm{m^3}$ $= 5\times10^{28}/10^7 = 5\times10^{21}$. Each donor gives one free electron, so $n\approx5\times10^{21}\ \mathrm{m^{-3}}$ (answer 5).`),

  // ---------- Level 3 ----------
  xn(3, 'carrier concentrations', xr`Silicon ($n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$) is doped with $5\times10^{20}$ donor atoms per $\mathrm{m^3}$. Find the hole concentration in units of $10^{11}\ \mathrm{m^{-3}}$.`, 4.5, 0.01, () => (1.5e16) ** 2 / 5e20 / 1e11,
    xr`$n \approx N_D = 5\times10^{20}$. Mass-action law: $np = n_i^2$, so $p = \dfrac{(1.5\times10^{16})^2}{5\times10^{20}} = 4.5\times10^{11}\ \mathrm{m^{-3}}$ (answer 4.5).`),
  xn(3, 'dynamic resistance', xr`On the forward characteristic of a diode, raising the voltage from 0.70 V to 0.74 V raises the current from 10 mA to 18 mA. Find the dynamic resistance in $\Omega$.`, 5, 0, () => 0.04 / 0.008,
    xr`Dynamic resistance $r = \Delta V/\Delta I = 0.04\ \mathrm{V}/0.008\ \mathrm{A} = 5\ \Omega$. It is the slope of the tangent, not $V/I$ (which would be $0.7/0.01 = 70\ \Omega$).`,
    { trap: 'Dividing a single voltage by a single current gives the static (d.c.) resistance, not the dynamic one.' }),
  xn(3, 'Zener diode', xr`A 10 V Zener diode is rated at 1 W. What is the largest current, in mA, it may carry in breakdown?`, 100, 0, () => 1 / 10 * 1000,
    xr`$P = V_zI_z$, so $I_{max} = 1/10 = 0.1$ A $= 100$ mA.`),
  xn(3, 'full-wave rectifier', xr`A centre-tapped full-wave rectifier uses a transformer whose each half of the secondary gives 12 V r.m.s. Find the peak inverse voltage across each (ideal) diode, in V (1 decimal).`, 33.9, 0.1, () => 2 * 12 * Math.SQRT2,
    xr`Peak of each half $= 12\sqrt2 = 16.97$ V. When one diode conducts, the other sees the whole secondary: PIV $= 2\times16.97 = 33.9$ V.`,
    { trap: 'Using 16.97 V, the peak of only one half. PIV of a centre-tapped rectifier is twice that.' }),
  xn(3, 'transistor', xr`The current gain in common-base mode of a transistor is $\alpha = 0.98$. Find its current gain $\beta$ in common-emitter mode.`, 49, 0, () => 0.98 / (1 - 0.98),
    xr`$\beta = \dfrac{\alpha}{1 - \alpha} = \dfrac{0.98}{0.02} = 49$.`),
  xn(3, 'transistor', xr`A transistor in the common-emitter mode has $\beta = 50$ and a base current of $40\ \mu\mathrm{A}$. Find the collector current in mA.`, 2, 0, () => 50 * 40e-6 * 1000,
    xr`$I_C = \beta I_B = 50\times40\ \mu\mathrm{A} = 2000\ \mu\mathrm{A} = 2$ mA. (The emitter current is $I_B + I_C = 2.04$ mA.)`),
  xn(3, 'amplifier', xr`A common-emitter amplifier has $\beta = 100$, an input resistance of $1\ \mathrm{k\Omega}$ and a collector load of $2\ \mathrm{k\Omega}$. Find its voltage gain.`, 200, 0, () => 100 * 2000 / 1000,
    xr`$A_v = \dfrac{\Delta V_{out}}{\Delta V_{in}} = \dfrac{\beta\,\Delta I_B R_L}{\Delta I_B R_{in}} = \beta\dfrac{R_L}{R_{in}} = 100\times\dfrac{2}{1} = 200$ (the output is inverted).`),
  xq(3, 'Boolean algebra', xr`The expression $Y = (A + B)(A + \overline B)$ simplifies to`, '$A$', ['$B$', '$A + B$', '0'],
    xr`$(A+B)(A+\overline B) = AA + A\overline B + AB + B\overline B = A + A(\overline B + B) + 0 = A + A = A$.`),
  xn(3, 'logic circuits', xr`A circuit gives $Y = A\oplus B\oplus C$ (XOR of three inputs). For how many of the 8 input combinations is $Y = 1$?`, 4, 0, () => { let n = 0; for (let i = 0; i < 8; i++) { const a = i & 1, b = (i >> 1) & 1, c = (i >> 2) & 1; n += a ^ b ^ c; } return n; },
    xr`The output is 1 when an odd number of inputs are 1: exactly one input high (3 ways) or all three high (1 way). Total $3 + 1 = 4$.`),
  xn(3, 'LED circuit', xr`Two identical LEDs, each dropping 2.0 V at 20 mA, are connected in series with a resistor to a 12 V supply. What resistance, in $\Omega$, makes the current 20 mA?`, 400, 0, () => (12 - 2 * 2.0) / 0.02,
    xr`The resistor drops $12 - 2\times2.0 = 8$ V at 20 mA: $R = 8/0.02 = 400\ \Omega$.`, { trap: 'Subtracting only one LED drop gives 500 Ω.' }),
  xa(3, 'p-n junction', xr`A p-n junction diode has a much smaller resistance in forward bias than in reverse bias.`, xr`In forward bias the depletion layer narrows and the barrier is lowered, so majority carriers cross easily, while in reverse bias only a tiny minority-carrier current flows.`, 0,
    xr`Both are true and R explains A. Forward: narrow depletion layer, large current. Reverse: wider depletion layer, current of the order of microamperes.`),
  xt(3, 'doping', xr`Doping a pure semiconductor with a tiny amount of impurity raises its conductivity enormously.`, xr`At room temperature a pure semiconductor has very few free carriers compared with the number of dopant atoms added.`, 0,
    xr`Both are true and II explains I. In silicon $n_i\approx10^{16}\ \mathrm{m^{-3}}$ whereas even one dopant atom per $10^8$ silicon atoms adds about $10^{21}\ \mathrm{m^{-3}}$ carriers.`),
  xm(3, 'extrinsic semiconductors', 'xm1', xr`Match the crystal in List I with the description in List II.`, { A: 'q', B: 'p', C: 'r', D: 's' },
    xr`A: phosphorus is a donor, so electrons are the majority carriers (q). B: boron is an acceptor, so holes are the majority carriers (p). C: at 0 K all electrons sit in the valence band, so there are no free carriers (r). D: thermal generation makes equal numbers of electrons and holes (s). Nothing here behaves like a metal.`),
  xm(3, 'logic gates', 'xm3', xr`Match each combination of gates in List I with the single gate it behaves like.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`NAND then NOT $= \overline{\overline{AB}} = AB$ (AND, p). NOR then NOT gives OR (q). AND then NOT gives NAND (r). OR then NOT gives NOR (s).`),
  xm(3, 'Boolean algebra', 'xm4', xr`Match each Boolean expression in List I with its simplified form in List II.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`A: $A + AB = A(1+B) = A$. B: $A + \overline AB = A + B$ (absorption). C: $A(\overline A + B) = A\overline A + AB = AB$. D: $AB + \overline AB = B(A + \overline A) = B$.`),

  // ---------- Level 4 ----------
  xn(4, 'Zener regulator', xr`A 12 V Zener diode is connected across a $200\ \Omega$ load and is fed from an 18 V supply through a $120\ \Omega$ resistor. Find the voltage across the load in V.`, 11.25, 0.01, () => 18 * 200 / (120 + 200),
    xr`Suppose the Zener conducts: current through $R_s$ would be $(18-12)/120 = 50$ mA but the load alone needs $12/200 = 60$ mA. The supply cannot give that, so the Zener is not in breakdown and acts as an open circuit. The load is then a divider: $V = 18\times\dfrac{200}{120+200} = 11.25$ V (below 12 V, so consistent).`,
    { trap: 'Answering 12 V without checking that the Zener actually reaches breakdown.' }),
  xn(4, 'transistor', xr`In a common-emitter circuit $V_{CC} = 12$ V, $R_C = 2\ \mathrm{k\Omega}$ and the collector current is 3 mA. Find the collector-emitter voltage, in V.`, 6, 0, () => 12 - 3e-3 * 2000,
    xr`$V_{CE} = V_{CC} - I_CR_C = 12 - 3\times10^{-3}\times2000 = 12 - 6 = 6$ V.`),
  xn(4, 'transistor as a switch', xr`A transistor with $\beta = 100$ is used as a switch with $V_{CC} = 10$ V and $R_C = 1\ \mathrm{k\Omega}$. Taking $V_{CE}\approx0$ when saturated, what is the least base current, in $\mu\mathrm{A}$, that saturates it?`, 100, 0, () => (10 / 1000) / 100 * 1e6,
    xr`Saturation collector current $I_{C,sat} = V_{CC}/R_C = 10$ mA. The base current must supply at least $I_{C,sat}/\beta = 10\ \mathrm{mA}/100 = 0.1$ mA $= 100\ \mu\mathrm{A}$.`),
  xn(4, 'logic circuits', xr`A function gives 1 when at least two of its three inputs are 1 (a "majority" circuit), $Y = (A+B)(B+C)(C+A)$. For how many of the 8 input combinations is $Y = 1$?`, 4, 0, () => { let n = 0; for (let i = 0; i < 8; i++) { const a = i & 1, b = (i >> 1) & 1, c = (i >> 2) & 1; n += ((a | b) & (b | c) & (c | a)); } return n; },
    xr`$Y = 1$ only if at least two inputs are 1: $(0,1,1), (1,0,1), (1,1,0), (1,1,1)$. Four combinations. (Check: each bracket forces at least one of that pair to be 1, so no more than one input can be 0.)`),
  xn(4, 'logic circuits', xr`A four-input XOR circuit $Y = A\oplus B\oplus C\oplus D$ is used. For how many of the 16 input combinations is $Y = 1$?`, 8, 0, () => { let n = 0; for (let i = 0; i < 16; i++) { let b = 0; for (let j = 0; j < 4; j++) b ^= (i >> j) & 1; n += b; } return n; },
    xr`The output is 1 when an odd number of inputs are high: $\binom41 + \binom43 = 4 + 4 = 8$.`),
  xn(4, 'solar cell', xr`A solar cell has short-circuit current 40 mA and open-circuit voltage 0.60 V. Its maximum output power is 18 mW. Find its fill factor.`, 0.75, 0.01, () => 18 / (40 * 0.6),
    xr`Fill factor $= \dfrac{P_{max}}{V_{oc}I_{sc}} = \dfrac{18\ \mathrm{mW}}{0.60\times40\ \mathrm{mW}} = \dfrac{18}{24} = 0.75$.`),
  xn(4, 'Zener regulator', xr`A regulator uses a 10 V Zener diode and a $100\ \Omega$ series resistor from a 20 V supply. The Zener needs at least 5 mA to stay in regulation. Find the smallest load resistance, in $\Omega$ (1 decimal), for which regulation is kept.`, 105.3, 0.1, () => 10 / (0.1 - 0.005),
    xr`Total current $= (20 - 10)/100 = 100$ mA. At least 5 mA must go through the Zener, so the load may take at most 95 mA. $R_{L,min} = 10/0.095 = 105.3\ \Omega$.`),
  xn(4, 'series diode and Zener', xr`A silicon diode (0.7 V) conducting forward is in series with a 5.1 V Zener diode connected in reverse breakdown, a $700\ \Omega$ resistor and a 12 V supply. Find the current in mA (2 decimals).`, 8.86, 0.01, () => (12 - 0.7 - 5.1) / 700 * 1000,
    xr`The two diodes together drop $0.7 + 5.1 = 5.8$ V, so the resistor has $12 - 5.8 = 6.2$ V: $I = 6.2/700 = 8.86$ mA.`),
  xq(4, 'clipper circuit', xr`A 10 V (peak) sine wave is fed through a resistor to an output node. A silicon diode (0.7 V) has its anode at the output node and its cathode joined to the positive terminal of a 3 V battery whose negative terminal is earthed. The output goes between`, '$-10$ V and $+3.7$ V', ['$-10$ V and $+2.3$ V', '$-3.7$ V and $+3.7$ V', '$-3.7$ V and $+10$ V'],
    xr`The diode conducts when the node voltage exceeds $3 + 0.7 = 3.7$ V, and then holds the node at $3.7$ V (a positive clipper). When the node is negative the diode is reverse biased, nothing flows through the resistor, and the output follows the full input down to $-10$ V.`,
    { trap: 'Subtracting the 0.7 V from the battery instead of adding it.' }),
  xq(4, 'logic circuits', xr`In a circuit of four NAND gates, inputs $A$ and $B$ both go to NAND 1. The output of NAND 1 goes to NAND 2 (with $A$) and to NAND 3 (with $B$). The outputs of NAND 2 and NAND 3 feed NAND 4. The output of NAND 4 is the function`, 'XOR', ['XNOR', 'AND', 'OR'],
    xr`Let $N_1 = \overline{AB}$. Then $N_2 = \overline{A N_1} = \overline A + AB = \overline A + B$ and $N_3 = \overline{BN_1} = A + \overline B$. Finally $Y = \overline{N_2N_3} = \overline{(\overline A + B)(A + \overline B)} = \overline{AB + \overline A\,\overline B}$, which is the XOR function. Check: $(0,1)$ gives 1 and $(1,1)$ gives 0.`),
  xq(4, 'reverse bias', xr`Which one of these is NOT correct for a p-n junction diode in reverse bias?`, 'The diffusion current of majority carriers increases', ['The depletion layer widens', 'The barrier height increases', 'A small current flows due to minority carriers'],
    xr`Reverse bias raises the barrier, which almost stops the diffusion of majority carriers (it decreases rather than increases). The depletion layer widens and the small reverse (drift) current of minority carriers remains.`),
  xs(4, 'p-n junction', xr`A p-n junction with no bias is at equilibrium. Which are correct?`,
    ['The net current across the junction is zero', 'The electric field in the depletion layer points from the n side to the p side', 'The conventional diffusion current from p to n is balanced by an equal drift current from n to p', 'The potential of the n side is lower than that of the p side', 'The depletion layer contains no ions'], [0, 1, 2],
    xr`Uncompensated donor ions ($+$) on the n side and acceptor ions ($-$) on the p side make the field point n to p (true), and the n side is at the higher potential (so the fourth is false). At equilibrium the diffusion current (p to n) equals the drift current (n to p), so net current is zero (true, true). The layer is full of ions, only free carriers are missing (false).`),
  xs(4, 'forward bias', xr`A p-n junction diode is forward biased. Which are correct?`,
    ['The depletion layer becomes narrower', 'The barrier height is reduced', 'Minority carrier concentration near the edges of the depletion layer rises', 'The drift current increases greatly', 'The diffusion current decreases'], [0, 1, 2],
    xr`Forward bias lowers the barrier $V_0 - V$ and thins the depletion layer (true, true). Majority carriers then flood across and become extra minority carriers on the other side (true). The large forward current is a diffusion current, which increases (so the last is false); the drift current stays about the same and is not what grows (false).`),
  xs(4, 'Boolean algebra', xr`Which of the following identities are correct?`,
    [xr`$\overline{A+B} = \overline A\,\overline B$`, xr`$\overline{AB} = \overline A + \overline B$`, xr`$A + AB = A$`, xr`$A(A + B) = A + B$`, xr`$A + \overline AB = A + B$`], [0, 1, 2, 4],
    xr`The first two are De Morgan's laws. $A + AB = A(1+B) = A$. $A(A+B) = A + AB = A$, not $A + B$ (false). $A + \overline AB = (A + \overline A)(A + B) = A + B$ (true).`),
  xs(4, 'Zener regulator', xr`A regulator has $V_{in} = 20$ V, $R_s = 200\ \Omega$, a 10 V Zener diode and a load of $500\ \Omega$. Which are correct?`,
    ['The current through the series resistor is 50 mA', 'The Zener current is 30 mA', 'The power in the Zener diode is 0.3 W', 'If the load is removed, the Zener current becomes 50 mA', 'If the load is changed to $100\ \Omega$, the output stays at 10 V'], [0, 1, 2, 3],
    xr`$I_s = (20 - 10)/200 = 50$ mA (true). $I_L = 10/500 = 20$ mA, so $I_z = 30$ mA (true) and $P_z = 10\times0.03 = 0.3$ W (true). Without the load all 50 mA flows through the Zener (true). With $100\ \Omega$ the load wants 100 mA but only 50 mA is available, so the Zener leaves breakdown and the output falls to $20\times100/300 = 6.7$ V (false).`),
  xs(4, 'diode network', xr`A 12 V battery is connected in series with a $2\ \mathrm{k\Omega}$ resistor to a junction $P$. From $P$, an ideal diode $D_1$ (forward) in series with $2\ \mathrm{k\Omega}$ goes to earth, and in parallel an ideal diode $D_2$ (reverse, anode to earth) in series with $1\ \mathrm{k\Omega}$ also goes to earth. Which are correct?`,
    ['The battery current is 3 mA', 'No current flows through the $1\\ \\mathrm{k\\Omega}$ resistor', 'The potential of $P$ is 6 V', 'The reverse voltage across $D_2$ is 6 V', 'The current in the $1\\ \\mathrm{k\\Omega}$ resistor is 6 mA'], [0, 1, 2, 3],
    xr`$D_2$ has its cathode on the $P$ side, at a positive potential, and its anode at earth, so it is reverse biased and carries no current (second true, fifth false). The circuit is then $2 + 2 = 4\ \mathrm{k\Omega}$ in series: $I = 12/4 = 3$ mA (true). $V_P = 3\ \mathrm{mA}\times2\ \mathrm{k\Omega} = 6$ V (true), which is also the reverse voltage across $D_2$ (true).`),
  xs(4, 'logic circuits', xr`A circuit has output $Y = \overline{A + B} + AB$. Which are correct?`,
    ['$Y = 1$ whenever $A = B$', 'The circuit behaves as an XNOR gate', '$Y = 1$ for exactly two of the four input combinations', 'The circuit behaves as an XOR gate', '$Y = 1$ for $A = 1$, $B = 0$'], [0, 1, 2],
    xr`$(0,0)$: $\overline{0} + 0 = 1$. $(0,1)$: $0 + 0 = 0$. $(1,0)$: 0. $(1,1)$: $0 + 1 = 1$. So $Y$ is 1 only when $A = B$: XNOR, with two combinations. It is not XOR, and it is 0 for $A = 1$, $B = 0$.`),
  xs(4, 'energy bands', xr`Which of these statements about energy bands are correct?`,
    ['At 0 K a pure semiconductor has a filled valence band and an empty conduction band', 'The donor level in an n-type semiconductor lies just below the conduction band', 'The acceptor level in a p-type semiconductor lies just above the valence band', 'The energy gap of diamond is about 5.4 eV, so it is an insulator', 'The acceptor level lies just below the conduction band'], [0, 1, 2, 3],
    xr`All of the first four are standard facts. The acceptor level is a few hundredths of an eV above the valence band, where it can easily take an electron from the valence band and leave a hole (the fifth is false).`),
  xm(4, 'diode circuits', 'xm2', xr`A silicon diode (drop 0.7 V when conducting) is in series with the resistor and source shown in List I. Match each with the current in List II.`, { A: 'r', B: 's', C: 'q', D: 'p' },
    xr`$I = (V - 0.7)/R$. A: $5/1\ \mathrm{k\Omega} = 5$ mA (r). B: $10/1\ \mathrm{k\Omega} = 10$ mA (s). C: $2/500 = 4$ mA (q). D: $6/3\ \mathrm{k\Omega} = 2$ mA (p).`),
  xm(4, 'Zener regulator', 'xm5', xr`A 10 V Zener diode, a $200\ \Omega$ series resistor, a $500\ \Omega$ load and a 20 V supply form a regulator. Match each quantity with its value.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`A: $(20-10)/200 = 50$ mA (p). B: $10/500 = 20$ mA (q). C: $50 - 20 = 30$ mA (r). D: $10\ \mathrm{V}\times30\ \mathrm{mA} = 300$ mW (s). The 200 mW is a distractor.`),
  xm(4, 'transistor', 'xm6', xr`A transistor has $\beta = 100$ in the common-emitter mode and the base current is $20\ \mu\mathrm{A}$. Match the quantities.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`$I_C = \beta I_B = 2$ mA (p). $I_E = I_B + I_C = 2.02$ mA (q). $\alpha = \beta/(1+\beta) = 100/101 = 0.99$ (r). $\beta = 100$ (s).`),
  xm(4, 'LED', 'xm8', xr`Each gate in List I is built using only NAND gates. Match with the smallest number of NAND gates needed.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`NOT: one NAND with its inputs joined (p). AND: NAND then NOT, $1 + 1 = 2$ (q). OR: NOT on each input then NAND, $1 + 1 + 1 = 3$ (r). XOR: the 4-gate circuit with $N_1 = \overline{AB}$ (s). Five would be needed for a half adder, not for XOR alone.`),
  xa(4, 'p-n junction', xr`The reverse saturation current of a p-n junction diode increases rapidly as the temperature rises.`, xr`The reverse current is due to minority carriers, whose concentration varies as $n_i^2/N$, and $n_i$ grows very fast with temperature.`, 0,
    xr`Both are true and R explains A. In reverse bias only thermally generated minority carriers carry current; since $n_i$ rises exponentially with $T$, so does the reverse current (roughly doubling every $10^\circ$C in silicon).`),
  xa(4, 'Zener diode', xr`A Zener diode connected in forward bias cannot be used as a voltage regulator.`, xr`A Zener diode regulates only through reverse breakdown, where the voltage stays almost constant over a large current range.`, 0,
    xr`Both are true and R explains A. In forward bias a Zener behaves like an ordinary diode (about 0.7 V drop, no sharp constant-voltage plateau at the rated value).`),
  xa(4, 'rectifier', xr`A silicon diode cannot rectify an a.c. signal of peak value 0.3 V.`, xr`A diode conducts significantly only when the forward voltage exceeds its barrier (knee) voltage of about 0.7 V for silicon.`, 0,
    xr`Both are true and R explains A. A 0.3 V peak is well below the 0.7 V knee, so the current is negligible in both half cycles (a germanium diode, knee 0.3 V, would just begin to conduct).`),
  xt(4, 'depletion layer', xr`The electric field in the depletion layer opposes the diffusion of majority carriers across the junction.`, xr`The electric field in the depletion layer is directed from the p side to the n side.`, 2,
    xr`Statement I is true: the field pushes electrons back to the n side and holes back to the p side. Statement II is false: the n side carries positive donor ions and the p side negative acceptor ions, so the field points from n to p.`),
  xt(4, 'LED', xr`The light from an LED has photon energy close to the energy gap of the semiconductor.`, xr`Light is emitted when electrons from the conduction band recombine with holes in the valence band, giving up the energy difference.`, 0,
    xr`Both are true and II explains I. The energy released in a recombination is about $E_g$, so $\lambda\approx1240/E_g$ (nm, with $E_g$ in eV).`),
  xt(4, 'doping', xr`In a p-n junction with the n side much more heavily doped than the p side, the depletion layer extends mostly into the p side.`, xr`The charge on the two sides of the depletion layer must be equal in magnitude.`, 0,
    xr`Both are true and II explains I. $N_Dx_n = N_Ax_p$: the lightly doped side needs a wider region to hold the same charge.`),


  // ---------- Level 5 and passages ----------
  xn(5, 'half adder', xr`A half adder gives sum $S = A\oplus B$ and carry $C = A\cdot B$. What is the smallest number of 2-input NAND gates with which both outputs can be built?`, 5, 0, () => 4 + 1,
    xr`The 4-gate NAND circuit for XOR has first gate output $N_1 = \overline{AB}$. The carry $AB = \overline{N_1}$ needs only one more NAND gate with both inputs tied to $N_1$. Total $4 + 1 = 5$.`,
    { trap: 'Building AND separately from scratch (2 gates) gives 6. Re-use the first gate of the XOR circuit.' }),
  xn(5, 'universal gates', xr`What is the smallest number of 2-input NOR gates needed to build an XOR gate?`, 5, 0, () => 4 + 1,
    xr`With NOR gates: $N_1 = \overline{A+B}$, $N_2 = \overline{A + N_1} = \overline AB$, $N_3 = \overline{B + N_1} = A\overline B$, $N_4 = \overline{N_2 + N_3} = \overline{\overline AB + A\overline B}$, which is XNOR (4 gates). A fifth NOR gate with its inputs tied inverts this to XOR. Total 5.`),
  xn(5, 'Zener regulator', xr`A 10 V Zener diode can carry at most 55 mA and needs at least 5 mA to regulate. It feeds a $100\ \Omega$ load (10 V, so 100 mA) through a $200\ \Omega$ series resistor from an input $V_{in}$ that varies. What is the largest $V_{in}$ in V that is safe?`, 41, 0, () => 10 + 200 * (0.055 + 0.1),
    xr`The series resistor carries the Zener current plus the load current: $V_{in} = V_z + R_s(I_z + I_L)$. At the maximum $I_z = 55$ mA: $V_{in} = 10 + 200\times(0.055 + 0.100) = 10 + 31 = 41$ V. (The least is $10 + 200\times0.105 = 31$ V.)`),
  xn(5, 'temperature dependence', xr`The resistance of an intrinsic semiconductor varies as $R\propto e^{E_g/2kT}$. Its resistance at 300 K is 6 times its resistance at 330 K. Find the band gap in eV (2 decimals). Take $k = 8.617\times10^{-5}\ \mathrm{eV\,K^{-1}}$.`, 1.02, 0.01,
    () => 2 * 8.617e-5 * Math.log(6) / (1 / 300 - 1 / 330),
    xr`$\dfrac{R_{300}}{R_{330}} = \exp\left[\dfrac{E_g}{2k}\left(\dfrac1{300} - \dfrac1{330}\right)\right] = 6$. So $E_g = \dfrac{2k\ln6}{1/300 - 1/330} = \dfrac{2\times8.617\times10^{-5}\times1.792}{3.03\times10^{-4}} = 1.02$ eV.`,
    { trap: 'Forgetting the 2 in 2kT (the Fermi level sits mid-gap, so each carrier needs only E_g/2).' }),
  xs(5, 'bridge rectifier', xr`A bridge rectifier made of four silicon diodes (0.7 V drop each when conducting) is fed from a 50 Hz transformer secondary of 24 V r.m.s. Which are correct?`,
    ['The peak output voltage is about 32.5 V', 'The output ripple frequency is 100 Hz', 'The average output (no filter) is about 20.7 V', 'The output ripple frequency is 50 Hz', 'All four diodes conduct at the same time'], [0, 1, 2],
    xr`Peak input $= 24\sqrt2 = 33.9$ V. Two diodes conduct in each half cycle, so the output peak is $33.9 - 1.4 = 32.5$ V (true). Both half cycles are used, so the ripple frequency is $2\times50 = 100$ Hz (true; 50 Hz is false). Average $= 2\times32.5/\pi = 20.7$ V (true). Only two diodes (opposite pairs) conduct at once (false).`),
  xs(5, 'logic circuits', xr`Which of these expressions represent the XOR function of $A$ and $B$?`,
    [xr`$A\overline B + \overline AB$`, xr`$(A + B)\,\overline{AB}$`, xr`$\overline{AB + \overline A\,\overline B}$`, xr`$\overline A\,\overline B + AB$`, xr`$(A + \overline B)(\overline A + B)$`], [0, 1, 2],
    xr`(a) is the definition. (b) $= (A+B)(\overline A + \overline B) = A\overline B + \overline AB$ (true). (c) is NOT of XNOR, which is XOR (true). (d) $\overline A\,\overline B + AB$ is XNOR (false). (e) $(A + \overline B)(\overline A + B) = AB + \overline A\,\overline B$, again XNOR (false).`),
  xs(5, 'compensated semiconductor', xr`Silicon with $n_i = 1.5\times10^{16}\ \mathrm{m^{-3}}$ is doped with $5\times10^{21}\ \mathrm{m^{-3}}$ donors and $2\times10^{21}\ \mathrm{m^{-3}}$ acceptors (all ionised). Which are correct?`,
    ['The material is n-type', xr`The electron concentration is about $3\times10^{21}\ \mathrm{m^{-3}}$`, xr`The hole concentration is about $7.5\times10^{10}\ \mathrm{m^{-3}}$`, xr`The hole concentration is about $4.5\times10^{10}\ \mathrm{m^{-3}}$`, 'The material is p-type'], [0, 1, 2],
    xr`Donors and acceptors compensate each other: net donors $= 5 - 2 = 3\times10^{21}\ \mathrm{m^{-3}}$, so $n\approx3\times10^{21}$ and the sample is n-type. $p = n_i^2/n = (2.25\times10^{32})/(3\times10^{21}) = 7.5\times10^{10}\ \mathrm{m^{-3}}$. The $4.5\times10^{10}$ would come from using the donor density alone.`),
  xb(5, 'statements', { type: 'mcq', format: 'statements', q: xr`How many of these are correct?<br>(a) A NOR gate is a universal gate.<br>(b) Zener breakdown can occur in forward bias.<br>(c) The width of the depletion layer depends on the doping.<br>(d) At 300 K pure germanium has a higher carrier concentration than pure silicon.<br>(e) A p-type crystal is positively charged because holes are positive.`,
    options: ['1', '2', '3', '4'], answer: 2,
    sol: xr`(a) true: every gate can be made from NOR gates. (b) false: breakdown is a reverse-bias effect. (c) true: heavier doping gives a thinner layer. (d) true: Ge has the smaller gap (0.67 eV), so $n_i$ is larger. (e) false: the crystal is neutral. Three are correct.` }),
  xa(5, 'doping', xr`At room temperature almost all donor atoms in an n-type silicon crystal are ionised.`, xr`The donor level lies only about 0.05 eV below the conduction band, which is comparable with the thermal energy $kT\approx0.026$ eV at 300 K.`, 0,
    xr`Both are true and R explains A. Such a shallow level means thermal energy readily lifts the donor electron into the conduction band, so $n\approx N_D$.`),
  xq(5, 'transistor', xr`In the passage's circuit the base current is increased to $50\ \mu\mathrm{A}$. What happens?`, xr`The transistor saturates: $V_{CE}$ falls to nearly 0 and $I_C$ stops near 4 mA`, [xr`$I_C = 5$ mA and $V_{CE} = -3$ V`, xr`$I_C = 5$ mA and $V_{CE} = 12$ V`, xr`The transistor enters cut-off with $I_C\approx0$`],
    xr`The formula $I_C = \beta I_B$ would give 5 mA, and $I_CR_C = 15$ V, more than the 12 V supply, which is impossible. The collector current can rise only to about $V_{CC}/R_C = 12/3 = 4$ mA, at which $V_{CE}\approx0$: the transistor is saturated and the linear relation fails.`,
    { format: 'passage', group: 'xp1', trap: 'Applying I_C = βI_B beyond saturation gives a negative V_CE.' }),
  xn(3, 'transistor', xr`Find the collector current, in mA.`, 2, 0, () => 100 * 20e-6 * 1000,
    xr`$I_C = \beta I_B = 100\times20\ \mu\mathrm{A} = 2$ mA.`, { format: 'passage', group: 'xp1' }),
  xn(4, 'transistor', xr`Find the collector-emitter voltage, in V.`, 6, 0, () => 12 - 2e-3 * 3000,
    xr`$V_{CE} = V_{CC} - I_CR_C = 12 - (2\times10^{-3})(3000) = 12 - 6 = 6$ V.`, { format: 'passage', group: 'xp1' }),
  xn(3, 'carrier concentrations', xr`Find the hole concentration, in units of $10^{10}\ \mathrm{m^{-3}}$ (2 decimals).`, 5.63, 0.01, () => (1.5e16) ** 2 / 4e21 / 1e10,
    xr`$n\approx4\times10^{21}$. $p = n_i^2/n = (2.25\times10^{32})/(4\times10^{21}) = 5.63\times10^{10}\ \mathrm{m^{-3}}$.`, { format: 'passage', group: 'xp2' }),
  xn(4, 'conductivity', xr`Find the conductivity in $\mathrm{S\,m^{-1}}$ (1 decimal). The holes' contribution is negligible.`, 76.8, 0.1, () => 4e21 * 1.6e-19 * 0.12,
    xr`$\sigma = ne\mu_e = 4\times10^{21}\times1.6\times10^{-19}\times0.12 = 76.8\ \mathrm{S\,m^{-1}}$ (the hole term $pe\mu_h\sim10^{-9}$ is negligible).`, { format: 'passage', group: 'xp2' }),
  xn(5, 'compensation', xr`The sample is to be converted into p-type with a hole concentration of $4\times10^{21}\ \mathrm{m^{-3}}$ by adding acceptors. How many acceptors per $\mathrm{m^3}$, in units of $10^{21}$, must be added?`, 8, 0, () => (4e21 + 4e21) / 1e21,
    xr`Acceptors must first cancel the donors ($4\times10^{21}$) and then supply the holes: $N_A = N_D + p = 4\times10^{21} + 4\times10^{21} = 8\times10^{21}\ \mathrm{m^{-3}}$ (answer 8).`, { format: 'passage', group: 'xp2', trap: 'Adding only 4×10²¹ makes the crystal intrinsic, not p-type.' }),
  xm(5, 'LED', 'xm7', xr`LEDs are made from semiconductors with the band gaps in List I. Match each with the wavelength of the light emitted, $\lambda\approx1240/E_g$ nm with $E_g$ in eV.`, { A: 'p', B: 'q', C: 'r', D: 's' },
    xr`A: $1240/1.9 = 653$ nm (p). B: $1240/2.5 = 496$ nm (q). C: $1240/1.1 = 1127$ nm, infrared (r). D: $1240/3.1 = 400$ nm (s). The 310 nm would need a 4 eV gap.`),
];

const XB = (n) => (a, b) => (n ? a : b);
const xgens = [
  { id: 'sc-g20', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'Zener regulator',
    make(rng) {
      const vz = xchoose(rng, [6, 9, 12]), extra = xchoose(rng, [6, 9, 12]), rs = xchoose(rng, [100, 120, 150, 200]), rl = xchoose(rng, [100, 150, 200, 300, 500, 800]);
      const vin = vz + extra; const itot = (vin - vz) / rs, il = vz / rl; const reg = il < itot - 1e-12; const vout = reg ? vz : vin * rl / (rs + rl);
      if (Math.abs(il - itot) < 1e-9) return xgens[0].make(rng);
      return { vz, vin, rs, rl, answer: +vout.toFixed(2), tol: 0.02, unit: 'V',
        q: `A ${vz} V Zener diode is connected across a ${rl} Ω load and fed from a ${vin} V supply through a ${rs} Ω series resistor. Find the load voltage in V.`,
        sol: `If the Zener conducts, the series resistor carries (${vin} − ${vz})/${rs} = ${xfmt(itot * 1000, 4)} mA and the load needs ${vz}/${rl} = ${xfmt(il * 1000, 4)} mA. ${reg ? `The supply can give more than the load needs, so the Zener is in breakdown and the output is ${vz} V.` : `The load needs more than the supply can give, so the Zener is not in breakdown (open) and the load is a divider: ${vin}×${rl}/(${rs}+${rl}) = ${xfmt(vout, 4)} V.`}` };
    },
    verify: (p) => { const vt = p.vin * p.rl / (p.rs + p.rl); return vt >= p.vz ? p.vz : vt; } },
  { id: 'sc-g21', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'transistor currents',
    make(rng) {
      const beta = xchoose(rng, [50, 80, 100, 120]), ib = xchoose(rng, [20, 40, 50, 60]); const ie = (1 + beta) * ib / 1000;
      return { beta, ib, answer: +ie.toFixed(3), tol: 0.002, unit: 'mA',
        q: `A transistor in the common-emitter mode has β = ${beta} and a base current of ${ib} μA. Find the emitter current in mA.`,
        sol: `I_C = βI_B = ${beta}×${ib} μA = ${xfmt(beta * ib / 1000, 4)} mA. I_E = I_B + I_C = ${xfmt(ib / 1000, 4)} + ${xfmt(beta * ib / 1000, 4)} = ${xfmt(ie, 5)} mA.` };
    },
    verify: (p) => { const alpha = p.beta / (1 + p.beta); return (p.beta * p.ib / 1000) / alpha; } },
  { id: 'sc-g22', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'transistor circuit',
    make(rng) {
      const vcc = xchoose(rng, [9, 12, 15]), rc = xchoose(rng, [1, 2, 3]), ic = xchoose(rng, [1, 2, 3]); const vce = vcc - ic * rc;
      if (vce < 0.5) return xgens[2].make(rng);
      return { vcc, rc, ic, answer: vce, tol: 0.01, unit: 'V',
        q: `In a common-emitter circuit V_CC = ${vcc} V and R_C = ${rc} kΩ. The collector current is ${ic} mA. Find V_CE in V.`,
        sol: `V_CE = V_CC − I_CR_C = ${vcc} − ${ic} mA × ${rc} kΩ = ${vcc} − ${ic * rc} = ${vce} V.` };
    },
    verify: (p) => p.vcc - (p.ic / 1000) * (p.rc * 1000) },
  { id: 'sc-g23', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'LED circuit',
    make(rng) {
      const n = xchoose(rng, [1, 2, 3]), vl = xchoose(rng, [1.8, 2.0, 2.2]), i = xchoose(rng, [10, 15, 20]), r = xchoose(rng, [100, 150, 200, 220, 330]);
      const vs = +(n * vl + i * r / 1000).toFixed(2);
      return { n, vl, i, r, vs, answer: r, tol: 0, unit: 'Ω',
        q: `${n === 1 ? 'An LED' : n + ' identical LEDs in series'}, each dropping ${vl} V at ${i} mA, ${n === 1 ? 'is' : 'are'} connected with a resistor to a ${vs} V supply. What resistance, in Ω, makes the current ${i} mA?`,
        sol: `The LEDs drop ${n}×${vl} = ${xfmt(n * vl, 4)} V, leaving ${vs} − ${xfmt(n * vl, 4)} = ${xfmt(vs - n * vl, 4)} V across the resistor. R = ${xfmt(vs - n * vl, 4)}/${i / 1000} = ${r} Ω.` };
    },
    verify: (p) => Math.round((p.vs - p.n * p.vl) / (p.i / 1000)) },
  { id: 'sc-g24', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'Zener limits',
    make(rng) {
      const vz = xchoose(rng, [6, 9, 10, 12]), rs = xchoose(rng, [50, 100, 200]), il = xchoose(rng, [20, 40, 50, 100]), izm = xchoose(rng, [40, 50, 60]);
      const answer = +(vz + rs * (izm + il) / 1000).toFixed(2);
      return { vz, rs, il, izm, answer, tol: 0.02, unit: 'V',
        q: `A ${vz} V Zener diode can carry at most ${izm} mA. It regulates a load that draws ${il} mA through a series resistor of ${rs} Ω. What is the largest input voltage, in V, that keeps the Zener within its rating?`,
        sol: `The series resistor carries the Zener and load currents: V_in = V_z + R_s(I_z + I_L). With I_z = ${izm} mA: V_in = ${vz} + ${rs}×(${izm} + ${il})×10⁻³ = ${vz} + ${xfmt(rs * (izm + il) / 1000, 4)} = ${xfmt(answer, 4)} V.` };
    },
    verify: (p) => { const itotal = (p.izm + p.il) / 1000; return p.vz + itotal * p.rs; } },
  { id: 'sc-g25', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'solar cell',
    make(rng) {
      const voc = xchoose(rng, [0.5, 0.6, 0.7]), isc = xchoose(rng, [20, 30, 40, 50]), a = xchoose(rng, [0.8, 0.85, 0.9]), b = xchoose(rng, [0.85, 0.9, 0.95]);
      const vm = +(a * voc).toFixed(4), im = +(b * isc).toFixed(4); const answer = +(a * b).toFixed(4);
      return { voc, isc, vm, im, answer, tol: 0.005,
        q: `A solar cell has open-circuit voltage ${voc} V and short-circuit current ${isc} mA. At its maximum-power point the voltage is ${xfmt(vm, 4)} V and the current is ${xfmt(im, 4)} mA. Find its fill factor (3 decimals).`,
        sol: `Fill factor = V_mI_m/(V_ocI_sc) = (${xfmt(vm, 4)}×${xfmt(im, 4)})/(${voc}×${isc}) = ${xfmt(vm * im, 5)}/${xfmt(voc * isc, 5)} = ${xfmt(answer, 4)}.` };
    },
    verify: (p) => (p.vm * p.im) / (p.voc * p.isc) },
  { id: 'sc-g26', type: 'mcq', level: 4, exams: xex(4, 'mcq'), sub: 'gate networks',
    make(rng) {
      const NAND = (a, b) => 1 - (a & b), NOR = (a, b) => 1 - (a | b);
      const nets = [
        { d: 'The output of a NAND gate (inputs A and B) feeds both inputs of a second NAND gate.', f: (a, b) => NAND(NAND(a, b), NAND(a, b)) },
        { d: 'The output of a NOR gate (inputs A and B) feeds both inputs of a second NOR gate.', f: (a, b) => NOR(NOR(a, b), NOR(a, b)) },
        { d: 'A is fed to both inputs of NAND 1 and B to both inputs of NAND 2; the outputs of NAND 1 and NAND 2 go to NAND 3.', f: (a, b) => NAND(NAND(a, a), NAND(b, b)) },
        { d: 'A is fed to both inputs of NOR 1 and B to both inputs of NOR 2; the outputs of NOR 1 and NOR 2 go to NOR 3.', f: (a, b) => NOR(NOR(a, a), NOR(b, b)) },
        { d: 'The output of an AND gate (inputs A and B) goes to a NOT gate.', f: (a, b) => 1 - (a & b) },
        { d: 'A OR gate (inputs A and B) is followed by a NOT gate.', f: (a, b) => 1 - (a | b) },
      ];
      const names = { AND: (a, b) => a & b, OR: (a, b) => a | b, NAND, NOR };
      const vid = int(rng, 0, nets.length - 1); const net = nets[vid];
      const nameOf = (f) => Object.keys(names).find((k) => [[0, 0], [0, 1], [1, 0], [1, 1]].every(([a, b]) => f(a, b) === names[k](a, b)));
      const name = nameOf(net.f); const o = xsh(rng, name, ['AND', 'OR', 'NAND', 'NOR'].filter((x) => x !== name));
      return { vid, options: o.options, answer: o.answer, q: `${net.d} The whole circuit behaves as a`,
        sol: `Work out the truth table for (A,B) = (0,0), (0,1), (1,0), (1,1): ${[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => net.f(a, b)).join(', ')}. That is the table of the ${name} gate.` };
    },
    verify: (p) => { const nets = [(a, b) => 1 - (1 - (a & b)) & 1, (a, b) => 1 - (1 - (a | b)), (a, b) => a | b, (a, b) => a & b, (a, b) => 1 - (a & b), (a, b) => 1 - (a | b)]; const tt = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => nets[p.vid](a, b)).join(''); const map = { '0001': 'AND', '0111': 'OR', '1110': 'NAND', '1000': 'NOR' }; return p.options.indexOf(map[tt]); } },
  { id: 'sc-g27', type: 'nat', level: 4, exams: xex(4, 'nat'), sub: 'counting input combinations',
    make(rng) {
      const n = xchoose(rng, [4, 5]), k = xchoose(rng, [2, 3]); let cnt = 0; const C = (a, b) => { let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return Math.round(r); };
      for (let j = k; j <= n; j++) cnt += C(n, j);
      return { n, k, answer: cnt, tol: 0,
        q: `A logic circuit has ${n} inputs and its output is 1 when at least ${k} of the inputs are 1. For how many of the ${2 ** n} input combinations is the output 1?`,
        sol: `Count combinations with j high inputs for j = ${k} to ${n}: ${Array.from({ length: n - k + 1 }, (_, i) => `C(${n},${k + i}) = ${C(n, k + i)}`).join(', ')}. Total = ${cnt}.` };
    },
    verify: (p) => { let c = 0; for (let i = 0; i < 2 ** p.n; i++) { let s = 0; for (let j = 0; j < p.n; j++) s += (i >> j) & 1; if (s >= p.k) c++; } return c; } },
  { id: 'sc-g28', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'peak inverse voltage',
    make(rng) {
      const v = xchoose(rng, [20, 30, 40, 60]); const answer = +(Math.SQRT2 * v).toFixed(2);
      return { v, answer, tol: 0.05, unit: 'V',
        q: `A centre-tapped full-wave rectifier uses a transformer whose whole secondary gives ${v} V r.m.s. Find the peak inverse voltage across each ideal diode, in V (1 decimal).`,
        sol: `Each half of the secondary has ${v / 2} V r.m.s., peak ${xfmt(v / 2 * Math.SQRT2, 4)} V. The non-conducting diode sees the whole secondary's peak: PIV = 2 × ${xfmt(v / 2 * Math.SQRT2, 4)} = ${xfmt(answer, 4)} V.` };
    },
    verify: (p) => 2 * (p.v / 2) * Math.SQRT2 },
  { id: 'sc-g29', type: 'nat', level: 3, exams: xex(3, 'nat'), sub: 'dynamic resistance',
    make(rng) {
      const dv = xchoose(rng, [0.02, 0.04, 0.05, 0.06]), di = xchoose(rng, [2, 4, 5, 8, 10, 12]); const answer = +(dv / di * 1000).toFixed(3);
      return { dv, di, answer, tol: 0.01, unit: 'Ω',
        q: `On the forward characteristic of a diode, a rise of ${dv} V in the voltage produces a rise of ${di} mA in the current. Find the dynamic resistance in Ω.`,
        sol: `r = ΔV/ΔI = ${dv} V/${di} × 10⁻³ A = ${xfmt(answer, 4)} Ω.` };
    },
    verify: (p) => p.dv / (p.di / 1000) },
  { id: 'sc-g30', type: 'nat', level: 5, exams: xex(5, 'nat'), sub: 'compensated semiconductor',
    make(rng) {
      const nd = xchoose(rng, [5, 6, 8]), na = xchoose(rng, [1, 2, 3]); const net = (nd - na) * 1e21; const p = (1.5e16) ** 2 / net; const answer = +(p / 1e10).toFixed(2);
      return { nd, na, answer, tol: Math.max(0.02, answer * 0.01), unit: '10¹⁰ m⁻³',
        q: `Silicon with n_i = 1.5×10¹⁶ m⁻³ is doped with ${nd}×10²¹ m⁻³ donors and ${na}×10²¹ m⁻³ acceptors, all ionised. Find the hole concentration in units of 10¹⁰ m⁻³.`,
        sol: `Net donors = (${nd} − ${na})×10²¹ = ${nd - na}×10²¹ m⁻³, so n ≈ ${nd - na}×10²¹. Mass action: p = n_i²/n = 2.25×10³²/(${nd - na}×10²¹) = ${xfmt(p / 1e10, 4)}×10¹⁰ m⁻³.` };
    },
    verify: (p) => { const d = (p.nd - p.na) * 1e21; const n = (d + Math.sqrt(d * d + 4 * (1.5e16) ** 2)) / 2; return (1.5e16) ** 2 / n / 1e10; } },
  { id: 'sc-g31', type: 'mcq', level: 2, exams: xex(2, 'mcq'), sub: 'doping',
    make(rng) {
      const n = ['phosphorus', 'arsenic', 'antimony'], p = ['boron', 'aluminium', 'gallium', 'indium'];
      const host = xchoose(rng, ['silicon', 'germanium']); const isN = rng() < 0.5; const imp = xchoose(rng, isN ? n : p);
      const correct = isN ? 'n-type, with electrons as the majority carriers' : 'p-type, with holes as the majority carriers';
      const o = xsh(rng, correct, [isN ? 'p-type, with holes as the majority carriers' : 'n-type, with electrons as the majority carriers', isN ? 'n-type, with holes as the majority carriers' : 'p-type, with electrons as the majority carriers', 'intrinsic, with equal numbers of electrons and holes']);
      return { host, imp, isN, options: o.options, answer: o.answer,
        q: `A crystal of ${host} is doped with a small amount of ${imp}. It becomes`,
        sol: `${imp[0].toUpperCase() + imp.slice(1)} is ${isN ? 'pentavalent (5 valence electrons), a donor: the extra electron is free to move' : 'trivalent (3 valence electrons), an acceptor: it leaves a hole in a bond'}. The ${host} becomes ${correct}.` };
    },
    verify: (p) => p.options.indexOf(p.isN ? 'n-type, with electrons as the majority carriers' : 'p-type, with holes as the majority carriers') },
];

export default { topic: 'semiconductors', groups: { ...groups, ...xgroups }, items: [...items, ...xitems], gens: [...gens, ...xgens] };
