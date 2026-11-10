---
title: "Transpiration and the potometer: what speeds up water loss in plants"
summary: "How a bubble potometer measures water uptake, and how light, temperature, humidity, wind and blocked stomata change the rate, with a worked example."
tools: [transpiration-lab, stomatal-density-counter, photosynthesis-lab, osmosis-lab]
updated: 2026-11-10
sources:
  - "Transpiration through stomata, the potometer method, Tetens' formula for saturation vapour pressure, vapour pressure deficit and conductances in series: standard plant physiology."
  - "The shoot's values in the tool (conductances, light response, 80 % of stomata on the lower surface, 0.5 mm capillary radius) are made-up teaching numbers, so real readings differ."
---

The transpiration lab puts a leafy shoot in a virtual bubble potometer and lets you change its world with five controls: light, air temperature, humidity, a fan and petroleum jelly on the leaves. You watch the bubble creep along a tube, take five-minute readings like in a school practical, and see graphs of the rate. It is made for Class 10 and 11 biology students, for teachers short of fresh shoots, and for gardeners curious about why plants wilt on windy days. To count the pores on a real leaf, use the [[stomatal-density-counter]]; to see what light does to food-making at the same time, try the [[photosynthesis-lab]]; and for how water gets into root cells, the [[osmosis-lab]].

## What it is

Leaves are full of moist air spaces. Tiny pores called **stomata** (one is a stoma) let that water vapour escape. Losing water this way is **transpiration**. As water leaves the leaf, it pulls the column of water in the xylem upwards, all the way from the roots.

A **potometer** measures how fast a cut shoot takes up water. The shoot sits in water joined to a thin glass tube called a capillary. An air bubble in the capillary moves as water is drawn in. If the bubble moves a distance d in a tube of inner radius r, the volume taken up is:

V = π r² d

The lab's model rests on two ideas:

- **The drying power of the air.** Warm air can hold more water vapour than cold air. The **vapour pressure deficit** (VPD) measures how far the air is from full: VPD = e_s × (1 − RH), where e_s is the saturation vapour pressure at that temperature (in kPa) and RH is the relative humidity as a fraction.
- **Two doors in a row.** Water must pass through the stomata and then through a thin still layer of air hugging the leaf, the **boundary layer**. Light opens the stomata (stomatal conductance, gs); wind thins the boundary layer (boundary layer conductance, gb). Like resistors in series, the total is 1 ÷ (1/gs + 1/gb), so the narrower door sets the pace.

The rate is then a constant for the shoot × total conductance × VPD.

## How to use it

1. Choose **Class 10** or **Class 11**. Class 11 shows the VPD, the three conductances and the π r² d working.
2. Set the sliders: **Light** 0 to 100 % of full sun, **Air temperature** 5 to 40 °C, **Humidity** 10 to 100 % and **Wind (a fan)** 0 to 5 m/s.
3. Choose where the jelly goes: **None**, **Upper sides**, **Lower sides** or **Both**.
4. Read the rate in mL per hour, the bubble distance in 5 minutes and the share of stomata open.
5. Press **Read 5 minutes** to add a row to the results table. Each reading varies slightly. **Download results (CSV)** saves the table; **Clear** empties it.
6. In **Rate graph**, pick **Light**, **Temperature**, **Humidity** or **Wind** to plot the rate across that factor, with a dot for your current setting. The graph and set-up can be saved as PNG, PDF or Word.

## A worked example

Set Class 11, light 80 %, 25 °C, humidity 40 %, wind 1 m/s and no jelly.

- Saturation vapour pressure at 25 °C: e_s = 3.17 kPa. VPD = 3.17 × (1 − 0.4) = 1.90 kPa.
- Stomatal conductance gs = 0.324 (81 % of fully open). Boundary layer conductance gb = 1.3.
- Total conductance = 1 ÷ (1/0.324 + 1/1.3) = 0.259.
- The tool's rate comes out at 1.23 mL per hour.

In 5 minutes that is 1.23 × 5 ÷ 60 = 0.103 mL, or 102.7 mm³. With a capillary radius of 0.5 mm, the bubble moves 102.7 ÷ (π × 0.5²) = 130.8 mm, about 26.2 mm a minute.

Now change one thing at a time:

- Fan off (0 m/s): 0.93 mL/h, bubble 99.1 mm in 5 minutes.
- Humidity up to 80 %: VPD drops to 0.63 kPa and the rate to 0.41 mL/h.
- Jelly on the upper sides: 1.03 mL/h, a small drop.
- Jelly on the lower sides: 0.29 mL/h, about a quarter of the uncoated rate, because 80 % of this shoot's stomata are underneath.

## Where it is used

- **Farming and irrigation.** Growers use VPD to plan watering. Hot, dry, breezy days need more water; greenhouses raise humidity to cut losses.
- **Plant breeding.** Crops with fewer stomata or ones that close quickly can survive drought better.
- **Weather and climate.** Forests return huge amounts of water to the air by transpiration, which feeds clouds and rain.

## Common mistakes

- **Changing two things at once.** Move one slider, then read. Otherwise you cannot tell which factor caused the change.
- **Reading straight after a change.** In a real potometer the shoot needs time to settle. Take a few readings and average them.
- **Assuming more wind always means much faster loss.** Once the boundary layer is thin, the stomata become the bottleneck. Plot the wind graph to see it level off.
- **Thinking uptake equals loss exactly.** A potometer measures water taken in. A small amount stays in the plant, so the two are close but not equal.
- **Expecting real numbers to match.** The shoot values are made-up teaching figures. Use the trends, not the exact mL, for a real experiment.

## Questions people ask

**Why does jelly on the lower side not stop the rate completely?** About 20 % of the stomata in this model are on top, and they keep working.

**Why does warming the air raise the rate even at the same humidity?** Warm air holds more vapour, so the same humidity leaves a bigger gap to fill, a larger VPD.

**What is the moving bubble on screen?** It is the same reading shown 30 times faster than real life, so you can see it move.

