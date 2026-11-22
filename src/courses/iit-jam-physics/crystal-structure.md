---
title: Crystal structure, lattices and Miller indices
seoTitle: Crystal structure and Miller indices for IIT JAM Physics
summary: 'What a lattice and a basis are, the 14 Bravais lattices, the sc, bcc, fcc, diamond, NaCl and CsCl structures, packing fractions and densities, and how to name planes and directions with Miller indices and find their spacing.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'How many atoms does one conventional unit cell of a face-centred cubic metal contain?'
    choices: ['4', '14', '8', '2']
    ans: 0
    why: 'Eight corners shared by 8 cells give 1 atom; six face centres shared by 2 cells give 3. Total 4. Fourteen counts every atom drawn, forgetting the sharing.'
  - q: 'A plane cuts the cubic axes at 2a, 2a and a. What are its Miller indices?'
    choices: ['(112)', '(221)', '(111)', '(211)']
    ans: 0
    why: 'Reciprocals of 2, 2, 1 are 1/2, 1/2, 1. Multiply by 2 to clear fractions: (1 1 2). Writing the intercepts themselves gives (221), the classic slip.'
  - q: 'Caesium chloride has Cs at the cube corners and Cl at the body centre. What is its Bravais lattice?'
    choices: ['Simple cubic, with a two-ion basis', 'Body-centred cubic', 'Face-centred cubic', 'Hexagonal']
    ans: 0
    why: 'A lattice point needs identical surroundings. The centre holds a different ion, so it is not a lattice point. The lattice is simple cubic with a basis of one Cs and one Cl.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 1 and 2'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 4 and 5'
  - 'S. O. Pillai, Solid State Physics, 9th ed. (2020), chapters on crystal structure'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 45 minutes.** By the end you will be able to tell a lattice from a crystal structure, count atoms in any cubic cell, work out packing fractions, densities and neighbour distances, and move between a plane's intercepts, its Miller indices and its spacing. Every later lesson on solids (X-ray diffraction, bands, semiconductors) is built on this vocabulary.

<div class="bigidea">A crystal is one small pattern of atoms repeated on an endless grid of points. Name the grid, name the pattern, and you have described every atom in the solid.</div>

## 1. Lattice + basis = crystal

Look at a tiled floor. Ignore the tiles for a moment and put a dot at the same corner of every tile: the dots form a grid that repeats perfectly. That grid of points is a **lattice**. Now put back one tile at each dot: the tile is the **basis**.

```math
\text{crystal structure} = \text{lattice} + \text{basis}
```

A lattice is defined by its **primitive vectors** `$\vec a_1, \vec a_2, \vec a_3$`: every lattice point sits at

```math
\vec R = n_1\vec a_1 + n_2\vec a_2 + n_3\vec a_3, \qquad n_1, n_2, n_3 \text{ integers}
```

The test of a lattice point is simple and strict: **the view from every lattice point must be exactly the same**, in every direction. Keep this test in mind; it settles most trick questions.

<div class="meaning">

<dl>
<dt>Lattice</dt><dd>an infinite set of points, all with identical surroundings; pure geometry, no atoms</dd>
<dt>Basis</dt><dd>the group of atoms attached to each lattice point (one atom in copper, two in silicon)</dd>
<dt>Unit cell</dt><dd>a box that tiles space when repeated by lattice vectors</dd>
<dt>Primitive cell</dt><dd>the smallest such box: it holds exactly one lattice point</dd>
<dt>Conventional cell</dt><dd>a larger box chosen because it shows the symmetry clearly, like the cube for bcc and fcc</dd>
<dt>Physical meaning</dt><dd>The lattice says how the pattern repeats; the basis says what is repeated. Two crystals with the same lattice can look completely different (copper and salt are both fcc).</dd>
</dl>

</div>

## 2. The 14 Bravais lattices

How many genuinely different lattices are there? In two dimensions, 5: oblique, rectangular, centred rectangular, square and hexagonal. In three dimensions, the answer found by Auguste Bravais is **14**, grouped into **7 crystal systems** by the shape of their cell:

| System | Cell | Lattices |
|---|---|---|
| Cubic | `$a = b = c$`, all angles `$90^\circ$` | simple (P), body-centred (I), face-centred (F) |
| Tetragonal | `$a = b \ne c$`, all `$90^\circ$` | P, I |
| Orthorhombic | `$a \ne b \ne c$`, all `$90^\circ$` | P, I, F, base-centred (C) |
| Hexagonal | `$a = b \ne c$`, `$\gamma = 120^\circ$` | P |
| Trigonal | `$a = b = c$`, equal angles `$\ne 90^\circ$` | rhombohedral (R) |
| Monoclinic | one angle `$\ne 90^\circ$` | P, C |
| Triclinic | nothing equal | P |

Why are some centrings missing? Because they give nothing new. A "base-centred cubic" lattice loses its 3-fold axes and turns out to be simple tetragonal with a smaller cell; "face-centred tetragonal" is the same as body-centred tetragonal. Examiners love asking which of these is *not* a Bravais lattice.

Symmetry is restricted too. A lattice can only have 1, 2, 3, 4 or 6-fold rotation axes: a rotation must carry lattice vectors into lattice vectors, which forces `$1 + 2\cos\theta$` to be a whole number. Five-fold symmetry is impossible, just as you cannot tile a floor with regular pentagons. (Quasicrystals show 5-fold diffraction because they are ordered but not periodic.)

## 3. The cubic cells: count, touch, pack

Most exam questions use three cubic lattices. Turn the cells below and switch to "touching spheres" to see where the atoms meet.

<figure class="fig" data-fig="unit-cell"><figcaption>Corner atoms are shared by 8 cells, face atoms by 2, body-centre atoms by none. With touching spheres you can see the line along which the atoms meet: an edge (sc), a body diagonal (bcc), a face diagonal (fcc) or a tetrahedral bond (diamond).</figcaption></figure>

Every number follows from two facts: **how many atoms the cube owns**, and **along which line the atoms touch**.

| | sc | bcc | fcc (ccp) | diamond |
|---|---|---|---|---|
| Atoms per cube `$n$` | 1 | 2 | 4 | 8 |
| Atoms touch along | edge | body diagonal | face diagonal | quarter body diagonal |
| Radius `$r$` | `$a/2$` | `$\sqrt3a/4$` | `$\sqrt2a/4$` | `$\sqrt3a/8$` |
| Nearest neighbours | 6 at `$a$` | 8 at `$\sqrt3a/2$` | 12 at `$a/\sqrt2$` | 4 at `$\sqrt3a/4$` |
| Packing fraction | 0.524 | 0.680 | 0.740 | 0.340 |
| Primitive cell volume | `$a^3$` | `$a^3/2$` | `$a^3/4$` | `$a^3/4$` |

The **packing fraction** is the fraction of space the hard spheres fill:

```math
\text{PF} = \frac{n\cdot\tfrac43\pi r^3}{a^3}
```

**Worked example (bcc).** `$n = 2$`, `$r = \sqrt3a/4$`. Then `$\text{PF} = \dfrac{2\cdot\tfrac43\pi\,(3\sqrt3/64)a^3}{a^3} = \dfrac{\sqrt3\pi}{8} = 0.680$`. Notice that `$a$` cancels: packing depends only on the geometry, not on the size.

The **density** of a crystal follows from the same count:

```math
\rho = \frac{nM}{N_A\,a^3}
```

**Worked example.** Copper is fcc with `$a = 3.61$` Å and `$M = 63.55$` g/mol.

1. `$a^3 = (3.61\times10^{-8}\text{ cm})^3 = 4.705\times10^{-23}$` cm³. (Always convert Å to cm: `$1$` Å `$= 10^{-8}$` cm.)
2. `$\rho = \dfrac{4\times63.55}{6.022\times10^{23}\times4.705\times10^{-23}} = 8.97$` g/cm³, close to the measured 8.96.

Run it backwards and density, lattice constant and molar mass tell you `$n$`, and so the structure.

<div class="problem" data-problem="miller-spacing"></div>

## 4. Real structures: lattice plus basis

- **Close packing.** Stack layers of touching spheres. Each new layer sits in the hollows of the one below. The order ABAB... gives **hcp**, ABCABC... gives **fcc**; both fill 74% of space and give every atom 12 neighbours. For ideal hcp, `$c/a = \sqrt{8/3} = 1.633$`. The close-packed layers of fcc are its `$(111)$` planes.
- **Diamond** (C, Si, Ge): fcc lattice with a basis of two identical atoms at `$(0,0,0)$` and `$(\tfrac14,\tfrac14,\tfrac14)a$`. Each atom bonds to 4 others in a tetrahedron. Zinc blende (GaAs, ZnS) is the same with two different atoms.
- **Rock salt** (NaCl, KCl, MgO): fcc lattice, basis Na at `$(0,0,0)$` and Cl at `$(\tfrac12,0,0)a$`. Four formula units per cube; each ion has 6 neighbours of the other kind.
- **Caesium chloride** (CsCl, CuZn): Cs at the corners, Cl at the body centre. The picture looks bcc, but the centre is a different ion, so the lattice is **simple cubic** with a two-ion basis; coordination 8.
- **Graphene**: a honeycomb. Neighbouring atoms see their bonds in mirror-image directions, so the honeycomb is not a Bravais lattice; it is a hexagonal lattice with a two-atom basis.

Holes between the spheres matter for alloys and ionic crystals. In fcc there are 4 octahedral holes per cube (radius up to `$0.414r$`) and 8 tetrahedral ones (`$0.225r$`).

<div class="myth">

**"bcc means there is an atom at the body centre."** Not quite. bcc is a statement about the *lattice*: the body centre must be an identical lattice point. In CsCl the body-centre ion differs from the corner ions, so CsCl is simple cubic, not bcc. The same test explains why NaCl is fcc (look at the Na ions only) and why the honeycomb is not a lattice. Whenever you are unsure, ask: does the view from this point look exactly the same as from that one?

</div>

## 5. Miller indices: naming planes

Crystals break, grow and diffract along planes of atoms, so we need a name for each family of parallel planes. The recipe for the **Miller indices** `$(hkl)$`:

<div class="steps">
<div class="step"><p><b>Find the intercepts.</b> Where does the plane cut the three axes, in units of a, b, c? A plane parallel to an axis cuts it at infinity.</p></div>
<div class="step"><p><b>Take reciprocals.</b> 1/∞ = 0, so a plane parallel to an axis gets index 0.</p></div>
<div class="step"><p><b>Clear fractions.</b> Multiply by the smallest number that makes all three whole numbers, and remove any common factor.</p></div>
<div class="step"><p><b>Mark negatives with a bar.</b> An intercept on the negative side of an axis gives a bar over that index, such as (1 1̄ 0).</p></div>
</div>

**Worked example.** A plane cuts the axes at `$3a$`, `$2b$` and `$c$`. Reciprocals: `$\tfrac13, \tfrac12, 1$`. Multiply by 6: `$(2\,3\,6)$`.

Notation you must keep straight:

| Written | Means |
|---|---|
| `$(hkl)$` | one family of parallel planes |
| `$\{hkl\}$` | all planes equivalent by symmetry (in a cube, `$\{100\}$` = the 6 faces) |
| `$[uvw]$` | a direction: the vector `$u\vec a + v\vec b + w\vec c$` |
| `$\langle uvw\rangle$` | all directions equivalent by symmetry |

Play with the indices below. Negative indices move the origin to the far corner; the dashed outlines are the neighbouring planes of the same family.

<figure class="fig" data-fig="miller-planes"><figcaption>Larger indices give planes that are more steeply tilted and closer together. Setting an index to 0 makes the plane parallel to that axis.</figcaption></figure>

Two facts are true **only in cubic crystals**:

1. The direction `$[hkl]$` is perpendicular to the plane `$(hkl)$`. So angles between planes are angles between their index vectors: `$\cos\theta = \dfrac{h_1h_2 + k_1k_2 + l_1l_2}{\sqrt{h_1^2+k_1^2+l_1^2}\sqrt{h_2^2+k_2^2+l_2^2}}$`.
2. The spacing between neighbouring planes is

```math
d_{hkl} = \frac{a}{\sqrt{h^2 + k^2 + l^2}}
```

For axes at right angles but unequal lengths (tetragonal, orthorhombic), use `$1/d^2 = h^2/a^2 + k^2/b^2 + l^2/c^2$`. For hexagonal crystals the four-index notation `$(hkil)$` adds `$i = -(h + k)$` so that symmetry-related planes have permuted indices.

**Worked example.** Find the spacing of `$(111)$` and `$(220)$` planes in a cubic crystal with `$a = 5.43$` Å, and the angle between `$(111)$` and `$(1\bar11)$`.

1. `$d_{111} = 5.43/\sqrt3 = 3.135$` Å; `$d_{220} = 5.43/\sqrt8 = 1.920$` Å.
2. `$\cos\theta = (1 - 1 + 1)/3 = 1/3$`, so `$\theta = 70.5^\circ$`.

The direction common to two planes (their **zone axis**) is the cross product of their indices. And a warning that catches strong students: in fcc and bcc the formula above uses the conventional cube, but centring adds extra lattice planes. In fcc, real lattice planes parallel to `$(100)$` are `$a/2$` apart, not `$a$`. This is exactly why some X-ray reflections go missing, as the [next lesson](/learn/courses/iit-jam-physics/x-ray-diffraction/) shows.

## 6. Planar density and the reciprocal lattice

How crowded a plane is decides how easily it slips and how strongly it diffracts. Count atoms the same way as in a cell, but now with area shares: a corner of a square face counts `$\tfrac14$`, a corner of the `$60^\circ$` triangle cut by `$(111)$` counts `$\tfrac16$`.

**Worked example.** fcc `$(111)$`: the plane cuts the cube in a triangle of side `$\sqrt2a$` and area `$\tfrac{\sqrt3}{2}a^2$`, holding `$3\times\tfrac16 + 3\times\tfrac12 = 2$` atoms. Density `$= 4/(\sqrt3a^2)$`, the highest of any fcc plane, which is why metals like copper slip on `$\{111\}$`.

GATE and NET go one step further. The **reciprocal lattice** has vectors `$\vec b_i$` with `$\vec a_i\cdot\vec b_j = 2\pi\delta_{ij}$`. Each reciprocal vector `$\vec G_{hkl} = h\vec b_1 + k\vec b_2 + l\vec b_3$` is perpendicular to the `$(hkl)$` planes and has length `$2\pi/d_{hkl}$`, so one point stands for a whole family of planes. The reciprocal of simple cubic is simple cubic; the reciprocal of fcc is bcc (cube edge `$4\pi/a$`) and vice versa. The Wigner-Seitz cell of the reciprocal lattice is the first Brillouin zone, the stage for electron bands.

To see these cells in 3D, the [Brillouin zone viewer](/science/brillouin-zone/) draws any lattice with its reciprocal lattice and zones, the [Miller index calculator](/science/miller-index-calculator/) gives spacings and angles for every crystal system, and the [CIF viewer](/science/cif-viewer/) opens real crystal structure files.

<div class="keypoints">

- Crystal = lattice + basis. A lattice point must have exactly the same surroundings as every other.
- 14 Bravais lattices in 7 systems (5 in 2D). Only 1, 2, 3, 4 and 6-fold axes are allowed.
- sc / bcc / fcc / diamond: `$n$` = 1 / 2 / 4 / 8; neighbours 6 / 8 / 12 / 4; packing 0.52 / 0.68 / 0.74 / 0.34.
- `$\rho = nM/(N_Aa^3)$`; convert Å to cm.
- CsCl is simple cubic with a basis; NaCl and diamond are fcc with two-atom bases; hcp and fcc are both close packed.
- Miller indices: reciprocals of intercepts, cleared of fractions. Cubic: `$d = a/\sqrt{h^2+k^2+l^2}$` and `$[hkl] \perp (hkl)$`.
- Reciprocal lattice: `$|\vec G_{hkl}| = 2\pi/d_{hkl}$`; fcc and bcc are each other's reciprocals.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [crystal structure practice page](/learn/courses/iit-jam-physics/practice/crystal-structure/).

<div class="qbank" data-bank="physics" data-topics="crystal-structure" data-exam="jam" data-n="10"></div>

**Next:** [lesson 7.2](/learn/courses/iit-jam-physics/x-ray-diffraction/) shines X-rays on these planes and uses Bragg's law to measure them. The [GATE Physics course](/learn/courses/gate-physics/) builds on the reciprocal lattice for diffraction, phonons and electron bands.
