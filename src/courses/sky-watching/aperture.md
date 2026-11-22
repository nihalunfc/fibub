---
title: "Aperture: the bucket that catches light"
summary: "Aperture is the diameter of a telescope's main lens or mirror, and it matters more than anything else. Light grasp grows with the area, so doubling the aperture shows stars 1.5 magnitudes fainter."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "How much more light does a 200 mm telescope collect than a 100 mm one?"
    choices: ["2 times", "4 times", "8 times"]
    ans: 1
    why: "Light grasp goes with the area, which goes with the diameter squared: (200/100)² = 4."
  - q: "Roughly how many magnitudes fainter can a 150 mm telescope show than a dark-adapted eye (7 mm pupil)?"
    choices: ["about 3", "about 6.7", "about 15"]
    ans: 1
    why: "5 log10(150/7) = 5 × 1.33 = 6.7 magnitudes."
  - q: "Which number on a telescope box matters most for seeing faint objects?"
    choices: ["The highest magnification", "The aperture", "The tube length"]
    ans: 1
    why: "Aperture sets both how much light is collected and the finest detail possible. Magnification claims are often meaningless."
sources:
  - "Hecht, E. (2017), Optics, 5th ed., Pearson (thin lens equation, diffraction)"
  - "Rutten, H. and van Venrooij, M. (1988), Telescope Optics: Evaluation and Design, Willmann-Bell"
---

**Module 4 · about 20 minutes · read first: [4.1 How lenses and mirrors make an image](/learn/courses/sky-watching/lenses-mirrors/), [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: logarithms (Lesson 1.7).** You'll be able to compare telescopes by aperture, work out light grasp and a rough limiting magnitude, and see through misleading magnification claims.

<div class="bigidea">Aperture, the diameter of the main lens or mirror, matters more than anything else: light grasp grows with the area, so doubling the aperture shows stars 1.5 magnitudes fainter and finer detail.</div>

## 1. Why this matters

Shops sell telescopes with "675× power!" on the box. That number is almost meaningless. The one that matters is the **aperture**: the diameter of the main lens or mirror. It decides how faint you can see and how fine the detail can be (Lesson 4.4). This lesson gives you the numbers to compare any two instruments.

## 2. A bigger bucket

Think of a telescope as a bucket in the rain. Photons fall evenly over the ground; a bucket twice as wide catches four times as many drops because its opening has four times the area. Your eye's bucket is its pupil, at most about 7 mm across in the dark (less as you age). A 200 mm telescope has

```math
\left(\frac{200}{7}\right)^2 \approx 816
```

times the collecting area, and all that light is squeezed into your pupil by the eyepiece.

<!--fig:aperture-grasp-->

Things to notice:

- Going from 100 mm to 200 mm adds 1.5 magnitudes; from 200 mm to 400 mm another 1.5. Each doubling helps the same amount on the magnitude scale.
- A darker sky (higher naked-eye limit) lifts the whole curve: a small telescope under a dark sky can beat a big one in town.

Compare your eye with three telescopes:

<div class="steps">
<div class="step"><b>Your eye, 7 mm.</b> From a dark site you see stars to about magnitude 6.</div>
<div class="step"><b>Binoculars, 50 mm.</b> (50/7)² = 51 times more light: about 4.3 magnitudes deeper, to magnitude 10.</div>
<div class="step"><b>A 150 mm telescope.</b> (150/7)² = 460 times: magnitude 12.7. Hundreds of galaxies come within reach.</div>
<div class="step"><b>A 300 mm telescope.</b> Twice the aperture, four times the light: 1.5 magnitudes more, to about 14.2.</div>
<div class="step"><b>Sharper too.</b> A bigger aperture also splits closer double stars (Lesson 4.4).</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Light grasp** compared with a pupil of diameter `$p$`:

```math
G = \left(\frac{D}{p}\right)^2
```

**Magnitude gain** (Lesson 1.7, Pogson):

```math
\Delta m = 2.5 \log_{10} G = 5 \log_{10}\frac{D}{p}
```

**Rough limiting magnitude:** naked-eye limit plus the gain,

```math
m_\text{lim} \approx \text{NELM} + 5 \log_{10}\frac{D}{p}
```

Real limits are a few tenths higher or lower: high magnification darkens the sky background and helps a little, losses in the optics hurt a little, and experienced observers see further.

**Try it:** a 10×50 binocular (50 mm lenses) under a sky with NELM 6: `$6 + 5\log_{10}(50/7) = 6 + 4.3 = 10.3$`.
</details>

Slide the aperture and the eyepiece, and watch the star field and the limiting magnitude.

<figure class="fig" data-fig="@astro-light-gather"><figcaption>The aperture sets how faint you can see (light grows with area, so doubling the diameter gives 4 times the light and about 1.5 magnitudes deeper). The eyepiece only sets the magnification, the true field and the exit pupil: a higher power does not show fainter stars.</figcaption></figure>

## 3. What aperture does not change

- **Surface brightness of extended objects.** A nebula never looks brighter per unit area through a telescope than with the naked eye at the same exit pupil (Lesson 4.3). Aperture lets you use more magnification at the same brightness, so you see the object bigger.
- **Colour.** Most nebulae and galaxies still look grey, because their light is too faint for your colour-sensing cones. Cameras gather light for minutes and show the colours.


<div class="meaning">

<dl>
<dt>D</dt><dd>Aperture: diameter of the main lens or mirror.</dd>
<dt>G = (D/p)²</dt><dd>Light grasp compared with a pupil of diameter p.</dd>
<dt>Δm = 5 log₁₀(D/p)</dt><dd>How many magnitudes fainter the telescope shows.</dd>
<dt>Physical meaning</dt><dd>A telescope is a bucket for light in the rain. A bucket twice as wide catches four times as much rain in the same time, however long or short it is. Light falling on a wider mirror is all funnelled into your eye.</dd>
</dl>

</div>

<div class="myth">

**"A telescope labelled "600× power" is a good telescope."** Magnification is cheap; what matters is aperture. A 60 mm telescope cannot show sharp detail beyond about 120×, so "600×" boxes are a warning sign.

</div>

## 4. Worked example

*Is an upgrade from a 130 mm to a 200 mm telescope worth it, under a sky with NELM 5.5?*

- Light grasp ratio: `$(200/130)^2 = 2.37$` times the light.
- Magnitude gain: `$5\log_{10}(200/130) = 0.94$` magnitudes.
- Limits: `$5.5 + 5\log_{10}(130/7) = 11.8$` and `$5.5 + 5\log_{10}(200/7) = 12.8$`.

About one magnitude deeper and about 2.4 times brighter images of every galaxy: a clear, visible difference, especially on globular clusters, which start to resolve into stars.

## 5. Practice

<div class="problem" data-problem="aperture-gain"></div>

**More practice** (answers below):

1. How much more light does a 300 mm telescope collect than a 7 mm pupil?
2. What aperture would show stars 5 magnitudes fainter than your eye?
3. Two telescopes have 1,000 mm focal length; one is 100 mm and one 250 mm across. Which shows faint galaxies better, and by how many magnitudes?

<details>
<summary>Answers</summary>

1. `$(300/7)^2 \approx 1837$` times.
2. `$5\log_{10}(D/7) = 5$` so `$D/7 = 10$` and `$D = 70$` mm.
3. The 250 mm, by `$5\log_{10}(2.5) = 2.0$` magnitudes. Focal length doesn't change light grasp.
</details>

<div class="keypoints">

- Aperture is the most important number of a telescope.
- Light grasp ∝ D²: twice the aperture, four times the light.
- Limiting magnitude gain = 5 log₁₀(D/7 mm) over the eye.
- Bigger aperture also gives finer resolution.

</div>

**Try it with real numbers:** compare light grasp, limiting magnitude and resolution for any telescope with the [[telescope-calculator]].

**New words:** *aperture*, *light grasp*, *limiting magnitude*, *collecting area*.
