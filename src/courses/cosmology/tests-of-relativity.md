---
title: 'How we know Einstein was right: Mercury, eclipses and GPS'
seoTitle: 'Tests of general relativity: Mercury, 1919 eclipse, GPS'
summary: 'Three famous tests of general relativity, from Mercury''s turning orbit and the 1919 eclipse that made Einstein famous to the satellite clocks that make GPS work. With a step-by-step animation and a live GPS problem.'
minutes: 13
updated: 2026-11-22
quiz:
  - q: What was strange about Mercury's orbit before Einstein?
    choices: ['Its ellipse turned 43 arcseconds per century more than Newton''s gravity predicted', 'It went round the wrong way', 'It had no ellipse at all']
    ans: 0
    why: Pulls from the other planets explained most of the turning, but 43 arcseconds per century were left over. General relativity gives exactly that.
  - q: What did the 1919 eclipse expeditions measure?
    choices: ['Starlight passing the Sun bent by about 1.75 arcseconds', 'The Sun''s temperature', 'The speed of light']
    ans: 0
    why: Stars near the eclipsed Sun appeared shifted outwards by about Einstein's predicted amount, twice what a Newton-style calculation gives.
  - q: Why would GPS fail without relativity?
    choices: ['Satellite clocks gain about 38 microseconds a day, which would add about 11 km of error a day', 'Radio waves cannot cross space', 'Satellites move too slowly']
    ans: 0
    why: Being higher up makes satellite clocks run fast, and moving makes them run a little slow. The net gain is about 38 µs a day, and light goes about 11 km in that time.
sources:
  - 'F. W. Dyson, A. S. Eddington and C. Davidson (1920), A determination of the deflection of light by the Sun''s gravitational field, Philosophical Transactions of the Royal Society A 220, 291 https://doi.org/10.1098/rsta.1920.0009'
  - 'N. Ashby (2003), Relativity in the Global Positioning System, Living Reviews in Relativity 6, 1 https://doi.org/10.12942/lrr-2003-1'
  - 'C. M. Will (2014), The confrontation between general relativity and experiment, Living Reviews in Relativity 17, 4 https://doi.org/10.12942/lrr-2014-4'
---

**Module 3 · about 13 minutes.** Read first: [3.5 Curved spacetime](/learn/courses/cosmology/curved-spacetime/). By the end you will be able to describe three tests of general relativity and explain why your phone's map relies on it.

<div class="bigidea">A good theory predicts numbers no one has measured yet. General relativity did, and it has passed every test for over a century.</div>

## 1. Three tests in one animation

<div class="steps" data-fig="three-tests">
<div class="step">Newton's gravity says a lone planet traces the same ellipse forever. Mercury's ellipse slowly turns (precesses), and the tugs of other planets explain most of it, but not all.</div>
<div class="step">General relativity adds a small extra turn each orbit, because Mercury is close to the Sun where spacetime curves most. The prediction, 43 arcseconds per century, matched the mystery exactly (shown hugely exaggerated).</div>
<div class="step">During a total eclipse, stars near the darkened Sun appear pushed outwards, because their light bends as it passes. Einstein predicted 1.75 arcseconds at the Sun's edge.</div>
<div class="step">GPS satellites carry atomic clocks. Higher up in weaker gravity they run fast; moving at 3.9 km/s they run slow. The net is about 38 microseconds a day fast, and the system corrects for it.</div>
</div>

## 2. Mercury: an old puzzle solved

In 1859 Urbain Le Verrier, who had predicted Neptune from its pull on Uranus, found that Mercury's closest point to the Sun moved round a little too fast. He guessed an unseen planet, "Vulcan", inside Mercury's orbit. Astronomers searched for decades and found nothing.

In November 1915 Einstein calculated Mercury's orbit with his new theory and got the missing **43 arcseconds per century** with no adjustable numbers at all. He later wrote that his heart raced. It was the first sign the theory was right.

## 3. The 1919 eclipse

Light passing a mass of M at a closest distance b is bent by an angle:

```math
\alpha = \frac{4 G M}{c^{2}\, b}
```

<div class="meaning">

<dl>
<dt>α</dt><dd>the bending angle (in radians; multiply by 206,265 for arcseconds)</dd>
<dt>M, b</dt><dd>the mass doing the bending and how close the light passes</dd>
<dt>Physical meaning</dt><dd>For light grazing the Sun this is 1.75 arcseconds, about the width of a coin seen from 3 km. A Newton-style "light falls like a ball" estimate gives only half that, because it leaves out the curving of space.</dd>
</dl>

</div>

Stars near the Sun can only be seen during a total eclipse. In May 1919, two British expeditions led by Arthur Eddington and Frank Dyson photographed the stars around the eclipsed Sun from Príncipe, an island off West Africa, and Sobral in Brazil, and compared them with night-time photos of the same stars. The shifts matched Einstein rather than the Newton-style half. Newspapers around the world announced that space was curved, and Einstein became famous overnight. Modern radio measurements agree with Einstein to better than 0.01%.

## 4. GPS: relativity in your pocket

GPS satellites orbit about 20,200 km up. Your phone works out its position from how long signals from several satellites take to arrive, so their clocks must agree to about a billionth of a second.

- **Higher up, weaker gravity:** the satellite clocks run about **45 microseconds a day fast** (Lesson 3.5).
- **Moving fast:** they run about **7 microseconds a day slow** (Lesson 3.2).

<div class="problem" data-problem="gps-error"></div>

Engineers set the satellite clocks slightly slow before launch to cancel the net 38 µs a day. Every time a map app finds you, both kinds of relativity are at work.

<div class="myth">

**"Einstein proved Newton wrong."** Newton's gravity is an excellent approximation whenever gravity is weak and speeds are low, and spacecraft are still steered with it. General relativity includes Newton's theory as a special case and goes further where Newton fails: near the Sun, near black holes, and for the universe as a whole.

</div>

<div class="history">

**More tests since.** Radar echoes from Venus and Mars arrive slightly late because they pass the Sun (the Shapiro delay, 1960s). Gravity Probe B measured Earth dragging spacetime round with it (2011). Pairs of pulsars lose energy exactly as gravitational waves predict (Lesson 3.9). General relativity has passed them all.

</div>

<div class="keypoints">

- Mercury's orbit turns 43 arcseconds per century more than Newton's gravity explains; general relativity predicts exactly that.
- Starlight grazing the Sun bends by 1.75 arcseconds, first measured at the 1919 eclipse.
- GPS clocks gain a net 38 microseconds a day from relativity; uncorrected, positions would drift about 11 km a day.
- Newton's gravity is the weak-field limit of general relativity, which cosmology needs for the universe as a whole.

</div>
