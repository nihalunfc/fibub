---
title: "CrSb altermagnet: 3D ARPES map of a g-wave spin splitting"
summary: "A 2025 open-access study maps the spin-split bands of CrSb in three dimensions and confirms it is a g-wave altermagnet. Here is the finding, and how to run the symmetry test yourself."
tools: [altermagnet-checker, altermagnet-bands, brillouin-zone]
updated: 2026-11-10
sources:
  - "Yang, G., Li, Z., Yang, S. et al. (2025), Three-dimensional mapping of the altermagnetic spin splitting in CrSb, Nature Communications 16, 1442, published 7 February 2025. Open access (CC BY)."
  - "Spin-group classification of collinear magnets into ferromagnets, conventional antiferromagnets and altermagnets: standard theory (Šmejkal, Sinova and Jungwirth, 2022)."
paper:
  title: "Three-dimensional mapping of the altermagnetic spin splitting in CrSb"
  authors: "Yang G, Li Z, Yang S, Li J, Zheng H et al."
  journal: "Nature Communications"
  year: 2025
  doi: "10.1038/s41467-025-56647-7"
  url: "https://www.nature.com/articles/s41467-025-56647-7"
  licence: "CC BY"
  reviewed: true
---

Altermagnets are magnets whose up and down moments cancel exactly, like an antiferromagnet, yet whose electrons still split by spin, like a ferromagnet. Chromium antimonide, CrSb, has become one of the clearest examples. A February 2025 open-access paper in *Nature Communications* maps its electron bands in all three directions of momentum and shows that the spin splitting is large, about 1 eV at most, and follows the pattern symmetry predicts. The prediction itself is something you can test in a minute with the [[altermagnet-checker]], then explore with the [[altermagnet-bands|altermagnet band explorer]].

## What they found

The team reports a spin splitting of up to about 1.0 eV close to the Fermi level, the energy of the electrons that carry current. The splitting changes with the direction in momentum space and vanishes on certain flat planes, called nodal planes. The pattern of those planes is what marks CrSb as a **g-wave** altermagnet: the sign of the splitting flips several times as you go around, more often than in the simpler d-wave case.

Spin-resolved measurements confirmed that the split bands really do carry opposite spins, although the measured spin polarisation was much weaker than the ideal value. A simple tight-binding model points to why the splitting is so big: hopping between chromium atoms three neighbours apart, helped along by the antimony atoms, does most of the work.

## Why it matters

Spintronics needs currents that are spin-polarised. Ferromagnets give that, but their stray magnetic fields get in the way of packing devices tightly. An altermagnet gives spin-split bands with no net magnetisation. CrSb adds two practical advantages that the authors highlight: it is a metal, and it stays ordered up to about 705 K, far above room temperature. A splitting of around 1 eV is also large enough to measure and, in principle, to use.

## How they did it

The main tool was angle-resolved photoemission spectroscopy (ARPES). Light knocks electrons out of the crystal, and their energy and angle reveal the bands inside. Changing the photon energy changes which slice of momentum along c is probed, so the team could build a three-dimensional map. A spin detector added the spin direction for selected slices. Calculations of the band structure and the tight-binding model were compared with the measurements.

## Check it yourself with fibub

The altermagnet checker answers one question: is the spin splitting allowed by symmetry, and with what pattern? It does not compute its size. The structures below are idealised: the lattice constants are rounded values close to those reported for CrSb, and the atom positions are the textbook NiAs-type ones.

1. Open the [[altermagnet-checker]] and pick **NiAs-type CrSb** from the examples, or type it in yourself:

```
cell 4.12 4.12 5.44 90 90 120
Cr 0 0 0 up
Cr 0 0 1/2 down
Sb 1/3 2/3 1/4
Sb 2/3 1/3 3/4
```

2. Read the verdict: **g-wave altermagnet**. The operation that swaps up and down is a **6-fold screw about [0 0 1] with translation (0, 0, ½)**: turn by 60° and shift half a cell up. The allowed splitting is Δ(k) ∝ kx²·ky·kz − (1/3)·ky³·kz. It vanishes whenever kz = 0, which matches the nodal plane through the zone centre seen in the paper.
3. Now delete the two antimony lines. The verdict changes to **conventional antiferromagnet**: with chromium alone, a plain shift of half a cell along c swaps the spins, and that forces every band to stay spin-degenerate.
4. Put the antimony back, but at **1/3 2/3 1/4** and **1/3 2/3 3/4**, stacked over each other. Again, a conventional antiferromagnet, for the same reason.
5. Finally, keep the real positions and set both chromium atoms to **up**. The tool calls it a ferromagnet, because the moments no longer cancel.

Steps 3 and 4 make the paper's tight-binding point from the symmetry side. The non-magnetic antimony atoms, placed alternately on either side, are what remove the plain shift that would otherwise swap the spins. Without them, there would be no splitting to measure.

To see where kz = 0 and kz = ½c* sit inside the hexagonal zone, draw it with the [[brillouin-zone|Brillouin zone viewer]], and play with how d- and g-wave splittings shape the bands in the altermagnet band explorer.

## The fine print

- **Spin polarisation was weak.** The authors put this down to domains with opposite splittings and broad features, but it means the spin evidence is less sharp than the band maps.
- **Some features were not resolved.** The small splitting expected near kz = 0 was not seen, and spin–orbit coupling was only briefly examined.
- **Momentum along c depends on an estimate.** Turning photon energy into kz needs an assumed inner potential.
- **One material.** The tight-binding explanation may not carry over directly to MnTe, as the authors note, and the idea that strain could tune the splitting is a prediction.
- Our checker tests symmetry only, without spin–orbit coupling, and our structures are idealised. For the measured bands and their uncertainties, read the paper itself.
