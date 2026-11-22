---
title: "The most perfect blackbody: COBE"
seoTitle: "Why is the CMB a perfect blackbody? COBE explained"
summary: "In 1990 the COBE satellite showed that the cosmic microwave background is a blackbody at 2.7255 K, matching theory to better than 50 parts per million. Why that perfect curve proves a hot, dense past, and why expansion keeps it perfect."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "Why does a perfect blackbody spectrum point to a hot, dense past?"
    choices: ["Because all light is blackbody light","Only matter and light that have traded energy back and forth for a long time, in a dense fog, settle into a blackbody","Because the CMB comes from stars"]
    ans: 1
    why: "A blackbody is the signature of thermal equilibrium. Today's thin, transparent universe cannot make one; a dense, opaque early universe made it naturally."
  - q: "What happens to a blackbody spectrum when the universe expands by a factor of 2?"
    choices: ["It becomes a distorted, non-blackbody curve","It stays a blackbody, at half the temperature","It stays a blackbody at the same temperature but fainter"]
    ans: 1
    why: "Every photon's frequency halves and their number per volume drops by 8, which is exactly a blackbody at half the temperature."
  - q: "The CMB's brightness per unit frequency peaks at 160.2 GHz. Why is its Wien peak wavelength 1.06 mm and not c ÷ 160.2 GHz = 1.87 mm?"
    choices: ["Because the CMB is not quite a blackbody","Because peaks per unit wavelength and per unit frequency fall in different places: both are correct","Because of the Doppler effect"]
    ans: 1
    why: "Spreading the same light over equal steps of wavelength or of frequency gives curves of different shape, with peaks at different places. Neither is wrong; just say which one you mean."
sources:
  - "J. C. Mather et al. (1990), A preliminary measurement of the cosmic microwave background spectrum by the Cosmic Background Explorer (COBE) satellite, ApJ 354, L37 https://doi.org/10.1086/185717"
  - "D. J. Fixsen et al. (1996), The cosmic microwave background spectrum from the full COBE FIRAS data set, ApJ 473, 576 https://doi.org/10.1086/178173"
  - "D. J. Fixsen (2009), The temperature of the cosmic microwave background, ApJ 707, 916 https://doi.org/10.1088/0004-637X/707/2/916"
  - "J. C. Mather (2007), Nobel lecture: From the Big Bang to the Nobel Prize and beyond, Reviews of Modern Physics 79, 1331 https://doi.org/10.1103/RevModPhys.79.1331"
  - "NASA Goddard, COBE: the Cosmic Background Explorer https://lambda.gsfc.nasa.gov/product/cobe/"
---

**Module 7 · about 15 minutes.** Read first: [7.1 Penzias and Wilson hear the Big Bang](/learn/courses/cosmology/cmb-discovery/), and the astronomy course's [Blackbody radiation](/learn/courses/astronomy/blackbody-radiation/) for what a blackbody curve is. Here we ask what the CMB's spectrum tells us about the universe. By the end you will be able to say why its perfect blackbody shape is evidence for a hot, dense past, and work out what it looked like at any redshift.

<div class="bigidea">The CMB is the most perfect blackbody ever measured. Only a universe that was once a hot, dense, opaque fog could have made it, and expansion has kept it perfect ever since.</div>

## 1. The curve that got a standing ovation

Penzias and Wilson measured the glow at one wavelength. To be sure it was the afterglow of a hot universe, you need the whole spectrum: the brightness at every frequency. A hot, dense fog in equilibrium should give one particular shape, the **blackbody** (Planck) curve, which depends on nothing but the temperature. Earth's air glows and absorbs at exactly the wavelengths near the peak, so the measurement had to go to space.

NASA's **COBE** (Cosmic Background Explorer) was launched on 18 November 1989. Its FIRAS instrument, led by John Mather, compared the sky with a built-in blackbody of known temperature. In January 1990, after only nine minutes of sky data, Mather showed the spectrum at a meeting of the American Astronomical Society: the points lay exactly on a blackbody curve. The audience gave it a standing ovation.

<figure class="fig" data-fig="cmb-blackbody"><figcaption>The CMB spectrum. The blue curve is a blackbody at 2.7255 K; the black dots are where COBE FIRAS measured it (their error bars are far smaller than the dots); the green dot is Penzias and Wilson's wavelength. Slide back in redshift: the orange curve is the same light at that time, hotter and denser, but still a perfect blackbody. The yellow band is visible light.</figcaption></figure>

The final FIRAS result: the CMB matches a blackbody to better than 50 parts per million of its peak brightness. Its temperature today, combining FIRAS with other measurements, is

```math
T_0 = 2.7255 \pm 0.0006\ \text{K}
```

From that one number follow the rest: it is brightest per unit frequency at **160.2 GHz**, its Wien peak wavelength is **1.06 mm**, and there are about **411 CMB photons in every cubic centimetre** of space, more than a billion for every atom.

Slide the temperature and the radius. Watch the colour, the curve's peak and the luminosity.

<figure class="fig" data-fig="@astro-star-colour"><figcaption>Hotter stars are bluer and peak at shorter wavelengths (Wien's law), and each square metre of a hot star shines far more (T⁴). A star's power also grows with its surface area (R²), so a cool giant can outshine a hot dwarf.</figcaption></figure>

## 2. Why a perfect blackbody means a hot, dense past

A blackbody is what you get when light and matter have exchanged energy back and forth so many times that they share one temperature: thermal equilibrium. Think of a pot of soup simmered for hours. Every spoonful is the same temperature; you could not tell where any bit of heat came from.

Today's universe could never do that. It is almost empty and transparent: CMB photons have crossed it for 13.8 billion years without hitting anything. Any mix of sources, such as stars, galaxies and warm dust at different temperatures, would add up to a lumpy, non-blackbody spectrum. To get a perfect one you need the whole universe to have been dense and opaque, a fog where light could not travel far before being absorbed or scattered. Before the first few months, processes that make and destroy photons wiped out any distortion. Later, until recombination, scattering off electrons kept sharing energy around. FIRAS found no trace of distortion at all, which also rules out any big injection of energy since those early months.

## 3. Why expansion keeps it a blackbody

The CMB has not been in contact with matter for 13.8 billion years, yet it is still a blackbody. This is a small miracle of geometry. As space stretches by a factor 1 + z, two things happen:

```math
\nu_{\text{now}} = \frac{\nu_{\text{then}}}{1+z}, \qquad n_{\text{now}} = \frac{n_{\text{then}}}{(1+z)^3}
```

<div class="meaning">

<dl>
<dt>ν</dt><dd>the frequency of any one photon: stretched by the expansion, so it falls by 1 + z</dd>
<dt>n</dt><dd>the number of photons per cubic centimetre: the same photons spread through (1 + z)³ more volume</dd>
<dt>Physical meaning</dt><dd>A blackbody's photons are spread over frequency in a shape set by hν/kT. Lower every frequency and every temperature by the same factor and hν/kT is unchanged; thin the photons by the cube of that factor and the count at every frequency is exactly what a blackbody at T/(1 + z) needs. So a stretched blackbody is still a blackbody: T = T<sub>0</sub>(1 + z) holds for its whole spectrum, not just a single wavelength.</dd>
</dl>

</div>

So the light that set off at about 3,000 K, from a fog as hot as the surface of a cool red star, arrives today as a 2.7 K microwave glow with exactly the same shape. Slide the figure to z = 1,089 to see it.

<div class="problem" data-problem="cmb-blackbody-peak"></div>

<div class="problem" data-problem="cmb-blackbody-photons"></div>

<div class="history">

**A rocket, then a satellite.** In 1988 a rocket-borne experiment reported extra brightness at short wavelengths, beyond the blackbody curve, and theorists rushed to explain it. Two years later FIRAS showed that it was not there. COBE's other instrument, DMR, found the tiny ripples in the CMB in 1992 ([Lesson 7.4](/learn/courses/cosmology/cmb-anisotropies/)).

<ul class="timeline">
<li><b>1974</b> NASA invites proposals; Mather's team proposes the mission that becomes COBE</li>
<li><b>1989</b> COBE launched on 18 November</li>
<li><b>1990</b> FIRAS spectrum shown in January: a perfect blackbody, T = 2.735 ± 0.06 K</li>
<li><b>1996</b> Full FIRAS data: deviations below 50 parts per million</li>
<li><b>2006</b> John Mather (FIRAS) and George Smoot (DMR) share the Nobel Prize in Physics</li>
<li><b>2009</b> Fixsen combines measurements: T<sub>0</sub> = 2.7255 K</li>
</ul>

</div>

<div class="myth">

**"The CMB peaks at 1.06 mm, so it peaks at c ÷ 1.06 mm = 283 GHz."** Wien's wavelength peak (1.06 mm) and the frequency peak (160.2 GHz, which is c ÷ 1.87 mm) are both right: plotting the same light per unit wavelength or per unit frequency gives curves that peak in different places. What is the same in both is the temperature, 2.7255 K.

</div>

<div class="keypoints">

- COBE FIRAS (1990, final 1996) showed the CMB is a blackbody to better than 50 parts per million: T<sub>0</sub> = 2.7255 K, frequency peak 160.2 GHz, Wien peak 1.06 mm, about 411 photons per cm³.
- A perfect blackbody needs thermal equilibrium, which only a hot, dense, opaque early universe could provide.
- Expansion lowers every photon's frequency by 1 + z and the photon density by (1 + z)³: the result is exactly a cooler blackbody, T = T<sub>0</sub>(1 + z).
- Nobel Prize 2006 to John Mather and George Smoot.

</div>
