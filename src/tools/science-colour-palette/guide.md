---
name: Science colour palette
num: 808
shelf: science
code: T544
section: figures-and-data-presentation
title: "Science colour palette maker: perceptually even, colour-blind safe palettes for plots"
summary: "Build sequential, diverging and qualitative colour palettes in OKLCH, a colour space where equal steps look equal. See the smallest colour difference for three kinds of colour blindness and in greyscale, check contrast with the background, preview bars and a heatmap, and copy the palette for CSS, matplotlib, R or JSON."
status: live
ads: true
order: 808
icon: chart
works: offline
updated: 2026-11-09
related: [figure-checker, plot-maker, graph-digitizer, colour-vision-simulator, contrast-checker, poster-layout, colour-difference-calculator]
sources:
  - "OKLab and OKLCH follow Björn Ottosson's published definition (2020); CIELAB uses the D65 white and CIEDE2000 the standard formula. The tests check them against colour-science on random colours."
  - "Colour-blind views use the Viénot, Brettel and Mollon (1999) method, shared with the figure checker and tested there against DaltonLens-Python. Contrast is the WCAG 2 ratio."
  - "The palettes are made by the page from your settings; the starting settings and the bars and heatmap are made up."
flow:
  - { icon: sliders, label: "Settings" }
  - { icon: eye, label: "CVD check" }
  - { icon: chart, label: "Preview" }
  - { icon: copy, label: "Export" }
---

## What it does

A good science palette does three things: equal steps in the data look like equal steps in colour, everyone can tell the colours apart (including the 1 in 12 men with colour blindness), and the figure still works printed in black and white. This page builds palettes that way and checks them.

- **Sequential** palettes run from light to dark for values from low to high (concentration, density, counts). Lightness falls in even steps; you set the hue, how far the hue turns along the way, the lightest and darkest ends and how colourful it is.
- **Diverging** palettes have two hues meeting at a light middle, for values either side of a meaningful centre (change from control, correlation, anomalies). Both sides get the same lightness at the same distance from the middle, so neither side looks stronger.
- **Qualitative** palettes are for groups with no order. Hues are spread evenly around the colour wheel at the lightness you choose, with a small lightness change so colours also differ in brightness. Leave the first hue blank and the page turns the wheel (in 1° steps) to the position where the closest pair is furthest apart for colour-blind viewers.
- **Check my colours** takes any list of hex codes you already use.

Check how the colours look to people with colour blindness in the [[colour-vision-simulator]], and test text against its background with the [[contrast-checker]].

## The checks

For normal vision, deuteranopia, protanopia, tritanopia and greyscale, the page finds the two colours that are closest (CIEDE2000 ΔE) and names them. For ordered palettes only neighbouring steps are compared, because those are the ones that need to differ. The headline says whether the closest pair under any kind of colour blindness stays above your warning level (10 by default, a common rule of thumb for bars and lines; small dots and thin lines need more). The table gives each colour's hex code, its OKLCH values and its contrast with the background; WCAG asks 3:1 for chart marks.

## How to use it

1. Pick the kind of palette and the number of colours (2 to 12).
2. Change the settings until the swatches, bars and heatmap look right. Use *See it as* to view the previews with colour blindness or in greyscale.
3. Set the background if your figure is not on white.
4. Choose an export format, then copy or download it. The matplotlib export gives a smooth and a stepped colour map (or a colour cycle for groups); the R export gives a vector and a ramp ready for ggplot2.

## Worked example

The page opens with a sequential palette of 6 colours: hue 250° (blue), turning −40° towards the dark end, lightness from 96 down to 26, colourfulness 0.13. It gives #e8f3ff, #89ccff, #2ba4dc, #007a9c, #005161 and #002a30. Lightness falls by 14 points per step, so the headline reads *Colour-blind safe at ΔE 10: closest neighbours 11.3 (Protanopia)*, and in greyscale the closest neighbours still differ by ΔE 10.2, which is the point of a lightness-driven scale. Three of the six (the lightest ones) are below 3:1 against white, a reminder to outline light bars or use a grey background for them.

Switch to **Check my colours** with the starting list of five made-up plotting colours: red #cc3333, blue #3366cc, green #33aa44, purple #9955aa and orange #ee8822. The headline turns into a warning: *Hard to tell apart: #33aa44 and #ee8822 differ by ΔE 4.15 with protanopia*. Red and green also fall to ΔE 9.19 with deuteranopia, against 22.8 or more for every pair with normal vision. The **Qualitative** builder with 6 colours does better: its closest pair for any kind of colour blindness is ΔE 12.1.

## Tips

- **Let lightness carry the order.** A rainbow scale has bright yellow in the middle, which makes a false edge. Sequential palettes here change lightness steadily.
- **Fewer colours are easier.** Most readers can keep 6 to 8 group colours apart. Beyond that, add markers, line styles or direct labels.
- **Diverging needs a real middle.** Use it only when the centre value means something (zero change, a reference).
- **Check on the real figure.** Open your finished image in the [figure checker](/science/figure-checker/) to see the whole figure as colour-blind readers do.

## Questions

**What is OKLCH?** A version of the OKLab colour space written as lightness (L), colourfulness or chroma (C) and hue angle (h). Equal changes in its numbers look about equally large, unlike RGB or HSL.

**Why did my colour come out less bright than I set?** Screens cannot show every colour. When a setting asks for more colour than sRGB can show at that lightness and hue, the page lowers the colourfulness until it fits.

**How sure is the colour-blind check?** It uses a standard model of dichromacy (a missing cone type), the strongest form. People with milder forms see more difference than the model shows, so a palette that passes here is safe for them too.
