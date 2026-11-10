---
name: Food web builder
num: 1129
shelf: learn
code: L63
section: school-biology
title: "Food web builder: who eats whom, food chains, removing a species and the 10 % energy pyramid"
summary: "Explore a forest or pond food web drawn by trophic level. Tap to add or remove who eats whom, remove a species and see who dies out or increases, count the food chains, and read the energy pyramid with the 10 % rule."
status: live
ads: false
order: 1129
icon: link
works: offline
updated: 2026-11-09
related: [natural-selection, photosynthesis-lab, biodiversity-indices, lotka-volterra-simulator]
sources:
  - "Trophic levels, food chains, knock-on effects and the 10 % law of energy transfer (Lindeman 1942) are standard ecology; the code is written by fibub and its food chain counts were checked against a separate Python search of the same webs."
  - "The forest and pond webs are simplified teaching examples made up by fibub from common knowledge of who eats whom; they are not survey data from any real habitat."
  - "Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pointer, label: "Pick" }
  - { icon: link, label: "Link" }
  - { icon: scissors, label: "Remove" }
  - { icon: chart, label: "Energy" }
---

## What it does

A **food chain** shows one path of food: grass is eaten by a grasshopper, the grasshopper by a frog, the frog by a snake. In a real habitat the chains cross and join into a **food web**. This builder draws a simplified forest web and a pond web with producers at the bottom and each consumer one row above its food, so the rows are the **trophic levels**.

- **Draw who eats whom.** Tap a food, then the animal that eats it, to add an arrow; do it again to take the arrow away. Or clear all the links and build the web yourself.
- **Remove a species.** Tap an organism to take it out of the habitat. The web marks who **dies out** (nothing left to eat), who may become **more common** (fewer predators) and who has **less food** but can eat other things. This is how the loss of one species spreads through an ecosystem.
- **Count the chains.** The page counts every food chain from a producer to a top consumer and shows the longest one.
- **Energy pyramid.** Only about 10 % of the energy at one level is passed to the next; the rest is used for living and lost as heat. The pyramid shows what is left at each level.

It fits **Class 8 Science** (food chains and webs in an ecosystem), **Class 10 Science: our environment** (trophic levels, the 10 % law) and **Class 12 Biology: ecosystem** (food webs, ecological pyramids, energy flow). The prey and predator cycles behind "more frogs, then more snakes" are in [[lotka-volterra-simulator]]; how the energy enters a web is in the [[photosynthesis-lab]]; measure the variety of species with [[biodiversity-indices]], and see how predators shape a population in [[natural-selection]].

## How to use it

1. **Pick the level and habitat.** *Class 8–10* uses the 10 % rule. *Class 12* shows each organism's trophic level, the longest chain and a slider for the share of energy passed on (5 to 20 %).
2. **Draw who eats whom**: tap the food first, then the eater. The line at the top tells you what happened. A plant cannot eat anything, and the page says so if you try.
3. **Remove a species**: switch the tap to *Remove a species* and tap one. Tap it again, or press *Bring everyone back*, to restore it.
4. **Energy pyramid**: set the energy the producers store. Download the chains as a CSV file, or the web, chains and pyramid as an image, PDF or Word file.
5. **Check yourself** gives fresh questions every time.

## Worked example

Open the forest web: the page finds **14 food chains**, the longest being Grass → Grasshopper → Frog → Snake → Hawk. Remove the **deer**: the tiger only eats deer here, so the page says **1 more species dies out** (the tiger), while grass and shrubs are eaten less. Bring it back and remove the **snake**: nothing dies out, but mouse, frog and sparrow are eaten less (↑ more), and the hawk has less food. In the pyramid, 10,000 kJ stored by producers becomes 1,000 kJ for herbivores, 100 kJ for carnivores and just 10 kJ for top carnivores, which is why top predators are few.

## FAQ

**Why does the snake sit on level 3 when it also eats frogs (level 3)?** The page uses the shortest chain down to a producer (grass → mouse → snake). Animals that eat at several levels do not fit neatly in one row.

**Is the 10 % rule exact?** No, it is an average. Real transfers range from about 5 to 20 %, which is why Class 12 level lets you change it.

**Why do some animals say "↓ less food" rather than dying out?** They still have other food in the web. Many-sided diets make food webs more stable than single chains.
