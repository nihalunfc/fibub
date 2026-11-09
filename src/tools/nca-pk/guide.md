---
name: Non-compartmental PK analysis (NCA)
num: 474
shelf: science
section: pharmacology
title: "NCA pharmacokinetics calculator: AUC, Cmax, half-life, lambda_z, MRT, clearance and volume from a concentration-time table"
summary: "Paste a measured concentration-time profile and get Cmax, Tmax, AUC0-t by linear or linear-up/log-down trapezoids, the terminal slope lambda_z by best fit or chosen points, half-life, AUC0-inf, % extrapolated, AUMC, MRT, and CL/F and Vz/F from the amount given in your study."
status: live
ads: false
order: 14
icon: curve
works: offline
updated: 2026-11-09
related: [dose-response, binding-curve-fitter, enzyme-kinetics-fitter, lc50-probit, decay-calculator, reaction-kinetics-fitter, plot-maker, calibration-curve, pk-simulator]
sources:
  - "Method: M. Gibaldi and D. Perrier, Pharmacokinetics (2nd ed., Marcel Dekker 1982): AUC, AUMC, MRT, clearance and volume by statistical moments; K. Yamaoka, T. Nakagawa and T. Uno, J. Pharmacokinet. Biopharm. 6 (1978) 547: statistical moments in pharmacokinetics; the linear-up/log-down rule as in Phoenix WinNonlin's user guide. Terminal-point selection (adjusted R², ties within 0.0001 go to more points) as in PKNCA: W. S. Denney, S. Duvvuri and C. Buckeridge, J. Pharmacokinet. Pharmacodyn. 42 (2015) S65. Formulas only; no tables copied."
  - "Calculations written by fibub. Checked in the tests against an independent NumPy implementation of the same conventions (58 random profiles, all routes and both AUC methods, agreement to 1 part in 10¹³) and against the closed form for an exact exponential (AUC0-inf = C0/k, MRT = 1/k)."
  - "The example profile is made up (an invented oral drug)."
flow:
  - { icon: table, label: "Profile" }
  - { icon: sigma, label: "AUC" }
  - { icon: curve, label: "Lambda z" }
  - { icon: download, label: "Report" }
---

## What it does

Non-compartmental analysis (NCA) is the standard first look at a pharmacokinetic study. It needs no model of the body: it takes the measured concentrations at each sampling time and works out the peak, the area under the curve and the terminal slope directly. This page does the whole NCA for one profile (one subject, one administration) in your browser, using the same conventions as the common packages (PKNCA in R and Phoenix WinNonlin), and draws the curve with the terminal fit.

It is for study and teaching, not medical advice. It analyses numbers you measured; it never suggests what amount of a drug to give.

Turn instrument readings into concentrations with the [[calibration-curve|calibration curve tool]], and see how a model regimen behaves with the [[pk-simulator|PK simulator]].

## How to use it

1. **Paste the profile**: time in the first column, concentration in the second, one sampling time per row. A header row is fine. Enter values below the limit of quantification as 0. Or use **Open a file** for a CSV or Excel sheet.
2. Choose the **route**. After oral or other extravascular administration and after an infusion, a concentration of 0 is added at time 0 if you did not give one. After an **IV bolus**, the concentration at time 0 (C0) is back-extrapolated from the first two points on a log scale (or set to the first value if they do not fall). For an **infusion**, enter its duration: the mean residence time is reduced by half of it.
3. Choose the **AUC method**. *Linear trapezoid* joins points with straight lines. *Linear up, log down* uses straight lines while the level rises and exponential pieces while it falls, which is closer to the truth after the peak. The AUMC (area under the first-moment curve, t × C) follows the same rule.
4. Set the **units**. With an amount given (in your study's units) the page works out CL and V in litres, converting the concentration unit.
5. Choose how to find the **terminal phase**. *Best fit* fits a straight line to ln(C) against time for the last 3, 4, 5 … points with a concentration above 0 after Cmax (after a bolus, Cmax may be included), keeps the fit with the highest adjusted R², and among fits within 0.0001 of the best takes the one with the most points. *Choose the points* lets you set the first and last time yourself.

## What each result means

- **Cmax and Tmax**: the highest measured concentration and when it was seen. **Clast** and **Tlast**: the last concentration above 0.
- **AUC0-t**: area from 0 to Tlast. **λz** (lambda z): minus the slope of the terminal line. **t½** = ln 2 / λz.
- **AUC0-∞** = AUC0-t + Clast / λz (observed Clast; the predicted-Clast version is in the table). **% extrapolated** is the part of AUC0-∞ beyond Tlast; above 20 % the values that depend on it are unreliable.
- **AUMC0-∞** = AUMC0-t + Tlast·Clast/λz + Clast/λz², and **MRT** = AUMC/AUC.
- **CL** = amount / AUC0-∞ and **Vz** = CL / λz. After oral dosing the fraction absorbed (F) is unknown, so they are **CL/F** and **Vz/F**. After IV dosing **Vss** = MRT × CL is also given.
- **Span ratio**: how many half-lives the terminal points cover; under 2 means a shaky half-life.

## Worked example

The example is an invented oral drug: 100 mg given, 13 samples over 24 hours. The page shows **Cmax 1510 ng/mL at 3 h** and, with linear-up/log-down, **AUC0-t = 16101 h·ng/mL**. Best fit uses the last **5 points (6 to 24 h)** with adjusted R² 0.9998, giving **λz = 0.1148 /h** and **t½ = 6.040 h**. AUC0-∞ is **17312 h·ng/mL** with **7.00 %** extrapolated, MRT0-∞ is 9.549 h, **CL/F = 5.776 L/h** and **Vz/F = 50.33 L**. Switch to the linear trapezoid and AUC0-t rises to 16336 h·ng/mL, because straight lines overshoot a falling exponential curve.

## Tips

- Average replicate samples at the same time before pasting; each time may appear once.
- Look at the log plot: the terminal points (open squares) should sit on a straight line. If an early point is still in the distribution phase, choose the points yourself.
- Sample for at least three half-lives after the peak so that the extrapolated part stays small.

## FAQ

**Why does a value show a dash?** Values that need λz are not given when fewer than three falling points follow the peak, and CL and V need the amount given.

**Does it handle several subjects?** One profile at a time. Run each subject, download the CSV, and summarise them in a spreadsheet.

**Is anything uploaded?** No. All the arithmetic runs in this page; your data never leaves the device.
