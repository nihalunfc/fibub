---
name: Fission chain reaction
num: 2255
shelf: learn
code: L341
section: school-physics
title: "Fission chain reaction: enrichment, control rods, moderator and the multiplication factor k"
summary: "Fire one neutron into a grid of uranium-235 nuclei and watch the chain grow or die out as you change enrichment, control rods and moderator, with k and generation counts shown."
status: live
ads: false
order: 2255
icon: orbit
works: offline
updated: 2026-11-16
related: [decay-dice, binding-energy, decay-chain]
sources:
  - "Nuclear fission, chain reactions, control rods, moderators and the multiplication factor k, as in GCSE physics (atomic structure and nuclear energy), A-level nuclear physics, Ontario SPH4U/SNC2D modern physics and NGSS HS-PS1-8. Each U-235 fission releases 2 or 3 neutrons (average 2.43 in the model). The chances in the model (fission 12 % per U-235 square met by a fast neutron, 45 % for a slow one, 60 % absorbed on crossing a rod) are fibub's own teaching values, not reactor data. Random numbers are seeded so a run can be repeated; checked in tests/curr-physics.mjs. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Fuel" }
  - { icon: target, label: "Fire" }
  - { icon: chart, label: "Watch k" }
  - { icon: check, label: "Quiz" }
---

## What it does

When a uranium-235 nucleus absorbs a neutron it splits, gives out energy and releases two or three new neutrons. If enough of those hit other nuclei, the splitting spreads: a **chain reaction**. If too few do, the chain dies out.

The page shows a grid of nuclei, a few of them U-235. You fire one neutron in the middle and watch each **generation** of neutrons move, hit and split nuclei. The multiplication factor **k** is the number of neutrons in one generation divided by the number in the one before. The page labels the chain subcritical (k below 1), critical (about 1) or supercritical (above 1). After this, look at [[decay-dice]] for random decay, [[binding-energy]] for where the energy comes from and [[decay-chain]] for what the products do next.

## How to use it

1. Set the fraction of U-235 and the number of control rods, and tick the moderator if you want it.
2. Press Fire a neutron. The generations play one after another, or press Next generation to step by hand.
3. Press Run it through to jump to the end of the chain.
4. Read the generation, the neutron count and k under the picture, and the bars below it.
5. Change a setting, fire again and compare. Answer the quiz at the bottom.

## What each setting does

- **Fraction of U-235:** how many of the nuclei can split. The rest are U-238 and similar, which mostly just get in the way.
- **Control rods:** dark columns that absorb neutrons crossing them. More rods lower k.
- **Moderator:** slows neutrons so each is much more likely to split a U-235 nucleus, which raises k.
- **Estimate of k:** an average over hundreds of neutrons, steadier than one random run.

## Worked example

Suppose generation 3 has 12 neutrons and generation 4 has 18. Then k = 18 / 12 = 1.5, which is supercritical, and the chain grows by half each generation. With k = 2 starting from one neutron you get 1, 2, 4, 8, 16, so generation 5 has 2 to the 5, or 32, neutrons. A power station keeps k at 1 using control rods, so the number of neutrons stays steady.

## FAQs

**Why is every run slightly different?** Each neutron goes in a random direction and the chances are random. The page uses a seeded generator, so the first run with a set of settings repeats exactly.

**Is this how a real reactor behaves?** It shows the ideas only. Real reactors use delayed neutrons, fuel geometry and many safety systems.

**Why does the chain sometimes die at the very start?** One neutron is a small sample. A supercritical set-up can still fizzle out by chance in the first generation.
