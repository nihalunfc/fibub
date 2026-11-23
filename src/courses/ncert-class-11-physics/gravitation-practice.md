---
title: 'Gravitation: practice questions'
seoTitle: 'Gravitation Class 11 questions with answers'
summary: 'Board-style practice for Class 11 Gravitation: Kepler’s laws, g, potential energy, escape speed and satellites, with worked answers.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'A planet’s mass and radius are both double the Earth’s. The acceleration due to gravity on it is:'
    choices: ['g', 'g/2', '2g', '4g']
    ans: 1
    why: 'g ∝ M/R². Doubling both gives 2/4 = ½, so g/2.'
  - q: 'The orbital period of a satellite increases when its orbital radius is increased by a factor of 4. The period becomes:'
    choices: ['2 times', '4 times', '8 times', '16 times']
    ans: 2
    why: 'T² ∝ r³ so T ∝ r^1.5 = 4^1.5 = 8.'
  - q: 'The total energy of a satellite in a circular orbit is:'
    choices: ['positive and equal to its kinetic energy', 'negative and equal to minus its kinetic energy', 'zero', 'positive and equal to minus its potential energy']
    ans: 1
    why: 'K = GMm/2r, U = −GMm/r, E = −GMm/2r = −K.'
sources:
  - 'CBSE Class 11 Physics sample paper design (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 7.** Read the chapter lesson, [Gravitation](/learn/courses/ncert-class-11-physics/gravitation/), first. Try each question on paper before opening the answer.

<div class="bigidea">Gravitation numericals use only a few ideas: the inverse-square force, g at a height or depth, energy (−GMm/r) and the circular orbit (gravity equals mv²/r). Ratios are your friend: write the formula once and compare two cases.</div>

## How to set out a numerical

1. Write the formula in symbols and the data in SI units (km to m!).
2. When two cases are compared, divide the formulas instead of computing each.
3. Remember r is measured from the **centre** of the planet: r = R + h.

<div class="problem" data-problem="c11p-grav-g"></div>

<div class="problem" data-problem="c11p-grav-escape"></div>

## 1-mark questions

1. State Kepler’s law of areas.

<details><summary>Answer</summary>The line joining a planet to the Sun sweeps out equal areas in equal intervals of time.</details>

2. Is the force of gravity between two bodies attractive or repulsive?

<details><summary>Answer</summary>Always attractive.</details>

3. What is the value of g at the centre of the Earth?

<details><summary>Answer</summary>Zero.</details>

4. Which physical quantity is conserved in Kepler’s second law?

<details><summary>Answer</summary>Angular momentum about the Sun.</details>

5. Does the escape speed depend on the mass of the body that escapes?

<details><summary>Answer</summary>No. It is √(2GM/R) and depends only on the planet.</details>

## 2- and 3-mark questions

6. (2) The Earth is nearest to the Sun in January. In which month is its orbital speed greatest, and why?

<details><summary>Answer</summary>In January, at perihelion. By the law of areas the planet moves fastest when it is closest to the Sun.</details>

7. (2) If the distance between two masses is tripled, by what factor does the force change?

<details><summary>Answer</summary>F ∝ 1/r², so it becomes 1/9 of its value.</details>

8. (3) Show that the weight of a body is slightly less at the equator than at the poles.

<details><summary>Answer</summary>The Earth bulges slightly at the equator, so the equatorial radius is larger and GM/R² is smaller. In addition the rotation of the Earth needs part of the gravitational pull to provide the centripetal force at the equator. Both effects reduce the effective g there (9.78 m/s² against 9.83 m/s² at the poles).</details>

9. (3) At what height above the Earth’s surface is g equal to one quarter of its surface value? (R = 6371 km)

<details><summary>Answer</summary>

g′ = g R²/(R + h)² = g/4 gives (R + h) = 2R, so h = R = 6371 km.

</details>

10. (3) Find the ratio of the periods of two satellites whose orbital radii are in the ratio 1 : 4.

<details><summary>Answer</summary>

T² ∝ r³, so T₁/T₂ = (1/4)^1.5 = 1/8. The nearer satellite has the shorter period, one eighth of the other.

</details>

11. (3) Why can a satellite of any mass be placed in the same orbit with the same speed?

<details><summary>Answer</summary>

Gravity GMm/r² = mv²/r, and m cancels: v = √(GM/r) depends only on the central mass and the orbit radius.

</details>

12. (3) Explain why the Moon has no atmosphere while the Earth has.

<details><summary>Answer</summary>The Moon’s escape speed (2.4 km/s) is small, so gas molecules, whose thermal speeds can approach this value, escape easily. The Earth’s escape speed (11.2 km/s) is much greater, so it holds on to the heavier gases.</details>

## 5-mark questions

13. (5) Derive an expression for the acceleration due to gravity at a depth d below the surface of the Earth, assuming uniform density.

<details><summary>Answer</summary>

At the surface g = GM/R² with M = (4/3)πR³ρ, so g = (4/3)πGρR.

At depth d, only the sphere of radius r = R − d attracts the body (the outer shell exerts no net force). Its mass is (4/3)πr³ρ, so g_d = G(4/3)πr³ρ/r² = (4/3)πGρr.

Dividing: g_d/g = r/R = (R − d)/R, so

g_d = g(1 − d/R).

It decreases linearly with depth and becomes zero at the centre.

</details>

14. (5) Derive the escape speed from the surface of a planet and find its value for the Earth.

<details><summary>Answer</summary>

A body of mass m is projected with speed v from the surface (radius R). To escape it must reach infinity where its total energy is at least zero. By conservation of energy:

½ m v² − GMm/R = 0, so v_esc = √(2GM/R).

Since GM = gR², v_esc = √(2gR) = √(2 × 9.8 × 6.37 × 10⁶) = 1.12 × 10⁴ m/s = 11.2 km/s.

</details>

15. (5) Derive Kepler’s third law for a planet in a circular orbit and find the orbital speed and the total energy of a satellite.

<details><summary>Answer</summary>

For an orbit of radius r around a mass M, gravity provides the centripetal force: GMm/r² = mv²/r. So v = √(GM/r).

The time period T = 2πr/v = 2π√(r³/GM), so T² = (4π²/GM) r³ ∝ r³.

Energy: K = ½mv² = GMm/2r; U = −GMm/r. Total E = K + U = −GMm/2r (negative: the satellite is bound).

</details>

## Case-based question

**A geostationary satellite.** An INSAT-type communication satellite stays above the same point of the equator at a height of 35 800 km. Take R = 6371 km and GM = 3.986 × 10¹⁴ m³/s².

(a) What is its time period, and why?

<details><summary>Answer</summary>

24 hours (86 400 s, strictly one sidereal day, 23 h 56 min), equal to the Earth’s rotation period, so it remains above the same spot.

</details>

(b) Find the radius of its orbit from the centre of the Earth.

<details><summary>Answer</summary>

r = R + h = 6371 + 35 800 = 42 171 km.

</details>

(c) Find its orbital speed.

<details><summary>Answer</summary>

v = √(GM/r) = √(3.986 × 10¹⁴/4.217 × 10⁷) = 3.07 km/s.

</details>

(d) Would a satellite in a lower orbit appear to stay above one spot? Explain.

<details><summary>Answer</summary>No. A lower satellite has a shorter period (T ∝ r^1.5), so it goes round faster than the Earth turns and moves across the sky.</details>

## Assertion and reason

For each, choose: (a) both true and R explains A; (b) both true but R does not explain A; (c) A true, R false; (d) A false, R true.

16. **A:** An astronaut in an orbiting space station feels weightless. **R:** There is no gravity at that height.

<details><summary>Answer</summary>(c). A is true, but R is false: gravity there is still about 90% of its ground value. The astronaut and the station are both in free fall.</details>

17. **A:** The orbital speed of a satellite decreases when its orbit gets larger. **R:** v = √(GM/r).

<details><summary>Answer</summary>(a). The formula shows v falls as r increases.</details>

18. **A:** The total energy of a bound satellite is negative. **R:** Its potential energy is negative and larger in size than its kinetic energy.

<details><summary>Answer</summary>(a). |U| = GMm/r is twice K = GMm/2r, so E = K + U = −K < 0.</details>

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="gravitation" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Kepler: ellipse, equal areas (L conserved), T² ∝ a³.
- F = Gm₁m₂/r²; g = GM/R²; g_h = gR²/(R + h)²; g_d = g(1 − d/R).
- U = −GMm/r; v_esc = √(2gR) = 11.2 km/s; v_orbit = √(GM/r).
- Satellite: T = 2π√(r³/GM), E = −GMm/2r.
- Geostationary: T = 24 h, equatorial, about 36 000 km above the ground.

</div>
