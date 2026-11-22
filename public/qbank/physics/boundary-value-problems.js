// Boundary value problems: Laplace's equation, uniqueness, separation of variables in Cartesian, spherical and
// cylindrical coordinates, Legendre expansions, corners and edges. MSc level (GATE, CSIR NET).
// Original questions (fibub). Levels: 1 warm-up ... 5 top rank. Basics (conductors, the slot) are in conductors-images.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './boundary-value-problems.more.gen.js';
import more2 from './boundary-value-problems.more2.gen.js';
import r4 from './boundary-value-problems.r4.gen.js';

const EPS0 = 8.8541878128e-12;
const sh = Math.sinh, ch = Math.cosh, PI = Math.PI;

export default {
  topic: 'boundary-value-problems',
  items: [
    // ---------- level 1 ----------
    { id: 'bvp-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace equation',
      q: 'Which of these functions satisfies the three-dimensional Laplace equation $\\nabla^2V = 0$ everywhere?',
      options: ['$x^2 + y^2 - 2z^2$', '$x^2 + y^2 + z^2$', '$x^2 - y^2 + z^2$', '$xyz^2$'], answer: 0,
      sol: 'Add the second derivatives. $x^2 + y^2 - 2z^2$: $2 + 2 - 4 = 0$. $x^2 + y^2 + z^2$: $6$. $x^2 - y^2 + z^2$: $2 - 2 + 2 = 2$. $xyz^2$: $0 + 0 + 2xy = 2xy$, not zero in general. Only the first is harmonic.',
      trap: 'A function with mixed signs is not automatically harmonic: the coefficients of the squares must add to zero.' },
    { id: 'bvp-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'In a separated solution $V = X(x)Y(y)$ of the two-dimensional Laplace equation, $Y(y)$ is chosen to oscillate as $\\sin ky$. Then $X(x)$ must be',
      options: ['also oscillatory, $\\sin kx$ or $\\cos kx$', 'a linear function of $x$', 'a combination of $e^{kx}$ and $e^{-kx}$', 'a constant'], answer: 2,
      sol: 'Substituting gives $X\'\'/X + Y\'\'/Y = 0$. If $Y\'\'/Y = -k^2$, then $X\'\'/X = +k^2$, so $X = Ae^{kx} + Be^{-kx}$ (or $\\cosh$ and $\\sinh$). One direction oscillates, the other grows or decays.',
      trap: 'The two separation constants have opposite signs; both cannot be negative.' },
    { id: 'bvp-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'separation (spherical)',
      q: 'For a problem with azimuthal symmetry (no $\\phi$ dependence), the general solution of Laplace\'s equation in spherical coordinates is',
      options: ['$\\sum_l \\left(A_l r^l + B_l r^{-l}\\right)P_l(\\cos\\theta)$', '$\\sum_l \\left(A_l r^l + B_l r^{-(l+1)}\\right)P_l(\\cos\\theta)$', '$\\sum_l \\left(A_l r^{l+1} + B_l r^{-l}\\right)P_l(\\cos\\theta)$', '$\\sum_l A_l\\, e^{-lr}P_l(\\cos\\theta)$'], answer: 1,
      sol: 'With $V = R(r)\\Theta(\\theta)$ the radial equation is $\\dfrac{d}{dr}\\left(r^2\\dfrac{dR}{dr}\\right) = l(l+1)R$. Trying $R = r^n$ gives $n(n+1) = l(l+1)$, so $n = l$ or $n = -(l+1)$. The angular part is the Legendre polynomial $P_l(\\cos\\theta)$.',
      trap: 'The decaying power is $r^{-(l+1)}$, not $r^{-l}$: for $l = 0$ it gives the Coulomb $1/r$.' },
    { id: 'bvp-004', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Legendre polynomials',
      q: 'The value of the Legendre polynomial $P_2(\\cos\\theta)$ at $\\theta = 60^\\circ$ is ______ (to three decimal places).',
      answer: -0.125, tol: 0.001, calc: () => (3 * 0.25 - 1) / 2,
      sol: '$P_2(x) = \\tfrac12(3x^2 - 1)$. With $x = \\cos 60^\\circ = 0.5$: $\\tfrac12(0.75 - 1) = -0.125$.' },
    { id: 'bvp-005', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace equation',
      q: 'In a charge-free region the potential is $V = 3x^2 + \\alpha y^2 - 5z^2$ (volts, with lengths in metres). The constant $\\alpha$ is ______ V/m$^2$.',
      answer: 2, tol: 0, calc: () => 5 - 3,
      sol: 'Charge-free means $\\nabla^2V = 0$: $6 + 2\\alpha - 10 = 0$, so $\\alpha = 2$.' },
    { id: 'bvp-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'uniqueness',
      q: 'Specifying the normal derivative $\\partial V/\\partial n$ on the whole boundary of a region is called a',
      options: ['Dirichlet condition', 'Cauchy condition', 'periodic condition', 'Neumann condition'], answer: 3,
      sol: 'Dirichlet: $V$ given on the boundary. Neumann: $\\partial V/\\partial n$ (the normal field) given. Cauchy: both given, which over-determines Laplace\'s equation. A Neumann problem fixes $V$ up to an additive constant.' },

    // ---------- level 2 ----------
    { id: 'bvp-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'A square region $0 \\le x \\le a$, $0 \\le y \\le a$ has $V = 0$ on three sides and $V = V_0\\sin(\\pi x/a)$ on the side $y = a$, with $V_0 = 100$ V and no charge inside. The potential at the centre of the square is ______ V (to one decimal place).',
      answer: 19.9, tol: 0.15, calc: () => 100 * sh(PI / 2) / sh(PI),
      sol: 'A single Fourier mode on the boundary gives a single mode inside: $V = V_0\\sin\\dfrac{\\pi x}{a}\\,\\dfrac{\\sinh(\\pi y/a)}{\\sinh\\pi}$. It is harmonic ($-k^2 + k^2 = 0$), vanishes at $x = 0$, $x = a$, $y = 0$, and matches the top. At the centre: $100\\times1\\times\\dfrac{\\sinh(\\pi/2)}{\\sinh\\pi} = 100\\times\\dfrac{2.301}{11.549} = 19.9$ V.',
      trap: 'Using $\\sinh$ ratios at $y = a/2$ as if the decay were linear gives 50 V; the potential sags much faster.' },
    { id: 'bvp-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier coefficients',
      q: 'On the edge $y = b$ of a rectangle $0 \\le x \\le a$ the potential is a constant $V_0$; the other three edges are grounded. In $V = \\sum_n c_n\\sin(n\\pi x/a)\\sinh(n\\pi y/a)/\\sinh(n\\pi b/a)$, the coefficient $c_3$ is',
      options: ['$2V_0/3\\pi$', '$4V_0/3\\pi$', '$4V_0/\\pi$', '$0$'], answer: 1,
      sol: '$c_n = \\dfrac{2}{a}\\displaystyle\\int_0^a V_0\\sin\\dfrac{n\\pi x}{a}dx = \\dfrac{2V_0}{n\\pi}(1 - \\cos n\\pi)$, which is $4V_0/n\\pi$ for odd $n$ and $0$ for even $n$. So $c_3 = 4V_0/3\\pi$.',
      trap: 'Forgetting the factor $(1 - \\cos n\\pi) = 2$ for odd $n$ gives $2V_0/3\\pi$.' },
    { id: 'bvp-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'The potential on a sphere of radius $R$ is held at $V(R,\\theta) = V_0P_2(\\cos\\theta)$ with $V_0 = 40$ V, and there is no charge outside. The potential on the axis ($\\theta = 0$) at $r = 2R$ is ______ V.',
      answer: 5, tol: 0.01, calc: () => 40 / 8,
      sol: 'Outside, only the decaying solution matching $P_2$ survives: $V = V_0(R/r)^3P_2(\\cos\\theta)$. On the axis $P_2(1) = 1$, so $V = 40/8 = 5$ V.',
      trap: 'The exterior power for $l = 2$ is $r^{-3}$, not $r^{-2}$ (which would give 10 V).' },
    { id: 'bvp-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'A hollow sphere of radius $R$ has its surface held at $V_0\\cos^2\\theta$, with no charge inside. The potential at its centre is',
      options: ['$0$', '$V_0/2$', '$2V_0/3$', '$V_0/3$'], answer: 3,
      sol: 'Write $\\cos^2\\theta = \\tfrac13 + \\tfrac23P_2(\\cos\\theta)$. Inside, $V = \\dfrac{V_0}{3} + \\dfrac{2V_0}{3}\\left(\\dfrac rR\\right)^2P_2(\\cos\\theta)$, which is $V_0/3$ at $r = 0$. The mean value theorem says the same: the average of $\\cos^2\\theta$ over a sphere is $1/3$.',
      trap: '$1/2$ is the average of $\\cos^2$ over an angle, not over the solid angle of a sphere.' },
    { id: 'bvp-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      q: 'A long neutral conducting cylinder lies with its axis perpendicular to a uniform field of 1.0 kV/m. The largest surface charge density induced on it is ______ nC/m$^2$ (to one decimal place). Use $\\epsilon_0 = 8.854\\times10^{-12}$ F/m.',
      answer: 17.7, tol: 0.1, calc: () => 2 * EPS0 * 1000 * 1e9,
      sol: 'Outside, $V = -E_0\\left(s - \\dfrac{R^2}{s}\\right)\\cos\\phi$, which is zero on $s = R$ and uniform far away. Then $\\sigma = -\\epsilon_0\\partial V/\\partial s|_R = 2\\epsilon_0E_0\\cos\\phi$, largest $2\\epsilon_0E_0 = 2\\times8.854\\times10^{-12}\\times1000 = 1.77\\times10^{-8}$ C/m$^2$ $= 17.7$ nC/m$^2$.',
      trap: 'A sphere gives $3\\epsilon_0E_0$; a cylinder in a transverse field gives $2\\epsilon_0E_0$.' },
    { id: 'bvp-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      q: 'For two-dimensional problems in polar coordinates $(s,\\phi)$, the solutions of Laplace\'s equation with no $\\phi$ dependence are',
      options: ['a constant and $\\ln s$', '$s$ and $1/s$', '$s^2$ and $s^{-2}$', 'the Bessel functions $J_0(s)$ and $Y_0(s)$'], answer: 0,
      sol: 'With no $\\phi$ dependence, $\\dfrac1s\\dfrac{d}{ds}\\left(s\\dfrac{dV}{ds}\\right) = 0$, so $s\\,dV/ds$ is constant and $V = a + b\\ln s$. This is the potential of a line charge. The $s^{\\pm n}$ solutions go with $\\cos n\\phi$, $\\sin n\\phi$ for $n \\ge 1$.',
      trap: 'Bessel functions appear only when there is $z$ dependence like $e^{\\pm kz}$.' },
    { id: 'bvp-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'Which of these are solutions of Laplace\'s equation (away from the origin) in spherical coordinates?',
      options: ['$r\\cos\\theta$', '$\\cos\\theta/r^2$', '$r^2\\cos\\theta$', '$r^2(3\\cos^2\\theta - 1)$'], answer: [0, 1, 3],
      sol: 'Allowed products are $r^lP_l$ and $r^{-(l+1)}P_l$. $r\\cos\\theta = rP_1$ (it is just $z$). $\\cos\\theta/r^2 = r^{-2}P_1$ (a dipole). $r^2(3\\cos^2\\theta - 1) = 2r^2P_2$, i.e. $2z^2 - x^2 - y^2$. But $r^2\\cos\\theta$ pairs the power of $l = 2$ with $P_1$: its Laplacian is $4\\cos\\theta \\ne 0$.',
      trap: 'The power of $r$ and the order of the Legendre polynomial must match.' },
    { id: 'bvp-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'shells',
      q: 'A spherical shell of radius $R$ carries surface charge $\\sigma = \\sigma_0\\cos\\theta$. The electric field inside it is',
      options: ['zero', '$-\\dfrac{\\sigma_0}{2\\epsilon_0}\\hat z$', '$-\\dfrac{\\sigma_0}{3\\epsilon_0}\\hat z$', '$+\\dfrac{\\sigma_0}{3\\epsilon_0}\\hat z$'], answer: 2,
      sol: 'Try $V_{in} = Ar\\cos\\theta$, $V_{out} = AR^3\\cos\\theta/r^2$ (continuous at $R$). The jump in $-\\partial V/\\partial r$ is $\\sigma/\\epsilon_0$: $2A + A = \\sigma_0/\\epsilon_0$, so $A = \\sigma_0/3\\epsilon_0$. Inside $V = \\sigma_0z/3\\epsilon_0$, so $\\vec E = -\\dfrac{\\sigma_0}{3\\epsilon_0}\\hat z$: uniform, pointing from the positive (top) cap towards the negative one.',
      trap: 'The field inside points from $+$ to $-$, i.e. along $-\\hat z$ when the top half is positive.' },
    { id: 'bvp-015', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'superposition',
      q: 'A hollow metal cube has five faces grounded and the sixth face (insulated from them) held at 120 V. The potential at the centre of the cube is ______ V.',
      answer: 20, tol: 0, calc: () => 120 / 6,
      sol: 'Superpose six versions of the problem, each with a different face at 120 V. Their sum has every face at 120 V, so the potential inside is 120 V everywhere. By symmetry each version contributes equally at the centre: $120/6 = 20$ V.',
      trap: 'Trying to solve the series is slow; the symmetry argument is exact.' },
    { id: 'bvp-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'The potential in a charge-free region is $V = V_0\\sin(kx)\\,e^{-ky}$ with $V_0 = 10$ V and $k = \\pi$ m$^{-1}$. The magnitude of the electric field at $y = 1$ m is ______ V/m (to two decimal places), and it is the same for every $x$.',
      answer: 1.36, tol: 0.01, calc: () => PI * 10 * Math.exp(-PI),
      sol: '$E_x = -kV_0\\cos(kx)e^{-ky}$, $E_y = +kV_0\\sin(kx)e^{-ky}$, so $|E| = kV_0e^{-ky}$, independent of $x$. At $y = 1$: $\\pi\\times10\\times e^{-\\pi} = 31.42\\times0.0432 = 1.36$ V/m.' },

    // ---------- level 3 ----------
    { id: 'bvp-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'Two grounded plates lie at $y = 0$ and $y = a$, and the end $x = 0$ is held at $V = V_0\\sin(\\pi y/a)$; the strip extends to $x \\to \\infty$. The potential at mid-height falls to 1% of $V_0$ at $x = \\beta a$. The value of $\\beta$ is ______ (to two decimal places).',
      answer: 1.47, tol: 0.01, calc: () => Math.log(100) / PI,
      sol: 'A single mode at the end gives $V = V_0e^{-\\pi x/a}\\sin(\\pi y/a)$. At $y = a/2$, $V/V_0 = e^{-\\pi x/a} = 0.01$, so $x = (a/\\pi)\\ln100 = 1.466a$.',
      trap: 'The decay length is $a/\\pi$, not $a$: the field dies within about one plate spacing.' },
    { id: 'bvp-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'A long rectangular pipe has walls $y = 0$ and $y = a$ grounded and walls $x = \\pm a$ held at $V_0 = 100$ V. Using $V = \\sum_{n\\,\\rm odd}\\dfrac{4V_0}{n\\pi}\\dfrac{\\cosh(n\\pi x/a)}{\\cosh(n\\pi)}\\sin\\dfrac{n\\pi y}{a}$, the potential on the axis ($x = 0$, $y = a/2$) is ______ V (to one decimal place).',
      answer: 11.0, tol: 0.1, calc: () => { let S = 0; for (let n = 1; n < 40; n += 2) S += 400 / (n * PI) * Math.sin(n * PI / 2) / ch(n * PI); return S; },
      sol: 'Even in $x$ (both side walls at $V_0$), so $\\cosh$. At the centre: $n = 1$ gives $\\dfrac{400}{\\pi}\\dfrac{1}{\\cosh\\pi} = 127.3/11.59 = 10.98$; $n = 3$ gives $-\\dfrac{400}{3\\pi\\cosh3\\pi} \\approx -0.007$. Total $\\approx 11.0$ V. The pipe is twice as wide as it is tall, so the far-away walls barely reach the middle.',
      trap: 'Using $\\sinh$ (which suits one wall at $V_0$) instead of $\\cosh$ for two symmetric walls.' },
    { id: 'bvp-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'An isolated conducting sphere of radius $R$ is held at potential $V_s$ (relative to infinity) while placed in a uniform field $E_0\\hat z$. Its surface charge density is positive everywhere only if',
      options: ['$V_s > E_0R$', '$V_s > 2E_0R$', '$V_s > 3E_0R$', '$V_s > 0$'], answer: 2,
      sol: 'Outside $V = -E_0\\left(r - \\dfrac{R^3}{r^2}\\right)\\cos\\theta + \\dfrac{V_sR}{r}$: constant $V_s$ on $r = R$, uniform field far away. Then $\\sigma = -\\epsilon_0\\partial V/\\partial r|_R = \\epsilon_0\\left(\\dfrac{V_s}{R} + 3E_0\\cos\\theta\\right)$. Its minimum (at $\\theta = \\pi$) is $\\epsilon_0(V_s/R - 3E_0)$, positive only if $V_s > 3E_0R$.',
      trap: 'The induced part is $3\\epsilon_0E_0\\cos\\theta$ (sphere), not $\\epsilon_0E_0$.' },
    { id: 'bvp-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'shells',
      q: 'A spherical shell of radius $R$ carries surface charge $\\sigma = \\sigma_0P_2(\\cos\\theta)$. The potential at its north pole ($r = R$, $\\theta = 0$) is $\\kappa\\,\\sigma_0R/\\epsilon_0$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 0.2, tol: 0.005, calc: () => 1 / 5,
      sol: 'Try $V_{in} = A(r/R)^2P_2$, $V_{out} = A(R/r)^3P_2$. The jump in radial field at $R$ is $\\dfrac{A}{R}(3 + 2) = \\dfrac{\\sigma_0}{\\epsilon_0}$, so $A = \\dfrac{\\sigma_0R}{5\\epsilon_0}$. In general $A_l = \\dfrac{\\sigma_lR}{(2l+1)\\epsilon_0}$. At the pole $P_2 = 1$: $\\kappa = 1/5$.' },
    { id: 'bvp-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'A thin spherical surface of radius $R$ is held at $V(\\theta) = V_0(1 + \\cos\\theta)$; there are no other charges. Which statements are correct?',
      options: ['The total charge on the surface is $4\\pi\\epsilon_0RV_0$.', 'Far away the field is that of a point charge plus a dipole of moment $4\\pi\\epsilon_0R^2V_0$ along $\\hat z$.', 'Inside, the field is uniform, of magnitude $V_0/R$, along $-\\hat z$.', 'The potential at the centre is $2V_0$.'], answer: [0, 1, 2],
      sol: 'Inside: $V = V_0 + V_0(r/R)\\cos\\theta = V_0 + V_0z/R$, so $\\vec E = -(V_0/R)\\hat z$ and $V(0) = V_0$. Outside: $V = V_0R/r + V_0(R^2/r^2)\\cos\\theta$. The monopole term is $Q/4\\pi\\epsilon_0r$ with $Q = 4\\pi\\epsilon_0RV_0$; the dipole term is $p\\cos\\theta/4\\pi\\epsilon_0r^2$ with $p = 4\\pi\\epsilon_0R^2V_0$.',
      trap: 'The centre potential is the average over the sphere, $V_0$; the $\\cos\\theta$ part averages to zero.' },
    { id: 'bvp-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'uniqueness',
      q: 'Inside a region the charge density is given. On its boundary $\\partial V/\\partial n$ is given everywhere (a Neumann problem). Then the potential inside is',
      options: ['determined uniquely', 'determined up to an additive constant', 'determined only if the boundary is a conductor', 'not determined at all'], answer: 1,
      sol: 'If $V_1$ and $V_2$ both work, $U = V_1 - V_2$ is harmonic with $\\partial U/\\partial n = 0$ on the boundary. Green\'s identity gives $\\int|\\nabla U|^2dV = \\oint U\\,\\partial U/\\partial n\\,dA = 0$, so $\\nabla U = 0$ and $U$ is a constant. The fields agree exactly; the potentials may differ by a constant. (The data must also satisfy Gauss\'s law: $\\oint\\partial V/\\partial n\\,dA = -Q_{enc}/\\epsilon_0$.)' },
    { id: 'bvp-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      q: 'A long hollow cylinder of radius $R$ has its surface held at $V_0\\cos2\\phi$, with no charge inside. The potential inside is',
      options: ['$V_0(s/R)\\cos2\\phi$', '$V_0(R/s)^2\\cos2\\phi$', '$V_0\\cos2\\phi$ everywhere', '$V_0(s/R)^2\\cos2\\phi$'], answer: 3,
      sol: 'The 2D solutions are $s^{\\pm n}\\cos n\\phi$. With $n = 2$ and the origin inside, only $s^2$ is finite: $V = V_0(s/R)^2\\cos2\\phi = V_0(x^2 - y^2)/R^2$, which is harmonic and matches the surface.',
      trap: '$(R/s)^2$ is the exterior solution; it blows up on the axis.' },
    { id: 'bvp-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      q: 'A long hollow cylinder of radius $R$ has its surface held at $V_0\\sin^2\\phi$ with $V_0 = 80$ V, and there is no charge inside. The potential at $s = R/2$, $\\phi = 0$ is ______ V.',
      answer: 30, tol: 0.01, calc: () => 80 / 2 - (80 / 2) * 0.25,
      sol: '$\\sin^2\\phi = \\tfrac12 - \\tfrac12\\cos2\\phi$. Inside: $V = \\dfrac{V_0}{2} - \\dfrac{V_0}{2}\\left(\\dfrac sR\\right)^2\\cos2\\phi$. At $s = R/2$, $\\phi = 0$: $40 - 40\\times\\tfrac14 = 30$ V.',
      trap: 'The surface value at $\\phi = 0$ is zero, but the interior point is not: the constant part $V_0/2$ fills the whole inside.' },
    { id: 'bvp-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laplace equation',
      q: 'Which of these products is NOT a solution of the two-dimensional Laplace equation?',
      options: ['$e^{x}\\cos y$', '$e^{2x}\\sin2y$', '$e^{3x}\\cos4y$', '$\\cosh x\\cos y$'], answer: 2,
      sol: 'For $e^{ax}\\cos by$ (or $\\sin by$, or $\\cosh ax$), $\\nabla^2 = (a^2 - b^2)\\times$ the function. It vanishes only when $a = b$. $e^{3x}\\cos4y$ has $9 - 16 = -7 \\ne 0$.',
      trap: '$\\cosh x\\cos y$ is fine: $\\cosh$ is a sum of $e^{\\pm x}$, each with $a = b = 1$.' },
    { id: 'bvp-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      q: 'A cubical box of side $a$ has five faces grounded; the face $z = a$ is held at $V_0\\sin(\\pi x/a)\\sin(\\pi y/a)$ with $V_0 = 100$ V. The potential at the centre of the box is ______ V (to one decimal place).',
      answer: 10.7, tol: 0.1, calc: () => 100 * sh(PI * Math.SQRT2 / 2) / sh(PI * Math.SQRT2),
      sol: '$V = V_0\\sin\\dfrac{\\pi x}{a}\\sin\\dfrac{\\pi y}{a}\\dfrac{\\sinh\\gamma z}{\\sinh\\gamma a}$ with $\\gamma^2 = (\\pi/a)^2 + (\\pi/a)^2$, so $\\gamma a = \\pi\\sqrt2 = 4.443$. At the centre: $100\\times\\dfrac{\\sinh2.221}{\\sinh4.443} = 100\\times\\dfrac{4.558}{42.51} = 10.7$ V.',
      trap: 'In 3D the decay constant is $\\sqrt{k_x^2 + k_y^2}$, faster than in 2D; using $\\pi/a$ gives 19.9 V.' },
    { id: 'bvp-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'corners and edges',
      q: 'Near the sharp edge of a thin, flat conducting sheet held at a fixed potential, the surface charge density varies with the distance $s$ from the edge as',
      options: ['$s^{-1/2}$', '$s^{-1}$', '$s^{1/2}$', '$\\ln s$'], answer: 0,
      sol: 'Around an edge the charge-free region spans an angle $\\beta = 2\\pi$. Solutions vanishing on both faces are $s^{\\pi/\\beta}\\sin(\\pi\\phi/\\beta) = s^{1/2}\\sin(\\phi/2)$, so $E \\propto s^{-1/2}$ and $\\sigma = \\epsilon_0E \\propto s^{-1/2}$: large but integrable, so the total charge is finite.',
      trap: '$1/s$ would put infinite charge near the edge.' },
    { id: 'bvp-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'shells',
      q: 'A shell carrying $\\sigma = \\sigma_0\\cos\\theta$ is placed in an external uniform field $E_0\\hat z$. The field inside the shell is zero when',
      options: ['$\\sigma_0 = \\epsilon_0E_0$', '$\\sigma_0 = 2\\epsilon_0E_0$', '$\\sigma_0 = 4\\pi\\epsilon_0E_0$', '$\\sigma_0 = 3\\epsilon_0E_0$'], answer: 3,
      sol: 'The shell alone gives $-\\dfrac{\\sigma_0}{3\\epsilon_0}\\hat z$ inside. Adding $E_0\\hat z$, the total vanishes for $\\sigma_0 = 3\\epsilon_0E_0$, exactly the charge a conducting sphere acquires in that field. That is why a conductor\'s induced charge is $3\\epsilon_0E_0\\cos\\theta$.' },
    { id: 'bvp-029', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'uniqueness',
      q: 'For Laplace\'s or Poisson\'s equation (with $\\rho$ given) in a bounded region with closed surface $S$, which statements are correct?',
      options: ['Giving $V$ on all of $S$ fixes $V$ inside uniquely.', 'Giving $\\partial V/\\partial n$ on all of $S$ fixes $V$ inside up to a constant.', 'Giving $V$ on part of $S$ and $\\partial V/\\partial n$ on the rest fixes $V$ uniquely.', 'Giving both $V$ and $\\partial V/\\partial n$ arbitrarily on all of $S$ always yields a solution.'], answer: [0, 1, 2],
      sol: 'The difference $U$ of two solutions satisfies $\\int|\\nabla U|^2dV = \\oint U\\,\\partial U/\\partial n\\,dA$. The right side vanishes if on every patch either $U = 0$ (Dirichlet) or $\\partial U/\\partial n = 0$ (Neumann), so $U$ is constant; with any Dirichlet patch the constant is zero. Prescribing both on all of $S$ (Cauchy data) over-determines an elliptic equation: in general no solution exists.',
      trap: 'More boundary data is not better: Cauchy data for Laplace\'s equation is usually inconsistent.' },
    { id: 'bvp-030', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laplace equation',
      q: 'The potential in a charge-free region of the $xy$ plane is $V = k\\,xy$. The electric field lines lie along the curves',
      options: ['$xy = $ constant', '$x^2 - y^2 = $ constant', '$x^2 + y^2 = $ constant', '$y = $ constant $\\times\\,x$'], answer: 1,
      sol: '$V = kxy$ is $\\tfrac k2\\,\\mathrm{Im}(z^2)$. Field lines are the level curves of the harmonic conjugate, $\\tfrac k2\\,\\mathrm{Re}(z^2) = \\tfrac k2(x^2 - y^2)$. Check: $\\vec E = -k(y, x)$, and the gradient of $x^2 - y^2$ is $(2x, -2y)$, perpendicular to $\\vec E$, so $\\vec E$ runs along those curves.',
      trap: '$xy = $ constant are the equipotentials, not the field lines.' },

    // ---------- level 4 ----------
    { id: 'bvp-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'A sphere of radius $R$ has its northern hemisphere held at $+V_0$ and its southern hemisphere at $-V_0$. Inside, $V = \\sum_l c_l(r/R)^lP_l(\\cos\\theta)$. The coefficient $c_3$, in units of $V_0$, is ______ (to three decimal places).',
      answer: -0.875, tol: 0.002, calc: () => 7 * ((5 / 4 - 3 / 2) / 2),
      sol: 'By orthogonality $c_l = \\dfrac{2l+1}{2}\\displaystyle\\int_{-1}^1V(x)P_l(x)\\,dx$. The boundary function is odd, so for odd $l$: $c_l = (2l+1)V_0\\displaystyle\\int_0^1P_l\\,dx$. With $P_3 = \\tfrac12(5x^3 - 3x)$: $\\int_0^1P_3 = \\tfrac12\\left(\\tfrac54 - \\tfrac32\\right) = -\\tfrac18$. So $c_3 = 7\\times(-\\tfrac18) = -0.875$.',
      trap: 'Forgetting the normalisation $(2l+1)/2$ gives $-0.125$.' },
    { id: 'bvp-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'For the same sphere (northern hemisphere at $+V_0$, southern at $-V_0$, radius $R$), the dipole moment seen far outside is',
      options: ['$4\\pi\\epsilon_0R^2V_0$', '$3\\pi\\epsilon_0R^2V_0$', '$6\\pi\\epsilon_0R^2V_0$', '$8\\pi\\epsilon_0R^2V_0$'], answer: 2,
      sol: '$c_1 = 3V_0\\int_0^1x\\,dx = \\tfrac32V_0$. Outside, the $l = 1$ term is $c_1(R/r)^2\\cos\\theta$, which must equal $p\\cos\\theta/4\\pi\\epsilon_0r^2$. So $p = 4\\pi\\epsilon_0R^2\\times\\tfrac32V_0 = 6\\pi\\epsilon_0R^2V_0$.' },
    { id: 'bvp-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'corners and edges',
      q: 'Two grounded conducting half-planes meet at an edge so that the charge-free region around the edge spans an angle $\\beta = 3\\pi/2$ (the outside of a right-angled metal corner). Near the edge the field magnitude varies as $s^{\\nu}$. The value of $\\nu$ is ______ (to two decimal places).',
      answer: -0.33, tol: 0.01, calc: () => PI / (1.5 * PI) - 1,
      sol: 'In polar coordinates with $V = 0$ on $\\phi = 0$ and $\\phi = \\beta$, the solutions are $s^{n\\pi/\\beta}\\sin(n\\pi\\phi/\\beta)$. Near the edge the $n = 1$ term dominates: $V \\propto s^{\\pi/\\beta}$, so $E \\propto s^{\\pi/\\beta - 1} = s^{2/3 - 1} = s^{-1/3}$.',
      trap: 'The exponent is $\\pi/\\beta - 1$; for an outside corner ($\\beta > \\pi$) it is negative and the field diverges.' },
    { id: 'bvp-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'corners and edges',
      q: 'Near the edge where two conducting surfaces at the same potential meet, with the charge-free region spanning an angle $\\beta$, the field varies as $s^{\\pi/\\beta - 1}$. Which statements are correct?',
      options: ['For $\\beta < \\pi$ (inside a corner) the field goes to zero at the edge.', 'For $\\beta = 2\\pi$ (the edge of a thin sheet) the surface charge density varies as $s^{-1/2}$.', 'For $\\beta = \\pi/2$ the field grows linearly with $s$.', 'For $\\beta = 3\\pi/2$ the field varies as $s^{1/2}$.'], answer: [0, 1, 2],
      sol: 'Exponent $\\pi/\\beta - 1$: positive for $\\beta < \\pi$ (field vanishes at the edge); $-1/2$ for $\\beta = 2\\pi$; $+1$ for $\\beta = \\pi/2$; $-1/3$ for $\\beta = 3\\pi/2$, not $+1/2$. This is why charge crowds on outside corners and edges and avoids inside corners.' },
    { id: 'bvp-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Green reciprocity',
      q: 'Two concentric grounded conducting spheres have radii $a = 1$ cm and $b = 3$ cm. A point charge $q$ is placed between them at $r = 2$ cm from the centre. The charge induced on the inner sphere is $-\\kappa q$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 0.25, tol: 0.005, calc: () => (1 / 2) * (3 - 2) / (3 - 1),
      sol: 'Green reciprocity: replace $q$ by a thin uniform shell of the same charge at radius $r$ (the induced charges on grounded spheres depend only on $r$ by symmetry, so they are the same). Then $V(r) = 0$ at $a$ and $b$ with a kink at $r$; solving gives $Q_a = -q\\dfrac{a}{r}\\dfrac{b - r}{b - a}$, $Q_b = -q\\dfrac{b}{r}\\dfrac{r - a}{b - a}$. Here $Q_a = -q\\times\\tfrac12\\times\\tfrac12 = -0.25q$ (and $Q_b = -0.75q$; the two add to $-q$).',
      trap: 'The split is not in the ratio of distances: it follows $1/r$ potentials.' },
    { id: 'bvp-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'A ring of radius $a$ carries charge $Q$. For $r > a$, $V = \\dfrac{Q}{4\\pi\\epsilon_0}\\sum_l\\dfrac{a^l}{r^{l+1}}P_l(0)P_l(\\cos\\theta)$ (obtained from the on-axis potential). At $r = 2a$ on the axis of the ring, the ratio of the $l = 2$ term to the $l = 0$ term is ______ (to three decimal places).',
      answer: -0.125, tol: 0.001, calc: () => 0.25 * -0.5,
      sol: 'On the axis $V = \\dfrac{Q}{4\\pi\\epsilon_0\\sqrt{z^2 + a^2}} = \\dfrac{Q}{4\\pi\\epsilon_0z}\\left(1 - \\dfrac{a^2}{2z^2} + \\dots\\right)$, and replacing $z^{-(l+1)}$ by $r^{-(l+1)}P_l(\\cos\\theta)$ gives the full expansion. The ratio of terms is $(a/r)^2P_2(0)P_2(1) = \\tfrac14\\times(-\\tfrac12) = -0.125$.',
      trap: 'The quadrupole term is negative on the axis: a ring is an oblate charge distribution.' },
    { id: 'bvp-037', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      q: 'A long, neutral conducting cylinder of radius $R$ lies in a uniform field $E_0\\hat x$ perpendicular to its axis, so that outside $V = -E_0(s - R^2/s)\\cos\\phi$. Which statements are correct?',
      options: ['The net induced charge per unit length is zero.', 'The surface charge density is $2\\epsilon_0E_0\\cos\\phi$.', 'Outside, the induced charge acts like a 2D line dipole of moment $2\\pi\\epsilon_0R^2E_0$ per unit length.', 'At $\\phi = 90^\\circ$ on the surface the field is $2E_0$.'], answer: [0, 1, 2],
      sol: '$\\sigma = -\\epsilon_0\\partial_sV|_R = 2\\epsilon_0E_0\\cos\\phi$, which integrates to zero round the circle. The term $E_0R^2\\cos\\phi/s$ matches a 2D dipole $p\'\\cos\\phi/2\\pi\\epsilon_0s$ with $p\' = 2\\pi\\epsilon_0R^2E_0$. At $\\phi = 90^\\circ$ the normal field $\\propto\\cos\\phi$ vanishes and the tangential field is zero on a conductor, so the field there is zero.' },
    { id: 'bvp-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'uniqueness',
      q: 'Several conductors sit inside a region bounded at infinity. The second uniqueness theorem says the field in the space between them is fixed once we give the charge density in that space and',
      options: ['the total charge on each conductor', 'the surface charge density on each conductor', 'the potential of one conductor', 'the dipole moment of each conductor'], answer: 0,
      sol: 'Taking the difference of two solutions, each conductor is an equipotential carrying zero net difference charge. Green\'s identity then gives $\\int|\\vec E_3|^2dV = -\\sum_iV_i\\oint\\vec E_3\\cdot d\\vec a = 0$, so the fields agree. How the charge spreads over each surface comes out of the solution, not in.' },

    // ---------- level 5 ----------
    { id: 'bvp-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'A thin spherical surface of radius $R$ is held at $V(\\theta) = V_0\\cos^3\\theta$, with no charges elsewhere. The surface charge density at the north pole is $\\kappa\\,\\epsilon_0V_0/R$. The value of $\\kappa$ is ______ (to one decimal place).',
      answer: 4.6, tol: 0.05, calc: () => (3 / 5) * 3 + (2 / 5) * 7,
      sol: 'Expand: $\\cos^3\\theta = \\tfrac35P_1 + \\tfrac25P_3$. Each mode $A_lP_l$ on the surface becomes $A_l(r/R)^lP_l$ inside and $A_l(R/r)^{l+1}P_l$ outside, and the jump in radial field is $(2l+1)A_l/R$. So $\\sigma = \\dfrac{\\epsilon_0V_0}{R}\\left(3\\cdot\\tfrac35P_1 + 7\\cdot\\tfrac25P_3\\right)$. At the pole both $P_l = 1$: $\\kappa = 1.8 + 2.8 = 4.6$.',
      trap: 'Using $\\cos^3\\theta$ directly in $\\sigma = 3\\epsilon_0V_0\\cos\\theta/R$-style formulas misses that each $l$ has its own factor $2l+1$.' },
    { id: 'bvp-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Fourier series',
      q: 'A long square pipe has one wall held at $V_0$ and the other three grounded. Separation of variables gives the potential on its axis as $V_0S$ with $S = \\sum_{n\\,\\rm odd}\\dfrac{4}{n\\pi}\\sin\\dfrac{n\\pi}{2}\\dfrac{\\sinh(n\\pi/2)}{\\sinh n\\pi}$. Without summing the series, the exact value of $S$ is ______ (to two decimal places).',
      answer: 0.25, tol: 0.005, calc: () => { let T = 0; for (let n = 1; n < 40; n += 2) T += 4 / (n * PI) * Math.sin(n * PI / 2) * sh(n * PI / 2) / sh(n * PI); return T; },
      sol: 'Superpose four copies, each with a different wall at $V_0$: the sum has all walls at $V_0$, so it is $V_0$ everywhere inside. By symmetry each copy gives the same value on the axis, so $S = 1/4$. (Check: the $n = 1$ term alone is $0.2537$, the $n = 3$ term $-0.0038$, and the rest are tiny.)',
      trap: 'Stopping at $n = 1$ gives 0.254, close but not exact; the symmetry argument gives the exact answer.' },
    { id: 'bvp-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'separation (spherical)',
      q: 'A grounded conducting sphere of radius $R$ sits in an external potential that near the sphere is $V_{ext} = \\alpha(2z^2 - x^2 - y^2)$ (a quadrupole field). The induced surface charge density is',
      options: ['$3\\epsilon_0\\alpha R\\,P_2(\\cos\\theta)$', '$-5\\epsilon_0\\alpha R\\,P_2(\\cos\\theta)$', '$-10\\epsilon_0\\alpha R\\,P_2(\\cos\\theta)$', '$-6\\epsilon_0\\alpha R\\,P_2(\\cos\\theta)$'], answer: 2,
      sol: '$2z^2 - x^2 - y^2 = 2r^2P_2(\\cos\\theta)$, so $V_{ext} = 2\\alpha r^2P_2$. Grounding requires adding $-2\\alpha R^5P_2/r^3$: $V = 2\\alpha\\left(r^2 - \\dfrac{R^5}{r^3}\\right)P_2$. Then $\\sigma = -\\epsilon_0\\partial_rV|_R = -\\epsilon_0\\cdot2\\alpha(2R + 3R)P_2 = -10\\epsilon_0\\alpha RP_2$.',
      trap: 'Forgetting that $2z^2 - x^2 - y^2$ equals $2r^2P_2$, not $r^2P_2$, halves the answer.' },
    { id: 'bvp-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Laplace equation',
      q: 'Let $V$ be harmonic in a region that contains a ball of radius $a$ centred at $P$. Which statements are correct?',
      options: ['$V(P)$ equals the average of $V$ over the sphere of radius $a$.', '$V(P)$ equals the average of $V$ over the solid ball of radius $a$.', '$|\\nabla V|^2$ can have a strict local maximum inside the region.', '$\\partial V/\\partial x$ is itself harmonic.'], answer: [0, 1, 3],
      sol: 'The sphere average is $V(P)$ for every radius, so averaging over shells gives the ball average too. Derivatives of harmonic functions are harmonic ($\\partial_x$ commutes with $\\nabla^2$). But $|\\nabla V|^2$ is subharmonic: $\\nabla^2|\\nabla V|^2 = 2\\sum_{ij}(\\partial_i\\partial_jV)^2 \\ge 0$, so it cannot have a strict interior maximum. The field strength is largest on the boundary.',
      trap: 'Each field component is harmonic, but the field strength squared is not: it is subharmonic.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'bvp-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      make(r) {
        const V0 = choose(r, [50, 80, 100, 120, 200]), ba = choose(r, [0.5, 1, 1.5, 2]), fx = choose(r, [0.25, 0.5, 0.75]), fy = choose(r, [0.25, 0.5, 0.75]);
        const val = V0 * Math.sin(PI * fx) * sh(PI * fy * ba) / sh(PI * ba);
        return { q: `A rectangle $0 \\le x \\le a$, $0 \\le y \\le b$ with $b = ${ba}a$ has $V = 0$ on the sides $x = 0$, $x = a$ and $y = 0$, and $V = ${V0}\\sin(\\pi x/a)$ V on the side $y = b$. There is no charge inside. The potential at $x = ${fx}a$, $y = ${fy}b$ is ______ V (to one decimal place).`,
          answer: round(val, 1), tol: Math.max(0.1, Math.abs(val) * 0.01), unit: 'V', V0, ba, fx, fy,
          sol: `One boundary mode gives one interior mode: $V = ${V0}\\sin\\dfrac{\\pi x}{a}\\,\\dfrac{\\sinh(\\pi y/a)}{\\sinh(\\pi b/a)}$. At the point, $\\pi y/a = ${round(PI * fy * ba, 4)}$ and $\\pi b/a = ${round(PI * ba, 4)}$: $V = ${V0}\\times${round(Math.sin(PI * fx), 4)}\\times\\dfrac{${round(sh(PI * fy * ba), 4)}}{${round(sh(PI * ba), 4)}} = ${round(val, 2)}$ V.`,
          trap: 'The argument of $\\sinh$ is $\\pi y/a$, with $a$ the width that sets the wavelength, not $\\pi y/b$.' };
      },
      verify: (p) => p.V0 * Math.sin(PI * p.fx) * sh(PI * p.fy * p.ba) / sh(PI * p.ba) },
    { id: 'bvp-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      make(r) {
        const V0 = choose(r, [60, 100, 150, 240]), k = choose(r, [0.5, 0.75, 1, 1.5]);
        let S = 0; for (let n = 1; n < 60; n += 2) S += 4 * V0 / (n * PI) * Math.sin(n * PI / 2) / ch(n * PI * k);
        return { q: `A long rectangular pipe has walls $y = 0$ and $y = a$ grounded and walls $x = \\pm${k}a$ both held at ${V0} V. Using separation of variables, the potential on the axis of the pipe ($x = 0$, $y = a/2$) is ______ V (to one decimal place).`,
          answer: round(S, 1), tol: Math.max(0.1, S * 0.01), unit: 'V', V0, k,
          sol: `By symmetry in $x$: $V = \\sum_{n\\,\\rm odd}\\dfrac{4V_0}{n\\pi}\\dfrac{\\cosh(n\\pi x/a)}{\\cosh(${k}n\\pi)}\\sin\\dfrac{n\\pi y}{a}$, which is ${V0} V on $x = \\pm${k}a$ (the Fourier series of a constant) and zero on $y = 0, a$. On the axis: $n = 1$: $\\dfrac{4\\times${V0}}{\\pi\\cosh(${round(k * PI, 3)})} = ${round(4 * V0 / (PI * ch(PI * k)), 3)}$; $n = 3$: $${round(-4 * V0 / (3 * PI * ch(3 * PI * k)), 3)}$; higher terms are smaller still. Total $\\approx ${round(S, 2)}$ V.`,
          trap: 'Two equal walls call for $\\cosh$; $\\sinh$ suits one wall at $V_0$ facing a grounded one.' };
      },
      verify: (p) => { let S = 0; for (let n = 1; n < 60; n += 2) S += 4 * p.V0 / (n * PI) * Math.sin(n * PI / 2) / ch(n * PI * p.k); return S; } },
    { id: 'bvp-g03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mean value',
      make(r) {
        const F = choose(r, [
          ['\\cos^2\\theta', '1/3', ['1/2', '2/3', '0']],
          ['\\sin^2\\theta', '2/3', ['1/2', '1/3', '1']],
          ['\\cos^4\\theta', '1/5', ['3/8', '1/3', '1/4']],
          ['(1 + \\cos\\theta)^2', '4/3', ['3/2', '1', '2']],
          ['\\cos\\theta + \\cos^2\\theta', '1/3', ['1/2', '4/3', '0']],
          ['3\\cos^2\\theta - 1', '0', ['1/2', '1', '2/3']],
        ]);
        const o = mcqOptions(r, F[1], F[2], (v) => `$${v === '0' ? '0' : v + '\\,V_0'}$`);
        return { q: `A thin spherical surface of radius $R$ is held at $V(\\theta) = V_0\\,${F[0]}$ and encloses no charge. The potential at the centre is`, ...o,
          sol: `The centre value of a harmonic function is its average over any sphere around the centre (mean value theorem): $\\dfrac{1}{4\\pi}\\displaystyle\\int V\\,d\\Omega = \\dfrac{V_0}{2}\\int_{-1}^{1}f(x)\\,dx$ with $x = \\cos\\theta$. Useful averages: $\\langle x\\rangle = 0$, $\\langle x^2\\rangle = 1/3$, $\\langle x^4\\rangle = 1/5$. For $${F[0]}$ this gives ${F[1]}. Equivalently it is the $l = 0$ Legendre coefficient.`,
          trap: 'Averaging over $\\theta$ alone (without the $\\sin\\theta$ weight) gives the wrong number, e.g. 1/2 for $\\cos^2\\theta$.' };
      } },
    { id: 'bvp-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'shells',
      make(r) {
        const l = int(r, 1, 4), f = choose(r, [0.5, 0.8, 1.5, 2, 3]);
        const val = f < 1 ? Math.pow(f, l) / (2 * l + 1) : Math.pow(1 / f, l + 1) / (2 * l + 1);
        return { q: `A spherical shell of radius $R$ carries surface charge $\\sigma = \\sigma_0P_${l}(\\cos\\theta)$. On the $+z$ axis at $r = ${f}R$, the potential is $\\kappa\\,\\sigma_0R/\\epsilon_0$. Find $\\kappa$ (to four decimal places).`,
          answer: round(val, 4), tol: Math.max(1e-4, val * 0.01), l, f,
          sol: `Try $V_{in} = A(r/R)^{${l}}P_${l}$ and $V_{out} = A(R/r)^{${l + 1}}P_${l}$ (continuous at $R$). The jump in $E_r$ is $\\dfrac{A}{R}\\left[(${l + 1}) + ${l}\\right] = \\dfrac{\\sigma_0}{\\epsilon_0}$, so $A = \\dfrac{\\sigma_0R}{${2 * l + 1}\\epsilon_0}$. On the axis $P_${l}(1) = 1$; at $r = ${f}R$ (${f < 1 ? 'inside' : 'outside'}): $\\kappa = \\dfrac{1}{${2 * l + 1}}\\times${f < 1 ? `(${f})^{${l}}` : `(1/${f})^{${l + 1}}`} = ${round(val, 5)}$.`,
          trap: 'Inside uses $r^l$, outside $r^{-(l+1)}$; mixing them up is the usual slip.' };
      },
      verify: (p) => (p.f < 1 ? p.f ** p.l : (1 / p.f) ** (p.l + 1)) / (2 * p.l + 1) },
    { id: 'bvp-g05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'corners and edges',
      make(r) {
        const B = choose(r, [[1, 4, '45^\\circ'], [1, 3, '60^\\circ'], [1, 2, '90^\\circ'], [2, 3, '120^\\circ'], [3, 2, '270^\\circ'], [2, 1, '360^\\circ'], [5, 4, '225^\\circ']]);
        const beta = B[0] / B[1]; // in units of pi
        const nu = 1 / beta - 1; // exponent
        const show = (v) => { const x = round(v, 3); if (Math.abs(x) < 1e-9) return '$s^0$ (constant)'; const fr = { '0.333': '1/3', '-0.333': '-1/3', '0.5': '1/2', '-0.5': '-1/2', '-0.2': '-1/5', '-0.6': '-3/5', '0.667': '2/3', '-0.667': '-2/3', '0.25': '1/4', '-0.25': '-1/4', '-0.4': '-2/5' }[String(x)] ?? String(x); return `$s^{${fr}}$`; };
        const o = mcqOptions(r, nu, [1 / beta, -nu, beta - 1, nu + 1 === 0 ? 0.5 : -1 / beta], show);
        return { q: `Two grounded conducting planes meet along an edge so that the charge-free region around the edge spans an angle of $${B[2]}$. Close to the edge, the field strength varies with distance $s$ from the edge as`, ...o,
          sol: `With $V = 0$ on $\\phi = 0$ and $\\phi = \\beta$, the separated solutions are $s^{n\\pi/\\beta}\\sin(n\\pi\\phi/\\beta)$; near the edge $n = 1$ dominates. So $V \\propto s^{\\pi/\\beta}$ and $E \\propto s^{\\pi/\\beta - 1}$. Here $\\beta = ${B[2]}$, $\\pi/\\beta = ${round(1 / beta, 3)}$, so the exponent is ${round(nu, 3)}.`,
          trap: 'That is the exponent of the field, one less than the exponent of the potential.' };
      } },
    { id: 'bvp-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'separation (cylindrical)',
      make(r) {
        const E0 = choose(r, [0.5, 1, 2, 2.5, 4, 5]), phi = choose(r, [0, 30, 45, 60, 120, 135, 150, 180]), shape = choose(r, ['cylinder', 'sphere']);
        const k = shape === 'cylinder' ? 2 : 3, val = k * EPS0 * E0 * 1e3 * Math.cos(phi * PI / 180) * 1e9;
        return { q: `A neutral conducting ${shape === 'cylinder' ? 'long cylinder (axis perpendicular to the field)' : 'sphere'} sits in a uniform field of ${E0} kV/m. The induced surface charge density at the point whose outward normal makes ${phi}$^\\circ$ with the field is ______ nC/m$^2$ (to two decimal places). Use $\\epsilon_0 = 8.854\\times10^{-12}$ F/m.`,
          answer: round(val, 2), tol: Math.max(0.01, Math.abs(val) * 0.01), unit: 'nC/m²', k, E0, phi,
          sol: `${shape === 'cylinder' ? 'Outside, $V = -E_0(s - R^2/s)\\cos\\phi$, so $\\sigma = 2\\epsilon_0E_0\\cos\\phi$' : 'Outside, $V = -E_0(r - R^3/r^2)\\cos\\theta$, so $\\sigma = 3\\epsilon_0E_0\\cos\\theta$'}. Here: $${k}\\times8.854\\times10^{-12}\\times${E0 * 1000}\\times\\cos${phi}^\\circ = ${round(val, 3)}$ nC/m$^2$.`,
          trap: 'Cylinder (transverse field): factor 2. Sphere: factor 3.' };
      },
      verify: (p) => p.k * EPS0 * p.E0 * 1e3 * Math.cos(p.phi * PI / 180) * 1e9 },
    { id: 'bvp-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Poisson equation',
      make(r) {
        const nz = [-4, -3, -2, -1, 1, 2, 3, 4, 5], a = choose(r, nz), b = choose(r, nz), c = choose(r, nz);
        const val = -2 * (a + b + c);
        return { q: `In some region the potential is $V = ${a}x^2 + ${b}y^2 + ${c}z^2$ (volts, metres). The charge density there is $\\kappa\\,\\epsilon_0$ (in C/m$^3$ when $\\epsilon_0$ is in F/m). Find $\\kappa$.`.replace(/\+ -/g, '- '),
          answer: val, tol: 0, a, b, c,
          sol: `Poisson: $\\rho = -\\epsilon_0\\nabla^2V = -\\epsilon_0(2\\times${a} + 2\\times${b} + 2\\times${c}) = ${val}\\epsilon_0$.${val === 0 ? ' The potential is harmonic: the region is charge-free.' : ''}`.replace(/\+ -/g, '- '),
          trap: 'The sign: $\\nabla^2V = -\\rho/\\epsilon_0$. A potential that curves upward in every direction means negative charge.' };
      },
      verify: (p) => -2 * (p.a + p.b + p.c) },
    { id: 'bvp-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (Cartesian)',
      make(r) {
        const a = choose(r, [1, 2, 3, 5, 10]), pct = choose(r, [10, 5, 1, 0.1]), n = choose(r, [1, 1, 2, 3]);
        const x = (a / (n * PI)) * Math.log(100 / pct);
        return { q: `Grounded plates lie at $y = 0$ and $y = ${a}$ cm. The end $x = 0$ of the strip between them is held at $V_0\\sin(${n === 1 ? '' : n}\\pi y/${a})$ (with $y$ in cm), and the strip extends to $x \\to \\infty$. At what distance $x$ does the amplitude of the potential fall to ${pct}% of $V_0$? Answer in cm (to two decimal places).`,
          answer: round(x, 2), tol: Math.max(0.01, x * 0.01), unit: 'cm', a, pct, n,
          sol: `The single mode continues as $V = V_0e^{-${n === 1 ? '' : n}\\pi x/a}\\sin(${n === 1 ? '' : n}\\pi y/a)$. Set $e^{-${n === 1 ? '' : n}\\pi x/a} = ${pct / 100}$: $x = \\dfrac{a}{${n === 1 ? '' : n}\\pi}\\ln${round(100 / pct, 2)} = \\dfrac{${a}}{${round(n * PI, 4)}}\\times${round(Math.log(100 / pct), 4)} = ${round(x, 3)}$ cm.`,
          trap: `Higher modes die faster: the decay length is $a/n\\pi$.` };
      },
      verify: (p) => (p.a / (p.n * PI)) * Math.log(100 / p.pct) },
    { id: 'bvp-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'separation (spherical)',
      make(r) {
        const R = choose(r, [2, 5, 10]), Vs = choose(r, [0, 100, 200, 500]), E0 = choose(r, [1, 2, 5]), th = choose(r, [0, 60, 90, 120, 180]);
        const sig = EPS0 * (Vs / (R / 100) + 3 * E0 * 1e3 * Math.cos(th * PI / 180)) * 1e9;
        return { q: `A conducting sphere of radius ${R} cm is held at ${Vs} V (relative to infinity) in a uniform field of ${E0} kV/m along $+z$. The surface charge density at polar angle $\\theta = ${th}^\\circ$ is ______ nC/m$^2$ (to two decimal places; $\\epsilon_0 = 8.854\\times10^{-12}$ F/m).`,
          answer: round(sig, 2), tol: Math.max(0.01, Math.abs(sig) * 0.01), unit: 'nC/m²', R, Vs, E0, th,
          sol: `Outside: $V = -E_0\\left(r - \\dfrac{R^3}{r^2}\\right)\\cos\\theta + \\dfrac{V_sR}{r}$ (constant on the sphere, uniform far away). So $\\sigma = -\\epsilon_0\\partial_rV|_R = \\epsilon_0\\left(\\dfrac{V_s}{R} + 3E_0\\cos\\theta\\right) = 8.854\\times10^{-12}\\left(\\dfrac{${Vs}}{${R / 100}} + 3\\times${E0 * 1000}\\times${round(Math.cos(th * PI / 180), 3)}\\right) = ${round(sig, 3)}$ nC/m$^2$.`,
          trap: 'The two pieces add: the charge $4\\pi\\epsilon_0RV_s$ spreads evenly, the induced part goes as $\\cos\\theta$.' };
      },
      verify: (p) => EPS0 * (p.Vs / (p.R / 100) + 3 * p.E0 * 1e3 * Math.cos(p.th * PI / 180)) * 1e9 },
    { id: 'bvp-g10', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Laplace equation',
      make(r) {
        const good = ['$x^2 - y^2$', '$e^{2x}\\cos2y$', '$x^3 - 3xy^2$', '$\\ln(x^2 + y^2)$', '$\\dfrac{x}{x^2 + y^2}$', '$\\sinh x\\sin y$', '$xy + 3x - 2y$', '$\\arctan(y/x)$'];
        const bad = ['$x^2 + y^2$', '$e^{x}\\cos2y$', '$x^3 + y^3$', '$\\sqrt{x^2 + y^2}$', '$x^2y$', '$\\cosh x\\cosh y$', '$\\sin x\\sin y$', '$xy^2 - x^2y + x^2$'];
        const ng = int(r, 1, 3);
        const g = shuffle(r, good).slice(0, ng), b = shuffle(r, bad).slice(0, 4 - ng);
        const all = shuffle(r, [...g, ...b]);
        const answer = all.map((s, i) => (g.includes(s) ? i : -1)).filter((i) => i >= 0);
        return { q: 'Which of these functions satisfy the two-dimensional Laplace equation $\\partial_x^2V + \\partial_y^2V = 0$ (away from the origin where needed)?', options: all, answer,
          sol: 'Check $\\partial_x^2 + \\partial_y^2$ for each. Harmonic: real or imaginary parts of analytic functions, e.g. $x^2 - y^2 = \\mathrm{Re}\\,z^2$, $x^3 - 3xy^2 = \\mathrm{Re}\\,z^3$, $e^{2x}\\cos2y = \\mathrm{Re}\\,e^{2z}$, $\\ln(x^2 + y^2) = 2\\,\\mathrm{Re}\\ln z$, $x/(x^2 + y^2) = \\mathrm{Re}(1/z)$, $\\arctan(y/x) = \\mathrm{Im}\\ln z$, $\\sinh x\\sin y = \\mathrm{Im}\\,\\sinh z$, and any linear function plus $xy$. Not harmonic: $x^2 + y^2$ (gives 4), $e^x\\cos2y$ ($1 - 4$), $x^3 + y^3$ ($6x + 6y$), $\\sqrt{x^2 + y^2}$ ($1/r$), $x^2y$ ($2y$), $\\cosh x\\cosh y$ and $\\sin x\\sin y$ ($\\pm2\\times$ the function), $xy^2 - x^2y + x^2$ ($2x - 2y + 2$).',
          trap: 'For $e^{ax}\\cos by$-type products the two rates must be equal; for polynomials the second derivatives must cancel.' };
      } },
    { id: 'bvp-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Legendre expansions',
      make(r) {
        const al = int(r, 0, 4) * 10, be = int(r, 1, 4) * 10, ga = int(r, 1, 6) * 15, k = choose(r, [1.5, 2, 3]), inside = r() < 0.5;
        const A0 = al + ga / 3, A1 = be, A2 = 2 * ga / 3, f = inside ? 1 / k : k;
        const val = inside ? A0 + A1 * f + A2 * f * f : A0 / f + A1 / f ** 2 + A2 / f ** 3;
        return { q: `A thin spherical surface of radius $R$ is held at $V(\\theta) = ${al ? al + ' + ' : ''}${be}\\cos\\theta + ${ga}\\cos^2\\theta$ volts, with no other charges. The potential on the $+z$ axis at $r = ${inside ? `R/${k}` : `${k}R`}$ is ______ V (to two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.01, Math.abs(val) * 0.01), unit: 'V', A0, A1, A2, f, inside,
          sol: `Rewrite in Legendre polynomials: $\\cos^2\\theta = \\tfrac13 + \\tfrac23P_2$. So $V(R,\\theta) = ${round(A0, 3)} + ${A1}P_1 + ${round(A2, 3)}P_2$. ${inside ? 'Inside each term carries $(r/R)^l$' : 'Outside each term carries $(R/r)^{l+1}$'}; on the axis all $P_l = 1$: $V = ${inside ? `${round(A0, 3)} + ${A1}(${round(f, 4)}) + ${round(A2, 3)}(${round(f, 4)})^2` : `${round(A0, 3)}/${f} + ${A1}/${f}^2 + ${round(A2, 3)}/${f}^3`} = ${round(val, 3)}$ V.`,
          trap: 'The $\\cos^2\\theta$ term contributes to both $l = 0$ and $l = 2$; treating it as pure $l = 2$ is the classic slip.' };
      },
      verify: (p) => (p.inside ? p.A0 + p.A1 * p.f + p.A2 * p.f * p.f : p.A0 / p.f + p.A1 / p.f ** 2 + p.A2 / p.f ** 3) },
    { id: 'bvp-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier coefficients',
      make(r) {
        const n = int(r, 1, 6), shape = choose(r, ['const', 'lin']);
        // const V0 on (0,a): c_n = 2V0(1 - (-1)^n)/(n pi). linear V0 x/a: c_n = 2V0(-1)^(n+1)/(n pi)
        let num, wrongs;
        if (shape === 'const') { num = n % 2 ? `\\dfrac{4V_0}{${n === 1 ? '' : n}\\pi}` : '0'; wrongs = n % 2 ? [`\\dfrac{2V_0}{${n === 1 ? '' : n}\\pi}`, '0', `\\dfrac{4V_0}{${n * n}\\pi^2}`] : [`\\dfrac{4V_0}{${n}\\pi}`, `\\dfrac{2V_0}{${n}\\pi}`, `-\\dfrac{4V_0}{${n}\\pi}`]; }
        else { const s = n % 2 ? '' : '-'; num = `${s}\\dfrac{2V_0}{${n === 1 ? '' : n}\\pi}`; wrongs = [`${s ? '' : '-'}\\dfrac{2V_0}{${n === 1 ? '' : n}\\pi}`, `\\dfrac{4V_0}{${n === 1 ? '' : n}\\pi}`, '0']; }
        const o = mcqOptions(r, num, wrongs, (v) => `$${v}$`);
        return { q: `The potential on one edge of a grounded rectangular region is ${shape === 'const' ? 'a constant $V_0$' : '$V_0x/a$'} for $0 < x < a$. Expanding it as $\\sum_nc_n\\sin(n\\pi x/a)$, the coefficient $c_${n}$ is`, ...o,
          sol: `$c_n = \\dfrac2a\\displaystyle\\int_0^aV(x)\\sin\\dfrac{n\\pi x}{a}dx$. ${shape === 'const' ? 'For a constant: $c_n = \\dfrac{2V_0}{n\\pi}(1 - \\cos n\\pi)$, i.e. $4V_0/n\\pi$ for odd $n$ and 0 for even $n$.' : 'For $V_0x/a$, integrating by parts: $c_n = \\dfrac{2V_0}{n\\pi}(-1)^{n+1}$.'} For $n = ${n}$: $${num}$.`,
          trap: 'Watch the parity: a constant has only odd harmonics; a ramp has all harmonics with alternating signs.' };
      } },
    ...more,
    ...r4.gens,
  ],
};
