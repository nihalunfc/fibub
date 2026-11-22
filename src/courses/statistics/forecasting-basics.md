---
title: 'Simple forecasting and its uncertainty'
summary: 'Start every forecast with a naive baseline, try seasonal naive, moving averages and exponential smoothing, score them on held-out recent data with MAE and MAPE, and always give a range, not a single number.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Why compare every forecast with a naive one?'
    choices: ['Naive forecasts are always best', 'If a model cannot beat "same as last week", it adds complexity without value', 'It is required by law']
    ans: 1
    why: 'Simple baselines are surprisingly hard to beat for short horizons; they set the bar.'
  - q: 'How should you test a forecast?'
    choices: ['On the same data used to fit it', 'On the most recent period, hidden while fitting (a holdout at the end)', 'On a random sample of days']
    ans: 1
    why: 'Forecasts predict the future, so test on data that comes after the training data. Random splits leak the future into the past.'
  - q: 'A forecast says 1,200 units next month. What is missing?'
    choices: ['Nothing', 'A range (prediction interval), such as 1,050 to 1,350, so planners know how much buffer to keep', 'More decimal places']
    ans: 1
    why: 'A single number hides the uncertainty that drives stock and staffing decisions.'
sources:
  - 'Hyndman, R. J. and Athanasopoulos, G. (2021), Forecasting: Principles and Practice, 3rd edition, OTexts, Chapters 5 and 8 https://otexts.com/fpp3/'
  - 'Makridakis, S., Spiliotis, E. and Assimakopoulos, V. (2018), The M4 Competition: Results, findings, conclusion and way forward, International Journal of Forecasting 34(4), 802-808 https://doi.org/10.1016/j.ijforecast.2018.06.001'
---

**Module 8 · about 25 minutes · school maths.** You'll be able to build and score simple forecasts, choose between them on held-out data, and give a forecast with a range.

<div class="bigidea">Start every forecast from a naive baseline, score methods on recent data you held back, and always give a range, not just a number.</div>

**In everyday terms:** "tomorrow's weather will be like today's" is right surprisingly often. Any fancy forecast has to beat that simple guess on real past days before you trust it.

## 1. Four simple methods

1. **Naive:** tomorrow = today.
2. **Seasonal naive:** next Tuesday = last Tuesday (next December = last December).
3. **Moving average:** the mean of the last k periods.
4. **Exponential smoothing:** a weighted average where weights fall off for older data; α (0 to 1) sets how fast. Extensions (Holt, Holt-Winters) add a trend and a seasonal pattern.

<!--fig:forecast-compare-->

Switch methods and compare the errors. With a strong weekend effect, "same day last week" wins easily; drop the weekend boost to 0 and the smoothers catch up.

## 2. Testing a forecast honestly

- **Hold out the end:** fit on everything except the last few periods, forecast them, compare. Never test on random days; that lets the future leak into the past.
- **Rolling origin:** repeat for several cut-off dates and average the errors (like cross-validation for time; see [ML foundations](/learn/courses/ml-foundations/cross-validation/)).
- **Score:** **MAE** (average absolute miss, in units), **MAPE** (average percentage miss; breaks down near zero), **RMSE** (punishes big misses more).

Slide the window size and switch between trailing and centred.

<figure class="fig" data-fig="@data-rolling-window"><figcaption>Notice that a bigger window is smoother but later, and where the NaN values appear.</figcaption></figure>


## 3. Give a range

A point forecast will be wrong; the question is by how much. A simple honest range: look at your holdout errors and take their spread. If 80 % of past one-week-ahead errors were within ±12 %, give "1,200 (80 % range 1,060 to 1,340)". Ranges grow with the horizon: next week is more certain than next quarter.

## 4. When simple isn't enough

Several seasonal cycles (hour and weekday and year), holidays, promotions, prices and weather as drivers: these call for regression with calendar features, Holt-Winters, ARIMA-type models or forecasting libraries. Even then, report the baseline beside the model.

<div class="meaning">

<dl>
<dt>Naive forecast</dt><dd>Next value = last value.</dd>
<dt>Seasonal naive</dt><dd>Next value = same period last season.</dd>
<dt>Exponential smoothing</dt><dd>New forecast = α × latest value + (1 − α) × old forecast.</dd>
<dt>MAE</dt><dd>Mean absolute error: the average size of the misses, in the data's units.</dd>
<dt>Physical meaning</dt><dd>A forecast error is the part of tomorrow the past could not see. Its size on held-out weeks is the honest width of your forecast range.</dd>
</dl>

</div>

<div class="myth">

**"The model fits past data well, so it will forecast well."** Fitting the past is easy; forecasting is tested only on data the model has not seen. Hold out the latest weeks and score every method on them.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Hold out.</b> Keep the last 4 weeks back; forecast each from the weeks before it.</div>
<div class="step"><b>Naive.</b> Use last week's orders as the forecast. Note each miss.</div>
<div class="step"><b>Smoothing α = 0.3.</b> Forecast = 0.3 × latest + 0.7 × previous forecast. Note each miss.</div>
<div class="step"><b>Score.</b> Average absolute miss (MAE) for each method; lowest wins.</div>
<div class="step"><b>Range.</b> Next week = winner's forecast ± about 2 × the SD of its misses.</div>
</div>

<div class="problem" data-problem="smoothing-step"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a forecast is only as good as its errors on data it has not seen.

**Exponential smoothing:**

```math
\ell_t = \alpha\, y_t + (1 - \alpha)\, \ell_{t-1}, \qquad \hat y_{t+h} = \ell_t
```

Unrolled, the weight on data `$j$` periods old is `$\alpha(1-\alpha)^j$`: α = 0.3 puts 30 % on today, 21 % on yesterday, 15 % on the day before, and so on.

**Errors** (actual `$y$`, forecast `$\hat y$`, n periods):

```math
\text{MAE} = \frac{1}{n}\sum |y - \hat y|, \quad \text{MAPE} = \frac{100}{n}\sum \left|\frac{y - \hat y}{y}\right|, \quad \text{RMSE} = \sqrt{\frac{1}{n}\sum (y - \hat y)^2}
```

**Range from errors:** if past errors are roughly normal with SD `$s$`, an 80 % range is `$\hat y \pm 1.28s$` and a 95 % range `$\hat y \pm 1.96s$`.
</details>

## 5. Worked example

*Made-up data:* weekly orders, forecasting next week. The last four weeks were held out.

| Week | Actual | Naive | 4-week average | Smoothing (α = 0.3) |
|---|---|---|---|---|
| 1 | 1,180 | 1,150 | 1,120 | 1,135 |
| 2 | 1,240 | 1,180 | 1,140 | 1,149 |
| 3 | 1,210 | 1,240 | 1,165 | 1,176 |
| 4 | 1,260 | 1,210 | 1,195 | 1,186 |
| MAE | | 42.5 | 67.5 | 61 |

- Naive wins here: orders are trending up, and averages lag behind a trend.
- That points to adding a trend term (Holt's method) rather than abandoning simple methods.
- Naive's errors on the holdout had SD about 40. Forecast for next week: 1,260, 80 % range about 1,210 to 1,310 (four errors is a thin basis; use more weeks in practice).

## 6. Practice

1. Actuals 100, 120, 90; forecasts 110, 110, 110. MAE and MAPE?
2. Why does a moving average lag behind a trending series?
3. Your model's MAE is 52 and seasonal naive's is 50. What do you recommend?

<details>
<summary>Answers</summary>

1. Errors 10, 10, 20: MAE = 13.3. Percentages 10 %, 8.3 %, 22.2 %: MAPE ≈ 13.5 %.
2. It averages past values, which are all lower than today's when the series is rising, so it trails by about half its window.
3. Use seasonal naive: it's simpler and at least as accurate. Revisit the model if it can add something the baseline can't, such as promotion effects.
</details>

**Try it on your own data:** the [[time-series-analyser]] tool fits ARIMA forecasts with 80 % and 95 % ranges to your own series; [[regression-workbench]] fits trends with calendar dummy columns.

**New words:** *naive forecast*, *seasonal naive*, *exponential smoothing*, *holdout*, *rolling origin*, *MAE*, *MAPE*, *RMSE*, *prediction interval*.

<div class="keypoints">

- Always compare with naive and seasonal-naive baselines.
- Score methods on held-out recent data (MAE, MAPE).
- Exponential smoothing: forecast = α × latest + (1 − α) × previous forecast.
- Give a range from the size of past errors.

</div>
