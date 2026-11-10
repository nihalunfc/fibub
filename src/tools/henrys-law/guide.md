---
name: Henry's law
num: 1435
shelf: learn
code: L284
section: school-chemistry
title: "Henry's law"
summary: "See Henry's law p = KH x at work. Pressurise a bottle of soda, warm it, then open it and watch the CO₂ escape. Compare how well CO₂, oxygen and nitrogen dissolve, and see why divers get the bends and climbers run short of oxygen."
status: live
ads: false
order: 1435
icon: flask
works: offline
updated: 2026-11-09
related: [colligative-properties, gas-law-calculator, kinetic-theory, concentration-converter]
sources:
  - "Henry's law p = KH x and the rise of KH with temperature (van 't Hoff form KH(T) = KH(298) e^(C(1/298 − 1/T))) are standard physical chemistry. The KH values (CO₂ 1.7, O₂ 35, N₂ 76 kbar at 25 °C) and temperature coefficients (2400, 1700, 1300 K) are rounded typical values, not copied from any one table."
  - "The diver and climber parts are a teaching model (1 bar per 10 m of sea water, an exponential atmosphere with an 8 km scale height, body water as plain water at 37 °C). They are not for planning dives or climbs. The maths was checked in the tests against an independent Python version."
  - "Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Pressure" }
  - { icon: flask, label: "Dissolve" }
  - { icon: eye, label: "Open it" }
  - { icon: mountain, label: "Dive, climb" }
---

## What it does

Gases dissolve in water a little. **Henry's law** says how much: the mole fraction x of a gas in the solution is proportional to the gas's partial pressure p above it, **p = KH x**. Every gas has its own Henry constant KH, and a **bigger KH means the gas is harder to dissolve**. KH also grows with temperature, so gases dissolve less in warm water.

- **A bottle of soda.** Set the CO₂ pressure in a sealed bottle and its temperature. The page shows KH, the mole fraction, and how much CO₂ is dissolved in each litre in millimoles and grams, with bubbles in the bottle picture. Tap **Open the bottle**: the CO₂ pressure falls to the tiny amount in air, nearly all the gas has to leave, and the page says how many millilitres fizz out of each litre.
- **Which gas dissolves best?** A table of CO₂, oxygen and nitrogen at 1 bar at the same temperature. CO₂ is about 20 times more soluble than oxygen; nitrogen least of all.
- **Divers and climbers.** A diver at depth breathes air at higher pressure, so more nitrogen dissolves in the blood; rising too fast lets it out as bubbles (the bends). A climber high up breathes air at low pressure, so less oxygen dissolves (altitude sickness). The bars compare with sea level.

This fits **Class 12 Chemistry: solutions** (solubility of a gas in a liquid, Henry's law and its uses, the effect of temperature). Next, see how dissolved particles change boiling and freezing points in [[colligative-properties]]; for the gas laws themselves, use the [[gas-law-calculator]], and see the particles moving in [[kinetic-theory]].

## How to use it

1. Move **p** (CO₂ pressure in bar) and **T** (temperature) for the soda bottle.
2. Tap **Open the bottle**, and **Close it again** to compare.
3. Read the gas table, which follows the temperature you set.
4. Choose **Diver** and set the depth, or **Climber** and set the altitude.
5. Try the **Check yourself** questions.

## Worked example

Soda at 2.5 bar of CO₂ and 25 °C, with KH = 1700 bar: x = 2.5 / 1700 = 1.47 × 10⁻³. One litre of water is 55.5 mol, so about 1.47 × 10⁻³ × 55.5 = 0.0818 mol = 81.8 mmol of CO₂ dissolves, which is 0.0818 × 44 = 3.6 g. Open the bottle and almost all of it must leave: about 2030 mL of gas at 1 bar from each litre.

Cool the same bottle to 5 °C and it holds 6.43 g/L; warm it to 35 °C and only 2.77 g/L. That is why warm soda goes flat faster.

Diver at 30 m: the pressure is 1 + 30/10 = 4 bar, so 4 times as much nitrogen dissolves in body water as at the surface (1.93 mmol/L instead of 0.48 mmol/L in this model). Climber at 5000 m: the air pressure is about 0.54 bar, so only about 0.54 times the sea-level oxygen dissolves.

## Tips

- Henry's law works best for gases that don't react with water and at low pressures. CO₂ partly reacts with water to make carbonic acid, which is why soda is slightly acidic.
- Divers' tanks for deep dives often mix in helium, which dissolves less than nitrogen.
- Aquatic life suffers in warm water because less oxygen dissolves.

## FAQ

**Can I use this to plan a dive?** No. It is a teaching model with rounded constants; real dive planning uses tables or a dive computer and training.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
