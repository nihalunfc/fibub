---
title: "Plant leaf extracts protect mild steel from acid corrosion"
summary: "A 2025 study found that a mix of two leaf extracts cut the corrosion current of mild steel in 1 M HCl by about 96 %. Here is how to check such Tafel results and turn them into mm per year."
tools: [tafel-corrosion-rate, impedance-fitter, nernst-calculator]
updated: 2026-11-10
sources:
  - "Kerouad S et al. (2025), RSC Sustainability 3(12): 5580-5593, CC BY 3.0, the paper described here."
  - "Corrosion rate from current density: ASTM G102. Weight-loss rate: ASTM G1 and G31. Inhibition efficiency = (i0 - i) / i0 x 100: standard practice."
paper:
  title: "Synergistic effect between Anemone coronaria and Quercus robur leaf extracts on mild steel corrosion in HCl 1 M solution: electrochemical and computational study"
  authors: "Kerouad S, El-Gheryby Y, Forsal I, Edaala M, Kabiri L, Mbarki M, Bouissane L"
  journal: "RSC Sustainability"
  year: 2025
  doi: "10.1039/D5SU00738K"
  url: "https://pubs.rsc.org/en/content/articlelanding/2025/su/d5su00738k"
  licence: "CC BY 3.0"
  reviewed: true
---

Hydrochloric acid is used to clean scale and rust off steel, and it attacks the steel too. Factories add small amounts of a corrosion inhibitor to slow that down, and many common inhibitors are toxic. A team in Morocco tested leaf extracts of the poppy anemone (*Anemone coronaria*) and the English oak (*Quercus robur*) instead, and found that the two together worked better than either alone. The paper appeared in RSC Sustainability in 2025 under a CC BY licence; this page explains it in our own words. If you have polarisation scans of your own, the [[tafel-corrosion-rate]] page reads them and turns the corrosion current into a rate in millimetres per year, and the [[impedance-fitter|impedance fitter]] handles the matching impedance data.

## What they found

Mild steel in 1 M hydrochloric acid at 20 °C corroded far more slowly when the extracts were present. At 0.5 g of extract per litre, each extract on its own gave more than 90 % protection in impedance tests, and the mix of the two did a little better still. In the polarisation tests the paper reports the corrosion current density falling from about 230 µA/cm² without extract to about 8.9 µA/cm² with the mix, an inhibition efficiency of about 96 %.

The extracts slowed both the metal dissolving and the hydrogen being made, so the authors call the mix a mixed-type inhibitor. Their adsorption data fit a Langmuir isotherm, the simple picture of one layer of molecules sitting on surface sites. Warming the acid to 50 °C cut the protection to about 61 %, a sign the molecules are held only weakly.

## Why it matters

Acid pickling and descaling are everyday jobs in steel works, boilers and oil wells. An inhibitor made from leaves can be cheaper and is often less hazardous than synthetic ones. That two extracts beat either alone suggests designing blends, rather than hunting for one perfect molecule.

## How they did it

1. They dried and ground the leaves, stirred the powder in acetone for two days, filtered it and evaporated the solvent.
2. They dissolved the crude extract in 1 M HCl and diluted it to between 0.1 and 0.5 g/L.
3. Coupons of AISI 1018 mild steel were the working electrode, with a platinum counter electrode and a saturated calomel reference electrode (SCE).
4. After half an hour at rest, they recorded impedance spectra and then swept the potential from −750 to −100 mV at 1 mV per second.
5. They read the corrosion current from the straight parts of the Tafel plot, and backed the results up with infrared spectra, electron microscope images and computer models of the main molecules.

## Check it yourself with fibub

Here is a worked example with **our own invented scans**, not the paper's data. We made two curves from the Wagner–Traud equation, i = icorr[10^(η/βa) − 10^(−η/βc)], from −750 to −100 mV in 1 mV steps:

- "Bare acid": Ecorr −500 mV, icorr 200 µA/cm², βa 70 and βc 120 mV per decade.
- "With extract": Ecorr −470 mV, icorr 12 µA/cm², βa 60 and βc 110 mV per decade.

Steps:

1. Paste the potential and current columns into the polarisation curve box, or use Open a file for a CSV from your potentiostat.
2. Set the potential unit to V and the current unit to A/cm². If your file holds plain current, pick A or mA and type the electrode area.
3. Keep the Tafel range at 80 to 200 mV from Ecorr, and pick iron or carbon steel as the metal (equivalent weight 27.92 g, density 7.87 g/cm³).
4. Read the table: one row each for Tafel extrapolation, the Wagner–Traud fit and Stern–Geary.

For the bare scan, the Tafel lines give an icorr of about 197 µA/cm², and the fit returns the 200 µA/cm² we built in. That is **2.32 mm per year** (91 mpy), or a loss of about 50 g of steel per square metre per day. With extract, the fit gives 12.0 µA/cm², or **0.139 mm per year** (5.5 mpy).

Inhibition efficiency is one line by hand: (200 − 12) ÷ 200 × 100 = **94.0 %**. Using the polarisation resistance instead, 95.2 and 1,374 Ω·cm², gives (1374 − 95.2) ÷ 1374 × 100 = **93.1 %**. The two differ because the Tafel slopes changed, which shifts the Stern–Geary constant B from about 19.2 to 16.9 mV. Report which method you used.

The paper gives no rate in millimetres per year. Its headline currents, run through the same ASTM G102 sum, come to about 2.7 mm/y without extract and 0.10 mm/y with the mix.

No weight-loss test was reported. If you run one, the coupon card on the same page does it: a 10 cm² coupon that loses 0.0150 g in 24 h is corroding at about 0.70 mm per year (our numbers). For the equilibrium potential of iron in your solution, try the [[nernst-calculator]].

## The fine print

- The extracts are crude mixtures. Which molecules do the work is inferred from infrared bands and computer models, not measured.
- The working electrode area is not stated, so currents cannot be rechecked from raw values.
- The paper does not say over which potential window the Tafel lines were drawn, and the blank slopes are large, so the icorr values carry more doubt than the decimals suggest.
- One acid strength, short tests and up to 50 °C only.
- There is no weight-loss check, and some numbers differ between sections of the paper. Read the full paper for exact values.
