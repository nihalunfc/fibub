// Round 5 extras for semiconductor-devices: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'sd-r5-01', type: 'mcq', level: 1, exams: G, sub: 'thyristors',
      q: R`A thyristor (pnpn) is modelled as a pnp and an npn transistor wired so that each one's collector feeds the other's base. With common-base gains $\alpha_1$ and $\alpha_2$, the device latches on (current limited only by the outside circuit) when`,
      options: [R`$\alpha_1 + \alpha_2$ reaches 1`, R`$\alpha_1\alpha_2$ reaches 1`, R`$\alpha_1 = \alpha_2$`, R`either $\alpha$ reaches 0.5`], answer: 0,
      sol: R`The anode current is $I_A = I_{leak}/[1 - (\alpha_1 + \alpha_2)]$ in the two-transistor model: each transistor's collector current is the other's base drive, so the loop gain is $\alpha_1 + \alpha_2$. As the current rises, both $\alpha$ values rise, and when their sum reaches 1 the denominator vanishes and the current runs away until the outside circuit limits it. The gate current simply helps push the sum to 1.`,
      trap: R`The product of the $\beta$ values reaching 1 is an equivalent statement, but the product of the $\alpha$ values can never reach 1.` },
    { id: 'sd-r5-02', type: 'nat', level: 2, exams: G, sub: 'pass transistor',
      q: R`A single nMOS transistor is used as a switch (pass transistor). Its gate is at $V_{DD} = 1.8$ V, its threshold is $0.45$ V (ignore the body effect), and it charges a capacitor from a $1.8$ V input. The capacitor voltage stops rising at ______ V.`,
      answer: 1.35, tol: 0.01, calc: () => 1.8 - 0.45,
      sol: R`The capacitor side acts as the source. The nMOS conducts only while $V_{GS} = 1.8 - V_C > V_T = 0.45$ V, so the current dies away as $V_C$ approaches $1.8 - 0.45 = 1.35$ V. An nMOS passes a strong 0 but a weak 1; a CMOS transmission gate adds a pMOS in parallel to pass the full $1.8$ V.`,
      trap: R`The input is $1.8$ V but the transistor turns off a threshold below its gate voltage; with the body effect included the loss is even larger.` },
    { id: 'sd-r5-03', type: 'nat', level: 3, exams: G, sub: 'diode switching',
      q: R`A pn diode with minority-carrier lifetime $\tau = 10$ ns carries a forward current $I_F = 10$ mA. The circuit suddenly reverses it to drive a reverse current $I_R = 5$ mA. Using the charge-control result $t_s = \tau\ln(1 + I_F/I_R)$, the storage time (during which the reverse current stays at $I_R$) is ______ ns.`,
      answer: 10.99, tol: 0.1, calc: () => 10 * Math.log(1 + 10 / 5),
      sol: R`Stored charge obeys $dQ/dt = -I_R - Q/\tau$ after the switch, starting from $Q(0) = I_F\tau$. Solving, $Q(t) = (I_F + I_R)\tau e^{-t/\tau} - I_R\tau$, which reaches zero when $e^{-t/\tau} = I_R/(I_F + I_R)$, i.e. $t_s = \tau\ln(1 + I_F/I_R) = 10\ln3 = 10.99$ ns. A harder reverse drive pulls the charge out faster.`,
      trap: R`Taking $t_s = \tau I_F/I_R = 20$ ns ignores recombination, which removes charge at the same time.` },
    { id: 'sd-r5-04', type: 'mcq', level: 3, exams: G, sub: 'Schottky diodes',
      q: R`The reverse saturation current of a Schottky diode follows $I_s = AA^*T^2e^{-e\phi_B/k_BT}$. A change in surface preparation lowers the barrier height $\phi_B$ by $0.060$ V at $300$ K ($k_BT/e = 25.85$ mV). The saturation current is multiplied by about`,
      options: [R`$2.3$`, R`$1.06$`, R`$60$`, R`$10.2$`], answer: 3,
      sol: R`Only the exponential changes: the ratio is $e^{0.060/0.02585} = e^{2.321} = 10.2$. A barrier change of about $60$ mV at room temperature changes the current by a decade, the same $\ln10\,k_BT/e$ rule as for any thermally activated current.`,
      trap: R`$2.3$ is the exponent, not the factor; $60$ mistakes millivolts for a ratio.` },
    { id: 'sd-r5-05', type: 'msq', level: 3, exams: G, sub: 'temperature', format: 'statements',
      q: R`Consider how device currents change as temperature rises. Which statements are correct?`,
      options: [R`A BJT held at fixed $V_{BE}$ carries more collector current, which can lead to thermal runaway.`, R`A power MOSFET driven at a large fixed $V_{GS}$ carries less drain current, because the falling mobility wins over the falling threshold.`, R`The threshold voltage of a MOSFET rises with temperature.`, R`Paralleled power MOSFETs at large $V_{GS}$ tend to share current evenly, since a hotter device takes less current.`], answer: [0, 1, 3],
      sol: R`At fixed $V_{BE}$, $I_C\propto T^3e^{-E_g/k_BT}e^{eV_{BE}/k_BT}$ rises roughly 8% per kelvin in silicon; more current heats the device more, the runaway loop. In a MOSFET two effects compete: $V_T$ falls with temperature (more current) and mobility falls (less current). At large overdrive the mobility term dominates, so the current falls; this negative feedback makes parallel MOSFETs share current. Only near threshold does the current rise with temperature.`,
      trap: R`The threshold voltage falls (about $-2$ mV/K), not rises; the even current sharing comes from mobility.` },
    { id: 'sd-r5-06', type: 'nat', level: 3, exams: G, sub: 'velocity saturation',
      q: R`In a very short MOSFET the carriers move at their saturation velocity $v_{sat}$ all along the channel, so $I_D = WC_{ox}v_{sat}(V_{GS} - V_T)$. With $W = 10\ \mu$m, $C_{ox} = 10$ fF/$\mu$m$^2$ and $v_{sat} = 1.0\times10^5$ m/s, its transconductance is ______ mS.`,
      answer: 10, tol: 0.1, calc: () => 10e-6 * 1e-2 * 1e5 * 1e3,
      sol: R`$g_m = \partial I_D/\partial V_{GS} = WC_{ox}v_{sat}$. Convert: $C_{ox} = 10$ fF/$\mu$m$^2 = 10\times10^{-15}/10^{-12}$ F/m$^2 = 10^{-2}$ F/m$^2$. Then $g_m = 10^{-5}\times10^{-2}\times10^5 = 10^{-2}$ S $= 10$ mS, independent of the bias and of the channel length.`,
      trap: R`Using the long-channel $g_m = 2I_D/V_{ov}$ does not apply here: the current is linear, not quadratic, in the overdrive.` },
    { id: 'sd-r5-07', type: 'mcq', level: 4, exams: G, sub: 'BJT speed',
      q: R`A BJT runs at $I_C = 2.0$ mA ($V_T = 25$ mV). Its forward transit time is $\tau_F = 15$ ps, the emitter-base depletion capacitance is $0.80$ pF and $C_\mu = 0.10$ pF. Its unity-gain frequency $f_T = g_m/[2\pi(C_\pi + C_\mu)]$, with $C_\pi$ = diffusion + depletion parts, is about`,
      options: [R`$6.06$ GHz`, R`$6.37$ GHz`, R`$10.6$ GHz`, R`$14.1$ GHz`], answer: 0,
      sol: R`$g_m = I_C/V_T = 80$ mS. Diffusion capacitance $C_{de} = g_m\tau_F = 0.080\times15\times10^{-12} = 1.20$ pF. So $C_\pi = 1.20 + 0.80 = 2.00$ pF, and $C_\pi + C_\mu = 2.10$ pF. $f_T = 0.080/(2\pi\times2.10\times10^{-12}) = 6.06$ GHz.`,
      trap: R`Leaving out $C_\mu$ gives $6.37$ GHz; using only the diffusion capacitance gives $10.6$ GHz; forgetting it gives $14.1$ GHz.` },
    { id: 'sd-r5-08', type: 'msq', level: 5, exams: G, sub: 'velocity saturation', format: 'statements',
      q: R`Compare a long-channel MOSFET (square law) with a fully velocity-saturated one, $I_D = WC_{ox}v_{sat}V_{ov}$, where $V_{ov} = V_{GS} - V_T$. For the velocity-saturated device, which statements are correct?`,
      options: [R`The drain current grows linearly, not quadratically, with $V_{ov}$.`, R`$g_m$ no longer depends on the channel length $L$.`, R`$f_T = g_m/(2\pi C_{gs})$ with $C_{gs}\propto WL$ scales as $1/L$ instead of $1/L^2$.`, R`$g_m/I_D$ is larger than the long-channel value $2/V_{ov}$ at the same overdrive.`], answer: [0, 1, 2],
      sol: R`$I_D\propto V_{ov}$, so $g_m = WC_{ox}v_{sat}$, with no $L$ in it. Since $C_{gs}\propto WLC_{ox}$, $f_T\propto v_{sat}/L$: shrinking still helps, but only linearly (the long-channel result is $\mu V_{ov}/L^2$). The efficiency $g_m/I_D = 1/V_{ov}$ is half the long-channel $2/V_{ov}$, so velocity saturation costs transconductance per unit current.`,
      trap: R`$g_m/I_D$ falls, not rises: a linear law has a smaller logarithmic slope than a square law.` },
    { id: 'sd-r5-09', type: 'mcq', level: 4, exams: G, sub: 'diode switching',
      q: R`A diode with lifetime $\tau$ carries $I_F = 10$ mA and is then switched to reverse. Using $t_s = \tau\ln(1 + I_F/I_R)$, what reverse current $I_R$ makes the storage time exactly equal to $\tau$?`,
      options: [R`$10$ mA`, R`$5.8$ mA`, R`$3.7$ mA`, R`$17$ mA`], answer: 1,
      sol: R`$t_s = \tau$ needs $\ln(1 + I_F/I_R) = 1$, so $I_F/I_R = e - 1 = 1.718$ and $I_R = 10/1.718 = 5.82$ mA.`,
      trap: R`$I_R = I_F$ gives $t_s = \tau\ln2 = 0.69\tau$; $17$ mA is $I_F(e - 1)$, the ratio inverted.` },
    { id: 'sd-r5-10', type: 'mcq', level: 2, exams: A, sub: 'device types',
      q: R`An insulated-gate bipolar transistor (IGBT), common in motor drives and inverters, combines`,
      options: [R`a bipolar input with a MOSFET output, for low drive power`, R`a Schottky diode and a JFET, for fast switching at low voltage`, R`a MOS-gated input with bipolar conduction in the main path, giving easy drive and a low on-state voltage at high current`, R`two MOSFETs in a CMOS pair, so it draws no static current`], answer: 2,
      sol: R`The IGBT is driven like a MOSFET (insulated gate, almost no gate current), but its main current path injects minority carriers from a p$^+$ layer, so the drift region is flooded with carriers (conductivity modulation) as in a bipolar device. The result is a low on-state voltage at high current and voltage, at the cost of slower turn-off.`,
      trap: R`It is the other way round from the first option: the MOS part is the input, the bipolar part carries the load current.` },
  ],
  gens: [
    { id: 'sd-r5g1', type: 'nat', level: 3, exams: G, sub: 'diode switching',
      make(r) {
        const tau = pick(r, 2, 50, 1), IF = pick(r, 2, 40, 1), IR = pick(r, 1, 20, 1);
        const ts = tau * Math.log(1 + IF / IR);
        return { q: R`A diode with minority-carrier lifetime $${tau}$ ns carries $I_F = ${IF}$ mA and is switched to a reverse current $I_R = ${IR}$ mA. Its storage time $t_s = \tau\ln(1 + I_F/I_R)$ is ______ ns (to two decimal places).`,
          answer: round(ts, 2), tol: Math.max(0.02, round(ts * 0.005, 2)), tau, IF, IR,
          sol: R`$t_s = ${tau}\ln(1 + ${IF}/${IR}) = ${tau}\times${round(Math.log(1 + IF / IR), 4)} = ${round(ts, 2)}$ ns. The stored charge $I_F\tau$ is removed both by the reverse current and by recombination.`,
          trap: R`$\tau I_F/I_R$ ignores recombination and overestimates the time.` };
      },
      verify: (p) => p.tau * Math.log(1 + p.IF / p.IR) },
    { id: 'sd-r5g2', type: 'nat', level: 4, exams: G, sub: 'BJT speed',
      make(r) {
        const IC = pick(r, 0.5, 5, 0.5), tF = pick(r, 5, 40, 5), Cje = pick(r, 0.2, 1.5, 0.1), Cmu = pick(r, 0.05, 0.3, 0.05);
        const gm = IC / 25, Cde = gm * tF, fT = gm / (2 * Math.PI * (Cde + Cje + Cmu) * 1e-12) / 1e9;
        return { q: R`A BJT at $I_C = ${IC}$ mA ($V_T = 25$ mV) has forward transit time $\tau_F = ${tF}$ ps, emitter-base depletion capacitance $${Cje}$ pF and $C_\mu = ${Cmu}$ pF. Its unity-gain frequency $f_T = g_m/[2\pi(C_\pi + C_\mu)]$ is ______ GHz (to two decimal places).`,
          answer: round(fT, 2), tol: Math.max(0.02, round(fT * 0.005, 2)), IC, tF, Cje, Cmu,
          sol: R`$g_m = I_C/V_T = ${IC}\text{ mA}/25\text{ mV} = ${round(gm * 1000, 2)}$ mS. $C_{de} = g_m\tau_F = ${round(Cde, 3)}$ pF, so $C_\pi + C_\mu = ${round(Cde + Cje + Cmu, 3)}$ pF and $f_T = ${round(fT, 2)}$ GHz.`,
          trap: 'The diffusion capacitance grows with the bias current; leaving it out overestimates $f_T$.' };
      },
      verify: (p) => { const gm = p.IC / 25; return gm / (2 * Math.PI * (gm * p.tF + p.Cje + p.Cmu) * 1e-12) / 1e9; } },
    { id: 'sd-r5g3', type: 'mcq', level: 3, exams: G, sub: 'Schottky diodes',
      make(r) {
        const T = choose(r, [250, 300, 350, 400]), d = pick(r, 0.02, 0.15, 0.01), dir = choose(r, ['lowers', 'raises']);
        const kT = 8.617333e-5 * T, f = Math.exp(d / kT), val = dir === 'lowers' ? f : 1 / f;
        const sh = (v) => `$${v >= 0.01 ? +v.toPrecision(3) : v.toExponential(2)}$`;
        const o = mcqOptions(r, val, [1 / val, d / kT, 2 * val, Math.exp(d / (2 * kT))], sh);
        return { q: R`A Schottky diode's saturation current is $I_s = AA^*T^2e^{-e\phi_B/k_BT}$. At $${T}$ K a process change ${dir} the barrier height by $${d}$ V. The saturation current is multiplied by`, ...o,
          sol: R`$k_BT/e = ${round(kT * 1000, 2)}$ mV at $${T}$ K. Only the exponential changes: the factor is $e^{${dir === 'lowers' ? '' : '-'}${d}/${round(kT, 5)}} = ${+val.toPrecision(3)}$.`,
          trap: 'The exponent itself is not the factor, and a higher barrier lowers the current.' };
      } },
  ],
};
