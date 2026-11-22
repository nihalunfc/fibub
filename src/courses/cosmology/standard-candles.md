---
title: 'Standard candles: distance from brightness'
seoTitle: 'Standard candles and standard rulers explained'
summary: 'If you know how bright something really is, how faint it looks tells you how far away it is. How standard candles and standard rulers measure the universe, with the magnitude scale made simple.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: A standard candle is moved to 3 times its distance. How bright does it look?
    choices: ["1/3 as bright","3 times fainter in magnitudes","1/9 as bright"]
    ans: 2
    why: Brightness falls as 1/distance², so 3 times farther means 1/9 as bright.
  - q: A standard ruler is moved to 3 times its distance. How big does it look?
    choices: ["1/3 the angle","1/9 the angle","The same"]
    ans: 0
    why: Angular size falls as 1/distance (for small angles), so 3 times farther means a third of the angle.
  - q: Object A has m − M = 10 and object B has m − M = 15. How much farther is B?
    choices: ["5 times","10 times","100 times"]
    ans: 1
    why: Every 5 magnitudes is a factor of 100 in brightness, which is a factor of 10 in distance.
sources:
  - 'Astronomy course on fibub: flux, luminosity and the inverse square law https://fibub.com/learn/courses/astronomy/flux-luminosity/'
  - 'N. Pogson (1856), Magnitudes of thirty-six of the minor planets, MNRAS 17, 12 (the modern magnitude scale)'
---

**Module 2 · about 16 minutes.** By the end you will be able to explain what standard candles and standard rulers are, use the distance modulus to turn magnitudes into distances, and say what can go wrong.

<div class="bigidea">Almost every distance in cosmology beyond our galaxy comes from one idea: find something whose true brightness or true size you know, and see how faint or small it looks.</div>

## 1. Two kinds of yardstick

You already use both kinds of yardstick without thinking. At night, a car's headlights that look dim are far away: you know roughly how bright headlights really are. In the day, a person who looks tiny is far away: you know roughly how tall people are.

- A **standard candle** is an object whose true power (luminosity) we know. It fades as **1/distance²**, the inverse square law covered in the [Astronomy course](/learn/courses/astronomy/flux-luminosity/).
- A **standard ruler** is an object whose true size we know. It shrinks on the sky as **1/distance**.

<figure class="fig" data-fig="candle-ruler"><figcaption>Move the same lamp, or the same rod, farther away. Switch between the two to compare: the candle fades much faster than the ruler shrinks.</figcaption></figure>

```math
d = \sqrt{\frac{L}{4\pi F}}
```

<div class="meaning">

<dl>
<dt>d</dt><dd>the distance to the candle</dd>
<dt>L</dt><dd>its true power (luminosity), in watts: what we must know in advance</dd>
<dt>F</dt><dd>the flux we measure: watts arriving on each square metre of our telescope</dd>
<dt>4π d²</dt><dd>the area of the sphere the light has spread over by the time it reaches us</dd>
</dl>

If a candle looks 4 times fainter than expected, it is 2 times farther away than you thought.

</div>

<div class="problem" data-problem="candle-distance"></div>

## 2. Magnitudes, the astronomers' brightness scale

Astronomers measure brightness in **magnitudes**, a scale that goes back to the Greek astronomer Hipparchus. It has two quirks:

1. **Bigger numbers are fainter.** The brightest stars are magnitude 0 or 1; the faintest you can see by eye are about 6.
2. **It is logarithmic:** 5 magnitudes is exactly a factor of 100 in brightness. So 1 magnitude is a factor of about 2.512.

Two magnitudes matter for distance:

- **m**, the apparent magnitude: how bright the object looks from here.
- **M**, the absolute magnitude: how bright it would look from a standard distance of 10 parsecs (32.6 light-years). That is its true power, on the magnitude scale.

Their difference, **m − M**, is called the **distance modulus**, and it is a distance in disguise:

```math
d = 10^{\,(m - M + 5)/5}\ \text{parsecs}
```

<div class="meaning">

<dl>
<dt>m − M</dt><dd>how much fainter the object looks than it would at 10 parsecs</dd>
<dt>+5, ÷5</dt><dd>bookkeeping that makes m − M = 0 come out as exactly 10 parsecs</dd>
</dl>

Every extra 5 in m − M means 100 times fainter, which means 10 times farther. m − M = 0 is 10 pc, 5 is 100 pc, 10 is 1,000 pc, 25 is 1 million pc (1 Mpc).

</div>

<div class="problem" data-problem="distance-modulus"></div>

## 3. What can go wrong

A standard candle is only as good as our knowledge of its true brightness. Three things can spoil it:

- **Dust** between us and the candle dims it, making it look farther away. Astronomers correct for this by comparing colours, because dust dims blue light more than red.
- **The candle isn't quite standard.** Real objects vary. The art is finding a second measurable property that tells you the true brightness: a pulse period for Cepheids (Lesson 2.3), a fading speed for supernovae (Lesson 2.4), a spin speed for galaxies (Lesson 2.5).
- **Calibration.** To know the true brightness, you need some nearby examples whose distance you already know by another method. That makes the distance ladder (Lesson 2.6).

<div class="myth">

**"Brighter stars are always closer."** A star can look bright because it is close or because it is truly powerful. The bright star Rigel in Orion is about 860 light-years away but about 100,000 times more powerful than the Sun. Without knowing the true brightness, apparent brightness tells you nothing about distance.

</div>

<div class="keypoints">

- A standard candle has a known true brightness and fades as 1/distance²; a standard ruler has a known size and shrinks as 1/distance.
- Magnitudes run backwards (bigger is fainter) and 5 magnitudes is a factor of 100.
- The distance modulus m − M gives the distance: d = 10<sup>(m − M + 5)/5</sup> parsecs.
- Dust, imperfect candles and calibration errors are the main dangers, and every rung of the distance ladder has to deal with them.

</div>
