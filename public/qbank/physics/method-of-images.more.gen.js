// Extra question shapes for method-of-images (templates gim-m31..m35). Imported by method-of-images.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { matchOne } from './_odd.js';

export default [
  { id: 'gim-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'grounded plane', format: 'statements',
    make(r) {
      const q = choose(r, [1, 2, 3, 4]), d = choose(r, [1, 2, 3, 5]), not = r() < 0.5;
      const k = 8.99e9, F = (k * (q * 1e-6) ** 2) / (4 * (d * 0.01) ** 2);
      const m = msqOf(r, [
        [`the field above the plane is that of $+${q}$ μC and an image $-${q}$ μC at ${d} cm below the plane`, true, 'The pair makes $V = 0$ on the plane and has the right charge above it, so by uniqueness it gives the field there.'],
        [`the charge is pulled towards the plane with a force of about ${round(F, 1)} N`, true, `$F = \\dfrac{q^2}{4\\pi\\varepsilon_0(2d)^2} = \\dfrac{8.99\\times10^9\\times(${q}\\times10^{-6})^2}{(${2 * d}\\times10^{-2})^2} = ${round(F, 1)}$ N.`],
        [`the charge is pulled towards the plane with a force of about ${round(F * 4, 1)} N`, false, `That uses separation $d$ instead of $2d$; the correct force is ${round(F, 1)} N.`],
        [`the total charge induced on the plane is $-${q}$ μC`, true, 'All field lines from the charge end on the plane.'],
        ['the induced surface charge density is largest directly below the charge', true, '$\\sigma = -qd/[2\\pi(\\rho^2 + d^2)^{3/2}]$ peaks at $\\rho = 0$.'],
        ['the work needed to bring the charge in from infinity equals the energy of the charge-plus-image pair', false, 'It is half of it: only the real half-space holds field energy, $W = -q^2/(16\\pi\\varepsilon_0d)$.'],
        ['the potential below the plane (inside the conductor) is that of the charge plus its image', false, 'Inside the conductor $V = 0$; the image only reproduces the field in the region above.'],
      ], { not });
      return { q: `A point charge $+${q}$ μC sits ${d} cm above a large grounded conducting plane. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The image is a mathematical device for the region outside the conductor only; the separation in Coulomb\'s law is $2d$.' };
    } },
  { id: 'gim-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'image systems', format: 'match',
    make(r) {
      const R = int(r, 1, 4), a = R + int(r, 1, 4), er = choose(r, [2, 3, 5]);
      const L = {
        gs: `$-q\\,${frac(R, a)}$ at distance $${frac(R * R, a)}$ from the centre`,
        ns: `$-q\\,${frac(R, a)}$ at distance $${frac(R * R, a)}$ from the centre, plus $+q\\,${frac(R, a)}$ at the centre`,
        cor: 'three images: $-q$, $-q$ and $+q$ at the reflections in each plane and in the corner',
        lc: `a line charge $-\\lambda$ at distance $${frac(R * R, a)}$ from the axis`,
        die: `$-q\\,${frac(er - 1, er + 1)}$ at the mirror point (for the field outside)`,
      };
      const cas = choose(r, [
        [`a point charge $q$ at distance ${a} from the centre of a grounded conducting sphere of radius ${R}`, 'gs', `Kelvin's image: $q' = -qR/a$ at $R^2/a$ makes $V = 0$ on the sphere.`],
        [`a point charge $q$ at distance ${a} from the centre of an isolated, uncharged conducting sphere of radius ${R}`, 'ns', 'Start from the grounded-sphere image, then add $+qR/a$ at the centre to make the total charge zero while keeping the surface an equipotential.'],
        ['a point charge $q$ inside a right-angled corner formed by two grounded conducting half-planes', 'cor', 'Reflecting in each plane and then reflecting the reflections gives three images with alternating signs.'],
        [`a line charge $\\lambda$ parallel to a grounded conducting cylinder of radius ${R}, at distance ${a} from its axis`, 'lc', `For a line charge the image $-\\lambda$ at $R^2/a$ makes the cylinder an equipotential (a constant can be added to make it zero).`],
        [`a point charge $q$ above the flat surface of a semi-infinite linear dielectric with $\\varepsilon_r = ${er}$`, 'die', `The boundary conditions on $D_\\perp$ and $E_\\parallel$ are met by $q' = -q(\\varepsilon_r - 1)/(\\varepsilon_r + 1) = -${frac(er - 1, er + 1)}q$.`],
      ]);
      return { q: `For ${cas[0]}, the image system that gives the field in the region of the real charge is`, ...matchOne(r, L, cas),
        trap: 'A grounded sphere needs one image; an isolated neutral one needs a second image at the centre to fix its charge.' };
    } },
  { id: 'gim-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grounded sphere',
    make(r) {
      const R = choose(r, [2, 3, 4, 6]), a = R * choose(r, [2, 3, 4]) / 2 + R, q = choose(r, [6, 12, 24]);
      const qi = -(q * R) / a, b = (R * R) / a;
      const pair = (x, y) => `$q' = ${round(x, 2)}$ nC at $${round(y, 2)}$ cm`;
      const o = mcqOptions(r, pair(qi, b), shuffle(r, [pair(-q, b), pair(qi, R - b), pair(-(q * a) / R, b), pair(qi, a - R), pair((q * R) / a, b)]));
      return { q: `A charge $q = ${q}$ nC is ${a} cm from the centre of a grounded conducting sphere of radius ${R} cm. Its image (charge, distance from the centre) is`, ...o,
        sol: `$q' = -q\\dfrac{R}{a} = -${q}\\times\\dfrac{${R}}{${a}} = ${round(qi, 2)}$ nC, placed on the line to the charge at $b = R^2/a = ${R * R}/${a} = ${round(b, 2)}$ cm from the centre. Check: every point of the sphere is at distances in the ratio $R/a$ from the image and the charge, so the potentials cancel.`,
        trap: 'The image is smaller than $q$ (factor $R/a$) and sits inside the sphere at $R^2/a$, not at the mirror distance.' };
    } },
  { id: 'gim-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dielectric half-space', format: 'limiting case',
    make(r) {
      const er = choose(r, [2, 3, 4, 5, 9, 11]), Fc = choose(r, [10, 20, 30, 60]);
      const f = (er - 1) / (er + 1), ans = round(Fc * f, 2);
      const o = mcqOptions(r, ans, shuffle(r, [Fc, round(Fc / er, 2), round(Fc * (er - 1) / er, 2), round(Fc * 2 * f, 2), round(Fc * f * f, 2)]), (v) => `$${v}$ mN`);
      return { q: `A small charged bead held at a fixed height above a large grounded metal sheet feels an attraction of ${Fc} mN. The metal is replaced by a thick slab of linear dielectric with $\\varepsilon_r = ${er}$ (bead at the same height). The attraction becomes`, ...o,
        sol: `For the dielectric the image charge is $q' = -q\\dfrac{\\varepsilon_r - 1}{\\varepsilon_r + 1}$ at the mirror point, while for the metal it is $-q$. The force scales with the image: $${Fc}\\times\\dfrac{${er - 1}}{${er + 1}} = ${ans}$ mN. Limits: $\\varepsilon_r \\to 1$ gives no force; $\\varepsilon_r \\to \\infty$ gives back the conductor.`,
        trap: 'The factor is $(\\varepsilon_r - 1)/(\\varepsilon_r + 1)$, not $1/\\varepsilon_r$.' };
    } },
  { id: 'gim-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wedges', format: 'conceptual',
    make(r) {
      const th = choose(r, [180, 90, 60, 45, 30, 120, 72, 135]);
      const n = 180 / th, ok = Number.isInteger(n), ans = ok ? `${2 * n - 1}` : 'no finite set of images works';
      const pool = ['1', '3', '5', '7', '11', '2', '4', 'no finite set of images works'].filter((x) => x !== ans);
      const o = mcqOptions(r, ans, shuffle(r, pool));
      return { q: `A point charge sits between two grounded conducting half-planes that meet along a line at an angle of $${th}^\\circ$. How many image charges does the method of images need?`, ...o,
        sol: ok ? `For a wedge of angle $\\pi/n$ (here $n = ${n}$), repeated reflection closes up after $2n$ copies in all (the charge and its images, alternating in sign), so $2n - 1 = ${2 * n - 1}$ ${n === 1 ? 'image is' : 'images are'} needed.${n === 1 ? ' (A single plane needs one image.)' : ''}` : `$180^\\circ/${th}^\\circ = ${round(n, 3)}$ is not an integer, so successive reflections never close up and some images would fall inside the physical region. The method fails for this angle.`,
        trap: 'The method works only when the wedge angle is $180^\\circ/n$; then $2n - 1$ images are needed.' };
    } },
];
