---
title: "Beyond visible light: radio, infrared and X-ray astronomy"
seoTitle: "Radio, infrared and X-ray astronomy | Astronomy"
summary: "Each part of the spectrum shows a different universe: cold gas in radio, dust and newborn stars in infrared, million-degree gas in X-rays. Long wavelengths need huge dishes or linked telescopes to see detail."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why do radio astronomers link dishes many kilometres apart?"
    choices: ["To collect more signal only", "Detail depends on wavelength divided by size, and radio waves are very long", "To avoid radio interference"]
    ans: 1
    why: "Resolution ≈ 1.22 λ/D. With λ about a million times longer than light, D must be huge; linking dishes acts like one giant one."
  - q: "Infrared telescopes are good at seeing:"
    choices: ["Stars forming inside dusty clouds", "The hottest gas in galaxy clusters", "Gamma-ray bursts"]
    ans: 0
    why: "Infrared passes through dust that blocks visible light, and cool things glow in infrared."
  - q: "The 21 cm line comes from:"
    choices: ["Hot hydrogen in stars", "Cold hydrogen atoms whose electron flips its spin", "Carbon monoxide"]
    ans: 1
    why: "A tiny spin flip in neutral hydrogen gives a photon at 21.1 cm (1420 MHz)."
sources:
  - "Event Horizon Telescope Collaboration (2019), ApJL 875 L1: resolution figures quoted in words only"
---

**Module 1 · about 25 minutes · read first: [1.1 The electromagnetic spectrum and the atmosphere's windows](/learn/courses/astronomy/electromagnetic-spectrum/) · maths: the diffraction limit.** You'll be able to say what each part of the spectrum shows, explain why radio telescopes are huge or linked together, and work out the size needed for a chosen sharpness.

<div class="bigidea">Each band of the spectrum shows a different universe, and the sharpness a telescope can reach depends on wavelength over size, so long-wave astronomy needs huge dishes or telescopes linked across continents.</div>

## 1. Why this matters

Until the 1930s astronomy used only visible light. Then radio showed the centre of the Milky Way glowing, X-ray rockets found the sky full of violent sources, and infrared satellites saw stars being born inside black clouds. Today almost every discovery combines several kinds of light. A modern astronomer chooses a wavelength to suit the question.

## 2. A different sky in every band

- **Radio** (mm to metres): cold hydrogen gas through its 21 cm line, electrons spiralling in magnetic fields, pulsars, and the afterglow of the Big Bang. Radio passes through dust and works day or night, even under clouds.
- **Infrared**: anything cool, from planets to dust to newborn stars. Infrared slips through dust that hides visible light. Water vapour blocks much of it, so telescopes go high and dry, or to space.
- **Visible**: stars and hot gas at thousands of degrees.
- **Ultraviolet**: the hottest young stars.
- **X-rays and gamma rays**: gas at millions of degrees, matter falling into black holes, exploding stars. Only from space.

<!--fig:beyond-visible-->

Things to notice:

- At the same sharpness, a radio telescope must be about a million times bigger than an optical one.
- For the finest detail, dishes on different continents are linked; their separation (the **baseline**) acts as the size.

See why a radio telescope needs to be so big:

<div class="steps">
<div class="step"><b>The rule.</b> The finest detail a telescope can see is about θ = 1.22 λ / D radians. Longer waves blur more; a bigger telescope blurs less.</div>
<div class="step"><b>A 10 cm lens in visible light.</b> θ = 1.22 × 550 nm / 0.1 m ≈ 1.4″: enough to split many double stars.</div>
<div class="step"><b>A 100 m radio dish at 21 cm.</b> The wave is 400,000 times longer, so even this giant only reaches about 9 arcminutes, blurrier than your eye.</div>
<div class="step"><b>Link dishes across Earth.</b> Combine dishes 10,000 km apart and the baseline acts as the size: at 1.3 mm this reaches about 30 micro-arcseconds.</div>
<div class="step"><b>The payoff.</b> That is how the Event Horizon Telescope imaged the shadow of a black hole in the galaxy M87 in 2019.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Diffraction limit** ([Sky watching 4.4](/learn/courses/sky-watching/resolution/)): the finest angle a telescope of size `$D$` can resolve at wavelength `$\lambda$`, in radians:

```math
\theta \approx 1.22\,\frac{\lambda}{D} \qquad\Rightarrow\qquad D \approx 1.22\,\frac{\lambda}{\theta}
```

Convert radians to arcseconds by multiplying by 206,265.

**For an interferometer**, `$D$` is replaced by the longest baseline `$B$` between dishes.

**Try it:** a 100 m dish at 21 cm: `$\theta = 1.22\times0.21/100 = 2.6\times10^{-3}$` rad = 530″, about 9 arcminutes, a quarter the width of the full Moon.
</details>

Slide the temperature and the radius. Watch the colour, the curve's peak and the luminosity.

<figure class="fig" data-fig="@astro-star-colour"><figcaption>Hotter stars are bluer and peak at shorter wavelengths (Wien's law), and each square metre of a hot star shines far more (T⁴). A star's power also grows with its surface area (R²), so a cool giant can outshine a hot dwarf.</figcaption></figure>

## 3. What it means physically

Different temperatures and processes give out different photons (Lessons 1.1 and 1.2), so each band is tuned to different physics. Cold gas at 10 K can't make visible light, so to an optical telescope a star-forming cloud is just a dark patch; in infrared and radio it glows. Sharpness is about waves too: a telescope can only tell two points apart if its opening spans many wavelengths, and a radio wave is so long that a dish the size of a stadium is still "small".


<div class="meaning">

<dl>
<dt>θ = 1.22 λ / D</dt><dd>Diffraction limit: the smallest angle a telescope of diameter D can resolve at wavelength λ.</dd>
<dt>B (baseline)</dt><dd>For linked telescopes, the distance between them replaces D.</dd>
<dt>206,265</dt><dd>Arcseconds in one radian.</dd>
<dt>Physical meaning</dt><dd>Waves spread out a little when they pass through an opening; the narrower the opening compared with the wave, the more they spread. A telescope is an opening, so it smears every point into a tiny blob whose size is wavelength over aperture.</dd>
</dl>

</div>

<div class="myth">

**"Radio telescopes listen to sounds from space."** They collect radio light, not sound, and the data are usually turned into pictures. Any "space sounds" you hear online are radio signals converted to audio for fun.

</div>

## 4. Worked example

*How long a baseline is needed to resolve 0.001″ (1 milliarcsecond) at a radio wavelength of 3.6 cm?*

```math
\theta = \frac{0.001}{206{,}265} = 4.85\times10^{-9}\ \text{rad}
```

```math
B = 1.22\times\frac{0.036}{4.85\times10^{-9}} = 9.1\times10^{6}\ \text{m} \approx 9{,}000\ \text{km}
```

That is most of Earth's 12,700 km diameter: dishes across a continent or two, linked by very long baseline interferometry (VLBI).

## 5. Practice

<div class="problem" data-problem="diffraction-resolution"></div>

**More practice** (answers below):

1. What resolution does a 10 m optical mirror reach at 550 nm (ignoring the atmosphere)?
2. Which band would you use to study a dusty star-forming cloud, and why?
3. A 25 m dish observes at 21 cm. What is its resolution in arcminutes?

<details>
<summary>Answers</summary>

1. `$1.22\times550\times10^{-9}/10 = 6.7\times10^{-8}$` rad = 0.014″.
2. Infrared (or radio): it passes through the dust, and the cool dust and gas glow there.
3. `$1.22\times0.21/25 = 0.0102$` rad = 2,110″, about 35′.
</details>

<div class="keypoints">

- Radio shows cold gas, infrared shows dust and young stars, X-rays show million-degree gas.
- Resolution θ = 1.22 λ / D: long wavelengths need big telescopes.
- Interferometers link telescopes so the baseline acts as the diameter.
- Infrared, ultraviolet, X-ray and gamma-ray telescopes mostly work from space.

</div>

**Try it with real numbers:** design a dish with the [[radio-telescope-calculator]], see how linked dishes fill in detail with the [[uv-coverage]] tool, and reduce a 21 cm spectrum with the [[hydrogen-line-analyser]].

**New words:** *radio astronomy*, *infrared*, *X-ray astronomy*, *21 cm line*, *baseline*, *interferometer*, *VLBI*.
