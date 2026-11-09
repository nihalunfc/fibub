---
name: Heart rate and power zone calculator
num: 490
shelf: science
section: exercise-and-sport-science
title: "Heart rate zone calculator: max heart rate, Karvonen zones and cycling power zones from FTP"
summary: "Estimate maximum heart rate with four published equations, then get training zones as % of max or % of heart rate reserve (Karvonen), with editable boundaries. Add cycling power zones from FTP. Table, bar picture and CSV."
status: live
ads: false
order: 30
icon: target
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker, sample-size]
sources:
  - "Fox SM, Naughton JP, Haskell WL (1971). Physical activity and the prevention of coronary heart disease. Ann Clin Res 3: 404–432 (the 220 − age rule)."
  - "Tanaka H, Monahan KD, Seals DR (2001). Age-predicted maximal heart rate revisited. J Am Coll Cardiol 37: 153–156."
  - "Gellish RL et al. (2007). Longitudinal modeling of the relationship between age and maximal heart rate. Med Sci Sports Exerc 39: 822–829."
  - "Nes BM et al. (2013). Age-predicted maximal heart rate in healthy subjects: the HUNT fitness study. Scand J Med Sci Sports 23: 697–704."
  - "Karvonen MJ, Kentala E, Mustala O (1957). The effects of training on heart rate. Ann Med Exp Biol Fenn 35: 307–315."
  - "Zone boundaries (heart rate and power): common coaching conventions, rounded, editable; not copied from any table."
flow:
  - { icon: sliders, label: "Age, rest" }
  - { icon: target, label: "Max HR" }
  - { icon: chart, label: "Zones" }
  - { icon: download, label: "CSV" }
---

## What it does

Training plans talk in zones: "an easy zone 2 ride", "intervals in zone 4". This page turns your age, or a maximum heart rate you have measured, into heart rate zones in beats per minute. It also turns a cyclist's functional threshold power (FTP) into power zones in watts. You get a table, a bar picture of the zones and a CSV file to load into a spreadsheet or a training app.

It is a teaching tool. Age equations only estimate maximum heart rate: real maxima of people the same age spread by about ±10 beats/min or more. A maximum measured in a supervised test beats any equation.

## How to use it

1. Type your **age**. Choose the **equation** for maximum heart rate, or pick "My measured maximum" and type it.
2. Type your **resting heart rate** if you want the Karvonen method.
3. Choose the **method**: "% of max HR" or "% of reserve (Karvonen)".
4. Change the **zone boundaries** if your coach uses another scheme. Six numbers make five zones; any rising list works.
5. For cycling, type your **FTP** and, if you like, other **upper edges** for the power zones.
6. Download the zones as **CSV**, or the whole page as an image, PDF or Word file.

## The equations

- **220 − age** (Fox, Naughton and Haskell, 1971): the oldest and best-known rule. It was never fitted to a large data set and it underestimates maximum heart rate in older adults.
- **Tanaka**: 208 − 0.7 × age (Tanaka, Monahan and Seals, Journal of the American College of Cardiology, 2001), from a meta-analysis of hundreds of studies plus a laboratory study.
- **Gellish**: 207 − 0.7 × age (Gellish and colleagues, Medicine and Science in Sports and Exercise, 2007), from repeated treadmill tests of the same people over many years.
- **Nes**: 211 − 0.64 × age (Nes and colleagues, Scandinavian Journal of Medicine and Science in Sports, 2013), from a large Norwegian population study.
- **Karvonen** (Karvonen, Kentala and Mustala, 1957): target = resting HR + intensity × (max HR − resting HR). The difference between maximum and resting heart rate is the **heart rate reserve**.

All four equations are shown side by side so you can see how much they differ at your age.

## Worked example

The page opens with age 40, the Tanaka equation and a resting heart rate of 60. Maximum heart rate is 208 − 0.7 × 40 = **180 beats/min** (220 − 40 also gives 180: the two rules cross at age 40). With the default boundaries 50, 60, 70, 80, 90 and 100 % of max, the zones are 90–108, 108–126, 126–144, 144–162 and 162–180 beats/min. Switch to Karvonen and the reserve is 120 beats/min, so 70 % becomes 60 + 0.7 × 120 = 144 and the zones are 120–132, 132–144, 144–156, 156–168 and 168–180.

With an FTP of 250 W and upper edges 55, 75, 90, 105, 120 and 150 %, the power zones are 0–138, 138–188, 188–225, 225–263, 263–300, 300–375 and 375+ W (no upper limit).

## Tips

- Heart rate lags behind effort by a minute or more, and drifts up in heat and on long sessions. For short intervals, power or pace is a better guide.
- Wrist sensors can be off during hard efforts; a chest strap is steadier.
- Medicines such as beta blockers lower heart rate, so age-based zones do not apply. Ask a qualified professional.

## Frequently asked questions

**Which equation is best?** None is right for everyone. Tanaka and Gellish fit large data sets better than 220 − age, especially over 40. A measured maximum is better still.

**Are the zone percentages a standard?** No. Coaches and organisations use different schemes, so the boundaries are editable. The power bands shown are common coaching conventions, rounded.

**Is my data sent anywhere?** No. Everything is worked out in your browser and nothing is stored.
