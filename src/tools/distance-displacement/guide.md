---
name: Distance and displacement
num: 1258
shelf: learn
section: school-physics
title: "Distance vs displacement simulator: walk a path on a map, speed vs velocity, uniform circular motion on a track"
summary: "Tap a walk on a map and see the distance you walked next to the straight-line displacement, with average speed and average velocity. Then run round a circular track at a steady speed and watch the velocity arrow turn: uniform circular motion."
status: live
ads: false
order: 1258
icon: compass
works: offline
updated: 2026-11-09
related: [motion-graphs, equations-of-motion, banked-curve, shm-circle]
sources:
  - "Distance (a scalar, the length of the path) and displacement (a vector, the straight line from start to finish), average speed = distance ÷ time, average velocity = displacement ÷ time, uniform circular motion with period T = 2πr ÷ v, angular speed ω = v ÷ r and centripetal acceleration v² ÷ r: standard school physics found in any textbook."
  - "Checked against hand-worked examples: 300 m east and 400 m north gives 700 m and 500 m at 53.1° north of east; a quarter lap of radius 50 m gives a displacement of 50√2 = 70.71 m; and against the 3-4-5 and 5-12-13 right triangles."
flow:
  - { icon: pointer, label: "Tap a walk" }
  - { icon: ruler, label: "Distance" }
  - { icon: compass, label: "Displacement" }
  - { icon: orbit, label: "Track" }
---

## What it does

Distance is how far you actually walk; displacement is how far you end up from where you started, in a straight line and with a direction. This tool lets you see the difference.

**Walk on a map.** Tap corners of the grid to walk from Home. Each square is 100 m. The blue path is your distance; the orange arrow from Home to where you stand is your displacement. Set the time you took and the page gives your average speed (distance ÷ time) and average velocity (displacement ÷ time). Walk round the block and back home, and your displacement and average velocity are both zero.

**Round a track.** A runner goes round a circular track at a steady speed. The distance keeps growing, but the displacement grows to the diameter at half a lap and shrinks back to zero at the finish. The velocity arrow never changes length, yet it points a new way at every moment: that is uniform circular motion, and it is accelerated motion.

It follows the school topics on motion: distance and displacement, speed and velocity and uniform circular motion (Class 9 Science, describing motion around us) and vectors, components and centripetal acceleration (Class 11 Physics, motion in a straight line and motion in a plane). The next step is drawing motion as graphs in [[motion-graphs]] and solving it with [[equations-of-motion]]; for the force that keeps a car on a curve see [[banked-curve]].

## How to use it

1. Choose a **Level**. Class 11 adds the east and north components, the bearing and the vector form of the displacement, and on the track the angular speed and the centripetal acceleration (red arrow, pointing to the centre).
2. In **Walk on a map**, tap the map to add legs, or pick a **Ready-made walk**. **Undo** removes the last leg; **Clear** starts again at Home. Move **Time taken** to change the speeds.
3. In **Round a track**, set the radius and speed, then press **Run** (it plays one lap) or jump straight to ¼, ½, ¾ or 1 lap.

## Worked example

Pick **300 m east, then 400 m north** with **10 minutes**. Distance = 300 + 400 = **700 m**. Displacement = √(300² + 400²) = **500 m**, **53.1° north of east**. In 600 s the average speed is 700 ÷ 600 = **1.17 m/s** but the average velocity is only 500 ÷ 600 = **0.83 m/s**.

On the track with radius **50 m** and speed **5 m/s**, one lap takes 2π × 50 ÷ 5 = **62.83 s**. At ¼ lap the distance is 78.54 m and the displacement 70.71 m; at ½ lap 157.08 m and **100 m** (the diameter); after 1 lap 314.16 m and **0 m**. In Class 11 the centripetal acceleration is 5² ÷ 50 = **0.5 m/s²**.

## Tips

- Displacement can be zero when distance is not, but it can never be bigger than the distance.
- They are equal only for motion in one straight line without turning back.
- Speed is a scalar; velocity is a vector. A change in direction alone is a change in velocity.

## FAQ

**Why is moving in a circle at steady speed called accelerated motion?** Acceleration is a change in velocity, and velocity includes direction. On a circle the direction changes all the time, so there is an acceleration (towards the centre) even though the speedometer reading never changes.

**Why does the walk snap to the grid?** So the numbers stay round and easy to check by hand. Any walk made of straight legs works the same way.

**Is anything stored?** No. The questions are made fresh in your browser and nothing is saved or sent.
