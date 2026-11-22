---
title: "Choosing a first setup"
summary: "Start with your eyes and binoculars, then pick a telescope for the sky you have and what you want to see. A 150 to 200 mm Dobsonian is the classic all-rounder; small refractors suit travel and photography."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What is often the best first optical instrument for astronomy?"
    choices: ["A 900× department-store telescope", "A pair of 7×50 or 10×50 binoculars", "A large professional camera"]
    ans: 1
    why: "Binoculars are cheap, quick, give wide bright views, and teach you the sky; they stay useful forever."
  - q: "Why do 10×50 binoculars have a 5 mm exit pupil?"
    choices: ["50 ÷ 10 = 5", "10 × 50 ÷ 100 = 5", "Because of the prisms"]
    ans: 0
    why: "Exit pupil = aperture ÷ magnification = 50 mm ÷ 10."
  - q: "A buyer wants to see faint galaxies from a dark site and has a small budget. Which is the better choice?"
    choices: ["A 200 mm Dobsonian", "An 80 mm refractor on a computerised mount", "A 60 mm refractor"]
    ans: 0
    why: "Aperture matters most for faint galaxies, and a Dobsonian gives the most aperture for the money."
sources:
  - "Hecht, E. (2017), Optics, 5th ed., Pearson (thin lens equation, diffraction)"
  - "Rutten, H. and van Venrooij, M. (1988), Telescope Optics: Evaluation and Design, Willmann-Bell"
---

**Module 4 · about 20 minutes · read first: [4.2 Aperture: the bucket that catches light](/learn/courses/sky-watching/aperture/), [4.3 Focal length, f-ratio and magnification](/learn/courses/sky-watching/focal-length-magnification/), [4.5 Refractors, reflectors and catadioptrics](/learn/courses/sky-watching/telescope-types/), [4.6 Mounts and polar alignment](/learn/courses/sky-watching/mounts-polar-alignment/) · maths: uses this module's formulas.** You'll be able to compare setups by what their optics can do, avoid common buying mistakes, and match a setup to your sky, your space and your goals.

<div class="bigidea">Start with your eyes and binoculars, then choose a telescope for the sky you have and what you want to see; a 150 to 200 mm Dobsonian is the classic all-rounder, a small refractor suits travel and photography.</div>

## 1. Why this matters

The best telescope is the one you use. A heavy telescope that takes 40 minutes to set up stays in the cupboard; a pair of binoculars by the door gets used every clear night. This lesson pulls the module together into choices you can defend with numbers.

## 2. Start with binoculars

Binoculars are named by magnification and aperture: **10×50** means 10× and 50 mm lenses. They give a wide, bright, upright view, with two eyes (which improves faint-object detection), and show hundreds of clusters, the Moon's craters, Jupiter's moons and comets. **7×50** and **10×50** suit hand-holding; **15×70** and up need a tripod.

## 3. Comparing telescopes with numbers

<!--fig:setup-compare-->

Things to notice:

- Light grasp jumps with aperture: the 200 mm Dobsonian and the 203 mm SCT collect almost the same light, and far more than the 80 mm refractor.
- The widest fields come from short focal lengths: the refractor and the binoculars.
- Highest useful power follows aperture, but the air rarely allows more than 250× to 300×.


<div class="meaning">

<dl>
<dt>(D/7)²</dt><dd>Light grasp over a 7 mm pupil.</dd>
<dt>116″/D</dt><dd>Dawson limit.</dd>
<dt>D/7 to 2D</dt><dd>Useful magnification range (D in mm).</dd>
<dt>θ<sub>a</sub>/M</dt><dd>True field of view.</dd>
<dt>Physical meaning</dt><dd>Your first telescope should match your sky and your back. A huge telescope that stays indoors shows nothing; a modest one that comes out twice a week shows the rings of Saturn, the moons of Jupiter and dozens of galaxies.</dd>
</dl>

</div>

<div class="myth">

**"You need a computerised GoTo telescope to find things."** Many observers learn faster by star-hopping with a chart (Lesson 1.6). GoTo helps under city skies, but adds cost, setup and batteries; the same money often buys a bigger aperture.

</div>

## 4. Matching setup to goals

| Goal | Good first choice | Why |
|---|---|---|
| Learn the sky, star-hop | 10×50 binoculars and a star atlas | Wide, quick, cheap |
| See as much as possible visually | 150 to 200 mm Dobsonian | Most aperture per dollar, simple |
| Moon and planets, small space | 90 to 127 mm Maksutov or a 150 mm Newtonian | Long focal length, compact |
| Travel | 70 to 80 mm refractor on a light alt-az mount | Light, quick to cool |
| Start astrophotography | 60 to 80 mm apochromatic refractor on a tracking EQ mount | Wide, forgiving fields; the mount matters most |

Avoid: tiny telescopes sold by magnification claims, wobbly tripods, and spending everything on the telescope with nothing left for a decent eyepiece, a red torch and a chart.

Check a 200 mm f/6 Dobsonian with the formulas from this module:

<div class="steps">
<div class="step"><b>Light grasp.</b> (200/7)² = 816 times your eye: stars to about magnitude 13.3 from a dark site.</div>
<div class="step"><b>Resolution.</b> 116/200 = 0.58″: limited by seeing on most nights.</div>
<div class="step"><b>Eyepieces.</b> A 25 mm gives 48× (wide views); a 10 mm gives 120× (planets).</div>
<div class="step"><b>Field.</b> The 25 mm with a 52° field shows 1.1°: the whole Pleiades fits.</div>
<div class="step"><b>Practical.</b> About 20 kg in two pieces; cools in 30 to 60 minutes; no power needed. If that is too big, a 130 mm tabletop or 80 mm refractor is the next choice.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**A setup's key numbers, all from Lessons 4.2 to 4.4:**

- light grasp `$(D/7)^2$`, limiting magnitude `$\approx \text{NELM} + 5\log_{10}(D/7)$`
- Dawson limit `$116''/D_\text{mm}$`
- magnification `$F/f_e$`, exit pupil `$D/M$`, true field `$\theta_a/M$`
- useful power `$D/7$` to `$2D$`

**Binoculars:** two apertures, so about `$\sqrt{2}$` (a 40% boost) in perceived signal over one eye, roughly 0.4 magnitudes in practice.
</details>

## 5. Worked example

*A family in a suburb (NELM 5) with a car and a small budget wants to see "lots of things".*

- 10×50 binoculars: limiting magnitude about `$5 + 5\log_{10}(50/7) = 9.3$`, field 6.5°.
- A 200 mm f/6 Dobsonian: limiting magnitude about `$5 + 5\log_{10}(200/7) = 12.3$`, Dawson 0.58″, lowest power with a 32 mm eyepiece 37.5× with a 1.3° field, highest useful 400×.
- Together they cover wide star fields (binoculars) and faint galaxies, globular clusters and planetary detail (Dobsonian), and the Dobsonian sets up in 2 minutes. A strong pick.

## 6. Practice

<div class="problem" data-problem="true-field"></div>

**More practice** (answers below):

1. What are the exit pupil and rough limiting magnitude of 7×50 binoculars under NELM 6?
2. Why is a tracking mount more important than the telescope for photography?
3. A friend wants a telescope that "magnifies 600×". What two numbers do you ask about instead?

<details>
<summary>Answers</summary>

1. Exit pupil `$50/7 = 7.1$` mm; limit about `$6 + 5\log_{10}(50/7) = 10.3$`.
2. Long exposures need the stars held still to a fraction of a pixel for minutes; any wobble or drift blurs the image whatever the optics.
3. The aperture (light grasp and resolution) and the mount (stability and tracking).
</details>

<div class="keypoints">

**Key points**

- Start with eyes and binoculars (7×50 or 10×50).
- A 150 to 200 mm Dobsonian is the classic first telescope.
- Check light grasp, resolution, magnification and field before buying.
- Pick a scope you will carry out often.

</div>

**Try it with real numbers:** compare any telescope and eyepiece set with the [[telescope-calculator]], and see what you could observe tonight with the [[observing-session]] planner.

**New words:** *binocular naming (7×50)*, *Dobsonian*, *tracking mount*, *star atlas*.
