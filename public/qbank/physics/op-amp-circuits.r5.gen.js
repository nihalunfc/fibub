// Round 5 extras for op-amp-circuits: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'oc-r5-01', type: 'mcq', level: 1, exams: A, sub: 'inverting amplifier',
      q: R`An ideal inverting amplifier has input resistor $10$ k$\Omega$ and feedback resistor $47$ k$\Omega$. With $+2.0$ V at the input, the current through the feedback resistor is`,
      options: [R`zero, since no current enters the op-amp`, R`$0.20$ mA, flowing from the inverting input towards the output`, R`$0.043$ mA`, R`$0.20$ mA, flowing from the output towards the inverting input`], answer: 1,
      sol: R`The inverting input is a virtual ground, so the input current is $2.0/10\text{ k} = 0.20$ mA, flowing into that node. No current enters the op-amp, so all $0.20$ mA continues through the $47$ k$\Omega$ resistor towards the output, which therefore sits at $-0.20\times47 = -9.4$ V.`,
      trap: R`"No current into the op-amp" does not mean no current in the feedback resistor; the input current has nowhere else to go.` },
    { id: 'oc-r5-02', type: 'nat', level: 2, exams: A, sub: 'window comparator',
      q: R`A window comparator gives a high output only while its input lies between $2.0$ V and $4.0$ V. Its input is a symmetric triangle wave swinging between $0$ and $6.0$ V. The output is high for ______ % of each period (to one decimal place).`,
      answer: 33.3, tol: 0.2, calc: () => (4 - 2) / (6 - 0) * 100,
      sol: R`A triangle wave changes at a constant rate, so the time spent in any voltage band is proportional to the band's width. On both the rising and falling ramps the input is in the window for $(4 - 2)/(6 - 0) = 1/3$ of the ramp. So the output is high $33.3\%$ of the time, in two pulses per period.`,
      trap: R`Counting only the rising ramp gives $16.7\%$; the falling ramp passes through the window too.` },
    { id: 'oc-r5-03', type: 'mcq', level: 2, exams: A, sub: 'output saturation',
      q: R`An inverting amplifier of gain $-20$ uses an op-amp on $\pm12$ V supplies whose output can swing only to $\pm10.5$ V. A sine wave of $0.60$ V peak is applied. The output is`,
      options: [R`a sine wave of $12$ V peak, inverted`, R`a square wave of $\pm12$ V`, R`a sine wave of $10.5$ V peak, inverted`, R`an inverted sine wave with its tops flattened at $\pm10.5$ V`], answer: 3,
      sol: R`The ideal output would be $-20\times0.60 = 12$ V peak, but the op-amp cannot go beyond $\pm10.5$ V. For the part of each cycle where $|20v_{in}| < 10.5$ V the output follows the inverted sine; beyond that it stays clipped at the rail. The result is an inverted sine with flat tops and bottoms, not a square wave (the input is not large enough to clip nearly all the time).`,
      trap: R`Supply voltage is not output swing: real op-amps lose a volt or more from each rail unless they are rail-to-rail types.` },
    { id: 'oc-r5-04', type: 'nat', level: 3, exams: A, sub: 'integrator',
      q: R`An ideal inverting integrator has $R = 10$ k$\Omega$ and $C = 10$ nF. A sine wave of $2.0$ V amplitude and $1.0$ kHz is applied (assume any DC drift is removed). The amplitude of the output sine wave is ______ V (to two decimal places).`,
      answer: 3.18, tol: 0.02, calc: () => 2 / (2 * Math.PI * 1e3 * 10e3 * 10e-9),
      sol: R`For a sine input the integrator's gain magnitude is $1/(\omega RC)$. Here $\omega RC = 2\pi\times10^3\times10^4\times10^{-8} = 0.628$, so the output amplitude is $2.0/0.628 = 3.18$ V. The output is a cosine: it leads the inverted input by $90^\circ$ (lags the input by $90^\circ$ after the inversion is included).`,
      trap: R`Using $f$ instead of $\omega$ gives $20$ V, which would also saturate the op-amp.` },
    { id: 'oc-r5-05', type: 'msq', level: 3, exams: G, sub: 'DC errors', format: 'statements',
      q: R`Which statements about the DC errors of op-amp circuits are correct?`,
      options: [R`The input offset voltage appears at the output multiplied by $1 + R_f/R_1$, in both the inverting and the non-inverting amplifier.`, R`A bias-compensation resistor $R_1\parallel R_f$ at the non-inverting input also removes the error from the input offset current.`, R`In an integrator without a resistor across the capacitor, a small offset makes the output ramp until it saturates.`, R`Chopper-stabilised (auto-zero) op-amps are used when offset and its drift must be in the microvolt range.`], answer: [0, 2, 3],
      sol: R`An offset voltage acts like a small source in series with the non-inverting input, so it sees the noise gain $1 + R_f/R_1$ whatever the signal path. The compensation resistor makes equal bias currents produce equal drops, cancelling them, but the difference between the two bias currents (the offset current) still gives an error $I_{os}R_f$. An integrator has infinite DC gain, so any offset is integrated without limit. Chopper and auto-zero op-amps measure and subtract their own offset continuously, reaching microvolts.`,
      trap: R`For the inverting amplifier the offset gain is $1 + R_f/R_1$, not $R_f/R_1$: the offset sits at the non-inverting input.` },
    { id: 'oc-r5-06', type: 'nat', level: 3, exams: A, sub: 'precision rectifier',
      q: R`An ideal precision full-wave rectifier (absolute-value circuit) receives a sine wave of $3.0$ V amplitude. The average (DC) value of its output is ______ V (to two decimal places).`,
      answer: 1.91, tol: 0.01, calc: () => 2 * 3 / Math.PI,
      sol: R`The output is $|3\sin\omega t|$. Its average over a half-cycle is $\dfrac{1}{\pi}\int_0^\pi3\sin\theta\,d\theta = \dfrac{3\times2}{\pi} = 1.91$ V. Because the circuit is precision, there is no diode drop to subtract, even for small signals.`,
      trap: R`$3/\pi = 0.95$ V is the half-wave result; $3/\sqrt2 = 2.12$ V is the rms value.` },
    { id: 'oc-r5-07', type: 'mcq', level: 4, exams: A, sub: 'active filter',
      q: R`An inverting amplifier has $R_1 = 10$ k$\Omega$ and a feedback network of $R_f = 100$ k$\Omega$ in parallel with $C = 1.59$ nF. At $1.0$ kHz the magnitude of its gain is about`,
      options: [R`$10$`, R`$5.0$`, R`$7.07$`, R`$14.1$`], answer: 2,
      sol: R`The gain is $-Z_f/R_1$ with $Z_f = R_f/(1 + j\omega R_fC)$. The corner is $1/(2\pi R_fC) = 1/(2\pi\times10^5\times1.59\times10^{-9}) = 1.00$ kHz. At the corner $|Z_f| = R_f/\sqrt2$, so $|A| = 10/\sqrt2 = 7.07$: a first-order low-pass with DC gain 10.`,
      trap: R`At the corner frequency the gain drops by $\sqrt2$ (3 dB), not by half.` },
    { id: 'oc-r5-08', type: 'msq', level: 4, exams: G, sub: 'comparators', format: 'statements',
      q: R`An engineer compares a dedicated comparator chip with a general-purpose, internally compensated op-amp used open loop as a comparator. Which statements are correct?`,
      options: [R`The dedicated comparator switches faster because it has no compensation capacitor slowing it.`, R`The op-amp's output edges are limited by its slew rate, so they can take microseconds.`, R`Many comparators have open-collector outputs, which need a pull-up resistor.`, R`Adding hysteresis makes the output more likely to chatter when a noisy input crosses the threshold slowly.`], answer: [0, 1, 2],
      sol: R`Internal compensation puts a dominant pole in an op-amp so it is stable with feedback; open loop this makes it slow, and the output edge is limited by the slew rate (often $0.5$ to $10$ V/$\mu$s). Comparators skip this and switch in nanoseconds. Open-collector (or open-drain) outputs let the user choose the logic level with a pull-up, and allow wired-AND connections. Hysteresis removes chatter: once the output switches, the threshold moves away from the input, so noise smaller than the hysteresis cannot switch it back.`,
      trap: R`Hysteresis is the cure for chatter, not its cause.` },
    { id: 'oc-r5-09', type: 'nat', level: 5, exams: G, sub: 'DC errors',
      q: R`A practical inverting integrator has $R = 10$ k$\Omega$ at the input and $R_p = 1.0$ M$\Omega$ across the capacitor; its non-inverting input is grounded directly. The op-amp has input offset voltage $1.0$ mV and input bias current $100$ nA. With the input grounded, the worst-case DC output error (both effects adding) is ______ mV.`,
      answer: 201, tol: 1, calc: () => 1 * (1 + 1e6 / 10e3) + 100e-9 * 1e6 * 1e3,
      sol: R`At DC the capacitor is open, so the circuit is an inverting amplifier with $R_f = R_p$. The offset voltage is multiplied by the noise gain $1 + R_p/R = 101$: $101$ mV. For the bias current alone (superposition), the inverting node is a virtual ground and both ends of $R$ sit at $0$ V, so $R$ carries no current and the bias current must come through $R_p$ from the output: it gives $I_BR_p = 100\text{ nA}\times1\text{ M}\Omega = 100$ mV. Worst case they add: $201$ mV. A resistor $R\parallel R_p$ at the non-inverting input would remove most of the bias-current part.`,
      trap: R`Multiplying the offset by $R_p/R = 100$ instead of $101$, or forgetting the bias current, which here is as large as the offset term.` },
    { id: 'oc-r5-10', type: 'mcq', level: 5, exams: G, sub: 'differentiator',
      q: R`A plain op-amp differentiator ($C = 10$ nF in, $R = 10$ k$\Omega$ in feedback) uses an op-amp with gain-bandwidth product $1.0$ MHz. Its rising $1/\beta$ curve meets the falling open-loop gain at a frequency where the circuit tends to ring. That frequency is about`,
      options: [R`$39.9$ kHz`, R`$1.59$ kHz`, R`$1.0$ MHz`, R`$631$ Hz`], answer: 0,
      sol: R`The feedback factor is $\beta = Z_C/(R + Z_C)$, so $1/\beta = 1 + j\omega RC$, rising at $+20$ dB/decade above $f_1 = 1/(2\pi RC) = 1.59$ kHz. The open-loop gain falls as $f_t/f$. They meet where $f/f_1 = f_t/f$, i.e. $f = \sqrt{f_1f_t} = \sqrt{1.59\times10^3\times10^6} = 39.9$ kHz. There the loop has two poles' worth of phase shift (nearly $180^\circ$), so the response rings: a small resistor in series with $C$ is the usual cure.`,
      trap: R`$1.59$ kHz is only where $1/\beta$ starts to rise; the ringing is at the geometric mean of $f_1$ and $f_t$.` },
  ],
  gens: [
    { id: 'oc-r5g1', type: 'nat', level: 2, exams: A, sub: 'window comparator',
      make(r) {
        const Vmax = pick(r, 4, 12, 1), VL = pick(r, 0.5, Vmax / 2, 0.5), VH = pick(r, VL + 0.5, Vmax - 0.5, 0.5);
        const pct = (VH - VL) / Vmax * 100;
        return { q: R`A window comparator's output is high only while its input lies between $${VL}$ V and $${VH}$ V. The input is a symmetric triangle wave from $0$ to $${Vmax}$ V. The output is high for ______ % of each period (to one decimal place).`,
          answer: round(pct, 1), tol: 0.2, VL, VH, Vmax,
          sol: R`A triangle spends equal time in equal voltage bands, on both ramps. Fraction $= (${VH} - ${VL})/${Vmax} = ${round(pct / 100, 4)}$, i.e. $${round(pct, 1)}\%$.`,
          trap: 'Both the rising and the falling ramp cross the window; the fraction is the same on each.' };
      },
      verify: (p) => (p.VH - p.VL) / p.Vmax * 100 },
    { id: 'oc-r5g2', type: 'nat', level: 3, exams: A, sub: 'integrator',
      make(r) {
        const Vp = pick(r, 0.5, 5, 0.5), f = choose(r, [100, 200, 500, 1000, 2000, 5000]), Rk = choose(r, [1, 2.2, 4.7, 10, 22, 47]), Cn = choose(r, [1, 2.2, 4.7, 10, 22, 47, 100]);
        const out = Vp / (2 * Math.PI * f * Rk * 1e3 * Cn * 1e-9);
        return { q: R`An ideal inverting integrator has $R = ${Rk}$ k$\Omega$ and $C = ${Cn}$ nF. A sine wave of amplitude $${Vp}$ V at $${f}$ Hz is applied (no DC drift). The output amplitude, ignoring saturation, is ______ V (to two decimal places).`,
          answer: round(out, 2), tol: Math.max(0.01, round(out * 0.005, 2)), Vp, f, Rk, Cn,
          sol: R`$|A| = 1/(\omega RC)$ with $\omega RC = 2\pi\times${f}\times${Rk}\times10^3\times${Cn}\times10^{-9} = ${round(2 * Math.PI * f * Rk * Cn * 1e-6, 4)}$. Output amplitude $= ${Vp}/${round(2 * Math.PI * f * Rk * Cn * 1e-6, 4)} = ${round(out, 2)}$ V.`,
          trap: 'Use $\\omega = 2\\pi f$, not $f$.' };
      },
      verify: (p) => p.Vp / (2 * Math.PI * p.f * p.Rk * 1e3 * p.Cn * 1e-9) },
    { id: 'oc-r5g3', type: 'mcq', level: 3, exams: A, sub: 'precision rectifier',
      make(r) {
        const Vp = pick(r, 1, 10, 0.5), kind = choose(r, ['full', 'half']), what = choose(r, ['average', 'rms']);
        const val = kind === 'full' ? (what === 'average' ? 2 * Vp / Math.PI : Vp / Math.SQRT2) : (what === 'average' ? Vp / Math.PI : Vp / 2);
        const all = [2 * Vp / Math.PI, Vp / Math.SQRT2, Vp / Math.PI, Vp / 2, Vp, Vp - 0.7];
        const o = mcqOptions(r, val, all.filter((v) => Math.abs(v - val) > 1e-9), (v) => `$${v.toFixed(2)}$ V`);
        return { q: R`An ideal precision ${kind === 'full' ? 'full-wave' : 'half-wave'} rectifier receives a sine wave of amplitude $${Vp}$ V. The ${what} value of its output is`, ...o,
          sol: kind === 'full'
            ? R`The output is $|${Vp}\sin\omega t|$: average $2V_p/\pi$, rms $V_p/\sqrt2$ (the same rms as the sine). So the ${what} value is $${val.toFixed(2)}$ V.`
            : R`The output is the positive half-cycles only: average $V_p/\pi$, rms $V_p/2$ (half the power of the sine). So the ${what} value is $${val.toFixed(2)}$ V.`,
          trap: 'A precision rectifier has no diode drop to subtract.' };
      } },
  ],
};
