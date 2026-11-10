---
name: Pendulum lab
num: 1351
shelf: learn
code: L200
section: school-physics
title: "Pendulum lab: period T = 2π√(L/g), large-swing error, time it with a stopwatch and find g from a T² against L graph"
summary: "Swing a pendulum of any length on Earth, the Moon, Mars or Jupiter and see its period worked out. At Class 11 see how much longer big swings take, then time a pendulum with the stopwatch and fit a straight line of T² against L to measure g."
status: live
ads: false
order: 1351
icon: clock
works: offline
updated: 2026-11-09
related: [shm-circle, pendulum-analyser, equations-of-motion, kepler-orbits]
sources:
  - "Simple pendulum: T₀ = 2π√(L/g) for small swings; the exact period T = T₀ / AGM(1, cos(θ₀/2)) (complete elliptic integral of the first kind written with the arithmetic–geometric mean): standard mechanics."
  - "The motion shown is the full equation θ″ = −(g/L) sin θ solved step by step (Runge–Kutta)."
  - "g = 9.8 m/s² (school value); Moon about 1.62, Mars about 3.71 and Jupiter about 24.8 m/s² are rounded general values."
  - "The starting readings are made up for practice."
  - "Checked against an independent Python calculation (numpy polyfit for the fit, a fine-step integration and the textbook series for the large-swing period)."
flow:
  - { icon: sliders, label: "Set length" }
  - { icon: clock, label: "Time swings" }
  - { icon: chart, label: "T² vs L" }
  - { icon: calculator, label: "Find g" }
---

## What it does

A pendulum is the simplest clock there is: a weight on a string, swinging back and forth. This page swings one for you. Change the **length**, the angle you **let it go from**, and the **planet**, and it shows the **period** (the time for one full swing there and back) with the formula **T = 2π√(L/g)** filled in with your numbers. The motion on screen is the true motion, worked out step by step, so a big swing really does take longer.

Then do the experiment. Use the **stopwatch** to time 10 swings of the pendulum on screen, or of a real one at home, and add each reading to the table. The page draws **T² against L**, fits the best straight line and works out **g** from its slope, with an uncertainty.

It serves Class 7 Science (motion and time: the simple pendulum and its time period), Class 9 (motion and gravity, measuring time) and Class 11 Physics, Oscillations (the simple pendulum as simple harmonic motion) and the Class 11 practical on finding g with a pendulum. See [[shm-circle]] for why a pendulum moves in simple harmonic motion, and [[pendulum-analyser]] for a fuller analysis of your lab readings.

## How to use it

1. **Level**: *Class 7–9* gives the period and swings per minute, with release angles up to 45°. *Class 11* adds the exact period for big swings (up to 170°) and a graph of how far off the formula is.
2. **String length L**: from 10 cm to 2.5 m. The picture is drawn to fit the box.
3. **Let go from**: the release angle. **Let go again** starts the swing over; the counter shows swings and time.
4. **Gravity g**: Earth, Moon, Mars or Jupiter.
5. **Time it yourself**: press **Start** when the bob is at one end, count 10 returns to that end, press **Stop**. Check **Swings timed** and **Length used**, then **Add to my readings**. You can also type or paste readings, one "length, time" pair per line.

## Worked example

As the page opens, a 1 m pendulum on Earth: T = 2π√(1 / 9.8) = **2.007 s**, so 10 swings take about **20.07 s** and it makes about 29.9 swings a minute. At Class 11, letting go from 60° gives an exact period of 2.154 s, **7.32 % longer**; from 10° it is only 0.19 % longer.

The practice readings (lengths 0.2 to 1.0 m, times for 10 swings 9.0 to 20.1 s) give the best line T² = 4.044 × L − 0.00509, so **g = 4π² / 4.044 = 9.763 m/s² ± 0.049 m/s²**, about 0.38 % below 9.8.

## Check yourself

Five fresh questions: a period from a length, the length for a given period, g from a timing, what a longer string does, and what changes the period. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- Time 10 or 20 swings, not one. Your reaction time (about 0.2 s) is then shared out over all of them.
- Start and stop at the end of a swing, where the bob is slowest and easiest to see; or at the middle with a marker, where it passes quickly and the moment is sharp.
- Measure L to the middle of the bob, not just the string.
- Keep swings small (under about 10°) for the formula to hold.

## FAQ

**Why plot T² and not T?** T² = (4π²/g) L is a straight line through the origin, so its slope gives g directly. A line also shows at once if one reading is off.

**Why is there a small intercept?** If you measure the length a little short (to the top of the bob, say), the line shifts. The slope, and so g, is not affected, which is the beauty of the graph method.

**Does the mass of the bob matter?** No: heavier bobs feel more pull but need more pull to speed up, and the two cancel.
