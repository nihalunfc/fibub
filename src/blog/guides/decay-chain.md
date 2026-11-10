---
title: "Radioactive decay chains: Bateman equations, ingrowth and equilibrium"
summary: "How a radioactive parent feeds its daughters, when each daughter peaks, and what secular and transient equilibrium mean, with a worked Ba-140 to La-140 example."
tools: [decay-chain, decay-calculator, gamma-shielding, counting-statistics]
updated: 2026-11-10
sources:
  - "Bateman, H. (1910), Proceedings of the Cambridge Philosophical Society 15, 423 to 427: the solution for a linear chain of radioactive decays."
  - "Ba-140 (about 12.8 days) and La-140 (about 1.68 days) half-lives are rounded general values as used on the tool page; check current evaluated nuclear data (for example NNDC) for real work."
---

When one radioactive nuclide decays into another that is also radioactive, the amount of the second one rises, peaks and then either settles into step with its parent or dies away. The [[decay-chain]] tool works all of that out for a parent and up to seven daughters. It shows the activity of every member at the time you choose, a chart of how each one grows in, when each daughter peaks and whether the chain reaches equilibrium. It is useful for physics and radiochemistry students, nuclear medicine staff planning when to draw off a daughter, and anyone dealing with radon and its products. For a single nuclide on its own, the [[decay-calculator]] is quicker; once you know the activity, size a shield with [[gamma-shielding]] or plan a measurement with [[counting-statistics]].

## What it is

Each radioactive nuclide has a **half-life**, the time for half of it to decay. Its **decay constant** is λ = ln 2 ÷ half-life, the fraction that decays per unit of time. The **activity** A = λ × N is the number of decays per second (in becquerels, Bq) from N atoms.

In a chain A → B → C → …, each daughter is made by the member before it and lost by its own decay:

dN_B/dt = λ_A N_A − λ_B N_B

For a parent with activity A₁(0) and no daughter at the start, the daughter's activity is:

A₂(t) = A₁(0) × λ₂ ÷ (λ₂ − λ₁) × (e^(−λ₁t) − e^(−λ₂t))

Harry Bateman wrote down the general solution for chains of any length in 1910, and these are the **Bateman equations**. The tool solves them in a form that still works when two half-lives are equal or very close.

What happens over time depends on the half-lives:

- **Secular equilibrium.** The parent lives at least 100 times longer than the daughter. After a few daughter half-lives the two activities match.
- **Transient equilibrium.** The parent lives longer, but not by that much. The daughter settles at a fixed ratio λ₂ ÷ (λ₂ − λ₁) above the parent, then both fall at the parent's pace.
- **No equilibrium.** The daughter outlives the parent, so it is left decaying on its own.

A daughter's activity peaks when it equals the rate it is being made. For a two-member chain that starts with the parent alone, that is at t = ln(λ₂ ÷ λ₁) ÷ (λ₂ − λ₁), where the two activity curves cross.

## How to use it

1. Pick an **example chain** from the list, or choose **Your own** and fill in the members. Editing any member switches the list to Your own.
2. For each member, set the **name**, **half-life** and its **unit**, the **starting activity**, and the **branching to next** in percent (the share of decays that feed the next member). The last member has no branching box.
3. Use **Add a daughter** or **Remove the last** to change the chain, from one member up to eight.
4. Choose the **activity unit** and **time unit**, then type the time for **Activities at time**.
5. Leave **Plot up to** blank for an automatic chart length, or give your own. Pick a logarithmic or linear **activity axis**, and set **Equilibrium within (%)**.
6. Read the table (activity, atoms, ratio to parent and equilibrium ratio), the peak and equilibrium facts, and the chart. Download the activities over time as CSV, or the report as PNG, PDF or Word.

## A worked example

Choose **Ba-140 → La-140**. The tool loads 1,000 MBq of barium-140 (half-life 12.8 d) and no lanthanum-140 (1.68 d). Set the time to **10 d**.

**Decay constants:**
- λ₁ = 0.6931 ÷ 12.8 d ≈ 0.05415 per day
- λ₂ = 0.6931 ÷ 1.68 d ≈ 0.4126 per day

**Parent at 10 d:** 1,000 MBq × e^(−0.5415) ≈ **581.9 MBq**.

**Daughter at 10 d:** 1,000 MBq × 0.4126 ÷ (0.4126 − 0.0542) × (e^(−0.5415) − e^(−4.126)) ≈ **651.2 MBq**. The daughter is already more active than its parent: the ratio is 651.2 ÷ 581.9 ≈ 1.119.

**Peak:** t = ln(0.4126 ÷ 0.05415) ÷ (0.4126 − 0.05415) ≈ **5.665 d**. At that moment both activities are about 735.8 MBq.

**Equilibrium:** 12.8 ÷ 1.68 is about 7.6, well under 100, so this is **transient equilibrium**. The final ratio is 12.8 ÷ (12.8 − 1.68) ≈ **1.151**. The tool reports the ratio is within 1 % of that after about **12.85 d**.

By 40 d both have fallen a long way, to about 114.6 MBq and 131.9 MBq, but the ratio holds at 1.151.

## Where it is used

- **Nuclear medicine.** Generators such as Mo-99 → Tc-99m are drawn off when the daughter is near its peak, often once a day.
- **Radon in homes and mines.** The short-lived products of radon-222 build up within hours and give most of the lung dose, so their ingrowth matters for measurement.
- **Fission products.** Pairs such as Ba-140 → La-140 and Te-132 → I-132 shape how activity changes after a reactor shutdown or a release.
- **Dating rocks and sediments.** The uranium series is in secular equilibrium in old material; a break in that equilibrium points to recent chemistry.
- **Lab sample planning.** Knowing when a daughter grows back after separation tells you when to count.

## Common mistakes

- **Leaving daughters at zero for an old sample.** Zero suits a fresh separation. For an aged source, give each member its present activity.
- **Forgetting branching.** If only part of the parent's decays make the daughter, set the percentage, or the daughter will come out too high.
- **Expecting equal activities in transient equilibrium.** The daughter ends up above the parent, by the factor λ₂ ÷ (λ₂ − λ₁) times the branching.
- **Mixing half-life units.** Each member has its own unit box; check that 1.68 is in days, not hours.
- **Using rounded example half-lives for real work.** Check current nuclear data first.

## Questions people ask

**Can a daughter's activity be higher than the parent's ever was?** Not in a simple two-member chain that starts with the parent alone: at the peak the daughter only equals the parent. It can exceed the parent later, in transient equilibrium, while both are falling.

**Why does the log axis help?** Activities in a long chain can differ by many powers of ten. On a log scale, steady decay is a straight line and equilibrium shows as parallel lines.

**Does atoms equal activity?** No. Atoms = activity ÷ λ, so a long-lived member has many more atoms for the same activity.
