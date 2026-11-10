---
title: "Why GPS needs relativity: satellite clock drift worked out"
summary: "Why a navigation satellite's clock runs fast against one on the ground, how gravity and speed pull in opposite directions, and a worked Galileo example."
tools: [gps-relativity, spacetime-diagram, satellite-tracker, physical-constants]
updated: 2026-11-10
sources:
  - "Weak-field clock rates, the factory frequency offset and the eccentricity term (2/c²)√(GMa) e sin E: Ashby, N. (2003), Relativity in the Global Positioning System, Living Reviews in Relativity 6, 1 (open access)."
  - "Earth's GM = 3.986004418 × 10¹⁴ m³/s², rotation rate 7.292115 × 10⁻⁵ rad/s and mean radius 6,371 km: standard rounded constants, as used by the tool. Orbit radii of the presets are rounded."
---

The GPS relativity explainer works out how fast the atomic clock on a navigation satellite runs compared with a clock on the ground, and what that means for positioning. You choose an orbit and where the receiver stands, and it splits the difference into the part caused by gravity and the part caused by speed, then tells you how to tune the clock before launch and how far off positions would drift if nobody did. It suits physics students meeting relativity for the first time and anyone curious about why their phone's map works. To picture time running at different rates, draw it on the [[spacetime-diagram]]; to see where the real satellites are right now, open the [[satellite-tracker]]; and to look up the speed of light and other values used here, try [[physical-constants]].

## What it is

A receiver finds its position by timing radio signals from several satellites. Light covers about 300 m in one microsecond (µs), so the clocks must agree to within a few billionths of a second. At that level, two results from Einstein matter.

**Gravity (general relativity).** A clock deeper in a gravity well ticks more slowly. The satellite is far above us, where gravity is weaker, so its clock runs fast. The fractional gain is

GM/c² × (1/R − 1/a)

where G M is Earth's gravitational parameter (G times Earth's mass), c is the speed of light, R is the receiver's distance from Earth's centre and a is the orbit radius.

**Speed (special relativity).** A moving clock ticks slowly. The satellite moves at v = √(GM/a), a few kilometres per second, so its clock loses about v²/(2c²). The ground clock also moves, because Earth spins, so the tool subtracts that smaller effect, which is largest at the equator.

Add the two and you get the **net rate**. Multiply by 86,400 seconds for microseconds per day, and by c for the range error that would build up each day.

Real orbits are slightly oval. The **eccentricity** e measures how far from a circle the orbit is. On an oval orbit the clock speeds up and slows down a little over each lap, by up to (2/c²)√(GMa) × e. Receivers remove it themselves.

Close to Earth the speed effect is bigger, so a clock in a low orbit runs slow. Further out gravity wins. The tool reports the **break-even radius** where the two cancel.

## How to use it

1. Choose an **Orbit** preset (GPS, Galileo, GLONASS, geostationary or a low orbit like a space station), or type your own **Orbit radius from Earth's centre** in km.
2. Enter the **Orbit eccentricity e**. Use 0 for a perfect circle.
3. Enter the **Receiver latitude** in degrees and **Receiver height** in metres.
4. If you are studying another system, change the **Satellite clock frequency** in MHz.
5. Read the headline (gains or loses so many µs per day) and the facts below it: each effect, the net rate, the frequency to set on the ground, the error if ignored, the eccentricity correction, the orbit's period and height and the break-even orbit.
6. The first chart plots the three rates against orbit radius with your orbit marked; the second shows the eccentricity term over two orbits. Download the rates as CSV, or the whole report as an image, PDF or Word file.

## A worked example

Pick the **Galileo** preset (29,600 km), an eccentricity of **0.002**, and a receiver at **51.5° N** and **100 m** above sea level.

- Receiver distance from the centre: R = 6,371,000 + 100 = **6,371,100 m**.
- GM/c² = 3.986004418 × 10¹⁴ ÷ 299,792,458² = **4.435 × 10⁻³ m**.
- Gravity: 4.435 × 10⁻³ × (1/6,371,100 − 1/29,600,000) = **5.463 × 10⁻¹⁰**. Over a day (× 86,400 s) that is **+47.20 µs/day**.
- Satellite speed: √(GM/a) = **3,670 m/s**. The receiver's own speed from Earth's spin is 7.292115 × 10⁻⁵ × 6,371,100 × cos 51.5° = **289 m/s**.
- Speed: −(3,670² − 289²) ÷ (2c²) × 86,400 s = **−6.43 µs/day**.
- Net: 47.20 − 6.43 = **+40.77 µs/day**. The headline reads "Satellite clock gains 40.8 µs per day".
- Error if ignored: 40.77 × 10⁻⁶ s × c = **12.2 km per day**, about **509 m an hour**.
- Clock setting on the ground: 10.23 MHz ÷ (1 + 4.718 × 10⁻¹⁰) = **10.22999999517 MHz**, which is **0.00483 Hz** low.
- Eccentricity correction: (2/c²) × √(GM × 29,600,000 m) × 0.002 = **±4.83 ns**, or **±1.45 m** of range.

The orbit takes **14.08 hours**, and the break-even radius for this receiver is **9,550 km**. Change the preset to geostationary and the gain rises to about **46.6 µs/day**: a higher orbit gains more from weak gravity and loses less from speed.

## Where it is used

- **Satellite navigation.** GPS, Galileo, GLONASS and BeiDou all detune their clocks before launch and correct the eccentricity term in receivers.
- **Time transfer.** Labs comparing atomic clocks across continents by satellite apply the same corrections.
- **Geodesy.** Modern clocks are so precise that a height change of about a centimetre shows up as a rate change, so clocks can measure height differences.

## Common mistakes

- **Using height instead of radius.** The orbit radius is measured from Earth's centre. Add about 6,371 km to a height above the surface.
- **Forgetting the signs.** Gravity makes the satellite clock fast (plus); speed makes it slow (minus). For GPS, adding the sizes without signs gives about 53 µs a day instead of 38.
- **Leaving out the ground clock.** The receiver is in Earth's gravity well and spins with Earth. Both are measured against it, not against a clock far out in space.
- **Confusing rate with offset.** µs per day is a rate. The eccentricity term is an offset that swings back and forth and does not build up.

## Questions people ask

**Why does the low-orbit preset lose time?** Its speed is near 7.7 km/s and it sits only about 400 km up, so the slowing from speed beats the gain from weaker gravity.

**Does my latitude really matter?** A little. At the poles the ground clock does not move with Earth's spin, so the net changes by about 0.1 µs per day compared with the equator.
