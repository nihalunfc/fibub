// Class 12 Physics, Chapter 7 Alternating Current: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ac7');
const r2 = (x) => Math.round(x * 100) / 100;
const PI = Math.PI;

export default {
  topic: 'alternating-current', name: 'Alternating Current', n: 7,
  items: [
    m.mcq(1, 'rms', '<p>The rms value of an alternating current is:</p>', 'the steady DC that gives the same heating in a resistor', ['the average of the current over a full cycle', 'the peak value divided by 2', 'the value of the current at t = 0'], '<p>The mean of a sine over a full cycle is zero, so we use the root of the mean of the square. It equals the DC that heats equally: I<sub>rms</sub> = I₀/√2.</p>'),
    m.mcq(1, 'rms', '<p>The mains voltage is quoted as 230 V. Its peak value is about:</p>', '325 V', ['230 V', '163 V', '460 V'], '<p>V₀ = √2 × 230 = 325 V.</p>'),
    m.mcq(2, 'rms', '<p>An AC supply has frequency 50 Hz. How many times in one second does the current reach zero?</p>', '100', ['50', '25', '200'], '<p>Each cycle has two zero crossings, so 50 cycles give 100.</p>', { trap: 'Counting once per cycle instead of twice.' }),
    m.mcq(2, 'reactance', '<p>The frequency of the supply across an ideal inductor is doubled. Its reactance:</p>', 'doubles', ['halves', 'stays the same', 'becomes four times'], '<p>X<sub>L</sub> = 2πfL is proportional to f.</p>'),
    m.mcq(2, 'reactance', '<p>The frequency across a capacitor is doubled. Its reactance:</p>', 'halves', ['doubles', 'stays the same', 'becomes four times as large'], '<p>X<sub>C</sub> = 1/(2πfC) is inversely proportional to f.</p>'),
    m.mcq(1, 'reactance', '<p>For a pure capacitor in an AC circuit:</p>', 'the current leads the voltage by 90°', ['the current lags the voltage by 90°', 'the current and voltage are in phase', 'the current is zero at all times'], '<p>i = C dv/dt: the current is a quarter cycle ahead of the voltage.</p>'),
    m.mcq(2, 'reactance', '<p>An inductor and a capacitor are each connected to a DC source. After a long time:</p>', 'the inductor passes steady current and the capacitor passes none', ['both pass steady current', 'neither passes steady current', 'the capacitor passes steady current and the inductor none'], '<p>For DC, f = 0: X<sub>L</sub> = 0 (just the coil’s small resistance) and X<sub>C</sub> is infinite.</p>'),
    m.mcq(2, 'lcr', '<p>In a series LCR circuit R = 3 Ω, X<sub>L</sub> = 10 Ω and X<sub>C</sub> = 6 Ω. The impedance is:</p>', '5 Ω', ['13 Ω', '7 Ω', '3 Ω'], '<p>Z = √(3² + (10 − 6)²) = √25 = 5 Ω.</p>', { trap: 'Adding R, X_L and X_C directly instead of using the phasor triangle.' }),
    m.mcq(2, 'lcr', '<p>In the circuit above (X<sub>L</sub> > X<sub>C</sub>), the current:</p>', 'lags the applied voltage', ['leads the applied voltage', 'is in phase with the voltage', 'is 90° out of phase'], '<p>X<sub>L</sub> &gt; X<sub>C</sub> means the circuit is inductive, and tan φ = (X<sub>L</sub> − X<sub>C</sub>)/R &gt; 0: the voltage is ahead, so the current lags.</p>'),
    m.mcq(2, 'resonance', '<p>At the resonant frequency of a series LCR circuit:</p>', 'the impedance is least and equal to R', ['the impedance is greatest', 'the current is zero', 'the voltage across R is zero'], '<p>X<sub>L</sub> = X<sub>C</sub>, so Z = R. The current V/R is the maximum.</p>'),
    m.mcq(2, 'resonance', '<p>The resistance in a series resonant circuit is increased, L and C unchanged. The resonant frequency:</p>', 'stays the same, and the peak becomes lower and broader', ['decreases', 'increases', 'becomes zero'], '<p>f₀ = 1/(2π√LC) does not depend on R. Q = ω₀L/R falls, so the resonance curve is lower and wider.</p>'),
    m.mcq(3, 'resonance', '<p>L is made four times larger and C four times smaller. The resonant frequency:</p>', 'stays the same', ['becomes four times as large', 'halves', 'becomes sixteen times as large'], '<p>The product LC is unchanged, so f₀ is unchanged. (Q = (1/R)√(L/C) becomes 16 times larger.)</p>'),
    m.mcq(2, 'power', '<p>The power factor of a pure resistor in an AC circuit is:</p>', '1', ['0', '0.5', 'infinite'], '<p>φ = 0, so cos φ = 1.</p>'),
    m.mcq(2, 'power', '<p>The average power consumed by an ideal capacitor in an AC circuit is:</p>', 'zero', ['V_rms I_rms', 'half of V_rms I_rms', 'I²X_C'], '<p>φ = 90°, so P = V<sub>rms</sub>I<sub>rms</sub> cos 90° = 0. The current is wattless.</p>'),
    m.mcq(3, 'power', '<p>A circuit has R = 30 Ω and X = 40 Ω in series. Its power factor is:</p>', '0.6', ['0.75', '0.8', '1.33'], '<p>Z = 50 Ω, cos φ = R/Z = 30/50 = 0.6.</p>'),
    m.mcq(1, 'transformer', '<p>A transformer works on the principle of:</p>', 'mutual induction', ['self-induction only', 'the heating effect', 'electrostatic induction'], '<p>The changing flux of the primary induces an emf in the secondary: mutual induction.</p>'),
    m.mcq(2, 'transformer', '<p>A step-down transformer has:</p>', 'fewer turns in the secondary than in the primary', ['more turns in the secondary', 'equal turns in both', 'a secondary made of thicker wire only'], '<p>V<sub>s</sub>/V<sub>p</sub> = N<sub>s</sub>/N<sub>p</sub> &lt; 1 needs N<sub>s</sub> &lt; N<sub>p</sub>.</p>'),
    m.mcq(2, 'transformer', '<p>The core of a transformer is laminated to reduce:</p>', 'eddy-current loss', ['copper loss', 'flux leakage', 'hysteresis loss'], '<p>Thin insulated sheets break up the paths of eddy currents.</p>'),
    m.ar(2, 'power', 'A pure inductor draws no net power from an AC source.', 'In a pure inductor the current lags the voltage by 90°.', 0, '<p>Both true and R explains A: with φ = 90° the energy taken in a quarter cycle is returned in the next.</p>'),
    m.ar(2, 'resonance', 'At resonance a series LCR circuit has the maximum current.', 'At resonance the impedance of the circuit is zero.', 2, '<p>A is true. R is false: Z is least but equals R, not zero.</p>'),
    m.ar(2, 'transformer', 'A transformer cannot be used with DC.', 'A steady current produces a steady flux, which induces no emf.', 0, '<p>Both true; the second explains the first.</p>'),
    m.ar(3, 'rms', 'An AC ammeter reads zero over a full cycle.', 'The average of a sine wave over a full cycle is zero.', 3, '<p>A is false: an AC ammeter is calibrated to read the rms value, not the mean. R is true but does not make A true.</p>'),
    m.nat(2, 'reactance', '<p>An inductor of 0.2 H is connected to a 50 Hz supply. Find its reactance (ohms, nearest whole number).</p>', () => Math.round(2 * PI * 50 * 0.2), 1, '<p>X<sub>L</sub> = 2πfL = 2π × 50 × 0.2 = 62.8 ≈ 63 Ω.</p>', { unit: 'Ω' }),
    m.nat(3, 'lcr', '<p>A 40 Ω resistor, a 0.2 H inductor and a 100 µF capacitor are in series with a 100 V, 50 Hz supply. Find the rms current in amperes.</p>', () => 100 / Math.hypot(40, 2 * PI * 50 * 0.2 - 1 / (2 * PI * 50 * 100e-6)), 0.02, '<p>X<sub>L</sub> = 62.8 Ω, X<sub>C</sub> = 31.8 Ω. Z = √(40² + 31²) = 50.6 Ω. I = 100/50.6 = 1.98 A.</p>', { unit: 'A' }),
    m.nat(3, 'resonance', '<p>A series circuit with L = 0.1 H and C = 10 µF resonates at what frequency (in hertz)?</p>', () => 1 / (2 * PI * Math.sqrt(0.1 * 10e-6)), 1, '<p>f₀ = 1/(2π√(LC)) = 1/(2π × 10⁻³) = 159 Hz.</p>', { unit: 'Hz' }),
    m.nat(3, 'power', '<p>A 220 V, 50 Hz source drives a coil with R = 15 Ω and X<sub>L</sub> = 20 Ω. Find the average power in watts.</p>', () => (220 * 220 * 15) / (15 * 15 + 20 * 20), 1, '<p>Z = 25 Ω, I = 8.8 A, P = I²R = 8.8² × 15 = 1161.6 W.</p>', { unit: 'W' }),
    m.nat(2, 'transformer', '<p>A transformer has 400 primary turns and 40 secondary turns. The primary voltage is 230 V. Find the secondary voltage (volts).</p>', () => 23, 0.01, '<p>V<sub>s</sub> = 230 × 40/400 = 23 V.</p>', { unit: 'V' }),
    m.msq(3, 'lcr', '<p>In a series LCR circuit X<sub>L</sub> = 8 Ω, X<sub>C</sub> = 20 Ω and R = 9 Ω. Which statements are true? (Choose all that apply.)</p>', ['The impedance is 15 Ω.', 'The current leads the voltage.', 'The power factor is 0.6.', 'The circuit is inductive.'], [0, 1, 2], '<p>Z = √(81 + 144) = 15 Ω. X<sub>C</sub> &gt; X<sub>L</sub>, so the circuit is capacitive and the current leads. cos φ = 9/15 = 0.6.</p>'),
    m.msq(2, 'transformer', '<p>Which of these reduce losses in a real transformer? (Choose all that apply.)</p>', ['A laminated core', 'Thick copper wire in the coils', 'A core of soft iron', 'A core of solid steel blocks'], [0, 1, 2], '<p>Lamination cuts eddy currents, thick wire cuts I²R, soft iron cuts hysteresis. A solid block would increase eddy currents.</p>'),
  ],
  gens: [
    { id: 'ac7-g01', type: 'nat', level: 2, exams: ['board'], sub: 'reactance',
      make(rng) { const L = choose(rng, [0.05, 0.1, 0.2, 0.5]), f = choose(rng, [50, 60, 100, 400]); return { L, f, q: `<p>An inductor of ${L} H is connected to a ${f} Hz AC supply. Find its reactance in ohms.</p>`, answer: 2 * PI * f * L, tol: 0.5 + 0.01 * 2 * PI * f * L, unit: 'Ω', sol: `<p>X<sub>L</sub> = 2πfL = 2π × ${f} × ${L} = ${r2(2 * PI * f * L)} Ω.</p>` }; },
      verify: (p) => (p.f * p.L) * 6.283185307 },
    { id: 'ac7-g02', type: 'nat', level: 3, exams: ['board'], sub: 'lcr',
      make(rng) { const R = choose(rng, [30, 40, 60]), XL = choose(rng, [50, 70, 90]), XC = choose(rng, [10, 30, 40]), V = choose(rng, [100, 120, 220]); const Z = Math.hypot(R, XL - XC); return { R, XL, XC, V, q: `<p>A series LCR circuit has R = ${R} Ω, X<sub>L</sub> = ${XL} Ω and X<sub>C</sub> = ${XC} Ω across ${V} V rms. Find the rms current in amperes.</p>`, answer: V / Z, tol: 0.02, unit: 'A', sol: `<p>Z = √(${R}² + (${XL} − ${XC})²) = ${r2(Z)} Ω, I = ${V}/${r2(Z)} = ${r2(V / Z)} A.</p>` }; },
      verify: (p) => p.V / Math.sqrt(p.R ** 2 + p.XL ** 2 - 2 * p.XL * p.XC + p.XC ** 2) },
    { id: 'ac7-g03', type: 'nat', level: 2, exams: ['board'], sub: 'resonance',
      make(rng) { const L = choose(rng, [0.02, 0.05, 0.1, 0.2]), C = choose(rng, [2, 5, 10, 20]); return { L, C, q: `<p>Find the resonant frequency in hertz of a series circuit with L = ${L} H and C = ${C} µF.</p>`, answer: 1 / (2 * PI * Math.sqrt(L * C * 1e-6)), tol: 1, unit: 'Hz', sol: `<p>f₀ = 1/(2π√(LC)) = 1/(2π√(${L} × ${C} × 10⁻⁶)) = ${r2(1 / (2 * PI * Math.sqrt(L * C * 1e-6)))} Hz.</p>` }; },
      verify: (p) => Math.sqrt(1 / (p.L * p.C * 1e-6)) / (2 * PI) },
    { id: 'ac7-g04', type: 'nat', level: 2, exams: ['board'], sub: 'transformer',
      make(rng) { const Np = choose(rng, [100, 200, 500, 1000]), k = choose(rng, [0.1, 0.2, 2, 5]), V = choose(rng, [110, 220, 230]); return { Np, k, V, q: `<p>A transformer has ${Np} primary turns and ${Np * k} secondary turns. The primary is connected to ${V} V. Find the secondary voltage in volts.</p>`, answer: V * k, tol: 0.02 * V * k, unit: 'V', sol: `<p>V<sub>s</sub> = V<sub>p</sub>N<sub>s</sub>/N<sub>p</sub> = ${V} × ${Np * k}/${Np} = ${r2(V * k)} V.</p>` }; },
      verify: (p) => p.V * (p.Np * p.k) / p.Np },
  ],
};
