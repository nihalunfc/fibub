---
name: Sensor calibration
num: 870
shelf: science
section: atmospheric-chemistry-and-air-quality
title: "Low-cost air sensor calibration against a reference: clean spikes and stuck values, fit linear, RH-corrected or Deming models"
summary: "Paste or open a low-cost sensor's readings (with humidity and temperature if you have them) and a co-located reference. The page removes out-of-range, stuck and spike readings (Hampel filter), averages both to the same periods, fits a linear, multilinear (RH, T) or Deming calibration, reports R², RMSE, MAE and bias on fit and test periods, and applies the calibration to new data. CSV in and out."
status: live
ads: true
order: 870
icon: chart
works: offline
updated: 2026-11-09
related: [air-quality-calculator, calibration-curve, method-validation, data-cleaner, trend-analyser, gaussian-plume-calculator, bland-altman, calibration-drift, regression-workbench]
sources:
  - "Hampel filter, stuck-value and range checks, time averaging, ordinary least squares, Deming regression and the agreement metrics are written by fibub. The tests check them against pandas (rolling median and MAD, run lengths, resample with origin='epoch'), statsmodels OLS (coefficients, standard errors, R², adjusted R²), scipy.odr (Deming as orthogonal distance regression) and numpy."
  - "The method (co-location with a reference, then a regression with humidity and temperature terms, judged on data not used to fit) is general practice for low-cost sensors; no agency's coefficients or thresholds are copied."
  - "The example data (three weeks of particle readings, humidity, temperature and a reference) are made up by fibub."
flow:
  - { icon: table, label: "Data" }
  - { icon: scissors, label: "Clean" }
  - { icon: curve, label: "Fit" }
  - { icon: download, label: "Apply" }
---

## What it does

Low-cost air quality sensors are cheap enough to put everywhere, but their raw readings are rarely right. Particle sensors read high in humid air; gas sensors drift with temperature; any sensor can freeze, spike or log an error code. The usual fix is to run the sensor next to a reference instrument for a few weeks, then fit a **calibration** that turns the sensor's readings into reference-like values.

This page does the whole job in your browser:

1. **Cleans** the sensor data: removes readings outside a valid range (such as −999 error codes), runs of identical readings (a frozen sensor) and spikes (a Hampel filter).
2. **Aligns** the two series by averaging both over the same periods (for example one hour) and keeping periods where both have data.
3. **Fits** a calibration: reference = a + b × sensor, optionally with relative humidity and temperature terms, or a Deming line that allows for error in both instruments.
4. **Tests** it on the last part of the record, which the fit never saw, and reports R², RMSE, MAE and bias before and after.
5. **Applies** it to new sensor data and gives you a CSV.

Check how far the two instruments agree with a [[bland-altman]] plot, and turn the calibrated readings into an index with the [[air-quality-calculator]].

## How to use it

1. Paste or open the sensor data (a time column, the reading, and humidity and temperature if you have them) and the reference data (time and reading). Pick the columns if the guesses are wrong.
2. Set the valid range, the number of identical readings that count as stuck, the spike filter window and threshold, and the averaging period.
3. Choose a model and the share of periods to keep back for the test.
4. Read the equation, the coefficient table and the agreement table. Look at the scatter plot and the time series.
5. Paste new sensor readings under **Apply to new data** and download the calibrated CSV.

## Worked example

Press **Use the example**. It is made up: three weeks of 5-minute particle (PM2.5) readings from a sensor that reads about a quarter high and more so in humid air, with spikes, a 90-minute frozen spell and six −999 error codes, next to an hourly reference.

With the defaults (valid range 0 to 1000, stuck after 10 identical readings, spike window ±6 readings at 3 × MAD, hourly averages with at least 9 readings, linear with humidity, last 30 % for testing), the cleaning facts list the six out-of-range readings, the 18 stuck ones and the spikes removed. The equation reads like "Calibrated = a + b × sensor − c × RH", with b below 1 and a negative humidity term, because the made-up sensor reads high in humid air. In the agreement table, the raw sensor's bias of several µg/m³ falls to near zero after calibration, and RMSE drops too, in the test periods as well as the fit periods.

Try **Linear** alone: the test RMSE is higher, because the humidity effect is left in. Try **Deming** to see a line that treats both instruments as uncertain.

## Tips

- Co-locate for at least two to four weeks, covering the weather and pollution levels the sensor will see later. A calibration only holds within the conditions it was fitted on.
- Judge models on the **test** periods. Adding terms always improves the fit periods; it only helps if the test improves too.
- Check the time zones: if one logger writes UTC and the other local time, nothing lines up. The matched-periods count tells you quickly.
- Re-check the calibration every few months; sensors age.
- Humidity effects on particle sensors are often non-linear at very high humidity. Removing periods above about 90 % RH (with the valid range of a filtered file) can help.

## FAQ

**Which way round is the fit?** The reference is predicted from the sensor (reference = a + b × sensor + ...), so the equation applies straight to new sensor readings. Deming uses the same direction but allows error in both.

**What is λ in Deming regression?** The ratio of the reference's error variance to the sensor's. With λ = 1 both are taken as equally noisy (orthogonal regression). A very large λ gives ordinary least squares.

**Why are the averages "periods" and not times?** Each period starts at a whole multiple of the averaging time from midnight, and holds the readings from its start up to the next period. The reference's time should mark the start of its own averaging period too.

**Is my data uploaded?** No. Everything is worked out in this page and nothing leaves your device.
