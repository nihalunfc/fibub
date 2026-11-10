---
title: "Monzogranite as a gamma-ray shield: attenuation, half-value layer and strength"
summary: "A 2026 study tested seven Egyptian monzogranite samples as natural radiation shielding stone. Here is what it found, and how to turn counts into a half-value layer yourself."
tools: [gamma-shielding, counting-statistics]
updated: 2026-11-10
sources:
  - "Hasabelnaby, M., Azer, M. K., Salaheldin, G., Abdel Gawad, A. E., Abo Khashaba, S. M. and Hanfi, M. Y. (2026), Integrating the Petrographic, Structural, Mechanical Characteristics, and Gamma-Ray Shielding Performance of Monzogranite as a Multifunctional Natural Material, Materials 19(14), 2935, published 8 July 2026. Open access under a Creative Commons Attribution (CC BY) licence. Details checked on the publisher's page, 2026-11-10."
  - "Narrow-beam attenuation I = I0 e^(−μx), half-value layer ln 2 / μ and tenth-value layer ln 10 / μ: standard radiation physics (for example Knoll, Radiation Detection and Measurement)."
  - "Poisson counting uncertainty (the standard deviation of N counts is √N): standard counting statistics."
paper:
  title: "Integrating the Petrographic, Structural, Mechanical Characteristics, and Gamma-Ray Shielding Performance of Monzogranite as a Multifunctional Natural Material"
  authors: "Hasabelnaby M, Azer MK, Salaheldin G, Abdel Gawad AE, Abo Khashaba SM, Hanfi MY"
  journal: "Materials"
  year: 2026
  doi: "10.3390/ma19142935"
  url: "https://www.mdpi.com/1996-1944/19/14/2935"
  licence: "CC BY"
  reviewed: true
---

Lead and heavy concrete are the usual answers when a room needs protection from gamma rays, but a strong, dense building stone could do part of the job while also holding up a wall. A 2026 open-access study in *Materials* looked at monzogranite, a granite-like rock, from Egypt and measured both how well it blocks gamma rays and how strong it is. The core step in that kind of work, turning two count rates into an attenuation coefficient and a half-value layer, is exactly what the [[gamma-shielding|gamma shielding calculator]] does, and [[counting-statistics]] tells you how much to trust the counts.

## What they found

The team studied seven samples, labelled MB1 to MB7, with densities from 2.70 to 3.06 grams per cubic centimetre. The densest, MB3, was also the best shield over most of the energy range, which the authors link to its high density and its iron oxide content. Its linear attenuation coefficient at 1 MeV was 0.193 per centimetre, against 0.170 per centimetre for the lightest sample.

Across energies from 0.015 to 15 MeV the half-value layer of the stones ran from a fraction of a millimetre at the lowest energy to about 10.6 centimetres at the highest. The measured coefficients agreed with calculations from standard cross-section data to within 5.8 % on average, with no gap above 10 %. Compressive strengths ran from about 89 to 240 megapascals.

## Why it matters

A gamma ray is not stopped at a set depth. Each centimetre of material takes out the same fraction of the photons that reach it, so the beam fades away exponentially. The linear attenuation coefficient μ tells you how big that fraction is, and the half-value layer (HVL) is the thickness that halves the beam. A material with a short HVL does the job in a thinner wall.

At energies from about half an MeV up to a few MeV, the main way gamma rays interact is Compton scattering off electrons. The number of electrons per gram is almost the same in every light material, so in that range dense stone behaves much like concrete of the same density.

## How they did it

The authors described each rock under the microscope and measured its make-up with X-ray fluorescence and X-ray diffraction. For the shielding part they placed 5 cm thick samples between a gamma source and a sodium iodide scintillation detector, with lead collimators keeping the beam narrow. The sources were caesium-137 (0.662 MeV) and cobalt-60 (1.17 and 1.33 MeV). They then compared the measured values with a free online program built on the NIST XCOM cross-section data and extended the results to other energies by calculation.

## Check it yourself with fibub

The numbers below are **our own made-up readings** for a typical dense granite, not taken from the paper.

Suppose a 5.0 cm slab of stone with a density of 2.90 g/cm³ sits in a narrow Cs-137 beam. With no slab the detector records 50,000 counts in the photopeak, and with the slab in place 16,400 counts in the same time (both after background has been subtracted).

1. Work out μ from the two counts: μ = ln(50,000 / 16,400) ÷ 5.0 cm = **0.223 per cm**.
2. Divide by the density to get the mass attenuation coefficient: 0.223 ÷ 2.90 = **0.0769 cm²/g**.
3. Open the [[gamma-shielding]] tool. Choose *Cs-137 (0.662 MeV)*, then type **0.0769** into the μ/ρ box, **2.90** for the density and **5** cm for the thickness. Leave the buildup at *none*, since the beam was collimated.
4. The results show a half-value layer of about **3.11 cm**, a tenth-value layer of about **10.3 cm**, a mean free path of about **4.48 cm**, and a transmission of **32.8 %**.
5. With the wanted transmission left at 1 %, the page says about **20.7 cm** of this stone would be needed.
6. Now pick *Concrete (simple mix)* from the material list and look at the comparison table. The built-in estimate for ordinary concrete at this energy gives an HVL of about 3.87 cm, so our made-up stone does a little better, thanks mostly to its higher density.

Repeat with Co-60 counts. If the same slab let through 22,000 of 50,000 counts, μ/ρ would come out at about 0.0566 cm²/g and the HVL at about 4.22 cm.

You can also check the paper's headline value. Dividing MB3's 0.193 per cm by its density of 3.06 g/cm³ gives 0.063 cm²/g at 1 MeV, a sensible figure for rock at that energy.

How sure is the result? Counting noise follows Poisson statistics, so N counts carry an uncertainty of about √N. For our counts that puts about ±0.002 per cm on μ, under 1 %. Use the [[counting-statistics]] tool to subtract the background properly and to see how long you need to count for a given precision.

## The fine print

- **Seven samples from one area.** The results describe these rocks, not granite in general; stone from other quarries will differ in density and iron content.
- **Only two kinds of source were measured.** Values at most other energies come from calculation, not from experiment.
- **Narrow-beam values.** A real wall sees a broad beam, where scattered photons add back some dose (buildup), so practical shields must be thicker than the narrow-beam HVL suggests.
- **Porosity of about 19 to 23 %** and water uptake of 12 to 15 % were reported, which could matter for long-term use; the study did not test ageing.
- Our tool's built-in coefficients are approximate. For real work, type a NIST XCOM value or your own measurement, and get any real shield checked by a qualified expert. Our numbers are made up; for the study's measured values, read the paper itself.
