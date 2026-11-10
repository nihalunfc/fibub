---
title: "How to dilute a stock solution using C1V1 = C2V2"
summary: "Multiply the concentration you want by the volume you want, divide by the stock's strength, and that is how much stock to take. Worked example and checks."
tools: [solution-calculator, concentration-converter]
updated: 2026-11-10
---

To dilute a stock, take V1 = C2 × V2 ÷ C1 of it and add solvent until the total reaches V2, the volume you want. The "Dilute a stock" box in the [[solution-calculator]] solves C1V1 = C2V2 for whichever of the four values you leave empty, and tells you how much diluent to add as well.

## What you need

- **The stock concentration (C1).** It is on the bottle or in your lab notebook.
- **The concentration you want (C2)**, in the same unit as the stock. If one is in M and the other in mM, change one first (multiply M by 1000 to get mM). The [[concentration-converter]] helps when the stock is labelled in % w/v or mg/mL and your recipe asks for molarity.
- **The final volume you want (V2).**

## Step by step

The rule comes from one fact: diluting adds solvent, never solute. The moles you take out of the stock bottle are the same moles that end up in the new container. Moles are concentration times volume, so:

**C1 × V1 = C2 × V2**

- C1 is the stock concentration and V1 the volume of stock you take.
- C2 is the new concentration and V2 the total volume after diluting.

Rearranged for the usual question, "how much stock do I take?":

**V1 = C2 × V2 ÷ C1**

and the solvent to add is **V2 − V1**.

With the tool:

1. Open the dilution calculator and scroll to **Dilute a stock (C1V1 = C2V2)**.
2. Type the stock concentration in C1, the final concentration in C2 and the final volume in V2.
3. Leave V1 empty. The answer line reads "Take … of stock and add … of diluent".
4. The numbers carry no unit of their own: they are in whatever volume unit you typed. If V2 was in mL, both answers are in mL.
5. Measure the stock into your container, then add the diluent and mix well.

Any box can be the empty one. Leave C2 empty to see what concentration a given mix gives you, or V2 empty to find how far a set amount of stock will stretch. If you type a C2 higher than C1, the tool stops you, because no amount of water can make a solution stronger.

For very large dilutions, such as 1 in 10,000, one step means measuring a tiny drop of stock. The **Serial dilution** box below plans a chain of smaller steps instead. Each tube gets the same volume of diluent, and the volume you carry from tube to tube is V ÷ (f − 1), where V is the volume left in each tube and f is the step factor. For 10-fold steps with 900 µL left in each tube, you move 100 µL along each time.

## A worked example

You have a 5 M sodium chloride stock and need 200 mL of 0.15 M saline for a cell wash.

Both concentrations are in M and the volume is in mL, so the units already match.

V1 = 0.15 M × 200 mL ÷ 5 M = 6 mL

Diluent = 200 mL − 6 mL = 194 mL

Typing 5 in C1, 0.15 in C2 and 200 in V2 gives **Take 6 of stock and add 194 of diluent**, both in mL. Measure 6 mL of the 5 M stock, add water to 200 mL in total, and mix.

Now a twist. The only clean bottle holds 250 mL, and you have already measured out 6 mL of stock. Clear C2, type 6 in V1 and 250 in V2. The tool gives a final concentration of **0.12**, in M. Working it by hand: 5 × 6 ÷ 250 = 0.12 M.

## Check your answer

- **The dilution factor.** C1 ÷ C2 is how many times weaker the new solution is: 5 ÷ 0.15 ≈ 33. V2 ÷ V1 must be the same number: 200 ÷ 6 ≈ 33. If the two ratios disagree, something was typed in the wrong box.
- **V1 must be smaller than V2.** If the stock volume you get is bigger than the final volume, you have swapped C1 and C2.
- **Count the moles.** 5 mol/L × 0.006 L = 0.030 mol, and 0.15 mol/L × 0.200 L = 0.030 mol. Same moles on both sides, as the rule promises.
- **Is the drop measurable?** If V1 comes out at 0.5 µL, your pipette cannot hit it accurately. Make an intermediate dilution first, or use the serial plan.

## Questions people ask

**Does C1V1 = C2V2 work for % solutions and mg/mL?**
Yes, for any concentration unit, as long as both concentrations use the same one. It works because the unit cancels out. It does not work if you mix units, such as % w/v on one side and M on the other.

**Should I add the stock to water, or water to the stock?**
For most salts and buffers it makes no difference to the result. For concentrated acids, always add the acid slowly to water, never water to the acid, because the heat released can make the mix spit.

**Why is my diluted solution not exactly the strength I expected?**
Small errors in measuring V1 matter most, because V1 is usually the smaller volume. Mixing two liquids can also change the total volume slightly, so for exact work, fill to the mark in a volumetric flask rather than adding a measured volume of diluent.
