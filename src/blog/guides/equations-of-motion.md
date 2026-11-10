---
title: "Equations of motion: how v = u + at, s = ut + ½at² and v² = u² + 2as fit together"
summary: "The three equations of motion for steady acceleration, what each symbol means, and how to see them on a velocity-time graph. Solve a problem from three known values, and find a car's stopping distance."
tools: [equations-of-motion, motion-graphs, projectile-drag, video-motion-tracker]
updated: 2026-11-10
sources:
  - "Equations of motion for uniform acceleration in a straight line, derived from the slope and area of a velocity-time graph: standard school physics."
  - "The stopping-distance road values in the tool (7, 4.5 and 2.5 m/s²) are rounded teaching numbers, not measured data."
---

Three equations describe any object that speeds up or slows down at a steady rate in a straight line. They link the starting speed, the final speed, the acceleration, the time and the distance. The [[equations-of-motion]] tool shows them on a velocity-time graph, so you can see where each one comes from. Before this, the [[motion-graphs]] tool covers reading the graphs themselves. After it, [[projectile-drag]] takes the same equations into two directions, and [[video-motion-tracker]] lets you measure a real motion from a video.

## What it is

Use these symbols:

- **u** is the starting velocity, in metres per second (m/s).
- **v** is the final velocity (m/s).
- **a** is the acceleration (m/s²). A negative value means slowing down, if the direction you call positive is the direction of motion.
- **t** is the time (s).
- **s** is the displacement (m), the change in position in a straight line.

On a velocity-time graph, the line starts at u and rises or falls to v at time t. The area under the line is the displacement. Split that area into a rectangle and a triangle:

- The **rectangle** has width t and height u, so its area is u × t. This is the distance you would cover at the starting speed.
- The **triangle** has width t and height v − u, which is at, so its area is ½ × t × at = ½at². This is the extra distance from speeding up.

Add them up and you get s = ut + ½at². Because the rise v − u equals at, the slope of the line gives you the first equation, v = u + at. Eliminating the time t from the two gives the third, v² = u² + 2as. The third one is handy when no time is given.

Stopping distance is the same picture. The flat part is the **thinking distance**: speed × reaction time, before the brakes work. The slope is the **braking distance**, given by v² ÷ (2 × deceleration).

## How to use it

1. Choose a level. Class 9 explains where the equations come from with the graph. Class 11 derives them with calculus.
2. In **Explore the graph**, drag the handles to change the starting velocity and the end of the line. The sliders make finer changes. Watch the three equations update with your numbers.
3. Press **Play** to see the car move while a dashed line travels along the graph.
4. In **Solve a problem**, enter any three of u, v, a, s and t, and leave the other two blank. The page shows which equations it used.
5. In **Stopping distance**, set the speed, the reaction time and the road surface, and read the thinking and braking distances.

## A worked example

A cyclist starts at u = 5 m/s and accelerates at a = 2 m/s² for t = 6 s.

- Final speed: v = u + at = 5 + 2 × 6 = **17 m/s**
- Displacement: s = ut + ½at² = 5 × 6 + ½ × 2 × 36 = 30 + 36 = **66 m**
- Check with the third equation: v² = 289, and u² + 2as = 25 + 2 × 2 × 66 = 289. The answers agree.

Now a car with u = 12 m/s slows down to v = 0 with a = −3 m/s².

- Time: t = (v − u) ÷ a = (0 − 12) ÷ (−3) = **4 s**
- Distance: s = (v² − u²) ÷ (2a) = (0 − 144) ÷ (−6) = **24 m**

A ball is thrown upwards at 15 m/s. Taking upwards as positive, a = −10 m/s², and it has risen s = 10 m. Solving 10 = 15t − 5t² gives t = 1 s and t = 2 s. At 1 s the ball is still going up at 5 m/s. At 2 s it is coming down at −5 m/s, passing the same height on the way down.

Finally, a car at 36 km/h (10 m/s) on a wet road, with a reaction time of 0.8 s and deceleration of 4.5 m/s²: the thinking distance is 10 × 0.8 = 8 m, the braking distance is 10² ÷ 9 = 11.1 m, and the stopping distance is **19.1 m**. At 72 km/h the thinking distance doubles to 16 m, but the braking distance becomes four times as long at 44.4 m, so the total is **60.4 m**.

## Where it is used

- **Road safety.** Driving schools and road authorities use stopping distances to teach why speed matters.
- **Sport.** Coaches estimate how fast a sprinter accelerates from the first few metres.
- **Physics labs.** Ticker-tape timers and light gates record the motion, and these equations check the results.
- **Lifts and trains.** Engineers use them to plan how fast a lift can speed up and stop comfortably.

## Common mistakes

1. **Mixing units.** Convert km/h to m/s by dividing by 3.6 before using the equations. 54 km/h is 15 m/s, not 54.
2. **Losing track of the sign.** Choose a positive direction and stick to it. If forwards is positive, slowing down gives a negative acceleration.
3. **Reading s as distance.** s is displacement. If the object turns back, the distance travelled is larger than s.
4. **Using the equations for changing acceleration.** They work only for steady acceleration. For a changing one, use the area under the graph.
5. **Forgetting the reaction time.** A stopping distance without the thinking distance is too short, because the driver needs time to react before the brakes start.

## Questions people ask

**Which equation do I use if I do not know the time?** Use v² = u² + 2as. It links speed and distance without t.

**Do these work for falling objects?** Yes, with a = g, about 9.8 m/s² downward, if you take downward as positive. The ball example above shows the same idea with the sign reversed.

**Why does doubling my speed more than double the stopping distance?** The thinking distance is speed × reaction time, so it doubles. The braking distance uses v², so it goes up four times. The total grows by a factor between two and four.
