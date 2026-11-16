---
title: "Abaya-Chamo rainfall and temperature trends: Mann-Kendall and Sen slope"
summary: "A PLOS ONE study finds flat rainfall but warming days in Ethiopia's Abaya-Chamo escarpment. We use the Trend analyser to test how strong a trend 33 years can show."
tools: [trend-analyser]
updated: 2026-11-16
sources:
  - "Shomre, M. W., Meskele, D. Y. and Beyene, Y. (2026), Examination of hydro climatic trend and drought analysis for climate resilience in the eastern escarpment of Abaya Chamo sub-basin, Rift Valley Lake Basin, Ethiopia, PLOS ONE 21(8): e0354913, doi:10.1371/journal.pone.0354913. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the article's text: six weather stations (Fisehagenet, Hageremariam, Yirgachefe, Arbaminch, Dilla, Hagereselam); weather data 1987 to 2019; elevation about 1,100 to 3,045 m; straight-line R² of annual rainfall 0.0007, 0.78, 0.006, 1.21, 31.6 and 0.13 % (Fisehagenet, Hageremariam, Yirgachefe, Dilla, Hagereselam, Arbaminch); of maximum temperature 65.51, 36.06, 42.29, 61.74, 10.93 and 0.0004 % (Fisehagenet, Hageremariam, Arbaminch, Hagereselam, Dilla, Yirgachefe); of minimum temperature 44.58, 16.62, 1.59, 34.26, 1.59 and 35.1 % (Fisehagenet, Hageremariam, Dilla, Hagereselam, Arbaminch, Yirgachefe); which stations reject 'no trend'; SPI-6 lowest values -3.31 (Yirgachefe, 2010-2011) and -2.41 (Arbaminch, 2010-2011)."
  - "Mann, H. B. (1945), Nonparametric tests against trend, Econometrica 13, 245-259; Kendall, M. G. (1975), Rank Correlation Methods, Griffin (the Mann-Kendall test)."
  - "Sen, P. K. (1968), Estimates of the regression coefficient based on Kendall's tau, J. Am. Stat. Assoc. 63, 1379-1389 (the Sen slope); Hamed, K. H. and Rao, A. R. (1998), A modified Mann-Kendall trend test for autocorrelated data, J. Hydrol. 204, 182-196."
  - "Hussain, M. M. and Mahmud, I. (2019), pyMannKendall: a python package for non parametric Mann Kendall family of trend tests, J. Open Source Softw. 4(39), 1556 (the reference values in fibub's tests)."
paper:
  title: "Examination of hydro climatic trend and drought analysis for climate resilience in the eastern escarpment of Abaya Chamo sub-basin, Rift Valley Lake Basin, Ethiopia"
  authors: "Shomre, M. W.; Meskele, D. Y.; Beyene, Y."
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0354913"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0354913"
  licence: "CC BY 4.0"
  reviewed: true
---

The eastern escarpment of the Abaya-Chamo sub-basin climbs from the lakes of Ethiopia's Rift Valley, at about 1,100 m, to highlands over 3,000 m, where farmers grow coffee and enset. A new PLOS ONE study looks at 33 years of weather at six stations there and asks whether rain and temperature are changing. Its tools are the classic pair for climate series: the **Mann-Kendall test**, which asks whether values tend to rise or fall over time, and the **Sen slope**, which says by how much. This article shows how the [[trend-analyser]] runs the same tests in a browser, and uses it to ask a question every trend study raises: how strong must a trend be before 33 years of data can show it?

## The paper in brief

The team gathered rainfall and maximum and minimum temperatures from six stations for 1987 to 2019, filled gaps, and tested each station for a trend. They also measured drought with the Standardised Precipitation Index (SPI, how far a period's rain is below normal, in standard deviations) and a related index, and described the river flow at one gauging station.

- **Rainfall:** no significant trend at five stations; a significant rise at Hagereselam. Arbaminch's slope was slightly negative, the others slightly positive.
- **Maximum temperature:** significant trends at five stations. The slope was positive at four and negative at Dilla.
- **Minimum temperature:** significant trends at three stations (Fisehagenet, Yirgachefe, Hagereselam).
- **Drought:** the worst 6-month SPI values came in 2010-2011, as low as **-3.31** at Yirgachefe (below -2 counts as extreme drought).

The paper's slopes and Z values are in tables printed as images, and a few passages disagree with each other (for example, whether five or six stations were tested for rainfall, and whether maximum temperature fell or rose slightly at Yirgachefe). What the text does state for every station is the **R²** of a straight line through each series, the share of the year-to-year variation the line explains. We work from those.

## Checked with the tools

We did not have the station data, so everything below is a **simulation**, labelled as such. For each station we built made-up 33-year series whose straight-line R² equals exactly the R² the paper states, then ran them through the Trend analyser's own maths (Mann-Kendall, Sen slope, Hamed-Rao). This checks whether the paper's verdicts fit its R² values, and shows what a trend of that size looks like.

**Step 1: a station with a real trend.** Figure 1 is one made-up series with Hagereselam's R² of 31.6 %, assuming a mean of 1,100 mm and a spread (standard deviation) of 180 mm a year. Mann-Kendall gives **Z = 3.24, p = 0.0012**: clearly significant. The Sen slope is **+109 mm per decade** (95 % interval 48 to 164 mm), about 350 mm over the 32 years. The mean and spread are our assumptions; the R² alone fixes the test result, not the size of the slope.

<!-- fig:series -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="A made-up rainfall series shaped like the paper's Hagereselam station: Mann-Kendall Z = 3.24, p = 0.0012, Sen slope about 109.4 mm per decade." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A simulated 33-year rainfall series with R² = 31.6 %</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A simulated 33-year rainfall series with R² = 31.6 %</text><line x1="58" x2="546" y1="220.2" y2="220.2" style="stroke:var(--line)"/><text x="52" y="224.2" text-anchor="end" style="fill:var(--muted)">800</text><line x1="58" x2="546" y1="173" y2="173" style="stroke:var(--line)"/><text x="52" y="177" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="125.9" y2="125.9" style="stroke:var(--line)"/><text x="52" y="129.9" text-anchor="end" style="fill:var(--muted)">1.2e+3</text><line x1="58" x2="546" y1="78.7" y2="78.7" style="stroke:var(--line)"/><text x="52" y="82.7" text-anchor="end" style="fill:var(--muted)">1.4e+3</text><line x1="115.4" x2="115.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="115.4" y="269" text-anchor="middle" style="fill:var(--muted)">1.99e+3</text><line x1="258.9" x2="258.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="258.9" y="269" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="402.5" x2="402.5" y1="252" y2="256" style="stroke:var(--muted)"/><text x="402.5" y="269" text-anchor="middle" style="fill:var(--muted)">2.01e+3</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">2.02e+3</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Year</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Annual rainfall (mm, simulated)</text><circle cx="72.4" cy="207" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="86.7" cy="241.2" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="101.1" cy="156.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="115.4" cy="183.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="129.8" cy="188.1" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="144.1" cy="144.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="158.5" cy="146.6" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="172.8" cy="199.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="187.2" cy="188.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="201.5" cy="201.1" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="215.9" cy="129" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="230.2" cy="120" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="244.6" cy="170.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="258.9" cy="126.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="273.3" cy="108.7" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="287.6" cy="213.6" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="165.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="316.4" cy="177.3" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="330.7" cy="171.2" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="345.1" cy="154.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="359.4" cy="66.7" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="373.8" cy="123.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="388.1" cy="60.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="402.5" cy="149.2" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="416.8" cy="163.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="431.2" cy="95.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="445.5" cy="76.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="459.9" cy="181.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="474.2" cy="114.1" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="488.6" cy="120.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="502.9" cy="143.8" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="517.3" cy="115.5" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="531.6" cy="125.9" r="3" style="fill:var(--c-blog);opacity:1"/><path d="M72.4 190.5L531.6 108" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated year</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="200.8" y="40" style="fill:var(--muted)">Sen slope +109.4 mm per decade</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. A simulated 33-year series built to have the R² the paper states for Hagereselam (31.6 %), with the Sen slope line from the Trend analyser's maths. Mean and spread are our assumptions; this is not the station's data.</figcaption></figure>
<!-- /fig:series -->

**Step 2: how strong a trend 33 years can show.** We repeated the experiment 200 times for each R² from 0 to 40 %. Figure 2 shows the median p-value. With 33 yearly values, Mann-Kendall reaches p = 0.05 at a straight-line R² of about **12 %**. Below that, a trend is usually missed; above it, usually found. With 396 monthly values (33 years of months, with the seasonal cycle removed), the line falls to about **1 %**: more values make smaller trends visible.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="With 33 yearly values, Mann-Kendall reaches p = 0.05 at a straight-line R² of about 12.4 %; with 396 monthly values, at about 1.0 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How strong a straight-line trend Mann-Kendall needs</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How strong a straight-line trend Mann-Kendall needs</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="211.6" y2="211.6" style="stroke:var(--line)"/><text x="52" y="215.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="171.2" y2="171.2" style="stroke:var(--line)"/><text x="52" y="175.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--line)"/><text x="52" y="134.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Straight-line R² (%)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Median Mann-Kendall p (simulated)</text><line x1="58" x2="546" y1="241.9" y2="241.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="236.9" text-anchor="end" style="fill:var(--muted)">p = 0.05</text><path d="M58 77.3L70.2 129L82.4 157.8L106.8 194.4L131.2 214.1L155.6 226.8L180 234.7L204.4 240.5L228.8 244.1L253.2 247L302 249.7L363 251.1L424 251.6L546 252" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 70.8L70.2 241.6L82.4 250.8L106.8 252L131.2 252L155.6 252L180 252L204.4 252L228.8 252L253.2 252L302 252L363 252L424 252L546 252" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="58" cy="72.4" r="4" style="fill:var(--ink);opacity:1"/><circle cx="67.5" cy="115.5" r="4" style="fill:var(--ink);opacity:1"/><circle cx="58.1" cy="72.4" r="4" style="fill:var(--ink);opacity:1"/><circle cx="72.8" cy="129" r="4" style="fill:var(--ink);opacity:1"/><circle cx="443.5" cy="251.7" r="4" style="fill:var(--ink);opacity:1"/><circle cx="59.6" cy="77.3" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">33 annual values</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="215.2" y="40" style="fill:var(--muted)">396 monthly values</text><circle cx="359.8" cy="36" r="4" style="fill:var(--ink)"/><text x="370.8" y="40" style="fill:var(--muted)">Rainfall stations (paper R²)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Median Mann-Kendall p-value of simulated series against their straight-line R², for 33 yearly and 396 monthly values, with the six rainfall stations placed at the R² the paper states. Simulation, not the paper's data.</figcaption></figure>
<!-- /fig:power -->

**Step 3: station by station.** The table puts the paper's verdict beside what the simulation expects for 33 yearly values with the same R². "Share significant" is how many of 200 simulated series Mann-Kendall flags at the 5 % level.

| Series and station | R² in the paper | Paper: significant? | Median p (simulated) | Share significant |
|---|---|---|---|---|
| Rainfall, Hagereselam | 31.6 % | yes | 0.0012 | 100 % |
| Rainfall, Dilla | 1.21 % | no | 0.59 | 0 % |
| Rainfall, other four | 0.0007 to 0.78 % | no | 0.65 to 0.86 | 0 % |
| Max temperature, Fisehagenet | 65.51 % | yes | 3.4 × 10⁻⁷ | 100 % |
| Max temperature, Hageremariam | 36.06 % | yes | 0.0005 | 100 % |
| Max temperature, Dilla | 10.93 % | yes | 0.07 | 29 % |
| Max temperature, Yirgachefe | 0.0004 % | no | 0.86 | 0 % |
| Min temperature, Hageremariam | 16.62 % | no | 0.023 | 93 % |
| Min temperature, Dilla and Arbaminch | 1.59 % | no | 0.53 | 0 % |
| Min temperature, Yirgachefe | 35.1 % | yes | 0.0006 | 100 % |

Sixteen of the eighteen verdicts match what the R² values lead us to expect. Two sit near the edge: **Dilla's maximum temperature** (R² 10.93 %, called significant, where most simulated series are not) and **Hageremariam's minimum temperature** (R² 16.62 %, called not significant, where most simulated series are). Neither is an error in itself: Mann-Kendall works on ranks and a straight line on values, so outliers, a step change or year-to-year persistence can pull them apart, and the paper may have tested monthly rather than yearly values. They are the two series a reader would re-run first with the station data. If the temperature tests used monthly values, the threshold drops to about 1 % and Hageremariam's 16.62 % should certainly be significant, which suggests the tests were run on fewer values.

## How we made the graphs

The script `scripts/blog-figures/abaya-chamo-rainfall-temperature-trends-mann-kendall-sen-slope.mjs` imports `mannKendall`, `hamedRao`, `senSlope` and `senCI` from `src/lib/sci/trend.ts`, the same functions the Trend analyser runs in the page. It builds each simulated series as a straight line plus random noise, with the noise made exactly uncorrelated with time and scaled so the line's R² is the paper's value; a fixed random seed makes the charts the same on every run. Inputs: R² values, station names, verdicts and the 1987-2019 period from the paper's text; the 1,100 mm mean and 180 mm spread are our assumption; 200 simulated series per point (60 for the monthly curve). The script prints every number in this article and writes both charts into it.

## How we test the maths

The Trend analyser's maths is checked in `tests/sci.mjs` against pyMannKendall 1.4.3, a published open-source package, on a made-up 50-year series with ties:

- Mann-Kendall **S = 480**, Var(S) with the tie correction **14,288.667**, **Z = 4.007187**, p = 6.14461 × 10⁻⁵ and tau = 0.391837.
- Sen slope **0.0152381** per step, with the 95 % interval 0.0086957 to 0.0222771 (Gilbert's method).
- Hamed-Rao corrected **p = 0.0107871** (all lags) and 0.0268602 (first 3 lags), and the seasonal test's S = 163 and Var(S) = 1,499 on made-up monthly data.

A rising series 1 to 10 must give S = 45, Var(S) = 125 and tau = 1. These checks run on every change to the site, with `npm test`.

## Check it yourself

1. Open the [[trend-analyser|Trend analyser]] and clear the example in *Time and value*.
2. Paste this made-up series (the one in Figure 1), a year and a value on each line, separated by a tab or a space:

```
1987 856
1988 711
1989 1070
1990 956
1991 936
1992 1120
1993 1112
1994 886
1995 933
1996 881
1997 1187
1998 1225
1999 1009
2000 1198
2001 1273
2002 828
2003 1032
2004 982
2005 1008
2006 1077
2007 1451
2008 1209
2009 1476
2010 1101
2011 1041
2012 1329
2013 1410
2014 964
2015 1250
2016 1221
2017 1124
2018 1244
2019 1200
```

3. Leave *Test* on **Mann-Kendall** and *Significance level* on **5 % (95 % confidence)**. Type **mm** in *Value unit (for labels)* and keep *Report the slope per* on **10 time units (decade)**.
4. The result reads **Significant increasing trend**, about **+109 mm per decade**, with p = 0.001. Under *Test* you should see **S = 210** and **Z = 3.238**; *Kendall's tau* is **0.398**, and *Change over the record* about **+349 mm**.
5. Switch *Test* to **Mann-Kendall, corrected for autocorrelation (Hamed-Rao, all lags)**. *Autocorrelation correction* reads **Var(S) × 0.853**: the made-up series happens to have a little negative year-to-year persistence, so the trend becomes slightly more certain (p about 0.0005). With positive persistence, common in river and lake series, the factor is above 1 and p rises.
6. Now paste a real station's yearly totals from your own records and compare.

## What researchers can use it for

- **Sanity-check a trend table.** Paste a station's series into the [[trend-analyser]] and compare S, Z, p and the Sen slope with a paper's table, as reviewers of climate papers often need to.
- **Plan a study.** Before collecting data, simulate series like ours to see whether 20, 30 or 50 years can detect the size of change you expect.
- **Allow for persistence.** River flow and lake levels carry over from one year to the next; the Hamed-Rao option shows how much that weakens a trend's certainty.
- **Find when things changed.** The tool's Pettitt test marks the most likely year of a step change, which the paper did not test for.
- **Teach** the difference between "no trend" and "no significant trend" with real-sized series.

## The fine print

- Every series here is simulated from R² values in the paper's text; none of it is the stations' data.
- R² comes from a straight line on the values; Mann-Kendall uses ranks. They usually agree, but not always, so our "expected" verdicts are a guide, not a re-analysis.
- We assumed yearly values (33 per station); the paper's tables may use other time steps.
- The SPI drought values are quoted from the paper; we did not recompute them.
