---
title: "Accelerated shelf-life testing of high-pressure-processed sausages"
summary: "A 2025 study checked whether storing high-pressure-processed frankfurters warm can predict their chilled shelf life. Tests at 8 and 18 °C worked well. Here is how to fit Q10 and Ea yourself."
tools: [shelf-life-estimator, reaction-kinetics-fitter, thermal-process-calculator]
updated: 2026-11-10
sources:
  - "Ntzimani A, Tsevdou M, Andrianos E, Gounaris D, Spiliotopoulos T, Taoukis P, Giannakourou MC (2025), Applied Sciences 15(3): 1264, CC BY, the paper described here."
  - "Q10 rule and Arrhenius equation for the temperature dependence of shelf life: standard food science formulas. Primary growth model: Baranyi and Roberts (1994), International Journal of Food Microbiology 23: 277-294. Method only."
paper:
  title: "Validating Accelerated Shelf Life Testing Methodology for Predicting Shelf Life in High-Pressure-Processed Meat Products"
  authors: "Ntzimani A, Tsevdou M, Andrianos E, Gounaris D, Spiliotopoulos T, Taoukis P, Giannakourou MC"
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app15031264"
  url: "https://www.mdpi.com/2076-3417/15/3/1264"
  licence: "CC BY"
  reviewed: true
---

Finding out how long a chilled food keeps can take months of waiting in a fridge. Accelerated shelf-life testing shortens that wait: store the product warmer, where it spoils faster, then use a temperature rule to work back to fridge conditions. A 2025 paper in Applied Sciences tested that shortcut on vacuum-packed frankfurter-type sausages, with and without high-pressure processing (HPP), a non-heat treatment that squeezes packs at very high pressure to kill microbes. The authors report that storage at raised temperatures of 8 and 18 °C predicted chilled shelf life accurately. The [[shelf-life-estimator]] fits the same temperature rules to your own test results, and the [[reaction-kinetics-fitter]] handles the rate constants behind them.

## What they found

Lactic acid bacteria, which sour meat products, were the main spoilage group in these sausages, and their numbers tracked closely with the total count of bacteria. Shelf life was taken as the time until the total viable count reached 8 log CFU/g (100 million colony-forming units per gram), including the lag phase before growth took off.

The temperature dependence of spoilage, fitted with the Arrhenius equation from two, three or four storage temperatures, gave predictions that matched shelf lives measured under changing temperatures. The authors conclude that a pair of raised temperatures, 8 and 18 °C, is enough to predict chilled shelf life well for this kind of product, which saves time and fridge space.

## Why it matters

High-pressure processing lets producers extend the life of cooked meats without more heat or preservatives, but every new product still needs a shelf-life date backed by evidence. Testing at 4 °C alone can take many weeks per formula. A validated accelerated method lets a small producer compare recipes or packaging in a fraction of the time. The study also shows that real supply chains are not held at one steady temperature, and that a good model should cope with that.

## How they did it

1. The sausages, made from chicken, pork collagen and pork fat, were vacuum-packed and pre-cooked. Half were then pressure-treated at 6,000 bar for 4 minutes.
2. Packs were stored at 4, 8, 12 and 18 °C, plus two programmes that switched between temperatures to mimic a real cold chain.
3. At intervals the team counted total bacteria, *Pseudomonas*, *Brochothrix thermosphacta*, lactic acid bacteria and Enterobacteriaceae, and measured pH, colour, water activity, texture, fat oxidation and overall sensory impression.
4. Bacterial growth curves were fitted with the Baranyi and Roberts model, which gives a lag time and a growth rate. The growth rates were then fitted against temperature with the Arrhenius equation, and sensory scores with a straight-line (zero-order) decline.
5. Predictions built from different sets of temperatures were checked against the shelf lives found under the changing-temperature programmes.

## Check it yourself with fibub

The [[shelf-life-estimator]] works with shelf lives directly, one per storage temperature. Here is a worked example with **our own made-up numbers**, not the paper's data: a chilled product that reaches its spoilage limit after 42 days at 8 °C, 23 days at 12 °C and 11 days at 18 °C.

1. Set the **Time unit** at the top to days.
2. In **Fit Q10 and activation energy from test points**, paste one test per line: 8, 42; 12, 23; 18, 11.
3. Set **Predict at** to 4 °C.
4. Read the result. The fitted **Q10 is 3.79**: the product spoils about 3.8 times faster for every 10 °C warmer. The **activation energy Ea is 90.7 kJ/mol**, a measure of how steeply the spoilage rate climbs with temperature. Both lines fit well (R² 0.9968 and 0.9978).
5. At 4 °C the Q10 model predicts **69.7 days** and the Arrhenius model **72.0 days**. They agree closely here because the gap from the test temperatures is small. The table shows how each model fits each test point, and the plot shows both lines on a log scale.
6. Now follow the paper's shortcut and keep only two tests: 8, 42 and 18, 11. Q10 becomes 3.82 and Ea 91.2 kJ/mol, and the 4 °C prediction moves only to 71.8 days (Q10) and 73.7 days (Arrhenius). With clean data, two well-spaced temperatures carry most of the information.

The first box, **Shelf life at another temperature**, shows why a measured Q10 matters. Starting from 42 days at 8 °C, a guessed Q10 of 2 predicts only 55.4 days at 4 °C, while a Q10 of 4 predicts 73.1 days. The guess alone shifts the label date by more than two weeks.

If you have bacterial growth rates instead of shelf lives, paste them against temperature in the [[reaction-kinetics-fitter]] to get Ea from the rates themselves. For the heat step that happens before packing, the [[thermal-process-calculator|F-value calculator]] does the kill-step sums.

## The fine print

- One product, one pressure treatment and one pack type were tested; other meats or recipes may behave differently.
- The Arrhenius fits rest on two to four temperatures, and only two changing-temperature programmes were used to check them.
- Pathogens were screened for but not counted, so the shelf life here is about spoilage, not safety.
- A Q10 or Ea fitted between 8 and 18 °C may not hold far outside that range.
- Our worked example is invented. A real shelf-life date must be confirmed by tests on the product at the temperature it is kept, under the food rules where it is sold; check the official source.
