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
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const N = (x, dp) => +x.toFixed(dp);
const PI = Math.PI; const SQ2 = Math.SQRT2;
const W = (f) => 2 * PI * f;
let k = 0; let c = 0;
const nid = () => `ac-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
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
const cnt = (level, sub, q, list, n, sol, o = {}) => {
  const opts = ['Only one', 'Only two', 'Only three', 'All four'];
  return base(level, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((s, i) => `(${i + 1}) ${s}`).join('<br>')}`, options: opts, answer: n - 1, sol, ...o });
};
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
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'rms value', r`The rms value of an alternating current $i = I_0\sin\omega t$ is`, r`$I_0/\sqrt2$`, [r`$I_0/2$`, r`$\sqrt2\,I_0$`, r`$2I_0/\pi$`],
    r`The rms value is the steady current that gives the same heating as the AC. Averaging $i^2R$ over a cycle gives $\tfrac12I_0^2R$, so $I_{rms} = I_0/\sqrt2 \approx 0.707\,I_0$. $2I_0/\pi$ is the mean over half a cycle.`),
  nat(1, 'rms and peak', r`The rms value of the mains voltage is 230 V. Find its peak value (in V, nearest whole number).`, 230 * SQ2, 1, 0,
    r`$V_0 = \sqrt2\,V_{rms} = 1.414\times230 = 325$ V.`, { unit: 'V' }),
  mcq(1, 'average value', r`The average value of a sinusoidal alternating current over one full cycle is`, 'zero', [r`$I_0/\sqrt2$`, r`$2I_0/\pi$`, r`$I_0/2$`],
    r`The positive half cycle cancels the negative half cycle exactly, so the mean over a full cycle is zero. This is why we use the rms value, which does not cancel.`),
  mcq(1, 'meters', r`The reading of an AC ammeter or voltmeter in a house circuit is the`, 'rms value', ['peak value', 'average value over a full cycle', 'peak-to-peak value'],
    r`AC meters are calibrated to show the rms value, because that is what decides heating and power. The mains "230 V" is an rms value.`),
  nat(1, 'frequency and period', r`Mains supply has a frequency of 50 Hz. Find its time period (in ms).`, 1000 / 50, 0, 0,
    r`$T = 1/f = 1/50 = 0.02$ s $= 20$ ms.`, { unit: 'ms' }),
  mcq(1, 'reactance', r`The SI unit of inductive reactance is`, 'ohm', ['henry', 'farad', 'ohm per metre'],
    r`Reactance is a voltage-to-current ratio, so it is measured in ohm, like resistance. Henry is the unit of inductance and farad of capacitance.`),
  nat(1, 'inductive reactance', r`Find the inductive reactance of a 0.2 H inductor at 50 Hz (in $\Omega$, 1 decimal).`, W(50) * 0.2, 0.1, 1,
    r`$X_L = \omega L = 2\pi fL = 2\pi\times50\times0.2 = ${S(W(50) * 0.2, 4)}\ \Omega$.`, { unit: 'Ω' }),
  nat(1, 'capacitive reactance', r`Find the capacitive reactance of a 50 $\mu$F capacitor at 50 Hz (in $\Omega$, 1 decimal).`, 1 / (W(50) * 50e-6), 0.1, 1,
    r`$X_C = \dfrac{1}{\omega C} = \dfrac{1}{2\pi\times50\times50\times10^{-6}} = ${S(1 / (W(50) * 50e-6), 4)}\ \Omega$.`, { unit: 'Ω', trap: 'Convert microfarad to farad: 50 μF = 50 × 10^-6 F.' }),
  mcq(1, 'inductor phase', r`In a purely inductive AC circuit, the current`, 'lags the voltage by $\\pi/2$', ['leads the voltage by $\\pi/2$', 'is in phase with the voltage', 'lags the voltage by $\\pi$'],
    r`The inductor's emf opposes any change of current, so the current reaches its peak a quarter cycle after the voltage. Remember: in an inductor the voltage leads (ELI the ICE man: $E$ before $I$ in L).`),
  mcq(1, 'capacitor phase', r`In a purely capacitive AC circuit, the current`, 'leads the voltage by $\\pi/2$', ['lags the voltage by $\\pi/2$', 'is in phase with the voltage', 'is zero all the time'],
    r`The current is $dq/dt = C\,dV/dt$. It is maximum when the voltage is changing fastest, which is when the voltage is zero: a quarter cycle before the voltage peak. In a capacitor, current leads (ICE).`),
  mcq(1, 'resistor phase', r`In an AC circuit with only a resistor, the phase difference between voltage and current is`, 'zero', ['$\\pi/2$', '$\\pi/4$', '$\\pi$']  ,
    r`By Ohm's law $i = v/R$ at every instant, so the two rise and fall together: they are in phase.`),
  mcq(1, 'resonance', r`The resonant frequency of a series LCR circuit is`, r`$\dfrac{1}{2\pi\sqrt{LC}}$`, [r`$\dfrac{1}{2\pi LC}$`, r`$2\pi\sqrt{LC}$`, r`$\dfrac{1}{2\pi}\sqrt{\dfrac{L}{C}}$`],
    r`At resonance $X_L = X_C$, so $\omega L = 1/\omega C$ and $\omega_0 = 1/\sqrt{LC}$, giving $f_0 = \dfrac{1}{2\pi\sqrt{LC}}$.`),
  nat(1, 'resonant frequency', r`A series LCR circuit has $L = 10$ mH and $C = 10\ \mu$F. Find its resonant frequency (in Hz, nearest whole number).`, 1 / (2 * PI * Math.sqrt(10e-3 * 10e-6)), 1, 0,
    r`$f_0 = \dfrac{1}{2\pi\sqrt{LC}}$. $LC = 10^{-2}\times10^{-5} = 10^{-7}$, $\sqrt{LC} = 3.162\times10^{-4}$ s. $f_0 = \dfrac{1}{2\pi\times3.162\times10^{-4}} = 503$ Hz.`, { unit: 'Hz' }),
  mcq(1, 'transformer', r`A step-up transformer has`, 'more turns in the secondary than in the primary', ['more turns in the primary than in the secondary', 'an equal number of turns in both coils', 'a permanent magnet as its core'],
    r`$V_s/V_p = N_s/N_p$. To raise the voltage, the secondary needs more turns. A step-up transformer lowers the current in the same ratio.`),
  nat(1, 'transformer', r`A transformer has 1000 turns in its primary and 100 turns in its secondary. The primary is connected to a 220 V AC supply. Find the secondary voltage (in V).`, 22, 0, 0,
    r`$V_s = V_p\dfrac{N_s}{N_p} = 220\times\dfrac{100}{1000} = 22$ V. It is a step-down transformer.`, { unit: 'V' }),
  mcq(1, 'capacitor and DC', r`A capacitor is connected to a steady DC source in series with a lamp. After the capacitor has charged, the lamp`, 'does not glow', ['glows steadily', 'glows brighter and brighter', 'flickers'],
    r`For DC, $f = 0$ and $X_C = 1/\omega C \to \infty$: a capacitor blocks steady current once it is charged. It passes AC.`),
  nat(1, 'impedance', r`A series circuit has a resistance of $30\ \Omega$ and a net reactance of $40\ \Omega$. Find its impedance (in $\Omega$).`, 50, 0, 0,
    r`$Z = \sqrt{R^2 + X^2} = \sqrt{30^2 + 40^2} = \sqrt{2500} = 50\ \Omega$.`, { unit: 'Ω', trap: 'Resistance and reactance add at right angles, not directly.' }),
  mcq(1, 'power in an inductor', r`The average power consumed by an ideal inductor connected to an AC source over a full cycle is`, 'zero', [r`$\tfrac12V_0I_0$`, r`$V_{rms}I_{rms}$`, r`$I_{rms}^2\omega L$`],
    r`Energy goes into the magnetic field in one quarter cycle and comes back in the next. Here $\phi = 90^\circ$, so $\cos\phi = 0$ and $P_{av} = V_{rms}I_{rms}\cos\phi = 0$.`),
  mcq(1, 'transmission', r`Electric power is sent over long distances at very high voltage mainly because`, r`the current is then small and the $I^2R$ loss in the wires is small`, ['the resistance of wire falls at high voltage', 'high voltage travels faster in the wire', 'transformers work only at high voltage'],
    r`For a given power $P = VI$, a higher $V$ means a smaller $I$. The loss in the wires is $I^2R = (P/V)^2R$, so doubling the voltage cuts the loss to a quarter.`),
  nat(1, 'rms from equation', r`The current in a circuit is $i = 4\sin(314t)$ ampere. Find its rms value (in A, 2 decimals).`, 4 / SQ2, 0.01, 2,
    r`The peak value is $I_0 = 4$ A, so $I_{rms} = 4/\sqrt2 = 2.83$ A. (The 314 is $\omega$, giving $f = 50$ Hz.)`, { unit: 'A' }),
  mcq(1, 'transformer and DC', r`A transformer will not work with a DC supply because`, 'a steady current gives a constant flux and no emf in the secondary', ['DC has too low a voltage', 'DC cannot flow in a coil', 'the core would melt at once'],
    r`Induction needs a changing flux. A steady DC produces a constant flux, so $d\Phi/dt = 0$ and no emf is induced in the secondary.`),
  // ---------- Level 2 ----------
  nat(2, 'reading an equation', r`A voltage is $v = 311\sin(100\pi t)$ volt. Find its frequency (in Hz).`, 50, 0, 0,
    r`Compare with $v = V_0\sin\omega t$: $\omega = 100\pi\ \mathrm{rad\,s^{-1}}$, so $f = \omega/2\pi = 50$ Hz.`, { unit: 'Hz' }),
  nat(2, 'reading an equation', r`A voltage is $v = 200\sqrt2\sin(314t)$ volt. Find its rms value (in V).`, 200, 0, 0,
    r`The peak value is $200\sqrt2$ V, so $V_{rms} = V_0/\sqrt2 = 200$ V.`, { unit: 'V' }),
  nat(2, 'time to reach rms value', r`A 50 Hz current $i = I_0\sin\omega t$ starts from zero at $t = 0$. How long does it take to reach its rms value for the first time (in ms, 1 decimal)?`, 20 / 8, 0.05, 1,
    r`$I_0\sin\omega t = I_0/\sqrt2$ gives $\omega t = \pi/4$, so $t = T/8 = 20/8 = 2.5$ ms.`, { unit: 'ms', trap: 'The rms value is reached at 45 degrees of phase, not 90.' }),
  nat(2, 'resistor on AC', r`A heater of resistance $55\ \Omega$ is connected to a 220 V rms supply. Find the average power it consumes (in W).`, 220 * 220 / 55, 0, 0,
    r`$P = V_{rms}^2/R = 220^2/55 = 880$ W. The current is $220/55 = 4$ A rms.`, { unit: 'W' }),
  nat(2, 'series LR', r`A coil of resistance $30\ \Omega$ and inductive reactance $40\ \Omega$ at 50 Hz is connected to 220 V, 50 Hz mains. Find the rms current (in A, 1 decimal).`, 220 / 50, 0.05, 1,
    r`$Z = \sqrt{30^2 + 40^2} = 50\ \Omega$. $I_{rms} = V/Z = 220/50 = 4.4$ A.`, { unit: 'A' }),
  nat(2, 'phase in series LR', r`For the same coil ($R = 30\ \Omega$, $X_L = 40\ \Omega$), find the angle by which the current lags the applied voltage (in degrees, 1 decimal).`, Math.atan(40 / 30) * 180 / PI, 0.1, 1,
    r`$\tan\phi = X_L/R = 40/30 = 1.333$, so $\phi = 53.1^\circ$. The current lags the voltage by this angle.`, { unit: '°' }),
  nat(2, 'power in series LR', r`For the same coil on 220 V mains (current 4.4 A), find the average power consumed (in W, nearest whole number).`, 4.4 * 4.4 * 30, 1, 0,
    r`Only the resistance dissipates power: $P = I^2R = 4.4^2\times30 = 581$ W. Check: $VI\cos\phi = 220\times4.4\times0.6 = 580.8$ W.`, { unit: 'W' }),
  nat(2, 'series RC', r`A $60\ \Omega$ resistor is in series with a capacitor of reactance $80\ \Omega$ across a 100 V rms supply. Find the rms current (in A).`, 1, 0.005, 2,
    r`$Z = \sqrt{60^2 + 80^2} = 100\ \Omega$ and $I = 100/100 = 1.00$ A. The current leads the voltage with $\tan\phi = 80/60$.`, { unit: 'A' }),
  nat(2, 'capacitor on AC', r`A 100 $\mu$F capacitor is connected to a 220 V, 50 Hz supply. Find the rms current (in A, 2 decimals).`, 220 * W(50) * 100e-6, 0.01, 2,
    r`$I = V/X_C = V\omega C = 220\times314.16\times10^{-4} = 6.91$ A.`, { unit: 'A' }),
  nat(2, 'inductor on AC', r`A pure inductor of 0.5 H is connected to a 100 V, 50 Hz supply. Find the rms current (in A, 3 decimals).`, 100 / (W(50) * 0.5), 0.003, 3,
    r`$X_L = 2\pi\times50\times0.5 = 157.1\ \Omega$. $I = 100/157.1 = 0.637$ A.`, { unit: 'A' }),
  nat(2, 'current at resonance', r`A series LCR circuit with $R = 20\ \Omega$ is connected to a 100 V rms source whose frequency equals the resonant frequency. Find the rms current (in A).`, 5, 0, 0,
    r`At resonance $X_L = X_C$, so $Z = R = 20\ \Omega$ and $I = 100/20 = 5$ A. This is the largest current the circuit can carry for this source.`, { unit: 'A' }),
  nat(2, 'effect of frequency change', r`In a series circuit, $R = 45\ \Omega$ and at frequency $f$ the reactances are $X_L = 40\ \Omega$ and $X_C = 40\ \Omega$. The frequency is now doubled. Find the impedance (in $\Omega$).`, Math.hypot(45, 80 - 20), 0, 0,
    r`$X_L \propto f$ doubles to $80\ \Omega$ and $X_C \propto 1/f$ halves to $20\ \Omega$. Net reactance $= 60\ \Omega$. $Z = \sqrt{45^2 + 60^2} = 75\ \Omega$.`, { unit: 'Ω', trap: 'Inductive reactance doubles but capacitive reactance halves.' }),
  nat(2, 'Q factor', r`A series LCR circuit has $L = 0.1$ H, $C = 10\ \mu$F and $R = 5\ \Omega$. Find its quality factor.`, Math.sqrt(0.1 / 10e-6) / 5, 0, 0,
    r`$\omega_0 = 1/\sqrt{LC} = 1/\sqrt{10^{-6}} = 1000\ \mathrm{rad\,s^{-1}}$. $Q = \omega_0L/R = 1000\times0.1/5 = 20$. Equivalently $Q = \dfrac1R\sqrt{L/C} = \dfrac{100}{5} = 20$.`),
  nat(2, 'bandwidth', r`A series resonant circuit has $f_0 = 1000$ Hz and $Q = 50$. Find its bandwidth (in Hz).`, 1000 / 50, 0, 0,
    r`$\Delta f = f_0/Q = 1000/50 = 20$ Hz. A higher $Q$ gives a narrower, sharper resonance.`, { unit: 'Hz' }),
  nat(2, 'power factor', r`A circuit draws 10 A from a 220 V rms supply and consumes 1100 W on average. Find its power factor.`, 1100 / (220 * 10), 0.005, 2,
    r`$P = VI\cos\phi$, so $\cos\phi = \dfrac{1100}{220\times10} = 0.50$.`),
  nat(2, 'wattless current', r`An AC circuit carries 10 A rms and has a power factor of 0.6. Find its wattless (reactive) current component (in A).`, 8, 0.005, 2,
    r`The power-doing component is $I\cos\phi = 6$ A. The wattless component is $I\sin\phi = 10\times\sqrt{1 - 0.36} = 10\times0.8 = 8.00$ A.`, { unit: 'A' }),
  nat(2, 'half-wave rectified current', r`A half-wave rectified current has a peak value of 10 A. Find its rms value (in A).`, 5, 0.005, 2,
    r`Only half of each cycle carries current, so $I_{rms}^2 = \tfrac12\cdot\tfrac{I_0^2}{2}$, giving $I_{rms} = I_0/2 = 5.00$ A.`, { unit: 'A', trap: 'For a half-wave it is I0/2, not I0/√2.' }),
  nat(2, 'full-wave average', r`A full-wave rectified sine wave has a peak value of 10 A. Find its mean value over a cycle (in A, 2 decimals).`, 20 / PI, 0.01, 2,
    r`Mean of $|\sin\omega t|$ is $2/\pi$, so $I_{av} = 2I_0/\pi = 20/\pi = 6.37$ A.`, { unit: 'A' }),
  nat(2, 'transformer efficiency', r`A transformer delivers 90 W to its load and is 90 % efficient. Find the power drawn from the mains (in W).`, 100, 0, 0,
    r`Efficiency $= P_{out}/P_{in}$, so $P_{in} = 90/0.9 = 100$ W. The remaining 10 W is lost as heat in the windings and core.`, { unit: 'W' }),
  nat(2, 'transformer currents', r`An ideal transformer steps 220 V down to 22 V and the load draws 10 A. Find the primary current (in A).`, 1, 0.005, 2,
    r`Ideal: $V_pI_p = V_sI_s$, so $I_p = 22\times10/220 = 1.00$ A. Voltage falls by 10, so current rises by 10 on the secondary.`, { unit: 'A' }),
  nat(2, 'LC oscillation', r`An LC circuit has $L = 1$ mH and $C = 10\ \mu$F. Find the frequency of its free oscillations (in Hz, nearest whole number).`, 1 / (2 * PI * Math.sqrt(1e-3 * 10e-6)), 1, 0,
    r`$f = \dfrac{1}{2\pi\sqrt{LC}}$. $LC = 10^{-8}$, $\sqrt{LC} = 10^{-4}$. $f = \dfrac{10^4}{2\pi} = 1592$ Hz.`, { unit: 'Hz' }),
  nat(2, 'LC energy', r`A 2 $\mu$F capacitor charged to 100 V is connected across an ideal inductor. Find the maximum energy stored in the inductor (in mJ).`, 0.5 * 2e-6 * 1e4 * 1e3, 0.05, 1,
    r`With no resistance the energy stays in the circuit. Initially $U = \tfrac12CV^2 = \tfrac12\times2\times10^{-6}\times10^4 = 10^{-2}$ J $= 10$ mJ. At the instant of maximum current all of it is in the inductor.`, { unit: 'mJ' }),
  nat(2, 'LC maximum current', r`A 2 $\mu$F capacitor charged to 10 V is joined to a 0.5 H inductor. Find the maximum current (in mA).`, 10 * Math.sqrt(2e-6 / 0.5) * 1e3, 0.05, 1,
    r`$\tfrac12LI_0^2 = \tfrac12CV_0^2$, so $I_0 = V_0\sqrt{C/L} = 10\times\sqrt{4\times10^{-6}} = 10\times2\times10^{-3} = 0.020$ A $= 20$ mA.`, { unit: 'mA' }),
  nat(2, 'reactance and frequency', r`The capacitive reactance of a capacitor is $100\ \Omega$ at 50 Hz. Find its reactance at 200 Hz (in $\Omega$).`, 25, 0, 0,
    r`$X_C \propto 1/f$. Frequency becomes 4 times, so $X_C$ falls to $100/4 = 25\ \Omega$.`, { unit: 'Ω' }),
  mcq(2, 'choke coil', r`A choke coil is preferred to a resistor for reducing the current in an AC circuit because`, 'it reduces current with almost no loss of energy', ['it has a lower reactance', 'it increases the frequency', 'it makes the voltage rise'],
    r`A resistor wastes energy as heat ($I^2R$). An ideal choke has almost no resistance but a large reactance $\omega L$, so it limits the current while its average power consumption is nearly zero. It works only for AC.`),
  nat(2, 'power loss in transmission', r`A power of 100 kW is sent at 2000 V through a line of total resistance $5\ \Omega$. Find the power lost in the line (in kW, 1 decimal).`, (100e3 / 2000) ** 2 * 5 / 1e3, 0.05, 1,
    r`$I = P/V = 100\,000/2000 = 50$ A. Loss $= I^2R = 50^2\times5 = 12\,500$ W $= 12.5$ kW.`, { unit: 'kW' }),
  nat(2, 'average power from peaks', r`A circuit has $V_0 = 200$ V, $I_0 = 5$ A and the current lags the voltage by $60^\circ$. Find the average power (in W).`, 0.5 * 200 * 5 * 0.5, 0, 0,
    r`$P_{av} = V_{rms}I_{rms}\cos\phi = \tfrac12V_0I_0\cos\phi = \tfrac12\times200\times5\times0.5 = 250$ W.`, { unit: 'W' }),
  mcq(2, 'voltages at resonance', r`In a series LCR circuit at resonance, which statement is correct?`, 'the voltages across L and C are equal in size and opposite in phase', ['the voltage across L is zero', 'the current is zero', 'the voltage across R is zero'],
    r`$X_L = X_C$, so $V_L = IX_L = IX_C = V_C$, and they are $180^\circ$ apart, so they cancel. The supply voltage appears entirely across $R$, and the current is maximum.`),
  nat(2, 'voltmeter readings', r`In a series LCR circuit the voltmeters across R, L and C read 30 V, 80 V and 40 V. Find the supply voltage (in V).`, Math.hypot(30, 80 - 40), 0, 0,
    r`$V = \sqrt{V_R^2 + (V_L - V_C)^2} = \sqrt{30^2 + 40^2} = 50$ V. The readings do not add directly. Note $V_L = 80$ V is larger than the 50 V supply: that is possible because $V_L$ and $V_C$ partly cancel.`, { unit: 'V', trap: 'Add the voltages as phasors, not as numbers.' }),
  mcq(2, 'LC series power factor', r`A series circuit has an ideal inductor and an ideal capacitor and no resistance. Its power factor is`, 'zero', ['one', '0.5', 'infinite'],
    r`With $R = 0$, $\cos\phi = R/Z = 0$ (current is $90^\circ$ out of phase with voltage). No average power is consumed.`),
  mcq(2, 'iron core in an inductor', r`A lamp is in series with an air-core coil on an AC supply. An iron rod is slid into the coil. The lamp then`, 'becomes dimmer', ['becomes brighter', 'glows just as before', 'goes off at once and stays off for DC too'],
    r`The iron raises $L$ (by a factor of the relative permeability), so $X_L = \omega L$ rises, the impedance rises and the current falls: the lamp dims. With a DC supply, the iron would make no difference to the steady current.`),
  nat(2, 'instantaneous value', r`An emf is $e = 100\sin(100\pi t)$ volt. Find its value at $t = 1/600$ s (in V).`, 100 * Math.sin(PI / 6), 0, 0,
    r`$100\pi\times\dfrac{1}{600} = \dfrac{\pi}{6}$. $e = 100\sin30^\circ = 50$ V.`, { unit: 'V', trap: 'The argument is in radians.' }),
  mcq(2, 'bulb on AC and DC', r`A bulb glows with the same brightness when connected to a 100 V DC supply or to an AC supply. The peak value of the AC supply is`, r`$100\sqrt2$ V`, ['100 V', '50 V', '$100/\sqrt2$ V'],
    r`Equal brightness means equal average power, so the rms AC voltage equals 100 V. The peak is $\sqrt2\times100 = 141$ V.`),
  mcq(2, 'phasor', r`In a phasor diagram of a series LCR circuit, the phasors of $V_L$ and $V_C$ are`, 'opposite in direction', ['in the same direction', 'at right angles', 'both in phase with the current'],
    r`Taking the current as reference, $V_R$ is along it, $V_L$ leads by $90^\circ$ and $V_C$ lags by $90^\circ$. So $V_L$ and $V_C$ point in opposite directions.`),
  // ---------- Level 3 ----------
  nat(3, 'rms of DC plus AC', r`A current is $i = 3 + 4\sin\omega t$ ampere. Find its rms value (in A, 2 decimals).`, Math.sqrt(9 + 8), 0.01, 2,
    r`$I_{rms}^2 = \overline{i^2} = 3^2 + 2\times3\times4\,\overline{\sin\omega t} + 16\,\overline{\sin^2\omega t} = 9 + 0 + 8 = 17$. $I_{rms} = \sqrt{17} = 4.12$ A.`, { unit: 'A', trap: 'The rms of a sum is not the sum of the rms values (3 + 2.83).' }),
  nat(3, 'rms of two components', r`A current is $i = 3\sin\omega t + 4\cos\omega t$ ampere. Find its rms value (in A, 2 decimals).`, 5 / SQ2, 0.01, 2,
    r`Both terms have the same frequency, so they combine into one sinusoid of amplitude $\sqrt{3^2 + 4^2} = 5$ A (the phasors are at right angles). $I_{rms} = 5/\sqrt2 = 3.54$ A.`, { unit: 'A' }),
  nat(3, 'average over half cycle', r`The peak value of an alternating current is 5 A. Find its mean value over the first half cycle (in A, 2 decimals).`, 10 / PI, 0.01, 2,
    r`$I_{av} = \dfrac{1}{T/2}\int_0^{T/2}I_0\sin\omega t\,dt = \dfrac{2I_0}{\pi} = \dfrac{10}{\pi} = 3.18$ A. Over the full cycle it would be zero.`, { unit: 'A' }),
  nat(3, 'time to reach half the peak', r`A 50 Hz current $I_0\sin\omega t$ starts from zero. After how long does it first reach half its peak value (in ms, 3 decimals)?`, 20 / 12, 0.005, 3,
    r`$\sin\omega t = \tfrac12$ gives $\omega t = \pi/6$, so $t = T/12 = 20/12 = 1.667$ ms.`, { unit: 'ms', trap: 'Half the peak is 30 degrees of phase, not 45 degrees.' }),
  nat(3, 'bulb on lower voltage', r`A 100 W, 220 V bulb is run on a 110 V AC supply. Taking its resistance as constant, find the power it consumes (in W).`, 25, 0, 0,
    r`$P = V^2/R$ with $R$ fixed. Halving the voltage cuts the power to a quarter: $P = 100/4 = 25$ W.`, { unit: 'W' }),
  nat(3, 'lamp with a choke', r`A lamp rated 60 W, 120 V is to be run from 240 V, 50 Hz mains using an ideal inductor in series. Find the inductance needed (in H, 2 decimals).`, 1.3231893, 0.01, 2,
    r`Lamp resistance $R = V^2/P = 120^2/60 = 240\ \Omega$, rated current $I = 60/120 = 0.5$ A. The lamp voltage (120 V, across R) and the inductor voltage are at right angles: $V_L = \sqrt{240^2 - 120^2} = 207.8$ V. $X_L = V_L/I = 415.7\ \Omega$, so $L = X_L/2\pi f = 415.7/314.16 = 1.32$ H. A plain resistor would need $240\ \Omega$ and waste 60 W; the choke wastes almost nothing.`, { unit: 'H', trap: 'Voltages across R and L do not add arithmetically (120 + 120 would be wrong).' }),
  nat(3, 'voltage across C at resonance', r`A series circuit with $R = 10\ \Omega$, $L = 0.1$ H and $C = 10\ \mu$F is driven at resonance by a 100 V rms source. Find the rms voltage across the capacitor (in V).`, 1000, 0, 0,
    r`$\omega_0 = 1/\sqrt{LC} = 1000\ \mathrm{rad\,s^{-1}}$ and $X_C = 1/\omega_0C = 100\ \Omega$. At resonance $I = V/R = 10$ A. $V_C = IX_C = 10\times100 = 1000$ V, ten times the supply. That is the quality factor $Q = 10$. The $L$ and $C$ voltages exceed the supply, yet cancel each other.`, { unit: 'V' }),
  mcq(3, 'above resonance', r`A series LCR circuit is driven at a frequency above its resonant frequency. The current then`, 'lags the applied voltage', ['leads the applied voltage', 'is in phase with the applied voltage', 'is zero'],
    r`Above $f_0$: $X_L = \omega L$ is larger than $X_C = 1/\omega C$, so the circuit is inductive and the current lags. Below $f_0$ it is capacitive and the current leads.`),
  mcq(3, 'change of capacitor', r`The capacitance of a series LCR circuit is made four times. The resonant frequency becomes`, 'half', ['double', 'one-fourth', 'four times'],
    r`$f_0 \propto 1/\sqrt{C}$. With $C$ four times, $f_0$ becomes $1/\sqrt4 = \tfrac12$ of the old value.`),
  nat(3, 'frequency where XL equals R', r`A coil of 0.5 H is in series with a $100\ \Omega$ resistor. At what frequency does the inductive reactance equal the resistance (in Hz, 1 decimal)?`, 100 / (2 * PI * 0.5), 0.1, 1,
    r`$2\pi fL = R$ gives $f = \dfrac{R}{2\pi L} = \dfrac{100}{2\pi\times0.5} = 31.8$ Hz. At this frequency the phase angle is $45^\circ$.`, { unit: 'Hz' }),
  nat(3, 'LC energy split', r`In an LC circuit the capacitor initially carries a charge of $10\ \mu$C. What is the charge on it when the energy is shared equally between the capacitor and the inductor (in $\mu$C, 2 decimals)?`, 10 / SQ2, 0.01, 2,
    r`$\dfrac{q^2}{2C} = \tfrac12\cdot\dfrac{q_0^2}{2C}$ gives $q = q_0/\sqrt2 = 7.07\ \mu$C. (The energy in the capacitor goes as $q^2$, so the charge falls to $1/\sqrt2$, not $1/2$.)`, { unit: 'μC', trap: 'Equal energy needs q0/√2, not q0/2.' }),
  nat(3, 'LC timing', r`An LC circuit has $L = 0.1$ H and $C = 10\ \mu$F. The capacitor starts fully charged. After how long is the energy first shared equally (in ms, 3 decimals)?`, 2 * PI * Math.sqrt(0.1 * 10e-6) * 1e3 / 8, 0.005, 3,
    r`$T = 2\pi\sqrt{LC} = 2\pi\sqrt{10^{-6}} = 6.283$ ms. With $q = q_0\cos\omega t$, equal energy at $\cos\omega t = 1/\sqrt2$, i.e. $\omega t = \pi/4$, $t = T/8 = 0.785$ ms.`, { unit: 'ms' }),
  nat(3, 'LC quarter period', r`For the same LC circuit ($L = 0.1$ H, $C = 10\ \mu$F, capacitor initially charged), after how long is all the energy first in the inductor (in ms, 3 decimals)?`, 2 * PI * Math.sqrt(0.1 * 10e-6) * 1e3 / 4, 0.005, 3,
    r`The capacitor is fully discharged after a quarter of a period: $t = T/4 = 6.283/4 = 1.571$ ms. The current is then maximum.`, { unit: 'ms' }),
  mcq(3, 'LC and SHM analogy', r`In the analogy between an LC circuit and a mass on a spring, the inductance $L$ corresponds to`, 'the mass', ['the spring constant', 'the displacement', 'the damping constant'],
    r`$\tfrac12LI^2 \leftrightarrow \tfrac12mv^2$ and $\tfrac{q^2}{2C} \leftrightarrow \tfrac12kx^2$. So $L \leftrightarrow m$, $1/C \leftrightarrow k$, $q \leftrightarrow x$, $I \leftrightarrow v$ and a resistance $R \leftrightarrow$ friction. Then $\omega = 1/\sqrt{LC} \leftrightarrow \sqrt{k/m}$.`),
  nat(3, 'transformer with losses', r`A transformer of 95 % efficiency steps 2200 V down to 220 V and delivers 10 kW. Find the current in the primary (in A, 2 decimals).`, 10e3 / 0.95 / 2200, 0.01, 2,
    r`$P_{in} = P_{out}/\eta = 10\,000/0.95 = 10\,526$ W. $I_p = P_{in}/V_p = 10\,526/2200 = 4.78$ A. (An ideal transformer would draw 4.55 A.)`, { unit: 'A' }),
  nat(3, 'efficiency from meter readings', r`The primary of a transformer carries 5 A at 220 V. The secondary carries 45 A at 22 V. Find the efficiency (in %).`, 990 / 1100 * 100, 0.5, 0,
    r`$P_{in} = 220\times5 = 1100$ W and $P_{out} = 22\times45 = 990$ W. $\eta = 990/1100 = 0.90 = 90$ %.`, { unit: '%' }),
  nat(3, 'effect of doubling voltage', r`A power station sends a fixed power through a line and loses 8 kW in it. If the transmission voltage is doubled, what is the new loss (in kW)?`, 2, 0, 0,
    r`Loss $= (P/V)^2R \propto 1/V^2$. Doubling $V$ divides the loss by 4: $8/4 = 2$ kW.`, { unit: 'kW' }),
  nat(3, 'percentage loss', r`A 440 kW supply is sent at 22 kV through lines of total resistance $10\ \Omega$. Find the percentage of the power lost in the lines (2 decimals).`, 0.9090909, 0.01, 2,
    r`$I = P/V = 440\,000/22\,000 = 20$ A. Loss $= I^2R = 400\times10 = 4000$ W. Fraction $= 4000/440\,000 = 0.909$ %.`, { unit: '%' }),
  nat(3, 'DC and AC together', r`A $10\ \Omega$ resistor carries a current $i = 2 + 3\sin\omega t$ ampere. Find the average power dissipated (in W).`, 85, 0, 0,
    r`$\overline{i^2} = 2^2 + \tfrac12\times3^2 = 4 + 4.5 = 8.5\ \mathrm A^2$. $P = \overline{i^2}R = 85$ W. Equivalently, DC part $4\times10 = 40$ W plus AC part $4.5\times10 = 45$ W.`, { unit: 'W', trap: 'Powers add for different frequencies; amplitudes do not.' }),
  nat(3, 'RC voltages', r`A resistor and a capacitor are in series across a 120 V AC source. The voltmeter across the resistor reads 72 V. What does the voltmeter across the capacitor read (in V)?`, 96, 0, 0,
    r`$V^2 = V_R^2 + V_C^2$, so $V_C = \sqrt{120^2 - 72^2} = \sqrt{9216} = 96$ V.`, { unit: 'V' }),
  nat(3, 'finding L from phase', r`A coil in series with a $100\ \Omega$ resistor makes the current lag by $30^\circ$ at 50 Hz. Neglecting the coil's own resistance, find its inductance (in H, 3 decimals).`, 100 * Math.tan(PI / 6) / W(50), 0.002, 3,
    r`$\tan\phi = X_L/R$ gives $X_L = 100\tan30^\circ = 57.7\ \Omega$. $L = X_L/2\pi f = 57.7/314.2 = 0.184$ H.`, { unit: 'H' }),
  nat(3, 'unity power factor', r`A coil has an inductive reactance of $100\ \Omega$ at 50 Hz. What capacitance, in series with it, makes the power factor 1 (in $\mu$F, 1 decimal)?`, 1e6 / (100 * W(50)), 0.1, 1,
    r`Unity power factor needs $X_C = X_L = 100\ \Omega$. $C = \dfrac{1}{\omega X_C} = \dfrac{1}{314.16\times100} = 31.8\ \mu$F.`, { unit: 'μF' }),
  mcq(3, 'capacitor in series with a lamp', r`A lamp is connected to AC mains. A capacitor is now connected in series with the lamp. The lamp becomes`, 'dimmer', ['brighter', 'unchanged', 'dim for DC but bright for AC'],
    r`The capacitor adds a reactance $X_C$ in quadrature with $R$: $Z = \sqrt{R^2 + X_C^2} > R$, so the current and the lamp's power fall.`),
  mcq(3, 'reactance graphs', r`Which graph correctly shows how $X_L$ and $X_C$ vary with frequency $f$?`, r`$X_L$ a straight line through the origin; $X_C$ a falling curve ($\propto 1/f$)`, [r`$X_L$ a falling curve; $X_C$ a straight line through the origin`, r`Both straight lines through the origin`, r`Both falling curves`],
    r`$X_L = 2\pi fL \propto f$ (straight line through the origin). $X_C = 1/(2\pi fC) \propto 1/f$ (hyperbola). They cross at $f_0$.`),
  nat(3, 'triangular wave', r`A current rises linearly from 0 to 6 A and falls back linearly to 0 in every period (a triangular wave, repeated). Find its rms value (in A, 2 decimals).`, 6 / Math.sqrt(3), 0.01, 2,
    r`On each ramp $i = I_0 t/\tau$, so $\overline{i^2} = I_0^2/3$ and $I_{rms} = I_0/\sqrt3 = 6/1.732 = 3.46$ A.`, { unit: 'A' }),
  nat(3, 'pulse train', r`A current is 8 A for one quarter of each period and zero for the rest. Find its rms value (in A).`, 4, 0, 0,
    r`$\overline{i^2} = \tfrac14\times8^2 = 16$, so $I_{rms} = 4$ A.`, { unit: 'A' }),
  nat(3, 'asymmetric square wave', r`A current is $+6$ A for half of each period and $-2$ A for the other half. Find its rms value (in A, 2 decimals).`, Math.sqrt(20), 0.01, 2,
    r`$\overline{i^2} = \tfrac12(36 + 4) = 20$, so $I_{rms} = \sqrt{20} = 4.47$ A. (The mean value is 2 A, but the rms uses squares.)`, { unit: 'A' }),
  mcq(3, 'parallel resonance', r`An ideal inductor and a capacitor are connected in parallel across an AC source, and the source frequency is made equal to $1/(2\pi\sqrt{LC})$. The current drawn from the source is then`, 'zero (a minimum)', ['infinite (a maximum)', 'equal to $V/R$', 'the same as at any other frequency'],
    r`The currents in the two branches are $V/X_L$ (lagging) and $V/X_C$ (leading). At $X_L = X_C$ they are equal and opposite, so the line current is zero while a large current circulates between L and C. Series resonance is the opposite: the current is maximum.`),
  nat(3, 'voltage across the inductor', r`A series circuit has $R = 40\ \Omega$, $X_L = 90\ \Omega$ and $X_C = 60\ \Omega$ and is connected to a 200 V rms source. Find the rms voltage across the inductor (in V).`, 360, 0, 0,
    r`$Z = \sqrt{40^2 + 30^2} = 50\ \Omega$, $I = 200/50 = 4$ A. $V_L = IX_L = 4\times90 = 360$ V, more than the supply (the capacitor's 240 V partly cancels it).`, { unit: 'V', trap: 'It is allowed for V_L to exceed the supply voltage.' }),
  nat(3, 'bandwidth from R and L', r`A series LCR circuit has $L = 0.5$ H and $R = 20\ \Omega$. Find its bandwidth (in Hz, 2 decimals).`, 20 / (2 * PI * 0.5), 0.01, 2,
    r`$\Delta\omega = R/L = 40\ \mathrm{rad\,s^{-1}}$, so $\Delta f = \dfrac{R}{2\pi L} = \dfrac{20}{2\pi\times0.5} = 6.37$ Hz. It does not depend on $C$.`, { unit: 'Hz' }),
  mcq(3, 'transformer core', r`The core of a transformer is made of thin insulated iron sheets (laminations) in order to reduce`, 'eddy current loss', ['hysteresis loss', 'copper loss', 'flux leakage'],
    r`Thin insulated layers break up the paths of the circulating (eddy) currents in the core, which cuts their $I^2R$ heating. Hysteresis loss is reduced by using soft iron or silicon steel, and copper loss by thick wires.`),
  mcq(3, 'not a transformer loss', r`Which of the following is NOT a cause of energy loss in a real transformer?`, 'the induced emf in the secondary coil', ['resistance of the windings', 'eddy currents in the core', 'hysteresis in the core'],
    r`The induced emf in the secondary is how the transformer works, not a loss. The real losses are copper loss (winding resistance), eddy currents, hysteresis and flux leakage.`, { trap: 'A NOT question: pick the one that does not waste energy.' }),
  mcq(3, 'power factor and frequency', r`A coil with resistance $R$ and inductance $L$ is connected in series to an AC source. As the frequency of the source is increased, the power factor`, 'decreases', ['increases', 'stays the same', 'first increases then decreases'],
    r`$\cos\phi = R/\sqrt{R^2 + \omega^2L^2}$. A larger $\omega$ makes the denominator larger, so $\cos\phi$ falls towards zero.`),
  mcq(3, 'below resonance', r`A series LCR circuit is driven at a frequency below its resonant frequency. The phase of the current relative to the applied voltage is`, 'leading', ['lagging', 'zero', 'exactly 90 degrees lagging'],
    r`Below $f_0$: $X_C > X_L$, the circuit is capacitive, and the current leads the voltage by an angle $\phi$ with $\tan\phi = (X_C - X_L)/R$.`),
  nat(3, 'two capacitors in an LC circuit', r`An inductor of 1 mH is joined to two capacitors of $5\ \mu$F each connected in parallel. Find the oscillation frequency (in Hz, nearest whole number).`, 1 / (2 * PI * Math.sqrt(1e-3 * 10e-6)), 1, 0,
    r`Capacitors in parallel add: $C = 10\ \mu$F. $f = \dfrac{1}{2\pi\sqrt{10^{-3}\times10^{-5}}} = \dfrac{10^4}{2\pi} = 1592$ Hz. (In series the capacitance would be $2.5\ \mu$F.)`, { unit: 'Hz' }),
  nat(3, 'mean of a rectified wave', r`A full-wave rectifier delivers $|10\sin\omega t|$ volts. Find the ratio of its rms value to its mean value (2 decimals).`, (10 / SQ2) / (20 / PI), 0.01, 2,
    r`$V_{rms} = 10/\sqrt2 = 7.071$ V and $V_{av} = 20/\pi = 6.366$ V. The ratio is $\pi/(2\sqrt2) = 1.11$ (this is the form factor).`),
  nat(3, 'peak-to-peak', r`An oscilloscope shows a sinusoidal supply with a peak-to-peak value of 622 V. Find the rms value (in V, nearest whole number).`, 311 / SQ2, 1, 0,
    r`Peak $= 622/2 = 311$ V. $V_{rms} = 311/\sqrt2 = 220$ V.`, { unit: 'V', trap: 'Peak-to-peak is twice the peak.' }),
  // ---------- Level 4 ----------
  nat(4, 'bulb with a capacitor', r`A bulb rated 100 V, 50 W is to run from 220 V, 50 Hz mains with a capacitor in series (no power wasted). Find the capacitance needed (in $\mu$F, 2 decimals).`, 1e6 / (W(50) * Math.sqrt(440 ** 2 - 200 ** 2)), 0.05, 2,
    r`Bulb: $R = V^2/P = 100^2/50 = 200\ \Omega$, $I = P/V = 0.5$ A. The circuit needs $Z = 220/0.5 = 440\ \Omega$. So $X_C = \sqrt{Z^2 - R^2} = \sqrt{440^2 - 200^2} = 391.9\ \Omega$. $C = \dfrac{1}{\omega X_C} = \dfrac{1}{314.16\times391.9} = 8.12\ \mu$F.`, { unit: 'μF', trap: 'Do not subtract 100 V from 220 V: voltages add as phasors.' }),
  nat(4, 'half-power frequency', r`A series LCR circuit has $f_0 = 1000$ Hz and $Q = 25$. Find the higher of the two frequencies at which the power is half its maximum (in Hz, nearest whole number).`, 1000 * (Math.sqrt(1 + 1 / (4 * 625)) + 1 / 50), 1, 0,
    r`Half power means $I = I_{max}/\sqrt2$, i.e. $|X_L - X_C| = R$. Solving gives $f_2 = f_0\left[\sqrt{1 + \tfrac{1}{4Q^2}} + \tfrac{1}{2Q}\right] = 1000\,[1.0002 + 0.02] = 1020$ Hz. The lower one is 980 Hz, and the difference $f_2 - f_1 = f_0/Q = 40$ Hz is the bandwidth.`, { unit: 'Hz' }),
  nat(4, 'frequency of maximum capacitor voltage', r`A series circuit has $L = 0.1$ H, $C = 10\ \mu$F and $R = 20\ \Omega$. The source has fixed amplitude and variable frequency. At what angular frequency is the voltage across the capacitor largest (in $\mathrm{rad\,s^{-1}}$, 1 decimal)?`, Math.sqrt(1e6 - 400 / 0.02), 0.2, 1,
    r`$V_C = I X_C$ with $I$ itself depending on $\omega$. Maximising gives $\omega^2 = \dfrac{1}{LC} - \dfrac{R^2}{2L^2} = 10^6 - \dfrac{400}{0.02} = 9.8\times10^5$, so $\omega = 989.9\ \mathrm{rad\,s^{-1}}$, slightly below the current-resonance value of $1000\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s', trap: 'The maximum of V_C is not exactly at 1/√(LC).' }),
  nat(4, 'two different frequencies', r`A current is $i = 6\sin\omega t + 8\sin2\omega t$ ampere. Find its rms value (in A, 2 decimals).`, Math.sqrt(18 + 32), 0.01, 2,
    r`The two terms have different frequencies, so the cross term averages to zero over a period. $\overline{i^2} = \tfrac12(6^2 + 8^2) = 50$, so $I_{rms} = \sqrt{50} = 7.07$ A. (If the frequencies were equal, the amplitudes would combine into 10 A first.)`, { unit: 'A', trap: 'Different frequencies: add the squares of the rms values; same frequency: add the phasors.' }),
  nat(4, 'half-wave rectified power', r`A diode (ideal) is connected in series with a $20\ \Omega$ resistor across a source of 200 V rms. Find the average power in the resistor (in W).`, 1000, 0, 0,
    r`The diode passes only the positive half cycles. Without the diode $P = V_{rms}^2/R = 200^2/20 = 2000$ W. With half of every cycle blocked, the average power is halved: 1000 W. (Equivalent: the rms of a half-wave is $V_0/2$, with $V_0 = 200\sqrt2$, giving $V_{eff}^2 = 20\,000$ and $P = 1000$ W.)`, { unit: 'W' }),
  nat(4, 'parallel RLC', r`A $30\ \Omega$ resistor, an inductor of reactance $20\ \Omega$ and a capacitor of reactance $40\ \Omega$ are connected in parallel across a 120 V rms source. Find the total rms current drawn (in A).`, 5, 0, 0,
    r`In parallel each branch has the full voltage. $I_R = 120/30 = 4$ A, $I_L = 120/20 = 6$ A (lagging), $I_C = 120/40 = 3$ A (leading). $I = \sqrt{I_R^2 + (I_L - I_C)^2} = \sqrt{16 + 9} = 5$ A.`, { unit: 'A', trap: 'In parallel, add currents (not impedances like in series) as phasors.' }),
  nat(4, 'energy per cycle', r`A series LCR circuit carries 2 A rms at 50 Hz and its resistance is $5\ \Omega$. Find the energy dissipated in one full cycle (in J, 2 decimals).`, 4 * 5 * 0.02, 0.005, 2,
    r`$P = I^2R = 4\times5 = 20$ W. The period is $0.02$ s, so energy per cycle $= 20\times0.02 = 0.40$ J. (Only $R$ dissipates.)`, { unit: 'J' }),
  nat(4, 'damped LC', r`An LC circuit with $L = 0.5$ H and a small resistance $R = 10\ \Omega$ rings down so that its energy decays as $e^{-Rt/L}$. After how long has the energy halved (in ms, 1 decimal)?`, 0.05 * Math.log(2) * 1e3, 0.1, 1,
    r`$e^{-Rt/L} = \tfrac12$ gives $t = \dfrac{L}{R}\ln2 = \dfrac{0.5}{10}\times0.693 = 34.7$ ms. The charge amplitude decays as $e^{-Rt/2L}$, at half this rate.`, { unit: 'ms', trap: 'Energy decays as e^(-Rt/L); charge as e^(-Rt/2L).' }),
  nat(4, 'LC current at a given charge', r`In an LC circuit the maximum current is 20 mA. What is the current at the instant the charge on the capacitor is half its maximum (in mA, 2 decimals)?`, 20 * Math.sqrt(3) / 2, 0.01, 2,
    r`Energy conservation: $\dfrac{q^2}{2C} + \tfrac12LI^2 = \tfrac12LI_0^2$. With $q = q_0/2$, the electric energy is $\tfrac14$ of the total, so $\tfrac12LI^2 = \tfrac34\cdot\tfrac12LI_0^2$ and $I = \tfrac{\sqrt3}{2}I_0 = 17.32$ mA.`, { unit: 'mA' }),
  nat(4, 'LC from a charged capacitor', r`An 8 $\mu$F capacitor charged to 100 V is connected across a 2 mH inductor. Find the peak current (in A, 2 decimals).`, 100 * Math.sqrt(8e-6 / 2e-3), 0.02, 2,
    r`$\tfrac12LI_0^2 = \tfrac12CV_0^2$ gives $I_0 = V_0\sqrt{C/L} = 100\times\sqrt{4\times10^{-3}} = 100\times0.0632 = 6.32$ A.`, { unit: 'A' }),
  nat(4, 'step-down with power factor', r`A step-down transformer (ideal) reduces 11 kV to 220 V and supplies a load of 100 kW at power factor 0.8 on the secondary. Find the current in the primary (in A, 2 decimals).`, 100e3 / (220 * 0.8) * 220 / 11000, 0.02, 2,
    r`Secondary: $I_s = \dfrac{P}{V_s\cos\phi} = \dfrac{100\,000}{220\times0.8} = 568.2$ A. Ideal transformer: $I_p = I_s\dfrac{V_s}{V_p} = 568.2\times\dfrac{220}{11\,000} = 11.36$ A. (Equivalently $I_p = P/(V_p\cos\phi) = 11.36$ A.)`, { unit: 'A', trap: 'The power factor belongs to the load and affects the current, even in an ideal transformer.' }),
  nat(4, 'power factor correction', r`A load takes 2 kW from a 200 V rms, 50 Hz supply at a lagging power factor of 0.6. What capacitor in parallel with it brings the power factor to 1 (in $\mu$F, nearest whole number)?`, 2666.6667 / (200 ** 2 * W(50)) * 1e6, 1, 0,
    r`Real power $P = 2000$ W. Reactive power $Q = P\tan\phi$ with $\cos\phi = 0.6$, $\tan\phi = 0.8/0.6 = 1.333$: $Q = 2667$ VAR. The capacitor must supply this: $Q = V^2\omega C$. $C = \dfrac{2667}{200^2\times314.16} = 212\ \mu$F.`, { unit: 'μF' }),
  nat(4, 'rms of a squared sine', r`A current is $i = 8\sin^2\omega t$ ampere. Find its rms value (in A, 2 decimals).`, 8 * Math.sqrt(3 / 8), 0.01, 2,
    r`$\sin^2\omega t = \tfrac12(1 - \cos2\omega t)$. So $i = 4 - 4\cos2\omega t$: a DC part of 4 A and an AC part of amplitude 4 A. $I_{rms}^2 = 4^2 + \tfrac12\times4^2 = 24$, $I_{rms} = 4.90$ A. (General: $I_0\sqrt{3/8}$.)`, { unit: 'A' }),
  nat(4, 'LC with a battery', r`An uncharged 10 $\mu$F capacitor is connected in series with a 0.1 H inductor and a 10 V battery (negligible resistance), and the switch is closed. Find the maximum current (in A, 2 decimals).`, 10 * Math.sqrt(10e-6 / 0.1), 0.005, 2,
    r`$q = CE(1 - \cos\omega t)$, so $I = CE\omega\sin\omega t$ with maximum $CE\omega = E\sqrt{C/L} = 10\times0.01 = 0.10$ A. The charge swings up to $2CE$, so the capacitor voltage reaches $2E = 20$ V, not 10 V.`, { unit: 'A', trap: 'The capacitor voltage overshoots to twice the battery emf.' }),
  nat(4, 'cycles of a damped oscillation', r`An LC circuit has $L = 0.1$ H, $C = 10\ \mu$F and $R = 2\ \Omega$. The charge amplitude decays as $e^{-Rt/2L}$. About how many full oscillations pass before the amplitude falls to $1/e$ of its initial value (1 decimal)?`, 0.1 / (2 * PI * Math.sqrt(1e-6)) / 1e0 * 1e0 * 1, 0.2, 1,
    r`$Rt/2L = 1$ gives $t = 2L/R = 0.1$ s. The period is about $T = 2\pi\sqrt{LC} = 6.283$ ms. Number of cycles $= 0.1/0.006283 = 15.9$.`),
  // ---------- Level 5 ----------
  nat(5, 'parallel resonance of a real coil', r`A coil of $L = 0.1$ H and resistance $R = 20\ \Omega$ is connected in parallel with a capacitor of $10\ \mu$F. At what frequency is the whole combination purely resistive, that is, the source current in phase with the voltage (in Hz, 1 decimal)?`, Math.sqrt(1e6 - 400 / 0.01) / (2 * PI), 0.2, 1,
    r`Admittance of the coil: $Y_1 = \dfrac{1}{R + j\omega L} = \dfrac{R - j\omega L}{R^2 + \omega^2L^2}$. Capacitor: $Y_2 = j\omega C$. The imaginary part must vanish: $\omega C = \dfrac{\omega L}{R^2 + \omega^2L^2}$, so $R^2 + \omega^2L^2 = L/C$ and $\omega^2 = \dfrac{1}{LC} - \dfrac{R^2}{L^2} = 10^6 - 4\times10^4 = 9.6\times10^5$. $\omega = 979.8\ \mathrm{rad\,s^{-1}}$, $f = 155.9$ Hz.`, { unit: 'Hz', trap: 'The coil\'s own resistance shifts the parallel resonance away from 1/√(LC).' }),
  nat(5, 'maximum power transfer', r`A source of 100 V rms has an internal impedance of $3\ \Omega$ resistance in series with $4\ \Omega$ inductive reactance. A purely resistive load $R_L$ is connected. For the best choice of $R_L$, find the power delivered to it (in W).`, 625, 0, 0,
    r`Total impedance $= \sqrt{(3 + R_L)^2 + 4^2}$. Power in the load $P = \dfrac{V^2R_L}{(3 + R_L)^2 + 16}$. Setting $dP/dR_L = 0$ gives $R_L^2 = 3^2 + 4^2$, so $R_L = |Z_s| = 5\ \Omega$ (not $3\ \Omega$). Then $P = \dfrac{10^4\times5}{64 + 16} = 625$ W.`, { unit: 'W', trap: 'For a purely resistive load, the best R_L equals the magnitude of the source impedance, not just its resistance.' }),
  nat(5, 'black box', r`An unknown series combination (no sources inside) has an applied voltage $v = 100\sin(100t)$ V and current $i = 5\sin(100t - \pi/6)$ A. Find the average power it consumes (in W, 1 decimal).`, 0.5 * 100 * 5 * Math.cos(PI / 6), 0.2, 1,
    r`The current lags by $30^\circ$, so it contains an inductor. $P = V_{rms}I_{rms}\cos\phi = \tfrac12\times100\times5\times\cos30^\circ = 216.5$ W. Its resistance is $R = Z\cos\phi = 20\times0.866 = 17.3\ \Omega$ and $X_L = 10\ \Omega$.`, { unit: 'W' }),
  nat(5, 'phase-controlled lamp', r`A lamp of $30\ \Omega$ is run from a sinusoidal supply of peak value 300 V through a phase-control switch that conducts only from $\pi/2$ to $\pi$ of each half cycle (it is off for the first quarter of every half cycle). Find the average power in the lamp (in W).`, 750, 0, 0,
    r`$V_{eff}^2 = \dfrac{1}{\pi}\int_{\pi/2}^{\pi}V_0^2\sin^2\theta\,d\theta = \dfrac{V_0^2}{\pi}\cdot\dfrac{\pi}{4} = \dfrac{V_0^2}{4}$. So $V_{eff} = V_0/2 = 150$ V and $P = 150^2/30 = 750$ W, exactly half the full power $V_0^2/2R = 1500$ W.`, { unit: 'W' }),
  nat(5, 'resonance and phase together', r`In a series LCR circuit $R = 50\ \Omega$. At 100 Hz the current leads the voltage by $45^\circ$. The circuit is exactly at resonance at 400 Hz. Find $L$ (in mH, 1 decimal).`, 50 / (W(100) * 15) * 1e3, 0.1, 1,
    r`At resonance $\omega_0 = 4\omega$ (with $\omega$ the 100 Hz value) and $LC = 1/\omega_0^2$. At $\omega$: $X_L = \omega L$ and $X_C = \dfrac{1}{\omega C} = \dfrac{\omega_0^2L}{\omega} = 16\,\omega L$. Net reactance $X_C - X_L = 15\,\omega L$ (capacitive, since 100 Hz is below resonance, so the current leads). A $45^\circ$ phase needs $\tan\phi = 15\omega L/R = 1$, so $L = \dfrac{50}{15\times628.3} = 5.3$ mH.`, { unit: 'mH', trap: 'X_C at 100 Hz is 16 times X_L, not 4 times: C scales as 1/f while L scales as f.' }),
  // ---------- assertion / reason ----------
  asrt(2, 'average value', r`A moving-coil (DC) ammeter connected in series with the 50 Hz mains reads zero.`, r`The average value of a sinusoidal current over a full cycle is zero.`, 0,
    r`A moving-coil meter's pointer responds to the average current. The coil is pushed one way and then the other 50 times a second, too quickly for it to follow, so it shows the mean, which is zero. R states exactly that and explains A.`),
  asrt(3, 'capacitive reactance', r`A capacitor of large capacitance passes AC more easily than a capacitor of small capacitance at the same frequency.`, r`The capacitive reactance is inversely proportional to the capacitance.`, 0,
    r`$X_C = 1/\omega C$. Larger $C$ means smaller $X_C$, so more current flows for the same voltage. R is the reason for A.`),
  asrt(3, 'resonance', r`In a series LCR circuit at resonance, the voltage across the inductor can be larger than the supply voltage.`, r`At resonance the impedance of the circuit is minimum.`, 1,
    r`Both are true. $V_L = IX_L = (V/R)\,\omega_0L = QV$, which exceeds $V$ when $Q > 1$. The minimum impedance explains why the current is large, but it does not by itself say $V_L > V$: that needs $X_L > R$. So R is true but not the explanation.`, { trap: 'Both statements are true, yet one does not explain the other.' }),
  asrt(3, 'choke coil', r`A choke coil can reduce the current in an AC circuit without wasting electrical energy as heat.`, r`In an ideal inductor the current is in phase with the voltage.`, 2,
    r`A is true: an ideal inductor drops voltage through its reactance with no average power loss. R is false: the current lags the voltage by $90^\circ$. It is this phase difference that makes the average power zero.`),
  asrt(3, 'transformer', r`A transformer cannot step up the power.`, r`Energy cannot be created: the output power cannot exceed the input power.`, 0,
    r`A step-up transformer raises voltage but lowers current in the same ratio, so $V_sI_s \le V_pI_p$. The reason is energy conservation.`),
  asrt(4, 'half-wave rms', r`The rms value of a half-wave rectified current of peak value $I_0$ is $I_0/\sqrt2$.`, r`The rms value of a sinusoidal current of peak value $I_0$ is $I_0/\sqrt2$.`, 3,
    r`R is true for a full sinusoid. For a half-wave rectified current, the squares are averaged over a whole period in which half the time the current is zero: $I_{rms}^2 = \tfrac12\cdot\tfrac{I_0^2}{2}$, so $I_{rms} = I_0/2$. A is false.`),
  asrt(4, 'resonance current', r`The current in a series LCR circuit is largest when the source frequency equals $1/(2\pi\sqrt{LC})$.`, r`At that frequency the impedance of the circuit is equal to its resistance.`, 0,
    r`At $f_0$: $X_L = X_C$, so $Z = R$, the smallest possible value, and $I = V/R$ is maximum. R explains A.`),
  asrt(4, 'coil on DC and AC', r`A coil connected to a 12 V DC battery draws a greater current than when connected to a 12 V (rms) AC source.`, r`An iron-cored coil has a smaller impedance for AC than its resistance for DC.`, 2,
    r`A is true: on AC the coil has impedance $Z = \sqrt{R^2 + \omega^2L^2} > R$, so $I_{AC} < I_{DC}$. R is false: it says the opposite, that $Z$ is smaller than $R$.`),
  asrt(5, 'rms and mean', r`The rms value of a sinusoidal current is 0.707 times its peak value.`, r`The average of a sine wave over a full cycle is zero.`, 1,
    r`A is true ($1/\sqrt2$). R is also true, but the rms is found by averaging the <i>square</i> of the current, not the current itself. So the zero average does not explain the 0.707.`, { trap: 'Zero mean does not mean zero rms.' }),
  asrt(5, 'LC oscillation', r`In an ideal LC circuit, the energies stored in the capacitor and in the inductor are never zero at the same instant.`, r`The total energy of the circuit stays constant.`, 0,
    r`$U_E = U_0\cos^2\omega t$ and $U_B = U_0\sin^2\omega t$. They add up to the constant $U_0 \ne 0$, so one cannot vanish unless the other equals $U_0$. R explains A.`),

  // ---------- statements ----------
  stm(2, 'hot-wire ammeter', r`A hot-wire ammeter reads the rms value of an alternating current.`, r`It works on the heating effect of the current, which depends on $I^2$ and not on the direction.`, 0,
    r`Both true. The wire's expansion depends on the heat, i.e. on $\overline{i^2}$, so the scale reads the rms value and works for DC and AC alike.`),
  stm(3, 'resonance', r`A series LCR circuit at resonance has a power factor of 1.`, r`At resonance the phase angle between the applied voltage and the current is $90^\circ$.`, 2,
    r`I is true: $\cos\phi = R/Z = 1$ at resonance. II is false: the phase angle is $0^\circ$ at resonance, so $\cos\phi = 1$. A $90^\circ$ angle would give a power factor of 0.`),
  stm(3, 'ideal capacitor', r`An ideal capacitor consumes no power on average when connected to an AC source.`, r`No current flows through an ideal capacitor connected to an AC source.`, 2,
    r`I is true: the current leads by $90^\circ$, so $\cos\phi = 0$. II is false: a charging and discharging current flows all the time, but it carries energy back and forth, not into heat.`),
  stm(3, 'transformer and DC', r`A transformer works with a DC source if the voltage is high enough.`, r`The emf induced in the secondary coil depends on the rate of change of magnetic flux.`, 3,
    r`I is false: a DC source gives a constant flux, hence zero rate of change and no secondary emf, whatever the voltage. II is true and is exactly why.`),
  stm(3, 'peak and rms', r`The peak value of a sinusoidal voltage of rms value 220 V is $220/\sqrt2$ V.`, r`The peak value of a sinusoid equals its rms value divided by $\sqrt2$.`, 1,
    r`Both are false. Peak $= \sqrt2\times$ rms, so the peak is $220\sqrt2 = 311$ V, and $V_{rms} = V_0/\sqrt2$.`, { trap: 'It is easy to flip the factor of root 2.' }),
  stm(4, 'impedance and frequency', r`The impedance of a series RC circuit increases as the frequency increases.`, r`The impedance of a series RL circuit increases as the frequency increases.`, 3,
    r`I is false: $Z_{RC} = \sqrt{R^2 + 1/\omega^2C^2}$ decreases as $\omega$ rises. II is true: $Z_{RL} = \sqrt{R^2 + \omega^2L^2}$ increases.`),
  stm(4, 'power factor correction', r`A capacitor in parallel with an inductive load can raise the power factor of the supply.`, r`It lowers the current drawn from the supply for the same real power.`, 0,
    r`The capacitor current leads and cancels part of the lagging reactive current of the load, so the supply current becomes nearer to the in-phase component. The real power in the load is unchanged. Both true.`),
  stm(4, 'frequency regimes', r`A series LCR circuit driven below its resonant frequency is capacitive.`, r`At low frequency $X_C$ is large and $X_L$ is small.`, 0,
    r`$X_C = 1/\omega C$ is large and $X_L = \omega L$ is small when $\omega$ is small, so the net reactance is capacitive and the current leads. Both true.`),
  stm(5, 'instantaneous power', r`The instantaneous power in an AC circuit can be negative for part of a cycle.`, r`The average power in a passive circuit is never negative.`, 0,
    r`When the inductor or capacitor returns energy to the source, $p = vi < 0$ for a while. But a passive circuit cannot give out more energy than it took in over a cycle, so $\overline p = VI\cos\phi \ge 0$. Both true.`),
  cnt(3, 'AC basics', r`Which of the following statements about a sinusoidal alternating current of peak value $I_0$ are correct?`,
    [r`The mean value over half a cycle is $0.637I_0$.`, r`The rms value is $0.707I_0$.`, r`The peak-to-peak value is $2I_0$.`, r`The mean value over a full cycle is $0.637I_0$.`], 3,
    r`(1), (2) and (3) are correct. (4) is wrong: the mean over a full cycle is zero; $0.637I_0$ is the mean over a half cycle.`),
  cnt(4, 'Q factor and bandwidth', r`Consider a series LCR circuit near resonance. How many of the following are correct?`,
    [r`A higher quality factor gives a narrower resonance curve.`, r`The bandwidth $R/2\pi L$ increases when $L$ is increased.`, r`At resonance, $V_L = QV$ when $Q$ is large.`, r`The power factor at resonance is 0.`], 2,
    r`(1) is true. (2) is false: the bandwidth falls as $L$ rises. (3) is true: $V_L = I\omega_0L = (V/R)\omega_0L = QV$. (4) is false: the power factor is 1. So two are correct.`),
  cnt(3, 'transformers', r`How many of the following statements about transformers are correct?`,
    [r`A step-up transformer has a higher current in its secondary than in its primary.`, r`An ideal transformer has equal input and output power.`, r`Laminating the core reduces hysteresis loss.`, r`A transformer can be used with DC.`], 1,
    r`(1) is false: a step-up transformer has a lower secondary current. (2) is true. (3) is false: lamination reduces eddy-current loss. (4) is false. Only one is correct.`),
  cnt(5, 'LC circuit', r`In an ideal LC circuit, how many of the following are correct?`,
    [r`The oscillation frequency does not depend on the initial charge.`, r`The total energy remains constant.`, r`The energy in the inductor is maximum when the charge on the capacitor is zero.`, r`The current is maximum when the capacitor is fully charged.`], 3,
    r`(1) True: $\omega = 1/\sqrt{LC}$. (2) True without resistance. (3) True: charge zero means all energy is magnetic. (4) False: with a fully charged capacitor the current is momentarily zero (maximum current is when the capacitor is empty). Three are correct.`),

  // ---------- multiple correct ----------
  msq(4, 'series resonance', r`A series LCR circuit is driven at its resonant frequency. Which statements are correct?`, [r`The current is maximum.`, r`The impedance equals $R$.`, r`The voltage across the capacitor always equals the voltage across the resistor.`, r`The power factor is unity.`], [0, 1, 3],
    r`At resonance $X_L = X_C$, $Z = R$, $I = V/R$ (maximum), and $\phi = 0$, so $\cos\phi = 1$. $V_C = IX_C$ and $V_R = IR$ are equal only if $X_C = R$, which is a special case (when $Q = 1$).`),
  msq(4, 'inductor on AC', r`A pure inductor is connected to an AC source. Which are correct?`, [r`The current lags the voltage by $90^\circ$.`, r`The average power consumed over a cycle is zero.`, r`Its reactance does not depend on the frequency.`, r`The voltage across it is maximum when the current is zero.`], [0, 1, 3],
    r`$v = L\,di/dt$. It is largest where the current is changing fastest, which is where $i = 0$ (current is sinusoidal). $X_L = \omega L$ rises with frequency, so the third is false.`),
  msq(4, 'rectified current', r`A sinusoidal current of peak value $I_0$ is rectified. Which are correct?`, [r`The rms value of the full-wave rectified current is $I_0/\sqrt2$.`, r`The rms value of the half-wave rectified current is $I_0/2$.`, r`The mean value of the half-wave rectified current over a full period is $I_0/\pi$.`, r`The mean value of the full-wave rectified current is $I_0/2$.`], [0, 1, 2],
    r`Full-wave: $|\sin|$ has the same square as $\sin$, so rms $I_0/\sqrt2$, mean $2I_0/\pi$ (not $I_0/2$). Half-wave: rms $I_0/2$, mean $I_0/\pi$.`),
  msq(4, 'ideal transformer', r`An ideal transformer has $N_p$ and $N_s$ turns. Which are correct?`, [r`$V_s/V_p = N_s/N_p$`, r`$I_s/I_p = N_p/N_s$`, r`The input and output powers are equal.`, r`The frequency of the secondary emf differs from that of the primary.`], [0, 1, 2],
    r`The same changing flux links both coils, so the voltage ratio is the turns ratio; power balance gives the current ratio; and the flux changes at the supply frequency, so the frequencies are equal.`),
  msq(5, 'capacitive circuit', r`In a series LCR circuit the current leads the applied voltage. Which are correct?`, [r`$X_C > X_L$`, r`The source frequency is below $1/(2\pi\sqrt{LC})$.`, r`$\tan\phi = (X_C - X_L)/R > 0$ with $\phi$ the angle of lead.`, r`The circuit behaves like an inductor.`], [0, 1, 2],
    r`Current leading means a capacitive circuit: $X_C > X_L$, which happens below resonance. It does not behave like an inductor.`),
  msq(5, 'LC oscillation', r`An ideal LC circuit oscillates, starting with the capacitor fully charged at $t = 0$. Which are correct?`, [r`After half a period, the capacitor is fully charged with opposite polarity.`, r`The current is maximum when the charge on the capacitor is zero.`, r`At $t = T/8$ the energy is shared equally.`, r`The charge returns to its initial value at $t = T/2$.`], [0, 1, 2],
    r`$q = q_0\cos\omega t$. At $T/2$ it is $-q_0$ (opposite polarity), so the last one is false. $I \propto \sin\omega t$ is maximum when $q = 0$, and at $T/8$, $\cos^2(\pi/4) = \tfrac12$.`),
  msq(4, 'series RL', r`A resistor and an ideal inductor are in series with an AC source. Which are correct?`, [r`$Z = \sqrt{R^2 + \omega^2L^2}$`, r`$V = V_R + V_L$ with the rms values added directly.`, r`$V_L$ leads $V_R$ by $90^\circ$.`, r`The current leads the supply voltage.`], [0, 2],
    r`$V_R$ is in phase with $i$ and $V_L$ leads it by $90^\circ$, so they add as phasors: $V = \sqrt{V_R^2 + V_L^2}$. The current lags the supply.`),
  msq(5, 'power in series LCR', r`In a series LCR circuit with source voltage $V$ (rms) and current $I$ (rms), the average power is`, [r`$I^2R$`, r`$VI\cos\phi$`, r`$V^2/R$ at any frequency`, r`largest at resonance for a fixed source voltage`], [0, 1, 3],
    r`$P = I^2R = VI\cos\phi$. $V^2/R$ holds only at resonance where $Z = R$. As $I$ is maximum at resonance, so is $P$ (for fixed $V$).`),

  // ---------- mixed with other chapters ----------
  nat(3, 'mixed', r`A coil of 50 turns and area $0.02\ \mathrm{m^2}$ rotates at $100\ \mathrm{rad\,s^{-1}}$ in a uniform field of 0.5 T and is connected to a $10\ \Omega$ resistor. Find the average power dissipated in the resistor (in W).`, (50 * 0.5 * 0.02 * 100) ** 2 / 2 / 10, 0, 0,
    r`Peak emf $= NBA\omega = 50\times0.5\times0.02\times100 = 50$ V. $\mathcal E_{rms} = 50/\sqrt2$. $P = \mathcal E_{rms}^2/R = \dfrac{50^2/2}{10} = 125$ W.`, { unit: 'W' }),
  nat(3, 'mixed', r`A heater rated 2.2 kW is used on 220 V mains. A fuse must be chosen with respect to the peak current. Find the peak current (in A, 2 decimals).`, 10 * SQ2, 0.01, 2,
    r`$I_{rms} = P/V = 2200/220 = 10$ A. Peak $= \sqrt2\times10 = 14.14$ A. (Fuses melt by heating, so they are rated in rms values, but the wiring sees this peak.)`, { unit: 'A' }),
  nat(3, 'mixed', r`A current $i = 2\sin(100\pi t)$ ampere flows through a coil of self-inductance 0.1 H. Find the peak induced emf (in V, 1 decimal).`, 0.1 * 100 * PI * 2, 0.1, 1,
    r`$\mathcal E = L\left|\dfrac{di}{dt}\right|$ with $\dfrac{di}{dt} = 2\times100\pi\cos(100\pi t)$. The peak is $0.1\times200\pi = 62.8$ V. (Same as $I_0X_L$.)`, { unit: 'V' }),
  nat(3, 'mixed', r`Find the maximum energy stored in the magnetic field of a 0.1 H coil carrying $i = 2\sin(100\pi t)$ ampere (in J, 2 decimals).`, 0.5 * 0.1 * 4, 0.005, 2,
    r`$U = \tfrac12Li^2$ is maximum at the peak current: $\tfrac12\times0.1\times2^2 = 0.20$ J. It is stored and released twice every cycle.`, { unit: 'J', trap: 'Use the peak current for the maximum energy, not the rms.' }),
  nat(4, 'mixed', r`A moving-coil ammeter (which reads the mean value) is connected in series with a diode and a lamp across the AC mains. The current through the lamp is half-wave rectified with a peak of 10 A. What does the ammeter read (in A, 2 decimals)?`, 10 / PI, 0.01, 2,
    r`A moving-coil meter responds to the average of the current. Over one full period the half-wave rectified current has mean $I_0/\pi = 10/\pi = 3.18$ A. (A moving-iron or hot-wire meter would read the rms value, 5 A.)`, { unit: 'A', trap: 'Moving-coil meters read the mean value; moving-iron meters read rms.' }),
  mcq(3, 'mixed', r`A capacitor is charged through a resistor from a DC battery. Another identical capacitor, in series with an identical resistor, is connected across an AC source. After a long time, the average current through the resistor is`, 'zero in the DC case and nonzero (rms) in the AC case', ['nonzero in both', 'zero in both', 'nonzero in the DC case and zero in the AC case'],
    r`In the DC case the capacitor ends up charged to the battery voltage and the current dies away. In the AC case the capacitor keeps charging and discharging, so an rms current flows.`),
  mcq(4, 'frequency of power', r`A pure resistor carries a current $i = I_0\sin\omega t$. The instantaneous power $p = i^2R$ varies with angular frequency`, r`$2\omega$`, [r`$\omega$`, r`$\omega/2$`, r`zero (it is constant)`],
    r`$p = I_0^2R\sin^2\omega t = \tfrac12I_0^2R(1 - \cos2\omega t)$: a constant mean of $\tfrac12I_0^2R$ plus a variation at $2\omega$. The power pulses 100 times a second on 50 Hz mains.`),
  mcq(4, 'resonance curves', r`The current amplitude is plotted against source frequency for a series LCR circuit for two different resistances, $R_1 < R_2$ (same $L$, $C$). Which statement is correct?`, 'both peak at the same frequency, but the $R_1$ curve is taller and narrower', ['the $R_1$ curve peaks at a higher frequency', 'the $R_2$ curve is taller and narrower', 'both curves have the same height but different widths'],
    r`The resonant frequency $1/(2\pi\sqrt{LC})$ does not depend on $R$. The peak height is $V/R$, so a smaller $R$ gives a taller peak, and bandwidth $R/2\pi L$ is smaller, so it is narrower.`),
  mcq(5, 'lamp with L or C', r`Two identical lamps are connected in series with an inductor and a capacitor respectively, each across the same 230 V, 50 Hz AC supply, with reactances much smaller than the lamp resistance. The supply is now changed to 230 V DC. Which describes what happens?`, 'the lamp with the inductor stays lit; the lamp with the capacitor goes off', ['both lamps stay lit as before', 'both lamps go off', 'the lamp with the capacitor stays lit; the one with the inductor goes off'],
    r`For DC, an ideal inductor offers no opposition once the current is steady (only its small wire resistance), so its lamp glows (slightly brighter than before, as $X_L$ no longer adds). A capacitor blocks DC, so its lamp goes off.`),
  mcq(5, 'added capacitor', r`A lamp and an inductor are connected in series across an AC supply. A capacitor is now connected across the supply, in parallel with the lamp-inductor series branch. The brightness of the lamp`, 'is unchanged', ['increases', 'decreases', 'increases only at resonance of the whole circuit'],
    r`The series branch still has the full supply voltage across it, so the current in the lamp is unchanged. The capacitor draws its own current, which changes the total current from the source (and its power factor), not the branch's.`),
  mcq(4, 'moving iron and coil meters', r`For a sinusoidal current the reading of a moving-iron ammeter is $I_1$ and a full-wave rectifier-type meter calibrated to read the rms value for sinusoids reads $I_2$. For the same current, the ratio $I_1/I_2$ is`, '1', ['$\sqrt2$', '$2/\pi$', '$1/\sqrt2$'],
    r`Both are calibrated to read rms for a sinusoid, so for a sinusoidal current they show the same value. They differ only for non-sinusoidal waves.`),
  // ---------- match ----------
  mat(2, 'reactance formulas', 'm1', r`Match each quantity of AC circuits with its expression.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`$X_L = \omega L$ (q). $X_C = 1/\omega C$ (p). Resonant frequency $1/(2\pi\sqrt{LC})$ (r). Quality factor $\omega_0L/R$ (s).`),
  mat(2, 'phase of current', 'm2', r`Match each AC circuit with the phase of the current relative to the applied voltage.`, 'A-p, B-r, C-q, D-s', ['A-p, B-q, C-r, D-s', 'A-r, B-p, C-q, D-s', 'A-p, B-r, C-s, D-q'],
    r`Pure R: in phase (p). Pure L: current lags by $90^\circ$ (r). Pure C: current leads by $90^\circ$ (q). Series RC: leads by an angle between $0^\circ$ and $90^\circ$ (s).`),
  mat(3, 'rms of waveforms', 'm3', r`Each wave below has a peak value $I_0$. Match it with its rms value.`, 'A-s, B-p, C-r, D-q', ['A-p, B-s, C-r, D-q', 'A-s, B-p, C-q, D-r', 'A-r, B-p, C-s, D-q'],
    r`Sinusoid: $I_0/\sqrt2$ (s). Half-wave rectified sine: $I_0/2$ (p). Square wave $\pm I_0$: $I_0$ (r). Triangular wave: $I_0/\sqrt3$ (q).`),
  mat(2, 'transformer facts', 'm4', r`Match each item with its feature.`, 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-q, B-s, C-r, D-p'],
    r`Step-up: $N_s > N_p$ (q). Step-down: $N_s < N_p$ (r). Ideal transformer: output power equals input power (s). Laminated core: reduces eddy-current loss (p).`),
  mat(3, 'LC and mechanics', 'm5', r`Match each element of an LC circuit with its analogue in a mass on a spring.`, 'A-q, B-s, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r'],
    r`Inductance $L$ stores energy $\tfrac12LI^2$ like mass (q). $1/C$ matches the spring constant $k$ (s). Charge $q$ matches the displacement (p). Current $I = dq/dt$ matches velocity (r).`),

  // ---------- passages ----------
  pas(2, 'impedance', 'p1', r`Find the impedance of the circuit (in $\Omega$).`, 50, 0, 0,
    r`$X_L = \omega L = 200\times0.4 = 80\ \Omega$ and $X_C = \dfrac{1}{\omega C} = \dfrac{1}{200\times10^{-4}} = 50\ \Omega$. $Z = \sqrt{40^2 + (80 - 50)^2} = \sqrt{2500} = 50\ \Omega$.`, { unit: 'Ω' }),
  pas(3, 'average power', 'p1', r`Find the average power consumed (in W).`, 640, 0, 0,
    r`$I = 200/50 = 4$ A. $P = I^2R = 16\times40 = 640$ W. (Check: $VI\cos\phi = 200\times4\times0.8 = 640$ W.)`, { unit: 'W' }),
  pasm(3, 'voltage across the capacitor', 'p1', r`The rms voltage across the capacitor is`, '200 V', ['50 V', '160 V', '320 V'],
    r`$V_C = IX_C = 4\times50 = 200$ V. (160 V is $V_R$ and 320 V is $V_L$.) Note that $V_C$ equals the supply voltage though it is only part of the circuit.`),
  pas(4, 'resonant frequency', 'p1', r`Find the resonant frequency of this circuit (in Hz, 1 decimal).`, 1 / (2 * PI * Math.sqrt(0.4 * 1e-4)), 0.1, 1,
    r`$f_0 = \dfrac{1}{2\pi\sqrt{LC}} = \dfrac{1}{2\pi\sqrt{0.4\times10^{-4}}} = \dfrac{158.1}{2\pi} = 25.2$ Hz. The source runs at $200\ \mathrm{rad\,s^{-1}}$, i.e. 31.8 Hz, above resonance (which is why $X_L > X_C$).`, { unit: 'Hz' }),
  pas(2, 'angular frequency', 'p2', r`Find the angular frequency of the oscillations (in $\mathrm{rad\,s^{-1}}$).`, 1000, 0, 0,
    r`$\omega = \dfrac{1}{\sqrt{LC}} = \dfrac{1}{\sqrt{0.2\times5\times10^{-6}}} = \dfrac{1}{10^{-3}} = 1000\ \mathrm{rad\,s^{-1}}$.`, { unit: 'rad/s' }),
  pas(3, 'peak current', 'p2', r`Find the maximum current in the circuit (in A, 2 decimals).`, 0.2, 0.005, 2,
    r`$q_0 = CV = 5\times10^{-6}\times40 = 2\times10^{-4}$ C. $I_0 = \omega q_0 = 1000\times2\times10^{-4} = 0.20$ A. (Energy check: $\tfrac12LI_0^2 = \tfrac12\times0.2\times0.04 = 4$ mJ, as stored initially.)`, { unit: 'A' }),
  pas(4, 'energy sharing', 'p2', r`At an instant the charge on the capacitor is $100\ \mu$C. Find the energy then stored in the inductor (in mJ, 2 decimals).`, 4 - 0.5 * (100e-6) ** 2 / 5e-6 * 1e3, 0.01, 2,
    r`Total energy $= 4$ mJ. Energy in the capacitor $= \dfrac{q^2}{2C} = \dfrac{(10^{-4})^2}{2\times5\times10^{-6}} = 10^{-3}$ J $= 1$ mJ. Inductor: $4 - 1 = 3.00$ mJ.`, { unit: 'mJ' }),
  pas(2, 'line current', 'p3', r`Find the current in the line (in A).`, 5, 0, 0,
    r`Assuming unity power factor, $P = V_pI_p$ gives $I_p = 55\,000/11\,000 = 5$ A.`, { unit: 'A' }),
  pas(3, 'line loss', 'p3', r`Find the power lost in the line (in W).`, 500, 0, 0,
    r`$P_{loss} = I^2R = 5^2\times20 = 500$ W.`, { unit: 'W' }),
  pasm(3, 'turns ratio', 'p3', r`The ratio of turns of the town's transformer, secondary to primary, is`, '1 : 50', ['50 : 1', '1 : 5', '5 : 1'],
    r`$N_s/N_p = V_s/V_p = 220/11\,000 = 1/50$. It is a step-down transformer, so the secondary has fewer turns.`),
  pas(4, 'efficiency of transmission', 'p3', r`The power-station end of the line must supply the load power plus the line loss. Find the percentage of the station's power that reaches the town (1 decimal).`, 55000 / 55500 * 100, 0.1, 1,
    r`Station power $= 55\,000 + 500 = 55\,500$ W. Fraction $= 55\,000/55\,500 = 0.991 = 99.1$ %. (The station's voltage must be $11\,000 + 5\times20 = 11\,100$ V.)`, { unit: '%' }),
];
const groups = {
  m1: { title: 'Reactance and resonance',
    list1: ['A. Inductive reactance', 'B. Capacitive reactance', 'C. Resonant frequency', 'D. Quality factor'],
    list2: [r`p. $1/\omega C$`, r`q. $\omega L$`, r`r. $1/(2\pi\sqrt{LC})$`, r`s. $\omega_0L/R$`] },
  m2: { title: 'Phase of the current',
    list1: ['A. Pure resistor', 'B. Pure inductor', 'C. Pure capacitor', 'D. Resistor and capacitor in series'],
    list2: ['p. In phase with the voltage', 'q. Leads by $90^\\circ$', 'r. Lags by $90^\\circ$', 's. Leads by an angle between $0^\\circ$ and $90^\\circ$'] },
  m3: { title: 'Rms values of waves of peak $I_0$',
    list1: ['A. Sinusoid', 'B. Half-wave rectified sine', 'C. Square wave between $+I_0$ and $-I_0$', 'D. Triangular wave'],
    list2: [r`p. $I_0/2$`, r`q. $I_0/\sqrt3$`, r`r. $I_0$`, r`s. $I_0/\sqrt2$`] },
  m4: { title: 'Transformers',
    list1: ['A. Step-up transformer', 'B. Step-down transformer', 'C. Ideal transformer', 'D. Laminated core'],
    list2: ['p. Reduces eddy-current loss', 'q. $N_s > N_p$', 'r. $N_s < N_p$', 's. Output power equals input power'] },
  m5: { title: 'LC circuit and spring-mass analogy',
    list1: ['A. Inductance $L$', 'B. $1/C$', 'C. Charge $q$', 'D. Current $I$'],
    list2: ['p. Displacement', 'q. Mass', 'r. Velocity', 's. Spring constant'] },
  p1: { title: 'A series LCR circuit',
    passage: r`<p>A series circuit has a resistor $R = 40\ \Omega$, an inductor $L = 0.4$ H and a capacitor $C = 100\ \mu$F. It is connected to an AC source of 200 V rms and angular frequency $200\ \mathrm{rad\,s^{-1}}$.</p>` },
  p2: { title: 'An LC oscillator',
    passage: r`<p>A capacitor of $5\ \mu$F is charged to 40 V and then connected across an ideal inductor of 0.2 H at $t = 0$. There is no resistance.</p>` },
  p3: { title: 'Supplying a town',
    passage: r`<p>A town needs 55 kW at 220 V (power factor 1). It is supplied through a line of total resistance $20\ \Omega$ from a station. At the town an ideal step-down transformer takes the power from the line at 11 kV and delivers it at 220 V.</p>` },
};
const T = (a, dp) => Math.max(0.5 * 10 ** -dp, Math.abs(a) * 0.004);
const cm = (re, im) => Math.hypot(re, im);
const gens = [
  { id: 'ac-g01', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'rms and peak',
    make(rng) {
      const v = int(rng, 0, 3); let q; let ans; let unit; let sol; let x;
      if (v === 0) { x = choose(rng, [110, 120, 200, 220, 230, 240]); ans = x * SQ2; unit = 'V'; q = `The rms value of an AC voltage is ${x} V. Find its peak value (in V, 1 decimal).`; sol = `$V_0 = \\sqrt2\\,V_{rms} = 1.414\\times${x} = ${S(ans, 4)}$ V.`; }
      else if (v === 1) { x = choose(rng, [2, 3, 5, 6, 10, 12]); ans = x / SQ2; unit = 'A'; q = `An alternating current has a peak value of ${x} A. Find its rms value (in A, 2 decimals).`; sol = `$I_{rms} = I_0/\\sqrt2 = ${x}/1.414 = ${S(ans, 3)}$ A.`; }
      else if (v === 2) { x = choose(rng, [100, 200, 400, 620, 640]); ans = x / 2 / SQ2; unit = 'V'; q = `An oscilloscope shows a sinusoidal voltage with a peak-to-peak value of ${x} V. Find its rms value (in V, 1 decimal).`; sol = `Peak $= ${x}/2 = ${x / 2}$ V. $V_{rms} = ${x / 2}/\\sqrt2 = ${S(ans, 4)}$ V.`; }
      else { x = choose(rng, [25, 50, 60, 100]); ans = x; unit = 'Hz'; q = `A voltage is $v = V_0\\sin(${S(2 * x)}\\pi t)$. Find its frequency (in Hz).`; sol = `$\\omega = ${S(2 * x)}\\pi = 2\\pi f$, so $f = ${x}$ Hz.`; }
      return { v, x, q, answer: N(ans, v === 1 ? 2 : 1), tol: T(ans, v === 1 ? 2 : 1), unit, sol, trap: v === 3 ? 'The coefficient of t is omega = 2 pi f, not f.' : undefined };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt(2 * p.x * p.x) : p.v === 1 ? Math.sqrt(p.x * p.x / 2) : p.v === 2 ? Math.sqrt((p.x / 2) ** 2 / 2) : (2 * p.x * PI) / (2 * PI)) },
  { id: 'ac-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'reactance',
    make(rng) {
      const v = int(rng, 0, 3); const f = choose(rng, [50, 60, 100, 400, 1000]); let q; let ans; let sol; let unit; let x;
      if (v === 0) { x = choose(rng, [10, 20, 50, 100, 200]); ans = W(f) * x * 1e-3; unit = 'Ω'; q = `Find the inductive reactance of a ${x} mH inductor at ${f} Hz (in $\\Omega$, 2 decimals).`; sol = `$X_L = 2\\pi fL = 2\\pi\\times${f}\\times${x}\\times10^{-3} = ${S(ans, 4)}\\ \\Omega$.`; }
      else if (v === 1) { x = choose(rng, [1, 2, 5, 10, 20, 50, 100]); ans = 1 / (W(f) * x * 1e-6); unit = 'Ω'; q = `Find the capacitive reactance of a ${x} $\\mu$F capacitor at ${f} Hz (in $\\Omega$, 2 decimals).`; sol = `$X_C = \\dfrac{1}{2\\pi fC} = \\dfrac{1}{2\\pi\\times${f}\\times${x}\\times10^{-6}} = ${S(ans, 4)}\\ \\Omega$.`; }
      else if (v === 2) { x = choose(rng, [20, 50, 100, 200, 500]); ans = x / W(f) * 1e3; unit = 'mH'; q = `An inductor has a reactance of ${x} $\\Omega$ at ${f} Hz. Find its inductance (in mH, 2 decimals).`; sol = `$L = \\dfrac{X_L}{2\\pi f} = \\dfrac{${x}}{2\\pi\\times${f}} = ${S(ans / 1e3, 4)}$ H $= ${S(ans, 4)}$ mH.`; }
      else { x = choose(rng, [20, 50, 100, 200, 500]); ans = 1 / (W(f) * x) * 1e6; unit = 'μF'; q = `A capacitor has a reactance of ${x} $\\Omega$ at ${f} Hz. Find its capacitance (in $\\mu$F, 2 decimals).`; sol = `$C = \\dfrac{1}{2\\pi fX_C} = \\dfrac{1}{2\\pi\\times${f}\\times${x}} = ${S(ans / 1e6, 4)}$ F $= ${S(ans, 4)}\\ \\mu$F.`; }
      return { v, f, x, q, answer: N(ans, 2), tol: T(ans, 2), unit, sol, trap: v === 1 || v === 3 ? 'Convert microfarad to farad.' : undefined };
    },
    verify: (p) => (p.v === 0 ? p.f * p.x * 1e-3 * 2 * PI : p.v === 1 ? 1 / (p.f * 2 * PI * p.x * 1e-6) : p.v === 2 ? p.x / (2 * PI * p.f) * 1e3 : 1 / (2 * PI * p.f * p.x) * 1e6) },
  { id: 'ac-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'series circuit current',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [100, 120, 200, 220, 230]);
      const R = choose(rng, [30, 40, 60, 80, 120]); const XL = choose(rng, [40, 50, 90, 160]); const XC = choose(rng, [20, 60, 100]);
      let X; let desc;
      if (v === 0) { X = XL; desc = `a resistor of $${R}\\ \\Omega$ and a coil of reactance $${XL}\\ \\Omega$ in series`; }
      else if (v === 1) { X = XC; desc = `a resistor of $${R}\\ \\Omega$ and a capacitor of reactance $${XC}\\ \\Omega$ in series`; }
      else { X = XL - XC; desc = `a resistor of $${R}\\ \\Omega$, an inductor of reactance $${XL}\\ \\Omega$ and a capacitor of reactance $${XC}\\ \\Omega$ in series`; }
      const Z = cm(R, X); const I = V / Z;
      return { v, V, R, XL, XC, q: `Connect ${desc} across a ${V} V rms AC source. Find the rms current (in A, 3 decimals).`, answer: N(I, 3), tol: T(I, 3), unit: 'A',
        sol: `${v === 2 ? `Net reactance $X = X_L - X_C = ${XL} - ${XC} = ${X}\\ \\Omega$. ` : ''}$Z = \\sqrt{R^2 + X^2} = \\sqrt{${R}^2 + ${X}^2} = ${S(Z, 4)}\\ \\Omega$. $I = V/Z = ${V}/${S(Z, 4)} = ${S(I, 4)}$ A.`, trap: v === 2 ? 'Subtract the reactances before squaring.' : undefined };
    },
    verify: (p) => { const re = p.R; const im = p.v === 0 ? p.XL : p.v === 1 ? -p.XC : p.XL - p.XC; return p.V / Math.sqrt(re * re + im * im); } },
  { id: 'ac-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'phase angle and power factor',
    make(rng) {
      const v = int(rng, 0, 2); const R = choose(rng, [20, 30, 40, 50, 60]); const XL = choose(rng, [30, 40, 80, 120]); const XC = choose(rng, [20, 50, 100]);
      let X; let desc;
      if (v === 0) { X = XL; desc = `a series circuit with $R = ${R}\\ \\Omega$ and an inductor of reactance $${XL}\\ \\Omega$`; }
      else if (v === 1) { X = -XC; desc = `a series circuit with $R = ${R}\\ \\Omega$ and a capacitor of reactance $${XC}\\ \\Omega$`; }
      else { X = XL - XC; desc = `a series circuit with $R = ${R}\\ \\Omega$, $X_L = ${XL}\\ \\Omega$ and $X_C = ${XC}\\ \\Omega$`; }
      const phi = Math.atan(Math.abs(X) / R) * 180 / PI; const pf = R / cm(R, X); const askPf = rng() < 0.5;
      const ans = askPf ? pf : phi;
      return { v, R, XL, XC, askPf, q: `For ${desc}, find the ${askPf ? 'power factor (3 decimals)' : 'phase angle between current and applied voltage (in degrees, 1 decimal)'}.`, answer: N(ans, askPf ? 3 : 1), tol: askPf ? 0.002 : 0.1, unit: askPf ? undefined : '°',
        sol: `Net reactance $X = ${S(X)}\\ \\Omega$. $\\tan\\phi = |X|/R = ${S(Math.abs(X))}/${R} = ${S(Math.abs(X) / R, 4)}$, so $\\phi = ${S(phi, 4)}^\\circ$ (${X >= 0 ? 'current lags' : 'current leads'}). $\\cos\\phi = R/Z = ${R}/${S(cm(R, X), 4)} = ${S(pf, 4)}$.`, trap: 'Use net reactance; power factor is R over Z.' };
    },
    verify: (p) => { const X = p.v === 0 ? p.XL : p.v === 1 ? -p.XC : p.XL - p.XC; return p.askPf ? Math.cos(Math.atan2(Math.abs(X), p.R)) : Math.acos(p.R / Math.sqrt(p.R ** 2 + X * X)) * 180 / PI; } },
  { id: 'ac-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'average power',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [100, 120, 220, 230]); const R = choose(rng, [20, 30, 40, 60]); const X = choose(rng, [15, 40, 45, 80]);
      const Z2 = R * R + X * X; const I = V / Math.sqrt(Z2); let ans; let q; let sol;
      if (v === 0) { ans = I * I * R; q = `A coil of resistance $${R}\\ \\Omega$ and reactance $${X}\\ \\Omega$ is connected to a ${V} V rms supply. Find the power it consumes (in W, 1 decimal).`; sol = `$Z^2 = ${R}^2 + ${X}^2 = ${Z2}$. $I = V/Z = ${S(I, 4)}$ A. $P = I^2R = ${S(I * I, 4)}\\times${R} = ${S(ans, 4)}$ W.`; }
      else if (v === 1) { ans = V * I * R / Math.sqrt(Z2); q = `A series RC circuit has $R = ${R}\\ \\Omega$ and $X_C = ${X}\\ \\Omega$ on a ${V} V rms supply. Find the average power drawn (in W, 1 decimal).`; sol = `$Z = \\sqrt{${R}^2 + ${X}^2} = ${S(Math.sqrt(Z2), 4)}\\ \\Omega$, $I = ${S(I, 4)}$ A, $\\cos\\phi = R/Z = ${S(R / Math.sqrt(Z2), 4)}$. $P = VI\\cos\\phi = ${V}\\times${S(I, 4)}\\times${S(R / Math.sqrt(Z2), 4)} = ${S(ans, 4)}$ W.`; }
      else { ans = V * V * R / Z2; q = `An AC source of ${V} V rms drives a series LCR circuit with $R = ${R}\\ \\Omega$ and net reactance $${X}\\ \\Omega$. Find the average power (in W, 1 decimal).`; sol = `$P = I^2R = \\dfrac{V^2R}{R^2 + X^2} = \\dfrac{${V}^2\\times${R}}{${Z2}} = ${S(ans, 4)}$ W.`; }
      return { v, V, R, X, q, answer: N(ans, 1), tol: T(ans, 1), unit: 'W', sol, trap: 'Only the resistance dissipates power.' };
    },
    verify: (p) => { const Z = Math.sqrt(p.R ** 2 + p.X ** 2); const I = p.V / Z; return p.v === 0 ? p.V * I * (p.R / Z) : p.v === 1 ? I * I * p.R : (p.V / Z) ** 2 * p.R; } },
  { id: 'ac-g06', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'resonance',
    make(rng) {
      const v = int(rng, 0, 2); const L = choose(rng, [1, 2, 5, 10, 20, 50]) * 1e-3; const C = choose(rng, [1, 2, 5, 10, 20, 100]) * 1e-6;
      const f0 = 1 / (2 * PI * Math.sqrt(L * C)); let q; let ans; let sol; let unit;
      if (v === 0) { ans = f0; unit = 'Hz'; q = `Find the resonant frequency of a series LCR circuit with $L = ${S(L * 1e3)}$ mH and $C = ${S(C * 1e6)}\\ \\mu$F (in Hz, 1 decimal).`; sol = `$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}} = \\dfrac{1}{2\\pi\\sqrt{${S(L)}\\times${S(C)}}} = ${S(f0, 4)}$ Hz.`; }
      else if (v === 1) { ans = C * 1e6; unit = 'μF'; q = `A series circuit with $L = ${S(L * 1e3)}$ mH resonates at ${S(f0, 4)} Hz. Find $C$ (in $\\mu$F, 2 decimals).`; sol = `$C = \\dfrac{1}{(2\\pi f_0)^2L} = \\dfrac{1}{(2\\pi\\times${S(f0, 4)})^2\\times${S(L)}} = ${S(C * 1e6, 4)}\\ \\mu$F.`; }
      else { ans = L * 1e3; unit = 'mH'; q = `A series circuit with $C = ${S(C * 1e6)}\\ \\mu$F resonates at ${S(f0, 4)} Hz. Find $L$ (in mH, 2 decimals).`; sol = `$L = \\dfrac{1}{(2\\pi f_0)^2C} = \\dfrac{1}{(2\\pi\\times${S(f0, 4)})^2\\times${S(C)}} = ${S(L * 1e3, 4)}$ mH.`; }
      return { v, L, C, f0, q, answer: N(ans, v === 0 ? 1 : 2), tol: v === 0 ? Math.max(0.1, ans * 0.004) : Math.max(0.02, ans * 0.01), unit, sol };
    },
    verify: (p) => { const w0 = 2 * PI * p.f0; return p.v === 0 ? w0 / (2 * PI) : p.v === 1 ? 1e6 / (w0 * w0 * p.L) : 1e3 / (w0 * w0 * p.C); } },
  { id: 'ac-g07', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'quality factor and bandwidth',
    make(rng) {
      const v = int(rng, 0, 2); const L = choose(rng, [0.05, 0.1, 0.2, 0.5]); const C = choose(rng, [5, 10, 20, 50]) * 1e-6; const R = choose(rng, [2, 5, 10, 20]);
      const w0 = 1 / Math.sqrt(L * C); const Q = w0 * L / R; const f0 = w0 / (2 * PI); let ans; let q; let sol; let unit; let dp = 2;
      if (v === 0) { ans = Q; unit = undefined; q = `A series LCR circuit has $L = ${L}$ H, $C = ${S(C * 1e6)}\\ \\mu$F and $R = ${R}\\ \\Omega$. Find its quality factor (2 decimals).`; sol = `$\\omega_0 = 1/\\sqrt{LC} = ${S(w0, 4)}\\ \\mathrm{rad\\,s^{-1}}$. $Q = \\omega_0L/R = ${S(w0, 4)}\\times${L}/${R} = ${S(Q, 4)}$.`; }
      else if (v === 1) { ans = f0 / Q; unit = 'Hz'; q = `A series LCR circuit has $L = ${L}$ H, $C = ${S(C * 1e6)}\\ \\mu$F and $R = ${R}\\ \\Omega$. Find its bandwidth (in Hz, 2 decimals).`; sol = `$f_0 = ${S(f0, 4)}$ Hz and $Q = ${S(Q, 4)}$. Bandwidth $= f_0/Q = ${S(ans, 4)}$ Hz. (Also $R/2\\pi L = ${S(R / (2 * PI * L), 4)}$ Hz.)`; }
      else { ans = Math.sqrt(L / C) / R; unit = undefined; q = `A series LCR circuit has $L = ${L}$ H, $C = ${S(C * 1e6)}\\ \\mu$F and $R = ${R}\\ \\Omega$. Find $Q$ using $Q = \\dfrac1R\\sqrt{L/C}$ (2 decimals).`; sol = `$\\sqrt{L/C} = \\sqrt{${L}/${S(C)}} = ${S(Math.sqrt(L / C), 4)}\\ \\Omega$. $Q = ${S(Math.sqrt(L / C), 4)}/${R} = ${S(ans, 4)}$.`; }
      return { v, L, C, R, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol };
    },
    verify: (p) => { const w0 = 1 / Math.sqrt(p.L * p.C); return p.v === 0 ? Math.sqrt(p.L / p.C) / p.R : p.v === 1 ? p.R / (2 * PI * p.L) : w0 * p.L / p.R; } },
  { id: 'ac-g08', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'voltage across L and C at resonance',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [10, 20, 50, 100, 200]); const L = choose(rng, [0.1, 0.2, 0.5]); const C = choose(rng, [10, 20, 50]) * 1e-6; const R = choose(rng, [5, 10, 20, 25]);
      const w0 = 1 / Math.sqrt(L * C); const I = V / R; const VL = I * w0 * L; const VC = I / (w0 * C); const Q = VL / V;
      const ans = v === 0 ? VL : v === 1 ? VC : Q;
      const what = v === 0 ? 'the rms voltage across the inductor (in V, 1 decimal)' : v === 1 ? 'the rms voltage across the capacitor (in V, 1 decimal)' : 'the ratio of the voltage across the inductor to the supply voltage (2 decimals)';
      return { v, V, L, C, R, q: `A series circuit with $R = ${R}\\ \\Omega$, $L = ${L}$ H and $C = ${S(C * 1e6)}\\ \\mu$F is driven at resonance by a ${V} V rms source. Find ${what}.`, answer: N(ans, v === 2 ? 2 : 1), tol: T(ans, v === 2 ? 2 : 1), unit: v === 2 ? undefined : 'V',
        sol: `$\\omega_0 = 1/\\sqrt{LC} = ${S(w0, 4)}\\ \\mathrm{rad\\,s^{-1}}$. At resonance $I = V/R = ${S(I, 4)}$ A. $X_L = \\omega_0L = ${S(w0 * L, 4)}\\ \\Omega$, $X_C = 1/\\omega_0C = ${S(1 / (w0 * C), 4)}\\ \\Omega$ (equal). ${v === 0 ? `$V_L = IX_L = ${S(VL, 4)}$ V.` : v === 1 ? `$V_C = IX_C = ${S(VC, 4)}$ V.` : `$V_L/V = X_L/R = Q = ${S(Q, 4)}$.`}`, trap: 'The element voltages can exceed the supply at resonance.' };
    },
    verify: (p) => { const w0 = 1 / Math.sqrt(p.L * p.C); return p.v === 0 ? p.V * w0 * p.L / p.R : p.v === 1 ? p.V / (p.R * w0 * p.C) : w0 * p.L / p.R; } },
  { id: 'ac-g09', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'ideal transformer',
    make(rng) {
      const v = int(rng, 0, 3); const Np = choose(rng, [100, 200, 500, 1000]); const ratio = choose(rng, [0.1, 0.2, 0.5, 2, 5, 10, 20]); const Ns = Np * ratio; const Vp = choose(rng, [110, 220, 230, 240]); const Vs = Vp * ratio; const Is = choose(rng, [1, 2, 5, 10]);
      let q; let ans; let unit; let sol;
      if (v === 0) { ans = Vs; unit = 'V'; q = `A transformer has ${Np} turns in the primary and ${S(Ns)} in the secondary. The primary is on ${Vp} V AC. Find the secondary voltage (in V).`; sol = `$V_s = V_p N_s/N_p = ${Vp}\\times${S(Ns)}/${Np} = ${S(Vs)}$ V.`; }
      else if (v === 1) { ans = Ns; unit = ''; q = `A transformer's primary has ${Np} turns and is connected to ${Vp} V AC. How many turns must the secondary have to give ${S(Vs)} V?`; sol = `$N_s = N_p V_s/V_p = ${Np}\\times${S(Vs)}/${Vp} = ${S(Ns)}$.`; }
      else if (v === 2) { ans = Is * Vs / Vp; unit = 'A'; q = `An ideal transformer changes ${Vp} V to ${S(Vs)} V and the secondary current is ${Is} A. Find the primary current (in A, 3 decimals).`; sol = `$V_pI_p = V_sI_s$ so $I_p = ${Is}\\times${S(Vs)}/${Vp} = ${S(ans, 4)}$ A.`; }
      else { ans = Vs * Is; unit = 'W'; q = `An ideal transformer has ${S(Vs)} V across its secondary, which carries ${Is} A. Find the power drawn from the supply (in W).`; sol = `Ideal: $P_{in} = P_{out} = V_sI_s = ${S(Vs)}\\times${Is} = ${S(ans)}$ W.`; }
      return { v, Np, Ns, Vp, Vs, Is, q, answer: N(ans, 3), tol: T(ans, 3), unit: unit || undefined, sol, trap: v === 2 ? 'If voltage goes up, current goes down.' : undefined };
    },
    verify: (p) => (p.v === 0 ? p.Vp * (p.Ns / p.Np) : p.v === 1 ? p.Np * (p.Vs / p.Vp) : p.v === 2 ? p.Is / (p.Vp / p.Vs) : p.Is * p.Vs) },
  { id: 'ac-g10', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'transformer efficiency',
    make(rng) {
      const v = int(rng, 0, 2); const eta = choose(rng, [0.8, 0.9, 0.92, 0.95, 0.98]); const Pout = choose(rng, [500, 1000, 2000, 5000]); const Vp = choose(rng, [220, 440, 2200, 11000]);
      let q; let ans; let unit; let sol;
      if (v === 0) { ans = Pout / eta; unit = 'W'; q = `A transformer is ${S(eta * 100)} % efficient and delivers ${Pout} W. Find the input power (in W, 1 decimal).`; sol = `$P_{in} = P_{out}/\\eta = ${Pout}/${eta} = ${S(ans, 5)}$ W.`; }
      else if (v === 1) { ans = Pout / eta / Vp; unit = 'A'; q = `A transformer of ${S(eta * 100)} % efficiency delivers ${Pout} W from a ${Vp} V primary. Find the primary current (in A, 3 decimals).`; sol = `$P_{in} = ${Pout}/${eta} = ${S(Pout / eta, 5)}$ W. $I_p = P_{in}/V_p = ${S(ans, 4)}$ A. (Ideal: ${S(Pout / Vp, 4)} A.)`; }
      else { ans = Pout * (1 - eta) / eta; unit = 'W'; q = `A transformer delivers ${Pout} W with an efficiency of ${S(eta * 100)} %. Find the power lost as heat in it (in W, 1 decimal).`; sol = `$P_{in} = ${Pout}/${eta} = ${S(Pout / eta, 5)}$ W. Loss $= P_{in} - P_{out} = ${S(ans, 4)}$ W.`; }
      return { v, eta, Pout, Vp, q, answer: N(ans, v === 1 ? 3 : 1), tol: T(ans, v === 1 ? 3 : 1), unit, sol, trap: 'Efficiency is output over input, so input is larger.' };
    },
    verify: (p) => (p.v === 0 ? p.Pout * 100 / (p.eta * 100) : p.v === 1 ? (p.Pout / p.eta) / p.Vp : p.Pout / p.eta - p.Pout) },
  { id: 'ac-g11', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'transmission loss',
    make(rng) {
      const v = int(rng, 0, 2); const P = choose(rng, [50, 100, 200, 440, 1000]) * 1e3; const V = choose(rng, [2200, 11000, 22000, 33000, 66000]); const R = choose(rng, [2, 5, 10, 20]); const kf = choose(rng, [2, 3, 4, 5]);
      const I = P / V; const loss = I * I * R; let q; let ans; let unit; let sol; let dp = 2;
      if (v === 0) { ans = loss / 1e3; unit = 'kW'; q = `${P / 1e3} kW is transmitted at ${V / 1e3} kV through a line of resistance $${R}\\ \\Omega$. Find the power lost in the line (in kW, 2 decimals).`; sol = `$I = P/V = ${P}/${V} = ${S(I, 4)}$ A. Loss $= I^2R = ${S(I * I, 4)}\\times${R} = ${S(loss, 4)}$ W $= ${S(ans, 4)}$ kW.`; }
      else if (v === 1) { ans = loss / P * 100; unit = '%'; q = `${P / 1e3} kW is sent at ${V / 1e3} kV through lines of total resistance $${R}\\ \\Omega$. What percentage of the power is lost in the lines (3 decimals)?`; sol = `$I = ${S(I, 4)}$ A. Loss $= I^2R = ${S(loss, 4)}$ W. Percentage $= ${S(loss, 4)}/${P}\\times100 = ${S(ans, 4)}$ %.`; dp = 3; }
      else { ans = loss / (kf * kf) / 1e3; unit = 'kW'; q = `A line loses ${S(loss / 1e3, 4)} kW when a fixed power is sent at ${V / 1e3} kV. What would it lose if the voltage were made ${kf} times as large (in kW, 3 decimals)?`; sol = `Loss $\\propto 1/V^2$. New loss $= ${S(loss / 1e3, 4)}/${kf}^2 = ${S(ans, 4)}$ kW.`; dp = 3; }
      return { v, P, V, R, kf, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: 'Loss goes as the square of the current.' };
    },
    verify: (p) => { const I = p.P / p.V; return p.v === 0 ? I * I * p.R / 1e3 : p.v === 1 ? 100 * p.R * p.P / (p.V * p.V) : (p.P / (p.V * p.kf)) ** 2 * p.R / 1e3; } },
  { id: 'ac-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'LC oscillation',
    make(rng) {
      const v = int(rng, 0, 3); const L = choose(rng, [1, 2, 5, 10, 50]) * 1e-3; const C = choose(rng, [1, 2, 5, 10, 20]) * 1e-6; const V0 = choose(rng, [5, 10, 20, 50, 100]);
      const w = 1 / Math.sqrt(L * C); let ans; let q; let sol; let unit; let dp = 2;
      const base = `An LC circuit has $L = ${S(L * 1e3)}$ mH and $C = ${S(C * 1e6)}\\ \\mu$F`;
      if (v === 0) { ans = w / (2 * PI); unit = 'Hz'; q = `${base}. Find the frequency of its free oscillations (in Hz, 1 decimal).`; sol = `$f = \\dfrac{1}{2\\pi\\sqrt{LC}} = \\dfrac{\\omega}{2\\pi} = \\dfrac{${S(w, 4)}}{2\\pi} = ${S(ans, 4)}$ Hz.`; dp = 1; }
      else if (v === 1) { ans = V0 * Math.sqrt(C / L) * 1e3; unit = 'mA'; q = `${base}, and the capacitor is charged to ${V0} V and then connected across the inductor. Find the peak current (in mA, 2 decimals).`; sol = `$\\tfrac12LI_0^2 = \\tfrac12CV_0^2$, so $I_0 = V_0\\sqrt{C/L} = ${V0}\\times${S(Math.sqrt(C / L), 4)} = ${S(ans / 1e3, 4)}$ A $= ${S(ans, 4)}$ mA.`; }
      else if (v === 2) { ans = 0.5 * C * V0 * V0 * 1e6; unit = 'μJ'; q = `${base}, and the capacitor is charged to ${V0} V and then connected across the inductor. Find the maximum energy stored in the inductor (in $\\mu$J, 1 decimal).`; sol = `All the initial energy $\\tfrac12CV_0^2 = \\tfrac12\\times${S(C)}\\times${V0}^2 = ${S(ans, 4)}\\ \\mu$J ends up in the inductor at the instant of maximum current.`; dp = 1; }
      else { ans = 2 * PI / w / 4 * 1e3; unit = 'ms'; q = `${base}, with the capacitor fully charged at $t = 0$. After how long is the capacitor first completely discharged (in ms, 3 decimals)?`; sol = `$T = 2\\pi\\sqrt{LC} = ${S(2 * PI / w * 1e3, 4)}$ ms. Fully discharged after a quarter period: $T/4 = ${S(ans, 4)}$ ms.`; dp = 3; }
      return { v, L, C, V0, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol };
    },
    verify: (p) => { const w = 1 / Math.sqrt(p.L * p.C); return p.v === 0 ? 1 / (2 * PI * Math.sqrt(p.L * p.C)) : p.v === 1 ? w * p.C * p.V0 * 1e3 : p.v === 2 ? p.C * p.V0 * p.V0 / 2 * 1e6 : (PI / 2) / w * 1e3; } },
  { id: 'ac-g13', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'LC energy sharing',
    make(rng) {
      const v = int(rng, 0, 2); const q0 = choose(rng, [10, 20, 40, 100]); const I0 = choose(rng, [10, 20, 40, 50]); const frac = choose(rng, [0.25, 0.36, 0.64, 0.75, 0.81]);
      let q; let ans; let unit; let sol;
      if (v === 0) { ans = q0 * Math.sqrt(frac); unit = 'μC'; q = `In an LC circuit the capacitor's maximum charge is ${q0} $\\mu$C. At some instant the energy in the capacitor is ${S(frac * 100)} % of the total energy. Find the charge on it then (in $\\mu$C, 2 decimals).`; sol = `$U_E \\propto q^2$, so $q = q_0\\sqrt{${frac}} = ${S(ans, 4)}\\ \\mu$C.`; }
      else if (v === 1) { ans = I0 * Math.sqrt(1 - frac); unit = 'mA'; q = `The maximum current in an LC circuit is ${I0} mA. At an instant the energy in the capacitor is ${S(frac * 100)} % of the total. Find the current then (in mA, 2 decimals).`; sol = `The inductor holds the rest: $\\tfrac12LI^2 = (1 - ${frac})\\tfrac12LI_0^2$, so $I = I_0\\sqrt{${S(1 - frac)}} = ${S(ans, 4)}$ mA.`; }
      else { ans = q0 * Math.sqrt(1 - frac); unit = 'μC'; q = `In an LC circuit the capacitor's maximum charge is ${q0} $\\mu$C. At an instant the energy in the inductor is ${S(frac * 100)} % of the total. Find the charge on the capacitor (in $\\mu$C, 2 decimals).`; sol = `Capacitor energy fraction $= 1 - ${frac} = ${S(1 - frac)}$, so $q = q_0\\sqrt{${S(1 - frac)}} = ${S(ans, 4)}\\ \\mu$C.`; }
      return { v, q0, I0, frac, q, answer: N(ans, 2), tol: T(ans, 2), unit, sol, trap: 'Energy goes as the square of charge or current.' };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt(p.frac * p.q0 * p.q0) : p.v === 1 ? Math.sqrt((1 - p.frac) * p.I0 * p.I0) : Math.sqrt((1 - p.frac) * p.q0 ** 2)) },
  { id: 'ac-g14', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'rms of waveforms',
    make(rng) {
      const v = int(rng, 0, 3); let q; let ans; let sol; let x; let y;
      if (v === 0) { x = choose(rng, [4, 6, 8, 10, 12]); ans = x / 2; q = `A half-wave rectified current has a peak value of ${x} A. Find its rms value (in A, 2 decimals).`; sol = `$I_{rms} = I_0/2 = ${x}/2 = ${S(ans)}$ A.`; }
      else if (v === 1) { x = choose(rng, [2, 3, 4, 5]); y = choose(rng, [2, 4, 6, 8]); ans = Math.sqrt(x * x + y * y / 2); q = `A current is $i = ${x} + ${y}\\sin\\omega t$ ampere. Find its rms value (in A, 2 decimals).`; sol = `$I_{rms}^2 = ${x}^2 + \\tfrac12\\times${y}^2 = ${S(x * x + y * y / 2, 4)}$. $I_{rms} = ${S(ans, 4)}$ A.`; }
      else if (v === 2) { x = choose(rng, [3, 6, 8, 10]); y = choose(rng, [4, 6, 8, 12]); ans = Math.sqrt((x * x + y * y) / 2); q = `A current is $i = ${x}\\sin\\omega t + ${y}\\sin3\\omega t$ ampere. Find its rms value (in A, 2 decimals).`; sol = `Different frequencies: the cross term averages to zero. $\\overline{i^2} = \\tfrac12(${x}^2 + ${y}^2) = ${S((x * x + y * y) / 2, 4)}$. $I_{rms} = ${S(ans, 4)}$ A.`; }
      else { x = choose(rng, [4, 6, 8, 10]); y = choose(rng, [0.25, 0.5, 0.2, 0.1]); ans = x * Math.sqrt(y); q = `A current equals ${x} A for a fraction ${y} of each period and is zero for the rest. Find its rms value (in A, 2 decimals).`; sol = `$\\overline{i^2} = ${y}\\times${x}^2 = ${S(y * x * x, 4)}$. $I_{rms} = ${S(ans, 4)}$ A.`; }
      return { v, x, y, q, answer: N(ans, 2), tol: T(ans, 2), unit: 'A', sol, trap: v === 1 ? 'The rms of a sum is not the sum of the rms values.' : undefined };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt(p.x * p.x / 4) : p.v === 1 ? Math.sqrt(p.x ** 2 + (p.y / SQ2) ** 2) : p.v === 2 ? Math.hypot(p.x / SQ2, p.y / SQ2) : Math.sqrt(p.y * p.x * p.x)) },
  { id: 'ac-g15', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'lead and lag',
    make(rng) {
      const v = int(rng, 0, 2); const R = choose(rng, [30, 40, 50, 60]); const XL = choose(rng, [30, 60, 80, 120]); const XC = choose(rng, [40, 90, 150]);
      let X; let desc;
      if (v === 0) { X = XL; desc = `a resistor ($${R}\\ \\Omega$) and an inductor (reactance $${XL}\\ \\Omega$) in series`; }
      else if (v === 1) { X = -XC; desc = `a resistor ($${R}\\ \\Omega$) and a capacitor (reactance $${XC}\\ \\Omega$) in series`; }
      else { X = XL - XC; desc = `a resistor ($${R}\\ \\Omega$), an inductor (reactance $${XL}\\ \\Omega$) and a capacitor (reactance $${XC}\\ \\Omega$) in series`; }
      const phi = Math.atan(Math.abs(X) / R) * 180 / PI; const ph = S(phi, 3);
      const correct = X > 0 ? `lags the voltage by ${ph}°` : X < 0 ? `leads the voltage by ${ph}°` : 'is in phase with the voltage';
      const wrongs = [X > 0 ? `leads the voltage by ${ph}°` : `lags the voltage by ${ph}°`, `lags the voltage by 90°`, 'is in phase with the voltage'];
      const o = shuffleOpts(rng, correct, X === 0 ? [`lags the voltage by 90°`, `leads the voltage by 90°`, `leads the voltage by 45°`] : wrongs);
      return { v, R, XL, XC, X, q: `Connect ${desc} across an AC source. The current in the circuit`, options: o.options, answer: o.answer,
        sol: `Net reactance $X = ${S(X)}\\ \\Omega$ (${X > 0 ? 'inductive' : X < 0 ? 'capacitive' : 'zero'}). $\\tan\\phi = |X|/R = ${S(Math.abs(X) / R, 4)}$, $\\phi = ${ph}^\\circ$. Current ${X > 0 ? 'lags (inductive circuit)' : X < 0 ? 'leads (capacitive circuit)' : 'is in phase'}.`, trap: 'The angle is arctan(X/R), not arctan(R/X).' };
    },
    verify: (p) => { const phi = Math.atan(Math.abs(p.X) / p.R) * 180 / PI; const ph = S(phi, 3); return p.options.indexOf(p.X > 0 ? `lags the voltage by ${ph}°` : p.X < 0 ? `leads the voltage by ${ph}°` : 'is in phase with the voltage'); } },
  { id: 'ac-g16', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'lamp on mains with series element',
    make(rng) {
      const v = int(rng, 0, 2); const Vb = choose(rng, [100, 110, 120, 150]); const Pb = choose(rng, [40, 50, 60, 100]); const Vs = choose(rng, [220, 230, 240]); const f = choose(rng, [50, 60]);
      const R = Vb * Vb / Pb; const I = Pb / Vb; const Z = Vs / I; const X = Math.sqrt(Z * Z - R * R);
      let q; let ans; let sol; let unit; let dp = 2;
      const lamp = `A lamp rated ${Vb} V, ${Pb} W`;
      if (v === 0) { ans = 1e6 / (W(f) * X); unit = 'μF'; q = `${lamp} is run from ${Vs} V, ${f} Hz mains with a capacitor in series. Find the capacitance needed (in $\\mu$F, 2 decimals).`; sol = `$R = ${Vb}^2/${Pb} = ${S(R, 4)}\\ \\Omega$, $I = ${Pb}/${Vb} = ${S(I, 4)}$ A. $Z = ${Vs}/${S(I, 4)} = ${S(Z, 4)}\\ \\Omega$. $X_C = \\sqrt{Z^2 - R^2} = ${S(X, 4)}\\ \\Omega$. $C = 1/(\\omega X_C) = ${S(ans, 4)}\\ \\mu$F.`; }
      else if (v === 1) { ans = X / W(f); unit = 'H'; q = `${lamp} is run from ${Vs} V, ${f} Hz mains with an ideal inductor in series. Find the inductance needed (in H, 3 decimals).`; sol = `$R = ${S(R, 4)}\\ \\Omega$, $I = ${S(I, 4)}$ A, $Z = ${S(Z, 4)}\\ \\Omega$. $X_L = \\sqrt{Z^2 - R^2} = ${S(X, 4)}\\ \\Omega$. $L = X_L/\\omega = ${S(ans, 4)}$ H.`; dp = 3; }
      else { ans = (Vs - Vb) / I; unit = 'Ω'; q = `${lamp} is run from ${Vs} V mains using a plain resistor in series (DC-style dropping resistor). Find its resistance (in $\\Omega$, 1 decimal).`; sol = `$I = ${S(I, 4)}$ A and the resistor must drop $${Vs} - ${Vb} = ${Vs - Vb}$ V (a resistor is in phase with the lamp, so voltages add directly). $R_s = ${Vs - Vb}/${S(I, 4)} = ${S(ans, 4)}\\ \\Omega$. It wastes $${S((Vs - Vb) * I, 4)}$ W as heat, unlike a choke or capacitor.`; dp = 1; }
      return { v, Vb, Pb, Vs, f, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: 'A reactive element and the lamp add as phasors; a resistor adds directly.' };
    },
    verify: (p) => { const R = p.Vb ** 2 / p.Pb; const I = p.Pb / p.Vb; const X = Math.sqrt((p.Vs / I) ** 2 - R * R); return p.v === 0 ? 1 / (2 * PI * p.f * X) * 1e6 : p.v === 1 ? X / (2 * PI * p.f) : (p.Vs - p.Vb) * p.Vb / p.Pb; } },
  { id: 'ac-g17', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'power factor and wattless current',
    make(rng) {
      const v = int(rng, 0, 3); const V = choose(rng, [110, 220, 230]); const I = choose(rng, [2, 5, 10, 20]); const pf = choose(rng, [0.5, 0.6, 0.8, 0.9]);
      let q; let ans; let sol; let unit; let dp = 2;
      if (v === 0) { ans = I * Math.sqrt(1 - pf * pf); unit = 'A'; q = `A circuit draws ${I} A rms at a power factor of ${pf}. Find the wattless current (in A, 2 decimals).`; sol = `$\\sin\\phi = \\sqrt{1 - ${pf}^2} = ${S(Math.sqrt(1 - pf * pf), 4)}$. Wattless component $I\\sin\\phi = ${I}\\times${S(Math.sqrt(1 - pf * pf), 4)} = ${S(ans, 4)}$ A.`; }
      else if (v === 1) { ans = V * I * pf; unit = 'W'; q = `A load takes ${I} A from a ${V} V rms supply at power factor ${pf}. Find the average power (in W).`; sol = `$P = VI\\cos\\phi = ${V}\\times${I}\\times${pf} = ${S(ans, 5)}$ W.`; dp = 1; }
      else if (v === 2) { ans = V * I * pf / (V * I) ; unit = undefined; q = `A load consumes ${S(V * I * pf, 5)} W while drawing ${I} A from a ${V} V rms supply. Find its power factor (2 decimals).`; sol = `$\\cos\\phi = \\dfrac{P}{VI} = \\dfrac{${S(V * I * pf, 5)}}{${V}\\times${I}} = ${pf}$.`; }
      else { ans = V * I * pf / pf; unit = 'VA'; q = `A load consumes ${S(V * I * pf, 5)} W at power factor ${pf}. Find the apparent power $V_{rms}I_{rms}$ (in VA, nearest whole number).`; sol = `$VI = P/\\cos\\phi = ${S(V * I * pf, 5)}/${pf} = ${S(ans, 5)}$ VA.`; dp = 0; }
      return { v, V, I, pf, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: v === 0 ? 'Wattless current is I sin(phi), not I cos(phi).' : undefined };
    },
    verify: (p) => (p.v === 0 ? Math.sqrt(p.I ** 2 - (p.I * p.pf) ** 2) : p.v === 1 ? p.V * p.I * p.pf : p.v === 2 ? p.pf : p.V * p.I) },
  { id: 'ac-g18', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'instantaneous values',
    make(rng) {
      const v = int(rng, 0, 2); const V0 = choose(rng, [100, 200, 311, 325]); const f = choose(rng, [50, 60]); const k12 = choose(rng, [1, 2, 3, 4, 5]);
      const T0 = 1 / f; const t = T0 * k12 / 12; const phase = 2 * PI * k12 / 12; let q; let ans; let unit; let sol; let dp = 1;
      const tms = S(t * 1e3, 4);
      if (v === 0) { ans = V0 * Math.sin(phase); unit = 'V'; q = `A voltage $v = ${V0}\\sin(2\\pi\\times${f}\\,t)$ volt. Find its value at $t = ${tms}$ ms (in V, 1 decimal).`; sol = `The phase is $2\\pi\\times${f}\\times${tms}\\times10^{-3} = ${S(k12 * 30, 3)}^\\circ$. $v = ${V0}\\sin${S(k12 * 30, 3)}^\\circ = ${S(ans, 4)}$ V.`; }
      else if (v === 1) { const half = choose(rng, [0.5, 0.707, 0.866]); const ang = half === 0.5 ? 30 : half === 0.707 ? 45 : 60; const tt = ang / 360 * T0 * 1e3; ans = tt; unit = 'ms'; q = `A ${f} Hz voltage $v = V_0\\sin\\omega t$ starts at zero. After how long does it first reach ${S(half * 100)} % of $V_0$ (in ms, 3 decimals)? (Use $\\sin${ang}^\\circ = ${half === 0.5 ? '0.5' : half === 0.707 ? '1/\\sqrt2' : '\\sqrt3/2'}$.)`; sol = `$\\sin\\omega t = ${half}$ gives $\\omega t = ${ang}^\\circ$. $t = \\dfrac{${ang}}{360}T = \\dfrac{${ang}}{360}\\times${S(T0 * 1e3, 4)} = ${S(tt, 4)}$ ms.`; dp = 3; return { v, V0, f, ang, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: 'Phase angle fraction of the period gives time.' }; }
      else { ans = V0 * Math.cos(phase); unit = 'V'; q = `A voltage $v = ${V0}\\cos(2\\pi\\times${f}\\,t)$ volt. Find its value at $t = ${tms}$ ms (in V, 1 decimal).`; sol = `The phase is $${S(k12 * 30, 3)}^\\circ$. $v = ${V0}\\cos${S(k12 * 30, 3)}^\\circ = ${S(ans, 4)}$ V.`; }
      return { v, V0, f, k12, q, answer: N(ans, dp), tol: Math.max(0.3, Math.abs(ans) * 0.004), unit, sol };
    },
    verify: (p) => (p.v === 0 ? p.V0 * Math.sin(2 * PI * p.f * (1 / p.f) * p.k12 / 12) : p.v === 1 ? Math.asin(Math.sin(p.ang * PI / 180)) / (2 * PI * p.f) * 1e3 : p.V0 * Math.cos(2 * PI * p.k12 / 12)) },
  { id: 'ac-g19', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'effect of frequency on current',
    make(rng) {
      const v = int(rng, 0, 2); const kf = choose(rng, [2, 3, 4, 5, 10]);
      const el = ['a pure inductor', 'a pure capacitor', 'a pure resistor'][v];
      const correct = v === 0 ? `falls to $1/${kf}$ of its value` : v === 1 ? `becomes ${kf} times larger` : 'stays the same';
      const wrongs = v === 0 ? [`becomes ${kf} times larger`, 'stays the same', `becomes $${kf}^2$ times larger`] : v === 1 ? [`falls to $1/${kf}$ of its value`, 'stays the same', `falls to $1/${kf}^2$ of its value`] : [`falls to $1/${kf}$ of its value`, `becomes ${kf} times larger`, 'becomes zero'];
      const o = shuffleOpts(rng, correct, wrongs);
      return { v, kf, q: `${el[0].toUpperCase()}${el.slice(1)} is connected to an AC source of fixed rms voltage. The source frequency is increased ${kf} times. The rms current`, options: o.options, answer: o.answer,
        sol: v === 0 ? `$X_L = 2\\pi fL \\propto f$ rises ${kf} times, so $I = V/X_L$ falls to $1/${kf}$.` : v === 1 ? `$X_C = 1/2\\pi fC \\propto 1/f$ falls to $1/${kf}$, so $I = V/X_C$ rises ${kf} times.` : `Resistance does not depend on frequency, so $I = V/R$ is unchanged.`, trap: 'L and C respond in opposite ways to frequency.' };
    },
    verify: (p) => { const c = p.v === 0 ? `falls to $1/${p.kf}$ of its value` : p.v === 1 ? `becomes ${p.kf} times larger` : 'stays the same'; return p.options.indexOf(c); } },
  { id: 'ac-g20', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'parallel AC circuit',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [60, 120, 240]); const R = choose(rng, [20, 30, 40, 60]); const XL = choose(rng, [20, 30, 40, 60]); const XC = choose(rng, [15, 30, 40, 80]);
      const IR = V / R; const IL = V / XL; const IC = V / XC; const I = Math.hypot(IR, IL - IC); let q; let ans; let unit; let sol;
      const ckt = `a $${R}\\ \\Omega$ resistor, an inductor of reactance $${XL}\\ \\Omega$ and a capacitor of reactance $${XC}\\ \\Omega$ connected in parallel across a ${V} V rms source`;
      if (v === 0) { ans = I; unit = 'A'; q = `Find the total rms current drawn from the source by ${ckt} (in A, 3 decimals).`; sol = `$I_R = ${S(IR, 4)}$ A, $I_L = ${S(IL, 4)}$ A (lagging), $I_C = ${S(IC, 4)}$ A (leading). $I = \\sqrt{I_R^2 + (I_L - I_C)^2} = ${S(I, 4)}$ A.`; }
      else if (v === 1) { ans = Math.abs(IL - IC); unit = 'A'; q = `For ${ckt}, find the net reactive current $|I_L - I_C|$ (in A, 3 decimals).`; sol = `$I_L = ${V}/${XL} = ${S(IL, 4)}$ A and $I_C = ${V}/${XC} = ${S(IC, 4)}$ A. They are in opposite phase, so the reactive current is $|${S(IL, 4)} - ${S(IC, 4)}| = ${S(ans, 4)}$ A.`; }
      else { ans = Math.atan(Math.abs(IL - IC) / IR) * 180 / PI; unit = '°'; q = `For ${ckt}, find the phase angle between the supply voltage and the total current (in degrees, 1 decimal).`; sol = `$\\tan\\phi = |I_L - I_C|/I_R = ${S(Math.abs(IL - IC), 4)}/${S(IR, 4)} = ${S(Math.abs(IL - IC) / IR, 4)}$, so $\\phi = ${S(ans, 4)}^\\circ$.`; }
      return { v, V, R, XL, XC, q, answer: N(ans, v === 2 ? 1 : 3), tol: T(ans, v === 2 ? 1 : 3), unit, sol, trap: 'In parallel the voltage is common; add the branch currents as phasors.' };
    },
    verify: (p) => { const a = p.V / p.R; const b = p.V / p.XL - p.V / p.XC; return p.v === 0 ? Math.sqrt(a * a + b * b) : p.v === 1 ? Math.abs(b) : Math.atan2(Math.abs(b), a) * 180 / PI; } },
  { id: 'ac-g21', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'voltmeter readings',
    make(rng) {
      const v = int(rng, 0, 2); const tri = choose(rng, [[30, 40, 50], [60, 80, 100], [24, 32, 40], [50, 120, 130], [72, 96, 120]]); const [a, b, h] = tri;
      const VC = choose(rng, [20, 30, 50]); const VL = VC + b; let q; let ans; let sol;
      if (v === 0) { ans = h; q = `In a series LCR circuit the voltmeters across R, L and C read ${a} V, ${VL} V and ${VC} V. Find the supply voltage (in V).`; sol = `$V = \\sqrt{V_R^2 + (V_L - V_C)^2} = \\sqrt{${a}^2 + ${b}^2} = ${h}$ V. (The readings are phasors at $0^\\circ$, $+90^\\circ$ and $-90^\\circ$.)`; }
      else if (v === 1) { ans = b; q = `A resistor and a capacitor are in series across a ${h} V AC source. The voltmeter across the resistor reads ${a} V. What does the voltmeter across the capacitor read (in V)?`; sol = `$V^2 = V_R^2 + V_C^2$, so $V_C = \\sqrt{${h}^2 - ${a}^2} = ${b}$ V.`; }
      else { ans = b; q = `A coil (ideal inductor) and a resistor are in series across a ${h} V AC source. The voltmeter across the resistor reads ${a} V. What does the voltmeter across the inductor read (in V)?`; sol = `$V_L = \\sqrt{V^2 - V_R^2} = \\sqrt{${h}^2 - ${a}^2} = ${b}$ V.`; }
      return { v, a, b, h, VC, VL, q, answer: ans, tol: 0, unit: 'V', sol, trap: 'Voltages across different elements do not add arithmetically.' };
    },
    verify: (p) => (p.v === 0 ? Math.hypot(p.a, p.VL - p.VC) : Math.sqrt(p.h * p.h - p.a * p.a)) },
  { id: 'ac-g22', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'resonance scaling',
    make(rng) {
      const [kc, kl] = choose(rng, [[4, 1], [1, 4], [2, 2], [9, 1], [1, 9], [4, 4], [16, 1], [1, 16], [4, 9], [2, 8]]);
      const ratio = 1 / Math.sqrt(kc * kl); const f = (x) => `${fmt(x, 3)} $f_0$`;
      const o = shuffleOpts(rng, f(ratio), [f(1 / (kc * kl)), f(Math.sqrt(kc * kl)), f(kc * kl)]);
      return { kc, kl, q: `A series LCR circuit resonates at $f_0$. ${kc === 1 ? "Its capacitance is unchanged" : `Its capacitance is made ${kc} times`} and ${kl === 1 ? "its inductance is unchanged" : `its inductance is made ${kl} times`}. The new resonant frequency is`, options: o.options, answer: o.answer,
        sol: `$f_0 \\propto 1/\\sqrt{LC}$. $LC$ becomes ${kc * kl} times, so $f$ becomes $1/\\sqrt{${kc * kl}} = ${fmt(ratio, 3)}$ of $f_0$.`, trap: 'The frequency depends on the square root of LC.' };
    },
    verify: (p) => { const r = Math.sqrt(1 / (p.kc * p.kl)); return p.options.indexOf(`${fmt(r, 3)} $f_0$`); } },
  { id: 'ac-g23', type: 'nat', level: 5, exams: exFor(5, 'nat'), sub: 'damped LC circuit',
    make(rng) {
      const v = int(rng, 0, 2); const L = choose(rng, [0.1, 0.2, 0.5, 1]); const R = choose(rng, [1, 2, 5, 10]); const C = choose(rng, [10, 20, 50]) * 1e-6; const frac = choose(rng, [0.5, 0.25, 0.1]);
      let q; let ans; let unit; let sol; let dp = 2;
      const base = `A series LC circuit with $L = ${L}$ H and $R = ${R}\\ \\Omega$ rings with the energy decaying as $e^{-Rt/L}$`;
      if (v === 0) { ans = L / R * Math.log(1 / frac) * 1e3; unit = 'ms'; q = `${base}. After how long is the energy ${S(frac * 100)} % of its initial value (in ms, 2 decimals)?`; sol = `$e^{-Rt/L} = ${frac}$ gives $t = \\dfrac{L}{R}\\ln\\dfrac{1}{${frac}} = ${S(L / R, 4)}\\times${S(Math.log(1 / frac), 4)} = ${S(ans / 1e3, 4)}$ s $= ${S(ans, 4)}$ ms.`; }
      else if (v === 1) { ans = L / R * 1e3; unit = 'ms'; q = `${base}. Find the time for the energy to fall to $1/e$ of its initial value (in ms, 2 decimals).`; sol = `$e^{-Rt/L} = e^{-1}$ gives $t = L/R = ${S(L / R, 4)}$ s $= ${S(ans, 4)}$ ms.`; }
      else { ans = 2 * L / R / (2 * PI * Math.sqrt(L * C)); unit = undefined; q = `A series LCR circuit has $L = ${L}$ H, $C = ${S(C * 1e6)}\\ \\mu$F and $R = ${R}\\ \\Omega$. The charge amplitude decays as $e^{-Rt/2L}$. Using $T \\approx 2\\pi\\sqrt{LC}$, about how many oscillations occur before the amplitude falls to $1/e$ (2 decimals)?`; sol = `Amplitude is $1/e$ at $t = 2L/R = ${S(2 * L / R, 4)}$ s. $T = 2\\pi\\sqrt{LC} = ${S(2 * PI * Math.sqrt(L * C) * 1e3, 4)}$ ms. Number of cycles $= t/T = ${S(ans, 4)}$.`; }
      return { v, L, R, C, frac, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: 'Energy decays at twice the rate of the charge amplitude.' };
    },
    verify: (p) => (p.v === 0 ? Math.log(1 / p.frac) / (p.R / p.L) * 1e3 : p.v === 1 ? 1e3 / (p.R / p.L) : (2 * p.L / p.R) / (2 * PI * Math.sqrt(p.L * p.C))) },
  { id: 'ac-g24', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'half-power frequencies',
    make(rng) {
      const v = int(rng, 0, 2); const f0 = choose(rng, [500, 1000, 1500, 2000]); const Q = choose(rng, [10, 20, 25, 40, 50]);
      const f2 = f0 * (Math.sqrt(1 + 1 / (4 * Q * Q)) + 1 / (2 * Q)); const f1 = f0 * (Math.sqrt(1 + 1 / (4 * Q * Q)) - 1 / (2 * Q));
      let ans; let q; let sol;
      const base = `A series LCR circuit has $f_0 = ${f0}$ Hz and $Q = ${Q}$`;
      if (v === 0) { ans = f2; q = `${base}. Find the higher half-power frequency (in Hz, 1 decimal).`; sol = `At half power $|X_L - X_C| = R$. Solving: $f_2 = f_0\\left[\\sqrt{1 + \\tfrac{1}{4Q^2}} + \\tfrac{1}{2Q}\\right] = ${S(f2, 6)}$ Hz.`; }
      else if (v === 1) { ans = f1; q = `${base}. Find the lower half-power frequency (in Hz, 1 decimal).`; sol = `$f_1 = f_0\\left[\\sqrt{1 + \\tfrac{1}{4Q^2}} - \\tfrac{1}{2Q}\\right] = ${S(f1, 6)}$ Hz.`; }
      else { ans = f2 - f1; q = `${base}. Find the bandwidth $f_2 - f_1$ between the half-power points (in Hz, 1 decimal).`; sol = `$f_2 - f_1 = f_0/Q = ${f0}/${Q} = ${S(ans, 4)}$ Hz.`; }
      return { v, f0, Q, q, answer: N(ans, 1), tol: Math.max(0.1, ans * 0.002), unit: 'Hz', sol, trap: 'The two half-power frequencies are not symmetric about f0 (their product is f0 squared).' };
    },
    verify: (p) => { const R = 1; const L = p.Q * R / (2 * PI * p.f0); const C = 1 / ((2 * PI * p.f0) ** 2 * L); const Z = (f) => Math.hypot(R, 2 * PI * f * L - 1 / (2 * PI * f * C)); const solve = (lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; const zl = Z(lo) - Math.SQRT2 * R; const zm = Z(m) - Math.SQRT2 * R; if (zl * zm <= 0) hi = m; else lo = m; } return (lo + hi) / 2; }; const a = solve(p.f0 * 0.5, p.f0); const b = solve(p.f0, p.f0 * 1.5); return p.v === 0 ? b : p.v === 1 ? a : b - a; } },
  { id: 'ac-g25', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'mixed',
    make(rng) {
      const v = int(rng, 0, 3); const N0 = choose(rng, [20, 50, 100, 200]); const A = choose(rng, [0.01, 0.02, 0.05]); const B = choose(rng, [0.2, 0.5, 1]); const f = choose(rng, [25, 50]); const R = choose(rng, [5, 10, 20, 50]);
      const E0 = N0 * B * A * 2 * PI * f; const Erms = E0 / SQ2; const Irms = Erms / R; const P = Irms * Irms * R;
      const ans = v === 0 ? E0 : v === 1 ? Erms : v === 2 ? Irms : P; const un = v === 3 ? 'W' : v === 2 ? 'A' : 'V';
      const what = ['peak emf (in V, 2 decimals)', 'rms emf (in V, 2 decimals)', 'rms current (in A, 3 decimals)', 'average power dissipated (in W, 1 decimal)'][v];
      const dp = v === 2 ? 3 : v === 3 ? 1 : 2;
      return { v, N0, A, B, f, R, q: `A coil of ${N0} turns and area ${A} $\\mathrm{m^2}$ rotates at ${f} revolutions per second in a field of ${B} T, and is connected to a $${R}\\ \\Omega$ resistor (the coil's own resistance is negligible). Find the ${what}.`, answer: N(ans, dp), tol: T(ans, dp), unit: un,
        sol: `$\\mathcal E_0 = NBA\\omega = ${N0}\\times${B}\\times${A}\\times${S(W(f), 4)} = ${S(E0, 4)}$ V. $\\mathcal E_{rms} = \\mathcal E_0/\\sqrt2 = ${S(Erms, 4)}$ V. $I_{rms} = \\mathcal E_{rms}/R = ${S(Irms, 4)}$ A. $P = I_{rms}^2R = ${S(P, 4)}$ W.`, trap: 'Convert revolutions per second to rad/s, and use rms for power.' };
    },
    verify: (p) => { const w = 2 * PI * p.f; const E0 = p.N0 * p.B * p.A * w; return p.v === 0 ? E0 : p.v === 1 ? E0 * Math.sqrt(0.5) : p.v === 2 ? E0 * Math.sqrt(0.5) / p.R : E0 * E0 / (2 * p.R); } },
  { id: 'ac-g26', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'power factor correction',
    make(rng) {
      const v = int(rng, 0, 2); const P = choose(rng, [1, 2, 3, 5]) * 1e3; const V = choose(rng, [200, 220, 230, 240]); const f = choose(rng, [50, 60]); const pf = choose(rng, [0.6, 0.8, 0.5]);
      const phi = Math.acos(pf); const Q = P * Math.tan(phi); const C = Q / (V * V * W(f)); const I1 = P / (V * pf); const I2 = P / V;
      let q; let ans; let unit; let sol; let dp = 1;
      const base = `A load takes ${P / 1e3} kW from a ${V} V rms, ${f} Hz supply at a lagging power factor of ${pf}`;
      if (v === 0) { ans = C * 1e6; unit = 'μF'; q = `${base}. Find the capacitance to connect in parallel to make the power factor 1 (in $\\mu$F, 1 decimal).`; sol = `$Q = P\\tan\\phi = ${P}\\times${S(Math.tan(phi), 4)} = ${S(Q, 4)}$ VAR. The capacitor supplies $Q = V^2\\omega C$: $C = \\dfrac{${S(Q, 4)}}{${V}^2\\times${S(W(f), 4)}} = ${S(ans, 4)}\\ \\mu$F.`; }
      else if (v === 1) { ans = I1; unit = 'A'; q = `${base}. Find the current it draws from the supply (in A, 2 decimals).`; sol = `$I = \\dfrac{P}{V\\cos\\phi} = \\dfrac{${P}}{${V}\\times${pf}} = ${S(I1, 4)}$ A.`; dp = 2; }
      else { ans = I2; unit = 'A'; q = `${base}. After a suitable parallel capacitor makes the power factor 1, find the current from the supply (in A, 2 decimals).`; sol = `The real power is unchanged. $I = P/V = ${P}/${V} = ${S(I2, 4)}$ A, lower than the ${S(I1, 4)} A before correction.`; dp = 2; }
      return { v, P, V, f, pf, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol, trap: 'The correcting capacitor must cancel the reactive power, not the real power.' };
    },
    verify: (p) => { const phi = Math.acos(p.pf); return p.v === 0 ? p.P * Math.sin(phi) / Math.cos(phi) / (p.V ** 2 * 2 * PI * p.f) * 1e6 : p.v === 1 ? p.P / (p.V * Math.cos(phi)) : p.P / p.V; } },
  { id: 'ac-g27', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'heating by AC',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [110, 220, 230]); const R = choose(rng, [22, 44, 55, 110]); const t = choose(rng, [1, 2, 5, 10]);
      let q; let ans; let unit; let sol; let dp = 1;
      if (v === 0) { ans = V * V / R; unit = 'W'; q = `A heater of resistance $${R}\\ \\Omega$ is connected to a ${V} V rms AC supply. Find the average power (in W, 1 decimal).`; sol = `$P = V_{rms}^2/R = ${V}^2/${R} = ${S(ans, 5)}$ W.`; }
      else if (v === 1) { ans = V * V / R * t * 60 / 1e3; unit = 'kJ'; q = `A heater of resistance $${R}\\ \\Omega$ runs on ${V} V rms AC for ${t} minutes. Find the heat produced (in kJ, 1 decimal).`; sol = `$P = ${V}^2/${R} = ${S(V * V / R, 5)}$ W. $H = Pt = ${S(V * V / R, 5)}\\times${t * 60} = ${S(ans * 1e3, 5)}$ J $= ${S(ans, 4)}$ kJ.`; }
      else { ans = V * SQ2; unit = 'V'; q = `A DC voltage of ${V} V produces the same heating in a resistor as an AC source. Find the peak value of that AC source (in V, 1 decimal).`; sol = `Equal heating means $V_{rms} = ${V}$ V, so $V_0 = \\sqrt2\\times${V} = ${S(ans, 4)}$ V.`; }
      return { v, V, R, t, q, answer: N(ans, dp), tol: T(ans, dp), unit, sol };
    },
    verify: (p) => (p.v === 0 ? p.V ** 2 / p.R : p.v === 1 ? (p.V / p.R) * p.V * p.t * 60 / 1e3 : Math.sqrt(2 * p.V ** 2)) },
];
export default { topic: 'alternating-current', groups, items, gens };
