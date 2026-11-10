---
title: "An ex vivo oral biofilm model: CFU log reductions after blackcurrant extract and chlorhexidine"
summary: "Saliva and plaque from ten donors grew a layered biofilm on coverslips, and viable counts measured what rinses killed. Here is how to turn your own plate counts into CFU/mL and a log reduction with an interval."
tools: [cfu-counter, centrifuge-calculator, growth-curve-od600]
updated: 2026-11-10
sources:
  - "Kranz S, Heyder M, Guellmar A, Gottschaldt M, Schubert US, Loeffler B, Sigusch B, Reise M (2026), Pathogens 15(4): 375, CC BY, the paper described here."
  - "The exact Poisson confidence interval for a pooled colony count: standard statistics (Garwood, 1936)."
  - "RCF = omega squared times r over g, with standard gravity 9.80665 m/s2 (exact by definition)."
  - "The counts, titres and forces in the worked example were computed with the repo's own src/lib/sci/cfu.ts and src/lib/sci/centrifuge.ts code from made-up plate counts."
paper:
  title: "An Innovative Oral Ex Vivo Biofilm Model for Antimicrobial Investigations"
  authors: "Kranz S, Heyder M, Guellmar A, Gottschaldt M, Schubert US, Loeffler B, Sigusch B, Reise M"
  journal: "Pathogens"
  year: 2026
  doi: "10.3390/pathogens15040375"
  url: "https://www.mdpi.com/2076-0817/15/4/375"
  licence: "CC BY"
  reviewed: true
---

Dental plaque is a community, not a species, yet most laboratory tests of mouthwashes use one or two cultured bacteria. A group in Jena built a middle way: coverslips coated with a pellicle of a donor's own saliva, seeded with that same donor's subgingival plaque and grown without oxygen for up to three days. The model, and a first test of two blackcurrant extracts against chlorhexidine on it, appeared in *Pathogens* on 1 April 2026 under a CC BY licence. The read-out is a viable count, which is what the [[cfu-counter|CFU counter]] turns into a titre.

## What they found

Biofilms grew in a sensible order: scattered colonies after an hour, several layers by four hours, and by 72 hours a dense mat of mixed species. The model passes its first test, which is to look like a biofilm rather than a lawn of one organism.

On young biofilms the rinses separated clearly. For one-hour biofilms given three minutes of contact, the authors report the whole-fruit juice cutting counts by 1.93 log against buffer, the skin extract by about 1 log, and 0.2 % chlorhexidine by 3.23 log. At four hours the juice reached 2.21 log, no longer statistically distinguishable from chlorhexidine; at 24 hours only the juice reduced counts significantly. Three minutes beat one minute.

## Why it matters

Two things are worth borrowing. The model gives a polymicrobial biofilm without a chemostat, on a surface you can image and then scrape for counting. And the authors show restraint: neither extract reached the 3-log reduction usually taken as the mark of antimicrobial activity, which they say plainly.

## How they did it

1. Ten periodontally healthy volunteers aged 23 to 26 skipped oral hygiene for 24 hours; plaque was taken from between the back teeth with paper points, and saliva collected.
2. Plaque was grown in Schaedler fluid without oxygen for 24 hours, spun down and adjusted to an optical density of 0.5 at 546 nm, stated as about 10⁷ CFU/mL.
3. Spun saliva laid a pellicle on each coverslip over two hours at 37 °C; the coverslip then took 600 µL of its own donor's inoculum and grew anaerobically for 1 to 72 hours. Some were fixed, stained with propidium iodide and imaged by confocal microscopy.
4. For the antimicrobial test, 1, 4 or 24-hour biofilms were covered with 500 µL of juice, skin extract, chlorhexidine or buffer for 1 or 3 minutes, rinsed, dispersed by pipetting, diluted to 10⁻⁶, and 100 µL of each dilution spread on Schaedler agar.
5. Results were medians from ten donor-derived biofilms, by ANOVA with corrected post-hoc tests.

## Check it yourself with fibub

Every number below is invented by us as a demonstration. The paper's own reductions are quoted above, as theirs.

**Step 1: get the spin right first.** Protocols that give rpm instead of × g do not transfer between machines. On the [[centrifuge-calculator|centrifuge calculator]], type the radius to the bottom of the tube and the speed. At 3,500 rpm a 15 cm rotor gives **2,055 × g**, an 8 cm rotor only **1,096 × g**: nearly half the force, and a pellet you may lose. The other way round, 2,000 × g in that 15 cm rotor needs **3,453 rpm**, and a microcentrifuge at 13,000 rpm with an 8.5 cm radius is **16,064 × g** — the number to write in your methods.

**Step 2: standardise the inoculum.** The paper set its starting suspension by optical density. For the growth rate behind such a suspension, paste your time and OD readings into the [[growth-curve-od600|OD600 growth curve]] page; it fits the straight part of the log curve and converts OD to cells per mL using a factor you supply from your own calibration.

**Step 3: count the colonies.** On the CFU counter, open a photo of each plate taken from straight above with even light, tap *Set the plate edge*, and let the page find the colonies. Tap to add a missed one or tap a ring to remove a false one, and tick *Split touching colonies* for merged neighbours.

**Step 4: pool the plates into a titre.** Type one line per plate as dilution, volume plated, colonies. For a control biofilm:

```
1e-3  0.1 mL  TNTC
1e-4  0.1 mL  TNTC
1e-5  0.1 mL  186
1e-6  0.1 mL  21
```

With the countable range at its default 30 to 300, only the 10⁻⁵ plate qualifies: 186 ÷ (0.1 mL × 10⁻⁵) = **1.86 × 10⁸ CFU/mL**, 95 % interval 1.60 × 10⁸ to 2.15 × 10⁸ from the exact Poisson interval on 186 colonies. The 21-colony plate is listed but not used, and the table says why. For the treated biofilm:

```
1e-2  0.1 mL  TNTC
1e-3  0.1 mL  132
1e-4  0.1 mL  14
```

That gives **1.32 × 10⁶ CFU/mL** (1.10 × 10⁶ to 1.57 × 10⁶).

**Step 5: the log reduction, with an interval.** log₁₀(1.86 × 10⁸ ÷ 1.32 × 10⁶) = **2.15 log**, and combining the two intervals gives about 2.01 to 2.29 log, so this rinse is short of 3 log and you can say so without hedging. With two or more countable plates for one sample the page also runs a chi-square check that they agree; a bad result usually means pipetting, not biology.

## The fine print

- Ten donors, all young and periodontally healthy. Biofilms from gingivitis, periodontitis or implant disease were not tested and may respond differently.
- Samples were not pooled, so each biofilm had its own species mix, which the authors name as a source of variability.
- Three minutes may be too short for extracts that do not kill on contact. Polyphenol content was not measured, and the juice carried pulp and seed material the skin extract did not, so the active ingredients are unidentified.
- Results are medians from a model system; nothing here is advice about anyone's mouth or any product. The methods and abstract also disagree on the plate incubation time.
