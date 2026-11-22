---
title: "The electromagnetic spectrum: light we can and can't see"
seoTitle: "The electromagnetic spectrum in astronomy | Astronomy"
summary: "Visible light is a thin slice of a huge family of waves, from radio to gamma rays. Wavelength, frequency and photon energy are linked by two short formulas, and our air lets only two windows through to the ground."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Which travels fastest through empty space?"
    choices: ["Radio waves", "Gamma rays", "They all travel at the same speed"]
    ans: 2
    why: "All electromagnetic waves travel at c, about 300,000 km/s, in a vacuum. Only wavelength and energy differ."
  - q: "A photon of blue light (450 nm) compared with red light (650 nm) carries:"
    choices: ["More energy", "Less energy", "The same energy"]
    ans: 0
    why: "E = hc/λ, so a shorter wavelength means more energy per photon."
  - q: "Why are X-ray telescopes put in space?"
    choices: ["X-rays are too faint on the ground", "Our atmosphere absorbs X-rays", "X-ray telescopes are too heavy for mountains"]
    ans: 1
    why: "The air blocks X-rays completely. Only visible light and radio get through well."
sources:
  - "CODATA 2018 values of c and h (NIST)"
---

**Module 1 · about 20 minutes · powers of ten.** You'll be able to place any kind of light on the spectrum, convert between wavelength, frequency and photon energy, and say which kinds reach the ground.

## 1. Why this matters

Almost everything we know about the universe arrives as light. Stars, gas clouds and galaxies send out radio waves, infrared, visible light, ultraviolet, X-rays and gamma rays, and each kind tells a different story: cold dust glows in infrared, hot gas in X-rays, hydrogen clouds in radio. To read those stories you need to know what the different kinds are and where they can be caught.

## 2. One family of waves

Light is a ripple of electric and magnetic fields. The distance from one crest to the next is the **wavelength** `$\lambda$`. How many crests pass each second is the **frequency** `$f$`. All of them move at the same speed `$c$` in empty space.

Light also comes in tiny packets called **photons**. A short wavelength means each photon carries more energy. That is why ultraviolet can burn your skin and radio waves can't.

<!--fig:spectrum-windows-->

Things to notice:

- Visible light, from about 400 nm (violet) to 700 nm (red), is a tiny slice.
- The air is clear in two windows: visible light and radio. Most infrared, and all ultraviolet, X-rays and gamma rays, are blocked.

<details class="maths" open>
<summary>Maths and principle</summary>

**Speed, wavelength and frequency:**

```math
c = \lambda f, \qquad c = 2.998\times10^{8}\ \text{m/s}
```

**Photon energy** (Planck's relation), with `$h = 6.626\times10^{-34}$` J s:

```math
E = h f = \frac{h c}{\lambda}
```

A handy shortcut: `$E\ (\text{eV}) \approx 1240 / \lambda\ (\text{nm})$`. One electronvolt (eV) is `$1.602\times10^{-19}$` J.

**Try it:** green light at 500 nm has `$f = 3\times10^8/500\times10^{-9} = 6\times10^{14}$` Hz and `$E \approx 1240/500 = 2.5$` eV.
</details>

## 3. What it means physically

The energy of one photon decides what it can do to matter. A visible photon (about 2 eV) can nudge an electron in an atom to a higher level, which is how your eye and a camera sensor detect it. An X-ray photon (thousands of eV) can knock electrons clean out of atoms, so X-rays come from violent places: gas at millions of degrees, matter falling onto black holes. A radio photon is a millionth of an eV, far too weak to change an atom much; radio comes from slow, gentle processes such as cold hydrogen flipping its spin (Lesson 1.6).

## 4. Worked example

*The radio line of cold hydrogen has a wavelength of 21.1 cm. What are its frequency and photon energy?*

```math
f = \frac{c}{\lambda} = \frac{2.998\times10^8}{0.211} = 1.42\times10^{9}\ \text{Hz} = 1420\ \text{MHz}
```

```math
E = h f = 6.626\times10^{-34}\times1.42\times10^{9} = 9.4\times10^{-25}\ \text{J} \approx 5.9\times10^{-6}\ \text{eV}
```

That is about 400,000 times less energy than one photon of green light.

## 5. Practice

1. What is the frequency of red light at 650 nm?
2. A medical X-ray photon has about 50,000 eV. What is its wavelength in nm?
3. Name two kinds of light you can observe from a backyard and two you can't.

<details>
<summary>Answers</summary>

1. `$f = 2.998\times10^8 / 650\times10^{-9} = 4.6\times10^{14}$` Hz.
2. `$\lambda \approx 1240/50{,}000 = 0.025$` nm.
3. Can: visible light, radio (with an antenna). Can't: X-rays, ultraviolet below about 300 nm (also most far-infrared and gamma rays).
</details>

**Try it with real numbers:** see what one cold hydrogen cloud looks like in radio with the [[hydrogen-line-analyser]], and size a dish with the [[radio-telescope-calculator]].

**New words:** *wavelength*, *frequency*, *photon*, *electronvolt*, *atmospheric window*.
