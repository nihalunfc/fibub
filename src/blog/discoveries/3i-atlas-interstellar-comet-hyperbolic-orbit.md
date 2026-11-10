---
title: "3I/ATLAS: the third interstellar object and its hyperbolic orbit"
summary: "A 2025 open-access paper reports the discovery of 3I/ATLAS, a comet from another star on an orbit with eccentricity about 6. Here is how to check its speed with fibub."
tools: [orbit-elements, two-body-orbit]
updated: 2026-11-10
sources:
  - "Seligman, D. Z., Micheli, M., Farnocchia, D. et al. (2025), Discovery and Preliminary Characterization of a Third Interstellar Object: 3I/ATLAS, The Astrophysical Journal Letters 989, L36, published 13 August 2025. Open access under the Creative Commons Attribution 4.0 licence, checked on the published version, 2026-11-10."
  - "The Sun's gravitational parameter (1.32712440018 × 10¹¹ km³/s²) and the astronomical unit (149,597,870.7 km) are IAU standard values."
paper:
  title: "Discovery and Preliminary Characterization of a Third Interstellar Object: 3I/ATLAS"
  authors: "Seligman DZ, Micheli M, Farnocchia D, Denneau L, Noonan JW et al."
  journal: "The Astrophysical Journal Letters"
  year: 2025
  doi: "10.3847/2041-8213/adf49a"
  url: "https://doi.org/10.3847/2041-8213/adf49a"
  licence: "CC BY 4.0"
  reviewed: true
---

On 1 July 2025 a survey telescope in Chile picked up a faint moving dot that turned out to be only the third object ever seen passing through the Solar System from interstellar space. A team of 47 astronomers described its discovery and first measurements in *The Astrophysical Journal Letters*, open access under CC BY 4.0. The key number is the shape of its path: an eccentricity of about 6.1, which no object bound to the Sun could have. You can turn that shape into the comet's speed far from the Sun with the [[orbit-elements]] page, and watch a fly-by bend in the [[two-body-orbit|two-body orbit simulator]].

## What they found

The object, named 3I/ATLAS, was first flagged by the ATLAS survey when it was about 4.5 astronomical units (au) from the Sun, a bit closer than Jupiter's orbit. One au is the average Earth to Sun distance.

From those positions they fitted an orbit with an eccentricity of 6.13 and a closest approach to the Sun (perihelion) of about 1.36 au, reached around the end of October 2025. They report an incoming speed of about 58 km/s relative to the Sun, before the Sun's pull sped it up. Its orbit is tilted by about 175°: nearly in the planets' plane, but running backwards.

Deep images showed a small fuzzy cloud of dust (a coma), so it is an active comet, not a bare rock.

## Why it matters

An eccentricity below 1 means a closed ellipse: the object belongs to the Sun. Exactly 1 is a parabola, the dividing line. Above 1 is a hyperbola, an open path that comes in once and leaves for ever. A value of 6 is far beyond anything the planets could give a home-grown comet, so the orbit alone proves it came from another star.

Interstellar objects are free samples of material made around other stars, and with only three known, each one counts.

## How they did it

The orbit comes from astrometry: precise sky positions measured at known times, then fitted with the motion that gravity allows. Older survey images, found after the discovery, stretched the record back to late May and tightened the fit.

The size estimate is rougher. The team measured how bright the object is and converted that into a diameter by assuming how much light its surface reflects (an albedo of 0.05, typical of comets). That gives a radius of up to about 10 km. Because the coma adds light, the true nucleus is probably smaller, and the authors call the figure an upper limit.

## Check it yourself with fibub

The speed far from the Sun follows from just two numbers, the perihelion distance q and the eccentricity e, through v∞ = √(μ(e − 1)/q), where μ is the Sun's gravitational parameter. The [[orbit-elements]] page does this for you.

**Step 1.** Open the page and set **Body** to the Sun. The μ box fills in with 1.327 × 10¹¹ km³/s².

**Step 2.** Under **Elements**, set **Size given as** to the periapsis distance q, in km (1 au = 149,597,870.7 km). For a worked example, take a **made-up** comet with rounded numbers: q = 1.4 au and e = 6. That makes q = 209,437,019 km. Type an inclination of 175°, leave Ω and ω at any values, and set the true anomaly ν to 0 (the comet at perihelion).

**Step 3.** Read the results. The page shows a hyperbolic orbit with a semi-major axis of −0.28 au (negative, as for every hyperbola), a speed of **66.6 km/s at perihelion**, and a hyperbolic excess speed **v∞ of 56.3 km/s**. It also gives a turn angle of 19.2°: the Sun bends the path by only that much, because the comet is so fast.

**Step 4.** Now find where it was spotted. Set the true anomaly to −78.7°. That puts our made-up comet 4.5 au from the Sun, on the way in. The page gives a speed of 59.7 km/s there and a time since periapsis of −123 days, so it would reach perihelion about four months after discovery. The real comet was found on 1 July and passed perihelion near 29 October, which is about the same gap.

**Step 5.** Change e to 1.2 and keep q. The excess speed drops to 11.3 km/s and the turn angle grows to 113°. A slow visitor gets swung right round the Sun, and a fast one barely bends. To see that happen, the [[two-body-orbit]] simulator animates a fly-by: start a body 4.5 AU from a one-solar-mass star, try a few starting speeds, and watch how much the path bends.

Typing the paper's own rounded values, q = 1.356 au and e = 6.13, gives v∞ of about 57.9 km/s, matching the figure the authors report. Small differences are possible, since they fit the orbit with the planets included.

## The fine print

- This is a **discovery paper**, written within weeks. The orbit was already good, but the physical numbers (size, spin, colour) are first looks.
- The **size rests on an assumed albedo**, and the coma makes the object look bigger than its nucleus. A real albedo twice as high would make it about 30% smaller.
- No **rotation period** could be pinned down: the brightness changed by less than about 0.2 magnitudes with no clear pattern.
- Our steps use a simple **two-body** model (the Sun and the comet only). Precise orbits also need the planets and the push from gas leaving the comet. Our worked numbers are made up and rounded; read the paper for the measured values and their uncertainties.
