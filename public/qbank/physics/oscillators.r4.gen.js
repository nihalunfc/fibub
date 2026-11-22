// Round 4 extras for oscillators: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const ct = (c1, c2, c3) => 1 / (1 / c1 + 1 / c2 + 1 / c3);

export default {
  items: [
    { id: 'osc-r4-01', type: 'mcq', level: 1, exams: A, sub: 'LC oscillator',
      q: R`The tank capacitance of an LC oscillator is made four times larger, with the inductance unchanged. The oscillation frequency`,
      options: [R`doubles`, R`halves`, R`falls to a quarter`, R`falls by a factor of $\sqrt2$`], answer: 1,
      sol: R`$f = 1/(2\pi\sqrt{LC})$, so $f\propto C^{-1/2}$. Four times the capacitance gives $1/\sqrt4 = 1/2$ of the frequency.`,
      trap: R`Treating $f$ as inversely proportional to $C$ (a quarter) forgets the square root.` },
    { id: 'osc-r4-02', type: 'mcq', level: 2, exams: G, sub: 'phase-locked loop',
      q: R`A frequency synthesiser locks a voltage-controlled oscillator to a $10$ MHz crystal reference. The VCO output passes through a divide-by-$125$ counter before the phase detector compares it with the reference. In lock, the VCO runs at`,
      options: [R`$80$ kHz`, R`$10$ MHz`, R`$125$ MHz`, R`$1.25$ GHz`], answer: 3,
      sol: R`In lock the two inputs of the phase detector have the same frequency: $f_{VCO}/125 = 10$ MHz, so $f_{VCO} = 1.25$ GHz. Changing the division ratio steps the output in $10$ MHz steps, each as stable as the crystal.`,
      trap: R`$80$ kHz is the reference divided by 125; the divider is in the feedback path, so it multiplies.` },
    { id: 'osc-r4-03', type: 'nat', level: 2, exams: A, sub: 'multivibrators',
      q: R`A two-transistor astable multivibrator has timing components $R_1 = 10$ k$\Omega$, $C_1 = 10$ nF for one half-cycle and $R_2 = 30$ k$\Omega$, $C_2 = 10$ nF for the other. Each half-cycle lasts $RC\ln2$. Its frequency is ______ kHz (to two decimal places).`,
      answer: 3.61, tol: 0.02, calc: () => 1 / (Math.LN2 * (10e3 * 10e-9 + 30e3 * 10e-9)) / 1000,
      sol: R`Half-periods: $0.693\times10^{-4} = 69.3\ \mu$s and $0.693\times3\times10^{-4} = 207.9\ \mu$s. Period $277.3\ \mu$s, so $f = 3.61$ kHz. The output is high for 25% or 75% of the cycle depending on which collector is used.`,
      trap: R`Using only one time constant, or $1/RC$ without the $\ln2$.` },
    { id: 'osc-r4-04', type: 'nat', level: 3, exams: G, sub: 'voltage-controlled oscillator',
      q: R`A voltage-controlled LC oscillator uses a fixed $10\ \mu$H inductor and a varactor whose capacitance can be tuned from $25$ pF to $100$ pF. The width of its tuning range, $f_{max} - f_{min}$, is ______ MHz (to two decimal places).`,
      answer: 5.03, tol: 0.02, calc: () => 1 / (2 * Math.PI * Math.sqrt(1e-5 * 25e-12)) / 1e6 - 1 / (2 * Math.PI * Math.sqrt(1e-5 * 100e-12)) / 1e6,
      sol: R`$f_{max} = 1/(2\pi\sqrt{10^{-5}\times25\times10^{-12}}) = 1/(2\pi\times1.581\times10^{-8}) = 10.07$ MHz. A capacitance ratio of 4 is a frequency ratio of only 2, so $f_{min} = 5.03$ MHz and the range is $5.03$ MHz.`,
      trap: R`Scaling frequency with the capacitance ratio (4) instead of its square root.` },
    { id: 'osc-r4-05', type: 'mcq', level: 4, exams: G, sub: 'frequency stability',
      q: R`In an LC oscillator the inductance rises by $50$ ppm per kelvin and the capacitance falls by $150$ ppm per kelvin. The temperature coefficient of the oscillation frequency is about`,
      options: [R`$+50$ ppm/K`, R`$-50$ ppm/K`, R`$+100$ ppm/K`, R`$-200$ ppm/K`], answer: 0,
      sol: R`$f\propto(LC)^{-1/2}$, so $\dfrac{df}{f} = -\dfrac12\left(\dfrac{dL}{L} + \dfrac{dC}{C}\right) = -\dfrac12(50 - 150) = +50$ ppm/K. Designers pair components of opposite coefficients (for example a capacitor with a small negative coefficient) to cancel drift.`,
      trap: R`Forgetting the factor $-\tfrac12$, or the sign of each coefficient.` },
    { id: 'osc-r4-06', type: 'msq', level: 3, exams: G, sub: 'frequency stability', format: 'statements',
      q: R`Which statements about the frequency stability of sinusoidal oscillators are correct?`,
      options: [R`A resonator with higher $Q$ gives a more stable frequency, because its phase changes more steeply with frequency.`, R`A buffer amplifier between the oscillator and its load improves stability by isolating the tank from load changes.`, R`An oven-controlled crystal oscillator holds the crystal at a fixed temperature above the ambient.`, R`RC oscillators are generally more stable than crystal oscillators.`, R`Making the loop gain much larger than 1 improves the purity of the sine wave.`], answer: [0, 1, 2],
      sol: R`Any stray phase shift in the loop must be cancelled by the resonator; a steep phase slope ($\propto Q$) means only a tiny frequency change is needed. Load changes alter the effective tank, so a buffer helps. An oven keeps the crystal at a temperature (often near the turning point of its curve) independent of the room. RC networks have $Q$ below 1, far worse than quartz ($10^4$ to $10^6$). Excess loop gain drives the amplifier hard into its non-linear region and adds harmonics.`,
      trap: R`More gain helps start-up but hurts waveform purity; the loop gain should be just above 1 with gentle amplitude control.` },
    { id: 'osc-r4-07', type: 'nat', level: 4, exams: G, sub: 'frequency stability',
      q: R`An LC oscillator runs at $10$ MHz with a tank of quality factor $Q = 50$. Near resonance the tank's phase is $\phi\approx-\arctan(2Q\,\Delta f/f_0)$. If the amplifier's phase shift drifts by $0.010$ rad, the oscillation frequency shifts by about ______ Hz.`,
      answer: 1000, tol: 5, calc: () => 10e6 * 0.01 / (2 * 50),
      sol: R`The total loop phase must stay zero, so the tank must supply $-0.010$ rad: $2Q\,\Delta f/f_0 = 0.010$, giving $\Delta f = f_0\times0.010/(2Q) = 10^7\times0.010/100 = 1000$ Hz. A quartz crystal with $Q = 10^5$ would shift only $0.5$ Hz for the same phase drift.`,
      trap: R`Leaving out the factor 2 in the phase slope doubles the shift.` },
    { id: 'osc-r4-08', type: 'mcq', level: 2, exams: A, sub: 'multivibrators',
      q: R`A two-transistor monostable multivibrator has timing resistor $47$ k$\Omega$ and timing capacitor $10$ nF; its pulse lasts $RC\ln2$. When triggered it gives an output pulse of about`,
      options: [R`$0.47$ ms`, R`$3.3$ ms`, R`$0.33$ ms`, R`$0.65$ ms`], answer: 2,
      sol: R`$RC = 47\times10^3\times10\times10^{-9} = 0.47$ ms, and the pulse is $0.693RC = 0.33$ ms. The circuit then returns to its one stable state and waits for the next trigger.`,
      trap: R`Quoting $RC$ itself ($0.47$ ms) leaves out the $\ln2$ from the capacitor recharging through half its swing.` },
    { id: 'osc-r4-09', type: 'msq', level: 4, exams: G, sub: 'phase-locked loop', format: 'statements',
      q: R`A phase-locked loop has a phase detector, a loop filter, a voltage-controlled oscillator and a divide-by-$N$ counter in its feedback path. Which statements are correct?`,
      options: [R`In lock, the average output frequency is exactly $N$ times the reference frequency.`, R`The loop filter largely sets how fast the loop settles and how much reference noise reaches the output.`, R`In lock, the DC output of the phase detector is proportional to the frequency difference between its inputs.`, R`The loop can follow a slow drift of the reference frequency.`], answer: [0, 1, 3],
      sol: R`In lock the phase error is constant, so the frequencies at the phase detector are equal and $f_{out} = Nf_{ref}$ with no residual error. The phase detector output depends on the phase difference; in lock there is no frequency difference at all, only a steady phase offset that holds the VCO control voltage. The loop filter fixes the bandwidth and damping. Within its bandwidth the loop tracks reference changes.`,
      trap: R`A phase detector measures phase; locking means the frequency error is zero, not small.` },
    { id: 'osc-r4-10', type: 'nat', level: 5, exams: G, sub: 'Clapp',
      q: R`A Clapp oscillator has $C_1 = C_2 = 1000$ pF and a series capacitor $C_3 = 100$ pF with its inductor. The transistor's capacitance adds $10$ pF to $C_1$. The magnitude of the resulting frequency shift is ______ ppm (to the nearest ppm).`,
      answer: 413, tol: 2, calc: () => (1 - Math.sqrt(ct(1000, 1000, 100) / ct(1010, 1000, 100))) * 1e6,
      sol: R`The three capacitors are in series round the loop. Before: $1/C = 1/100 + 1/1000 + 1/1000 = 0.01200$ pF$^{-1}$, $C = 83.333$ pF. After: $1/C = 0.01 + 1/1010 + 0.001 = 0.011990$, $C = 83.402$ pF. Since $f\propto C^{-1/2}$, $f'/f = \sqrt{83.333/83.402} = 0.999587$: a fall of $413$ ppm. Without $C_3$ (plain Colpitts, $C = 500$ pF) the same $10$ pF would shift $f$ by about $2480$ ppm, six times more.`,
      trap: R`Adding the 10 pF to the total capacitance directly, as if the capacitors were in parallel.` },
    { id: 'osc-r4-11', type: 'mcq', level: 5, exams: G, sub: 'harmonics',
      q: R`An LC oscillator's transistor delivers current pulses rich in harmonics into a parallel tank of $Q = 30$. For equal fundamental and second-harmonic current amplitudes, the second-harmonic tank voltage is smaller than the fundamental by a factor of about`,
      options: [R`$30$`, R`$45$`, R`$60$`, R`$900$`], answer: 1,
      sol: R`A parallel tank has $Z = R_p/[1 + jQ(\omega/\omega_0 - \omega_0/\omega)]$. At $\omega_0$, $Z = R_p$. At $2\omega_0$, $Q(2 - \tfrac12) = 1.5Q = 45$, so $|Z|\approx R_p/45$. That is why a high-$Q$ tank gives a nearly pure sine even when the transistor current is far from sinusoidal.`,
      trap: R`Taking the detuning as $2 - 1 = 1$ (giving $Q$) forgets the $-\omega_0/\omega$ term.` },
    { id: 'osc-r4-12', type: 'mcq', level: 3, exams: G, sub: 'LC oscillator',
      q: R`An oscillator tank has unloaded quality factor $100$, which corresponds to a parallel loss resistance $R_p$ at resonance. A load resistance equal to $R_p$ is connected across the tank. The loaded quality factor is`,
      options: [R`$50$`, R`$100$`, R`$200$`, R`$25$`], answer: 0,
      sol: R`For a parallel tank $Q = R/(\omega_0L)$ with $R$ the total parallel resistance. The load in parallel halves it to $R_p/2$, so $Q$ falls from $100$ to $50$, and the frequency stability suffers accordingly. A buffer or a light tap on the tank keeps the loading small.`,
      trap: R`For a parallel tank $Q$ is proportional to the parallel resistance, so lowering it lowers $Q$; it does not raise it.` },
  ],
  gens: [
    { id: 'osc-r4g1', type: 'nat', level: 2, exams: A, sub: 'multivibrators',
      make(r) {
        const R1 = pick(r, 5, 100, 1), R2 = pick(r, 5, 100, 1), C1 = choose(r, [1, 2.2, 4.7, 10, 22, 47]), C2 = choose(r, [1, 2.2, 4.7, 10, 22, 47]), ask = choose(r, ['f', 'duty']);
        const t1 = Math.LN2 * R1 * C1, t2 = Math.LN2 * R2 * C2; // microseconds (kOhm x nF)
        const val = ask === 'f' ? 1000 / (t1 + t2) : 100 * t1 / (t1 + t2);
        return { q: `A two-transistor astable multivibrator has $R_1 = ${R1}$ k$\\Omega$, $C_1 = ${C1}$ nF setting the first half-cycle and $R_2 = ${R2}$ k$\\Omega$, $C_2 = ${C2}$ nF setting the second; each half lasts $RC\\ln2$. ${ask === 'f' ? 'Its frequency is ______ kHz' : 'The first half-cycle takes ______ % of the period'} (to two decimal places).`,
          answer: round(val, 2), tol: ask === 'f' ? Math.max(0.01, round(val * 0.002, 2)) : 0.02, R1, R2, C1, C2, ask,
          sol: `$t_1 = 0.693\\times${R1}\\text{ k}\\Omega\\times${C1}\\text{ nF} = ${round(t1, 3)}\\ \\mu$s, $t_2 = 0.693\\times${R2}\\times${C2} = ${round(t2, 3)}\\ \\mu$s. ${ask === 'f' ? `$f = 1/(t_1 + t_2) = ${round(val, 2)}$ kHz.` : `Fraction $= t_1/(t_1 + t_2) = ${round(val, 2)}\\%$.`}`,
          trap: 'Leaving out $\\ln 2$ (0.693) or using one time constant for the whole period.' };
      },
      verify: (p) => { const t1 = Math.LN2 * p.R1 * p.C1, t2 = Math.LN2 * p.R2 * p.C2; return p.ask === 'f' ? 1000 / (t1 + t2) : 100 * t1 / (t1 + t2); } },
    { id: 'osc-r4g2', type: 'nat', level: 3, exams: G, sub: 'frequency stability',
      make(r) {
        const aL = pick(r, 10, 200, 10), aC = choose(r, [-1, 1]) * pick(r, 10, 300, 10), f0 = choose(r, [1, 2, 5, 10, 20]), dT = pick(r, 5, 40, 5);
        const coef = -(aL + aC) / 2, df = f0 * 1e6 * coef * 1e-6 * dT;
        return { q: `An LC oscillator runs at $${f0}$ MHz. Its inductance has a temperature coefficient of $+${aL}$ ppm/K and its capacitance one of $${aC > 0 ? '+' : ''}${aC}$ ppm/K. When it warms by $${dT}$ K its frequency changes by ______ Hz (give the sign; to the nearest hertz).`,
          answer: Math.round(df), tol: 1, aL, aC, f0, dT,
          sol: `$df/f = -\\tfrac12(\\alpha_L + \\alpha_C)\\,\\Delta T = -\\tfrac12(${aL} ${aC < 0 ? '-' : '+'} ${Math.abs(aC)})\\times${dT}$ ppm $= ${round(coef * dT, 1)}$ ppm. On $${f0}$ MHz that is $${Math.round(df)}$ Hz.`,
          trap: 'Forgetting the factor $-\\tfrac12$ from $f\\propto(LC)^{-1/2}$.' };
      },
      verify: (p) => p.f0 * -(p.aL + p.aC) / 2 * p.dT },
    { id: 'osc-r4g3', type: 'mcq', level: 2, exams: G, sub: 'phase-locked loop',
      make(r) {
        const fref = choose(r, [1, 4, 5, 10, 12.8, 20]), M = choose(r, [1, 1, 2, 4, 10]), N = int(r, 20, 400);
        const fout = fref * N / M;
        const show = (v) => `$${+v.toPrecision(4)}$ MHz`;
        const o = mcqOptions(r, fout, [fref * M / N, fref * N, fref / (N * M), fref * N * M], show);
        return { q: `A synthesiser ${M === 1 ? `takes a $${fref}$ MHz reference directly` : `divides a $${fref}$ MHz reference by $${M}$`} and compares it in a phase detector with its VCO output divided by $${N}$. In lock the VCO runs at`, ...o,
          sol: `In lock both phase-detector inputs have the same frequency: $f_{VCO}/${N} = ${fref}/${M}$ MHz, so $f_{VCO} = ${N}\\times${fref}/${M} = ${+fout.toPrecision(4)}$ MHz. The step size is $${+(fref / M).toPrecision(4)}$ MHz.`,
          trap: 'The divider in the feedback path multiplies the comparison frequency; the reference divider sets the step size.' };
      } },
  ],
};
