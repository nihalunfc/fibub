---
name: Dissolved oxygen and plankton density calculator
num: 841
shelf: science
section: chemical-and-biological-oceanography
title: "Dissolved oxygen solubility, % saturation and AOU in fresh and sea water (mg/L, µmol/kg, mL/L), plus plankton counts to cells per litre"
summary: "Work out oxygen solubility from temperature, salinity and air pressure, then the percent saturation and apparent oxygen utilisation (AOU) of your samples, in mg/L, µmol/kg, µmol/L or mL/L. Paste a whole profile, and turn plankton counts into cells per litre or individuals per cubic metre with a 95 % range."
status: live
ads: true
order: 841
icon: flask
works: offline
updated: 2026-11-09
related: [water-quality-index, biodiversity-indices, hemocytometer]
sources:
  - "Garcia, H. E. and Gordon, L. I. (1992), Oxygen solubility in seawater: better fitting equations, Limnology and Oceanography 37, 1307–1312 (erratum 1993, 38, 656): the Benson and Krause fit in µmol/kg, as used in TEOS-10's GSW O2sol."
  - "Benson, B. B. and Krause, D. (1984), Limnology and Oceanography 29, 620–632 (pressure correction); Weiss, R. F. and Price, B. A. (1980), Marine Chemistry 8, 347–359 (water vapour pressure); UNESCO (1981) / Millero and Poisson (1981) sea-water density at the surface."
  - "Lund, J. W. G., Kipling, C. and Le Cren, E. D. (1958), Hydrobiologia 11, 143–170 (counting precision). Equations written into code by fibub; no tables copied."
  - "Checked 2026-11-09 against gsw 3.6 (O2sol_SP_pt) on 2000 random temperatures and salinities, the Benson and Krause mg/L fit for fresh water, and SciPy for the Poisson limits."
  - "The example profile and plankton numbers are made up by fibub; they are not real measurements."
flow:
  - { icon: sliders, label: "Water" }
  - { icon: percent, label: "Saturation" }
  - { icon: table, label: "Profile" }
  - { icon: calculator, label: "Plankton" }
---

## What it does

Oxygen dissolves less in warm water, in salty water and at low air pressure. This page works out how much oxygen water holds when it is in balance with the air (its **saturation** or **solubility**), and compares your measurements with it:

- **Saturation** at your temperature, salinity and barometric pressure (or altitude), in **mg/L, µmol/kg, µmol/L and mL/L**, using the Garcia and Gordon (1992) equation, the one oceanographers use in the TEOS-10 toolbox.
- **Percent saturation** and **AOU** (apparent oxygen utilisation, saturation minus measured) for one measurement, with the measurement turned into every other unit.
- A **solubility curve** from 0 to 40 °C for fresh water and your salinity, with a CSV table.
- A **profile or a batch of samples**: paste or open depth, temperature, salinity and oxygen, and get saturation, % saturation and AOU for every line, with a profile chart and a CSV.
- **Plankton counts to densities**: cells per litre from a counting chamber and a concentrated water sample, or individuals per cubic metre from a net tow, with an exact 95 % range from the Poisson distribution and the counting precision.

## How to use it

1. Type the **temperature** and **salinity** (0 for fresh water, about 35 for the open sea), and the **barometric pressure** in hPa as measured (not corrected to sea level), or choose **altitude** instead.
2. Read the saturation in the unit you need. Type your **measured oxygen** and choose its unit to get % saturation and AOU.
3. For many samples, paste or open a table of label or depth, temperature, salinity and oxygen, and choose the oxygen unit. Untick **First column is depth** if the first column is a sample name.
4. For plankton, choose a water sample or a net tow, then type the count and the volumes. For a split sample, type the share you counted as a fraction such as 1/8.
5. Download the tables as CSV, or everything as an image, PDF or Word report.

## Worked example

Sea water at **15 °C**, salinity **35**, at **1013.25 hPa** holds **8.13 mg/L** of oxygen at saturation: **247.8 µmol/kg**, **254.2 µmol/L** or **5.69 mL/L** (the density, 1025.97 kg/m³, links per kg and per litre). A measurement of **230 µmol/kg** is **92.8 %** saturated, and its AOU is **17.8 µmol/kg** (0.41 mL/L). Fresh water at the same temperature holds more: **10.08 mg/L** (315.4 µmol/kg).

In the made-up example profile, the top 20 m are slightly supersaturated (AOU −3.9 and −6.8 µmol/kg, 101.7 % and 102.9 %), and the oxygen minimum sits near 800 m at 23.4 % saturation, with an AOU of 235.8 µmol/kg.

For plankton: **230 cells** counted in **1 mL** of a sample concentrated from **1000 mL to 20 mL** (× 50) is **4600 cells per litre**, with a 95 % range of **4020 to 5230 cells/L** and a counting precision of about **± 13.2 %**.

## Tips

- Measure the barometric pressure on site; a weather report's pressure is usually corrected to sea level and will be too high in the hills.
- Oxygen sensors often report mg/L using their own solubility tables; compare % saturation values with care.
- Count at least 100, and ideally 400, cells of the main species for a precise density.

## FAQ

**What temperature scale?** ITS-90 (any modern thermometer). The equation was fitted on the older 1968 scale, so the page converts, as TEOS-10 does.

**Why does the per-litre value depend on salinity?** Litres and kilograms differ by the water's density, which rises with salt and falls with warmth.

**Can I use it for lakes and rivers?** Yes: set salinity to 0. For brackish water, use the measured salinity.
