// Round 4 extras for phase-changes: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const CW = 4.186, CI = 2.1, LF = 334; // J/(g K), J/(g K), J/g
const sig3 = (x) => +x.toPrecision(3);
const heatIce = (m, ti, tf) => m * (CI * -ti + LF + CW * tf) / 1000; // kJ
const mixT = (mw, tw, mi) => { const q = mw * CW * tw - mi * LF; return q <= 0 ? 0 : q / ((mw + mi) * CW); };

export default {
  items: [
    { id: 'phch-r4-01', type: 'mcq', level: 2, exams: ['jam'], sub: 'latent heat',
      q: R`How much heat turns $100$ g of ice at $-10\,^\circ$C into water at $20\,^\circ$C? Take $c_{\rm ice} = 2.1$ J g$^{-1}$ K$^{-1}$, $L_f = 334$ J/g and $c_{\rm water} = 4.186$ J g$^{-1}$ K$^{-1}$.`,
      options: [R`43.9 kJ`, R`33.4 kJ`, R`10.5 kJ`, R`41.8 kJ`], answer: 0,
      sol: R`Three steps: warm the ice to $0\,^\circ$C, $100\times2.1\times10 = 2.1$ kJ; melt it, $100\times334 = 33.4$ kJ; warm the water, $100\times4.186\times20 = 8.37$ kJ. Total $43.9$ kJ. Melting dominates: it takes as much heat as warming the water by about $80$ K.`,
      trap: R`Leaving out a step: 41.8 kJ forgets warming the ice, and 10.5 kJ forgets the latent heat.` },
    { id: 'phch-r4-02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'coexistence',
      q: R`A rigid tank holds water and steam together at $100\,^\circ$C, where the specific volumes are $v_l = 1.0\times10^{-3}$ m$^3$/kg and $v_g = 1.67$ m$^3$/kg. The mixture's overall specific volume is $0.10$ m$^3$/kg. The fraction of the mass that is vapour is ______ (four decimal places).`,
      answer: 0.0593, tol: 0.0006, calc: () => (0.1 - 1e-3) / (1.67 - 1e-3),
      sol: R`Volumes add: $v = (1 - x)v_l + xv_g$, so the lever rule gives $x = \dfrac{v - v_l}{v_g - v_l} = \dfrac{0.10 - 0.001}{1.67 - 0.001} = 0.0593$. Under 6% of the mass is steam, yet it fills $\dfrac{0.0593\times1.67}{0.10} = 99\%$ of the volume.`,
      trap: R`Using the volume fraction instead of the mass fraction, or $v/v_g$ (0.0599) without subtracting $v_l$.` },
    { id: 'phch-r4-03', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Gibbs energy',
      q: R`At fixed temperature, raising the pressure on a substance that has two possible phases favours`,
      options: [R`the phase with the larger molar entropy`, R`the phase with the larger molar volume`, R`the phase with the smaller molar volume`, R`neither, because pressure does not affect which phase is stable`], answer: 2,
      sol: R`$\left(\dfrac{\partial g}{\partial P}\right)_T = v$, so the molar Gibbs energy of each phase rises with pressure at a rate equal to its molar volume. The denser phase (smaller $v$) rises more slowly and ends up with the lower $g$. That is why pressure melts ice (water is denser) and turns graphite into diamond.`,
      trap: R`The entropy decides what temperature favours ($\partial g/\partial T = -s$), not pressure.` },
    { id: 'phch-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'order of transitions',
      q: R`In Landau theory, $F = a(T - T_c)m^2 + bm^4$ with $a, b > 0$. Just below $T_c$, the equilibrium order parameter behaves as`,
      options: [R`$m \propto (T_c - T)$`, R`$m \propto (T_c - T)^{1/2}$`, R`$m \propto (T_c - T)^{1/3}$`, R`$m$ jumps to a finite value at $T_c$`], answer: 1,
      sol: R`$\partial F/\partial m = 2a(T - T_c)m + 4bm^3 = 0$ gives $m = 0$ or $m^2 = \dfrac{a(T_c - T)}{2b}$. Below $T_c$ the non-zero root has lower $F$, so $m = \sqrt{a(T_c - T)/2b} \propto (T_c - T)^{1/2}$: mean-field exponent $\beta = \tfrac12$ (real fluids and magnets give about $0.33$). It starts from zero, so the transition is continuous.`,
      trap: R`A jump in $m$ needs a negative $m^4$ coefficient (or a cubic term): that is a first-order transition.` },
    { id: 'phch-r4-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'order of transitions',
      q: R`A Landau free energy per mole is $F = a(T - T_c)m^2 + bm^4$ with $a = 2.0$ J mol$^{-1}$ K$^{-1}$, $b = 40$ J/mol and $T_c = 100$ K. The jump in molar heat capacity at $T_c$ is ______ J mol$^{-1}$ K$^{-1}$.`,
      answer: 5.0, tol: 0.05, calc: () => 2 ** 2 * 100 / (2 * 40),
      sol: R`Below $T_c$, $m^2 = a(T_c - T)/2b$ and $F_{\min} = -\dfrac{a^2(T_c - T)^2}{4b}$; above, $F = 0$. $C = -T\dfrac{\partial^2F}{\partial T^2} = \dfrac{a^2T}{2b}$ below and $0$ above. At $T_c$: $\Delta C = \dfrac{a^2T_c}{2b} = \dfrac{4\times100}{80} = 5.0$ J mol$^{-1}$ K$^{-1}$, larger on the ordered side. No latent heat: entropy is continuous, its slope is not (second order in Ehrenfest's sense).`,
      trap: R`Dropping the factor $T$ in $C = -T\,\partial^2F/\partial T^2$ gives 0.05.` },
    { id: 'phch-r4-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'metastable states',
      q: R`Pure water is supercooled by $\Delta T = 20$ K. In classical nucleation theory a spherical ice nucleus grows only if its radius exceeds $r^* = \dfrac{2\gamma T_m}{L_V\Delta T}$. With $\gamma = 0.033$ J/m$^2$, $T_m = 273$ K and latent heat per volume $L_V = 3.06\times10^8$ J/m$^3$, $r^*$ is ______ nm (two decimal places).`,
      answer: 2.94, tol: 0.03, unit: 'nm', calc: () => 2 * 0.033 * 273 / (3.06e8 * 20) * 1e9,
      sol: R`A nucleus of radius $r$ changes the free energy by $\Delta G = -\tfrac43\pi r^3\Delta g + 4\pi r^2\gamma$ with $\Delta g = L_V\Delta T/T_m$ (the bulk gain per volume, from $\Delta g = \Delta h - T\Delta s$ near $T_m$). The maximum is at $r^* = 2\gamma/\Delta g = \dfrac{2\times0.033\times273}{3.06\times10^8\times20} = 2.94\times10^{-9}$ m. Such a nucleus holds thousands of molecules, which rarely gather by chance; hence deep supercooling of clean water.`,
      trap: R`Setting $\Delta G = 0$ instead of maximising it gives $3\gamma/\Delta g = 1.5r^*$ (4.41 nm).` },
    { id: 'phch-r4-07', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'order of transitions',
      q: R`In Landau theory with a field, $F = a(T - T_c)m^2 + bm^4 - hm$. At the same distance $|T - T_c|$ from the transition, the zero-field susceptibility $\chi = \partial m/\partial h$ above $T_c$ is how many times its value below $T_c$?`,
      options: [R`1`, R`1/2`, R`4`, R`2`], answer: 3,
      sol: R`Let $t = T - T_c$. Equilibrium needs $\partial F/\partial m = 0$, i.e. $h = 2atm + 4bm^3$; differentiating, $1/\chi = \partial h/\partial m = \partial^2F/\partial m^2$ at the equilibrium $m$. Above: $m = 0$, $1/\chi = 2at$. Below: $m_0^2 = -at/2b$, so $1/\chi = 2at + 12bm_0^2 = 2at - 6at = 4a|t|$. Ratio $\chi_{\rm above}/\chi_{\rm below} = 4a|t|/2a|t| = 2$. Both diverge as $|t|^{-1}$ (mean-field $\gamma = 1$).`,
      trap: R`Forgetting the curvature added by the $m^4$ term below $T_c$ gives a ratio of 1.` },
    { id: 'phch-r4-08', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'order of transitions',
      q: R`Which of these are first-order transitions (with latent heat)?`,
      options: [R`melting of ice at 1 atm`, R`heating a fluid along an isobar above its critical pressure, from liquid-like to gas-like`, R`iron losing its ferromagnetism at the Curie point in zero field`, R`a type-I superconductor turning normal in a non-zero applied magnetic field`], answer: [0, 3],
      sol: R`Melting has a latent heat ($334$ J/g for ice). Above the critical pressure there is no phase boundary at all: properties change smoothly. The Curie point in zero field is continuous: magnetisation goes to zero smoothly and only the heat capacity is singular. A type-I superconductor in a field $B < B_c(0)$ goes normal at $T_c(B) < T_c$ with a latent heat $T\Delta s$ (the entropy jumps); only at zero field is the transition second order.`,
      trap: R`The same material can show a first-order or continuous transition depending on the field or pressure path.` },
  ],
  gens: [
    { id: 'phch-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'latent heat',
      make(r) {
        const m = choose(r, [50, 100, 200, 250, 500]), ti = choose(r, [-20, -15, -10, -5]), tf = choose(r, [10, 20, 30, 40, 50, 80]);
        const ans = heatIce(m, ti, tf);
        return { q: R`How much heat turns $${m}$ g of ice at $${ti}\,^\circ$C into water at $${tf}\,^\circ$C? Use $c_{\rm ice} = 2.1$ J g$^{-1}$ K$^{-1}$, $L_f = 334$ J/g and $c_{\rm water} = 4.186$ J g$^{-1}$ K$^{-1}$. Answer ______ kJ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), m, ti, tf,
          sol: R`Warm the ice: $${m}\times2.1\times${-ti} = ${round(m * CI * -ti / 1000, 3)}$ kJ. Melt: $${m}\times334 = ${round(m * LF / 1000, 3)}$ kJ. Warm the water: $${m}\times4.186\times${tf} = ${round(m * CW * tf / 1000, 3)}$ kJ. Total $${sig3(ans)}$ kJ.`,
          trap: R`Forgetting the latent heat, the largest of the three terms.` };
      },
      verify: (p) => heatIce(p.m, p.ti, p.tf) },
    { id: 'phch-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'coexistence',
      make(r) {
        const [T, vl, vg] = choose(r, [[100, 0.001044, 1.673], [150, 0.001091, 0.3928], [200, 0.001157, 0.1272]]);
        const f = choose(r, [0.02, 0.05, 0.1, 0.25, 0.4, 0.6, 0.8]);
        const v = round(vl + f * (vg - vl), 4), ans = (v - vl) / (vg - vl);
        return { q: R`Water and steam coexist at $${T}\,^\circ$C, where $v_l = ${vl}$ m$^3$/kg and $v_g = ${vg}$ m$^3$/kg. A rigid tank of this mixture has overall specific volume $${v}$ m$^3$/kg. The mass fraction of vapour is ______ (three decimal places).`,
          answer: round(ans, 3), tol: Math.max(0.002, round(ans * 0.01, 3)), vl, vg, v,
          sol: R`Lever rule: $x = \dfrac{v - v_l}{v_g - v_l} = \dfrac{${v} - ${vl}}{${vg} - ${vl}} = ${round(ans, 3)}$.`,
          trap: R`Using $v/v_g$ ignores the volume of the liquid.` };
      },
      verify: (p) => (p.v - p.vl) / (p.vg - p.vl) },
    { id: 'phch-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'order of transitions',
      make(r) {
        const a = choose(r, [1, 2, 3, 5]), b = choose(r, [10, 20, 40, 50, 100]), Tc = choose(r, [50, 100, 200, 300, 600]);
        const ask = choose(r, ['C', 'm']), T = round(Tc * choose(r, [0.5, 0.8, 0.9, 0.95]), 1);
        const ans = ask === 'C' ? a * a * Tc / (2 * b) : Math.sqrt(a * (Tc - T) / (2 * b));
        return { q: R`A Landau free energy per mole is $F = a(T - T_c)m^2 + bm^4$ with $a = ${a}$ J mol$^{-1}$ K$^{-1}$, $b = ${b}$ J/mol and $T_c = ${Tc}$ K. ${ask === 'C' ? 'The jump in molar heat capacity at $T_c$ is ______ J mol$^{-1}$ K$^{-1}$' : `The equilibrium order parameter $m$ at $T = ${T}$ K is ______`} (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), a, b, Tc, T, ask,
          sol: ask === 'C' ? R`Below $T_c$, $F_{\min} = -\dfrac{a^2(T_c - T)^2}{4b}$, so $C = -T\,\partial^2F/\partial T^2 = \dfrac{a^2T}{2b}$; above, $C = 0$ (from $F$). Jump: $\dfrac{${a}^2\times${Tc}}{2\times${b}} = ${sig3(ans)}$ J mol$^{-1}$ K$^{-1}$.` : R`Minimising: $m^2 = \dfrac{a(T_c - T)}{2b} = \dfrac{${a}\times${round(Tc - T, 1)}}{${2 * b}}$, so $m = ${sig3(ans)}$.`,
          trap: R`Forgetting the factor 2 from $\partial(bm^4)/\partial m = 4bm^3$ against $2a(T - T_c)m$.` };
      },
      verify: (p) => (p.ask === 'C' ? p.a ** 2 * p.Tc / (2 * p.b) : Math.sqrt(p.a * (p.Tc - p.T) / (2 * p.b))) },
    { id: 'phch-r4g4', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'metastable states',
      make(r) {
        const [name, g, Tm, LV] = choose(r, [['water (ice nucleus)', 0.033, 273, 3.06e8], ['liquid copper', 0.177, 1356, 1.88e9], ['liquid aluminium', 0.093, 933, 1.0e9], ['liquid nickel', 0.255, 1728, 2.53e9]]);
        const dT = choose(r, [10, 20, 50, 100, 200]), ans = 2 * g * Tm / (LV * dT) * 1e9;
        const LVt = LV.toExponential(2).replace(/e\+?(-?\d+)/, '\\times10^{$1}');
        return { q: R`Pure ${name} is supercooled by $${dT}$ K. Classical nucleation theory gives the critical radius $r^* = 2\gamma T_m/(L_V\Delta T)$. With $\gamma = ${g}$ J/m$^2$, $T_m = ${Tm}$ K and $L_V = ${LVt}$ J/m$^3$, $r^*$ is ______ nm (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), g, Tm, LV, dT,
          sol: R`$\Delta G(r) = -\tfrac43\pi r^3\Delta g + 4\pi r^2\gamma$ with $\Delta g = L_V\Delta T/T_m$ peaks at $r^* = 2\gamma/\Delta g = \dfrac{2\times${g}\times${Tm}}{${LVt}\times${dT}} = ${sig3(ans)}$ nm. Deeper supercooling shrinks $r^*$ as $1/\Delta T$ and the barrier as $1/\Delta T^2$.`,
          trap: R`Setting $\Delta G = 0$ instead of maximising it gives $1.5r^*$.` };
      },
      verify: (p) => 2 * p.g * p.Tm / (p.LV * p.dT) * 1e9 },
    { id: 'phch-r4g5', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'phase rule',
      make(r) {
        const Cn = int(r, 1, 3), fixP = choose(r, [true, false]);
        const P = int(r, 1, Cn + (fixP ? 1 : 2)), F = Cn - P + (fixP ? 1 : 2);
        const sys = ['a pure substance', 'a two-component mixture (no reactions)', 'a three-component mixture (no reactions)'][Cn - 1];
        const o = mcqOptions(r, F, [F + 1, F - 1, F + 2, F - 2, F + 3].filter((v) => v >= 0), (v) => `${v}`);
        return { q: R`For ${sys} with ${P} phase${P > 1 ? 's' : ''} in equilibrium${fixP ? ', at a fixed pressure' : ''}, the number of intensive variables that can still be varied independently is`, ...o,
          sol: R`Gibbs' phase rule: $F = C - P + 2$, where the 2 counts temperature and pressure. ${fixP ? 'Fixing the pressure removes one: $F = C - P + 1$. ' : ''}Here $C = ${Cn}$, $P = ${P}$: $F = ${F}$.${F === 0 ? ' Nothing can change: an invariant point, like a triple point.' : ''}`,
          trap: R`Forgetting the composition variables: each extra component adds one degree of freedom.` };
      } },
    { id: 'phch-r4g6', type: 'nat', level: 3, exams: ['jam'], sub: 'latent heat',
      make(r) {
        const mw = choose(r, [100, 200, 300, 500]), tw = choose(r, [20, 40, 60, 80]), mi = choose(r, [20, 50, 100, 150]);
        const ans = mixT(mw, tw, mi), all = mw * CW * tw > mi * LF;
        return { q: R`$${mi}$ g of ice at $0\,^\circ$C is dropped into $${mw}$ g of water at $${tw}\,^\circ$C in an insulated cup of negligible heat capacity. The final temperature is ______ $^\circ$C (one decimal place). Use $L_f = 334$ J/g and $c = 4.186$ J g$^{-1}$ K$^{-1}$.`,
          answer: round(ans, 1), tol: 0.2, mw, tw, mi,
          sol: R`First check whether all the ice can melt. Heat the water can give in cooling to $0\,^\circ$C: $${mw}\times4.186\times${tw} = ${round(mw * CW * tw, 0)}$ J. Heat needed to melt all the ice: $${mi}\times334 = ${mi * LF}$ J. ${all ? `Enough, so all melts and the rest warms ${mw + mi} g of water: $T = \\dfrac{${round(mw * CW * tw, 0)} - ${mi * LF}}{${mw + mi}\\times4.186} = ${round(ans, 1)}\\,^\\circ$C.` : `Not enough: only $${round(mw * CW * tw / LF, 1)}$ g melts, ice remains, and the mixture sits at $0.0\\,^\\circ$C.`}`,
          trap: R`Writing one heat balance without checking whether the ice all melts can give a temperature below $0\,^\circ$C, which is impossible here.` };
      },
      verify: (p) => mixT(p.mw, p.tw, p.mi) },
  ],
};
