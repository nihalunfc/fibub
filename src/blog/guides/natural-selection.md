---
title: "Natural selection: how a trait spreads, with a moth simulator"
summary: "See how birds, bark colour, population size and chance change the share of dark moths over 60 generations, and how to read p and q."
tools: [natural-selection, hardy-weinberg-tester, mendel-peas]
updated: 2026-11-10
sources:
  - "Selection with one gene and a dominant allele, and the Hardy-Weinberg principle: standard population genetics, worked out fresh for this guide."
  - "The survival numbers in the example are made up for teaching and are not data from real moth studies."
---

The natural selection simulator lets you replay a famous idea from biology: when the world changes, the animals that suit it best leave more young, and a trait can spread through a whole population. It is made for students in Class 10 and Class 12. To see how one gene is passed on, try [[mendel-peas]]. To test real genotype counts, use the [[hardy-weinberg-tester]].

## What it is

Natural selection needs three things. Animals of one kind **vary**. Some of that variation is **inherited**. And some variants **survive and breed more** than others in the place where they live.

The simulator uses a moth with two colours. The gene has two forms, called alleles. **C** makes a dark moth and is **dominant**, so CC and Cc moths are both dark. **c** makes a light moth, and only cc moths are light.

Birds eat the moths they can see. A dark moth on dark bark is hidden, and so is a light moth on light bark. The moth that does not match is easier to see, so a share *s* of those moths is eaten before they breed. Its survival chance is 1 − s.

Two numbers describe the gene pool. **p** is the share of all alleles that are C, and **q = 1 − p** is the share that are c. With random mating, the newborns come out as:

- CC: p²
- Cc: 2pq
- cc: q²

So the share of dark moths is p² + 2pq, which is the same as 1 − q². This is the **Hardy-Weinberg** pattern. Selection then changes p from one generation to the next, because moths that survive pass on their alleles.

**Genetic drift** is the part played by luck. In a small population, a few unlucky deaths can wipe out an allele even if it is useful. A big population hardly feels this.

## How to use it

1. Choose the level. Class 10 shows moths and the share that are dark. Class 12 adds genotypes, p, q and a Hardy-Weinberg check.
2. Choose the tree bark: always light, always dark, soot comes, or clean air. In the last two the bark changes at generation 10.
3. Set how much of the visible moths the birds eat, and the dark allele at the start.
4. Choose the number of moths (50, 500 or 5000, or no chance at all) and the mutation rate.
5. Drag the generation slider or press **Play**, and read the graph of dark moths over 60 generations.
6. Press **New run** to repeat with the same settings. Use **Check yourself** for fresh questions.

## A worked example

Let us pick our own numbers. Choose **Soot comes**, **no chance**, mutation **Off**, birds eating 40 % of visible moths, and a dark allele that starts at 20 %.

At the start, p = 0.20 and q = 0.80. The dark moths are 1 − 0.80² = 0.36, so 36 % are dark. The bark is light, so each dark moth survives with chance 0.6 and each light moth with chance 1.

The average survival is 0.36 × 0.6 + 0.64 × 1 = 0.856. The new value of p is the C alleles that survive, divided by that average:

p = 0.20 × 0.6 ÷ 0.856 = 0.140

So the next generation has 1 − 0.860² = 26 % dark moths. The dark form is already shrinking. Keep going and the run gives these values (rounded):

- Generation 0: p = 0.200, dark moths 36 %.
- Generation 2: p = 0.094, dark moths 18 %.
- Generation 10 (soot arrives): p = 0.002, dark moths under 1 %.
- Generation 20: p = 0.198, dark moths 36 %.
- Generation 25: p = 0.536, dark moths 79 %.

The allele nearly vanished, and then it recovered quickly once the bark turned dark, because it was never lost. Rerun it with 50 moths and mutation Off: often the C allele is lost by chance before the soot comes, and then nothing can bring it back.

## Where it is used

- **Medicine.** Bacteria that survive an antibiotic pass on their resistance. The same idea, survivors passing on a useful trait, explains how a resistant form spreads once the drug is used.
- **Farming and pests.** Insects that survive a spray are the ones that breed, so a pest can become resistant over a few seasons.
- **Conservation.** Small, cut-off groups of animals lose variation by drift. Biologists use this to judge how risky a small population is.

## Common mistakes

- **Thinking the moths change colour.** They do not. Each moth is born with its colour. What changes is which moths survive to breed.
- **Thinking the soot made the dark allele.** The allele was already there, in a few moths. Selection only changes how common it is. With 50 moths and mutation Off, watch a run where C is lost by chance: after that, the soot changes nothing.
- **Reading one small run as the rule.** With 50 moths, runs differ a lot. Press **New run** several times before you decide what usually happens.
- **Mixing up p with the share of dark moths.** p counts alleles. The share of dark moths is p² + 2pq, which is always bigger than p, and close to twice p when p is small.

## Questions people ask

**Why is the light form slow to return after clean air?**
Most c alleles sit inside dark Cc moths, where the birds cannot act on them. Only cc moths are light, so the light form can only grow as fast as cc moths are produced.

**Does selection always make one form win?**
No. If the bark never changes and the birds are fixed, one form usually wins. If the best form changes from place to place or year to year, both can stay.
