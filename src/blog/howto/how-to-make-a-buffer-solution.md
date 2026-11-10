---
title: "How to make a buffer solution of a given pH"
summary: "Pick a buffer whose pKa is close to your pH, work out the acid-to-base ratio, weigh the two forms and check with a pH meter. A worked acetate example."
tools: [buffer-recipe-calculator, solution-calculator, titration-curve]
updated: 2026-11-10
sources:
  - "Henderson–Hasselbalch equation and buffer capacity: standard acid–base chemistry."
  - "Acetic acid pKa (about 4.75 at 25 °C): a standard rounded textbook value."
---

To make a buffer, choose a weak acid whose pKa is within about one unit of the pH you want, then mix the acid and its conjugate base in the ratio that the Henderson–Hasselbalch equation gives for that pH. The [[buffer-recipe-calculator]] turns your pH, strength and volume into grams (and millilitres) of each form, and corrects the pKa for temperature and salt so the first try lands close.

## What you need

- **A target pH**, and the temperature you will use the buffer at.
- **A buffer concentration**, such as 50 mM or 100 mM. This is the total of the acid and base forms together.
- **The chemicals you actually have**, for example sodium acetate trihydrate rather than the dry salt. The form decides the mass.
- **A calibrated pH meter.**

## Step by step

A buffer works because it holds a weak acid (HA) and its conjugate base (A⁻) side by side, and each one soaks up added acid or base. The balance between the two sets the pH:

**pH = pKa + log₁₀([A⁻] ÷ [HA])**

Here pKa is the pH at which the acid has given up its proton in exactly half of its molecules, [A⁻] is the base-form concentration and [HA] the acid-form concentration. When the two are equal, the log term is zero and pH equals pKa. Each tenfold change in the ratio moves the pH by one unit.

Real solutions bend this a little. Ions in a salty solution behave as if they were slightly less concentrated, which lowers the apparent pKa (written pKa′). The calculator works this out from the ionic strength, a measure of how many charged particles are in the solution.

1. Open the buffer recipe calculator and choose the buffer from the list. Each entry shows its pKa, so pick one near your pH.
2. Type the target pH, the concentration in mM and the final volume in mL.
3. Type the temperature at which you will set the pH. In the second temperature box, type the temperature at which you will use it; the tool then reports how far the pH drifts there.
4. Under **Recipe**, choose either **Mix two forms** (the acid and base forms, no extra acid or base needed) or **Weigh one form, then add strong acid or base** (one chemical plus NaOH or HCl).
5. Follow the numbered steps it prints, dissolving in about 80 % of the volume.
6. Check the pH with your meter, nudge it with a few drops if needed, then make up to the final volume.

## A worked example

Suppose you want 500 mL of 100 mM acetate buffer at pH 5.0, set and used at 25 °C. On the shelf are glacial acetic acid (a liquid) and sodium acetate trihydrate.

**A plain first guess.** With the textbook pKa of 4.75:

log₁₀([A⁻] ÷ [HA]) = 5.0 − 4.75 = 0.25, so the ratio is 10^0.25 ≈ 1.78

That would mean about 64 % acetate and 36 % acetic acid.

**What the calculator gives.** Choose Acetate, pH 5.0, 100 mM, 500 mL, 25 °C in both temperature boxes, and **Mix two forms** with acetic acid as the first form and sodium acetate trihydrate as the second. The recipe reads:

- Measure **0.89 mL** (0.9346 g) of glacial acetic acid.
- Weigh **4.686 g** of sodium acetate trihydrate.

The facts below the recipe explain the difference from the first guess. The ionic strength is 68.9 mM, which pulls the apparent pKa down to 4.65. To reach pH 5.0 from 4.65, the base form has to make up about 69 % of the total, not 64 %.

The tool also reports the buffer capacity β as 49.4 mM per pH unit. That means it takes roughly 49 mM of strong acid or base to shift this buffer by one pH unit, and it is 86 % of the best a 100 mM buffer can manage (which happens right at its pKa′).

## Check your answer

- **The ratio.** 0.0344 mol of acetate ÷ 0.0156 mol of acetic acid is about 2.21. log₁₀(2.21) = 0.345, and 4.65 + 0.345 ≈ 5.00. The recipe is consistent with its own pKa′.
- **The total.** 0.0156 + 0.0344 = 0.0500 mol in 0.500 L, which is the 100 mM you asked for.
- **The masses.** 0.0156 mol × 60.05 g/mol ≈ 0.935 g of acetic acid; at a density of 1.049 g/mL that is 0.89 mL. 0.0344 mol × 136.08 g/mol ≈ 4.69 g of the trihydrate.

## Questions people ask

**Why does my pH meter read a bit different from the target?**
Tabulated pKa values are rounded, salts hold varying amounts of water, and electrodes are not perfect. A difference of a few hundredths is normal. Adjust with a little acid or base before topping up to volume.

**Does temperature matter for every buffer?**
Not equally. Acetate and phosphate barely move, while Tris and other amine buffers shift noticeably as they cool. If you set the pH at room temperature and use the buffer in a cold room, type both temperatures and read the drift.

**How do I make a stock of each form first?**
Use the [[solution-calculator]] to weigh out, say, 1 M stocks of each form, then mix the volumes in the recipe's ratio. To see how the finished buffer copes as acid or base is added, run it through the [[titration-curve]].
