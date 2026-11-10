---
title: "Rice weevil in stored wheat: COI and COII primers for PCR and qPCR detection"
summary: "New mitochondrial primers pick up hidden rice weevil infestation in wheat grain. Check the primers' Tm, GC and dimers yourself, and work out qPCR efficiency from a dilution series."
tools: [primer-checker, qpcr-analyser, pcr-master-mix]
updated: 2026-11-10
sources:
  - "Nagpal K et al. (2025), Frontiers in Plant Science 16: 1628692, CC BY, the paper described here. Primer sequences are quoted as published facts."
  - "Primer melting temperature by the basic GC formula (Tm = 64.9 + 41 × (GC − 16.4) / length), the salt-adjusted formula and the Wallace 2 + 4 rule, worked here with the primer checker's own code."
  - "qPCR efficiency from a standard curve, E = 10^(−1/slope) − 1, where a slope of −3.32 means 100 %: standard practice, worked here with the qPCR analyser's own code."
paper:
  title: "Molecular detection tool for prompt, reliable and precise diagnosis of the rice weevil, Sitophilus oryzae (Linnaeus) infestation in wheat"
  authors: "Nagpal K, Jasrotia P, Jaglan MS, Kashyap PL, Maanju S, Kumar S"
  journal: "Frontiers in Plant Science"
  year: 2025
  doi: "10.3389/fpls.2025.1628692"
  url: "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1628692/full"
  licence: "CC BY"
  reviewed: true
---

The rice weevil is a small beetle that lays its eggs inside wheat, rice and maize kernels. The larvae eat the grain from the inside, so a sack can look clean while it is already infested. A team in India designed two PCR primer pairs for the weevil's mitochondrial genes and showed that they pick up its DNA in wheat with no other stored-grain insect giving a signal. The primer sequences are printed in the paper, so anyone can check them on the [[primer-checker]] page and plan a qPCR test with the [[qpcr-analyser]].

## What they found

Both primer pairs amplified a single product from rice weevil DNA: 176 bp for the COI pair and 248 bp for the COII pair. COI and COII are two subunits of cytochrome oxidase, an enzyme coded in mitochondrial DNA, which each cell carries in many copies. Neither pair amplified DNA from eight other pests of stored products. Uninfested grain gave no product either.

In qPCR on grain mixed with known numbers of weevils, the cycle at which the signal appeared rose steadily as infestation fell. It went from about 21 cycles at 1,000 insects per kg to about 33 cycles at one insect in 10 kg. The authors give the detection limit as 1 pg of weevil DNA.

## Why it matters

Grain is usually checked by sieving samples or by cutting kernels open. Both miss eggs and young larvae hidden inside the kernel. A DNA test finds the insect at any life stage. It can be run on a ground-up sample and finished within a day, before a weak infestation turns into a heavy one.

## How they did it

1. They pulled COI and COII sequences of the rice weevil from public databases and designed primers in regions that differ from related beetles.
2. DNA was extracted from adult weevils, from the other insect species and from wheat kernels.
3. Conventional PCR used 35 cycles with annealing at 56 °C. Products were checked on agarose gels.
4. For qPCR with SYBR Green, 200 g lots of wheat were infested with weevils. DNA from grain at known infestation levels was then amplified, from 1,000 insects per kg down to one insect per 10 kg.
5. Eight weevil samples bought at local markets were also tested.

## Check it yourself with fibub

**Step 1: the COI pair.** Open the primer checker and type the published forward primer, GAGCCCCAGATATAGCATTCC, and the reverse primer, GGCCAGATCAACAGAAGCTC. Clear the made-up example template, or paste a COI sequence of your own. Leave sodium at 50 mM. The page reports a length of 21 and 20 nt, GC of 52.4 % and 55.0 %, and a basic Tm of 54.4 °C and 53.8 °C. The two Tm values are only 0.5 °C apart. It flags two things to check. The forward primer has a run of four Cs. The two primers can also pair over 4 bases that reach a 3′ end, the kind of short dimer that polymerase can extend in wells with no template.

**Step 2: the COII pair.** Type ATTGCCTTACCCTCACTTCG and TCTGCAGACGTAACTAAGAGTCG. GC is 50.0 % and 47.8 %, and the basic Tm is 51.8 °C and 55.3 °C. The one flag is a self-dimer of 8 bp in the reverse primer: its first bases, TCTGCAGA, read the same on both strands. Only 2 of those paired bases reach the 3′ end, so it is probably harmless.

The simple formulas give a Tm a few degrees below the 56 °C annealing the authors used. That is normal. Simple formulas ignore neighbouring bases and buffer, so take them as a starting point and set the final temperature with a gradient PCR. When you set up the reactions, the [[pcr-master-mix]] page turns stock concentrations into volumes.

**Step 3: qPCR efficiency.** The numbers here are made up by us, not taken from the paper. Say you dilute weevil DNA tenfold from 10 ng down to 0.001 ng and get Cq values of 18.4, 21.8, 25.2, 28.5 and 31.9. In the qPCR analyser's standard-curve box, give each row a gene name, the quantity in ng and the Cq. The fit gives a slope of −3.37, R² = 1.0000 and **an efficiency of 98.0 %**, inside the usual 90 to 110 % window. Add a row for a grain extract with Cq 27.0 and the quantity left blank, and it reads as 0.028 ng, about 28 pg of weevil DNA.

Now try 18.4, 21.4, 24.4, 27.5 and 30.4. The slope is −3.01 and the efficiency comes out at 115 %. The tool marks that as outside the window. An efficiency above 100 % usually points to inhibitors in the concentrated samples or primer-dimers adding signal in the dilute ones, not to a better reaction.

## The fine print

- The paper gives no Tm, GC, slope, R² or efficiency in its text. The standard curve and melt curves appear only as figures.
- Its infestation series steps about 3 cycles per tenfold change. That is a little under the 3.32 expected for perfect doubling. But these are insect numbers in grain, not exact DNA dilutions, so it does not settle the efficiency question.
- The 1 pg limit is stated, but no separate 1 pg reaction appears in the results table. Equating 1 pg with one insect is an assumption.
- Only one wheat variety was tested, and only lab-infested grain. There were no field samples from real stores.
- The specificity panel had eight other species. Close relatives such as the maize weevil and the granary weevil were not on the list.
