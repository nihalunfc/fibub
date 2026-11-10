---
title: "A planet in the Neptune desert: TOI-333b, and how to check its numbers"
summary: "A 2026 open-access paper reports TOI-333b, a planet about four times Earth's size that circles its star in under four days. Here is what the team found and how to test the maths with fibub tools."
tools: [exoplanet-mass-calculator, transit-light-curve-fitter, radial-velocity-fitter]
updated: 2026-11-10
sources:
  - "Alves, D. R. et al. (2026), TOI-333b: A Neptune-desert planet around an F7V star, Astronomy & Astrophysics 705, A210, published online 22 January 2026. Open access under Creative Commons Attribution (CC BY 4.0). Licence and author list checked on the publisher's abstract page, 2026-11-10."
paper:
  title: "TOI-333b: A Neptune-desert planet around an F7V star"
  authors: "Alves, D. R.; Jenkins, J. S.; Vinés, J. I. et al."
  journal: "Astronomy & Astrophysics"
  year: 2026
  doi: "10.1051/0004-6361/202557014"
  url: "https://www.aanda.org/articles/aa/abs/2026/01/aa57014-25/aa57014-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Some of the most interesting planets are the ones that should not be there. For a long time, astronomers noticed that planets about the size of Neptune were rare when they orbited very close to their star. A January 2026 paper in *Astronomy & Astrophysics* reports a new example, TOI-333b, that sits right inside that gap. It is open access under a CC BY 4.0 licence, so you can read the full paper free.

## What they found

The planet, named TOI-333b, orbits an F-type star a little hotter and larger than the Sun. It goes round once every 3.78 days. The authors report that it is about 4.3 times the radius of the Earth and about 20 times its mass. Those two numbers give a density of around 1.4 grams per cubic centimetre, which is far lighter per cubic centimetre than Earth (5.5) but is a small world, not a giant.

The density is the clue. It fits two pictures: a mostly rocky world with almost no gas around it, or a rocky world with roughly a fifth of its mass in water. The team could not pick one from these measurements alone. They also say the star is probably younger than about one billion years, judging by the lithium in its light, which makes it a young system.

## Why it matters

The "Neptune desert" is a name for the region of close orbits where few Neptune-sized planets are found. Why it is empty is still debated. One idea is that strong starlight can strip away a planet's atmosphere, leaving a smaller, denser world. Each planet found in the gap, with a measured mass and radius, helps test ideas like this. The authors note that TOI-333b is heavier and larger than most known planets in the desert, and that its star is among the hottest to host one. 

## How they did it

Astronomers find planets in two complementary ways, and this paper uses the results of both. When a planet passes in front of its star, the starlight dips a little. How deep the dip is, compared with the star's brightness, gives the planet's size. When the planet tugs on its star, the star wobbles towards and away from us. That wobble, seen as a tiny shift in the colour of the starlight, gives the planet's mass. Combining the two gives the density, and the density is what separates the possible compositions.

The team's values come with uncertainties: about 12% on the mass and about 3% on the radius. They then compare the density with models of a planet's interior, one with a hydrogen and helium envelope and one with a water layer, before stating what it could be.

## How to check it yourself with fibub tools

Two steps show how the numbers hang together, and you can run both in the browser with your own numbers.

**Step 1: the planet's radius from the dip.** The [[exoplanet-mass-calculator]] uses the simple rule that the planet's radius is the star's radius times the square root of the transit depth (the fraction of light blocked), ignoring limb darkening. Take a made-up star with a radius of 1.2 times the Sun's and a transit depth of 0.15%, which is 0.0015 as a fraction. The square root of 0.0015 is 0.0387. Multiply by 1.2 and by about 109.1 Earth radii in one solar radius, and the planet is **5.07 Earth radii** across. In the calculator, type 0.15 in the transit depth box (it takes a percentage) and 1.2 as the star radius in solar radii.

**Step 2: the density.** Density is mass divided by volume. Compare with Earth, whose density is about 5.51 grams per cubic centimetre. A made-up planet with 20 Earth masses and 4 Earth radii has a volume 4 × 4 × 4 = 64 times Earth's, so its density is 5.51 × 20 ÷ 64 = **1.72 g/cm³**. Change the radius to 5 Earth radii and the density drops to 5.51 × 20 ÷ 125 = 0.88 g/cm³. Small changes in radius matter a lot, which is why good size measurements are hard. The calculator does this for you when you give it a planet mass together with the depth and star radius.

To test the mass side, the [[radial-velocity-fitter]] takes a star's measured wobble and fits the orbit, and the [[transit-light-curve-fitter]] fits the shape of the dip itself. Try both with their built-in simulated examples or your own made-up data to see how the uncertainty travels from the measurement to the answer.

## The fine print

- This is **one planet around one star**. A single system cannot prove a general rule about the desert.
- The composition is **not settled**. Two very different interiors fit the density, and the paper says so.
- The "young star" claim rests on comparing the star's lithium with stars of known age, so it is an estimate, not a precise age.
- The mass carries an error of about 12%, and the radius about 3%. Because density depends on both, the density is less certain than either number alone.
- The planet's values in this article are rounded from the paper, which also gives the composition fractions with large error bars. For the exact values, uncertainties and method, read the paper itself. Our worked examples use made-up numbers, not the paper's data.
