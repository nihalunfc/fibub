// Op-amp circuits at GATE / CSIR NET level: finite open-loop gain and noise gain, closed-loop bandwidth, slew-rate
// limits, offsets and bias-current compensation; Schmitt triggers with a reference, comparators, op-amp and 555
// astable and monostable circuits; log and antilog amplifiers, precision rectifiers, integrator practice; Sallen-Key
// filters (f0 and Q), all-pass networks; Howland current source, negative impedance converter, gyrator, T-network,
// instrumentation and difference amplifiers with resistor mismatch. The JAM topic `op-amps` covers the basic inverting,
// non-inverting, summing and integrator circuits. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './op-amp-circuits.more.gen.js';
import more2 from './op-amp-circuits.more2.gen.js';

const G = ['gate', 'net'];
const VT = 0.025852;

export default {
  topic: 'op-amp-circuits',
  items: [
    // ---------- level 1 ----------
    { id: 'oc-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'ideal op-amp',
      q: 'For an ideal op-amp working with negative feedback (output not saturated), the two rules used to analyse the circuit are',
      options: ['the output current is zero and the output voltage is zero', 'the inputs draw no current and the output resistance is infinite', 'the inputs draw no current and the two input voltages are equal', 'the input voltages differ by the supply voltage'], answer: 2,
      sol: 'Infinite input resistance means no current into either input. Infinite open-loop gain with a finite output means $V_+ - V_- = V_o/A\\to0$: the feedback forces the inputs to the same voltage (a virtual short). The second rule fails if there is no negative feedback or if the output saturates.',
      trap: 'The virtual short is a result of negative feedback, not a property of the chip; a comparator has none.' },
    { id: 'oc-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'comparator',
      q: 'An op-amp is used open loop as a comparator. With $V_+ = 1.00$ V and $V_- = 1.02$ V, the output is',
      options: ['at the negative saturation level', 'at the positive saturation level', 'about $-0.02$ V', 'zero, because the inputs are nearly equal'], answer: 0,
      sol: 'Open loop, $V_o = A(V_+ - V_-) = A\\times(-0.02$ V$)$. With $A\\sim10^5$ that is far beyond the rails, so the output sits at $-V_{sat}$. There is no feedback to make the inputs equal.',
      trap: 'Applying the virtual-short rule to a circuit with no negative feedback.' },
    { id: 'oc-003', type: 'mcq', level: 1, exams: G, sub: 'transimpedance',
      q: 'A photodiode feeds a current of $2\\,\\mu$A into the inverting input of an op-amp whose non-inverting input is grounded; a $500$ k$\\Omega$ resistor connects output to inverting input. The output voltage is',
      options: ['$+1$ V', '$-2$ V', '$+0.25$ V', '$-1$ V'], answer: 3,
      sol: 'The inverting input is a virtual ground, so the photodiode sees zero bias and all its current flows on through the feedback resistor: $V_o = 0 - IR_f = -2\\times10^{-6}\\times5\\times10^5 = -1$ V. This current-to-voltage converter is a transimpedance amplifier.',
      trap: 'The sign: current flowing into the node must leave through $R_f$ towards the output, so the output goes negative.' },
    { id: 'oc-004', type: 'nat', level: 1, exams: G, sub: 'offset', unit: 'mV',
      q: 'An op-amp with input offset voltage $2$ mV is used in a non-inverting amplifier with $R_1 = 1$ k$\\Omega$ and $R_f = 100$ k$\\Omega$. With the input grounded, the output offset is ______ mV (bias currents ignored).',
      answer: 202, tol: 1, calc: () => 2 * (1 + 100 / 1),
      sol: 'The offset acts like a small voltage source in series with the non-inverting input, and it is amplified by the noise gain $1 + R_f/R_1 = 101$: $2\\times101 = 202$ mV. This is the same for the inverting configuration with the same resistors.',
      trap: 'Using the inverting gain $R_f/R_1 = 100$ gives 200 mV; offsets always see the noise gain.' },
    { id: 'oc-005', type: 'mcq', level: 1, exams: G, sub: 'precision rectifier',
      q: 'A precision ("super-diode") half-wave rectifier places the diode inside the op-amp\'s feedback loop. Why can it rectify a $50$ mV signal?',
      options: ['The op-amp heats the diode so it conducts at lower voltage', 'The diode\'s forward drop is divided by the open-loop gain, so the effective threshold is microvolts', 'The op-amp output is always exactly zero', 'A Schottky diode is required, whose drop is zero'], answer: 1,
      sol: 'When the diode conducts the loop is closed and the output follows the input exactly; the op-amp output simply rises a diode drop higher than the load. The input needed to start conduction is about $0.6\\text{ V}/A$, a few microvolts.',
      trap: 'The diode still drops 0.6 V; the op-amp supplies it.' },
    { id: 'oc-006', type: 'msq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Schmitt trigger', format: 'multi',
      q: 'Which statements about an op-amp Schmitt trigger are correct?',
      options: ['Its switching thresholds for rising and falling inputs differ (hysteresis)', 'It uses positive feedback', 'It gives a clean single transition for a slow, noisy input if the noise is smaller than the hysteresis', 'Its two inputs stay at equal voltages at all times'], answer: [0, 1, 2],
      sol: 'Feedback to the non-inverting input makes the threshold depend on the output state, so once it has switched the input must move back past the other threshold. Noise smaller than the gap cannot cause chatter. With positive feedback the output sits at a rail and the inputs are generally not equal.',
      trap: 'The virtual short belongs to negative feedback only.' },

    // ---------- level 2 ----------
    { id: 'oc-007', type: 'nat', level: 2, exams: G, sub: 'Schmitt trigger', unit: 'V',
      q: 'An inverting Schmitt trigger takes its input on the inverting terminal. The non-inverting terminal is joined to a $1.2$ V reference through $10$ k$\\Omega$ and to the output through $50$ k$\\Omega$. The output saturates at $\\pm12$ V. The upper threshold voltage is ______ V.',
      answer: 3.0, tol: 0.01, calc: () => 1.2 * 50 / 60 + 12 * 10 / 60,
      sol: 'By superposition, $V_+ = V_{ref}\\dfrac{50}{60} + V_o\\dfrac{10}{60} = 1.0 + V_o/6$. With $V_o = +12$ V, $V_+ = 3.0$ V: the input must rise above 3.0 V to switch the output low. With $V_o = -12$ V the lower threshold is $-1.0$ V; hysteresis 4.0 V centred on 1.0 V.',
      trap: 'The centre of the window is $V_{ref}R_f/(R + R_f) = 1.0$ V, not the reference itself.' },
    { id: 'oc-008', type: 'nat', level: 2, exams: G, sub: 'astable', unit: 'Hz',
      q: 'An op-amp astable multivibrator has $R = 10$ k$\\Omega$ and $C = 0.1\\,\\mu$F in its timing path, and a feedback divider giving $\\beta = 0.5$ (symmetric output). Its frequency is ______ Hz (to the nearest whole number).',
      answer: 455, tol: 2, calc: () => 1 / (2 * 1e4 * 1e-7 * Math.log(3)),
      sol: 'The capacitor charges towards $\\pm V_{sat}$ and the output flips when it reaches $\\pm\\beta V_{sat}$. Each half period lasts $RC\\ln\\dfrac{1 + \\beta}{1 - \\beta}$, so $T = 2RC\\ln3 = 2\\times10^{-3}\\times1.0986 = 2.197$ ms and $f = 455$ Hz.',
      trap: 'Forgetting the factor 2 (two half periods) doubles the frequency.' },
    { id: 'oc-009', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: '555 timer',
      q: 'A 555 timer in astable mode has $R_A = 1$ k$\\Omega$, $R_B = 10$ k$\\Omega$ and $C = 0.1\\,\\mu$F. Its frequency is about',
      options: ['1.37 kHz', '686 Hz', '343 Hz', '6.9 kHz'], answer: 1,
      sol: 'The capacitor charges through $R_A + R_B$ and discharges through $R_B$, between $V_{CC}/3$ and $2V_{CC}/3$; each takes $\\ln2 = 0.693$ time constants. $T = 0.693(R_A + 2R_B)C = 0.693\\times21\\times10^3\\times10^{-7} = 1.455$ ms, so $f = 1.44/[(R_A + 2R_B)C] = 686$ Hz. Duty cycle $= 11/21 = 52\\%$.',
      trap: 'Using $R_A + R_B$ in both halves gives 1.31 kHz-type answers.' },
    { id: 'oc-010', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'active filter',
      q: 'An inverting first-order low-pass filter has input resistor $1.59$ k$\\Omega$, and $15.9$ k$\\Omega$ in parallel with $10$ nF in the feedback path. Its DC gain and cut-off frequency are',
      options: ['$-10$ and about 1 kHz', '$-10$ and about 10 kHz', '$-1$ and about 1 kHz', '$-11$ and about 6.3 kHz'], answer: 0,
      sol: 'DC gain $= -R_f/R_1 = -10$. The pole is set by the feedback pair: $f_c = 1/(2\\pi R_fC_f) = 1/(2\\pi\\times15900\\times10^{-8}) = 1.00$ kHz. The input resistor does not enter the cut-off.',
      trap: 'Using the input resistor with $C$ gives 10 kHz.' },
    { id: 'oc-011', type: 'mcq', level: 2, exams: G, sub: 'log amplifier',
      q: 'A log amplifier uses a transistor in the feedback path, giving $V_o = -V_T\\ln[V_i/(RI_S)]$. At 300 K, each tenfold increase of the input changes the output by about',
      options: ['$-26$ mV', '$-0.6$ V', '$-10$ V', '$-60$ mV'], answer: 3,
      sol: '$\\Delta V_o = -V_T\\ln10 = -25.85\\times2.303 = -59.5$ mV per decade. The scale is temperature dependent, so practical log amps compensate $V_T$ and cancel $I_S$ with a matched second transistor.',
      trap: '26 mV is a factor $e$, not 10.' },
    { id: 'oc-012', type: 'mcq', level: 2, exams: G, sub: 'instrumentation',
      q: 'A three-op-amp instrumentation amplifier has first-stage resistors $R = 24.5$ k$\\Omega$ on each side, gain resistor $R_G = 500\\,\\Omega$ between them, and a unity-gain difference stage. Its differential gain is',
      options: ['50', '98', '49', '99'], answer: 3,
      sol: 'The input followers force the input difference across $R_G$, and the same current flows through both $R$, so the first stage gives $1 + 2R/R_G = 1 + 49000/500 = 99$. The difference stage multiplies by 1.',
      trap: 'Missing the 2 (both resistors carry the current) gives 50; missing the 1 gives 98.' },
    { id: 'oc-013', type: 'msq', level: 2, exams: G, sub: 'all-pass', format: 'multi',
      q: 'A first-order op-amp all-pass (phase-shift) circuit has transfer function $H = (1 - j\\omega RC)/(1 + j\\omega RC)$. Which statements are correct?',
      options: ['$|H| = 1$ at every frequency', 'Its phase goes from $0$ to $-180^\\circ$ as frequency rises', 'At $\\omega = 1/RC$ the phase is $-90^\\circ$', 'It amplifies one band of frequencies selectively'], answer: [0, 1, 2],
      sol: 'Numerator and denominator have equal magnitudes, so $|H| = 1$. The phase is $-2\\arctan(\\omega RC)$: 0 at DC, $-90^\\circ$ at $\\omega RC = 1$, $\\to-180^\\circ$ at high frequency. It changes only phase: useful for phase equalisation and quadrature oscillators.',
      trap: 'An all-pass filter passes all frequencies equally; its job is the phase.' },
    { id: 'oc-014', type: 'mcq', level: 2, exams: G, sub: 'current source',
      q: 'A balanced Howland current pump is driven by $V_{in}$ and has its four resistors chosen so the load current is $V_{in}/R$. Its main property is that the load current',
      options: ['depends on the load as $V_{in}/(R + R_L)$', 'is independent of the load resistance (within the output swing), and the load can be grounded', 'is limited to zero for grounded loads', 'flows only when $V_{in}$ is negative'], answer: 1,
      sol: 'Positive and negative feedback balance so the output resistance seen by the load is infinite: $I_L = V_{in}/R$ for any $R_L$ as long as the op-amp does not saturate. Unlike a simple floating-load V-to-I converter, the load can return to ground.',
      trap: 'Any resistor mismatch makes the output resistance finite (even negative).' },
    { id: 'oc-015', type: 'nat', level: 2, exams: G, sub: 'integrator', unit: 'V',
      q: 'An ideal op-amp integrator ($R = 10$ k$\\Omega$, $C = 0.1\\,\\mu$F) is driven by a symmetric $\\pm1$ V square wave of frequency $1$ kHz with no DC component. The peak-to-peak amplitude of the triangular output is ______ V.',
      answer: 0.5, tol: 0.005, calc: () => 1 * 0.5e-3 / (1e4 * 1e-7),
      sol: 'During each half period the input is constant, so the output ramps at $V/RC = 1/10^{-3} = 1000$ V/s for $T/2 = 0.5$ ms: a change of $0.5$ V. The output swings 0.5 V peak to peak.',
      trap: 'Using the full period gives 1 V.' },
    { id: 'oc-016', type: 'mcq', level: 2, exams: G, sub: 'differentiator',
      q: 'Why is a plain op-amp differentiator (capacitor in, resistor in feedback) rarely used without changes?',
      options: ['Its gain falls with frequency, so it loses signal', 'It needs a negative supply only', 'It cannot pass DC', 'Its gain rises with frequency, so it amplifies high-frequency noise and tends to ring or oscillate'], answer: 3,
      sol: '$|H| = \\omega RC$ grows without limit until the op-amp\'s own roll-off adds a second pole, giving a resonant peak. A small resistor in series with the input capacitor (and often a capacitor across $R_f$) limits the high-frequency gain.',
      trap: 'Not passing DC is the point of a differentiator, not a flaw.' },

    // ---------- level 3 ----------
    { id: 'oc-017', type: 'nat', level: 3, exams: G, sub: 'finite gain',
      q: 'A non-inverting amplifier is designed for a gain of $50$ ($1 + R_f/R_1 = 50$) using an op-amp with open-loop gain $2000$. Its actual gain is ______ (to two decimal places).',
      answer: 48.78, tol: 0.02, calc: () => 50 / (1 + 50 / 2000),
      sol: 'With $\\beta = 1/50$: $A_f = A/(1 + A\\beta) = 2000/(1 + 40) = 48.78$, that is $50/(1 + 50/2000)$. The error, 2.4%, is about the ideal gain divided by $A$.',
      trap: 'Assuming the ideal gain 50 when the loop gain is only 40.' },
    { id: 'oc-018', type: 'nat', level: 3, exams: G, sub: 'gain-bandwidth', unit: 'kHz',
      q: 'An op-amp with gain-bandwidth product $1$ MHz is used as an inverting amplifier of gain $-9$. Its closed-loop $-3$ dB bandwidth is ______ kHz.',
      answer: 100, tol: 0.5, calc: () => 1e3 / (1 + 9),
      sol: 'The bandwidth is set by the feedback factor $\\beta = R_1/(R_1 + R_f) = 1/10$, i.e. by the noise gain $1 + R_f/R_1 = 10$, not by the signal gain 9: $f_{-3} = \\text{GBW}\\times\\beta = 1\\text{ MHz}/10 = 100$ kHz.',
      trap: 'Dividing by the signal gain gives 111 kHz.' },
    { id: 'oc-019', type: 'mcq', level: 3, exams: G, sub: 'bias current',
      q: 'An inverting amplifier uses $R_1 = 10$ k$\\Omega$ and $R_f = 90$ k$\\Omega$. To cancel the output error caused by equal input bias currents, the resistor from the non-inverting input to ground should be',
      options: ['9 kΩ', '100 kΩ', '10 kΩ', '90 kΩ'], answer: 0,
      sol: 'With the input grounded, the inverting input sees $R_1\\parallel R_f$ to ground (through the source and the output, both low impedance). Equal bias currents then make equal voltages at the two inputs if $R_p = R_1\\parallel R_f = 10\\times90/100 = 9$ k$\\Omega$. What remains is set by the offset current.',
      trap: 'Using $R_1 + R_f$ or $R_1$ alone.' },
    { id: 'oc-020', type: 'nat', level: 3, exams: G, sub: 'bias current', unit: 'mV',
      q: 'An inverting amplifier has $R_f = 1$ M$\\Omega$ with the correct bias-compensation resistor fitted. The op-amp has bias current $100$ nA and offset current $10$ nA. The worst-case output error from these currents is ______ mV.',
      answer: 10, tol: 0.1, calc: () => 10e-9 * 1e6 * 1e3,
      sol: 'Without compensation the error would be $I_BR_f = 100$ mV. The compensation resistor cancels the common part of the bias currents, leaving only their difference: $I_{os}R_f = 10^{-8}\\times10^6 = 10$ mV.',
      trap: 'Quoting 100 mV, the uncompensated error.' },
    { id: 'oc-021', type: 'mcq', level: 3, exams: G, sub: 'active filter',
      q: 'A unity-gain Sallen-Key low-pass filter has two equal resistors; the capacitor from the middle node to the output is $2C$ and the capacitor from the non-inverting input to ground is $C$. Its quality factor is',
      options: ['0.5', '0.707', '1.0', '1.414'], answer: 1,
      sol: 'For the unity-gain Sallen-Key low-pass the denominator is $s^2R_1R_2C_1C_2 + sC_2(R_1 + R_2) + 1$, so $Q = \\sqrt{R_1R_2C_1C_2}/[C_2(R_1 + R_2)]$. With equal $R$: $Q = \\tfrac12\\sqrt{C_1/C_2} = \\tfrac12\\sqrt2 = 0.707$, a Butterworth response.',
      trap: 'Swapping the capacitors gives $Q = 0.354$.' },
    { id: 'oc-022', type: 'nat', level: 3, exams: G, sub: 'active filter',
      q: 'An equal-component Sallen-Key low-pass filter (equal $R$, equal $C$) has a non-inverting amplifier of gain $K$, giving $Q = 1/(3 - K)$. For a Butterworth response, $K$ must be ______ (to three decimal places).',
      answer: 1.586, tol: 0.002, calc: () => 3 - Math.SQRT2,
      sol: 'Butterworth needs $Q = 1/\\sqrt2$, so $3 - K = \\sqrt2$ and $K = 3 - 1.414 = 1.586$. At $K = 3$ the poles reach the imaginary axis and the filter oscillates.',
      trap: 'Setting $K = 1/\\sqrt2$.' },
    { id: 'oc-023', type: 'msq', level: 3, exams: G, sub: 'astable', format: 'multi',
      q: 'An op-amp astable multivibrator uses an $RC$ path to the inverting input and a resistive divider (fraction $\\beta$) to the non-inverting input, with symmetric output levels $\\pm V_{sat}$. Which statements are correct?',
      options: ['The output is a square wave', 'The capacitor voltage swings between $-\\beta V_{sat}$ and $+\\beta V_{sat}$', 'The period does not depend on $V_{sat}$', 'The duty cycle is 25%'], answer: [0, 1, 2],
      sol: 'The capacitor charges towards the output level until it crosses the threshold $\\pm\\beta V_{sat}$, then the output flips. Each half takes $RC\\ln[(1 + \\beta)/(1 - \\beta)]$, a ratio in which $V_{sat}$ cancels. With symmetric levels both halves are equal: 50% duty.',
      trap: 'Thinking a bigger supply makes it faster: both the threshold and the target scale together.' },
    { id: 'oc-024', type: 'nat', level: 3, exams: G, sub: 'log amplifier', unit: 'V',
      q: 'A log amplifier gives $V_o = -V_T\\ln[V_i/(RI_S)]$ with $R = 10$ k$\\Omega$, $I_S = 10^{-14}$ A and $V_T = 25.85$ mV. For $V_i = 1$ V, $|V_o|$ is ______ V (to three decimal places).',
      answer: 0.595, tol: 0.003, calc: () => VT * Math.log(1 / (1e4 * 1e-14)),
      sol: '$V_i/(RI_S) = 1/(10^4\\times10^{-14}) = 10^{10}$. $\\ln10^{10} = 23.03$. $|V_o| = 0.02585\\times23.03 = 0.595$ V.',
      trap: 'Using $\\log_{10}$ gives 0.26 V.' },
    { id: 'oc-025', type: 'mcq', level: 3, exams: G, sub: 'precision rectifier',
      q: 'A super-diode (op-amp follower with a diode inside the loop, load resistor to ground, non-inverting configuration) receives $+50$ mV and then $-50$ mV. The outputs across the load are',
      options: ['0 V and $-50$ mV', '0 V in both cases, because 50 mV is below the diode drop', '$+50$ mV and 0 V', '$+50$ mV and $-50$ mV'], answer: 2,
      sol: 'For positive input the op-amp drives the diode on and the loop forces the load voltage to equal the input: $+50$ mV. For negative input the diode is reverse biased, the loop opens, and the load is pulled to 0 V (the op-amp output swings to its negative rail, which is why fast precision rectifiers add a second diode).',
      trap: 'The diode drop is hidden inside the loop; it does not appear at the output.' },
    { id: 'oc-026', type: 'nat', level: 3, exams: G, sub: 'negative impedance', unit: 'kΩ',
      q: 'A negative impedance converter uses an op-amp as a non-inverting amplifier of gain $1 + R_2/R_1$ with $R_1 = 10$ k$\\Omega$ and $R_2 = 20$ k$\\Omega$; a $5$ k$\\Omega$ resistor connects the output back to the non-inverting input, which is the input terminal. The input resistance is ______ k$\\Omega$.',
      answer: -2.5, tol: 0.01, calc: () => -5 / (20 / 10),
      sol: 'Let the input be $v$. The output is $Kv$ with $K = 3$. The current into the input node is $i = (v - Kv)/Z = -2v/5\\text{ k}\\Omega$. So $Z_{in} = v/i = -Z/(K - 1) = -2.5$ k$\\Omega$: current flows out when the voltage is positive.',
      trap: 'Missing the sign: a negative resistance is the whole point.' },
    { id: 'oc-027', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: '555 timer',
      q: 'A 555 timer in monostable mode has $R = 100$ k$\\Omega$ and $C = 10\\,\\mu$F. The output pulse lasts about',
      options: ['0.69 s', '2.2 s', '11 s', '1.1 s'], answer: 3,
      sol: 'The capacitor charges from 0 towards $V_{CC}$ and the pulse ends at $2V_{CC}/3$: $t = RC\\ln3 = 1.1RC = 1.1\\times10^5\\times10^{-5} = 1.1$ s.',
      trap: '0.69RC belongs to the astable half periods (charging from 1/3 to 2/3).' },

    // ---------- level 4 ----------
    { id: 'oc-028', type: 'mcq', level: 4, exams: G, sub: 'difference amplifier',
      q: 'A four-resistor difference amplifier is designed for a gain of 10 ($R_2/R_1 = R_4/R_3 = 10$), but one resistor is 1% off. With an ideal op-amp, its CMRR is about',
      options: ['40 dB', 'about 61 dB', '80 dB', 'infinite, because the op-amp is ideal'], answer: 1,
      sol: 'With $R_4/R_3 = 10(1 + \\epsilon)$: $V_o = V_2\\dfrac{10(1 + \\epsilon)}{1 + 10(1 + \\epsilon)}\\times11 - 10V_1$. A common-mode input gives $A_{cm} = 11\\times10.1/11.1 - 10 = 0.0090$, about $G\\epsilon/(1 + G)$. $A_d\\approx10$, so CMRR $\\approx(1 + G)/\\epsilon = 1100$: about 61 dB. Resistor matching, not the op-amp, limits this circuit.',
      trap: 'An ideal op-amp does not make the circuit ideal: the bridge must balance.' },
    { id: 'oc-029', type: 'nat', level: 4, exams: G, sub: 'T-network',
      q: 'An inverting amplifier has input resistor $10$ k$\\Omega$ and a T-network in the feedback path: $100$ k$\\Omega$ from the inverting input to a node X, $100$ k$\\Omega$ from X to the output, and $1$ k$\\Omega$ from X to ground. The magnitude of the gain is ______.',
      answer: 1020, tol: 0, calc: () => (100 + 100 + 100 * 100 / 1) / 10,
      sol: 'The input current $v_i/10$k flows through the first 100 k to X, so $V_X = -10v_i$. KCL at X (resistances in k$\\Omega$): $v_i/10 = V_X/1 + (V_X - V_o)/100$, so $V_o/100 = -10v_i - 0.1v_i - 0.1v_i = -10.2v_i$ and $V_o = -1020v_i$. In general $|A| = (R_2 + R_3 + R_2R_3/R_4)/R_1 = (100 + 100 + 10000)/10 = 1020$. A large gain without megohm resistors.',
      trap: 'Ignoring the shunt resistor gives 20.' },
    { id: 'oc-030', type: 'nat', level: 4, exams: G, sub: 'Schmitt trigger', unit: 'V',
      q: 'A non-inverting Schmitt trigger feeds its input through $10$ k$\\Omega$ to the non-inverting terminal, with $100$ k$\\Omega$ from the output back to that terminal. The inverting terminal is held at $2.0$ V and the output saturates at $\\pm12$ V. The input must rise above ______ V to switch the output from low to high.',
      answer: 3.4, tol: 0.01, calc: () => (2 * 110 + 12 * 10) / 100,
      sol: 'Switching happens when $V_+ = 2$ V. $V_+ = \\dfrac{100V_{in} + 10V_o}{110}$. With the output low ($V_o = -12$ V): $100V_{in} = 220 + 120$, so $V_{in} = 3.4$ V. Falling, with $V_o = +12$ V, the threshold is $1.0$ V.',
      trap: 'Using $V_o = +12$ V for the rising edge: before switching, the output is low.' },
    { id: 'oc-031', type: 'mcq', level: 4, exams: G, sub: 'slew rate',
      q: 'An op-amp has gain-bandwidth product $4$ MHz and slew rate $2$ V/μs. As a non-inverting amplifier of gain 20 it must deliver an undistorted sine of $5$ V peak. The highest usable frequency is about',
      options: ['63.7 kHz', '200 kHz', '127 kHz', '4 MHz'], answer: 0,
      sol: 'Small-signal bandwidth $= 4\\text{ MHz}/20 = 200$ kHz. Slew limit: the steepest slope of $V_p\\sin\\omega t$ is $\\omega V_p$, so $f\\le SR/(2\\pi V_p) = 2\\times10^6/(2\\pi\\times5) = 63.7$ kHz. The smaller limit applies.',
      trap: 'Checking only the gain-bandwidth limit.' },
    { id: 'oc-032', type: 'msq', level: 4, exams: G, sub: 'integrator', format: 'multi',
      q: 'A practical op-amp integrator has a large resistor $R_p$ placed across its capacitor. Which statements are correct?',
      options: ['Without $R_p$, input offset voltage and bias current drive the output slowly into saturation', '$R_p$ limits the DC gain to $-R_p/R$', 'Below $f = 1/(2\\pi R_pC)$ the circuit no longer integrates', 'The integrator\'s gain rises with frequency, so it amplifies high-frequency noise'], answer: [0, 1, 2],
      sol: 'An ideal integrator has infinite DC gain, so any DC error ramps forever. The resistor turns it into a lossy integrator (a low-pass filter) whose integration starts above its corner $1/(2\\pi R_pC)$. Integrator gain falls with frequency ($1/\\omega RC$), so it suppresses noise; rising gain belongs to the differentiator.',
      trap: 'Confusing the integrator with the differentiator.' },
    { id: 'oc-033', type: 'nat', level: 4, exams: G, sub: 'astable', unit: 'kHz',
      q: 'An op-amp astable has $R = 4.7$ k$\\Omega$, $C = 10$ nF and a divider with $10$ k$\\Omega$ from output to the non-inverting input and $30$ k$\\Omega$ from there to ground. Its frequency is ______ kHz (to two decimal places).',
      answer: 5.47, tol: 0.02, calc: () => 1 / (2 * 4.7e3 * 1e-8 * Math.log(1.75 / 0.25)) / 1e3,
      sol: '$\\beta = 30/(10 + 30) = 0.75$. $T = 2RC\\ln\\dfrac{1 + \\beta}{1 - \\beta} = 2\\times4.7\\times10^{-5}\\times\\ln7 = 9.4\\times10^{-5}\\times1.946 = 1.829\\times10^{-4}$ s, so $f = 5.47$ kHz.',
      trap: 'Taking $\\beta = 10/40$ (the wrong resistor on top) gives 16.4 kHz.' },
    { id: 'oc-034', type: 'mcq', level: 4, exams: G, sub: 'active filter',
      q: 'A second-order low-pass filter has $Q = 2$. At its natural frequency, its gain relative to the DC gain is',
      options: ['$+6$ dB', '$-3$ dB', '0 dB', '$+3$ dB'], answer: 0,
      sol: '$H(j\\omega_0) = H_0/(j/Q)$, so $|H(\\omega_0)|/H_0 = Q = 2$, that is $+6$ dB. Only $Q = 0.707$ gives $-3$ dB at $\\omega_0$; high-$Q$ filters peak.',
      trap: '$-3$ dB at the natural frequency is a Butterworth special case.' },
    { id: 'oc-035', type: 'nat', level: 4, exams: G, sub: 'log amplifier', unit: 'mV',
      q: 'A log amplifier with $V_o = -V_T\\ln(V_i/V_{ref})$ at 300 K ($V_T = 25.85$ mV) has its input rise from $10$ mV to $1$ V. The magnitude of the change in output is ______ mV (to one decimal place).',
      answer: 119.1, tol: 0.3, calc: () => VT * Math.log(100) * 1000,
      sol: '$\\Delta V_o = -V_T\\ln(1/0.01) = -25.85\\times4.605 = -119.1$ mV: two decades, about 59.5 mV each. $V_{ref}$ cancels in the difference.',
      trap: 'Taking 26 mV per decade.' },
    { id: 'oc-036', type: 'mcq', level: 4, exams: G, sub: 'gyrator',
      q: 'An op-amp gyrator built with two resistors $R_1$, $R_2$ and a capacitor $C$ makes the input look like a grounded inductor. Its equivalent inductance is',
      options: ['$C/(R_1R_2)$', '$R_1R_2/C$', '$R_1R_2C$', '$(R_1 + R_2)C$'], answer: 2,
      sol: 'A gyrator inverts an impedance: $Z_{in} = R_1R_2/Z_C = R_1R_2\\cdot j\\omega C$, which is the impedance of an inductor $L = R_1R_2C$. With 10 k$\\Omega$, 10 k$\\Omega$ and 100 nF it simulates 10 H, impossible to wind compactly.',
      trap: 'Check the units: $\\Omega^2\\,$F $= \\Omega\\,$s $=$ H.' },

    // ---------- level 5 ----------
    { id: 'oc-037', type: 'nat', level: 5, exams: G, sub: 'finite gain', unit: '×10³',
      q: 'An inverting amplifier with ideal gain $-100$ must have a gain error no larger than $0.1\\%$. The smallest open-loop gain the op-amp can have is ______ $\\times10^3$ (to the nearest whole number).',
      answer: 101, tol: 0.5, calc: () => 101 / 0.001 / 1e3,
      sol: 'With finite $A$: $A_f = -\\dfrac{R_f/R_1}{1 + (1 + R_f/R_1)/A}$. The error factor is $1 + 101/A\\le1.001$, so $A\\ge101/0.001 = 1.01\\times10^5$, that is 101 thousand.',
      trap: 'Using the signal gain 100 instead of the noise gain 101.' },
    { id: 'oc-038', type: 'msq', level: 5, exams: G, sub: 'instrumentation', format: 'multi',
      q: 'Which statements about the three-op-amp instrumentation amplifier are correct?',
      options: ['Its gain can be set with one resistor $R_G$', 'Both inputs present very high input impedance', 'Raising the first-stage gain improves the overall CMRR, because the first stage passes common-mode signals with unity gain', 'It relies on positive feedback for its high gain'], answer: [0, 1, 2],
      sol: 'The first stage amplifies the difference by $1 + 2R/R_G$ while a common-mode signal appears at both outputs unchanged (no current in $R_G$). So the differential signal reaching the difference stage is larger while the common-mode is not: CMRR improves by the first-stage gain. Inputs go straight to non-inverting terminals. All feedback is negative.',
      trap: 'Thinking CMRR depends only on the difference stage.' },
    { id: 'oc-039', type: 'nat', level: 5, exams: G, sub: 'active filter',
      q: 'A unity-gain Sallen-Key low-pass filter has $R_1 = 10$ k$\\Omega$, $R_2 = 20$ k$\\Omega$, feedback capacitor $C_1 = 10$ nF (middle node to output) and $C_2 = 10$ nF (non-inverting input to ground). Its quality factor is ______ (to three decimal places).',
      answer: 0.471, tol: 0.003, calc: () => Math.sqrt(1e4 * 2e4 * 1e-8 * 1e-8) / (1e-8 * 3e4),
      sol: 'Denominator: $s^2R_1R_2C_1C_2 + sC_2(R_1 + R_2) + 1$. So $\\omega_0 = 1/\\sqrt{R_1R_2C_1C_2} = 1/(1.414\\times10^{-4}$ s$)$ (1125 Hz) and $Q = \\omega_0^{-1}/[C_2(R_1 + R_2)] = 1.414\\times10^{-4}/(3\\times10^{-4}) = 0.471$. Equal capacitors at unity gain can never exceed $Q = 0.5$.',
      trap: 'Using $C_1(R_1 + R_2)$ in the damping term.' },
    { id: 'oc-040', type: 'mcq', level: 5, exams: G, sub: 'comparator',
      q: 'A sine wave of amplitude $1$ V is applied to a comparator whose threshold is $+0.5$ V. The fraction of each cycle for which the output is high (input above threshold) is',
      options: ['50%', '25%', '33.3%', '16.7%'], answer: 2,
      sol: '$\\sin\\theta > 0.5$ for $30^\\circ < \\theta < 150^\\circ$: 120° out of 360°, so one third, 33.3%. Raising the threshold narrows the pulses: a crude pulse-width modulator.',
      trap: 'Assuming the duty cycle scales linearly with threshold (25%).' },
    ...more2,
  ],
  gens: [
    { id: 'oc-g01', type: 'nat', level: 3, exams: G, sub: 'Schmitt trigger',
      make(r) {
        const R = pick(r, 5, 20, 1), Rf = pick(r, 20, 150, 10), Vref = pick(r, -2, 3, 0.5), Vs = pick(r, 10, 15, 1), ask = choose(r, ['upper', 'lower', 'width']);
        const c = Vref * Rf / (R + Rf), h = Vs * R / (R + Rf), val = ask === 'upper' ? c + h : ask === 'lower' ? c - h : 2 * h;
        const what = ask === 'upper' ? 'upper threshold' : ask === 'lower' ? 'lower threshold' : 'hysteresis width (upper minus lower threshold)';
        return { q: `An inverting Schmitt trigger has its input on the inverting terminal. The non-inverting terminal connects to a reference of $${Vref}$ V through $${R}$ k$\\Omega$ and to the output through $${Rf}$ k$\\Omega$. The output saturates at $\\pm${Vs}$ V. The ${what} is ______ V (to three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.002, round(Math.abs(val) * 0.003, 3)), unit: 'V', R, Rf, Vref, Vs, ask,
          sol: `$V_+ = V_{ref}\\dfrac{${Rf}}{${R + Rf}} + V_o\\dfrac{${R}}{${R + Rf}} = ${round(c, 4)} \\pm ${round(h, 4)}$ V. Upper threshold $${round(c + h, 3)}$ V, lower $${round(c - h, 3)}$ V, width $${round(2 * h, 3)}$ V.`,
          trap: 'Taking the window centre to be $V_{ref}$ itself; the divider scales it.' };
      },
      verify: (p) => { const c = p.Vref * p.Rf / (p.R + p.Rf), h = p.Vs * p.R / (p.R + p.Rf); return p.ask === 'upper' ? c + h : p.ask === 'lower' ? c - h : 2 * h; } },
    { id: 'oc-g02', type: 'nat', level: 3, exams: G, sub: 'astable',
      make(r) {
        const R = pick(r, 1, 100, 1), C = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]), R1 = pick(r, 5, 50, 5), R2 = pick(r, 5, 50, 5);
        const b = R2 / (R1 + R2), T = 2 * R * 1e3 * C * 1e-9 * Math.log((1 + b) / (1 - b)), f = 1 / T;
        return { q: `An op-amp astable multivibrator has timing resistor $${R}$ k$\\Omega$ and capacitor $${C}$ nF. Its threshold divider has $${R1}$ k$\\Omega$ from the output to the non-inverting input and $${R2}$ k$\\Omega$ from there to ground; the output swings symmetrically. The frequency is ______ Hz (to the nearest whole number).`,
          answer: Math.round(f), tol: Math.max(1, Math.round(f * 0.004)), unit: 'Hz', R, C, R1, R2,
          sol: `$\\beta = ${R2}/(${R1} + ${R2}) = ${round(b, 4)}$. $T = 2RC\\ln\\dfrac{1 + \\beta}{1 - \\beta} = 2\\times${R}\\times10^3\\times${C}\\times10^{-9}\\times${round(Math.log((1 + b) / (1 - b)), 4)} = ${round(T * 1e3, 4)}$ ms, so $f = ${Math.round(f)}$ Hz.`,
          trap: 'Inverting the divider ratio, or using one half period.' };
      },
      verify: (p) => { const b = p.R2 / (p.R1 + p.R2); return 1 / (2 * p.R * 1e3 * p.C * 1e-9 * Math.log((1 + b) / (1 - b))); } },
    { id: 'oc-g03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: '555 timer',
      make(r) {
        const RA = pick(r, 1, 20, 1), RB = pick(r, 1, 50, 1), C = choose(r, [0.01, 0.022, 0.047, 0.1, 0.22, 0.47, 1]), ask = r() < 0.6 ? 'f' : 'duty';
        const f = 1 / (Math.LN2 * (RA + 2 * RB) * 1e3 * C * 1e-6), duty = (RA + RB) / (RA + 2 * RB) * 100, val = ask === 'f' ? f : duty;
        return { q: `A 555 timer runs as an astable with $R_A = ${RA}$ k$\\Omega$, $R_B = ${RB}$ k$\\Omega$ and $C = ${C}\\,\\mu$F. ${ask === 'f' ? 'Its frequency is ______ Hz (to the nearest whole number).' : 'Its duty cycle (fraction of the period the output is high) is ______ % (to one decimal place).'}`,
          answer: ask === 'f' ? Math.round(f) : round(duty, 1), tol: ask === 'f' ? Math.max(1, Math.round(f * 0.004)) : 0.1, RA, RB, C, ask,
          sol: `High time $t_H = 0.693(R_A + R_B)C$, low time $t_L = 0.693R_BC$ (the capacitor moves between $V_{CC}/3$ and $2V_{CC}/3$). $T = 0.693(R_A + 2R_B)C = ${round(Math.LN2 * (RA + 2 * RB) * C, 4)}$ ms, so $f = ${Math.round(f)}$ Hz. Duty $= (R_A + R_B)/(R_A + 2R_B) = ${round(duty, 1)}\\%$.`,
          trap: 'The duty cycle of this circuit is always above 50%: the high time includes $R_A$.' };
      },
      verify: (p) => (p.ask === 'f' ? 1 / (Math.LN2 * (p.RA + 2 * p.RB) * 1e3 * p.C * 1e-6) : (p.RA + p.RB) / (p.RA + 2 * p.RB) * 100) },
    { id: 'oc-g04', type: 'nat', level: 3, exams: G, sub: 'finite gain',
      make(r) {
        const inv = r() < 0.5, G0 = choose(r, [5, 10, 20, 50, 100, 200, 500]), A = choose(r, [1e3, 2e3, 5e3, 1e4, 5e4, 1e5]);
        const noise = inv ? 1 + G0 : G0, act = G0 / (1 + noise / A);
        return { q: `An ${inv ? `inverting amplifier with $R_f/R_1 = ${G0}$` : `non-inverting amplifier with $1 + R_f/R_1 = ${G0}$`} uses an op-amp of open-loop gain $${A}$. The magnitude of its actual closed-loop gain is ______ (to three decimal places).`,
          answer: round(act, 3), tol: Math.max(0.002, round(act * 0.0005, 3)), inv, G0, A,
          sol: `The feedback factor is $\\beta = 1/${noise}$ (noise gain $${noise}$). $|A_f| = \\dfrac{${G0}}{1 + ${noise}/${A}} = ${round(act, 3)}$.`,
          trap: inv ? 'Using the signal gain instead of the noise gain $1 + R_f/R_1$ in the error term.' : 'Assuming the ideal gain.' };
      },
      verify: (p) => p.G0 / (1 + (p.inv ? 1 + p.G0 : p.G0) / p.A) },
    { id: 'oc-g05', type: 'nat', level: 3, exams: G, sub: 'gain-bandwidth',
      make(r) {
        const inv = r() < 0.5, Gs = choose(r, [1, 2, 4, 5, 9, 10, 19, 20, 49, 99]), GBW = choose(r, [0.5, 1, 3, 4, 10, 20]);
        const noise = inv ? 1 + Gs : Gs, bw = GBW * 1e3 / noise;
        return { q: `An op-amp with gain-bandwidth product $${GBW}$ MHz is used as ${inv ? `an inverting amplifier of gain $-${Gs}$` : `a non-inverting amplifier of gain $${Gs}$`}. Its closed-loop $-3$ dB bandwidth is ______ kHz (to one decimal place).`,
          answer: round(bw, 1), tol: Math.max(0.1, round(bw * 0.003, 1)), unit: 'kHz', inv, Gs, GBW,
          sol: `Bandwidth $= \\text{GBW}\\times\\beta$ with $1/\\beta$ the noise gain ${inv ? `$1 + R_f/R_1 = ${noise}$` : `$= ${noise}$`}: $${GBW}\\text{ MHz}/${noise} = ${round(bw, 1)}$ kHz.`,
          trap: inv ? 'Dividing by the signal gain instead of the noise gain.' : 'Mixing MHz and kHz.' };
      },
      verify: (p) => p.GBW * 1e3 / (p.inv ? 1 + p.Gs : p.Gs) },
    { id: 'oc-g06', type: 'nat', level: 4, exams: G, sub: 'slew rate',
      make(r) {
        const GBW = choose(r, [1, 3, 4, 10, 20]), Gn = choose(r, [2, 5, 10, 20, 50]), SR = choose(r, [0.5, 1, 2, 5, 13, 20]), Vp = pick(r, 1, 12, 1);
        const fbw = GBW * 1e3 / Gn, fsr = SR * 1e6 / (2 * Math.PI * Vp) / 1e3, f = Math.min(fbw, fsr);
        return { q: `An op-amp (GBW $${GBW}$ MHz, slew rate $${SR}$ V/μs) is used as a non-inverting amplifier of gain $${Gn}$ and must deliver an undistorted sine of $${Vp}$ V peak. The highest usable frequency is ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.004, 1)), unit: 'kHz', GBW, Gn, SR, Vp,
          sol: `Small-signal limit: $${GBW}\\text{ MHz}/${Gn} = ${round(fbw, 1)}$ kHz. Slew limit: $SR/(2\\pi V_p) = ${SR}\\times10^6/(2\\pi\\times${Vp}) = ${round(fsr, 1)}$ kHz. The ${fbw < fsr ? 'bandwidth' : 'slew rate'} limit is lower: $${round(f, 1)}$ kHz.`,
          trap: 'Checking only one of the two limits.' };
      },
      verify: (p) => Math.min(p.GBW * 1e3 / p.Gn, p.SR * 1e6 / (2 * Math.PI * p.Vp) / 1e3) },
    { id: 'oc-g07', type: 'nat', level: 3, exams: G, sub: 'log amplifier',
      make(r) {
        const T = choose(r, [290, 300, 310, 330]), V1 = choose(r, [0.001, 0.005, 0.01, 0.05, 0.1]), m = choose(r, [10, 20, 50, 100, 1000]);
        const Vt = 8.617333e-5 * T, d = Vt * Math.log(m) * 1000;
        return { q: `A log amplifier gives $V_o = -V_T\\ln(V_i/V_{ref})$ at $${T}$ K. Its input changes from $${V1}$ V to $${round(V1 * m, 4)}$ V. The magnitude of the change in output is ______ mV (to one decimal place).`,
          answer: round(d, 1), tol: Math.max(0.1, round(d * 0.004, 1)), unit: 'mV', T, m,
          sol: `$V_T = k_BT/q = ${round(Vt * 1000, 3)}$ mV. $|\\Delta V_o| = V_T\\ln(${m}) = ${round(Vt * 1000, 3)}\\times${round(Math.log(m), 4)} = ${round(d, 1)}$ mV. $V_{ref}$ cancels.`,
          trap: 'Using $\\log_{10}$ instead of $\\ln$.' };
      },
      verify: (p) => 8.617333e-5 * p.T * Math.log(p.m) * 1000 },
    { id: 'oc-g08', type: 'nat', level: 2, exams: G, sub: 'integrator',
      make(r) {
        const V = pick(r, 0.5, 5, 0.5), f = choose(r, [100, 200, 500, 1000, 2000, 5000]), R = pick(r, 1, 100, 1), C = choose(r, [1, 10, 22, 47, 100]);
        const tau = R * 1e3 * C * 1e-9, pp = V / (2 * f) / tau;
        return { q: `An ideal integrator with $R = ${R}$ k$\\Omega$ and $C = ${C}$ nF is driven by a symmetric $\\pm${V}$ V square wave at $${f}$ Hz (no DC). The peak-to-peak amplitude of its triangular output is ______ V (to three decimal places).`,
          answer: round(pp, 3), tol: Math.max(0.002, round(pp * 0.003, 3)), unit: 'V', V, f, R, C,
          sol: `$RC = ${round(tau * 1e3, 5)}$ ms. Each half period ($${round(1e3 / (2 * f), 4)}$ ms) the output ramps by $V\\cdot(T/2)/RC = ${V}\\times${round(1 / (2 * f), 6)}/${round(tau, 7)} = ${round(pp, 3)}$ V.`,
          trap: 'Integrating over the whole period doubles the answer.' };
      },
      verify: (p) => p.V / (2 * p.f) / (p.R * p.C * 1e-6) },
    { id: 'oc-g09', type: 'nat', level: 4, exams: G, sub: 'active filter',
      make(r) {
        const R1 = pick(r, 1, 50, 1), R2 = pick(r, 1, 50, 1), C1 = choose(r, [1, 2.2, 4.7, 10, 22]), C2 = choose(r, [1, 2.2, 4.7, 10]), ask = r() < 0.5 ? 'f' : 'Q';
        const s = Math.sqrt(R1 * R2 * C1 * C2) * 1e-6, f0 = 1 / (2 * Math.PI * s), Q = s / (C2 * (R1 + R2) * 1e-6);
        const val = ask === 'f' ? f0 : Q;
        return { q: `A unity-gain Sallen-Key low-pass filter has $R_1 = ${R1}$ k$\\Omega$, $R_2 = ${R2}$ k$\\Omega$, $C_1 = ${C1}$ nF (from the middle node to the output) and $C_2 = ${C2}$ nF (from the non-inverting input to ground). ${ask === 'f' ? 'Its natural frequency is ______ Hz (to the nearest whole number).' : 'Its quality factor is ______ (to three decimal places).'}`,
          answer: ask === 'f' ? Math.round(f0) : round(Q, 3), tol: ask === 'f' ? Math.max(1, Math.round(f0 * 0.003)) : Math.max(0.002, round(Q * 0.004, 3)), R1, R2, C1, C2, ask,
          sol: `Denominator $s^2R_1R_2C_1C_2 + sC_2(R_1 + R_2) + 1$. $\\sqrt{R_1R_2C_1C_2} = ${round(s * 1e6, 4)}\\times10^{-6}$ s, so $f_0 = ${Math.round(f0)}$ Hz and $Q = \\sqrt{R_1R_2C_1C_2}/[C_2(R_1 + R_2)] = ${round(Q, 3)}$.`,
          trap: 'Putting $C_1$ instead of $C_2$ in the damping term.' };
      },
      verify: (p) => { const s = Math.sqrt(p.R1 * p.R2 * p.C1 * p.C2) * 1e-6; return p.ask === 'f' ? 1 / (2 * Math.PI * s) : s / (p.C2 * (p.R1 + p.R2) * 1e-6); } },
    { id: 'oc-g10', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'circuit recognition',
      make(r) {
        const C = [
          ['a resistor to the inverting input and a capacitor from output to inverting input (non-inverting input grounded)', 'integrator'],
          ['a capacitor to the inverting input and a resistor from output to inverting input', 'differentiator'],
          ['a transistor (or diode) in the feedback path and a resistor at the input', 'logarithmic amplifier'],
          ['feedback from the output to the non-inverting input only, input on the inverting terminal', 'Schmitt trigger (regenerative comparator)'],
          ['a capacitor from the inverting input to ground, a resistor from output to inverting input, and a divider from output to the non-inverting input', 'astable multivibrator'],
          ['a diode inside the loop of a voltage follower, load to ground', 'precision half-wave rectifier'],
          ['two input followers, a gain resistor between them and a difference stage', 'instrumentation amplifier'],
        ];
        const idx = shuffle(r, C.map((_, i) => i)).slice(0, 4);
        const pickI = idx[0], options = shuffle(r, idx).map((i) => C[i][1]);
        return { q: `An op-amp circuit has ${C[pickI][0]}. It is a`, options, answer: options.indexOf(C[pickI][1]),
          sol: `This arrangement is the standard ${C[pickI][1]}. Integrator: $R$ in, $C$ in feedback, $v_o = -\\tfrac1{RC}\\int v_i\\,dt$. Differentiator: the reverse. Log amp: the exponential $I$-$V$ law in the feedback path. Positive feedback only: Schmitt trigger; add an $RC$ to the inverting input and it oscillates (astable).`,
          trap: 'Swapping the integrator and differentiator: the capacitor in the feedback path integrates.' };
      } },
    { id: 'oc-g11', type: 'nat', level: 3, exams: G, sub: 'comparator',
      make(r) {
        const A = pick(r, 1, 10, 1), frac = choose(r, [-0.8, -0.5, -0.3, 0, 0.2, 0.3, 0.5, 0.7, 0.9]), Vth = round(A * frac, 2);
        const duty = (Math.PI - 2 * Math.asin(Vth / A)) / (2 * Math.PI) * 100;
        return { q: `A sine wave of amplitude $${A}$ V drives a comparator with threshold $${Vth}$ V. The output is high while the input exceeds the threshold. The duty cycle is ______ % (to one decimal place).`,
          answer: round(duty, 1), tol: 0.1, unit: '%', A, Vth,
          sol: `The input exceeds $V_{th}$ for $\\theta_0 < \\theta < \\pi - \\theta_0$ with $\\theta_0 = \\arcsin(${Vth}/${A}) = ${round(Math.asin(Vth / A) * 180 / Math.PI, 3)}^\\circ$. Fraction $= (180^\\circ - 2\\theta_0)/360^\\circ = ${round(duty, 1)}\\%$.`,
          trap: 'Assuming the duty cycle changes linearly with the threshold.' };
      },
      verify: (p) => (Math.PI - 2 * Math.asin(p.Vth / p.A)) / (2 * Math.PI) * 100 },
    { id: 'oc-g12', type: 'nat', level: 4, exams: G, sub: 'negative impedance',
      make(r) {
        const R1 = pick(r, 1, 20, 1), R2 = pick(r, 1, 40, 1), Z = pick(r, 1, 50, 1);
        const zin = -Z * R1 / R2;
        return { q: `A negative impedance converter uses a non-inverting op-amp stage of gain $1 + R_2/R_1$ with $R_1 = ${R1}$ k$\\Omega$ and $R_2 = ${R2}$ k$\\Omega$; a $${Z}$ k$\\Omega$ resistor runs from the output back to the non-inverting input, which is the circuit\'s input. The input resistance is ______ k$\\Omega$ (to three decimal places).`,
          answer: round(zin, 3), tol: Math.max(0.002, round(Math.abs(zin) * 0.003, 3)), unit: 'kΩ', R1, R2, Z,
          sol: `$v_o = Kv$ with $K = 1 + ${R2}/${R1}$. Input current $i = (v - Kv)/Z$, so $Z_{in} = -Z/(K - 1) = -ZR_1/R_2 = ${round(zin, 3)}$ k$\\Omega$.`,
          trap: 'Dropping the minus sign.' };
      },
      verify: (p) => -p.Z * p.R1 / p.R2 },
    ...more,
  ],
};
