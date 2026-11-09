---
name: Anomalous Hall checker
num: 146
shelf: science
section: condensed-matter-physics
title: "Anomalous Hall checker: which Hall components does a magnet's symmetry allow for a given Néel vector?"
summary: "Enter a magnetic crystal and the direction its moments point. The tool finds the magnetic symmetry with spin–orbit coupling and tells you whether an anomalous Hall effect is allowed, along which direction the Hall vector can point, and which conductivity components can be non-zero, with a map over all moment directions."
status: live
ads: true
order: 3
icon: compass
works: offline
updated: 2026-11-08
related: [altermagnet-checker, altermagnet-bands, point-group-finder]
sources:
  - "Method: Neumann's principle applied to the Hall vector, an axial vector that is odd under time reversal, using the magnetic point group of the crystal with spin–orbit coupling (standard symmetry analysis found in solid-state physics textbooks and the anomalous Hall literature). The group projection is worked out by fibub."
  - "Example structures: the same idealised rutile-type and NiAs-type cells as the Altermagnet checker, written by fibub with rounded lattice constants; not copied from any structure database."
  - "Checked in the tests against the magnetic symmetry found by the open-source spglib library (BSD licence, used for testing only, not shipped)."
flow:
  - { icon: table, label: "Crystal" }
  - { icon: pointer, label: "Moments" }
  - { icon: compass, label: "Symmetry" }
  - { icon: check, label: "Hall effect" }
---

## What it does

The **anomalous Hall effect** is a sideways voltage that a magnet makes by itself, without an outside magnetic field. Ferromagnets show it because of their net magnetisation. For a long time people assumed a magnet with zero net moment could not. **Altermagnets** changed that: some of them have a Hall effect even though their moments cancel exactly.

Whether a Hall effect is allowed is a question of **symmetry**, and with spin–orbit coupling the answer depends on **which way the moments point**. The same crystal can have a Hall effect for one moment direction and none for another. This tool works it out for any direction you choose.

It describes the Hall effect by the **Hall vector** σH = (σzy, σxz, σyx). The Hall current flows at right angles to both the applied electric field and σH, so a Hall vector along z means a Hall voltage in the xy plane (the σxy component).

The [[altermagnet-checker]] works out whether the same crystal is an altermagnet, and the [[spin-splitter-conductivity]] tool estimates the spin current it can carry.

## How to use it

1. **Pick an example or type your own crystal.** The format is the same as the Altermagnet checker: one `cell a b c α β γ` line, then one line per atom with its fractional coordinates and `up`, `down` or a signed moment. List every atom in the magnetic cell. You can also open a text file (up to 200 kB and 200 atoms). It stays in your browser.
2. **Set the moment direction** as the lattice direction [u v w]. The "up" atoms point along it and the "down" atoms point against it. For an antiferromagnet or altermagnet this is the **Néel vector**.
3. **Read the verdict.** It says whether a Hall effect is allowed and along which direction the Hall vector can point. It can point along one line, anywhere in a plane, in any direction, or not at all.

## What each part means

- **Magnet type**: ferromagnet, ferrimagnet, conventional antiferromagnet or altermagnet, from the spin pattern alone (as in the Altermagnet checker).
- **Hall vector σH**: the directions that symmetry allows. Directions are given as lattice directions [u v w].
- **Hall components that can be non-zero**: the same result written as conductivity components. Here x lies along a, y lies in the ab plane and z is perpendicular to it.
- **Magnetic symmetry**: the crystal operations that survive once the moments point along your direction. Some survive only together with **time reversal**, because they reverse every moment and time reversal flips them back. The table lists them.
- **Other moment directions**: the verdict for eight common directions, so you can see which ones switch the Hall effect on.
- **Map**: every moment direction in the upper half of a sphere, seen down c. Small grey dots mean a Hall vector is allowed in any direction. Coloured dots mark directions where it is limited to one line or one plane. Black dots mark directions with no Hall effect. A ring marks your direction. A moment direction and its opposite give the same verdict, with σH reversed, so the lower half is not needed.

## How it works

Every symmetry operation R of the magnet must leave σH unchanged. σH is an **axial vector**: under an operation it becomes det(R) R σH. It is also **odd under time reversal**, so an operation that only works together with time reversal gives −det(R) R σH instead. Averaging these over the whole magnetic point group gives a projector. The directions it keeps are exactly the allowed Hall vectors. The moments themselves transform the same way, which is how the tool decides which crystal operations survive and which need time reversal.

## Worked example

Take the rutile-type example (the idealised structure proposed for RuO₂).

- **Moments along [0 0 1] (along c).** All 16 operations survive, and 8 of them need time reversal. They forbid every Hall component, so there is **no anomalous Hall effect**.
- **Moments along [1 0 0].** Only 8 operations survive. The Hall vector must point along **[0 1 0]**, so a Hall voltage can appear in the ac plane (σzx).
- **Moments along [1 1 0].** The Hall vector points along [1 1 0].

These match the published symmetry analysis of this structure: the Hall effect appears only when the Néel vector tilts away from c.

For the NiAs-type MnTe example, moments along c or along a give no Hall effect. Moments along [1 −1 0] or [1 2 0] (in-plane, at right angles to an a axis) allow a Hall vector along c.

The body-centred antiferromagnet and the chain with inversion centres never allow a Hall effect, for any moment direction. In both, a translation or inversion swaps the spins, and that kills the Hall vector.

## FAQs

**Does it give the size of the Hall conductivity?** No. Symmetry says only which components may be non-zero. The size needs a band-structure calculation and can be tiny even where it is allowed.

**Does it include spin–orbit coupling?** Yes. That is why the moment direction matters here. The Altermagnet checker does not include it, because altermagnetism itself is defined without spin–orbit coupling.

**Can the moments be non-collinear?** No. Every moment lies along the one direction you give, pointing with it or against it. Non-collinear magnets need a different input.

**What about the ordinary Hall effect from an applied field?** That is always allowed and is not counted here. This tool covers only the spontaneous (anomalous) part, at zero applied field.

**Is my structure uploaded?** No. Everything runs in your browser.
