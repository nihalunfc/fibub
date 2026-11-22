// Round 4 extras for transistors: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const REG = { cut: 'cut-off (no channel)', tri: 'triode (linear, ohmic) region', sat: 'saturation (active, constant-current) region', brk: 'breakdown' };

export default {
  items: [
    { id: 'bjt-r4-01', type: 'mcq', level: 1, exams: A, sub: 'basics',
      q: R`In the circuit symbol of an npn bipolar transistor, the arrow on the emitter points`,
      options: [R`into the transistor`, R`out of the collector`, R`out of the transistor`, R`into the base`],
      answer: 2,
      sol: R`The arrow shows the direction of conventional current through the base-emitter junction when it is forward biased: from p (base) to n (emitter), i.e. out of the npn transistor at the emitter. In a pnp transistor it points in ("Pointing iN Proudly" is one memory aid).`,
      trap: R`Following the electron flow: in an npn device electrons enter at the emitter, opposite to the arrow.` },
    { id: 'bjt-r4-02', type: 'nat', level: 2, exams: A, sub: 'power', unit: 'mW',
      q: R`A transistor in its active region carries $I_C = 20$ mA with $V_{CE} = 4.5$ V, and $I_B = 0.20$ mA with $V_{BE} = 0.70$ V. The power it dissipates is ______ mW (to the nearest whole number).`,
      answer: 90, tol: 0.5, calc: () => 20 * 4.5 + 0.2 * 0.7,
      sol: R`Power is voltage times current at each port: $P = V_{CE}I_C + V_{BE}I_B = (4.5)(20) + (0.70)(0.20) = 90 + 0.14 = 90.1$ mW, almost all of it at the collector junction. That is the figure to compare with the device's power rating (and to use for heat-sink sizing).`,
      trap: R`Using $V_{CC}I_C$: the part of the supply dropped across the load resistor is dissipated there, not in the transistor.` },
    { id: 'bjt-r4-03', type: 'mcq', level: 2, exams: A, sub: 'MOSFETs',
      q: R`An n-channel enhancement MOSFET has threshold $V_T = 1.0$ V. With $V_{GS} = 3.0$ V and $V_{DS} = 1.5$ V it operates in`,
      options: [R`the triode (linear) region`, R`saturation`, R`cut-off`, R`breakdown`],
      answer: 0,
      sol: R`The channel exists because $V_{GS} > V_T$. It is pinched off at the drain end only if $V_{DS}\ge V_{GS} - V_T = 2.0$ V. Here $V_{DS} = 1.5$ V $< 2.0$ V, so the channel is continuous and the device is in the triode region, acting like a voltage-controlled resistor.`,
      trap: R`Comparing $V_{DS}$ with $V_T$ instead of with the overdrive $V_{GS} - V_T$.` },
    { id: 'bjt-r4-04', type: 'nat', level: 3, exams: A, sub: 'biasing', unit: 'mA',
      q: R`A common-emitter stage uses collector-feedback bias: $R_C = 2.0$ k$\Omega$ from $V_{CC} = 12$ V to the collector, and $R_B = 200$ k$\Omega$ from the collector to the base (emitter grounded). With $\beta = 100$ and $V_{BE} = 0.70$ V, the collector current is ______ mA (to two decimal places).`,
      answer: 2.81, tol: 0.03, calc: () => 100 * 11.3 / (200e3 + 101 * 2e3) * 1e3,
      sol: R`$R_C$ carries both $I_C$ and $I_B$, i.e. $(\beta + 1)I_B$. Round the loop $V_{CC}\to R_C\to R_B\to$ base-emitter: $12 = (\beta + 1)I_BR_C + I_BR_B + 0.70$. So $I_B = \dfrac{11.3}{(101)(2.0\text{ k}) + 200\text{ k}} = \dfrac{11.3}{402\text{ k}} = 28.1\ \mu$A and $I_C = 100I_B = 2.81$ mA. Then $V_{CE} = 12 - 101\times28.1\ \mu\text{A}\times2.0$ k $= 6.3$ V: active, and if $\beta$ rises, $V_C$ falls and pulls $I_B$ down, which stabilises the bias.`,
      trap: R`Treating $R_B$ as going to $V_{CC}$ (fixed bias) gives $5.65$ mA; the feedback comes from the collector voltage.` },
    { id: 'bjt-r4-05', type: 'msq', level: 3, exams: A, sub: 'thermal stability', format: 'statements',
      q: R`Which statements about temperature effects in a silicon BJT amplifier are correct?`,
      options: [R`At fixed $V_{BE}$, the collector current rises as the transistor warms up.`, R`An emitter resistor provides negative feedback that reduces the drift of $I_C$ with temperature.`, R`At fixed collector current, $V_{BE}$ falls by roughly $2$ mV per kelvin.`, R`Thermal runaway is more likely when the bias circuit has a large emitter resistor.`],
      answer: [0, 1, 2],
      sol: R`$I_C\approx I_Se^{V_{BE}/V_T}$ and $I_S$ grows steeply with temperature, so at fixed $V_{BE}$ the current climbs; equivalently, at fixed current $V_{BE}$ falls by about $2$ mV/K. If more current heats the junction further, the loop can run away. An emitter resistor turns a rise in $I_C$ into a rise in $V_E$, which lowers $V_{BE}$ and opposes the change: a large $R_E$ makes runaway less likely, not more.`,
      trap: R`Mixing up the two descriptions ("$V_{BE}$ falls" and "$I_C$ rises") as if they contradicted each other; they are the same physics at different constraints.` },
    { id: 'bjt-r4-06', type: 'mcq', level: 3, exams: A, sub: 'frequency response',
      q: R`A cascode stage (a common-emitter transistor feeding a common-base transistor) is used instead of a single common-emitter stage mainly because it`,
      options: [R`has a much lower output resistance`, R`keeps the voltage gain of the first transistor near $-1$, so its base-collector capacitance is hardly Miller-multiplied and the bandwidth is wider`, R`doubles the voltage gain by placing two transistors in parallel`, R`needs no biasing at all`],
      answer: 1,
      sol: R`In a plain CE stage $C_\mu$ appears at the input multiplied by $(1 + |A_v|)$ (Miller effect), which kills the high-frequency response. In the cascode the first transistor's collector sees the low input resistance $\approx r_e$ of the common-base transistor, so its own gain is about $-1$ and $C_\mu$ is only doubled. The full voltage gain appears at the second collector. A bonus is a very high output resistance.`,
      trap: R`Thinking the extra transistor adds gain: the gain is about the same as one CE stage; it is the bandwidth that improves.` },
    { id: 'bjt-r4-07', type: 'nat', level: 4, exams: A, sub: 'small signal',
      q: R`A common-emitter amplifier runs at $I_C = 1.0$ mA ($V_T = 25$ mV, $\beta$ large). Its emitter resistance is split: $200\ \Omega$ unbypassed, the rest fully bypassed. $R_C = 4.7$ k$\Omega$ and the output drives a $4.7$ k$\Omega$ load through a large capacitor. The magnitude of the mid-band voltage gain is ______ (to two decimal places).`,
      answer: 10.44, tol: 0.05, calc: () => 2350 / 225,
      sol: R`$r_e = V_T/I_C = 25\ \Omega$. The unbypassed part stays in the emitter for ac: $|A_v| = \dfrac{R_C\parallel R_L}{r_e + R_{E1}} = \dfrac{2350}{25 + 200} = 10.44$. The gain is lower than with full bypass ($2350/25 = 94$), but it now depends mainly on resistor values, not on the temperature-dependent $r_e$.`,
      trap: R`Forgetting the load ($4700/225 = 20.9$) or the unbypassed resistor ($94$).` },
    { id: 'bjt-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'differential amplifiers',
      q: R`A BJT differential pair (matched transistors, constant tail current, $V_T = 25$ mV) has a differential input voltage $v_d$. To steer $99\%$ of the tail current into one transistor, $v_d$ must be about`,
      options: [R`$25$ mV`, R`$58$ mV`, R`$700$ mV`, R`$115$ mV`],
      answer: 3,
      sol: R`The two collector currents follow $I_{C1}/I_{C2} = e^{v_d/V_T}$ (same $I_S$, emitters joined). For $99:1$, $v_d = V_T\ln99 = 25\times4.60 = 115$ mV. So the pair is linear only for $|v_d|$ well below $V_T$, and a few hundred millivolts switch it fully, which is why it also serves as a fast current switch (ECL logic).`,
      trap: R`$58$ mV is $V_T\ln10$ (a 10:1 split); $700$ mV is the turn-on voltage of one junction, irrelevant to the difference.` },
    { id: 'bjt-r4-09', type: 'msq', level: 4, exams: A, sub: 'power amplifiers', format: 'statements',
      q: R`Which statements about the maximum theoretical efficiency of power amplifier stages (sine-wave output) are correct?`,
      options: [R`Class A with a transformer-coupled load: $50\%$.`, R`Class B push-pull: $\pi/4\approx78.5\%$.`, R`Class B push-pull has no crossover distortion, since one transistor always conducts.`, R`Class A with the load resistor in the collector circuit: $25\%$.`],
      answer: [0, 1, 3],
      sol: R`Class A draws its quiescent current all the time; with a series load resistor half the supply voltage sits across it at rest and the best efficiency is $25\%$; a transformer lets the collector swing to $2V_{CC}$, doubling it to $50\%$. Class B transistors conduct for half a cycle each and draw supply current only when delivering power, giving $\pi/4$. But each needs about $0.7$ V of drive before it turns on, so near zero crossing neither conducts: crossover distortion, fixed in class AB by a small bias.`,
      trap: R`Assuming class B is free of distortion because it is push-pull: the dead band of $\pm0.7$ V is exactly the crossover problem.` },
    { id: 'bjt-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'current sources', unit: R`k$\Omega$`,
      q: R`A Widlar current source uses a matched pair with reference current $1.0$ mA in the diode-connected transistor and a resistor $R_E$ in the emitter of the output transistor. For an output current of $10\ \mu$A ($V_T = 25$ mV, $\beta$ large), $R_E$ must be ______ k$\Omega$ (to two decimal places).`,
      answer: 11.51, tol: 0.05, calc: () => 0.025 / 1e-5 * Math.log(100) / 1e3,
      sol: R`The bases are joined, so $V_{BE1} = V_{BE2} + I_OR_E$. With $V_{BE} = V_T\ln(I/I_S)$: $I_OR_E = V_T\ln\dfrac{I_{\rm REF}}{I_O}$, so $R_E = \dfrac{V_T}{I_O}\ln\dfrac{I_{\rm REF}}{I_O} = \dfrac{0.025}{10^{-5}}\ln100 = 2500\times4.605 = 11.51$ k$\Omega$. A plain resistor scaling ($V/I$) would need far more: the logarithm makes small currents cheap in resistance, which suits ICs.`,
      trap: R`Using $R_E = V_{BE}/I_O = 70$ k$\Omega$, as if the output transistor's $V_{BE}$ were zero.` },
  ],
  gens: [
    { id: 'bjt-r4g1', type: 'nat', level: 3, exams: A, sub: 'biasing',
      make(r) {
        const VCC = choose(r, [9, 10, 12, 15]), RC = choose(r, [1, 1.5, 2, 2.2, 3.3]), RB = choose(r, [100, 150, 220, 330, 470]), b = choose(r, [50, 80, 100, 150, 200]);
        let IB = (VCC - 0.7) / ((b + 1) * RC + RB); // mA with k-ohms
        const IC = b * IB, VCE = VCC - (b + 1) * IB * RC;
        return { q: R`A collector-feedback biased stage has $V_{CC} = ${VCC}$ V, $R_C = ${RC}$ k$\Omega$ (supply to collector) and $R_B = ${RB}$ k$\Omega$ (collector to base), emitter grounded, $\beta = ${b}$, $V_{BE} = 0.7$ V. The collector current is ______ mA (to three decimal places).`,
          answer: round(IC, 3), tol: Math.max(0.002, round(IC * 0.005, 3)), unit: 'mA', VCC, RC, RB, b,
          sol: R`$R_C$ carries $(\beta + 1)I_B$: $V_{CC} - 0.7 = I_B[(\beta + 1)R_C + R_B]$, so $I_B = \dfrac{${round(VCC - 0.7, 1)}}{${b + 1}\times${RC} + ${RB}}$ mA $= ${round(IB * 1e3, 2)}\ \mu$A and $I_C = \beta I_B = ${round(IC, 3)}$ mA ($V_{CE} = ${round(VCE, 2)}$ V, so the transistor is active).`,
          trap: 'The current in R_C includes the base current fed back through R_B.' };
      },
      verify: (p) => p.b * (p.VCC - 0.7) / ((p.b + 1) * p.RC + p.RB) },
    { id: 'bjt-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'current sources',
      make(r) {
        const Iref = choose(r, [0.5, 1, 2]), Io = choose(r, [5, 10, 20, 25, 50, 100]); // mA, uA
        const RE = 0.025 / (Io * 1e-6) * Math.log(Iref * 1e3 / Io) / 1e3;
        return { q: R`A Widlar current source has a reference current of $${Iref}$ mA. For an output current of $${Io}\ \mu$A ($V_T = 25$ mV, matched transistors, $\beta$ large) the emitter resistor must be ______ k$\Omega$ (to two decimal places).`,
          answer: round(RE, 2), tol: Math.max(0.01, round(RE * 0.005, 2)), unit: R`k$\Omega$`, Iref, Io,
          sol: R`$I_OR_E = V_T\ln(I_{\rm REF}/I_O)$, so $R_E = \dfrac{0.025}{${Io}\times10^{-6}}\ln\dfrac{${Iref * 1e3}}{${Io}} = ${round(0.025 / (Io * 1e-6), 1)}\ \Omega\times${round(Math.log(Iref * 1e3 / Io), 4)} = ${round(RE, 2)}$ k$\Omega$.`,
          trap: 'The emitter resistor drops only the difference of the two base-emitter voltages.' };
      },
      verify: (p) => 0.025 / (p.Io * 1e-6) * Math.log(p.Iref * 1e3 / p.Io) / 1e3 },
    { id: 'bjt-r4g3', type: 'mcq', level: 2, exams: A, sub: 'MOSFETs',
      make(r) {
        const VT = choose(r, [0.5, 0.7, 1, 1.5, 2]), VGS = choose(r, [0.3, 1, 2, 2.5, 3, 4, 5]), VDS = choose(r, [0.2, 0.5, 1, 2, 3, 5]);
        const ov = round(VGS - VT, 2);
        const reg = ov <= 0 ? 'cut' : VDS < ov ? 'tri' : 'sat';
        const o = mcqOptions(r, REG[reg], ['cut', 'tri', 'sat', 'brk'].filter((x) => x !== reg).map((x) => REG[x]), (v) => v);
        return { q: R`An n-channel enhancement MOSFET has $V_T = ${VT}$ V. With $V_{GS} = ${VGS}$ V and $V_{DS} = ${VDS}$ V it operates in`, ...o,
          sol: reg === 'cut' ? R`$V_{GS} = ${VGS}$ V does not exceed $V_T = ${VT}$ V, so no channel forms: cut-off, $I_D\approx0$.`
            : R`The overdrive is $V_{GS} - V_T = ${ov}$ V. ${reg === 'tri' ? R`$V_{DS} = ${VDS}$ V is below it, so the channel reaches the drain: triode region.` : R`$V_{DS} = ${VDS}$ V is at least that, so the channel is pinched off at the drain: saturation, where $I_D$ hardly depends on $V_{DS}$.`}`,
          trap: 'Compare V_DS with the overdrive V_GS − V_T, not with V_T.' };
      } },
  ],
};
