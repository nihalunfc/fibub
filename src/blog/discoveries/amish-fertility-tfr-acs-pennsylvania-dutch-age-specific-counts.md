---
title: "Amish fertility: rebuilding the total fertility rate from survey counts"
summary: "A 2025 study compares US survey data with Amish population directories. From the counts it prints we recompute the total fertility rate, about 6.2 in the survey and 6.0 in the directories, and show how sure each figure is."
tools: [fertility-rates, population-pyramid, hypothesis-tests]
updated: 2026-11-24
sources:
  - "Stone, L., Anderson, C. and Thiehoff, S. (2025), Amish fertility in the United States: Comparative evidence from the American Community Survey and Amish population registries, Demographic Research 52: 869-886, doi:10.4054/DemRes.2025.52.26. Licence CC BY 3.0 Germany, taken from the licence line printed on the paper's own PDF (demographic-research.org/volumes/vol52/26/52-26.pdf), checked 2026-11-24; the Crossref record carries no licence and no correction or retraction notice."
  - "Method: age-specific fertility rates, total fertility rate (TFR), gross and net reproduction rates and mean age at childbearing as set out in Preston, Heuveline and Guillot (2001), Demography: Measuring and Modeling Population Processes, chapter 5. We used only the counts of women and of women with a birth in the paper's Table 1; no figure or table was copied."
paper:
  title: "Amish fertility in the United States: Comparative evidence from the American Community Survey and Amish population registries"
  authors: "Stone L, Anderson C, Thiehoff S"
  journal: "Demographic Research"
  year: 2025
  doi: "10.4054/DemRes.2025.52.26"
  url: "https://www.demographic-research.org/volumes/vol52/26/52-26.pdf"
  licence: "CC BY 3.0 DE"
  reviewed: true
---

The Amish are one of the few large groups in a rich country whose families are still near six children each, so demographers keep asking how many children Amish women really have, and how well a general survey can see them. A 2025 paper in *Demographic Research* tackles this by setting the US American Community Survey (ACS) beside a very different source: directories that Amish communities print for themselves. Its Table 1 gives the number of women in each five-year age group and how many of them had a birth, which is all the [[fertility-rates]] needs. If you want the age pattern as a picture too, the [[population-pyramid]] draws it, and the [[hypothesis-tests]] help you ask whether two rates really differ.

## The paper in brief

The authors find Amish respondents in the 2000 to 2021 ACS in three ways: homes where Pennsylvania Dutch is spoken, homes where a Germanic language is spoken and there is no phone, and the same on a farm without a phone. For comparison they build a second sample from 71 Amish-made directories that cover about 54,700 households, called CAPED-2010s in the paper. They report a total fertility rate (TFR, the number of children a woman would have if she lived through today's age-specific rates) of "just over six", compare marital fertility with the US average, and test with a standard model (Coale and Trussell's *m*) whether Amish couples limit births. Their main message is that the two sources agree on a high level of fertility, with an age pattern that differs mostly at the edges.

## Checked with the tools

The paper shows the age-specific rates and the TFR as graphs. Its Table 1 prints the counts behind them, so we can rebuild the numbers. For each group we divided women with a birth by all women in the age group, which is the age-specific fertility rate (ASFR), and added the seven rates, times five years each, to get the TFR. **Our assumption:** one woman with a birth means one birth, so twins make our figures very slightly low.

| Group (paper's wording shortened) | Women aged 15 to 49 | Births | TFR | 95 % interval | Mean age of mother |
|---|---|---|---|---|---|
| ACS, Pennsylvania Dutch speakers | 8,688 | 1,514 | 6.17 | 5.90 to 6.45 | 31.5 |
| ACS, Germanic speakers, no phone | 8,548 | 1,548 | 6.57 | 6.28 to 6.86 | 32.1 |
| ACS, speakers on farms, no phone | 1,619 | 306 | 7.69 | 6.96 to 8.43 | 33.6 |
| Amish directories (CAPED) | 53,636 | 9,721 | 6.03 | 5.92 to 6.14 | 30.1 |

The paper says "just over six" for the Amish and "generally around six" for the Pennsylvania Dutch sample, and the tool agrees: 6.17 and 6.03. The intervals are **our own** simple binomial model (each woman either has a birth that year or not), so treat them as a guide.

<!-- fig:asfr -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Age-specific fertility curves for three of the four groups. All peak at ages 25 to 29 near 320 to 360 births per 1,000 women. The directory curve is far higher at ages 15 to 19." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Births per 1,000 women, by age of mother</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Births per 1,000 women, by age of mother</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="219.1" y2="219.1" style="stroke:var(--line)"/><text x="52" y="223.1" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="166.3" y2="166.3" style="stroke:var(--line)"/><text x="52" y="170.3" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="113.4" y2="113.4" style="stroke:var(--line)"/><text x="52" y="117.4" text-anchor="end" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="60.6" y2="60.6" style="stroke:var(--line)"/><text x="52" y="64.6" text-anchor="end" style="fill:var(--muted)">400</text><line x1="98.7" x2="98.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="98.7" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="261.3" x2="261.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="261.3" y="289" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="342.7" x2="342.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="342.7" y="289" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="505.3" x2="505.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="505.3" y="289" text-anchor="middle" style="fill:var(--muted)">45</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Mother's age (middle of group)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Births per 1,000 women a year</text><path d="M58 266.8L139.3 157.9L220.7 82.5L302 119.8L383.3 166.6L464.7 210.4L546 247.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 268.1L139.3 160.2L220.7 84.7L302 107.9L383.3 155.8L464.7 193.4L546 239.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 231.7L139.3 153.7L220.7 103.2L302 123.7L383.3 166L464.7 223.3L546 264.8" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">ACS Pa. Dutch</text><line x1="177.6" x2="189.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="193.6" y="40" style="fill:var(--muted)">ACS Germanic, no phone</text><line x1="362" x2="374" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="378" y="40" style="fill:var(--muted)">Directories (CAPED)</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Our recomputation of age-specific fertility from the counts in the paper. The age pattern is the same in all groups; only the teenage rate differs a lot.</figcaption></figure>
<!-- /fig:asfr -->

All three curves peak at ages 25 to 29, at 320 to 360 births per 1,000 women. They part at the ends: at ages 15 to 19 the directories give 76 births per 1,000 women and the Pennsylvania Dutch ACS group only 10, a gap of almost eight times, while at 45 to 49 the survey rate is 46 against 14. Those two edges are where the sources disagree, and since the directories are the larger sample, the edges are the part to read with care.

<!-- fig:tfr -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Total fertility rates with 95 percent intervals: 6.17, 6.57, 7.69 and 6.03 children per woman." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Total fertility rate with a 95 % interval</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Total fertility rate with a 95 % interval</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="198.5" y2="198.5" style="stroke:var(--line)"/><text x="52" y="202.5" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="143" y2="143" style="stroke:var(--line)"/><text x="52" y="147" text-anchor="end" style="fill:var(--muted)">7</text><line x1="58" x2="546" y1="87.5" y2="87.5" style="stroke:var(--line)"/><text x="52" y="91.5" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">9</text><line x1="119" x2="119" y1="254" y2="258" style="stroke:var(--muted)"/><text x="119" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="241" x2="241" y1="254" y2="258" style="stroke:var(--muted)"/><text x="241" y="271" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="363" x2="363" y1="254" y2="258" style="stroke:var(--muted)"/><text x="363" y="271" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="485" x2="485" y1="254" y2="258" style="stroke:var(--muted)"/><text x="485" y="271" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Group (1 PD, 2 Germanic, 3 farm, 4 directories)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Children per woman</text><line x1="58" x2="546" y1="198.5" y2="198.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="193.5" text-anchor="end" style="fill:var(--muted)">"about six"</text><circle cx="119" cy="188.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="241" cy="166.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="363" cy="104.6" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="485" cy="196.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><line x1="119" x2="119" y1="204.2" y2="173.7" style="stroke:var(--c-blog)"/><line x1="241" x2="241" y1="183.2" y2="150.7" style="stroke:var(--c-blog)"/><line x1="363" x2="363" y1="145.4" y2="63.7" style="stroke:var(--c-blog)"/><line x1="485" x2="485" y1="202.8" y2="190.8" style="stroke:var(--c-blog)"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Total fertility rate for each group, with a 95 % interval from our simple binomial model. The farm group is small, so its interval is wide.</figcaption></figure>
<!-- /fig:tfr -->

Does the survey disagree with the directories overall? The Pennsylvania Dutch ACS TFR is 0.14 children higher, and the standard error of that difference is 0.15, so the gap is under one standard error (z = 0.94): the two sources agree on the total. The farm group is another matter. Its TFR is 1.52 above the Pennsylvania Dutch group (z = 3.8), even though it holds only 1,619 women and 306 births. That fits the paper's wider finding that the most traditional households have the most children, but the width of its interval, 7.0 to 8.4, is a reminder of how little data one small group gives.

Two more numbers come straight from the tool. Half of all Amish births in the directories (49.7 %) are to mothers aged 25 to 34. And with our assumptions (1.05 boys per girl, 97 % of girls surviving to motherhood) the gross reproduction rate is 2.94 and the net reproduction rate 2.85 in the directories: each generation of women is almost three times as large as the one before, which is what a TFR near six means.

## How we made the graphs

Both charts and all numbers come from `scripts/blog-figures/amish-fertility-tfr-acs-pennsylvania-dutch-age-specific-counts.mjs`. It calls `fertility` and `groupsOf` from `src/lib/sci/fertility.ts`, the maths behind the [[fertility-rates]], for each of the four groups. The women and births counts are the paper's Table 1 (ACS groups) and the matching directory column. Our own additions are the binomial standard error of the TFR, the one-woman-one-birth rule, and the sex ratio and survival used for GRR and NRR (marked as our assumptions above).

## How we test the maths

`tests/sci-tools/fertility-rates.mjs` runs on every change to fibub:

- A made-up seven-group table must match an independent NumPy calculation: TFR 1.5595, GRR 0.7607, NRR 0.7509 and mean age 30.6006.
- A flat rate of 0.1 in every group must give TFR 3.5 and mean age 32.5, which can be done by hand.
- New with this article: the Pennsylvania Dutch counts must give TFR 6.172 and mean age 31.49, and the directory counts TFR 6.030, GFR 181.3 per 1,000 women and mean age 30.14.

## Check it yourself

On the [[fertility-rates]], in the *Births and women by age* card:

1. Replace the text with these eight lines (tab between the columns), which are the Pennsylvania Dutch counts: `Age`, `Births`, `Women` as the header, then `15-19 19 1944`, `20-24 326 1510`, `25-29 475 1325`, `30-34 343 1191`, `35-39 210 1053`, `40-44 106 910`, `45-49 35 755`.
2. Empty *Total population (for CBR)*, keep *Births cover (years)* at 1 and *Sex ratio at birth* at 1.05, set *NRR from* to *Survival to mean age* and *Survival to mean age at childbearing* to 0.97.
3. The result reads **Total fertility rate 6.17 children per woman**, GRR **3.011**, NRR **2.920**, mean age at childbearing **31.49 years** and a general fertility rate of **174.3 per 1,000 women 15 to 49**.
4. Now put in the directory counts (`15-19 964 12657`, `20-24 2271 10147`, `25-29 2774 8688`, `30-34 1991 7094`, `35-39 1206 6016`, `40-44 460 4996`, `45-49 55 4038`): the TFR becomes **6.03**.

## What researchers can use it for

- **Cross-check a source** against another one, as the paper does, by comparing TFR, mean age and the shape of the ASFR curve rather than a single number.
- **Spot where two sources part ways**, such as the teen and late-forties rates here, with the table of rates in the tool.
- **Teach the TFR**: it adds up five-year rates, so a small group with few births, like the farm sample, gives a wide interval.
- **Turn counts into replacement terms** with GRR and NRR, to say how many daughters a woman would have.
- **Plan a sample**: the binomial error shows how many women a survey needs before a TFR is pinned to within 0.1.

## The fine print

- We used only Table 1's counts of women and of women with a birth. The paper's own TFRs for each group are in graphs, so our table is a recomputation, not a copy of its numbers. Differences to the paper's pooled, weighted figures are expected.
- Pooling 2000 to 2021 mixes years; the result is an average period rate, not a forecast of what any woman will have.
- The ACS groups are defined by home language and phone use, so they are not a list of Amish people; the paper discusses how well that works. We make no claim about any family.
- Our intervals ignore survey weights and clustering, so they are narrower than a design-based interval would be.
- Marital fertility and the Coale and Trussell *m* analysis in the paper need data that Table 1 does not give, so we did not check them.
