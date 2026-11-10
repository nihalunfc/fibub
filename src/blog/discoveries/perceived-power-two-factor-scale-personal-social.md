---
title: "Personal and social power: validating a two-factor perceived power scale"
summary: "A 2025 PLOS ONE study built a 10-item scale that splits perceived power into personal and social power, using EFA and CFA. See how to run the same kind of factor analysis yourself."
tools: [factor-analysis, questionnaire-scorer, reliability-analysis]
updated: 2026-11-10
sources:
  - "Kim M, May F (2025), PLOS ONE 20(2): e0319412, CC BY 4.0, the paper described here."
  - "Standardised Cronbach's alpha from the mean inter-item correlation, α = k·r̄ / (1 + (k − 1)·r̄): standard psychometrics."
  - "The correlation matrix in the worked example is made up by fibub; it is not the paper's data."
paper:
  title: "A two-factor scale of perceived power"
  authors: "Kim M, May F"
  journal: "PLOS ONE"
  year: 2025
  doi: "10.1371/journal.pone.0319412"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0319412"
  licence: "CC BY 4.0"
  reviewed: true
---

Psychologists usually measure how powerful people feel with a single score. But feeling able to steer other people is not the same as feeling free from their pressure. A 2025 study in PLOS ONE built and tested a short questionnaire that keeps the two apart: **social power**, the sense of control over others, and **personal power**, the sense of being able to resist unwanted influence. Across twelve samples, the two scores behaved differently and sometimes pointed in opposite directions. This page explains the work and shows how to run the central step, an exploratory factor analysis, with the [[factor-analysis]] tool, then score the subscales and check their reliability with the [[questionnaire-scorer]].

## What they found

The final scale has 10 statements, five per factor, each answered on a 7-point scale from strongly disagree to strongly agree. An exploratory factor analysis found two clear factors, with every item loading above 0.50 on its own factor; together they explained about 61 % of the variance. A confirmatory analysis on a new sample fitted the two-factor model well and much better than a single factor. Cronbach's alpha was above 0.80 in every sample, and scores were fairly stable over one week (test-retest correlations of about 0.75 to 0.77).

The two factors were only weakly related: their correlation ranged from about 0.01 to 0.39 across samples, and about 0.17 when the samples were pooled. Personal power went with autonomy and self-efficacy; social power went with dominance. In one study, people high in personal power sought more advice, while those high in social power sought less.

## Why it matters

If two parts of a trait have different effects, a single score can hide both. Someone could feel powerless over others but quite free from them, or the reverse. Splitting the measure lets researchers in management, marketing and social psychology ask sharper questions, such as which kind of power makes a customer complain after poor service. It is also a clean, short example of how a scale is built: write items, explore their structure, confirm it on new people, then test what the scores predict.

## How they did it

The authors started with 20 items, six of them reverse-worded. Those six formed a factor of their own, a known artefact of negatively worded items, so all were dropped. The exploratory step used principal axis factoring with an oblique rotation (which lets factors correlate) on about 240 online participants. Four more items were then dropped for weak or cross-loadings. The KMO measure of sampling adequacy in the first sample was 0.90. The confirmatory step used about 275 students. Later studies checked links to related traits, showed in an experiment that each kind of power could be shifted on its own, and tested whether the scores predicted choices in made-up scenarios. Most participants were online workers in the United States.

## Check it yourself with fibub

You can try the exploratory step on a correlation matrix. The one below is **made up**: six items, P1 to P3 for an imaginary "personal" factor and S1 to S3 for a "social" one, from 240 people.

```
	P1	P2	P3	S1	S2	S3
P1	1	.55	.50	.10	.05	.08
P2	.55	1	.60	.12	.08	.06
P3	.50	.60	1	.05	.10	.04
S1	.10	.12	.05	1	.62	.58
S2	.05	.08	.10	.62	1	.65
S3	.08	.06	.04	.58	.65	1
```

1. In the factor analysis tool, set **My data is** to A correlation matrix, paste the table, and type 240 for the number of people.
2. Check suitability. KMO is about 0.70 (middling) and Bartlett's test is χ²(15) ≈ 481, p < 0.001, so the items share enough to factor.
3. Read the scree plot. The first two eigenvalues, 2.40 and 1.93, are above the random-data line; the third, 0.52, is well below it. Parallel analysis suggests 2 factors.
4. Keep **Principal axis** and **Promax**. The P items load about 0.68 to 0.81 on one factor and the S items about 0.74 to 0.83 on the other, with cross-loadings near zero. The factor correlation is about 0.13, weak, like the paper's pooled value.
5. Switch to **Maximum likelihood** to see a fit test. With 2 factors, χ²(4) ≈ 5.4, p ≈ 0.25: the model is not rejected. Choose 1 factor and it jumps to χ²(9) ≈ 208, p < 0.001.
6. Estimate reliability. From the mean correlation inside each set (0.55 and 0.62), standardised alpha is 3 × 0.55 ÷ (1 + 2 × 0.55) ≈ 0.79 for P and about 0.83 for S. With raw answers, the questionnaire scorer gives alpha per subscale directly, and the [[reliability-analysis]] tool adds item-level detail.

## The fine print

- The tool runs an exploratory analysis. A confirmatory test on a fresh sample, as in the paper, needs structural equation software.
- Dropping all reverse-worded items removes one guard against people who agree with everything; the authors used attention checks instead.
- Most samples were US online workers or students, so the scale has not been tested across cultures or languages.
- The data are cross-sectional and the behaviour studies used hypothetical scenarios. One social power effect sat right at p = 0.05.
- The correlation between the two factors varied from sample to sample, so its true size is still uncertain.
