---
name: Galaxy morphology practice
num: 214
shelf: science
section: galactic-and-extragalactic-astronomy
title: "Galaxy classification practice: Hubble types E0 to E7, S0, Sa to Sc and barred SBa to SBc, with a quiz and explanations"
summary: "Practise sorting galaxies into Hubble types on pictures the page draws for you: ellipticals E0 to E7, lenticulars, spirals and barred spirals, and irregulars. A quiz explains every answer (bulge size, how tightly the arms wind, the bar, ellipticity 10(1 − b/a)), and an explorer has a slider for each setting."
status: live
ads: true
order: 214
icon: telescope
works: offline
updated: 2026-11-09
related: [rotation-curve-fitter, redshift-calculator, cosmology-calculator, fits-viewer, magnitude-flux-converter]
sources:
  - "Every galaxy picture is drawn by the page from made-up settings: a Sérsic profile for ellipticals and bulges, an exponential disc, logarithmic spiral arms, a bar and knots of young stars. They are not photos of real galaxies."
  - "The class boundaries (bulge-to-total 0.35 and 0.15, arm pitch 12° and 20°, bar strength 0.35) are rounded teaching values made up by fibub; real classifiers judge by eye. Ellipticity classes use the general rule En with n = 10(1 − b/a)."
  - "The Sérsic maths (b_n from the incomplete gamma function, total light, light inside a radius) and a drawn elliptical are checked in the tests against SciPy and NumPy."
flow:
  - { icon: telescope, label: "Look" }
  - { icon: target, label: "Pick type" }
  - { icon: book, label: "Cues" }
  - { icon: chart, label: "Score" }
---

## What it does

Sorting galaxies by shape is one of the first skills in extragalactic astronomy, and the only way to learn it is to look at many examples. This page draws the examples for you, as many as you like, and tells you why each one belongs where it does.

- **Quiz.** The page shows a galaxy and you pick its type. With *Main types* the answers are elliptical (E), lenticular (S0), spiral (S), barred spiral (SB) and irregular (Irr). With *Detailed* you also give the ellipticity class E0 to E7 and the spiral stage a, b or c. After each answer the page says what it was and lists the cues: how big the bulge is, how tightly the arms wind, whether a bar crosses the middle, how many knots of young stars there are, and for ellipticals the sum 10 × (1 − b/a).
- **Score.** A running score and a table of true types against your answers show which types you mix up. It lives only while the page is open.
- **Round number.** The same round number always gives the same galaxies in the same order, so a teacher can give the whole class one round.
- **Explore.** Start from any type and move the sliders: axis ratio, Sérsic index, bulge-to-total light, arm pitch and number, bar strength and length, knots, tilt, turn and sky noise. The page says which type the settings look like and why.
- **Downloads.** Save any picture as a PNG, the answers as a CSV, or a report as an image, PDF or Word file.

Once you can tell the types apart, weigh a spiral with the [[rotation-curve-fitter|galaxy rotation curve fitter]] and find how far away it is with the [[redshift-calculator|redshift calculator]].

## How the pictures are made

Ellipticals and bulges follow a Sérsic profile, I(R) = Ie·exp(−b[(R/Re)^(1/n) − 1]), where b is chosen so that half the light lies inside the effective radius Re (b = 7.669 for n = 4). Discs fade exponentially, spiral arms follow logarithmic spirals r = r0·e^(θ·tan φ) with pitch angle φ, and the arms only move light around the disc, so the bulge-to-total light you set is what the picture holds. Bars are flat ellipses four times longer than wide, with the arms starting at their ends. A tilted disc looks narrower by the factor √(cos² i + 0.12² sin² i). Knots of young stars are tinted blue-white and old starlight warm yellow, and Gaussian sky noise is laid on top.

## How to use it

1. **Look.** Check the overall shape first: smooth and featureless, a disc, arms, or patchy.
2. **Pick the type.** Tap your answer. Switch *Answers* to *Detailed* once the main types feel easy.
3. **Read the cues.** The right answer is ringed in green and yours in red if it was wrong. Read why.
4. **Watch the score.** Tap *Next galaxy*. The table shows where your mistakes cluster.

## Worked example

Open **Explore**. The page starts from an Sb with seed 7 and says **Looks like Sb**: bulge-to-total **0.25 set, 0.25 in the picture**, **45 %** of the light in the arms and knots, and the disc tilted 30° so it **looks b/a 0.87**. The arms have a pitch of 16°, inside the b range of 12° to 20°. Move *Bar strength* to 0.35 or more and it becomes **SBb**; move the bulge-to-total up to 0.40 and it reads **Sab**, halfway between the early and middle stages.

Now pick **E4** under *Start from a type*. The axis ratio is 0.60, so the ellipticity is **10 × (1 − 0.60) = 4.0 → E4**, and measuring the picture's own light gives **b/a 0.60 at 20°**. For n = 4 the facts show **Sérsic b 7.669**, and **94.4 %** of the light falls inside the picture, the rest being the faint wide wings an n = 4 profile is known for.

## Tips

- Ellipticity is about the shape you see on the sky. A round-looking E0 may be a flattened galaxy seen end-on.
- Tilt does not change a spiral's type. Judge the bulge and the arms, not how flat the disc looks.
- The bar is the hardest cue at high tilt; look for a straight feature with arms leaving its ends.
- S0 and elliptical are easiest to mix up face-on. Look for a disc that ends more sharply than an elliptical's slow fade.

## FAQ

**Are these real galaxies?** No. Every picture is drawn by the page from made-up settings, so there are no copyright or catalogue limits and the true answer is always known.

**Are the class boundaries official?** No. Astronomers classify by eye, and published schemes differ. The page uses rounded teaching values (written in the cues) so that every answer can be explained.

**Is my score saved?** No. It is kept only while this page is open, and nothing is sent anywhere. Reloading starts again.

**Why does an E7 never get flatter?** No elliptical flatter than about b/a = 0.3 is seen, so the classes stop at E7.

**Does it work offline?** Yes. Once the page has loaded, the drawing and the quiz run entirely in your browser.
