---
name: Group theory explorer
num: 545
shelf: science
section: pure-mathematics
title: "Group theory explorer: Cayley tables, element orders, subgroups, normal subgroups, centre and cosets of small groups"
summary: "Pick a small group (cyclic, dihedral, S3, S4, A4, A5, Klein four, quaternion or the units mod n) and see its Cayley table, the order and inverse of every element, conjugacy classes, centre, every subgroup with its lattice, which subgroups are normal, cosets and quotient groups."
status: live
ads: true
order: 545
icon: table
works: offline
updated: 2026-11-09
related: [number-theory-toolkit, matrix-calculator, polyhedron-viewer, point-group-finder, knot-braid-drawer, combinatorics-calculator]
sources:
  - "Standard group theory (Cayley, Lagrange, Galois). The groups are built from their definitions; the tool works everything out from the multiplication table."
  - "Checked against sympy.combinatorics (named permutation groups, centre, conjugacy classes, derived subgroup, is_normal and all subgroups by closure) on 22 groups up to order 64, and against the textbook counts (S4 has 30 subgroups, A5 has 59 and is simple)."
flow:
  - { icon: pointer, label: "Pick group" }
  - { icon: table, label: "Cayley table" }
  - { icon: search, label: "Subgroups" }
  - { icon: copy, label: "Cosets" }
---

## What it does

Group theory is easier to learn when you can see the groups. This explorer builds a small group from its definition and works out its structure from the multiplication table:

- **Cayley table** (the multiplication table), drawn in colour so that patterns stand out, with a CSV download.
- **Every element:** its order, its inverse, the size of its conjugacy class and of its centraliser, and whether it is in the centre.
- **Summary:** order, abelian or not, cyclic or not, exponent, the centre Z(G), the commutator subgroup, the conjugacy classes and how many elements have each order.
- **Every subgroup**, with a generating set, its index, and whether it is **normal**, plus the **subgroup lattice** drawn by order.
- **Cosets** of any subgroup you choose, left and right, and the **quotient group** G/H when H is normal.

The groups: cyclic Z_n (n up to 100), dihedral D_n of order 2n (n up to 32), symmetric S3 and S4, alternating A4 and A5, the Klein four-group V4, the quaternion group Q8, and the unit group Z_n^× of the numbers coprime to n under multiplication mod n (n up to 150).

See symmetry groups as solid shapes in the [[polyhedron-viewer]], and find the point group of a molecule with the [[point-group-finder]].

## How to use it

1. Choose a group, and n where it asks for one.
2. Read the summary, then look at the Cayley table: a cyclic group shows diagonal stripes, and blocks of colour show a subgroup and its cosets.
3. In the subgroup list, normal subgroups are marked; in the lattice they are the filled dots.
4. Choose a subgroup H under "Cosets and quotient" to list its left and right cosets. If they are the same sets, H is normal and G/H is a group.
5. Download the report as an image, PDF or Word file, or the tables as CSV.

## Conventions

Dihedral elements are written r^k (turns) and r^k s (reflections), with s r s = r⁻¹. Permutations use cycle notation on 1 to 4 (or 5), and products are read right to left: (1 2)(1 2 3) means do (1 2 3) first, giving (2 3). Some books use the other order; the structure (orders, subgroups, normality) is the same either way.

## Worked example

The page opens with D4, the 8 symmetries of a square. It is not abelian, has exponent 4, and its element orders are 1 of order 1, 5 of order 2 and 2 of order 4. The centre is {e, r^2}, the commutator subgroup is also {e, r^2}, and there are 5 conjugacy classes, of sizes 1, 2, 1, 2, 2. D4 has **10 subgroups, 6 of them normal**: the four reflection subgroups such as ⟨s⟩ are the only ones that are not.

The cosets section opens on H = ⟨s⟩ = {e, s}, index 4. Its left cosets are {e, s}, {r, rs}, {r^2, r^2s} and {r^3, r^3s}, but the right coset Hr is {r, r^3s}, so H is not normal. Choose ⟨r⟩ instead and the left and right cosets agree, and D4/⟨r⟩ is cyclic of order 2.

Try S4 (30 subgroups, 4 normal), A5 (59 subgroups, only 2 normal: it is simple), or Q8, where every subgroup is normal although the group is not abelian.

## Frequently asked questions

**Why only these groups?** They are the ones met in a first course. Finding every subgroup is quick up to a few hundred elements, so the sizes are capped to keep the page fast.

**Can I type my own Cayley table?** Not yet; pick the nearest family. Z_n^× covers many abelian groups, for example Z8^× is the Klein four-group.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
