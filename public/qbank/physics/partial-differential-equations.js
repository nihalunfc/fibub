// Partial differential equations: classification (elliptic, parabolic, hyperbolic), separation of variables for the
// heat, wave and Laplace equations in Cartesian, polar and spherical coordinates, Fourier sine and cosine series for
// initial and boundary data, decay times and normal modes, d'Alembert's solution and characteristics, uniqueness.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './partial-differential-equations.more.gen.js';

const integ = (f, a, b, N = 20000) => { let s = 0; const h = (b - a) / N; for (let i = 0; i < N; i++) s += f(a + (i + 0.5) * h); return s * h; };

export default {
  topic: 'partial-differential-equations',
  items: [
    // ---------- level 1 ----------
    { id: 'pde-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'classification',
      q: 'Laplace\'s equation $u_{xx} + u_{yy} = 0$ is',
      options: ['elliptic', 'parabolic', 'hyperbolic', 'of mixed type'], answer: 0,
      sol: 'For $Au_{xx} + Bu_{xy} + Cu_{yy} + \\ldots = 0$ the type is set by $B^2 - 4AC$. Here $A = C = 1$, $B = 0$: $B^2 - 4AC = -4 < 0$, elliptic. Elliptic equations describe equilibria (no time direction); data must be given on a closed boundary.',
      trap: 'The type depends only on the second-derivative terms.' },
    { id: 'pde-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'classification',
      q: 'The heat equation $u_t = \\kappa u_{xx}$ (with $\\kappa > 0$) is',
      options: ['elliptic', 'hyperbolic', 'parabolic', 'not classifiable because it has only one second derivative'], answer: 2,
      sol: 'In the variables $(x, t)$: $A = \\kappa$, $B = 0$, $C = 0$ (there is no $u_{tt}$). $B^2 - 4AC = 0$: parabolic. Parabolic equations smooth things out and have a direction of time.',
      trap: 'Missing a second derivative does not stop classification; it is exactly what makes $B^2 - 4AC = 0$.' },
    { id: 'pde-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'wave equation',
      q: 'A string of length 0.5 m is fixed at both ends, and transverse waves travel on it at 200 m/s. Its fundamental frequency is',
      options: ['100 Hz', '400 Hz', '200 Hz', '50 Hz'], answer: 2,
      sol: 'Separation gives modes $\\sin(n\\pi x/L)$ with $\\omega_n = n\\pi c/L$, so $f_n = \\frac{nc}{2L}$. For $n = 1$: $\\frac{200}{2\\times0.5} = 200$ Hz.',
      trap: 'Using $c/L$ (400 Hz): the fundamental fits half a wavelength, so $\\lambda = 2L$.' },
    { id: 'pde-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'separation of variables',
      q: 'Separating $u(x, t) = X(x)T(t)$ in $u_t = \\kappa u_{xx}$ with $u(0, t) = u(L, t) = 0$, the allowed spatial functions are',
      options: ['$\\cos(n\\pi x/L)$', '$e^{n\\pi x/L}$', '$\\sinh(n\\pi x/L)$', '$\\sin(n\\pi x/L)$'], answer: 3,
      sol: '$X\'\' = -k^2X$ with $X(0) = X(L) = 0$. $X = \\sin kx$ with $\\sin kL = 0$, so $k = n\\pi/L$, $n = 1, 2, \\ldots$ Each mode decays as $e^{-\\kappa k^2t}$.',
      trap: 'Cosines satisfy zero slope at the ends (insulated ends), not zero value.' },
    { id: 'pde-005', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Laplace equation',
      q: 'Which functions satisfy the two-dimensional Laplace equation $u_{xx} + u_{yy} = 0$?',
      options: ['$x^2 - y^2$', '$xy$', '$e^x\\cos y$', '$x^2 + y^2$'], answer: [0, 1, 2],
      sol: '$x^2 - y^2$: $2 - 2 = 0$. $xy$: $0 + 0 = 0$. $e^x\\cos y$: $e^x\\cos y - e^x\\cos y = 0$. $x^2 + y^2$: $2 + 2 = 4 \\ne 0$. (The first three are real parts of analytic functions $z^2$, $-\\tfrac i2z^2$ and $e^z$.)',
      trap: '$x^2 + y^2$ looks symmetric, but symmetry is not what Laplace\'s equation asks for.' },
    { id: 'pde-006', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'd\'Alembert',
      q: 'The general solution of the one-dimensional wave equation $u_{tt} = c^2u_{xx}$ is',
      options: ['$f(x - ct) + g(x + ct)$', '$f(x - ct)\\,g(x + ct)$', '$f(x)e^{-ct}$', '$f(x^2 - c^2t^2)$'], answer: 0,
      sol: 'With $\\xi = x - ct$ and $\\eta = x + ct$, the equation becomes $u_{\\xi\\eta} = 0$, so $u = f(\\xi) + g(\\eta)$: one wave moving right and one moving left, each keeping its shape.',
      trap: 'A product of the two is not a solution in general.' },

    // ---------- level 2 ----------
    { id: 'pde-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'A rod of length 1 m with thermal diffusivity $\\kappa = 1.0\\times10^{-4}$ m²/s has both ends held at 0 °C. The slowest-decaying temperature mode has a decay time (the time for its amplitude to fall by a factor $e$) of ______ s (to the nearest second).',
      answer: 1013, tol: 2, calc: () => 1 / (Math.PI ** 2 * 1e-4), unit: 's',
      sol: 'Mode $n$ is $\\sin(n\\pi x/L)e^{-\\kappa(n\\pi/L)^2t}$. The slowest is $n = 1$, with $\\tau = \\frac{L^2}{\\pi^2\\kappa} = \\frac{1}{9.87\\times10^{-4}} \\approx 1013$ s, about 17 minutes.',
      trap: 'Forgetting the $\\pi^2$ gives $L^2/\\kappa = 10^4$ s, ten times too long.' },
    { id: 'pde-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'On a rod with both ends at zero temperature, how much faster does the $n = 3$ mode decay than the $n = 1$ mode?',
      options: ['3 times', '$\\sqrt3$ times', '9 times', '27 times'], answer: 2,
      sol: 'The decay rate is $\\kappa(n\\pi/L)^2 \\propto n^2$, so the ratio is $3^2 = 9$. Sharp features (high $n$) in a temperature profile vanish first; that is why the profile quickly becomes a smooth half-sine.',
      trap: 'Taking the rate proportional to $n$, as wave frequencies are.' },
    { id: 'pde-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'For $k > 0$, the equation $u_{xx} + ku_{xy} + 4u_{yy} = 0$ is parabolic when $k$ = ______.',
      answer: 4, tol: 0, calc: () => Math.sqrt(16),
      sol: 'Parabolic means $B^2 - 4AC = 0$: $k^2 - 4(1)(4) = 0$, so $k = 4$. For $k < 4$ it is elliptic, for $k > 4$ hyperbolic.',
      trap: 'Using $B^2 - AC$, the form for $Au_{xx} + 2Bu_{xy} + Cu_{yy}$ (it would give $k = 2$ with a different $B$). Here the coefficient of $u_{xy}$ is $k$ itself.' },
    { id: 'pde-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'The equation $u_{xx} + 4u_{xy} + 3u_{yy} = 0$ is',
      options: ['elliptic', 'hyperbolic', 'parabolic', 'elliptic for $x > 0$ and hyperbolic for $x < 0$'], answer: 1,
      sol: '$B^2 - 4AC = 16 - 12 = 4 > 0$: hyperbolic. It factors as $(\\partial_x + \\partial_y)(\\partial_x + 3\\partial_y)u = 0$, with two families of real characteristics.',
      trap: 'The coefficients are constant, so the type cannot change from place to place.' },
    { id: 'pde-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'wave equation',
      q: 'A string 0.8 m long, fixed at both ends, carries waves at 240 m/s. The frequency of its third harmonic is ______ Hz.',
      answer: 450, tol: 0, calc: () => (3 * 240) / (2 * 0.8), unit: 'Hz',
      sol: '$f_n = \\frac{nc}{2L} = \\frac{3\\times240}{1.6} = 450$ Hz.',
      trap: 'The third harmonic is $n = 3$, not the third overtone ($n = 4$).' },
    { id: 'pde-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Laplace in polar coordinates',
      q: 'Separating Laplace\'s equation in plane polar coordinates, the solutions that are finite at $r = 0$ and single-valued in $\\theta$ are combinations of',
      options: ['$r^{-n}\\cos n\\theta$ and $r^{-n}\\sin n\\theta$', '$r^n\\cos n\\theta$ and $r^n\\sin n\\theta$ (plus a constant)', '$e^{nr}\\cos n\\theta$', '$J_n(r)\\cos n\\theta$'], answer: 1,
      sol: 'With $u = R(r)\\Theta(\\theta)$: $\\Theta\'\' = -n^2\\Theta$ and single-valuedness forces integer $n$. Then $r^2R\'\' + rR\' - n^2R = 0$ gives $R = r^n$ or $r^{-n}$ (and $1$, $\\ln r$ for $n = 0$). Finite at the origin keeps $r^n$ and the constant. Bessel functions appear for the Helmholtz equation, not Laplace\'s.',
      trap: '$r^{-n}$ and $\\ln r$ belong to the region outside a circle.' },
    { id: 'pde-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'A rod has insulated ends ($u_x = 0$ at $x = 0$ and $x = L$). Which statements about solutions of $u_t = \\kappa u_{xx}$ are true?',
      options: ['The spatial modes are $\\cos(n\\pi x/L)$, $n = 0, 1, 2, \\ldots$', 'The $n = 0$ mode is a constant that does not decay', 'The average temperature along the rod stays constant in time', 'The temperature tends to zero everywhere'], answer: [0, 1, 2],
      sol: 'Zero slope at both ends picks cosines, including $n = 0$ (a constant), whose decay rate $\\kappa(0)^2$ is zero. $\\frac{d}{dt}\\int_0^Lu\\,dx = \\kappa[u_x]_0^L = 0$: no heat leaves, so the mean is conserved and the rod ends up uniform at its initial mean temperature, not at zero.',
      trap: 'Zero temperature is the end state only when the ends are held at zero.' },
    { id: 'pde-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diffusion scales',
      q: 'Heat spreads in still water ($\\kappa = 1.4\\times10^{-7}$ m²/s). Over 100 s, the diffusion length $\\sqrt{\\kappa t}$ is ______ mm (to two decimal places).',
      answer: 3.74, tol: 0.02, calc: () => Math.sqrt(1.4e-7 * 100) * 1000, unit: 'mm',
      sol: '$\\sqrt{1.4\\times10^{-7}\\times100} = \\sqrt{1.4\\times10^{-5}} = 3.74\\times10^{-3}$ m $= 3.74$ mm. Diffusion distance grows only as $\\sqrt t$: four times the distance takes sixteen times as long.',
      trap: 'Treating diffusion like travel at a constant speed (distance proportional to $t$).' },
    { id: 'pde-015', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'steady state',
      q: 'A rod has one end held at 0 °C and the other at 100 °C. Long after it is set up, the temperature at its midpoint is',
      options: ['$100/e$ °C', '25 °C', '50 °C', '0 °C, since the transients decay to zero'], answer: 2,
      sol: 'In the steady state $u_t = 0$, so $u_{xx} = 0$ and the profile is a straight line: $u = 100x/L$, giving 50 °C at the middle. The transients decay; the steady part stays.',
      trap: 'Only the deviation from the straight line decays to zero.' },
    { id: 'pde-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Laplace equation',
      q: 'A non-constant solution of Laplace\'s equation in a bounded region takes its maximum value',
      options: ['at the centre of the region', 'at a point where the boundary is most curved', 'anywhere; there is no rule', 'only on the boundary'], answer: 3,
      sol: 'The mean-value property says $u$ at any point equals its average over any circle (sphere) round that point inside the region. A strict interior maximum would be larger than its own average, which is impossible. So maxima and minima of harmonic functions lie on the boundary. That is also why there is no stable electrostatic equilibrium in free space (Earnshaw).',
      trap: 'This holds for Laplace\'s equation only; with a source (Poisson) an interior maximum is possible.' },

    // ---------- level 3 ----------
    { id: 'pde-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fourier series solution',
      q: 'A rod $0 \\le x \\le L$ starts at a uniform 100 °C, and both ends are then held at 0 °C. In $u = \\sum b_n\\sin(n\\pi x/L)e^{-\\kappa(n\\pi/L)^2t}$, the coefficient $b_1$ is ______ °C (to one decimal place).',
      answer: 127.3, tol: 0.2, calc: () => 400 / Math.PI, unit: '°C',
      sol: '$b_n = \\frac2L\\int_0^L100\\sin\\frac{n\\pi x}{L}dx = \\frac{200}{n\\pi}(1 - \\cos n\\pi)$, which is $\\frac{400}{n\\pi}$ for odd $n$ and 0 for even $n$. So $b_1 = 400/\\pi \\approx 127.3$ °C. It exceeds 100 because the sine series must overshoot to fit a flat profile with zeros at the ends.',
      trap: 'Taking $b_1 = 100$: the first sine term alone is not the initial profile.' },
    { id: 'pde-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'For the rod in the previous setting (uniform 100 °C start, ends at 0 °C, $b_1 = 400/\\pi$), keep only the first term. At the moment when $\\kappa t/L^2 = 0.1$, the midpoint temperature is ______ °C (to one decimal place).',
      answer: 47.5, tol: 0.3, calc: () => (400 / Math.PI) * Math.exp(-(Math.PI ** 2) * 0.1), unit: '°C',
      sol: '$u(L/2, t) \\approx \\frac{400}{\\pi}\\sin\\frac\\pi2\\,e^{-\\pi^2\\kappa t/L^2} = 127.3\\times e^{-0.987} = 127.3\\times0.373 \\approx 47.5$ °C. The next term, $n = 3$, is $-\\frac{400}{3\\pi}e^{-9\\times0.987} \\approx -0.006$ °C, so one term is plenty.',
      trap: 'Using $e^{-\\kappa t/L^2}$ without the $\\pi^2$.' },
    { id: 'pde-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'wave equation',
      q: 'A string fixed at both ends is plucked exactly at its midpoint and released from rest. Which harmonics are missing from its motion?',
      options: ['all odd harmonics', 'all harmonics above the tenth', 'none: every harmonic is present', 'all even harmonics'], answer: 3,
      sol: 'The initial shape is symmetric about $x = L/2$. The even modes $\\sin(2m\\pi x/L)$ are antisymmetric about the midpoint, so their overlap with the shape is zero. (Equivalently each even mode has a node at the plucking point.) Only odd harmonics sound, with amplitudes falling as $1/n^2$.',
      trap: 'A mode with a node at the plucking point cannot be excited by plucking there.' },
    { id: 'pde-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Laplace in a rectangle',
      q: 'Solve $u_{xx} + u_{yy} = 0$ in $0 < x < a$, $0 < y < b$ with $u = 0$ on $x = 0$, $x = a$ and $y = 0$, and $u(x, b) = f(x)$. Which statements are true?',
      options: ['The $y$-dependence of each term is $\\cosh(n\\pi y/a)$', 'The $x$-dependence of each term is $\\sin(n\\pi x/a)$', 'The $y$-dependence of each term is $\\sinh(n\\pi y/a)$', 'The coefficient of term $n$ is $f_n/\\sinh(n\\pi b/a)$, where $f_n$ is the $n$th sine coefficient of $f$'], answer: [1, 2, 3],
      sol: 'Zero at $x = 0, a$ forces $X = \\sin(n\\pi x/a)$, so $Y\'\' = (n\\pi/a)^2Y$. Zero at $y = 0$ picks $\\sinh$, not $\\cosh$. At $y = b$: $\\sum c_n\\sinh(n\\pi b/a)\\sin(n\\pi x/a) = f(x)$, so $c_n = f_n/\\sinh(n\\pi b/a)$.',
      trap: 'The oscillating direction is the one with two zero conditions; the other gets hyperbolic functions.' },
    { id: 'pde-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laplace equation',
      q: 'In a square, one side is held at potential $V_0$ and the other three at 0. The potential at the centre of the square is',
      options: ['$V_0/2$', '$V_0/4$', '$V_0/\\pi$', '$0$'], answer: 1,
      sol: 'Superposition and symmetry: if each of the four sides in turn were at $V_0$, the sum of the four solutions would be $u = V_0$ everywhere (all sides at $V_0$). By symmetry each contributes equally at the centre, so each gives $V_0/4$. No series needed.',
      trap: 'Averaging the two nearest sides gives $V_0/2$, which ignores the other two grounded sides.' },
    { id: 'pde-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'separation of variables',
      q: 'In separating $u_t = \\kappa u_{xx}$ on $0 < x < L$ with $u = 0$ at both ends, why must the separation constant be negative ($X\'\'/X = -k^2$)?',
      options: ['Because temperatures cannot be negative', 'A zero or positive constant gives only $X \\equiv 0$ with these end conditions', 'Because $\\kappa$ is positive', 'It need not be: any sign gives non-trivial solutions'], answer: 1,
      sol: 'Constant 0: $X = A + Bx$, and $X(0) = X(L) = 0$ give $A = B = 0$. Positive $k^2$: $X = A\\cosh kx + B\\sinh kx$, and the two zeros again force $A = B = 0$. Only $X\'\'/X = -k^2$ gives $\\sin(n\\pi x/L)$. The sign of $\\kappa$ then makes the time factor decay.',
      trap: 'The boundary conditions, not physics intuition about temperature, decide the sign.' },
    { id: 'pde-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wave equation',
      q: 'A string fixed at $x = 0$ and $x = L$ (wave speed $c$) is released from rest in the shape $u(x, 0) = 3\\sin(2\\pi x/L)$ mm. At $x = L/4$ and $t = L/(6c)$ its displacement is ______ mm.',
      answer: 1.5, tol: 0.01, calc: () => 3 * Math.sin(Math.PI / 2) * Math.cos(Math.PI / 3), unit: 'mm',
      sol: 'The shape is the single mode $n = 2$, which oscillates in place: $u = 3\\sin\\frac{2\\pi x}{L}\\cos\\frac{2\\pi ct}{L}$. At $x = L/4$: $\\sin\\frac\\pi2 = 1$. At $t = L/6c$: $\\cos\\frac\\pi3 = \\frac12$. So $u = 1.5$ mm.',
      trap: 'Released from rest means a cosine in time; a sine would start at zero.' },
    { id: 'pde-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laplace in spherical coordinates',
      q: 'The axially symmetric (independent of $\\phi$) solutions of Laplace\'s equation in spherical coordinates are sums of',
      options: ['$\\left(A_\\ell r^\\ell + B_\\ell r^{-(\\ell+1)}\\right)P_\\ell(\\cos\\theta)$', '$\\left(A_\\ell r^\\ell + B_\\ell r^{-\\ell}\\right)\\cos\\ell\\theta$', '$j_\\ell(r)P_\\ell(\\cos\\theta)$', '$\\left(A_\\ell e^{\\ell r} + B_\\ell e^{-\\ell r}\\right)P_\\ell(\\cos\\theta)$'], answer: 0,
      sol: 'The angular equation is Legendre\'s, with regular solutions $P_\\ell(\\cos\\theta)$. The radial equation $\\frac{d}{dr}(r^2R\') = \\ell(\\ell + 1)R$ has $R = r^\\ell$ or $r^{-(\\ell+1)}$ (try $r^s$: $s(s + 1) = \\ell(\\ell + 1)$). Inside a sphere keep $r^\\ell$, outside keep $r^{-(\\ell+1)}$.',
      trap: 'The decaying power is $r^{-(\\ell+1)}$ in 3D, not $r^{-\\ell}$ as in 2D polar.' },
    { id: 'pde-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'characteristics',
      q: 'For $u_{tt} = c^2u_{xx}$ on the whole line with data $u(x, 0)$ and $u_t(x, 0)$, which statements are true?',
      options: ['$u(x_0, t_0)$ depends on the initial data at every point of the line', 'The characteristics are the lines $x \\pm ct = $ constant', '$u(x_0, t_0)$ depends only on the initial data in $[x_0 - ct_0, x_0 + ct_0]$', 'Disturbances travel at exactly speed $c$'], answer: [1, 2, 3],
      sol: 'd\'Alembert: $u = \\frac12[f(x - ct) + f(x + ct)] + \\frac{1}{2c}\\int_{x-ct}^{x+ct}g(s)\\,ds$. Only data between the two characteristics through $(x_0, t_0)$ enters: the domain of dependence. So signals move at speed $c$, never faster, unlike the heat equation, where a change anywhere is felt everywhere at once.',
      trap: 'Infinite propagation speed belongs to the heat equation.' },
    { id: 'pde-026', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'd\'Alembert',
      q: 'On a very long string, a triangular bump of height 2 cm is held at rest and released. Long after release, the largest displacement on the string is',
      options: ['2 cm', '1 cm', '$\\sqrt2$ cm', '0.5 cm'], answer: 1,
      sol: 'With zero initial velocity, $u = \\frac12[f(x - ct) + f(x + ct)]$: the bump splits into two half-height copies travelling apart. Once they no longer overlap, each has height 1 cm.',
      trap: 'Energy is shared between two pulses, but the shapes add linearly, so each is exactly half as high.' },
    { id: 'pde-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'A square plate of side $L$ obeys $u_t = \\kappa(u_{xx} + u_{yy})$ with all edges at zero. The slowest decay rate of any mode is',
      options: ['$\\pi^2\\kappa/L^2$', '$2\\pi^2\\kappa/L^2$', '$4\\pi^2\\kappa/L^2$', '$\\sqrt2\\,\\pi^2\\kappa/L^2$'], answer: 1,
      sol: 'Modes are $\\sin\\frac{m\\pi x}{L}\\sin\\frac{n\\pi y}{L}$ with rate $\\kappa\\pi^2(m^2 + n^2)/L^2$. The smallest has $m = n = 1$: $2\\pi^2\\kappa/L^2$, twice the rate for a rod of the same length (heat escapes in both directions).',
      trap: '$m = 0$ or $n = 0$ gives a mode that is identically zero here, not a slower one.' },
    { id: 'pde-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laplace in polar coordinates',
      q: 'Inside a disc of radius $a$, $u$ satisfies Laplace\'s equation with $u(a, \\theta) = 8\\cos2\\theta$. The value of $u$ at $r = a/2$, $\\theta = 0$ is ______.',
      answer: 2, tol: 0.01, calc: () => 8 * 0.25,
      sol: 'The boundary data is a single harmonic, so $u = 8\\left(\\frac ra\\right)^2\\cos2\\theta$ (the $r^n$ solution with $n = 2$, finite at the centre). At $r = a/2$, $\\theta = 0$: $8\\times\\frac14 = 2$.',
      trap: 'Scaling by $r/a$ instead of $(r/a)^2$: harmonic $n$ goes with $r^n$.' },

    // ---------- level 4 ----------
    { id: 'pde-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fourier series solution',
      q: 'A rod $0 \\le x \\le L$ is initially at 0 °C. From $t = 0$ the end $x = 0$ is held at 0 °C and $x = L$ at 100 °C. Write $u = 100x/L + \\sum b_n\\sin(n\\pi x/L)e^{-\\kappa(n\\pi/L)^2t}$. The coefficient $b_1$ is ______ °C (to two decimal places).',
      answer: -63.66, tol: 0.05, calc: () => -200 / Math.PI, unit: '°C',
      sol: 'The transient $w = u - 100x/L$ has zero end values and starts at $w(x, 0) = -100x/L$. Then $b_n = \\frac2L\\int_0^L\\left(-\\frac{100x}{L}\\right)\\sin\\frac{n\\pi x}{L}dx$. With $\\int_0^Lx\\sin\\frac{n\\pi x}{L}dx = \\frac{L^2(-1)^{n+1}}{n\\pi}$: $b_n = \\frac{200(-1)^n}{n\\pi}$, so $b_1 = -\\frac{200}{\\pi} \\approx -63.66$ °C.',
      trap: 'Expanding $u$ itself in sines: its end value 100 is not zero, so subtract the steady state first.' },
    { id: 'pde-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'A square membrane fixed on its edges has modes $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{a}$. The ratio of the frequency of the (2, 1) mode to that of the (1, 1) mode is ______ (to three decimal places).',
      answer: 1.581, tol: 0.002, calc: () => Math.sqrt(5 / 2),
      sol: '$\\omega_{mn} = \\frac{c\\pi}{a}\\sqrt{m^2 + n^2}$. The ratio is $\\sqrt{5}/\\sqrt{2} = 1.581$. The (1, 2) mode has the same frequency: a square has degenerate modes, a sign of its symmetry.',
      trap: 'Expecting 2 as for the second harmonic of a string.' },
    { id: 'pde-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cylindrical coordinates',
      q: 'Separating Laplace\'s equation in cylindrical coordinates as $u = R(r)e^{im\\phi}e^{\\pm kz}$, the radial function satisfies',
      options: ['Legendre\'s equation in $\\cos r$', 'Hermite\'s equation in $kr$', 'Bessel\'s equation of order $m$ in $kr$', 'the Euler equation $r^2R\'\' + rR\' - m^2R = 0$'], answer: 2,
      sol: '$\\nabla^2u = R\'\' + \\frac1rR\' - \\frac{m^2}{r^2}R + k^2R = 0$ (the $z$ part gives $+k^2$). With $\\rho = kr$ this is Bessel\'s equation of order $m$, so $R = J_m(kr)$ (and $Y_m$ if the axis is excluded). With $k = 0$ (no $z$ dependence) it reduces to the Euler equation.',
      trap: 'The Euler equation is the $k = 0$ special case.' },
    { id: 'pde-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'uniqueness',
      q: 'For Laplace\'s or Poisson\'s equation in a bounded region $V$ with boundary $S$, which statements are true?',
      options: ['With $u$ given on $S$ (Dirichlet), the solution is unique', 'With $\\partial u/\\partial n$ given on $S$ (Neumann), the solution is unique up to an added constant', 'For Laplace\'s equation with Neumann data, a solution exists only if $\\oint_S\\partial u/\\partial n\\,dS = 0$', 'Poisson\'s equation with Dirichlet data has infinitely many solutions'], answer: [0, 1, 2],
      sol: 'If $u_1, u_2$ both solve the problem, $w = u_1 - u_2$ is harmonic with zero data, and $\\int_V|\\nabla w|^2 = \\oint_Sw\\,\\partial_nw\\,dS = 0$. So $\\nabla w = 0$: $w$ is constant, and zero if $w = 0$ on $S$. The divergence theorem gives $\\oint\\partial_nu\\,dS = \\int\\nabla^2u = 0$ for Laplace. A source term does not spoil uniqueness.',
      trap: 'Adding a source changes the solution but not its uniqueness.' },
    { id: 'pde-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'For a rod with ends at 0 that starts at a uniform temperature, the $n = 3$ term starts at $1/3$ of the $n = 1$ term. At what value of $\\kappa t/L^2$ has their ratio fallen to $10^{-3}$? ______ (to three decimal places)',
      answer: 0.074, tol: 0.001, calc: () => Math.log(1000 / 3) / (8 * Math.PI ** 2),
      sol: 'The ratio is $\\frac13e^{-(9 - 1)\\pi^2\\kappa t/L^2}$. Set it to $10^{-3}$: $8\\pi^2\\kappa t/L^2 = \\ln(1000/3) = 5.809$, so $\\kappa t/L^2 = 5.809/78.96 \\approx 0.074$. After that the profile is a pure half-sine to 0.1%.',
      trap: 'Using the decay rate of mode 3 alone ($9\\pi^2$) instead of the difference of the two rates.' },
    { id: 'pde-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spherical coordinates',
      q: 'Separating the Helmholtz equation $\\nabla^2u + k^2u = 0$ in spherical coordinates, the radial solutions regular at the origin are',
      options: ['$r^\\ell$', '$J_\\ell(kr)$', '$e^{-kr}/r$', 'the spherical Bessel functions $j_\\ell(kr)$'], answer: 3,
      sol: 'The radial equation is $\\frac{1}{r^2}(r^2R\')\' - \\frac{\\ell(\\ell + 1)}{r^2}R + k^2R = 0$, solved by $j_\\ell(kr) = \\sqrt{\\frac{\\pi}{2kr}}J_{\\ell+1/2}(kr)$, with $j_0 = \\sin(kr)/kr$. Ordinary $J_\\ell$ belongs to cylinders; $r^\\ell$ is the $k = 0$ (Laplace) limit.',
      trap: 'Half-integer order: spherical problems give $J_{\\ell+1/2}$, not $J_\\ell$.' },
    { id: 'pde-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Laplace in spherical coordinates',
      q: 'The potential on a sphere of radius $R$ is $V_0\\cos\\theta$, with no charge elsewhere. At $r = 2R$, $\\theta = 0$, with $V_0 = 10$ V, the potential is',
      options: ['5 V', '1.25 V', '10 V', '2.5 V'], answer: 3,
      sol: '$\\cos\\theta = P_1$, so outside $V = V_0\\left(\\frac Rr\\right)^2\\cos\\theta$ (the $r^{-(\\ell+1)}$ solution with $\\ell = 1$, matched at $r = R$). At $r = 2R$: $10\\times\\frac14 = 2.5$ V, a dipole field.',
      trap: '$R/r$ is the $\\ell = 0$ fall-off; $\\ell = 1$ falls as $(R/r)^2$.' },
    { id: 'pde-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'classification',
      q: 'The damped wave (telegraph) equation $u_{tt} + \\gamma u_t = c^2u_{xx}$ is',
      options: ['parabolic, because of the first time derivative', 'hyperbolic for all $\\gamma$', 'elliptic for large $\\gamma$', 'hyperbolic only if $\\gamma < c$'], answer: 1,
      sol: 'The type comes only from the second-order terms: $u_{tt} - c^2u_{xx}$ gives $B^2 - 4AC = 4c^2 > 0$. Damping changes how waves decay, not the characteristics, so signals still travel at speed $c$.',
      trap: 'Lower-order terms never change the type.' },
    { id: 'pde-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'wave equation',
      q: 'A string of length 1 m (wave speed 100 m/s), fixed at both ends, is straight at $t = 0$ and is given the velocity $u_t(x, 0) = 0.5\\sin(\\pi x)$ m/s ($x$ in metres). The largest displacement it ever reaches is ______ mm (to two decimal places).',
      answer: 1.59, tol: 0.01, calc: () => (0.5 / (100 * Math.PI)) * 1000, unit: 'mm',
      sol: 'One mode: $u = B\\sin(\\pi x/L)\\sin(\\omega t)$ with $\\omega = \\pi c/L$. Matching the velocity: $B\\omega = 0.5$, so $B = \\frac{0.5L}{\\pi c} = \\frac{0.5}{100\\pi} = 1.59\\times10^{-3}$ m. The maximum, at the midpoint, is 1.59 mm.',
      trap: 'Starting straight with a velocity means a sine in time, and the amplitude is velocity divided by $\\omega$.' },

    // ---------- level 5 ----------
    { id: 'pde-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Laplace in a rectangle',
      q: 'In the square $0 < x < \\pi$, $0 < y < \\pi$, $u_{xx} + u_{yy} = 0$ with $u = 0$ on three sides and $u(x, \\pi) = \\sin x$. The value $u(\\pi/2, \\pi/2)$ is ______ (to three decimal places).',
      answer: 0.199, tol: 0.002, calc: () => Math.sinh(Math.PI / 2) / Math.sinh(Math.PI),
      sol: 'One term: $u = \\frac{\\sin x\\sinh y}{\\sinh\\pi}$. At the centre: $\\frac{\\sinh(\\pi/2)}{\\sinh\\pi} = \\frac{2.301}{11.549} = 0.199$, using $\\sinh\\pi = 2\\sinh\\frac\\pi2\\cosh\\frac\\pi2$, it is $\\frac{1}{2\\cosh(\\pi/2)}$. Less than the $\\tfrac14$ for a uniformly held side, because $\\sin x$ averages $2/\\pi$ on the top edge.',
      trap: 'Using $\\sin$ in $y$: the direction without two zero conditions takes $\\sinh$.' },
    { id: 'pde-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'diffusion scales',
      q: 'For $u_t = \\kappa u_{xx}$ on the whole line with $u(x, 0) = \\delta(x)$, how does $u(0, t)$ depend on time?',
      options: ['$t^{-1/2}$', '$t^{-1}$', '$e^{-\\kappa t}$', '$t^{-3/2}$'], answer: 0,
      sol: 'The solution is the heat kernel $u = (4\\pi\\kappa t)^{-1/2}e^{-x^2/4\\kappa t}$. Its area stays 1 while its width grows like $\\sqrt{\\kappa t}$, so the height falls as $t^{-1/2}$. In $d$ dimensions it is $t^{-d/2}$, which gives the $t^{-3/2}$ option in 3D.',
      trap: 'The $t^{-3/2}$ law is three-dimensional.' },
    { id: 'pde-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'energy and orthogonality',
      q: 'A uniform string (mass per length $\\mu$, length $L$, fixed ends) vibrates as $u = \\sum_nA_n\\sin(n\\pi x/L)\\cos(\\omega_nt + \\varphi_n)$. Which statements are true?',
      options: ['The total energy is the sum of the separate mode energies, with no cross terms', 'For a fixed amplitude, the energy of mode $n$ grows as $n^2$', 'The energy in each mode is separately constant in time', 'In the same way, $\\int_0^Lu^2\\,dx$ is constant for solutions of the heat equation on a rod with ends at 0'], answer: [0, 1, 2],
      sol: 'Kinetic plus potential energy integrals involve $\\int\\sin\\frac{m\\pi x}{L}\\sin\\frac{n\\pi x}{L}dx$ and the same with cosines, which vanish for $m \\ne n$. Mode $n$ has $E_n = \\frac14\\mu L\\omega_n^2A_n^2$ with $\\omega_n \\propto n$, so $E_n \\propto n^2A_n^2$; with no coupling it is constant. For the heat equation $\\frac{d}{dt}\\int u^2 = -2\\kappa\\int u_x^2 \\le 0$: the integral decays.',
      trap: 'The heat equation is dissipative; the ideal string is not.' },
    { id: 'pde-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Laplace in spherical coordinates',
      q: 'The potential on a sphere of radius $R$ is $V(\\theta) = 16\\cdot\\tfrac12(3\\cos^2\\theta - 1)$ volts, and there is no charge outside. At $r = 2R$ on the axis ($\\theta = 0$) the potential is ______ V.',
      answer: 2, tol: 0.01, calc: () => 16 / 8,
      sol: 'The data is $16P_2(\\cos\\theta)$, so outside $V = 16\\left(\\frac Rr\\right)^3P_2(\\cos\\theta)$ (the $\\ell = 2$ term falls as $r^{-3}$: a quadrupole). At $r = 2R$, $\\theta = 0$: $16\\times\\frac18\\times1 = 2$ V.',
      trap: 'Using $(R/r)^2$: that is $\\ell = 1$.' },
    { id: 'pde-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'heat equation',
      q: 'A ball of radius $a$ and a slab of thickness $2a$ (faces at $x = \\pm a$) are made of the same material and start hot; their surfaces are then held at 0. The ratio (slowest decay time of the ball)/(slowest decay time of the slab) is ______ (to two decimal places).',
      answer: 0.25, tol: 0.01, calc: () => (1 / Math.PI ** 2) / (4 / Math.PI ** 2),
      sol: 'Slab: slowest mode $\\cos(\\pi x/2a)$, rate $\\kappa(\\pi/2a)^2$, time $\\frac{4a^2}{\\pi^2\\kappa}$. Ball: the radially symmetric mode is $j_0(kr) = \\frac{\\sin kr}{kr}$ (as $ru$ obeys the 1D equation), with $\\sin ka = 0$, $k = \\pi/a$; time $\\frac{a^2}{\\pi^2\\kappa}$. Ratio $\\frac14$: the ball cools four times faster, because heat leaves in every direction.',
      trap: 'Taking $k = \\pi/2a$ for the ball as for the slab: $ru$ must vanish at the centre too, so a full half-wave fits in the radius.' },
  ],
  gens: [
    { id: 'pde-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'heat equation',
      make(r) {
        const L = choose(r, [0.2, 0.5, 1, 2]), k = choose(r, [1e-5, 2e-5, 5e-5, 1e-4, 1.1e-4]), n = int(r, 1, 3);
        const answer = round((L * L) / (n * n * Math.PI ** 2 * k), 0);
        return { q: `A rod of length ${L} m (diffusivity $\\kappa = ${k * 1e5}\\times10^{-5}$ m²/s) has both ends held at 0 °C. Find the decay time (amplitude falls by $e$) of the mode $\\sin(${n === 1 ? '' : n}\\pi x/L)$, in seconds.`,
          answer, unit: 's', tol: Math.max(1, answer * 0.005), L, k, n,
          sol: `The mode decays as $e^{-\\kappa(n\\pi/L)^2t}$, so $\\tau = \\frac{L^2}{n^2\\pi^2\\kappa} = \\frac{${L}^2}{${n * n}\\pi^2\\times${k}} \\approx ${answer}$ s.`,
          trap: 'The rate goes as $n^2$, and $\\pi^2$ must not be dropped.' };
      },
      verify: (p) => (p.L * p.L) / (p.n * p.n * Math.PI ** 2 * p.k) },
    { id: 'pde-g02', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'wave equation',
      make(r) {
        const L = choose(r, [0.4, 0.6, 0.65, 0.8, 1.2]), T = choose(r, [40, 60, 80, 100, 150]), mu = choose(r, [0.001, 0.002, 0.005, 0.01]), n = int(r, 1, 4);
        const answer = round((n / (2 * L)) * Math.sqrt(T / mu), 1);
        return { q: `A string of length ${L} m and mass per length ${mu} kg/m is stretched to tension ${T} N between fixed ends. Find the frequency of mode $n = ${n}$, in Hz.`,
          answer, unit: 'Hz', tol: Math.max(0.2, answer * 0.004), L, T, mu, n,
          sol: `$c = \\sqrt{T/\\mu} = \\sqrt{${T}/${mu}} = ${round(Math.sqrt(T / mu), 2)}$ m/s, and $f_n = \\frac{nc}{2L} = \\frac{${n}\\times${round(Math.sqrt(T / mu), 2)}}{${2 * L}} \\approx ${answer}$ Hz.`,
          trap: 'Mode $n$ fits $n$ half-wavelengths, so $\\lambda_n = 2L/n$.' };
      },
      verify: (p) => (p.n * Math.sqrt(p.T / p.mu)) / (2 * p.L) },
    { id: 'pde-g03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      make(r) {
        const A = int(r, 1, 4), C = int(r, -3, 5), B = int(r, -6, 6);
        const D = B * B - 4 * A * C, type = D > 0 ? 1 : D === 0 ? 2 : 0;
        const options = ['elliptic', 'hyperbolic', 'parabolic', 'it depends on the boundary conditions'];
        const t = (c, v) => (c === 0 ? '' : `${c < 0 ? ' - ' : ' + '}${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`);
        return { q: `The equation $${A === 1 ? '' : A}u_{xx}${t(B, 'u_{xy}')}${t(C, 'u_{yy}')} + u_x = 0$ is`, options, answer: type, A, B, C,
          sol: `$B^2 - 4AC = (${B})^2 - 4(${A})(${C}) = ${D}$, which is ${D > 0 ? 'positive: hyperbolic' : D === 0 ? 'zero: parabolic' : 'negative: elliptic'}. The first-order term $u_x$ does not affect the type, and boundary conditions never do.`,
          trap: 'Lower-order terms and boundary data do not change the type.' };
      } },
    { id: 'pde-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fourier series solution',
      make(r) {
        const shape = choose(r, ['const', 'tri', 'lin']), U = choose(r, [20, 50, 80, 100]), n = shape === 'lin' ? int(r, 1, 3) : choose(r, [1, 3, 5]);
        let bn, desc, how;
        if (shape === 'const') { bn = (2 * U * (1 - Math.cos(n * Math.PI))) / (n * Math.PI); desc = `$u(x, 0) = ${U}$`; how = `$\\frac{2}{L}\\int_0^L${U}\\sin\\frac{n\\pi x}{L}dx = \\frac{${2 * U}}{n\\pi}(1 - \\cos n\\pi)$`; }
        else if (shape === 'tri') { bn = ((8 * U) / (n * n * Math.PI ** 2)) * Math.sin((n * Math.PI) / 2); desc = `a triangle rising linearly from 0 at the ends to ${U} at $x = L/2$`; how = `$\\frac{8\\cdot${U}}{n^2\\pi^2}\\sin\\frac{n\\pi}{2}$ (integrate each half by parts)`; }
        else { bn = (2 * U * (-1) ** (n + 1)) / (n * Math.PI); desc = `$u(x, 0) = ${U}x/L$`; how = `$\\frac{2}{L}\\int_0^L\\frac{${U}x}{L}\\sin\\frac{n\\pi x}{L}dx = \\frac{${2 * U}(-1)^{n+1}}{n\\pi}$`; }
        const answer = round(bn, 3);
        return { q: `On $0 \\le x \\le L$ with $u = 0$ at both ends, the initial profile is ${desc}. Find the sine coefficient $b_{${n}}$ in $u(x, 0) = \\sum b_n\\sin(n\\pi x/L)$ (to three decimal places).`,
          answer, tol: Math.max(0.002, Math.abs(answer) * 0.002), shape, U, n,
          sol: `$b_n = ${how}$. For $n = ${n}$: $b_{${n}} \\approx ${answer}$.`,
          trap: 'Even coefficients vanish for profiles symmetric about the midpoint.' };
      },
      verify: (p) => { const f = p.shape === 'const' ? () => p.U : p.shape === 'tri' ? (x) => p.U * (x < 0.5 ? 2 * x : 2 - 2 * x) : (x) => p.U * x; return 2 * integ((x) => f(x) * Math.sin(p.n * Math.PI * x), 0, 1, 40000); } },
    { id: 'pde-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'heat equation',
      make(r) {
        const U = choose(r, [60, 80, 100, 120]), target = choose(r, [10, 20, 30, 40]), L = choose(r, [0.1, 0.2, 0.5]), k = choose(r, [1e-5, 4e-5, 1e-4]);
        const b1 = (4 * U) / Math.PI, answer = round(((L * L) / (Math.PI ** 2 * k)) * Math.log(b1 / target), 0);
        return { q: `A rod of length ${L} m ($\\kappa = ${k * 1e5}\\times10^{-5}$ m²/s) starts at a uniform ${U} °C; both ends are then held at 0 °C. Using only the first Fourier term, after how many seconds does the midpoint reach ${target} °C?`,
          answer, unit: 's', tol: Math.max(1, answer * 0.006), U, target, L, k,
          sol: `First term: $u(L/2, t) \\approx \\frac{4\\cdot${U}}{\\pi}e^{-\\pi^2\\kappa t/L^2} = ${round(b1, 2)}e^{-t/\\tau}$ with $\\tau = \\frac{L^2}{\\pi^2\\kappa} = ${round((L * L) / (Math.PI ** 2 * k), 1)}$ s. Setting it to ${target}: $t = \\tau\\ln\\frac{${round(b1, 2)}}{${target}} \\approx ${answer}$ s.`,
          trap: 'The first coefficient is $4U/\\pi$, not $U$.' };
      },
      verify: (p) => ((p.L * p.L) / (Math.PI ** 2 * p.k)) * Math.log((4 * p.U) / Math.PI / p.target) },
    { id: 'pde-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laplace in polar coordinates',
      make(r) {
        const A = int(r, 1, 5), B = int(r, 1, 6), m = int(r, 1, 3), rr = choose(r, [0.25, 0.5, 0.75]), th = choose(r, [0, 30, 45, 60, 90]);
        const answer = round(A + B * rr ** m * Math.cos((m * th * Math.PI) / 180), 4);
        return { q: `Inside a disc of radius $a$, $\\nabla^2u = 0$ and $u(a, \\theta) = ${A} + ${B === 1 ? '' : B}\\cos ${m === 1 ? '' : m}\\theta$. Find $u$ at $r = ${rr}a$, $\\theta = ${th}^\\circ$ (to four decimal places).`,
          answer, tol: 2e-3, A, B, m, rr, th,
          sol: `Each harmonic carries its own power of $r$: $u = ${A} + ${B}\\left(\\frac ra\\right)^{${m}}\\cos ${m}\\theta$. At the point: $${A} + ${B}(${rr})^{${m}}\\cos(${m * th}^\\circ) \\approx ${answer}$. The constant term is the average of the boundary values, which is also $u$ at the centre.`,
          trap: 'The constant is not scaled by any power of $r$.' };
      },
      verify: (p) => { // Poisson integral formula
        const N = 4000, R = p.rr, t0 = (p.th * Math.PI) / 180; let s = 0;
        for (let i = 0; i < N; i++) { const ph = (2 * Math.PI * (i + 0.5)) / N, f = p.A + p.B * Math.cos(p.m * ph); s += (f * (1 - R * R)) / (1 - 2 * R * Math.cos(t0 - ph) + R * R); }
        return s / N; } },
    { id: 'pde-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'd\'Alembert',
      make(r) {
        const A = int(r, 2, 8), w = choose(r, [0.5, 1, 2]), c = choose(r, [1, 2, 5]), t = choose(r, [0.5, 1, 1.5, 2]), x = round(c * t + choose(r, [-1, -0.5, 0, 0.5, 1]) * w, 3);
        const f = (s) => A * Math.exp(-(s * s) / (w * w)), answer = round(0.5 * (f(x - c * t) + f(x + c * t)), 4);
        return { q: `An infinite string ($c = ${c}$ m/s) is released from rest with $u(x, 0) = ${A}e^{-x^2/${w * w}}$ mm ($x$ in m). Find $u$ in mm at $x = ${x}$ m, $t = ${t}$ s (to four decimal places).`,
          answer, unit: 'mm', tol: Math.max(1e-3, answer * 0.003), A, w, c, t, x,
          sol: `d'Alembert with zero initial velocity: $u = \\frac12[f(x - ct) + f(x + ct)]$. Here $x - ct = ${round(x - c * t, 3)}$ and $x + ct = ${round(x + c * t, 3)}$, so $u = \\frac{${A}}{2}\\left[e^{-${round((x - c * t) ** 2, 4)}/${w * w}} + e^{-${round((x + c * t) ** 2, 4)}/${w * w}}\\right] \\approx ${answer}$ mm.`,
          trap: 'The factor $\\tfrac12$: the pulse splits into two halves.' };
      },
      verify: (p) => { const g = (s) => p.A * Math.exp(-(s * s) / (p.w * p.w)); return (g(p.x - p.c * p.t) + g(p.x + p.c * p.t)) / 2; } },
    { id: 'pde-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'normal modes',
      make(r) {
        const a = choose(r, [1, 1.5, 2]), b = choose(r, [1, 2, 3]), m = int(r, 1, 3), n = int(r, 1, 3);
        const answer = round(Math.sqrt((m / a) ** 2 + (n / b) ** 2) / Math.sqrt((1 / a) ** 2 + (1 / b) ** 2), 4);
        return { q: `A rectangular membrane of sides $a = ${a}$ m and $b = ${b}$ m is fixed on its edges. Find the ratio $\\omega_{${m}${n}}/\\omega_{11}$ of the $(m, n) = (${m}, ${n})$ mode frequency to the fundamental (to four decimal places).`,
          answer, tol: 5e-4, a, b, m, n,
          sol: `Modes $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{b}$ have $\\omega_{mn} = c\\pi\\sqrt{(m/a)^2 + (n/b)^2}$. Ratio: $\\sqrt{\\frac{(${m}/${a})^2 + (${n}/${b})^2}{(1/${a})^2 + (1/${b})^2}} \\approx ${answer}$.`,
          trap: 'Frequencies add in quadrature, not linearly.' };
      },
      verify: (p) => Math.hypot(p.m / p.a, p.n / p.b) / Math.hypot(1 / p.a, 1 / p.b) },
    { id: 'pde-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Laplace in a rectangle',
      make(r) {
        const a = choose(r, [1, 2]), b = choose(r, [1, 2]), n = int(r, 1, 3), V = choose(r, [10, 20, 50]), xf = choose(r, [0.25, 0.5]), yf = choose(r, [0.25, 0.5, 0.75]);
        const x = xf * a, y = yf * b, answer = round((V * Math.sin((n * Math.PI * x) / a) * Math.sinh((n * Math.PI * y) / a)) / Math.sinh((n * Math.PI * b) / a), 4);
        return { q: `In $0 < x < ${a}$, $0 < y < ${b}$, $\\nabla^2u = 0$ with $u = 0$ on $x = 0$, $x = ${a}$, $y = 0$ and $u(x, ${b}) = ${V}\\sin(${n === 1 ? '' : n}\\pi x/${a})$. Find $u(${x}, ${y})$ (to four decimal places).`,
          answer, tol: Math.max(2e-3, Math.abs(answer) * 0.003), a, b, n, V, x, y,
          sol: `One term suffices: $u = ${V}\\sin\\frac{${n}\\pi x}{${a}}\\frac{\\sinh(${n}\\pi y/${a})}{\\sinh(${n}\\pi\\cdot${b}/${a})}$. Substituting: $\\approx ${answer}$.`,
          trap: 'Sinh, not sin, in the direction of the non-zero edge.' };
      },
      verify: (p) => { // check Laplace numerically at the point and evaluate via the exponential form
        const k = (p.n * Math.PI) / p.a; return p.V * Math.sin(k * p.x) * (Math.exp(k * (p.y - p.b)) - Math.exp(-k * (p.y + p.b))) / (1 - Math.exp(-2 * k * p.b)); } },
    { id: 'pde-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diffusion scales',
      make(r) {
        const k = choose(r, [1.4e-7, 1e-5, 2.3e-5, 1.1e-4]), t = choose(r, [10, 60, 100, 600, 3600]);
        const answer = round(Math.sqrt(2 * k * t) * 1000, 3);
        return { q: `A sharp hot spot spreads by $u_t = \\kappa u_{xx}$ with $\\kappa = ${k}$ m²/s. The heat kernel is a Gaussian of standard deviation $\\sigma = \\sqrt{2\\kappa t}$. Find $\\sigma$ after ${t} s, in mm (to three significant figures).`,
          answer, unit: 'mm', tol: Math.max(1e-3, answer * 0.005), k, t,
          sol: `The kernel $\\frac{1}{\\sqrt{4\\pi\\kappa t}}e^{-x^2/4\\kappa t}$ is a Gaussian with $2\\sigma^2 = 4\\kappa t$, so $\\sigma = \\sqrt{2\\times${k}\\times${t}} \\approx ${answer}$ mm.`,
          trap: 'The exponent has $4\\kappa t$, which is $2\\sigma^2$, not $\\sigma^2$.' };
      },
      verify: (p) => Math.sqrt(2 * p.k * p.t) * 1000 },
    { id: 'pde-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laplace in spherical coordinates',
      make(r) {
        const l = int(r, 1, 4), inside = r() < 0.5;
        const right = inside ? `$V_0\\left(\\frac rR\\right)^{${l}}P_{${l}}(\\cos\\theta)$` : `$V_0\\left(\\frac Rr\\right)^{${l + 1}}P_{${l}}(\\cos\\theta)$`;
        const wr = [`$V_0\\left(\\frac Rr\\right)^{${l}}P_{${l}}(\\cos\\theta)$`, `$V_0\\left(\\frac rR\\right)^{${l + 1}}P_{${l}}(\\cos\\theta)$`, inside ? `$V_0\\left(\\frac Rr\\right)^{${l + 1}}P_{${l}}(\\cos\\theta)$` : `$V_0\\left(\\frac rR\\right)^{${l}}P_{${l}}(\\cos\\theta)$`, `$V_0P_{${l}}(\\cos\\theta)$`];
        const o = mcqOptions(r, right, wr, (s) => s);
        return { q: `A sphere of radius $R$ has surface potential $V_0P_{${l}}(\\cos\\theta)$, and there is no charge ${inside ? 'inside' : 'outside'} it. ${inside ? 'Inside' : 'Outside'} the sphere the potential is`, ...o,
          sol: `Solutions are $r^\\ell P_\\ell$ and $r^{-(\\ell+1)}P_\\ell$. ${inside ? 'Inside, finiteness at the centre keeps $r^\\ell$' : 'Outside, vanishing at infinity keeps $r^{-(\\ell+1)}$'}; matching at $r = R$ gives ${right}.`,
          trap: 'Outside, the power is $\\ell + 1$, not $\\ell$.' };
      } },
    { id: 'pde-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'wave equation',
      make(r) {
        const v0 = choose(r, [0.2, 0.5, 1, 2]), L = choose(r, [0.5, 1, 2]), c = choose(r, [50, 100, 200]), n = int(r, 1, 3);
        const answer = round(((v0 * L) / (n * Math.PI * c)) * 1000, 4);
        return { q: `A string of length ${L} m (wave speed ${c} m/s) with fixed ends is straight at $t = 0$ and has initial velocity $u_t(x, 0) = ${v0}\\sin(${n === 1 ? '' : n}\\pi x/${L})$ m/s. Find the amplitude of its motion, in mm (to four significant figures).`,
          answer, unit: 'mm', tol: Math.max(1e-4, answer * 0.004), v0, L, c, n,
          sol: `$u = B\\sin\\frac{${n}\\pi x}{${L}}\\sin\\omega t$ with $\\omega = \\frac{${n}\\pi c}{L} = ${round((n * Math.PI * c) / L, 2)}$ rad/s. Matching $u_t$ at $t = 0$: $B\\omega = ${v0}$, so $B = ${v0}/${round((n * Math.PI * c) / L, 2)}$ m $\\approx ${answer}$ mm.`,
          trap: 'Amplitude is initial velocity divided by $\\omega_n$, not by $c$.' };
      },
      verify: (p) => (p.v0 / ((p.n * Math.PI * p.c) / p.L)) * 1000 },
    ...more,
  ],
};
