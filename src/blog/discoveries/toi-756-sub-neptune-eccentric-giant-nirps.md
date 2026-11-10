---
title: "TOI-756: a sub-Neptune and an eccentric giant around an M dwarf, from NIRPS and TESS"
summary: "A 2025 A&A paper finds a dense sub-Neptune on a 1.24-day orbit and a cold, eccentric giant of at least 4 Jupiter masses around a red dwarf. Here is how to rework the masses with fibub."
tools: [radial-velocity-fitter, exoplanet-mass-calculator, transit-light-curve-fitter]
updated: 2026-11-10
sources:
  - "Parc L, Bouchy F, Cook NJ et al. (2025), NIRPS and TESS reveal a peculiar system around the M dwarf TOI-756: A transiting sub-Neptune and a cold eccentric giant, Astronomy & Astrophysics 702, A138. Open access under CC BY 4.0, as shown on the publisher's page, checked 2026-11-10."
  - "Minimum mass from the radial velocity mass function: standard Keplerian orbit relations, as used in any exoplanet textbook."
paper:
  title: "NIRPS and TESS reveal a peculiar system around the M dwarf TOI-756: A transiting sub-Neptune and a cold eccentric giant"
  authors: "Parc L, Bouchy F, Cook NJ, Grieves N, Artigau É, L'Heureux A et al."
  journal: "Astronomy & Astrophysics"
  year: 2025
  doi: "10.1051/0004-6361/202555684"
  url: "https://www.aanda.org/articles/aa/full_html/2025/10/aa55684-25/aa55684-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Red dwarfs are the most common stars in the galaxy, and small planets around them are common too. Giant planets around them are not. An October 2025 paper in *Astronomy & Astrophysics* describes a red dwarf, TOI-756, that has both: a small, close-in planet that crosses the star's face every 1.24 days, and a massive giant on a stretched 150-day orbit that never transits at all. The giant was found only because the star wobbles. You can rework the orbit and the masses yourself with the [[radial-velocity-fitter]], turn the wobble into a planet mass with the [[exoplanet-mass-calculator]], and size up a transit with the [[transit-light-curve-fitter]].

## What they found

TOI-756 is an M1 dwarf with about half the Sun's mass and half its radius (0.505 and 0.501 solar values in the paper), at a temperature near 3,660 K. Its inner planet, TOI-756 b, has a radius of about 2.81 Earth radii and a mass of about 9.8 Earth masses, which the authors turn into a density of about 2.4 g/cm³. That puts it among the sub-Neptunes: bigger than Earth, smaller than Neptune, probably rock wrapped in a thin envelope of hydrogen and helium.

The outer planet, TOI-756 c, takes about 149.6 days to go round and has an eccentricity of 0.45, so its distance from the star changes a lot during each orbit. Its minimum mass is about 4 Jupiter masses. On top of both planets, the star's velocity drifts by about 146 m/s per year, a hint of a third, more distant body that might be a planet or a brown dwarf.

## Why it matters

Planet formation models struggle to build giants around small stars, because the discs that surround young red dwarfs hold little material. A giant at a fraction of an astronomical unit, on an eccentric orbit, next to an inner sub-Neptune, is a useful test case. The eccentricity suggests something stirred the system after it formed, perhaps the unseen third body. The system also shows what NIRPS can do: it is a near-infrared spectrograph, and red dwarfs are much brighter in the infrared than in visible light.

## How they did it

TESS, the NASA survey satellite, caught the transits of the inner planet in four sectors. Ground telescopes then watched more transits in other colours to make sure the dip did not come from a neighbouring star; this mattered, because a co-moving companion star sits close enough to fall inside the TESS aperture. High-resolution imaging found no other close companions.

For the masses, the team measured the star's line-of-sight velocity with two spectrographs on the ESO 3.6 m telescope at La Silla: NIRPS on 64 nights, and HARPS, which recorded 57 spectra (three were dropped because of a shutter fault). They fitted the transits and both planets' velocity signals together, and modelled the inner planet's interior under the assumption of a pure hydrogen and helium envelope.

## Check it yourself with fibub

The numbers below are our own, invented to look like this kind of system. They are not the paper's measurements.

**Step 1: fit the giant's orbit.** Open the [[radial-velocity-fitter]], pick **m/s (exoplanets)** as the unit and type **0.5** as the star mass. Paste these made-up velocities (day, velocity in m/s, error in m/s):

```
3 250.4 4
17 246 4
29 -32.1 4
41 -152.5 4
58 -162.6 4
66 -147.3 4
79 -109.1 4
93 -70.6 4
108 -8.9 4
121 50 4
135 121.4 4
149 216.3 4
162 291.2 4
176 35.6 4
190 -156.2 4
204 -170 4
219 -141.4 4
233 -98.5 4
247 -59.7 4
262 -1.7 4
276 68.3 4
291 162.3 4
305 271.9 4
320 186.9 4
```

Leave the period box empty so the tool searches. It should settle on a period of about **149.97 ± 0.11 days**, K = **230.1 ± 1.3 m/s**, eccentricity **0.449 ± 0.005** and ω about 58°. The scatter is about 3.2 m/s and the reduced χ² about 0.85, which says the 4 m/s errors we typed are a fair size. With the star mass filled in, the companion's minimum mass comes out at about **3.40 Jupiter masses**, on an orbit with a semi-major axis of about 0.44 AU. We built the data with P = 150 days, K = 230 m/s and e = 0.45, so the fit recovers what we put in.

Try ticking **Circular orbit**: the scatter jumps to about 64 m/s, which is how you can tell the eccentricity is real.

**Step 2: weigh the small planet.** In the [[exoplanet-mass-calculator]], choose **Mass from the wobble** and type a star mass of 0.5, a period of 1.3 days, eccentricity 0 and K = 8 m/s (again our numbers). The minimum mass is about **8.6 Earth masses**. Now add a transit depth of **0.26 %** and a star radius of **0.5**. The radius comes out near **2.78 Earth radii**, the density about **2.2 g/cm³** and the gravity about 10.9 m/s². That density sits between Neptune's and Earth's, the zone where sub-Neptunes live.

**Step 3: measure the depth.** If you have a transit light curve, the [[transit-light-curve-fitter]] gives the radius ratio and depth with limb darkening included; pick the near-infrared or TESS preset for a red dwarf, and type the star's radius to get the planet's size.

## The fine print

- **Minimum mass only for the giant.** It does not transit, so its tilt is unknown and the true mass could be larger.
- **Envelope assumption.** The interior estimate assumes a pure hydrogen and helium envelope; a water-rich planet would give a different answer.
- **Blended light.** The companion star inside the TESS aperture had to be corrected for, which adds risk to the radius.
- **Star properties.** Temperatures from different infrared bands disagreed, and the age is poorly known, as is usual for red dwarfs.
- **The third body.** The long-term drift is not yet explained; more years of velocities will tell.
- Our velocities and transit numbers are invented. For the measured values, read the paper.
