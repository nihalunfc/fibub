---
title: "GJ 251 c: a habitable zone super-Earth candidate found by radial velocity"
summary: "A 2025 Astronomical Journal paper reports GJ 251 c, a planet of at least four Earth masses in the habitable zone of a red dwarf 18 light years away. Check its orbit and temperature in your browser."
tools: [habitable-zone-calculator, radial-velocity-fitter]
updated: 2026-11-10
sources:
  - "Beard, C. et al. (2025), Discovery of a Nearby Habitable Zone Super-Earth Candidate Amenable to Direct Imaging, The Astronomical Journal 170(5), 279, published online 23 October 2025. CC BY 4.0, per the publisher's Crossref record, checked 2026-11-10."
  - "Habitable zone edges: Kopparapu et al. (2014), as used by the fibub calculator."
paper:
  title: "Discovery of a Nearby Habitable Zone Super-Earth Candidate Amenable to Direct Imaging"
  authors: "Beard C, Robertson P, Lubin J, Ford EB, Mahadevan S et al."
  journal: "The Astronomical Journal"
  year: 2025
  doi: "10.3847/1538-3881/ae0e20"
  url: "https://doi.org/10.3847/1538-3881/ae0e20"
  licence: "CC BY"
  reviewed: true
---

A red dwarf only 5.6 parsecs (about 18 light years) from the Sun may have a rocky-sized planet in its habitable zone. In an October 2025 paper in *The Astronomical Journal*, a team led by Corey Beard reports GJ 251 c, a candidate planet with a 54-day orbit and a minimum mass of nearly four Earths. Using the star's published values, the [[habitable-zone-calculator]] tells you where that orbit sits, and the [[radial-velocity-fitter]] shows how a wobble of about one metre per second becomes a planet's mass. The paper is open access under a CC BY licence.

## What they found

GJ 251 is a cool M dwarf, a star with about a third of the Sun's mass and roughly 1.5 % of its light. An inner planet, GJ 251 b, was already known on a 14-day orbit. The new signal repeats every 53.6 days. The authors give its minimum mass as about 3.8 Earth masses. That is light enough that it may be rocky, though nobody can say so yet. By their numbers it receives about 0.4 times the starlight that Earth gets, which puts it inside the conservative habitable zone.

They are careful to call it a *candidate*. The model with two planets beats the model with one, but only by a little more than the margin the team required.

## Why it matters

Most habitable zone planets known so far orbit stars that are too far away or too faint to photograph directly. GJ 251 is close enough that the planet sits far enough from its star on the sky for the coming 30-metre-class telescopes to try to image it. The authors call it the best such target in the northern sky. A picture, and later a spectrum, could tell us whether it has air at all.

## How they did it

The method is radial velocity. A planet and its star both orbit their shared centre of mass. So the star drifts towards us and away from us, and its light shifts slightly blue and then red. The team gathered more than 600 velocity measurements spanning over 20 years from five spectrographs: two near-infrared ones, the Habitable-zone Planet Finder and SPIRou, plus NEID, HIRES and CARMENES.

The hard part is the star itself. Spots and magnetic patches come and go as a red dwarf turns, and they fake small velocity changes. GJ 251 turns once in roughly 120 days, and several activity signals turned up between 68 and 130 days. The team compared more than 50 models. They checked whether the 54-day signal was equally strong at every wavelength, since a planet's pull shifts all colours of light alike, while starspots affect some colours more than others. The signal was clearest in the infrared, which they take as support for a planet.

## Check it yourself with fibub

You can reproduce the orbit and temperature step in a minute, then try your own made-up system.

1. Open the [[habitable-zone-calculator]] and choose **My own star** in the Star list.
2. Type the paper's star values: temperature **3342** K, luminosity **0.0155** Suns, mass **0.35** Suns.
3. Leave the distance box empty and type the period, **53.647** days, in the orbital period box. The tool turns it into a distance with Kepler's third law.
4. Set the albedo to **0.1**, the value the paper uses for its temperature, and pick **5 Earths (super-Earth)** as the planet mass.

The page puts the planet **inside the conservative habitable zone**, at 0.196 AU, receiving 0.403 times Earth's starlight, with an equilibrium temperature of 216 K. Those match the paper's 0.196 AU, 0.404 and 216 K. The zone itself runs from 0.125 to 0.253 AU for a super-Earth.

**Now a made-up system of our own.** Picture an invented red dwarf at 3300 K, 0.016 Suns and 0.35 solar masses, with a planet on a 50-day orbit and an albedo of 0.3. The calculator gives a distance of 0.187 AU and 0.457 times Earth's starlight (621 W/m²). The equilibrium temperature comes out at 209 K (−64 °C) with heat spread round the globe, or 249 K if the planet is tidally locked with no air. The conservative zone for a super-Earth spans 0.127 to 0.258 AU, so this planet is comfortably inside.

**The mass side.** For the same made-up star and a 50-day circular orbit, a wobble of 1.2 m/s gives a minimum mass of 3.43 Earth masses. Halve the wobble to 0.6 m/s and the minimum mass halves too, to 1.72 Earths. In the [[radial-velocity-fitter]], paste a column of times and velocities (invent a sine curve with some noise), choose m/s, tick **Circular orbit** and type the star mass. Then watch how the period and minimum mass shift as you add noise or thin out the points.

## The fine print

- **Not yet confirmed.** The authors call GJ 251 c a candidate. Its evidence only just passes their threshold, and stellar activity has not been fully ruled out.
- **Minimum mass only.** Radial velocity gives the mass times the sine of the orbit's tilt, so the true mass could be higher. No transit was seen, so the radius, and with it the make-up of the planet, is unknown.
- **Habitable zone is not habitable.** The zone marks where liquid water is possible for an Earth-like atmosphere. It says nothing about whether this planet has one.
- **Slightly different numbers.** The paper quotes the minimum mass as 3.84 ± 0.75 Earth masses in its abstract and slightly different values in its tables, from different data treatments. Our reproduction above uses its star values; every other example uses made-up numbers.
