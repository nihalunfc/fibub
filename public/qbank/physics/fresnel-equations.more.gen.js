// Extra question shapes for fresnel-equations (templates frs-m31..m35). Imported by fresnel-equations.js.
import { choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts } from './_odd.js';

const deg = (x) => (x * 180) / Math.PI;

export default [
  { id: 'frs-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'special angles', format: 'statements',
    make(r) {
      const [n1, n2] = choose(r, [[1, 1.5], [1.5, 1], [1, 1.33], [1.33, 1], [1.5, 1.33], [1, 2.4]]), not = r() < 0.5;
      const tb = round(deg(Math.atan(n2 / n1)), 1), R0 = round(((n1 - n2) / (n1 + n2)) ** 2 * 100, 1), tir = n1 > n2;
      const tc = tir ? round(deg(Math.asin(n2 / n1)), 1) : 0;
      const m = msqOf(r, [
        [`the Brewster angle is about $${tb}^\\circ$`, true, `$\\tan\\theta_B = n_2/n_1 = ${round(n2 / n1, 3)}$.`],
        [`at normal incidence about ${R0}% of the intensity is reflected`, true, `$R = \\left(\\dfrac{n_1 - n_2}{n_1 + n_2}\\right)^2 = ${R0 / 100}$.`],
        [`at normal incidence about ${round(R0 * 2 + 1, 1)}% of the intensity is reflected`, false, `$R = (n_1 - n_2)^2/(n_1 + n_2)^2 = ${R0}$%.`],
        ['total internal reflection is possible', tir, tir ? `Light goes from denser ($${n1}$) to rarer ($${n2}$).` : `Light goes from $n = ${n1}$ into the denser $n = ${n2}$, so there is no critical angle.`],
        [tir ? `the critical angle is about $${tc}^\\circ$` : 'the critical angle is about $90^\\circ$', tir, tir ? `$\\sin\\theta_c = n_2/n_1 = ${round(n2 / n1, 3)}$.` : 'No critical angle exists going into a denser medium.'],
        ['the reflected light at the Brewster angle is fully polarised with $\\vec E$ perpendicular to the plane of incidence', true, 'Only the $p$ (in-plane) reflection vanishes.'],
        ['at the Brewster angle the reflected and refracted rays are parallel', false, 'They are perpendicular: $\\theta_B + \\theta_t = 90^\\circ$.'],
      ], { not });
      return { q: `Light travels from a medium with $n_1 = ${n1}$ to one with $n_2 = ${n2}$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Brewster uses $\\tan$, critical angle uses $\\sin$, and only light going into a rarer medium can be totally reflected.' };
    } },
  { id: 'frs-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'reflectance curves', format: 'graph in words',
    make(r) {
      const ext = r() < 0.5, pol = r() < 0.5 ? 'p' : 's';
      const opts = {
        ps: 'starts at a few per cent, falls to zero at the Brewster angle, then rises steeply to 100% at grazing incidence',
        ss: 'starts at a few per cent and rises steadily to 100% at grazing incidence, with no zero',
        pi: 'starts at a few per cent, falls to zero at the Brewster angle, then rises steeply to 100% at the critical angle and stays there',
        si: 'starts at a few per cent and rises to 100% at the critical angle, staying there beyond it',
        flat: 'stays at the normal-incidence value for every angle',
      };
      const key = (pol === 'p' ? 'p' : 's') + (ext ? 's' : 'i');
      const o = mcqOptions(r, opts[key], shuffle(r, Object.keys(opts).filter((k) => k !== key).map((k) => opts[k])));
      return { q: `For light ${ext ? 'in air hitting glass' : 'inside glass hitting a glass-air surface'}, polarised with $\\vec E$ ${pol === 'p' ? 'in' : 'perpendicular to'} the plane of incidence, the reflectance as a function of angle of incidence (from $0^\\circ$ to $90^\\circ$)`, ...o,
        sol: `${pol === 'p' ? 'For $p$ polarisation $r_p$ changes sign at the Brewster angle, so $R_p$ touches zero there.' : 'For $s$ polarisation $r_s$ never vanishes, so $R_s$ rises monotonically.'} ${ext ? 'Going into the denser medium there is no critical angle, so $R \\to 1$ only at grazing incidence.' : 'Going into the rarer medium $R$ reaches 1 at the critical angle ($\\approx 42^\\circ$ for glass) and stays at 1 beyond it (total internal reflection).'}`,
        trap: 'Only $p$ light has a Brewster zero; only light inside the denser medium has a critical angle.' };
    } },
  { id: 'frs-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'normal incidence',
    make(r) {
      const n = choose(r, [1.5, 1.33, 2, 2.4, 3.5, 4]), R = ((n - 1) / (n + 1)) ** 2, T = (1 - R) ** 2;
      const pct = (x) => `${round(x * 100, 1)}%`;
      const o = mcqOptions(r, pct(T), shuffle(r, [pct(1 - R), pct((1 - R) ** 4), pct(R), pct(1 / n)].filter((x) => x !== pct(T))));
      return { q: `A thick plate with refractive index $${n}$ stands in air. Light hits it at normal incidence. Ignoring multiple reflections and absorption, the fraction of the intensity that gets through both faces is about`, ...o,
        sol: `Each face reflects $R = \\left(\\dfrac{n - 1}{n + 1}\\right)^2 = ${round(R, 4)}$ and transmits $1 - R$. Through two faces: $(1 - R)^2 = ${round(T, 4)}$, about ${pct(T)}.`,
        trap: 'There are two surfaces; each one loses the fraction $R$.' };
    } },
  { id: 'frs-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'evanescent waves', format: 'order of magnitude',
    make(r) {
      const lam = choose(r, [[500e-9, '500 nm'], [1.55e-6, '1.55 μm'], [10.6e-6, '10.6 μm'], [633e-9, '633 nm']]);
      const [n1, th] = choose(r, [[1.5, 45], [1.5, 60], [1.5, 80], [1.33, 60]]);
      const s = n1 * Math.sin((th * Math.PI) / 180), d = lam[0] / (2 * Math.PI * Math.sqrt(s * s - 1)), o = orderOpts(r, d, '\\text{m}');
      return { q: `Light of vacuum wavelength ${lam[1]} is totally reflected inside a medium of index $${n1}$ at $${th}^\\circ$ incidence on a surface with air. The evanescent field outside decays (by a factor $e$) over a distance of order`, ...o,
        sol: `$d = \\dfrac{\\lambda_0}{2\\pi\\sqrt{n_1^2\\sin^2\\theta - 1}} = \\dfrac{\\lambda_0}{2\\pi\\times${round(Math.sqrt(s * s - 1), 3)}}$, which is about $${(d / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ m. It is a fraction of a wavelength, so frustrated total reflection needs a gap thinner than about $\\lambda$.`,
        trap: 'The penetration depth scales with the wavelength and shrinks as the angle moves past the critical angle.' };
    } },
  { id: 'frs-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'reflection facts', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['reflection off a denser medium at normal incidence reverses the sign of $E$', true, '$r = (n_1 - n_2)/(n_1 + n_2) \\lt 0$ when $n_2 \\gt n_1$.'],
        ['under total internal reflection the reflected wave picks up a phase shift that differs for $s$ and $p$', true, 'This is used in a Fresnel rhomb to make circular polarisation.'],
        ['under total internal reflection no energy flows across the surface on average', true, 'The evanescent wave carries no time-averaged power normal to the surface.'],
        ['$R + T = 1$ for a lossless interface, with $T$ including the factor $n_2\\cos\\theta_t/(n_1\\cos\\theta_i)$', true, 'The amplitude ratio alone does not give the power ratio.'],
        ['the transmitted amplitude can never exceed the incident amplitude', false, '$t = 2n_1/(n_1 + n_2) \\gt 1$ when $n_1 \\gt n_2$; energy is still conserved.'],
        ['the Brewster angle exists only for light going into a denser medium', false, 'It exists both ways, $\\tan\\theta_B = n_2/n_1$.'],
        ['under total internal reflection there is no field at all beyond the surface', false, 'An evanescent field extends about a wavelength.'],
      ], not);
      return { q: `Which statement about reflection and refraction at a flat boundary between two lossless dielectrics is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Amplitude coefficients can exceed 1; power coefficients cannot.' };
    } },
];
