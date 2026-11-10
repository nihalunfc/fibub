---
title: "Quadcopter yaw and tilt control vs energy use: hover and circular flight tests"
summary: "A 2025 Energies study found a side-tilt control scheme cut a quadcopter's energy use by about 5 % in circular flight. Turn hover current into flight time in your browser."
tools: [drone-flight-time, hypothesis-tests, propeller-thrust]
updated: 2026-11-10
sources:
  - "Szywalski P (2025), Energies 18(22): 5998, the paper described here."
  - "Momentum theory of hovering rotors and the figure of merit: standard helicopter aerodynamics textbooks (method only)."
  - "The drone, currents and test runs in the worked example are made up by fibub, not taken from the paper."
paper:
  title: "Influence of the Control with a Fixed and Variable Roll, Pitch, and Yaw Axis on Unmanned Aerial Vehicles Energy Consumption"
  authors: "Szywalski P"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18225998"
  url: "https://www.mdpi.com/1996-1073/18/22/5998"
  licence: "CC BY"
  reviewed: true
---

Does it matter how a drone points itself while it flies a circle? A 2025 study in Energies from the Opole University of Technology flew the same small quadcopter indoors with three control schemes: yaw held fixed, yaw turning with the path, and yaw turning plus a sideways tilt. Measured at the battery, the tilting scheme used the least charge. This page explains the tests and shows how to turn a measured current into flight time with the [[drone-flight-time|drone flight time calculator]], and how to check whether a few per cent is a real difference with the [[hypothesis-tests|hypothesis test picker]]. The [[propeller-thrust]] tool covers the motor and propeller side.

## What they found

In circular flight at constant height, the side-tilt scheme drew the least current and used about 4.57 % less energy than the fixed-yaw scheme over a three-minute window. The abstract and conclusions put the saving at up to 7 % against hovering, while the body text gives 5 to 7 %. Hovering and circling without rotation differed by only about 5 mAh in three minutes, roughly 1 to 2 %. Height was held to within a few centimetres, and repeat runs spread by at most 0.5 %.

## Why it matters

Battery energy sets how long inspection, mapping and delivery drones can stay up. Most energy studies change the hardware: bigger propellers, lighter frames, better batteries. This one changes only how the controller steers, which costs nothing to deploy. Even a few per cent adds up over a fleet's flying hours.

## How they did it

The test drone was a 300-class quadcopter weighing about 900 g with its battery: four 2400 KV brushless motors with 20 A speed controllers, 6 × 4 inch propellers and a 3S lithium polymer pack of 4000 mAh at 11.1 V. It flew in a 12 × 15 × 6 m laboratory with no wind. Current and voltage were logged where the battery meets the drone. Each manoeuvre (hover with and without rotation, and circles with the three control schemes) was repeated ten times, and charge used was compared over fixed time windows.

## Check it yourself with fibub

We use a **made-up** quadcopter of the same size class: 900 g all-up, 4 rotors, 6 inch propellers, a 3S 4000 mAh LiPo at 3.7 V per cell, 80 % usable, 5 W of electronics, sea level at 20 °C.

1. **Estimate from theory.** In the drone flight time calculator, enter those values and keep a figure of merit of 0.6 and 75 % motor and ESC efficiency. With **Momentum theory (estimate)** selected, it predicts about 144 W in hover, 13.0 A and **14.8 minutes**. The battery holds 44.4 Wh.
2. **Use a measured current.** Switch **Hover power from** to **My measured hover current** and type a made-up logged value of 18 A. Hover power becomes 199.8 W, the flight time drops to **10.7 minutes**, and the implied figure of merit is only 0.43. Small, fast-spinning 6 inch propellers on a heavy frame are much less efficient than the textbook guess, which is why a measured current beats any estimate.
3. **Value a 5 % saving.** Type 17.1 A, 5 % less. Hover time rises to **11.2 minutes**, about 34 seconds more per pack. The battery is drawn at about 4.3 C, which you can compare with its rating.
4. **Is the difference real?** Suppose ten made-up three-minute runs of two schemes used these charges in mAh. Scheme A: 897, 903, 899, 905, 896, 901, 904, 898, 902, 895. Scheme B: 889, 894, 887, 896, 890, 893, 886, 892, 895, 888. In the hypothesis test picker choose numbers and two separate groups; Welch's t test gives t(18) = 5.76, p < 0.001, and a difference of 9 mAh (95 % interval 5.7 to 12.3), just 1 %.
5. **Fewer repeats.** Keep only the first three runs of each. The test now gives p = 0.025 but an interval of 2.0 to 17.3 mAh: still "significant", yet far too vague to rank schemes. Ten repeats with a 0.5 % spread is what makes 1 to 2 % effects visible at all.

## The fine print

- One drone in one windless room; outdoor wind, other frame sizes and other propellers may change the ranking.
- The paper shows the run closest to the mean and reports no statistical tests on the differences.
- Several effects are only 1 to 2 %, and the saving is reported as 4.57 %, 5 to 7 % and up to 7 % in different sections.
- Position control ran without position feedback, and tilting upset the downward height sensor.
- Current was measured at the drone's connector, so losses inside the battery are not included.
- The suggestion that energy is recovered while descending is not clearly supported by the charge measurements.
