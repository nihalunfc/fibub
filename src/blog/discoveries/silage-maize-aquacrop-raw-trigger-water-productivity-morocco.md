---
title: "Silage maize water productivity in Morocco: AquaCrop, RAW triggers and mulch"
summary: "A study of 17 drip-irrigated maize fields in Souss-Massa tested irrigation triggers, deficit irrigation and mulch in AquaCrop. Here is the idea, and how to test triggers yourself."
tools: [irrigation-scheduler, et0-calculator]
updated: 2026-11-10
sources:
  - "Benaly MA et al. (2026), Frontiers in Agronomy 7: 1736967, CC BY, the paper described here."
  - "Allen RG, Pereira LS, Raes D and Smith M (1998), Crop evapotranspiration, FAO Irrigation and Drainage Paper 56 (the water-balance method the scheduler uses)."
paper:
  title: "Assessing maize water productivity and management strategies with AquaCrop under semi-arid conditions in Morocco"
  authors: "Benaly MA, Kharrou MH, Bouras EH, Brouziyne Y, Brih A, Beniaich A, Chehbouni A, Bouchaou L"
  journal: "Frontiers in Agronomy"
  year: 2026
  doi: "10.3389/fagro.2025.1736967"
  url: "https://www.frontiersin.org/journals/agronomy/articles/10.3389/fagro.2025.1736967/full"
  licence: "CC BY"
  reviewed: true
---

In the Souss-Massa region of Morocco, groundwater is falling and farmers grow thirsty crops such as silage maize for dairy cattle. A research team calibrated the crop model AquaCrop on 17 drip-irrigated maize fields, then used it to ask how farmers could get more feed from each cubic metre of water: by changing when they irrigate, by giving less than full crop demand, by mulching the soil, or by sowing earlier. The paper was published in Frontiers in Agronomy (volume 7, online January 2026) under a CC BY licence. Here we explain it in our own words, and show how the [[irrigation-scheduler]] lets you try the same kind of irrigation trigger on a soil water balance. You will need daily reference evapotranspiration first, which the [[et0-calculator]] works out from weather data.

## What they found

AquaCrop reproduced the measured canopy cover, soil water and biomass closely, with model errors of about 1 t/ha for biomass. The scenarios then showed several ways to save water:

- Waiting until the soil had dried past its "readily available water" (RAW), to 120 % of it, cut soil evaporation by about 41 % and raised water productivity by about 14 %, while biomass fell by only about 5 %.
- Plastic mulch removed most of the evaporation from bare soil and raised water productivity by about 35 % in the model. Straw mulch helped less.
- Giving 75 % of full crop water demand was the authors' best trade-off. Full demand used about a third more water for only about 6 % more biomass.
- Sowing 40 days earlier gave about 8 % more biomass.

## Why it matters

Silage maize is sold by the tonne of biomass, and water is the limit. Farmers often irrigate on habit or on a fixed calendar. A model that has been checked against real fields lets planners test choices that would take years to trial, such as mulch or sowing dates, before they spend money on them.

## How they did it

1. They monitored 17 farmer fields over 2022 to 2024, one season each, using seven to calibrate the model and ten to test it.
2. They measured soil water, canopy cover (also from Sentinel-2 satellite images) and biomass, and the soil's field capacity and wilting point in the lab.
3. They computed reference evapotranspiration with the FAO Penman-Monteith equation from a local weather station.
4. They tuned AquaCrop's crop settings until simulated and measured values agreed, and scored the fit with R², the root mean square error and the Nash-Sutcliffe efficiency.
5. They ran scenarios: irrigation triggers at 70, 100 and 120 % of RAW, deficit irrigation at 50, 75 and 100 % of crop demand, mulches and sowing dates.

## Check it yourself with fibub

The [[irrigation-scheduler]] uses the simpler FAO-56 "checkbook" balance with one crop coefficient, not AquaCrop. But it has the same trigger idea: irrigate when depletion reaches a chosen percentage of RAW. Everything below uses **our own made-up soil and the tool's built-in made-up season**, not the paper's data.

**Step 1: describe the soil and crop.** Type field capacity 32 % and wilting point 18 % by volume (a plausible clay loam), root depth 0.8 m, depletion fraction p 0.55 and Kc 1.2 (a mid-season maize value from FAO-56). Set the first day's depletion to 20 mm. The tool works out total available water as 1000 × (0.32 − 0.18) × 0.8 = **112 mm**, and RAW as 0.55 × 112 = **61.6 mm**.

**Step 2: rain and irrigation.** Keep rain that counts at 90 % and ignore rain below 2 mm. Choose "Suggest when to irrigate" and set application efficiency to 90 %, reasonable for drip.

**Step 3: load a season.** Press "Use the example" for 61 made-up summer days of ET0 and rain, or paste your own from the ET0 calculator.

**Step 4: try three triggers.** Change "Irrigate when depletion reaches" and note the summary:

| Trigger (% of RAW) | Irrigations | Net water (mm) | Water applied (mm) | Stress days |
|---|---|---|---|---|
| 70 | 7 | 326.1 | 362.3 | 0 |
| 100 | 5 | 331.1 | 367.9 | 0 |
| 120 | 4 | 306.2 | 340.2 | 8 |

Across the whole run, the crop wants 401.0 mm. At the 120 % trigger it actually uses 393.2 mm, because on 8 days the soil is drier than RAW and the tool's stress factor Ks falls (to 0.77 at its lowest). At 100 %, a 38 mm storm two days after a refill sends 23.8 mm below the roots. Fewer, bigger irrigations save labour but run the soil drier for longer.

What the single-Kc balance cannot show is the paper's key gain: splitting water use into evaporation from wet soil and transpiration through leaves. AquaCrop found that drier topsoil wastes less water to evaporation. Our tool lumps both into one crop water use.

## The fine print

- The scenario results are model runs, not field trials. Only the calibration and testing used measured data.
- Each field was followed for one season only, and one weather station stood in for all 17 fields.
- Some soil water properties were estimated from texture where lab data were missing, and the crop's water-productivity setting was kept at the model default.
- The paper gives the farmers' water use as about 323 to 330 mm in different places; read it for the exact figures.
- Our example soil, crop values and season are invented. For a real field, use your own soil test, local Kc values and your adviser's guidance.
