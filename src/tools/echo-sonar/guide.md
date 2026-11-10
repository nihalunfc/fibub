---
name: Echo and SONAR
num: 1265
shelf: learn
section: school-physics
title: "Echo and SONAR"
summary: "Clap at a wall or send a ship's sound pulse to the sea bed and watch it come back. Get the echo time from the distance, or the depth from a measured echo time, with distance = speed × time ÷ 2."
status: live
ads: false
order: 1265
icon: target
works: offline
updated: 2026-11-09
related: [sound-wave-visualiser, decibel-distance, ultrasound-calculator, hearing-range]
sources:
  - "Speed of sound in dry air from the ideal-gas relation v = 331.3·√(1 + T/273.15) m/s; 1 500 m/s for sea water is the usual school value (real sea water is about 1 450 to 1 550 m/s). Persistence of hearing about 0.1 s, as used in school physics."
  - "Checked against hand calculation and Python: 331.3 m/s at 0 °C, 343.2 m/s at 20 °C; 100 m at 22 °C → 0.581 s; minimum echo distance at 22 °C → 17.2 m."
flow:
  - { icon: target, label: "Send sound" }
  - { icon: clock, label: "Time it" }
  - { icon: calculator, label: "v × t ÷ 2" }
  - { icon: ruler, label: "Distance" }
---

## What it does

An **echo** is sound bouncing back from a wall, a cliff or the sea bed. Because the sound goes **there and back**, the distance to the reflector is

**distance = speed × time ÷ 2**.

In **Echo off a wall**, set how far away the wall is and the air temperature. The page works out the speed of sound, the time for the echo, and whether you would hear it as a separate sound. Your ear keeps a sound for about 0.1 s, so the echo must arrive later than that: the wall has to be at least about 17 m away.

In **SONAR at sea**, a ship sends a pulse of ultrasound down to the sea bed. Set the depth to get the echo time, or type an echo time you measured to get the depth.

It follows the Class 9 science chapter *Sound Waves: Characteristics and Applications* (echo, SONAR). How the air vibrates in a sound wave is in [[sound-wave-visualiser]], and how hospitals use echoes of ultrasound is in [[ultrasound-calculator]].

## How to use it

1. Pick **Echo off a wall** or **SONAR at sea**.
2. Move the sliders, or type values.
3. Press **Send a sound** to watch the pulse go out (blue) and come back (red).
4. Read the answer and the working.

## A worked example

At 22 °C sound travels at about 331.3 × √(1 + 22/273.15) ≈ 344.4 m/s. With the wall 100 m away, the sound travels 200 m, which takes 200 ÷ 344.4 ≈ 0.581 s. That is more than 0.1 s, so you hear a clear echo. The shortest distance for an echo at this temperature is 344.4 × 0.1 ÷ 2 ≈ 17.2 m.

At sea, type an echo time of 4 s: the pulse travels 1 500 × 4 = 6 000 m, so the sea is 3 000 m deep.

## Tips

- Forgetting to halve is the most common mistake.
- Warm air carries sound faster, so echoes come back a little sooner on hot days.
- Bats and dolphins find their way with the same idea.

## FAQ

**Why ultrasound for SONAR?** Short, high-frequency waves make narrow beams that go far in water and give sharp echoes from small things.

**Is this the NCERT book?** No. It covers the same topic with fibub's own examples. fibub is not part of NCERT.
