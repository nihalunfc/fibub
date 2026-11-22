---
title: "Blackbody radiation: a star's colour is its temperature"
seoTitle: "Blackbody radiation and star colour | Astronomy"
summary: "Hot things glow, and the hotter they are the bluer and brighter they glow. Wien's law gives a star's temperature from its colour, and the Stefan-Boltzmann law gives its power from its size and temperature."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A star looks blue-white and another looks orange. Which is hotter?"
    choices: ["The blue-white star", "The orange star", "You can't tell from colour"]
    ans: 0
    why: "Hotter bodies peak at shorter, bluer wavelengths (Wien's law)."
  - q: "If a star's surface temperature doubles and its size stays the same, its power goes up by:"
    choices: ["2 times", "4 times", "16 times"]
    ans: 2
    why: "L ∝ T⁴, and 2⁴ = 16."
  - q: "Why are there no green stars?"
    choices: ["Green stars are too rare to see", "A blackbody peaking in green still gives out lots of red and blue, so it looks white", "Green light is absorbed by space dust"]
    ans: 1
    why: "The curve is wide. A star peaking in green, like the Sun, mixes all colours and looks white."
sources:
  - "IAU 2015 Resolution B3 (nominal solar values)"
  - "CODATA 2018 constants (NIST)"
---

**Module 1 · about 25 minutes · read first: [1.1 The electromagnetic spectrum and the atmosphere's windows](/learn/courses/astronomy/electromagnetic-spectrum/) · maths: powers and the T⁴ law.** You'll be able to read a star's temperature from its colour, work out how much power it gives off, and explain why stars are red, white or blue but never green.

<div class="bigidea">Anything hot glows with a spectrum set only by its temperature: hotter objects peak at shorter, bluer wavelengths (Wien) and give out far more power per square metre (Stefan-Boltzmann, T⁴).</div>

## 1. Why this matters

You can't put a thermometer on a star, yet astronomers quote star temperatures to within a few percent. The trick is that hot objects glow in a very predictable way. Learn that pattern and the colour of a point of light becomes a temperature reading, and its brightness plus its distance gives its size.

## 2. The glow of hot things

Heat a piece of iron and it glows dull red, then orange, then yellow-white. A **blackbody** is an ideal object that absorbs all light falling on it and gives off light only because it is hot. Stars are close to blackbodies. The shape of their glow depends on one thing: temperature.

<!--fig:planck-curves-->

Things to notice:

- Raise the temperature and the curve grows taller at every wavelength.
- The peak slides to the left (bluer) as it gets hotter.
- The Sun's peak sits in green light, but the curve is so wide that the mixture looks white.

Heat a lump of iron in a forge and watch its glow change:

<div class="steps">
<div class="step"><b>Room temperature, 300 K.</b> It glows already, but at 10 μm in the infrared, which only a thermal camera sees.</div>
<div class="step"><b>1,000 K.</b> The peak moves to 2.9 μm. The short-wave tail now reaches visible red: the iron glows dull red.</div>
<div class="step"><b>3,000 K, a lamp filament.</b> The peak is near 1 μm. Enough yellow and orange join in to look orange-white. Power per square metre is 81 times what it was at 1,000 K (3⁴).</div>
<div class="step"><b>5,800 K, the Sun's surface.</b> The peak sits near 500 nm, in the middle of what we see, so sunlight looks white.</div>
<div class="step"><b>20,000 K, a hot blue star.</b> The peak is in the ultraviolet at 145 nm. The visible part slopes up to the blue end, so the star looks blue-white.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Planck's law** gives the shape (power per area, per wavelength, per angle):

```math
B_\lambda(T) = \frac{2hc^2}{\lambda^5}\,\frac{1}{e^{hc/\lambda k_B T} - 1}
```

You won't need it by hand. Two simple laws come out of it.

**Wien's law** (peak wavelength):

```math
\lambda_\text{peak} = \frac{2.898\times10^{-3}\ \text{m K}}{T}
```

**Stefan-Boltzmann law** (total power of a star with radius `$R$`), with `$\sigma = 5.67\times10^{-8}$` W m⁻² K⁻⁴:

```math
L = 4\pi R^2 \sigma T^4
```

**Try it:** the Sun, `$T = 5772$` K: `$\lambda_\text{peak} = 2.898\times10^{-3}/5772 = 502$` nm, green.
</details>

Slide the temperature and the radius. Watch the colour, the curve's peak and the luminosity.

<figure class="fig" data-fig="@astro-star-colour"><figcaption>Hotter stars are bluer and peak at shorter wavelengths (Wien's law), and each square metre of a hot star shines far more (T⁴). A star's power also grows with its surface area (R²), so a cool giant can outshine a hot dwarf.</figcaption></figure>

## 3. What it means physically

Temperature is how fast the particles in a gas are jiggling. Faster particles bump harder and give out more energetic photons, so the light shifts to shorter wavelengths. More energetic collisions also happen more often, which is why the total power climbs so steeply, as the fourth power of temperature. A star twice as hot with the same surface area pours out sixteen times the energy.


<div class="meaning">

<dl>
<dt>λ<sub>peak</sub> = b / T</dt><dd>Wien's law: the wavelength where the glow is brightest, with b = 2.898 × 10⁻³ m K.</dd>
<dt>σT⁴</dt><dd>Power given out per square metre of surface (σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴).</dd>
<dt>L = 4πR²σT⁴</dt><dd>A star's total power: its area times the power per square metre.</dd>
<dt>Physical meaning</dt><dd>Temperature is how fast atoms jiggle. Faster jiggling shakes out more photons and more energetic ones, so the whole curve grows and slides to the blue. A star's colour is therefore a thermometer you can read from trillions of kilometres away.</dd>
</dl>

</div>

<div class="myth">

**"Red stars are hot and blue stars are cool, like taps."** It is the other way round in physics. Taps use red for hot by tradition, but a red star is the coolest kind (about 3,000 K) and a blue star the hottest (20,000 K or more).

</div>

## 4. Worked example

*Betelgeuse is a red supergiant at about 3,600 K that shines with roughly 100,000 times the Sun's power. How big is it?*

Rearrange Stefan-Boltzmann for the radius, comparing with the Sun so the constants cancel:

```math
\frac{R}{R_\odot} = \sqrt{\frac{L}{L_\odot}}\left(\frac{T_\odot}{T}\right)^2 = \sqrt{100{,}000}\times\left(\frac{5772}{3600}\right)^2 = 316\times2.57 = 813
```

About 800 times the Sun's radius, wider than the orbit of Mars. Its peak wavelength is `$2.898\times10^{-3}/3600 = 805$` nm, in the infrared, which is why it looks orange-red.

## 5. Practice

<div class="problem" data-problem="wien-temperature"></div>

**More practice** (answers below):

1. Sirius is about 9,900 K. Where does its light peak?
2. Your body is about 310 K. Where does it glow brightest, and can you see it?
3. A star has the Sun's temperature but 10 times its radius. How much more power does it give off?

<details>
<summary>Answers</summary>

1. `$2.898\times10^{-3}/9900 = 293$` nm, in the ultraviolet. Sirius looks blue-white.
2. `$2.898\times10^{-3}/310 = 9.3\ \mu$`m, far infrared. Thermal cameras see it; eyes can't.
3. `$L \propto R^2$`, so `$10^2 = 100$` times.
</details>

<div class="keypoints">

- A blackbody's spectrum depends only on its temperature.
- Wien: λ<sub>peak</sub> T = 2.898 × 10⁻³ m K, so colour gives temperature.
- Stefan-Boltzmann: power per area ∝ T⁴; luminosity L = 4πR²σT⁴.
- Knowing L and T gives a star's radius without seeing its disc.

</div>

**Try it with real numbers:** plot any temperature's curve with the [[blackbody-calculator]].

**New words:** *blackbody*, *Planck's law*, *Wien's law*, *Stefan-Boltzmann law*, *luminosity*.
