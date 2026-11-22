---
title: "Seeing and transparency"
summary: "Seeing is how steady the air is; transparency is how clear it is. Seeing blurs stars into fuzzy discs and limits detail on planets; transparency dims faint objects. They are different, and a night can be good for one and bad for the other."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Stars twinkle strongly and Jupiter boils in the eyepiece, but the Milky Way is bright. What kind of night is it?"
    choices: ["Good seeing, poor transparency", "Poor seeing, good transparency", "Good seeing and good transparency"]
    ans: 1
    why: "Twinkling and boiling are poor seeing; a bright Milky Way means the air is clear (good transparency)."
  - q: "What is the Rayleigh limit of a 200 mm telescope in green light (550 nm)?"
    choices: ["about 0.7″", "about 2″", "about 7″"]
    ans: 0
    why: "θ = 1.22 λ / D = 1.22 × 550e-9 / 0.2 rad = 3.36e-6 rad = 0.69″."
  - q: "Why do planets twinkle less than stars?"
    choices: ["They are closer to the Sun", "They show a small disc, so the twinkling of different points averages out", "They are brighter"]
    ans: 1
    why: "A star is effectively a point; a planet's disc is made of many points whose shimmer averages out."
sources:
  - "Fried, D. L. (1966), Optical resolution through a randomly inhomogeneous medium, JOSA 56, 1372"
---

**Module 3 · about 25 minutes · read first: [3.2 Light pollution and the Bortle scale](/learn/courses/sky-watching/light-pollution/), [2.6 Airmass: why low objects look dim](/learn/courses/sky-watching/airmass/) · maths: some physics.** You'll be able to tell seeing from transparency, estimate the blur of a star from both the telescope and the air, and decide what to observe on a given night.

<div class="bigidea">Seeing is how steady the air is and transparency is how clear it is: seeing blurs stars and planets, transparency dims faint objects, and a night can be good for one and bad for the other.</div>

## 1. Why this matters

Planetary observers live and die by seeing; deep-sky observers by transparency. Knowing which you have tonight tells you whether to point at Saturn or at a faint galaxy, and why a bigger telescope sometimes shows no more detail than a small one. Professional observatories are built on mountain tops in deserts for both reasons.

## 2. Seeing: the air's wobble

The atmosphere is full of pockets of air at slightly different temperatures, and so with slightly different refractive index. As light crosses them it is bent this way and that, thousands of times a second. The result:

- To the eye, stars **twinkle** (scintillation).
- In a telescope, a star becomes a **dancing, smeared blob** instead of a sharp point, and planets "boil".

Seeing is measured as the width of a star's blurred image (its FWHM, full width at half maximum) in arcseconds: about 0.5″ at the best mountain sites on a great night, 1″ to 2″ typical for good amateur sites, 3″ or more on a poor night or near a warm roof.

## 3. Transparency: the air's clarity

**Transparency** is how much light gets through at all: affected by haze, humidity, dust, smoke and thin cloud. A transparent night shows deep blue twilight, a crisp Milky Way and faint stars near the horizon. Strangely, very transparent nights after a cold front often have *poor* seeing (turbulent air), while hazy, still nights can have excellent seeing.


<div class="meaning">

<dl>
<dt>Seeing</dt><dd>Blur from turbulent air; measured in arcseconds.</dd>
<dt>r₀</dt><dd>Fried parameter: size of a patch of steady air (5 to 20 cm typical).</dd>
<dt>ε ≈ 0.98 λ / r₀</dt><dd>Seeing blur at wavelength λ.</dd>
<dt>Transparency</dt><dd>How much light gets through: haze, dust, thin cloud.</dd>
<dt>Physical meaning</dt><dd>Seeing is like looking at a coin at the bottom of a rippling pool: the water is clear, but the ripples make the coin dance. Transparency is muddy water: still but dim. Telescopes bigger than r₀ cannot beat the ripples, which is why big observatories sit on calm mountain tops.</dd>
</dl>

</div>

<div class="myth">

**"A clear sky full of stars is always a good night for planets."** The clearest nights often follow cold fronts with turbulent air and bad seeing. Planets look best on calm, slightly hazy nights.

</div>

Choose a target, your latitude and the date. The orange curve is the target's altitude; darker bands mean a darker sky.

<figure class="fig" data-fig="@astro-night-altitude"><figcaption>The best time is when the target is high (low airmass) and the Sun is more than 18° below the horizon. Change the date by a month and see the target shift about two hours earlier.</figcaption></figure>

## 4. The telescope's own limit

Even with perfect air, a telescope cannot show a point as a point: light waves passing through a round opening spread into a small pattern (the **Airy disc**). The smallest separation two equal stars can have and still be resolved is set by the aperture `$D$` (Lesson 4.4 goes further). The figure combines both blurs.

<!--fig:seeing-blur-->

Things to notice:

- With seeing set to 0, a bigger aperture always splits closer pairs.
- With seeing at 2″, going beyond about 100 mm barely helps: the air, not the telescope, sets the limit. Big telescopes still collect more light, though.

Compare two nights through the same telescope:

<div class="steps">
<div class="step"><b>Night 1, after a cold front.</b> The sky is crystal clear and full of stars (great transparency), but stars twinkle hard and Jupiter boils (poor seeing).</div>
<div class="step"><b>Why.</b> Fast winds mix warm and cold air into small pockets that bend light randomly: r₀ is only 5 cm, giving about 2.2″ of blur.</div>
<div class="step"><b>Night 2, under a calm high-pressure system.</b> The sky is slightly hazy (poor transparency), but stars barely twinkle and Jupiter's belts are sharp (good seeing).</div>
<div class="step"><b>Now r₀ is 15 cm.</b> Blur only 0.7″, close to what a 20 cm telescope can resolve.</div>
<div class="step"><b>Choose your target.</b> Galaxies on night 1, planets and double stars on night 2.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Diffraction (Rayleigh criterion):** two stars are just resolved when

```math
\theta = 1.22\,\frac{\lambda}{D} \ \text{radians}, \qquad 1\ \text{rad} = 206\,265''
```

**Seeing from turbulence:** the **Fried parameter** `$r_0$` is the size of a patch of air over which the wavefront is roughly flat (typically 5 to 20 cm in green light). The seeing blur is about

```math
\varepsilon \approx 0.98\,\frac{\lambda}{r_0}
```

so a telescope larger than `$r_0$` is limited by the air, not by its aperture.

**Combining blurs:** for rough work, blurs add "in quadrature": `$\text{FWHM}^2 \approx \varepsilon^2 + \theta_\text{diff}^2$`.

**Try it:** `$r_0 = 10$` cm at 550 nm: `$\varepsilon = 0.98 \times 550\times10^{-9} / 0.10 = 5.4 \times 10^{-6}$` rad `$= 1.1''$`.
</details>

## 5. Worked example

*A 250 mm telescope on a night of 2.5″ seeing. Can it split a double star 1.5″ apart?*

- Rayleigh limit: `$1.22 \times 550\times10^{-9} / 0.25 = 2.68 \times 10^{-6}$` rad `$= 0.55''$`. The telescope alone could split it easily.
- Combined blur (using the diffraction FWHM, a little narrower than the Rayleigh figure): `$\sqrt{2.5^2 + 0.47^2} \approx 2.54''$`.
- The gap (1.5″) is smaller than the blur, so the pair merges into one elongated blob. Try again on a steadier night, or wait for moments of good seeing: the air settles for fractions of a second, which is why patient observers (and "lucky imaging" cameras) still catch fine detail.

## 6. Practice

<div class="problem" data-problem="seeing-blur"></div>

**More practice** (answers below):

1. Find the Rayleigh limit of a 100 mm telescope.
2. On a night with `$r_0 = 5$` cm, what is the seeing?
3. The Moon looks sharp and steady, but faint galaxies are invisible. Which observing would you choose?

<details>
<summary>Answers</summary>

1. `$1.22 \times 550\times10^{-9} / 0.1 = 6.7\times 10^{-6}$` rad = 1.38″.
2. `$0.98 \times 550\times10^{-9}/0.05 = 1.08\times10^{-5}$` rad = 2.2″.
3. Good seeing, poor transparency: the Moon, planets and double stars.
</details>

<div class="keypoints">

- Seeing (steadiness) and transparency (clarity) are different.
- Seeing blur ε ≈ 0.98 λ/r₀; typical 1″ to 3″.
- Big telescopes are usually limited by seeing, not aperture.
- Pick galaxies for transparent nights and planets for steady ones.

</div>

**Try it with real numbers:** measure the blur of stars in your own images with the [[star-fwhm-checker]], or work out your telescope's resolution with the [[telescope-calculator]].

**New words:** *seeing*, *transparency*, *scintillation*, *FWHM*, *Airy disc*, *Rayleigh criterion*, *Fried parameter*.
