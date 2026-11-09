---
name: Gravity model
num: 759
shelf: science
section: human-geography-and-urban-studies
title: "Gravity model calculator: fit trade or migration flows by OLS and PPML (free)"
summary: "Predict flows between places from their size and distance, or fit the gravity model to your own flows by log-linear least squares and Poisson pseudo-maximum likelihood (PPML). Distances from coordinates or your own."
status: live
ads: true
order: 759
icon: compass
works: offline
updated: 2026-11-09
related: [gps-track-analyser, trend-analyser, plot-maker, data-cleaner]
sources:
  - "Formulas: gravity model of spatial interaction (Tinbergen 1962; Zipf 1946); PPML estimator (Santos Silva and Tenreyro 2006); haversine great-circle distance; Earth mean radius 6,371.0088 km (IUGG)."
  - "Example data: made-up towns, coordinates and flows."
flow:
  - { icon: table, label: "Flows" }
  - { icon: ruler, label: "Distances" }
  - { icon: sigma, label: "Fit, predict" }
  - { icon: download, label: "Report" }
---

## What it does

The gravity model says that the flow between two places grows with their size and shrinks with the distance between them:

**F = k · Mo<sup>a</sup> · Md<sup>b</sup> / d<sup>c</sup>**

where Mo and Md are the "masses" of the origin and destination (population, GDP, jobs), d is the distance and c the **distance-decay exponent**. It is used for trade between countries, migration and commuting between towns, shopping trips and phone calls. This page does two things:

- **Fit from flows:** from a table of observed flows it estimates k, a, b and c in two ways, side by side: **log-linear least squares (OLS)** on log(flow), and **Poisson pseudo-maximum likelihood (PPML)**. Each estimate comes with its standard error and p-value, plus the observed-against-predicted chart and the predicted flow for every pair.
- **Predict flows:** with parameters you type in (or the ones you just fitted), it predicts the flow for every pair in your table, or for every pair of places in both directions.

Distances are worked out from latitude and longitude as great-circle distances in km (haversine formula), or you can give your own distances, such as road kilometres or travel times, in a fourth column of the flows table. Nothing is uploaded.

## How to use it

1. **Places:** one row per place with its name and mass, and latitude and longitude in decimal degrees (north and east positive).
2. **Flows:** one row per origin and destination with the observed flow. Add a fourth column if you have your own distances; then coordinates are not needed. Leave out flows from a place to itself.
3. Choose **Fit from flows** or **Predict flows**. When fitting, choose separate mass exponents for origin and destination, or one shared exponent for Mo × Md.
4. After a fit, **Predict with the PPML estimates** copies the fitted parameters into the predict form.
5. Download the pairs as CSV, or the full report as an image, PDF or Word file.

## OLS or PPML?

Taking logs turns the model into a straight line, ln F = ln k + a ln Mo + b ln Md − c ln d, which OLS can fit. But log(0) does not exist, so **zero flows must be dropped**, and when the scatter of flows grows with their size (as it nearly always does), the log-linear estimates are biased. PPML fits the model in its original form with a Poisson-style likelihood, keeps the zeros and stays consistent under that kind of scatter; Santos Silva and Tenreyro (2006) showed it is the safer choice, and it is now the standard method for trade gravity models. PPML standard errors here are heteroskedasticity-robust (sandwich, HC0), and the pseudo R² is the squared correlation between observed and predicted flows. The flows do not need to be whole numbers.

## Worked example

The example has seven made-up towns and 42 flows of movers, two of them zero. With separate mass exponents, PPML gives a = 0.949, b = 0.816 and a distance exponent **c = 1.66**, so doubling the distance divides the flow by about 3.17. OLS, which has to drop the two zero flows, gives c = 1.65 with R² = 0.916 on the log scale; the PPML pseudo R² is 0.924. Switch to **Predict flows** to try your own parameters, such as Newton's a = b = 1, c = 2.

## Tips

- The constant k depends on the units of mass, distance and flow; the exponents do not.
- For trade between countries, studies usually add origin and destination fixed effects, borders, common language and so on. This page fits the basic model only; use the CSV download to take the distances and data further in a statistics package.
- Very short distances get very large predicted flows. If you have flows between neighbouring places, consider road distances or travel times.

## FAQ

**Why are the OLS and PPML results different?** They weight the pairs differently: OLS on logs gives small flows as much say as large ones, while PPML is driven more by large flows. A big difference suggests the scatter grows with flow size, and PPML is then the one to trust.

**Can I use a single place list for both directions?** Yes. Flows from A to B and from B to A are separate rows and can have different sizes.

**Is my data sent anywhere?** No. Everything is worked out in this page.
