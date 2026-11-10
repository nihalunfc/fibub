---
title: "Heating curve of water: why the temperature stops while ice melts"
summary: "Specific heat, latent heat and the flat parts of the heating curve explained, with the heat and time for each stage and a calorimetry mixer, worked through by hand."
tools: [heating-curve, states-of-matter, phase-diagram-calculator, heat-engine-cycles]
updated: 2026-11-10
sources:
  - "Q = mcΔT, Q = mL, P = Q/t and heat lost = heat gained (calorimetry): standard school physics."
  - "Rounded values used by the tool: specific heat of ice 2,100, water 4,200 and steam 2,000 J/(kg K); latent heat of fusion 3.34 × 10⁵ J/kg and of vaporisation 2.26 × 10⁶ J/kg; copper about 385 J/(kg K)."
---

The heating curve tool takes a lump of ice, puts it on a heater of steady power and plots its temperature against time all the way to steam at 120 °C. A table gives the heat and time for every stage, and a second card finds the final temperature when you mix something hot, or some ice, with a cup of water. It is aimed at Class 9 and Class 11 students. For the particle picture behind melting and boiling, try [[states-of-matter]]; to see how those temperatures shift at other pressures, open the [[phase-diagram-calculator]]; and to turn heat into work, go on to [[heat-engine-cycles]].

## What it is

When a substance takes in heat without changing state, its temperature rises by an amount set by its **specific heat capacity** c, the energy needed to warm 1 kg by 1 °C:

Q = m c ΔT

Here Q is the heat in joules (J), m the mass in kilograms, c the specific heat in J/(kg K) and ΔT the temperature change in °C (a change of 1 °C equals a change of 1 K).

While a substance melts or boils, the heat instead loosens the pull between particles, and the temperature holds steady until the change is complete. The energy per kilogram is the **latent heat** L:

Q = m L

Water's latent heat of boiling (2.26 × 10⁶ J/kg) is almost seven times that of melting (3.34 × 10⁵ J/kg), so the boiling plateau is far longer.

A heater of **power** P (in watts, joules per second) supplies Q in a time t = Q ÷ P. The tool assumes no heat is lost and the steam is kept in.

The mixer uses **calorimetry**: with no heat escaping, heat lost by the hot body equals heat gained by the cold one. With ice, part of the water's heat goes first into melting it.

## How to use it

1. Set the **Mass of ice** (0.1 to 2 kg), the **Heater power** (100 to 2,000 W) and the temperature the **Ice starts at** (−40 to 0 °C).
2. Watch the curve draw itself and the beaker change. Press **Pause** to freeze it at a moment, and **Start again** to replay from the beginning. A line under the picture says how far a melt or boil has gone.
3. Read the **table**: each stage, the heat it needs, the time at your power and the formula used. The line above it sums the melting, boiling and total heat.
4. In the mixer, choose what to **Drop in** (hot water, an iron, copper or aluminium ball, or ice at 0 °C), type its mass and temperature, then the mass and temperature of the water in the cup. The final temperature appears with the working.

## A worked example

Take **1.2 kg** of ice at **−10 °C** on a **1,500 W** heater.

| Stage | Heat | Time at 1,500 W |
|---|---|---|
| Ice −10 → 0 °C: 1.2 × 2,100 × 10 | 25.2 kJ | 16.8 s |
| Melting: 1.2 × 334,000 | 400.8 kJ | 267.2 s (4.45 min) |
| Water 0 → 100 °C: 1.2 × 4,200 × 100 | 504 kJ | 336 s (5.6 min) |
| Boiling: 1.2 × 2,260,000 | 2,712 kJ | 1,808 s (30.1 min) |
| Steam 100 → 120 °C: 1.2 × 2,000 × 20 | 48 kJ | 32 s |

In total **3,690 kJ** in **2,460 s**, which is exactly **41 min**. Almost three quarters of that time is spent boiling at a fixed 100 °C.

Now the mixer. Drop a **0.5 kg copper ball** at **300 °C** into **1 kg of water** at **20 °C**. Setting heat lost equal to heat gained:

0.5 × 385 × (300 − T) = 1 × 4,200 × (T − 20)

T = (57,750 + 84,000) ÷ (192.5 + 4,200) = **32.3 °C**. The ball cools by 268 °C while the water warms by only 12 °C: the water needs about 22 times as much heat per degree.

Finally drop **0.2 kg of ice** into **0.3 kg of water** at **40 °C**. Cooling to 0 °C, the water can give 0.3 × 4,200 × 40 = **50.4 kJ**, but melting all the ice needs 0.2 × 334,000 = **66.8 kJ**. Only 50,400 ÷ 334,000 = 0.151 kg, about **151 g**, melts, and the mixture stays at **0 °C**. With 50 g of ice instead, everything melts and the mixture ends at **22.9 °C**.

## Where it is used

- **Kettles and cooking.** Bringing water to the boil is quick, but boiling a pan dry takes ages; the table lets you estimate times from a wattage.
- **Cold chains.** Ice packs hold food and medicines at 0 °C for hours because melting soaks up heat without a temperature rise.
- **Engineering.** Steam heating relies on the large latent heat of condensation, and engine cooling uses water for its high specific heat.

## Common mistakes

- **Using one specific heat for every stage.** Ice, water and steam each have their own c. Use 2,100 below 0 °C, 4,200 for liquid water and 2,000 above 100 °C.
- **Forgetting the plateaus.** Ice at −10 °C to water at 10 °C needs the melting heat too.
- **Mixing kJ and J.** Change everything to joules and kilograms before you divide.
- **Assuming all the ice melts.** Check first whether the warm water has enough heat to give. If not, the answer is 0 °C with ice left over.

## Questions people ask

**Why does the line slope differently for ice, water and steam?** A steeper line means fewer joules per degree. Liquid water has about twice the specific heat of ice or steam, so its part of the curve rises most slowly.

**Can the mixer handle a red-hot ball that makes the cup boil?** Not properly. It assumes the cup water stays liquid, so an answer above 100 °C means some water would really boil away.
