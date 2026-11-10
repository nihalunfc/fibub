---
title: "Hail days and stability index trends from Belgrade radiosondes, 2005-2020"
summary: "A 2025 Atmosphere study worked out 23 stability indices on 826 hail days over Serbia and found CAPE rising and lifted index falling. Compute the same indices yourself."
tools: [skew-t-sounding, trend-analyser]
updated: 2026-11-10
sources:
  - "Vujović D, Vučković V, Zečević A (2025), Atmosphere 16(5): 520, CC BY, the paper described here."
  - "Lifted index, Showalter index, K index, total totals and CAPE: standard definitions, as used by the fibub skew-T plotter."
  - "Mann-Kendall test and Sen's slope: standard trend statistics."
  - "Both soundings and the yearly lifted index series in the worked example are made up by fibub."
paper:
  title: "Analysis and Trends of the Stability Indices During Hail Days Derived from the Radiosonde Observations from Belgrade (Serbia)"
  authors: "Vujović D, Vučković V, Zečević A"
  journal: "Atmosphere"
  year: 2025
  doi: "10.3390/atmos16050520"
  url: "https://www.mdpi.com/2073-4433/16/5/520"
  licence: "CC BY"
  reviewed: true
---

Hail wrecks crops, cars and roofs in Serbia most summers. To see whether the air above the country is getting more prone to hail storms, three Serbian meteorologists went through 16 hail seasons of weather balloon launches from Belgrade. They worked out 23 stability indices for each day and matched them to hail reports. Their paper, in Atmosphere (April 2025), finds that the air over Belgrade has become more unstable, even though big hail itself shows no clear trend yet. You can work out the same indices from any sounding with the [[skew-t-sounding|skew-T sounding plotter]], and test them for a trend with the [[trend-analyser]].

## What they found

The study covers the hail season, April to October, of 2005 to 2020. Hail fell somewhere within 160 km of Belgrade on 889 days, and 826 of those days had a midday balloon launch to go with them.

- **Most hail is small.** The commonest size was about a hazelnut (13 to 20 mm), on about 36 % of hail days. Hail of 21 mm or more fell on 172 days, about 21 %.
- **The air is getting less stable.** Eight of the 23 indices changed steadily over the years. The **Showalter index** fell by about 0.14 °C a year and the **lifted index** by about 0.10 °C a year. Lower values of both mean more unstable air. The **K index** and **CAPE** rose.
- **The warming is aloft.** Temperature and moisture rose between about 1.5 and 9 km up, but not at the ground.
- **No trend in big hail yet.** The number of days with severe hail did not change significantly over the 16 years.
- **Some indices catch hail days better.** Using thresholds from the team's earlier work, **total totals** flagged 84 % of hail days, the lifted index 83 %, Showalter 80 % and the K index 77 %. Moisture alone did worst. Mean CAPE on hail days was nearly three times the all-days mean.

## Why it matters

Hail forms in strong thunderstorm updrafts, and the indices measure how much fuel the air holds for them. A drift toward unstable air over 16 years suggests more days on which hail can form, even if the record of large hail is still too short and noisy to show a change. Serbia also runs a large hail-suppression network, so knowing which indices pick out hail days helps decide when to act.

## How they did it

Every day, a balloon at Belgrade-Košutnjak carries a radiosonde up through the atmosphere at 12 UTC. A Fortran program turned each profile into 23 indices. Hail reports came from the network of about 1,300 hail-suppression stations within 160 km of Belgrade, which log the size of any hail they see on an eight-step scale. The team then ran Mann-Kendall tests and Sen's slopes on each index, and linear fits on the yearly count of days past each threshold.

## Check it yourself with fibub

We made up two soundings for an imaginary station 240 m above sea level. They are not Belgrade data.

1. Open the [[skew-t-sounding]] and paste the "storm" sounding as a table with a header row and three columns: pressure, temperature and dew point (hPa, °C, °C). Use 990, 29, 17; 950, 25.4, 15.6; 925, 23.2, 14.6; 900, 21, 13; 850, 17, 11; 800, 13, 6; 750, 9, 1; 700, 5, −5; 650, 0.6, −10; 600, −3.8, −15; 550, −8.6, −20; 500, −13.6, −26; 450, −19.4, −32; 400, −25.8, −38; 350, −33, −45; 300, −41.2, −52; 250, −50.4, −60; 200, −56, −67; 150, −57, −75; 100, −60, −82. Set the station height to 240 m.
2. With the surface parcel, the plotter gives CAPE ≈ 2,245 J/kg and almost no CIN (about −3 J/kg). It also gives a lifted index of −6.9 °C, a Showalter of −3.8 °C, a K index of 31.6 and total totals of 55.2. Switch to the mixed-layer parcel and CAPE drops to about 1,760 J/kg. The paper reports several CAPE variants for that reason.
3. Check the K index by hand: T850 − T500 + Td850 − (T700 − Td700) = 17 + 13.6 + 11 − (5 + 5) = 31.6.
4. Now paste a quiet sounding: the same pressures, with temperature and dew point of 24, 9; 20.6, 7.6; 18.6, 6.6; 16.6, 5; 13, 2; 10, −2; 6.4, −7; 3, −12; −1, −16; −5, −20; −9.6, −25; −14.8, −31; −20.6, −37; −27, −43; −34.2, −49; −42.4, −55; −51, −62; −56, −68; −57, −75; −60, −82. CAPE is zero, K is 14.8 and total totals is 44.6. Yet the lifted index is 1.9 °C, just under the 1.98 °C threshold the paper used. One index alone can mislead, which is the authors' own caution.
5. For a trend, paste a yearly series into the [[trend-analyser]]. Our made-up mean lifted index on hail days for 2005 to 2020 is 0.9, 1.4, 0.6, 0.8, 1.1, 0.2, 0.7, −0.1, 0.5, 0.0, −0.4, 0.3, −0.6, −0.2, −0.8 and −0.5 °C. Mann-Kendall gives Z ≈ −3.7 (p ≈ 0.0002), and Sen's slope is about −0.12 °C a year. Report it per year to compare with the paper's −0.095.

## The fine print

One balloon a day at noon misses the air in the hours just before an afternoon storm. A single station also stands for a 160 km circle of hail reports. Sixteen years is short for trends, especially for rare, big hail. Hail reports depend on where the observers stand and on what they log. The study counts how often hail days meet each threshold, but not how often the threshold fires on days with no hail, so it does not give full skill scores. Indices from fibub may differ slightly from the paper's Fortran values, because methods for CAPE and the lifted parcel vary.
