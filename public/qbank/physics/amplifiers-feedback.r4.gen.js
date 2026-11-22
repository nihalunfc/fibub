// Round 4 extras for amplifiers-feedback: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'af-r4-01', type: 'mcq', level: 1, exams: A, sub: 'decibels',
      q: R`Three voltage amplifier stages with gains of $20$ dB, $15$ dB and $-5$ dB (an attenuating filter) are cascaded without loading. The overall voltage gain is a factor of about`,
      options: [R`$31.6$`, R`$30$`, R`$1000$`, R`$1500$`], answer: 0,
      sol: R`Decibel gains add: $20 + 15 - 5 = 30$ dB. As a voltage ratio, $10^{30/20} = 10^{1.5} = 31.6$.`,
      trap: R`$30$ is the dB number itself; $1000$ is what $30$ dB means for a power ratio, not a voltage ratio.` },
    { id: 'af-r4-02', type: 'mcq', level: 2, exams: A, sub: 'positive feedback',
      q: R`An amplifier of gain $A = 10$ has a fraction $\beta = 0.05$ of its output added in phase to its input (positive feedback). The closed-loop gain is`,
      options: [R`$6.67$`, R`$10$`, R`$20$`, R`infinite (it oscillates)`], answer: 2,
      sol: R`With positive feedback $A_f = A/(1 - A\beta) = 10/(1 - 0.5) = 20$. The loop gain $A\beta = 0.5$ is below 1, so the circuit is stable, but the gain now depends strongly on $A$: a 10% rise in $A$ would raise $A_f$ to $11/0.45 = 24.4$.`,
      trap: R`$6.67$ is the negative-feedback answer $A/(1 + A\beta)$; oscillation needs $A\beta = 1$.` },
    { id: 'af-r4-03', type: 'nat', level: 2, exams: G, sub: 'power amplifiers',
      q: R`A power transistor may run with its junction at up to $150\,^\circ$C. Its thermal resistances are junction-to-case $1.5\,^\circ$C/W, case-to-sink $0.5\,^\circ$C/W and sink-to-air $3.0\,^\circ$C/W, in air at $25\,^\circ$C. The largest power it may dissipate continuously is ______ W.`,
      answer: 25, tol: 0.1, calc: () => (150 - 25) / (1.5 + 0.5 + 3.0),
      sol: R`Heat flows through the three thermal resistances in series: $\theta = 1.5 + 0.5 + 3.0 = 5.0\,^\circ$C/W. $T_j = T_a + P\theta$, so $P_{max} = (150 - 25)/5.0 = 25$ W.`,
      trap: R`Using only the sink-to-air resistance gives $41.7$ W and overheats the junction.` },
    { id: 'af-r4-04', type: 'nat', level: 3, exams: A, sub: 'power amplifiers',
      q: R`A series-fed class A stage has its collector resistor $R_C = 20\ \Omega$ to $V_{CC} = 20$ V and is biased at $V_{CE} = 10$ V, $I_C = 0.50$ A. The load is $R_C$ itself. With a sine-wave collector swing of $5.0$ V peak, its efficiency (signal power in $R_C$ over DC power from the supply) is ______ % (to two decimal places).`,
      answer: 6.25, tol: 0.05, calc: () => (5 ** 2 / (2 * 20)) / (20 * 0.5) * 100,
      sol: R`The supply current averages to the quiescent $0.50$ A whatever the signal, so $P_{DC} = 20\times0.50 = 10$ W. Signal power in $R_C$: $V_p^2/2R_C = 25/40 = 0.625$ W. Efficiency $= 0.625/10 = 6.25\%$. Even at the full $10$ V swing it reaches only $100/40/10 = 25\%$.`,
      trap: R`Taking the DC power as only $I_C^2R_C$ (the resistor's share) ignores the power wasted in the transistor.` },
    { id: 'af-r4-05', type: 'nat', level: 3, exams: G, sub: 'differential amplifier',
      q: R`A BJT differential pair (matched transistors, large $\beta$, $V_T = 25.85$ mV) has a constant tail current. The differential input voltage at which $90\%$ of the tail current flows in one transistor is ______ mV (to one decimal place).`,
      answer: 56.8, tol: 0.2, calc: () => 25.85 * Math.log(9),
      sol: R`Both emitters share a node, so $I_{C1}/I_{C2} = e^{(V_{BE1} - V_{BE2})/V_T} = e^{v_d/V_T}$. For a $90:10$ split the ratio is $9$: $v_d = V_T\ln9 = 25.85\times2.197 = 56.8$ mV. So the pair is linear only for $|v_d|$ of a few tens of millivolts and is fully switched by about $\pm0.1$ V.`,
      trap: R`Using the ratio $0.9$ (current fraction) instead of $0.9/0.1 = 9$ in the logarithm.` },
    { id: 'af-r4-06', type: 'mcq', level: 3, exams: G, sub: 'active load',
      q: R`A common-source MOSFET amplifier with $g_m = 2.0$ mA/V and output resistance $r_{o1} = 50$ k$\Omega$ uses a current-source load of output resistance $r_{o2} = 50$ k$\Omega$ instead of a drain resistor. Its small-signal voltage gain is`,
      options: [R`$-100$`, R`$-50$`, R`$-200$`, R`$-25$`], answer: 1,
      sol: R`The drain sees $r_{o1}$ and $r_{o2}$ in parallel: $25$ k$\Omega$. Gain $= -g_m(r_{o1}\parallel r_{o2}) = -2.0\times25 = -50$. An active load gives a large gain without a large drop of DC voltage.`,
      trap: R`Adding the two resistances (series) gives $-200$; using only $r_{o1}$ gives $-100$.` },
    { id: 'af-r4-07', type: 'mcq', level: 4, exams: G, sub: 'low-frequency response',
      q: R`A common-emitter stage is biased at $I_C = 1.0$ mA ($g_m = 40$ mA/V, large $\beta$, negligible source resistance) with $R_E = 1.0$ k$\Omega$ fully bypassed by $C_E = 100\ \mu$F. The low-frequency corner set by $C_E$ is about`,
      options: [R`$1.6$ Hz`, R`$0.16$ Hz`, R`$650$ Hz`, R`$65$ Hz`], answer: 3,
      sol: R`Looking into the emitter, the transistor shows about $1/g_m = 25\ \Omega$ (plus $R_s/\beta$, negligible here). $C_E$ therefore sees $R_E\parallel(1/g_m) = 1000\parallel25 = 24.4\ \Omega$, and the corner is $1/(2\pi\times100\times10^{-6}\times24.4) = 65$ Hz. This is why the emitter bypass capacitor, not the coupling capacitors, usually sets the lower cut-off.`,
      trap: R`Using $R_E$ alone ($1.6$ Hz) misses the low resistance looking back into the emitter.` },
    { id: 'af-r4-08', type: 'msq', level: 3, exams: G, sub: 'power amplifiers', format: 'statements',
      q: R`A complementary push-pull output stage is biased into class AB by two diodes between the bases, mounted on the same heat sink as the output transistors. Which statements are correct?`,
      options: [R`The diode drops keep both transistors just conducting at zero signal, which removes most crossover distortion.`, R`Thermal coupling makes the bias voltage fall as the output transistors heat up, which guards against thermal runaway.`, R`Its efficiency at full output is close to, but a little below, the ideal class B value of $78.5\%$.`, R`Its quiescent current is exactly zero, as in class B.`], answer: [0, 1, 2],
      sol: R`Each diode matches one $V_{BE}$, so both transistors sit at the edge of conduction and the dead band of about $\pm0.6$ V disappears. $V_{BE}$ at fixed current falls about 2 mV/K; if the diodes heat with the transistors, the bias voltage falls too and the idle current stays roughly constant. The small idle current wastes a little power, so efficiency is slightly below class B's $\pi/4$. A non-zero quiescent current is precisely what makes it class AB.`,
      trap: R`Class AB is not "class A plus class B" efficiency; it is class B with a small idle current.` },
    { id: 'af-r4-09', type: 'msq', level: 4, exams: G, sub: 'differential amplifier', format: 'statements',
      q: R`A BJT differential pair has collector resistors $R_C$ (matched), transconductance $g_m$ per transistor, and a tail current source of output resistance $R_{EE}\gg1/g_m$. Which statements are correct?`,
      options: [R`The differential gain taken from one collector is $g_mR_C/2$ in magnitude.`, R`Taking the output between the two collectors doubles the differential gain.`, R`The common-mode gain from one collector is about $R_C/2R_{EE}$ in magnitude.`, R`With double-ended output, the CMRR stays infinite even if the two $R_C$ are slightly mismatched.`], answer: [0, 1, 2],
      sol: R`A differential input $v_d$ puts $\pm v_d/2$ on each base, so each collector current changes by $g_mv_d/2$ and each collector voltage by $g_mR_Cv_d/2$; between the collectors this doubles to $g_mR_Cv_d$. A common-mode input drives both emitters, and the tail resistor carries the combined change, so each half sees $2R_{EE}$ in its emitter: gain $\approx R_C/2R_{EE}$. With double-ended output equal common-mode swings cancel, but only if the halves match; a mismatch $\Delta R_C$ leaves a common-mode gain $\approx\Delta R_C/2R_{EE}$ and a finite CMRR.`,
      trap: R`Perfect cancellation needs perfect matching; real CMRR is limited by mismatch as well as by $R_{EE}$.` },
    { id: 'af-r4-10', type: 'mcq', level: 4, exams: G, sub: 'bandwidth extension',
      q: R`An amplifier with DC gain $10^5$ and a single pole at $10$ Hz is given resistive negative feedback for a closed-loop gain of about $100$. For a small input step, the 10% to 90% rise time of the output is about`,
      options: [R`$35$ ms`, R`$350\ \mu$s`, R`$35\ \mu$s`, R`$3.5\ \mu$s`], answer: 2,
      sol: R`Feedback with $1 + A_0\beta = 10^5/100 = 10^3$ moves the pole to $10\times10^3 = 10$ kHz. A single-pole system has rise time $t_r = 2.2\tau = 0.35/f_{3dB} = 0.35/10^4 = 35\ \mu$s.`,
      trap: R`Using the open-loop $10$ Hz pole gives $35$ ms; feedback widens the bandwidth by the factor $1 + A_0\beta$.` },
    { id: 'af-r4-11', type: 'mcq', level: 5, exams: G, sub: 'cascode',
      q: R`An NMOS cascode (common-source device under a common-gate device) has both transistors with $g_m = 2.0$ mA/V and $r_o = 50$ k$\Omega$ (body effect ignored). With an ideal current-source load, the magnitude of its low-frequency voltage gain is about`,
      options: [R`$100$`, R`$200$`, R`$5000$`, R`$1.0\times10^4$`], answer: 3,
      sol: R`Output resistance looking into the cascode: $R_{out} = r_{o1} + r_{o2} + g_{m2}r_{o2}r_{o1} = 50\text{ k} + 50\text{ k} + 2\times10^{-3}\times(5\times10^4)^2 = 5.1$ M$\Omega$. With an ideal load all of $g_{m1}v_{in}$ flows into $R_{out}$: $|A_v| = g_{m1}R_{out} = 2\times10^{-3}\times5.1\times10^6\approx1.0\times10^4$, the square of the intrinsic gain $g_mr_o = 100$.`,
      trap: R`$100$ is a single stage's intrinsic gain; the cascode multiplies the output resistance by about $g_mr_o$.` },
    { id: 'af-r4-12', type: 'nat', level: 4, exams: G, sub: 'current sources',
      q: R`A Widlar current source has a reference current of $1.0$ mA in the diode-connected transistor and must deliver $10\ \mu$A from the output transistor, which has an emitter resistor $R_E$. With matched transistors, large $\beta$ and $V_T = 25$ mV, $R_E$ is ______ k$\Omega$ (to two decimal places).`,
      answer: 11.51, tol: 0.03, calc: () => 0.025 * Math.log(100) / 10e-6 / 1000,
      sol: R`The two bases share a node: $V_{BE1} = V_{BE2} + I_{out}R_E$. With $V_{BE} = V_T\ln(I/I_S)$, $I_{out}R_E = V_T\ln(I_{ref}/I_{out})$. So $R_E = 0.025\times\ln100/(10\times10^{-6}) = 0.025\times4.605/10^{-5} = 11.51$ k$\Omega$. A plain mirror would need a $1/100$ area ratio, or a $\sim 1$ M$\Omega$ resistor to get $10\ \mu$A from a supply.`,
      trap: R`Dividing by the reference current instead of the output current gives a resistor 100 times too small.` },
  ],
  gens: [
    { id: 'af-r4g1', type: 'nat', level: 2, exams: G, sub: 'power amplifiers',
      make(r) {
        const Tj = choose(r, [125, 150, 175]), Ta = choose(r, [25, 35, 40, 50]), jc = pick(r, 0.5, 2.0, 0.1), cs = pick(r, 0.1, 0.5, 0.1), sa0 = pick(r, 1, 8, 0.5);
        const P = round((Tj - Ta) / (jc + cs + sa0), 1), sa = (Tj - Ta) / P - jc - cs;
        return { q: `A transistor must dissipate $${P}$ W with its junction no hotter than $${Tj}\\,^\\circ$C in air at $${Ta}\\,^\\circ$C. Its junction-to-case thermal resistance is $${jc}\\,^\\circ$C/W and the case-to-sink interface adds $${cs}\\,^\\circ$C/W. The largest allowed sink-to-air thermal resistance is ______ $^\\circ$C/W (to two decimal places).`,
          answer: round(sa, 2), tol: 0.02, P, Tj, Ta, jc, cs,
          sol: `Total allowed: $\\theta = (T_j - T_a)/P = (${Tj} - ${Ta})/${P} = ${round((Tj - Ta) / P, 3)}\\,^\\circ$C/W. Subtract the fixed parts: $\\theta_{sa} = ${round((Tj - Ta) / P, 3)} - ${jc} - ${cs} = ${round(sa, 2)}\\,^\\circ$C/W.`,
          trap: 'Forgetting to subtract the junction-to-case and interface resistances, which are in series with the heat sink.' };
      },
      verify: (p) => (p.Tj - p.Ta) / p.P - p.jc - p.cs },
    { id: 'af-r4g2', type: 'nat', level: 3, exams: G, sub: 'differential amplifier',
      make(r) {
        const ask = choose(r, ['frac', 'vd']), VT = 25.85;
        if (ask === 'frac') {
          const vd = pick(r, 5, 100, 5), f = 100 / (1 + Math.exp(-vd / VT));
          return { q: `A BJT differential pair (matched, large $\\beta$, $V_T = 25.85$ mV) has a constant tail current. With a differential input of $${vd}$ mV, the percentage of the tail current carried by the transistor whose base is higher is ______ % (to one decimal place).`,
            answer: round(f, 1), tol: 0.1, ask, vd,
            sol: `$I_{C1}/I_{C2} = e^{v_d/V_T} = e^{${vd}/25.85} = ${round(Math.exp(vd / VT), 3)}$, so $I_{C1}/I_{EE} = 1/(1 + e^{-v_d/V_T}) = ${round(f, 1)}\\%$.`,
            trap: 'Using the linear small-signal law $\\tfrac12 + v_d/4V_T$ far outside its range of validity.' };
        }
        const pct = choose(r, [60, 70, 75, 80, 90, 95, 99]), vd = VT * Math.log(pct / (100 - pct));
        return { q: `A BJT differential pair (matched, large $\\beta$, $V_T = 25.85$ mV) has a constant tail current. The differential input that steers $${pct}\\%$ of the tail current into one transistor is ______ mV (to one decimal place).`,
          answer: round(vd, 1), tol: 0.1, ask, pct,
          sol: `$I_{C1}/I_{C2} = ${pct}/${100 - pct} = e^{v_d/V_T}$, so $v_d = 25.85\\ln(${round(pct / (100 - pct), 4)}) = ${round(vd, 1)}$ mV.`,
          trap: `Using $\\ln(${pct / 100})$ (the fraction) instead of the ratio of the two currents.` };
      },
      verify: (p) => (p.ask === 'frac' ? 100 / (1 + Math.exp(-p.vd / 25.85)) : 25.85 * Math.log(p.pct / (100 - p.pct))) },
    { id: 'af-r4g3', type: 'mcq', level: 4, exams: G, sub: 'current sources',
      make(r) {
        const Iref = choose(r, [0.5, 1, 2, 5]), ratio = choose(r, [5, 10, 20, 50, 100]), Iout = Iref / ratio; // mA
        const RE = 0.025 * Math.log(ratio) / Iout; // kOhm
        const o = mcqOptions(r, round(RE, 2), [round(0.025 * Math.log(ratio) / Iref, 2), round(0.025 / Iout, 2), round(0.025 * ratio / Iout / 10, 2), round(0.025 * Math.log10(ratio) / Iout, 2)], (v) => `$${v.toFixed(2)}$ k$\\Omega$`);
        return { q: `A Widlar current source (matched BJTs, large $\\beta$, $V_T = 25$ mV) has a reference current of $${Iref}$ mA and must deliver $${round(Iout * 1000, 2)}\\ \\mu$A. The emitter resistor of the output transistor is`, ...o,
          sol: `$V_{BE1} - V_{BE2} = I_{out}R_E$ and $V_{BE1} - V_{BE2} = V_T\\ln(I_{ref}/I_{out}) = 0.025\\ln${ratio} = ${round(0.025 * Math.log(ratio) * 1000, 2)}$ mV. So $R_E = ${round(0.025 * Math.log(ratio) * 1000, 2)}\\text{ mV}/${round(Iout * 1000, 2)}\\ \\mu\\text{A} = ${round(RE, 2)}$ k$\\Omega$.`,
          trap: 'Dividing by the reference current, or using $\\log_{10}$ in place of $\\ln$.' };
      } },
  ],
};
