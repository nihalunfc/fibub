---
name: Antibiotic zones of inhibition
num: 1455
shelf: learn
section: school-biology
title: "Antibiotic zone of inhibition: a disc diffusion plate simulation with sensitive and resistant germs"
summary: "Put antibiotic discs on a Petri dish of bacteria and see clear zones where growth is stopped. Change the amount in each disc and the agar depth, swap to a resistant strain, and see why the zone edge sits where the antibiotic falls to the germ's MIC. A teaching model."
status: live
ads: false
order: 1455
icon: target
works: offline
updated: 2026-11-09
related: [immune-response, malaria-life-cycle, cell-explorer, natural-selection]
sources:
  - "Disc diffusion and the zone edge from the critical concentration: the Cooper relation x² = 4·D·Tc·ln(c₀/MIC) with c₀ = M/(4π·D·Tc·h), from the standard theory of diffusion from a point source in a thin layer. Written for fibub; no textbook text, figures or exercises are used."
  - "The antibiotics P, Q, R and S, the two strains, their MICs, diffusion coefficients, the 10-hour critical time and the 18 and 14 mm cut-offs are all made up for teaching; they are not real breakpoints. Not medical advice."
  - "Checked against scipy.optimize.brentq solving c(x) = MIC on the same profile for five cases."
flow:
  - { icon: sliders, label: "Discs" }
  - { icon: target, label: "Clear zones" }
  - { icon: ruler, label: "Measure" }
  - { icon: check, label: "Check" }
---

## What it shows

Antibiotics are chemicals, first found in microbes, that kill other microbes or stop them from growing. A simple way to see how well one works is the **disc diffusion test**: spread bacteria all over a Petri dish of agar, press on small paper discs soaked in antibiotics, and leave it warm overnight. The bacteria grow into a cloudy lawn everywhere **except** in a clear ring round each disc that works: the **zone of inhibition**.

This page simulates such a plate with four made-up antibiotics (P, Q, R, S) and a plain paper control. It works out each zone from a simple diffusion model: the antibiotic spreads out from the disc and gets weaker with distance, and the germ is stopped wherever the concentration is above its **MIC** (minimum inhibitory concentration). A second graph shows that concentration against distance, with the MIC line and the zone edge.

It fits **Class 12 Biology: microbes in human welfare** (antibiotics, Fleming and penicillin) and links to evolution (antibiotic resistance as natural selection). How the body's own defences work is in [[immune-response]], and how resistance spreads by selection is in [[natural-selection]].

This is a **teaching model** with made-up antibiotics and numbers. Real laboratories follow standard methods and official tables. Not medical advice.

## How to use it

1. Choose the **germ**: Strain 1 is an ordinary germ; Strain 2 has become resistant to some antibiotics.
2. Slide the **antibiotic in each disc** (micrograms) and the **agar depth**.
3. Tap a disc, a table row, or use **Look closely at** to see its concentration profile and working.
4. Read the table: each zone's diameter and a teaching verdict (≥ 18 mm sensitive, 14 to 17 mm intermediate, below 14 mm resistant; made-up cut-offs).

## Worked example

Disc P on Strain 1, with 10 µg in the disc, agar 4 mm deep, D = 0.5 mm²/h and Tc = 10 h. The concentration next to the disc is c₀ = M / (4π·D·Tc·h) ≈ **39.8 µg/mL**. The germ's MIC is 0.5 µg/mL, so radius² = 4 × 0.5 × 10 × ln(39.8 / 0.5) ≈ 87.6 mm², radius ≈ 9.36 mm and the zone is about **18.7 mm** across: sensitive. On Strain 2 (MIC 32 µg/mL) the zone shrinks to nothing: resistant.

## What changes the zone?

- **More antibiotic** in the disc: bigger zone, but only slowly (the radius² grows with the logarithm of the amount).
- **Thinner agar**: the same antibiotic is less diluted, so the zone is bigger. That is why real tests fix the depth.
- **Big molecules** spread slowly (small D), so the zone can be small even for a strong antibiotic. Zone size compares germs on one antibiotic better than antibiotics with each other.
- **A resistant germ** has a higher MIC, so the zone shrinks or disappears.

## Check yourself

Five fresh questions: radius to diameter, which antibiotic works better, a zone radius from the model, Fleming, and what no zone means. Nothing is saved.

## FAQ

**Why is there a control disc?** To show that the paper itself does not stop the bacteria. Its zone should be zero.

**Why does resistance matter?** Using antibiotics when they are not needed, or stopping a course early, helps resistant germs survive and spread. Then the medicines stop working.

**Is this from my textbook?** It covers the standard school topic with its own model and examples. It is an independent study aid.
