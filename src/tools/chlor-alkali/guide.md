---
name: Chlor-alkali process
num: 1296
shelf: learn
section: school-chemistry
title: "Chlor-alkali process: electrolysis of brine, what forms at each electrode, and how much (Faraday's laws)"
summary: "Watch ions move in an animated membrane cell as brine is electrolysed: chlorine at the anode, hydrogen and sodium hydroxide at the cathode. Read the half equations and the uses of each product, and at Class 12 level work out the grams and litres a current makes."
status: live
ads: false
order: 1296
icon: flask
works: offline
updated: 2026-11-09
related: [galvanic-cell, ph-scale-explorer, electroplating-calculator, soap-micelle]
sources:
  - "The chlor-alkali reactions (2Cl⁻ → Cl₂ + 2e⁻; 2H₂O + 2e⁻ → H₂ + 2OH⁻) and the uses of the products are standard school chemistry. The Faraday constant 96 485.332 12 C/mol is from CODATA (exact since the 2019 SI). Molar masses are the rounded school values. Written for fibub."
  - "Checked against Python: 10 A for 1 hour moves 0.37311 mol of electrons, making 13.2455 g of chlorine, 14.9245 g of sodium hydroxide and 4.477 L of each gas at 24 L/mol."
flow:
  - { icon: flask, label: "Brine" }
  - { icon: convert, label: "Electrodes" }
  - { icon: calculator, label: "Faraday" }
  - { icon: check, label: "Practise" }
---

## What it does

When electricity is passed through **brine** (a strong solution of common salt), three useful chemicals come out: **chlorine**, **hydrogen** and **sodium hydroxide**. Because it makes chlorine and an alkali, the industry is called the **chlor-alkali process**. This page shows it in a simple membrane cell:

- an animation of **Cl⁻ ions** moving to the positive electrode, **Na⁺ ions** crossing the membrane, **OH⁻ ions** forming at the negative electrode, and bubbles of chlorine and hydrogen,
- the reactions in words (Class 10) or as **half equations** (Class 12),
- what each product is used for, including **bleaching powder**,
- at the **Class 12** level, a calculator: set the **current**, the **time** and the **current efficiency**, and get the charge, the moles of electrons, and the grams and litres of chlorine, hydrogen and sodium hydroxide made.

It follows the Class 10 chapter on **acids, bases and salts** (sodium hydroxide from common salt) and the Class 12 chapter on **electrochemistry** (electrolysis and Faraday's laws).

The opposite of electrolysis, a cell that makes electricity, is in the [[galvanic-cell]] tool; how alkaline the sodium hydroxide is shows on the [[ph-scale-explorer]], and sodium hydroxide is what turns fats into soap in [[soap-micelle|how soap cleans]].

## How to use it

1. Watch the cell. **Pause** stops the animation; untick **Show ion labels** for a cleaner picture.
2. Read the steps under the picture. Switch to **Class 12** for the half equations and the calculator.
3. In **How much is made**, set **I** (amperes) and **t** (minutes) with the sliders or boxes, the **current efficiency**, and whether gas volumes use 24 L/mol (room conditions) or 22.4 L/mol (0 °C).

## A worked example

At Class 12 level the page starts with **10 A for 60 minutes**.

- Charge: 10 A × 3 600 s = 36 000 C.
- Electrons: 36 000 ÷ 96 485 = 0.37311 mol.
- Chlorine: half that, 0.18656 mol × 71 g/mol = **13.246 g**, which is 4.477 L at room temperature.
- Hydrogen: the same 0.18656 mol, only 0.373 g, but also 4.477 L.
- Sodium hydroxide: one per electron, 0.37311 mol × 40 g/mol = **14.925 g**.

To make 40 g (one mole) of sodium hydroxide at 10 A takes 96 485 ÷ 10 s, about 2.68 hours.

## Tips

- In electrolysis, the positive electrode is the **anode** and attracts negative ions (anions); the negative electrode is the **cathode**.
- Sodium is not formed at the cathode from brine: water is easier to reduce, so hydrogen comes off.
- Doubling the current or the time doubles every amount; that is Faraday's first law.

## Check yourself

Four fresh questions each time: one about what forms where, then moles of electrons and grams of chlorine and sodium hydroxide for a current and time. Nothing is saved.

## FAQ

**Why is there a membrane?** It keeps the chlorine away from the sodium hydroxide. If they mix, they react (to make bleach), and the hydrogen and chlorine must also be kept apart.

**Can I try this at home?** No. Chlorine is a toxic gas. This is an industrial process; school demonstrations are done by a teacher with care.

**Is this from the NCERT book?** It covers the same topic with fibub's own drawings and numbers. fibub is not part of NCERT.
