---
title: "Cerrado climate shift: Köppen classes, warming trends and drought, 1961-2021"
summary: "A 2025 Atmosphere study classified 14 Brazilian savanna towns by Köppen over sliding 30-year windows and tested 60 years of warming and drying. Check the method yourself."
tools: [koppen-climate, trend-analyser, walter-lieth]
updated: 2026-11-10
sources:
  - "Soares KWS, Battisti R, Dapper FP, Carvalho APM, Silva MV, Silva JLB, Oliveira HFE, Mesquita M (2025), Atmosphere 16(7): 849, CC BY, the paper described here."
  - "Köppen-Geiger rules as used by the fibub classifier: Peel MC, Finlayson BL, McMahon TA (2007), Hydrology and Earth System Sciences 11: 1633-1644."
  - "Mann-Kendall test and Sen's slope: standard trend statistics (Mann 1945, Kendall 1975, Sen 1968)."
  - "The monthly normals and the yearly temperature series in the worked example are made up by fibub."
paper:
  title: "Shifting Climate Patterns in the Brazilian Savanna Evidenced by the Köppen Classification and Drought Indices"
  authors: "Soares KWS, Battisti R, Dapper FP, Carvalho APM, Silva MV, Silva JLB, Oliveira HFE, Mesquita M"
  journal: "Atmosphere"
  year: 2025
  doi: "10.3390/atmos16070849"
  url: "https://www.mdpi.com/2073-4433/16/7/849"
  licence: "CC BY"
  reviewed: true
---

The Cerrado, Brazil's vast tropical savanna, is one of the world's great farming frontiers, and its rain decides the harvest. A Brazilian team took 60 years of daily weather from 14 towns across the region and asked two questions: has the climate class of any town changed, and is the region getting hotter and drier? They published the answer in Atmosphere in July 2025. Most towns kept their class, but almost all warmed, and half lost rain. You can run the same kind of check on any station with the [[koppen-climate|Köppen climate classifier]] and the [[trend-analyser]].

## What they found

- **Classes held, mostly.** Twelve of the 14 towns stayed **Aw**, tropical savanna with a dry winter, in every 30-year window. Two, Dourados and Sapezal, switched to **Am**, tropical monsoon, in some windows (Sapezal in only two of them). Am and Aw differ only in how dry the driest month is, so a town near the line can cross it with a small change.
- **Warming nearly everywhere.** The Mann-Kendall test found a significant rise in temperature at 13 towns. The Sen slopes ran from about 0.016 to 0.061 °C per year, the steepest at Conceição do Araguaia, whose average rose by 1.9 °C between the two normal periods.
- **Less rain at half the towns.** Seven towns lost rain significantly, by between 4.5 and 12.8 mm per year. Tapurah lost about 400 mm a year between the two normals, while Sapezal gained about 414 mm.
- **Bigger water deficits.** A simple soil water balance showed a larger yearly deficit in 1992-2021 than in 1961-1990 at 13 of the 14 towns.
- **Drier spells after 2010.** A drought index showed long dry runs from 2014 to 2021 at three towns in the north and east.

## Why it matters

Köppen classes are coarse, so a stable class can hide a lot of change. This study shows that: the labels barely moved while temperature, rainfall and water deficit all shifted. For farmers and planners, the trend numbers say more than the class. Sowing dates, irrigation needs and crop choices follow the length and depth of the dry season, not a two-letter code.

## How they did it

Daily minimum and maximum temperature and rainfall came from Brazil's national weather service for 1961 to 2016. Later years were filled from NASA POWER (temperature) and the national water agency (rainfall), and gaps were filled from nearby stations. The team rolled a 30-year window along the record one year at a time. That gave 32 windows per town and 448 classifications in all. They tested each yearly series with Mann-Kendall and Sen's slope at the 5 % level. They also ran a Thornthwaite-Mather water balance with 100 mm of soil water storage, and a 12-month Standardised Precipitation Index (SPI), which scores each period's rainfall against what is normal for that place.

## Check it yourself with fibub

Here is a made-up savanna station, not one of the paper's towns, with two 30-year normals.

1. Open the [[koppen-climate]] and choose **My own data**. Paste the older normal as 12 rows of month, temperature and rainfall (or as two rows of 12 values). Mean temperatures, in °C: 25.0, 25.1, 25.0, 24.8, 23.6, 22.4, 22.3, 23.9, 25.6, 25.8, 25.2 and 25.0. Rainfall, in mm: 330, 290, 280, 150, 70, 30, 25, 30, 80, 170, 250 and 320. That adds up to 2,025 mm a year.
2. The classifier says **Am**. The coldest month is 22.3 °C, so the station is tropical (18 °C or more). The driest month, 25 mm, is below 60 mm but above the monsoon limit of 100 − 2,025/25 = 19 mm.
3. Now paste a warmer, drier normal: every month 0.8 °C warmer, and rain of 310, 270, 250, 130, 50, 15, 10, 15, 60, 150, 240 and 300 mm (1,800 mm a year). The limit rises to 100 − 1,800/25 = 28 mm, the driest month drops to 10 mm, and the class becomes **Aw**. The dry month falls in the southern winter. A 225 mm loss over a year is enough to cross the line, which is how a town near the line can switch between Am and Aw.
4. The Walter-Lieth diagram drawn under the class shows the dry season grow longer. The [[walter-lieth|climate diagram tool]] can draw it on its own for a report.
5. For the trend, paste yearly mean temperatures into the [[trend-analyser]]. With a made-up series for 2002 to 2021 (24.6, 24.9, 24.5, 24.8, 25.0, 24.7, 24.9, 25.1, 25.3, 24.9, 25.2, 25.0, 25.4, 25.3, 25.6, 25.2, 25.5, 25.7, 25.4 and 25.8 °C), the Mann-Kendall test gives Z ≈ 4.4 and p < 0.001. Sen's slope is about 0.055 °C per year, near the top of the range the paper reports. Set "Report the slope per" to 1 year to compare like with like.
6. To copy the paper's sliding windows, classify one 30-year normal at a time, moving the window a year each run.

## The fine print

Fourteen towns cover a region of about two million square kilometres, so the sample is thin. Mixing station data with NASA POWER grid values after 2016 can add a step to the record that looks like a trend. The paper used its own Köppen thresholds, including an adjusted dry-climate limit, so the fibub classifier, which uses the Peel et al. (2007) rules, may not match every class exactly. Monthly normals also hide day-to-day extremes, such as heatwaves, that matter to crops. Finally, a Mann-Kendall trend shows that a change happened, not why. Land clearing, which has been heavy in the Cerrado, may play a part alongside global warming.
