---
title: "Hemispherical Langmuir probe in the ionosphere: PIC simulation of CSES"
summary: "A 2025 study simulated a satellite's hemispherical Langmuir probe particle by particle and compared it with readings in orbit. Here is what it found, and how to analyse a probe trace yourself."
tools: [langmuir-probe, plasma-parameters]
updated: 2026-11-10
sources:
  - "Imtiaz, N., Ur Rehman, S., Chao, L., Yan, R. and Marchand, R. (2025), PIC Modeling of Ionospheric Plasma Diagnostics by Hemispherical Probes: Study of the LAP-CSES at Magnetic Conjugates, Plasma 8(4), 39, published 30 September 2025. Open access under a Creative Commons Attribution (CC BY) licence. Details checked on the publisher's page, 2026-11-10."
  - "Langmuir probe theory (exponential electron current, Bohm ion flux) and the Debye length: standard plasma physics, for example Chen, F. F., Introduction to Plasma Physics and Controlled Fusion."
paper:
  title: "PIC Modeling of Ionospheric Plasma Diagnostics by Hemispherical Probes: Study of the LAP-CSES at Magnetic Conjugates"
  authors: "Nadia Imtiaz, Saeed Ur Rehman, Liu Chao, Rui Yan, Richard Marchand"
  journal: "Plasma"
  year: 2025
  doi: "10.3390/plasma8040039"
  url: "https://www.mdpi.com/2571-6182/8/4/39"
  licence: "CC BY"
  reviewed: true
---

Satellites measure the thin plasma of the upper atmosphere with a Langmuir probe: a small metal collector whose voltage is swept while the current it picks up is recorded. A 2025 open-access paper in *Plasma* rebuilt the probe on the China Seismo-Electromagnetic Satellite (CSES) inside a computer, tracking individual electrons and ions around it, and compared the simulated current-voltage curves with real ones from orbit. You can run the classic analysis of such a curve in the [[langmuir-probe|Langmuir probe analyser]], and see how big the probe is compared with the plasma's own length scale in the [[plasma-parameters|plasma parameter calculator]].

## What they found

The simulated curves followed the measured ones reasonably well. The authors give correlation coefficients of about 0.58, 0.62 and 0.65 for three places along the orbit: above Millstone Hill in the north-eastern United States, above Rothera in Antarctica, and over the equator. The weakest match was at Millstone Hill.

The bigger point is about the sheath, the thin layer around any object in a plasma where the charges are no longer balanced. Its thickness depends on the Debye length, the distance over which the plasma screens out an electric field. The authors describe the probe's sheath with a size ratio of about 1.56, 1.09 and 0.96 at the three places, which puts the same probe in a thin, an intermediate and a thick sheath regime on a single orbit. That matters because the quick formulas for turning a probe curve into temperature and density assume one regime.

## Why it matters

Ionospheric density and temperature feed into radio propagation, GPS corrections and space weather studies, and a probe reading is only as good as the theory behind it. The paper notes that a textbook approach, orbital motion limited theory, may not hold when the sheath is neither thin nor thick. A full simulation tests how far the quick formulas hold in each part of the orbit.

## How they did it

The team used PTetra, a particle-in-cell (PIC) code. PIC codes follow many simulated particles, each standing for many real ones, and solve for the electric field they make together. Electrons and ions kept their real masses and charges, and the field was solved on a mesh of small tetrahedra fitted around the probe's shape: two sensors on posts about half a metre long, each with a collecting hemisphere and a guard. Plasma conditions at the three places came from standard reference models of the ionosphere and of Earth's magnetic field. The probe voltage was swept a few volts either side of zero, and the simulated currents were compared with the satellite's own sweep from one orbit.

## Check it yourself with fibub

The numbers below are **our own made-up example**, chosen to look like a quiet patch of the upper ionosphere. They are not values from the paper.

1. Open the [[plasma-parameters]] calculator and type an electron density of **1e11** per m³, an electron temperature of **0.15** eV and an ion temperature of **0.1** eV. Set the field to **30000** nanotesla and pick **O⁺** as the ion.
2. The Debye length comes out at about **9.1 mm**, the electron plasma frequency at about **2.84 MHz**, and the electron gyroradius at about **3.1 cm**.
3. Now drop the density to **1e10** per m³ and the electron temperature to **0.1** eV, more like a thin night-time plasma. The Debye length grows to about **23.5 mm**.
4. Picture a probe of 2.5 cm radius (again made up). Divided by the Debye length, that is about **2.7** in the first plasma and about **1.1** in the second. The same probe goes from a fairly thin sheath to one as thick as the probe itself, the kind of change the paper describes.
5. Now open the [[langmuir-probe]] analyser. Set the current unit to **µA**, keep "Electron current positive", type a probe area of **2000** mm² and choose **Other…** as the gas with an ion mass of **16**.
6. Paste this made-up trace, which we computed from the probe equations for 0.15 eV electrons, 1e11 per m³ and a plasma potential of 0 V:

```
-2.0 -0.01933
-1.8 -0.01925
-1.6 -0.01914
-1.5 -0.01905
-1.4 -0.01893
-1.3 -0.01872
-1.2 -0.01834
-1.1 -0.01764
-1.0 -0.01632
-0.9 -0.01378
-0.8 -0.008863
-0.7 0.0006748
-0.6 0.01922
-0.5 0.0553
-0.4 0.1255
-0.3 0.2623
-0.2 0.5287
-0.1 1.047
0.0 2.058
0.2 2.079
0.4 2.099
0.6 2.12
```

7. With the fit ranges left on automatic, the analyser should give an electron temperature close to **0.15 eV** (about 1,700 K), a floating potential near **−0.71 V** and a plasma potential near **0 V**. The two density estimates, from the electron and the ion current, should both land close to **1 × 10¹¹** per m³.

The ion current is tiny, about 0.02 µA against 2 µA of electron current, so it is easily buried in noise. Try nudging the "Ion fit: voltages below" box and watch the ion-based density move far more than the temperature does.

## The fine print

- **No collisions or changing fields in the code yet,** as the authors say. Electrons knocked off the probe by sunlight or impacts were left out.
- **Model inputs, not measured plasma.** Conditions came from reference models of average behaviour, not the plasma on the day.
- **One orbit, three places.** A first comparison; the authors expect weaker matches where the Debye length is longer.
- **Our analyser uses the simple thin-sheath approach,** a straight-line fit to the exponential part and the Bohm ion current. In a thick sheath, as the paper stresses, those densities can be off; use them as a first look, not a final answer.
