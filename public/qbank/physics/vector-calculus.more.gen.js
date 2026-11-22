// Extra question shapes for vector-calculus (templates vc-t21..t26). Imported by vector-calculus.js.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, simpson } from './_more.js';

export default [
  { id: 'vc-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'identities',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['$\\nabla\\cdot(\\nabla\\times\\vec A) = 0$ for every smooth $\\vec A$', true, 'Mixed partial derivatives commute, so the divergence of a curl cancels term by term.'],
        ['$\\nabla\\times(\\nabla\\phi) = \\vec 0$ for every smooth $\\phi$', true, 'Each component is a difference of equal mixed partials, so the curl of a gradient vanishes.'],
        ['$\\nabla\\cdot(\\nabla\\phi) = 0$ for every smooth $\\phi$', false, 'This is the Laplacian $\\nabla^2\\phi$, which is not zero in general (for $\\phi = x^2$ it is 2).'],
        ['$\\nabla\\times(\\nabla\\times\\vec A) = \\vec 0$ for every smooth $\\vec A$', false, 'It equals $\\nabla(\\nabla\\cdot\\vec A) - \\nabla^2\\vec A$, which is not zero in general.'],
        ['$\\nabla\\cdot\\vec r = 3$ for $\\vec r = x\\hat i + y\\hat j + z\\hat k$', true, '$\\partial x/\\partial x + \\partial y/\\partial y + \\partial z/\\partial z = 3$.'],
        ['$\\nabla\\times\\vec r = \\vec 0$', true, 'Each component of $\\vec r$ depends only on its own coordinate, so all cross derivatives vanish.'],
        ['$\\nabla\\cdot(\\hat r/r^2) = 0$ at every point other than the origin', true, 'In spherical coordinates $\\nabla\\cdot(F_r\\hat r) = \\frac{1}{r^2}\\frac{d}{dr}(r^2F_r) = \\frac{1}{r^2}\\frac{d}{dr}(1) = 0$ for $r\\ne0$.'],
        ['$\\nabla\\cdot(\\phi\\vec A) = \\phi\\,\\nabla\\cdot\\vec A$', false, 'The product rule adds a term: $\\nabla\\cdot(\\phi\\vec A) = \\phi\\,\\nabla\\cdot\\vec A + \\vec A\\cdot\\nabla\\phi$.'],
        ['$\\nabla r = \\hat r$ (where $r = |\\vec r|$)', true, '$\\partial r/\\partial x = x/r$ and so on, so $\\nabla r = \\vec r/r = \\hat r$.'],
        ['$\\nabla\\cdot\\hat r = 0$', false, 'In spherical coordinates $\\nabla\\cdot\\hat r = \\frac{1}{r^2}\\frac{d}{dr}(r^2) = 2/r$.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Only "div curl" and "curl grad" vanish identically; "div grad" is the Laplacian.' };
    } },
  { id: 'vc-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'conservative fields', format: 'reverse',
    make(r) {
      const n = int(r, 2, 4), p = int(r, 1, 4), qq = int(r, 1, 5);
      const zp = (k) => (k === 1 ? 'z' : `z^{${k}}`);
      return { q: `The field $\\vec F = (${2 * p}xy + ${qq === 1 ? '' : qq}${zp(n)})\\,\\hat i + ${p === 1 ? '' : p}x^2\\,\\hat j + k\\,x${zp(n - 1)}\\,\\hat k$ is conservative. The constant $k$ is ______.`,
        answer: n * qq, tol: 0, n, p, qq,
        sol: `Conservative means $\\nabla\\times\\vec F = \\vec 0$. The $z$-component: $\\partial F_y/\\partial x - \\partial F_x/\\partial y = ${2 * p}x - ${2 * p}x = 0$ already. The $y$-component: $\\partial F_x/\\partial z - \\partial F_z/\\partial x = ${n * qq}${zp(n - 1)} - k${zp(n - 1)}$, which vanishes only for $k = ${n * qq}$. (The $x$-component is $0 - 0$.) A potential is $\\phi = ${p === 1 ? '' : p}x^2y + ${qq === 1 ? '' : qq}x${zp(n)}$.`,
        trap: 'Matching only the $\\hat i,\\hat j$ cross-derivatives and forgetting the $z$-dependence of $F_x$.' };
    },
    verify: (p) => { const phi = (x, y, z) => p.p * x * x * y + p.qq * x * z ** p.n, x = 1.3, y = 0.7, z = 1.1, h = 1e-5; return Math.round(((phi(x, y, z + h) - phi(x, y, z - h)) / (2 * h)) / (x * z ** (p.n - 1))); } },
  { id: 'vc-t23', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'divergence',
    make(r) {
      const n = choose(r, [-3, -2, -1, 1, 2, 3]), P = choose(r, [[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 1, 2], [0, 3, 4], [2, 6, 9]]);
      const R = Math.hypot(...P), v = (n + 3) * R ** n;
      return { q: `For $\\vec r = x\\hat i + y\\hat j + z\\hat k$ and $r = |\\vec r|$, the divergence of $r^{${n}}\\vec r$ at the point $(${P.join(', ')})$ is ______ (to four decimal places).`,
        answer: round(v, 4), tol: Math.max(0.0005, round(Math.abs(v) * 0.002, 4)), n, P,
        sol: `$\\nabla\\cdot(r^n\\vec r) = r^n\\,\\nabla\\cdot\\vec r + \\vec r\\cdot\\nabla(r^n) = 3r^n + \\vec r\\cdot(nr^{n-1}\\hat r) = (n + 3)r^n$. At this point $r = \\sqrt{${P.map((x) => x * x).join(' + ')}} = ${R}$, so the value is $${n + 3}\\times${R}^{${n}} = ${round(v, 4)}$.${n === -3 ? ' For $n = -3$ (an inverse-square field) it vanishes everywhere except the origin.' : ''}`,
        trap: 'Writing $\\nabla\\cdot(r^n\\vec r) = nr^{n-1}$ forgets the $3r^n$ from $\\nabla\\cdot\\vec r$.' };
    },
    verify: (p) => {
      const F = (x, y, z) => { const r = Math.hypot(x, y, z) ** p.n; return [r * x, r * y, r * z]; };
      const [x, y, z] = p.P, h = 1e-5;
      return (F(x + h, y, z)[0] - F(x - h, y, z)[0] + F(x, y + h, z)[1] - F(x, y - h, z)[1] + F(x, y, z + h)[2] - F(x, y, z - h)[2]) / (2 * h);
    } },
  { id: 'vc-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'curl', format: 'graph in words',
    make(r) {
      const L = { pos: '$\\nabla\\cdot\\vec F > 0$ and $\\nabla\\times\\vec F = \\vec 0$', neg: '$\\nabla\\cdot\\vec F < 0$ and $\\nabla\\times\\vec F = \\vec 0$', rot: '$\\nabla\\cdot\\vec F = 0$ and $\\nabla\\times\\vec F \\ne \\vec 0$', none: '$\\nabla\\cdot\\vec F = 0$ and $\\nabla\\times\\vec F = \\vec 0$', both: '$\\nabla\\cdot\\vec F \\ne 0$ and $\\nabla\\times\\vec F \\ne \\vec 0$' };
      const F = choose(r, [
        ['point straight away from the $z$-axis, parallel to the $xy$-plane, with length proportional to the distance from the axis', 'pos', 'This is $\\vec F = x\\hat i + y\\hat j$: $\\nabla\\cdot\\vec F = 2$ and $\\nabla\\times\\vec F = \\vec 0$.'],
        ['point straight towards the $z$-axis, parallel to the $xy$-plane, with length proportional to the distance from the axis', 'neg', 'This is $\\vec F = -x\\hat i - y\\hat j$: $\\nabla\\cdot\\vec F = -2$ and $\\nabla\\times\\vec F = \\vec 0$.'],
        ['circle the $z$-axis anticlockwise (seen from above), with length proportional to the distance from the axis', 'rot', 'This is $\\vec F = -y\\hat i + x\\hat j$: $\\nabla\\cdot\\vec F = 0$ and $\\nabla\\times\\vec F = 2\\hat k$.'],
        ['are all parallel to the $x$-axis, pointing along $+x$ where $y > 0$ and along $-x$ where $y < 0$, with length proportional to $|y|$', 'rot', 'This is $\\vec F = y\\hat i$ (a shear flow): $\\nabla\\cdot\\vec F = 0$ but $\\nabla\\times\\vec F = -\\hat k$, though no arrow goes round in a circle.'],
        ['all have the same length and point the same way', 'none', 'A uniform field has all derivatives zero, so both divergence and curl vanish.'],
        ['circle the $z$-axis anticlockwise, with length inversely proportional to the distance from the axis (consider points off the axis)', 'none', 'This is $\\vec F = (-y\\hat i + x\\hat j)/(x^2 + y^2)$. Off the axis $\\nabla\\cdot\\vec F = 0$ and $\\nabla\\times\\vec F = \\vec 0$: the faster speed nearer the axis exactly cancels the turning. (Its circulation round the axis is still $2\\pi$; the curl is concentrated on the axis.)'],
        ['are all parallel to the $x$-axis and point away from the $yz$-plane, with length proportional to the distance from that plane', 'pos', 'This is $\\vec F = x\\hat i$: $\\nabla\\cdot\\vec F = 1$ and $\\nabla\\times\\vec F = \\vec 0$.'],
        ['circle the $z$-axis anticlockwise and also point slightly outwards (spiral outwards), with length proportional to the distance from the axis', 'both', 'This is $\\vec F = (x - y)\\hat i + (x + y)\\hat j$: $\\nabla\\cdot\\vec F = 2$ and $\\nabla\\times\\vec F = 2\\hat k$.'],
      ]);
      const o = mcqOptions(r, L[F[1]], shuffle(r, Object.keys(L).filter((k) => k !== F[1])).map((k) => L[k]));
      return { q: `A field $\\vec F$ in the $xy$-plane is drawn as arrows. The arrows ${F[0]}. Which describes $\\vec F$?`, ...o,
        sol: F[2], trap: 'Curved arrows do not guarantee curl, and straight parallel arrows do not rule it out: what matters is how the field changes from place to place.' };
    } },
  { id: 'vc-t25', type: 'msq', level: 3, exams: ['jam'], sub: 'conservative fields',
    make(r) {
      const a = int(r, 2, 5);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$${a}y\\,\\hat i + ${a}x\\,\\hat j$`, true, `$\\partial F_y/\\partial x = ${a} = \\partial F_x/\\partial y$; potential $${a}xy$.`],
        [`$-${a}y\\,\\hat i + ${a}x\\,\\hat j$`, false, `$\\partial F_y/\\partial x - \\partial F_x/\\partial y = ${2 * a} \\ne 0$: a rotation field.`],
        [`$${2 * a}xy\\,\\hat i + ${a}x^2\\,\\hat j$`, true, `It is $\\nabla(${a}x^2y)$.`],
        ['$y^2\\,\\hat i + (2xy + z)\\,\\hat j + y\\,\\hat k$', true, 'All three curl components vanish: $1 - 1$, $0 - 0$, $2y - 2y$. Potential $xy^2 + yz$.'],
        ['$yz\\,\\hat i + xz\\,\\hat j + xy\\,\\hat k$', true, 'It is $\\nabla(xyz)$.'],
        [`$${a}y\\,\\hat i - ${a}x\\,\\hat j$`, false, `$\\partial F_y/\\partial x - \\partial F_x/\\partial y = -${2 * a}\\ne0$.`],
        ['$z\\,\\hat i - x\\,\\hat k$', false, 'The $y$-component of the curl is $\\partial F_x/\\partial z - \\partial F_z/\\partial x = 1 - (-1) = 2\\ne0$.'],
        ['$x^2\\,\\hat i + y^2\\,\\hat j + z^2\\,\\hat k$', true, 'Each component depends only on its own variable: potential $(x^3 + y^3 + z^3)/3$.'],
        ['$y^2\\,\\hat i + x^2\\,\\hat j$', false, '$\\partial F_y/\\partial x - \\partial F_x/\\partial y = 2x - 2y$, not zero in general.'],
      ], { not });
      return { q: `Which of the following fields are ${not ? '<b>NOT</b> conservative' : 'conservative'} in all of space?`, ...m,
        sol: m.sol.replace('statements that are true', 'fields that are conservative (marked true)').replace('statements that are false', 'fields that are not conservative (marked false)'),
        trap: 'Check every component of the curl; a field can pass the $\\hat k$ test and fail another.' };
    } },
  { id: 'vc-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'line integrals',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 4), L = int(r, 1, 3), para = r() < 0.5;
      const v = para ? ((a + 2 * b) * L ** 3) / 3 : ((a + b) * L ** 3) / 2;
      return { q: `Find $\\displaystyle\\int_C ${a === 1 ? '' : a}y\\,dx + ${b === 1 ? '' : b}x\\,dy$ from $(0, 0)$ to $(${L}, ${L * L})$ along ${para ? 'the parabola $y = x^2$' : `the straight line $y = ${L === 1 ? '' : L}x$`}. ______ (to three decimal places)`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.001, 3)), a, b, L, para,
        sol: para
          ? `On $y = x^2$, $dy = 2x\\,dx$. The integral becomes $\\int_0^{${L}}(${a}x^2 + ${b}x\\cdot2x)\\,dx = ${a + 2 * b}\\cdot\\dfrac{${L}^3}{3} = ${round(v, 3)}$.`
          : `On $y = ${L}x$, $dy = ${L}\\,dx$. The integral becomes $\\int_0^{${L}}(${a}\\cdot${L}x + ${b}x\\cdot${L})\\,dx = ${(a + b) * L}\\cdot\\dfrac{${L}^2}{2} = ${round(v, 3)}$.`,
        trap: a === b ? 'Here the field is conservative ($a = b$), so any path gives $' + a + 'L^3$; in general the answer depends on the path.' : 'The field is not conservative (the coefficients differ), so the two paths give different answers: you must use the given path.' };
    },
    verify: (p) => (p.para
      ? simpson((t) => p.a * t * t + p.b * t * 2 * t, 0, p.L)
      : simpson((t) => p.a * p.L * t + p.b * t * p.L, 0, p.L)) },
];
