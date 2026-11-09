---
name: Oxygen dissociation curve
num: 1130
shelf: learn
section: school-biology
title: "Oxygen dissociation curve: haemoglobin, the Bohr shift with CO₂, pH and temperature, and lung volumes"
summary: "Slide the oxygen level and watch haemoglobin load and unload along the S-shaped curve. Change pH, carbon dioxide and temperature to see the Bohr shift, compare fetal haemoglobin, and draw a spirogram of tidal volume, vital capacity and total lung capacity."
status: live
ads: false
order: 1130
icon: curve
works: offline
updated: 2026-11-09
related: [cardiac-cycle, acid-base-interpreter, respirometry-calculator, vo2max-estimator]
sources:
  - "Standard curve: Severinghaus JW (1979), Simple, accurate equations for human blood O2 dissociation computations, Journal of Applied Physiology 46: 599-602, with his correction for pH, temperature and PCO2. Checked in the tests against a separate Python version."
  - "Oxygen content = 1.34 × Hb × saturation + 0.003 × PO2 is a standard physiology formula; Hb 15 g/dL is a typical round value. The fetal P50 of about 19 mmHg is an approximate teaching value."
  - "Lung volumes are typical round adult values as quoted in school books; you can type your own. Not for judging anyone's health. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "PO₂" }
  - { icon: curve, label: "Curve" }
  - { icon: chart, label: "Lungs" }
  - { icon: check, label: "Check" }
---

## What it does

Red blood cells carry oxygen bound to **haemoglobin**. Each haemoglobin has four places for oxygen. How full it is (its **saturation**) depends on how much oxygen is around it, measured as the partial pressure **PO₂**. Plotting saturation against PO₂ gives an S-shaped **oxygen dissociation curve**: haemoglobin fills up easily in the lungs (about 100 mmHg) and lets oxygen go quickly once PO₂ drops in the tissues (about 40 mmHg at rest, lower in working muscle).

- **Slide PO₂** and see the saturation and a picture of one haemoglobin with its four sites.
- **Change the conditions.** More carbon dioxide, more acid (lower pH) and warmth, as in working muscle, move the curve **right**: haemoglobin holds oxygen less tightly and gives more to the tissues. This is the **Bohr effect**. Cool, alkaline blood with little CO₂ moves it left.
- **Fetal haemoglobin** holds oxygen more tightly than an adult's, so a baby can take oxygen from its mother's blood.
- **Lung volumes**: type tidal volume, the reserves and the residual volume to draw a **spirogram** and work out the vital capacity, total lung capacity and the air breathed each minute.

It fits **Class 11 Biology: breathing and exchange of gases** (respiratory volumes and capacities, transport of oxygen, the dissociation curve and the factors that shift it). It is a teaching model. The heart that moves this blood is in [[cardiac-cycle]]; blood pH and CO₂ are read in [[acid-base-interpreter]]; oxygen use is measured with [[respirometry-calculator]] and [[vo2max-estimator]].

## How to use it

1. **Slide PO₂** from 0 to 120 mmHg. The label says when you are near lung or tissue values.
2. **Pick conditions**: *Normal blood*, *Working muscle* (pH 7.2, CO₂ 60 mmHg, 39 °C) or *Cold, low CO₂*, or move the pH, CO₂ and temperature sliders yourself. The dashed line keeps the normal curve for comparison.
3. **Read the facts**: P50 (the PO₂ where haemoglobin is half full), saturation in the lungs and tissues, and how much oxygen is given up per 100 mL of blood.
4. **Lung volumes**: change any value; the spirogram shows two quiet breaths, the deepest breath in and out, then quiet breathing.
5. Download both graphs and the numbers as an image, PDF or Word file. **Check yourself** gives fresh questions every time.

## Worked example

At normal conditions and PO₂ 40 mmHg the page shows **75 % saturated**. In the lungs (100 mmHg) it is 97.7 %, so the blood gives up 22.8 % of its load, about 4.8 mL of oxygen per 100 mL of blood. Press **Working muscle**: P50 rises from 26.9 to **37.0 mmHg**, the curve moves right by 10.1 mmHg, and at 40 mmHg haemoglobin is only 55.3 % full, so it gives up 42.5 % of its load, nearly twice as much. For the lungs, with tidal volume 500 mL, inspiratory reserve 2750 mL and expiratory reserve 1050 mL, the vital capacity is 1050 + 500 + 2750 = **4300 mL**, and with 1150 mL residual volume the total lung capacity is **5450 mL**.

## FAQ

**Why is the curve S-shaped?** When one oxygen binds, haemoglobin changes shape and the next ones bind more easily (cooperative binding). So the middle of the curve is steep, just where tissue PO₂ lies.

**Why can't you breathe out the residual volume?** The lungs and airways never collapse completely; that air stays to keep gas exchange going between breaths.

**Is this accurate for a real person?** It follows a well-known equation for average adult blood, but people differ, and it is not a medical tool.
