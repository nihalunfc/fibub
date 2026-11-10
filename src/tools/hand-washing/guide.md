---
name: Hand washing
num: 1481
shelf: learn
code: L312
section: school-biology
title: "Hand washing: how many germs are left after 5, 10 or 20 seconds, with and without soap"
summary: "Slide the washing time and tick soap on or off to see how fast germs are removed from your hands. A teaching model that shows why 20 seconds matters, with made-up rates."
status: live
ads: false
order: 1481
icon: curve
works: offline
updated: 2026-11-10
related: [microbe-growth, infection-spread-sim]
sources:
  - "Exponential removal, N = N₀ e^(−kt), half-life = ln 2 ÷ k: standard school maths. The removal rates (0.04 per second for water, 0.15 per second for soap) are rounded, made-up values for teaching, not measurements. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Soap" }
  - { icon: clock, label: "Time" }
  - { icon: curve, label: "Germs" }
  - { icon: check, label: "Check" }
---

## What it does

Our hands pick up germs all day, and washing takes them off. This page is a **teaching model** of that: every second of washing removes the same fraction of the germs still on your hands, so the count falls fast at first and then more slowly. The graph shows two lines, water only and soap, and a dot shows where you are at the chosen time. At 0 seconds the count is still the starting number, because nothing has been washed off yet.

It follows the Class 8 Science idea that microorganisms spread disease and that simple habits such as washing hands keep us healthy. To see how germs multiply when they are left alone, try [[microbe-growth]], and to see how an illness moves through a crowd, open [[infection-spread-sim]].

## How to use it

1. Tick or untick **Use soap**.
2. Slide **Washing time** from 0 to 40 seconds.
3. Read how many germs are left and what percentage of the start that is.
4. Press a button for a quick comparison, such as Soap, 20 s.

## What each setting does

- **Use soap**: soap lifts germs off the skin, so they are removed about three to four times faster than with water alone.
- **Washing time**: how long you scrub, in seconds.
- **Germs at the start**: only changes the size of the numbers. The percentage left stays the same.

## Worked example

Start with 1 million germs and wash with soap for 20 seconds. In this model k = 0.15 per second, so N = 1,000,000 × e^(−0.15 × 20) = 1,000,000 × e^(−3), which is about 50,000 germs, or 5 per cent. With water only, k = 0.04, and 20 seconds leaves about 45 per cent.

## FAQs

**Why 20 seconds?** In this model that is when soap has removed about 95 per cent of the germs; a quick 5 second splash removes only about half.

**Does the count ever reach zero?** The model never reaches exactly zero, it just gets very small. Real washing also depends on rubbing, nails and drying.

**Are the numbers real?** No. They are rounded teaching values, not measurements of any real soap or germ.
