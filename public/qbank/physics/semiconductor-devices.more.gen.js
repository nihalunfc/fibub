// Extra question shapes for semiconductor-devices (templates sd-m31..m35). Imported by semiconductor-devices.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'sd-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'BJT vs MOSFET', format: 'statements',
    make(r) {
      const Ic = choose(r, [0.5, 1, 2, 2.6, 5]), gm = Ic / 0.026, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a BJT biased at $I_C = ${Ic}$ mA at room temperature has $g_m \\approx ${gm.toFixed(0)}$ mS`, `a BJT biased at $I_C = ${Ic}$ mA at room temperature has $g_m \\approx ${(gm / 2).toFixed(0)}$ mS`, `$g_m = I_C/V_T = ${Ic}\\text{ mA}/26\\text{ mV} = ${gm.toFixed(0)}$ mS.`),
        ['in the active mode of a BJT the base-emitter junction is forward biased and the base-collector junction reverse biased', true, 'That is the definition of forward-active operation.'],
        ['an n-MOSFET is in saturation when $V_{DS} \\ge V_{GS} - V_T$', true, 'The channel is pinched off at the drain end.'],
        ['the small-signal input resistance of a BJT is $r_\\pi = \\beta/g_m$', true, 'Base current is $1/\\beta$ of collector current.'],
        ['the gate of a MOSFET draws a steady DC current comparable to the drain current', false, 'The gate is insulated by the oxide; its DC current is essentially zero.'],
        ['pinch-off at the drain end stops the drain current', false, 'Carriers are swept across the pinched-off region; the current saturates rather than stopping.'],
        ['an enhancement-mode n-MOSFET conducts at $V_{GS} = 0$', false, 'It needs $V_{GS} \\gt V_T \\gt 0$; a depletion-mode device or JFET conducts at zero gate voltage.'],
        ['at fixed collector current, $V_{BE}$ falls by about 2 mV per kelvin of temperature rise', true, 'The rapid growth of $I_S$ with temperature outweighs the rise of $V_T$.'],
        ['for the same size, an n-MOSFET carries more current than a p-MOSFET', true, 'Electron mobility is two to three times the hole mobility in silicon.'],
      ], { not });
      return { q: `Which of the following statements about transistors are ${nt(not)}?`, ...m,
        trap: 'Saturation means different things: for a MOSFET it is the constant-current region, for a BJT both junctions forward biased.' };
    } },
  { id: 'sd-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'device types',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['Zener breakdown below about 5 V is mainly tunnelling and has a negative temperature coefficient', true, 'The band gap shrinks as temperature rises, easing tunnelling.'],
        ['avalanche breakdown has a positive temperature coefficient', true, 'More phonon scattering means carriers need a larger field to gain ionising energy.'],
        ['a varactor is operated in reverse bias', true, 'Its depletion capacitance falls as the reverse voltage rises.'],
        ['a Schottky diode has a lower forward drop and faster switching than a silicon pn diode', true, 'It is a majority-carrier device with no stored minority charge.'],
        ['a solar cell delivers power when operated in the fourth quadrant of its I-V curve', true, 'There the current is negative while the voltage is positive.'],
        ['an LED emits light when reverse biased', false, 'Light comes from recombination of injected carriers, which needs forward bias.'],
        ['a Schottky diode has a long reverse-recovery time', false, 'With no minority-carrier storage it recovers very quickly.'],
        ['a tunnel diode has lightly doped p and n sides', false, 'Its sides are degenerately (very heavily) doped, which makes the junction thin enough for tunnelling.'],
      ], not);
      return { q: `Which statement about two-terminal semiconductor devices is ${nt(not)}?`, ...m,
        trap: 'Zener (tunnelling) and avalanche breakdown have opposite temperature coefficients; they cross near 5-6 V.' };
    } },
  { id: 'sd-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'device types', format: 'graph in words',
    make(r) {
      const L = {
        N: 'a current peak, then a region where current falls as voltage rises, then a rise again',
        Z: 'almost no reverse current until a fixed reverse voltage, where the current rises very sharply',
        Q4: 'the forward curve shifted downward so that it passes through the fourth quadrant',
        sat: 'a linear rise at small voltage, then an almost flat current with a slight upward slope',
        lowv: 'an exponential forward curve that turns on at about 0.2-0.3 V',
        sq: 'zero current until a threshold voltage, then a current rising as the square of the excess voltage',
      };
      const cas = choose(r, [
        ['a tunnel diode (forward I-V)', 'N', 'Band-to-band tunnelling first rises then falls as the bands misalign, giving negative differential resistance; then normal diffusion current takes over.'],
        ['a Zener diode (reverse I-V)', 'Z', 'Breakdown holds the voltage nearly constant over a wide current range.'],
        ['an illuminated solar cell', 'Q4', 'Photocurrent subtracts from the diode current: $I = I_s(e^{V/V_T} - 1) - I_L$.'],
        ['a MOSFET, drain current against $V_{DS}$ at fixed $V_{GS} \\gt V_T$', 'sat', 'Triode region, then saturation with channel-length modulation.'],
        ['a Schottky diode (forward I-V)', 'lowv', 'Its barrier is lower than a silicon pn junction\'s built-in voltage.'],
        ['a MOSFET in saturation, drain current against $V_{GS}$', 'sq', 'Square law: $I_D = \\tfrac12k(V_{GS} - V_T)^2$ above threshold.'],
      ]);
      return { q: `The characteristic curve of ${cas[0]} is best described as`, ...matchOne(r, L, cas),
        trap: 'Only the tunnel diode has a negative-slope region; MOSFET output curves flatten, transfer curves are parabolic.' };
    } },
  { id: 'sd-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'triode region', format: 'limiting case',
    make(r) {
      const k = choose(r, [0.5, 1, 2, 4]), Vov = choose(r, [0.5, 1, 1.5, 2]), Ron = 1 / (k * Vov);
      const f = (x) => `${+x.toPrecision(3)} kΩ`;
      const o = mcqOptions(r, Ron, [2 * Ron, Ron / 2, 2 / (k * Vov * Vov), 1 / (k * Vov * Vov)], f);
      return { q: `An n-MOSFET obeys $I_D = k[(V_{GS} - V_T)V_{DS} - V_{DS}^2/2]$ in the triode region with $k = ${k}$ mA/V$^2$. With $V_{GS} - V_T = ${Vov}$ V and a very small $V_{DS}$, it behaves as a resistor of value`,
        options: o.options, answer: o.answer,
        sol: `For $V_{DS} \\ll V_{GS} - V_T$ drop the quadratic term: $I_D \\approx k(V_{GS} - V_T)V_{DS}$, so $R_{on} = 1/[k(V_{GS} - V_T)] = 1/(${k}\\times${Vov})$ kΩ $= ${f(Ron)}$. The gate voltage controls the resistance: a voltage-controlled resistor.`,
        trap: 'Using the saturation formula, or keeping the factor 1/2 that belongs to the $V_{DS}^2$ term, gives the wrong resistance.' };
    } },
  { id: 'sd-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'MOS capacitor', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const t = choose(r, [1.5, 2, 5, 10, 50]);
        x = (3.9 * 8.854e-12) / (t * 1e-9); unit = '\\text{F/m}^2';
        q = `A silicon dioxide gate layer ($\\varepsilon_r = 3.9$) is ${t} nm thick. Its capacitance per unit area is about`;
        sol = `$C_{ox} = \\varepsilon_r\\varepsilon_0/t = 3.9\\times8.85\\times10^{-12}/(${t}\\times10^{-9}) = ${sci(x)}$ F/m$^2$.`;
      } else {
        const N = choose(r, [1e21, 1e22, 1e23, 1e24]), V = choose(r, [1, 5, 10]);
        x = Math.sqrt((2 * 11.7 * 8.854e-12 * V) / (1.602e-19 * N)); unit = '\\text{m}';
        q = `A one-sided abrupt silicon junction ($\\varepsilon_r = 11.7$) has $N = ${sci(N)}$ m$^{-3}$ on its lightly doped side and a total junction voltage of ${V} V. The depletion width is about`;
        sol = `$W = \\sqrt{2\\varepsilon V/(qN)} = \\sqrt{2(11.7)(8.85\\times10^{-12})(${V})/(1.6\\times10^{-19}\\times${sci(N)})} = ${sci(x)}$ m.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Keep SI units: nm to m, and doping in m$^{-3}$ (1 cm$^{-3}$ = $10^6$ m$^{-3}$).' };
    } },
];
