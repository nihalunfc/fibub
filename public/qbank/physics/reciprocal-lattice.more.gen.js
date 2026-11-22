// Extra question shapes for reciprocal-lattice (templates rl-m31..m35). Imported by reciprocal-lattice.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const trip = (t) => `(${t.join(', ')})`;

export default [
  { id: 'rl-m31', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'scaling of the reciprocal lattice', format: 'scaling',
    make(r) {
      const f = choose(r, [2, 3]);
      const ch = choose(r, [
        ['every lattice constant of a cubic crystal is multiplied by', 'all'],
        ['only the lattice constant $a$ of an orthorhombic crystal (axes $a$, $b$, $c$) is multiplied by', 'one'],
      ]);
      const qs = choose(r, [['the volume of the first Brillouin zone', 'vol'], ['the length of the reciprocal vector $\\vec b_1$ (the one with $\\vec a_1\\cdot\\vec b_1 = 2\\pi$)', 'b1'], ['the length of the reciprocal vector $\\vec b_2$', 'b2']]);
      const pw = { all: { vol: -3, b1: -1, b2: -1 }, one: { vol: -1, b1: -1, b2: 0 } }[ch[1]][qs[1]];
      const lab = (p) => (p === 0 ? 'it does not change' : `it is multiplied by $${p < 0 ? `1/${f ** -p}` : f ** p}$`);
      const o = pickMcq(r, lab(pw), [-3, -2, -1, 0, 1, 2, 3].filter((p) => p !== pw).map(lab));
      return { q: `If ${ch[0]} $${f}$, what happens to ${qs[0]}?`, ...o,
        sol: `The reciprocal vectors obey $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$, so $b_1 = 2\\pi/a$ for orthogonal axes and the zone volume is $(2\\pi)^3/V_{cell}$. ${ch[1] === 'all' ? `Scaling every length by $${f}$ scales every $b_i$ by $1/${f}$ and $V_{cell}$ by $${f ** 3}$.` : `Stretching only $a$ shrinks $\\vec b_1$ by $1/${f}$, leaves $\\vec b_2$ and $\\vec b_3$ alone, and multiplies $V_{cell}$ by $${f}$.`} So ${lab(pw)}.`,
        trap: 'Real and reciprocal space are inverse: making the crystal bigger makes the Brillouin zone smaller.' };
    } },
  { id: 'rl-m32', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'reciprocal lattice facts', format: 'statements',
    make(r) {
      const a = round(3 + 3 * r(), 2), h = int(r, 1, 2), k = int(r, 0, 2), l = int(r, 0, 1);
      const G = Math.hypot(h, k, l) * 2 * Math.PI / a, d = a / Math.hypot(h, k, l);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The shortest reciprocal lattice vector has length $2\\pi/a = ${round(2 * Math.PI / a, 3)}$ Å$^{-1}$`, true, 'For simple cubic, $\\vec b_i = (2\\pi/a)\\hat x_i$.'],
        [`The shortest reciprocal lattice vector has length $1/a = ${round(1 / a, 3)}$ Å$^{-1}$`, false, 'With the solid-state convention $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$ it is $2\\pi/a$.'],
        [`The vector $\\vec G_{${h}${k}${l}}$ is perpendicular to the $(${h}${k}${l})$ planes and has length $${round(G, 3)}$ Å$^{-1}$`, true, `$|\\vec G| = (2\\pi/a)\\sqrt{h^2+k^2+l^2}$.`],
        [`The spacing of the $(${h}${k}${l})$ planes is $2\\pi/|\\vec G_{${h}${k}${l}}| = ${round(d, 3)}$ Å`, true, '$d_{hkl} = 2\\pi/|\\vec G_{hkl}|$.'],
        [`The spacing of the $(${h}${k}${l})$ planes is $|\\vec G_{${h}${k}${l}}|/2\\pi = ${round(G / (2 * Math.PI), 3)}$ Å`, false, 'That is $1/d$, in Å$^{-1}$, not a length.'],
        [`The first Brillouin zone has volume $(2\\pi/a)^3 = ${round((2 * Math.PI / a) ** 3, 3)}$ Å$^{-3}$`, true, 'Zone volume $= (2\\pi)^3/V_{cell}$.'],
        [`The first Brillouin zone has volume $a^3 = ${round(a ** 3, 2)}$ Å$^3$`, false, 'That is the real-space cell; the zone is $(2\\pi)^3/a^3$.'],
        ['The reciprocal of the reciprocal lattice is the original lattice', true, 'The relation $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$ is symmetric.'],
      ], { not });
      return { q: `A simple cubic lattice has lattice constant $a = ${a}$ Å. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The $2\\pi$ convention: $|\\vec G| = 2\\pi/d$, and the zone volume is $(2\\pi)^3/V_{cell}$.' };
    } },
  { id: 'rl-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'shape of the first Brillouin zone', format: 'match the system',
    make(r) {
      const O = { cube: 'a cube', rd: 'a rhombic dodecahedron (12 rhombic faces)', to: 'a truncated octahedron (8 hexagonal and 6 square faces)', hexp: 'a hexagonal prism', sq: 'a square', hex: 'a regular hexagon', rect: 'a rectangle' };
      const C = choose(r, [
        ['a simple cubic lattice', 'cube', 'The reciprocal lattice is simple cubic, whose Wigner-Seitz cell is a cube.', '3'],
        ['a body-centred cubic lattice (e.g. sodium)', 'rd', 'The reciprocal of bcc is fcc, and the Wigner-Seitz cell of fcc is a rhombic dodecahedron.', '3'],
        ['a face-centred cubic lattice (e.g. copper)', 'to', 'The reciprocal of fcc is bcc, and the Wigner-Seitz cell of bcc is a truncated octahedron.', '3'],
        ['a simple hexagonal lattice', 'hexp', 'The reciprocal lattice is again hexagonal (rotated by 30°), so the zone is a hexagonal prism.', '3'],
        ['a 2D square lattice', 'sq', 'Its reciprocal lattice is square, so the zone is a square of side $2\\pi/a$.', '2'],
        ['a 2D triangular (hexagonal) lattice, such as graphene\'s', 'hex', 'The reciprocal lattice is triangular, rotated by 30°, so the zone is a hexagon.', '2'],
        ['a 2D rectangular lattice with sides $a \\ne b$', 'rect', 'The reciprocal lattice is rectangular with sides $2\\pi/a$ and $2\\pi/b$.', '2'],
      ]);
      const pool = Object.keys(O).filter((k) => k !== C[1] && (C[3] === '3' ? !['sq', 'hex', 'rect'].includes(k) : ['sq', 'hex', 'rect'].includes(k)));
      const extra = C[3] === '2' ? ['a circle', 'an equilateral triangle'] : [];
      const o = pickMcq(r, O[C[1]], [...pool.map((k) => O[k]), ...extra]);
      return { q: `The first Brillouin zone of ${C[0]} is`, ...o, sol: `${C[2]} The first Brillouin zone is the Wigner-Seitz cell of the reciprocal lattice.`,
        trap: 'bcc and fcc swap in reciprocal space: the fcc metal has the truncated-octahedron zone, the bcc metal the dodecahedron.' };
    } },
  { id: 'rl-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'reciprocal vectors of centred cubic lattices', format: 'which is NOT',
    make(r) {
      const lat = choose(r, ['fcc', 'bcc']);
      const ok = lat === 'fcc' ? (t) => t.every((x) => x % 2 === 0) || t.every((x) => Math.abs(x) % 2 === 1) : (t) => (t[0] + t[1] + t[2]) % 2 === 0;
      const all = [[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1], [2, 2, 2], [1, 0, 0], [1, 1, 0], [2, 1, 0], [2, 1, 1], [3, 0, 0], [1, -1, 1], [0, 2, 0], [3, 1, 0], [0, 1, 1], [1, 0, -1], [3, 2, 1]];
      const good = all.filter(ok), bad = all.filter((t) => !ok(t));
      const not = r() < 0.6;
      const o = not ? pickMcq(r, trip(choose(r, bad)), good.map(trip)) : pickMcq(r, trip(choose(r, good)), bad.map(trip));
      const rule = lat === 'fcc' ? '$h, k, l$ all even or all odd' : '$h + k + l$ even';
      return { q: `For ${lat === 'fcc' ? 'an' : 'a'} ${lat} lattice of cubic edge $a$, reciprocal vectors are written $\\vec G = (2\\pi/a)(h, k, l)$ in the cubic axes. Which ONE triple $(h, k, l)$ ${not ? 'is <b>NOT</b>' : 'is'} a reciprocal lattice vector?`, ...o,
        sol: `With primitive vectors of the ${lat} lattice, $\\vec G\\cdot\\vec R = 2\\pi n$ for every lattice vector $\\vec R$ requires ${rule}. ${lat === 'fcc' ? 'These points form a bcc lattice of cube edge $4\\pi/a$.' : 'These points form an fcc lattice of cube edge $4\\pi/a$.'} So the answer is $${o.options[o.answer]}$.`,
        trap: 'The same rule is the X-ray selection rule: the allowed reflections of a centred lattice are exactly its reciprocal lattice points.' };
    } },
  { id: 'rl-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'size of the Brillouin zone', format: 'order of magnitude',
    make(r) {
      const a = round(2.5 + 3 * r(), 1), lam = choose(r, [400, 500, 633, 700, 1064]);
      const kb = Math.PI / (a * 1e-10), kl = 2 * Math.PI / (lam * 1e-9), x = kb / kl;
      const o = oomMcq(r, x);
      return { q: `A crystal has lattice constant $${a}$ Å. The ratio of the zone-boundary wavevector $\\pi/a$ to the wavevector of light of wavelength $${lam}$ nm is closest to`, ...o,
        sol: `$\\pi/a = ${fmt(kb, 3)}$ m$^{-1}$ and $2\\pi/\\lambda = ${fmt(kl, 3)}$ m$^{-1}$, so the ratio is $\\lambda/2a = ${fmt(x, 3)}$, nearest $10^{${o.k}}$. Light therefore probes only the very centre of the zone ($k \\approx 0$): optical absorption and Raman scattering see phonons and band transitions at $\\Gamma$ only.`,
        trap: 'Photon momentum is tiny on the scale of the Brillouin zone; X-rays (wavelength about 1 Å) are needed to span it.' };
    } },
];
