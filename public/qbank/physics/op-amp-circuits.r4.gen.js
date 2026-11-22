// Round 4 extras for op-amp-circuits: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'oc-r4-01', type: 'mcq', level: 1, exams: A, sub: 'summing amplifier',
      q: R`An ideal inverting summing amplifier has feedback resistor $10$ k$\Omega$. Input $V_1 = 1.0$ V enters through $10$ k$\Omega$ and input $V_2 = 0.5$ V through $5$ k$\Omega$. The output is`,
      options: [R`$-1.5$ V`, R`$-2.0$ V`, R`$+2.0$ V`, R`$-0.75$ V`], answer: 1,
      sol: R`The inverting input is a virtual ground, so each input sends $V_i/R_i$ into the summing node: $1.0/10 + 0.5/5 = 0.1 + 0.1 = 0.2$ mA. All of it flows through $R_f$: $V_o = -0.2\text{ mA}\times10\text{ k}\Omega = -2.0$ V.`,
      trap: R`Adding the input voltages directly ($-1.5$ V) ignores that the $5$ k$\Omega$ input is weighted twice as strongly.` },
    { id: 'oc-r4-02', type: 'mcq', level: 2, exams: A, sub: 'inverting amplifier',
      q: R`An inverting amplifier with an ideal op-amp has $R_1 = 1.0$ k$\Omega$ and $R_f = 100$ k$\Omega$. It is driven by a signal source whose internal resistance is $1.0$ k$\Omega$. The gain from the source's open-circuit voltage to the output is`,
      options: [R`$-100$`, R`$-99$`, R`$-50$`, R`$-101$`], answer: 2,
      sol: R`The input resistance of an inverting amplifier is only $R_1$, because the inverting input is a virtual ground. The source resistance adds in series: the current is $v_s/(1 + 1)\text{ k}\Omega$, so $v_o = -100v_s/2 = -50v_s$. A non-inverting stage or a buffer in front would avoid this loss.`,
      trap: R`Treating the amplifier's input resistance as infinite, as for a non-inverting amplifier.` },
    { id: 'oc-r4-03', type: 'nat', level: 2, exams: A, sub: 'summing amplifier',
      q: R`Two voltages, $V_1 = 1.0$ V and $V_2 = 3.0$ V, are each connected through a $10$ k$\Omega$ resistor to the non-inverting input of an ideal op-amp (nothing else is connected to that input). The op-amp has $R_1 = 10$ k$\Omega$ from its inverting input to ground and $R_f = 20$ k$\Omega$ from the output to its inverting input. The output is ______ V.`,
      answer: 6.0, tol: 0.01, calc: () => ((1 + 3) / 2) * (1 + 20 / 10),
      sol: R`No current enters the non-inverting input, so the two equal resistors average the inputs: $V_+ = (1.0 + 3.0)/2 = 2.0$ V (superposition, or Millman's theorem). The stage has gain $1 + R_f/R_1 = 3$, so $V_o = 6.0$ V.`,
      trap: R`Applying the gain to the sum $4.0$ V, as if it were an inverting summer, gives $12$ V.` },
    { id: 'oc-r4-04', type: 'nat', level: 3, exams: G, sub: 'CMRR',
      q: R`A difference amplifier has differential gain $10$ and a common-mode rejection ratio of $80$ dB. Both inputs sit at $5.0$ V (no differential signal). The output error caused by the common-mode voltage is ______ mV.`,
      answer: 5.0, tol: 0.05, calc: () => 10 * 5.0 / 1e4 * 1000,
      sol: R`$80$ dB means $\text{CMRR} = A_d/A_{cm} = 10^{80/20} = 10^4$. So $A_{cm} = 10/10^4 = 10^{-3}$, and the output error is $A_{cm}V_{cm} = 10^{-3}\times5.0$ V $= 5.0$ mV. Referred to the input that is $0.5$ mV, i.e. $V_{cm}/\text{CMRR}$.`,
      trap: R`Converting 80 dB with $10^{80/10}$ (a power ratio) gives an error 100 times too small.` },
    { id: 'oc-r4-05', type: 'nat', level: 3, exams: G, sub: 'output resistance',
      q: R`An op-amp has open-loop gain $10^5$ and open-loop output resistance $75\ \Omega$. It is wired as a non-inverting amplifier of gain $100$. Its closed-loop output resistance is ______ m$\Omega$ (to one decimal place).`,
      answer: 74.9, tol: 0.1, calc: () => 75 / (1 + 1e5 / 100) * 1000,
      sol: R`The feedback samples the output voltage (shunt sampling), which divides the output resistance by $1 + A\beta$. Here $\beta = 1/100$ and $A\beta = 10^5/100 = 1000$: $R_{out} = 75/1001 = 0.0749\ \Omega = 74.9$ m$\Omega$. At high frequency $A$ falls and the output resistance rises again.`,
      trap: R`Dividing by $A$ alone (giving $0.75$ m$\Omega$) forgets that only the loop gain $A\beta$ counts.` },
    { id: 'oc-r4-06', type: 'mcq', level: 2, exams: A, sub: 'voltage regulator',
      q: R`In a series voltage regulator an op-amp drives a pass transistor so that a fraction of the output, taken from a divider with $R_2 = 22$ k$\Omega$ (output to feedback node) and $R_1 = 10$ k$\Omega$ (feedback node to ground), equals a $2.5$ V reference at the other op-amp input. The regulated output is`,
      options: [R`$5.5$ V`, R`$2.5$ V`, R`$7.3$ V`, R`$8.0$ V`], answer: 3,
      sol: R`The loop forces the divided output to equal the reference: $V_{out}R_1/(R_1 + R_2) = 2.5$ V, so $V_{out} = 2.5(1 + 22/10) = 8.0$ V. The circuit is a non-inverting amplifier of the reference, with the transistor supplying the load current.`,
      trap: R`$2.5\times22/10 = 5.5$ V uses $R_2/R_1$ instead of $1 + R_2/R_1$.` },
    { id: 'oc-r4-07', type: 'mcq', level: 2, exams: A, sub: 'log and antilog',
      q: R`Two log amplifiers produce outputs proportional to $\ln(V_1/V_{ref})$ and $\ln(V_2/V_{ref})$ (with $V_1, V_2 > 0$). Their outputs are added by a summing amplifier, and the sum drives an antilog (exponential) amplifier. Apart from a constant scale factor, the final output is proportional to`,
      options: [R`$V_1V_2$`, R`$V_1 + V_2$`, R`$\ln(V_1V_2)$`, R`$V_1/V_2$`], answer: 0,
      sol: R`$\ln(V_1/V_{ref}) + \ln(V_2/V_{ref}) = \ln(V_1V_2/V_{ref}^2)$, and the antilog stage undoes the logarithm, giving an output $\propto V_1V_2$. This is an analogue multiplier; replacing the adder by a difference amplifier would divide instead. The inputs must stay positive, since a log amplifier only works in one quadrant.`,
      trap: R`$V_1/V_2$ would need a subtractor, not an adder, before the antilog stage.` },
    { id: 'oc-r4-08', type: 'msq', level: 3, exams: G, sub: 'DC errors', format: 'statements',
      q: R`An op-amp amplifier has input offset voltage $V_{os}$, input bias currents $I_{B+}$ and $I_{B-}$, and resistors $R_1$ (input) and $R_f$ (feedback). Which statements are correct?`,
      options: [R`$V_{os}$ appears at the output multiplied by the noise gain $1 + R_f/R_1$, whether the circuit is used as an inverting or a non-inverting amplifier.`, R`The output error due to bias currents is reduced by giving both inputs the same DC source resistance, $R_1\parallel R_f$ at the non-inverting input.`, R`Drift of $V_{os}$ with temperature cannot be removed by a single trim at room temperature.`, R`The input offset current is the sum $I_{B+} + I_{B-}$.`], answer: [0, 1, 2],
      sol: R`For DC errors the signal source is set to zero, and $V_{os}$ then sits in series with the non-inverting input of a gain $1 + R_f/R_1$ stage in both configurations. With equal DC resistances, the two bias currents produce nearly equal and opposite effects and only their difference, the offset current $I_{os} = |I_{B+} - I_{B-}|$, remains: error $I_{os}R_f$. A trim nulls $V_{os}$ at one temperature only; the drift (μV/K) stays.`,
      trap: R`The offset current is the difference of the bias currents; their average is the bias current.` },
    { id: 'oc-r4-09', type: 'msq', level: 4, exams: G, sub: 'comparators', format: 'statements',
      q: R`Which statements about comparators and op-amps used as comparators are correct?`,
      options: [R`A general-purpose op-amp used open loop is slow as a comparator, partly because it takes time to come out of saturation.`, R`Many dedicated comparators have open-collector (open-drain) outputs so that they can drive logic at a different supply voltage.`, R`A dedicated comparator is internally compensated so that it can be used safely with negative feedback.`, R`In a comparator the two inputs may differ by a large voltage, unlike in an op-amp running with negative feedback.`], answer: [0, 1, 3],
      sol: R`Op-amps are compensated for stability under negative feedback, which limits their slew rate, and their output stages recover slowly from the rails. Comparators leave out the compensation for speed, so they are not stable with negative feedback; they are used open loop or with positive feedback (hysteresis). Open-collector outputs let a pull-up set the logic level. Open loop, nothing forces the inputs together, so a large differential voltage is normal.`,
      trap: R`The "virtual short" between the inputs is a result of negative feedback, not a property of the chip.` },
    { id: 'oc-r4-10', type: 'nat', level: 3, exams: G, sub: 'differentiator',
      q: R`An ideal op-amp differentiator ($R = 10$ k$\Omega$ in feedback, $C = 10$ nF at the input) is fed a symmetric triangle wave of $2.0$ V peak-to-peak at $1.0$ kHz. Its output is a square wave of peak-to-peak value ______ V.`,
      answer: 0.8, tol: 0.01, calc: () => 2 * 10e3 * 10e-9 * (2.0 / 0.5e-3),
      sol: R`The triangle rises $2.0$ V in half a period ($0.5$ ms), so $|dv/dt| = 4000$ V/s on each ramp. $v_o = -RC\,dv/dt$ with $RC = 10^4\times10^{-8} = 10^{-4}$ s gives $\mp0.4$ V. The output switches between $-0.4$ and $+0.4$ V: $0.8$ V peak-to-peak.`,
      trap: R`Using the full period ($1$ ms) for one ramp halves the slope and the answer.` },
    { id: 'oc-r4-11', type: 'mcq', level: 4, exams: G, sub: 'stability',
      q: R`A transimpedance amplifier with $R_f = 1$ M$\Omega$ reads a photodiode that has $100$ pF of capacitance. Its output rings badly after every light step. The standard cure is to`,
      options: [R`raise $R_f$ to $10$ M$\Omega$`, R`remove the photodiode bias`, R`put a small capacitor across $R_f$`, R`connect a large capacitor from the output to ground`], answer: 2,
      sol: R`The diode capacitance $C_d$ and $R_f$ make the feedback factor $\beta = Z_{in}/(Z_{in} + Z_f)$ fall above $1/(2\pi R_fC_d)$, about $1.6$ kHz. The noise gain $1/\beta$ then rises at 20 dB/decade and meets the op-amp's falling open-loop gain with a 40 dB/decade closing rate, leaving almost no phase margin. A feedback capacitor $C_f$ adds a zero in $\beta$ that levels the noise gain off before the crossing, restoring the phase margin. A larger $R_f$ moves the problem lower in frequency, and a load capacitor adds more lag.`,
      trap: R`Capacitive loading at the output makes things worse; the fix belongs in the feedback path.` },
    { id: 'oc-r4-12', type: 'nat', level: 5, exams: G, sub: 'gain-bandwidth',
      q: R`An inverting amplifier of nominal gain $-10$ uses an op-amp with a single-pole response and gain-bandwidth product $10$ MHz. At $100$ kHz, the extra phase lag of the output (beyond the $180^\circ$ of the inversion) is ______ degrees (to two decimal places).`,
      answer: 6.28, tol: 0.03, calc: () => Math.atan(100e3 / (10e6 / 11)) * 180 / Math.PI,
      sol: R`The closed-loop bandwidth is set by the noise gain $1 + R_f/R_1 = 11$, not by the signal gain 10: $f_c = 10\text{ MHz}/11 = 909$ kHz. The closed loop acts as a single pole there, so the extra lag is $\arctan(f/f_c) = \arctan(100/909.1) = \arctan(0.110) = 6.28^\circ$.`,
      trap: R`Using the signal gain 10 for the bandwidth (1 MHz) gives $5.71^\circ$.` },
  ],
  gens: [
    { id: 'oc-r4g1', type: 'nat', level: 2, exams: A, sub: 'summing amplifier',
      make(r) {
        const n = int(r, 2, 3), Rf = pick(r, 5, 20, 1);
        const Vs = Array.from({ length: n }, () => pick(r, -2, 2, 0.1)), Rs = Array.from({ length: n }, () => pick(r, 10, 50, 5));
        const Vo = -Rf * Vs.reduce((s, v, i) => s + v / Rs[i], 0);
        const list = Vs.map((v, i) => `$V_${i + 1} = ${v}$ V through $${Rs[i]}$ k$\\Omega$`).join(', ');
        return { q: `An ideal inverting summing amplifier (supplies $\\pm15$ V) has a feedback resistor of $${Rf}$ k$\\Omega$ and inputs ${list}. The output is ______ V (to two decimal places).`,
          answer: round(Vo, 2) || 0, tol: 0.01, Vs, Rs, Rf,
          sol: `The summing node is a virtual ground, so the input currents add: $\\sum V_i/R_i = ${round(Vs.reduce((s, v, i) => s + v / Rs[i], 0), 4)}$ mA. $V_o = -R_f\\sum V_i/R_i = -${Rf}\\times${round(Vs.reduce((s, v, i) => s + v / Rs[i], 0), 4)} = ${round(Vo, 2) || 0}$ V.`,
          trap: 'Adding the voltages before weighting each by $R_f/R_i$, or dropping the minus sign.' };
      },
      verify: (p) => -p.Rf * p.Vs.reduce((s, v, i) => s + v / p.Rs[i], 0) },
    { id: 'oc-r4g2', type: 'nat', level: 4, exams: G, sub: 'gain-bandwidth',
      make(r) {
        const inv = r() < 0.5, g = choose(r, [2, 5, 10, 20, 50, 100]), GBW = choose(r, [1, 3, 5, 10, 20]); // GBW in MHz, f in kHz
        const noise = inv ? g + 1 : g, fc = GBW * 1000 / noise, f = Math.max(0.1, round(fc * choose(r, [0.1, 0.2, 0.25, 0.3, 0.5, 0.75, 1, 1.5]), 1)), ask = choose(r, ['phase', 'mag']);
        const val = ask === 'phase' ? Math.atan(f / fc) * 180 / Math.PI : (1 - 1 / Math.sqrt(1 + (f / fc) ** 2)) * 100;
        return { q: `An op-amp with a single-pole response and gain-bandwidth product $${GBW}$ MHz is used as ${inv ? `an inverting amplifier of gain $-${g}$` : `a non-inverting amplifier of gain $${g}$`}. At $${f}$ kHz, ${ask === 'phase' ? 'the extra phase lag of the output (beyond any inversion) is ______ degrees' : 'the gain magnitude falls short of its low-frequency value by ______ %'} (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, round(Math.abs(val) * 0.005, 2)), GBW, noise, f, ask,
          sol: `Noise gain $= ${inv ? `1 + R_f/R_1 = ${noise}` : `${noise}`}$, so the closed-loop pole is at $f_c = ${GBW}\\text{ MHz}/${noise} = ${round(fc, 2)}$ kHz. ${ask === 'phase' ? `Extra lag $= \\arctan(f/f_c) = \\arctan(${round(f / fc, 4)}) = ${round(val, 2)}^\\circ$.` : `$|H|/H_0 = 1/\\sqrt{1 + (f/f_c)^2} = ${round(1 / Math.sqrt(1 + (f / fc) ** 2), 5)}$, a shortfall of $${round(val, 2)}\\%$.`}`,
          trap: inv ? 'For an inverting stage the bandwidth is set by the noise gain $1 + R_f/R_1$, not by $R_f/R_1$.' : 'Using the open-loop corner frequency instead of GBW divided by the closed-loop gain.' };
      },
      verify: (p) => { const fc = p.GBW * 1000 / p.noise; return p.ask === 'phase' ? Math.atan(p.f / fc) * 180 / Math.PI : (1 - 1 / Math.sqrt(1 + (p.f / fc) ** 2)) * 100; } },
    { id: 'oc-r4g3', type: 'mcq', level: 3, exams: G, sub: 'CMRR',
      make(r) {
        const Ad = choose(r, [1, 2, 5, 10, 20, 50, 100]), dB = choose(r, [60, 70, 80, 90, 100]), Vcm = pick(r, 1, 10, 0.5);
        const err = Ad * Vcm / 10 ** (dB / 20) * 1000; // mV
        const show = (v) => `$${+v.toPrecision(3)}$ mV`;
        const o = mcqOptions(r, err, [Vcm / 10 ** (dB / 20) * 1000 * (Ad === 1 ? 10 : 1), Ad * Vcm / 10 ** (dB / 10) * 1000, Ad * Ad * Vcm / 10 ** (dB / 20) * 1000, err * 10], show);
        return { q: `A difference amplifier with differential gain $${Ad}$ and CMRR $${dB}$ dB has both inputs at $${Vcm}$ V. The error it adds at its output is about`, ...o,
          sol: `$\\text{CMRR} = 10^{${dB}/20} = ${+(10 ** (dB / 20)).toPrecision(4)}$, so $A_{cm} = A_d/\\text{CMRR} = ${+(Ad / 10 ** (dB / 20)).toPrecision(3)}$. Output error $= A_{cm}V_{cm} = ${+err.toPrecision(3)}$ mV (that is $V_{cm}/\\text{CMRR}$ referred to the input, times the gain).`,
          trap: 'Using $10^{\\text{dB}/10}$ (a power ratio) for a ratio of voltage gains, or forgetting to multiply by the differential gain.' };
      } },
  ],
};
