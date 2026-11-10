---
title: "The world's glaciers are losing ice faster: what a big 2025 study found"
summary: "Glaciers lost about 273 billion tonnes of ice a year from 2000 to 2023, and the loss sped up. Here is how scientists worked it out, and how to check the sums."
tools: [glacier-ice, trend-analyser]
updated: 2026-11-10
sources:
  - "Ocean surface area of about 361 million km² and density of fresh water of 1,000 kg/m³: standard reference values."
  - "Total glacier area of roughly 700,000 km² (rounded), from the Randolph Glacier Inventory (RGI Consortium)."
  - "The single glacier in the worked example is made up by fibub."
paper:
  title: "Community estimate of global glacier mass changes from 2000 to 2023"
  authors: "The GlaMBIE Team"
  journal: "Nature"
  year: 2025
  doi: "10.1038/s41586-024-08545-z"
  url: "https://www.nature.com/articles/s41586-024-08545-z"
  licence: "CC BY 4.0"
  reviewed: true
---

Mountain glaciers are small next to the great ice sheets of Greenland and Antarctica, but there are hundreds of thousands of them and they react quickly to a warming climate. Until recently, different research groups measured them in different ways and got answers that did not quite agree. In February 2025 a team of about 450 data contributors in 35 research groups, working together as the Glacier Mass Balance Intercomparison Exercise (GlaMBIE), published one shared answer in Nature. This article explains what they found in plain words, and how you can check the main numbers yourself with the [[glacier-ice|glacier mass balance tool]] and the [[trend-analyser]].

## What they found

Between 2000 and 2023, the world's glaciers (not counting the two ice sheets) lost about **273 billion tonnes of ice every year**, with an uncertainty of about 16 billion tonnes. Scientists write a billion tonnes as a gigatonne (Gt). Over the 24 years that adds up to roughly 6,500 Gt, or about 5 % of all the ice in glaciers. Some regions lost far more than others.

The loss is not steady. In the first half of the period the yearly loss was about 231 Gt; in the second half it was about 314 Gt, an increase of a bit over a third. The year 2023 set a record, at around 548 Gt. Alaska and the Canadian Arctic together gave about two fifths of the total.

All that meltwater ends up in the ocean. The team worked out that glaciers raised the global sea level by about 18 mm over the period, or three quarters of a millimetre a year. The paper reports that this is about 18 % more than the Greenland Ice Sheet gave over a similar stretch of years (a difference it rates as fairly, not fully, certain) and more than twice what Antarctica's ice sheet gave.

## Why it matters

Sea level rise floods coasts, pushes salt water into rivers and wells, and makes storm surges worse. Planners need to know how much of it comes from glaciers, because glaciers respond to warming within years to decades, much faster than ice sheets. Glaciers also feed rivers in dry seasons for hundreds of millions of people, in places such as the Himalaya and the Andes. A single, agreed number with an honest uncertainty makes it easier for climate models to be tested and for countries to plan.

## How they did it

The team gathered 233 regional estimates from those 35 groups, using four main kinds of measurement:

- **Field measurements**: people visit a glacier and read stakes drilled into the ice each year to see how much surface melted or built up.
- **Comparing elevation maps**: maps of the ice surface height made at two dates, often from satellite stereo photos, show how much thinner the glacier got.
- **Altimetry**: satellites send laser or radar pulses down and time the echo, which measures surface height along their tracks.
- **Gravimetry**: twin satellites feel tiny changes in Earth's gravity as mass moves from ice into the ocean.

Each method has blind spots. Field measurements are accurate but cover under 1 % of glaciers. Elevation maps measure volume, which must be turned into mass with an assumed density. Gravity satellites see large areas but blur nearby signals together. The team split the world into 19 regions, compared the methods in each, removed estimates that clearly did not fit, and combined the rest year by year.

## How to check it yourself with fibub tools

**From gigatonnes to sea level.** One gigatonne of meltwater is 10¹² kg, or 10⁹ m³ of water. Spread over an ocean of about 3.61 × 10¹⁴ m², that is a layer about 0.0028 mm thick. So roughly 361 Gt raises the sea by 1 mm. Then 270 Gt a year ÷ 361 Gt per mm ≈ **0.75 mm a year**, and 6,500 Gt ÷ 361 ≈ **18 mm** in total. Both match the paper.

**What that means for one glacier.** Spread 273 Gt a year over roughly 700,000 km² of glaciers and the average glacier surface loses about **0.39 m of water equivalent** each year (273 × 10¹² kg ÷ 7 × 10¹¹ m² ÷ 1,000 kg/m³). In the glacier mass balance tool, switch **Stake values are** to *Balance in m w.e.*, start empty, and make up a 15 km² glacier: one elevation band of 15 km² and a few stakes that each read −0.40 m w.e. The tool will report a volume change of about −6 million m³ of water, which is 0.006 Gt. You would need around 45,000 glaciers like it to match one year of the world's loss.

**Is it speeding up?** By hand, the two half-period averages (231 and 314 Gt a year) sit about 12 years apart, so the loss grew by 83 Gt a year over 12 years, or roughly 7 Gt a year faster each year. For practice, make up a series of yearly losses that rise, paste it into the trend analyser and read **Sen's slope** per year. The tool also says whether the trend is statistically significant.

## The fine print

- The uncertainties are probably too small rather than too big, because many estimates share the same satellites or methods, so their errors are linked.
- Turning a change in volume into a change in mass needs a density for the lost ice and snow, which is hard to pin down over short periods.
- Ice lost at the front of glaciers that end in the sea or in lakes is captured by the satellite and map methods, but the mass lost as the front retreats is not counted separately, and ice sitting below sea level does not add to the sea level figure. The authors say the effect on global sea level is small.
- In some regions the gravity data were left out: where glaciers are small and the signal is noisy, where nearby signals leak in (parts of High Mountain Asia), and for the glaciers around the edges of the ice sheets.
- Independent checks are hard: in some regions the methods still disagree noticeably.
