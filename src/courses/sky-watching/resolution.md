---
title: "Resolution, the Dawson limit and the atmosphere"
summary: "Even perfect optics turn a star into a tiny disc with rings, the Airy pattern. Its size, set by the aperture, limits how close a double star a telescope can split: about 116 arcseconds divided by the aperture in millimetres."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What is Dawson's limit for a 200 mm telescope?"
    choices: ["0.58″", "1.16″", "2.3″"]
    ans: 0
    why: "116 ÷ 200 = 0.58 arcseconds."
  - q: "Why can't a perfect telescope show a star as a perfect point?"
    choices: ["Stars are not points", "Diffraction at the aperture spreads light into an Airy pattern", "The eyepiece is too weak"]
    ans: 1
    why: "Light passing through any finite opening spreads out; the smaller the opening, the bigger the spread."
  - q: "On a night of 2″ seeing, which telescope splits a 1.2″ pair?"
    choices: ["A 100 mm, because its Dawson limit is 1.16″", "Probably none, because the air blurs each star to about 2″", "Only a 400 mm"]
    ans: 1
    why: "The atmosphere's blur is bigger than the separation, whatever the aperture. Wait for steadier air."
sources:
  - "Airy, G. B. (1835), On the diffraction of an object-glass with circular aperture, Transactions of the Cambridge Philosophical Society 5, 283"
  - "Dawson, W. R. (1867), Catalogue of double stars, Memoirs of the Royal Astronomical Society 35"
---

**Module 4 · about 25 minutes · read first: [4.2 Aperture: the bucket that catches light](/learn/courses/sky-watching/aperture/), [3.3 Seeing and transparency](/learn/courses/sky-watching/seeing-transparency/) · maths: some physics.** You'll be able to explain diffraction and the Airy pattern, use the Rayleigh and Dawson limits, and judge whether the telescope or the air sets the limit tonight.

<div class="bigidea">Even perfect optics turn a star into a tiny disc with rings, the Airy pattern; its size, set by the aperture, limits how close a double star a telescope can split, about 116″ divided by the aperture in millimetres.</div>

## 1. Why this matters

Resolution is the second reason aperture matters: a bigger telescope can show finer detail on planets, the Moon and close double stars. It is also the root of a key idea in professional astronomy: why interferometers and huge mirrors are built, and why space telescopes see sharper than ground telescopes of the same size.

## 2. Diffraction and the Airy pattern

Light is a wave. When a wave passes through a round opening it spreads slightly, so a telescope turns a star into a small bright disc surrounded by faint rings: the **Airy pattern**, after George Airy who worked it out in 1835. About 84% of the light is in the central disc. The disc's size depends only on the wavelength and the aperture: a bigger aperture makes a smaller disc.

<!--fig:airy-pair-->

Things to notice:

- At the Rayleigh limit, the second star's peak sits on the first star's first dark ring, and the dip between them is about 26%.
- At Dawson's limit (a little closer) the dip is only a few percent, but trained eyes still see the pair as a "figure of eight".
- Double the aperture: both limits halve.

Split a double star with telescopes of growing size:

<div class="steps">
<div class="step"><b>The pair.</b> Two equal stars 1.5″ apart.</div>
<div class="step"><b>60 mm telescope.</b> Each star is a disc whose first dark ring lies 2.3″ from its centre, so the two discs overlap into one elongated blob.</div>
<div class="step"><b>80 mm.</b> Dawson limit 116/80 = 1.45″: just split, two discs touching, with a dark notch between.</div>
<div class="step"><b>150 mm.</b> Limit 0.77″: cleanly split, black sky between them.</div>
<div class="step"><b>On a bad night.</b> Seeing of 3″ blurs everything; even the 150 mm shows one blob. The air often sets the real limit.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Airy pattern:** the brightness at angle `$\theta$` from the centre is

```math
I(\theta) = I_0 \left[\frac{2 J_1(x)}{x}\right]^2, \qquad x = \frac{\pi D \sin\theta}{\lambda}
```

where `$J_1$` is a Bessel function (a wave-like function that the figure computes for you). The first dark ring is where `$J_1(x) = 0$`, at `$x = 3.83$`.

**Rayleigh criterion:**

```math
\theta_R = 1.22\,\frac{\lambda}{D} \ \text{rad} \approx \frac{138''}{D_\text{mm}} \ \text{at } \lambda = 550\ \text{nm}
```

**Dawson's limit** (measured by eye in the 1860s, for equal 6th-magnitude stars):

```math
\theta_D \approx \frac{116''}{D_\text{mm}}
```

**Try it:** a 150 mm telescope: Rayleigh `$138/150 = 0.92''$`, Dawson `$116/150 = 0.77''$`.
</details>

Pick a sky object and a hand measure, then change your arm length.

<figure class="fig" data-fig="@astro-angular-size"><figcaption>Compare the object's angular size with the hand ruler: a pinky is about 1°, three fingers 5°, a fist 10°, an open hand 20°. The ruler depends on your arm, so calibrate it once on stars with known separation.</figcaption></figure>

## 3. Telescope or atmosphere?

Seeing (Lesson 3.3) blurs every star by typically 1″ to 3″. Compare with the Dawson limit:

- 60 mm: 1.9″, about the same as average seeing: the telescope and the air limit together.
- 200 mm: 0.58″: on most nights the air limits it, not the optics.
- A 10 m professional telescope: 0.012″, a hundred times finer than the air allows. That is why observatories use **adaptive optics** (a deformable mirror that cancels the air's wobble hundreds of times a second) and why space telescopes are so sharp.


<div class="meaning">

<dl>
<dt>Airy disc</dt><dd>The smallest spot a lens or mirror can make of a star.</dd>
<dt>θ<sub>R</sub> = 1.22 λ / D</dt><dd>Rayleigh criterion: about 138″/D(mm) at 550 nm.</dd>
<dt>Dawson limit ≈ 116″/D(mm)</dt><dd>Practical splitting limit for equal stars found by observers.</dd>
<dt>Physical meaning</dt><dd>Light is a wave, and a wave passing through a round opening spreads a little. The wider the opening compared with the wave, the less it spreads, so big apertures make smaller star discs. No polishing can beat this: it is set by the physics of waves.</dd>
</dl>

</div>

<div class="myth">

**"A perfect telescope shows stars as true points."** Stars are so far away that their real discs are far too small to see, but every telescope turns them into Airy discs. What you see is the telescope's own fingerprint, not the star's size.

</div>

## 4. Worked example

*Can a 90 mm refractor split the famous double star Epsilon Lyrae's pairs, each about 2.3″ apart?*

- Dawson limit: `$116/90 = 1.29''$`. The pairs are wider, so yes on a night with seeing under about 2″.
- Magnification needed: the eye can separate two points about 2′ (120″) apart comfortably, so you want at least `$120/2.3 \approx 52\times$`, and in practice 100× to 150× makes it easy. With a 900 mm telescope, that is a 6 to 9 mm eyepiece.

## 5. Practice

<div class="problem" data-problem="dawson-limit"></div>

**More practice** (answers below):

1. Rayleigh limit of a 300 mm telescope in green light?
2. A telescope's Dawson limit is 0.46″. What is its aperture?
3. Why do radio telescopes need to be so much bigger than optical ones for the same resolution?

<details>
<summary>Answers</summary>

1. `$138/300 = 0.46''$`.
2. `$116/0.46 \approx 252$` mm.
3. Resolution goes as `$\lambda/D$`. Radio waves are about a million times longer than visible light, so a radio dish needs to be a million times wider for the same sharpness. Radio astronomers link dishes across continents to do it ([Astronomy 1.6](/learn/courses/astronomy/beyond-visible/)).
</details>

<div class="keypoints">

- Diffraction turns every star into an Airy disc with faint rings.
- Rayleigh: θ = 1.22 λ/D ≈ 138″/D (mm); Dawson ≈ 116″/D (mm).
- Bigger aperture, finer detail.
- Seeing often limits telescopes above about 150 mm.

</div>

**Try it with real numbers:** check resolution and the best magnification for close doubles with the [[telescope-calculator]] and the [[double-star-calculator]].

**New words:** *diffraction*, *Airy pattern*, *Airy disc*, *Rayleigh criterion*, *Dawson's limit*, *adaptive optics*.
