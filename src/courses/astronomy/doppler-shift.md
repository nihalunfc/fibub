---
title: "The Doppler shift: measuring speed with light"
seoTitle: "Doppler shift and redshift in astronomy | Astronomy"
summary: "Light from something moving away is stretched to longer, redder wavelengths; from something approaching it is squeezed bluer. The shift of a spectral line gives the speed along our line of sight."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "A star's lines are all shifted to slightly longer wavelengths. The star is:"
    choices: ["Moving towards us", "Moving away from us", "Getting hotter"]
    ans: 1
    why: "A shift to longer wavelengths (redshift) means motion away from us."
  - q: "The Doppler shift measures which part of a star's motion?"
    choices: ["Its speed across the sky", "Its speed along our line of sight", "Its total speed"]
    ans: 1
    why: "Only motion towards or away from us stretches or squeezes the waves. Sideways motion needs other methods."
  - q: "H-alpha (656.3 nm) is seen at 656.5 nm. The speed is about:"
    choices: ["9 km/s away", "90 km/s away", "900 km/s away"]
    ans: 1
    why: "v = c Δλ/λ = 300,000 × 0.2/656.3 ≈ 91 km/s, moving away."
sources:
  - "Speed of light, exact by definition of the metre: BIPM, The International System of Units (SI brochure), 9th edition, 2019, bipm.org"
  - "Doppler shift of light and radial velocities: NASA Imagine the Universe, imagine.gsfc.nasa.gov"
---

**Module 1 · about 20 minutes · read first: [1.3 Spectral lines: fingerprints of atoms](/learn/courses/astronomy/spectral-lines/) · maths: ratios.** You'll be able to explain the Doppler effect for light, turn a line shift into a speed, and say what redshift `$z$` means.

<div class="bigidea">Motion away from us stretches light to longer, redder wavelengths and motion towards us squeezes it bluer; the size of the shift of a known line gives the speed along our line of sight.</div>

## 1. Why this matters

The Doppler shift is the speedometer of astronomy. It finds planets around other stars by their star's tiny wobble (Lesson 5.3), weighs binary stars (Lesson 3.4), maps how galaxies spin (in the [cosmology course](/learn/courses/cosmology/)) and revealed that the universe is expanding (in the [cosmology course](/learn/courses/cosmology/)). All from measuring where spectral lines sit.

## 2. Stretched and squeezed waves

You hear the Doppler effect when an ambulance passes: the siren's pitch is high as it comes towards you and drops as it moves away. The waves pile up in front of a moving source and spread out behind it. Light does the same. A source moving away has its waves stretched to longer wavelengths (**redshift**); one coming closer has them squeezed shorter (**blueshift**).

Since we know exactly where hydrogen's or sodium's lines sit in a lab (Lesson 1.3), we can measure how far they have moved in a star's light.

<!--fig:doppler-shift-->

Things to notice:

- Every line shifts by the same fraction of its wavelength, so longer-wavelength lines move further in nanometres.
- Even 100 km/s moves H-alpha by only about 0.2 nm. Stars need good spectrographs.

Watch a star moving away send out wave crests:

<div class="steps">
<div class="step"><b>Standing still.</b> The star sends out a crest every so often; the crests arrive spaced by the rest wavelength, 656.28 nm for H-alpha.</div>
<div class="step"><b>Moving away.</b> Between one crest and the next the star moves a little further off, so each crest starts from further away. The gaps grow.</div>
<div class="step"><b>Measured.</b> At 30 km/s away the line arrives at 656.35 nm: a redshift of 0.07 nm.</div>
<div class="step"><b>Turned into speed.</b> v = c × Δλ/λ₀ = 299,792 × 0.07/656.28 ≈ 30 km/s.</div>
<div class="step"><b>Coming closer.</b> Reverse the motion and the crests bunch up: the line moves to the blue by the same amount.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**For speeds much less than light** (`$v \ll c$`):

```math
\frac{\Delta\lambda}{\lambda_0} = \frac{\lambda_\text{obs} - \lambda_0}{\lambda_0} = \frac{v}{c}
```

Positive `$v$` means moving away.

**Redshift** is defined as `$z = \Delta\lambda / \lambda_0$`, so `$v \approx c z$` when `$z$` is small.

For fast sources there is an exact (relativistic) formula, `$1 + z = \sqrt{(1 + v/c)/(1 - v/c)}$`. For distant galaxies, `$z$` is mostly caused by the stretching of space itself (in the [cosmology course](/learn/courses/cosmology/)), not motion through space.

**Try it:** a star moving away at 30 km/s: `$\Delta\lambda = 656.3\times30/299{,}792 = 0.066$` nm for H-alpha.
</details>

## 3. What it means physically

Each crest of the wave leaves the star a little further away than the one before, if the star is receding, so the crests arrive spread out. The light doesn't lose its colour on the way; it was stretched at the moment it was sent. The method only feels motion along the line between us and the star. A star moving straight across the sky shows no shift at all (apart from a tiny relativistic effect).


<div class="meaning">

<dl>
<dt>λ₀</dt><dd>Rest wavelength: where the line sits in a laboratory.</dd>
<dt>Δλ = λ − λ₀</dt><dd>The shift: positive is redshift (moving away), negative is blueshift (approaching).</dd>
<dt>v = c Δλ / λ₀</dt><dd>Line-of-sight speed, valid when v is much less than c.</dd>
<dt>Physical meaning</dt><dd>It is the same effect that drops the pitch of an ambulance siren as it passes you. Only the part of the motion along our line of sight counts: a star moving sideways shows no shift at all.</dd>
</dl>

</div>

<div class="myth">

**"A redshifted star looks red."** Usually the shift is tiny (a fraction of a nanometre) and the colour does not change at all to the eye. We only see it by measuring sharp spectral lines very precisely.

</div>

## 4. Worked example

*The sodium D line, rest wavelength 589.0 nm, is measured at 588.8 nm in a star. How fast, and which way?*

```math
v = c\,\frac{\Delta\lambda}{\lambda_0} = 299{,}792\times\frac{588.8 - 589.0}{589.0} = 299{,}792\times(-3.40\times10^{-4}) = -102\ \text{km/s}
```

Negative: the star is approaching at about 100 km/s.

## 5. Practice

<div class="problem" data-problem="doppler-speed"></div>

**More practice** (answers below):

1. H-beta (486.1 nm) is seen at 486.4 nm. Find `$v$`.
2. Earth orbits the Sun at 30 km/s. How big a shift does this cause in H-alpha from a star in the direction Earth is moving?
3. A galaxy has `$z = 0.01$`. Roughly how fast is it receding?

<details>
<summary>Answers</summary>

1. `$v = 299{,}792\times0.3/486.1 = 185$` km/s, moving away.
2. `$656.3\times30/299{,}792 = 0.066$` nm (a blueshift, since we move towards the star). Astronomers correct for Earth's motion.
3. `$v \approx cz = 3000$` km/s.
</details>

<div class="keypoints">

**Key points**

- Moving away stretches light (redshift); approaching squeezes it (blueshift).
- v = c Δλ / λ₀ for speeds much less than light.
- Only the motion along the line of sight shows up.
- Doppler shifts reveal binary stars, exoplanets and the rotation of galaxies.

</div>

**Try it with real numbers:** measure velocities from line positions with the [[redshift-calculator]], and fit a star's wobble with the [[radial-velocity-fitter]].

**New words:** *Doppler effect*, *redshift*, *blueshift*, *radial velocity*, *line of sight*.
