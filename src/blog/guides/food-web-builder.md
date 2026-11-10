---
title: "Food web builder: trophic levels, removing a species and energy pyramids"
summary: "How food chains join into a food web, what trophic levels are, what happens when one species disappears, and why only a tenth of the energy moves up each level."
tools: [food-web-builder, lotka-volterra-simulator, photosynthesis-lab, biodiversity-indices]
updated: 2026-11-10
sources:
  - "Trophic levels, food webs and the roughly 10 % transfer of energy between levels (Lindeman 1942, Ecology 23: 399-417): standard ecology."
  - "The pond and forest webs in the tool are simplified teaching examples, not survey data. Worked example numbers were produced with the tool's own code (src/lib/sci/foodweb.ts)."
---

In any pond or forest, living things are tied together by what they eat. Pull on one strand and others move. The [[food-web-builder]] tool draws two simple habitats, lets you add or cut feeding links, and shows what happens to the rest of the web when one species disappears. It also turns the energy that plants capture into a pyramid, so you can see why big predators are rare. It is aimed at school students from Class 8 to Class 12 and at anyone curious about ecology. The energy enters the web through plants, which the [[photosynthesis-lab]] explains; for how predator and prey numbers rise and fall over time, try the [[lotka-volterra-simulator]], and to measure how varied a habitat is, use [[biodiversity-indices]].

## What it is

A **producer** makes its own food from sunlight. In a pond that means algae and water plants. A **consumer** gets its energy by eating something else. A **food chain** is one line of eating: algae are eaten by water fleas, water fleas by small fish, small fish by a heron. Real animals eat more than one thing, so chains cross and join. The whole network is a **food web**.

Each step up a chain is a **trophic level** (from the Greek for food). Producers are level 1, plant eaters (herbivores) level 2, and so on. In the tool, an animal's level is one more than its shortest route down to a producer.

Energy is lost at every step. An animal uses most of what it eats to move, keep warm and stay alive, and much of that ends up as heat. On average only about 10 % reaches the next level. If producers store E kilojoules (kJ), level n receives:

Eₙ = E × fⁿ⁻¹

Here **f** is the fraction passed on (0.1 for the 10 % rule) and **n** is the level number.

## How to use it

1. Choose the **Level** (Class 8–10 or Class 12) and the **Habitat** (Forest or Pond). Class 12 labels each organism's trophic level and adds a slider for the share of energy passed on, from 5 to 20 %.
2. With **Draw who eats whom** selected, tap the food first and then the eater to add an arrow. Tapping the same pair again removes it. **Clear the links** empties the web so you can build it from scratch; **Start again** brings back the original links.
3. Switch to **Remove a species** and tap one. The web marks who dies out, who may become more common and who has less food. Tap it again, or press **Bring everyone back**, to undo.
4. Read the summary: the number of food chains, the longest chain, the producers, the number of links and the top consumers.
5. Under **Energy pyramid**, set how much energy the producers store (1,000 to 100,000 kJ). Download the chains as a CSV file, or the whole report as an image, PDF or Word file.

## A worked example

Open the **Pond** web. The tool counts **9 food chains**. The longest have five organisms, such as Algae → Water fleas → Small fish → Big fish → Heron. With the Class 12 labels on, the heron sits at level 4.

**Remove the small fish.** No other species dies out, because big fish still eat dragonfly nymphs and tadpoles, and herons still eat big fish. The water fleas and mosquito larvae are eaten less, so their numbers may rise. Big fish and herons lose some of their food.

**Now remove the algae instead.** This time 7 more species die out: water fleas, mosquito larvae, tadpoles, small fish, dragonfly nymphs, big fish and herons all depend on the algae in the end. Only the water plants and the snail survive, and the snail loses one of its two foods. The pond is left with a single chain: Water plants → Snail.

**Energy.** Set the producers to 20,000 kJ. With the 10 % rule, the pond's four levels get 20,000 kJ, 2,000 kJ, 200 kJ and **20 kJ**. Switch to Class 12 and set 15 %: the levels get 20,000 kJ, 3,000 kJ, 450 kJ and **67.5 kJ**. Even at the generous rate, only about 0.34 % of the plants' energy reaches the herons.

## Where it is used

- **Conservation.** Before a species is protected or brought back to an area, ecologists ask which other species depend on it, just like the remove button does.
- **Fisheries.** Taking too many of one fish can leave its predators short of food and let its prey boom. Managers look at the web, not just one species.
- **Pest control.** Bringing in a predator to eat a crop pest can also harm other prey. Mapping the web first shows the risk.
- **Farming and food.** Ten times more energy is available to people eating plants than to people eating animals that ate those plants. The same pyramid underlies that comparison.

## Common mistakes

1. **Drawing arrows the wrong way.** The arrow points from the food to the eater, the way energy moves. "Frog → snake" means the snake eats the frog.
2. **Treating 10 % as exact.** It is an average. Real transfers vary from roughly 5 to 20 %, so use the Class 12 slider to see the range.
3. **Thinking a removed predator only helps its prey.** Extra prey can then eat more of their own food, which can shrink lower levels.
4. **Assuming each animal has one level.** An animal that eats both herbivores and carnivores feeds at two levels. The tool places it by its shortest route.

## Questions people ask

**Why do top predators matter if they get so little energy?** They keep the numbers of the animals below them in check. Without them, a plant eater can grow in number until it strips its food supply.

**Why can a food chain rarely be longer than five links?** By the fifth level only about 0.01 % of the producers' energy is left at 10 % per step, too little to support a population.
