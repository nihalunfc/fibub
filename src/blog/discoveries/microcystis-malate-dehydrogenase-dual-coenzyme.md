---
title: "A cyanobacterial malate dehydrogenase that uses both NAD and NADP"
summary: "Malate dehydrogenase from Microcystis aeruginosa works with either coenzyme, preferring NAD about twelvefold. Here is how to get Km, kcat and that ratio from your own rates."
tools: [enzyme-kinetics-fitter, protein-calculator, beer-lambert-calculator]
updated: 2026-11-10
sources:
  - "Ge Y et al. (2025), International Journal of Molecular Sciences 26(21): 10313, CC BY, the paper described here."
  - "Michaelis–Menten rate law v = Vmax·S / (Km + S), kcat = Vmax ÷ [E] and the catalytic efficiency kcat/Km: standard biochemistry."
  - "The rates in the worked example are made up by fibub and fitted with the enzyme kinetics fitter's own code."
paper:
  title: "Novel Dual-Coenzyme Specificity and Thermostability of Malate Dehydrogenase Identified in the Cyanobacterium Microcystis aeruginosa PCC7806"
  authors: "Ge Y, Wu Y, Zhou B, Wu X, Ren Y, Zhu J, Ge Y"
  journal: "International Journal of Molecular Sciences"
  year: 2025
  doi: "10.3390/ijms262110313"
  url: "https://www.mdpi.com/1422-0067/26/21/10313"
  licence: "CC BY"
  reviewed: true
---

Malate dehydrogenase sits in the middle of central metabolism, moving hydrogen between malate and oxaloacetate. Most versions are fussy about which coenzyme carries that hydrogen: either NAD or NADP, rarely both. A group in China purified the enzyme from *Microcystis aeruginosa*, the cyanobacterium behind many freshwater blooms, and found it works with either one, with a clear but not absolute preference. The paper appeared in the International Journal of Molecular Sciences in October 2025 under a CC BY licence. Any coenzyme comparison like it can be redone in the [[enzyme-kinetics-fitter]].

## What they found

The enzyme is a two-subunit protein, 325 amino acids per subunit and about 72 kDa for the pair. Running the reaction in the reducing direction, the authors report a Km of 33.1 µM and a turnover number of 31.7 per second with NAD, against 113.2 µM and 8.71 per second with NADP: those are the paper's figures. Dividing turnover by Km gives a catalytic efficiency about twelve times higher for NAD, so the enzyme prefers NAD without refusing NADP.

It is also unusually tough for a freshwater organism's enzyme. Its best activity was at pH 8.0 and 40 °C, it kept roughly nine-tenths of its activity after 20 minutes at up to 70 °C, and at 55 °C its half-life was about 220 minutes. Swapping residues that are thought to pick the coenzyme shifted the preference towards NADP, but never completely, so something else in the protein must also read the coenzyme.

## Why it matters

*M. aeruginosa* forms the blooms that make lake water unsafe, and how it handles reducing power bears on how it copes with bright light and swings in oxygen. An enzyme that can tap either coenzyme pool gives the cell a second route when one pool runs down. For protein engineers it is a useful starting point too: dual-specificity enzymes are easier to steer than single-specificity ones, and a thermostable one survives the handling that engineering involves.

## How they did it

1. The gene was expressed in *E. coli* with a histidine tag and the protein purified; the subunit mass was checked by mass spectrometry.
2. Activity was followed in a spectrophotometer as the reduced coenzyme disappeared at 340 nm, in 1 mL of Tris buffer at pH 8.0 and 25 °C, using an extinction coefficient of 6.22 per mM per cm.
3. Rates were measured over pH 7.5 to 9.5 and 25 to 55 °C, and stability from 25 to 80 °C.
4. Kinetic constants were fitted by non-linear regression in three independent runs.
5. Mutants were made at the residues suspected of choosing the coenzyme, and their preference measured the same way.

## Check it yourself with fibub

The rates below are invented by us; the point is the procedure.

**Step 1: paste the first coenzyme's rates.** In the enzyme kinetics fitter, put the coenzyme concentration in the first column and the initial rate in the second. Try 5, 10, 25, 50, 100 and 200 µM against rates of 1.42, 2.42, 4.42, 5.90, 7.30 and 8.15 µmol per minute. Set the units to µM and µM/min and leave the model on *Best supported by the data*.

The tool picks plain Michaelis–Menten and reports **Vmax 9.31 ± 0.05 µM/min and Km 28.1 ± 0.5 µM**, R² = 0.9998. Substrate inhibition and Hill are both more than 9 AICc units worse, so there is no sign of either. Type 0.004 µM as the enzyme concentration and it adds **kcat 2,326 per minute (38.8 per second)** and a catalytic efficiency of 82.8 per µM per minute (1.38 per µM per second).

**Step 2: repeat for the second coenzyme.** Now 10, 25, 50, 100, 200 and 400 µM against 0.21, 0.44, 0.76, 1.13, 1.55 and 1.87 µmol per minute. The fit gives **Vmax 2.38 ± 0.02 µM/min, Km 108 ± 2 µM**, kcat 594 per minute (9.91 per second) and an efficiency of 5.49 per µM per minute.

**Step 3: compare.** Turnover differs by 2,326 ÷ 594 = **3.9-fold**, but efficiency differs by 82.8 ÷ 5.49 = **15-fold**, because the weaker coenzyme also binds about four times less tightly. Quoting only kcat would hide most of the preference. That is the same shape of result the paper reports, from different numbers.

**Step 4: sanity-check the range and the straight lines.** With the top concentration at 3.7 × Km for the second series, Km and Vmax are separated well enough; below about 2 × Km the tool warns you. Its straight-line table shows Lineweaver–Burk giving Km 96 µM for that series against 107 µM from Hanes–Woolf, a reminder that double-reciprocal plots bend the answer.

To turn a 340 nm reading into a rate, use the [[beer-lambert-calculator]]; for the subunit mass and extinction coefficient of your own construct, the [[protein-calculator]].

## The fine print

- No crystal structure was solved, so the coenzyme-choosing residues are inferred from sequence comparison and mutants.
- Vmax values, the Km for oxaloacetate and the concentration ranges used for fitting are not given in the paper, which makes a full reanalysis impossible.
- The paper's labelling of oxidised and reduced coenzymes is inconsistent in places, so read the methods carefully before citing a number.
- Stability and pH results are compared with literature gathered under different assay conditions.
- Everything was measured on purified protein in a cuvette, not inside living cells, where coenzyme pools and pH differ.
