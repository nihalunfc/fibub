---
name: Earth's energy budget
num: 1278
shelf: learn
code: L159
section: school-earth
title: "Earth's energy budget: albedo, the greenhouse effect and the planet's temperature, with two sliders"
summary: "See sunlight arrive, some bounce back off clouds and ice, and the rest warm the ground, which glows heat back up for greenhouse gases to catch and return. Slide the albedo and the greenhouse strength and watch the arrows and the surface temperature change. A Class 11 level adds the W/m² and the Stefan–Boltzmann law."
status: live
ads: false
order: 1278
icon: chart
works: offline
updated: 2026-11-09
related: [carbon-cycle, energy-balance-model, sky-colour]
sources:
  - "Standard one-layer greenhouse model: average sunlight S/4, absorbed (1 − α)S/4 = σTₑ⁴, surface Tₛ = Tₑ(2/(2 − ε))^¼. Solar constant rounded to 1361 W/m². Stefan–Boltzmann constant σ = 5.670374419 × 10⁻⁸ W m⁻² K⁻⁴ (CODATA 2018). Written for fibub."
  - "Checked against Python (α = 0.3: Tₑ = 254.58 K; ε = 0.78: Tₛ = 288.06 K = 14.91 °C; α = 0.6: −22.70 °C) and by the energy balance at the ground, in the air and at the top of the atmosphere for random α and ε."
flow:
  - { icon: sliders, label: "Albedo" }
  - { icon: sliders, label: "Greenhouse" }
  - { icon: chart, label: "Arrows" }
  - { icon: check, label: "Practise" }
---

## What it does

The Earth's temperature is set by a balance. Sunlight comes in; about a third bounces straight back off clouds, ice and snow; the rest warms the ground and the oceans. The warm ground glows with invisible infrared "heat light". Some of that glow escapes to space, but water vapour, carbon dioxide and other **greenhouse gases** soak much of it up and send part of it back down, keeping the surface warmer than it would otherwise be.

This page draws that balance as arrows whose thickness shows the size of each flow, with two sliders:

- **Albedo α**: the share of sunlight reflected to space (0 = black, absorbs everything; 1 = a perfect mirror).
- **Greenhouse strength ε**: the share of the ground's heat glow that the air absorbs.

The big number is the average surface temperature. Presets show today's Earth, an Earth with no greenhouse gases, one with more CO₂, and a "snowball" Earth covered in ice. The **Class 11** level adds every flow in watts per square metre and the Stefan–Boltzmann law σT⁴. It fits the Class 9 Science chapter on the Earth as a system of energy, matter and life, and heat transfer by radiation in Class 11 Physics.

More carbon dioxide in the air, which raises ε, comes from the [[carbon-cycle]]; for feedbacks, ocean heat and warming over time, step up to the [[energy-balance-model]]; and why sunlight looks the way it does on its way in is in [[sky-colour]].

## How to use it

1. Move the **α** and **ε** sliders, or type values.
2. Or press a preset: **Today**, **No greenhouse**, **More CO₂**, **Snowball Earth**.
3. Watch the arrows and the surface temperature, and read the steps under the picture.

## A worked example

Press **Today** (α = 0.3, ε = 0.78) and switch to Class 11.

- Average sunlight: 1361/4 = 340.25 W/m². Reflected: 0.3 × 340.25 = 102.08 W/m². Absorbed: 238.18 W/m².
- With no greenhouse effect, σTₑ⁴ = 238.18 gives Tₑ = 254.6 K, which is −18.6 °C.
- With the one-layer greenhouse: Tₛ = 254.6 × (2/1.22)^¼ = 288.1 K = **14.9 °C**, about 33 degrees warmer.
- At the top: 85.9 W/m² escapes straight out and 152.3 W/m² comes from the air: 238.2 W/m² out, equal to what was absorbed.

Press **Snowball Earth** (α = 0.6): the surface drops to about −22.7 °C.

## Tips

- Doubling the reflected share does not halve the temperature: temperature goes as the fourth root of the energy.
- The greenhouse effect is natural and keeps Earth liveable. Adding more greenhouse gas strengthens it and warms the surface.
- Ice reflects sunlight; melting ice uncovers darker sea and land, which absorb more and warm further. That is a feedback.

## Check yourself

Four fresh questions: average sunlight over a sphere, reflected sunlight, absorbed sunlight, and how much the greenhouse effect warms the planet. Nothing is saved.

## FAQ

**Why divide by 4?** Sunlight falls on a disc the size of the Earth's cross-section (area πR²), but is shared over the whole sphere (area 4πR²) as it turns.

**Is ε really 0.78?** In this one-layer model, 0.78 is the value that gives today's average of about 15 °C. Real air has many layers and gases that absorb different colours of infrared.

**Is this from the NCERT book?** It covers the same topic with fibub's own model and examples. fibub is not part of NCERT.
