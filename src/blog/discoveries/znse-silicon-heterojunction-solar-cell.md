---
title: "ZnSe/silicon heterojunction solar cell: 22.8 % in a SCAPS-1D study"
summary: "A 2025 simulation puts a zinc selenide buffer on a silicon absorber and reaches 22.8 % efficiency. Here is how to check its I-V figures with a free tool."
tools: [solar-cell-iv, tauc-plot, carrier-concentration]
updated: 2026-11-10
sources:
  - "Standard test light of 1000 W/m² (100 mW/cm²) and the single-diode model of a solar cell: standard photovoltaics."
  - "The I-V curve in the worked example is made up by fibub from a single-diode model; it is not data from the paper."
paper:
  title: "Optimizing Zinc Selenide and Silicon-Based Heterojunction Solar Cells for Enhanced Photovoltaic Performance"
  authors: "Laouid A, Alaoui Belghiti A, Abouais A, Wisniewski K, Tlemçani M, Płóciennik P, Hajjaji A, Zawadzka A"
  journal: "Solar"
  year: 2025
  doi: "10.3390/solar5030029"
  url: "https://doi.org/10.3390/solar5030029"
  licence: "CC BY 4.0"
  reviewed: true
---

Most solar panels sold today are silicon, and one way to push them further is to top the silicon with a thin layer of a different semiconductor, making a heterojunction. In June 2025 a team publishing in the journal Solar modelled four such designs and found that a stack of tin oxide, zinc selenide (ZnSe), p-type silicon and a heavily doped silicon back layer could reach about 22.8 % efficiency, while avoiding toxic cadmium. Every number in a study like this comes from a current-voltage (I-V) curve, and the [[solar-cell-iv]] tool reads such a curve in your browser, so you can test the figures yourself or measure a real cell the same way.

## What they found

The best design the authors settled on, SnO₂/ZnSe/p-Si/p⁺-Si with a gold back contact, gave in their model an open-circuit voltage of 0.734 V, a short-circuit current density of 40.33 mA/cm², a fill factor of 77.05 % and an efficiency of 22.82 %. They paired it with a series resistance of 1.5 Ω·cm² and a shunt resistance of 4 × 10⁵ Ω·cm².

Along the way they report several trends. A thicker back surface field (the heavily doped layer at the rear that pushes electrons away from the back contact) helped until about 2 µm, after which gains flattened. Defects at the SnO₂/ZnSe interface hurt far more than defects at the ZnSe/silicon interface. A back contact metal with a work function above roughly 4.8 eV was needed, and every figure of merit fell as the cell warmed from 300 to 420 K.

## Why it matters

Cadmium sulfide is a common buffer layer in thin-film cells, but cadmium is toxic. Zinc selenide has a wide band gap, so it lets most sunlight through to the silicon, and it avoids cadmium. A model that ranks the layers by how much they matter tells experimental groups where to spend their effort: here, on a clean top interface rather than the lower one.

## How they did it

The team used SCAPS-1D, a free program that solves the equations for electrons and holes moving through a stack of thin layers in one dimension. For each layer you set thickness, band gap, doping and defect density; the program returns the I-V curve under standard light. The authors swept one setting at a time and kept the best value before moving on. No cells were built: these are predictions, which the paper presents as a guide for later experiments.

## Check it yourself with fibub

The quickest check needs no software at all. Under standard test light the cell receives 100 mW/cm², and efficiency is Voc × Jsc × FF divided by that. With the paper's headline values, 0.734 V × 40.33 mA/cm² × 0.7705 = 22.81 mW/cm², or 22.81 %, which agrees with the reported 22.82 % to within rounding. The three numbers fit together.

The interesting question is how much series resistance costs. For that, use a whole curve. Here is a worked example with **our own made-up cell**, drawn from the single-diode model, not from the paper:

- Area 1 cm², photocurrent 40 mA, saturation current 1 × 10⁻¹² A, ideality factor 1.2, series resistance 1.5 Ω, shunt resistance 400 kΩ, 25 °C.
- Points every 0.01 V from −0.02 V to 0.76 V.

1. Paste the two columns (volts, then milliamps) into the I-V box, or open a CSV file. Choose *Current (mA)*.
2. Type the cell area (1 cm²) and the irradiance (1000 W/m²). Set the temperature to 25 °C and leave *Cells in series* at 1.
3. Leave *Fit the single-diode model* ticked.

For our curve the page reads Isc = 40.00 mA (Jsc = 40.00 mA/cm²), Voc = 0.7526 V, Pmax = 22.915 mW at about 0.61 V, FF = 76.12 % and efficiency 22.91 %. The slope near Voc gives 2.4 Ω, more than the 1.5 Ω we used, because that slope also contains the diode's own resistance; the page labels it an upper limit for that reason. The diode fit recovers n = 1.200 and Rs = 1.500 Ω, the values the curve was made with.

Now make the same cell again with Rs = 8 Ω and nothing else changed. Voc stays at 0.7526 V and Isc barely moves, but the fill factor drops to 47.69 % and efficiency to 14.36 %. That is the pattern the paper describes in words: resistance eats the fill factor, not the voltage. If you measure real cells, this is the plot to look at first.

To go further, read the band gap of a ZnSe or other window film from its transmission spectrum with the [[tauc-plot]], and estimate the doping in a layer with the [[carrier-concentration]] calculator.

## The fine print

- This is a simulation study. Real interfaces, contacts and light losses usually pull measured efficiencies below the modelled ones.
- The paper quotes several efficiencies above 24 % in its parameter sweeps; the 22.82 % figure belongs to the final, combined design. When you compare, use the numbers from the same configuration.
- One-at-a-time sweeps can miss settings that only work together.
- The single-diode model in our example is a simplification. Real cells may need a second diode, and an ideality factor far from 1 to 2 is a sign of that.
