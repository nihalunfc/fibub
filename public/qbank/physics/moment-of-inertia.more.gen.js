// Extra question shapes for moment-of-inertia (templates moi-t21..t26). Imported by moment-of-inertia.js.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, bisect, simpson } from './_more.js';

const g = 9.8, n3 = (x) => String(+x.toPrecision(3)), rad = (d) => (d * Math.PI) / 180;

export default [
  { id: 'moi-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'rolling',
    make(r) {
      const ask = choose(r, ['first', 'last', 'ke']);
      const B = { 'the thin ring': 1, 'the uniform disc': 0.5, 'the solid sphere': 0.4, 'the thin hollow sphere': 2 / 3 };
      const names = Object.keys(B);
      if (ask === 'ke') {
        const same = 'all have the same total kinetic energy at the bottom';
        const o = mcqOptions(r, same, shuffle(r, names).slice(0, 3).map((x) => `${x} has the greatest kinetic energy`));
        return { q: 'A thin ring, a uniform disc, a solid sphere and a thin hollow sphere, all of the same mass and radius, roll without slipping from rest down the same slope through the same height. Which statement about their kinetic energy at the bottom is right?', ...o,
          sol: 'Rolling without slipping wastes no energy (static friction does no work), so each one turns the same $mgh$ into kinetic energy. They differ only in how it is split between translation and rotation, so they arrive at different speeds but with equal total kinetic energy.',
          trap: 'Different arrival speeds do not mean different kinetic energies: the slower bodies hold more of it as rotation.' };
      }
      const order = names.slice().sort((x, y) => B[x] - B[y]);
      const right = ask === 'first' ? order[0] : order[3];
      const o = mcqOptions(r, right, names.filter((x) => x !== right));
      return { q: `A thin ring, a uniform disc, a solid sphere and a thin hollow sphere, of different masses and radii, are released together from rest and roll without slipping down the same slope. Which one reaches the bottom ${ask === 'first' ? 'first' : 'last'}?`, ...o,
        sol: `Writing $I = \\beta mR^2$, the acceleration is $a = \\dfrac{g\\sin\\theta}{1 + \\beta}$: mass and radius cancel. $\\beta$ is $2/5$ (solid sphere), $1/2$ (disc), $2/3$ (hollow sphere), $1$ (ring). The smallest $\\beta$ wins, so the solid sphere is first and the ring last; here the answer is ${right}.`,
        trap: 'Mass and size do not matter, only the shape factor $I/mR^2$.' };
    } },
  { id: 'moi-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'parallel axis',
    make(r) {
      const M = int(r, 1, 6), L = pick(r, 0.5, 2, 0.5), Rd = pick(r, 0.1, 0.5, 0.1), not = r() < 0.35;
      const res = msqOf(r, [
        [`A uniform rod (mass ${M} kg, length ${L} m) has $I = ${n3((M * L * L) / 12)}$ kg m² about a perpendicular axis through its centre`, true, `$ML^2/12 = ${M}\\times${L}^2/12$.`],
        [`A uniform rod (mass ${M} kg, length ${L} m) has $I = ${n3((M * L * L) / 3)}$ kg m² about a perpendicular axis through one end`, true, `Parallel axes: $ML^2/12 + M(L/2)^2 = ML^2/3$.`],
        [`A uniform rod (mass ${M} kg, length ${L} m) has $I = ${n3((M * L * L) / 4)}$ kg m² about a perpendicular axis through one end`, false, `$M(L/2)^2$ alone forgets the rod's own $ML^2/12$; the answer is $ML^2/3 = ${n3((M * L * L) / 3)}$ kg m².`],
        [`A uniform disc (mass ${M} kg, radius ${Rd} m) has $I = ${n3((M * Rd * Rd) / 4)}$ kg m² about a diameter`, true, `Perpendicular axes: $I_x + I_y = I_z = MR^2/2$ and $I_x = I_y$, so $I_x = MR^2/4$.`],
        ['The perpendicular-axis theorem holds for any rigid body', false, 'It holds only for flat (planar) bodies, with the two axes in the plane.'],
        ['Among all parallel axes, the moment of inertia is least about the one through the centre of mass', true, '$I = I_\\text{cm} + Md^2$ is smallest at $d = 0$.'],
        ['A body has the same moment of inertia about every axis', false, 'It depends on the axis: a rod is much easier to spin about its length.'],
      ], { not });
      return { q: `Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'The parallel-axis theorem starts from the axis through the centre of mass, never from another off-centre axis.' };
    } },
  { id: 'moi-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'standard bodies', unit: 'kg m²',
    make(r) {
      const M = int(r, 1, 8), L = pick(r, 0.5, 2, 0.1), th = choose(r, [15, 30, 37, 45, 53, 60, 75, 90]);
      const I = ((M * L * L) / 12) * Math.sin(rad(th)) ** 2;
      return { q: `A uniform thin rod of mass ${M} kg and length ${L} m turns about an axis through its centre that makes an angle of $${th}^\\circ$ with the rod. Its moment of inertia about this axis is ______ kg m² (four decimal places).`,
        answer: round(I, 4), tol: Math.max(0.0005, round(I * 0.002, 4)), unit: 'kg m²', M, L, th,
        sol: `A piece at distance $s$ along the rod is $s\\sin\\theta$ from the axis. $I = \\displaystyle\\int_{-L/2}^{L/2}\\dfrac{M}{L}s^2\\sin^2\\theta\\,ds = \\dfrac{ML^2}{12}\\sin^2\\theta = \\dfrac{${M}\\times${L}^2}{12}\\sin^2 ${th}^\\circ = ${round(I, 4)}$ kg m².`,
        trap: 'The distance to the axis is $s\\sin\\theta$, so the factor is $\\sin^2\\theta$, not $\\cos^2\\theta$.' };
    },
    verify: (p) => simpson((s) => (p.M / p.L) * (s * Math.sin(rad(p.th))) ** 2, -p.L / 2, p.L / 2) },
  { id: 'moi-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'physical pendulum', unit: 'cm', format: 'reverse',
    make(r) {
      const T = pick(r, 0.8, 2, 0.1);
      const [body, size, k] = choose(r, [['a uniform disc, pivoted at a point on its rim (axis perpendicular to the disc)', 'radius', 1.5], ['a thin ring, hung on a nail at a point on its rim (axis perpendicular to the ring)', 'radius', 2], ['a uniform rod, pivoted at one end', 'length', 2 / 3]]);
      // T = 2 pi sqrt(k * size / g)  with k = I_pivot / (M * d) / size
      const s = (g * T * T) / (4 * Math.PI * Math.PI * k) * 100;
      return { q: `A physical pendulum is ${body}. It swings with small-amplitude period ${T} s. Its ${size} is ______ cm ($g = 9.8$ m/s², one decimal place).`,
        answer: round(s, 1), tol: Math.max(0.1, round(s * 0.002, 2)), unit: 'cm', T, k,
        sol: `For a physical pendulum $T = 2\\pi\\sqrt{I_p/(Mgd)}$, with $d$ the pivot-to-centre distance. ${k === 1.5 ? 'Disc: $I_p = \\tfrac12MR^2 + MR^2 = \\tfrac32MR^2$, $d = R$, so $T = 2\\pi\\sqrt{3R/(2g)}$.' : k === 2 ? 'Ring: $I_p = MR^2 + MR^2 = 2MR^2$, $d = R$, so $T = 2\\pi\\sqrt{2R/g}$.' : 'Rod: $I_p = ML^2/3$, $d = L/2$, so $T = 2\\pi\\sqrt{2L/(3g)}$.'} Solving for the ${size}: $${size === 'radius' ? 'R' : 'L'} = \\dfrac{gT^2}{4\\pi^2\\times${round(k, 4)}} = ${round(s / 100, 4)}$ m $= ${round(s, 1)}$ cm.`,
        trap: 'The equivalent simple-pendulum length is $I_p/(Md)$, not the pivot-to-centre distance.' };
    },
    verify: (p) => bisect((s) => 2 * Math.PI * Math.sqrt((p.k * s) / g) - p.T, 1e-4, 10) * 100 },
  { id: 'moi-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'standard bodies', format: 'scaling',
    make(r) {
      const k = choose(r, [2, 3]);
      const [desc, p, why] = choose(r, [
        ['a uniform solid sphere is replaced by one of the same material with', 5, '$M\\propto R^3$ at fixed density, and $I\\propto MR^2\\propto R^5$.'],
        ['a uniform flat disc is replaced by one cut from the same sheet with', 4, 'At fixed thickness $M\\propto R^2$, so $I\\propto MR^2\\propto R^4$.'],
        ['a ring bent from wire is replaced by one bent from the same wire with', 3, 'At fixed wire, $M\\propto R$ (the length of wire), so $I\\propto MR^2\\propto R^3$.'],
        ['a body is replaced by one of the same shape and the same mass but with', 2, 'At fixed mass every distance scales by the factor, and $I\\propto MR^2\\propto R^2$.'],
      ]);
      const o = mcqOptions(r, k ** p, [2, 3, 4, 5].filter((x) => x !== p).map((x) => k ** x), (v) => `$${v}$`);
      return { q: `The moment of inertia about its symmetry axis changes by what factor when ${desc} ${k} times the radius?`, ...o,
        sol: `${why} So the factor is $${k}^{${p}} = ${k ** p}$.`,
        trap: 'Check what is held fixed (density, thickness, wire or mass): each gives a different power.' };
    } },
  { id: 'moi-t26', type: 'msq', level: 3, exams: ['jam'], sub: 'point masses',
    make(r) {
      const m = int(r, 1, 5), a = pick(r, 0.2, 1, 0.1), u = m * a * a, f = (x) => `$${n3(x * u)}$ kg m²`, not = r() < 0.35;
      const res = msqOf(r, [
        [`About the axis through the centre, perpendicular to the square: ${f(2)}`, true, `Each mass is $a/\\sqrt2$ from the centre: $4m(a^2/2) = 2ma^2$.`],
        [`About an axis along one side: ${f(2)}`, true, 'Two masses lie on the axis; the other two are $a$ away: $2ma^2$.'],
        [`About an axis along one side: ${f(1)}`, false, `Two masses at distance $a$ give $2ma^2 = ${n3(2 * u)}$ kg m².`],
        [`About a diagonal: ${f(1)}`, true, 'Two masses lie on it; the other two are $a/\\sqrt2$ away: $2m(a^2/2) = ma^2$.'],
        [`About a diagonal: ${f(2)}`, false, `The off-axis masses are $a/\\sqrt2$ away, not $a$: $ma^2 = ${n3(u)}$ kg m².`],
        [`About the axis through one corner, perpendicular to the square: ${f(4)}`, true, 'Distances $0$, $a$, $a$, $a\\sqrt2$: $m(0 + a^2 + a^2 + 2a^2) = 4ma^2$ (or parallel axes: $2ma^2 + 4m(a/\\sqrt2)^2$).'],
        [`About the axis through one corner, perpendicular to the square: ${f(3)}`, false, `It is $4ma^2 = ${n3(4 * u)}$ kg m²; the diagonal corner is $a\\sqrt2$ away.`],
        [`About the line through the centre parallel to a side: ${f(1)}`, true, 'Each mass is $a/2$ away: $4m(a/2)^2 = ma^2$.'],
      ], { not });
      return { q: `Four particles of ${m} kg each sit at the corners of a light square frame of side ${a} m. Which moment-of-inertia statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Measure each distance perpendicular to the axis; masses on the axis contribute nothing.' };
    } },
];
