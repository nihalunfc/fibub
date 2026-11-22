// Oscillators at GATE / CSIR NET level: the Barkhausen criterion and what it does not guarantee, start-up and amplitude
// stabilisation, growth of oscillations when the loop gain exceeds one; RC oscillators (Wien bridge with equal and
// unequal parts, RC ladder phase-shift with high-pass or low-pass sections, buffered sections, quadrature, twin-T);
// LC oscillators (Colpitts, Hartley with mutual inductance, Clapp, tuned-collector minimum g_m); quartz crystals
// (series and parallel resonance, Q, load pulling, Pierce negative resistance); UJT relaxation oscillator.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './oscillators.more.gen.js';

const G = ['gate', 'net'];
const TAU = 2 * Math.PI;

export default {
  topic: 'oscillators',
  items: [
    // ---------- level 1 ----------
    { id: 'osc-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Barkhausen criterion',
      q: 'An amplifier of gain $A$ with a feedback network $\\beta$ sustains a steady sinusoidal oscillation at the frequency where',
      options: ['$A\\beta = -1$ with $|A| = 1$', '$|A\\beta| = 0$', '$|A\\beta| = 1$ and the phase of $A\\beta$ is $0$ (or a multiple of $360^\\circ$)', '$|A\\beta|\\to\\infty$'], answer: 2,
      sol: 'For a signal to keep itself going around the loop it must come back exactly as it left: same amplitude ($|A\\beta| = 1$) and same phase (total phase shift $0^\\circ$ or $360^\\circ n$). This is the Barkhausen criterion; the frequency is fixed by the phase condition.',
      trap: '$A\\beta = -1$ is the condition for a feedback amplifier written with a minus sign at the mixer ($1 + A\\beta = 0$); be clear which convention a question uses.' },
    { id: 'osc-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Barkhausen criterion',
      q: 'A sinusoidal oscillator is best described as',
      options: ['an amplifier with positive feedback at one frequency, with loop gain one there', 'an amplifier with strong negative feedback at all frequencies', 'a filter with no amplifier', 'a rectifier followed by a capacitor'], answer: 0,
      sol: 'The feedback network selects one frequency at which the fed-back signal is in phase with the input (positive, regenerative feedback) and the amplifier makes up the network\'s loss. Everywhere else the loop gain is below one or the phase is wrong, so only that frequency survives.',
      trap: 'Negative feedback stabilises amplifiers; oscillators need the fed-back signal to add to the input.' },
    { id: 'osc-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Wien bridge',
      q: 'A Wien bridge oscillator uses equal resistors $R$ and equal capacitors $C$ in its lead-lag network. It oscillates at',
      options: ['$1/(2\\pi\\sqrt6RC)$', '$1/(2\\pi\\sqrt{LC})$', '$1/(RC)$ hertz', '$1/(2\\pi RC)$'], answer: 3,
      sol: 'The series $RC$ and parallel $RC$ arms give a transfer function with zero phase at $\\omega_0 = 1/RC$, where it equals 1/3. So $f_0 = 1/(2\\pi RC)$, and the amplifier must have a gain of 3.',
      trap: '$1/(2\\pi\\sqrt6RC)$ belongs to the RC phase-shift oscillator.' },
    { id: 'osc-004', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Colpitts', unit: 'MHz',
      q: 'A Colpitts oscillator has $L = 10\\,\\mu$H and two tank capacitors of $2$ nF each. It oscillates at about ______ MHz (to two decimal places).',
      answer: 1.59, tol: 0.01, calc: () => 1 / (TAU * Math.sqrt(10e-6 * 1e-9)) / 1e6,
      sol: 'The two capacitors are in series around the tank: $C_{eq} = C_1C_2/(C_1 + C_2) = 1$ nF. $f = 1/(2\\pi\\sqrt{LC_{eq}}) = 1/(2\\pi\\sqrt{10^{-5}\\times10^{-9}}) = 1/(2\\pi\\times10^{-7}) = 1.59$ MHz.',
      trap: 'Adding the capacitors (4 nF) as if in parallel gives 0.80 MHz.' },
    { id: 'osc-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'crystal',
      q: 'Quartz crystals are used to fix the frequency of clocks and radio transmitters mainly because',
      options: ['they amplify the signal', 'their resonance has an extremely high quality factor, so the frequency hardly drifts', 'they have no capacitance', 'they work only at audio frequencies'], answer: 1,
      sol: 'A crystal is a piezoelectric mechanical resonator with $Q$ of $10^4$ to $10^6$. The phase of its impedance changes extremely steeply near resonance, so changes elsewhere in the circuit shift the frequency by only parts per million.',
      trap: 'The crystal is passive: the transistor or op-amp supplies the gain.' },
    { id: 'osc-006', type: 'msq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'oscillator types', format: 'multi',
      q: 'Which of these are RC oscillators (frequency set by resistors and capacitors, no inductor)?',
      options: ['Wien bridge oscillator', 'RC phase-shift oscillator', 'Colpitts oscillator', 'Twin-T oscillator'], answer: [0, 1, 3],
      sol: 'Wien bridge, phase-shift and twin-T oscillators use $RC$ networks and are common at audio frequencies, where inductors would be bulky. The Colpitts oscillator uses an $LC$ tank (a tapped capacitor across an inductor).',
      trap: 'The Colpitts circuit has two capacitors, but its frequency needs the inductor.' },

    // ---------- level 2 ----------
    { id: 'osc-007', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Wien bridge', unit: 'kΩ',
      q: 'A Wien bridge oscillator uses a non-inverting op-amp amplifier with $R_1 = 10$ k$\\Omega$ from the inverting input to ground. The feedback resistor $R_f$ needed for a loop gain of exactly one is ______ k$\\Omega$.',
      answer: 20, tol: 0, calc: () => (3 - 1) * 10,
      sol: 'At $f_0$ the lead-lag network passes $1/3$ with zero phase, so the amplifier gain must be $1 + R_f/R_1 = 3$: $R_f = 2R_1 = 20$ k$\\Omega$. In practice it is set slightly higher to start, with a non-linear element to settle.',
      trap: 'Setting $R_f/R_1 = 3$ gives a gain of 4: the output grows until it clips.' },
    { id: 'osc-008', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'phase-shift oscillator',
      q: 'An RC phase-shift oscillator uses three identical high-pass $RC$ sections in a ladder driven by an inverting amplifier. The minimum magnitude of amplifier gain is',
      options: ['3', '29', '8', '1/29'], answer: 1,
      sol: 'Solving the ladder gives $\\beta = 1/(1 - 5\\alpha^2 - j(6\\alpha - \\alpha^3))$ with $\\alpha = 1/\\omega RC$. The phase is $180^\\circ$ when $\\alpha^2 = 6$, and then $\\beta = 1/(1 - 30) = -1/29$. The inverting amplifier supplies the other $180^\\circ$ and a gain of at least 29.',
      trap: '8 is the gain for three buffered (isolated) sections of $60^\\circ$ each; the loaded ladder needs 29.' },
    { id: 'osc-009', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'phase-shift oscillator', unit: 'Hz',
      q: 'An RC phase-shift oscillator with three identical high-pass sections uses $R = 10$ k$\\Omega$ and $C = 10$ nF. Its frequency is ______ Hz (to the nearest whole number).',
      answer: 650, tol: 2, calc: () => 1 / (TAU * Math.sqrt(6) * 1e4 * 1e-8),
      sol: '$f = \\dfrac1{2\\pi\\sqrt6RC} = \\dfrac1{2\\pi\\times2.449\\times10^{-4}} = 650$ Hz.',
      trap: 'Using $1/(2\\pi RC) = 1592$ Hz (the Wien frequency).' },
    { id: 'osc-010', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Hartley', unit: 'kHz',
      q: 'A Hartley oscillator has a tapped coil with sections of $2$ mH and $0.5$ mH (no mutual coupling between them) and a $1$ nF tank capacitor. Its frequency is ______ kHz (to one decimal place).',
      answer: 100.7, tol: 0.3, calc: () => 1 / (TAU * Math.sqrt(2.5e-3 * 1e-9)) / 1e3,
      sol: 'With no coupling, $L_{eq} = L_1 + L_2 = 2.5$ mH. $f = 1/(2\\pi\\sqrt{2.5\\times10^{-3}\\times10^{-9}}) = 1/(2\\pi\\times1.581\\times10^{-6}) = 100.7$ kHz.',
      trap: 'Combining the coil sections in parallel.' },
    { id: 'osc-011', type: 'mcq', level: 2, exams: G, sub: 'Colpitts',
      q: 'In a Colpitts oscillator, the fraction of the tank voltage fed back to the amplifier input is set mainly by',
      options: ['the value of the inductor', 'the supply voltage', 'the ratio of the two tank capacitors', 'the load resistance alone'], answer: 2,
      sol: 'The two capacitors form a capacitive voltage divider across the tank; the tap between them feeds the amplifier. Changing their ratio changes the feedback fraction (and the gain needed), while their series value with $L$ sets the frequency.',
      trap: 'The inductor sets the frequency, not the feedback fraction.' },
    { id: 'osc-012', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'amplitude stabilisation',
      q: 'Practical oscillators are designed with',
      options: ['loop gain exactly 1 from the moment they are switched on', 'loop gain well below 1, so the oscillation is stable', 'loop gain slightly above 1 at start-up, with a non-linearity that brings it down to exactly 1 at the final amplitude', 'no feedback at all'], answer: 2,
      sol: 'Oscillation starts from noise, so the small-signal loop gain must exceed 1 for the amplitude to grow. As it grows, a non-linear element (amplifier saturation, a lamp, thermistor, diodes or an AGC loop) reduces the gain until the average loop gain is exactly 1. A lamp or thermistor gives a cleaner sine than clipping.',
      trap: 'Exactly 1 at switch-on: any small loss and the oscillation would never start.' },
    { id: 'osc-013', type: 'mcq', level: 2, exams: G, sub: 'crystal',
      q: 'A quartz crystal\'s motional arm has $L = 0.5$ H and $C = 0.02$ pF. Its series resonant frequency is about',
      options: ['159 kHz', '15.9 MHz', '1.59 MHz', '5.0 MHz'], answer: 2,
      sol: '$f_s = 1/(2\\pi\\sqrt{LC}) = 1/(2\\pi\\sqrt{0.5\\times2\\times10^{-14}}) = 1/(2\\pi\\times10^{-7}) = 1.59$ MHz. The huge $L$ and tiny $C$ model the mechanical mass and stiffness of the quartz plate.',
      trap: 'Slipping a power of ten under the square root.' },
    { id: 'osc-014', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Wien bridge', format: 'multi',
      q: 'About a Wien bridge oscillator with equal $R$ and equal $C$, which statements are correct?',
      options: ['At $f_0$ the lead-lag network has zero phase shift', 'At $f_0$ the lead-lag network passes one third of its input', 'The amplifier must be inverting', 'An NTC thermistor in place of $R_f$ can stabilise the amplitude'], answer: [0, 1, 3],
      sol: 'The network transfer is $1/[3 + j(\\omega RC - 1/\\omega RC)]$: real and equal to $1/3$ at $\\omega RC = 1$. Zero phase means the amplifier must be non-inverting with gain 3. If the amplitude grows, the thermistor warms, its resistance falls, the gain falls: automatic level control.',
      trap: 'Inverting amplifiers go with the phase-shift oscillator, whose network gives $180^\\circ$.' },
    { id: 'osc-015', type: 'nat', level: 2, exams: G, sub: 'relaxation oscillator', unit: 'Hz',
      q: 'A UJT relaxation oscillator has $R = 10$ k$\\Omega$, $C = 0.1\\,\\mu$F and intrinsic stand-off ratio $\\eta = 0.6$ (diode drop and discharge time neglected). Its frequency is ______ Hz (to the nearest whole number).',
      answer: 1091, tol: 3, calc: () => 1 / (1e4 * 1e-7 * Math.log(1 / (1 - 0.6))),
      sol: 'The capacitor charges from about 0 towards $V_{BB}$ and the UJT fires at $\\eta V_{BB}$: $1 - e^{-T/RC} = \\eta$, so $T = RC\\ln\\dfrac1{1 - \\eta} = 10^{-3}\\ln2.5 = 0.916$ ms and $f = 1091$ Hz.',
      trap: 'Using $\\ln(1/\\eta)$ instead of $\\ln[1/(1 - \\eta)]$.' },
    { id: 'osc-016', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Barkhausen criterion',
      q: 'At the frequency where its loop phase is zero, an oscillator circuit has loop gain $0.98$. After it is disturbed, the oscillation',
      options: ['grows until the amplifier clips', 'dies away gradually', 'continues at constant amplitude', 'jumps to twice the frequency'], answer: 1,
      sol: 'Each trip around the loop multiplies the amplitude by 0.98, so the oscillation decays (slowly, like a lightly damped resonator). Sustained oscillation needs at least 1.',
      trap: 'Close to 1 is not 1: the amplitude still decays exponentially.' },
    { id: 'osc-035', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'oscillator types',
      q: 'Which pairing of oscillator and its feedback tap is correct?',
      options: ['Colpitts: tapped inductor; Hartley: tapped capacitor', 'Hartley: tapped inductor; Colpitts: tapped capacitor', 'Both use a tapped capacitor', 'Both use an RC ladder'], answer: 1,
      sol: 'Hartley taps the coil (two inductors in series across one capacitor); Colpitts taps the capacitance (two capacitors in series across one inductor). The Clapp is a Colpitts with an extra capacitor in series with the inductor.',
      trap: 'A memory aid: Colpitts and capacitor both start with C.' },

    // ---------- level 3 ----------
    { id: 'osc-017', type: 'nat', level: 3, exams: G, sub: 'Wien bridge',
      q: 'A Wien network has a series arm $R_1 = 10$ k$\\Omega$, $C_1 = 10$ nF and a parallel arm $R_2 = 20$ k$\\Omega$, $C_2 = 10$ nF. The non-inverting amplifier gain needed for oscillation is ______ (to two decimal places).',
      answer: 2.5, tol: 0.01, calc: () => 1 + 10 / 20 + 10 / 10,
      sol: '$1/\\beta = 1 + Z_1/Z_2 = 1 + \\dfrac{R_1}{R_2} + \\dfrac{C_2}{C_1} + j\\left(\\omega R_1C_2 - \\dfrac1{\\omega R_2C_1}\\right)$. The imaginary part vanishes at $\\omega_0 = 1/\\sqrt{R_1R_2C_1C_2}$ (1125 Hz here), where $1/\\beta = 1 + 0.5 + 1 = 2.5$. So the gain must be 2.5.',
      trap: 'Assuming the gain is always 3; that needs equal $R$ and equal $C$.' },
    { id: 'osc-018', type: 'mcq', level: 3, exams: G, sub: 'phase-shift oscillator',
      q: 'In the three-section RC ladder of a phase-shift oscillator at its oscillation frequency, which statement is correct?',
      options: ['Each section gives exactly $60^\\circ$', 'The total shift is $180^\\circ$, but the sections load each other and their individual shifts are unequal', 'The total shift is $90^\\circ$', 'The ladder gives no attenuation'], answer: 1,
      sol: 'Only the total matters: $180^\\circ$, at $\\omega RC = 1/\\sqrt6$ for high-pass sections. Because each section loads the one before, the shifts are not $60^\\circ$ apiece; that is why the attenuation is 29 rather than the 8 of buffered sections.',
      trap: 'The equal-$60^\\circ$ picture is true only with buffers between sections.' },
    { id: 'osc-019', type: 'nat', level: 3, exams: G, sub: 'Colpitts', unit: 'kHz',
      q: 'A Colpitts oscillator has $L = 100\\,\\mu$H, $C_1 = 1$ nF and $C_2 = 10$ nF. Its frequency is ______ kHz (to the nearest whole number).',
      answer: 528, tol: 2, calc: () => 1 / (TAU * Math.sqrt(100e-6 * 1e-9 * 10 / 11)) / 1e3,
      sol: '$C_{eq} = \\dfrac{1\\times10}{1 + 10} = 0.909$ nF, dominated by the smaller capacitor. $f = 1/(2\\pi\\sqrt{10^{-4}\\times9.09\\times10^{-10}}) = 528$ kHz.',
      trap: 'Using only $C_2$ gives 159 kHz.' },
    { id: 'osc-020', type: 'nat', level: 3, exams: G, sub: 'crystal', unit: 'kHz',
      q: 'A 10 MHz crystal (series resonance) has motional capacitance $0.02$ pF and shunt capacitance $C_0 = 5$ pF. Its parallel resonance lies above the series resonance by ______ kHz (to two decimal places).',
      answer: 19.98, tol: 0.05, calc: () => 10e6 * (Math.sqrt(1 + 0.02 / 5) - 1) / 1e3,
      sol: 'At parallel resonance the motional arm resonates with $C$ in series with $C_0$: $f_p = f_s\\sqrt{1 + C/C_0} = f_s\\sqrt{1.004}$. $f_p - f_s = 10^7\\times0.001998 = 19.98$ kHz, about $f_sC/2C_0 = 20$ kHz: the two resonances are very close.',
      trap: 'Using $C_0/C$ instead of $C/C_0$.' },
    { id: 'osc-021', type: 'mcq', level: 3, exams: G, sub: 'crystal',
      q: 'A crystal\'s motional arm has $L = 0.1$ H and series resistance $50\\,\\Omega$, resonating at $5$ MHz. Its quality factor is about',
      options: ['$6.3\\times10^4$', '$1.0\\times10^4$', '$6.3\\times10^2$', '$3.1\\times10^6$'], answer: 0,
      sol: '$Q = \\omega L/R = 2\\pi\\times5\\times10^6\\times0.1/50 = 6.28\\times10^4$. An $LC$ tank of discrete parts rarely exceeds a few hundred.',
      trap: 'Forgetting the $2\\pi$ gives $10^4$.' },
    { id: 'osc-022', type: 'msq', level: 3, exams: G, sub: 'Barkhausen criterion', format: 'multi',
      q: 'Which statements about the Barkhausen criterion are correct?',
      options: ['At the oscillation frequency $|A\\beta| = 1$ and $\\angle A\\beta = 0^\\circ$ (mod $360^\\circ$)', 'Meeting it guarantees a stable, constant amplitude without any non-linearity', 'If $|A\\beta| > 1$ at the zero-phase frequency, the amplitude grows until a non-linearity limits it', 'The oscillation frequency is fixed by the phase condition'], answer: [0, 2, 3],
      sol: 'Barkhausen describes the steady state. A linear loop with exactly $|A\\beta| = 1$ is marginal: the slightest change makes the amplitude grow or decay, so real oscillators rely on an amplitude-dependent gain. The phase condition picks the frequency; the magnitude condition fixes the amplitude through the non-linearity.',
      trap: 'Barkhausen is necessary for steady oscillation, not a recipe for amplitude stability.' },
    { id: 'osc-023', type: 'nat', level: 3, exams: G, sub: 'phase-shift oscillator', unit: 'Hz',
      q: 'A phase-shift oscillator uses three identical low-pass (series $R$, shunt $C$) sections in a ladder, with $R = 10$ k$\\Omega$ and $C = 10$ nF. It oscillates at ______ Hz (to the nearest whole number).',
      answer: 3898, tol: 10, calc: () => Math.sqrt(6) / (TAU * 1e4 * 1e-8),
      sol: 'For the low-pass ladder $1/\\beta = 1 - 5x^2 + j(6x - x^3)$ with $x = \\omega RC$. The phase is $180^\\circ$ at $x^2 = 6$: $f = \\sqrt6/(2\\pi RC) = 2.449/(6.283\\times10^{-4}) = 3898$ Hz, and again $\\beta = -1/29$.',
      trap: 'Using the high-pass result $1/(2\\pi\\sqrt6RC)$; the roles of $R$ and $C$ swap.' },
    { id: 'osc-024', type: 'mcq', level: 3, exams: G, sub: 'Hartley',
      q: 'A Hartley oscillator\'s tapped coil has sections $L_1 = 1$ mH and $L_2 = 4$ mH with coupling coefficient $k = 0.5$, wound so that their fluxes aid. The effective tank inductance is',
      options: ['5 mH', '7 mH', '3 mH', '6 mH'], answer: 1,
      sol: '$M = k\\sqrt{L_1L_2} = 0.5\\times2 = 1$ mH. Series-aiding coils: $L_{eq} = L_1 + L_2 + 2M = 7$ mH.',
      trap: 'Adding $M$ once, or subtracting it (3 mH is series-opposing).' },
    { id: 'osc-025', type: 'mcq', level: 3, exams: G, sub: 'Wien bridge',
      q: 'Both capacitors of an equal-component Wien bridge oscillator drift up by 2%. Its frequency',
      options: ['rises by about 2%', 'falls by about 4%', 'is unchanged', 'falls by about 2%'], answer: 3,
      sol: '$f_0 = 1/(2\\pi RC)$, so $f\\propto1/C$: $1/1.02 = 0.980$, a fall of 1.96%. The required gain stays 3 because the network stays balanced.',
      trap: 'Thinking of $1/\\sqrt{C}$ as in an $LC$ tank (that would give 1%).' },
    { id: 'osc-026', type: 'mcq', level: 3, exams: G, sub: 'quadrature oscillator',
      q: 'A quadrature oscillator built from two op-amp integrators and an inverter in a loop provides',
      options: ['a square and a triangle wave', 'two sine waves $180^\\circ$ apart only', 'a sawtooth', 'two sine waves $90^\\circ$ apart (sine and cosine)'], answer: 3,
      sol: 'Two integrators in a loop with an inversion solve $\\ddot x = -\\omega_0^2x$, the harmonic-oscillator equation, with $\\omega_0 = 1/RC$. The output of one integrator is the integral of the other: they are $90^\\circ$ apart. A square-and-triangle pair comes from an integrator with a Schmitt trigger.',
      trap: 'Confusing it with the function generator (Schmitt trigger plus integrator).' },
    { id: 'osc-027', type: 'nat', level: 3, exams: G, sub: 'phase-shift oscillator', unit: 'Hz',
      q: 'A phase-shift oscillator uses three identical high-pass $RC$ sections separated by unity-gain buffers, so each section gives $60^\\circ$, with $R = 10$ k$\\Omega$ and $C = 10$ nF. It oscillates at ______ Hz (to the nearest whole number).',
      answer: 919, tol: 2, calc: () => 1 / (TAU * Math.sqrt(3) * 1e4 * 1e-8),
      sol: 'A high-pass section leads by $\\arctan[1/(\\omega RC)]$. For $60^\\circ$: $1/(\\omega RC) = \\sqrt3$, so $f = 1/(2\\pi\\sqrt3RC) = 919$ Hz. Each section passes $\\cos60^\\circ = 1/2$, so the amplifier needs a gain of 8.',
      trap: 'Using the loaded-ladder result $\\sqrt6$.' },
    { id: 'osc-028', type: 'mcq', level: 3, exams: G, sub: 'Clapp',
      q: 'A Clapp oscillator adds a small capacitor $C_3$ in series with the inductor of a Colpitts tank ($C_3\\ll C_1, C_2$). The main benefit is that',
      options: ['the frequency, about $1/(2\\pi\\sqrt{LC_3})$, hardly depends on the transistor\'s own capacitances', 'it no longer needs an amplifier', 'it gives a square-wave output', 'it doubles the frequency'], answer: 0,
      sol: 'With $C_3$ much smaller than the others, the series combination is close to $C_3$, so the transistor capacitances (which sit across $C_1$ and $C_2$) barely affect the frequency: better stability.',
      trap: 'The extra capacitor changes the tuning, not the need for gain.' },

    // ---------- level 4 ----------
    { id: 'osc-029', type: 'nat', level: 4, exams: G, sub: 'LC oscillator', unit: 'mA/V',
      q: 'A tuned-collector oscillator has a tank with $L = 1\\,\\mu$H resonating at $10$ MHz with quality factor 50; a transformer feeds back a fraction $0.1$ of the tank voltage to the base. The smallest transconductance that sustains oscillation is ______ mA/V (to two decimal places).',
      answer: 3.18, tol: 0.02, calc: () => 1 / (0.1 * 50 * TAU * 1e7 * 1e-6) * 1000,
      sol: 'At resonance the tank is a resistance $R_p = Q\\omega_0L = 50\\times2\\pi\\times10^7\\times10^{-6} = 3142\\,\\Omega$. Loop gain $= g_mR_p\\beta\\ge1$, so $g_m\\ge1/(0.1\\times3142) = 3.18$ mA/V (a collector current of only 0.08 mA at room temperature).',
      trap: 'Using the series loss resistance $\\omega L/Q$ instead of the parallel resistance $Q\\omega L$.' },
    { id: 'osc-030', type: 'nat', level: 4, exams: G, sub: 'crystal', unit: 'kHz',
      q: 'A crystal with series resonance $10$ MHz, motional capacitance $0.02$ pF and shunt capacitance $5$ pF runs with a load capacitance of $15$ pF. Its operating frequency lies above $f_s$ by about ______ kHz (to two decimal places).',
      answer: 5.0, tol: 0.05, calc: () => 10e6 * 0.02 / (2 * (5 + 15)) / 1e3,
      sol: 'With the load in parallel with $C_0$, the motional arm resonates with $C$ in series with $C_0 + C_L$: $f\\approx f_s\\left(1 + \\dfrac{C}{2(C_0 + C_L)}\\right)$. $\\Delta f = 10^7\\times0.02/40 = 5.0$ kHz. Trimming $C_L$ "pulls" the crystal by a few kHz.',
      trap: 'Leaving out $C_0$ (gives 6.7 kHz).' },
    { id: 'osc-031', type: 'mcq', level: 4, exams: G, sub: 'amplitude stabilisation',
      q: 'A Wien bridge oscillator\'s output looks like a flat-topped sine, clipped at both rails. The most likely cause is',
      options: ['the amplifier gain is set well above 3 with no amplitude control', 'the gain is slightly below 3', 'the capacitors are unequal by 1%', 'the supply is too large'], answer: 0,
      sol: 'With gain above 3 the amplitude grows until the op-amp saturates; the clipping is then the only limiting mechanism, and it distorts the waveform. A gain just above 3 with a lamp, thermistor or diode-resistor network limiting gently gives a clean sine.',
      trap: 'A gain below 3 gives no oscillation at all, not a clipped one.' },
    { id: 'osc-032', type: 'msq', level: 4, exams: G, sub: 'crystal', format: 'multi',
      q: 'For a quartz crystal modelled as a series $RLC$ arm in parallel with $C_0$, which statements are correct?',
      options: ['Between the series and parallel resonances the crystal behaves as an inductance', 'At series resonance its impedance is a minimum, about $R$', 'The parallel resonance lies above the series resonance', 'The two resonances are separated by roughly half of $f_s$'], answer: [0, 1, 2],
      sol: 'Above $f_s$ the motional arm is inductive, and it stays so (overall) until it resonates with $C_0$ at $f_p = f_s\\sqrt{1 + C/C_0}$, slightly higher. Since $C/C_0\\sim10^{-3}$, the gap is about $10^{-3}f_s$, tiny. Oscillators like the Pierce use the narrow inductive region.',
      trap: 'The separation is parts per thousand, not a large fraction.' },
    { id: 'osc-033', type: 'nat', level: 4, exams: G, sub: 'start-up', unit: 's⁻¹',
      q: 'A Wien bridge oscillator ($R = 10$ k$\\Omega$, $C = 10$ nF) has an amplifier gain $K = 3.1$, so its closed-loop characteristic equation is $(RC)^2s^2 + (3 - K)RCs + 1 = 0$. While the amplitude is small, its envelope grows as $e^{\\sigma t}$ with $\\sigma$ = ______ s$^{-1}$.',
      answer: 500, tol: 1, calc: () => (3.1 - 3) / (2 * 1e-4),
      sol: 'The roots are $s = \\dfrac{(K - 3)\\pm\\sqrt{(K - 3)^2 - 4}}{2RC}$. Their real part is $\\sigma = (K - 3)/(2RC) = 0.1/(2\\times10^{-4}) = 500$ s$^{-1}$: right half plane, growing. At $K = 3$ the poles sit on the imaginary axis; below 3 they decay.',
      trap: 'Using $(K - 3)/RC$, forgetting the 2.' },
    { id: 'osc-036', type: 'nat', level: 4, exams: G, sub: 'phase-shift oscillator', unit: 'kΩ',
      q: 'An op-amp RC phase-shift oscillator has three high-pass sections with $C = 10$ nF and $R = 10$ k$\\Omega$; the third resistor is the $10$ k$\\Omega$ input resistor of the inverting amplifier (virtual ground). The smallest feedback resistor $R_f$ that starts oscillation is ______ k$\\Omega$.',
      answer: 290, tol: 0, calc: () => 29 * 10,
      sol: 'The ladder needs an inverting gain of 29 in magnitude. Because the op-amp input is a virtual ground, its input resistor acts as the third shunt $R$, so the gain is $R_f/R = 29$: $R_f = 290$ k$\\Omega$ (a little more in practice).',
      trap: 'Using 3 or 8 from other oscillators.' },
    { id: 'osc-039', type: 'mcq', level: 4, exams: G, sub: 'crystal',
      q: 'A crystal resonates in series at $4.000$ MHz and its motional capacitance is $0.015$ pF. Its motional inductance is about',
      options: ['0.106 H', '10.6 mH', '1.06 H', '0.0106 μH'], answer: 0,
      sol: '$L = 1/[(2\\pi f_s)^2C] = 1/[(2.513\\times10^7)^2\\times1.5\\times10^{-14}] = 1/9.47 = 0.106$ H.',
      trap: 'Dropping the square on $2\\pi f$.' },

    // ---------- level 5 ----------
    { id: 'osc-034', type: 'nat', level: 5, exams: G, sub: 'start-up',
      q: 'A Wien bridge oscillator with $R = 10$ k$\\Omega$ and $C = 10$ nF starts with amplifier gain $3.05$. While it is still linear, the amplitude doubles in about ______ cycles (to two decimal places).',
      answer: 4.41, tol: 0.03, calc: () => Math.log(2) / ((3.05 - 3) / (2 * 1e-4)) / (TAU * 1e-4),
      sol: 'Growth rate $\\sigma = (K - 3)/(2RC) = 0.05/(2\\times10^{-4}) = 250$ s$^{-1}$, so doubling takes $\\ln2/250 = 2.77$ ms. The frequency is $1/(2\\pi RC) = 1592$ Hz (the shift from the growth is negligible), so $2.77\\text{ ms}\\times1592 = 4.41$ cycles.',
      trap: 'Using $\\sigma = (K - 3)/RC$ halves the number of cycles.' },
    { id: 'osc-037', type: 'nat', level: 5, exams: G, sub: 'crystal', unit: 'Ω',
      q: 'In a Pierce crystal oscillator the transistor with $g_m = 10$ mA/V and two load capacitors $C_1 = C_2 = 30$ pF present a negative resistance $-g_m/(\\omega^2C_1C_2)$ to the crystal at $10$ MHz. The largest motional resistance of a crystal that will still oscillate is about ______ $\\Omega$ (to the nearest 10 $\\Omega$).',
      answer: 2810, tol: 15, calc: () => 0.01 / ((TAU * 1e7) ** 2 * 30e-12 * 30e-12),
      sol: '$\\omega^2 = (2\\pi\\times10^7)^2 = 3.948\\times10^{15}$ s$^{-2}$, $C_1C_2 = 9\\times10^{-22}$ F$^2$. Negative resistance $= 0.01/(3.948\\times10^{15}\\times9\\times10^{-22}) = 2.81$ k$\\Omega$. Oscillation needs it to exceed the crystal\'s $R$, so crystals up to about 2.8 k$\\Omega$ start (designers want a margin of 5 to 10).',
      trap: 'Using $\\omega$ instead of $\\omega^2$.' },
    { id: 'osc-038', type: 'msq', level: 5, exams: G, sub: 'phase-shift oscillator', format: 'multi',
      q: 'About the three-section high-pass RC ladder phase-shift oscillator, which statements are correct?',
      options: ['The ladder shifts the phase by $180^\\circ$ at the oscillation frequency', 'Each section shifts by $60^\\circ$', 'The ladder\'s transfer at that frequency is $-1/29$', 'Raising the amplifier gain from 29 to 35 noticeably raises the oscillation frequency'], answer: [0, 2],
      sol: 'The frequency comes from the phase condition of the network alone, $\\omega RC = 1/\\sqrt6$; there $\\beta = -1/29$. Extra gain only makes the amplitude grow until a non-linearity limits it (with some distortion); it does not move the frequency of an ideal network. The sections are loaded, so their shifts are unequal.',
      trap: 'Gain controls amplitude, phase controls frequency.' },
    { id: 'osc-040', type: 'mcq', level: 5, exams: G, sub: 'Wien bridge',
      q: 'The amplifier of a Wien bridge oscillator is not ideal: near $f_0 = 1/(2\\pi RC)$ it adds a small phase lag. The actual oscillation frequency is',
      options: ['slightly below $f_0$', 'slightly above $f_0$', 'exactly $f_0$', 'zero: it cannot oscillate'], answer: 0,
      sol: 'The loop phase must total zero, so the network must supply a small lead to cancel the amplifier\'s lag. The lead-lag network leads below $f_0$ (its phase is $-\\arctan[(\\omega RC - 1/\\omega RC)/3]$, positive for $\\omega < \\omega_0$). So the oscillation settles slightly below $f_0$, with a little more gain needed.',
      trap: 'Guessing the frequency rises because something "lags".' },
  ],
  gens: [
    { id: 'osc-g01', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Wien bridge',
      make(r) {
        const R = pick(r, 1, 100, 1), C = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]), R1 = pick(r, 1, 20, 1), ask = r() < 0.6 ? 'f' : 'Rf';
        const f = 1 / (TAU * R * 1e3 * C * 1e-9), val = ask === 'f' ? f : 2 * R1;
        return { q: ask === 'f' ? `A Wien bridge oscillator uses $R = ${R}$ k$\\Omega$ and $C = ${C}$ nF in both arms. It oscillates at ______ Hz (to the nearest whole number).` : `A Wien bridge oscillator (equal $R$, equal $C$) uses a non-inverting amplifier with $R_1 = ${R1}$ k$\\Omega$ to ground. The feedback resistor for a loop gain of exactly one is ______ k$\\Omega$.`,
          answer: ask === 'f' ? Math.round(f) : val, tol: ask === 'f' ? Math.max(1, Math.round(f * 0.003)) : 0, R, C, R1, ask,
          sol: `At $f_0 = 1/(2\\pi RC) = ${Math.round(f)}$ Hz the network passes $1/3$ with zero phase, so the amplifier needs $1 + R_f/R_1 = 3$, $R_f = 2R_1 = ${2 * R1}$ k$\\Omega$.`,
          trap: ask === 'f' ? 'Using $\\sqrt6$ from the phase-shift oscillator.' : 'Setting $R_f = 3R_1$.' };
      },
      verify: (p) => (p.ask === 'f' ? 1 / (TAU * p.R * p.C * 1e-6) : 2 * p.R1) },
    { id: 'osc-g02', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'phase-shift oscillator',
      make(r) {
        const kind = choose(r, ['hp', 'lp', 'buf']), R = pick(r, 1, 50, 1), C = choose(r, [1, 2.2, 4.7, 10, 22, 47]);
        const rc = R * 1e3 * C * 1e-9, f = kind === 'hp' ? 1 / (TAU * Math.sqrt(6) * rc) : kind === 'lp' ? Math.sqrt(6) / (TAU * rc) : 1 / (TAU * Math.sqrt(3) * rc);
        const desc = kind === 'hp' ? 'three identical high-pass sections (series $C$, shunt $R$) in a ladder' : kind === 'lp' ? 'three identical low-pass sections (series $R$, shunt $C$) in a ladder' : 'three identical high-pass sections separated by unity-gain buffers';
        return { q: `A phase-shift oscillator uses ${desc}, with $R = ${R}$ k$\\Omega$ and $C = ${C}$ nF. It oscillates at ______ Hz (to the nearest whole number).`,
          answer: Math.round(f), tol: Math.max(1, Math.round(f * 0.003)), unit: 'Hz', kind, R, C,
          sol: kind === 'hp' ? `Loaded high-pass ladder: $180^\\circ$ at $\\omega RC = 1/\\sqrt6$, $f = 1/(2\\pi\\sqrt6RC) = ${Math.round(f)}$ Hz; gain 29 needed.` : kind === 'lp' ? `Loaded low-pass ladder: $180^\\circ$ at $\\omega RC = \\sqrt6$, $f = \\sqrt6/(2\\pi RC) = ${Math.round(f)}$ Hz; gain 29 needed.` : `Buffered sections each give $60^\\circ$: $1/(\\omega RC) = \\sqrt3$, $f = 1/(2\\pi\\sqrt3RC) = ${Math.round(f)}$ Hz; gain 8 needed.`,
          trap: 'Mixing up the high-pass and low-pass results, or the loaded and buffered ones.' };
      },
      verify: (p) => { const rc = p.R * p.C * 1e-6; return p.kind === 'hp' ? 1 / (TAU * Math.sqrt(6) * rc) : p.kind === 'lp' ? Math.sqrt(6) / (TAU * rc) : 1 / (TAU * Math.sqrt(3) * rc); } },
    { id: 'osc-g03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Colpitts',
      make(r) {
        const L = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100, 220]), C1 = choose(r, [0.1, 0.22, 0.47, 1, 2.2, 4.7]), C2 = choose(r, [0.1, 0.47, 1, 2.2, 4.7, 10]), clapp = r() < 0.3, C3 = 0.01 * choose(r, [1, 2, 5]);
        const Ceq = clapp ? 1 / (1 / C1 + 1 / C2 + 1 / C3) : C1 * C2 / (C1 + C2), f = 1 / (TAU * Math.sqrt(L * 1e-6 * Ceq * 1e-9)) / 1e3;
        return { q: `A ${clapp ? 'Clapp' : 'Colpitts'} oscillator has $L = ${L}\\,\\mu$H, $C_1 = ${C1}$ nF, $C_2 = ${C2}$ nF${clapp ? ` and $C_3 = ${C3}$ nF in series with $L$` : ''}. Its frequency is ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 1)), unit: 'kHz', L, C1, C2, C3, clapp,
          sol: `The tank capacitance is the series combination: $C_{eq} = ${round(Ceq, 5)}$ nF. $f = 1/(2\\pi\\sqrt{LC_{eq}}) = ${round(f, 1)}$ kHz.${clapp ? ' The small $C_3$ dominates, which is why the Clapp is stable.' : ''}`,
          trap: 'Adding the capacitors instead of combining them in series.' };
      },
      verify: (p) => { const Ceq = p.clapp ? 1 / (1 / p.C1 + 1 / p.C2 + 1 / p.C3) : p.C1 * p.C2 / (p.C1 + p.C2); return 1 / (TAU * Math.sqrt(p.L * 1e-6 * Ceq * 1e-9)) / 1e3; } },
    { id: 'osc-g04', type: 'nat', level: 3, exams: G, sub: 'Hartley',
      make(r) {
        const L1 = pick(r, 0.5, 5, 0.5), L2 = pick(r, 0.5, 5, 0.5), k = choose(r, [0, 0.2, 0.5, 0.8]), C = choose(r, [0.1, 0.47, 1, 2.2, 4.7, 10]);
        const M = k * Math.sqrt(L1 * L2), Leq = L1 + L2 + 2 * M, f = 1 / (TAU * Math.sqrt(Leq * 1e-3 * C * 1e-9)) / 1e3;
        return { q: `A Hartley oscillator\'s tapped coil has sections $${L1}$ mH and $${L2}$ mH with coupling coefficient $${k}$ (series aiding), tuned by $${C}$ nF. Its frequency is ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 1)), unit: 'kHz', L1, L2, k, C,
          sol: `$M = k\\sqrt{L_1L_2} = ${round(M, 4)}$ mH, $L_{eq} = L_1 + L_2 + 2M = ${round(Leq, 4)}$ mH. $f = 1/(2\\pi\\sqrt{L_{eq}C}) = ${round(f, 1)}$ kHz.`,
          trap: 'Forgetting the $2M$ term when the sections are coupled.' };
      },
      verify: (p) => 1 / (TAU * Math.sqrt((p.L1 + p.L2 + 2 * p.k * Math.sqrt(p.L1 * p.L2)) * 1e-3 * p.C * 1e-9)) / 1e3 },
    { id: 'osc-g05', type: 'nat', level: 3, exams: G, sub: 'crystal',
      make(r) {
        const L = choose(r, [0.01, 0.05, 0.1, 0.25, 0.5, 1]), C = choose(r, [0.005, 0.01, 0.015, 0.02, 0.03]), C0 = pick(r, 2, 8, 0.5), ask = r() < 0.5 ? 'fs' : 'gap';
        const fs = 1 / (TAU * Math.sqrt(L * C * 1e-12)), gap = fs * (Math.sqrt(1 + C / C0) - 1);
        return { q: ask === 'fs' ? `A crystal\'s motional arm has $L = ${L}$ H and $C = ${C}$ pF. Its series resonant frequency is ______ MHz (to three decimal places).` : `A crystal has motional $L = ${L}$ H, $C = ${C}$ pF and shunt capacitance $C_0 = ${C0}$ pF. Its parallel resonance lies above its series resonance by ______ kHz (to two decimal places).`,
          answer: ask === 'fs' ? round(fs / 1e6, 3) : round(gap / 1e3, 2), tol: ask === 'fs' ? Math.max(0.001, round(fs / 1e6 * 0.002, 3)) : Math.max(0.01, round(gap / 1e3 * 0.004, 2)), L, C, C0, ask,
          sol: `$f_s = 1/(2\\pi\\sqrt{LC}) = ${round(fs / 1e6, 4)}$ MHz. $f_p = f_s\\sqrt{1 + C/C_0}$, so $f_p - f_s = ${round(gap / 1e3, 3)}$ kHz.`,
          trap: ask === 'fs' ? 'Forgetting that pF is $10^{-12}$ F.' : 'Using $C_0/C$ instead of $C/C_0$.' };
      },
      verify: (p) => { const fs = 1 / (TAU * Math.sqrt(p.L * p.C * 1e-12)); return p.ask === 'fs' ? fs / 1e6 : fs * (Math.sqrt(1 + p.C / p.C0) - 1) / 1e3; } },
    { id: 'osc-g06', type: 'nat', level: 4, exams: G, sub: 'Wien bridge',
      make(r) {
        const R1 = pick(r, 1, 50, 1), R2 = pick(r, 1, 50, 1), C1 = choose(r, [1, 2.2, 4.7, 10, 22]), C2 = choose(r, [1, 2.2, 4.7, 10, 22]), ask = r() < 0.5 ? 'f' : 'K';
        const f = 1 / (TAU * Math.sqrt(R1 * R2 * C1 * C2) * 1e-6), K = 1 + R1 / R2 + C2 / C1;
        return { q: `A Wien network has series arm $R_1 = ${R1}$ k$\\Omega$, $C_1 = ${C1}$ nF and parallel arm $R_2 = ${R2}$ k$\\Omega$, $C_2 = ${C2}$ nF. ${ask === 'f' ? 'The oscillator runs at ______ Hz (to the nearest whole number).' : 'The non-inverting amplifier gain needed for oscillation is ______ (to three decimal places).'}`,
          answer: ask === 'f' ? Math.round(f) : round(K, 3), tol: ask === 'f' ? Math.max(1, Math.round(f * 0.003)) : 0.002, R1, R2, C1, C2, ask,
          sol: `$1/\\beta = 1 + R_1/R_2 + C_2/C_1 + j(\\omega R_1C_2 - 1/\\omega R_2C_1)$. Zero phase at $f = 1/(2\\pi\\sqrt{R_1R_2C_1C_2}) = ${Math.round(f)}$ Hz, where the gain needed is $1 + ${round(R1 / R2, 4)} + ${round(C2 / C1, 4)} = ${round(K, 3)}$.`,
          trap: 'Assuming the gain is 3 for unequal parts.' };
      },
      verify: (p) => (p.ask === 'f' ? 1 / (TAU * Math.sqrt(p.R1 * p.R2 * p.C1 * p.C2) * 1e-6) : 1 + p.R1 / p.R2 + p.C2 / p.C1) },
    { id: 'osc-g07', type: 'nat', level: 5, exams: G, sub: 'start-up',
      make(r) {
        const R = pick(r, 1, 50, 1), C = choose(r, [1, 2.2, 4.7, 10, 22]), dK = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2]), ask = r() < 0.5 ? 'sigma' : 'cycles';
        const rc = R * 1e3 * C * 1e-9, sigma = dK / (2 * rc), cyc = Math.log(2) / sigma / (TAU * rc);
        return { q: `A Wien bridge oscillator ($R = ${R}$ k$\\Omega$, $C = ${C}$ nF) starts with amplifier gain $${round(3 + dK, 2)}$. While it is still linear, ${ask === 'sigma' ? 'its envelope grows as $e^{\\sigma t}$ with $\\sigma$ = ______ s$^{-1}$ (to the nearest whole number).' : 'its amplitude doubles in ______ cycles (to two decimal places).'}`,
          answer: ask === 'sigma' ? Math.round(sigma) : round(cyc, 2), tol: ask === 'sigma' ? Math.max(1, Math.round(sigma * 0.003)) : Math.max(0.01, round(cyc * 0.004, 2)), R, C, dK, ask,
          sol: `Characteristic equation $(RC)^2s^2 + (3 - K)RCs + 1 = 0$, real part $\\sigma = (K - 3)/(2RC) = ${dK}/(2\\times${round(rc, 7)}) = ${round(sigma, 1)}$ s$^{-1}$. Doubling time $\\ln2/\\sigma$; in units of the period $2\\pi RC$ that is $\\ln2/(2\\pi\\sigma RC) = \\ln2/(\\pi(K - 3)) = ${round(cyc, 2)}$ cycles.`,
          trap: 'Forgetting the factor 2 in $\\sigma$.' };
      },
      verify: (p) => (p.ask === 'sigma' ? p.dK / (2 * p.R * p.C * 1e-6) : Math.log(2) / (Math.PI * p.dK)) },
    { id: 'osc-g08', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'oscillator types',
      make(r) {
        const T = [
          ['a series $RC$ and a parallel $RC$ arm feeding a non-inverting amplifier of gain 3', 'Wien bridge oscillator'],
          ['three cascaded $RC$ sections feeding an inverting amplifier of gain at least 29', 'RC phase-shift oscillator'],
          ['an inductor with two capacitors in series across it, the tap between them feeding back', 'Colpitts oscillator'],
          ['a capacitor with a tapped coil across it, the tap feeding back', 'Hartley oscillator'],
          ['two integrators and an inverter in a loop', 'quadrature oscillator'],
          ['a quartz resonator between the input and output of an inverting amplifier with two capacitors to ground', 'Pierce crystal oscillator'],
          ['a capacitor charged through a resistor and discharged when a unijunction transistor fires', 'UJT relaxation oscillator'],
        ];
        const idx = shuffle(r, T.map((_, i) => i)).slice(0, 4), pickI = idx[0];
        const options = shuffle(r, idx).map((i) => T[i][1]);
        return { q: `An oscillator uses ${T[pickI][0]}. It is a`, options, answer: options.indexOf(T[pickI][1]),
          sol: `That is the ${T[pickI][1]}. RC types (Wien, phase-shift, quadrature) suit audio frequencies; LC types (Colpitts, Hartley) radio frequencies; crystals give the best stability; relaxation oscillators give non-sinusoidal waves.`,
          trap: 'Mixing Colpitts (tapped capacitor) and Hartley (tapped inductor).' };
      } },
    { id: 'osc-g09', type: 'nat', level: 4, exams: G, sub: 'LC oscillator',
      make(r) {
        const L = choose(r, [0.1, 0.22, 0.47, 1, 2.2, 4.7, 10]), f = choose(r, [1, 2, 5, 10, 20, 50]), Q = choose(r, [20, 30, 50, 80, 100]), b = choose(r, [0.05, 0.1, 0.2, 0.25]);
        const Rp = Q * TAU * f * 1e6 * L * 1e-6, gm = 1 / (b * Rp) * 1000;
        return { q: `A tuned-collector oscillator has a tank of $L = ${L}\\,\\mu$H resonating at $${f}$ MHz with $Q = ${Q}$; a fraction $${b}$ of the tank voltage is fed back. The minimum transconductance for oscillation is ______ mA/V (to three decimal places).`,
          answer: round(gm, 3), tol: Math.max(0.002, round(gm * 0.004, 3)), unit: 'mA/V', L, f, Q, b,
          sol: `At resonance $R_p = Q\\omega_0L = ${Q}\\times2\\pi\\times${f}\\times10^6\\times${L}\\times10^{-6} = ${round(Rp, 2)}\\,\\Omega$. Need $g_mR_p\\beta\\ge1$: $g_m\\ge1/(${b}\\times${round(Rp, 2)}) = ${round(gm, 3)}$ mA/V.`,
          trap: 'Using the series loss resistance $\\omega L/Q$.' };
      },
      verify: (p) => 1000 / (p.b * p.Q * TAU * p.f * p.L) },
    { id: 'osc-g10', type: 'nat', level: 5, exams: G, sub: 'crystal',
      make(r) {
        const gm = choose(r, [2, 5, 10, 20, 40]), f = choose(r, [4, 8, 10, 16, 20, 25]), C1 = choose(r, [10, 15, 22, 33]), C2 = choose(r, [10, 15, 22, 33, 47]);
        const Rn = gm * 1e-3 / ((TAU * f * 1e6) ** 2 * C1 * C2 * 1e-24);
        return { q: `A Pierce oscillator transistor ($g_m = ${gm}$ mA/V) with load capacitors $C_1 = ${C1}$ pF and $C_2 = ${C2}$ pF presents $-g_m/(\\omega^2C_1C_2)$ to the crystal at $${f}$ MHz. The largest crystal motional resistance that will still oscillate is ______ $\\Omega$ (to the nearest whole number).`,
          answer: Math.round(Rn), tol: Math.max(1, Math.round(Rn * 0.004)), unit: 'Ω', gm, f, C1, C2,
          sol: `$\\omega^2 = (2\\pi\\times${f}\\times10^6)^2 = ${round((TAU * f * 1e6) ** 2 / 1e15, 4)}\\times10^{15}$ s$^{-2}$, $C_1C_2 = ${C1 * C2}\\times10^{-24}$ F$^2$. $|R_n| = ${gm}\\times10^{-3}/(\\omega^2C_1C_2) = ${Math.round(Rn)}\\,\\Omega$.`,
          trap: 'Using $\\omega$ in place of $\\omega^2$, or picofarads as nanofarads.' };
      },
      verify: (p) => p.gm * 1e-3 / ((TAU * p.f * 1e6) ** 2 * p.C1 * p.C2 * 1e-24) },
    { id: 'osc-g11', type: 'nat', level: 2, exams: G, sub: 'relaxation oscillator',
      make(r) {
        const R = pick(r, 1, 100, 1), C = choose(r, [0.01, 0.022, 0.047, 0.1, 0.22, 0.47, 1]), eta = choose(r, [0.5, 0.55, 0.6, 0.63, 0.7, 0.75, 0.8]);
        const T = R * 1e3 * C * 1e-6 * Math.log(1 / (1 - eta)), f = 1 / T;
        return { q: `A UJT relaxation oscillator has $R = ${R}$ k$\\Omega$, $C = ${C}\\,\\mu$F and $\\eta = ${eta}$ (diode drop and discharge time neglected). Its frequency is ______ Hz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 1)), unit: 'Hz', R, C, eta,
          sol: `$T = RC\\ln\\dfrac1{1 - \\eta} = ${round(R * C, 4)}\\text{ ms}\\times${round(Math.log(1 / (1 - eta)), 4)} = ${round(T * 1e3, 4)}$ ms, $f = ${round(f, 1)}$ Hz.`,
          trap: 'Using $\\ln(1/\\eta)$.' };
      },
      verify: (p) => 1 / (p.R * p.C * 1e-3 * Math.log(1 / (1 - p.eta))) },
    { id: 'osc-g12', type: 'nat', level: 4, exams: G, sub: 'crystal',
      make(r) {
        const fs = choose(r, [4, 8, 10, 12, 16, 20]), C = choose(r, [0.01, 0.015, 0.02, 0.025]), C0 = pick(r, 3, 7, 0.5), CL = choose(r, [8, 10, 12, 15, 18, 20, 30]);
        const df = fs * 1e6 * C / (2 * (C0 + CL));
        return { q: `A crystal with series resonance $${fs}$ MHz, motional capacitance $${C}$ pF and shunt capacitance $${C0}$ pF runs with a load capacitance of $${CL}$ pF. It operates above $f_s$ by about ______ Hz (to the nearest whole number).`,
          answer: Math.round(df), tol: Math.max(1, Math.round(df * 0.003)), unit: 'Hz', fs, C, C0, CL,
          sol: `$\\Delta f\\approx f_s\\dfrac{C}{2(C_0 + C_L)} = ${fs}\\times10^6\\times\\dfrac{${C}}{2\\times${round(C0 + CL, 1)}} = ${Math.round(df)}$ Hz.`,
          trap: 'Leaving $C_0$ out of the denominator.' };
      },
      verify: (p) => p.fs * 1e6 * p.C / (2 * (p.C0 + p.CL)) },
    ...more,
  ],
};
