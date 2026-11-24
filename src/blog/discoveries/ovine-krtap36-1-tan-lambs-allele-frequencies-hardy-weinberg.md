---
title: "A three-allele wool gene in Tan lambs: the Hardy-Weinberg test rebuilt"
summary: "A 2025 study types 246 Chinese Tan lambs at the KRTAP36-1 gene. From its genotype counts alone, fibub's allele frequency calculator reproduces every frequency and the published Hardy-Weinberg p value of 0.886."
tools: [allele-frequency-calculator, hardy-weinberg-tester, wright-fisher-simulator, effective-population-size]
updated: 2026-11-24
sources:
  - "Bai, L., Zhou, H., Tao, J., Yang, G. and Hickford, J. G. H. (2025), Characterisation of the Ovine KRTAP36-1 Gene in Chinese Tan Lambs and Its Impact on Selected Wool Traits, Animals 15(15): 2265, doi:10.3390/ani15152265. Licence CC BY 4.0, checked on the Crossref record and the MDPI article page, 2026-11-24 (the page metadata still carries the older CC BY 3.0 notice); no correction or retraction notice. Values used here: 246 single-born Tan lambs (127 males, 119 females) from ten sire lines; three alleles A, B and C; genotype counts A/A 5, A/B 17, A/C 34, B/B 22, B/C 82, C/C 86; reported allele frequencies 12.4 %, 29.1 % and 58.5 %; Hardy-Weinberg p = 0.886 with no statistic given; fine-wool mean fibre curvature 64.4 ± 1.12 against 61.2 ± 1.70 degrees per mm with and without allele C, p = 0.041."
  - "Methods only, no tables copied: Hardy-Weinberg exact test from Wigginton, D. J. Cutler and G. R. Abecasis (2005), American Journal of Human Genetics 76: 887-893; F-statistics from Weir, B. S. and Cockerham, C. C. (1984), Evolution 38: 1358-1370, and Nei, M. (1977), Annals of Human Genetics 41: 225-233."
paper:
  title: "Characterisation of the Ovine KRTAP36-1 Gene in Chinese Tan Lambs and Its Impact on Selected Wool Traits"
  authors: "Bai L, Zhou H, Tao J, Yang G, Hickford JGH"
  journal: "Animals"
  year: 2025
  doi: "10.3390/ani15152265"
  url: "https://www.mdpi.com/2076-2615/15/15/2265"
  licence: "CC BY 4.0"
  reviewed: true
---

A genotype table is the most reusable thing in a genetics paper: from six counts you can rebuild the allele frequencies, the Hardy-Weinberg test, the heterozygosity and the size of effect the study could ever have detected. A 2025 paper in *Animals* typed 246 Chinese Tan lambs at **KRTAP36-1**, a keratin-associated protein gene that helps build the wool fibre, found three alleles and reported that they sat in Hardy-Weinberg equilibrium with p = 0.886. This article rebuilds all of that from the counts with the [[allele-frequency-calculator]], and shows what the numbers say that the paper does not. For a single locus in one flock see also the [[hardy-weinberg-tester]], and for what frequencies do over generations, the [[wright-fisher-simulator]].

## The paper in brief

Keratin-associated proteins (KAPs) are the glue of the wool fibre: they cross-link the keratin filaments, and variation in their genes shows up as differences in fibre diameter and crimp. The authors genotyped 246 single-born Tan lambs (127 males, 119 females) from ten recorded sire lines, found the three previously described KRTAP36-1 alleles **A**, **B** and **C**, and measured four wool traits in both the fine wool and the coarse heterotypic hairs: mean fibre diameter, its standard deviation, its coefficient of variation and mean fibre curvature.

The headline result is modest and honestly reported: of all the comparisons, only one reached significance. Lambs carrying allele **C** had a higher fine-wool mean fibre curvature, 64.4 ± 1.12 against 61.2 ± 1.70 degrees per mm, p = 0.041, with two further trends (allele B with the coefficient of variation, p = 0.088; allele C with heterotypic-hair diameter standard deviation, p = 0.070). The genotype counts are given in full, and the alleles are stated to be in Hardy-Weinberg equilibrium at p = 0.886, without a test statistic.

## Checked with the tools

Everything below is a **recomputation from the paper's six genotype counts**. No simulation, and no data table is reproduced: the counts are facts, listed in `sources:`.

**Step 1: the allele frequencies.** From 246 animals there are 492 gene copies. Counting them gives 61 A, 143 B and 288 C, so **A 12.40 %, B 29.07 %, C 58.54 %**, against the paper's 12.4 %, 29.1 % and 58.5 %. That is an exact match, which also tells you the published frequencies were computed from these counts and not from a separate assay.

**Step 2: the Hardy-Weinberg test, with three alleles.** With k alleles there are k(k+1)/2 genotypes and k(k−1)/2 degrees of freedom, so here 6 genotypes and **3 degrees of freedom**. The expected counts follow from the frequencies, and the chi-square comes to **0.645**, which on 3 degrees of freedom gives **p = 0.886** — the paper's value exactly. The missing statistic is χ² = 0.645, and the test used was the chi-square, not an exact test. Figure 1 shows how close observed and expected are.

| Genotype | Observed | Expected under Hardy-Weinberg | Contribution to χ² |
|---|---|---|---|
| A/A | 5 | 3.8 | 0.39 |
| A/B | 17 | 17.7 | 0.03 |
| A/C | 34 | 35.7 | 0.08 |
| B/B | 22 | 20.8 | 0.07 |
| B/C | 82 | 83.7 | 0.03 |
| C/C | 86 | 84.3 | 0.03 |

<!-- fig:counts -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Observed and expected genotype counts for the three KRTAP36-1 alleles: the largest gap is A/A, 5 against 3.8, and the whole table gives a chi-square of 0.645 on 3 degrees of freedom." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>KRTAP36-1 in 246 Tan lambs: observed against expected</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">KRTAP36-1 in 246 Tan lambs: observed against expected</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.6" y2="201.6" style="stroke:var(--line)"/><text x="52" y="205.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="161.2" y2="161.2" style="stroke:var(--line)"/><text x="52" y="165.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="120.7" y2="120.7" style="stroke:var(--line)"/><text x="52" y="124.7" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">80</text><line x1="98.7" x2="98.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="98.7" y="259" text-anchor="middle" style="fill:var(--muted)">A/A</text><line x1="180" x2="180" y1="242" y2="246" style="stroke:var(--muted)"/><text x="180" y="259" text-anchor="middle" style="fill:var(--muted)">A/B</text><line x1="261.3" x2="261.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="261.3" y="259" text-anchor="middle" style="fill:var(--muted)">A/C</text><line x1="342.7" x2="342.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="342.7" y="259" text-anchor="middle" style="fill:var(--muted)">B/B</text><line x1="424" x2="424" y1="242" y2="246" style="stroke:var(--muted)"/><text x="424" y="259" text-anchor="middle" style="fill:var(--muted)">B/C</text><line x1="505.3" x2="505.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="505.3" y="259" text-anchor="middle" style="fill:var(--muted)">C/C</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Genotype</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Lambs</text><circle cx="98.7" cy="231.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="207.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="261.3" cy="173.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="342.7" cy="197.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="76.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="68.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="98.7" cy="234.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="180" cy="206.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="261.3" cy="169.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="342.7" cy="200" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="424" cy="72.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="71.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Observed</text><circle cx="146.6" cy="36" r="4" style="fill:var(--c-tools)"/><text x="157.6" y="40" style="fill:var(--muted)">Expected under Hardy-Weinberg</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper’s six genotype counts against the counts Hardy-Weinberg predicts from the allele frequencies, worked out by the Allele frequency calculator’s maths. The two sets differ by at most 1.7 animals except for A/A, the rarest class.</figcaption></figure>
<!-- /fig:counts -->

One caution the paper does not give: the smallest expected count is **3.78** (A/A), below the usual threshold of 5 for a chi-square, so the p value is an approximation. It is nowhere near 0.05, so nothing changes here, but with a rarer allele it would matter, and the tool says so on the page.

**Step 3: heterozygosity, which the paper leaves out.** Observed heterozygosity is 133 of 246 animals, **Ho = 0.5407**; expected is 1 − Σp² = **He = 0.5575**; so **F = 1 − Ho/He = 0.030**, a heterozygote shortfall of 3 %. For a flock sampled across ten sire lines that is reassuringly small, and it is the number a breeder would want to watch over time with the [[effective-population-size]] tool.

**Step 4: the allele-presence design, checked.** The paper compares trait means between lambs that carry an allele and lambs that do not, so each test is really a two-allele problem: C against everything else. Recoded that way, C/C = 86, C with another allele = 116 and no C = 44, which the two-allele page handles directly: p(C) = 0.5854, expected 84.3 / 119.4 / 42.3, Ho 0.4715 against He 0.4854, **FIS = 0.0286**, chi-square 0.20 (p = 0.654) and an exact-test p of **0.694**. Two useful consequences:

- The trait comparison groups are **202 carriers against 44 non-carriers**, and Hardy-Weinberg predicts that split from the allele frequency alone: 1 − (1 − 0.5854)² = 82.8 % carriers, or 203.7 of 246. The design's unbalanced groups are not an accident of sampling, they are what an allele at 59 % must give.
- Recoding to "allele present" throws away the difference between one copy and two. Grouping A/A with A/B hides any dominance, which is worth stating when only one of eight comparisons is significant.

**Step 5: what deviation could this study have seen?** Figure 2 keeps the three allele frequencies and the sample size fixed and pushes a homozygote excess into the counts, step by step. The chi-square only crosses p = 0.05 once F reaches about **0.13**. So "in Hardy-Weinberg equilibrium" here means "no inbreeding coefficient above roughly 0.13 was detectable", not "F = 0". With 246 animals and one locus, that is the honest reading.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="The chi-square p value falls below 0.05 only once the inbreeding coefficient reaches about 0.13, far above the observed 0.030." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How big a homozygote excess this sample could see</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How big a homozygote excess this sample could see</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--line)"/><text x="52" y="218" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="177.6" y2="177.6" style="stroke:var(--line)"/><text x="52" y="181.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="141.2" y2="141.2" style="stroke:var(--line)"/><text x="52" y="145.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="104.8" y2="104.8" style="stroke:var(--line)"/><text x="52" y="108.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="68.4" y2="68.4" style="stroke:var(--line)"/><text x="52" y="72.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="214" y2="218" style="stroke:var(--muted)"/><text x="58" y="231" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="139.3" y="231" text-anchor="middle" style="fill:var(--muted)">0.05</text><line x1="220.7" x2="220.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="220.7" y="231" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">0.15</text><line x1="383.3" x2="383.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="383.3" y="231" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="464.7" x2="464.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="464.7" y="231" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="546" x2="546" y1="214" y2="218" style="stroke:var(--muted)"/><text x="546" y="231" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">Inbreeding coefficient F pushed into the counts</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Chi-square p value</text><line x1="58" x2="546" y1="204.9" y2="204.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="199.9" text-anchor="end" style="fill:var(--muted)">p = 0.05</text><line x1="107.1" x2="107.1" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="111.1" y="44" text-anchor="start" style="fill:var(--muted)">observed F 0.030</text><line x1="269.5" x2="269.5" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="273.5" y="60" text-anchor="start" style="fill:var(--muted)">detectable from F ≈ 0.13</text><path d="M58 32L66.1 32.1L74.3 32.5L82.4 33.7L90.5 36L98.7 39.5L106.8 44.5L114.9 51L123.1 58.8L131.2 68L139.3 78.3L147.5 89.3L155.6 100.9L163.7 112.8L171.9 124.5L180 135.9L188.1 146.8L196.3 156.9L204.4 166.1L212.5 174.4L220.7 181.6L228.8 187.9L236.9 193.3L245.1 197.7L253.2 201.4L261.3 204.4L269.5 206.7L277.6 208.6L285.7 210L293.9 211.1L302 211.9L310.1 212.5L318.3 213L326.4 213.3L334.5 213.5L342.7 213.7L350.8 213.8L358.9 213.9L367.1 213.9L375.2 213.9L383.3 214L391.5 214L399.6 214L407.7 214L415.9 214L424 214L432.1 214L440.3 214L448.4 214L456.5 214L464.7 214L472.8 214L480.9 214L489.1 214L497.2 214L505.3 214L513.5 214L521.6 214L529.7 214L537.9 214L546 214" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="252" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Our own construction: keeping the allele frequencies and the 246 animals fixed, a homozygote excess F is pushed into the counts and the same chi-square is rerun. The test only notices F above about 0.13.</figcaption></figure>
<!-- /fig:power -->

| Check | Paper | Our tool result |
|---|---|---|
| Allele frequencies A / B / C | 12.4 / 29.1 / 58.5 % | 12.40 / 29.07 / 58.54 % |
| Hardy-Weinberg p | 0.886 | 0.886 (χ² = 0.645, 3 df) |
| Observed / expected heterozygosity | not reported | 0.5407 / 0.5575, F = 0.030 |
| C carriers against non-carriers | 202 against 44 | 203.7 expected from p(C) alone |
| Deviation detectable at p < 0.05 | not reported | about F = 0.13 |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/ovine-krtap36-1-tan-lambs-allele-frequencies-hardy-weinberg.mjs` in fibub's public code. It calls `hweMulti` (the chi-square for any number of alleles, with its expected counts, Ho, He and F) and `popStats` (the two-allele frequencies, expected counts, FIS, chi-square and exact test) from `src/lib/sci/hwefst.ts`, the maths behind the [[allele-frequency-calculator]].

The only inputs are the paper's six genotype counts and its stated sample size. The homozygote-excess curve in Figure 2 is **our construction**: it takes the observed allele frequencies and n, inflates the three homozygote classes by F p(1 − p) and shrinks the heterozygotes by (1 − F), and then runs the same chi-square on those expected counts. It is the deviation the test would just notice, not a sampling simulation, so it has no random scatter.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/allele-frequency-calculator.mjs`, which pins this maths against independent implementations:

- Eight exact-test p values against a full enumeration in Python with exact fractions, from the easy (10/40/50 giving 0.6368) to the extreme (57/14/50 giving 5.56 × 10⁻¹⁹).
- The chi-square for 30/5/15 must be 30.4371 with p = 3.449 × 10⁻⁸ (scipy), and FIS must be 1 − 0.1/0.455.
- Weir and Cockerham's FST, FIS and FIT for three populations against scikit-allel 1.3.13 (FST = 0.123989), and Nei's against an independent numpy calculation, with (1 − FIT) = (1 − FIS)(1 − FST) holding exactly.
- New with this article: the KRTAP36-1 counts must give allele frequencies 0.123984, 0.290650 and 0.585366, chi-square 0.6451 on 3 degrees of freedom, p = 0.8860, Ho 0.54065, He 0.55750 and a smallest expected count of 3.7815; recoded as C against the rest they must give FIS 0.028595 and an exact-test p of 0.69358.

## Check it yourself

On the [[allele-frequency-calculator]], in the *Genotype counts* card:

1. Clear the example box and paste these three lines, one per recoded allele (tab or comma between the columns):
   `C vs rest, 86, 116, 44`
   `B vs rest, 22, 99, 125`
   `A vs rest, 5, 51, 190`
2. Set *Allele names* to **C, rest** if you like; only the labels change.
3. *Each population* now reads, for the C row, n 246, p 0.5854, expected 84.3 / 119.4 / 42.3, **Ho 0.4715**, He 0.4854, **FIS 0.0286**, chi-square **0.201** (p 0.654) and exact p **0.694**. The B row gives FIS 0.024 and exact p 0.757; the A row FIS 0.046, exact p 0.552, and a warning that an expected count is 3.78, so the exact test is the one to report.
4. Ignore the F-statistics block on this run: the three rows are recodings of one locus in one flock, not three populations, so FST between them is meaningless.
5. To see the real thing, put a second flock in as a second row and the FST, FIS and FIT appear with either Weir and Cockerham or Nei.

The page is built for one gene with two alleles, so the full three-allele chi-square in Figure 1 comes from the same library function (`hweMulti`) through our script rather than from the page.

## What researchers can use it for

- **Check a published Hardy-Weinberg claim** in a minute from the genotype counts, and recover the statistic and degrees of freedom when the paper gives only a p value.
- **Report Ho, He and FIS** alongside the test; they say more about a flock or population than the p value, and they cost nothing once the counts are typed.
- **See whether your sample could detect anything**: push a known deviation into the counts, as in Figure 2, before you call a locus "in equilibrium".
- **Plan an allele-presence association study**: Hardy-Weinberg tells you the group sizes you will get from the allele frequency, so you know in advance how unbalanced the comparison will be.
- **Compare flocks or breeds** with FST from Weir and Cockerham, and watch drift in a closed flock with the [[wright-fisher-simulator]].

## The fine print

- The chi-square here has 3 degrees of freedom because three alleles make six genotypes; a two-allele locus has 1. Mixing those up is the commonest error in reported Hardy-Weinberg tests.
- One expected count (A/A, 3.78) is below 5, so the three-allele p value is approximate. The two-allele recodings have an exact test, and it agrees.
- Hardy-Weinberg equilibrium is a weak test. Passing it does not show random mating, no selection and no structure; it shows that none of them left a mark big enough to see at this sample size.
- The lambs come from ten sire lines, so they are not an unrelated sample. Relatedness tends to raise F, and the small positive F of 0.030 is consistent with that.
- The association result (allele C with fine-wool curvature, p = 0.041) is the paper's, not ours: we recomputed only the frequencies, the equilibrium test and the heterozygosities.
