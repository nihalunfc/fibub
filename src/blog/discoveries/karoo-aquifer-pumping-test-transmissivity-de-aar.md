---
title: "Pumping tests in a Karoo fractured aquifer: transmissivity, storativity and recharge at De Aar"
summary: "A 2025 study ran pumping and recovery tests in Karoo rock near De Aar, South Africa, to map local and regional recharge. See how to fit Theis and Cooper-Jacob to your own test."
tools: [pump-test-analyser, slug-test-analyser, well-field-drawdown, piper-diagram]
updated: 2026-11-10
sources:
  - "Baloyi L, Kanyerere T, Muchingami I, Pienaar H, Igwebuike N, Mukhawana MB (2025), Water 17(18): 2709, CC BY, the paper described here."
  - "Theis (1935) well function and the Cooper and Jacob (1946) straight-line approximation: standard hydrogeology."
  - "The pumping test in the worked example is made up by fibub from a Theis curve, rounded to the centimetre."
paper:
  title: "Utilizing Aquifer Hydraulic Parameters to Assess Local and Regional Recharge Potentials for Enhancing Water Allocations in Groundwater-Dependent Areas in De Aar, Northern Cape, South Africa"
  authors: "Baloyi L, Kanyerere T, Muchingami I, Pienaar H, Igwebuike N, Mukhawana MB"
  journal: "Water"
  year: 2025
  doi: "10.3390/w17182709"
  url: "https://www.mdpi.com/2073-4441/17/18/2709"
  licence: "CC BY"
  reviewed: true
---

De Aar, a railway town in South Africa's dry Northern Cape, drinks almost entirely from boreholes. Deciding how much each borehole may pump comes down to two numbers for the rock around it: how easily water moves through it (transmissivity) and how much water it releases as the water level falls (storativity). In September 2025 a team writing in the journal Water ran pumping tests at three spots along the Brak River catchment and used those two numbers to tell apart places fed by local rain from places fed by water travelling in from further away. This page explains the study, then shows how to fit the same Theis and Cooper-Jacob methods to your own test data in the [[pump-test-analyser]]. For quick single-well checks the [[slug-test-analyser]] is the step before, and the [[well-field-drawdown]] tool is the step after, when you want to see how several pumping wells add up.

## What they found

Transmissivity (T, in square metres per day) is how much water flows through a one-metre-wide strip of the whole aquifer under a unit slope of the water table. Storativity (S, no units) is the volume of water released per square metre of aquifer for each metre the head drops.

With their main method the team found T from about 213 to 596 m²/day, and S from about 0.00003 to 0.0002. The upper and middle parts of the catchment came out higher than the lower part. The authors read this as two kinds of recharge: in the upper catchment, rain soaks in close by; in the lower catchment, the water arrives along fractures from a wider region. Their point is practical: if a water manager treats the whole area as one aquifer, some boreholes will be given too much water and others too little.

## Why it matters

Karoo rock covers a large share of South Africa, and its water sits mostly in cracks around dolerite (an igneous rock that cut through the sediments). Fractured rock is patchy, so a value measured in one borehole may not hold a kilometre away. Turning a handful of tests into fair sharing rules matters most in towns with no river or dam.

## How they did it

At each of three sites the team pumped one borehole at a steady rate for 8 to 12 hours, read the water level with a dip meter in the pumped hole and in two observation boreholes, then kept reading while the water came back up (a recovery test). They analysed the readings with derivative plots, which show the flow pattern (water from the well bore itself, flow along a single fracture, or fracture and rock block both giving water), and with the Flow Characteristics method. They then cross-checked with the Cooper-Jacob straight line, which gave T from about 55 to 563 m²/day.

## Check it yourself with fibub

The [[pump-test-analyser]] takes the time and drawdown from one observation well and fits both the full Theis curve and the Cooper-Jacob line, then gives T from the recovery readings as a separate check.

Here is a **made-up test** to try (our own numbers, not the paper's data). A borehole is pumped at 4 L/s for 600 minutes; an observation well stands 40 m away. Drawdown in metres at 1, 2, 5, 10, 20, 50, 100, 200, 400 and 600 minutes:

0.07, 0.13, 0.23, 0.32, 0.41, 0.54, 0.63, 0.73, 0.82, 0.88

1. Set the pumping rate to 4 and the rate unit to L/s, lengths in metres, times in minutes, and the distance to 40.
2. Paste the ten pairs of time and drawdown into the observation-well box.
3. Read the Theis fit: T is about 203 m²/day and S about 1.9 × 10⁻⁴.
4. Look at the Cooper-Jacob line. The tool keeps only the late readings where u (r²S ÷ 4Tt) is small enough; here it uses the last 6 and gives a slope of about 0.32 m per log cycle, T about 200 m²/day and S about 2.0 × 10⁻⁴. The two methods agree, which is a good sign the simple model suits the data.
5. In the recovery box, set how long the pump ran to 600, and paste the residual drawdown at the same ten times after it stopped: 0.81, 0.75, 0.64, 0.56, 0.47, 0.35, 0.27, 0.19, 0.13, 0.10. The recovery line gives T about 204 m²/day, and its value at t/t′ = 1 is close to zero, so the aquifer recovered fully.
6. Add a thickness of 25 m and the tool also gives hydraulic conductivity K = T ÷ thickness, about 8 m/day.

To extend the paper's work, enter each of your boreholes as a separate run and line up the T values by position in the catchment. When the late points bend away from the Theis curve, take that as a message, not noise: a boundary, leakage or a draining fracture network is changing the flow, as the derivative plots in the study showed.

## The fine print

The study's own limits are worth knowing. The tests ran less than 24 hours, so slow water from the rock blocks between fractures may not have shown up. Only nine boreholes were used, placed where boreholes already existed rather than by design. Theis and Cooper-Jacob assume an even, porous aquifer of endless extent, which fractured Karoo rock is not, and the authors note that storativity from such fits can be unrealistic; the Cooper-Jacob S values in the paper (up to about 0.04) sit far above the main-method values. Storativity also leaned on an assumed specific storage. A few numbers in the text do not quite agree with each other, so read the tables, not just the summary. For allocation rules, check the official source.
