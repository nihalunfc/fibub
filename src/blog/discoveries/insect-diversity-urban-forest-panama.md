---
title: "Insect diversity in urban forest fragments near Panama City (Malaise traps)"
summary: "A 2025 study trapped 2,038 insects of 403 morphospecies in four forest patches around Panama City. Here is how to work out Shannon, Simpson and rarefaction for your own trap counts."
tools: [biodiversity-indices, community-ordination, sample-size]
updated: 2026-11-10
sources:
  - "Abrego J, Medianero E (2025), Biology 14(6): 721, open access under a Creative Commons Attribution licence, the paper described here. Title, volume and DOI checked on the publisher's page, 2026-11-10."
  - "Diversity formulas: Magurran, Measuring Biological Diversity (2004); Chao (2005) for bias-corrected Chao1; Hurlbert (1971) for rarefaction. Margalef index = (S - 1) / ln N: standard formula."
paper:
  title: "The Diversity and Composition of Insect Communities in Urban Forest Fragments near Panama City"
  authors: "Abrego J, Medianero E"
  journal: "Biology"
  year: 2025
  doi: "10.3390/biology14060721"
  url: "https://www.mdpi.com/2079-7737/14/6/721"
  licence: "CC BY"
  reviewed: true
---

Cities in the tropics are growing fast, and the forest left inside them is often broken into patches. Do those patches still hold rich insect life? A June 2025 paper in the journal *Biology* sampled four forest fragments in and around Panama City with tent-like Malaise traps. The answer was yes: diversity was high in all four. But each patch held a rather different set of species. The [[biodiversity-indices]] tool works out the same kind of diversity numbers from any table of counts. You can then compare whole communities in the [[community-ordination]] tool, or plan how many traps a follow-up needs with the [[sample-size]] tool.

## What they found

Over 33 weeks the traps caught 2,038 insects from seven families. The authors sorted them into 403 morphospecies. A morphospecies is a group of specimens that look alike and are treated as one species until an expert can name them. The two larger, older fragments had the most: about 223 and 211 morphospecies. The two smaller ones had about 127 and 118.

The Shannon index, which rises with both the number of species and how evenly individuals are spread among them, was high everywhere. The paper reports values from about 4.3 to 4.6. Evenness was also high, so no single species dominated a trap. A statistical test found no clear difference in diversity between the four patches. Yet the species lists overlapped only partly. The paper gives a Bray-Curtis dissimilarity of about 0.76 across the fragments, and one patch stood out as the most different from the rest.

## Why it matters

Urban fragments are easy to dismiss as too small or too disturbed to matter. This study suggests they still hold many insects, and that each patch adds species the others lack. For planners, that is an argument for keeping several patches, not just the largest one. For ecologists, it is a reminder that two sites can have the same diversity score while holding quite different species. Looking at both diversity within a site and turnover between sites tells the fuller story.

## How they did it

1. Two Malaise traps went into each fragment, at least 200 m from the forest edge and 500 m apart. A Malaise trap is a mesh tent that steers flying insects up into a collecting bottle.
2. The bottles were emptied weekly from August 2019 to March 2020, giving 264 samples.
3. Insects from seven families were sorted to subfamily or genus where possible, then into morphospecies.
4. For each site, the authors worked out richness, Shannon, Simpson, Pielou evenness, Margalef richness and the Chao1 estimate of total species.
5. They drew rarefaction and accumulation curves to compare sites fairly. Then they compared community make-up with similarity indices and a permutation test.

## Check it yourself with fibub

**Our own made-up example**, not the paper's data. Two traps, A and B, each with eleven possible species. Paste species in the first column and one column per trap:

```
Species	A	B
sp1	30	48
sp2	22	30
sp3	15	5
sp4	9	3
sp5	6	2
sp6	4	0
sp7	2	0
sp8	1	1
sp9	1	0
sp10	1	0
sp11	1	0
```

1. Paste the block into the counts box. The results table fills in as you type.
2. Read trap A: 92 insects, 11 species, Shannon H′ = 1.825, Simpson 1 − D = 0.793, Pielou J′ = 0.761. Four species were seen only once and one twice, so Chao1 guesses about 14.0 species in total.
3. Read trap B: 89 insects, 6 species, H′ = 1.111, Simpson 0.591, J′ = 0.620. Its Berger-Parker dominance is 0.54, meaning more than half the catch is one species.
4. Compare in effective numbers. exp(H′) is 6.20 for A and 3.04 for B, so A behaves like a community of about twice as many equally common species.
5. Scroll to the rarefaction line. At 89 insects, the smaller total, trap A is expected to hold 10.9 ± 0.35 species against B's 6. The difference is not just a sampling-size effect.
6. Check the pair table: Bray-Curtis 0.304 and Jaccard 0.545. The two traps share 6 of their 11 species.

The paper also reports Margalef richness, which the tool's table does not show. You can work it out by hand as (S − 1) ÷ ln N. For trap A that is 10 ÷ ln 92 = 2.21, and for B it is 5 ÷ ln 89 = 1.11. To go further with many traps, paste the same table into the ordination tool to see which sites group together.

## The fine print

- Only two traps per fragment and seven insect families were studied, so the morphospecies totals are a slice of the real fauna.
- Sampling stopped in March 2020 when COVID-19 lockdowns began, so most of the dry season is missing.
- Morphospecies are working units. Some may later split or merge once experts name them.
- No environmental measurements were taken, so the reasons patches differ are not tested.
- The paper has a few internal mismatches, for example in one site's abundance and between two reports of the community test. Read the full paper for the exact figures.
