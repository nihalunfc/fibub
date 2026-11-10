---
title: "Fluorescence lifetime tracks nanoparticle uptake in murine breast cancer cells over 24 hours"
summary: "Hybrid nanoparticles taken up by H8N8 cells shortened their fluorescence lifetime from 1.70 to 1.40 ns, hinting at lysosomes. Here is how to measure per-cell uptake intensity from your own microscope images."
tools: [fluorescence-image-analyser, hemocytometer, gel-densitometry]
updated: 2026-11-10
sources:
  - "Eckstein S, Herbsleb L, Groger H, Feldmann C, Alves F, Walter A, Schneckenburger H (2026), International Journal of Molecular Sciences 27(3): 1339, CC BY 4.0, the paper described here."
  - "Otsu, N. (1979) for the automatic threshold and Zack, Rogers and Latt (1977) for the triangle threshold: methods only."
  - "The counts, areas and intensities in the worked example are made up by us and worked through by hand; the tool's own example image is described in its guide."
paper:
  title: "Monitoring Nanoparticle Interaction with Murine Breast Cancer Cells Using Multimodal Fluorescence Lifetime Microscopy"
  authors: "Eckstein S, Herbsleb L, Gröger H, Feldmann C, Alves F, Walter A, Schneckenburger H"
  journal: "International Journal of Molecular Sciences"
  year: 2026
  doi: "10.3390/ijms27031339"
  url: "https://www.mdpi.com/1422-0067/27/3/1339"
  licence: "CC BY 4.0"
  reviewed: true
---

A fluorescent dye does not only emit a colour; it emits for a certain length of time, and that length changes with what surrounds the molecule. A German group used that to follow dye-loaded hybrid nanoparticles into murine breast cancer cells, arguing that where the particles end up can be read off the nanosecond decay even when the particles are too small to resolve. The work appeared in the *International Journal of Molecular Sciences* in January 2026 under a CC BY 4.0 licence. The paper judged brightness by eye; for per-cell numbers from such images, use the [[fluorescence-image-analyser|fluorescence image analyser]].

## What they found

The particles, zirconium-oxide-based hybrids of 50 to 60 nm carrying about 1 mol % of a far-red dye, were taken up by H8N8 cells within hours. Their main decay component shortened from 1.70 ± 0.10 ns at 2 hours to 1.40 ± 0.24 ns at 24 hours, as the authors report it, which they read as a move into an acidic, crowded compartment. Lifetime images gave 2.5 to 3.5 ns across treated cells against 0.5 to 1.0 ns in controls, so the signal stands out from autofluorescence.

Two controls complicate the story usefully. Particles in culture medium with no cells also drifted shorter over 24 hours, from about 1.68 to 1.47 ns, so part of the cellular change may not be cellular. In buffers at pH 7 and pH 4 the median lifetimes were nearly identical, 1.80 and 1.81 ns, while the means differed; the authors prefer the medians. Separately, a lysosome-staining green dye's own lifetime fell from 4.36 to 4.05 ns when particles were present, which they read as energy transfer and so as proximity in lysosomes.

## Why it matters

Nanoparticle uptake studies usually rest on image brightness, which depends on exposure, laser power and focus, or on co-staining at a resolution far coarser than the particles. A lifetime is intrinsic to the emitter, so it survives those troubles, and reading localisation from it rather than from colocalisation is worth testing elsewhere.

## How they did it

1. H8N8 murine basal-like breast cancer cells grew in DMEM with 10 % serum at 37 °C and 5 % CO₂.
2. The nanoparticles, carrying cytidine monophosphate and about 1 mol % of a far-red dye, were applied at 10 µg/mL for 2 or 24 hours, with a green lysosome tracker co-incubated for 30 minutes where proximity was tested.
3. Confocal images used 555 nm and 639 nm excitation with detection above 650 nm, through a 63× oil objective.
4. Lifetimes came from a picosecond supercontinuum laser at 78 MHz with an intensified camera: decays sampled in 200 ps steps over 10 ns, fitted with three exponentials; lifetime images used two half-nanosecond gates 2 ns apart.
5. Typically 5 to 10 cells per condition, as medians with median absolute deviations or means with standard deviations, compared by a Welch t-test.

## Check it yourself with fibub

Everything below is made up by us to show the steps; none of it is from the paper.

**Step 1: know how many cells you plated.** Count before seeding on the [[hemocytometer]] page: corner squares of 38, 42, 40 and 44 live cells at a 1:1 trypan blue dilution average 41, so the suspension holds **8.2 × 10⁵ live cells/mL**.

**Step 2: open the image and pick the channel.** On the fluorescence image analyser, open the microscope's own export (not a screenshot, no contrast adjustment). Pick the **red** channel for a far-red particle dye, **blue** for the nuclear stain you count on, and use *Show* to view that channel in grey or as the threshold mask.

**Step 3: background and threshold.** Set the rolling ball radius larger than your biggest nucleus, or the middle of a large nucleus goes with the uneven illumination. Keep *Otsu* for bright, separated nuclei; *Triangle* suits a dark image with dim objects. Tick *Fill holes* so a dark nucleolus does not split a nucleus, *Split touching nuclei* for joined neighbours, and raise *Smallest object* until dust drops out.

**Step 4: measure.** Type your pixel size so areas come out in real units. Say the page finds 24 nuclei at 2 hours with a mean area of 280 px: at 0.32 µm per pixel that is 280 × 0.32² = **28.67 µm²**. If the mean red intensity inside those outlines is 38 grey levels after background, and 71 in a 24-hour image, that is a **1.87-fold** rise per cell. Integrated intensity, the sum over the object, gives 10,640 against 19,880 here and is the one to report when object sizes differ. With a per-cell standard deviation of 12 grey levels over 24 cells, the standard error on the 24-hour mean is 12 ÷ √24 = **2.45**.

**Step 5: guard the comparison.** Intensities live on the 0 to 255 scale of the image file, so every image you compare needs the same exposure, gain and objective, and the brightest objects must stay below 255 or they read too low. Export 8-bit copies with one display range if your microscope saves 16-bit files, and measure a particle-free control the same way: its apparent "uptake" is your floor. The same thinking applies to blot bands on [[gel-densitometry|the densitometry page]].

## The fine print

- A shortened lifetime has several causes. The authors say openly that aggregation, quenching and pH could do it, so energy transfer is a reading of the data, not a demonstration.
- With 0.35 µm pixels and about 0.22 µm resolution, single particles cannot be seen; everything is an average.
- Particles in plain medium drifted shorter on their own, some differences were not statistically significant, and a few comparisons rest on medians where the means disagree.
- One murine cell line, a handful of cells per condition: a method demonstration rather than a survey of uptake, with phototoxicity checked only indirectly.
