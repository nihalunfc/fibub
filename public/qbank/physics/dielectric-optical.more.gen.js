// Extra question shapes for dielectric-optical (templates diel-m31..m35). Imported by dielectric-optical.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'diel-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'polarisation mechanisms', format: 'statements',
    make(r) {
      const eInf = choose(r, [2.25, 4, 6.25, 9]), e0 = choose(r, [9, 12, 16, 25]), ratio = Math.sqrt(e0 / eInf), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `an ionic crystal with $\\varepsilon(0) = ${e0}$ and $\\varepsilon(\\infty) = ${eInf}$ has $\\omega_L/\\omega_T = ${ratio.toFixed(2)}$`, `an ionic crystal with $\\varepsilon(0) = ${e0}$ and $\\varepsilon(\\infty) = ${eInf}$ has $\\omega_L/\\omega_T = ${(e0 / eInf).toFixed(2)}$`, `Lyddane-Sachs-Teller: $\\omega_L^2/\\omega_T^2 = \\varepsilon(0)/\\varepsilon(\\infty)$, so $\\omega_L/\\omega_T = \\sqrt{${e0}/${eInf}} = ${ratio.toFixed(2)}$.`),
        ['orientational polarisation contributes only up to about microwave frequencies', true, 'Whole molecules cannot rotate faster.'],
        ['ionic polarisation contributes up to infrared frequencies', true, 'Ions vibrate at lattice (infrared) frequencies.'],
        ['electronic polarisation contributes up to ultraviolet frequencies', true, 'Electron clouds respond up to their resonances in the UV.'],
        ['orientational polarisability falls as $1/T$', true, 'Langevin-Debye: $p^2/(3kT)$.'],
        ['electronic polarisability falls as $1/T$', false, 'It is essentially temperature independent.'],
        ['water has $n^2$ at optical frequencies close to its static dielectric constant of about 80', false, '$n^2 \\approx 1.77$: the orientational part has dropped out at optical frequencies.'],
        ['between $\\omega_T$ and $\\omega_L$ an ideal ionic crystal reflects almost totally', true, '$\\varepsilon \\lt 0$ there (the reststrahlen band).'],
      ], { not });
      return { q: `Which of the following statements about dielectric response are ${nt(not)}?`, ...m,
        trap: 'LST relates squares of frequencies to dielectric constants.' };
    } },
  { id: 'diel-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Kramers-Kronig',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the real and imaginary parts of $\\varepsilon(\\omega)$ are linked by the Kramers-Kronig relations', true, 'Each is a principal-value integral of the other over all frequencies.'],
        ['the Kramers-Kronig relations follow from causality', true, 'The response cannot precede the field, so $\\varepsilon(\\omega)$ is analytic in the upper half-plane.'],
        ['a material that absorbs somewhere must be dispersive somewhere', true, 'A nonzero imaginary part forces the real part to vary with frequency.'],
        ['for a passive medium the imaginary part of $\\varepsilon$ is non-negative at positive frequencies', true, 'It describes absorption, never gain.'],
        ['the refractive index can be less than 1, as for X-rays in matter', true, 'Above the resonances the electrons respond out of phase.'],
        ['a refractive index below 1 violates special relativity', false, 'It means a phase velocity above $c$, which carries no signal.'],
        ['the Kramers-Kronig relations connect $\\varepsilon\'$ and $\\varepsilon\'\'$ at the same frequency only', false, 'They involve integrals over all frequencies.'],
        ['a medium can absorb strongly at some frequency while its refractive index is constant at all frequencies', false, 'Kramers-Kronig forbids it.'],
      ], not);
      return { q: `Which statement about optical constants is ${nt(not)}?`, ...m,
        trap: 'Kramers-Kronig is a statement about the whole spectrum, not one frequency.' };
    } },
  { id: 'diel-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Debye relaxation', format: 'graph in words',
    make(r) {
      const L = {
        debye: 'the real part steps down smoothly while the imaginary part has a single broad peak at $\\omega\\tau = 1$',
        lor: 'the real part rises, swings below its high-frequency value (even negative) and recovers, while the imaginary part has a sharp peak at $\\omega_0$',
        drude: 'the real part is large and negative at low frequency and crosses zero at the plasma frequency',
        semi: 'a semicircle with its centre on the real axis',
        rs: 'reflectivity close to 1 between the transverse and longitudinal optical frequencies',
      };
      const cas = choose(r, [
        ['$\\varepsilon(\\omega)$ of a polar liquid (Debye relaxation), against frequency', 'debye', '$\\varepsilon = \\varepsilon_\\infty + (\\varepsilon_s - \\varepsilon_\\infty)/(1 + i\\omega\\tau)$: no resonance, just relaxation.'],
        ['$\\varepsilon(\\omega)$ of a lightly damped Lorentz oscillator, against frequency', 'lor', 'A resonance gives anomalous dispersion around $\\omega_0$.'],
        ['$\\varepsilon(\\omega)$ of free electrons in a metal (Drude, weak damping), against frequency', 'drude', '$\\varepsilon \\approx 1 - \\omega_p^2/\\omega^2$.'],
        ['$\\varepsilon\'\'$ plotted against $\\varepsilon\'$ (Cole-Cole plot) for a single Debye relaxation', 'semi', 'Eliminating $\\omega\\tau$ gives a circle centred at $(\\varepsilon_s + \\varepsilon_\\infty)/2$.'],
        ['the infrared reflectivity of an ionic crystal such as NaCl, against frequency', 'rs', '$\\varepsilon \\lt 0$ between $\\omega_T$ and $\\omega_L$: the reststrahlen band.'],
      ]);
      return { q: `Described in words, ${cas[0]} shows`, ...matchOne(r, L, cas),
        trap: 'Relaxation (Debye) has no negative-$\\varepsilon\'$ region; resonances (Lorentz) and free carriers (Drude) do.' };
    } },
  { id: 'diel-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Clausius-Mossotti', format: 'limiting case',
    make(r) {
      const x = choose(r, [0.05, 0.1, 0.2, 0.3, 0.4]), ex = (1 + 2 * x) / (1 - x), show = (v) => v.toFixed(3);
      const o = mcqOptions(r, ex, [1 + 3 * x, (1 + x) / (1 - x), 1 / (1 - 3 * x) > 0 ? 1 / (1 - 3 * x) : 3, 1 + 2 * x], show);
      return { q: `For a material of polarisable molecules with $N\\alpha/(3\\varepsilon_0) = ${x}$, the Clausius-Mossotti relation gives the relative permittivity as`,
        options: o.options, answer: o.answer,
        sol: `$\\dfrac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = \\dfrac{N\\alpha}{3\\varepsilon_0} = x$, so $\\varepsilon_r = \\dfrac{1 + 2x}{1 - x} = \\dfrac{1 + ${2 * x}}{1 - ${x}} = ${show(ex)}$. Ignoring the local field gives the dilute-gas value $1 + 3x = ${show(1 + 3 * x)}$, accurate only for small $x$; as $x \\to 1$ the exact form diverges (polarisation catastrophe).`,
        trap: 'The local-field enhancement matters in dense media; $1 + N\\alpha/\\varepsilon_0$ is only the dilute limit.' };
    } },
  { id: 'diel-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'skin depth', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const [nm, rho] = choose(r, [['copper', 1.7e-8], ['aluminium', 2.7e-8], ['stainless steel (non-magnetic)', 7e-7]]), f = choose(r, [50, 1e3, 1e6, 1e9]);
        x = Math.sqrt((2 * rho) / (2 * Math.PI * f * 4e-7 * Math.PI)); unit = '\\text{m}';
        q = `The skin depth of ${nm} ($\\rho = ${sci(rho)}$ Ω m) at $${sci(f)}$ Hz is about`;
        sol = `$\\delta = \\sqrt{2\\rho/(\\omega\\mu_0)} = \\sqrt{2(${sci(rho)})/(2\\pi\\times${sci(f)}\\times4\\pi\\times10^{-7})} = ${sci(x)}$ m.`;
      } else {
        const E = choose(r, [1e3, 1e5, 1e7]), a = choose(r, [1e-10, 2e-10]);
        x = 4 * Math.PI * 8.854e-12 * a ** 3 * E; unit = '\\text{C m}';
        q = `Model an atom of radius $${sci(a)}$ m with polarisability $\\alpha = 4\\pi\\varepsilon_0R^3$. In a field of $${sci(E)}$ V/m its induced dipole moment is about`;
        sol = `$p = 4\\pi\\varepsilon_0R^3E = ${sci(x)}$ C m: tiny compared with $ea_0 \\approx 8.5\\times10^{-30}$ C m, because laboratory fields are far below atomic fields ($\\sim 10^{11}$ V/m).`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Skin depth falls as $1/\\sqrt f$: copper is about 9 mm at 50 Hz and 2 µm at 1 GHz.' };
    } },
];
