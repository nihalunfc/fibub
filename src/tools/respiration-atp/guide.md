---
name: Respiration ATP ledger
num: 1398
shelf: learn
section: school-biology
title: "Respiration ATP ledger: glycolysis, Krebs cycle, electron transport, fermentation and RQ"
summary: "Step one glucose through glycolysis, the link reaction, the Krebs cycle and the electron transport system and watch the ATP, NADH, FADH₂, CO₂ and O₂ add up to 38 (or 32 with the newer count). Compare fermentation, and work out the respiratory quotient of any food from its formula. Class 10 and 11."
status: live
ads: false
order: 1398
icon: calculator
works: offline
updated: 2026-11-09
related: [calvin-c4, z-scheme, respirometry-calculator, enzyme-activity]
sources:
  - "Respiration bookkeeping per glucose (glycolysis 2 ATP + 2 NADH; link reaction 2 NADH + 2 CO₂; Krebs cycle 2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂; 3 ATP per NADH and 2 per FADH₂ for 38 in all, or about 2.5 and 1.5 in the newer count), fermentation, and RQ = CO₂ ÷ O₂: general biology."
  - "O₂ for complete oxidation of CₓHᵧO_z = x + y/4 − z/2: balancing the combustion equation. Tripalmitin's RQ of 51/72.5 = 0.703 matches the usual worked example (102 CO₂ / 145 O₂)."
  - "Checked in the tests by hand: 38 and 32 ATP per glucose, 10 NADH and 2 FADH₂, 6 CO₂ and 6 O₂; RQ 1 for glucose, 0.703 for tripalmitin, 1.33 for malic acid and 4 for oxalic acid. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: flask, label: "Glucose" }
  - { icon: orbit, label: "Stages" }
  - { icon: calculator, label: "Tally" }
  - { icon: check, label: "Check" }
---

## What it does

Cells get the energy in food by **respiration**: they take glucose apart step by step and store the energy as **ATP**. This page follows one glucose molecule through the four stages and keeps a running account, like a bank statement:

- **Glycolysis** in the cytoplasm: glucose → 2 pyruvate, 2 ATP (net) and 2 NADH.
- **Link reaction** in the mitochondrion: 2 pyruvate → 2 acetyl CoA, 2 CO₂ and 2 NADH.
- **Krebs cycle** (two turns): 4 CO₂, 6 NADH, 2 FADH₂ and 2 ATP.
- **Electron transport system**: NADH and FADH₂ give up their electrons, oxygen takes them at the end, and most of the ATP is made here.

A bar shows where the ATP comes from. Tick **No oxygen** to see fermentation (yeast making alcohol or muscle making lactic acid), which stops after glycolysis with just 2 ATP. Switch between the older **textbook count** (3 ATP per NADH, 2 per FADH₂: 38 in all) and the **newer count** (2.5 and 1.5: about 32).

The second box works out the **respiratory quotient (RQ)**, the CO₂ given out divided by the O₂ taken in, for any food written as a formula of carbon, hydrogen and oxygen.

It fits Class 10 Science (life processes: aerobic and anaerobic respiration) and Class 11 Biology (respiration in plants: glycolysis, fermentation, the TCA cycle, the electron transport system, the respiratory balance sheet and RQ). See where the sugar came from in [[calvin-c4]], and how ATP is made by a flow of H⁺ in the chloroplast too in [[z-scheme]].

## How to use it

1. Press **Next stage** to move through the four stages, and **Back** to go back. The big line names the stage and where it happens; the text explains it.
2. Read the running totals: ATP made directly, NADH, FADH₂, CO₂, O₂ and the total ATP so far.
3. Slide **Glucose molecules** to scale everything up.
4. Tick **No oxygen** and pick yeast or muscle to compare fermentation.
5. In **Respiratory quotient**, pick a food or type a formula such as C18H34O2.

## Worked example

After all four stages, one glucose has given **4 ATP directly**, **10 NADH** and **2 FADH₂**, released **6 CO₂** and used **6 O₂**. With the textbook count, the electron transport system turns these into 10 × 3 + 2 × 2 = 34 ATP, so the total is 4 + 34 = **38 ATP**. With the newer count it is 4 + 25 + 3 = **32 ATP**. Without oxygen the same glucose gives only **2 ATP**, 19 times less.

For RQ, glucose C₆H₁₂O₆ needs 6 + 12/4 − 6/2 = 6 O₂ and gives 6 CO₂: **RQ = 1**. The fat tripalmitin, C₅₁H₉₈O₆, needs 51 + 98/4 − 6/2 = 72.5 O₂ for 51 CO₂: **RQ = 0.703**. Oxalic acid, C₂H₂O₄, needs only 0.5 O₂ for 2 CO₂: **RQ = 4**.

## Tips

- NADH and FADH₂ are like cheques: the ATP is only "cashed" in the last stage, and only if oxygen is there.
- The 38 is a maximum. Real cells make less, because some energy is used to move things in and out of the mitochondrion.
- An RQ below 1 means the food has little oxygen of its own, so it needs more O₂ from outside: fats.

## FAQ

**Why do books give different totals (38, 36, 32, 30)?** The older count uses 3 ATP per NADH and 2 per FADH₂. Newer measurements give about 2.5 and 1.5, and the NADH from glycolysis can be worth less depending on how it enters the mitochondrion.

**Is CO₂ made in glycolysis?** No. In aerobic respiration it comes from the link reaction and the Krebs cycle; in alcoholic fermentation it is released when pyruvate becomes ethanol.

**What is the RQ when there is no oxygen?** With no O₂ taken in, the RQ cannot be worked out (it would be infinite), as in yeast fermenting sugar.
