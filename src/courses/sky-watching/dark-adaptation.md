---
title: "Dark adaptation and averted vision"
summary: "Your eyes take 20 to 40 minutes to reach full night sensitivity, and one glance at a white screen undoes it. Learn how rods and cones work, why red light helps, and how averted vision shows faint objects."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "About how long do your eyes need to adapt fully to the dark?"
    choices: ["30 seconds", "5 minutes", "20 to 40 minutes"]
    ans: 2
    why: "Cones adapt in a few minutes, but rods keep improving for 20 to 40 minutes."
  - q: "Why do astronomers use dim red torches?"
    choices: ["Red light is warmer", "Rods hardly respond to deep red light, so it spoils dark adaptation less", "Red light shows star colours better"]
    ans: 1
    why: "Rod cells, which do night vision, are nearly blind to deep red."
  - q: "What is averted vision?"
    choices: ["Looking slightly to the side of a faint object so its light falls on rod-rich parts of the eye", "Closing one eye", "Looking through a filter"]
    ans: 0
    why: "The centre of the retina is packed with cones. A few degrees off-centre, rods dominate and are far more sensitive."
sources:
  - "Rods and cones, rhodopsin and dark adaptation: standard physiology texts; see for example Kolb, Fernandez and Nelson (eds.), Webvision, University of Utah"
---

**Module 3 · about 20 minutes · read first: [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/) · maths: no maths needed.** You'll be able to explain how the eye adapts to darkness, protect your night vision at the telescope, and use averted vision to see fainter objects.

<div class="bigidea">Your eyes take 20 to 40 minutes to reach full night sensitivity and one glance at a white screen undoes it; rods, red light and averted vision are the keys to seeing faint things.</div>

## 1. Why this matters

The difference between a light-adapted and a fully dark-adapted eye is several magnitudes: the difference between seeing a smudge and seeing a galaxy's spiral arms. It costs nothing and needs no gear, just patience and a red torch.

## 2. Two kinds of light sensor

The retina has two kinds of light-sensitive cell:

- **Cones** (about 6 million): work in bright light, see colour and fine detail, and are packed into the **fovea**, the small central spot you look *with*.
- **Rods** (about 100 million): far more sensitive, see no colour, and are spread outside the fovea, densest about 15° to 20° from the centre.

In darkness, rods rebuild their light-sensitive pigment, **rhodopsin**. This is slow: it takes 20 to 40 minutes to finish. A bright light bleaches the rhodopsin again in a second.

<!--fig:dark-adapt-->

Things to notice:

- In the first few minutes the cones improve, then level off.
- After about 8 minutes the rods overtake them, and keep improving far beyond what cones can do.
- A glance at a bright white screen sends you back to the start; dim red light costs you very little.

## 3. Protecting your night vision

- Arrive early and give your eyes **at least 20 minutes** before hunting faint objects.
- Use a **dim, deep-red torch** to read charts. Rods are nearly blind to wavelengths beyond about 620 nm.
- Turn phones to night or red mode, at the lowest brightness. (This site's red-light button, in the header, does exactly that.)
- Don't look at the Moon or planets through a big telescope just before a faint galaxy.


<div class="meaning">

<dl>
<dt>Rods</dt><dd>Very sensitive, colour-blind cells; packed away from the centre of the eye.</dd>
<dt>Cones</dt><dd>Colour cells in the centre (fovea); need more light.</dd>
<dt>Δm = 2.5 log₁₀(gain)</dt><dd>A sensitivity gain of 10,000 is about 10 magnitudes.</dd>
<dt>Physical meaning</dt><dd>The rods are like a camera set to a very high sensitivity that takes half an hour to warm up and is wiped by any bright flash. They sit away from the centre of your eye, so looking slightly to the side of a faint object (averted vision) puts its light onto them.</dd>
</dl>

</div>

<div class="myth">

**"Carrots give you night vision."** Vitamin A is needed to make rhodopsin, so a real deficiency harms night vision, but extra carrots do not improve normal eyes. The story was spread as British wartime cover for radar.

</div>

## 4. Averted vision

Because the fovea has almost no rods, a faint object looked at directly can vanish. Look **a little to one side**, about 8° to 16° away, usually towards your nose, and it pops back. Experienced observers do this all the time: the target sits in rod-rich retina while the eye stays pointed nearby. Gently tapping the telescope also helps, since the eye notices movement better than still light.

Your eyes during the first half hour outside:

<div class="steps">
<div class="step"><b>Minute 0.</b> Stepping out of a lit room, you see only the brightest stars. The pupil opens from about 2 mm to 6 or 7 mm within seconds.</div>
<div class="step"><b>Minutes 1 to 10.</b> The cones (colour cells) adapt first and level off.</div>
<div class="step"><b>Minutes 10 to 40.</b> The rods slowly rebuild their light-sensitive pigment, rhodopsin. Faint stars and the Milky Way appear.</div>
<div class="step"><b>Full adaptation.</b> You now see about 10,000 times fainter than in daylight, but in grey only.</div>
<div class="step"><b>Protect it.</b> Rods hardly respond to deep red light, so a dim red torch keeps your night vision. A white phone screen resets you in seconds.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** sensitivity is a ratio, so it is natural to measure it on a log scale, just like magnitudes.

**Size of the effect:** fully dark-adapted rods are about `$10^4$` (10,000) to `$10^6$` times more sensitive than the eye in daylight. In magnitudes,

```math
\Delta m = 2.5 \log_{10}(10^4) = 10 \text{ mag}
```

(This range includes the pupil opening up, from about 2 mm in daylight to 6 to 7 mm in the dark, a factor of about `$(7/2)^2 \approx 12$` in area, or 2.7 mag.)

**Averted vision** typically gains around 1 magnitude on faint targets: about 2.5 times less light needed.
</details>

## 5. Worked example

*Pupil gain.* At 20 years old a dark-adapted pupil can open to about 7 mm; by 60 it may only reach about 5 mm. The light collected goes as the area:

```math
\left(\frac{7}{5}\right)^2 = 1.96, \qquad \Delta m = 2.5\log_{10} 1.96 = 0.73
```

So an older observer loses about 0.7 magnitudes by eye. This also matters for binoculars and eyepieces (Lesson 4.3): an exit pupil larger than your own pupil wastes light.

## 6. Practice

<div class="problem" data-problem="pupil-gain"></div>

**More practice** (answers below):

1. A red torch reduces your limiting magnitude by 0.1 and a white phone screen by 2. How many times more light does a star need to be visible after the phone?
2. Why can colour be seen in bright planets but not in faint nebulae by eye?
3. Where in your field of view should you place a faint galaxy for averted vision?

<details>
<summary>Answers</summary>

1. 2 magnitudes is `$10^{0.8} \approx 6.3$` times.
2. Planets are bright enough for cones; faint nebulae only trigger rods, which can't see colour.
3. A little to one side, usually towards your nose, about 8° to 16° from where you look.
</details>

<div class="keypoints">

**Key points**

- Full dark adaptation takes 20 to 40 minutes, mostly the rods.
- Bright white light undoes it in seconds; use dim red light.
- Averted vision puts faint light onto the rods and gains about 1 magnitude.
- Night vision is in grey: faint nebulae look colourless to the eye.

</div>

**Try it on the real sky:** pick a Moon-free night with the [[dark-sky-calendar]], and switch this site to red light (header button) before you go out.

**New words:** *rods*, *cones*, *fovea*, *rhodopsin*, *dark adaptation*, *averted vision*.
