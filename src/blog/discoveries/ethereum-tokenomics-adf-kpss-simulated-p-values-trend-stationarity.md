---
title: "Unit root tests on Ethereum data: which test did the paper run?"
summary: "A 2026 study of Ethereum on-chain data prints ADF and KPSS statistics for 108 months. fibub's simulation reproduces every ADF p-value to 0.004 and shows the KPSS column used a trend, not a level."
tools: [unit-root-cointegration, time-series-analyser, regression-ols-iv-panel]
updated: 2026-11-24
sources:
  - "Mohammad, Z. A., Harkiolakis, N. and Sarbazvatan, S. (2026), Ethereum tokenomics and token value: a quantitative analysis of on-chain fundamentals (2021-2025), Frontiers in Blockchain 9: 1817622, doi:10.3389/fbloc.2026.1817622. Licence CC BY 4.0, taken from the Crossref record (api.crossref.org/works, checked 2026-11-24; no update-to or correction); the page text we read did not show a licence line. Only the statistics and p-values of its Table 2 were used."
  - "Tests: Dickey and Fuller (1979); Kwiatkowski, Phillips, Schmidt and Shin (1992). The tool's critical values and p-values come from a seeded simulation, not from published tables."
paper:
  title: "Ethereum tokenomics and token value: a quantitative analysis of on-chain fundamentals (2021-2025)"
  authors: "Mohammad ZA, Harkiolakis N, Sarbazvatan S"
  journal: "Frontiers in Blockchain"
  year: 2026
  doi: "10.3389/fbloc.2026.1817622"
  url: "https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2026.1817622/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Before you relate one time series to another, you have to know whether each one wanders like a random walk (has a **unit root**) or keeps returning to a mean or trend (is **stationary**). A 2026 paper on Ethereum's on-chain data runs two standard tests for this, ADF and KPSS, on six monthly series, and prints the statistics and p-values. That is enough to ask which version of each test was run, since the paper does not say. The [[unit-root-cointegration]] can answer, and the [[time-series-analyser]] and [[regression-ols-iv-panel]] are the natural steps before and after.

## The paper in brief

The authors collect 108 monthly observations of Ethereum's price, fees, burned coins, total value locked in apps, token unlocks and an inequality index (a Gini coefficient of holdings), and ask which on-chain fundamentals go with the token's price. Their Table 2 shows that all six series are non-stationary in levels and stationary after one difference, so they are "I(1)", and their Table 3 then runs a Johansen cointegration test on five of the series. The paper says the test choices are automatic and does not state the lags or whether a trend was included.

## Checked with the tools

We took the printed test statistics and asked the tool's simulation what p-value each deserves for 108 observations.

**ADF in levels.** The Augmented Dickey-Fuller test has a unit root as its null hypothesis, so a small p-value means "stationary". The statistics run from −2.25 to −1.55. With a constant and no trend, the simulated p-values are 0.192, 0.373, 0.433, 0.506, 0.334 and 0.471. The paper prints 0.188, 0.372, 0.435, 0.509, 0.331 and 0.474. The largest gap is 0.004, which is the size of the simulation error. With a constant and a trend the same statistics would give 0.46 to 0.81, so the paper's ADF used a **constant only**. The lags are not given, but moving from 107 to 100 regression rows changes no p-value by more than 0.002, so the lag choice does not matter here.

<!-- fig:adf -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Six points lie on the diagonal: the simulated p-values with a constant (0.19, 0.37, 0.43, 0.51, 0.33, 0.47) equal the paper's within 0.003." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Dickey-Fuller p-values: paper against the tool</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Dickey-Fuller p-values: paper against the tool</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="155.6" x2="155.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="155.6" y="289" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="253.2" x2="253.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="253.2" y="289" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="350.8" x2="350.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="350.8" y="289" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="448.4" x2="448.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="448.4" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Paper's p-value</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Simulated p-value (constant only)</text><path d="M546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="143.9" cy="231.2" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="323.5" cy="150.9" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="385" cy="123.9" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="457.2" cy="91.5" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="283.5" cy="167.9" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="423" cy="107.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/><text x="74" y="40" style="fill:var(--muted)">equal</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">ADF in levels</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Six unit-root p-values from the paper, recomputed with the tool's own simulation for a constant and about 107 rows.</figcaption></figure>
<!-- /fig:adf -->

The first-difference statistics, −4.8 to −10.9, are far out in the tail of the simulated distribution (p below 0.001 for all six), so "stationary after one difference" is well supported.

**KPSS in levels.** KPSS flips the null hypothesis: stationarity is assumed, and a large statistic rejects it. The paper's six statistics are 0.250, 0.145, 0.139, 0.345, 0.305 and 0.254, with p-values 0.010, 0.051, 0.063, 0.010, 0.010 and 0.010. The 0.010 entries are the usual floor of a printed table. The two non-floor entries are the clue. Tested against **level** stationarity, a statistic of 0.145 has a p-value of 0.42 and none of the six series would be rejected. Tested against **trend** stationarity, 0.145 has p = 0.053 and 0.139 has p = 0.062, which match the paper's 0.051 and 0.063. So the KPSS column was run with a trend, while the ADF column used only a constant. Two different null hypotheses were applied to the same series, which the paper does not say.

<!-- fig:kpss -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Six KPSS statistics between 0.139 and 0.345. All lie below the level-stationary 5 percent limit of 0.464; four lie above the trend-stationary limit of 0.148." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>KPSS statistics against 5 % limits</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">KPSS statistics against 5 % limits</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="209.6" y2="209.6" style="stroke:var(--line)"/><text x="52" y="213.6" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="120.8" y2="120.8" style="stroke:var(--line)"/><text x="52" y="124.8" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="76.4" y2="76.4" style="stroke:var(--line)"/><text x="52" y="80.4" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="98.7" x2="98.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="98.7" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="180" x2="180" y1="254" y2="258" style="stroke:var(--muted)"/><text x="180" y="271" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="261.3" x2="261.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="261.3" y="271" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="342.7" x2="342.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="342.7" y="271" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="424" x2="424" y1="254" y2="258" style="stroke:var(--muted)"/><text x="424" y="271" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="505.3" x2="505.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="505.3" y="271" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Variable (1 Price, 2 Fees, 3 Burns, 4 TVL, 5 Unlocks, 6 Gini)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">KPSS statistic</text><line x1="58" x2="546" y1="188.4" y2="188.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="183.4" text-anchor="end" style="fill:var(--muted)">trend-stationary 5 % limit 0.148</text><line x1="58" x2="546" y1="48.2" y2="48.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="43.2" text-anchor="end" style="fill:var(--muted)">level-stationary 5 % limit 0.464</text><circle cx="98.7" cy="143" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="189.6" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="261.3" cy="192.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="342.7" cy="100.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="118.6" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="141.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="18" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>The paper's KPSS statistics against simulated 5 % limits for 108 observations and no lags. The paper's p-values only make sense against the lower, trend-stationary limit.</figcaption></figure>
<!-- /fig:kpss -->

Two consequences follow. First, the text says stationarity was rejected for all six series, but at 5 % the trend-version limit is 0.148 for no lags (0.139 with ten), so ln(Fees) is borderline and ln(Burns) is not rejected at 5 %. Second, the paper's first-difference KPSS statistics read as clean "stationary" only under the level version: the trend version would reject for ln(TVL) (0.363, p below 0.001) and for ln(Unlocks) (0.184, p = 0.02). The level-stationary and trend-stationary readings cannot both be right, and the table does not say which was meant for the differences.

We could not check the Johansen trace table: the tool does Engle-Granger cointegration, not Johansen.

## How we made the graphs

Both charts and every number come from `scripts/blog-figures/ethereum-tokenomics-adf-kpss-simulated-p-values-trend-stationarity.mjs`. It calls `simulateNull`, `normalRng`, `simPValue` and `criticalValues` from `src/lib/sci/unitroot.ts`, the maths behind the [[unit-root-cointegration]]: 20,000 random walks (ADF) or white-noise series (KPSS) under the null, seed 1, as the page does it. The inputs are the statistics and p-values of the paper's Table 2 and N = 108. **Our assumptions:** 107 regression rows for the ADF (no lags), and no lags for the KPSS limits, since the paper does not give lags; we also ran 100 rows and 4 and 10 KPSS lags to show how little they move the result.

## How we test the maths

`tests/sci-tools/unit-root-cointegration.mjs` runs on every change to fibub:

- The ADF, KPSS and Engle-Granger statistics must match statsmodels to nine significant figures in 53 cases, on all lag rules and deterministic terms.
- Simulated critical values for 117 rows with a constant must be near statsmodels' −3.49, −2.89 and −2.58.
- New with this article: for 107 rows with a constant, the simulated p-values of the paper's six ADF statistics must stay within 0.01 of the printed ones, and the KPSS statistic 0.145 must give p near 0.05 for a trend but above 0.3 for a level.

## Check it yourself

The page tests data you paste in, so we use its own made-up example (120 months, series `price_a`) to show the same trap: the answer to "is it stationary?" depends on which version you ask.

1. On the [[unit-root-cointegration]], leave the example data and choose **ADF**, series `price_a`, *Deterministic terms* **Constant**, *Lags* **Chosen by AIC**, 10,000 samples, seed 1. You should see a statistic of **−1.702** on **119** rows and a simulated p-value of about **0.43**.
2. Change *Deterministic terms* to **Constant and trend**: the statistic becomes **−2.806** and p about **0.20**. Neither rejects a unit root.
3. Choose **KPSS** with **Level (constant)**: the statistic is **1.708** with 6 lags, p below **0.001**: stationarity around a level is rejected.
4. Choose **Trend**: the statistic is **0.070** with 5 lags and p about **0.41**: trend stationarity is not rejected.

The same series fails one KPSS and passes the other. That is exactly the ambiguity in the paper's Table 2.

## What researchers can use it for

- **Say which test you ran**: report constant or trend, lags and the source of the p-value, so a reader can reproduce it.
- **Reverse-engineer a printed table**: if a p-value does not fit one version of the test, try the other, as here.
- **Pair ADF and KPSS correctly**: ADF with a constant against KPSS with a level, or both with a trend, never a mix.
- **Teach** why a unit-root verdict can differ by test version, using the example data.
- **Check short samples**: with 108 months, the tool's simulation gives sample-size-specific limits instead of asymptotic ones.

## The fine print

- The paper's N = 108 may not equal the number of rows in each regression; we show the answer does not change for 100 to 107 rows.
- Our p-values are simulated (standard error about 0.003); the paper's are probably from a table or a package, so tiny gaps are expected.
- The match of KPSS to the trend version rests on two p-values (0.051 and 0.063). It is an inference, not a statement from the authors.
- Statistics given as p = 0.010 are probably table floors; we do not read them as exact.
- We did not check the Johansen test, the error-correction model or any claim about what drives the token's price.
