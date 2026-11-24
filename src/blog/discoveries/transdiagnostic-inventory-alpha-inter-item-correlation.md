---
title: "Does an alpha of 0.87 fit a mean item correlation of 0.56?"
summary: "A 2026 inventory prints Cronbach's alpha and the mean inter-item correlation for 23 scales. We put both numbers back through fibub's questionnaire scorer: the short scales agree, the long composites cannot."
tools: [questionnaire-scorer, reliability-analysis, factor-analysis, irt-item-analysis]
updated: 2026-11-24
sources:
  - "Blais, M. A., Cai, H., Adam, T. J. and Correll, C. U. (2026), Multidimensional transdiagnostic inventory of psychopathology: development and initial validation, Frontiers in Psychology 17, doi:10.3389/fpsyg.2026.1917064. Licence CC BY 4.0, taken from the Crossref record for the DOI (the Frontiers page drops its copyright footer when fetched), checked 2026-11-24. Values used here: 5-point response scale; 301 adults in the development study and 826 retained in the validation study, of whom 640 reported no history of mental health treatment; item counts, Cronbach's alpha and mean inter-item correlation for ten of the 23 scales (Depression 6 items, 0.89, 0.59; Anxiety 7, 0.91, 0.61; Social anxiety 4, 0.91, 0.71; Traumatic stress 4, 0.74, 0.42; Impulsivity 5, 0.75, 0.38; Antisocial actions 5, 0.68, 0.33; Treatment attitude 4, 0.66, 0.29; TED 21, 0.87, 0.56; TBD 22, 0.77, 0.39; TTD 17, 0.79, 0.25); internal consistency of the 13 clinical scales reported as 0.68 to 0.91 with a median of 0.80."
  - "Cronbach, L. J. (1951), Coefficient alpha and the internal structure of tests, Psychometrika 16: 297-334 (alpha and its standardised form)."
  - "Feldt, L. S. (1965), The approximate sampling distribution of Kuder-Richardson reliability coefficient twenty, Psychometrika 30: 357-370 (the 95 % interval the tool reports)."
paper:
  title: "Multidimensional transdiagnostic inventory of psychopathology: development and initial validation"
  authors: "Blais MA, Cai H, Adam TJ, Correll CU"
  journal: "Frontiers in Psychology"
  year: 2026
  doi: "10.3389/fpsyg.2026.1917064"
  url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1917064/full"
  licence: "CC BY 4.0"
  reviewed: true
---

A new questionnaire is only as good as its reliability table, and that table is usually two columns of numbers: **Cronbach's alpha** for each scale, and the **mean inter-item correlation**, the average correlation between every pair of items in the scale. Those two columns are not independent. Given the number of items, each one fixes the other. A 2026 paper in *Frontiers in Psychology* introduces a 23-scale transdiagnostic inventory of psychopathology and prints both columns, so we fed them back through the maths behind the [[questionnaire-scorer]] to see whether every row hangs together. Thirteen short scales do, to the third decimal. Three long composite scales cannot. For the matching jobs on real answers, see [[reliability-analysis]] and [[factor-analysis]].

## The paper in brief

The authors wanted one short self-report instrument that covers many kinds of psychopathology at once, instead of a drawer full of single-disorder questionnaires. Items are answered on a 5-point scale from "not at all true" to "extremely true". A development study of 301 adults picked the items; a validation study kept 826 people, of whom 640 reported no history of mental health treatment and form the reference sample.

The result is 13 clinical scales of 4 to 7 items each (depression, anxiety, social anxiety, traumatic stress, alcohol, drug, anger, impulsivity, antisocial actions, psychosis, paranoid ideation, manic activation, grandiose ideation), several extra scales (body distress, eating issues, cognitive complaints, resilience, personality dysfunction, suicidal ideation, treatment attitude) and three long **transdiagnostic composites** of 17 to 22 items, which pool items across the clinical scales. The paper reports internal consistency for the 13 clinical scales as 0.68 to 0.91, median 0.80, and prints a mean inter-item correlation beside every alpha.

## Checked with the tools

The [[questionnaire-scorer]] works out Cronbach's alpha for each subscale from people's answers. Inside it, the same function also returns the **standardised alpha**, which uses only the number of items *k* and the mean inter-item correlation r̄:

> standardised alpha = k·r̄ / (1 + (k − 1)·r̄)

When every item has a similar variance, standardised alpha and ordinary alpha agree closely. So the paper's two printed columns give us a check that needs no data at all: take each row's *k* and r̄, and see whether the alpha that comes out is the alpha the row prints.

To do it with the tool's own code rather than by hand, we build, for each row, a set of *k* items whose pairwise correlations are *exactly* r̄ (we use orthogonal Hadamard columns, so there is no sampling noise at all), and read the standardised alpha the tool returns.

**Result.** For the short clinical scales the two agree to within 0.006 — the rounding of the printed numbers. For the three long composites they do not agree at all.

| Scale | Items | Paper's alpha | Paper's r̄ | Alpha from k and r̄ | r̄ that the alpha implies |
|---|---|---|---|---|---|
| Social anxiety | 4 | 0.91 | 0.71 | 0.907 | 0.717 |
| Anxiety | 7 | 0.91 | 0.61 | 0.916 | 0.591 |
| Depression | 6 | 0.89 | 0.59 | 0.896 | 0.574 |
| Impulsivity | 5 | 0.75 | 0.38 | 0.754 | 0.375 |
| Traumatic stress | 4 | 0.74 | 0.42 | 0.743 | 0.416 |
| Antisocial actions | 5 | 0.68 | 0.33 | 0.711 | 0.298 |
| Treatment attitude | 4 | 0.66 | 0.29 | 0.620 | 0.327 |
| TTD (composite) | 17 | 0.79 | 0.25 | 0.850 | 0.181 |
| TED (composite) | 21 | 0.87 | 0.56 | 0.964 | 0.242 |
| TBD (composite) | 22 | 0.77 | 0.39 | 0.934 | 0.132 |

<!-- fig:identity -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Each scale of the inventory: the Cronbach alpha printed in the paper on the x-axis, the alpha that follows from the same row's item count and mean inter-item correlation on the y-axis. The short clinical scales sit on the dashed line of equality; the three long composites sit far above it." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Printed alpha against alpha from k and r̄</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Printed alpha against alpha from k and r̄</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="201.5" y2="201.5" style="stroke:var(--line)"/><text x="52" y="205.5" text-anchor="end" style="fill:var(--muted)">0.7</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">0.9</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">0.7</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">0.9</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">The paper's Cronbach alpha</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Alpha from its k and r̄</text><circle cx="411.8" cy="102.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="436.2" cy="92.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="436.2" cy="96.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="228.8" cy="179.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="241" cy="174.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="155.6" cy="195.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="131.2" cy="241.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="387.4" cy="68.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="265.4" cy="83.5" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="289.8" cy="125.8" r="4" style="fill:var(--c-tools);opacity:1"/><path d="M58 252L546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Short scales (4 to 7 items)</text><circle cx="283.4" cy="36" r="4" style="fill:var(--c-tools)"/><text x="294.4" y="40" style="fill:var(--muted)">Long composites (17 to 22)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. For ten of the inventory's scales: the Cronbach alpha the paper prints (across) against the alpha that the same row's item count and mean inter-item correlation give through the tool's standardised alpha (up). The dashed line is equality. The short clinical scales land on it; the long transdiagnostic composites do not.</figcaption></figure>
<!-- /fig:identity -->

Figure 1 shows the same thing as a picture. The short scales sit on the line of equality. The composites sit well above it: for 21 items, a mean inter-item correlation of 0.56 would give an alpha of **0.96**, not the 0.87 printed. Turning it round, an alpha of 0.87 over 21 items implies a mean inter-item correlation of **0.24**. Figure 2 draws that gap as a curve.

<!-- fig:kcurve -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Standardised alpha against the number of items for two mean inter-item correlations, 0.56 and 0.24, with the paper's 21-item TED composite marked at its printed alpha of 0.87. At 21 items a mean correlation of 0.56 would give 0.96." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How alpha grows with the number of items</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How alpha grows with the number of items</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="211.6" y2="211.6" style="stroke:var(--line)"/><text x="52" y="215.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="171.2" y2="171.2" style="stroke:var(--line)"/><text x="52" y="175.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--line)"/><text x="52" y="134.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="110.3" x2="110.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="110.3" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="197.4" x2="197.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="197.4" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="284.6" x2="284.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="284.6" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="371.7" x2="371.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="371.7" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="458.9" x2="458.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="458.9" y="269" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Items in the scale (k)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Standardised alpha</text><line x1="58" x2="546" y1="110.6" y2="110.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="105.6" text-anchor="end" style="fill:var(--muted)">0.70</text><path d="M58 107L75.4 91.9L92.9 83.2L110.3 77.4L127.7 73.4L145.1 70.4L162.6 68.1L180 66.2L197.4 64.7L214.9 63.5L232.3 62.4L249.7 61.5L267.1 60.7L284.6 60.1L302 59.5L319.4 58.9L336.9 58.4L354.3 58L371.7 57.6L389.1 57.3L406.6 57L424 56.7L441.4 56.4L458.9 56.2L476.3 55.9L493.7 55.7L511.1 55.5L528.6 55.3L546 55.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 173.3L75.4 153.2L92.9 138.7L110.3 127.8L127.7 119.3L145.1 112.4L162.6 106.8L180 102.2L197.4 98.2L214.9 94.8L232.3 91.8L249.7 89.2L267.1 86.9L284.6 84.9L302 83.1L319.4 81.4L336.9 79.9L354.3 78.6L371.7 77.4L389.1 76.2L406.6 75.2L424 74.2L441.4 73.3L458.9 72.5L476.3 71.7L493.7 71L511.1 70.3L528.6 69.7L546 69.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="389.1" cy="76.3" r="5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">r̄ = 0.56 (printed)</text><line x1="220.8" x2="232.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="236.8" y="40" style="fill:var(--muted)">r̄ = 0.24 (implied)</text><circle cx="388.6" cy="36" r="4" style="fill:var(--ink)"/><text x="399.6" y="40" style="fill:var(--muted)">TED as printed</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The tool's standardised alpha against the number of items, for a mean inter-item correlation of 0.56 (the value printed for the TED composite) and 0.24 (the value its printed alpha implies). The dot is TED as printed: 21 items, alpha 0.87.</figcaption></figure>
<!-- /fig:kcurve -->

This is not a sign that the alphas are wrong — 0.87 for a 21-item composite is exactly what you would expect from items pulled out of many different scales. It is a sign that the **r̄ column for the composites is not the mean over all item pairs in the composite**. The most likely reading is that it is an average of the within-domain correlations, or a mean item-scale correlation; the paper's own table footnote describes that last column loosely. Either way, a reader who takes the composites' r̄ at face value and projects what a longer version of the scale would do will be badly out. For the 13 clinical scales, the two columns are a clean pair and either can be trusted.

**A second check, on answers rather than summaries.** Nothing above touches real respondents, so we also **simulated** 640 people (the paper's reference sample size) answering a 6-item scale, using a one-factor model whose items correlate 0.59 on average before rounding — our stand-in for the depression scale. Answers were rounded to the inventory's 1-to-5 scale. Running them through the scorer gives alpha **0.881** with a 95 % interval of 0.866 to 0.895, a realised mean inter-item correlation of 0.552, and sum scores from 6 to 30 (mean 17.9, SD 5.2). Rounding a continuous answer onto five steps costs about 0.01 of alpha. These are **our simulated people**, not the paper's data.

**A third check, on a mistake that is easy to make.** Reverse-worded items must be flipped before scoring. We took the same simulated answers, recorded 1, 2 or 3 of the six items the other way round, and scored them with and without the tool's *Reverse-keyed items* list:

| Items worded the other way round | Alpha if you forget to reverse them | Alpha if you reverse them |
|---|---|---|
| 0 | 0.881 | 0.881 |
| 1 | 0.540 | 0.881 |
| 2 | −0.342 | 0.881 |
| 3 | −1.467 | 0.881 |

One forgotten item takes a good scale below any usual threshold; two make alpha negative. A negative alpha is therefore worth reading as "check the keying first", not "the scale is bad".

## How we made the graphs

Both charts and every number in this article come from `scripts/blog-figures/transdiagnostic-inventory-alpha-inter-item-correlation.mjs` in fibub's public code. It calls:

- `cronbach` from `src/lib/sci/reliability.ts` for alpha, its standardised form, the mean inter-item correlation and the Feldt 95 % interval;
- `scoreScales` and `parseItems` from `src/lib/sci/questionnaire.ts` for the subscale sums, the reverse keying and the per-subscale alpha. Both modules are the maths behind the [[questionnaire-scorer]].

Item counts, alphas and mean inter-item correlations are stated values from the paper's reliability tables. The exact-correlation item sets (Hadamard columns), the one-factor simulation with a loading of √0.59, the rounding to five steps, the random seed and the mis-keying experiment are **our assumptions**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/questionnaire-scorer.mjs`, which pins the scorer against pandas, numpy and scipy on the tool page's own made-up example of 14 people and 8 items:

- the subscale sums must match pandas exactly, including one prorated sum under the "75 % of items answered" rule, and 13 of 14 people scored;
- alpha for the four-item "Calm" subscale must be 0.9028794533918985 with a Feldt interval of 0.7657 to 0.9686 on the 12 people who answered every item, and 0.8479632816982214 for "Focus";
- switching the rule to 100 % must drop the incomplete person, and to 50 % must prorate two people's sums instead.
- New with this article: a 6-item scale whose items correlate exactly 0.59 must give a standardised alpha of 0.8962, a 21-item scale at 0.56 must give 0.9639, and at 0.242 must give 0.8701 — the identity that the table above rests on.

## Check it yourself

On the [[questionnaire-scorer]]:

1. In *One row per person, one column per item*, clear the box and paste this 14-person, 6-item sample from our simulation (tab or space separated; the first column is the person's ID):

```
ID	I1	I2	I3	I4	I5	I6
P01	3	2	3	2	4	3
P02	5	4	3	4	4	4
P03	1	3	4	3	2	3
P04	2	2	3	2	2	4
P05	1	2	3	1	2	1
P06	4	2	3	3	2	3
P07	2	3	4	4	4	3
P08	3	2	3	4	3	2
P09	2	1	3	3	1	2
P10	4	3	4	3	2	3
P11	2	3	4	3	2	2
P12	3	3	4	4	3	3
P13	5	4	2	4	4	5
P14	4	3	2	5	3	4
```

2. Leave *Lowest answer* **1** and *Highest answer* **5**, *Score as* on **Sum of items**, *Items needed (%)* **75**.
3. Put **I3** in *Reverse-keyed items* (that item is worded the other way round), and in *Subscales* type `Low mood: I1-I6`.
4. The *Subscales* table shows **14 of 14** scored, mean **17.29**, SD **4.497**, lowest **10**, highest **26**, *Alpha* **0.836** with a 95 % interval of **0.654 to 0.940**.
5. Now clear *Reverse-keyed items* and watch alpha fall to **0.742**: that single item, keyed the wrong way, is worth nearly 0.1 of alpha even in a six-item scale.

## What researchers can use it for

- **Audit a reliability table before you cite it.** Two of the three columns fix the third, so any row where alpha and r̄ disagree needs a footnote. The [[questionnaire-scorer]] prints both for your own data.
- **Score a questionnaire without a statistics package**: reverse items, subscale sums or means, a clear missing-answer rule with prorating, and alpha with its interval, all in the browser, with nothing uploaded.
- **Plan how long a new scale has to be.** If your pilot items correlate 0.25 on average, Figure 2 says you need 9 items for alpha 0.75; at 0.42, four items get you there (0.743).
- **Catch keying mistakes early**: a negative or oddly low alpha on a scale that should hold together almost always means a reverse-worded item was not flipped.
- **Follow up with item-level work**: [[irt-item-analysis]] for how each item discriminates, [[factor-analysis]] for whether the items really form one dimension, and [[reliability-analysis]] for agreement between raters or test-retest.

## The fine print

- We never saw the paper's responses. The first check uses only the numbers printed in its reliability tables; the second and third use **simulated** answers.
- Standardised alpha equals ordinary alpha only when the items have similar variances. Some of the gaps in the table (Antisocial actions +0.031, Treatment attitude −0.040) are the size you would expect from unequal item variances plus two-decimal rounding; the composites' gaps, up to +0.164, are far too big for that.
- The paper's mean inter-item correlations are printed to two decimals, so the implied r̄ values in the last column carry about ±0.01 of rounding.
- Alpha is a lower bound on reliability under a strict model, and it rises with the number of items whatever the items measure. A high alpha on a long composite is not evidence that the composite is one thing.
