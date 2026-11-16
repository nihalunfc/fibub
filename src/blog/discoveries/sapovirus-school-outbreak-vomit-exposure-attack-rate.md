---
title: "Sapovirus school outbreak: vomit exposure, attack rates and risk ratios"
summary: "A sapovirus outbreak at a Shenzhen school was traced to students passing near vomit, not to food or water. We recompute the attack rates, risk ratios and floor-by-floor test with fibub's outbreak tools."
tools: [epi-curve, odds-risk-ratio, crosstab-chi-square]
updated: 2026-11-16
sources:
  - "Li, J., Huang, Z., Wu, C., Zhang, M., Guo, H. and Li, Y. (2025), The outbreak of acute gastroenteritis caused by sapovirus at a school in Shenzhen, China, 2023, Frontiers in Public Health 13: 1572482, doi:10.3389/fpubh.2025.1572482. Licence CC BY, stated on the article page, checked 2026-11-16. Values used here: 86 suspected cases (85 students, 1 teacher) among 3,251 students, 273 teachers and 62 staff; onsets 6 to 14 February 2023, peak 9 February; sapovirus in 4 of 11 stool samples; cases and students by floor of building 2 (46/168, 5/148, 2/100, 2/49, 1/51) and the paper's chi-square of 361.2; retrospective cohort of 386 valid questionnaires with ill/total for exposed and unexposed: passing near vomit 32/147 and 10/234 (RR 5.09, 2.58 to 10.04), third-floor washroom 40/332 and 2/49 (RR 2.95), school food 29/210 and 13/171 (RR 1.82, 0.96 to 3.38), direct-drink water 20/158 and 22/223 (RR 1.28); within 1.2 m 16/50 and 16/97 (RR 1.94); cleaning by the standard procedure 6/43 and 17/41 (RR 0.34)."
  - "Rothman, K. J., Greenland, S. and Lash, T. L. (2008), Modern Epidemiology, 3rd ed., Lippincott Williams & Wilkins (attack rates, risk ratios and their log-scale intervals)."
paper:
  title: "The outbreak of acute gastroenteritis caused by sapovirus at a school in Shenzhen, China, 2023"
  authors: "Li J, Huang Z, Wu C, Zhang M, Guo H, Li Y"
  journal: "Frontiers in Public Health"
  year: 2025
  doi: "10.3389/fpubh.2025.1572482"
  url: "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1572482/full"
  licence: "CC BY"
  reviewed: true
---

**Sapovirus** is a cousin of norovirus: a small virus that causes a day or two of vomiting and diarrhoea, and spreads easily between people, especially children. In February 2023, 86 people at a school in Shenzhen, China, fell ill over nine days. The local disease control team's report in Frontiers in Public Health is a textbook outbreak investigation: find where the cases cluster, compare the people exposed to each possible source with those not exposed, and test the differences. This article shows how the attack-rate table in the [[epi-curve]] tool, the [[odds-risk-ratio]] tool and the [[crosstab-chi-square]] tool let anyone redo that arithmetic from the published counts.

*General education only. For an outbreak, follow your local public health service.*

## The paper in brief

Most cases (46 of 86) were students on the **third floor of one building**. Food, drinking water and the shared washroom were all suspects. The team handed a questionnaire to the nine classes on that floor (386 valid answers) and ran a **retrospective cohort study**: for each exposure, the share who fell ill among those exposed against those not exposed. That share is the **attack rate**, and the ratio of the two is the **attack-rate ratio** (a risk ratio).

Only one exposure stood out: **walking past a spot where someone had vomited**. Students who did were about five times as likely to fall ill. The closer they passed, the higher the risk, and classes where the vomit had been cleaned by the school's standard procedure (disinfectant, covering, ventilation) had fewer cases. Stool tests found sapovirus and no other likely germ. Vomiting can throw virus into the air as tiny droplets, which is why careful cleaning matters.

## Checked with the tools

We typed the paper's counts into the tools' maths. This is a **recomputation from the published table**, not a re-analysis of the questionnaires.

| Exposure | Paper: risk ratio | Tool: attack rates (exposed / not) | Tool: ratio (95% interval) | Tool: Fisher p |
|---|---|---|---|---|
| Passed near vomit | 5.09 (2.58 to 10.04) | 21.8% / 4.3% | 5.09 (2.58 to 10.05) | 0.0000003 |
| Third-floor washroom | 2.95 (0.74 to 11.83) | 12.0% / 4.1% | 2.95 (0.74 to 11.83) | 0.14 |
| School food | 1.82 (0.96 to 3.38) | 13.8% / 7.6% | 1.82 (0.97 to 3.38) | 0.070 |
| Direct-drink water | 1.28 (0.73 to 2.27) | 12.7% / 9.9% | 1.28 (0.73 to 2.27) | 0.41 |
| Within 1.2 m of vomit (of those who passed) | 1.94 (1.06 to 3.55) | 32.0% / 16.5% | 1.94 (1.06 to 3.55) | 0.037 |
| Vomit cleaned by the procedure | 0.34 (0.15 to 0.77) | 14.0% / 41.5% | 0.34 (0.15 to 0.77) | 0.0067 |

Every ratio matches. Two small points the tools settle: the paper prints the upper limit for vomit exposure as 10.04 in one place and 10.44 in another; from the counts it is **10.049**, so 10.04 is the value cut short rather than rounded, and 10.44 is a slip. The food interval's lower end is 0.975, so 0.97 or 0.98 rather than 0.96. The chi-square values the [[odds-risk-ratio]] tool gives (28.17, 2.76, 3.70, 0.74, 4.66, 7.99) also match the paper's to within 0.02.

<!-- fig:rr -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Only being near vomit (ratio 5.09, 2.58 to 10.05) clearly raised the risk; cleaning vomit by the standard procedure lowered it (0.34). Food, water and the washroom intervals cross 1." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Attack-rate ratio for each exposure (log scale)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Attack-rate ratio for each exposure (log scale)</text><line x1="58" x2="58" y1="254" y2="258" style="stroke:var(--muted)"/><text x="58" y="271" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="148.5" x2="148.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="148.5" y="271" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="216.9" x2="216.9" y1="254" y2="258" style="stroke:var(--muted)"/><text x="216.9" y="271" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="285.4" x2="285.4" y1="254" y2="258" style="stroke:var(--muted)"/><text x="285.4" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="353.8" x2="353.8" y1="254" y2="258" style="stroke:var(--muted)"/><text x="353.8" y="271" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="444.3" x2="444.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="444.3" y="271" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="512.8" x2="512.8" y1="254" y2="258" style="stroke:var(--muted)"/><text x="512.8" y="271" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Attack-rate ratio, exposed vs not</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)"></text><line x1="285.4" x2="285.4" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="289.4" y="44" text-anchor="start" style="fill:var(--muted)">no difference</text><path d="M379.1 56.3L513.2 56.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="446.2" cy="56.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><text x="62" y="49.3" text-anchor="start" style="fill:var(--ink)">Passed near vomit: 5.09</text><path d="M255.2 91L529.4 91" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="392.2" cy="91" r="4.5" style="fill:var(--ink);opacity:1"/><text x="62" y="84" text-anchor="start" style="fill:var(--ink)">Used 3rd-floor washroom: 2.95</text><path d="M282.9 125.7L405.8 125.7" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="344.3" cy="125.7" r="4.5" style="fill:var(--ink);opacity:1"/><text x="62" y="118.7" text-anchor="start" style="fill:var(--ink)">Ate school food: 1.82</text><path d="M253.7 160.3L366.3 160.3" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="310" cy="160.3" r="4.5" style="fill:var(--ink);opacity:1"/><text x="62" y="153.3" text-anchor="start" style="fill:var(--ink)">Drank direct-drink water: 1.28</text><path d="M291.3 195L410.4 195" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="350.9" cy="195" r="4.5" style="fill:var(--c-blog);opacity:1"/><text x="62" y="188" text-anchor="start" style="fill:var(--ink)">Within 1.2 m of vomit*: 1.94</text><path d="M96.2 229.7L259.4 229.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="177.8" cy="229.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><text x="62" y="222.7" text-anchor="start" style="fill:var(--ink)">Vomit cleaned by the SOP*: 0.34</text></svg><figcaption>Figure 1. Attack-rate ratios (dots) and 95% intervals from the Epi curve tool's attack-rate maths, recomputed from the paper's counts. Coloured: intervals that do not cross 1. *Compared within the students who passed the vomit, or the classes where it was cleaned.</figcaption></figure>
<!-- /fig:rr -->

**The floors.** From the paper's counts, the third floor's attack rate is **27.4%** against 2% to 4% elsewhere (Figure 2). The ordinary Pearson chi-square test on those counts, as the Crosstab chi-square tool works it out, gives **χ² = 70.6 on 4 degrees of freedom**, p far below 0.001. The paper prints 361.2; we could not reproduce that number from the table, but both say the same thing: the third floor is not like the others.

<!-- fig:floor -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="Third floor 27.4% (Wilson interval 21.2 to 34.6%); every other floor 2 to 4%. Chi-square 70.6 on 4 df." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Attack rate by floor of building 2</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Attack rate by floor of building 2</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--line)"/><text x="52" y="218" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="168.5" y2="168.5" style="stroke:var(--line)"/><text x="52" y="172.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="123" y2="123" style="stroke:var(--line)"/><text x="52" y="127" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="77.5" y2="77.5" style="stroke:var(--line)"/><text x="52" y="81.5" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">40</text><line x1="106.8" x2="106.8" y1="214" y2="218" style="stroke:var(--muted)"/><text x="106.8" y="231" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="204.4" x2="204.4" y1="214" y2="218" style="stroke:var(--muted)"/><text x="204.4" y="231" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="399.6" x2="399.6" y1="214" y2="218" style="stroke:var(--muted)"/><text x="399.6" y="231" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="497.2" x2="497.2" y1="214" y2="218" style="stroke:var(--muted)"/><text x="497.2" y="231" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">Floor</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Students ill (%)</text><circle cx="106.8" cy="204.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="204.4" cy="198.5" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="89.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="399.6" cy="195.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="497.2" cy="204.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><path d="M106.8 211.3L106.8 182.2" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M204.4 207.2L204.4 179" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M302 117.5L302 56.6" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M399.6 209L399.6 151.7" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M497.2 212.6L497.2 167.1" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. Share of students ill on each floor of the most affected building, with Wilson 95% intervals, from the paper's counts.</figcaption></figure>
<!-- /fig:floor -->

**The size of the outbreak.** 85 student cases among 3,251 students is an overall attack rate of **2.6%**, but **27%** on the worst floor: a reminder to give attack rates for the group actually exposed, not the whole school.

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/sapovirus-school-outbreak-vomit-exposure-attack-rate.mjs` in fibub's public code. It calls:

- `attackRates` from `src/lib/sci/epicurve.ts`, the maths behind the attack-rate table of the [[epi-curve]] tool (attack rates, ratio with a log-scale interval, Fisher's exact p).
- `chi2x2` and `wilson` from `src/lib/sci/epistat.ts`, shared with the [[odds-risk-ratio]] tool (Pearson chi-square and Wilson intervals for each floor's rate).
- `crosstab` from `src/lib/sci/crosstab.ts`, the maths behind the [[crosstab-chi-square]] tool, for the floor-by-illness table.

Every count comes from the paper's tables. The groupings and labels in the figures are ours.

## How we test the maths

On every change to fibub, `tests/sci-tools/epi-curve.mjs`, `tests/sci-tools/odds-risk-ratio.mjs` and `tests/sci-tools/crosstab-chi-square.mjs` check these functions against statsmodels and SciPy:

- The tool's chicken-salad example, 38 ill of 58 who ate it against 6 of 42 who did not, must give a ratio of **4.586 (2.136 to 9.846)**, statsmodels' `Table2x2` answer, and Fisher's p of **2.42 × 10⁻⁷** (SciPy).
- The fruit row (15 of 45 against 29 of 55) must give Fisher's p of **0.0687** and an upper limit of **1.025**.
- A food eaten by every ill person (no ill non-eaters) must give an infinite ratio and no interval, rather than a wrong number.

## Check it yourself

**Attack rates, on the [[epi-curve]] tool:**

1. Scroll to **Attack rates by food or exposure**.
2. Replace the example with one row per exposure: name, ate and ill, ate and well, did not eat and ill, did not eat and well. For example `Near vomit, 32, 115, 10, 224` and `School food, 29, 181, 13, 158` (tabs work too).
3. Keep *Confidence* on **95 %**.
4. The table shows *Near vomit* with *Ate: ill / total* **32 / 147**, *Attack rate* **21.8 %**, *Not eaten: ill / total* **10 / 234**, *Attack rate* **4.3 %**, *Ratio* **5.09**, interval **2.58 to 10.0** and *p (Fisher)* **< 0.001**. It is in bold as the highest ratio.

**One exposure in full, on the [[odds-risk-ratio]] tool:**

1. Press **One table** and set *Study design* to **Cohort or trial**.
2. Type **32** and **115** for *Exposed*, **10** and **224** for *Unexposed*.
3. Read *Risk ratio (log method)* **5.09** (2.58 to 10.0) and *Pearson chi-square* **χ² = 28.17**.

## What researchers can use it for

- **Run the analytic step of an outbreak investigation** in the field, from a questionnaire tally, with the attack-rate table in the [[epi-curve]] tool; it marks the strongest suspect.
- **Check a published outbreak table** for slips, as here with the 10.04 / 10.44 limit, using the [[odds-risk-ratio]] tool.
- **Test whether one place stands out**, such as a floor, ward or class, with the [[crosstab-chi-square]] tool on the counts.
- **Draw the epidemic curve** from onset dates in the same [[epi-curve]] tool to see whether cases came from one exposure or spread person to person.
- **Teach** why the denominator matters: 2.6% for the school, 27% for the floor.

## The fine print

- Many exposures were tested on a small group, so some differences can arise by chance; the vomit finding is strong (p about 3 in 10 million), the others are not.
- Students who passed near vomit may also differ in other ways (where they sit, who they mix with); a cohort like this shows an association, not proof.
- Only 4 of 11 stool samples were positive for sapovirus, which is common for this virus when samples are taken late.
- The floor chi-square differs from the paper's printed value; the counts we used are the paper's own.
