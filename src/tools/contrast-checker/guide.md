---
name: Contrast and readability checker
num: 498
shelf: science
section: audiology-and-vision-science
title: "Colour contrast checker (WCAG AA and AAA) with colour-blind preview and readability score"
summary: "Check the WCAG 2.x contrast ratio of a text and background colour, see AA and AAA results for normal and large text and for buttons and icons, get the nearest colours that pass, preview them with colour vision deficiencies, and score the readability of your text."
status: live
ads: false
order: 38
icon: eye
works: offline
updated: 2026-11-09
related: [colour-vision-simulator, plot-maker, image-resizer, science-colour-palette, figure-checker, readability-checker, visual-acuity-converter, poster-layout]
sources:
  - "Contrast ratio, relative luminance and the AA and AAA thresholds: W3C Web Content Accessibility Guidelines (WCAG) 2.x, success criteria 1.4.3, 1.4.6 and 1.4.11 (checked 2026-11-09; check the official source). The sRGB linearisation uses the sRGB standard's 0.04045 threshold, as in WCAG 2.2."
  - "Flesch reading ease: Flesch R (1948), A new readability yardstick, Journal of Applied Psychology 32(3):221-233. Flesch-Kincaid grade: Kincaid JP, Fishburne RP, Rogers RL, Chissom BS (1975), Naval Technical Training Command research branch report 8-75. Syllables are estimated by our own spelling rule."
  - "Colour vision previews: Viénot, Brettel and Mollon (1999), as in the colour vision simulator."
  - "Checked in the tests against a hand Python implementation (ratios, a brute-force search for the nearest passing colour, readability counts)."
flow:
  - { icon: pencil, label: "Colours" }
  - { icon: check, label: "AA / AAA" }
  - { icon: eye, label: "CVD preview" }
  - { icon: book, label: "Readability" }
---

## What it does

Text is hard to read when it is too close in lightness to its background, especially for people with low vision, older eyes, colour vision deficiency, or anyone reading a phone in sunlight. The Web Content Accessibility Guidelines (WCAG) measure this with a **contrast ratio** from 1:1 (no contrast) to 21:1 (black on white). This page works out the ratio for your colours, tells you which WCAG levels they pass, suggests the nearest colours that do pass, shows them as people with each colour vision deficiency would roughly see them, and scores how easy your text is to read.

To see how the same colours look with colour blindness, use the [[colour-vision-simulator]].

## How to use it

1. Enter the **text colour** and the **background** as a hex code (#1a2b3c or the short #abc) or rgb(26, 43, 60), or use the colour pickers. **Swap** exchanges them.
2. Read the **contrast** and the results table:
   - **AA, normal text**: at least 4.5:1 (WCAG 1.4.3). The usual legal and policy target.
   - **AA, large text**: at least 3:1. Large means 24 px (18 pt) or more, or 18.7 px (14 pt) bold or more.
   - **AAA, normal text**: at least 7:1, and **AAA, large text**: at least 4.5:1 (WCAG 1.4.6), the stricter level.
   - **AA, buttons, icons and graphics**: at least 3:1 against what is next to them (WCAG 1.4.11), for input borders, icons and chart parts.
3. If a level fails, **Nearest colours that pass** lists a text colour and a background colour that reach AA and AAA, keeping the hue and saturation and changing the lightness as little as possible. Press **Use** to try one.
4. **How it looks with colour vision deficiency** shows your pair with protanopia, deuteranopia, tritanopia and achromatopsia, with the contrast of the simulated colours.
5. Paste text under **Readability** to get the Flesch reading ease and the Flesch-Kincaid grade.
6. **Download** everything as a PNG, PDF or Word report.

## The formulas

Each colour's **relative luminance** is L = 0.2126 R + 0.7152 G + 0.0722 B, where R, G and B are the colour's channels turned into linear light by the sRGB formula. The **contrast ratio** is (L of the lighter + 0.05) / (L of the darker + 0.05). WCAG says not to round: 4.499:1 fails 4.5:1. So the page cuts the ratio to two decimals rather than rounding it up.

**Flesch reading ease** = 206.835 − 1.015 × (words per sentence) − 84.6 × (syllables per word). Higher is easier: 60 to 70 is plain English, above 80 is easy, below 30 is very difficult. **Flesch-Kincaid grade** = 0.39 × (words per sentence) + 11.8 × (syllables per word) − 15.59, roughly the US school grade needed to follow the text. Both use only sentence length and word length. They say nothing about meaning, order or design, and work for English only. Syllables are counted with a spelling rule, so a few words will be off by one.

## Worked example

The page opens with grey text **#777777** on white. The contrast is **4.47:1** (4.478 before cutting), so it fails AA for normal text by a whisker but passes AA for large text and for buttons and icons. The nearest text colour for AA is **#767676**, one step darker, at 4.54:1. For AAA it is **#595959** at 7.00:1. Changing the background instead would need a near-black **#060606**, because white cannot get any lighter. Grey has no hue, so the colour vision previews all keep about 4.47:1.

The sample instructions in the readability box have 48 words in 5 sentences and 67 syllables: a reading ease of **79.0** (fairly easy) and a grade of **4.6**.

## Tips

- Aim for 4.5:1 for all body text, even large text, if you can. It costs little and helps many readers.
- Colour vision deficiency hardly changes contrast, but it can make two different colours look the same. Don't use colour alone to carry meaning: add labels, icons or patterns. The colour vision simulator checks whole images.
- Short sentences and common words raise the reading ease more than anything else.

## FAQ

**Which WCAG version does it follow?** The 2.x contrast formula (2.0, 2.1 and 2.2 share it). WCAG 3 is still a draft with a different method.

**Does it handle transparent colours?** No. Work out the solid colour you actually see first, then check that.

**Is my text sent anywhere?** No. Everything is worked out in this page.
