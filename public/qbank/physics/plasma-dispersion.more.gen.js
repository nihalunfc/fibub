// Extra question shapes for plasma-dispersion (templates netpl-m31..m35). Imported by plasma-dispersion.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netpl-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'dispersion relation', format: 'statements',
    make(r) {
      const n = choose(r, [1e10, 1e12, 1e14, 1e16]), fp = 8.98 * Math.sqrt(n), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a plasma with $n_e = ${sci(n)}$ m$^{-3}$ reflects radio waves below about $${sci(fp)}$ Hz`, `a plasma with $n_e = ${sci(n)}$ m$^{-3}$ reflects radio waves below about $${sci(fp * 6.283)}$ Hz`, `$f_p = \\tfrac{1}{2\\pi}\\sqrt{n e^2/(\\varepsilon_0m)} = 8.98\\sqrt{n}$ Hz $= ${sci(fp)}$ Hz; the other value is the angular frequency $\\omega_p$ in rad/s.`),
        ['in a cold unmagnetised plasma $\\omega^2 = \\omega_p^2 + c^2k^2$', true, 'From $\\varepsilon(\\omega) = 1 - \\omega_p^2/\\omega^2$.'],
        ['above the cutoff, phase velocity exceeds $c$ and group velocity is below $c$, with $v_pv_g = c^2$', true, 'Differentiate the dispersion relation: $\\omega\\,d\\omega = c^2k\\,dk$.'],
        ['below $\\omega_p$ the wave is evanescent', true, '$k$ is imaginary: the field decays into the plasma.'],
        ['the refractive index of a plasma above $\\omega_p$ is less than 1', true, '$n = \\sqrt{1 - \\omega_p^2/\\omega^2} \\lt 1$.'],
        ['the group velocity of an EM wave in a plasma can exceed $c$', false, '$v_g = c\\sqrt{1 - \\omega_p^2/\\omega^2} \\lt c$.'],
        ['in the cold-plasma model $\\omega_p$ depends on the electron temperature', false, '$\\omega_p^2 = ne^2/(\\varepsilon_0m)$: only density. Temperature enters the Bohm-Gross correction.'],
        ['$\\omega_p$ is proportional to $n_e$', false, 'It goes as $\\sqrt{n_e}$.'],
      ], { not });
      return { q: `Which of the following statements about electromagnetic waves in a plasma are ${nt(not)}?`, ...m,
        trap: 'Phase velocity above $c$ carries no signal; the group velocity stays below $c$.' };
    } },
  { id: 'netpl-m32', type: 'mcq', level: 4, exams: ['net'], sub: 'magnetised plasma',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['Faraday rotation through a magnetised plasma grows as the square of the wavelength', true, 'Rotation angle $= \\text{RM}\\,\\lambda^2$ with RM $\\propto \\int n_eB_\\parallel\\,dl$.'],
        ['a right-circularly polarised wave along $\\vec B$ resonates at the electron cyclotron frequency', true, 'It rotates with the electrons.'],
        ['whistlers have a group velocity that rises with frequency, so higher tones arrive first', true, '$\\omega \\propto k^2$ gives $v_g \\propto \\sqrt\\omega$.'],
        ['at very low frequency, waves along $\\vec B$ become Alfvén waves', true, 'They travel at $v_A = B/\\sqrt{\\mu_0\\rho}$.'],
        ['the Debye length grows with temperature and falls with density', true, '$\\lambda_D = \\sqrt{\\varepsilon_0kT/(ne^2)}$.'],
        ['Faraday rotation is independent of frequency', false, 'It goes as $\\lambda^2$, i.e. $1/\\omega^2$.'],
        ['whistlers arrive with the low tones first', false, 'Higher frequencies travel faster: falling tones.'],
        ['the Debye length falls as the temperature rises', false, 'Hotter electrons screen less effectively.'],
      ], not);
      return { q: `Which statement about waves and screening in plasmas is ${nt(not)}?`, ...m,
        trap: 'Whistler dispersion: $\\omega \\propto k^2$, so the falling tone.' };
    } },
  { id: 'netpl-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dispersion relation', format: 'match',
    make(r) {
      const L = {
        em: '$\\omega^2 = \\omega_p^2 + c^2k^2$',
        bg: '$\\omega^2 = \\omega_p^2 + 3k^2v_{th}^2$',
        ia: '$\\omega \\approx kc_s$ at small $k$ (sound-like)',
        alf: '$\\omega = kv_A$ along $\\vec B$',
        wh: '$\\omega \\approx k^2c^2\\omega_c/\\omega_p^2$',
        cold: '$\\omega = \\omega_p$ at every $k$',
      };
      const cas = choose(r, [
        ['a transverse electromagnetic wave in a cold unmagnetised plasma', 'em', 'The displacement current plus electron current give $\\varepsilon = 1 - \\omega_p^2/\\omega^2$.'],
        ['a longitudinal electron (Langmuir) wave in a warm plasma', 'bg', 'Electron pressure adds the Bohm-Gross term.'],
        ['an ion-acoustic wave', 'ia', 'Electron pressure and ion inertia: $c_s = \\sqrt{kT_e/m_i}$.'],
        ['a low-frequency wave along $\\vec B$ in a magnetised plasma', 'alf', 'Field-line tension and plasma inertia.'],
        ['a whistler (with $\\omega \\ll \\omega_c$ and $\\omega_p \\gg \\omega_c$)', 'wh', 'The R-wave below the cyclotron frequency.'],
        ['a longitudinal oscillation in a cold plasma', 'cold', 'No pressure: every electron slab oscillates at $\\omega_p$, so the group velocity is zero.'],
      ]);
      return { q: `The dispersion relation of ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Cold plasma oscillations do not propagate ($v_g = 0$); thermal motion (Bohm-Gross) makes them travel.' };
    } },
  { id: 'netpl-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase and group velocity', format: 'graph in words',
    make(r) {
      const L = {
        hyp: 'starts at $\\omega_p$ at zero and bends over to approach a straight line of slope $c$',
        vp: 'is infinite at $\\omega_p$ and falls toward $c$ at high frequency',
        vg: 'is zero at $\\omega_p$ and rises toward $c$ at high frequency',
        n: 'is zero at $\\omega_p$ and rises toward 1 at high frequency',
        R: 'is 1 below $\\omega_p$ and drops toward 0 above it',
      };
      const cas = choose(r, [
        ['$\\omega$ plotted against $k$', 'hyp', '$\\omega = \\sqrt{\\omega_p^2 + c^2k^2}$: a hyperbola with asymptote $\\omega = ck$.'],
        ['the phase velocity plotted against $\\omega$ (for $\\omega \\gt \\omega_p$)', 'vp', '$v_p = c/\\sqrt{1 - \\omega_p^2/\\omega^2}$.'],
        ['the group velocity plotted against $\\omega$ (for $\\omega \\gt \\omega_p$)', 'vg', '$v_g = c\\sqrt{1 - \\omega_p^2/\\omega^2}$.'],
        ['the refractive index plotted against $\\omega$ (for $\\omega \\gt \\omega_p$)', 'n', '$n = \\sqrt{1 - \\omega_p^2/\\omega^2}$.', ['vg']],
        ['the normal-incidence reflectivity of a collision-free plasma (or ideal metal) plotted against $\\omega$', 'R', 'Below $\\omega_p$ the index is imaginary and the wave is totally reflected; above, reflection falls quickly.'],
      ]);
      return { q: `For EM waves in a cold, collision-free plasma, ${cas[0]}`, ...matchOne(r, L, cas),
        trap: 'At the cutoff the phase velocity diverges while the group velocity vanishes.' };
    } },
  { id: 'netpl-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'plasma frequency', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      const [nm, n, T] = choose(r, [['the ionosphere', 1e12, 0.1], ['a metal (conduction electrons)', 8e28, 0], ['interstellar gas', 1e5, 1], ['the solar corona', 1e14, 100], ['a laser-produced plasma', 1e27, 1000]]);
      let q, x, unit, sol;
      if (kind === 0 || T === 0) {
        x = 8.98 * Math.sqrt(n); unit = '\\text{Hz}';
        q = `The plasma frequency $f_p$ of ${nm}, with electron density about $${sci(n)}$ m$^{-3}$, is`;
        sol = `$f_p = 8.98\\sqrt{n_e}$ Hz (with $n_e$ in m$^{-3}$) $= 8.98\\sqrt{${sci(n)}} = ${sci(x)}$ Hz.`;
      } else {
        x = 7434 * Math.sqrt(T / n); unit = '\\text{m}';
        q = `The Debye length of ${nm}, with $n_e \\approx ${sci(n)}$ m$^{-3}$ and $kT_e \\approx ${T}$ eV, is`;
        sol = `$\\lambda_D = \\sqrt{\\varepsilon_0kT/(ne^2)} = 7.43\\times10^3\\sqrt{T[\\text{eV}]/n} = ${sci(x)}$ m.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: '$f_p$ goes as the square root of the density: $10^{12}$ m$^{-3}$ gives about 9 MHz.' };
    } },
];
