---
title: "How to calculate resistors in series and parallel (worked example)"
summary: "Add resistors in series; add the reciprocals for resistors in parallel. A worked 9 V circuit with the total resistance, the current in every branch and quick checks."
tools: [series-parallel, ohms-law-lab, resistor-colour-code]
updated: 2026-11-10
sources:
  - "Series and parallel resistance formulas, Ohm's law V = IR and P = VI: standard school physics."
---

For resistors in series, add them: R = R₁ + R₂ + ... For resistors in parallel, add their reciprocals and flip the answer: 1/R = 1/R₁ + 1/R₂ + ... The [[series-parallel]] page lets you drag resistors into place and writes out each of these steps with your own values, then finds the current and voltage for every resistor.

## What you need

- **The value of each resistor** in ohms (Ω). If you only have the coloured bands, the [[resistor-colour-code]] reads them.
- **A clear picture of the circuit**: which resistors sit one after another on a single path (series), and which sit side by side between the same two points (parallel).
- **The battery voltage**, if you also want the current.

## Step by step

**Series** means one path. The current has no choice: it goes through every resistor in turn, so the resistances simply pile up.

**R_series = R₁ + R₂ + R₃ + ...**

**Parallel** means several paths between the same two junctions. Each extra path gives the current another way through, so the total gets smaller, not bigger.

**1/R_parallel = 1/R₁ + 1/R₂ + ...**

For exactly two in parallel, a shortcut gives the same answer: R = (R₁ × R₂) ÷ (R₁ + R₂).

For a mixed circuit, work from the inside out:

1. Find each group that is purely parallel and replace it with its single equivalent value.
2. Now everything left is in series. Add it up for the total, R.
3. Use Ohm's law for the current from the battery: I = V ÷ R.
4. Every series resistor carries that whole current. The voltage across it is I × R for that resistor.
5. The parallel group gets the voltage left over. Each branch then takes I = V ÷ R for its own resistor.

With the tool:

1. Choose the **Battery** voltage from the list.
2. In the table under the picture, type each resistance in ohms and set it to Series, Parallel or Not used. You can also drag the boxes in the picture: the top wire is series, the box below is parallel, and the tray at the bottom takes a resistor out.
3. Read **Worked out step by step**. It shows the series sum, the parallel reciprocal sum, the total, the current and the way the current splits.
4. Check the table below the steps for the voltage, current and power of each resistor.

The page has room for four resistors: any number on the series wire, plus one parallel group.

## A worked example

A 9 V battery is connected to a 4 Ω resistor, followed by a 6 Ω and a 12 Ω resistor side by side.

**Parallel part first.**

1/R_p = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 0.25 per Ω

R_p = 1 ÷ 0.25 = **4 Ω**

The shortcut agrees: (6 × 12) ÷ (6 + 12) = 72 ÷ 18 = 4 Ω.

**Total resistance.** The 4 Ω resistor is in series with that 4 Ω group:

R = 4 + 4 = **8 Ω**

**Current from the battery.** I = 9 ÷ 8 = **1.125 A**.

**Voltages.** The series resistor takes 1.125 × 4 = 4.5 V. That leaves 9 − 4.5 = 4.5 V across the parallel group.

**Branch currents.** Through 6 Ω: 4.5 ÷ 6 = 0.75 A. Through 12 Ω: 4.5 ÷ 12 = 0.375 A.

**Power.** P = V × I = 9 × 1.125 = 10.125 W from the battery.

To see this on the page: pick 9 V, set R1 to 4 and Series, R2 to 6 and Parallel, R3 to 12 and Parallel, and R4 to Not used. The large line reads R = 8 Ω, I = 1.13 A (rounded to three figures). The steps list 1/R_p = 1/6 + 1/12 = 0.25 per Ω, and the split as 750 mA through R2 and 375 mA through R3, with a power of 10.1 W.

## Check your answer

- **Series totals are bigger than the biggest part.** 8 Ω is more than 4 Ω. Good.
- **Parallel totals are smaller than the smallest branch.** 4 Ω is less than 6 Ω. If your parallel answer is larger than every branch, you forgot to flip the reciprocal at the end.
- **The currents join up.** 0.75 + 0.375 = 1.125 A, the same as the battery current. Charge going into a junction must come out.
- **The voltages add up around the loop.** 4.5 V + 4.5 V = 9 V, the battery voltage.
- **The lower resistance takes more current.** The 6 Ω branch carries twice what the 12 Ω branch does, because its resistance is half.

## Questions people ask

**What is the rule for two equal resistors in parallel?**
The total is half of one of them. Two 10 Ω resistors in parallel make 5 Ω. Three equal ones make a third, and so on.

**Why are home appliances wired in parallel?**
Each appliance then gets the full supply voltage and can be switched on or off without the others noticing. In series, turning one off would break the path for all of them.

**Where does Ohm's law fit in?**
Every step after the total uses V = I × R. If that formula is new to you, the [[ohms-law-lab]] lets you slide the voltage and read the meters until it feels natural.
