---
title: "1998: the expansion is speeding up"
seoTitle: "How supernovae showed the universe is accelerating"
summary: "In 1998 two rival teams found distant exploding stars fainter than expected: the expansion is speeding up. How they caught them and ruled out the doubts."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "What did the 1998 teams actually measure that pointed to acceleration?"
    choices: ["Distant galaxies were moving faster than light","The cosmic microwave background was cooler than expected","Distant Type Ia supernovae looked fainter than a slowing universe predicts, so they are farther away"]
    ans: 2
    why: "About 0.25 magnitudes fainter than a low-density slowing universe allows, which means about 12% farther. Light from them travelled farther because the expansion has sped up."
  - q: "How did the teams find supernovae in distant galaxies on a schedule?"
    choices: ["They waited for alerts from amateur astronomers","They pictured the same thousands of galaxies twice, about three weeks apart, and subtracted the pictures","They used gravitational wave detectors"]
    ans: 1
    why: "A new point of light shows up in the difference picture. Follow-up time on big telescopes was booked in advance, so the supernovae could be measured near their peak."
  - q: "Why could dust not explain the faint supernovae?"
    choices: ["There is no dust in other galaxies","Dust reddens light, which was not seen, and supernovae beyond redshift 1 turned out brighter again, as a slowing-then-speeding universe predicts","Dust makes things brighter"]
    ans: 1
    why: "Ordinary dust dims blue light more than red. And dust would keep dimming more with distance, while the most distant supernovae came back up: the sign of an earlier slowing era."
sources:
  - "A. G. Riess et al. (1998), Observational evidence from supernovae for an accelerating universe and a cosmological constant, AJ 116, 1009 https://doi.org/10.1086/300499"
  - "S. Perlmutter et al. (1999), Measurements of Ω and Λ from 42 high-redshift supernovae, ApJ 517, 565 https://doi.org/10.1086/307221"
  - "A. Sandage (1970), Cosmology: a search for two numbers, Physics Today 23(2), 34 https://doi.org/10.1063/1.3021960"
  - "A. G. Riess et al. (2004), Type Ia supernova discoveries at z > 1 from the Hubble Space Telescope: evidence for past deceleration and constraints on dark energy evolution, ApJ 607, 665 https://doi.org/10.1086/383612"
  - "The Nobel Prize in Physics 2011, NobelPrize.org https://www.nobelprize.org/prizes/physics/2011/summary/"
---

**Module 9 · about 16 minutes.** Read first: [2.4 Type Ia supernovae](/learn/courses/cosmology/type-ia-supernovae/) and [5.6 The acceleration equation](/learn/courses/cosmology/acceleration-equation/). Lesson 5.6 gave the headline: the expansion is speeding up. This lesson opens up the experiment itself: how you catch an exploding star billions of light-years away on a schedule, what "fainter" means in numbers, and how the teams ruled out the boring explanations. By the end you will be able to read the famous supernova plot and say why it convinced almost everyone within a year.

<div class="bigidea">If the expansion had been slowing, distant supernovae would look a little brighter than in a steady universe. They looked dimmer. Their light had travelled farther than any slowing universe allows, so the expansion must have sped up while the light was on its way.</div>

## 1. A search for two numbers

In 1970 the astronomer Allan Sandage described cosmology as "a search for two numbers": the expansion rate today, H<sub>0</sub>, and how fast the expansion is slowing down, the deceleration parameter q<sub>0</sub> (Lesson 5.6). Everybody expected q<sub>0</sub> to be positive, since gravity can only pull. The only question was how big it was, and so whether the universe would expand for ever or fall back.

To measure slowing, you compare the expansion rate long ago with the rate today. That means a Hubble diagram reaching billions of light-years: a distance and a redshift for objects so far away that their light left when the universe was noticeably smaller. Cepheids give out long before that. Type Ia supernovae, which briefly outshine a whole galaxy and can be corrected to a standard brightness ([Lesson 2.4](/learn/courses/cosmology/type-ia-supernovae/)), can reach it.

## 2. Catching supernovae on demand

The problem: a galaxy hosts a Type Ia supernova only about once a century, and each lasts a few weeks. You cannot book telescope time for an explosion that has not happened yet. In the early 1990s Saul Perlmutter's team worked out the trick, now called a **batch search**.

<div class="steps" data-fig="accelerating-universe-2">
<div class="step">Just after new moon, when the sky is darkest, photograph dozens of patches of sky, each holding hundreds of faint, distant galaxies. Thousands of galaxies in all.</div>
<div class="step">About three weeks later, just before the next new moon, photograph the same patches again. A handful of galaxies now have a new point of light: a supernova still on its way up to its peak.</div>
<div class="step">Subtract the first picture from the second. Everything that did not change cancels out and the new supernovae stand alone. Because there are thousands of galaxies, you are almost certain to find several.</div>
<div class="step">Big telescopes, booked weeks earlier, take a spectrum to prove it is a Type Ia and measure the redshift; the Hubble Space Telescope and others follow its light curve. The peak, corrected by how fast it fades, gives the distance.</div>
</div>

Both teams used this method: the Supernova Cosmology Project (led by Perlmutter) and the High-z Supernova Search Team (led by Brian Schmidt, with Adam Riess as lead author of its 1998 paper). Riess's paper used 16 distant supernovae and Perlmutter's 42, at redshifts up to about 0.8 to 1, each compared with dozens of nearby ones.

## 3. The plot that changed cosmology

Astronomers measure brightness in **magnitudes**: bigger numbers are fainter, and every 5 magnitudes is a factor of 100 in brightness ([the Astronomy course explains](/learn/courses/astronomy/flux-luminosity/)). The distance of a standard candle is coded in its **distance modulus**:

```math
\mu = m - M = 5\log_{10}\!\left(\frac{d_L}{10\ \text{pc}}\right)
```

<div class="meaning">

<dl>
<dt>m</dt><dd>apparent magnitude: how bright the supernova looks to us</dd>
<dt>M</dt><dd>absolute magnitude: how bright it really is (about −19.3 at peak, after correction)</dd>
<dt>d<sub>L</sub></dt><dd>the luminosity distance (<a href="/learn/courses/cosmology/cosmological-distances/">Lesson 5.8</a>), which depends on the whole expansion history between the supernova and us</dd>
<dt>Physical meaning</dt><dd>A difference of Δm in magnitude is a brightness ratio of 10<sup>0.4Δm</sup> and a distance ratio of 10<sup>0.2Δm</sup>. So 0.25 magnitudes fainter means about 21% less light, and about 12% farther away.</dd>
</dl>

</div>

The trick for seeing small differences is to plot each supernova's distance modulus **minus** what an empty, coasting universe would give. Then a steady expansion is a flat line at zero, a slowing universe dips below it (brighter supernovae: a slowing universe was expanding faster in the past, so it reached the same stretch, the same redshift, in less time, and the light had a shorter trip), and a speeding-up universe rises above it.

<figure class="fig" data-fig="accelerating-universe"><figcaption>Supernova brightness compared with an empty, coasting universe. Up means fainter. The dots are made-up supernovae scattered like a real sample around today's best model. Slide matter and dark energy to fit them: only models with dark energy pass through the distant points.</figcaption></figure>

The distant supernovae sat **above** the line: about 0.25 magnitudes fainter than a slowing, low-density universe with no dark energy (Ω<sub>m</sub> ≈ 0.3), and fainter still than the matter-only Einstein-de Sitter universe. Riess's team found that a positive cosmological constant was needed at more than 99% confidence. For a flat universe, Perlmutter's team found Ω<sub>m</sub> ≈ 0.28, leaving about 72% for dark energy.

<div class="problem" data-problem="accelerating-universe-fainter"></div>

## 4. Ruling out the boring answers

A result this strange needed every simple explanation checked:

- **Dust.** Dust in the host galaxy dims light, but it also reddens it, since it scatters blue more than red. The teams measured the supernovae's colours and found no extra reddening. "Grey" dust that dims all colours equally was proposed, but it would make supernovae keep getting fainter the farther you look.
- **Evolution.** Maybe supernovae long ago were simply dimmer. But their spectra and light curves at high redshift matched nearby ones.
- **The decisive test.** In a universe that slowed down first and only later sped up, the most distant supernovae, from the slowing era, should turn back down towards "brighter". In 2004 Riess's team used the Hubble Space Telescope to find supernovae beyond redshift 1, and they were brighter than dust or evolution would allow: the turnover was there.

The switch from slowing to speeding up is set by the acceleration equation: matter's pull is ρ<sub>m</sub>/2 and a cosmological constant's push is ρ<sub>Λ</sub>, so the switch comes when matter has thinned to twice the density of dark energy.

<div class="problem" data-problem="accelerating-universe-start"></div>

For our universe that is redshift about 0.65, around **6 billion years ago**. Since then, independent evidence has piled up: the cosmic microwave background ([Lesson 7.8](/learn/courses/cosmology/universe-recipe/)), the baryon acoustic "ruler" in galaxy maps ([Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/)) and the growth of galaxy clusters all need dark energy, even with no supernovae at all.

<div class="history">

**From "two numbers" to a Nobel Prize.**

<ul class="timeline">
<li><b>1970</b> Allan Sandage calls cosmology a search for H<sub>0</sub> and q<sub>0</sub>.</li>
<li><b>1988</b> Saul Perlmutter's Supernova Cosmology Project starts at Lawrence Berkeley National Laboratory.</li>
<li><b>1994</b> Brian Schmidt and Nicholas Suntzeff form the rival High-z Supernova Search Team.</li>
<li><b>January 1998</b> Both teams show early results at the American Astronomical Society meeting; Riess et al. is submitted in March. Science magazine names it the Breakthrough of the Year.</li>
<li><b>2004</b> Supernovae beyond z = 1 show the earlier slowing era.</li>
<li><b>2011</b> Perlmutter, Schmidt and Riess share the Nobel Prize in Physics.</li>
</ul>

</div>

<div class="myth">

**"The supernovae were fainter, so maybe they are just a bit dimmer than we thought."** That was the first worry, and the teams tested it hard. The key is the shape of the curve, not a single offset: a change in the supernovae themselves, or in dust, would not make the most distant ones come back up again. Today the same conclusion comes from methods that use no supernovae at all.

</div>

<div class="keypoints">

- Two teams in 1998 measured distances to dozens of distant Type Ia supernovae, found with a "batch search": picture thousands of galaxies twice, three weeks apart, and subtract.
- Distant supernovae were about 0.25 magnitudes (about 21% in light, 12% in distance) fainter than a slowing, low-density universe allows.
- A Hubble diagram relative to an empty universe shows it plainly: the data rise above zero, as only a universe with dark energy does.
- Dust and supernova evolution were ruled out; supernovae beyond z = 1 show the earlier slowing era.
- Speeding up began when matter had thinned to twice dark energy's density, at z ≈ 0.65, about 6 billion years ago. Nobel Prize 2011.

</div>
