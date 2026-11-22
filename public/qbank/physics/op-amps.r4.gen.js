// Round 4 extras for op-amps: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'opa-r4-01', type: 'mcq', level: 1, exams: A, sub: 'ideal op-amp',
      q: R`The two "golden rules" for an ideal op-amp circuit (the inputs draw no current, and the two input voltages are equal) can be used`,
      options: [R`whenever the op-amp is powered`, R`only when there is negative feedback and the output is not saturated`, R`only when there is positive feedback`, R`only for ac signals`],
      answer: 1,
      sol: R`The rule "no input current" is a property of the device. The rule $V_+ = V_-$ is not: it is what negative feedback achieves, by adjusting the output until the tiny difference times the huge gain gives the needed output. Without feedback (a comparator), with positive feedback (a Schmitt trigger) or once the output hits a supply rail, the inputs can differ by volts.`,
      trap: R`Applying $V_+ = V_-$ to a comparator or a saturated amplifier.` },
    { id: 'opa-r4-02', type: 'nat', level: 2, exams: A, sub: 'summing amplifiers', unit: 'V',
      q: R`Two inputs, $2.0$ V and $4.0$ V, are each connected through a $10$ k$\Omega$ resistor to the non-inverting input of an ideal op-amp (nothing else connects there). The op-amp has $R_f = 20$ k$\Omega$ from output to inverting input and $R_1 = 10$ k$\Omega$ from inverting input to ground. The output is ______ V (to one decimal place).`,
      answer: 9.0, tol: 0.05, calc: () => (2 + 4) / 2 * (1 + 20 / 10),
      sol: R`No current enters the non-inverting input, so the two equal resistors form a divider that averages the inputs: $V_+ = (2.0 + 4.0)/2 = 3.0$ V. The stage is a non-inverting amplifier of gain $1 + R_f/R_1 = 3$, so $V_{\rm out} = 9.0$ V. This non-inverting summer gives $V_{\rm out} = V_1 + V_2$ when the gain equals the number of inputs.`,
      trap: R`Treating it like the inverting summer (adding currents into a virtual ground) gives $-12$ V.` },
    { id: 'opa-r4-03', type: 'mcq', level: 2, exams: A, sub: 'inverting amplifier',
      q: R`An ideal inverting amplifier has $R_{\rm in} = 10$ k$\Omega$ and $R_f = 100$ k$\Omega$. The input resistance seen by the signal source is`,
      options: [R`infinite, because the op-amp draws no current`, R`zero, because of the virtual ground`, R`$10$ k$\Omega$`, R`$100$ k$\Omega$`],
      answer: 2,
      sol: R`The inverting input is held at (virtual) ground, so the source sees $R_{\rm in}$ going to ground: the input current is $V_{\rm in}/R_{\rm in}$ and the input resistance is $10$ k$\Omega$. This is a weakness of the inverting stage: raising its input resistance means raising both resistors. The non-inverting stage, by contrast, has a very high input resistance.`,
      trap: R`"Op-amps have infinite input resistance" describes the op-amp's own terminals, not this circuit's input.` },
    { id: 'opa-r4-04', type: 'nat', level: 3, exams: A, sub: 'active filters', unit: 'Hz',
      q: R`A unity-gain Sallen-Key low-pass filter has $R_1 = R_2 = 10$ k$\Omega$, $C_1 = 20$ nF (from the junction of the resistors to the output) and $C_2 = 10$ nF (from the non-inverting input to ground). Its natural frequency $f_0 = \dfrac{1}{2\pi\sqrt{R_1R_2C_1C_2}}$ is ______ Hz (to the nearest whole number).`,
      answer: 1125, tol: 5, calc: () => 1 / (2 * Math.PI * Math.sqrt(1e4 * 1e4 * 20e-9 * 10e-9)),
      sol: R`$R_1R_2C_1C_2 = (10^4)^2(2.0\times10^{-8})(1.0\times10^{-8}) = 2.0\times10^{-8}$ s$^2$, whose square root is $1.414\times10^{-4}$ s. $f_0 = \dfrac{1}{2\pi\times1.414\times10^{-4}} = 1125$ Hz. Its quality factor is $Q = \dfrac{\sqrt{R_1R_2C_1C_2}}{C_2(R_1 + R_2)} = \dfrac{1.414\times10^{-4}}{2.0\times10^{-4}} = 0.707$: a Butterworth response, chosen by making $C_1 = 2C_2$.`,
      trap: R`Using $1/2\pi RC$ with one of the capacitors gives $796$ Hz or $1592$ Hz.` },
    { id: 'opa-r4-05', type: 'msq', level: 3, exams: A, sub: 'active filters', format: 'statements',
      q: R`Which statements about active filters are correct?`,
      options: [R`A second-order Butterworth low-pass filter has $Q = 1/\sqrt2$.`, R`A unity-gain Sallen-Key low-pass with equal resistors and equal capacitors has $Q = 0.5$.`, R`An active filter cannot have a pass-band gain greater than 1.`, R`A first-order low-pass filter falls off at $20$ dB per decade above its cutoff.`],
      answer: [0, 1, 3],
      sol: R`Each pole adds $-20$ dB/decade, so first order gives $20$ and second order $40$ dB/decade. The Butterworth (maximally flat) second-order response has $Q = 0.707$. For the unity-gain Sallen-Key, $Q = \dfrac{\sqrt{R_1R_2C_1C_2}}{C_2(R_1 + R_2)} = \dfrac{RC}{2RC} = 0.5$ with equal parts (a bit droopy; choose $C_1 = 2C_2$ for Butterworth). Op-amp filters can easily have gain, e.g. by setting the amplifier gain above 1; that is one of their advantages over passive RC filters.`,
      trap: R`Thinking "filter" means "passive": the op-amp can provide gain and a low output impedance at the same time.` },
    { id: 'opa-r4-06', type: 'mcq', level: 3, exams: A, sub: 'feedback',
      q: R`A non-inverting op-amp amplifier uses which kind of negative feedback, and what does it do to the input and output resistances?`,
      options: [R`Series-shunt (voltage-series): it raises the input resistance and lowers the output resistance.`, R`Shunt-shunt (voltage-shunt): it lowers both the input and output resistances.`, R`Series-series (current-series): it raises both resistances.`, R`Shunt-series (current-shunt): it lowers the input resistance and raises the output resistance.`],
      answer: 0,
      sol: R`The feedback network samples the output <b>voltage</b> (shunt connection at the output) and returns a voltage that sits in <b>series</b> with the input signal, between the two op-amp inputs. Series mixing multiplies the input resistance by $(1 + A\beta)$; shunt sampling divides the output resistance by $(1 + A\beta)$. That makes it a near-ideal voltage amplifier. The inverting amplifier is the shunt-shunt case.`,
      trap: R`Naming the topology by the output connection only; the input mixing (series here) decides what happens to the input resistance.` },
    { id: 'opa-r4-07', type: 'nat', level: 4, exams: A, sub: 'schmitt trigger', unit: 'V',
      q: R`A non-inverting Schmitt trigger feeds the input through $R_1 = 10$ k$\Omega$ to the non-inverting input, with $R_2 = 40$ k$\Omega$ from the output back to the same input. The inverting input is held at $+1.0$ V, and the output saturates at $\pm12$ V. Starting with the output low, the input must rise to ______ V before the output switches high (to two decimal places).`,
      answer: 4.25, tol: 0.02, calc: () => (1 * (10 + 40) + 12 * 10) / 40,
      sol: R`The output flips when $V_+$ crosses $1.0$ V. By superposition $V_+ = \dfrac{V_{\rm in}R_2 + V_{\rm out}R_1}{R_1 + R_2}$. With $V_{\rm out} = -12$ V: $1.0 = \dfrac{40V_{\rm in} - 120}{50}$, so $V_{\rm in} = \dfrac{50 + 120}{40} = 4.25$ V. The lower threshold (output high) is $\dfrac{50 - 120}{40} = -1.75$ V, so the hysteresis is $6.0$ V wide and centred on $1.25$ V, not on the $1.0$ V reference.`,
      trap: R`Assuming the thresholds sit symmetrically about the reference ($1.0\pm3.0$ V); the reference is scaled by $(R_1 + R_2)/R_2$.` },
    { id: 'opa-r4-08', type: 'mcq', level: 4, exams: G, sub: 'stability',
      q: R`An op-amp whose open-loop response has two poles is stable as an amplifier with gain 10 but oscillates when wired as a voltage follower. The reason is that the follower`,
      options: [R`draws more current from the source`, R`has positive feedback`, R`has a higher slew rate`, R`has the largest feedback fraction, $\beta = 1$, so its loop gain $A\beta$ crosses unity at a higher frequency where the phase shift is larger`],
      answer: 3,
      sol: R`Stability depends on the loop gain $A\beta$. A follower feeds back all of the output ($\beta = 1$), the most any resistive network can, so $|A\beta| = 1$ happens at the highest frequency, where the second pole has added the most phase lag. If the total lag there reaches $180^\circ$ the loop oscillates. Higher-gain stages ($\beta = 0.1$) cross over lower down, with more phase margin. "Unity-gain stable" op-amps are compensated for exactly this worst case.`,
      trap: R`Thinking low gain means "easy" for the op-amp: for stability the unity-gain follower is the hardest case.` },
    { id: 'opa-r4-09', type: 'msq', level: 4, exams: G, sub: 'feedback', format: 'statements',
      q: R`An amplifier with open-loop gain $A$ (a single pole) has negative feedback with feedback fraction $\beta$. Which statements are correct?`,
      options: [R`A fractional change in $A$ changes the closed-loop gain by that fraction divided by $(1 + A\beta)$.`, R`The bandwidth rises by the factor $(1 + A\beta)$.`, R`If the output voltage is sampled, the output resistance falls by $(1 + A\beta)$.`, R`In an inverting amplifier, the resistance looking into the op-amp's inverting-input node rises by $(1 + A\beta)$.`],
      answer: [0, 1, 2],
      sol: R`$G = \dfrac{A}{1 + A\beta}$ gives $\dfrac{dG}{G} = \dfrac{1}{1 + A\beta}\dfrac{dA}{A}$. With a single pole the gain-bandwidth product is conserved, so the bandwidth grows by $(1 + A\beta)$ as the gain falls by it. Voltage sampling divides the output resistance by $(1 + A\beta)$. At the inverting-input node the feedback resistor looks like $R_f/(1 + A)$ (Miller effect): the node is a virtual ground with very <b>low</b> resistance, not high.`,
      trap: R`Assuming feedback always raises input resistance: shunt mixing (as at the inverting input) lowers it.` },
    { id: 'opa-r4-10', type: 'nat', level: 5, exams: A, sub: 'oscillators', unit: 'Hz',
      q: R`An op-amp relaxation oscillator (astable) charges a $10$ nF capacitor through $R = 47$ k$\Omega$ from the output (saturating at $\pm V_{\rm sat}$); the capacitor sits on the inverting input. The non-inverting input is fed from the output by a divider with $R_2 = 40$ k$\Omega$ from the output and $R_1 = 10$ k$\Omega$ to ground. The oscillation frequency is ______ Hz (to the nearest whole number).`,
      answer: 2624, tol: 15, calc: () => 1 / (2 * 47e3 * 10e-9 * Math.log(1.2 / 0.8)),
      sol: R`The thresholds are $\pm\beta V_{\rm sat}$ with $\beta = \dfrac{R_1}{R_1 + R_2} = 0.2$. Each half cycle the capacitor heads for $\pm V_{\rm sat}$ from $\mp\beta V_{\rm sat}$ and switches at $\pm\beta V_{\rm sat}$: $\beta = 1 - (1 + \beta)e^{-t/RC}$, so $t_{\rm half} = RC\ln\dfrac{1 + \beta}{1 - \beta} = (4.7\times10^{-4})\ln1.5 = 1.906\times10^{-4}$ s. The period is twice that, $3.81\times10^{-4}$ s, so $f = 2624$ Hz.`,
      trap: R`Using $\ln3$ (the result for $\beta = 0.5$) or forgetting that a period has two half cycles.` },
  ],
  gens: [
    { id: 'opa-r4g1', type: 'nat', level: 2, exams: A, sub: 'summing amplifiers',
      make(r) {
        const n = choose(r, [2, 3]), V = Array.from({ length: n }, () => choose(r, [-3, -2, -1, 0.5, 1, 1.5, 2, 3])), Rf = choose(r, [10, 20, 30, 47]), R1 = choose(r, [10, 22, 47]);
        const avg = V.reduce((s, x) => s + x, 0) / n, G = 1 + Rf / R1, out = avg * G;
        return { q: R`Inputs of ${V.map((x) => `$${x}$ V`).join(', ')} are each connected through equal resistors to the non-inverting input of an ideal op-amp. The op-amp has $R_f = ${Rf}$ k$\Omega$ from output to inverting input and $R_1 = ${R1}$ k$\Omega$ from inverting input to ground. Assuming it does not saturate, the output is ______ V (to two decimal places).`,
          answer: round(out, 2), tol: Math.max(0.01, round(Math.abs(out) * 0.005, 2)), unit: 'V', V, Rf, R1,
          sol: R`Equal resistors into a node that draws no current average the inputs: $V_+ = ${round(avg, 4)}$ V. Gain $= 1 + ${Rf}/${R1} = ${round(G, 4)}$, so $V_{\rm out} = ${round(out, 2)}$ V.`,
          trap: 'The non-inverting summer averages the inputs before amplifying; it does not add them directly.' };
      },
      verify: (p) => p.V.reduce((s, x) => s + x, 0) / p.V.length * (1 + p.Rf / p.R1) },
    { id: 'opa-r4g2', type: 'nat', level: 3, exams: A, sub: 'active filters',
      make(r) {
        const R1 = choose(r, [4.7, 10, 22, 47]), R2 = choose(r, [4.7, 10, 22, 47]), C1 = choose(r, [2.2, 4.7, 10, 22]), C2 = choose(r, [1, 2.2, 4.7, 10]);
        const ask = r() < 0.6 ? 'f' : 'Q';
        const s = Math.sqrt(R1 * 1e3 * R2 * 1e3 * C1 * 1e-9 * C2 * 1e-9), f = 1 / (2 * Math.PI * s), Q = s / (C2 * 1e-9 * (R1 + R2) * 1e3);
        const ans = ask === 'f' ? f : Q;
        return { q: R`A unity-gain Sallen-Key low-pass filter has $R_1 = ${R1}$ k$\Omega$, $R_2 = ${R2}$ k$\Omega$, $C_1 = ${C1}$ nF (to the output) and $C_2 = ${C2}$ nF (to ground). ${ask === 'f' ? R`Its natural frequency $1/(2\pi\sqrt{R_1R_2C_1C_2})$ is ______ Hz (to the nearest whole number).` : R`Its quality factor $Q = \sqrt{R_1R_2C_1C_2}/[C_2(R_1 + R_2)]$ is ______ (to three decimal places).`}`,
          answer: ask === 'f' ? Math.round(f) : round(Q, 3), tol: ask === 'f' ? Math.max(1, Math.round(f * 0.005)) : Math.max(0.002, round(Q * 0.005, 3)), ...(ask === 'f' ? { unit: 'Hz' } : {}), R1, R2, C1, C2, ask,
          sol: R`$\sqrt{R_1R_2C_1C_2} = ${round(s * 1e6, 3)}\ \mu$s. ${ask === 'f' ? R`$f_0 = 1/(2\pi\times${round(s * 1e6, 3)}\times10^{-6}) = ${Math.round(f)}$ Hz.` : R`$Q = \dfrac{${round(s * 1e6, 3)}\ \mu\text{s}}{${C2}\ \text{nF}\times${round(R1 + R2, 1)}\ \text{k}\Omega} = ${round(Q, 3)}$.`}`,
          trap: 'Q depends on the ratio of the capacitors: with unity gain it can only exceed 0.5 if C1 > C2.' };
      },
      verify: (p) => { const s = Math.sqrt(p.R1 * p.R2 * 1e6 * p.C1 * p.C2 * 1e-18); return p.ask === 'f' ? 1 / (2 * Math.PI * s) : s / (p.C2 * 1e-9 * (p.R1 + p.R2) * 1e3); } },
    { id: 'opa-r4g3', type: 'nat', level: 4, exams: A, sub: 'oscillators',
      make(r) {
        const Rk = choose(r, [4.7, 10, 22, 47, 100]), Cn = choose(r, [1, 2.2, 4.7, 10, 22, 100]);
        const R1 = int(r, 1, 5) * 10, R2 = choose(r, [10, 20, 47, 100]);
        const b = R1 / (R1 + R2), f = 1 / (2 * Rk * 1e3 * Cn * 1e-9 * Math.log((1 + b) / (1 - b)));
        return { q: R`An op-amp astable charges $C = ${Cn}$ nF through $R = ${Rk}$ k$\Omega$ from its output; $C$ is on the inverting input. The non-inverting input gets a fraction of the output from $R_2 = ${R2}$ k$\Omega$ (from the output) and $R_1 = ${R1}$ k$\Omega$ (to ground). The frequency is ______ Hz (to the nearest whole number).`,
          answer: Math.round(f), tol: Math.max(1, Math.round(f * 0.005)), unit: 'Hz', Rk, Cn, R1, R2,
          sol: R`$\beta = R_1/(R_1 + R_2) = ${round(b, 4)}$. Half period $= RC\ln\dfrac{1 + \beta}{1 - \beta} = ${round(Rk * Cn * 1e-3, 4)}\ \text{ms}\times${round(Math.log((1 + b) / (1 - b)), 4)}$. $f = \dfrac1{2RC\ln[(1 + \beta)/(1 - \beta)]} = ${Math.round(f)}$ Hz.`,
          trap: 'Only for β = 0.5 does the period reduce to 2RC ln 3.' };
      },
      verify: (p) => { const b = p.R1 / (p.R1 + p.R2); return 1 / (2 * p.Rk * 1e3 * p.Cn * 1e-9 * Math.log((1 + b) / (1 - b))); } },
  ],
};
