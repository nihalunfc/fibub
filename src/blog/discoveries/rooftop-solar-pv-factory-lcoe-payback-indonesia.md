---
title: "Rooftop solar PV for a factory in Indonesia: LCOE, payback and the discount rate"
summary: "A 2025 study sized a 599 kWp rooftop solar plant for a consumer-goods factory in Indonesia and found a 3.7-year payback. See how a discount rate changes its cost per kWh."
tools: [lcoe-calculator, solar-pv-yield, npv-irr-calculator, home-battery-sizing]
updated: 2026-11-10
sources:
  - "Galevien AP, Ridwan MK, Wardana ANI (2025), Energies 18(21): 5859, CC BY, the paper described here."
  - "Levelised cost of energy as discounted lifetime cost over discounted lifetime energy: standard energy economics."
  - "The costs and rates in the worked example are made up by fibub."
paper:
  title: "Assessing the Viability of Rooftop Solar PV in Energy-Intensive Industries: A Techno-Economic and Safety Framework for the Indonesian FMCG Sector"
  authors: "Galevien AP, Ridwan MK, Wardana ANI"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18215859"
  url: "https://www.mdpi.com/1996-1073/18/21/5859"
  licence: "CC BY"
  reviewed: true
---

Factories that make everyday goods such as soap, drinks and snacks run chillers, compressors and pumps all day, and their flat roofs sit in strong tropical sun. A study published in Energies in November 2025 worked through the case for covering part of one Indonesian factory's roof with solar panels: how big the plant can be, what it costs per kilowatt-hour, how fast it pays back, and what has to be done to keep it safe. The authors report a cost of about Rp 261 per kWh against a grid price of about Rp 1,445, and a payback of under four years. This page explains the study and shows, with the [[lcoe-calculator]], how much such a figure depends on the discount rate. To estimate the yearly output for your own roof first, start with [[solar-pv-yield]]; to judge the investment by net present value and internal rate of return, follow on with the [[npv-irr-calculator]].

## What they found

The design came out at about 599 kWp of panels (kilowatts peak: the output under standard test sunlight), 1,076 modules feeding five inverters with 500 kW of AC output, so the panels can deliver 1.2 times what the inverters pass on. With 4.5 to 4.8 kWh per kWp of sun a day and a capacity factor of about 18 % (average output as a share of full output), the plant makes about 944 MWh a year.

From a capital cost of Rp 8.5 million per kWp and running costs of Rp 80,000 per kWp a year over 25 years, the authors report a levelised cost of Rp 261.40 per kWh (about 1.6 US cents), yearly savings near Rp 1.36 billion, a payback of 3.73 years and a cut of up to 37 % in the power drawn from the grid for that part of the plant. Their sensitivity check found the grid tariff matters most for the return, then the capital cost.

## Why it matters

Indonesia stopped paying for rooftop power exported to the grid under a 2024 regulation, so a factory now gains only from the solar power it uses itself. That makes a plant sized to the daytime load, like this one, the sensible model. The study also brings fire and electrical safety into the same framework as cost, which is often where industrial rooftop projects stall.

## How they did it

The team mapped the usable roof sections (mostly flat, some tilted 5 to 10°), set module rows 1.2 m apart, chose the inverter split, and estimated output from local sun figures with yearly panel ageing of 0.5 to 0.7 %. They added up the capital and running costs, divided by the lifetime energy, and compared the result with the grid tariff under self-use shares of 85 to 100 %.

## Check it yourself with fibub

The LCOE formula in the paper adds the capital cost and the running costs and divides by the lifetime energy, with no discounting. Discounting treats a kilowatt-hour or a rupiah in year 20 as worth less than one today, which is how lenders and investors see a project. The [[lcoe-calculator]] does the discounted sum, with a year-by-year table, so you can watch the effect.

Here is a **made-up plant** with our own round numbers, in an invented currency (not the paper's costs):

1. Set capacity to 0.6 MW, capital cost 600 per kW, fixed O&M 6 per kW per year, variable O&M, fuel price and heat rate all 0.
2. Set the capacity factor to 18 %, output loss to 0.6 % a year, lifetime 25 years and the O&M cost rise to 3 % a year.
3. Set the discount rate to 0. The tool gives an LCOE of about 22.30 per MWh (0.0223 per kWh), from about 946 MWh in year 1 and 22,025 MWh over the life. This is the same kind of plain average the paper used.
4. Now set the discount rate to 4 %, then 8 %, then 12 %. The LCOE climbs to about 31.39, 42.62 and 55.42 per MWh. At 8 % the cost is nearly double the undiscounted one, because the money is spent up front while the energy arrives over 25 years.
5. Look at the tornado chart at 8 % with the default ± 20 %. The capacity factor swings the LCOE from about 35.5 to 53.3 per MWh, the capital cost from about 35.1 to 50.1, and the discount rate from about 37.9 to 47.6. Running costs and ageing barely move it.

For the paper's plant, even doubling its LCOE would leave it far below the grid tariff, so the main conclusion holds. But when you compare it with other studies, which nearly always discount, convert first: an undiscounted LCOE will look cheaper than it is.

## The fine print

The study covers a single factory, without hourly load data, so how much of the solar output the plant really uses is estimated, not measured. There is no battery, so the savings stop at sunset. Panel heating on a crowded roof was not modelled in detail, and the solar plant covers only the utility area, a small part of the factory's total demand. The paper gives no discount rate, and two savings figures in the text differ slightly (above Rp 1.2 billion and Rp 1.36 billion a year). Tariffs and rules change: check the official source before planning a project.
