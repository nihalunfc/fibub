---
name: Radioactive decay dice
num: 1071
shelf: learn
code: L35
section: school-physics
title: "Radioactive decay dice: throw hundreds of dice, remove the sixes, and watch a half-life appear; compare with N = N₀ e^(−λt)"
summary: "Model radioactive decay with dice or coins: throw them all, remove every six, and repeat. A half-life appears from pure chance. Compare your counts with N = N₀ e^(−λt), and see why big samples follow the curve and small ones wobble."
status: live
ads: false
order: 1071
icon: chart
works: offline
updated: 2026-11-09
related: [binding-energy, decay-calculator, decay-chain, counting-statistics]
sources:
  - "Radioactive decay law N = N₀ e^(−λt), half-life t½ = ln 2 / λ, and the dice model of decay (each die is removed with chance p per throw, so λ = −ln(1 − p)): standard physics."
  - "Checked against an independent Python calculation and against the average of 400 simulated runs, written for the tests."
flow:
  - { icon: target, label: "Throw" }
  - { icon: scissors, label: "Remove" }
  - { icon: chart, label: "Half-life" }
  - { icon: check, label: "Check" }
---

## What it does

An unstable nucleus can decay at any moment, and nothing about its past tells you when. Each one is like a die: at every throw it has the same chance of showing a six. This page gives you hundreds of dice. Each **throw**, every die that shows a six is removed (it has "decayed"). The number left falls by about one sixth each time, so it halves again and again at a steady rate: a **half-life** appears out of pure chance. The page plots your counts against the smooth law **N = N₀ e^(−λt)**, measures the half-life from your own throws, and lets you change the number of dice and the chance of removal (coins, ordinary dice, 10-sided and 20-sided dice).

It follows the school topic Class 12 Physics, Nuclei (radioactivity, the law of radioactive decay, decay constant, half-life and mean life). Next, [[binding-energy]] explains why some nuclei are unstable, [[decay-calculator]] works with real half-lives, [[decay-chain]] follows one nucleus decaying into the next, and [[counting-statistics]] handles the randomness of real counts.

## How to use it

1. Choose how many dice to **start with** (50 to 1,000) and what removes a die (a coin's heads, a die's six, and so on).
2. Press **Throw once**, or **Keep throwing** to throw every half second (press **Stop** to pause).
3. The grid shows the dice: still in play, just removed, and gone. The graph shows the count after each throw (dots) and the smooth curve.
4. Read the **half-life from your throws** (when half had gone) next to the **expected half-life** ln 2 / λ.
5. **Start again** to try another run; the result is a little different every time.

## Worked example

With 600 ordinary dice, each die has p = 1/6 chance of being removed per throw. The decay constant is λ = −ln(1 − 1/6) = 0.1823 per throw (close to p itself), so the half-life is t½ = 0.6931 / 0.1823 = 3.802 throws. After 4 throws you expect 600 × e^(−0.1823 × 4) = 289.4 dice left; a real run gives a number near that, often within about 12 either way. After 8 throws (about two half-lives) you expect 139.5, roughly a quarter.

With coins (p = 1/2), λ = ln 2 and the half-life is exactly one throw. With 20-sided dice (p = 1/20) it is 13.51 throws.

## Check yourself

Five questions, fresh each time: the number left after a few half-lives, the half-life from a decay constant, the fraction left after a time, a coin-throw question, and whether you can predict which die goes next. Nothing is saved.

## Tips

- Dice have no memory: a die that has survived ten throws is no more likely to go next time. Nuclei are the same, which is why the curve is exponential.
- The smaller the group, the bigger the wobble around the curve. Real samples hold so many nuclei that their counts follow the curve almost exactly.
- The mean life (average time a die lasts) is 1/λ, about 5.5 throws for a die: longer than the half-life.

## FAQ

**Why is λ not exactly 1/6?** The throws are separate steps. The exact link is (1 − p) = e^(−λ), so λ = −ln(1 − p) = 0.1823; for small p it is very close to p.

**Is decay really random?** Yes. Quantum physics says there is no hidden clock in a nucleus; only the probability per second is fixed.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
