---
name: VO2max estimator
num: 487
shelf: science
code: T338
section: exercise-and-sport-science
title: "VO2max estimator"
summary: "Estimate VO2max (aerobic fitness) from six field tests: Cooper 12-minute run, 1.5-mile run, Rockport 1-mile walk, 20 m shuttle run (beep test), Queens College step test, and the Uth heart rate ratio. Each formula cited, all tests compared side by side, with CSV."
status: live
ads: false
order: 27
icon: chart
works: offline
updated: 2026-11-09
related: [heart-rate-zones, uncertainty-calculator, plot-maker, sample-size, training-load, jump-height, gait-cadence, respirometry-calculator, energy-needs]
sources:
  - "Cooper KH (1968). A means of assessing maximal oxygen intake. JAMA 203: 201–204."
  - "1.5-mile run equation VO2max = 3.5 + 483 / time: as given in common university physiology lab manuals and fitness-testing texts; the original source is not clearly recorded."
  - "Kline GM et al. (1987). Estimation of VO2max from a one-mile track walk, gender, age, and body weight. Med Sci Sports Exerc 19: 253–259."
  - "Léger LA, Mercier D, Gadoury C, Lambert J (1988). The multistage 20 metre shuttle run test for aerobic fitness. J Sports Sci 6: 93–101."
  - "McArdle WD et al. (1972). Reliability and interrelationships between maximal oxygen intake, physical work capacity and step-test scores in college women. Med Sci Sports 4: 182–186."
  - "Uth N, Sørensen H, Overgaard K, Pedersen PK (2004). Estimation of VO2max from the ratio between HRmax and HRrest: the Heart Rate Ratio Method. Eur J Appl Physiol 91: 111–115."
flow:
  - { icon: target, label: "Pick test" }
  - { icon: pencil, label: "Results" }
  - { icon: chart, label: "VO2max" }
  - { icon: download, label: "CSV" }
---

## What it does

VO2max is the most oxygen your body can use per minute during hard exercise, per kilogram of body mass (mL/kg/min). It is the classic measure of aerobic fitness. A laboratory measures it with a mask on a treadmill or bike. Schools, teams and the armed forces use simpler field tests that estimate it from a run time, a distance or a heart rate. This page works out the estimate for six such tests, shows the working, and puts all six side by side so students can see how much the equations disagree.

Set your training zones from the result with the [[heart-rate-zones|heart rate zone calculator]], and log the sessions that follow in the [[training-load|training load tracker]].

## How to use it

1. Type your **age**, **sex** and **body mass**.
2. Pick a **test** and type its result. Times can be typed as 11:40 or as decimal minutes (11.67).
3. Read the estimate, the working, the value in **METs** (multiples of 3.5 mL/kg/min, the resting rate) and in **litres per minute** for your body mass.
4. The table below lists every test that has numbers in its box. Download it as CSV, or the page as an image, PDF or Word file.

## The tests and their equations

- **Cooper 12-minute run** (Cooper, JAMA, 1968): VO2max = (distance in metres − 504.9) / 44.73.
- **1.5-mile run**: VO2max = 3.5 + 483 / time in minutes. This equation is widely taught in physiology lab manuals; its original source is not clearly recorded.
- **Rockport 1-mile walk** (Kline and colleagues, Medicine and Science in Sports and Exercise, 1987): VO2max = 132.853 − 0.0769 × weight in pounds − 0.3877 × age + 6.315 × (1 for men, 0 for women) − 3.2649 × time in minutes − 0.1565 × heart rate at the finish. The page converts kilograms to pounds for you.
- **20 m shuttle run** or beep test (Léger and colleagues, Journal of Sports Sciences, 1988): stage 1 is 8.5 km/h and each 1-minute stage adds 0.5 km/h, so speed = 8 + 0.5 × stage. Ages 6 to 17: VO2max = 31.025 + 3.238 × speed − 3.248 × age + 0.1536 × speed × age. Adults: VO2max = 6.0 × speed − 24.4.
- **Queens College step test** (McArdle and colleagues, Medicine and Science in Sports, 1972): men 111.33 − 0.42 × recovery heart rate; women 65.81 − 0.1847 × recovery heart rate. The YMCA step test is scored against norm tables instead of an equation, so it is not included.
- **Heart rate ratio** (Uth and colleagues, European Journal of Applied Physiology, 2004): VO2max ≈ 15.3 × maximum heart rate / resting heart rate.

## Worked example

The page opens with a 40-year-old man of 75 kg. He runs 2400 m in 12 minutes: (2400 − 504.9) / 44.73 = **42.4 mL/kg/min**, which is 12.1 METs or 3.18 L/min. With the other example results, the table shows 44.9 for an 11:40 1.5-mile run, 41.7 for a 14:30 mile walk finishing at 140 beats/min, 50.6 for reaching stage 9 of the shuttle run (12.5 km/h), 48.3 for a recovery heart rate of 150 in the step test, and 45.9 for maximum and resting heart rates of 180 and 60. The same person gets estimates nearly 10 mL/kg/min apart.

## Tips

- Run tests reward pacing and motivation as much as fitness. Practise once before the real test.
- Count heart rate carefully, or use a chest strap: one beat in a 15-second count is 4 beats/min.
- Only take a maximal test if you are healthy and used to hard exercise.

## Frequently asked questions

**Why do the tests disagree?** Each equation was fitted to its own group of people, with its own error, typically several mL/kg/min. Use the same test each time to track change.

**Where are the "good" or "excellent" ratings?** Fitness ratings come from published norm tables, which this page does not copy. Compare your number with age and sex norms from an official source.

**Is my data stored?** No. Everything is worked out in your browser and nothing is saved or sent.
