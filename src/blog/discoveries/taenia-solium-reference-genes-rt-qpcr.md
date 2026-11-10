---
title: "Reference genes for RT-qPCR in developing Taenia solium cysts"
summary: "A Peruvian team ranked 12 housekeeping genes in tapeworm cysts growing into adults. Pick the wrong one and a fold change can be out by a hundred times."
tools: [qpcr-analyser, sequence-tools, pcr-master-mix]
updated: 2026-11-10
sources:
  - "Maravi J et al. (2026), PLOS Neglected Tropical Diseases 20(1): e0013893, CC BY 4.0, the paper described here."
  - "Livak and Schmittgen (2001) for 2^−ΔΔCq and Pfaffl (2001) for the efficiency-corrected ratio, cited as methods only; several reference genes combined by their geometric mean follows Vandesompele et al. (2002)."
  - "The Cq values in the worked example are made up by fibub and run through the qPCR analyser's own code."
paper:
  title: "Validation of reference genes for RT-qPCR relative expression analysis during cyst-to-early adult development of Taenia solium"
  authors: "Maravi J, Castaneda-Carpio D, Gutierrez-Loli R, Del Aguila SW, Villar-Davila V, Blume-La-Torre J, Guerra-Giraldez C"
  journal: "PLOS Neglected Tropical Diseases"
  year: 2026
  doi: "10.1371/journal.pntd.0013893"
  url: "https://journals.plos.org/plosntds/article?id=10.1371%2Fjournal.pntd.0013893"
  licence: "CC BY 4.0"
  reviewed: true
---

Every relative qPCR result rests on a hidden assumption: that the "housekeeping" gene you divided by stays level while your gene of interest moves. A team in Peru tested that assumption in the pork tapeworm *Taenia solium* as its cyst stage was pushed, in a dish, to develop into a young adult worm. They ranked 12 candidate genes and showed how much the answer depends on the choice. Their paper came out in PLOS Neglected Tropical Diseases in January 2026 under a CC BY licence. The [[qpcr-analyser]] does the same arithmetic on your own plate.

## What they found

Of the 12 candidates, two came out on top in both their RNA sequencing data and their qPCR data: **rpl13** (a ribosomal protein gene) and **ef1α** (a translation factor gene). The authors suggest normalising to the geometric mean of those two, rather than to either alone.

The losers are more interesting. Two paralogues, *gapdh2* and one of the two actin genes, were among the least stable. A third, *mapk3*, looked stable but responded to taurocholic acid, the bile salt used to trigger development, so it was thrown out on biological grounds rather than statistical ones. Normalising the same measurements to weaker genes gave fold changes spanning roughly 10- to 6,000-fold, which is the whole point of the exercise: the gene you divide by can move your result by orders of magnitude.

Two target genes were then measured against the recommended pair, one linked to cell division and one to the segmenting of the worm's body.

## Why it matters

*T. solium* causes neurocysticercosis, a parasitic disease of the nervous system, and the cyst-to-adult switch is the part of its life cycle researchers most want to understand. The switch can now be driven in culture, which makes gene expression the obvious read-out, and relative qPCR is the cheapest way to get it. Without a validated reference gene, every number from those experiments inherits an unknown bias. The paper gives that field a tested baseline, and the method it follows works for any organism, tissue or treatment.

## How they did it

1. Cysts were cultured and sorted into three phases by what they looked like: scolex still tucked in, scolex just emerging, and clear segments formed. Each phase was grown with and without the bile salt.
2. Twelve candidate reference genes were ranked first in an existing RNA sequencing dataset with geNorm and NormFinder, then in fresh qPCR data with RefFinder, which pools four ranking methods.
3. Primers were checked with dilution series: 12 of 14 primer sets amplified at 90 to 110 % efficiency, with the whole set between 89.79 % and 110.49 %.
4. Ten individual cysts per group and condition were measured, each in three technical replicates, and two outlying samples were left out.
5. The two target genes were quantified with the efficiency-corrected (Pfaffl) ratio against the geometric mean of the top pair, and the result was compared with the sequencing data.

## Check it yourself with fibub

All the Cq values below are made up by us to show the method.

**Step 1: paste the plate.** In the qPCR analyser, each row is one well: sample, gene, Cq. Say you have two samples, PRE and POST, two reference genes and one target, each in triplicate:

- PRE: rpl13 21.10, 21.20, 21.15; ef1a 22.40, 22.50, 22.45; target 26.00, 26.10, 26.05.
- POST: rpl13 21.30, 21.25, 21.35; ef1a 22.60, 22.55, 22.65; target 23.40, 23.50, 23.45.

**Step 2: name the references and the control.** Type `rpl13, ef1a` as the reference genes and pick PRE as the control sample. With efficiencies left at 100 % the tool reports ΔCq = 1.500 in POST against 4.250 in PRE, so ΔΔCq = **−2.750** and the target is up **6.73-fold** (range 6.45 to 7.02 from the replicate spread). PRE is 1 by definition.

**Step 3: see what a bad reference gene does.** Now imagine a gene that drifts: *gapdh2*-like readings of 24.00, 24.10, 24.05 in PRE and 26.50, 26.60, 26.55 in POST. Normalise to that gene alone and the same target comes out **34.3-fold** up, five times the honest answer, because the reference itself fell by 2.5 cycles. That one swap is the paper's warning in miniature.

**Step 4: correct for efficiency.** Choose *From the standard curves below* and paste a dilution series: quantities 1, 0.1, 0.01, 0.001 against Cq 18.10, 21.60, 25.02, 28.44. The fit gives a slope of −3.444, R² = 0.99997 and an efficiency of **95.1 %** (± 1 SE: 94.6 to 95.7 %), and an unknown at Cq 24.0 reads as 0.0197 in those quantity units. With 92 % for the target, 98 % for rpl13 and 105 % for ef1a, the 6.73-fold result becomes **6.06-fold**: a 10 % shift, in the same direction the paper describes.

Design the primers' reactions with the [[pcr-master-mix]], and check a primer's sequence and its reverse complement in [[sequence-tools]].

## The fine print

- The sequencing ranking and the qPCR ranking came from different cultures and different animals, so the two datasets are not matched.
- RNA came from whole cysts, which averages over regions that may behave differently.
- A trace of genomic DNA showed up in the no-reverse-transcriptase controls, estimated by the authors at under 1 % of signal.
- One of the two target genes agreed with the sequencing data only in the bile-salt condition, so reference-gene choice and culture condition interact.
- The work used version 1 of the parasite's genome, and the *gapdh* copies were not cleanly annotated.
- Reference genes validated in this parasite, in this culture, do not transfer to other species or treatments: the paper's real message is to run the test yourself.
