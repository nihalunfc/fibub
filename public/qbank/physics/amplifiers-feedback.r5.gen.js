// Round 5 extras for amplifiers-feedback: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const minA = (Af, d, e) => Af * (1 + (d - e) / (e * (1 - d)));

export default {
  items: [
    { id: 'af-r5-01', type: 'mcq', level: 1, exams: A, sub: 'common-base stage',
      q: R`A common-base BJT stage is biased at $I_C = 1.0$ mA ($V_T = 25$ mV, $\beta$ large). The small-signal resistance looking into its emitter is about`,
      options: [R`$2.5$ k$\Omega$`, R`$25$ k$\Omega$`, R`$25\ \Omega$`, R`$1$ M$\Omega$`], answer: 2,
      sol: R`Looking into the emitter with the base grounded, a small voltage $v_e$ changes $V_{BE}$ by $-v_e$ and the emitter current by $g_mv_e$ (for large $\beta$). So $r_{in}\approx1/g_m = V_T/I_C = 25\ \Omega$. This low input resistance is why a common-base stage suits current inputs and why it is used as the upper device in a cascode.`,
      trap: R`$2.5$ k$\Omega$ is $r_\pi$ for $\beta = 100$, the resistance looking into the base, not the emitter.` },
    { id: 'af-r5-02', type: 'nat', level: 2, exams: A, sub: 'decibels',
      q: R`A signal chain has a $20$ dB preamplifier, a cable and attenuator that lose $6$ dB, and a $34$ dB main amplifier (all matched, so the dB values simply add). The overall voltage gain as a plain ratio is ______ (to the nearest whole number).`,
      answer: 251, tol: 2, calc: () => 10 ** (48 / 20),
      sol: R`Total gain $= 20 - 6 + 34 = 48$ dB. As a voltage ratio, $10^{48/20} = 10^{2.4} = 251$. Adding dB values is the same as multiplying the ratios ($10\times0.5\times50.1 = 251$).`,
      trap: R`Using $10^{48/10}$ (the power-ratio rule) gives $63\,000$, which is the power gain.` },
    { id: 'af-r5-03', type: 'mcq', level: 2, exams: G, sub: 'feedback topologies',
      q: R`A photodiode delivers a small current, and we want an output voltage proportional to it (a transresistance amplifier). Which feedback connection suits this, and what does it do to the amplifier's input and output resistances?`,
      options: [R`Series mixing, shunt sampling: input resistance rises, output resistance falls`, R`Series mixing, series sampling: both rise`, R`Shunt mixing, series sampling: input falls, output rises`, R`Shunt mixing, shunt sampling: both fall`], answer: 3,
      sol: R`A current input is best received by a low input resistance, so the feedback current is added at the input node (shunt mixing). A voltage output should come from a low output resistance, so the output voltage is sampled (shunt sampling). Shunt-shunt feedback divides both resistances by $(1 + A\beta)$: an ideal current-in, voltage-out amplifier.`,
      trap: R`Series mixing raises the input resistance, which suits a voltage source, not a current source.` },
    { id: 'af-r5-04', type: 'nat', level: 3, exams: G, sub: 'source degeneration',
      q: R`A common-source MOSFET stage has $g_m = 4.0$ mA/V, drain resistor $10$ k$\Omega$ and an unbypassed source resistor of $500\ \Omega$ (ignore $r_o$ and the body effect). The magnitude of its voltage gain is ______ (to two decimal places).`,
      answer: 13.33, tol: 0.05, calc: () => 4e-3 * 10e3 / (1 + 4e-3 * 500),
      sol: R`The source resistor carries the drain current, so $v_{gs} = v_{in} - i_dR_S$ and $i_d = g_mv_{gs}$, giving $i_d = g_mv_{in}/(1 + g_mR_S)$. The gain is $|A_v| = g_mR_D/(1 + g_mR_S) = 40/(1 + 2) = 13.33$. The factor $1 + g_mR_S$ is the feedback factor of this local series feedback.`,
      trap: R`$R_D/R_S = 20$ is only the limit when $g_mR_S\gg1$; here $g_mR_S = 2$ is not large.` },
    { id: 'af-r5-05', type: 'msq', level: 3, exams: G, sub: 'bandwidth extension', format: 'statements',
      q: R`A single-pole amplifier is put inside a negative feedback loop with loop gain $A_0\beta\gg1$ at midband. Which statements are correct?`,
      options: [R`The product of closed-loop midband gain and upper cut-off frequency stays the same as without feedback.`, R`The 10%-90% rise time of the step response becomes shorter.`, R`Noise picked up at the amplifier's input is reduced relative to the signal by the factor $1 + A_0\beta$.`, R`If the amplifier also has a single low-frequency (coupling) pole, the lower cut-off moves down by $1 + A_0\beta$.`], answer: [0, 1, 3],
      sol: R`With $A(s) = A_0/(1 + s/\omega_H)$, the closed-loop gain is $\dfrac{A_0/(1 + A_0\beta)}{1 + s/[\omega_H(1 + A_0\beta)]}$: the gain falls and the bandwidth rises by the same factor, so their product is fixed. Rise time $= 0.35/f_H$ falls. A high-pass pole $\omega_L$ moves to $\omega_L/(1 + A_0\beta)$ the same way. But noise entering at the input is indistinguishable from the signal; feedback scales both equally, so the signal-to-noise ratio there is unchanged.`,
      trap: R`Feedback helps against noise or distortion created inside the loop after the input, not against noise added at the input itself.` },
    { id: 'af-r5-06', type: 'nat', level: 3, exams: A, sub: 'feedback basics',
      q: R`An amplifier with a feedback network of $\beta = 0.10$ shows a closed-loop gain of $9.90$. Its open-loop gain $A$ is ______.`,
      answer: 990, tol: 1, calc: () => 9.9 / (1 - 9.9 * 0.1),
      sol: R`From $A_f = A/(1 + A\beta)$: $A_f + A_fA\beta = A$, so $A = A_f/(1 - A_f\beta) = 9.90/(1 - 0.990) = 9.90/0.010 = 990$. The closed-loop gain is just 1% below the ideal $1/\beta = 10$, which tells us the loop gain $A\beta = 99$.`,
      trap: R`Multiplying $A_f$ by $1 + \beta$ or taking $A\approx A_f$ misses how sensitive $A$ is to the last percent of closed-loop gain.` },
    { id: 'af-r5-07', type: 'mcq', level: 4, exams: G, sub: 'low-frequency response',
      q: R`A common-emitter stage at $g_m = 40$ mA/V has its $1$ k$\Omega$ emitter resistor bypassed by $100\ \mu$F. Taking the source resistance and $1/\beta$ terms as negligible, the low-frequency corner set by the bypass capacitor is about`,
      options: [R`$63.7$ Hz`, R`$1.59$ Hz`, R`$6.37$ Hz`, R`$400$ Hz`], answer: 0,
      sol: R`The capacitor sees the resistance looking into the emitter, about $1/g_m = 25\ \Omega$, in parallel with $R_E = 1$ k$\Omega$: $24.4\ \Omega$. The corner is $f = 1/(2\pi\times24.4\times10^{-4})\approx65$ Hz, close to $g_m/(2\pi C_E) = 0.040/(2\pi\times10^{-4}) = 63.7$ Hz. Because $1/g_m$ is so small, the bypass capacitor usually sets the lower cut-off and must be large.`,
      trap: R`Using $R_E$ alone gives $1.59$ Hz, forty times too low; the emitter looks like a low resistance.` },
    { id: 'af-r5-08', type: 'msq', level: 4, exams: G, sub: 'active load', format: 'statements',
      q: R`A long-channel common-source nMOS stage with a pMOS current-source load has gain $-g_m(r_{o1}\parallel r_{o2})$, with $r_o = 1/(\lambda I_D)$ and $\lambda\propto1/L$. Which statements are correct?`,
      options: [R`Doubling the bias current (same transistor sizes) lowers the gain by about a factor $\sqrt2$.`, R`Doubling both channel lengths, with $W$ doubled too so $W/L$ is fixed, at the same current roughly doubles the gain.`, R`With a load capacitance $C_L$, the gain-bandwidth product $g_m/(2\pi C_L)$ does not depend on the bias current.`, R`The gain does not depend on the load capacitance at low frequency.`], answer: [0, 1, 3],
      sol: R`$g_m = \sqrt{2k'(W/L)I_D}\propto\sqrt{I_D}$, while $r_{o1}\parallel r_{o2}\propto1/I_D$, so the gain goes as $1/\sqrt{I_D}$: doubling $I_D$ divides it by $\sqrt2$. Longer channels halve $\lambda$ and double $r_o$, doubling the gain at the same $g_m$. The gain-bandwidth product is $g_m/(2\pi C_L)$, which rises as $\sqrt{I_D}$: speed costs current. At low frequency the capacitor draws no current, so the gain is set by resistances alone.`,
      trap: R`More current buys speed (bandwidth) but loses gain in this stage.` },
    { id: 'af-r5-09', type: 'nat', level: 5, exams: G, sub: 'desensitivity',
      q: R`A feedback amplifier must have closed-loop gain $100$, and that gain may change by at most $0.1\%$ when the open-loop gain $A$ falls by $20\%$ (use the exact formula, not the small-change rule). The smallest nominal open-loop gain $A$ that does this is ______ (to the nearest whole number).`,
      answer: 24975, tol: 25, calc: () => minA(100, 0.2, 0.001),
      sol: R`Let $x = A\beta$. Then $\dfrac{A_f(0.8A)}{A_f(A)} = \dfrac{0.8(1 + x)}{1 + 0.8x}\ge0.999$. Cross-multiplying: $0.8 + 0.8x\ge0.999 + 0.7992x$, so $0.0008x\ge0.199$ and $x\ge248.75$. The nominal closed-loop gain is $A/(1 + x) = 100$, so $A = 100\times249.75 = 24\,975$. The small-change rule, $1 + x = 20\%/0.1\% = 200$, would give only $20\,000$.`,
      trap: R`The derivative rule $dA_f/A_f = (dA/A)/(1 + A\beta)$ is only valid for small changes; a 20% drop needs the exact ratio.` },
    { id: 'af-r5-10', type: 'mcq', level: 5, exams: G, sub: 'emitter follower',
      q: R`A class-A emitter follower drives a $1.0$ nF capacitive load. Its emitter is pulled down by a $5.0$ mA current sink (the transistor can source plenty of current but can only turn off when pulling down). The highest frequency at which it can deliver a $5.0$ V amplitude sine wave without slew distortion on the falling edges is about`,
      options: [R`$1.0$ MHz`, R`$159$ kHz`, R`$31.8$ kHz`, R`$318$ kHz`], answer: 1,
      sol: R`On a falling edge the transistor turns off and only the sink discharges the load, so the fastest fall is $I/C_L = 5\times10^{-3}/10^{-9} = 5\times10^6$ V/s $= 5$ V/$\mu$s. A sine $V_p\sin\omega t$ falls at most at $\omega V_p$, so $2\pi fV_p\le5\times10^6$: $f\le5\times10^6/(2\pi\times5) = 159$ kHz.`,
      trap: R`Forgetting the $2\pi$ gives $1$ MHz; the sine's steepest slope is $\omega V_p$, not $fV_p$.` },
  ],
  gens: [
    { id: 'af-r5g1', type: 'nat', level: 3, exams: G, sub: 'source degeneration',
      make(r) {
        const gm = pick(r, 1, 10, 0.5), RD = pick(r, 2, 20, 1), RS = pick(r, 100, 1000, 50);
        const Av = gm * RD / (1 + gm * RS / 1000);
        return { q: R`A common-source stage has $g_m = ${gm}$ mA/V, drain resistor $${RD}$ k$\Omega$ and an unbypassed source resistor $${RS}\ \Omega$ (ignore $r_o$ and the body effect). The magnitude of its voltage gain is ______ (to two decimal places).`,
          answer: round(Av, 2), tol: Math.max(0.02, round(Av * 0.005, 2)), gm, RD, RS,
          sol: R`$g_mR_D = ${round(gm * RD, 3)}$ and $g_mR_S = ${round(gm * RS / 1000, 3)}$, so $|A_v| = g_mR_D/(1 + g_mR_S) = ${round(gm * RD, 3)}/${round(1 + gm * RS / 1000, 3)} = ${round(Av, 2)}$.`,
          trap: 'Remember the unit mix: mA/V times k$\\Omega$ is a plain number, but mA/V times $\\Omega$ needs a factor $10^{-3}$.' };
      },
      verify: (p) => p.gm * p.RD / (1 + p.gm * p.RS / 1000) },
    { id: 'af-r5g2', type: 'nat', level: 5, exams: G, sub: 'desensitivity',
      make(r) {
        const Af = choose(r, [10, 20, 50, 100, 200]), d = choose(r, [0.1, 0.2, 0.25, 0.3, 0.5]), e = choose(r, [0.001, 0.002, 0.005, 0.01]);
        const Amin = minA(Af, d, e);
        return { q: R`A feedback amplifier has closed-loop gain $${Af}$. Its open-loop gain may fall by $${round(d * 100, 2)}\%$, and the closed-loop gain must change by at most $${e * 100}\%$. Using the exact formula $A_f = A/(1 + A\beta)$, the smallest nominal open-loop gain is ______ (to the nearest whole number).`,
          answer: Math.round(Amin), tol: Math.max(1, Math.round(Amin * 0.002)), Af, d, e,
          sol: R`With $x = A\beta$, need $\dfrac{(1 - d)(1 + x)}{1 + (1 - d)x}\ge1 - e$, which gives $x\ge\dfrac{d - e}{e(1 - d)} = ${round((d - e) / (e * (1 - d)), 2)}$. Then $A = A_f(1 + x) = ${Math.round(Amin)}$.`,
          trap: 'The small-change rule $1 + x = d/e$ underestimates the gain needed for a large drift.' };
      },
      verify: (p) => minA(p.Af, p.d, p.e) },
    { id: 'af-r5g3', type: 'mcq', level: 4, exams: G, sub: 'emitter follower',
      make(r) {
        const I = choose(r, [1, 2, 5, 10, 20]), CL = choose(r, [0.1, 0.22, 0.47, 1, 2.2]), Vp = choose(r, [1, 2, 5, 10]);
        const SR = I * 1e-3 / (CL * 1e-9), f = SR / (2 * Math.PI * Vp) / 1e3;
        const sh = (v) => `$${+v.toPrecision(3)}$ kHz`;
        const o = mcqOptions(r, f, [f * 2 * Math.PI, f / 2, f * Vp * Vp, f / (2 * Math.PI)], sh);
        return { q: R`A class-A emitter follower with a $${I}$ mA emitter current sink drives a $${CL}$ nF capacitive load. The highest frequency at which it can deliver a $${Vp}$ V amplitude sine wave without slew distortion on the falling edges is about`, ...o,
          sol: R`Falling edges are limited by the sink: slew rate $I/C_L = ${round(SR / 1e6, 3)}$ V/$\mu$s. A sine needs $2\pi fV_p\le I/C_L$, so $f\le${+f.toPrecision(3)}$ kHz.`,
          trap: 'The steepest slope of $V_p\\sin\\omega t$ is $\\omega V_p$, so the $2\\pi$ matters.' };
      } },
  ],
};
