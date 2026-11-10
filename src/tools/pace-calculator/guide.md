---
name: Pace calculator
num: 2030
shelf: everyday
code: T913
section: running
title: "Pace calculator: running pace, time, distance, splits and race time predictor"
summary: "Give any two of distance, time and pace to get the third, in km or miles, with an even-pace splits table and race time predictions from Riegel's formula."
status: live
ads: false
order: 2030
icon: clock
works: offline
updated: 2026-11-10
related: [steps-to-distance, calorie-calculator, heart-rate-zones, one-rep-max]
sources:
  - "Riegel PS (1981). Athletic records and human endurance. American Scientist 69(3): 285–290 (the T2 = T1 × (D2/D1)^1.06 formula)."
  - "1 mile = 1.609344 km (international mile). Pace, time and splits are fibub's own working."
flow:
  - { icon: sliders, label: "Pick" }
  - { icon: pencil, label: "Type" }
  - { icon: clock, label: "Pace" }
  - { icon: table, label: "Splits" }
---

## What it does

This calculator works out running (or walking, cycling or rowing) pace. Type any two of distance, time and pace, and it finds the third. It shows the pace per kilometre and per mile and the speed in km/h and mph, then lists even-pace splits and predicts your time over other race distances.

Everything runs in your browser and nothing is sent anywhere. To turn pace into training effort, try [[heart-rate-zones]]; to count the energy used, see the [[calorie-calculator]].

## How to use it

1. Choose what you want to find: pace, time or distance.
2. Type the other two. Times can be h:mm:ss, mm:ss or plain minutes.
3. Read the answer, then scroll to the splits and the race predictor.

The race buttons (5 km, 10 km, half marathon, marathon) fill in the distance for you.

## What each setting does

- **Distance** and **km / miles**: the length of the run and its unit. The splits follow this unit.
- **Time**: the total time. "50:00" means 50 minutes; "1:50:00" means one hour 50.
- **Pace** and **per km / per mile**: the time for each unit of distance.
- **Fatigue exponent k**: how much you slow down as races get longer. Riegel's 1981 paper gives 1.06; some runners suit 1.07 or 1.08 for the marathon.
- **Reset**: brings back the example.

## Worked example

You ran 10 km in 50:00. The pace is 50 ÷ 10 = 5:00 per km. A mile is 1.609344 km, so that is 8:03 per mile, and 12 km/h. The splits table shows ten rows of 5:00, ending at 50:00.

For a half marathon (21.0975 km) Riegel gives 50:00 × (21.0975 ÷ 10)^1.06 = 110.3 minutes, so about **1:50:19**. For a 5 km it predicts 23:59.

## FAQs

**How accurate is the race predictor?** It is a rule of thumb. It works best between about 3 km and the half marathon and when you have trained for the longer distance. Hills, heat and pacing change the real result.

**Why is my mile pace not 8:00?** A mile is longer than 1.6 km, so 5:00 per km is 8:02.8 per mile, shown rounded to 8:03.

**Does it save my times?** No. Nothing is stored, and closing the page clears it.

**Can I use it for walking?** Yes. Pace is pace; the [[steps-to-distance]] tool turns your steps into a distance first.
