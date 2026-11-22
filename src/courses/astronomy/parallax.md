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

**Module 3 · about 20 minutes · small angles.** You'll be able to explain stellar parallax, turn a parallax angle into a distance, and say why it is the foundation of every other cosmic distance.

## 1. Why this matters

Every distance in astronomy beyond the solar system rests on parallax. It is pure geometry with no assumptions about what stars are like, so it is the first rung of the distance ladder (in the [cosmology course](/learn/courses/cosmology/)). Today ESA's Gaia spacecraft has measured parallaxes for more than a billion stars, mapping our part of the Milky Way in 3D.

## 2. The thumb trick, scaled up

Hold up a thumb at arm's length and close one eye, then the other. Your thumb jumps against the background. Move it closer and it jumps more. Astronomers do the same with Earth's orbit: they photograph a star in, say, January and again in July, from opposite sides of the Sun, 2 AU apart. A nearby star shifts a little against much more distant stars.

<!--fig:parallax-shift-->

Things to notice:

- The closer the star, the bigger the swing against the background.
- Move the star 10 times further away and the shift becomes 10 times smaller.
- Even for the nearest star, the real shift is less than one arcsecond.

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

## 4. Worked example

*Gaia measures a parallax of 2.5 milliarcseconds (mas) with an uncertainty of 0.1 mas. How far is the star, and how sure are we?*

```math
d = \frac{1}{0.0025} = 400\ \text{pc}
```

The parallax could be 2.4 to 2.6 mas, giving `$1/0.0026 = 385$` pc to `$1/0.0024 = 417$` pc. So the distance is about 400 pc give or take 4%: the percent error in distance equals the percent error in parallax (Lesson 5.7).

## 5. Practice

1. Sirius has a parallax of 0.379″. How far is it in parsecs and light-years?
2. What parallax would a star at 1,000 pc have?
3. Why do astronomers wait six months between parallax photos?

<details>
<summary>Answers</summary>

1. `$1/0.379 = 2.64$` pc = 8.6 light-years.
2. 0.001″ = 1 milliarcsecond.
3. Earth is then on the opposite side of the Sun, giving the widest baseline (2 AU).
</details>

**Try it with real numbers:** turn magnitudes and distances into star power with the [[magnitude-flux-converter]], and place stars on the [[hr-diagram]].

**New words:** *parallax*, *parsec*, *baseline*, *milliarcsecond*, *Gaia*.
