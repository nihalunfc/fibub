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

**Module 1 · about 25 minutes · powers and the T⁴ law.** You'll be able to read a star's temperature from its colour, work out how much power it gives off, and explain why stars are red, white or blue but never green.

## 1. Why this matters

You can't put a thermometer on a star, yet astronomers quote star temperatures to within a few percent. The trick is that hot objects glow in a very predictable way. Learn that pattern and the colour of a point of light becomes a temperature reading, and its brightness plus its distance gives its size.

## 2. The glow of hot things

Heat a piece of iron and it glows dull red, then orange, then yellow-white. A **blackbody** is an ideal object that absorbs all light falling on it and gives off light only because it is hot. Stars are close to blackbodies. The shape of their glow depends on one thing: temperature.

<!--fig:planck-curves-->

Things to notice:

- Raise the temperature and the curve grows taller at every wavelength.
- The peak slides to the left (bluer) as it gets hotter.
- The Sun's peak sits in green light, but the curve is so wide that the mixture looks white.

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

## 3. What it means physically

Temperature is how fast the particles in a gas are jiggling. Faster particles bump harder and give out more energetic photons, so the light shifts to shorter wavelengths. More energetic collisions also happen more often, which is why the total power climbs so steeply, as the fourth power of temperature. A star twice as hot with the same surface area pours out sixteen times the energy.

## 4. Worked example

*Betelgeuse is a red supergiant at about 3,600 K that shines with roughly 100,000 times the Sun's power. How big is it?*

Rearrange Stefan-Boltzmann for the radius, comparing with the Sun so the constants cancel:

```math
\frac{R}{R_\odot} = \sqrt{\frac{L}{L_\odot}}\left(\frac{T_\odot}{T}\right)^2 = \sqrt{100{,}000}\times\left(\frac{5772}{3600}\right)^2 = 316\times2.57 = 813
```

About 800 times the Sun's radius, wider than the orbit of Mars. Its peak wavelength is `$2.898\times10^{-3}/3600 = 805$` nm, in the infrared, which is why it looks orange-red.

## 5. Practice

1. Sirius is about 9,900 K. Where does its light peak?
2. Your body is about 310 K. Where does it glow brightest, and can you see it?
3. A star has the Sun's temperature but 10 times its radius. How much more power does it give off?

<details>
<summary>Answers</summary>

1. `$2.898\times10^{-3}/9900 = 293$` nm, in the ultraviolet. Sirius looks blue-white.
2. `$2.898\times10^{-3}/310 = 9.3\ \mu$`m, far infrared. Thermal cameras see it; eyes can't.
3. `$L \propto R^2$`, so `$10^2 = 100$` times.
</details>

**Try it with real numbers:** plot any temperature's curve with the [[blackbody-calculator]].

**New words:** *blackbody*, *Planck's law*, *Wien's law*, *Stefan-Boltzmann law*, *luminosity*.
