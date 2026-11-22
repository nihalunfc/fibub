---
title: "Parallax: measuring the distance to the stars"
seoTitle: "Stellar parallax and the parsec explained | Astronomy"
summary: "As Earth goes round the Sun, nearby stars shift slightly against far-away ones. The size of that shift gives the distance directly: a star with a parallax of 1 arcsecond is 1 parsec (3.26 light-years) away."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "A star has a parallax of 0.05″. How far away is it?"
    choices: ["5 pc", "20 pc", "50 pc"]
    ans: 1
    why: "d = 1/p = 1/0.05 = 20 pc."
  - q: "Why couldn't ancient astronomers see stellar parallax?"
    choices: ["It is far smaller than the eye can see", "Stars didn't move then", "They never looked"]
    ans: 0
    why: "Even the nearest star shifts by under 1 arcsecond, about 60 times smaller than the eye can resolve."
  - q: "One parsec is about:"
    choices: ["1 light-year", "3.26 light-years", "206 light-years"]
    ans: 1
    why: "1 pc = 206,265 AU = 3.26 light-years."
sources:
  - "Proxima Centauri parallax (rounded) and Gaia mission accuracy (described): ESA Gaia, cosmos.esa.int/gaia"
---

**Module 3 · about 20 minutes · read first: [2.1 Kepler's laws](/learn/courses/astronomy/keplers-laws/), [Sky watching 1.1 The celestial sphere: a map painted on a dome](/learn/courses/sky-watching/celestial-sphere/) · maths: small angles.** You'll be able to explain stellar parallax, turn a parallax angle into a distance, and say why it is the foundation of every other cosmic distance.

<div class="bigidea">As Earth circles the Sun, nearby stars shift a tiny angle against far-away ones; that angle gives the distance by pure geometry, and a shift of one arcsecond means one parsec.</div>

## 1. Why this matters

Every distance in astronomy beyond the solar system rests on parallax. It is pure geometry with no assumptions about what stars are like, so it is the first rung of the distance ladder (in the [cosmology course](/learn/courses/cosmology/)). Today ESA's Gaia spacecraft has measured parallaxes for more than a billion stars, mapping our part of the Milky Way in 3D.

## 2. The thumb trick, scaled up

Hold up a thumb at arm's length and close one eye, then the other. Your thumb jumps against the background. Move it closer and it jumps more. Astronomers do the same with Earth's orbit: they photograph a star in, say, January and again in July, from opposite sides of the Sun, 2 AU apart. A nearby star shifts a little against much more distant stars.

<!--fig:parallax-shift-->

Things to notice:

- The closer the star, the bigger the swing against the background.
- Move the star 10 times further away and the shift becomes 10 times smaller.
- Even for the nearest star, the real shift is less than one arcsecond.

Measure the distance to a nearby star over six months:

<div class="steps">
<div class="step"><b>January.</b> Photograph the star against much more distant background stars. Note exactly where it sits.</div>
<div class="step"><b>July.</b> Earth is now on the other side of the Sun, 2 AU from where it was. Photograph the same field again.</div>
<div class="step"><b>Compare.</b> The nearby star has moved slightly against the background; the far stars have not (they are too far to show a shift).</div>
<div class="step"><b>Halve it.</b> The parallax p is half the total shift: the angle that 1 AU makes as seen from the star. For Proxima Centauri p = 0.768″.</div>
<div class="step"><b>Distance.</b> d = 1/p = 1/0.768 = 1.30 parsecs, or 4.24 light-years. No guesses about the star needed.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Parallax angle** `$p$` is half the full yearly shift, the angle the radius of Earth's orbit (1 AU) makes as seen from the star. For small angles:

```math
d\ (\text{pc}) = \frac{1}{p\ (\text{arcseconds})}
```

That is the definition of the **parsec** ("parallax of one arcsecond"):

```math
1\ \text{pc} = \frac{1\ \text{AU}}{1''\ \text{in radians}} = 206{,}265\ \text{AU} = 3.086\times10^{16}\ \text{m} = 3.26\ \text{ly}
```

**Try it:** Proxima Centauri, `$p = 0.768''$`: `$d = 1/0.768 = 1.30$` pc = 4.24 light-years.
</details>

## 3. What it means physically

Parallax is a triangle with a very short base (Earth's orbit) and very long sides. The further the star, the thinner the triangle, until the angle is too small to measure. That is the limit of the method: ground telescopes, blurred by the air ([Sky watching 3.3](/learn/courses/sky-watching/seeing-transparency/)), reached about 0.01″ (100 pc); space telescopes go much further, because they don't look through air. Gaia reaches tens of microarcseconds for bright stars, enough for distances across much of the Galaxy.


<div class="meaning">

<dl>
<dt>p</dt><dd>Parallax angle: half the yearly back-and-forth shift, in arcseconds.</dd>
<dt>d = 1/p</dt><dd>Distance in parsecs when p is in arcseconds.</dd>
<dt>1 pc</dt><dd>206,265 AU = 3.26 light-years: the distance at which 1 AU spans 1 arcsecond.</dd>
<dt>Physical meaning</dt><dd>It is the thumb trick: hold up a thumb, blink one eye then the other, and it jumps against the wall. Your two eyes are the two sides of Earth's orbit, and the closer the thumb, the bigger the jump. One arcsecond is the width of a coin seen from 4 km away, which is why it took until 1838 to measure the first one.</dd>
</dl>

</div>

<div class="myth">

**"A parsec is a unit of time."** A parsec is a distance, about 3.26 light-years. Its name comes from "parallax of one arcsecond".

</div>

## 4. Worked example

*Gaia measures a parallax of 2.5 milliarcseconds (mas) with an uncertainty of 0.1 mas. How far is the star, and how sure are we?*

```math
d = \frac{1}{0.0025} = 400\ \text{pc}
```

The parallax could be 2.4 to 2.6 mas, giving `$1/0.0026 = 385$` pc to `$1/0.0024 = 417$` pc. So the distance is about 400 pc give or take 4%: the percent error in distance equals the percent error in parallax (Lesson 5.7).

## 5. Practice

<div class="problem" data-problem="parallax-distance"></div>

**More practice** (answers below):

1. Sirius has a parallax of 0.379″. How far is it in parsecs and light-years?
2. What parallax would a star at 1,000 pc have?
3. Why do astronomers wait six months between parallax photos?

<details>
<summary>Answers</summary>

1. `$1/0.379 = 2.64$` pc = 8.6 light-years.
2. 0.001″ = 1 milliarcsecond.
3. Earth is then on the opposite side of the Sun, giving the widest baseline (2 AU).
</details>

<div class="keypoints">

**Key points**

- Parallax is the yearly shift of a nearby star against distant ones as Earth orbits.
- d (pc) = 1 / p (arcsec); 1 pc = 3.26 ly = 206,265 AU.
- It needs no assumptions about the star, so it anchors every other distance method.
- ESA's Gaia has measured parallaxes for over a billion stars.

</div>

**Try it with real numbers:** turn magnitudes and distances into star power with the [[magnitude-flux-converter]], and place stars on the [[hr-diagram]].

**New words:** *parallax*, *parsec*, *baseline*, *milliarcsecond*, *Gaia*.
