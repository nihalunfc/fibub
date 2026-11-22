// Vectors and vector calculus: gradient, divergence, curl, line/surface/volume integrals, Gauss, Stokes, Green.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './vector-calculus.more.gen.js';

export default {
  topic: 'vector-calculus',
  items: [
    { id: 'vc-001', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'vector algebra',
      q: 'For $\\vec A = 2\\hat i - \\hat j + 2\\hat k$ and $\\vec B = \\hat i + 2\\hat j + 2\\hat k$, the angle between $\\vec A$ and $\\vec B$ is',
      options: ['$\\cos^{-1}(2/3)$', '$0^\\circ$', '$\\cos^{-1}(4/9)$', '$90^\\circ$'], answer: 2,
      sol: '$\\vec A\\cdot\\vec B = 2 - 2 + 4 = 4$, and $|\\vec A| = |\\vec B| = 3$. So $\\cos\\theta = 4/9$.',
      trap: 'Forgetting the minus sign in $(-1)(2)$ gives $8/9$.' },
    { id: 'vc-002', type: 'nat', level: 1, exams: ['jam'], sub: 'vector algebra',
      q: 'The area of the triangle with vertices at $(0,0,0)$, $(1,2,0)$ and $(3,0,4)$ is ______ (to two decimal places).',
      answer: 5.39, tol: 0.01, calc: () => 0.5 * Math.hypot(8, -4, -6),
      sol: 'Edges $\\vec a = (1,2,0)$, $\\vec b = (3,0,4)$. $\\vec a\\times\\vec b = (8, -4, -6)$, of length $\\sqrt{64+16+36} = \\sqrt{116} \\approx 10.77$. Area $= \\tfrac12|\\vec a\\times\\vec b| \\approx 5.39$.',
    },
    { id: 'vc-003', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'gradient',
      q: 'For $\\phi = x^2 y + y z$, the gradient $\\nabla\\phi$ at $(1, 1, 1)$ is',
      options: ['$2\\hat i + \\hat j + \\hat k$', '$\\hat i + 2\\hat j + \\hat k$', '$2\\hat i + 2\\hat j + 2\\hat k$', '$2\\hat i + 2\\hat j + \\hat k$'], answer: 3,
      sol: '$\\partial_x\\phi = 2xy = 2$, $\\partial_y\\phi = x^2 + z = 2$, $\\partial_z\\phi = y = 1$.' },
    { id: 'vc-004', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'gradient',
      q: 'The directional derivative of $\\phi = xyz$ at $(1, 2, 3)$ in the direction of $\\hat i + 2\\hat j + 2\\hat k$ is',
      options: ['$16/9$', '$16/3$', '$16$', '$22/3$'], answer: 1,
      sol: '$\\nabla\\phi = (yz, xz, xy) = (6, 3, 2)$. The unit vector along $(1,2,2)$ is $(1,2,2)/3$. So $\\nabla\\phi\\cdot\\hat n = (6\\cdot1 + 3\\cdot2 + 2\\cdot2)/3 = 16/3$.',
      trap: 'Not dividing by the length of the direction vector.' },
    { id: 'vc-005', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'divergence',
      q: 'The divergence of $\\vec F = x^2\\hat i + xy\\,\\hat j + yz\\,\\hat k$ at the point $(1, 2, 3)$ is ______.',
      answer: 5, tol: 0,
      sol: '$\\nabla\\cdot\\vec F = 2x + x + y = 3x + y = 3 + 2 = 5$.' },
    { id: 'vc-006', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'curl',
      q: 'The curl of $\\vec F = -y\\,\\hat i + x\\,\\hat j$ is',
      options: ['$2\\hat k$', '$-2\\hat k$', '$\\hat k$', '$\\vec 0$'], answer: 0,
      sol: '$(\\nabla\\times\\vec F)_z = \\partial_x F_y - \\partial_y F_x = 1 - (-1) = 2$; the other components vanish. This field is a rigid rotation with angular velocity 1, and curl $= 2\\vec\\omega$.' },
    { id: 'vc-007', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'identities',
      q: 'For smooth scalar $\\phi$ and vector $\\vec A$, which of the following are always zero?',
      options: ['$\\nabla\\times(\\nabla\\phi)$', '$\\nabla\\cdot(\\nabla\\times\\vec A)$', '$\\nabla\\cdot(\\nabla\\phi)$', '$\\nabla\\times(\\nabla\\times\\vec A)$'], answer: [0, 1],
      sol: 'Curl of a gradient and divergence of a curl vanish identically (mixed partial derivatives commute). $\\nabla\\cdot\\nabla\\phi = \\nabla^2\\phi$ is zero only for harmonic $\\phi$, and $\\nabla\\times\\nabla\\times\\vec A = \\nabla(\\nabla\\cdot\\vec A) - \\nabla^2\\vec A$.',
      trap: 'Option C looks like an identity but it is the Laplacian, which is not zero in general.' },
    { id: 'vc-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'identities',
      q: 'For $\\vec r = x\\hat i + y\\hat j + z\\hat k$ and $r = |\\vec r|$, $\\nabla\\cdot(\\vec r / r^3)$ for $r \\neq 0$ is',
      options: ['$1/r^3$', '$3/r^3$', '$-1/r^3$', '$0$'], answer: 3,
      sol: '$\\nabla\\cdot(r^n\\vec r) = (n+3)r^n$. With $n = -3$ this is $0$ away from the origin. (At the origin it is $4\\pi\\delta^3(\\vec r)$, which is Gauss\'s law for a point charge.)' },
    { id: 'vc-009', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'identities',
      q: 'For $\\vec r = x\\hat i + y\\hat j + z\\hat k$, the value of $\\nabla\\cdot(r^2\\,\\vec r)$ at the point $(1, 1, 1)$ is ______.',
      answer: 15, tol: 0,
      sol: '$\\nabla\\cdot(r^n\\vec r) = (n+3)r^n$, so with $n = 2$: $5r^2 = 5\\times3 = 15$.' },
    { id: 'vc-010', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'line integrals',
      q: 'The work done by $\\vec F = (2xy + z^2)\\hat i + x^2\\hat j + 2xz\\,\\hat k$ in moving a particle from $(0,0,0)$ to $(1, 2, 3)$ along any path is ______.',
      answer: 11, tol: 0,
      sol: '$\\nabla\\times\\vec F = 0$, so $\\vec F = \\nabla\\phi$ with $\\phi = x^2y + xz^2$. Work $= \\phi(1,2,3) - \\phi(0,0,0) = 2 + 9 = 11$.',
      trap: 'Integrating along a straight line works too, but checking the curl first saves minutes.' },
    { id: 'vc-011', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'line integrals',
      q: 'The line integral $\\oint (x\\,dy - y\\,dx)$ taken anticlockwise around the ellipse $x^2/9 + y^2/4 = 1$ equals',
      options: ['$0$', '$6\\pi$', '$12\\pi$', '$3\\pi$'], answer: 2,
      sol: 'By Green\'s theorem $\\oint(x\\,dy - y\\,dx) = \\iint 2\\,dA = 2\\times(\\pi\\cdot3\\cdot2) = 12\\pi$.',
      trap: 'The integral equals twice the area, not the area: $\\tfrac12\\oint(x\\,dy - y\\,dx)$ is the area.' },
    { id: 'vc-012', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'divergence theorem',
      q: 'The outward flux of $\\vec F = x\\hat i + y\\hat j + z\\hat k$ through the surface of a sphere of radius 2 centred at the origin is $k\\pi$. The value of $k$ is ______.',
      answer: 32, tol: 0,
      sol: '$\\nabla\\cdot\\vec F = 3$. Flux $= 3\\times\\tfrac43\\pi(2)^3 = 32\\pi$.' },
    { id: 'vc-013', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'divergence theorem',
      q: 'The outward flux of $\\vec F = x^3\\hat i + y^3\\hat j + z^3\\hat k$ through the unit sphere is $k\\pi$. The value of $k$ is ______ (to two decimal places).',
      answer: 2.4, tol: 0.01,
      sol: '$\\nabla\\cdot\\vec F = 3r^2$. $\\int_0^1 3r^2\\cdot4\\pi r^2\\,dr = 12\\pi/5 = 2.4\\pi$.' },
    { id: 'vc-014', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'stokes theorem',
      q: 'For $\\vec F = y\\,\\hat i + z\\,\\hat j + x\\,\\hat k$, the flux of $\\nabla\\times\\vec F$ through the upper hemisphere $x^2+y^2+z^2 = 1,\\ z\\ge0$ (outward normal) is',
      options: ['$-2\\pi$', '$-\\pi$', '$\\pi$', '$0$'], answer: 1,
      sol: '$\\nabla\\times\\vec F = (-1,-1,-1)$. By Stokes the flux equals the flux through the flat unit disc with normal $+\\hat k$: $(-1)\\times\\pi = -\\pi$. Or: $\\oint_C \\vec F\\cdot d\\vec l$ around $x^2+y^2=1$ at $z=0$ gives $\\oint y\\,dx = -\\pi$.',
      trap: 'Any surface with the same boundary gives the same flux of a curl, so swap the hemisphere for the disc.' },
    { id: 'vc-015', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'conservative fields',
      q: 'Which of these fields are conservative in all of space?',
      options: ['$\\vec F = yz\\,\\hat i + xz\\,\\hat j + xy\\,\\hat k$', '$\\vec F = y\\,\\hat i - x\\,\\hat j$', '$\\vec F = 2x\\,\\hat i + 2y\\,\\hat j + 2z\\,\\hat k$', '$\\vec F = z\\,\\hat i + x\\,\\hat j + y\\,\\hat k$'], answer: [0, 2],
      sol: 'A: curl is zero, potential $xyz$. C: potential $x^2+y^2+z^2$. B: curl $= -2\\hat k$. D: curl $= (1,1,1)$.' },
    { id: 'vc-016', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'curvilinear coordinates',
      q: 'In spherical polar coordinates, the divergence of $\\vec F = r\\,\\hat r$ is',
      options: ['$3$', '$3r$', '$1$', '$2$'], answer: 0,
      sol: '$\\nabla\\cdot\\vec F = \\frac{1}{r^2}\\frac{\\partial}{\\partial r}(r^2\\cdot r) = \\frac{3r^2}{r^2} = 3$, matching the Cartesian result for $\\vec r$.',
      trap: 'Writing $\\partial F_r/\\partial r = 1$ and forgetting the $r^2$ factor in the spherical formula.' },
    { id: 'vc-017', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'curvilinear coordinates',
      q: 'The vector field $\\vec F = \\dfrac{\\hat\\phi}{s}$ (cylindrical coordinates, $s$ the distance from the $z$-axis). Its circulation $\\oint\\vec F\\cdot d\\vec l$ around the circle $s = 5$ in the $xy$-plane, anticlockwise, is $k\\pi$. Find $k$.',
      answer: 2, tol: 0,
      sol: 'On the circle $d\\vec l = s\\,d\\phi\\,\\hat\\phi$, so $\\oint = \\int_0^{2\\pi} \\frac1s\\cdot s\\,d\\phi = 2\\pi$ for any radius. The curl is zero for $s > 0$, yet the circulation is not: the field is singular on the $z$-axis, so Stokes\' theorem needs the axis inside to carry a delta-function curl.',
      trap: 'Answering 0 because the curl vanishes: the region with a hole is not simply connected.' },
    { id: 'vc-018', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'divergence theorem',
      q: 'Let $\\vec F = \\hat r / r^2$. Its outward flux through the surface of a cube of side 2 centred at $(5, 0, 0)$ is',
      options: ['$4\\pi$', '$4\\pi/6$', '$8$', '$0$'], answer: 3,
      sol: 'The divergence of $\\hat r/r^2$ is zero everywhere except the origin, which lies outside the cube. So the flux is zero.',
      trap: '$4\\pi$ would be right only if the origin were inside the closed surface.' },
    { id: 'vc-019', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'divergence theorem',
      q: 'The outward flux of $\\hat r/r^2$ through the surface of a cube of side 2 centred at the origin is $k\\pi$. Find $k$.',
      answer: 4, tol: 0,
      sol: 'The origin is inside the closed surface, so $\\oint \\hat r\\cdot d\\vec a / r^2 = 4\\pi$ whatever the shape (this is the solid angle of a closed surface).' },
    { id: 'vc-020', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'identities',
      q: 'For constant vector $\\vec a$ and $\\vec r = x\\hat i + y\\hat j + z\\hat k$, which are correct?',
      options: ['$\\nabla(\\vec a\\cdot\\vec r) = \\vec a$', '$\\nabla\\times(\\vec a\\times\\vec r) = 2\\vec a$', '$\\nabla\\cdot(\\vec a\\times\\vec r) = 0$', '$(\\vec a\\cdot\\nabla)\\vec r = \\vec 0$'], answer: [0, 1, 2],
      sol: 'A: gradient of $a_xx + a_yy + a_zz$. B: $\\nabla\\times(\\vec a\\times\\vec r) = \\vec a(\\nabla\\cdot\\vec r) - (\\vec a\\cdot\\nabla)\\vec r = 3\\vec a - \\vec a = 2\\vec a$. C: $\\vec r\\cdot(\\nabla\\times\\vec a) - \\vec a\\cdot(\\nabla\\times\\vec r) = 0$. D: $(\\vec a\\cdot\\nabla)\\vec r = \\vec a$, not zero.' },
    { id: 'vc-021', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'surface integrals',
      q: 'The flux of $\\vec F = z\\,\\hat k$ outward through the closed surface of the cylinder $x^2 + y^2 \\le 4$, $0 \\le z \\le 3$ is $k\\pi$. Find $k$.',
      answer: 12, tol: 0,
      sol: '$\\nabla\\cdot\\vec F = 1$, so the flux is the volume $\\pi\\cdot4\\cdot3 = 12\\pi$. Directly: top face $z=3$ gives $3\\times4\\pi = 12\\pi$; bottom $z = 0$ gives 0; the curved side has $\\vec F\\perp\\hat n$.' },
    { id: 'vc-022', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'stokes theorem',
      q: 'Let $C$ be the curve where the plane $x + y + z = 1$ meets the sphere $x^2 + y^2 + z^2 = 1$, traversed anticlockwise seen from the side of the normal $(1,1,1)$. Then $\\oint_C (y\\,dx + z\\,dy + x\\,dz)$ equals',
      options: ['$-2\\sqrt3\\,\\pi$', '$0$', '$-\\dfrac{2\\pi}{\\sqrt3}$', '$-\\dfrac{2\\pi}{3}$'], answer: 2,
      sol: '$\\nabla\\times(y,z,x) = (-1,-1,-1)$. By Stokes, the integral is $(\\nabla\\times\\vec F)\\cdot\\hat n\\times$(area of the disc). $\\hat n = (1,1,1)/\\sqrt3$, so the dot product is $-\\sqrt3$. The plane is $1/\\sqrt3$ from the origin, so the circle has radius $\\sqrt{1 - 1/3} = \\sqrt{2/3}$ and area $2\\pi/3$. Result: $-\\sqrt3\\cdot2\\pi/3 = -2\\pi/\\sqrt3$.',
      trap: 'Using the sphere\'s radius 1 for the circle, which gives $-\\sqrt3\\,\\pi$-type answers.' },
    { id: 'vc-023', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'volume integrals',
      q: 'For $\\vec F = (x + y^2)\\hat i + (y + z^2)\\hat j + (z + x^2)\\hat k$, the outward flux through the surface of the cube $0\\le x,y,z\\le1$ is ______.',
      answer: 3, tol: 0,
      sol: '$\\nabla\\cdot\\vec F = 1 + 1 + 1 = 3$; the squared terms do not depend on their own coordinate. Volume 1, so the flux is 3.',
      trap: 'The $y^2$, $z^2$, $x^2$ terms are decoys: they add nothing to the divergence.' },
    { id: 'vc-024', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'delta function',
      q: 'The value of $\\displaystyle\\int_V (r^2 + 2)\\,\\nabla\\cdot\\left(\\frac{\\hat r}{r^2}\\right) dV$ over a sphere of radius 3 centred at the origin is',
      options: ['$4\\pi$', '$8\\pi$', '$44\\pi$', '$0$'], answer: 1,
      sol: '$\\nabla\\cdot(\\hat r/r^2) = 4\\pi\\delta^3(\\vec r)$. The integral picks out $(r^2+2)$ at $r = 0$: $4\\pi\\times2 = 8\\pi$.',
      trap: 'Evaluating $r^2 + 2$ at the surface ($r = 3$) gives $44\\pi$.' },
  ],
  gens: [
    { id: 'vc-g01', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'divergence',
      make(r) {
        const a = int(r, 1, 5), b = int(r, 1, 5), c = int(r, 1, 4), x = int(r, -2, 3), y = int(r, -2, 3), z = int(r, -2, 3);
        // F = a x^2 i + b x y j + c y z^2 k ; div = 2a x + b x + 2c y z
        const answer = 2 * a * x + b * x + 2 * c * y * z;
        return { q: `The divergence of $\\vec F = ${a}x^2\\,\\hat i + ${b}xy\\,\\hat j + ${c}yz^2\\,\\hat k$ at the point $(${x}, ${y}, ${z})$ is ______.`,
          answer, tol: 0, a, b, c, x, y, z,
          sol: `$\\nabla\\cdot\\vec F = \\partial_x(${a}x^2) + \\partial_y(${b}xy) + \\partial_z(${c}yz^2) = ${2 * a}x + ${b}x + ${2 * c}yz$. At $(${x}, ${y}, ${z})$: $${2 * a}(${x}) + ${b}(${x}) + ${2 * c}(${y})(${z}) = ${answer}$.` };
      },
      verify: (p) => 2 * p.a * p.x + p.b * p.x + 2 * p.c * p.y * p.z },
    { id: 'vc-g02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'line integrals',
      make(r) {
        const x = int(r, 1, 4), y = int(r, 1, 4), z = int(r, 1, 4), m = int(r, 1, 3);
        // phi = m x^2 y + y z^2  ->  F = (2m x y, m x^2 + z^2, 2 y z)
        const answer = m * x * x * y + y * z * z;
        return { q: `Find the work done by $\\vec F = ${2 * m}xy\\,\\hat i + (${m === 1 ? '' : m}x^2 + z^2)\\,\\hat j + 2yz\\,\\hat k$ in moving a particle from the origin to $(${x}, ${y}, ${z})$.`,
          answer, tol: 0, x, y, z, m,
          sol: `$\\nabla\\times\\vec F = 0$ (check: $\\partial_x F_y = ${2 * m}x = \\partial_y F_x$, $\\partial_y F_z = 2z = \\partial_z F_y$, $\\partial_z F_x = 0 = \\partial_x F_z$), so $\\vec F = \\nabla\\phi$ with $\\phi = ${m === 1 ? '' : m}x^2y + yz^2$. Work $= \\phi(${x},${y},${z}) - \\phi(0,0,0) = ${m * x * x * y} + ${y * z * z} = ${answer}$, whatever the path.` };
      },
      verify: (p) => p.m * p.x * p.x * p.y + p.y * p.z * p.z },
    { id: 'vc-g03', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'divergence theorem',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 4), c = int(r, 1, 4), R = int(r, 1, 3);
        const answer = (a + b + c) * (4 / 3) * R ** 3; // flux / pi
        return { q: `The outward flux of $\\vec F = ${a}x\\,\\hat i + ${b}y\\,\\hat j + ${c}z\\,\\hat k$ through the sphere $x^2 + y^2 + z^2 = ${R * R}$ is $k\\pi$. Find $k$ (to two decimal places).`,
          answer: round(answer, 2), tol: 0.01, a, b, c, R,
          sol: `By the divergence theorem, flux $= \\int (\\nabla\\cdot\\vec F)\\,dV = (${a}+${b}+${c})\\times\\tfrac43\\pi(${R})^3 = ${round(answer, 2)}\\pi$.` };
      },
      verify: (p) => (p.a + p.b + p.c) * (4 / 3) * p.R ** 3 },
    { id: 'vc-g04', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'curl',
      make(r) {
        const a = int(r, 1, 5), b = int(r, 1, 5);
        // F = -a y i + b x j ; curl = (b + a) k
        const k = a + b;
        const o = mcqOptions(r, k, [b - a === 0 ? 2 * k : b - a, a * b, -k], (v) => `$${v}\\,\\hat k$`);
        return { q: `The curl of $\\vec F = -${a}y\\,\\hat i + ${b}x\\,\\hat j$ is`, ...o,
          sol: `$(\\nabla\\times\\vec F)_z = \\partial_x(${b}x) - \\partial_y(-${a}y) = ${b} + ${a} = ${k}$, and the $x$ and $y$ components are zero.`,
          trap: 'Subtracting in the wrong order, or dropping the minus sign in $F_x$, gives the difference instead of the sum.' };
      } },
    { id: 'vc-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'line integrals',
      make(r) {
        const A = int(r, 2, 6), B = int(r, 1, 5);
        // Green: closed integral of (x dy - y dx) around ellipse = 2 pi A B
        return { q: `Using Green's theorem, $\\oint (x\\,dy - y\\,dx)$ anticlockwise around the ellipse $\\dfrac{x^2}{${A * A}} + \\dfrac{y^2}{${B * B}} = 1$ equals $k\\pi$. Find $k$.`,
          answer: 2 * A * B, tol: 0, A, B,
          sol: `Green's theorem: $\\oint(P\\,dx + Q\\,dy) = \\iint(\\partial_x Q - \\partial_y P)\\,dA$ with $P = -y$, $Q = x$ gives $\\iint 2\\,dA = 2\\times\\pi(${A})(${B}) = ${2 * A * B}\\pi$.`,
          trap: 'Half of this integral is the area; the integral itself is twice the area.' };
      },
      verify: (p) => 2 * p.A * p.B },
    { id: 'vc-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'gradient',
      make(r) {
        const x = int(r, 1, 3), y = int(r, 1, 3), z = int(r, 1, 3);
        const dirs = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 2, 1, 3], [1, 0, 0, 1], [0, 3, 4, 5], [3, 0, 4, 5]];
        const [u, v, w, L] = choose(r, dirs);
        const g = [y * z, x * z, x * y];
        const answer = (g[0] * u + g[1] * v + g[2] * w) / L;
        return { q: `The directional derivative of $\\phi = xyz$ at $(${x}, ${y}, ${z})$ along $${u}\\hat i + ${v}\\hat j + ${w}\\hat k$ is ______ (to two decimal places).`,
          answer: round(answer, 2), tol: 0.01, x, y, z, u, v, w, L,
          sol: `$\\nabla\\phi = (yz, xz, xy) = (${g.join(', ')})$. The unit vector is $(${u}, ${v}, ${w})/${L}$. So the derivative is $(${g[0]}\\cdot${u} + ${g[1]}\\cdot${v} + ${g[2]}\\cdot${w})/${L} = ${round(answer, 2)}$.`,
          trap: 'Forgetting to divide by the length of the direction vector.' };
      },
      verify: (p) => (p.y * p.z * p.u + p.x * p.z * p.v + p.x * p.y * p.w) / p.L },
    ...more,
  ],
};
