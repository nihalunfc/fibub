---
name: Mineral identification key
num: 515
shelf: science
section: mineralogy-and-petrology
title: "Mineral identification key: identify common minerals by hardness, streak, lustre, cleavage and simple tests"
summary: "An interactive key to about 50 common rock-forming and ore minerals. Enter what you see (Mohs hardness or scratch tests, specific gravity, lustre, streak, cleavage, colour, acid fizz, magnetism and other simple tests) and get ranked matches with the reasons for and against each, adjustable tolerances, and a printable property table."
status: live
ads: true
order: 515
icon: search
works: offline
updated: 2026-11-09
related: [point-counter, ternary-plot-maker, grain-size-stats]
sources:
  - "Property values are rounded general facts written by fibub from general mineralogy knowledge, as taught in standard textbooks such as Klein and Philpotts, Earth Materials (Cambridge University Press), and Nesse, Introduction to Mineralogy (Oxford University Press). No tables were copied."
  - "Mohs hardness scale (Mohs 1812) and the common field references: fingernail about 2.5, copper coin about 3.5, steel knife and glass about 5.5."
flow:
  - { icon: eye, label: "Observe" }
  - { icon: sliders, label: "Tolerance" }
  - { icon: search, label: "Matches" }
  - { icon: table, label: "Print table" }
---

## What it does

This is a **mineral identification key** for hand specimens. It holds about 50 common minerals: the main rock-forming silicates (quartz, feldspars, micas, amphibole, pyroxene, olivine, garnet and more), carbonates, sulfates, halides, and common ore minerals (magnetite, hematite, pyrite, chalcopyrite, galena, sphalerite, cassiterite, native metals and others). For each it knows rounded, general values: **Mohs hardness** range, **specific gravity** range, **lustre**, **streak**, **cleavage**, usual **colours** and simple **tests** (fizzing in dilute acid, magnetism, thin sheets, greasy feel, striations, dissolving in water, double refraction).

You tell it what you see. Every mineral is scored against each observation: **1** if it fits, **½** if it is close, **0** if it does not. The page lists the best matches with ✓, ≈ and ✗ for each reason, so you can see why a mineral is (or is not) suggested. A full property table can be printed or saved as CSV.

## How to use it

1. **Hardness**: type a Mohs number, or choose a scratch test: a fingernail scratches it (under 2.5), a copper coin does (2.5 to 3.5), a steel knife or glass does (3.5 to 5.5), or it scratches glass (over 5.5).
2. **Streak**: rub the mineral on the back of an unglazed tile and look at the powder's colour. It is much more reliable than the mineral's colour.
3. **Lustre**: metallic, submetallic or one of the non-metallic kinds (vitreous is glassy).
4. **Cleavage**: count the flat breaking directions and the angles between them.
5. **Specific gravity** (optional): type it, or weigh the specimen in air and hanging in water; SG = air ÷ (air − water).
6. **Tests**: answer yes or no only for tests you did. "No" counts too: a mineral that should fizz but did not gets a ✗.
7. **How strict**: widen the hardness or SG tolerance, or allow one or two mismatches, if your observations are rough.

## Worked example

A white, glassy specimen with hardness 3, white streak, rhomb-shaped cleavage (three directions not at 90°) that fizzes in cold dilute acid: **Calcite** scores 5 of 5. Next come Barite (4 of 5: it does not fizz), then Dolomite and Siderite (3½ of 5: hardness is half a step off and they fizz only when powdered). Change the acid test to "no" and "fizzes when powdered" to "yes", with hardness 3.5, and Dolomite moves to the top.

## Tips

- Use a fresh surface: weathered skins change colour, lustre and hardness.
- Colour misleads (quartz comes in many), so leave it as "any" unless it is distinctive, like malachite green.
- A dark mineral with a pale streak is often sphalerite; a grey metallic mineral with a red-brown streak is hematite.
- Some minerals here contain toxic elements (cinnabar, arsenopyrite, galena): wash your hands after handling.

## FAQ

**How accurate are the values?** They are rounded general facts for typical specimens; real minerals vary with composition. Use the matches as a short list and confirm with a field guide or a teacher.

**Can it identify rocks?** No, only minerals. Rocks are mixtures; identify their minerals first.

**Is my data stored?** No. Everything runs in this page.
