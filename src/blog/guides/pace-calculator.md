---
title: "Running pace, splits and race predictions, explained"
summary: "How pace, time and distance fit together, what even splits look like, and how Riegel's formula predicts other race times, with a half-marathon worked example."
tools: [pace-calculator, heart-rate-zones, steps-to-distance, calorie-calculator]
updated: 2026-11-10
sources:
  - "Riegel PS (1981). Athletic records and human endurance. American Scientist 69(3): 285-290 (T2 = T1 × (D2/D1)^k, with k about 1.06)."
  - "1 international mile = 1.609344 km (exact definition)."
---

The pace calculator links the three numbers every runner thinks about: how far, how long and how fast. Give it any two and it works out the third, in kilometres or miles, then lays out even splits for the whole run and predicts your time over other race distances from the run you typed. It is for runners planning a race or a training run, walkers and coaches, and PE students learning about speed. It is general education, not medical or coaching advice. To turn a pace into an effort level, use [[heart-rate-zones]]; to work out a walking distance from your steps first, try [[steps-to-distance]]; and for the energy a run uses, see the [[calorie-calculator]].

## What it is

**Pace** is time per unit of distance, such as 5:27 per km. **Speed** is the opposite: distance per unit of time, such as 11 km/h. Runners like pace because it maps straight onto a watch.

The three numbers are tied by one rule:

**time = distance × pace**

So pace = time ÷ distance, and distance = time ÷ pace. To switch units, a mile is exactly 1.609344 km, so a pace per mile is the pace per km multiplied by 1.609344.

**Even splits** cut the run into equal pieces (one per km or per mile) and show the time each piece would take at a steady pace, plus the running total. The last piece is usually a part-km left over.

The **race predictor** uses a formula published by Peter Riegel in 1981:

**T₂ = T₁ × (D₂ ÷ D₁)^k**

T₁ and D₁ are a time and distance you have run. D₂ is the race you want to predict and T₂ is the predicted time. The exponent *k*, the fatigue exponent, is a little above 1 because people slow down as races get longer. Riegel's value is 1.06. A bigger *k* means you fade more over long distances.

## How to use it

1. In **What do you want to find?**, choose Pace, Time or Distance. The box you are solving for is greyed out and fills itself in.
2. Type the other two. Distance takes a number with a **km** or **miles** switch. Time takes h:mm:ss, mm:ss or plain minutes. Pace takes mm:ss with a **per km** or **per mile** switch.
3. For a standard race, press **5 km**, **10 km**, **Half marathon** or **Marathon** to fill in the distance.
4. Read the answer, and the line under it with pace in both units and speed in km/h and mph.
5. Scroll to **Splits** for the table of even splits, one row per km or mile, matching your distance unit.
6. In **Race time predictor**, read the predicted time and pace for 1 mile, 5 km, 10 km, half and full marathon. Change **Fatigue exponent k** to try a different fade. **Reset** brings back the example.

## A worked example

Lena runs a half marathon (21.0975 km) in 1:55:00, which is 6,900 seconds.

- Pace: 6,900 ÷ 21.0975 = 327 seconds per km, so **5:27 per km**.
- Per mile: 327 × 1.609344 ≈ 526 seconds, so **8:46 per mile**.
- Speed: 21.0975 ÷ (6,900 ÷ 3,600) = **11.01 km/h**, or 6.84 mph.

The splits table has 22 rows. Row 20 ends at 1:49:01 and row 21 at 1:54:28. The last row is only 0.0975 km and takes about 0:32, bringing the total to 1:55:00.

Now the predictor. For a marathon, with k = 1.06:

T₂ = 6,900 × (42.195 ÷ 21.0975)^1.06 = 6,900 × 2^1.06, about 14,386 seconds, or **3:59:46** (5:41 per km).

With k = 1.08 the marathon comes out at 4:03:07, three minutes slower, while the same setting predicts a faster 10 km (51:21 instead of 52:07). With k = 1.06 the 5 km prediction is 25:00, exactly 5:00 per km.

## Where it is used

- **Race planning.** Runners pick a target pace and print or memorise the split times to check against their watch.
- **Training.** Coaches set interval and long-run paces from a recent race, often by working out a time for a shorter or longer distance.
- **Walking and hiking.** The same sums plan a charity walk or a hike: a 4 km/h walking pace tells you how long a route will take.
- **Cycling, rowing and swimming.** Any steady-speed sport can use time, distance and pace; rowers think in pace per 500 m, which is the pace per km halved.
- **School maths and PE.** It is a friendly example of rates, unit changes and a power law.

## Common mistakes

- **Typing 1.55 for 1 hour 55.** Plain numbers are read as minutes, so 1.55 is under two minutes. Type 1:55:00.
- **Mixing units.** A distance in miles with a pace per km is fine, but check both switches before reading the answer.
- **Trusting the predictor for an untrained distance.** A fast 5 km does not mean you can hold the predicted marathon pace without the long runs to support it. Treat the result as a ceiling, not a promise.
- **Using a hilly or hot race as the input.** A slow day in tough conditions makes every prediction slower too. Use a run on a flat course in mild weather.
- **Forgetting that GPS watches drift.** A watch that says 21.4 km for a half marathon gives a slightly wrong pace. Use the official race distance.

## Questions people ask

**What is a good pace for a beginner?** There is no single answer. Many new runners start with an easy pace at which they can still talk in full sentences, whatever number that is.

**Why do the splits not match my real splits?** The table assumes a perfectly steady pace. Real runs speed up and slow down with hills, wind and crowds.

**What does changing k from 1.06 to 1.10 mean?** It assumes you slow down more as the race gets longer, so long-race predictions get slower and short-race predictions get faster.
