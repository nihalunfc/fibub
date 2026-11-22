---
title: 'Charts everyone can read: colour blindness and accessibility'
seoTitle: 'Colour-blind friendly charts and accessible data visuals'
summary: About 1 in 12 men can't easily tell red from green. How to make charts readable for colour-blind readers, on a printout and with a screen reader, with a live colour-vision simulator.
minutes: 11
updated: 2026-11-22
quiz:
  - q: Which colour pair is most often confused by colour-blind readers?
    choices: ['Blue and orange', 'Red and green', 'Black and white']
    ans: 1
    why: Red-green deficiencies are by far the most common.
  - q: What is the most reliable fix for colour-blind readers?
    choices: ['Brighter colours', 'Never relying on colour alone: add labels, symbols or position', 'Using only red']
    ans: 1
    why: If the label or arrow carries the meaning, colour becomes a bonus, not a requirement.
  - q: What is the minimum contrast for normal text in WCAG AA?
    choices: ['2:1', '4.5:1', '10:1']
    ans: 1
    why: WCAG 2 AA asks 4.5:1 for normal text and 3:1 for large text and chart graphics.
---

**Module 3 · about 11 minutes · read first: 3.2.** You'll be able to check a chart for colour-blind readers and fix it.

## 1. Why this matters

About 8 % of men and 0.5 % of women of Northern European descent have some colour-vision deficiency, most often red-green. In a room of 25 managers, one or two may not see your red/green status colours. Add printing in black and white, projectors that wash out colour, and screen readers, and accessible charts stop being a nice-to-have.

## 2. The idea in one picture

Choose **Red and green**, then set **Seen as** to *Deuteranopia*. Then try **Colour-blind safe** and **Grey plus one colour** under the same setting.

<!--fig:colour-vision-->

## 3. A checklist

1. **Never rely on colour alone.** Label lines at their ends, add ▲▼ or +/− to changes, write "above target" in words.
2. **Use a colour-blind-safe palette** such as Okabe-Ito (blue, orange, bluish green, reddish purple...). Blue and orange is the safest pair for good/bad.
3. **Vary lightness, not just hue.** Two colours of the same lightness turn into the same grey when printed.
4. **Contrast:** text at least 4.5:1 against its background, chart lines and bars at least 3:1 (WCAG 2.1 AA).
5. **Size:** no text under about 12 px on screen; bigger on slides.
6. **Alt text and a sentence:** give each chart a text description (Power BI: Alt text in the Format pane) that states the point, not just "a bar chart".
7. **Test it:** use a simulator like the one above, or print in greyscale.

<details class="maths" open><summary>Principle</summary>

**Principle:** most colour-vision deficiency comes from one of the three types of cone cells in the eye being missing or shifted. With a weak green (deuteranopia) or red (protanopia) cone, reds and greens give almost the same signal, so they look like similar browns or yellows.

**How the simulator works:** each colour is converted to linear light, multiplied by a 3 × 3 matrix that models the missing cone (Machado, Oliveira and Fernandes, 2009), then converted back. Greyscale uses the standard luminance weights 0.2126 R + 0.7152 G + 0.0722 B.
</details>

## 4. Worked example

*A store table colours "vs target" cells green (above) and red (below).* Under deuteranopia, Forks Market's red −0.4 % looks almost like the greens. Fixes: add "+" and "−" signs and ▲▼ arrows; switch to blue (above) and orange (below); make the below-target text bold. Now it works in any vision and in print.

## 5. Practice

1. Two lines are dark blue and dark purple. What happens when printed in greyscale?
2. Write alt text for the weekday chart in Lesson 3.2.
3. A dashboard uses traffic-light circles (red, amber, green) for status. Suggest two changes.

<details><summary>Answers</summary>

1. They become nearly the same dark grey. Make one light and one dark, or label them.
2. For example: "Column chart of sales by weekday over 2024-2025. Saturday and Sunday are highest at about $82k and $86k; weekdays are $56k to $63k. Weekends bring over a third of sales."
3. Add a symbol or word in each (✓, !, ✕ or "On track", "At risk", "Off track"), and use a safe palette (blue, orange, dark red) with different lightness.
</details>

Next, Lesson 3.4: titles that say the point.
