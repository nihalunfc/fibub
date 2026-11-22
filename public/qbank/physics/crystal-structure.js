// Crystal structure: lattices and bases, the 14 Bravais lattices, cubic cells (sc, bcc, fcc, diamond, NaCl, CsCl, hcp),
// packing fractions, coordination, density, voids, Miller indices of planes and directions, interplanar spacing,
// planar and linear density, primitive and Wigner-Seitz cells, the reciprocal lattice.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const S2 = Math.SQRT2, S3 = Math.sqrt(3), PI = Math.PI;
const bar = (n) => (n < 0 ? `\\bar{${-n}}` : `${n}`);
const hkl = (h, k, l, br = '()') => `$${br[0]}${bar(h)}${bar(k)}${bar(l)}${br[1]}$`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// structures: atoms per conventional cell n, nearest-neighbour distance / a, atomic radius / a, coordination
const STRUCT = {
  sc: { name: 'simple cubic', n: 1, nn: 1, cn: 6 },
  bcc: { name: 'body-centred cubic', n: 2, nn: S3 / 2, cn: 8 },
  fcc: { name: 'face-centred cubic', n: 4, nn: 1 / S2, cn: 12 },
  diamond: { name: 'diamond cubic', n: 8, nn: S3 / 4, cn: 4 },
};

import * as Q5 from '../_util.js';
import more2 from './crystal-structure.more2.gen.js';
import r4 from './crystal-structure.r4.gen.js';

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
  topic: 'crystal-structure',
  items: [
    // ---------- level 1 ----------
    { id: 'cry-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'cubic cells',
      q: 'The number of atoms in one conventional unit cell of a body-centred cubic (bcc) metal is',
      options: ['$1$', '$2$', '$4$', '$9$'], answer: 1,
      sol: 'Each of the 8 corner atoms is shared by 8 cells, so the corners give $8\\times\\tfrac18 = 1$ atom. The atom at the body centre belongs wholly to this cell: $1$ more. Total $1 + 1 = 2$.',
      trap: '$9$ counts every atom you can see in the picture, forgetting that corner atoms are shared with 7 other cells.' },
    { id: 'cry-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'coordination',
      q: 'The coordination number (number of nearest neighbours) of an atom in a face-centred cubic (fcc) crystal is',
      options: ['$6$', '$8$', '$4$', '$12$'], answer: 3,
      sol: 'Take an atom at a cube corner. Its nearest neighbours are the face centres at distance $a/\\sqrt2$. In each of the three planes through the atom ($xy$, $yz$, $zx$) there are 4 such face centres, so $3\\times4 = 12$.',
      trap: '$6$ is simple cubic and $8$ is bcc. Close-packed structures (fcc and hcp) both have 12.' },
    { id: 'cry-003', type: 'nat', level: 1, exams: ['jam'], sub: 'packing fraction',
      q: 'The packing fraction (fraction of the volume filled by touching hard spheres) of a simple cubic crystal is ______ (to three decimal places).',
      answer: 0.524, tol: 0.003, calc: () => PI / 6,
      sol: 'In simple cubic the spheres touch along the cube edge, so $a = 2r$. One atom per cell: packing fraction $= \\dfrac{\\tfrac43\\pi r^3}{a^3} = \\dfrac{\\tfrac43\\pi r^3}{8r^3} = \\dfrac{\\pi}{6} = 0.524$.',
      trap: 'Taking $a = r$ (the radius instead of the diameter) gives a fraction above 1, which is impossible.' },
    { id: 'cry-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'Miller indices',
      q: 'A plane cuts the crystal axes at $2a$, $3b$ and is parallel to the $c$ axis. Its Miller indices are',
      options: [hkl(3, 2, 0), hkl(2, 3, 0), hkl(1, 1, 0), hkl(2, 3, 1)], answer: 0,
      sol: 'Intercepts in units of the axes: $2, 3, \\infty$. Reciprocals: $\\tfrac12, \\tfrac13, 0$. Multiply by the smallest number that clears the fractions (6): $(3\\,2\\,0)$.',
      trap: 'Writing the intercepts themselves, $(2\\,3\\,0)$. Miller indices are the reciprocals of the intercepts.' },
    { id: 'cry-005', type: 'msq', level: 1, exams: ['jam', 'gate'], sub: 'symmetry', format: 'multi',
      q: 'Which rotation axes can a periodic crystal lattice have?',
      options: ['2-fold', '3-fold', '5-fold', '6-fold'], answer: [0, 1, 3],
      sol: 'A rotation that maps a lattice onto itself must send lattice vectors to lattice vectors, which forces $1 + 2\\cos\\theta$ to be an integer. So $\\cos\\theta \\in \\{1, \\tfrac12, 0, -\\tfrac12, -1\\}$: rotations by $360^\\circ$, $60^\\circ$, $90^\\circ$, $120^\\circ$, $180^\\circ$, that is 1, 6, 4, 3 and 2-fold axes. A 5-fold axis ($\\cos72^\\circ = 0.309$) is impossible: pentagons cannot tile a plane without gaps.',
      trap: 'Quasicrystals show 5-fold diffraction patterns, but they are not periodic, so they do not break this rule.' },
    { id: 'cry-006', type: 'nat', level: 1, exams: ['jam'], sub: 'Bravais lattices',
      q: 'The number of distinct Bravais lattices in three dimensions is ______.',
      answer: 14, tol: 0,
      sol: 'There are 7 crystal systems (cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, triclinic). Adding the allowed centrings (body, face, base) where they give something new produces 14 Bravais lattices: 3 cubic, 2 tetragonal, 4 orthorhombic, 1 hexagonal, 1 trigonal (rhombohedral), 2 monoclinic, 1 triclinic.',
      trap: '7 is the number of crystal systems, and 5 is the number of Bravais lattices in two dimensions.' },

    // ---------- level 2 ----------
    { id: 'cry-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'cubic cells',
      q: 'In a bcc metal with lattice constant $a$, treating the atoms as touching hard spheres, the atomic radius is',
      options: ['$\\sqrt3\\,a/4$', '$a/2$', '$\\sqrt2\\,a/4$', '$\\sqrt3\\,a/2$'], answer: 0,
      sol: 'In bcc the atoms touch along the body diagonal: corner, centre, opposite corner. The body diagonal has length $\\sqrt3\\,a$ and holds $4r$ (two radii from each end atom and a diameter from the centre one). So $r = \\sqrt3\\,a/4$.',
      trap: '$\\sqrt2\\,a/4$ is the fcc radius (touching along the face diagonal). $\\sqrt3\\,a/2$ is the nearest-neighbour distance, which is $2r$.' },
    { id: 'cry-008', type: 'nat', level: 2, exams: ['jam'], sub: 'interplanar spacing', unit: 'Å',
      q: 'For a cubic crystal with lattice constant $4.0$ Å, the spacing of the $(110)$ planes is ______ Å (to two decimal places).',
      answer: 2.83, tol: 0.01, calc: () => 4 / S2,
      sol: 'For a cubic lattice $d_{hkl} = \\dfrac{a}{\\sqrt{h^2 + k^2 + l^2}}$. Here $d_{110} = 4.0/\\sqrt2 = 2.83$ Å.',
      trap: 'Using $a/(h + k + l) = 2.0$ Å: the indices enter as a sum of squares under a root.' },
    { id: 'cry-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'Miller indices',
      q: 'In a cubic crystal, the direction $[hkl]$ and the plane $(hkl)$ are',
      options: ['always parallel: the direction lies in the plane', 'at $45^\\circ$ to each other', 'perpendicular: the direction is the normal to the plane', 'at an angle that depends on the lattice constant'], answer: 2,
      sol: 'The plane $(hkl)$ is $hx + ky + lz = $ constant (with lengths in units of $a$), whose normal is the vector $(h, k, l)$. In a cubic crystal the direction $[hkl]$ is $h\\hat x + k\\hat y + l\\hat z$ times $a$, the same vector. So $[hkl] \\perp (hkl)$.',
      trap: 'This is true only for cubic crystals. In a tetragonal or orthorhombic crystal $[hkl]$ is generally not normal to $(hkl)$.' },
    { id: 'cry-010', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'primitive cell',
      q: 'The volume of a primitive cell of the fcc lattice with conventional cube edge $a$ is',
      options: ['$a^3$', '$a^3/2$', '$a^3/4$', '$a^3/8$'], answer: 2,
      sol: 'A primitive cell holds exactly one lattice point. The conventional fcc cube holds 4 lattice points, so a primitive cell has a quarter of its volume: $a^3/4$. (Check with the primitive vectors $\\tfrac a2(0,1,1)$, $\\tfrac a2(1,0,1)$, $\\tfrac a2(1,1,0)$: their triple product is $a^3/4$.)',
      trap: '$a^3/2$ is the bcc primitive cell (2 lattice points per cube).' },
    { id: 'cry-011', type: 'nat', level: 2, exams: ['jam'], sub: 'density', unit: 'g/cm³',
      q: 'A metal crystallises in the fcc structure with lattice constant $3.61$ Å. Its molar mass is $63.55$ g/mol. Take $N_A = 6.022\\times10^{23}$ mol$^{-1}$. Its density is ______ g/cm$^3$ (to two decimal places).',
      answer: 8.97, tol: 0.09, calc: () => 4 * 63.55 / (6.022e23 * (3.61e-8) ** 3),
      sol: '$\\rho = \\dfrac{nM}{N_A a^3}$ with $n = 4$ atoms per fcc cell. $a = 3.61\\times10^{-8}$ cm, so $a^3 = 4.705\\times10^{-23}$ cm$^3$. Then $\\rho = \\dfrac{4\\times63.55}{6.022\\times10^{23}\\times4.705\\times10^{-23}} = \\dfrac{254.2}{28.33} = 8.97$ g/cm$^3$.',
      trap: 'Using $n = 1$, or leaving $a$ in Å while the answer is wanted per cm$^3$ (1 Å $= 10^{-8}$ cm).' },
    { id: 'cry-012', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'lattice and basis',
      q: 'In caesium chloride, Cs$^+$ ions sit at the cube corners and a Cl$^-$ ion at the body centre. The Bravais lattice of CsCl is',
      options: ['body-centred cubic with a one-atom basis', 'simple cubic with a two-atom basis', 'face-centred cubic with a two-atom basis', 'body-centred cubic with a two-atom basis'], answer: 1,
      sol: 'A lattice point must have identical surroundings. The body centre holds a Cl$^-$, not a Cs$^+$, so it is not a lattice point of the same lattice as the corners. The lattice is simple cubic (the corners), and each lattice point carries a basis of two ions: Cs$^+$ at $(0,0,0)$ and Cl$^-$ at $(\\tfrac12, \\tfrac12, \\tfrac12)a$.',
      trap: 'The picture looks like bcc, but bcc needs the centre atom to be the same as the corner atoms.' },
    { id: 'cry-013', type: 'msq', level: 2, exams: ['jam'], sub: 'lattice and basis', format: 'statements',
      q: 'For the sodium chloride (rock salt) structure with cube edge $a$, which statements are correct?',
      options: ['The Bravais lattice is fcc, with a basis of Na at $(0,0,0)$ and Cl at $(\\tfrac12, 0, 0)a$.', 'One conventional cubic cell contains 4 NaCl formula units.', 'Each ion has 8 nearest neighbours of the other kind.', 'The Bravais lattice is simple cubic with alternating ions.'], answer: [0, 1],
      sol: '<b>fcc with a two-ion basis:</b> true. The Na ions alone form an fcc lattice, and every Na carries a Cl half a cube edge away. <b>4 formula units:</b> true. Na: $8\\times\\tfrac18 + 6\\times\\tfrac12 = 4$; Cl: $12\\times\\tfrac14 + 1 = 4$. <b>8 neighbours:</b> false. Each ion has 6 neighbours of the other kind, at $\\pm a/2$ along the three axes (an octahedron). 8 is CsCl. <b>Simple cubic:</b> false. Neighbouring points of the ion grid hold different ions, so they are not lattice points of one lattice.',
      trap: 'Mixing up NaCl (coordination 6, fcc lattice) and CsCl (coordination 8, simple cubic lattice).' },
    { id: 'cry-014', type: 'nat', level: 2, exams: ['jam'], sub: 'nearest neighbour', unit: 'Å',
      q: 'The nearest-neighbour distance in an fcc crystal with lattice constant $5.0$ Å is ______ Å (to two decimal places).',
      answer: 3.54, tol: 0.01, calc: () => 5 / S2,
      sol: 'In fcc the nearest neighbours of a corner atom are the face centres. Half a face diagonal: $\\dfrac{\\sqrt2\\,a}{2} = \\dfrac{a}{\\sqrt2} = \\dfrac{5.0}{1.414} = 3.54$ Å.',
      trap: 'Using the cube edge $a$: in fcc the atoms along an edge do not touch.' },
    { id: 'cry-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'Miller indices',
      q: 'A plane makes intercepts $a$, $-b$ and $c/2$ on the three crystal axes. Its Miller indices are',
      options: [hkl(2, -2, 1), hkl(1, 1, 2), hkl(-1, 1, 2), hkl(1, -1, 2)], answer: 3,
      sol: 'Intercepts in units of the axes: $1, -1, \\tfrac12$. Reciprocals: $1, -1, 2$. They are already integers with no common factor, so the plane is $(1\\bar12)$. A negative intercept gives a bar over that index.',
      trap: '$(2\\bar21)$ comes from taking the intercepts themselves and clearing the fraction; $(112)$ drops the minus sign.' },
    { id: 'cry-016', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'diamond structure',
      q: 'The number of atoms in the conventional cubic cell of the diamond structure (as in Si and Ge) is',
      options: ['$8$', '$4$', '$6$', '$2$'], answer: 0,
      sol: 'Diamond is an fcc lattice with a two-atom basis at $(0,0,0)$ and $(\\tfrac14,\\tfrac14,\\tfrac14)a$. The fcc cell has 4 lattice points, each carrying 2 atoms: $4\\times2 = 8$. (Count: 8 corners $\\times\\tfrac18$ + 6 faces $\\times\\tfrac12$ + 4 atoms fully inside $= 1 + 3 + 4 = 8$.)',
      trap: '$2$ is the number of atoms in the primitive cell, not the conventional cube.' },

    // ---------- level 3 ----------
    { id: 'cry-017', type: 'nat', level: 3, exams: ['jam'], sub: 'packing fraction',
      q: 'The packing fraction of a bcc crystal of identical touching spheres is ______ (to three decimal places).',
      answer: 0.680, tol: 0.003, calc: () => S3 * PI / 8,
      sol: '2 atoms per cell and $r = \\sqrt3\\,a/4$. Packing fraction $= \\dfrac{2\\times\\tfrac43\\pi r^3}{a^3} = \\dfrac{8\\pi}{3}\\left(\\dfrac{\\sqrt3}{4}\\right)^3 = \\dfrac{8\\pi}{3}\\cdot\\dfrac{3\\sqrt3}{64} = \\dfrac{\\sqrt3\\,\\pi}{8} = 0.680$.',
      trap: 'Using the fcc radius $\\sqrt2\\,a/4$ with 2 atoms gives 0.37, which is wrong.' },
    { id: 'cry-018', type: 'nat', level: 3, exams: ['jam'], sub: 'directions', unit: 'degree',
      q: 'In a cubic crystal, the angle between the directions $[111]$ and $[100]$ is ______ degrees (to one decimal place).',
      answer: 54.7, tol: 0.1, calc: () => Math.acos(1 / S3) * 180 / PI,
      sol: '$\\cos\\theta = \\dfrac{(1,1,1)\\cdot(1,0,0)}{\\sqrt3\\times1} = \\dfrac1{\\sqrt3}$, so $\\theta = 54.7^\\circ$. This is the angle between a body diagonal and a cube edge.',
      trap: '$45^\\circ$ is the angle between $[110]$ and $[100]$ (a face diagonal and an edge).' },
    { id: 'cry-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'interplanar spacing',
      q: 'For a simple cubic lattice, the ratio $d_{100} : d_{110} : d_{111}$ is',
      options: ['$1 : \\sqrt2 : \\sqrt3$', '$1 : 1/\\sqrt2 : 1/\\sqrt3$', '$1 : 2 : 3$', '$1 : 1/2 : 1/3$'], answer: 1,
      sol: '$d = a/\\sqrt{h^2 + k^2 + l^2}$ gives $a$, $a/\\sqrt2$ and $a/\\sqrt3$. So the ratio is $1 : 1/\\sqrt2 : 1/\\sqrt3 = \\sqrt6 : \\sqrt3 : \\sqrt2$. Planes with higher indices are closer together.',
      trap: '$1 : \\sqrt2 : \\sqrt3$ is the inverse: it is the ratio of $1/d$, the lengths of the reciprocal lattice vectors.' },
    { id: 'cry-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'close packing', format: 'statements',
      q: 'Compare the fcc (cubic close-packed) and ideal hcp structures of identical spheres. Which statements are correct?',
      options: ['Both have a packing fraction of about 0.74.', 'Both have a coordination number of 12.', 'Stacking close-packed layers in the order ABAB... gives fcc.', 'The ideal $c/a$ ratio of hcp is $\\sqrt{8/3} \\approx 1.633$.'], answer: [0, 1, 3],
      sol: '<b>Packing 0.74:</b> true for both: $\\pi/(3\\sqrt2) = 0.7405$. <b>12 neighbours:</b> true for both: 6 in the same layer, 3 above, 3 below. <b>ABAB gives fcc:</b> false. ABAB... is hcp; ABCABC... is fcc, with the close-packed layers being the $(111)$ planes. <b>$c/a$:</b> true. The $c$ axis spans two layers, and each layer sits $\\sqrt{2/3}\\,a$ above the one below (the height of a regular tetrahedron of edge $a$), so $c/a = 2\\sqrt{2/3} = \\sqrt{8/3}$.',
      trap: 'Swapping the stacking orders: hcp repeats every two layers (AB), fcc every three (ABC).' },
    { id: 'cry-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'planar density', unit: 'atoms/nm²',
      q: 'An fcc metal has lattice constant $0.36$ nm. The number of atoms per unit area on a $(111)$ plane is ______ atoms/nm$^2$ (to one decimal place).',
      answer: 17.8, tol: 0.2, calc: () => 4 / (S3 * 0.36 ** 2),
      sol: 'The $(111)$ plane cuts the cube in an equilateral triangle with corners at three cube corners; its side is a face diagonal $\\sqrt2\\,a$, so its area is $\\tfrac{\\sqrt3}{4}(\\sqrt2\\,a)^2 = \\tfrac{\\sqrt3}{2}a^2$. Atoms in it: 3 corners, each with $60^\\circ$ of a full $360^\\circ$ around it inside the triangle ($3\\times\\tfrac16 = \\tfrac12$), plus 3 face centres on the edges ($3\\times\\tfrac12 = \\tfrac32$): 2 atoms. Density $= \\dfrac{2}{(\\sqrt3/2)a^2} = \\dfrac{4}{\\sqrt3\\,a^2} = \\dfrac{4}{1.732\\times0.1296} = 17.8$ nm$^{-2}$.',
      trap: 'Counting corner atoms as $\\tfrac14$ (as for a square face) instead of $\\tfrac16$ for a $60^\\circ$ corner.' },
    { id: 'cry-022', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'reciprocal lattice',
      q: 'The reciprocal lattice of an fcc lattice with conventional cube edge $a$ is',
      options: ['fcc with cube edge $4\\pi/a$', 'simple cubic with cube edge $2\\pi/a$', 'bcc with cube edge $2\\pi/a$', 'bcc with cube edge $4\\pi/a$'], answer: 3,
      sol: 'With $\\vec a_1 = \\tfrac a2(0,1,1)$ and its partners, $\\vec b_1 = 2\\pi\\dfrac{\\vec a_2\\times\\vec a_3}{\\vec a_1\\cdot(\\vec a_2\\times\\vec a_3)} = \\dfrac{2\\pi}{a}(-1, 1, 1)$, and similarly $\\vec b_2 = \\tfrac{2\\pi}{a}(1,-1,1)$, $\\vec b_3 = \\tfrac{2\\pi}{a}(1,1,-1)$. These are the primitive vectors of a bcc lattice, $\\tfrac{A}{2}(\\pm1,\\pm1,\\pm1)$, with $A/2 = 2\\pi/a$, so the bcc cube edge is $A = 4\\pi/a$.',
      trap: 'Getting bcc right but the edge wrong: the vectors $\\tfrac{2\\pi}{a}(\\pm1,\\pm1,\\pm1)$ reach the body centre, which is half the cube edge along each axis.' },
    { id: 'cry-023', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Bravais lattices', format: 'single',
      q: 'Which of the following is <b>not</b> one of the 14 Bravais lattices?',
      options: ['body-centred tetragonal', 'face-centred orthorhombic', 'base-centred cubic', 'base-centred monoclinic'], answer: 2,
      sol: 'Centring only one pair of faces of a cube destroys the 3-fold axes along the body diagonals, so the lattice is no longer cubic. It is in fact a simple tetragonal lattice with a smaller cell (side $a/\\sqrt2$, height $a$). The other three are genuine Bravais lattices.',
      trap: 'Face-centred tetragonal is also missing from the list (it equals body-centred tetragonal), which makes students doubt the tetragonal option.' },
    { id: 'cry-024', type: 'nat', level: 3, exams: ['jam'], sub: 'cubic cells', unit: 'Å',
      q: 'Copper is fcc with lattice constant $3.61$ Å. Treating the atoms as touching hard spheres, the atomic radius is ______ Å (to two decimal places).',
      answer: 1.28, tol: 0.01, calc: () => S2 * 3.61 / 4,
      sol: 'In fcc the atoms touch along a face diagonal, of length $\\sqrt2\\,a$, which holds $4r$. So $r = \\sqrt2\\,a/4 = 1.414\\times3.61/4 = 1.28$ Å.',
      trap: 'Using the bcc rule $\\sqrt3\\,a/4$ gives 1.56 Å.' },
    { id: 'cry-025', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'cubic cells', format: 'statements',
      q: 'For a bcc lattice with cube edge $a$, which statements are correct?',
      options: ['Each lattice point has 8 nearest neighbours at $\\sqrt3\\,a/2$.', 'Each lattice point has 6 second-nearest neighbours at $a$.', 'A primitive cell has volume $a^3/2$.', 'Its Wigner-Seitz cell is a rhombic dodecahedron.'], answer: [0, 1, 2],
      sol: '<b>8 at $\\sqrt3a/2$:</b> true: from a corner, the 8 body centres of the cells that share it. <b>6 at $a$:</b> true: the next corners along $\\pm x$, $\\pm y$, $\\pm z$; $a$ is only about 15% more than $\\sqrt3a/2 = 0.866a$. <b>Volume $a^3/2$:</b> true: 2 lattice points per cube. <b>Rhombic dodecahedron:</b> false. That is the Wigner-Seitz cell of fcc. The bcc Wigner-Seitz cell is a truncated octahedron (8 hexagons from the nearest neighbours, 6 squares from the second-nearest).',
      trap: 'The two Wigner-Seitz shapes are easy to swap. The bcc one has square faces because its second neighbours are almost as close as its first.' },
    { id: 'cry-026', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Miller indices',
      q: 'In a cubic crystal, the plane that contains both the directions $[110]$ and $[001]$ has Miller indices',
      options: [hkl(1, -1, 0), hkl(1, 1, 0), hkl(0, 0, 1), hkl(1, 1, 1)], answer: 0,
      sol: 'In a cubic crystal the normal to the plane is perpendicular to both directions, so it is along their cross product: $(1,1,0)\\times(0,0,1) = (1\\cdot1 - 0\\cdot0,\\; 0\\cdot0 - 1\\cdot1,\\; 0) = (1, -1, 0)$. The plane is $(1\\bar10)$. Check: $(1,-1,0)\\cdot(1,1,0) = 0$ and $(1,-1,0)\\cdot(0,0,1) = 0$.',
      trap: '$(110)$ is perpendicular to $[110]$, not parallel to it.' },
    { id: 'cry-027', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'interplanar spacing', unit: 'Å',
      q: 'A tetragonal crystal has $a = b = 4$ Å and $c = 6$ Å. The spacing of the $(112)$ planes is ______ Å (to two decimal places).',
      answer: 2.06, tol: 0.01, calc: () => 1 / Math.sqrt(2 / 16 + 4 / 36),
      sol: 'For axes at right angles (orthorhombic, tetragonal) $\\dfrac{1}{d^2} = \\dfrac{h^2}{a^2} + \\dfrac{k^2}{b^2} + \\dfrac{l^2}{c^2}$. Here $\\dfrac1{d^2} = \\dfrac{1 + 1}{16} + \\dfrac{4}{36} = 0.1250 + 0.1111 = 0.2361$ Å$^{-2}$, so $d = 2.06$ Å.',
      trap: 'Using the cubic formula with one lattice constant: with $a = 4$ Å it gives $1.63$ Å.' },
    { id: 'cry-028', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'zone axis',
      q: 'In a cubic crystal, the direction common to the planes $(110)$ and $(1\\bar11)$ (their zone axis) is',
      options: [hkl(1, 1, 2, '[]'), hkl(2, -1, 1, '[]'), hkl(1, -1, -2, '[]'), hkl(1, 1, 0, '[]')], answer: 2,
      sol: 'A direction in both planes is perpendicular to both normals, so take the cross product: $(1,1,0)\\times(1,-1,1) = (1\\cdot1 - 0\\cdot(-1),\\; 0\\cdot1 - 1\\cdot1,\\; 1\\cdot(-1) - 1\\cdot1) = (1, -1, -2)$. Check: $(1,-1,-2)\\cdot(1,1,0) = 0$ and $(1,-1,-2)\\cdot(1,-1,1) = 1 + 1 - 2 = 0$.',
      trap: '$[110]$ is the normal of the first plane, not a direction lying in it.' },
    { id: 'cry-029', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'packing fraction',
      q: 'The packing fraction of the diamond structure, with atoms as touching hard spheres, is ______ (to three decimal places).',
      answer: 0.340, tol: 0.003, calc: () => S3 * PI / 16,
      sol: 'Nearest neighbours are at a quarter of the body diagonal: $2r = \\sqrt3\\,a/4$, so $r = \\sqrt3\\,a/8$. With 8 atoms per cell: $\\dfrac{8\\times\\tfrac43\\pi r^3}{a^3} = \\dfrac{32\\pi}{3}\\cdot\\dfrac{3\\sqrt3}{512} = \\dfrac{\\sqrt3\\,\\pi}{16} = 0.340$. Diamond is a very open structure: each atom has only 4 neighbours.',
      trap: 'Using the fcc radius because the lattice is fcc. The atoms touch along the tetrahedral bonds, not along the face diagonal.' },

    // ---------- level 4 ----------
    { id: 'cry-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'phase change', unit: '%',
      q: 'A metal changes from bcc to fcc on heating. Assuming the atomic radius stays the same, its volume decreases by ______ % (to two decimal places).',
      answer: 8.14, tol: 0.08, calc: () => (1 - (4 * S2) / (32 / (3 * S3))) * 100,
      sol: 'Compare the volume per atom. bcc: $a = 4r/\\sqrt3$, so $a^3/2 = \\dfrac{64r^3}{3\\sqrt3}\\cdot\\dfrac12 = 6.158\\,r^3$. fcc: $a = 2\\sqrt2\\,r$, so $a^3/4 = \\dfrac{16\\sqrt2\\,r^3}{4} = 5.657\\,r^3$. Fractional change $= 5.657/6.158 - 1 = -0.0814$: the volume falls by $8.14\\%$. (Equivalently the ratio of packing fractions, $0.680/0.740 = 0.919$.)',
      trap: 'Comparing the volumes of the conventional cells instead of the volume per atom (the cells hold 2 and 4 atoms).' },
    { id: 'cry-031', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'voids', format: 'statements',
      q: 'For an fcc (cubic close-packed) array of identical spheres of radius $r$, counted per conventional cubic cell, which statements are correct?',
      options: ['There are 4 octahedral voids.', 'There are 8 tetrahedral voids.', 'The largest sphere that fits in an octahedral void has radius $0.414\\,r$.', 'A tetrahedral void is larger than an octahedral void.'], answer: [0, 1, 2],
      sol: '<b>4 octahedral:</b> true: one at the body centre plus 12 at edge centres shared by 4 cells, $1 + 3 = 4$ (one per atom). <b>8 tetrahedral:</b> true: at $(\\tfrac14,\\tfrac14,\\tfrac14)a$ and its 7 partners, all inside the cell (two per atom). <b>$0.414r$:</b> true. Along a cube edge, two corner spheres and the void centre fit in $a = 2r + 2r_v$, with $a = 2\\sqrt2\\,r$, so $r_v = (\\sqrt2 - 1)r = 0.414r$. <b>Tetrahedral larger:</b> false. The tetrahedral void takes only $0.225r$.',
      trap: 'More tetrahedral voids does not mean bigger ones: they are twice as many and much smaller.' },
    { id: 'cry-032', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: '2D lattices',
      q: 'A two-dimensional lattice has primitive vectors $\\vec a_1 = a\\,\\hat x$ and $\\vec a_2 = \\tfrac a2\\,\\hat x + \\tfrac{\\sqrt3}{2}a\\,\\hat y$. This lattice is',
      options: ['square', 'centred rectangular', 'hexagonal', 'oblique'], answer: 2,
      sol: '$|\\vec a_2| = a\\sqrt{\\tfrac14 + \\tfrac34} = a = |\\vec a_1|$, and $\\cos\\theta = \\dfrac{\\vec a_1\\cdot\\vec a_2}{a^2} = \\tfrac12$, so $\\theta = 60^\\circ$. Two equal vectors at $60^\\circ$ (or $120^\\circ$) define the hexagonal (triangular) lattice, which has 6-fold symmetry.',
      trap: 'A $60^\\circ$ rhombus looks like a centred rectangle. It can be described that way, but its full symmetry is hexagonal, which is the name used.' },
    { id: 'cry-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'planar density', unit: 'atoms/nm²',
      q: 'A bcc metal has lattice constant $0.30$ nm. The number of atoms per unit area on a $(110)$ plane is ______ atoms/nm$^2$ (to one decimal place).',
      answer: 15.7, tol: 0.15, calc: () => S2 / 0.3 ** 2,
      sol: 'The $(110)$ plane through the cell is a rectangle $a$ by $\\sqrt2\\,a$ (an edge and a face diagonal). It contains 4 corner atoms, each with a quarter inside ($4\\times\\tfrac14 = 1$), and the body-centre atom, which lies exactly in the plane (1). So 2 atoms on area $\\sqrt2\\,a^2$: density $= \\dfrac{2}{\\sqrt2\\,a^2} = \\dfrac{\\sqrt2}{a^2} = \\dfrac{1.414}{0.09} = 15.7$ nm$^{-2}$. This is the densest plane in bcc.',
      trap: 'Forgetting the body-centre atom, which gives half the answer.' },
    { id: 'cry-034', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'angles between planes',
      q: 'In a cubic crystal, the angle between the planes $(111)$ and $(11\\bar1)$ is',
      options: ['$70.5^\\circ$', '$90^\\circ$', '$35.3^\\circ$', '$54.7^\\circ$'], answer: 0,
      sol: 'The angle between planes is the angle between their normals: $\\cos\\theta = \\dfrac{1\\cdot1 + 1\\cdot1 + 1\\cdot(-1)}{\\sqrt3\\sqrt3} = \\dfrac13$, so $\\theta = 70.5^\\circ$. (These are two faces of the octahedron formed by the $\\{111\\}$ planes.)',
      trap: '$54.7^\\circ$ is the angle between $(111)$ and $(100)$; $\\cos\\theta = 1/3$ does not mean $\\theta = 1/3$ of $90^\\circ$.' },
    { id: 'cry-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'linear density',
      q: 'The number of atoms per unit length along the $[111]$ direction of a bcc crystal with lattice constant $a$ is',
      options: ['$1/(\\sqrt3\\,a)$', '$2/(\\sqrt3\\,a)$', '$1/a$', '$\\sqrt3/(2a)$'], answer: 1,
      sol: 'Along the body diagonal (length $\\sqrt3\\,a$) the atoms are corner, centre, corner, touching all the way. Within one diagonal there is $\\tfrac12 + 1 + \\tfrac12 = 2$ atoms (the end atoms are shared with the next diagonal segment). So the linear density is $2/(\\sqrt3\\,a)$: one atom every $\\sqrt3\\,a/2$, the nearest-neighbour distance.',
      trap: 'Forgetting the body-centre atom gives $1/(\\sqrt3\\,a)$.' },
    { id: 'cry-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'reciprocal lattice', format: 'statements',
      q: 'Which statements about the reciprocal lattice (defined with $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$) are correct?',
      options: ['The reciprocal lattice vector $\\vec G = h\\vec b_1 + k\\vec b_2 + l\\vec b_3$ is perpendicular to the $(hkl)$ planes.', 'For coprime $h, k, l$, $|\\vec G_{hkl}| = 2\\pi/d_{hkl}$.', 'The volume of the reciprocal primitive cell is $(2\\pi)^3/V_c$, where $V_c$ is the volume of the direct primitive cell.', 'The reciprocal of the reciprocal lattice is the direct lattice scaled by $(2\\pi)^2$.'], answer: [0, 1, 2],
      sol: '<b>Perpendicular:</b> true. The plane $(hkl)$ contains $\\vec a_1/h - \\vec a_2/k$ and $\\vec a_2/k - \\vec a_3/l$, and $\\vec G$ dotted with each gives $2\\pi - 2\\pi = 0$. <b>$2\\pi/d$:</b> true: $d$ is the distance from the origin to the plane through $\\vec a_1/h$, which is $\\hat G\\cdot\\vec a_1/h = 2\\pi/|\\vec G|$. <b>$(2\\pi)^3/V_c$:</b> true: $\\vec b_1\\cdot(\\vec b_2\\times\\vec b_3) = (2\\pi)^3/V_c$. <b>Scaled by $(2\\pi)^2$:</b> false. Applying the same definition twice gives back exactly the direct lattice: the $2\\pi$ factors cancel because $\\vec a_i\\cdot\\vec b_j = 2\\pi\\delta_{ij}$ is symmetric in the two sets.',
      trap: 'The $2\\pi$ convention makes the reciprocal of the reciprocal exactly the original lattice, with no extra factor.' },
    { id: 'cry-037', type: 'nat', level: 4, exams: ['jam'], sub: 'density', unit: 'g/cm³',
      q: 'Silicon has the diamond structure with $a = 5.43$ Å and molar mass $28.09$ g/mol. Take $N_A = 6.022\\times10^{23}$ mol$^{-1}$. Its density is ______ g/cm$^3$ (to two decimal places).',
      answer: 2.33, tol: 0.03, calc: () => 8 * 28.09 / (6.022e23 * (5.43e-8) ** 3),
      sol: 'Diamond cubic has 8 atoms per conventional cell. $a^3 = (5.43\\times10^{-8})^3 = 1.601\\times10^{-22}$ cm$^3$. $\\rho = \\dfrac{8\\times28.09}{6.022\\times10^{23}\\times1.601\\times10^{-22}} = \\dfrac{224.7}{96.41} = 2.33$ g/cm$^3$.',
      trap: 'Using 4 atoms per cell because the lattice is fcc gives half the answer: diamond has 2 atoms per lattice point.' },
    { id: 'cry-038', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'close packing',
      q: 'For ideal hcp packing of identical spheres, the ratio $c/a$ is ______ (to three decimal places).',
      answer: 1.633, tol: 0.002, calc: () => Math.sqrt(8 / 3),
      sol: 'A sphere of the B layer sits in the hollow over three touching A spheres. The four centres form a regular tetrahedron of edge $a$, whose height is $\\sqrt{2/3}\\,a$. The hcp cell spans two layers (A to B to A), so $c = 2\\sqrt{2/3}\\,a$ and $c/a = \\sqrt{8/3} = 1.633$.',
      trap: 'Taking $c$ as one layer spacing gives $0.816$.' },
    { id: 'cry-039', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'hexagonal indices',
      q: 'In the four-index Miller-Bravais notation for hexagonal crystals, the plane written $(1\\,0\\,1)$ in three-index notation becomes',
      options: ['$(1\\,0\\,1\\,1)$', '$(1\\,1\\,0\\,1)$', '$(1\\,0\\,\\bar1\\,1)$', '$(0\\,1\\,\\bar1\\,1)$'], answer: 2,
      sol: 'Write $(hkil)$ with the extra index $i = -(h + k)$, which comes from the third basal axis $\\vec a_3 = -(\\vec a_1 + \\vec a_2)$. For $(101)$: $h = 1$, $k = 0$, $i = -1$, $l = 1$, giving $(10\\bar11)$. The point of the extra index is that symmetry-related planes then have permuted indices, like $(10\\bar11)$, $(01\\bar11)$, $(\\bar1101)$.',
      trap: 'Putting $l$ in the third place: the extra index is inserted third and $l$ moves to the fourth place.' },
    { id: 'cry-040', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'lattice and basis',
      q: 'Graphene is a single sheet of carbon atoms in a honeycomb pattern. As a crystal it is described as',
      options: ['a honeycomb Bravais lattice with one atom per lattice point', 'a square lattice with a two-atom basis', 'a rectangular lattice with a one-atom basis', 'a hexagonal (triangular) lattice with a two-atom basis'], answer: 3,
      sol: 'In a honeycomb, neighbouring atoms see their three bonds in mirror-image directions (pointing "up" for one sublattice and "down" for the other), so not all atoms are equivalent and the honeycomb is not a Bravais lattice. Picking one atom of each kind as the basis, the repeat pattern is a triangular lattice with lattice constant $\\sqrt3$ times the C-C distance.',
      trap: 'The honeycomb looks perfectly regular, but every lattice point must have identical surroundings in identical orientations.' },

    // ---------- level 5 ----------
    { id: 'cry-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'voids',
      q: 'In a bcc array of identical touching spheres of radius $r$, an octahedral interstitial site lies at a face centre, $(\\tfrac12, \\tfrac12, 0)a$. The radius of the largest small sphere that fits there, as a fraction of $r$, is ______ (to three decimal places).',
      answer: 0.155, tol: 0.002, calc: () => 2 / S3 - 1,
      sol: 'From the face centre the closest atoms are the two body centres directly above and below, at distance $a/2$ (the four corners of the face are farther, at $a/\\sqrt2$). So the void radius is $r_v = a/2 - r$. With $a = 4r/\\sqrt3$: $r_v = (2/\\sqrt3 - 1)r = 0.155r$.',
      trap: 'Measuring to the face corners ($a/\\sqrt2 - r = 0.633r$) misses the much closer body-centre atoms. The bcc octahedral site is squashed.' },
    { id: 'cry-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'voids',
      q: 'In the same bcc array (spheres of radius $r$), a tetrahedral site lies at $(\\tfrac12, \\tfrac14, 0)a$. The radius of the largest sphere that fits there, as a fraction of $r$, is ______ (to three decimal places).',
      answer: 0.291, tol: 0.003, calc: () => (Math.sqrt(5) - S3) / S3,
      sol: 'Distance to the corner $(0,0,0)$: $a\\sqrt{\\tfrac14 + \\tfrac1{16}} = \\tfrac{\\sqrt5}{4}a$. Distance to the body centre $(\\tfrac12,\\tfrac12,\\tfrac12)a$: $a\\sqrt{0 + \\tfrac1{16} + \\tfrac14} = \\tfrac{\\sqrt5}{4}a$, the same, as it should be for the centre of a tetrahedron. So $r_v = \\tfrac{\\sqrt5}{4}a - r$ with $a = 4r/\\sqrt3$: $r_v = \\left(\\tfrac{\\sqrt5}{\\sqrt3} - 1\\right)r = 0.291r$. Surprisingly, in bcc the tetrahedral site is larger than the octahedral one (0.155r), the reverse of fcc.',
      trap: 'Carrying over the fcc value $0.225r$: the bcc tetrahedron is irregular and roomier.' },
    { id: 'cry-043', type: 'msq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'interplanar spacing', format: 'statements',
      q: 'Take a centred cubic lattice with conventional cube edge $a$ and look at the actual spacing between neighbouring planes of <b>lattice points</b>. Which statements are correct?',
      options: ['In fcc, the lattice planes parallel to $(100)$ are $a/2$ apart.', 'In fcc, the lattice planes parallel to $(111)$ are $a/\\sqrt3$ apart.', 'In fcc, the lattice planes parallel to $(110)$ are $a/\\sqrt2$ apart.', 'In bcc, the lattice planes parallel to $(100)$ are $a/2$ apart.'], answer: [0, 1, 3],
      sol: 'The formula $a/\\sqrt{h^2+k^2+l^2}$ uses the conventional cube, but centring adds planes in between. <b>fcc (100):</b> face centres sit at $z = a/2$, so planes are $a/2$ apart (true). <b>fcc (111):</b> fcc points have coordinates that are multiples of $a/2$ with an even sum in those units, so $x + y + z$ takes only the values $0, a, 2a, \\ldots$ and the planes $x + y + z = $ const are $a/\\sqrt3$ apart (true). <b>fcc (110):</b> $x + y$ takes the values $0, a/2, a, \\ldots$ (from points like $(\\tfrac12, 0, \\tfrac12)a$), so the spacing is $\\tfrac{a/2}{\\sqrt2} = a/(2\\sqrt2)$, not $a/\\sqrt2$ (false). <b>bcc (100):</b> the body centre adds a plane at $z = a/2$ (true). This is the geometric reason why some reflections are missing in X-ray diffraction: the first-order $(100)$ reflection of bcc is cancelled by the extra plane halfway.',
      trap: 'Applying the cubic formula blindly. It is correct for simple cubic only; centring can halve the true spacing.' },
    { id: 'cry-044', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Miller indices',
      q: 'A tetragonal crystal has $a = b = 3$ Å and $c = 6$ Å. The crystal direction $[uvw]$ that is normal to the $(111)$ plane is',
      options: [hkl(1, 1, 1, '[]'), hkl(2, 2, 1, '[]'), hkl(1, 1, 2, '[]'), hkl(4, 4, 1, '[]')], answer: 3,
      sol: 'The plane $(111)$ cuts the axes at $a = 3$, $b = 3$ and $c = 6$ Å, so in Cartesian form it is $x/3 + y/3 + z/6 = 1$. Its normal is the gradient of the left side, $(\\tfrac13, \\tfrac13, \\tfrac16) \\propto (2, 2, 1)$. A crystal direction $[uvw]$ is the Cartesian vector $(ua, vb, wc) = (3u, 3v, 6w)$. Setting $(3u, 3v, 6w) \\propto (2, 2, 1)$ gives $u : v : w = \\tfrac23 : \\tfrac23 : \\tfrac16 = 4 : 4 : 1$, so the normal is $[4\\,4\\,1]$. Check: $(12, 12, 6) \\propto (2, 2, 1)$.',
      trap: 'In a non-cubic crystal $[111]$ is not normal to $(111)$; the indices of the normal direction depend on $c/a$.' },
    { id: 'cry-045', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'symmetry', format: 'statements',
      q: 'Which statements are correct?',
      options: ['A periodic crystal can have an 8-fold rotation axis.', 'Quasicrystals give sharp diffraction spots with 5-fold or 10-fold symmetry but have no translational periodicity.', 'There are exactly 5 Bravais lattices in two dimensions.', 'The centred square lattice is a sixth two-dimensional Bravais lattice.'], answer: [1, 2],
      sol: '<b>8-fold:</b> false. Only 1, 2, 3, 4 and 6-fold axes are compatible with translations. <b>Quasicrystals:</b> true. They are ordered (hence sharp spots) without repeating, which allows symmetries a lattice cannot have. <b>5 in 2D:</b> true: oblique, rectangular, centred rectangular, square, hexagonal. <b>Centred square:</b> false. A centred square is just a smaller square lattice turned by $45^\\circ$, with side $a/\\sqrt2$.',
      trap: 'Centring sometimes gives nothing new: centred square is square, base-centred cubic is tetragonal.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'cry-t21', type: 'mcq', level: 1, exams: ['jam'], sub: 'cubic cells',
      make(r) {
        const st = ['simple cubic', 'body-centred cubic', 'face-centred cubic', 'diamond cubic'], c = Q5.int(r, 0, 3);
        const [what, vals] = Q5.choose(r, [['number of atoms in the conventional cubic cell', ['1', '2', '4', '8']], ['coordination number (nearest neighbours of each atom)', ['6', '8', '12', '4']], ['packing fraction (hard spheres touching)', ['0.52', '0.68', '0.74', '0.34']]]);
        const o = Q5.mcqOptions(r, `$${vals[c]}$`, vals.filter((v, i) => i !== c).map((v) => `$${v}$`));
        return { q: `For the ${st[c]} structure of identical atoms, the ${what} is`, ...o,
          sol: 'Atoms per conventional cell: sc 1 (8 corners $\\times\\tfrac18$), bcc 2, fcc 4 ($+6\\times\\tfrac12$), diamond 8 (fcc plus 4 inside). Coordination: 6, 8, 12, 4. Packing fraction: $\\pi/6 = 0.52$, $\\sqrt3\\pi/8 = 0.68$, $\\sqrt2\\pi/6 = 0.74$, $\\sqrt3\\pi/16 = 0.34$.',
          trap: 'Diamond has 8 atoms per cell but only 4 neighbours: it is a very open structure.' };
      } },
    { id: 'cry-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'interplanar spacing', format: 'statements',
      make(r) {
        const a = Q5.pick(r, 3, 6, 0.1), R = (x) => Q5.round(x, 3);
        const T = [`$d_{110} = ${R(a / Math.SQRT2)}$ Å.`, `$d_{111} = ${R(a / Math.sqrt(3))}$ Å.`, 'The direction $[hkl]$ is perpendicular to the planes $(hkl)$.', 'The $(200)$ planes are half as far apart as the $(100)$ planes.', 'The planes $(hkl)$ and $(\\bar h\\bar k\\bar l)$ are parallel.'];
        const F = [`$d_{110} = ${R(a * Math.SQRT2)}$ Å.`, `$d_{111} = ${R(a / 3)}$ Å.`, 'The $(200)$ planes are twice as far apart as the $(100)$ planes.', 'A plane parallel to the $c$ axis has Miller index $l = \\infty$.', 'The direction $[hkl]$ always lies within the planes $(hkl)$.'];
        const o = q5msq(r, T, F);
        return { q: `A cubic crystal has lattice constant $a = ${a}$ Å. Which statements are correct?`, ...o,
          sol: `In a cubic lattice $d_{hkl} = a/\\sqrt{h^2 + k^2 + l^2}$: $d_{110} = a/\\sqrt2 = ${R(a / Math.SQRT2)}$ Å, $d_{111} = a/\\sqrt3 = ${R(a / Math.sqrt(3))}$ Å, $d_{200} = a/2$. The normal to $(hkl)$ is along $[hkl]$ (cubic only). $(\\bar h\\bar k\\bar l)$ is the same set of planes seen from the other side. A plane parallel to an axis meets it at infinity, and the index is the reciprocal: $0$.`,
          trap: 'Miller indices are reciprocals of intercepts, so "parallel to an axis" gives 0, not infinity.' };
      } },
    { id: 'cry-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'density', unit: 'Å',
      make(r) {
        const fcc = r() < 0.5, M = Q5.int(r, 20, 200), rho = Q5.pick(r, 1, 20, 0.1), n = fcc ? 4 : 2;
        const a = Math.cbrt(n * M / (rho * 6.022e23)) * 1e8, rad = fcc ? a * Math.SQRT2 / 4 : a * Math.sqrt(3) / 4;
        return { q: `An element of molar mass $${M}$ g/mol crystallises in the ${fcc ? 'face' : 'body'}-centred cubic structure with density $${rho}$ g/cm$^3$. Treating the atoms as touching hard spheres, the atomic radius is ______ Å (to three decimal places; $N_A = 6.022\\times10^{23}$).`,
          answer: Q5.round(rad, 3), tol: 0.003, fcc, M, rho,
          sol: `$\\rho = \\dfrac{nM}{N_Aa^3}$ with $n = ${n}$, so $a = \\left(\\dfrac{${n}\\times${M}}{${rho}\\times6.022\\times10^{23}}\\right)^{1/3}$ cm $= ${Q5.round(a, 3)}$ Å. Atoms touch along the ${fcc ? 'face diagonal: $4r = \\sqrt2a$' : 'body diagonal: $4r = \\sqrt3a$'}, so $r = ${Q5.round(rad, 3)}$ Å.`,
          trap: fcc ? 'In fcc the atoms touch along the face diagonal, not the cube edge.' : 'In bcc the atoms touch along the body diagonal, not the cube edge.' };
      },
      verify: (p) => { const n = p.fcc ? 4 : 2, PF = p.fcc ? Math.PI * Math.SQRT2 / 6 : Math.PI * Math.sqrt(3) / 8, a3 = n * p.M / (p.rho * 6.022e23) * 1e24; return Math.cbrt(PF * a3 * 3 / (4 * Math.PI * n)); } },
    { id: 'cry-t24', type: 'mcq', level: 2, exams: ['jam'], sub: 'Miller indices',
      make(r) {
        const h = Q5.int(r, 0, 3), k = Q5.int(r, 0, 3), l = h + k === 0 ? Q5.int(r, 1, 3) : Q5.int(r, 0, 3);
        const ic = (n) => (n === 0 ? '\\infty\\,' : n === 1 ? '1' : q5frac(1, n)), dr = (n) => String(n);
        const tri = (f, x, y, z) => `$${f(x)}a,\\ ${f(y)}b,\\ ${f(z)}c$`;
        const o = Q5.mcqOptions(r, tri(ic, h, k, l), [tri(dr, h, k, l), tri(ic, l, k, h), tri(ic, k, h, l), tri((n) => (n === 0 ? '0' : n === 1 ? '1' : q5frac(1, n)), h, k, l), tri(ic, h + 1, k + 1, l + 1), tri(dr, h + 1, k + 1, l + 1), tri(ic, h + 2, k + 2, l + 2)]);
        return { q: `A plane in a crystal has Miller indices $(${h}${k}${l})$. It cuts the $a$, $b$ and $c$ axes at (taking the plane of the family nearest the origin that does not pass through it)`, ...o,
          sol: `Miller indices are the reciprocals of the intercepts (in units of $a$, $b$, $c$), cleared of fractions. Going back: intercepts $1/${h}$, $1/${k}$, $1/${l}$, where $1/0$ means the plane never meets that axis (it is parallel to it): ${tri(ic, h, k, l)}.`,
          trap: 'A zero index means the plane is parallel to that axis (intercept at infinity), not that it passes through the origin.' };
      } },
    { id: 'cry-t25', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'planar density',
      make(r) {
        const st = Q5.int(r, 0, 2), names = ['simple cubic', 'body-centred cubic', 'face-centred cubic'];
        const D = [{ 100: 1, 110: 1 / Math.SQRT2, 111: 1 / Math.sqrt(3) }, { 100: 1, 110: Math.SQRT2, 111: 1 / Math.sqrt(3) }, { 100: 2, 110: Math.SQRT2, 111: 4 / Math.sqrt(3) }][st];
        const [p1, p2] = Q5.choose(r, [['100', '110'], ['110', '100'], ['111', '100'], ['100', '111'], ['110', '111'], ['111', '110']]);
        const ratio = D[p1] / D[p2];
        return { q: `In a ${names[st]} crystal of one kind of atom, the number of atoms per unit area on a $(${p1})$ plane divided by that on a $(${p2})$ plane is ______ (to three decimal places).`,
          answer: Q5.round(ratio, 3), tol: 0.002, st, p1, p2,
          sol: `Count atoms in each plane of the cubic cell and divide by its area (in units of $1/a^2$). ${['sc: $(100)$ $1$, $(110)$ $1/\\sqrt2$, $(111)$ $1/\\sqrt3$', 'bcc: $(100)$ $1$ (the body centre is not in the face), $(110)$ $2/\\sqrt2 = \\sqrt2$ (corners plus body centre in a $a\\times\\sqrt2a$ rectangle), $(111)$ $\\tfrac12$ atom in an area $\\tfrac{\\sqrt3}{2}a^2$, i.e. $1/\\sqrt3$', 'fcc: $(100)$ $2$, $(110)$ $2/\\sqrt2 = \\sqrt2$, $(111)$ $2$ atoms in an area $\\tfrac{\\sqrt3}{2}a^2$, i.e. $4/\\sqrt3$'][st]}. Ratio $= ${Q5.round(ratio, 3)}$. (Check: density $= n\\,d$, atoms per volume times the true spacing of lattice planes.)`,
          trap: 'The most densely packed planes are the most widely spaced: $(110)$ in bcc, $(111)$ in fcc.' };
      },
      verify: (p) => { const n = [1, 2, 4][p.st]; const ok = (h, k, l) => (p.st === 0 ? true : p.st === 1 ? (h + k + l) % 2 === 0 : (h % 2 === k % 2 && k % 2 === l % 2)); const dens = (s) => { const [h, k, l] = s.split('').map(Number); let m = 1; while (!ok(m * h, m * k, m * l)) m++; return n / (m * Math.sqrt(h * h + k * k + l * l)); }; return dens(p.p1) / dens(p.p2); } },
    { id: 'cry-g01', type: 'nat', level: 2, exams: ['jam'], sub: 'interplanar spacing',
      make(r) {
        const a = pick(r, 2.8, 6.2, 0.01);
        const [h, k, l] = choose(r, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0], [2, 1, 0], [2, 1, 1], [2, 2, 0], [3, 1, 0], [3, 1, 1], [2, 2, 2], [3, 2, 1]]);
        const N = h * h + k * k + l * l, d = a / Math.sqrt(N);
        return { q: `A cubic crystal has lattice constant $${a}$ Å. The spacing of its ${hkl(h, k, l)} planes is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: 0.003, unit: 'Å', a, N,
          sol: `$d_{hkl} = a/\\sqrt{h^2+k^2+l^2} = ${a}/\\sqrt{${N}} = ${round(d, 3)}$ Å.`,
          trap: 'Dividing by $h + k + l$ instead of $\\sqrt{h^2 + k^2 + l^2}$.' };
      },
      verify: (p) => p.a / Math.sqrt(p.N) },
    { id: 'cry-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'density',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), S = STRUCT[key];
        const a = pick(r, 2.8, 5.8, 0.01), M = pick(r, 20, 210, 0.01);
        const rho = S.n * M / (6.022e23 * (a * 1e-8) ** 3);
        return { q: `An element of molar mass $${M}$ g/mol crystallises in the ${S.name} structure with lattice constant $${a}$ Å. Take $N_A = 6.022\\times10^{23}$ mol$^{-1}$. Its density is ______ g/cm$^3$ (to two decimal places).`,
          answer: round(rho, 2), tol: Math.max(0.02, round(rho * 0.01, 2)), unit: 'g/cm³', n: S.n, M, a,
          sol: `${S.name[0].toUpperCase() + S.name.slice(1)} has $n = ${S.n}$ atom${S.n > 1 ? 's' : ''} per conventional cell. $\\rho = \\dfrac{nM}{N_A a^3} = \\dfrac{${S.n}\\times${M}}{6.022\\times10^{23}\\times(${a}\\times10^{-8})^3} = ${round(rho, 2)}$ g/cm$^3$.`,
          trap: 'Using the wrong number of atoms per cell, or $a$ in Å instead of cm.' };
      },
      verify: (p) => p.n * p.M / (6.022e23 * (p.a * 1e-8) ** 3) },
    { id: 'cry-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'cubic cells',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), S = STRUCT[key];
        const a = pick(r, 2.5, 6.0, 0.01), rr = a * S.nn / 2;
        return { q: `A crystal has the ${S.name} structure with lattice constant $${a}$ Å. Treating the nearest neighbours as touching hard spheres, the atomic radius is ______ Å (to three decimal places).`,
          answer: round(rr, 3), tol: 0.003, unit: 'Å', a, f: S.nn / 2,
          sol: { sc: 'Atoms touch along the cube edge: $2r = a$.', bcc: 'Atoms touch along the body diagonal: $4r = \\sqrt3\\,a$.', fcc: 'Atoms touch along the face diagonal: $4r = \\sqrt2\\,a$.', diamond: 'Atoms touch along a quarter of the body diagonal: $2r = \\sqrt3\\,a/4$.' }[key] + ` So $r = ${round(rr, 3)}$ Å.`,
          trap: 'Using the touching direction of a different structure.' };
      },
      verify: (p) => p.a * p.f },
    { id: 'cry-g04', type: 'mcq', level: 2, exams: ['jam'], sub: 'Miller indices',
      make(r) {
        // intercepts as fractions p/q in units of the axes, or infinity (0 index)
        const pool = [[1, 1], [2, 1], [3, 1], [1, 2], [-1, 1], [-2, 1], [1, 3], [0, 0], [4, 1], [3, 2]];
        let ints;
        do { ints = [choose(r, pool), choose(r, pool), choose(r, pool)]; } while (ints.every((t) => t[0] === 0));
        const recip = ints.map(([p, q]) => (p === 0 ? [0, 1] : [q * Math.sign(p), Math.abs(p)])); // q/p as [num, den]
        const L = recip.reduce((m, [, d]) => (m * d) / gcd(m, d), 1);
        let idx = recip.map(([n, d]) => (n * L) / d);
        const g = idx.reduce((m, v) => gcd(m, v), 0) || 1; idx = idx.map((v) => v / g);
        const showI = ([p, q]) => (p === 0 ? '\\infty' : q === 1 ? `${p}` : `${p}/${q}`);
        const axes = ['a', 'b', 'c'];
        const coef = (t) => (t[1] === 1 && Math.abs(t[0]) === 1 ? (t[0] < 0 ? '-' : '') : `${showI(t)}\\,`);
        const desc = ints.map((t, i) => (t[0] === 0 ? `parallel to the $${axes[i]}$ axis` : `$${coef(t)}${axes[i]}$`)).join(', ');
        const T = (v) => hkl(...v);
        const plain = ints.map(([p, q]) => (p === 0 ? 0 : Math.round(p / q) || Math.sign(p)));
        const wrongs = [plain, [idx[2], idx[1], idx[0]], idx.map((v) => Math.abs(v)), [idx[1], idx[0], idx[2]], [idx[0], idx[2], idx[1]],
          idx.map((v, i) => (i === 0 ? -v || 1 : v)), idx.map((v, i) => (i === 2 ? -v || 1 : v)), idx.map((v) => v + 1), idx.map((v) => v + 2), [1, 1, 1], [2, 1, 3]];
        const o = mcqOptions(r, idx.join(','), wrongs.map((w) => w.join(',')), (s) => T(String(s).split(',').map(Number)));
        return { q: `A plane meets the crystal axes as follows: ${desc}. Its Miller indices are`, ...o,
          sol: `Intercepts in axis units: $${ints.map(showI).join(',\\;')}$. Reciprocals: $${recip.map(([n, d]) => (n === 0 ? '0' : d === 1 ? `${n}` : `${n}/${d}`)).join(',\\;')}$. Clear fractions and common factors: ${T(idx)}. An intercept at infinity gives index 0, a negative one a bar.`,
          trap: 'Writing the intercepts instead of their reciprocals, or losing a minus sign.' };
      } },
    { id: 'cry-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'directions',
      make(r) {
        const dirs = [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 0], [2, 1, 1], [1, 1, 2], [1, -1, 0], [1, -1, 1], [0, 1, 1], [3, 1, 0], [1, 2, 3]];
        let u, v;
        do { u = choose(r, dirs); v = choose(r, dirs); } while (u === v);
        const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2], nu = Math.hypot(...u), nv = Math.hypot(...v);
        const ang = Math.acos(dot / (nu * nv)) * 180 / PI;
        return { q: `In a cubic crystal, the angle between the directions ${hkl(...u, '[]')} and ${hkl(...v, '[]')} is ______ degrees (to one decimal place).`,
          answer: round(ang, 1), tol: 0.1, unit: 'degree', u, v,
          sol: `$\\cos\\theta = \\dfrac{${dot}}{\\sqrt{${u[0] ** 2 + u[1] ** 2 + u[2] ** 2}}\\sqrt{${v[0] ** 2 + v[1] ** 2 + v[2] ** 2}}} = ${round(dot / (nu * nv), 4)}$, so $\\theta = ${round(ang, 1)}^\\circ$.`,
          trap: 'This dot-product rule holds for cubic crystals only.' };
      },
      verify: (p) => Math.acos((p.u[0] * p.v[0] + p.u[1] * p.v[1] + p.u[2] * p.v[2]) / (Math.hypot(...p.u) * Math.hypot(...p.v))) * 180 / Math.PI },
    { id: 'cry-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'density',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), S = STRUCT[key];
        const a = pick(r, 2.8, 5.8, 0.01), M = pick(r, 20, 210, 0.1);
        const rho = round(S.n * M / (6.022e23 * (a * 1e-8) ** 3), 3);
        const n = rho * 6.022e23 * (a * 1e-8) ** 3 / M;
        return { q: `A cubic element of molar mass $${M}$ g/mol has lattice constant $${a}$ Å and density $${rho}$ g/cm$^3$. Take $N_A = 6.022\\times10^{23}$ mol$^{-1}$. The number of atoms in its conventional unit cell is ______.`,
          answer: S.n, tol: 0, rho, a, M,
          sol: `$n = \\dfrac{\\rho N_A a^3}{M} = \\dfrac{${rho}\\times6.022\\times10^{23}\\times(${a}\\times10^{-8})^3}{${M}} = ${round(n, 3)} \\approx ${S.n}$, so the structure is ${S.name}.`,
          trap: 'Not converting Å to cm (1 Å = $10^{-8}$ cm) changes the answer by $10^{24}$.' };
      },
      verify: (p) => Math.round(p.rho * 6.022e23 * (p.a * 1e-8) ** 3 / p.M) },
    { id: 'cry-g07', type: 'nat', level: 2, exams: ['jam'], sub: 'nearest neighbour',
      make(r) {
        const key = choose(r, ['sc', 'bcc', 'fcc', 'diamond']), S = STRUCT[key];
        const a = pick(r, 2.5, 6.5, 0.01), d = a * S.nn;
        return { q: `The nearest-neighbour distance in a ${S.name} crystal with lattice constant $${a}$ Å is ______ Å (to three decimal places).`,
          answer: round(d, 3), tol: 0.003, unit: 'Å', a, f: S.nn,
          sol: { sc: 'Neighbours are along the edge: $d = a$.', bcc: 'Corner to body centre: $d = \\sqrt3\\,a/2$.', fcc: 'Corner to face centre: $d = a/\\sqrt2$.', diamond: 'Along the tetrahedral bond, a quarter of the body diagonal: $d = \\sqrt3\\,a/4$.' }[key] + ` So $d = ${round(d, 3)}$ Å. Each atom has ${S.cn} such neighbours.`,
          trap: 'Taking $a$ as the neighbour distance for every structure.' };
      },
      verify: (p) => p.a * p.f },
    { id: 'cry-g08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'planar density',
      make(r) {
        // atoms per a^2 on the plane through the conventional cell
        const cases = [['fcc', '(100)', 2], ['fcc', '(110)', S2], ['fcc', '(111)', 4 / S3], ['bcc', '(100)', 1], ['bcc', '(110)', S2], ['sc', '(100)', 1], ['sc', '(110)', 1 / S2], ['sc', '(111)', 1 / S3]];
        const [key, pl, k] = choose(r, cases);
        const a = pick(r, 0.28, 0.6, 0.01), sig = k / (a * a);
        const how = { 'fcc(100)': 'a square $a\\times a$ with 4 corners ($\\tfrac14$ each) and a face centre: 2 atoms on $a^2$', 'fcc(110)': 'a rectangle $a\\times\\sqrt2a$ with 4 corners ($\\tfrac14$ each) and 2 face centres on the long sides ($\\tfrac12$ each): 2 atoms on $\\sqrt2a^2$', 'fcc(111)': 'a triangle of area $\\tfrac{\\sqrt3}{2}a^2$ with 3 corners ($\\tfrac16$ each) and 3 edge atoms ($\\tfrac12$ each): 2 atoms', 'bcc(100)': 'a square $a\\times a$ with 4 corners only (the body centre is not in this plane): 1 atom on $a^2$', 'bcc(110)': 'a rectangle $a\\times\\sqrt2a$ with 4 corners and the body centre: 2 atoms on $\\sqrt2a^2$', 'sc(100)': 'a square $a\\times a$ with 4 corners: 1 atom on $a^2$', 'sc(110)': 'a rectangle $a\\times\\sqrt2a$ with 4 corners: 1 atom on $\\sqrt2a^2$', 'sc(111)': 'a triangle of area $\\tfrac{\\sqrt3}{2}a^2$ with 3 corners ($\\tfrac16$ each): $\\tfrac12$ atom' }[key + pl];
        return { q: `A ${STRUCT[key].name} crystal has lattice constant $${a}$ nm. The number of atoms per unit area on its $${pl}$ plane is ______ atoms/nm$^2$ (to one decimal place).`,
          answer: round(sig, 1), tol: Math.max(0.1, round(sig * 0.01, 1)), unit: 'atoms/nm²', k, a,
          sol: `The plane cuts the cell in ${how}. So the density is $${round(k, 4)}/a^2 = ${round(k, 4)}/${round(a * a, 4)} = ${round(sig, 1)}$ nm$^{-2}$.`,
          trap: 'Counting corner atoms as whole atoms, or as $\\tfrac18$ (that is for volumes, not areas).' };
      },
      verify: (p) => p.k / (p.a * p.a) },
    ...r4.gens,
  ],
};
