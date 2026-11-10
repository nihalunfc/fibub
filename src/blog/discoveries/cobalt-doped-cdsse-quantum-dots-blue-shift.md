---
title: "Cobalt-doped CdSSe quantum dots: absorption blue shift as dots grow"
summary: "A 2026 study found that adding cobalt to CdSSe quantum dots shifts their absorption to the blue while the dots get bigger. Here is how to test that against the Brus equation."
tools: [quantum-dot-size, tauc-plot, xrd-peak-calculator]
updated: 2026-11-10
sources:
  - "The Brus equation (effective-mass model of a spherical quantum dot) and E = 1239.84 / λ(nm) eV: standard physics."
  - "The material values in the worked example (bulk gap 2.0 eV, electron mass 0.16 m₀, hole mass 0.55 m₀, dielectric constant 9.7) are rounded and made up by fibub to behave roughly like a CdS-CdSe alloy; they are not reference data."
  - "The CdSe-like values (1.74 eV, 0.13 m₀, 0.45 m₀, 10.6) are the rounded example built into the fibub tool."
paper:
  title: "Study on the structural, optical and magnetic properties of cobalt-doped CdSSe quantum dots"
  authors: "Hoan NTT, Tung NT, Hang NTT, Linh DT, Truong NV, Ca NX et al."
  journal: "RSC Advances"
  year: 2026
  doi: "10.1039/d6ra00412a"
  url: "https://doi.org/10.1039/d6ra00412a"
  licence: "CC BY 3.0"
  reviewed: true
---

Quantum dots are semiconductor crystals a few nanometres across, small enough that their colour depends on their size: shrink a dot and it absorbs and glows bluer. So when a dot's absorption moves to the blue, the first guess is that it got smaller. An April 2026 paper in RSC Advances found the opposite in cadmium sulfide selenide (CdSSe) dots doped with cobalt: the absorption moved strongly to the blue while microscope images showed the dots getting larger. The [[quantum-dot-size]] tool, which links dot size and band gap through the Brus equation, makes it easy to see why size alone cannot explain that result.

## What they found

The team first made undoped CdSₓSe₁₋ₓ dots across the whole range from pure CdS to pure CdSe. As selenium replaced sulfur, the absorption moved to longer wavelengths and the gap fell, as expected.

They then added 1 to 10 % cobalt (nominal) to CdS₀.₅Se₀.₅ dots. The absorption peak moved from 468 nm to 395 nm and the gap rose from 2.49 to 2.84 eV. Transmission electron microscope (TEM) images gave average diameters of roughly 2.5 nm for undoped dots, 3.6 nm at 3 % cobalt and 4.1 nm at 10 %. The lattice constant shrank from 5.93 to 5.80 Å, the glow became weaker (quantum yield fell from about 43 % to 8 %) and shorter-lived, and the dots showed weak room-temperature ferromagnetism alongside diamagnetism, with the magnetisation highest at 5 % cobalt.

## Why it matters

Dots doped with magnetic ions are studied for devices that use both light and electron spin, and for markers that can be seen by both light and magnetic methods. The result is also a warning for anyone who sizes dots from their colour: once the composition or the lattice changes, a colour shift no longer tracks size.

## How they did it

The dots were grown by hot injection: a sulfur and selenium solution is injected quickly into a hot cadmium solution that, for the doped batches, also holds cobalt. The team then recorded X-ray diffraction (crystal structure and crystallite size from peak widths), TEM, element mapping, absorption and emission spectra, emission lifetimes and magnetisation curves. The authors put the blue shift down to cobalt itself, not to confinement: the smaller cobalt ion squeezes the lattice when it takes the place of cadmium, and cobalt adds energy levels inside the gap that change where electrons and holes recombine.

## Check it yourself with fibub

Start with the plain size-colour link, using the CdSe-like example built into the tool:

1. Open the tool and keep *Example values* on CdSe-like.
2. Set *I know the* to First absorption peak (nm) and type 520. The page gives a **4.45 nm** dot. Type 580 and it gives **5.54 nm**. Redder peak, bigger dot.

Now the doped case, with **our own made-up alloy values**, not the paper's: pick *Your own values* and type a bulk gap of 2.0 eV, electron mass 0.16, hole mass 0.55 and dielectric constant 9.7. The page shows an exciton Bohr radius of 4.141 nm, so dots a few nanometres across are strongly confined.

3. Type a peak of 470 nm (2.638 eV). The Brus equation gives a **3.97 nm** dot.
4. Type 400 nm (3.100 eV). It gives **3.09 nm**.

So if only size changed, a blue shift of that kind would mean the dots shrank by almost a nanometre. Switch *I know the* to Diameter and type 4.1 nm: the page predicts a peak near 478 nm, nowhere near 400 nm. A bigger dot cannot be bluer with the same material values, so the bulk gap itself must have moved. That matches the paper's case that cobalt, not size, drives the shift, and here it falls straight out of the plot.

Try the opposite check as well. With the same made-up values, a 2.5 nm dot comes out at about 332 nm, much bluer than the 468 nm reported for the undoped dots. That fits the tool's own warning: below about 2 to 3 nm the Brus equation tends to overestimate the gap. For small dots, an empirical sizing curve fitted to TEM sizes is safer, and the tool has a box where you can type one.

Read the gap from your own spectrum with the [[tauc-plot]] first, and compare TEM sizes with crystallite sizes from peak widths using the [[xrd-peak-calculator]].

## The fine print

- The Brus equation assumes a sphere, simple bands and infinitely high walls. Its numbers depend heavily on the effective masses and dielectric constant chosen, and published values for CdSSe alloys vary.
- Sizes in the paper come from TEM and from XRD peak widths, and the two do not agree (about 2 to 3 nm by XRD against 2.5 to 4.1 nm by TEM). XRD widths at under 3 nm are hard to measure well.
- The cobalt measured by element analysis was lower than the nominal 1, 3 and 5 %, and the magnetic evidence is weak, so read those parts of the paper with care.
- Doping shifts both the lattice and the electronic levels. Separating size, strain and composition effects would need dots of fixed size and varied cobalt, or the reverse.
