---
title: "Flax, hemp and glass hybrid composites: elastic moduli by FEA, Mori-Tanaka and rule of mixtures"
summary: "A 2025 Polymers study modelled flax, hemp and glass fibres in bio-epoxy, alone and mixed, and found that finite elements, Mori-Tanaka and simple formulas agreed within about 3.5 %."
tools: [laminate-calculator, stress-strain-analyser, unit-converter]
updated: 2026-11-10
sources:
  - "Shahid M, Monastyreckis G, Zeleniakiene D (2025), Numerical Study on Elastic Properties of Natural Fibres in Multi-Hybrid Composites, Polymers 17(22): 3031, published 15 November 2025. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Rule of mixtures, inverse rule of mixtures and the Halpin-Tsai equations: Halpin and Kardos (1976), Polym. Eng. Sci. 16: 344-352; Jones, Mechanics of Composite Materials."
  - "Fibre and matrix values in the worked example (flax 50 GPa, glass 85 GPa, bio-epoxy 3 GPa; densities about 1.5, 1.48 and 1.2 g/cm³ for flax, hemp and epoxy) are round illustrative numbers chosen by fibub, not the paper's inputs."
paper:
  title: "Numerical Study on Elastic Properties of Natural Fibres in Multi-Hybrid Composites"
  authors: "Shahid M, Monastyreckis G, Zeleniakiene D"
  journal: "Polymers"
  year: 2025
  doi: "10.3390/polym17223031"
  url: "https://www.mdpi.com/2073-4360/17/22/3031"
  licence: "CC BY"
  reviewed: true
---

Plant fibres such as flax and hemp are light, cheap and renewable, but they are not as stiff as glass. Mixing them in one composite, a hybrid, is a way to trade some stiffness for lower weight and a smaller footprint. A 2025 open-access study in *Polymers* from Lithuania modelled flax, hemp and glass fibres in a bio-based epoxy, alone, in pairs and all three together, and found that a detailed finite element model, a mean-field (Mori-Tanaka) model and simple textbook formulas gave stiffnesses within about 3.5 % of each other. This page explains the result, and shows how the [[laminate-calculator]] gives the same textbook numbers for a single ply and then for a whole stack. The [[stress-strain-analyser]] turns a real tensile test into a modulus to compare against, and the [[unit-converter]] helps with GPa, psi and the like.

## What they found

As expected, every stiffness rose as more of the volume was fibre. Along the fibres, glass in epoxy reached about 61 GPa at a fibre volume fraction of 0.7 in the finite element model, and the three-fibre hybrid about 52 GPa in the Mori-Tanaka model. Across the fibres, the stiffnesses were far lower, with transverse shear moduli only up to about 3 GPa. At a fibre fraction of 0.4, the model gave about 24.7 GPa along flax fibres, close to values of roughly 23 to 24 GPa that other groups have measured.

The simple rule of mixtures gave the lowest transverse values, and the Chamis formula the highest for single-fibre composites. Poisson's ratio, the sideways shrink when you pull, behaved differently by fibre: it rose with fibre content in the flax systems and fell for hemp and glass.

## Why it matters

Designers who want to use natural fibres need trustworthy stiffness numbers before they cut any material. If quick formulas land within a few percent of a detailed simulation, they can screen many fibre mixes and fractions in minutes and save the expensive modelling and testing for the best few. The study also gives a consistent set of predicted properties for hybrids, which are less well covered in the literature than single-fibre composites.

## How they did it

The authors built a small cube, 100 µm on each side, filled with randomly placed parallel fibres (flax 30 µm across, hemp and glass 20 µm) and bio-epoxy, and stretched and sheared it in a finite element program with periodic boundaries, so the cube behaved like a piece cut from an endless sheet. Hybrids used equal shares of each fibre. They ran fibre fractions from 0.1 to 0.7 and compared the results with Mori-Tanaka homogenisation and with the rule of mixtures, Chamis and composite cylinder formulas. The epoxy's modulus was measured; the fibre values came from the literature.

## Check it yourself with fibub

The calculator's first card is the textbook step the paper compared against. The inputs below are **round numbers chosen by fibub**, not the paper's.

1. **One ply of flax.** Keep "From fibre and matrix". Type a fibre modulus of 50 GPa with Poisson's ratio 0.3, a matrix of 3 GPa with 0.35, and a fibre volume fraction of 0.4. The rule of mixtures gives E₁ = 0.4 × 50 + 0.6 × 3 = 21.8 GPa along the fibres.
2. **Across the fibres.** With Halpin-Tsai the page gives E₂ ≈ 7.5 GPa; switch to the inverse rule of mixtures (Reuss) and it drops to about 4.8 GPa. That gap is the same story as the paper: the plain series formula is the low bound.
3. **Swap in glass.** Change the fibre to 85 GPa and 0.22. E₁ rises to 35.8 GPa. For an equal flax-glass hybrid at the same total fraction, the rule of mixtures along the fibres is simply the share-weighted sum, 0.2 × 50 + 0.2 × 85 + 0.6 × 3 = 28.8 GPa, which you can get on the page by typing a fibre modulus of 67.5 GPa, the average of the two.
4. **Build a laminate.** In card 2, type [0/90]s with 0.25 mm plies. For the flax ply, the laminate modulus Ex comes out near 14.8 GPa; for [0/±45/90]s, a quasi-isotropic stack, about 11.7 GPa. Few real parts are all unidirectional, so this is the number that matters for a panel.
5. **A sanity check on density.** A volume-weighted mix can never be lighter than its lightest part. With round densities of 1.5 g/cm³ for flax, 1.48 for hemp and 1.2 for epoxy, a flax-hemp hybrid at 0.4 total fibre comes to 0.2 × 1.5 + 0.2 × 1.48 + 0.6 × 1.2 ≈ 1.316 g/cm³, between the flax-only (1.32) and hemp-only (1.312) values.

## The fine print

This is a modelling study with no new tests of its own. It assumes perfect bonding, no voids and evenly spread, straight fibres, and treats flax and hemp as the same in every direction, although plant fibres are much softer across their length and have a hollow core. The authors call the results upper bounds. Because all the models share the same inputs and assumptions, their close agreement is not independent proof that any of them is right. A few statements in the text also conflict: the abstract says fibre content lowers Poisson's ratio in natural fibre composites while the results show it rising for flax, some percentage changes for Poisson's ratio have the wrong sign, and one passage says a flax-hemp hybrid is lighter than either single-fibre composite, which, as step 5 shows, a simple mixture cannot be.
