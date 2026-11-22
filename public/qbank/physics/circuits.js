// DC transients and AC circuits: RC and RL charging and decay, energy bookkeeping, LC oscillations, damped LCR
// (under-, critically and overdamped), reactance, impedance and phasors, resonance, Q and bandwidth, rms values,
// average power and power factor, maximum power transfer.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

import * as Q5 from '../_util.js';
import more2 from './circuits.more2.gen.js';

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
  topic: 'circuits',
  items: [
    // ---------- level 1 ----------
    { id: 'cir-001', type: 'nat', level: 1, exams: ['jam'], sub: 'rc transients', unit: 's',
      q: 'A $100\\,\\mu$F capacitor charges through a 10 k$\\Omega$ resistor. The time constant is ______ s.',
      answer: 1, tol: 0.01, calc: () => 10e3 * 100e-6,
      sol: '$\\tau = RC = (10\\times10^3)(100\\times10^{-6}) = 1.0$ s. After one time constant a charging capacitor reaches 63% of its final voltage.',
      trap: 'Using 10 instead of $10^4$ for k$\\Omega$, or $10^{-4}$ wrongly for $\\mu$F ($10^{-6}$).' },
    { id: 'cir-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'reactance',
      q: 'The reactance of a 0.10 H inductor at 50 Hz is about',
      options: ['5 $\\Omega$', '31.4 $\\Omega$', '0.032 $\\Omega$', '314 $\\Omega$'], answer: 1,
      sol: '$X_L = \\omega L = 2\\pi fL = 2\\pi(50)(0.10) = 31.4\\ \\Omega$.',
      trap: 'Using $f$ instead of $\\omega = 2\\pi f$ gives 5 $\\Omega$.' },
    { id: 'cir-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'phase',
      q: 'In an AC circuit containing only a capacitor, the current',
      options: ['is in phase with the voltage', 'lags the voltage by $90^\\circ$', 'leads the voltage by $45^\\circ$', 'leads the voltage by $90^\\circ$'], answer: 3,
      sol: '$q = CV_0\\sin\\omega t$ so $I = dq/dt = \\omega CV_0\\cos\\omega t = \\omega CV_0\\sin(\\omega t + 90^\\circ)$. The current peaks a quarter cycle before the voltage: it leads by $90^\\circ$. (Memory aid: "ICE": in a capacitor, I before E.)',
      trap: 'Lagging by $90^\\circ$ is the inductor.' },
    { id: 'cir-004', type: 'msq', level: 1, exams: ['jam'], sub: 'resonance',
      q: 'A series LCR circuit is driven at its resonant frequency. Which statements are correct?',
      options: ['Its impedance is at its minimum, equal to $R$.', 'The current is in phase with the source voltage.', 'The voltages across $L$ and $C$ are equal in size and opposite in phase.', 'The power factor is zero.'], answer: [0, 1, 2],
      sol: 'At $\\omega_0 = 1/\\sqrt{LC}$, $X_L = X_C$, so $Z = \\sqrt{R^2 + (X_L - X_C)^2} = R$ is smallest, and the phase $\\tan\\phi = (X_L - X_C)/R = 0$. $V_L$ and $V_C$ are equal and $180^\\circ$ apart, so they cancel. Power factor $\\cos\\phi = 1$, the largest possible.',
      trap: 'Zero power factor belongs to a pure $L$ or pure $C$, not to resonance.' },
    { id: 'cir-005', type: 'nat', level: 1, exams: ['jam'], sub: 'rms', unit: 'V',
      q: 'A sinusoidal mains voltage has a peak value of 311 V. Its rms value is ______ V (to the nearest whole number).',
      answer: 220, tol: 1, calc: () => 311 / Math.SQRT2,
      sol: 'For a sine wave, $V_{\\text{rms}} = V_0/\\sqrt2 = 311/1.414 = 220$ V. The rms value is the steady DC voltage that would heat a resistor equally.',
      trap: 'The average of a full sine wave is zero; the average of its magnitude is $2V_0/\\pi = 198$ V, which is not the rms.' },
    { id: 'cir-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'rc transients',
      q: 'A capacitor charges from zero through a resistor from a battery. After one time constant its voltage is about what fraction of the battery voltage?',
      options: ['37%', '50%', '63%', '86%'], answer: 2,
      sol: '$V = V_0(1 - e^{-t/\\tau})$; at $t = \\tau$, $1 - e^{-1} = 0.632$. After $2\\tau$ it is 86%, after $5\\tau$ more than 99%.',
      trap: '37% is what is <em>left</em> of a discharging capacitor after one $\\tau$.' },
    // ---------- level 2 ----------
    { id: 'cir-007', type: 'nat', level: 2, exams: ['jam'], sub: 'resonance', unit: 'Hz',
      q: 'A 10 mH inductor and a $1.0\\,\\mu$F capacitor are in series with a small resistor. The resonant frequency is ______ Hz (to the nearest whole number).',
      answer: 1592, tol: 16, calc: () => 1 / (2 * Math.PI * Math.sqrt(10e-3 * 1e-6)),
      sol: '$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}} = \\dfrac{1}{2\\pi\\sqrt{10^{-2}\\times10^{-6}}} = \\dfrac{1}{2\\pi\\times10^{-4}} = 1592$ Hz.',
      trap: '$1/\\sqrt{LC} = 10^4$ is $\\omega_0$ in rad/s; divide by $2\\pi$ for hertz.' },
    { id: 'cir-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'power',
      q: 'A coil of resistance 30 $\\Omega$ and reactance 40 $\\Omega$ is connected to an AC supply. Its power factor is',
      options: ['0.75', '0.8', '0.6', '1.33'], answer: 2,
      sol: '$Z = \\sqrt{30^2 + 40^2} = 50\\ \\Omega$. Power factor $\\cos\\phi = R/Z = 30/50 = 0.6$.',
      trap: '0.8 is $X/Z$, which is $\\sin\\phi$.' },
    { id: 'cir-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'impedance',
      q: 'A series circuit has $R = 30\\ \\Omega$, $X_L = 80\\ \\Omega$ and $X_C = 40\\ \\Omega$. Its impedance is',
      options: ['50 $\\Omega$', '150 $\\Omega$', '96 $\\Omega$', '70 $\\Omega$'], answer: 0,
      sol: 'Inductive and capacitive reactances subtract (their voltages are $180^\\circ$ apart): $Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{900 + 1600} = 50\\ \\Omega$.',
      trap: 'Adding all three (150) or adding the reactances in quadrature (96).' },
    { id: 'cir-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'rc transients',
      q: 'A capacitor discharges through a resistor. The time for its voltage to fall to half is',
      options: ['$\\tau/2$', '$\\tau\\ln2$', '$\\tau$', '$2\\tau$'], answer: 1,
      sol: '$V = V_0e^{-t/\\tau} = V_0/2$ gives $t = \\tau\\ln2 = 0.693\\tau$. The stored energy ($\\propto V^2$) halves sooner, at $\\tfrac12\\tau\\ln2$.',
      trap: 'Thinking half-life equals the time constant.' },
    { id: 'cir-011', type: 'nat', level: 2, exams: ['jam'], sub: 'energy', unit: 'mJ',
      q: 'A $2.0\\,\\mu$F capacitor is charged from zero to 100 V through a 1 k$\\Omega$ resistor by a 100 V battery. The heat produced in the resistor is ______ mJ.',
      answer: 10, tol: 0.1, calc: () => 0.5 * 2e-6 * 100 ** 2 * 1e3,
      sol: 'The battery delivers $QV = CV^2 = 20$ mJ. The capacitor stores $\\tfrac12CV^2 = 10$ mJ. The rest, 10 mJ, is heat in the resistor, whatever its resistance: $\\int I^2R\\,dt = \\int_0^\\infty\\dfrac{V^2}{R}e^{-2t/RC}dt = \\tfrac12CV^2$.',
      trap: 'Expecting a smaller resistor to waste less. It carries a bigger current for a shorter time and wastes exactly the same.' },
    { id: 'cir-012', type: 'msq', level: 2, exams: ['jam'], sub: 'rl transients',
      q: 'A battery $V$ is switched on at $t = 0$ to a resistor $R$ and an inductor $L$ in series. Which statements are correct?',
      options: ['The current is zero just after the switch closes.', 'Just after the switch closes, the voltage across the inductor equals $V$.', 'After a long time the inductor behaves like a plain wire.', 'The time constant is $RL$.'], answer: [0, 1, 2],
      sol: 'An inductor resists sudden changes of current, so $I(0^+) = 0$; then there is no drop across $R$, and the whole $V$ appears across $L$. As $I \\to V/R$, $dI/dt \\to 0$ and the inductor\'s voltage vanishes: it is a short circuit. The time constant is $L/R$ (henry per ohm = seconds).',
      trap: '$RL$ has units of $\\Omega$ H, not seconds. $RC$ for capacitors, $L/R$ for inductors.' },
    { id: 'cir-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'power',
      q: 'The average power delivered to a circuit by a sinusoidal source with rms voltage $V$ and rms current $I$, the current lagging by $\\phi$, is',
      options: ['$VI$', '$VI\\sin\\phi$', '$\\tfrac12VI\\cos\\phi$', '$VI\\cos\\phi$'], answer: 3,
      sol: 'Instantaneous power is $v(t)i(t)$. Averaging $\\sqrt2V\\sin\\omega t\\cdot\\sqrt2I\\sin(\\omega t - \\phi)$ over a cycle gives $VI\\cos\\phi$. With peak values it would be $\\tfrac12V_0I_0\\cos\\phi$.',
      trap: 'The $\\tfrac12$ appears only with peak values, not rms values.' },
    { id: 'cir-014', type: 'nat', level: 2, exams: ['jam'], sub: 'q factor',
      q: 'A series LCR circuit has $R = 10\\ \\Omega$, $L = 0.10$ H and $C = 10\\,\\mu$F. Its quality factor is ______.',
      answer: 10, tol: 0.05, calc: () => Math.sqrt(0.1 / 10e-6) / 10,
      sol: '$Q = \\dfrac{\\omega_0L}{R} = \\dfrac1R\\sqrt{\\dfrac LC} = \\dfrac1{10}\\sqrt{\\dfrac{0.10}{10^{-5}}} = \\dfrac{100}{10} = 10$.',
      trap: 'Inverting the square root: it is $\\sqrt{L/C}$, which has units of ohms.' },
    { id: 'cir-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'lc oscillations',
      q: 'In an ideal LC circuit the charge oscillates at angular frequency $\\omega_0$. The energy stored in the capacitor oscillates at',
      options: ['$\\omega_0/2$', '$\\omega_0$', '$2\\omega_0$', '$4\\omega_0$'], answer: 2,
      sol: '$U_C = \\dfrac{q^2}{2C} = \\dfrac{Q_0^2}{2C}\\cos^2\\omega_0t = \\dfrac{Q_0^2}{4C}(1 + \\cos2\\omega_0t)$. It peaks twice per cycle of charge (at $q = +Q_0$ and $q = -Q_0$).',
      trap: 'Energy depends on $q^2$, so it ignores the sign of the charge and repeats twice as often.' },
    { id: 'cir-016', type: 'nat', level: 2, exams: ['jam'], sub: 'q factor', unit: 'Hz',
      q: 'A series LCR circuit has $R = 20\\ \\Omega$ and $L = 0.50$ H. Its half-power bandwidth is ______ Hz (to two decimal places).',
      answer: 6.37, tol: 0.06, calc: () => 20 / (2 * Math.PI * 0.5),
      sol: 'The half-power points are separated by $\\Delta\\omega = R/L = 40$ rad/s, independent of $C$. In hertz: $\\Delta f = \\dfrac{40}{2\\pi} = 6.37$ Hz.',
      trap: 'Giving 40: that is in rad/s.' },
    // ---------- level 3 ----------
    { id: 'cir-017', type: 'nat', level: 3, exams: ['jam'], sub: 'rc transients', unit: 'mA',
      q: 'A 12 V battery charges an uncharged capacitor through a 4.0 k$\\Omega$ resistor. One time constant after the switch closes, the current is ______ mA (to two decimal places).',
      answer: 1.10, tol: 0.01, calc: () => 12 / 4000 * Math.exp(-1) * 1000,
      sol: 'The charging current is $I = \\dfrac VRe^{-t/\\tau}$, starting at $12/4000 = 3.0$ mA. At $t = \\tau$: $3.0\\times e^{-1} = 3.0\\times0.368 = 1.10$ mA.',
      trap: 'Using $(1 - e^{-1})$ for the current. Voltage on the capacitor rises like that; current falls.' },
    { id: 'cir-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'damped lcr',
      q: 'A charged capacitor discharges through a series inductor and resistor. The charge returns to zero fastest without oscillating when',
      options: ['$R = \\sqrt{L/C}$', '$R = 2\\sqrt{L/C}$', '$R = \\tfrac12\\sqrt{L/C}$', '$R = 0$'], answer: 1,
      sol: '$L\\ddot q + R\\dot q + q/C = 0$ has roots $s = -\\dfrac{R}{2L} \\pm\\sqrt{\\dfrac{R^2}{4L^2} - \\dfrac1{LC}}$. Critical damping, where the square root vanishes, is $R = 2\\sqrt{L/C}$. Less resistance oscillates; more creeps back slowly.',
      trap: '$\\sqrt{L/C}$ without the 2 is the characteristic impedance, not the critical resistance.' },
    { id: 'cir-019', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'damped lcr', unit: '$\\Omega$',
      q: 'For a series circuit with $L = 0.20$ H and $C = 5.0\\,\\mu$F, the resistance for critical damping is ______ $\\Omega$.',
      answer: 400, tol: 1, calc: () => 2 * Math.sqrt(0.2 / 5e-6),
      sol: '$R_c = 2\\sqrt{L/C} = 2\\sqrt{0.20/(5.0\\times10^{-6})} = 2\\sqrt{4\\times10^4} = 400\\ \\Omega$.',
      trap: 'Forgetting the factor 2 gives 200 $\\Omega$.' },
    { id: 'cir-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'damped lcr',
      q: 'Which statements about the free (undriven) series LCR circuit are correct?',
      options: ['It oscillates if $R < 2\\sqrt{L/C}$.', 'When it oscillates, the angular frequency is $\\sqrt{\\dfrac1{LC} - \\dfrac{R^2}{4L^2}}$.', 'When critically damped, the charge returns to zero fastest without overshooting.', 'When overdamped, it oscillates with a decaying amplitude.'], answer: [0, 1, 2],
      sol: 'The characteristic roots are complex when $R^2/4L^2 < 1/LC$, i.e. $R < 2\\sqrt{L/C}$, giving decaying oscillations at $\\omega_d = \\sqrt{\\omega_0^2 - (R/2L)^2}$. At equality the response is critical: quickest return without overshoot. Above it (overdamped) both roots are real and negative: no oscillation, just a slow decay.',
      trap: 'Overdamped means too much damping to oscillate at all.' },
    { id: 'cir-021', type: 'nat', level: 3, exams: ['jam'], sub: 'power', unit: 'W',
      q: 'A series LCR circuit with $R = 100\\ \\Omega$ is connected to a 200 V rms supply at a frequency where $X_L - X_C = 100\\ \\Omega$. The average power drawn is ______ W.',
      answer: 200, tol: 1, calc: () => (200 / Math.hypot(100, 100)) ** 2 * 100,
      sol: '$Z = \\sqrt{100^2 + 100^2} = 141.4\\ \\Omega$, $I_{\\text{rms}} = 200/141.4 = 1.414$ A. Only the resistor absorbs power: $P = I^2R = 2.0\\times100 = 200$ W. (Equivalently $VI\\cos\\phi = 200\\times1.414\\times0.707$.) At resonance it would be 400 W: here we sit at a half-power point.',
      trap: 'Computing $V^2/R = 400$ W, which holds only at resonance.' },
    { id: 'cir-022', type: 'mcq', level: 3, exams: ['jam'], sub: 'resonance',
      q: 'At resonance, the rms voltage across the capacitor of a series LCR circuit (quality factor $Q$) driven by a source of rms voltage $V$ is',
      options: ['$V/Q$', '$V$', 'zero, since it cancels the inductor', '$QV$'], answer: 3,
      sol: 'At resonance $I = V/R$, so $V_C = IX_C = \\dfrac{V}{R}\\cdot\\dfrac1{\\omega_0C} = V\\cdot\\dfrac{1}{\\omega_0RC} = QV$. With $Q = 50$, a 2 V source puts 100 V across the capacitor, which is why radio tuning circuits magnify weak signals (and why components must be rated for it).',
      trap: 'The $L$ and $C$ voltages cancel each other, but each one alone is $Q$ times the source.' },
    { id: 'cir-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'power transfer',
      q: 'A 10 V source with internal resistance 5 $\\Omega$ feeds a variable load resistor. The largest power the load can draw is',
      options: ['20 W', '10 W', '5 W', '2.5 W'], answer: 2,
      sol: '$P = \\dfrac{V^2R_L}{(R_L + r)^2}$ is greatest when $R_L = r = 5\\ \\Omega$. Then $I = 1$ A and $P = I^2R_L = 5$ W $= V^2/(4r)$. The source wastes another 5 W inside, so efficiency is only 50%.',
      trap: '20 W is $V^2/r$, the power wasted if the terminals are shorted.' },
    { id: 'cir-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'resonance',
      q: 'An ideal inductor and an ideal capacitor are connected in parallel across an AC source at their resonant frequency $1/\\sqrt{LC}$. The current drawn from the source is',
      options: ['zero, because the impedance is infinite', 'very large, because the impedance is zero', 'the same as through the inductor alone', 'twice the current through the capacitor'], answer: 0,
      sol: 'In parallel each branch gets the full source voltage. The inductor current lags by $90^\\circ$ and the capacitor current leads by $90^\\circ$; at resonance they are equal and cancel. The source supplies nothing while a large current circulates round the LC loop. Real coils have resistance, so the line current is small, not zero.',
      trap: 'Series resonance gives minimum impedance; parallel resonance gives maximum.' },
    { id: 'cir-025', type: 'nat', level: 3, exams: ['jam'], sub: 'rc transients', unit: 'ms',
      q: 'A $10\\,\\mu$F capacitor charged to 10 V discharges through a 2.0 k$\\Omega$ and a 3.0 k$\\Omega$ resistor connected in parallel with each other. The time constant is ______ ms.',
      answer: 12, tol: 0.1, calc: () => 10e-6 * (2000 * 3000 / 5000) * 1000,
      sol: 'The capacitor sees the two resistors in parallel: $R = \\dfrac{2\\times3}{2+3} = 1.2$ k$\\Omega$. $\\tau = RC = 1200\\times10^{-5} = 12$ ms.',
      trap: 'Adding the resistors (50 ms). Ask which resistance the capacitor discharges through.' },
    { id: 'cir-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'phase',
      q: 'A 100 $\\Omega$ resistor and a capacitor of reactance 100 $\\Omega$ are in series across an AC source. The current',
      options: ['leads the source voltage by $45^\\circ$', 'lags the source voltage by $45^\\circ$', 'leads the source voltage by $90^\\circ$', 'is in phase with the source voltage'], answer: 0,
      sol: '$Z = R - jX_C = 100 - 100j$, of phase $-45^\\circ$. The current $I = V/Z$ has phase $+45^\\circ$ relative to $V$: it leads. Capacitive circuits have leading currents.',
      trap: 'Mixing up the sign: an RL circuit would have the current lagging.' },
    { id: 'cir-027', type: 'msq', level: 3, exams: ['jam'], sub: 'phasors',
      q: 'In a series LCR circuit the rms voltages are $V_R = 30$ V, $V_L = 80$ V and $V_C = 40$ V. Which statements are correct?',
      options: ['The rms source voltage is 50 V.', 'The circuit is inductive.', 'The current lags the source voltage by about $53^\\circ$.', 'The rms source voltage is the sum of the three rms voltages, 150 V.'], answer: [0, 1, 2],
      sol: 'Phasors: $V_R$ along the current, $V_L$ ahead by $90^\\circ$, $V_C$ behind by $90^\\circ$. $V = \\sqrt{30^2 + (80-40)^2} = 50$ V. $V_L > V_C$, so the circuit is inductive and the current lags by $\\tan^{-1}(40/30) = 53.1^\\circ$. rms values of out-of-phase voltages do not add arithmetically.',
      trap: 'The component voltages can each exceed the source voltage; only their phasor sum equals it.' },
    { id: 'cir-028', type: 'nat', level: 3, exams: ['jam'], sub: 'rl transients', unit: 'mA',
      q: 'A 10 V battery is switched on at $t = 0$ to a 100 $\\Omega$ resistor in series with a 0.50 H inductor. The current at $t = 10$ ms is ______ mA (to one decimal place).',
      answer: 86.5, tol: 0.9, calc: () => 0.1 * (1 - Math.exp(-0.01 / 0.005)) * 1000,
      sol: '$\\tau = L/R = 5.0$ ms and $I_\\infty = 100$ mA. $I = 100(1 - e^{-10/5}) = 100(1 - 0.135) = 86.5$ mA.',
      trap: 'Using $\\tau = RL = 50$ s, which gives almost zero current.' },
    // ---------- level 4 ----------
    { id: 'cir-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'energy', unit: '$\\tau$',
      q: 'A capacitor charges from zero through a resistor from a battery. The time at which the stored energy reaches half of its final value, in units of the time constant $\\tau$, is ______ (to two decimal places).',
      answer: 1.23, tol: 0.01, calc: () => -Math.log(1 - 1 / Math.SQRT2),
      sol: '$U \\propto V^2 \\propto (1 - e^{-t/\\tau})^2$. Setting this to $\\tfrac12$: $1 - e^{-t/\\tau} = 1/\\sqrt2$, so $e^{-t/\\tau} = 0.2929$ and $t = \\tau\\ln(1/0.2929) = 1.23\\tau$.',
      trap: 'Using $\\tau\\ln2 = 0.69\\tau$, which is when the voltage reaches half.' },
    { id: 'cir-030', type: 'mcq', level: 4, exams: ['jam'], sub: 'energy',
      q: 'A battery charges an initially uncharged capacitor through a resistor until the current stops. The fraction of the energy supplied by the battery that ends up stored in the capacitor',
      options: ['depends on the resistance: nearly all of it for a tiny resistor', 'is exactly one half, whatever the resistance', 'is $1 - e^{-1}$', 'depends on the capacitance'], answer: 1,
      sol: 'The battery moves charge $CV$ through voltage $V$: energy $CV^2$. The capacitor holds $\\tfrac12CV^2$. The other half is lost (as heat in $R$, and as radiation if $R$ is very small), for every $R$ and $C$. Charging in many small voltage steps reduces the loss.',
      trap: 'Thinking a superconducting wire would avoid the loss: the energy then goes into radiation and oscillation.' },
    { id: 'cir-031', type: 'nat', level: 4, exams: ['jam'], sub: 'lc oscillations', unit: 'A',
      q: 'A $4.0\\,\\mu$F capacitor charged to 50 V is connected across an ideal 1.0 mH inductor at $t = 0$. The largest current in the circuit is ______ A (to two decimal places).',
      answer: 3.16, tol: 0.03, calc: () => 50 * Math.sqrt(4e-6 / 1e-3),
      sol: 'Energy moves between the capacitor and the inductor: $\\tfrac12CV_0^2 = \\tfrac12LI_{\\max}^2$, so $I_{\\max} = V_0\\sqrt{C/L} = 50\\sqrt{4\\times10^{-3}} = 50\\times0.0632 = 3.16$ A. It occurs a quarter period ($\\tfrac\\pi2\\sqrt{LC} = 99\\,\\mu$s) after connection.',
      trap: 'Inverting the ratio, $\\sqrt{L/C}$, gives a number in ohms; $V/\\sqrt{L/C}$ is the current.' },
    { id: 'cir-032', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'resonance',
      q: 'A series LCR circuit with finite $Q$ is driven by a source of fixed rms voltage and variable frequency. Which statements are correct?',
      options: ['The current is largest at $\\omega_0 = 1/\\sqrt{LC}$.', 'The voltage across $C$ is largest at a frequency a little below $\\omega_0$.', 'The voltage across $L$ is largest at a frequency a little above $\\omega_0$.', 'The average power drawn is largest at a frequency below $\\omega_0$.'], answer: [0, 1, 2],
      sol: '$I = V/|Z|$ and $P = I^2R$ both peak exactly at $\\omega_0$. But $V_C = I/(\\omega C)$ has an extra $1/\\omega$ that favours lower frequencies, and $V_L = I\\omega L$ an extra $\\omega$ favouring higher ones; for large $Q$ the shifts are tiny. This mirrors a driven oscillator, where displacement peaks below $\\omega_0$ but velocity and power peak exactly at it.',
      trap: 'Power follows the current, so it peaks exactly at $\\omega_0$.' },
    { id: 'cir-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'damped lcr', unit: 'Hz',
      q: 'A series circuit with $L = 1.0$ H, $C = 1.0\\,\\mu$F and $R = 200\\ \\Omega$ is left to oscillate freely. Its oscillation frequency is ______ Hz (to one decimal place).',
      answer: 158.4, tol: 0.5, calc: () => Math.sqrt(1 / (1 * 1e-6) - (200 / 2) ** 2) / (2 * Math.PI),
      sol: '$\\omega_0 = 1/\\sqrt{LC} = 1000$ rad/s and $\\gamma = R/2L = 100$ s$^{-1}$. $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2} = \\sqrt{10^6 - 10^4} = 995.0$ rad/s, so $f_d = 995.0/2\\pi = 158.4$ Hz (just below $f_0 = 159.2$ Hz).',
      trap: 'Using $R/L$ instead of $R/2L$ for the damping rate.' },
    { id: 'cir-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'energy',
      q: 'A capacitor $C$ charged to $V$ is connected through a resistor to an identical uncharged capacitor. When the current has stopped, the energy turned into heat is',
      options: ['zero', '$\\tfrac12CV^2$', '$\\tfrac14CV^2$, but only if the resistance is large', '$\\tfrac14CV^2$, whatever the resistance'], answer: 3,
      sol: 'Charge $CV$ shares equally, so each ends at $V/2$. Final energy $2\\times\\tfrac12C(V/2)^2 = \\tfrac14CV^2$; initial $\\tfrac12CV^2$. Lost: $\\tfrac14CV^2$, half the original, independent of $R$ (which only sets how fast).',
      trap: 'Supposing that a small resistance wastes less. It changes the rate, not the total.' },
    { id: 'cir-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'q factor', unit: 'rad/s',
      q: 'A series circuit has $R = 10\\ \\Omega$, $L = 10$ mH and $C = 1.0\\,\\mu$F. The upper half-power angular frequency is ______ rad/s (to the nearest whole number).',
      answer: 10512, tol: 10, calc: () => { const g = 10 / (2 * 0.01); return Math.sqrt(1 / (0.01 * 1e-6) + g * g) + g; },
      sol: 'Half power where $|X_L - X_C| = R$: $\\omega L - \\dfrac1{\\omega C} = R$, a quadratic with positive root $\\omega_+ = \\dfrac{R}{2L} + \\sqrt{\\dfrac{R^2}{4L^2} + \\dfrac1{LC}} = 500 + \\sqrt{2.5\\times10^5 + 10^8} = 500 + 10012.5 = 10512$ rad/s. The lower one is $10012.5 - 500 = 9512$ rad/s; their difference is $R/L = 1000$ exactly, and their product is $\\omega_0^2$.',
      trap: 'Taking $\\omega_0 + R/2L = 10500$: close, but the half-power points sit symmetric about $\\omega_0$ only on a log scale.' },
    { id: 'cir-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'resonance',
      q: 'A series LCR circuit is driven exactly at resonance in the steady state. The total energy stored in the inductor and capacitor together',
      options: ['oscillates at twice the driving frequency', 'is zero on average', 'grows steadily with time', 'is constant in time'], answer: 3,
      sol: 'With $I = I_0\\cos\\omega_0t$, $q = (I_0/\\omega_0)\\sin\\omega_0t$. Then $U = \\tfrac12LI_0^2\\cos^2\\omega_0t + \\dfrac{I_0^2}{2C\\omega_0^2}\\sin^2\\omega_0t$, and since $1/(C\\omega_0^2) = L$, $U = \\tfrac12LI_0^2$, constant. Energy just sloshes between $L$ and $C$ while the source feeds exactly what $R$ burns. Off resonance the total stored energy does oscillate.',
      trap: 'Each energy alone oscillates at $2\\omega$; at resonance the two oscillations cancel exactly.' },
    // ---------- level 5 ----------
    { id: 'cir-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'rc transients', unit: 'V',
      q: 'A 12 V battery, a 2.0 k$\\Omega$ resistor and a $3.0\\,\\mu$F capacitor are in series, and a 4.0 k$\\Omega$ resistor is connected directly across the capacitor. The capacitor starts uncharged. Its voltage 4.0 ms after the switch closes is ______ V (to two decimal places).',
      answer: 5.06, tol: 0.05, calc: () => 8 * (1 - Math.exp(-4e-3 / (3e-6 * 2000 * 4000 / 6000))),
      sol: 'Replace the battery and the two resistors by their Thevenin equivalent as seen by the capacitor: $V_{th} = 12\\times\\dfrac{4}{2+4} = 8$ V and $R_{th} = 2\\parallel4 = 1.333$ k$\\Omega$. So $\\tau = R_{th}C = 4.0$ ms and $V_C = 8(1 - e^{-t/\\tau})$. At $t = 4.0$ ms: $8(1 - e^{-1}) = 5.06$ V.',
      trap: 'Using the full 12 V and 2 k$\\Omega$ (as if the 4 k$\\Omega$ were absent), giving $\\tau = 6$ ms and the wrong final voltage.' },
    { id: 'cir-038', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'q factor',
      q: 'Which statements about the quality factor $Q$ of a series LCR circuit are correct?',
      options: ['$Q = \\omega_0/\\Delta\\omega$, where $\\Delta\\omega$ is the half-power bandwidth.', '$Q = 2\\pi\\times$ (energy stored)/(energy lost per cycle) at resonance.', 'Increasing $R$ increases $Q$.', 'At resonance the capacitor voltage is $Q$ times the source voltage.'], answer: [0, 1, 3],
      sol: '$\\Delta\\omega = R/L$, so $\\omega_0/\\Delta\\omega = \\omega_0L/R = Q$. Stored energy at resonance is $\\tfrac12LI_0^2$; loss per cycle is $\\tfrac12I_0^2R\\times2\\pi/\\omega_0$; the ratio times $2\\pi$ is $\\omega_0L/R$. $V_C = QV$ (shown in the lesson). $Q = \\dfrac1R\\sqrt{L/C}$ falls as $R$ rises.',
      trap: 'For a parallel tank with the resistor in parallel, $Q$ rises with $R$ (it is $R\\sqrt{C/L}$). The question says series.' },
    { id: 'cir-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'resonance',
      q: 'A coil (inductance $L$, resistance $R$) is connected in parallel with a capacitor $C$. The source current is in phase with the source voltage at the angular frequency',
      options: ['$\\sqrt{\\dfrac1{LC} + \\dfrac{R^2}{L^2}}$', '$\\dfrac{1}{\\sqrt{LC}}$', '$\\sqrt{\\dfrac1{LC} - \\dfrac{R^2}{L^2}}$', '$\\sqrt{\\dfrac1{LC} - \\dfrac{R^2}{4L^2}}$'], answer: 2,
      sol: 'Admittance $Y = j\\omega C + \\dfrac{1}{R + j\\omega L} = j\\omega C + \\dfrac{R - j\\omega L}{R^2 + \\omega^2L^2}$. Unity power factor needs the imaginary part zero: $C = \\dfrac{L}{R^2 + \\omega^2L^2}$, so $\\omega^2 = \\dfrac1{LC} - \\dfrac{R^2}{L^2}$.',
      trap: 'The last option is the damped free-oscillation frequency of a series circuit, a different question.' },
    { id: 'cir-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'power transfer', unit: 'W',
      q: 'An AC source of 100 V rms has internal impedance $(30 + 40j)\\ \\Omega$. The load impedance is chosen to draw the greatest possible average power. That power is ______ W (to one decimal place).',
      answer: 83.3, tol: 0.4, calc: () => 100 ** 2 / (4 * 30),
      sol: 'Maximum transfer needs the load to be the complex conjugate of the source impedance, $Z_L = 30 - 40j\\ \\Omega$: the reactances cancel, leaving $60\\ \\Omega$ in total. $I = 100/60 = 1.667$ A and $P_L = I^2(30) = 83.3$ W $= V^2/(4R_s)$.',
      trap: 'Matching $|Z_L| = |Z_s| = 50\\ \\Omega$ with a pure resistor gives less: $P = 100^2\\times50/((80)^2+40^2) = 62.5$ W.' },
    ...more2,
  ],
  gens: [
    { id: 'cir-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'rl transients', format: 'limiting case',
      make(r) {
        const E = Q5.int(r, 6, 24), R1 = Q5.int(r, 2, 20), R2 = Q5.int(r, 2, 20), ind = r() < 0.5, late = r() < 0.5;
        const a = E / R1, b = E / (R1 + R2), right = (ind !== late) ? b : a;
        const s = (v) => `$${Q5.round(v, 3)}$ A`;
        const o = Q5.mcqOptions(r, right, [right === a ? b : a, 0, E / R2, E * (R1 + R2) / (R1 * R2)], s);
        return { q: `A $${E}$ V battery (no internal resistance) is switched on to a $${R1}\\ \\Omega$ resistor in series with a parallel pair: a $${R2}\\ \\Omega$ resistor and ${ind ? 'an ideal inductor' : 'an uncharged capacitor'}. The current drawn from the battery ${late ? 'a long time after' : 'just after'} the switch is closed is`, ...o,
          sol: ind ? `An inductor keeps its current at first (zero), so just after closing it acts as an open switch: $I = E/(R_1 + R_2) = ${Q5.round(b, 3)}$ A. Long after, it is a plain wire that shorts out $R_2$: $I = E/R_1 = ${Q5.round(a, 3)}$ A.`
            : `An uncharged capacitor keeps its voltage at first (zero), so just after closing it acts as a wire that shorts out $R_2$: $I = E/R_1 = ${Q5.round(a, 3)}$ A. Long after, it is fully charged and carries no current: $I = E/(R_1 + R_2) = ${Q5.round(b, 3)}$ A.`,
          trap: 'At switch-on an inductor looks open and a capacitor looks shorted; at steady DC it is the other way round.' };
      } },
    { id: 'cir-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'resonance', format: 'statements',
      make(r) {
        const c = Q5.int(r, 0, 2);
        const L = [
          [['The circuit behaves capacitively.', 'The current leads the source voltage.', 'The impedance is larger than $R$.', 'Raising the frequency a little would increase the current.'], ['The circuit behaves inductively.', 'The current lags the source voltage.', 'The impedance equals $R$.', 'The power factor is 1.']],
          [['The current is in phase with the source voltage.', 'The impedance equals $R$.', 'The voltages across $L$ and $C$ are equal in size and opposite in phase.', 'The power factor is 1.'], ['The current leads the source voltage.', 'The current lags the source voltage.', 'The voltage across the inductor is zero.', 'The impedance is zero.']],
          [['The circuit behaves inductively.', 'The current lags the source voltage.', 'The impedance is larger than $R$.', 'Raising the frequency a little would decrease the current.'], ['The circuit behaves capacitively.', 'The current leads the source voltage.', 'The impedance equals $R$.', 'The power factor is 1.']]][c];
        const o = q5msq(r, L[0], L[1]);
        return { q: `A series LCR circuit is driven by an AC source at a frequency ${['below', 'equal to', 'above'][c]} its resonant frequency. Which statements are correct?`, ...o,
          sol: `$Z = \\sqrt{R^2 + (X_L - X_C)^2}$ with $X_L = \\omega L$ rising and $X_C = 1/\\omega C$ falling with frequency. ${['Below resonance $X_C > X_L$: the net reactance is capacitive, the current leads, $Z > R$, and moving towards resonance (raising $f$) increases the current.', 'At resonance $X_L = X_C$: they cancel, $Z = R$ (its minimum, not zero), the current is in phase, $\\cos\\phi = 1$, and $V_L = V_C$ in size but opposite in phase (each can be much larger than the source voltage).', 'Above resonance $X_L > X_C$: inductive, the current lags, $Z > R$, and moving away from resonance (raising $f$) decreases the current.'][c]}`,
          trap: 'At resonance the impedance is $R$, not zero, and the voltage across $L$ alone is not zero.' };
      } },
    { id: 'cir-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'rms', unit: 'V',
      make(r) {
        const V1 = Q5.int(r, 1, 20), V2 = -Q5.int(r, 0, 20), f = Q5.pick(r, 0.1, 0.9, 0.05);
        const rms = Math.sqrt(f * V1 * V1 + (1 - f) * V2 * V2);
        return { q: `A voltage repeats every period: it is $+${V1}$ V for a fraction $${f}$ of each period and $${V2}$ V for the rest. Its rms value is ______ V (to two decimal places).`,
          answer: Q5.round(rms, 2), tol: 0.01, V1, V2, f,
          sol: `rms $= \\sqrt{\\langle V^2\\rangle} = \\sqrt{${f}\\times${V1}^2 + ${Q5.round(1 - f, 2)}\\times(${V2})^2} = ${Q5.round(rms, 2)}$ V.`,
          trap: 'Square first, then average, then take the root; the sign of a level does not matter once squared.' };
      },
      verify: (p) => { const n = 10000; let s = 0; for (let i = 0; i < n; i++) { const v = (i + 0.5) / n < p.f ? p.V1 : p.V2; s += v * v; } return Math.sqrt(s / n); } },
    { id: 'cir-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'impedance', format: 'graph',
      make(r) {
        const names = ['a resistor and capacitor in series', 'a resistor and inductor in series', 'a resistor, inductor and capacitor in series', 'a resistor alone', 'an inductor and capacitor in parallel (ideal)'];
        const desc = ['falls from very large values at low frequency towards $R$ at high frequency', 'rises from $R$ at low frequency and keeps growing in proportion to frequency at high frequency', 'is large at low and high frequencies with a single minimum equal to $R$ at one frequency', 'is the same at every frequency', 'is small at low and high frequencies and grows without limit at one frequency'];
        const c = Q5.int(r, 0, 4);
        const o = Q5.mcqOptions(r, names[c], Q5.shuffle(r, names.filter((x, i) => i !== c)));
        return { q: `A graph of the impedance of a two-terminal network against frequency ${desc[c]}. The network is most likely`, ...o,
          sol: 'RC series: $Z = \\sqrt{R^2 + 1/\\omega^2C^2}$, huge at low $\\omega$, tends to $R$. RL series: $\\sqrt{R^2 + \\omega^2L^2}$, from $R$ up, about $\\omega L$ at high $\\omega$. LCR series: minimum $R$ at $\\omega_0 = 1/\\sqrt{LC}$. A resistor: flat. Ideal parallel LC: $Z = \\omega L/|1 - \\omega^2LC|$, zero at both ends and infinite at $\\omega_0$ (the tank circuit).',
          trap: 'Series LCR has a minimum at resonance; parallel LC has a maximum.' };
      } },
    { id: 'cir-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'power', unit: 'H',
      make(r) {
        const R = Q5.int(r, 5, 50), Lh = Q5.pick(r, 0.02, 0.5, 0.01), f = Q5.choose(r, [50, 60]), V = Q5.choose(r, [120, 230]);
        const I = Q5.round(V / Math.sqrt(R * R + (2 * Math.PI * f * Lh) ** 2), 4), P = Q5.round(I * I * R, 2);
        const Lc = Math.sqrt((V / I) ** 2 - (P / (I * I)) ** 2) / (2 * Math.PI * f);
        return { q: `A coil connected to a $${V}$ V rms, $${f}$ Hz supply draws $${I}$ A rms and takes $${P}$ W. Its inductance is ______ H (to three decimal places).`,
          answer: Q5.round(Lc, 3), tol: 0.002, V, f, I, P,
          sol: `$Z = V/I = ${Q5.round(V / I, 3)}\\ \\Omega$. Only the resistance takes power: $R = P/I^2 = ${Q5.round(P / (I * I), 3)}\\ \\Omega$. $X_L = \\sqrt{Z^2 - R^2} = ${Q5.round(Lc * 2 * Math.PI * f, 3)}\\ \\Omega$, so $L = X_L/2\\pi f = ${Q5.round(Lc, 3)}$ H.`,
          trap: 'Power is $I^2R$, not $VI$: the coil\'s reactance takes no average power.' };
      },
      verify: (p) => { const cosf = p.P / (p.V * p.I), R = p.P / (p.I * p.I), X = R * Math.tan(Math.acos(cosf)); return X / (2 * Math.PI * p.f); } },
    { id: 'cir-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'rc transients', unit: 'ms',
      make(r) {
        const R = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]), Cu = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]); // kOhm, uF
        const tau = R * Cu; // ms
        return { q: `A ${Cu} $\\mu$F capacitor charges through a ${R} k$\\Omega$ resistor. The time constant is ______ ms (to three significant figures).`,
          answer: +tau.toPrecision(3), tol: Math.max(tau * 0.01, 0.001), R, Cu,
          sol: `$\\tau = RC = (${R}\\times10^3)(${Cu}\\times10^{-6}) = ${fmt(tau / 1000, 3)}$ s $= ${fmt(tau, 3)}$ ms.`,
          trap: 'k$\\Omega$ times $\\mu$F is milliseconds.' };
      },
      verify: (p) => p.R * p.Cu },
    { id: 'cir-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'resonance', unit: 'Hz',
      make(r) {
        const L = choose(r, [1, 2, 5, 10, 20, 50, 100]), Cn = choose(r, [10, 22, 47, 100, 220, 470, 1000]); // mH, nF
        const f = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * Cn * 1e-9));
        return { q: `A ${L} mH inductor and a ${Cn} nF capacitor form a series LCR circuit. The resonant frequency is ______ Hz (to three significant figures).`,
          answer: +f.toPrecision(3), tol: Math.max(f * 0.01, 0.01), L, Cn,
          sol: `$f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}} = \\dfrac{1}{2\\pi\\sqrt{(${L}\\times10^{-3})(${Cn}\\times10^{-9})}} \\approx ${fmt(f, 3)}$ Hz.`,
          trap: 'Divide $1/\\sqrt{LC}$ by $2\\pi$ to get hertz.' };
      },
      verify: (p) => 1 / (2 * Math.PI * Math.sqrt(p.L * 1e-3 * p.Cn * 1e-9)) },
    { id: 'cir-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'impedance', unit: 'A',
      make(r) {
        const R = int(r, 1, 20) * 10, XL = int(r, 0, 30) * 10, XC = int(r, 0, 30) * 10, V = choose(r, [50, 100, 110, 200, 230]);
        const Z = Math.hypot(R, XL - XC), I = V / Z;
        return { q: `A series circuit with $R = ${R}\\ \\Omega$, $X_L = ${XL}\\ \\Omega$ and $X_C = ${XC}\\ \\Omega$ is connected to ${V} V rms. The rms current is ______ A (to three significant figures).`,
          answer: +I.toPrecision(3), tol: Math.max(I * 0.01, 0.001), R, XL, XC, V,
          sol: `$Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{${R * R} + ${(XL - XC) ** 2}} = ${fmt(Z, 4)}\\ \\Omega$; $I = V/Z \\approx ${fmt(I, 3)}$ A.`,
          trap: 'The reactances subtract before squaring.' };
      },
      verify: (p) => p.V / Math.hypot(p.R, p.XL - p.XC) },
    { id: 'cir-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'rc transients', unit: 'V',
      make(r) {
        const V = choose(r, [5, 9, 12, 15, 24]), k = choose(r, [0.25, 0.5, 1, 1.5, 2, 3]), mode = choose(r, ['charging', 'discharging']);
        const v = mode === 'charging' ? V * (1 - Math.exp(-k)) : V * Math.exp(-k);
        return { q: `A capacitor is ${mode === 'charging' ? `charging from zero through a resistor from a ${V} V battery` : `discharging through a resistor, starting from ${V} V`}. Its voltage after ${k} time constants is ______ V (to two decimal places).`,
          answer: round(v, 2), tol: Math.max(v * 0.005, 0.01), V, k, mode,
          sol: mode === 'charging' ? `$V_C = V(1 - e^{-t/\\tau}) = ${V}(1 - e^{-${k}}) \\approx ${round(v, 2)}$ V.` : `$V_C = V_0e^{-t/\\tau} = ${V}e^{-${k}} \\approx ${round(v, 2)}$ V.`,
          trap: 'Charging rises as $1 - e^{-t/\\tau}$; discharging falls as $e^{-t/\\tau}$.' };
      },
      verify: (p) => (p.mode === 'charging' ? p.V * (1 - Math.exp(-p.k)) : p.V * Math.exp(-p.k)) },
    { id: 'cir-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'rl transients', unit: 'mA',
      make(r) {
        const V = choose(r, [5, 6, 10, 12, 24]), R = choose(r, [10, 20, 50, 100, 200]), L = choose(r, [0.1, 0.2, 0.5, 1]), t = int(r, 1, 20); // ms
        const tau = L / R * 1000, I = V / R * (1 - Math.exp(-t / tau)) * 1000;
        return { q: `A ${V} V battery is switched on to a ${R} $\\Omega$ resistor in series with a ${L} H inductor. The current ${t} ms later is ______ mA (to three significant figures).`,
          answer: +I.toPrecision(3), tol: Math.max(I * 0.01, 0.001), V, R, L, t,
          sol: `$\\tau = L/R = ${fmt(tau, 4)}$ ms, $I_\\infty = V/R = ${fmt(V / R * 1000, 4)}$ mA. $I = I_\\infty(1 - e^{-t/\\tau}) = ${fmt(V / R * 1000, 4)}(1 - e^{-${t}/${fmt(tau, 4)}}) \\approx ${fmt(I, 3)}$ mA.`,
          trap: 'The time constant is $L/R$, not $RL$.' };
      },
      verify: (p) => p.V / p.R * (1 - Math.exp(-p.t / (p.L / p.R * 1000))) * 1000 },
    { id: 'cir-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'phase',
      make(r) {
        const R = int(r, 1, 10) * 10, X = choose(r, [R, Math.round(R * Math.sqrt(3)), Math.round(R / Math.sqrt(3))]), kind = choose(r, ['inductor', 'capacitor']);
        const ang = Math.round(Math.atan(X / R) * 180 / Math.PI);
        const right = `${kind === 'inductor' ? 'lags' : 'leads'} the voltage by about $${ang}^\\circ$`;
        const o = mcqOptions(r, right, [`${kind === 'inductor' ? 'leads' : 'lags'} the voltage by about $${ang}^\\circ$`, `${kind === 'inductor' ? 'lags' : 'leads'} the voltage by about $${90 - ang === ang ? 90 : 90 - ang}^\\circ$`, 'is in phase with the voltage']);
        return { q: `A ${R} $\\Omega$ resistor is in series with ${kind === 'inductor' ? 'an inductor' : 'a capacitor'} of reactance ${X} $\\Omega$ across an AC source. The current`, ...o,
          sol: `$\\tan\\phi = X/R = ${X}/${R}$, so $\\phi \\approx ${ang}^\\circ$. With ${kind === 'inductor' ? 'an inductor the current lags' : 'a capacitor the current leads'}.`,
          trap: 'Inductor: current lags. Capacitor: current leads. The angle is $\\tan^{-1}(X/R)$, not $\\tan^{-1}(R/X)$.' };
      } },
    { id: 'cir-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'q factor',
      make(r) {
        const R = choose(r, [1, 2, 5, 10, 20, 50]), L = choose(r, [0.01, 0.05, 0.1, 0.5, 1]), Cu = choose(r, [0.1, 1, 10, 100]);
        const Q = Math.sqrt(L / (Cu * 1e-6)) / R;
        return { q: `A series LCR circuit has $R = ${R}\\ \\Omega$, $L = ${L}$ H and $C = ${Cu}\\,\\mu$F. Its quality factor is ______ (to three significant figures).`,
          answer: +Q.toPrecision(3), tol: Math.max(Q * 0.01, 0.001), R, L, Cu,
          sol: `$Q = \\dfrac1R\\sqrt{\\dfrac LC} = \\dfrac1{${R}}\\sqrt{\\dfrac{${L}}{${Cu}\\times10^{-6}}} \\approx ${fmt(Q, 3)}$.`,
          trap: 'Series circuit: $Q$ falls as $R$ rises.' };
      },
      verify: (p) => Math.sqrt(p.L / (p.Cu * 1e-6)) / p.R },
    { id: 'cir-g08', type: 'nat', level: 4, exams: ['jam'], sub: 'power', unit: 'W',
      make(r) {
        const R = int(r, 1, 20) * 10, X = int(r, 0, 30) * 10, V = choose(r, [100, 110, 200, 230, 240]);
        const P = V * V * R / (R * R + X * X);
        return { q: `A series LCR circuit with $R = ${R}\\ \\Omega$ is connected to ${V} V rms at a frequency where $X_L - X_C = ${X}\\ \\Omega$. The average power drawn is ______ W (to three significant figures).`,
          answer: +P.toPrecision(3), tol: Math.max(P * 0.01, 0.01), R, X, V,
          sol: `$I^2 = \\dfrac{V^2}{R^2 + X^2} = \\dfrac{${V * V}}{${R * R + X * X}}$; $P = I^2R \\approx ${fmt(P, 3)}$ W. Only the resistor absorbs power.`,
          trap: '$V^2/R$ holds only at resonance.' };
      },
      verify: (p) => p.V * p.V * p.R / (p.R * p.R + p.X * p.X) },
  ],
};
