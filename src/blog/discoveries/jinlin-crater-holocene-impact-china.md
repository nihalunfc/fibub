---
title: "Jinlin crater in China confirmed as an impact: sizing the asteroid"
summary: "A 2025 open-access paper confirms that the 900 m Jinlin crater in Guangdong was dug by a meteorite in the last 12,000 years. Here is how to check the impactor size with fibub."
tools: [impact-crater-calculator, planet-data-explorer, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Chen, M.; Tan, D.; Yang, W.; Mao, H.-K.; Xie, X.; Yin, F.; Shu, J. (2026), Jinlin crater, Guangdong Province, China: Impact origin confirmed, Matter and Radiation at Extremes 11(1), 013001, published online 15 October 2025. Details checked on the publisher's article page, 2026-11-10."
  - "Licence: the journal is listed in the Directory of Open Access Journals as using a CC BY licence (checked 2026-11-10); the version was not stated there."
  - "Crater scaling: Collins, Melosh and Marcus (2005), Earth Impact Effects Program, Meteoritics & Planetary Science 40: 817-840."
paper:
  title: "Jinlin crater, Guangdong Province, China: Impact origin confirmed"
  authors: "Chen M, Tan D, Yang W, Mao H-K, Xie X, Yin F, Shu J"
  journal: "Matter and Radiation at Extremes"
  year: 2026
  doi: "10.1063/5.0301625"
  url: "https://pubs.aip.org/aip/mre/article/11/1/013001/3367917/Jinlin-crater-Guangdong-Province-China-Impact"
  licence: "CC BY"
  reviewed: true
---

Near Zhaoqing, in southern China, a round hollow about 900 metres across sits on a forested hillside. A team of mineral physicists has now shown that it was made by something falling from space. Their paper, in *Matter and Radiation at Extremes* (online October 2025, in the January 2026 issue), also argues that the impact happened within the Holocene, the warm stretch of time since the last ice age ended about 11,700 years ago. That would make Jinlin the largest impact crater of that age known on Earth. The authors estimate that the body that made it was roughly 30 metres wide, and the [[impact-crater-calculator]] lets you test that estimate in a few seconds.

## What they found

The team measured the crater rim to rim at about 900 metres in one direction and 820 metres in the other, so it is slightly oval. The authors give an apparent depth of about 90 metres.

The key evidence is in the quartz. In thin slices of rock from the site, the authors found many quartz grains crossed by sets of very fine, straight, parallel planes. These "planar deformation features" form only when a shock wave squeezes the crystal to pressures tens of thousands of times greater than the air around us. Ordinary geology on Earth's surface does not reach such pressures; a hypervelocity impact does.

For the impactor, they used published scaling rules between crater size and the size of the body, at a typical speed of 15 to 25 kilometres per second, and arrived at about 30 metres across. They could not say whether it was stony or iron.

## Why it matters

Young craters are rare on Earth, because rain, rivers and plants wipe them out quickly. Finding a well-kept 900 metre crater from the recent past helps in two ways. It adds a data point to the count of how often bodies tens of metres wide reach the ground. And it shows that such craters can survive, even in a humid climate, so others may be waiting to be found.

## How they did it

The work had three parts. First, a drone and field survey of the rim, floor and gullies. Second, a microscope study of about 100 thin rock sections, where the orientation of each set of planes in quartz was measured. Third, an age estimate. There was no radiometric date. Instead, the authors looked at how little the granite fragments under the soil had weathered, and compared that with a known regional weathering rate to get an age in the early to middle Holocene.

## Check it yourself with fibub

What size of body makes a 900 metre crater? Open the [[impact-crater-calculator]] and follow these steps. The numbers below are our own round choices, not taken from the paper's tables.

1. Tap **Impactor from crater** at the top.
2. Set **Where** to Earth and **Ground** to *Crystalline rock (2750 kg/m³)*, the closest match to granite.
3. Set **Impactor** to *Dense rock, 3000 kg/m³*.
4. Type a crater diameter of **0.85** km (a round middle value between the two rim widths), a speed of **20** km/s and an angle of **45°**.

The tool should answer with an impactor about **28 metres** across, a mass of roughly 35,000 tonnes and an energy near **1.7 megatons of TNT**. That agrees well with the paper's 30 metres. Now try the range the authors used:

| Impactor (our choice) | Speed | Size needed for a 0.85 km crater | Energy |
|---|---|---|---|
| Dense rock | 15 km/s | about 33 m | about 1.5 Mt |
| Dense rock | 25 km/s | about 25 m | about 1.8 Mt |
| Iron, 8000 kg/m³ | 15 km/s | about 22 m | about 1.2 Mt |
| Iron, 8000 kg/m³ | 25 km/s | about 16 m | about 1.4 Mt |

Two lessons jump out. The energy barely changes, because the crater size mostly tracks energy. The body's size, though, depends a lot on what it was made of, which is why the paper's unknown composition matters. Change the angle to 30° and a stony body needs to be about 33 metres instead.

The tool also reports that impacts of at least this energy hit Earth about once every 160 years or so on average. To put a spread on your answer, feed the range of sizes into the [[uncertainty-calculator]]. To compare Earth's gravity with other worlds where the same body would dig a bigger hole, look at the [[planet-data-explorer]].

## The fine print

- **No direct date yet.** The Holocene age comes from weathering rates, which can vary from place to place. The authors say a precise age still needs work.
- **Composition unknown.** No meteorite fragments are reported, so stony versus iron, and so the impactor's size, stay open.
- **Air is left out.** The calculator, like simple scaling rules, ignores the atmosphere. A stony body of 30 metres would often break up before landing, so an iron body, or a strong stone, fits a ground crater better.
- **A slope and soft ground.** The crater sits in deep weathered soil on a tilted hillside, which scaling rules written for flat, solid rock do not describe exactly. Expect the answer to be good to a factor of about 1.5.
- Our table uses our own rounded inputs. For the measured values and the shock evidence, read the paper.
