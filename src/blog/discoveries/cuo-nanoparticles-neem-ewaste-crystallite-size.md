---
title: "CuO nanoparticles from neem extract and e-waste wire: crystallite size by six XRD methods"
summary: "A 2025 study made copper oxide nanoparticles from scrap cable and neem leaves, then sized them by six XRD methods with answers from 5 to 92 nm. Here is how to check the widths yourself."
tools: [xrd-peak-calculator, nanoparticle-calculator, miller-index-calculator]
updated: 2026-11-10
sources:
  - "Bragg's law, the Scherrer equation and the Williamson-Hall method: standard X-ray diffraction."
  - "Density of copper(II) oxide of about 6.31 g/cm³: standard reference value."
  - "The peak list in the worked example (positions near those of monoclinic CuO, widths made up) is invented by fibub; it is not data from the paper."
paper:
  title: "Exploration of the antibacterial and photocatalytic properties of copper oxide (CuO) nanoparticles synthesized from Azadirachta indica leaf extract and electronic waste cable"
  authors: "Tabassum S, Hossain MS, Saeed MA, Uddin MN, Ahmed S"
  journal: "Materials Advances"
  year: 2025
  doi: "10.1039/d4ma01047g"
  url: "https://doi.org/10.1039/d4ma01047g"
  licence: "CC BY 3.0"
  reviewed: true
---

Old electrical cable is mostly copper, and neem (Azadirachta indica) leaves are full of compounds that can help turn metal salts into tiny oxide particles. A March 2025 paper in Materials Advances combined the two: copper from scrap wire became copper nitrate, and neem leaf extract turned it into copper(II) oxide (CuO) nanoparticles that broke down a dye and an antibiotic in water and slowed the growth of bacteria. The team also sized the crystals from their X-ray diffraction (XRD) pattern by six different methods, and the answers ranged from about 5 nm to 92 nm. The [[xrd-peak-calculator]] lets you run two of the most common of those methods on your own peaks and see why they disagree.

## What they found

The powder's XRD peaks matched the reference pattern for monoclinic CuO, the mineral tenorite, with its first two lines near 2θ = 35.5° and 38.7° for copper Kα X-rays. Under light, 0.1 g of the powder removed about 95 % of the dye Congo red in 120 minutes and about 80 % of the antibiotic ciprofloxacin in 210 minutes. In agar well tests it made a clear zone of 27 mm around Staphylococcus aureus, a common skin bacterium, and smaller zones for three other species.

For crystal size, the paper reports roughly 9.4 nm (Monshi-Scherrer), 9.8 nm (the authors' own Sahadat-Scherrer model), 8.5 nm (Williamson-Hall), 7.0 nm (size-strain plot), 5.1 nm (Halder-Wagner) and 92 nm from a straight-line form of Scherrer's equation. Electron microscope pictures showed clumped round particles about 69 nm across on average.

## Why it matters

Turning electronic waste into a useful catalyst is a small step toward using scrap instead of mined metal, and plant extracts avoid some harsh chemicals. The size spread is just as instructive. Crystal size drives surface area, and surface area drives how well a catalyst works, so a paper that quotes one size can mislead. Seeing six methods side by side shows how much the answer depends on the assumptions.

## How they did it

The authors cleaned and cut up the wire, dissolved it in nitric acid, and mixed the copper nitrate solution with an extract of dried neem leaves. The CuO that formed was washed, dried and ground. They recorded XRD, infrared spectra, electron microscope images with element analysis, and weight loss on heating. Peak widths went into the six sizing methods. Each method treats the width differently: some assume all broadening comes from small crystals, others split it into a size part and a strain part (strain meaning tiny distortions of the crystal lattice).

## Check it yourself with fibub

The worked example uses **our own made-up peak list**. The six positions sit near CuO lines; the widths are invented.

| 2θ (°) | FWHM (° 2θ) |
|---|---|
| 35.5 | 0.90 |
| 38.7 | 0.95 |
| 48.7 | 1.05 |
| 53.4 | 1.10 |
| 58.3 | 1.17 |
| 61.5 | 1.22 |

1. Choose the Cu Kα1 source (1.5406 Å), keep K = 0.9, and set the instrument width to 0.06° (use your own machine's value from a standard).
2. Leave *Peak shape* on Gaussian.
3. Type the rows into the peak list: 2θ, then FWHM. If you have a raw scan, open it and press *Find peaks* instead.

The page gives d-spacings from 2.527 Å for the first line to 1.507 Å for the last. The Scherrer sizes fall steadily from 9.29 nm at 35.5° to 7.59 nm at 61.5°, with a mean of 8.3 nm. A steady fall with angle is the fingerprint of strain, which Scherrer's equation wrongly counts as small size. The Williamson-Hall fit separates the two: about **13.4 nm and 0.38 % strain** (R² = 0.992). Change the shape to Lorentzian and the same widths give 15.0 nm. One set of peaks, three reasonable answers between 8 and 15 nm, before you even try other models.

The cubic indexing table is useful here too: none of the four cubic lattices indexes all six lines, the expected result for a monoclinic crystal. To check which planes sit behind each line, enter the monoclinic cell into the [[miller-index-calculator]].

Size then turns into surface area with the [[nanoparticle-calculator]]. With a CuO density of 6.31 g/cm³, an 8.3 nm sphere gives about 115 m²/g and a 13.4 nm sphere about 71 m²/g. The choice of sizing method changes the surface area by more than half.

## The fine print

- Crystallite size from XRD is not particle size. A 69 nm particle in a microscope can hold many smaller crystals, which is one reason XRD and microscope sizes differ.
- The 92 nm straight-line Scherrer result stands far from the other five. Fits of that kind are sensitive to a few peaks, and the paper does not name one preferred value (its tables also list 11.24 and 12.24 nm).
- Widths need the instrument's own broadening removed and, for copper tubes, the Kα2 shoulder handled.
- Dye and antibiotic removal were measured at one dye concentration (20 ppm), one pH and one catalyst dose; how well the powder works in real wastewater is still open.
- The antibacterial results are lab tests on agar, not a treatment.
