---
name: Le Chatelier sandbox
num: 1087
shelf: learn
section: school-chemistry
title: "Le Chatelier's principle simulator: add, remove, squeeze or heat an equilibrium, Q vs K and ICE table"
summary: "A box of gas molecules at equilibrium: add or remove a gas, squeeze or expand the box, heat or cool it, or add a catalyst, and watch the molecules shift. Q against K shows which way it has to go, and an ICE table gives the numbers. Ends with fresh practice questions."
status: live
ads: false
order: 1087
icon: sliders
works: offline
updated: 2026-11-09
related: [equilibrium-solver, ph-scale-explorer, thermochemistry-calculator]
sources:
  - "Le Chatelier's principle, the equilibrium constant Kc, the reaction quotient Q and the van 't Hoff equation: general chemistry facts, written fresh for fibub. Gas constant R from CODATA (NIST)."
  - "Reaction enthalpies are rounded textbook values (ammonia −92, sulfur trioxide −197, dinitrogen tetroxide +57, hydrogen iodide about −10 kJ/mol). K values are made up for teaching and labelled as such."
flow:
  - { icon: flask, label: "Reaction" }
  - { icon: pointer, label: "Change it" }
  - { icon: sliders, label: "Q vs K" }
  - { icon: table, label: "ICE table" }
---

## What it does

At equilibrium a reaction still runs both ways, at the same rate, so the amounts stay fixed. Disturb it and it moves to undo part of the disturbance: that is Le Chatelier's principle. This page lets you disturb four gas reactions and watch them respond.

- **The box.** Molecules of each gas sit in a box (circles for reactants, squares for products; brown squares for NO₂). The box gets narrower when you squeeze it.
- **Changes.** Add or remove 0.5 mol of any gas, halve or double the volume, heat or cool by 50 K, or add a catalyst. **Start again** goes back to the first equilibrium.
- **Q against K.** Just after a change, the reaction quotient Q jumps away from K (or K itself moves, if you changed the temperature). The pointer shows Q sliding back to K as the molecules shift, and the headline says which way it went.
- **ICE table.** Initial concentrations just after the change, the change written as multiples of x, and the new equilibrium, with Kc worked out from them.

It follows Class 11 Chemistry (equilibrium: law of chemical equilibrium and the equilibrium constant, the reaction quotient, factors that affect equilibria: concentration, pressure, temperature and a catalyst, Le Chatelier's principle). Solve your own ICE problems with the [[equilibrium-solver]]; ionic equilibrium and pH continue in the [[ph-scale-explorer]].

## How to use it

1. Pick a reaction. The note under it says whether it is exothermic or endothermic and how the gas molecules compare on each side.
2. Tap a change. Watch the box and the Q–K pointer, and read why it moved.
3. Read the ICE table for the numbers.
4. Try the **Check yourself** questions: predict before you look.

## Worked example: squeezing the ammonia box

Start with N₂ + 3H₂ ⇌ 2NH₃ at 700 K in 1 L. At equilibrium there are about 0.514 mol N₂, 1.54 mol H₂ and 0.972 mol NH₃, and Kc = [NH₃]² / ([N₂][H₂]³) = 0.5 (a made-up value).

Tap **Squeeze**. The volume halves, so every concentration doubles. The top of the Kc expression has two concentration factors and the bottom has four, so Q falls to a quarter of K: 0.125. Q < K, so more ammonia forms: the headline reads "shifts right →". In the ICE table the N₂ and H₂ columns fall by x and 3x and NH₃ rises by 2x until Q is back to 0.5. Four gas molecules on the left became two on the right, which lowers the pressure: the system has partly undone the squeeze.

Now try the same with H₂ + I₂ ⇌ 2HI. Two molecules on each side, so Q and K change equally and nothing shifts.

## Heating is different

Adding, removing and squeezing change Q while K stays the same. Changing the temperature changes K itself. For an exothermic reaction (ΔH negative) K falls when you heat it, so the mixture moves left; for an endothermic one K rises and it moves right. A catalyst changes neither: it only gets you to equilibrium faster.

## Tips

- "Shift right" means more products and fewer reactants, until Q equals K again.
- Adding an unreactive gas at constant volume would not shift anything; only the reacting gases' concentrations count.
- Factories make ammonia at a moderate temperature even though cooler would give more at equilibrium: at low temperature it is far too slow.

## FAQ

**Are the K values real?** No. They are chosen so the shifts are easy to see. The directions and the effect of temperature follow the real reactions.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
