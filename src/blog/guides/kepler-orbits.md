---
title: "Kepler's laws of planetary motion, with a launch you can change"
seoTitle: "Kepler's laws of planetary motion explained | fibub"
summary: "Why orbits are ellipses, why planets sweep equal areas, why T² = a³, and how g changes above and below the Earth, with a fresh worked example."
tools: [kepler-orbits, two-body-orbit, orbit-elements, energy-track]
updated: 2026-11-10
sources:
  - "Newton's law of gravitation, Kepler's three laws, orbital and escape speed, and g outside and inside a uniform sphere are standard school physics."
  - "1 AU/yr = 4.7405 km/s from the IAU astronomical unit and the Julian year; g₀ = 9.8 m/s² and R = 6,371 km are the rounded values the tool uses."
---

Kepler orbits lets you launch a planet from the Earth's distance and watch what its path becomes: a circle, a stretched ellipse or an escape. It also checks Kepler's third law against the real planets and shows how gravity changes as you go up from the Earth or down inside it. It is for students of gravitation in Class 9 and Class 11, and for anyone who has wondered why a planet speeds up near the Sun. When both bodies move, see [[two-body-orbit]]; to read the orbit numbers astronomers publish, use [[orbit-elements]]; and to see kinetic and potential energy trade places on Earth, try [[energy-track]].

## What it is

Isaac Newton showed that every mass pulls every other mass with a force F = G M m ÷ r². Here G is the gravitational constant, M and m are the two masses and r is the distance between their centres. Twice as far away, the pull is a quarter as strong: the **inverse square law**.

From that one law come Johannes Kepler's three laws:

1. **Orbits are ellipses**, with the star at one **focus** (one of the two special points inside the ellipse). A circle is an ellipse with both foci in the middle.
2. **Equal areas in equal times.** The line from star to planet sweeps out the same area each day. Near the star the line is short, so the planet must move fast; far away it is long, so the planet moves slowly.
3. **T² = a³** for anything orbiting the Sun, when T is the period in years and a is the **semi-major axis** (half the longest width of the ellipse) in astronomical units (AU; 1 AU is the Earth's average distance from the Sun).

The **eccentricity** e says how stretched an ellipse is: 0 is a circle, close to 1 is long and thin. The closest point is a(1 − e) and the farthest a(1 + e).

Launch speed decides the shape. At the **circular speed**, v = √(GM ÷ r), the orbit is a circle. At the **escape speed**, v = √(2GM ÷ r), the planet never comes back. Between these, it is an ellipse.

Near the Earth, the pull per kilogram is **g**. Above the surface, g = g₀ × (R ÷ r)², where g₀ = 9.8 m/s² is the surface value, R = 6,371 km the Earth's radius and r your distance from the centre. Inside a uniform Earth only the part below you pulls you on balance, so g = g₀ × (r ÷ R), falling to zero at the centre.

## How to use it

1. Choose **Class 9** or **Class 11**. Class 11 adds the line to the star, slice areas, the orbit's energy and the formulas for g.
2. In **Launch a planet**, move the **Launch speed** slider (15 to 50 km/s) or drag the arrow tip.
3. Press **Play** to watch the planet go round; **Reset** starts again. Keep the shading on to see the twelve equal-area slices.
4. Open **T² = a³** to see the planets on a straight line, with your orbit added.
5. Open **g above and below** and move the **Height** slider, from the centre of the Earth (6,371 km deep) up to three Earth radii above the surface. Negative heights mean depth below the surface.
6. Try the **Try this** list, then the **Check yourself** questions.

## A worked example

Set the launch speed to **33 km/s**. In AU per year that is 33 ÷ 4.7405 = 6.961 AU/yr, a little above the circular speed of 2π = 6.283 AU/yr, so the planet is launched at its closest point and swings outwards.

- The semi-major axis comes out at **a = 1.295 AU** and the eccentricity at **e = 0.23**.
- Closest point: 1 AU, where it was launched. Farthest point: a(1 + e) = **1.589 AU**.
- Period: T = a^1.5 = 1.295^1.5 = **1.473 years**, about 538 days. Check: T² = 2.169 and a³ = 2.169.
- Each of the twelve slices covers **0.4272 AU²** and takes T ÷ 12 = 44.8 days.

Now drop to **20 km/s**. This is below the circular speed, so the launch point becomes the farthest point and the planet falls inwards to just **0.291 AU**, closer than Mercury. Its year is only **0.519 years**, about 189 days.

In **g above and below**, set the height to **12,742 km** (two Earth radii up, so three radii from the centre): g = 9.8 ÷ 3² = **1.09 m/s²**. A 50 kg student there would weigh about 54.4 N instead of 490 N. Set it to **−3,186 km** (halfway down): g = 9.8 × (3,185 ÷ 6,371) = **4.90 m/s²**.

## Where it is used

- **Spacecraft.** Mission planners use Kepler's laws to plan transfer orbits, such as the ellipse that takes a probe from Earth to Mars.
- **Satellites.** A satellite's height sets its period. That is why satellites that hover over one spot (geostationary satellites, which some weather satellites are) all sit at the same height.
- **Finding exoplanets.** Astronomers time how often a planet passes in front of its star, then use the third law (with the star's mass) to find how far out it orbits.
- **Weighing stars and galaxies.** Measuring a and T for something in orbit gives the mass of what it orbits.

## Common mistakes

- **Thinking the star sits in the middle.** It sits at a focus, off to one side. Only a circle has it in the centre.
- **Using any units with T² = a³.** The simple form works only for years and AU around a Sun-mass star. In other units you need T² = 4π²a³ ÷ (GM).
- **Mixing up mass and weight.** Mass, in kg, stays the same everywhere. Weight is m × g, in newtons, and changes with height.
- **Measuring height from the surface in the g formula.** Use the distance from the Earth's centre, R + h, not h alone.

## Questions people ask

**Why does a faster launch give a longer year?** A faster launch carries the planet farther out, so the ellipse is bigger, and a bigger a means a longer period by the third law.

**Do the planets really pull on each other?** Yes, a little. Those small pulls make real orbits drift slowly, which is how Neptune was found from the wobbles in Uranus's orbit.
