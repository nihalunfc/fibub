// Round 4 extras for semiconductor-devices: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'sd-r4-01', type: 'mcq', level: 1, exams: A, sub: 'diode small signal',
      q: R`An ideal diode (ideality factor 1) carries a forward bias current of $2$ mA. Taking $V_T = 26$ mV, its small-signal (dynamic) resistance is`,
      options: [R`$13\ \Omega$`, R`$26\ \Omega$`, R`$52\ \Omega$`, R`$0.077\ \Omega$`], answer: 0,
      sol: R`From $I = I_0e^{V/V_T}$, $dI/dV = I/V_T$, so $r_d = V_T/I = 26\text{ mV}/2\text{ mA} = 13\ \Omega$. It is the inverse of the slope of the I-V curve at the bias point, not $V/I$.`,
      trap: R`$I/V_T = 0.077$ S is the conductance, not the resistance; and $26\ \Omega$ would need an ideality factor of 2.` },
    { id: 'sd-r4-02', type: 'mcq', level: 2, exams: A, sub: 'pn junction',
      q: R`A silicon abrupt junction at 300 K has $N_A = 1.0\times10^{17}$ cm$^{-3}$ on the p side and $N_D = 1.0\times10^{15}$ cm$^{-3}$ on the n side, with $n_i = 1.0\times10^{10}$ cm$^{-3}$ and $k_BT/e = 25.85$ mV. Its built-in potential is closest to`,
      options: [R`$0.36$ V`, R`$0.60$ V`, R`$0.71$ V`, R`$0.83$ V`], answer: 2,
      sol: R`$V_{bi} = \dfrac{k_BT}{e}\ln\dfrac{N_AN_D}{n_i^2} = 0.02585\ln\dfrac{10^{17}\times10^{15}}{10^{20}} = 0.02585\ln10^{12} = 0.02585\times27.63 = 0.714$ V.`,
      trap: R`Using only one doping twice ($N_D^2$ gives $0.60$ V, $N_A^2$ gives $0.83$ V) or halving the logarithm ($0.36$ V).` },
    { id: 'sd-r4-03', type: 'nat', level: 2, exams: G, sub: 'MOS capacitor',
      q: R`A MOSFET has a silicon dioxide gate insulator ($\varepsilon_r = 3.9$) of thickness $2.0$ nm. Its gate capacitance per unit area $C_{ox}$ is ______ fF/$\mu$m$^2$ (to two decimal places). Take $\varepsilon_0 = 8.854\times10^{-12}$ F/m.`,
      answer: 17.27, tol: 0.2, calc: () => 3.9 * 8.854e-12 / 2.0e-9 * 1e3,
      sol: R`$C_{ox} = \varepsilon_r\varepsilon_0/t_{ox} = 3.9\times8.854\times10^{-12}/2.0\times10^{-9} = 1.727\times10^{-2}$ F/m$^2$. Since $1$ F/m$^2 = 10^{15}$ fF per $10^{12}\ \mu$m$^2 = 10^3$ fF/$\mu$m$^2$, $C_{ox} = 17.27$ fF/$\mu$m$^2$.`,
      trap: R`The unit change: F/m$^2$ to fF/$\mu$m$^2$ is a factor $10^3$, not $10^{15}$ or $10^{-12}$.` },
    { id: 'sd-r4-04', type: 'mcq', level: 3, exams: G, sub: 'BJT speed',
      q: R`In a BJT whose speed is limited by the time minority carriers take to diffuse across the base, the neutral base width is halved (base diffusion constant unchanged). Then`,
      options: [R`the base transit time halves, so $f_T$ doubles`, R`the base transit time is unchanged, because $D_n$ is unchanged`, R`the base transit time doubles`, R`the base transit time falls to a quarter, so $f_T$ rises about four times`], answer: 3,
      sol: R`For diffusion across a base of width $W_B$, the injected charge is $Q = eAn(0)W_B/2$ and the current $I = eAD_nn(0)/W_B$, so $\tau_B = Q/I = W_B^2/2D_n$. Halving $W_B$ divides $\tau_B$ by 4, and $f_T\approx1/(2\pi\tau_B)$ rises by 4. This is why fast bipolar transistors have very thin bases.`,
      trap: R`Treating the carriers as drifting at a fixed speed (time $\propto W$) gives only a factor of 2; diffusion time goes as distance squared.` },
    { id: 'sd-r4-05', type: 'nat', level: 3, exams: G, sub: 'BJT speed',
      q: R`An npn transistor has neutral base width $0.50\ \mu$m and electron diffusion constant in the base $D_n = 25$ cm$^2$/s. The base transit time $W_B^2/2D_n$ is ______ ps.`,
      answer: 50, tol: 0.5, calc: () => (0.5e-4) ** 2 / (2 * 25) * 1e12,
      sol: R`$W_B = 0.50\ \mu\text{m} = 5.0\times10^{-5}$ cm. $\tau_B = (5.0\times10^{-5})^2/(2\times25) = 2.5\times10^{-9}/50 = 5.0\times10^{-11}$ s $= 50$ ps.`,
      trap: R`Leaving $W_B$ in $\mu$m with $D_n$ in cm$^2$/s mixes units by a factor $10^8$.` },
    { id: 'sd-r4-06', type: 'mcq', level: 3, exams: G, sub: 'diode equation',
      q: R`A diode (ideality factor 1, 300 K, $k_BT/e = 25.85$ mV) has a series resistance of $5.0\ \Omega$. At $1.0$ mA its terminal voltage is $0.600$ V. At $10$ mA its terminal voltage is about`,
      options: [R`$0.660$ V`, R`$0.705$ V`, R`$0.650$ V`, R`$0.750$ V`], answer: 1,
      sol: R`Junction voltage rises by $V_T\ln10 = 25.85\times2.303 = 59.5$ mV. The drop across the series resistance rises from $5$ mV to $50$ mV, an extra $45$ mV. Total: $0.600 + 0.0595 + 0.045 = 0.705$ V. On a semilog plot this is why the line bends over at high current.`,
      trap: R`Forgetting the resistor gives $0.660$ V; adding the full $50$ mV without removing the $5$ mV already in the first reading overshoots.` },
    { id: 'sd-r4-07', type: 'msq', level: 3, exams: G, sub: 'BJT current gain', format: 'statements',
      q: R`Which statements about the common-emitter current gain $\beta$ of a BJT are correct?`,
      options: [R`Making the base narrower raises $\beta$, because fewer injected carriers recombine in the base.`, R`Doping the emitter much more heavily than the base raises $\beta$, by improving the emitter injection efficiency.`, R`Doping the base more heavily raises $\beta$.`, R`At very high collector currents $\beta$ falls, as high-level injection sets in.`, R`$\beta$ does not depend on temperature.`], answer: [0, 1, 3],
      sol: R`$\beta = \alpha/(1 - \alpha)$ with $\alpha$ = injection efficiency $\times$ base transport factor. A thin base improves transport (recombination loss $\approx W_B^2/2L_n^2$). A heavily doped emitter makes the emitter current mostly electrons into the base, raising injection efficiency; a heavily doped base does the opposite (more holes back into the emitter, more recombination). At high currents injected carriers rival the base doping and $\beta$ falls. $\beta$ rises with temperature in silicon (a few tenths of a percent per kelvin), which matters in bias design.`,
      trap: R`Heavier base doping lowers the base resistance but lowers $\beta$; it is not a gain booster.` },
    { id: 'sd-r4-08', type: 'msq', level: 4, exams: G, sub: 'MOSFET speed', format: 'statements',
      q: R`For a long-channel MOSFET in saturation, take $f_T\approx g_m/(2\pi C_{gs})$ with $C_{gs} = \tfrac23WLC_{ox}$. Which statements are correct?`,
      options: [R`$f_T$ scales as $1/L^2$.`, R`$f_T$ does not depend on the channel width $W$.`, R`$f_T$ rises with the overdrive $V_{GS} - V_T$.`, R`A p-channel device of the same size and overdrive has the same $f_T$ as the n-channel one.`], answer: [0, 1, 2],
      sol: R`$g_m = \mu C_{ox}(W/L)V_{ov}$, so $f_T = \dfrac{\mu C_{ox}(W/L)V_{ov}}{2\pi\cdot\tfrac23WLC_{ox}} = \dfrac{3\mu V_{ov}}{4\pi L^2}$. $W$ and $C_{ox}$ cancel, $f_T\propto1/L^2$ and $\propto V_{ov}$. It is proportional to the mobility, and holes in silicon are two to three times less mobile than electrons, so the pMOS is slower.`,
      trap: R`Wider devices give more $g_m$ but proportionally more capacitance, so width does not buy speed.` },
    { id: 'sd-r4-09', type: 'mcq', level: 4, exams: G, sub: 'breakdown',
      q: R`A BJT has collector-base breakdown voltage (emitter open) $BV_{CBO} = 100$ V, current gain $\beta = 100$, and avalanche multiplication $M = 1/[1 - (V/BV_{CBO})^4]$. The collector-emitter breakdown voltage with the base open, $BV_{CEO}$, is about`,
      options: [R`$100$ V`, R`$10$ V`, R`$31.6$ V`, R`$1$ V`], answer: 2,
      sol: R`With the base open, the base current is zero, so the collector current runs away when $M\alpha = 1$, i.e. $M = 1/\alpha\approx 1 + 1/\beta$. Then $(V/BV_{CBO})^4 = 1 - \alpha\approx 1/\beta$, giving $BV_{CEO} = BV_{CBO}/\beta^{1/4} = 100/100^{0.25} = 100/3.16 = 31.6$ V. The transistor's own gain multiplies the avalanche current, so breakdown comes earlier.`,
      trap: R`Dividing by $\beta$ itself (giving $1$ V) forgets the steep fourth-power law of $M$.` },
    { id: 'sd-r4-10', type: 'nat', level: 4, exams: G, sub: 'pn junction',
      q: R`A one-sided abrupt junction has built-in potential $0.80$ V. At a reverse bias of $0.20$ V its depletion width is $0.40\ \mu$m. The reverse bias at which the depletion width becomes $1.20\ \mu$m is ______ V.`,
      answer: 8.2, tol: 0.05, calc: () => (1.2 / 0.4) ** 2 * (0.8 + 0.2) - 0.8,
      sol: R`For an abrupt junction $W\propto\sqrt{V_{bi} + V_R}$. Tripling $W$ needs nine times the total potential: $9\times(0.80 + 0.20) = 9.0$ V. So $V_R = 9.0 - 0.80 = 8.2$ V.`,
      trap: R`Scaling $V_R$ alone ($9\times0.20 = 1.8$ V) or forgetting to subtract $V_{bi}$ at the end ($9.0$ V).` },
    { id: 'sd-r4-11', type: 'mcq', level: 5, exams: G, sub: 'CMOS inverter',
      q: R`A CMOS inverter runs from $V_{DD} = 3.0$ V. Both transistors have threshold magnitude $0.5$ V and obey the square law; the nMOS has $k_n = 4k_p$. Its switching threshold $V_M$ (where $V_{out} = V_{in}$, both devices saturated) is`,
      options: [R`$1.50$ V`, R`$1.83$ V`, R`$0.75$ V`, R`$1.17$ V`], answer: 3,
      sol: R`Equal currents: $\tfrac12k_n(V_M - 0.5)^2 = \tfrac12k_p(3.0 - V_M - 0.5)^2$. Taking square roots, $2(V_M - 0.5) = 2.5 - V_M$, so $3V_M = 3.5$ and $V_M = 1.17$ V. The stronger nMOS pulls the threshold below $V_{DD}/2$.`,
      trap: R`Putting the factor 2 on the wrong side (as if the pMOS were stronger) gives $1.83$ V.` },
    { id: 'sd-r4-12', type: 'nat', level: 5, exams: G, sub: 'temperature',
      q: R`Model a silicon diode as $I = CT^3e^{-E_g/k_BT}e^{eV/k_BT}$ with $E_g = 1.12$ eV (constant). At $300$ K and a fixed current it has $V = 0.650$ V. The magnitude of $dV/dT$ at fixed current is ______ mV/K (to two decimal places). Take $k_B/e = 0.08617$ mV/K.`,
      answer: 1.83, tol: 0.02, calc: () => (1.12 - 0.65) / 300 * 1000 + 3 * 0.08617,
      sol: R`$\ln I = \ln C + 3\ln T + (eV - E_g)/k_BT$. At fixed $I$, differentiate: $0 = 3/T + \dfrac{e\,dV/dT}{k_BT} - \dfrac{eV - E_g}{k_BT^2}$, so $\dfrac{dV}{dT} = \dfrac{V - E_g/e}{T} - \dfrac{3k_B}{e}$. Numbers: $(0.650 - 1.12)/300 = -1.567$ mV/K, and $3\times0.08617 = 0.259$ mV/K. Total $-1.83$ mV/K.`,
      trap: R`Dropping the $T^3$ factor gives $1.57$ mV/K; the familiar "$-2$ mV/K" is only a rule of thumb.` },
  ],
  gens: [
    { id: 'sd-r4g1', type: 'nat', level: 2, exams: A, sub: 'pn junction',
      make(r) {
        const [mat, ni, niTex] = choose(r, [['silicon', 1.0e10, '1.0\\times10^{10}'], ['gallium arsenide', 2.1e6, '2.1\\times10^{6}'], ['germanium', 2.4e13, '2.4\\times10^{13}']]);
        const ma = choose(r, [1, 2, 5]), ea = choose(r, [15, 16, 17, 18]), md = choose(r, [1, 2, 5]), ed = choose(r, [15, 16, 17, 18]);
        const NA = ma * 10 ** ea, ND = md * 10 ** ed, VT = 0.02585;
        const V = VT * Math.log(NA * ND / ni ** 2);
        return { q: `An abrupt ${mat} pn junction at 300 K has $N_A = ${ma}\\times10^{${ea}}$ cm$^{-3}$ and $N_D = ${md}\\times10^{${ed}}$ cm$^{-3}$, with $n_i = ${niTex}$ cm$^{-3}$ and $k_BT/e = 25.85$ mV. Its built-in potential is ______ V (to three decimal places).`,
          answer: round(V, 3), tol: 0.003, NA, ND, ni,
          sol: `$V_{bi} = \\dfrac{k_BT}{e}\\ln\\dfrac{N_AN_D}{n_i^2} = 0.02585\\times\\ln\\dfrac{${ma}\\times10^{${ea}}\\times${md}\\times10^{${ed}}}{(${niTex})^2} = 0.02585\\times${round(Math.log(NA * ND / ni ** 2), 3)} = ${round(V, 3)}$ V.`,
          trap: 'Forgetting to square $n_i$, or using $\\log_{10}$ instead of the natural logarithm.' };
      },
      verify: (p) => 0.02585 * Math.log(p.NA * p.ND / p.ni ** 2) },
    { id: 'sd-r4g2', type: 'nat', level: 3, exams: G, sub: 'BJT speed',
      make(r) {
        const W = pick(r, 0.1, 1.0, 0.05), D = pick(r, 5, 35, 1), ask = choose(r, ['tau', 'fT']);
        const tau = (W * 1e-4) ** 2 / (2 * D), val = ask === 'tau' ? tau * 1e12 : 1 / (2 * Math.PI * tau) / 1e9;
        return { q: `A BJT has neutral base width $${W}\\ \\mu$m and minority-carrier diffusion constant $${D}$ cm$^2$/s in the base. If base transit is the only delay, ${ask === 'tau' ? 'the base transit time is ______ ps' : 'its unity-gain frequency $f_T = 1/(2\\pi\\tau_B)$ is ______ GHz'} (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, round(val * 0.005, 2)), W, D, ask,
          sol: `$\\tau_B = W_B^2/2D_n = (${W}\\times10^{-4}\\text{ cm})^2/(2\\times${D}) = ${round(tau * 1e12, 3)}$ ps.${ask === 'fT' ? ` Then $f_T = 1/(2\\pi\\tau_B) = ${round(val, 2)}$ GHz.` : ''}`,
          trap: 'Mixing $\\mu$m with cm$^2$/s, or using $W_B/D_n$ (a drift-style time) instead of $W_B^2/2D_n$.' };
      },
      verify: (p) => { const t = (p.W * 1e-4) ** 2 / (2 * p.D); return p.ask === 'tau' ? t * 1e12 : 1 / (2 * Math.PI * t) / 1e9; } },
    { id: 'sd-r4g3', type: 'mcq', level: 4, exams: G, sub: 'CMOS inverter',
      make(r) {
        const VDD = choose(r, [1.8, 2.5, 3.3, 5]), VTn = pick(r, 0.3, 0.7, 0.1), VTp = pick(r, 0.3, 0.7, 0.1), ratio = choose(r, [2, 3, 4, 0.5, 0.25]);
        const rr = Math.sqrt(1 / ratio), VM = (VTn + rr * (VDD - VTp)) / (1 + rr);
        const inv = 1 / rr, wrong1 = (VTn + inv * (VDD - VTp)) / (1 + inv);
        const o = mcqOptions(r, round(VM, 2), [round(wrong1, 2), round(VDD / 2, 2), round(VDD * rr / (1 + rr), 2), round(VM + 0.3, 2)], (v) => `$${v.toFixed(2)}$ V`);
        return { q: `A CMOS inverter runs from $V_{DD} = ${VDD}$ V. The nMOS has $V_{Tn} = ${VTn}$ V, the pMOS $|V_{Tp}| = ${VTp}$ V, both obey the square law, and $k_n/k_p = ${ratio}$. Its switching threshold $V_M$ (both devices saturated, $V_{out} = V_{in}$) is`, ...o,
          sol: `Equal currents: $k_n(V_M - ${VTn})^2 = k_p(${VDD} - V_M - ${VTp})^2$. With $r = \\sqrt{k_p/k_n} = ${round(rr, 3)}$: $V_M = \\dfrac{V_{Tn} + r(V_{DD} - |V_{Tp}|)}{1 + r} = \\dfrac{${VTn} + ${round(rr, 3)}\\times${round(VDD - VTp, 2)}}{${round(1 + rr, 3)}} = ${round(VM, 2)}$ V. ${ratio > 1 ? 'The stronger nMOS pulls $V_M$ below the middle.' : 'The stronger pMOS pushes $V_M$ above the middle.'}`,
          trap: 'Using $\\sqrt{k_n/k_p}$ in place of $\\sqrt{k_p/k_n}$ moves the threshold to the wrong side of $V_{DD}/2$.' };
      } },
  ],
};
