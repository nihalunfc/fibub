// Bravais lattices and the reciprocal lattice (GATE / CSIR NET level): primitive vectors and cell volumes, the
// reciprocal basis, G and lattice planes, reciprocal of sc/bcc/fcc/hexagonal and 2D lattices, Wigner-Seitz cells,
// Brillouin zones and their high-symmetry points, higher zones, free-electron energies and Fermi spheres in the zone,
// the Ewald limit. Original questions for fibub. Basics (Miller indices, packing) are in crystal-structure.
import { pick, int, choose, shuffle, mcqOptions, round, C } from '../_util.js';
import more from './reciprocal-lattice.more.gen.js';
import more2 from './reciprocal-lattice.more2.gen.js';

const PI = Math.PI, D = PI / 180, S2 = Math.SQRT2, S3 = Math.sqrt(3);
const HB = C.hbar ** 2 / (2 * C.me) / C.e * 1e20; // hbar^2/2m in eV Å^2 (3.81)
const bar = (n) => (n < 0 ? `\\bar{${-n}}` : `${n}`);
const hkl = (h, k, l) => `(${bar(h)}${bar(k)}${bar(l)})`;
const NAMES = { sc: 'simple cubic', bcc: 'body-centred cubic', fcc: 'face-centred cubic' };
const NPRIM = { sc: 1, bcc: 2, fcc: 4 };
// zone number of a 2D point k (in units of pi/a) for the square lattice: 1 + number of G closer to k than the origin
const zone2d = (x, y) => { let n = 1; for (let m = -4; m <= 4; m++) for (let p = -4; p <= 4; p++) { if (!m && !p) continue; const gx = 2 * m, gy = 2 * p; if ((x - gx) ** 2 + (y - gy) ** 2 < x * x + y * y - 1e-9) n++; } return n; };
const ZPTS = [[0.5, 0.3], [0.9, 0.8], [1.2, 0.3], [1.4, 0.4], [0.3, 1.5], [1.5, 0.9], [1.8, 0.4], [1.3, 1.1], [2.1, 0.3], [1.9, 0.7], [0.4, 2.2], [1.6, 1.3], [2.3, 0.6], [0.7, 0.2], [1.1, 0.6], [1.7, 1.1]];

export default {
  topic: 'reciprocal-lattice',
  items: [
    // ---------- level 1 ----------
    { id: 'rl-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'definition',
      q: 'The primitive vectors $\\vec b_j$ of the reciprocal lattice of a lattice with primitive vectors $\\vec a_i$ are defined by',
      options: ['$\\vec a_i\\times\\vec b_j = 2\\pi\\delta_{ij}$', '$\\vec a_i\\cdot\\vec b_j = \\delta_{ij}/2\\pi$', '$\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$', '$\\vec b_j = 2\\pi\\,\\vec a_j/|\\vec a_j|^2$ for every lattice'], answer: 2,
      sol: 'The reciprocal basis is fixed by the dot products $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$: each $\\vec b_j$ is perpendicular to the two $\\vec a_i$ with $i \\ne j$, and its length makes the third product equal to $2\\pi$. The explicit form is $\\vec b_1 = 2\\pi\\,\\vec a_2\\times\\vec a_3/[\\vec a_1\\cdot(\\vec a_2\\times\\vec a_3)]$ and cyclic.',
      trap: 'The formula $2\\pi\\vec a_j/|\\vec a_j|^2$ works only when the $\\vec a_i$ are mutually perpendicular. Crystallographers sometimes drop the $2\\pi$; physicists (and GATE) keep it.' },
    { id: 'rl-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'reciprocal of sc',
      q: 'The reciprocal lattice of a simple cubic lattice of lattice constant $a$ is',
      options: ['simple cubic with lattice constant $2\\pi/a$', 'simple cubic with lattice constant $a/2\\pi$', 'body-centred cubic with cube edge $4\\pi/a$', 'face-centred cubic with cube edge $4\\pi/a$'], answer: 0,
      sol: 'With $\\vec a_1 = a\\hat x$, $\\vec a_2 = a\\hat y$, $\\vec a_3 = a\\hat z$ the cell volume is $a^3$ and $\\vec b_1 = 2\\pi\\,(a\\hat y\\times a\\hat z)/a^3 = (2\\pi/a)\\hat x$, and similarly for the others. So the reciprocal lattice is again simple cubic, with spacing $2\\pi/a$.',
      trap: 'The reciprocal lattice has units of inverse length, so $a/2\\pi$ cannot be right. The bcc/fcc options belong to the centred cubic lattices.' },
    { id: 'rl-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'reciprocal of sc', unit: 'Å⁻¹',
      q: 'A simple cubic crystal has lattice constant $4.0$ Å. The length of a primitive vector of its reciprocal lattice is ______ Å$^{-1}$ (to three decimal places).',
      answer: 1.571, tol: 0.003, calc: () => 2 * PI / 4,
      sol: '$|\\vec b| = 2\\pi/a = 6.2832/4.0 = 1.571$ Å$^{-1}$.',
      trap: 'Writing $1/a = 0.25$ Å$^{-1}$ uses the crystallographers\' convention without the $2\\pi$.' },
    { id: 'rl-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'definition',
      q: 'A vector $\\vec G$ belongs to the reciprocal lattice of a Bravais lattice $\\{\\vec R\\}$ exactly when',
      options: ['$\\vec G\\cdot\\vec R = 0$ for every $\\vec R$', '$|\\vec G|\\,|\\vec R| = 2\\pi$ for the shortest $\\vec R$', '$\\vec G\\times\\vec R = 0$ for every $\\vec R$', '$e^{i\\vec G\\cdot\\vec R} = 1$ for every $\\vec R$'], answer: 3,
      sol: 'The reciprocal lattice is the set of wave vectors of plane waves that have the periodicity of the lattice: $e^{i\\vec G\\cdot(\\vec r + \\vec R)} = e^{i\\vec G\\cdot\\vec r}$, i.e. $e^{i\\vec G\\cdot\\vec R} = 1$, so $\\vec G\\cdot\\vec R$ is a whole multiple of $2\\pi$. With $\\vec G = h\\vec b_1 + k\\vec b_2 + l\\vec b_3$ and $\\vec R = n_1\\vec a_1 + \\dots$, $\\vec G\\cdot\\vec R = 2\\pi(hn_1 + kn_2 + ln_3)$.',
      trap: '$\\vec G\\cdot\\vec R = 0$ for every $\\vec R$ would force $\\vec G = 0$; the condition is "a multiple of $2\\pi$", not zero.' },
    { id: 'rl-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Brillouin zone',
      q: 'The first Brillouin zone of a crystal is',
      options: ['the conventional unit cell of the reciprocal lattice', 'the Wigner-Seitz cell of the reciprocal lattice', 'the Wigner-Seitz cell of the direct lattice', 'the region of $k$-space filled by electrons at $T = 0$'], answer: 1,
      sol: 'Take the reciprocal lattice point at the origin, draw the perpendicular bisector planes of the vectors to all other reciprocal lattice points, and keep the smallest region around the origin they enclose. That region is the Wigner-Seitz cell of the reciprocal lattice, called the first Brillouin zone. Every wave vector is equivalent (differs by a $\\vec G$) to exactly one point in it.',
      trap: 'The region filled by electrons is the Fermi sea; it coincides with the zone only by accident (e.g. a filled band).' },
    { id: 'rl-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Brillouin zone', unit: 'Å⁻¹',
      q: 'A one-dimensional lattice has spacing $a = 2.5$ Å. The total width of its first Brillouin zone along $k$ is ______ Å$^{-1}$ (to three decimal places).',
      answer: 2.513, tol: 0.003, calc: () => 2 * PI / 2.5,
      sol: 'The 1D reciprocal lattice has spacing $2\\pi/a$. The first zone runs from $-\\pi/a$ to $+\\pi/a$, a width of $2\\pi/a = 6.2832/2.5 = 2.513$ Å$^{-1}$.',
      trap: 'Giving $\\pi/a = 1.257$ Å$^{-1}$, the half-width (the distance from the centre to the zone edge).' },

    // ---------- level 2 ----------
    { id: 'rl-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'reciprocal of fcc',
      q: 'The reciprocal lattice of a face-centred cubic lattice with conventional cube edge $a$ is',
      options: ['face-centred cubic with cube edge $4\\pi/a$', 'simple cubic with edge $2\\pi/a$', 'body-centred cubic with cube edge $2\\pi/a$', 'body-centred cubic with cube edge $4\\pi/a$'], answer: 3,
      sol: 'The fcc primitive vectors $\\tfrac a2(0,1,1)$, $\\tfrac a2(1,0,1)$, $\\tfrac a2(1,1,0)$ span a cell of volume $a^3/4$. Working out $\\vec b_1 = 2\\pi\\,\\vec a_2\\times\\vec a_3/V$ gives $\\vec b_1 = \\tfrac{2\\pi}{a}(-1,1,1)$ and cyclic. These are the primitive vectors of a bcc lattice whose cube has edge $2\\times2\\pi/a = 4\\pi/a$.',
      trap: 'The bcc reciprocal lattice points are at $\\tfrac{2\\pi}{a}(\\pm1,\\pm1,\\pm1)$ and $\\tfrac{2\\pi}{a}(\\pm2,0,0)$: the cube edge is $4\\pi/a$, not $2\\pi/a$.' },
    { id: 'rl-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'zone volume', unit: 'Å⁻³',
      q: 'Copper is fcc with $a = 3.6$ Å. The volume of its first Brillouin zone is ______ Å$^{-3}$ (to one decimal place).',
      answer: 21.3, tol: 0.1, calc: () => (2 * PI) ** 3 / (3.6 ** 3 / 4),
      sol: 'The zone volume is $(2\\pi)^3/V_c$, where $V_c$ is the volume of a <em>primitive</em> cell. For fcc, $V_c = a^3/4 = 46.656/4 = 11.664$ Å$^3$. So $V_{BZ} = 248.05/11.664 = 21.3$ Å$^{-3}$.',
      trap: 'Using the conventional cube $a^3$ gives a zone four times too small (5.3 Å$^{-3}$).' },
    { id: 'rl-009', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'G and planes',
      q: 'The reciprocal lattice vector $\\vec G_{hkl} = h\\vec b_1 + k\\vec b_2 + l\\vec b_3$ (with $h, k, l$ having no common factor) and the family of lattice planes $(hkl)$ of spacing $d_{hkl}$ are related by',
      options: ['$\\vec G_{hkl}$ lies in the planes and $|\\vec G_{hkl}| = d_{hkl}$', '$\\vec G_{hkl}$ is normal to the planes and $|\\vec G_{hkl}| = 2\\pi/d_{hkl}$', '$\\vec G_{hkl}$ is normal to the planes and $|\\vec G_{hkl}| = 2\\pi d_{hkl}$', '$\\vec G_{hkl}$ makes $45^\\circ$ with the planes and $|\\vec G_{hkl}| = \\pi/d_{hkl}$'], answer: 1,
      sol: 'The plane $(hkl)$ nearest the origin cuts the axes at $\\vec a_1/h$, $\\vec a_2/k$, $\\vec a_3/l$. Differences such as $\\vec a_1/h - \\vec a_2/k$ lie in the plane, and $\\vec G\\cdot(\\vec a_1/h - \\vec a_2/k) = 2\\pi - 2\\pi = 0$, so $\\vec G$ is normal to the plane. The spacing is the projection of $\\vec a_1/h$ on the unit normal: $d = \\hat G\\cdot\\vec a_1/h = 2\\pi/|\\vec G|$. This holds for every lattice, cubic or not.',
      trap: 'Length and spacing are inversely related: closely spaced planes have long $\\vec G$.' },
    { id: 'rl-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'properties', format: 'multi',
      q: 'Which of the following statements about the reciprocal lattice are correct?',
      options: ['The reciprocal lattice of a Bravais lattice is itself a Bravais lattice.', 'The reciprocal of the reciprocal lattice is the original direct lattice.', 'Reciprocal lattice vectors have the dimension of length.', 'Adding a basis of several atoms to each lattice point changes the reciprocal lattice.'], answer: [0, 1],
      sol: '(1) True: integer combinations of $\\vec b_1, \\vec b_2, \\vec b_3$ form a lattice. (2) True: the definition $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$ is symmetric in $\\vec a$ and $\\vec b$. (3) False: $\\vec b$ has units of inverse length (Å$^{-1}$), like a wave vector. (4) False: the reciprocal lattice depends only on the Bravais lattice. The basis changes the structure factor, i.e. how strongly each $\\vec G$ diffracts, not where the $\\vec G$ are.',
      trap: 'Missing reflections in diffraction come from the basis through the structure factor; the reciprocal lattice points are still there, just with zero weight.' },
    { id: 'rl-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'zone shapes',
      q: 'The first Brillouin zone of the face-centred cubic lattice has the shape of',
      options: ['a cube', 'a rhombic dodecahedron', 'a regular octahedron', 'a truncated octahedron'], answer: 3,
      sol: 'The reciprocal of fcc is bcc. Its 8 nearest points $\\tfrac{2\\pi}{a}(\\pm1,\\pm1,\\pm1)$ give 8 hexagonal faces, and the 6 next-nearest $\\tfrac{2\\pi}{a}(\\pm2,0,0)$ cut off the corners as 6 square faces. Eight hexagons and six squares make a truncated octahedron (14 faces).',
      trap: 'The rhombic dodecahedron is the zone of the bcc lattice (its reciprocal is fcc). It is easy to swap the two.' },
    { id: 'rl-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'zone shapes',
      q: 'The first Brillouin zone of the body-centred cubic lattice is',
      options: ['a rhombic dodecahedron with 12 faces', 'a truncated octahedron with 14 faces', 'a cube with 6 faces', 'a regular tetrahedron with 4 faces'], answer: 0,
      sol: 'The reciprocal of bcc is fcc, whose 12 nearest neighbours $\\tfrac{2\\pi}{a}(\\pm1,\\pm1,0)$ and permutations define 12 bisecting planes. These planes alone close the zone, giving 12 rhombic faces: a rhombic dodecahedron.',
      trap: 'A zone always has the full point symmetry of the lattice, so a tetrahedron (no inversion centre) cannot be a Brillouin zone.' },
    { id: 'rl-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'zone volume', unit: 'Å⁻²',
      q: 'A two-dimensional square lattice has $a = 3.0$ Å. The area of its first Brillouin zone is ______ Å$^{-2}$ (to two decimal places).',
      answer: 4.39, tol: 0.02, calc: () => (2 * PI / 3) ** 2,
      sol: 'The reciprocal lattice is square with side $2\\pi/a = 2.094$ Å$^{-1}$. The first zone is the square from $-\\pi/a$ to $\\pi/a$ in each direction, of area $(2\\pi/a)^2 = 4.39$ Å$^{-2}$. In 2D the zone area is $(2\\pi)^2/A_c$.',
      trap: 'Squaring $\\pi/a$ instead of $2\\pi/a$ gives a quarter of the area.' },
    { id: 'rl-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'primitive cell',
      q: 'The fcc primitive vectors $\\vec a_1 = \\tfrac a2(0,1,1)$, $\\vec a_2 = \\tfrac a2(1,0,1)$, $\\vec a_3 = \\tfrac a2(1,1,0)$ span a cell of volume',
      options: ['$a^3/2$', '$a^3/8$', '$a^3/4$', '$a^3$'], answer: 2,
      sol: '$\\vec a_2\\times\\vec a_3 = \\tfrac{a^2}{4}(0\\cdot0 - 1\\cdot1,\\ 1\\cdot1 - 1\\cdot0,\\ 1\\cdot1 - 0\\cdot1) = \\tfrac{a^2}4(-1,1,1)$. Then $\\vec a_1\\cdot(\\vec a_2\\times\\vec a_3) = \\tfrac a2\\cdot\\tfrac{a^2}4(0 + 1 + 1) = a^3/4$. It must be: the cube holds 4 lattice points and a primitive cell holds one.',
      trap: 'The product of the three lengths $(a/\\sqrt2)^3 = a^3/2\\sqrt2$ is not the volume; the vectors are not perpendicular.' },
    { id: 'rl-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'G and planes', unit: 'Å⁻¹',
      q: 'For a simple cubic lattice with $a = 5.0$ Å, the length of the reciprocal lattice vector $\\vec G_{111}$ is ______ Å$^{-1}$ (to three decimal places).',
      answer: 2.177, tol: 0.003, calc: () => 2 * PI * S3 / 5,
      sol: '$\\vec G_{111} = \\tfrac{2\\pi}a(1,1,1)$, so $|\\vec G| = \\tfrac{2\\pi\\sqrt3}{a} = \\tfrac{10.883}{5.0} = 2.177$ Å$^{-1}$. Check: $d_{111} = a/\\sqrt3 = 2.887$ Å and $2\\pi/d = 2.177$ Å$^{-1}$.',
      trap: 'Adding the components ($3\\times2\\pi/a$) instead of taking the length.' },
    { id: 'rl-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'G and planes',
      q: 'In a crystal of any symmetry (for example triclinic), the normal to the lattice planes $(hkl)$ is always parallel to',
      options: ['the direct-lattice direction $[hkl] = h\\vec a_1 + k\\vec a_2 + l\\vec a_3$', 'the reciprocal-lattice vector $h\\vec b_1 + k\\vec b_2 + l\\vec b_3$', 'the vector $\\vec a_1/h + \\vec a_2/k + \\vec a_3/l$', 'the cross product $\\vec a_1\\times\\vec a_2$'], answer: 1,
      sol: 'The reciprocal vector $\\vec G_{hkl}$ is normal to $(hkl)$ in every lattice (see the proof via in-plane vectors $\\vec a_1/h - \\vec a_2/k$). The direct direction $[hkl]$ is normal to $(hkl)$ only when the axes are orthogonal and equal, i.e. in cubic crystals.',
      trap: 'The cubic shortcut "$[hkl]\\perp(hkl)$" fails for tetragonal, hexagonal and lower symmetry.' },

    // ---------- level 3 ----------
    { id: 'rl-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hexagonal zone', unit: 'Å⁻¹',
      q: 'Graphene has a two-dimensional hexagonal (triangular) Bravais lattice with $a = 2.46$ Å. The distance from the zone centre $\\Gamma$ to a zone corner $K$ is ______ Å$^{-1}$ (to three decimal places).',
      answer: 1.703, tol: 0.003, calc: () => 4 * PI / (3 * 2.46),
      sol: 'The reciprocal lattice is hexagonal with $|\\vec b| = 4\\pi/(\\sqrt3a)$. The zone is a regular hexagon whose edge midpoints $M$ lie at $|\\vec b|/2 = 2\\pi/(\\sqrt3a)$. The corner is further by $1/\\cos30^\\circ$: $\\Gamma K = \\tfrac{2\\pi}{\\sqrt3a}\\cdot\\tfrac{2}{\\sqrt3} = \\tfrac{4\\pi}{3a} = \\tfrac{12.566}{7.38} = 1.703$ Å$^{-1}$. The Dirac cones of graphene sit at these $K$ points.',
      trap: 'Using $\\Gamma M = 2\\pi/(\\sqrt3 a) = 1.475$ Å$^{-1}$, the edge midpoint.' },
    { id: 'rl-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'symmetry points', unit: 'Å⁻¹',
      q: 'Aluminium is fcc with $a = 4.05$ Å. The distance from $\\Gamma$ to the $L$ point (centre of a hexagonal face) of its first Brillouin zone is ______ Å$^{-1}$ (to three decimal places).',
      answer: 1.344, tol: 0.003, calc: () => S3 * PI / 4.05,
      sol: 'The hexagonal faces bisect the shortest reciprocal vectors $\\tfrac{2\\pi}{a}(1,1,1)$, of length $2\\sqrt3\\pi/a$. The face centre $L = \\tfrac{\\pi}{a}(1,1,1)$ is half way: $\\Gamma L = \\sqrt3\\pi/a = 5.441/4.05 = 1.344$ Å$^{-1}$.',
      trap: 'Taking $X$ at $2\\pi/a$ (the square face) is a different, farther point (1.551 Å$^{-1}$).' },
    { id: 'rl-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: '2D reciprocal',
      q: 'A 2D lattice has $\\vec a_1 = a\\hat x$ and $\\vec a_2 = \\tfrac a2(\\hat x + \\sqrt3\\,\\hat y)$. Its reciprocal primitive vectors are',
      options: ['$\\vec b_1 = \\tfrac{2\\pi}{a}\\hat x$, $\\vec b_2 = \\tfrac{2\\pi}{a}\\hat y$', '$\\vec b_1 = \\tfrac{2\\pi}{a}(\\hat x + \\hat y/\\sqrt3)$, $\\vec b_2 = \\tfrac{2\\pi}{a}\\hat y$', '$\\vec b_1 = \\tfrac{2\\pi}{a}(\\hat x - \\hat y/\\sqrt3)$, $\\vec b_2 = \\tfrac{4\\pi}{\\sqrt3a}\\hat y$', '$\\vec b_1 = \\tfrac{4\\pi}{\\sqrt3a}\\hat x$, $\\vec b_2 = \\tfrac{2\\pi}{a}(\\hat x + \\sqrt3\\hat y)$'], answer: 2,
      sol: 'Check $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$ for the third pair. $\\vec a_1\\cdot\\vec b_1 = 2\\pi$; $\\vec a_2\\cdot\\vec b_1 = \\tfrac a2\\cdot\\tfrac{2\\pi}a(1 - \\sqrt3/\\sqrt3) = 0$; $\\vec a_1\\cdot\\vec b_2 = 0$; $\\vec a_2\\cdot\\vec b_2 = \\tfrac{a\\sqrt3}{2}\\cdot\\tfrac{4\\pi}{\\sqrt3 a} = 2\\pi$. Both have length $4\\pi/(\\sqrt3a)$ and make $120^\\circ$ with each other: the reciprocal of a hexagonal lattice is hexagonal, rotated by $30^\\circ$.',
      trap: 'Testing only $\\vec a_1\\cdot\\vec b_1 = 2\\pi$ passes several options. The cross conditions $\\vec a_2\\cdot\\vec b_1 = 0$ decide.' },
    { id: 'rl-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Bravais lattices', format: 'multi',
      q: 'Which of the following point arrays are Bravais lattices?',
      options: ['the 2D triangular array (every point with six neighbours at $60^\\circ$ spacing)', 'the 2D kagome array of corner-sharing triangles', 'the hexagonal close-packed array of atom centres', 'the base-centred monoclinic array'], answer: [0, 3],
      sol: 'Test: every point must have identical surroundings with the same orientation. The triangular array passes (it is the 2D hexagonal lattice). Base-centred monoclinic is one of the 14 Bravais lattices. The kagome array has three inequivalent points per cell (a triangular lattice with a 3-point basis). In hcp the A-layer and B-layer atoms see their neighbours rotated by $60^\\circ$ relative to each other, so hcp is a hexagonal lattice with a 2-atom basis.',
      trap: '"Every atom has 12 neighbours at the same distance" (true in hcp) is not enough: the neighbours must also point the same way.' },
    { id: 'rl-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi sphere in zone',
      q: 'A monovalent metal is fcc. Treating its electrons as free, the ratio of the Fermi wave vector $k_F$ to the distance $\\Gamma L$ from the zone centre to the nearest zone face is ______ (to two decimal places).',
      answer: 0.90, tol: 0.01, calc: () => Math.cbrt(12 * PI * PI) / (S3 * PI),
      sol: 'Electron density $n = 4/a^3$ (one electron per atom, four atoms per cube). $k_F = (3\\pi^2 n)^{1/3} = (12\\pi^2)^{1/3}/a = 4.911/a$. The nearest faces are the hexagons at $\\Gamma L = \\sqrt3\\pi/a = 5.441/a$. Ratio $= 0.90$: the Fermi sphere fits inside the zone without touching it, which is why the alkali-like metals (and to a good degree Cu, Ag, Au) have nearly spherical Fermi surfaces.',
      trap: 'Comparing with $\\Gamma X = 2\\pi/a$ (not the nearest face) gives 0.78 and hides how close the sphere comes to the $L$ faces.' },
    { id: 'rl-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fermi sphere in zone',
      q: 'A hypothetical divalent metal has a simple cubic lattice of constant $a$. In the free-electron model its Fermi wave vector in units of $\\pi/a$ is ______ (to two decimal places).',
      answer: 1.24, tol: 0.01, calc: () => Math.cbrt(6 * PI * PI) / PI,
      sol: '$n = 2/a^3$, so $k_F = (3\\pi^2\\cdot2/a^3)^{1/3} = (6\\pi^2)^{1/3}/a = 3.898/a = 1.24\\,\\pi/a$. The zone faces are at $\\pi/a$, so the Fermi sphere pokes through the faces into the second zone, while the zone corners at $\\sqrt3\\pi/a$ stay empty. A divalent metal can therefore conduct even though two electrons per cell could, in principle, fill exactly one band.',
      trap: 'Expecting the Fermi sphere to equal the zone volume: it has the same volume, but a sphere and a cube of equal volume do not coincide.' },
    { id: 'rl-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'zone volume',
      q: 'The volume of the first Brillouin zone of a bcc lattice with conventional cube edge $a$ is',
      options: ['$8\\pi^3/a^3$', '$32\\pi^3/a^3$', '$4\\pi^3/a^3$', '$16\\pi^3/a^3$'], answer: 3,
      sol: 'The bcc primitive cell has volume $a^3/2$ (two lattice points per cube). Zone volume $= (2\\pi)^3/(a^3/2) = 2\\cdot8\\pi^3/a^3 = 16\\pi^3/a^3$.',
      trap: '$8\\pi^3/a^3$ uses the conventional cube; $32\\pi^3/a^3$ is the fcc answer (primitive volume $a^3/4$).' },
    { id: 'rl-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'zone boundaries',
      q: 'For elastic scattering, the Laue condition $\\vec k\\,\' - \\vec k = \\vec G$ is satisfied exactly when the incident wave vector $\\vec k$ (drawn from the origin of $k$-space) ends',
      options: ['on the plane that perpendicularly bisects the line from the origin to $-\\vec G$', 'anywhere on the sphere of radius $|\\vec G|$', 'at a reciprocal lattice point', 'inside the first Brillouin zone'], answer: 0,
      sol: 'Elastic: $|\\vec k\\,\'| = |\\vec k|$, so $|\\vec k + \\vec G|^2 = k^2$, giving $2\\vec k\\cdot\\vec G + G^2 = 0$, i.e. $\\vec k\\cdot(-\\hat G) = |\\vec G|/2$. Since $-\\vec G$ is also a reciprocal vector, $\\vec k$ ends on the perpendicular bisector plane of $-\\vec G$: a Bragg plane. The Brillouin zone boundaries are exactly these planes, which is why electrons with $\\vec k$ on a zone face are Bragg-reflected and band gaps open there.',
      trap: 'Ending at a reciprocal lattice point is not required; a whole plane of $\\vec k$ diffracts off each $\\vec G$.' },
    { id: 'rl-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-cubic spacing', unit: 'Å',
      q: 'A tetragonal crystal has $a = 4.0$ Å and $c = 6.0$ Å. Using $|\\vec G_{hkl}| = 2\\pi/d_{hkl}$, the spacing of the $(101)$ planes is ______ Å (to three decimal places).',
      answer: 3.328, tol: 0.003, calc: () => 1 / Math.sqrt(1 / 16 + 1 / 36),
      sol: 'The reciprocal lattice is tetragonal with $|\\vec b_1| = |\\vec b_2| = 2\\pi/a$ and $|\\vec b_3| = 2\\pi/c$, all orthogonal. $|\\vec G_{101}|^2 = (2\\pi)^2(1/a^2 + 1/c^2)$, so $1/d^2 = 1/16 + 1/36 = 0.09028$ Å$^{-2}$ and $d = 3.328$ Å.',
      trap: 'Using the cubic formula with an "average" lattice constant.' },
    { id: 'rl-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-cubic spacing', unit: 'Å',
      q: 'A hexagonal crystal has $a = 3.2$ Å and $c = 5.2$ Å. The spacing of its $(100)$ planes is ______ Å (to three decimal places).',
      answer: 2.771, tol: 0.003, calc: () => 3.2 * S3 / 2,
      sol: 'For hexagonal axes, $\\dfrac1{d^2} = \\dfrac43\\,\\dfrac{h^2 + hk + k^2}{a^2} + \\dfrac{l^2}{c^2}$, which follows from $|\\vec b_1| = |\\vec b_2| = 4\\pi/(\\sqrt3 a)$ at $60^\\circ$ to each other. For $(100)$: $1/d^2 = 4/(3a^2)$, so $d = \\sqrt3a/2 = 2.771$ Å. Geometrically: the $(100)$ planes are rows of the triangular net, $\\sqrt3a/2$ apart.',
      trap: 'Answering $d = a = 3.2$ Å, as for a square lattice.' },
    { id: 'rl-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hexagonal zone', format: 'multi',
      q: 'For a 2D hexagonal lattice of side $a$, which statements are correct?',
      options: ['Its reciprocal lattice is also hexagonal.', 'The reciprocal lattice is rotated by $30^\\circ$ relative to the direct lattice.', 'The reciprocal primitive vectors have length $2\\pi/a$.', 'The first Brillouin zone is a regular hexagon.'], answer: [0, 1, 3],
      sol: 'From the explicit construction, $\\vec b_1 = \\tfrac{2\\pi}a(\\hat x - \\hat y/\\sqrt3)$ and $\\vec b_2 = \\tfrac{4\\pi}{\\sqrt3a}\\hat y$: both of length $4\\pi/(\\sqrt3a)$ (not $2\\pi/a$), at $120^\\circ$, so the reciprocal lattice is hexagonal and turned by $30^\\circ$ ($\\vec b_2$ along $\\hat y$ while $\\vec a_1$ is along $\\hat x$). The Wigner-Seitz cell of a hexagonal lattice is a regular hexagon.',
      trap: '$2\\pi/a$ holds only for orthogonal axes; the $1/\\sin60^\\circ$ factor gives $4\\pi/(\\sqrt3a)$.' },
    { id: 'rl-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'reciprocal of fcc',
      q: 'For an fcc lattice with conventional cube edge $a$, which of these vectors is a reciprocal lattice vector?',
      options: ['$\\tfrac{2\\pi}{a}(1,0,0)$', '$\\tfrac{2\\pi}{a}(1,1,0)$', '$\\tfrac{2\\pi}{a}(2,1,0)$', '$\\tfrac{2\\pi}{a}(1,1,1)$'], answer: 3,
      sol: 'The reciprocal lattice is bcc with cube edge $4\\pi/a$: in units of $2\\pi/a$ its points are $(h,k,l)$ with all even (cube corners) or all odd (body centres). Only $(1,1,1)$ qualifies. Equivalently, $\\vec G\\cdot\\vec R$ must be a multiple of $2\\pi$ for $\\vec R = \\tfrac a2(1,1,0)$: $(1,0,0)$ gives $\\pi$, which fails.',
      trap: 'Thinking of the simple cubic indexing, in which every integer triple is allowed. This is the same rule as "fcc reflections need unmixed indices".' },

    // ---------- level 4 ----------
    { id: 'rl-029', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Fermi sphere in zone',
      q: 'A 2D square lattice (constant $a$) holds two free electrons per primitive cell. Compared with the first Brillouin zone, the free-electron Fermi circle',
      options: ['lies entirely inside the zone', 'crosses the zone edges but does not reach the corners', 'just passes through the zone corners', 'encloses the whole first zone'], answer: 1,
      sol: 'In 2D, $n = 2/a^2$ and $k_F = \\sqrt{2\\pi n} = \\sqrt{4\\pi}/a = 3.545/a$. The edge midpoints are at $\\pi/a = 3.142/a$ and the corners at $\\sqrt2\\pi/a = 4.443/a$. So $k_F$ lies between them: electrons spill into the second zone near the edge centres, and pockets near the corners of the first zone stay empty. The circle has the same area as the zone, $(2\\pi/a)^2$, but not the same shape.',
      trap: '"Two electrons per cell fill one band, so the circle equals the zone": equal area, different shape.' },
    { id: 'rl-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'higher zones', unit: 'Å⁻²',
      q: 'A 2D square lattice has $a = 2.0$ Å. The area of its <em>second</em> Brillouin zone is ______ Å$^{-2}$ (to two decimal places).',
      answer: 9.87, tol: 0.03, calc: () => (2 * PI / 2) ** 2,
      sol: 'The second zone lies between the first-zone square (bounded by the bisectors of $\\tfrac{2\\pi}a(\\pm1,0)$, $\\tfrac{2\\pi}a(0,\\pm1)$) and the square rotated by $45^\\circ$ formed by the bisectors of $\\tfrac{2\\pi}a(\\pm1,\\pm1)$, with corners at $(\\pm2\\pi/a, 0)$ and $(0, \\pm2\\pi/a)$. The rotated square has area $\\tfrac12(4\\pi/a)^2 = 8\\pi^2/a^2$; subtract the first zone $4\\pi^2/a^2$ to get $4\\pi^2/a^2 = \\pi^2 = 9.87$ Å$^{-2}$ for $a = 2$ Å. Every zone has the same area: each can be translated piecewise by $\\vec G$s onto the first.',
      trap: 'Taking the whole rotated square ($2\\pi^2$ = 19.74 Å$^{-2}$) as the second zone.' },
    { id: 'rl-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'reciprocal of bcc', unit: 'Å⁻¹',
      q: 'Sodium is bcc with $a = 4.23$ Å. The length of its shortest non-zero reciprocal lattice vector is ______ Å$^{-1}$ (to three decimal places).',
      answer: 2.101, tol: 0.003, calc: () => 2 * S2 * PI / 4.23,
      sol: 'The reciprocal of bcc is fcc with cube edge $4\\pi/a$. The shortest fcc vector is a half face diagonal: $\\tfrac{4\\pi}{a}\\cdot\\tfrac{\\sqrt2}{2} = \\tfrac{2\\sqrt2\\pi}{a} = \\tfrac{8.886}{4.23} = 2.101$ Å$^{-1}$. It corresponds to the most widely spaced bcc planes, $\\{110\\}$, with $d = a/\\sqrt2$: $2\\pi/d$ agrees.',
      trap: 'Taking $\\vec G_{100} = 2\\pi/a$: in bcc, $(100)$ is not a lattice-plane family of spacing $a$ (the body centres sit half way), so $2\\pi/a$ is not a reciprocal vector.' },
    { id: 'rl-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Wigner-Seitz cell', format: 'multi',
      q: 'Which statements about the Wigner-Seitz cell of a Bravais lattice are correct?',
      options: ['It contains exactly one lattice point.', 'It has the full point-group symmetry of the lattice.', 'For a bcc lattice its volume equals that of the conventional cube.', 'For a simple cubic lattice it is a cube.'], answer: [0, 1, 3],
      sol: 'The Wigner-Seitz cell is the set of points closer to one lattice point than to any other, so it holds exactly one point and is primitive: its volume is the primitive volume, $a^3/2$ for bcc (not $a^3$). Being built only from distances, it inherits every symmetry of the lattice. For sc the bisecting planes of the six nearest neighbours give a cube of side $a$.',
      trap: 'A primitive cell and the conventional cube differ in volume for every centred lattice.' },
    { id: 'rl-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'zone shapes',
      q: 'The first Brillouin zone of a face-centred cubic lattice is bounded by how many faces in all? ______',
      answer: 14, tol: 0, calc: () => 8 + 6,
      sol: 'Its reciprocal lattice is bcc. The 8 nearest reciprocal points $\\tfrac{2\\pi}a(\\pm1,\\pm1,\\pm1)$ give hexagonal faces; the 6 next-nearest $\\tfrac{2\\pi}a(\\pm2,0,0)$ give square faces that truncate the octahedron. Points farther out do not reach the zone. Total $8 + 6 = 14$.',
      trap: 'Stopping at the 8 nearest neighbours gives an octahedron; the square faces cut its corners.' },
    { id: 'rl-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'symmetry points',
      q: 'For a bcc lattice with cube edge $a$, the point of the first Brillouin zone surface nearest to $\\Gamma$ lies at a distance',
      options: ['$\\pi/a$', '$\\sqrt3\\pi/a$', '$\\sqrt2\\pi/a$', '$2\\pi/a$'], answer: 2,
      sol: 'The reciprocal lattice is fcc; the shortest reciprocal vectors are $\\tfrac{2\\pi}a(1,1,0)$ and permutations, of length $2\\sqrt2\\pi/a$. The zone faces bisect them, so the nearest surface point (the face centre $N$) is at $\\sqrt2\\pi/a$. The farthest corner $H = \\tfrac{2\\pi}a(1,0,0)$ is at $2\\pi/a$.',
      trap: '$\\pi/a$ is the simple cubic answer.' },
    { id: 'rl-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'primitive cell',
      q: 'A lattice has primitive vectors $\\vec a_1 = a(1,0,0)$, $\\vec a_2 = a(0,1,0)$ and $\\vec a_3 = \\tfrac a2(1,1,1)$. This lattice is',
      options: ['simple cubic with constant $a$', 'face-centred cubic with cube edge $a$', 'body-centred tetragonal with $c \\ne a$', 'body-centred cubic with cube edge $a$'], answer: 3,
      sol: 'Integer combinations give all points $a(n_1, n_2, 0)$ plus $n_3\\,\\tfrac a2(1,1,1)$. With $n_3 = 2$ we reach $a(1,1,1)$, hence $a(0,0,1)$ after subtracting $\\vec a_1 + \\vec a_2$: the cube corners. Odd $n_3$ gives body centres. So the set is bcc with edge $a$, and the cell volume $|\\vec a_1\\cdot(\\vec a_2\\times\\vec a_3)| = a^3/2$ confirms two points per cube. Many different primitive sets describe the same lattice.',
      trap: 'Comparing with the symmetric textbook set $\\tfrac a2(-1,1,1)$ etc. and concluding it is not bcc. Check the points generated, not the look of the vectors.' },
    { id: 'rl-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '2D reciprocal', unit: 'Å⁻²',
      q: 'An oblique 2D lattice has $|\\vec a_1| = 3.0$ Å, $|\\vec a_2| = 4.0$ Å and an angle of $60^\\circ$ between them. The area of its first Brillouin zone is ______ Å$^{-2}$ (to two decimal places).',
      answer: 3.80, tol: 0.02, calc: () => (2 * PI) ** 2 / (12 * Math.sin(60 * D)),
      sol: 'Cell area $A_c = |\\vec a_1||\\vec a_2|\\sin\\gamma = 12\\times0.8660 = 10.392$ Å$^2$. The zone area is $(2\\pi)^2/A_c = 39.478/10.392 = 3.80$ Å$^{-2}$. No need to construct the zone: its area is fixed by the cell area alone.',
      trap: 'Using $|\\vec a_1||\\vec a_2| = 12$ Å$^2$ without the $\\sin\\gamma$.' },
    { id: 'rl-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: '2D reciprocal',
      q: 'In two dimensions, if the primitive vectors $\\vec a_1, \\vec a_2$ make an angle $\\gamma$, the reciprocal vectors $\\vec b_1, \\vec b_2$ make an angle',
      options: ['$\\gamma$', '$90^\\circ - \\gamma$', '$90^\\circ + \\gamma$', '$180^\\circ - \\gamma$'], answer: 3,
      sol: '$\\vec b_1 \\perp \\vec a_2$ and $\\vec b_2 \\perp \\vec a_1$. Rotating both $\\vec a$s by $90^\\circ$ in opposite senses (as perpendicularity plus the positive products $\\vec a_i\\cdot\\vec b_i > 0$ require) turns the angle into its supplement: $180^\\circ - \\gamma$. Check with the hexagonal lattice: $\\gamma = 60^\\circ$ gives reciprocal vectors at $120^\\circ$, as the explicit $\\vec b_1 = \\tfrac{2\\pi}a(\\hat x - \\hat y/\\sqrt3)$, $\\vec b_2 \\propto \\hat y$ show ($\\cos = -1/2$).',
      trap: 'For a rectangular lattice all options except $90^\\circ\\pm\\gamma$ give $90^\\circ$, so test with a non-right angle.' },
    { id: 'rl-040', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'free-electron energies', unit: 'eV',
      q: 'A 2D rectangular lattice has $a = 3.0$ Å along $x$ and $b = 5.0$ Å along $y$. For a free electron, the lowest kinetic energy at any point on the boundary of the first Brillouin zone is ______ eV (to two decimal places). Use $\\hbar^2/2m = 3.81$ eV Å$^2$.',
      answer: 1.50, tol: 0.02, calc: () => 3.81 * (PI / 5) ** 2,
      sol: 'The zone is the rectangle $|k_x| \\le \\pi/a$, $|k_y| \\le \\pi/b$. The boundary point nearest $\\Gamma$ is the centre of the edge at $k_y = \\pi/b$ (the longer real-space axis gives the shorter reciprocal distance): $k = \\pi/5.0 = 0.6283$ Å$^{-1}$. $E = 3.81\\times0.3948 = 1.50$ eV.',
      trap: 'Using $\\pi/a$ (the closer-spaced direction in real space) gives 4.18 eV; the corner gives 5.68 eV.' },

    // ---------- level 5 ----------
    { id: 'rl-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'symmetry points', unit: 'Å⁻¹',
      q: 'Copper is fcc with $a = 3.61$ Å. The $W$ point of the fcc Brillouin zone, where a square face meets two hexagonal faces, lies at $\\tfrac{2\\pi}{a}(1, \\tfrac12, 0)$. Its distance from $\\Gamma$ is ______ Å$^{-1}$ (to three decimal places).',
      answer: 1.946, tol: 0.003, calc: () => (2 * PI / 3.61) * Math.sqrt(1.25),
      sol: '$|\\Gamma W| = \\tfrac{2\\pi}{a}\\sqrt{1 + \\tfrac14} = \\tfrac{\\sqrt5\\,\\pi}{a} = \\tfrac{7.025}{3.61} = 1.946$ Å$^{-1}$. Check it lies on the zone surface: the square face is $k_x = 2\\pi/a$ (satisfied), and the hexagonal face $k_x + k_y + k_z = \\tfrac32\\cdot\\tfrac{2\\pi}a$ is satisfied too ($1 + \\tfrac12 + 0 = \\tfrac32$). $W$ is the farthest point of the zone from $\\Gamma$.',
      trap: 'Using $\\pi/a$ instead of $2\\pi/a$ as the unit halves the answer.' },
    { id: 'rl-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'symmetry points', format: 'multi',
      q: 'For an fcc lattice, points in $k$-space are written in units of $2\\pi/a$. Which of these points lie <em>on the surface</em> of the first Brillouin zone?',
      options: ['$(1, 0, 0)$', '$(\\tfrac12, \\tfrac12, 0)$', '$(\\tfrac34, \\tfrac34, 0)$', '$(1, \\tfrac12, \\tfrac12)$'], answer: [0, 2],
      sol: 'The zone (truncated octahedron) is $|k_x| + |k_y| + |k_z| \\le \\tfrac32$ (hexagonal faces) and $|k_i| \\le 1$ (square faces), in units of $2\\pi/a$. A point is on the surface when it satisfies both with at least one equality. $(1,0,0)$: square face, sum $1 < 1.5$: on the surface ($X$). $(\\tfrac12,\\tfrac12,0)$: sum 1, all $< 1$: inside. $(\\tfrac34,\\tfrac34,0)$: sum $= 1.5$: on a hexagonal-face edge ($K$). $(1,\\tfrac12,\\tfrac12)$: sum 2 $> 1.5$: outside.',
      trap: '$(1,\\tfrac12,\\tfrac12)$ looks like a face point because one coordinate equals 1, but it breaks the hexagonal-face condition.' },
    { id: 'rl-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'lattice vs basis',
      q: 'A crystal is described with a simple cubic cell of side $a$ holding identical atoms at $(0,0,0)$ and $(\\tfrac12,\\tfrac12,\\tfrac12)a$. In this simple cubic indexing, the Fourier components $V_{\\vec G}$ of the crystal potential, $\\vec G = \\tfrac{2\\pi}a(h,k,l)$, vanish for',
      options: ['$h + k + l$ even', '$h, k, l$ mixed odd and even', 'no $(hkl)$ at all', '$h + k + l$ odd'], answer: 3,
      sol: '$V_{\\vec G} \\propto v(G)\\,[1 + e^{i\\pi(h+k+l)}]$, which is zero when $h + k + l$ is odd. This is no accident: the structure is really bcc with a one-atom basis, whose reciprocal lattice is fcc (in these units, $h + k + l$ even). The "missing" components are just points that are not in the true reciprocal lattice. A potential with the lattice period can only have Fourier components on the reciprocal lattice of its true Bravais lattice.',
      trap: 'Mixed indices vanishing is the fcc rule; it would apply to atoms at the face centres.' },
    { id: 'rl-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'zone volume', unit: 'Å⁻³',
      q: 'A hexagonal Bravais lattice has $a = 2.5$ Å and $c = 4.0$ Å. The volume of its first Brillouin zone is ______ Å$^{-3}$ (to two decimal places).',
      answer: 11.46, tol: 0.05, calc: () => (2 * PI) ** 3 / (S3 / 2 * 2.5 ** 2 * 4),
      sol: 'The primitive cell is a rhombus of side $a$ and angle $60^\\circ$, area $\\tfrac{\\sqrt3}2a^2 = 5.413$ Å$^2$, times height $c$: $V_c = 21.65$ Å$^3$. Zone volume $(2\\pi)^3/V_c = 248.05/21.65 = 11.46$ Å$^{-3}$. (For hcp metals the same lattice holds two atoms per cell; the zone is still this hexagonal prism.)',
      trap: 'Using the hexagonal prism of three cells ($\\tfrac{3\\sqrt3}2a^2c$) as the primitive cell.' },
    { id: 'rl-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Ewald limit',
      q: 'A simple cubic crystal with $a = 3.00$ Å is studied with X-rays of $\\lambda = 1.54$ Å, turning the crystal through all orientations. The largest value of $h^2 + k^2 + l^2$ among the reflections that can be observed is ______.',
      answer: 14, tol: 0, calc: () => { const m = Math.floor((2 * 3 / 1.54) ** 2); for (let N = m; N > 0; N--) { for (let h = 0; h * h <= N; h++) for (let k = 0; h * h + k * k <= N; k++) { const l = Math.sqrt(N - h * h - k * k); if (Number.isInteger(l)) return N; } } return 0; },
      sol: 'The Ewald sphere has radius $2\\pi/\\lambda$; rotating the crystal sweeps every $\\vec G$ with $|\\vec G| \\le 4\\pi/\\lambda$ (the limiting sphere). With $|\\vec G| = 2\\pi\\sqrt N/a$ this is $N \\le (2a/\\lambda)^2 = (3.896)^2 = 15.18$. But 15 cannot be written as $h^2 + k^2 + l^2$ (numbers of the form $8m + 7$ never can), so the largest observable is $N = 14$, the $(321)$ family.',
      trap: 'Answering 15: the bound allows it, but no $(hkl)$ has $h^2 + k^2 + l^2 = 15$.' },
    { id: 'rl-044', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Brillouin zone', format: 'multi',
      q: 'For a simple cubic lattice of constant $a$ made of $N$ primitive cells (periodic boundary conditions), which statements about its first Brillouin zone are correct?',
      options: ['It is a cube of side $2\\pi/a$ centred on $\\Gamma$.', 'Its volume is $(2\\pi/a)^3$.', 'Its corners lie at a distance $\\sqrt3\\pi/a$ from $\\Gamma$.', 'It contains $2N$ allowed wave vectors.'], answer: [0, 1, 2],
      sol: 'The bisectors of $\\tfrac{2\\pi}a(\\pm1,0,0)$ etc. are the planes $k_i = \\pm\\pi/a$, so the zone is a cube of side $2\\pi/a$ and volume $(2\\pi/a)^3$; its corners $\\tfrac\\pi a(\\pm1,\\pm1,\\pm1)$ are $\\sqrt3\\pi/a$ from $\\Gamma$. Periodic boundary conditions on a crystal of volume $Na^3$ allow one $\\vec k$ per $(2\\pi)^3/(Na^3)$ of $k$-space, so the zone holds exactly $N$ wave vectors (one per cell). The factor 2 appears only when electron spin is counted, which doubles the states, not the wave vectors.',
      trap: 'Confusing wave vectors with electron states: $N$ wave vectors, $2N$ states with spin.' },
    { id: 'rl-045', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Fourier series', format: 'multi',
      q: 'A real function $f(\\vec r)$ has the periodicity of a Bravais lattice and is written as $f(\\vec r) = \\sum_{\\vec q} f_{\\vec q}\\,e^{i\\vec q\\cdot\\vec r}$. Which statements are correct?',
      options: ['Only wave vectors $\\vec q$ belonging to the reciprocal lattice appear.', 'The coefficients $f_{\\vec G}$ and $f_{-\\vec G}$ are unrelated.', '$f_{\\vec G} = \\dfrac1{V_c}\\displaystyle\\int_{\\text{cell}} f(\\vec r)\\,e^{-i\\vec G\\cdot\\vec r}\\,d^3r$, with $V_c$ the primitive cell volume.', 'Wave vectors equal to half a reciprocal lattice vector also appear.'], answer: [0, 2],
      sol: 'Periodicity $f(\\vec r + \\vec R) = f(\\vec r)$ requires $e^{i\\vec q\\cdot\\vec R} = 1$ for every $\\vec R$, which is the definition of the reciprocal lattice, so only $\\vec G$s appear (half vectors fail). Multiplying by $e^{-i\\vec G\\cdot\\vec r}$ and integrating over one cell picks out $f_{\\vec G}$ with the $1/V_c$ normalisation. For real $f$, $f_{-\\vec G} = f_{\\vec G}^*$, so they are related.',
      trap: 'Half vectors $\\vec G/2$ are where zone boundaries sit, not Fourier components of a lattice-periodic function.' },
    { id: 'rl-046', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'crystal momentum', format: 'multi',
      q: 'Which statements about the wave vector $\\vec k$ of a Bloch state (or of a phonon) in a crystal are correct?',
      options: ['$\\vec k$ and $\\vec k + \\vec G$ label the same state.', 'The number of distinct $\\vec k$ in the first zone equals the number of primitive cells.', '$\\hbar\\vec k$ is the mechanical momentum $m\\vec v$ of the electron.', 'A $\\vec k$ on one zone face and the $\\vec k - \\vec G$ on the opposite face are equivalent.'], answer: [0, 1, 3],
      sol: 'Bloch\'s theorem fixes $\\psi(\\vec r + \\vec R) = e^{i\\vec k\\cdot\\vec R}\\psi(\\vec r)$, and $e^{i(\\vec k + \\vec G)\\cdot\\vec R} = e^{i\\vec k\\cdot\\vec R}$, so $\\vec k$ is defined only modulo $\\vec G$: options 1 and 4 are the same fact, and points on opposite faces are one point. Periodic boundary conditions give $N$ distinct $\\vec k$ in the zone. $\\hbar\\vec k$ is the crystal momentum, conserved only up to $\\hbar\\vec G$; the velocity is the group velocity $\\nabla_k E/\\hbar$, not $\\hbar\\vec k/m$.',
      trap: 'Treating crystal momentum as ordinary momentum: in Bragg reflection $\\hbar\\vec k$ jumps by $\\hbar\\vec G$, the lattice taking up the difference.' },
    ...more2,
  ],

  gens: [
    { id: 'rl-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'G and planes',
      make(r) {
        const a = pick(r, 2.8, 6.2, 0.01), t = choose(r, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0], [2, 1, 0], [2, 1, 1], [2, 2, 1], [3, 1, 0], [3, 1, 1]]);
        const N = t[0] ** 2 + t[1] ** 2 + t[2] ** 2, G = 2 * PI * Math.sqrt(N) / a;
        return { q: `A simple cubic crystal has $a = ${a}$ Å. The length of the reciprocal lattice vector $\\vec G_{${t.join('')}}$ is ______ Å$^{-1}$ (to three decimal places).`,
          answer: round(G, 3), tol: 0.003, unit: 'Å⁻¹', a, N,
          sol: `$|\\vec G_{hkl}| = \\dfrac{2\\pi}{a}\\sqrt{h^2+k^2+l^2} = \\dfrac{2\\pi\\sqrt{${N}}}{${a}} = ${round(G, 3)}$ Å$^{-1}$, equal to $2\\pi/d_{hkl}$ with $d = ${round(a / Math.sqrt(N), 4)}$ Å.`,
          trap: 'Forgetting the $2\\pi$, or adding the indices instead of using the square root of the sum of squares.' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt(p.N) / p.a },
    { id: 'rl-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'zone volume',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc']), a = pick(r, 2.8, 6.0, 0.01), n = NPRIM[key];
        const Vc = a ** 3 / n, V = (2 * PI) ** 3 / Vc;
        return { q: `A ${NAMES[key]} crystal has conventional cube edge $a = ${a}$ Å. The volume of its first Brillouin zone is ______ Å$^{-3}$ (to two decimal places).`,
          answer: round(V, 2), tol: Math.max(0.02, round(V * 0.005, 2)), unit: 'Å⁻³', a, n,
          sol: `The primitive cell of ${NAMES[key]} has volume $a^3/${n} = ${round(Vc, 3)}$ Å$^3$ (${n} lattice point${n > 1 ? 's' : ''} per cube). Zone volume $= (2\\pi)^3/V_c = 248.05/${round(Vc, 3)} = ${round(V, 2)}$ Å$^{-3}$.`,
          trap: n > 1 ? 'Using the conventional cube volume $a^3$ instead of the primitive volume.' : 'Using $1/a^3$ without the $(2\\pi)^3$.' };
      },
      verify: (p) => (2 * Math.PI) ** 3 * p.n / p.a ** 3 },
    { id: 'rl-g03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'reciprocal lattices',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'hex', 'tet']);
        const A = { sc: 'simple cubic with constant $2\\pi/a$', bcc: 'face-centred cubic with cube edge $4\\pi/a$', fcc: 'body-centred cubic with cube edge $4\\pi/a$', hex: 'hexagonal with constant $4\\pi/(\\sqrt3 a)$, rotated by $30^\\circ$', tet: 'simple tetragonal with constants $2\\pi/a$ and $2\\pi/c$' };
        const Q = { sc: 'a simple cubic lattice of constant $a$', bcc: 'a body-centred cubic lattice with cube edge $a$', fcc: 'a face-centred cubic lattice with cube edge $a$', hex: 'a 2D hexagonal lattice of side $a$', tet: 'a simple tetragonal lattice with constants $a$ and $c$' };
        const wrong = ['simple cubic with constant $a/2\\pi$', 'body-centred cubic with cube edge $2\\pi/a$', 'face-centred cubic with cube edge $2\\pi/a$', 'hexagonal with constant $2\\pi/a$, not rotated', 'simple tetragonal with constants $2\\pi/c$ and $2\\pi/a$ swapped', ...Object.values(A)];
        const o = mcqOptions(r, A[key], wrong.filter((w) => w !== A[key]));
        const why = { sc: 'orthogonal axes give $\\vec b_i = (2\\pi/a)\\hat x_i$', bcc: 'the primitive volume is $a^3/2$ and $\\vec b_1 = \\tfrac{2\\pi}a(0,1,1)$ and cyclic: fcc vectors of a cube of edge $4\\pi/a$', fcc: 'the primitive volume is $a^3/4$ and $\\vec b_1 = \\tfrac{2\\pi}a(-1,1,1)$ and cyclic: bcc vectors of a cube of edge $4\\pi/a$', hex: '$\\vec b_1 = \\tfrac{2\\pi}a(\\hat x - \\hat y/\\sqrt3)$, $\\vec b_2 = \\tfrac{4\\pi}{\\sqrt3a}\\hat y$: equal lengths at $120^\\circ$', tet: 'each $\\vec b_i$ is along its own axis with length $2\\pi/a_i$, so the long real axis $c$ becomes the short reciprocal one' };
        return { q: `The reciprocal lattice of ${Q[key]} is`, ...o,
          sol: `From $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$: ${why[key]}. So it is ${A[key]}.`,
          trap: 'Mixing up which of bcc and fcc is reciprocal to which (each is the other\'s), or dropping the factor 2 in $4\\pi/a$.' };
      } },
    { id: 'rl-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '2D reciprocal',
      make(r) {
        const a = pick(r, 2.0, 5.0, 0.1), b = pick(r, 2.0, 6.0, 0.1), g = choose(r, [50, 60, 70, 75, 80, 100, 110, 120]);
        const which = choose(r, [1, 2]), len = 2 * PI / ((which === 1 ? a : b) * Math.sin(g * D));
        return { q: `A 2D lattice has $|\\vec a_1| = ${a}$ Å, $|\\vec a_2| = ${b}$ Å and an angle of $${g}^\\circ$ between them. The length of the reciprocal vector $\\vec b_${which}$ is ______ Å$^{-1}$ (to three decimal places).`,
          answer: round(len, 3), tol: 0.003, unit: 'Å⁻¹', a, b, g, which,
          sol: `$\\vec b_${which}$ is perpendicular to $\\vec a_${3 - which}$ and has $\\vec a_${which}\\cdot\\vec b_${which} = 2\\pi$. Only the component of $\\vec a_${which}$ along $\\vec b_${which}$ counts, which is $|\\vec a_${which}|\\sin\\gamma$. So $|\\vec b_${which}| = \\dfrac{2\\pi}{|\\vec a_${which}|\\sin\\gamma} = \\dfrac{6.2832}{${which === 1 ? a : b}\\times${round(Math.sin(g * D), 4)}} = ${round(len, 3)}$ Å$^{-1}$.`,
          trap: 'Using $2\\pi/|\\vec a|$, which is right only for perpendicular axes.' };
      },
      verify: (p) => 2 * Math.PI / ((p.which === 1 ? p.a : p.b) * Math.sin(p.g * Math.PI / 180)) },
    { id: 'rl-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'non-cubic spacing',
      make(r) {
        const a = pick(r, 2.4, 3.6, 0.01), c = pick(r, 3.9, 6.0, 0.01), t = choose(r, [[1, 0, 0], [0, 0, 2], [1, 0, 1], [1, 1, 0], [1, 0, 2], [1, 1, 2], [2, 0, 1], [1, 0, 3]]);
        const [h, k, l] = t, inv = 4 / 3 * (h * h + h * k + k * k) / a ** 2 + l * l / c ** 2, d = 1 / Math.sqrt(inv);
        return { q: `A hexagonal crystal has $a = ${a}$ Å and $c = ${c}$ Å. The spacing $d_{${h}${k}${l}}$ of the $(${h}${k}${l})$ planes (three-index notation) is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: 0.003, unit: 'Å', a, c, h, k, l,
          sol: `From $|\\vec G_{hkl}| = 2\\pi/d$ with the hexagonal reciprocal basis, $\\dfrac1{d^2} = \\dfrac43\\,\\dfrac{h^2+hk+k^2}{a^2} + \\dfrac{l^2}{c^2} = \\dfrac43\\cdot\\dfrac{${h * h + h * k + k * k}}{${round(a * a, 4)}} + \\dfrac{${l * l}}{${round(c * c, 4)}} = ${round(inv, 5)}$ Å$^{-2}$, so $d = ${round(d, 3)}$ Å.`,
          trap: 'Using the cubic or tetragonal formula $h^2 + k^2$ (no $hk$ term, no $4/3$).' };
      },
      verify: (p) => 1 / Math.sqrt(4 / 3 * (p.h ** 2 + p.h * p.k + p.k ** 2) / p.a ** 2 + p.l ** 2 / p.c ** 2) },
    { id: 'rl-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'symmetry points',
      make(r) {
        const pts = [['fcc', 'X', [1, 0, 0], 'centre of a square face'], ['fcc', 'L', [0.5, 0.5, 0.5], 'centre of a hexagonal face'], ['fcc', 'K', [0.75, 0.75, 0], 'midpoint of an edge shared by two hexagons'], ['fcc', 'W', [1, 0.5, 0], 'corner where a square meets two hexagons'], ['bcc', 'H', [1, 0, 0], 'corner where four faces meet'], ['bcc', 'N', [0.5, 0.5, 0], 'centre of a rhombic face'], ['bcc', 'P', [0.5, 0.5, 0.5], 'corner where three faces meet'], ['sc', 'X', [0.5, 0, 0], 'centre of a face'], ['sc', 'M', [0.5, 0.5, 0], 'midpoint of an edge'], ['sc', 'R', [0.5, 0.5, 0.5], 'corner']];
        const [key, P, v, what] = choose(r, pts), a = pick(r, 2.8, 6.0, 0.01);
        const s = Math.hypot(...v), dist = 2 * PI / a * s;
        return { q: `For a ${NAMES[key]} lattice with cube edge $a = ${a}$ Å, the point $${P}$ of the first Brillouin zone (${what}) lies at $\\tfrac{2\\pi}{a}(${v.join(', ')})$. Its distance from $\\Gamma$ is ______ Å$^{-1}$ (to three decimal places).`,
          answer: round(dist, 3), tol: 0.003, unit: 'Å⁻¹', a, s,
          sol: `$|\\Gamma ${P}| = \\dfrac{2\\pi}{a}\\sqrt{${v.map((x) => x * x).join(' + ')}} = \\dfrac{6.2832\\times${round(s, 4)}}{${a}} = ${round(dist, 3)}$ Å$^{-1}$.`,
          trap: 'Using $\\pi/a$ as the unit instead of $2\\pi/a$.' };
      },
      verify: (p) => 2 * Math.PI / p.a * p.s },
    { id: 'rl-g07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'reciprocal lattices', format: 'multi',
      make(r) {
        const key = choose(r, ['bcc', 'fcc']);
        const okv = key === 'bcc' ? (t) => (t[0] + t[1] + t[2]) % 2 === 0 : (t) => t.every((x) => x % 2 === 0) || t.every((x) => Math.abs(x) % 2 === 1);
        const pool = [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0], [2, 1, 0], [2, 1, 1], [2, 2, 0], [2, 2, 2], [3, 1, 0], [3, 1, 1], [2, 2, 1], [3, 2, 1], [0, 0, 2], [0, 2, 2], [1, 3, 1], [0, 1, 1]];
        const good = pool.filter(okv), bad = pool.filter((t) => !okv(t));
        const first = choose(r, good), rest = shuffle(r, pool.filter((t) => t !== first)).slice(0, 3);
        const off = int(r, 0, 3), four = [first, ...rest], opts = four.map((_, i) => four[(i + off) % 4]);
        const answer = opts.map((t, i) => (okv(t) ? i : -1)).filter((i) => i >= 0);
        const rule = key === 'bcc' ? 'the reciprocal lattice is fcc (cube edge $4\\pi/a$): in units of $2\\pi/a$, $h + k + l$ must be even' : 'the reciprocal lattice is bcc (cube edge $4\\pi/a$): in units of $2\\pi/a$, $h, k, l$ must be all even or all odd';
        return { q: `For a ${NAMES[key]} lattice with cube edge $a$, which of these vectors (written in units of $2\\pi/a$) are reciprocal lattice vectors?`,
          options: opts.map((t) => `$(${t.join(', ')})$`), answer,
          sol: `For ${NAMES[key]}, ${rule}. ${opts.map((t) => `$(${t.join(',')})$: ${okv(t) ? 'yes' : 'no'}`).join('; ')}. Equivalently $\\vec G\\cdot\\vec R$ must be a multiple of $2\\pi$ for every lattice vector, including the centring vector.`,
          trap: 'Treating the cube as primitive, so that every integer triple seems allowed.' };
      } },
    { id: 'rl-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'free-electron energies',
      make(r) {
        const a = pick(r, 2.5, 5.5, 0.05), dim = choose(r, ['2D square', 'simple cubic']);
        const P = dim === '2D square' ? choose(r, [['edge midpoint', 1], ['corner', 2]]) : choose(r, [['face centre X', 1], ['edge midpoint M', 2], ['corner R', 3]]);
        const k2 = P[1] * (PI / a) ** 2, E = HB * k2;
        return { q: `A ${dim} lattice has $a = ${a}$ Å. The kinetic energy of a free electron whose wave vector ends at the ${P[0]} of the first Brillouin zone is ______ eV (to two decimal places). Use $\\hbar^2/2m = ${round(HB, 3)}$ eV Å$^2$.`,
          answer: round(E, 2), tol: Math.max(0.02, round(E * 0.005, 2)), unit: 'eV', a, m: P[1],
          sol: `That point is at $k = \\sqrt{${P[1]}}\\,\\pi/a$, so $k^2 = ${P[1]}\\pi^2/a^2 = ${round(k2, 4)}$ Å$^{-2}$ and $E = \\dfrac{\\hbar^2k^2}{2m} = ${round(HB, 3)}\\times${round(k2, 4)} = ${round(E, 2)}$ eV. A band gap opens at these energies in a weak periodic potential.`,
          trap: 'Putting the zone boundary at $2\\pi/a$ (the reciprocal lattice spacing) instead of half of it.' };
      },
      verify: (p) => HB * p.m * (Math.PI / p.a) ** 2 },
    { id: 'rl-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'non-cubic spacing',
      make(r) {
        const a = pick(r, 3.0, 4.5, 0.05), c = pick(r, 4.6, 7.0, 0.05);
        const p1 = choose(r, [[1, 0, 0], [1, 1, 0], [0, 0, 1]]), p2 = choose(r, [[1, 0, 1], [1, 1, 1], [0, 1, 1], [1, 1, 2]]);
        const G = (t) => [t[0] / a, t[1] / a, t[2] / c];
        const g1 = G(p1), g2 = G(p2), cs = (g1[0] * g2[0] + g1[1] * g2[1] + g1[2] * g2[2]) / (Math.hypot(...g1) * Math.hypot(...g2)), ang = Math.acos(cs) / D;
        return { q: `A tetragonal crystal has $a = ${a}$ Å and $c = ${c}$ Å. The angle between the normals of the $(${p1.join('')})$ and $(${p2.join('')})$ planes is ______ degrees (to one decimal place).`,
          answer: round(ang, 1), tol: 0.2, unit: 'degree', a, c, p1, p2,
          sol: `The plane normals are the reciprocal vectors $\\vec G = 2\\pi(h/a, k/a, l/c)$, not the directions $[hkl]$. $\\vec G_1 \\propto (${round(g1[0], 4)}, ${round(g1[1], 4)}, ${round(g1[2], 4)})$, $\\vec G_2 \\propto (${round(g2[0], 4)}, ${round(g2[1], 4)}, ${round(g2[2], 4)})$ Å$^{-1}$. $\\cos\\phi = \\dfrac{\\vec G_1\\cdot\\vec G_2}{|\\vec G_1||\\vec G_2|} = ${round(cs, 4)}$, so $\\phi = ${round(ang, 1)}^\\circ$.`,
          trap: 'Using the cubic formula with the bare indices, which ignores $c \\ne a$.' };
      },
      verify: (p) => { const G = (t) => [t[0] / p.a, t[1] / p.a, t[2] / p.c]; const g1 = G(p.p1), g2 = G(p.p2); return Math.acos((g1[0] * g2[0] + g1[1] * g2[1] + g1[2] * g2[2]) / (Math.hypot(...g1) * Math.hypot(...g2))) * 180 / Math.PI; } },
    { id: 'rl-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'primitive cell',
      make(r) {
        const sys = choose(r, [['orthorhombic', 'P', 1], ['orthorhombic', 'C (base-centred)', 2], ['orthorhombic', 'I (body-centred)', 2], ['orthorhombic', 'F (face-centred)', 4], ['tetragonal', 'I (body-centred)', 2], ['monoclinic', 'C (base-centred)', 2]]);
        const a = pick(r, 3, 6, 0.1), b = sys[0] === 'tetragonal' ? a : pick(r, 3, 7, 0.1), c = pick(r, 4, 8, 0.1);
        const beta = sys[0] === 'monoclinic' ? choose(r, [100, 105, 110, 115]) : 90;
        const V = a * b * c * Math.sin(beta * D) / sys[2];
        return { q: `A ${sys[0]} ${sys[1]} lattice has a conventional cell with $a = ${a}$ Å, $b = ${b}$ Å, $c = ${c}$ Å${beta !== 90 ? ` and $\\beta = ${beta}^\\circ$` : ' (all angles $90^\\circ$)'}. The volume of its primitive cell is ______ Å$^3$ (to one decimal place).`,
          answer: round(V, 1), tol: Math.max(0.1, round(V * 0.003, 1)), unit: 'Å³', a, b, c, beta, n: sys[2],
          sol: `The conventional cell has volume $abc${beta !== 90 ? '\\sin\\beta' : ''} = ${round(a * b * c * Math.sin(beta * D), 2)}$ Å$^3$ and holds ${sys[2]} lattice point${sys[2] > 1 ? 's' : ''} (${sys[1]}). A primitive cell holds one, so $V_c = ${round(a * b * c * Math.sin(beta * D), 2)}/${sys[2]} = ${round(V, 1)}$ Å$^3$. The first Brillouin zone has volume $(2\\pi)^3/V_c$.`,
          trap: 'Counting the drawn points (8 corners + centring points) instead of the shared count.' };
      },
      verify: (p) => p.a * p.b * p.c * Math.sin(p.beta * Math.PI / 180) / p.n },
    { id: 'rl-g11', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'higher zones',
      make(r) {
        const [x, y] = choose(r, ZPTS), z = zone2d(x, y);
        const o = mcqOptions(r, z, [1, 2, 3, 4, 5].filter((v) => v !== z), (v) => ['first', 'second', 'third', 'fourth', 'fifth'][v - 1] + ' zone');
        return { q: `For a 2D square lattice of constant $a$, the point $\\vec k = \\tfrac{\\pi}{a}(${x}, ${y})$ lies in which Brillouin zone?`, ...o,
          sol: `A point is in the $n$th zone when exactly $n - 1$ Bragg lines (perpendicular bisectors of $\\vec G = \\tfrac{2\\pi}a(m, p)$) separate it from $\\Gamma$, i.e. when $n - 1$ vectors $\\vec G$ are closer to $\\vec k$ than the origin is. In units of $\\pi/a$, $\\vec G = (2m, 2p)$ and the condition is $|\\vec k - \\vec G| < |\\vec k|$. Counting gives ${z - 1} such $\\vec G$, so the point is in the ${['first', 'second', 'third', 'fourth', 'fifth'][z - 1]} zone. Useful lines: $|k_x| = 1$, $|k_y| = 1$ (first zone edges), $|k_x| + |k_y| = 2$ (second zone outer edge), $|k_x| = 2$ etc.`,
          trap: 'Judging by distance from $\\Gamma$ alone: zones are not circular shells.' };
      } },
    { id: 'rl-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi sphere in zone',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc']), Z = choose(r, [1, 2, 3]);
        const n = NPRIM[key] * Z; // electrons per a^3
        const kF = Math.cbrt(3 * PI * PI * n); // in 1/a
        const near = { sc: PI, bcc: S2 * PI, fcc: S3 * PI }[key];
        const ratio = kF / near;
        const face = { sc: '$\\pi/a$ (face centre $X$)', bcc: '$\\sqrt2\\pi/a$ (face centre $N$)', fcc: '$\\sqrt3\\pi/a$ (hexagonal face centre $L$)' }[key];
        return { q: `A metal with valence ${Z} has the ${NAMES[key]} structure (one atom per lattice point). In the free-electron model, the ratio of $k_F$ to the distance from $\\Gamma$ to the nearest point of the first Brillouin zone surface is ______ (to three decimal places).`,
          answer: round(ratio, 3), tol: 0.003, n, near,
          sol: `$n = ${NPRIM[key]}\\times${Z}/a^3$, so $k_F = (3\\pi^2 n)^{1/3} = (${round(3 * PI * PI * n, 3)})^{1/3}/a = ${round(kF, 4)}/a$. The nearest zone-surface point is at ${face} $= ${round(near, 4)}/a$. Ratio $= ${round(ratio, 3)}$: ${ratio < 1 ? 'the Fermi sphere stays inside the first zone' : 'the Fermi sphere reaches beyond the nearest zone faces, so some electrons sit in the second zone'}. The lattice constant cancels.`,
          trap: 'Counting electrons per conventional cube as $Z$ (forgetting the lattice points per cube), or using the zone corner instead of the nearest face.' };
      },
      verify: (p) => Math.cbrt(3 * Math.PI * Math.PI * p.n) / p.near },
    ...more,
  ],
};
