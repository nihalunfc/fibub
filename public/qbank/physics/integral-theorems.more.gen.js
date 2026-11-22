// Extra question shapes for integral-theorems (templates it-t21..t26). Imported by integral-theorems.js.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, simpson } from './_more.js';

const kpi = (k) => (k === 0 ? '$0$' : `$${k === 1 ? '' : k === -1 ? '-' : round(k, 4)}\\pi$`);

export default [
  { id: 'it-t21', type: 'mcq', level: 3, exams: ['jam'], sub: 'green theorem',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 4);
      const all = { ell: a * b, ast: (3 * a * a) / 8, car: (3 * a * a) / 2, cyc: 3 * a * a, sq: a * a, half: (a * a) / 2 };
      const C = choose(r, [
        ['ell', `the ellipse $x = ${a}\\cos t$, $y = ${b}\\sin t$, $0\\le t\\le 2\\pi$`, `$x\\,dy - y\\,dx = ${a * b}(\\cos^2t + \\sin^2t)\\,dt = ${a * b}\\,dt$, so $A = \\tfrac12\\cdot${a * b}\\cdot2\\pi = ${a * b}\\pi$.`],
        ['ast', `the astroid $x = ${a}\\cos^3t$, $y = ${a}\\sin^3t$, $0\\le t\\le 2\\pi$`, `$x\\,dy - y\\,dx = 3\\cdot${a * a}\\sin^2t\\cos^2t\\,dt = \\tfrac34\\cdot${a * a}\\sin^2 2t\\,dt$. Over a full turn $\\int\\sin^22t\\,dt = \\pi$, so $A = \\tfrac12\\cdot\\tfrac34\\cdot${a * a}\\pi = ${round(all.ast, 4)}\\pi$.`],
        ['car', `the cardioid $r = ${a}(1 + \\cos\\theta)$`, `In polar form $x\\,dy - y\\,dx = r^2d\\theta$, so $A = \\tfrac12\\int_0^{2\\pi}${a * a}(1 + \\cos\\theta)^2d\\theta = \\tfrac12\\cdot${a * a}(2\\pi + \\pi) = ${round(all.car, 4)}\\pi$.`],
        ['cyc', `one arch of the cycloid $x = ${a}(t - \\sin t)$, $y = ${a}(1 - \\cos t)$ and the $x$-axis`, `Along the axis $y = 0$ and $dy = 0$, so only the arch contributes. Using $A = -\\oint y\\,dx$ (anticlockwise means the arch is traversed from $t = 2\\pi$ back to $0$): $A = \\int_0^{2\\pi}${a * a}(1 - \\cos t)^2dt = ${a * a}(2\\pi + \\pi) = ${3 * a * a}\\pi$.`],
      ]);
      const o = mcqOptions(r, all[C[0]], shuffle(r, Object.keys(all).filter((k) => k !== C[0]).map((k) => all[k])), kpi);
      return { q: `Using Green's theorem in the form $A = \\tfrac12\\oint(x\\,dy - y\\,dx)$, the area enclosed by ${C[1]} is`, ...o,
        sol: C[2], trap: 'The factor $\\tfrac12$: $\\oint(x\\,dy - y\\,dx)$ alone is twice the area.' };
    } },
  { id: 'it-t22', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'statements', format: 'statements',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['The divergence theorem relates a volume integral to the flux through the closed surface bounding that volume', true, 'It needs a closed surface with the outward normal.'],
        ['The flux of $\\nabla\\times\\vec F$ through any closed surface is zero (for smooth $\\vec F$)', true, 'By the divergence theorem it equals $\\int\\nabla\\cdot(\\nabla\\times\\vec F)\\,dV = 0$.'],
        ['Green\'s theorem in the plane is a special case of Stokes\' theorem', true, 'Take a flat surface in the $xy$-plane: $(\\nabla\\times\\vec F)\\cdot\\hat k = \\partial Q/\\partial x - \\partial P/\\partial y$.'],
        ['For $\\vec F = (-y\\hat i + x\\hat j)/(x^2 + y^2)$ the curl is zero off the $z$-axis, so its circulation round the unit circle is zero', false, 'The circulation is $2\\pi$: the region inside the circle contains the axis where $\\vec F$ is not defined, so Stokes\' theorem cannot be applied to the disc.'],
        ['If $\\nabla\\cdot\\vec F = 0$ everywhere except at the origin, the flux through every closed surface is zero', false, 'A surface enclosing the origin can catch a point source: $\\hat r/r^2$ has zero divergence for $r\\ne0$ but flux $4\\pi$ through any sphere about the origin.'],
        ['Stokes\' theorem holds only when the surface spanning the curve is flat', false, 'Any smooth oriented surface with that boundary curve gives the same flux of the curl.'],
        ['The divergence theorem can be applied directly to an open hemisphere', false, 'It needs a closed surface; close the hemisphere with its flat base first and subtract the base\'s flux.'],
        ['In Stokes\' theorem the direction round the curve and the normal of the surface are linked by the right-hand rule', true, 'Curling the fingers along the curve, the thumb gives the normal; reversing one flips the sign.'],
        ['A smooth field with $\\nabla\\cdot\\vec F = 0$ everywhere has zero flux through every closed surface', true, 'The divergence theorem gives flux $= \\int 0\\,dV = 0$.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The theorems need the field to be smooth everywhere inside the region; a singular point inside breaks them.' };
    } },
  { id: 'it-t23', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'stokes theorem',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 5), R = int(r, 1, 3), h = int(r, 1, 4);
      const v = 2 * Math.PI * a * R * R;
      return { q: `For $\\vec F = (z^2 - ${a === 1 ? '' : a}y)\\,\\hat i + (${a === 1 ? '' : a}x + ${b === 1 ? '' : b}z)\\,\\hat j + xyz\\,\\hat k$, find the flux of $\\nabla\\times\\vec F$ upward through the paraboloid cap $z = ${h}\\left(1 - \\dfrac{x^2 + y^2}{${R * R}}\\right)$, $z\\ge0$. ______ (to two decimal places)`,
        answer: round(v, 2), tol: Math.max(0.02, round(v * 0.002, 2)), a, b, R,
        sol: `By Stokes' theorem the flux of the curl equals the circulation round the boundary, the circle $x^2 + y^2 = ${R * R}$ in the plane $z = 0$, taken anticlockwise seen from above (upward normal). On that circle $z = 0$, so $\\vec F = -${a}y\\,\\hat i + ${a}x\\,\\hat j$, and with $x = ${R}\\cos t$, $y = ${R}\\sin t$: $\\vec F\\cdot d\\vec r = ${a}\\cdot${R * R}(\\sin^2t + \\cos^2t)\\,dt$. The circulation is $${a * R * R}\\cdot2\\pi = ${round(v, 2)}$. The height ${h} of the cap does not matter.`,
        trap: 'Computing the curl and integrating over the curved surface works but is long; and the $z$-terms vanish on the boundary.' };
    },
    verify: (p) => simpson((t) => {
      const x = p.R * Math.cos(t), y = p.R * Math.sin(t), z = 0;
      return (z * z - p.a * y) * (-p.R * Math.sin(t)) + (p.a * x + p.b * z) * (p.R * Math.cos(t));
    }, 0, 2 * Math.PI) },
  { id: 'it-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'divergence theorem',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 4), c = int(r, 1, 4), R = int(r, 1, 3), H = int(r, 1, 4);
      const v = (a + b) * Math.PI * R * R * H + c * Math.PI * R * R * H * H;
      const k = (x) => (x === 1 ? '' : x);
      return { q: `Find the outward flux of $\\vec F = ${k(a)}x\\,\\hat i + ${k(b)}y\\,\\hat j + ${k(c)}z^2\\,\\hat k$ through the closed surface of the cylinder $x^2 + y^2\\le ${R * R}$, $0\\le z\\le ${H}$ (curved side, top and bottom). ______ (to two decimal places)`,
        answer: round(v, 2), tol: Math.max(0.02, round(v * 0.002, 2)), a, b, c, R, H,
        sol: `$\\nabla\\cdot\\vec F = ${a + b} + ${2 * c}z$. By the divergence theorem the flux is $\\int_0^{${H}}(${a + b} + ${2 * c}z)\\,\\pi\\cdot${R * R}\\,dz = \\pi\\cdot${R * R}\\left(${a + b}\\cdot${H} + ${c}\\cdot${H * H}\\right) = ${round(v, 2)}$.`,
        trap: 'The divergence depends on $z$ here, so it cannot be multiplied by the volume directly.' };
    },
    verify: (p) => simpson((f) => (p.a * p.R * Math.cos(f) ** 2 + p.b * p.R * Math.sin(f) ** 2) * p.R * p.H, 0, 2 * Math.PI) + p.c * p.H * p.H * Math.PI * p.R * p.R },
  { id: 'it-t25', type: 'mcq', level: 3, exams: ['jam'], sub: 'gauss law',
    make(r) {
      const opt = { 1: '$q/\\varepsilon_0$', 2: '$q/(2\\varepsilon_0)$', 4: '$q/(4\\varepsilon_0)$', 6: '$q/(6\\varepsilon_0)$', 8: '$q/(8\\varepsilon_0)$', 24: '$q/(24\\varepsilon_0)$', 0: '$0$' };
      const C = choose(r, [
        ['at the centre of the cube', 'the whole surface of the cube', 1, 'The charge is fully enclosed, so Gauss\'s law gives $q/\\varepsilon_0$.'],
        ['at the centre of the cube', 'one face of the cube', 6, 'By symmetry the six faces share $q/\\varepsilon_0$ equally.'],
        ['at one corner of the cube', 'the whole surface of the cube', 8, 'Eight cubes meeting at that corner would enclose the charge completely; each gets one eighth.'],
        ['at one corner of the cube', 'one of the three faces that do not touch that corner', 24, 'The cube receives $q/8\\varepsilon_0$. The three faces touching the corner contain the charge in their plane, so the field lies along them and their flux is zero. The other three faces share $q/8\\varepsilon_0$ equally: $q/24\\varepsilon_0$ each.'],
        ['at one corner of the cube', 'one of the three faces that touch that corner', 0, 'The charge lies in the plane of that face, so the field is parallel to the face everywhere on it and no flux crosses it.'],
        ['at the midpoint of one edge of the cube', 'the whole surface of the cube', 4, 'Four cubes share that edge and would enclose the charge together; each gets a quarter.'],
        ['just outside the cube, close to one face', 'the whole surface of the cube', 0, 'No charge is enclosed, so the net flux is zero (field lines entering also leave).'],
      ]);
      const o = mcqOptions(r, opt[C[2]], shuffle(r, Object.keys(opt).filter((k) => +k !== C[2]).map((k) => opt[k])));
      return { q: `A point charge $q$ is placed ${C[0]}. The electric flux through ${C[1]} is`, ...o,
        sol: C[3], trap: 'Gauss\'s law gives the flux through a closed surface; for parts of it use symmetry (imagine extra cubes around the charge).' };
    } },
  { id: 'it-t26', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'regions with holes',
    make(r) {
      const c = int(r, 0, 4); let R = int(r, 1, 5); if (R === c) R += 1;
      const dir = r() < 0.7 ? 1 : -1, times = r() < 0.75 ? 1 : 2, inside = R > c;
      const k = inside ? 2 * dir * times : 0;
      const o = mcqOptions(r, k, shuffle(r, [0, 2, -2, 4, -4, 1].filter((x) => x !== k)), kpi);
      return { q: `For $\\vec F = \\dfrac{-y\\,\\hat i + x\\,\\hat j}{x^2 + y^2}$, the line integral $\\oint\\vec F\\cdot d\\vec r$ round the circle of radius ${R} centred at $(${c}, 0)$, traversed ${times === 2 ? 'twice' : 'once'} ${dir === 1 ? 'anticlockwise' : 'clockwise'}, is`, ...o,
        sol: `Off the origin $\\nabla\\times\\vec F = \\vec 0$, and $\\vec F = \\nabla\\theta$ (the polar angle). So $\\oint\\vec F\\cdot d\\vec r$ is the total change of $\\theta$ round the curve. ${inside ? `The circle has radius ${R} > ${c} (its centre's distance from the origin), so it goes round the origin: each anticlockwise turn adds $2\\pi$. ${times === 2 ? 'Two' : 'One'} ${dir === 1 ? 'anticlockwise' : 'clockwise'} turn${times === 2 ? 's' : ''} give${times === 2 ? '' : 's'} ${kpi(k)}.` : `The circle has radius ${R} < ${c}, so it does not enclose the origin; $\\theta$ returns to its starting value and the integral is $0$.`}`,
        trap: 'Zero curl does not mean zero circulation when the loop surrounds a point where the field is singular.' };
    } },
];
