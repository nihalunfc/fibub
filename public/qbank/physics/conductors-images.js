// Conductors, Laplace's equation and images: conductors in equilibrium, surface charge and pressure, cavities,
// uniqueness and the mean-value property of harmonic functions, separation of variables, images for planes,
// corners and spheres, a conducting sphere in a uniform field.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const K = 1 / (4 * Math.PI * C.eps0); // 8.988e9 N m^2 C^-2

import * as Q5 from '../_util.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'conductors-images',
  items: [
    // ---------- level 1 ----------
    { id: 'cim-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'conductors',
      q: 'A solid metal block of irregular shape carries a net charge and has reached electrostatic equilibrium. Inside the metal itself, the electric field is',
      options: ['zero at every point', 'equal to $\\sigma/\\epsilon_0$, where $\\sigma$ is the local surface charge density', 'uniform but not zero', 'largest near the sharpest corner'], answer: 0,
      sol: 'A conductor has free electrons. If any field existed inside the metal they would move, so in equilibrium (nothing moving) the field inside the material must be zero everywhere. The charge sits on the surface, arranged exactly so that its field cancels inside.',
      trap: '$\\sigma/\\epsilon_0$ is the field just <em>outside</em> the surface, not inside the metal. Sharp corners do have strong fields, but outside.' },
    { id: 'cim-002', type: 'nat', level: 1, exams: ['jam'], sub: 'conductors', unit: 'kV/m',
      q: 'At a certain point on the surface of a charged conductor the surface charge density is $3.0\\,\\mu\\text{C/m}^2$. The electric field just outside the surface at that point is ______ kV/m (to the nearest whole number).',
      answer: 339, tol: 3, calc: () => 3e-6 / C.eps0 / 1000,
      sol: 'Just outside a conductor the field is perpendicular to the surface with magnitude $E = \\sigma/\\epsilon_0$ (a tiny Gauss pillbox has flux only through its outer face). $E = \\dfrac{3.0\\times10^{-6}}{8.854\\times10^{-12}} = 3.39\\times10^5$ V/m $= 339$ kV/m.',
      trap: 'Using $\\sigma/(2\\epsilon_0)$, the field of an isolated sheet. A conductor has no field on its inner side, so all the flux goes outwards and the field is twice as big.' },
    { id: 'cim-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'cavities',
      q: 'A neutral metal sphere has an empty cavity of irregular shape inside it. A positive point charge is brought near the outside of the sphere. The electric field inside the cavity',
      options: ['points away from the outside charge', 'is zero', 'points towards the outside charge', 'is the same as it would be without the metal'], answer: 1,
      sol: 'The cavity is a charge-free region whose whole boundary is the metal, which is one equipotential. The potential inside the cavity must satisfy Laplace\'s equation with a constant value on the boundary, so by uniqueness it is that constant everywhere inside, and $\\vec E = -\\nabla V = 0$. This is the Faraday cage: outside charges cannot reach into an empty cavity.',
      trap: 'Thinking the outside field leaks in. The induced surface charges on the outer surface cancel it everywhere inside, including the cavity.' },
    { id: 'cim-004', type: 'msq', level: 1, exams: ['jam'], sub: 'conductors',
      q: 'Which of these statements about an isolated charged conductor in electrostatic equilibrium are correct?',
      options: ['Its whole surface is at one potential.', 'Just outside, the field is perpendicular to the surface.', 'Its surface charge density is the same everywhere on the surface, whatever its shape.', 'Any net charge it carries lies on its surface.'], answer: [0, 1, 3],
      sol: 'With zero field inside, no work is needed to move a charge between any two points of the conductor, so it is one equipotential. A field component along the surface would push surface charges along it, so in equilibrium the field just outside is normal to the surface. Gauss\'s law with a surface just inside the metal (where $E = 0$) shows no charge is enclosed, so the net charge is on the surface. The density is <em>not</em> uniform in general: it is larger where the surface curves sharply (points and edges).',
      trap: 'Uniform $\\sigma$ holds only for an isolated sphere. On a pear-shaped conductor the charge crowds onto the pointed end.' },
    { id: 'cim-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'laplace equation',
      q: 'Laplace\'s equation $\\nabla^2 V = 0$ holds',
      options: ['everywhere, including inside charge distributions', 'only inside conductors', 'at every point where there is no charge', 'only where the field is zero'], answer: 2,
      sol: 'Poisson\'s equation is $\\nabla^2V = -\\rho/\\epsilon_0$. Where $\\rho = 0$ it becomes Laplace\'s equation. That includes the empty space around conductors and the inside of conductors (where $V$ is constant), but those are special cases of "no charge here".',
      trap: '$\\nabla^2V = 0$ does not mean $E = 0$: in the empty gap of a capacitor the field is large but $\\nabla^2V$ is zero.' },
    { id: 'cim-006', type: 'nat', level: 1, exams: ['jam'], sub: 'images: plane', unit: '$\\mu$N',
      q: 'A point charge of $2.0$ nC is held 10 cm above a very large grounded metal plate. The magnitude of the force on it is ______ $\\mu$N (to two decimal places).',
      answer: 0.90, tol: 0.01, calc: () => K * (2e-9) ** 2 / 0.2 ** 2 * 1e6,
      sol: 'Replace the plate by an image charge $-q$ at 10 cm below the surface; above the plate the field is the same. The force is the Coulomb attraction between $q$ and its image, distance $2d = 0.20$ m apart: $F = \\dfrac{kq^2}{(2d)^2} = \\dfrac{(8.99\\times10^9)(2.0\\times10^{-9})^2}{0.04} = 8.99\\times10^{-7}$ N $\\approx 0.90\\,\\mu$N, towards the plate.',
      trap: 'Using $d$ instead of $2d$ for the separation, which gives four times the right force.' },
    // ---------- level 2 ----------
    { id: 'cim-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'images: plane',
      q: 'A point charge $q$ is at height $d$ above an infinite grounded conducting plane. For the region above the plane, the plane can be replaced by',
      options: ['a charge $+q$ at depth $d$ below the plane', 'a charge $-q$ at depth $d/2$ below the plane', 'a charge $-q/2$ at depth $d$ below the plane', 'a charge $-q$ at depth $d$ below the plane'], answer: 3,
      sol: 'We need $V = 0$ on the plane and the same charge $q$ above it. A charge $-q$ at the mirror point makes every point of the plane equidistant from $q$ and $-q$, so $V = kq/r - kq/r = 0$ there. By the uniqueness theorem this gives the correct potential everywhere above the plane (and only there: below the plane the real field is zero).',
      trap: 'The image has the opposite sign; a $+q$ image would make the plane a place of zero field, not zero potential.' },
    { id: 'cim-008', type: 'nat', level: 2, exams: ['jam'], sub: 'images: plane', unit: 'nC',
      q: 'A charge of $+5$ nC is held above an infinite grounded conducting plane. The total charge induced on the plane is ______ nC.',
      answer: -5, tol: 0,
      sol: 'Integrate the induced density $\\sigma = -\\dfrac{qd}{2\\pi(r^2+d^2)^{3/2}}$ over the plane: $\\int_0^\\infty \\sigma\\,2\\pi r\\,dr = -qd\\left[\\dfrac{1}{d} - 0\\right] = -q$. Quicker: every field line from $q$ ends on the plane (none escape to infinity in the upper half), so the plane holds exactly $-q = -5$ nC, whatever the height.',
      trap: 'Answering $-2.5$ nC by thinking only half of the field lines reach the plane.' },
    { id: 'cim-009', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'images: plane',
      q: 'A charge $q$ is at height $d$ above a grounded conducting plane. The induced surface charge density on the plane directly below the charge is',
      options: ['$-\\dfrac{q}{4\\pi d^2}$', '$-\\dfrac{q}{2\\pi d^2}$', '$-\\dfrac{q}{\\pi d^2}$', '$-\\dfrac{q}{2\\pi\\epsilon_0 d^2}$'], answer: 1,
      sol: 'Just above the plane, $q$ and its image each give a field of magnitude $kq/d^2$ at the foot point, both pointing down (towards the plane): $E = 2kq/d^2 = \\dfrac{q}{2\\pi\\epsilon_0d^2}$ downward. At a conductor $\\sigma = \\epsilon_0E_n$ with $E_n$ the outward normal component: $\\sigma = -\\dfrac{q}{2\\pi d^2}$.',
      trap: 'Forgetting the image doubles the field (giving $-q/4\\pi d^2$), or leaving $\\epsilon_0$ in: $\\sigma$ has units of C/m$^2$, so $\\epsilon_0$ cancels.' },
    { id: 'cim-010', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'images: energy', unit: 'nJ',
      q: 'A charge of $1.0$ nC is brought slowly from very far away to a point 5.0 cm above a large grounded metal plate. The work done by the external agent is ______ nJ (to one decimal place, with sign).',
      answer: -44.9, tol: 0.5, calc: () => -K * 1e-18 / (4 * 0.05) * 1e9,
      sol: 'The force on the charge at height $z$ is the image attraction $F = \\dfrac{kq^2}{4z^2}$ towards the plate, so the agent must hold it back with $+kq^2/4z^2$ (upward) while it moves down. The agent\'s force points up while the charge moves down, so the agent does negative work: $W = -\\int_d^\\infty \\dfrac{kq^2}{4z^2}dz = -\\dfrac{kq^2}{4d}$. Numbers: $-\\dfrac{(8.99\\times10^9)(10^{-18})}{0.20} = -4.49\\times10^{-8}$ J $= -44.9$ nJ.',
      trap: 'Using the energy of two real charges, $-kq^2/(2d)$. The image moves as the charge moves and only the upper half-space holds field energy, so the true work is half of that.' },
    { id: 'cim-011', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'uniqueness',
      q: 'In a region bounded by a closed surface, the electrostatic potential is fixed uniquely if we are given',
      options: ['the charge density inside, and nothing about the boundary', 'the field at one point inside', 'the charge density inside and the potential on the whole boundary', 'the total charge inside'], answer: 2,
      sol: 'This is the first uniqueness theorem: if two potentials $V_1, V_2$ obey the same Poisson equation inside and agree on the boundary, their difference obeys Laplace\'s equation and is zero on the boundary, so (having no maximum or minimum inside) it is zero everywhere. The second theorem replaces boundary values by the total charge on each conductor.',
      trap: 'Total charge alone is not enough: the same charge can be arranged in endless ways giving different fields.' },
    { id: 'cim-012', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'laplace equation',
      q: 'Which of these functions could be the electrostatic potential in a charge-free region of the $xy$ plane (no dependence on $z$)?',
      options: ['$x^2 - y^2$', '$x^2 + y^2$', '$xy$', '$e^{x}\\cos y$'], answer: [0, 2, 3],
      sol: 'Check $\\partial^2V/\\partial x^2 + \\partial^2V/\\partial y^2$. $x^2 - y^2$: $2 - 2 = 0$. $x^2 + y^2$: $2 + 2 = 4 \\ne 0$ (it needs a uniform charge density). $xy$: $0 + 0 = 0$. $e^x\\cos y$: $e^x\\cos y - e^x\\cos y = 0$. So three of the four are harmonic.',
      trap: '$x^2 + y^2$ looks the most "symmetric", but a bowl-shaped potential has a minimum, which Laplace\'s equation forbids.' },
    { id: 'cim-013', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'laplace equation',
      q: 'In a charge-free region, the potential at the centre of any sphere lying wholly in the region equals',
      options: ['the average of the potential over the sphere\'s surface', 'the largest value of the potential on the surface', 'zero', 'the potential at the point of the surface nearest to the nearest charge'], answer: 0,
      sol: 'This is the mean value property of solutions of Laplace\'s equation. It follows from the fact that a point charge $q$ outside a sphere has an average potential over the sphere equal to $kq/d$, its value at the centre; superposition extends this to any outside charges. A consequence: $V$ cannot have a maximum or minimum inside the region.',
      trap: 'The mean is over the surface, not over the volume (though the volume average gives the same answer too).' },
    { id: 'cim-014', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'images: sphere', unit: 'nC',
      q: 'A point charge of $+6$ nC is 30 cm from the centre of a grounded conducting sphere of radius 10 cm. The image charge that reproduces the field outside the sphere is ______ nC.',
      answer: -2, tol: 0, calc: () => -6 * 10 / 30,
      sol: 'For a grounded sphere of radius $R$ and an outside charge $q$ at distance $d$ from the centre, the image is $q\' = -qR/d$, placed on the line to $q$ at distance $R^2/d$ from the centre. Here $q\' = -6\\times10/30 = -2$ nC.',
      trap: 'Using $-q$ (the plane rule). A sphere only needs a smaller image, because it is smaller than the charge\'s distance.' },
    { id: 'cim-015', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'images: sphere', unit: 'cm',
      q: 'For the grounded sphere of radius 10 cm with a point charge 30 cm from its centre, the image charge sits ______ cm from the centre of the sphere (to two decimal places).',
      answer: 3.33, tol: 0.02, calc: () => 10 ** 2 / 30,
      sol: 'The image lies inside the sphere on the line joining the centre to the charge, at $b = R^2/d = 100/30 = 3.33$ cm from the centre. Check: a surface point at angle $\\theta$ is at distances $r_1$ from $q$ and $r_2$ from $q\'$ with $r_2/r_1 = R/d$ everywhere, so $kq/r_1 + kq\'/r_2 = 0$.',
      trap: 'Putting the image at $d/R$ or $R/d$ (not even a length). The rule is $R^2/d$, always inside the sphere.' },
    { id: 'cim-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'cavities',
      q: 'A charge $q$ is placed at the centre of an uncharged, isolated, thick conducting spherical shell with inner radius $a$ and outer radius $b$. For $r > b$ the field is',
      options: ['zero, because the shell screens the charge', '$\\dfrac{q}{4\\pi\\epsilon_0 r^2}\\cdot\\dfrac{a}{b}$', '$\\dfrac{2q}{4\\pi\\epsilon_0 r^2}$', '$\\dfrac{q}{4\\pi\\epsilon_0 r^2}$'], answer: 3,
      sol: 'Charge $-q$ is induced on the inner surface (so the field in the metal is zero) and, since the shell is neutral, $+q$ appears on the outer surface. A Gauss sphere with $r > b$ encloses $q - q + q = q$, so $E = kq/r^2$, as if the shell were absent.',
      trap: 'A neutral isolated shell does not screen what is inside from the outside world; only grounding the shell removes the outer $+q$.' },
    // ---------- level 3 ----------
    { id: 'cim-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'images: corners',
      q: 'Two grounded conducting half-planes meet along a line at an angle of $60^\\circ$, and a point charge is placed between them. The number of image charges needed to find the field in the wedge is ______.',
      answer: 5, tol: 0, calc: () => 360 / 60 - 1,
      sol: 'Reflecting repeatedly in the two planes generates charges at the corners of a pattern with $360^\\circ/60^\\circ = 6$ sectors, one charge per sector. One of these is the real charge, so $6 - 1 = 5$ images, with alternating signs round the circle. The method closes exactly only when $360^\\circ/\\theta$ is an even integer, as it is here.',
      trap: 'Answering 6 (counting the real charge) or 3 (reflections in each plane only once each plus their combination, which is the right count only for $90^\\circ$).' },
    { id: 'cim-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'images: corners',
      q: 'Two grounded conducting planes, $x = 0$ and $y = 0$, form a right-angled corner. A charge $q$ is at $(a, a, 0)$. The force on it has magnitude ($k = 1/4\\pi\\epsilon_0$)',
      options: ['$\\dfrac{(2\\sqrt2 - 1)kq^2}{8a^2}$, towards the corner', '$\\dfrac{(2\\sqrt2 + 1)kq^2}{8a^2}$, towards the corner', '$\\dfrac{kq^2}{4a^2}$, towards the corner', '$\\dfrac{\\sqrt2\\,kq^2}{4a^2}$, away from the corner'], answer: 0,
      sol: 'Images: $-q$ at $(-a, a)$, $-q$ at $(a, -a)$, $+q$ at $(-a, -a)$. The first pulls along $-x$ with $kq^2/4a^2$; the second along $-y$ with $kq^2/4a^2$; together $\\sqrt2\\,kq^2/4a^2$ towards the corner. The third is $2\\sqrt2\\,a$ away and repels with $kq^2/8a^2$ along the diagonal, away from the corner. Net: $\\dfrac{\\sqrt2 kq^2}{4a^2} - \\dfrac{kq^2}{8a^2} = \\dfrac{(2\\sqrt2 - 1)kq^2}{8a^2}$ towards the corner.',
      trap: 'Giving the positive image the wrong sign (adding instead of subtracting), or forgetting it altogether.' },
    { id: 'cim-019', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'sphere in uniform field',
      q: 'An uncharged conducting sphere of radius $R$ is placed in a uniform field $E_0\\hat z$. Which statements are correct? ($\\theta$ is measured from the $+z$ axis.)',
      options: ['The induced surface charge density is $3\\epsilon_0E_0\\cos\\theta$.', 'Outside, the sphere\'s own contribution is the field of a dipole of moment $4\\pi\\epsilon_0R^3E_0$.', 'The field inside the sphere is zero.', 'The sphere acquires a net induced charge.'], answer: [0, 1, 2],
      sol: 'Solving Laplace\'s equation with $V = 0$ on the sphere and $V \\to -E_0r\\cos\\theta$ far away gives $V = -E_0\\left(r - \\dfrac{R^3}{r^2}\\right)\\cos\\theta$. The second term is a dipole potential $\\dfrac{p\\cos\\theta}{4\\pi\\epsilon_0r^2}$ with $p = 4\\pi\\epsilon_0R^3E_0$. Then $\\sigma = -\\epsilon_0\\,\\partial V/\\partial r|_R = \\epsilon_0E_0(1 + 2)\\cos\\theta = 3\\epsilon_0E_0\\cos\\theta$. Integrating $\\cos\\theta$ over the sphere gives zero, so no net charge: it only separates. The inside is metal, so $E = 0$ there.',
      trap: 'Taking $\\sigma = \\epsilon_0E_0\\cos\\theta$, as if the sphere did not disturb the field. Its induced dipole adds $2E_0$ at the poles, so the normal field there is $3E_0$.' },
    { id: 'cim-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'sphere in uniform field', unit: 'nC/m$^2$',
      q: 'A neutral metal ball is placed in a uniform field of $1.0$ kV/m. The largest surface charge density induced on it is ______ nC/m$^2$ (to one decimal place).',
      answer: 26.6, tol: 0.3, calc: () => 3 * C.eps0 * 1000 * 1e9,
      sol: 'For a conducting sphere in a uniform field, $\\sigma = 3\\epsilon_0E_0\\cos\\theta$, largest at the poles: $\\sigma_{\\max} = 3(8.854\\times10^{-12})(1000) = 2.66\\times10^{-8}$ C/m$^2$ $= 26.6$ nC/m$^2$. Notice it does not depend on the radius.',
      trap: 'Using $\\epsilon_0E_0$, which ignores how the ball bends the field lines towards itself (the field at the poles is $3E_0$).' },
    { id: 'cim-021', type: 'mcq', level: 3, exams: ['jam'], sub: 'sphere in uniform field',
      q: 'A neutral conducting sphere sits in a uniform field $E_0$. Just outside its surface, at the two points where the surface faces straight along the field, the field strength is',
      options: ['$E_0$', '$2E_0$', '$3E_0$', '$E_0/3$'], answer: 2,
      sol: 'Just outside, $E = \\sigma/\\epsilon_0 = 3E_0\\cos\\theta$, which is $3E_0$ at the poles ($\\theta = 0, \\pi$) and zero at the equator. The sphere gathers field lines towards its poles. This is why lightning rods and small dust grains see enhanced fields.',
      trap: '$2E_0$ comes from adding only the dipole\'s pole field once ($2p/4\\pi\\epsilon_0R^3 = 2E_0$) and forgetting the applied $E_0$.' },
    { id: 'cim-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'separation of variables',
      q: 'A long slot has grounded walls at $y = 0$ and $y = a$; the end at $x = 0$ is held at a fixed potential and the slot runs to $x \\to \\infty$. Far from the end, the potential dies away like $e^{-x/\\ell}$ with $\\ell$ equal to',
      options: ['$a$', '$a/\\pi$', '$\\pi a$', '$a/2$'], answer: 1,
      sol: 'Separating variables, $V = \\sum_n C_n e^{-n\\pi x/a}\\sin(n\\pi y/a)$; the sine must vanish at $y = 0$ and $y = a$, which forces $k = n\\pi/a$, and Laplace\'s equation then requires the $x$ part to grow or decay at the same rate $k$. Far away only the slowest term $n = 1$ survives, decaying with length $a/\\pi$.',
      trap: 'Guessing the decay length is the slot width $a$. The potential actually dies away about three times faster.' },
    { id: 'cim-023', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'separation of variables', unit: 'V',
      q: 'For the same slot (grounded walls at $y = 0$ and $y = a$, end $x = 0$ held at $V_0 = 100$ V), the solution is $V = \\displaystyle\\sum_{n\\text{ odd}}\\frac{4V_0}{n\\pi}e^{-n\\pi x/a}\\sin\\frac{n\\pi y}{a}$. The potential at $x = a$, $y = a/2$ is ______ V (to two decimal places).',
      answer: 5.50, tol: 0.03,
      calc: () => { let s = 0; for (let n = 1; n < 40; n += 2) s += 400 / (n * Math.PI) * Math.exp(-n * Math.PI) * Math.sin(n * Math.PI / 2); return s; },
      sol: 'At $x = a$ the $n$th term carries $e^{-n\\pi}$, so the series converges very fast. $n = 1$: $\\dfrac{400}{\\pi}e^{-\\pi}\\sin\\dfrac\\pi2 = 127.32\\times0.04321 = 5.502$ V. $n = 3$: $\\dfrac{400}{3\\pi}e^{-3\\pi}\\sin\\dfrac{3\\pi}{2} = -0.0034$ V. Total $\\approx 5.50$ V.',
      trap: 'Expecting something like 50 V. One slot width from the end, only about 5% of the end potential is left.' },
    { id: 'cim-024', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'images: sphere',
      q: 'A point charge $q$ is at distance $d$ from the centre of a conducting sphere of radius $R < d$. Which statements are correct?',
      options: ['If the sphere is grounded, the charge induced on it is $-qR/d$.', 'If the sphere is grounded, the force on $q$ is attractive at every distance.', 'If the sphere is isolated and neutral, its field outside is given by the grounded-sphere image plus a charge $+qR/d$ at the centre.', 'If the sphere is isolated and neutral, the force on $q$ is zero because the sphere carries no net charge.'], answer: [0, 1, 2],
      sol: 'For a grounded sphere the image $-qR/d$ at $R^2/d$ makes the surface $V = 0$; Gauss\'s law shows the sphere holds exactly the image charge, and $q$ is pulled towards it. To make it isolated and neutral, add $+qR/d$ at the centre: this keeps the surface an equipotential and brings the total to zero. The force is still attractive, because the negative image is nearer to $q$ than the positive one.',
      trap: 'A neutral conductor still attracts a charge, as a charged comb attracts paper: induced charges of opposite sign sit nearer.' },
    { id: 'cim-025', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'cavities',
      q: 'A neutral metal sphere (outer surface spherical) has a small off-centre cavity containing a point charge $q$. The charge on the outer surface of the sphere is',
      options: ['$+q$, crowded on the side nearer the cavity', 'zero, because the metal screens the cavity', '$+q$, spread non-uniformly in a way that depends on the cavity\'s shape', '$+q$, spread uniformly over the outer surface'], answer: 3,
      sol: 'The inner surface carries $-q$, arranged to cancel the field of $q$ everywhere in the metal. The outer surface then holds $+q$. The metal screens the outer surface from whatever happens inside, so the outer charge arranges itself as it would on an isolated sphere with charge $q$: uniformly. Outside, the field is $kq/r^2$ from the sphere\'s centre, not from the charge.',
      trap: 'Expecting the outside to "know" where the charge is. It cannot: the field in the metal is zero, so nothing about the cavity reaches the outer surface except the total charge.' },
    { id: 'cim-026', type: 'nat', level: 3, exams: ['jam'], sub: 'conductors', unit: 'kV',
      q: 'Air breaks down when the field reaches about $3.0\\times10^6$ V/m. The highest potential to which an isolated metal sphere of radius 5.0 cm can be charged in air is about ______ kV.',
      answer: 150, tol: 1, calc: () => 3e6 * 0.05 / 1000,
      sol: 'For a sphere, $E_{\\text{surface}} = kQ/R^2$ and $V = kQ/R$, so $V = E_{\\text{surface}}R$. The largest field allowed is $3.0\\times10^6$ V/m: $V_{\\max} = (3.0\\times10^6)(0.050) = 1.5\\times10^5$ V $= 150$ kV. Bigger spheres hold higher potentials, which is why Van de Graaff domes are large and smooth.',
      trap: 'Dividing by $R$ instead of multiplying. Small, sharp objects reach breakdown at low voltage, not high.' },
    { id: 'cim-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'conductors',
      q: 'Two metal spheres of radii 2 cm and 6 cm, far apart, are joined by a thin wire and given some charge. The ratio of the surface charge density on the small sphere to that on the large sphere is',
      options: ['$3$', '$1/3$', '$9$', '$1/9$'], answer: 0,
      sol: 'Joined, they are at one potential: $kQ_1/R_1 = kQ_2/R_2$, so $Q \\propto R$. Then $\\sigma = Q/(4\\pi R^2) \\propto 1/R$, and $\\sigma_1/\\sigma_2 = R_2/R_1 = 6/2 = 3$. This is the reason charge crowds onto sharp points: smaller radius of curvature, higher density, stronger field.',
      trap: 'Answering $1/3$ by taking the charge ratio. The bigger sphere holds more charge but spreads it thinner.' },
    { id: 'cim-028', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'images: plane', unit: '$\\mu$N/m',
      q: 'A long straight wire carrying $10$ nC/m runs parallel to a large grounded metal plate, 5.0 cm above it. The force per unit length on the wire is ______ $\\mu$N/m (to one decimal place).',
      answer: 18.0, tol: 0.2, calc: () => K * (10e-9) ** 2 / 0.05 * 1e6,
      sol: 'The image is a line charge $-\\lambda$ at 5.0 cm below the plate, $2d = 0.10$ m from the wire. Its field at the wire is $\\dfrac{\\lambda}{2\\pi\\epsilon_0(2d)}$, so the force per length is $\\dfrac{\\lambda^2}{4\\pi\\epsilon_0d} = \\dfrac{k\\lambda^2}{d} = \\dfrac{(8.99\\times10^9)(10^{-8})^2}{0.05} = 1.80\\times10^{-5}$ N/m $= 18.0\\,\\mu$N/m.',
      trap: 'Using the point-charge law $1/r^2$. A line charge\'s field falls as $1/r$.' },
    // ---------- level 4 ----------
    { id: 'cim-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'images: plane', unit: '%',
      q: 'A charge $q$ is at height $d$ above a grounded conducting plane. The percentage of the total induced charge that lies within a distance $d$ of the point directly below the charge is ______ (to one decimal place).',
      answer: 29.3, tol: 0.3, calc: () => 100 * (1 - 1 / Math.SQRT2),
      sol: 'With $\\sigma(r) = -\\dfrac{qd}{2\\pi(r^2+d^2)^{3/2}}$, the charge within radius $r$ is $\\int_0^r\\sigma\\,2\\pi r\'\\,dr\' = -qd\\left[\\dfrac1d - \\dfrac1{\\sqrt{r^2+d^2}}\\right] = -q\\left(1 - \\dfrac{d}{\\sqrt{r^2+d^2}}\\right)$. At $r = d$: $1 - 1/\\sqrt2 = 0.293$, so 29.3%.',
      trap: 'Expecting most of the charge to be right under the charge. The density falls only as $1/r^3$, so the tail far out holds most of it.' },
    { id: 'cim-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'images: plane',
      q: 'A charge $q$ sits at height $d$ above a grounded conducting plane. Half of the induced charge lies within a circle (centred directly below $q$) of radius',
      options: ['$d$', '$\\sqrt2\\,d$', '$\\sqrt3\\,d$', '$2d$'], answer: 2,
      sol: 'The charge within radius $r$ is $-q\\left(1 - \\dfrac{d}{\\sqrt{r^2+d^2}}\\right)$. Setting the bracket to $\\tfrac12$: $\\sqrt{r^2+d^2} = 2d$, so $r = \\sqrt3\\,d$.',
      trap: 'Solving $d/\\sqrt{r^2+d^2} = 1/\\sqrt2$ (half the density squared, not half the charge) gives $r = d$.' },
    { id: 'cim-031', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'laplace in spherical coordinates',
      q: 'The potential on a spherical surface of radius $R$ is held at $V_0\\cos\\theta$, and there is no charge outside it. For $r > R$ the potential is',
      options: ['$V_0\\dfrac{R}{r}\\cos\\theta$', '$V_0\\dfrac{R^2}{r^2}\\cos\\theta$', '$V_0\\dfrac{r}{R}\\cos\\theta$', '$V_0\\dfrac{R^3}{r^3}\\cos\\theta$'], answer: 1,
      sol: 'Axially symmetric solutions of Laplace\'s equation are $\\left(A_lr^l + B_l/r^{l+1}\\right)P_l(\\cos\\theta)$. The boundary data is pure $P_1 = \\cos\\theta$, so only $l = 1$ appears. Outside, it must vanish at infinity, so $V = B_1\\cos\\theta/r^2$; matching at $r = R$ gives $B_1 = V_0R^2$.',
      trap: '$R/r$ is the $l = 0$ (point charge) fall-off; a $\\cos\\theta$ pattern is a dipole and falls as $1/r^2$.' },
    { id: 'cim-032', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'laplace in spherical coordinates',
      q: 'Continuing: the sphere of radius $R$ has $V = V_0\\cos\\theta$ on its surface and no charge inside or outside except on the surface. Which statements are correct?',
      options: ['Inside, the field is uniform with magnitude $V_0/R$.', 'The surface charge density is $\\dfrac{3\\epsilon_0V_0}{R}\\cos\\theta$.', 'Outside, the field is exactly that of a point dipole at the centre.', 'The total charge on the surface is $4\\pi\\epsilon_0RV_0$.'], answer: [0, 1, 2],
      sol: 'Inside $V = V_0\\dfrac rR\\cos\\theta = \\dfrac{V_0}{R}z$, so $\\vec E = -\\dfrac{V_0}{R}\\hat z$, uniform. The jump in the radial field gives $\\sigma$: $E_r^{\\text{out}} = \\dfrac{2V_0R^2\\cos\\theta}{r^3}\\Big|_R = \\dfrac{2V_0\\cos\\theta}{R}$, $E_r^{\\text{in}} = -\\dfrac{V_0\\cos\\theta}{R}$, so $\\sigma = \\epsilon_0(E^{\\text{out}}_r - E^{\\text{in}}_r) = \\dfrac{3\\epsilon_0V_0\\cos\\theta}{R}$. Outside, $V \\propto \\cos\\theta/r^2$ exactly: a pure dipole. $\\cos\\theta$ integrates to zero over the sphere, so the net charge is zero.',
      trap: 'The last option is the charge of a sphere held at a uniform $V_0$; here half the sphere is positive and half negative.' },
    { id: 'cim-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'images: sphere', unit: '$\\mu$N',
      q: 'A point charge of $1.0$ nC is 10 cm from the centre of an isolated, uncharged metal sphere of radius 5.0 cm. The magnitude of the force on the charge is ______ $\\mu$N (to three decimal places).',
      answer: 0.350, tol: 0.004,
      calc: () => { const q = 1e-9, R = 0.05, d = 0.1, qi = -q * R / d, b = R * R / d; return Math.abs(K * q * (qi / (d - b) ** 2 - qi / d ** 2)) * 1e6; },
      sol: 'Images: $q\' = -qR/d = -0.50$ nC at $b = R^2/d = 2.5$ cm from the centre (7.5 cm from $q$), and $+0.50$ nC at the centre (10 cm from $q$) to keep the sphere neutral. Force: $kq\\left[\\dfrac{0.50\\times10^{-9}}{(0.075)^2} - \\dfrac{0.50\\times10^{-9}}{(0.10)^2}\\right] = (8.99)\\left[8.89\\times10^{-8} - 5.00\\times10^{-8}\\right]$ $= 3.50\\times10^{-7}$ N $= 0.350\\,\\mu$N, attractive.',
      trap: 'Leaving out the centre charge (that is the grounded sphere, which gives $0.799\\,\\mu$N).' },
    { id: 'cim-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'A point charge is held at some distance from an isolated, uncharged conductor of any shape. The force on the charge is',
      options: ['always attractive, however far away it is', 'repulsive if the charge is positive', 'zero, because the conductor has no net charge', 'attractive only if the conductor is grounded'], answer: 0,
      sol: 'The charge induces opposite charge on the near side of the conductor and an equal amount of like charge on the far side. The opposite charge is closer, so the net force is attraction. In energy terms: letting the conductor\'s charges rearrange can only lower the energy, and the energy is lowest when the charge is close. The force falls off fast (for a small conductor, like $1/r^5$), but it is never repulsive.',
      trap: 'Neutral does not mean no force. Grounding just makes the attraction stronger.' },
    { id: 'cim-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'images: corners', unit: '$\\mu$N',
      q: 'Two grounded metal planes $x = 0$ and $y = 0$ form a right-angled corner. A charge of $1.0$ nC sits at $x = 3.0$ cm, $y = 4.0$ cm. The magnitude of the force on it is ______ $\\mu$N (to two decimal places).',
      answer: 2.07, tol: 0.02,
      calc: () => { const kq2 = K * 1e-18, a = 0.03, b = 0.04, r = 2 * Math.hypot(a, b); const fx = -kq2 / (2 * a) ** 2 + kq2 / r ** 2 * (a / Math.hypot(a, b)); const fy = -kq2 / (2 * b) ** 2 + kq2 / r ** 2 * (b / Math.hypot(a, b)); return Math.hypot(fx, fy) * 1e6; },
      sol: 'Images: $-q$ at $(-3, 4)$, $-q$ at $(3, -4)$, $+q$ at $(-3, -4)$ cm. In units of $kq^2$ (with lengths in m): image 1 pulls along $-x$ with $1/(0.06)^2 = 277.8$; image 2 pulls along $-y$ with $1/(0.08)^2 = 156.3$; image 3 is $0.10$ m away and pushes along $(0.6, 0.8)$ with $1/(0.1)^2 = 100$. So $F_x = -277.8 + 60 = -217.8$, $F_y = -156.3 + 80 = -76.3$, $|F| = 230.7\\,kq^2$. With $kq^2 = 8.99\\times10^{-9}$ N m$^2$: $|F| = 2.07\\times10^{-6}$ N.',
      trap: 'Forgetting the third (positive) image. Without it both planes would not be at zero potential.' },
    { id: 'cim-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'The outward force per unit area on the surface of a conductor where the surface charge density is $\\sigma$ is',
      options: ['$\\dfrac{\\sigma^2}{\\epsilon_0}$, outward', '$\\dfrac{\\sigma^2}{2\\epsilon_0}$, inward for negative $\\sigma$', '$\\dfrac{\\sigma}{2\\epsilon_0}$, outward', '$\\dfrac{\\sigma^2}{2\\epsilon_0}$, outward whatever the sign of $\\sigma$'], answer: 3,
      sol: 'A patch of surface feels the field of all the other charges, which is the average of the fields on the two sides: $\\tfrac12(\\sigma/\\epsilon_0 + 0)$. Force per area $= \\sigma\\cdot\\dfrac{\\sigma}{2\\epsilon_0} = \\dfrac{\\sigma^2}{2\\epsilon_0}$. It depends on $\\sigma^2$, so it is outward for either sign: a charged soap bubble swells. It also equals the field energy density $\\epsilon_0E^2/2$ just outside.',
      trap: 'Multiplying $\\sigma$ by the full outside field $\\sigma/\\epsilon_0$ counts the patch pushing on itself and doubles the answer.' },
    // ---------- level 5 ----------
    { id: 'cim-037', type: 'nat', level: 5, exams: ['jam', 'gate', 'net'], sub: 'images: energy', unit: '$\\mu$J',
      q: 'A point charge of $2.0$ nC is brought slowly from infinity to a point 6.0 cm from the centre of a grounded metal sphere of radius 3.0 cm. The work done by the external agent is ______ $\\mu$J (to three decimal places, with sign).',
      answer: -0.200, tol: 0.003,
      calc: () => { const q = 2e-9, R = 0.03, d = 0.06; return -K * q * q * R / (2 * (d * d - R * R)) * 1e6; },
      sol: 'At distance $r$ the image is $-qR/r$ at $R^2/r$, so the attraction is $F(r) = \\dfrac{kq\\,(qR/r)}{(r - R^2/r)^2} = \\dfrac{kq^2Rr}{(r^2-R^2)^2}$. The agent\'s work is $W = -\\int_d^\\infty \\dfrac{kq^2Rr}{(r^2-R^2)^2}dr = -\\dfrac{kq^2R}{2}\\left[\\dfrac{-1}{r^2-R^2}\\right]_d^\\infty = -\\dfrac{kq^2R}{2(d^2-R^2)}$. Numbers: $-\\dfrac{(8.99\\times10^9)(4\\times10^{-18})(0.03)}{2(0.0036-0.0009)} = -2.00\\times10^{-7}$ J.',
      trap: 'Using $\\tfrac12 q V_{\\text{image}}$ with the image fixed, or forgetting the factor $\\tfrac12$: the image grows and moves as the charge comes in.' },
    { id: 'cim-038', type: 'msq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'uniqueness',
      q: 'Which of these follow from the properties of solutions of Laplace\'s equation?',
      options: ['In a charge-free region the potential has no local maximum or minimum.', 'A potential that is zero on the whole boundary of a charge-free region can still be non-zero inside it.', 'No arrangement of fixed charges can hold a test charge in stable equilibrium in empty space (Earnshaw).', 'If the potential is the same constant everywhere on the boundary of a charge-free region, it equals that constant throughout.'], answer: [0, 2, 3],
      sol: 'By the mean value property, $V$ at a point is the average over any small sphere round it, so it cannot be bigger or smaller than all its neighbours. Hence a potential zero on the boundary has no positive maximum or negative minimum inside: it is zero throughout, and likewise a constant boundary gives a constant inside. Stable equilibrium needs a potential-energy minimum $qV$, which a harmonic $V$ cannot have: Earnshaw\'s theorem.',
      trap: 'Ion traps do hold charges, but with time-varying (Paul) or magnetic (Penning) fields; Earnshaw is about static electric fields only.' },
    { id: 'cim-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'images: corners',
      q: 'Two grounded conducting half-planes meet at $45^\\circ$ with a point charge $+q$ between them. The image system consists of',
      options: ['7 images: 4 negative and 3 positive', '7 images, all negative', '8 images: 4 negative and 4 positive', '7 images: 3 negative and 4 positive'], answer: 0,
      sol: '$360^\\circ/45^\\circ = 8$ sectors, one charge in each, signs alternating as you go round (each reflection flips the sign). Together with the real $+q$ there are 4 positive and 4 negative charges, so the 7 images are 4 negative and 3 positive. The total charge of the whole set is zero, as it must be for a grounded system that encloses the charge on all sides at infinity.',
      trap: 'Forgetting that the real charge counts as one of the four positives.' },
    { id: 'cim-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'images: sphere', unit: 'V',
      q: 'An isolated, uncharged metal sphere has its centre 20 cm from a point charge of $3.0$ nC (the charge is outside the sphere). The potential of the sphere is ______ V (to the nearest whole number).',
      answer: 135, tol: 1.5, calc: () => K * 3e-9 / 0.2,
      sol: 'The sphere is one equipotential, so its potential equals the potential at its centre. There, the point charge contributes $kq/d$, and the induced charges contribute $\\sum k\\,dq/R = (k/R)\\times(\\text{total induced}) = 0$, since every induced charge is the same distance $R$ from the centre and they add to zero. So $V = kq/d = \\dfrac{(8.99\\times10^9)(3.0\\times10^{-9})}{0.20} = 135$ V, whatever the radius.',
      trap: 'Trying to work out the induced distribution. The centre trick needs no images at all (the image method gives the same: $k(qR/d)/R = kq/d$).' },
  ],
  gens: [
    { id: 'cim-t21', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'images: plane', format: 'comparison',
      make(r) {
        const c = Q5.int(r, 0, 2);
        const qs = ['the force on the charge, as a fraction of the force between two real charges $+q$ and $-q$ a distance $d$ apart, is',
          'the work done by an external agent to bring the charge slowly from infinity to this position, as a fraction of the potential energy of two real charges $+q$ and $-q$ a distance $2d$ apart, is',
          'the total charge induced on the plate, as a fraction of $q$, is'];
        const right = ['$1/4$', '$1/2$', '$-1$'][c];
        const o = Q5.mcqOptions(r, right, [['$1/2$', '$1$', '$2$'], ['$1$', '$1/4$', '$2$'], ['$-1/2$', '$0$', '$-2$']][c]);
        const sol = ['The image charge $-q$ sits a distance $d$ behind the plate, so the real charge is $2d$ from it: $F = kq^2/(2d)^2 = \\tfrac14\\cdot kq^2/d^2$.',
          'The force at height $x$ is $kq^2/4x^2$ (towards the plate), so the agent does $W = -\\int_\\infty^d \\dfrac{kq^2}{4x^2}dx = -\\dfrac{kq^2}{4d}$. The real pair at $2d$ has $U = -kq^2/2d$, so the ratio is $1/2$: the field exists only on one side of the plate, half the space.',
          'Every field line leaving $q$ ends on the plate (the field below the plate is zero), so by Gauss law the induced charge is exactly $-q$.'][c];
        return { q: `A point charge $+q$ is held a distance $d$ above a large grounded metal plate. Then ${qs[c]}`, ...o, sol,
          trap: 'The image method gives the right field above the plate, but the energy is only half that of the real pair, since no field exists below the plate.' };
      } },
    { id: 'cim-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'cavities', format: 'statements',
      make(r) {
        const q = Q5.int(r, 1, 9), yes = r() < 0.5;
        const T = [`The inner surface of the cavity carries a total charge of $-${q}$ nC.`, `The outer surface carries a total charge of $+${q}$ nC, spread uniformly.`, 'The field outside the shell is the same wherever the charge sits inside the cavity.',
          'The field inside the cavity depends on where the charge sits.', 'If the shell is earthed, the charge on its outer surface becomes zero.'];
        const F = ['The field inside the cavity is zero.', 'The way charge is spread on the outer surface depends on where the charge sits in the cavity.', `The inner surface carries $+${q}$ nC.`,
          'If the shell is earthed, the inner surface charge disappears too.', 'The field inside the metal itself is the field of the point charge.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `A neutral metal shell with a spherical outer surface has an irregular cavity inside it. A point charge of $+${q}$ nC is held off-centre inside the cavity. Which statements are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: `In the metal $E = 0$. A Gaussian surface inside the metal encloses zero charge, so the cavity wall carries $-${q}$ nC, arranged (depending on where the charge is) to cancel its field in the metal. The shell is neutral, so $+${q}$ nC sits on the outer surface; the metal screens the cavity, so this charge spreads exactly as on an isolated sphere (uniformly), and the outside field is that of $${q}$ nC at the centre. Earthing removes the outer charge but not the inner one, which is held by the point charge.`,
          trap: 'The metal screens in both directions: the outside never learns where the charge sits inside the cavity.' };
      } },
    { id: 'cim-t23', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'images: sphere', unit: 'μN',
      make(r) {
        const q = Q5.int(r, 1, 9), R = Q5.int(r, 2, 6), a = R + Q5.int(r, 2, 10);
        const k = 8.99e9, F = k * (q * 1e-9) ** 2 * (R / 100) * (a / 100) / ((a / 100) ** 2 - (R / 100) ** 2) ** 2 * 1e6;
        return { q: `A point charge of $${q}$ nC is $${a}$ cm from the centre of an earthed metal sphere of radius $${R}$ cm. The attractive force on it is ______ $\\mu$N (to three significant figures; $k = 8.99\\times10^9$ SI).`,
          answer: +F.toPrecision(3), tol: +(0.006 * F).toPrecision(2), qc: q, R, a,
          sol: `Image: $q' = -qR/a = -${Q5.round(q * R / a, 3)}$ nC at $b = R^2/a = ${Q5.round(R * R / a, 3)}$ cm from the centre. Separation $a - b = ${Q5.round(a - R * R / a, 3)}$ cm. $F = k\\,q|q'|/(a - b)^2 = \\dfrac{kq^2Ra}{(a^2 - R^2)^2} = ${+F.toPrecision(3)}\\ \\mu$N.`,
          trap: 'The image is not at the mirror point $2R - a$; it is at $R^2/a$ with charge $-qR/a$.' };
      },
      verify: (p) => { const k = 8.99e9, a = p.a / 100, R = p.R / 100, qi = p.qc * 1e-9 * R / a, b = R * R / a; return k * p.qc * 1e-9 * qi / (a - b) ** 2 * 1e6; } },
    { id: 'cim-t24', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'laplace equation',
      make(r) {
        const good = ['$x^2 - y^2$', '$xy$', '$e^{x}\\cos y$', '$\\ln(x^2 + y^2)$', '$x^3 - 3xy^2$', '$e^{-y}\\sin x$'];
        const bad = ['$x^2 + y^2$', '$x^2y$', '$\\sin x\\sin y$', '$e^{x}\\sin x$', '$x^3$', '$x^2 + 2y^2$'];
        const not = r() < 0.5;
        const o = not ? q5odd(r, bad, good) : q5odd(r, good, bad);
        return { q: `In a charge-free region of the $xy$ plane (no $z$ dependence), the potential must satisfy Laplace's equation. Which ${not ? 'one of these could <b>NOT</b> be' : 'one of these could be'} such a potential (away from the origin)?`, ...o,
          sol: 'Check $\\partial^2V/\\partial x^2 + \\partial^2V/\\partial y^2$: $x^2 - y^2$: $2 - 2 = 0$; $xy$: $0$; $e^x\\cos y$: $e^x\\cos y - e^x\\cos y = 0$; $\\ln(x^2+y^2)$: $0$ for $(x,y) \\ne 0$; $x^3 - 3xy^2$: $6x - 6x = 0$; $e^{-y}\\sin x$: $0$. But $x^2 + y^2$ gives $4$, $x^2y$ gives $2y$, $\\sin x\\sin y$ gives $-2\\sin x\\sin y$, $e^x\\sin x$ gives $2e^x\\cos x$, $x^3$ gives $6x$, $x^2 + 2y^2$ gives $6$.',
          trap: 'A harmonic function cannot have a maximum or minimum inside the region, so a sum of squares (a bowl) is never one.' };
      } },
    { id: 'cim-t25', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'sphere in uniform field', unit: 'nC/m²',
      make(r) {
        const E0 = Q5.int(r, 1, 20), th = Q5.choose(r, [0, 30, 45, 60, 120, 135, 150]);
        const s = 3 * 8.854e-12 * E0 * 1e3 * Math.cos(th * Math.PI / 180) * 1e9;
        return { q: `A neutral metal sphere sits in a uniform field of $${E0}$ kV/m along $+z$. The induced surface charge density at a point of its surface whose radius makes $${th}^\\circ$ with $+z$ is ______ nC/m$^2$ (to two decimal places; $\\varepsilon_0 = 8.854\\times10^{-12}$ SI).`,
          answer: Q5.round(s, 2), tol: 0.01, E0, th,
          sol: `Outside the sphere $V = -E_0\\left(r - \\dfrac{R^3}{r^2}\\right)\\cos\\theta$, and $\\sigma = -\\varepsilon_0\\,\\partial V/\\partial r|_R = 3\\varepsilon_0E_0\\cos\\theta = 3\\times8.854\\times10^{-12}\\times${E0 * 1000}\\times\\cos${th}^\\circ = ${Q5.round(s, 2)}$ nC/m$^2$.`,
          trap: 'The factor is 3, not 1: the induced charges add a dipole field that triples the normal field at the poles.' };
      },
      verify: (p) => { const R = 0.03, eps = 8.854e-12, pd = 4 * Math.PI * eps * R ** 3 * p.E0 * 1e3, P = pd / (4 / 3 * Math.PI * R ** 3); return P * Math.cos(p.th * Math.PI / 180) * 1e9; } },
    { id: 'cim-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'conductors', unit: 'kV/m',
      make(r) {
        const s = pick(r, 0.5, 9.5, 0.5); // uC/m^2
        const E = s * 1e-6 / C.eps0 / 1000;
        return { q: `The surface charge density at a point on a charged conductor is $${s}\\,\\mu$C/m$^2$. The field just outside the surface there is ______ kV/m (to the nearest whole number).`,
          answer: Math.round(E), tol: Math.max(E * 0.01, 1), s,
          sol: `Just outside a conductor $E = \\sigma/\\epsilon_0 = \\dfrac{${s}\\times10^{-6}}{8.854\\times10^{-12}} \\approx ${Math.round(E)}$ kV/m, normal to the surface.`,
          trap: 'Not $\\sigma/2\\epsilon_0$: inside the metal the field is zero, so all the flux goes out on one side.' };
      },
      verify: (p) => p.s * 1e-6 / C.eps0 / 1000 },
    { id: 'cim-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'images: plane', unit: '$\\mu$N',
      make(r) {
        const q = int(r, 1, 9), d = int(r, 2, 20); // nC, cm
        const F = K * (q * 1e-9) ** 2 / (2 * d / 100) ** 2 * 1e6;
        return { q: `A charge of ${q} nC is held ${d} cm above a large grounded metal plate. The force on it is ______ $\\mu$N (to three significant figures).`,
          answer: +F.toPrecision(3), tol: Math.max(F * 0.01, 1e-4), qq: q, d,
          sol: `The image $-${q}$ nC sits ${d} cm below the plate, so the separation is $2d = ${(2 * d / 100).toFixed(2)}$ m. $F = \\dfrac{kq^2}{(2d)^2} = \\dfrac{(8.99\\times10^9)(${q}\\times10^{-9})^2}{(${(2 * d / 100).toFixed(2)})^2} \\approx ${fmt(F, 3)}\\,\\mu$N, attractive.`,
          trap: 'The charge is $2d$ from its image, not $d$.' };
      },
      verify: (p) => K * (p.qq * 1e-9) ** 2 / (2 * p.d / 100) ** 2 * 1e6 },
    { id: 'cim-g03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'images: sphere', unit: 'nC',
      make(r) {
        const R = int(r, 2, 10), d = R + int(r, 2, 20), q = int(r, 1, 20);
        const qi = -q * R / d;
        return { q: `A charge of $+${q}$ nC is ${d} cm from the centre of a grounded metal sphere of radius ${R} cm. The image charge is ______ nC (to two decimal places, with sign).`,
          answer: round(qi, 2), tol: Math.max(Math.abs(qi) * 0.01, 0.01), qq: q, R, d,
          sol: `$q' = -qR/d = -${q}\\times${R}/${d} \\approx ${round(qi, 2)}$ nC, placed ${round(R * R / d, 2)} cm from the centre ($R^2/d$). It also equals the total charge induced on the sphere.`,
          trap: 'A sphere\'s image is smaller than $q$; only a plane needs a full $-q$.' };
      },
      verify: (p) => -p.qq * p.R / p.d },
    { id: 'cim-g04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'images: plane', unit: 'nC/m$^2$',
      make(r) {
        const q = int(r, 1, 20), d = int(r, 2, 15), x = choose(r, [0, d, 2 * d]); // nC, cm, cm
        const s = -q * (d / 100) / (2 * Math.PI * ((x / 100) ** 2 + (d / 100) ** 2) ** 1.5);
        return { q: `A charge of $+${q}$ nC is ${d} cm above a grounded conducting plane. The induced surface charge density at a point on the plane ${x === 0 ? 'directly below the charge' : x + ' cm from the point directly below the charge'} is ______ nC/m$^2$ (to three significant figures, with sign).`,
          answer: +s.toPrecision(3), tol: Math.max(Math.abs(s) * 0.01, 0.01), qq: q, d, x,
          sol: `$\\sigma = -\\dfrac{qd}{2\\pi(r^2+d^2)^{3/2}} = -\\dfrac{(${q})(${d / 100})}{2\\pi(${(x / 100) ** 2} + ${(d / 100) ** 2})^{3/2}} \\approx ${fmt(s, 3)}$ nC/m$^2$ (keeping $q$ in nC gives $\\sigma$ in nC/m$^2$).`,
          trap: 'The image doubles the field at the plane, so the factor is $2\\pi$, not $4\\pi$.' };
      },
      verify: (p) => -p.qq * (p.d / 100) / (2 * Math.PI * ((p.x / 100) ** 2 + (p.d / 100) ** 2) ** 1.5) },
    { id: 'cim-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'images: energy', unit: 'nJ',
      make(r) {
        const q = int(r, 1, 6), d = int(r, 2, 20);
        const W = -K * (q * 1e-9) ** 2 / (4 * d / 100) * 1e9;
        return { q: `A charge of ${q} nC is brought slowly from far away to ${d} cm above a large grounded metal plate. The work done by the agent is ______ nJ (to three significant figures, with sign).`,
          answer: +W.toPrecision(3), tol: Math.max(Math.abs(W) * 0.01, 0.01), qq: q, d,
          sol: `The image force is $kq^2/(4z^2)$; integrating from infinity gives $W = -\\dfrac{kq^2}{4d} = -\\dfrac{(8.99\\times10^9)(${q}\\times10^{-9})^2}{4(${d / 100})} \\approx ${fmt(W, 3)}$ nJ.`,
          trap: 'Half of $-kq^2/(2d)$: the image moves with the charge and only the upper half-space has field.' };
      },
      verify: (p) => -K * (p.qq * 1e-9) ** 2 / (4 * p.d / 100) * 1e9 },
    { id: 'cim-g06', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'images: corners',
      make(r) {
        const th = choose(r, [90, 60, 45, 30, 22.5, 18]);
        const m = 360 / th - 1;
        const o = mcqOptions(r, m, [m + 1, m - 2, 2 * m], (v) => `${v}`);
        return { q: `Two grounded conducting planes meet at an angle of $${th}^\\circ$ with a point charge between them. How many image charges does the method of images need?`, ...o,
          sol: `There are $360^\\circ/${th}^\\circ = ${360 / th}$ sectors, one charge in each, with alternating signs. One is the real charge, so the images number $${360 / th} - 1 = ${m}$.`,
          trap: 'Do not count the real charge as an image.' };
      } },
    { id: 'cim-g07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'images: plane', unit: '%',
      make(r) {
        const kk = choose(r, [0.5, 1, 1.5, 2, 3, 4, 5, 10]);
        const f = 100 * (1 - 1 / Math.sqrt(1 + kk * kk));
        return { q: `A charge $q$ is at height $d$ above a grounded conducting plane. The percentage of the induced charge lying within a distance $${kk}d$ of the point directly below $q$ is ______ (to one decimal place).`,
          answer: round(f, 1), tol: Math.max(f * 0.005, 0.1), kk,
          sol: `Charge within radius $r$: $-q\\left(1 - \\dfrac{d}{\\sqrt{r^2+d^2}}\\right)$. With $r = ${kk}d$: $1 - \\dfrac{1}{\\sqrt{1 + ${kk * kk}}} = ${round(f / 100, 4)}$, i.e. ${round(f, 1)}%.`,
          trap: 'The density falls slowly ($1/r^3$), so the charge is spread over a wide area.' };
      },
      verify: (p) => 100 * (1 - 1 / Math.sqrt(1 + p.kk * p.kk)) },
    { id: 'cim-g08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'sphere in uniform field', unit: 'pC m',
      make(r) {
        const R = int(r, 1, 10), E0 = int(r, 1, 20); // cm, kV/m
        const p = 4 * Math.PI * C.eps0 * (R / 100) ** 3 * E0 * 1000 * 1e12;
        return { q: `A neutral metal sphere of radius ${R} cm is placed in a uniform field of ${E0} kV/m. The induced dipole moment is ______ pC m (to three significant figures).`,
          answer: +p.toPrecision(3), tol: Math.max(p * 0.01, 1e-4), R, E0,
          sol: `$p = 4\\pi\\epsilon_0R^3E_0 = \\dfrac{(${R / 100})^3(${E0 * 1000})}{8.99\\times10^9} \\approx ${fmt(p, 3)}$ pC m. It grows with the volume of the sphere.`,
          trap: 'The induced moment scales as $R^3$, not $R^2$.' };
      },
      verify: (p) => 4 * Math.PI * C.eps0 * (p.R / 100) ** 3 * p.E0 * 1000 * 1e12 },
  ],
};
