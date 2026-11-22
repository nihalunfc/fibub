// Round 4 extras for crystal-structure: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'];

const P = (n) => (n < 0 ? `(${n})` : `${n}`);
const bar = (v) => v.map((x) => (x < 0 ? `\\bar${-x}` : `${x}`)).join('');

export default {
  items: [
    { id: 'cry-r4-01', type: 'mcq', level: 1, exams: J, sub: 'crystals',
      q: R`Which of these solids has long-range order, with the same arrangement of atoms repeating throughout the sample?`,
      options: [R`Window glass`, R`Polystyrene (as in a plastic cup)`, R`A quartz crystal`, R`Candle wax that has set quickly`], answer: 2,
      sol: R`Quartz is crystalline SiO$_2$: a unit cell repeats regularly in all directions, giving sharp X-ray reflections. Window glass has the same short-range units (SiO$_4$ tetrahedra) joined at random, so it has only short-range order. Polystyrene is an amorphous polymer, and quickly cooled wax is mostly disordered too.`,
      trap: R`Glass is hard and transparent like quartz but is amorphous: no repeating unit cell.` },
    { id: 'cry-r4-02', type: 'mcq', level: 3, exams: JG, sub: 'ionic structures',
      q: R`In the caesium chloride structure each cation sits at a cube centre with $8$ anions at the corners. Treating ions as hard spheres that must touch their opposite neighbours, the smallest radius ratio $r_+/r_-$ for which this arrangement is stable (anions not forced to overlap) is`,
      options: [R`$0.414$`, R`$0.225$`, R`$0.732$`, R`$1.000$`], answer: 2,
      sol: R`Cation and anions touch along the body diagonal: $\sqrt3a = 2(r_+ + r_-)$. The anions at neighbouring corners must not overlap: $a\ge2r_-$. Together $2(r_+ + r_-)\ge2\sqrt3r_-$, so $r_+/r_-\ge\sqrt3 - 1 = 0.732$. Smaller cations rattle in the cube and the structure switches to 6-fold (rock salt, $\ge0.414$) or 4-fold ($\ge0.225$) coordination.`,
      trap: R`$0.414$ is the limit for 6-fold (octahedral) coordination, not 8-fold.` },
    { id: 'cry-r4-03', type: 'nat', level: 2, exams: J, sub: 'packing fraction',
      q: R`Identical circular discs are laid flat on a table in the closest possible (hexagonal) arrangement, each touching six others. The fraction of the table area they cover is ______ (to three decimal places).`,
      answer: 0.907, tol: 0.002, calc: () => Math.PI / (2 * Math.sqrt(3)),
      sol: R`Take discs of radius $r$ on a triangular lattice of spacing $2r$. One disc per primitive cell, a rhombus of area $(2r)^2\sin60^\circ = 2\sqrt3r^2$. Fraction $= \pi r^2/2\sqrt3r^2 = \pi/2\sqrt3 = 0.907$. A square arrangement covers only $\pi/4 = 0.785$.`,
      trap: R`$0.785$ is the square arrangement; each disc in the hexagonal one has six neighbours, not four.` },
    { id: 'cry-r4-04', type: 'msq', level: 3, exams: JG, sub: 'zone law', format: 'statements',
      q: R`In a cubic crystal, which of these directions lie in the plane $(111)$?`,
      options: [R`$[1\bar10]$`, R`$[11\bar2]$`, R`$[111]$`, R`$[101]$`], answer: [0, 1],
      sol: R`A direction $[uvw]$ lies in the plane $(hkl)$ when $hu + kv + lw = 0$ (the Weiss zone law; in cubic crystals $[hkl]$ is the plane normal). $[1\bar10]$: $1 - 1 + 0 = 0$, yes. $[11\bar2]$: $1 + 1 - 2 = 0$, yes. $[111]$: $3$, it is the normal. $[101]$: $2$, no.`,
      trap: R`$[111]$ is perpendicular to $(111)$, not in it.` },
    { id: 'cry-r4-05', type: 'nat', level: 3, exams: J, sub: 'density', unit: 'g/cm³',
      q: R`Sodium chloride has the rock-salt structure with cube edge $a = 5.64$ Å. With molar masses Na $22.99$ and Cl $35.45$ g/mol and $N_A = 6.022\times10^{23}$ mol$^{-1}$, its density is ______ g/cm$^3$ (to two decimal places).`,
      answer: 2.16, tol: 0.02, calc: () => 4 * 58.44 / (6.022e23 * (5.64e-8) ** 3),
      sol: R`The conventional cube holds $4$ Na$^+$ and $4$ Cl$^-$, i.e. $4$ formula units of mass $58.44$ g/mol. $a^3 = (5.64\times10^{-8})^3 = 1.794\times10^{-22}$ cm$^3$. $\rho = \dfrac{4\times58.44}{6.022\times10^{23}\times1.794\times10^{-22}} = \dfrac{233.8}{108.0} = 2.16$ g/cm$^3$.`,
      trap: R`Counting $8$ formula units (all ions) doubles the density; there are $4$ of each ion.` },
    { id: 'cry-r4-06', type: 'mcq', level: 3, exams: J, sub: 'neighbours',
      q: R`In a bcc crystal with cube edge $a$, the second-nearest neighbours of an atom are`,
      options: [R`$12$ atoms at distance $a\sqrt2$`, R`$8$ atoms at distance $a\sqrt3/2$`, R`$6$ atoms at distance $a$`, R`$12$ atoms at distance $a$`], answer: 2,
      sol: R`Put an atom at a cube corner. Its nearest neighbours are the $8$ body centres around it, at $a\sqrt3/2 = 0.866a$. Next come the corner atoms of the neighbouring cubes along $\pm x, \pm y, \pm z$: $6$ atoms at $a$, only $15\%$ farther. Then $12$ at $a\sqrt2$.`,
      trap: R`The 8 at $0.866a$ are the nearest, not the second-nearest.` },
    { id: 'cry-r4-07', type: 'msq', level: 3, exams: JG, sub: 'lattice and basis', format: 'statements',
      q: R`For crystals made of a single kind of atom, which of these arrangements of the atoms are themselves Bravais lattices (every atom has an identical surrounding, in the same orientation)?`,
      options: [R`Hexagonal close packed (hcp)`, R`Diamond`, R`Body-centred cubic`, R`Face-centred cubic`], answer: [2, 3],
      sol: R`In bcc and fcc every atom sees exactly the same surroundings in the same orientation, so the atoms form a lattice. In hcp, atoms in the A and B layers have surroundings rotated by $60^\circ$ relative to each other: it is a hexagonal lattice with a two-atom basis. Diamond is an fcc lattice with a two-atom basis, $(0,0,0)$ and $(\tfrac14,\tfrac14,\tfrac14)a$, whose two atoms have inverted tetrahedral surroundings.`,
      trap: R`Identical atoms do not make a Bravais lattice; their surroundings must also be identical in orientation.` },
    { id: 'cry-r4-08', type: 'nat', level: 4, exams: JG, sub: 'packing fraction',
      q: R`Caesium chloride has Cs$^+$ (radius $1.69$ Å) at the cube centre and Cl$^-$ (radius $1.81$ Å) at the corners, with the ions touching along the body diagonal. Treating ions as hard spheres, the packing fraction is ______ (to three decimal places).`,
      answer: 0.683, tol: 0.002, calc: () => (4 / 3) * Math.PI * (1.69 ** 3 + 1.81 ** 3) / (2 * 3.5 / Math.sqrt(3)) ** 3,
      sol: R`Body diagonal: $\sqrt3a = 2(1.69 + 1.81) = 7.00$ Å, so $a = 4.041$ Å and $a^3 = 66.0$ Å$^3$. (Check: $a > 2r_- = 3.62$ Å, so the anions do not touch.) One cation and one anion per cell: volume $\tfrac43\pi(1.69^3 + 1.81^3) = 4.189\times10.757 = 45.06$ Å$^3$. Fraction $= 45.06/66.0 = 0.683$.`,
      trap: R`Using the bcc formula $0.680$ assumes equal spheres; the two ions differ in size.` },
    { id: 'cry-r4-09', type: 'mcq', level: 4, exams: JG, sub: 'symmetry',
      q: R`Which of these symmetry operations can belong to an infinite crystal but never to a single isolated molecule?`,
      options: [R`A screw axis (rotation combined with a translation along the axis)`, R`A mirror plane`, R`A centre of inversion`, R`A four-fold rotation axis`], answer: 0,
      sol: R`A finite object must keep at least one point fixed under all its symmetries, so its operations are rotations, reflections, inversion and their combinations (point groups). A screw axis or glide plane includes a fractional lattice translation, which no finite object can have but a periodic crystal can. These extra operations turn the 32 crystal point groups into 230 space groups.`,
      trap: R`Four-fold axes exist in molecules (for example XeF$_4$); it is five-fold axes that crystals cannot have.` },
    { id: 'cry-r4-10', type: 'nat', level: 5, exams: JG, sub: 'packing fraction',
      q: R`In the CsCl structure the cation (radius $r_+$) sits at the cube centre and the anions (radius $r_-$) at the corners, with $r_+ < r_-$. Treating ions as hard spheres and choosing the radius ratio freely, the largest possible packing fraction is ______ (to three decimal places).`,
      answer: 0.729, tol: 0.002, calc: () => (Math.PI / 6) * (1 + (Math.sqrt(3) - 1) ** 3),
      sol: R`With $x = r_+/r_-$, the cube edge is the larger of $2r_-$ (anions touch) and $2(r_+ + r_-)/\sqrt3$ (cation touches anions). For $x\le\sqrt3 - 1$ the edge is $2r_-$ and the fraction $\tfrac43\pi r_-^3(1 + x^3)/8r_-^3 = \tfrac\pi6(1 + x^3)$ rises with $x$. For larger $x$ the edge grows faster than the ions' volume and the fraction falls (to $0.680$ at $x = 1$). The best is at $x = \sqrt3 - 1 = 0.732$: $\tfrac\pi6(1 + 0.3923) = 0.729$.`,
      trap: R`Equal spheres ($x = 1$) give bcc's $0.680$, which is not the maximum here.` },
  ],
  gens: [
    { id: 'cry-r4g1', type: 'nat', level: 4, exams: JG, sub: 'packing fraction',
      make(r) {
        const st = choose(r, ['CsCl', 'NaCl']), rm = pick(r, 1.3, 2.2, 0.01), x = pick(r, 0.45, 0.95, 0.01), rp = round(rm * x, 2);
        const a = st === 'CsCl' ? Math.max(2 * rm, 2 * (rp + rm) / Math.sqrt(3)) : Math.max(2 * Math.SQRT2 * rm, 2 * (rp + rm));
        const nf = st === 'CsCl' ? 1 : 4, pf = nf * (4 / 3) * Math.PI * (rp ** 3 + rm ** 3) / a ** 3;
        const anion = st === 'CsCl' ? Math.abs(a - 2 * rm) < 1e-9 : Math.abs(a - 2 * Math.SQRT2 * rm) < 1e-9;
        return { q: `An ionic crystal has the ${st === 'CsCl' ? 'caesium chloride' : 'rock-salt (NaCl)'} structure with cation radius $${rp}$ Å and anion radius $${rm}$ Å. Treating the ions as hard spheres packed as closely as the structure allows, the packing fraction is ______ (to three decimal places).`,
          answer: round(pf, 3), tol: 0.002, rp, rm, st,
          sol: `${st === 'CsCl' ? 'Cation and anions meet along the body diagonal ($\\sqrt3a = 2(r_+ + r_-)$) unless the corner anions touch first ($a = 2r_-$).' : 'Cation and anion meet along the cube edge ($a = 2(r_+ + r_-)$) unless the anions touch first along the face diagonal ($a = 2\\sqrt2r_-$).'} Here ${anion ? 'the anions touch' : 'cation and anion touch'}, so $a = ${round(a, 3)}$ Å. With ${nf} formula unit${nf > 1 ? 's' : ''} per cube: fraction $= ${nf}\\times\\tfrac43\\pi(${rp}^3 + ${rm}^3)/${round(a, 3)}^3 = ${round(pf, 3)}$.`,
          trap: 'Check which pair of ions touches first before fixing the cube edge.' };
      },
      verify: (p) => { const a = p.st === 'CsCl' ? Math.max(2 * p.rm, 2 * (p.rp + p.rm) / Math.sqrt(3)) : Math.max(2 * Math.SQRT2 * p.rm, 2 * (p.rp + p.rm)); return (p.st === 'CsCl' ? 1 : 4) * (4 / 3) * Math.PI * (p.rp ** 3 + p.rm ** 3) / a ** 3; } },
    { id: 'cry-r4g2', type: 'nat', level: 3, exams: J, sub: 'density', unit: 'g/cm³',
      make(r) {
        const [salt, st, M, a0] = choose(r, [['KCl', 'NaCl', 74.55, 6.29], ['LiF', 'NaCl', 25.94, 4.03], ['MgO', 'NaCl', 40.30, 4.21], ['CsBr', 'CsCl', 212.81, 4.29], ['CsI', 'CsCl', 259.81, 4.57], ['KBr', 'NaCl', 119.0, 6.60]]);
        const a = round(a0 + pick(r, -0.05, 0.05, 0.01), 2), nf = st === 'NaCl' ? 4 : 1, rho = nf * M / (6.022e23 * (a * 1e-8) ** 3);
        return { q: `${salt} has the ${st === 'NaCl' ? 'rock-salt' : 'caesium chloride'} structure with cube edge $a = ${a}$ Å and molar mass $${M}$ g/mol. With $N_A = 6.022\\times10^{23}$ mol$^{-1}$, its density is ______ g/cm$^3$ (to two decimal places).`,
          answer: round(rho, 2), tol: Math.max(0.01, round(rho * 0.005, 2)), nf, M, a,
          sol: `The ${st === 'NaCl' ? 'rock-salt' : 'CsCl'} cube holds ${nf} formula unit${nf > 1 ? 's' : ''}. $a^3 = (${a}\\times10^{-8})^3 = ${round((a * 1e-8) ** 3 * 1e23, 4)}\\times10^{-23}$ cm$^3$. $\\rho = \\dfrac{${nf}\\times${M}}{6.022\\times10^{23}\\times a^3} = ${round(rho, 2)}$ g/cm$^3$.`,
          trap: st === 'NaCl' ? 'The rock-salt cube holds 4 formula units (8 ions), not 1 or 8.' : 'The CsCl cube holds just 1 formula unit: 8 corner eighths plus the centre ion.' };
      },
      verify: (p) => p.nf * p.M / (6.022e23 * (p.a * 1e-8) ** 3) },
    { id: 'cry-r4g3', type: 'mcq', level: 3, exams: JG, sub: 'zone law',
      make(r) {
        const hkl = choose(r, [[1, 1, 1], [1, 1, 0], [1, 0, 0], [1, 1, 2], [1, 2, 0], [2, 1, 1], [1, -1, 1], [0, 1, 1], [1, 2, 2], [1, 2, 3]]);
        const vs = [];
        for (let u = -2; u <= 2; u++) for (let v = -2; v <= 2; v++) for (let w = -2; w <= 2; w++) {
          if (!u && !v && !w) continue;
          const g = [u, v, w].map(Math.abs).reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
          if (g !== 1) continue;
          if ([u, v, w].find((c) => c !== 0) < 0) continue;
          vs.push([u, v, w]);
        }
        const dot = (d) => d[0] * hkl[0] + d[1] * hkl[1] + d[2] * hkl[2];
        const ins = shuffle(r, vs.filter((d) => dot(d) === 0)), outs = shuffle(r, vs.filter((d) => dot(d) !== 0));
        const c = ins[0], show = (d) => `$[${bar(d)}]$`;
        const o = mcqOptions(r, show(c), outs.slice(0, 3).map(show));
        return { q: `In a cubic crystal, which direction lies in the plane $(${bar(hkl)})$?`, ...o,
          sol: `A direction $[uvw]$ lies in $(hkl)$ when $hu + kv + lw = 0$. For ${show(c)}: $${[0, 1, 2].map((i) => `${P(hkl[i])}\\cdot${P(c[i])}`).join(' + ')} = 0$. The other choices give ${outs.slice(0, 3).map((d) => dot(d)).join(', ')}, so they cross the plane.`,
          trap: 'The direction $[hkl]$ is the normal of $(hkl)$ in a cubic crystal; it is the one direction most clearly not in the plane.' };
      } },
  ],
};
