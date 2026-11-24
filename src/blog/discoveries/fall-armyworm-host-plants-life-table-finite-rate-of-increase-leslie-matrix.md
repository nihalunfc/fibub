---
title: "Fall armyworm on maize, castor, potato and wheat: life table growth rates checked"
summary: "A 2025 life-table study ranks four host plants for fall armyworm, with maize fastest at λ 1.23 per day. We rebuild each host's growth rate as a Leslie matrix in fibub's population growth tool."
tools: [population-growth-models, insect-degree-days, trap-count-index]
updated: 2026-11-24
sources:
  - "Tajdar, A., Cao, C., Jaleel, W., Zaka, S. M. and Shi, W. (2025), Spodoptera frugiperda Smith fitness on four natural hosts using a two-sex life table in a controlled setting, Frontiers in Insect Science 5: 1548497, doi:10.3389/finsc.2025.1548497. Licence CC BY 4.0, checked on the Crossref record of the Frontiers article, 2026-11-24. Values used here: net reproductive rate R0 532.8 (maize), 424.36 (castor bean), 174.94 (potato) and 94.62 (wheat) offspring per individual; finite rate of increase λ 1.23, 1.17, 1.15 and 1.12 per day; intrinsic rate r 0.21, 0.16, 0.14 and 0.11 per day; mean generation time T 30.0, 36.95, 35.17 and 39.02 days; age at the start of reproduction 29, 37, 34 and 38 days; oviposition days 6.7, 4.6, 4.1 and 3.4; fecundity 2497.1 eggs per female on maize and 675 on wheat."
  - "Leslie, P. H. (1945), On the use of matrices in certain population mathematics, Biometrika 33: 183-212; Chi, H. and Liu, H. (1985), Two new methods for the study of insect population ecology, Bulletin of the Institute of Zoology, Academia Sinica 24: 225-240 (the age-stage, two-sex life table)."
paper:
  title: "Spodoptera frugiperda Smith fitness on four natural hosts using a two-sex life table in a controlled setting"
  authors: "Tajdar A, Cao C, Jaleel W, Zaka SM, Shi W"
  journal: "Frontiers in Insect Science"
  year: 2025
  doi: "10.3389/finsc.2025.1548497"
  url: "https://www.frontiersin.org/journals/insect-science/articles/10.3389/finsc.2025.1548497/full"
  licence: "CC BY 4.0"
  reviewed: true
---

The fall armyworm, *Spodoptera frugiperda*, is a moth caterpillar from the Americas that has spread across Africa and Asia since 2016 and now eats maize on three continents. How fast it builds up depends on what it eats. A 2025 study in *Frontiers in Insect Science* reared it on four plants, castor bean, potato, maize and wheat, and summed up each with a **life table**: how long each stage lasts, how many eggs females lay and how many young survive. The headline numbers are the **finite rate of increase λ**, how many times the population multiplies each day, and the **net reproductive rate R₀**, offspring per newborn over a lifetime. This article rebuilds each host's λ from a few stated values as a **Leslie matrix** in [[population-growth-models]], and shows which life-history trait drives the ranking. To turn days into field timing, count heat with [[insect-degree-days]]; to follow moths in the field, use the [[trap-count-index]].

## The paper in brief

The authors reared fall armyworm from egg to death on leaves of each host in a controlled room and analysed the records with the **age-stage, two-sex life table**, which keeps males, females and individuals that die young in one table. Maize was the best food: shorter larval and pupal stages, longer-lived adults and **2497.1 eggs per female**, against 675 on wheat. The population parameters followed:

| Host | R₀ (offspring) | λ (per day) | r (per day) | T (days) | Egg laying starts (day) |
|---|---|---|---|---|---|
| Maize | 532.8 | 1.23 | 0.21 | 30.0 | 29 |
| Castor bean | 424.36 | 1.17 | 0.16 | 36.95 | 37 |
| Potato | 174.94 | 1.15 | 0.14 | 35.17 | 34 |
| Wheat | 94.62 | 1.12 | 0.11 | 39.02 | 38 |

Here r = ln λ is the **intrinsic rate of increase** and T the **mean generation time**, defined so that e^(rT) = R₀. The authors' advice for pest management: check every host plant in an area, not just the main crop.

## Checked with the tools

**Step 1: do the four numbers agree with each other?** In this kind of life table, r = ln R₀ ÷ T exactly. For maize, ln 532.8 ÷ 30.0 gives **r = 0.2093** and λ = e^r = **1.2328**, matching the paper's 0.21 and 1.23. Castor bean gives 0.1638 and 1.1779 (paper 0.16 and 1.17) and wheat 0.1166 and 1.1237 (paper 0.11 and 1.12): close, though the stated r values look cut off rather than rounded. Potato is the odd one: its R₀ and T give **r = 0.1468 and λ = 1.1582**, while the paper reports 0.14 and 1.15. Turned round, λ = 1.15 and R₀ = 174.94 would need T = 36.95 days, not 35.17. Life-table software often reports bootstrap means, which need not fit together exactly, so this may be rounding rather than error; but it is worth knowing before anyone reuses the potato row.

**Step 2: a Leslie matrix from three facts.** A **Leslie matrix** projects a population one time step ahead, with a fecundity F for each age class (offspring at the next count) and a survival P to the next class. We built one with **one class per day of age**. **Our assumptions:** survival is folded into the fecundities, so each day's F is net offspring per newborn and the Fs add up to R₀; egg laying starts on the paper's onset day and lasts its oviposition days (rounded); and each day brings half the offspring of the day before, as egg laying in moths usually peaks early. The tool's maths then finds λ as the dominant eigenvalue.

For maize this gives **λ = 1.2345 per day**, r = 0.2107 and T = 29.80 days, against the paper's 1.23, 0.21 and 30.0. Across the four hosts the model gives 1.2345, 1.1738, 1.1606 and 1.1253 (Figure 2), the same ranking as the paper and within 0.011 of every stated λ. How the eggs are spread matters little: laying all of R₀ on the first day or spreading it evenly moves maize only between 1.2417 and 1.2197.

<!-- fig:hosts -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="Finite rate of increase per host. Paper: 1.23, 1.17, 1.15, 1.12. Leslie model with halving daily egg numbers: 1.234, 1.174, 1.161, 1.125; bars show half the spread between putting every egg on one day and spreading them evenly." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>λ per host: paper and Leslie model</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">λ per host: paper and Leslie model</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--line)"/><text x="52" y="226" text-anchor="end" style="fill:var(--muted)">1.1</text><line x1="58" x2="546" y1="168.3" y2="168.3" style="stroke:var(--line)"/><text x="52" y="172.3" text-anchor="end" style="fill:var(--muted)">1.15</text><line x1="58" x2="546" y1="114.5" y2="114.5" style="stroke:var(--line)"/><text x="52" y="118.5" text-anchor="end" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="60.8" y2="60.8" style="stroke:var(--line)"/><text x="52" y="64.8" text-anchor="end" style="fill:var(--muted)">1.25</text><line x1="119" x2="119" y1="222" y2="226" style="stroke:var(--muted)"/><text x="119" y="239" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="241" x2="241" y1="222" y2="226" style="stroke:var(--muted)"/><text x="241" y="239" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="363" x2="363" y1="222" y2="226" style="stroke:var(--muted)"/><text x="363" y="239" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="485" x2="485" y1="222" y2="226" style="stroke:var(--muted)"/><text x="485" y="239" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">1 maize · 2 castor bean · 3 potato · 4 wheat</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">λ (per day)</text><circle cx="109.2" cy="82.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="231.2" cy="146.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="353.2" cy="168.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="475.2" cy="200.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="128.8" cy="77.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="250.8" cy="142.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="372.8" cy="156.9" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="494.8" cy="194.8" r="4" style="fill:var(--c-tools);opacity:1"/><line x1="128.8" x2="128.8" y1="89.2" y2="65.6" style="stroke:var(--c-tools)"/><line x1="250.8" x2="250.8" y1="147.6" y2="137.7" style="stroke:var(--c-tools)"/><line x1="372.8" x2="372.8" y1="160.6" y2="153.1" style="stroke:var(--c-tools)"/><line x1="494.8" x2="494.8" y1="196.6" y2="193" style="stroke:var(--c-tools)"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Paper</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">Leslie model</text><text class="fibub-mark" x="546" y="260" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The paper's λ for each host beside the Leslie model built from its R₀, onset day and oviposition days. Bars: half the spread between laying every egg on one day and spreading them evenly. A recomputation from summary values, not from the paper's raw life table.</figcaption></figure>
<!-- /fig:hosts -->

**Step 3: what drives the ranking?** Castor bean gives nearly as many offspring as maize (R₀ 424 against 533) yet grows much more slowly, because its moths start laying on day 37 instead of day 29. The model makes this plain. Starting with maize, delaying egg laying by **three days** drops λ from 1.2345 to **1.2109**, about as much as **halving R₀** (1.2060). Giving maize wheat's R₀ but keeping its early start leaves λ at 1.1648; giving it wheat's late start but keeping its R₀ gives 1.1755. For an insect that lays hundreds of eggs, **when** it breeds matters about as much as **how much**, which is why the faster larval and pupal development on maize counts for so much (Figure 1).

<!-- fig:onset -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Finite rate of increase from the Leslie matrix as the start of egg laying moves from day 22 to day 44, for the maize and wheat net reproductive rates. The paper's four hosts sit near these lines: maize 1.23 at day 29, wheat 1.12 at day 38." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Fall armyworm: growth rate against the start of egg laying</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Fall armyworm: growth rate against the start of egg laying</text><line x1="58" x2="546" y1="224.5" y2="224.5" style="stroke:var(--line)"/><text x="52" y="228.5" text-anchor="end" style="fill:var(--muted)">1.1</text><line x1="58" x2="546" y1="180.9" y2="180.9" style="stroke:var(--line)"/><text x="52" y="184.9" text-anchor="end" style="fill:var(--muted)">1.15</text><line x1="58" x2="546" y1="137.3" y2="137.3" style="stroke:var(--line)"/><text x="52" y="141.3" text-anchor="end" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="93.6" y2="93.6" style="stroke:var(--line)"/><text x="52" y="97.6" text-anchor="end" style="fill:var(--muted)">1.25</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1.3</text><line x1="124.5" x2="124.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="124.5" y="259" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="235.5" x2="235.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="235.5" y="259" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="346.4" x2="346.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="346.4" y="259" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="457.3" x2="457.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="457.3" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Age when egg laying starts (days)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Finite rate of increase λ (per day)</text><path d="M58 34.6L80.2 47.9L102.4 60L124.5 71.1L146.7 81.2L168.9 90.6L191.1 99.2L213.3 107.2L235.5 114.5L257.6 121.4L279.8 127.8L302 133.8L324.2 139.4L346.4 144.6L368.5 149.6L390.7 154.3L412.9 158.7L435.1 162.8L457.3 166.8L479.5 170.5L501.6 174.1L523.8 177.4L546 180.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 116.4L80.2 125.6L102.4 133.9L124.5 141.5L146.7 148.5L168.9 155L191.1 160.9L213.3 166.4L235.5 171.6L257.6 176.4L279.8 180.8L302 185L324.2 188.9L346.4 192.6L368.5 196.1L390.7 199.3L412.9 202.5L435.1 205.4L457.3 208.1L479.5 210.8L501.6 213.3L523.8 215.7L546 218" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="213.3" cy="111.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="390.7" cy="163.5" r="4" style="fill:var(--ink);opacity:1"/><circle cx="324.2" cy="180.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="412.9" cy="207.1" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">R₀ 532.8 (maize)</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="215.2" y="40" style="fill:var(--muted)">R₀ 94.62 (wheat)</text><circle cx="345.4" cy="36" r="4" style="fill:var(--ink)"/><text x="356.4" y="40" style="fill:var(--muted)">Paper, four hosts</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The finite rate of increase from a daily Leslie matrix as the start of egg laying moves, for the net reproductive rates on maize and on wheat (our assumption: daily egg numbers halve after the first day). Black dots: the four hosts as the paper reports them.</figcaption></figure>
<!-- /fig:onset -->

**Step 4: in field terms.** At the model's rates a maize population doubles every **3.29 days** and grows a thousandfold in about **33 days**; on castor bean, potato and wheat a thousandfold takes about 43, 46 and 58.5 days. These are lab rates at a steady temperature with no predators or disease, so they are an upper bound, not a forecast.

| Check | Paper | Tool result |
|---|---|---|
| Maize r from R₀ and T | 0.21 | 0.2093 |
| Potato λ from R₀ and T | 1.15 | 1.1582 |
| Maize λ, daily Leslie model | 1.23 | 1.2345 (1.2197 to 1.2417 by egg-laying shape) |
| Wheat λ, daily Leslie model | 1.12 | 1.1253 |
| Host ranking by λ | maize > castor > potato > wheat | the same |

## How we made the graphs

All numbers and both charts come from `scripts/blog-figures/fall-armyworm-host-plants-life-table-finite-rate-of-increase-leslie-matrix.mjs` in fibub's public code. It calls `leslie` (dominant eigenvalue, R₀ and generation time) and `expTime` (time to grow a thousandfold) from `src/lib/sci/popgrowth.ts`, the maths behind [[population-growth-models]].

R₀, λ, r, T, the onset day and the oviposition days come from the paper's text. The daily classes, folding survival into fecundity and the halving egg-laying pattern are **our assumptions**. This is a **recomputation from summary values**, not from the paper's raw life table.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/population-growth-models.mjs`, which pins the tool against NumPy:

- A four-class Leslie matrix with fecundities 0, 1.2, 2.0 and 1.5 and survivals 0.5, 0.6 and 0.4 must give λ = 1.128335, the dominant eigenvalue from `numpy.linalg.eig`, with matching stable distribution and reproductive values.
- The same matrix must give R₀ = 1.38 and a 10-step projection equal to A¹⁰N₀.
- New with this article: 29 daily classes with all of R₀ = 532.8 on the last day must give λ = 532.8^(1/29) = 1.241717 and T = 29; and a 60-class matrix with a plus group must satisfy its characteristic equation.

**A bug this article found and fixed.** The tool takes up to 60 classes, but with 25 or more classes and no offspring in the early ones, its search for λ started from a tiny trial value whose powers overflowed to infinity, and zero times infinity is not a number in JavaScript. The tool then refused the matrix with a wrong message. Daily insect life tables hit this at once. The fix skips classes with no offspring when it adds up the characteristic equation, and the two new checks keep it fixed.

## Check it yourself

On [[population-growth-models]]:

1. Press **Leslie matrix**.
2. Clear the box *One row per age or stage class* and paste the 35 rows below: our maize model, one row per day (name, fecundity F, survival P, starting number).
3. Set *Time steps to project* to **40**.
4. The result reads **λ = 1.2345: the population grows 23.5 % per time step in the long run**, with *Intrinsic rate r = ln λ* **0.2107**, *Doubling time* **3.29**, *Net reproductive rate R₀* **532.8** and *Generation time* **29.8**.
5. To delay egg laying by three days, add three rows of **0, 1, 0** before day 29's row: λ falls to about 1.211.

```
day 1, 0, 1, 100
day 2, 0, 1, 0
day 3, 0, 1, 0
day 4, 0, 1, 0
day 5, 0, 1, 0
day 6, 0, 1, 0
day 7, 0, 1, 0
day 8, 0, 1, 0
day 9, 0, 1, 0
day 10, 0, 1, 0
day 11, 0, 1, 0
day 12, 0, 1, 0
day 13, 0, 1, 0
day 14, 0, 1, 0
day 15, 0, 1, 0
day 16, 0, 1, 0
day 17, 0, 1, 0
day 18, 0, 1, 0
day 19, 0, 1, 0
day 20, 0, 1, 0
day 21, 0, 1, 0
day 22, 0, 1, 0
day 23, 0, 1, 0
day 24, 0, 1, 0
day 25, 0, 1, 0
day 26, 0, 1, 0
day 27, 0, 1, 0
day 28, 0, 1, 0
day 29, 268.5, 1, 0
day 30, 134.25, 1, 0
day 31, 67.12, 1, 0
day 32, 33.56, 1, 0
day 33, 16.78, 1, 0
day 34, 8.39, 1, 0
day 35, 4.2, 0, 0
```

## What researchers can use it for

- **Check a life table's summary row.** Recompute r = ln R₀ ÷ T and λ = e^r before reusing a paper's values, as Step 1 does for potato.
- **Ask which trait matters.** Build a short daily Leslie matrix in [[population-growth-models]] and move the onset day or R₀ to see which one a resistant variety or a cooler season would have to change.
- **Turn days into degree-days.** Lab stage lengths come at one temperature; the [[insect-degree-days]] tool converts them to the heat a field season delivers.
- **Compare with the field.** Moth catches summarised in the [[trap-count-index]] show whether a real infestation grows anywhere near the lab rate.
- **Teach population growth.** A life table, a Leslie matrix and exponential growth give the same r; seeing all three agree is a good class exercise.

## The fine print

- Our model uses only R₀, the onset day and the oviposition days. The real life table tracks every age and stage, and survival before adulthood, which the paper gives in figures, is folded into our fecundities.
- The halving pattern of daily egg numbers is our assumption; Figure 2's bars show how little the choice matters here.
- The stated r values look truncated (wheat's R₀ and T imply 0.117, not 0.11), and potato's λ, r and T do not quite fit together. Bootstrap means could explain this.
- Rates are for constant laboratory conditions on cut leaves. Field populations face weather, natural enemies and crop changes.
