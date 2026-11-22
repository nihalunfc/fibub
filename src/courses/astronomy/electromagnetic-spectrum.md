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

**Module 1 · about 20 minutes · read first: [Sky watching 1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: powers of ten.** You'll be able to place any kind of light on the spectrum, convert between wavelength, frequency and photon energy, and say which kinds reach the ground.

<div class="bigidea">Radio waves, light and X-rays are the same thing, waves of electric and magnetic fields, differing only in wavelength; shorter waves carry more energy per photon, and our air lets only visible light and radio reach the ground.</div>

## 1. Why this matters

Almost everything we know about the universe arrives as light. Stars, gas clouds and galaxies send out radio waves, infrared, visible light, ultraviolet, X-rays and gamma rays, and each kind tells a different story: cold dust glows in infrared, hot gas in X-rays, hydrogen clouds in radio. To read those stories you need to know what the different kinds are and where they can be caught.

## 2. One family of waves

Light is a ripple of electric and magnetic fields. The distance from one crest to the next is the **wavelength** `$\lambda$`. How many crests pass each second is the **frequency** `$f$`. All of them move at the same speed `$c$` in empty space.

Light also comes in tiny packets called **photons**. A short wavelength means each photon carries more energy. That is why ultraviolet can burn your skin and radio waves can't.

<!--fig:spectrum-windows-->

Things to notice:

- Visible light, from about 400 nm (violet) to 700 nm (red), is a tiny slice.
- The air is clear in two windows: visible light and radio. Most infrared, and all ultraviolet, X-rays and gamma rays, are blocked.

Follow one photon of each kind from a distant galaxy to the ground:

<div class="steps">
<div class="step"><b>Radio, 21 cm.</b> A wave as long as a pencil, from cold hydrogen gas. Each photon carries about 0.000006 eV. It passes straight through our air and clouds.</div>
<div class="step"><b>Infrared, 10 μm.</b> Given off by warm dust and by you. Water vapour in the air soaks up most of it, so infrared telescopes sit on high, dry mountains or in space.</div>
<div class="step"><b>Visible, 500 nm.</b> About 2.5 eV per photon: just right to excite an electron in your eye. The air is clear, so this is the window we evolved to see in.</div>
<div class="step"><b>Ultraviolet, 100 nm.</b> About 12 eV, enough to break molecules. The ozone layer stops it high above us, which protects life and blinds ground telescopes.</div>
<div class="step"><b>X-ray, 1 nm.</b> About 1,240 eV, from gas at millions of degrees. The atmosphere absorbs it completely, so X-ray telescopes must orbit above it.</div>
</div>

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


<div class="meaning">

<dl>
<dt>λ (lambda)</dt><dd>Wavelength: the distance from one crest to the next.</dd>
<dt>f</dt><dd>Frequency: how many crests pass each second (hertz).</dd>
<dt>c = λf</dt><dd>All light moves at the same speed; long waves come less often, short waves more often.</dd>
<dt>E = hf = hc/λ</dt><dd>The energy of one photon: higher frequency, shorter wave, more energy.</dd>
<dt>Physical meaning</dt><dd>Think of photons as coins of different values. A radio coin is worth almost nothing; a visible coin can just buy a jump of one electron; an X-ray coin can knock electrons right out of atoms. What a photon can do to matter depends only on its value, not on how many you have.</dd>
</dl>

</div>

<div class="myth">

**"Radio waves are sound."** Radio is light with a long wavelength, travelling at 300,000 km/s through empty space. Sound is air pushing on air and cannot cross space at all. A radio set only turns the radio wave into sound for your ears.

</div>

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

<div class="problem" data-problem="em-photon-energy"></div>

**More practice** (answers below):

1. What is the frequency of red light at 650 nm?
2. A medical X-ray photon has about 50,000 eV. What is its wavelength in nm?
3. Name two kinds of light you can observe from a backyard and two you can't.

<details>
<summary>Answers</summary>

1. `$f = 2.998\times10^8 / 650\times10^{-9} = 4.6\times10^{14}$` Hz.
2. `$\lambda \approx 1240/50{,}000 = 0.025$` nm.
3. Can: visible light, radio (with an antenna). Can't: X-rays, ultraviolet below about 300 nm (also most far-infrared and gamma rays).
</details>

<div class="keypoints">

**Key points**

- Radio, infrared, visible, ultraviolet, X-rays and gamma rays are one family: electromagnetic waves.
- All travel at c = 2.998 × 10⁸ m/s in a vacuum, and c = λf.
- Photon energy E = hc/λ; shortcut E (eV) ≈ 1240 / λ (nm).
- Only visible light and radio pass well through our air; other bands need mountains, planes or space.

</div>

**Try it with real numbers:** see what one cold hydrogen cloud looks like in radio with the [[hydrogen-line-analyser]], and size a dish with the [[radio-telescope-calculator]].

**New words:** *wavelength*, *frequency*, *photon*, *electronvolt*, *atmospheric window*.
