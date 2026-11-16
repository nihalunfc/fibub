---
title: "US foodborne outbreak trends 1998-2018: testing count trends"
summary: "A Bayesian model finds fewer US outbreaks from eggs and beef but more from dairy. We simulate outbreak counts to see when a Mann-Kendall test would catch such trends."
tools: [trend-analyser, distribution-explorer]
updated: 2026-11-16
sources:
  - "Bazaco, M. C., Batz, M., Cote, A., Richardson, L., Bilanovic, I., Hoekstra, R. M., Zablotsky Kufel, J. and Bruce, B. (2026), Trends in foodborne outbreaks and outbreak-associated illnesses using a Bayesian trend model - United States, 1998-2018, PLOS ONE 21(8): e0353943, doi:10.1371/journal.pone.0353943. Licence CC0 1.0 (public domain), checked on the journal page, 2026-11-16. Values used here, from the article's text: CDC Foodborne Disease Outbreak Surveillance System, 1998-2018; four pathogens (Campylobacter, STEC O157, Listeria monocytogenes, nontyphoidal Salmonella); Bayesian negative binomial regression with a smooth (thin plate spline) year term, 20,000 iterations with 5,000 burn-in, 184 models; four windows 1998-2003, 2004-2008, 2009-2013, 2014-2018; median differences in outbreaks a year: Salmonella in eggs -10.1 (5.8 to 15.5) last against first window; STEC O157 in meat -5.3 (1.9 to 10.0); Listeria in dairy +1.7 (0.4 to 3.7); Campylobacter in poultry 4.2 (2.2 to 6.6) between the first and fourth windows; Salmonella illnesses from meat and poultry +318.3 (69.3 to 664.5) a year, last against first window."
  - "Mann, H. B. (1945), Econometrica 13, 245-259; Kendall, M. G. (1975), Rank Correlation Methods (the Mann-Kendall test); Sen, P. K. (1968), J. Am. Stat. Assoc. 63, 1379-1389 (Sen slope); Pettitt, A. N. (1979), A non-parametric approach to the change-point problem, Applied Statistics 28, 126-135."
  - "Hussain, M. M. and Mahmud, I. (2019), pyMannKendall, J. Open Source Softw. 4(39), 1556, and SciPy's scipy.stats.nbinom (reference values in fibub's tests)."
paper:
  title: "Trends in foodborne outbreaks and outbreak-associated illnesses using a Bayesian trend model – United States, 1998–2018"
  authors: "Bazaco, M. C.; Batz, M.; Cote, A.; Richardson, L.; Bilanovic, I.; Hoekstra, R. M.; Zablotsky Kufel, J.; Bruce, B."
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0353943"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0353943"
  licence: "CC0 1.0"
  reviewed: true
---

Every year, US health departments report the foodborne outbreaks they investigate (two or more people sick from the same food) to a national surveillance system. A new PLOS ONE study looks at 21 years of those reports for four bacteria, Campylobacter, the O157 strain of Shiga toxin-producing *E. coli* (STEC), *Listeria* and *Salmonella*, and asks which foods are causing more or fewer outbreaks. Outbreak counts are small whole numbers that jump about from year to year, which makes trends hard to test. This article uses the [[trend-analyser]] and the [[distribution-explorer]] to show how big a change a simple trend test can find in counts like these, and why the authors chose a model built for counts.

## The paper in brief

The authors fitted a **Bayesian negative binomial model** with a smooth curve over the years, one for each pathogen and food group, 184 models in all. A **negative binomial** is a distribution for counts whose spread is larger than their average, as outbreak counts usually are; "Bayesian" means the result comes as a range of plausible values (a credible interval) rather than a single p-value. They then compared the average number of outbreaks a year in four windows: 1998-2003, 2004-2008, 2009-2013 and 2014-2018.

- **Salmonella from eggs** fell the most: about **10.1 fewer outbreaks a year** in 2014-2018 than in 1998-2003, in line with US egg safety rules brought in during the 2000s.
- **STEC O157 from meat** (mostly beef) fell by about **5.3 outbreaks a year**.
- **Listeria from dairy** rose by about **1.7 a year**, while Listeria from meat and poultry fell.
- **Campylobacter** outbreaks from dairy (largely raw milk) rose and then fell; from poultry they changed by about 4.2 a year between the first and last windows.
- Outbreak **numbers** changed significantly more often than outbreak **illnesses**, because a single large outbreak can add hundreds of cases in one year.

## Checked with the tools

The paper gives the differences between window averages, not the yearly counts, so this section is a **simulation**. We made up yearly counts for 1998 to 2018 whose window averages differ by the amounts the paper reports, using a negative binomial like the paper's model, and ran them through the Trend analyser's maths. The levels and spread are our assumptions.

**Step 1: one series shaped like Salmonella in eggs.** We let the expected count fall smoothly from about 12 a year (1998-2003) to 2 a year (2014-2018), and drew each year's count from a negative binomial with size r = 5 (variance = mean + mean² ÷ 5). Figure 1 shows one such series. The Trend analyser gives:

- Mann-Kendall **S = −102, Z = −3.071, p = 0.002**, Kendall's tau −0.486: a clear fall.
- Sen slope **−0.667 outbreaks a year** (95 % interval −1.08 to −0.25).
- Pettitt's change point between **2009 and 2010** (p = 0.006).
- Window means 14.0, 9.2, 4.0 and 3.0 outbreaks a year.

The Sen slope is a straight line, while the real fall is steep early and flat late, so it understates the early decline. That is the reason the authors used a smooth curve and window averages instead of one slope.

<!-- fig:series -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Made-up negative binomial counts falling from about 12 to 2 a year: Mann-Kendall p = 0.0021, Sen slope -0.67 outbreaks a year." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated yearly outbreaks shaped like Salmonella in eggs</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated yearly outbreaks shaped like Salmonella in eggs</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="184.7" y2="184.7" style="stroke:var(--line)"/><text x="52" y="188.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">30</text><line x1="124.5" x2="124.5" y1="252" y2="256" style="stroke:var(--muted)"/><text x="124.5" y="269" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="235.5" x2="235.5" y1="252" y2="256" style="stroke:var(--muted)"/><text x="235.5" y="269" text-anchor="middle" style="fill:var(--muted)">2.01e+3</text><line x1="346.4" x2="346.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="346.4" y="269" text-anchor="middle" style="fill:var(--muted)">2.01e+3</text><line x1="457.3" x2="457.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="457.3" y="269" text-anchor="middle" style="fill:var(--muted)">2.02e+3</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Year</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Outbreaks (simulated)</text><circle cx="80.2" cy="204.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="102.4" cy="171.2" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="124.5" cy="70.2" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="146.7" cy="151" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="168.9" cy="198.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="191.1" cy="151" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="213.3" cy="225.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="235.5" cy="177.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="257.6" cy="171.2" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="279.8" cy="184.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="191.4" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="324.2" cy="157.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="346.4" cy="245.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="368.5" cy="238.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="390.7" cy="245.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="412.9" cy="238.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="435.1" cy="245.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="457.3" cy="177.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="479.5" cy="252" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="501.6" cy="238.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="523.8" cy="245.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><path d="M69.1 157.7L202.2 157.7L202.2 190.1L313.1 190.1L313.1 225.1L424 225.1L424 231.8L534.9 231.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><path d="M80.2 153.2L523.8 243" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated year</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="200.8" y="40" style="fill:var(--muted)">5-year window mean</text><line x1="340.4" x2="352.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="356.4" y="40" style="fill:var(--muted)">Sen slope -0.67 a year</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. One made-up 21-year series of outbreak counts, drawn from a negative binomial distribution whose mean falls from about 12 to 2 a year (the paper's difference of 10.1 between the end windows; the level and spread are our assumptions). Dashed steps: 5-year window means; solid line: Sen slope from the Trend analyser's maths. Not the surveillance data.</figcaption></figure>
<!-- /fig:series -->

**Step 2: when does a simple test find the trend?** We repeated the experiment 400 times for each size of change, with the quieter end window at **2 outbreaks a year** (our assumption), and counted how often Mann-Kendall gave p < 0.05 (Figure 2). With pure Poisson counts (spread equal to the mean), a fall of 4 a year or more is found over 90 % of the time. With over-dispersed counts, as outbreak data usually are, the test needs bigger changes:

| Change between end windows | Poisson | Negative binomial, r = 5 | Negative binomial, r = 2 |
|---|---|---|---|
| Salmonella in eggs, 10.1 fewer | 100 % | 99.8 % | 88 % |
| STEC O157 in meat, 5.3 fewer | 99 % | 84 % | 57 % |
| Campylobacter in poultry, 4.2 more | 93 % | 74 % | 50 % |
| Listeria in dairy, 1.7 more | 35 % | 26 % | 14 % |

A rise of 1.7 outbreaks a year from a low base, like Listeria in dairy, is found only about a quarter of the time by a rank test on 21 yearly totals. The paper's model, which knows the data are counts and borrows strength across neighbouring years, reports it with a credible interval of 0.4 to 3.7. That shows the value of a count model, but also why small changes in rare outbreaks deserve caution: they rest more on the model's assumptions.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 324" role="img" aria-label="With a low level of 2 outbreaks a year, Mann-Kendall usually finds a fall of 5 or more a year between the end windows, but often misses changes of 1 to 2 a year, more so when counts are over-dispersed." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How often Mann-Kendall finds a trend in 21 yearly counts</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How often Mann-Kendall finds a trend in 21 yearly counts</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="219.6" y2="219.6" style="stroke:var(--line)"/><text x="52" y="223.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="177.2" y2="177.2" style="stroke:var(--line)"/><text x="52" y="181.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="134.8" y2="134.8" style="stroke:var(--line)"/><text x="52" y="138.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="92.4" y2="92.4" style="stroke:var(--line)"/><text x="52" y="96.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="146.7" x2="146.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="146.7" y="279" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="235.5" x2="235.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="235.5" y="279" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="324.2" x2="324.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="324.2" y="279" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="412.9" x2="412.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="412.9" y="279" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="501.6" x2="501.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="501.6" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Difference between first and last window means (outbreaks a year)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of simulated series with p &lt; 0.05</text><line x1="58" x2="546" y1="92.4" y2="92.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="87.4" text-anchor="end" style="fill:var(--muted)">80 %</text><line x1="506.1" x2="506.1" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="293.1" x2="293.1" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="244.3" x2="244.3" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="133.4" x2="133.4" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 251.9L80.2 248.2L102.4 225.4L124.5 196.8L146.7 166.6L191.1 105.1L235.5 65.9L279.8 54.2L324.2 51.6L412.9 50L501.6 50" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 251.9L80.2 250.3L102.4 236L124.5 220.1L146.7 200.5L191.1 154.9L235.5 116.3L279.8 91.9L324.2 73.3L412.9 54.2L501.6 50.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:6 3"/><path d="M58 252.5L80.2 252.5L102.4 245.6L124.5 233.9L146.7 222.3L191.1 189.9L235.5 167.1L279.8 145.9L324.2 123.1L412.9 87.6L501.6 76.5" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:2 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Poisson</text><line x1="134.4" x2="146.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:6 3"/><text x="150.4" y="40" style="fill:var(--muted)">Negative binomial, r = 5</text><line x1="333.2" x2="345.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:2 3"/><text x="349.2" y="40" style="fill:var(--muted)">Negative binomial, r = 2</text><text class="fibub-mark" x="546" y="318" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Share of 400 simulated 21-year count series that the Mann-Kendall test flags at the 5 % level, against the difference between the first and last 5-year window means, with the lower window at 2 outbreaks a year. Vertical lines mark the paper's differences for Listeria in dairy (1.7), Campylobacter in poultry (4.2), STEC O157 in meat (5.3) and Salmonella in eggs (10.1). Simulation, not the paper's data.</figcaption></figure>
<!-- /fig:power -->

**Step 3: what over-dispersion looks like.** In the Distribution explorer, a negative binomial with mean 3 and r = 5 has variance **4.8** instead of the Poisson's 3, and a **9.5 %** chance of a year with no outbreaks at all (Poisson: 5.0 %). Years of zero then a sudden 11, as in Figure 1, are normal for counts like these.

## How we made the graphs

The script `scripts/blog-figures/us-foodborne-outbreak-trends-1998-2018-mann-kendall-negative-binomial.mjs` imports `mannKendall`, `senSlope`, `senCI` and `pettitt` from `src/lib/sci/trend.ts` (the [[trend-analyser|Trend analyser]]) and `DIST.nbinom`, `rng` and `gammaDraw` from `src/lib/sci/distributions.ts` (the [[distribution-explorer|Distribution explorer]]). It draws negative binomial counts as a gamma-Poisson mixture with a fixed seed, so the charts are the same on every run. Inputs: the four windows and the differences of 10.1, 5.3, 4.2 and 1.7 outbreaks a year from the paper's text; the level of 2 outbreaks a year in the quieter window, the smooth (log-linear) shape and the sizes r = 2 and 5 are our assumptions. The script prints every number above and writes both charts into this article.

## How we test the maths

The Trend analyser is checked in `tests/sci.mjs` against pyMannKendall 1.4.3 on a made-up 50-value series: **S = 480**, Var(S) with ties **14,288.667**, **Z = 4.007187**, Sen slope **0.0152381** per step, and the Hamed-Rao autocorrelation correction p = 0.0107871. Ties matter for counts, which repeat often; a separate check confirms the tie correction against the textbook formula, and Pettitt's statistic is checked against a brute-force sum (K = 509). The Distribution explorer's 35 distributions, the negative binomial among them, are checked in `tests/sci-tools/distribution-explorer.mjs` against values from SciPy 1.18.1: probabilities, cumulative probabilities, quantiles and the mean, variance, skewness and kurtosis. All of these run on every change to the site with `npm test`.

## Check it yourself

1. Open the [[trend-analyser|Trend analyser]] and replace the example in *Time and value* with the made-up series from Figure 1, one year and count per line:

```
1998 7
1999 12
2000 27
2001 15
2002 8
2003 15
2004 4
2005 11
2006 12
2007 10
2008 9
2009 14
2010 1
2011 2
2012 1
2013 2
2014 1
2015 11
2016 0
2017 2
2018 1
```

2. Leave *Test* on **Mann-Kendall**. Type **outbreaks** in *Value unit (for labels)* and set *Report the slope per* to **1 time unit (year)**.
3. It reads **Significant decreasing trend**, about **−0.667 outbreaks per year** (95 % CI −1.08 to −0.25), p = 0.002. Under *Test*: **S = −102**, Z = −3.071. *Change point (Pettitt)*: between **2009 and 2010**.
4. Open the [[distribution-explorer|Distribution explorer]], choose **Negative binomial**, and set *Successes r* to **5** and *Probability p* to **0.625** (for mean μ and size r, p = r ÷ (r + μ) = 5 ÷ 8).
5. *Mean* reads **3** and *Variance* **4.8**. Set *Shade* to **Below b (left tail)** and *b* to **0**: the probability of a year with no outbreaks is about **0.095**.
6. Press **Draw sample** to see how lumpy 1,000 such years are.

## What researchers can use it for

- **Test a surveillance series.** Paste yearly or monthly case or outbreak counts into the [[trend-analyser]] for Mann-Kendall, the Sen slope and a change-point year in seconds.
- **Plan before analysing.** Simulate counts at your expected level and spread, as here, to see whether a rank test will have the power you need, or whether a count model is required.
- **Choose a distribution.** Compare Poisson and negative binomial spreads in the [[distribution-explorer]] before fitting a model in R or Python.
- **Look at the outbreak itself.** For one outbreak's onset dates and food history, the [[epi-curve]] draws the epidemic curve and the attack rates.
- **Teach** why counts of rare events need models built for counts, and why "no significant trend" is not proof of no change.

## The fine print

- Every series here is simulated; none of it is the CDC surveillance data. Only the window differences come from the paper.
- The paper's credible intervals come from a Bayesian model; the Mann-Kendall p-values here answer a different, simpler question.
- Reported outbreaks depend on how hard health departments look; better DNA fingerprinting since the 2010s finds more small, spread-out outbreaks, which can look like a rise.
- This is general education; for food safety rules, check the official source in your country.
