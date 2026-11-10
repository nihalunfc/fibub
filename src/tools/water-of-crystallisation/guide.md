---
name: Crystallisation water
num: 1295
shelf: learn
section: school-chemistry
title: "Crystallisation water"
summary: "Heat blue copper sulfate, washing soda, Epsom salt, gypsum and other hydrated crystals in a virtual crucible, weigh after each heating until the mass stops changing, and work out x in Salt·xH₂O from the water lost. Also finds x from your own three weighings."
status: live
ads: false
order: 1295
icon: flask
works: offline
updated: 2026-11-09
related: [mole-bridge, formula-writer, ph-scale-explorer, molar-mass-calculator]
sources:
  - "Formulas of the common hydrates (CuSO₄·5H₂O, FeSO₄·7H₂O, Na₂CO₃·10H₂O, MgSO₄·7H₂O, CaSO₄·2H₂O, CoCl₂·6H₂O) and the rounded atomic masses used in school books are general chemistry. The heating curve is a simple made-up model so that the mass levels off; real crystals lose water in steps. Written for fibub."
  - "Checked against Python: 2.495 g of CuSO₄·5H₂O (249.5 g/mol) holds 0.900 g of water and leaves 1.595 g of CuSO₄, giving x = 5; and for every salt, heating to constant mass gives back its x."
flow:
  - { icon: flask, label: "Crystals" }
  - { icon: target, label: "Heat" }
  - { icon: table, label: "Weigh" }
  - { icon: calculator, label: "Find x" }
---

## What it does

Many salts form crystals with water built into them, called **water of crystallisation**. Blue copper sulfate is really CuSO₄·5H₂O: five water molecules for every CuSO₄. Heat the crystals and the water is driven off, leaving a white powder. Weigh before and after, and you can work out how many water molecules there were. This page runs that experiment:

- pick one of six hydrated salts and the mass of crystals,
- **Heat 1 minute and weigh**: the crystals change colour as they lose water, and the balance shows the new mass,
- keep going until two weighings in a row agree (**constant mass**), or press **Heat to constant mass**,
- the working shows the mass of water lost, the moles of water and of salt, and **x = moles of water ÷ moles of salt**,
- **Add water back** shows the reverse: white copper sulfate turns blue again and warms up,
- type your **own three weighings** from a real practical to get x.

It goes with the Class 10 chapter on **acids, bases and salts** (water of crystallisation, copper sulfate, washing soda, gypsum and plaster of Paris) and the Class 11 mole concept.

The mole steps are the same as in the [[mole-bridge]]; formulas of salts come from the [[formula-writer]], and how acidic or basic salt solutions are is shown on the [[ph-scale-explorer]].

## How to use it

1. Choose the **Crystals** and type the **Mass of crystals**.
2. Press **Heat 1 minute and weigh** several times. Each weighing goes into the table with the change from the one before.
3. When two weighings agree, the page says **constant mass reached** and gives x as a whole number.
4. Under **Work out x from your own results**, type the empty crucible, crucible with crystals, and crucible after heating to constant mass.

## A worked example

The page starts with 2.495 g of copper sulfate crystals in a 20.000 g crucible, so the first weighing is 22.495 g. After heating to constant mass the crucible weighs about 21.595 g.

- Water lost = 22.495 − 21.595 = 0.900 g, which is 0.900 ÷ 18 = 0.0500 mol.
- CuSO₄ left = 21.595 − 20.000 = 1.595 g, which is 1.595 ÷ 159.5 = 0.0100 mol.
- x = 0.0500 ÷ 0.0100 = **5**, so the crystals are CuSO₄·5H₂O.

Stop after only two minutes of heating and x comes out near 3, too small, because water is still in the crystals. That is why you heat to constant mass.

## Tips

- Let the crucible cool before weighing (in a real lab, in a desiccator), or it will pick up water from the air again.
- Heat gently: too strong and some salts break down further (iron(II) sulfate gives off choking gases), which makes x too big.
- Washing soda (Na₂CO₃·10H₂O) is about 63 % water by mass.

## Check yourself

Four fresh questions each time: the molar mass of a hydrate, its percentage of water, grams of water in a sample, and x from results. Nothing is saved.

## FAQ

**Do real crystals lose water smoothly like this?** No: copper sulfate loses its water in steps at different temperatures. The page uses a smooth made-up curve so the weighings level off; the final answer is the same.

**Is this a safe experiment to do?** Only in a school lab with a teacher, eye protection and gentle heating. Some of these salts are harmful if swallowed.

**Is this from the NCERT book?** It covers the same topic with fibub's own numbers. fibub is not part of NCERT.
