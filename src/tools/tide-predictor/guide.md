---
name: Tide predictor and harmonic analyser
num: 832
shelf: science
section: physical-oceanography
title: "Tide predictor: water levels, high and low tides and draft windows from harmonic constituents, plus harmonic analysis of a record"
summary: "Type or paste tidal constituents (amplitude and phase) and get the predicted water level, the times and heights of high and low water and the windows when the water is deep enough, with nodal corrections for the 18.6-year lunar cycle. Paste a water-level record to get its constituents back by least squares. Not for navigation."
status: live
ads: true
order: 832
icon: chart
works: offline
updated: 2026-11-09
related: [wave-calculator, period-finder, trend-analyser]
sources:
  - "Method: harmonic prediction h = Z0 + Σ f·H·cos(V + u − G) with Doodson's constituent numbers (Doodson 1921, Proc. R. Soc. A 100, 305) and Schureman's nodal factors and angles (Schureman 1958, Manual of Harmonic Analysis and Prediction of Tides, US Coast and Geodetic Survey Special Publication 98, equations 73–78, 149, 213–235). Mean longitudes of the Moon, Sun, lunar perigee and node from Meeus (1998, Astronomical Algorithms). Least-squares analysis and the Rayleigh criterion as in Foreman (1977) and Pawlowicz, Beardsley and Lentz (2002, t_tide). fibub's code is its own, checked in the tests against UTide (Codiga 2011, Python port) and an independent NumPy evaluation of Schureman's formulas."
  - "The example constituents and the example record are made up and belong to no real place. Not for navigation. Nothing you type or open is sent or stored."
flow:
  - { icon: table, label: "Constituents" }
  - { icon: calendar, label: "Dates" }
  - { icon: chart, label: "Water level" }
  - { icon: clock, label: "High, low" }
---

## What it does

The astronomical tide at any place is a sum of regular waves, called constituents, each driven by one part of the motion of the Moon and the Sun: M2 (the main lunar half-day tide), S2 (the solar one), K1 and O1 (the daily ones) and dozens of smaller ones. A tide-gauge record gives each constituent's amplitude H and phase G at that place, and with them the tide can be predicted for any date. This page does both directions:

- **Prediction.** From your list of constituents it draws the water level for up to 31 days, finds every high and low water to the second, and lists the **draft windows**: the times when the level is at or above a level you need.
- **Nodal corrections.** The Moon's orbit tilts back and forth over 18.6 years, which changes M2 by about ±4 % and K1 and O1 by 10 to 20 %. The page works out the factor f and angle u for each constituent and time from Schureman's formulas. You can switch them off to compare.
- **Harmonic analysis.** Paste or open a record of water levels with times, and the page fits the constituents by least squares, choosing which ones a record of that length can separate (the Rayleigh criterion), then hands them to the predictor with one button.

**Not for navigation.** Real water levels also depend on wind, air pressure, surges and river flow, which no harmonic prediction includes. Use your national tide tables for anything that matters.

## How to use it

1. Put your constituents in the first box, one per line: name, amplitude, phase. Phases are Greenwich phase lags G in degrees with times in UTC, the convention used by NOAA, the IHO and t_tide. Amplitudes can be in metres or feet; set Z0 (the mean level above your chart datum) in the same unit.
2. Choose the start date and the number of days, and the UTC offset you want times shown in (for example −5 for Eastern Standard Time).
3. Set the needed water level for a draft window: the depth you need (draft plus under-keel clearance) minus the charted depth.
4. Read the plot, the high and low water table and the windows. Download the levels every 6 minutes or the high and low waters as CSV, or the report as an image, PDF or Word file.
5. To analyse a record, paste it into the last box (or open a CSV or Excel file): date and time as YYYY-MM-DD HH:MM, then the level. Set the record's UTC offset, then press "Use these in the prediction".

## Worked example

The made-up constituents (M2 1.2 m at 110°, S2 0.4 m at 140°, K1 0.35 m at 200°, O1 0.25 m at 185° and five smaller ones, with Z0 = 2.0 m) for 3 days from 2026-11-09 00:00 UTC give a high water of 3.06 m at 04:00 UTC, a low of 0.85 m at 09:27, a higher high of 3.86 m at 15:45 and a lower low of 0.11 m at 22:18: a mixed tide, because the daily constituents are large. With a needed level of 2.6 m the first window runs from 02:17 to 05:42 (3.4 hours) and the second from 12:51 to 18:26 (5.6 hours).

The made-up 30-day hourly record in the analysis box was built from M2 0.9 m at 200°, S2 0.3 m at 230°, N2, K1, O1 and M4, then rounded to the centimetre. The analysis picks 22 constituents that 30 days can separate and gives back M2 0.900 m at 200.00°, S2 0.300 m at 230.01° and K1 0.150 m at 99.95°, with a residual of 0.003 m: the rounding.

## Tips

- A month of hourly data separates M2, S2, N2, K1, O1 and the main shallow-water tides. To split S2 from K2 or K1 from P1 you need about six months; for the annual and semi-annual tides, a year or more. With a short record, K2 is folded into S2 and P1 into K1, which is fine for prediction near the same time of year.
- Phases from different conventions (local time zones, κ instead of G) will put high water at the wrong time. If times look shifted by a few hours, check the phase convention.
- The analysis treats every reading equally, so remove obvious spikes and datum jumps first.

## FAQ

**Which constituents does it know?** Sa, Ssa, Mm, MSf, Mf, the diurnal 2Q1, σ1, Q1, ρ1, O1, P1, K1, J1, OO1, the semidiurnal 2N2, μ2, N2, ν2, M2, λ2, L2, T2, S2, K2, and M3, MK3, MO3, MN4, M4, MS4, S4, M6, 2MS6 and M8.

**Why does the analysis differ a little from other software?** Packages use slightly different nodal corrections (Schureman's formulas here; t_tide and UTide use Foreman's satellite method). For the main constituents the amplitudes differ by well under 1 % and the phases by a fraction of a degree.

**Is my record uploaded?** No. Everything runs in your browser.
