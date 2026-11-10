---
name: Delta E calculator
num: 418
shelf: science
code: T306
section: heritage-conservation
title: "Delta E calculator"
summary: "Compare two colours measured as CIELAB, LCh, XYZ or sRGB and get ΔE*ab (1976), ΔE94 and CIEDE2000 with your own kL, kC and kH, plus lightness, chroma and hue changes and swatches. Paste or open a before-and-after table to check a whole fading survey of museum objects. Nothing is uploaded."
status: live
ads: false
order: 418
icon: eye
works: offline
updated: 2026-11-09
related: [light-exposure-budget, beer-lambert-calculator, uncertainty-calculator, plot-maker, heritage-climate-checker, colour-vision-simulator]
sources:
  - "CIELAB, ΔE*ab and ΔE94: CIE 15 (Colorimetry) and CIE 116 formulas. CIEDE2000: G. Sharma, W. Wu and E. N. Dalal (2005), Color Research and Application 30, 21-30, whose published test pairs are used in fibub's tests. sRGB: IEC 61966-2-1 matrix and transfer curve; Bradford chromatic adaptation."
  - "Checked against colour-science 0.4.7 (Python) on 2,000 random colour pairs: ΔE76, ΔE94 (both weightings), CIEDE2000 with random kL, kC and kH, LCh, and sRGB to Lab under D65 and D50, all within 10⁻¹²."
  - "The fading survey example is made up for this tool; it is not a measurement of any real object."
flow:
  - { icon: pencil, label: "Colours" }
  - { icon: calculator, label: "ΔE" }
  - { icon: table, label: "Survey" }
  - { icon: chart, label: "Chart" }
---

## What it does

Conservators, colour scientists and print and textile labs measure colour with a spectrophotometer or colorimeter and compare readings over time: has a dyed textile faded on display, has a varnish yellowed, did a cleaning test change the paint? A single number for "how different" is the colour difference, ΔE. This calculator gives the three CIE versions side by side:

- **ΔE*ab (1976)**: the straight distance between the two points in CIELAB. Simple, but it overstates differences in strong colours.
- **ΔE94**: weights chroma and hue differences by the chroma of the reference colour, so it is not symmetric: the before reading is the reference.
- **ΔE00 (CIEDE2000)**: the current CIE recommendation, with extra corrections for blue hues and near-greys. The **parametric factors** kL, kC and kH let you weight lightness, chroma and hue; 1, 1, 1 is the reference setting.

It also splits the change into ΔL* (lighter or darker), ΔC* (more or less saturated) and ΔH* (hue), and says in words what happened, which is often more useful than the total.

Plan how much more light an object may take with the [[light-exposure-budget|light exposure budget]], and check the room's temperature and humidity with the [[heritage-climate-checker|heritage climate checker]].

## How to use it

1. Choose what your numbers are: **CIELAB**, **LCh**, **XYZ** (with Y = 100 for the white) or **sRGB** (0 to 255, or hex codes). Switching converts the two colours on screen.
2. Pick the **reference white**. It only matters when converting from XYZ or sRGB; for L*a*b* or LCh values ΔE does not depend on it.
3. Type the **before** (reference) and **after** colours. The swatches give a rough screen preview.
4. For a survey, paste one object or measuring spot per line into **Fading survey**: a name, then three before and three after numbers, or press **Open a file** for a CSV or Excel file. Set the **flag level** your institution uses.

## Worked example

The page opens with a made-up red silk band measured before and after a display: L*, a*, b* = 42.1, 48.3, 22.6 before and 44.0, 44.9, 21.8 after. It shows **ΔE00 = 2.07**, ΔE94 2.19 and ΔE*ab 3.98. ΔL* is +1.90 and ΔC* is −3.41: the colour got lighter and less saturated, which is what fading looks like. ΔE*ab is almost twice ΔE00 because the red is strongly saturated, where the 1976 formula overstates changes.

The example survey has six made-up samples. With the flag level at 2, the summary reads "6 samples: mean ΔE00 1.80, largest 3.53 (Green wool leaf); 3 at or over 2". The yellow silk thread has the biggest ΔE*ab (7.58) but only ΔE00 2.20, again because most of its change is chroma in a very saturated colour. The black outline barely moved (ΔE00 0.39).

## Tips

- Measure the same spots each time (a template or photographs help), with the same instrument, aperture, illuminant and observer, and specular component included or excluded the same way.
- Average several readings per spot. Differences under about 1 ΔE00 are often within the repeatability of hand-held instruments.
- Use the CSV download to keep the record; it has all three formulas and the components.

## FAQ

**Which ΔE should I report?** CIEDE2000 for new work, and say which kL, kC and kH you used. Give ΔE*ab as well if you compare with older records that used it.

**Why are the swatches not exactly right?** Screens are not calibrated, and some measured colours lie outside what an sRGB screen can show; the page says when a swatch is clipped.

**Is my data uploaded?** No. Everything runs in your browser and keeps working offline.
