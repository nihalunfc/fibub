---
name: Transpiration lab
num: 1133
shelf: learn
code: L67
section: school-biology
title: "Transpiration lab: a bubble potometer with light, temperature, humidity, wind and stomata"
summary: "Watch a leafy shoot pull water through a bubble potometer. Change light, temperature, humidity and wind, block the stomata with petroleum jelly, take 5-minute readings and see rate graphs. For Class 10 and 11 biology."
status: live
ads: false
order: 1133
icon: sliders
works: offline
updated: 2026-11-09
related: [stomatal-density-counter, photosynthesis-lab, osmosis-lab]
sources:
  - "Tetens' formula for saturation vapour pressure, vapour pressure deficit, and stomatal and boundary layer conductances in series: standard plant physiology ideas, written by fibub."
  - "The shoot's numbers (conductances, light response, 80 % of stomata on the lower surface, 0.5 mm capillary radius) are made-up round values for teaching."
  - "Rates were checked in the tests against a separate Python version of the model, and the vapour pressure against published saturation vapour pressure tables."
  - "Drawings are fibub's own simple shapes. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Set up" }
  - { icon: eye, label: "Watch" }
  - { icon: ruler, label: "Read" }
  - { icon: check, label: "Check" }
---

## What it does

Plants lose water vapour from their leaves, mostly through tiny pores called **stomata**. This is **transpiration**. As water leaves the leaves, more is pulled up the stem from the roots, which keeps the plant supplied with water and minerals and cools the leaves. A **potometer** measures it: a cut shoot sits in a tube of water joined to a thin glass capillary, and an air bubble in the capillary moves as the shoot takes up water. This lab gives you a potometer you can change in seconds: the light, the air temperature, the humidity, a fan, and petroleum jelly on the upper or lower sides of the leaves. To count the stomata on a real leaf, use the [[stomatal-density-counter]]; to see what the light does to the plant's food-making at the same time, try the [[photosynthesis-lab]]; and for how water moves into cells in the first place, the [[osmosis-lab]].

## Using it

1. Pick a **Level**. Class 10 shows the bubble speed. Class 11 adds the vapour pressure deficit, the conductances and the volume from π r² d.
2. Move the sliders for **light**, **air temperature**, **humidity** and **wind**.
3. Choose where the **petroleum jelly** goes: nowhere, the upper sides, the lower sides, or both.
4. Press **Read 5 minutes** after each change. Each reading wobbles a little, like a real one. The table can be downloaded as a CSV file.
5. The **rate graph** shows how the rate changes across one factor while the others stay as you set them.

## What the settings do

- **Light:** guard cells open the stomata in light and close them in the dark, so the rate is low at night.
- **Temperature:** warm air can hold much more water vapour, so it pulls water out of the leaves faster.
- **Humidity:** in damp air the leaves lose water slowly; at 100 % humidity transpiration stops.
- **Wind:** still air keeps a layer of moist air around each leaf. A breeze blows it away and speeds water loss, but once the stomata are the bottleneck, more wind adds little.
- **Petroleum jelly:** it blocks the stomata it covers. Most stomata are on the lower side of a typical leaf, so jelly there slows the bubble much more than jelly on top.

## Worked example

At 50 % light, 20 °C, 50 % humidity and still air, the vapour pressure deficit is 2.34 × (1 − 0.5) = 1.17 kPa. The shoot takes up 0.54 mL an hour, which is 0.045 mL (45 mm³) in 5 minutes. In a capillary of radius 0.5 mm, the bubble moves 45 ÷ (π × 0.5²) = 57.1 mm in those 5 minutes, or 11.4 mm a minute. Switch on the fan at 2 m/s and the rate rises; coat the lower sides of the leaves and it falls to about a fifth.

## Where this fits in school

Class 10 science (life processes) introduces transpiration and how water travels up through the xylem. Class 11 biology (transport in plants) covers the structure of stomata, the factors that affect transpiration, the transpiration pull and the potometer experiment. This page is an independent learning aid. It is not made by or connected with NCERT, and it does not copy any textbook.

## Questions

**Does a potometer measure water lost, or water taken up?** Water taken up. Nearly all of it is lost by transpiration, but a little is used by the plant, so the two are close but not equal.

**Why cut the shoot under water?** So no air gets into the xylem and breaks the column of water.

**Is anything saved?** No. Your readings stay on this page until you leave it.
