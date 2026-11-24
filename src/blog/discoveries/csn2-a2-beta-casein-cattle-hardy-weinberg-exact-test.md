---
title: "CSN2 A1 and A2 in three cattle breeds, re-tested for Hardy-Weinberg"
summary: "A 2026 study genotyped 898 cows for the A1 and A2 forms of beta-casein. We rebuild every allele frequency, exact Hardy-Weinberg p-value and pairwise chi-square from the published counts, and all of them land on the paper's numbers."
tools: [hardy-weinberg-tester, crosstab-chi-square, punnett-square, mendelian-chi-square]
updated: 2026-11-24
sources:
  - "Radkowska, I., Ropka-Molik, K., Rubiś, D. and Szumiec, A. (2026), Comparison of CSN2 A1 and A2 Allele and Genotype Frequencies in Simmental, Polish Red, and Polish Black-and-White Cattle, Genes 17(11): 1387, doi:10.3390/genes17111387. Licence CC BY (Creative Commons Attribution), checked on the MDPI article page, 2026-11-24. Values used here: 568 Simmental (101 A1A1, 299 A1A2, 168 A2A2), 273 Polish Red (83, 135, 55) and 57 Polish Black-and-White (27, 27, 3); allele frequencies A1 44.1 / 55.1 / 71.1 % and A2 55.9 / 44.9 / 28.9 %; exact Hardy-Weinberg p-values 0.125, 1.000 and 0.345; pairwise genotype comparisons chi-square 19.973, 33.611 and 10.056 on 2 degrees of freedom; samples came from routine parentage testing."
  - "Methods behind the maths: Hardy, G. H. (1908) and Weinberg, W. (1908); exact test from Wigginton, J. E., Cutler, D. J. and Abecasis, G. R. (2005), Am. J. Hum. Genet. 76: 887-893; F-statistics from Weir, B. S. and Cockerham, C. C. (1984), Evolution 38: 1358, and Nei, M. (1977), Ann. Hum. Genet. 41: 225."
paper:
  title: "Comparison of CSN2 A1 and A2 Allele and Genotype Frequencies in Simmental, Polish Red, and Polish Black-and-White Cattle"
  authors: "Radkowska I, Ropka-Molik K, Rubiś D, Szumiec A"
  journal: "Genes"
  year: 2026
  doi: "10.3390/genes17111387"
  url: "https://www.mdpi.com/2073-4425/17/11/1387"
  licence: "CC BY"
  reviewed: true
---

Beta-casein is the second most common protein in cow's milk, and the gene that makes it, *CSN2*, comes in two widespread forms. The A2 form is the older one; A1 differs by a single amino acid at position 67 and is digested a little differently, which is why "A2 milk" is sold as a separate product. A 2026 paper in *Genes* genotyped 898 cows from three breeds kept in Poland and compared how common each form is. Every number in that comparison is a textbook population-genetics calculation, and the [[hardy-weinberg-tester]] does all of them in a browser. The breed-to-breed comparison is a 2 × 3 contingency table, which is the [[crosstab-chi-square]] tool's job; to work out what a mating will give, use the [[punnett-square]], and for a cross whose ratio you want to test, the [[mendelian-chi-square]].

## The paper in brief

The authors typed the two *CSN2* variants in 568 Simmental, 273 Polish Red and 57 Polish Black-and-White cattle. The samples were left over from routine parentage testing, so they are a convenience sample of each population rather than a designed survey, a limit the authors state themselves.

Their headline is that the breeds differ clearly. Simmental carried the most A2 (55.9 % of gene copies), Polish Red less (44.9 %) and Polish Black-and-White least (28.9 %), with only three A2A2 animals in that last group. All three samples sat within Hardy-Weinberg expectations, and all three pairwise comparisons of the genotype distributions were significant. Their practical point: a herd that wants to sell A2 milk can get there by selecting A2A2 bulls and cows, and which breed you start from changes how long that takes.

**Hardy-Weinberg equilibrium** is the baseline this rests on. If a population mates at random, with no selection, migration, mutation or drift at the locus, then for an allele at frequency *p* the three genotype frequencies must be *p*², 2*p*(1 − *p*) and (1 − *p*)². A sample that departs from those proportions is telling you something: inbreeding, hidden population structure, selection, or a genotyping problem.

## Checked with the tools

Everything below is a **recomputation from the genotype counts printed in the paper**. No simulation, no fitting.

**Step 1: allele frequencies, heterozygosity and the exact test.** The tool reads three counts and returns the lot.

| Breed | Counts (A1A1 / A1A2 / A2A2) | Paper: A1, A2 | Tool: A1, A2 | Paper: exact p | Tool: exact p |
|---|---|---|---|---|---|
| Simmental | 101 / 299 / 168 | 44.1 %, 55.9 % | **0.4410, 0.5590** | 0.125 | **0.1254** |
| Polish Red | 83 / 135 / 55 | 55.1 %, 44.9 % | **0.5513, 0.4487** | 1.000 | **1.0000** |
| Polish Black-and-White | 27 / 27 / 3 | 71.1 %, 28.9 % | **0.7105, 0.2895** | 0.345 | **0.3452** |

Three exact p-values to three decimal places, from counts alone. The tool adds what the paper does not print:

| Breed | Expected A1A1 / A1A2 / A2A2 | Observed Ho | Expected He | F | Chi-square (1 df) |
|---|---|---|---|---|---|
| Simmental | 110.48 / 280.05 / 177.48 | 0.5264 | 0.4930 | **−0.0677** | 2.601, p = 0.107 |
| Polish Red | 82.97 / 135.06 / 54.97 | 0.4945 | 0.4947 | **+0.0005** | 0.0001, p = 0.994 |
| Polish Black-and-White | 28.78 / 23.45 / 4.78 | 0.4737 | 0.4114 | **−0.1515** | 1.309, p = 0.253 |

Two things stand out. First, every departure is in the same direction: **more heterozygotes than expected**, not fewer (F is negative). For Simmental the one-sided exact test for an excess gives p = 0.066 — not significant, but the clearest signal in the data, and in a breed with 568 animals it would be worth a second look in a larger sample. Polish Red is almost eerily perfect: 135 heterozygotes observed against 135.06 expected.

Second, the Polish Black-and-White group's smallest expected count is **4.78**, just under the usual threshold of 5, so the tool warns that its chi-square p-value is unreliable and the exact test is the one to quote. The paper used an exact test, which was the right call.

**Step 2: why neither small sample rejects.** The exact test works from the full probability distribution of heterozygote counts, given the allele counts. Figure 1 draws it. The Simmental curve is narrow, so 52.6 % heterozygotes is a mild surprise; the Polish Black-and-White curve is wide, so 47.4 % against an expected 41.1 % is no surprise at all.

<!-- fig:dist -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Two probability distributions of the heterozygote count under Hardy-Weinberg, one narrow for the 568 Simmental cows and one broad for the 57 Polish Black-and-White cows, with the observed shares marked." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Every heterozygote count Hardy-Weinberg allows</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Every heterozygote count Hardy-Weinberg allows</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="169.5" y2="169.5" style="stroke:var(--line)"/><text x="52" y="173.5" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="97" y2="97" style="stroke:var(--line)"/><text x="52" y="101" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="139.3" x2="139.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="139.3" y="259" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="220.7" x2="220.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="220.7" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="383.3" x2="383.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="383.3" y="259" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="464.7" x2="464.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="464.7" y="259" text-anchor="middle" style="fill:var(--muted)">70</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">A1A2 heterozygotes (% of the herd sampled)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Probability</text><line x1="323.5" x2="323.5" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="327.5" y="62" text-anchor="start" style="fill:var(--muted)">52.6 % seen</text><line x1="280.6" x2="280.6" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="276.6" y="80" text-anchor="end" style="fill:var(--muted)">47.4 % seen</text><path d="M60 242L62.9 242L65.7 242L68.6 242L71.5 242L74.3 242L77.2 242L80.1 242L82.9 242L85.8 242L88.6 242L91.5 242L94.4 242L97.2 242L100.1 242L103 242L105.8 242L108.7 242L111.6 242L114.4 242L117.3 242L120.1 242L123 242L125.9 242L128.7 242L131.6 242L134.5 242L137.3 242L140.2 242L143.1 242L145.9 242L148.8 242L151.6 242L154.5 242L157.4 242L160.2 242L163.1 242L166 242L168.8 242L171.7 242L174.6 242L177.4 242L180.3 242L183.2 242L186 242L188.9 242L191.7 242L194.6 242L197.5 242L200.3 242L203.2 242L206.1 242L208.9 242L211.8 242L214.7 242L217.5 242L220.4 242L223.2 242L226.1 242L229 242L231.8 242L234.7 241.9L237.6 241.9L240.4 241.8L243.3 241.7L246.2 241.5L249 241.1L251.9 240.6L254.7 239.8L257.6 238.7L260.5 237.1L263.3 235.1L266.2 232.5L269.1 229.2L271.9 225.3L274.8 220.9L277.7 216.1L280.5 211L283.4 206L286.2 201.5L289.1 197.6L292 194.7L294.8 193.1L297.7 192.9L300.6 194.1L303.4 196.6L306.3 200.2L309.2 204.6L312 209.5L314.9 214.5L317.8 219.5L320.6 224.1L323.5 228.1L326.3 231.6L329.2 234.4L332.1 236.6L334.9 238.3L337.8 239.5L340.7 240.4L343.5 241L346.4 241.4L349.3 241.6L352.1 241.8L355 241.9L357.8 241.9L360.7 242L363.6 242L366.4 242L369.3 242L372.2 242L375 242L377.9 242L380.8 242L383.6 242L386.5 242L389.3 242L392.2 242L395.1 242L397.9 242L400.8 242L403.7 242L406.5 242L409.4 242L412.3 242L415.1 242L418 242L420.8 242L423.7 242L426.6 242L429.4 242L432.3 242L435.2 242L438 242L440.9 242L443.8 242L446.6 242L449.5 242L452.4 242L455.2 242L458.1 242L460.9 242L463.8 242L466.7 242L469.5 242L472.4 242L475.3 242L478.1 242L481 242L483.9 242L486.7 242L489.6 242L492.4 242L495.3 242L498.2 242L501 242L503.9 242L506.8 242L509.6 242L512.5 242L515.4 242L518.2 242L521.1 242L523.9 242L526.8 242L529.7 242L532.5 242L535.4 242L538.3 242L541.1 242L544 242" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M80.8 241.3L109.4 237.4L137.9 221.8L166.4 181.5L195 117.1L223.5 64.2L252.1 70.1L280.6 132.3L309.1 198.2L337.7 232.2L366.2 241.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Simmental (n = 568)</text><line x1="220.8" x2="232.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="236.8" y="40" style="fill:var(--muted)">Polish Black-and-White (n = 57)</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The exact test in one picture: given each breed’s allele counts, how likely every possible heterozygote count is under Hardy-Weinberg. Built with the Hardy-Weinberg tester’s own `hweExact`. The dashed lines are the shares the paper reports; both sit inside the bulk of their curve, which is why neither test rejects.</figcaption></figure>
<!-- /fig:dist -->

**Step 3: the breed comparisons.** The paper's pairwise tests are Pearson chi-squares on 2 × 3 tables of genotype counts. Rebuilt from the counts with the cross-tab maths:

| Pair | Paper chi-square | Tool chi-square | df | Tool p | Cramer's V |
|---|---|---|---|---|---|
| Simmental vs Polish Red | 19.973 | **19.973** | 2 | 0.000046 | 0.154 |
| Simmental vs Polish Black-and-White | 33.611 | **33.611** | 2 | 0.00000005 | 0.232 |
| Polish Red vs Polish Black-and-White | 10.056 | **10.056** | 2 | 0.0066 | 0.175 |

All three match to three decimal places. Cramer's V, which the paper does not give, says how big the differences are rather than how certain: 0.15 to 0.23 is a modest effect, real but not dramatic.

**Step 4: the three breeds as one population.** The tool's F-statistics put numbers on the spread. Weir and Cockerham's estimator gives **F<sub>ST</sub> = 0.0426** (Nei's heterozygosity version, 0.0499), so about 4 to 5 % of the genetic variation at this locus sits between breeds rather than within them. That is the quantitative version of the paper's conclusion.

A nice side effect: pooling populations with different allele frequencies normally creates a heterozygote shortfall (the **Wahlund effect**). Here the pooled sample is 211 / 461 / 226, with an observed heterozygosity of 0.5134 against 0.4999 expected and an exact p of 0.463. The shortfall F<sub>ST</sub> of 0.043 would predict is cancelled out by the heterozygote excess inside each breed. Pooling and then testing would have hidden both effects.

**Step 5: what a sample this size can show.** Figure 2 turns the exact test around: for an A1 frequency of 0.441, how many animals would you have to genotype before a real heterozygote deficit showed up at the 5 % level?

| True F | Animals needed (one-sided exact test) |
|---|---|
| 0.05 | 1,124 |
| 0.075 | 514 |
| 0.10 | 294 |
| 0.15 | 130 |
| 0.20 | 82 |
| 0.30 | 36 |

So the 568 Simmental could have revealed an F of about 0.07 and up, while the 57 Polish Black-and-White could only have revealed an F above roughly 0.2. "In Hardy-Weinberg equilibrium" means very different things in those two samples.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="A falling curve: with F of 0.05 well over a thousand animals are needed, with F of 0.1 about three hundred, and with F of 0.2 under a hundred." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Animals needed to prove a heterozygote deficit</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Animals needed to prove a heterozygote deficit</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--line)"/><text x="52" y="228" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="164" y2="164" style="stroke:var(--line)"/><text x="52" y="168" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="104" y2="104" style="stroke:var(--line)"/><text x="52" y="108" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="44" y2="44" style="stroke:var(--line)"/><text x="52" y="48" text-anchor="end" style="fill:var(--muted)">1.5e+3</text><line x1="58" x2="58" y1="224" y2="228" style="stroke:var(--muted)"/><text x="58" y="241" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="215.4" x2="215.4" y1="224" y2="228" style="stroke:var(--muted)"/><text x="215.4" y="241" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="372.8" x2="372.8" y1="224" y2="228" style="stroke:var(--muted)"/><text x="372.8" y="241" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="530.3" x2="530.3" y1="224" y2="228" style="stroke:var(--muted)"/><text x="530.3" y="241" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">True inbreeding coefficient F at the locus</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Animals to genotype</text><line x1="58" x2="546" y1="155.8" y2="155.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="150.8" text-anchor="end" style="fill:var(--muted)">568 Simmental</text><line x1="58" x2="546" y1="217.2" y2="217.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="212.2" text-anchor="end" style="fill:var(--muted)">57 Polish Black-and-White</text><path d="M105.2 -143.2L113.1 -46.5L121 14.7L128.8 57.2L136.7 89.1L144.6 112.9L152.5 130.4L160.3 142.4L168.2 153L176.1 162.3L183.9 171L191.8 176L199.7 180.6L207.5 184.9L215.4 188.7L223.3 192.3L231.2 195.4L239 196.6L246.9 199.3L254.8 200.2L262.6 202.9L270.5 203.4L278.4 205.8L286.3 206.2L294.1 208.4L302 208.9L309.9 209.1L317.7 209.6L325.6 211.3L333.5 211.8L341.4 212L349.2 213.2L357.1 213.7L365 213.9L372.8 214.2L380.7 214.4L388.6 215.8L396.5 215.8L404.3 216.1L412.2 216.3L420.1 216.3L427.9 216.6L435.8 216.8L443.7 216.8L451.5 218L459.4 218L467.3 218L475.2 218.2L483 218.2L490.9 218.5L498.8 218.5L506.6 218.5L514.5 218.7L522.4 218.7L530.3 219.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="262" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. For a locus with an A1 frequency of 0.441, the smallest sample whose one-sided exact test would show a true heterozygote deficit F at the 5 % level. Computed with the same exact test; the genotype counts behind each point are ours, not the paper’s.</figcaption></figure>
<!-- /fig:power -->

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/csn2-a2-beta-casein-cattle-hardy-weinberg-exact-test.mjs` in fibub's public code. It calls `popStats`, `hweExact`, `hweExactSides`, `weirCockerham`, `neiF` and `pooled` from `src/lib/sci/hwefst.ts`, the maths behind the [[hardy-weinberg-tester]], and `crosstab` from `src/lib/sci/crosstab.ts`, the maths behind the [[crosstab-chi-square]] tool.

The nine genotype counts are the paper's and are the only input to Steps 1 to 4. For Figure 2 we built genotype counts ourselves from an allele frequency of 0.441 and a chosen F (observed heterozygosity = expected × (1 − F), rounded to whole animals); those counts are **our construction**, not the paper's data.

## How we test the maths

`tests/sci.mjs` runs `tests/sci-tools/hardy-weinberg-tester.mjs` on every change to fibub. It pins:

- The two-sided and one-sided exact p-values against a full enumeration done with exact fractions in Python, so no rounding slips in.
- The Yates-corrected chi-square against NumPy and `scipy.stats.chi2`.
- A three-allele chi-square with its expected heterozygosity and F against an independent NumPy calculation.
- New with this article: the three published breeds, pinned to allele frequencies 0.4410, 0.5513 and 0.7105 and exact p-values 0.12542, 1 and 0.34522, and a Weir-Cockerham F<sub>ST</sub> of 0.042640 across them.

## Check it yourself

On the [[hardy-weinberg-tester]] page, with **Two alleles** selected:

1. Put **A1, A2** in *Allele names*. The three count boxes relabel themselves to *A1A1*, *A1A2* and *A2A2*.
2. For Simmental, type **101**, **299** and **168**. Leave *Continuity correction (Yates)* unticked.
3. The headline reads **Exact p = 0.125: consistent with Hardy-Weinberg**. The facts list gives *p (A1)* **0.441**, *q (A2)* **0.559**, *Observed heterozygosity Ho* **0.5264**, *Expected heterozygosity He* **0.493**, *Inbreeding coefficient F* **−0.06767** marked as a heterozygote excess, *Chi-square* **2.601, p = 0.107**, and the one-sided exact tests **p = 0.953** for too few heterozygotes and **p = 0.0657** for too many.
4. The table below shows expected counts **110.5**, **280** and **177.5**, and the de Finetti diagram puts the sample inside the Hardy-Weinberg curve.
5. Now type **27**, **27** and **3** for Polish Black-and-White: **Exact p = 0.345**, F **−0.1515**, and a note that an expected count is below 5 (**4.776**), so the chi-square p-value is unreliable.
6. Finally **83**, **135**, **55** for Polish Red: **Exact p = 1.00**, F **0.0004746**. A perfect fit looks like this.

For Step 3, on the [[crosstab-chi-square]] tool, enter the two breeds' three genotype counts as a 2 × 3 table of counts; the Simmental and Polish Red pair gives chi-square **19.97** on 2 degrees of freedom.

## What researchers can use it for

- **Check a paper's Hardy-Weinberg table** before you build on it: the counts are usually printed, and a p-value that does not follow from them is a red flag.
- **Decide between chi-square and the exact test** by the smallest expected count, which the tool shows you, rather than by habit.
- **Separate direction from significance**: F tells you whether heterozygotes are in excess or short, which the p-value alone never does.
- **Plan a genotyping run** with Figure 2's logic: pick the F you would care about, then the sample size that can show it.
- **Watch for the Wahlund effect** when samples from several herds or breeds are pooled, by testing each group separately and then the pool.

## The fine print

- The samples came from routine parentage testing in unequal numbers per herd, so they describe the animals sampled, not whole breeds.
- The 57 Polish Black-and-White animals are too few for strong statements about that population; three A2A2 cows is three.
- F<sub>ST</sub> here is from **one locus**, so it is a property of *CSN2* in these samples, not a measure of overall breed divergence.
- Hardy-Weinberg can be satisfied by a population that is not actually in equilibrium: the test is weak, as Figure 2 shows.
- A1 and A2 beta-casein are an active area of nutrition research. Nothing here is dietary or health advice.
