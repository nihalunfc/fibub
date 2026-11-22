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
sources: []
---

**Module 4 · about 25 minutes · division.** You'll be able to work out magnification, exit pupil, true field and focal ratio, and choose a sensible set of eyepieces for any telescope.

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

## 4. Worked example

*A 127 mm f/12 Maksutov (1,500 mm) with a 25 mm eyepiece of 52° apparent field.*

- Magnification: `$1500/25 = 60\times$`.
- Exit pupil: `$127/60 = 2.1$` mm.
- True field: `$52/60 = 0.87^\circ$`: the full Moon fits with room to spare, but the Pleiades (about 2°) do not.

The longest focal length eyepiece that fits a standard 1.25-inch barrel shows at most about 0.9° on this telescope, which is why such telescopes are loved for the Moon and planets but not for big star fields.

## 5. Practice

1. What eyepiece gives 50× on an 800 mm telescope?
2. A 100 mm f/6 telescope with a 6 mm eyepiece: what are the magnification and exit pupil?
3. Why does a magnification of 600× on a 70 mm telescope show only a dim blur?

<details>
<summary>Answers</summary>

1. `$800/50 = 16$` mm.
2. `$F = 600$` mm, `$M = 100\times$`, exit pupil `$100/100 = 1$` mm.
3. The useful maximum is about `$2 \times 70 = 140\times$`. Beyond that the exit pupil is under 0.12 mm, so the image is very dim, and it only enlarges the blur from diffraction and the air: "empty magnification".
</details>

**Try it with real numbers:** test any telescope and eyepiece combination with the [[telescope-calculator]].

**New words:** *focal ratio (f-number)*, *magnification*, *exit pupil*, *apparent field*, *true field*, *empty magnification*.
