---
title: "Focal length, f-ratio and magnification"
summary: "Magnification is the telescope's focal length divided by the eyepiece's. The exit pupil and true field follow from it. Learn to pick eyepieces that give bright, wide, sharp views instead of empty magnification."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A 1,200 mm telescope with a 10 mm eyepiece magnifies how many times?"
    choices: ["12×", "120×", "1,200×"]
    ans: 1
    why: "Magnification = 1200 ÷ 10 = 120."
  - q: "A 150 mm telescope at 30× has what exit pupil?"
    choices: ["5 mm", "30 mm", "0.2 mm"]
    ans: 0
    why: "Exit pupil = aperture ÷ magnification = 150 ÷ 30 = 5 mm."
  - q: "An eyepiece has a 68° apparent field and gives 100×. What is the true field?"
    choices: ["0.68°", "6.8°", "68°"]
    ans: 0
    why: "True field ≈ apparent field ÷ magnification = 68 ÷ 100 = 0.68°."
sources:
  - "Hecht, E. (2017), Optics, 5th ed., Pearson (thin lens equation, diffraction)"
  - "Rutten, H. and van Venrooij, M. (1988), Telescope Optics: Evaluation and Design, Willmann-Bell"
---

**Module 4 · about 25 minutes · read first: [4.1 How lenses and mirrors make an image](/learn/courses/sky-watching/lenses-mirrors/), [4.2 Aperture: the bucket that catches light](/learn/courses/sky-watching/aperture/) · maths: division.** You'll be able to work out magnification, exit pupil, true field and focal ratio, and choose a sensible set of eyepieces for any telescope.

<div class="bigidea">Magnification is the telescope's focal length divided by the eyepiece's, and the exit pupil and true field follow from it; good eyepiece choices give bright, wide, sharp views instead of empty magnification.</div>

## 1. Why this matters

The same telescope can show a whole star cluster or a close-up of one crater on the Moon, depending on the eyepiece. Picking eyepieces well matters more than most accessories, and the same numbers (focal length, focal ratio, field) carry straight over to cameras in Module 6.

## 2. The numbers

- **Focal length** `$F$` of the telescope (Lesson 4.1), and `$f_e$` of the eyepiece.
- **Focal ratio** `$N = F/D$`, the telescope's "f-number". f/4 to f/6 is "fast" (short tube, wide fields), f/10 and above "slow" (long focal length, high power is easy).
- **Magnification** `$M = F/f_e$`: swap eyepieces to change it.
- **Exit pupil** `$D/M$`: the width of the beam of light leaving the eyepiece. It should fit your eye's pupil.
- **True field**: the patch of sky you see, about the eyepiece's **apparent field** (its advertised angle, often 50° to 82°) divided by `$M$`.

<!--fig:eyepiece-view-->

Things to notice:

- A long-focal-length eyepiece gives low power, a big exit pupil and a wide true field, ideal for finding objects and for big clusters.
- Short eyepieces give high power: the Moon overflows the field, and the image dims as the exit pupil shrinks.

Try three eyepieces on a 200 mm f/6 telescope (focal length 1,200 mm):

<div class="steps">
<div class="step"><b>32 mm eyepiece.</b> 1200/32 = 38×. Exit pupil 200/38 = 5.3 mm: bright and wide, about 1.3° of sky. Great for star clusters and galaxies.</div>
<div class="step"><b>12 mm eyepiece.</b> 100×. Exit pupil 2 mm: good for small nebulae and the Moon.</div>
<div class="step"><b>6 mm eyepiece.</b> 200×. Exit pupil 1 mm: planets and close double stars on a steady night.</div>
<div class="step"><b>2.5 mm eyepiece.</b> 480×, exit pupil 0.4 mm: dim and blurry. That is empty magnification.</div>
<div class="step"><b>Rule of thumb.</b> Useful powers run from about D/7 to 2D: here 30× to 400×, and the air rarely allows more than 250×.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Magnification:**

```math
M = \frac{F}{f_e}
```

**Exit pupil** (in mm):

```math
d_\text{exit} = \frac{D}{M} = \frac{f_e}{N}
```

The second form shows that the exit pupil depends only on the eyepiece and the focal ratio: a 10 mm eyepiece on any f/5 telescope gives a 2 mm exit pupil.

**True field:** `$\theta_\text{true} \approx \theta_\text{apparent} / M$`.

**Useful range:** lowest power about `$D/7$` (7 mm exit pupil), highest about `$2D$` in mm (0.5 mm exit pupil), and the air usually limits you to 200× to 300× whatever the aperture.

**Try it:** a 200 mm f/6 (1,200 mm) Dobsonian: lowest useful power `$200/7 \approx 29\times$` (a 41 mm eyepiece); highest `$400\times$` (a 3 mm eyepiece).
</details>

## 3. A starter set of eyepieces

Aim for exit pupils of roughly **5 mm** (wide views, finding), **2 to 3 mm** (most galaxies and clusters), **1 mm** (planets, double stars, planetary nebulae) and **0.5 to 0.7 mm** (the Moon and planets on the best nights). On an f/5 telescope that means eyepieces of about 25 mm, 12 mm, 5 mm and 3 mm; on an f/10 telescope, twice those focal lengths.


<div class="meaning">

<dl>
<dt>M = F / f<sub>e</sub></dt><dd>Magnification: telescope focal length over eyepiece focal length.</dd>
<dt>d<sub>exit</sub> = D / M</dt><dd>Exit pupil: width of the beam leaving the eyepiece.</dd>
<dt>True field ≈ apparent field / M</dt><dd>How much sky you see.</dd>
<dt>Physical meaning</dt><dd>The telescope makes a small image at its focus; the eyepiece is a magnifying glass for that image. A short eyepiece is a stronger magnifying glass. But the light is fixed by the aperture, so the more you spread it, the dimmer each part gets.</dd>
</dl>

</div>

<div class="myth">

**"More magnification always shows more detail."** Above about 2× the aperture in mm, or whatever the air allows, the image only gets bigger, dimmer and blurrier. Experienced observers spend most of their time at low and medium power.

</div>

## 4. Worked example

*A 127 mm f/12 Maksutov (1,500 mm) with a 25 mm eyepiece of 52° apparent field.*

- Magnification: `$1500/25 = 60\times$`.
- Exit pupil: `$127/60 = 2.1$` mm.
- True field: `$52/60 = 0.87^\circ$`: the full Moon fits with room to spare, but the Pleiades (about 2°) do not.

The longest focal length eyepiece that fits a standard 1.25-inch barrel shows at most about 0.9° on this telescope, which is why such telescopes are loved for the Moon and planets but not for big star fields.

## 5. Practice

<div class="problem" data-problem="exit-pupil"></div>

**More practice** (answers below):

1. What eyepiece gives 50× on an 800 mm telescope?
2. A 100 mm f/6 telescope with a 6 mm eyepiece: what are the magnification and exit pupil?
3. Why does a magnification of 600× on a 70 mm telescope show only a dim blur?

<details>
<summary>Answers</summary>

1. `$800/50 = 16$` mm.
2. `$F = 600$` mm, `$M = 100\times$`, exit pupil `$100/100 = 1$` mm.
3. The useful maximum is about `$2 \times 70 = 140\times$`. Beyond that the exit pupil is under 0.12 mm, so the image is very dim, and it only enlarges the blur from diffraction and the air: "empty magnification".
</details>

<div class="keypoints">

- M = F / f<sub>e</sub>: swap eyepieces to change power.
- Exit pupil = D / M = f<sub>e</sub> / N; 2 to 6 mm suits most targets.
- True field ≈ apparent field / M.
- Useful magnification is about D/7 to 2D (D in mm).

</div>

**Try it with real numbers:** test any telescope and eyepiece combination with the [[telescope-calculator]].

**New words:** *focal ratio (f-number)*, *magnification*, *exit pupil*, *apparent field*, *true field*, *empty magnification*.
