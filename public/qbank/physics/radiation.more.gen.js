// Extra question shapes for radiation (templates rdn-m31..m35). Imported by radiation.js.
import { choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'rdn-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'electric dipole radiation', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 4]), not = r() < 0.5;
      const m = msqOf(r, [
        [`raising the frequency ${k}-fold (same dipole amplitude) raises the radiated power ${k ** 4}-fold`, true, `$P \\propto p_0^2\\omega^4$, so $${k}^4 = ${k ** 4}$.`],
        [`raising the frequency ${k}-fold (same dipole amplitude) raises the radiated power ${k ** 2}-fold`, false, `$P \\propto \\omega^4$: the factor is ${k ** 4}.`],
        ['no power is radiated along the dipole axis', true, 'The intensity goes as $\\sin^2\\theta$.'],
        ['the intensity is largest in the plane perpendicular to the dipole', true, '$\\sin^2\\theta = 1$ at $\\theta = 90^\\circ$.'],
        ['in the radiation zone the fields fall off as $1/r^2$', false, 'Radiation fields fall as $1/r$, so the intensity falls as $1/r^2$ and the power through a sphere is constant.'],
        ['the radiated wave is linearly polarised in the plane containing the dipole axis and the line of sight', true, '$\\vec E$ is along $\\hat\\theta$.'],
        [`doubling the dipole amplitude raises the power 2-fold`, false, '$P \\propto p_0^2$: it rises 4-fold.'],
      ], { not });
      return { q: `An oscillating electric dipole $p_0\\cos\\omega t\\,\\hat z$ radiates. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Dipole power goes as $\\omega^4p_0^2$ with a $\\sin^2\\theta$ pattern and fields falling as $1/r$.' };
    } },
  { id: 'rdn-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'radiating systems', format: 'match',
    make(r) {
      const L = {
        ed: 'power $\\propto \\omega^4$, pattern $\\sin^2\\theta$ about the axis of oscillation',
        md: 'power $\\propto \\omega^4$, pattern $\\sin^2\\theta$ but with $\\vec E$ and $\\vec B$ roles swapped, and weaker by about $(v/c)^2$',
        quad: 'power $\\propto \\omega^6$, a four-lobed pattern',
        none: 'no radiation at all',
        lar: 'power $\\propto a^2$ (Larmor), independent of the speed for $v \\ll c$',
      };
      const cas = choose(r, [
        ['a charge oscillating up and down along a line', 'ed', 'An oscillating dipole moment $qz(t)$.'],
        ['a small current loop carrying an alternating current', 'md', 'An oscillating magnetic dipole; its fields are those of an electric dipole with $\\vec E \\leftrightarrow c\\vec B$.'],
        ['two equal charges oscillating in opposite directions about a common centre (no net dipole)', 'quad', 'The dipole moment stays zero; the next term, the electric quadrupole, radiates as $\\omega^6$.'],
        ['a uniformly charged spherical shell whose radius oscillates (breathing)', 'none', 'Outside, the field stays exactly $Q/4\\pi\\varepsilon_0r^2$ (spherical symmetry): no radiation.'],
        ['a charge moving in a circle at low speed', 'lar', 'Its centripetal acceleration radiates by the Larmor formula.'],
      ]);
      return { q: `For ${cas[0]}, the radiation is best described as`, ...matchOne(r, L, cas),
        trap: 'A spherically symmetric source cannot radiate; each higher multipole brings two more powers of $\\omega$.' };
    } },
  { id: 'rdn-m33', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'scattering',
    make(r) {
      const P = choose(r, [[450, 650], [400, 700], [470, 590], [500, 1000], [380, 760]]);
      const ratio = round((P[1] / P[0]) ** 4, 2);
      const o = mcqOptions(r, ratio, shuffle(r, [round((P[1] / P[0]) ** 2, 2), round(P[1] / P[0], 2), round((P[1] / P[0]) ** 6, 2), round((P[0] / P[1]) ** 4, 2)]));
      return { q: `Sunlight scatters off air molecules (much smaller than the wavelength). How many times more strongly is light of ${P[0]} nm scattered than light of ${P[1]} nm?`, ...o,
        sol: `Small scatterers act as induced dipoles, and dipole radiation goes as $\\omega^4 \\propto \\lambda^{-4}$ (Rayleigh). So the ratio is $(${P[1]}/${P[0]})^4 = ${ratio}$. This is why the sky is blue.`,
        trap: 'The power is $\\lambda^{-4}$, so put the longer wavelength on top.' };
    } },
  { id: 'rdn-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Larmor formula', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [
        ['an electron in a hydrogen atom (classical orbit, $a \\approx 9\\times10^{22}$ m/s$^2$)', 9e22],
        ['an electron in a TV-style tube stopping in 1 cm from $10^7$ m/s ($a \\approx 5\\times10^{15}$ m/s$^2$)', 5e15],
        ['an electron in a 1 T field at $10^6$ m/s ($a \\approx 1.8\\times10^{17}$ m/s$^2$)', 1.8e17],
        ['an electron in a radio antenna (peak $a \\approx 10^{10}$ m/s$^2$)', 1e10],
      ]);
      const P = 5.7e-54 * C[1] ** 2, o = orderOpts(r, P, '\\text{W}');
      return { q: `By the Larmor formula, the power radiated by ${C[0]} is of order`, ...o,
        sol: `$P = \\dfrac{e^2a^2}{6\\pi\\varepsilon_0c^3} \\approx 5.7\\times10^{-54}\\,a^2$ W (with $a$ in m/s$^2$), which gives about $${(P / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ W.`,
        trap: 'The prefactor $e^2/(6\\pi\\varepsilon_0c^3)$ is tiny, about $6\\times10^{-54}$ in SI; the power goes as $a^2$.' };
    } },
  { id: 'rdn-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'radiation zone', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['the radiation zone is where $r \\gg \\lambda$ (and $r \\gg$ the source size)', true, 'There the $1/r$ terms dominate.'],
        ['in the radiation zone $\\vec E$, $\\vec B$ and $\\hat r$ are mutually perpendicular', true, 'The fields form a locally plane wave.'],
        ['radiation requires an accelerated charge or a time-varying current', true, 'Uniform motion produces no radiation.'],
        ['the power through a large sphere does not depend on its radius', true, 'Intensity $\\propto 1/r^2$ times area $\\propto r^2$.'],
        ['in the radiation zone the fields fall off as $1/r^2$', false, 'They fall as $1/r$; the static-like near fields fall faster.'],
        ['a charge moving at constant velocity radiates if it moves fast enough', false, 'A boost to its rest frame shows a static Coulomb field: no radiation.'],
        ['near the source the fields are mainly radiative and in phase', false, 'Close in, the reactive (quasi-static) fields dominate.'],
      ], not);
      return { q: `Which statement about electromagnetic radiation from a localised source is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Only the $1/r$ part of the fields carries energy to infinity.' };
    } },
];
