---
title: "Fusarium wilt resistance in wax gourd: one dominant gene, a 3:1 F2 test"
summary: "A wax gourd cross split 955 resistant to 349 wilted seedlings, the pattern of one dominant gene. Here is how to run the same chi-square test on your own counts."
tools: [mendelian-chi-square, punnett-square, linkage-map-calculator]
updated: 2026-11-10
sources:
  - "Li F et al. (2025), Frontiers in Plant Science 16: 1555316, CC BY, the paper described here."
  - "Pearson's chi-square goodness-of-fit test and the exact binomial test: standard statistics, worked here with the Mendelian chi-square tool's own code. Critical values of chi-square with 1 degree of freedom: 3.84 at the 5 % level, 6.63 at the 1 % level."
paper:
  title: "Fine mapping and characterization of Fusarium wilt (Fusarium oxysporum f. sp. benincasae) resistance gene Fob1(t) in wax gourd (Benincasa hispida Cogn.)"
  authors: "Li F, Qin J, Li J, Cheng L, He X, Zhong X, Mo Y, Liang H, Wang P, Li Y, Wu Y"
  journal: "Frontiers in Plant Science"
  year: 2025
  doi: "10.3389/fpls.2025.1555316"
  url: "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1555316/full"
  licence: "CC BY"
  reviewed: true
---

Wax gourd, also called winter melon or ash gourd, is a big vegetable crop across South and East Asia, and Fusarium wilt is one of its worst diseases. A soil fungus gets in through the roots, blocks the water vessels and kills the plant. A team in China crossed a resistant line with a susceptible one, counted how the grandchildren of that cross split, and then hunted down the stretch of chromosome responsible. Their F2 counts follow the classic 3 resistant to 1 susceptible pattern of a single dominant gene, and you can check that claim in a minute with the [[mendelian-chi-square]] page.

## What they found

The resistant parent, GD68, showed no wilt at all after its roots were soaked with fungal spores, while the susceptible parent, HM25, died. Their F1 hybrids were resistant too, so resistance is dominant. Among 1,304 F2 seedlings, the authors scored 955 as resistant and 349 as susceptible. That split fits a 3:1 ratio, which points to one main gene. They named it *Fob1(t)* and placed it on chromosome 3.

Fine mapping with 42 recombinant plants narrowed the region to about 467 kb (the abstract says 469 kb), holding 22 genes. One of them, a chitinase gene (chitinases break down chitin, a main part of fungal cell walls), differs between the parents by a single base that swaps one amino acid. It also shows a clear difference in expression ten days after infection, so the authors name it the most likely candidate.

## Why it matters

Fungicides do little against wilt fungi once they live in the soil, so resistant varieties are the practical defence. A gene that behaves as a single dominant unit is the easiest kind to breed with: one copy protects the plant. Better still, the team built DNA markers on both sides of the gene. A breeder can test a seedling's DNA instead of infecting it and waiting weeks for symptoms.

## How they did it

1. They crossed HM25 (female, susceptible) with GD68 (male, resistant), then selfed the F1 to get the F2.
2. Seedlings were infected by pouring a spore suspension of one fungal strain onto the roots. Each plant got a disease score from 0 to 5. Plants scoring 3 or less counted as resistant, and 4 or 5 as susceptible.
3. DNA pools from 30 resistant and 30 susceptible F2 plants were sequenced (bulked segregant analysis) to find the chromosome region that differs between the pools.
4. Markers in that region, plus about 3,000 F2:3 plants screened for recombinants, shrank the interval step by step.
5. Gene expression in the two parents was compared by RNA sequencing and by qPCR.

## Check it yourself with fibub

**Step 1: the paper's own split.** Open the Mendelian chi-square tool and choose the 3 : 1 preset. Name the classes "Resistant, Susceptible" and type the paper's counts, 955 and 349. The tool expects 978 and 326 and gives **χ² = 2.16, df = 1, p = 0.141**, consistent with 3:1. The exact binomial test agrees (p = 0.141). The susceptible class supplies 75 % of the chi-square, because there are 23 more wilted plants than expected. One possible reason is that borderline plants scored as diseased push the recessive class up a little, though the counts alone cannot say.

**Step 2: rule out the alternatives.** Type 13:3 in the Ratio box, the ratio of a dominant gene masked by a second gene. The same counts give χ² = 55.0 and p = 1.2 × 10⁻¹³, so a two-gene model of that kind is firmly rejected. A large sample like this one can tell close ratios apart.

**Step 3: your own cross.** The counts below are made up by us to show the method; they are not from the paper.

- An F2 of 400 seedlings with 286 resistant and 114 susceptible gives χ² = 2.61, p = 0.106: still a fit.
- The same 400 with 262 resistant and 138 susceptible gives χ² = 19.3, p = 0.000011: not 3:1. Before blaming genetics, check the scoring cut-off and whether seedlings died for other reasons.
- Grow F3 families from 100 F2 plants. If 22 breed true resistant, 54 segregate and 24 breed true susceptible, the 1 : 2 : 1 preset gives χ² = 0.720, p = 0.698. That is the test that separates AA from Aa plants.
- A backcross to the susceptible parent should give 1:1. With 44 resistant and 56 susceptible, χ² = 1.44, p = 0.230, and the exact test gives p = 0.271.

To see where those expected ratios come from, draw the cross in the [[punnett-square]]. Once you have marker genotypes for the same plants, turn recombinant counts into map distances with the [[linkage-map-calculator]].

## The fine print

- Resistance was scored once, at the seedling stage, against a single fungal strain. Older plants in the field and other strains of the fungus may behave differently.
- Splitting a 0 to 5 score into two classes is a judgement call. A different cut-off would move plants between classes and change the chi-square.
- The paper calls 3.84 the 1 % critical value. For 1 degree of freedom it is the 5 % value; the 1 % value is 6.63. Either way, 2.16 is well below it.
- The chitinase gene is a candidate, not a proven cause. It has not yet been knocked out, silenced or transferred into a susceptible plant.
- The markers were checked on only 13 plants and lines. They should be tested on more breeding material before anyone relies on them.
