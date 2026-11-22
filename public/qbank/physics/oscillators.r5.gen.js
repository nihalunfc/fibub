// Round 5 extras for oscillators: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'osc-r5-01', type: 'mcq', level: 1, exams: A, sub: 'relaxation oscillators',
      q: R`In an op-amp relaxation oscillator (a Schmitt trigger whose output charges a capacitor through a resistor, the capacitor feeding back to the inverting input), the voltage across the capacitor is`,
      options: [R`a square wave`, R`a pure sine wave`, R`a series of exponential rises and falls between the two trigger thresholds`, R`a constant DC level`], answer: 2,
      sol: R`The output sits at one saturation level and charges the capacitor exponentially towards it through $R$. When the capacitor voltage reaches the trigger threshold, the output flips and the capacitor heads exponentially the other way until it reaches the other threshold. So the capacitor shows exponential segments bouncing between the thresholds (nearly triangular when the thresholds are small compared with the output swing), while the output is the square wave.`,
      trap: R`The square wave is at the op-amp output, not across the capacitor.` },
    { id: 'osc-r5-02', type: 'nat', level: 2, exams: G, sub: 'ring oscillators',
      q: R`A ring oscillator is a loop of $5$ identical inverters, each with a propagation delay of $80$ ps. Its oscillation frequency is ______ GHz (to two decimal places).`,
      answer: 1.25, tol: 0.01, calc: () => 1 / (2 * 5 * 80e-12) / 1e9,
      sol: R`An edge must travel round the loop twice (once as a rising edge, once as a falling edge at each node) to complete one period: $T = 2Nt_d = 2\times5\times80$ ps $= 800$ ps. So $f = 1/800\text{ ps} = 1.25$ GHz. An odd number of inverters is needed so the loop has no stable state.`,
      trap: R`$1/(Nt_d) = 2.5$ GHz forgets that a full period needs both a rising and a falling edge to go round.` },
    { id: 'osc-r5-03', type: 'mcq', level: 2, exams: A, sub: 'LC oscillator',
      q: R`The tank of an LC oscillator has $L = 25\ \mu$H and $C = 1.0$ nF. It oscillates at about`,
      options: [R`$6.32$ MHz`, R`$159$ kHz`, R`$31.8$ kHz`, R`$1.01$ MHz`], answer: 3,
      sol: R`$f = 1/(2\pi\sqrt{LC})$ with $LC = 25\times10^{-6}\times10^{-9} = 2.5\times10^{-14}$ s$^2$, so $\sqrt{LC} = 1.58\times10^{-7}$ s and $f = 1/(2\pi\times1.58\times10^{-7}) = 1.01$ MHz.`,
      trap: R`$6.32\times10^6$ is the angular frequency $\omega$ in rad/s, not $f$ in Hz.` },
    { id: 'osc-r5-04', type: 'nat', level: 3, exams: G, sub: 'frequency stability',
      q: R`An LC oscillator's tank has loaded $Q = 50$. Near resonance the tank's phase changes as $d\phi/d\omega = 2Q/\omega_0$. A temperature change makes the amplifier add an extra $0.010$ rad of phase shift. The oscillator's frequency shifts by ______ ppm (parts per million) to restore zero total loop phase.`,
      answer: 100, tol: 1, calc: () => 0.010 / (2 * 50) * 1e6,
      sol: R`The loop must still have zero total phase, so the tank must supply $-0.010$ rad. With $\Delta\phi = (2Q/\omega_0)\Delta\omega$, $\Delta\omega/\omega_0 = \Delta\phi/2Q = 0.010/100 = 1.0\times10^{-4} = 100$ ppm. A higher-$Q$ tank (or a crystal, $Q\sim10^5$) shifts far less for the same phase error: this is why $Q$ sets frequency stability.`,
      trap: R`Dividing by $Q$ instead of $2Q$ gives $200$ ppm.` },
    { id: 'osc-r5-05', type: 'msq', level: 3, exams: G, sub: 'negative resistance', format: 'statements',
      q: R`A parallel $LC$ tank has a loss conductance $G$. An active device with small-signal conductance $-g$ is connected across it. Which statements are correct?`,
      options: [R`Oscillations grow from noise if $g > G$.`, R`A tunnel diode biased on the falling part of its I-V curve can supply the $-g$.`, R`Once the amplitude is large, the device's nonlinearity lowers its average negative conductance until it equals $G$.`, R`A large enough positive resistor in parallel with the tank can also sustain oscillation.`], answer: [0, 1, 2],
      sol: R`The net conductance $G - g$ sets the decay rate of the tank's ringing; if it is negative the ringing grows instead. A tunnel diode (or a Gunn device, or a cross-coupled transistor pair) gives a negative slope $dI/dV$ over part of its range. Growth stops when the device's average conductance over a cycle falls to exactly $G$: this sets the amplitude. A positive resistor only removes energy, whatever its size.`,
      trap: R`A large resistor removes little energy, but never adds any; something must supply power.` },
    { id: 'osc-r5-06', type: 'nat', level: 3, exams: A, sub: 'Hartley',
      q: R`A Hartley oscillator's tapped coil has sections of $1.00$ mH and $0.25$ mH with mutual inductance $0.10$ mH between them (wound to aid). With $C = 1.0$ nF across the whole coil, it oscillates at about ______ kHz (to one decimal place).`,
      answer: 132.2, tol: 0.7, calc: () => 1 / (2 * Math.PI * Math.sqrt((1 + 0.25 + 0.2) * 1e-3 * 1e-9)) / 1e3,
      sol: R`Aiding coupling adds $2M$: $L = L_1 + L_2 + 2M = 1.00 + 0.25 + 0.20 = 1.45$ mH. Then $f = 1/(2\pi\sqrt{1.45\times10^{-3}\times10^{-9}}) = 1/(2\pi\times1.204\times10^{-6}) = 132.2$ kHz.`,
      trap: R`Adding $M$ only once ($L = 1.35$ mH, $137$ kHz) or ignoring it ($142$ kHz).` },
    { id: 'osc-r5-07', type: 'mcq', level: 4, exams: G, sub: 'phase-locked loop',
      q: R`A frequency synthesiser divides a $10$ MHz reference by $M = 25$ and the VCO output by $N$ before the phase detector. With $N = 1001$ when locked, the output frequency and the channel step (change for $N\to N + 1$) are`,
      options: [R`$10.01$ GHz and $10$ MHz`, R`$400.4$ MHz and $400$ kHz`, R`$400.4$ MHz and $10$ MHz`, R`$250.25$ MHz and $250$ kHz`], answer: 1,
      sol: R`At lock both phase-detector inputs have the same frequency: $f_{out}/N = f_{ref}/M = 10\text{ MHz}/25 = 400$ kHz. So $f_{out} = 1001\times400\text{ kHz} = 400.4$ MHz, and each step in $N$ moves the output by $400$ kHz, the comparison frequency.`,
      trap: R`The step is $f_{ref}/M$, not $f_{ref}$: the reference divider sets the channel spacing.` },
    { id: 'osc-r5-08', type: 'msq', level: 4, exams: A, sub: 'multivibrators', format: 'statements',
      q: R`About a standard 555 timer astable ($R_A$ from the supply, $R_B$ to the discharge pin, $C$ to ground), which statements are correct?`,
      options: [R`Its duty cycle is always above $50\%$.`, R`Its frequency hardly depends on the supply voltage.`, R`A voltage applied to the control pin changes its frequency.`, R`Its frequency is proportional to the supply voltage.`], answer: [0, 1, 2],
      sol: R`The capacitor charges through $R_A + R_B$ (time $0.693(R_A + R_B)C$) and discharges through $R_B$ only ($0.693R_BC$), so high time exceeds low time. The thresholds are $V_{CC}/3$ and $2V_{CC}/3$; both the charging target and the thresholds scale with $V_{CC}$, so the times do not change. The control pin sets the upper threshold directly; changing it changes both times, which makes the 555 a simple VCO.`,
      trap: R`Charging current does rise with $V_{CC}$, but so does the voltage step needed; the two cancel.` },
    { id: 'osc-r5-09', type: 'nat', level: 5, exams: G, sub: 'amplitude control',
      q: R`A parallel $RLC$ tank with loss conductance $G = 1.0$ mS is driven by a device whose current is $i = -gv + bv^3$ with $g = 2.0$ mS and $b = 1.0$ mA/V$^3$. Using the describing-function (first-harmonic) balance, the steady oscillation amplitude across the tank is ______ V (to two decimal places).`,
      answer: 1.15, tol: 0.01, calc: () => Math.sqrt(4 * (2e-3 - 1e-3) / (3 * 1e-3)),
      sol: R`For $v = V\cos\omega t$, $\cos^3 = \tfrac34\cos\omega t + \tfrac14\cos3\omega t$, so the fundamental part of the device current is $(-g + \tfrac34bV^2)V\cos\omega t$: an effective conductance $-g + \tfrac34bV^2$. Steady state needs the total conductance to vanish: $G - g + \tfrac34bV^2 = 0$, so $V^2 = 4(g - G)/3b = 4\times10^{-3}/(3\times10^{-3}) = 1.333$ V$^2$ and $V = 1.15$ V.`,
      trap: R`Setting $bV^2 = g - G$ (missing the $\tfrac34$ from the harmonic balance) gives $1.00$ V.` },
    { id: 'osc-r5-10', type: 'mcq', level: 4, exams: G, sub: 'Barkhausen criterion',
      q: R`An inverting amplifier of gain $-2$ (flat with frequency) drives a pure delay line of $\tau = 1.0\ \mu$s whose output returns to the amplifier input. The lowest frequency at which the Barkhausen phase condition is met is`,
      options: [R`$500$ kHz`, R`$1.0$ MHz`, R`$159$ kHz`, R`$250$ kHz`], answer: 0,
      sol: R`The amplifier gives $180^\circ$; the delay gives $\omega\tau$. The total must be a multiple of $360^\circ$: $\omega\tau = \pi$ for the lowest one, so $f = 1/(2\tau) = 500$ kHz (with odd multiples $1.5$ MHz, $2.5$ MHz, ... also allowed). With loop gain 2 the oscillation grows and is limited by clipping, so the output is close to a square wave of period $2\tau$.`,
      trap: R`$1/\tau = 1$ MHz would be the answer for a non-inverting amplifier; $1/(2\pi\tau)$ mixes up $\omega$ and $f$.` },
  ],
  gens: [
    { id: 'osc-r5g1', type: 'nat', level: 2, exams: G, sub: 'ring oscillators',
      make(r) {
        const N = choose(r, [3, 5, 7, 9, 11, 15, 21]), td = pick(r, 20, 200, 10);
        const f = 1 / (2 * N * td * 1e-12) / 1e6;
        return { q: R`A ring oscillator has $${N}$ identical inverters, each with propagation delay $${td}$ ps. It oscillates at ______ MHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.003, 1)), N, td,
          sol: R`$T = 2Nt_d = 2\times${N}\times${td}$ ps $= ${2 * N * td}$ ps, so $f = 1/T = ${round(f, 1)}$ MHz.`,
          trap: 'A period needs both a rising and a falling edge to go round the loop: $T = 2Nt_d$.' };
      },
      verify: (p) => 1 / (2 * p.N * p.td * 1e-12) / 1e6 },
    { id: 'osc-r5g2', type: 'nat', level: 3, exams: A, sub: 'Hartley',
      make(r) {
        const L1 = pick(r, 0.5, 5, 0.5), L2 = pick(r, 0.1, 1, 0.05), M = round(pick(r, 0.02, 0.1, 0.01) * Math.sqrt(L1 * L2) * 5, 3), aid = choose(r, [true, false]), C = choose(r, [0.47, 1, 2.2, 4.7, 10]);
        const L = L1 + L2 + (aid ? 2 : -2) * M, f = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-9)) / 1e3;
        return { q: R`A Hartley oscillator's coil has sections $${L1}$ mH and $${L2}$ mH with mutual inductance $${M}$ mH, wound to ${aid ? 'aid' : 'oppose'} each other. With $${C}$ nF across the whole coil it oscillates at ______ kHz (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(0.1, round(f * 0.005, 1)), L1, L2, M, aid, C,
          sol: R`$L = L_1 + L_2 ${aid ? '+' : '-'} 2M = ${round(L, 4)}$ mH, so $f = 1/(2\pi\sqrt{LC}) = ${round(f, 1)}$ kHz.`,
          trap: 'Mutual inductance counts twice, once from each section.' };
      },
      verify: (p) => 1 / (2 * Math.PI * Math.sqrt((p.L1 + p.L2 + (p.aid ? 2 : -2) * p.M) * 1e-3 * p.C * 1e-9)) / 1e3 },
    { id: 'osc-r5g3', type: 'mcq', level: 4, exams: G, sub: 'Barkhausen criterion',
      make(r) {
        const tau = choose(r, [0.1, 0.2, 0.5, 1, 2, 5, 10]), inv = choose(r, [true, false]);
        const f = (inv ? 1 / (2 * tau) : 1 / tau) * 1e3; // kHz
        const sh = (v) => `$${+v.toPrecision(3)}$ kHz`;
        const o = mcqOptions(r, f, [inv ? 2 * f : f / 2, f / (2 * Math.PI), 3 * f, f / 4], sh);
        return { q: R`${inv ? 'An inverting' : 'A non-inverting'} amplifier with flat gain of magnitude 2 drives a pure delay of $${tau}\ \mu$s whose output returns to its input. The lowest non-zero frequency meeting the Barkhausen phase condition is`, ...o,
          sol: inv ? R`The inversion gives $180^\circ$, so the delay must give $\omega\tau = \pi$: $f = 1/(2\tau) = ${+f.toPrecision(3)}$ kHz.` : R`With no inversion the delay must give a full $2\pi$: $f = 1/\tau = ${+f.toPrecision(3)}$ kHz.`,
          trap: 'Count the inversion as $180^\\circ$, and keep $\\omega$ and $f$ apart.' };
      } },
  ],
};
